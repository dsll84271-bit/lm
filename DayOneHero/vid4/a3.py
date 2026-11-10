# Ep3 audio engine: synth instruments, the signature teleport pop, and the voice/music/SFX mixer.
# Everything is synthesised here with numpy, so it's free to use on a monetised channel.
import numpy as np, soundfile as sf, re
from scipy.signal import butter, lfilter, fftconvolve
SR = 44100
rng = np.random.default_rng(31)
class Mix:
    def __init__(self, seg):
        src = open(f't_{seg}.js').read()
        self.seg = seg
        self.END = float(re.search(r'END=([\d.]+)', src).group(1))
        self.ST = [float(x) for x in re.search(r'ST=\[([^\]]*)\]', src).group(1).split(',')]
        self.N = int(SR*self.END)
        self.mus = np.zeros((self.N, 2)); self.sfx = np.zeros((self.N, 2)); self.amb = np.zeros((self.N, 2))
    def put(self, buf, sig, t0, g=1.0, pan=0.0):
        b = getattr(self, buf); i = int(t0*SR)
        if i < 0: sig = sig[-i:]; i = 0
        n = min(len(sig), self.N - i)
        if n <= 0: return
        if sig.ndim == 1: sig = np.stack([sig*np.sqrt((1 - pan)/2)*1.41, sig*np.sqrt((1 + pan)/2)*1.41], 1)
        b[i:i + n] += sig[:n]*g
    # ------------------------------------------------------------ the mix
    def render(self, mus_g=.5, sfx_g=.6, amb_g=.5, duck=.6, fade_out=1.0, mute=()):
        vo = np.zeros(self.N)
        for i, t0 in enumerate(self.ST):
            a, sr = sf.read(f'tts/{self.seg}_{i}_m.wav'); a = a if a.ndim == 1 else a.mean(1)
            j = int(t0*SR); n = min(len(a), self.N - j); vo[j:j + n] += a[:n]
        vo /= np.abs(vo).max()/.9
        e = np.abs(vo); k = int(.25*SR); cs = np.concatenate([[0], np.cumsum(e)]); idx = np.arange(self.N); lo = np.clip(idx - k//2, 0, self.N); hi = np.clip(idx + k//2, 0, self.N); sm = (cs[hi] - cs[lo])/k; dk = 1 - duck*np.clip(sm/.05, 0, 1)
        ir = rng.standard_normal((int(1.8*SR), 2))*np.exp(-np.arange(int(1.8*SR))/SR*3.0)[:, None]; ir[:int(.012*SR)] = 0
        wet = np.stack([fftconvolve(self.mus[:, c], ir[:, c])[:self.N] for c in (0, 1)], 1)
        m = self.mus/(np.abs(self.mus).max() + 1e-9)*.85 + wet/(np.abs(wet).max() + 1e-9)*.2
        for a, b in mute:   # music drop-outs (with 40 ms ramps)
            i0, i1 = int(a*SR), int(b*SR); r = int(.04*SR); g = np.ones(self.N); g[i0:i1] = 0
            g[max(0, i0 - r):i0] = np.linspace(1, 0, i0 - max(0, i0 - r)); g[i1:i1 + r] = np.linspace(0, 1, len(g[i1:i1 + r])); m *= g[:, None]
        sx = self.sfx/(np.abs(self.sfx).max() + 1e-9)
        am = self.amb/(np.abs(self.amb).max() + 1e-9)
        fo = np.ones(self.N); i0 = int((self.END - fade_out)*SR); fo[i0:] = np.linspace(1, 0, self.N - i0)
        mix = (m*mus_g*dk[:, None] + am*amb_g*(1 - .35*(1 - dk))[:, None] + sx*sfx_g)*fo[:, None] + vo[:, None]
        mix = np.tanh(mix*1.05)/np.tanh(1.05); mix /= np.abs(mix).max()/.9
        sf.write(f'mix3_{self.seg}.wav', mix, SR); print(f'mix3_{self.seg}.wav', round(self.END, 2), 's')
# ---------------------------------------------------------------- dsp + instruments
def bp(x, lo, hi, o=2): b, a = butter(o, [lo/(SR/2), min(hi, SR/2 - 100)/(SR/2)], 'band'); return lfilter(b, a, x)
def lp(x, f, o=2): b, a = butter(o, f/(SR/2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f/(SR/2), 'high'); return lfilter(b, a, x)
def env(n, a=.005, r=.1):
    e = np.ones(n); A = max(1, min(n, int(a*SR))); R = max(1, min(n, int(r*SR))); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e
mtof = lambda m: 440*2**((m - 69)/12)
tt = lambda d: np.arange(int(d*SR))/SR
noise = lambda d: rng.standard_normal(int(d*SR))
def saw(f, d, det=(-.12, 0, .12)): t = tt(d); return sum(2*((t*f*(1 + c/100)) % 1) - 1 for c in det)/len(det)
def pad(ms, d, cut=1600, a=.8): s = sum(saw(mtof(m), d) for m in ms)/len(ms); s = lp(s, cut, 2); return s*env(len(s), a, min(1.2, d*.4))
def sub(m, d): t = tt(d); return np.sin(2*np.pi*mtof(m)*t)*env(len(t), .01, .15)
def pluck(m, d=.5, br=1.): t = tt(d); f = mtof(m); s = np.sin(2*np.pi*f*t) + .4*br*np.sin(2*np.pi*2*f*t)*np.exp(-t*14) + .2*np.sin(2*np.pi*3*f*t)*np.exp(-t*20); return s*np.exp(-t*6)*env(len(t), .002, .05)
_UK = {}
def uke(m, d=.6):   # bright plucked string (Karplus-Strong via a feedback filter), cached per note
    if (m, d) in _UK: return _UK[(m, d)]
    f = mtof(m); n = int(d*SR); p = max(2, int(SR/f)); x = np.zeros(n); x[:p] = rng.uniform(-1, 1, p)
    a = np.zeros(p + 2); a[0] = 1; a[p] = -.498; a[p + 1] = -.498
    out = lfilter([1.], a, x); _UK[(m, d)] = out*env(n, .001, .05); return _UK[(m, d)]
def mallet(m, d=.8): t = tt(d); f = mtof(m); return (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*4*f*t)*np.exp(-t*30))*np.exp(-t*5)*env(len(t), .001, .05)
def bass(m, d=.28): t = tt(d); f = mtof(m); s = np.tanh(2.2*(np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t))); return lp(s, 900)*np.exp(-t*5)*env(len(t), .004, .04)
def kick(g=1.): t = tt(.45); f = 45 + 110*np.exp(-t*30); return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*7) + .3*bp(rng.standard_normal(len(t)), 1500, 6000)*np.exp(-t*90))*g
def snare(): t = tt(.25); return (bp(rng.standard_normal(len(t)), 1200, 8000)*.9 + .5*np.sin(2*np.pi*190*t))*np.exp(-t*16)
def clap(): t = tt(.2); s = bp(rng.standard_normal(len(t)), 900, 5000); e = sum(np.exp(-np.clip(t - k*.011, 0, None)*60)*(t >= k*.011) for k in range(3)); return s*e*.6
def hat(o=False): t = tt(.25 if o else .05); return hp(rng.standard_normal(len(t)), 7000)*np.exp(-t*(15 if o else 90))
def tom(f=90): t = tt(.6); return np.sin(2*np.pi*np.cumsum(f + 80*np.exp(-t*12))/SR)*np.exp(-t*5) + .2*bp(rng.standard_normal(len(t)), 200, 2000)*np.exp(-t*20)
def boom(d=2.5): t = tt(d); return np.sin(2*np.pi*np.cumsum(28 + 70*np.exp(-t*4))/SR)*np.exp(-t*1.6) + lp(rng.standard_normal(len(t)), 600)*np.exp(-t*3)*.7
def riser(d, lo=200, hi=6000): t = tt(d); k = t/d; return bp(rng.standard_normal(len(t)), lo, hi)*k**2 + np.sin(2*np.pi*np.cumsum(200 + 1600*k**2)/SR)*k**2*.4
def whoosh(d=.45, lo=400, hi=6000): t = tt(d); return bp(rng.standard_normal(len(t)), lo, hi)*np.sin(np.linspace(0, np.pi, len(t)))**2
def tone(f0, f1, d, a=.004, r=.1, wave='sin'):
    t = tt(d); f = np.linspace(f0, f1, len(t)); ph = 2*np.pi*np.cumsum(f)/SR; s = np.sin(ph) if wave == 'sin' else np.sign(np.sin(ph))*.6; return s*env(len(t), a, r)
