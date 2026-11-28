"""Makes sfx/ring.wav, Episode 1's signature sound: the ring.

"High and thin, like a wine glass somebody has just flicked."
Built from scratch out of pure tones, so it is free to use commercially.

Run from the ifterwards folder:  python3 sfx/make_ring.py
"""

import wave
from pathlib import Path

import numpy as np

RATE = 48_000
LENGTH = 2.6  # seconds
rng = np.random.default_rng(11)
t = np.arange(int(RATE * LENGTH)) / RATE

# A wine glass rings at one clear pitch plus a few fainter, higher ones that
# die away faster. Each is very slightly doubled, which makes the slow shimmer.
#          pitch (Hz), loudness, seconds to fade
PARTIALS = [(2093.0, 1.00, 0.95), (4870.0, 0.30, 0.45), (8420.0, 0.12, 0.22), (1046.5, 0.10, 0.6)]

tone = np.zeros_like(t)
for hz, level, fade in PARTIALS:
    for detune in (-1.6, 1.6):
        tone += 0.5 * level * np.sin(2 * np.pi * (hz + detune) * t + rng.uniform(0, 6.28)) * np.exp(-t / fade)

# The flick itself: a very short, bright tick at the start.
tick = rng.standard_normal(t.size) * np.exp(-t / 0.0016) * 0.5
tick = np.diff(tick, prepend=0)  # keep only the bright part

mix = (tone + tick) * np.clip(t / 0.002, 0, 1) * np.clip((LENGTH - t) / 0.2, 0, 1)
mix = mix / np.abs(mix).max() * 10 ** (-6 / 20)  # peak at -6 dB

# It is heard in his left ear, so it sits a little to the left.
stereo = np.stack([mix, 0.62 * mix], axis=1)

out = Path(__file__).with_name("ring.wav")
with wave.open(str(out), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(RATE)
    f.writeframes((stereo * 32767).astype("<i2").tobytes())
print(f"wrote {out} ({LENGTH:.1f} s)")
