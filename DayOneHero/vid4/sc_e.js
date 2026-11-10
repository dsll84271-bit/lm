// RIG2
// Ep4 outro. END 57.13  ST=[0.6, 6.61, 13.78, 18.59, 28.16, 38.33]
// The end card (from 44.2) keeps the Ep2/Ep3 layout for YouTube end-screen elements: video box 200,260 900x506; subscribe circle 1440,513 r190.
function corkBoard() { let s = `<rect x="-1000" y="140" width="2000" height="760" rx="24" fill="#C98A4B" stroke="${INK}" stroke-width="10"/><rect x="-970" y="170" width="1940" height="700" rx="14" fill="#D9A866"/>`; for (let i = 0; i < 70; i++) s += `<circle cx="${-950 + (i*271 % 1900)}" cy="${190 + (i*137 % 660)}" r="${3 + i%3}" fill="#B07A45" opacity=".5"/>`; return s; }
const RULES = [['RULE 1', 'YOUR EYES', 'GIVE YOU AWAY.'], ['RULE 2', "DON'T EAT", 'IN PUBLIC.'], ['RULE 3', 'STAY', 'DRY.'], ['RULE 4', 'HEAT STILL', 'SHOWS.'], ['RULE 5', 'DOGS', 'KNOW.']];
const RPOS = [[-620, 330], [0, 330], [620, 330], [-310, 680], [310, 680]], RHIT = [6.61, 8.03, 9.2, 10.27, 11.45];
const REACH = 30.0, STICK = 31.9, GONE = 33.3, D5 = 35.6;
const RHX = 520, RIDGE = GY - 160;            // red hood on the ridge; Dex creeps in from the left
const dexXe = t => lerp(-1300, RHX - 300, E.io(seg(t, 18.8, 27.6)) );
const dexYe = RIDGE;
function noteOnHead(t, x, y, s=.4, sway=0) { return stickyNote(x, y, s, 'NICE', 'TRY', '#E8463C', -6 + sway, '#fff'); }
const SHOTS_E = [
  // 0 would you survive day 4? probably
  { t: 0, ref: RR, cam: push(0, 6.55, { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 0, y: GY - 330, z: 1.52, r: 0 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t)) + L(1, studioFloor() + slippers(t, -380, GY - 10, 1.05, false) + dexI([[0, { eyes: 'open' }], [2.4, { eyes: 'happy' }, 'o'], [3.4, { eyes: 'determined' }, 'o']], t, -380, GY)) + title(t, .7, 1200, 330, 'WOULD YOU SURVIVE', '#FFFFFF', 76) + title(t, 1.0, 1200, 470, 'DAY 4?', '#5CF2FF', 150) +
      (t > 2.5 ? `<g transform="translate(1200,650) rotate(-6) scale(${pop(t, 2.5, .25)})"><rect x="-230" y="-80" width="460" height="160" rx="22" fill="none" stroke="#7ED957" stroke-width="14"/>${txt('PROBABLY.', 0, 34, 90, '#7ED957')}</g>` : '') + chipAt(t, 3.4, 1200, 850, 'IF YOU REMEMBER THE RULES', '#FFD23F', 46) },
  // 1 the five rules
  { t: 6.55, ref: RR, cam: push(6.55, 13.7, { x: 0, y: 520, z: 1.0, r: 0 }, { x: 0, y: 520, z: 1.04, r: 0 }, 'lin'), draw: (t, c, L) => {
      let s = corkBoard();
      RULES.forEach((r, i) => { const hi = t > RHIT[i] && (i === 4 ? t < 13.7 : t < RHIT[i + 1]); let n = note(t, 6.6 + i*.12, RPOS[i][0], RPOS[i][1], r[0], r[1], r[2], [-4, 3, -2, 4, -3][i]); s += n.replace(/scale\(([\d.e-]+)\)/, (m, v) => `scale(${(+v)*(hi ? .62 : .5)})`); });
      const hi = RHIT.filter(h => t > h).length - 1; if (hi >= 0) { const [x, y] = RPOS[hi]; s += `<circle cx="${x}" cy="${y}" r="230" fill="none" stroke="#E8463C" stroke-width="10" stroke-dasharray="20 14" opacity=".8"/>`; }
      return L(0, studioBack(t)) + L(1, s); } },
  // 2 which rule would catch you out first?
  { t: 13.7, ref: RR, cam: push(13.7, 18.5, { x: 0, y: GY - 330, z: 1.4, r: 0 }, { x: 0, y: GY - 330, z: 1.5, r: 0 }, 'lin'), draw: (t, c, L) => {
      const box = t > 14.0 ? `<g transform="translate(1250,480) scale(${pop(t, 14.0, .35)})"><rect x="-420" y="-150" width="840" height="300" rx="30" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="-320" cy="-50" r="50" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><text x="60" y="-40" text-anchor="middle" font-family="Lilita One" font-size="52" fill="#1F2033">WHICH RULE WOULD</text><text x="60" y="22" text-anchor="middle" font-family="Lilita One" font-size="52" fill="#1F2033">CATCH YOU OUT FIRST?</text><rect x="-250" y="60" width="500" height="54" rx="27" fill="#3D8BFF"/>${txt('COMMENT ▶', 0, 100, 36, '#fff')}</g>` : '';
      return L(0, studioBack(t)) + L(1, studioFloor() + slippers(t, -450, GY - 10, 1.05, false) + dexI([[0, { eyes: 'open', look: [9, -2] }], [15.6, { eyes: 'happy' }, 'o']], t, -450, GY)) + box; } },
  // 3 that night: Dex creeps along the ridge towards the red hood (back turned)
  { t: 18.5, ref: RR, cam: t => camAt([[18.5, { x: 0, y: GY - 520, z: .95, r: 0 }], [24.5, { x: 120, y: GY - 480, z: 1.15, r: 0 }, 'lin'], [28.1, { x: 260, y: GY - 440, z: 1.45, r: -2 }, 'io']], t), draw: (t, c, L) => {
      const dx = dexXe(t), creep = Math.max(0, Math.sin(t*3))*-6;
      return roofsNight4(t, L, { chimX: RHX + 330 }) + L(1, redHoodBack(t, RHX, RIDGE, DS) + dexI([[0, { eyes: 'determined', look: [9, -2] }], [23.3, { eyes: 'squeeze', look: [9, 0] }, 'o'], [24.0, { eyes: 'determined', look: [9, -2] }, 'o']], t, dx, dexYe, { bob: creep })) + `<rect width="1920" height="1080" fill="url(#vig)" opacity=".7"/>` +
        chipAt(t, 18.8, 960, 110, 'THAT NIGHT', '#3D4680', 56) + (t > 23.3 && t < 28.1 ? `<g transform="translate(960,960)" opacity="${.6 + .4*Math.sin(t*6)}">${txt(t < 24.0 ? 'closer…' : 'closer…', 0, 0, 56, '#fff')}</g>` : ''); } },
  // 4 never turns round: reaches back, sticks the note on his forehead, a red streak, gone
  { t: 28.1, ref: RR, cam: push(28.1, 33.4, { x: RHX - 160, y: GY - 420, z: 1.6, r: -2 }, { x: RHX - 160, y: GY - 420, z: 1.72, r: 0 }, 'lin'), draw: (t, c, L) => {
      const dx = RHX - 300, fy = dexYe - (238 + 60)*DS, fx = dx;
      const reach = E.o(seg(t, REACH, STICK)) - (t > STICK + .2 ? E.io(seg(t, STICK + .2, STICK + .8)) : 0);
      const K = [[0, { armF: [-10, 10], armB: [10, -10] }], [REACH, { armF: [-10, 10], armB: [-112, -30] }, 'o'], [STICK + .25, { armF: [-10, 10], armB: [-112, -30] }], [STICK + .8, { armF: [-10, 10], armB: [10, -10] }, 'o']];
      const hand = [lerp(RHX - 30, fx + 30, reach), lerp(RIDGE - 170*DS, fy, reach)];
      let rh = t < GONE ? redHoodBack(t, RHX, RIDGE, DS, K) : '';
      let streak = ''; if (t >= GONE - .05 && t < GONE + .5) { const k = seg(t, GONE - .05, GONE + .5); streak = `<path d="M${RHX},${RIDGE - 200} L${RHX + 2400*E.in(k)},${RIDGE - 200 - 900*E.in(k)}" stroke="#E8463C" stroke-width="${70*(1 - k) + 10}" stroke-linecap="round" opacity="${1 - k*.6}"/><path d="M${RHX},${RIDGE - 200} L${RHX + 2400*E.in(k)},${RIDGE - 200 - 900*E.in(k)}" stroke="#FFB0A8" stroke-width="${20*(1 - k)}" stroke-linecap="round"/>`; }
      const nt = t < STICK ? (t > REACH ? noteOnHead(t, hand[0], hand[1] - 20, .32, 0) : '') : noteOnHead(t, fx, fy, .4, Math.sin(t*3)*3);
      const eK = [[0, { eyes: 'determined', look: [9, -2] }], [STICK, { eyes: 'wide', look: [0, -8] }, 'snap'], [GONE + .2, { eyes: 'shock', look: [9, 0] }, 'snap']];
      return roofsNight4(t, L, { chimX: RHX + 330 }) + L(1, rh + dexI(eK, t, dx, dexYe) + nt + streak + (t > GONE ? dust(RHX, RIDGE, t, GONE, 6, .7, '#5A5F8A') : '')) + `<rect width="1920" height="1080" fill="url(#vig)" opacity=".7"/>` +
        chipAt(t, 28.4, 960, 110, "DOESN'T TURN ROUND", '#E8463C', 52) + bang(t, STICK, 1500, 330, 'pat.', '#fff', 64, -6, 33.2); } },
  // 5 the note floats at head height above two very wide eyeballs
  { t: 33.4, ref: RR, cam: push(33.4, D5, { x: RHX - 300, y: dexYe - 300*DS, z: 2.6, r: 0 }, { x: RHX - 300, y: dexYe - 300*DS, z: 2.9, r: 3 }, 'lin'), draw: (t, c, L) => {
      const dx = RHX - 300, fy = dexYe - (238 + 60)*DS;
      return roofsNight4(t, L, { chimX: RHX + 330 }) + L(1, dexI([[0, { eyes: 'wide', look: [0, -10] }], [34.4, { eyes: 'wide', look: [0, -10], blink: 1 }, 'snap'], [34.6, { eyes: 'wide', look: [0, -10] }, 'snap']], t, dx, dexYe) + noteOnHead(t, dx, fy, .4, Math.sin(t*3)*3)) + `<rect width="1920" height="1080" fill="url(#vig)" opacity=".8"/>`; } },
  // 6 DAY 5: ???
  { t: D5, ref: GC, cam: hold(D5, { x: 960, y: 540, z: 1 }), draw: (t, c, L) => {
      const n = Math.min(10, Math.floor((t - D5 - .1)*14)), str = 'DAY 5: ???'.slice(0, Math.max(0, n));
      return `<rect width="1920" height="1080" fill="#07081A"/>` + (str ? `<g transform="translate(960,560)">${txt(str, 0, 50, 190, n >= 10 ? '#E8463C' : '#FFFFFF')}</g>` : ''); } },
  // 7 they didn't even look... how did they know?
  { t: 38.3, ref: RR, cam: push(38.3, 44.2, { x: RHX - 300, y: dexYe - 280*DS, z: 2.2, r: 0 }, { x: RHX - 300, y: dexYe - 280*DS, z: 2.5, r: -2 }, 'lin'), draw: (t, c, L) => {
      const dx = RHX - 300, fy = dexYe - (238 + 60)*DS;
      return roofsNight4(t, L, { chimX: RHX + 330 }) + L(1, dexI([[0, { eyes: 'wide', look: [9, 0] }], [39.4, { eyes: 'open', look: [-9, 0] }, 'o'], [40.4, { eyes: 'open', look: [9, -4] }, 'o'], [42.8, { eyes: 'happy' }, 'o']], t, dx, dexYe) + noteOnHead(t, dx, fy, .4, Math.sin(t*3)*3)) + `<rect width="1920" height="1080" fill="url(#vig)" opacity=".7"/>` +
        chipAt(t, 39.4, 960, 130, 'HOW DID THEY KNOW?', '#E8463C', 60) + chipAt(t, 41.75, 960, 960, 'COMMENT YOUR GUESS', '#FFD23F', 52) + chipAt(t, 42.9, 960, 1040, 'SEE YOU ON DAY 5', '#5CF2FF', 40); } },
  // 8 end card (layout locked)
  { t: 44.2, ref: GC, cam: hold(44.2, { x: 960, y: 540, z: 1 }), draw: (t, c, L) => {
      let s = L(0, studioBack(t)) + `<rect x="200" y="260" width="900" height="506" rx="26" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/><circle cx="1440" cy="513" r="190" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/><g transform="translate(1440,780)">${chip('SUBSCRIBE', 0, 0, '#E8463C', 54)}</g>`;
      s += title(t, 44.3, 650, 170, 'WATCH NEXT', '#FFFFFF', 80) + title(t, 44.5, 1440, 230, 'DAY 5?', '#FFD23F', 70);
      s += slippers(t, 1700, 1060, .8, false) + chibi4(dexAt([[0, { eyes: 'happy' }]], t, () => ({ x: 1700, y: 1070 }), { s: .8, seed: 9, inv: true })) + noteOnHead(t, 1700, 1070 - 298*.8, .26, Math.sin(t*3)*3);
      return s; } },
];
const SHAKES_E = [[GONE, 14, .5], [STICK, 4, .2]];
function scene(t) { let s = EP3DEFS + EP4DEFS + playShots(t, SHOTS_E, SHAKES_E) + vignette(); [13.7, 18.5, 38.3].forEach(w => s += wipe(t, w)); return s; }
