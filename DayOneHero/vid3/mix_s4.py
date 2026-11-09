# s4 cues (space).  python mix_s4.py -> mix3_s4.wav
from a3 import *
M = Mix('s4')
room(M, 0, 3.35, .4); ding(M, 2.2, .3, 2400); ding(M, 2.3, .2, 3000)
M.put('sfx', boom(2.0), 3.4, .7); M.put('amb', lp(noise(4.4), 120)*.5, 3.35, .5)
for i in range(3): blip(M, 5.4 + i*.6, 600 - i*80, .25)
tp_pop(M, 7.25, .9, 'out'); M.put('sfx', riser(9.0, 200, 3000)*.35, 8.0, .35)
for x in (9.5, 13.6): ding(M, x, .18, 2400)
M.put('amb', lp(noise(52.0), 90)*.5, 17.5, .35)                       # space: near-silent rumble only
tp_pop(M, 17.65, .9); M.put('sfx', tone(220, 220, .5, .01, .3)*.3, 19.2, .1)
M.put('sfx', tone(200, 600, .8, .02, .1)*.4, 21.0, .3); M.put('sfx', tone(160, 110, .5, .01, .2, 'sq')*.4, 23.4, .25)   # inflate... MYTH buzzer
M.put('sfx', whoosh(1.2, 300, 3000), 24.6, .3)
for i in range(4): M.put('sfx', tone(900 - i*100, 500 - i*80, .2, .01, .1), 26.6 + i*.25, .1)
for i in range(16): click(M, 28.0 + i*.21, .15 if i < 10 else .3)
# NASA chamber
room(M, 32.85, 38.4, .5); M.put('amb', lp(noise(5.5), 180)*.4, 32.85, .4)
M.put('sfx', hp(noise(2.0), 4000)*env(int(2.0*SR), .05, .4), 36.4, .5)                 # hiss
for i in range(15): click(M, 38.6 + i*.143, .25)
for i in range(10): M.put('sfx', tone(1800 + rng.uniform(0, 1500), 2500, .03, .002, .01), 41.6 + i*.33, .06)   # tiny bubbles
room(M, 41.4, 50.47, .4); M.put('sfx', bp(noise(2.6), 200, 3000)*np.linspace(.3, 1, int(2.6*SR))*.6, 46.0, .4)  # air pumping in
ding(M, 48.3, .2, 2600)
# station pass
M.put('sfx', tone(900, 1200, .1, .005, .05), 50.5, .2)
M.put('sfx', riser(1.2, 200, 6000)*.6, 54.4, .4); M.put('sfx', whoosh(.8, 100, 8000), 55.35, 1.0); M.put('sfx', boom(1.5)*.5, 55.6, .5)
for i, x in enumerate((60.05, 60.5, 60.95)): blip(M, x, 700 + i*150, .3)
tp_pop(M, 62.2, .9, 'out'); tp_pop(M, 62.3, .9); ding(M, 62.35, .3, 3200)
room(M, 62.2, 69.91, .4); M.put('sfx', tone(900, 1200, .1, .005, .05), 65.2, .25); click(M, 65.35, .4)
# score
groove(M, 0, 3.3, (F, G), drums=.4, gain=.6, bar=4)
chordHit(M, 3.4, C, .55, 3.0); M.put('mus', pad([48, 55, 60, 64, 67, 72], 4.4, 2500, .1), 3.4, .3)
M.put('mus', pad([52, 59, 64, 67], 9.6, 1800, 1.0), 7.81, .35); [M.put('mus', mallet(m, 1.0), 8.0 + i*.5, .12) for i, m in enumerate([76, 79, 83, 86, 88, 86, 83, 79]*2 + [76, 79])]
M.put('mus', pad([45, 52, 57, 60, 64], 7.0, 1200, 1.0), 17.5, .35)
groove(M, 24.2, 32.8, (Am, F, Dm, E := [52, 56, 59]), drums=.3, gain=.65, bar=4, inst='mallet')
drone(M, 32.85, 8.5, (38, 45), .4); M.put('mus', pad([50, 57, 62], 9.0, 900, 1.0), 41.4, .3)
groove(M, 46.0, 50.4, (C, G, F, C), drums=.3, gain=.65, bar=4, inst='mallet')
groove(M, 50.47, 55.3, (Dm, Bb, F, C), drums=.8, gain=.85, bar=4)
chordHit(M, 62.3, C, .5); groove(M, 62.4, 69.9, (C, F, G, C), drums=1, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.45, duck=.6, mute=((55.3, 59.1),))
