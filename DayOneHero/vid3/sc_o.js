// RIG2
// Ep3 cold open. No recap: the first seconds are Dex slamming face-first into a Sydney beach.
// Narration o: ST=[4.0, 9.28, 15.39, 22.09, 27.85]  END 34.53
// word marks (silencedetect): o0 "That's Dex" 4.0-4.76 | "A second ago..." 5.07-7.48
// o1 "Every morning..." 9.28-12.16 | "Today," 12.66 | "it's teleportation" 13.33-14.49
// o2 "He thought of a beach" 15.39-16.38 | "and here he is" 16.65-17.5 | "other side... Sydney" 17.89-20.49
// o3 "best superpower ever" 22.09-23.88 | "No traffic" 24.29 | "No queues" 25.22 | "No school run" 26.18-27.15
// o4 "But real physics..." 27.85-30.13
const P0 = .35, HIT = 1.0, SX = -100;                        // pop-in, face-plant, where he lands
// flight from the pop to the sand: pivot (hip) path, rotation head-first
function flight(t) { const k = seg(t, P0, HIT), px = lerp(-560, SX, k), py = lerp(GY - 600, GY - 112, E.in(k)*.75 + k*.25) - 90*Math.sin(k*Math.PI)*.6;
  return { x: px, y: py + 150*DS, rot: lerp(-35, -172, E.in(k)) }; }
function dexFly(t) { const f = flight(t), K = [[P0, { ...POSES.popJump, eyes: 'happy', mouth: 'grin' }], [P0 + .25, { ...POSES.dive, eyes: 'shock', mouth: 'wail' }, 'snap']];
  return chibi2(dexAt(K, t, tt => { const g = flight(Math.max(P0, tt)); return { x: g.x, y: g.y }; }, { s: DS, air: true, rot: f.rot, seed: 3 })); }
// pull-out: forward flip out of the sand, lands dizzy
const PULL = 2.62, LANDT = 3.02;
function dexPull(t) {
  const k = seg(t, PULL, LANDT), up = Math.sin(k*Math.PI);
  const pos = tt => { const kk = seg(tt, PULL, LANDT); return tt < LANDT ? { x: SX + 40*kk, y: lerp(GY + 150*DS, GY, E.o(kk)) - 260*Math.sin(kk*Math.PI) } : { x: SX + 40, y: GY }; };
  const K = [[0, 'flailA'], [PULL + .2, 'flailB'], [LANDT - .05, 'landSquash', 'in'], [LANDT + .2, 'dizzy', 'o2']];
  return chibi2(dexAt(K, t, pos, { s: DS, air: t < LANDT, rot: t < LANDT ? lerp(180, 360, E.io(k)) : 0, seed: 3 }));
}
function sandHat(x, y, t, a) { if (t < a) return ''; const k = 1 - seg(t, a + 2.8, a + 3.3); if (k <= 0) return '';
  return `<g opacity="${k}"><path d="M${x - 70},${y + 10} Q${x - 50},${y - 40} ${x},${y - 46} Q${x + 50},${y - 40} ${x + 72},${y + 12} Z" fill="#EBCB8F" stroke="${INK}" stroke-width="5"/>${[0,1,2].map(i => `<circle cx="${x - 60 + i*60 + Math.sin(t*3 + i)*4}" cy="${y + 20 + ((t*90 + i*40) % 120)}" r="6" fill="#E9C68A"/>`).join('')}</g>`; }
function spit(x, y, t, a) { if (t < a || t > a + .8) return ''; let s = ''; for (let i = 0; i < 16; i++) { const d = t - a - (i%4)*.02; if (d < 0) continue; const an = -.5 + hash(i)*.9, v = 500 + 400*hash(i*3); s += `<circle cx="${x + Math.cos(an)*v*d}" cy="${y + Math.sin(an)*v*d + 1200*d*d}" r="${6 + 7*hash(i + 5)}" fill="#E9C68A" stroke="${INK}" stroke-width="3"/>`; } return s; }
// a world drawn into a screen-space panel with its own camera
function panel(clip, cam, drawFn) { const Lp = (p, svg, f='') => `<g transform="${layerTR(cam, p, RR)}"${f ? ` filter="url(#${f})"` : ''}>${svg}</g>`;
  return `<clipPath id="${clip.id}"><path d="${clip.d}"/></clipPath><g clip-path="url(#${clip.id})">${drawFn(Lp)}</g>`; }
