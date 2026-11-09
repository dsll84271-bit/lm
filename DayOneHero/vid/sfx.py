import numpy as np, wave
SR=44100; D=35.0; out=np.zeros(int(SR*D))
rng=np.random.default_rng(1)
def add(sig,t0,g=1.0):
    i=int(t0*SR); n=min(len(sig),len(out)-i); out[i:i+n]+=sig[:n]*g
def env(n,a,r):
    e=np.ones(n); A=int(a*SR); R=int(r*SR)
    if A: e[:A]=np.linspace(0,1,A)
    if R: e[-R:]*=np.linspace(1,0,R)
    return e
def tone(f0,f1,dur,a=0.005,r=0.1):
    n=int(dur*SR); f=np.linspace(f0,f1,n); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*env(n,a,r)
def noise(dur): return rng.standard_normal(int(dur*SR))
def lp(x,k):  # simple one-pole lowpass, k in (0,1)
    y=np.zeros_like(x); acc=0.
    for i in range(len(x)): acc+= k*(x[i]-acc); y[i]=acc
    return y
# city ambience 0-5.25 (soft lowpassed noise + light chirps)
amb=lp(noise(5.3),0.02)*3*env(int(5.3*SR),0.6,0.02); add(amb,0,0.12)
for t0 in (0.8,2.1,3.3): add(tone(2600,3400,0.08,0.002,0.04),t0,0.05); add(tone(2900,3600,0.07,0.002,0.04),t0+0.12,0.05)
# door click
add(lp(noise(0.05),0.3)*env(int(0.05*SR),0.001,0.04),1.0,0.5)
# freeze riser 4.55-5.25 then hit + shimmer
n=int(0.7*SR); r=noise(0.7)*np.linspace(0,1,n)**2; add(r-lp(r,0.1),4.55,0.35)
add(tone(160,40,0.6,0.002,0.5),5.25,0.9)
add(lp(noise(0.4),0.05)*env(int(0.4*SR),0.001,0.35),5.25,0.8)
sh=(tone(880,880,9,0.8,2)+0.6*tone(1320,1320,9,0.8,2)+0.4*tone(1760,1760,9,0.8,2))
add(sh,5.4,0.035)
# "?!" pop
add(tone(500,1100,0.12,0.002,0.08),9.2,0.35)
# poke boop
add(tone(700,1000,0.15,0.002,0.1),14.0,0.3)
# sparkle arpeggio on peace sign
for j,f in enumerate((1046,1318,1568,2093)): add(tone(f,f,0.25,0.002,0.2),18.6+j*0.07,0.18)
# crouch + whoosh
n=int(1.2*SR); w=noise(1.2); w=(w-lp(w,0.15))*np.sin(np.linspace(0,np.pi,n))**2; add(w,23.7,0.6)
add(tone(90,40,0.5,0.002,0.4),23.8,0.6)
# title hit + chime
add(tone(70,35,0.8,0.002,0.7),30.3,1.0); add(lp(noise(0.3),0.08)*env(int(0.3*SR),0.001,0.28),30.3,0.7)
for j,f in enumerate((784,988,1175)): add(tone(f,f,0.6,0.003,0.5),31.2+j*0.09,0.15)
add(tone(1200,1200,0.15,0.002,0.1),32.2,0.15)
out/=max(1e-6,np.abs(out).max())/0.8
pcm=(np.stack([out,out],1)*32767).astype(np.int16)
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
