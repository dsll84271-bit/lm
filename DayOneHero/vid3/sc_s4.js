// RIG2
// Ep3 s4: Space. Rule 4, space is a ten-second trip, max. END 69.91   ST=[0.6, 7.81, 19.12, 32.91, 50.47, 59.11, 65.17]
const SP = { x: 960, y: 540, z: 1 };
const floatY = t => 430 + Math.sin(t*1.3)*14;
function dexSpace(keys, t, x=960, extra={}) { return chibi2(dexAt(keys, t, () => ({ x, y: floatY(t) + 200 }), { s: DS, seed: 6, air: true, rot: Math.sin(t*.7)*6, ...extra })); }
function spaceBg(t, L, o={}) { return L(0, space(t, 160, 3)) + L(.2, earthLimb(t, o.lon ?? -10, o.lat ?? 40, 2600, o.cy ?? 3420)); }
const SHOTS_S4 = [
  // 0 an obviously terrible idea... SPACE.
  { t: 0, ref: RR, cam: push(0, 3.35, { x: -200, y: GY - 330, z: 1.55, r: 0 }, { x: -220, y: GY - 340, z: 1.7, r: 2 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.idleB, look: [-4, -8], tilt: -6 }], [1.0, { ...POSES.think, look: [-4, -10] }, 'o'], [2.2, { ...POSES.surprise, eyes: 'happy', mouth: 'laugh', look: [0, -8] }, 'snap']];
      return bedroom(t, L, c, 'b4') + L(1, dex(K, t, -300, GY)) + (t > 2.2 ? `<g transform="translate(1350,330) scale(${pop(t, 2.2, .3)})"><circle r="80" fill="#FFE07A" stroke="${INK}" stroke-width="8"/><rect x="-36" y="70" width="72" height="50" rx="8" fill="#C9D0EE" stroke="${INK}" stroke-width="6"/>${[0,1,2,3,4,5].map(i => `<path d="M${Math.cos(i*1.05)*100},${Math.sin(i*1.05)*100} L${Math.cos(i*1.05)*140},${Math.sin(i*1.05)*140}" stroke="#FFE07A" stroke-width="10" stroke-linecap="round"/>`).join('')}</g>` : '') +
        chipAt(t, 1.5, 960, 940, 'OBVIOUSLY TERRIBLE IDEA', '#E8463C', 52); } },
  { t: 3.35, ref: SP, cam: push(3.35, 7.81, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.1, r: -3 }, 'o'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.cheer, mouth: 'laugh' }], [5.4, { ...POSES.ready }, 'o'], [6.6, 'crouchPop', 'snap']];
      return L(0, space(t, 200, 9)) + L(1, `<g transform="translate(0,0)">${tpWrap(t, chibi2(dexAt(K, t, () => ({ x: 960, y: 1000 }), { s: DS })), 960, 850, -1e9, 7.25)}</g>` + popFX(t, 7.25, 960, 850, 1, 'out')) + title(t, 3.4, 960, 330, 'SPACE.', '#FFFFFF', 240) + flash(t, 3.4, '#fff', .3, .6) + (t > 5.4 ? `<g transform="translate(1500,700)">${txt(['3', '2', '1'][Math.min(2, Math.floor((t - 5.4)/.6))], 0, 0, 160, '#FFD23F')}</g>` : ''); } },
  // 1 altitude ladder: 100 km (space starts) -> 400 km (space station)
  { t: 7.81, ref: SP, cam: t => { const k = E.io(seg(t, 8.0, 17.0)); return { x: 960, y: lerp(940, 940 - 400*2.2, k), z: 1, r: 0 }; }, draw: (t, c, L) => {
      const y0 = 1060, kpx = 2.2, a = t - 7.81, dy = lerp(y0 - 180, y0 - 400*kpx + 40, E.io(seg(t, 8.0, 17.0)));
      const sky = `<rect x="-3000" y="${y0 - 400*kpx - 2000}" width="6000" height="${2000 + 400*kpx}" fill="#0A0D26"/><rect x="-3000" y="${y0 - 120*kpx}" width="6000" height="${120*kpx + 40}" fill="url(#sky2)" opacity=".85"/><rect x="-3000" y="${y0}" width="6000" height="600" fill="#5CC46A" stroke="${INK}" stroke-width="7"/>`;
      let st = ''; for (let i = 0; i < 90; i++) { const yy = y0 - 120*kpx - hash(i*3)*(300*kpx + 600); st += `<circle cx="${hash(i)*2400 - 240}" cy="${yy}" r="${2 + 3*hash(i*7)}" fill="#fff" opacity=".8"/>`; }
      const ladder = altScale(t, 330, y0, kpx, [[8.8, 'EVEREST 8.8 KM', '#BFE6FF'], [100, 'SPACE STARTS ≈ 100 KM', '#5CF2FF'], [400, 'SPACE STATION ≈ 400 KM', '#FFD23F']]);
      return L(1, sky + st + ladder + station(1500, y0 - 400*kpx, .35) + `<g transform="translate(1180,${dy}) scale(.42)">${chibi2({ ...DEX2, ...mixPose(POSES.cheer, POSES.cheer, 1), x: 0, y: 300, s: 1, t, air: true })}</g>`) +
        (t > 9.4 ? chipAt(t, 9.4, 960, 980, 'THE MOST COMMON DEFINITION', '#1F2033', 40, 12.3) : '') + (t > 12.4 ? chipAt(t, 12.4, 960, 980, 'DEX GOES HIGHER', '#E8463C', 50) : ''); } },
  // 2 POP: 400 km up, Earth below, no air
  { t: 17.5, ref: SP, cam: push(17.5, 24.2, { x: 960, y: 560, z: 1.05, r: -4 }, { x: 960, y: 560, z: 1.2, r: -2 }, 'lin'), draw: (t, c, L) => {
      const A = 17.65, myth = t > 21.0 && t < 23.4, mk = seg(t, 21.0, 21.8);
      const K = [[A, 'landSquash'], [A + .2, { ...POSES.surprise, eyes: 'wide', mouth: 'flat' }, 'o2'], [19.2, { ...POSES.gulp }, 'o']];
      let dx = dexSpace(K, t);
      if (myth) dx = `<g transform="translate(960,${floatY(t)}) scale(${1 + .45*E.o(mk)}) translate(-960,${-floatY(t)})">${dexSpace([[0, { ...POSES.surprise, eyes: 'shock', mouth: 'wail', sq: 1.15 }]], t)}</g>`;
      return spaceBg(t, L) + L(1, tpWrap(t, dx, 960, floatY(t) + 40, A) + popFX(t, A, 960, floatY(t) + 40, 1)) + chipAt(t, 19.2, 960, 120, 'AIR: NONE', '#5CF2FF', 60, 21.0) +
        (t > 23.4 ? `<g transform="translate(1460,330) rotate(-10) scale(${pop(t, 23.4, .25)})"><rect x="-200" y="-80" width="400" height="160" rx="22" fill="none" stroke="#E8463C" stroke-width="14"/>${txt('MYTH', 0, 34, 110, '#E8463C')}</g>` : '') + (myth ? chipAt(t, 21.0, 960, 120, 'DO YOU EXPLODE?', '#FFD23F', 56) : ''); } },
  // 3 lungs empty, no oxygen pick-up, black out after 10-15 s
  { t: 24.2, ref: SP, cam: push(24.2, 32.85, { x: 700, y: 560, z: 1.1, r: 0 }, { x: 720, y: 560, z: 1.16, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.gulp }], [24.6, { ...POSES.surprise, eyes: 'wide', mouth: 'o' }, 'o']];
      let puff = ''; if (t > 24.6 && t < 26.0) { const k = seg(t, 24.6, 26.0); for (let i = 0; i < 6; i++) puff += `<circle cx="${560 + 60 + k*260 + i*24}" cy="${floatY(t) - 20 - i*8*k}" r="${10 + 30*k}" fill="#fff" opacity="${.7*(1 - k)}"/>`; }
      let ox = ''; if (t > 26.4) { for (let i = 0; i < 4; i++) ox += oxyBubble(380 + i*90, floatY(t) + 280, 30, Math.max(.12, 1 - seg(t, 26.6 + i*.25, 27.2 + i*.25))); }
      const k = seg(t, 28.0, 31.4), W = 760, X = 1040;
      const timer = t > 27.8 ? `<g transform="translate(${X},780)"><rect x="0" y="-40" width="${W}" height="80" rx="30" fill="#1F2033" stroke="${INK}" stroke-width="6"/><rect x="${W*10/15}" y="-40" width="${W*5/15}" height="80" rx="0" fill="#E8463C" opacity=".85"/><rect x="0" y="-40" width="${W*k}" height="80" rx="30" fill="#fff" opacity=".35"/>
        ${[0, 5, 10, 15].map(s => `<text x="${W*s/15}" y="-56" text-anchor="middle" font-family="Lilita One" font-size="40" fill="#fff">${s}s</text>`).join('')}${txt('BLACK OUT', W*12.5/15, 14, 34, '#fff')}</g>` : '';
      return spaceBg(t, L) + L(1, dexSpace(K, t, 560) + puff + ox) + timer + chipAt(t, 24.6, 1420, 160, 'AIR RUSHES OUT OF YOUR LUNGS', '#5CF2FF', 42) + chipAt(t, 26.6, 1420, 260, 'BLOOD STOPS GETTING O₂', '#7FD3FF', 42) + chipAt(t, 29.0, 1420, 640, '≈ 10–15 SECONDS', '#E8463C', 56); } },
  // 4 the 1960s NASA vacuum-chamber test
  { t: 32.85, ref: RR, cam: push(32.85, 38.4, { x: 0, y: GY - 420, z: 1.0, r: 0 }, { x: 0, y: GY - 400, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) => {
      const leak = t > 36.4;
      const inside = `#1B2A6B`;
      let w = roomW(t, { wall: '#C9CFE2', stripe: '#BCC3DA', floor: '#7C86A6' }) + chamber(0, GY - 140, 1.0, t);
      w += `<g transform="translate(0,${GY - 470})"><circle r="170" fill="none"/>${''}</g>`;
      const man = `<clipPath id="chw"><circle cx="0" cy="${GY - 470}" r="180"/></clipPath><g clip-path="url(#chw)">${suitMan(t, 0, GY - 256, .9, { eyes: leak ? 'wide' : 'open', mouth: leak ? 'o' : 'flat' })}</g>`;
      let hiss = ''; if (leak) for (let i = 0; i < 6; i++) { const k = ((t - 36.4)*2 + i/6) % 1; hiss += `<circle cx="${70 + k*120}" cy="${GY - 400 - k*40}" r="${4 + 10*k}" fill="#fff" opacity="${1 - k}"/>`; }
      return L(1, w + man + hiss) + chipAt(t, 33.2, 960, 110, 'NASA TEST · 1966', '#1F2033', 52) + chipAt(t, 34.6, 960, 980, 'A VACUUM CHAMBER', '#3D8BFF', 48) + bang(t, 36.4, 1350, 380, 'HISSSS', '#fff', 90, 6); } },
  { t: 38.4, ref: GC, cam: push(38.4, 41.4, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, stopwatch(960, 560, 2.2, Math.min(14, lerp(0, 14, seg(t, 38.6, 40.6))), '#E8463C')) + chipAt(t, 39.0, 960, 120, 'CONSCIOUS FOR ≈ 14 SECONDS', '#E8463C', 56) },
  { t: 41.4, ref: RR, cam: push(41.4, 45.8, { x: 0, y: GY - 470, z: 2.4, r: 0 }, { x: 0, y: GY - 470, z: 2.7, r: 2 }, 'lin'), draw: (t, c, L) => {
      let bub = ''; for (let i = 0; i < 10; i++) { const k = ((t - 41.4)*.8 + hash(i)) % 1; bub += `<circle cx="${-20 + hash(i*3)*40 + Math.sin(t*3 + i)*6}" cy="${GY - 440 - k*50}" r="${3 + 5*hash(i*5)}" fill="#fff" stroke="#9FD8FF" stroke-width="2" opacity="${1 - k}"/>`; }
      const man = `<clipPath id="chw2"><circle cx="0" cy="${GY - 470}" r="180"/></clipPath><g clip-path="url(#chw2)">${suitMan(t, 0, GY - 256, .9, { eyes: 'wide', mouth: 'o' })}${bub}</g>`;
      return L(1, roomW(t, { wall: '#C9CFE2', stripe: '#BCC3DA', floor: '#7C86A6' }) + chamber(0, GY - 140, 1.0, t) + man) + chipAt(t, 41.6, 960, 120, 'HIS LAST MEMORY:', '#1F2033', 48) + chipAt(t, 42.6, 960, 960, 'SALIVA STARTING TO BUBBLE', '#5CF2FF', 50); } },
  { t: 45.8, ref: RR, cam: push(45.8, 50.47, { x: 0, y: GY - 420, z: 1.0, r: 0 }, { x: 0, y: GY - 420, z: 1.06, r: 0 }, 'lin'), draw: (t, c, L) => {
      const g = E.io(seg(t, 46.0, 48.0));
      const man = `<clipPath id="chw3"><circle cx="0" cy="${GY - 470}" r="180"/></clipPath><g clip-path="url(#chw3)">${suitMan(t, 0, GY - 256, .9, { eyes: t > 48 ? 'happy' : 'closed', mouth: t > 48 ? 'grin' : 'flat', pose: t > 48.2 ? 'knuckle' : 'idle' })}</g>`;
      let air = ''; if (t > 46.0 && t < 48.6) for (let i = 0; i < 8; i++) { const k = ((t - 46)*1.5 + i/8) % 1; air += `<path d="M${700 - k*200},${GY - 260 - i*12} l-60,0" stroke="#BFE6FF" stroke-width="8" stroke-linecap="round" opacity="${1 - k}"/>`; }
      return L(1, roomW(t, { wall: '#C9CFE2', stripe: '#BCC3DA', floor: '#7C86A6' }) + chamber(0, GY - 140, 1.0, t) + man + air + gauge(-700, GY - 520, 150, g*100, 100, 'AIR', '#3D8BFF')) + chipAt(t, 46.1, 960, 110, 'AIR PUMPED BACK IN', '#3D8BFF', 54) + chipAt(t, 48.3, 960, 980, 'HE CAME ROUND', '#7ED957', 56); } },
  // 5 rule one: the space station shoots past at ~28,000 km/h
  { t: 50.47, ref: SP, cam: push(50.47, 59.11, { x: 960, y: 560, z: 1.08, r: 3 }, { x: 960, y: 560, z: 1.22, r: 0 }, 'lin'), draw: (t, c, L) => {
      const PASS = 55.6, k = seg(t, PASS - .25, PASS + .25), sx = lerp(-1400, 3400, k);
      const K = [[0, { ...POSES.idleB, eyes: 'open' }], [52.2, { ...POSES.lookR, look: [-8, -2] }, 'o'], [PASS - .1, { ...POSES.flinch }, 'snap'], [PASS + .6, { ...POSES.surprise, eyes: 'swirl', mouth: 'wobble' }, 'o']];
      let st = ''; if (t > 53.7 && t < PASS - .25) { const kk = seg(t, 53.7, PASS - .25); st = station(lerp(1700, 1500, kk), 300, .04 + .1*kk, -10); }
      if (k > 0 && k < 1) st = `<g filter="url(#mb3)">${station(sx, 520, 1.1, 0)}</g>` + speedLines(t, 30, .7, '#fff', -1);
      return spaceBg(t, L) + L(1, st + dexSpace(K, t, 900, { wind: t > PASS ? 1.4*Math.max(0, 1 - (t - PASS)) : 0 })) + note(t, 50.5, 420, 260, 'RULE 1', 'YOUR SPEED', 'COMES WITH YOU.', -6).replace(/scale\(([\d.e-]+)\)/, (m, v) => `scale(${(+v)*.6*(t < 53.5 ? 1 : Math.max(0, 1 - (t - 53.5)*3))})`) +
        chipAt(t, 56.0, 960, 120, 'SPACE STATION ≈ 28,000 KM/H', '#FFD23F', 56) + flash(t, PASS, '#fff', .2, .5) + bang(t, PASS, 1450, 700, 'WHOOSH', '#fff', 90, -6, 57.5); } },
  // 6 one, two, three... home on four
  { t: 59.11, ref: SP, cam: push(59.11, 62.2, { x: 960, y: 520, z: 1.4, r: 0 }, { x: 960, y: 520, z: 1.65, r: 2 }, 'lin'), draw: (t, c, L) => {
      const n = t < 60.05 ? 0 : t < 60.5 ? 1 : t < 60.95 ? 2 : 3;
      const K = [[0, { ...POSES.idle, eyes: 'determined', mouth: 'flat' }], [60.05, { ...POSES.point, armF: [120, 10], handF: 'point', mouth: 'flat' }, 'snap'], [60.5, { ...POSES.peace, mouth: 'flat' }, 'snap'], [61.6, 'crouchPop', 'snap']];
      return spaceBg(t, L) + L(1, tpWrap(t, dexSpace(K, t), 960, floatY(t) + 40, -1e9, 62.2) + popFX(t, 62.2, 960, floatY(t) + 40, 1, 'out')) + (n ? bigNum(t, [0, 60.05, 60.5, 60.95][n], 1450, 420, String(n)) : '') + chipAt(t, 59.3, 960, 120, 'DEX COUNTS', '#5CF2FF', 54); } },
  { t: 62.2, ref: RR, cam: push(62.2, 65.17, { x: -200, y: GY - 320, z: 1.5, r: -3 }, { x: -220, y: GY - 330, z: 1.6, r: 0 }, 'lin'), draw: (t, c, L) => {
      const A = 62.3;
      return bedroom(t, L, c, 'b4') + L(1, tpWrap(t, dex([[A, 'landSquash'], [A + .2, { ...POSES.cheer, mouth: 'laugh' }, 'o2']], t, -250, GY), -250, GY - 150, A) + popFX(t, A, -250, GY - 150, 1)) + bigNum(t, A, 1400, 420, '4', '#7ED957') + chipAt(t, A + .2, 960, 120, 'HOME', '#7ED957', 56); } },
  // 7 RULE 4
  { t: 65.17, ref: RR, cam: push(65.17, END, { x: -150, y: GY - 360, z: 1.3, r: 0 }, { x: -130, y: GY - 360, z: 1.38, r: 0 }, 'lin'), draw: (t, c, L) =>
      bedroom(t, L, c, 'b2') + L(1, dex([[0, { ...POSES.smile, sweat: true }], [65.6, { ...POSES.peace }, 'o']], t, -400, GY)) + note(t, 65.2, 1340, 420, 'RULE 4', 'SPACE: 10-SECOND', 'TRIP. MAX.') },
];
const SHAKES_S4 = [[3.4, 10, .4], [17.65, 10, .3], [55.6, 30, .7], [62.3, 8, .3]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_S4, SHAKES_S4) + vignette(); [32.85, 50.47, 65.17].forEach(w => s += wipe(t, w)); return s; }
