# Cold open cues.  python mix_o.py -> mix3_o.wav
from a3 import *
M = Mix('o')
# beach ambience + the arrival
waves(M, 0, 7.6, .9); waves(M, 19.3, 24.2, .8); waves(M, 22.0, 24.2, .4)
for x in (.15, 3.9): squawk(M, x, .12, -.6)
tp_pop(M, .35, 1.0)
M.put('sfx', whoosh(.6, 300, 5000), .4, .5)
thud(M, 1.0, 1.0); crunch(M, 1.0, .9); M.put('sfx', bp(noise(.7), 200, 2500)*np.exp(-tt(.7)*5), 1.02, .5)
for i in range(6): M.put('sfx', tone(300 + (i % 2)*120, 260, .1, .005, .05), 1.25 + i*.2, .12)         # legs flailing "wiggle"
for i in range(5): M.put('sfx', tone(420, 400, .05, .002, .03), 1.3 + i*.13, .05)                       # gull steps
squawk(M, 2.2, .45, .4)
M.put('sfx', tone(180, 700, .35, .01, .1)*.6 + bp(noise(.35), 300, 2000)*.4, 2.62, .5)                 # SHLOOP out of the sand
M.put('sfx', whoosh(.4, 300, 3000), 2.65, .4); thud(M, 3.02, .6); tweet(M, 3.15, .1)
for i in range(4): M.put('sfx', bp(noise(.05), 600, 2500)*np.exp(-tt(.05)*50), 4.3 + i*.04, .4)         # PTOO
# split + rewind
M.put('sfx', whoosh(.35, 500, 7000), 5.0, .4); blip(M, 6.0, 700, .2)
M.put('sfx', tone(220, 220, .2, .005, .1)*.5, 7.55, .3); rewind(M, 7.6, .85, .35)
# this morning
for i in range(int(.9/.12)): M.put('sfx', tone(2100, 2100, .06, .002, .02, 'sq'), 8.5 + i*.12, .12)      # alarm
click(M, 9.38, .6); room(M, 8.45, 16.95, .5)
M.put('sfx', tone(400, 300, .3, .02, .15)*.6, 9.6, .15)                                                # yawn
for i in range(6): ding(M, 11.0 + i*.07, .1, 1800 + i*300)                                             # shimmer
tp_pop(M, 13.1, .9, 'out'); tp_pop(M, 13.25, .9); tp_pop(M, 14.55, .6, 'out'); tp_pop(M, 14.68, .6)
M.put('sfx', tone(500, 900, .12, .01, .05), 15.6, .2); M.put('sfx', tone(700, 1100, .12, .01, .05), 15.72, .15)   # thought bubble bloops
M.put('sfx', tone(200, 500, .2, .01, .05), 16.3, .2); tp_pop(M, 16.82, 1.0, 'out')
# globe flight
M.put('sfx', riser(1.4, 400, 5000)*.6, 17.1, .4); M.put('sfx', tone(400, 1600, 1.35, .05, .1)*.25, 17.1, .4); tp_pop(M, 18.48, .5)
# face down again
for i in range(5): M.put('sfx', tone(300 + (i % 2)*120, 260, .1, .005, .05), 19.4 + i*.22, .1)
M.put('sfx', lp(noise(.4), 500)*env(int(.4*SR), .05, .2), 20.6, .4)                                    # muffled mmf
# superpower montage
M.put('sfx', whoosh(.4), 22.1, .3); ding(M, 22.45, .15, 3000)
for x in (24.2, 24.55, 24.9): horn(M, x, .1, 392 if x < 24.5 else 330)
tp_pop(M, 24.32, .7); tp_pop(M, 24.72, .5, 'out'); tp_pop(M, 24.82, .7, pan=.4)
tp_pop(M, 25.25, .7); M.put('amb', bp(noise(.95), 300, 3000)*.3, 25.15, .4)                            # cafe murmur
tp_pop(M, 26.25, .7); [ding(M, 26.4 + i*.18, .12, 2200) for i in range(4)]                             # school bell
for x in (24.32, 25.25, 26.25): ding(M, x + .15, .08, 3400)                                            # tick chips
# bad news
scratch(M, 27.85, .6); heartbeat(M, 28.3, 3, .66, .35); M.put('sfx', boom(1.5), 29.3, .4)
# title
for x, md in ((30.55, 'in'), (31.55, 'out'), (31.68, 'in'), (32.5, 'out'), (32.63, 'in')): tp_pop(M, x, .6, md)
# ---------------- score
M.put('mus', pluck(72, .6), 1.25, .15); M.put('mus', pluck(71, .6), 1.6, .15); M.put('mus', pluck(70, .6), 1.95, .15); M.put('mus', pluck(69, 1.2), 2.3, .2)   # sad descending "womp"
M.put('mus', brass([48, 55], 1.0, 1200), 2.3, .25)
end = groove(M, 4.0, 7.55, (C, F, G, C), drums=0, bass_on=False, gain=.75, bar=4)
end = groove(M, 9.3, 12.9, (F, G, C, Am), drums=0, gain=.8, bar=4)
chordHit(M, 13.3, C, .5, 1.8)
groove(M, 13.4, 16.8, (C, G, Am, F), drums=.4, gain=.85, bar=4)
M.put('mus', pad([60, 64, 67, 72], 2.4, 3000, .3), 16.95, .35); [M.put('mus', mallet(m, .6), 17.1 + i*.17, .2) for i, m in enumerate([72, 76, 79, 84, 79, 76, 72, 84])]
groove(M, 19.3, 21.9, (F, C), drums=0, bass_on=True, gain=.6, bar=4)
groove(M, 22.0, 27.8, (C, G, Am, F), drums=1., gain=1., bar=4)
drone(M, 28.0, 2.4, (36, 43), .5); M.put('mus', brass([36, 42, 48], 1.2, 900), 29.3, .5)
chordHit(M, 30.3, C, .6, 2.5); groove(M, 30.4, 34.5, (C, G, F, C), drums=1., gain=.95, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.35, duck=.6, mute=((27.85, 28.0),))
