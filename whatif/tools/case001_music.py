"""Original score for Case File 001 (The Reaping), synthesised from scratch so it is free to use.

A different sound from the GTA episode: D minor, music-box bells, a ticking clock,
a distant military snare, felt piano and tape hiss.
Writes public/case001/music/{reaping,panem,archive,rigged,father,hume,verdict}.wav

  .venv/bin/python tools/case001_music.py
"""
import runpy
from pathlib import Path

import numpy as np
import soundfile as sf

M = runpy.run_path(str(Path(__file__).with_name("doc_music.py")), run_name="lib")
SR, hz, t_, place, reverb, stereo, loopable = M["SR"], M["hz"], M["t_"], M["place"], M["reverb"], M["stereo"], M["loopable"]
pad, bass, piano, pluck, kick, timp, lp, hp, env, saw = M["pad"], M["bass"], M["piano"], M["pluck"], M["kick"], M["timp"], M["lp_fast"], M["hp_fast"], M["env"], M["saw"]
rng = np.random.default_rng(1969)
OUT = Path(__file__).resolve().parent.parent / "public/case001/music"


def save(name, x, peak=0.75):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR)
    print(name, round(len(x) / SR, 1), "s")


def bell(f, d=2.5, amp=0.2):
    """Music-box / glockenspiel tone: bright inharmonic partials, fast decay."""
    tt = t_(d)
    x = np.zeros_like(tt)
    for k, a, dec in [(1, 1, 2.2), (2.76, 0.45, 4), (5.4, 0.25, 7), (8.93, 0.12, 10)]:
        x += a * np.sin(2 * np.pi * f * k * tt) * np.exp(-tt * dec)
    return amp * x * env(len(tt), 0.001, 3)


def felt(f, d=3.0, amp=0.2):
    """Soft felt piano: piano tone with the top rolled off."""
    return lp(piano(f, d, amp), 1800)


def tick(amp=0.08, hi=True):
    tt = t_(0.04)
    x = hp(rng.normal(0, 1, len(tt)), 3000 if hi else 1500) * np.exp(-tt * 180)
    x += 0.5 * np.sin(2 * np.pi * (2400 if hi else 1700) * tt) * np.exp(-tt * 250)
    return amp * x


def snare_roll(d=1.6, amp=0.12):
    """Distant field-drum roll (brushed, military)."""
    tt = t_(d)
    n = hp(rng.normal(0, 1, len(tt)), 1800)
    rate = 18
    mod = 0.55 + 0.45 * np.abs(np.sin(np.pi * rate * tt))
    shape = np.minimum(1, tt / (d * 0.7)) * np.exp(-np.maximum(0, tt - d * 0.7) * 12)
    return amp * n * mod * shape


def snare_hit(amp=0.12):
    tt = t_(0.25)
    return amp * (hp(rng.normal(0, 1, len(tt)), 1800) * np.exp(-tt * 22) + 0.4 * np.sin(2 * np.pi * 210 * tt) * np.exp(-tt * 30))


def strings(freqs, d, amp=0.1, a=2.0, r=2.0, cutoff=1600):
    """Bowed-string ensemble: detuned saws with slow vibrato, softened."""
    tt = t_(d)
    x = np.zeros_like(tt)
    for f in freqs:
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * tt + rng.uniform(0, 6))
        for dt in (-0.006, -0.002, 0.003, 0.007):
            ph = np.cumsum(f * (1 + dt) * vib) / SR
            x += 2 * (ph % 1.0) - 1
    x = lp(x / (len(freqs) * 4), cutoff)
    return amp * x * env(len(tt), a, r, sustain=True)


def hiss(L, amp=0.012):
    return amp * lp(hp(rng.normal(0, 1, int(L * SR)), 2000), 9000)


D = 50  # D3
Dm, Bb, F, C, Gm, A = [50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55], [43, 46, 50], [45, 49, 52]


