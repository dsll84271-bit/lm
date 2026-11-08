// ============================================================================
// STICK: nameless stickman explainer kit (ink style, one accent colour)
// Thick clean black lines, round white heads, flat backgrounds, accent = ACC.
// Everything is a pure function of t, so frames can render in any order.
// ============================================================================
const INK = '#141414', PAPER = '#EFECE4', GREY = '#D7D2C7', MID = '#B9B3A6', ACC = '#FF4B1F', WHITE = '#FFFFFF';
const LW = 11;                                   // master line weight (px at scale 1)
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a)*k;
const seg = (t, a, b) => clamp((t - a)/(b - a));
const rad = d => d*Math.PI/180;
const hash = n => { const s = Math.sin(n*127.1 + 311.7)*43758.5453; return s - Math.floor(s); };
const noise1 = (t, f, sd=0) => Math.sin(t*f + sd)*.55 + Math.sin(t*f*2.17 + sd*1.7)*.3 + Math.sin(t*f*4.31 + sd*2.3)*.15;
const E = { io: k => k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3)/2, o: k => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3*Math.pow(k - 1, 3) + c1*Math.pow(k - 1, 2); },
  o2: k => 1 - Math.exp(-6*k)*Math.cos(k*10), snap: k => 1 - Math.pow(1 - k, 5), in: k => k*k*k, lin: k => k, hold: k => k < 1 ? 0 : 1 };
const pop = (t, a, d=.3) => t < a ? 0 : E.o(seg(t, a, a + d));

const DEFS = `<defs>
<filter id="b3" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b8" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="mb" x="-10%" y="-2%" width="120%" height="104%"><feGaussianBlur stdDeviation="22 0"/></filter>
<filter id="inv" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="-.3 -.59 -.11 0 1  -.3 -.59 -.11 0 1  -.3 -.59 -.11 0 1  0 0 0 1 0"/></filter><filter id="mono" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.15"/></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
</defs>`;

// ---------------------------------------------------------------- stickman
// Side view facing right (flip for left). Angles: 0 = straight down, +90 = forward, 180 = up.
// o: {x,y,s,flip, lean, rot, sq, headX, headY, armF:[sh,el], armB, legF:[hip,knee], legB, air, prop, mark}
const SDEF = { armF: [10, 10], armB: [-10, 10], legF: [6, 0], legB: [-6, 0], lean: 0, sq: 1, rot: 0, headX: 0, headY: 0 };
function limbPts(x, y, a1, l1, a2, l2) { const ex = x + Math.sin(rad(a1))*l1, ey = y + Math.cos(rad(a1))*l1; return [[x, y], [ex, ey], [ex + Math.sin(rad(a1 + a2))*l2, ey + Math.cos(rad(a1 + a2))*l2]]; }
const pl = (p, w=LW, col=INK) => `<polyline points="${p.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
function stick(o) {
  o = { ...SDEF, ...o }; const s = o.s || 1;
  const HIP = -126, NECK = -232, HEAD = 34;
  const legs = [o.legB, o.legF].map(l => limbPts(0, HIP, l[0], 64, -l[1], 62));   // knees bend backwards
  const foot = Math.max(...legs.map(p => p[2][1]));
  const bob = o.air ? 0 : -foot;
  let g = `<g transform="translate(${o.x},${o.y}) scale(${o.flip ? -s : s},${s})">`;
  if (!o.air && !o.noShadow) g += `<ellipse cx="0" cy="4" rx="${46/Math.sqrt(o.sq)}" ry="7" fill="${INK}" opacity=".13"/>`;
  g += `<g transform="rotate(${o.rot},0,${HIP}) scale(${1/Math.sqrt(o.sq)},${o.sq})"><g transform="translate(0,${bob})">`;
  // torso pivots at the hip
  const nx = Math.sin(rad(o.lean))*(HIP - NECK), ny = HIP - Math.cos(rad(o.lean))*(HIP - NECK);
  const sh = [lerp(0, nx, .88), lerp(HIP, ny, .88)];
  const arms = [o.armB, o.armF].map(a => limbPts(sh[0], sh[1], a[0] + o.lean, 54, a[1], 52));
  // back limbs first (a touch lighter so the pose reads), then torso/head, then front limbs
  g += pl(legs[0], LW, '#3A3A3A') + pl(arms[0], LW, '#3A3A3A');
  if (o.propBack) g += o.propBack(arms[0][2]);
  g += pl([[0, HIP], [nx*.5 + (o.lean ? 3 : 0), (HIP + ny)/2], [nx, ny]]);
  const hx = nx + Math.sin(rad(o.lean))*HEAD*.95 + o.headX, hy = ny - Math.cos(rad(o.lean))*HEAD*.95 + o.headY;
  g += `<circle cx="${hx}" cy="${hy}" r="${HEAD}" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*.85}"/>`;
  if (o.face) g += o.face(hx, hy);
  g += pl(legs[1]) + pl(arms[1]);
  for (const p of legs) { const [fx, fy] = p[2]; g += `<path d="M${fx - 4},${fy} L${fx + 16},${fy}" stroke="${INK}" stroke-width="${LW}" stroke-linecap="round"/>`; }
  if (o.prop) g += o.prop(arms[1][2], arms[0][2]);
  g += `</g></g>`;
  if (o.mark) g += o.mark;
  return g + `</g>`;
}
// procedural gaits (return pose fragments)
function runPose(ph, k=1) { const a = Math.sin(ph*2*Math.PI), b = Math.cos(ph*2*Math.PI);
  return { legF: [40*a*k, 20 + 70*Math.max(0, b)*k], legB: [-40*a*k, 20 + 70*Math.max(0, -b)*k], armF: [-55*a*k, 70], armB: [55*a*k, 70], lean: 14*k }; }
