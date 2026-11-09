# python mux3.py <seg> <name>  -> seg3_<seg>.mov (lossless audio, for the master) + ../out/<name>.mp4 (-14 LUFS review copy, small)
import sys, subprocess, os
seg, name = sys.argv[1], sys.argv[2]; os.makedirs('../out', exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{seg}_silent.mp4', '-i', f'mix3_{seg}.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'pcm_s16le', '-shortest', f'seg3_{seg}.mov'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'seg3_{seg}.mov', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'../out/{name}.mp4'], check=True)
print('wrote', f'../out/{name}.mp4', round(os.path.getsize(f'../out/{name}.mp4')/1e6, 1), 'MB')
