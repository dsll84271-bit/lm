"""Narrate a case file paragraph by paragraph in the Fiction Files Detective voice (Qwen3-TTS Base, cloned from docs/voice/detective_ref.wav).

usage: python detective_vo.py narration.txt out_dir [paragraph numbers to (re)do]
Needs torch (CPU) and qwen-tts; about 6 s of compute per second of speech on 4 CPU cores.
import re, sys, time, torch, soundfile as sf
from pathlib import Path
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(4)
REF = "/home/user/lm/docs/voice/detective_ref.wav"
REF_TEXT = ("It's fiction. But fifty-seven years ago, America did something terrifyingly close. "
            "Live on TV, a man reached into a container, pulled out a date of birth, and decided which young men would be sent to war. "
            "Welcome to the Fiction Files. I'm your Detective. Today's case file is number one. The Reaping.")
# spoken forms for words the model may misread (only for the voice, the script is unchanged)
SAY = [(r"\btesserae\b", "tessera-ee"), (r"\b1969\b", "nineteen sixty-nine"), (r"\b1944\b", "nineteen forty-four"),
       (r"\b1950\b", "nineteen fifty"), (r"\bIraq\b", "Ih-rahk")]
def spoken(t):
    for a, b in SAY: t = re.sub(a, b, t)
    return t
paras = [p.strip() for p in Path(sys.argv[1]).read_text().split("\n\n") if p.strip()]
only = {int(x) for x in sys.argv[3:]}
out = Path(sys.argv[2]); out.mkdir(exist_ok=True)
m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-Base", device_map="cpu", dtype=torch.float32)
prompt = m.create_voice_clone_prompt(ref_audio=REF, ref_text=REF_TEXT)
for i, p in enumerate(paras):
    if only and i not in only: continue
    t = time.time()
    torch.manual_seed(1000 + i)
    wavs, sr = m.generate_voice_clone(text=spoken(p), language="English", voice_clone_prompt=prompt)
    sf.write(out / f"p{i:02d}.wav", wavs[0], sr)
    print(f"p{i:02d} {len(wavs[0])/sr:5.1f}s audio in {time.time()-t:4.0f}s", flush=True)
