"""Makes every sound effect and the music loop for Day One Hero from scratch,
so they are all free to use. Writes sfx/*.wav and music/bed.wav.

  .venv/bin/python tools/make_sounds.py
"""

from pathlib import Path

import numpy as np
import soundfile as sf

R = 44_100
rng = np.random.default_rng(5)
ROOT = Path(__file__).resolve().parent.parent


def t(seconds):
    return np.arange(int(seconds * R)) / R


def env(n, attack=0.005, release=0.2):
    e = np.ones(n)
    a = max(1, int(attack * R))
    e[:a] = np.linspace(0, 1, a)
    rl = max(1, int(release * R))
    e[-rl:] *= np.linspace(1, 0, rl) ** 2
    return e


def save(name, x, folder="sfx", peak=0.85):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    (ROOT / folder).mkdir(exist_ok=True)
    sf.write(ROOT / folder / f"{name}.wav", x.astype(np.float32), R)
    print(name, f"{len(x) / R:.2f}s")


def lowpass(x, k):
    """A simple one-pole low-pass. k near 1 = darker."""
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = acc * k + v * (1 - k)
        y[i] = acc
    return y


# Alarm bell: a fast hammer between two bells, for 3 seconds.
tt = t(3.0)
bell = np.zeros_like(tt)
for i, start in enumerate(np.arange(0, 3.0, 1 / 18)):
    s = int(start * R)
    n = int(0.12 * R)
    seg = tt[:n]
    f = 1960 if i % 2 else 2350
    tone = sum(np.sin(2 * np.pi * f * m * seg) / (m * 1.6) for m in (1, 2.76, 5.4)) * np.exp(-seg * 30)
    bell[s : s + n] += tone[: len(bell[s : s + n])]
bell *= env(len(bell), 0.002, 0.1)
save("alarm", bell, peak=0.6)

# Pop: a label appearing.
tt = t(0.12)
f = 500 + 900 * np.exp(-tt * 40)
save("pop", np.sin(2 * np.pi * np.cumsum(f) / R) * np.exp(-tt * 38), peak=0.7)

# Whoosh: filtered noise swelling and fading.
tt = t(0.6)
n = rng.normal(size=len(tt))
save("whoosh", lowpass(n, 0.82) * np.sin(np.pi * tt / 0.6) ** 2, peak=0.6)

# Stomp: a deep thud with a little rattle.
tt = t(0.9)
thud = np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 6)
thud += lowpass(rng.normal(size=len(tt)), 0.9) * np.exp(-tt * 14) * 0.8
save("stomp", thud)

# Sparkle: a few high chimes rising.
tt = t(1.2)
sp = np.zeros_like(tt)
for i, f in enumerate([1568, 2093, 2637, 3136, 4186]):
    s = int(i * 0.07 * R)
    seg = tt[: len(tt) - s]
    sp[s:] += np.sin(2 * np.pi * f * seg) * np.exp(-seg * 6) * 0.5
save("sparkle", sp, peak=0.5)

# Tick (a good point) and buzz (a bad one).
tt = t(0.35)
save("ding", (np.sin(2 * np.pi * 1318 * tt) + 0.5 * np.sin(2 * np.pi * 1975 * tt)) * np.exp(-tt * 10), peak=0.6)
tt = t(0.35)
save("buzz", np.sign(np.sin(2 * np.pi * 140 * tt)) * 0.6 * env(len(tt), 0.005, 0.08), peak=0.45)

# Boing: a soft landing.
tt = t(0.5)
f = 180 + 220 * np.exp(-tt * 6) * (1 + 0.3 * np.sin(2 * np.pi * 14 * tt))
save("boing", np.sin(2 * np.pi * np.cumsum(f) / R) * np.exp(-tt * 6), peak=0.6)

# Rumble: a hungry tummy.
tt = t(1.0)
f = 70 + 25 * np.sin(2 * np.pi * 3 * tt)
rum = np.sin(2 * np.pi * np.cumsum(f) / R) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * tt)) * np.sin(np.pi * tt) ** 1.5
save("rumble", rum, peak=0.7)

# Snap: the milk drop letting go.
tt = t(0.25)
f = 900 * np.exp(-tt * 25) + 200
save("snap", np.sin(2 * np.pi * np.cumsum(f) / R) * np.exp(-tt * 22), peak=0.6)

# Shrink: a falling slide whistle.
tt = t(1.0)
f = 1400 * np.exp(-tt * 1.6) + 250
save("shrink", np.sin(2 * np.pi * np.cumsum(f) / R) * env(len(tt), 0.02, 0.3) * (1 + 0.1 * np.sin(2 * np.pi * 6 * tt)), peak=0.5)

# ---------------------------------------------------------------- music
# A light, bouncy loop: plucked marimba-like notes over a soft bass, 112 bpm,
# 8 bars, in C major. Loops seamlessly.
bpm = 112
beat = 60 / bpm
bars = 8
total = bars * 4 * beat
mus = np.zeros(int(total * R) + R)


def pluck(freq, dur, amp):
    tt = t(dur)
    return amp * (np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(2 * np.pi * freq * 4 * tt) * np.exp(-tt * 30)) * np.exp(-tt * 7)


def note(n):
    return 261.63 * 2 ** ((n - 60) / 12)


chords = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]] * 2
melody = [72, 76, 79, 76, 74, 72, 74, 76, 72, 69, 72, 76, 77, 76, 74, 71]
for bar, ch in enumerate(chords):
    for b8 in range(8):
        when = (bar * 4 + b8 * 0.5) * beat
        s = int(when * R)
        n = ch[b8 % 3] + (12 if b8 % 4 == 3 else 0)
        p = pluck(note(n), 0.5, 0.22 if b8 % 2 == 0 else 0.15)
        mus[s : s + len(p)] += p
    bs = int(bar * 4 * beat * R)
    for q in (0, 2):
        tt = t(beat * 1.6)
        bass = 0.5 * np.sin(2 * np.pi * note(ch[0] - 24) * tt) * np.exp(-tt * 2.5)
        st = bs + int(q * beat * R)
        mus[st : st + len(bass)] += bass
    for q in range(2):
        mn = melody[(bar * 2 + q) % len(melody)]
        p = pluck(note(mn), 0.9, 0.18)
        st = bs + int((q * 2 + 1) * beat * R)
        mus[st : st + len(p)] += p
    # soft shaker on the off-beats
    for b8 in range(8):
        st = bs + int((b8 * 0.5 + 0.25) * beat * R)
        sh = rng.normal(size=int(0.05 * R)) * np.exp(-t(0.05) * 80) * 0.05
        mus[st : st + len(sh)] += sh

loop = int(total * R)
tail = mus[loop:]
mus = mus[:loop]
mus[: len(tail)] += tail
save("bed", mus, folder="music", peak=0.7)
