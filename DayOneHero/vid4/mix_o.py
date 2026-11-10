# Ep4 cold open cues.  python mix_o.py -> mix3_o.wav
from a3 import *
M = Mix('o')
def step(t0, g=.25): M.put('sfx', lp(noise(.09), 500)*np.exp(-tt(.09)*40), t0, g)
def rustle(t0, d, g=.3): M.put('sfx', bp(noise(d), 800, 5000)*np.sin(np.linspace(0, np.pi, int(d*SR)))*(.6 + .4*np.sin(tt(d)*40)), t0, g)
room(M, 0, 10.85, .45)
for i in range(int(1.1/.12)): M.put('sfx', tone(2100, 2100, .06, .002, .02, 'sq'), .05 + i*.12, .14)       # alarm
click(M, 1.12, .7)
rustle(1.6, .6, .5); M.put('sfx', tone(300, 500, .12, .01, .05)*.5, 2.35, .25)                                 # duvet, pillow springs back
for i in range(5): step(2.55 + i*.42, .3)
for i in range(3): step(3.3 + i*.45, .35)
M.put('sfx', tone(220, 220, .4, .005, .3)*.5, 4.2, .25)                                                         # "?" sting
M.put('sfx', boom(1.5)*.6, 4.6, .5); M.put('sfx', tone(5200, 5200, 2.5, .3, 1.5)*.25, 4.7, .05)               # lights out, faint ring
heartbeat(M, 5.3, 6, .75, .25); blip(M, 6.6, 500, .18); blip(M, 7.4, 600, .18)
thud(M, 9.6, .5); M.put('sfx', tone(400, 250, .25, .005, .1)*.4, 9.65, .2)                                      # bonk
room(M, 10.85, 28.85, .4)
for i in range(6): ding(M, 12.0 + i*.07, .1, 1800 + i*300)
M.put('sfx', whoosh(.7, 300, 7000), 14.7, .45); M.put('sfx', tone(1200, 2400, .6, .05, .3)*.2, 14.85, .25)
ding(M, 22.6, .25, 2600); M.put('sfx', tone(500, 900, .12, .01, .05), 24.3, .25)
M.put('sfx', bp(noise(3.0), 2500, 8000)*(.5 + .5*np.sin(tt(3.0)*2*np.pi*3.5))**2, 25.2, .22)                   # brushing
for x in (28.85, 30.05, 31.1): M.put('sfx', whoosh(.35, 400, 7000), x - .1, .35)
for i in range(3): step(28.9 + i*.38, .3)
M.put('sfx', bp(noise(.3), 1500, 6000)*np.exp(-tt(.3)*12), 29.5, .25)                                          # popcorn crunch
M.put('sfx', tone(350, 280, .3, .01, .15)*.5, 30.5, .2); M.put('sfx', tone(400, 300, .3, .01, .15)*.5, 30.62, .15)   # "huh?"
M.put('sfx', tone(220, 330, .45, .02, .1, 'sq')*.25, 31.3, .25); click(M, 31.7, .5); M.put('sfx', tone(800, 1600, .3, .01, .1)*.3, 31.8, .2)  # tin creak, pop
ding(M, 32.3, .2, 3000)
M.put('sfx', whoosh(.5, 300, 4000), 38.2, .5); M.put('sfx', tone(150, 110, .5, .01, .2, 'sq')*.45, 38.6, .3)    # X + buzzer
M.put('sfx', whoosh(.5), 39.85, .4)
for i in range(10): step(39.95 + i*.42, .2)
# score
drone(M, 0.2, 4.5, (38, 45), .3); M.put('mus', pad([50, 53, 57], 4.4, 900, 1.0), 0.2, .25)
groove(M, 10.85, 18.0, (C, F, G, C), drums=0, bass_on=False, gain=.75, bar=4, inst='mallet')
groove(M, 18.0, 28.8, (F, C, G, Am), drums=.3, gain=.8, bar=4)
groove(M, 28.85, 33.7, (C, G, Am, F), drums=1, gain=.95, bar=4)
drone(M, 33.8, 6.0, (36, 43), .5); M.put('mus', brass([36, 42, 48], 1.2, 900), 38.6, .5)
chordHit(M, 39.9, C, .6, 2.5); groove(M, 40.0, 44.5, (C, G, F, C), drums=1, gain=.95, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.35, duck=.6, mute=((4.55, 10.85),))
