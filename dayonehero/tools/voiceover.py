"""Turns an episode's script.md into one narration file with Kokoro text-to-speech.

It speaks the NARRATOR:, DEX: and MUM: lines, shot by shot, and writes
  voiceover/voiceover.wav   the whole soundtrack of voices
  voiceover/timings.json    when every shot and every line starts and ends
The animation is timed from timings.json, so changing a line and running this
again re-times the whole episode.

Run from the dayonehero folder:
  .venv/bin/python tools/voiceover.py episodes/day05
  .venv/bin/python tools/voiceover.py episodes/day05 --dry-run   only list the lines
"""

import argparse
import json
import re
from pathlib import Path

import numpy as np

RATE = 24_000  # Kokoro's sample rate

# Who speaks with which Kokoro voice. British voices, because the show says "Mum".
VOICES = {
    # Day 4's narrator matched Kokoro's "Heart" voice (af_heart) most closely,
    # at a little under normal speed. Characters are not voiced: their lines are on screen.
    "NARRATOR": {"voice": "af_heart", "speed": 0.95, "pitch": 1.0, "lang": "en-us"},
    "MUM": {"voice": "bf_isabella", "speed": 0.95, "pitch": 1.0, "lang": "en-gb"},
    "DEX": {"voice": "bm_lewis", "speed": 0.78, "pitch": 1.45, "lang": "en-gb"},
}

GAP_LINE = 0.5  # silence between one line and the next
SHOT_EDGE = 0.35  # silence at the start of a shot that has lines


def read_script(path: Path):
    shots = []
    current = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        m = re.fullmatch(r"###\s+(\S+)", line)
        if m:
            current = {"id": m.group(1), "items": []}
            shots.append(current)
            continue
        if current is None or not line or line.startswith("*"):
            continue
        m = re.fullmatch(r"\[(hold|pause)\s+([\d.]+)\]", line)
        if m:
            current["items"].append({"kind": m.group(1), "seconds": float(m.group(2))})
            continue
        m = re.fullmatch(r"(NARRATOR|DEX|MUM):\s*(.+)", line)
        if m:
            current["items"].append({"kind": "line", "who": m.group(1), "text": m.group(2).strip()})
    return shots


def pitch_up(audio: np.ndarray, factor: float) -> np.ndarray:
    """Plays the audio faster by `factor`, which raises the pitch (a chipmunk voice)."""
    if factor == 1.0:
        return audio
    n = int(len(audio) / factor)
    return np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("episode", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    shots = read_script(args.episode / "script.md")
    if args.dry_run:
        for s in shots:
            print(f"### {s['id']}")
            for it in s["items"]:
                print("   ", it)
        return

    import soundfile as sf
    from kokoro_onnx import Kokoro

    models = Path(__file__).parent / "models"
    kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))

    pieces = []
    t = 0.0

    def silence(seconds):
        nonlocal t
        pieces.append(np.zeros(int(seconds * RATE), dtype=np.float32))
        t += seconds

    out = []
    for s in shots:
        start = t
        lines = []
        spoken = [it for it in s["items"] if it["kind"] == "line"]
        if spoken:
            silence(SHOT_EDGE)
        first = True
        for it in s["items"]:
            if it["kind"] in ("hold", "pause"):
                silence(it["seconds"])
                continue
            if not first:
                silence(GAP_LINE)
            first = False
            v = VOICES[it["who"]]
            audio, rate = kokoro.create(it["text"], voice=v["voice"], speed=v["speed"], lang=v["lang"])
            assert rate == RATE
            audio = pitch_up(np.asarray(audio, dtype=np.float32), v["pitch"])
            # Trim Kokoro's own leading and trailing quiet.
            loud = np.where(np.abs(audio) > 0.01)[0]
            if len(loud):
                audio = audio[max(0, loud[0] - 600): loud[-1] + 2400]
            a = t
            pieces.append(audio)
            t += len(audio) / RATE
            lines.append({"who": it["who"], "text": it["text"], "start": round(a, 3), "end": round(t, 3)})
            print(f"{s['id']:>10}  {it['who']:<8} {t - a:5.2f}s  {it['text']}")
        out.append({"id": s["id"], "start": round(start, 3), "end": round(t, 3), "lines": lines})

    audio = np.concatenate(pieces)
    peak = np.max(np.abs(audio))
    audio = audio / peak * 0.89
    vo = args.episode / "voiceover"
    vo.mkdir(exist_ok=True)
    sf.write(vo / "voiceover.wav", audio, RATE)
    (vo / "timings.json").write_text(json.dumps({"seconds": round(t, 3), "shots": out}, indent=1))
    print(f"total {t:.1f} s ({int(t // 60)}:{t % 60:04.1f})")


if __name__ == "__main__":
    main()
