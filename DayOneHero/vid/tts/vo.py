import soundfile as sf, numpy as np, sys
from kokoro_onnx import Kokoro
k=Kokoro('kokoro.onnx','voices.bin')
voice=sys.argv[1]
lines=["This is Dex. He's about to have the best morning of his life.",
"Because this morning, Dex woke up with super speed. And to him, it looks like the entire world just... froze.",
"Every superhero fan has wanted this power.",
"But if you actually got it tomorrow, real physics says you probably wouldn't survive the day.",
"So let's find out exactly how long you'd last."]
for i,l in enumerate(lines):
    a,sr=k.create(l,voice=voice,speed=1.0,lang='en-gb' if voice.startswith('b') else 'en-us')
    sf.write(f'{voice}_{i}.wav',a,sr); print(i,round(len(a)/sr,2))
