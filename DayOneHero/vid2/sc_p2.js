// RIG2
// Ep2 car-crash beat, REMAKE (test clip runs 0-16.0 s; see t_p2.js) (Rig 2.0 + camera language). Same narration timing as sc_p.js:
//   ST[0] 0.40 "Next, Dex tests the big one. Can he stop a car?"
//   ST[1] 4.01 "On a crash-test track, a driverless car rolls towards him at fifty kilometres an hour. Dex plants his feet."
//   ST[2] 10.87 "And the car wins."            (impact = ST[2], lands in the boxes 1.6 s later, as in the original)
// Shot list (cut roughly every 1-3 s):
//   S1 0.00 wide establishing, slow push        S6 9.65 face close-up, push, wind + headlights
//   S2 2.00 medium, low angle: knuckles/stretch S7 10.55 low dutch angle, car rushing in
//   S3 4.15 head-on perspective: car approaches IMPACT frames (ink / red / ink), then
//   S4 6.80 wide: car enters, Dex gulps        S8 10.97 whip-pan follow of the flight, car brakes
//   S5 8.70 feet close-up: stomp, stomp, plant S9 12.55 box pile: dizzy, peek, pop out, peace sign
const CS = 1.55, PILE = -1150;
REF = { x:-150, y:720, z:.62 };
const IMP = ST[2], LAND = IMP + 1.6, FLY0 = IMP + .1;
const SH = [0, 2.0, 4.15, 6.8, 8.7, 9.65, 10.55, IMP, FLY0, 12.55, 1e9];
const shot = t => { let i = 0; while (t >= SH[i+1]) i++; return i + 1; };

// ------------------------------------------------------------ Dex performance (global time, so cuts match on action)
const DEXK = [
  [0,'idle'], [1.1,'idleB'], [1.7,'lookCam'],
  [2.25,'knuckleA'], [2.55,'knuckle','snap'], [2.95,'knuckle'], [3.3,'stretchUp','o'], [3.75,'confident','o'],
  [6.9,'confident'], [7.15,'lookR','snap'], [7.55,'lookR'], [7.75,'gulp','o'], [8.3,'worried'],
  [8.82,'stompLiftL','io',.2], [8.98,'stompL','in'], [9.12,'stompLiftR'], [9.28,'plant','in'], [9.6,'plant'],
  [10.35,'plant'], [10.6,'brace','snap'], [10.84,'flinch','in',.5],
  [IMP,'impact','snap',.1], [FLY0,'launch','snap'], [11.3,'flailA'], [11.6,'flailB'], [11.9,'flailA'], [12.2,'flailB'], [12.42,'dive'],
  [LAND,'sunk','snap',.1], [13.2,'sunk'], [13.55,'peek','o'], [14.2,'dizzy'], [14.42,'surprise','snap',.2],
  [14.58,'crouchPop','io',.3], [14.68,'popJump','snap',.1], [14.98,'popJump'], [15.06,'landSquash','in',.1], [15.32,'peace','o2',.2], [16.3,'smile','o'], [16.9,{...POSES.shrug, mouth:'smirk'},'o'],
];
function flight(t) { const k = seg(t, IMP, LAND); return { x: lerp(-10, PILE, k), y: lerp(GY - 20, GY - 120, k) - 520*4*k*(1-k), k }; }
function dexPos(t) {
  if (t < IMP) return { x: 0, y: GY };
  if (t < LAND) { const f = flight(t); return { x: f.x, y: f.y }; }
  // in the box: sunk, peek, crouch, pop, land in front
  if (t < 13.2) return { x: PILE, y: GY + 165 - 30*Math.exp(-(t-LAND)*9)*Math.cos((t-LAND)*30) };
  if (t < 14.5) return { x: PILE, y: lerp(GY + 165, GY + 78, E.o(seg(t, 13.2, 13.6))) };
  if (t < 14.68) return { x: PILE, y: lerp(GY + 78, GY + 112, E.io(seg(t, 14.5, 14.62))) };
  if (t < 15.06) { const k = seg(t, 14.68, 15.06); return { x: lerp(PILE, PILE + 230, k), y: lerp(GY + 112, GY + 70, k) - 360*4*k*(1-k) }; }
  return { x: PILE + 230, y: GY + 70 };
}

// ------------------------------------------------------------ car
const carX = t => {
  if (t < 6.8) return 4400;
  if (t < 8.7) return lerp(3600, 1150, seg(t, 6.8, 8.7));
  if (t < 10.55) return 1500;                                 // (off-screen cutaways)
  if (t < IMP) return lerp(1350, 300, E.in(seg(t, 10.55, IMP)) * .55 + seg(t, 10.55, IMP) * .45);
  return lerp(300, -420, E.snap(seg(t, IMP, IMP + 1.9)));
};

// ------------------------------------------------------------ boxes
// pile boxes: rest pose + burst flight (ballistic, one bounce, settle)
const BOXES = [[-150,0,150,110,0,''],[0,0,150,110,4,'FRAGILE'],[150,0,140,104,-3,''],[-80,-110,140,100,-6,''],[80,-110,130,96,5,''],[0,-210,120,90,3,'THIS WAY UP']];
const BOXV  = [[-520,-1150,-380,-50,50],[640,-900,420,60,-40],[880,-1250,520,90,70],[-760,-1350,-540,-80,30],[400,-1500,610,-120,60],[-220,-1650,-700,30,-50]];
function boxState(i, t) {
  const [bx, by, w, h, r0, lab] = BOXES[i];
  const x0 = PILE + bx, y0 = GY - 30 + by;
  if (t < LAND) return { x: x0, y: y0, r: r0, w, h, lab, z: by };
  const [vx, vy, spin, dz, rest] = BOXV[i]; const gy = GY - 30 + dz, G = 3000; let tt = t - LAND;
  let x = x0 + vx*tt, y = y0 + vy*tt + .5*G*tt*tt, r = r0 + spin*tt;
  const tHit = (-vy + Math.sqrt(vy*vy + 2*G*(gy - y0))) / G;
  if (tt > tHit) { const u = tt - tHit, v2 = -(vy + G*tHit)*.32, xh = x0 + vx*tHit;
    const tB = 2*(-v2)/G; x = xh + vx*.45*Math.min(u, tB + .25*(1 - Math.exp(-(u - tB)*6)));
    y = gy + (u < tB ? v2*u + .5*G*u*u : 0); r = lerp(r0 + spin*tHit, rest, E.o(Math.min(1, u/.45))); }
  return { x, y, r, w, h, lab, z: dz + (t > LAND + .2 ? 0 : by) };
}
function openBox(x, y, part, wob=0) {   // Dex's box, front view; draw 'back' before Dex and 'front' after
  const w = 250, h = 175;
  if (part === 'back') return `<g transform="translate(${x},${y}) rotate(${wob})"><path d="M${-w/2},${-h} L${-w/2+24},${-h-26} L${w/2-24},${-h-26} L${w/2},${-h} Z" fill="#7A5230" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${-w/2+24},${-h-26} L${-w/2+10},${-h-96} L${w/2-10},${-h-96} L${w/2-24},${-h-26} Z" fill="#C99354" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
  return `<g transform="translate(${x},${y}) rotate(${wob})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="4" fill="#D9A866" stroke="${INK}" stroke-width="6"/><rect x="${w/2-50}" y="${-h+3}" width="47" height="${h-6}" fill="#B07A45" opacity=".35"/><path d="M${-w/2},${-h} L${-w/2-70},${-h+40} L${-w/2-60},${-h+70} L${-w/2},${-h+24} Z" fill="#E5B776" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${w/2},${-h} L${w/2+66},${-h+46} L${w/2+52},${-h+74} L${w/2},${-h+26} Z" fill="#C99354" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><text x="0" y="${-h*.42}" text-anchor="middle" font-family="Lilita One" font-size="34" fill="#C8352C">FRAGILE</text><path d="M-60,${-h*.3} L60,${-h*.3}" stroke="#C8352C" stroke-width="4"/></g>`;
}

