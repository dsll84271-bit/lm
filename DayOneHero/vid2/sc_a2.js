// RIG2
// Ep2 ocean segment (a), Rig 2.0. Timing from t_a.js. END 41.66.
// Underwater world: y = depth in px (surface y=0, seabed y=BED). 6000 px <=> 10,935 m (Challenger Deep).
const RA = { x: 0, y: 0, z: 1 };
const JUMP = ST[0] + DU[0] + .2, UP = ST[4] + .6, OUT = ST[4] + DU[4] + .3, BED = 6000;
const depthY = t => t < JUMP ? -60 : t < 17.9 ? BED*E.io(seg(t, JUMP + .3, 17.4)) + 40*Math.sin(t*1.6) : t < UP ? BED + 20*Math.sin(t*1.6) : BED*(1 - E.in(seg(t, UP, OUT)));
const metres = y => Math.max(0, Math.min(10935, Math.round(y/BED*10935)));
function seaCol(y) { const d = clamp(y/BED); return [`rgb(${lerp(70, 6, d)|0},${lerp(170, 14, d)|0},${lerp(235, 40, d)|0})`, `rgb(${lerp(30, 2, d)|0},${lerp(110, 6, d)|0},${lerp(200, 20, d)|0})`]; }
function waterBack(t, cy) {   // screen-anchored gradient by depth + world-anchored marine snow, rays, fish, seabed
  const [c1, c2] = seaCol(cy);
  let s = `<defs><linearGradient id="sea2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="-4000" y="${cy - 3000}" width="8000" height="6000" fill="url(#sea2)"/>`;
  if (cy < 1500) for (let i = 0; i < 7; i++) s += `<path d="M${-900 + i*300},-40 L${-1000 + i*300 + 140},1400 L${-860 + i*300 + 260},1400 L${-800 + i*300},-40 Z" fill="#fff" opacity="${.07*(1 - cy/1500)}"/>`;
  for (let i = 0; i < 70; i++) { const y = cy - 700 + ((((i*173 - cy) % 1400) + 1400) % 1400), x = -1100 + (i*331 % 2200); s += `<circle cx="${x + Math.sin(t + i)*10}" cy="${y - (t*20 % 40)}" r="${2 + i%4}" fill="#fff" opacity=".35"/>`; }
  for (let i = 0; i < 4; i++) { const fy = 400 + i*260; if (Math.abs(fy - cy) < 900) s += fishW(((i*600 + t*110) % 2600) - 1300, fy, 1.1, ['#FF8A3D', '#7ED957', '#FF5A7A', '#FFC21F'][i], t); }
  if (cy > BED - 900) { let d = `M-3000,${BED + 260}`; for (let x = -3000; x <= 3000; x += 120) d += ` L${x},${BED + 240 + Math.sin(x/170)*30}`; s += `<path d="${d} L3000,${BED + 900} L-3000,${BED + 900} Z" fill="#14182E" stroke="#0A0C1A" stroke-width="6"/>`; }
  return s;
}
function fishW(x, y, s, col, t) { return `<g transform="translate(${x},${y + Math.sin(t*2 + x*.01)*14}) scale(${-s},${s})"><ellipse rx="50" ry="28" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M45,0 l40,${-26 + Math.sin(t*12)*6} l0,52 Z" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="-6" r="6" fill="${INK}"/></g>`; }
function subW(x, y, s, crush, t) {
  const sq = 1 - .62*crush, wob = crush > 0 && crush < 1 ? Math.sin(t*60)*4 : 0;
  return `<g transform="translate(${x + wob},${y}) scale(${s*(1 + .15*crush)},${s*sq})"><ellipse rx="170" ry="74" fill="#FFC21F" stroke="${INK}" stroke-width="8"/><rect x="-36" y="-120" width="76" height="54" rx="12" fill="#FFC21F" stroke="${INK}" stroke-width="7"/><path d="M170,0 l40,-30 l0,60 Z" fill="#E8A40C" stroke="${INK}" stroke-width="6"/>${[-80, 0, 80].map(cx => `<circle cx="${cx}" cy="0" r="22" fill="#9FD8FF" stroke="${INK}" stroke-width="5"/>`).join('')}${crush > .3 ? `<path d="M-120,-40 l30,20 l-10,30 M60,-50 l-20,30 l30,14 M-20,40 l20,-20" stroke="${INK}" stroke-width="5" fill="none"/>` : ''}<text y="56" text-anchor="middle" font-family="Lilita One" font-size="26" fill="${INK}">TEST SUB</text></g>`;
}
function angler(x, y, t) { return `<g transform="translate(${x},${y})"><path d="M0,0 Q60,-120 120,-90" fill="none" stroke="#8C93B8" stroke-width="5"/><circle cx="120" cy="-90" r="${16 + Math.sin(t*5)*3}" fill="#FFF07A"/><circle cx="120" cy="-90" r="60" fill="#FFF07A" opacity=".2"/><ellipse rx="110" ry="70" fill="#3E3A44" stroke="#14162A" stroke-width="6"/><path d="M-80,20 l20,-14 l20,14 l20,-14 l20,14 l20,-14" fill="none" stroke="#fff" stroke-width="5"/><circle cx="-50" cy="-20" r="10" fill="#fff"/><path d="M100,0 l50,-40 l0,80 Z" fill="#3E3A44" stroke="#14162A" stroke-width="6"/></g>`; }
function depthHUD(y) { return `<g transform="translate(1690,110)"><rect x="-170" y="-60" width="340" height="128" rx="22" fill="#1B1D33" opacity=".85" stroke="#fff" stroke-width="5"/><text y="-14" text-anchor="middle" font-family="Lilita One" font-size="30" fill="#9FD8FF">DEPTH</text><text y="44" text-anchor="middle" font-family="Lilita One" font-size="54" fill="#7ED957">${metres(y).toLocaleString('en-GB')} m</text></g>`; }
function bubblesFrom(x, y, t, n=5, rate=1.2) { let s = ''; for (let i = 0; i < n; i++) { const p = (t*rate + i/n) % 1; s += `<circle cx="${x + Math.sin(p*9 + i)*20}" cy="${y - p*300}" r="${7 + i*3}" fill="none" stroke="#fff" stroke-width="4" opacity="${1 - p}"/>`; } return s; }
function seaSurface(t, L, blur='') {   // above-water set: sky, sea, boat. world y=0 is the waterline
  let sea = `<rect x="-6000" y="0" width="12000" height="3000" fill="#2E8BD9"/>`; let d = 'M-6000,0'; for (let x = -6000; x <= 6000; x += 60) d += ` L${x},${Math.sin(x/60 + t*3)*8}`; sea += `<path d="${d}" fill="none" stroke="#fff" stroke-width="6"/>`;
  const boat = `<g transform="translate(250,${Math.sin(t*2)*6})"><path d="M-330,-30 L330,-30 L250,70 L-250,70 Z" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M-330,-30 L330,-30" stroke="#E8463C" stroke-width="10"/><rect x="-80" y="-220" width="22" height="196" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><path d="M-58,-210 L120,-60 L-58,-60 Z" fill="#FFF0C2" stroke="${INK}" stroke-width="6"/></g>`;
  return L(0, `<rect x="-6000" y="-4000" width="12000" height="7000" fill="url(#sky2)"/>` + [...Array(5)].map((_, i) => cloud(-1600 + i*800 + t*8, -760 + (i%2)*120, 1.2)).join('')) + L(.4, `<path d="M-3000,0 Q-1800,-160 -900,-40 L-900,0 Z" fill="#5CB487" opacity=".6"/>`, blur) + L(1, sea + boat, blur && 'b2');
}
const DX = 0;
const SHOTS_A = [
  { t: 0, ref: RA, cam: push(0, 2.4, { x: 80, y: -280, z: 1.25, r: 0 }, { x: 120, y: -280, z: 1.35, r: 0 }, 'lin'), draw: (t, c, L) =>
      seaSurface(t, L) + L(1, dex([[0, 'smile'], [1.2, { ...POSES.point, armF:[100,40], armLen:1.1, handF:'point' }, 'o']], t, 150, -30 + Math.sin(t*2)*6)) + chipAt(t, ST[0] + .4, 960, 140, 'THE DEEPEST OCEAN?', '#3D8BFF', 60) },
  { t: 2.4, ref: RA, cam: push(2.4, JUMP, { x: 150, y: -240, z: 2.2, r: -2 }, { x: 150, y: -240, z: 2.4, r: -3 }, 'lin'), draw: (t, c, L) => {
      const K = [[2.4, 'ready'], [3.4, { ...POSES.stretchUp, eyes:'closed', mouth:'o', sq:1.08 }, 'o'], [4.2, { ...POSES.crouchPop, eyes:'squeeze', mouth:'flat' }, 'io']];
      const o = dexAt(K, t, () => ({ x: 150, y: -30 + Math.sin(t*2)*6 }), { s: DS }); const puff = t > 3.9 ? `<g transform="translate(150,${-30 - 238*DS*o.sq})"></g>` : '';
      return seaSurface(t, L, 'b4') + L(1, chibi2(o) + puff) + chipAt(t, 3.6, 960, 140, 'DEEP BREATH…', '#3D8BFF', 56); } },
  { t: JUMP, ref: RA, cam: push(JUMP, JUMP + 1.1, { x: 0, y: -200, z: 1.5, r: 3 }, { x: -60, y: -60, z: 1.7, r: 6 }, 'in'), draw: (t, c, L) => {
      const k = seg(t, JUMP, JUMP + .6), pos = { x: lerp(150, -60, k), y: lerp(-30, 220, k) - 260*4*k*(1 - k) };
      const o = dexAt([[0, { ...POSES.dive, eyes:'squeeze', mouth:'flat' }]], t, () => pos, { s: DS, air: true, rot: -160*k });
      return seaSurface(t, L) + L(1, chibi2(o) + dust(-60, 0, t, JUMP + .55, 12, 1.8, '#E8F6FF', .7)) + (t > JUMP + .55 ? `<rect x="0" y="${540 + (0 - c.y)*c.z}" width="1920" height="1080" fill="#2E8BD9" opacity=".55"/>` : ''); } },
  // the descent: camera rides down with Dex
  { t: JUMP + 1.1, ref: RA, cam: t => ({ x: DX, y: depthY(t) - 40, z: 1.6, r: 0 }), draw: (t, c, L) => {
      const y = depthY(t), K = [[0, { ...POSES.dive, eyes:'happy', mouth:'smile', armF:[60,40], armB:[-60,-40] }], [7.4, { ...POSES.idle, eyes:'open', mouth:'smile', armF:[70,30], armB:[-70,-30], legL:[-14,10], legR:[14,-10] }, 'o']];
      const o = dexAt(K, t, () => ({ x: DX, y: y + 160 }), { s: DS, air: true, rot: lerp(180, 0, E.io(seg(t, JUMP + 1.1, 7.6))) + Math.sin(t*1.3)*4, wind: -.4 });
      return L(1, waterBack(t, c.y) + chibi2(o) + bubblesFrom(DX, y - 140, t, 3, .8)) + depthHUD(y); } },
  { t: ST[1], ref: RA, cam: t => ({ x: DX + 40, y: depthY(t) - 60, z: 1.7 + .05*Math.sin(t), r: 0 }), draw: (t, c, L) => {
      const y = depthY(t), k = E.o(seg(t, ST[1] + .4, ST[1] + 1.2));
      let arrows = ''; for (let i = 0; i < 8; i++) { const a = i/8*6.283 + .2, r0 = 330 - 40*Math.sin(t*4 + i); arrows += `<g transform="translate(${DX + Math.cos(a)*r0*k},${y + 10 + Math.sin(a)*r0*k}) rotate(${a*57.3 + 180})"><path d="M0,-14 L60,-14 L60,-30 L96,0 L60,30 L60,14 L0,14 Z" fill="#E8463C" stroke="${INK}" stroke-width="5" opacity="${k}"/></g>`; }
      return L(1, waterBack(t, c.y) + arrows + dex([[0, { ...POSES.idle, eyes:'happy', mouth:'smile', armF:[70,30], armB:[-70,-30] }], [10.5, { ...POSES.shrug, eyes:'happy' }, 'o']], t, DX, y + 160, { air: true })) + depthHUD(y) + chipAt(t, ST[1] + .4, 600, 160, 'PRESSURE: ×1,000+', '#E8463C', 60); } },
  { t: 11.8, ref: RA, cam: t => ({ x: DX - 260, y: depthY(t) - 40, z: 1.45, r: -3 }), draw: (t, c, L) => {
      const y = depthY(t), cr = E.snap(seg(t, 12.5, 13.1));
      return L(1, waterBack(t, c.y) + subW(DX - 560, y + 40, 1.1, cr, t) + (cr > .2 ? bubblesFrom(DX - 560, y - 40, t, 8, 2.5) : '') + dex([[0, { ...POSES.lookR, look:[-10,0], tilt:-6 }], [13.1, { ...POSES.surprise, look:[-10,0] }, 'o']], t, DX, y + 160, { air: true })) +
        depthHUD(y) + bang(t, 12.55, 560, 330, 'CRUNCH', '#FFF07A', 100, -8, 13.6) + chipAt(t, 12.9, 560, 860, 'NORMAL SUB: CRUSHED', '#E8463C', 50); } },
  { t: 13.9, ref: RA, cam: t => ({ x: DX + 120, y: depthY(t) - 80, z: 1.65, r: 2 }), draw: (t, c, L) => {
      const y = depthY(t);
      return L(1, waterBack(t, c.y) + `<circle cx="${DX + 460}" cy="${y - 40}" r="520" fill="#FFF07A" opacity=".08"/>` + angler(DX + 520, y - 60 + Math.sin(t*1.5)*20, t) + dex([[0, { ...POSES.wave, eyes:'happy' }]], t, DX, y + 160, { air: true })) +
        depthHUD(y) + chipAt(t, ST[1] + 6.6, 960, 930, 'DEX: DOESN’T NOTICE', '#7ED957', 56); } },
  // air
  { t: 17.9, ref: RA, cam: push(17.9, 20.05, { x: DX, y: BED - 80, z: 2.6, r: 0 }, { x: DX, y: BED - 90, z: 3.0, r: 0 }, 'in'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.smile, armF:[70,30], armB:[-70,-30] }], [ST[2] + .6, { ...POSES.surprise, eyes:'wide', mouth:'flat', sweat:true, armF:[70,30], armB:[-70,-30] }, 'snap']];
      return L(1, waterBack(t, c.y) + dex(K, t, DX, BED + 160 + 20*Math.sin(t*1.6), { air: true }) + (t > ST[2] + .6 ? bubblesFrom(DX + 10, BED - 160, t, 4) : '')) + depthHUD(BED); } },
  { t: 20.05, ref: RA, cam: push(20.05, ST[3] - .1, { x: DX, y: BED - 60, z: 2.1, r: -3 }, { x: DX, y: BED - 60, z: 2.25, r: 3 }, 'lin'), draw: (t, c, L) =>
      L(1, waterBack(t, c.y) + dex([[0, { ...POSES.worried, eyes:'wide', mouth:'flat', armF:[100,60], armB:[-100,-60] }]], t, DX, BED + 160 + 20*Math.sin(t*1.6), { air: true }) + bubblesFrom(DX + 10, BED - 160, t, 6, 1.6)) + title(t, ST[2] + 1.2, 960, 200, 'AIR.', '#FFFFFF', 170) + depthHUD(BED) },
  { t: ST[3] - .1, ref: RA, cam: push(ST[3] - .1, 28.7, { x: DX - 260, y: BED - 80, z: 1.7, r: 0 }, { x: DX - 260, y: BED - 80, z: 1.85, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, ST[3] + .3, ST[3] + DU[3] + .8), blue = clamp((t - ST[3])/6)*.35;
      const o = dexAt([[0, { ...POSES.think, armF:[-32,-118], eyes:'squeeze', mouth:'flat', sweat:true }]], t, () => ({ x: DX, y: BED + 160 + 20*Math.sin(t*1.6) }), { s: DS, air: true });
      const timer = `<g transform="translate(${DX - 560},${BED - 120})"><circle r="170" fill="#1B1D33" stroke="#fff" stroke-width="8"/><path d="M0,0 L0,-156 A156,156 0 ${k > .5 ? 1 : 0} 1 ${Math.sin(k*2*Math.PI)*156},${-Math.cos(k*2*Math.PI)*156} Z" fill="#7FD3FF" opacity=".85"/><text y="24" text-anchor="middle" font-family="Lilita One" font-size="72" fill="#fff">0:${String(Math.min(59, Math.floor(k*60))).padStart(2, '0')}</text></g>`;
      return L(1, waterBack(t, c.y) + timer + chibi2(o) + `<circle cx="${DX}" cy="${BED + 160 - 238*DS}" r="${82*DS}" fill="#5A7BFF" opacity="${blue}"/>` + bubblesFrom(DX + 10, BED - 160, t, 2, .6)) + chipAt(t, ST[3] + .4, 1350, 200, 'BODY STILL BURNS OXYGEN', '#3D8BFF', 50) + chipAt(t, ST[3] + 2.4, 1350, 320, 'MOST PEOPLE: ≈ 1 MIN', '#E8463C', 50); } },
  { t: 28.7, ref: RA, cam: push(28.7, UP, { x: DX, y: BED - 100, z: 1.6, r: 0 }, { x: DX, y: BED - 380, z: 1.25, r: 0 }, 'io'), draw: (t, c, L) =>
      L(1, waterBack(t, c.y) + `<circle cx="0" cy="${BED - 1600}" r="700" fill="#BFE6FF" opacity=".08"/>` + dex([[0, { ...POSES.lookCam, look:[0,-14], tilt:-10, mouth:'flat', eyes:'wide' }]], t, DX, BED + 160, { air: true })) + depthHUD(BED) },
  // the race back up (with a space insert)
  { t: UP, ref: RA, cam: t => ({ x: DX, y: depthY(t) + 40, z: 1.5, r: 4*Math.sin(t*3) }), draw: (t, c, L) => {
      const y = depthY(t), o = dexAt([[0, { ...POSES.flailA, eyes:'squeeze', mouth:'flat' }]], t, () => ({ x: DX, y: y + 160 }), { s: DS, air: true, wind: 1, rot: Math.sin(t*8)*6 });
      o.armF = [o.armF[0] + Math.sin(t*16)*30, o.armF[1]]; o.armB = [o.armB[0] - Math.sin(t*16)*30, o.armB[1]]; o.legL = [-20 + Math.sin(t*16)*25, 20]; o.legR = [20 - Math.sin(t*16)*25, -20];
      return L(1, waterBack(t, c.y) + chibi2(o)) + speedLines(t, 22, .5, '#FFFFFF', 1).replace(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.-]+)" height="([\d.-]+)"/g, (m, x, yy, w, h) => `<rect x="${yy*1.78}" y="${x*.45}" width="${h}" height="${w}"`) + depthHUD(y) + chipAt(t, ST[4] + 3.2, 960, 150, 'NO DEEP SEA · NO SPACE', '#E8463C', 60); } },
  { t: 33.9, ref: { x: 0, y: 540, z: 1 }, cam: push(33.9, 35.1, { x: 0, y: 540, z: 1.0, r: 0 }, { x: 0, y: 520, z: 1.1, r: 4 }, 'lin'), draw: (t, c, L) =>
      L(0, `<rect x="-3000" y="-3000" width="6000" height="6000" fill="#0A0C1E"/>` + [...Array(80)].map((_, i) => `<circle cx="${-1200 + (i*397 % 2400)}" cy="${(i*211 % 1200) - 60}" r="${1 + i%3}" fill="#fff" opacity="${.5 + .4*Math.sin(t*3 + i)}"/>`).join('')) +
      L(.3, `<circle cx="0" cy="2300" r="1700" fill="#2E8BD9"/><path d="M-700,700 Q-300,620 0,700 Q200,780 500,680 L700,800 L-800,820 Z" fill="#5CB487" opacity=".9"/><circle cx="0" cy="2300" r="1740" fill="none" stroke="#9FD8FF" stroke-width="40" opacity=".4"/>`) +
      L(1, chibi2(dexAt([[0, { ...POSES.flailB, eyes:'squeeze', mouth:'flat' }]], t, () => ({ x: 0, y: 700 }), { s: DS*1.1, air: true, rot: t*20 })) + `<circle cx="${-48*DS*1.1}" cy="${700 - 210*DS*1.1}" r="20" fill="#FF8C9A"/><circle cx="${48*DS*1.1}" cy="${700 - 210*DS*1.1}" r="20" fill="#FF8C9A"/>`) + chipAt(t, 33.95, 960, 130, 'SPACE: ALSO NO AIR', '#B07CFF', 58) },
  { t: 35.1, ref: RA, cam: t => ({ x: DX, y: Math.max(-240, depthY(t) - 60), z: 1.6, r: 0 }), draw: (t, c, L) => {
      const y = depthY(t); if (t < OUT) return L(1, waterBack(t, c.y) + dex([[0, { ...POSES.flailA, eyes:'squeeze', mouth:'flat' }]], t, DX, y + 160, { air: true })) + depthHUD(y);
      const k = seg(t, OUT, OUT + .4);
      return seaSurface(t, L) + L(1, dex([[0, { ...POSES.popJump, eyes:'wide', mouth:'wail' }], [OUT + .4, { ...POSES.cheer, eyes:'happy', mouth:'laugh' }, 'o']], t, DX, 120 - 140*E.o(k), { air: true }) + `<rect x="-3000" y="40" width="6000" height="900" fill="#2E8BD9" opacity=".8"/>` + dust(DX, 20, t, OUT, 12, 1.6, '#E8F6FF', .8)) + bang(t, OUT, 1250, 330, 'GASP!', '#FFF07A', 120, -6, OUT + 1.4); } },
  { t: ST[5] - .2, ref: RA, cam: push(ST[5] - .2, END, { x: 380, y: -260, z: 1.35, r: 0 }, { x: 380, y: -260, z: 1.45, r: 0 }, 'lin'), draw: (t, c, L) =>
      seaSurface(t, L) + L(1, dex([[0, { ...POSES.smile, sweat:true }], [ST[5] + .5, 'peace', 'o']], t, 150, -30 + Math.sin(t*2)*6)) + note(t, ST[5], 1380, 360, 'RULE 5', 'STILL NEED', 'AIR.') },
];
function scene(t) { return playShots(t, SHOTS_A, [[12.55, 10, .4], [OUT, 12, .4]]) + vignette() + flash(t, OUT, '#fff', .3, .6); }
