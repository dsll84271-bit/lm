// ============================================================================
// Day One Hero Ep3 (teleportation): shared FX + sets. Loaded after rig2.js / world2.js.
// ============================================================================
const TPC = '#5CF2FF', TPW = '#E9FFFF';
const RR = { x: 0, y: 700, z: 1 };
const EP3DEFS = `<defs>
<linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2A6B"/><stop offset=".42" stop-color="#C9568A"/><stop offset=".72" stop-color="#FF9D62"/><stop offset="1" stop-color="#FFDA9A"/></linearGradient>
<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A6FA8"/><stop offset=".5" stop-color="#3E93B4"/><stop offset="1" stop-color="#6CC7C6"/></linearGradient>
<linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C68A"/><stop offset=".25" stop-color="#F3D7A0"/><stop offset="1" stop-color="#F7E2B5"/></linearGradient>
<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E8FD8"/><stop offset=".6" stop-color="#F3B7B0"/><stop offset="1" stop-color="#FFE2B8"/></linearGradient>
<linearGradient id="nightG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1338"/><stop offset=".7" stop-color="#26306E"/><stop offset="1" stop-color="#3D3F7E"/></linearGradient>
<linearGradient id="snowSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D3F8F"/><stop offset=".55" stop-color="#4E86D8"/><stop offset="1" stop-color="#BFDDFF"/></linearGradient>
<linearGradient id="poolG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FD0F0"/><stop offset="1" stop-color="#1E7FC0"/></linearGradient>
<radialGradient id="oceanG" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#5DB2FF"/><stop offset=".7" stop-color="#2F6FD0"/><stop offset="1" stop-color="#1B3F94"/></radialGradient>
<radialGradient id="globeSh" cx="30%" cy="28%" r="80%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#050A30" stop-opacity=".55"/></radialGradient>
<radialGradient id="atmo" cx="50%" cy="50%" r="50%"><stop offset=".86" stop-color="#7FD3FF" stop-opacity="0"/><stop offset=".93" stop-color="#7FD3FF" stop-opacity=".55"/><stop offset="1" stop-color="#7FD3FF" stop-opacity="0"/></radialGradient>
<radialGradient id="tpGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/><stop offset=".3" stop-color="${TPC}" stop-opacity=".8"/><stop offset="1" stop-color="${TPC}" stop-opacity="0"/></radialGradient>
<radialGradient id="lampG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".75"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
</defs>`;

// ---------------------------------------------------------------- teleport
// Dex visibility/squash around a teleport. tIn: appears (slit -> overshoot), tOut: leaves (collapses to a slit).
function tpK(t, tIn=-1e9, tOut=1e9) {
  if (t < tIn || t > tOut + .1) return null;
  if (t < tIn + .22) { const k = seg(t, tIn, tIn + .22); return { sx: lerp(.04, 1, E.o(k)), sy: lerp(1.45, 1, E.o2(k)) }; }
  if (t > tOut) { const k = seg(t, tOut, tOut + .1); return { sx: lerp(1, .03, E.in(k)), sy: lerp(1, 1.5, k) }; }
  return { sx: 1, sy: 1 };
}
function tpWrap(t, svg, x, cy, tIn=-1e9, tOut=1e9) {
  const k = tpK(t, tIn, tOut); if (!k) return '';
  if (k.sx === 1 && k.sy === 1) return svg;
  const glow = Math.max(0, 1 - k.sx);
  return `<g transform="translate(${x},${cy}) scale(${k.sx},${k.sy}) translate(${-x},${-cy})">${svg}</g>` +
    (glow > .05 ? `<ellipse cx="${x}" cy="${cy}" rx="${30 + 60*glow}" ry="${260*glow + 40}" fill="url(#tpGlow)" opacity="${glow}"/>` : '');
}
// the burst at a teleport point. mode 'in' (arrive: air shoved out) or 'out' (leave: air slams in, implosion first)
function popFX(t, t0, x, y, sc=1, mode='in') {
  let s = '';
  if (mode === 'out' && t > t0 - .14 && t < t0) {   // air rushing in
    const k = seg(t, t0 - .14, t0);
    for (let i = 0; i < 14; i++) { const a = i/14*6.283 + hash(i)*.3, r0 = (420 - 360*E.in(k))*sc, r1 = r0 + 120*sc;
      s += `<path d="M${x + Math.cos(a)*r1},${y + Math.sin(a)*r1*.8} L${x + Math.cos(a)*r0},${y + Math.sin(a)*r0*.8}" stroke="${TPW}" stroke-width="${6*sc}" stroke-linecap="round" opacity="${.3 + .6*k}"/>`; }
  }
  if (t < t0 || t > t0 + .6) return s;
  const k = seg(t, t0, t0 + .6), e = easeOut(k), d = t - t0;
  if (d < .07) s += `<ellipse cx="${x}" cy="${y}" rx="${70*sc}" ry="${340*sc}" fill="#fff"/><ellipse cx="${x}" cy="${y}" rx="${260*sc}" ry="${60*sc}" fill="#fff" opacity=".9"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${(40 + 380*e)*sc}" fill="none" stroke="${TPC}" stroke-width="${(26*(1 - k) + 2)*sc}" opacity="${1 - k}"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${(20 + 300*easeOut(seg(t, t0 + .04, t0 + .6)))*sc}" fill="none" stroke="#fff" stroke-width="${10*(1 - k)*sc}" opacity="${(1 - k)*.9}"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${(200 + 200*e)*sc}" fill="url(#tpGlow)" opacity="${.7*(1 - k)}"/>`;
  for (let i = 0; i < 12; i++) { const a = i/12*6.283 + hash(i + 3)*.4, r0 = (60 + 260*e)*sc, r1 = r0 + (80 + 120*hash(i))*(1 - k)*sc;
    s += `<path d="M${x + Math.cos(a)*r0},${y + Math.sin(a)*r0} L${x + Math.cos(a)*r1},${y + Math.sin(a)*r1}" stroke="${i % 3 ? TPC : '#fff'}" stroke-width="${9*sc}" stroke-linecap="round" opacity="${1 - k}"/>`; }
  for (let i = 0; i < 10; i++) { const a = hash(i*7 + 1)*6.283, r = (80 + 420*hash(i*3)*e)*sc, sz = (8 + 8*hash(i))*sc*(1 - k);
    s += `<rect x="${x + Math.cos(a)*r - sz/2}" y="${y + Math.sin(a)*r - sz/2}" width="${sz}" height="${sz}" fill="${TPW}" transform="rotate(45,${x + Math.cos(a)*r},${y + Math.sin(a)*r})"/>`; }
  return s;
}
// screen-space ripple for the "pop" sound (air shock)
function shockScreen(t, t0, cx=960, cy=540) {
  if (t < t0 || t > t0 + .45) return ''; const k = seg(t, t0, t0 + .45);
  return `<circle cx="${cx}" cy="${cy}" r="${200 + 1500*easeOut(k)}" fill="none" stroke="#fff" stroke-width="${40*(1 - k)}" opacity="${.35*(1 - k)}"/>`;
}

