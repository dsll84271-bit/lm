// ============================================================================
// Day One Hero: WORLD 2.0 — shot runner + shared sets for Rig 2.0 segments.
// Loaded after rig2.js by scenes whose first line is "// RIG2".
// Conventions: world ground line is y = GY (1080) unless a set says otherwise; Dex scale DS.
// Framing rule (Leo): in wide shots Dex is at least ~35% of frame height (camera z >= 1.05 at DS).
// ============================================================================
const GY = 1080, DS = 1.05;
function layerTR(c, p, ref) {
  const z = ref.z * Math.pow(c.z / ref.z, p), x = ref.x + (c.x - ref.x)*p, y = ref.y + (c.y - ref.y)*p;
  return `translate(${960 + (c.sx||0)},${540 + (c.sy||0)}) rotate(${c.r||0}) scale(${z}) translate(${-x},${-y})`;
}
// SHOTS: [{t, cam: keys | fn(t), ref, draw(t, c, L, ctx)}];  L(p, svg, filter) places a parallax layer.
function playShots(t, SHOTS, shakes=[]) {
  let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i+1].t) i++;
  const S = SHOTS[i]; let c = typeof S.cam === 'function' ? S.cam(t) : camAt(S.cam, t);
  const q = shakeAt(t, shakes); c = { ...c, sx: (c.sx||0) + q.sx, sy: (c.sy||0) + q.sy, r: (c.r||0) + q.sr };
  const ref = S.ref || REF;
  const L = (p, svg, f='') => `<g transform="${layerTR(c, p, ref)}"${f ? ` filter="url(#${f})"` : ''}>${svg}</g>`;
  return R2DEFS + S.draw(t, c, L, { i, t0: S.t, t1: i + 1 < SHOTS.length ? SHOTS[i+1].t : 1e9 });
}
// quick camera helpers
const hold = (t0, c) => [[t0, c]];
const push = (t0, t1, a, b, e='io') => [[t0, a], [t1, b, e]];
// a Dex standing still in a set (pose keys in global time)
const dex = (keys, t, x, y, extra={}) => chibi2(dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 4, ...extra }));
const dexP = (keys, t, pos, extra={}) => chibi2(dexAt(keys, t, pos, { s: DS, seed: 4, ...extra }));

// ---------------------------------------------------------------- outdoor
function skyW(t, sunX=-1250, sunY=80, tint='') {
  let s = `<rect x="-6000" y="-3000" width="12000" height="5000" fill="url(#sky2)"/><circle cx="${sunX}" cy="${sunY}" r="720" fill="url(#sunG)"/><circle cx="${sunX}" cy="${sunY}" r="95" fill="#FFF8DC" opacity=".95"/>`;
  for (let i = 0; i < 9; i++) s += cloud(-4200 + i*1050 + ((t*14 + i*130) % 600), 100 + (i%3)*110, .9 + (i%2)*.5);
  return s + (tint ? `<rect x="-6000" y="-3000" width="12000" height="5000" fill="${tint}"/>` : '');
}
function turbine(x, y, s, t, sp) { let g = `<g transform="translate(${x},${y}) scale(${s})"><path d="M-5,0 L-2,-170 L2,-170 L5,0 Z" fill="#EEF2FF" stroke="#8C93B8" stroke-width="3"/><g transform="translate(0,-170) rotate(${t*sp})">`;
  for (let i = 0; i < 3; i++) g += `<path d="M0,0 L-5,-8 Q0,-92 4,-96 L6,-8 Z" fill="#F6F8FF" stroke="#8C93B8" stroke-width="3" transform="rotate(${i*120})"/>`; return g + `<circle r="7" fill="#C9D0EE" stroke="#8C93B8" stroke-width="3"/></g></g>`; }
