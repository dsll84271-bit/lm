# Ep4 s2 cues (Rule 2: breakfast).  python mix_s2.py -> mix3_s2.wav
from a3 import *
M = Mix('s2')
room(M, 0, 18.0, .45); M.put('amb', lp(noise(18.0), 2000)*.05, 0, .3)
M.put('sfx', tone(300, 200, .3, .01, .1)*.3, 3.4, .2)                                               # box tips
for i in range(24): M.put('sfx', bp(noise(.03), 2000, 8000)*np.exp(-tt(.03)*80), 3.95 + i*.045 + rng.uniform(0, .02), .22)   # cereal pours
M.put('sfx', lp(noise(.9), 1200)*np.sin(np.linspace(0, np.pi, int(.9*SR)))*.7, 5.8, .35)              # milk
M.put('sfx', tone(500, 900, .15, .01, .05), 8.4, .25); ding(M, 8.2, .12, 2800)
for i in range(10): M.put('sfx', bp(noise(.07), 300, 2500)*np.exp(-tt(.07)*25), 11.7 + i*.24, .45)   # chomp chomp
M.put('sfx', tone(260, 140, .35, .01, .15)*.6, 14.25, .45)                                            # gulp
M.put('sfx', lp(noise(.25), 900)*np.exp(-tt(.25)*14) + np.pad(tone(220, 120, .2, .005, .1), (0, int(.05*SR)))*.6, 15.4, .5)       # plop
for i in range(5): M.put('sfx', bp(noise(.07), 300, 2500)*np.exp(-tt(.07)*25), 16.0 + i*.2, .4)
M.put('sfx', tone(260, 140, .3, .01, .15)*.6, 16.9, .4); M.put('sfx', lp(noise(.25), 900)*np.exp(-tt(.25)*14) + np.pad(tone(220, 120, .2, .005, .1), (0, int(.05*SR)))*.6, 17.7, .5)
M.put('amb', lp(noise(8.6), 150)*.4, 18.0, .3)
for i in range(16): click(M, 19.5 + i*.37, .15)
M.put('sfx', lp(noise(6.0), 400)*(.5 + .5*np.sin(tt(6.0)*2*np.pi*.8))*.5, 20.0, .25)                    # churn
n = int(11.9*SR); street = lp(rng.standard_normal(n), 600)*.5; M.put('amb', np.stack([street, np.roll(street, 3000)], 1)*env(n, .3, .3)[:, None], 26.65, .5)
for i in range(28): M.put('sfx', lp(noise(.08), 500)*np.exp(-tt(.08)*40), 26.8 + i*.416, .22)          # slipper steps
for x in (29.0, 33.0): M.put('sfx', tone(500, 800, .25, .01, .1)*.4, x, .25)                            # gasps
M.put('amb', lp(noise(8.8), 150)*.4, 38.5, .3)
M.put('sfx', lp(noise(.7), 900)*np.sin(np.linspace(0, np.pi, int(.7*SR))), 39.4, .3); M.put('sfx', tone(600, 200, 2.0, .05, .3)*.2, 40.4, .25)   # glug, drain
M.put('sfx', tone(900, 1200, .1, .005, .05), 47.35, .25); click(M, 47.5, .4)
groove(M, 0, 11.3, (C, F, G, C), drums=.5, gain=.8, bar=4)
M.put('mus', pluck(72, .5), 12.0, .12); M.put('mus', pluck(76, .5), 12.5, .12); M.put('mus', pluck(79, .5), 13.0, .12)
M.put('mus', pluck(67, .5), 14.3, .15); M.put('mus', pluck(60, 1.0), 15.4, .2)
groove(M, 18.0, 26.6, (Am, F, C, G), drums=.3, gain=.7, bar=4, inst='mallet')
groove(M, 26.65, 38.4, (C, G, Am, F), drums=.8, gain=.85, bar=4)
groove(M, 38.5, 47.2, (F, C, G, C), drums=.4, gain=.75, bar=4, inst='mallet')
chordHit(M, 47.3, C, .45); groove(M, 47.4, 51.0, (C, F), drums=1, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.35, duck=.6)