// ------------------------------------------------------------ world layers
function skyL(t) {
  let s = `<rect x="-5000" y="-2200" width="10000" height="3600" fill="url(#sky2)"/><circle cx="-1250" cy="80" r="720" fill="url(#sunG)"/><circle cx="-1250" cy="80" r="95" fill="#FFF8DC" opacity=".95"/>`;
  for (let i = 0; i < 7; i++) s += cloud(-3200 + i*1050 + ((t*14 + i*130) % 600), 120 + (i%3)*90, .9 + (i%2)*.5);
  return s;
}
function farL(t) {
  let s = '';
  for (let i = 0; i < 26; i++) { const x = -3600 + i*270 + (i*97 % 80), h = 110 + (i*53 % 150), w = 150 + (i*31 % 90);
    s += `<rect x="${x}" y="${830-h-20}" width="${w}" height="${h+40}" fill="#BCC5EE" opacity=".9"/>`;
    for (let j = 0; j < 3; j++) s += `<rect x="${x+20+j*40}" y="${830-h+10}" width="16" height="${h-40}" fill="#D3DAF6" opacity=".9"/>`; }
  let d = 'M-4200,960 '; for (let x = -4200; x <= 3800; x += 100) d += `L${x},${760 + 40*Math.sin(x/430) + 22*Math.sin(x/170 + 1)} `; s += `<path d="${d} L3800,960 Z" fill="url(#hill1)"/>`;
  s += turbine(-1350, 760, 1, t, 60) + turbine(-1000, 770, .8, t, 75) + turbine(1300, 760, .9, t, 55) + turbine(2300, 770, 1.1, t, 50);
  d = 'M-4200,980 '; for (let x = -4200; x <= 3800; x += 100) d += `L${x},${812 + 30*Math.sin(x/360 + 2) + 14*Math.sin(x/130)} `; s += `<path d="${d} L3800,980 Z" fill="url(#hill2)"/>`;
  return s;
}
function flag(x, y, t, col, ph) { let d = `M${x},${y}`; for (let i = 0; i <= 6; i++) d += ` L${x + i*12},${y + Math.sin(t*7 + i*.8 + ph)*5}`; for (let i = 6; i >= 0; i--) d += ` L${x + i*12},${y + 34 + Math.sin(t*7 + i*.8 + ph)*5}`;
  return `<rect x="${x-3}" y="${y-6}" width="5" height="90" fill="#5A6090"/><path d="${d}Z" fill="${col}" stroke="${INK}" stroke-width="3"/>`; }
