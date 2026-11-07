import soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro('kokoro.onnx','voices.bin')
lines=["Rule four. Pack spare trainers.",
"A normal pair of running shoes lasts about five to eight hundred kilometres.",
"At Dex's speed, that's not months of running. It's about half an hour.",
"So Dex's new morning routine looks a little like this.",
"The shoe shop absolutely loves him."]
for i,l in enumerate(lines):
    a,sr=k.create(l,voice='af_heart',speed=1.0,lang='en-us')
    sf.write(f's_{i}.wav',a,sr); print(i,round(len(a)/sr,2))
