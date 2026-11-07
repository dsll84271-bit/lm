import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0].replace('D=75.6','D=20.0'))
for at in (3.0,7.7,12.3,16.2): add(whoosh(0.55),at-0.28,0.6)
n=int(2.8*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),300,2500)*(0.5+0.5*np.sin(t*9)**2),0.1,0.18)   # sizzling
add(tone(900,600,0.12,0.003,0.08),0.9,0.2)       # note slap
for i in range(7): add(tone(1200,1200,0.05,0.002,0.03),6.7+i*0.18,0.1)   # calendar ticks
n=int(4.2*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),200,2000)*0.6,7.8,0.3)   # wind rush
for i in range(40): add(tone(2200,2200,0.02,0.001,0.01),8.4+i*0.085,0.05)   # odometer clicks
for i in range(14): add(tone(260,180,0.12,0.004,0.08),12.6+i*0.24,0.18)  # shoes thudding onto pile
add(tone(2000,2000,0.08,0.002,0.05),16.9,0.3); add(tone(2600,2600,0.3,0.002,0.25),17.0,0.3)  # ka-ching
n=int(3*SR); add(bp(rng.standard_normal(n),1500,5000)*0.3*np.abs(np.sin(np.arange(n)/SR*40)),17.2,0.12)  # receipt printer
out/=np.abs(out).max()/0.8
sf.write('sfx_s.wav',np.stack([out,out],1),SR); print('sfx ok')
