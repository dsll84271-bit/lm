import numpy as np, soundfile as sf
SR=44100; N=int(SR*68.5)
mus,_=sf.read('music_a4.wav'); sfx,_=sf.read('sfx_a4.wav'); vo=np.zeros(N)
starts=[0.4,8.9,19.4,22.0,40.0,45.7,55.0,56.8]
for i,t0 in enumerate(starts):
    a,sr=sf.read(f'tts/a4_{i}_m.wav'); a=a if a.ndim==1 else a.mean(1)
    j=int(t0*SR); n=min(len(a),N-j); vo[j:j+n]+=a[:n]
vo/=np.abs(vo).max()/0.9
env=np.abs(vo); k=int(0.25*SR); sm=np.convolve(env,np.ones(k)/k,'same'); duck=1-0.6*np.clip(sm/0.05,0,1)
mix=mus[:N]*0.42*duck[:,None]+sfx[:N]*0.42+vo[:,None]
mix=np.tanh(mix*1.1)/np.tanh(1.1); mix/=np.abs(mix).max()/0.89
sf.write('mix_a4.wav',mix,SR); print('mix ok')
