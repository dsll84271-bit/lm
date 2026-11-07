import numpy as np, soundfile as sf
exec(open('sfx1.py').read().split('for at in')[0].replace('D=75.6','D=21.5'))
for at in (4.8,17.3): add(whoosh(0.55),at-0.28,0.6)
for i in range(10): add(bp(rng.standard_normal(int(0.05*SR)),300,2500)*np.exp(-np.arange(int(0.05*SR))/SR*60),0.5+i*0.4,0.25)  # fast footsteps
# slow-mo bee buzz: low, wobbling, growing
n=int(7.1*SR); t=np.arange(n)/SR; f=55+6*np.sin(2*np.pi*3*t)
bz=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.5; bz=bp(bz,60,900)*np.linspace(0.15,1,n)**1.5
add(bz,4.8,0.5)
add(hit(),11.9,1.0)
n=int(0.6*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),150,1800)*np.exp(-t*9),11.92,0.9)   # wet splat
for k,at in enumerate((14.6,15.1,15.6)):
    n=int(0.25*SR); t=np.arange(n)/SR; add(bp(rng.standard_normal(n),250,2200)*np.exp(-t*18),at,0.55+0.1*k)
add(tone(1500,2400,0.25,0.005,0.15),18.0,0.12)   # goggles ding
out/=np.abs(out).max()/0.8
sf.write('sfx_b.wav',np.stack([out,out],1),SR); print('sfx ok')
