// RIG2
// Ep2 cold open, Rig 2.0. Narration timing from t_c.js (ST/DU), END 45.47.
// 0 alarm/bed  1 stairs  2 gets up  3 bee  4 INVINCIBLE  5 safest/weirder  6 montage  7 question  + title card
const W1 = ST[1] - .2, W3 = ST[3] - .2, W4 = ST[4] - .2, W7 = ST[7] - .1, TT = ST[7] + DU[7] + .15;
const RR = { x: 0, y: 700, z: 1 };                         // room/studio reference
const BED = -560, BEDY = GY - 60;                          // bed (left end x, floor line)
// ---------------------------------------------------------------- bedroom
function bedroom(t, L, c, blur='') {
  let back = roomW(t) + windowW(260, 250, 380, 300, t) + posterW(-780, 420, 300, 380, 'DAY 1 ✓', '#3D8BFF', -4) + shelfW(820, 470) + posterW(1300, 380, 220, 280, 'RUN!', '#E8463C', 5);
  back += `<path d="M420,${GY-140} L520,550 L640,550 L740,${GY-140} Z" fill="#FFF6C8" opacity=".18"/>`;   // sun shaft
  // poster art: a tiny running Dex silhouette
  back += `<g transform="translate(-780,380) rotate(-4) scale(.5)">${chibiSide2({ x: 0, y: 40, s: .75, phase: .3, t: 0, lean: 18, wind: 1.4, mouth: 'grin' })}</g>`;
  const table = `<g transform="translate(330,${GY-60})"><rect x="-90" y="-200" width="180" height="200" rx="8" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="-70" y="-150" width="140" height="44" rx="6" fill="#C99A68" stroke="${INK}" stroke-width="4"/><circle cy="-128" r="6" fill="${INK}"/></g>`;
  return L(1, back, blur) + L(1, bedW(BED, BEDY, t) + table, blur);
}
function alarm(t, x, y, s) {
  const ring = t < 1.9, j = ring ? Math.sin(t*70)*7 : 0;
  return `<g transform="translate(${x + j},${y}) rotate(${j}) scale(${s})"><circle cx="-40" cy="-50" r="18" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-50" r="18" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle r="58" fill="#E8463C" stroke="${INK}" stroke-width="7"/><circle r="42" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0,0 L0,-28 M0,0 L20,8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-36,52 L-46,70 M36,52 L46,70" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>${ring ? [0,1,2].map(i => `<path d="M${70 + i*18},${-30 - i*6} q14,30 0,60" stroke="${INK}" stroke-width="5" fill="none" opacity="${.5 + .5*Math.sin(t*30 + i)}"/>`).join('') : ''}</g>`;
}
// Dex in bed: lying (rot -90) -> sits up (rot 0). Blanket hides the legs.
const BEDK = [[0,{eyes:'closed', mouth:'flat', armF:[30,40], armB:[-20,-30]}], [1.9,{eyes:'closed', mouth:'flat', armF:[30,40]}], [2.3,{eyes:'squeeze', mouth:'wobble', armF:[140,40], armB:[-20,-30]}, 'snap'],
  [2.9,{eyes:'open', mouth:'flat', brow:4}], [3.7,{eyes:'closed', mouth:'yawn', armF:[124,30], armB:[-124,-30], sq:1.05}, 'o'], [4.6,{eyes:'happy', mouth:'grin', armF:[-10,10], armB:[10,-10]}, 'o'],
  [5.3,'think','o'], [6.0,{...POSES.surprise, look:[-6,6]}, 'o']];
