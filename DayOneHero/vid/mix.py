import numpy as np, soundfile as sf, sys
VOICE=sys.argv[1]
from scipy.signal import resample_poly
SR=44100; N=int(SR*35)
mus,_=sf.read('music_rev.wav'); sfx,_=sf.read('sfx.wav')
vo=np.zeros(N)
place=[(0,1.3),(1,5.8),(2,16.6),(3,20.2),(4,26.3)]
for i,t0 in place:
    a,sr=sf.read(f'tts/{VOICE}_{i}_m.wav')
    if sr!=SR: a=resample_poly(a,SR,sr)
    j=int(t0*SR); n=min(len(a),N-j); vo[j:j+n]+=a[:n]
vo/=np.abs(vo).max()/0.9
# ducking envelope from VO
env=np.abs(vo); k=int(0.25*SR); sm=np.convolve(env,np.ones(k)/k,'same'); duck=1-0.6*np.clip(sm/0.05,0,1)
mix=np.zeros((N,2))
mix+=mus[:N]*0.42*duck[:,None]
mix+=sfx[:N]*0.45
mix+=vo[:,None]*1.0
mix=np.tanh(mix*1.1)/np.tanh(1.1)
mix/=np.abs(mix).max()/0.89
sf.write(f'mix_{VOICE}.wav',mix,SR); print('ok')
