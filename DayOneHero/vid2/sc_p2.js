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
const GY = 1080, DS = 1.05, CS = 1.55, PILE = -1150;
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
  [14.58,'crouchPop','io',.3], [14.68,'popJump','snap',.1], [14.98,'popJump'], [15.06,'landSquash','in',.1], [15.32,'peace','o2',.2],
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
  if (t < 8.7) return lerp(3900, 1500, seg(t, 6.8, 8.7));
  if (t < 10.55) return 1500;                                 // (off-screen cutaways)
  if (t < IMP) return lerp(1350, 300, E.in(seg(t, 10.55, IMP)) * .55 + seg(t, 10.55, IMP) * .45);
  return lerp(300, -420, E.snap(seg(t, IMP, IMP + 1.9)));
};
function carSide2(x, y, s, t, o={}) {
  const wr = o.wr || 0, dent = o.dent || 0;
  let g = `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="30" rx="176" ry="15" fill="#0B0E2A" opacity=".25"/>`;
  if (o.beam) g += `<path d="M-158,-46 L-760,-150 L-760,70 Z" fill="url(#beam)" opacity="${o.beam}"/>`;
  g += `<g transform="translate(0,${o.bounce||0}) rotate(${o.pitch||0},-60,20) scale(-1,1)">`;
  const body = `M-150,-20 Q-150,-70 -110,-74 L-70,-76 Q-40,-130 20,-130 L60,-130 Q100,-128 120,-80 L140,-76 Q160,-70 160,-30 L160,-12 Q160,0 148,0 L-140,0 Q-150,0 -150,-12 Z`;
  g += `<path d="${body}" fill="${o.col||'#3D8BFF'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="${body}" fill="url(#carSheen)"/>`;
  g += `<path d="M-150,-34 L160,-34" stroke="#0B0E2A" stroke-width="4" opacity=".18"/><path d="M-20,-74 L-20,-6 M62,-76 L62,-6" stroke="${INK}" stroke-width="3" opacity=".35"/>`;
  g += `<path d="M-56,-80 Q-34,-118 10,-118 L10,-80 Z M26,-80 L26,-118 L56,-118 Q88,-116 104,-80 Z" fill="#CFEFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<g transform="translate(60,-100) rotate(${(o.dummyTilt||0)})"><circle r="17" fill="#FFD23F" stroke="${INK}" stroke-width="4"/><path d="M0,-17 A17,17 0 0 1 17,0 L0,0 Z M0,17 A17,17 0 0 1 -17,0 L0,0 Z" fill="${INK}"/></g>`;
  g += `<path d="M-36,-84 L-16,-112 M36,-84 L50,-112" stroke="#fff" stroke-width="7" opacity=".85"/>`;
  g += `<rect x="140" y="-58" width="22" height="16" rx="5" fill="#FFF1B0" stroke="${INK}" stroke-width="4"/><rect x="-154" y="-60" width="12" height="14" rx="4" fill="#FF6B5E" stroke="${INK}" stroke-width="4"/>`;
  if (dent > 0) g += `<path d="M161,-70 Q${161-34*dent},-46 ${161-10*dent},-30 Q${161-30*dent},-18 161,-6" fill="#2A63C9" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${150-20*dent},-50 l-14,-6 M${150-18*dent},-26 l-14,4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  for (const wx of [-92, 96]) g += `<g transform="translate(${wx},-2) rotate(${wr})"><circle r="32" fill="#2B2F4A" stroke="${INK}" stroke-width="6"/><circle r="20" fill="#3B4060"/><path d="M-17,0 L17,0 M0,-17 L0,17" stroke="#9AA2C8" stroke-width="6" stroke-linecap="round"/><circle r="9" fill="#C9C2DA" stroke="${INK}" stroke-width="4"/></g>`;
  g += `</g></g>`;
  return g;
}
function carFront(x, y, s, t) {
  const b = Math.sin(t*22)*1.5;
  let g = `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="4" rx="210" ry="22" fill="#0B0E2A" opacity=".3"/>`;
  g += `<rect x="-172" y="-58" width="54" height="60" rx="14" fill="#2B2F4A" stroke="${INK}" stroke-width="7"/><rect x="118" y="-58" width="54" height="60" rx="14" fill="#2B2F4A" stroke="${INK}" stroke-width="7"/>`;
  g += `<g transform="translate(0,${b})">`;
  g += `<path d="M-118,-128 L-88,-208 Q0,-222 88,-208 L118,-128 Z" fill="#3D8BFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  g += `<path d="M-100,-134 L-76,-196 Q0,-206 76,-196 L100,-134 Z" fill="#CFEFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-62,-140 L-38,-192 M-30,-140 L-14,-180" stroke="#fff" stroke-width="9" opacity=".8"/>`;
  g += `<g transform="translate(40,-160)"><circle r="24" fill="#FFD23F" stroke="${INK}" stroke-width="5"/><path d="M0,-24 A24,24 0 0 1 24,0 L0,0 Z M0,24 A24,24 0 0 1 -24,0 L0,0 Z" fill="${INK}"/></g><path d="M10,-136 Q40,-150 70,-136" stroke="${INK}" stroke-width="7" fill="none"/>`;
  g += `<path d="M-176,-40 Q-180,-122 -150,-130 L150,-130 Q180,-122 176,-40 Q176,-20 156,-20 L-156,-20 Q-176,-20 -176,-40 Z" fill="#3D8BFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  g += `<path d="M-160,-118 L160,-118" stroke="#fff" stroke-width="8" opacity=".35"/>`;
  for (const sx of [-1,1]) g += `<ellipse cx="${118*sx}" cy="-88" rx="34" ry="20" fill="#FFF6C0" stroke="${INK}" stroke-width="5"/><ellipse cx="${118*sx}" cy="-88" rx="70" ry="44" fill="url(#headL)"/><rect x="${sx>0?172:-196}" y="-150" width="24" height="18" rx="6" fill="#3D8BFF" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="-62" y="-100" width="124" height="32" rx="10" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/><path d="M-50,-84 L50,-84" stroke="#5A6090" stroke-width="5"/>`;
  g += `<rect x="-58" y="-58" width="116" height="30" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><text x="0" y="-35" text-anchor="middle" font-family="Lilita One" font-size="24" fill="${INK}">CR45 HTS</text>`;
  return g + `</g></g>`;
}

// ------------------------------------------------------------ boxes
function box2(x, y, w, h, rot=0, label='') {
  return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="4" fill="#D9A866" stroke="${INK}" stroke-width="6"/><rect x="${w/2-w*.22}" y="${-h+3}" width="${w*.22-3}" height="${h-6}" fill="#B07A45" opacity=".35"/><rect x="-12" y="${-h}" width="24" height="${h*.42}" fill="#EBD3A0" stroke="${INK}" stroke-width="3"/><path d="M${-w/2},${-h*.72} L${w/2},${-h*.72}" stroke="${INK}" stroke-width="3.5" opacity=".6"/>${label?`<text x="0" y="${-h*.3}" text-anchor="middle" font-family="Lilita One" font-size="${w*.17}" fill="#C8352C">${label}</text>`:''}</g>`;
}
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
function turbine(x, y, s, t, sp) { let g = `<g transform="translate(${x},${y}) scale(${s})"><path d="M-5,0 L-2,-170 L2,-170 L5,0 Z" fill="#EEF2FF" stroke="#8C93B8" stroke-width="3"/><g transform="translate(0,-170) rotate(${t*sp})">`;
  for (let i = 0; i < 3; i++) g += `<path d="M0,0 L-5,-8 Q0,-92 4,-96 L6,-8 Z" fill="#F6F8FF" stroke="#8C93B8" stroke-width="3" transform="rotate(${i*120})"/>`; return g + `<circle r="7" fill="#C9D0EE" stroke="#8C93B8" stroke-width="3"/></g></g>`; }
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
function cone(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70,0 L70,0 L70,-18 L-70,-18 Z" fill="#E8611E" stroke="${INK}" stroke-width="6"/><path d="M-50,-18 L-14,-200 L14,-200 L50,-18 Z" fill="#FF7A2E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-40,-70 L40,-70 L32,-110 L-32,-110 Z" fill="#fff"/></g>`; }

// ------------------------------------------------------------ camera per shot
const CAMS = {
  1: [[0, {x:-260, y:790, z:.74, r:0}], [2.0, {x:-140, y:810, z:.86, r:0}, 'lin']],
  2: [[2.0, {x:10, y:865, z:1.55, r:-2}], [4.15, {x:20, y:855, z:1.72, r:-3.5}, 'lin']],
  4: [[6.8, {x:640, y:800, z:.7, r:0}], [8.7, {x:520, y:815, z:.78, r:1.5}, 'io']],
  5: [[8.7, {x:-10, y:1052, z:4.4, r:3}], [9.65, {x:-10, y:1056, z:4.8, r:3}, 'lin']],
  6: [[9.65, {x:0, y:GY-238*DS+10, z:3.0, r:-2}], [10.55, {x:0, y:GY-238*DS+10, z:3.75, r:2}, 'in']],
  7: [[10.55, {x:170, y:900, z:1.22, r:-8}], [IMP, {x:190, y:890, z:1.45, r:-9}, 'in']],
  8: [[IMP, {x:130, y:880, z:1.5, r:-10}], [FLY0, {x:120, y:870, z:1.55, r:-10}]],
  10: [[12.55, {x:PILE+40, y:GY-200, z:1.5, r:0}], [14.5, {x:PILE+60, y:GY-210, z:1.68, r:0}, 'lin'], [14.85, {x:PILE+110, y:GY-280, z:1.5, r:-2}, 'io'], [15.5, {x:PILE+180, y:GY-150, z:1.66, r:0}, 'io'], [16.0, {x:PILE+185, y:GY-150, z:1.7, r:0}, 'lin']],
};
function camFlight(t) { // whip pan that chases Dex with a little lag, then settles on the pile
  const f = flight(Math.max(IMP, t - .12)); const k = seg(t, FLY0, LAND);
  return { x: lerp(120, f.x + 90, E.snap(seg(t, FLY0, FLY0 + .35))), y: Math.min(880, lerp(880, f.y - 60, E.snap(seg(t, FLY0, FLY0 + .4)))), z: lerp(1.1, .86, E.io(k)), r: lerp(-6, 5, k) };
}
const SHAKES = [[8.98, 10, .35], [9.28, 16, .45], [10.2, 3, .4], [10.55, 4, .32], [IMP, 60, .7], [LAND, 42, .55], [15.06, 10, .3]];

// ------------------------------------------------------------ the scene
function scene(t) {
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
  if (t >= IMP && t < FLY0) { const f = Math.floor((t - IMP)*30); world = `<g filter="url(#${f === 1 ? 'impRed' : 'impInk'})">${world}${focusLines(t, 960, 560, 1, 300, f === 1 ? '#FFF0A0' : INK, 90)}</g>`; }
  out += world;
  // foreground cones (blurred, faster parallax) in wide shots
  if (sh === 1 || sh === 4) out += L(1.3, cone(-1650, 1640, 1.5) + cone(1350, 1660, 1.7), 'b4');
  // screen-space fx
  if (sh === 6) { const k = seg(t, 9.9, 10.55); out += `<ellipse cx="2000" cy="560" rx="${700 + 600*k}" ry="${600 + 400*k}" fill="url(#headL)" opacity="${k}"/>` + (t > 10.2 ? focusLines(t, 900, 470, .55*seg(t, 10.2, 10.35), 470) : ''); }
  if (sh === 7) out += speedLines(t, 24, .75, '#FFFFFF', -1, 80, 1000) + focusLines(t, 860, 520, .35, 520);
  if (sh === 9) out += speedLines(t, 30, .6*(1 - seg(t, 12.1, 12.45)), '#FFFFFF', 1);
  if (sh === 8 || (t >= FLY0 && t < FLY0 + .12)) out += `<rect width="1920" height="1080" fill="#fff" opacity="${sh === 8 ? 0 : 1 - seg(t, FLY0, FLY0 + .12)}"/>`;
  out += vignette();
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
