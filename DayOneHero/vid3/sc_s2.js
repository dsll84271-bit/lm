// RIG2
// Ep3 s2: Rule 2, teleporting is loud. END 50.1   ST=[3.6, 6.14, 14.91, 26.76, 39.75, 46.39]
const KX = 300;                                                     // where Dex lands in the kitchen
const MUM = (t, keys, x, y, extra={}) => chibi2({ ...dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 31, ...extra }), ...PEOPLE[3], ...extra });
const ARR = 1.7, FRZ = 2.05;                                        // pop in the kitchen, freeze-frame
function kitchenMoment(t, L, c, blur='') {   // tt: story time inside the kitchen moment
  const k = seg(t, ARR, ARR + .5);
  const mumK = [[0, { ...POSES.idle, armF: [70, -60], look: [6, 0], eyes: 'happy', mouth: 'smile' }], [ARR + .05, { ...POSES.surprise, eyes: 'shock', mouth: 'wail', armF: [130, 40], armB: [-130, -40], brow: 16 }, 'snap']];
  const mx = -520, mugX = mx + 120 + 300*k, mugY = GY - 300 - 260*Math.sin(Math.min(1, k*1.2)*Math.PI*.8) + (t > ARR + .5 ? 600*seg(t, ARR + .5, ARR + .9) : 0);
  let s = kitchen(t, L, blur) + L(1, kTable(-200, GY - 40) + MUM(t, mumK, mx, GY - 40) + (t < ARR ? mug(mx + 105, GY - 300, 1) : mug(mugX, Math.min(mugY, GY - 60), 1, 360*k, Math.min(1, k*1.5))) +
    dog(720, GY - 40, .9, t, { alarm: t > ARR, wag: t < ARR }) + tpWrap(t, dex([[ARR, 'landSquash'], [ARR + .15, { ...POSES.peace, eyes: 'happy' }, 'o2']], t, KX, GY - 40), KX, GY - 190, ARR) + popFX(t, ARR, KX, GY - 190, 1.2) +
    (t > ARR && t < ARR + .6 ? airDots(KX, GY - 190, t, 'push', seg(t, ARR, ARR + .6), 70, 900) : ''), blur);
  return s;
}
const SHOTS_S2 = [
  // 0 Sydney: peace sign, pops home
  { t: 0, ref: RR, cam: push(0, 1.45, { x: 0, y: GY - 300, z: 1.6, r: 0 }, { x: 0, y: GY - 300, z: 1.7, r: 0 }, 'lin'), draw: (t, c, L) =>
      beachW(t, L, 'b8') + L(1, tpWrap(t, dex([[0, { ...POSES.wave, eyes: 'happy' }], [.9, 'crouchPop', 'snap']], t, 0, GY), 0, GY - 150, -1e9, 1.15) + popFX(t, 1.15, 0, GY - 150, 1, 'out')) + tag(t, .2, 960, 130, 'HOME TIME', '#FF8A3D', 56) },
  // 1 London kitchen: POP. Freeze-frame on the chaos
  { t: 1.45, ref: RR, cam: push(1.45, 6.14, { x: 0, y: GY - 360, z: 1.12, r: 0 }, { x: 40, y: GY - 360, z: 1.3, r: -3 }, 'lin'), draw: (t, c, L) => {
      const tt = Math.min(t, FRZ);
      let s = kitchenMoment(tt, L, c);
      if (t > FRZ) s = `<g filter="url(#impInk)">${s}</g><rect width="1920" height="1080" fill="#E8463C" opacity=".12"/>`;
      return s + shockScreen(t, ARR, 1100, 600) + (t > FRZ ? `<g transform="translate(1460,330) rotate(-8) scale(${pop(t, FRZ, .25)})">${txt('BANG!!', 0, 0, 150, '#FFC21F')}</g>` : '') + chipAt(t, 3.6, 960, 960, 'PROBLEM 2: NOISE', '#E8463C', 66); } },
  // 2 there's already air where your body wants to be
  { t: 6.14, ref: GC, cam: push(6.14, 9.5, { x: 960, y: 560, z: 1.25, r: 0 }, { x: 960, y: 560, z: 1.4, r: 0 }, 'lin'), draw: (t, c, L) => {
      let dots = ''; for (let i = 0; i < 650; i++) { const x = 960 + (hash(i*2.1) - .5)*2200 + Math.sin(t*2 + i)*8, y = 540 + (hash(i*5.3) - .5)*1300 + Math.cos(t*2.3 + i)*8;
        const inside = Math.abs(x - 960) < 110 && y > 390 && y < 900, hl = inside && t > 7.4; dots += `<circle cx="${x}" cy="${y}" r="${hl ? 12 : 9}" fill="${hl ? '#FFD23F' : '#BFE6FF'}" stroke="${hl ? INK : '#3D8BFF'}" stroke-width="3" opacity="${hl ? 1 : .55}"/>`; }
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, dots + (t > 6.8 ? dexGhost(960, 920) : '')) + chipAt(t, 6.4, 960, 120, 'AIR IS ALREADY THERE', '#5CF2FF', 58) + chipAt(t, 7.4, 960, 980, 'WHERE YOU WANT TO BE', '#FFD23F', 50); } },
  // 3 about 50 litres of air for a kid Dex's size
  { t: 9.5, ref: RR, cam: push(9.5, 14.8, { x: 150, y: GY - 300, z: 1.3, r: 0 }, { x: 180, y: GY - 300, z: 1.38, r: 0 }, 'lin'), draw: (t, c, L) => {
      let b = ''; for (let i = 0; i < 25; i++) { const a = 11.2 + i*.05; if (t < a) continue; const col = i % 5, row = Math.floor(i/5);
        b += `<g transform="translate(${220 + col*95},${GY - 20 - row*112}) scale(${.8*pop(t, a, .25)})">${bottle(0, 0, 1)}</g>`; }
      return L(0, studioBack(t)) + L(1, studioFloor() + dex([[0, 'idle'], [10.0, { ...POSES.point, armF: [96, -6] }, 'o']], t, -300, GY) + b) + chipAt(t, 11.2, 960, 120, '≈ 50 LITRES OF AIR', '#5CF2FF', 62) + chipAt(t, 11.6, 1720, 640, '25 × 2 L', '#1F2033', 44); } },
  // 4 arriving: air shoved out instantly
  { t: 14.8, ref: GC, cam: push(14.8, 17.4, { x: 960, y: 560, z: 1.2, r: 0 }, { x: 960, y: 560, z: 1.32, r: 2 }, 'lin'), draw: (t, c, L) => {
      const A = 15.15, k = seg(t, A, A + .7);
      let dots = t < A ? airDots(960, 680, t, 'push', 0, 90, 700) : airDots(960, 680, t, 'push', k, 90, 900);
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, dots + tpWrap(t, chibi2({ ...dexAt([[A, 'landSquash'], [A + .2, { ...POSES.surprise }, 'o2']], t, () => ({ x: 960, y: 930 }), { s: DS }) }), 960, 780, A) + popFX(t, A, 960, 780, 1.2) + (t > A ? speedLines(t, 10, .3, '#BFE6FF') : '')) +
        chipAt(t, 15.3, 960, 120, 'ARRIVE: AIR SHOVED OUT', '#5CF2FF', 58) + bang(t, 15.6, 1500, 300, 'INSTANTLY', '#FFD23F', 80, -6); } },
  // 5 leaving: the gap, air slams in
  { t: 17.4, ref: GC, cam: push(17.4, 23.45, { x: 960, y: 560, z: 1.2, r: 0 }, { x: 960, y: 600, z: 1.45, r: -2 }, 'lin'), draw: (t, c, L) => {
      const O = 17.85, F0 = 20.4, F1 = 21.2, k = seg(t, F0, F1);
      let s = tpWrap(t, chibi2({ ...dexAt([[0, { ...POSES.smile }], [O - .25, 'crouchPop', 'snap']], t, () => ({ x: 960, y: 930 }), { s: DS }) }), 960, 780, -1e9, O) + popFX(t, O, 960, 780, 1.0, 'out');
      if (t > O + .1) s += dexGhost(960, 930);
      s += t < F0 ? airDots(960, 680, t, 'fill', 0, 90, 300) : airDots(960, 680, t, 'fill', k, 90, 300);
      if (t > F1) s += popFX(t, F1, 960, 700, 1.4);
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, s) + chipAt(t, 18.0, 960, 120, 'LEAVE: AN EMPTY GAP', '#B07CFF', 58) + bang(t, F1, 1450, 330, 'SLAM!', '#E8463C', 130, -8) + flash(t, F1, '#fff', .2, .6) + chipAt(t, 21.4, 960, 980, 'AIR RUSHES IN', '#5CF2FF', 52); } },
  // 6 both make a shock wave
  { t: 23.45, ref: GC, cam: push(23.45, 26.76, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      let r = ''; for (const [x, t0] of [[520, 23.7], [1400, 24.0]]) for (let i = 0; i < 4; i++) { const tt = t - t0 - i*.35; if (tt < 0) continue; const k = (tt % 1.4)/1.4;
        r += `<circle cx="${x}" cy="600" r="${40 + 520*easeOut(k)}" fill="none" stroke="#fff" stroke-width="${22*(1 - k)}" opacity="${1 - k}"/>`; }
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, r + `<g transform="translate(520,600)">${txt('ARRIVE', 0, 20, 70, '#5CF2FF')}</g><g transform="translate(1400,600)">${txt('LEAVE', 0, 20, 70, '#B07CFF')}</g>`) +
        chipAt(t, 24.3, 960, 140, '= TWO SHOCK WAVES', '#E8463C', 64); } },
  // 7 a physics student and a famous wizard book
  { t: 26.76, ref: RR, cam: push(26.76, 32.1, { x: 120, y: GY - 330, z: 1.35, r: 0 }, { x: 160, y: GY - 330, z: 1.48, r: 2 }, 'lin'), draw: (t, c, L) => {
      const desk = `<g transform="translate(-60,${GY - 40})"><rect x="-360" y="-250" width="720" height="34" rx="8" fill="#C08A55" stroke="${INK}" stroke-width="7"/><rect x="-330" y="-216" width="28" height="216" fill="#A9733F" stroke="${INK}" stroke-width="5"/><rect x="302" y="-216" width="28" height="216" fill="#A9733F" stroke="${INK}" stroke-width="5"/>
        <path d="M-260,-250 L-250,-420 L-40,-420 L-50,-250 Z" fill="#3A3F66" stroke="${INK}" stroke-width="6"/></g>`;
      const K = [[0, { ...POSES.think, look: [-6, 4] }], [28.5, { ...POSES.point, armF: [100, -20], eyes: 'happy', mouth: 'grin' }, 'o']];
      return (L(1, roomW(t, { wall: '#E6E0FF', stripe: '#D9D1FF' }) + posterW(-700, 450, 260, 200, 'E = mc²', '#B07CFF', 3)) + L(1, desk + student(t, 120, GY - 40, K) + `<g transform="translate(560,${GY - 380}) rotate(-8)">${book(0, 0, .55)}</g>`)) +
        chipAt(t, 27.0, 960, 120, 'A PHYSICS STUDENT', '#B07CFF', 56) + chipAt(t, 30.3, 960, 980, '+ A FAMOUS WIZARD BOOK', '#6B3FA0', 50); } },
  // 8 about 160 decibels vs a jet engine
  { t: 32.1, ref: GC, cam: push(32.1, 35.6, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k1 = E.o(seg(t, 32.3, 33.0)), k2 = E.o(seg(t, 33.3, 34.2));
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, bar(200, 430, 1180, 110, '#7FD3FF', 'JET ENGINE, CLOSE UP', '≈ 140–150 dB', k1) + bar(200, 720, 1290, 110, '#E8463C', 'TELEPORT POP (STUDENT ESTIMATE)', '≈ 160 dB', k2)) +
        (t > 34.0 ? `<g transform="translate(1660,720) scale(${pop(t, 34.0, .3)})">${txt('!!', 0, 30, 140, '#FFD23F')}</g>` : '') + chipAt(t, 32.2, 960, 120, 'HOW LOUD?', '#5CF2FF', 58); } },
  // 9 louder than standing next to a jet engine
  { t: 35.6, ref: RR, cam: push(35.6, 39.75, { x: 200, y: GY - 360, z: 1.12, r: -2 }, { x: 240, y: GY - 360, z: 1.2, r: 0 }, 'lin'), draw: (t, c, L) => {
      const ears = { ...POSES.flinch, armF: [150, 40], armB: [-150, -40], handF: 'fist', handB: 'fist' };
      return L(0, skyW(t)) + L(1, `<rect x="-6000" y="${GY - 140}" width="12000" height="900" fill="#8C93A8" stroke="${INK}" stroke-width="6"/>` + [...Array(14)].map((_, i) => `<rect x="${-2400 + i*360}" y="${GY - 70}" width="160" height="14" fill="#FFD23F"/>`).join('') + jetEngine(800, GY - 470, 1.1, t) + dex([[0, ears]], t, -320, GY - 40)) + speedLines(t, 16, .35, '#fff', -1) +
        chipAt(t, 35.8, 960, 120, 'LOUDER THAN THIS', '#E8463C', 60); } },
  // 10 mum drops her tea (the kitchen moment plays on)
  { t: 39.75, ref: RR, cam: push(39.75, 41.65, { x: -400, y: GY - 380, z: 1.45, r: 2 }, { x: -380, y: GY - 360, z: 1.6, r: 3 }, 'lin'), draw: (t, c, L) => {
      const tt = FRZ + (t - 39.75)*.9;
      return kitchenMoment(tt, L, c) + bang(t, 40.6, 1300, 300, 'SPLOSH', '#B5783A', 100, 8) + (tt > ARR + .9 ? `<g transform="translate(0,0)"></g>` : ''); } },
  // 11 the dog hides for an hour
  { t: 41.65, ref: RR, cam: push(41.65, 43.55, { x: -200, y: GY - 200, z: 1.7, r: 0 }, { x: -200, y: GY - 200, z: 1.8, r: 0 }, 'lin'), draw: (t, c, L) => {
      const mk = `<g transform="translate(-300,${GY - 40})"><ellipse rx="120" ry="16" fill="#B5783A" opacity=".8"/></g>`;
      return kitchen(t, L, 'b4') + L(1, mk + `<g transform="translate(-200,0)">${dog(-60, GY - 40, .9, t, { alarm: true, shake: true })}</g>` + kTable(-200, GY - 40) + `<path d="M-480,${GY - 300} L80,${GY - 300} L80,${GY - 178} ${[...Array(8)].map((_, i) => `Q${80 - i*70 - 35},${GY - 150} ${80 - (i + 1)*70},${GY - 178}`).join(' ')} Z" fill="#E8463C" stroke="${INK}" stroke-width="6"/>` + [...Array(4)].map((_, i) => `<rect x="${-470 + i*140}" y="${GY - 300}" width="70" height="118" fill="#fff" opacity=".5"/>`).join('')) + chipAt(t, 42.3, 960, 130, 'HIDING: 1 HOUR', '#8A5A3B', 56) +
        `<g transform="translate(1600,330)">${clockF(0, 0, 90, 8, Math.min(60, (t - 42.0)*40))}</g>`; } },
  // 12 every window on the street rattles
  { t: 43.55, ref: RR, cam: push(43.55, 46.39, { x: 0, y: GY - 480, z: 1.0, r: 0 }, { x: 0, y: GY - 470, z: 1.08, r: -2 }, 'lin'), draw: (t, c, L) =>
      L(1, terrace(t, 43.6)) + bang(t, 43.75, 520, 300, 'RATTLE', '#FFD23F', 80, -8) + bang(t, 44.2, 1450, 420, 'RATTLE', '#FFD23F', 70, 6) + bang(t, 44.7, 900, 200, 'CRASH?', '#fff', 60, -4) },
  // 13 RULE 2
  { t: 46.39, ref: RR, cam: push(46.39, 50.1, { x: 0, y: GY - 360, z: 1.18, r: 0 }, { x: 40, y: GY - 360, z: 1.25, r: 0 }, 'lin'), draw: (t, c, L) => {
      const mumK = [[0, { ...POSES.confident, eyes: 'open', mouth: 'flat', brow: -4, browA: 14, look: [8, 0], tilt: 4 }]];
      return kitchen(t, L) + L(1, kTable(-200, GY - 40) + MUM(t, mumK, -560, GY - 40) + dex([[0, { ...POSES.shrug, mouth: 'wobble', sweat: true, look: [-8, 0] }]], t, 0, GY - 40) + `<g transform="translate(0,0)">${dog(1000, GY - 40, .9, t, { alarm: true, shake: true })}</g>`) + note(t, 46.45, 1380, 380, 'RULE 2', 'TELEPORTING', 'IS LOUD.'); } },
];
const SHAKES_S2 = [[ARR, 34, .5], [15.15, 14, .4], [21.2, 22, .5], [43.6, 10, 2.0]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_S2, SHAKES_S2) + vignette(); [6.14, 26.76, 39.75].forEach(w => s += wipe(t, w)); return s; }
