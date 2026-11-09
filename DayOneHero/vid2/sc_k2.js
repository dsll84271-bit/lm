// RIG2
// Ep2 hoodie segment (k), Rig 2.0. Timing from t_k.js. END 26.51.
const RK = { x: 0, y: 700, z: 1 };
const WK = [ST[3] - .2, ST[4] - .2], STRIKE = ST[1] + 1.0, BURNT = '#3E3A44';
const dark = t => seg(t, 4.6, 5.8);
function field(t, L, blur='') {
  const d = dark(t), storm = `<rect x="-6000" y="-4000" width="12000" height="8000" fill="#2B2F5A" opacity="${d*.8}"/>`;
  let clouds = ''; for (let i = 0; i < 7; i++) clouds += `<g opacity="${d}">${cloud(-2200 + i*700 + Math.sin(t*.5 + i)*60, 60 + (i%2)*90, 2.4).replace(/fill="#fff"/g, 'fill="#5A6090"')}</g>`;
  const flashK = t > STRIKE && t < STRIKE + .5 ? 1 - seg(t, STRIKE, STRIKE + .5) : 0;
  return L(0, skyW(t) + storm + clouds + `<rect x="-6000" y="-4000" width="12000" height="8000" fill="#fff" opacity="${flashK*.5}"/>`) + L(.4, hills(t, 780, false) + `<rect x="-6000" y="-4000" width="12000" height="8000" fill="#14162A" opacity="${d*.35}"/>`, blur && 'b8') +
    L(1, grassGround(GY - 40) + `<rect x="-6000" y="${GY - 40}" width="12000" height="900" fill="#14162A" opacity="${d*.3}"/>`, blur && 'b2');
}
const burntTop = t => t > STRIKE ? BURNT : undefined;
function scorched(t) { return t > STRIKE ? smoke(40, GY - 300, t, 5, 1.0, '#7A7690') + `<path d="M-40,${GY - 200} l20,-10 M50,${GY - 140} l14,8 M-20,${GY - 120} l-12,6" stroke="#FF8A3D" stroke-width="7" stroke-linecap="round" opacity="${.5 + .5*Math.sin(t*12)}"/>` : ''; }
function hoodieRuin(x, y, s, kind, t) {
  const col = { lava: '#5A2E1E', crash: '#C9A24A', bolt: BURNT }[kind];
  let g = `<g transform="translate(${x},${y}) scale(${s}) rotate(${Math.sin(t*2 + x)*4})"><path d="M-14,-140 L14,-140" stroke="#C9C2DA" stroke-width="10"/><rect x="-24" y="-150" width="16" height="34" rx="4" fill="#C9C2DA" stroke="${INK}" stroke-width="4"/><rect x="8" y="-150" width="16" height="34" rx="4" fill="#C9C2DA" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M-56,-118 Q0,-200 56,-118 Z" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M-70,-120 Q0,-150 70,-120 L120,-60 L96,-36 L70,-60 L70,110 L-70,110 L-70,-60 L-96,-36 L-120,-60 Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-40,-120 Q0,-60 40,-120" fill="none" stroke="${INK}" stroke-width="5"/>`;
  if (kind === 'lava') g += `<path d="M-60,40 Q-30,70 0,50 Q30,80 60,50 L70,110 L-70,110 Z" fill="#FF8A3D" opacity=".8"/><circle cx="20" cy="-20" r="16" fill="#FFF6E0" stroke="${INK}" stroke-width="4"/>`;
  if (kind === 'crash') g += `<path d="M-70,-10 L70,30 M-70,20 L70,60" stroke="#2B2F4A" stroke-width="14" stroke-dasharray="14 10"/><path d="M20,-80 l20,30 l-30,10 Z" fill="#FFF6E0" stroke="${INK}" stroke-width="4"/>`;
  if (kind === 'bolt') g += `<path d="M-10,-100 L-30,-20 L10,-30 L-10,60" stroke="#FFC21F" stroke-width="8" fill="none" opacity=".6"/><circle cx="-40" cy="40" r="14" fill="#FFF6E0" stroke="${INK}" stroke-width="4"/>`;
  return g + smoke(0, -60, t + x*.01, 3, .5, '#8C8696') + `</g>`;
}
function wardrobe(t) {
  let g = `<g transform="translate(-520,${GY - 140})"><rect x="-330" y="-760" width="660" height="760" rx="20" fill="#B07A4A" stroke="${INK}" stroke-width="8"/><rect x="-300" y="-730" width="600" height="700" fill="#5A3A2A"/><path d="M-290,-680 L290,-680 M-290,-380 L290,-380" stroke="#C9C2DA" stroke-width="9"/>`;
  for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) g += hoodieOnly(-220 + i*110, -560 + r*300, .6, '#FFC21F', (i - 2)*3 + Math.sin(t*2 + i)*2);
  const k = E.o(seg(t, WK[1] + .1, WK[1] + .5));
  g += `<rect x="-330" y="-760" width="${40 + 290*(1 - k)}" height="760" rx="14" fill="#C98A4B" stroke="${INK}" stroke-width="8"/><rect x="${290 - 290*(1 - k)}" y="-760" width="${40 + 290*(1 - k)}" height="760" rx="14" fill="#C98A4B" stroke="${INK}" stroke-width="8"/></g>`;
  return g;
}
const SHOTS_K = [
  { t: 0, ref: RK, cam: push(0, 2.2, { x: 0, y: GY - 300, z: 1.4, r: 0 }, { x: 0, y: GY - 300, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) =>
      field(t, L) + L(1, dex([[0, 'confident'], [1.0, 'cheer', 'o']], t, 0, GY)) + chipAt(t, ST[0] + .6, 520, 200, 'DEX: INVINCIBLE ✓', '#7ED957', 54) },
  { t: 2.2, ref: RK, cam: push(2.2, 4.6, { x: 0, y: GY - 190, z: 2.6, r: 3 }, { x: 0, y: GY - 200, z: 2.9, r: 3 }, 'lin'), draw: (t, c, L) =>
      field(t, L, 'b8') + L(1, dex([[0, { ...POSES.think, armF:[-30,-90], look:[0,12] }], [3.0, { ...POSES.worried, look:[0,12] }, 'o']], t, 0, GY)) + chipAt(t, ST[0] + 2.0, 1400, 200, 'HIS CLOTHES: ✗', '#E8463C', 54) },
  { t: 4.6, ref: RK, cam: push(4.6, STRIKE, { x: 0, y: GY - 360, z: 1.3, r: -6 }, { x: 0, y: GY - 380, z: 1.5, r: -8 }, 'in'), draw: (t, c, L) =>
      field(t, L) + L(1, dex([[0, { ...POSES.lookCam, look:[0,-12], tilt:-8 }], [5.6, { ...POSES.gulp, look:[0,-14] }, 'o']], t, 0, GY, { wind: .6*dark(t) })) + chipAt(t, ST[1] + .2, 960, 140, 'STRUCK BY LIGHTNING', '#B07CFF', 58) },
  { t: STRIKE, ref: RK, cam: push(STRIKE, 6.9, { x: 0, y: GY - 320, z: 1.6, r: 6 }, { x: 0, y: GY - 320, z: 1.75, r: 4 }, 'snap'), draw: (t, c, L) => {
      const f = Math.floor((t - STRIKE)*30);
      let fr = field(t, L) + L(1, (t < STRIKE + .45 ? bolt(60, -900, 0, GY - 300, t, 7, 40) : '') + dex([[0, { ...POSES.impact, eyes:'shock' }]], t, 0, GY, { top: burntTop(t) }) + scorched(t));
      if (f < 4) fr = `<g filter="url(#${f % 2 ? 'impRed' : 'impInk'})">${fr}${focusLines(t, 960, 540, 1, 260)}</g>`;
      return fr + bang(t, STRIKE + .1, 1300, 380, 'KRAKOOM!', '#FFF07A', 130, -8, STRIKE + 1.4); } },
  { t: 6.9, ref: RK, cam: push(6.9, 9.5, { x: 0, y: GY - 250, z: 2.4, r: 0 }, { x: 0, y: GY - 250, z: 2.6, r: 0 }, 'lin'), draw: (t, c, L) =>
      field(t, L, 'b8') + L(1, dex([[0, { ...POSES.surprise, eyes:'dot', mouth:'o', brow:14 }], [8.6, { ...POSES.surprise, eyes:'dot', mouth:'flat', brow:6 }, 'o']], t, 0, GY, { top: BURNT }) + scorched(t)) + chipAt(t, ST[1] + 2.4, 1450, 220, '≈ 30,000 °C', '#E8463C', 64) },
  { t: 9.5, ref: { x: 0, y: 540, z: 1 }, cam: push(9.5, 13.0, { x: 0, y: 560, z: 1.0, r: 0 }, { x: 0, y: 560, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = E.io(seg(t, 10.0, 11.2)), k2 = E.io(seg(t, 11.0, 12.4));
      const bar = (y, w, col, label, val) => `<g transform="translate(-700,${y})"><text x="0" y="-24" font-family="Lilita One" font-size="52" fill="#fff">${label}</text><rect x="0" y="0" width="1400" height="70" rx="20" fill="#14162A" opacity=".5"/><rect x="0" y="0" width="${1400*w}" height="70" rx="20" fill="${col}" stroke="${INK}" stroke-width="6"/><text x="${1400*w + 20}" y="52" font-family="Lilita One" font-size="48" fill="#fff">${val}</text></g>`;
      return L(0, studioBack(t, '#2B2F5A', '#14162A', '#3A3F7A')) + L(1, `<circle cx="-560" cy="160" r="${110 + 6*Math.sin(t*3)}" fill="#FFC21F" stroke="${INK}" stroke-width="8"/>` + [...Array(12)].map((_, i) => `<path d="M-560,160 L${-560 + Math.cos(i*.52 + t)*190},${160 + Math.sin(i*.52 + t)*190}" stroke="#FFC21F" stroke-width="10"/>`).join('') + bolt(560, -200, 520, 260, t, 3, 26) +
        bar(470, .18*k, '#FFC21F', 'SUN’S SURFACE', '≈ 5,500 °C') + bar(700, .9*k2, '#B07CFF', 'LIGHTNING', '≈ 30,000 °C')) + chipAt(t, ST[1] + 5.0, 960, 120, '≈ 5× THE SUN’S SURFACE', '#FF8A3D', 60); } },
  { t: 13.0, ref: RK, cam: push(13.0, WK[0], { x: 0, y: GY - 300, z: 1.55, r: 0 }, { x: 0, y: GY - 300, z: 1.75, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.smile, eyes:'happy', mouth:'grin' }], [ST[2] + .4, { ...POSES.peace, sparkle:false }, 'o'], [ST[2] + 1.7, { ...POSES.shrug, look:[0,12], mouth:'wobble', eyes:'open' }, 'o']];
      let flakes = ''; for (let i = 0; i < 8; i++) { const p = ((t - ST[2] - 1.6)*.6 + i*.13) % 1; if (t > ST[2] + 1.6) flakes += `<rect x="${-60 + i*18 + Math.sin(t*3 + i)*12}" y="${GY - 260 + p*260}" width="12" height="9" fill="#2A2630" opacity="${1 - p}" transform="rotate(${i*40 + t*90},${-60 + i*18},${GY - 260 + p*260})"/>`; }
      return field(t, L, 'b4') + L(1, dex(K, t, 0, GY, { top: BURNT }) + scorched(t) + flakes) + chipAt(t, ST[2] + .3, 520, 220, 'DEX: FINE ✓', '#7ED957', 56) + chipAt(t, ST[2] + 1.4, 1400, 220, 'HOODIE: TOAST', '#3E3A44', 56); } },
  // washing line, camera pans along it
  { t: WK[0], ref: RK, cam: push(WK[0], WK[1], { x: -560, y: GY - 400, z: 1.35, r: 0 }, { x: 560, y: GY - 400, z: 1.35, r: 0 }, 'io'), draw: (t, c, L) => {
      let line = `<rect x="-1100" y="${GY - 700}" width="22" height="700" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><rect x="1080" y="${GY - 700}" width="22" height="700" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><path d="M-1090,${GY - 660} Q0,${GY - 590} 1090,${GY - 660}" fill="none" stroke="${INK}" stroke-width="6"/>`;
      [['lava', -560, 'LAVA'], ['crash', 0, 'CRASH TEST'], ['bolt', 560, 'LIGHTNING']].forEach(([k, x, lab], i) => { const a = ST[3] + .3 + i*1.1; if (t < a) return;
        line += `<g transform="translate(${x},${GY - 590}) scale(${pop(t, a, .3)})">${hoodieRuin(0, 150, 1.3, k, t)}</g>`; });
      const K = [[0, { ...POSES.shrug, mouth:'flat' }], [20.5, { ...POSES.think, eyes:'closed', mouth:'wobble' }, 'o']];
      return field(t, L, '') + L(1, line + dex(K, t, c.x + 360, GY + 30, { top: BURNT })) +
        [['LAVA', 0], ['CRASH TEST', 1], ['LIGHTNING', 2]].map(([lab, i]) => chipAt(t, ST[3] + .5 + i*1.1, 960, 230 + (i%2)*60, lab, '#E8463C', 46, ST[3] + 1.6 + i*1.1)).join('') + chipAt(t, ST[3] + DU[3] - 1.4, 960, 120, '1 ADVENTURE = 1 HOODIE', '#3D8BFF', 60); } },
  { t: WK[1], ref: RK, cam: push(WK[1], END, { x: -60, y: GY - 400, z: 1.3, r: 0 }, { x: -60, y: GY - 400, z: 1.4, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(1, roomW(t, { wall: '#FFD7E2', stripe: '#FFC4D2', floor: '#F2C9D4' })) + L(1, wardrobe(t) + dex([[0, 'smile'], [WK[1] + .6, 'peace', 'o']], t, 80, GY)) + note(t, ST[4], 1440, 380, 'RULE 4½', 'PACK SPARE', 'HOODIES.') },
];
function scene(t) {
  let s = playShots(t, SHOTS_K, [[STRIKE, 40, .6]]) + vignette() + flash(t, STRIKE + .14, '#fff', .4, .8);
  WK.forEach(w => s += wipe(t, w));
  return s;
}
