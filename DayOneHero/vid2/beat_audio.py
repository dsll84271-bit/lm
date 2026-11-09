# Audio for the car-crash before/after test (0-16.0 s of segment p).
# Both versions share the same music (music_p.wav from audio.py) and narration lines p_0..p_2,
# so the comparison is about picture and sound design only.
#   before_mix.wav : original SFX from sfxmix.py
#   after_mix.wav  : new SFX timed to the Rig 2.0 shot list in sc_p2.js
# Run from vid2/ after:  python audio.py p   (and tts/gen_p.py for the narration)
import numpy as np, soundfile as sf, json
SR = 44100; END = 16.0; N = int(SR*END)
TM = json.load(open('timing.json'))['p']; ST, DU = TM['st'], TM['du']
IMP = ST[2]; LAND = IMP + 1.6; FLY0 = IMP + .1

# ---- original SFX (sfxmix.py, segment p), captured before its own mix step
src = open('sfxmix.py').read().rsplit('\nfor seg in', 1)[0]
src = src.replace("sfx=np.stack([out,out],1)", "sfx=np.stack([out,out],1); np.save('_sfx_p_orig.npy', sfx); return")
g0 = {}; exec(src, g0); g0['build']('p')
sfx_before = np.load('_sfx_p_orig.npy')[:N, 0]

# ---- new SFX, built from the same synth palette as ../vid/sfx1.py
g = {}; exec(open('../vid/sfx1.py').read().split('for at in')[0].replace('D=75.6', f'D={END}'), g)
add, tone, bp, whoosh, hit, rng = (g[k] for k in ('add', 'tone', 'bp', 'whoosh', 'hit', 'rng'))
def noise(x, dur, lo, hi, gn, dec=None):
    n = int(dur*SR); s = bp(rng.standard_normal(n), lo, hi)
    if dec: s *= np.exp(-np.arange(n)/SR*dec)
    add(s, x, gn)
def boom(x, gn=1.0):
    n = int(1.8*SR); t = np.arange(n)/SR
    add(np.sin(2*np.pi*np.cumsum(30 + 90*np.exp(-t*7))/SR)*np.exp(-t*2.0) + bp(rng.standard_normal(n), 40, 900)*np.exp(-t*3)*.9, x, gn)
pop_ = lambda x, gn=.15: add(tone(900, 1500, .08, .003, .05), x, gn)
def click(x, gn=.35): noise(x, .03, 1500, 7000, gn, 120)
def thump(x, gn=.5): add(hit(), x, gn); noise(x, .2, 150, 1200, gn*.6, 20)
def chirp(x, f=2600, gn=.1): add(tone(f, f*1.35, .06, .003, .04), x, gn); add(tone(f*1.1, f*1.5, .05, .003, .03), x + .08, gn*.8)