function cityFar(t, base=830, col='#BCC5EE') {
  let s = '';
  for (let i = 0; i < 30; i++) { const x = -4200 + i*280 + (i*97 % 80), h = 110 + (i*53 % 170), w = 150 + (i*31 % 90);
    s += `<rect x="${x}" y="${base-h-20}" width="${w}" height="${h+60}" fill="${col}" opacity=".9"/>`;
    for (let j = 0; j < 3; j++) s += `<rect x="${x+20+j*40}" y="${base-h+10}" width="16" height="${h-40}" fill="#D3DAF6" opacity=".9"/>`; }
  return s;
}
function hills(t, base=760, turb=true) {
  let d = 'M-4800,1400 '; for (let x = -4800; x <= 4800; x += 100) d += `L${x},${base + 40*Math.sin(x/430) + 22*Math.sin(x/170 + 1)} `;
  let s = `<path d="${d} L4800,1400 Z" fill="url(#hill1)"/>`;
  if (turb) s += turbine(-1350, base, 1, t, 60) + turbine(-1000, base + 10, .8, t, 75) + turbine(1300, base, .9, t, 55) + turbine(2300, base + 10, 1.1, t, 50);
  d = 'M-4800,1400 '; for (let x = -4800; x <= 4800; x += 100) d += `L${x},${base + 52 + 30*Math.sin(x/360 + 2) + 14*Math.sin(x/130)} `;
  return s + `<path d="${d} L4800,1400 Z" fill="url(#hill2)"/>`;
}
function grassGround(y0=GY-60, tufts=true) {
  let s = `<rect x="-6000" y="${y0}" width="12000" height="900" fill="url(#grass2)"/><rect x="-6000" y="${y0}" width="12000" height="10" fill="#4FA85A" opacity=".5"/>`;
  if (tufts) for (let i = 0; i < 70; i++) s += `<path d="M${-5000 + i*150 + (i*37 % 60)},${y0 + 40 + (i%4)*55} q8,-18 16,0 q8,-14 16,0" fill="none" stroke="#4FA85A" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}
function flower(x, y, t, col='#FF7EB6', s=1) { const sw = Math.sin(t*2.2 + x*.01)*6;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 Q${sw*.5},-30 ${sw},-60" stroke="#3E9B4F" stroke-width="5" fill="none"/><g transform="translate(${sw},-60)">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-12" rx="8" ry="13" fill="${col}" stroke="${INK}" stroke-width="3" transform="rotate(${a + t*10})"/>`).join('')}<circle r="8" fill="#FFD23F" stroke="${INK}" stroke-width="3"/></g></g>`; }
function bush(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="-50" cy="-40" r="55" fill="#4FB861" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="-60" r="70" fill="#5CC46A" stroke="${INK}" stroke-width="5"/><circle cx="90" cy="-30" r="45" fill="#4FB861" stroke="${INK}" stroke-width="5"/><circle cx="10" cy="-80" r="22" fill="#8BE08F" opacity=".7"/></g>`; }
function fence(y=GY-60, x0=-4000, x1=4000) { let s = `<rect x="${x0}" y="${y-110}" width="${x1-x0}" height="16" fill="#F2E6D0" stroke="${INK}" stroke-width="4"/><rect x="${x0}" y="${y-60}" width="${x1-x0}" height="16" fill="#F2E6D0" stroke="${INK}" stroke-width="4"/>`;
  for (let x = x0; x < x1; x += 70) s += `<path d="M${x},${y} L${x},${y-140} L${x+20},${y-160} L${x+40},${y-140} L${x+40},${y} Z" fill="#FFF8EA" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; return s; }

// ---------------------------------------------------------------- street (houses, pavement, road), ground = GY
function streetMid(t, door=0) {
  let s = '';
  const H = [[-2600,'#FFE7B8','#E8836E'],[-1700,'#D8CCFF','#8C78E0'],[-800,'#BFE8D2','#5CB487'],[300,'#FFC9B8','#E8836E'],[1200,'#FFF0C2','#E8B24A'],[2100,'#D8CCFF','#8C78E0'],[3000,'#BFE8D2','#5CB487']];
  H.forEach(([x, wall, roof], i) => { s += `<g transform="translate(${x},${GY-170})"><rect x="0" y="-420" width="560" height="420" fill="${wall}" stroke="${INK}" stroke-width="6"/><path d="M-30,-410 L280,-600 L590,-410 Z" fill="${roof}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    for (const wx of [50, 380]) s += `<rect x="${wx}" y="-340" width="120" height="110" rx="10" fill="#DDF1FF" stroke="${INK}" stroke-width="5"/><path d="M${wx+15},-245 L${wx+70},-325" stroke="#fff" stroke-width="9" opacity=".8"/><rect x="${wx-8}" y="-232" width="136" height="12" rx="4" fill="${roof}" stroke="${INK}" stroke-width="4"/>`;
    s += `<rect x="225" y="-200" width="110" height="200" fill="#3B2A4A" stroke="${INK}" stroke-width="5"/><rect x="225" y="-200" width="${110*(1 - (i===3?door:0)*.85)}" height="200" rx="4" fill="${['#E8463C','#3D8BFF','#FFC21F'][i%3]}" stroke="${INK}" stroke-width="5"/><circle cx="${225 + 110*(1 - (i===3?door:0)*.85) - 18}" cy="-100" r="7" fill="${INK}"/></g>`; });
  for (const lx of [-1950, -350, 1950]) s += `<g transform="translate(${lx},${GY-170})"><rect x="-8" y="-330" width="16" height="330" fill="#3A3F66" stroke="${INK}" stroke-width="4"/><path d="M0,-320 q0,-40 55,-40 l14,0" fill="none" stroke="#3A3F66" stroke-width="13"/><rect x="48" y="-372" width="44" height="22" rx="7" fill="#FFF1B0" stroke="${INK}" stroke-width="4"/></g>`;
  s += tree(-1200, GY-170, 1.3) + tree(2650, GY-170, 1.2);
  return s;
}
function streetGround() {
  let s = `<rect x="-6000" y="${GY-170}" width="12000" height="240" fill="#E6E1F0" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -6000; x < 6000; x += 180) s += `<path d="M${x},${GY-170} L${x-50},${GY+70}" stroke="#CFC8E0" stroke-width="5"/>`;
  s += `<rect x="-6000" y="${GY+70}" width="12000" height="26" fill="#B9B2CC" stroke="${INK}" stroke-width="6"/><rect x="-6000" y="${GY+96}" width="12000" height="700" fill="url(#road2)"/>`;
  for (let x = -6000; x < 6000; x += 300) s += `<rect x="${x}" y="${GY+260}" width="150" height="16" rx="8" fill="#F2F2F2" opacity=".8"/>`;
  return s;
}

// ---------------------------------------------------------------- interior room (back wall at y range, floor from GY-140)
function roomW(t, o={}) {
  const wall = o.wall || '#FFE3C2', stripe = o.stripe || '#FFD6A8', floor = o.floor || '#C99E73';
  let s = `<rect x="-4000" y="-1200" width="8000" height="${GY-140+1200}" fill="${wall}"/>`;
  for (let x = -4000; x < 4000; x += 120) s += `<rect x="${x}" y="-1200" width="50" height="${GY-140+1200}" fill="${stripe}" opacity=".45"/>`;
  s += `<rect x="-4000" y="${GY-170}" width="8000" height="34" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="-4000" y="${GY-140}" width="8000" height="900" fill="${floor}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M-4000,${GY-140 + 30 + i*48} L4000,${GY-140 + 30 + i*48}" stroke="#A97E55" stroke-width="4" opacity=".6"/>`;
  return s;
}
function windowW(x, y, w, h, t, night=false) {
  return `<g transform="translate(${x},${y})"><rect x="-12" y="-12" width="${w+24}" height="${h+24}" rx="18" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/><rect width="${w}" height="${h}" rx="10" fill="${night?'#2A3D8F':'#9FD8FF'}" stroke="${INK}" stroke-width="5"/>
  <circle cx="${w*.72}" cy="${h*.3}" r="${h*.13}" fill="#FFE07A"/>${cloud(w*.3 + (t*12 % 60), h*.55, .55)}<path d="M${w/2},0 L${w/2},${h} M0,${h/2} L${w},${h/2}" stroke="${INK}" stroke-width="7"/><path d="M${w*.1},${h*.4} L${w*.3},${h*.1}" stroke="#fff" stroke-width="12" opacity=".6"/>
  <path d="M-40,-30 Q${w*.15},${h*.4} -20,${h+40} L-60,${h+40} L-60,-30 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/><path d="M${w+40},-30 Q${w*.85},${h*.4} ${w+20},${h+40} L${w+60},${h+40} L${w+60},-30 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/></g>`;
}
function bedW(x, y, t, blanket='#7FB3FF') {   // y = floor line; mattress top at y-150
  return `<g transform="translate(${x},${y})"><rect x="-30" y="-300" width="70" height="300" rx="20" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="0" y="-170" width="760" height="130" rx="26" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/><rect x="0" y="-60" width="760" height="40" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="740" y="-210" width="50" height="210" rx="16" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="30" y="-215" width="210" height="80" rx="34" fill="#FFF8EA" stroke="${INK}" stroke-width="6"/></g>`;
}
function blanketW(x, y, k=0) { return `<g transform="translate(${x},${y})"><path d="M${200 + k*260},-185 Q${420 + k*100},${-215 + k*30} 740,-170 L740,-40 L${190 + k*250},-40 Q${170 + k*250},-110 ${200 + k*260},-185 Z" fill="#7FB3FF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${300 + k*240},-150 L${700},-150 M${320 + k*230},-100 L700,-100" stroke="#5F94E8" stroke-width="8" opacity=".6"/></g>`; }
function shelfW(x, y) { return `<g transform="translate(${x},${y})"><rect x="0" y="0" width="320" height="18" fill="#B07A4A" stroke="${INK}" stroke-width="5"/>${[0,1,2,3,4].map(i=>`<rect x="${20+i*40}" y="${-90+(i%2)*14}" width="32" height="${90-(i%2)*14}" rx="4" fill="${['#E8463C','#3D8BFF','#FFC21F','#7ED957','#B07CFF'][i]}" stroke="${INK}" stroke-width="4"/>`).join('')}<circle cx="270" cy="-36" r="34" fill="#FFF0C2" stroke="${INK}" stroke-width="5"/></g>`; }
function posterW(x, y, w, h, title, col='#3D8BFF', rot=-3) { return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="${-w/2+16}" y="${-h/2+16}" width="${w-32}" height="${h*.55}" fill="${col}"/><path d="M${-w/2+40},${h*.02} L${-w*.1},${-h*.25} L${w*.05},${-h*.05} L${w*.25},${-h*.3} L${w/2-40},${h*.02} Z" fill="#FFFFFF" opacity=".5"/><text x="0" y="${h*.36}" text-anchor="middle" font-family="Lilita One" font-size="${h*.16}" fill="${INK}">${title}</text><circle cx="0" cy="${-h/2+6}" r="8" fill="#E8463C" stroke="${INK}" stroke-width="3"/></g>`; }