function midL(t) {
  let s = `<rect x="-4200" y="850" width="8400" height="260" fill="url(#grass2)"/>`;
  for (let i = 0; i < 40; i++) s += `<path d="M${-4000 + i*210},${880 + (i%3)*30} q8,-18 16,0 q8,-14 16,0" fill="none" stroke="#4FA85A" stroke-width="5" stroke-linecap="round"/>`;
  // grandstand (empty seats)
  s += `<g transform="translate(300,955)"><path d="M0,0 L0,-190 L820,-190 L820,0 Z" fill="#E6E1F0" stroke="${INK}" stroke-width="6"/>`;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 20; c++) s += `<rect x="${18 + c*40}" y="${-176 + r*34}" width="30" height="22" rx="5" fill="${['#3D8BFF','#E8463C','#FFC21F'][(r + (c>>2)) % 3]}" stroke="${INK}" stroke-width="3"/>`;
  s += `<path d="M-30,-190 L850,-190 L820,-250 L0,-250 Z" fill="#8C78E0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` + flag(40, -330, t, '#E8463C', 0) + flag(400, -330, t, '#FFC21F', 1.3) + flag(760, -330, t, '#3D8BFF', 2.4) + `</g>`;
  // control booth with blinking light
  const blink = (t*1.6 % 1) < .5;
  s += `<g transform="translate(-900,955)"><rect x="-110" y="-150" width="220" height="150" rx="8" fill="#FFF0C2" stroke="${INK}" stroke-width="6"/><rect x="-80" y="-120" width="160" height="60" rx="8" fill="#BFE6FF" stroke="${INK}" stroke-width="5"/><path d="M-60,-66 L-20,-114" stroke="#fff" stroke-width="8" opacity=".8"/><rect x="-125" y="-170" width="250" height="26" rx="6" fill="#E8836E" stroke="${INK}" stroke-width="5"/><path d="M60,-170 L60,-250" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-256" r="12" fill="${blink?'#FF4A3D':'#7A2A2A'}" stroke="${INK}" stroke-width="4"/>${blink?`<circle cx="60" cy="-256" r="34" fill="#FF4A3D" opacity=".3"/>`:''}<text x="0" y="-26" text-anchor="middle" font-family="Lilita One" font-size="30" fill="${INK}">CONTROL</text></g>`;
  // floodlights
  for (const fx of [-1750, 1500, 2600]) s += `<g transform="translate(${fx},955)"><path d="M-10,0 L-6,-520 L6,-520 L10,0 Z" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-600" width="140" height="80" rx="10" fill="#5A6090" stroke="${INK}" stroke-width="5"/>${[0,1,2].map(i=>`<circle cx="${-44+i*44}" cy="-560" r="17" fill="#FFF6C0" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`;
  // billboard
  s += `<g transform="translate(1900,955)"><rect x="-200" y="-140" width="16" height="140" fill="#8C93B8" stroke="${INK}" stroke-width="4"/><rect x="184" y="-140" width="16" height="140" fill="#8C93B8" stroke="${INK}" stroke-width="4"/><rect x="-300" y="-300" width="600" height="170" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-286" y="-286" width="572" height="40" rx="8" fill="#FFC21F"/><text x="0" y="-180" text-anchor="middle" font-family="Lilita One" font-size="76" fill="#E8463C">CRASH TEST</text></g>`;
  s += `<rect x="-4200" y="955" width="8400" height="8" fill="#8C93B8"/>`; for (let x = -4200; x < 4200; x += 120) s += `<rect x="${x}" y="925" width="8" height="38" fill="#8C93B8"/>`;
  return s;
}
function barrierL() {
  let s = `<rect x="-4000" y="880" width="8000" height="90" fill="#2B2F4A" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -4000; x < 4000; x += 280) s += `<rect x="${x}" y="880" width="140" height="90" fill="#FFC21F" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="-4000" y="872" width="8000" height="16" rx="6" fill="#C9C2DA" stroke="${INK}" stroke-width="5"/>`;
  for (const tx of [-1750, -560, 760, 2000]) for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) s += `<g transform="translate(${tx + c*86 + (r%2)*20},${958 - r*40})"><ellipse rx="44" ry="22" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/><ellipse rx="24" ry="10" fill="#14162A"/></g>`;
  return s;
}
function roadL(t) {
  let s = `<rect x="-4000" y="970" width="8000" height="460" fill="url(#road2)"/><rect x="-4000" y="985" width="8000" height="10" fill="#F2F2F2" opacity=".9"/>`;
  for (let x = -4000; x < 4000; x += 300) s += `<rect x="${x}" y="1255" width="170" height="16" rx="6" fill="#F2F2F2" opacity=".85"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${-3000 + i*900},${1120 + (i%3)*40} q260,-8 520,4" stroke="#2B2F4A" stroke-width="14" fill="none" opacity=".25" stroke-linecap="round"/>`;
  // crash-test target where Dex stands
  s += `<g transform="translate(0,${GY+6})"><ellipse rx="130" ry="28" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><path d="M0,-28 A130,28 0 0 1 130,0 L0,0 Z M0,28 A130,28 0 0 1 -130,0 L0,0 Z" fill="${INK}"/></g>`;
  s += `<rect x="-4000" y="1430" width="8000" height="36" fill="#fff" stroke="${INK}" stroke-width="5"/>`; for (let x = -4000; x < 4000; x += 160) s += `<rect x="${x}" y="1430" width="80" height="36" fill="#E8463C"/>`;
  s += `<rect x="-4000" y="1466" width="8000" height="500" fill="#5DB765"/>`;
  return s;
}

// ------------------------------------------------------------ camera per shot
const CAMS = {
  1: [[0, {x:-200, y:840, z:1.1, r:0}], [2.0, {x:-120, y:850, z:1.25, r:0}, 'lin']],
  2: [[2.0, {x:10, y:865, z:1.55, r:-2}], [4.15, {x:20, y:855, z:1.72, r:-3.5}, 'lin']],
  4: [[6.8, {x:620, y:840, z:1.05, r:0}], [8.7, {x:560, y:850, z:1.13, r:1.5}, 'io']],
  5: [[8.7, {x:-10, y:1052, z:4.4, r:3}], [9.65, {x:-10, y:1056, z:4.8, r:3}, 'lin']],
  6: [[9.65, {x:0, y:GY-238*DS+10, z:3.0, r:-2}], [10.55, {x:0, y:GY-238*DS+10, z:3.75, r:2}, 'in']],
  7: [[10.55, {x:170, y:900, z:1.22, r:-8}], [IMP, {x:190, y:890, z:1.45, r:-9}, 'in']],
  8: [[IMP, {x:130, y:880, z:1.5, r:-10}], [FLY0, {x:120, y:870, z:1.55, r:-10}]],
  10: [[12.55, {x:PILE+40, y:GY-200, z:1.5, r:0}], [14.5, {x:PILE+60, y:GY-210, z:1.68, r:0}, 'lin'], [14.85, {x:PILE+110, y:GY-280, z:1.5, r:-2}, 'io'], [15.5, {x:PILE+180, y:GY-150, z:1.66, r:0}, 'io'], [17.5, {x:PILE+200, y:GY-170, z:1.85, r:0}, 'lin']],
};
function camFlight(t) { // whip pan that chases Dex with a little lag, then settles on the pile
  const f = flight(Math.max(IMP, t - .12)); const k = seg(t, FLY0, LAND);
  return { x: lerp(120, f.x + 90, E.snap(seg(t, FLY0, FLY0 + .35))), y: Math.min(880, lerp(880, f.y - 60, E.snap(seg(t, FLY0, FLY0 + .4)))), z: lerp(1.4, 1.2, E.io(k)), r: lerp(-6, 5, k) };
}
const SHAKES = [[8.98, 10, .35], [9.28, 16, .45], [10.2, 3, .4], [10.55, 4, .32], [IMP, 60, .7], [LAND, 42, .55], [15.06, 10, .3]];

