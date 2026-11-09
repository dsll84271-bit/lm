// RIG2
// Ep3 s1: Rule 1, your speed comes with you (Earth's spin, London vs Sydney, jet lag). END 81.62
// ST=[0.8, 5.86, 14.88, 28.11, 39.89, 44.24, 50.92, 59.0, 62.93, 72.43]
const SX = -100;
function flightA(k) { const px = lerp(-560, SX, k), py = lerp(GY - 600, GY - 112, E.in(k)*.75 + k*.25) - 90*Math.sin(k*Math.PI)*.6; return { x: px, y: py + 150*DS, rot: lerp(-35, -172, E.in(k)) }; }
function dexFlyK(k, t, eyes='shock') { const f = flightA(k); return chibi2({ ...DEX2, ...mixPose(POSES.dive, POSES.dive, 1), eyes, mouth: 'wail', x: f.x, y: f.y, s: DS, t, air: true, rot: f.rot, blink: 0, hoodTip: -8 }); }
function park(t, L, blur='') {
  return L(0, skyW(t, 1100, 120)) + L(.5, cityFar(t, 820) + hills(t, 790, false), blur ? 'b4' : '') + L(1, grassGround(GY - 40) + bush(-900, GY - 40, 1.1) + bush(1100, GY - 40, 1.2) + flower(-500, GY + 80, t) + flower(600, GY + 120, t, '#FFD23F'), blur);
}

