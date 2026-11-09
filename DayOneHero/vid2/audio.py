import numpy as np, soundfile as sf, json, sys
from scipy.signal import lfilter, butter, fftconvolve
TM=json.load(open('timing.json'))
base=open('../vid/music.py').read().split('# chords (C G Am F) as midi')[0]
sec=open('../vid/music2.py').read().split('UP=[[60')[0].split("B=60/108")[1]
sfxb=open('../vid/sfx1.py').read().split('for at in')[0]
UP=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; UPB=[36,31,33,29]
CUR=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; CURB=[33,29,36,31]
EPIC=[[57,60,64],[53,57,60],[55,59,62],[52,56,59]]; EPICB=[33,29,31,28]
SAD=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]; SADB=[33,29,24,31]
TEN=[[57,60,64],[56,59,64],[57,60,64],[56,59,62]]; TENB=[33,32,33,32]
def build(seg):
    T=TM[seg]; ST=T['st']; DU=T['du']; END=T['end']
    g={}; exec(base.replace('D=35.0',f'D={END}'),g); g['B']=60/108; exec(sec,g)
    place,section,pad,bell,kick,snare,pluck=[g[k] for k in ('place','section','pad','bell','kick','snare','pluck')]
    af=lambda i,d=0: ST[i]+DU[i]+d
    cuts=[]
    def flour(t0,ms=(79,83,86,91),gn=0.12): [place(bell(m,2.0),t0+i*0.13,gn) for i,m in enumerate(ms)]
    def roll(t0,dur,n=16,g0=0.04): [place(snare(),t0+i*dur/n,g0+0.02*i*16/n) for i in range(n)]
    if seg=='c':
        place(pad([60,64,67],ST[1]),0.1,0.12); [place(bell(m,2.2),0.4+i*0.7,0.08) for i,m in enumerate([72,76,79,76,74,72,71,72])]
        section(ST[1]-0.2,ST[3]-0.2,UP,UPB,1.1,2,0.15,0.28); section(ST[3]-0.2,ST[4]-0.2,CUR,CURB,0.8,1,0.12,0.22)
        section(ST[4]-0.2,ST[6],EPIC,EPICB,1.3,2,0.17,0.34); roll(ST[6]-1.0,1.0)
        section(ST[6],ST[7]-0.1,EPIC,EPICB,1.5,2,0.2,0.4); place(pad([57,64,69],DU[7]+0.4),ST[7]-0.1,0.13)
        tt=af(7,0.15); place(kick(),tt,1.0); place(pad([57,64,69,76],3.0),tt,0.18); flour(tt+0.1); section(tt+0.4,END,UP,UPB,1.2,2,0.15,0.3)
    if seg=='h':
        section(0,ST[3]-0.2,CUR,CURB,0.8,1,0.12,0.22); section(ST[3]-0.2,ST[5]-0.2,UP,UPB,1.0,1,0.14,0.24); place(kick(),ST[4]+1.0,0.6)
        section(ST[5]-0.2,ST[6]-0.2,CUR,CURB,0.9,1,0.13,0.24); [place(bell(m,2.4),ST[6]+i*0.6,0.1) for i,m in enumerate([67,64,60,59])]
        section(ST[6]+2.6,END,UP,UPB,1.1,2,0.15,0.28)
    if seg=='p':
        section(0,ST[1],CUR,CURB,0.9,1,0.13,0.24); section(ST[1],ST[2]-0.05,TEN,TENB,1.3,2,0.17,0.34); roll(ST[2]-1.6,1.6,24)
        place(kick(),ST[2],1.0); section(ST[2]+1.6,ST[4]-0.2,UP,UPB,1.0,1,0.14,0.26); section(ST[4]-0.2,ST[5]-0.2,CUR,CURB,0.9,1,0.13,0.24)
        section(ST[5]-0.2,ST[6]-0.2,UP,UPB,1.4,2,0.17,0.3); section(ST[6]-0.2,ST[8]-0.2,CUR,CURB,0.9,1,0.13,0.24); section(ST[8]-0.2,END,UP,UPB,1.1,2,0.15,0.28); flour(ST[8])
    if seg=='s':
        section(0,ST[4]-0.2,CUR,CURB,0.9,1,0.13,0.24); section(ST[4]-0.2,ST[5]-0.2,TEN,TENB,1.0,1,0.13,0.26); place(kick(),ST[4]+1.5,0.9)
        section(ST[5]-0.2,ST[6]-0.2,EPIC,EPICB,1.3,2,0.17,0.34); section(ST[6]-0.2,END,UP,UPB,1.1,2,0.15,0.28); flour(af(6,-1.6))
    if seg=='l':
        section(0,ST[3]-0.2,UP,UPB,1.0,1,0.14,0.26); place(kick(),af(0,1.2),0.7)
        place(pad([45,52,57],ST[4]-ST[3]),ST[3]-0.2,0.16); [place(bell(m,2.4),ST[3]+i*0.8,0.08) for i,m in enumerate([69,72,76,72,69,67,64,67,69,72,71])]
        section(ST[4]-0.2,END,UP,UPB,1.1,2,0.15,0.28); flour(ST[4])
    if seg=='k':
        section(0,ST[1]-0.4,UP,UPB,1.0,1,0.14,0.26); place(pad([45,52,56],ST[3]-ST[1]),ST[1]-0.4,0.18); place(kick(),ST[1]+1.0,1.0)
        section(ST[2],ST[3]-0.2,UP,UPB,0.9,1,0.13,0.22); section(ST[3]-0.2,ST[4]-0.2,CUR,CURB,0.9,1,0.13,0.24); section(ST[4]-0.2,END,UP,UPB,1.2,2,0.16,0.3); flour(ST[4])
    if seg=='a':
        section(0,af(0,0.2),UP,UPB,1.0,1,0.14,0.26); place(pad([45,52,57,60],ST[2]-af(0)),af(0,0.2),0.16)
        [place(bell(m,3.0),af(0,0.6)+i*1.1,0.08) for i,m in enumerate([76,72,69,64,69,72,67,64,62,64,60,57])]
        place(pad([44,51,56],ST[4]-ST[2]),ST[2],0.18); [place(kick(),ST[2]+0.3+i*0.85,0.18+0.01*i) for i in range(int((ST[4]-ST[2])/0.85))]
        section(ST[4]+0.6,af(4,0.3),EPIC,EPICB,1.5,2,0.19,0.38); place(kick(),af(4,0.3),0.9); section(af(4,0.6),END,UP,UPB,1.1,2,0.15,0.28)
    if seg=='x':
        place(pad([48,55,60,64],ST[3]),0,0.16); [place(bell(m,3.0),0.4+i*1.2,0.08) for i,m in enumerate([72,79,76,84,79,76,72,74,79,76,72,67,72,76])]
        section(ST[3]-0.2,ST[4]-0.2,UP,UPB,1.0,1,0.14,0.26); place(pad([45,52,57],ST[5]-ST[4]),ST[4]-0.2,0.15); [place(bell(m,2.6),ST[4]+i*0.9,0.08) for i,m in enumerate([69,72,76,72,69,67,69,72,76,79])]
        section(ST[5]-0.2,END,CUR,CURB,0.9,1,0.13,0.24)
    if seg=='r':
        section(0,ST[1]+3.0,CUR,CURB,0.9,1,0.13,0.24); place(pad([56,59,64],ST[3]-ST[1]-3),ST[1]+3.0,0.17); [place(bell(m,2.0),ST[2]+i*0.9,0.07) for i,m in enumerate([76,75,76,75,76,75])]
        section(ST[3],af(3,0.2),EPIC,EPICB,1.4,2,0.18,0.36); place(kick(),af(3,0.2),1.0)
        place(pad([45,52,57],ST[4]+1.8-af(3)),af(3,0.4),0.12); section(ST[4]+1.8,ST[5]-0.2,UP,UPB,1.1,2,0.15,0.28); section(ST[5]-0.2,END,EPIC,EPICB,1.3,2,0.17,0.34); flour(ST[5]+1.6)
        cuts=[]
    if seg=='d':
        section(0,af(1,0.3),UP,UPB,1.1,1,0.15,0.28); roll(af(1,-0.9),0.9)
        section(af(1,0.3),ST[4]+0.45,EPIC,EPICB,1.5,2,0.19,0.4)
        place(kick(),ST[4]+0.5,1.0); section(ST[5]-0.2,ST[7]-0.2,UP,UPB,1.2,2,0.16,0.3); flour(ST[6]+2.6)
        cuts=[(ST[4]+0.45,ST[5]-0.2),(ST[7]-0.25,END)]
    if seg=='e':
        section(0,ST[1]-0.2,UP,UPB,1.2,2,0.16,0.3); place(kick(),ST[0]+2.6,0.8); flour(ST[0]+2.6)
        section(ST[1]-0.2,ST[2]-0.2,TEN,TENB,1.0,1,0.14,0.26); place(pad([48,55,60,64],ST[3]-ST[2]),ST[2]-0.2,0.18); [place(bell(m,2.4),ST[2]+i*0.5,0.1) for i,m in enumerate([72,76,79,84])]
        section(ST[3]-0.2,af(3,0.1),CUR,CURB,0.9,1,0.13,0.24); place(kick(),af(3,0.15),1.0); place(pad([57,64,69,76],2.8),af(3,0.2),0.2)
        section(ST[4]-0.1,END,UP,UPB,1.2,2,0.16,0.3); flour(ST[4]+0.2)
    mus=g['mus']; N=len(mus); SR=44100
    env=np.ones(N)
    for a,b in cuts:
        i0=int(a*SR); i1=int(b*SR); env[i0:i1]=0; f=int(0.04*SR); env[max(0,i0-f):i0]=np.linspace(1,0,min(f,i0))
    # reverb
    rng2=np.random.default_rng(3); n=int(2.2*SR); tt=np.arange(n)/SR; ir=rng2.standard_normal((n,2))*np.exp(-tt*2.6)[:,None]; ir[:int(0.012*SR)]=0
    wet=np.stack([fftconvolve(mus[:,c],ir[:,c])[:N] for c in (0,1)],1); wet/=np.abs(wet).max()+1e-9
    mus=mus/(np.abs(mus).max()+1e-9)*0.85+wet*0.24; mus*=env[:,None]
    fo=np.ones(N); i0=int((END-1.0)*SR); fo[i0:]=np.linspace(1,0,N-i0); mus*=fo[:,None]
    mus/=np.abs(mus).max()/0.85
    # extra drone for d red-hood section (after cut)
    if seg=='d':
        a=ST[7]-0.2; n=int((END-a)*SR); t=np.arange(n)/SR; dr=(np.sin(2*np.pi*55*t)+0.5*np.sin(2*np.pi*58.3*t))*np.minimum(1,t*2)*0.22
        for k in range(int((END-a)/0.8)): j=int((0.2+k*0.8)*SR); kk=g['kick'](); m=min(len(kk),n-j); dr[j:j+m]+=kk[:m]*0.25
        i=int(a*SR); mus[i:i+n,0]+=dr; mus[i:i+n,1]+=dr
    sf.write(f'music_{seg}.wav',mus,SR)
    return ST,DU,END
for seg in (sys.argv[1:] or TM.keys()): build(seg); print('music',seg)
