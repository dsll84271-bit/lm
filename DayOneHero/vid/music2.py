import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music.py').read().split('# chords (C G Am F) as midi')[0].replace('D=35.0','D=75.6'))
B=60/108
def section(t0,t1,CH,BS,bright,drums,arpg=0.17,bassg=0.3,ARP=(0,1,2,1,2,1,0,1)):
    t=t0
    while t<t1-0.01:
        bi=int((t-t0)/(4*B))%len(CH); c=CH[bi]
        for k in range(8):
            tt=t+k*B/2
            if tt>=t1: break
            place(pluck(c[ARP[k]]+12,0.45,bright),tt,arpg,pan=0.3*(-1)**k)
            if drums: place(hat(),tt+B/4,0.07,pan=0.4)
        for k in range(4):
            tt=t+k*B
            if tt<t1:
                if k in (0,2): place(bass(BS[bi],B*1.8),tt,bassg)
                if drums and k in (0,2): place(kick(),tt,0.34)
                if drums==2 and k in (1,3): place(snare(),tt,0.22)
        t+=4*B
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
TEN=[[57,60,64],[56,59,64],[57,60,64],[52,56,59]]; TENB=[33,32,33,28]
section(0,7.9,UP,UPB,1.1,2)
section(7.9,18.6,CUR,CURB,0.8,1,0.15,0.25)
section(18.6,28.0,TEN,TENB,1.2,2,0.16,0.36)
section(28.0,43.3,CUR,CURB,0.9,1,0.15,0.26)
for j,m in enumerate([67,64,60,55]): place(pluck(m,0.4,1.2),43.35+j*0.12,0.3)   # comedic descending sting
section(44.0,46.2,UP,UPB,0.9,0)
section(46.2,58.2,TEN,TENB,0.9,1,0.13,0.3)
place(pad([45,52,57,60],2.2),58.3,0.15)
for i in range(10): place(snare(),58.6+i*0.24,0.06+0.02*i)
place(kick(),61.0,0.7); place(pad([45,51,57,63],8.0),61.1,0.14)   # dramatic hold
section(69.4,75.6,UP,UPB,1.0,1,0.17,0.28)
fade=np.ones(N); i0=int(74.8*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(1.6*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*3.2)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.2; mus/=np.abs(mus).max()/0.85
sf.write('music_a2.wav',mus,SR); print('music ok')
