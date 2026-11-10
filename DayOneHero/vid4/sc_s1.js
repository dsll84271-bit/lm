// RIG2
// Ep4 s1: Rule 1, your eyes give you away. END 69.12
// ST=[0.8, 11.54, 17.28, 30.01, 39.3, 49.29, 61.35, 65.21]  DU=[9.94, 4.14, 11.33, 8.09, 8.79, 7.36, 2.86, 2.11]
const MX = 1180, EYEH = GY - 250*DS;   // where Dex stands; eyeball height
function bedSet(t, L, c, blur='') { return bedroom(t, L, c, blur) + L(1, `<g transform="translate(${MX},${GY - 140})"><rect x="-170" y="-720" width="340" height="700" rx="16" fill="#C08A55" stroke="${INK}" stroke-width="7"/><rect x="-140" y="-690" width="280" height="640" rx="10" fill="#BFE6FF" stroke="${INK}" stroke-width="5"/><path d="M-110,-150 L60,-660 M-60,-80 L110,-600" stroke="#fff" stroke-width="22" opacity=".45"/></g>`, blur); }
const SHOTS_S1 = [
  // 0 to see, the retina absorbs light and signals the brain
  { t: 0, ref: GC, cam: push(0, 11.4, { x: 900, y: 540, z: .92, r: 0 }, { x: 960, y: 540, z: 1.0, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, eyeDiagram(t, 900, 560, 250, { rays: seg(t, 1.2, 3.4), signal: seg(t, 7.6, 8.2) })) +
      chipAt(t, 1.0, 960, 110, 'HOW YOU SEE', '#5CF2FF', 56) + chipAt(t, 4.6, 1230, 860, 'RETINA', '#E8463C', 48) + chipAt(t, 6.6, 1230, 960, 'ABSORBS THE LIGHT', '#FF8A3D', 42) + chipAt(t, 8.6, 1660, 330, 'SIGNAL → BRAIN', '#FFD23F', 42) },
  // 1 close to a hundred million light-catching cells
  { t: 11.4, ref: GC, cam: push(11.4, 17.2, { x: 960, y: 560, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, retinaMosaic(t, 160, 230, 1600, 700)) + chipAt(t, 11.7, 960, 110, 'ONE RETINA', '#E8463C', 56) + chipAt(t, 12.6, 960, 990, '≈ 100 MILLION LIGHT-CATCHING CELLS', '#FFD23F', 50) },
  // 2 invisible: light goes straight through. No signal.
  { t: 17.2, ref: GC, cam: push(17.2, 29.95, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 980, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const see = E.io(seg(t, 18.2, 19.4)), rk = t < 19.4 ? 1 : seg(t, 19.6, 21.6);
      let s = L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, eyeDiagram(t, 900, 560, 250, { see, rays: rk, signal: 0 }));
      if (t > 23.6) { let st = ''; for (let i = 0; i < 60; i++) st += `<rect x="${1560 + hash(i + Math.floor(t*20))*260}" y="${220 + hash(i*3 + Math.floor(t*20))*170}" width="${8 + 14*hash(i*5)}" height="5" fill="#fff" opacity=".8"/>`;
        s += `<rect x="1540" y="200" width="300" height="210" rx="16" fill="#333" stroke="${INK}" stroke-width="7"/>${st}<g transform="translate(1690,330)">${txt('NO SIGNAL', 0, 0, 40, '#E8463C')}</g>`; }
      return s + chipAt(t, 17.4, 960, 110, 'INVISIBLE EYE', '#9AA2C8', 56) + chipAt(t, 20.6, 1250, 860, 'STRAIGHT THROUGH', '#FFD23F', 44) + chipAt(t, 24.9, 960, 990, 'NOTHING ABSORBED', '#E8463C', 48) +
        (t > 26.8 ? `<g transform="translate(470,250) rotate(-8) scale(${pop(t, 26.8, .25)})"><rect x="-300" y="-80" width="600" height="160" rx="22" fill="none" stroke="#E8463C" stroke-width="14"/>${txt('BLIND EYE', 0, 34, 100, '#E8463C')}</g>` : ''); } },
  // 3 Yakov Perelman, 1913
  { t: 29.95, ref: RR, cam: push(29.95, 39.2, { x: 0, y: GY - 420, z: 1.15, r: 0 }, { x: 40, y: GY - 420, z: 1.28, r: 2 }, 'lin'), draw: (t, c, L) => {
      const desk = `<rect x="-1400" y="${GY - 260}" width="2800" height="60" fill="#8A5A3B" stroke="${INK}" stroke-width="7"/><rect x="-1400" y="${GY - 200}" width="2800" height="400" fill="#6B4430"/>`;
      const fl = 1 + .1*Math.sin(t*13);
      const candle = `<g transform="translate(-760,${GY - 260})"><rect x="-24" y="-180" width="48" height="180" fill="#FFF6D0" stroke="${INK}" stroke-width="5"/><path d="M0,${-180 - 70*fl} Q24,-210 0,-182 Q-24,-210 0,${-180 - 70*fl} Z" fill="#FFB347" stroke="${INK}" stroke-width="3"/><circle cy="-230" r="200" fill="url(#lampG)"/></g>`;
      return L(0, `<rect x="-6000" y="-3000" width="12000" height="6000" fill="#3A2A2A"/>` + [...Array(6)].map((_, i) => `<rect x="${-1500 + i*520}" y="${GY - 1000}" width="440" height="600" fill="#4A3434" stroke="#2A1C1C" stroke-width="6"/>`).join('')) +
        L(1, desk + candle + oldBook(-180, GY - 470, .8, 'PHYSICS', 'CAN BE FUN', '#7A4A3A', -6) + `<g transform="translate(-180,${GY - 300})">${txt('1913', 0, 0, 52, '#F2DFAE')}</g>` + oldBook(420, GY - 460, .72, 'AN OLD', 'STORY', '#3A4A6A', 5) +
          (t > 34.2 ? `<g transform="translate(420,${GY - 170}) scale(${pop(t, 34.2, .3)})">${chip('AN INVISIBLE MAN…', 0, 0, '#1F2033', 40)}</g>` : '')) +
        chipAt(t, 30.3, 960, 120, 'YAKOV PERELMAN · 1913', '#B07A4A', 54) + chipAt(t, 35.8, 960, 980, 'SPOTTED THE PROBLEM: HE’D BE BLIND', '#E8463C', 44); } },
  // 4 the story's invisible cat: two visible spots where its eyes should be
  { t: 39.2, ref: GC, cam: push(39.2, 49.2, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.12, r: -2 }, 'lin'), draw: (t, c, L) => {
      const cat = `<g transform="translate(960,600)" opacity=".5"><path d="M-160,100 Q-180,-40 -60,-60 L-80,-150 L-20,-90 Q20,-100 60,-90 L120,-150 L100,-60 Q200,-30 170,100 Q120,180 0,180 Q-120,180 -160,100 Z" fill="none" stroke="#7A5A3A" stroke-width="6" stroke-dasharray="16 14"/><path d="M170,100 Q300,80 280,-60" fill="none" stroke="#7A5A3A" stroke-width="6" stroke-dasharray="16 14"/></g>`;
      const eyes = [-1, 1].map(sx => `<g transform="translate(${960 + sx*60},${560 + Math.sin(t*2)*4})"><ellipse rx="34" ry="26" fill="#E8F06A" stroke="#5A3A2A" stroke-width="5"/><ellipse rx="8" ry="22" fill="#2A1C1C"/></g>`).join('');
      return L(0, `<rect x="-200" y="-200" width="2400" height="1500" fill="#2A1C1C"/>`) + L(1, `<rect x="260" y="120" width="1400" height="860" rx="16" fill="#F2DFAE" stroke="#5A3A2A" stroke-width="10"/><rect x="290" y="150" width="1340" height="800" rx="10" fill="none" stroke="#C9A86A" stroke-width="4"/>` + (t > 41.0 ? cat : '') + (t > 40.4 ? eyes : '') +
        [0,1,2,3,4,5].map(i => `<path d="M360,${220 + i*26} L${560 - (i%3)*30},${220 + i*26} M1360,${780 + i*26} L${1560 - (i%2)*40},${780 + i*26}" stroke="#B49464" stroke-width="7" stroke-linecap="round"/>`).join('')) +
        chipAt(t, 39.5, 960, 70, 'FROM THE STORY ITSELF', '#B07A4A', 48) + chipAt(t, 44.5, 960, 1020, 'AN INVISIBLE CAT… WITH VISIBLE EYES', '#E8463C', 44) + `<rect width="1920" height="1080" fill="#5A3A00" opacity=".08"/>`; } },
  // 5 the power leaves his eyes working: the mirror shows two floating eyeballs
  { t: 49.2, ref: RR, cam: hold(49.2, { x: 0, y: 540, z: 1 }), draw: (t, c, L) => {
      const cm = { x: 100, y: GY - 380, z: 1.22 }, Lm = (p, svg, f='') => `<g transform="${layerTR(cm, p, RR)}"${f ? ` filter="url(#${f})"` : ''}>${svg}</g>`;
      const K = [[0, { eyes: 'squeeze' }], [49.9, { eyes: 'open', look: [-8, 0] }, 'o'], [51.0, { eyes: 'open', look: [8, -2] }, 'o'], [52.2, { eyes: 'wide', look: [0, 0] }, 'snap'], [54.6, { eyes: 'happy' }, 'o'], [55.4, { eyes: 'wide', look: [0, 2] }, 'o']];
      const ex = 860, room = `<g transform="translate(1920,0) scale(-1,1)">${bedroom(t, Lm, cm, 'b2') + Lm(1, cover(t, 1))}</g>`;
      const ey = chibi4(dexAt(K, t, () => ({ x: ex, y: 1080 }), { s: 2.1, seed: 4, inv: true, breath: Math.sin(t*1.8) }));
      let s = mirrorPOV(t, room + slippers(t, ex, 1060, 2.4, false) + ey);
      const lift = 1 - seg(t, 49.2, 49.9); if (lift > 0) s += `<rect width="1920" height="1080" fill="#000" opacity="${lift}"/>`;
      return s + chipAt(t, 50.4, 960, 120, 'EYES: STILL WORKING', '#7ED957', 52) + (t > 54.0 ? chipAt(t, 54.0, 960, 960, 'THE ONLY PART YOU CAN SEE', '#E8463C', 48) : ''); } },
  // 6 Mum walks in... drops the laundry
  { t: 56.7, ref: RR, cam: push(56.7, 61.35, { x: 420, y: GY - 380, z: 1.12, r: 0 }, { x: 460, y: GY - 380, z: 1.16, r: -2 }, 'lin'), draw: (t, c, L) => {
      const SEE = 58.6, mx = lerp(-1100, -150, E.o(seg(t, 56.8, 58.0)));
      const mK = [[0, { ...POSES.idle, armF: [80, -40], armB: [-80, 40], eyes: 'happy', mouth: 'smile' }], [SEE, { ...POSES.surprise, eyes: 'shock', mouth: 'wail', armF: [130, 40], armB: [-130, -40], brow: 16 }, 'snap']];
      const sp = seg(t, SEE + .05, SEE + .9);
      const eK = [[0, { eyes: 'open', look: [-9, 0] }], [SEE - .2, { eyes: 'wide', look: [-9, 0] }, 'snap'], [60.0, { eyes: 'happy' }, 'o'], [60.6, { eyes: 'open', look: [-6, 2], blink: 0 }, 'o']];
      return bedSet(t, L, c) + L(1, cover(t, 1) + who(MUM, mK, t, mx, GY) + laundry(mx + 40, GY - 140 + sp*130, 1, sp, t) + slippers(t, MX - 160, GY - 70, 1.1, false) + dexI(eK, t, MX - 160, GY - 6)) +
        bang(t, SEE + .1, 560, 300, 'AAAAH!', '#E8463C', 110, -6) + (t > 59.6 ? `<g transform="translate(1300,330)">${txt('…morning, Mum.', 0, 0, 46, '#fff')}</g>` : ''); } },
  // 7 two floating eyeballs: not ideal for sneaking
  { t: 61.35, ref: RR, cam: push(61.35, 65.2, { x: MX - 160, y: EYEH, z: 3.2, r: 0 }, { x: MX - 160, y: EYEH, z: 3.6, r: 3 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { eyes: 'open', look: [-9, 0] }], [62.3, { eyes: 'open', look: [9, 0] }, 'o'], [63.3, { eyes: 'squeeze' }, 'snap'], [63.9, { eyes: 'open', look: [0, 3] }, 'o']];
      return bedSet(t, L, c, 'b14') + L(1, dexI(K, t, MX - 160, GY - 6)) + chipAt(t, 62.6, 960, 960, 'SNEAKING: ✗', '#E8463C', 60); } },
  // 8 RULE 1
  { t: 65.2, ref: RR, cam: push(65.2, END, { x: 600, y: GY - 380, z: 1.3, r: 0 }, { x: 640, y: GY - 380, z: 1.38, r: 0 }, 'lin'), draw: (t, c, L) =>
      bedSet(t, L, c, 'b2') + L(1, slippers(t, MX - 160, GY - 70, 1.1, false) + dexI([[0, { eyes: 'happy' }], [66.4, { eyes: 'open', look: [-8, -2] }, 'o']], t, MX - 160, GY - 6)) + note(t, 65.25, 640, 420, 'RULE 1', 'YOUR EYES', 'GIVE YOU AWAY.') },
];
const SHAKES_S1 = [[26.8, 8, .3], [58.65, 14, .4]];
function scene(t) { let s = EP3DEFS + EP4DEFS + playShots(t, SHOTS_S1, SHAKES_S1) + vignette(); [29.95, 49.2, 65.2].forEach(w => s += wipe(t, w)); return s; }