function walkPose(ph, k=1) { const a = Math.sin(ph*2*Math.PI), b = Math.cos(ph*2*Math.PI);
  return { legF: [24*a*k, 6 + 28*Math.max(0, b)*k], legB: [-24*a*k, 6 + 28*Math.max(0, -b)*k], armF: [-20*a*k, 18], armB: [20*a*k, 18], lean: 4*k }; }
const SP = {   // key poses (side view)
  stand: {}, relax: { armF: [6, 6], armB: [-8, 6] },
  shock: { armF: [150, 20], armB: [130, 30], lean: -14, legF: [18, 10], legB: [-18, 10] },
  scream: { armF: [170, 10], armB: [-170, -10], lean: -6, legF: [20, 30], legB: [-30, 30] },
  cower: { armF: [140, 120], armB: [120, 110], lean: 24, legF: [40, 80], legB: [-20, 90], sq: .92 },
  point: { armF: [96, 0], armB: [-10, 20] },
  film: { armF: [90, 70], armB: [70, 80], lean: -2 },
  think: { armF: [20, 150], armB: [-6, 10], lean: 2 },
  shrug: { armF: [60, 110], armB: [-60, -110], lean: -3 },
  crouch: { legF: [70, 110], legB: [10, 110], armF: [60, 30], armB: [30, 40], lean: 30, sq: .9 },
  ride: { legF: [70, 90], legB: [40, 100], armF: [76, 20], armB: [70, 24], lean: 28 },
  carry: { armF: [10, 30], armB: [-14, 10] },
};
function mixP(a, b, k, sw=.5) { const o = {}; for (const key of new Set([...Object.keys(SDEF), ...Object.keys(a), ...Object.keys(b)])) {
  const va = a[key] ?? SDEF[key], vb = b[key] ?? SDEF[key];
  if (typeof va === 'number' && typeof vb === 'number') o[key] = lerp(va, vb, k); else if (Array.isArray(va) && Array.isArray(vb)) o[key] = va.map((v, i) => lerp(v, vb[i], k)); else o[key] = k < sw ? va : vb; } return o; }
