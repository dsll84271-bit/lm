# s1 cues (Rule 1: Earth's spin).  python mix_s1.py -> mix3_s1.wav
from a3 import *
M = Mix('s1')
# replay + faceplant
M.put('sfx', tone(300, 120, .6, .01, .3)*.5, .1, .25); waves(M, 0, 2.95, .6)                # tape slow-down
thud(M, 2.45, .9); crunch(M, 2.45, .8)
# park
M.put('amb', lp(noise(2.0), 600)*.5, 2.95, .3); tweet(M, 3.3, .06)
M.put('sfx', whoosh(1.2, 200, 6000), 4.9, .5); M.put('sfx', riser(.6, 300, 4000)*.5, 4.5, .3)
# space
M.put('amb', lp(noise(8.1), 120)*.6, 5.0, .5)
for i, x in enumerate((9.5, 10.5, 11.5)): blip(M, x, 700 + i*120, .1)
M.put('sfx', tone(300, 900, 2.5, .05, .3)*.25, 9.6, .3)                                         # gauge spin-up
ding(M, 15.5, .12, 1800); ding(M, 18.4, .15, 2400); ding(M, 15.0, .1, 2000)
M.put('sfx', whoosh(.5), 20.9, .4); blip(M, 24.0, 600, .2); blip(M, 24.9, 500, .2)
tp_pop(M, 28.7, .5, 'out'); tp_pop(M, 30.3, .5); M.put('sfx', tone(400, 1400, 1.4, .02, .1)*.3, 31.4, .3)
M.put('sfx', boom(1.5), 33.3, .5); ding(M, 35.2, .1)
M.put('sfx', whoosh(.8, 300, 8000), 37.4, .5); M.put('sfx', boom(2.0)*.6 + hp(noise(2.0), 2000)*np.exp(-tt(2.0)*4)*.3, 38.3, .5)   # sonic boom
# beach impact
waves(M, 39.95, 44.24, .6); M.put('sfx', riser(.35, 800, 8000), 40.0, .5); thud(M, 40.35, 1.2); M.put('sfx', boom(3.0), 40.35, 1.0); crunch(M, 40.36, 1.0)
for i in range(12): M.put('sfx', bp(noise(.05), 300, 2000)*np.exp(-tt(.05)*40), 40.5 + i*.12 + rng.uniform(0, .05), .3*(1 - i/12))
M.put('sfx', tone(500, 380, .5, .01, .3)*.5, 41.7, .12); squawk(M, 42.4, .3, .5)
# handled / kept
ding(M, 45.5, .3, 2600); ding(M, 45.62, .2, 3300)
for i in range(3): M.put('sfx', tone(600 + i*150, 900 + i*150, .12, .005, .05), 48.4 + i*.4, .2)
# mid-jump replay
room(M, 50.92, 54.3, .4); M.put('sfx', tone(200, 500, .2, .01, .05), 51.3, .2); M.put('sfx', tone(220, 220, .3, .005, .2)*.5, 51.9, .3); tp_pop(M, 53.0, .9, 'out')
# arrival, freeze, faceplant
waves(M, 54.3, 66.8, .7); tp_pop(M, 54.35, .9); M.put('sfx', tone(220, 220, .25, .005, .2)*.5, 54.55, .25); blip(M, 55.4, 800, .15)
M.put('sfx', whoosh(.6, 300, 5000), 56.6, .5); thud(M, 57.25, 1.0); crunch(M, 57.25, .9)
# rule 1
M.put('sfx', tone(900, 1200, .1, .005, .05), 59.15, .25); click(M, 59.3, .4)
# evening + clocks
for i in range(10): click(M, 68.3 + i*.21, .25)
ding(M, 70.4, .2, 2000)
# plane + jet lag
M.put('sfx', lp(noise(1.7), 900)*np.sin(np.linspace(0, np.pi, int(1.7*SR))), 72.4, .4); M.put('sfx', tone(160, 120, .5, .01, .1, 'sq')*.4, 73.05, .2)
M.put('sfx', tone(380, 260, .9, .05, .4)*.6, 74.4, .2)                                                       # yawn
for i in range(15): click(M, 77.2 + i*.2, .2 if i % 3 else .35)
M.put('sfx', lp(noise(1.2), 400)*np.abs(np.sin(np.linspace(0, 2*np.pi, int(1.2*SR)))), 80.4, .25)             # snore
# ---------------- score
M.put('mus', pad([45, 52, 57, 60], 2.6, 900, .2), .1, .35)
groove(M, 2.95, 5.0, (C, F), drums=0, bass_on=False, gain=.6, bar=4)
M.put('mus', pad([48, 55, 60, 64, 67], 9.8, 1800, 1.5), 5.0, .35); [M.put('mus', mallet(m, .9), 5.2 + i*.536, .15) for i, m in enumerate([72, 79, 76, 84, 72, 79, 76, 84, 74, 79, 77, 86, 74, 79, 77, 86, 72, 79])]
groove(M, 14.88, 28.0, (Am, F, C, G), drums=.5, gain=.8, bar=4, inst='mallet')
groove(M, 28.0, 36.4, (Dm, Bb, F, C), drums=.8, gain=.85, bar=4)
chordHit(M, 33.3, F, .45)
groove(M, 36.4, 39.9, (C, G), drums=1, gain=.9, bar=4)
M.put('mus', pluck(72, .6), 41.7, .15); M.put('mus', pluck(71, .6), 41.95, .15); M.put('mus', pluck(70, .6), 42.2, .15); M.put('mus', pluck(69, 1.2), 42.45, .2)
groove(M, 44.24, 50.9, (C, G, Am, F), drums=.6, gain=.85, bar=4)
groove(M, 50.92, 56.4, (F, G, C, Am), drums=.4, gain=.75, bar=4)
chordHit(M, 59.0, C, .5); groove(M, 59.1, 62.9, (C, F), drums=1, gain=.9, bar=4)
M.put('mus', pad([57, 60, 64], 3.8, 1400, .5), 62.95, .35)
groove(M, 66.8, 72.4, (Am, F, C, G), drums=.3, gain=.75, bar=4, inst='mallet')
groove(M, 72.43, 81.6, (F, C, Dm, G), drums=0, gain=.6, bar=4, inst='mallet')
M.render(mus_g=.5, sfx_g=.6, amb_g=.35, duck=.6, mute=((2.3, 2.95), (40.0, 41.6), (56.5, 59.0)))
