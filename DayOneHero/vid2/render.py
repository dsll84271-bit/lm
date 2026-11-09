import pathlib, os
os.makedirs("shots",exist_ok=True)
import sys,subprocess,re
from playwright.sync_api import sync_playwright
seg=sys.argv[1]; subprocess.run(['python3','mk.py',seg])
END=float(re.search(r'END=([\d.]+)',open(f't_{seg}.js').read()).group(1))
if len(sys.argv)>2: END=float(sys.argv[2])  # optional: render only the first N seconds
FPS=30; N=int(FPS*END)
ff=subprocess.Popen(["ffmpeg","-v","error","-y","-f","image2pipe","-framerate",str(FPS),"-c:v","mjpeg","-i","-","-c:v","libx264","-preset","veryfast","-crf","18","-pix_fmt","yuv420p",f"{seg}_silent.mp4"],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={"width":1920,"height":1080})
    pg.goto(pathlib.Path(__file__).resolve().parent.as_uri()+f"/{seg}.html"); pg.wait_for_timeout(800)
    for i in range(N):
        pg.evaluate(f"render({i/FPS})"); ff.stdin.write(pg.screenshot(type="jpeg",quality=92))
    b.close()
ff.stdin.close(); ff.wait(); print(seg,"exit",ff.returncode)
