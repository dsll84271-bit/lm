// RIG2
// Ep2 lava segment (l), Rig 2.0. Timing from t_l.js. END 43.84.
const RL = { x: 0, y: 700, z: 1 };
const WL = [ST[3] - .2, ST[4] - .2];
const JUMP = ST[0] + DU[0] + .2, SPL = JUMP + 1.0, SURF = GY - 40, LEDGE = -900;
// ---------------------------------------------------------------- sets
function volcanoSky(t, night) {
  let s = night ? `<rect x="-6000" y="-4000" width="12000" height="8000" fill="#1B1430"/>` + [...Array(60)].map((_, i) => `<circle cx="${-3000 + (i*397 % 6000)}" cy="${-800 + (i*211 % 1300)}" r="${2 + i%3}" fill="#fff" opacity="${.4 + .4*Math.sin(t*2 + i)}"/>`).join('')
    : `<defs><linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A5B"/><stop offset=".7" stop-color="#FFC48A"/><stop offset="1" stop-color="#FFE3B8"/></linearGradient></defs><rect x="-6000" y="-4000" width="12000" height="8000" fill="url(#vsky)"/><circle cx="1200" cy="80" r="600" fill="url(#sunG)"/>`;
  return s;
}
function volcanoFar(t, night) {
  const col = night ? '#2A1A2E' : '#6E3B3B', col2 = night ? '#33203A' : '#7E4646';
  let s = `<path d="M-2000,${GY - 40} L-660,470 L-460,470 L700,${GY - 40} Z" fill="${col}" stroke="${INK}" stroke-width="8"/><path d="M-660,470 Q-560,500 -460,470 L-500,520 L-620,520 Z" fill="#FF6A2A"/><path d="M-600,520 Q-660,600 -620,680 Q-580,760 -660,860 Q-700,930 -640,1000" stroke="#FF6A2A" stroke-width="20" fill="none" stroke-linecap="round" opacity=".85"/><path d="M-600,520 Q-660,600 -620,680 Q-580,760 -660,860" stroke="#FFC34D" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`;
  s += `<path d="M900,${GY - 40} L1900,600 L2060,600 L3200,${GY - 40} Z" fill="${col2}" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 6; i++) { const p = (t*.12 + i/6) % 1; s += `<circle cx="${-560 + Math.sin(p*5 + i)*80}" cy="${450 - p*900}" r="${70 + p*220}" fill="${night ? '#4A3A5E' : '#8C7F8E'}" opacity="${.55*(1 - p)}"/>`; }
  return s + `<rect x="-6000" y="${GY - 160}" width="12000" height="200" fill="#FF8A3D" opacity="${night ? .25 : .15}"/>`;
}
function rocksMid(night) { const c = night ? '#2E2238' : '#4A3A4E';
  return `<path d="M-3000,${GY - 60} L-2400,${GY - 210} L-1900,${GY - 120} L-1500,${GY - 260} L-1100,${GY - 90} L1100,${GY - 90} L1500,${GY - 230} L2000,${GY - 140} L2500,${GY - 300} L3000,${GY - 60} Z" fill="${c}" stroke="${INK}" stroke-width="7"/>`; }
function ledge(night) { return `<path d="M-2400,${GY - 200} L${LEDGE + 300},${GY - 210} L${LEDGE + 420},${GY + 400} L-2400,${GY + 400} Z" fill="${night ? '#2E2238' : '#4A3A4E'}" stroke="${INK}" stroke-width="8"/><path d="M${LEDGE - 200},${GY - 190} l80,40 l60,-10 M${LEDGE + 100},${GY - 120} l60,50" stroke="#2A1F2E" stroke-width="6" fill="none"/>`; }
function volcano(t, L, opt={}) {
  const night = !!opt.night, blur = opt.blur || '';
  return L(0, volcanoSky(t, night)) + L(.3, volcanoFar(t, night), blur && 'b8') + L(.65, rocksMid(night), blur && 'b4') + L(1, lavaW(t, SURF) + (opt.ledge ? ledge(night) : ''));
}
function lavaFront(t, x0=-6000, x1=6000) { let d = `M${x0},${SURF + 14}`; for (let x = x0; x <= x1; x += 80) d += ` L${x},${SURF + 14 + Math.sin(x/90 + t*2.2)*7}`;
  return `<path d="${d} L${x1},${SURF + 900} L${x0},${SURF + 900} Z" fill="#FF6A2A" opacity=".93"/><path d="${d}" stroke="#FFC34D" stroke-width="8" fill="none" opacity=".9"/>`; }
// Dex floating on his back: body centre at the surface, lower half under the lava
function floater(t, x, sink=0, extra={}, keys=null) {
  const K = keys || [[0, { eyes:'happy', mouth:'smile', armF:[150,40], armB:[-150,-40], acc:'shades' }]];
  const bob = Math.sin(t*2.4)*7 + sink;
  const o = dexAt(K, t, () => ({ x, y: SURF + 150*DS - 22 + bob }), { s: DS, air: true, noShadow: true, rot: -90, seed: 5, ...extra });
  return chibi2(o) + `<ellipse cx="${x}" cy="${SURF + 16}" rx="${260 + 20*Math.sin(t*3)}" ry="22" fill="none" stroke="#FFE07A" stroke-width="6" opacity=".7"/>`;
}
function rubberDuck(x, y, s, t) { return `<g transform="translate(${x},${y + Math.sin(t*2.4 + 1)*8}) scale(${s}) rotate(${Math.sin(t*1.7)*5})"><ellipse cx="0" cy="0" rx="70" ry="44" fill="#FFD21F" stroke="${INK}" stroke-width="6"/><path d="M-60,-10 Q-90,-30 -70,-50" fill="#FFD21F" stroke="${INK}" stroke-width="6"/><circle cx="40" cy="-50" r="34" fill="#FFD21F" stroke="${INK}" stroke-width="6"/><path d="M70,-50 l34,6 l-34,10 Z" fill="#FF8A3D" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="-58" r="6" fill="${INK}"/><path d="M-20,-14 Q0,0 24,-10" stroke="#E8B000" stroke-width="6" fill="none"/></g>`; }
function thermo(x, y, k) { return `<g transform="translate(${x},${y})"><rect x="-34" y="-520" width="68" height="520" rx="34" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-18" y="${-500*k - 10}" width="36" height="${500*k}" rx="18" fill="#E8463C"/><circle cy="20" r="60" fill="#E8463C" stroke="${INK}" stroke-width="7"/>${[0,1,2,3,4].map(i => `<path d="M34,${-100 - i*100} l26,0" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`; }
function heatHaze(t, n=10) { let s = ''; for (let i = 0; i < n; i++) { const p = (t*.5 + i/n) % 1; s += `<path d="M${-600 + i*140},${SURF - 40 - p*400} q20,-30 0,-60 q-20,-30 0,-60" stroke="#FFF2C8" stroke-width="5" fill="none" opacity="${.35*(1 - p)}"/>`; } return s; }
function densityPanel(t) {
  const k = E.io(seg(t, ST[1] + 2.6, ST[1] + 4.0));
  return `<g transform="translate(1340,420) scale(${pop(t, ST[1] + 2.2, .35)})"><rect x="-380" y="-250" width="760" height="460" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/><text y="-180" text-anchor="middle" font-family="Lilita One" font-size="46" fill="${INK}">DENSITY (× WATER)</text>` +
    [['LAVA', 2.6, '#FF6A2A'], ['WATER', 1.0, '#3D8BFF'], ['DEX', 1.0, '#FFC21F']].map(([n, v, c], i) => `<text x="-340" y="${-90 + i*110}" font-family="Lilita One" font-size="44" fill="${INK}">${n}</text><rect x="-130" y="${-128 + i*110}" width="${170*v*k}" height="56" rx="14" fill="${c}" stroke="${INK}" stroke-width="5"/><text x="${-110 + 170*v*k + 20}" y="${-86 + i*110}" font-family="Lilita One" font-size="42" fill="${INK}">${n === 'LAVA' ? '≈' : ''}${(v*k).toFixed(1)}</text>`).join('') + `</g>`;
}
function ketchup(t) {   // ketchup vs lava: two slow pours side by side
  const k = seg(t, 15.4, 17.6);
  const pour = (x, col, lab) => `<g transform="translate(${x},0)"><rect x="-70" y="200" width="140" height="240" rx="40" fill="${col}" stroke="${INK}" stroke-width="7" transform="rotate(160,0,320)"/><path d="M-12,470 Q${-16 + Math.sin(t*3)*4},${520 + 300*k} 0,${560 + 380*k} Q${16},${520 + 300*k} 12,470 Z" fill="${col}" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="${980}" rx="${40 + 160*k}" ry="${10 + 26*k}" fill="${col}" stroke="${INK}" stroke-width="6"/><text y="1050" text-anchor="middle" font-family="Lilita One" font-size="56" fill="${INK}">${lab}</text></g>`;
  return `<g transform="translate(0,80)">${pour(-330, '#E8463C', 'KETCHUP') + pour(330, '#FF8A3D', 'LAVA')}</g>`;
}
// ---------------------------------------------------------------- shots
const SHOTS_L = [
  { t: 0, ref: RL, cam: push(0, 2.6, { x: -700, y: 720, z: .95, r: 0 }, { x: -450, y: 760, z: 1.05, r: 2 }, 'io'), draw: (t, c, L) => volcano(t, L, { ledge: true }) + L(1, heatHaze(t)) + chipAt(t, .6, 960, 140, 'NEXT STOP: A VOLCANO', '#E8463C', 58) },
  { t: 2.6, ref: RL, cam: push(2.6, 5.0, { x: 100, y: SURF - 200, z: 1.9, r: -3 }, { x: 100, y: SURF - 220, z: 2.1, r: -4 }, 'lin'), draw: (t, c, L) =>
      volcano(t, L, { blur: 'b8' }) + L(1, heatHaze(t, 14) + thermo(380, SURF - 60, .25 + .7*E.io(seg(t, 2.8, 4.2)))) + chipAt(t, ST[0] + 2.4, 1350, 170, 'LAVA: 1,000+ °C', '#E8463C', 62) },
  { t: 5.0, ref: RL, cam: push(5.0, JUMP - .1, { x: LEDGE + 60, y: GY - 420, z: 1.75, r: 0 }, { x: LEDGE + 60, y: GY - 420, z: 1.9, r: 1 }, 'lin'), draw: (t, c, L) => {
      const K = [[5.0, { ...POSES.smile, acc:'shades' }], [5.5, { ...POSES.stretchUp, acc:'shades' }, 'o'], [6.2, { ...POSES.cheer, acc:'shades', eyes:'happy', mouth:'grin' }, 'o'], [7.2, { ...POSES.crouchPop, acc:'shades' }, 'io']];
      return volcano(t, L, { ledge: true, blur: 'b4' }) + L(1, dexP(K, t, () => ({ x: LEDGE, y: GY - 205 }), { acc: 'shades' })); } },
  { t: JUMP - .1, ref: RL, cam: t => { const k = seg(t, JUMP, SPL); return { x: lerp(LEDGE + 300, 120, E.io(k)), y: lerp(GY - 420, SURF - 300, k), z: 1.25, r: lerp(-4, 4, k) }; }, draw: (t, c, L) => {
      const k = seg(t, JUMP, SPL), pos = { x: lerp(LEDGE, 0, k), y: lerp(GY - 205, SURF + 80, k) - 420*4*k*(1 - k) };
      const o = dexAt([[0, { ...POSES.popJump, acc:'shades' }], [JUMP + .5, { ...POSES.dive, eyes:'happy', mouth:'grin', acc:'shades' }]], t, () => pos, { s: DS, air: true, rot: -100*E.io(k), acc: 'shades' });
      return volcano(t, L, { ledge: true }) + L(1, chibi2(o)) + chipAt(t, JUMP + .1, 960, 140, 'SWIM TIME!', '#3D8BFF', 60); } },
  { t: SPL, ref: RL, cam: push(SPL, ST[1], { x: 0, y: SURF - 120, z: 2.0, r: 3 }, { x: 0, y: SURF - 120, z: 2.2, r: 2 }, 'lin'), draw: (t, c, L) => {
      const b = -60*Math.exp(-(t - SPL)*5)*Math.cos((t - SPL)*14);
      return volcano(t, L, { blur: 'b4' }) + L(1, floater(t, 0, b, {}, [[0, { eyes:'wide', mouth:'o', armF:[150,40], armB:[-150,-40], acc:'shades' }]]) + lavaFront(t) + dust(0, SURF, t, SPL, 9, 1.2, '#FFB347', .8)) + bang(t, SPL, 1250, 330, 'PLOP?', '#FFF07A', 110, -6, SPL + 1.2); } },
  { t: ST[1], ref: RL, cam: push(ST[1], 12.0, { x: 0, y: SURF - 160, z: 1.7, r: 0 }, { x: 0, y: SURF - 160, z: 1.85, r: 0 }, 'lin'), draw: (t, c, L) => {
      const dunk = Math.max(0, Math.sin((t - ST[1] - .6)*4))*(t > ST[1] + .6 && t < ST[1] + 2.2 ? 40 : 0);
      return volcano(t, L, { blur: 'b2' }) + L(1, floater(t, 0, dunk, {}, [[0, { eyes:'squeeze', mouth:'grit', armF:[100,-20], armB:[-100,20], acc:'shades' }], [ST[1] + 1.8, { eyes:'open', mouth:'wobble', armF:[150,40], armB:[-150,-40], brow:8, acc:'shades' }, 'o']]) + lavaFront(t)) + chipAt(t, ST[1] + .2, 960, 140, 'EXCEPT… HE CAN’T', '#E8463C', 58); } },
  { t: 12.0, ref: RL, cam: push(12.0, 15.2, { x: 0, y: GY - 360, z: 1.4, r: 0 }, { x: 0, y: GY - 360, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#5A1E2E', '#3B1420', '#7A2E3A')) + L(1, studioFloor('#2E1420') + dexP([[0, { ...POSES.point, armF:[80,-40] }], [13.6, { ...POSES.surprise, eyes:'wide' }, 'o']], t, () => ({ x: -620, y: GY }))) + densityPanel(t) + chipAt(t, 12.1, 520, 140, 'MELTED ROCK', '#FF8A3D', 52) },
  { t: 15.2, ref: { x: 0, y: 540, z: 1 }, cam: push(15.2, ST[2] - .2, { x: 0, y: 580, z: 1.0, r: 0 }, { x: 0, y: 600, z: 1.08, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#FFF0D8', '#FFE0B0', '#FFE8C4')) + L(1, ketchup(t)) + chipAt(t, 15.3, 960, 110, 'AS THICK AS KETCHUP', '#FF8A3D', 60) },
  { t: ST[2] - .2, ref: RL, cam: push(ST[2] - .2, 21.0, { x: 0, y: SURF - 200, z: 1.35, r: 0 }, { x: 60, y: SURF - 200, z: 1.5, r: 2 }, 'io'), draw: (t, c, L) =>
      volcano(t, L) + L(1, floater(t, 0, 0, {}, [[0, { eyes:'open', mouth:'smile', armF:[150,40], armB:[-150,-40], acc:'shades' }], [19.2, { eyes:'happy', mouth:'grin', armF:[170,80], armB:[-170,-80], acc:'shades' }, 'o']]) + lavaFront(t) + heatHaze(t)) +
        chipAt(t, ST[2] + .5, 520, 300, 'DEX ≈ WATER', '#3D8BFF', 54) + chipAt(t, ST[2] + 2.0, 1400, 300, 'FLOATS ON TOP', '#7ED957', 54) },
  { t: 21.0, ref: RL, cam: push(21.0, WL[0], { x: 180, y: SURF - 160, z: 1.75, r: -2 }, { x: 140, y: SURF - 160, z: 1.95, r: 2 }, 'io'), draw: (t, c, L) =>
      volcano(t, L, { blur: 'b4' }) + L(1, floater(t, 0, 0, {}, [[0, { eyes:'happy', mouth:'grin', armF:[170,80], armB:[-170,-80], acc:'shades' }], [23.2, { eyes:'happy', mouth:'grin', armF:[110,-20], armB:[-170,-80], handF:'peace', acc:'shades' }, 'o']]) + rubberDuck(lerp(900, 430, E.io(seg(t, 21.0, 22.6))), SURF - 20, 1.1, t) + lavaFront(t)) + chipAt(t, ST[2] + 3.2, 960, 140, 'A RUBBER DUCK IN A VERY HOT BATH', '#FFC21F', 54) },
  // Hawaii
  { t: WL[0], ref: RL, cam: push(WL[0], 30.6, { x: -400, y: 760, z: .95, r: 0 }, { x: -200, y: 780, z: 1.1, r: 0 }, 'io'), draw: (t, c, L) =>
      volcano(t, L, { night: true }) + L(1, `<rect x="-6000" y="${SURF - 300}" width="12000" height="400" fill="#FF6A2A" opacity=".12"/>`) + chipAt(t, ST[3] + .8, 960, 140, 'HAWAII LAVA LAKE (2011)', '#B07CFF', 58) + chipAt(t, ST[3] + .1, 520, 260, 'WELL… MOSTLY', '#E8463C', 48, ST[3] + 2.6) },
  { t: 30.6, ref: RL, cam: push(30.6, 33.2, { x: 0, y: SURF - 60, z: 2.4, r: 3 }, { x: 0, y: SURF - 60, z: 2.7, r: 3 }, 'lin'), draw: (t, c, L) => {
      let b = ''; for (let i = 0; i < 40; i++) { const p = (t*.9 + i*.11) % 1; b += `<circle cx="${-500 + (i*97 % 1000)}" cy="${SURF + 120 - p*180}" r="${8 + (i % 4)*7}" fill="#FFE07A" fill-opacity=".25" stroke="#FFE07A" stroke-width="4" opacity="${1 - p}"/>`; }
      return volcano(t, L, { night: true, blur: 'b8' }) + L(1, b) + chipAt(t, ST[3] + 3.0, 960, 150, 'SO MANY GAS BUBBLES: LIGHTER THAN WATER', '#E8463C', 50); } },
  { t: 33.2, ref: RL, cam: push(33.2, WL[1], { x: 0, y: SURF - 160, z: 1.6, r: 0 }, { x: 0, y: SURF - 60, z: 2.0, r: -3 }, 'in'), draw: (t, c, L) => {
      const sink = 230*E.io(seg(t, ST[3] + 5.6, ST[3] + 8.8));
      let b = ''; for (let i = 0; i < 16; i++) { const p = (t*1.1 + i*.17) % 1; b += `<circle cx="${-260 + i*35}" cy="${SURF + 60 - p*140}" r="${8 + (i % 3)*6}" fill="none" stroke="#FFE07A" stroke-width="5" opacity="${1 - p}"/>`; }
      const K = [[0, { eyes:'open', mouth:'smile', armF:[150,40], armB:[-150,-40], acc:'shades' }], [ST[3] + 5.8, { eyes:'wide', mouth:'o', armF:[100,-40], armB:[-170,-60], sweat:true, acc:'shades', brow:12 }, 'snap']];
      const wave = sink > 150 ? `<g transform="translate(70,${SURF + 10}) rotate(${Math.sin(t*9)*18})"><rect x="-16" y="-90" width="32" height="90" rx="14" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle cy="-96" r="20" fill="url(#skin)" stroke="${INK}" stroke-width="5"/></g>` : '';
      return volcano(t, L, { night: true }) + L(1, floater(t, 0, sink, {}, K) + wave + lavaFront(t) + b) + (sink > 60 ? bang(t, ST[3] + 7.4, 1250, 360, 'GLUG', '#FFF07A', 100, 8) : ''); } },
  // rule 4
  { t: WL[1], ref: RL, cam: push(WL[1], END, { x: 60, y: SURF - 260, z: 1.4, r: 0 }, { x: 60, y: SURF - 260, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) =>
      volcano(t, L) + L(1, floater(t, -360, 0, {}, [[0, { eyes:'happy', mouth:'smile', armF:[170,80], armB:[-170,-80], acc:'shades' }]]) + `<g transform="translate(-130,${SURF + 10})"><path d="M0,0 L0,-300" stroke="${INK}" stroke-width="10"/><path d="M-190,-290 Q0,-430 190,-290 Z" fill="#7ED957" stroke="${INK}" stroke-width="7"/><path d="M-60,-300 Q0,-420 60,-300" stroke="#fff" stroke-width="10" fill="none" opacity=".6"/></g>` + rubberDuck(150, SURF - 20, .9, t) + lavaFront(t)) +
        note(t, ST[4], 1350, 390, 'RULE 4', 'YOU CAN’T SWIM', 'IN LAVA. (MOSTLY)') },
];
function scene(t) {
  let s = playShots(t, SHOTS_L, [[SPL, 14, .4]]) + vignette();
  WL.forEach(w => s += wipe(t, w));
  return s;
}
