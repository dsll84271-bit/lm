import numpy as np, soundfile as sf
SR=44100; N=int(SR*58.6)
mus,_=sf.read('music_a3.wav'); sfx,_=sf.read('sfx_a3.wav'); vo=np.zeros(N)
starts=[0.4,13.6,26.9,34.8,40.4,48.4]
for i,t0 in enumerate(starts):
    a,sr=sf.read(f'tts/a3_{i}_m.wav'); a=a if a.ndim==1 else a.mean(1)
    j=int(t0*SR); n=min(len(a),N-j); vo[j:j+n]+=a[:n]
vo/=np.abs(vo).max()/0.9
env=np.abs(vo); k=int(0.25*SR); sm=np.convolve(env,np.ones(k)/k,'same'); duck=1-0.6*np.clip(sm/0.05,0,1)
mix=mus[:N]*0.42*duck[:,None]+sfx[:N]*0.42+vo[:,None]
mix=np.tanh(mix*1.1)/np.tanh(1.1); mix/=np.abs(mix).max()/0.89
sf.write('mix_a3.wav',mix,SR); print('mix ok')