const PK = n => typeof n === 'string' ? SP[n] : n;
function poseAt(keys, t) { if (t <= keys[0][0]) return mixP(PK(keys[0][1]), PK(keys[0][1]), 1);
  for (let i = 1; i < keys.length; i++) { const [t1, p1, e = 'io'] = keys[i]; if (t < t1) { const [t0, p0] = keys[i - 1]; return mixP(PK(p0), PK(p1), E[e]((t - t0)/(t1 - t0))); } }
  const L = keys[keys.length - 1]; return mixP(PK(L[1]), PK(L[1]), 1); }
const idle = (t, sd=1) => ({ armF: [10 + 3*Math.sin(t*2 + sd), 10], armB: [-10 + 3*Math.sin(t*2 + sd + 1), 10], headY: Math.sin(t*2.4 + sd)*1.5 });
// smear: ghost copies of a stickman at earlier times (pass a fn(t) -> svg)
const smear = (fn, t, n=3, dt=.03) => { let s = ''; for (let i = n; i >= 1; i--) s += `<g opacity="${.12 + .08*(n - i)}">${fn(t - i*dt)}</g>`; return s; };
// little marks
const exclaim = (x, y, s=1, col=ACC) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6,-60 L6,-60 L4,-14 L-4,-14 Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cy="0" r="7" fill="${col}" stroke="${INK}" stroke-width="4"/></g>`;
const qmark = (x, y, s=1) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Bebas Neue" font-size="${110*s}" fill="${INK}">?</text>`;
const sweat = (x, y, s=1) => `<path transform="translate(${x},${y}) scale(${s})" d="M0,-20 C8,-6 10,4 0,10 C-10,4 -8,-6 0,-20 Z" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>`;
const motion = (x, y, n=3, len=60, dir=-1, sp=16) => { let s = ''; for (let i = 0; i < n; i++) s += `<path d="M${x},${y + i*sp} l${dir*len*(1 - i*.2)},0" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`; return s; };

