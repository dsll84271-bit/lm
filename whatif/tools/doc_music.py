"""Original documentary score, synthesised from scratch (no samples, so it is free to use).

Writes public/doc01/music/{curious,storm,deco,synth,ominous}.wav (stereo, 48 kHz).
  .venv/bin/python tools/doc_music.py
"""
from pathlib import Path
import numpy as np
import soundfile as sf

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public/doc01/music"
rng = np.random.default_rng(7)


def hz(n):  # midi note -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def t_(d):
    return np.arange(int(d * SR)) / SR


def lp_slow(x, cutoff):
    # one-pole lowpass (cheap, smooth)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    b = 1 - a
    for i in range(len(x)):
        acc = b * x[i] + a * acc
        y[i] = acc
    return y


def lp_fast(x, cutoff, passes=2):
    # FFT brickwall-ish lowpass with a soft knee: much faster than the loop
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** (2 * passes))
    return np.fft.irfft(X, len(x))


def hp_fast(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 - 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def env(n, a=0.01, r=0.3, sustain=None):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    if sustain is None:
        nr = n - na
        e[na:] = np.exp(-np.arange(nr) / (r * SR))
    else:
        nr = max(1, int(r * SR))
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def piano(f, d, amp=0.3):
    tt = t_(d)
    x = np.zeros_like(tt)
    for k, a in [(1, 1), (2, 0.5), (3, 0.22), (4, 0.12), (5, 0.06), (6, 0.03)]:
        fk = f * k * (1 + 0.0004 * k * k)
        x += a * np.sin(2 * np.pi * fk * tt) * np.exp(-tt * (1.2 + 0.9 * k))
    x *= env(len(tt), 0.004, 1.6)
    return amp * x


def pluck(f, d, amp=0.25, bright=1.0):
    tt = t_(d)
    x = np.zeros_like(tt)
    for k in range(1, 8):
        x += (1 / k) * np.sin(2 * np.pi * f * k * tt) * np.exp(-tt * (3 + 2.5 * k / bright))
    return amp * x * env(len(tt), 0.002, 0.5)


def saw(f, tt, detune=0.0):
    ph = (f * (1 + detune) * tt) % 1.0
    return 2 * ph - 1


def pad(freqs, d, amp=0.12, cutoff=1400, a=1.5, r=1.5):
    tt = t_(d)
    x = np.zeros_like(tt)
    for f in freqs:
        for dt in (-0.004, 0.0, 0.005):
            x += saw(f, tt, dt)
    x = lp_fast(x / (len(freqs) * 3), cutoff)
    return amp * x * env(len(tt), a, r, sustain=True)


def bass(f, d, amp=0.3, cutoff=500):
    tt = t_(d)
    x = 0.6 * saw(f, tt) + 0.4 * np.sin(2 * np.pi * f * tt)
    return amp * lp_fast(x, cutoff) * env(len(tt), 0.005, 0.12, sustain=True)


def kick(amp=0.9):
    tt = t_(0.45)
    f = 50 + 90 * np.exp(-tt * 30)
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7)


def snare(amp=0.5, gate=0.22):
    tt = t_(0.6)
    n = rng.normal(0, 1, len(tt))
    x = hp_fast(n, 1500) * np.exp(-tt * 9) + 0.5 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 20)
    x *= (tt < gate) * 1.0 + (tt >= gate) * np.exp(-(tt - gate) * 60)  # 80s gated
    return amp * x


def hat(amp=0.12):
    tt = t_(0.08)
    return amp * hp_fast(rng.normal(0, 1, len(tt)), 7000) * np.exp(-tt * 60)


def timp(f, amp=0.6):
    tt = t_(2.5)
    x = np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 1.5 * tt) + 0.3 * lp_fast(rng.normal(0, 1, len(tt)), 300)
    return amp * x * np.exp(-tt * 1.8)


def place(buf, x, at):
    i = int(at * SR)
    j = min(len(buf), i + len(x))
    if i < len(buf):
        buf[i:j] += x[: j - i]


