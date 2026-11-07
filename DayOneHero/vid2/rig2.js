// ============================================================================
// Day One Hero: RIG 2.0 + CAMERA 2.0
// Load after lib.js and helpers.js. Nothing here changes the old rig, so Ep1
// and Ep2 still render exactly as before.
//
//   chibi2(o)            Dex rig: auto ground contact, squash/stretch, spin,
//                        breathing, round hood and drawstrings that follow
//                        motion, new eyes/brows/mouths, fists, trainers.
//   POSES                named key poses (34 of them).
//   poseAt(keys,t)       pose-to-pose with per-key easing (io, o = overshoot,
//                        snap, in, hold) and anticipation-friendly switching.
//   dexAt(keys,t,extra)  poseAt + blinks + breathing + secondary motion.
//   layerT(cam,p)        camera transform for a parallax layer (p=1 is the
//                        world, p<1 further away, p>1 foreground).
//   camAt(keys,t)        camera keyframes {x,y,z,r}.
//   shakeAt(t,events)    trauma-style shake (offset + roll).
//   focusLines, speedLines, dust, smearGhosts, impact filters, vignette.
// ============================================================================

const R2DEFS = `<defs>
<filter id="b2" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b4" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b8" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b14" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="mb1" x="-10%" y="-2%" width="120%" height="104%"><feGaussianBlur stdDeviation="10 0"/></filter>
<filter id="mb2" x="-10%" y="-2%" width="120%" height="104%"><feGaussianBlur stdDeviation="26 0"/></filter>
<filter id="mb3" x="-10%" y="-2%" width="120%" height="104%"><feGaussianBlur stdDeviation="48 0"/></filter>
<filter id="impInk" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
 <feColorMatrix type="matrix" values="0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0 0 0 1 0"/>
 <feComponentTransfer><feFuncR type="discrete" tableValues="0.10 0.10 1 1"/><feFuncG type="discrete" tableValues="0.11 0.11 0.97 0.97"/><feFuncB type="discrete" tableValues="0.23 0.23 0.92 0.92"/></feComponentTransfer></filter>
<filter id="impRed" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
 <feColorMatrix type="matrix" values="0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0 0 0 1 0"/>
 <feComponentTransfer><feFuncR type="discrete" tableValues="1 1 0.10 0.10"/><feFuncG type="discrete" tableValues="0.94 0.94 0.11 0.11"/><feFuncB type="discrete" tableValues="0.47 0.47 0.23 0.23"/></feComponentTransfer></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="72%"><stop offset=".55" stop-color="#0B0E2A" stop-opacity="0"/><stop offset="1" stop-color="#0B0E2A" stop-opacity=".42"/></radialGradient>
<radialGradient id="sunG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".95"/><stop offset=".25" stop-color="#FFE9A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
<radialGradient id="headL" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF7C8" stop-opacity=".9"/><stop offset=".4" stop-color="#FFE98A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE98A" stop-opacity="0"/></radialGradient>
<linearGradient id="warm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD58A" stop-opacity=".22"/><stop offset=".6" stop-color="#FFD58A" stop-opacity="0"/><stop offset="1" stop-color="#5A4BB0" stop-opacity=".14"/></linearGradient>
<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E9BF2"/><stop offset=".55" stop-color="#8CCBFF"/><stop offset="1" stop-color="#DDF1FF"/></linearGradient>
<linearGradient id="grass2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EDB7E"/><stop offset="1" stop-color="#5DB765"/></linearGradient>
<linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD9B0"/><stop offset="1" stop-color="#C9EBD6"/></linearGradient>
<linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#78C98A"/><stop offset="1" stop-color="#A6DDA8"/></linearGradient>
<linearGradient id="road2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6280"/><stop offset=".5" stop-color="#6E7290"/><stop offset="1" stop-color="#4A4D66"/></linearGradient>
<linearGradient id="carSheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#FFF6C0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF6C0" stop-opacity="0"/></linearGradient>
</defs>`;

