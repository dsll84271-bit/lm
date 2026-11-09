# s2 cues (Rule 2: teleporting is loud).  python mix_s2.py -> mix3_s2.wav
from a3 import *
M = Mix('s2')
waves(M, 0, 1.45, .6); tp_pop(M, 1.15, .7, 'out')
room(M, 1.45, 2.05, .5); M.put('amb', lp(noise(.6), 2000)*.1, 1.45, .3)        # kitchen radio-ish hiss
tp_pop(M, ARR := 1.7, 1.4); M.put('sfx', boom(2.5), 1.7, 1.0); M.put('sfx', hp(noise(1.0), 3000)*np.exp(-tt(1.0)*3), 1.75, .5)   # the BANG + glass
M.put('sfx', tone(1200, 400, .3, .005, .1, 'sq')*.4, 1.78, .2)                                          # dog yelp
M.put('sfx', tone(4000, 4000, 4.0, .01, .5)*.6, 2.05, .1)                                               # freeze-frame ring
M.put('sfx', tone(220, 220, .3, .005, .2)*.5, 2.05, .3)
# air diagrams
M.put('amb', bp(noise(8.6), 200, 1500)*.5, 6.14, .3)
for i in range(6): blip(M, 7.4 + i*.06, 900 + i*80, .08)
for i in range(25): M.put('sfx', tone(700 + (i % 5)*90, 900 + (i % 5)*90, .05, .002, .03), 11.2 + i*.05, .08)
tp_pop(M, 15.15, 1.0); M.put('sfx', whoosh(.7, 300, 7000), 15.15, .6)
tp_pop(M, 17.85, .8, 'out'); M.put('sfx', riser(2.0, 200, 3000)*.5 + whoosh(2.0, 200, 2000)*.3, 18.4, .5); thud(M, 21.2, 1.0); M.put('sfx', boom(1.5), 21.2, .7)
for x in (23.7, 24.0, 24.05, 24.4, 25.1, 25.4): thud(M, x, .3)
# student + numbers
room(M, 26.76, 32.1, .4); [click(M, 27.3 + i*.11, .15) for i in range(12)]; [click(M, 29.0 + i*.13, .12) for i in range(8)]
M.put('sfx', tone(400, 900, .7, .02, .1)*.4, 32.3, .25); M.put('sfx', tone(400, 1100, .9, .02, .1)*.4, 33.3, .3); M.put('sfx', boom(1.2), 34.0, .4)
# jet engine
n = int(4.15*SR); jet = bp(noise(4.15), 300, 6000)*.6 + lp(noise(4.15), 200)*.6 + np.sin(2*np.pi*1900*tt(4.15))*.08; M.put('amb', np.stack([jet, np.roll(jet, 500)], 1)*env(n, .3, .2)[:, None], 35.6, .9)
# kitchen aftermath
room(M, 39.75, 50.1, .4)
M.put('sfx', bp(noise(.3), 300, 2500)*np.exp(-tt(.3)*10), 40.55, .7); M.put('sfx', tone(600, 200, .25, .005, .1)*.4, 40.55, .2)     # mug splosh
for i in range(18): M.put('sfx', tone(300, 280, .05, .002, .02)*.5, 41.8 + i*.09, .06)                                          # dog trembling
for i in range(30): M.put('sfx', bp(noise(.03), 1500, 7000)*np.exp(-tt(.03)*80), 43.6 + i*.065 + rng.uniform(0, .02), .3*(1 - i/30), pan=rng.uniform(-.8, .8))   # windows rattle
M.put('sfx', tone(900, 1200, .1, .005, .05), 46.45, .25); click(M, 46.6, .4)
# score
M.put('mus', pad([60, 64, 67], 1.4, 1500, .3), 0, .3)
M.put('mus', pad([36, 43, 48], 4.0, 700, .05), 2.05, .4)
groove(M, 6.14, 14.8, (Am, F, C, G), drums=.3, gain=.7, bar=4, inst='mallet')
groove(M, 14.8, 26.7, (Dm, Bb, F, C), drums=.8, gain=.85, bar=4)
groove(M, 26.76, 32.1, (F, C, G, Am), drums=0, gain=.65, bar=4)
chordHit(M, 34.0, Dm, .45)
groove(M, 39.75, 46.3, (C, G, Am, F), drums=.7, gain=.85, bar=4)
chordHit(M, 46.39, C, .45); groove(M, 46.5, 50.1, (C, F), drums=1, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6, mute=((1.6, 2.05), (35.6, 39.7)))
