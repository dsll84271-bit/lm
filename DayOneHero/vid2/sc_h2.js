// RIG2
// Ep2 haircut segment (h), Rig 2.0. Timing from t_h.js. END 48.87.
const RH = { x: 0, y: 700, z: 1 };
const W5 = ST[3] - .2, W6 = ST[5] - .2, W7 = ST[6] - .2;
const STONE_DEF = `<defs><filter id="stone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.30 0.33 0.30 0 0.08  0.30 0.33 0.30 0 0.08  0.30 0.33 0.30 0 0.11  0 0 0 1 0"/></filter></defs>`;
const BARBER = { hood: false, type: 'jacket', top: '#FFFFFF', shirt: '#BFE6FF', hair: 'short', hairCol: '#5A3A2A', pants: '#3D3F66', acc: 'glasses' };
// ---------------------------------------------------------------- long hair (falls from under the hood, behind the body)
function hairLong(x, y, s, len, t, sway=0) {
  if (len <= 4) return ''; let g = '';
  for (const d of [-1, 1]) {
    const x0 = x + d*64*s, y0 = y - 238*s + 46*s, end = Math.min(y0 + len, y + 4), pool = Math.max(0, y0 + len - y - 4);
    const w = 21*s, wv = k => Math.sin(k*5 + t*2 + d)*8*s*Math.min(1, len/120) + sway*k*40;
    let L = `M${x0 - d*w},${y0}`, R = '';
    for (let i = 1; i <= 8; i++) { const k = i/8, yy = lerp(y0, end, k); L += ` L${x0 + d*(k*12*s) + wv(k) - d*w*(1 - k*.3)},${yy}`; R = ` L${x0 + d*(k*12*s) + wv(k) + d*w*(1 + k*.25)},${yy}` + R; }
    g += `<path d="${L}${pool ? ` L${x0 + d*(24*s + pool*.9)},${y + 4} L${x0 + d*(24*s + pool*.9)},${y - 14}` : ''}${R} L${x0 + d*w},${y0} Z" fill="#1F2140" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${x0 + d*6},${y0 + 20} Q${x0 + d*18 + wv(.5)},${(y0 + end)/2} ${x0 + d*20 + wv(.9)},${end - 20}" stroke="#4A4F7A" stroke-width="5" fill="none" opacity=".7"/>`;
  }
  return g;
}
const hairAt = t => t < ST[5] ? 0 : t < ST[6] - .2 ? 8 + 52*seg(t, ST[5] + .4, ST[5] + DU[5]) : 205;
// ---------------------------------------------------------------- sets
function whiteboardSet(t, L, blur='') {
  let w = studioFloor('#1E2B6E') + `<g transform="translate(-600,${GY})"><rect x="-8" y="-640" width="16" height="640" fill="#8C93B8" stroke="${INK}" stroke-width="4"/><rect x="560" y="-640" width="16" height="640" fill="#8C93B8" stroke="${INK}" stroke-width="4"/><rect x="-40" y="-760" width="640" height="440" rx="14" fill="#FFFFFF" stroke="${INK}" stroke-width="8"/>`;
  const k = seg(t, .9, 2.6); w += `<text x="280" y="-560" text-anchor="middle" font-family="Lilita One" font-size="78" fill="#3D8BFF" stroke="#3D8BFF" stroke-width="1" style="clip-path: inset(0 ${100 - k*100}% 0 0)">INVINCIBLE</text><text x="280" y="-430" text-anchor="middle" font-family="Lilita One" font-size="110" fill="#E8463C" opacity="${seg(t, 2.6, 2.9)}">= ?</text></g>`;
  return L(0, studioBack(t)) + L(1, w, blur);
}
function museum(t, L, blur='') {
  let back = roomW(t, { wall: '#E9E4F2', stripe: '#DED6EC', floor: '#BFB4D4' });
  for (const [x, c] of [[-1100, '#7FD3FF'], [900, '#FFB9AE']]) back += `<rect x="${x}" y="200" width="380" height="300" fill="#D9A866" stroke="${INK}" stroke-width="8"/><rect x="${x + 24}" y="224" width="332" height="252" fill="${c}"/><circle cx="${x + 140}" cy="330" r="60" fill="#fff" opacity=".5"/><path d="M${x + 40},460 L${x + 170},340 L${x + 260},420 L${x + 340},360 L${x + 340},460 Z" fill="#fff" opacity=".45"/>`;
  back += `<path d="M-220,-200 L-420,${GY - 140} L420,${GY - 140} L220,-200 Z" fill="#FFF6C8" opacity=".25"/>`;
  let near = `<g transform="translate(0,${GY + 40})"><rect x="-200" y="-150" width="400" height="150" rx="10" fill="#F2EEF8" stroke="${INK}" stroke-width="7"/><rect x="-230" y="-176" width="460" height="34" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-110" width="180" height="56" rx="6" fill="#D9A866" stroke="${INK}" stroke-width="4"/><text y="-72" text-anchor="middle" font-family="Lilita One" font-size="30" fill="${INK}">DEX (STONE)</text></g>`;
  for (const px of [-520, 520]) near += `<g transform="translate(${px},${GY + 40})"><rect x="-10" y="-170" width="20" height="170" fill="#D9A866" stroke="${INK}" stroke-width="5"/><circle cy="-176" r="18" fill="#D9A866" stroke="${INK}" stroke-width="5"/></g>`;
  near += `<path d="M-510,${GY - 120} Q-260,${GY - 40} -20,${GY - 120}" stroke="#C8352C" stroke-width="14" fill="none"/><path d="M20,${GY - 120} Q260,${GY - 40} 510,${GY - 120}" stroke="#C8352C" stroke-width="14" fill="none"/>`;
  return L(1, back, blur) + L(1, near, blur && 'b2');
}
const PY = GY - 136;  // Dex stands on the plinth
// stone that creeps from the feet up, then cracks off. level = world y above which Dex is still flesh
const stoneTop = t => t < ST[1] - .1 ? 1e4 : t < ST[2] ? lerp(PY + 10, PY - 400, E.io(seg(t, ST[1] - .1, ST[1] + 1.3))) : 1e4;
function statueDex(t, keys, extra={}) {
  const o = dexAt(keys, t, () => ({ x: 0, y: PY }), { s: DS, seed: 3, ...extra });
  const top = stoneTop(t), d = chibi2(o);
  if (top > 9000) return d;
  const cracks = `<path d="M-30,${PY - 300} l20,40 l-14,30 l18,34 M40,${PY - 160} l-24,30 l10,24 M-50,${PY - 90} l16,22" stroke="#6E6880" stroke-width="5" fill="none" opacity="${seg(t, ST[1] + 1.0, ST[1] + 2.0)}"/>`;
  return `<clipPath id="flesh"><rect x="-3000" y="-3000" width="6000" height="${3000 + top}"/></clipPath><clipPath id="rock"><rect x="-3000" y="${top}" width="6000" height="6000"/></clipPath>` +
    `<g clip-path="url(#flesh)">${d}</g><g clip-path="url(#rock)"><g filter="url(#stone)">${d}</g>${cracks}</g>`;
}
function shards(t, t0) { if (t < t0 || t > t0 + 1.2) return ''; const k = t - t0; let s = '';
  for (let i = 0; i < 16; i++) { const a = -Math.PI*(.1 + .8*hash(i)), v = 500 + hash(i + 3)*700; const x = Math.cos(a)*v*k*(i%2 ? 1 : -1), y = PY - 60 - hash(i + 7)*300 + Math.sin(a)*v*k + 1600*k*k;
    s += `<path transform="translate(${x},${y}) rotate(${k*400*(i%2 ? 1 : -1)})" d="M-18,-12 L14,-16 L20,10 L-8,18 Z" fill="#B9B3C9" stroke="${INK}" stroke-width="4"/>`; } return s; }
