# Kokoro af_heart + the Day One Hero mastering chain. Writes t_<i>_m.wav and dur.json.  (run inside tts/)
import soundfile as sf, subprocess, json
from kokoro_onnx import Kokoro
exec(open('lines.py').read())
k = Kokoro('kokoro.onnx', 'voices.bin')
M = 'highpass=f=75,lowshelf=g=2:f=160,equalizer=f=3200:t=q:w=1.2:g=3,highshelf=g=2:f=9000,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,aecho=0.8:0.5:22:0.06,loudnorm=I=-16:TP=-1.5:LRA=7'
D = []
for i, l in enumerate(TEST):
    a, sr = k.create(l, voice='af_heart', speed=1.0, lang='en-gb' if False else 'en-us')
    sf.write(f't_{i}.wav', a, sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f't_{i}.wav', '-af', M, '-ar', '44100', f't_{i}_m.wav'])
    D.append(round(len(a)/sr, 2)); print(i, D[-1], l[:40], flush=True)
json.dump(D, open('dur.json', 'w')); print('total speech', round(sum(D), 1))