// jam / queue / school sets
function streetJam(t, L) {
  const cars = [['#E8463C', -1080], ['#3D8BFF', -360], ['#7ED957', 360], ['#B07CFF', 1080]].map(([c, x], i) => carSide2(x, GY - 30*1.45 + 10, 1.45, t, { wr: 0, col: c })).join('');
  let honk = ''; [[-360, 0], [360, .35]].forEach(([x, ph]) => { if ((t + ph) % .8 < .4) honk += `<g transform="translate(${x + 60},${GY - 380})">${txt('BEEP', 0, 0, 56, '#FFC21F')}</g>`; });
  return L(0, skyW(t)) + L(.5, cityFar(t, 830), 'b4') + L(1, streetGround() + cars + honk);
}
function cafe(t, L) {
  let s = roomW(t, { wall: '#CDEBDD', stripe: '#BFE3D2', floor: '#B98E66' });
  s += `<g transform="translate(900,${GY - 140})"><rect x="-260" y="-260" width="520" height="260" rx="14" fill="#8A5A3B" stroke="${INK}" stroke-width="7"/><rect x="-280" y="-290" width="560" height="40" rx="10" fill="#C99A68" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-620" width="400" height="140" rx="16" fill="#1F2033" stroke="${INK}" stroke-width="6"/>${txt('COFFEE', 0, -530, 72, '#FFC21F')}<rect x="-60" y="-380" width="60" height="80" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`;
  return L(1, s);
}
function schoolW(t, L) {
  let s = `<rect x="-6000" y="-3000" width="12000" height="5000" fill="url(#sky2)"/>` + `<g transform="translate(0,${GY - 140})"><rect x="-900" y="-560" width="1800" height="560" fill="#D9715A" stroke="${INK}" stroke-width="8"/>${[...Array(6)].map((_, i) => `<rect x="${-800 + i*280}" y="-480" width="180" height="150" rx="8" fill="#BFE6FF" stroke="${INK}" stroke-width="6"/>`).join('')}<rect x="-130" y="-280" width="260" height="280" fill="#3D5AB0" stroke="${INK}" stroke-width="7"/><rect x="-380" y="-680" width="760" height="130" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/>${txt('SCHOOL', 0, -590, 84, '#3D8BFF')}</g>`;
  s += `<rect x="-6000" y="${GY - 140}" width="12000" height="900" fill="#A9AFC8" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -2000; x < 2000; x += 70) s += `<rect x="${x}" y="${GY - 330}" width="14" height="200" fill="#2B2F4A"/>`;
  s += `<rect x="-2000" y="${GY - 320}" width="1700" height="14" fill="#2B2F4A"/><rect x="300" y="${GY - 320}" width="1700" height="14" fill="#2B2F4A"/>`;
  return L(0, `<rect x="-6000" y="-3000" width="12000" height="6000" fill="url(#sky2)"/>`) + L(1, s.replace(`<rect x="-6000" y="-3000" width="12000" height="5000" fill="url(#sky2)"/>`, ''));
}
// ---------------------------------------------------------------- shots
const BC = { x: -100, y: GY - 260, z: 1.2 };
const SHOTS_O = [
  // 0 beach wide: empty sunset... POP... face-plant
  { t: 0, ref: RR, cam: push(0, 1.05, { x: -300, y: GY - 360, z: 1.12, r: 0 }, { x: -220, y: GY - 330, z: 1.22, r: -2 }, 'lin'), draw: (t, c, L) => {
      let w = beachW(t, L);
      let d = '';
      if (t >= P0 && t < HIT) { const f = flight(t); d = tpWrap(t, dexFly(t), f.x, f.y - 150*DS, P0) + popFX(t, P0, -560, GY - 600, .9); }
      if (t >= HIT) d = dexStuck(t, SX) + sandBurst(SX, GY, t, HIT) + popFX(t, P0, -560, GY - 600, .9);
      if (t >= P0 && t < HIT) d += speedLines(t, 10, .25, '#fff');
      let s = w + L(1, d);
      if (t >= HIT && t < HIT + .1) { const f = Math.floor((t - HIT)*30); s = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${s}${focusLines(t, 960, 700, 1, 280)}</g>`; }
      return s + shockScreen(t, P0, 700, 300); } },
  // 1 closer: legs kicking, a seagull walks over and stares
  { t: 1.12, ref: RR, cam: push(1.12, 2.58, { x: SX + 120, y: GY - 230, z: 1.75, r: 3 }, { x: SX + 140, y: GY - 230, z: 1.9, r: 2 }, 'lin'), draw: (t, c, L) => {
      const gx = lerp(620, 330, E.io(seg(t, 1.3, 1.95)));
      return beachW(t, L, 'b4') + L(1, dexStuck(t, SX) + sandBurst(SX, GY, t, HIT) + gull(gx, GY + 10, 1, t, { walk: t > 1.3 && t < 1.95, tilt: t > 2.0 ? -18 : 0, squawk: t > 2.2 && t < 2.45 })) +
        (t > 2.0 ? `<g transform="translate(1400,330) scale(${pop(t, 2.0, .3)})">${txt('?', 0, 0, 130, '#fff')}</g>` : '') + bang(t, 2.2, 1250, 200, 'SQUAWK', '#FFC21F', 80, 6, 2.6); } },
  // 2 pulls himself out, lands dizzy, gull flaps off
  { t: 2.58, ref: RR, cam: push(2.58, 4.0, { x: SX + 60, y: GY - 300, z: 1.5, r: -2 }, { x: SX + 50, y: GY - 300, z: 1.62, r: 0 }, 'lin'), draw: (t, c, L) => {
      const gk = seg(t, 2.7, 3.8), gull1 = t < 2.7 ? gull(330, GY + 10, 1, t, { tilt: -18 }) : gull(330 + 900*gk, GY - 40 - 700*gk*gk - 200*gk, 1, t, { fly: true });
      let s = beachW(t, L, 'b4') + L(1, (t < LANDT ? sandMound(SX, GY, 230, 54*(1 - seg(t, PULL, PULL + .3))) : '') + dexPull(t) + gull1 + sandBurst(SX, GY, t, PULL, .6) + (t > LANDT ? stars(SX + 40, GY - 410, t, 5, 80) + dust(SX + 40, GY, t, LANDT, 8, .8, '#F3D7A0') : ''));
      return s + tag(t, 3.15, 960, 130, 'SYDNEY · 6:02 PM', '#FF8A3D', 60); } },
  // 3 "That's Dex." close-up, spits out sand
  { t: 4.0, ref: RR, cam: push(4.0, 5.05, { x: SX + 40, y: GY - 260, z: 2.6, r: 2 }, { x: SX + 40, y: GY - 255, z: 2.85, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, 'dizzy'], [4.25, { ...POSES.lookCam, eyes: 'squeeze', mouth: 'wobble', tilt: 8 }, 'snap'], [4.55, { ...POSES.lookCam, mouth: 'o', brow: 6 }, 'o'], [4.75, { ...POSES.lookCam, eyes: 'happy', mouth: 'grin', tilt: -4 }, 'o']];
      return beachW(t, L, 'b14') + L(1, dex(K, t, SX + 40, GY) + spit(SX + 70, GY - 205, t, 4.3)) + bang(t, 4.3, 1450, 640, 'PTOO!', '#F3D7A0', 70, 10, 4.9) +
        (t > 4.1 ? `<g transform="translate(1380,360) scale(${pop(t, 4.1, .3)}) rotate(-4)">${chip('DEX', 0, 0, '#FFC21F', 80)}<path d="M-120,40 Q-260,90 -330,160" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-350,120 L-330,165 L-290,140" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : ''); } },
  // 4 split: London bedroom (empty, dawn) | Sydney beach (Dex)
  { t: 5.05, ref: RR, cam: hold(5.05, { x: 0, y: 540, z: 1 }), draw: (t, c, L) => {
      const k = E.snap(seg(t, 5.05, 5.4)), off = (1 - k)*1100;
      const lc = { x: -60, y: GY - 360, z: 1.1 + .05*seg(t, 5, 7.6) }, rc = { x: SX + 80, y: GY - 300, z: 1.55 + .06*seg(t, 5, 7.6) };
      const left = panel({ id: 'pL', d: `M0,0 L1010,0 L910,1080 L0,1080 Z` }, { ...lc, sx: -480 - off }, Lp => bedroom(t, Lp, lc) + Lp(1, cover(t, 0).replace('#7FB3FF', '#9FC3FF') + alarm(t, 330, GY - 318, .9, 0) + `<g transform="translate(-60,560)">${clockF(0, 0, 70, 7, 2)}</g>`));
      const right = panel({ id: 'pR', d: `M1010,0 L1920,0 L1920,1080 L910,1080 Z` }, { ...rc, sx: 480 + off }, Lp => beachW(t, Lp) + Lp(1, dex([[0, { ...POSES.lookCam, eyes: 'happy', mouth: 'grin', tilt: -4 }], [6.2, { ...POSES.shrug, mouth: 'smirk' }, 'o']], t, SX + 40, GY)));
      return `<rect width="1920" height="1080" fill="${INK}"/>` + left + right + `<path d="M1010,-10 L910,1090" stroke="${INK}" stroke-width="22"/><path d="M1010,-10 L910,1090" stroke="#fff" stroke-width="8"/>` +
        tag(t, 5.3, 470, 120, 'LONDON · 7:02 AM', '#3D8BFF', 50) + tag(t, 5.45, 1440, 120, 'SYDNEY · 6:02 PM', '#FF8A3D', 50) + tag(t, 6.0, 960, 960, '1 SECOND AGO', '#E8463C', 58); } },
  // 5 rewind: the face-plant runs backwards, then "this morning"
  { t: 7.6, ref: RR, cam: t => { const tt = lerp(1.3, .1, seg(t, 7.6, 8.45)); return camAt(push(0, 1.05, { x: -300, y: GY - 360, z: 1.12, r: 0 }, { x: -220, y: GY - 330, z: 1.22, r: -2 }, 'lin'), tt); }, draw: (t, c, L) => {
      const tt = lerp(1.3, .1, seg(t, 7.6, 8.45));
      let d = '';
      if (tt >= P0 && tt < HIT) { const f = flight(tt); d = tpWrap(tt, dexFly(tt), f.x, f.y - 150*DS, P0); }
      if (tt >= HIT) d = dexStuck(tt, SX);
      let lines = ''; for (let i = 0; i < 6; i++) { const y = (hash(i + Math.floor(t*30)) * 1080); lines += `<rect x="0" y="${y}" width="1920" height="${4 + 10*hash(i*3)}" fill="#fff" opacity=".35"/>`; }
      return `<g filter="url(#impInk)" opacity=".95">${beachW(tt, L) + L(1, d)}</g>` + lines + `<g transform="translate(160,140)">${txt('◀◀', 0, 0, 90, '#fff', 'start')}</g>` + tag(t, 7.7, 1500, 140, 'REWIND', '#E8463C', 56) + flash(t, 8.45, '#fff', .3, .9); } },
  // 6 London, this morning: alarm, he sits up, a new power shimmers over him
  { t: 8.45, ref: RR, cam: [[8.45, { x: 330, y: GY - 300, z: 2.9, r: 4 }], [9.25, { x: 330, y: GY - 300, z: 3.1, r: 3 }, 'lin'], [9.6, { x: -240, y: GY - 360, z: 1.7, r: -2 }, 'io'], [12.55, { x: -270, y: GY - 380, z: 1.95, r: -1 }, 'lin']], draw: (t, c, L) => {
      const up = E.io(seg(t, 9.6, 10.2)), rot = lerp(-90, 0, up), y = lerp(GY - 128, GY - 154, up), x = lerp(BED + 300, BED + 250, up);
      const K = [[0, { eyes: 'closed', mouth: 'flat', armF: [30, 40], armB: [-20, -30] }], [9.35, { eyes: 'squeeze', mouth: 'wobble', armF: [140, 40], armB: [-20, -30] }, 'snap'],
        [10.0, { eyes: 'open', mouth: 'flat', brow: 4 }], [10.5, { eyes: 'closed', mouth: 'o', armF: [124, 30], armB: [-124, -30], sq: 1.05 }, 'o'], [11.2, { eyes: 'happy', mouth: 'grin', armF: [-10, 10], armB: [10, -10] }, 'o'], [11.9, { ...POSES.surprise, look: [-4, 4] }, 'o']];
      const dx = chibi2(dexAt(K, t, () => ({ x, y }), { s: DS, seed: 2, air: true, noShadow: true, rot }));
      const sh = seg(t, 11.0, 11.7);
      return bedroom(t, L, c, t < 9.6 ? 'b8' : 'b4') + L(1, dx + cover(t, up) + alarm(t, 330, GY - 318, .9, 9.4) + (sh > 0 && sh < 1 ? `<rect x="${-700 + sh*700}" y="${GY - 700}" width="70" height="700" fill="#fff" opacity=".55" transform="skewX(-20)" filter="url(#b4)"/>` : '') + (t > 11.5 ? sparkles(-300, GY - 420, t, 5, 150) : '')) +
        tag(t, 8.6, 960, 130, 'THIS MORNING · LONDON', '#3D8BFF', 56, 9.55) + tag(t, 10.3, 960, 130, 'NEW POWER EVERY DAY', '#7ED957', 60) + tag(t, 10.9, 960, 230, 'DAY 3', '#3D8BFF', 54); } },
  // 7 "Today, it's teleportation": first pop, bed -> across the room
  { t: 12.55, ref: RR, cam: push(12.55, 15.3, { x: 280, y: GY - 400, z: 1.08, r: 0 }, { x: 320, y: GY - 400, z: 1.14, r: 0 }, 'lin'), draw: (t, c, L) => {
      const T1 = 13.1, T2 = 13.25, T3 = 14.55, T4 = 14.68;
      const bedK = [[0, { ...POSES.surprise, look: [-4, 4] }], [12.75, { ...POSES.lookR, eyes: 'determined', mouth: 'smirk' }, 'o'], [12.95, { ...POSES.crouchPop, eyes: 'squeeze' }, 'snap']];
      const bedDex = chibi2(dexAt(bedK, t, () => ({ x: BED + 250, y: GY - 154 }), { s: DS, seed: 2, air: true, noShadow: true }));
      const K2 = [[T2, { ...POSES.surprise, eyes: 'wide', look: [-8, 0] }], [T2 + .5, { ...POSES.surprise, eyes: 'wide', look: [-8, 0], armF: [60, 40] }], [13.95, { ...POSES.cheer, mouth: 'laugh' }, 'o'], [14.45, { ...POSES.crouchPop, eyes: 'happy', mouth: 'grin' }, 'snap']];
      const X2 = 1050, X3 = 300;
      let s = bedroom(t, L, c) + L(1, tpWrap(t, bedDex, BED + 250, GY - 300, -1e9, T1) + cover(t, t > T1 ? 1 : .9) + tpWrap(t, dex(K2, t, X2, GY - 140 + 140), X2, GY - 300, T2, T3) +
        tpWrap(t, dex([[T4, 'landSquash'], [T4 + .2, 'peace', 'o2']], t, X3, GY - 140 + 140), X3, GY - 300, T4) +
        popFX(t, T1, BED + 250, GY - 300, .8, 'out') + popFX(t, T2, X2, GY - 300, .8) + popFX(t, T3, X2, GY - 300, .7, 'out') + popFX(t, T4, X3, GY - 300, .7));
      return s + title(t, 13.3, 960, 190, 'TELEPORTATION', '#5CF2FF', 150) + shockScreen(t, T1, 400, 600) + shockScreen(t, T2, 1400, 600); } },
  // 8 "He thought of a beach..." thought bubble, jumps, POP mid-jump
  { t: 15.3, ref: RR, cam: push(15.3, 16.95, { x: 300, y: GY - 300, z: 2.0, r: 2 }, { x: 300, y: GY - 320, z: 2.2, r: 4 }, 'lin'), draw: (t, c, L) => {
      const J = 16.45, PO = 16.82;
      const K = [[0, 'peace'], [15.45, 'think', 'o'], [16.1, { ...POSES.smile, mouth: 'laugh' }, 'o'], [J - .2, 'crouchPop', 'snap'], [J, 'popJump', 'snap', .1]];
      const pos = tt => tt < J ? { x: 300, y: GY } : { x: 300 + 120*seg(tt, J, PO), y: GY - 260*E.snap(seg(tt, J, PO)) };
      return bedroom(t, L, c, 'b8') + L(1, tpWrap(t, chibi2(dexAt(K, t, pos, { s: DS, seed: 4, air: t > J })), 300 + 120*seg(t, J, PO), GY - 260*E.snap(seg(t, J, PO)) - 150, -1e9, PO) + popFX(t, PO, 420, GY - 410, 1, 'out')) +
        (t < PO ? thought(1350, 340, 1.05, beachMini(t), t, 15.6) : '') + shockScreen(t, PO, 960, 500); } },
  // 9 the globe: London -> Sydney
  { t: 16.95, ref: { x: 960, y: 540, z: 1 }, cam: push(16.95, 19.3, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.08, r: 0 }, 'lin'), draw: (t, c, L) => {
      const k = E.io(seg(t, 17.05, 18.5)), lon0 = lerp(20, 150, k), lat0 = lerp(30, -15, k), R = 400;
      const a = arcLS(960, 560, R, lon0, lat0, E.io(seg(t, 17.1, 18.45)));
      const l = gxy(LONDON, 960, 560, R, lon0, lat0), sy = gxy(SYDNEY, 960, 560, R, lon0, lat0);
      let s = L(0, space(t)) + L(1, globe(960, 560, R, lon0, lat0) + `<path d="${a.d}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${a.d}" stroke="${TPC}" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="26 16"/>` +
        (l[2] > 0 ? pin(l[0], l[1], .9, '#3D8BFF', 'LONDON', -1) : '') + (sy[2] > 0 && t > 17.6 ? pin(sy[0], sy[1], .9, '#FF8A3D', 'SYDNEY', 1) : '') +
        (a.last && t < 18.5 ? `<circle cx="${a.last[0]}" cy="${a.last[1]}" r="18" fill="#fff"/><circle cx="${a.last[0]}" cy="${a.last[1]}" r="40" fill="url(#tpGlow)"/>` : '') + popFX(t, 18.48, sy[0], sy[1], .5));
      return s + tag(t, 17.9, 960, 110, 'THE OTHER SIDE OF THE WORLD', '#5CF2FF', 58); } },
  // 10 "Face down in Sydney." legs up, the gull perched on a trainer
  { t: 19.3, ref: RR, cam: push(19.3, 22.0, { x: SX + 60, y: GY - 300, z: 1.45, r: -3 }, { x: SX + 60, y: GY - 290, z: 1.7, r: -1 }, 'io'), draw: (t, c, L) => {
      const st = dexStuck(t, SX, SAND, { legL: [-28, 30], legR: [30, -30] });
      return beachW(t, L, 'b4') + L(1, st + gull(SX + 30, GY - 214, .7, t, { tilt: Math.sin(t*2)*14 })) + tag(t, 19.5, 960, 130, 'FACE DOWN IN SYDNEY', '#FF8A3D', 60) + bang(t, 20.6, 1450, 330, 'mmf!', '#fff', 80, 8); } },
  // 11 "best superpower ever": hero low angle on the beach
  { t: 22.0, ref: RR, cam: push(22.0, 24.2, { x: SX + 40, y: GY - 250, z: 1.55, r: -5 }, { x: SX + 40, y: GY - 260, z: 1.8, r: -2 }, 'o'), draw: (t, c, L) => {
      const K = [[0, 'idle'], [22.15, 'crouchPop', 'snap'], [22.4, 'cheer', 'o'], [23.3, { ...POSES.confident, eyes: 'happy' }, 'o']];
      return beachW(t, L, 'b8') + L(1, dex(K, t, SX + 40, GY, { sparkle: true }) + (t > 22.4 ? sparkles(SX + 40, GY - 260, t, 6, 260) : '')) + tag(t, 22.5, 960, 130, 'BEST SUPERPOWER EVER?', '#7ED957', 64); } },
  // 12 No traffic
  { t: 24.2, ref: RR, cam: push(24.2, 25.15, { x: 0, y: GY - 300, z: 1.12, r: 2 }, { x: 40, y: GY - 300, z: 1.18, r: 2 }, 'lin'), draw: (t, c, L) => {
      const A = 24.32, B = 24.72, C = 24.82;
      return streetJam(t, L) + L(1, tpWrap(t, dex([[0, { ...POSES.smile, armF: [90, 20] }]], t, -700, GY + 60), -700, GY - 90, A, B) + tpWrap(t, dex([[C, 'landSquash'], [C + .15, { ...POSES.peace }, 'o2']], t, 720, GY + 60), 720, GY - 90, C) +
        popFX(t, A, -700, GY - 90, .6) + popFX(t, B, -700, GY - 90, .5, 'out') + popFX(t, C, 720, GY - 90, .6)) + tag(t, 24.3, 960, 130, 'NO TRAFFIC ✓', '#7ED957', 66); } },
  // 13 No queues
  { t: 25.15, ref: RR, cam: push(25.15, 26.1, { x: 300, y: GY - 360, z: 1.05, r: -2 }, { x: 320, y: GY - 360, z: 1.1, r: -2 }, 'lin'), draw: (t, c, L) => {
      const A = 25.25; let q = '';
      [[-700, 0], [-380, 1], [-60, 2], [260, 3]].forEach(([x, i]) => q += person(i, [[0, 'idle'], [A + .15 + i*.04, { ...POSES.surprise, look: [9, 0] }, 'snap']], t, x, GY - 20));
      return cafe(t, L) + L(1, q + tpWrap(t, dex([[0, 'landSquash'], [A + .15, { ...POSES.smile, armF: [96, -6], handF: 'fist' }, 'o2']], t, 590, GY - 20), 590, GY - 170, A) + popFX(t, A, 590, GY - 170, .6)) + tag(t, 25.25, 960, 130, 'NO QUEUES ✓', '#7ED957', 66); } },
  // 14 No school run
  { t: 26.1, ref: RR, cam: push(26.1, 27.75, { x: 0, y: GY - 400, z: 1.08, r: 2 }, { x: 0, y: GY - 380, z: 1.2, r: 0 }, 'lin'), draw: (t, c, L) => {
      const A = 26.25;
      return schoolW(t, L) + L(1, tpWrap(t, dex([[0, 'landSquash'], [A + .15, 'peace', 'o2'], [27.0, { ...POSES.smile }, 'o']], t, 0, GY - 140), 0, GY - 290, A) + popFX(t, A, 0, GY - 290, .7)) + tag(t, 26.2, 960, 980, 'NO SCHOOL RUN ✓', '#7ED957', 66); } },
  // 15 "But real physics has some very bad news." colour drains, push to the face
  { t: 27.75, ref: RR, cam: push(27.75, 30.3, { x: 0, y: GY - 300, z: 1.7, r: 0 }, { x: 0, y: GY - 270, z: 2.9, r: 5 }, 'in'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.peace }], [27.9, { ...POSES.peace, eyes: 'wide', mouth: 'flat' }, 'snap'], [28.8, { ...POSES.gulp }, 'o'], [29.4, { ...POSES.worried, eyes: 'wide' }, 'o']];
      const g = seg(t, 27.85, 28.3);
      let doodles = ''; ['v = d / t', 'p = mv', 'F = ma', 'dB', 'O₂', 'km/h'].forEach((f, i) => { const a = i*1.05 + t*.5; doodles += `<text x="${Math.cos(a)*420}" y="${GY - 300 + Math.sin(a)*190}" text-anchor="middle" font-family="Lilita One" font-size="48" fill="#FF8C8C" opacity="${seg(t, 28.2 + i*.15, 28.6 + i*.15)*.85}">${f}</text>`; });
      return L(0, studioBack(t, '#3A1F3F', '#24122A', '#4A2A50')) + L(1, studioFloor('#1E0F24') + doodles + dex(K, t, 0, GY)) + `<rect width="1920" height="1080" fill="#000" opacity="${.25*g}"/>` +
        (t > 29.3 ? `<g transform="translate(1440,300) rotate(-10) scale(${pop(t, 29.3, .25)})"><rect x="-250" y="-90" width="500" height="180" rx="24" fill="none" stroke="#E8463C" stroke-width="16"/>${txt('BAD NEWS', 0, 40, 100, '#E8463C')}</g>` : '') + flash(t, 29.3, '#E8463C', .2, .35); } },
  // 16 title card
  { t: 30.3, ref: RR, cam: push(30.3, END, { x: 0, y: 540, z: 1, r: 0 }, { x: 0, y: 540, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      const TT = 30.3, A1 = TT + .25, B1 = TT + 1.25, A2 = TT + 1.38, B2 = TT + 2.2, A3 = TT + 2.33;
      const d1 = tpWrap(t, chibi2(dexAt([[0, 'landSquash'], [A1 + .15, 'cheer', 'o2']], t, () => ({ x: -620, y: 1040 }), { s: 1.1, seed: 8 })), -620, 875, A1, B1);
      const d2 = tpWrap(t, chibi2(dexAt([[0, 'landSquash'], [A2 + .15, { ...POSES.smile, armF: [96, -6] }, 'o2']], t, () => ({ x: 640, y: 1040 }), { s: 1.1, seed: 8 })), 640, 875, A2, B2);
      const d3 = tpWrap(t, chibi2(dexAt([[0, 'landSquash'], [A3 + .2, 'peace', 'o2']], t, () => ({ x: -640, y: 1040 }), { s: 1.15, seed: 8 })), -640, 870, A3);
      return L(0, studioBack(t)) + L(1, d1 + d2 + d3 + popFX(t, A1, -620, 875, .8) + popFX(t, B1, -620, 875, .6, 'out') + popFX(t, A2, 640, 875, .8) + popFX(t, B2, 640, 875, .6, 'out') + popFX(t, A3, -640, 870, .9)) +
        title(t, TT, 960, 330, 'WHAT IF YOU WOKE UP WITH', '#FFFFFF', 86) + title(t, TT + .35, 960, 510, 'TELEPORTATION?', '#5CF2FF', 170) + chipAt(t, TT + .8, 960, 700, 'DAY 3', '#3D8BFF', 64) + flash(t, TT, '#fff', .3, .6) + (t > A3 + .4 ? sparkles(1550, 650, t, 5, 110) : ''); } },
];
const SHAKES_O = [[HIT, 26, .55], [PULL, 8, .3], [13.1, 6, .25], [13.25, 8, .3], [16.82, 10, .3], [24.32, 5, .2], [25.25, 5, .2], [26.25, 6, .2], [27.9, 10, .4]];
function scene(t) { return EP3DEFS + playShots(t, SHOTS_O, SHAKES_O) + vignette(); }
