# Ep4 s3 cues (Rule 3: refraction + rain).  python mix_s3.py -> mix3_s3.wav
from a3 import *
M = Mix('s3')
room(M, 0, 8.0, .4); ding(M, 3.6, .12, 2400); M.put('sfx', tone(500, 300, .3, .01, .1)*.3, 5.2, .2)
M.put('amb', lp(noise(7.2), 150)*.4, 8.0, .3); M.put('sfx', tone(600, 1100, .8, .02, .2)*.25, 9.0, .3); ding(M, 11.6, .2, 2800)
M.put('amb', lp(noise(12.4), 700)*.25 + hp(noise(12.4), 4000)*.03, 15.2, .35); [M.put('sfx', tone(3200, 4100, .08, .003, .05), x, .03) for x in (16.0, 18.2, 21.3, 24.6)]   # garden birds
M.put('sfx', bp(noise(10.0), 1500, 6000)*(.4 + .6*np.sin(tt(10.0)*2*np.pi*.6)**2)*.15, 16.5, .3)        # glassy shimmer hiss
for i in range(6): M.put('sfx', bell(1400 + i*260, 1.2)*.5, 16.6 + i*1.4, .05)
M.put('amb', lp(noise(12.4), 150)*.4, 27.6, .3)
for i, x in enumerate((28.4, 29.4, 30.4, 31.4)): blip(M, x, 600 + i*150, .15)
M.put('sfx', tone(500, 200, .5, .02, .2)*.3, 33.5, .3)
n = int(8.1*SR); st = lp(rng.standard_normal(n), 600)*.4; M.put('amb', np.stack([st, np.roll(st, 3000)], 1)*env(n, .3, .3)[:, None], 40.0, .45)
for x in (41.6, 42.4, 43.2): ding(M, x, .15, 2600)
M.put('sfx', boom(2.5)*.4 + lp(noise(2.5), 300)*np.linspace(0, 1, int(2.5*SR))*.4, 45.8, .45)              # thunder rumble
n = int((70.51 - 47.2)*SR); rain = bp(rng.standard_normal(n), 1500, 9000)*.5 + lp(rng.standard_normal(n), 800)*.3
M.put('amb', np.stack([rain, np.roll(rain, 5000)], 1)*env(n, 1.5, .5)[:, None], 47.2, 1.0)
for i in range(44): M.put('sfx', lp(noise(.1), 900)*np.exp(-tt(.1)*30)*.6 + bp(noise(.1), 1500, 5000)*np.exp(-tt(.1)*40)*.3, 48.2 + i*.42, .25)   # squelchy steps
for x in (54.5, 58.5): M.put('sfx', tone(500, 800, .25, .01, .1)*.4, x, .25)
for i in range(20): M.put('sfx', bp(noise(.03), 1500, 7000)*np.exp(-tt(.03)*60), 64.9 + i*.05, .3)          # shake spray
M.put('sfx', tone(900, 1200, .1, .005, .05), 67.15, .25); click(M, 67.3, .4)
groove(M, 0, 15.2, (Am, F, C, G), drums=.3, gain=.7, bar=4, inst='mallet')
M.put('mus', pad([60, 64, 67, 71, 74], 12.4, 2600, 1.5), 15.2, .3); [M.put('mus', bell(mtof(m), 2.0)*.4, 15.6 + i*1.55, .12) for i, m in enumerate([76, 79, 83, 86, 83, 79, 76, 72])]
groove(M, 27.6, 40.0, (Dm, Bb, F, C), drums=.3, gain=.7, bar=4, inst='mallet')
groove(M, 40.0, 46.0, (C, F, G, C), drums=.6, gain=.8, bar=4)
M.put('mus', pad([45, 52, 57, 60], 21.0, 900, 2.0), 47.4, .35); [M.put('mus', pluck(m, .8), 48.4 + i*.84, .12) for i, m in enumerate([69, 72, 76, 72]*6)]
chordHit(M, 67.11, Am, .4); groove(M, 67.2, 70.5, (F, C), drums=.8, gain=.85, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6)
