"""Makes sfx/paper-flip.wav, the channel's day-card sound.

The sound is built from scratch out of filtered noise, so nobody else owns it
and it is free to use commercially. To use a recorded paper flip instead,
replace paper-flip.wav with a file of the same name (about half a second long).

Run from the ifterwards folder:  python3 sfx/make_paper_flip.py
"""

import wave
from pathlib import Path

import numpy as np

RATE = 48_000
LENGTH = 0.62  # seconds
rng = np.random.default_rng(7)  # fixed seed: the same sound every time
t = np.arange(int(RATE * LENGTH)) / RATE


def bandpass(noise, centre_hz, q):
    """A band-pass filter whose centre can move over time."""
    out = np.zeros_like(noise)
    low = band = 0.0
    for i, x in enumerate(noise):
        f = 2 * np.sin(np.pi * min(centre_hz[i], RATE / 6.5) / RATE)
        low += f * band
        high = x - low - band / q
        band += f * high
        out[i] = band
    return out


def envelope(start, attack, decay):
    """Silent until `start`, quick rise, then an exponential fall."""
    e = np.zeros_like(t)
    on = t >= start
    rise = np.clip((t - start) / attack, 0, 1)
    e[on] = (rise * np.exp(-(t - start - attack).clip(0) / decay))[on]
    return e


noise = rng.standard_normal(t.size)

# 1. The page lifting: an airy swish that rises in pitch.
swish_centre = 1400 + 4200 * np.clip(t / 0.26, 0, 1) ** 1.5
swish = bandpass(noise, swish_centre, 1.3) * envelope(0.0, 0.11, 0.075)

# 2. The page snapping over: a short, darker flap.
flap_noise = rng.standard_normal(t.size)
flap = bandpass(flap_noise, np.full(t.size, 900.0), 0.9) * envelope(0.25, 0.004, 0.035)
snap = bandpass(flap_noise, np.full(t.size, 5200.0), 2.0) * envelope(0.25, 0.002, 0.012)

# 3. Paper crackle: a scatter of tiny ticks while the page is in the air.
ticks = np.zeros_like(t)
for when in rng.uniform(0.03, 0.34, 26):
    i = int(when * RATE)
    n = int(0.004 * RATE)
    ticks[i : i + n] += rng.standard_normal(n) * np.exp(-np.arange(n) / (0.0009 * RATE)) * rng.uniform(0.2, 1)
crackle = bandpass(ticks, np.full(t.size, 6500.0), 1.1)

# 4. The page settling: a soft, low rustle.
settle = bandpass(rng.standard_normal(t.size), np.full(t.size, 2300.0), 1.0) * envelope(0.31, 0.03, 0.09)

mix = 0.9 * swish + 1.5 * flap + 0.6 * snap + 0.5 * crackle + 0.22 * settle
mix *= np.clip((LENGTH - t) / 0.05, 0, 1)  # fade the last 50 ms to silence
mix = mix / np.abs(mix).max() * 10 ** (-3 / 20)  # peak at -3 dB

# A hint of stereo width: the right channel arrives a fraction later.
delay = int(0.0004 * RATE)
right = np.concatenate([np.zeros(delay), mix[:-delay]])
stereo = np.stack([mix, 0.92 * right], axis=1)

out = Path(__file__).with_name("paper-flip.wav")
with wave.open(str(out), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(RATE)
    f.writeframes((stereo * 32767).astype("<i2").tobytes())
print(f"wrote {out} ({LENGTH:.2f} s)")
