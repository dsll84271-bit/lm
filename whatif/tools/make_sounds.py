"""Makes every sound effect and the two music beds from scratch, so they are free to use.

  .venv/bin/python tools/make_sounds.py
Writes public/sfx/*.wav and public/music/{main,tense}.wav.
"""

from pathlib import Path

import numpy as np
import soundfile as sf

R = 44_100
rng = np.random.default_rng(7)
ROOT = Path(__file__).resolve().parent.parent / "public"


def t(s):
    return np.arange(int(s * R)) / R


def save(name, x, folder="sfx", peak=0.85, stereo=False):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    (ROOT / folder).mkdir(parents=True, exist_ok=True)
    sf.write(ROOT / folder / f"{name}.wav", x.astype(np.float32), R)
    print(name, f"{x.shape[0] / R:.2f}s")


def lowpass(x, a):
    """One-pole low-pass, vectorised enough for short sounds."""
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += (x[i] - acc) * a
        y[i] = acc
    return y


def env(n, att=0.005, rel=0.2):
    e = np.ones(n)
    a = max(1, int(att * R))
    r = max(1, int(rel * R))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r) ** 2
    return e


# Finger snap: a sharp click with a short noisy body.
tt = t(0.25)
snap = rng.normal(size=len(tt)) * np.exp(-tt * 70)
snap += 0.6 * np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 90)
save("snap", snap)

# Whoosh.
tt = t(0.7)
save("whoosh", lowpass(rng.normal(size=len(tt)), 0.12) * np.sin(np.pi * tt / 0.7) ** 2, peak=0.6)

# Swish (short whoosh for cuts).
tt = t(0.3)
save("swish", lowpass(rng.normal(size=len(tt)), 0.25) * np.sin(np.pi * tt / 0.3) ** 2, peak=0.45)

# Pop for labels.
tt = t(0.12)
f = 520 + 900 * np.exp(-tt * 40)
save("pop", np.sin(2 * np.pi * np.cumsum(f) / R) * np.exp(-tt * 36), peak=0.6)

# Chime: soft bell.
tt = t(1.4)
ch = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) / k for k, (f, d) in enumerate([(1318, 3), (1975, 4), (2637, 6)], 1))
save("chime", ch, peak=0.5)

# Thud.
tt = t(0.6)
save("thud", np.sin(2 * np.pi * (50 + 70 * np.exp(-tt * 14)) * tt) * np.exp(-tt * 7) + lowpass(rng.normal(size=len(tt)), 0.05) * np.exp(-tt * 18))

# Tyre screech: noisy, wavering high tone.
tt = t(1.6)
f = 1500 + 300 * np.sin(2 * np.pi * 9 * tt)
br = np.sin(2 * np.pi * np.cumsum(f) / R) * 0.6 + lowpass(rng.normal(size=len(tt)), 0.4) * 0.5
save("brakes", br * env(len(tt), 0.02, 0.4), peak=0.55)

# Rain loop (6 s): filtered noise with drops.
tt = t(6.0)
rain = lowpass(rng.normal(size=len(tt)), 0.35) * 0.4
for _ in range(500):
    s = rng.integers(0, len(tt) - 2000)
    rain[s : s + 600] += rng.normal(size=600) * np.exp(-np.arange(600) / 80) * 0.6
save("rain", rain, peak=0.5)

# Crowd cheer.
tt = t(2.2)
crowd = lowpass(rng.normal(size=len(tt)), 0.2) * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * tt)) * np.sin(np.pi * tt / 2.2)
save("crowd", crowd, peak=0.5)

# Sizzle: the air burning a hand.
tt = t(1.0)
save("sizzle", rng.normal(size=len(tt)) * (0.6 + 0.4 * np.sin(2 * np.pi * 40 * tt)) * env(len(tt), 0.01, 0.4), peak=0.45)

# Clock tick.
tt = t(0.08)
save("tick", np.sin(2 * np.pi * 3000 * tt) * np.exp(-tt * 120), peak=0.5)

# Thunder boom.
tt = t(3.0)
save("boom", lowpass(rng.normal(size=len(tt)), 0.02) * np.exp(-tt * 1.2) * (1 + 0.5 * np.sin(2 * np.pi * 2 * tt)), peak=0.8)


# ---------------------------------------------------------------- music
def note(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def pluck(freq, dur, amp, bright=1.0):
    tt = t(dur)
    saw = sum(np.sin(2 * np.pi * freq * k * tt) / k for k in range(1, 7)) * 0.6
    return amp * saw * np.exp(-tt * (6 / bright))


def pad(freqs, dur, amp):
    tt = t(dur)
    x = sum(np.sin(2 * np.pi * f * tt + 0.3 * np.sin(2 * np.pi * 0.2 * tt)) + 0.4 * np.sin(2 * np.pi * f * 2.003 * tt) for f in freqs)
    return amp * x * np.minimum(1, tt / 0.6) * np.minimum(1, (dur - tt) / 0.6)


def kick():
    tt = t(0.35)
    return np.sin(2 * np.pi * (45 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)


def hat():
    tt = t(0.06)
    return rng.normal(size=len(tt)) * np.exp(-tt * 90) * 0.25


# Main bed: 100 bpm, A minor - F - C - G, plucky arpeggio, warm pad, soft kick and hats. 8 bars, loops.
bpm = 100
beat = 60 / bpm
bars = 8
L = int(bars * 4 * beat * R)
mus = np.zeros(L + R * 2)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]] * 2
for b, ch in enumerate(chords):
    s0 = int(b * 4 * beat * R)
    p = pad([note(n) for n in ch], 4 * beat + 0.4, 0.05)
    mus[s0 : s0 + len(p)] += p
    bass = pluck(note(ch[0] - 12), beat * 2, 0.35, bright=0.6)
    mus[s0 : s0 + len(bass)] += bass
    s2 = s0 + int(2 * beat * R)
    mus[s2 : s2 + len(bass)] += bass
    for k in range(8):
        n = ch[[0, 1, 2, 1, 2, 0, 1, 2][k]] + 12
        sk = s0 + int(k * 0.5 * beat * R)
        pk = pluck(note(n), 0.4, 0.14 if k % 2 == 0 else 0.1, bright=1.4)
        mus[sk : sk + len(pk)] += pk
    for q in range(4):
        sq = s0 + int(q * beat * R)
        kk = kick() * 0.5
        mus[sq : sq + len(kk)] += kk
        sh = s0 + int((q + 0.5) * beat * R)
        hh = hat()
        mus[sh : sh + len(hh)] += hh
tail = mus[L:]
mus = mus[:L]
mus[: len(tail)] += tail
save("main", mus, folder="music", peak=0.7)

# Tense bed: a low pulse and a held drone, for the rescue. 8 bars at 100 bpm.
ten = np.zeros(L + R * 2)
for b in range(bars):
    s0 = int(b * 4 * beat * R)
    dr = pad([note(45), note(52)], 4 * beat + 0.4, 0.06)
    ten[s0 : s0 + len(dr)] += dr
    for q in range(4):
        sq = s0 + int(q * beat * R)
        kk = kick() * (0.6 if q % 2 == 0 else 0.35)
        ten[sq : sq + len(kk)] += kk
tail = ten[L:]
ten = ten[:L]
ten[: len(tail)] += tail
save("tense", ten, folder="music", peak=0.6)
print("loop length", bars * 4 * beat, "s")
