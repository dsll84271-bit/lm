import numpy as np, soundfile as sf, json, sys
TM=json.load(open('timing.json'))
sfxb=open('../vid/sfx1.py').read().split('for at in')[0]
def build(seg):
    T=TM[seg]; ST=T['st']; DU=T['du']; END=T['end']
    g={}; exec(sfxb.replace('D=75.6',f'D={END}'),g)
    add,tone,bp,whoosh,hit,rng,SR=[g[k] for k in ('add','tone','bp','whoosh','hit','rng','SR')]
    af=lambda i,d=0: ST[i]+DU[i]+d
    def W(*ts): [add(whoosh(0.55),x-0.28,0.6) for x in ts]
    def pop_(x,gn=0.15): add(tone(900,1500,0.08,0.003,0.05),x,gn)
    def ding(x,gn=0.13): add(tone(1500,2400,0.25,0.005,0.15),x,gn)
    def thud(x,gn=0.7): add(hit(),x,gn)
    def noise(x,dur,lo,hi,gn,dec=None):
        n=int(dur*SR); s=bp(rng.standard_normal(n),lo,hi); 
        if dec: s*=np.exp(-np.arange(n)/SR*dec)
        add(s,x,gn)
    def boom(x,gn=1.0):
        n=int(1.6*SR); t=np.arange(n)/SR; add(np.sin(2*np.pi*np.cumsum(28+70*np.exp(-t*6))/SR)*np.exp(-t*2.2)+bp(rng.standard_normal(n),40,900)*np.exp(-t*3)*0.9,x,gn)
    def stamp(x): thud(x,0.5); noise(x,0.15,400,3000,0.4,25)
    if seg=='c':
        for i in range(10): add(tone(1800,1800,0.06,0.002,0.03),ST[0]-1.0+i*0.16,0.12)
        W(ST[1]-0.2,ST[3]-0.2,ST[4]-0.2,ST[7]-0.1)
        a,b=ST[1]+0.1,ST[1]+2.9
        for j in range(8): add(tone(220,140,0.12,0.004,0.08),a+(j+0.5)*(b-a)/8,0.5); noise(a+(j+0.5)*(b-a)/8,0.08,300,2500,0.25,40)
        thud(b,0.6); ding(ST[2]+0.1); pop_(ST[2]+0.6)
        n=int(1.4*SR); t=np.arange(n)/SR; add(np.sign(np.sin(2*np.pi*np.cumsum(180+20*np.sin(t*40))/SR))*0.25*np.minimum(1,t*3),ST[3]-0.2,0.12)
        add(tone(400,900,0.3,0.005,0.2),ST[3]+1.3,0.25)
        add(tone(300,1200,0.8,0.02,0.4),ST[4]-0.1,0.15); [pop_(ST[4]+1.6+i*0.7) for i in range(3)]; stamp(ST[5]+3.0)
        span=(ST[7]-0.1-ST[6])/4
        for i in range(4): add(whoosh(0.3,600,7000),ST[6]+i*span-0.1,0.6); thud(ST[6]+i*span,0.35)
        boom(af(7,0.15),0.6)
    if seg=='h':
        W(ST[3]-0.2,ST[5]-0.2,ST[6]-0.2); pop_(ST[0]+0.3)
        noise(ST[1]-0.3,0.6,200,3000,0.3,6); [stamp(ST[1]+1.6+i*1.2) for i in range(3)]
        ding(ST[2]+0.3); ding(ST[2]+1.4)
        for i in range(6): noise(af(3)+i*0.25,0.05,2000,9000,0.25,60)
        add(tone(2400,600,0.25,0.002,0.2),ST[4]+1.0,0.4); noise(ST[4]+1.0,0.1,3000,9000,0.6,30)
        add(tone(400,1400,1.5,0.1,0.5),ST[5]+0.4,0.08); add(tone(700,300,0.6,0.01,0.4),ST[6]+0.1,0.15); pop_(ST[7])
    if seg=='p':
        W(ST[4]-0.2,ST[5]-0.2,ST[6]-0.2,ST[7]-0.2,ST[8]-0.2)
        n=int((ST[2]-ST[1]-1.0)*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),80,700)*np.linspace(0.1,1,n),ST[1]+1.0,0.45)
        boom(ST[2],0.8); noise(ST[2],0.3,600,6000,0.6,12); add(whoosh(1.2,400,6000),ST[2]+0.1,0.5)
        thud(ST[2]+1.6,0.6); [noise(ST[2]+1.6+i*0.1,0.2,300,2000,0.3,20) for i in range(5)]
        ding(ST[3]+0.4); for_=[add(tone(1200,1200,0.05,0.002,0.03),ST[5]+0.2+i*0.38,0.25) for i in range(int(DU[5]/0.38)+2)]
        add(tone(500,250,0.3,0.005,0.2),ST[4]+0.6,0.2); thud(ST[7]+1.2,0.6); noise(ST[7]+1.2,0.4,200,2500,0.5,10)
        pop_(ST[8])
    if seg=='s':
        W(ST[3]-0.2,ST[4]-0.2,ST[5]-0.2,ST[6]-0.2); thud(ST[1]+1.4,0.9); ding(ST[1]+2.2); pop_(ST[2]+0.3)
        add(tone(300,500,0.5,0.01,0.3),ST[3]+2.6,0.12); thud(ST[4]+1.5,0.8)
        for i in range(8): add(tone(180,150,0.15,0.004,0.1),ST[5]+0.3+i*1.05,0.2)
        pop_(af(6,-1.6))
    if seg=='l':
        W(ST[3]-0.2,ST[4]-0.2)
        n=int(END*SR); add(bp(rng.standard_normal(n),60,400)*0.4,0,0.2)
        add(whoosh(0.8,400,5000),af(0,0.2),0.5); add(tone(160,90,0.4,0.005,0.3),af(0,1.2),0.7); noise(af(0,1.2),0.5,100,1500,0.5,8)
        for i in range(10): add(tone(300,600,0.08,0.003,0.05),3+i*3.7,0.1)
        add(tone(900,500,0.2,0.005,0.1),ST[2]+0.2,0.25); add(tone(1000,600,0.2,0.005,0.1),ST[2]+0.6,0.25)
        for i in range(10): add(tone(200,400,0.1,0.003,0.06),ST[3]+5.6+i*0.3,0.18)
        pop_(ST[4])
    if seg=='k':
        W(ST[3]-0.2,ST[4]-0.2); pop_(ST[0]+0.6); pop_(ST[0]+2.0)
        n=int(1.8*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),40,500)*np.exp(-t*1.5),ST[1]-0.4,0.5)
        noise(ST[1]+1.0,0.25,1500,12000,1.0,8); boom(ST[1]+1.05,1.0); noise(ST[1]+1.3,2.5,400,4000,0.15,1.2)
        [add(tone(1300,700,0.1,0.003,0.06),ST[3]+0.3+i*1.1,0.15) for i in range(3)]; pop_(ST[4])
    if seg=='a':
        add(whoosh(0.5,500,5000),af(0,0.2),0.5); noise(af(0,0.6),0.8,200,5000,0.6,5)
        n=int((ST[4]-af(0))*SR); add(bp(rng.standard_normal(n),60,300)*0.5,af(0,0.6),0.25)
        add(tone(300,120,1.0,0.01,0.6),ST[1]+4.2,0.35)
        for i in range(30): add(tone(800+(i%5)*120,1400,0.05,0.002,0.03),ST[2]+0.6+i*0.4,0.05)
        add(whoosh(2.0,200,3000),ST[4]+0.6,0.6); noise(af(4,0.3),0.8,300,6000,0.7,5); add(tone(600,900,0.3,0.01,0.2),af(4,0.4),0.3); pop_(ST[5])
    if seg=='x':
        W(ST[3]-0.2,ST[4]-0.2,ST[5]-0.2); add(tone(200,400,1.5,0.1,0.8),ST[1],0.08)
        for i in range(8): noise(ST[3]+0.2+i*0.31,0.12,300,3000,0.3,30)
        add(tone(1800,600,0.3,0.002,0.25),ST[3]+2.6,0.35); ding(ST[4]+1.0); stamp(ST[4]+4.2); pop_(ST[5]+0.2)
    if seg=='r':
        W(ST[5]-0.2)
        for i in range(10): add(tone(260,240,0.05,0.003,0.03),ST[1]+i*0.28,0.12)
        add(tone(600,300,0.6,0.005,0.4),ST[1]+2.6,0.2); noise(ST[1]+2.9,0.3,500,4000,0.4,12)
        add(whoosh(1.0,300,5000),ST[3]+0.2,0.6); add(tone(400,700,0.2,0.005,0.1),ST[3]+1.4,0.25)
        h=af(3,0.2); [thud(h+i*0.12,0.7) for i in range(5)]; noise(h,0.6,200,2500,0.5,6)
        add(tone(800,1600,0.3,0.005,0.2),ST[4]+1.8,0.2); ding(ST[4]+2.2)
    if seg=='d':
        W(ST[5]-0.2); n=int((af(1,0.3))*SR); add(bp(rng.standard_normal(n),80,900)*0.6,0,0.25)
        add(whoosh(1.0,300,6000),af(1,0.3),0.7)
        n=int((ST[4]+0.5-af(1,0.3))*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),200,3000)*np.minimum(1,t/3)*0.7,af(1,0.3),0.4)
        boom(ST[4]+0.5,1.0); noise(ST[4]+0.5,1.5,60,800,0.8,2); [thud(ST[4]+0.8+i*0.2,0.3) for i in range(5)]
        for i in range(6): add(tone(500,300,0.12,0.004,0.08),ST[5]+0.4+i*0.38,0.15)
        add(tone(200,120,1.2,0.01,0.8),ST[7]+2.2,0.3); add(whoosh(0.7,500,8000),af(8,0.6),1.0)
    if seg=='e':
        W(ST[1]-0.2,ST[2]-0.2,ST[3]-0.2,ST[4]-0.1); stamp(ST[0]+2.6)
        for i,x in enumerate([0.9,2.6,1.8,3.4,4.4]): add(tone(900,600,0.1,0.003,0.06),ST[1]+x,0.18)
        thud(ST[1]+6.6,0.4); pop_(ST[3]+0.2); boom(af(3,0.15),0.8); ding(ST[4]+1.2)
    out=g['out']; out/=np.abs(out).max()/0.8; sfx=np.stack([out,out],1)
    # mix
    mus,_=sf.read(f'music_{seg}.wav'); N=int(SR*END); vo=np.zeros(N)
    for i,t0 in enumerate(ST):
        a,_=sf.read(f'tts/{seg}_{i}_m.wav'); a=a if a.ndim==1 else a.mean(1); j=int(t0*SR); n=min(len(a),N-j); vo[j:j+n]+=a[:n]
    vo/=np.abs(vo).max()/0.9
    env=np.abs(vo); k=int(0.25*SR); sm=np.convolve(env,np.ones(k)/k,'same'); duck=1-0.6*np.clip(sm/0.05,0,1)
    mix=mus[:N]*0.42*duck[:,None]+sfx[:N]*0.42+vo[:,None]
    mix=np.tanh(mix*1.1)/np.tanh(1.1); mix/=np.abs(mix).max()/0.89
    sf.write(f'mix_{seg}.wav',mix,SR)
for seg in (sys.argv[1:] or TM.keys()): build(seg); print('mix',seg)
