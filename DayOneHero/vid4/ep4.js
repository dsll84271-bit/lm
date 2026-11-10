// ============================================================================
// Day One Hero Ep4 (invisibility): chibi4 = Rig 2.0 with invisible / hollow-hoodie / back-view modes,
// floating eyeballs, visible food. Generated from rig2.js chibi2 + flags:
//   o.inv     only the eyeballs (and o.food) are drawn
//   o.hollow  the spare hoodie is visible, nobody inside: torso, sleeves, hood, dark void, eyeballs
//   o.back    seen from behind (the red hood): the hood covers the head
// ============================================================================
function chibi4(o) {
  const s = o.s || 1, x = o.x, y = o.y, t = o.t || 0;
  const top = o.top || '#FFC21F', pants = o.pants || '#1F2033', STR = '#FFF1D6';
  const L = o.legL || [4,0], R = o.legR || [-4,0];
  const legs = [[-15,L],[15,R]].map(([hx,lg]) => [hx, limb(hx, -72, lg[0], 38, lg[1], 34, 22, pants)]);
  const footY = Math.max(...legs.map(([,l]) => l.end[1]));
  const sqv = o.sq || 1;
  const bob = (o.bob || 0) + (o.air ? 0 : -footY);
  const br = o.breath ?? Math.sin(t*2*Math.PI/3.4);
  const st = o.stretch || 1, sd = o.sdir || 0, rot = o.rot || 0;
  let g = `<g transform="translate(${x},${y}) scale(${o.flip?-s:s},${s})">`;
  if (!o.air && !o.noShadow && !o.inv && !o.hollow) g += `<ellipse cx="0" cy="6" rx="${66/Math.sqrt(sqv)}" ry="12" fill="#0B0E2A" opacity=".22"/>`;
  g += `<g transform="rotate(${rot},0,-150) translate(0,-150) rotate(${sd}) scale(${st},${1/st}) rotate(${-sd}) translate(0,150)">`;
  g += `<g transform="scale(${1/Math.sqrt(sqv)},${sqv})"><g transform="translate(0,${bob}) rotate(${o.lean||0},0,-60)">`;
  // legs + trainers (white with blue stripe)
  if (!o.inv && !o.hollow) for (const [hx,l] of legs) {
    g += l.svg;
    if (o.stripe) g += `<path d="M${hx+6},-66 L${l.end[0]+6},${l.end[1]-6}" stroke="#fff" stroke-width="4" opacity=".9"/>`;
    const ex = l.end[0], ey = l.end[1];
    g += `<path d="M${ex-17},${ey+7} Q${ex-17},${ey-13} ${ex+2},${ey-13} Q${ex+23},${ey-11} ${ex+25},${ey+7} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${ex-14},${ey+2} L${ex+22},${ey+2}" stroke="#3D8BFF" stroke-width="5"/><path d="M${ex-6},${ey-9} Q${ex+4},${ey-4} ${ex+12},${ey-10}" stroke="#3D8BFF" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  // back arm
  const aB = o.armB || [20,-10];
  const la = limb(-42, -150, aB[0], 40, aB[1], 36, 22, top); if (!o.inv) g += la.svg + (o.hollow ? '' : hand2(la.end[0], la.end[1], la.ang, o.handB));
  const g0 = g.length; // torso (breathes)
  g += `<g transform="translate(0,-64) scale(${1+br*.008},${1+br*.018}) translate(0,64)">`;
  g += `<path d="M-48,-168 Q0,-180 48,-168 Q58,-110 54,-64 Q0,-54 -54,-64 Q-58,-110 -48,-168 Z" fill="${top}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  g += `<path d="M32,-164 Q38,-110 32,-61 Q44,-62 52,-66 Q56,-110 48,-162 Z" fill="#B8650A" opacity=".22"/><path d="M-40,-160 Q-46,-120 -42,-90" stroke="#FFE9A0" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>`;
  if (o.type === 'jacket') g += `<path d="M0,-172 L0,-62" stroke="${INK}" stroke-width="4" opacity=".6"/><path d="M-26,-172 L0,-140 L26,-172" fill="${o.shirt||'#BFE6FF'}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  else g += `<path d="M-30,-98 L30,-98 L36,-66 L-36,-66 Z" fill="#000" opacity=".07"/><path d="M-30,-98 L30,-98 L36,-66 L-36,-66 Z" fill="none" stroke="${INK}" stroke-width="3.5" opacity=".55"/>`;
  g += `<path d="M-48,-70 Q0,-60 52,-70" stroke="#000" stroke-width="5" opacity=".12" fill="none"/>`;
  if (o.type !== 'jacket' && o.type !== 'plain') for (const sx of [-1,1]) { const sw = o.sway || 0, w = o.wind || 0;
    const d = `M${12*sx},-162 Q${14*sx+sw*9-w*8},${-140+Math.abs(w)*6} ${12*sx-w*30+sw*20},${-116-Math.abs(sw)*8-Math.abs(w)*14}`;
    g += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="9.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${STR}" stroke-width="5" stroke-linecap="round"/>`;
    const [ax,ay] = [12*sx-w*30+sw*20, -116-Math.abs(sw)*8-Math.abs(w)*14]; g += `<rect x="${ax-4}" y="${ay-2}" width="8" height="10" rx="3" fill="#C9C2DA" stroke="${INK}" stroke-width="3"/>`; }
  g += `</g>`;
  if (o.inv) g = g.slice(0, g0);
  // head (rides the breath a little)
  g += `<g transform="translate(0,${-238-br*2.2}) rotate(${o.tilt||0})">`; const h0 = g.length;
  const ht = o.hoodTip || 0, w = o.wind || 0;
  // round hood (as in the thumbnail) with follow-through: it lags, swings and squashes with motion, no point
  const hb = clamp(ht/14, -1.6, 1.6);
  if (o.hood !== false) {
  g += `<g transform="rotate(${hb*3.2 - w*4},0,30) translate(${-w*7 - hb*2},${Math.abs(hb)*1.5}) scale(${1 + Math.abs(hb)*.018},${1 - Math.abs(hb)*.025})">`;
  g += `<path d="M-96,10 C-104,-80 -50,-122 0,-122 C${50-w*30},-122 ${104-w*40},-80 ${96-w*30},10 C90,70 50,92 0,92 C-50,92 -90,70 -96,10 Z" fill="${o.top && o.top !== '#FFC21F' ? o.top : 'url(#hoodG)'}" stroke="${INK}" stroke-width="6"/>`;
  g += `<path d="M-70,-82 Q-30,-112 20,-108" fill="none" stroke="#FFF1B0" stroke-width="9" stroke-linecap="round" opacity=".85"/><path d="M84,-30 Q96,20 70,64" fill="none" stroke="#C97A06" stroke-width="10" stroke-linecap="round" opacity=".35"/></g>`;
  } else g += hairBack(o.hair, o.hairCol || '#5A3A2A');
  const mSkin = g.length; g += `<ellipse cx="0" cy="0" rx="80" ry="78" fill="url(#skin)" stroke="${INK}" stroke-width="5.5"/>`;
  g += `<path d="M48,-62 A80,78 0 0 1 48,62 Q74,0 48,-62 Z" fill="#E08F76" opacity=".2"/>`;
  g += o.hood === false ? hairFront(o.hair, o.hairCol || '#5A3A2A') : hairFront('dex');
  const mRim = g.length; if (o.hood !== false) g += `<path d="M-82,8 C-86,-70 -40,-104 0,-104 C40,-104 86,-70 82,8" fill="none" stroke="${top}" stroke-width="13"/><path d="M-82,8 C-86,-70 -40,-104 0,-104 C40,-104 86,-70 82,8" fill="none" stroke="${INK}" stroke-width="3" transform="translate(0,-7) scale(1.08)"/>`;
  const mFace = g.length; g += face2(o, t);
  if (o.acc === 'glasses') g += `<circle cx="-30" cy="6" r="25" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="6" r="25" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="5"/><path d="M-5,4 L5,4" stroke="${INK}" stroke-width="5"/>`;
  if (o.acc === 'shades') g += `<path d="M-58,-14 L-6,-14 Q-4,26 -32,28 Q-58,26 -58,-14 Z M6,-14 L58,-14 Q58,26 32,28 Q4,26 6,-14 Z" fill="#14162A" stroke="${INK}" stroke-width="5"/><path d="M-6,-10 L6,-10 M-58,-12 L-78,-20 M58,-12 L78,-20" stroke="${INK}" stroke-width="5"/><path d="M-48,-6 L-36,-6 M16,-6 L28,-6" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  if (o.sweat) { const sy = (t*60 % 40); g += `<path d="M74,${-44+sy*.3} C82,${-28+sy*.3} 84,${-16+sy*.3} 76,${-10+sy*.3} C66,${-4+sy*.3} 58,${-14+sy*.3} 64,${-28+sy*.3} Z" fill="#BFE6FF" stroke="${INK}" stroke-width="4"/>`; }
  g += `</g>`;
  if (o.inv) g = g.slice(0, h0) + eyeballs(o, t) + `</g>`;
  else if (o.hollow) g = g.slice(0, mSkin) + `<ellipse cx="0" cy="4" rx="78" ry="76" fill="url(#voidG)"/>` + g.slice(mRim, mFace) + (o.noEyes ? '' : eyeballs(o, t)) + `</g>`;
  else if (o.back) g = g.slice(0, mSkin) + backHead(o) + `</g>`;
  if (o.food) g += foodSvg(o.food, t, br);
  // front arm
  const aF = o.armF || [-20,10], AL = o.armLen || 1;
  const ra = limb(42, -150, aF[0], 40*AL, aF[1], 36*AL, 22, top); if (!o.inv) g += ra.svg + (o.hollow ? '' : hand2(ra.end[0], ra.end[1], ra.ang, o.handF));
  g += `</g></g></g></g>`;
  return g;
}


// ---------------------------------------------------------------- defs
const EP4DEFS = `<defs>
<radialGradient id="voidG" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#2B2F55"/><stop offset="1" stop-color="#090A1C"/></radialGradient>
<radialGradient id="ballG" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F2F4FA"/><stop offset="1" stop-color="#C9CEE2"/></radialGradient>
<radialGradient id="irisG" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#7FC1FF"/><stop offset=".55" stop-color="#3D7BE8"/><stop offset="1" stop-color="#1B2F8F"/></radialGradient>
<linearGradient id="streetEve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2A6E"/><stop offset=".6" stop-color="#7A4E9A"/><stop offset="1" stop-color="#F0907A"/></linearGradient>
<linearGradient id="rainSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6F7FA6"/><stop offset="1" stop-color="#B9C3DA"/></linearGradient>
<linearGradient id="bendG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#BFE6FF"/><stop offset="1" stop-color="#3D2A8F"/></linearGradient>
<filter id="toWhite" x="-50%" y="-50%" width="200%" height="200%"><feFlood flood-color="#fff"/><feComposite in2="SourceAlpha" operator="in"/></filter>
<filter id="edgeW" x="-50%" y="-50%" width="200%" height="200%"><feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/><feComposite in="d" in2="SourceAlpha" operator="out" result="e"/><feFlood flood-color="#E9FBFF"/><feComposite in2="e" operator="in"/></filter>
</defs>`;
// a wobble (heat-haze / glass) filter, re-seeded every few frames so it shimmers
function wobbleDef(t, id='wob', sc=22, f=.011) { return `<defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${f} ${f*1.6}" numOctaves="2" seed="${Math.floor(t*8) % 50}"/><feDisplacementMap in="SourceGraphic" scale="${sc}" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`; }
// thermal false colour: blurred silhouettes -> inferno palette. region = the screen rectangle (user space)
function thermalDef(id, x, y, w, h, blur=9) { return `<defs><filter id="${id}" filterUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}" color-interpolation-filters="sRGB">
 <feFlood flood-color="#000" result="bk"/><feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="bl"/><feComposite in="bl" in2="bk" operator="over" result="m"/>
 <feColorMatrix in="m" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"/>
 <feComponentTransfer><feFuncR type="table" tableValues="0.08 0.30 0.72 0.98 1 1"/><feFuncG type="table" tableValues="0.03 0.04 0.12 0.45 0.80 1"/><feFuncB type="table" tableValues="0.22 0.46 0.40 0.10 0.16 0.85"/></feComponentTransfer></filter></defs>`; }

// ---------------------------------------------------------------- eyeballs, food, back of the hood
function eyeballs(o, t) {
  const lx = o.look ? o.look[0] : 0, ly = o.look ? o.look[1] : 0, e = o.eyes || 'open', lid = Math.max(o.squint || 0, o.blink || 0);
  const big = e === 'wide' || e === 'shock' ? 1.2 : 1;
  let sy = 1 - lid*.9; if (e === 'happy' || e === 'squeeze' || e === 'closed') sy = Math.min(sy, .32); if (e === 'determined') sy = Math.min(sy, .72);
  let s = '';
  for (const sx of [-1, 1]) {
    const r = 25*big, j = e === 'shock' ? Math.sin(t*70)*1.6 : 0, ix = clamp(lx*.95, -r*.45, r*.45), iy = clamp(ly*.95, -r*.45, r*.45);
    s += `<g transform="translate(${31*sx + j},6) scale(1,${Math.max(.08, sy)}) rotate(${e === 'determined' ? -sx*10 : 0})">`;
    s += `<circle r="${r}" fill="url(#ballG)" stroke="${INK}" stroke-width="4.5"/><path d="M${-r*.7},${r*.45} Q0,${r*1.02} ${r*.7},${r*.45}" stroke="#9AA2C8" stroke-width="3" fill="none" opacity=".6"/>`;
    s += `<path d="M${-r*.82},${-r*.2} q6,4 10,1 M${r*.78},${r*.05} q-7,3 -11,-1" stroke="#E87A8A" stroke-width="2" fill="none" opacity=".55"/>`;
    if (e === 'swirl') { let d = ''; for (let i = 0; i <= 36; i++) { const a = i/36*4.5*Math.PI + t*9*sx, rr = 2 + i*.4; d += (i ? 'L' : 'M') + (Math.cos(a)*rr).toFixed(1) + ',' + (Math.sin(a)*rr).toFixed(1); } s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`; }
    else { const ir = r*(e === 'shock' ? .34 : .52); s += `<circle cx="${ix}" cy="${iy}" r="${ir}" fill="url(#irisG)" stroke="${INK}" stroke-width="3"/><circle cx="${ix}" cy="${iy}" r="${ir*(e === 'shock' ? .55 : .46)}" fill="#0E1130"/><circle cx="${ix - ir*.38}" cy="${iy - ir*.42}" r="${ir*.28}" fill="#fff"/><circle cx="${ix + ir*.35}" cy="${iy + ir*.3}" r="${ir*.12}" fill="#fff" opacity=".8"/>`; }
    s += `</g>`;
  }
  return s;
}
// visible cereal inside an invisible body. f = {mouth: 0..1 chewed blob at the mouth, throat: 0..1 bolus on its way down (or <0), stomach: 0..1}
function foodSvg(f, t, br) {
  let s = ''; const my = -238 - br*2.2 + 46;
  if (f.mouth > 0) { const k = f.mouth, ch = Math.sin(t*15);
    s += `<g transform="translate(0,${my})"><ellipse rx="${17*k*(1 + .18*ch)}" ry="${11*k*(1 - .18*ch)}" fill="#E8C98A" stroke="${INK}" stroke-width="3"/>${[[-7,-2],[5,3],[2,-5],[-2,4]].map(([a, b], i) => `<circle cx="${a*k*(1 + .2*Math.sin(t*15 + i))}" cy="${b*k}" r="${3.2*k}" fill="#C8862F"/>`).join('')}</g>`; }
  if (f.throat >= 0 && f.throat <= 1) { const y = lerp(my + 8, -122, E.in(f.throat)), x = lerp(0, 5, f.throat), sq = 1 + .35*Math.sin(f.throat*Math.PI);
    s += `<path d="M0,${my + 6} L5,-124" stroke="#E8C98A" stroke-width="5" opacity="${.35*Math.sin(f.throat*Math.PI)}" stroke-linecap="round"/><ellipse cx="${x}" cy="${y}" rx="${9/sq}" ry="${13*sq}" fill="#E3C07F" stroke="${INK}" stroke-width="3"/>`; }
  if (f.stomach > 0) { const k = f.stomach, sl = Math.sin(t*3.2)*3*(f.slosh ?? 1);
    s += `<g transform="translate(${8 + sl*.5},-110) scale(${k})"><path d="M-30,-14 Q-34,-40 -8,-40 Q14,-40 22,-24 Q38,-4 26,16 Q10,34 -14,28 Q-36,20 -30,-14 Z" fill="${f.juice ? '#FFA62E' : '#EAD6A6'}" stroke="${INK}" stroke-width="3.5"/><path d="M-26,-6 Q${-4 + sl},${-14 - sl*.5} 24,-10" stroke="#FFF6DD" stroke-width="5" fill="none" opacity=".8" stroke-linecap="round"/>${f.juice ? '' : [[-14,6],[0,14],[12,2],[-4,-4],[14,18],[-18,16]].map(([a, b], i) => `<circle cx="${a + Math.sin(t*2 + i)*1.5}" cy="${b + sl*.4}" r="4" fill="#C8862F" stroke="${INK}" stroke-width="1.5"/>`).join('')}</g>`; }
  return s;
}
function backHead(o) {
  const top = o.top || '#E8463C';
  return `<path d="M-97,10 C-105,-82 -50,-124 0,-124 C50,-124 105,-82 97,10 C91,72 50,94 0,94 C-50,94 -91,72 -97,10 Z" fill="${top}" stroke="${INK}" stroke-width="6"/><path d="M0,-122 Q8,-30 2,92" stroke="#000" stroke-width="5" opacity=".22" fill="none"/><path d="M-66,-84 Q-28,-112 18,-108" stroke="#fff" stroke-width="9" opacity=".25" fill="none" stroke-linecap="round"/><path d="M60,-60 Q92,0 64,60" stroke="#000" stroke-width="10" opacity=".15" fill="none" stroke-linecap="round"/>`;
}
// Dex, invisible: pose keys like dex(); extra.food etc.
const dexI = (keys, t, x, y, extra={}) => chibi4(dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 4, inv: true, ...extra }));
const dexIP = (keys, t, pos, extra={}) => chibi4(dexAt(keys, t, pos, { s: DS, seed: 4, inv: true, ...extra }));
const dexH = (keys, t, x, y, extra={}) => chibi4(dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 4, hollow: true, ...extra }));
function redHoodBack(t, x, y, s, keys=[[0, { armF: [-10, 10], armB: [10, -10] }]], extra={}) {
  return chibi4({ ...dexAt(keys, t, () => ({ x, y }), { s, seed: 90 }), type: 'hoodie', top: '#E8463C', hood: true, pants: '#1F2033', stripe: false, back: true, eyes: 'open', mouth: 'flat', ...extra });
}
// a silhouette of any rig drawing as a mask (white where the body is)
function silMask(id, svg) { return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-8000" y="-8000" width="16000" height="16000"><g filter="url(#toWhite)">${svg}</g></mask>`; }
// the imagined "see-through" Dex: the background behind him, magnified + wobbled inside his outline, with a glassy rim
function glassDex(t, o, bg, id='gm') {
  const sil = chibi2({ ...o, noShadow: true }), cx = o.x, cy = o.y - 170*(o.s || 1);
  return wobbleDef(t, 'gwob', 26, .014) + silMask(id, sil) + `<g mask="url(#${id})"><g filter="url(#gwob)"><g transform="translate(${cx},${cy}) scale(1.12,1.06) translate(${-cx},${-cy})">${bg}</g></g><rect x="${cx - 400}" y="${cy - 500}" width="800" height="1000" fill="#CFF3FF" opacity=".22"/><ellipse cx="${cx - 40}" cy="${cy - 140}" rx="40" ry="110" fill="#fff" opacity=".22"/></g><g filter="url(#edgeW)" opacity=".9">${sil}</g>`;
}
// rain clinging to an invisible body: drops inside his outline + a wet rim
function rainDex(t, o, id='rm', k=1) {
  const sil = chibi2({ ...o, noShadow: true }), x = o.x, y = o.y, s = o.s || 1; let d = '';
  for (let i = 0; i < 160; i++) { const px = x + (hash(i*1.7) - .5)*260*s, py = y - hash(i*3.9)*420*s, sz = 3 + 5*hash(i*2.3); if (hash(i*7.1) > k) continue;
    d += `<ellipse cx="${px}" cy="${py + ((t*40 + i*13) % 30)*hash(i)}" rx="${sz*.7}" ry="${sz}" fill="#DDF6FF" stroke="#5A7FB8" stroke-width="1.5"/>`; }
  return silMask(id, sil) + `<g mask="url(#${id})"><rect x="${x - 300}" y="${y - 520}" width="600" height="560" fill="#9FD0F0" opacity="${.22*k}"/>${d}</g><g filter="url(#edgeW)" opacity="${.85*k}">${sil}</g>`;
}
function rainFall(t, n=120, op=.6, ang=12) { const f = t*1.8; let s = `<g opacity="${op}">`;
  for (let i = 0; i < n; i++) { const x = (hash(i*3.1)*2300 + f*120*ang/10 + i*7) % 2300 - 200, y = ((hash(i*5.7)*1300 + f*1400*(.8 + .4*hash(i))) % 1300) - 120;
    s += `<path d="M${x},${y} l${-ang*.5},44" stroke="#E4F2FF" stroke-width="${2 + 2*hash(i*9)}" stroke-linecap="round"/>`; }
  return s + '</g>'; }
function puddle(x, y, w, t, t0=-9) { const k = t > t0 ? ((t - t0) % 1.2)/1.2 : 1; return `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w*.18}" fill="#7C8BB0" opacity=".75"/><ellipse cx="${x - w*.2}" cy="${y - 3}" rx="${w*.5}" ry="${w*.06}" fill="#fff" opacity=".35"/>${t > t0 ? `<ellipse cx="${x}" cy="${y}" rx="${w*(.2 + .8*k)}" ry="${w*.18*(.2 + .8*k)}" fill="none" stroke="#fff" stroke-width="3" opacity="${1 - k}"/>` : ''}`; }
function wetPrint(x, y, a=1, flip=false) { return `<g transform="translate(${x},${y}) scale(${flip ? -1 : 1},1)" opacity="${a}"><ellipse rx="22" ry="8" fill="#6F7FA6"/><ellipse cx="18" cy="-1" rx="7" ry="5" fill="#6F7FA6"/></g>`; }

// ---------------------------------------------------------------- characters
const THIEF = { type: 'plain', top: '#4A4F6A', hood: false, hair: 'beanie', hairCol: '#2B2F4A', pants: '#2B2F4A', stripe: false };
const POLICE = { type: 'jacket', top: '#1F2A55', shirt: '#FFFFFF', hood: false, hair: 'helmet', pants: '#1B1D33', stripe: false };
const WOMAN = { type: 'jacket', top: '#B07CFF', shirt: '#FFF1D6', hood: false, hair: 'long', hairCol: '#8A4A2A', pants: '#2B2F4A', stripe: false };
const MUM = PEOPLE[3];
const who = (P, keys, t, x, y, extra={}, seed=20) => chibi2({ ...dexAt(keys, t, () => ({ x, y }), { s: DS, seed, ...extra }), ...P, ...extra });
function handbag(x, y, s=1, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-34,-40 Q-34,-74 0,-74 Q34,-74 34,-40" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-50,-44 L50,-44 L44,20 L-44,20 Z" fill="#E8463C" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-10" y="-30" width="20" height="14" rx="4" fill="#FFD23F" stroke="${INK}" stroke-width="3"/></g>`; }
function toothbrush(x, y, s=1, rot=0, foam=0, t=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-6" y="-120" width="12" height="130" rx="6" fill="#3D8BFF" stroke="${INK}" stroke-width="4"/><rect x="-9" y="-140" width="18" height="30" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>${foam > 0 ? [0,1,2,3,4].map(i => `<circle cx="${-14 + i*7}" cy="${-148 - (i%2)*6 + Math.sin(t*20 + i)*2}" r="${6*foam}" fill="#fff" stroke="#BFE6FF" stroke-width="2"/>`).join('') : ''}</g>`; }
function stickyNote(x, y, s, l1, l2, col='#FFF07A', rot=-4, l1col='#E8463C') { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-150,-130 L150,-130 L150,110 Q60,124 -150,130 Z" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M150,110 Q120,90 110,128" fill="#000" opacity=".12"/>${txt(l1, 0, -20, 74, l1col)}${l2 ? txt(l2, 0, 62, 58, '#fff') : ''}</g>`; }

// ---------------------------------------------------------------- sets
// bedroom mirror POV: the mirror's frame is the screen edge; we see the room behind Dex (flipped)
function mirrorPOV(t, inner, tint='#BFE6FF') {
  return `<rect width="1920" height="1080" fill="#B07A4A"/><rect x="70" y="50" width="1780" height="980" rx="30" fill="#14162A" stroke="${INK}" stroke-width="10"/><clipPath id="mpov"><rect x="90" y="70" width="1740" height="940" rx="22"/></clipPath><g clip-path="url(#mpov)">${inner}<rect width="1920" height="1080" fill="${tint}" opacity=".10"/><path d="M200,900 L620,90 M330,980 L760,140" stroke="#fff" stroke-width="40" opacity=".08"/></g><rect x="70" y="50" width="1780" height="980" rx="30" fill="none" stroke="#8A5A3B" stroke-width="26"/><rect x="58" y="38" width="1804" height="1004" rx="36" fill="none" stroke="${INK}" stroke-width="7"/>`;
}
function museumW(t, L, blur='', o={}) {
  let s = `<rect x="-6000" y="-3000" width="12000" height="${3000 + GY - 140}" fill="#E8E2F6"/>`;
  for (let x = -4000; x < 4000; x += 600) s += `<rect x="${x}" y="-3000" width="40" height="${3000 + GY - 140}" fill="#D9D1EE"/>`;
  s += `<rect x="-6000" y="${GY - 140}" width="12000" height="900" fill="#C9B79A" stroke="${INK}" stroke-width="6"/>` + [...Array(30)].map((_, i) => `<path d="M${-4000 + i*300},${GY - 140} L${-4000 + i*300 - 120},${GY + 800}" stroke="#B5A283" stroke-width="5"/>`).join('');
  s += `<g transform="translate(0,${GY - 880})"><rect x="-430" y="-60" width="860" height="110" rx="20" fill="#1F2033" stroke="${INK}" stroke-width="7"/>${txt('SEE YOUR HEAT', 0, 22, 66, '#FF8A3D')}</g>`;
  s += `<g transform="translate(-1300,${GY - 140})"><rect x="-140" y="-560" width="280" height="560" rx="20" fill="#7FD3FF" fill-opacity=".25" stroke="${INK}" stroke-width="7"/><path d="M-100,-80 L-100,-400 Q0,-500 100,-400 L100,-80 Z" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-300" r="50" fill="#E8C98A" stroke="${INK}" stroke-width="5"/>${txt('FOSSIL', 0, -30, 40, '#fff')}</g>`;
  return L(1, s, blur);
}
// the thermal exhibit screen in world coords; people: [{svg (a rig drawing positioned in screen space), heat 0..1}]
function thermalScreen(t, x, y, w, h, bodies, id='thm') {
  const def = thermalDef(id, x, y, w, h, 10);
  let inner = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>`;
  inner += `<rect x="${x}" y="${y + h*.78}" width="${w}" height="${h*.22}" fill="#333"/>`;   // floor: room temperature
  for (const b of bodies) inner += `<g opacity="${b.heat}" filter="url(#toWhite)">${b.svg}</g>`;
  return def + `<rect x="${x - 26}" y="${y - 26}" width="${w + 52}" height="${h + 52}" rx="20" fill="#1F2033" stroke="${INK}" stroke-width="8"/><g filter="url(#${id})">${inner}</g><g transform="translate(${x + w - 130},${y + 40})"><rect x="-90" y="-22" width="180" height="44" rx="10" fill="#000" opacity=".5"/>${txt('THERMAL', 0, 14, 32, '#FFD23F')}</g><circle cx="${x + 30}" cy="${y + 30}" r="10" fill="#E8463C" opacity="${.5 + .5*Math.sin(t*6)}"/>`;
}
function parkW(t, L, blur='') {
  let mid = hills(t, 760, false) + bush(-900, GY - 40, 1.2) + bush(800, GY - 40, 1) + tree(-1500, GY - 40, 1.5) + tree(1400, GY - 40, 1.3);
  mid += `<path d="M-3000,${GY - 10} Q0,${GY - 60} 3000,${GY - 10} L3000,${GY + 60} Q0,${GY + 10} -3000,${GY + 60} Z" fill="#E6D3A8" opacity=".9"/>`;
  let near = grassGround(GY - 40); for (let i = 0; i < 12; i++) near += flower(-1600 + i*290 + (i*53 % 90), GY + 90 + (i%3)*60, t, ['#FF7EB6','#FFD23F','#B07CFF','#FF8A3D'][i%4]);
  return L(0, skyW(t, 1100, 120)) + L(.5, mid, blur && 'b4') + L(1, near, blur && 'b2');
}
function highStreet(t, L, blur='', o={}) {
  const dusk = o.dusk ?? 1;
  let sky = `<rect x="-6000" y="-3000" width="12000" height="5200" fill="url(#streetEve)"/>` + `<circle cx="1100" cy="250" r="60" fill="#FFF6D0" opacity="${dusk}"/>`;
  let row = '';
  const shops = [['BAKERY', '#E8A23C'], ['BOOKS', '#3D8BFF'], ['CAFE', '#7ED957'], ['PHONES', '#B07CFF'], ['FISH & CHIPS', '#E8463C'], ['FLOWERS', '#FF7EB6']];
  for (let i = -4; i < 5; i++) { const x = i*520, sh = shops[(i + 8) % 6];
    row += `<rect x="${x - 260}" y="${GY - 820}" width="520" height="700" fill="${['#C9654F','#B95A47','#D27A5E','#A8603F'][(i + 8) % 4]}" stroke="${INK}" stroke-width="6"/>`;
    row += `<rect x="${x - 220}" y="${GY - 760}" width="150" height="170" fill="#FFE2A8" stroke="${INK}" stroke-width="5"/><rect x="${x + 70}" y="${GY - 760}" width="150" height="170" fill="${i % 2 ? '#FFE2A8' : '#3D4680'}" stroke="${INK}" stroke-width="5"/>`;
    row += `<rect x="${x - 250}" y="${GY - 520}" width="500" height="90" rx="10" fill="${sh[1]}" stroke="${INK}" stroke-width="6"/>${txt(sh[0], x, GY - 460, sh[0].length > 8 ? 44 : 56, '#fff')}`;
    row += `<rect x="${x - 230}" y="${GY - 420}" width="300" height="280" fill="#FFE9B8" stroke="${INK}" stroke-width="6"/><rect x="${x + 100}" y="${GY - 420}" width="120" height="280" fill="#5A3B2A" stroke="${INK}" stroke-width="6"/>`; }
  let near = `<rect x="-6000" y="${GY - 140}" width="12000" height="900" fill="#9AA0B8" stroke="${INK}" stroke-width="6"/>` + [...Array(40)].map((_, i) => `<path d="M${-6000 + i*300},${GY - 140} L${-6000 + i*300},${GY + 800}" stroke="#878CA6" stroke-width="4"/>`).join('');
  for (const lx of [-1300, 0, 1300]) near += `<g transform="translate(${lx + 300},${GY - 120})"><rect x="-10" y="-640" width="20" height="640" fill="#2B2F4A"/><path d="M0,-640 Q0,-680 -60,-680" stroke="#2B2F4A" stroke-width="16" fill="none"/><ellipse cx="-70" cy="-670" rx="34" ry="14" fill="#FFE9A8" stroke="${INK}" stroke-width="4"/><circle cx="-70" cy="-660" r="200" fill="url(#lampG)" opacity="${.8*dusk}"/></g>`;
  return L(0, sky) + L(1, row, blur) + L(1, near, blur);
}
function alleyW(t, L, blur='') {
  let s = `<rect x="-6000" y="-3000" width="12000" height="6000" fill="#1C1F3E"/><rect x="-700" y="-1500" width="1400" height="${1500 + GY - 140}" fill="#2B2F55"/>`;
  for (let i = 0; i < 40; i++) s += `<rect x="${-2200 + (i % 8)*560 + (Math.floor(i/8) % 2)*280}" y="${GY - 1100 + Math.floor(i/8)*200}" width="520" height="180" fill="#3A3F6B" stroke="#24284A" stroke-width="5"/>`;
  s += `<rect x="-2400" y="-1500" width="1700" height="${1500 + GY}" fill="#262A4D" stroke="${INK}" stroke-width="6"/><rect x="700" y="-1500" width="1700" height="${1500 + GY}" fill="#262A4D" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="900" y="${GY - 420}" width="300" height="280" rx="10" fill="#4E7A54" stroke="${INK}" stroke-width="6"/><rect x="890" y="${GY - 440}" width="320" height="40" rx="8" fill="#3E6444" stroke="${INK}" stroke-width="6"/>`;   // wheelie bin
  s += `<rect x="-6000" y="${GY - 140}" width="12000" height="900" fill="#555A78" stroke="${INK}" stroke-width="6"/><circle cx="-500" cy="${GY - 900}" r="320" fill="url(#lampG)" opacity=".7"/><rect x="-520" y="${GY - 930}" width="40" height="30" fill="#FFE9A8" stroke="${INK}" stroke-width="4"/>`;
  return L(1, s, blur);
}
function roofsNight4(t, L, o={}) {
  let sky = `<rect x="-6000" y="-3000" width="12000" height="6000" fill="url(#nightG)"/><circle cx="900" cy="140" r="80" fill="#FFF6D0"/><circle cx="900" cy="140" r="300" fill="url(#lampG)" opacity=".35"/>` + [...Array(70)].map((_, i) => `<circle cx="${(hash(i)*2 - 1)*2400}" cy="${hash(i*3)*700 - 220}" r="${1.5 + 2*hash(i*5)}" fill="#fff" opacity="${.4 + .5*Math.abs(Math.sin(t*1.3 + i))}"/>`).join('');
  let far = ''; for (let i = -7; i < 8; i++) { const x = i*360, h = 300 + (i*97 % 140); far += `<rect x="${x}" y="${GY - h - 300}" width="360" height="${h + 300}" fill="#1E2244"/><path d="M${x - 10},${GY - h - 300} L${x + 180},${GY - h - 420} L${x + 370},${GY - h - 300} Z" fill="#171A38"/>${[60, 240].map(wx => `<rect x="${x + wx}" y="${GY - h - 220}" width="70" height="90" fill="${(i*5 + wx) % 3 ? '#2E3566' : '#FFE2A8'}"/>`).join('')}`; }
  let near = `<path d="M-4000,${GY - 160} L4000,${GY - 160} L4000,${GY + 900} L-4000,${GY + 900} Z" fill="#3A2F4F" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -4000; x < 4000; x += 120) near += `<path d="M${x},${GY - 160} L${x + 60},${GY + 900}" stroke="#2E2540" stroke-width="5"/>`;
  near += `<path d="M-4000,${GY - 160} L4000,${GY - 160}" stroke="#5A4A72" stroke-width="18"/>`;
  near += `<g transform="translate(${o.chimX ?? 520},${GY - 160})"><rect x="-80" y="-280" width="160" height="280" fill="#7A4A3A" stroke="${INK}" stroke-width="6"/><rect x="-96" y="-300" width="192" height="36" fill="#5A3A2A" stroke="${INK}" stroke-width="6"/>${[0,1,2,3].map(i => `<path d="M-80,${-240 + i*60} L80,${-240 + i*60}" stroke="#5A3A2A" stroke-width="4"/>`).join('')}</g>`;
  return L(0, sky) + L(.4, far, 'b2') + L(1, near);
}

// ---------------------------------------------------------------- small props
function slipper(x, y, s=1, lift=0, flip=false) { return `<g transform="translate(${x},${y - lift}) scale(${flip ? -s : s},${s}) rotate(${-lift*.15})"><path d="M-46,0 Q-50,-30 -10,-34 L30,-30 Q56,-26 52,0 Z" fill="#7FB3FF" stroke="${INK}" stroke-width="5"/><path d="M-30,-30 Q0,-50 34,-28" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="-30" r="9" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`; }
function slippers(t, x, y, s, walking, t0=0, sp=1) {   // a pair; walking: alternate steps
  const ph = walking ? (t - t0)*sp*2.4 : 0, a = walking ? Math.max(0, Math.sin(ph*Math.PI))*22 : 0, b = walking ? Math.max(0, -Math.sin(ph*Math.PI))*22 : 0;
  return slipper(x - 40*s, y, s, a) + slipper(x + 40*s, y, s, b); }
function popcorn(x, y, s=1, t=0) { let k = ''; for (let i = 0; i < 9; i++) k += `<circle cx="${-36 + (i%5)*18}" cy="${-86 - Math.floor(i/5)*16 + Math.sin(t*3 + i)*1.5}" r="13" fill="#FFF6D0" stroke="${INK}" stroke-width="3"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${k}<path d="M-50,-80 L50,-80 L38,0 L-38,0 Z" fill="#fff" stroke="${INK}" stroke-width="5"/>${[-28, 0, 28].map(q => `<path d="M${q - 8},-80 L${q*.8 - 6},0 L${q*.8 + 6},0 L${q + 8},-80 Z" fill="#E8463C"/>`).join('')}<path d="M-50,-80 L50,-80 L38,0 L-38,0 Z" fill="none" stroke="${INK}" stroke-width="5"/></g>`; }
function biscuitTin(x, y, s=1, open=0) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-110" y="-120" width="220" height="120" rx="18" fill="#3D8BFF" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-60" r="36" fill="#FFD23F" stroke="${INK}" stroke-width="4"/><g transform="translate(-112,-128) rotate(${-open*50}) translate(112,0)"><rect x="-116" y="-14" width="232" height="30" rx="12" fill="#2F6FD0" stroke="${INK}" stroke-width="6"/></g></g>`; }
function biscuit(x, y, s=1, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><circle r="30" fill="#D9A25A" stroke="${INK}" stroke-width="4"/>${[[-10,-8],[8,-12],[12,8],[-8,10],[0,0]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#6B3E1E"/>`).join('')}</g>`; }
function eyeIcon(x, y, s, t, crossed=0) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-220,0 Q0,-170 220,0 Q0,170 -220,0 Z" fill="#fff" stroke="${INK}" stroke-width="12"/><circle r="92" fill="url(#irisG)" stroke="${INK}" stroke-width="8"/><circle r="44" fill="#0E1130"/><circle cx="-30" cy="-34" r="18" fill="#fff"/>${crossed > 0 ? `<path d="M-200,-170 L${-200 + 400*Math.min(1, crossed*2)},${-170 + 340*Math.min(1, crossed*2)}" stroke="#E8463C" stroke-width="44" stroke-linecap="round"/>${crossed > .5 ? `<path d="M200,-170 L${200 - 400*(crossed - .5)*2},${-170 + 340*(crossed - .5)*2}" stroke="#E8463C" stroke-width="44" stroke-linecap="round"/>` : ''}` : ''}</g>`; }

// ---------------------------------------------------------------- eye diagram (side view), retina mosaic, old books
function eyeDiagram(t, cx, cy, R, o={}) {
  const see = o.see || 0, rk = o.rays ?? 1, sig = o.signal || 0;
  const op = 1 - see*.75, dash = see > .5 ? 'stroke-dasharray="18 12"' : '';
  let s = `<g>`;
  // object (an apple) on the left
  const ox = cx - R - 420;
  s += `<g transform="translate(${ox},${cy})"><circle r="70" fill="#E8463C" stroke="${INK}" stroke-width="7"/><path d="M0,-70 Q10,-110 30,-120" stroke="#6B3E1E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M8,-96 Q40,-120 60,-96 Q36,-80 8,-96 Z" fill="#7ED957" stroke="${INK}" stroke-width="4"/><circle cx="-26" cy="-26" r="14" fill="#fff" opacity=".5"/></g>`;
  // eyeball
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#FFFFFF" fill-opacity="${op}" stroke="${INK}" stroke-width="8" ${dash}/>`;
  s += `<path d="M${cx + R*.92*Math.cos(-1.1)},${cy + R*.92*Math.sin(-1.1)} A${R*.92},${R*.92} 0 0 1 ${cx + R*.92*Math.cos(1.1)},${cy + R*.92*Math.sin(1.1)}" fill="none" stroke="${see > .5 ? '#9AA2C8' : '#E8463C'}" stroke-width="${R*.09}" stroke-opacity="${op + see*.3}" ${dash} stroke-linecap="round"/>`;
  if (sig > 0 && see < .5) s += `<path d="M${cx + R*.92*Math.cos(-1.1)},${cy + R*.92*Math.sin(-1.1)} A${R*.92},${R*.92} 0 0 1 ${cx + R*.92*Math.cos(1.1)},${cy + R*.92*Math.sin(1.1)}" fill="none" stroke="#FFD23F" stroke-width="${R*.05}" opacity="${.5 + .5*Math.sin(t*12)}" stroke-linecap="round"/>`;
  s += `<path d="M${cx - R*.98},${cy - R*.42} Q${cx - R*1.22},${cy} ${cx - R*.98},${cy + R*.42}" fill="#BFE6FF" fill-opacity="${.7*op}" stroke="${INK}" stroke-width="6" ${dash}/>`;       // cornea
  s += `<ellipse cx="${cx - R*.66}" cy="${cy}" rx="${R*.12}" ry="${R*.3}" fill="#DDF3FF" fill-opacity="${op}" stroke="${INK}" stroke-width="5" ${dash}/>`;                                         // lens
  s += `<path d="M${cx - R*.7},${cy - R*.42} L${cx - R*.7},${cy - R*.3} M${cx - R*.7},${cy + R*.3} L${cx - R*.7},${cy + R*.42}" stroke="#3D7BE8" stroke-width="${R*.08}" stroke-opacity="${op}"/>`;  // iris
  // optic nerve + brain
  const bx = cx + R + 380;
  s += `<path d="M${cx + R*.95},${cy} C${cx + R + 120},${cy} ${bx - 200},${cy - 40} ${bx - 120},${cy - 40}" fill="none" stroke="#F2B8A8" stroke-width="34" stroke-opacity="${op}" stroke-linecap="round"/><path d="M${cx + R*.95},${cy} C${cx + R + 120},${cy} ${bx - 200},${cy - 40} ${bx - 120},${cy - 40}" fill="none" stroke="${INK}" stroke-width="4" opacity=".4"/>`;
  s += `<g transform="translate(${bx},${cy - 60})"><path d="M-120,0 C-130,-90 -40,-130 10,-110 C60,-140 140,-90 130,-10 C150,60 80,110 20,90 C-20,120 -110,90 -120,0 Z" fill="#FFB3C6" stroke="${INK}" stroke-width="7"/><path d="M-80,-40 Q-40,-70 0,-40 Q40,-10 80,-50 M-90,30 Q-40,0 0,30 Q40,60 90,20" stroke="#E07A98" stroke-width="7" fill="none"/></g>`;
  if (sig > 0 && see < .5) for (let i = 0; i < 4; i++) { const k = ((t*1.2 + i/4) % 1); const px = lerp(cx + R, bx - 120, k), py = cy - 40*Math.sin(k*Math.PI/2); s += `<circle cx="${px}" cy="${py}" r="12" fill="#FFD23F" stroke="${INK}" stroke-width="3" opacity="${sig}"/>`; }
  // rays: top & bottom of the apple. Normal eye: bend at the cornea/lens and land (flipped) on the retina. See-through: straight on, out the back
  const ys = [-55, 0, 55]; for (const dy of ys) {
    const p0 = [ox + 60, cy + dy], p1 = [cx - R*1.05, cy + dy*.9];
    let d; if (see < .5) { const p2 = [cx + R*.9, cy - dy*.55]; d = `M${p0} L${p1} L${p2}`; } else { d = `M${p0} L${cx + R + 900},${cy + dy*1.05}`; }
    const len = 2400; s += `<path d="${d}" fill="none" stroke="#FFD23F" stroke-width="8" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len*(1 - rk)}" opacity=".95"/>`; }
  return s + `</g>`;
}
function retinaMosaic(t, x0, y0, w, h, hits=true) {
  let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="30" fill="#3A1F3F" stroke="${INK}" stroke-width="8"/>`;
  let i = 0;
  for (let y = y0 + 40; y < y0 + h - 60; y += 120) for (let x = x0 + 30; x < x0 + w - 30; x += 38) { i++;
    const cone = hash(i*1.3) > .86, f = hits && (Math.floor(t*6 + hash(i)*40) % 23 === 0);
    s += cone ? `<path d="M${x - 12},${y + 100} L${x - 12},${y + 40} Q${x},${y + 4} ${x + 12},${y + 40} L${x + 12},${y + 100} Z" fill="${f ? '#FFF6A0' : '#B07CFF'}" stroke="${INK}" stroke-width="3"/>` : `<rect x="${x - 9}" y="${y}" width="18" height="100" rx="9" fill="${f ? '#FFF6A0' : '#5C8BEA'}" stroke="${INK}" stroke-width="3"/>`; }
  for (let k = 0; k < 18; k++) { const px = x0 + 60 + hash(k*7.3)*(w - 120), py = y0 - 200 + ((t*500 + hash(k)*900) % (h + 200)); if (py > y0 - 20 && py < y0 + h - 40) s += `<circle cx="${px}" cy="${py}" r="9" fill="#FFD23F" stroke="${INK}" stroke-width="2"/>`; }
  return s;
}
function oldBook(x, y, s, title, sub, col='#7A4A3A', rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-170" y="-230" width="340" height="460" rx="14" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="-150" y="-210" width="300" height="420" rx="8" fill="none" stroke="#E8C98A" stroke-width="5"/><rect x="-170" y="-230" width="34" height="460" fill="#000" opacity=".18"/>${txt(title, 10, -40, 46, '#F2DFAE')}${sub ? txt(sub, 10, 40, 40, '#E8C98A') : ''}<path d="M-100,120 L120,120" stroke="#E8C98A" stroke-width="5"/></g>`; }
function laundry(x, y, s=1, spill=0, t=0) { let c = ''; const cols = ['#FF7EB6', '#7ED957', '#FFD23F', '#3D8BFF', '#B07CFF'];
  for (let i = 0; i < 5; i++) { const k = spill, dx = (i - 2)*60*k + (i - 2)*18, dy = -60 - 300*k*Math.sin(Math.min(1, k)*Math.PI*.9)*(0.6 + hash(i)*.6) + (k > .5 ? 600*(k - .5)*(k - .5) : 0);
    c += `<rect x="${dx - 34}" y="${dy - 20}" width="68" height="40" rx="12" fill="${cols[i]}" stroke="${INK}" stroke-width="4" transform="rotate(${k*200*(hash(i) - .5)},${dx},${dy})"/>`; }
  return `<g transform="translate(${x},${y}) scale(${s})">${c}<path d="M-110,-70 L110,-70 L90,40 L-90,40 Z" fill="#D9B272" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${[0,1,2].map(i => `<path d="M-100,${-44 + i*28} L100,${-44 + i*28}" stroke="#B48A4C" stroke-width="4"/>`).join('')}</g>`; }

// ---------------------------------------------------------------- breakfast props
function bowl(x, y, s=1, fill=1) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-90,-40 Q-80,40 0,44 Q80,40 90,-40 Z" fill="#7FD3FF" stroke="${INK}" stroke-width="6"/>${fill > 0 ? `<ellipse cx="0" cy="-40" rx="${86*Math.min(1, fill)}" ry="16" fill="#FFF8EA" stroke="${INK}" stroke-width="4"/>${[-50,-20,10,40,-35,25].map((a, i) => `<ellipse cx="${a*fill}" cy="${-44 + (i%2)*6}" rx="12" ry="7" fill="#E8B04A" stroke="${INK}" stroke-width="2.5"/>`).join('')}` : ''}<path d="M-90,-40 Q0,-24 90,-40" fill="none" stroke="${INK}" stroke-width="6"/></g>`; }
function spoon(x, y, s=1, rot=0, full=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-6" y="0" width="12" height="130" rx="6" fill="#C9D0EE" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-14" rx="22" ry="28" fill="#DDE2F2" stroke="${INK}" stroke-width="4"/>${full ? `<ellipse cx="0" cy="-16" rx="16" ry="18" fill="#E8B04A" stroke="${INK}" stroke-width="2.5"/>` : ''}</g>`; }
function cerealBox(x, y, s=1, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-80" y="-260" width="160" height="260" rx="8" fill="#E8463C" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-150" r="46" fill="#FFD23F" stroke="${INK}" stroke-width="5"/>${txt('CRUNCH', 0, -40, 40, '#fff')}</g>`; }
function milkJug(x, y, s=1, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-50,0 L-50,-150 L-20,-200 L40,-200 L50,-150 L50,0 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-50" y="-110" width="100" height="50" fill="#3D8BFF"/><path d="M50,-140 Q90,-130 80,-70 Q74,-40 50,-50" fill="none" stroke="${INK}" stroke-width="8"/></g>`; }
function juiceGlass(x, y, s=1, level=1) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-46,-150 L46,-150 L38,0 L-38,0 Z" fill="#E6F6FF" fill-opacity=".6" stroke="${INK}" stroke-width="6"/>${level > 0 ? `<path d="M${-38 - 8*level},${-150*level} L${38 + 8*level},${-150*level} L38,0 L-38,0 Z" fill="#FFA62E" opacity=".9"/>` : ''}<path d="M-30,-130 L-24,-20" stroke="#fff" stroke-width="7" opacity=".6"/></g>`; }

// ---------------------------------------------------------------- refraction props
function waterGlass(x, y, s, t, o={}) {   // a glass of water with a straw that looks broken at the surface
  const wl = -230;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-120,-420 L120,-420 L100,0 L-100,0 Z" fill="#E6F6FF" fill-opacity=".45" stroke="${INK}" stroke-width="8"/>
  <path d="M${-116 + 6},${wl} L${116 - 6},${wl} L100,0 L-100,0 Z" fill="#7FC8F2" opacity=".55"/><path d="M-112,${wl} Q0,${wl - 10 + Math.sin(t*3)*4} 112,${wl}" stroke="#fff" stroke-width="6" fill="none" opacity=".8"/>
  <path d="M60,-560 L10,${wl}" stroke="#E8463C" stroke-width="22" stroke-linecap="round"/><path d="M60,-560 L10,${wl}" stroke="#fff" stroke-width="6" stroke-dasharray="20 22" stroke-linecap="round"/>
  <path d="M${o.straight ? 10 : 34},${wl} L${o.straight ? -38 : 10},-30" stroke="#E8463C" stroke-width="${o.straight ? 22 : 26}" stroke-linecap="round" opacity=".92"/><path d="M-90,-380 L-74,-40" stroke="#fff" stroke-width="12" opacity=".5" stroke-linecap="round"/></g>`;
}
function rayDiagram(t, cx, cy, w, k=1) {
  const a1 = rad(40), a2 = rad(29), L1 = 360, L2 = 380*k;
  const p0 = [cx - Math.sin(a1)*L1, cy - Math.cos(a1)*L1], p2 = [cx + Math.sin(a2)*L2, cy + Math.cos(a2)*L2], ghost = [cx + Math.sin(a1)*380, cy + Math.cos(a1)*380];
  return `<rect x="${cx - w/2}" y="${cy}" width="${w}" height="420" fill="#5DB2FF" opacity=".55"/><path d="M${cx - w/2},${cy} L${cx + w/2},${cy}" stroke="#fff" stroke-width="8"/>
  <path d="M${cx},${cy - 380} L${cx},${cy + 400}" stroke="#fff" stroke-width="4" stroke-dasharray="14 12" opacity=".7"/>
  <path d="M${p0}L${cx},${cy}" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/>${arrow(p0[0] + (cx - p0[0])*.45, p0[1] + (cy - p0[1])*.45, p0[0] + (cx - p0[0])*.6, p0[1] + (cy - p0[1])*.6, '#FFD23F', 1, 14).replace(/stroke="[^"]*"/, 'stroke="#FFD23F"')}
  <path d="M${cx},${cy} L${ghost}" stroke="#FFD23F" stroke-width="6" stroke-dasharray="12 12" opacity=".45"/>${k > 0 ? `<path d="M${cx},${cy} L${p2}" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/>` : ''}
  <g transform="translate(${cx - w/2 + 120},${cy - 60})">${txt('AIR', 0, 0, 56, '#fff')}</g><g transform="translate(${cx - w/2 + 150},${cy + 120})">${txt('WATER', 0, 0, 56, '#fff')}</g>`;
}
function bendScale(t, x0, y, w, k=1) {   // how much things bend light: a ruler from 1.0 to 1.5
  const X = v => x0 + (v - 1)/.5*w;
  let s = `<rect x="${x0 - 30}" y="${y - 30}" width="${w + 60}" height="60" rx="30" fill="#1F2033" stroke="${INK}" stroke-width="6"/><rect x="${x0}" y="${y - 12}" width="${w}" height="24" rx="12" fill="url(#bendG)"/>`;
  for (const v of [1.0, 1.1, 1.2, 1.3, 1.4, 1.5]) s += `<path d="M${X(v)},${y + 34} L${X(v)},${y + 54}" stroke="#fff" stroke-width="5"/><text x="${X(v)}" y="${y + 96}" text-anchor="middle" font-family="Lilita One" font-size="36" fill="#BFE6FF">${v.toFixed(1)}</text>`;
  const marks = [[1.0003, 'AIR', '#7FD3FF', -1, .0], [1.33, 'WATER', '#3D8BFF', 1, .25], [1.38, 'YOUR CORNEA', '#E8463C', -1, .5], [1.5, 'GLASS', '#B07CFF', 1, .75]];
  for (const [v, lab, col, up, d] of marks) { const kk = pop(t, t - (k - d)*0 , .3); if (k < d + .05) continue; const yy = up > 0 ? y + 170 : y - 150;
    s += `<path d="M${X(v)},${y} L${X(v)},${yy + (up > 0 ? -30 : 30)}" stroke="${col}" stroke-width="6"/><circle cx="${X(v)}" cy="${y}" r="16" fill="${col}" stroke="${INK}" stroke-width="5"/><g transform="translate(${X(v)},${yy})">${chip(lab + ' ≈ ' + (v === 1.0003 ? '1.0003' : v.toFixed(2).replace(/0$/, '')), 0, 0, col, 38)}</g>`; }
  return s;
}
function umbrella(x, y, s=1, col='#E8463C', tilt=0) { return `<g transform="translate(${x},${y}) rotate(${tilt}) scale(${s})"><path d="M0,0 L0,-300" stroke="${INK}" stroke-width="8"/><path d="M-180,-300 Q-170,-440 0,-450 Q170,-440 180,-300 Q135,-330 90,-300 Q45,-330 0,-300 Q-45,-330 -90,-300 Q-135,-330 -180,-300 Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M0,0 Q0,20 -20,20" stroke="${INK}" stroke-width="8" fill="none"/></g>`; }
function walkPose(t, sp=7, extra={}) { const a = Math.sin(t*sp); return { ...POSES.idle, legL: [-24*a, 16*Math.max(0, a)], legR: [24*a, 16*Math.max(0, -a)], armF: [-22*a, 12], armB: [22*a, -12], ...extra }; }

// ---------------------------------------------------------------- thermal bits
function glassCase(x, y, w, h, op=.28) { return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="#BFE6FF" fill-opacity="${op}" stroke="${INK}" stroke-width="7"/><rect x="${-w/2 - 20}" y="-30" width="${w + 40}" height="30" fill="#8A5A3B" stroke="${INK}" stroke-width="6"/><path d="M${-w/2 + 30},${-h + 40} L${-w/2 + 90},${-60}" stroke="#fff" stroke-width="14" opacity=".5"/></g>`; }
function helicopter(x, y, s, t, beam=0) { return `<g transform="translate(${x},${y}) scale(${s})">${beam ? `<path d="M-20,60 L-420,900 L380,900 L40,60 Z" fill="#FFF6C8" opacity="${.18*beam}"/>` : ''}<path d="M120,-10 L420,-30 L430,-6 L130,20 Z" fill="#2B2F55" stroke="${INK}" stroke-width="6"/><path d="M410,-70 L440,-70 L440,10 L410,10 Z" fill="#2B2F55" stroke="${INK}" stroke-width="5"/>
  <ellipse cx="0" cy="0" rx="170" ry="90" fill="#3A4A8A" stroke="${INK}" stroke-width="7"/><path d="M-150,-20 Q-120,-80 -30,-80 L-30,0 Z" fill="#9FD8FF" stroke="${INK}" stroke-width="5"/><rect x="-10" y="-120" width="20" height="40" fill="${INK}"/><ellipse cx="0" cy="-122" rx="${300}" ry="${10 + 6*Math.sin(t*60)}" fill="#C9D0EE" opacity=".5"/><path d="M-120,90 L120,90 M-90,70 L-90,90 M90,70 L90,90" stroke="${INK}" stroke-width="8"/><circle cx="-40" cy="80" r="18" fill="#FFF6C8" stroke="${INK}" stroke-width="4"/></g>`; }
function spectrumBar(t, x0, y, w, k=1) {   // log scale 0.3 um .. 20 um: visible rainbow, then infrared
  const X = um => x0 + (Math.log10(um) - Math.log10(.3))/(Math.log10(20) - Math.log10(.3))*w;
  let s = `<defs><linearGradient id="rbw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A4BFF"/><stop offset=".2" stop-color="#3D8BFF"/><stop offset=".45" stop-color="#7ED957"/><stop offset=".65" stop-color="#FFD23F"/><stop offset=".85" stop-color="#FF8A3D"/><stop offset="1" stop-color="#E8463C"/></linearGradient>
  <linearGradient id="irg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A1B2E"/><stop offset="1" stop-color="#2A0A18"/></linearGradient></defs>`;
  s += `<rect x="${X(.4)}" y="${y - 50}" width="${X(.7) - X(.4)}" height="100" fill="url(#rbw)" stroke="${INK}" stroke-width="6"/>`;
  if (k > .3) s += `<rect x="${X(.7)}" y="${y - 50}" width="${(X(20) - X(.7))*Math.min(1, (k - .3)/.5)}" height="100" fill="url(#irg)" stroke="${INK}" stroke-width="6"/>`;
  for (const [um, lab] of [[.5, '0.5'], [1, '1'], [5, '5'], [10, '10']]) s += `<path d="M${X(um)},${y + 60} L${X(um)},${y + 82}" stroke="#fff" stroke-width="5"/><text x="${X(um)}" y="${y + 122}" text-anchor="middle" font-family="Lilita One" font-size="34" fill="#BFE6FF">${lab} µm</text>`;
  s += `<g transform="translate(${(X(.4) + X(.7))/2},${y - 90})">${txt('WHAT EYES SEE', 0, 0, 36, '#fff')}</g>`;
  if (k > .6) s += `<g transform="translate(${(X(.7) + X(20))/2},${y + 14})">${txt('INFRARED', 0, 0, 54, '#FF8A8A')}</g>`;
  if (k > .9) { const sx = X(9.5); s += `<path d="M${X(9)},${y - 60} L${X(10)},${y - 60} L${X(10)},${y + 60} L${X(9)},${y + 60} Z" fill="#FFD23F" opacity="${.5 + .3*Math.sin(t*6)}"/><path d="M${sx},${y - 60} L${sx},${y - 160}" stroke="#FFD23F" stroke-width="6"/>`; }
  return { s, X };
}

// ---------------------------------------------------------------- dogs
function dog4(x, y, s, t, o={}) {   // ep3 dog + sniffing, licking, recolour; faces left
  let g = dog(x, y, s, t, o);
  if (o.dark) g = g.replace(/#D99A58/g, '#5A4630').replace(/#C98A4A/g, '#4A3B2A').replace(/#8A5A3B/g, '#2A1F18').replace(/#F3D2A6/g, '#C9A26A');
  const nx = x - 150*s, ny = y - 118*s;
  if (o.sniff) for (let i = 0; i < 3; i++) { const k = ((t*2.2 + i/3) % 1); g += `<path d="M${nx - 10*s - k*40*s},${ny - 10*s + i*10*s} q${-10*s},${-6*s} ${-20*s},0" stroke="#fff" stroke-width="${4*s}" fill="none" opacity="${1 - k}" stroke-linecap="round"/>`; }
  if (o.lick) { const k = Math.max(0, Math.sin(t*14)); g += `<path d="M${x - 130*s},${y - 104*s} q${-14*s},${(20 + 30*k)*s} ${-34*s},${(10 + 20*k)*s} q${10*s},${-24*s} ${-4*s},${-24*s} Z" fill="#FF7E9A" stroke="${INK}" stroke-width="${3*s}"/>`; }
  if (o.flip) g = `<g transform="translate(${x},0) scale(-1,1) translate(${-x},0)">${g}</g>`;
  const lx = o.flip ? x + 70*s : x - 70*s;
  if (o.lead) g += `<path d="M${lx},${y - 140*s} Q${(lx + o.lead[0])/2},${(y + o.lead[1])/2 + 60} ${o.lead[0]},${o.lead[1]}" stroke="#E8463C" stroke-width="6" fill="none"/>`;
  return g;
}
function scentTrail(t, pts, k=1) {   // glowing smelly footprints + wavy scent lines
  let s = ''; pts.forEach(([x, y], i) => { if (i/pts.length > k) return; const a = .5 + .5*Math.sin(t*4 + i);
    s += `<ellipse cx="${x}" cy="${y}" rx="26" ry="10" fill="#B6FF5C" opacity="${.35 + .35*a}"/><ellipse cx="${x}" cy="${y}" rx="60" ry="22" fill="#B6FF5C" opacity="${.12*a}"/>`;
    if (i % 2 === 0) s += `<path d="M${x},${y - 10} q-14,-30 0,-60 q14,-30 0,-60" stroke="#C8FF7A" stroke-width="6" fill="none" opacity="${.4*a}" stroke-linecap="round"/>`; });
  return s;
}
function dotGrid(x, y, n, cols, gap, r, col) { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${x + (i % cols)*gap}" cy="${y + Math.floor(i/cols)*gap}" r="${r}" fill="${col}" stroke="${INK}" stroke-width="2"/>`; return s; }
function brainIcon(x, y, s, smell, col='#FFB3C6') { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-160,0 C-170,-120 -50,-170 10,-145 C80,-180 190,-120 170,-10 C200,80 100,140 20,120 C-30,160 -150,120 -160,0 Z" fill="${col}" stroke="${INK}" stroke-width="8"/><path d="M-110,-50 Q-60,-90 0,-50 Q60,-10 110,-70 M-120,40 Q-60,0 0,40 Q60,80 120,30" stroke="#E07A98" stroke-width="8" fill="none"/><ellipse cx="-150" cy="40" rx="${30*smell}" ry="${22*smell}" fill="#B07CFF" stroke="${INK}" stroke-width="5"/></g>`; }

// ---------------------------------------------------------------- hero-beat props
function backpack(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-56" y="-90" width="112" height="150" rx="30" fill="#3D8BFF" stroke="${INK}" stroke-width="6"/><rect x="-40" y="-10" width="80" height="50" rx="14" fill="#2F6FD0" stroke="${INK}" stroke-width="5"/><path d="M-30,-90 Q-30,-130 0,-130 Q30,-130 30,-90" fill="none" stroke="${INK}" stroke-width="8"/></g>`; }
function foldedHoodie(x, y, s=1, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-80" y="-40" width="160" height="80" rx="16" fill="#FFC21F" stroke="${INK}" stroke-width="6"/><path d="M-50,-40 Q0,-80 50,-40" fill="#F0B000" stroke="${INK}" stroke-width="5"/><path d="M-12,0 L-14,30 M12,0 L14,30" stroke="#FFF1D6" stroke-width="6"/></g>`; }
function speech(x, y, s, text, col='#1F2033', w=360) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M${-w/2},-70 Q${-w/2},-110 ${-w/2 + 40},-110 L${w/2 - 40},-110 Q${w/2},-110 ${w/2},-70 L${w/2},10 Q${w/2},50 ${w/2 - 40},50 L-20,50 L-60,100 L-56,50 L${-w/2 + 40},50 Q${-w/2},50 ${-w/2},10 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="0" y="-12" text-anchor="middle" font-family="Lilita One" font-size="58" fill="${col}">${text}</text></g>`; }
