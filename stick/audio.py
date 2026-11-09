# Score + SFX + voice for the 75-second dinosaur test.   python audio.py  -> mix_test.wav
# Everything is synthesised here (numpy), so it is free to use on a monetised channel.
import numpy as np, soundfile as sf, json
from scipy.signal import butter, lfilter, fftconvolve
SR = 44100; END = 75.0; N = int(SR*END); rng = np.random.default_rng(11)
L = [0.2, 2.7, 6.4, 11.9, 14.8, 16.6, 25.0, 29.3, 33.6, 38.6, 45.1, 49.3, 52.1, 57.8, 64.7]
DINO_HIT, ROAR, CRACK, SNEEZE = 10.7, 31.8, 44.4, 67.6
mus = np.zeros((N, 2)); sfx = np.zeros((N, 2))
def put(buf, sig, t0, g=1.0, pan=0.0):
    i = int(t0*SR); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    if sig.ndim == 1: sig = np.stack([sig*np.sqrt((1 - pan)/2)*1.41, sig*np.sqrt((1 + pan)/2)*1.41], 1)
    buf[i:i + n] += sig[:n]*g
def bp(x, lo, hi, o=2): b, a = butter(o, [lo/(SR/2), hi/(SR/2)], 'band'); return lfilter(b, a, x)
def lp(x, f, o=2): b, a = butter(o, f/(SR/2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f/(SR/2), 'high'); return lfilter(b, a, x)
def env(n, a=.005, r=.1):
    e = np.ones(n); A = max(1, int(a*SR)); R = max(1, int(r*SR)); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e
mtof = lambda m: 440*2**((m - 69)/12)
tt = lambda d: np.arange(int(d*SR))/SR
# ---------------------------------------------------------------- instruments
def saw(f, d, det=(-.12, 0, .12)):
    t = tt(d); s = sum(2*((t*f*(1 + c/100)) % 1) - 1 for c in det)/len(det); return s
def pad(ms, d, cut=1600, a=.8):
    s = sum(saw(mtof(m), d) for m in ms)/len(ms); s = lp(s, cut, 2); return s*env(len(s), a, min(1.2, d*.4))
def sub(m, d): t = tt(d); return np.sin(2*np.pi*mtof(m)*t)*env(len(t), .01, .15)
def pluck(m, d=.5, br=1.):
    t = tt(d); f = mtof(m); s = np.sin(2*np.pi*f*t) + .4*br*np.sin(2*np.pi*2*f*t)*np.exp(-t*14) + .2*np.sin(2*np.pi*3*f*t)*np.exp(-t*20); return s*np.exp(-t*6)*env(len(t), .002, .05)
def bass(m, d=.28): t = tt(d); f = mtof(m); s = np.tanh(2.2*(np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t))); return lp(s, 900)*np.exp(-t*5)*env(len(t), .004, .04)
def kick(g=1.):
    t = tt(.45); f = 45 + 110*np.exp(-t*30); return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*7) + .3*bp(rng.standard_normal(len(t)), 1500, 6000)*np.exp(-t*90))*g
def snare(): t = tt(.25); return (bp(rng.standard_normal(len(t)), 1200, 8000)*.9 + .5*np.sin(2*np.pi*190*t))*np.exp(-t*16)
def hat(o=False): t = tt(.25 if o else .05); return hp(rng.standard_normal(len(t)), 7000)*np.exp(-t*(15 if o else 90))
def tom(f=90): t = tt(.6); return np.sin(2*np.pi*np.cumsum(f + 80*np.exp(-t*12))/SR)*np.exp(-t*5) + .2*bp(rng.standard_normal(len(t)), 200, 2000)*np.exp(-t*20)
def boom(d=2.5): t = tt(d); return np.sin(2*np.pi*np.cumsum(28 + 70*np.exp(-t*4))/SR)*np.exp(-t*1.6) + lp(rng.standard_normal(len(t)), 600)*np.exp(-t*3)*.7
def riser(d, lo=200, hi=6000): t = tt(d); k = t/d; return bp(rng.standard_normal(len(t)), lo, hi)*k**2 + np.sin(2*np.pi*np.cumsum(200 + 1600*k**2)/SR)*k**2*.4
def whoosh(d=.45, lo=400, hi=6000): t = tt(d); return bp(rng.standard_normal(len(t)), lo, hi)*np.sin(np.linspace(0, np.pi, len(t)))**2
def tone(f0, f1, d, a=.004, r=.1, wave='sin'):
    t = tt(d); f = np.linspace(f0, f1, len(t)); ph = 2*np.pi*np.cumsum(f)/SR; s = np.sin(ph) if wave == 'sin' else np.sign(np.sin(ph))*.6; return s*env(len(t), a, r)
