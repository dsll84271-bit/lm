import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, fftconvolve
exec(open('music2.py').read().split('UP=[[60')[0].replace('D=75.6','D=74.0'))
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
EPIC=[[57,60,64],[53,57,60],[55,59,62],[52,56,59]]; EPICB=[33,29,31,28]
place(pad([57,64,69],6.2),0.2,0.15); place(pad([53,60,65],6.0),6.4,0.15)
section(6.6,12.4,CUR,CURB,0.7,0,0.11,0.2)
section(12.8,24.2,EPIC,EPICB,1.3,2,0.18,0.36)
for i in range(16): place(snare(),23.2+i*(1.0/16),0.04+0.02*i)
place(pad([45,52,57],4.6),24.4,0.14)
for i,m in enumerate([69,67,64,62,60]): place(bell(m,1.6),24.6+i*0.45,0.08)
section(29.4,37.0,UP,UPB,0.9,1,0.14,0.24)
place(bell(84,3.0),38.2,0.18); place(bell(79,3.0),38.25,0.12)
place(pad([48,55,60,64],5.2),40.4,0.17)
for i,m in enumerate([76,79,84,83,79,76,74,76]): place(bell(m,2.4),40.6+i*0.6,0.1)
def verb(m):
    rng2=np.random.default_rng(3); n=int(2.2*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*2.6)[:,None]; ir[:int(0.012*SR)]=0
    wet=np.stack([fftconvolve(m[:,c],ir[:,c])[:N] for c in (0,1)],1); return m+wet/(np.abs(wet).max()+1e-9)*np.abs(m).max()*0.28
A=verb(mus.copy()); env=np.ones(N); a=int(45.4*SR); b=int(45.6*SR); env[a:b]=np.linspace(1,0,b-a); env[b:]=0; A*=env[:,None]
mus[:]=0
# 45.6 hard cut -> drone + heartbeat
n=int(6.8*SR); tt=np.arange(n)/SR; dr=(np.sin(2*np.pi*55*tt)+0.5*np.sin(2*np.pi*58.3*tt))*np.minimum(1,tt*2)*0.5
place(dr,45.6,0.35)
for i in range(9): place(kick(),45.8+i*(0.75-0.04*i),0.22+0.02*i)
place(pad([46,52,58],3.6),47.3,0.16)
# DAY 2 hit
place(kick(),52.4,1.0); place(pad([57,64,69,76],2.8),52.45,0.22)
section(55.4,74.0,UP,UPB,1.2,2,0.16,0.3)
for i,m in enumerate([79,83,86,91]): place(bell(m,2.0),55.6+i*0.15,0.12)
B=verb(mus.copy()); mus=A+B
fade=np.ones(N); i0=int(70.5*SR); fade[i0:]=np.linspace(1,0,N-i0); mus*=fade[:,None]
mus/=np.abs(mus).max()/0.85
sf.write('music_a5.wav',mus,SR); print('music ok')
