import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music2.py').read().split('UP=[[60')[0].replace('D=75.6','D=58.6'))
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
TEN=[[57,60,64],[56,59,64],[57,60,64],[52,56,59]]; TENB=[33,32,33,28]
section(0,13.3,UP,UPB,1.2,2,0.17,0.34)
section(13.3,26.5,CUR,CURB,0.9,1,0.15,0.26)
section(26.5,34.4,UP,UPB,1.1,2,0.18,0.3)
section(34.4,48.0,TEN,TENB,1.0,2,0.15,0.34)
section(48.0,58.6,CUR,CURB,0.8,1,0.15,0.25)
fade=np.ones(N); i0=int(57.8*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(1.6*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*3.2)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.2; mus/=np.abs(mus).max()/0.85
sf.write('music_a3.wav',mus,SR); print('music ok')
