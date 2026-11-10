# Ep4 outro cues.  python mix_e.py -> mix3_e.wav
from a3 import *
M = Mix('e')
M.put('sfx', whoosh(.4), .6, .3); M.put('sfx', boom(1.2)*.5, 1.0, .4); ding(M, 2.5, .25, 2600); M.put('sfx', tone(500, 900, .12, .01, .05), 3.4, .2)
for i in range(5): M.put('sfx', tone(900, 1200, .08, .005, .04), 6.6 + i*.12, .12)
for x in (6.61, 8.03, 9.2, 10.27, 11.45): click(M, x, .35); ding(M, x + .02, .08, 2200)
M.put('sfx', tone(600, 1000, .15, .01, .05), 14.0, .2)
n = int(17.0*SR); night = lp(rng.standard_normal(n), 300)*.4 + hp(rng.standard_normal(n), 3000)*.02; M.put('amb', np.stack([night, np.roll(night, 5000)], 1)*env(n, .5, .5)[:, None], 18.5, .5)
for i in range(9): M.put('sfx', tone(4200 + (i % 2)*300, 4300, .05, .003, .02), 19.0 + i*1.1, .03)
for i in range(14): M.put('sfx', lp(noise(.06), 500)*np.exp(-tt(.06)*50), 18.9 + i*.62, .1)     # tiptoes
heartbeat(M, 23.3, 6, .7, .3)
M.put('sfx', bp(noise(.5), 300, 2000)*np.sin(np.linspace(0, np.pi, int(.5*SR))), REACH := 30.0, .35)      # cloth: the arm reaches back
M.put('sfx', bp(noise(.06), 500, 4000)*np.exp(-tt(.06)*60) + tone(300, 300, .06, .002, .03)*.4, 31.9, .5)   # pat (note sticks)
M.put('sfx', whoosh(.4, 600, 8000), 33.25, .8); M.put('sfx', tone(1600, 300, .3, .002, .1)*.4, 33.3, .4)
M.put('sfx', tone(1500, 2200, .08, .003, .03), 34.4, .15)
for i in range(10): click(M, D5 := 35.7 + i/14, .35)
M.put('sfx', boom(2.5), 36.4, .7)
M.put('sfx', tone(900, 1200, .1, .005, .05), 41.75, .2); M.put('sfx', whoosh(.4), 44.2, .3)
groove(M, 0, 6.5, (C, G, Am, F), drums=.8, gain=.85, bar=4)
groove(M, 6.55, 13.7, (F, G, C, Am), drums=.6, gain=.85, bar=4, inst='mallet')
groove(M, 13.7, 18.4, (C, F), drums=.5, gain=.75, bar=4)
M.put('mus', pad([57, 60, 64], 5.0, 900, 1.5), 18.5, .3); [M.put('mus', mallet(m, 1.2), 18.7 + i*.8, .1) for i, m in enumerate([69, 72, 76, 72, 69, 67])]
drone(M, 23.4, 9.8, (33, 34), .45); M.put('mus', brass([33, 39, 45], 1.6, 800), GONE := 33.3, .45)
M.put('mus', pad([45, 52, 57, 60], 2.6, 600, .2), 36.4, .5)
groove(M, 38.3, 57.1, (Am, F, C, G), drums=.9, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6, fade_out=2.0, mute=((28.1, 33.25), (35.6, 36.35)))
