// node check.js <seg>  — evaluates every frame headlessly and reports errors / NaN
const fs = require('fs'); const seg = process.argv[2];
const files = ['lib.js', 'helpers.js', `t_${seg}.js`, 'ep2.js', 'rig2.js', 'world2.js', 'ep3.js', 'ep4.js', `sc_${seg}.js`];
const code = files.map(f => fs.readFileSync(f, 'utf8')).join('\n;\n') + `
;const errs={}; const N=Math.round(END*30); const step=+(process.argv[3]||1); for(let i=0;i<N;i+=step){const t=i/30; try{ const s=scene(t)+fades(t); if(s.includes('NaN')||s.includes('undefined')) (errs['NaN/undefined in svg']=errs['NaN/undefined in svg']||[]).push(t.toFixed(2)); }catch(e){(errs[e.message]=errs[e.message]||[]).push(t.toFixed(2));}}
for(const k in errs) console.log(k,'@',errs[k].slice(0,8).join(','),'n=',errs[k].length); console.log('checked', N, 'frames');`;
new Function('require', 'process', code)(require, process);
