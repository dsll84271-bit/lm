// RIG2
// Ep2 skydive segment (d), Rig 2.0. Timing from t_d.js. END 58.46.
const RD = { x: 0, y: 540, z: 1 }, RF = { x: 0, y: 700, z: 1 };
const JMP = ST[1] + DU[1] + .3, IMPD = ST[4] + .5, WD = ST[5] - .2, GONE = ST[8] + DU[8] + .6;
const speedAt = t => Math.min(200, 200*(1 - Math.exp(-(t - JMP)/3.2)));
const altAt = t => Math.max(0, 4000*(1 - seg(t, ST[2], IMPD)));
function planeSide(x, y, s, t, door=0) {
  return `<g transform="translate(${x},${y + Math.sin(t*1.5)*6}) scale(${s})"><path d="M-520,-30 Q-560,-110 -440,-120 L380,-120 Q560,-110 600,-40 Q560,40 380,50 L-440,50 Q-540,40 -520,-30 Z" fill="#F2F6FF" stroke="${INK}" stroke-width="10"/><path d="M-440,-120 L-560,-300 L-460,-300 L-330,-120 Z" fill="#E8463C" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M-60,10 L-260,220 L-120,220 L120,10 Z" fill="#C9D0EE" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>${[...Array(7)].map((_, i) => `<rect x="${-300 + i*90}" y="-90" width="50" height="40" rx="16" fill="#9FD8FF" stroke="${INK}" stroke-width="5"/>`).join('')}
  <rect x="300" y="-100" width="80" height="130" rx="10" fill="${door ? '#2B2F4A' : '#F2F6FF'}" stroke="${INK}" stroke-width="7"/><path d="M500,-90 Q560,-80 580,-50 L520,-50 Z" fill="#9FD8FF" stroke="${INK}" stroke-width="5"/><circle cx="604" cy="-40" r="10" fill="${INK}"/><g transform="translate(608,-40) rotate(${t*1500})"><rect x="-6" y="-90" width="12" height="180" rx="6" fill="#8C93B8" opacity=".6"/></g></g>`;
}
function aerial(t, L, blur='') {
  let back = `<rect x="-8000" y="-6000" width="16000" height="12000" fill="url(#sky2)"/><circle cx="-1300" cy="-200" r="900" fill="url(#sunG)"/>`;
  let mid = ''; for (let i = 0; i < 10; i++) mid += cloud(-3000 + ((i*740 - t*160) % 6000 + 6000) % 6000, 700 + (i%3)*150, 2 + (i%2));
  let near = ''; for (let i = 0; i < 6; i++) near += cloud(-3000 + ((i*1300 - t*500) % 6000 + 6000) % 6000, 1100 + (i%2)*120, 3);
  return L(0, back) + L(.35, mid, blur) + L(1.2, near, 'b4');
}
function cabin(t, L, blur='', wind=1) {
  let s = `<rect x="-6000" y="-4000" width="12000" height="8000" fill="#C9CFDF"/><rect x="-6000" y="${GY - 120}" width="12000" height="900" fill="#8C93B8" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${-1400 + i*340}" y="260" width="220" height="140" rx="60" fill="#9FD8FF" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="-2000" y="200" width="4000" height="18" fill="#E6E1F0"/><path d="M-1800,${GY - 120} L1800,${GY - 120}" stroke="#FFC21F" stroke-width="10" stroke-dasharray="40 30"/>`;
  // open door with sky rushing past
  let sky = ''; for (let i = 0; i < 6; i++) { const cy = ((i*260 - t*900) % 1100 + 1100) % 1100; sky += cloud(140 + (i*157 % 420), cy, 1.1); }
  s += `<rect x="80" y="${GY - 760}" width="600" height="640" rx="20" fill="#7ED0FF" stroke="${INK}" stroke-width="10"/><svg x="80" y="${GY - 760}" width="600" height="640" viewBox="0 0 600 640" overflow="hidden">${sky}${[...Array(10)].map((_, i) => `<rect x="${(i*61 + t*1400) % 700 - 60}" y="${(i*97) % 640}" width="${120 + (i*37) % 100}" height="6" rx="3" fill="#fff" opacity=".7"/>`).join('')}</svg>`;
  s += `<rect x="40" y="${GY - 800}" width="680" height="40" rx="10" fill="#E8463C" stroke="${INK}" stroke-width="7"/><text x="380" y="${GY - 770}" text-anchor="middle" font-family="Lilita One" font-size="30" fill="#fff">EXIT</text>`;
  return L(1, s, blur);
}
function ground(t, k) {   // patchwork landscape seen from above, scale grows as he falls (k 0..1)
  const sc = .22 + 5*Math.pow(k, 3);
  let g = `<g transform="translate(0,${lerp(1060, 620, k)}) scale(${sc})"><rect x="-6000" y="-3000" width="12000" height="6000" fill="#86D17C"/>`;
  for (let i = 0; i < 40; i++) g += `<rect x="${-3000 + (i % 8)*760}" y="${-2400 + Math.floor(i/8)*900}" width="${640 + (i*37 % 90)}" height="${760 + (i*53 % 80)}" rx="30" fill="${['#A6DD7A', '#6FBF5E', '#D9C27A', '#8FD07A'][i % 4]}"/>`;
  g += `<path d="M-6000,600 Q-2000,200 0,700 T6000,500" stroke="#3D8BFF" stroke-width="180" fill="none"/>`;
  return g + `<rect x="-200" y="-200" width="400" height="400" fill="#5CB487"/></g>`;
}
function freefallDex(t, K, extra={}) {
  const o = dexAt(K, t, () => ({ x: 0, y: 700 }), { s: DS*1.15, air: true, wind: -1.4, rot: -82 + Math.sin(t*2.2)*6, acc: 'shades', ...extra });
  o.armF = [o.armF[0] + Math.sin(t*14)*6, o.armF[1]]; o.armB = [o.armB[0] - Math.sin(t*13)*6, o.armB[1]];
  return chibi2(o);
}
const SPREAD = { eyes:'wide', mouth:'o', armF:[100,-40], armB:[-100,40], legL:[-40,30], legR:[40,-30], acc:'shades' };
function gaugesHUD(t) {
  const v = speedAt(t), a = altAt(t);
  return `<g transform="translate(250,830)"><circle r="150" fill="#1B1D33" stroke="#fff" stroke-width="6"/>${[0, 1, 2, 3, 4].map(i => { const ang = rad(-210 + i*60); return `<text x="${Math.cos(ang)*112}" y="${Math.sin(ang)*112 + 12}" text-anchor="middle" font-family="Lilita One" font-size="28" fill="#9FD8FF">${i*50}</text>`; }).join('')}<line x1="0" y1="0" x2="${Math.cos(rad(-210 + v*1.2))*120}" y2="${Math.sin(rad(-210 + v*1.2))*120}" stroke="#E8463C" stroke-width="10" stroke-linecap="round"/><text y="215" text-anchor="middle" font-family="Lilita One" font-size="46" fill="#fff" stroke="#1B1D33" stroke-width="8" paint-order="stroke">${Math.round(v)} km/h</text></g>` +
    `<g transform="translate(1660,860)"><rect x="-170" y="-70" width="340" height="140" rx="20" fill="#1B1D33" stroke="#fff" stroke-width="6"/><text y="-14" text-anchor="middle" font-family="Lilita One" font-size="32" fill="#9FD8FF">ALTITUDE</text><text y="44" text-anchor="middle" font-family="Lilita One" font-size="56" fill="#7ED957">${Math.round(a).toLocaleString('en-GB')} m</text></g>`;
}
function field(t, L, blur='', dusk=0) {
  return L(0, skyW(t, 1200, 100, dusk ? `rgba(40,30,90,${dusk})` : '')) + L(.45, hills(t, 780, true), blur && 'b8') + L(1, grassGround(GY - 60) + tree(-1500, GY - 60, 1.4) + tree(1650, GY - 60, 1.2), blur && 'b2');
}
function crater(t, k=1) {
  const w = 700*k, d = 360*k;
  return `<path d="M${-w - 120},${GY - 40} Q${-w - 60},${GY - 120} ${-w + 20},${GY - 70} Q0,${GY + d} ${w - 20},${GY - 70} Q${w + 60},${GY - 120} ${w + 120},${GY - 40} Z" fill="#6E4A3A" stroke="${INK}" stroke-width="9"/><path d="M${-w + 80},${GY - 50} Q0,${GY + d - 60} ${w - 80},${GY - 50}" fill="none" stroke="#5E3E30" stroke-width="12"/>`;
}
const SHOTS_D = [
  { t: 0, ref: RD, cam: t => ({ x: -200 + t*120, y: 300, z: .85, r: -2 }), draw: (t, c, L) =>
      aerial(t, L) + L(1, planeSide(-100 + t*120, 260, 1, t)) + chipAt(t, ST[0] + .4, 960, 140, 'ONE THING ONLY HE CAN DO', '#3D8BFF', 58) },
  { t: 3.0, ref: RF, cam: push(3.0, 5.6, { x: 260, y: GY - 400, z: 1.45, r: 0 }, { x: 300, y: GY - 400, z: 1.6, r: 0 }, 'lin'), draw: (t, c, L) =>
      cabin(t, L) + L(1, dex([[0, { ...POSES.cheer, acc:'shades' }], [4.4, { ...POSES.lookR, acc:'shades', look:[10,4] }, 'o']], t, 470, GY - 120, { acc: 'shades', wind: 1.1 })) },
  { t: 5.6, ref: RF, cam: push(5.6, JMP, { x: 450, y: GY - 360, z: 2.0, r: -2 }, { x: 450, y: GY - 360, z: 2.2, r: -3 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.peace, acc:'shades' }], [ST[1] + 1.2, { ...POSES.shrug, acc:'shades', mouth:'grin' }, 'o'], [JMP - .45, { ...POSES.crouchPop, acc:'shades' }, 'io']];
      return cabin(t, L, 'b4') + L(1, dex(K, t, 470, GY - 120, { acc: 'shades', wind: 1.1 })) + chipAt(t, ST[1] + .8, 1450, 250, 'PARACHUTE: ✗', '#E8463C', 66); } },
  { t: JMP, ref: RD, cam: push(JMP, ST[2] - .1, { x: 300, y: 350, z: 1.2, r: 4 }, { x: 250, y: 500, z: 1.0, r: 8 }, 'io'), draw: (t, c, L) => {
      const k = seg(t, JMP, JMP + 2.2), pos = { x: 600 - 300*k, y: 250 + 900*k*k + 60*k };
      const o = dexAt([[0, { ...POSES.popJump, acc:'shades' }], [JMP + .4, { ...SPREAD, eyes:'happy', mouth:'laugh' }]], t, () => pos, { s: DS, air: true, rot: -200*k, acc: 'shades', wind: -1.2 });
      return aerial(t, L) + L(1, planeSide(-200 + (t - JMP)*600, 240, 1, t, 1) + chibi2(o)) + chipAt(t, JMP + .2, 960, 120, 'NO PARACHUTE', '#3D8BFF', 60); } },
  // freefall
  { t: ST[2] - .1, ref: RD, cam: push(ST[2] - .1, 15.5, { x: 0, y: 560, z: 1.0, r: 0 }, { x: 0, y: 560, z: 1.1, r: 3 }, 'lin'), draw: (t, c, L) => {
      let arrows = '';
      if (t > ST[2] + 2.6 && t < 15.5) { const a = E.o(seg(t, ST[2] + 2.6, ST[2] + 3.2)); arrows = `<g opacity="${a}"><path d="M-260,${560 - 60} L-260,${560 - 60 - 220*a}" stroke="#7FD3FF" stroke-width="26"/><path d="M-300,${560 - 60 - 200*a} L-260,${560 - 60 - 280*a} L-220,${560 - 60 - 200*a} Z" fill="#7FD3FF" stroke="${INK}" stroke-width="5"/><path d="M260,${560 + 60} L260,${560 + 60 + 220*a}" stroke="#E8463C" stroke-width="26"/><path d="M220,${560 + 60 + 200*a} L260,${560 + 60 + 280*a} L300,${560 + 60 + 200*a} Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/><text x="-230" y="${300}" font-family="Lilita One" font-size="44" fill="#fff" stroke="${INK}" stroke-width="8" paint-order="stroke">AIR PUSHING UP</text><text x="290" y="${830}" font-family="Lilita One" font-size="44" fill="#fff" stroke="${INK}" stroke-width="8" paint-order="stroke">WEIGHT</text></g>`; }
      return L(0, skyFall(t, 900)) + L(1, freefallDex(t, [[0, SPREAD], [12.0, { ...SPREAD, eyes:'happy', mouth:'grin' }, 'o']]) + arrows) + gaugesHUD(t) + chipAt(t, ST[2] + 2.8, 1350, 180, 'AIR PUSH = WEIGHT', '#3D8BFF', 50); } },
  { t: 15.5, ref: RD, cam: push(15.5, ST[3] - .1, { x: -30, y: 420, z: 2.4, r: -4 }, { x: -30, y: 420, z: 2.6, r: 4 }, 'lin'), draw: (t, c, L) =>
      L(0, skyFall(t, 1400)) + L(1, freefallDex(t, [[0, { ...SPREAD, eyes:'happy', mouth:'wail' }], [17.4, { ...SPREAD, eyes:'happy', mouth:'laugh' }, 'o']])) + speedLines(t, 18, .5, '#FFFFFF', 1).replace(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.-]+)" height="([\d.-]+)"/g, (m, x, y, w, h) => `<rect x="${y*1.78}" y="${x*.45}" width="${h}" height="${w}"`) + gaugesHUD(t) + chipAt(t, ST[2] + 5.0, 960, 110, 'TERMINAL VELOCITY ≈ 200 km/h', '#E8463C', 58) },
  { t: ST[3] - .1, ref: RD, cam: push(ST[3] - .1, 25.4, { x: 0, y: 600, z: .9, r: 0 }, { x: 0, y: 620, z: 1.0, r: -2 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, SPREAD], [ST[3] + 1.2, { ...SPREAD, eyes:'happy', mouth:'smile', armF:[170,80], armB:[-170,-80] }, 'o'], [23.4, { ...SPREAD, eyes:'happy', mouth:'grin', armF:[110,-20], handF:'peace' }, 'o']];
      return L(0, `<rect x="-8000" y="-6000" width="16000" height="12000" fill="url(#sky2)"/>`) + L(.4, ground(t, seg(t, ST[3], IMPD)*.4)) + L(.8, [...Array(5)].map((_, i) => cloud(-1400 + i*700, ((i*400 - t*300) % 1600 + 1600) % 1600 - 300, 1.6)).join('')) + L(1, freefallDex(t, K)) + gaugesHUD(t) + chipAt(t, ST[3] + .6, 960, 110, '4 km UP · JUST OVER A MINUTE', '#3D8BFF', 56) + chipAt(t, 23.6, 960, 220, 'ENJOY THE VIEW', '#7ED957', 48); } },
  { t: 25.4, ref: RD, cam: push(25.4, IMPD, { x: 0, y: 560, z: 1.1, r: 0 }, { x: 0, y: 600, z: 1.4, r: 6 }, 'in'), draw: (t, c, L) =>
      L(0, `<rect x="-8000" y="-6000" width="16000" height="12000" fill="url(#sky2)"/>`) + L(1, ground(t, .4 + .6*seg(t, 25.4, IMPD)) + freefallDex(t, [[0, { ...SPREAD, eyes:'happy', mouth:'grin' }], [ST[4] - .3, { ...SPREAD, eyes:'squeeze', mouth:'grin' }, 'o']])) + gaugesHUD(t) + chipAt(t, ST[4], 960, 120, 'GROUND!', '#E8463C', 66) },
  // impact
  { t: IMPD, ref: RF, cam: push(IMPD, 33.0, { x: 0, y: GY - 330, z: 1.0, r: 0 }, { x: 0, y: GY - 330, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, IMPD, IMPD + .3), dk = seg(t, IMPD, IMPD + 2.6), f = Math.floor((t - IMPD)*30);
      let deb = ''; for (let i = 0; i < 14; i++) { const a = rad(-170 + i*12), kk = seg(t, IMPD, IMPD + 1.3); deb += `<circle cx="${Math.cos(a)*900*kk}" cy="${GY - 80 + Math.sin(a)*700*kk + 900*kk*kk}" r="${10 + i%4*5}" fill="#6E4A3A" stroke="${INK}" stroke-width="4"/>`; }
      let fr = field(t, L) + L(1, crater(t, E.snap(k)) + `<g opacity="${1 - dk*.75}">${[...Array(9)].map((_, i) => `<circle cx="${(i - 4)*160*(.6 + dk)}" cy="${GY - 160 - dk*200 - (i%2)*70}" r="${120 + dk*120}" fill="#C9B9A6"/>`).join('')}</g>` + deb);
      if (f < 3) fr = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${fr}${focusLines(t, 960, 640, 1, 300)}</g>`;
      return fr + bang(t, IMPD + .1, 960, 300, 'BOOM!', '#FFC21F', 200, -6, IMPD + 1.8); } },
  { t: 33.0, ref: { x: 0, y: 540, z: 1 }, cam: push(33.0, WD, { x: 0, y: 560, z: 1.0, r: 0 }, { x: 0, y: 560, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k1 = E.io(seg(t, 33.3, 34.3)), k2 = E.io(seg(t, 34.0, 35.0));
      return L(0, studioBack(t)) + L(1, `<g transform="translate(-440,520)">${chibi2({ ...DEX2, ...mixPose(SPREAD, SPREAD, 1), x: 0, y: 140, s: .9, t, air: true, rot: -82, acc: 'shades' })}<text y="300" text-anchor="middle" font-family="Lilita One" font-size="56" fill="#fff">DEX · 200 km/h</text></g><g transform="translate(440,560)">${carSide2(0, 0, 1.2, t, { wr: t*300 })}<text y="260" text-anchor="middle" font-family="Lilita One" font-size="56" fill="#fff">SMALL CAR · 40 km/h</text></g>` +
        `<rect x="-640" y="880" width="${400*k1}" height="50" rx="14" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><rect x="240" y="880" width="${360*k2}" height="50" rx="14" fill="#3D8BFF" stroke="${INK}" stroke-width="5"/><text x="-640" y="980" font-family="Lilita One" font-size="40" fill="#fff" opacity="${k1}">≈ 77 kJ (EST.)</text><text x="240" y="980" font-family="Lilita One" font-size="40" fill="#fff" opacity="${k2}">≈ 68 kJ (EST.)</text>`) +
        chipAt(t, 33.1, 960, 130, '≈ SAME ENERGY AS A SMALL CAR CRASH', '#E8463C', 54); } },
  // crater, climbing out, laughing
  { t: WD, ref: RF, cam: push(WD, ST[6] - .2, { x: 0, y: GY - 260, z: 1.2, r: 0 }, { x: 60, y: GY - 300, z: 1.4, r: 0 }, 'lin'), draw: (t, c, L) => {
      const climb = seg(t, ST[5] + .4, ST[5] + 2.6), x = lerp(0, 600, climb), y = lerp(GY + 220, GY - 70, E.io(climb));
      const K = [[0, { ...POSES.peek, eyes:'open', acc:'shades' }], [ST[5] + 2.6, { ...POSES.cheer, eyes:'happy', mouth:'laugh', acc:'shades' }, 'o']];
      return field(t, L) + L(1, crater(t) + dexP(K, t, () => ({ x, y }), { acc: 'shades' }) + `<path d="M-820,${GY - 40} L820,${GY - 40} L820,${GY + 600} L-820,${GY + 600} Z" fill="none"/>`) + chipAt(t, ST[5] + .3, 960, 130, 'NEW CRATER', '#B07A4A', 56) + bang(t, ST[5] + 2.8, 1460, 380, 'HA HA HA!', '#FFC21F', 90, -6); } },
  { t: ST[6] - .2, ref: RF, cam: push(ST[6] - .2, ST[7] - .25, { x: 0, y: GY - 120, z: 1.6, r: 0 }, { x: 0, y: GY - 140, z: 1.8, r: 2 }, 'lin'), draw: (t, c, L) => {
      let conf = ''; if (t > ST[6] + 2.2) for (let i = 0; i < 18; i++) { const ph = (t*.5 + i*.07) % 1; conf += `<rect x="${-700 + (i*137 % 1400)}" y="${GY - 800 + ph*900}" width="16" height="26" fill="${['#FFC21F', '#E8463C', '#3D8BFF', '#7ED957'][i%4]}" transform="rotate(${ph*500},${-700 + (i*137 % 1400)},${GY - 800 + ph*900})"/>`; }
      const o = dexAt([[0, { eyes:'happy', mouth:'laugh', armF:[170,80], armB:[-170,-80], acc:'shades' }]], t, () => ({ x: 0, y: GY + 80*DS + 120 + Math.sin(t*8)*6 }), { s: DS, air: true, noShadow: true, rot: -90, acc: 'shades' });
      return field(t, L, 'b4') + L(1, crater(t) + chibi2(o) + conf) + chipAt(t, ST[6] + .4, 560, 180, 'NORMAL PERSON: ✗', '#E8463C', 54) + chipAt(t, ST[6] + 2.6, 1360, 180, 'DEX: BEST DAY EVER', '#7ED957', 54); } },
  // the red hood
  { t: ST[7] - .25, ref: RF, cam: push(ST[7] - .25, 53.0, { x: 300, y: GY - 360, z: 1.15, r: 0 }, { x: 420, y: GY - 420, z: 1.35, r: -3 }, 'in'), draw: (t, c, L) => {
      const eo = seg(t, ST[7] + 2.2, ST[7] + 2.6);
      return field(t, L, '', .55) + L(1, crater(t) + mystery(640, GY - 70, 1.3, eo) + dex([[0, { ...POSES.smile, acc:'shades' }], [ST[7] + .8, { ...POSES.lookR, look:[10,-10], acc:'shades' }, 'o'], [ST[7] + 2.4, { ...POSES.surprise, look:[10,-12], acc:'shades' }, 'snap']], t, -260, GY + 120, { acc: 'shades' })) + `<rect width="1920" height="1080" fill="#1B1D33" opacity=".25"/>`; } },
  { t: 53.0, ref: RF, cam: push(53.0, GONE, { x: -260, y: GY - 150, z: 3.0, r: 0 }, { x: -260, y: GY - 150, z: 3.4, r: 0 }, 'in'), draw: (t, c, L) =>
      field(t, L, 'b14', .55) + L(1, crater(t) + dex([[0, { ...POSES.surprise, eyes:'wide', look:[10,-12], sweat:true, acc:'none' }]], t, -260, GY + 120)) + `<rect width="1920" height="1080" fill="#1B1D33" opacity=".25"/>` + title(t, ST[8] + .1, 960, 130, 'THE SAME RED HOOD…', '#E8463C', 84) },
  { t: GONE, ref: RF, cam: push(GONE, END, { x: 420, y: GY - 420, z: 1.35, r: -3 }, { x: 420, y: GY - 420, z: 1.42, r: -3 }, 'lin'), draw: (t, c, L) => {
      const sk = seg(t, GONE, GONE + .5);
      return field(t, L, '', .6) + L(1, crater(t) + (sk < 1 ? `<path d="M640,${GY - 260} Q900,${GY - 520 - 200*sk} 1500,${GY - 700}" fill="none" stroke="#E8463C" stroke-width="${70*(1 - sk) + 8}" stroke-linecap="round" opacity="${1 - sk}"/>` : '')) + `<rect width="1920" height="1080" fill="#1B1D33" opacity=".3"/>`; } },
];
function scene(t) { return playShots(t, SHOTS_D, [[IMPD, 50, 1.0]]) + vignette() + flash(t, IMPD + .1, '#fff', .4, .9) + wipe(t, WD); }
