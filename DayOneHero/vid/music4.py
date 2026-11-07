import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music2.py').read().split('UP=[[60')[0].replace('D=75.6','D=68.5'))
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
EPIC=[[57,60,64],[53,57,60],[55,59,62],[52,56,59]]; EPICB=[33,29,31,28]
SAD=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]; SADB=[33,29,24,31]
# S1 anticipation: pad + heartbeat kicks building
place(pad([57,64,69],8.4),0.2,0.14)
for i in range(14): place(kick(),0.6+i*0.6,0.18+0.015*i)
section(8.6,17.2,CUR,CURB,0.9,1,0.14,0.24)
for i in range(16): place(snare(),16.9+i*(1.0/16),0.05+0.02*i)
# BOOM at 18.0 then silence until 19.3, then epic run
place(kick(),18.0,0.9)
section(19.3,23.8,EPIC,EPICB,1.3,2,0.18,0.38)
section(23.8,39.6,CUR,CURB,0.8,1,0.13,0.24)
section(39.6,45.3,UP,UPB,1.2,2,0.17,0.3)
section(45.3,56.5,CUR,CURB,0.8,1,0.13,0.24)
# lonely: slow sad music box + pad
place(pad([45,52,57,60],6.0),56.6,0.16); place(pad([41,48,53,57],6.2),62.4,0.16)
for i,m in enumerate([76,72,69,72,74,71,67,64]): place(bell(m,3.0),56.9+i*1.3,0.13)
fade=np.ones(N); i0=int(67.4*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(2.2*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*2.6)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.24; mus/=np.abs(mus).max()/0.85
sf.write('music_a4.wav',mus,SR); print('music ok')