// ------------------------------------------------------------ the scene
function crashFrame(t, R=false) {
  const sh = shot(t);
  let out = R2DEFS;
  if (sh === 3) return out + headOn(t);
  let c = sh === 9 ? camFlight(t) : camAt(CAMS[sh] || CAMS[1], t);
  const q = shakeAt(t, SHAKES); c = { ...c, sx: q.sx, sy: q.sy, r: (c.r||0) + q.sr };
  // whip blur from camera speed (screen px per second)
  let blur = '';
  if (sh === 9) { const c0 = camFlight(t - 1/30); const v = Math.abs(c.x - c0.x)*30*c.z; blur = v > 3600 ? 'mb3' : v > 1800 ? 'mb2' : v > 700 ? 'mb1' : ''; }
  const dof = { 5:'b8', 6:'b14', 2:'b4', 7:'b4', 10:'b4' }[sh] || '';
  const L = (p, svg, f='') => `<g transform="${layerT(c, p)}"${f ? ` filter="url(#${f})"` : ''}>${svg}</g>`;
  out += L(0, skyL(t)) + L(.3, farL(t), blur || (dof ? 'b8' : '')) + L(.55, midL(t), blur || dof);
  out += L(1, barrierL(), blur || (sh === 6 || sh === 5 ? 'b4' : ''));
  // world plane: road, props, car, Dex, boxes
  let w = roadL(t);
  const cx = carX(t), moving = t < IMP + 1.9;
  // skid marks + tyre smoke after impact
  if (t > IMP + .05) { const x0 = 300 - 96*CS, x1 = cx - 96*CS; w += `<rect x="${Math.min(x0, x1)}" y="${GY+12}" width="${Math.abs(x0 - x1)}" height="16" rx="8" fill="#14162A" opacity=".45"/>`; }
  const wr = (4400 - cx)/(32*CS)*57.3;
  const carSvg = carSide2(cx, GY - 30*CS, CS, t, { wr, dent: t > IMP ? 1 : 0, pitch: t > IMP && t < IMP + 1.4 ? -4*Math.sin(seg(t, IMP, IMP + 1.4)*Math.PI) : 0,
    bounce: moving ? Math.sin(t*26)*1.5 : 0, beam: sh >= 6 && sh <= 8 ? .9 : .35, dummyTilt: t > IMP ? 18*Math.sin((t - IMP)*14)*Math.exp(-(t - IMP)*3) : 0 });
  // speed lines behind the car
  let carFx = '';
  if (moving && cx < 4000 && (sh === 4 || sh === 7 || sh === 9)) for (let i = 0; i < 7; i++) { const yy = GY - 40 - i*30*CS, ln = 220 + hash(i + Math.floor(t*30))*360;
    carFx += `<rect x="${cx + 160*CS + 20 + hash(i*3 + Math.floor(t*30))*80}" y="${yy}" width="${ln}" height="8" rx="4" fill="#fff" opacity=".8"/>`; }
  if (t > IMP + .1 && t < IMP + 1.9) carFx += smoke(cx + 96*CS, GY - 10, t, 5, 1.4, '#E6E1F0');
  // boxes (pile), sorted by depth
  const bs = BOXES.map((_, i) => boxState(i, t)).sort((a, b) => a.z - b.z);
  let boxesBack = '', boxesFront = '';
  for (const b of bs) { const svg = box2(b.x, b.y, b.w, b.h, b.r, b.lab); if (t > LAND + .15 && b.z > 20) boxesFront += svg; else boxesBack += svg; }
  // Dex
  const p = dexPos(t);
  const extra = { s: DS, seed: 4 };
  if (sh === 6 && t > 10.05) extra.wind = .7*seg(t, 10.05, 10.4);
  if (sh === 7) extra.wind = .9;
  let o = dexAt(DEXK, t, dexPos, extra);
  let dex = '';
  if (t >= IMP && t < LAND) {  // flight: spin, stretch along velocity, smear ghosts
    const f = flight(t), f0 = flight(t - .03), ang = Math.atan2(f.y - f0.y, f.x - f0.x)*57.3;
    const spin = -760*E.io(seg(t, FLY0, LAND)) - (t < FLY0 ? 0 : 0);
    const st = t < FLY0 ? .72 : 1 + .45*Math.exp(-(t - FLY0)*5);
    const flail = { armF: [o.armF[0] + Math.sin(t*38)*16, o.armF[1]], armB: [o.armB[0] + Math.sin(t*41 + 1)*16, o.armB[1]] };
    const one = (tt, op) => { const ff = flight(tt); const oo = dexAt(DEXK, tt, dexPos, extra); return `<g opacity="${op}" transform="translate(${ff.x},${ff.y - 150*DS}) rotate(${ang}) scale(${st},${1/st}) rotate(${-ang}) translate(${-ff.x},${-(ff.y - 150*DS)})">${chibi2({ ...oo, ...flail, x: ff.x, y: ff.y, rot: spin, air: true, wind: -1.2 })}</g>`; };
    if (t >= FLY0) for (let i = 4; i >= 1; i--) dex += one(t - i*.022, .1 + .06*(4 - i));
    dex += one(t, 1);
    if (t >= FLY0) dex += `<ellipse cx="${f.x}" cy="${GY + 8}" rx="${70 - (GY - f.y)*.06}" ry="12" fill="#0B0E2A" opacity="${.22 - (GY - f.y)*.0003}"/>`;
  } else dex = chibi2(o);
  // Dex's box: behind/in front of Dex depending on the moment
  let dexLayer = dex;
  if (t >= LAND) {
    const wob = t > 14.66 && t < 15.3 ? -9*Math.sin((t - 14.66)*18)*Math.exp(-(t - 14.66)*6) : (t < LAND + .5 ? 4*Math.sin((t - LAND)*30)*Math.exp(-(t - LAND)*6) : 0);
    const inBox = t < 14.8;
    dexLayer = inBox ? openBox(PILE, GY + 10, 'back', wob) + `<clipPath id="boxClip"><rect x="-5000" y="-5000" width="10000" height="${5000 + GY + 4}"/></clipPath><g clip-path="url(#boxClip)">${dex}</g>` + openBox(PILE, GY + 10, 'front', wob) : openBox(PILE, GY + 10, 'back', wob) + openBox(PILE, GY + 10, 'front', wob) + dex;
    if (t > 13.3 && t < 14.42) dexLayer += stars(PILE - 6, GY - 280 - 10*Math.sin(t*3), t, 5, 95);
  }
  // order: car behind Dex before impact; Dex in front of the car while flying
  w += boxesBack + carFx + carSvg + dexLayer + boxesFront;
  if (t < 2.5 || (t > 8.7 && t < 9.65)) { w += dust(-45*DS, GY + 6, t, 8.98, 9, .9) + dust(45*DS, GY + 6, t, 9.28, 11, 1.1); }
  w += dust(PILE, GY - 120, t, LAND, 13, 2.2, '#EBD3A0', 1.1) + dust(PILE + 230, GY + 70, t, 15.06, 9, .9) + dust(-10, GY - 160, t, IMP, 10, 1.6, '#FFFFFF', .7);
  let world = L(1, w);
  // impact frames: ink, red, ink
  if (!R && t >= IMP && t < FLY0) { const f = Math.floor((t - IMP)*30); world = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${world}${focusLines(t, 960, 560, 1, 300, f === 1 ? '#FFF0A0' : INK, 90)}</g>`; }
  out += world;
  // foreground cones (blurred, faster parallax) in wide shots
  if (sh === 1 || sh === 4) out += L(1.3, cone(-1650, 1640, 1.5) + cone(1350, 1660, 1.7), 'b4');
  // screen-space fx
  if (sh === 6) { const k = seg(t, 9.9, 10.55); out += `<ellipse cx="2000" cy="560" rx="${700 + 600*k}" ry="${600 + 400*k}" fill="url(#headL)" opacity="${k}"/>` + (t > 10.2 ? focusLines(t, 900, 470, .55*seg(t, 10.2, 10.35), 470) : ''); }
  if (sh === 7) out += speedLines(t, 24, .75, '#FFFFFF', -1, 80, 1000) + focusLines(t, 860, 520, .35, 520);
  if (sh === 9) out += speedLines(t, 30, .6*(1 - seg(t, 12.1, 12.45)), '#FFFFFF', 1);
  if (!R && (sh === 8 || (t >= FLY0 && t < FLY0 + .12))) out += `<rect width="1920" height="1080" fill="#fff" opacity="${sh === 8 ? 0 : 1 - seg(t, FLY0, FLY0 + .12)}"/>`;
  out += vignette();
  if (R) return out;
  // type
  if (sh <= 2) out += chipAt(t, .8, 960, 140, 'CAN HE STOP A CAR?', '#3D8BFF', 60);
  if (sh === 4) out += chipAt(t, 7.0, 1500, 220, '50 km/h ≈ 14 m/s', '#E8463C', 50);
  if (sh === 9 || (sh === 10 && t < 12.9)) out += bang(t, FLY0, 1180, 330, 'BAM!', '#FFC21F', 170, -12, 11.95) + chipAt(t, 11.25, 1500, 170, 'THE CAR WINS', '#E8463C', 60);
  if (t > 15.3) { const k = seg(t, 15.3, 15.6); out += `<path transform="translate(${960 + 132},${452}) scale(${back(k)*1.4}) rotate(${t*90})" d="M0,-24 L7,-7 L24,-6 L10,5 L15,23 L0,12 L-15,23 L-10,5 L-24,-6 L-7,-7 Z" fill="#FFF6C0" stroke="${INK}" stroke-width="4" opacity="${1 - k*.3}"/>`; }
  return out;
}

// ------------------------------------------------------------ S3: head-on perspective shot
function headOn(t) {
  const VP = 470, F = 610, Fx = 620, P = (X, d, H=0) => [960 + X*Fx/d, VP + (1 - H)*F/d];
  const k = seg(t, 4.15, 6.8);
  let s = `<g transform="translate(960,560) rotate(${lerp(-4, -6.5, k)}) scale(${lerp(1, 1.12, k)}) translate(-960,-560)">`;
  s += `<rect x="-400" y="-400" width="2720" height="1000" fill="url(#sky2)"/><circle cx="420" cy="140" r="520" fill="url(#sunG)"/><circle cx="420" cy="140" r="80" fill="#FFF8DC"/>` + cloud(300 + t*10, 160, 1) + cloud(1400 + t*7, 110, 1.3);
  let d = `M-400,${VP+40} `; for (let x = -400; x <= 2400; x += 60) d += `L${x},${VP - 30 + 18*Math.sin(x/160) + 10*Math.sin(x/60)} `; s += `<path d="${d}L2400,${VP+40} Z" fill="url(#hill1)"/>`;
  s += turbine(1500, VP - 10, .55, t, 60) + turbine(1640, VP - 4, .45, t, 70) + turbine(260, VP - 12, .5, t, 50);
  s += `<rect x="-400" y="${VP}" width="2720" height="800" fill="url(#grass2)"/>`;
  // road
  const [l0x, l0y] = P(-4, 60), [r0x] = P(4, 60), [l1x, l1y] = P(-4, .9), [r1x] = P(4, .9);
  s += `<path d="M${l0x},${l0y} L${r0x},${l0y} L${r1x},${l1y} L${l1x},${l1y} Z" fill="url(#road2)"/>`;
  for (let i = 1; i < 30; i++) { const a = 1 + i*2, b = a + 1; const [x1, y1] = P(-.1, a), [x2] = P(.1, a), [x3, y3] = P(.1, b), [x4] = P(-.1, b); s += `<path d="M${x1},${y1} L${x2},${y1} L${x3},${y3} L${x4},${y3} Z" fill="#F2F2F2" opacity=".85"/>`; }
  for (const X of [-3.7, 3.7]) { const [a1, b1] = P(X - .08, 60), [a2] = P(X + .08, 60), [a3, b3] = P(X + .08, .9), [a4] = P(X - .08, .9); s += `<path d="M${a1},${b1} L${a2},${b1} L${a3},${b3} L${a4},${b3} Z" fill="#F2F2F2"/>`; }
  // barriers (yellow / dark blocks), far to near
  for (let i = 40; i >= 0; i--) { const a = 1 + i*1.2, b = a + 1.2; for (const X of [-4.4, 4.4]) { const [x1, y1] = P(X, a), [x2, y2] = P(X, b), [, t1] = P(X, a, .55), [, t2] = P(X, b, .55);
    s += `<path d="M${x1},${y1} L${x2},${y2} L${x2},${t2} L${x1},${t1} Z" fill="${i%2 ? '#FFC21F' : '#2B2F4A'}" stroke="${INK}" stroke-width="${Math.max(1, 6/a*2)}"/>`; } }
  // gantry over the track
  const gd = 7, [gl] = P(-4.8, gd), [gr] = P(4.8, gd), [, gy0] = P(0, gd), [, gyt] = P(0, gd, 3.1), [, gyb] = P(0, gd, 2.2), sc = Fx/gd/100;
  s += `<rect x="${gl - 8*sc}" y="${gyt}" width="${16*sc}" height="${gy0 - gyt}" fill="#8C93B8" stroke="${INK}" stroke-width="4"/><rect x="${gr - 8*sc}" y="${gyt}" width="${16*sc}" height="${gy0 - gyt}" fill="#8C93B8" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${gl - 20*sc}" y="${gyt - 6*sc}" width="${gr - gl + 40*sc}" height="${gyb - gyt}" rx="${8*sc}" fill="#fff" stroke="${INK}" stroke-width="6"/><text x="960" y="${gyb - (gyb - gyt)*.24}" text-anchor="middle" font-family="Lilita One" font-size="${(gyb - gyt)*.62}" fill="#E8463C">CRASH TEST</text>`;
  // the car: constant speed, so it grows like real perspective
  const dc = lerp(34, 2.5, k), [cx, cy] = P(0, dc), cs = (Fx/dc)/170;
  s += smoke(cx - 120*cs, cy - 10*cs, t, 4, cs*1.2, '#E6E1F0') + smoke(cx + 120*cs, cy - 10*cs, t + .3, 4, cs*1.2, '#E6E1F0');
  s += carFront(cx, cy, cs, t);
  s += `</g>`;
  s += vignette();
  // HUD
  const v = Math.round(50*E.snap(seg(t, 4.4, 5.6)));
  s += `<g transform="translate(0,${(1 - back(seg(t, 4.3, 4.7)))*400})">${gauge(1690, 850, 150, v, 80, `${v} km/h`, '#E8463C')}</g>`;
  s += chipAt(t, 5.2, 960, 150, 'DRIVERLESS', '#3D8BFF', 60);
  if (t > 5.9) { const [dx, dy] = P(0, dc); const hx = dx + 40*cs, hy = dy - 160*cs; const a = pop(t, 5.9, .35);
    s += `<g opacity="${clamp(a)}"><path d="M${hx + 30*cs},${hy - 10*cs} Q${hx + 200},${hy - 160} ${1430},${330}" stroke="${INK}" stroke-width="6" fill="none" stroke-dasharray="14 10"/></g>` + chipAt(t, 5.9, 1500, 320, 'CRASH-TEST DUMMY', '#FFC21F', 44); }
  return s;
}

// ======================================================================== rest of segment p (17.5 s ->)
const RS = { x: 0, y: 700, z: 1 };
const PW = [ST[4] - .2, ST[5] - .2, ST[6] - .2, ST[7] - .2, ST[8] - .2];      // the series' blue wipes
const REPLAY0 = ST[4] + 5.0;                                                     // slow-mo replay starts with "So when they hit"
function bathScale(x, y, kg, s=1) {
  const a = -120 + 240*clamp(kg/100, 0, 1.05);
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-150,0 L150,0 L135,-50 L-135,-50 Z" fill="#F2F2F2" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-135,-50 L135,-50 L125,-60 L-125,-60 Z" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(0,-26)"><rect x="-58" y="-20" width="116" height="40" rx="10" fill="#14162A" stroke="${INK}" stroke-width="4"/><text y="13" text-anchor="middle" font-family="Lilita One" font-size="34" fill="#7ED957">${Math.round(kg)} kg</text></g></g>`;
}
function seesaw(t, tilt) {
  return `<path d="M-90,${GY} L90,${GY} L0,${GY - 300} Z" fill="#8C93B8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><g transform="translate(0,${GY - 300}) rotate(${-tilt})"><rect x="-760" y="-16" width="1520" height="32" rx="14" fill="#B07A4A" stroke="${INK}" stroke-width="8"/>${carSide2(-470, -16 - 30*1.2, 1.2, t, { wr: 0 })}<g transform="translate(560,-16) rotate(${tilt})">${dexP([[0, { ...POSES.worried, armF:[60,-40], armB:[-60,40] }]], t, () => ({ x: 0, y: 0 }), { s: .95, air: true })}</g></g>`;
}
const tiltAt = t => 15*E.o(seg(t, ST[4] + .2, ST[4] + 1.0)) + Math.sin(t*3)*.4;
function pingSet(t) {
  let s = studioBack(t, '#2A3D8F', '#1B2A6B', '#34489E');
  s += `<path d="M180,1080 L560,520 L1360,520 L1740,1080 Z" fill="#1E8F5C" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M960,520 L960,1080 M370,800 L1550,800" stroke="#fff" stroke-width="8"/><path d="M200,1050 L560,532 M1720,1050 L1360,532" stroke="#fff" stroke-width="8"/>`;
  s += `<rect x="470" y="690" width="980" height="70" fill="#fff" opacity=".35" stroke="${INK}" stroke-width="5"/><path d="M470,690 L1450,690" stroke="${INK}" stroke-width="8"/>`;
  return s;
}
function paddle(x, y, rot, col) { return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-22" y="40" width="44" height="160" rx="16" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><ellipse rx="130" ry="140" fill="${col}" stroke="${INK}" stroke-width="9"/><ellipse rx="100" ry="110" fill="#000" opacity=".12"/></g>`; }
function ballAt(t) { const u = (t - ST[5] + .2)*1.1, ph = u % 1, dir = Math.floor(u) % 2 ? -1 : 1;
  const x = dir > 0 ? lerp(420, 1500, ph) : lerp(1500, 420, ph); const y = 660 - 300*4*ph*(1 - ph); return { x, y, ph, dir }; }
function bench2(x, y, broken, t) {
  if (!broken) return `<g transform="translate(${x},${y})"><rect x="-230" y="-140" width="460" height="34" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="-230" y="-80" width="460" height="30" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-50" width="22" height="50" fill="#3A3F66"/><rect x="178" y="-50" width="22" height="50" fill="#3A3F66"/></g>`;
  const k = E.snap(seg(t, broken, broken + .35));
  return `<g transform="translate(${x},${y})"><g transform="rotate(${-26*k},-10,-60) translate(${-30*k},0)"><rect x="-230" y="-80" width="220" height="30" rx="8" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-50" width="22" height="50" fill="#3A3F66"/></g><g transform="rotate(${28*k},10,-60) translate(${30*k},0)"><rect x="10" y="-80" width="220" height="30" rx="8" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="178" y="-50" width="22" height="50" fill="#3A3F66"/></g><g transform="translate(${-60*k},${-90 - 160*Math.sin(k*Math.PI*.9)}) rotate(${-70*k})"><rect x="-120" y="-50" width="240" height="34" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="6"/></g></g>`;
}
const BENCH = 380, HIT = ST[7] + 1.2;
function benchFlight(t) { const k = seg(t, ST[7] - .2, HIT); return { x: lerp(-1500, BENCH, k), y: lerp(GY - 500, GY - 70, k) - 300*4*k*(1 - k), k }; }
const TRACK = (t, L, blur='') => L(0, skyL(t)) + L(.3, farL(t), blur && 'b8') + L(.55, midL(t), blur) + L(1, barrierL(), blur && 'b4') + L(1, roadL(t));
const SHOTS_P2 = [
  // bathroom scale: still 50 kg
  { t: 17.5, ref: RS, cam: push(17.5, PW[0], { x: 0, y: GY - 230, z: 2.2, r: 2 }, { x: 0, y: GY - 260, z: 1.8, r: 0 }, 'io'), draw: (t, c, L) => {
      const on = seg(t, 17.65, 17.95), kg = 50*E.o2(seg(t, 17.95, 18.8)) + Math.sin(t*20)*Math.exp(-(t - 18)*4)*3*(t > 18);
      const K = [[17.5, 'idle'], [17.65, { ...POSES.stompLiftR, eyes:'open', mouth:'smile', browA:0 }], [17.95, { ...POSES.idle, sq:.93 }, 'in'], [18.3, { ...POSES.lookCam, look:[0,10] }, 'o'], [19.0, { ...POSES.shrug, look:[0,8] }, 'o']];
      return L(0, studioBack(t)) + L(1, studioFloor() + bathScale(0, GY + 4, kg) + dexP(K, t, () => ({ x: lerp(-180, 0, E.io(on)), y: GY - 56*E.io(on) })) ) + chipAt(t, 18.1, 960, 150, 'WEIGHT: STILL ≈ 50 kg', '#3D8BFF', 58); } },
  // seesaw: close on Dex, pull back to reveal the car
  { t: PW[0], ref: RS, cam: [[PW[0], { x: 560, y: GY - 560, z: 2.0, r: 0 }], [ST[4] + 1.2, { x: 520, y: GY - 560, z: 1.9, r: 0 }], [ST[4] + 2.0, { x: 0, y: GY - 360, z: .95, r: 0 }, 'io'], [23.6, { x: 0, y: GY - 360, z: 1.0, r: 0 }, 'lin']], draw: (t, c, L) =>
      L(0, studioBack(t)) + L(1, studioFloor() + seesaw(t, tiltAt(t))) + chipAt(t, ST[4] + 1.0, 520, 260, 'CAR ≈ 1,100 kg', '#3D8BFF', 54) + chipAt(t, ST[4] + 1.6, 1420, 230, 'DEX ≈ 50 kg', '#FFC21F', 54) + chipAt(t, ST[4] + 2.4, 960, 120, 'MORE THAN ×20', '#E8463C', 66) + flash(t, ST[4] + .2, '#fff', .1, .3) },
  { t: 23.6, ref: RS, cam: push(23.6, REPLAY0, { x: 560, y: GY - 640, z: 2.3, r: -4 }, { x: 560, y: GY - 640, z: 2.5, r: -5 }, 'lin'), draw: (t, c, L) =>
      L(0, studioBack(t)) + L(1, studioFloor() + seesaw(t, tiltAt(t)), 'b2') + chipAt(t, 23.7, 960, 140, 'MORE THAN ×20', '#E8463C', 66) },
  // ping-pong ball
  { t: PW[1], ref: { x: 960, y: 540, z: 1 }, cam: t => { const b = ballAt(t); return { x: 960 + (b.x - 960)*.35, y: 560, z: 1.12 + .04*Math.sin(t*2), r: (b.x - 960)*-.004 }; }, draw: (t, c, L) => {
      const b = ballAt(t), hitL = b.dir < 0 && b.ph > .9 || b.dir > 0 && b.ph < .1, hitR = b.dir > 0 && b.ph > .9 || b.dir < 0 && b.ph < .1;
      const ball = `<g transform="translate(${b.x},${b.y}) scale(1.45) rotate(${t*720*-b.dir})"><circle r="120" fill="#FFF8E8" stroke="${INK}" stroke-width="8" opacity=".92"/>${chibi2({ ...DEX2, ...mixPose(POSES.crouchPop, POSES.crouchPop, 1), eyes:'happy', mouth:'laugh', x: 0, y: 95, s: .55, t, air: true, noShadow: true })}<path d="M-70,-70 Q-40,-100 0,-104" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
      return L(0, pingSet(t)) + L(1, `<ellipse cx="${b.x}" cy="${700 + (b.y - 600)*.1}" rx="${110 - (600 - b.y)*.1}" ry="20" fill="#0B0E2A" opacity=".25"/>` + paddle(250, 560, hitL ? -30 : -10, '#E8463C') + paddle(1670, 560, hitR ? 30 : 10, '#2B2F4A') + ball) +
        bang(t, ST[5] + .5, 560, 300, 'PING!', '#FFF07A', 100, -10) + bang(t, ST[5] + 1.4, 1380, 300, 'PONG!', '#FFF07A', 100, 10) + chipAt(t, ST[5] + .2, 960, 90, 'AN UNBREAKABLE PING-PONG BALL', '#E8463C', 54); } },
  // the dent: push along the stopped car
  { t: PW[2], ref: REF, cam: push(PW[2], 36.3, { x: -300, y: GY - 150, z: 1.6, r: 0 }, { x: -620, y: GY - 120, z: 2.6, r: -3 }, 'io'), draw: (t, c, L) => dentShot(t, L) + chipAt(t, ST[6] + .6, 1400, 180, 'DEX-SHAPED DENT', '#E8463C', 60) },
  { t: 36.3, ref: REF, cam: push(36.3, PW[3], { x: -820, y: GY - 230, z: 1.7, r: 0 }, { x: -820, y: GY - 230, z: 1.85, r: 0 }, 'lin'), draw: (t, c, L) => dentShot(t, L, true) + chipAt(t, 36.3, 1400, 180, 'DEX-SHAPED DENT', '#E8463C', 60) },
  // the bench
  { t: PW[3], ref: RS, cam: t => { const f = benchFlight(t - .1); return { x: Math.min(BENCH + 60, f.x + 200), y: Math.min(GY - 260, f.y - 80), z: 1.3, r: -4 }; }, draw: (t, c, L) => benchShot(t, L) },
  { t: HIT + .15, ref: RS, cam: push(HIT + .15, 41.3, { x: BENCH, y: GY - 200, z: 2.1, r: 3 }, { x: BENCH, y: GY - 210, z: 2.3, r: 2 }, 'lin'), draw: (t, c, L) => benchShot(t, L, 'b4') + chipAt(t, HIT + .6, 520, 260, 'DEX: FINE ✓', '#7ED957', 58) },
  { t: 41.3, ref: RS, cam: push(41.3, PW[4], { x: BENCH + 120, y: GY - 260, z: 1.55, r: 0 }, { x: BENCH + 120, y: GY - 260, z: 1.7, r: 0 }, 'lin'), draw: (t, c, L) =>
      benchShot(t, L, 'b2') + chipAt(t, 41.4, 520, 230, 'DEX: FINE ✓', '#7ED957', 52) + chipAt(t, 41.6, 1400, 230, 'THE BENCH: ✗', '#E8463C', 52) + chipAt(t, ST[7] + DU[7] - 1.6, 960, 120, 'WHATEVER HE LANDS ON ISN’T', '#3D8BFF', 54) },
  // rule 2
  { t: PW[4], ref: REF, cam: push(PW[4], END, { x: 300, y: GY - 300, z: 1.45, r: 0 }, { x: 300, y: GY - 300, z: 1.55, r: 0 }, 'lin'), draw: (t, c, L) =>
      TRACK(t, L, 'b4') + L(1, dexP([[0, 'smile'], [ST[8] + .3, 'peace', 'o']], t, () => ({ x: -60, y: GY }))) + note(t, ST[8], 1340, 430, 'RULE 2', 'NOT', 'IMMOVABLE.') },
];
function dentShot(t, L, withDex=false) {
  const cx = -420, cy = GY - 30*CS;
  const body = `M-150,-20 Q-150,-70 -110,-74 L-70,-76 Q-40,-130 20,-130 L60,-130 Q100,-128 120,-80 L140,-76 Q160,-70 160,-30 L160,-12 Q160,0 148,0 L-140,0 Q-150,0 -150,-12 Z`;
  const dentDex = `<clipPath id="carBody"><path d="${body}" transform="translate(${cx},${cy}) scale(${-CS},${CS})"/></clipPath><g clip-path="url(#carBody)"><g transform="translate(${cx - 95*CS},${cy + 4*CS}) scale(.5)" filter="url(#dentF)">${chibi2({ ...DEX2, ...mixPose(POSES.impact, POSES.impact, 1), x: 0, y: 0, s: 1, t: 0, air: true, noShadow: true })}</g></g>`;
  const K = [[0, { ...POSES.think, look:[8,0] }], [37.2, { ...POSES.point, armF:[80,-30], eyes:'happy', mouth:'grin' }, 'o']];
  return `<defs><filter id="dentF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.10  0 0 0 0 0.24  0 0 0 0 0.62  0 0 0 0.8 0"/></filter></defs>` + TRACK(t, L, 'b4') +
    L(1, carSide2(cx, cy, CS, t, { wr: 0, dent: 1, dummyTilt: 20*Math.sin(t*1.3) }) + dentDex + (withDex ? dexP(K, t, () => ({ x: -1180, y: GY + 30 })) : ''));
}
function benchShot(t, L, blur='') {
  const f = benchFlight(t), landed = t >= HIT;
  let pig = ''; for (let i = 0; i < 3; i++) { const k = seg(t, HIT, HIT + 1.2); pig += pigeon(BENCH + 260 + i*90 + k*600*(i%2 ? 1 : .7), GY - 40 - k*(500 + i*120), 1.1, t + i, k > 0 ? 'fly' : 'peck'); }
  const K = [[0, 'flailA'], [ST[7] + .5, 'flailB'], [HIT - .15, 'dive'], [HIT, { ...POSES.sunk, eyes:'squeeze', mouth:'grit' }, 'snap'], [HIT + .5, { ...POSES.smile, legL:[-60,80], legR:[60,-80] }, 'o'], [HIT + 1.6, { ...POSES.peace, legL:[-60,80], legR:[60,-80] }, 'o'], [42.6, { ...POSES.shrug, legL:[-60,80], legR:[60,-80], mouth:'flat' }, 'o']];
  const o = dexAt(K, t, () => landed ? { x: BENCH, y: GY + 10 } : { x: f.x, y: f.y }, { s: DS, seed: 7, air: !landed, rot: landed ? 0 : -480*f.k });
  return L(0, skyW(t)) + L(.5, cityFar(t, 830), blur && 'b8') + L(1, streetMid(t), blur) + L(1, streetGround() + bench2(BENCH, GY - 40, landed ? HIT : 0, t) + pig + chibi2(o) + dust(BENCH, GY - 20, t, HIT, 10, 1.4) + '') +
    bang(t, HIT, 1350, 330, 'CRUNCH!', '#FFC21F', 120, 8, HIT + 1.2) + (t > HIT && t < HIT + .1 ? `<rect width="1920" height="1080" fill="#fff" opacity=".6"/>` : '');
}
function scene(t) {
  if (t < 17.5) { let s = crashFrame(t); s += chipAt(t, ST[3] + .4, 1450, 170, 'DAMAGE: 0', '#7ED957', 60); return s + wipe(t, PW[0]); }
  let s;
  if (t >= REPLAY0 && t < PW[1]) {
    const tr = 10.5 + (t - REPLAY0)*.27, k = seg(tr, IMP, IMP + .25);
    s = crashFrame(tr, true) + `<g transform="translate(60,60)"><rect width="430" height="80" rx="20" fill="#14162A" opacity=".8"/><circle cx="44" cy="40" r="14" fill="#E8463C" opacity="${(t*2 % 1) < .6 ? 1 : .2}"/><text x="74" y="56" font-family="Lilita One" font-size="44" fill="#fff">SLOW-MO ×0.27</text></g>`;
    const bar = (y, w, col, label) => `<g transform="translate(330,${y})"><rect x="0" y="-36" width="1260" height="52" rx="14" fill="#14162A" opacity=".55"/><rect x="0" y="-36" width="${1260*w}" height="52" rx="14" fill="${col}" stroke="${INK}" stroke-width="5"/><text x="0" y="-52" font-family="Lilita One" font-size="40" fill="#fff" stroke="${INK}" stroke-width="8" paint-order="stroke">${label}</text></g>`;
    s += bar(890, 1 - .05*k, '#3D8BFF', 'CAR: BARELY SLOWS') + bar(1010, .98*E.snap(k), '#FFC21F', 'DEX: LAUNCHED ≈ CAR SPEED');
    s += chipAt(t, REPLAY0 + .2, 1480, 200, 'MORE THAN ×20', '#E8463C', 50);
  } else s = playShots(t, SHOTS_P2, [[17.95, 6, .3], [ST[4] + .4, 12, .5], [HIT, 30, .5]]) + vignette();
  PW.forEach(w => s += wipe(t, w));
  return s;
}