const TOPLON = t => 61.2 + Math.max(0, 23.8 - t)*5;   // top-down view rotation (absolute time; settles with Sydney on the right)
function topDiagram(t, cx, cy, R, lon0, o={}) {
  let s = poleDisc(cx, cy, R, lon0, t);
  const k = R/1674, l = topPos(LONDON, cx, cy, R, lon0), sy = topPos(SYDNEY, cx, cy, R, lon0), vl = topVel(LONDON, lon0, k), vs = topVel(SYDNEY, lon0, k);
  if (o.vel !== false) { s += arrow(l[0], l[1], l[0] + vl[0]*(o.vk ?? 1), l[1] + vl[1]*(o.vk ?? 1), '#3D8BFF', 18); s += arrow(sy[0], sy[1], sy[0] + vs[0]*(o.vk ?? 1), sy[1] + vs[1]*(o.vk ?? 1), '#FF8A3D', 18); }
  s += `<circle cx="${l[0]}" cy="${l[1]}" r="16" fill="#3D8BFF" stroke="${INK}" stroke-width="6"/><circle cx="${sy[0]}" cy="${sy[1]}" r="16" fill="#FF8A3D" stroke="${INK}" stroke-width="6" stroke-dasharray="6 5"/>`;
  return { s, l, sy, vl, vs };
}
const SHOTS_S1 = [
  // 0 slow-motion replay of the face-plant, "why?"
  { t: 0, ref: RR, cam: push(0, 2.95, { x: -330, y: GY - 420, z: 1.45, r: -3 }, { x: -200, y: GY - 300, z: 1.75, r: 2 }, 'lin'), draw: (t, c, L) => {
      const k = t < 2.3 ? lerp(.1, .86, t/2.3) : Math.min(1, lerp(.86, 1, seg(t, 2.3, 2.45)));
      let d = t < 2.45 ? dexFlyK(k, t) : dexStuck(t, SX) + sandBurst(SX, GY, t, 2.45);
      let s = beachW(t, L, 'b4') + L(1, d);
      if (t < 2.3) s = `<g filter="url(#impInk)" opacity=".9">${s}</g>` + `<rect width="1920" height="1080" fill="#FFB067" opacity=".18"/>`;
      return s + tag(t, .9, 960, 130, 'REPLAY', '#E8463C', 54, 2.3) + (t > 1.2 && t < 2.3 ? `<g transform="translate(1450,380) scale(${pop(t, 1.2, .3)})">${txt('WHY?!', 0, 0, 120, '#FFC21F')}</g>` : '') + (t > 2.45 && t < 2.55 ? focusLines(t, 960, 700, 1, 300) : ''); } },
  // 1 something you can't feel: Dex standing very still in a London park
  { t: 2.95, ref: RR, cam: push(2.95, 5.0, { x: 0, y: GY - 300, z: 1.6, r: 0 }, { x: 0, y: GY - 300, z: 1.75, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.idle, eyes: 'closed', mouth: 'flat' }], [3.6, { ...POSES.think, eyes: 'closed', mouth: 'flat' }, 'o'], [4.3, { ...POSES.shrug, eyes: 'open' }, 'o']];
      return park(t, L, 'b4') + L(1, dex(K, t, 0, GY - 40)) + tag(t, 3.2, 960, 130, 'LONDON', '#3D8BFF', 56) + (t > 4.3 ? `<g transform="translate(1350,330) scale(${pop(t, 4.3, .3)})">${txt('?', 0, 0, 130, '#fff')}</g>` : ''); } },
  // 2 zoom out to space: the Earth is spinning
  { t: 5.0, ref: GC, cam: push(5.0, 8.05, { x: 960, y: 540, z: 2.6, r: 0 }, { x: 960, y: 560, z: 1.0, r: 0 }, 'o'), draw: (t, c, L) => {
      const lon0 = 20 - (t - 5)*22;
      return L(0, space(t)) + L(1, globe(960, 560, 380, lon0, 25) + spinArrows(960, 560, 470, t, '#FFFFFF', .8, -1)) + tag(t, 5.9, 960, 110, 'THE EARTH IS SPINNING', '#5CF2FF', 60) + flash(t, 5.0, '#fff', .25, .7); } },
  // 3 London: ~1,040 km/h east
  { t: 8.05, ref: GC, cam: push(8.05, 14.88, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 900, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const lon0 = -10 - (t - 8)*3, lat0 = 35, R = 360, cx = 600, cy = 560, p = gxy(LONDON, cx, cy, R, lon0, lat0), q = gxy([LONDON[0] + 9, LONDON[1]], cx, cy, R, lon0, lat0);
      const k = E.o(seg(t, 9.0, 9.8)), ex = p[0] + (q[0] - p[0])*k*2.4, ey = p[1] + (q[1] - p[1])*k*2.4;
      const v = Math.round(1040*E.io(seg(t, 9.6, 12.4)));
      return L(0, space(t)) + L(1, globe(cx, cy, R, lon0, lat0) + latLine(51.5, cx, cy, R, lon0, lat0, '#3D8BFF', 5, '12 10') + (t > 9 ? arrow(p[0], p[1], ex, ey, '#3D8BFF', 20) : '') + pin(p[0], p[1], .9, '#3D8BFF', 'LONDON', -1) +
        (t > 9.5 ? `<g transform="scale(${pop(t, 9.5, .35)})" style="transform-origin:1400px 520px">${gauge(1400, 520, 230, v, 1500, '≈ ' + v.toLocaleString('en-GB') + ' KM/H', '#3D8BFF')}</g>` : '')) +
        tag(t, 8.2, 1400, 180, 'LONDON: GROUND MOVES EAST', '#3D8BFF', 46) + (t > 11 ? `<g transform="translate(1400,860) scale(${pop(t, 11, .3)})">${txt('EAST →', 0, 0, 64, '#fff')}</g>` : ''); } },
  // 4 Sydney: closer to the equator, faster
  { t: 14.88, ref: GC, cam: push(14.88, 20.95, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const lon0 = 75, lat0 = 8, R = 420, cx = 960, cy = 590;
      const l = gxy(LONDON, cx, cy, R, lon0, lat0), s2 = gxy(SYDNEY, cx, cy, R, lon0, lat0);
      const eq = seg(t, 15.4, 16.2);
      return L(0, space(t)) + L(1, globe(cx, cy, R, lon0, lat0) + (eq > 0 ? `<g opacity="${eq}">${latLine(0, cx, cy, R, lon0, lat0, '#FFD23F', 9, '18 12')}</g>` : '') + pin(l[0], l[1], .85, '#3D8BFF', '', -1) + pin(s2[0], s2[1], .85, '#FF8A3D', '', 1) +
        (eq > .5 ? `<g transform="translate(${cx + 30},${cy + 70})">${txt('EQUATOR', 0, 0, 44, '#FFD23F')}</g>` : '')) +
        chipAt(t, 15.0, 330, 260, 'LONDON ≈ 1,040 KM/H', '#3D8BFF', 46) + chipAt(t, 18.4, 1590, 260, 'SYDNEY ≈ 1,390 KM/H', '#FF8A3D', 46) + (t > 19.3 ? `<g transform="translate(1590,360) scale(${pop(t, 19.3, .3)})">${txt('FASTER!', 0, 0, 60, '#FFD23F')}</g>` : ''); } },
  // 5 seen from above the North Pole: different directions
  { t: 20.95, ref: GC, cam: push(20.95, 28.05, { x: 960, y: 560, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.08, r: 0 }, 'lin'), draw: (t, c, L) => {
      const D = topDiagram(t, 760, 470, 300, TOPLON(t), { vk: E.o(seg(t, 21.6, 22.4)) });
      let ang = '';
      if (t > 24.0) { const a1 = Math.atan2(D.vl[1], D.vl[0]), a2 = Math.atan2(D.vs[1], D.vs[0]), k = seg(t, 24.0, 24.8);
        ang = arrow(1500, 560, 1500 + Math.cos(a1)*200*k, 560 + Math.sin(a1)*200*k, '#3D8BFF', 20) + arrow(1500, 560, 1500 + Math.cos(a2)*260*k, 560 + Math.sin(a2)*260*k, '#FF8A3D', 20) + `<circle cx="1500" cy="560" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/>`; }
      return L(0, space(t)) + L(1, D.s + `<g transform="translate(${D.l[0] - 40},${D.l[1] - 50})">${txt('LONDON', 0, 0, 40, '#fff', 'end')}</g><g transform="translate(${D.sy[0] + 40},${D.sy[1] + 60})">${txt('SYDNEY', 0, 0, 40, '#fff', 'start')}</g>` + ang) +
        tag(t, 21.0, 960, 100, 'SEEN FROM ABOVE THE NORTH POLE', '#5CF2FF', 50) + chipAt(t, 24.9, 1500, 880, 'DIFFERENT DIRECTIONS', '#E8463C', 46) + (t > 21.4 ? `<g transform="translate(240,990)">${txt('(SIMPLIFIED)', 0, 0, 32, '#BFE6FF')}</g>` : ''); } },
  // 6 the old speed vs the ground: vector difference
  { t: 28.05, ref: GC, cam: push(28.05, 36.5, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 980, y: 540, z: 1.06, r: 0 }, 'io'), draw: (t, c, L) => {
      const lon0 = TOPLON(99), D = topDiagram(t, 760, 470, 300, lon0, { vel: false }), k = 300/1674;
      const mv = E.io(seg(t, 28.7, 30.3)), bx = lerp(D.l[0], D.sy[0], mv), by = lerp(D.l[1], D.sy[1], mv) - 120*Math.sin(mv*Math.PI);
      let s = D.s + arrow(D.sy[0], D.sy[1], D.sy[0] + D.vs[0], D.sy[1] + D.vs[1], '#FF8A3D', 18) + (mv < 1 ? arrow(D.l[0], D.l[1], D.l[0] + D.vl[0], D.l[1] + D.vl[1], '#3D8BFF', 18) : '');
      s += arrow(bx, by, bx + D.vl[0], by + D.vl[1], '#3D8BFF', 18) + `<g transform="translate(${bx},${by - 70}) scale(.32)">${chibi2({ ...DEX2, ...mixPose(POSES.surprise, POSES.surprise, 1), x: 0, y: 260, s: 1, t, air: true })}</g>`;
      const dk = E.io(seg(t, 31.4, 32.8)), tipS = [D.sy[0] + D.vs[0], D.sy[1] + D.vs[1]], tipL = [D.sy[0] + D.vl[0], D.sy[1] + D.vl[1]];
      if (t > 31.4) s += arrow(D.sy[0], D.sy[1], D.sy[0] + (D.vl[0] - D.vs[0])*dk, D.sy[1] + (D.vl[1] - D.vs[1])*dk, '#E8463C', 24);
      const mag = Math.round(Math.hypot(D.vl[0] - D.vs[0], D.vl[1] - D.vs[1])/k);
      return L(0, space(t)) + L(1, s + popFX(t, 28.7, D.l[0], D.l[1] - 70, .4, 'out') + popFX(t, 30.3, D.sy[0], D.sy[1] - 70, .4)) +
        chipAt(t, 28.3, 960, 100, 'IF HE KEPT HIS LONDON SPEED…', '#3D8BFF', 50) + (t > 33.3 ? `<g transform="translate(1480,300) scale(${pop(t, 33.3, .3)}) rotate(-4)">${chip('≈ 2,400 KM/H', 0, 0, '#E8463C', 72)}</g>` : '') + chipAt(t, 35.2, 1480, 420, 'COMPARED WITH THE GROUND', '#1F2033', 40) +
        (t > 33.3 ? `<g transform="translate(1480,190)">${txt('(' + mag.toLocaleString('en-GB') + ' KM/H BY OUR MATHS)', 0, 0, 30, '#BFE6FF')}</g>` : ''); } },
  // 7 twice the speed of sound
  { t: 36.5, ref: GC, cam: push(36.5, 39.95, { x: 960, y: 540, z: 1.05, r: -1 }, { x: 960, y: 540, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k1 = E.o(seg(t, 36.7, 37.4)), k2 = E.o(seg(t, 37.4, 38.4));
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, bar(260, 420, 640, 110, '#7FD3FF', 'SPEED OF SOUND', '≈ 1,235 KM/H', k1) + bar(260, 700, 1240, 110, '#E8463C', 'DEX (IF HE KEPT IT)', '≈ 2,400 KM/H', k2) +
        (k2 > .9 ? `<g transform="translate(${260 + 1240*k2 + 90},700) scale(.35)">${chibi2({ ...DEX2, ...mixPose(POSES.launch, POSES.launch, 1), x: 0, y: 260, s: 1, t, air: true, rot: 70 })}</g>` : '')) +
        (t > 38.3 ? `<g transform="translate(1480,250) scale(${pop(t, 38.3, .3)}) rotate(-6)">${txt('× 2', 0, 0, 160, '#FFD23F')}</g>` : '') + speedLines(t, 14, .25, '#fff'); } },
  // 8 you'd become part of the beach
  { t: 39.95, ref: RR, cam: push(39.95, 44.24, { x: 0, y: GY - 330, z: 1.12, r: 0 }, { x: 0, y: GY - 300, z: 1.25, r: 0 }, 'lin'), draw: (t, c, L) => {
      const HT = 40.35, streak = t > 40.05 && t < HT ? `<path d="M${lerp(-1400, 0, seg(t, 40.05, HT)) - 900},${GY - 520} L${lerp(-1400, 0, seg(t, 40.05, HT))},${GY - 40}" stroke="#FFC21F" stroke-width="60" stroke-linecap="round"/><path d="M${lerp(-1400, 0, seg(t, 40.05, HT)) - 900},${GY - 520} L${lerp(-1400, 0, seg(t, 40.05, HT))},${GY - 40}" stroke="#fff" stroke-width="20" stroke-linecap="round"/>` : '';
      let d = streak;
      if (t >= HT) { d += crater(0, GY + 10, 520*E.o(seg(t, HT, HT + .3)), 130) + sandBurst(0, GY, t, HT, 2.2) + (t > 41.6 ? sandDex(0, GY + 20, .9*E.o(seg(t, 41.6, 42.0))) : '') + smoke(-200, GY - 100, t, 5, 2) + smoke(250, GY - 80, t + 1, 5, 2); }
      d += gull(900, GY + 60, 1, t, { tilt: t > 42.4 ? -20 : 0 });
      let s = beachW(t, L) + L(1, d);
      if (t >= HT && t < HT + .1) { const f = Math.floor((t - HT)*30); s = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${s}${focusLines(t, 960, 640, 1, 260)}</g>`; }
      return s + flash(t, HT, '#fff', .3, .6) + chipAt(t, 41.7, 960, 130, 'PART OF THE BEACH', '#FF8A3D', 60); } },
  // 9 luckily, the spin is handled
  { t: 44.24, ref: RR, cam: push(44.24, 48.15, { x: 0, y: GY - 300, z: 1.6, r: 2 }, { x: 0, y: GY - 300, z: 1.75, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.gulp }], [44.5, { ...POSES.smile, armF: [150, 30], tilt: 6, eyes: 'closed', mouth: 'grin' }, 'o'], [45.6, { ...POSES.knuckle }, 'o'], [46.8, { ...POSES.confident, eyes: 'happy' }, 'o']];
      return L(0, studioBack(t)) + L(1, studioFloor() + dex(K, t, -220, GY) + `<g transform="translate(350,${GY - 330})">${globe(0, 0, 150, -(t*30), 20, { atmo: false })}${spinArrows(0, 0, 190, t, '#fff', .8, -1)}</g>` + (t > 45.5 ? `<g transform="translate(470,${GY - 450}) scale(${pop(t, 45.5, .3)})"><circle r="56" fill="#7ED957" stroke="${INK}" stroke-width="7"/><path d="M-24,0 L-6,20 L26,-18" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : '')) +
        chipAt(t, 45.3, 960, 130, "EARTH'S SPIN: HANDLED", '#7ED957', 58); } },
  // 10 every other speed: kept
  { t: 48.15, ref: RR, cam: push(48.15, 50.92, { x: 0, y: GY - 330, z: 1.2, r: 0 }, { x: 0, y: GY - 330, z: 1.26, r: 0 }, 'lin'), draw: (t, c, L) => {
      const items = [['JUMPING', -560, 'popJump', 0, -1], ['RUNNING', 0, 'ready', 1, 0], ['FALLING', 560, 'flailB', 0, 1]];
      let s = studioFloor();
      items.forEach(([lab, x, p, dx, dy], i) => { const a = 48.4 + i*.4; if (t < a) return; const k = pop(t, a, .3);
        const ar = dx ? arrow(x + 120, GY - 200, x + 360, GY - 200, '#FFC21F', 18) : arrow(x + 170, GY - 200 - dy*110, x + 170, GY - 200 + dy*130, '#FFC21F', 18);
        s += `<g transform="translate(${x},${GY}) scale(${k}) translate(${-x},${-GY})">${dex([[0, p]], t, x, GY - (p === 'popJump' ? 60 : 0), { air: p !== 'ready', s: DS*.8 })}${ar}</g>`;
        s += `<g transform="translate(${x},${GY - 520})">${chip(lab, 0, 0, '#3D8BFF', 44)}</g>`; });
      return L(0, studioBack(t)) + L(1, s) + chipAt(t, 48.25, 960, 130, 'EVERY OTHER SPEED: KEPT', '#E8463C', 58); } },
  // 11 mid-jump replay in the bedroom
  { t: 50.92, ref: RR, cam: push(50.92, 54.3, { x: 380, y: GY - 420, z: 1.3, r: 3 }, { x: 400, y: GY - 440, z: 1.42, r: 4 }, 'lin'), draw: (t, c, L) => {
      const J = 51.5, PO = 53.0, fr = t > 51.9 && t < 52.9;
      const tt = fr ? 51.9 : t, pos = q => q < J ? { x: 300, y: GY } : { x: 300 + 140*seg(q, J, J + .5), y: GY - 260*E.snap(seg(q, J, J + .5)) };
      const K = [[0, { ...POSES.smile, mouth: 'laugh' }], [J - .2, 'crouchPop', 'snap'], [J, 'popJump', 'snap', .1]];
      const p = pos(tt), dx = chibi2(dexAt(K, tt, pos, { s: DS, seed: 4, air: tt > J }));
      let s = bedroom(t, L, c, 'b4') + L(1, tpWrap(t, dx, p.x, p.y - 150, -1e9, PO) + (t > 51.9 && t < PO ? arrow(p.x + 60, p.y - 360, p.x + 200, p.y - 560, '#FFC21F', 20) : '') + popFX(t, PO, p.x, p.y - 150, .9, 'out'));
      if (fr) s = `<g filter="url(#impInk)">${s}</g>`;
      return s + chipAt(t, 51.95, 1450, 200, 'MID-JUMP', '#FFC21F', 60, PO) + (t > 52.1 && t < PO ? `<g transform="translate(1450,300)">${txt('(VERY EXCITED)', 0, 0, 38, '#fff')}</g>` : ''); } },
  // 12 arrives still moving, 1.5 m up, face first
  { t: 54.3, ref: RR, cam: [[54.3, { x: -460, y: GY - 450, z: 1.1, r: -2 }], [56.5, { x: -440, y: GY - 440, z: 1.16, r: -1 }, 'lin'], [57.3, { x: -200, y: GY - 320, z: 1.4, r: 0 }, 'io'], [59.0, { x: -190, y: GY - 310, z: 1.45, r: 0 }, 'lin']], draw: (t, c, L) => {
      const FZ = 56.5, HT = 57.25, k = t < FZ ? .02 : Math.min(1, lerp(.02, 1, seg(t, FZ, HT)));
      const f = flightA(k);
      let d = t < HT ? tpWrap(t, dexFlyK(k, t, t < FZ ? 'wide' : 'shock'), f.x, f.y - 150*DS, 54.35) + popFX(t, 54.35, -560, GY - 600, .9) : dexStuck(t, SX) + sandBurst(SX, GY, t, HT);
      if (t > 54.6 && t < FZ) { const kk = seg(t, 54.6, 55.0);
        d += `<g opacity="${kk}"><path d="M-760,${GY} L-760,${GY - 470}" stroke="#fff" stroke-width="10"/><path d="M-790,${GY} L-730,${GY} M-790,${GY - 470} L-730,${GY - 470}" stroke="#fff" stroke-width="10"/>${[1,2,3,4].map(i => `<path d="M-775,${GY - i*94} L-745,${GY - i*94}" stroke="#fff" stroke-width="6"/>`).join('')}<g transform="translate(-820,${GY - 235})">${txt('≈ 1.5 M', 0, 0, 60, '#fff', 'end')}</g></g>` + (t > 55.4 ? arrow(f.x + 100, f.y - 300, f.x + 360, f.y - 120, '#FFC21F', 22) : ''); }
      let s = beachW(t, L, 'b4') + L(1, d);
      if (t >= HT && t < HT + .1) s = `<g filter="url(#impInk)">${s}${focusLines(t, 960, 700, 1, 280)}</g>`;
      return s + chipAt(t, 55.4, 1450, 200, 'STILL MOVING', '#FFC21F', 56, HT) + bang(t, HT + .05, 1300, 300, 'FACE FIRST', '#E8463C', 100, -6); } },
  // 13 RULE 1
  { t: 59.0, ref: RR, cam: push(59.0, 62.93, { x: 120, y: GY - 300, z: 1.45, r: -2 }, { x: 160, y: GY - 300, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, 'dizzy'], [59.3, { ...POSES.point, armF: [116, -20], eyes: 'determined', mouth: 'smirk' }, 'o'], [60.6, { ...POSES.knuckle }, 'o']];
      return beachW(t, L, 'b8') + L(1, dex(K, t, -150, GY)) + note(t, 59.15, 1360, 420, 'RULE 1', 'YOUR SPEED', 'COMES WITH YOU.'); } },
  // 14 it wasn't morning any more
  { t: 62.93, ref: RR, cam: push(62.93, 66.8, { x: -300, y: GY - 420, z: 1.15, r: 0 }, { x: -380, y: GY - 460, z: 1.3, r: -2 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.idle, look: [-8, -8], tilt: -8 }], [64.6, { ...POSES.surprise, look: [-8, -8], tilt: -10 }, 'o'], [65.6, { ...POSES.shrug, look: [-4, -6] }, 'o']];
      return beachW(t, L) + L(1, dex(K, t, 100, GY)) + chipAt(t, 64.5, 960, 130, "WAIT… IT'S EVENING?", '#FF8A3D', 56) + `<rect width="1920" height="1080" fill="#3B2A6B" opacity="${.25*seg(t, 63, 66.8)}"/>`; } },
  // 15 +11 hours
  { t: 66.8, ref: GC, cam: push(66.8, 72.43, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = E.o(seg(t, 67.0, 67.4)), k2 = E.o(seg(t, 67.3, 67.7)), hrs = Math.floor(lerp(0, 11, seg(t, 68.3, 70.4)));
      return L(0, `<rect x="-3000" y="-3000" width="3960" height="7000" fill="url(#dawn)"/><rect x="960" y="-3000" width="4000" height="7000" fill="url(#sunset)"/>`) +
        L(1, `<g transform="translate(480,520) scale(${k})">${clockF(0, 0, 210, 7, 2)}${sunIcon(0, 330, 50, '#FFE07A')}</g><g transform="translate(1440,520) scale(${k2})">${clockF(0, 0, 210, 6, 2)}${sunIcon(0, 330, 50, '#FF8A3D', true)}</g>` +
        `<path d="M960,-100 L960,1200" stroke="${INK}" stroke-width="14"/>` + (t > 68.3 ? arrow(720, 170, 1200, 170, '#FFC21F', 20) + `<g transform="translate(960,110)">${txt('+' + hrs + ' HOURS', 0, 0, 64, '#fff')}</g>` : '')) +
        chipAt(t, 67.1, 480, 920, 'LONDON · 7:02 AM', '#3D8BFF', 50) + chipAt(t, 67.4, 1440, 920, 'SYDNEY · 6:02 PM', '#FF8A3D', 50) + chipAt(t, 70.6, 960, 1010, 'IN UK WINTER', '#1F2033', 38); } },
  // 16 skips the flight, not the jet lag
  { t: 72.43, ref: RR, cam: push(72.43, 75.6, { x: 0, y: GY - 320, z: 1.4, r: 0 }, { x: 0, y: GY - 300, z: 1.6, r: 2 }, 'lin'), draw: (t, c, L) => {
      if (t < 74.1) return L(0, skyW(t)) + L(1, plane(lerp(-700, 300, seg(t, 72.4, 74.1)), GY - 420, 1.6, -4) + crossOut(0, GY - 420, 1.4, t, 73.0)) + chipAt(t, 72.6, 960, 130, 'NO LONG-HAUL FLIGHT', '#7ED957', 56);
      const K = [[0, { ...POSES.idle, eyes: 'closed', mouth: 'flat' }], [74.4, { ...POSES.stretchUp, mouth: 'o' }, 'o'], [75.2, { ...POSES.idle, eyes: 'closed', mouth: 'flat', tilt: 10 }, 'o']];
      return beachW(t, L, 'b8') + L(1, `<rect x="-3000" y="-2000" width="6000" height="4000" fill="#101850" opacity=".45"/>` + dex(K, t, 0, GY) + zzz(140, GY - 420, t)) + chipAt(t, 74.2, 960, 130, 'BUT STILL JET LAG', '#B07CFF', 58); } },
  // 17 body clock catches up ~1 hour a day
  { t: 75.6, ref: RR, cam: push(75.6, 81.62, { x: 0, y: GY - 340, z: 1.3, r: 0 }, { x: 0, y: GY - 340, z: 1.4, r: 0 }, 'lin'), draw: (t, c, L) => {
      const day = Math.min(4, Math.floor(seg(t, 77.2, 80.2)*5)), hh = 7 + day, sw = seg(t, 77.2 + day*.6, 77.5 + day*.6);
      const K = [[0, { ...POSES.idle, eyes: 'closed', mouth: 'flat', tilt: 10 }], [76.6, { ...POSES.think, eyes: 'open', mouth: 'flat' }, 'o'], [80.3, { ...POSES.idle, eyes: 'closed', mouth: 'o', tilt: 14, sq: .97 }, 'o']];
      return L(0, studioBack(t, '#2A2F7A', '#1B1F5C', '#323A8C')) + L(1, studioFloor('#141855') + dex(K, t, -480, GY) + `<g transform="translate(330,${GY - 380})">${clockF(0, 0, 220, hh - 1 + E.o(sw), 0, '#FFF6D0')}<g transform="translate(0,-300)">${chip('BODY CLOCK', 0, 0, '#B07CFF', 44)}</g></g>` +
        [0,1,2,3,4].map(i => t > 77.2 + i*.6 ? `<g transform="translate(${-80 + i*110},${GY - 40})"><rect x="-44" y="-50" width="88" height="90" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-44" y="-50" width="88" height="24" rx="8" fill="#E8463C"/>${txt('' + (i + 1), 0, 30, 40, INK)}</g>` : '').join('') + (t > 80.4 ? zzz(-360, GY - 420, t) : '')) +
        chipAt(t, 76.0, 600, 120, 'AFTER FLYING EAST:', '#1F2033', 44) + chipAt(t, 77.4, 600, 210, '≈ 1 HOUR CATCH-UP PER DAY', '#B07CFF', 52); } },
];
const SHAKES_S1 = [[2.45, 22, .5], [40.35, 30, .7], [57.25, 22, .5], [28.7, 4, .2], [30.3, 6, .25]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_S1, SHAKES_S1) + vignette(); [2.95, 44.24, 59.0, 62.93].forEach(w => s += wipe(t, w)); return s; }
