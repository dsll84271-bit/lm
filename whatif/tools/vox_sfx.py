"""One-shot paper and ink sound effects for the collage style (public/vox/sfx)."""
import runpy
from pathlib import Path

import numpy as np
import soundfile as sf

M = runpy.run_path(str(Path(__file__).with_name("doc_music.py")), run_name="lib")
SR, t_, lp, hp, rng = M["SR"], M["t_"], M["lp_fast"], M["hp_fast"], M["rng"]
OUT = Path(__file__).resolve().parent.parent / "public/vox/sfx"


def save(name, x, peak=0.7):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR)
    print(name, round(len(x) / SR, 2), "s")


def slap(seed):
    """Paper slapped onto a desk: a dry crack with a short low thud."""
    r = np.random.default_rng(seed)
    tt = t_(0.32)
    crack = hp(r.normal(0, 1, len(tt)), 1800) * np.exp(-tt * 70)
    rustle = lp(hp(r.normal(0, 1, len(tt)), 500), 5000) * np.exp(-tt * 22) * 0.35
    thud = np.sin(2 * np.pi * np.cumsum(140 + 80 * np.exp(-tt * 40)) / SR) * np.exp(-tt * 30) * 0.6
    return crack + rustle + thud


def marker(d, seed):
    """Felt marker on paper: band-passed noise with stroke-rate wobble."""
    r = np.random.default_rng(seed)
    tt = t_(d)
    n = hp(lp(r.normal(0, 1, len(tt)), 6500), 1400)
    strokes = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * (5.5 + r.uniform(-1, 1)) * tt))
    shape = np.minimum(1, tt / 0.03) * np.minimum(1, (d - tt) / 0.06)
    return n * strokes * shape


def scribble(seed):
    r = np.random.default_rng(seed)
    tt = t_(0.5)
    n = hp(lp(r.normal(0, 1, len(tt)), 7000), 1200)
    return n * np.abs(np.sin(2 * np.pi * 11 * tt)) ** 0.6 * np.minimum(1, (0.5 - tt) / 0.08)


def type_key(seed):
    r = np.random.default_rng(seed)
    tt = t_(0.06)
    x = hp(r.normal(0, 1, len(tt)), 2500) * np.exp(-tt * 150)
    return x + 0.4 * np.sin(2 * np.pi * (1700 + r.uniform(0, 400)) * tt) * np.exp(-tt * 220)


if __name__ == "__main__":
    for i in range(3):
        save(f"slap{i}", slap(10 + i), 0.75)
        save(f"type{i}", type_key(20 + i), 0.5)
    save("marker_s", marker(0.35, 31), 0.35)
    save("marker_l", marker(0.8, 32), 0.35)
    save("scribble", scribble(40), 0.4)
    save("whoosh", M["whoosh"](0.6, 0.4), 0.5)