// ---------------------------------------------------------------- explainer studio (dark blue, rays, glossy floor)
function studioBack(t, c1='#2A3D8F', c2='#1B2A6B', rayCol='#34489E') {
  let s = `<defs><linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="-6000" y="-4000" width="12000" height="9000" fill="url(#stg)"/>`;
  for (let a = 0; a < 360; a += 12) { const r1 = rad(a + t*5), r2 = rad(a + 6 + t*5); s += `<path d="M0,500 L${Math.cos(r1)*5000},${500 + Math.sin(r1)*5000} L${Math.cos(r2)*5000},${500 + Math.sin(r2)*5000} Z" fill="${rayCol}" opacity=".55"/>`; }
  for (let i = 0; i < 40; i++) { const x = -2400 + (i*397 % 4800), y = -400 + (i*211 % 1500) + Math.sin(t + i)*20; s += `<circle cx="${x}" cy="${y}" r="${3 + i%4}" fill="#BFE6FF" opacity="${.25 + .25*Math.sin(t*3 + i)}"/>`; }
  return s;
}
function studioFloor(col='#14205A') {
  let s = `<ellipse cx="0" cy="${GY+10}" rx="900" ry="120" fill="#4E6BD8" opacity=".25"/><rect x="-6000" y="${GY+40}" width="12000" height="900" fill="${col}"/>`;
  for (let i = -20; i <= 20; i++) s += `<path d="M${i*220},${GY+40} L${i*900},${GY+900}" stroke="#2C3E8F" stroke-width="4"/>`;
  for (let j = 0; j < 6; j++) s += `<path d="M-6000,${GY+60 + j*j*22} L6000,${GY+60 + j*j*22}" stroke="#2C3E8F" stroke-width="4"/>`;
  return s;
}
// screen-space type helpers re-exported for brevity
const title = (t, a, x, y, word, col, size, rot=0) => t < a ? '' : `<g transform="translate(${x},${y}) scale(${pop(t, a, .35)}) rotate(${rot})">${txt(word, 0, 0, size, col)}</g>`;
function sparkles(x, y, t, n=6, r=120, col='#FFF6C0') { let s = ''; for (let i = 0; i < n; i++) { const a = i/n*6.283 + t*1.5, k = .5 + .5*Math.sin(t*6 + i*2);
  s += `<path transform="translate(${x + Math.cos(a)*r},${y + Math.sin(a)*r*.7}) scale(${.5 + k*.6}) rotate(${t*90})" d="M0,-24 L6,-6 L24,0 L6,6 L0,24 L-6,6 L-24,0 L-6,-6 Z" fill="${col}" stroke="${INK}" stroke-width="3" opacity="${.5 + k*.5}"/>`; } return s; }