function barberShop(t, L, blur='') {
  let back = roomW(t, { wall: '#D7F0FF', stripe: '#C9EBFA', floor: '#EDE6D8' });
  back += `<rect x="-380" y="140" width="760" height="560" rx="30" fill="#E9F7FF" stroke="${INK}" stroke-width="8"/><rect x="-350" y="170" width="700" height="500" rx="20" fill="#BFE6FF"/><path d="M-290,230 l150,-40 M-290,300 l260,-80" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".7"/>`;
  back += `<g transform="translate(720,160)"><rect x="-40" y="0" width="80" height="380" rx="40" fill="#fff" stroke="${INK}" stroke-width="6"/><clipPath id="pole"><rect x="-36" y="4" width="72" height="372" rx="36"/></clipPath><g clip-path="url(#pole)">${[...Array(10)].map((_, i) => `<path d="M-60,${(i*70 + t*90) % 700 - 140} L60,${(i*70 + t*90) % 700 - 210}" stroke="${i%2 ? '#3D8BFF' : '#E8463C'}" stroke-width="22"/>`).join('')}</g><rect x="-50" y="-24" width="100" height="30" rx="10" fill="#C9D0EE" stroke="${INK}" stroke-width="5"/><rect x="-50" y="374" width="100" height="30" rx="10" fill="#C9D0EE" stroke="${INK}" stroke-width="5"/></g>`;
  back += `<rect x="-1100" y="520" width="420" height="18" fill="#B07A4A" stroke="${INK}" stroke-width="5"/>` + [0,1,2,3].map(i => `<rect x="${-1080 + i*100}" y="${430 + (i%2)*20}" width="50" height="${90 - (i%2)*20}" rx="12" fill="${['#7ED957','#FF7EB6','#7FD3FF','#FFC21F'][i]}" stroke="${INK}" stroke-width="4"/>`).join('');
  for (let i = -12; i < 12; i++) back += `<rect x="${i*160}" y="${GY - 140}" width="80" height="80" fill="#D9CFBC" opacity=".6"/><rect x="${i*160 + 80}" y="${GY - 60}" width="80" height="80" fill="#D9CFBC" opacity=".6"/>`;
  return L(1, back, blur);
}
function chairAndCape(t, x, front) {   // front=false: chair back; true: cape over Dex + armrests
  if (!front) return `<g transform="translate(${x},${GY})"><rect x="-150" y="-470" width="300" height="250" rx="40" fill="#2E3150" stroke="${INK}" stroke-width="7"/><rect x="-30" y="-120" width="60" height="120" fill="#8C93B8" stroke="${INK}" stroke-width="6"/><rect x="-120" y="-20" width="240" height="30" rx="12" fill="#8C93B8" stroke="${INK}" stroke-width="6"/></g>`;
  const w = Math.sin(t*1.7)*6;
  return `<g transform="translate(${x},${GY})"><path d="M-70,-400 Q0,-380 70,-400 L${210 + w},-110 Q0,-80 ${-210 + w},-110 Z" fill="#7FD3FF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-60,-300 L-120,-130 M40,-320 L90,-140" stroke="#5FB8E8" stroke-width="8" opacity=".7"/><rect x="-200" y="-150" width="400" height="60" rx="22" fill="#2E3150" stroke="${INK}" stroke-width="7"/></g>`;
}
function hand2Big(x, y, s, nail, t) {   // close-up hand with growing, curling nails
  let g = `<g transform="translate(${x},${y}) scale(${s})"><path d="M-110,140 Q-130,20 -100,-40 L100,-40 Q130,20 110,140 Z" fill="url(#skin)" stroke="${INK}" stroke-width="7"/>`;
  [-75, -25, 25, 75].forEach((fx, i) => { const h = [150, 175, 165, 130][i]; g += `<rect x="${fx - 22}" y="${-40 - h}" width="44" height="${h + 20}" rx="22" fill="url(#skin)" stroke="${INK}" stroke-width="6"/>`;
    const n = nail*(1 + i*.06), curl = Math.min(1, n/180); g += `<path d="M${fx - 16},${-40 - h + 14} Q${fx - 18},${-40 - h - n*.6} ${fx + curl*50},${-40 - h - n*.8 + curl*40} Q${fx + 22},${-40 - h - n*.4} ${fx + 16},${-40 - h + 14} Z" fill="#FFD9E0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`; });
  g += `<rect x="-200" y="-30" width="140" height="44" rx="22" fill="url(#skin)" stroke="${INK}" stroke-width="6" transform="rotate(-30,-100,0)"/><rect x="-140" y="130" width="280" height="140" rx="30" fill="#FFC21F" stroke="${INK}" stroke-width="7"/></g>`;
  return g;
}
// ---------------------------------------------------------------- shots
const SHOTS_H = [
  { t: 0, ref: RH, cam: push(0, 4.3, { x: 40, y: GY - 380, z: 1.4, r: 0 }, { x: 60, y: GY - 380, z: 1.5, r: 1 }, 'lin'), draw: (t, c, L) =>
      whiteboardSet(t, L) + L(1, dex([[0,'idle'], [.6,{ ...POSES.point, armF:[100,-60] }, 'o'], [2.7,'think','o']], t, 380, GY)) + chipAt(t, .7, 960, 130, 'WHAT DOES INVINCIBLE MEAN?', '#3D8BFF', 58) },
  { t: 4.3, ref: RH, cam: push(4.3, 6.0, { x: 0, y: PY - 220, z: 1.5, r: 0 }, { x: 0, y: PY - 200, z: 1.7, r: 0 }, 'lin'), draw: (t, c, L) =>
      museum(t, L, 'b4') + L(1, statueDex(t, [[0,'idle'], [4.8,{ ...POSES.worried, look:[0,10] }, 'o']])) },
  { t: 6.0, ref: RH, cam: push(6.0, 7.2, { x: 0, y: PY - 90, z: 3.0, r: 3 }, { x: 0, y: PY - 90, z: 3.2, r: 3 }, 'lin'), draw: (t, c, L) =>
      museum(t, L, 'b8') + L(1, statueDex(t, [[0, { ...POSES.worried, look:[0,10] }]], { sq: 1 - .02*Math.max(0, Math.sin((t - 6.2)*40)) })) + chipAt(t, 6.15, 960, 150, 'CAN’T BEND ✗', '#E8463C', 64) },
  { t: 7.2, ref: RH, cam: push(7.2, 8.4, { x: 0, y: PY - 245, z: 4.0, r: -2 }, { x: 0, y: PY - 245, z: 4.4, r: -2 }, 'lin'), draw: (t, c, L) =>
      museum(t, L, 'b14') + L(1, statueDex(t, [[0, { ...POSES.surprise, eyes:'wide', brow: 12 + 3*Math.sin(t*30) }]])) + chipAt(t, 7.3, 960, 150, 'CAN’T BLINK ✗', '#E8463C', 64) },
  { t: 8.4, ref: RH, cam: push(8.4, 9.9, { x: 0, y: PY - 200, z: 2.6, r: 2 }, { x: 0, y: PY - 200, z: 2.9, r: 2 }, 'lin'), draw: (t, c, L) =>
      museum(t, L, 'b8') + L(1, statueDex(t, [[0, { ...POSES.worried, mouth:'flat', sweat:true, eyes:'squeeze' }]])) + chipAt(t, 8.5, 960, 150, 'CAN’T BREATHE ✗', '#E8463C', 64) },
  { t: 9.9, ref: RH, cam: push(9.9, ST[2] - .1, { x: 0, y: PY - 240, z: 1.75, r: 0 }, { x: 0, y: PY - 300, z: 1.25, r: 0 }, 'io'), draw: (t, c, L) => {
      const pk = seg(t, 10.8, 11.5), px = lerp(700, 10, E.io(pk)), py = lerp(PY - 700, PY - 395*DS + 20, E.snap(pk));
      return museum(t, L) + L(1, statueDex(t, [[0, { ...POSES.worried, mouth:'flat' }]]) + pigeon(px, py, 1.3, t, pk < 1 ? 'fly' : 'stand')) + chipAt(t, 10.1, 1450, 360, '= A STATUE', '#6E6880', 64); } },
  { t: ST[2] - .1, ref: RH, cam: push(ST[2] - .1, W5, { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 60, y: GY - 300, z: 1.55, r: -2 }, 'lin'), draw: (t, c, L) => {
      const a = ST[2] + .3, hop = seg(t, a + .7, a + 1.15);
      const pos = tt => { const k = seg(tt, a + .7, a + 1.15); return { x: lerp(0, 330, k), y: lerp(PY, GY + 40, k) - 140*4*k*(1 - k) }; };
      const K = [[ST[2] - .1, { ...POSES.worried, mouth:'flat' }], [a, { ...POSES.crouchPop, eyes:'squeeze' }, 'snap'], [a + .2, 'cheer', 'snap'], [a + .7, 'crouchPop'], [a + .8, 'popJump', 'snap', .1], [a + 1.15, 'landSquash', 'in', .1], [a + 1.5, 'stretchUp', 'o'], [a + 2.4, 'smile', 'o'], [a + 2.9, { ...POSES.think, armF:[-40,-150], handF:'fist', eyes:'happy', mouth:'grin' }, 'o'], [a + 3.4, 'peace', 'o']];
      const o = dexAt(K, t, pos, { s: DS, seed: 3, air: hop > 0 && hop < 1 });
      return museum(t, L) + L(1, chibi2(o) + shards(t, a) + dust(0, PY - 60, t, a, 9, 1.4, '#D3CCE3') + (t > a + 2.9 && t < a + 3.3 ? bang(t, a + 2.95, 330, GY - 470, 'CLONK', '#FFC21F', 46, -8) : '')) +
        chipAt(t, ST[2] + .4, 470, 330, 'MOVES NORMALLY ✓', '#7ED957', 52) + chipAt(t, ST[2] + 1.5, 1450, 330, 'CAN’T BE DAMAGED ✓', '#7ED957', 52) + flash(t, a, '#fff', .15, .5); } },
  // barber
  { t: W5, ref: RH, cam: push(W5, 20.0, { x: 120, y: GY - 360, z: 1.3, r: 0 }, { x: 80, y: GY - 360, z: 1.45, r: 0 }, 'lin'), draw: (t, c, L) => {
      const cape = seg(t, ST[3] + .3, ST[3] + .8);
      return barberShop(t, L) + L(1, chairAndCape(t, 0, false) + dex([[0, 'smile']], t, 0, GY - 180, { noShadow: true }) + (cape > 0 ? `<g transform="translate(0,${-(1 - E.snap(cape))*500})" opacity="${cape}">${chairAndCape(t, 0, true)}</g>` : '') +
        chibi2(dexAt([[0,{ ...POSES.wave, eyes:'happy' }], [ST[3] + .3, { ...POSES.shrug, mouth:'grin' }, 'o']], t, () => ({ x: 420, y: GY + 20 }), { ...BARBER, s: 1.1, seed: 9 }))) + chipAt(t, ST[3] + .3, 960, 130, 'HAIRCUT DAY', '#3D8BFF', 60); } },
  { t: 20.0, ref: RH, cam: push(20.0, 22.3, { x: 330, y: GY - 420, z: 2.1, r: 3 }, { x: 330, y: GY - 420, z: 2.35, r: 4 }, 'lin'), draw: (t, c, L) => {
      const op = Math.abs(Math.sin(t*9));
      return barberShop(t, L, 'b8') + L(1, chairAndCape(t, 0, false) + dex([[0, 'smile']], t, 0, GY - 180, { noShadow: true }) + chairAndCape(t, 0, true) +
        chibi2(dexAt([[0, { ...POSES.point, armF:[60,-40], eyes:'happy', mouth:'smirk' }]], t, () => ({ x: 420, y: GY + 20 }), { ...BARBER, s: 1.1, seed: 9 })) + `<g transform="translate(250,${GY - 330}) scale(-1,1)">${scissors(0, 0, .6, op, 0)}</g>`); } },
  { t: 22.3, ref: RH, cam: push(22.3, ST[4] + 1.0, { x: 60, y: GY - 480, z: 3.6, r: -3 }, { x: 60, y: GY - 485, z: 4.1, r: -4 }, 'in'), draw: (t, c, L) => {
      const k = seg(t, 22.4, ST[4] + 1.0), op = 1 - E.in(k);
      return barberShop(t, L, 'b14') + L(1, hairLong(0, GY - 180, DS, 70, t) + dex([[0, { ...POSES.smile, look:[8,-4] }]], t, 0, GY - 180, { noShadow: true }) + chairAndCape(t, 0, true) + `<g transform="translate(${150 + 60*(1 - k)},${GY - 515}) scale(-1,1) rotate(12)">${scissors(0, 0, .5, op*.8, 0)}</g>`); } },
  { t: ST[4] + 1.0, ref: RH, cam: push(ST[4] + 1.0, ST[4] + 2.0, { x: 110, y: GY - 470, z: 3.0, r: 5 }, { x: 110, y: GY - 450, z: 2.6, r: 2 }, 'snap'), draw: (t, c, L) => {
      const a = ST[4] + 1.0, k = t - a; let parts = '';
      for (let i = 0; i < 2; i++) { const d = i ? 1 : -1; parts += `<g transform="translate(${170 + d*260*k},${GY - 510 - 300*k + 1100*k*k}) rotate(${d*600*k})"><path d="M0,0 L-130,${d*10}" stroke="#C9D0EE" stroke-width="22" stroke-linecap="round"/><circle cx="60" cy="${d*12}" r="30" fill="none" stroke="#E8463C" stroke-width="14"/></g>`; }
      return barberShop(t, L, 'b8') + L(1, hairLong(0, GY - 180, DS, 70, t) + dex([[0, { ...POSES.smile, look:[8,-4] }], [a + .1, { ...POSES.surprise, eyes:'wide' }, 'snap']], t, 0, GY - 180, { noShadow: true }) + chairAndCape(t, 0, true) + parts) +
        bang(t, a, 1300, 300, 'SNAP!', '#FFC21F', 150, 8) + (k < .25 ? focusLines(t, 1100, 450, .6, 330) : '') + flash(t, a, '#fff', .12, .6); } },
  { t: ST[4] + 2.0, ref: RH, cam: push(ST[4] + 2.0, W6, { x: 220, y: GY - 380, z: 1.65, r: 0 }, { x: 220, y: GY - 380, z: 1.8, r: 0 }, 'lin'), draw: (t, c, L) =>
      barberShop(t, L, 'b4') + L(1, chairAndCape(t, 0, false) + hairLong(0, GY - 180, DS, 70, t) + dex([[0, { ...POSES.smile, eyes:'happy', mouth:'grin' }]], t, 0, GY - 180, { noShadow: true }) + chairAndCape(t, 0, true) +
        chibi2(dexAt([[0, { ...POSES.surprise, eyes:'shock', mouth:'wail', armF:[70,-40], handF:'fist' }], [ST[4] + 2.8, { ...POSES.gulp, eyes:'shock' }, 'o']], t, () => ({ x: 450, y: GY + 20 }), { ...BARBER, s: 1.1, seed: 9 }))) + chipAt(t, ST[4] + DU[4] - .6, 960, 140, 'HAIR = BODY = UNCUTTABLE', '#E8463C', 56) },
  // growth chart
  { t: W6, ref: RH, cam: push(W6, 30.6, { x: 120, y: GY - 340, z: 1.45, r: 0 }, { x: 120, y: GY - 330, z: 1.6, r: 0 }, 'lin'), draw: (t, c, L) => growth(t, L, 'lookL') + chipAt(t, ST[5] + .6, 1500, 330, '+1.25 cm / MONTH', '#3D8BFF', 52) },
  { t: 30.6, ref: RH, cam: push(30.6, W7, { x: 140, y: GY - 260, z: 2.2, r: -2 }, { x: 140, y: GY - 250, z: 2.5, r: -3 }, 'lin'), draw: (t, c, L) => growth(t, L, 'worried') + chipAt(t, 30.7, 1450, 300, '≈ 15 cm / YEAR', '#E8463C', 60) },
  // 5 years later
  { t: W7, ref: RH, cam: push(W7, 37.6, { x: 0, y: GY - 320, z: 1.45, r: 0 }, { x: 0, y: GY - 300, z: 1.65, r: 0 }, 'o'), draw: (t, c, L) =>
      pinkRoom(t, L) + L(1, hairLong(0, GY, DS, hairAt(t), t) + dex([[0, { ...POSES.dizzy, eyes:'dot', mouth:'flat' }], [36.2, { ...POSES.shrug, eyes:'dot' }, 'o']], t, 0, GY)) +
        title(t, ST[6] + .1, 960, 140, '5 YEARS LATER…', '#E8463C', 100) + chipAt(t, ST[6] + 1.6, 1450, 380, 'HAIR ≈ 75 cm', '#B07CFF', 56) },
  { t: 37.6, ref: RH, cam: push(37.6, 39.0, { x: 80, y: GY - 260, z: 1.7, r: 2 }, { x: 80, y: GY - 260, z: 1.85, r: 2 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, 37.8, 38.3);
      return pinkRoom(t, L, 'b4') + L(1, hairLong(0, GY, DS, hairAt(t), t) + dex([[0, { ...POSES.point, armF:[90,0], armLen:1.15, handF:null, eyes:'open', mouth:'o' }]], t, 0, GY) +
        `<g opacity="${k}"><path d="M48,${GY - 160} L${48 + 210*k},${GY - 160}" stroke="#3D8BFF" stroke-width="8"/><path d="M48,${GY - 175} l0,30 M${48 + 210*k},${GY - 175} l0,30" stroke="#3D8BFF" stroke-width="8"/><path d="M110,${GY - 210} L110,${GY - 10}" stroke="#B07CFF" stroke-width="8"/><path d="M95,${GY - 210} l30,0 M95,${GY - 10} l30,0" stroke="#B07CFF" stroke-width="8"/></g>`) +
        chipAt(t, 38.1, 1450, 300, 'ARM ≈ 55 cm (EST.)', '#3D8BFF', 48) + chipAt(t, 38.5, 1450, 400, 'HAIR ≈ 75 cm', '#B07CFF', 48); } },
  { t: 39.0, ref: RH, cam: push(39.0, 41.4, { x: 0, y: 500, z: 1.0, r: -3 }, { x: 0, y: 480, z: 1.12, r: -4 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#FFD7E2', '#F7B8C8', '#FFC4D2')) + L(1, hand2Big(0, 700, 1.5, 20 + 230*E.io(seg(t, 39.1, 41.2)), t)) + chipAt(t, 39.1, 960, 130, 'NAILS +4 cm / YEAR', '#FF8A3D', 60) },
  { t: 41.4, ref: RH, cam: push(41.4, ST[7] - .2, { x: 0, y: GY - 310, z: 1.75, r: 0 }, { x: 0, y: GY - 310, z: 1.5, r: 0 }, 'io'), draw: (t, c, L) =>
      pinkRoom(t, L) + L(1, hairLong(0, GY, DS, hairAt(t), t) + dex([[0, { ...POSES.worried, eyes:'dot', mouth:'wobble' }]], t, 0, GY)) + title(t, 41.5, 1440, 330, 'FOREVER.', '#E8463C', 120, -6) },
  { t: ST[7] - .2, ref: RH, cam: push(ST[7] - .2, END, { x: 300, y: GY - 330, z: 1.3, r: 0 }, { x: 300, y: GY - 330, z: 1.42, r: 0 }, 'lin'), draw: (t, c, L) =>
      pinkRoom(t, L) + L(1, hairLong(-160, GY, DS, hairAt(t), t) + dex([[0, 'idle'], [ST[7] + .2, 'peace', 'o']], t, -160, GY)) + note(t, ST[7], 1340, 440, 'RULE 1', 'NO HAIRCUTS.', 'EVER.') },
];
function growth(t, L, mood) {
  const months = Math.min(12, Math.floor(seg(t, ST[5] + .4, ST[5] + DU[5])*12) + 1);
  let w = `<g transform="translate(330,${GY})"><rect x="-40" y="-760" width="80" height="760" rx="12" fill="#FFE07A" stroke="${INK}" stroke-width="7"/>${Array.from({ length: 16 }, (_, i) => `<line x1="-40" y1="${-i*50}" x2="${i%2 ? -10 : 5}" y2="${-i*50}" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;
  w += `<g transform="translate(-520,520)"><rect x="-130" y="-120" width="260" height="250" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-130" y="-120" width="260" height="60" rx="16" fill="#E8463C" stroke="${INK}" stroke-width="7"/><text y="-75" text-anchor="middle" font-family="Lilita One" font-size="40" fill="#fff">MONTH</text><text y="80" text-anchor="middle" font-family="Lilita One" font-size="130" fill="${INK}">${months}</text></g>`;
  const pg = (t*12/6.2) % 1; w += `<g transform="translate(-520,520)"><path d="M-130,-60 L130,-60 L130,${-60 + 190*(1 - pg)} L-130,${-60 + 190*(1 - pg)} Z" fill="#fff" stroke="${INK}" stroke-width="5" opacity="${.6*(1 - pg)}"/></g>`;
  const K = mood === 'worried' ? [[0, { ...POSES.worried, look:[-8,8] }]] : [[0, { ...POSES.idle, look:[-6,6] }], [ST[5] + 2, { ...POSES.lookCam, look:[-8,8], tilt:-6 }, 'o']];
  return L(0, studioBack(t, '#FFF6E0', '#FFE7B8', '#FFEBC4')) + L(1, `<rect x="-6000" y="${GY - 20}" width="12000" height="900" fill="#F2D9A8"/>` + w + hairLong(0, GY, DS, hairAt(t), t) + dex(K, t, 0, GY));
}
function pinkRoom(t, L, blur='') { return L(1, roomW(t, { wall: '#FFD7E2', stripe: '#FFC4D2', floor: '#F2C9D4' }) + windowW(-900, 260, 340, 280, t) + shelfW(700, 460), blur); }
function scene(t) {
  let s = STONE_DEF + playShots(t, SHOTS_H, [[ST[2] + .3, 14, .4], [ST[4] + 1.0, 18, .4], [ST[6] + .1, 8, .3]]) + vignette();
  [W5, W6, W7].forEach(w => s += wipe(t, w));
  return s;
}
