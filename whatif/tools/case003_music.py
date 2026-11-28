"""Original score for Case File 003 (Dexter on trial), written as MIDI and played
with FluidSynth + the FluidR3_GM soundfont (MIT licence).

The Fiction Files motif (D, F, A, G#: the unresolved "case" figure; it resolves
to D only when a case closes) arranged for Miami: vibraphone, synth bass and
brushes, a muted trumpet for the courtroom, and a clock for Exhibit D.

Writes public/case003/music/{hook,ident,fiction,gate,science,insider,clock,verdict,closed}.wav

  .venv/bin/python tools/case003_music.py
"""
import runpy
import subprocess
import tempfile
from pathlib import Path

import mido
import numpy as np
import soundfile as sf

K = runpy.run_path(str(Path(__file__).with_name("case001_music.py")), run_name="lib")
M = K["M"]
SR, loopable, lp, hp, t_ = M["SR"], M["loopable"], M["lp_fast"], M["hp_fast"], M["t_"]
tick = K["tick"]
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
OUT = Path(__file__).resolve().parent.parent / "public/case003/music"
rng = np.random.default_rng(2006)

# General MIDI programs (0-based)
VIBES, MARIMBA, CELESTA, PIANO, EPIANO = 11, 12, 8, 0, 4
SYNBASS, ACBASS, CONTRA, CELLO = 38, 32, 43, 42
STRINGS, SLOWSTR, PIZZ, TRUMPET_MUTE, HORN, TIMPANI, BELLS = 48, 49, 45, 59, 60, 47, 14
PAD_WARM, PAD_HALO, PAD_SWEEP = 89, 94, 95
DRUMS = "drums"

# the series motif, in beats: D F A G#  (the case is open)
MOTIF = [(0, 0.5, 62), (0.5, 0.5, 65), (1.0, 1.0, 69), (2.0, 2.0, 68)]
# ...and its resolution: D F A D  (case closed)
RESOLVE = [(0, 0.5, 62), (0.5, 0.5, 65), (1.0, 1.0, 69), (2.0, 3.0, 74)]

Dm9 = [50, 57, 60, 64, 65]
Bbmaj7 = [46, 53, 57, 62, 65]
Gm9 = [43, 50, 53, 57, 58]
A7b9 = [45, 52, 55, 58, 61]
PROG = [Dm9, Bbmaj7, Gm9, A7b9]


class Song:
	def __init__(self, bpm):
		self.bpm = bpm
		self.tracks = {}  # name -> (program, channel, [(beat, dur, note, vel)])
		self.cc = {}

	def part(self, name, program, ch=None):
		if name not in self.tracks:
			ch = 9 if program == DRUMS else (ch if ch is not None else len([t for t in self.tracks.values() if t[1] != 9]))
			if ch == 9 and program != DRUMS:
				ch = 10
			self.tracks[name] = (program, ch, [])
		return self.tracks[name][2]

	def write(self, path, bars):
		mid = mido.MidiFile(ticks_per_beat=480)
		meta = mido.MidiTrack()
		meta.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(self.bpm)))
		mid.tracks.append(meta)
		for name, (prog, ch, notes) in self.tracks.items():
			tr = mido.MidiTrack()
			mid.tracks.append(tr)
			ev = []
			if prog == DRUMS:
				ev.append((0, mido.Message("program_change", channel=9, program=40)))  # brush kit
			else:
				ev.append((0, mido.Message("program_change", channel=ch, program=prog)))
			ev.append((0, mido.Message("control_change", channel=ch, control=91, value=self.cc.get((name, 91), 70))))
			ev.append((0, mido.Message("control_change", channel=ch, control=7, value=self.cc.get((name, 7), 100))))
			ev.append((0, mido.Message("control_change", channel=ch, control=10, value=self.cc.get((name, 10), 64))))
			for b, d, n, v in notes:
				on = int(b * 480)
				off = int((b + d) * 480)
				ev.append((on, mido.Message("note_on", channel=ch, note=int(n), velocity=int(max(1, min(127, v))))))
				ev.append((off, mido.Message("note_off", channel=ch, note=int(n), velocity=0)))
			ev.sort(key=lambda e: (e[0], e[1].type == "note_on"))
			last = 0
			for tk, msg in ev:
				tr.append(msg.copy(time=tk - last))
				last = tk
		end = mido.MidiTrack()
		end.append(mido.MetaMessage("end_of_track", time=int(bars * 4 * 480) + 480 * 8))
		mid.tracks.append(end)
		mid.save(path)

	def render(self, bars, gain=0.5):
		with tempfile.TemporaryDirectory() as td:
			mp, wp = Path(td) / "s.mid", Path(td) / "s.wav"
			self.write(mp, bars)
			subprocess.run(["fluidsynth", "-ni", "-q", "-g", str(gain), "-r", str(SR), "-F", str(wp), SF2, str(mp)], check=True, capture_output=True)
			x, sr = sf.read(wp, dtype="float32")
		assert sr == SR
		return x  # stereo


