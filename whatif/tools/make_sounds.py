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


# ---------------------------------------------------------------- richer, stereo sounds (v2)
def reverb(x, seconds=1.2, mix=0.3):
    n = int(seconds * R)
    ir = rng.normal(size=n) * np.exp(-np.arange(n) / (n / 5))
    size = len(x) + n
    fft_n = 1 << (size - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, fft_n) * np.fft.rfft(ir, fft_n), fft_n)[:size] / (np.sqrt(n) * 3)
    out = np.zeros(size)
    out[: len(x)] += x * (1 - mix)
    out += wet * mix
    return out


def stereo(x, width=0.3):
    d = int(0.012 * R)
    left = x
    right = np.concatenate([np.zeros(d), x[:-d]]) if len(x) > d else x
    return np.stack([left * (1 - width / 2) + right * width / 2, right * (1 - width / 2) + left * width / 2], axis=1)


def save2(name, x, folder="sfx", peak=0.85):
    if x.ndim == 1:
        x = stereo(x)
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    (ROOT / folder).mkdir(parents=True, exist_ok=True)
    sf.write(ROOT / folder / f"{name}.wav", x.astype(np.float32), R)
    print(name, f"{len(x) / R:.2f}s (stereo)")


def bandpass(x, lo, hi):
    return lowpass(x, hi) - lowpass(x, lo)


# A better snap: crisp click, a little body, a room tail.
tt = t(0.3)
sn = rng.normal(size=len(tt)) * np.exp(-tt * 120) + 0.7 * np.sin(2 * np.pi * 1900 * tt) * np.exp(-tt * 80) + 0.3 * np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 50)
save2("snap", reverb(sn, 0.6, 0.25))

# Time stopping: a deep downward sweep with a reversed swell into it.
tt = t(1.6)
f = 220 * np.exp(-tt * 2.2) + 35
sweep = np.sin(2 * np.pi * np.cumsum(f) / R) * np.exp(-tt * 1.4)
swell = lowpass(rng.normal(size=len(tt)), 0.05)[::-1] * np.linspace(0, 1, len(tt)) ** 3 * 0.6
ts = np.concatenate([swell[: int(0.4 * R)], np.zeros(0)])
x = np.zeros(len(tt) + len(ts))
x[: len(ts)] += ts
x[len(ts) :] += sweep
save2("timestop", reverb(x, 1.5, 0.35), peak=0.8)

# Time starting again: the reverse, rising.
save2("timestart", reverb(x[::-1].copy(), 0.8, 0.25), peak=0.7)

# Footsteps: a soft thump with a scuff. Loops: walking (2 a second) and running (3.4 a second).
def step():
    tt = t(0.14)
    return np.sin(2 * np.pi * (70 + 40 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 40) + lowpass(rng.normal(size=len(tt)), 0.3) * np.exp(-tt * 60) * 0.5


for name, rate in [("steps", 2.0), ("run", 3.4)]:
    L2 = int(4 * R)
    loop = np.zeros(L2)
    for k in range(int(4 * rate)):
        s0 = int(k / rate * R)
        st = step() * (0.8 + 0.2 * (k % 2))
        loop[s0 : s0 + len(st)] += st[: len(loop) - s0]
    save2(name, reverb(loop, 0.3, 0.15)[:L2], peak=0.5)

# Ambiences (8 s loops), all quiet beds.
def amb_loop(x, n):
    x = x[:n]
    fade = int(0.5 * R)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    return x


N = int(8 * R)
noise = lambda: rng.normal(size=N)
# Night rain in the city: rain hiss, drops, low traffic rumble.
rain2 = bandpass(noise(), 0.08, 0.5) * 0.35 + lowpass(noise(), 0.004) * 1.5
for _ in range(900):
    s0 = rng.integers(0, N - 800)
    rain2[s0 : s0 + 500] += rng.normal(size=500) * np.exp(-np.arange(500) / 60) * 0.5
save2("amb_rain", amb_loop(rain2, N), peak=0.5)
# Day city: traffic hum and the odd bird.
city = lowpass(noise(), 0.006) * 1.8 + bandpass(noise(), 0.02, 0.06) * 0.3
for k in range(6):
    s0 = rng.integers(0, N - R)
    tt = t(0.25)
    chirp = np.sin(2 * np.pi * (3000 + 1500 * np.sin(2 * np.pi * 12 * tt)) * tt) * np.exp(-tt * 10) * 0.25
    city[s0 : s0 + len(chirp)] += chirp
save2("amb_city", amb_loop(city, N), peak=0.45)
# Room tone: a soft electrical hum and air.
tt = t(8)
room = 0.2 * np.sin(2 * np.pi * 50 * tt) + 0.1 * np.sin(2 * np.pi * 100 * tt) + lowpass(noise(), 0.01) * 0.8
save2("amb_room", amb_loop(room, N), peak=0.25)
# Classroom / lunch hall murmur: band-limited babble with movement.
mur = bandpass(noise(), 0.02, 0.12) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * tt) * np.sin(2 * np.pi * 1.3 * tt))
save2("amb_crowd", amb_loop(reverb(mur, 0.8, 0.4)[:N], N), peak=0.4)
# Outdoor field: wind and birds.
wind = lowpass(noise(), 0.003) * 2 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.2 * tt))
for k in range(10):
    s0 = rng.integers(0, N - R)
    tc = t(0.18)
    ch = np.sin(2 * np.pi * (4000 + 1000 * np.sin(2 * np.pi * 20 * tc)) * tc) * np.exp(-tc * 12) * 0.3
    wind[s0 : s0 + len(ch)] += ch
save2("amb_field", amb_loop(wind, N), peak=0.45)
# Storm: heavy rain and a far rumble.
storm = bandpass(noise(), 0.1, 0.6) * 0.5 + lowpass(noise(), 0.002) * 3
save2("amb_storm", amb_loop(storm, N), peak=0.55)
# Slowed time: a low, airy drone that replaces the world's sound.
drone = 0.4 * np.sin(2 * np.pi * 55 * tt + 0.5 * np.sin(2 * np.pi * 0.1 * tt)) + 0.2 * np.sin(2 * np.pi * 82.5 * tt) + lowpass(noise(), 0.002) * 1.2
save2("amb_slow", amb_loop(drone, N), peak=0.4)

# Coins into a hat.
x = np.zeros(int(1.2 * R))
for k in range(9):
    s0 = int((0.05 + k * 0.11) * R)
    tc = t(0.25)
    c = sum(np.sin(2 * np.pi * f * tc) for f in (2600 + k * 90, 4100 + k * 70)) * np.exp(-tc * 18)
    x[s0 : s0 + len(c)] += c[: len(x) - s0]
save2("coins", reverb(x, 0.4, 0.2), peak=0.5)

# A better crowd cheer: many voices, swelling.
tt = t(2.6)
cheer = sum(bandpass(rng.normal(size=len(tt)), 0.01 + k * 0.01, 0.06 + k * 0.02) * (0.5 + 0.5 * np.sin(2 * np.pi * (2 + k) * tt + k)) for k in range(5))
save2("crowd", reverb(cheer * np.sin(np.pi * tt / 2.6), 1.0, 0.3), peak=0.55)

# Heartbeat (for the rescue).
x = np.zeros(int(1.0 * R))
for off, a in [(0.0, 1.0), (0.22, 0.7)]:
    tc = t(0.2)
    b = np.sin(2 * np.pi * (45 + 30 * np.exp(-tc * 30)) * tc) * np.exp(-tc * 18) * a
    s0 = int(off * R)
    x[s0 : s0 + len(b)] += b
save2("heart", x, peak=0.7)
