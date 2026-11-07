# Generate only segment 'p' narration (used by the car-crash before/after test).
import soundfile as sf, subprocess
from kokoro_onnx import Kokoro
exec(open('lines.py').read())
k=Kokoro('kokoro.onnx','voices.bin')
M='highpass=f=75,lowshelf=g=2:f=160,equalizer=f=3200:t=q:w=1.2:g=3,highshelf=g=2:f=9000,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,aecho=0.8:0.5:22:0.06,loudnorm=I=-16:TP=-1.5:LRA=7'
for i,l in enumerate(L['p']):
    a,sr=k.create(l,voice='af_heart',speed=1.0,lang='en-us')
    sf.write(f'p_{i}.wav',a,sr)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'p_{i}.wav','-af',M,'-ar','44100',f'p_{i}_m.wav'])
    print(i,round(len(a)/sr,2),flush=True)
