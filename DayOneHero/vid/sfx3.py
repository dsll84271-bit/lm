import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0].replace('D=75.6','D=58.6'))
for at in (13.3,26.5,34.4,48.0): add(whoosh(0.55),at-0.28,0.6)
add(tone(200,900,2.6,0.05,0.3),3.4,0.08)
for i in range(15): add(bp(rng.standard_normal(int(0.25*SR)),80,900)*np.exp(-np.arange(int(0.25*SR))/SR*10),6.8+i*0.17,0.35)   # engines igniting
add(bp(rng.standard_normal(int(3.5*SR)),60,500),9.4,0.25)                       # engine roar
n=int(4*SR); add(bp(rng.standard_normal(n),3000,7000)*0.15*(np.sin(np.arange(n)/SR*60)>0),19.1,0.3)  # counter rattle
n=int(1.2*SR); t=np.arange(n)/SR; add(np.sin(2*np.pi*np.cumsum(70+20*np.sin(t*30))/SR)*np.exp(-t*1.5),22.8,0.6)  # stomach growl
add(hit(),23.1,0.4)
for i in range(22): add(tone(1500+i*30,1500+i*30,0.06,0.002,0.04),27.0+i*0.13,0.08)   # plate clinks
for i in range(14): add(bp(rng.standard_normal(int(0.05*SR)),1500,5000),30.1+i*0.2,0.25)        # calendar flips
add(tone(200,1800,3.4,0.05,0.2),40.4,0.08)                                      # thermometer rise
add(bp(rng.standard_normal(int(0.4*SR)),1500,7000)*np.exp(-np.arange(int(0.4*SR))/SR*8),43.3,0.6)  # burst
for i in range(10): add(tone(2400,2600,0.6,0.05,0.3),44.0+i*0.12,0.03)          # kettle whistles
add(hit(),48.8,0.4)                                                              # sticky slap
add(tone(400,250,0.4,0.01,0.3),55.6,0.2)
out/=np.abs(out).max()/0.8
sf.write('sfx_a3.wav',np.stack([out,out],1),SR); print('sfx ok')
