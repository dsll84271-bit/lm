import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter
SR=44100; D=75.6; N=int(SR*D); out=np.zeros(N); rng=np.random.default_rng(5)
def add(sig,t0,g=1.0):
    i=int(t0*SR); n=min(len(sig),N-i); out[i:i+n]+=sig[:n]*g
def tone(f0,f1,dur,a=0.004,r=0.1):
    n=int(dur*SR); f=np.linspace(f0,f1,n); s=np.sin(2*np.pi*np.cumsum(f)/SR); e=np.ones(n); A=int(a*SR); R=int(r*SR); e[:A]=np.linspace(0,1,A); e[-R:]*=np.linspace(1,0,R); return s*e
def bp(x,lo,hi): b,a=butter(2,[lo/(SR/2),hi/(SR/2)],'band'); return lfilter(b,a,x)
def whoosh(dur=0.5,lo=300,hi=4000):
    n=int(dur*SR); x=rng.standard_normal(n); return bp(x,lo,hi)*np.sin(np.linspace(0,np.pi,n))**2
def hit(): n=int(0.5*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(60+80*np.exp(-t*20))/SR)*np.exp(-t*6)+bp(rng.standard_normal(n),200,3000)*np.exp(-t*14)*0.6
for at in (20.5,25.0,33.9,40.1,48.5,54.9): add(whoosh(0.55),at-0.28,0.6)
add(tone(300,1200,1.8,0.01,0.2),11.8,0.08)               # gauge rev up
add(bp(rng.standard_normal(int(0.3*SR)),1500,7000)*np.exp(-np.arange(int(0.3*SR))/SR*15),15.1,0.7)  # glass crack
add(hit(),16.3,0.8); add(tone(880,880,0.4,0.003,0.3),16.35,0.12)
add(tone(500,1100,0.12,0.002,0.08),21.9,0.3)              # brain pop
for i in range(28): add(bp(rng.standard_normal(int(0.02*SR)),2000,6000),26.6+i*0.125,0.35)  # stopwatch ticks
for j,f in enumerate((1046,1318,1568)): add(tone(f,f,0.3,0.002,0.25),30.0+j*0.06,0.18)       # ding
add(whoosh(1.2,150,900),34.2,0.5)                         # slow-mo drone whoosh
add(tone(1200,200,0.18,0.002,0.1),44.2,0.25); add(tone(200,1400,0.2,0.002,0.12),44.55,0.3)  # blink zap
add(tone(160,90,0.6,0.01,0.4),45.0,0.4)                   # "huh" thud
n=int(4.2*SR); t=np.arange(n)/SR; whirr=np.sin(2*np.pi*np.cumsum(40+np.linspace(0,1,n)**2*260)/SR)*(0.5+0.5*np.sign(np.sin(2*np.pi*np.cumsum(6+np.linspace(0,1,n)*30)/SR)))*np.linspace(0.2,1,n)
add(bp(whirr,80,2500),49.3,0.25)
add(whoosh(1.5,200,2500),67.3,0.45)
for i in range(7): add(tone(700+i*60,1100+i*60,0.1,0.002,0.07),68.6+i*0.05,0.16)
out/=np.abs(out).max()/0.8
sf.write('sfx_a1.wav',np.stack([out,out],1),SR); print('sfx ok')
