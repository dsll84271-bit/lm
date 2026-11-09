// RIG2
// Ep3 s5: The Moon. Rule 5, if it's moving, it'll hit you. END 35.61   ST=[0.6, 7.64, 15.38, 28.28, 31.71]
const SP5 = { x: 960, y: 540, z: 1 };
const SHOTS_S5 = [
  // 0 what about the Moon? (seen through the bedroom window)
  { t: 0, ref: RR, cam: push(0, 2.2, { x: 160, y: GY - 450, z: 1.18, r: 0 }, { x: 180, y: GY - 460, z: 1.3, r: 2 }, 'lin'), draw: (t, c, L) =>
      bedroom(t, L, c) + L(1, `<clipPath id="wmc"><rect x="260" y="250" width="380" height="300" rx="10"/></clipPath><g clip-path="url(#wmc)">${moon(540, 330, 46)}</g>` + dex([[0, { ...POSES.point, armF: [140, -10], look: [8, -8], eyes: 'happy', mouth: 'grin' }]], t, -60, GY)) + chipAt(t, .9, 1420, 640, 'WHAT ABOUT THE MOON?', '#B07CFF', 56) },
  // 1 no air, but a spacesuit fixes that
  { t: 2.2, ref: RR, cam: push(2.2, 5.0, { x: 0, y: GY - 300, z: 1.7, r: 0 }, { x: 0, y: GY - 300, z: 1.8, r: -2 }, 'lin'), draw: (t, c, L) => {
      const h = E.o(seg(t, 3.4, 3.8)), hy = lerp(-400, 0, h);
      return L(0, studioBack(t)) + L(1, studioFloor() + dex([[0, { ...POSES.smile }], [3.4, { ...POSES.confident, eyes: 'happy' }, 'o']], t, 0, GY) + `<g transform="translate(0,${hy})">${helmet(0, GY - 250*DS, DS)}</g>`) + chipAt(t, 2.4, 960, 120, 'NO AIR EITHER', '#5CF2FF', 54) + chipAt(t, 3.9, 960, 220, 'SPACESUIT: SORTED ✓', '#7ED957', 52); } },
  // 2 the real problem is speed
  { t: 5.0, ref: SP5, cam: push(5.0, 7.64, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.25, r: 4 }, 'in'), draw: (t, c, L) =>
      L(0, space(t, 160, 5)) + L(1, moon(960, 560, 330, t*4)) + (t > 5.2 ? `<g transform="translate(960,560) rotate(-8) scale(${pop(t, 5.2, .25)})"><rect x="-330" y="-110" width="660" height="220" rx="26" fill="none" stroke="#E8463C" stroke-width="16"/>${txt('SPEED', 0, 50, 150, '#E8463C')}</g>` : '') + speedLines(t, 18, .3, '#fff') },
  // 3 the Moon is racing around the Earth at ~3,700 km/h
  { t: 7.64, ref: SP5, cam: push(7.64, 15.38, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const a = -1.2 + (t - 7.64)*.32, ex = 760, ey = 560, R = 560, mx = ex + Math.cos(a)*R, my = ey + Math.sin(a)*R*.42, vx = -Math.sin(a), vy = Math.cos(a)*.42, vn = Math.hypot(vx, vy);
      return L(0, space(t, 160, 5)) + L(1, `<ellipse cx="${ex}" cy="${ey}" rx="${R}" ry="${R*.42}" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="18 16" opacity=".6"/>` + globe(ex, ey, 150, -t*30, 20) + moon(mx, my, 60) + (t > 10.2 ? arrow(mx, my, mx - vx/vn*220, my - vy/vn*220, '#FFD23F', 18) : '')) +
        chipAt(t, 8.0, 960, 110, 'THE MOON IS ALWAYS MOVING', '#B07CFF', 54) + chipAt(t, 11.7, 1480, 900, '≈ 3,700 KM/H', '#FFD23F', 64) + (t > 8.4 ? `<g transform="translate(240,1010)">${txt('NOT TO SCALE', 0, 0, 30, '#BFE6FF')}</g>` : ''); } },
  // 4 the power matches Earth's spin ✓, not the Moon ✗
  { t: 15.38, ref: SP5, cam: push(15.38, 19.75, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const tick = (x, y, ok, a) => t < a ? '' : `<g transform="translate(${x},${y}) scale(${pop(t, a, .3)})"><circle r="60" fill="${ok ? '#7ED957' : '#E8463C'}" stroke="${INK}" stroke-width="7"/>${ok ? `<path d="M-26,0 L-6,22 L28,-20" stroke="#fff" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke="#fff" stroke-width="15" stroke-linecap="round"/>`}</g>`;
      return L(0, space(t, 160, 5)) + L(1, globe(520, 560, 230, -t*30, 20) + spinArrows(520, 560, 280, t, '#fff', .8, -1) + moon(1400, 560, 150, t*3) + tick(700, 360, true, 15.6) + tick(1540, 400, false, 18.2)) +
        chipAt(t, 15.5, 520, 900, "EARTH'S SPIN: MATCHED", '#7ED957', 46) + chipAt(t, 18.2, 1400, 900, 'THE MOON: NOT MATCHED', '#E8463C', 46); } },
  // 5 he'd arrive at Earth speed and the Moon would hit him
  { t: 19.75, ref: SP5, cam: push(19.75, 26.0, { x: 960, y: 540, z: 1.05, r: 0 }, { x: 960, y: 540, z: 1.3, r: -4 }, 'in'), draw: (t, c, L) => {
      const A = 20.0, FZ = 24.9, mxk = seg(t, 21.3, FZ), mx = lerp(2700, 1250, E.io(mxk));
      const K = [[A, 'landSquash'], [A + .2, { ...POSES.idleB, eyes: 'happy', mouth: 'grin' }, 'o2'], [22.3, { ...POSES.lookR, look: [9, 0] }, 'o'], [23.3, { ...POSES.flinch, eyes: 'shock', mouth: 'wail' }, 'snap']];
      const dx = chibi2(dexAt(K, Math.min(t, FZ), () => ({ x: 760, y: 760 }), { s: DS, air: true })) + helmet(760, 760 - 250*DS, DS);
      let s = L(0, space(t, 160, 5)) + L(1, tpWrap(t, dx, 760, 600, A) + popFX(t, A, 760, 600, 1) + (t > 21.3 ? `<g ${t < FZ ? 'filter="url(#mb2)"' : ''}>${moon(mx + 900, 560, 1000, t*20)}</g>` : '') + (t > 21.3 && t < FZ ? speedLines(t, 22, .55, '#fff', -1) : ''));
      if (t > FZ) s = `<g filter="url(#impInk)">${s}</g>`;
      return s + chipAt(t, 21.3, 960, 110, 'MOON: ≈ 3,700 KM/H', '#FFD23F', 56) + chipAt(t, 23.3, 960, 960, 'HARDER THAN ANY CAR CRASH', '#E8463C', 50) + (t > FZ ? `<g transform="translate(1460,820) rotate(-6) scale(${pop(t, FZ, .25)})">${txt('NOPE.', 0, 0, 150, '#E8463C')}</g>` : ''); } },
  // 6 the Moon can wait
  { t: 26.0, ref: RR, cam: push(26.0, 31.71, { x: 160, y: GY - 450, z: 1.18, r: 0 }, { x: 170, y: GY - 450, z: 1.26, r: 0 }, 'lin'), draw: (t, c, L) => {
      const cl = E.io(seg(t, 28.8, 29.6));
      const curt = `<path d="M${260 - 40 + 230*cl},230 L${260 - 40},230 L${260 - 40},590 L${260 - 40 + 230*cl},590 Z" fill="#E8463C" stroke="${INK}" stroke-width="6"/><path d="M${640 + 40 - 230*cl},230 L${640 + 40},230 L${640 + 40},590 L${640 + 40 - 230*cl},590 Z" fill="#E8463C" stroke="${INK}" stroke-width="6"/>`;
      return bedroom(t, L, c) + L(1, `<clipPath id="wmc2"><rect x="260" y="250" width="380" height="300" rx="10"/></clipPath><g clip-path="url(#wmc2)">${moon(540, 330, 46)}</g>` + curt + dex([[0, { ...POSES.shrug, mouth: 'smirk' }], [28.6, { ...POSES.point, armF: [130, -40], eyes: 'closed', mouth: 'smirk' }, 'o'], [29.8, { ...POSES.smile }, 'o']], t, -150, GY)) + chipAt(t, 28.4, 1420, 640, 'THE MOON CAN WAIT', '#B07CFF', 58); } },
  // 7 RULE 5
  { t: 31.71, ref: RR, cam: push(31.71, END, { x: -150, y: GY - 360, z: 1.3, r: 0 }, { x: -130, y: GY - 360, z: 1.38, r: 0 }, 'lin'), draw: (t, c, L) =>
      bedroom(t, L, c, 'b2') + L(1, dex([[0, { ...POSES.smile }], [32.0, { ...POSES.point, armF: [116, -20], eyes: 'determined', mouth: 'smirk' }, 'o']], t, -400, GY)) + note(t, 31.75, 1340, 420, 'RULE 5', "IF IT'S MOVING,", "IT'LL HIT YOU.") },
];
const SHAKES_S5 = [[5.2, 8, .3], [24.9, 30, .6]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_S5, SHAKES_S5) + vignette(); [26.0, 31.71].forEach(w => s += wipe(t, w)); return s; }