def save(name, x, peak=0.8, loop=True, length=None):
	if length:
		x = x[: int(length * SR)]
	if loop:
		x = np.stack([loopable(x[:, 0]), loopable(x[:, 1])], 1)
	x = x / (np.max(np.abs(x)) + 1e-9) * peak
	OUT.mkdir(parents=True, exist_ok=True)
	sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR)
	print(name, round(len(x) / SR, 1), "s")


def add_mono(x, y, at=0.0):
	i = int(at * SR)
	n = min(len(y), len(x) - i)
	if n > 0:
		x[i : i + n, 0] += y[:n]
		x[i : i + n, 1] += y[:n]
	return x


def motif(part, at, notes=MOTIF, shift=0, vel=80, stretch=1.0):
	for b, d, n in notes:
		part.append((at + b * stretch, d * stretch, n + shift, vel))


def chord(part, at, notes, dur, vel=60, shift=0):
	for n in notes:
		part.append((at, dur, n + shift, vel))


# ---------------------------------------------------------------- hook: Miami at night, something wrong
def hook():
	s = Song(84)
	bass, pad, vib, kit = s.part("bass", SYNBASS), s.part("pad", PAD_WARM), s.part("vib", VIBES), s.part("kit", DRUMS)
	s.cc[("vib", 91)] = 100
	bars = 16
	for bar in range(bars):
		c = PROG[bar % 4]
		at = bar * 4
		chord(pad, at, c[1:], 4, 46)
		for k in range(8):  # eighth-note pulse, ducked
			bass.append((at + k * 0.5, 0.4, c[0] - 12 + (12 if k in (3, 6) else 0), 70 if k % 2 == 0 else 52))
		if bar >= 4:
			kit.append((at + 1, 0.2, 38, 50))
			kit.append((at + 3, 0.2, 38, 56))
			for k in range(4):
				kit.append((at + k, 0.2, 42, 36))
		if bar % 4 == 0 and bar >= 2:
			motif(vib, at + 0.5, vel=88)
		if bar % 4 == 2 and bar >= 6:
			motif(vib, at + 0.5, shift=-12, vel=70)
	x = s.render(bars)
	save("hook", x, length=bars * 4 * 60 / 84)


# ---------------------------------------------------------------- ident: the motif, stated (one-shot, ~8 s)
def ident():
	s = Song(80)
	vib, bass, pad, trp, kit = s.part("vib", VIBES), s.part("bass", SYNBASS), s.part("pad", PAD_HALO), s.part("trp", TRUMPET_MUTE), s.part("kit", DRUMS)
	s.cc[("vib", 91)] = 110
	motif(vib, 0.5, vel=100)
	motif(trp, 0.5, shift=-12, vel=74)
	bass.append((0.5, 4, 38, 90))
	chord(pad, 0.5, [50, 57, 60, 65], 6, 56)
	kit.append((0.5, 0.3, 49, 60))  # cymbal swell
	kit.append((4.5, 0.3, 38, 70))
	x = s.render(3)
	save("ident", x, loop=False, peak=0.85, length=9.0)