def reverb(x, seconds=2.2, mix=0.3):
    n = int(seconds * SR)
    ir = rng.normal(0, 1, n) * np.exp(-np.arange(n) / (seconds * SR / 6))
    ir = lp_fast(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    N = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[: len(x)]
    return (1 - mix) * x + mix * wet * 0.6


def stereo(x, width=0.25, delay_ms=11):
    d = int(delay_ms * SR / 1000)
    r = np.concatenate([np.zeros(d), x[:-d]])
    return np.stack([x + width * (r - x), r + width * (x - r)], axis=1)


def loopable(x, fade=3.0):
    # crossfade the tail into the head so the bed loops without a click
    n = int(fade * SR)
    head = x[:n].copy()
    tail = x[-n:].copy()
    w = np.linspace(0, 1, n)
    if x.ndim == 2:
        w = w[:, None]
    x = x[:-n].copy()
    x[:n] = head * w + tail * (1 - w)
    return x


def save(name, x, peak=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR)
    print(name, round(len(x) / SR, 1), "s")


# ---------------------------------------------------------------- curious (history / cold open)
def curious():
    bpm = 76
    beat = 60 / bpm
    chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
    bars = 16
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = chords[b % 4]
        t0 = b * 4 * beat
        place(m, pad([hz(n - 12) for n in ch], 4 * beat + 1.2, 0.10, 1100, 1.2, 1.4), t0)
        place(m, bass(hz(ch[0] - 24), 4 * beat, 0.16, 300), t0)
        # gentle piano arpeggio, sparser in the first bars
        pattern = [0, 2, 1, 2, 0, 2, 1, 2] if b >= 4 else [0, 2, 1, 2]
        step = 4 * beat / len(pattern)
        for k, p in enumerate(pattern):
            n = ch[p] + 12
            place(m, piano(hz(n), 2.5, 0.16 if k % 2 == 0 else 0.11), t0 + k * step)
        if b >= 8 and b % 2 == 0:  # a little melody in the second half
            mel = [ch[2] + 24, ch[1] + 24, ch[0] + 24]
            for k, n in enumerate(mel):
                place(m, piano(hz(n), 3, 0.09), t0 + k * 1.3 * beat)
    m = reverb(m, 2.6, 0.35)
    save("curious", loopable(stereo(m)), 0.75)


# ---------------------------------------------------------------- storm (hurricane)
def storm():
    L = 60.0
    m = np.zeros(int(L * SR))
    tt = t_(L)
    drone = lp_fast(saw(hz(33), tt) + saw(hz(33), tt, 0.006) + 0.6 * saw(hz(40), tt, -0.004), 260)
    swell = 0.6 + 0.4 * np.sin(2 * np.pi * tt / 12)
    m += 0.25 * drone * swell
    wind = lp_fast(rng.normal(0, 1, len(tt)), 900) * (0.4 + 0.6 * (np.sin(2 * np.pi * tt / 7.3) ** 2))
    m += 0.10 * wind
    for k in range(0, int(L / 4)):
        place(m, timp(hz(38 if k % 2 == 0 else 36), 0.5), k * 4.0)
    for k in range(0, int(L / 2)):
        place(m, pluck(hz(69 + (k % 3) * 3), 1.2, 0.05), k * 2.0 + 1.0)  # high tense ticks
    m = reverb(m, 3.0, 0.4)
    save("storm", loopable(stereo(m, 0.35)), 0.75)


# ---------------------------------------------------------------- deco (Art Deco, the swamp)
def deco():
    bpm = 92
    beat = 60 / bpm
    chords = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]  # Cmaj7 Am7 Fmaj7 G7
    bars = 16
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = chords[b % 4]
        t0 = b * 4 * beat
        place(m, pad([hz(n - 12) for n in ch], 4 * beat + 1, 0.08, 1600, 0.8, 1.2), t0)
        place(m, bass(hz(ch[0] - 24), 1.5 * beat, 0.16, 400), t0)
        place(m, bass(hz(ch[0] - 24 + 7), 1.0 * beat, 0.12, 400), t0 + 2 * beat)
        for k in range(8):
            n = ch[[0, 2, 1, 3, 2, 1, 3, 2][k]] + 12
            place(m, pluck(hz(n), 0.8, 0.10, 1.4), t0 + k * beat / 2)
        for k in range(4):
            place(m, hat(0.05), t0 + k * beat + beat / 2)
    m = reverb(m, 1.8, 0.28)
    save("deco", loopable(stereo(m)), 0.75)


# ---------------------------------------------------------------- synth (the 1980s chapter)
def synth():
    bpm = 104
    beat = 60 / bpm
    chords = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]]  # Am F Dm E
    bars = 16
    L = bars * 4 * beat + 3
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = chords[b % 4]
        t0 = b * 4 * beat
        place(m, pad([hz(n) for n in ch], 4 * beat + 0.5, 0.10, 2400, 0.3, 0.6), t0)
        for k in range(8):  # driving eighth-note bass
            place(m, bass(hz(ch[0] - 24), beat / 2 * 0.9, 0.22, 700), t0 + k * beat / 2)
        for k in range(16):  # sixteenth arpeggio
            n = ch[k % 3] + 12 + (12 if k % 8 >= 6 else 0)
            place(m, pluck(hz(n), 0.25, 0.07, 2.0), t0 + k * beat / 4)
        if b >= 2:
            for k in range(4):
                place(m, kick(0.5), t0 + k * beat)
                place(m, hat(0.06), t0 + k * beat + beat / 2)
            place(m, snare(0.35), t0 + beat)
            place(m, snare(0.35), t0 + 3 * beat)
    m = reverb(m, 1.6, 0.25)
    save("synth", loopable(stereo(m, 0.3)), 0.75)


# ---------------------------------------------------------------- ominous (rising seas)
def ominous():
    L = 64.0
    m = np.zeros(int(L * SR))
    tt = t_(L)
    m += 0.22 * lp_fast(saw(hz(36), tt) + saw(hz(36), tt, 0.005) + saw(hz(43), tt, -0.003), 220)
    beat = 60 / 60
    for k in range(int(L / beat)):
        place(m, kick(0.35), k * beat)  # heartbeat-like pulse
    for b in range(int(L / 8)):
        place(m, pad([hz(57), hz(60), hz(64)] if b % 2 == 0 else [hz(55), hz(58), hz(62)], 8.5, 0.07, 900, 2.5, 2.5), b * 8)
        place(m, piano(hz(81 if b % 2 == 0 else 79), 4, 0.06), b * 8 + 4)
    m = reverb(m, 3.2, 0.4)
    save("ominous", loopable(stereo(m, 0.3)), 0.75)


if __name__ == "__main__":
    curious()
    storm()
    deco()
    synth()
    ominous()