// ---------------------------------------------------------------- props / small things
function gull(x, y, s, t, o={}) {   // seagull, facing left. o.tilt head tilt, o.walk 0/1, o.squawk
  const st = o.walk ? Math.sin(t*14)*10 : 0, tilt = o.tilt || 0, sq = o.squawk ? 1 : 0, fly = o.fly;
  if (fly) { const w = Math.sin(t*14)*40;
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 Q-40,${-30 - w} -90,${-10 - w*1.4} M0,0 Q40,${-30 - w} 90,${-10 - w*1.4}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse rx="22" ry="12" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`; }
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-6,-40 L${-10 + st},0 M10,-40 L${12 - st},0" stroke="#F09A3E" stroke-width="7" stroke-linecap="round"/>
  <path d="M-60,-80 Q-50,-120 0,-118 Q70,-114 96,-96 L120,-104 L104,-82 Q80,-50 20,-40 Q-40,-36 -60,-80 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-20,-104 Q40,-108 90,-92 Q60,-70 10,-70 Q-20,-76 -20,-104 Z" fill="#B9C2D6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <g transform="translate(-54,-128) rotate(${tilt})"><circle r="34" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-10" cy="-6" r="7" fill="${INK}"/><circle cx="-12" cy="-8" r="2.4" fill="#fff"/>
   <path d="M-30,4 L-74,${8 - sq*6} L-30,16 Z" fill="#FFC21F" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>${sq ? `<path d="M-30,16 L-70,${24 + sq*8} L-30,22 Z" fill="#FFC21F" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` : ''}<circle cx="-54" cy="10" r="4" fill="#E8463C"/></g></g>`;
}
function flagPole(x, y, t, s=1) {
  const w = Math.sin(t*5 + x)*10;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-6" y="-420" width="12" height="420" fill="#EEE" stroke="${INK}" stroke-width="5"/>
  <path d="M6,-410 Q70,${-420 + w} 140,${-410 - w*.5} L140,-330 Q70,${-340 - w} 6,-330 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/><path d="M6,-370 Q70,${-376 + w*.2} 140,${-370 - w*.7} L140,-330 Q70,${-340 - w} 6,-330 Z" fill="#FFD23F"/>
  <path d="M6,-410 Q70,${-420 + w} 140,${-410 - w*.5} L140,-330 Q70,${-340 - w} 6,-330 Z" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
}
function surfboard(x, y, s=1, rot=6, col='#3D8BFF') { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M0,-420 Q60,-300 54,-60 Q40,10 0,20 Q-40,10 -54,-60 Q-60,-300 0,-420 Z" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M0,-400 L0,10" stroke="#fff" stroke-width="10" opacity=".8"/><path d="M-30,-250 Q0,-230 30,-250" stroke="#FFD23F" stroke-width="8" fill="none"/></g>`; }
function towel(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-160,-10 L150,-24 L170,18 L-150,30 Z" fill="#FF7EB6" stroke="${INK}" stroke-width="6"/><path d="M-110,-12 L-100,28 M-40,-15 L-30,25 M30,-18 L40,22 M100,-21 L110,19" stroke="#fff" stroke-width="12"/></g>`; }
function clockF(x, y, r, h, m, col='#fff') {
  const ha = (h % 12 + m/60)*30, ma = m*6;
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="${r*.09}"/>${[...Array(12)].map((_, i) => `<circle cx="${Math.sin(i*.5236)*r*.78}" cy="${-Math.cos(i*.5236)*r*.78}" r="${r*.04}" fill="${INK}"/>`).join('')}
  <path d="M0,0 L${Math.sin(rad(ha))*r*.48},${-Math.cos(rad(ha))*r*.48}" stroke="${INK}" stroke-width="${r*.09}" stroke-linecap="round"/><path d="M0,0 L${Math.sin(rad(ma))*r*.72},${-Math.cos(rad(ma))*r*.72}" stroke="${INK}" stroke-width="${r*.06}" stroke-linecap="round"/><circle r="${r*.07}" fill="#E8463C"/></g>`;
}
function thought(x, y, s, inner, t, a) {   // thought bubble; inner drawn in a 0..1 box of 360x220 centred at 0,0
  const k = pop(t, a, .35); if (t < a) return '';
  return `<g transform="translate(${x},${y}) scale(${s*k})"><circle cx="-210" cy="190" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-170" cy="150" r="26" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <path d="M-190,0 C-230,-80 -150,-150 -80,-130 C-40,-190 60,-190 100,-130 C170,-160 240,-80 200,0 C250,70 170,150 100,120 C60,170 -40,170 -80,120 C-160,150 -240,70 -190,0 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <clipPath id="thC"><path d="M-170,0 C-200,-70 -140,-125 -80,-108 C-40,-160 60,-160 96,-108 C150,-135 215,-70 180,0 C220,60 160,125 96,100 C60,145 -40,145 -80,100 C-150,125 -210,60 -170,0 Z"/></clipPath><g clip-path="url(#thC)">${inner}</g></g>`;
}
function beachMini(t) {   // tiny beach for thought bubbles / postcards (approx -200..200 x -150..150)
  return `<rect x="-260" y="-200" width="520" height="400" fill="#FFB067"/><circle cx="60" cy="-40" r="60" fill="#FFE07A"/><rect x="-260" y="-10" width="520" height="70" fill="#3E93B4"/><path d="M-260,${50 + Math.sin(t*3)*6} Q-130,${30} 0,${50} T260,${50}" fill="#F3D7A0" stroke="none"/><rect x="-260" y="58" width="520" height="160" fill="#F3D7A0"/>
  <g transform="translate(-120,70)"><rect x="-4" y="-150" width="8" height="150" fill="#8A5A3B"/><path d="M0,-150 Q-60,-170 -90,-130 M0,-150 Q60,-175 90,-128 M0,-150 Q-30,-200 -70,-190 M0,-150 Q40,-200 80,-190" stroke="#3E9E52" stroke-width="18" fill="none" stroke-linecap="round"/></g>`;
}

// ---------------------------------------------------------------- Sydney beach (sunset). Sand surface = GY.
const SAND = GY;
function beachW(t, L, blur='', o={}) {
  let sky = `<rect x="-6000" y="-3000" width="12000" height="${3000 + GY - 330}" fill="url(#sunset)"/><circle cx="-700" cy="${GY - 520}" r="760" fill="url(#sunG)" opacity=".8"/><circle cx="-700" cy="${GY - 520}" r="110" fill="#FFF0B8"/>`;
  for (let i = 0; i < 6; i++) sky += `<ellipse cx="${-2600 + i*1000 + (t*10 % 200)}" cy="${80 + (i%3)*90}" rx="${260 + (i%2)*120}" ry="26" fill="#FFC9A0" opacity=".5"/>`;
  let mid = `<rect x="-6000" y="${GY - 340}" width="12000" height="420" fill="url(#seaG)"/>`;
  mid += `<path d="M-6000,${GY - 340} L-2200,${GY - 340} L-1800,${GY - 470} L-1500,${GY - 520} L-1250,${GY - 500} L-1000,${GY - 420} L-900,${GY - 340} Z" fill="#5E6B8A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  for (let i = 0; i < 7; i++) mid += `<rect x="${-1720 + i*90}" y="${GY - 520 - (i%3)*40 + (i === 3 ? -60 : 0)}" width="70" height="${120 + (i%3)*40 + (i === 3 ? 60 : 0)}" fill="#7C86A6" stroke="${INK}" stroke-width="4"/>`;
  mid += `<path d="M1400,${GY - 340} L1700,${GY - 430} L2100,${GY - 460} L2500,${GY - 400} L2700,${GY - 340} Z" fill="#6A7593" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  for (let i = 0; i < 9; i++) mid += `<rect x="${-900 + i*160 + Math.sin(t*1.5 + i)*20}" y="${GY - 300 + (i%4)*55}" width="${70 + (i%3)*40}" height="7" rx="3" fill="#FFE7B0" opacity="${.5 + .3*Math.sin(t*3 + i)}"/>`;
  for (let i = 0; i < 3; i++) { const yy = GY - 260 + i*70, ph = t*1.2 + i; mid += `<path d="M-6000,${yy} ${[...Array(60)].map((_, j) => `Q${-6000 + j*200 + 100},${yy - 14 + 6*Math.sin(ph + j)} ${-6000 + (j + 1)*200},${yy}`).join(' ')}" stroke="#BFF0F0" stroke-width="6" fill="none" opacity=".55"/>`; }
  let near = `<rect x="-6000" y="${GY - 170}" width="12000" height="1200" fill="url(#sandG)"/>`;
  const sw = Math.sin(t*1.3)*30;
  near += `<path d="M-6000,${GY - 160 + sw*.3} ${[...Array(40)].map((_, j) => `Q${-6000 + j*300 + 150},${GY - 150 + sw*.3 + 14*Math.sin(t*2 + j)} ${-6000 + (j + 1)*300},${GY - 160 + sw*.3}`).join(' ')} L6000,${GY - 186} L-6000,${GY - 186} Z" fill="#F4FFFF" stroke="${INK}" stroke-width="5" opacity=".95"/>`;
  near += `<rect x="-6000" y="${GY - 150 + sw*.3}" width="12000" height="40" fill="#D7B678" opacity=".45"/>`;
  for (let i = 0; i < 26; i++) near += `<ellipse cx="${-3000 + i*240 + (i*71 % 90)}" cy="${GY + 40 + (i%4)*70}" rx="${14 + (i%3)*6}" ry="4" fill="#C9A469" opacity=".55"/>`;
  if (!o.bare) near += flagPole(-1050, GY - 40, t, .95) + flagPole(1150, GY - 40, t + 1, .95) + surfboard(1500, GY - 20, .9, 8) + towel(-1500, GY + 60, 1.1);
  return L(0, sky) + L(.35, mid, blur && (blur === 'b14' ? 'b8' : 'b4')) + L(1, near, blur);
}
// sand chunks flying out of a face-plant
function sandBurst(x, y, t, t0, sc=1) {
  if (t < t0 || t > t0 + 1.1) return ''; const d = t - t0, k = d/1.1; let s = '';
  for (let i = 0; i < 26; i++) { const a = -Math.PI*(.1 + .8*hash(i*3.7)), v = (500 + 700*hash(i))*sc, px = x + Math.cos(a)*v*d, py = y + Math.sin(a)*v*d + 1600*sc*d*d;
    if (py < y + 30) s += `<circle cx="${px}" cy="${py}" r="${(6 + 12*hash(i + 2))*sc}" fill="${i % 3 ? '#E9C68A' : '#D2AE70'}" stroke="${INK}" stroke-width="${3*sc}"/>`; }
  s += `<ellipse cx="${x}" cy="${y - 20*sc}" rx="${(120 + 260*easeOut(k))*sc}" ry="${(40 + 80*easeOut(k))*sc}" fill="#F3D7A0" opacity="${.7*(1 - k)}" filter="url(#b8)"/>`;
  return s;
}
function sandMound(x, y, w=260, h=60) { if (h < 6) return ''; return `<path d="M${x - w},${y + 4} Q${x - w*.5},${y - h} ${x},${y - h*1.05} Q${x + w*.5},${y - h} ${x + w},${y + 4} Z" fill="#EBCB8F" stroke="${INK}" stroke-width="6"/><path d="M${x - w*.6},${y - h*.4} Q${x},${y - h*.9} ${x + w*.5},${y - h*.5}" stroke="#F7E2B5" stroke-width="8" fill="none" opacity=".8"/>`; }
// Dex buried head-first, legs kicking
function dexStuck(t, x, sy=SAND, extra={}) {
  const kick = Math.sin(t*9);
  const o = { ...DEX2, ...mixPose(POSES.sunk, POSES.sunk, 1), x, y: sy + 100*DS, s: DS, t, air: true, noShadow: true, rot: 180 + Math.sin(t*3)*3,
    legL: [-30 + kick*28, 40 + kick*30], legR: [30 - kick*28, -40 + kick*30], armF: [-40, 10], armB: [40, -10], hoodTip: 0, blink: 0, ...extra };
  return chibi2(o) + `<rect x="${x - 420}" y="${sy - 6}" width="840" height="600" fill="url(#sandG)"/>` + sandMound(x, sy, 250, 78);
}

// ---------------------------------------------------------------- London bedroom (from Ep2) + wardrobe
const BED = -560, BEDY = GY - 60;
function bedroom(t, L, c, blur='', o={}) {
  let back = roomW(t) + (o.night ? nightWindow(260, 250, 380, 300, t) : dawnWindow(260, 250, 380, 300, t)) + posterW(-780, 420, 300, 380, 'DAY 2 ✓', '#3D8BFF', -4) + shelfW(820, 470) + posterW(1300, 380, 220, 280, 'RUN!', '#E8463C', 5);
  if (!o.night) back += `<path d="M420,${GY-140} L520,550 L640,550 L740,${GY-140} Z" fill="#FFF6C8" opacity=".18"/>`;
  back += `<g transform="translate(-780,380) rotate(-4) scale(.5)">${chibiSide2({ x: 0, y: 40, s: .75, phase: .3, t: 0, lean: 18, wind: 1.4, mouth: 'grin' })}</g>`;
  back += wardrobe(1500, GY - 140);
  const table = `<g transform="translate(330,${GY-60})"><rect x="-90" y="-200" width="180" height="200" rx="8" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="-70" y="-150" width="140" height="44" rx="6" fill="#C99A68" stroke="${INK}" stroke-width="4"/><circle cy="-128" r="6" fill="${INK}"/></g>`;
  let s = L(1, back, blur) + L(1, bedW(BED, BEDY, t) + table, blur);
  if (o.night) s += L(1, `<rect x="-4000" y="-1500" width="8000" height="4000" fill="#101850" opacity=".55"/>`);
  return s;
}
function dawnWindow(x, y, w, h, t) {
  return `<g transform="translate(${x},${y})"><rect x="-12" y="-12" width="${w+24}" height="${h+24}" rx="18" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/><rect width="${w}" height="${h}" rx="10" fill="url(#dawn)" stroke="${INK}" stroke-width="5"/>
  <circle cx="${w*.7}" cy="${h*.78}" r="${h*.14}" fill="#FFE9A8"/>${[0,1,2,3].map(i => `<rect x="${i*w/4 + 10}" y="${h*.62 + (i%2)*20}" width="${w/4 - 20}" height="${h*.4}" fill="#8E7FB0" opacity=".7"/>`).join('')}
  <path d="M${w/2},0 L${w/2},${h} M0,${h/2} L${w},${h/2}" stroke="${INK}" stroke-width="7"/><path d="M${w*.1},${h*.4} L${w*.3},${h*.1}" stroke="#fff" stroke-width="12" opacity=".5"/>
  <path d="M-40,-30 Q${w*.15},${h*.4} -20,${h+40} L-60,${h+40} L-60,-30 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/><path d="M${w+40},-30 Q${w*.85},${h*.4} ${w+20},${h+40} L${w+60},${h+40} L${w+60},-30 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/></g>`;
}
function nightWindow(x, y, w, h, t) {
  return `<g transform="translate(${x},${y})"><rect x="-12" y="-12" width="${w+24}" height="${h+24}" rx="18" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/><rect width="${w}" height="${h}" rx="10" fill="url(#nightG)" stroke="${INK}" stroke-width="5"/>
  <circle cx="${w*.75}" cy="${h*.25}" r="${h*.09}" fill="#FFF6D0"/>${[0,1,2,3,4,5].map(i => `<circle cx="${(i*67 + 20) % w}" cy="${(i*41 + 15) % (h*.5)}" r="3" fill="#fff" opacity="${.5 + .5*Math.sin(t*3 + i)}"/>`).join('')}
  <path d="M${w/2},0 L${w/2},${h} M0,${h/2} L${w},${h/2}" stroke="${INK}" stroke-width="7"/>
  <path d="M-40,-30 Q${w*.15},${h*.4} -20,${h+40} L-60,${h+40} L-60,-30 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/><path d="M${w+40},-30 Q${w*.85},${h*.4} ${w+20},${h+40} L${w+60},${h+40} L${w+60},-30 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/></g>`;
}
function wardrobe(x, y) { return `<g transform="translate(${x},${y})"><rect x="-200" y="-640" width="400" height="640" rx="10" fill="#C08A55" stroke="${INK}" stroke-width="7"/><path d="M0,-630 L0,-10" stroke="${INK}" stroke-width="6"/><circle cx="-24" cy="-330" r="10" fill="#FFC21F" stroke="${INK}" stroke-width="4"/><circle cx="24" cy="-330" r="10" fill="#FFC21F" stroke="${INK}" stroke-width="4"/><rect x="-170" y="-610" width="140" height="240" rx="8" fill="#D39C64" opacity=".6"/><rect x="30" y="-610" width="140" height="240" rx="8" fill="#D39C64" opacity=".6"/></g>`; }
function alarm(t, x, y, s, until=1.9) {
  const ring = t < until, j = ring ? Math.sin(t*70)*7 : 0;
  return `<g transform="translate(${x + j},${y}) rotate(${j}) scale(${s})"><circle cx="-40" cy="-50" r="18" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-50" r="18" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle r="58" fill="#E8463C" stroke="${INK}" stroke-width="7"/><circle r="42" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0,0 L0,-28 M0,0 L20,8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-36,52 L-46,70 M36,52 L46,70" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>${ring ? [0,1,2].map(i => `<path d="M${70 + i*18},${-30 - i*6} q14,30 0,60" stroke="${INK}" stroke-width="5" fill="none" opacity="${.5 + .5*Math.sin(t*30 + i)}"/>`).join('') : ''}</g>`;
}
function cover(t, up) {   // duvet: up 0 = lying, 1 = sat up
  const top = lerp(GY - 360, GY - 240, up), x0 = BED + lerp(270, 150, up);
  return `<path d="M${x0},${top + 40} Q${x0 + 40},${top} ${x0 + 160},${top + 6} Q${BED + 520},${top - 14 + 14*Math.sin(t*2.1)} ${BED + 760},${GY - 230} L${BED + 760},${BEDY - 40} L${x0 - 20},${BEDY - 40} Q${x0 - 40},${top + 120} ${x0},${top + 40} Z" fill="#7FB3FF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${x0 + 60},${top + 60} Q${BED + 500},${top + 40} ${BED + 740},${top + 80}" stroke="#5F94E8" stroke-width="9" fill="none" opacity=".6"/>`;
}

// ---------------------------------------------------------------- globe (orthographic, coarse continents)
const LAND = [
  [[-17,21],[-10,30],[-6,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[40,-2],[40,-15],[35,-25],[27,-34],[20,-35],[15,-28],[12,-15],[9,-1],[9,4],[-8,5],[-17,14]],
  [[-9,43],[-9,37],[-2,37],[3,43],[8,44],[12,44],[16,40],[19,40],[15,45],[20,42],[24,38],[26,41],[29,41],[40,45],[40,55],[30,60],[30,70],[20,70],[15,68],[5,62],[10,58],[12,55],[8,54],[5,52],[2,50],[-4,48],[-1,46]],
  [[-5,50],[1,51],[2,53],[0,54],[-2,56],[-2,58],[-5,58.5],[-6,56],[-5,54],[-3,53],[-5,52]],
  [[-10,52],[-6,52],[-6,55],[-8,55],[-10,54]],
  [[40,45],[50,40],[57,25],[66,25],[72,20],[77,8],[80,15],[88,22],[92,22],[98,16],[100,5],[104,1],[106,10],[109,12],[108,21],[117,24],[122,30],[121,38],[127,40],[130,43],[140,50],[142,59],[160,62],[180,66],[180,72],[140,73],[110,77],[80,73],[60,70],[40,67],[30,70],[30,60],[40,55]],
  [[114,-22],[114,-34],[118,-35],[124,-33],[132,-31],[138,-35],[141,-38],[146,-39],[150,-37],[153,-31],[153,-25],[146,-19],[145,-15],[142,-11],[141,-17],[136,-12],[131,-11],[126,-14],[122,-18]],
  [[-168,66],[-160,59],[-150,61],[-135,58],[-124,48],[-124,40],[-117,32],[-110,23],[-105,20],[-97,16],[-92,15],[-83,9],[-77,8],[-81,13],[-87,21],[-90,21],[-97,26],[-94,29],[-89,30],[-82,30],[-80,25],[-81,31],[-76,35],[-70,42],[-65,45],[-60,47],[-56,52],[-64,60],[-78,62],[-90,65],[-95,72],[-120,72],[-140,70],[-156,71],[-166,68]],
  [[-80,9],[-77,8],[-60,10],[-50,0],[-35,-6],[-40,-22],[-48,-27],[-58,-38],[-65,-45],[-70,-55],[-74,-50],[-73,-38],[-71,-25],[-70,-18],[-76,-14],[-81,-5],[-80,1]],
  [[-45,60],[-20,70],[-20,82],[-60,82],[-70,77],[-55,68]],
  [[172,-34],[178,-38],[174,-41],[171,-44],[167,-46],[170,-42]],
  [[95,5],[105,-6],[115,-8],[120,-9],[125,-8],[120,-3],[118,4],[110,2],[100,2]],
  [[130,31],[135,34],[140,36],[142,40],[140,42],[136,36],[131,34]],
  [[44,-25],[50,-15],[49,-12],[44,-17]],
];
const LONDON = [-0.13, 51.5], SYDNEY = [151.2, -33.9];
function proj(lon, lat, lon0, lat0) {
  const l = rad(lon - lon0), p = rad(lat), p0 = rad(lat0);
  const x = Math.cos(p)*Math.sin(l), y = Math.cos(p0)*Math.sin(p) - Math.sin(p0)*Math.cos(p)*Math.cos(l), z = Math.sin(p0)*Math.sin(p) + Math.cos(p0)*Math.cos(p)*Math.cos(l);
  return [x, -y, z];
}
function globe(cx, cy, r, lon0, lat0, o={}) {
  let s = `<g>${o.atmo === false ? '' : `<circle cx="${cx}" cy="${cy}" r="${r*1.12}" fill="url(#atmo)"/>`}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#oceanG)" stroke="${INK}" stroke-width="${Math.max(3, r*.022)}"/>`;
  for (const poly of LAND) {
    let pts = [];
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])/4));
      for (let j = 0; j < n; j++) { let p = proj(lerp(a[0], b[0], j/n), lerp(a[1], b[1], j/n), lon0, lat0); if (p[2] < 0) { const m = Math.hypot(p[0], p[1]) || 1; p = [p[0]/m, p[1]/m, 0]; } pts.push(p); } }
    if (pts.every(p => p[2] <= 0)) continue;
    s += `<path d="M${pts.map(p => `${(cx + p[0]*r).toFixed(1)},${(cy + p[1]*r).toFixed(1)}`).join(' L')} Z" fill="${o.land || '#5CC46A'}" stroke="${INK}" stroke-width="${Math.max(2, r*.012)}" stroke-linejoin="round"/>`;
  }
  if (o.ice !== false) { const pn = proj(0, 90, lon0, lat0); if (pn[2] > -.2) s += `<ellipse cx="${cx + pn[0]*r}" cy="${cy + pn[1]*r}" rx="${r*.17}" ry="${r*.17*Math.max(.15, Math.abs(pn[2]))}" fill="#F4FBFF" opacity=".9"/>`;
    const ps = proj(0, -90, lon0, lat0); if (ps[2] > -.2) s += `<ellipse cx="${cx + ps[0]*r}" cy="${cy + ps[1]*r}" rx="${r*.24}" ry="${r*.24*Math.max(.15, Math.abs(ps[2]))}" fill="#F4FBFF" opacity=".9"/>`; }
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#globeSh)"/><path d="M${cx - r*.62},${cy - r*.42} Q${cx - r*.4},${cy - r*.78} ${cx - r*.02},${cy - r*.86}" stroke="#fff" stroke-width="${r*.05}" fill="none" opacity=".35" stroke-linecap="round"/>`;
  return s + '</g>';
}
function gxy(ll, cx, cy, r, lon0, lat0, alt=0) { const p = proj(ll[0], ll[1], lon0, lat0); return [cx + p[0]*r*(1 + alt), cy + p[1]*r*(1 + alt), p[2]]; }
function pin(x, y, s, col='#E8463C', label='', side=1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 C-18,-26 -26,-38 -26,-52 A26,26 0 1 1 26,-52 C26,-38 18,-26 0,0 Z" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cy="-52" r="10" fill="#fff"/>${label ? `<g transform="translate(${side*40},-52)">${txt(label, side*90, 16, 46, '#fff')}</g>` : ''}</g>`;
}
// great-circle arc London -> Sydney drawn up to fraction k, lifted off the surface
function arcLS(cx, cy, r, lon0, lat0, k, a=LONDON, b=SYDNEY) {
  const toV = ([lo, la]) => [Math.cos(rad(la))*Math.cos(rad(lo)), Math.cos(rad(la))*Math.sin(rad(lo)), Math.sin(rad(la))];
  const va = toV(a), vb = toV(b), om = Math.acos(va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2]);
  let d = '', last = null; const N = 60;
  for (let i = 0; i <= N*k; i++) { const f = i/N, s1 = Math.sin((1 - f)*om)/Math.sin(om), s2 = Math.sin(f*om)/Math.sin(om);
    const v = [va[0]*s1 + vb[0]*s2, va[1]*s1 + vb[1]*s2, va[2]*s1 + vb[2]*s2], lo = Math.atan2(v[1], v[0])*180/Math.PI, la = Math.asin(v[2])*180/Math.PI;
    const p = gxy([lo, la], cx, cy, r, lon0, lat0, .18*Math.sin(f*Math.PI)); last = p; d += (i ? ' L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }
  return { d, last };
}
function space(t, n=120, seed=1) { let s = `<rect x="-6000" y="-6000" width="12000" height="12000" fill="#0A0D26"/>`;
  for (let i = 0; i < n; i++) s += `<circle cx="${(hash(i*3.1 + seed)*2 - 1)*2400}" cy="${(hash(i*7.7 + seed)*2 - 1)*1400 + 540}" r="${1.5 + 3*hash(i + seed)}" fill="#fff" opacity="${.4 + .6*Math.abs(Math.sin(t*1.5 + i))}"/>`;
  return s; }

// ---------------------------------------------------------------- people (generic, never Dex-yellow)
const PEOPLE = [
  { type: 'jacket', top: '#3D8BFF', hood: false, hair: 'short', hairCol: '#3A2A1E', shirt: '#fff', pants: '#2B2F4A' },
  { type: 'plain', top: '#7ED957', hood: false, hair: 'long', hairCol: '#8A4A2A', pants: '#3A3F66' },
  { type: 'plain', top: '#B07CFF', hood: false, hair: 'curly', hairCol: '#1B1D33', pants: '#2B2F4A' },
  { type: 'jacket', top: '#E8463C', hood: false, hair: 'bun', hairCol: '#E8C27A', shirt: '#FFF1D6', pants: '#1F2033' },
  { type: 'plain', top: '#FF8A3D', hood: false, hair: 'cap', pants: '#3A3F66' },
];
const person = (i, keys, t, x, y, extra={}) => chibi2({ ...dexAt(keys, t, () => ({ x, y }), { s: DS*.95, seed: 10 + i, ...extra }), ...PEOPLE[i % PEOPLE.length], ...extra });

// ---------------------------------------------------------------- diagrams
function arrow(x0, y0, x1, y1, col='#E8463C', w=16, head=1) {
  const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0); if (L < 2) return '';
  const h = Math.min(L*.6, w*2.6*head), bx = x1 - Math.cos(a)*h, by = y1 - Math.sin(a)*h, px = -Math.sin(a), py = Math.cos(a), hw = w*1.5*head;
  const d = `M${x0 + px*w/2},${y0 + py*w/2} L${bx + px*w/2},${by + py*w/2} L${bx + px*hw},${by + py*hw} L${x1},${y1} L${bx - px*hw},${by - py*hw} L${bx - px*w/2},${by - py*w/2} L${x0 - px*w/2},${y0 - py*w/2} Z`;
  return `<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="${Math.max(4, w*.35)}" stroke-linejoin="round"/>`;
}
// Earth seen from above the North Pole: position + eastward spin velocity of a place (screen px), R = disc radius.
// velocity magnitude in km/h = 1674*cos(lat); drawn with k px per km/h.
function topPos(ll, cx, cy, R, lon0) { const l = rad(ll[0] - lon0), c = Math.cos(rad(ll[1])); return [cx + R*c*Math.sin(l), cy + R*c*Math.cos(l)]; }
function topVel(ll, lon0, k) { const l = rad(ll[0] - lon0), v = 1674*Math.cos(rad(ll[1]))*k; return [v*Math.cos(l), -v*Math.sin(l)]; }
function spinArrows(cx, cy, r, t, col='#FFFFFF', op=.8, dir=1) {   // curved arrows around a globe
  let s = ''; for (let i = 0; i < 3; i++) { const a0 = i*2.094 + t*.6*dir, a1 = a0 + 1.2*dir;
    const p0 = [cx + Math.cos(a0)*r, cy + Math.sin(a0)*r*.32], p1 = [cx + Math.cos(a1)*r, cy + Math.sin(a1)*r*.32];
    if (Math.sin((a0 + a1)/2) < 0) continue;
    s += `<path d="M${p0[0]},${p0[1]} A${r},${r*.32} 0 0 ${dir > 0 ? 1 : 0} ${p1[0]},${p1[1]}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round" opacity="${op}"/>`;
    const ta = a1 + .05*dir, tp = [cx + Math.cos(ta)*r, cy + Math.sin(ta)*r*.32]; s += arrow(p1[0], p1[1], tp[0] + (tp[0] - p1[0])*6, tp[1] + (tp[1] - p1[1])*6, col, 1, 14).replace(/stroke="[^"]*"/, `stroke="${col}"`); }
  return s; }
function latLine(lat, cx, cy, r, lon0, lat0, col='#FFD23F', w=6, dash='') {
  let d = '', on = false; for (let lo = -180; lo <= 180; lo += 4) { const p = gxy([lo, lat], cx, cy, r, lon0, lat0); if (p[2] > 0) { d += (on ? ' L' : ' M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); on = true; } else on = false; }
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`; }
function plane(x, y, s, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-160,0 Q-150,-26 -100,-26 L120,-22 Q170,-18 176,0 Q170,18 120,22 L-100,26 Q-150,26 -160,0 Z" fill="#F4F6FF" stroke="${INK}" stroke-width="8"/><path d="M-20,-24 L40,-130 L80,-130 L50,-24 Z M-20,24 L40,130 L80,130 L50,24 Z M-130,-20 L-150,-80 L-120,-80 L-90,-22 Z" fill="#3D8BFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${[0,1,2,3,4].map(i => `<circle cx="${-60 + i*36}" cy="-6" r="8" fill="#9FD8FF" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`; }
function crossOut(x, y, s, t, a) { if (t < a) return ''; const k = seg(t, a, a + .25); return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-160,-160 L${-160 + 320*Math.min(1, k*2)},${-160 + 320*Math.min(1, k*2)}" stroke="#E8463C" stroke-width="40" stroke-linecap="round"/>${k > .5 ? `<path d="M160,-160 L${160 - 320*(k - .5)*2},${-160 + 320*(k - .5)*2}" stroke="#E8463C" stroke-width="40" stroke-linecap="round"/>` : ''}</g>`; }
function zzz(x, y, t, n=3) { let s = ''; for (let i = 0; i < n; i++) { const p = (t*.6 + i/n) % 1; s += `<text x="${x + p*90 + Math.sin(p*6)*14}" y="${y - p*200}" font-family="Lilita One" font-size="${40 + p*50}" fill="#fff" stroke="${INK}" stroke-width="6" paint-order="stroke" opacity="${Math.sin(p*Math.PI)}">Z</text>`; } return s; }
function bar(x, y, w, h, col, label, val, k=1) { return `<g transform="translate(${x},${y})"><rect x="0" y="${-h/2}" width="${Math.max(0, w*k)}" height="${h}" rx="${h/2.6}" fill="${col}" stroke="${INK}" stroke-width="7"/>${txt(label, 0, -h/2 - 24, 46, '#fff', 'start')}${k > .2 ? txt(val, Math.max(140, w*k - 20), 16, 52, '#fff', 'end') : ''}</g>`; }
function crater(x, y, w=520, h=120) { return `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h*.45}" fill="#C79E5E" stroke="${INK}" stroke-width="7"/><ellipse cx="${x}" cy="${y + h*.06}" rx="${w*.8}" ry="${h*.3}" fill="#A47E45"/><path d="M${x - w*1.1},${y + 10} Q${x - w*.9},${y - h*.75} ${x - w*.55},${y - h*.35} M${x + w*1.1},${y + 10} Q${x + w*.9},${y - h*.75} ${x + w*.55},${y - h*.35}" stroke="${INK}" stroke-width="7" fill="#EBCB8F"/>`; }
function sandDex(x, y, s) {   // a sandcastle shaped like Dex's hooded head
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-100,0 L-90,-60 L90,-60 L100,0 Z" fill="#D9B272" stroke="${INK}" stroke-width="6"/><path d="M-96,-120 C-104,-210 -50,-252 0,-252 C50,-252 104,-210 96,-120 C90,-70 50,-50 0,-50 C-50,-50 -90,-70 -96,-120 Z" fill="#E6C27F" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-128" rx="70" ry="64" fill="#F0D59C" stroke="${INK}" stroke-width="5"/>
  <path d="M-34,-140 l16,12 M-34,-128 l16,-12 M18,-140 l16,12 M18,-128 l16,-12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-16,-96 Q0,-108 16,-96" stroke="${INK}" stroke-width="6" fill="none"/>${[[-60,-40],[40,-30],[0,-200],[-70,-170],[70,-180]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="#B48A4C"/>`).join('')}<path d="M0,-252 L0,-320 L44,-305 L0,-290" fill="#E8463C" stroke="${INK}" stroke-width="5"/></g>`; }
function sunIcon(x, y, r, col='#FFC21F', low=false) { let s = `<g transform="translate(${x},${y})">`; for (let i = 0; i < 10; i++) { const a = i*.628; s += `<path d="M${Math.cos(a)*r*1.25},${Math.sin(a)*r*1.25} L${Math.cos(a)*r*1.6},${Math.sin(a)*r*1.6}" stroke="${col}" stroke-width="${r*.16}" stroke-linecap="round"/>`; } s += `<circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="${r*.1}"/>`; if (low) s += `<rect x="${-r*2}" y="${r*.2}" width="${r*4}" height="${r*2}" fill="#2A3D8F"/><path d="M${-r*2},${r*.2} L${r*2},${r*.2}" stroke="${INK}" stroke-width="${r*.1}"/>`; return s + '</g>'; }

const tag = (t, a, x, y, label, col, size=52, until=1e9) => chipAt(t, a, x, y, label, col, size, until);

function poleDisc(cx, cy, R, lon0, t) {   // simplified Earth seen from above the North Pole (disc edge = equator)
  let s = `<circle cx="${cx}" cy="${cy}" r="${R*1.08}" fill="url(#atmo)"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#oceanG)" stroke="${INK}" stroke-width="7"/>`;
  for (const f of [.33, .66]) s += `<circle cx="${cx}" cy="${cy}" r="${R*f}" fill="none" stroke="#BFE6FF" stroke-width="3" opacity=".45" stroke-dasharray="10 10"/>`;
  for (let i = 0; i < 12; i++) { const a = rad(i*30 - lon0), x = Math.sin(a), y = Math.cos(a); s += `<path d="M${cx + x*R*.1},${cy + y*R*.1} L${cx + x*R},${cy + y*R}" stroke="#BFE6FF" stroke-width="2.5" opacity=".35"/>`; }
  s += `<circle cx="${cx}" cy="${cy}" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><g transform="translate(${cx},${cy - 30})">${txt('N', 0, 0, 34, '#fff')}</g>`;
  s += `<path d="M${cx - R*.5},${cy - R*1.07} A${R*1.18},${R*1.18} 0 0 0 ${cx - R*1.18},${cy + 60}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>` + arrow(cx - R*1.18, cy + 40, cx - R*1.15, cy + 120, '#fff', 10);
  return s;
}

// ---------------------------------------------------------------- kitchen, dog, street, jet, air
function kitchen(t, L, blur='', o={}) {
  let s = roomW(t, { wall: '#DDF1E4', stripe: '#CFE8D8', floor: '#B98E66' });
  for (let x = -2000; x < 2000; x += 80) for (let y = GY - 520; y < GY - 300; y += 80) s += `<rect x="${x + ((y/80) % 2)*40}" y="${y}" width="76" height="76" fill="#F4FFF8" stroke="#BFDCCB" stroke-width="3"/>`;
  s += `<rect x="-2000" y="${GY - 330}" width="4000" height="30" fill="#E9E1D3" stroke="${INK}" stroke-width="6"/><rect x="-2000" y="${GY - 300}" width="4000" height="160" fill="#7FB3FF" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -1960; x < 2000; x += 260) s += `<rect x="${x}" y="${GY - 290}" width="240" height="140" rx="8" fill="#94C2FF" stroke="${INK}" stroke-width="5"/><rect x="${x + 100}" y="${GY - 270}" width="40" height="10" rx="5" fill="${INK}"/>`;
  for (let x = -1960; x < 2000; x += 260) s += `<rect x="${x}" y="${GY - 900}" width="240" height="260" rx="8" fill="#94C2FF" stroke="${INK}" stroke-width="5"/>`;
  s += `<g transform="translate(760,${GY - 330})"><path d="M-50,0 L-40,-110 Q0,-130 40,-110 L50,0 Z" fill="#E8463C" stroke="${INK}" stroke-width="6"/><path d="M40,-90 Q80,-80 70,-30" stroke="${INK}" stroke-width="10" fill="none"/></g>`;   // kettle
  s += (o.night ? nightWindow : dawnWindow)(120, GY - 880, 340, 230, t);
  return L(1, s, blur);
}
function kTable(x, y) { return `<g transform="translate(${x},${y})"><rect x="-260" y="-260" width="520" height="34" rx="8" fill="#C08A55" stroke="${INK}" stroke-width="7"/><rect x="-230" y="-226" width="26" height="226" fill="#A9733F" stroke="${INK}" stroke-width="5"/><rect x="204" y="-226" width="26" height="226" fill="#A9733F" stroke="${INK}" stroke-width="5"/></g>`; }
function mug(x, y, s=1, rot=0, spill=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-30,-60 L30,-60 L26,0 L-26,0 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M30,-46 Q56,-40 50,-20 Q46,-6 28,-10" fill="none" stroke="${INK}" stroke-width="7"/><rect x="-24" y="-46" width="48" height="10" fill="#E8463C"/>${spill > 0 ? `<path d="M-26,-60 Q${-60 - spill*60},${-90 - spill*80} ${-20 - spill*140},${-40 - spill*60}" stroke="#B5783A" stroke-width="${16*(1 - spill*.5)}" fill="none" stroke-linecap="round" opacity="${1 - spill*.3}"/>` : ''}</g>`; }
function dog(x, y, s, t, o={}) {   // small cartoon dog facing left; o.alarm ears up, o.shake trembles
  const sh = o.shake ? Math.sin(t*70)*4 : 0, wag = o.wag ? Math.sin(t*16)*20 : (o.alarm ? 30 : 0), ear = o.alarm ? -50 : 0;
  return `<g transform="translate(${x + sh},${y}) scale(${s})">
  <path d="M90,-90 Q${130 + wag*.4},${-150 + wag*.3} ${120 + wag},${-170}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M90,-90 Q${130 + wag*.4},${-150 + wag*.3} ${120 + wag},${-170}" stroke="#C98A4A" stroke-width="8" fill="none" stroke-linecap="round"/>
  ${[-60, -20, 40, 80].map(lx => `<rect x="${lx - 12}" y="-60" width="24" height="60" rx="10" fill="#C98A4A" stroke="${INK}" stroke-width="5"/>`).join('')}
  <ellipse cx="10" cy="-80" rx="100" ry="50" fill="#D99A58" stroke="${INK}" stroke-width="6"/><ellipse cx="30" cy="-70" rx="40" ry="24" fill="#F3D2A6"/>
  <g transform="translate(-90,-130)"><path d="M-30,-40 Q${-70},${-20 + ear} -58,${40 + ear*.8} Q-40,20 -26,-10 Z" fill="#8A5A3B" stroke="${INK}" stroke-width="5"/><circle r="56" fill="#D99A58" stroke="${INK}" stroke-width="6"/><path d="M30,-40 Q${66},${-20 + ear} 56,${40 + ear*.8} Q40,20 26,-10 Z" fill="#8A5A3B" stroke="${INK}" stroke-width="5"/>
   <ellipse cx="-30" cy="22" rx="34" ry="26" fill="#F3D2A6" stroke="${INK}" stroke-width="5"/><circle cx="-56" cy="12" r="10" fill="${INK}"/>
   ${o.alarm ? `<circle cx="-16" cy="-12" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-18" cy="-12" r="6" fill="${INK}"/><circle cx="20" cy="-12" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="18" cy="-12" r="6" fill="${INK}"/>` : `<circle cx="-14" cy="-10" r="7" fill="${INK}"/><circle cx="20" cy="-10" r="7" fill="${INK}"/>`}</g></g>`;
}
function terrace(t, rattleT=-9, L) {   // British terraced street, windows rattle after rattleT
  let s = `<rect x="-6000" y="-3000" width="12000" height="5000" fill="url(#sky2)"/>`;
  const cols = ['#C9654F', '#B95A47', '#D27A5E', '#BF6A52'];
  for (let i = -6; i < 6; i++) { const x = i*360, c = cols[(i + 12) % 4];
    s += `<rect x="${x}" y="${GY - 760}" width="360" height="620" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M${x - 10},${GY - 760} L${x + 180},${GY - 900} L${x + 370},${GY - 760} Z" fill="#5A4A6A" stroke="${INK}" stroke-width="6"/><rect x="${x + 250}" y="${GY - 940}" width="40" height="90" fill="#8A5A3B" stroke="${INK}" stroke-width="5"/>`;
    for (const [wx, wy] of [[40, 640], [200, 640], [40, 400]]) { const r = t > rattleT && t < rattleT + 2.2 ? Math.sin(t*60 + i*3 + wx)*5*(1 - seg(t, rattleT, rattleT + 2.2)) : 0;
      s += `<g transform="translate(${x + wx + r},${GY - wy}) rotate(${r*.6})"><rect width="120" height="150" fill="#9FD8FF" stroke="#fff" stroke-width="10"/><rect width="120" height="150" fill="none" stroke="${INK}" stroke-width="5"/><path d="M60,0 L60,150 M0,75 L120,75" stroke="#fff" stroke-width="7"/></g>`; }
    s += `<rect x="${x + 220}" y="${GY - 330}" width="100" height="190" rx="8" fill="#2B4A8F" stroke="${INK}" stroke-width="6"/>`; }
  s += `<rect x="-6000" y="${GY - 140}" width="12000" height="900" fill="#A9AFC8" stroke="${INK}" stroke-width="6"/>`;
  return s;
}
function jetEngine(x, y, s, t) {
  let g = `<g transform="translate(${x},${y}) scale(${s})"><rect x="-40" y="0" width="80" height="320" fill="#8C93B8" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="0" rx="300" ry="300" fill="#D7DCEF" stroke="${INK}" stroke-width="9"/><circle r="250" fill="#2B2F4A" stroke="${INK}" stroke-width="7"/><g transform="rotate(${t*900})">`;
  for (let i = 0; i < 16; i++) g += `<path d="M0,0 L${Math.cos(i*.3927)*240},${Math.sin(i*.3927)*240} L${Math.cos(i*.3927 + .2)*240},${Math.sin(i*.3927 + .2)*240} Z" fill="#9AA2C8" stroke="${INK}" stroke-width="3"/>`;
  g += `</g><circle r="60" fill="#E9ECF8" stroke="${INK}" stroke-width="6"/><path d="M-10,-30 Q30,0 -10,30" stroke="${INK}" stroke-width="7" fill="none"/></g>`; return g; }
function airDots(cx, cy, t, mode, k, n=90, R=420) {  // mode 'push': dots blasted out from a Dex-sized region; 'fill': dots rush in
  let s = ''; for (let i = 0; i < n; i++) { const a = hash(i*1.7)*6.283, r0 = 40 + 110*Math.sqrt(hash(i*3.3)), ex = Math.cos(a)*.7, ey = Math.sin(a)*1.25;
    const r = mode === 'push' ? r0 + R*E.snap(k) : lerp(R + r0, r0*.2, E.in(k)), x = cx + ex*r, y = cy + ey*r;
    s += `<circle cx="${x}" cy="${y}" r="9" fill="#BFE6FF" stroke="#3D8BFF" stroke-width="3" opacity="${mode === 'push' ? 1 - k*.6 : .5 + .5*k}"/>`; }
  return s; }
function dexGhost(x, y, s=DS) { return `<g opacity=".7">${chibi2({ ...DEX2, ...mixPose(POSES.idle, POSES.idle, 1), x, y, s, t: 0, blink: 0, hoodTip: 0 }).replace(/fill="[^"]*"/g, 'fill="none"').replace(/stroke="[^"]*"/g, 'stroke="#BFE6FF"').replace(/stroke-width="[^"]*"/g, 'stroke-width="5" stroke-dasharray="14 10"')}</g>`; }
function bottle(x, y, s=1) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-22,0 L-22,-80 Q-22,-96 -10,-104 L-10,-120 L10,-120 L10,-104 Q22,-96 22,-80 L22,0 Z" fill="#BFE6FF" fill-opacity=".8" stroke="${INK}" stroke-width="5"/><rect x="-12" y="-130" width="24" height="12" rx="3" fill="#3D8BFF" stroke="${INK}" stroke-width="4"/><rect x="-22" y="-62" width="44" height="22" fill="#fff" stroke="${INK}" stroke-width="3"/>${txt('2L', 0, -44, 18, '#3D8BFF')}</g>`; }
function student(t, x, y, keys) { return chibi2({ ...dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 21 }), ...PEOPLE[2], acc: 'glasses' }); }
function book(x, y, s, open=0) { return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-120" y="-160" width="240" height="320" rx="12" fill="#6B3FA0" stroke="${INK}" stroke-width="8"/><rect x="-100" y="-140" width="200" height="280" rx="8" fill="none" stroke="#FFD23F" stroke-width="5"/><path d="M0,-80 L18,-30 L70,-30 L28,0 L44,52 L0,22 L-44,52 L-28,0 L-70,-30 L-18,-30 Z" fill="#FFD23F" stroke="${INK}" stroke-width="5"/></g>`; }
const GC = { x: 960, y: 540, z: 1 };

// ---------------------------------------------------------------- Everest
const EVX = [86.925, 27.988];
function everestW(t, L, blur='', o={}) {
  let sky = `<rect x="-6000" y="-3000" width="12000" height="5200" fill="url(#snowSky)"/><circle cx="1300" cy="120" r="70" fill="#FFFBEA"/><circle cx="1300" cy="120" r="300" fill="url(#sunG)" opacity=".6"/>`;
  let far = '';
  [[-1700, 640, 700], [-700, 560, 820], [700, 600, 760], [1700, 520, 900]].forEach(([x, y, w]) => far += `<path d="M${x - w},${GY} L${x},${GY - y} L${x + w},${GY} Z" fill="#9FB6E6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${x - w*.28},${GY - y*.72} L${x},${GY - y} L${x + w*.3},${GY - y*.7} L${x + w*.12},${GY - y*.76} L${x},${GY - y*.68} L${x - w*.12},${GY - y*.78} Z" fill="#F4FBFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  far += [...Array(7)].map((_, i) => `<ellipse cx="${-2400 + i*800 + (t*20 % 400)}" cy="${GY - 120 + (i % 2)*40}" rx="420" ry="70" fill="#fff" opacity=".85"/>`).join('');
  let near = `<path d="M-2600,${GY + 600} L-900,${GY - 40} L-300,${GY - 120} L0,${GY - 150} L320,${GY - 110} L900,${GY - 30} L2600,${GY + 600} Z" fill="#F4FBFF" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  near += `<path d="M-900,${GY - 40} L-600,${GY + 200} L-300,${GY - 120} M320,${GY - 110} L560,${GY + 160} L900,${GY - 30}" fill="none" stroke="#BFD3F2" stroke-width="10" opacity=".8"/><path d="M-1500,${GY + 300} L-900,${GY - 40} L-700,${GY + 400} Z M1300,${GY + 400} L900,${GY - 30} L1100,${GY + 300} Z" fill="#7C86A6" stroke="${INK}" stroke-width="6"/>`;
  if (o.flags !== false) { let f = `<path d="M-520,${GY - 330} Q-260,${GY - 250} 0,${GY - 300} Q260,${GY - 230} 520,${GY - 310}" fill="none" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 14; i++) { const u = i/13, x = lerp(-500, 500, u), y = GY - 300 + Math.sin(u*Math.PI*2)*35 + 14 + Math.sin(t*6 + i)*4; f += `<rect x="${x - 18}" y="${y}" width="36" height="44" fill="${['#3D8BFF','#fff','#E8463C','#7ED957','#FFD23F'][i % 5]}" stroke="${INK}" stroke-width="3" transform="rotate(${Math.sin(t*5 + i)*8},${x},${y})"/>`; }
    near = f + near; }
  for (let i = 0; i < 50; i++) { const x = ((hash(i)*4000 + t*(260 + hash(i*2)*200)) % 4000) - 2000, y = ((hash(i*3)*1400 + t*(60 + 40*hash(i))) % 1400) - 300; near += `<circle cx="${x}" cy="${y}" r="${3 + 4*hash(i*5)}" fill="#fff" opacity=".8"/>`; }
  return L(0, sky) + L(.35, far, blur && 'b4') + L(1, near, blur);
}
function climber(t, x, y, i=0, s=DS*.9) {   // generic climber in a down suit with an oxygen bottle and mask
  const K = [[0, { ...POSES.idle, lean: 6, armF: [40, 40], armB: [-20, 30], tilt: 4 }]];
  const o = { ...dexAt(K, t, () => ({ x, y }), { s, seed: 40 + i }), type: 'plain', top: ['#FF8A3D', '#E8463C', '#3D8BFF'][i % 3], hood: true, pants: '#2B2F4A', stripe: false, eyes: 'determined', mouth: 'flat' };
  return `<g>${`<g transform="translate(${x - 48*s},${y - 250*s}) scale(${s})"><rect x="-22" y="0" width="44" height="120" rx="20" fill="#C9D0EE" stroke="${INK}" stroke-width="5"/><rect x="-14" y="-16" width="28" height="18" rx="4" fill="#3A3F66"/></g>`}${chibi2(o)}<g transform="translate(${x},${y - 228*s}) scale(${s})"><path d="M-30,-6 Q0,-24 30,-6 L22,30 Q0,40 -22,30 Z" fill="#3A3F66" stroke="${INK}" stroke-width="5"/><path d="M-20,30 Q-60,60 -50,110" stroke="${INK}" stroke-width="6" fill="none"/></g></g>`;
}
function thermo(x, y, s, val, lo=-40, hi=20) {   // val in °C
  const k = clamp((val - lo)/(hi - lo)), H = 420;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-40" y="${-H - 40}" width="80" height="${H + 40}" rx="40" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="40" r="70" fill="${val > 30 ? '#E8463C' : '#3D8BFF'}" stroke="${INK}" stroke-width="8"/><rect x="-22" y="${-H*k}" width="44" height="${H*k + 40}" fill="${val > 30 ? '#E8463C' : '#3D8BFF'}"/><circle cx="0" cy="40" r="56" fill="${val > 30 ? '#E8463C' : '#3D8BFF'}"/>
  ${[0, 1, 2, 3, 4].map(i => Math.round(lo + i*(hi - lo)/4)).map(v => { const yy = -H*((v - lo)/(hi - lo)); return `<path d="M40,${yy} L70,${yy}" stroke="${INK}" stroke-width="6"/><text x="84" y="${yy + 14}" font-family="Lilita One" font-size="38" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke">${v}°</text>`; }).join('')}<path d="M-14,${-H + 10} L-14,-20" stroke="#fff" stroke-width="8" opacity=".5" stroke-linecap="round"/></g>`;
}
function frost(x, y, s, k) { if (k <= 0) return ''; let f = ''; for (let i = 0; i < 9; i++) { const a = -2.6 + i*.65, r = 100; f += `<path d="M${Math.cos(a)*r},${Math.sin(a)*r} l${-6 + hash(i)*4},${18 + 18*hash(i*3)} l${10},${-6}" fill="#E9FFFF" stroke="#9FD8FF" stroke-width="3"/>`; }
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${k}">${f}</g>`; }
function breath(x, y, t, period=1.6, dir=1) { const p = (t % period)/period; if (p > .6) return ''; const k = p/.6; return `<g opacity="${(1 - k)*.8}">${[0, 1, 2].map(i => `<circle cx="${x + dir*(20 + 90*k + i*30*k)}" cy="${y - 20*k - i*14*k}" r="${12 + 26*k - i*4}" fill="#fff"/>`).join('')}</g>`; }
function stopwatch(x, y, s, secs, col='#E8463C') { const a = (secs % 60)*6;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-22" y="-150" width="44" height="34" rx="8" fill="${INK}"/><circle r="120" fill="#fff" stroke="${INK}" stroke-width="10"/><path d="M0,0 L${Math.sin(rad(a))*92},${-Math.cos(rad(a))*92}" stroke="${col}" stroke-width="10" stroke-linecap="round"/><circle r="12" fill="${INK}"/><text x="0" y="78" text-anchor="middle" font-family="Lilita One" font-size="44" fill="#1F2033">${String(Math.floor(secs/60)).padStart(2, '0') + ':' + String(Math.floor(secs % 60)).padStart(2, '0')}</text></g>`; }
function mountainSection(t, cx, base, w, h, zoneK) {   // side diagram of Everest with the death-zone line
  const top = base - h, z = base - h*(8000/8849);
  let s = `<path d="M${cx - w},${base} L${cx - w*.35},${base - h*.55} L${cx - w*.15},${base - h*.7} L${cx},${top} L${cx + w*.2},${base - h*.75} L${cx + w*.5},${base - h*.45} L${cx + w},${base} Z" fill="#9FB6E6" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  s += `<clipPath id="dzc"><rect x="${cx - w}" y="${top - 50}" width="${2*w}" height="${z - top + 50}"/></clipPath><g clip-path="url(#dzc)" opacity="${zoneK}"><path d="M${cx - w},${base} L${cx - w*.35},${base - h*.55} L${cx - w*.15},${base - h*.7} L${cx},${top} L${cx + w*.2},${base - h*.75} L${cx + w*.5},${base - h*.45} L${cx + w},${base} Z" fill="#E8463C" stroke="${INK}" stroke-width="8"/></g>`;
  s += `<path d="M${cx - w - 100},${z} L${cx + w + 100},${z}" stroke="#fff" stroke-width="6" stroke-dasharray="20 14"/>`;
  return { s, z, top };
}
function oxyBubble(x, y, r, a=1) { return `<g opacity="${a}"><circle cx="${x}" cy="${y}" r="${r}" fill="#7FD3FF" stroke="${INK}" stroke-width="4"/><text x="${x}" y="${y + r*.35}" text-anchor="middle" font-family="Lilita One" font-size="${r*.9}" fill="#fff">O₂</text></g>`; }

// ---------------------------------------------------------------- space
function station(x, y, s, rot=0) {   // generic space station: truss, modules, solar arrays
  let g = `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-420" y="-12" width="840" height="24" fill="#C9D0EE" stroke="${INK}" stroke-width="6"/>`;
  for (const sx of [-380, -250, 250, 380]) g += `<rect x="${sx - 50}" y="-200" width="100" height="170" fill="#2F4FA8" stroke="${INK}" stroke-width="6"/><rect x="${sx - 50}" y="30" width="100" height="170" fill="#2F4FA8" stroke="${INK}" stroke-width="6"/>${[0,1,2,3].map(i => `<path d="M${sx - 50},${-160 + i*40} L${sx + 50},${-160 + i*40} M${sx - 50},${70 + i*40} L${sx + 50},${70 + i*40}" stroke="#7FA8FF" stroke-width="3"/>`).join('')}`;
  g += `<rect x="-140" y="-40" width="280" height="80" rx="34" fill="#EEF1FA" stroke="${INK}" stroke-width="6"/><rect x="-40" y="-120" width="80" height="240" rx="30" fill="#E2E7F5" stroke="${INK}" stroke-width="6"/><circle cx="-80" cy="0" r="14" fill="#9FD8FF" stroke="${INK}" stroke-width="4"/>`;
  return g + '</g>'; }
function earthLimb(t, lon0=-10, lat0=40, R=2600, cy=540 + 2500) { return globe(960, cy, R, lon0 - t*.4, lat0, { ice: false }); }
function altScale(t, x, y0, kpx, ticks) {   // vertical altitude ladder: y0 = ground, kpx = px per km
  let s = `<path d="M${x},${y0} L${x},${y0 - 420*kpx}" stroke="#fff" stroke-width="8"/>`;
  for (const [km, lab, col] of ticks) { const y = y0 - km*kpx; s += `<path d="M${x - 30},${y} L${x + 30},${y}" stroke="${col}" stroke-width="10"/><path d="M${x + 40},${y} L${x + 2400},${y}" stroke="${col}" stroke-width="5" stroke-dasharray="20 16" opacity=".6"/><text x="${x + 50}" y="${y - 18}" text-anchor="start" font-family="Lilita One" font-size="48" fill="${col}" stroke="${INK}" stroke-width="6" paint-order="stroke">${lab}</text>`; }
  return s; }
function chamber(x, y, s, t, o={}) {   // vacuum chamber: big cylinder with a round window
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-420" y="-640" width="840" height="640" rx="120" fill="#AEB6D3" stroke="${INK}" stroke-width="9"/><rect x="-420" y="-560" width="840" height="30" fill="#8C93B8"/><rect x="-420" y="-120" width="840" height="30" fill="#8C93B8"/>
  <circle cx="0" cy="-330" r="190" fill="${o.inside || '#1B2A6B'}" stroke="${INK}" stroke-width="10"/><circle cx="0" cy="-330" r="190" fill="none" stroke="#DDE2F2" stroke-width="18"/>${[...Array(12)].map((_, i) => `<circle cx="${Math.cos(i*.5236)*190}" cy="${-330 + Math.sin(i*.5236)*190}" r="9" fill="#8C93B8" stroke="${INK}" stroke-width="3"/>`).join('')}
  <path d="M420,-200 L560,-200 L560,0" stroke="#8C93B8" stroke-width="40" fill="none"/><path d="M420,-200 L560,-200 L560,0" stroke="${INK}" stroke-width="4" fill="none"/></g>`; }
function suitMan(t, x, y, s, o={}) {   // generic 1960s-style pressure suit (white, round helmet)
  const K = [[0, o.pose || 'idle']];
  const b = { ...dexAt(K, t, () => ({ x, y }), { s, seed: 50 }), type: 'plain', top: '#E9ECF4', hood: false, hair: 'short', hairCol: '#5A3A2A', pants: '#D5DAEA', stripe: false, eyes: o.eyes || 'open', mouth: o.mouth || 'flat' };
  return chibi2(b) + `<g transform="translate(${x},${y - 238*s}) scale(${s})"><circle r="112" fill="#BFE6FF" fill-opacity=".25" stroke="${INK}" stroke-width="7"/><path d="M-70,-60 Q-40,-95 0,-98" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".8"/><rect x="-80" y="96" width="160" height="26" rx="10" fill="#8C93B8" stroke="${INK}" stroke-width="5"/></g>`; }
function bigNum(t, a, x, y, n, col='#FFD23F', size=260) { if (t < a) return ''; return `<g transform="translate(${x},${y}) scale(${pop(t, a, .25)})">${txt(n, 0, size*.35, size, col)}</g>`; }

// ---------------------------------------------------------------- Moon
function moon(x, y, r, rot=0) { let s = `<g transform="translate(${x},${y}) rotate(${rot})"><circle r="${r}" fill="#D9DCE8" stroke="${INK}" stroke-width="${Math.max(3, r*.03)}"/>`;
  [[-.35, -.3, .22], [.3, -.1, .16], [-.05, .35, .2], [.45, .4, .1], [-.55, .2, .1], [.1, -.55, .09]].forEach(([a, b, c]) => s += `<circle cx="${a*r}" cy="${b*r}" r="${c*r}" fill="#B9BDCF" stroke="${INK}" stroke-width="${Math.max(2, r*.015)}"/><path d="M${a*r - c*r*.6},${b*r - c*r*.3} A${c*r*.8},${c*r*.8} 0 0 1 ${a*r + c*r*.5},${b*r - c*r*.55}" stroke="#fff" stroke-width="${r*.02}" fill="none" opacity=".5"/>`);
  return s + `<circle r="${r}" fill="url(#globeSh)"/></g>`; }
function helmet(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="125" fill="#BFE6FF" fill-opacity=".22" stroke="${INK}" stroke-width="7"/><path d="M-80,-64 Q-50,-104 0,-108" stroke="#fff" stroke-width="13" fill="none" stroke-linecap="round" opacity=".85"/><rect x="-90" y="108" width="180" height="28" rx="12" fill="#C9D0EE" stroke="${INK}" stroke-width="6"/></g>`; }

// ---------------------------------------------------------------- city tower, window cleaner, pool
const FLOOR = 110, TOWX = 0, TOWW = 1100;
function towerW(t, y0, y1, o={}) {   // glass tower facade (x -550..550), ground at GY, 40 floors; draws rows between y0..y1 only
  let s = `<rect x="${TOWX - TOWW/2}" y="${GY - 40*FLOOR - 60}" width="${TOWW}" height="${40*FLOOR + 60}" fill="#3F6FB8" stroke="${INK}" stroke-width="10"/>`;
  for (let f = 0; f < 40; f++) { const y = GY - (f + 1)*FLOOR; if (y > y1 + 50 || y + FLOOR < y0 - 50) continue;
    for (let i = 0; i < 6; i++) { const x = TOWX - TOWW/2 + 30 + i*175; s += `<rect x="${x}" y="${y + 12}" width="150" height="${FLOOR - 24}" fill="#8FC3F5" stroke="${INK}" stroke-width="4"/><path d="M${x + 20},${y + FLOOR - 24} L${x + 70},${y + 20}" stroke="#fff" stroke-width="10" opacity=".35"/>`; }
    s += `<rect x="${TOWX - TOWW/2}" y="${y + FLOOR - 8}" width="${TOWW}" height="8" fill="#2B4F8F"/>`; }
  return s;
}
function plazaW(t, L, blur='') {
  let back = `<rect x="-6000" y="-6000" width="12000" height="8000" fill="url(#sky2)"/>` + [...Array(6)].map((_, i) => cloud(-2400 + i*900 + (t*15 % 400), -800 + (i % 3)*500, 2)).join('');
  let mid = ''; [[-1500, 1600, '#9AA6CF'], [1600, 2200, '#8E9AC6'], [-2400, 1100, '#A7B2D8'], [2500, 1300, '#A7B2D8']].forEach(([x, h, c]) => mid += `<rect x="${x - 300}" y="${GY - h}" width="600" height="${h}" fill="${c}" stroke="${INK}" stroke-width="6"/>` + [...Array(Math.floor(h/120))].map((_, j) => `<rect x="${x - 240}" y="${GY - h + 40 + j*120}" width="480" height="60" fill="#C9D6F2" opacity=".6"/>`).join(''));
  let near = towerW(t, -6000, GY) + `<rect x="-6000" y="${GY - 20}" width="12000" height="900" fill="#BFC5D9" stroke="${INK}" stroke-width="6"/>` + [...Array(30)].map((_, i) => `<path d="M${-3000 + i*200},${GY - 20} L${-3000 + i*200 - 60},${GY + 900}" stroke="#A9AFC8" stroke-width="4"/>`).join('');
  near += `<g transform="translate(-900,${GY - 20})"><rect x="-160" y="-90" width="320" height="24" rx="8" fill="#8A5A3B" stroke="${INK}" stroke-width="6"/><rect x="-140" y="-66" width="20" height="66" fill="#5A6090"/><rect x="120" y="-66" width="20" height="66" fill="#5A6090"/></g>` + tree(1000, GY - 20, 1.6) + tree(-1500, GY - 20, 1.4);
  return L(0, back) + L(.4, mid, blur && 'b4') + L(1, near, blur);
}
function cradle(x, y, tilt=0, snap=0) {   // window cleaner's platform; snap 0..1 swings the broken side down
  const r = tilt + snap*38;
  return `<path d="M${x - 230},${y - 1800} L${x - 230},${y - 120}" stroke="${INK}" stroke-width="5"/>${snap ? `<path d="M${x + 230},${y - 1800} L${x + 230},${y - 600}" stroke="${INK}" stroke-width="5"/><path d="M${x + 230},${y - 600} q30,40 -10,80 q-40,40 0,90" stroke="${INK}" stroke-width="5" fill="none"/>` : `<path d="M${x + 230},${y - 1800} L${x + 230},${y - 120}" stroke="${INK}" stroke-width="5"/>`}
  <g transform="translate(${x - 230},${y - 120}) rotate(${r}) translate(${-(x - 230)},${-(y - 120)})"><rect x="${x - 260}" y="${y - 20}" width="520" height="40" rx="6" fill="#E8463C" stroke="${INK}" stroke-width="7"/><path d="M${x - 250},${y - 20} L${x - 250},${y - 120} L${x + 250},${y - 120} L${x + 250},${y - 20} M${x - 250},${y - 70} L${x + 250},${y - 70}" stroke="#FFD23F" stroke-width="10" fill="none"/><path d="M${x - 250},${y - 20} L${x - 250},${y - 120} L${x + 250},${y - 120} L${x + 250},${y - 20}" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
}
const CLEANER = { type: 'jacket', top: '#3D8BFF', shirt: '#FFD23F', hood: false, hair: 'cap', pants: '#2B4F8F', stripe: false };
function cleaner(keys, t, x, y, extra={}) { return chibi2({ ...dexAt(keys, t, () => ({ x, y }), { s: DS, seed: 60, ...extra }), ...CLEANER, ...extra }); }
function squeegee(x, y, s=1, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-6" y="0" width="12" height="90" fill="#8A5A3B" stroke="${INK}" stroke-width="4"/><rect x="-60" y="-14" width="120" height="18" rx="4" fill="#2B2F4A" stroke="${INK}" stroke-width="4"/></g>`; }
// pool: water surface at y = WS (world), deep end on the right; 10 m board at the left
const WS = GY - 120;
function poolW(t, L, blur='', o={}) {
  let back = `<rect x="-6000" y="-3000" width="12000" height="5000" fill="#E6F4FF"/>`;
  for (let x = -3000; x < 3000; x += 90) for (let y = WS - 900; y < WS; y += 90) back += `<rect x="${x}" y="${y}" width="86" height="86" fill="${(x/90 + y/90) % 7 === 0 ? '#7FD3FF' : '#F4FBFF'}" stroke="#BFDCEB" stroke-width="3"/>`;
  back += [...Array(5)].map((_, i) => `<rect x="${-2200 + i*1000}" y="${WS - 1500}" width="700" height="500" rx="16" fill="#BFE6FF" stroke="${INK}" stroke-width="7"/><path d="M${-2200 + i*1000 + 350},${WS - 1500} L${-2200 + i*1000 + 350},${WS - 1000}" stroke="${INK}" stroke-width="6"/>`).join('');
  back += `<g transform="translate(-1500,${WS})"><rect x="-60" y="-1100" width="120" height="1100" fill="#C9D0EE" stroke="${INK}" stroke-width="7"/><rect x="-80" y="-1110" width="520" height="40" rx="8" fill="#E8463C" stroke="${INK}" stroke-width="7"/>${txt('10 M', 180, -1130, 56, '#E8463C')}<rect x="-80" y="-600" width="360" height="34" rx="8" fill="#3D8BFF" stroke="${INK}" stroke-width="6"/>${txt('5 M', 120, -620, 46, '#3D8BFF')}</g>`;
  back += `<g transform="translate(900,${WS - 740})"><rect x="-260" y="-70" width="520" height="140" rx="18" fill="#1F2033" stroke="${INK}" stroke-width="7"/>${txt('DEEP END', 0, 24, 66, '#FFD23F')}</g>`;
  let water = `<rect x="-6000" y="${WS}" width="12000" height="1400" fill="url(#poolG)" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 3; i++) { const y = WS + 70 + i*130; water += `<path d="M-4000,${y} L4000,${y}" stroke="#fff" stroke-width="12" stroke-dasharray="26 26" opacity=".85"/><path d="M-4000,${y} L4000,${y}" stroke="#E8463C" stroke-width="12" stroke-dasharray="26 26" stroke-dashoffset="26" opacity=".85"/>`; }
  for (let i = 0; i < 14; i++) water += `<path d="M${-2400 + i*360 + Math.sin(t*2 + i)*30},${WS + 30 + (i % 4)*80} q40,-12 80,0" stroke="#fff" stroke-width="6" fill="none" opacity=".5"/>`;
  return L(1, back, blur) + L(1, water, blur);
}
function waterFront(x0, x1, op=.55) { return `<rect x="${x0}" y="${WS}" width="${x1 - x0}" height="1400" fill="#2E8FD0" opacity="${op}"/><path d="M${x0},${WS} L${x1},${WS}" stroke="#fff" stroke-width="6" opacity=".8"/>`; }
function splash(x, y, t, t0, sc=1) {
  if (t < t0 || t > t0 + 2.4) return ''; const d = t - t0, k = d/2.4; let s = '';
  const h = 900*sc*Math.sin(Math.min(1, d/1.3)*Math.PI)*(d < 1.3 ? 1 : 0);
  s += `<ellipse cx="${x}" cy="${y + 6}" rx="${(160 + 120*k)*sc}" ry="${26*sc}" fill="#F4FFFF" stroke="${INK}" stroke-width="5" opacity="${1 - k}"/>`;
  if (h > 0) s += `<path d="M${x - 120*sc},${y} Q${x - 90*sc},${y - h*.6} ${x - 30*sc},${y - h} Q${x},${y - h*1.05} ${x + 30*sc},${y - h} Q${x + 90*sc},${y - h*.6} ${x + 120*sc},${y} Z" fill="#BFF0FF" stroke="${INK}" stroke-width="6" opacity=".95"/>`;
  for (let i = 0; i < 26; i++) { const a = -Math.PI*(.15 + .7*hash(i*3.3)), v = (500 + 900*hash(i))*sc, px = x + Math.cos(a)*v*d, py = y + Math.sin(a)*v*d + 1500*sc*d*d;
    if (py < y + 10) s += `<circle cx="${px}" cy="${py}" r="${(8 + 14*hash(i + 1))*sc}" fill="#BFF0FF" stroke="${INK}" stroke-width="${3*sc}"/>`; }
  s += `<ellipse cx="${x}" cy="${y}" rx="${(200 + 500*easeOut(k))*sc}" ry="${(30 + 50*easeOut(k))*sc}" fill="none" stroke="#fff" stroke-width="${10*(1 - k)}" opacity="${1 - k}"/>`;
  return s;
}
function kid(i, t, x, y, keys, extra={}) {   // small swimmer with armbands
  const P = [{ hood: false, hair: 'curly', hairCol: '#1B1D33', top: '#FF7EB6' }, { hood: false, hair: 'short', hairCol: '#8A4A2A', top: '#7ED957' }, { hood: false, hair: 'bun', hairCol: '#E8C27A', top: '#B07CFF' }, { hood: false, hair: 'long', hairCol: '#5A3A2A', top: '#FF8A3D' }][i % 4];
  const o = { ...dexAt(keys, t, () => ({ x, y }), { s: DS*.68, seed: 70 + i, air: true, noShadow: true, ...extra }), type: 'plain', pants: '#2B2F4A', stripe: false, ...P, ...extra };
  return chibi2(o) + `<circle cx="${x - 48*o.s}" cy="${y - 150*o.s}" r="${22*o.s}" fill="#FF8A3D" stroke="${INK}" stroke-width="4"/><circle cx="${x + 48*o.s}" cy="${y - 150*o.s}" r="${22*o.s}" fill="#FF8A3D" stroke="${INK}" stroke-width="4"/>`;
}
function ringing(x, y, t, s=1) { let r = ''; for (let i = 0; i < 3; i++) { const k = ((t*1.5 + i/3) % 1); r += `<path d="M${x - (40 + 60*k)*s},${y - 30*s} a${(40 + 60*k)*s},${(40 + 60*k)*s} 0 0 1 0,${60*s}" stroke="#E8463C" stroke-width="${10*s}" fill="none" opacity="${1 - k}"/><path d="M${x + (40 + 60*k)*s},${y - 30*s} a${(40 + 60*k)*s},${(40 + 60*k)*s} 0 0 0 0,${60*s}" stroke="#E8463C" stroke-width="${10*s}" fill="none" opacity="${1 - k}"/>`; } return r; }
function diver(x, y, s, rot=0) { return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><circle cx="0" cy="-130" r="28" fill="#F2C09A" stroke="${INK}" stroke-width="5"/><path d="M-14,-100 L14,-100 L18,10 L-18,10 Z" fill="#3D8BFF" stroke="${INK}" stroke-width="5"/><path d="M-10,-100 L-30,-200 M10,-100 L30,-200 M-10,10 L-12,80 M10,10 L12,80" stroke="#F2C09A" stroke-width="16" stroke-linecap="round"/><path d="M-10,-100 L-30,-200 M10,-100 L30,-200 M-10,10 L-12,80 M10,10 L12,80" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none" opacity=".4"/></g>`; }

// the red hood (Rig 2.0 body, red hood, face in shadow, two white eyes)
function redHood3(x, y, s, eyesOn=1, t=0) {
  const o = { type: 'hoodie', top: '#E8463C', hood: true, pants: '#1F2033', stripe: false, x, y, s, t, eyes: 'open', mouth: 'flat', armF: [-10, 10], armB: [10, -10], breath: 0, blink: 0, hoodTip: 0, noShadow: true };
  return chibi2(o) + `<ellipse cx="${x}" cy="${y - 238*s}" rx="${80*s}" ry="${78*s}" fill="#14162A"/>` + (eyesOn ? `<g opacity="${eyesOn}"><ellipse cx="${x - 30*s}" cy="${y - 232*s}" rx="${15*s}" ry="${7*s}" fill="#FFF"/><ellipse cx="${x + 30*s}" cy="${y - 232*s}" rx="${15*s}" ry="${7*s}" fill="#FFF"/></g>` : '');
}
