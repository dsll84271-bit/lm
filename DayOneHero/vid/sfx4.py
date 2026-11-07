import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0].replace('D=75.6','D=68.5'))
for at in (8.6,39.6,45.3): add(whoosh(0.55),at-0.28,0.6)
add(bp(rng.standard_normal(int(0.5*SR)),200,1500)*np.exp(-np.arange(int(0.5*SR))/SR*5),4.9,0.4)   # crouch shuffle
add(whoosh(0.6,500,6000),10.8,0.5); add(bp(rng.standard_normal(int(0.08*SR)),1000,9000),11.7,1.0)   # whip swish + CRACK
add(whoosh(0.7,300,5000),17.3,0.7)
n=int(1.6*SR); t=np.arange(n)/SR
boom=np.sin(2*np.pi*np.cumsum(28+70*np.exp(-t*6))/SR)*np.exp(-t*2.2)+bp(rng.standard_normal(n),40,900)*np.exp(-t*3)*0.9
add(boom,18.0,1.0)
n=int(4*SR); add(bp(rng.standard_normal(n),100,1200)*0.5,19.4,0.3)          # rushing air
for i in range(4): add(bp(rng.standard_normal(int(0.4*SR)),800,4000)*np.exp(-np.arange(int(0.4*SR))/SR*8),40.4+i*0.35,0.4)  # window rattles
n=int(3.6*SR); t=np.arange(n)/SR; add(np.sin(2*np.pi*np.cumsum(700+250*np.sign(np.sin(t*2*np.pi*2)))/SR)*0.6,41.2,0.12)  # car alarm
add(tone(500,350,0.18,0.005,0.1),42.1,0.35); add(tone(520,380,0.15,0.005,0.1),42.35,0.3)  # woof woof
add(whoosh(0.9,300,5000),53.5,0.6)                                           # Dex passes
add(tone(1300,700,0.3,0.005,0.2),56.6,0.08)                                  # bubble arrives
out/=np.abs(out).max()/0.8
sf.write('sfx_a4.wav',np.stack([out,out],1),SR); print('sfx ok')
