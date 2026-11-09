import numpy as np, soundfile as sf
SR=44100; N=int(SR*53.0)
mus,_=sf.read('music_r.wav'); sfx,_=sf.read('sfx_r.wav'); vo=np.zeros(N)
starts=[0.4,9.0,16.8,22.4,31.0,42.0]
for i,t0 in enumerate(starts):
    a,sr=sf.read(f'tts/r_{i}_m.wav'); a=a if a.ndim==1 else a.mean(1)
    j=int(t0*SR); n=min(len(a),N-j); vo[j:j+n]+=a[:n]
vo/=np.abs(vo).max()/0.9
env=np.abs(vo); k=int(0.25*SR); sm=np.convolve(env,np.ones(k)/k,'same'); duck=1-0.6*np.clip(sm/0.05,0,1)
mix=mus[:N]*0.42*duck[:,None]+sfx[:N]*0.42+vo[:,None]
mix=np.tanh(mix*1.1)/np.tanh(1.1); mix/=np.abs(mix).max()/0.89
sf.write('mix_r.wav',mix,SR); print('mix ok')
