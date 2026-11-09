import pathlib, os
os.makedirs("shots",exist_ok=True)
import sys,subprocess
from playwright.sync_api import sync_playwright
seg=sys.argv[1]; times=[float(x) for x in sys.argv[2:]]
subprocess.run(['python3','mk.py',seg])
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={"width":1920,"height":1080}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(pathlib.Path(__file__).resolve().parent.as_uri()+f"/{seg}.html"); pg.wait_for_timeout(700)
    files=[]
    for t in times:
        pg.evaluate(f"render({t})"); f=f"shots/{seg}_{t}.jpg"; pg.screenshot(path=f,type="jpeg",quality=80); files.append(f)
    b.close()
print('\n'.join(errs[:3]))
if len(files)==1: files=files*2
n=len(files); cols=4 if n>6 else 3; W=480; H=270
inp=sum([['-i',f] for f in files],[])
fc=''.join(f'[{i}]scale={W}:{H}[v{i}];' for i in range(n))+''.join(f'[v{i}]' for i in range(n))+f'xstack=inputs={n}:layout='+'|'.join(f'{(i%cols)*W}_{(i//cols)*H}' for i in range(n))+(f':fill=black' )
subprocess.run(['ffmpeg','-y','-loglevel','error']+inp+['-filter_complex',fc,f'shots/sheet_{seg}.jpg'])