// chapter transition: the series' blue speed-wipe, plus whoosh lines
function wipe2(t, at) { return wipe(t, at); }

// ---------------------------------------------------------------- props shared across segments
function carSide2(x, y, s, t, o={}) {
  const wr = o.wr || 0, dent = o.dent || 0;
  let g = `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="30" rx="176" ry="15" fill="#0B0E2A" opacity=".25"/>`;
  if (o.beam) g += `<path d="M-158,-46 L-760,-150 L-760,70 Z" fill="url(#beam)" opacity="${o.beam}"/>`;
  g += `<g transform="translate(0,${o.bounce||0}) rotate(${o.pitch||0},-60,20) scale(-1,1)">`;
  const body = `M-150,-20 Q-150,-70 -110,-74 L-70,-76 Q-40,-130 20,-130 L60,-130 Q100,-128 120,-80 L140,-76 Q160,-70 160,-30 L160,-12 Q160,0 148,0 L-140,0 Q-150,0 -150,-12 Z`;
  g += `<path d="${body}" fill="${o.col||'#3D8BFF'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="${body}" fill="url(#carSheen)"/>`;
  g += `<path d="M-150,-34 L160,-34" stroke="#0B0E2A" stroke-width="4" opacity=".18"/><path d="M-20,-74 L-20,-6 M62,-76 L62,-6" stroke="${INK}" stroke-width="3" opacity=".35"/>`;
  g += `<path d="M-56,-80 Q-34,-118 10,-118 L10,-80 Z M26,-80 L26,-118 L56,-118 Q88,-116 104,-80 Z" fill="#CFEFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<g transform="translate(60,-100) rotate(${(o.dummyTilt||0)})"><circle r="17" fill="#FFD23F" stroke="${INK}" stroke-width="4"/><path d="M0,-17 A17,17 0 0 1 17,0 L0,0 Z M0,17 A17,17 0 0 1 -17,0 L0,0 Z" fill="${INK}"/></g>`;
  g += `<path d="M-36,-84 L-16,-112 M36,-84 L50,-112" stroke="#fff" stroke-width="7" opacity=".85"/>`;
  g += `<rect x="140" y="-58" width="22" height="16" rx="5" fill="#FFF1B0" stroke="${INK}" stroke-width="4"/><rect x="-154" y="-60" width="12" height="14" rx="4" fill="#FF6B5E" stroke="${INK}" stroke-width="4"/>`;
  if (dent > 0) g += `<path d="M161,-70 Q${161-34*dent},-46 ${161-10*dent},-30 Q${161-30*dent},-18 161,-6" fill="#2A63C9" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${150-20*dent},-50 l-14,-6 M${150-18*dent},-26 l-14,4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  for (const wx of [-92, 96]) g += `<g transform="translate(${wx},-2) rotate(${wr})"><circle r="32" fill="#2B2F4A" stroke="${INK}" stroke-width="6"/><circle r="20" fill="#3B4060"/><path d="M-17,0 L17,0 M0,-17 L0,17" stroke="#9AA2C8" stroke-width="6" stroke-linecap="round"/><circle r="9" fill="#C9C2DA" stroke="${INK}" stroke-width="4"/></g>`;
  g += `</g></g>`;
  return g;
}
function carFront(x, y, s, t) {
  const b = Math.sin(t*22)*1.5;
  let g = `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="4" rx="210" ry="22" fill="#0B0E2A" opacity=".3"/>`;
  g += `<rect x="-172" y="-58" width="54" height="60" rx="14" fill="#2B2F4A" stroke="${INK}" stroke-width="7"/><rect x="118" y="-58" width="54" height="60" rx="14" fill="#2B2F4A" stroke="${INK}" stroke-width="7"/>`;
  g += `<g transform="translate(0,${b})">`;
  g += `<path d="M-118,-128 L-88,-208 Q0,-222 88,-208 L118,-128 Z" fill="#3D8BFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  g += `<path d="M-100,-134 L-76,-196 Q0,-206 76,-196 L100,-134 Z" fill="#CFEFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-62,-140 L-38,-192 M-30,-140 L-14,-180" stroke="#fff" stroke-width="9" opacity=".8"/>`;
  g += `<g transform="translate(40,-160)"><circle r="24" fill="#FFD23F" stroke="${INK}" stroke-width="5"/><path d="M0,-24 A24,24 0 0 1 24,0 L0,0 Z M0,24 A24,24 0 0 1 -24,0 L0,0 Z" fill="${INK}"/></g><path d="M10,-136 Q40,-150 70,-136" stroke="${INK}" stroke-width="7" fill="none"/>`;
  g += `<path d="M-176,-40 Q-180,-122 -150,-130 L150,-130 Q180,-122 176,-40 Q176,-20 156,-20 L-156,-20 Q-176,-20 -176,-40 Z" fill="#3D8BFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  g += `<path d="M-160,-118 L160,-118" stroke="#fff" stroke-width="8" opacity=".35"/>`;
  for (const sx of [-1,1]) g += `<ellipse cx="${118*sx}" cy="-88" rx="34" ry="20" fill="#FFF6C0" stroke="${INK}" stroke-width="5"/><ellipse cx="${118*sx}" cy="-88" rx="70" ry="44" fill="url(#headL)"/><rect x="${sx>0?172:-196}" y="-150" width="24" height="18" rx="6" fill="#3D8BFF" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="-62" y="-100" width="124" height="32" rx="10" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/><path d="M-50,-84 L50,-84" stroke="#5A6090" stroke-width="5"/>`;
  g += `<rect x="-58" y="-58" width="116" height="30" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><text x="0" y="-35" text-anchor="middle" font-family="Lilita One" font-size="24" fill="${INK}">CR45 HTS</text>`;
  return g + `</g></g>`;
}
function box2(x, y, w, h, rot=0, label='') {
  return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="4" fill="#D9A866" stroke="${INK}" stroke-width="6"/><rect x="${w/2-w*.22}" y="${-h+3}" width="${w*.22-3}" height="${h-6}" fill="#B07A45" opacity=".35"/><rect x="-12" y="${-h}" width="24" height="${h*.42}" fill="#EBD3A0" stroke="${INK}" stroke-width="3"/><path d="M${-w/2},${-h*.72} L${w/2},${-h*.72}" stroke="${INK}" stroke-width="3.5" opacity=".6"/>${label?`<text x="0" y="${-h*.3}" text-anchor="middle" font-family="Lilita One" font-size="${w*.17}" fill="#C8352C">${label}</text>`:''}</g>`;
}
function cone(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70,0 L70,0 L70,-18 L-70,-18 Z" fill="#E8611E" stroke="${INK}" stroke-width="6"/><path d="M-50,-18 L-14,-200 L14,-200 L50,-18 Z" fill="#FF7A2E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-40,-70 L40,-70 L32,-110 L-32,-110 Z" fill="#fff"/></g>`; }
function bolt(x0, y0, x1, y1, t, seed=1, w=34) {   // jagged lightning bolt with glow
  let d = `M${x0},${y0}`; const n = 7;
  for (let i = 1; i <= n; i++) { const k = i/n; d += ` L${lerp(x0, x1, k) + (i < n ? (hash(seed*13 + i + Math.floor(t*20))*2 - 1)*90 : 0)},${lerp(y0, y1, k)}`; }
  return `<path d="${d}" fill="none" stroke="#B07CFF" stroke-width="${w*3}" stroke-linejoin="round" opacity=".35" filter="url(#b8)"/><path d="${d}" fill="none" stroke="#FFF07A" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w*.35}" stroke-linejoin="round"/>`;
}
function flame(x, y, s, t, col1='#FF8A3D', col2='#FFD23F') {
  const f = k => Math.sin(t*14 + k)*8;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60,0 Q-80,-60 -40,-110 Q${-30+f(1)},-70 -10,-90 Q${-20+f(2)},-150 20,-190 Q${10+f(3)},-120 50,-110 Q${70+f(4)},-60 60,0 Z" fill="${col1}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-30,0 Q-40,-40 -16,-70 Q${-6+f(5)},-50 6,-60 Q${f(6)},-100 24,-120 Q${20+f(7)},-70 36,-60 Q${44+f(8)},-30 34,0 Z" fill="${col2}"/></g>`;
}
function lavaW(t, y0=GY-40, x0=-6000, x1=6000) {
  let d = `M${x0},${y0}`; for (let x = x0; x <= x1; x += 80) d += ` L${x},${y0 + Math.sin(x/140 + t*1.6)*10 + Math.sin(x/53 - t*2.3)*5}`;
  let s = `<path d="${d} L${x1},${y0+1200} L${x0},${y0+1200} Z" fill="#FF6A2A" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 40; i++) { const x = x0/2 + (i*317 % 6000) - 3000 + Math.sin(t*.7 + i)*30, y = y0 + 40 + (i*53 % 500);
    s += `<path d="M${x-90},${y} Q${x},${y-18} ${x+90},${y}" stroke="#FFC34D" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>`; }
  for (let i = 0; i < 14; i++) { const p = (t*.8 + i*.37) % 1, x = -2400 + (i*523 % 4800); if (p < .25) s += `<circle cx="${x}" cy="${y0 + 10}" r="${10 + p*90}" fill="#FFB347" stroke="${INK}" stroke-width="4" opacity="${1 - p*4}"/>`; }
  return s + `<rect x="${x0}" y="${y0-260}" width="${x1-x0}" height="300" fill="#FF8A3D" opacity=".12"/>`;
}
function weight(x, y, s, label='1 TONNE') { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-130,0 L-90,-150 L90,-150 L130,0 Z" fill="#5A6090" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-36" y="-196" width="72" height="50" rx="14" fill="none" stroke="${INK}" stroke-width="14"/><text y="-50" text-anchor="middle" font-family="Lilita One" font-size="44" fill="#fff">${label}</text></g>`; }
function scissors(x, y, s, open=0, bent=0) {
  const a = 6 + open*24;
  const blade = (r, by) => `<g transform="rotate(${r})"><path d="M0,0 Q${120},${by*-6} 210,${by*(-4 + bent*60)}" stroke="#C9D0EE" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M0,0 Q120,${by*-6} 210,${by*(-4 + bent*60)}" stroke="${INK}" stroke-width="4" fill="none" transform="translate(0,${by*-9})"/><circle cx="-70" cy="${by*14}" r="34" fill="none" stroke="#E8463C" stroke-width="16"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${blade(-a, 1)}${blade(a, -1)}<circle r="10" fill="${INK}"/></g>`;
}
function skyFall(t, speed=900) {  // clouds streaming up past a falling camera
  let s = `<rect x="-6000" y="-6000" width="12000" height="12000" fill="url(#sky2)"/>`;
  for (let i = 0; i < 14; i++) { const y = ((i*420 - t*speed) % 3000 + 3000) % 3000 - 1200, x = -1600 + (i*733 % 3200); s += cloud(x, y, 1.4 + (i%3)*.5); }
  return s;
}
function redHood(x, y, s, eyes=1) { return mystery(x, y, s, eyes); }
