import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music2.py').read().split('UP=[[60')[0].replace('D=75.6','D=20.0'))
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
section(0.2,3.0,CUR,CURB,0.9,1,0.14,0.26)
section(3.2,7.7,UP,UPB,0.9,1,0.13,0.24)
section(7.8,12.3,CUR,CURB,1.3,2,0.17,0.34)
section(12.4,20.0,UP,UPB,1.2,2,0.16,0.3)
for i,m in enumerate([84,88,91]): place(bell(m,2.0),16.9+i*0.12,0.13)
fade=np.ones(N); i0=int(19.0*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(2.2*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*2.6)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.24; mus/=np.abs(mus).max()/0.85
sf.write('music_s.wav',mus,SR); print('music ok')