// ---------------------------------------------------------------- T. rex (ink style, side view facing right)
// o: {x,y,s,flip, ph (walk phase), walk (0..1 amplitude), jaw (0..1), head (deg, + = up), eye ([dx,dy]), blink, shiver, sneeze}
function trex(o) {
  const s = o.s || 1, ph = (o.ph || 0)*2*Math.PI, wk = o.walk ?? 0, jaw = o.jaw || 0, head = o.head || 0, t = o.t || 0;
  const bob = -Math.abs(Math.sin(ph))*14*wk + Math.sin(t*1.6)*3, tail = Math.sin(ph + 1)*8*wk + Math.sin(t*1.1)*4;
  const shv = o.shiver ? Math.sin(t*70)*3*o.shiver : 0, lean = o.lean || 0;
  const leg = (phase, near) => { const a = Math.sin(phase), b = Math.cos(phase);
    const hip = [10, -330], th = 14 + 30*a*wk, kn = -46 - 34*Math.max(0, b)*wk, an = 48 + 30*Math.max(0, b)*wk;
    const k1 = [hip[0] + Math.sin(rad(th))*170, hip[1] + Math.cos(rad(th))*170];
    const k2 = [k1[0] + Math.sin(rad(th + kn))*140, k1[1] + Math.cos(rad(th + kn))*140];
    const k3 = [k2[0] + Math.sin(rad(th + kn + an))*84, k2[1] + Math.cos(rad(th + kn + an))*84];
    const col = near ? WHITE : '#DEDAD0', P = [k1, k2, k3].map(q => q.join(',')).join(' ');
    let g = `<polyline points="${P}" fill="none" stroke="${INK}" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${P}" fill="none" stroke="${col}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (const [dx, dy] of [[82, 6], [70, -10], [58, 16]]) g += `<path d="M${k3[0] - 10},${k3[1] + 6} L${k3[0] + dx},${k3[1] + 8 + dy*.4}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${k3[0] - 10},${k3[1] + 6} L${k3[0] + dx},${k3[1] + 8 + dy*.4}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    g += `<path d="M${k3[0] - 34},${k3[1] + 8} L${k3[0] - 10},${k3[1] + 6}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>`;
    // drumstick thigh over the knee joint
    g += `<g transform="translate(${hip[0]},${hip[1]}) rotate(${-th})"><path d="M-62,-30 C-80,60 -50,150 0,178 C40,160 70,70 64,-20 C50,-70 -50,-70 -62,-30 Z" fill="${col}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/></g>`;
    return g; };
  let g = `<g transform="translate(${o.x + shv},${o.y}) scale(${o.flip ? -s : s},${s})"><ellipse cx="0" cy="8" rx="440" ry="26" fill="${INK}" opacity=".13"/>`;
  g += `<g transform="translate(0,${bob}) rotate(${lean},0,-330)">`;
  g += leg(ph + Math.PI, false);
  // tail + body (one shape)
  g += `<path d="M-60,-452 C-260,-450 -470,${-430 + tail} -720,${-392 + tail*2} C-736,${-386 + tail*2} -730,${-372 + tail*2} -700,${-370 + tail*2} C-600,${-360 + tail*1.5} -480,${-350 + tail} -260,-322 C-160,-300 -100,-262 -20,-236 C80,-216 190,-240 236,-300 C262,-334 268,-372 250,-406 C206,-450 110,-462 -60,-452 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*1.15}" stroke-linejoin="round"/>`;
  g += `<path d="M-430,-380 C-300,-370 -200,-350 -120,-330 M60,-262 C120,-262 170,-280 196,-300" stroke="${INK}" stroke-width="5" fill="none" opacity=".3"/>`;
  // tiny two-fingered arms
  const arm = Math.sin(t*3)*6 + (o.armWave || 0);
  g += `<path d="M206,-316 L250,${-276 + arm} L280,${-286 + arm} M250,${-276 + arm} L276,${-264 + arm}" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/><path d="M206,-316 L250,${-276 + arm} L280,${-286 + arm} M250,${-276 + arm} L276,${-264 + arm}" fill="none" stroke="${WHITE}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  // neck + skull, pivot at the shoulders
  g += `<g transform="rotate(${-head},220,-400)">`;
  g += `<path d="M170,-438 C200,-470 230,-498 262,-516 C300,-536 360,-544 420,-536 C480,-528 532,-512 548,-488 C556,-474 552,-458 540,-452 L360,-444 C320,-430 300,-404 290,-372 C276,-336 236,-322 204,-336 C180,-350 166,-400 170,-438 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*1.15}" stroke-linejoin="round"/>`;
  const J = jaw*24;
  g += `<g transform="rotate(${J},318,-440)"><path d="M300,-438 C360,-446 450,-452 528,-452 C538,-450 538,-438 528,-432 C460,-414 380,-402 318,-394 C300,-400 294,-424 300,-438 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/>` +
    (jaw > .05 ? `<path d="M340,-447 l10,14 l10,-14 l10,14 l10,-14 l10,14 l10,-14 l10,14 l10,-14 l10,14 l10,-14 l10,14 l10,-14 l10,14 l10,-14 l10,14 l10,-14" fill="${WHITE}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` : '') + `</g>`;
  if (jaw > .05) g += `<path d="M350,-446 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12" fill="${WHITE}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` + `<path d="M330,-444 Q420,${-444 + J*4} 520,-450" fill="none" stroke="${INK}" stroke-width="0"/>`;
  else g += `<path d="M330,-446 C400,-450 470,-454 536,-458" stroke="${INK}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M352,-445 l4,9 M376,-447 l4,9 M400,-448 l4,9 M424,-449 l4,9 M448,-451 l4,9 M472,-452 l4,9 M496,-454 l4,9" stroke="${INK}" stroke-width="4"/>`;
  const [ex, ey] = o.eye || [0, 0], bl = o.blink || 0;
  g += `<path d="M352,-510 Q382,-532 410,-512" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  g += bl > .7 ? `<path d="M364,-494 L398,-494" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` : `<circle cx="${382 + ex}" cy="${-494 + ey}" r="${13*(1 - bl*.6)}" fill="${o.eyeCol || INK}"/><circle cx="${378 + ex}" cy="${-498 + ey}" r="4" fill="${WHITE}"/>`;
  g += `<path d="M512,-490 q10,-4 16,4" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M300,-470 C290,-440 296,-420 306,-410" stroke="${INK}" stroke-width="5" fill="none" opacity=".4"/>`;
  g += `</g>`;
  g += leg(ph, true);
  g += `</g></g>`;
  return g;
}
function sauropod(x, y, s, t, flip=false, neck=0) {
  const nk = Math.sin(t*.8)*4 + neck;
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})"><path d="M-500,-180 C-380,-260 -200,-300 -40,-300 C60,-300 120,-280 160,-250 C200,-${360 + nk*2} 220,-${520 + nk*4} 260,-${600 + nk*5} C280,-${630 + nk*5} 330,-${630 + nk*5} 330,-${600 + nk*5} C300,-${540 + nk*4} 280,-${400 + nk*2} 260,-220 C240,-160 140,-150 40,-150 L-200,-150 C-350,-150 -450,-160 -500,-180 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*1.1}" stroke-linejoin="round"/><circle cx="${310}" cy="${-604 - nk*5}" r="6" fill="${INK}"/>${[-220, -120, 40, 120].map((lx, i) => `<rect x="${lx - 26}" y="-170" width="52" height="170" rx="20" fill="${i % 2 ? '#E3DFD5' : WHITE}" stroke="${INK}" stroke-width="${LW}"/>`).join('')}</g>`; }
function trike(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-260,-120 C-240,-220 -60,-250 80,-220 L140,-300 L170,-290 L150,-210 C190,-200 230,-160 240,-110 L290,-140 L280,-110 L250,-80 C200,-50 100,-60 40,-60 L-200,-60 C-250,-70 -270,-90 -260,-120 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/><path d="M80,-220 C60,-300 120,-330 170,-300" fill="none" stroke="${INK}" stroke-width="${LW}"/>${[-180, -60, 60, 160].map(lx => `<rect x="${lx - 22}" y="-80" width="44" height="80" rx="16" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}"/>`).join('')}<circle cx="190" cy="-160" r="6" fill="${INK}"/></g>`; }
function stego(x, y, s) { let pl2 = ''; for (let i = 0; i < 7; i++) pl2 += `<path d="M${-220 + i*70},${-200 + Math.abs(i - 3)*14} l35,-70 l35,70 Z" fill="${i === 3 ? ACC : WHITE}" stroke="${INK}" stroke-width="${LW*.8}" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${pl2}<path d="M-360,-120 C-280,-220 -100,-240 60,-220 C160,-210 220,-170 260,-130 C280,-110 270,-90 240,-90 L-200,-70 C-280,-70 -330,-90 -360,-120 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/>${[-200, -80, 60, 160].map(lx => `<rect x="${lx - 22}" y="-90" width="44" height="90" rx="16" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}"/>`).join('')}<circle cx="236" cy="-120" r="5" fill="${INK}"/></g>`; }

