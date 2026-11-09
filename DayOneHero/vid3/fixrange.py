# python fixrange.py <seg> t0 t1  -> re-renders frames in [t0,t1) and splices them into <seg>_silent.mp4
import sys, subprocess, pathlib, shutil
from playwright.sync_api import sync_playwright
seg, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); FPS = 30; a, b = int(round(t0*FPS)), int(round(t1*FPS))
subprocess.run(['python3', 'mk.py', seg])
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', f'_fix_{seg}.mp4'], stdin=subprocess.PIPE)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto(pathlib.Path(__file__).resolve().parent.as_uri() + f'/{seg}.html'); pg.wait_for_timeout(800)
    for i in range(a, b): pg.evaluate(f'render({i/FPS})'); ff.stdin.write(pg.screenshot(type='png'))
    br.close()
ff.stdin.close(); ff.wait()
fc = f"[0:v]trim=end_frame={a},setpts=PTS-STARTPTS[x];[0:v]trim=start_frame={b},setpts=PTS-STARTPTS[z];[x][1:v][z]concat=n=3:v=1:a=0[v]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{seg}_silent.mp4', '-i', f'_fix_{seg}.mp4', '-filter_complex', fc, '-map', '[v]', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30', f'_spl_{seg}.mp4'], check=True)
shutil.move(f'_spl_{seg}.mp4', f'{seg}_silent.mp4'); print('fixed', seg, a, b)