def bell(f, d=3.0): t = tt(d); return (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*2) + .3*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*4) + .3*np.sin(2*np.pi*f*.5*t))*np.exp(-t*1.2)
def brass(ms, d=.6, cut=2400): s = sum(saw(mtof(m), d, (-.2, .2)) for m in ms)/len(ms); t = tt(d); return lp(s, cut)*np.minimum(1, t/.03)*np.exp(-t*2.2)*env(len(t), .01, .12)
# ---------------------------------------------------------------- signature SFX
def tp_pop(M, t0, g=1., mode='in', pan=0.):
    """The teleport POP: (out) air sucks in, then a hard click + low thump + bright zing + airy tail."""
    if mode == 'out':
        d = .16; s = bp(noise(d), 600, 7000)*np.linspace(0, 1, int(d*SR))**3; M.put('sfx', s*.7, t0 - d, g, pan)
    t = tt(.05); M.put('sfx', hp(noise(.05), 1500)*np.exp(-t*160), t0, g*1.1, pan)
    t = tt(.5); M.put('sfx', np.sin(2*np.pi*np.cumsum(55 + 140*np.exp(-t*25))/SR)*np.exp(-t*9), t0, g*.9, pan)
    M.put('sfx', tone(1800, 500, .22, .002, .1) if mode == 'out' else tone(600, 2100, .2, .002, .1), t0 + .01, g*.22, pan)
    M.put('sfx', bp(noise(.6), 300, 3000)*np.exp(-tt(.6)*7), t0 + .02, g*.35, -pan)
