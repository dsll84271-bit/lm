// RIG2
// Ep3 w: the window-cleaner rescue. END 91.32  ST=[3.0, 8.94, 16.15, 21.29, 28.92, 41.04, 58.8, 64.14, 72.05, 84.37]
const CY = GY - 36*FLOOR;                    // cradle platform (40 floors up)
const SNAP = 10.6, SLIP = 11.2, DEXIN = 16.3, GRAB = 16.6, FRZW = 19.3, UNF = 57.0, GO = 58.85, IN = 59.0, SPL = 59.3;
const sT = t => t < SLIP ? 0 : t < FRZW ? (t - SLIP)*1.5/(FRZW - SLIP) : t < UNF ? 1.5 : 1.5 + (t - UNF)*.45;   // story seconds of falling
const fallY = t => CY - 20 + 180*sT(t)*sT(t);
const manX = t => lerp(250, 430, E.io(seg(t, SNAP + .2, SLIP + .3)));
const frozen = t => t >= FRZW && t < UNF;
function pair(t, o={}) {   // the cleaner (and Dex once he's arrived), falling
  const x = manX(t), y = fallY(t) + (t < SLIP ? 0 : 180*DS), tt = frozen(t) ? FRZW : t;
  const mk = t < SLIP ? [[0, { ...POSES.smile, armF: [140, -40] }], [SNAP + .05, { ...POSES.surprise, eyes: 'wide', mouth: 'o' }, 'snap']] : [[0, 'flailA'], [SLIP + .5, 'flailB'], [SLIP + 1.0, 'flailA'], [SLIP + 1.5, 'flailB'], [GRAB, { ...POSES.flailA, armB: [-120, -20] }], [18.0, 'flailB'], [19.0, 'flailA']];
  let man = cleaner(mk, tt + (t < SLIP ? 0 : Math.sin(tt*3)*.0), x, y, { air: t >= SLIP, rot: t < SLIP ? 0 : Math.sin(tt*2)*10 + 8, wind: t >= SLIP ? -1 : 0 });
  if (t < SLIP) man += squeegee(x + 130, y - 300, 1, 30 + Math.sin(t*8)*25*(t < SNAP ? 1 : 0));
  let d = '';
  if (t >= DEXIN) { const dx = x - 190, K = [[DEXIN, 'landSquash'], [DEXIN + .15, { ...POSES.point, armF: [100, 10], handF: null, eyes: 'determined', mouth: 'grit' }, 'snap'], [GRAB + .1, { ...POSES.flailB, armF: [96, 0], eyes: 'determined', mouth: 'grit' }, 'o'], [UNF + .5, { ...POSES.dive, armF: [96, 0], eyes: 'squeeze' }, 'o']];
    d = tpWrap(t, chibi2(dexAt(K, tt, () => ({ x: dx, y: y + 10 }), { s: DS, air: true, rot: Math.sin(tt*2.2)*8 - 6, wind: -1.2, seed: 4 })), dx, y - 140, DEXIN, o.out ?? 1e9) + popFX(t, DEXIN, dx, y - 140, .9); }
  return d + (o.manOut && t > o.manOut + .1 ? '' : (o.manOut ? tpWrap(t, man, x, y - 150, -1e9, o.manOut) : man));
}
const fallCam = (t, z=1.35, dy=-160, dx=0) => ({ x: manX(t) - 90 + dx, y: fallY(t) + dy + 180*DS*(t >= SLIP ? 1 : 0) - 100, z, r: 0 });
function bulletBg(t, L) { return `<g filter="url(#impInk)" opacity=".55">${plazaW(t, L)}</g><rect width="1920" height="1080" fill="#1B2A6B" opacity=".55"/>`; }
const SHOTS_W = [
  // 0 what is it good for? (plaza)
  { t: 0, ref: RR, cam: push(0, 5.3, { x: -400, y: GY - 360, z: 1.2, r: 0 }, { x: -380, y: GY - 360, z: 1.3, r: 0 }, 'lin'), draw: (t, c, L) =>
      plazaW(t, L, 'b2') + L(1, dex([[0, { ...POSES.idle }], [3.0, { ...POSES.think }, 'o'], [4.6, { ...POSES.shrug }, 'o']], t, -560, GY - 20)) + chipAt(t, 3.2, 960, 120, 'WHAT IS IT ACTUALLY GOOD FOR?', '#5CF2FF', 52) },
  // 1 that afternoon: tilt up the tower
  { t: 5.3, ref: RR, cam: t => ({ x: 120, y: lerp(GY - 500, CY - 200, E.io(seg(t, 5.5, 8.9))), z: lerp(1.0, 1.15, seg(t, 5.3, 8.94)), r: 0 }), draw: (t, c, L) =>
      plazaW(t, L) + L(1, cradle(250, CY) + cleaner([[0, { ...POSES.smile, armF: [140, -40] }]], t, 250, CY - 20) + squeegee(380, CY - 320, 1, 30 + Math.sin(t*8)*25)) + chipAt(t, 5.76, 960, 120, 'THAT AFTERNOON', '#FF8A3D', 56) },
  // 2 forty floors up, the platform snaps
  { t: 8.94, ref: RR, cam: push(8.94, 12.2, { x: 250, y: CY - 260, z: 1.45, r: 0 }, { x: 300, y: CY - 220, z: 1.55, r: -4 }, 'lin'), draw: (t, c, L) => {
      const sn = E.o(seg(t, SNAP, SNAP + .4));
      let notes = ''; if (t < SNAP) for (let i = 0; i < 3; i++) { const k = ((t*.8 + i/3) % 1); notes += `<text x="${150 - k*60 + i*20}" y="${CY - 520 - k*140}" font-family="Lilita One" font-size="54" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" opacity="${1 - k}">♪</text>`; }
      return plazaW(t, L, 'b2') + L(1, cradle(250, CY, 0, sn) + pair(t) + notes) + chipAt(t, 9.0, 960, 120, '40 FLOORS UP', '#3D8BFF', 58) + bang(t, SNAP, 1400, 260, 'SNAP!', '#E8463C', 120, -8) + (t > SNAP && t < SNAP + .1 ? focusLines(t, 960, 560, .8, 300) : ''); } },
  // 3 the fall (slow motion), following him down the glass
  { t: 12.2, ref: RR, cam: t => fallCam(t, 1.4, -120, 60), draw: (t, c, L) =>
      `<rect width="1920" height="1080" fill="#3F6FB8"/>` + L(1, towerW(t, c.y - 700, c.y + 700) + cradle(250, CY, 0, 1) + pair(t)) + speedLines(t, 16, .35, '#fff').replace(/<rect x="([\d.-]+)" y="([\d.-]+)" width="([\d.-]+)" height="([\d.-]+)"/g, (m, x, y, w, h) => `<rect x="${(+y)*1.78}" y="${(+x)*.45}" width="${h}" height="${w}"`) + chipAt(t, 12.3, 1600, 120, 'SLOW MOTION', '#1F2033', 40) },
  // 4 Dex on the street looks up, pops
  { t: 14.0, ref: RR, cam: push(14.0, 16.2, { x: -560, y: GY - 320, z: 1.7, r: 4 }, { x: -560, y: GY - 320, z: 1.9, r: 6 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.lookCam, look: [4, -10], tilt: -10, eyes: 'wide', mouth: 'o' }], [14.8, { ...POSES.ready, look: [4, -10], tilt: -8 }, 'o'], [15.6, 'crouchPop', 'snap']];
      return plazaW(t, L, 'b4') + L(1, tpWrap(t, dex(K, t, -560, GY - 20), -560, GY - 170, -1e9, 15.95) + popFX(t, 15.95, -560, GY - 170, 1, 'out')) + chipAt(t, 14.9, 960, 120, 'DEX SEES HIM', '#FFD23F', 54); } },
  // 5 pops beside him, grabs his arm... now they're both falling
  { t: 16.2, ref: RR, cam: t => fallCam(t, 1.5, -100, -60), draw: (t, c, L) =>
      `<rect width="1920" height="1080" fill="#3F6FB8"/>` + L(1, towerW(t, c.y - 700, c.y + 700) + pair(t)) + bang(t, GRAB, 1450, 300, 'GOT YOU!', '#FFD23F', 90, -6, 19.0) + chipAt(t, 19.3, 960, 120, 'NOW THEY’RE BOTH FALLING', '#E8463C', 54) },
  // 6 bullet time: reaction times
  { t: 19.9, ref: RR, cam: t => { const c = fallCam(FRZW, 1.45, -100, -60); return { ...c, r: Math.sin((t - 19.9)*.25)*4, z: c.z + (t - 19.9)*.01 }; }, draw: (t, c, L) => {
      const opts = [['GROUND?', -300, '#E8463C', 25.5], ['A ROOF?', 0, '#FF8A3D', 25.9], ['WATER?', 300, '#3D8BFF', 26.3]];
      return `<rect width="1920" height="1080" fill="#22305F"/>` + L(1, `<g opacity=".5">${towerW(t, c.y - 700, c.y + 700)}</g>` + pair(t)) + chipAt(t, 20.0, 960, 110, 'TIME, PAUSED (FOR EXPLAINING)', '#5CF2FF', 46) +
        chipAt(t, 21.4, 480, 860, 'HUMAN REACTION ≈ 0.25 S', '#FFD23F', 44) + chipAt(t, 24.0, 1440, 860, 'DEX: EVEN LESS', '#E8463C', 50) + (t > 21.4 && t < 25.4 ? `<g transform="translate(480,640)">${stopwatch(0, 0, .9, 0, '#FFD23F').replace('00:00', '0.25s')}</g>` : '') +
        opts.map(([lab, x, col, a]) => t > a ? `<g transform="translate(420,${420 + (x/300)*110}) scale(${pop(t, a, .3)})">${chip(lab, 0, 0, col, 52)}</g>` : '').join(''); } },
  // 7 rule one: teleporting to the ground keeps the speed
  { t: 28.9, ref: GC, cam: push(28.9, 41.0, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = E.io(seg(t, 33.2, 34.6));
      let s = `<rect x="-200" y="${960}" width="2400" height="300" fill="#BFC5D9" stroke="${INK}" stroke-width="6"/>`;
      if (t > 32.7) { s += `<g transform="translate(560,300) scale(.45)">${chibi2({ ...DEX2, ...mixPose(POSES.flailB, POSES.flailB, 1), x: 0, y: 260, s: 1, t, air: true })}</g>` + arrow(700, 260, 700, 470, '#FFD23F', 22);
        s += `<g opacity="${k}"><g transform="translate(1360,${lerp(300, 830, k)}) scale(.45)">${chibi2({ ...DEX2, ...mixPose(POSES.flailB, POSES.flailB, 1), x: 0, y: 260, s: 1, t, air: true })}</g>${arrow(1500, lerp(260, 790, k), 1500, lerp(470, 1000, k), '#FFD23F', 22)}</g>`;
        if (t > 34.7) s += `<path d="M700,600 Q1030,520 1300,760" stroke="#fff" stroke-width="8" fill="none" stroke-dasharray="20 14"/>` + `<g transform="translate(1720,700) scale(${pop(t, 34.8, .3)})">${chip('SAME SPEED', 0, 0, '#E8463C', 46)}</g>` + crossOut(1360, 900, .5, t, 35.8); }
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, s) + note(t, 28.95, 960, 300, 'RULE 1', 'YOUR SPEED', 'COMES WITH YOU.').replace(/scale\(([\d.e-]+)\)/, (m, v) => `scale(${(+v)*(t < 32.6 ? 1 : Math.max(0, 1 - (t - 32.6)*4))})`) +
        chipAt(t, 37.45, 960, 110, "TELEPORTING DOESN'T STOP A FALL", '#5CF2FF', 52) + chipAt(t, 39.5, 960, 200, 'IT JUST MOVES IT', '#FFD23F', 52); } },
  // 8 he picks water: 1.5 s of falling ~ 50 km/h ~ a 10 m Olympic dive
  { t: 41.0, ref: GC, cam: push(41.0, 55.7, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      let s = '';
      if (t < 43.9) { const tick = (x, ok, a, lab) => t < a ? '' : `<g transform="translate(${x},520) scale(${pop(t, a, .3)})"><rect x="-260" y="-200" width="520" height="400" rx="30" fill="${ok ? '#3D8BFF' : '#8C93A8'}" stroke="${INK}" stroke-width="8"/>${txt(lab, 0, 30, 90, '#fff')}<g transform="translate(200,-170)"><circle r="56" fill="${ok ? '#7ED957' : '#E8463C'}" stroke="${INK}" stroke-width="7"/>${ok ? `<path d="M-24,0 L-6,20 L26,-18" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M-20,-20 L20,20 M20,-20 L-20,20" stroke="#fff" stroke-width="14" stroke-linecap="round"/>`}</g></g>`;
        s = tick(560, false, 41.1, 'GROUND') + tick(1360, true, 42.7, 'WATER'); }
      else if (t < 53.2) {
        const v = Math.round(50*E.io(seg(t, 47.0, 48.6)));
        s = `<g transform="translate(480,520)">${stopwatch(0, 0, 1.4, 1.5 > 0 ? 1 : 0, '#FFD23F').replace('00:01', '1.5 S')}</g>` + (t > 46.9 ? gauge(1440, 520, 230, v, 120, '≈ ' + v + ' KM/H', '#E8463C') : '');
        if (t > 49.6) { const dk = seg(t, 49.6, 52.6); s = `<g opacity="${seg(t, 49.6, 50.0)}"><rect x="-200" y="-200" width="2400" height="1500" fill="#1B2A6B"/>` + `<rect x="200" y="760" width="1600" height="400" fill="url(#poolG)" stroke="${INK}" stroke-width="6"/><rect x="300" y="200" width="60" height="560" fill="#C9D0EE" stroke="${INK}" stroke-width="6"/><rect x="280" y="190" width="380" height="30" rx="8" fill="#E8463C" stroke="${INK}" stroke-width="6"/>${txt('10 M', 470, 170, 52, '#E8463C')}` +
          diver(lerp(620, 760, dk), lerp(110, 760, E.in(dk)), 1, lerp(0, 180, E.io(dk))) + (dk > .98 ? splash(760, 760, t, 52.6, .5) : '') + `</g>` + chipAt(t, 50.0, 1340, 300, 'OLYMPIC 10 M DIVE', '#3D8BFF', 50) + chipAt(t, 50.6, 1340, 400, 'HITS THE WATER AT ≈ 50 KM/H', '#E8463C', 44); } }
      else { const sec = 1.5 + seg(t, 53.4, 55.4), v = Math.round(35.3*sec); s = gauge(960, 600, 270, v, 120, '≈ ' + v + ' KM/H', '#E8463C') + chipAt(t, 53.3, 960, 140, 'EVERY EXTRA SECOND: WORSE', '#E8463C', 54) + `<g transform="translate(960,950)">${txt('AFTER ' + sec.toFixed(1) + ' S OF FALLING', 0, 0, 46, '#fff')}</g>`; }
      return L(0, studioBack(t, '#1B2A6B', '#121C4A', '#22337A')) + L(1, s) + chipAt(t, 44.0, 960, 120, 'FALLING FOR ≈ 1.5 S', '#FFD23F', 54, 49.5); } },
  // 9 so Dex doesn't wait: un-pause, POP
  { t: 55.7, ref: RR, cam: t => { const c = fallCam(t, 1.6, -100, -60); return { ...c, r: t < UNF ? 2 : 0 }; }, draw: (t, c, L) => {
      let s = `<rect width="1920" height="1080" fill="${t < UNF ? '#22305F' : '#3F6FB8'}"/>` + L(1, `<g opacity="${t < UNF ? .5 : 1}">${towerW(t, c.y - 700, c.y + 700)}</g>` + pair(t, { out: GO, manOut: GO }) + popFX(t, GO, manX(t) - 90, fallY(t) + 40, 1.2, 'out'));
      return s + chipAt(t, 55.8, 960, 120, 'NO WAITING', '#E8463C', 60) + flash(t, UNF, '#fff', .2, .4); } },
  // 10 into the deep end
  { t: 58.95, ref: RR, cam: push(58.95, 64.14, { x: 500, y: WS - 330, z: .95, r: -2 }, { x: 560, y: WS - 330, z: 1.02, r: 0 }, 'lin'), draw: (t, c, L) => {
      const PX = 900, k = seg(t, IN, SPL), py = lerp(WS - 420, WS + 60, k);
      let fall = '';
      if (t < SPL) fall = tpWrap(t, cleaner([[0, 'flailB']], t, PX + 90, py + 180*DS, { air: true, wind: -1, rot: 8 }) + chibi2(dexAt([[0, { ...POSES.dive, armF: [96, 0] }]], t, () => ({ x: PX - 100, y: py + 190*DS }), { s: DS, air: true, wind: -1, rot: -6 })), PX, py, IN) + popFX(t, IN, PX, py, 1.1);
      const K = [[0, { ...POSES.idleB, eyes: 'happy', mouth: 'grin' }], [SPL + .05, { ...POSES.surprise, eyes: 'wide', mouth: 'o' }, 'snap']];
      let kids = ''; [[-300, 0], [-120, 1], [60, 2], [-480, 3]].forEach(([x, i]) => kids += kid(i, t, x, WS + 150, K));
      const inst = chibi2({ ...dexAt([[0, { ...POSES.point, armF: [96, -6] }], [SPL + .1, { ...POSES.surprise, eyes: 'wide' }, 'snap']], t, () => ({ x: -900, y: WS }), { s: DS, seed: 80 }), ...PEOPLE[1] });
      return poolW(t, L) + L(1, inst + fall + kids + waterFront(-6000, 6000, .5) + splash(PX, WS, t, SPL, 1.2)) + bang(t, 60.4, 1450, 240, 'RIGHT NOW!', '#FFD23F', 90, -6, 61.3) + chipAt(t, 61.3, 960, 120, 'THE DEEP END', '#3D8BFF', 58) + (t > SPL && t < SPL + .08 ? `<rect width="1920" height="1080" fill="#fff" opacity=".7"/>` : ''); } },
  // 11 underwater: at least 4.5 m deep, room to slow down
  { t: 64.14, ref: GC, cam: push(64.14, 72.0, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 560, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const top = 200, mpx = 140, bot = top + 4.5*mpx + 60;   // 4.5 m drawn at 160 px/m
      const k = seg(t, 64.3, 67.5), dep = 2.6*(1 - Math.pow(1 - Math.min(1, k), 2.4)), rise = seg(t, 68.0, 71.5), y = top + (dep*(1 - E.io(rise)) + .2*E.io(rise))*mpx;
      let bub = ''; for (let i = 0; i < 16; i++) { const kk = ((t*.6 + hash(i)) % 1); bub += `<circle cx="${900 + (hash(i*3) - .5)*220}" cy="${y + 120 - kk*300}" r="${5 + 8*hash(i*5)}" fill="#fff" opacity="${.7*(1 - kk)}"/>`; }
      const ladder = `<path d="M420,${top} L420,${top + 4.5*mpx}" stroke="#fff" stroke-width="8"/>` + [0, 1, 2, 3, 4, 4.5].map(m => `<path d="M400,${top + m*mpx} L440,${top + m*mpx}" stroke="#fff" stroke-width="6"/><text x="380" y="${top + m*mpx + 14}" text-anchor="end" font-family="Lilita One" font-size="40" fill="#fff">${m} M</text>`).join('');
      const two = `<g transform="translate(900,${y})">${chibi2({ ...DEX2, ...mixPose(POSES.dive, POSES.dive, 1), x: -60, y: 260*.55, s: .55, t, air: true, rot: 180*(1 - E.io(rise)) })}${chibi2({ ...CLEANER, ...mixPose(POSES.flailA, POSES.flailA, 1), x: 70, y: 260*.55, s: .55, t, air: true, rot: 170*(1 - E.io(rise)) })}</g>`;
      return L(0, `<rect x="-200" y="-200" width="2400" height="1500" fill="#E6F4FF"/>`) + L(1, `<rect x="200" y="${top}" width="1520" height="${bot - top}" fill="url(#poolG)" stroke="${INK}" stroke-width="8"/><rect x="200" y="${bot - 30}" width="1520" height="30" fill="#7FD3FF" stroke="${INK}" stroke-width="6"/>` + ladder + bub + two) +
        chipAt(t, 64.3, 1340, 110, 'UNDER A 10 M BOARD:', '#1F2033', 44) + chipAt(t, 66.6, 1400, 1000, 'AT LEAST ≈ 4.5 M DEEP', '#3D8BFF', 50) + chipAt(t, 69.4, 560, 1000, 'ROOM TO SLOW DOWN', '#7ED957', 46); } },
  // 12 one very wet window cleaner
  { t: 72.0, ref: RR, cam: push(72.0, 74.2, { x: 900, y: WS - 260, z: 1.7, r: 2 }, { x: 900, y: WS - 260, z: 1.85, r: 0 }, 'lin'), draw: (t, c, L) => {
      const up = E.o(seg(t, 72.1, 72.6));
      const man = cleaner([[0, { ...POSES.surprise, eyes: 'squeeze', mouth: 'wobble', armF: [90, 40] }], [72.9, { ...POSES.smile, armF: [130, 20] }, 'o']], t, 980, WS + 230 - 120*up, { air: true, noShadow: true });
      let drip = ''; for (let i = 0; i < 6; i++) { const kk = ((t*1.2 + i/6) % 1); drip += `<ellipse cx="${900 + i*30}" cy="${WS - 310 + kk*200}" rx="6" ry="10" fill="#BFF0FF" stroke="${INK}" stroke-width="2" opacity="${1 - kk}"/>`; }
      return poolW(t, L, 'b4') + L(1, man + drip + waterFront(-6000, 6000, .6) + spit(t)) + chipAt(t, 72.2, 960, 120, '1 VERY WET WINDOW CLEANER', '#3D8BFF', 54); } },
  // 13 one very confused swimming lesson, ears still ringing (+ RULE 2)
  { t: 74.2, ref: RR, cam: push(74.2, 79.05, { x: -500, y: WS - 300, z: 1.35, r: 0 }, { x: -480, y: WS - 300, z: 1.45, r: -2 }, 'lin'), draw: (t, c, L) => {
      const ears = { ...POSES.flinch, armF: [150, 40], armB: [-150, -40], handF: 'fist', handB: 'fist', eyes: 'swirl', mouth: 'wobble' };
      let kids = ''; [[-700, 0], [-500, 1], [-300, 2], [-100, 3]].forEach(([x, i]) => kids += kid(i, t + i*.3, x, WS + 150, [[0, ears]]) + ringing(x, WS - 14, t + i*.2, .7));
      const inst = chibi2({ ...dexAt([[0, ears]], t, () => ({ x: -1050, y: WS }), { s: DS, seed: 80 }), ...PEOPLE[1] }) + ringing(-1050, WS - 250, t, 1);
      return poolW(t, L, 'b2') + L(1, inst + kids + waterFront(-6000, 6000, .5)) + chipAt(t, 74.3, 960, 120, '1 VERY CONFUSED SWIMMING LESSON', '#B07CFF', 48) + bang(t, 75.6, 1500, 330, 'EEEEEEEE', '#FFD23F', 70, 4) + chipAt(t, 76.2, 960, 960, 'EARS: STILL RINGING', '#E8463C', 50) +
        note(t, 78.0, 1500, 640, 'RULE 2', 'TELEPORTING', 'IS LOUD.', 6).replace(/scale\(([\d.e-]+)\)/, (m, v) => `scale(${(+v)*.55})`); } },
  // 14 everyone is completely fine
  { t: 79.05, ref: RR, cam: push(79.05, 84.37, { x: 100, y: WS - 330, z: 1.05, r: 0 }, { x: 120, y: WS - 330, z: 1.12, r: 0 }, 'lin'), draw: (t, c, L) => {
      const ok = [[0, { ...POSES.knuckle }]];
      let kids = ''; [[-420, 0], [-260, 1], [-100, 2], [60, 3]].forEach(([x, i]) => kids += kid(i, t + i*.2, x, WS + 150, ok));
      const inst = chibi2({ ...dexAt(ok, t, () => ({ x: -650, y: WS }), { s: DS, seed: 80 }), ...PEOPLE[1] });
      const man = cleaner([[0, { ...POSES.cheer, mouth: 'laugh' }]], t, 420, WS + 150, { air: true, noShadow: true });
      const dx = dex([[0, { ...POSES.peace, eyes: 'happy' }]], t, 780, WS);
      let drip = ''; for (let i = 0; i < 4; i++) { const kk = ((t*1.1 + i/4) % 1); drip += `<ellipse cx="${740 + i*30}" cy="${WS - 330 + kk*300}" rx="6" ry="10" fill="#BFF0FF" stroke="${INK}" stroke-width="2" opacity="${1 - kk}"/>`; }
      return poolW(t, L, 'b2') + L(1, inst + dx + drip + kids + man + waterFront(-6000, 620, .5) + `<rect x="620" y="${WS}" width="5000" height="1400" fill="#E9F3FA" stroke="${INK}" stroke-width="6"/>`) + chipAt(t, 79.2, 960, 120, 'EVERYONE: COMPLETELY FINE ✓', '#7ED957', 54) + (t > 79.5 ? sparkles(960, 400, t, 6, 400) : ''); } },
  // 15 that's the trick
  { t: 84.37, ref: GC, cam: push(84.37, END, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.05, r: 0 }, 'lin'), draw: (t, c, L) => {
      const s = `<rect x="200" y="760" width="620" height="200" fill="#A9AFC8" stroke="${INK}" stroke-width="7"/><rect x="1100" y="760" width="620" height="260" fill="url(#poolG)" stroke="${INK}" stroke-width="7"/>` + arrow(510, 300, 510, 720, '#FFD23F', 26) + arrow(1410, 300, 1410, 720, '#FFD23F', 26) +
        `<g transform="translate(510,860)">${txt('HARD', 0, 20, 64, '#fff')}</g><g transform="translate(1410,900)">${txt('SOFT', 0, 20, 64, '#fff')}</g>` + crossOut(510, 520, .6, t, 85.4) + (t > 87.7 ? `<g transform="translate(1660,420) scale(${pop(t, 87.7, .3)})"><circle r="70" fill="#7ED957" stroke="${INK}" stroke-width="8"/><path d="M-30,0 L-8,24 L32,-22" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : '');
      return L(0, studioBack(t)) + L(1, s) + chipAt(t, 85.3, 960, 110, "YOU CAN'T CANCEL YOUR SPEED", '#5CF2FF', 54) + chipAt(t, 87.7, 960, 210, 'SEND IT SOMEWHERE SOFT', '#7ED957', 54); } },
];
function spit(t) { return ''; }
const SHAKES_W = [[SNAP, 16, .5], [DEXIN, 8, .25], [GO, 10, .3], [SPL, 34, .7]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_W, SHAKES_W) + vignette(); [28.9, 84.37].forEach(w => s += wipe(t, w)); return s; }