// ---------------------------------------------------------------- props / sets (ground line = y)
function building(x, y, w, h, sign='', acc=false) {
  let g = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*.8}"/>`;
  for (let r = 0; r < Math.floor((h - 150)/110); r++) for (let c = 0; c < Math.floor((w - 40)/90); c++) g += `<rect x="${x + 30 + c*90}" y="${y - h + 40 + r*110}" width="50" height="64" fill="${GREY}" stroke="${INK}" stroke-width="5"/>`;
  if (sign) g += `<rect x="${x + 16}" y="${y - 150}" width="${w - 32}" height="48" fill="${acc ? ACC : PAPER}" stroke="${INK}" stroke-width="6"/><text x="${x + w/2}" y="${y - 114}" text-anchor="middle" font-family="Bebas Neue" font-size="40" fill="${acc ? WHITE : INK}">${sign}</text><rect x="${x + w/2 - 40}" y="${y - 96}" width="80" height="96" fill="${GREY}" stroke="${INK}" stroke-width="6"/>`;
  return g;
}
function bus(x, y, s, t=0, flip=false, len=1) {
  const W = 600*len, n = Math.round(5*len);
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})"><rect x="${-W/2}" y="-330" width="${W}" height="300" rx="34" fill="${ACC}" stroke="${INK}" stroke-width="${LW}"/>${[0, 1].map(r => [...Array(n)].map((_, c) => `<rect x="${-W/2 + 30 + c*(W - 60)/n}" y="${-305 + r*130}" width="${(W - 60)/n - 24}" height="70" rx="8" fill="${WHITE}" stroke="${INK}" stroke-width="6"/>`).join('')).join('')}<rect x="${-W/2}" y="-190" width="${W}" height="12" fill="${INK}" opacity=".2"/>${[-W/2 + 110, W/2 - 110].map(wx => `<circle cx="${wx}" cy="-28" r="40" fill="${INK}"/><circle cx="${wx}" cy="-28" r="16" fill="${GREY}"/>`).join('')}</g>`;
}
function car(x, y, s, flip=false, fill=WHITE) {
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})"><path d="M-170,-40 L-160,-90 L-90,-96 L-50,-150 L70,-150 L120,-96 L170,-86 L176,-40 Z" fill="${fill}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/><path d="M-36,-138 L-70,-98 L0,-98 L0,-138 Z M16,-138 L16,-98 L96,-98 L62,-138 Z" fill="${GREY}" stroke="${INK}" stroke-width="5"/>${[-100, 110].map(wx => `<circle cx="${wx}" cy="-34" r="32" fill="${INK}"/><circle cx="${wx}" cy="-34" r="12" fill="${GREY}"/>`).join('')}</g>`;
}
function phoneBox(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-55" y="-300" width="110" height="300" rx="8" fill="${ACC}" stroke="${INK}" stroke-width="${LW*.8}"/><rect x="-42" y="-250" width="84" height="170" fill="${WHITE}" stroke="${INK}" stroke-width="5"/><path d="M-42,-195 L42,-195 M-42,-140 L42,-140 M0,-250 L0,-80" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-320" width="120" height="30" rx="10" fill="${ACC}" stroke="${INK}" stroke-width="6"/></g>`; }
function trafficLight(x, y, state, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-6" y="-420" width="12" height="420" fill="${INK}"/><rect x="-36" y="-560" width="72" height="170" rx="16" fill="${WHITE}" stroke="${INK}" stroke-width="7"/>${[0, 1, 2].map(i => `<circle cy="${-530 + i*52}" r="18" fill="${i === state ? ACC : GREY}" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`; }
function tree(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-10" y="-150" width="20" height="150" fill="${WHITE}" stroke="${INK}" stroke-width="6"/><circle cy="-210" r="90" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*.8}"/><circle cx="-50" cy="-170" r="50" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*.8}"/><circle cx="55" cy="-180" r="56" fill="${WHITE}" stroke="${INK}" stroke-width="${LW*.8}"/><circle cy="-210" r="78" fill="${WHITE}"/></g>`; }
function bike(x, y, s, ph=0) {   // origin = ground under the middle of the bike
  const w = r => `<circle r="62" fill="none" stroke="${INK}" stroke-width="9"/><path d="M0,-62 L0,62 M-62,0 L62,0" stroke="${INK}" stroke-width="3" transform="rotate(${r})"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><g transform="translate(-110,-62)">${w(ph*360)}</g><g transform="translate(110,-62)">${w(ph*360)}</g><path d="M-110,-62 L-30,-150 L80,-150 L110,-62 M-30,-150 L0,-62 L-110,-62 M80,-150 L70,-190 L100,-196 M-40,-160 L-10,-160" fill="none" stroke="${INK}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/><circle cx="0" cy="-62" r="14" fill="${WHITE}" stroke="${INK}" stroke-width="6"/></g>`;
}
function jeep(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-200,-50 L-200,-150 L-60,-150 L-30,-210 L90,-210 L90,-150 L200,-140 L210,-50 Z" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}" stroke-linejoin="round"/><rect x="-20" y="-200" width="90" height="46" fill="${GREY}" stroke="${INK}" stroke-width="5"/>${[-120, 130].map(wx => `<circle cx="${wx}" cy="-46" r="46" fill="${INK}"/><circle cx="${wx}" cy="-46" r="18" fill="${GREY}"/>`).join('')}</g>`; }
function phone(x, y, rot=0, rec=1) { return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-26" y="-46" width="52" height="92" rx="9" fill="${INK}"/><rect x="-20" y="-38" width="40" height="70" rx="4" fill="${WHITE}"/>${rec ? `<circle cx="0" cy="-20" r="6" fill="${ACC}"/>` : ''}</g>`; }
function germ(x, y, r, t, i=0, col=ACC) { let g = `<g transform="translate(${x},${y}) rotate(${t*40 + i*30})"><circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="${Math.max(3, r*.14)}"/>`;
  for (let k = 0; k < 8; k++) { const a = k*Math.PI/4; g += `<path d="M${Math.cos(a)*r},${Math.sin(a)*r} L${Math.cos(a)*r*1.45},${Math.sin(a)*r*1.45}" stroke="${INK}" stroke-width="${Math.max(3, r*.12)}" stroke-linecap="round"/><circle cx="${Math.cos(a)*r*1.5}" cy="${Math.sin(a)*r*1.5}" r="${r*.13}" fill="${INK}"/>`; }
  return g + `</g>`; }
function gauge(x, y, r, v, max, label, col=ACC) {
  const a0 = -210, a1 = 30, f = clamp(v/max, 0, 1.05), ang = rad(a0 + (a1 - a0)*f);
  let s = `<g transform="translate(${x},${y})"><circle r="${r}" fill="${WHITE}" stroke="${INK}" stroke-width="${LW}"/>`;
  for (let i = 0; i <= 10; i++) { const a = rad(a0 + (a1 - a0)*i/10); s += `<line x1="${Math.cos(a)*(r - 14)}" y1="${Math.sin(a)*(r - 14)}" x2="${Math.cos(a)*(r - (i % 5 ? 30 : 46))}" y2="${Math.sin(a)*(r - (i % 5 ? 30 : 46))}" stroke="${INK}" stroke-width="${i % 5 ? 4 : 8}" stroke-linecap="round"/>`; }
  s += `<line x1="0" y1="0" x2="${Math.cos(ang)*(r - 40)}" y2="${Math.sin(ang)*(r - 40)}" stroke="${col}" stroke-width="14" stroke-linecap="round"/><circle r="16" fill="${INK}"/><text y="${r*.6}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${r*.24}" fill="${INK}">${label}</text></g>`;
  return s;
}

// ---------------------------------------------------------------- type
const head = (t, a, x, y, str, size=150, col=INK, hl=null, rot=0) => t < a ? '' : `<g transform="translate(${x},${y}) scale(${pop(t, a, .28)}) rotate(${rot})">${hl ? `<rect x="${-str.length*size*.21 - 20}" y="${-size*.78}" width="${str.length*size*.42 + 40}" height="${size*.92}" fill="${hl}"/>` : ''}<text text-anchor="middle" font-family="Bebas Neue" font-size="${size}" fill="${col}">${str}</text></g>`;
function tag(t, a, x, y, str, bg=INK, fg=WHITE, size=44, until=1e9) {   // label chip, Inter black
  if (t < a || t > until) return ''; const w = str.length*size*.62 + 50;
  return `<g transform="translate(${x},${y}) scale(${pop(t, a, .25)})"><rect x="${-w/2}" y="${-size*.95}" width="${w}" height="${size*1.45}" fill="${bg}" stroke="${INK}" stroke-width="5"/><text y="${size*.18}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${size}" fill="${fg}" letter-spacing="1">${str}</text></g>`;
}

// ---------------------------------------------------------------- camera + fx
function camAt(keys, t) { if (t <= keys[0][0]) return { ...keys[0][1] };
  for (let i = 1; i < keys.length; i++) { const [t1, c1, e = 'io'] = keys[i]; if (t < t1) { const [t0, c0] = keys[i - 1]; const k = E[e]((t - t0)/(t1 - t0)); const o = {}; for (const kk in c1) o[kk] = lerp(c0[kk] ?? c1[kk], c1[kk], k); return o; } }
  return { ...keys[keys.length - 1][1] }; }
function shakeAt(t, ev) { let x = 0, y = 0, r = 0; for (const [t0, a, d] of ev) { if (t < t0 || t > t0 + d) continue; const k = 1 - (t - t0)/d, tr = k*k*a; x += noise1(t, 63, t0)*tr; y += noise1(t, 71, t0 + 5)*tr*.8; r += noise1(t, 41, t0 + 9)*tr*.05; } return { sx: x, sy: y, sr: r }; }
const camT = c => `translate(${960 + (c.sx||0)},${540 + (c.sy||0)}) rotate(${c.r||0}) scale(${c.z}) translate(${-c.x},${-c.y})`;
// shots: [{t, cam: keys | fn, draw(t, c, W)}], W(svg, parallax=1) wraps world content in the camera transform
function playShots(t, SHOTS, shakes=[]) {
  let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1].t) i++;
  const S = SHOTS[i]; let c = typeof S.cam === 'function' ? S.cam(t) : camAt(S.cam, t);
  const q = shakeAt(t, shakes); c = { ...c, sx: q.sx, sy: q.sy, r: (c.r||0) + q.sr };
  const W = (svg, p=1, f='') => { const cc = { x: lerp(960, c.x, p), y: lerp(540, c.y, p), z: Math.pow(c.z, p), r: c.r*p, sx: c.sx*p, sy: c.sy*p }; return `<g transform="${camT(cc)}"${f ? ` filter="url(#${f})"` : ''}>${svg}</g>`; };
  return S.draw(t, c, W, { t0: S.t, t1: i + 1 < SHOTS.length ? SHOTS[i + 1].t : 1e9, i });
}
function focusLines(t, cx=960, cy=540, op=.9, inner=420, col=INK, n=70) { const f = Math.floor(t*30); let s = `<g opacity="${op}">`;
  for (let i = 0; i < n; i++) { const a = (i + hash(f*13 + i)*.8)/n*2*Math.PI, w = .006 + hash(f*7 + i*3)*.016, r0 = inner + hash(f*5 + i)*260;
    s += `<path d="M${cx + Math.cos(a - w)*1800},${cy + Math.sin(a - w)*1800} L${cx + Math.cos(a)*r0},${cy + Math.sin(a)*r0} L${cx + Math.cos(a + w)*1800},${cy + Math.sin(a + w)*1800} Z" fill="${col}"/>`; } return s + '</g>'; }
