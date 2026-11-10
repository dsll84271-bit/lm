// RIG2
// Ep4 cold open. ST=[5.5, 10.97, 18.07, 28.88, 33.8]  END 44.5
// o1 "Every morning…superpower" 10.97-13.88 | "Today," 14.37 | "it's invisibility" 14.85-16.07
// o2 "The power seems to cover…arrived" 18.07-21.27 | "Luckily," 21.77 | "that's his favourite hoodie" 22.52-23.67 | "Anything he picks up…visible" 24.2-26.48
// o3 "Sneak anywhere" 28.88-29.72 | "Skip every queue" | "Never get caught" | "It sounds perfect" -33.0
const MX = 1180;                                   // where he stands in front of the wardrobe mirror
const SLX = t => lerp(BED + 330, MX, E.io(seg(t, 2.55, 4.6)));     // slippers walking from the bed to the mirror
function bedSet(t, L, c, blur='', o={}) { return bedroom(t, L, c, blur) + L(1, `<g transform="translate(${MX},${GY - 140})"><rect x="-170" y="-720" width="340" height="700" rx="16" fill="#C08A55" stroke="${INK}" stroke-width="7"/><rect x="-140" y="-690" width="280" height="640" rx="10" fill="#BFE6FF" stroke="${INK}" stroke-width="5"/><path d="M-110,-150 L60,-660 M-60,-80 L110,-600" stroke="#fff" stroke-width="22" opacity=".45"/></g>`, blur); }
function cinema(t, L) { let s = roomW(t, { wall: '#3A1F3F', stripe: '#4A2A50', floor: '#7A2E3A' }) + `<g transform="translate(500,${GY - 140})"><rect x="-300" y="-300" width="600" height="300" rx="14" fill="#8A3B4A" stroke="${INK}" stroke-width="7"/><rect x="-200" y="-700" width="400" height="140" rx="16" fill="#1F2033" stroke="${INK}" stroke-width="6"/>${txt('TICKETS', 0, -610, 70, '#FFD23F')}</g>`;
  for (const x of [-600, -300]) s += `<g transform="translate(${x},${GY - 140})"><rect x="-10" y="-200" width="20" height="200" fill="#FFD23F" stroke="${INK}" stroke-width="5"/><circle cy="-210" r="18" fill="#FFD23F" stroke="${INK}" stroke-width="5"/></g>`;
  s += `<path d="M-600,${GY - 320} Q-450,${GY - 240} -300,${GY - 320}" stroke="#E8463C" stroke-width="18" fill="none"/>`;
  return L(1, s); }