# ---------------------------------------------------------------- reaping (the hook)
def reaping():
    L = 64.0
    m = np.zeros(int(L * SR))
    tt = t_(L)
    m += 0.16 * lp(saw(hz(D - 12), tt) + saw(hz(D - 12), tt, 0.004) + 0.5 * saw(hz(D - 5), tt, -0.003), 200) * (0.7 + 0.3 * np.sin(2 * np.pi * tt / 16))
    for k in range(int(L)):  # a clock: tick, tock
        place(m, tick(0.07, k % 2 == 0), k * 1.0)
    motif = [74, 77, 81, 79]  # D F A G: the case motif, on music box
    for b in range(int(L / 8)):
        for k, n in enumerate(motif):
            place(m, bell(hz(n), 3, 0.10 if b % 2 == 0 else 0.07), b * 8 + 0.5 + k * 0.75)
        place(m, snare_roll(1.8, 0.07), b * 8 + 5.5)
        place(m, strings([hz(n) for n in (Dm if b % 2 == 0 else Bb)], 8.5, 0.05, 2.5, 2.5, 1100), b * 8)
    m = reverb(m, 3.0, 0.38)
    save("reaping", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- panem (the fiction)
def panem():
    bpm = 84
    beat = 60 / bpm
    prog = [Dm, Dm, Bb, A]
    bars = 20
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        place(m, strings([hz(n - 12) for n in ch], 4 * beat + 1.5, 0.07, 1.0, 1.4, 1300), t0)
        place(m, bass(hz(ch[0] - 24), 4 * beat, 0.14, 260), t0)
        # march pattern on a distant field drum
        for k, (pos, a) in enumerate([(0, 0.10), (1.5, 0.06), (2, 0.09), (3, 0.06), (3.5, 0.05)]):
            place(m, snare_hit(a), t0 + pos * beat)
        if b % 4 == 3:
            place(m, snare_roll(2 * beat, 0.09), t0 + 2 * beat)
        if b >= 4:  # bell line over it
            mel = [ch[2] + 24, ch[1] + 24, ch[0] + 24, ch[1] + 24]
            for k, n in enumerate(mel):
                place(m, bell(hz(n), 2.5, 0.06), t0 + k * beat)
        if b % 8 == 0:
            place(m, timp(hz(38), 0.35), t0)
    m = reverb(m, 2.6, 0.35)
    save("panem", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- archive (1969)
def archive():
    bpm = 72
    beat = 60 / bpm
    prog = [Dm, Bb, F, C]
    bars = 16
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        place(m, pad([hz(n - 12) for n in ch], 4 * beat + 1.2, 0.06, 900, 1.2, 1.4), t0)
        place(m, felt(hz(ch[0] - 12), 4, 0.16), t0)
        pattern = [0, 1, 2, 1, 2, 1, 0, 1]
        for k, p in enumerate(pattern):
            place(m, felt(hz(ch[p] + 12), 2.5, 0.12 if k % 2 == 0 else 0.08), t0 + k * beat / 2)
        if b >= 8 and b % 2 == 1:
            place(m, felt(hz(ch[2] + 24), 3.5, 0.07), t0 + 2 * beat)
    m += hiss(L, 0.01)
    m = reverb(m, 2.2, 0.3)
    save("archive", loopable(stereo(m, 0.22)))


# ---------------------------------------------------------------- rigged (the bias)
def rigged():
    bpm = 96
    beat = 60 / bpm
    prog = [Dm, Dm, Gm, A]
    bars = 20
    L = bars * 4 * beat + 3
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        for k in range(16):  # restless sixteenth pulse
            place(m, bass(hz(ch[0] - 24), beat / 4 * 0.8, 0.13 if k % 4 == 0 else 0.08, 420), t0 + k * beat / 4)
        for k in range(8):
            place(m, tick(0.05, k % 2 == 0), t0 + k * beat / 2)
        place(m, strings([hz(n) for n in ch], 4 * beat + 0.6, 0.045 + 0.003 * min(b, 10), 0.4, 0.8, 1500 + 60 * b), t0)
        if b >= 4:
            place(m, kick(0.28), t0)
            place(m, kick(0.22), t0 + 2.5 * beat)
        if b >= 8:
            for k, n in enumerate([ch[2] + 24, ch[2] + 25, ch[2] + 24]):  # a nagging half-step
                place(m, pluck(hz(n), 0.6, 0.05, 1.5), t0 + (1 + k * 0.5) * beat)
    m = reverb(m, 1.8, 0.28)
    save("rigged", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- father (personal)
def father():
    bpm = 66
    beat = 60 / bpm
    prog = [Bb, F, Gm, F]
    bars = 16
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    mel = [74, 72, 70, 69, 70, 72, 74, 77]
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        place(m, strings([hz(n - 12) for n in ch], 4 * beat + 2, 0.05, 2.0, 2.0, 1000), t0)
        place(m, felt(hz(ch[0] - 12), 4, 0.12), t0)
        for k in range(2):
            n = mel[(b * 2 + k) % len(mel)] + 12
            place(m, bell(hz(n), 3.5, 0.07), t0 + k * 2 * beat)
    m += hiss(L, 0.006)
    m = reverb(m, 3.2, 0.42)
    save("father", loopable(stereo(m, 0.28)))


# ---------------------------------------------------------------- hume (the philosopher and the silent majority)
def hume():
    bpm = 80
    beat = 60 / bpm
    prog = [Dm, Bb, Gm, A]
    bars = 20
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        lvl = min(1.0, 0.4 + b * 0.04)
        place(m, strings([hz(n - 12) for n in ch] + [hz(ch[0])], 4 * beat + 1.2, 0.07 * lvl, 0.8, 1.2, 1200 + 50 * b), t0)
        for k in range(8):  # low ostinato
            n = ch[0] - 24 + (12 if k % 4 == 2 else 0)
            place(m, bass(hz(n), beat / 2 * 0.85, 0.11 * lvl, 380), t0 + k * beat / 2)
        place(m, timp(hz(38), 0.22 * lvl), t0)
        if b >= 6:
            place(m, timp(hz(38), 0.16 * lvl), t0 + 2 * beat)
        if b >= 10:
            for k, n in enumerate([ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12]):
                place(m, bell(hz(n + 12), 2.0, 0.05), t0 + k * beat)
    m = reverb(m, 2.8, 0.36)
    save("hume", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- verdict (the evidence)
def verdict():
    bpm = 74
    beat = 60 / bpm
    prog = [[50, 54, 57], [47, 50, 54], [43, 47, 50], [45, 49, 52]]  # D Bm G A: the motif resolved to major
    bars = 12
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        place(m, strings([hz(n - 12) for n in ch], 4 * beat + 1.5, 0.06, 1.2, 1.5, 1400), t0)
        place(m, felt(hz(ch[0] - 12), 4, 0.14), t0)
        for k, p in enumerate([0, 2, 1, 2]):
            place(m, felt(hz(ch[p] + 12), 2.5, 0.1), t0 + k * beat)
        if b % 2 == 1:
            for k, n in enumerate([74, 78, 81, 79]):  # the case motif, now in D major
                place(m, bell(hz(n), 2.5, 0.06), t0 + k * 0.75)
    m = reverb(m, 2.6, 0.34)
    save("verdict", loopable(stereo(m, 0.28)))


if __name__ == "__main__":
    reaping()
    panem()
    archive()
    rigged()
    father()
    hume()
    verdict()
