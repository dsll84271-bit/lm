// RIG2
// Ep2 bricks segment (r), Rig 2.0. Timing from t_r.js. END 34.6.
const RB = { x: 0, y: 700, z: 1 };
const SLIP = ST[1] + 3.0, RUN0 = ST[3] + .2, PUSH = ST[3] + 1.4, HIT = ST[3] + DU[3] + .2, GETUP = ST[4] + 1.8, WR = ST[5] - .2;
const KID = { hood: false, type: 'jacket', top: '#7ED957', shirt: '#FFFFFF', hair: 'cap', pants: '#3D5AFE' };
const SPOT = 880, PLANK = GY - 660;
const slowmo = t => t > ST[2] - .1 && t < RUN0;
// fall progress of the bricks 0..1 (slow-motion section barely moves)
const fallK = t => t < SLIP ? 0 : t < ST[2] ? .3*E.in(seg(t, SLIP, SLIP + 1.4)) : t < RUN0 ? .3 + .1*seg(t, ST[2], RUN0) : .4 + .6*E.in(seg(t, RUN0, HIT));
const BR = [[-60, 0], [30, 0], [-15, -40], [75, -40], [-105, -40], [30, -80]];
function brick2(x, y, r) { return `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-46" y="-21" width="92" height="42" rx="6" fill="#C8573E" stroke="${INK}" stroke-width="5"/><path d="M-36,-10 L-6,-10" stroke="#E07A5E" stroke-width="5" stroke-linecap="round"/></g>`; }
function scaffold2(t) {
  let g = ''; for (let i = 0; i < 6; i++) g += `<rect x="${560 + i*170}" y="${GY - 880}" width="18" height="${880 - 160}" fill="#8C93B8" stroke="${INK}" stroke-width="4"/>`;
  for (let j = 0; j < 4; j++) g += `<rect x="540" y="${GY - 840 + j*180}" width="900" height="22" fill="#C9A06A" stroke="${INK}" stroke-width="4"/>`;
  g += `<rect x="600" y="${GY - 960}" width="800" height="120" fill="#E6E1F0" stroke="${INK}" stroke-width="6" opacity=".6"/><g transform="translate(1320,${GY - 230})"><path d="M0,-90 L80,60 L-80,60 Z" fill="#FFC21F" stroke="${INK}" stroke-width="6"/><text y="40" text-anchor="middle" font-family="Lilita One" font-size="70" fill="${INK}">!</text></g>`;
  return g + `<rect x="420" y="${GY - 330}" width="1160" height="160" fill="#FFC21F" opacity=".0"/>`;
}
function plank(t) { const k = seg(t, SLIP - .6, SLIP); return t < SLIP + .3 ? `<g transform="translate(${SPOT},${PLANK + 12}) rotate(${-16*k})"><rect x="-170" y="-10" width="340" height="22" fill="#B07A4A" stroke="${INK}" stroke-width="4"/></g>` : ''; }
function bricksFalling(t) {
  if (t >= HIT) return ''; const k = fallK(t); let s = '';
  BR.forEach(([bx, by], i) => { const y0 = PLANK - 12 + by, y1 = GY - 380 + by*.4; s += brick2(SPOT + bx + Math.sin(i)*k*60, lerp(y0, y1, k), k*(i % 2 ? 160 : -120)); });
  return s;
}
function bricksPile(t) { const k = seg(t, GETUP, GETUP + .4); return [[-200, 0], [-110, 10], [180, 5], [240, -10], [-280, 10], [120, 10]].map(([bx, by], i) => brick2(SPOT + bx*(1 + k*.3), GY + 10 + by - (t < GETUP + .4 ? 40*Math.sin(k*Math.PI) : 0), (i*53) % 50 - 25)).join(''); }
function site(t, L, blur='', dusk=0) {
  return L(0, skyW(t, -1500, 160, dusk ? `rgba(255,140,80,${.35*dusk})` : '')) + L(.45, cityFar(t, 830), blur && 'b8') + L(1, streetMid(t), blur) + L(1, streetGround() + scaffold2(t), blur && blur !== 'b2' ? 'b2' : '');
}
const kidX = t => t < ST[1] ? -900 : t < PUSH ? lerp(-900, SPOT - 40, seg(t, ST[1], ST[1] + 5.4)) - (slowmo(t) ? 0 : 0) : lerp(SPOT - 40, SPOT + 520, E.snap(seg(t, PUSH, PUSH + .9)));
function kid(t, extra={}) {
  const walking = t > ST[1] && t < ST[1] + 5.4, ph = t*(slowmo(t) ? 1.5 : 7);
  const K = [[0, { ...POSES.smile, armF:[-10,20], armB:[10,-20] }], [PUSH, { ...POSES.surprise, eyes:'dot', mouth:'o' }, 'snap'], [GETUP, { ...POSES.surprise, eyes:'wide' }], [GETUP + 1.0, { ...POSES.cheer, eyes:'happy', mouth:'grin' }, 'o']];
  const o = dexAt(K, t, () => ({ x: kidX(t), y: GY + 30 }), { ...KID, s: .78, seed: 13, ...extra });
  if (walking) { o.legL = [Math.sin(ph)*20, 0]; o.legR = [-Math.sin(ph)*20, 0]; o.look = [10, 0]; }
  if (t > PUSH && t < PUSH + .8) o.lean = 14;
  return chibi2(o);
}
const dexX = t => t < RUN0 ? lerp(-1300, -200, seg(t, 0, 3.6)) : t < PUSH ? lerp(-200, SPOT - 160, E.io(seg(t, RUN0, PUSH))) : SPOT - 160 + 160*E.io(seg(t, PUSH + .3, PUSH + 1.0));
const SHOTS_R = [
  { t: 0, ref: RB, cam: t => ({ x: dexX(t) + 120, y: GY - 300, z: 1.55, r: 0 }), draw: (t, c, L) => {
      const ph = t*6, K = [[0, { ...POSES.think, armF:[-20,-60], look:[8,4] }]]; const o = dexAt(K, t, () => ({ x: dexX(t), y: GY + 30 }), { s: DS }); o.legL = [Math.sin(ph)*16, 0]; o.legR = [-Math.sin(ph)*16, 0];
      return site(t, L, 'b2', .5) + L(1, chibi2(o)) + chipAt(t, .8, 960, 130, 'WHAT IS INVINCIBLE FOR?', '#3D8BFF', 56); } },
  { t: 3.9, ref: RB, cam: [[3.9, { x: 200, y: GY - 300, z: 1.0, r: 0 }], [6.0, { x: 500, y: GY - 560, z: 1.1, r: -2 }, 'io'], [6.6, { x: 520, y: GY - 580, z: 1.12, r: -2 }]], draw: (t, c, L) =>
      site(t, L) + L(1, plank(t) + bricksFalling(t) + kid(t) + dex([[0, 'idle']], t, dexX(3.6), GY + 30)) + chipAt(t, ST[1] + .3, 960, 130, 'BUILDING SITE', '#FFC21F', 52) },
  { t: 6.6, ref: RB, cam: push(6.6, SLIP + .1, { x: SPOT, y: PLANK - 40, z: 2.6, r: 3 }, { x: SPOT, y: PLANK - 40, z: 2.9, r: 5 }, 'in'), draw: (t, c, L) =>
      site(t, L, 'b8') + L(1, plank(t) + bricksFalling(t) + (t > SLIP - .5 ? `<path d="M${SPOT - 170},${PLANK - 30} l-20,-20 M${SPOT - 160},${PLANK - 50} l-10,-30" stroke="${INK}" stroke-width="5"/>` : '')) + bang(t, SLIP - .4, 1300, 300, 'CREAK…', '#FFF07A', 80, -6) },
  { t: SLIP + .1, ref: RB, cam: push(SLIP + .1, 9.6, { x: SPOT - 100, y: GY - 420, z: 1.2, r: -4 }, { x: SPOT - 150, y: GY - 400, z: 1.3, r: -5 }, 'lin'), draw: (t, c, L) =>
      site(t, L) + L(1, bricksFalling(t) + kid(t)) + chipAt(t, 8.9, 1450, 220, 'A KID WALKING PAST', '#E8463C', 50) },
  { t: 9.6, ref: RB, cam: push(9.6, ST[2] - .1, { x: dexX(9.6), y: GY - 260, z: 2.8, r: 0 }, { x: dexX(9.6), y: GY - 260, z: 3.2, r: -3 }, 'in'), draw: (t, c, L) =>
      site(t, L, 'b14') + L(1, dex([[0, { ...POSES.lookR, look:[10,-10] }], [10.1, { ...POSES.surprise, eyes:'wide', look:[10,-12], sweat:true }, 'snap']], t, dexX(9.6), GY + 30)) + (t > 10.1 ? focusLines(t, 960, 470, .4, 420) : '') },
  // slow motion: thinking it through
  { t: ST[2] - .1, ref: RB, cam: push(ST[2] - .1, 13.1, { x: 300, y: GY - 420, z: 1.05, r: 0 }, { x: 330, y: GY - 420, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) =>
      site(t, L) + L(1, bricksFalling(t) + kid(t) + dex([[0, { ...POSES.surprise, eyes:'wide', look:[10,-10] }]], t, dexX(9.6), GY + 30)) + chipAt(t, ST[2] + .8, 420, 260, 'CATCH THEM? ✗', '#E8463C', 50) + chipAt(t, ST[2] + 1.8, 420, 360, 'STOP THEM? ✗', '#E8463C', 50) },
  { t: 13.1, ref: RB, cam: push(13.1, 14.9, { x: dexX(13), y: GY - 260, z: 2.6, r: 2 }, { x: dexX(13), y: GY - 260, z: 2.9, r: 2 }, 'lin'), draw: (t, c, L) =>
      site(t, L, 'b14') + L(1, dex([[0, { ...POSES.surprise, eyes:'wide', look:[10,-10] }], [13.8, { ...POSES.ready, eyes:'determined', mouth:'smirk', browA:16, look:[8,0] }, 'o']], t, dexX(13), GY + 30)) + chipAt(t, ST[2] + 3.2, 1350, 220, 'DOESN’T NEED TO', '#7ED957', 56) },
  { t: 14.9, ref: RB, cam: push(14.9, RUN0, { x: dexX(14.9) + 60, y: GY - 200, z: 2.0, r: -4 }, { x: dexX(14.9) + 60, y: GY - 200, z: 2.1, r: -6 }, 'in'), draw: (t, c, L) =>
      site(t, L, 'b4') + L(1, dex([[0, { ...POSES.ready, eyes:'determined', browA:16 }], [15.8, { ...POSES.crouchPop, eyes:'determined', mouth:'grit', browA:18 }, 'io']], t, dexX(14.9), GY + 30)) },
  // the sprint and the gentle push
  { t: RUN0, ref: RB, cam: t => ({ x: dexX(t) + 260, y: GY - 300, z: 1.35, r: -3 }), draw: (t, c, L) => {
      const x = dexX(t), runner = chibiSide2({ x, y: GY + 30, s: DS, phase: (t*3.4) % 1, t, expr: 'determined', lean: 22, wind: 1.2 });
      return site(t, L, 'mb1') + L(1, bricksFalling(t) + kid(t) + runner) + speedLines(t, 16, .45, '#FFFFFF', -1); } },
  { t: PUSH, ref: RB, cam: push(PUSH, 19.3, { x: SPOT, y: GY - 300, z: 1.55, r: 0 }, { x: SPOT + 60, y: GY - 300, z: 1.65, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[PUSH, { ...POSES.point, armF:[90,-10], armLen:1.3, handF:null, lean:10, eyes:'determined', mouth:'smile' }], [PUSH + .6, { ...POSES.smile, look:[10,0] }, 'o']];
      return site(t, L, 'b2') + L(1, bricksFalling(t) + kid(t) + dexP(K, t, () => ({ x: dexX(t), y: GY + 30 }))) + bang(t, PUSH, 1300, 330, 'GENTLE PUSH', '#7ED957', 64, -6, PUSH + 1.3); } },
  { t: 19.3, ref: RB, cam: push(19.3, HIT, { x: SPOT, y: GY - 360, z: 1.6, r: 8 }, { x: SPOT, y: GY - 400, z: 1.9, r: 10 }, 'in'), draw: (t, c, L) =>
      site(t, L, 'b2') + L(1, dex([[0, { ...POSES.lookCam, look:[0,-14], tilt:-8 }], [20.0, { ...POSES.smile, eyes:'closed', mouth:'smile', look:[0,-10] }, 'o']], t, SPOT, GY + 30) + bricksFalling(t)) },
  // the hit
  { t: HIT, ref: RB, cam: push(HIT, 23.2, { x: SPOT, y: GY - 260, z: 1.45, r: -3 }, { x: SPOT, y: GY - 260, z: 1.55, r: -2 }, 'lin'), draw: (t, c, L) => {
      const f = Math.floor((t - HIT)*30);
      let fr = site(t, L) + L(1, chibi2(dexAt([[0, { ...POSES.sunk, eyes:'dot', mouth:'o' }]], t, () => ({ x: SPOT, y: GY + 70*DS }), { s: DS, air: true, noShadow: true, rot: -88 })) + bricksPile(t) + stars(SPOT - 220, GY - 120, t, 5, 80) + dust(SPOT, GY, t, HIT, 14, 1.6, '#C9B9A6', 1.2) + kid(t));
      if (f < 3) fr = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${fr}${focusLines(t, 960, 560, 1, 300)}</g>`;
      return fr + bang(t, HIT, 1250, 330, 'BONK BONK BONK', '#FFC21F', 90, -6, HIT + 1.6); } },
  { t: 23.2, ref: RB, cam: push(23.2, GETUP, { x: SPOT - 120, y: GY - 80, z: 2.6, r: 3 }, { x: SPOT - 120, y: GY - 80, z: 2.8, r: 3 }, 'lin'), draw: (t, c, L) =>
      site(t, L, 'b8') + L(1, chibi2(dexAt([[0, { ...POSES.sunk, eyes:'swirl', mouth:'wobble' }]], t, () => ({ x: SPOT, y: GY + 70*DS }), { s: DS, air: true, noShadow: true, rot: -88 })) + bricksPile(t) + stars(SPOT - 220, GY - 120, t, 5, 80)) },
  { t: GETUP, ref: RB, cam: push(GETUP, WR, { x: SPOT + 160, y: GY - 300, z: 1.45, r: 0 }, { x: SPOT + 160, y: GY - 300, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) => {
      const a = GETUP, lying = t < a + .3, K = [[0, 'sunk'], [a + .2, 'crouchPop', 'snap'], [a + .35, 'popJump', 'snap', .1], [a + .65, 'landSquash', 'in', .1], [a + .95, 'peace', 'o2', .2]];
      const pos = tt => { const k = seg(tt, a + .35, a + .65); return tt < a + .35 ? { x: SPOT, y: GY + (tt < a + .3 ? 70*DS : 0) } : { x: SPOT, y: GY - 160*4*k*(1 - k) }; };
      const o = dexAt(K, t, pos, { s: DS, seed: 4, rot: lying ? lerp(-88, 0, E.in(seg(t, a, a + .3))) : 0, air: lying || (t > a + .35 && t < a + .65) });
      return site(t, L) + L(1, bricksPile(t) + chibi2(o) + kid(t) + (t > a + 1 ? sparkles(SPOT, GY - 250, t, 5, 200) : '')) + chipAt(t, GETUP + .4, 560, 200, 'NOT A SCRATCH', '#7ED957', 60); } },
  // the real power
  { t: WR, ref: RB, cam: push(WR, END, { x: SPOT + 200, y: GY - 330, z: 1.35, r: -2 }, { x: SPOT + 200, y: GY - 360, z: 1.6, r: 0 }, 'io'), draw: (t, c, L) => {
      let rays = ''; for (let i = 0; i < 9; i++) rays += `<path d="M-1600,-600 L${-200 + i*420},${GY + 200} L${-80 + i*420},${GY + 200} Z" fill="#FFE6A8" opacity="${.07 + .03*Math.sin(t + i)}"/>`;
      return site(t, L, '', 1) + L(1, bricksPile(t) + rays + dex([[0, { ...POSES.lookCam, sparkle:true }], [ST[5] + 2.5, { ...POSES.confident, eyes:'happy', mouth:'smile' }, 'o']], t, SPOT, GY + 30) + chibi2(dexAt([[0, { ...POSES.wave, eyes:'happy', mouth:'grin' }]], t, () => ({ x: SPOT + 420, y: GY + 30 }), { ...KID, s: .78, seed: 13, flip: true }))) +
        `<g transform="translate(960,170) scale(${pop(t, ST[5] + 1.6, .35)})">${txt('THE REAL POWER:', 0, 0, 70, '#FFFFFF')}${txt('STANDING IN THE WAY', 0, 100, 96, '#FFC21F')}</g>`; } },
];
function scene(t) {
  let s = playShots(t, SHOTS_R, [[HIT, 30, .6], [SLIP, 4, .3]]);
  if (slowmo(t)) s += `<rect width="1920" height="1080" fill="#7FD3FF" opacity=".14"/><text x="70" y="110" font-family="Lilita One" font-size="52" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke">SLOW-MO</text>`;
  return s + vignette() + wipe(t, WR);
}