// ---------------------------------------------------------------- easing
const E = {
  io: k => k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k+2, 3)/2,
  o: k => { const c1 = 2.2, c3 = c1+1; return 1 + c3*Math.pow(k-1,3) + c1*Math.pow(k-1,2); }, // overshoot
  o2: k => 1 - Math.exp(-6*k)*Math.cos(k*10),          // springy settle (overshoots, wobbles)
  snap: k => 1 - Math.pow(1-k, 5),
  in: k => k*k*k,
  lin: k => k,
  hold: k => k < 1 ? 0 : 1,
};
const hash = n => { const s = Math.sin(n*127.1 + 311.7)*43758.5453; return s - Math.floor(s); };
const noise1 = (t, f, sd=0) => Math.sin(t*f + sd) * .55 + Math.sin(t*f*2.17 + sd*1.7) * .3 + Math.sin(t*f*4.31 + sd*2.3) * .15;

// ---------------------------------------------------------------- poses
// Angles: 0 = limb hanging straight down, +90 = towards screen-right, 180 = up.
// legL/legR/armF/armB = [upper, lower(relative)].  sq <1 squash, >1 stretch.
const PDEF = { armF:[-16,12], armB:[16,-12], legL:[3,0], legR:[-3,0], lean:0, bob:0, sq:1, tilt:0,
  brow:0, browA:0, look:[0,0], armLen:1, eyes:'open', mouth:'smile', handF:null, handB:null };
const POSES = {
  idle:       {},
  idleB:      {lean:-1.5, tilt:-3, armF:[-12,16], armB:[12,-16], legL:[1,0], legR:[-6,0]},
  smile:      {eyes:'happy', mouth:'grin', tilt:-5},
  lookR:      {tilt:7, look:[9,0], lean:2},
  lookCam:    {tilt:-2, look:[0,2]},
  confident:  {armF:[48,-112], armB:[-48,112], legL:[-9,0], legR:[9,0], tilt:-5, mouth:'smirk', brow:3, browA:-4},
  knuckleA:   {armF:[25,-115], armB:[-25,115], sq:.97, lean:-3, tilt:5, eyes:'happy', mouth:'smirk'},
  knuckle:    {armF:[-32,-82], armB:[32,82], handF:'fist', handB:'fist', tilt:-4, eyes:'happy', mouth:'grin', sq:1.02},
  stretchUp:  {armF:[124,30], armB:[-124,-30], sq:1.07, eyes:'closed', mouth:'o', tilt:0, legL:[-4,0], legR:[4,0]},
  ready:      {armF:[62,-95], armB:[-62,95], handF:'fist', handB:'fist', legL:[-14,2], legR:[14,-2], eyes:'determined', browA:8, mouth:'smirk', tilt:-3},
  surprise:   {eyes:'wide', mouth:'o', brow:12, sq:1.05, armF:[38,38], armB:[-38,-38]},
  gulp:       {eyes:'wide', mouth:'wobble', look:[9,-1], tilt:6, sweat:true, armF:[-6,-40], armB:[6,40], sq:.97, brow:8, browA:-8},
  worried:    {eyes:'open', mouth:'wobble', look:[9,0], tilt:4, brow:10, browA:-12, sweat:true, armF:[-24,-70], armB:[24,70], handF:'fist', handB:'fist'},
  stompLiftL: {legL:[-58,78], legR:[8,0], lean:5, armF:[72,-62], armB:[-84,40], handF:'fist', handB:'fist', sq:1.03, eyes:'determined', mouth:'grit', browA:14},
  stompL:     {legL:[-26,6], legR:[8,0], lean:-2, sq:.9, armF:[66,-80], armB:[-66,80], handF:'fist', handB:'fist', eyes:'determined', mouth:'grit', browA:14},
  stompLiftR: {legL:[-26,6], legR:[58,-78], lean:-5, armF:[84,-40], armB:[-72,62], handF:'fist', handB:'fist', sq:1.03, eyes:'determined', mouth:'grit', browA:16},
  plant:      {legL:[-27,6], legR:[27,-6], sq:.92, armF:[62,-80], armB:[-62,80], handF:'fist', handB:'fist', lean:2, eyes:'determined', browA:17, mouth:'grit'},
  brace:      {legL:[-32,10], legR:[32,-10], sq:.88, lean:7, armF:[86,-24], armB:[-58,84], handF:'fist', handB:'fist', eyes:'determined', browA:22, mouth:'grit', tilt:5},
  flinch:     {legL:[-32,10], legR:[32,-10], eyes:'squeeze', mouth:'grit', sq:.86, lean:-5, armF:[128,38], armB:[-124,-40], tilt:-9, brow:4},
  impact:     {eyes:'squeeze', mouth:'wail', armF:[122,40], armB:[-118,-44], legL:[-42,22], legR:[44,-22], tilt:-10},
  launch:     {eyes:'shock', mouth:'wail', armF:[124,34], armB:[-130,-24], legL:[-62,42], legR:[52,-62], air:true, brow:14},
  flailA:     {eyes:'shock', mouth:'wail', armF:[100,70], armB:[-128,-36], legL:[-30,62], legR:[72,-30], air:true, brow:14},
  flailB:     {eyes:'shock', mouth:'wail', armF:[132,-20], armB:[-100,-70], legL:[-72,22], legR:[30,-72], air:true, brow:14},
  dive:       {eyes:'squeeze', mouth:'o', armF:[128,26], armB:[-128,-26], legL:[-5,0], legR:[5,0], air:true, brow:6},
  sunk:       {eyes:'swirl', mouth:'wobble', tilt:12, armF:[-4,6], armB:[4,-6], legL:[-30,60], legR:[30,-60]},
  dizzy:      {eyes:'swirl', mouth:'wobble', tilt:-10, lean:-3, armF:[20,30], armB:[-20,-30], legL:[-30,60], legR:[30,-60]},
  peek:       {eyes:'swirl', mouth:'o', tilt:8, armF:[96,-80], armB:[-96,80], legL:[-30,60], legR:[30,-60]},
  crouchPop:  {sq:.78, legL:[-52,72], legR:[52,-72], armF:[24,-18], armB:[-24,18], eyes:'closed', mouth:'flat', handF:'fist', handB:'fist', brow:-2},
  popJump:    {sq:1.16, air:true, armF:[128,26], armB:[-128,-26], legL:[-12,34], legR:[12,-34], eyes:'happy', mouth:'grin', tilt:-4},
  landSquash: {sq:.82, legL:[-34,34], legR:[34,-34], armF:[104,14], armB:[-104,-14], eyes:'happy', mouth:'grin'},
  peace:      {armF:[116,54], armLen:1.38, handF:'peace', armB:[-34,58], handB:'fist', eyes:'open', sparkle:true, mouth:'grin', tilt:-7, lean:-2, legL:[-8,0], legR:[10,0]},
  cheer:      {armF:[124,34], armB:[-124,-34], handF:'fist', handB:'fist', mouth:'grin', eyes:'happy', sq:1.04},
  shrug:      {armF:[70,82], armB:[-70,-82], tilt:7, mouth:'flat', brow:7, browA:-6},
  point:      {armF:[96,-6], armLen:1.15, handF:'point', armB:[-18,10], mouth:'grin', tilt:-3},
  think:      {armF:[-32,-118], handF:'fist', tilt:-8, look:[-6,-8], mouth:'flat', brow:5},
  wave:       {armF:[112,52], handF:null, mouth:'grin', eyes:'happy', tilt:-6},
};

