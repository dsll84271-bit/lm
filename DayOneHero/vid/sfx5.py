import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0].replace('D=75.6','D=74.0'))
for at in (12.8,29.4,37.2,40.6,55.4): add(whoosh(0.55),at-0.28,0.6)
add(hit(),3.4,0.7)                                            # NOPE stamp
for at in (6.8,8.5,10.1): add(tone(900,600,0.12,0.003,0.08),at,0.2)   # notes slap
for at in (7.4,9.1,10.7): add(hit(),at,0.55); add(bp(rng.standard_normal(int(0.15*SR)),400,3000)*np.exp(-np.arange(int(0.15*SR))/SR*25),at,0.4)
add(tone(400,1600,0.6,0.01,0.3),14.6,0.15)                    # shield power-up
for i,at in enumerate((16.8+0.7,18.4+0.7,20.0+0.7,21.4+0.7)): add(tone(1800,900,0.15,0.002,0.12),at,0.25); add(bp(rng.standard_normal(int(0.1*SR)),2000,8000)*np.exp(-np.arange(int(0.1*SR))/SR*30),at,0.3)  # boings off shield
n=int(11*SR); add(bp(rng.standard_normal(n),150,1500)*0.4,13.0,0.2)   # wind
add(bp(rng.standard_normal(int(0.25*SR)),1500,9000)*np.exp(-np.arange(int(0.25*SR))/SR*20),24.2,0.9)   # bubble pop
n=int(1.0*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),80,800)*np.exp(-t*3),24.25,0.8)        # poof
add(tone(700,300,0.4,0.01,0.3),24.9,0.15)                     # sad trombone-ish
for i in range(4): add(tone(1300,700,0.1,0.003,0.06),33.8+i*0.6,0.12)  # polaroid snaps
add(bp(rng.standard_normal(int(0.08*SR)),1000,6000),38.2,0.5); add(tone(900,900,0.06,0.002,0.04),38.2,0.3)   # clock tick 7:01
add(tone(200,120,1.0,0.01,0.8),47.3,0.25)                     # eyes sting
n=int(0.7*SR); t=np.arange(n)/SR; add(whoosh(0.7,500,8000)*1.0,49.2,1.0)   # red streak
n=int(1.6*SR); t=np.arange(n)/SR
boom=np.sin(2*np.pi*np.cumsum(28+70*np.exp(-t*6))/SR)*np.exp(-t*2.2)+bp(rng.standard_normal(n),40,900)*np.exp(-t*3)*0.9
add(boom,52.4,1.0)
add(tone(1500,2400,0.25,0.005,0.15),56.4,0.12)               # Dex pops in
out/=np.abs(out).max()/0.8
sf.write('sfx_a5.wav',np.stack([out,out],1),SR); print('sfx ok')
