# Mux Rig 2.0 segments:  python mux.py <name> <seg> [seg...]
# For each seg: <seg>2_silent.mp4 + mix2_<seg>.wav -> seg2_<seg>.mp4 (used by the final episode build).
# Then joins the given segs into ../out/<name>.mp4 at -14 LUFS for review.
import sys, subprocess, os
name, segs = sys.argv[1], sys.argv[2:]
os.makedirs('../out', exist_ok=True)
for s in segs:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{s}2_silent.mp4', '-i', f'mix2_{s}.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'pcm_s16le', '-shortest', f'seg2_{s}.mov'], check=True)
open('_cat.txt', 'w').write(''.join(f"file 'seg2_{s}.mov'\n" for s in segs))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', '_cat.txt', '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'../out/{name}.mp4'], check=True)
print('wrote', f'../out/{name}.mp4')