function mixPose(a, b, k, sw=.5) {
  const o = {}; const keys = new Set([...Object.keys(PDEF), ...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const va = a[key] ?? PDEF[key], vb = b[key] ?? PDEF[key];
    if (typeof va === 'number' && typeof vb === 'number') o[key] = lerp(va, vb, k);
    else if (Array.isArray(va) && Array.isArray(vb)) o[key] = va.map((v, i) => lerp(v, vb[i], k));
    else o[key] = k < sw ? va : vb;
  }
  return o;
}
const P = n => typeof n === 'string' ? POSES[n] : n;
// keys: [[time, pose(name|obj), ease='io', sw=.35], ...]  ease = curve INTO that key.
function poseAt(keys, t) {
  if (t <= keys[0][0]) return mixPose(P(keys[0][1]), P(keys[0][1]), 1);
  for (let i = 1; i < keys.length; i++) {
    const [t1, p1, e = 'io', sw = .35] = keys[i];
    if (t < t1) {
      const [t0, p0] = keys[i-1]; const raw = (t - t0) / (t1 - t0);
      return mixPose(P(p0), P(p1), E[e](raw), sw);
    }
  }
  const last = keys[keys.length-1]; return mixPose(P(last[1]), P(last[1]), 1);
}
// natural blinks: 2-5 s apart, occasional double blink. returns 0..1 lid closure
function blinkAt(t, seed=1) {
  let tb = .6 + hash(seed)*1.2, k = 0;
  while (tb < t + .3 && k < 200) {
    const d = t - tb;
    if (d >= 0 && d < .17) return d < .05 ? d/.05 : d < .08 ? 1 : 1 - (d-.08)/.09;
    if (hash(seed*7 + k) > .82) { const d2 = t - (tb + .24); if (d2 >= 0 && d2 < .15) return d2 < .045 ? d2/.045 : d2 < .07 ? 1 : 1 - (d2-.07)/.08; }
    tb += 2.0 + hash(seed*3 + k*1.3)*3.0; k++;
  }
  return 0;
}
const DEX2 = { type:'hoodie', top:'#FFC21F', hood:true, hair:'dex', pants:'#1F2033', stripe:true };
// pos(t) -> {x,y} world; secondary motion is derived from lagged samples so render(t) stays stateless.
function dexAt(keys, t, pos, extra={}) {
  const p = poseAt(keys, t), q = pos(t), q1 = pos(t - .1), q2 = pos(t - .2);
  const vx = (q.x - q1.x) / .1, ax = ((q.x - q1.x) - (q1.x - q2.x)) / .01;
  const pl = poseAt(keys, t - .09);
  const swing = clamp(-vx/900 + (p.lean - pl.lean)*.08 + (p.tilt - pl.tilt)*.05 - ax/9000, -1.6, 1.6);
  const o = { ...DEX2, ...p, x:q.x, y:q.y, t, sway: swing + Math.sin(t*2.3)*.12,
    hoodTip: swing*14 + Math.sin(t*2.9)*3, blink: blinkAt(t, extra.seed||3) };
  return Object.assign(o, extra);
}

// ---------------------------------------------------------------- the rig
function face2(o, t) {
  let s = ''; const lx = o.look ? o.look[0] : 0, ly = o.look ? o.look[1] : 0; const ey = 6;
  const lid = Math.max(o.squint || 0, o.blink || 0);
  let eyes = o.eyes || 'open';
  if (lid > .8 && ['open','wide','determined','shock'].includes(eyes)) eyes = 'closed';
  const br = o.brow || 0, ba = o.browA || 0;
  if (eyes === 'closed') {
    s += `<path d="M-44,${ey+2} Q-30,${ey+11} -16,${ey+2}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M16,${ey+2} Q30,${ey+11} 44,${ey+2}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  } else if (eyes === 'happy') {
    s += `<path d="M-44,${ey+6} Q-30,${ey-12} -16,${ey+6}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M16,${ey+6} Q30,${ey-12} 44,${ey+6}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  } else if (eyes === 'squeeze') {
    s += `<path d="M-44,${ey-12} L-17,${ey} L-44,${ey+12}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M44,${ey-12} L17,${ey} L44,${ey+12}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (eyes === 'swirl') {
    for (const sx of [-1,1]) { let d = ''; for (let i = 0; i <= 40; i++) { const a = i/40*4.5*Math.PI + t*9*sx, r = 2 + i*.42; d += (i ? 'L' : 'M') + (30*sx + Math.cos(a)*r).toFixed(1) + ',' + (ey + Math.sin(a)*r*1.1).toFixed(1); }
      s += `<ellipse cx="${30*sx}" cy="${ey}" rx="19" ry="21" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`; }
  } else if (eyes === 'shock') {
    const j = Math.sin(t*70)*1.5;
    for (const sx of [-1,1]) s += `<ellipse cx="${30*sx}" cy="${ey}" rx="18" ry="23" fill="#fff" stroke="${INK}" stroke-width="4.5"/><circle cx="${30*sx+lx*.5+j}" cy="${ey+ly*.5}" r="6" fill="${INK}"/>`;
  } else {
    const wide = eyes === 'wide'; const rx = wide ? 17 : 15, ry = wide ? 22.5 : 20; const sq = lid;
    for (const sx of [-1,1]) {
      const cx = 30*sx + lx, cy = ey + ly + sq*6;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry*(1-sq)}" fill="url(#eyeG)"/>`;
      s += `<ellipse cx="${cx-5}" cy="${cy-8*(1-sq)}" rx="6" ry="${7*(1-sq)}" fill="#fff"/><circle cx="${cx+6}" cy="${cy+8*(1-sq)}" r="3" fill="#fff" opacity="${1-sq}"/>`;
      if (o.sparkle) s += `<path d="M${cx+4},${cy-5} l3,-8 l3,8 l8,3 l-8,3 l-3,8 l-3,-8 l-8,-3 Z" fill="#fff"/>`;
      if (eyes === 'determined') {   // heavy top lid, angled in towards the nose
        const ox = cx + sx*19, ix = cx - sx*19;
        s += `<path d="M${ox},${cy-30} L${ox},${cy-11} L${ix},${cy-1} L${ix},${cy-30} Z" fill="url(#skin)"/><path d="M${ox+sx*2},${cy-12} L${ix},${cy-1}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
      } else if (sq > .05) s += `<path d="M${cx-rx-2},${cy-ry*(1-sq)} Q${cx},${cy-ry*(1-sq)-6} ${cx+rx+2},${cy-ry*(1-sq)}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      else s += `<path d="M${cx-rx-1},${cy-ry*.55} Q${cx-rx*.2},${cy-ry-5} ${cx+rx+3},${cy-ry*.75}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    }
  }
  s += `<path d="M-44,${-26-br} Q-30,${-34-br} -16,${-28-br}" transform="rotate(${ba},-30,${-29-br})" fill="none" stroke="#1B1B2B" stroke-width="6.5" stroke-linecap="round"/><path d="M16,${-28-br} Q30,${-34-br} 44,${-26-br}" transform="rotate(${-ba},30,${-29-br})" fill="none" stroke="#1B1B2B" stroke-width="6.5" stroke-linecap="round"/>`;
  if (o.blush !== false) s += `<ellipse cx="-50" cy="30" rx="15" ry="8" fill="#FF8C9A" opacity=".7"/><ellipse cx="50" cy="30" rx="15" ry="8" fill="#FF8C9A" opacity=".7"/>`;
  const m = o.mouth || 'smile';
  if (m === 'grin') s += `<path d="M-22,36 Q0,36 22,36 Q20,66 0,66 Q-20,66 -22,36 Z" fill="#7A1F33" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-19,38 L19,38 L18,45 L-18,45 Z" fill="#fff"/><path d="M-11,58 Q0,50 11,58 Q0,65 -11,58 Z" fill="#FF7E7E"/>`;
  else if (m === 'o') s += `<ellipse cx="0" cy="46" rx="8" ry="10" fill="#7A1F33" stroke="${INK}" stroke-width="4"/>`;
  else if (m === 'wail') s += `<path d="M-26,34 Q0,28 26,34 Q22,80 0,82 Q-22,80 -26,34 Z" fill="#7A1F33" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-20,37 Q0,33 20,37 L19,44 Q0,40 -19,44 Z" fill="#fff"/><ellipse cx="0" cy="70" rx="12" ry="7" fill="#FF7E7E"/>`;
  else if (m === 'grit') s += `<rect x="-24" y="34" width="48" height="20" rx="7" fill="#fff" stroke="${INK}" stroke-width="4.5"/><path d="M-23,44 L23,44 M-8,35 L-8,53 M8,35 L8,53" stroke="${INK}" stroke-width="3"/>`;
  else if (m === 'smirk') s += `<path d="M-13,43 Q3,49 17,35" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  else if (m === 'wobble') s += `<path d="M-17,45 q4.25,-6 8.5,0 q4.25,6 8.5,0 q4.25,-6 8.5,0 q4.25,6 8.5,0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  else if (m === 'laugh') s += `<path d="M-16,38 Q0,38 16,38 Q14,58 0,58 Q-14,58 -16,38 Z" fill="#7A1F33" stroke="${INK}" stroke-width="4"/>`;
  else if (m === 'flat') s += `<path d="M-9,44 L9,44" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  else s += `<path d="M-12,40 Q0,50 12,40" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="24" r="2.5" fill="#E0A08A"/>`;
  return s;
}
function hand2(x, y, ang, kind) {
  if (kind === 'fist') return `<g transform="translate(${x},${y}) rotate(${-ang+180})"><circle r="16" fill="url(#skin)" stroke="${INK}" stroke-width="4.5"/><path d="M-9,-6 L-9,4 M-2,-8 L-2,5 M5,-7 L5,4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/></g>`;
  return hand(x, y, ang, 'url(#skin)', kind);
}
function chibi2(o) {
  const s = o.s || 1, x = o.x, y = o.y, t = o.t || 0;
  const top = o.top || '#FFC21F', pants = o.pants || '#1F2033', STR = '#FFF1D6';
  const L = o.legL || [4,0], R = o.legR || [-4,0];
  const legs = [[-15,L],[15,R]].map(([hx,lg]) => [hx, limb(hx, -72, lg[0], 38, lg[1], 34, 22, pants)]);
  const footY = Math.max(...legs.map(([,l]) => l.end[1]));
  const sqv = o.sq || 1;
  const bob = (o.bob || 0) + (o.air ? 0 : -footY);
  const br = o.breath ?? Math.sin(t*2*Math.PI/3.4);
  const st = o.stretch || 1, sd = o.sdir || 0, rot = o.rot || 0;
  let g = `<g transform="translate(${x},${y}) scale(${o.flip?-s:s},${s})">`;
  if (!o.air && !o.noShadow) g += `<ellipse cx="0" cy="6" rx="${66/Math.sqrt(sqv)}" ry="12" fill="#0B0E2A" opacity=".22"/>`;
  g += `<g transform="rotate(${rot},0,-150) translate(0,-150) rotate(${sd}) scale(${st},${1/st}) rotate(${-sd}) translate(0,150)">`;
  g += `<g transform="scale(${1/Math.sqrt(sqv)},${sqv})"><g transform="translate(0,${bob}) rotate(${o.lean||0},0,-60)">`;
  // legs + trainers (white with blue stripe)
  for (const [hx,l] of legs) {
    g += l.svg;
    if (o.stripe) g += `<path d="M${hx+6},-66 L${l.end[0]+6},${l.end[1]-6}" stroke="#fff" stroke-width="4" opacity=".9"/>`;
    const ex = l.end[0], ey = l.end[1];
    g += `<path d="M${ex-17},${ey+7} Q${ex-17},${ey-13} ${ex+2},${ey-13} Q${ex+23},${ey-11} ${ex+25},${ey+7} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${ex-14},${ey+2} L${ex+22},${ey+2}" stroke="#3D8BFF" stroke-width="5"/><path d="M${ex-6},${ey-9} Q${ex+4},${ey-4} ${ex+12},${ey-10}" stroke="#3D8BFF" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  // back arm
  const aB = o.armB || [20,-10];
  const la = limb(-42, -150, aB[0], 40, aB[1], 36, 22, top); g += la.svg + hand2(la.end[0], la.end[1], la.ang, o.handB);
  // torso (breathes)
  g += `<g transform="translate(0,-64) scale(${1+br*.008},${1+br*.018}) translate(0,64)">`;
  g += `<path d="M-48,-168 Q0,-180 48,-168 Q58,-110 54,-64 Q0,-54 -54,-64 Q-58,-110 -48,-168 Z" fill="${top}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  g += `<path d="M32,-164 Q38,-110 32,-61 Q44,-62 52,-66 Q56,-110 48,-162 Z" fill="#B8650A" opacity=".22"/><path d="M-40,-160 Q-46,-120 -42,-90" stroke="#FFE9A0" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>`;
  if (o.type === 'jacket') g += `<path d="M0,-172 L0,-62" stroke="${INK}" stroke-width="4" opacity=".6"/><path d="M-26,-172 L0,-140 L26,-172" fill="${o.shirt||'#BFE6FF'}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  else g += `<path d="M-30,-98 L30,-98 L36,-66 L-36,-66 Z" fill="#000" opacity=".07"/><path d="M-30,-98 L30,-98 L36,-66 L-36,-66 Z" fill="none" stroke="${INK}" stroke-width="3.5" opacity=".55"/>`;
  g += `<path d="M-48,-70 Q0,-60 52,-70" stroke="#000" stroke-width="5" opacity=".12" fill="none"/>`;
  if (o.type !== 'jacket' && o.type !== 'plain') for (const sx of [-1,1]) { const sw = o.sway || 0, w = o.wind || 0;
    const d = `M${12*sx},-162 Q${14*sx+sw*9-w*8},${-140+Math.abs(w)*6} ${12*sx-w*30+sw*20},${-116-Math.abs(sw)*8-Math.abs(w)*14}`;
    g += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="9.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${STR}" stroke-width="5" stroke-linecap="round"/>`;
    const [ax,ay] = [12*sx-w*30+sw*20, -116-Math.abs(sw)*8-Math.abs(w)*14]; g += `<rect x="${ax-4}" y="${ay-2}" width="8" height="10" rx="3" fill="#C9C2DA" stroke="${INK}" stroke-width="3"/>`; }
  g += `</g>`;
  // head (rides the breath a little)
  g += `<g transform="translate(0,${-238-br*2.2}) rotate(${o.tilt||0})">`;
  const ht = o.hoodTip || 0, w = o.wind || 0;
  // round hood (as in the thumbnail) with follow-through: it lags, swings and squashes with motion, no point
  const hb = clamp(ht/14, -1.6, 1.6);
  if (o.hood !== false) {
  g += `<g transform="rotate(${hb*3.2 - w*4},0,30) translate(${-w*7 - hb*2},${Math.abs(hb)*1.5}) scale(${1 + Math.abs(hb)*.018},${1 - Math.abs(hb)*.025})">`;
  g += `<path d="M-96,10 C-104,-80 -50,-122 0,-122 C${50-w*30},-122 ${104-w*40},-80 ${96-w*30},10 C90,70 50,92 0,92 C-50,92 -90,70 -96,10 Z" fill="${o.top && o.top !== '#FFC21F' ? o.top : 'url(#hoodG)'}" stroke="${INK}" stroke-width="6"/>`;
  g += `<path d="M-70,-82 Q-30,-112 20,-108" fill="none" stroke="#FFF1B0" stroke-width="9" stroke-linecap="round" opacity=".85"/><path d="M84,-30 Q96,20 70,64" fill="none" stroke="#C97A06" stroke-width="10" stroke-linecap="round" opacity=".35"/></g>`;
  } else g += hairBack(o.hair, o.hairCol || '#5A3A2A');
  g += `<ellipse cx="0" cy="0" rx="80" ry="78" fill="url(#skin)" stroke="${INK}" stroke-width="5.5"/>`;
  g += `<path d="M48,-62 A80,78 0 0 1 48,62 Q74,0 48,-62 Z" fill="#E08F76" opacity=".2"/>`;
  g += o.hood === false ? hairFront(o.hair, o.hairCol || '#5A3A2A') : hairFront('dex');
  if (o.hood !== false) g += `<path d="M-82,8 C-86,-70 -40,-104 0,-104 C40,-104 86,-70 82,8" fill="none" stroke="${top}" stroke-width="13"/><path d="M-82,8 C-86,-70 -40,-104 0,-104 C40,-104 86,-70 82,8" fill="none" stroke="${INK}" stroke-width="3" transform="translate(0,-7) scale(1.08)"/>`;
  g += face2(o, t);
  if (o.acc === 'glasses') g += `<circle cx="-30" cy="6" r="25" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="6" r="25" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="5"/><path d="M-5,4 L5,4" stroke="${INK}" stroke-width="5"/>`;
  if (o.acc === 'shades') g += `<path d="M-58,-14 L-6,-14 Q-4,26 -32,28 Q-58,26 -58,-14 Z M6,-14 L58,-14 Q58,26 32,28 Q4,26 6,-14 Z" fill="#14162A" stroke="${INK}" stroke-width="5"/><path d="M-6,-10 L6,-10 M-58,-12 L-78,-20 M58,-12 L78,-20" stroke="${INK}" stroke-width="5"/><path d="M-48,-6 L-36,-6 M16,-6 L28,-6" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  if (o.sweat) { const sy = (t*60 % 40); g += `<path d="M74,${-44+sy*.3} C82,${-28+sy*.3} 84,${-16+sy*.3} 76,${-10+sy*.3} C66,${-4+sy*.3} 58,${-14+sy*.3} 64,${-28+sy*.3} Z" fill="#BFE6FF" stroke="${INK}" stroke-width="4"/>`; }
  g += `</g>`;
  // front arm
  const aF = o.armF || [-20,10], AL = o.armLen || 1;
  const ra = limb(42, -150, aF[0], 40*AL, aF[1], 36*AL, 22, top); g += ra.svg + hand2(ra.end[0], ra.end[1], ra.ang, o.handF);
  g += `</g></g></g></g>`;
  return g;
}

// ---------------------------------------------------------------- camera
// layers are authored as seen from REF; p scales how much the camera move applies.
let REF = { x:0, y:540, z:1 };
function layerT(c, p) {
  const z = REF.z * Math.pow(c.z / REF.z, p), x = REF.x + (c.x - REF.x)*p, y = REF.y + (c.y - REF.y)*p;
  return `translate(${960 + (c.sx||0)},${540 + (c.sy||0)}) rotate(${c.r||0}) scale(${z}) translate(${-x},${-y})`;
}
function camAt(keys, t) {
  if (t <= keys[0][0]) return { ...keys[0][1] };
  for (let i = 1; i < keys.length; i++) { const [t1, c1, e = 'io'] = keys[i];
    if (t < t1) { const [t0, c0] = keys[i-1]; const k = E[e]((t - t0)/(t1 - t0)); const o = {}; for (const kk in c1) o[kk] = lerp(c0[kk] ?? c1[kk], c1[kk], k); return o; } }
  return { ...keys[keys.length-1][1] };
}
// events: [[t0, amplitude(px), duration]]
function shakeAt(t, events) {
  let x = 0, y = 0, r = 0;
  for (const [t0, a, d] of events) { if (t < t0 || t > t0 + d) continue; const k = 1 - (t - t0)/d, tr = k*k*a;
    x += noise1(t, 63, t0)*tr; y += noise1(t, 71, t0+5)*tr*.8; r += noise1(t, 41, t0+9)*tr*.04; }
  return { sx:x, sy:y, sr:r };
}

// ---------------------------------------------------------------- fx
function focusLines(t, cx=960, cy=540, op=.9, inner=430, col=INK, n=70) {
  const f = Math.floor(t*30); let s = `<g opacity="${op}">`;
  for (let i = 0; i < n; i++) { const a = (i + hash(f*13 + i)*.8)/n*2*Math.PI, w = .006 + hash(f*7 + i*3)*.016, r0 = inner + hash(f*5 + i)*260;
    s += `<path d="M${cx+Math.cos(a-w)*1800},${cy+Math.sin(a-w)*1800} L${cx+Math.cos(a)*r0},${cy+Math.sin(a)*r0} L${cx+Math.cos(a+w)*1800},${cy+Math.sin(a+w)*1800} Z" fill="${col}"/>`; }
  return s + '</g>';
}
function speedLines(t, n=26, op=.8, col='#FFFFFF', dir=1, yMin=0, yMax=1080) {
  const f = Math.floor(t*30); let s = `<g opacity="${op}">`;
  for (let i = 0; i < n; i++) { const y = yMin + hash(i*9.1 + f*.37)*(yMax - yMin), len = 200 + hash(i + f)*700, x = hash(i*3.3 + f*1.7)*2400 - 240;
    s += `<rect x="${dir > 0 ? x : 1920 - x - len}" y="${y}" width="${len}" height="${3 + hash(i*5 + f)*7}" rx="4" fill="${col}"/>`; }
  return s + '</g>';
}
function dust(x, y, t, t0, n=9, sc=1, col='#E9E2D2', dur=.9) {   // soft wisps hugging the ground + a few pebbles
  if (t < t0 || t > t0 + dur) return ''; const k = (t - t0)/dur, e = easeOut(k), tt = t - t0; let s = '', p = '';
  for (let i = 0; i < n*2; i++) { const side = i % 2 ? 1 : -1, a = hash(i*3.1)*.9, r = (20 + 190*e*(.5 + hash(i)*.7))*sc;
    const cx = x + side*Math.cos(a)*r*1.5, cy = y - Math.sin(a)*r*.5 - 8*sc - e*24*sc*hash(i + 4), rx = (14 + 50*e)*sc*(.6 + hash(i + 9)*.6);
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx*.5}" fill="${col}" opacity="${.5*(1 - k)*(.6 + hash(i + 2)*.4)}"/>`; }
  for (let i = 0; i < n; i++) { const side = i % 2 ? 1 : -1, px = x + side*(120 + hash(i + 7)*260)*sc*tt, py = y - (220 + hash(i + 3)*300)*sc*tt + 1100*sc*tt*tt;
    if (py < y + 4) p += `<circle cx="${px}" cy="${py}" r="${(3 + hash(i)*4)*sc}" fill="#7D705A" opacity="${1 - k}"/>`; }
  return `<g filter="url(#b4)">${s}</g>${p}`;
}
function vignette() { return `<rect width="1920" height="1080" fill="url(#warm)"/><rect width="1920" height="1080" fill="url(#vig)"/>`; }

// side-view runner with the ROUND hood (no streaming point), cream drawstrings
function chibiSide2(o) {
  return chibiSide(o).replace(/<path d="M-104,[^"]*" fill="#F0AE14"[^>]*\/>/, '').replace(/stroke="#fff" stroke-width="4.5"/g, 'stroke="#FFF1D6" stroke-width="4.5"');
}