# ambience: light wind + a couple of distant birds (track is outdoors)
n = N; add(bp(rng.standard_normal(n), 120, 900)*(.6 + .4*np.sin(np.arange(n)/SR*.7)), 0, .05)
for x in (.6, 1.4, 3.1): chirp(x, 3200, .04)
# S1-S2
pop_(.8); add(whoosh(.35, 500, 6000), 2.0 - .2, .35)
for x in (2.55, 2.61, 2.69, 2.75): click(x)
add(whoosh(.5, 300, 2500), 3.05, .25); add(tone(700, 1050, .18, .004, .1), 3.75, .1)
# engine: a driverless car accelerating towards the camera, louder each cut
t = np.arange(int((IMP - 4.15)*SR))/SR; T = t/t[-1]
f0 = 55 + 45*T**1.5 + 2*np.sin(t*9); ph = 2*np.pi*np.cumsum(f0)/SR
eng = sum(np.sin(ph*h)/h for h in range(1, 7)) + bp(rng.standard_normal(len(t)), 80, 500)*.6
lvl = np.interp(t + 4.15, [4.15, 6.79, 6.8, 8.69, 8.7, 10.54, 10.55, IMP], [.05, .18, .3, .5, .25, .4, .75, 1.0])
add(np.tanh(eng*1.5)*lvl, 4.15, .35)
add(whoosh(.35, 400, 5000), 4.15 - .15, .3)
for i in range(12): add(tone(1400, 1400, .02, .002, .015), 4.4 + i*.1, .07)          # gauge ticks
pop_(5.2); pop_(5.9)
add(whoosh(.9, 200, 3000), 6.8 - .1, .55); pop_(7.0)
add(tone(420, 260, .12, .005, .08), 7.78, .3); add(tone(300, 190, .14, .005, .1), 7.92, .25)   # gulp
# stomps
thump(8.98, .7); noise(8.98, .25, 300, 3000, .25, 14)
thump(9.28, .95); boom(9.28, .35); noise(9.28, .3, 300, 3000, .3, 12)
# tension: heartbeat + riser
for x in (9.75, 10.22): thump(x, .45); thump(x + .17, .3)
n = int((IMP - 9.65)*SR); tt = np.arange(n)/SR
add(np.sin(2*np.pi*np.cumsum(300 + 1300*(tt/tt[-1])**2)/SR)*(tt/tt[-1])**2*.5 + bp(rng.standard_normal(n), 1500, 7000)*(tt/tt[-1])**3, 9.65, .3)
add(whoosh(.45, 300, 7000), 10.55 - .2, .6)
# IMPACT
boom(IMP, 1.0); add(hit(), IMP, .9); noise(IMP, .5, 600, 7000, .7, 9)
for f in (1870, 2330, 3110): add(tone(f, f*.97, .35, .002, .3), IMP + .01, .07)            # metal ring
add(whoosh(1.4, 400, 6000), FLY0, .55); add(tone(900, 300, 1.2, .01, .5), FLY0 + .05, .06)  # launch + doppler
# tyre screech while the car brakes
n = int(1.3*SR); tt = np.arange(n)/SR
scr = np.sin(2*np.pi*np.cumsum(2500 + 120*np.sin(tt*31) + 80*np.sin(tt*7))/SR)*.5 + bp(rng.standard_normal(n), 2000, 5000)*.5
add(scr*np.sin(np.linspace(0, np.pi, n))**.6, IMP + .2, .2)
pop_(11.25)
# boxes
add(hit(), LAND, .9); boom(LAND, .45)
for i in range(9): noise(LAND + i*.04 + rng.random()*.02, .12, 200, 2500, .5 - i*.03, 22)
for x in (12.86, 12.97, 13.08, 13.22, 13.35): noise(x, .1, 150, 1500, .35, 25); add(hit(), x, .2)
for i, x in enumerate(np.arange(13.35, 14.35, .2)): chirp(x, 2500 + (i % 3)*300, .09)    # dizzy tweets
add(tone(500, 900, .12, .004, .08), 14.42, .2)                                             # "!"
add(tone(320, 210, .12, .004, .08), 14.56, .2)                                             # crouch
n = int(.4*SR); tt = np.arange(n)/SR
add(np.sin(2*np.pi*np.cumsum(180 + 700*(tt/tt[-1])**.6 + 30*np.sin(tt*60))/SR)*np.exp(-tt*4), 14.66, .35)  # boing
add(whoosh(.35, 600, 6000), 14.68, .3)
thump(15.06, .4)
for j, f in enumerate((1318, 1568, 2093)): add(tone(f, f, .35, .002, .3), 15.32 + j*.06, .14)  # sparkle
o = g['out']; sfx_after = o/np.abs(o).max()*.8
# hard "suck-out" just before the hit (the silence makes the impact land)
pre = np.ones(N); i0, i1 = int((IMP - .09)*SR), int(IMP*SR); pre[i0:i1] = np.linspace(1, .12, i1 - i0)

def mix(sfx, gap=None):
    mus, _ = sf.read('music_p.wav'); mus = mus[:N]
    vo = np.zeros(N)
    for i in range(3):
        a, _ = sf.read(f'tts/p_{i}_m.wav'); a = a if a.ndim == 1 else a.mean(1); j = int(ST[i]*SR); m = min(len(a), N - j); vo[j:j + m] += a[:m]
    vo /= np.abs(vo).max()/.9
    env = np.abs(vo); k = int(.25*SR); sm = np.convolve(env, np.ones(k)/k, 'same'); duck = 1 - .6*np.clip(sm/.05, 0, 1)
    bed = mus*.42*duck[:, None] + np.stack([sfx, sfx], 1)[:N]*.42
    if gap is not None: bed *= gap[:, None]
    m = bed + vo[:, None]
    fo = np.ones(N); f0 = int((END - .35)*SR); fo[f0:] = np.linspace(1, 0, N - f0); m *= fo[:, None]
    m = np.tanh(m*1.1)/np.tanh(1.1); return m/np.abs(m).max()*.89
sf.write('before_mix.wav', mix(sfx_before), SR)
sf.write('after_mix.wav', mix(sfx_after, pre), SR)
print('before_mix.wav, after_mix.wav written')
