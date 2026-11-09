# Full Ep2 (Rig 2.0): joins seg2_<seg>.mov (made by mux.py) and masters the episode with
# two-pass loudnorm to -14 LUFS / -1.5 dBTP, +faststart.  python final2.py
import subprocess, json, re
SEGS = ['v', 'c', 'h', 'p', 's', 'l', 'k', 'a', 'x', 'r', 'd', 'e']
open('_ep.txt', 'w').write(''.join(f"file 'seg2_{s}.mov'\n" for s in SEGS))
OUT = '../out/DayOneHero_Ep2_Invincible_Rig2.mp4'
p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'concat', '-safe', '0', '-i', '_ep.txt', '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', p.stderr)[-1])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', '_ep.txt', '-c:v', 'copy', '-af', af, '-ar', '44100', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', OUT], check=True)
print('wrote', OUT, 'measured input', m['input_i'], 'LUFS')
