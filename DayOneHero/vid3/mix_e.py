# e cues (outro).  python mix_e.py -> mix3_e.wav
from a3 import *
M = Mix('e')
M.put('sfx', whoosh(.4), .6, .3); M.put('sfx', boom(1.2)*.5, 1.0, .4); ding(M, 2.5, .25, 2600); M.put('sfx', tone(500, 900, .12, .01, .05), 3.4, .2)
for i in range(5): M.put('sfx', tone(900, 1200, .08, .005, .04), 6.85 + i*.12, .12)
for x in (6.79, 8.23, 9.13, 10.36, 12.0): click(M, x, .35); ding(M, x + .02, .08, 2200)
M.put('sfx', tone(600, 1000, .15, .01, .05), 15.2, .2); click(M, 16.9, .3)
n = int(16.9*SR); night = lp(rng.standard_normal(n), 300)*.4; M.put('amb', np.stack([night]*2, 1)*env(n, .5, .5)[:, None], 19.71, .5)
for i in range(8): M.put('sfx', tone(4200 + (i % 2)*300, 4300, .05, .003, .02), 20.0 + i*1.1, .03)       # crickets
tp_pop(M, 21.7, .15)                                                                                    # a quiet pop
M.put('sfx', tone(300, 260, .12, .005, .05), 23.0, .1)
M.put('sfx', tone(110, 104, 5.5, .8, 1.0)*.6 + lp(noise(5.5), 200)*.3, 25.75, .5)                        # dread drone
M.put('sfx', tone(1400, 1400, .4, .002, .3)*.5, 26.0, .12)                                              # eyes glint
M.put('sfx', whoosh(.4, 600, 8000), 30.25, .8); M.put('sfx', tone(1600, 300, .3, .002, .1)*.4, 30.3, .4)
M.put('sfx', tone(220, 220, .5, .01, .4)*.5, 31.65, .3)
for i in range(10): click(M, 33.2 + i/14, .35)
M.put('sfx', boom(2.5), 33.9, .7)
M.put('sfx', tone(900, 1200, .1, .005, .05), 38.05, .2); M.put('sfx', whoosh(.4), 41.6, .3)
# score
groove(M, 0, 6.7, (C, G, Am, F), drums=.8, gain=.85, bar=4)
groove(M, 6.79, 14.8, (F, G, C, Am), drums=.6, gain=.85, bar=4, inst='mallet')
groove(M, 14.82, 19.7, (C, F), drums=.5, gain=.75, bar=4)
M.put('mus', pad([57, 60, 64], 6.0, 900, 1.5), 19.71, .3); [M.put('mus', mallet(m, 1.2), 19.9 + i*.8, .1) for i, m in enumerate([69, 72, 76, 72, 69, 67, 64])]
drone(M, 25.75, 5.0, (33, 34), .5); M.put('mus', brass([33, 39, 45], 1.6, 800), 30.3, .45)
M.put('mus', pad([45, 52, 57, 60], 2.6, 600, .2), 33.9, .5)
groove(M, 36.49, 53.3, (Am, F, C, G), drums=.9, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6, fade_out=2.0, mute=((25.7, 30.2), (31.6, 33.85)))
