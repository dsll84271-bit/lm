import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music.py').read().split('# chords (C G Am F) as midi')[0].replace('D=35.0','D=75.6'))
CH=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; BS=[33,29,36,31]  # Am F C G (curious explainer)
ARP=[0,1,2,1,2,1,0,1]
B=60/104
def section(t0,t1,bright,drums,arpg=0.18,bassg=0.3):
    t=t0
    while t<t1-0.01:
        bi=int((t-t0)/(4*B))%4; c=CH[bi]
        for k in range(8):
            tt=t+k*B/2
            if tt>=t1: break
            place(pluck(c[ARP[k]]+12,0.45,bright),tt,arpg,pan=0.3*(-1)**k)
            if drums: place(hat(),tt+B/4,0.07,pan=0.4)
        for k in range(4):
            tt=t+k*B
            if tt<t1:
                if k in (0,2): place(bass(BS[bi],B*1.8),tt,bassg)
                if drums and k in (0,2): place(kick(),tt,0.32)
                if drums==2 and k in (1,3): place(snare(),tt,0.2)
        t+=4*B
section(0.0,20.4,1.0,2)          # speed showdown: energetic
place(pad([57,64,69,72],4.6),20.5,0.12)          # brain question: suspense
for i,m in enumerate([69,72,76,74]): place(bell(m,2.2),20.7+i*1.0,0.12)
section(25.0,33.8,0.7,1,0.15,0.25)   # 13 ms: light
section(33.9,40.0,0.6,0,0.12,0.2)    # slow-mo: sparse
section(40.1,44.0,1.0,1)             # pitch: bouncy, cut on blink
place(kick(),44.6,0.5); section(44.9,48.4,1.2,2)
place(pad([57,60,64,69],6.2),48.5,0.14)            # brain gears: build
for i in range(24): place(pluck([69,72,76,81][i%4],0.3,1.2),48.6+i*(6.0/24)*(1-i/60),0.10+i*0.004)
# slowed world: low dreamy pad + slowed bells
place(pad([45,52,57,60],12.2),54.9,0.16)
for i,m in enumerate([57,60,64,60,55,59,62,59]): place(bell(m-12,3.5),55.2+i*1.5,0.13)
place(pad([45,52,57,64],8.6),67.0,0.13)
fade=np.ones(N); i0=int(74.6*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(1.6*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*3.2)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/ (np.abs(mus).max()+1e-9)*0.85+wet*0.2
mus/=np.abs(mus).max()/0.85
sf.write('music_a1.wav',mus,SR); print('music ok')
