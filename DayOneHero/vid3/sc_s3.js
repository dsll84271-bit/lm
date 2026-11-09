// RIG2
// Ep3 s3: Everest. Rule 3, check you can breathe first. END 65.36   ST=[3.0, 13.56, 19.58, 27.71, 40.34, 48.59, 61.75]
const MUM3 = (t, keys, x, y) => chibi2({ ...dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 31 }), ...PEOPLE[3] });
const SUM = GY - 150;                    // summit surface
const AR = 10.05;                        // arrives on the summit
const shiv = (t, a=4) => Math.sin(t*55)*a;
const cold = (o, t) => ({ ...o, x: o.x + shiv(t, 3) });
function dexSum(keys, t, x, extra={}) { const o = dexAt(keys, t, () => ({ x: x + shiv(t, 2.5), y: SUM }), { s: DS, seed: 5, ...extra }); return chibi2(o); }
const SHOTS_S3 = [
  // 0 the kitchen is still loud: Dex wants quiet
  { t: 0, ref: RR, cam: push(0, 3.0, { x: -100, y: GY - 360, z: 1.3, r: 0 }, { x: -60, y: GY - 360, z: 1.4, r: 2 }, 'lin'), draw: (t, c, L) => {
      const mumK = [[0, { ...POSES.point, armF: [100, -30], eyes: 'determined', mouth: 'wail', brow: 10, browA: 18 }]];
      const words = t > .2 ? `<g transform="translate(-560,${GY - 560}) scale(${pop(t, .2, .3)})"><path d="M-170,-70 Q-180,-130 -100,-130 L120,-130 Q190,-130 180,-70 L180,10 Q180,60 120,60 L-40,60 L-90,110 L-80,60 L-110,60 Q-180,60 -170,10 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${txt('DEX!!', 0, -10, 80, '#E8463C')}</g>` : '';
      return kitchen(t, L) + L(1, MUM3(t, mumK, -560, GY - 40) + tpWrap(t, dex([[0, { ...POSES.flinch, armF: [150, 40], armB: [-150, -40], handF: 'fist', handB: 'fist' }], [2.3, 'crouchPop', 'snap']], t, 250, GY - 40), 250, GY - 190, -1e9, 2.65) + popFX(t, 2.65, 250, GY - 190, 1, 'out') + dog(900, GY - 40, .9, t, { alarm: true }) + words) +
        bang(t, .9, 1450, 380, 'WOOF!', '#8A5A3B', 80, 8, 2.6); } },
  // 1 somewhere quiet, with a view
  { t: 3.0, ref: RR, cam: push(3.0, 6.4, { x: 200, y: GY - 300, z: 1.75, r: 0 }, { x: 200, y: GY - 300, z: 1.85, r: 2 }, 'lin'), draw: (t, c, L) => {
      const K = [[3.0, { ...POSES.think, eyes: 'closed', mouth: 'smile' }], [4.9, { ...POSES.think, eyes: 'happy', mouth: 'grin' }, 'o']];
      const mtn = `<rect x="-260" y="-200" width="520" height="400" fill="#4E86D8"/><path d="M-220,140 L-60,-90 L0,-140 L60,-80 L230,140 Z" fill="#9FB6E6" stroke="${INK}" stroke-width="6"/><path d="M-60,-90 L0,-140 L60,-80 L20,-70 L0,-90 L-20,-66 Z" fill="#fff"/>`;
      return L(0, `<rect x="-3000" y="-3000" width="6000" height="6000" fill="#BFE6FF"/>` + [...Array(8)].map((_, i) => cloud(-1400 + i*420 + (t*30 % 300), 200 + (i % 3)*140, 1.2)).join('')) + L(1, dex(K, t, -100, GY, { air: true, noShadow: true }) + `<g transform="translate(-100,${GY + 40})"><ellipse rx="300" ry="60" fill="#fff" stroke="${INK}" stroke-width="5" opacity=".9"/></g>`) +
        thought(1350, 380, 1.0, mtn, t, 3.3) + chipAt(t, 3.2, 600, 150, 'QUIET ✓', '#7ED957', 52) + chipAt(t, 5.0, 600, 250, 'A VIEW ✓', '#7ED957', 52); } },
  // 2 the highest place on Earth: globe -> Everest
  { t: 6.4, ref: GC, cam: push(6.4, 10.0, { x: 960, y: 560, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = E.io(seg(t, 6.5, 8.3)), lon0 = lerp(0, EVX[0], k), lat0 = lerp(51, 28, k), p = gxy(EVX, 960, 600, 420, lon0, lat0);
      return L(0, space(t)) + L(1, globe(960, 600, 420, lon0, lat0) + (t > 8.4 ? pin(p[0], p[1], 1, '#E8463C', '', 1) + `<g transform="translate(${p[0]},${p[1] - 150}) scale(${pop(t, 8.4, .3)})">${chip('MOUNT EVEREST', 0, 0, '#E8463C', 50)}</g>` : '') + popFX(t, 9.75, p[0], p[1] - 50, .5, 'out')) +
        chipAt(t, 6.6, 960, 100, 'THE HIGHEST PLACE ON EARTH', '#5CF2FF', 56); } },
  // 3 POP: the summit. 8,849 m
  { t: 10.0, ref: RR, cam: push(10.0, 13.56, { x: 0, y: GY - 360, z: 1.12, r: -2 }, { x: 0, y: GY - 340, z: 1.25, r: 0 }, 'o'), draw: (t, c, L) => {
      const K = [[AR, 'landSquash'], [AR + .2, { ...POSES.cheer, mouth: 'laugh' }, 'o2'], [11.6, { ...POSES.peace }, 'o']];
      const m = Math.round(8849*E.io(seg(t, 10.3, 12.4)));
      return everestW(t, L) + L(1, tpWrap(t, dexSum(K, t, 0), 0, SUM - 150, AR) + popFX(t, AR, 0, SUM - 150, 1.1) + dust(0, SUM, t, AR + .05, 8, 1, '#FFFFFF')) +
        (t > 10.3 ? `<g transform="translate(1500,200) scale(${pop(t, 10.3, .3)})">${chip(m.toLocaleString('en-GB') + ' M', 0, 0, '#3D8BFF', 72)}</g>` : '') + chipAt(t, 10.4, 420, 200, 'SUMMIT OF EVEREST', '#1F2033', 46); } },
  // 4 the death zone
  { t: 13.56, ref: GC, cam: push(13.56, 19.55, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 500, z: 1.08, r: 0 }, 'lin'), draw: (t, c, L) => {
      const M = mountainSection(t, 960, 1000, 760, 760, E.io(seg(t, 17.1, 17.6)));
      return L(0, `<rect x="-3000" y="-3000" width="6000" height="6000" fill="url(#snowSky)"/>`) + L(1, M.s + `<g transform="translate(960,${M.top - 10}) scale(.28)">${chibi2({ ...DEX2, ...mixPose(POSES.peace, POSES.peace, 1), x: 0, y: 0, s: 1, t })}</g>` +
        (t > 14.0 ? `<g transform="translate(1720,${M.z - 20})">${txt('8,000 M', 0, 0, 52, '#fff', 'end')}</g>` : '') + `<g transform="translate(960,1060)">${txt('SEA LEVEL', 0, 0, 40, '#fff')}</g><g transform="translate(1180,${M.top + 10})">${txt('8,849 M', 0, 0, 44, '#fff', 'start')}</g>`) + (t > 17.13 ? `<g transform="translate(1440,${M.z + 200}) rotate(-8) scale(${pop(t, 17.13, .25)})"><rect x="-270" y="-80" width="540" height="160" rx="22" fill="none" stroke="#E8463C" stroke-width="14"/>${txt('DEATH ZONE', 0, 34, 92, '#E8463C')}</g>` : '') +
        chipAt(t, 13.7, 960, 100, 'WHAT CLIMBERS CALL IT', '#1F2033', 48); } },
  // 5 temperature: summer ~ -19, January ~ -36
  { t: 19.55, ref: RR, cam: push(19.55, 27.7, { x: -150, y: GY - 330, z: 1.4, r: 0 }, { x: -170, y: GY - 330, z: 1.55, r: 2 }, 'lin'), draw: (t, c, L) => {
      const v = t < 23.3 ? lerp(10, -19, E.io(seg(t, 20.6, 22.4))) : lerp(-19, -36, E.io(seg(t, 24.3, 26.0)));
      const K = [[0, { ...POSES.worried, eyes: 'squeeze', mouth: 'grit' }], [23.4, { ...POSES.flinch, eyes: 'wide', mouth: 'wobble' }, 'o']];
      return everestW(t, L, 'b4') + L(1, dexSum(K, t, -300) + frost(-300, SUM - 250*DS, DS, seg(t, 21, 26)) + breath(-240, SUM - 205*DS, t)) +
        `<g transform="translate(1450,${560})">${thermo(0, 0, 1, v)}</g>` + chipAt(t, 20.7, 1450, 120, 'SUMMER ≈ −19 °C', '#3D8BFF', 54, 23.3) + chipAt(t, 24.4, 1450, 120, 'JANUARY ≈ −36 °C', '#1F3D8F', 54) + (t > 24.6 ? `<g transform="translate(1450,210)">${txt('(AVERAGE)', 0, 0, 34, '#fff')}</g>` : ''); } },
  // 6 the real problem: air pressure ~ one third
  { t: 27.7, ref: GC, cam: push(27.7, 34.8, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      if (t < 30.2) return everestW(t, L, 'b8') + L(1, `<g transform="translate(0,0)">${dexSum([[0, { ...POSES.shrug, mouth: 'grit' }]], t, 0)}</g>`) + chipAt(t, 27.9, 960, 120, 'NOT THE REAL PROBLEM', '#E8463C', 56);
      const box = (x, n, lab, col) => { let s = `<rect x="${x - 300}" y="260" width="600" height="600" rx="30" fill="#0B1E4A" stroke="${INK}" stroke-width="8"/>`;
        for (let i = 0; i < n; i++) s += `<circle cx="${x - 270 + hash(i*2.3 + x)*540 + Math.sin(t*3 + i)*6}" cy="${290 + hash(i*4.1 + x)*540 + Math.cos(t*2.7 + i)*6}" r="11" fill="#BFE6FF" stroke="#3D8BFF" stroke-width="3"/>`;
        return s + `<g transform="translate(${x},940)">${chip(lab, 0, 0, col, 46)}</g>`; };
      const k = seg(t, 30.3, 31.0);
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, box(520, Math.round(150*k), 'SEA LEVEL', '#7ED957') + box(1400, Math.round(50*k), 'EVEREST SUMMIT', '#E8463C')) + chipAt(t, 31.2, 960, 120, 'AIR PRESSURE ≈ ⅓', '#5CF2FF', 62); } },
  // 7 every breath gives about a third of the oxygen
  { t: 34.8, ref: RR, cam: push(34.8, 40.34, { x: 0, y: GY - 300, z: 1.7, r: 0 }, { x: 0, y: GY - 300, z: 1.9, r: 0 }, 'lin'), draw: (t, c, L) => {
      const ph = ((t - 34.8) % 1.8)/1.8, inh = Math.sin(Math.min(1, ph/.5)*Math.PI/2)*(ph < .5 ? 1 : 1 - (ph - .5)/.5);
      const K = [[0, { ...POSES.idle, eyes: 'closed', mouth: 'o', sq: 1 }]];
      const o = dexAt(K, t, () => ({ x: shiv(t, 2), y: SUM }), { s: DS }); o.sq = 1 + .05*inh;
      let bub = ''; const n = t > 36.9 ? 1 : 3; for (let i = 0; i < n; i++) { const kk = (ph + i*.15) % 1; if (kk < .5) bub += oxyBubble(lerp(420 - i*60, 40, kk*2), lerp(SUM - 300 - i*50, SUM - 210*DS, kk*2), 32, 1 - kk); }
      return everestW(t, L, 'b8') + L(1, chibi2(o) + bub) + chipAt(t, 35.0, 960, 120, 'EACH BREATH', '#5CF2FF', 56) +
        (t > 35.5 ? `<g transform="translate(1520,420)">${[0,1,2].map(i => oxyBubble(-90 + i*90, 0, 38, i === 0 || t < 36.9 ? 1 : .18)).join('')}${txt(t < 36.9 ? 'SEA LEVEL' : 'EVEREST', 0, 110, 46, '#fff')}</g>` : '') + chipAt(t, 37.0, 1520, 700, '≈ ⅓ THE OXYGEN', '#E8463C', 52); } },
  // 8 climbers: weeks to adjust, bottled oxygen; Dex had one second
  { t: 40.34, ref: RR, cam: push(40.34, 45.6, { x: -200, y: GY - 360, z: 1.15, r: -3 }, { x: -120, y: GY - 360, z: 1.22, r: -2 }, 'lin'), draw: (t, c, L) => {
      let cl = ''; [[-900, 0], [-520, 1], [-140, 2]].forEach(([x, i]) => cl += climber(t, x + Math.sin(t*2 + i)*6, SUM + 60 - (x + 900)*.05, i));
      return everestW(t, L, '', { flags: false }) + L(1, cl) + chipAt(t, 40.5, 960, 120, 'WEEKS TO ADJUST', '#3D8BFF', 56) + chipAt(t, 43.2, 960, 220, 'MOST STILL USE BOTTLED OXYGEN', '#FF8A3D', 48) +
        (t > 41.0 ? `<g transform="translate(1520,520) scale(${pop(t, 41.0, .3)})">${[0,1,2,3].map(i => `<g transform="translate(${(i % 2)*130 - 65},${Math.floor(i/2)*130 - 65})"><rect x="-55" y="-55" width="110" height="110" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-55" y="-55" width="110" height="30" rx="10" fill="#E8463C"/>${txt('WK ' + (i + 1), 0, 30, 34, INK)}</g>`).join('')}</g>` : ''); } },
  { t: 45.6, ref: RR, cam: push(45.6, 48.59, { x: 120, y: GY - 300, z: 1.6, r: 2 }, { x: 120, y: GY - 300, z: 1.75, r: 4 }, 'lin'), draw: (t, c, L) => {
      return everestW(t, L, 'b4') + L(1, dexSum([[0, { ...POSES.peace, eyes: 'happy' }]], t, -150)) + `<g transform="translate(1400,480) scale(${pop(t, 45.7, .3)})">${stopwatch(0, 0, 1.3, 1)}</g>` + chipAt(t, 46.2, 1400, 140, 'DEX: ≈ 1 SECOND', '#E8463C', 56); } },
  // 9 a minute or two before you can't think clearly
  { t: 48.59, ref: RR, cam: push(48.59, 54.0, { x: -100, y: GY - 320, z: 1.5, r: 0 }, { x: -100, y: GY - 320, z: 1.62, r: 0 }, 'lin'), draw: (t, c, L) => {
      const secs = lerp(0, 120, seg(t, 49.5, 53.5));
      return everestW(t, L, 'b8') + L(1, dexSum([[0, { ...POSES.smile }], [50.5, { ...POSES.idleB, eyes: 'open', mouth: 'smile' }, 'o']], t, -380)) + `<g transform="translate(1340,520)">${stopwatch(0, 0, 1.5, secs, '#3D8BFF')}</g>` +
        chipAt(t, 49.0, 1340, 140, 'TIME TO THINK CLEARLY:', '#1F2033', 44) + chipAt(t, 50.2, 1340, 230, '≈ 1–2 MINUTES (EST.)', '#3D8BFF', 52) + chipAt(t, 51.5, 1340, 940, 'IF YOU AREN’T USED TO IT', '#7C86A6', 40); } },
  // 10 you just feel... fine
  { t: 54.0, ref: RR, cam: push(54.0, 57.55, { x: 0, y: GY - 300, z: 1.9, r: 0 }, { x: 0, y: GY - 290, z: 2.3, r: -6 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.knuckle, eyes: 'happy', mouth: 'grin', tilt: -8 }], [55.6, { ...POSES.knuckle, eyes: 'happy', mouth: 'laugh', tilt: 10, lean: 4 }, 'o'], [56.7, { ...POSES.peace, eyes: 'happy', tilt: -12, lean: -4 }, 'o']];
      const wob = Math.sin(t*2.5)*6*seg(t, 55, 57.5);
      return `<g transform="rotate(${wob},960,540)">${everestW(t, L, 'b14') + L(1, dexSum(K, t, 0))}</g>` + `<rect width="1920" height="1080" fill="url(#vig)" opacity="${seg(t, 54, 57.5)}"/>` + bang(t, 56.7, 1450, 360, 'I’M FINE!', '#fff', 90, 6); } },
  // 11 then you don't: the world tilts, he pops home just in time
  { t: 57.55, ref: RR, cam: push(57.55, 58.75, { x: 0, y: GY - 300, z: 2.3, r: -6 }, { x: 0, y: GY - 300, z: 2.6, r: -14 }, 'in'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.dizzy }], [58.0, { ...POSES.worried, eyes: 'swirl', mouth: 'wobble' }, 'snap'], [58.4, 'crouchPop', 'snap']];
      let s = `<g filter="url(#b4)">${everestW(t, L) }</g>` + L(1, tpWrap(t, dexSum(K, t, 0), 0, SUM - 150, -1e9, 58.6) + popFX(t, 58.6, 0, SUM - 150, 1, 'out'));
      return s + `<rect width="1920" height="1080" fill="#000" opacity="${.5*seg(t, 57.6, 58.5)}"/>` + chipAt(t, 57.7, 960, 160, '…THEN YOU DON’T.', '#E8463C', 60); } },
  { t: 58.75, ref: RR, cam: push(58.75, 61.75, { x: -250, y: GY - 330, z: 1.6, r: 3 }, { x: -260, y: GY - 330, z: 1.7, r: 1 }, 'lin'), draw: (t, c, L) => {
      const A = 58.85, ph = Math.sin(t*9);
      const K = [[A, 'landSquash'], [A + .2, { ...POSES.worried, eyes: 'squeeze', mouth: 'wail', sq: 1 + .04*ph }, 'o2']];
      return bedroom(t, L, c, 'b4') + L(1, tpWrap(t, dex(K, t, -250, GY - 140 + 140), -250, GY - 150, A) + popFX(t, A, -250, GY - 150, 1)) + bang(t, A + .4, 1400, 360, 'HAAAH', '#5CF2FF', 100, -6) + chipAt(t, A + .2, 960, 120, 'BACK HOME. BREATHING.', '#7ED957', 52); } },
  // 12 RULE 3
  { t: 61.75, ref: RR, cam: push(61.75, END, { x: -150, y: GY - 360, z: 1.3, r: 0 }, { x: -130, y: GY - 360, z: 1.38, r: 0 }, 'lin'), draw: (t, c, L) =>
      bedroom(t, L, c, 'b2') + L(1, dex([[0, { ...POSES.idleB, eyes: 'closed', mouth: 'o' }], [62.2, { ...POSES.knuckle, eyes: 'happy' }, 'o']], t, -400, GY)) + note(t, 61.8, 1340, 420, 'RULE 3', 'CHECK YOU CAN', 'BREATHE FIRST.') },
];
const SHAKES_S3 = [[AR, 14, .4], [17.13, 10, .3], [2.65, 8, .3], [58.0, 8, .6]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_S3, SHAKES_S3) + vignette(); [3.0, 27.7, 40.34, 61.75].forEach(w => s += wipe(t, w)); return s; }
