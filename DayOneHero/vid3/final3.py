# python final3.py -> ../out/DayOneHero_Ep3_Teleportation.mp4 (two-pass loudnorm -14 LUFS, 4x-oversampled limiter so true peak <= -1.5 dBTP, +faststart)
#                    ../out/DayOneHero_Ep3_share_720p.mp4 (small copy for phones)
import subprocess, json, re
SEGS = ['o', 's1', 's2', 's3', 's4', 's5', 'w', 'e']
NAMES = ['Cold open', 'Rule 1: your speed comes with you', 'Rule 2: teleporting is loud', 'Rule 3: Everest', 'Rule 4: space', 'Rule 5: the Moon', 'The window-cleaner rescue', 'Would you survive day 3?']
open('_cat3.txt', 'w').write(''.join(f"file 'seg3_{s}.mov'\n" for s in SEGS))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', '_cat3.txt', '-c', 'copy', '_ep3.mov'], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', '_ep3.mov', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '_ep3.mov', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-af', ln + ',aresample=176400,alimiter=limit=0.8:attack=1:release=50:level=disabled,aresample=44100', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '../out/DayOneHero_Ep3_Teleportation.mp4'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '../out/DayOneHero_Ep3_Teleportation.mp4', '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '24', '-preset', 'medium', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '../out/DayOneHero_Ep3_share_720p.mp4'], check=True)
t = 0.0
for s, n in zip(SEGS, NAMES):
    d = float(re.search(r'END=([\d.]+)', open(f't_{s}.js').read()).group(1)); print(f'{int(t//60)}:{int(t%60):02d} {n}'); t += d
print('total', f'{int(t//60)}:{t%60:04.1f}')