function dexBed(t) {
  const up = E.io(seg(t, 3.2, 3.8)), rot = lerp(-90, 0, up), y = lerp(GY - 128, GY - 154, up), x = lerp(BED + 300, BED + 250, up);
  const o = dexAt(BEDK, t, () => ({ x, y }), { s: DS, seed: 2, air: true, noShadow: true, rot });
  return chibi2(o);
}
function cover(t) {   // duvet over Dex: puffy while he's lying, slides down as he sits up
  const up = E.io(seg(t, 3.2, 3.8)), top = lerp(GY - 360, GY - 240, up), x0 = BED + lerp(270, 150, up);
  return `<path d="M${x0},${top + 40} Q${x0 + 40},${top} ${x0 + 160},${top + 6} Q${BED + 520},${top - 14 + 14*Math.sin(t*2.1)} ${BED + 760},${GY - 230} L${BED + 760},${BEDY - 40} L${x0 - 20},${BEDY - 40} Q${x0 - 40},${top + 120} ${x0},${top + 40} Z" fill="#7FB3FF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${x0 + 60},${top + 60} Q${BED + 500},${top + 40} ${BED + 740},${top + 80}" stroke="#5F94E8" stroke-width="9" fill="none" opacity=".6"/>`;
}
// ---------------------------------------------------------------- stairs (8 steps down to the right)
const SX0 = -700, SY0 = GY - 8*65, STEP = 150, RISE = 65;
const TA = ST[1] + .1, TB = ST[1] + 2.9;                   // tumble window (8 bonks)
function stairsW(t) {
  let s = roomW(t, { wall: '#EBD9F7', stripe: '#E0C9F3', floor: '#C99E73' });
  s += posterW(-300, 300, 220, 170, 'HOME', '#7ED957', 3) + posterW(380, 520, 200, 160, '★', '#FFC21F', -4);
  s += `<path d="M${SX0-900},${SY0} L${SX0},${SY0}` + [...Array(8)].map((_, i) => ` L${SX0 + i*STEP},${SY0 + (i+1)*RISE} L${SX0 + (i+1)*STEP},${SY0 + (i+1)*RISE}`).join('') + ` L${SX0 + 8*STEP + 2600},${GY} L${SX0 + 8*STEP + 2600},${GY + 900} L${SX0 - 900},${GY + 900} Z" fill="#B9865A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  for (let i = 0; i < 8; i++) s += `<rect x="${SX0 + i*STEP}" y="${SY0 + (i+1)*RISE}" width="${STEP}" height="12" fill="#D9A866" stroke="${INK}" stroke-width="4"/>`;
  // banister
  s += `<path d="M${SX0 - 40},${SY0 - 170} L${SX0 + 8*STEP},${GY - 170}" stroke="#8A5A3B" stroke-width="18" stroke-linecap="round"/>`;
  for (let i = 0; i <= 8; i++) s += `<rect x="${SX0 + i*STEP - 6}" y="${SY0 + i*RISE - 165}" width="12" height="${165}" fill="#8A5A3B"/>`;
  return s;
}
function tumble(t) { const k = seg(t, TA, TB)*8, i = Math.min(7, Math.floor(k)), f = k - i;
  return { x: SX0 + k*STEP + 40, y: SY0 + (i + 1)*RISE - Math.sin(f*Math.PI)*90, rot: k*220, k }; }
// ---------------------------------------------------------------- garden
function garden(t, L, blur='') {
  let mid = hills(t, 760, false) + fence(GY - 40) + bush(-900, GY - 40, 1.2) + bush(700, GY - 40, 1) + bush(1500, GY - 40, 1.3) + tree(-1500, GY - 40, 1.4);
  let near = grassGround(GY - 40);
  for (let i = 0; i < 14; i++) near += flower(-1600 + i*260 + (i*53 % 90), GY + 60 + (i%3)*60, t, ['#FF7EB6','#FFD23F','#B07CFF','#FF8A3D'][i%4]);
  return L(0, skyW(t, 1100, 120)) + L(.5, mid, blur) + L(1, near, blur && 'b2');
}
// ---------------------------------------------------------------- shots
const SHOTS_C = [
  // 0 alarm close-up
  { t: 0, ref: RR, cam: push(0, 1.6, { x: 330, y: GY - 300, z: 3.2, r: 4 }, { x: 330, y: GY - 300, z: 3.6, r: 2 }), draw: (t, c, L) =>
      bedroom(t, L, c, 'b8') + L(1, alarm(t, 330, GY - 318, 1.2)) + bang(t, .3, 1350, 330, 'RING!', '#E8463C', 120, 10, 1.7) },
  // 1 poster (yesterday) -> pan to bed
  { t: 1.6, ref: RR, cam: [[1.6, { x: -780, y: 430, z: 2.2, r: 0 }], [2.4, { x: -760, y: 440, z: 2.1, r: 0 }], [3.15, { x: -200, y: GY - 300, z: 1.45, r: 0 }, 'io']], draw: (t, c, L) =>
      bedroom(t, L, c) + L(1, dexBed(t) + cover(t) + alarm(t, 330, GY - 318, .9)) + chipAt(t, 1.9, 520, 150, 'YESTERDAY: SUPER SPEED', '#3D8BFF', 50, 3.1) },
  // 2 sit-up + stretch, medium
  { t: 3.15, ref: RR, cam: push(3.15, 5.1, { x: -260, y: GY - 360, z: 1.75, r: -2 }, { x: -280, y: GY - 380, z: 1.9, r: -1 }, 'lin'), draw: (t, c, L) =>
      bedroom(t, L, c, 'b4') + L(1, dexBed(t) + cover(t)) + chipAt(t, 3.3, 960, 130, 'DAY 2', '#3D8BFF', 64) },
  // 3 "something completely different": close-up, a shimmer runs over him
  { t: 5.1, ref: RR, cam: push(5.1, W1, { x: -300, y: GY - 400, z: 2.7, r: 2 }, { x: -300, y: GY - 410, z: 3.1, r: 3 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, 5.6, 6.4);
      return bedroom(t, L, c, 'b8') + L(1, dexBed(t) + cover(t) + (k > 0 && k < 1 ? `<rect x="${-560 + k*560}" y="${GY - 700}" width="70" height="700" fill="#fff" opacity=".55" transform="skewX(-20)" filter="url(#b4)"/>` : '') + (t > 6.2 ? sparkles(-300, GY - 420, t, 5, 150) : '')) +
        (t > 5.5 ? `<g transform="translate(1450,300) scale(${pop(t, 5.5, .3)})">${txt('?', 0, 0, 160, '#FFC21F')}</g>` : ''); } },
  // 4 stairs: top, foot catches
  { t: W1, ref: RR, cam: push(W1, TA + .25, { x: SX0 - 140, y: SY0 - 200, z: 1.9, r: -3 }, { x: SX0 - 80, y: SY0 - 190, z: 2.1, r: -5 }, 'in'), draw: (t, c, L) => {
      const K = [[W1,'idle'], [ST[1] - .05,'lookR'], [TA,{ ...POSES.surprise, legR:[60,-40], lean:14 }, 'snap']];
      return L(1, stairsW(t), 'b2') + L(1, dexP(K, t, () => ({ x: SX0 - 120 + seg(t, W1, TA)*90, y: SY0 }))); } },
  // 5 the tumble: wide follow, one bonk per step
  { t: TA + .25, ref: RR, cam: t => { const p = tumble(t - .08); return { x: p.x + 40, y: p.y - 160, z: 1.6, r: -6 }; }, draw: (t, c, L) => {
      const p = tumble(t), K = [[0,'launch'], [9,'flailB']];
      const o = dexAt(K, t, () => ({ x: p.x, y: p.y }), { s: DS, air: true, rot: p.rot, seed: 5 });
      o.armF = [o.armF[0] + Math.sin(t*30)*20, o.armF[1]]; o.eyes = 'shock';
      let fx = ''; for (let j = 0; j < 8; j++) { const tt = TA + (j + .5)*(TB - TA)/8; fx += bang(t, tt, 0, 0, 'BONK', '#FFC21F', 70, -10 + j*4, tt + .3).replace('translate(0,0)', `translate(${960 + (j%2 ? 260 : -300)},${260 + (j%3)*60})`); }
      return L(1, stairsW(t)) + L(1, chibi2(o)) + fx; } },
  // 6 flat on the floor, dizzy (floor-level close)
  { t: TB, ref: RR, cam: push(TB, ST[2], { x: SX0 + 8*STEP + 380, y: GY - 140, z: 2.4, r: 3 }, { x: SX0 + 8*STEP + 380, y: GY - 140, z: 2.6, r: 3 }, 'lin'), draw: (t, c, L) => {
      const x = SX0 + 8*STEP + 380;
      const o = dexAt([[0, 'sunk']], t, () => ({ x, y: GY + 70*DS }), { s: DS, air: true, noShadow: true, rot: -84, seed: 6 });
      return L(1, stairsW(t), 'b4') + L(1, `<ellipse cx="${x}" cy="${GY + 6}" rx="230" ry="18" fill="#0B0E2A" opacity=".2"/>` + chibi2(o) + stars(x - 220, GY - 130, t, 5, 70)); } },
  // 7 pops up: "without a single scratch" (low angle)
  { t: ST[2], ref: RR, cam: push(ST[2], W3, { x: SX0 + 8*STEP + 420, y: GY - 300, z: 1.75, r: -4 }, { x: SX0 + 8*STEP + 420, y: GY - 300, z: 1.9, r: -2 }, 'lin'), draw: (t, c, L) => {
      const x = SX0 + 8*STEP + 400, a = ST[2];
      const lying = t < a + .45, pos = tt => { if (tt < a + .45) return { x, y: GY + 70*DS }; const k = seg(tt, a + .45, a + .85); return { x, y: GY - 150*4*k*(1 - k) }; };
      const K = [[a,'sunk'], [a + .35,'crouchPop','snap'], [a + .5,'popJump','snap', .1], [a + .8,'popJump'], [a + .9,'landSquash','in', .1], [a + 1.25,'peace','o2', .2]];
      const o = dexAt(K, t, pos, { s: DS, seed: 6, rot: lying ? lerp(-84, 0, E.in(seg(t, a + .2, a + .45))) : 0, air: lying || (t > a + .45 && t < a + .85) });
      return L(1, stairsW(t), 'b4') + L(1, chibi2(o) + dust(x, GY, t, a + .87, 8, .8)) + chipAt(t, ST[2] + .9, 1350, 220, 'SCRATCHES: 0', '#7ED957', 62) + (t > a + 1.3 ? sparkles(960, 330, t, 5, 200) : ''); } },
  // 8 bee approaches (garden medium)
  { t: W3, ref: RR, cam: push(W3, ST[3] + .95, { x: 120, y: GY - 260, z: 1.6, r: 0 }, { x: 160, y: GY - 270, z: 1.75, r: 2 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, ST[3] - .1, ST[3] + 1.0), bx = lerp(1300, 220, E.io(k)) + Math.sin(t*9)*30, by = lerp(GY - 650, GY - 330, E.io(k)) + Math.sin(t*13)*25;
      const K = [[W3,'idle'], [ST[3] + .4,{ ...POSES.lookR, look:[10,-4] }], [ST[3] + .9,{ ...POSES.lookR, eyes:'wide', look:[10,0] }]];
      return garden(t, L) + L(1, dex(K, t, 0, GY) + `<g transform="translate(${bx},${by})">${bee(0, 0, .9, t, -20)}<path d="M50,30 l38,22" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`); } },
  // 9 extreme close-up: the sting, the stinger bends
  { t: ST[3] + .95, ref: RR, cam: push(ST[3] + .95, ST[3] + 1.8, { x: 70, y: GY - 230, z: 3.6, r: -4 }, { x: 70, y: GY - 230, z: 4.1, r: -6 }, 'in'), draw: (t, c, L) => {
      const hit = ST[3] + 1.3, bent = t > hit, jab = t < hit ? lerp(160, 95, E.in(seg(t, ST[3] + .95, hit))) : 95 + 10*Math.exp(-(t - hit)*8);
      const bx = jab + 70, by = GY - 250;
      return garden(t, L, 'b8') + L(1, dex([[0, { ...POSES.lookR, look:[10,2], eyes: t > hit + .1 ? 'wide' : 'open' }]], t, 0, GY) + `<g transform="translate(${bx},${by}) scale(-1,1)">${bee(0, 0, .9, t, -20)}<path d="${bent ? `M50,30 q20,10 10,${30*Math.min(1, (t - hit)*8)} q-8,14 -26,6` : 'M50,30 l38,22'}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`) +
        bang(t, hit, 1400, 250, 'BOING!', '#FFC21F', 110, -8) + (bent ? focusLines(t, 900, 520, .35*(1 - seg(t, hit, hit + .4)), 380) : ''); } },
  // 10 reaction two-shot: confused bee, Dex shrugs
  { t: ST[3] + 1.8, ref: RR, cam: push(ST[3] + 1.8, W4, { x: 200, y: GY - 300, z: 1.9, r: 0 }, { x: 200, y: GY - 300, z: 2.0, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0,{ ...POSES.lookR, look:[10,-2] }], [ST[3] + 2.2, { ...POSES.shrug, look:[10,-2] }, 'o']];
      return garden(t, L, 'b4') + L(1, dex(K, t, 0, GY) + `<g transform="translate(${430 + Math.sin(t*5)*8},${GY - 420 + Math.sin(t*7)*10}) scale(-1,1)">${bee(0, 0, 1.1, t, 10)}<path d="M50,30 q20,10 10,30 q-8,14 -26,6" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`) +
        (t > ST[3] + 2.0 ? `<g transform="translate(1250,280) scale(${pop(t, ST[3] + 2.0, .3)})">${txt('?', 0, 0, 120, '#fff')}</g>` : ''); } },
  // 11 INVINCIBLE: low-angle hero push
  { t: W4, ref: RR, cam: push(W4, ST[4] + 1.9, { x: 0, y: GY - 260, z: 1.65, r: -5 }, { x: 0, y: GY - 240, z: 1.9, r: -3 }, 'o'), draw: (t, c, L) => {
      const K = [[W4,'ready'], [ST[4] + .3,'confident','o']];
      return L(0, studioBack(t)) + L(1, studioFloor() + `<circle cx="0" cy="${GY - 200}" r="${330 + 10*Math.sin(t*4)}" fill="#7FD3FF" opacity=".14"/>` + dex(K, t, 0, GY, { sparkle: true })) +
        title(t, ST[4] + .3, 960, 210, 'INVINCIBLE', '#FFC21F', 170) + flash(t, ST[4] + .3, '#fff', .3, .7); } },
  // 12 cut / crush / burn inserts
  { t: ST[4] + 1.9, ref: RR, cam: t => { const i = Math.max(0, Math.min(2, Math.floor((t - ST[4] - 1.9)/.9))); return [{ x: 120, y: GY - 200, z: 2.6, r: 6 }, { x: 60, y: GY - 330, z: 1.7, r: -4 }, { x: 140, y: GY - 230, z: 2.5, r: -5 }][i]; }, draw: (t, c, L) => {
      const i = Math.max(0, Math.min(2, Math.floor((t - ST[4] - 1.9)/.9))), t0 = ST[4] + 1.9 + i*.9, k = seg(t, t0, t0 + .5);
      let w = studioFloor();
      if (i === 0) { w += dex([[0, { ...POSES.point, armF:[80,-10], eyes:'happy', mouth:'grin' }]], t, 0, GY) + `<g transform="translate(330,${GY - 175}) scale(-1,1)">${scissors(0, 0, 1, 1 - E.snap(k), k > .6 ? (k - .6)*2.5 : 0)}</g>`; }
      if (i === 1) { const wy = lerp(GY - 820, GY - 380, E.in(seg(t, t0, t0 + .3))) - (t > t0 + .3 ? 160*Math.sin(seg(t, t0 + .3, t0 + .8)*Math.PI) : 0);
        w += dex([[0, { ...POSES.smile, sq: t > t0 + .3 && t < t0 + .45 ? .8 : 1 }]], t, 0, GY) + weight(t > t0 + .3 ? 260*seg(t, t0 + .3, t0 + .8) : 0, wy, .8); }
      if (i === 2) { w += dex([[0, { ...POSES.shrug, eyes:'happy', mouth:'smirk' }]], t, 0, GY) + flame(115, GY - 160, .6 + .1*Math.sin(t*20), t); }
      return L(0, studioBack(t)) + L(1, w) + chipAt(t, t0 + .1, 960, 150, ['NO CUTS', 'NO CRUSHING', 'NO BURNS'][i], '#7ED957', 64) + flash(t, t0, '#fff', .12, .4); } },
  // 13 safest power ever? (orbit with a shield halo)
  { t: ST[5] - .25, ref: RR, cam: push(ST[5] - .25, ST[5] + 2.9, { x: -120, y: GY - 260, z: 1.75, r: 3 }, { x: 120, y: GY - 250, z: 1.9, r: -3 }, 'io'), draw: (t, c, L) => {
      const K = [[0,'confident'], [ST[5] + 1.3,{ ...POSES.idleB, eyes:'happy', mouth:'grin', armF:[48,-112], armB:[-48,112] }, 'o']];
      let shield = ''; const k = E.o(seg(t, ST[5] + .2, ST[5] + .8));
      for (let i = 0; i < 18; i++) { const a = i/18*6.283; shield += `<path transform="translate(${Math.cos(a)*250*k},${GY - 190 + Math.sin(a)*250*k})" d="M0,-26 L23,-13 L23,13 L0,26 L-23,13 L-23,-13 Z" fill="#7FD3FF" opacity="${.18 + .12*Math.sin(t*4 + i)}" stroke="#BFE6FF" stroke-width="3"/>`; }
      return L(0, studioBack(t)) + L(1, studioFloor() + shield + dex(K, t, 0, GY)) + chipAt(t, ST[5] + .3, 960, 150, 'SAFEST POWER EVER?', '#3D8BFF', 64); } },
  // 14 "way weirder": push to face, WEIRDER stamp, physics doodles
  { t: ST[5] + 2.9, ref: RR, cam: push(ST[5] + 2.9, ST[6] - .2, { x: 0, y: GY - 330, z: 2.4, r: 0 }, { x: 0, y: GY - 300, z: 3.0, r: 4 }, 'in'), draw: (t, c, L) => {
      const K = [[0,'confident'], [ST[5] + 4.6,{ ...POSES.surprise, eyes:'wide', mouth:'wobble', sweat:true }, 'snap']];
      let doodles = ''; ['F = ma', 'p = mv', 'g ≈ 9.8 m/s²', 'ρ = m/V'].forEach((f, i) => { const a = i*1.57 + t*.6; doodles += `<text x="${Math.cos(a)*380}" y="${GY - 300 + Math.sin(a)*170}" text-anchor="middle" font-family="Lilita One" font-size="46" fill="#BFE6FF" opacity="${seg(t, ST[5] + 3.0 + i*.2, ST[5] + 3.4 + i*.2)*.8}">${f}</text>`; });
      return L(0, studioBack(t)) + L(1, studioFloor() + doodles + dex(K, t, 0, GY)) +
        (t > ST[5] + 4.6 ? `<g transform="translate(1440,560) rotate(-10) scale(${pop(t, ST[5] + 4.6, .25)})"><rect x="-260" y="-90" width="520" height="180" rx="24" fill="none" stroke="#E8463C" stroke-width="16"/>${txt('WEIRDER.', 0, 40, 110, '#E8463C')}</g>` : '') + flash(t, ST[5] + 4.6, '#fff', .15, .4); } },
  // 15 montage: car / lightning / lava / no parachute
  { t: ST[6] - .2, ref: RR, cam: t => { const sp = (W7 - ST[6])/4, i = Math.max(0, Math.min(3, Math.floor((t - ST[6])/sp))), lt = Math.max(0, t - ST[6] - i*sp);
      return [{ x: 100, y: GY - 260, z: 1.3 + lt*.12, r: -4 }, { x: 0, y: GY - 330, z: 1.35 + lt*.12, r: 3 }, { x: 0, y: GY - 120, z: 1.6 + lt*.1, r: -3 }, { x: 0, y: 0, z: 1.4 + lt*.1, r: 6 }][i]; }, draw: (t, c, L) => {
      const sp = (W7 - ST[6])/4, i = Math.max(0, Math.min(3, Math.floor((t - ST[6])/sp))), t0 = ST[6] + i*sp, lt = Math.max(0, t - t0);
      let s = '';
      if (i === 0) { const hit = t0 + .5, f = seg(t, hit, hit + 1.4), cx = lerp(1600, 360, E.in(seg(t, t0, hit))) - (t > hit ? 300*f : 0);
        const p = t < hit ? { x: 0, y: GY } : { x: -900*f, y: GY - 420*4*f*(1 - f) - 20 };
        const o = dexAt([[0, 'ready'], [hit, 'launch', 'snap'], [hit + .4, 'flailA'], [hit + .8, 'flailB']], t, () => p, { s: DS, air: t > hit, rot: t > hit ? -500*f : 0 });
        s = L(0, skyW(t)) + L(.5, cityFar(t, 830) + hills(t, 800, false), 'b4') + L(1, streetGround() + carSide2(cx, GY - 30*1.55 + 40, 1.55, t, { wr: t*900, dent: t > hit ? 1 : 0, col: '#E8463C' }) + chibi2(o)) + (t > hit && t < hit + .1 ? focusLines(t, 960, 540, 1, 300) : ''); }
      if (i === 1) { const strike = t0 + .45;
        s = L(0, `<rect x="-6000" y="-6000" width="12000" height="12000" fill="#2B2F5A"/>` + [...Array(6)].map((_, j) => `<g opacity=".9">${cloud(-1600 + j*620 + Math.sin(t + j)*40, 120 + (j%2)*80, 2.2)}</g>`).join('').replace(/fill="#fff"/g, 'fill="#5A6090"')) +
          L(1, `<rect x="-6000" y="${GY - 40}" width="12000" height="900" fill="#2F6B45"/>` + (t > strike && t < strike + .6 ? bolt(140, -900, 20, GY - 250, t, 3) : '') + dex([[0, 'worried'], [strike, { ...POSES.impact, eyes:'shock' }, 'snap'], [strike + .5, { ...POSES.surprise, eyes:'dot' }]], t, 0, GY, { top: t > strike ? '#4A3B2A' : undefined })) +
          (t > strike && t < strike + .08 ? `<rect width="1920" height="1080" fill="#fff"/>` : ''); }
      if (i === 2) s = L(0, `<rect x="-6000" y="-6000" width="12000" height="12000" fill="#3A1D2A"/><circle cx="0" cy="${GY - 200}" r="1400" fill="#FF6A2A" opacity=".25"/>`) + L(1, lavaW(t, GY - 40) + `<ellipse cx="0" cy="${GY - 40}" rx="300" ry="30" fill="#FFC34D" opacity=".6"/><g transform="translate(0,${GY + 28 + Math.sin(t*2)*8})">${chibi2({ ...DEX2, ...mixPose(POSES.smile, POSES.smile, 1), armF:[124,30], armB:[-124,-30], x: 0, y: 70*DS, s: DS, t, air: true, noShadow: true, rot: -90 })}</g>` + smoke(0, GY - 120, t, 4, 1.2));
      if (i === 3) { const o = dexAt([[0, { ...POSES.cheer, mouth:'laugh', eyes:'happy', legL:[-48,30], legR:[48,-30] }]], t, () => ({ x: 0, y: 160 }), { s: DS, air: true, wind: -1.2, rot: -14 + Math.sin(t*2)*8 });
        o.armF = [o.armF[0] + Math.sin(t*20)*8, o.armF[1]]; s = L(0, skyFall(t, 1400)) + L(1, chibi2(o)) + speedLines(t, 20, .5, '#FFFFFF', 1).replace(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.-]+)" height="([\d.-]+)"/g, (m, x, y, w, h) => `<rect x="${y*1.78}" y="${x*.45}" width="${h}" height="${w}"`); }
      const P = [['HIT BY A CAR', '#E8463C'], ['STRUCK BY LIGHTNING', '#B07CFF'], ['DROPPED IN LAVA', '#FF8A3D'], ['NO PARACHUTE', '#3D8BFF']];
      return s + `<g transform="translate(960,140) scale(${pop(t, t0, .2)})">${chip(P[i][0], 0, 0, P[i][1], 66)}</g>` + flash(t, t0, '#fff', .2, .7); } },
  // 16 the question: close on Dex, eye contact
  { t: W7, ref: RR, cam: push(W7, TT, { x: 0, y: GY - 270, z: 2.5, r: 0 }, { x: 0, y: GY - 255, z: 3.1, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0,'lookCam'], [ST[7] + .9,{ ...POSES.lookCam, brow:6, browA:-6, mouth:'smirk', tilt:-6 }, 'o']];
      return garden(t, L, 'b14') + L(1, dex(K, t, 0, GY)); } },
  // 17 title card
  { t: TT, ref: RR, cam: push(TT, END, { x: 0, y: 540, z: 1, r: 0 }, { x: 0, y: 540, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[TT,'crouchPop'], [TT + .5,'popJump','snap', .1], [TT + .75,'landSquash','in', .1], [TT + 1.1,'peace','o2', .2]];
      const pos = tt => { const k = seg(tt, TT + .5, TT + .75); return { x: 650, y: 1260 - (tt < TT + .5 ? 0 : 200*E.snap(seg(tt, TT + .5, TT + .62))) - 80*4*k*(1 - k) }; };
      return L(0, studioBack(t)) + L(1, chibi2(dexAt(K, t, pos, { s: 1.35, seed: 8 }))) +
        title(t, TT, 960, 330, 'WHAT IF YOU WOKE UP', '#FFFFFF', 96) + title(t, TT + .35, 960, 520, 'INVINCIBLE?', '#FFC21F', 190) + chipAt(t, TT + .8, 960, 720, 'DAY 2', '#3D8BFF', 64) + flash(t, TT, '#fff', .3, .6) + (t > TT + 1.2 ? sparkles(1550, 650, t, 5, 110) : ''); } },
];
const SHAKES_C = [[0, 6, 1.6], [TB, 12, .4], [ST[3] + 1.3, 6, .3], [ST[4] + .3, 10, .4], [ST[6] + .5, 26, .5], [ST[6] + 2.43, 22, .5], ...[...Array(8)].map((_, j) => [TA + (j + .5)*(TB - TA)/8, 9, .25])];
function scene(t) {
  let s = playShots(t, SHOTS_C, SHAKES_C) + vignette();
  [W1, W3, W4, W7].forEach(w => s += wipe(t, w));
  return s;
}
