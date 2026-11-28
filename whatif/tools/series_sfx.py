"""Signature sound effects shared by every Fiction Files case (synthesised, so the
channel owns them). Writes public/series/sfx/*.wav

  .venv/bin/python tools/series_sfx.py
"""
import runpy
from pathlib import Path

import numpy as np
import soundfile as sf

D = runpy.run_path(str(Path(__file__).with_name("doc_music.py")), run_name="lib")
SR, t_, lp, hp, reverb = D["SR"], D["t_"], D["lp_fast"], D["hp_fast"], D["reverb"]
stamp_hit, whoosh, boom, typewriter_click = D["stamp_hit"], D["whoosh"], D["boom"], D["typewriter_click"]
rng = np.random.default_rng(3)
OUT = Path(__file__).resolve().parent.parent / "public/series/sfx"


def save(name, x, peak=0.9):
	x = x / (np.max(np.abs(x)) + 1e-9) * peak
	OUT.mkdir(parents=True, exist_ok=True)
	sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR)
	print(name, round(len(x) / SR, 2), "s")


def mix(L, *parts):
	m = np.zeros(int(L * SR))
	for at, x in parts:
		i = int(at * SR)
		n = min(len(x), len(m) - i)
		m[i : i + n] += x[:n]
	return m


def noise(d):
	return rng.normal(0, 1, int(d * SR))


def env(d, k):
	return np.exp(-t_(d) * k)


# a big rubber stamp, with the desk ringing under it
stamp = mix(1.2, (0, stamp_hit(1.0)), (0, 0.35 * boom(0.6)[: int(1.2 * SR)]))
save("stamp", reverb(stamp, 1.0, 0.18))

# 1960s TV switching on: the knob clunk, a tube whine, then hum
d = 1.8
tt = t_(d)
clunk = hp(noise(0.06), 900) * env(0.06, 90) + 0.6 * np.sin(2 * np.pi * 180 * t_(0.06)) * env(0.06, 60)
whine = 0.08 * np.sin(2 * np.pi * 15734 / 2 * tt) * np.minimum(1, tt * 6) * np.exp(-tt * 1.2)
hum = 0.12 * (np.sin(2 * np.pi * 60 * tt) + 0.5 * np.sin(2 * np.pi * 120 * tt)) * np.minimum(1, tt * 3) * np.exp(-tt * 1.4)
static = 0.25 * hp(noise(d), 2000) * np.exp(-tt * 5) * (tt > 0.05)
save("tv_on", mix(d, (0, clunk), (0.05, whine + hum + static)), 0.8)

# a judge's gavel: two hard wooden knocks
def knock(amp=1.0):
	dd = 0.35
	tk = t_(dd)
	body = np.sin(2 * np.pi * 420 * tk) * np.exp(-tk * 38) + 0.6 * np.sin(2 * np.pi * 760 * tk) * np.exp(-tk * 55)
	click = hp(noise(dd), 2500) * np.exp(-tk * 120)
	return amp * (body + 0.5 * click)


save("gavel", reverb(mix(1.4, (0, knock(1.0)), (0.32, knock(0.85))), 1.4, 0.3))

# a push pin into cork
dd = 0.25
tk = t_(dd)
pin = hp(noise(dd), 1500) * np.exp(-tk * 90) + 0.4 * np.sin(2 * np.pi * 300 * tk) * np.exp(-tk * 50)
save("pin", pin, 0.7)

# a glass microscope slide set down
dd = 0.9
tk = t_(dd)
glass = sum(a * np.sin(2 * np.pi * f * tk) * np.exp(-tk * k) for f, a, k in [(3150, 0.5, 9), (4720, 0.35, 12), (6210, 0.2, 15), (2380, 0.25, 7)])
tap = hp(noise(dd), 3000) * np.exp(-tk * 160)
save("slide", reverb(glass + 0.6 * tap, 0.8, 0.2), 0.6)

# a mechanical clock tick
dd = 0.12
tk = t_(dd)
tick = hp(noise(dd), 3000) * np.exp(-tk * 260) + 0.3 * np.sin(2 * np.pi * 2400 * tk) * np.exp(-tk * 200)
save("tick", tick, 0.6)

# a low reveal hit (for the drop after a silence)
save("hit", reverb(mix(3.0, (0, boom(1.0)), (0, 0.4 * stamp_hit(0.8))), 2.0, 0.25))

# a rising tension swell (2.5 s) that cuts dead at its peak
dd = 2.5
tk = t_(dd)
sw = lp(noise(dd), 3000) * (tk / dd) ** 2.2
tone = sum(np.sin(2 * np.pi * f * (1 + 0.35 * tk / dd) * tk) for f in (110, 165, 220)) * (tk / dd) ** 3 * 0.15
save("riser", sw * 0.5 + tone, 0.7)

# a camera shutter (evidence photo)
dd = 0.35
tk = t_(dd)
sh = hp(noise(dd), 1800) * (np.exp(-tk * 90) + 0.8 * np.exp(-np.maximum(0, tk - 0.09) * 90) * (tk > 0.09))
save("shutter", sh, 0.6)

# a paper page turn
dd = 0.6
tk = t_(dd)
pg = lp(hp(noise(dd), 900), 6000) * np.sin(np.pi * tk / dd) ** 1.5
save("page", pg, 0.5)

# a heavy drawer / filing cabinet slam (case closed)
save("cabinet", reverb(mix(1.6, (0, 0.6 * whoosh(0.25, 0.5)), (0.22, stamp_hit(1.0)), (0.22, 0.5 * knock(0.8))), 1.2, 0.25))

# a soft whoosh
save("whoosh", whoosh(0.7, 0.5), 0.6)

# typing burst
save("typing", mix(1.2, *[(k * 0.085 + (0.03 if k % 4 == 0 else 0), typewriter_click(0.3 + 0.07 * (k % 3))) for k in range(13)]), 0.7)
