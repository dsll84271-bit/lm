// RIG2
// Ep4 s5: Rule 5, dogs know. END 48.43  ST=[3.2, 7.1, 21.58, 28.8, 40.35, 45.03]  DU=[2.5, 13.48, 6.02, 8.55, 3.48, 1.6]
const WALKER = PEOPLE[1];
const dexP5 = t => lerp(-900, 700, seg(t, 28.8, 37.0));
const SHOTS_S5 = [
  // 0 the park: Biscuit stops dead, sniffs, stares straight at the eyeballs
  { t: 0, ref: RR, cam: push(0, 7.0, { x: 0, y: GY - 360, z: 1.12, r: 0 }, { x: 80, y: GY - 340, z: 1.25, r: 0 }, 'lin'), draw: (t, c, L) => {
      const wx = lerp(-1300, -360, seg(t, 0, 2.4)), stop = t > 2.4;
      const K = [[0, walkPose(t, 7)], [2.4, { ...POSES.idle, armF: [60, -20], look: [9, 2] }, 'o'], [4.8, { ...POSES.shrug, look: [9, 0] }, 'o']];
      return parkW(t, L) + L(1, who(WALKER, K, t, wx, GY - 40, { s: DS*.95 }, 30) + dog4(wx + 330, GY - 40, .85, t, { flip: true, wag: stop, sniff: t > 2.6 && t < 4.4, alarm: t > 4.4, lead: [wx + 70, GY - 230] }) + slippers(t, 520, GY - 50, 1.05, false) + dexI([[0, { eyes: 'happy' }], [4.4, { eyes: 'wide', look: [-9, 4] }, 'snap']], t, 520, GY - 40)) +
        bang(t, 2.7, 700, 360, 'sniff sniff', '#fff', 56, -4, 4.4) + chipAt(t, 3.4, 960, 120, "SOME ANIMALS DON'T NEED TO SEE YOU", '#7ED957', 44); } },
  // 1 receptors: about 6 million (you) vs up to about 300 million (a dog)
  { t: 7.0, ref: GC, cam: push(7.0, 21.5, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      const n1 = Math.round(6*seg(t, 8.0, 9.0)), n2 = Math.round(300*E.io(seg(t, 9.6, 12.4)));
      const p = chibi2({ ...WALKER, ...mixPose(POSES.idle, POSES.idle, 1), x: 430, y: 980, s: .9, t });
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, p + dog4(1520, 980, 1.0, t, { wag: true }) + dotGrid(330, 220, n1, 3, 60, 18, '#FFD23F') + dotGrid(1100, 150, n2, 25, 30, 10, '#B6FF5C')) +
        chipAt(t, 8.2, 430, 560, 'YOU: ≈ 6 MILLION', '#3D8BFF', 46) + chipAt(t, 10.2, 1520, 600, 'A DOG: UP TO ≈ 300 MILLION', '#7ED957', 44) + chipAt(t, 7.3, 960, 70, 'SMELL RECEPTORS', '#5CF2FF', 50) +
        (t > 15.4 ? `<g transform="translate(960,1000) scale(${pop(t, 15.4, .3)})">${chip('≈ 10,000–100,000× SHARPER (ESTIMATE)', 0, 0, '#E8463C', 46)}</g>` : ''); } },
  // 2 the smell part of a dog's brain: for its size, about 40 times bigger
  { t: 21.5, ref: GC, cam: push(21.5, 28.75, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = E.o(seg(t, 22.6, 23.6));
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, brainIcon(560, 520, 1.3, .4) + brainIcon(1380, 540, .85, .4 + 2.2*k)) +
        `<g transform="translate(560,800)">${txt('YOU', 0, 0, 60, '#fff')}</g><g transform="translate(1380,800)">${txt('A DOG', 0, 0, 60, '#fff')}</g>` + chipAt(t, 21.8, 960, 110, 'THE SMELL PART OF THE BRAIN', '#B07CFF', 50) + chipAt(t, 24.2, 960, 960, 'FOR ITS SIZE: ≈ 40× BIGGER', '#7ED957', 52); } },
  // 3 dog-vision: a glowing trail of smelly footprints; Biscuit follows it exactly
  { t: 28.75, ref: RR, cam: t => ({ x: dexP5(t) - 120, y: GY - 330, z: 1.2, r: 0 }), draw: (t, c, L) => {
      const dx = dexP5(t), pts = []; for (let i = 0; i < 30; i++) { const tt = 28.8 + i*.28; if (tt > t) break; pts.push([dexP5(tt) + (i % 2 ? 24 : -24), GY - 34 + (i % 2 ? 8 : 0)]); }
      const bx = dexP5(Math.max(28.8, t - 1.4)) - 120, wx = bx - 520, conf = t > 34.9;
      return `<g filter="url(#dogV)">${parkW(t, L)}</g>` + L(1, `<rect x="-6000" y="-3000" width="12000" height="7000" fill="#2A1B4A" opacity=".35"/>` + scentTrail(t, pts) + who(WALKER, [[0, walkPose(t, 6)], [34.9, { ...POSES.shrug, look: [9, -4] }, 'o']], t, wx, GY - 40, { s: DS*.95 }, 30) + dog4(bx, GY - 40, .85, t, { flip: true, sniff: true, wag: true, lead: [wx + 70, GY - 230] }).replace(`translate(${bx},`, `translate(${bx},`) + slippers(t, dx, GY - 50, 1.05, true, 28.8, 1.2) + dexI([[0, walkPose(t, 7, { eyes: 'open', look: [9, 0] })], [33.0, { eyes: 'open', look: [-9, 2] }, 'o']], t, dx, GY - 40)) +
        chipAt(t, 29.0, 960, 120, 'DOG-VISION', '#B6FF5C', 56) + chipAt(t, 30.5, 960, 210, 'A TRAIL OF SMELL', '#7ED957', 48) + (conf ? chipAt(t, 34.9, 960, 960, 'INVISIBLE TO PEOPLE. OBVIOUS TO BISCUIT.', '#FFD23F', 40) : ''); } },
  // 4 Biscuit bounds up and licks the air where Dex's face is
  { t: 37.35, ref: RR, cam: push(37.35, 40.3, { x: 640, y: GY - 260, z: 1.8, r: 0 }, { x: 640, y: GY - 260, z: 2.0, r: 3 }, 'lin'), draw: (t, c, L) => {
      const jump = Math.max(0, Math.sin(seg(t, 37.5, 38.2)*Math.PI))*80, licking = t > 38.0;
      return parkW(t, L, 'b4') + L(1, slippers(t, 700, GY - 50, 1.05, false) + dexI([[0, { eyes: 'wide', look: [-9, 4] }], [38.1, { eyes: 'squeeze', tilt: 10 }, 'snap'], [39.4, { eyes: 'happy', tilt: -6 }, 'o']], t, 700, GY - 40) + dog4(880, GY - 40 - jump - (licking ? 60 : 0), 1.0, t, { wag: true, lick: licking, alarm: false })) + bang(t, 38.1, 1500, 300, 'SLURP!', '#FF7E9A', 100, -6); } },
  // 5 that's why police use sniffer dogs
  { t: 40.3, ref: RR, cam: push(40.3, 45.0, { x: 0, y: GY - 360, z: 1.15, r: 0 }, { x: 40, y: GY - 360, z: 1.22, r: 0 }, 'lin'), draw: (t, c, L) => {
      const hide = `<g transform="translate(480,${GY - 40})">${bush(0, 0, 1.6)}</g>` + `<g transform="translate(520,${GY - 30})">${[0, 1].map(i => `<rect x="${-20 + i*50}" y="-14" width="40" height="20" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`;
      return parkW(t, L) + L(1, hide + who(POLICE, [[0, { ...POSES.idle, armF: [60, -20], look: [9, 0] }]], t, -560, GY - 40) + dog4(-200 + 120*seg(t, 40.5, 43), GY - 40, .95, t, { dark: true, sniff: true, lead: [-490, GY - 230] }).replace(/scale\(([\d.]+)\)/, (m, v) => `scale(-${v},${v})`)) +
        chipAt(t, 40.6, 960, 120, 'POLICE SNIFFER DOGS', '#3D8BFF', 54) + bang(t, 43.2, 1350, 360, 'WOOF!', '#fff', 70, 6); } },
  // 6 RULE 5
  { t: 45.0, ref: RR, cam: push(45.0, END, { x: 300, y: GY - 360, z: 1.3, r: 0 }, { x: 320, y: GY - 360, z: 1.36, r: 0 }, 'lin'), draw: (t, c, L) =>
      parkW(t, L, 'b2') + L(1, slippers(t, 60, GY - 50, 1.05, false) + dexI([[0, { eyes: 'happy' }]], t, 60, GY - 40) + dog4(330, GY - 40, .85, t, { wag: true })) + note(t, 45.05, 1350, 400, 'RULE 5', 'DOGS', 'KNOW.') },
];
const SHAKES_S5 = [[38.1, 6, .3]];
function scene(t) { let s = EP3DEFS + EP4DEFS + `<defs><filter id="dogV" x="0" y="0" width="100%" height="100%"><feColorMatrix type="saturate" values=".25"/></filter></defs>` + playShots(t, SHOTS_S5, SHAKES_S5) + vignette(); [7.0, 28.75, 45.0].forEach(w => s += wipe(t, w)); return s; }
