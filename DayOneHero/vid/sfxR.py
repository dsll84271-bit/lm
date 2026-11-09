import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0].replace('D=75.6','D=53.0'))
add(whoosh(0.55),8.4-0.28,0.6)
add(tone(900,1800,0.2,0.005,0.15),5.8,0.15)        # idea ding
for i in range(8): add(tone(500,450,0.06,0.003,0.04),9.4+i*0.18*2,0.06)  # ball bounces
n=int(4.5*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),80,700)*np.linspace(0.1,1,n),11.2,0.35)   # engine approaching
n=int(1.2*SR); t=np.arange(n)/SR; add(np.sin(2*np.pi*np.cumsum(420+20*np.sin(t*30))/SR)*0.5,14.0,0.18)    # car horn
# freeze: icy crack + reverse swell
add(tone(3000,600,0.6,0.002,0.4),15.8,0.25); add(bp(rng.standard_normal(int(0.3*SR)),2000,9000)*np.exp(-np.arange(int(0.3*SR))/SR*10),15.8,0.5)
add(whoosh(0.9,300,5000),16.0,0.5)                  # Dex runs in
add(tone(1400,1400,0.05,0.002,0.03),18.6,0.12); add(tone(1400,1400,0.05,0.002,0.03),19.6,0.12)   # watch ticks
add(tone(300,150,0.5,0.01,0.3),26.6,0.25)           # red X thunk
add(tone(700,1100,0.3,0.01,0.2),32.1,0.12)          # gentle lift
add(tone(1100,700,0.3,0.01,0.2),36.1,0.12)          # set down
add(tone(1500,2400,0.25,0.005,0.15),40.2,0.12)      # peace ding
# unfreeze: whoosh + car whoosh past
add(whoosh(0.4,500,7000),41.2,0.6)
n=int(2.6*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),80,900)*np.sin(np.pi*t/t[-1])**2,41.4,0.7)
add(tone(500,320,0.35,0.005,0.2),41.9,0.3)          # driver "huh?"
out/=np.abs(out).max()/0.8
sf.write('sfx_r.wav',np.stack([out,out],1),SR); print('sfx ok')
