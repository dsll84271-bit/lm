"""Original score for Case File 002 (The Real Scrooge), synthesised from scratch.

Victorian winter noir: a music box and a ticking clock, low strings, pizzicato,
and the traditional carol "God Rest Ye Merry, Gentlemen" (public domain), which
Scrooge chases away from his door in the book, re-harmonised in a dark minor.
Writes public/case002/music/{humbug,ledger,miser,darkest,suspects,grave,sledgehammer,castaway,verdict}.wav

  .venv/bin/python tools/case002_music.py
"""
import runpy
from pathlib import Path

import numpy as np

K = runpy.run_path(str(Path(__file__).with_name("case001_music.py")), run_name="lib")
M = K["M"]
SR, hz, t_, place, reverb, stereo, loopable = M["SR"], M["hz"], M["t_"], M["place"], M["reverb"], M["stereo"], M["loopable"]
pad, bass, pluck, kick, timp, lp, hp, saw = M["pad"], M["bass"], M["pluck"], M["kick"], M["timp"], M["lp_fast"], M["hp_fast"], M["saw"]
bell, felt, tick, strings, hiss, snare_roll = K["bell"], K["felt"], K["tick"], K["strings"], K["hiss"], K["snare_roll"]
rng = np.random.default_rng(1843)
OUT = Path(__file__).resolve().parent.parent / "public/case002/music"


def save(name, x, peak=0.75):
    import soundfile as sf
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR)
    print(name, round(len(x) / SR, 1), "s")


# "God rest ye merry, gentlemen, let nothing you dismay" (traditional), in E minor
CAROL = [(64, 1), (64, 1), (71, 1), (71, 1), (69, 1), (67, 1), (66, 1), (64, 1), (62, 1), (64, 1), (66, 1), (67, 1), (69, 1), (71, 3)]
Em, C, D, B7, Am, G = [52, 55, 59], [48, 52, 55], [50, 54, 57], [47, 51, 54], [45, 48, 52], [43, 47, 50]


def wind(L, amp=0.05):
    tt = t_(L)
    n = lp(rng.normal(0, 1, len(tt)), 700)
    return amp * n * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 9.0) ** 2)


def carol_line(m, t0, beat, inst="bell", amp=0.08, shift=12):
    t = t0
    for n, d in CAROL:
        if inst == "bell":
            place(m, bell(hz(n + shift), 2.2, amp), t)
        else:
            place(m, felt(hz(n + shift - 12), 2.4, amp), t)
        t += d * beat
    return t


