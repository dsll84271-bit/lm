// RIG2
// Ep4 h: the floating-hoodie scare (no fighting). END 78.39
// ST=[3.0, 10.21, 22.01, 33.32, 39.85, 43.54, 52.68, 64.2, 68.89]  DU=[4.01, 10.2, 8.51, 5.33, 2.69, 3.54, 9.92, 3.29, 7.3]
const GRAB = 3.7, DXH = 520;                     // snatch time; where Dex stands on the high street
const thiefX = t => t < GRAB ? lerp(1500, 120, seg(t, 2.4, GRAB)) : lerp(120, -1800, E.in(seg(t, GRAB, 6.0)));
const runP = (t, sp=12, lean=10) => ({ ...walkPose(t, sp), lean, armF: [-50*Math.sin(t*sp), 30], armB: [50*Math.sin(t*sp), -30], eyes: 'determined', mouth: 'grit' });
const SIDE = { x: 0 };                            // alley: thief at x 0, hoodie comes from the back
const SHOTS_H = [
  // 0 evening on the high street
  { t: 0, ref: RR, cam: push(0, 3.0, { x: 200, y: GY - 420, z: 1.0, r: 0 }, { x: 240, y: GY - 420, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const wx = lerp(-600, 0, seg(t, 0, 3.0));
      return highStreet(t, L) + L(1, who(WOMAN, [[0, walkPose(t, 6, { armF: [20, 60] })]], t, wx, GY - 130) + handbag(wx + 70, GY - 300, .8, 8) + backpack(DXH + 70, GY - 260, .8) + slippers(t, DXH, GY - 140, 1.05, false) + dexI([[0, { eyes: 'happy' }]], t, DXH, GY - 130)) + chipAt(t, .3, 960, 120, 'THAT EVENING', '#B07CFF', 56); } },
  // 1 a thief grabs her bag and runs
  { t: 3.0, ref: RR, cam: push(3.0, 7.0, { x: 150, y: GY - 380, z: 1.15, r: -2 }, { x: 60, y: GY - 380, z: 1.22, r: 2 }, 'lin'), draw: (t, c, L) => {
      const tx = thiefX(t), got = t > GRAB;
      const wK = [[0, walkPose(t, 6, { armF: [20, 60] })], [GRAB, { ...POSES.surprise, eyes: 'shock', mouth: 'wail', armF: [120, 30], look: [-9, 0] }, 'snap']];
      return highStreet(t, L) + L(1, who(WOMAN, wK, t, 0, GY - 130) + (got ? '' : handbag(70, GY - 300, .8, 8)) + who(THIEF, [[0, runP(t)], [GRAB + .2, runP(t, 14, -10)]], t, tx, GY - 130, {}, 40) + (got ? handbag(tx - 60, GY - 330, .8, -20) : '') + backpack(DXH + 70, GY - 260, .8) + slippers(t, DXH, GY - 140, 1.05, false) + dexI([[0, { eyes: 'happy' }], [GRAB + .1, { eyes: 'wide', look: [-9, 0] }, 'snap']], t, DXH, GY - 130) + (got && t < GRAB + .5 ? speedLines(t, 8, .3, '#fff', -1) : '')) +
        bang(t, GRAB + .05, 560, 300, 'HEY!', '#E8463C', 110, -8) + (t > 5.8 ? `<g transform="translate(260,700)">${txt('THIEF!', 0, 0, 70, '#fff')}</g>` : ''); } },
  // 2 Dex's eyes go determined
  { t: 7.0, ref: RR, cam: push(7.0, 10.2, { x: DXH, y: GY - 400, z: 2.6, r: 0 }, { x: DXH, y: GY - 400, z: 3.0, r: -4 }, 'in'), draw: (t, c, L) =>
      highStreet(t, L, 'b8') + L(1, dexI([[0, { eyes: 'wide', look: [-9, 0] }], [8.0, { eyes: 'determined', look: [-9, 0] }, 'snap']], t, DXH, GY - 130) + backpack(DXH + 70, GY - 260, .8)) + (t > 8.0 && t < 8.1 ? focusLines(t, 960, 540, .8, 300) : '') },
  // 3 no fighting; two things the thief doesn't expect
  { t: 10.2, ref: RR, cam: push(10.2, 22.0, { x: DXH, y: GY - 340, z: 1.7, r: 0 }, { x: DXH, y: GY - 340, z: 1.85, r: 0 }, 'lin'), draw: (t, c, L) => {
      const no = t > 11.2 && t < 13.6 ? Math.sin(t*10)*9 : 0;
      const out = E.o(seg(t, 18.8, 19.6)), hx = lerp(DXH + 70, DXH + 260, out), hy = lerp(GY - 260, GY - 420, out);
      return highStreet(t, L, 'b4') + L(1, dexI([[0, { eyes: 'determined', look: [no, 6] }], [13.8, { eyes: 'open', look: [0, 0] }, 'o'], [16.0, { eyes: 'happy' }, 'o'], [19.0, { eyes: 'open', look: [9, -4] }, 'o']], t, DXH, GY - 130) + backpack(DXH + 70, GY - 260, .8) + (t > 18.8 ? foldedHoodie(hx, hy, 1.1, -10 + 10*out) : '')) +
        chipAt(t, 10.6, 960, 120, 'NO FIGHTING', '#E8463C', 60) + (t > 15.6 ? `<g transform="translate(330,380) scale(${pop(t, 15.6, .3)})">${chip('1. FLOATING EYEBALLS', 0, 0, '#3D8BFF', 44)}</g>` : '') + (t > 17.9 ? `<g transform="translate(1500,520) scale(${pop(t, 17.9, .3)})">${chip('2. A SPARE HOODIE', 0, 0, '#FFC21F', 44)}</g>` : ''); } },
  // 4 he pulls it on: an empty hoodie, eyes in the hood; the slippers stay behind
  { t: 22.0, ref: RR, cam: push(22.0, 33.3, { x: DXH - 100, y: GY - 360, z: 1.45, r: 0 }, { x: DXH - 300, y: GY - 380, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) => {
      const ON0 = 23.2, ON1 = 24.4, k = E.io(seg(t, ON0, ON1)), fl = t > 29.0 ? (t - 29.0) : 0;
      const x = DXH - fl*150, y = GY - 130 - Math.min(1, fl)*40 + Math.sin(t*2.4)*8*(fl > 0 ? 1 : 0);
      const K = [[0, { eyes: 'open', look: [9, -4] }], [ON1, { ...POSES.idle, eyes: 'happy', armF: [-10, 20], armB: [10, -20] }, 'o'], [26.0, { ...POSES.idle, eyes: 'open', armF: [30, 20], armB: [-30, -20] }, 'o'], [29.0, { ...POSES.idle, eyes: 'determined', look: [-9, 2], armF: [-6, 6], armB: [6, -6], air: true }, 'o']];
      let body = '';
      if (t < ON0) body = dexI(K, t, x, y) + foldedHoodie(DXH + 200 - 200*seg(t, 22.0, ON0), GY - 520, 1.1);
      else if (t < ON1) body = `<g transform="translate(0,${-(1 - k)*260}) translate(${x},${y}) scale(1,${.55 + .45*k}) translate(${-x},${-y})">${dexH(K, t, x, y, { noEyes: true })}</g>` + dexI(K, t, x, y);
      else body = dexH(K, t, x, y, { air: fl > 0 });
      return highStreet(t, L, 'b2') + L(1, slippers(t, DXH, GY - 140, 1.05, false) + backpack(DXH + 160, GY - 150, .8) + body) +
        chipAt(t, 24.6, 960, 120, 'SPARE HOODIE: VISIBLE', '#FFC21F', 54) + chipAt(t, 27.0, 960, 960, 'AN EMPTY HOODIE… WITH EYES', '#5CF2FF', 48) + (t > 29.2 ? `<g transform="translate(1420,700)">${txt('(slippers off)', 0, 0, 40, '#fff')}</g>` : ''); } },
  // 5 the alley: he thinks he's safe, he thinks he's alone
  { t: 33.3, ref: RR, cam: push(33.3, 39.8, { x: 100, y: GY - 360, z: 1.3, r: 0 }, { x: 120, y: GY - 360, z: 1.45, r: 2 }, 'lin'), draw: (t, c, L) => {
      const pant = Math.sin(t*9)*.04;
      const K = [[0, { ...POSES.idle, eyes: 'closed', mouth: 'o', lean: 8, sq: .96 + pant, armF: [20, 60] }], [36.2, { ...POSES.confident, eyes: 'happy', mouth: 'smirk' }, 'o']];
      return alleyW(t, L) + L(1, who(THIEF, K, t, 300, GY - 140, {}, 40) + handbag(380, GY - 290, .8, 10)) + chipAt(t, 35.4, 960, 120, "HE THINKS HE'S SAFE", '#7ED957', 52) + chipAt(t, 37.3, 960, 220, "HE THINKS HE'S ALONE", '#E8463C', 50); } },
  // 6 the hoodie glides out of the dark, slowly, silently
  { t: 39.8, ref: RR, cam: push(39.8, 43.5, { x: -300, y: GY - 360, z: 1.5, r: 0 }, { x: -250, y: GY - 360, z: 1.75, r: 0 }, 'in'), draw: (t, c, L) => {
      const k = seg(t, 39.8, 43.4), x = lerp(-900, -320, k), sc = lerp(.6, 1, k), y = GY - 160 + Math.sin(t*2.4)*8;
      return alleyW(t, L, 'b2') + L(1, `<rect x="-3000" y="-2000" width="6000" height="4000" fill="#000" opacity=".35"/>` + `<g opacity="${.4 + .6*k}">${dexH([[0, { ...POSES.idle, eyes: 'determined', look: [9, 0], armF: [-6, 6], armB: [6, -6] }]], t, x, y, { s: DS*sc, air: true })}</g>`) + chipAt(t, 40.2, 960, 980, 'SLOWLY. SILENTLY.', '#5CF2FF', 50); } },
  // 7 he looks back... an empty hoodie, floating, staring
  { t: 43.5, ref: RR, cam: t => t < 46.2 ? camAt(push(43.5, 46.2, { x: 300, y: GY - 400, z: 2.4, r: 0 }, { x: 300, y: GY - 400, z: 2.8, r: 4 }, 'lin'), t) : camAt(push(46.2, 52.65, { x: -120, y: GY - 390, z: 1.25, r: 0 }, { x: -60, y: GY - 400, z: 1.5, r: -2 }, 'io'), t), draw: (t, c, L) => {
      const SCR = 48.6, y = GY - 160 + Math.sin(t*2.4)*8, tilt = t > 47.2 && t < 48.2 ? 16*Math.sin(seg(t, 47.2, 48.2)*Math.PI) : 0;
      const K = [[0, { ...POSES.confident, eyes: 'happy', mouth: 'smirk' }], [44.6, { ...POSES.idle, eyes: 'open', mouth: 'flat', look: [-9, 0], tilt: -6 }, 'o'], [45.6, { ...POSES.surprise, eyes: 'wide', mouth: 'o', look: [-9, 0] }, 'snap'], [SCR, { ...POSES.flinch, eyes: 'shock', mouth: 'wail', look: [-9, 0], brow: 18 }, 'snap']];
      const hK = [[0, { ...POSES.idle, eyes: 'determined', look: [9, 0], armF: [-6, 6], armB: [6, -6] }], [47.2, { ...POSES.idle, eyes: 'wide', look: [9, 0], tilt: 16, armF: [-6, 6], armB: [6, -6] }, 'o'], [48.1, { ...POSES.idle, eyes: 'open', look: [9, 0], blink: 1, armF: [-6, 6], armB: [6, -6] }, 'snap'], [48.3, { ...POSES.idle, eyes: 'wide', look: [9, 0], armF: [100, 60], armB: [-100, -60] }, 'o']];
      let s = alleyW(t, L) + L(1, dexH(hK, t, -320, y, { air: true, tilt }) + who(THIEF, K, t, 300, GY - 140, {}, 40) + handbag(380, GY - 290, .8, 10));
      if (t >= SCR && t < SCR + .12) { const f = Math.floor((t - SCR)*30); s = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${s}${focusLines(t, 1200, 400, 1, 260)}</g>`; }
      return s + bang(t, SCR, 1450, 260, 'AAAAAAH!', '#E8463C', 120, -8) + (t > 47.3 && t < 48.4 ? `<g transform="translate(560,300)">${txt('…', 0, 0, 90, '#fff')}</g>` : ''); } },
  // 8 drops the bag, runs straight into a police officer; the bag floats back to its owner
  { t: 52.65, ref: RR, cam: t => t < 57.6 ? { x: lerp(200, -500, seg(t, 52.65, 57.4)), y: GY - 400, z: 1.15, r: 0 } : camAt(push(57.6, 64.15, { x: 200, y: GY - 420, z: 1.05, r: 0 }, { x: 300, y: GY - 420, z: 1.1, r: 0 }, 'lin'), t), draw: (t, c, L) => {
      if (t < 57.6) { const tx = lerp(300, -1200, E.in(seg(t, 53.0, 56.6))), hit = t > 56.4, px = -1150;
        const K = [[0, { ...POSES.flinch, eyes: 'shock', mouth: 'wail' }], [53.2, runP(t, 16, -14), 'snap']];
        return alleyW(t, L) + L(1, (t > 53.0 ? handbag(380, GY - 160, .8, 70) : handbag(380, GY - 290, .8, 10)) + who(THIEF, hit ? [[0, { ...POSES.surprise, eyes: 'swirl', mouth: 'o' }]] : K, t, hit ? px + 160 : tx, GY - 140, {}, 40) + who(POLICE, [[0, { ...POSES.idle, look: [9, 0] }], [56.4, { ...POSES.ready, armF: [100, -30], look: [9, 0] }, 'snap']], t, px, GY - 140) +
          dexH([[0, { ...POSES.idle, eyes: 'happy', armF: [-6, 6], armB: [6, -6] }]], t, -320, GY - 160 + Math.sin(t*2.4)*8, { air: true })) + bang(t, 56.45, 600, 300, 'OOF!', '#FFD23F', 90, 6) + chipAt(t, 53.2, 960, 120, 'NO PUNCHES. NO CHASE.', '#7ED957', 50); }
      const k = seg(t, 58.6, 62.4), hx = lerp(-900, -60, E.io(k)), hy = GY - 170 + Math.sin(t*2.4)*8;
      return highStreet(t, L) + L(1, who(WOMAN, [[0, { ...POSES.worried, look: [-9, 0] }], [61.6, { ...POSES.surprise, eyes: 'wide', look: [-9, 0] }, 'o']], t, 240, GY - 130) + who(POLICE, [[0, { ...POSES.confident, look: [9, 0] }]], t, -1250, GY - 130) + who(THIEF, [[0, { ...POSES.worried, eyes: 'swirl', mouth: 'wobble' }]], t, -1050, GY - 130, {}, 40) +
        dexH([[0, { ...POSES.idle, eyes: 'happy', armF: [100, -30], armB: [6, -6] }]], t, hx, hy, { air: true }) + handbag(hx + 130, hy - 200, .8, 0)) + chipAt(t, 58.2, 960, 120, 'BAG: BACK WITH ITS OWNER ✓', '#7ED957', 50); } },
  // 9 she says thank you to a hoodie with nobody inside it
  { t: 64.15, ref: RR, cam: push(64.15, 68.85, { x: 120, y: GY - 400, z: 1.6, r: 0 }, { x: 120, y: GY - 400, z: 1.75, r: 0 }, 'lin'), draw: (t, c, L) =>
      highStreet(t, L, 'b4') + L(1, who(WOMAN, [[0, { ...POSES.surprise, eyes: 'wide', look: [-9, 0], armF: [60, -20] }], [65.6, { ...POSES.smile, mouth: 'wobble', armF: [60, -20], look: [-9, 0] }, 'o']], t, 300, GY - 130) + handbag(380, GY - 300, .8, 8) +
        dexH([[0, { ...POSES.idle, eyes: 'happy', armF: [-6, 6], armB: [6, -6] }], [66.6, { ...POSES.knuckle, eyes: 'happy', handF: null, handB: null }, 'o']], t, -80, GY - 160 + Math.sin(t*2.4)*8, { air: true })) + (t > 65.2 ? speech(1220, 330, pop(t, 65.2, .3), '…thank you?', '#1F2033', 460) : '') },
  // 10 the trick: being seen at exactly the right moment
  { t: 68.85, ref: RR, cam: push(68.85, END, { x: 0, y: GY - 420, z: 1.15, r: 0 }, { x: 0, y: GY - 400, z: 1.3, r: 0 }, 'lin'), draw: (t, c, L) =>
      highStreet(t, L, 'b2') + L(1, dexH([[0, { ...POSES.idle, eyes: 'happy', armF: [-6, 6], armB: [6, -6] }], [72.5, { ...POSES.cheer, eyes: 'happy', handF: null, handB: null }, 'o']], t, 0, GY - 160 + Math.sin(t*2.4)*8, { air: true }) + (t > 72.5 ? sparkles(0, GY - 300, t, 6, 250) : '')) +
      chipAt(t, 69.6, 960, 120, "INVISIBILITY DOESN'T MAKE YOU STRONG", '#B07CFF', 44) + chipAt(t, 72.4, 960, 960, 'BEING SEEN AT THE RIGHT MOMENT', '#FFD23F', 50) },
];
const SHAKES_H = [[GRAB, 10, .4], [48.6, 22, .5], [56.45, 18, .4]];
function scene(t) { let s = EP3DEFS + EP4DEFS + playShots(t, SHOTS_H, SHAKES_H) + vignette(); [33.3, 64.15].forEach(w => s += wipe(t, w)); return s; }