function speedLines(t, n=20, op=.7, col=INK, dir=-1, y0=0, y1=1080) { const f = Math.floor(t*30); let s = `<g opacity="${op}">`;
  for (let i = 0; i < n; i++) { const y = y0 + hash(i*9.1 + f*.37)*(y1 - y0), len = 200 + hash(i + f)*600, x = hash(i*3.3 + f*1.7)*2400 - 240;
    s += `<rect x="${dir > 0 ? x : 1920 - x - len}" y="${y}" width="${len}" height="${3 + hash(i*5 + f)*6}" fill="${col}"/>`; } return s + '</g>'; }
const flash = (t, a, col=WHITE, d=.2, op=.9) => t < a || t > a + d ? '' : `<rect width="1920" height="1080" fill="${col}" opacity="${(1 - (t - a)/d)*op}"/>`;
function finish(svg, t) {   // paper grain + vignette over everything (cheap: one turbulence rect)
  return DEFS + svg + `<rect width="1920" height="1080" filter="url(#paper)" opacity=".09"/><rect width="1920" height="1080" fill="url(#vig)"/>`;
}
function impactFrame(svg, t, t0) { const f = Math.floor((t - t0)*30); if (t < t0 || f > 2) return svg;
  return f === 1 ? `<g filter="url(#inv)">${svg}</g><rect width="1920" height="1080" fill="${ACC}" opacity=".35" style="mix-blend-mode:multiply"/>` : `<g filter="url(#inv)">${svg}</g>`; }
