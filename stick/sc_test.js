// "What Would Actually Happen If Dinosaurs Came Back Today?"  75-second test: hook + hour 1 (the first catch).
// Narration starts (s) per line in tts/lines.py; durations in tts/dur.json.
const L = [0.2, 2.7, 6.4, 11.9, 14.8, 16.6, 25.0, 29.3, 33.6, 38.6, 45.1, 49.3, 52.1, 57.8, 64.7];
const END = 75.0, GND = 900;
const ROAR = 31.8, CRACK = 44.4, DINO_HIT = 10.7, SNEEZE = 67.6;
// ---------------------------------------------------------------- sets
const bg = (col=PAPER) => `<rect x="-6000" y="-6000" width="12000" height="12000" fill="${col}"/>`;
function street(t, x0=-2400, x1=3600) {
  let s = `<rect x="-6000" y="${GND}" width="12000" height="900" fill="${GREY}"/><path d="M-6000,${GND} L6000,${GND}" stroke="${INK}" stroke-width="${LW}"/><path d="M-6000,${GND + 90} L6000,${GND + 90}" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -6000; x < 6000; x += 260) s += `<rect x="${x}" y="${GND + 170}" width="130" height="14" fill="${WHITE}" stroke="${INK}" stroke-width="3"/>`;
  const signs = ['BAKERY', 'CHEMIST', 'BOOKS', 'CAFÉ', 'BANK', 'FISH & CHIPS', 'NEWSAGENT', 'BARBER'];
  for (let i = 0; i < 12; i++) { const bx = x0 + i*520, h = 520 + (i*97 % 220); s += building(bx, GND, 480, h, signs[i % signs.length], i % 5 === 3); }
  return s;
}
function square(t) {
  let s = `<rect x="-6000" y="${GND}" width="12000" height="900" fill="${GREY}"/><path d="M-6000,${GND} L6000,${GND}" stroke="${INK}" stroke-width="${LW}"/>`;
  for (let i = -8; i < 12; i++) s += `<path d="M${i*300},${GND} L${i*300 - 200},${GND + 900}" stroke="${INK}" stroke-width="3" opacity=".35"/>`;
  s += `<g transform="translate(1500,${GND})"><rect x="-420" y="-560" width="840" height="560" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}"/><path d="M-460,-560 L0,-760 L460,-560 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/>` +
    [-300, -150, 0, 150, 300].map(x => `<rect x="${x - 34}" y="-420" width="68" height="330" fill="${GREY}" stroke="${INK}" stroke-width="6"/>`).join('') + `<rect x="-120" y="-1060" width="240" height="320" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}"/><circle cx="0" cy="-930" r="80" fill="${WHITE}" stroke="${INK}" stroke-width="9"/><path d="M0,-930 L0,-990 M0,-930 L${Math.cos(t*.5)*44},${-930 + Math.sin(t*.5)*44}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><text y="-600" text-anchor="middle" font-family="Bebas Neue" font-size="64">TOWN HALL</text></g>`;
  s += phoneBox(-560, GND) + tree(-900, GND, 1.1) + tree(2400, GND, 1.2) + trafficLight(380, GND, Math.floor(t*1.2) % 3);
  return s;
}
function carPark(t) {
  let s = `<rect x="-6000" y="${GND}" width="12000" height="900" fill="${GREY}"/><path d="M-6000,${GND} L6000,${GND}" stroke="${INK}" stroke-width="${LW}"/>`;
  for (let i = -6; i < 10; i++) s += `<path d="M${i*340},${GND + 30} L${i*340 - 80},${GND + 300}" stroke="${WHITE}" stroke-width="12"/>`;
  s += `<g transform="translate(1600,${GND})"><rect x="-10" y="-420" width="20" height="420" fill="${INK}"/><rect x="-120" y="-560" width="240" height="160" fill="${ACC}" stroke="${INK}" stroke-width="8"/><text y="-450" text-anchor="middle" font-family="Bebas Neue" font-size="130" fill="${WHITE}">P</text></g>`;
  return s;
}
// ---------------------------------------------------------------- characters
const you = (keys, t, x, y, s=1, extra={}) => stick({ ...poseAt(keys, t), x, y, s, ...extra });
const rexAt = (t, o) => trex({ t, blink: blinkT(t), ...o });
function blinkT(t) { const p = (t*.37) % 1; return p > .96 ? 1 : 0; }
function germs(t, cx, cy, R, n=26, sc=1) { let s = ''; for (let i = 0; i < n; i++) { const a = i*2.4 + t*(.3 + (i%3)*.1), r = R*(.35 + .65*hash(i)); s += germ(cx + Math.cos(a)*r, cy + Math.sin(a)*r*.6, (10 + 8*hash(i + 3))*sc, t, i); } return s; }
// ---------------------------------------------------------------- shots
const SHOTS = [
  // 1. an eye opens
  { t: 0, cam: [[0, { x: 960, y: 540, z: 1 }]], draw: (t, c, W) => {
      const op = E.snap(seg(t, .35, .7));
      return bg(INK) + `<g transform="translate(960,540) scale(${3.4 + t*.3})"><ellipse rx="${170}" ry="${100*op}" fill="${PAPER}" stroke="${PAPER}" stroke-width="6"/><circle r="${70*op}" fill="${ACC}"/><ellipse rx="${16*op}" ry="${62*op}" fill="${INK}"/><circle cx="-24" cy="-26" r="${12*op}" fill="${WHITE}"/></g>` +
        `<path d="M0,${540 - 600*op} L1920,${540 - 600*op} L1920,0 L0,0 Z M0,${540 + 600*op} L1920,${540 + 600*op} L1920,1080 L0,1080 Z" fill="${INK}"/>`; } },
  // 2. the line-up: every dinosaur is back
  { t: 1.3, cam: push2(1.3, 2.6, { x: 960, y: 560, z: 1.0 }, { x: 960, y: 560, z: 1.08 }), draw: (t, c, W) => {
      const p = i => E.o(seg(t, 1.35 + i*.12, 1.7 + i*.12));
      return bg() + W(`<path d="M-2000,${GND - 60} L4000,${GND - 60}" stroke="${INK}" stroke-width="${LW}"/>` +
        `<g transform="translate(230,${GND - 60}) scale(${p(0)})">${trike(0, 0, 1.0)}</g><g transform="translate(700,${GND - 60}) scale(${p(1)})">${sauropod(0, 0, .75, t)}</g><g transform="translate(1200,${GND - 60}) scale(${p(2)})">${stego(0, 0, .95)}</g><g transform="translate(1640,${GND - 60}) scale(${p(3)})">${trex({ x: 0, y: 0, s: .55, t })}</g>`) +
        head(t, 1.5, 960, 260, 'EVERY DINOSAUR. BACK.', 150) + head(t, 2.1, 960, 380, 'HERE. TODAY.', 110, WHITE, ACC); } },
  // 3. high street: head over the bus
  { t: 2.6, cam: push2(2.6, 4.4, { x: 820, y: 560, z: .72 }, { x: 860, y: 580, z: .82 }), draw: (t, c, W) => {
      const rx = lerp(1700, 1500, seg(t, 2.6, 4.4));
      return bg() + W(street(t) + rexAt(t, { x: rx, y: GND + 60, s: .95, ph: t*.4, walk: .5, head: 6 }) + bus(820, GND + 60, 1.25, t, false, 1.2) +
        you([[0, 'shock']], t, 300, GND + 60, .9) + you([[0, 'scream']], t, 80, GND + 60, .9, { flip: true }) + exclaim(330, GND - 290, 1.3)) + tag(t, 2.8, 960, 120, 'A T. REX ON THE HIGH STREET', INK, WHITE, 46); } },
  // 4. car park: a sauropod neck rises
  { t: 4.4, cam: push2(4.4, 6.3, { x: 900, y: 420, z: .62 }, { x: 900, y: 380, z: .66 }), draw: (t, c, W) => {
      const rise = E.o(seg(t, 4.5, 5.3));
      return bg() + W(carPark(t) + `<g transform="translate(0,${(1 - rise)*500})">${sauropod(700, GND + 40, 1.4, t, false, 10*Math.sin(t*2))}</g>` + car(200, GND + 40, 1.1) + car(1300, GND + 40, 1.1, true) + car(1750, GND + 40, 1.1) +
        you([[4.4, 'carry'], [5.4, 'shock', 'snap']], t, 1080, GND + 40, .95, { flip: true })) + tag(t, 4.6, 960, 120, 'SAUROPODS IN THE CAR PARK', INK, WHITE, 46); } },
  // 5. you, cowering
  { t: 6.3, cam: push2(6.3, 8.7, { x: 960, y: 700, z: 1.2 }, { x: 960, y: 660, z: 1.6 }, 'in'), draw: (t, c, W) => {
      const tr = Math.sin(t*60)*2;
      return bg() + W(`<path d="M-2000,${GND} L4000,${GND}" stroke="${INK}" stroke-width="${LW}"/>` + you([[6.3, 'shock'], [7.0, 'cower', 'snap']], t, 960 + tr, GND, 1.1) + sweat(1050, GND - 300, 1.4)) + head(t, 6.6, 960, 200, 'WE’RE IN TROUBLE…', 130); } },
  // 6. twist: the dinosaur is the one in danger
  { t: 8.7, cam: [[8.7, { x: 1100, y: 620, z: 1.4 }], [10.6, { x: 1250, y: 560, z: .75 }, 'io'], [11.5, { x: 1250, y: 560, z: .8 }]], draw: (t, c, W) => {
      let f = bg() + W(`<path d="M-2000,${GND} L5000,${GND}" stroke="${INK}" stroke-width="${LW}"/>` + you([[0, 'cower'], [9.8, 'think', 'o']], t, 700, GND, 1.1) +
        rexAt(t, { x: 1500, y: GND, s: .9, head: -8, shiver: t > 9.6 ? 1 : 0, eye: [-4, 4] }) + (t > 9.6 ? sweat(1960, GND - 520, 2) + germs(t, 1700, GND - 400, 520, 30) : '')) +
        '';
      return impactFrame(f, t, DINO_HIT) + (t > DINO_HIT && t < DINO_HIT + .2 ? focusLines(t, 960, 540, .9, 420) : '') + head(t, DINO_HIT, 960, 230, 'THE DINOSAURS.', 190, WHITE, ACC, -3); } },
  // 7. title card
  { t: 11.5, cam: push2(11.5, 14.6, { x: 960, y: 560, z: 1.0 }, { x: 960, y: 560, z: 1.1 }), draw: (t, c, W) =>
      bg() + W(`<path d="M-2000,860 L4000,860" stroke="${INK}" stroke-width="${LW}"/>` + rexAt(t, { x: lerp(-500, 2400, seg(t, 11.5, 14.6)), y: 860, s: .45, ph: t*.9, walk: 1 }) + you([[0, idle(t)]], t, 1500, 860, .5, { flip: true })) +
      head(t, 11.7, 960, 300, 'WHAT WOULD ACTUALLY HAPPEN IF', 104) + head(t, 12.0, 960, 470, 'DINOSAURS CAME BACK TODAY?', 150, WHITE, ACC) },
  // 8. HOUR 1
  { t: 14.6, cam: push2(14.6, 16.5, { x: 960, y: 540, z: 1.0 }, { x: 960, y: 540, z: 1.12 }), draw: (t, c, W) => {
      const a = (t - 14.6)*900;
      return bg(INK) + W(`<circle cx="620" cy="540" r="190" fill="${PAPER}" stroke="${PAPER}" stroke-width="10"/><circle cx="620" cy="540" r="160" fill="${INK}"/>${[...Array(12)].map((_, i) => `<path d="M${620 + Math.cos(i*.524)*130},${540 + Math.sin(i*.524)*130} L${620 + Math.cos(i*.524)*150},${540 + Math.sin(i*.524)*150}" stroke="${PAPER}" stroke-width="8"/>`).join('')}<path d="M620,540 L${620 + Math.cos(rad(a - 90))*120},${540 + Math.sin(rad(a - 90))*120}" stroke="${ACC}" stroke-width="16" stroke-linecap="round"/><path d="M620,540 L${620 + Math.cos(rad(a/12 - 90))*80},${540 + Math.sin(rad(a/12 - 90))*80}" stroke="${PAPER}" stroke-width="16" stroke-linecap="round"/>`) +
        `<g transform="translate(1180,620) scale(${pop(t, 14.8, .3)})"><text text-anchor="middle" font-family="Bebas Neue" font-size="340" fill="${PAPER}">HOUR 1</text></g><rect x="880" y="660" width="${600*E.io(seg(t, 15.0, 15.6))}" height="18" fill="${ACC}"/>`; } },
  // 9. the T. rex wakes up in a town centre
  { t: 16.5, cam: push2(16.5, 19.6, { x: 1100, y: 420, z: .5 }, { x: 1000, y: 520, z: .62 }), draw: (t, c, W) => {
      const wake = seg(t, 17.6, 18.4);
      return bg() + W(square(t) + rexAt(t, { x: 600, y: GND + 30, s: 1.1, head: lerp(-26, 4, E.o(wake)), blink: wake < .1 ? 1 : blinkT(t), eye: [6, 0] }) + you([[0, 'shock']], t, 2000, GND + 30, .95, { flip: true }) + you([[0, 'film']], t, 2250, GND + 30, .95, { flip: true, prop: (h) => phone(h[0] + 10, h[1] - 10, 0) })) +
        tag(t, 16.8, 960, 120, 'A BRITISH TOWN CENTRE', INK, WHITE, 46); } },
  // 10. scale: next to a double-decker
  { t: 19.6, cam: push2(19.6, 22.6, { x: 900, y: 560, z: .62 }, { x: 920, y: 560, z: .68 }), draw: (t, c, W) => {
      const k1 = E.io(seg(t, 19.8, 20.6));
      return bg() + W(street(t, -1400) + bus(1500, GND + 40, 1.3, t, false, 1.18) + rexAt(t, { x: 420, y: GND + 40, s: .8, eye: [6, 0] }) +
        `<g opacity="${k1}"><path d="M${-150},${GND - 520} L${-150 + 1040*k1},${GND - 520}" stroke="${ACC}" stroke-width="10"/><path d="M-150,${GND - 545} l0,50 M${-150 + 1040*k1},${GND - 545} l0,50" stroke="${ACC}" stroke-width="10"/></g>`) +
        tag(t, 20.0, 760, 150, '≈ 12 METRES LONG', ACC, WHITE, 54) + tag(t, 21.3, 760, 260, '≈ 8 TONNES', INK, WHITE, 54); } },
  // 11. very, very confused
  { t: 22.6, cam: push2(22.6, 24.9, { x: 980, y: 520, z: 1.3 }, { x: 1000, y: 520, z: 1.45 }), draw: (t, c, W) => {
      const tilt = Math.sin((t - 22.6)*3)*14;
      return bg() + W(trafficLight(1300, GND + 300, Math.floor(t*2) % 3, 1.1) + rexAt(t, { x: 600, y: GND + 300, s: 1.2, head: tilt, eye: [8, -4] }) + (t > 23.2 ? qmark(1150, 260, 1.3) : '') + (t > 23.8 ? qmark(1240, 200, 1) : '')); } },
  // 12. people scream
  { t: 24.9, cam: t => ({ x: 900 + (t - 24.9)*800, y: 700, z: 1.05, r: -3 }), draw: (t, c, W) => {
      const run = (tt, x0, sd) => stick({ ...runPose(tt*2.4 + sd), armF: [170, 10], armB: [-170, -10], x: 600 + x0 + (tt - 24.9)*900, y: GND, s: 1.0 });
      let s = ''; [[0, 300], [.3, 0], [.6, -320]].forEach(([sd, x0]) => s += smear(tt => run(tt, x0, sd), t, 3) + run(t, x0, sd));
      return bg() + W(street(t) + s) + head(t, L[6], 960, 200, 'SCREAMING', 140, WHITE, ACC, -4); } },
  // 13. cars swerve
  { t: 26.0, cam: push2(26.0, 27.1, { x: 960, y: 600, z: .9 }, { x: 980, y: 600, z: .96 }), draw: (t, c, W) => {
      const k = seg(t, 26.0, 26.9), r = -35*E.snap(k);
      return bg() + W(street(t) + `<path d="M${300},${GND + 140} Q${700},${GND + 160} ${900 + 200*k},${GND + 110}" stroke="${INK}" stroke-width="14" fill="none" opacity=".5"/><g transform="translate(${lerp(200, 1100, E.snap(k))},${GND + 150}) rotate(${r})">${car(0, 0, 1.2, false, WHITE)}</g>` + `<path d="M1300,${GND - 120} l60,-30 M1320,${GND - 80} l70,0 M1300,${GND - 40} l60,30" stroke="${ACC}" stroke-width="10" stroke-linecap="round"/>`); } },
  // 14. someone films it, obviously
  { t: 27.1, cam: push2(27.1, 29.2, { x: 1000, y: 560, z: 1.25 }, { x: 1040, y: 540, z: 1.45 }), draw: (t, c, W) => {
      const scr = `<g transform="translate(1180,300)"><rect x="-150" y="-240" width="300" height="480" rx="34" fill="${INK}"/><rect x="-128" y="-210" width="256" height="420" rx="10" fill="${PAPER}"/><g transform="translate(0,140) scale(.2)">${trex({ x: 0, y: 0, s: 1, t, head: 10 })}</g><circle cx="-90" cy="-180" r="12" fill="${ACC}" opacity="${(t*2 % 1) < .6 ? 1 : .2}"/><text x="-70" y="-170" font-family="Inter" font-weight="900" font-size="26" fill="${INK}">REC</text></g>`;
      return bg() + W(`<path d="M-2000,${GND} L4000,${GND}" stroke="${INK}" stroke-width="${LW}"/>` + you([[0, { ...SP.film, armF: [96, 66], armB: [82, 76] }]], t, 820, GND, 1.3, { prop: (h) => phone(h[0] + 6, h[1] - 18, -10) })) + scr + head(t, 27.4, 520, 230, 'OBVIOUSLY.', 120, INK); } },
  // 15. then it sees you
  { t: 29.2, cam: push2(29.2, 30.4, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.15 }, 'in'), draw: (t, c, W) => {
      const k = E.snap(seg(t, 29.4, 29.7));
      return bg(INK) + W(`<g transform="translate(960,560) scale(3.6)"><ellipse rx="170" ry="100" fill="${PAPER}"/><circle cx="${-40 + 40*k}" r="70" fill="${ACC}"/><ellipse cx="${-40 + 40*k}" rx="${16 - 8*k}" ry="62" fill="${INK}"/><circle cx="${-60 + 40*k}" cy="-26" r="12" fill="${WHITE}"/><g transform="translate(${-40 + 40*k},0) scale(.09)">${stick({ ...SP.shock, x: 0, y: 260, s: 1 })}</g></g>`); } },
  // 16. and it starts to move (foot stomp, low angle)
  { t: 30.4, cam: push2(30.4, ROAR - .2, { x: 900, y: 640, z: 1.1, r: -6 }, { x: 900, y: 640, z: 1.2, r: -7 }), draw: (t, c, W) => {
      const k = seg(t, 30.5, 31.2), ph = .25 + .5*E.in(k);
      return bg() + W(`<rect x="-3000" y="${GND}" width="8000" height="900" fill="${GREY}"/><path d="M-3000,${GND} L5000,${GND}" stroke="${INK}" stroke-width="${LW}"/>` + rexAt(t, { x: 700, y: GND, s: 1.7, ph, walk: 1.4, eye: [10, 4] }) +
        (t > 31.2 ? `<g opacity="${1 - seg(t, 31.2, 31.6)}">${[...Array(8)].map((_, i) => `<circle cx="${1000 + (i - 4)*60*(1 + (t - 31.2)*3)}" cy="${GND - 10 - (i%2)*20}" r="${24 + (t - 31.2)*40}" fill="${GREY}" stroke="${INK}" stroke-width="5"/>`).join('')}</g>` : '')); } },
  // 17. ROAR
  { t: ROAR - .2, cam: push2(ROAR - .2, 33.5, { x: 1260, y: 450, z: 1.7, r: 3 }, { x: 1300, y: 460, z: 2.0, r: -3 }, 'snap'), draw: (t, c, W) => {
      const j = E.snap(seg(t, ROAR - .1, ROAR + .1));
      const f = bg() + W(rexAt(t, { x: 900, y: 1150, s: 1.6, jaw: j, head: 12*j, eye: [6, -2] })) + (t > ROAR ? focusLines(t, 1500, 380, .8*(1 - seg(t, ROAR + .8, 33.5)), 380) : '');
      return impactFrame(f, t, ROAR); } },
  // 18. here's the first catch (freeze + stamp)
  { t: 33.5, cam: push2(33.5, 35.0, { x: 960, y: 540, z: 1.0 }, { x: 960, y: 540, z: 1.04 }), draw: (t, c, W) =>
      bg() + `<g filter="url(#b3)" opacity=".35">${W(rexAt(32.6, { x: 900, y: 1150, s: 1.6, jaw: 1, head: 12 }))}</g>` + `<rect width="1920" height="1080" fill="${PAPER}" opacity=".5"/>` +
      you([[33.5, 'relax'], [33.9, 'point', 'o']], t, 340, 1000, 1.2) +
      `<g transform="translate(1100,520) rotate(-6) scale(${pop(t, 33.8, .25)})"><rect x="-520" y="-130" width="1040" height="230" fill="none" stroke="${ACC}" stroke-width="20"/><text y="60" text-anchor="middle" font-family="Bebas Neue" font-size="200" fill="${ACC}">THE FIRST CATCH</text></g>` },
  // 19. in the films (cinema frame)
  { t: 35.0, cam: t => ({ x: 960 + (t - 35)*420, y: 560, z: 1.0, r: 0 }), draw: (t, c, W) => {
      const x = 400 + (t - 35)*420*1.02, ph = t*1.6;
      let f = bg('#CFCAC0') + W(`<rect x="-3000" y="${GND}" width="8000" height="900" fill="#A9A397"/>` + jeep(x + 900, GND, 1.0) + smear(tt => trex({ x: 400 + (tt - 35)*428, y: GND, s: .75, ph: tt*1.6, walk: 1.6, jaw: .6, t: tt, lean: 8 }), t, 3, .025) + trex({ x, y: GND, s: .75, ph, walk: 1.6, jaw: .6, t, lean: 8 }), 1) + speedLines(t, 16, .5, INK, -1, 300, 800);
      f = `<g filter="url(#mono)">${f}</g>` + [...Array(5)].map((_, i) => `<path d="M${hash(i + Math.floor(t*24))*1920},0 l${(hash(i*3) - .5)*40},1080" stroke="${PAPER}" stroke-width="2" opacity=".5"/>`).join('');
      return f + `<rect width="1920" height="130" fill="${INK}"/><rect y="950" width="1920" height="130" fill="${INK}"/>` + tag(t, 35.1, 960, 230, 'IN THE FILMS', ACC, WHITE, 58); } },
  // 20. the computer model: bones + muscles
  { t: 38.5, cam: push2(38.5, 41.6, { x: 960, y: 560, z: .95 }, { x: 960, y: 560, z: 1.05 }), draw: (t, c, W) => {
      let grid = ''; for (let i = 0; i < 40; i++) grid += `<path d="M${i*60 - 300},-200 L${i*60 - 300},1400" stroke="${INK}" stroke-width="2" opacity=".08"/><path d="M-300,${i*60 - 200} L2400,${i*60 - 200}" stroke="${INK}" stroke-width="2" opacity=".08"/>`;
      const scan = (t - 38.5)/3.1*1920;
      return bg() + W(grid + trex({ x: 1000, y: 980, s: 1.05, t: 0 }) + bones(1000, 980, 1.05, t, 0) + `<rect x="${scan - 1100}" y="0" width="14" height="1080" fill="${ACC}" opacity=".6"/>`) + tag(t, 38.7, 960, 120, 'COMPUTER MODEL · 2017', INK, WHITE, 46); } },
  // 21. if it sprints, the legs break
  { t: 41.6, cam: push2(41.6, 45.0, { x: 1000, y: 700, z: 1.2 }, { x: 980, y: 760, z: 1.55 }, 'in'), draw: (t, c, W) => {
      const k = seg(t, 41.8, CRACK), ph = (t - 41.6)*lerp(.8, 2.4, k), broken = t > CRACK;
      let grid = ''; for (let i = 0; i < 40; i++) grid += `<path d="M${i*60 - 300},-200 L${i*60 - 300},1400" stroke="${INK}" stroke-width="2" opacity=".08"/>`;
      const f = bg() + W(grid + trex({ x: 1000, y: 980, s: 1.05, t, ph: broken ? 41.6 : ph, walk: 1 + k*.6, lean: 6*k }) + bones(1000, 980, 1.05, t, broken ? 1 : k*.6, broken ? 41.6 : ph, 1 + k*.6)) +
        tag(t, 42.0, 960, 120, 'TRY TO SPRINT…', INK, WHITE, 50) + (broken ? tag(t, CRACK + .05, 960, 960, 'BONES COULD BREAK', ACC, WHITE, 60) : '');
      return impactFrame(f, t, CRACK) + (broken && t < CRACK + .25 ? focusLines(t, 980, 820, .8, 300) : ''); } },
  // 22. best estimate ~ 20 km/h
  { t: 45.0, cam: push2(45.0, 49.2, { x: 960, y: 560, z: 1.0 }, { x: 960, y: 560, z: 1.06 }), draw: (t, c, W) => {
      const v = 20*E.o2(seg(t, 46.4, 47.6));
      return bg() + W(gauge(1300, 560, 300, v, 60, `${Math.round(v)} km/h`) + `<path d="M-2000,${GND + 40} L4000,${GND + 40}" stroke="${INK}" stroke-width="${LW}"/>` + trex({ x: 420, y: GND + 40, s: .55, t, ph: t*1.4, walk: 1.2, jaw: .3 })) +
        tag(t, 45.2, 520, 140, 'BEST ESTIMATE', INK, WHITE, 50) + tag(t, 47.7, 1300, 990, '≈ 20 km/h · AN ESTIMATE', ACC, WHITE, 46); } },
  // 23. roughly how fast people cycle to work
  { t: 49.2, cam: push2(49.2, 52.0, { x: 960, y: 560, z: 1.0 }, { x: 960, y: 560, z: 1.04 }), draw: (t, c, W) =>
      bg() + W(`<path d="M960,0 L960,1080" stroke="${INK}" stroke-width="${LW}"/><path d="M-200,${GND} L2200,${GND}" stroke="${INK}" stroke-width="${LW}"/>` + trex({ x: 480, y: GND, s: .5, t, ph: t*1.4, walk: 1.2 }) + rider(1440, GND, 1.0, t) + motion(1180, GND - 200, 3, 90) + motion(150, GND - 200, 3, 90)) +
      tag(t, 49.4, 480, 200, 'T. REX ≈ 20 km/h', INK, WHITE, 46) + tag(t, 50.0, 1440, 200, 'CYCLE COMMUTE ≈ 20–25 km/h', ACC, WHITE, 40) },
  // 24. so if a T. rex chases you: don't run
  { t: 52.0, cam: t => ({ x: 760 + (t - 52)*420, y: 640, z: 1.05, r: -2 }), draw: (t, c, W) => {
      const yx = 900 + (t - 52)*420, runner = tt => stick({ ...runPose(tt*2.6), x: 900 + (tt - 52)*420, y: GND, s: 1.05 });
      return bg() + W(street(t) + trex({ x: yx - 760, y: GND, s: .72, t, ph: t*1.5, walk: 1.3, jaw: .4 }) + smear(runner, t, 3) + runner(t) + (t > 53.9 ? `<g transform="translate(${yx},${GND - 160}) scale(${pop(t, 53.9, .2)})"><path d="M-110,-110 L110,110 M110,-110 L-110,110" stroke="${ACC}" stroke-width="30" stroke-linecap="round"/></g>` : '')) + head(t, 53.9, 960, 200, 'DON’T RUN.', 150, INK); } },
  // 25. get on your bike
  { t: 54.6, cam: t => ({ x: 900 + Math.max(0, t - 55.2)*900, y: 660, z: 1.05, r: 0 }), draw: (t, c, W) => {
      const go = Math.max(0, t - 55.2), bx = 1100 + go*go*500 + go*500;
      return bg() + W(street(t) + trex({ x: 300 + (t - 54.6)*200, y: GND, s: .7, t, ph: t*1.2, walk: 1, jaw: .2 + .2*Math.sin(t*8) }) + (go > 0 ? smear(tt => rider(1100 + Math.max(0, tt - 55.2)**2*500 + Math.max(0, tt - 55.2)*500, GND, 1.15, tt), t, 4, .03) : '') + rider(bx, GND, 1.15, t) + (go > 0 ? motion(bx - 260, GND - 200, 4, 140) : '')) +
        head(t, 54.8, 960, 200, 'GET ON YOUR BIKE.', 150, WHITE, ACC) + (t > 55.3 && t < 55.9 ? `<text x="${960 + (bx - c.x)*c.z + 160}" y="420" font-family="Bebas Neue" font-size="110" fill="${ACC}" stroke="${INK}" stroke-width="3">DING DING!</text>` : ''); } },
  // 26. walking speed ~ 4.6 km/h
  { t: 57.7, cam: push2(57.7, 61.8, { x: 960, y: 560, z: 1.0 }, { x: 960, y: 560, z: 1.06 }), draw: (t, c, W) => {
      const v = 4.6*E.o2(seg(t, 59.4, 60.4));
      return bg() + W(gauge(1320, 540, 280, v, 30, `${v.toFixed(1)} km/h`) + `<path d="M-2000,${GND + 40} L4000,${GND + 40}" stroke="${INK}" stroke-width="${LW}"/>` + trex({ x: 460, y: GND + 40, s: .55, t, ph: t*.45, walk: .7 })) +
        tag(t, 57.9, 520, 140, 'NORMAL WALKING SPEED', INK, WHITE, 44) + tag(t, 60.4, 1320, 960, '≈ 4.6 km/h · 2021 STUDY', ACC, WHITE, 44); } },
  // 27. walking to the shops, side by side
  { t: 61.8, cam: t => ({ x: 860 + (t - 61.8)*130, y: 640, z: 1.0, r: 0 }), draw: (t, c, W) => {
      const x = 900 + (t - 61.8)*130, look = seg(t, 62.8, 63.2);
      return bg() + W(street(t) + trex({ x: x - 560, y: GND + 30, s: .82, t, ph: t*.42, walk: .7, eye: [8, 6] }) + stick({ ...walkPose(t*.9), x: x + 330, y: GND + 30, s: 1.0, headX: -6*look, prop: (h) => `<path d="M${h[0] - 20},${h[1]} L${h[0] - 26},${h[1] + 60} L${h[0] + 26},${h[1] + 60} L${h[0] + 20},${h[1]} Z" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` }) + (t > 63.2 ? `<text x="${x + 260}" y="${GND - 330}" font-family="Bebas Neue" font-size="80" fill="${INK}">…</text>` : '')) +
        tag(t, 62.0, 960, 140, 'TO THE SHOPS', INK, WHITE, 50); } },
  // 28. bigger problems (germs)
  { t: 64.5, cam: push2(64.5, 68.6, { x: 900, y: 560, z: 1.25 }, { x: 900, y: 520, z: .8 }, 'io'), draw: (t, c, W) => {
      const sn = seg(t, SNEEZE - .5, SNEEZE), after = t > SNEEZE;
      const f = bg() + W(square(t) + trex({ x: 700, y: GND + 30, s: 1.0, t, head: after ? -10 : 14*sn, jaw: after ? .2 : .6*sn, shiver: t > 66 ? .6 : 0, eye: [-6, 2], blink: sn > .6 && !after ? 1 : blinkT(t) }) + germs(t, 900, GND - 450, 700*seg(t, 64.6, 66.4) + 1, 40, 1.4)) +
        tag(t, 65.0, 960, 120, 'BIGGER PROBLEMS', INK, WHITE, 50);
      return impactFrame(f, t, SNEEZE) + (after ? head(t, SNEEZE, 1300, 360, 'ACHOO!', 170, WHITE, ACC, -6) : ''); } },
  // 29. tease: day 1
  { t: 68.6, cam: push2(68.6, END, { x: 960, y: 540, z: 1.0 }, { x: 960, y: 540, z: 1.12 }, 'lin'), draw: (t, c, W) =>
      bg(INK) + W(`<circle cx="960" cy="540" r="380" fill="${PAPER}"/><clipPath id="lens"><circle cx="960" cy="540" r="380"/></clipPath><g clip-path="url(#lens)">${germs(t, 960, 540, 520, 46, 2.4)}</g><circle cx="960" cy="540" r="380" fill="none" stroke="${PAPER}" stroke-width="24"/>`) +
      (t > 70.0 ? `<rect width="1920" height="1080" fill="${INK}" opacity="${.75*seg(t, 70.0, 70.3)}"/>` : '') + head(t, 70.1, 960, 600, 'DAY 1', 360, WHITE) + head(t, 71.2, 960, 760, 'NEXT: THE INVISIBLE THREAT', 80, ACC) +
      `<rect width="1920" height="1080" fill="${INK}" opacity="${seg(t, 74.2, END)}"/>` },
];
function push2(t0, t1, a, b, e='lin') { return [[t0, { r: 0, ...a }], [t1, { r: 0, ...b }, e]]; }
// bones overlay for the model shots (thigh, shin, metatarsal of the near leg) with the stress colour
function bones(x, y, s, t, stress, ph=0, walk=0) {
  const P = (ph||0)*2*Math.PI, a = Math.sin(P), b = Math.cos(P);
  const th = 14 + 30*a*walk, kn = -46 - 34*Math.max(0, b)*walk, an = 48 + 30*Math.max(0, b)*walk;
  const hip = [10, -330], k1 = [hip[0] + Math.sin(rad(th))*170, hip[1] + Math.cos(rad(th))*170], k2 = [k1[0] + Math.sin(rad(th + kn))*140, k1[1] + Math.cos(rad(th + kn))*140], k3 = [k2[0] + Math.sin(rad(th + kn + an))*84, k2[1] + Math.cos(rad(th + kn + an))*84];
  const col = stress > .95 ? ACC : stress > .5 ? '#FF9A7A' : INK;
  const bone = (p, q) => `<path d="M${p[0]},${p[1]} L${q[0]},${q[1]}" stroke="${col}" stroke-width="16" stroke-linecap="round"/><circle cx="${p[0]}" cy="${p[1]}" r="14" fill="${WHITE}" stroke="${col}" stroke-width="7"/>`;
  const bob = -Math.abs(Math.sin(P))*14*walk + Math.sin(t*1.6)*3;
  return `<g transform="translate(${x},${y + bob*s}) scale(${s})" opacity=".9">${bone(hip, k1)}${bone(k1, k2)}${bone(k2, k3)}${stress > .95 ? `<path d="M${(k1[0] + k2[0])/2 - 30},${(k1[1] + k2[1])/2 - 30} l20,20 l-14,10 l24,24 l-10,10" stroke="${ACC}" stroke-width="9" fill="none" stroke-linecap="round"/>` : ''}<rect x="-80" y="-400" width="${120 + 60*stress}" height="16" fill="${ACC}" opacity="${.3 + stress*.6}" transform="rotate(-30,10,-330)"/></g>`;
}
function rider(x, y, s, t) {   // stickman on a bike (pedalling)
  const ph = t*2.2, P = ph*6.283; return bike(x, y, s, ph) + stick({ ...SP.ride, legF: [50 + 34*Math.sin(P), 64 + 34*Math.cos(P)], legB: [50 - 34*Math.sin(P), 64 - 34*Math.cos(P)], x: x - 30*s, y: y - 160*s + 126*.9*s, s: s*.9, air: true, noShadow: true });
}
const SHAKES = [[DINO_HIT, 20, .5], [31.2, 28, .5], [ROAR, 40, 1.0], [CRACK, 30, .5], [SNEEZE, 30, .5], [70.1, 14, .4]];
function scene(t) { return playShots(t, SHOTS, SHAKES) + flash(t, 11.5, WHITE, .25, .8) + flash(t, 14.6, WHITE, .15, .5); }
