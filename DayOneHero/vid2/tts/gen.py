import soundfile as sf, subprocess, json
from kokoro_onnx import Kokoro
exec(open('lines.py').read())
k=Kokoro('kokoro.onnx','voices.bin')
M='highpass=f=75,lowshelf=g=2:f=160,equalizer=f=3200:t=q:w=1.2:g=3,highshelf=g=2:f=9000,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,aecho=0.8:0.5:22:0.06,loudnorm=I=-16:TP=-1.5:LRA=7'

import sys
SEL={'k':L2,'x':L3}.get(sys.argv[1],L) if len(sys.argv)>1 else L
D=json.load(open('dur.json')) if len(sys.argv)>1 else {}
for g,ls in SEL.items():
    D[g]=[]
    for i,l in enumerate(ls):
        a,sr=k.create(l,voice='af_heart',speed=1.0,lang='en-us')
        sf.write(f'{g}_{i}.wav',a,sr)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{g}_{i}.wav','-af',M,'-ar','44100',f'{g}_{i}_m.wav'])
        D[g].append(round(len(a)/sr,2))
    print(g,D[g],round(sum(D[g]),1))
json.dump(D,open('dur.json','w'))
print('total',round(sum(sum(v) for v in D.values()),1))
