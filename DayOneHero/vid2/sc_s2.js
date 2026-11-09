// RIG2
// Ep2 wall segment (s), Rig 2.0. Timing from t_s.js. END 35.06.
const RW = { x: 0, y: 700, z: 1 };
const WS = [ST[3] - .2, ST[4] - .2, ST[5] - .2, ST[6] - .2];
const PUNCH = ST[1] + 1.4, SLAM = ST[4] + 1.5, WX = 330;
const NAN = { hood: false, type: 'plain', top: '#B07CFF', hair: 'bun', hairCol: '#E6E6EE', pants: '#3D3F66', acc: 'glasses' };
function brickWall2(x, y, w, h, face, t) {
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C8573E" stroke="${INK}" stroke-width="8"/>`;
  for (let r = 0; r < h/60; r++) { g += `<line x1="${x}" y1="${y + r*60}" x2="${x + w}" y2="${y + r*60}" stroke="#8E3A28" stroke-width="5"/>`;
    for (let c = 0; c < w/120 + 1; c++) { const bx = x + c*120 + (r%2 ? 60 : 0); if (bx > x && bx < x + w) g += `<line x1="${bx}" y1="${y + r*60}" x2="${bx}" y2="${y + r*60 + 60}" stroke="#8E3A28" stroke-width="5"/>`;
      if ((r*7 + c*3) % 5 === 0) g += `<rect x="${bx + 8}" y="${y + r*60 + 8}" width="40" height="10" rx="5" fill="#E07A5E" opacity=".6"/>`; } }
  g += `<rect x="${x - 14}" y="${y - 30}" width="${w + 28}" height="34" rx="6" fill="#B9B2CC" stroke="${INK}" stroke-width="7"/>`;
  if (face) { const lid = face === 'bored' ? .65 + .1*Math.sin(t*.8) : 0; const fx = x + w/2, fy = y + h*.38;
    g += `<g transform="translate(${fx},${fy})">${[-1, 1].map(d => `<ellipse cx="${d*60}" cy="0" rx="28" ry="28" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="${d*60 - 6}" cy="6" r="10" fill="${INK}"/><path d="M${d*60 - 30},${-28 + 56*lid*.0} L${d*60 + 30},${-28} L${d*60 + 30},${-28 + 56*lid} L${d*60 - 30},${-28 + 56*lid} Z" fill="#C8573E"/><path d="M${d*60 - 30},${-28 + 56*lid} L${d*60 + 30},${-28 + 56*lid}" stroke="${INK}" stroke-width="6"/>`).join('')}<path d="M-34,80 L34,80" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`; }
  return g;
}
function wallSet(t, L, blur='', face=null) { return L(0, skyW(t)) + L(.5, cityFar(t, 830), blur && 'b8') + L(1, streetMid(t), blur) + L(1, streetGround() + brickWall2(WX, GY - 720, 640, 700, face, t), blur && blur !== 'b2' ? 'b2' : ''); }
function kitchen(t, L, blur='') {
  let s = roomW(t, { wall: '#FFE3EC', stripe: '#FFD1DE', floor: '#E9C9A0' }) + windowW(-260, 200, 520, 340, t);
  s += `<g transform="translate(-1100,${GY - 140})"><rect x="-150" y="-620" width="300" height="620" rx="30" fill="#F2F6FF" stroke="${INK}" stroke-width="7"/><path d="M-150,-380 L150,-380" stroke="${INK}" stroke-width="6"/><rect x="100" y="-560" width="16" height="120" rx="8" fill="#8C93B8"/><rect x="100" y="-330" width="16" height="140" rx="8" fill="#8C93B8"/></g>`;
  s += `<g transform="translate(950,${GY - 140})"><rect x="-260" y="-300" width="520" height="300" fill="#FFF0C2" stroke="${INK}" stroke-width="7"/><rect x="-280" y="-320" width="560" height="30" rx="8" fill="#E8836E" stroke="${INK}" stroke-width="6"/><circle cx="-140" cy="-360" r="44" fill="#E8463C" stroke="${INK}" stroke-width="6"/><path d="M-110,-380 q40,-10 40,20" stroke="${INK}" stroke-width="7" fill="none"/></g>`;
  return L(1, s, blur);
}
function wrestleTable(t, ang) {   // table + the two clasped forearms at the centre
  return `<rect x="-560" y="${GY - 230}" width="1120" height="64" rx="18" fill="#B07A4A" stroke="${INK}" stroke-width="8"/><rect x="-520" y="${GY - 170}" width="1040" height="200" fill="#8E5E3A" stroke="${INK}" stroke-width="8"/>
  <g transform="translate(0,${GY - 230}) rotate(${ang})"><path d="M-120,0 L-14,-150" stroke="${INK}" stroke-width="62" stroke-linecap="round"/><path d="M-120,0 L-14,-150" stroke="#FFC21F" stroke-width="50" stroke-linecap="round"/><path d="M120,0 L14,-150" stroke="${INK}" stroke-width="62" stroke-linecap="round"/><path d="M120,0 L14,-150" stroke="#B07CFF" stroke-width="50" stroke-linecap="round"/><circle cx="0" cy="-162" r="42" fill="url(#skin)" stroke="${INK}" stroke-width="7"/><path d="M-26,-180 Q0,-196 26,-180 M-28,-160 L28,-160" stroke="${INK}" stroke-width="5" fill="none"/></g>`;
}
const wrestleAng = t => t < SLAM ? Math.sin(t*14)*4 + 6*Math.sin(t*1.3) : -78*E.snap(seg(t, SLAM, SLAM + .12));
function gym(t, L, blur='') {
  let s = studioBack(t, '#3B2A6B', '#22184A', '#4A3A82');
  let f = `<rect x="-6000" y="${GY - 20}" width="12000" height="900" fill="#2B2F4A"/>` + [...Array(12)].map((_, i) => `<rect x="${-3000 + i*500}" y="${GY - 20}" width="8" height="900" fill="#3A3F66"/>`).join('');
  f += `<g transform="translate(-900,${GY - 20})"><rect x="-200" y="-380" width="400" height="380" fill="none" stroke="#8C93B8" stroke-width="14"/>${[0,1,2].map(i => `<rect x="-160" y="${-330 + i*110}" width="320" height="16" fill="#8C93B8"/><circle cx="-130" cy="${-322 + i*110}" r="34" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/><circle cx="130" cy="${-322 + i*110}" r="34" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;
  return L(0, s) + L(1, f, blur);
}
function barbell(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-300" y="-12" width="600" height="24" rx="10" fill="#C9D0EE" stroke="${INK}" stroke-width="5"/>${[-1, 1].map(d => `<rect x="${d*255 - 25}" y="-80" width="50" height="160" rx="12" fill="#2B2F4A" stroke="${INK}" stroke-width="6"/><rect x="${d*205 - 20}" y="-60" width="40" height="120" rx="10" fill="#E8463C" stroke="${INK}" stroke-width="6"/>`).join('')}</g>`; }
function bag(x, y, ang) { return `<g transform="translate(${x},${y}) rotate(${ang})"><path d="M0,-420 L0,-300" stroke="#8C93B8" stroke-width="8"/><rect x="-80" y="-300" width="160" height="320" rx="60" fill="#E8463C" stroke="${INK}" stroke-width="8"/><rect x="-80" y="-220" width="160" height="30" fill="#C8352C"/><rect x="-80" y="-60" width="160" height="30" fill="#C8352C"/></g>`; }
const SHOTS_S = [
  { t: 0, ref: RW, cam: push(0, 2.0, { x: 0, y: GY - 330, z: 1.2, r: 0 }, { x: 60, y: GY - 330, z: 1.3, r: 0 }, 'lin'), draw: (t, c, L) =>
      wallSet(t, L) + L(1, dexP([[0, { ...POSES.idle, armF:[20,30], armB:[-20,-30] }], [1.6, { ...POSES.lookR, look:[10,-4] }, 'o']], t, tt => ({ x: lerp(-500, 0, E.io(seg(tt, 0, 1.6))), y: GY + 20 }), { lean: 0 })) + chipAt(t, .7, 960, 130, 'CAN HE BREAK THINGS?', '#3D8BFF', 60) },
  { t: 2.0, ref: RW, cam: push(2.0, ST[1], { x: 40, y: GY - 260, z: 2.3, r: -3 }, { x: 40, y: GY - 260, z: 2.5, r: -4 }, 'lin'), draw: (t, c, L) =>
      wallSet(t, L, 'b8') + L(1, dexP([[2.0, 'knuckleA'], [2.3, 'knuckle', 'snap'], [2.8, 'knuckle'], [3.2, 'ready', 'o']], t, () => ({ x: 0, y: GY + 20 }))) },
  { t: ST[1], ref: RW, cam: push(ST[1], PUNCH - .3, { x: 140, y: GY - 300, z: 1.5, r: -7 }, { x: 120, y: GY - 300, z: 1.62, r: -9 }, 'in'), draw: (t, c, L) => {
      const K = [[ST[1], 'ready'], [ST[1] + .5, { ...POSES.ready, armF:[-50,-90], lean:-10, sq:.9, tilt:-6, eyes:'determined', mouth:'grit', browA:20 }, 'io']];
      return wallSet(t, L, 'b2') + L(1, dexP(K, t, () => ({ x: 0, y: GY + 20 }))); } },
  { t: PUNCH - .3, ref: RW, cam: push(PUNCH - .3, PUNCH + .3, { x: 220, y: GY - 300, z: 1.9, r: 5 }, { x: 240, y: GY - 300, z: 2.1, r: 6 }, 'snap'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.ready, armF:[-50,-90], lean:-10, sq:.9 }], [PUNCH - .05, { ...POSES.ready, armF:[90,0], armLen:1.9, lean:12, sq:1.05, eyes:'squeeze', mouth:'grit' }, 'snap'], [PUNCH + .2, { ...POSES.ready, armF:[90,0], armLen:1.25, lean:6, eyes:'squeeze', mouth:'grit' }, 'o']];
      const o = dexAt(K, t, () => ({ x: 120, y: GY + 20 }), { s: DS, seed: 4 });
      let smear = t > PUNCH - .1 && t < PUNCH ? `<path d="M170,${GY - 190} L${WX},${GY - 230} L${WX},${GY - 150} Z" fill="#FFC21F" opacity=".6"/>` : '';
      let frame = wallSet(t, L, 'b2') + L(1, smear + chibi2(o));
      if (t >= PUNCH && t < PUNCH + .07) frame = `<g filter="url(#impInk)">${frame}${focusLines(t, 1050, 470, 1, 280)}</g>`;
      return frame + bang(t, PUNCH, 1300, 330, 'THUD.', '#FFF07A', 120, -6, PUNCH + 1.4); } },
  { t: PUNCH + .3, ref: RW, cam: push(PUNCH + .3, 7.4, { x: WX - 40, y: GY - 210, z: 3.4, r: 0 }, { x: WX - 40, y: GY - 210, z: 3.6, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.ready, armF:[90,0], armLen:1.25, eyes:'open', mouth:'grit' }], [6.0, { ...POSES.ready, armF:[90,0], armLen:1.25, eyes:'happy', mouth:'grin', browA:0 }, 'o']];
      let crumbs = ''; for (let i = 0; i < 5; i++) { const k = seg(t, PUNCH + .3 + i*.15, PUNCH + 1.2 + i*.15); if (k > 0 && k < 1) crumbs += `<circle cx="${WX + 4 + i*6}" cy="${GY - 200 + k*240}" r="4" fill="#8E3A28"/>`; }
      return wallSet(t, L, 'b2') + L(1, dexP(K, t, () => ({ x: 120, y: GY + 20 })) + crumbs) + chipAt(t, PUNCH + .8, 520, 220, 'PAIN: 0', '#7ED957', 60); } },
  { t: 7.4, ref: RW, cam: push(7.4, ST[2] - .05, { x: 120, y: GY - 300, z: 1.55, r: 0 }, { x: 120, y: GY - 300, z: 1.7, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[7.4, { ...POSES.smile, armF:[60,60] }], [7.8, { ...POSES.point, armF:[90,-10], handF:'fist', armLen:1.2 }, 'snap'], [8.1, { ...POSES.smile, armF:[60,60] }], [8.4, { ...POSES.point, armF:[90,-10], handF:'fist', armLen:1.2 }, 'snap'], [8.9, { ...POSES.shrug, mouth:'grin' }, 'o']];
      return wallSet(t, L) + L(1, dexP(K, t, () => ({ x: 70, y: GY + 20 }))) + chipAt(t, 7.5, 520, 220, 'PAIN: 0', '#7ED957', 52); } },
  { t: ST[2] - .05, ref: RW, cam: push(ST[2] - .05, WS[0], { x: WX + 320, y: GY - 450, z: 2.0, r: 0 }, { x: WX + 320, y: GY - 450, z: 2.25, r: 0 }, 'lin'), draw: (t, c, L) =>
      wallSet(t, L, '', 'bored') + L(1, dexP([[0, { ...POSES.gulp, look:[10,-6] }]], t, () => ({ x: 110, y: GY + 20 }))) + chipAt(t, ST[2] + .3, 1450, 170, 'WALL DAMAGE: 0', '#E8463C', 58) },
  // stats
  { t: WS[0], ref: RW, cam: push(WS[0], 15.5, { x: 300, y: GY - 330, z: 1.4, r: 0 }, { x: 300, y: GY - 330, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, 'confident'], [13.6, { ...POSES.think, armF:[-40,-150], handF:'fist', eyes:'happy', mouth:'grin' }, 'o'], [14.6, 'confident', 'o']];
      return L(0, studioBack(t)) + L(1, studioFloor() + dexP(K, t, () => ({ x: 0, y: GY })) + (t > 13.75 && t < 14.2 ? bang(t, 13.75, 120, GY - 470, 'CLONK', '#FFC21F', 40, -8) : '')) + statPanel(t); } },
  { t: 15.5, ref: RW, cam: [[15.5, { x: 70, y: GY - 300, z: 2.3, r: 3 }], [17.3, { x: 70, y: GY - 300, z: 2.5, r: 3 }, 'lin'], [17.4, { x: 300, y: GY - 330, z: 1.4, r: 0 }, 'hold'], [WS[1], { x: 300, y: GY - 330, z: 1.5, r: 0 }, 'lin']], draw: (t, c, L) => {
      const flex = Math.max(0, Math.sin((t - 15.7)*7));
      const K = [[0, { ...POSES.cheer, armF:[60,110], armB:[-60,-110], handF:'fist', handB:'fist', eyes:'determined', mouth:'grit', browA:14 }], [17.4, { ...POSES.shrug, mouth:'flat' }, 'o']];
      const o = dexAt(K, t, () => ({ x: 0, y: GY }), { s: DS, seed: 4 }); if (t < 17.4) o.armF = [o.armF[0] - flex*10, o.armF[1] + flex*14];
      const bump = t < 17.4 ? `<circle cx="${(42 + 30)*DS}" cy="${GY - 205*DS}" r="${6 + 4*flex}" fill="#FFC21F" stroke="${INK}" stroke-width="4"/>` : '';
      return L(0, studioBack(t)) + L(1, studioFloor() + chibi2(o) + bump) + (t < 17.4 ? bang(t, 15.9, 420, 330, 'boop.', '#FFF07A', 60, -6) : statPanel(t)) + chipAt(t, 17.5, 960, 120, 'SAME AS YESTERDAY', '#FFC21F', 58); } },
  // arm wrestle with nan
  { t: WS[1], ref: RW, cam: push(WS[1], 20.9, { x: 0, y: GY - 330, z: 1.25, r: 0 }, { x: 0, y: GY - 330, z: 1.35, r: 0 }, 'lin'), draw: (t, c, L) => wrestle(t, L) + chipAt(t, ST[4] + .2, 960, 120, 'DEX vs NAN', '#B07CFF', 64) },
  { t: 20.9, ref: RW, cam: push(20.9, SLAM, { x: 0, y: GY - 400, z: 2.6, r: -3 }, { x: 0, y: GY - 400, z: 2.9, r: -4 }, 'in'), draw: (t, c, L) => wrestle(t, L, 'b8') },
  { t: SLAM, ref: RW, cam: push(SLAM, 23.4, { x: -120, y: GY - 330, z: 1.7, r: 4 }, { x: -120, y: GY - 330, z: 1.8, r: 3 }, 'lin'), draw: (t, c, L) => wrestle(t, L, 'b2') + bang(t, SLAM, 960, 300, 'SLAM!', '#E8463C', 130, -6, SLAM + 1.6) },
  { t: 23.4, ref: RW, cam: push(23.4, WS[2], { x: 0, y: GY - 330, z: 1.35, r: 0 }, { x: 0, y: GY - 330, z: 1.45, r: 0 }, 'lin'), draw: (t, c, L) => wrestle(t, L) + chipAt(t, 23.5, 1500, 300, 'NAN WINS', '#E8463C', 60) },
  // training
  { t: WS[2], ref: RW, cam: push(WS[2], 27.3, { x: 0, y: GY - 250, z: 1.7, r: 0 }, { x: 0, y: GY - 250, z: 1.85, r: 2 }, 'lin'), draw: (t, c, L) => {
      const up = Math.abs(Math.sin((t - WS[2])*3.2)), sq = 1 - (1 - up)*.16;
      const o = dexAt([[0, { ...POSES.cheer, eyes:'squeeze', mouth:'grit', sweat:true, armF:[112,-60], armB:[-112,60], legL:[-20 - (1 - up)*30, (1 - up)*50], legR:[20 + (1 - up)*30, -(1 - up)*50] }]], t, () => ({ x: 0, y: GY }), { s: DS, sq });
      return gym(t, L) + L(1, barbell(0, GY - 178*DS*sq - 8, .9) + chibi2(o)) + chipAt(t, ST[5] + .8, 960, 130, 'TRAIN FOREVER · 0 INJURIES', '#7ED957', 58); } },
  { t: 27.3, ref: RW, cam: push(27.3, 28.7, { x: 150, y: GY - 300, z: 1.6, r: -3 }, { x: 150, y: GY - 300, z: 1.75, r: -3 }, 'lin'), draw: (t, c, L) => {
      const a = 27.6, hitBack = 28.0, ang = t < a ? 0 : t < hitBack ? -30*Math.sin(seg(t, a, hitBack)*Math.PI*.5) : -30 + 50*E.snap(seg(t, hitBack, hitBack + .2));
      const K = [[0, 'ready'], [a - .05, { ...POSES.ready, armF:[90,0], armLen:1.6, lean:10 }, 'snap'], [hitBack, { ...POSES.surprise, eyes:'wide' }], [hitBack + .1, { ...POSES.flinch, eyes:'squeeze' }, 'snap'], [28.4, { ...POSES.sunk, eyes:'swirl' }], [28.65, { ...POSES.smile, eyes:'happy' }, 'o']];
      const knocked = t > hitBack + .05; const pos = () => knocked ? { x: -40 - 200*E.snap(seg(t, hitBack, hitBack + .3)), y: GY } : { x: 0, y: GY };
      return gym(t, L) + L(1, bag(300, GY - 240, ang) + dexP(K, t, pos, { rot: knocked ? -70*E.snap(seg(t, hitBack, hitBack + .3))*(1 - seg(t, 28.45, 28.65)) : 0 })) + bang(t, hitBack + .05, 520, 300, 'BOFF!', '#FFC21F', 90, -8, hitBack + .8) + chipAt(t, 28.3, 1450, 260, 'INJURIES: 0', '#7ED957', 52); } },
  { t: 28.7, ref: RW, cam: push(28.7, WS[3], { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 0, y: GY - 330, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.cheer, eyes:'happy', mouth:'grin', sweat:true }], [29.4, 'peace', 'o']];
      return gym(t, L) + L(1, dexP(K, t, () => ({ x: 0, y: GY })) + sparkles(0, GY - 260, t, 6, 230)) + chipAt(t, 28.8, 960, 130, 'TRAIN FOREVER · 0 INJURIES', '#7ED957', 58); } },
  // rule 3
  { t: WS[3], ref: RW, cam: push(WS[3], END, { x: 160, y: GY - 330, z: 1.35, r: 0 }, { x: 160, y: GY - 330, z: 1.45, r: 0 }, 'lin'), draw: (t, c, L) =>
      wallSet(t, L, '', 'bored') + L(1, dexP([[0, { ...POSES.shrug, mouth:'smirk' }], [ST[6] + 1.2, { ...POSES.idleB, eyes:'happy', tilt:-6 }, 'o']], t, () => ({ x: -260, y: GY + 20 }))) + note(t, ST[6] + DU[6] - 1.6, 1340, 330, 'RULE 3', 'NOT', 'STRONG.') },
];
function statPanel(t) {
  const mk = E.io(seg(t, ST[3] + 2.6, ST[3] + 3.4));
  return `<g transform="translate(1340,330) scale(${pop(t, ST[3] + .3, .35)})"><rect x="-400" y="-110" width="800" height="220" rx="28" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="-360" y="-30" font-family="Lilita One" font-size="46" fill="${INK}">BODY: UNBREAKABLE</text><rect x="-360" y="0" width="720" height="40" rx="20" fill="#7ED957" stroke="${INK}" stroke-width="5"/></g>` +
    `<g transform="translate(1340,640) scale(${pop(t, ST[3] + 2.4, .35)})"><rect x="-400" y="-110" width="800" height="220" rx="28" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="-360" y="-30" font-family="Lilita One" font-size="46" fill="${INK}">MUSCLES: SAME AS YESTERDAY</text><rect x="-360" y="0" width="720" height="40" rx="20" fill="#EEE9F6" stroke="${INK}" stroke-width="5"/><rect x="-356" y="4" width="${210*mk}" height="32" rx="16" fill="#FFC21F"/></g>`;
}
function wrestle(t, L, blur='') {
  const won = t > SLAM;
  const dK = [[0, { ...POSES.ready, eyes:'determined', mouth:'grit', browA:18, armF:[60,-60], sweat:true }], [SLAM, { ...POSES.flinch, eyes:'squeeze', mouth:'wail', armF:[60,-60] }, 'snap'], [SLAM + .6, { ...POSES.sunk, eyes:'dot', mouth:'o', tilt:-30, armF:[60,-60] }, 'o']];
  const nK = [[0, { ...POSES.smile, eyes:'happy', mouth:'smile', armF:[60,-60] }], [SLAM, { ...POSES.smile, eyes:'happy', mouth:'grin', armF:[60,-60] }, 'snap'], [23.8, { ...POSES.wave, eyes:'happy', mouth:'grin' }, 'o']];
  const dy = won ? 90*E.snap(seg(t, SLAM, SLAM + .2)) : Math.sin(t*20)*2;
  return kitchen(t, L, blur) + L(1, dexP(dK, t, () => ({ x: -250, y: GY - 170 + dy }), { noShadow: true, air: true }) + chibi2(dexAt(nK, t, () => ({ x: 250, y: GY - 170 }), { ...NAN, s: DS, flip: true, seed: 11, noShadow: true, air: true })) + wrestleTable(t, wrestleAng(t)) +
    (won && t < SLAM + 1 ? dust(-200, GY - 230, t, SLAM, 8, .9) : ''));
}
function scene(t) {
  let s = playShots(t, SHOTS_S, [[PUNCH, 22, .4], [SLAM, 30, .5], [28.05, 10, .3]]) + vignette();
  WS.forEach(w => s += wipe(t, w));
  return s;
}
