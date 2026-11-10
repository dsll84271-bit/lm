# Ep4 h cues (floating-hoodie scare).  python mix_h.py -> mix3_h.wav
from a3 import *
M = Mix('h')
def street(t0, t1, g=.5):
    n = int((t1 - t0)*SR); a = lp(rng.standard_normal(n), 600)*.45 + bp(rng.standard_normal(n), 400, 1500)*.06; M.put('amb', np.stack([a, np.roll(a, 3000)], 1)*env(n, .3, .3)[:, None], t0, g)
def steps(t0, n, dt, g=.2): [M.put('sfx', lp(noise(.08), 600)*np.exp(-tt(.08)*40), t0 + i*dt, g) for i in range(n)]
street(0, 33.3); street(52.65, 78.39, .45)
steps(.2, 7, .42, .15); steps(2.4, 4, .3, .25)
M.put('sfx', bp(noise(.25), 800, 5000)*np.exp(-tt(.25)*10), GRAB := 3.7, .6); M.put('sfx', tone(700, 1100, .3, .01, .1, 'sq')*.3, 3.75, .35)
steps(3.8, 8, .2, .3); M.put('sfx', whoosh(.5, 300, 5000), 3.9, .35)
M.put('sfx', tone(220, 220, .4, .005, .3)*.5, 8.0, .35)
M.put('sfx', tone(500, 400, .1, .005, .05), 11.3, .15); M.put('sfx', tone(400, 500, .1, .005, .05), 11.6, .15)
ding(M, 15.6, .15, 2400); ding(M, 17.9, .15, 2800); M.put('sfx', bp(noise(.4), 500, 4000)*np.sin(np.linspace(0, np.pi, int(.4*SR))), 18.8, .3)   # zip
M.put('sfx', whoosh(.8, 300, 4000), 23.0, .4); M.put('sfx', bp(noise(.5), 300, 3000)*np.sin(np.linspace(0, np.pi, int(.5*SR)))*.5, 23.8, .3); ding(M, 24.6, .15, 2600)
M.put('sfx', tone(180, 200, 4.0, .5, 1.0)*.12, 29.0, .3)                                       # eerie float hum
n = int(19.4*SR); al = lp(rng.standard_normal(n), 250)*.5 + bp(rng.standard_normal(n), 2000, 5000)*.01; M.put('amb', np.stack([al, np.roll(al, 6000)], 1)*env(n, .3, .2)[:, None], 33.3, .5)
for i in range(10): M.put('sfx', lp(noise(.3), 1500)*np.sin(np.linspace(0, np.pi, int(.3*SR))), 33.5 + i*.33, .12)   # panting
M.put('sfx', tone(300, 380, .3, .01, .2)*.3, 36.3, .2)                                            # smug chuckle
M.put('sfx', tone(220, 140, 3.6, .4, .5)*.3 + lp(noise(3.6), 200)*.2, 39.8, .4)
M.put('sfx', tone(900, 900, .1, .002, .08)*.4, 47.3, .12); M.put('sfx', tone(1500, 1900, .05, .002, .02), 48.1, .2)   # tilt... blink
M.put('sfx', tone(900, 1700, .9, .01, .3, 'sq')*.3 + bp(noise(.9), 1000, 5000)*.3, 48.6, .6); M.put('sfx', boom(1.2)*.4, 48.6, .5)   # scream
thud(M, 53.0, .4); steps(53.2, 12, .14, .3); thud(M, 56.45, .9); M.put('sfx', tone(400, 200, .3, .01, .1)*.4, 56.5, .3)
M.put('sfx', tone(180, 200, 3.0, .3, .5)*.1, 58.6, .3); ding(M, 61.6, .2, 2600)
M.put('sfx', tone(900, 1300, .2, .01, .1)*.25, 65.2, .2)
for i in range(5): ding(M, 72.5 + i*.07, .1, 2000 + i*250)
# score
groove(M, 0, 3.6, (C, G), drums=.4, gain=.75, bar=4)
M.put('mus', brass([50, 57, 62], .6, 1800), GRAB, .5); groove(M, 3.8, 10.1, (Dm, Bb, F, C), drums=1, gain=.95, bar=4)
groove(M, 10.2, 22.0, (F, C, G, Am), drums=.4, gain=.8, bar=4)
M.put('mus', pad([45, 52, 57, 60], 11.0, 1100, 1.0), 22.0, .32); [M.put('mus', mallet(m, .9), 22.4 + i*.7, .1) for i, m in enumerate([69, 72, 76, 81, 76, 72, 69, 64]*2)]
drone(M, 33.3, 6.4, (38, 45), .35)
drone(M, 39.8, 8.7, (37, 38), .45); heartbeat(M, 43.6, 6, .72, .3)
chordHit(M, 52.7, F, .5, 2.0); groove(M, 52.8, 64.1, (F, C, G, C), drums=1, gain=.95, bar=4)
groove(M, 64.15, 68.8, (C, Am), drums=.3, gain=.7, bar=4, inst='mallet')
groove(M, 68.85, 78.39, (F, G, C, C), drums=.8, gain=.9, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.4, duck=.6, fade_out=1.5, mute=((48.55, 52.6),))
