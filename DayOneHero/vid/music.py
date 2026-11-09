import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter
SR=44100; D=35.0; N=int(SR*D); BPM=120; B=60/BPM
mus=np.zeros((N,2)); rng=np.random.default_rng(7)
def place(sig,t0,g=1.0,pan=0.0):
    i=int(t0*SR); n=min(len(sig),N-i)
    if n<=0: return
    L=np.sqrt((1-pan)/2); R=np.sqrt((1+pan)/2)
    mus[i:i+n,0]+=sig[:n]*g*L*1.41; mus[i:i+n,1]+=sig[:n]*g*R*1.41
def mtof(m): return 440*2**((m-69)/12)
def pluck(m,dur=0.6,bright=1.0):  # marimba-ish
    n=int(dur*SR); t=np.arange(n)/SR; f=mtof(m)
    e=np.exp(-t*7)
    s=np.sin(2*np.pi*f*t)+0.35*bright*np.sin(2*np.pi*f*4*t)*np.exp(-t*20)+0.15*np.sin(2*np.pi*f*2*t)
    a=int(0.003*SR); s[:a]*=np.linspace(0,1,a); return s*e
def bell(m,dur=2.5):  # music box / glock
    n=int(dur*SR); t=np.arange(n)/SR; f=mtof(m)
    return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*3)+0.2*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*6))*np.exp(-t*1.6)
def pad(ms,dur):
    n=int(dur*SR); t=np.arange(n)/SR; s=np.zeros(n)
    for m in ms:
        for dt in (-0.1,0.1): s+=np.sin(2*np.pi*mtof(m)*(1+dt/100)*t)+0.3*np.sin(2*np.pi*mtof(m)*2*t)
    e=np.minimum(1,np.minimum(t/0.6,(dur-t)/0.6)); b,a=butter(2,1800/(SR/2)); return lfilter(b,a,s*e)/len(ms)
def bass(m,dur):
    n=int(dur*SR); t=np.arange(n)/SR; f=mtof(m)
    s=np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*2*f*t); return s*np.exp(-t*3)*np.minimum(1,t/0.005)
def kick():
    n=int(0.35*SR); t=np.arange(n)/SR; f=50+90*np.exp(-t*35)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def snare():
    n=int(0.22*SR); t=np.arange(n)/SR; x=rng.standard_normal(n); b,a=butter(2,[1200/(SR/2),8000/(SR/2)],'band')
    return (lfilter(b,a,x)*0.9+0.4*np.sin(2*np.pi*190*t))*np.exp(-t*18)
def hat():
    n=int(0.05*SR); t=np.arange(n)/SR; x=rng.standard_normal(n); b,a=butter(2,7000/(SR/2),'high'); return lfilter(b,a,x)*np.exp(-t*80)
# chords (C G Am F) as midi
CH=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; BS=[36,31,33,29]
ARP=[0,1,2,1,0,2,1,2]
def bar_index(t): return int(t/(4*B))%4
# Section A: 0-4.6 playful
t=0.0
while t<4.6:
    c=CH[bar_index(t)]
    for k in range(8):
        tt=t+k*B/2
        if tt>=4.6: break
        place(pluck(c[ARP[k]]+12,0.5),tt,0.22,pan=0.3*(-1)**k)
    place(bass(BS[bar_index(t)],B*2),t,0.35); place(bass(BS[bar_index(t)],B*2),t+2*B,0.3)
    for k in range(8):
        tt=t+k*B/2
        if tt<4.6: place(hat(),tt,0.10 if k%2 else 0.06,pan=0.4)
    for k in (0,2): 
        if t+k*B<4.6: place(kick(),t+k*B,0.35)
    t+=4*B
# Section B: frozen 5.3-17 music box, slow, sparse + pad
seq=[72,76,79,76, 71,74,79,74, 69,72,76,72, 65,69,72,77]
for i,m in enumerate(seq*1):
    tt=5.5+i*0.72
    if tt<16.8: place(bell(m),tt,0.16,pan=0.25*np.sin(i))
for j,c in enumerate(CH):
    place(pad(c,3.1),5.4+j*2.9,0.10)
# Section C: build 17-23.7
for i in range(26):
    tt=17.0+i*0.25
    c=CH[(i//8)%4]
    place(pluck(c[ARP[i%8]]+12,0.4,0.8),tt,0.10+0.006*i,pan=0.3*(-1)**i)
place(pad([60,64,67,72],6.8),17.0,0.12)
# snare roll into dash
for i in range(16):
    tt=22.7+i*(1.0/16); place(snare(),tt,0.08+0.02*i)
# Section D: full energy 23.8-30.3 (faster feel: 8th plucks, 4-on-floor)
t=23.8
while t<30.25:
    c=CH[bar_index(t-23.8)]
    for k in range(8):
        tt=t+k*B/2
        if tt>=30.25: break
        place(pluck(c[ARP[k]]+12,0.35,1.2),tt,0.20,pan=0.35*(-1)**k)
        place(hat(),tt+B/4,0.09,pan=0.5)
    for k in range(4):
        tt=t+k*B
        if tt<30.25:
            place(kick(),tt,0.45); place(bass(BS[bar_index(t-23.8)],B),tt,0.35)
            if k%2==1: place(snare(),tt,0.30)
    t+=4*B
# Section E: title sting 30.3
place(pad([48,60,64,67,72],4.6),30.3,0.22)
for j,m in enumerate([72,76,79,84]): place(bell(m,3.0),30.3+j*0.08,0.2)
place(kick(),30.3,0.6)
# gentle fade at very end
fade=np.ones(N); i0=int(33.8*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
mus/=np.abs(mus).max()/0.8
sf.write('music.wav',mus,SR); print('ok')
