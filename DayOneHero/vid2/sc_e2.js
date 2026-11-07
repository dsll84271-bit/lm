// RIG2
// Ep2 outro (e), Rig 2.0. Timing from t_e.js. END 51.74.
// The end card (from ST[4]) keeps the original layout so YouTube end-screen elements line up: video box 200,260 900x506; subscribe circle 1440,513 r190.
const RE = { x: 0, y: 540, z: 1 };
const WE = [ST[1] - .2, ST[2] - .2, ST[3] - .2, ST[4] - .1], DAY3 = ST[3] + DU[3] + .15;
function miniNote2(t, a, x, y, l1, l2, rot) { const k = pop(t, a, .3); return t < a ? '' : `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})"><rect x="-170" y="-90" width="340" height="180" fill="#FFF07A" stroke="${INK}" stroke-width="7"/><rect x="-50" y="-108" width="100" height="34" fill="#BFE6FF" opacity=".85" transform="rotate(-4)"/><text y="-22" text-anchor="middle" font-family="Lilita One" font-size="38" fill="#E8463C">${l1}</text><text y="36" text-anchor="middle" font-family="Lilita One" font-size="38" fill="${INK}">${l2}</text></g>`; }
function corkBoard() { let s = `<rect x="-1000" y="140" width="2000" height="760" rx="24" fill="#C98A4B" stroke="${INK}" stroke-width="10"/><rect x="-970" y="170" width="1940" height="700" rx="14" fill="#D9A866"/>`; for (let i = 0; i < 70; i++) s += `<circle cx="${-950 + (i*271 % 1900)}" cy="${190 + (i*137 % 660)}" r="${3 + i%3}" fill="#B07A45" opacity=".5"/>`; return s; }
const NOTES = [['RULE 1', 'NO HAIRCUTS', -640, 330, -5, ST[1] + .9], ['RULE 2', 'NOT IMMOVABLE', -220, 290, 4, ST[1] + 2.6], ['RULE 3', 'NOT STRONG', 200, 330, -3, ST[1] + 1.8], ['RULE 4', 'LAVA: YOU FLOAT', 620, 290, 5, ST[1] + 3.4], ['RULE 5', 'STILL NEED AIR', -10, 650, -2, ST[1] + 4.4], ['RULE 4½', 'SPARE HOODIES', 520, 660, 3, ST[1] + 5.0]];
const SHOTS_E = [
  { t: 0, ref: RE, cam: push(0, 3.0, { x: 0, y: 760, z: 1.35, r: 0 }, { x: 0, y: 760, z: 1.45, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t)) + L(1, studioFloor() + dexP([[0, 'think'], [1.6, { ...POSES.think, look:[-6,-8], eyes:'closed' }, 'o']], t, () => ({ x: 0, y: GY }))) + `<g transform="translate(960,200) scale(${pop(t, ST[0] + .2, .4)})">${txt('WOULD YOU SURVIVE', 0, 0, 92, '#FFFFFF')}${txt('DAY TWO?', 0, 110, 120, '#FFC21F')}</g>` },
  { t: 3.0, ref: RE, cam: push(3.0, 5.5, { x: 0, y: 780, z: 1.45, r: -3 }, { x: 0, y: 780, z: 1.55, r: -4 }, 'lin'), draw: (t, c, L) => {
      const b = Math.abs(Math.sin((t - 3.0)*5)), pos = () => ({ x: 0, y: GY - 80*b });
      const o = dexAt([[0, { ...POSES.cheer, eyes:'happy', mouth:'laugh', sparkle:true }]], t, pos, { s: DS, air: b > .1, sq: b < .15 ? .9 : 1.05 });
      return L(0, studioBack(t)) + L(1, studioFloor() + chibi2(o)) + `<g transform="translate(1440,480) rotate(-10) scale(${pop(t, ST[0] + 2.6, .25)})"><rect x="-200" y="-100" width="400" height="200" rx="26" fill="none" stroke="#7ED957" stroke-width="18"/>${txt('YES.', 0, 44, 130, '#7ED957')}</g>`; } },
  { t: 5.5, ref: RE, cam: push(5.5, WE[0], { x: -120, y: 800, z: 1.4, r: 2 }, { x: 120, y: 800, z: 1.5, r: -2 }, 'io'), draw: (t, c, L) => {
      let shield = ''; const k = E.o(seg(t, 5.7, 6.3)); for (let i = 0; i < 18; i++) { const a = i/18*6.283; shield += `<path transform="translate(${Math.cos(a)*260*k},${GY - 190 + Math.sin(a)*260*k})" d="M0,-26 L23,-13 L23,13 L0,26 L-23,13 L-23,-13 Z" fill="#7FD3FF" opacity="${.2 + .12*Math.sin(t*4 + i)}" stroke="#BFE6FF" stroke-width="3"/>`; }
      return L(0, studioBack(t)) + L(1, studioFloor() + shield + dex([[0, 'confident']], t, 0, GY)) + chipAt(t, ST[0] + 5.2, 960, 150, 'BEST SURVIVAL POWER', '#7ED957', 60); } },
  // it's a trap: the rules board
  { t: WE[0], ref: RE, cam: [[WE[0], { x: -300, y: 600, z: 1.25, r: 0 }], [ST[1] + 3.0, { x: 250, y: 600, z: 1.25, r: 0 }, 'io'], [14.9, { x: 0, y: 600, z: 1.0, r: 0 }, 'io']], draw: (t, c, L) => {
      let n = ''; NOTES.forEach(([a, b, x, y, r, at]) => n += miniNote2(t, at, x, y, a, b, r));
      return L(0, studioBack(t)) + L(1, corkBoard() + n + dex([[0, { ...POSES.point, armF:[110,-30] }], [ST[1] + 3.2, { ...POSES.point, armF:[120,-40], tilt:6 }, 'o']], t, c.x - 560, 1030, { flip: false })) + chipAt(t, ST[1] + .2, 960, 80, 'BUT IT’S A TRAP', '#E8463C', 62); } },
  { t: 14.9, ref: RE, cam: push(14.9, WE[1], { x: 0, y: 640, z: 1.3, r: 0 }, { x: 0, y: 600, z: 2.0, r: 0 }, 'in'), draw: (t, c, L) => {
      const d = seg(t, 14.9, 15.3);
      return L(0, studioBack(t, '#141832', '#0B0C16', '#1E2450')) + L(1, `<path d="M-380,${GY + 40} L-120,-400 L120,-400 L380,${GY + 40} Z" fill="#FFF6C8" opacity=".14"/><ellipse cx="0" cy="${GY + 10}" rx="320" ry="40" fill="#FFF6C8" opacity=".18"/>` + dex([[0, { ...POSES.worried, mouth:'flat', brow:4, browA:6 }], [17.2, { ...POSES.lookCam, eyes:'determined', mouth:'flat', browA:10 }, 'o']], t, 0, GY)) +
        `<rect width="1920" height="1080" fill="#000" opacity="${.3*(1 - d)}"/>` + `<g transform="translate(960,1000) scale(${pop(t, ST[1] + 6.6, .35)})">${chip('MOST DANGEROUS: THINKING YOU’RE UNSTOPPABLE', 0, 0, '#E8463C', 50)}</g>`; } },
  { t: WE[1], ref: RE, cam: push(WE[1], WE[2], { x: 300, y: 560, z: 1.05, r: 0 }, { x: 300, y: 560, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#FFF6E0', '#FFE7B8', '#FFEBC4')) + L(1, dex([[0, { ...POSES.idleB, tilt:-6 }], [21.2, 'confident', 'o']], t, 900, GY)) + `<g transform="translate(860,360) scale(${pop(t, ST[2] + .2, .4)})">${txt('UNBREAKABLE', 0, -60, 130, '#3D8BFF')}${txt('≠', 0, 50, 110, '#FFFFFF')}${txt('UNSTOPPABLE', 0, 170, 130, '#E8463C')}</g>` },
  { t: WE[2], ref: RE, cam: push(WE[2], DAY3, { x: 300, y: 600, z: 1.1, r: 0 }, { x: 300, y: 600, z: 1.2, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#FFD7E2', '#FFF0F4', '#FFE0EA')) + L(1, dex([[0, { ...POSES.point, armF:[100,40], handF:'point', armLen:1.2 }], [26.0, { ...POSES.wave, eyes:'happy' }, 'o']], t, 780, GY)) +
      `<g transform="translate(860,380) scale(${pop(t, ST[3] + .2, .35)})"><rect x="-560" y="-170" width="1120" height="300" rx="50" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M360,128 L460,230 L260,128 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="250" y="122" width="120" height="16" fill="#fff"/>${txt('WHICH RULE SURPRISED', 0, -50, 72, INK, 'middle', 0)}${txt('YOU THE MOST?', 0, 50, 84, '#E8463C', 'middle', 0)}</g>` + chipAt(t, ST[3] + 1.6, 560, 880, 'TELL ME IN THE COMMENTS', '#3D8BFF', 54) },
  { t: DAY3, ref: RE, cam: push(DAY3, WE[3], { x: 0, y: 540, z: 1, r: 0 }, { x: 0, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = pop(t, DAY3, .3), sh = (1 - seg(t, DAY3, DAY3 + .5))*12, hue = (t*120) % 360;
      return L(0, `<rect x="-3000" y="-3000" width="6000" height="6000" fill="#0B0C16"/>`) + L(1, `<circle cx="0" cy="760" r="${260 + 20*Math.sin(t*6)}" fill="hsl(${hue},90%,60%)" opacity=".25" filter="url(#b14)"/><g filter="url(#impInk)">${chibi2({ ...DEX2, ...mixPose(POSES.ready, POSES.ready, 1), x: 0, y: 980, s: .9, t })}</g>`) +
        `<g transform="translate(${960 + Math.sin(t*80)*sh},300) scale(${k})">${txt('DAY 3:', 0, -40, 110, '#FFFFFF')}${txt('???', 0, 120, 180, '#FFC21F')}</g>`; } },
  // end card (static camera)
  { t: WE[3], ref: RE, cam: hold(WE[3], { x: 0, y: 540, z: 1, r: 0 }), draw: (t, c, L) => {
      let s = L(0, studioBack(t)) + `<g transform="translate(960,130) scale(${pop(t, ST[4] + .2, .35)})">${txt('NEXT: DAY 3 — A POWER YOU PICKED', 0, 0, 70, '#FFC21F')}</g>`;
      s += `<rect x="200" y="260" width="900" height="506" rx="26" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/><circle cx="1440" cy="513" r="190" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/><g transform="translate(1440,780)">${chip('SUBSCRIBE', 0, 0, '#E8463C', 54)}</g>`;
      const pk = E.o(seg(t, ST[4] + .6, ST[4] + 1.4));
      const K = [[0, { ...POSES.point, armF:[150,-30], armLen:1.3, handF:'point', tilt:-10, eyes:'happy', mouth:'grin' }], [38.0, { ...POSES.wave, eyes:'happy', mouth:'grin' }, 'o'], [39.5, { ...POSES.point, armF:[150,-30], armLen:1.3, handF:'point', tilt:-10, eyes:'happy', mouth:'grin' }, 'o']];
      s += chibi2(dexAt(K, t, () => ({ x: 1745, y: lerp(1500, 1250, pk) }), { s: 1.2, seed: 6 }));
      const pe = seg(t, ST[4] + 12, ST[4] + 12.6)*(1 - seg(t, ST[4] + 14.2, ST[4] + 14.8));   // easter egg: the red hood peeks
      if (pe > 0) s += `<g opacity="${pe}">${mystery(1650, 720 + 80*(1 - pe), .55, pe)}</g><circle cx="1440" cy="513" r="190" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/>`;
      return s; } },
];
function scene(t) { let s = playShots(t, SHOTS_E, [[DAY3, 8, .5]]) + vignette(); WE.forEach(w => s += wipe(t, w)); return s; }
