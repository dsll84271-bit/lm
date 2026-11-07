import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music2.py').read().split('UP=[[60')[0].replace('D=75.6','D=21.5'))
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
section(0.2,4.6,UP,UPB,1.2,2,0.16,0.3)
# slow-mo: deep pad + slow heartbeat, rising
place(pad([45,52,57],7.6),4.7,0.18); place(pad([69,76],7.4),5.0,0.06)
for i in range(9): place(kick(),5.2+i*0.75,0.16+0.03*i)
place(kick(),11.9,1.0)
section(12.6,17.3,CUR,CURB,1.0,1,0.15,0.26)
section(17.5,21.5,UP,UPB,1.3,2,0.17,0.32)
for i,m in enumerate([79,83,86]): place(bell(m,2.0),18.0+i*0.18,0.12)
fade=np.ones(N); i0=int(20.4*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(2.2*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*2.6)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.24; mus/=np.abs(mus).max()/0.85
sf.write('music_b.wav',mus,SR); print('music ok')
