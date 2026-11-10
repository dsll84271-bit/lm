// RIG2
// Ep4 s4: Rule 4, heat still shows. END 62.61  ST=[2.0, 9.95, 24.37, 32.34, 45.14, 58.98]  DU=[6.55, 13.42, 6.57, 11.2, 10.94, 1.83]
const SCX = -150, SCW = 1240, SCH = 620, SCY = GY - 940;        // exhibit screen (world)
const KID = PEOPLE[2], PAR = PEOPLE[0];
const dexX = t => t < 7.0 ? lerp(-1500, -400, seg(t, 3.0, 7.0)) : t < 46.0 ? lerp(-400, 300, seg(t, 33.0, 36.0)) : lerp(300, 820, E.io(seg(t, 46.2, 47.6)));
const CASEX = 900;
function heatView(t, people, dx, dexHeat=1, behindCase=false, peek=0) {   // bodies drawn into the screen (scaled room view)
  const k = .5, map = (svg) => `<g transform="translate(${SCX},${SCY + SCH - 30}) scale(${k}) translate(-50,${-GY})">${svg}</g>`;
  const bodies = people.map(p => ({ svg: map(p), heat: 1 }));
  if (dexHeat > 0) bodies.push({ svg: map(chibi2({ ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), x: dx, y: GY, s: DS, t, noShadow: true, blink: 0, hoodTip: 0 })), heat: dexHeat });
  let caseSvg = ''; if (behindCase) { caseSvg = map(`<rect x="${CASEX - 200}" y="${GY - 600}" width="400" height="600" fill="#0A0A0A"/>`); }
  const peekSvg = peek > 0 ? map(`<g opacity="${peek}">${chibi2({ ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), x: CASEX + 230, y: GY, s: DS, t, noShadow: true })}</g>`) : '';
  return thermalScreen(t, SCX - SCW/2, SCY, SCW, SCH, [...bodies, { svg: caseSvg.replace('<g transform', '<g opacity="1" transform'), heat: 0 }, { svg: peekSvg, heat: 1 }]).replace('</g><g transform="translate', (behindCase ? `${map(`<rect x="${CASEX - 200}" y="${GY - 600}" width="400" height="600" fill="#000"/>`).replace('<g ', '<g filter="url(#thm)" ')}` : '') + '</g><g transform="translate');
}
const kidK = (a) => [[0, { ...POSES.idle, look: [0, -8], tilt: -6 }], [a, { ...POSES.point, armF: [140, -20], look: [0, -9], eyes: 'wide', mouth: 'o' }, 'snap'], [a + 1.0, { ...POSES.point, armF: [70, -10], look: [9, 0], eyes: 'wide', mouth: 'o' }, 'o'], [a + 2.0, { ...POSES.point, armF: [140, -20], look: [0, -9], eyes: 'wide', mouth: 'wobble' }, 'o']];
function room(t, L, kidA, parA, o={}) {
  const kid = who(KID, kidK(kidA), t, -700, GY - 140, { s: DS*.8 }, 22), par = who(PAR, [[0, { ...POSES.idle, look: [0, -8] }], [parA, { ...POSES.surprise, look: [9, 0] }, 'o']], t, -980, GY - 140, {}, 23);
  return { kid, par };
}
const SHOTS_S4 = [
  // 0 the science museum; Dex walks past a thermal camera exhibit
  { t: 0, ref: RR, cam: push(0, 9.9, { x: -350, y: GY - 520, z: .98, r: 0 }, { x: -200, y: GY - 520, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const r = room(t, L, 8.0, 8.6), dx = dexX(t);
      const drip = [...Array(4)].map((_, i) => { const kk = ((t*1.1 + i/4) % 1); return `<ellipse cx="${dx - 30 + i*20}" cy="${GY - 440 + kk*300}" rx="5" ry="9" fill="#BFF0FF" stroke="${INK}" stroke-width="2" opacity="${1 - kk}"/>`; }).join('');
      return museumW(t, L) + L(1, heatView(t, [r.par, r.kid], dx, t > 6.4 ? 1 : 0) + r.par + r.kid + slippers(t, dx, GY - 150, 1.05, t < 7.0, 3.0, 1.2) + dexI([[0, walkPose(t, 7)], [7.2, { eyes: 'open', look: [6, -8] }, 'o']], t, dx, GY - 140) + drip + glassCase(CASEX, GY - 140, 360, 560)) +
        chipAt(t, 2.2, 960, 110, 'THE SCIENCE MUSEUM', '#B07CFF', 54); } },
  // 1 everything warm gives off infrared; skin around 9-10 micrometres
  { t: 9.9, ref: GC, cam: push(9.9, 24.3, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 980, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, 10.4, 16.0), sp = spectrumBar(t, 160, 560, 1600, k);
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, sp.s + (k > .9 ? `<g transform="translate(${sp.X(9.5)},${560 - 330}) scale(.5)">${chibi2({ ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), x: 0, y: 260, s: 1, t, noShadow: true }).replace(/fill="[^"#]*"/g, 'fill="#FFB347"')}</g>` : '')) +
        chipAt(t, 10.4, 960, 110, 'WARM THINGS GLOW IN INFRARED', '#FF8A3D', 50) + chipAt(t, 17.2, 1450, 880, 'YOUR SKIN: ≈ 9–10 µm', '#FFD23F', 46) + chipAt(t, 19.4, 500, 880, 'TOO LONG FOR HUMAN EYES', '#E8463C', 42) + chipAt(t, 21.6, 960, 990, 'PERFECT FOR A THERMAL CAMERA', '#7ED957', 44); } },
  // 2 about 37 degrees inside, usually warmer than the room: you glow
  { t: 24.3, ref: RR, cam: push(24.3, 32.3, { x: 0, y: GY - 330, z: 1.45, r: 0 }, { x: 0, y: GY - 330, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) => {
      const hk = seg(t, 27.0, 28.2);
      const sil = chibi2({ ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), x: -150, y: GY, s: DS, t, noShadow: true });
      return thermalDef('thm2', 0, 0, 1920, 1080, 14) + `<g filter="url(#thm2)"><rect width="1920" height="1080" fill="#3A3A3A"/>${L(1, `<g filter="url(#toWhite)" opacity="${.35 + .65*hk}">${sil}</g>`)}</g>` + `<g transform="translate(1420,560)">${thermo(0, 0, 1, lerp(20, 37, E.io(seg(t, 24.8, 26.6))), 0, 40)}</g>` +
        chipAt(t, 24.8, 1420, 120, 'INSIDE YOU: ≈ 37 °C', '#E8463C', 50) + chipAt(t, 27.4, 960, 980, 'WARMER THAN THE ROOM → YOU GLOW', '#FFD23F', 46); } },
  // 3 the power hides visible light, not heat: a glowing Dex on the screen, nobody in front of it
  { t: 32.3, ref: RR, cam: push(32.3, 39.7, { x: -150, y: GY - 560, z: 1.0, r: 0 }, { x: -120, y: GY - 560, z: 1.08, r: 0 }, 'lin'), draw: (t, c, L) => {
      const r = room(t, L, 36.4, 37.2), dx = dexX(t);
      return museumW(t, L) + L(1, heatView(t, [r.par, r.kid], dx, 1) + r.par + r.kid + slippers(t, dx, GY - 150, 1.05, t > 33 && t < 36, 33, 1.2) + dexI([[0, { eyes: 'open', look: [-6, -8] }], [36.5, { eyes: 'wide', look: [-9, 0] }, 'o']], t, dx, GY - 140) + glassCase(CASEX, GY - 140, 360, 560)) +
        chipAt(t, 33.0, 960, 120, 'HIDDEN FROM LIGHT WE SEE', '#7ED957', 46) + chipAt(t, 34.4, 960, 210, 'NOT FROM HEAT', '#E8463C', 50) + bang(t, 36.6, 1500, 860, 'MUM, LOOK!', '#fff', 56, 4, 39.6); } },
  { t: 39.7, ref: RR, cam: push(39.7, 45.1, { x: 0, y: 500, z: 1.0, r: 0 }, { x: 0, y: 500, z: 1.08, r: -3 }, 'lin'), draw: (t, c, L) => {
      const inset = `<g transform="translate(1300,700)"><rect x="-300" y="-200" width="600" height="400" rx="16" fill="#1F2033" stroke="${INK}" stroke-width="8"/></g>`;
      const p = chibi2({ ...PEOPLE[4], ...mixPose(POSES.idle, POSES.idle, 1), x: 1300, y: 850, s: .6, t, noShadow: true });
      return L(0, `<rect x="-6000" y="-3000" width="12000" height="7000" fill="url(#nightG)"/>` + [...Array(50)].map((_, i) => `<circle cx="${(hash(i)*2 - 1)*2000}" cy="${hash(i*3)*600 - 100}" r="2" fill="#fff" opacity=".6"/>`).join('') + `<rect x="-3000" y="760" width="6000" height="900" fill="#141838"/>` + [...Array(12)].map((_, i) => `<rect x="${-2000 + i*360}" y="${560 + (i%3)*60}" width="300" height="600" fill="#1E2244"/>`).join('')) +
        L(1, helicopter(lerp(-1200, -300, seg(t, 39.7, 45.1)), 250, 1.1, t, 1)) + inset + thermalDef('thm3', 1000, 500, 600, 400, 8) + `<g filter="url(#thm3)"><rect x="1000" y="500" width="600" height="400" fill="#151515"/><g filter="url(#toWhite)">${p}</g></g>` + `<g transform="translate(1300,540)">${txt('HELI CAM', 0, 0, 30, '#FFD23F')}</g>` +
        chipAt(t, 40.0, 700, 120, 'POLICE HELICOPTERS', '#3D8BFF', 52) + chipAt(t, 41.6, 700, 210, 'FIND PEOPLE IN THE DARK', '#FFD23F', 44); } },
  // 4 glass blocks this infrared: hide behind the display case
  { t: 45.1, ref: RR, cam: push(45.1, 58.95, { x: 250, y: GY - 560, z: 1.0, r: 0 }, { x: 300, y: GY - 560, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const r = room(t, L, 56.4, 57.0), dx = dexX(t), behind = t > 47.6, pk = t > 56.0 ? E.o(seg(t, 56.0, 56.5)) - E.io(seg(t, 57.6, 58.1)) : 0;
      const eyesX = behind ? CASEX + 80 + pk*150 : dx;
      return museumW(t, L) + L(1, heatView(t, [r.par, r.kid], dx, behind ? 0 : 1, behind, pk) + r.par + r.kid + (behind ? '' : slippers(t, dx, GY - 150, 1.05, t > 46.2, 46.2, 1.4)) + dexI([[0, { eyes: 'open', look: [8, 0] }], [48.0, { eyes: 'happy' }, 'o'], [56.0, { eyes: 'wide', look: [-9, 0] }, 'snap']], t, eyesX, GY - 140) + glassCase(CASEX, GY - 140, 360, 560, .45)) +
        chipAt(t, 45.6, 960, 120, "GLASS BLOCKS THIS INFRARED", '#5CF2FF', 46) + chipAt(t, 48.6, 960, 210, 'BEHIND GLASS: GONE', '#7ED957', 48) + bang(t, 56.6, 400, 860, 'THERE!', '#FFD23F', 70, -6); } },
  // 5 RULE 4
  { t: 58.95, ref: RR, cam: push(58.95, END, { x: 250, y: GY - 520, z: 1.05, r: 0 }, { x: 260, y: GY - 520, z: 1.1, r: 0 }, 'lin'), draw: (t, c, L) => {
      const r = room(t, L, 99, 99);
      return museumW(t, L, 'b2') + L(1, heatView(t, [r.par, r.kid], 300, 1) + r.par + r.kid + dexI([[0, { eyes: 'squeeze' }]], t, 300, GY - 140) + glassCase(CASEX, GY - 140, 360, 560)) + note(t, 59.0, 1350, 640, 'RULE 4', 'HEAT STILL', 'SHOWS.'); } },
];
const SHAKES_S4 = [];
function scene(t) { let s = EP3DEFS + EP4DEFS + playShots(t, SHOTS_S4, SHAKES_S4) + vignette(); [24.3, 45.1].forEach(w => s += wipe(t, w)); return s; }
