import sys
seg=sys.argv[1]
# Scenes that start with '// RIG2' also load the Rig 2.0 / camera library.
rig2='<script src="rig2.js"></script><script src="world2.js"></script><script src="ep3.js"></script>' if open(f'sc_{seg}.js').read().startswith('// RIG2') else ''
open(f'{seg}.html','w').write(f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:'Lilita One';src:url('node_modules/@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2') format('woff2');}}
@font-face{{font-family:'Nunito';font-weight:800;src:url('node_modules/@fontsource/nunito/files/nunito-latin-800-normal.woff2') format('woff2');}}
html,body{{margin:0;background:#000;overflow:hidden}}</style></head><body>
<svg id="root" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg"></svg>
<script src="lib.js"></script><script src="helpers.js"></script><script src="t_{seg}.js"></script><script src="ep2.js"></script>{rig2}<script src="sc_{seg}.js"></script>
<script>window.render=function(t){{document.getElementById('root').innerHTML=DEFS+scene(t)+fades(t);}}; render(0);</script></body></html>""")
