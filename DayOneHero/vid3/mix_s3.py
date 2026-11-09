# s3 cues (Everest).  python mix_s3.py -> mix3_s3.wav
from a3 import *
M = Mix('s3')
room(M, 0, 3.0, .4)
for i in range(3): M.put('sfx', tone(500 - i*40, 300, .25, .01, .1, 'sq')*.3, .25 + i*.3, .2)            # mum shouting
M.put('sfx', tone(500, 380, .15, .005, .05, 'sq')*.4, .9, .25); M.put('sfx', tone(520, 400, .15, .005, .05, 'sq')*.4, 1.15, .2)   # woof
tp_pop(M, 2.65, .8, 'out')
M.put('amb', lp(noise(3.4), 800)*.3, 3.0, .3); M.put('sfx', tone(500, 900, .12, .01, .05), 3.3, .2); ding(M, 3.2, .1, 2600); ding(M, 5.0, .1, 2900)
M.put('amb', lp(noise(3.6), 120)*.6, 6.4, .4); ding(M, 8.4, .2, 2200); tp_pop(M, 9.75, .5, 'out')
wind(M, 10.0, 27.7, .8, 300, 2000); tp_pop(M, AR := 10.05, 1.0)
for i in range(18): click(M, 10.3 + i*.11, .12)
M.put('sfx', boom(1.6)*.7, 17.13, .5); M.put('sfx', tone(160, 120, .5, .01, .2, 'sq')*.4, 17.13, .25)
M.put('sfx', tone(900, 300, 1.8, .05, .3)*.25, 20.6, .3); M.put('sfx', tone(600, 200, 1.7, .05, .3)*.3, 24.3, .3)   # mercury drop
for i in range(12): M.put('sfx', bp(noise(.04), 3000, 9000)*np.exp(-tt(.04)*60), 21.0 + i*.4, .12)                 # ice crackle
for i in range(4): M.put('sfx', lp(noise(.5), 1500)*np.sin(np.linspace(0, np.pi, int(.5*SR))), 20.0 + i*1.6, .15)   # breath
wind(M, 27.7, 30.2, .7, 300, 2000); M.put('amb', bp(noise(4.6), 200, 1200)*.3, 30.2, .3)
for i in range(3): blip(M, 30.4 + i*.25, 600 + i*100, .12)
wind(M, 34.8, 61.75, .7, 300, 2000)
for i in range(3): M.put('sfx', lp(noise(.8), 1200)*np.sin(np.linspace(0, np.pi, int(.8*SR))), 34.9 + i*1.8, .25)    # breaths
for i in range(3): blip(M, 35.6 + i*.15, 1000, .1)
M.put('sfx', tone(400, 250, .4, .01, .2), 37.0, .15)
for i in range(4): M.put('sfx', tone(180, 180, .2, .01, .1)*.5 + lp(noise(.2), 600)*.3, 40.4 + i*.9, .2)              # crunchy footsteps
for i in range(4): ding(M, 41.0 + i*.08, .1, 2000 + i*200)
for i in range(3): click(M, 45.7 + i*.33, .4)
for i in range(int(4/.25)): click(M, 49.5 + i*.25, .18)
M.put('sfx', tone(600, 300, 3.0, .3, .3)*.15, 54.5, .3)                                                    # woozy
M.put('sfx', tone(300, 80, 1.0, .05, .3)*.6, 57.6, .4); tp_pop(M, 58.6, .9, 'out'); tp_pop(M, 58.85, .9)
room(M, 58.75, 65.36, .4); [M.put('sfx', lp(noise(.6), 2500)*np.sin(np.linspace(0, np.pi, int(.6*SR))), 59.2 + i*.7, .4) for i in range(4)]   # panting
M.put('sfx', tone(900, 1200, .1, .005, .05), 61.8, .25); click(M, 61.95, .4)
# score
groove(M, 0, 3.0, (Am, F), drums=.5, gain=.6, bar=4)
M.put('mus', pad([60, 64, 67, 71], 3.4, 2000, .5), 3.0, .3); [M.put('mus', mallet(m, .8), 3.1 + i*.4, .12) for i, m in enumerate([76, 79, 83, 84, 83, 79, 76, 72])]
M.put('mus', pad([48, 55, 60, 64], 3.6, 1500, 1.0), 6.4, .35)
chordHit(M, AR, C, .5, 2.5); groove(M, AR + .1, 13.5, (C, G, F, C), drums=.8, gain=.9, bar=4)
drone(M, 13.56, 6.0, (38, 45), .45); M.put('mus', brass([38, 44, 50], 1.4, 900), 17.13, .5)
groove(M, 19.55, 27.6, (Am, Em, F, C), drums=.3, gain=.7, bar=4, inst='mallet')
groove(M, 27.7, 40.3, (Dm, Am, Bb, F), drums=.4, gain=.75, bar=4, inst='mallet')
groove(M, 40.34, 48.5, (Am, F, C, G), drums=.6, gain=.8, bar=4)
M.put('mus', pad([57, 60, 64], 5.4, 1200, 1.0), 48.6, .35)
M.put('mus', pad([60, 64, 67, 72], 3.5, 2500, .3), 54.0, .3); M.put('mus', saw(mtof(48), 3.5)*np.linspace(1, 0, int(3.5*SR))*.15, 54.0, .3)
drone(M, 57.55, 1.3, (36, 37), .5)
chordHit(M, 61.75, C, .45); groove(M, 61.85, 65.3, (C, F), drums=1, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6, mute=((57.5, 57.6),))
