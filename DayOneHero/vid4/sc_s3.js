// RIG2
// Ep4 s3: Rule 3, stay dry. END 70.51  ST=[0.8, 15.27, 27.66, 40.05, 53.99, 67.11]  DU=[12.67, 10.99, 10.99, 8.04, 10.52, 1.6]
function gardenNear(t) { let s = `<rect x="-3000" y="-2000" width="6000" height="${2000 + GY}" fill="#9FD8FF"/>` + hills(t, 760, false) + fence(GY - 40) + bush(-700, GY - 40, 1.3) + bush(520, GY - 40, 1.1) + bush(-60, GY - 40, .9) + tree(1100, GY - 40, 1.3);
  s += grassGround(GY - 40); for (let i = 0; i < 12; i++) s += flower(-1500 + i*270, GY + 40 + (i%3)*50, t, ['#FF7EB6','#FFD23F','#B07CFF','#FF8A3D'][i%4]); return s; }
const RAIN0 = 47.4;
const rx = t => lerp(-1100, 1100, seg(t, 48.2, 66.8));
function rainStreet(t, L, k) {   // the terrace in the rain (k = how wet / dark)
  return L(1, terrace(t)) + L(1, `<rect x="-6000" y="-3000" width="12000" height="7000" fill="#4A5A80" opacity="${.32*k}"/>` + [-900, -200, 600, 1400].map((x, i) => puddle(x, GY - 90 + (i%2)*30, 120 + (i%3)*30, t, i % 2 ? 48.5 : -9)).join(''));
}
const SHOTS_S3 = [
  // 0 a glass of water: see-through, but you can still see it (the straw looks broken)
  { t: 0, ref: RR, cam: push(0, 8.0, { x: 0, y: GY - 420, z: 1.35, r: 0 }, { x: 0, y: GY - 440, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) =>
      kitchen(t, L, 'b4') + L(1, `<rect x="-900" y="${GY - 220}" width="1800" height="30" rx="8" fill="#C08A55" stroke="${INK}" stroke-width="7"/>` + waterGlass(0, GY - 220, 1, t) + dexI([[0, { eyes: 'open', look: [9, 4] }], [4.0, { eyes: 'wide', look: [9, 4] }, 'o']], t, -520, GY)) +
      chipAt(t, 1.0, 960, 120, 'SEE-THROUGH…', '#5CF2FF', 56) + chipAt(t, 3.6, 960, 220, '…BUT NOT INVISIBLE', '#E8463C', 50) + (t > 5.2 ? `<g transform="translate(1340,620) scale(${pop(t, 5.2, .3)})">${txt('BENT?!', 0, 0, 70, '#FFD23F')}</g>` : '') },
  // 1 light bends between air and water: refraction
  { t: 8.0, ref: GC, cam: push(8.0, 15.2, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, rayDiagram(t, 960, 520, 1600, E.io(seg(t, 9.0, 10.0)))) + chipAt(t, 9.6, 1450, 220, 'LIGHT BENDS', '#FFD23F', 52) + chipAt(t, 11.6, 960, 990, 'REFRACTION', '#5CF2FF', 66) },
  // 2 if Dex were just see-through: a shimmering glass-statue Dex
  { t: 15.2, ref: RR, cam: push(15.2, 27.6, { x: 0, y: GY - 330, z: 1.45, r: 0 }, { x: 0, y: GY - 320, z: 1.62, r: -2 }, 'lin'), draw: (t, c, L) => {
      const g = gardenNear(t), o = { ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), ...poseAt([[0, 'idle'], [19.0, 'confident', 'o'], [23.5, { ...POSES.idleB, tilt: 6 }, 'o']], t), x: 0, y: GY, s: DS, t, blink: 0, hoodTip: 0 };
      return L(1, g + glassDex(t, o, g) + (t > 16.0 ? `<ellipse cx="0" cy="${GY + 8}" rx="120" ry="16" fill="#0B0E2A" opacity=".12"/>` : '')) + `<circle cx="1700" cy="120" r="260" fill="url(#sunG)" opacity=".6"/>` +
        chipAt(t, 15.5, 960, 120, 'IF HE WERE JUST SEE-THROUGH', '#5CF2FF', 50) + chipAt(t, 21.5, 960, 980, 'A WOBBLY GLASS-STATUE DEX', '#B07CFF', 50); } },
  // 3 how much things bend light: air vs water vs cornea (vs glass)
  { t: 27.6, ref: GC, cam: push(27.6, 40.0, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, 28.2, 32.0), gap = seg(t, 33.5, 34.3);
      const X = v => 260 + (v - 1)/.5*1400;
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, bendScale(t, 260, 540, 1400, k) + (gap > 0 ? `<path d="M${X(1.02)},470 L${X(1.32)},470" stroke="#E8463C" stroke-width="${14*gap}" stroke-linecap="round"/><g transform="translate(${X(1.17)},420)" opacity="${gap}">${txt('BIG GAP', 0, 0, 60, '#E8463C')}</g>` : '') +
        (t > 29.4 ? `<g transform="translate(${X(1.0)},250) scale(.7)">${chibi4({ ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), eyes: 'open', look: [0, 8], x: 0, y: 260, s: 1, t, inv: true })}</g>` : '')) +
        chipAt(t, 27.8, 960, 110, 'HOW MUCH THINGS BEND LIGHT', '#5CF2FF', 52) + chipAt(t, 30.0, 960, 960, 'TRULY INVISIBLE = BEND LIGHT LIKE AIR', '#7ED957', 44); } },
  // 4 the power closes the gap: no bending, no shimmer, no shadow... then rain
  { t: 40.0, ref: RR, cam: push(40.0, 48.1, { x: 0, y: GY - 360, z: 1.3, r: 0 }, { x: 0, y: GY - 380, z: 1.38, r: 0 }, 'lin'), draw: (t, c, L) => {
      const dark = seg(t, 46.2, 47.4);
      const K = [[0, walkPose(t, 0)], [46.6, { eyes: 'open', look: [0, -9] }, 'o']];
      let s = L(1, terrace(t)) + L(1, `<g transform="translate(-520,${GY - 120})"><rect x="-10" y="-640" width="20" height="640" fill="#2B2F4A"/><ellipse cx="-60" cy="-660" rx="40" ry="14" fill="#2B2F4A"/></g><path d="M-520,${GY - 120} L-160,${GY - 100} L-170,${GY - 80} L-520,${GY - 110} Z" fill="#000" opacity=".2"/>` + slippers(t, 60, GY - 150, 1.05, false) + dexI(K, t, 60, GY - 140));
      s += L(1, `<rect x="-6000" y="-3000" width="12000" height="7000" fill="#4A5A80" opacity="${.32*dark}"/>`) + (dark > 0 ? [...Array(5)].map((_, i) => `<g transform="translate(${lerp(-600 + i*500, 200 + i*420, dark)},${120 + (i%2)*60})">${cloud(0, 0, 2.2).replace(/fill="#fff"/g, 'fill="#8C93B8"')}</g>`).join('') : '');
      return s + chipAt(t, 41.6, 400, 300, 'NO BENDING ✓', '#7ED957', 44) + chipAt(t, 42.4, 400, 390, 'NO SHIMMER ✓', '#7ED957', 44) + chipAt(t, 43.2, 400, 480, 'NO SHADOW ✓', '#7ED957', 44) + chipAt(t, 44.6, 1480, 300, 'ONLY FOR DEX', '#E8463C', 50); } },
  // 5 rain: a Dex-shaped outline of water walks down the street, leaving wet footprints
  { t: 48.1, ref: RR, cam: t => ({ x: rx(t) + 80, y: GY - 360, z: 1.35 + .1*seg(t, 52, 58), r: 0 }), draw: (t, c, L) => {
      const x = rx(t), wk = seg(t, RAIN0 + .6, 50.5);
      const o = { ...DEX2, ...walkPose(t, 7.4), x, y: GY - 100, s: DS, t, blink: 0, hoodTip: 0 };
      let pr = ''; for (let i = 0; i < 40; i++) { const tt = 48.2 + i*.42; if (tt > t) break; const px = rx(tt), age = t - tt; pr += wetPrint(px + (i % 2 ? 26 : -26), GY - 110 + (i % 2 ? 10 : 0), Math.max(0, .8 - age*.08), i % 2); }
      let ppl = ''; [[-400, 0, '#3D8BFF', 54.5], [500, 3, '#7ED957', 58.5]].forEach(([px, i, col, a]) => ppl += person(i, [[0, { ...POSES.idle, armF: [150, -50] }], [a, { ...POSES.surprise, armF: [150, -50], eyes: 'wide', mouth: 'o', look: [x < px ? -9 : 9, 0] }, 'snap']], t, px, GY - 190, { s: DS*.8 }) + umbrella(px + 34, GY - 370, .75, col, -6));
      return rainStreet(t, L, 1) + L(1, pr + ppl + slippers(t, x, GY - 110, 1.05, true, 48.2, 1.2) + rainDex(t, o, 'rm', wk) + chibi4({ ...o, inv: true, eyes: 'open', look: [8, -4] })) + rainFall(t, 140, .55) +
        chipAt(t, 55.5, 960, 120, 'A DEX-SHAPED OUTLINE OF RAIN', '#5CF2FF', 50) + chipAt(t, 60.6, 960, 980, 'WET FOOTPRINTS', '#3D8BFF', 52); } },
  // 6 he shakes off like a dog... more rain lands
  { t: 64.5, ref: RR, cam: push(64.5, 67.11, { x: 1100, y: GY - 330, z: 1.6, r: 0 }, { x: 1100, y: GY - 330, z: 1.75, r: 3 }, 'lin'), draw: (t, c, L) => {
      const sh = t > 64.9 && t < 65.9 ? Math.sin(t*50)*10 : 0, o = { ...DEX2, ...POSES.idle, x: 1100 + sh, y: GY - 140, s: DS, t, blink: 0, hoodTip: 0, rot: sh*.6 };
      let spray = ''; if (t > 64.9 && t < 66.4) { const k = seg(t, 64.9, 66.4); for (let i = 0; i < 30; i++) { const a = hash(i)*6.283; spray += `<circle cx="${1100 + Math.cos(a)*(60 + 400*k)}" cy="${GY - 300 + Math.sin(a)*(60 + 300*k) + 300*k*k}" r="${6 - 4*k}" fill="#DDF6FF" stroke="#5A7FB8" stroke-width="1.5"/>`; } }
      return rainStreet(t, L, 1) + L(1, rainDex(t, o, 'rm2', t < 65.4 ? 1 - seg(t, 64.9, 65.4)*.8 : .2 + .8*seg(t, 65.6, 66.8)) + chibi4({ ...o, inv: true, eyes: t < 65.9 ? 'squeeze' : 'open', look: [0, -8] }) + spray) + rainFall(t, 140, .55) + bang(t, 65.0, 1450, 300, 'shake shake', '#fff', 60, -6, 66.2); } },
  // 7 RULE 3
  { t: 67.11, ref: RR, cam: push(67.11, END, { x: 900, y: GY - 360, z: 1.3, r: 0 }, { x: 920, y: GY - 360, z: 1.36, r: 0 }, 'lin'), draw: (t, c, L) => {
      const o = { ...DEX2, ...POSES.idle, x: 1100, y: GY - 140, s: DS, t, blink: 0, hoodTip: 0 };
      return rainStreet(t, L, 1) + L(1, rainDex(t, o, 'rm3', 1) + chibi4({ ...o, inv: true, eyes: 'open', look: [-8, -2] })) + rainFall(t, 140, .55) + note(t, 67.15, 600, 400, 'RULE 3', 'STAY', 'DRY.'); } },
];
const SHAKES_S3 = [];
function scene(t) { let s = EP3DEFS + EP4DEFS + playShots(t, SHOTS_S3, SHAKES_S3) + vignette(); [15.2, 27.6, 40.0].forEach(w => s += wipe(t, w)); return s; }
