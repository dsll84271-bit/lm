// node check.js <scene> <end>  — evaluates every frame headlessly and reports errors
const fs = require('fs'); const [seg, end] = [process.argv[2], +process.argv[3]];
const code = ['stick.js', `sc_${seg}.js`].map(f => fs.readFileSync(f, 'utf8')).join('\n;\n') + `
;const errs={}; for(let i=0;i<${end}*30;i++){const t=i/30; try{ const s=finish(scene(t),t); if(s.includes('NaN')) (errs['NaN in svg']=errs['NaN in svg']||[]).push(t.toFixed(2)); }catch(e){(errs[e.message]=errs[e.message]||[]).push(t.toFixed(2));}}
for(const k in errs) console.log(k,'@',errs[k].slice(0,6).join(','),'n=',errs[k].length); console.log('checked', Math.floor(${end}*30), 'frames');`;
new Function('require', code)(require);
