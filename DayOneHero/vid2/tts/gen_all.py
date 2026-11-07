# Generate every Ep2 narration line with the line sets the timings were built from:
# c and e from L4, k from L2, x and v from L3, everything else from L. Does not touch dur.json.
import soundfile as sf, subprocess, json
from kokoro_onnx import Kokoro
exec(open('lines.py').read())
SETS = {g: L[g] for g in L}; SETS.update({'c': L4['c'], 'e': L4['e'], 'k': L2['k'], 'x': L3['x'], 'v': L3['v']})
k = Kokoro('kokoro.onnx', 'voices.bin')
M = 'highpass=f=75,lowshelf=g=2:f=160,equalizer=f=3200:t=q:w=1.2:g=3,highshelf=g=2:f=9000,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,aecho=0.8:0.5:22:0.06,loudnorm=I=-16:TP=-1.5:LRA=7'
D = json.load(open('dur.json')); bad = []
for g, ls in SETS.items():
    for i, l in enumerate(ls):
        a, sr = k.create(l, voice='af_heart', speed=1.0, lang='en-us')
        sf.write(f'{g}_{i}.wav', a, sr)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{g}_{i}.wav', '-af', M, '-ar', '44100', f'{g}_{i}_m.wav'])
        d = round(len(a)/sr, 2)
        if g in D and abs(D[g][i] - d) > .02: bad.append((g, i, D[g][i], d))
    print(g, len(ls), flush=True)
print('mismatches:', bad)