# ---------------------------------------------------------------- fiction: neon Miami cool
def fiction():
	s = Song(88)
	bass, ep, vib, kit, pad = s.part("bass", SYNBASS), s.part("ep", EPIANO), s.part("vib", VIBES), s.part("kit", DRUMS), s.part("pad", PAD_WARM)
	bars = 16
	for bar in range(bars):
		c = PROG[bar % 4]
		at = bar * 4
		chord(pad, at, c[1:], 4, 40)
		for k, (b, d) in enumerate([(0, 0.75), (0.75, 0.25), (1.5, 0.5), (2.5, 0.5), (3.25, 0.5)]):
			bass.append((at + b, d, c[0] - 12 + (7 if k == 3 else 0), 78))
		for b in (0.5, 2.0, 3.5):
			chord(ep, at + b, c[2:], 0.4, 44)
		kit.append((at, 0.2, 36, 60))
		kit.append((at + 2.5, 0.2, 36, 50))
		kit.append((at + 1, 0.2, 38, 54))
		kit.append((at + 3, 0.2, 38, 58))
		for k in range(8):
			kit.append((at + k * 0.5, 0.15, 42, 30 + (8 if k % 2 == 0 else 0)))
		if bar % 4 == 1:
			motif(vib, at + 0.5, shift=12, vel=70)
	x = s.render(bars)
	save("fiction", x, length=bars * 4 * 60 / 88)


# ---------------------------------------------------------------- Exhibit A: the gatekeeper (courtroom)
def gate():
	s = Song(66)
	st, cb, trp, timp, horn = s.part("st", SLOWSTR), s.part("cb", CONTRA), s.part("trp", TRUMPET_MUTE), s.part("timp", TIMPANI), s.part("horn", HORN)
	s.cc[("trp", 91)] = 90
	prog = [Dm9, Gm9, Bbmaj7, A7b9]
	bars = 12
	for bar in range(bars):
		c = prog[bar % 4]
		at = bar * 4
		chord(st, at, c[1:4], 4, 50)
		cb.append((at, 4, c[0] - 12, 64))
		if bar % 2 == 0:
			timp.append((at, 1, c[0] - 12 if c[0] - 12 >= 38 else c[0], 60))
		if bar % 4 == 0:
			motif(trp, at + 1, vel=80, stretch=1.25)
		if bar % 4 == 2:
			motif(horn, at + 1, shift=-12, vel=58, stretch=1.25)
	x = s.render(bars)
	save("gate", x, length=bars * 4 * 60 / 66)


# ---------------------------------------------------------------- Exhibit B: the science (lab pulse)
def science():
	s = Song(96)
	mar, cel, pizz, pad, bass = s.part("mar", MARIMBA), s.part("cel", CELESTA), s.part("pizz", PIZZ), s.part("pad", PAD_SWEEP), s.part("bass", SYNBASS)
	bars = 16
	arp = [0, 7, 12, 15, 19, 15, 12, 7]
	for bar in range(bars):
		c = PROG[bar % 4]
		at = bar * 4
		chord(pad, at, c[1:], 4, 36)
		bass.append((at, 2, c[0] - 12, 70))
		bass.append((at + 2.5, 1.5, c[0] - 12, 60))
		for k in range(16):
			n = c[0] + 12 + arp[k % 8] - (3 if c is Bbmaj7 and arp[k % 8] in (15,) else 0)
			mar.append((at + k * 0.25, 0.2, n, 56 if k % 4 == 0 else 40))
		for k in range(4):
			pizz.append((at + k, 0.4, c[1], 54))
		if bar % 4 == 3:
			motif(cel, at, shift=12, vel=64)
	x = s.render(bars)
	save("science", x, length=bars * 4 * 60 / 96)


