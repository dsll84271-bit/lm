# s5 cues (the Moon).  python mix_s5.py -> mix3_s5.wav
from a3 import *
M = Mix('s5')
room(M, 0, 2.2, .4); ding(M, .9, .15, 2400)
M.put('sfx', whoosh(.4, 300, 3000), 3.25, .4); M.put('sfx', tone(1400, 1400, .05, .002, .03), 3.75, .3); ding(M, 3.9, .2, 2800)   # helmet clunk
M.put('sfx', boom(1.5), 5.2, .6); M.put('sfx', whoosh(1.5, 200, 6000), 5.3, .4)
M.put('amb', lp(noise(28.0), 90)*.5, 5.0, .4)
for i in range(3): blip(M, 8.0 + i*.2, 600 + i*120, .1)
ding(M, 11.7, .2, 2200); ding(M, 15.6, .25, 2600); M.put('sfx', tone(170, 120, .45, .01, .2, 'sq')*.4, 18.2, .25)
tp_pop(M, 20.0, .9); M.put('sfx', riser(3.6, 100, 4000)*.6 + lp(noise(3.6), 300)*np.linspace(0, 1, int(3.6*SR))**2*.6, 21.3, .7)
M.put('sfx', tone(220, 220, .4, .005, .3)*.5, 24.9, .4); M.put('sfx', tone(160, 110, .5, .01, .2, 'sq')*.4, 24.95, .3)
room(M, 26.0, 35.61, .4); M.put('sfx', bp(noise(.8), 400, 3000)*np.sin(np.linspace(0, np.pi, int(.8*SR))), 28.8, .35)   # curtains
M.put('sfx', tone(900, 1200, .1, .005, .05), 31.75, .25); click(M, 31.9, .4)
groove(M, 0, 5.0, (C, Am, F, G), drums=.4, gain=.7, bar=4)
M.put('mus', brass([48, 55, 60], .6, 1600), 5.2, .5); drone(M, 5.3, 2.3, (36, 43), .3)
groove(M, 7.64, 19.7, (Am, F, C, G), drums=.5, gain=.8, bar=4, inst='mallet')
drone(M, 19.75, 5.2, (38, 39), .45)
M.put('mus', pluck(72, .6), 25.5, .15); M.put('mus', pluck(71, .6), 25.75, .15); M.put('mus', pluck(70, .6), 26.0, .15); M.put('mus', pluck(69, 1.2), 26.25, .2)
groove(M, 26.6, 31.6, (F, C), drums=0, gain=.6, bar=4)
chordHit(M, 31.71, C, .45); groove(M, 31.8, 35.6, (C, F), drums=1, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6, mute=((24.85, 25.5),))
