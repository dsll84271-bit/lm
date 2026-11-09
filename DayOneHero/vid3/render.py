# python render.py <seg> [jobs]  -> <seg>_silent.mp4 (30 fps, 1920x1080, x264 crf 16); END comes from t_<seg>.js
# Renders in parallel chunks (one Chromium per job) and joins them losslessly.
import sys, subprocess, pathlib, re
from concurrent.futures import ProcessPoolExecutor
from playwright.sync_api import sync_playwright
seg = sys.argv[1]; END = float(re.search(r'END=([\d.]+)', open(f't_{seg}.js').read()).group(1)); JOBS = int(sys.argv[2]) if len(sys.argv) > 2 else 3; FPS = 30; N = int(round(FPS*END))
def chunk(j):
    a, b = N*j//JOBS, N*(j + 1)//JOBS; out = f'_{seg}_{j}.mp4'
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-g', '30', out], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
        pg.goto(pathlib.Path(__file__).resolve().parent.as_uri() + f'/{seg}.html'); pg.wait_for_timeout(800)
        for i in range(a, b): pg.evaluate(f'render({i/FPS})'); ff.stdin.write(pg.screenshot(type='png'))
        br.close()
    ff.stdin.close(); ff.wait(); return out
if __name__ == '__main__':
    subprocess.run(['python3', 'mk.py', seg])
    with ProcessPoolExecutor(JOBS) as ex: parts = list(ex.map(chunk, range(JOBS)))
    open(f'_{seg}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'_{seg}.txt', '-c', 'copy', f'{seg}_silent.mp4'], check=True)
    print(seg, 'frames', N)
