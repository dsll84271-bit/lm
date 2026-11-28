"""Cleans and paces a narration recorded elsewhere (e.g. CapCut text to speech).

1. Lines up every script word with the recording (Whisper segments + difflib).
2. Re-times the pauses: sentence gaps, paragraph gaps, chapter gaps and dramatic beats.
3. Polishes the voice (high-pass, warmth, presence, de-ess, compression, loudness).
4. Writes vo.wav and timings.json (when every paragraph starts and ends).

  .venv/bin/python tools/doc_vo.py <episode dir> <raw.wav> <segments.txt> <out dir>
"""
import difflib, json, re, subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf

ep, raw_path, seg_path, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4])
cfg = json.loads((ep / "pacing.json").read_text())
paras = [p.strip() for p in (ep / "narration.txt").read_text().split("\n\n") if p.strip()]

NUM = {"1894": "eighteen ninety four", "1896": "eighteen ninety six", "1920s": "nineteen twenties", "1926": "nineteen twenty six",
       "1930s": "nineteen thirties", "1970s": "nineteen seventies", "1979": "nineteen seventy nine", "1980s": "nineteen eighties",
       "1947": "nineteen forty seven", "2017": "twenty seventeen", "1980": "nineteen eighty", "1981": "nineteen eighty one",
       "1983": "nineteen eighty three", "1984": "nineteen eighty four", "2002": "two thousand two", "1900": "nineteen hundred",
       "2020": "twenty twenty", "2014": "twenty fourteen", "2060": "twenty sixty", "2050": "twenty fifty", "372": "three hundred seventy two",
       "800": "eight hundred", "6": "six", "18th": "eighteenth"}
NUM.update(cfg.get("num", {}))  # per-episode spoken forms of numbers


def norm(s):
    s = s.lower().replace("’", "'")
    toks = re.findall(r"[a-z0-9']+", s)
    res = []
    for t in toks:
        res += NUM.get(t, t).split()
    return res


# script words with their paragraph index
sw, sp = [], []
for i, p in enumerate(paras):
    w = norm(p)
    sw += w
    sp += [i] * len(w)

# ASR words with interpolated times
aw, at = [], []
for line in seg_path.read_text().splitlines():
    m = re.match(r"\s*([\d.]+)\s+([\d.]+)\s+(.*)", line)
    if not m:
        continue
    a, b, txt = float(m[1]), float(m[2]), m[3]
    w = norm(txt)
    if not w:
        continue
    lens = np.array([len(x) + 1 for x in w], float)
    edges = a + (b - a) * np.concatenate([[0], np.cumsum(lens)]) / lens.sum()
    for k, x in enumerate(w):
        aw.append(x)
        at.append((edges[k], edges[k + 1]))

sm = difflib.SequenceMatcher(None, sw, aw, autojunk=False)
st = [None] * len(sw)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        st[blk.a + k] = at[blk.b + k]
known = [i for i, v in enumerate(st) if v]
print(f"matched {len(known)}/{len(sw)} script words ({100 * len(known) / len(sw):.0f}%)")
for i in range(len(st)):  # fill gaps by interpolation
    if st[i] is None:
        prev = max([k for k in known if k < i], default=None)
        nxt = min([k for k in known if k > i], default=None)
        if prev is None:
            st[i] = (st[nxt][0], st[nxt][0])
        elif nxt is None:
            st[i] = (st[prev][1], st[prev][1])
        else:
            fr = (i - prev) / (nxt - prev)
            tt = st[prev][1] + fr * (st[nxt][0] - st[prev][1])
            st[i] = (tt, tt)

audio, sr = sf.read(raw_path)
if audio.ndim == 2:
    audio = audio.mean(1)

# silences (speech gaps) from the energy envelope
hop = int(0.01 * sr)
rms = np.sqrt(np.convolve(audio ** 2, np.ones(hop) / hop, "same")[::hop] + 1e-12)
db = 20 * np.log10(rms + 1e-9)
quiet = db < -42
sil = []
i = 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j < len(quiet) and quiet[j]:
            j += 1
        if (j - i) * 0.01 >= 0.1:
            sil.append([i * 0.01, j * 0.01])
        i = j
    else:
        i += 1

# paragraph boundary times: the silence nearest to the end of each paragraph
p_end_word = {}
for idx, p in enumerate(sp):
    p_end_word[p] = idx
