// RIG2
// Ep2 Earth-core segment (x), Rig 2.0. Timing from t_x.js. END 40.26.
const RX = { x: 0, y: 540, z: 1 }, RG = { x: 0, y: 700, z: 1 };
const WX2 = [ST[3] - .2, ST[4] - .2, ST[5] - .2];
const ER = 1000;   // earth radius in world px (centre at 0,0)
function starfield(t) { let s = `<rect x="-8000" y="-8000" width="16000" height="16000" fill="#0E1024"/>`; for (let i = 0; i < 160; i++) s += `<circle cx="${-3000 + (i*487 % 6000)}" cy="${-3000 + (i*263 % 6000)}" r="${1.5 + i%3}" fill="#fff" opacity="${.4 + .4*Math.sin(t*2 + i)}"/>`; return s; }
function earthX(t, notch=0, labels=true) {
  let s = `<circle r="${ER*1.06}" fill="#4E6BD8" opacity=".25"/><circle r="${ER}" fill="#2E8BD9" stroke="${INK}" stroke-width="10"/>`;
  s += `<path d="M-700,-700 Q-400,-820 -200,-640 Q0,-520 160,-760 Q420,-860 640,-640 L620,-560 Q300,-600 0,-470 Q-300,-420 -660,-560 Z" fill="#5CB487" stroke="${INK}" stroke-width="6"/>`;
  // cut-away quarter (bottom right) showing the layers
  const L = [[ER*.985, '#8A5A3B', 'CRUST'], [ER*.97, '#E8693C', 'MANTLE'], [ER*.55, '#FF9A3D', 'OUTER CORE'], [ER*.19, '#FFF3B0', 'INNER CORE']];
  s += `<path d="M0,0 L0,${-ER} A${ER},${ER} 0 0 1 ${ER},0 Z" fill="#8A5A3B" stroke="${INK}" stroke-width="8"/>`;
  L.slice(1).forEach(([r, c]) => s += `<path d="M0,0 L0,${-r} A${r},${r} 0 0 1 ${r},0 Z" fill="${c}" stroke="${INK}" stroke-width="6"/>`);
  s += `<circle r="${ER*.19}" fill="#FFF3B0" stroke="${INK}" stroke-width="6"/><circle r="${ER*.19 + 30 + 10*Math.sin(t*3)}" fill="#FFF3B0" opacity=".25"/>`;
  if (labels) s += [[-ER*.99, 'CRUST', 120, -ER*.99], [-ER*.75, 'MANTLE', 360, -ER*.6], [-ER*.37, 'OUTER CORE', 330, -ER*.28], [0, 'INNER CORE', 120, -40]].map(([y, lab, x, ly]) => `<text x="${x}" y="${ly}" font-family="Lilita One" font-size="50" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke">${lab}</text>`).join('');
  if (notch) s += `<rect x="-14" y="${-ER - 4}" width="28" height="${ER*.0019 + 8}" fill="#FFF07A" stroke="${INK}" stroke-width="3"/>`;
  return s;
}
function coreWorld(t) {
  let s = `<defs><radialGradient id="coreG" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#FFF8D0"/><stop offset=".5" stop-color="#FFC34D"/><stop offset="1" stop-color="#E8693C"/></radialGradient></defs><rect x="-6000" y="-6000" width="12000" height="12000" fill="url(#coreG)"/>`;
  for (let i = 0; i < 60; i++) { const a = i*2.4 + t*.2, r = 200 + (i*137 % 1500); s += `<circle cx="${Math.cos(a)*r}" cy="${540 + Math.sin(a)*r*.6}" r="${4 + i%5}" fill="#FFF8D0" opacity="${.3 + .3*Math.sin(t*3 + i)}"/>`; }
  for (let i = 0; i < 6; i++) s += `<path d="M${-1500 + i*600},${300 + Math.sin(t + i)*60} q200,-80 400,0 t400,0" stroke="#FF9A3D" stroke-width="18" fill="none" opacity=".35"/>`;
  return s;
}
function shovel(x, y, rot, bent) { return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-10" y="-260" width="20" height="300" fill="#B07A4A" stroke="${INK}" stroke-width="5"/><rect x="-36" y="-290" width="72" height="22" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="5"/><path d="${bent ? 'M-50,40 Q0,20 50,90 L-20,120 Z' : 'M-50,40 L50,40 L40,150 Q0,180 -40,150 Z'}" fill="#C9D2E6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; }
function digGarden(t, L, blur='') {
  return L(0, skyW(t)) + L(.5, hills(t, 760, false) + fence(GY - 40), blur && 'b4') + L(1, grassGround(GY - 40) + `<ellipse cx="260" cy="${GY + 20}" rx="230" ry="44" fill="#5A3A2A" stroke="${INK}" stroke-width="6"/><path d="M-560,${GY + 30} Q-460,${GY - 90} -330,${GY + 30} Z" fill="#8E6A4A" stroke="${INK}" stroke-width="6"/>`);
}
function rig(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-90,0 L0,-420 L90,0 M-70,-90 L70,-90 M-50,-190 L50,-190 M-30,-290 L30,-290 M-90,0 L50,-190 M90,0 L-50,-190" stroke="#8C93B8" stroke-width="12" fill="none" stroke-linejoin="round"/><rect x="-120" y="-20" width="240" height="40" rx="8" fill="#5A6090" stroke="${INK}" stroke-width="6"/><circle cy="-430" r="16" fill="#E8463C" stroke="${INK}" stroke-width="5"/></g>`; }
const SHOTS_X = [
  { t: 0, ref: RG, cam: [[0, { x: 0, y: GY - 330, z: 1.6, r: 0 }], [2.6, { x: 0, y: GY - 300, z: 1.75, r: 0 }, 'lin'], [3.0, { x: 0, y: GY + 300, z: 1.75, r: 0 }, 'in']], draw: (t, c, L) =>
      digGarden(t, L) + L(1, dex([[0, { ...POSES.think, look:[0,10] }], [1.6, { ...POSES.point, armF:[30,20], handF:'point', look:[0,12] }, 'o']], t, -260, GY)) + chipAt(t, .5, 960, 140, 'EVEN DEEPER?', '#3D8BFF', 60) },
  { t: 3.0, ref: RX, cam: push(3.0, 6.6, { x: 0, y: -380, z: .75, r: 0 }, { x: 200, y: -300, z: .9, r: -3 }, 'io'), draw: (t, c, L) =>
      L(0, starfield(t)) + L(1, earthX(t) + `<g transform="translate(-160,${-ER - 2})">${chibi2({ ...DEX2, ...mixPose(POSES.lookCam, POSES.lookCam, 1), x: 0, y: 0, s: .35, t })}</g>`) + chipAt(t, 3.3, 960, 120, 'TO THE CENTRE OF THE EARTH?', '#3D8BFF', 60) },
  { t: 6.6, ref: RX, cam: push(6.6, 11.0, { x: 200, y: -300, z: .9, r: -3 }, { x: 60, y: -40, z: 2.6, r: 0 }, 'in'), draw: (t, c, L) =>
      L(0, starfield(t)) + L(1, earthX(t)) + chipAt(t, ST[1] + 1.6, 1350, 240, '5,000+ °C', '#E8463C', 66) + chipAt(t, ST[1] + 2.4, 1350, 360, '≈ THE SUN’S SURFACE', '#FF8A3D', 52) },
  { t: 11.0, ref: RX, cam: push(11.0, 15.9, { x: 0, y: 540, z: 1.4, r: 0 }, { x: 0, y: 540, z: 1.55, r: 2 }, 'lin'), draw: (t, c, L) => {
      const k = E.o(seg(t, 11.2, 11.9)); let arrows = '';
      for (let i = 0; i < 10; i++) { const a = i/10*6.283, r0 = 380 - 40*Math.sin(t*5 + i); arrows += `<g transform="translate(${Math.cos(a)*r0*k},${380 + Math.sin(a)*r0*k}) rotate(${a*57.3 + 180})"><path d="M0,-16 L70,-16 L70,-34 L110,0 L70,34 L70,16 L0,16 Z" fill="#B07CFF" stroke="${INK}" stroke-width="5" opacity="${k}"/></g>`; }
      return L(0, coreWorld(t)) + L(1, arrows + dex([[0, { ...POSES.idle, armF:[60,40], armB:[-60,-40] }], [13.6, { ...POSES.shrug, eyes:'happy' }, 'o']], t, 0, 540 + 150, { air: true })) + chipAt(t, ST[1] + 4.4, 960, 140, '3 MILLION+ × AIR PRESSURE', '#B07CFF', 58); } },
  { t: 15.9, ref: RX, cam: push(15.9, 18.4, { x: 0, y: 460, z: 2.0, r: 0 }, { x: 0, y: 460, z: 2.2, r: -2 }, 'lin'), draw: (t, c, L) =>
      L(0, coreWorld(t)) + L(1, dex([[0, 'smile'], [ST[2] + .3, 'peace', 'o'], [17.3, { ...POSES.confident, eyes:'happy', mouth:'grin' }, 'o']], t, 0, 690, { air: true }) + sparkles(0, 460, t, 6, 210)) + chipAt(t, ST[2] + .3, 1450, 260, 'EASILY ✓', '#7ED957', 60) },
  { t: 18.4, ref: RX, cam: push(18.4, WX2[0], { x: 80, y: -560, z: 1.0, r: 0 }, { x: 60, y: -480, z: .85, r: 0 }, 'io'), draw: (t, c, L) => {
      const k = E.io(seg(t, ST[2] + 2.2, ST[2] + 3.4));
      return L(0, starfield(t)) + L(1, earthX(t) + `<path d="M-160,${-ER} L-160,${-ER + k*(ER - 40)}" stroke="#fff" stroke-width="14" stroke-dasharray="40 26"/>` + `<g transform="translate(-160,${-ER - 2})">${chibi2(dexAt([[0, { ...POSES.think, look:[0,10] }]], t, () => ({ x: 0, y: 0 }), { s: .4 }))}</g>`) +
        (t > ST[2] + 3.4 ? `<g transform="translate(1250,620) scale(${pop(t, ST[2] + 3.4, .3)})">${txt('?', 0, 0, 160, '#FFC21F')}</g>` : '') + chipAt(t, ST[2] + 2.3, 1450, 200, '6,371 km DOWN', '#3D8BFF', 54); } },
  // digging
  { t: WX2[0], ref: RG, cam: push(WX2[0], ST[3] + 2.6, { x: 60, y: GY - 300, z: 1.55, r: 0 }, { x: 60, y: GY - 300, z: 1.7, r: 0 }, 'lin'), draw: (t, c, L) => {
      const dig = Math.max(0, Math.sin((t - ST[3])*6));
      return digGarden(t, L) + L(1, dex([[0, { ...POSES.ready, armF:[70,20], armB:[60,20], eyes:'squeeze', mouth:'grit', sweat:true }]], t, 0, GY, { sq: 1 - dig*.06 }) + shovel(200, GY - 170 + dig*60, 20 + dig*12, false)) + note(t, ST[3] + .6, 1520, 250, 'RULE 3', 'NOT', 'STRONG.', 4); } },
  { t: ST[3] + 2.6, ref: RG, cam: push(ST[3] + 2.6, WX2[1], { x: 200, y: GY - 120, z: 2.6, r: 4 }, { x: 160, y: GY - 200, z: 2.0, r: 0 }, 'io'), draw: (t, c, L) => {
      const a = ST[3] + 2.6, vib = Math.sin(t*90)*8*Math.exp(-(t - a)*3);
      return digGarden(t, L, 'b4') + L(1, `<g transform="translate(${vib},0)">${dex([[0, { ...POSES.surprise, eyes:'swirl', mouth:'wobble', armF:[70,20], armB:[60,20] }]], t, 0, GY)}</g>` + shovel(210, GY - 110, 30, true) + `<path d="M150,${GY + 30} l40,-20 l40,20 l30,-14" stroke="${INK}" stroke-width="5" fill="#8C8696"/>`) + bang(t, a, 1300, 300, 'BOINK', '#FFC21F', 120, 8, a + 1.4) + chipAt(t, a + .6, 520, 220, 'SOLID ROCK: 1  DEX: 0', '#E8463C', 50); } },
  // Kola: the deepest hole, then its true scale
  { t: WX2[1], ref: RX, cam: [[WX2[1], { x: 0, y: -ER - 80, z: 6, r: 0 }], [29.0, { x: 0, y: -ER - 60, z: 6, r: 0 }, 'lin'], [30.8, { x: 0, y: -280, z: .62, r: 0 }, 'io']], draw: (t, c, L) =>
      L(0, starfield(t)) + L(1, earthX(t, 1, false) + `<g transform="translate(0,${-ER})">${rig(0, 0, .05)}</g>`) + chipAt(t, ST[4] + 1.0, 960, 140, 'DEEPEST HOLE EVER: ≈ 12 km', '#FFC21F', 58) + chipAt(t, ST[4] + 1.4, 960, 250, 'KOLA SUPERDEEP BOREHOLE', '#3D8BFF', 46) },
  { t: 30.8, ref: RX, cam: push(30.8, WX2[2], { x: 0, y: -280, z: .62, r: 0 }, { x: 0, y: -280, z: .66, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, starfield(t)) + L(1, earthX(t, 1) + `<circle cx="0" cy="${-ER}" r="70" fill="none" stroke="#FFF07A" stroke-width="10"/><path d="M50,${-ER - 50} L260,${-ER - 260}" stroke="#FFF07A" stroke-width="10"/>`) + chipAt(t, ST[4] + 4.2, 1460, 420, '≈ 0.2% OF THE WAY', '#E8463C', 60) + chipAt(t, ST[4] + 4.6, 1460, 540, '12 ÷ 6,371 km', '#3D8BFF', 46) },
  // no air
  { t: WX2[2], ref: RX, cam: push(WX2[2], END, { x: 200, y: 450, z: 1.6, r: 0 }, { x: 200, y: 450, z: 1.75, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.surprise, eyes:'wide', mouth:'flat', sweat:true }], [37.0, { ...POSES.worried, eyes:'squeeze', mouth:'flat', sweat:true }, 'o']];
      return L(0, coreWorld(t)) + L(1, dex(K, t, -80, 690, { air: true }) + `<circle cx="${-80 - 48*DS}" cy="${690 - 210*DS}" r="20" fill="#FF8C9A"/><circle cx="${-80 + 48*DS}" cy="${690 - 210*DS}" r="20" fill="#FF8C9A"/>`) + note(t, ST[5] + .2, 1440, 330, 'RULE 5', 'THERE’S', 'NO AIR.', 4); } },
];
function scene(t) { let s = playShots(t, SHOTS_X, [[ST[3] + 2.6, 14, .4]]) + vignette(); WX2.forEach(w => s += wipe(t, w)); return s; }
