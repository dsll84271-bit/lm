import pathlib, os
os.makedirs("shots",exist_ok=True)
import sys
from playwright.sync_api import sync_playwright
times=[float(x) for x in sys.argv[1:]]
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={"width":1920,"height":1080})
    pg.goto(pathlib.Path(__file__).resolve().parent.as_uri()+"/shoes.html"); pg.wait_for_timeout(800)
    for t in times:
        pg.evaluate(f"render({t})"); pg.screenshot(path=f"s_{t}.jpg",type="jpeg",quality=85)
    b.close()