# ---------------------------------------------------------------- humbug (the hook)
def humbug():
    L = 64.0
    m = np.zeros(int(L * SR))
    tt = t_(L)
    m += 0.14 * lp(saw(hz(28), tt) + saw(hz(28), tt, 0.004) + 0.5 * saw(hz(35), tt, -0.003), 180)
    for k in range(int(L)):
        place(m, tick(0.07, k % 2 == 0), k * 1.0)
    for b in range(4):
        carol_line(m, b * 16 + 1.0, 0.62, "bell", 0.075 if b % 2 == 0 else 0.055)
        place(m, strings([hz(n) for n in (Em if b % 2 == 0 else C)], 16.5, 0.045, 3, 3, 1000), b * 16)
    m += wind(L, 0.04)
    m = reverb(m, 3.2, 0.42)
    save("humbug", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- ledger (the fiction: Scrooge counting)
def ledger():
    bpm = 92
    beat = 60 / bpm
    prog = [Em, Em, C, B7]
    bars = 20
    L = bars * 4 * beat + 3
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        for k in range(8):  # pizzicato, like coins being counted
            n = ch[[0, 2, 1, 2, 0, 2, 1, 2][k]]
            place(m, pluck(hz(n), 0.5, 0.11 if k % 2 == 0 else 0.07, 0.9), t0 + k * beat / 2)
        place(m, bass(hz(ch[0] - 24), 2 * beat, 0.12, 260), t0)
        place(m, strings([hz(n) for n in ch], 4 * beat + 0.8, 0.035, 0.8, 1.0, 1300), t0)
        if b >= 8 and b % 4 == 0:
            carol_line(m, t0, beat / 2, "bell", 0.05, 24)
    m = reverb(m, 2.2, 0.3)
    save("ledger", loopable(stereo(m, 0.28)))


# ---------------------------------------------------------------- miser (John Elwes)
def miser():
    L = 64.0
    m = np.zeros(int(L * SR))
    tt = t_(L)
    m += 0.12 * lp(saw(hz(40), tt) + saw(hz(40), tt, 0.005), 240) * (0.6 + 0.4 * np.sin(2 * np.pi * tt / 11))
    for k in range(int(L / 0.5)):  # a slow, uneven clock
        place(m, tick(0.05, k % 2 == 0), k * 0.5 + (0.03 if k % 3 == 0 else 0))
    for b in range(int(L / 8)):
        ch = [Em, Am, B7, Em][b % 4]
        place(m, strings([hz(n - 12) for n in ch], 8.6, 0.06, 2.0, 2.0, 900), b * 8)
        for k, n in enumerate([ch[2] + 12, ch[1] + 12, ch[0] + 12]):  # creeping celesta figure
            place(m, bell(hz(n + 12), 2.5, 0.045), b * 8 + 2 + k * 1.1)
    m += hiss(L, 0.008)
    m = reverb(m, 3.0, 0.4)
    save("miser", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- darkest (the housekeeper)
def darkest():
    L = 48.0
    m = np.zeros(int(L * SR))
    tt = t_(L)
    m += 0.16 * lp(saw(hz(31), tt) + saw(hz(31.5 - 0.5), tt, 0.006), 160)
    m += wind(L, 0.06)
    for k in range(int(L / 4)):
        place(m, kick(0.22), k * 4.0)  # a slow heartbeat
        place(m, kick(0.14), k * 4.0 + 0.35)
    for b in range(int(L / 12)):
        place(m, strings([hz(64), hz(65)], 12.5, 0.03, 4, 4, 1400), b * 12)  # a cold minor-second
    m = reverb(m, 3.6, 0.45)
    save("darkest", loopable(stereo(m, 0.32)))


# ---------------------------------------------------------------- suspects (Jemmy Wood, Daniel Dancer)
def suspects():
    bpm = 104
    beat = 60 / bpm
    prog = [Am, Am, Em, B7]
    bars = 20
    L = bars * 4 * beat + 3
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        for k in range(4):  # sneaky staccato bass walk
            place(m, bass(hz(ch[0] - 24 + [0, 3, 7, 3][k]), beat * 0.5, 0.15, 420), t0 + k * beat)
            place(m, pluck(hz(ch[(k + 1) % 3] + 12), 0.35, 0.07, 1.3), t0 + k * beat + beat / 2)
        for k in range(8):
            place(m, tick(0.035, k % 2 == 0), t0 + k * beat / 2)
        if b % 4 == 2:
            place(m, snare_roll(1.2, 0.05), t0 + 2.5 * beat)
    m = reverb(m, 1.8, 0.28)
    save("suspects", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- grave (Edinburgh, the gravestone)
def grave():
    L = 48.0
    m = np.zeros(int(L * SR))
    m += wind(L, 0.08)
    for k in range(0, int(L), 8):  # a distant church bell
        place(m, bell(hz(40), 6, 0.16), k + 0.5)
        place(m, bell(hz(47), 5, 0.08), k + 0.52)
    for b in range(int(L / 12)):
        place(m, strings([hz(52), hz(59), hz(64)], 12.5, 0.035, 4, 4, 900), b * 12)
    m = reverb(m, 4.0, 0.5)
    save("grave", loopable(stereo(m, 0.35)))


# ---------------------------------------------------------------- sledgehammer (the 1843 report)
def sledgehammer():
    bpm = 84
    beat = 60 / bpm
    prog = [Em, C, Am, B7]
    bars = 20
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        lvl = min(1.0, 0.45 + b * 0.04)
        place(m, strings([hz(n - 12) for n in ch] + [hz(ch[0])], 4 * beat + 1, 0.07 * lvl, 0.6, 1.0, 1100 + 60 * b), t0)
        for k in range(8):
            place(m, bass(hz(ch[0] - 24), beat / 2 * 0.85, 0.11 * lvl, 360), t0 + k * beat / 2)
        place(m, timp(hz(40), 0.3 * lvl), t0)  # the hammer
        if b >= 8:
            place(m, timp(hz(40), 0.22 * lvl), t0 + 2 * beat)
        if b >= 12 and b % 4 == 0:
            carol_line(m, t0, beat / 2, "bell", 0.05, 12)
    m = reverb(m, 2.6, 0.34)
    save("sledgehammer", loopable(stereo(m, 0.3)))


# ---------------------------------------------------------------- castaway (Dickens at twelve)
def castaway():
    bpm = 64
    beat = 60 / bpm
    prog = [G, D, Em, C]
    bars = 14
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        place(m, strings([hz(n - 12) for n in ch], 4 * beat + 2, 0.04, 2, 2, 900), t0)
        place(m, felt(hz(ch[0] - 12), 4, 0.13), t0)
        for k, p in enumerate([0, 2, 1, 2]):
            place(m, felt(hz(ch[p] + 12), 2.5, 0.08), t0 + k * beat)
        if b >= 6 and b % 2 == 0:
            place(m, bell(hz(ch[2] + 24), 3.5, 0.05), t0 + 2 * beat)
    m += hiss(L, 0.008)
    m = reverb(m, 3.0, 0.4)
    save("castaway", loopable(stereo(m, 0.28)))


# ---------------------------------------------------------------- verdict (the carol, finally in major)
def verdict():
    bpm = 76
    beat = 60 / bpm
    major = [(n + (1 if n % 12 in (7,) else 0), d) for n, d in CAROL]  # raise G to G#: E major colour
    prog = [[52, 56, 59], [45, 49, 52], [47, 51, 54], [52, 56, 59]]  # E A B E
    bars = 12
    L = bars * 4 * beat + 4
    m = np.zeros(int(L * SR))
    for b in range(bars):
        ch = prog[b % 4]
        t0 = b * 4 * beat
        place(m, strings([hz(n - 12) for n in ch], 4 * beat + 1.5, 0.055, 1.2, 1.5, 1400), t0)
        place(m, felt(hz(ch[0] - 12), 4, 0.13), t0)
        if b % 4 == 0:
            t = t0
            for n, d in major:
                place(m, bell(hz(n + 12), 2.2, 0.06), t)
                t += d * beat / 2
    m = reverb(m, 2.8, 0.36)
    save("verdict", loopable(stereo(m, 0.28)))


if __name__ == "__main__":
    for f in (humbug, ledger, miser, darkest, suspects, grave, sledgehammer, castaway, verdict):
        f()
