// RIG2
// Ep4 s2: Rule 2, don't eat in public. END 51.03   ST=[3.0, 18.0, 26.7, 38.55, 47.37]  DU=[8.3, 7.1, 10.45, 7.42, 1.86]
const TX = -150, DXX = 150, BWX = 380;                  // table centre; Dex's seat (x)
const SEATY = GY - 40;                       // Dex stands at the table (feet)
function bites(t) {   // food state over time
  const f = { mouth: 0, throat: -1, stomach: 0 };
  const B = [[11.6, 14.2, 15.4], [15.9, 16.9, 17.7]];   // chew start, swallow start, plop
  B.forEach(([a, b, c], i) => { if (t >= a && t < b) f.mouth = Math.min(1, (t - a)*4); if (t >= b && t < c) f.throat = (t - b)/(c - b); });
  f.stomach = t < 15.4 ? 0 : t < 17.7 ? .62 : 1;
  if (t >= 15.4) f.stomach *= (1 + .15*Math.exp(-(t - (t < 17.7 ? 15.4 : 17.7))*8)*Math.sin((t - 15.4)*30));
  return f;
}
const mumK0 = [[0, { ...POSES.idle, armF: [70, -60], eyes: 'happy', mouth: 'smile', look: [6, 0] }]];
function table4(t) { return `<g transform="translate(${TX},${GY - 40})"><rect x="-520" y="-180" width="1040" height="30" rx="8" fill="#C08A55" stroke="${INK}" stroke-width="7"/><rect x="-490" y="-150" width="26" height="150" fill="#A9733F" stroke="${INK}" stroke-width="5"/><rect x="464" y="-150" width="26" height="150" fill="#A9733F" stroke="${INK}" stroke-width="5"/></g>`; }
const TOP = GY - 220;   // table top surface
const SHOTS_S2 = [
  // 0 breakfast: the box tips by itself, the milk pours
  { t: 0, ref: RR, cam: push(0, 7.2, { x: -100, y: GY - 400, z: 1.15, r: 0 }, { x: -60, y: GY - 400, z: 1.22, r: 0 }, 'lin'), draw: (t, c, L) => {
      const tip = E.io(seg(t, 3.4, 4.0)) - E.io(seg(t, 5.0, 5.5)), pour = t > 3.9 && t < 5.1, mtip = E.io(seg(t, 5.4, 5.9)) - E.io(seg(t, 6.6, 7.0));
      let fl = ''; if (pour) for (let i = 0; i < 12; i++) { const k = ((t*3 + i/12) % 1); fl += `<ellipse cx="${BWX - 40 + Math.sin(i)*14}" cy="${TOP - 260 + k*200}" rx="10" ry="6" fill="#E8B04A" stroke="${INK}" stroke-width="2"/>`; }
      if (t > 5.8 && t < 6.7) fl += `<path d="M${BWX + 70},${TOP - 210} Q${BWX + 30},${TOP - 150} ${BWX + 10},${TOP - 50}" stroke="#FFF8EA" stroke-width="16" fill="none" stroke-linecap="round"/>`;
      return kitchen(t, L) + L(1, table4(t) + who(MUM, mumK0, t, -700, GY - 40) + mug(-560, TOP, 1) + bowl(BWX, TOP, 1, seg(t, 4.0, 6.6)) +
        cerealBox(BWX - 120 + 80*tip, TOP, 1, lerp(0, 110, tip)) + milkJug(BWX + 240 - 80*mtip, TOP, 1, lerp(0, -100, mtip)) + fl + slippers(t, DXX, GY - 70, 1.05, false) + dexI([[0, { eyes: 'happy' }], [5.0, { eyes: 'open', look: [0, 6] }, 'o']], t, DXX, SEATY)) +
        chipAt(t, 3.2, 960, 120, 'NEXT PROBLEM: BREAKFAST', '#FF8A3D', 54); } },
  // 1 picked up = visible: the spoon rises to mouth height
  { t: 7.2, ref: RR, cam: push(7.2, 11.4, { x: DXX - 100, y: GY - 360, z: 1.6, r: 0 }, { x: DXX - 60, y: GY - 380, z: 1.85, r: 2 }, 'lin'), draw: (t, c, L) => {
      const up = E.o(seg(t, 8.4, 9.6)), sx = lerp(BWX, DXX + 30, up), sy = lerp(TOP - 60, SEATY - 205*DS, up);
      return kitchen(t, L, 'b4') + L(1, table4(t) + bowl(BWX, TOP, 1, 1) + spoon(sx + 20, sy, 1, lerp(30, 160, up), up > .3) + dexI([[0, { eyes: 'open', look: [0, 6] }], [9.4, { eyes: 'wide', look: [0, 3] }, 'o']], t, DXX, SEATY)) +
        chipAt(t, 8.2, 960, 120, 'PICKED UP = VISIBLE', '#E8463C', 56); } },
  // 2 the gag: chewed in mid-air, down an invisible throat, plop into the stomach blob
  { t: 11.4, ref: RR, cam: push(11.4, 18.0, { x: DXX + 40, y: SEATY - 190, z: 2.3, r: 0 }, { x: DXX + 40, y: SEATY - 180, z: 2.45, r: -2 }, 'lin'), draw: (t, c, L) => {
      const f = bites(t), spoonUp = (t > 11.4 && t < 11.7) || (t > 15.7 && t < 16.0);
      const K = [[0, { eyes: 'happy' }], [14.2, { eyes: 'squeeze' }, 'snap'], [15.4, { eyes: 'wide', look: [0, 8] }, 'o'], [16.0, { eyes: 'happy' }, 'o'], [17.8, { eyes: 'open', look: [-9, 0] }, 'o']];
      const mK = [[0, mumK0[0][1]], [12.0, { ...POSES.surprise, eyes: 'wide', mouth: 'wobble', look: [9, 0] }, 'o']];
      return kitchen(t, L, 'b8') + L(1, table4(t) + who(MUM, mK, t, -560, GY - 40) + bowl(BWX, TOP, 1, .7) + (spoonUp ? spoon(DXX + 60, SEATY - 205*DS + 20, 1, 160, 1) : spoon(BWX + 90, TOP - 30, 1, 40, 0)) + dexI(K, t, DXX, SEATY, { food: f })) +
        bang(t, 12.2, 1450, 260, 'CHOMP', '#FFD23F', 80, -6, 14.0) + bang(t, 14.25, 1450, 360, 'gulp', '#fff', 70, 6, 15.3) + bang(t, 15.4, 1450, 760, 'PLOP!', '#FF8A3D', 90, -4, 16.4) + bang(t, 17.7, 1450, 760, 'PLOP!', '#FF8A3D', 90, 6); } },
  // 3 two to five hours in the stomach, being churned
  { t: 18.0, ref: RR, cam: push(18.0, 26.65, { x: 60, y: GY - 330, z: 1.55, r: 0 }, { x: 60, y: GY - 330, z: 1.7, r: 0 }, 'lin'), draw: (t, c, L) => {
      const hr = lerp(8, 13, seg(t, 19.5, 25.5)), ch = 1 + .5*Math.sin(t*1.4);
      const f = { mouth: 0, throat: -1, stomach: 1, slosh: 2.2*ch };
      return L(0, studioBack(t, '#2A3D8F', '#1B2A6B', '#34489E')) + L(1, studioFloor() + dexI([[0, { eyes: 'open', look: [6, 4] }], [21.5, { eyes: 'squeeze' }, 'o'], [22.5, { eyes: 'open', look: [-6, 6] }, 'o']], t, -150, GY, { food: f }) + `<g transform="translate(520,${GY - 420})">${clockF(0, 0, 150, Math.floor(hr), (hr % 1)*60)}</g>`) +
        chipAt(t, 19.2, 1240, 140, 'IN THE STOMACH: ≈ 2–5 HOURS', '#FF8A3D', 48) + chipAt(t, 22.4, 1240, 940, 'CHURNED INTO MUSH', '#B07CFF', 50); } },
  // 4 all morning: a pair of eyeballs and a floating lump of cereal walking down the street
  { t: 26.65, ref: RR, cam: t => ({ x: lerp(-700, 700, seg(t, 26.65, 38.5)) + 100, y: GY - 360, z: 1.18, r: 0 }), draw: (t, c, L) => {
      const x = lerp(-900, 700, seg(t, 26.8, 38.3)), f = { mouth: 0, throat: -1, stomach: .95, slosh: 1.6 };
      const K = [[0, { ...POSES.idle, eyes: 'happy', legL: [-20, 10], legR: [20, -10] }]];
      let ppl = ''; [[-300, 0, 29.0], [500, 2, 33.0]].forEach(([px, i, a]) => ppl += person(i, [[0, 'idle'], [a, { ...POSES.surprise, eyes: 'wide', mouth: 'o', look: [-9, 0] }, 'snap']], t, px, GY - 140));
      return L(1, terrace(t)) + L(1, ppl + slippers(t, x, GY - 170, 1.05, true, 26.8, 1.2) + dexI(K, t, x, GY - 140, { food: f, bob: Math.abs(Math.sin(t*7.5))*-8 })) +
        chipAt(t, 27.0, 960, 120, 'THEN: THE INTESTINES', '#B07CFF', 52) + chipAt(t, 28.5, 960, 220, 'HOURS MORE', '#FF8A3D', 48) + chipAt(t, 33.5, 960, 960, 'ALL MORNING', '#E8463C', 56); } },
  // 5 a drink would be gone sooner
  { t: 38.5, ref: RR, cam: push(38.5, 47.3, { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 0, y: GY - 330, z: 1.48, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = seg(t, 40.4, 42.6);
      const juice = { mouth: 0, throat: -1, stomach: 0 };
      const js = '';
      return L(0, studioBack(t)) + L(1, studioFloor() + dexI([[0, { eyes: 'open' }], [42.6, { eyes: 'wide', look: [8, 0] }, 'o']], t, -360, GY, { food: { mouth: 0, throat: t > 39.4 && t < 40.1 ? (t - 39.4)/.7 : -1, stomach: t < 40.1 ? 0 : 1 - E.io(seg(t, 40.4, 42.6)), juice: true, slosh: 2 } }) + juiceGlass(-580, GY - 40, 1, 1 - seg(t, 39.4, 40.0)) + js +
        dexI([[0, { eyes: 'open', look: [-6, 4] }], [44.0, { eyes: 'squeeze' }, 'o']], t, 360, GY, { food: { mouth: 0, throat: -1, stomach: 1, slosh: 1.5 } }) + bowl(580, GY - 40, .8, 0)) +
        chipAt(t, 40.2, 480, 140, 'LIQUIDS: MUCH FASTER', '#FFA62E', 44) + chipAt(t, 43.8, 1440, 140, 'CEREAL: STILL HERE', '#E8B04A', 44); } },
  // 6 RULE 2
  { t: 47.3, ref: RR, cam: push(47.3, END, { x: 300, y: GY - 400, z: 1.25, r: 0 }, { x: 320, y: GY - 400, z: 1.3, r: 0 }, 'lin'), draw: (t, c, L) =>
      kitchen(t, L, 'b2') + L(1, table4(t) + bowl(BWX, TOP, 1, 0) + dexI([[0, { eyes: 'happy' }]], t, DXX, SEATY, { food: { mouth: 0, throat: -1, stomach: 1, slosh: 1 } })) + note(t, 47.35, 1300, 380, 'RULE 2', "DON'T EAT", 'IN PUBLIC.') },
];
const SHAKES_S2 = [[15.4, 6, .25], [17.7, 6, .25]];
function scene(t) { let s = EP3DEFS + EP4DEFS + playShots(t, SHOTS_S2, SHAKES_S2) + vignette(); [18.0, 38.5].forEach(w => s += wipe(t, w)); return s; }