def thud(M, t0, g=.8): M.put('sfx', kick(1.2), t0, g); M.put('sfx', lp(noise(.5), 300)*np.exp(-tt(.5)*8), t0, g*.6)
def click(M, t0, g=.3): M.put('sfx', bp(noise(.02), 2000, 8000)*np.exp(-tt(.02)*200), t0, g)
def blip(M, t0, f=900, g=.2): M.put('sfx', tone(f, f*1.6, .09, .002, .05), t0, g)
def ding(M, t0, g=.25, f=2600): M.put('sfx', bell(f, 1.2)*.6, t0, g)
def squawk(M, t0, g=.4, pan=.3):
    for i in range(2): t = tt(.18); f = 900 + 500*np.sin(np.linspace(0, np.pi, len(t))); s = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*.4 + bp(noise(.18), 1500, 4000)*.5; M.put('sfx', bp(s, 600, 5000)*env(len(t), .01, .05), t0 + i*.22, g, pan)
def crunch(M, t0, g=.6): [M.put('sfx', bp(noise(.04), 400, 3000)*np.exp(-tt(.04)*60), t0 + i*.025 + rng.uniform(0, .01), g*(1 - i/12)) for i in range(10)]
def scratch(M, t0, g=.4): d = .35; M.put('sfx', bp(noise(d), 500, 4000)*np.sin(np.linspace(0, 6*np.pi, int(d*SR))), t0, g)
def tweet(M, t0, g=.08): [M.put('sfx', tone(3200 + 300*(i % 2), 4200, .07, .003, .04), t0 + i*.13, g) for i in range(5)]
def horn(M, t0, g=.12, f=392): M.put('sfx', (tone(f, f, .35, .01, .08, 'sq') + tone(f*1.26, f*1.26, .35, .01, .08, 'sq'))*.5, t0, g)
def waves(M, t0, t1, g=.5):
    d = t1 - t0; n = int(d*SR); s = lp(rng.standard_normal(n), 900)*(.55 + .45*np.sin(np.arange(n)/SR*2*np.pi/4.2)**2) + hp(rng.standard_normal(n), 3000)*.08*(np.sin(np.arange(n)/SR*2*np.pi/4.2 + 1)**8)
    M.put('amb', np.stack([s, np.roll(s, 2000)], 1)*env(n, .3, .3)[:, None], t0, g)
def room(M, t0, t1, g=.25): n = int((t1 - t0)*SR); M.put('amb', lp(rng.standard_normal(n), 250)*env(n, .1, .1), t0, g)
def wind(M, t0, t1, g=.5, lo=200, hi=1500):
    n = int((t1 - t0)*SR); s = bp(rng.standard_normal(n), lo, hi)*(.5 + .5*np.sin(np.arange(n)/SR*1.3)**2); M.put('amb', np.stack([s, np.roll(s, 3000)], 1)*env(n, .3, .3)[:, None], t0, g)
def rewind(M, t0, d=.85, g=.3): t = tt(d); f = 1200 + 900*np.sin(t*40); M.put('sfx', (np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*.2 + bp(noise(d), 2000, 8000)*.5)*env(len(t), .01, .05), t0, g)
# ---------------------------------------------------------------- score helpers (C major, bright)
C, G, Am, F = [60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]
Dm, Em, Bb = [62, 65, 69], [52, 55, 59], [58, 62, 65]
def groove(M, t0, t1, prog=(C, G, Am, F), B=.536, bass_on=True, drums=1., arp=True, gain=1., inst='uke', bar=8):
    nb = int((t1 - t0)/B)
    for i in range(nb):
        t = t0 + i*B; ch = prog[(i//bar) % len(prog)]
        if bass_on: M.put('mus', bass(ch[0] - 24), t, .5*gain); M.put('mus', bass(ch[0] - 24 + (7 if i % 4 == 3 else 0)), t + B/2, .32*gain)
        if arp:
            for h in (0, .5):
                m = ch[(i*2 + int(h*2)) % 3] + 12
                M.put('mus', uke(m, .45) if inst == 'uke' else mallet(m, .5), t + h*B, .2*gain, pan=-.3 + .6*((i % 4)/3))
        if drums:
            M.put('mus', kick(), t, .45*drums*gain) if i % 2 == 0 else M.put('mus', clap(), t, .4*drums*gain)
            M.put('mus', hat(), t + B/2, .12*drums*gain, pan=.4); M.put('mus', hat(), t + B*.75, .05*drums*gain, pan=-.3)
    return t0 + nb*B
def chordHit(M, t0, ch, g=.5, d=2.0): M.put('mus', boom(2.0), t0, g*.7); M.put('mus', pad([m - 12 for m in ch] + ch, d, 3000, .01), t0, g); M.put('mus', brass(ch, .5), t0, g*.5)
def drone(M, t0, d, ms=(36, 43), g=.4): M.put('mus', pad(list(ms), d, 500, 1.0), t0, g); M.put('mus', sub(ms[0] - 12, d), t0, g*.8)
def heartbeat(M, t0, n, period=.7, g=.4): [ (thud(M, t0 + i*period, g), thud(M, t0 + i*period + .2, g*.6)) for i in range(n)]