const SHOTS_O = [
  // 0 the alarm switches itself off
  { t: 0, ref: RR, cam: push(0, 1.5, { x: 330, y: GY - 300, z: 3.0, r: 4 }, { x: 330, y: GY - 300, z: 3.3, r: 3 }, 'lin'), draw: (t, c, L) => {
      const dip = t > 1.05 && t < 1.3 ? 1 : 0;
      return bedSet(t, L, c, 'b8') + L(1, `<g transform="translate(0,${dip*10})">${alarm(t, 330, GY - 318, 1.2, 1.1)}</g>` + (dip ? `<rect x="315" y="${GY - 395}" width="30" height="14" rx="5" fill="#888"/>` : '')) + bang(t, .2, 1350, 330, 'RING!', '#E8463C', 120, 10, 1.1) + bang(t, 1.12, 1350, 330, 'click.', '#fff', 70, -4, 1.5); } },
  // 1 the duvet folds back by itself; slippers start to walk
  { t: 1.5, ref: RR, cam: push(1.5, 3.25, { x: -150, y: GY - 360, z: 1.35, r: 0 }, { x: 0, y: GY - 360, z: 1.4, r: 0 }, 'lin'), draw: (t, c, L) => {
      const up = E.io(seg(t, 1.6, 2.2));
      return bedSet(t, L, c) + L(1, cover(t, up) + (t < 2.45 ? `<ellipse cx="${BED + 130}" cy="${GY - 196}" rx="70" ry="${16 - 10*seg(t, 2.3, 2.45)}" fill="#E6DCCB" opacity=".9"/>` : '') + slippers(t, SLX(t), GY - 70, 1.1, t > 2.55, 2.55) + alarm(t, 330, GY - 318, .9, 0)) +
        (t > 2.3 ? `<g transform="translate(1450,320) scale(${pop(t, 2.3, .3)})">${txt('?', 0, 0, 130, '#fff')}</g>` : ''); } },
  // 2 mirror POV: slippers arrive... nothing above them. Then black.
  { t: 3.25, ref: RR, cam: hold(3.25, { x: 0, y: 540, z: 1 }), draw: (t, c, L) => {
      const cm = { x: 100, y: GY - 380, z: 1.2 }, Lm = (p, svg, f='') => `<g transform="${layerTR({ ...cm, z: cm.z + seg(t, 3.25, 4.6)*.06 }, p, RR)}"${f ? ` filter="url(#${f})"` : ''}>${svg}</g>`;
      const room = `<g transform="translate(1920,0) scale(-1,1)">${bedroom(t, Lm, cm, 'b2') + Lm(1, cover(t, 1))}</g>`;
      const sx = lerp(1500, 960, E.io(seg(t, 3.25, 4.2)));
      let s = mirrorPOV(t, room + slippers(t, sx, 1000, 1.6, t < 4.2, 3.25, 1.1));
      const blk = seg(t, 4.55, 4.7); if (blk > 0) s += `<rect width="1920" height="1080" fill="#000" opacity="${blk}"/>`;
      return s; } },
  // 3 black: he can't see anything either
  { t: 4.7, ref: RR, cam: hold(4.7, { x: 0, y: 540, z: 1 }), draw: (t, c, L) => {
      let s = `<rect width="1920" height="1080" fill="#000"/>`;
      if (t > 6.6) s += `<g transform="translate(860,560) scale(${pop(t, 6.6, .3)})" opacity=".85">${txt('?', 0, 0, 110, '#fff')}</g>`;
      if (t > 7.4) s += `<g transform="translate(1060,520) scale(${pop(t, 7.4, .3)})" opacity=".85">${txt('?', 0, 0, 90, '#fff')}</g>`;
      if (t > 9.6) s += `<g transform="translate(960,860)" opacity="${seg(t, 9.6, 10)}">${txt('*bonk*', 0, 0, 50, '#888')}</g>`;
      return s; } },
  // 4 every morning a new power... today: invisibility
  { t: 10.85, ref: RR, cam: push(10.85, 18.0, { x: 500, y: GY - 400, z: 1.12, r: 0 }, { x: 620, y: GY - 420, z: 1.25, r: 0 }, 'lin'), draw: (t, c, L) => {
      const sh = seg(t, 12.0, 12.8);
      let s = bedSet(t, L, c) + L(1, cover(t, 1) + slippers(t, MX - 160, GY - 70, 1.1, false) + (sh > 0 && sh < 1 ? `<rect x="${MX - 420 + sh*300}" y="${GY - 700}" width="70" height="700" fill="#fff" opacity=".55" transform="skewX(-20)" filter="url(#b4)"/>` : '') + (t > 12.6 ? sparkles(MX - 160, GY - 420, t, 6, 170) : ''));
      s += tag(t, 11.2, 700, 130, 'NEW POWER EVERY DAY', '#7ED957', 56) + tag(t, 11.7, 700, 230, 'DAY 4', '#3D8BFF', 54);
      if (t > 14.85) { const k = pop(t, 14.85, .35), fl = .55 + .45*Math.sin(t*9); s += `<g transform="translate(960,560) scale(${k})" opacity="${fl}"><text x="0" y="40" text-anchor="middle" font-family="Lilita One" font-size="190" fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="14" stroke-opacity=".5" paint-order="stroke">INVISIBILITY</text><text x="0" y="40" text-anchor="middle" font-family="Lilita One" font-size="190" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="24 10">INVISIBILITY</text></g>`; }
      return s; } },
  // 5 the power covers what he had on (hoodie); anything picked up after stays visible (toothbrush)
  { t: 18.0, ref: RR, cam: push(18.0, 28.85, { x: 330, y: GY - 360, z: 1.5, r: 0 }, { x: 250, y: GY - 360, z: 1.62, r: 2 }, 'lin'), draw: (t, c, L) => {
      const DX = 60, hk = seg(t, 22.5, 22.9) - seg(t, 23.7, 24.1);
      const o = { ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), x: DX, y: GY, s: DS, t, noShadow: true, blink: 0, hoodTip: 0 };
      let ghost = `<g opacity="${.85 + .15*Math.sin(t*4)}">${dexGhost(DX, GY)}</g>`;
      if (hk > 0) ghost += `<g opacity="${hk*.85}">${chibi2(o)}</g>`;
      const lift = E.o(seg(t, 24.3, 24.9)), bx = lerp(330, DX + 60, lift), by = lerp(GY - 270, GY - 255*DS + 30, lift), brush = t > 25.1 ? Math.sin(t*22)*10 : 0;
      const tb = toothbrush(bx + brush, by, .9, lerp(0, -75, lift), seg(t, 25.3, 26.0), t);
      return bedSet(t, L, c, 'b2') + L(1, ghost + slippers(t, DX, GY - 6, 1.05, false) + tb + (t > 25.6 ? `<g transform="translate(${DX - 280},${GY - 440})">${txt('scrub scrub', 0, 0, 48, '#fff')}</g>` : '')) +
        tag(t, 18.3, 1400, 160, 'WHAT HE HAD ON: INVISIBLE', '#5CF2FF', 46) + (t > 22.6 ? `<g transform="translate(1400,270) scale(${pop(t, 22.6, .3)})">${chip('FAVOURITE HOODIE ✓', 0, 0, '#FFC21F', 48)}</g>` : '') + tag(t, 24.3, 1400, 940, 'PICKED UP LATER: VISIBLE', '#E8463C', 46); } },
  // 6 montage: sneak anywhere / skip every queue / never get caught
  { t: 28.85, ref: RR, cam: t => { const i = t < 30.05 ? 0 : t < 31.1 ? 1 : 2; return [{ x: 0, y: GY - 380, z: 1.08 + (t - 28.85)*.05, r: -2 }, { x: 200, y: GY - 380, z: 1.08 + (t - 30.05)*.05, r: 2 }, { x: 0, y: GY - 260, z: 1.7 + (t - 31.1)*.06, r: -3 }][i]; }, draw: (t, c, L) => {
      const i = t < 30.05 ? 0 : t < 31.1 ? 1 : 2; let s;
      if (i === 0) { const x = lerp(-1100, 300, seg(t, 28.85, 30.05)); s = cinema(t, L) + L(1, slippers(t, x, GY - 60, 1.05, true, 28.85, 1.3) + popcorn(x + 50, GY - 330 + Math.sin(t*10)*5, 1.1, t)) + tag(t, 28.95, 960, 130, 'SNEAK ANYWHERE', '#B07CFF', 58); }
      if (i === 1) { let q = ''; [[-700, 0], [-400, 1], [-100, 2], [200, 4]].forEach(([x, k]) => q += person(k, [[0, 'idle'], [30.5, { ...POSES.surprise, look: [9, 0] }, 'snap']], t, x, GY - 20));
        const sx = lerp(-1200, 560, E.io(seg(t, 30.1, 30.9))); s = cafe4(t, L) + L(1, q + slippers(t, sx, GY - 40, 1.0, t < 30.9, 30.1, 1.6)) + tag(t, 30.1, 960, 130, 'SKIP EVERY QUEUE', '#7ED957', 58); }
      if (i === 2) { const op = E.io(seg(t, 31.3, 31.7)), bx = lerp(0, 120, seg(t, 31.8, 32.6)), by = lerp(GY - 220, GY - 420, E.o(seg(t, 31.8, 32.6)));
        s = kitchen(t, L, 'b4') + L(1, `<rect x="-600" y="${GY - 190}" width="1200" height="60" fill="#E9E1D3" stroke="${INK}" stroke-width="6"/>` + biscuitTin(0, GY - 190, 1.2, op) + (t > 31.8 ? biscuit(bx, by, 1.2, t*90) : '')) + tag(t, 31.15, 960, 130, 'NEVER GET CAUGHT', '#E8463C', 58) + (t > 32.3 ? sparkles(1300, 400, t, 5, 160) : ''); }
      return s + flash(t, [28.85, 30.05, 31.1][i], '#fff', .15, .5); } },
  // 7 bad news: an invisible person should be blind
  { t: 33.7, ref: GC, cam: push(33.7, 39.9, { x: 960, y: 540, z: 1.0, r: 0 }, { x: 960, y: 540, z: 1.25, r: 3 }, 'in'), draw: (t, c, L) => {
      const g = seg(t, 33.8, 34.4);
      return L(0, studioBack(t, '#3A1F3F', '#24122A', '#4A2A50')) + L(1, eyeIcon(960, 560, 1.3, t, seg(t, 38.2, 38.7))) + `<rect width="1920" height="1080" fill="#000" opacity="${.2*g}"/>` + tag(t, 34.0, 960, 120, 'BAD NEWS', '#E8463C', 60) +
        (t > 38.6 ? `<g transform="translate(1480,860) rotate(-8) scale(${pop(t, 38.6, .25)})"><rect x="-230" y="-80" width="460" height="160" rx="22" fill="none" stroke="#E8463C" stroke-width="14"/>${txt('BLIND?!', 0, 34, 100, '#E8463C')}</g>` : ''); } },
  // 8 title card
  { t: 39.9, ref: RR, cam: push(39.9, END, { x: 0, y: 540, z: 1, r: 0 }, { x: 0, y: 540, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      const TT = 39.9, fl = .6 + .4*Math.sin(t*8), x = lerp(-1200, 1200, seg(t, TT, END));
      return L(0, studioBack(t)) + L(1, slippers(t, x, 1000, 1.3, true, TT, 1.2)) + title(t, TT, 960, 330, 'WHAT IF YOU WOKE UP', '#FFFFFF', 96) +
        (t > TT + .35 ? `<g transform="translate(960,520) scale(${pop(t, TT + .35, .35)})" opacity="${fl}"><text x="0" y="60" text-anchor="middle" font-family="Lilita One" font-size="200" fill="#5CF2FF" fill-opacity=".45" stroke="${INK}" stroke-width="16" stroke-opacity=".6" paint-order="stroke">INVISIBLE?</text><text x="0" y="60" text-anchor="middle" font-family="Lilita One" font-size="200" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="26 12">INVISIBLE?</text></g>` : '') + chipAt(t, TT + .8, 960, 740, 'DAY 4', '#3D8BFF', 64) + flash(t, TT, '#fff', .3, .6); } },
];
function cafe4(t, L) { let s = roomW(t, { wall: '#CDEBDD', stripe: '#BFE3D2', floor: '#B98E66' });
  s += `<g transform="translate(900,${GY - 140})"><rect x="-260" y="-260" width="520" height="260" rx="14" fill="#8A5A3B" stroke="${INK}" stroke-width="7"/><rect x="-280" y="-290" width="560" height="40" rx="10" fill="#C99A68" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-620" width="400" height="140" rx="16" fill="#1F2033" stroke="${INK}" stroke-width="6"/>${txt('COFFEE', 0, -530, 72, '#FFC21F')}</g>`;
  return L(1, s); }
const SHAKES_O = [[1.12, 4, .2], [4.55, 6, .2], [9.6, 6, .3], [38.6, 10, .4]];
function scene(t) { return EP3DEFS + EP4DEFS + playShots(t, SHOTS_O, SHAKES_O) + vignette(); }