def bell(f, d=3.0): t = tt(d); return (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*2) + .3*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*4) + .3*np.sin(2*np.pi*f*.5*t))*np.exp(-t*1.2)
# ---------------------------------------------------------------- SCORE (D minor, 100 bpm)
B = .6; DM, BB, FF, CC = [62, 65, 69], [58, 62, 65], [57, 60, 65], [60, 64, 67]
# hook: drone + heartbeat + riser, cut to silence before "the dinosaurs"
put(mus, pad([38, 45, 50], 10.5, 700, 2.0), .2, .5); put(mus, sub(26, 10.5), .2, .35)
for i in range(int(10/(2*B))): put(mus, kick(.5 + .04*i), .6 + i*2*B, .55); put(mus, kick(.35), .6 + i*2*B + .22, .4)
for i in range(int(10.4/(B/2))): put(mus, hat(), .4 + i*B/2, .05 + .002*i, pan=.3)
put(mus, riser(1.6), DINO_HIT - 1.6, .35)
put(mus, boom(3.0), DINO_HIT, .9); put(mus, pad([38, 50, 57, 62], 4.0, 1200, .05), DINO_HIT, .45)
# title + hour 1
put(mus, boom(2.5), 11.5, .6); [put(mus, tom(80 - i*6), 11.55 + i*.15, .5) for i in range(3)]; put(mus, pad([50, 57, 62, 64], 3.0, 2000, .3), 11.6, .35)
put(mus, bell(mtof(50), 4.0), 14.8, .35)
# main groove 16.5 -> roar
def groove(t0, t1, prog=(DM, BB, FF, CC), bass_on=True, drums=1., arp=True, gain=1.):
    nb = int((t1 - t0)/B)
    for i in range(nb):
        t = t0 + i*B; ch = prog[(i//8) % len(prog)]
        if bass_on: put(mus, bass(ch[0] - 24), t, .5*gain); put(mus, bass(ch[0] - 24), t + B/2, .35*gain)
        if arp: put(mus, pluck(ch[i % 3] + 12, .4), t + B/4, .18*gain, pan=-.3 + .6*((i % 4)/3))
        if drums: put(mus, kick(), t, .45*drums*gain) if i % 2 == 0 else put(mus, snare(), t, .28*drums*gain); put(mus, hat(), t + B/2, .1*drums*gain, pan=.4)
groove(16.5, 22.6, drums=.0, arp=True, gain=.8); groove(22.6, 27.1, drums=1, gain=1)
for i, m in enumerate([74, 72, 69, 72, 74, 77, 74, 72]): put(mus, pluck(m, .3, .5), 27.15 + i*.26, .25, pan=.2)   # "obviously" pizzicato
put(mus, pad([38, 44, 50], 2.6, 500, .3), 29.2, .5); put(mus, sub(26, 2.6), 29.2, .4)
put(mus, riser(1.0, 100, 3000), ROAR - 1.0, .3); put(mus, boom(2.0), ROAR, .8)
# freeze, films (action loop), science
for i in range(int(3.4/(B/2))): t = 35.0 + i*B/2; put(mus, tom(70 if i % 2 else 100), t, .35); put(mus, hat(True), t + B/4, .08)
put(mus, pad([50, 53, 57], 3.4, 1500, .1), 35.0, .25)
for i in range(int(5.8/(B/2))): t = 38.6 + i*B/2; put(mus, pluck([74, 77, 81, 77][i % 4], .25, .3), t, .14, pan=.4); put(mus, sub(38, .25), t, .12) if i % 2 == 0 else None
put(mus, riser(2.0, 300, 7000), CRACK - 2.0, .25); put(mus, boom(2.0), CRACK, .7)
# light comic groove for the estimates, the bike and the shops (F major feel)
groove(45.0, 64.4, prog=(FF, CC, DM, BB), drums=.6, gain=.75)
# ominous end + tease
put(mus, pad([38, 39, 45, 50], 4.2, 800, 1.0), 64.4, .5); put(mus, sub(26, 4.2), 64.4, .4); put(mus, riser(2.0, 200, 5000), SNEEZE - 2.0, .25)
put(mus, pad([38, 45, 50, 53], 6.4, 900, .5), 68.6, .45); put(mus, boom(3.5), 70.1, .8); [put(mus, kick(.6), 70.1 + i*1.2, .4) for i in range(4)]
# ---------------------------------------------------------------- SFX
cuts = [1.3, 2.6, 4.4, 6.3, 8.7, 11.5, 14.6, 16.5, 19.6, 22.6, 24.9, 26.0, 27.1, 29.2, 30.4, 33.5, 35.0, 38.5, 41.6, 45.0, 49.2, 52.0, 54.6, 57.7, 61.8, 64.5, 68.6]
for c in cuts: put(sfx, whoosh(.35, 600, 7000), c - .22, .25)
def thud(t0, g=.8): put(sfx, kick(1.2), t0, g); put(sfx, lp(rng.standard_normal(int(.5*SR)), 300)*np.exp(-tt(.5)*8), t0, g*.6)
def growl(t0, d, g=.6, f0=70, f1=55):
    t = tt(d); f = np.linspace(f0, f1, len(t)) + 6*np.sin(t*23); s = np.tanh(3*np.sin(2*np.pi*np.cumsum(f)/SR) + .8*np.sin(2*np.pi*np.cumsum(f*2.01)/SR))
    n = bp(rng.standard_normal(len(t)), 200, 1400)*(.6 + .4*np.sin(t*31)); put(sfx, (s*.6 + n*.8)*env(len(t), .08, .4), t0, g)
def roar(t0, d=1.8):
    t = tt(d); k = t/d; f = 90 + 60*np.sin(np.pi*k) + 8*np.sin(t*40); car = np.tanh(4*np.sin(2*np.pi*np.cumsum(f)/SR)); n = rng.standard_normal(len(t))
    form = sum(bp(n + car*.6, lo, hi)*g for lo, hi, g in ((300, 700, 1.0), (900, 1500, .7), (2200, 3200, .35)))
    s = (form + car*.5)*env(len(t), .12, .6)*(1 + .3*np.sin(t*9)); ir = np.exp(-tt(1.2)*4)*rng.standard_normal(int(1.2*SR))*.05
    put(sfx, fftconvolve(s, ir)[:len(s)]*.6 + s, t0, .55)
def scream(t0, d=.7, f0=900, pan=0.):
    t = tt(d); f = f0 + 200*np.sin(t*8) + np.linspace(0, 300, len(t)); s = bp(np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) + .5*rng.standard_normal(len(t)), 700, 3500); put(sfx, s*env(len(t), .03, .2), t0, .12, pan)
def crack(t0): n = int(.25*SR); put(sfx, hp(rng.standard_normal(n), 2500)*np.exp(-tt(.25)*40), t0, .9); [put(sfx, bp(rng.standard_normal(int(.05*SR)), 800, 5000)*np.exp(-tt(.05)*60), t0 + .03 + i*.035, .5) for i in range(5)]
def click(t0, g=.3): put(sfx, bp(rng.standard_normal(int(.02*SR)), 2000, 8000)*np.exp(-tt(.02)*200), t0, g)
def pop(t0, g=.2): put(sfx, tone(500, 1100, .09, .002, .05), t0, g)
def ding(t0, g=.25): put(sfx, bell(2600, 1.2)*.6, t0, g)
# hook
put(sfx, tone(80, 160, .5, .05, .2)*.5 + bp(rng.standard_normal(int(.5*SR)), 200, 900)*.3, .35, .5)          # eye opens
for i in range(4): thud(1.35 + i*.12, .35)
put(sfx, whoosh(.3), 2.0, .3); thud(2.1, .4)
for i, x in enumerate((2.75, 3.35, 3.95)): thud(x, .5 + .1*i)
scream(3.1, .5, 1000, -.4); scream(3.25, .6, 800, .3)
growl(4.6, 1.4, .35, 60, 48); [put(sfx, bp(rng.standard_normal(int(.06*SR)), 1500, 7000)*np.exp(-tt(.06)*40), 5.45 + i*.05, .4) for i in range(8)]   # sauropod groan, trolley clatter
for i in range(4): thud(6.45 + i*.55, .35); thud(6.45 + i*.55 + .16, .22)                                        # heartbeat
put(sfx, bp(rng.standard_normal(int(1.2*SR)), 3000, 8000)*(.5 + .5*np.sin(tt(1.2)*70)), 9.6, .05)               # shiver
for i in range(6): put(sfx, tone(1200 + i*60, 1400, .08, .003, .05), 9.7 + i*.13, .03)                           # germ fizz
thud(DINO_HIT, 1.0); put(sfx, hp(rng.standard_normal(int(.4*SR)), 3000)*np.exp(-tt(.4)*10), DINO_HIT, .4)
put(sfx, whoosh(.6, 300, 4000), 11.4, .4)
for i in range(2): click(14.7 + i*.5, .35)                                                                     # clock ticks
# hour 1
n = int((ROAR - 16.5)*SR); put(sfx, lp(rng.standard_normal(n), 400)*.6, 16.5, .06)                             # town hum
for x in (16.9, 18.7, 21.0, 23.9): put(sfx, tone(3200, 4100, .08, .003, .05), x, .03); put(sfx, tone(3600, 4300, .07, .003, .04), x + .1, .025)   # birds
put(sfx, tone(200, 260, .25, .02, .1)*.5, 17.6, .2); growl(18.3, .9, .4, 75, 60)
put(sfx, tone(800, 2400, .5, .004, .1)*.3, 19.8, .15); thud(21.3, .5)                                            # tape zip, weight
for i in range(10): put(sfx, tone(2000, 2000, .05, .002, .02, 'sq'), 22.8 + i*.18, .05)                         # crossing beeps
put(sfx, tone(400, 300, .3, .01, .2), 23.3, .08)                                                               # confused
for i in range(5): scream(24.95 + i*.18, .5 + .1*i, 700 + i*110, (-1)**i*.5)
put(sfx, bp(rng.standard_normal(int(.9*SR)), 1500, 4000)*(np.sin(tt(.9)*30)*.3 + .7), 26.05, .2)              # tyre screech
put(sfx, (tone(392, 392, .5, .01, .1, 'sq') + tone(494, 494, .5, .01, .1, 'sq'))*.5, 26.3, .12)               # horn
put(sfx, tone(1500, 1500, .07, .002, .03), 27.35, .15); put(sfx, tone(2000, 2000, .07, .002, .03), 27.45, .15)  # phone rec beep
for i in range(3): thud(29.3 + i*.62, .3)
put(sfx, whoosh(.5, 200, 2000), 30.0, .3); thud(31.2, 1.0); [put(sfx, bp(rng.standard_normal(int(.08*SR)), 300, 3000)*np.exp(-tt(.08)*30), 31.25 + i*.06, .2) for i in range(6)]
roar(ROAR)
# first catch, films, science
put(sfx, bp(rng.standard_normal(int(.35*SR)), 500, 4000)*np.sin(np.linspace(0, 6*np.pi, int(.35*SR))), 33.45, .35)   # record scratch
thud(33.8, .6)
for i in range(int(3.4*24)): click(35.0 + i/24, .05)                                                          # projector
put(sfx, lp(rng.standard_normal(int(3.4*SR)), 500)*(.6 + .4*np.sin(tt(3.4)*40)), 35.0, .08)                   # jeep engine
for i in range(8): put(sfx, tone(1800 + (i % 3)*300, 1800 + (i % 3)*300, .05, .002, .02), 38.7 + i*.32, .06)   # computer blips
put(sfx, tone(300, 3000, 2.8, .1, .3)*.3, 38.7, .05)                                                         # scan sweep
for i in range(int(2.8/.25)): thud(41.6 + i*(.38 - i*.015), .25)                                                # faster steps
crack(CRACK); thud(CRACK, .8)
# estimates, bike, shops
put(sfx, tone(200, 900, 1.2, .02, .1)*.4, 46.4, .12); pop(47.7)
pop(49.4); pop(50.0)
for i in range(10): put(sfx, tone(500, 420, .05, .003, .03), 52.1 + i*.19, .12)                               # running steps
put(sfx, tone(150, 140, .45, .005, .1, 'sq'), 53.9, .2)                                                      # wrong buzzer
ding(55.3, .3); ding(55.5, .3); put(sfx, whoosh(.6, 400, 7000), 55.2, .4)
for i in range(18): click(55.3 + i*.08, .08)                                                                  # chain
put(sfx, tone(200, 600, .9, .02, .1)*.4, 59.4, .1); pop(60.4)
for i in range(8): put(sfx, tone(380, 330, .05, .003, .03), 61.9 + i*.42, .08); thud(62.1 + i*.84, .15)       # footsteps, both
for i in range(6): put(sfx, tone(4200, 4200, .04, .002, .02), 63.3 + i*.17, .05)                               # crickets (awkward)
# germs + sneeze + tease
for i in range(14): put(sfx, tone(300 + (i % 4)*80, 200, .25, .01, .2), 64.8 + i*.18, .04)                      # squelchy wobble
put(sfx, riser(.6, 400, 2500)*.6, SNEEZE - .6, .25)                                                          # "ah... ah..."
put(sfx, bp(rng.standard_normal(int(.5*SR)), 500, 5000)*np.exp(-tt(.5)*6), SNEEZE, .9); thud(SNEEZE, .6)
put(sfx, whoosh(1.0, 200, 3000), 68.6, .35); thud(70.1, .9); put(sfx, whoosh(.5), 71.1, .3)
# ---------------------------------------------------------------- voice + mix
D = json.load(open('tts/dur.json')); vo = np.zeros(N)
for i, t0 in enumerate(L):
    a, _ = sf.read(f'tts/t_{i}_m.wav'); a = a if a.ndim == 1 else a.mean(1); j = int(t0*SR); n = min(len(a), N - j); vo[j:j + n] += a[:n]
vo /= np.abs(vo).max()/.9
e = np.abs(vo); k = int(.2*SR); sm = np.convolve(e, np.ones(k)/k, 'same'); duck = 1 - .55*np.clip(sm/.05, 0, 1)
# small room reverb on the music
ir = rng.standard_normal((int(1.6*SR), 2))*np.exp(-tt(1.6)*3.2)[:, None]; ir[:int(.01*SR)] = 0
wet = np.stack([fftconvolve(mus[:, c], ir[:, c])[:N] for c in (0, 1)], 1); wet /= np.abs(wet).max() + 1e-9
m = mus/(np.abs(mus).max() + 1e-9)*.85 + wet*.18
fo = np.ones(N); i0 = int((END - 1.2)*SR); fo[i0:] = np.linspace(1, 0, N - i0)
mix = m*.56*duck[:, None]*fo[:, None] + sfx/(np.abs(sfx).max() + 1e-9)*.55*fo[:, None] + vo[:, None]
mix = np.tanh(mix*1.05)/np.tanh(1.05); mix /= np.abs(mix).max()/.9
sf.write('mix_test.wav', mix, SR); print('mix_test.wav', round(END, 1), 's')
