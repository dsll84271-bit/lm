import pathlib, os
os.makedirs("shots",exist_ok=True)
import subprocess
from playwright.sync_api import sync_playwright
FPS=30; DUR=20.0; N=int(FPS*DUR)
ff=subprocess.Popen(["ffmpeg","-v","error","-y","-f","image2pipe","-framerate",str(FPS),"-c:v","mjpeg","-i","-","-c:v","libx264","-preset","veryfast","-crf","18","-pix_fmt","yuv420p","shoes_silent.mp4"],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={"width":1920,"height":1080})
    pg.goto(pathlib.Path(__file__).resolve().parent.as_uri()+"/shoes.html"); pg.wait_for_timeout(800)
    for i in range(N):
        pg.evaluate(f"render({i/FPS})")
        ff.stdin.write(pg.screenshot(type="jpeg",quality=92))
    b.close()
ff.stdin.close(); ff.wait(); print("exit",ff.returncode)
