# w cues (window-cleaner rescue).  python mix_w.py -> mix3_w.wav
from a3 import *
M = Mix('w')
SNAP, SLIP, DEXIN, GRAB, FRZ, UNF, GO, IN, SPL = 10.6, 11.2, 16.3, 16.6, 19.3, 57.0, 58.85, 59.0, 59.3
n = int(12.2*SR); city = lp(rng.standard_normal(n), 500)*.6 + bp(rng.standard_normal(n), 800, 2500)*.08
M.put('amb', np.stack([city, np.roll(city, 4000)], 1)*env(n, .3, .3)[:, None], 0, .6)
for x in (1.2, 4.0, 7.5): M.put('sfx', tone(392, 392, .3, .01, .1, 'sq')*.3, x, .04)                   # distant horns
for i in range(6): M.put('sfx', tone(880 + (i % 3)*110, 880 + (i % 3)*110, .18, .01, .08), 9.1 + i*.25, .06)    # whistling
for i in range(5): M.put('sfx', bp(noise(.12), 2000, 6000)*np.sin(np.linspace(0, np.pi, int(.12*SR))), 9.0 + i*.3, .1)   # squeegee
M.put('sfx', bp(noise(.08), 1500, 8000)*np.exp(-tt(.08)*40), SNAP, .9); M.put('sfx', tone(900, 300, .25, .002, .1, 'sq')*.4, SNAP, .4)   # SNAP (cable whip)
thud(M, SNAP + .05, .5); M.put('sfx', bp(noise(.6), 300, 2000)*np.exp(-tt(.6)*4), SNAP + .3, .5)     # platform clang
M.put('sfx', tone(600, 900, .5, .01, .2)*.3, SLIP, .3)                                                    # yelp
n = int(7.0*SR); wn = bp(rng.standard_normal(n), 200, 1200)*.5*env(n, .3, .2); M.put('amb', np.stack([wn, np.roll(wn, 2000)], 1), 12.2, .9)  # wind (slow-mo)
M.put('sfx', tone(220, 220, .3, .005, .2)*.5, 14.8, .25); tp_pop(M, 15.95, .9, 'out'); tp_pop(M, DEXIN, .9)
M.put('sfx', bp(noise(.08), 300, 2500)*np.exp(-tt(.08)*30), GRAB, .7); M.put('sfx', tone(400, 700, .2, .01, .1), GRAB + .05, .2)
M.put('sfx', tone(4000, 4000, 1.0, .01, .5)*.4 + tone(300, 60, 1.0, .01, .5)*.5, FRZ, .35)              # time stops
n = int((UNF - FRZ)*SR); M.put('amb', np.stack([lp(rng.standard_normal(n), 150)]*2, 1)*env(n, .5, .3)[:, None], FRZ, .4)
for i in range(4): click(M, 21.4 + i*.0625, .3)
for x in (25.5, 25.9, 26.3): blip(M, x, 700, .2)
M.put('sfx', tone(900, 1200, .1, .005, .05), 28.95, .25)
M.put('sfx', whoosh(1.2, 300, 3000), 33.2, .4); thud(M, 34.6, .5); M.put('sfx', tone(160, 110, .5, .01, .2, 'sq')*.4, 35.8, .25)
M.put('sfx', tone(160, 110, .4, .01, .2, 'sq')*.4, 41.1, .2); ding(M, 42.7, .25, 2600)
for i in range(3): click(M, 44.0 + i*.33, .3)
M.put('sfx', tone(300, 1000, 1.4, .02, .1)*.3, 47.0, .25)
M.put('sfx', whoosh(1.0, 300, 4000), 50.2, .4); M.put('sfx', bp(noise(.7), 300, 3000)*np.exp(-tt(.7)*5), 52.6, .4)   # diver splash
M.put('sfx', tone(300, 900, 2.0, .05, .1)*.3, 53.4, .3)
M.put('sfx', riser(1.3, 300, 5000)*.6, 55.7, .3); M.put('sfx', tone(60, 300, .6, .01, .2)*.6, UNF, .4)
n = int(2.0*SR); wn = bp(rng.standard_normal(n), 200, 1500)*env(n, .05, .2); M.put('amb', np.stack([wn, wn], 1), UNF, 1.0)
tp_pop(M, GO, 1.1, 'out')
# pool
n = int(32.4*SR); pool = lp(rng.standard_normal(n), 900)*.4 + bp(rng.standard_normal(n), 1500, 4000)*.05; M.put('amb', np.stack([pool, np.roll(pool, 6000)], 1)*env(n, .1, .5)[:, None], IN, .5)
tp_pop(M, IN, 1.0); M.put('sfx', boom(2.0)*.6 + bp(noise(2.0), 200, 4000)*np.exp(-tt(2.0)*2.2), SPL, 1.0)
for i in range(20): M.put('sfx', bp(noise(.06), 800, 5000)*np.exp(-tt(.06)*40), SPL + .3 + i*.06 + rng.uniform(0, .04), .25*(1 - i/20))
M.put('sfx', lp(noise(7.0), 700)*env(int(7.0*SR), .2, 1.5), 64.14, .3)                                  # underwater
for i in range(14): M.put('sfx', tone(500 + rng.uniform(0, 600), 1200, .05, .003, .02), 64.4 + i*.45, .08)   # bubbles
M.put('sfx', bp(noise(.4), 400, 3000)*np.exp(-tt(.4)*6), 72.1, .6); M.put('sfx', tone(500, 300, .3, .01, .1, 'sq')*.3, 72.6, .2)   # surface + splutter
M.put('sfx', tone(4200, 4200, 4.4, .05, .8)*.5, 74.3, .2)                                                  # ear ringing
M.put('sfx', tone(900, 1200, .1, .005, .05), 78.0, .2); click(M, 78.15, .3)
for i in range(5): ding(M, 79.2 + i*.08, .1, 2000 + i*250)
M.put('sfx', tone(160, 110, .4, .01, .2, 'sq')*.35, 85.4, .2); ding(M, 87.7, .25, 2800)
# score
groove(M, 0, 8.9, (C, Am, F, G), drums=.6, gain=.75, bar=4)
M.put('mus', pad([57, 60, 64], 2.0, 1500, .4), 8.94, .3)
drone(M, SNAP, 5.6, (38, 44), .5); M.put('mus', brass([38, 45, 50], .8, 1100), SNAP, .5)
heartbeat(M, 12.4, 5, .7, .3)
chordHit(M, DEXIN, Dm, .5, 2.0); groove(M, DEXIN + .1, FRZ, (Dm, Bb), drums=1, gain=.95, bar=4)
M.put('mus', pad([50, 57, 62, 65], 9.4, 900, 1.0), FRZ + .3, .35)
groove(M, 28.9, 41.0, (Dm, Bb, F, C), drums=.3, gain=.65, bar=4, inst='mallet')
groove(M, 41.0, 55.6, (F, C, G, Am), drums=.5, gain=.75, bar=4, inst='mallet')
M.put('mus', riser(1.4, 200, 5000)*.4, 55.6, .35)
chordHit(M, GO, C, .6, 2.5); groove(M, IN + .3, 64.1, (C, G, Am, F), drums=1, gain=1, bar=4)
M.put('mus', pad([60, 64, 67, 71], 7.8, 1200, 1.0), 64.14, .35)
groove(M, 72.05, 84.3, (C, F, G, C), drums=.8, gain=.9, bar=4)
chordHit(M, 84.37, F, .4, 2.0); groove(M, 84.5, 91.3, (F, G, C, C), drums=.7, gain=.85, bar=4)
M.render(mus_g=.5, sfx_g=.6, amb_g=.45, duck=.6, mute=((FRZ, FRZ + .3), (SPL, SPL + .1)))
