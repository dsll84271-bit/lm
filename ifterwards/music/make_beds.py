"""Makes the music beds and the whoosh, from scratch, so they are free to use.

  music/bed-warm.wav   soft major chords, for the warm parts of an episode
  music/bed-cool.wav   soft minor chords, for the cooler parts
  sfx/whoosh.wav       a short rush of air for cuts between locations

Each bed is 32 seconds long and loops without a seam. They are plain, quiet
pads meant to sit far under the narration. Replace them with library music
(free for commercial use) by saving files with the same names.

Run from the ifterwards folder:  python3 music/make_beds.py
"""

import wave
from pathlib import Path

import numpy as np

RATE = 44_100
CHORD = 8.0  # seconds each chord lasts
ROOT = Path(__file__).resolve().parent.parent


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def save(path, stereo):
    stereo = np.clip(stereo, -1, 1)
    with wave.open(str(path), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((stereo * 32767).astype("<i2").tobytes())
    print(f"wrote {path.relative_to(ROOT)} ({len(stereo) / RATE:.1f} s)")


def bed(chords, name):
    total = CHORD * len(chords)
    n = int(total * RATE)
    t = np.arange(n) / RATE
    left = np.zeros(n)
    right = np.zeros(n)
    for i, notes in enumerate(chords):
        # Each chord swells in and out over its 8 seconds and overlaps its
        # neighbours; the last one wraps round into the first, so the loop
        # has no seam.
        centre = (i + 0.5) * CHORD
        distance = np.abs(((t - centre + total / 2) % total) - total / 2)
        swell = np.clip(1 - distance / (CHORD * 0.75), 0, 1)
        swell = np.sin(swell * np.pi / 2) ** 2
        for k, midi in enumerate(notes):
            f = hz(midi)
            level = 0.9 if k == 0 else 0.6
            for cents, pan in ((-4, 0.35), (4, 0.65)):
                ff = f * 2 ** (cents / 1200)
                tone = np.sin(2 * np.pi * ff * t) + 0.28 * np.sin(2 * np.pi * 2 * ff * t) + 0.1 * np.sin(2 * np.pi * 3 * ff * t)
                breathe = 1 + 0.12 * np.sin(2 * np.pi * (0.07 + 0.013 * k) * t + k)
                left += tone * swell * breathe * level * (1 - pan)
                right += tone * swell * breathe * level * pan
    mix = np.stack([left, right], axis=1)
    mix = mix / np.abs(mix).max() * 10 ** (-9 / 20)  # peak at -9 dB
    save(ROOT / "music" / name, mix)


# Warm: F major 7, A minor 7, D minor 7, B flat major 7.
bed([[41, 48, 57, 64], [45, 52, 55, 60], [38, 50, 53, 57, 60], [46, 53, 57, 62]], "bed-warm.wav")
# Cool: D minor 9, B flat major 7, G minor 7, A minor 7.
bed([[38, 50, 53, 57, 64], [46, 53, 57, 62], [43, 50, 53, 58], [45, 52, 55, 60]], "bed-cool.wav")

# The whoosh: noise swept upwards through a band-pass filter.
rng = np.random.default_rng(3)
length = 0.5
t = np.arange(int(RATE * length)) / RATE
noise = rng.standard_normal(t.size)
centre = 300 + 2600 * (t / length) ** 1.6
out = np.zeros_like(noise)
low = band = 0.0
for i, x in enumerate(noise):
    f = 2 * np.sin(np.pi * centre[i] / RATE)
    low += f * band
    high = x - low - band / 1.4
    band += f * high
    out[i] = band
out *= np.sin(np.pi * t / length) ** 2
out = out / np.abs(out).max() * 10 ** (-10 / 20)
save(ROOT / "sfx" / "whoosh.wav", np.stack([out, out * 0.9], axis=1))
