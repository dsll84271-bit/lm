# Ep4 s1 cues (Rule 1: eyes).  python mix_s1.py -> mix3_s1.wav
from a3 import *
M = Mix('s1')
M.put('amb', lp(noise(29.0), 150)*.4, 0, .3)
M.put('sfx', tone(400, 1200, 1.4, .02, .2)*.25, 1.2, .3)                                   # light rays
for x in (4.6, 6.6, 8.6): ding(M, x, .12, 2200)
for i in range(4): blip(M, 7.7 + i*.18, 900 + i*120, .1)
for i in range(20): M.put('sfx', tone(2400 + rng.uniform(0, 1500), 3500, .03, .002, .01), 11.6 + i*.25, .05)   # photon pings
M.put('sfx', whoosh(.8, 300, 5000), 18.2, .3); M.put('sfx', tone(400, 1200, 1.6, .02, .2)*.25, 19.6, .3)
M.put('sfx', hp(noise(3.5), 3000)*.4*env(int(3.5*SR), .05, .3), 23.6, .15)                   # TV static
M.put('sfx', tone(150, 110, .5, .01, .2, 'sq')*.4, 26.8, .3)
M.put('amb', lp(noise(19.3), 300)*.35, 29.95, .35)                                             # quiet study
for i in range(6): M.put('sfx', bp(noise(.1), 1500, 6000)*np.exp(-tt(.1)*30), 30.4 + i*.9 + rng.uniform(0, .2), .08)   # page rustles
M.put('sfx', tone(900, 600, .7, .02, .3)*.2, 40.4, .25); M.put('sfx', tone(600, 900, .7, .02, .3)*.2, 41.1, .2)      # cat eyes glint
room(M, 49.2, 69.12, .4)
M.put('sfx', tone(200, 700, 1.0, .05, .3)*.3, 49.2, .25); ding(M, 50.4, .2, 2600)
for x in (50.0, 51.1): M.put('sfx', tone(1200, 1500, .05, .003, .02), x, .12)              # eye darts
M.put('sfx', tone(1500, 2200, .08, .003, .03), 52.2, .2)                                     # BOING eyes wide
for i in range(4): M.put('sfx', lp(noise(.09), 500)*np.exp(-tt(.09)*40), 56.8 + i*.35, .3)   # Mum's footsteps
M.put('sfx', tone(900, 1500, .5, .01, .2, 'sq')*.25, 58.65, .35); M.put('sfx', bp(noise(.6), 300, 3000)*np.exp(-tt(.6)*5), 58.7, .5)   # scream + basket
thud(M, 59.3, .5)
for x in (62.3, 63.3): M.put('sfx', tone(1200, 1500, .05, .003, .02), x, .12)
M.put('sfx', tone(900, 1200, .1, .005, .05), 65.25, .25); click(M, 65.4, .4)
groove(M, 0, 17.1, (Am, F, C, G), drums=.3, gain=.7, bar=4, inst='mallet')
drone(M, 17.2, 12.6, (38, 45), .35)
M.put('mus', pad([45, 52, 57, 60], 19.0, 1100, 1.5), 29.95, .3); [M.put('mus', mallet(m, 1.0), 30.2 + i*.6, .1) for i, m in enumerate([69, 72, 76, 72, 69, 67, 64, 67]*3)]
groove(M, 49.2, 56.6, (C, G, Am, F), drums=.4, gain=.8, bar=4)
M.put('mus', brass([48, 55, 60], .5, 2000), 58.6, .45)
groove(M, 61.35, 65.1, (F, G), drums=.6, gain=.85, bar=4)
chordHit(M, 65.2, C, .45); groove(M, 65.3, 69.1, (C, F), drums=1, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.35, duck=.6, mute=((58.55, 59.4),))
