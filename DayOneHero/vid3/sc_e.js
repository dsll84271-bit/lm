// RIG2
// Ep3 outro: would you survive day 3? Rules recap, comments, the red hood on the roof opposite, DAY 4: ???, end card.
// END 53.33   ST=[0.6, 6.79, 14.82, 19.71, 24.2, 36.49]
// The end card (from 41.6) keeps the Ep2 layout so YouTube end-screen elements line up: video box 200,260 900x506; subscribe circle 1440,513 r190.
function corkBoard() { let s = `<rect x="-1000" y="140" width="2000" height="760" rx="24" fill="#C98A4B" stroke="${INK}" stroke-width="10"/><rect x="-970" y="170" width="1940" height="700" rx="14" fill="#D9A866"/>`; for (let i = 0; i < 70; i++) s += `<circle cx="${-950 + (i*271 % 1900)}" cy="${190 + (i*137 % 660)}" r="${3 + i%3}" fill="#B07A45" opacity=".5"/>`; return s; }
const RULES = [['RULE 1', 'YOUR SPEED', 'COMES WITH YOU.'], ['RULE 2', 'TELEPORTING', 'IS LOUD.'], ['RULE 3', 'CHECK YOU CAN', 'BREATHE FIRST.'], ['RULE 4', 'SPACE: 10-SECOND', 'TRIP. MAX.'], ['RULE 5', "IF IT'S MOVING,", "IT'LL HIT YOU."]];
const RPOS = [[-620, 330], [0, 330], [620, 330], [-310, 680], [310, 680]];
const RHIT = [6.79, 8.23, 9.13, 10.36, 12.0];
function roofsNight(t, L, o={}) {
  let sky = `<rect x="-6000" y="-3000" width="12000" height="6000" fill="url(#nightG)"/><circle cx="-700" cy="160" r="70" fill="#FFF6D0"/>` + [...Array(60)].map((_, i) => `<circle cx="${(hash(i)*2 - 1)*2400}" cy="${hash(i*3)*700 - 200}" r="${1.5 + 2*hash(i*5)}" fill="#fff" opacity="${.4 + .5*Math.abs(Math.sin(t*1.3 + i))}"/>`).join('');
  let roofs = '';
  for (let i = -5; i < 6; i++) { const x = i*420; roofs += `<rect x="${x}" y="${GY - 420}" width="420" height="900" fill="#2B2F55" stroke="${INK}" stroke-width="6"/><path d="M${x - 10},${GY - 420} L${x + 210},${GY - 600} L${x + 430},${GY - 420} Z" fill="#1E2244" stroke="${INK}" stroke-width="6"/><rect x="${x + 290}" y="${GY - 650}" width="46" height="110" fill="#3A2F4F" stroke="${INK}" stroke-width="5"/>`;
    for (const wx of [60, 250]) roofs += `<rect x="${x + wx}" y="${GY - 330}" width="110" height="140" fill="${(i*7 + wx) % 3 ? '#3D4680' : '#FFE2A8'}" stroke="${INK}" stroke-width="5"/>`; }
  const lx = o.lampX ?? 330, hx = lx - 120, hy = GY - 1180;
  const lamp = `<g><rect x="${lx - 14}" y="${hy + 20}" width="28" height="${GY + 200 - hy}" fill="#3A3F66" stroke="${INK}" stroke-width="6"/><path d="M${lx},${hy + 20} Q${lx},${hy - 30} ${hx + 40},${hy - 30} L${hx},${hy - 30}" stroke="#3A3F66" stroke-width="22" fill="none"/><path d="M${hx - 50},${hy - 45} L${hx + 50},${hy - 45} L${hx + 30},${hy - 10} L${hx - 30},${hy - 10} Z" fill="#FFE9A8" stroke="${INK}" stroke-width="5"/></g>`;
  const cone = `<path d="M${hx - 30},${hy - 10} L${hx - 330},${GY - 560} L${hx + 330},${GY - 560} L${hx + 30},${hy - 10} Z" fill="#FFE9A8" opacity=".2"/><circle cx="${hx}" cy="${hy}" r="170" fill="url(#lampG)"/><ellipse cx="${hx}" cy="${GY - 590}" rx="260" ry="40" fill="#FFE9A8" opacity=".25"/>`;
  return L(0, sky) + L(1, roofs + cone + lamp);
}
const SHOTS_E = [
  // 0 would you survive day 3? probably... if you remember the rules
  { t: 0, ref: RR, cam: push(0, 6.79, { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 0, y: GY - 330, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.lookCam }], [2.4, { ...POSES.shrug, mouth: 'smirk' }, 'o'], [3.4, { ...POSES.point, armF: [116, -20], eyes: 'determined', mouth: 'grin' }, 'o']];
      return L(0, studioBack(t)) + L(1, studioFloor() + dex(K, t, -380, GY)) + title(t, .7, 1200, 330, 'WOULD YOU SURVIVE', '#FFFFFF', 76) + title(t, 1.0, 1200, 470, 'DAY 3?', '#5CF2FF', 150) +
        (t > 2.5 ? `<g transform="translate(1200,650) rotate(-6) scale(${pop(t, 2.5, .25)})"><rect x="-230" y="-80" width="460" height="160" rx="22" fill="none" stroke="#7ED957" stroke-width="14"/>${txt('PROBABLY.', 0, 34, 90, '#7ED957')}</g>` : '') + chipAt(t, 3.4, 1200, 850, 'IF YOU REMEMBER THE RULES', '#FFD23F', 46); } },
  // 1 the five rules on a corkboard
  { t: 6.79, ref: RR, cam: push(6.79, 14.82, { x: 0, y: 520, z: 1.0, r: 0 }, { x: 0, y: 520, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      let s = corkBoard();
      RULES.forEach((r, i) => { const hi = t > RHIT[i] && (i === 4 ? t < 14.8 : t < RHIT[i + 1]); let n = note(t, 6.85 + i*.12, RPOS[i][0], RPOS[i][1], r[0], r[1], r[2], [-4, 3, -2, 4, -3][i]);
        n = n.replace(/scale\(([\d.e-]+)\)/, (m, v) => `scale(${(+v)*(hi ? .62 : .5)})`); s += hi ? '' : n; if (hi) s += `<g>${n}</g>`; });
      const hi = RHIT.filter(h => t > h).length - 1; if (hi >= 0) { const [x, y] = RPOS[hi]; s = s + `<circle cx="${x}" cy="${y}" r="230" fill="none" stroke="#E8463C" stroke-width="10" stroke-dasharray="20 14" opacity=".8"/>`; }
      return L(0, studioBack(t)) + L(1, s); } },
  // 2 which rule would you have broken first? comments
  { t: 14.82, ref: RR, cam: push(14.82, 19.71, { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 0, y: GY - 330, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.think, eyes: 'happy', mouth: 'smirk' }], [16.8, { ...POSES.point, armF: [100, -10], eyes: 'happy', mouth: 'grin' }, 'o']];
      const box = t > 15.2 ? `<g transform="translate(1250,480) scale(${pop(t, 15.2, .35)})"><rect x="-420" y="-150" width="840" height="300" rx="30" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="-320" cy="-50" r="50" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><text x="60" y="-40" text-anchor="middle" font-family="Lilita One" font-size="52" fill="#1F2033">WHICH RULE WOULD YOU</text><text x="60" y="22" text-anchor="middle" font-family="Lilita One" font-size="52" fill="#1F2033">HAVE BROKEN FIRST?</text><rect x="-250" y="60" width="500" height="54" rx="27" fill="#3D8BFF"/>${txt('COMMENT ▶', 0, 100, 36, '#fff')}</g>` : '';
      return L(0, studioBack(t)) + L(1, studioFloor() + dex(K, t, -450, GY)) + box; } },
  // 3 that night: home, quietly
  { t: 19.71, ref: RR, cam: push(19.71, 24.2, { x: -100, y: GY - 360, z: 1.3, r: 0 }, { x: -80, y: GY - 360, z: 1.4, r: 0 }, 'lin'), draw: (t, c, L) => {
      const A = 21.7;
      const K = [[A, { ...POSES.idle, eyes: 'happy', mouth: 'smile' }], [22.2, { ...POSES.point, armF: [150, -60], handF: 'point', eyes: 'closed', mouth: 'o' }, 'o']];
      return bedroom(t, L, c, '', { night: true }) + L(1, tpWrap(t, dex(K, t, 0, GY), 0, GY - 150, A) + popFX(t, A, 0, GY - 150, .35)) + chipAt(t, 19.8, 960, 120, 'THAT NIGHT', '#3D4680', 56) + (t > 21.75 && t < 23.5 ? `<g transform="translate(1080,640)">${txt('(pop)', 0, 0, 46, '#BFE6FF')}</g>` : '') + chipAt(t, 22.4, 960, 960, 'QUIETLY THIS TIME', '#7ED957', 48); } },
  // 4 he looks out of his window (seen from outside)
  { t: 24.2, ref: RR, cam: push(24.2, 25.75, { x: 0, y: GY - 380, z: 1.6, r: 0 }, { x: 0, y: GY - 380, z: 1.75, r: 0 }, 'lin'), draw: (t, c, L) => {
      const wall = `<rect x="-3000" y="-1000" width="6000" height="4000" fill="#3A2F4F"/>` + [...Array(40)].map((_, i) => `<rect x="${-1400 + (i % 8)*360 + (Math.floor(i/8) % 2)*180}" y="${GY - 900 + Math.floor(i/8)*80}" width="340" height="70" fill="#4A3B5F" stroke="#2A2140" stroke-width="5"/>`).join('');
      const win = `<rect x="-330" y="${GY - 760}" width="660" height="600" fill="#FFE2A8" stroke="${INK}" stroke-width="10"/>`;
      const K = [[0, { ...POSES.idle, look: [0, -2], eyes: 'open', mouth: 'smile' }], [25.0, { ...POSES.lookCam, eyes: 'wide', mouth: 'o', look: [0, -2] }, 'o']];
      const frame = `<path d="M0,${GY - 760} L0,${GY - 160} M-330,${GY - 460} L330,${GY - 460}" stroke="#fff" stroke-width="18"/><rect x="-330" y="${GY - 760}" width="660" height="600" fill="none" stroke="${INK}" stroke-width="10"/><path d="M-260,${GY - 300} L-120,${GY - 700}" stroke="#fff" stroke-width="20" opacity=".25"/><rect x="-380" y="${GY - 160}" width="760" height="40" fill="#C9C2DA" stroke="${INK}" stroke-width="6"/>`;
      return L(1, wall + win + `<clipPath id="wcl"><rect x="-330" y="${GY - 760}" width="660" height="600"/></clipPath><g clip-path="url(#wcl)">${dex(K, t, 0, GY - 60)}</g>` + frame); } },
  // 5 the roof opposite: the red hood under a streetlight, staring back... a red streak, gone
  { t: 25.75, ref: RR, cam: [[25.75, { x: 150, y: GY - 660, z: .95, r: 0 }], [27.3, { x: 170, y: GY - 700, z: 1.05, r: 0 }, 'lin'], [29.0, { x: 210, y: GY - 800, z: 1.45, r: 0 }, 'io'], [30.15, { x: 210, y: GY - 810, z: 1.6, r: 0 }, 'lin'], [31.6, { x: 210, y: GY - 790, z: 1.4, r: 0 }, 'o']], draw: (t, c, L) => {
      const GONE = 30.3, rx = 210, ry = GY - 596;
      const eyes = t < GONE ? Math.min(1, seg(t, 26.0, 26.5)) : 0;
      let fig = t < GONE ? redHood3(rx, ry, 1.15, eyes, t) : '';
      let streak = ''; if (t >= GONE - .05 && t < GONE + .5) { const k = seg(t, GONE - .05, GONE + .5); streak = `<path d="M${rx},${ry - 150} L${rx + 2400*E.in(k)},${ry - 150 - 900*E.in(k)}" stroke="#E8463C" stroke-width="${70*(1 - k) + 10}" stroke-linecap="round" opacity="${1 - k*.6}"/><path d="M${rx},${ry - 150} L${rx + 2400*E.in(k)},${ry - 150 - 900*E.in(k)}" stroke="#FFB0A8" stroke-width="${20*(1 - k)}" stroke-linecap="round"/>`; }
      return roofsNight(t, L) + L(1, fig + streak + (t > GONE ? dust(rx, ry, t, GONE, 6, .7, '#5A5F8A') : '')) + `<rect width="1920" height="1080" fill="url(#vig)" opacity=".8"/>` + chipAt(t, 27.3, 960, 980, 'THE ROOF OPPOSITE', '#3D4680', 46, GONE) + (t > GONE + .3 ? chipAt(t, GONE + .3, 960, 980, 'GONE.', '#E8463C', 56) : ''); } },
  // 6 Dex's face
  { t: 31.6, ref: RR, cam: push(31.6, 33.0, { x: 0, y: GY - 300, z: 2.6, r: 0 }, { x: 0, y: GY - 290, z: 3.0, r: 3 }, 'in'), draw: (t, c, L) =>
      bedroom(t, L, c, 'b8', { night: true }) + L(1, dex([[0, { ...POSES.surprise, eyes: 'wide', mouth: 'o', look: [0, -4] }], [32.3, { ...POSES.gulp }, 'o']], t, 0, GY)) },
  // 7 DAY 4: ???
  { t: 33.0, ref: GC, cam: hold(33.0, { x: 960, y: 540, z: 1 }), draw: (t, c, L) => {
      const n = Math.min(10, Math.floor((t - 33.2)*14)), str = 'DAY 4: ???'.slice(0, Math.max(0, n));
      return `<rect width="1920" height="1080" fill="#07081A"/>` + (str ? `<g transform="translate(960,560)">${txt(str, 0, 50, 190, n >= 10 ? '#E8463C' : '#FFFFFF')}</g>` : '') + (t > 34.2 ? `<ellipse cx="${1500 + Math.sin(t*3)*6}" cy="820" rx="18" ry="8" fill="#fff" opacity="${.6 + .4*Math.sin(t*5)}"/><ellipse cx="${1550 + Math.sin(t*3)*6}" cy="820" rx="18" ry="8" fill="#fff" opacity="${.6 + .4*Math.sin(t*5)}"/>` : ''); } },
  // 8 who do you think the red hood is?
  { t: 36.45, ref: RR, cam: push(36.45, 41.6, { x: 0, y: GY - 330, z: 1.35, r: 0 }, { x: 0, y: GY - 330, z: 1.45, r: 0 }, 'lin'), draw: (t, c, L) => {
      const K = [[0, { ...POSES.think, look: [6, -4] }], [38.0, { ...POSES.point, armF: [100, -10], eyes: 'happy', mouth: 'grin' }, 'o'], [39.2, { ...POSES.wave }, 'o']];
      return L(0, studioBack(t, '#3A1F3F', '#24122A', '#4A2A50')) + L(1, studioFloor('#1E0F24') + dex(K, t, -380, GY) + `<g opacity="${seg(t, 36.6, 37.2)}">${redHood3(520, GY, 1.0, 1, t)}</g>`) + `<g transform="translate(1180,300) scale(${pop(t, 36.6, .3)})">${txt('?', 0, 0, 200, '#E8463C')}</g>` + chipAt(t, 38.05, 960, 120, 'COMMENT YOUR GUESS', '#E8463C', 54) + chipAt(t, 39.1, 960, 980, 'SEE YOU ON DAY 4', '#5CF2FF', 56); } },
  // 9 end card (layout locked for YouTube end-screen elements)
  { t: 41.6, ref: GC, cam: hold(41.6, { x: 960, y: 540, z: 1 }), draw: (t, c, L) => {
      let s = L(0, studioBack(t)) + `<rect x="200" y="260" width="900" height="506" rx="26" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/><circle cx="1440" cy="513" r="190" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/><g transform="translate(1440,780)">${chip('SUBSCRIBE', 0, 0, '#E8463C', 54)}</g>`;
      s += title(t, 41.7, 650, 170, 'WATCH NEXT', '#FFFFFF', 80) + title(t, 41.9, 1440, 230, 'DAY 4?', '#FFD23F', 70);
      s += chibi2(dexAt([[0, { ...POSES.peace }]], t, () => ({ x: 1700, y: 1110 }), { s: .8, seed: 9 }));
      const pe = seg(t, 47.0, 48.0); if (pe > 0) s += `<g opacity="${pe}">${redHood3(1840, 1040, .45, pe, t)}</g>`;
      return s; } },
];
const SHAKES_E = [[30.3, 14, .5], [36.6, 6, .3]];
function scene(t) { let s = EP3DEFS + playShots(t, SHOTS_E, SHAKES_E) + vignette(); [14.82, 19.71, 36.45].forEach(w => s += wipe(t, w)); return s; }
