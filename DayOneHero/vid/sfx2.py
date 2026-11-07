import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0])
for at in (7.9,18.6,28.0,46.2,58.2,69.4): add(whoosh(0.55),at-0.28,0.6)
n=int(7.5*SR); x=rng.standard_normal(n); add(bp(x,150,1800)*np.linspace(0.2,1,n),0.3,0.35)       # wind roar building
for at in (10.2,12.2,15.2): add(tone(600,900,0.12,0.002,0.08),at,0.25)   # bar pops
add(hit(),24.8,0.7); add(bp(rng.standard_normal(int(3*SR)),100,900)*0.5,24.8,0.25)                # cars thud + strain rumble
add(tone(900,1400,0.1,0.002,0.06),31.4,0.2)
add(whoosh(3.5,200,1500),40.6,0.4)                                         # overshoot zoom
add(tone(500,1200,0.12,0.002,0.08),43.4,0.3)
n=int(4.5*SR); add(bp(rng.standard_normal(n),2500,8000)*np.linspace(1,0,n)**0.5,52.2,0.35)       # skid sparks
add(bp(rng.standard_normal(int(2.4*SR)),1500,7000)*np.linspace(1,0.3,int(2.4*SR)),58.6,0.4)      # skid to wall
add(hit(),61.0,0.9); add(tone(1600,1600,1.2,0.002,1.0),61.0,0.05)          # freeze-frame ring
add(tone(300,1000,0.9,0.01,0.2),64.8,0.12)                                 # bar grow
add(bp(rng.standard_normal(int(0.6*SR)),400,3000)*np.exp(-np.arange(int(0.6*SR))/SR*6),69.7,0.6) # hedge rustle
add(hit(),71.2,0.4); add(tone(800,1200,0.08,0.002,0.05),71.25,0.2)         # sticky slap
out/=np.abs(out).max()/0.8
sf.write('sfx_a2.wav',np.stack([out,out],1),SR); print('sfx ok')
