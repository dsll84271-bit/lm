import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music2.py').read().split('UP=[[60')[0].replace('D=75.6','D=53.0'))
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
SAD=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]; SADB=[33,29,24,31]
TEN=[[57,60,64],[56,59,64],[57,60,64],[56,59,62]]; TENB=[33,32,33,32]
section(0.2,5.6,CUR,CURB,0.8,0,0.12,0.2)
for i,m in enumerate([72,76,79,84]): place(bell(m,2.2),5.8+i*0.12,0.13)
section(6.0,8.4,UP,UPB,1.1,1,0.15,0.26)
section(8.6,15.8,TEN,TENB,1.2,2,0.17,0.3)
for i in range(24): place(snare(),13.4+i*0.1,0.04+0.012*i)
# FREEZE: shimmer + still pad
place(pad([69,76,81],6.0),15.8,0.1); place(pad([45,52,57],6.4),16.2,0.16)
for i,m in enumerate([81,76,72,76,79,74,72,69]): place(bell(m,2.6),17.0+i*0.7,0.09)
place(pad([45,52,57,60],4.6),22.4,0.17); place(pad([44,52,56,59],4.4),26.8,0.17)
for i in range(11): place(kick(),22.6+i*0.8,0.12)
# gentle rescue: soft music box over CUR
section(31.0,41.0,CUR,CURB,0.6,0,0.11,0.2)
for i,m in enumerate([72,74,76,79,76,74,72,71,72,76,79,84]): place(bell(m,2.0),31.2+i*0.8,0.09)
place(kick(),41.2,0.8)
section(41.8,52.6,UP,UPB,1.2,2,0.16,0.3)
for i,m in enumerate([79,83,86,91]): place(bell(m,2.0),45.6+i*0.15,0.12)
fade=np.ones(N); i0=int(51.4*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
rng2=np.random.default_rng(3); n=int(2.2*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*2.6)[:,None]; ir[:int(0.012*SR)]=0
wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.24; mus/=np.abs(mus).max()/0.85
sf.write('music_r.wav',mus,SR); print('music ok')