# ---------------------------------------------------------------- Exhibit C: the insider (dark)
def insider():
	s = Song(60)
	pno, cello, pad, cb, bells = s.part("pno", PIANO), s.part("cello", CELLO), s.part("pad", PAD_HALO), s.part("cb", CONTRA), s.part("bells", BELLS)
	s.cc[("pno", 91)] = 100
	bars = 10
	for bar in range(bars):
		at = bar * 4
		cb.append((at, 4, 38, 70))
		chord(pad, at, [50, 53, 56], 4, 44)  # D F Ab: diminished, uneasy
		pno.append((at, 1, 74, 54))
		pno.append((at + 1.5, 1, 73, 44))
		if bar % 2 == 1:
			cello.append((at, 2, 56, 62))
			cello.append((at + 2, 2, 55, 58))
		if bar % 5 == 4:
			motif(bells, at, shift=-12, vel=50, stretch=1.5)
	x = s.render(bars)
	save("insider", x, length=bars * 4 * 60 / 60)


# ---------------------------------------------------------------- Exhibit D: the clock
def clock():
	s = Song(92)
	kit, bass, st, vib, pad = s.part("kit", DRUMS), s.part("bass", SYNBASS), s.part("st", STRINGS), s.part("vib", VIBES), s.part("pad", PAD_WARM)
	bars = 16
	for bar in range(bars):
		c = PROG[bar % 4]
		at = bar * 4
		chord(pad, at, c[1:], 4, 38)
		for k in range(8):
			bass.append((at + k * 0.5, 0.35, c[0] - 12, 72 if k % 2 == 0 else 50))
		for k in range(16):  # brushed snare swirl in sixteenths
			kit.append((at + k * 0.25, 0.1, 38, 26 + (16 if k % 4 == 2 else 0)))
		kit.append((at, 0.2, 36, 64))
		kit.append((at + 2, 0.2, 36, 54))
		if bar >= 8:
			chord(st, at, c[2:4], 4, 44 + (bar - 8) * 3)
		if bar % 4 == 0:
			motif(vib, at + 1, vel=72)
	x = s.render(bars)
	L = bars * 4 * 60 / 92
	x = x[: int(L * SR)]
	# a clock under it all, one tick per beat
	for k in range(int(L / (60 / 92))):
		add_mono(x, tick(0.05 if k % 2 == 0 else 0.035), k * 60 / 92)
	save("clock", x, length=L)


# ---------------------------------------------------------------- the verdict
def verdict():
	s = Song(70)
	pno, st, pad, cb, vib = s.part("pno", PIANO), s.part("st", SLOWSTR), s.part("pad", PAD_HALO), s.part("cb", CONTRA), s.part("vib", VIBES)
	s.cc[("pno", 91)] = 100
	prog = [Dm9, Bbmaj7, Gm9, A7b9]
	bars = 12
	for bar in range(bars):
		c = prog[bar % 4]
		at = bar * 4
		chord(st, at, c[1:4], 4, 44)
		cb.append((at, 4, c[0] - 12 if c[0] > 40 else c[0], 56))
		for b in (0, 1.5, 3):
			pno.append((at + b, 1.2, c[2] + 12, 46))
		if bar % 4 == 0:
			motif(vib, at + 0.5, vel=70)
	x = s.render(bars)
	save("verdict", x, length=bars * 4 * 60 / 70)


# ---------------------------------------------------------------- case closed: the motif finally resolves
def closed():
	s = Song(76)
	vib, trp, st, cb, pad, kit = s.part("vib", VIBES), s.part("trp", TRUMPET_MUTE), s.part("st", SLOWSTR), s.part("cb", CONTRA), s.part("pad", PAD_WARM), s.part("kit", DRUMS)
	s.cc[("vib", 91)] = 110
	motif(vib, 0.5, RESOLVE, vel=96)
	motif(trp, 0.5, RESOLVE, shift=-12, vel=70)
	chord(st, 2.5, [50, 57, 62, 65], 8, 60)
	cb.append((2.5, 8, 38, 70))
	chord(pad, 2.5, [62, 65, 69, 74], 9, 46)
	kit.append((2.5, 0.3, 49, 54))
	x = s.render(4)
	save("closed", x, loop=False, peak=0.85, length=13.0)


if __name__ == "__main__":
	for fn in (hook, ident, fiction, gate, science, insider, clock, verdict, closed):
		fn()
