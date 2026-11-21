"""Turns an episode's script.md into narration with Kokoro text-to-speech.

It speaks only the plain lines. It skips:
  - everything before the first section heading (the title and production notes)
  - section headings        **Day 1: the rule**
  - picture notes           *Kitchen, early morning.*
  - the "(check)" tags

It saves one audio file per section in the episode's voiceover/ folder, plus
timings.json, which lists when every spoken line starts and ends. The shot
list and the captions are built from that file.

Run from the ifterwards folder:
  .venv/bin/python tools/voiceover.py episodes/ep01            make the audio
  .venv/bin/python tools/voiceover.py episodes/ep01 --dry-run  only list the lines
"""

import argparse
import json
import re
import sys
from pathlib import Path

VOICE = "af_heart"  # Kokoro's "Heart" voice
RATE = 24_000  # Kokoro's sample rate

# Silences, in seconds.
GAP_LINE = 0.55  # between one spoken line and the next
GAP_AFTER_PICTURE_NOTE = 0.5  # extra, when a picture note sits between two lines
GAP_SECTION_EDGE = 0.8  # at the start and end of each section's file


def read_script(path: Path):
    """Returns [{title, slug, lines: [{text, pause_before}]}] for script.md."""
    sections = []
    current = None
    extra = 0.0
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue

        heading = re.fullmatch(r"\*\*(.+?)\*\*", line)
        if heading:
            title = re.sub(r"\s*\(\d+:\d+\)\s*$", "", heading.group(1)).strip()
            slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
            current = {"title": title, "slug": slug, "lines": []}
            sections.append(current)
            extra = 0.0
            continue

        if current is None:
            continue  # the title and production notes above the first heading

        if re.fullmatch(r"\*[^*].*\*", line):
            # A picture note. It is not spoken, but it earns a beat of silence.
            # "Two full seconds of silence" style notes ask for a specific length.
            asked = re.search(r"(\w+) full seconds? of silence", line, re.IGNORECASE)
            words = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5}
            if asked and asked.group(1).lower() in words:
                extra += words[asked.group(1).lower()]
            else:
                extra += GAP_AFTER_PICTURE_NOTE
            continue

        text = re.sub(r"\s*\(check\)", "", line)
        text = re.sub(r"\s{2,}", " ", text).strip()
        if text:
            current["lines"].append({"text": text, "pause_before": min(extra, 5.0)})
            extra = 0.0

    return [s for s in sections if s["lines"]]


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("episode", type=Path, help="episode folder, e.g. episodes/ep01")
    parser.add_argument("--speed", type=float, default=0.9, help="1.0 is Kokoro's normal pace; lower is calmer")
    parser.add_argument("--dry-run", action="store_true", help="list the lines without making audio")
    args = parser.parse_args()

    sections = read_script(args.episode / "script.md")
    words = sum(len(l["text"].split()) for s in sections for l in s["lines"])
    print(f"{len(sections)} sections, {sum(len(s['lines']) for s in sections)} spoken lines, {words} words")

    if args.dry_run:
        for i, s in enumerate(sections, 1):
            print(f"\n[{i:02d}] {s['title']}")
            for l in s["lines"]:
                pause = f"  (+{l['pause_before']:.1f}s silence)" if l["pause_before"] else ""
                print(f"     {l['text']}{pause}")
        return

    import numpy as np
    import soundfile as sf
    from kokoro_onnx import Kokoro

    models = Path(__file__).parent / "models"
    kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    out_dir = args.episode / "voiceover"
    out_dir.mkdir(exist_ok=True)

    def silence(seconds):
        return np.zeros(int(seconds * RATE), dtype=np.float32)

    timings = {"voice": VOICE, "speed": args.speed, "sections": []}
    total = 0.0
    for i, s in enumerate(sections, 1):
        parts = [silence(GAP_SECTION_EDGE)]
        cursor = GAP_SECTION_EDGE
        lines = []
        for n, l in enumerate(s["lines"]):
            gap = l["pause_before"] + (GAP_LINE if n else 0.0)
            parts.append(silence(gap))
            cursor += gap
            samples, rate = kokoro.create(l["text"], voice=VOICE, speed=args.speed, lang="en-us")
            assert rate == RATE, rate
            samples = np.asarray(samples, dtype=np.float32)
            parts.append(samples)
            length = len(samples) / RATE
            lines.append({"text": l["text"], "start": round(cursor, 3), "end": round(cursor + length, 3)})
            cursor += length
        parts.append(silence(GAP_SECTION_EDGE))
        audio = np.concatenate(parts)
        name = f"{i:02d}-{s['slug']}.wav"
        sf.write(out_dir / name, audio, RATE, subtype="PCM_16")
        seconds = len(audio) / RATE
        total += seconds
        timings["sections"].append({"file": name, "title": s["title"], "seconds": round(seconds, 3), "lines": lines})
        print(f"  {name}  {seconds:6.1f} s")
        sys.stdout.flush()

    timings["total_seconds"] = round(total, 3)
    (out_dir / "timings.json").write_text(json.dumps(timings, indent=2), encoding="utf-8")
    print(f"total narration: {int(total // 60)}:{int(total % 60):02d}")


if __name__ == "__main__":
    main()
