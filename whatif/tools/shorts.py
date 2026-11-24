"""Cuts vertical 1080x1920 clips for TikTok, YouTube Shorts and Instagram Reels
out of the finished episodes, with word-by-word captions and a hook title.

Clips are listed in shorts/clips.json. Each clip is cut from
episodes/epXX/renders/epXX.mp4 (picture, music and voice as the viewer heard them).

Captions come from the script lines in voiceover/timings.json. That file only
times whole lines, so the words inside a line are timed from the narration
itself: Kokoro pauses at commas and full stops, and those pauses are found in
voiceover.wav and matched to the punctuation. Words between two pauses share the
time by length.

Run from the whatif folder:
  .venv/bin/python tools/shorts.py                 every clip
  .venv/bin/python tools/shorts.py ep07-ambergris  one clip (or several ids)
  .venv/bin/python tools/shorts.py --ass-only      only write the caption files
Output: shorts/out/<id>.mp4
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
W, H = 1080, 1920
ACTIVE_Y_EP, ACTIVE_H_EP = 138, 804  # the 3D episodes are letterboxed: picture rows 138..942 (documentaries use the full frame)
DEFAULT_CROP = 1440  # how much of the 1920-wide picture a vertical clip keeps (cut per shot in clips.json)
FG_CY = 960  # centre line of the picture in the vertical frame
CAP_Y = 1420  # caption centre
HOOK_Y = 330  # top of the hook title
END_CARD = 3.2  # seconds of "full episode" card at the end
YELLOW = "&H3AD2FF&"  # #FFD23A in ASS's BGR order
WHITE = "&HFFFFFF&"
FONT = "Fredoka Light"  # family name inside Fredoka-Bold.ttf (it is the Bold weight)


# ---------- word timing ----------

def find_pauses(audio, sr, a, b, min_len=0.07):
    """Quiet stretches inside [a, b] seconds, as (start, end) pairs."""
    seg = audio[int(a * sr): int(b * sr)]
    hop = int(0.01 * sr)
    n = len(seg) // hop
    if n == 0:
        return []
    rms = np.sqrt(np.mean(seg[: n * hop].reshape(n, hop) ** 2, axis=1))
    thresh = max(0.004, 0.06 * np.percentile(rms, 95))
    quiet = rms < thresh
    pauses, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            if (j - i) * 0.01 >= min_len and i > 0 and j < n:
                pauses.append((a + i * 0.01, a + j * 0.01))
            i = j
        else:
            i += 1
    return pauses


def weight(word):
    return len(re.sub(r"[^\w]", "", word)) + 1.5


def time_line(text, a, b, audio, sr):
    """Gives every word of one narration line a start and end time."""
    words = text.split()
    pauses = find_pauses(audio, sr, a, b)
    talk = sum(pe - ps for ps, pe in pauses)
    speech = max(0.1, (b - a) - talk)
    wts = [weight(w) for w in words]
    total = sum(wts)

    # Where each punctuation break would fall if speech were spread evenly.
    def speech_to_time(frac):
        target = frac * speech
        t, acc = a, 0.0
        for ps, pe in pauses:
            chunk = ps - t
            if acc + chunk >= target:
                return t + (target - acc)
            acc += chunk
            t = pe
        return t + (target - acc)

    breaks = []  # (word index after which the break falls, pause)
    used = set()
    cum = 0.0
    last_t = a
    for i, w in enumerate(words[:-1]):
        cum += wts[i]
        if re.search(r"[,.?!;:]$", w):
            guess = speech_to_time(cum / total)
            best = None
            for k, (ps, pe) in enumerate(pauses):
                if k in used or ps < last_t:
                    continue
                d = abs((ps + pe) / 2 - guess)
                if d < 0.9 and (best is None or d < best[0]):
                    best = (d, k)
            if best:
                used.add(best[1])
                ps, pe = pauses[best[1]]
                breaks.append((i, ps, pe))
                last_t = pe

    # Split the line into phrases at the matched pauses and spread words by length.
    out = []
    bounds = [(-1, a, a)] + breaks + [(len(words) - 1, b, b)]
    for (i0, _, s), (i1, e, _) in zip(bounds, bounds[1:]):
        ws = list(range(i0 + 1, i1 + 1))
        if not ws:
            continue
        tot = sum(wts[j] for j in ws)
        t = s
        for j in ws:
            d = (e - s) * wts[j] / tot
            out.append((words[j], t, t + d))
            t += d
    return out


DOCS = {"doc01": "docs/ep01-why-florida", "case001": "docs/case001-the-reaping"}  # documentary narration folders (repo root)


def doc_words(ep):
    d = json.loads((ROOT / f"public/{ep}/vo/timings.json").read_text())
    audio, sr = sf.read(ROOT / f"public/{ep}/vo/vo.wav", dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    paras = [x.strip() for x in (ROOT.parent / DOCS[ep] / "narration.txt").read_text().split("\n\n") if x.strip()]
    words = []
    for para, t in zip(paras, d["paras"]):
        words += time_line(para, t["start"], t["end"], audio, sr)
    return words


def episode_words(ep):
    if ep in DOCS:
        return doc_words(ep)
    d = json.loads((ROOT / f"episodes/ep{ep}/voiceover/timings.json").read_text())
    audio, sr = sf.read(ROOT / f"episodes/ep{ep}/voiceover/voiceover.wav", dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    words = []
    for shot in d["shots"]:
        for line in shot["lines"]:
            words += time_line(line["text"], line["start"], line["end"], audio, sr)
    return words


# ---------- captions ----------

def ass_time(t):
    t = max(0.0, t)
    h = int(t // 3600)
    m = int(t % 3600 // 60)
    s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def clean(word):
    w = word.upper().replace("’", "'")
    w = re.sub(r"[,.;:]+$", "", w)
    w = w.strip('"“”')
    return w


def chunks(words):
    """Groups words into short caption cards: up to 3 words, broken at punctuation."""
    out, cur = [], []
    for w in words:
        cur.append(w)
        text = " ".join(clean(x[0]) for x in cur)
        if len(cur) >= 3 or len(text) >= 15 or re.search(r"[,.?!;:]$", w[0]):
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


def hook_size(lines):
    longest = max(len(x) for x in lines)
    return int(min(92, 1010 / (0.6 * longest)))


def write_ass(clip, words, path):
    a, b = clip["start"], clip["end"]
    dur = b - a
    inside = [(w, s - a, e - a) for (w, s, e) in words if s >= a - 0.05 and e <= b + 0.05]
    ev = []

    hook = clip["hook"]
    hs = hook_size(hook)
    hook_txt = f"{{\\c{WHITE}}}{hook[0]}\\N{{\\c{YELLOW}}}{hook[1]}"
    ev.append(("Hook", 0.0, dur - END_CARD, f"{{\\fad(0,200)}}{hook_txt}"))
    ev.append(("Hook", dur - END_CARD, dur + 1,
               (f"{{\\fad(200,0)\\fs{hs}}}FULL CASE FILE\\N{{\\c{YELLOW}}}ON YOUTUBE" if clip["ep"].startswith("case") else f"{{\\fad(200,0)\\fs{hs}}}FULL EPISODE\\N{{\\c{YELLOW}}}ON YOUTUBE")))
    channel = "Fiction Files · @FictionFilesHQ" if clip["ep"].startswith("case") else "Hypothetical You"
    ev.append(("Small", dur - END_CARD, dur + 1, "{\\fad(200,0)}" + channel))

    cards = chunks(inside)
    for ci, card in enumerate(cards):
        start = card[0][1]
        nxt = cards[ci + 1][0][1] if ci + 1 < len(cards) else dur
        end = min(card[-1][2] + 0.3, nxt)
        if ci + 1 < len(cards) and nxt - card[-1][2] < 0.45:
            end = nxt
        for wi, (w, s, e) in enumerate(card):
            ws = start if wi == 0 else s
            we = card[wi + 1][1] if wi + 1 < len(card) else end
            if we <= ws:
                continue
            parts = []
            for k, (x, _, _) in enumerate(card):
                col = YELLOW if k == wi else WHITE
                parts.append(f"{{\\c{col}}}{clean(x)}")
            pop = "{\\fscx88\\fscy88\\t(0,90,\\fscx100\\fscy100)}" if wi == 0 else ""
            ev.append(("Cap", ws, we, pop + " ".join(parts)))

    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,{FONT},{hs},&H00FFFFFF,&H00FFFFFF,&H00140F1A,&H80000000,-1,0,0,0,100,100,1,0,1,7,4,8,40,40,{HOOK_Y},1
Style: Cap,{FONT},86,&H00FFFFFF,&H00FFFFFF,&H00140F1A,&H80000000,-1,0,0,0,100,100,1,0,1,8,4,5,60,60,0,1
Style: Small,{FONT},52,&H00FFFFFF,&H00FFFFFF,&H00140F1A,&H80000000,-1,0,0,0,100,100,1,0,1,5,3,8,40,40,{HOOK_Y + 2 * hs + 60},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for style, s, e, text in ev:
        pos = f"{{\\an5\\pos({W // 2},{CAP_Y})}}" if style == "Cap" else ""
        lines.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},{style},,0,0,0,,{pos}{text}")
    path.write_text(head + "\n".join(lines) + "\n", encoding="utf-8")


# ---------- picture ----------

def crop_segments(clip):
    """[(from, to, width, cx)] in clip-relative seconds."""
    a, b = clip["start"], clip["end"]
    marks = clip.get("crop") or []
    pts = [(a, DEFAULT_CROP, 960)] + [(m[0], m[1], m[2] if len(m) > 2 else 960) for m in marks]
    pts.sort(key=lambda p: p[0])  # stable: a mark at the clip start replaces the default
    segs = []
    for i, (t, w, cx) in enumerate(pts):
        t1 = pts[i + 1][0] if i + 1 < len(pts) else b
        t0 = max(t, a)
        if t1 > t0:
            segs.append((t0 - a, t1 - a, w, cx))
    return segs


def render(clip, ass_path, out):
    a, b = clip["start"], clip["end"]
    dur = b - a
    ep = clip["ep"]
    src = ROOT / (f"renders/{ep}/{ep}.mp4" if ep in DOCS else f"episodes/ep{ep}/renders/ep{ep}.mp4")
    ACTIVE_Y, ACTIVE_H = (0, 1080) if ep in DOCS else (ACTIVE_Y_EP, ACTIVE_H_EP)
    segs = crop_segments(clip)
    n = len(segs)
    f = [f"[0:v]crop=1920:{ACTIVE_H}:0:{ACTIVE_Y},setsar=1,split={n}" + "".join(f"[s{i}]" for i in range(n))]
    for i, (t0, t1, cw, cx) in enumerate(segs):
        x = int(min(1920 - cw, max(0, cx - cw / 2)))
        fh = int(round(ACTIVE_H * W / cw / 2) * 2)
        y = FG_CY - fh // 2
        f.append(f"[s{i}]trim={t0:.3f}:{t1:.3f},setpts=PTS-STARTPTS,split[p{i}][q{i}]")
        # Background: the same picture, blown up, blurred and darkened.
        f.append(f"[p{i}]crop=452:{ACTIVE_H}:734:0,scale=270:480,gblur=sigma=26,scale={W}:{H},"
                 f"eq=brightness=-0.24:saturation=1.1[bg{i}]")
        f.append(f"[q{i}]crop={cw}:{ACTIVE_H}:{x}:0,scale={W}:{fh}[fg{i}]")
        f.append(f"[bg{i}][fg{i}]overlay=0:{y}[v{i}]")
    f.append("".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[cat]")
    fonts = ROOT / "shorts/fonts"
    f.append(f"[cat]ass={ass_path}:fontsdir={fonts},format=yuv420p[vout]")
    f.append(f"[0:a]afade=t=in:d=0.15,afade=t=out:st={dur - 0.6:.3f}:d=0.6[aout]")
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{dur:.3f}", "-i", str(src),
           "-filter_complex", ";".join(f), "-map", "[vout]", "-map", "[aout]",
           "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)


def main():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("ids", nargs="*")
    p.add_argument("--ass-only", action="store_true")
    args = p.parse_args()
    clips = json.loads((ROOT / "shorts/clips.json").read_text())["clips"]
    if args.ids:
        clips = [c for c in clips if c["id"] in args.ids]
    (ROOT / "shorts/out").mkdir(parents=True, exist_ok=True)
    (ROOT / "shorts/captions").mkdir(parents=True, exist_ok=True)
    cache = {}
    for c in clips:
        if c["ep"] not in cache:
            cache[c["ep"]] = episode_words(c["ep"])
        ass = ROOT / f"shorts/captions/{c['id']}.ass"
        write_ass(c, cache[c["ep"]], ass)
        if args.ass_only:
            print("wrote", ass)
            continue
        out = ROOT / f"shorts/out/{c['id']}.mp4"
        render(c, ass, out)
        print("wrote", out, flush=True)


if __name__ == "__main__":
    main()