bound = {}
for p in range(len(paras) - 1):
    t = (st[p_end_word[p]][1] + st[p_end_word[p] + 1][0]) / 2
    best = min(range(len(sil)), key=lambda k: abs((sil[k][0] + sil[k][1]) / 2 - t))
    bound[best] = p  # silence index -> paragraph that ends there

chapters = set(cfg["chapters"])  # 1-based paragraph numbers that start a chapter
beats = {int(k): v for k, v in cfg.get("beats", {}).items()}  # 1-based paragraph -> pause after it

pieces, gaps = [], []
prev_end = 0.0
lead = cfg.get("lead_in", 0.35)
for k, (a, b) in enumerate(sil):
    if a <= 0.05:  # leading silence
        prev_end = b
        continue
    pieces.append((prev_end, a))
    dur = b - a
    if k in bound:
        p1 = bound[k] + 1  # 1-based paragraph that just ended
        g = beats.get(p1, cfg["chapter_gap"] if (p1 + 1) in chapters else cfg["para_gap"])
    elif dur >= 0.26:
        g = cfg["sentence_gap"]
    else:
        g = max(0.1, dur)
    gaps.append(g)
    prev_end = b
if prev_end < len(audio) / sr - 0.05:
    pieces.append((prev_end, len(audio) / sr))
    gaps.append(0)

fade = int(0.008 * sr)
outbuf = [np.zeros(int(lead * sr))]
newt = lead
remap = []  # (old_start, old_end, new_start)
gap_at = {}  # silence index -> (new gap start, new gap end)
sil_idx = [k for k, (a, b) in enumerate(sil) if a > 0.05]
for n_piece, ((a, b), g) in enumerate(zip(pieces, gaps)):
    a0, b0 = max(0, a - 0.03), b + 0.03
    seg = audio[int(a0 * sr): int(b0 * sr)].copy()
    if len(seg) > 2 * fade:
        seg[:fade] *= np.linspace(0, 1, fade)
        seg[-fade:] *= np.linspace(1, 0, fade)
    remap.append((a0, b0, newt))
    outbuf.append(seg)
    newt += len(seg) / sr
    if n_piece < len(sil_idx):
        gap_at[sil_idx[n_piece]] = (newt - 0.03, newt + g + 0.03)
    outbuf.append(np.zeros(int(g * sr)))
    newt += g
outbuf.append(np.zeros(int(cfg.get("tail", 1.0) * sr)))
paced = np.concatenate(outbuf)


def mapt(t):
    for a0, b0, n0 in remap:
        if t <= b0:
            return n0 + max(0.0, t - a0)
    return newt


timings = []
for p in range(len(paras)):
    ws = [i for i, x in enumerate(sp) if x == p]
    timings.append({"n": p + 1, "start": round(mapt(st[ws[0]][0]) - 0.05, 3), "end": round(mapt(st[ws[-1]][1]) + 0.05, 3),
                    "text": paras[p][:60]})
# snap every paragraph boundary to its real pause in the paced audio
for k, p in bound.items():
    g0, g1 = gap_at[k]
    timings[p]["end"] = round(g0, 3)
    timings[p + 1]["start"] = round(g1, 3)
    timings[p]["cut"] = round((g0 + g1) / 2, 3)
timings[-1]["cut"] = round(len(paced) / sr, 3)

out.mkdir(parents=True, exist_ok=True)
tmp = out / "paced.wav"
sf.write(tmp, paced, sr)
chain = ("highpass=f=75,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=420:t=q:w=1.2:g=-2,"
         "equalizer=f=3500:t=q:w=1.5:g=2,equalizer=f=11000:t=h:w=0.7:g=1.5,deesser=i=0.35,"
         "acompressor=threshold=-21dB:ratio=3:attack=8:release=120:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=7")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af", chain, "-ar", "48000", str(out / "vo.wav")], check=True)
tmp.unlink()
(out / "timings.json").write_text(json.dumps({"seconds": round(len(paced) / sr, 3), "paras": timings,
    "words": [[sw[i], round(mapt(st[i][0]), 2), sp[i] + 1] for i in range(len(sw))]}))
print(f"raw {len(audio) / sr:.1f}s -> paced {len(paced) / sr:.1f}s, {len(timings)} paragraphs")
