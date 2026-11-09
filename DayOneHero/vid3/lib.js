const FREEZE=0;

const INK='#1A1D3A';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const easeOut=t=>1-Math.pow(1-t,3);
const back=t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const rad=d=>d*Math.PI/180;
function pt(x,y,a,l){return [x+Math.sin(rad(a))*l, y+Math.cos(rad(a))*l];}

const DEFS=`<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DB6FF"/><stop offset="1" stop-color="#C9E9FF"/></linearGradient>
<radialGradient id="skin" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFF4EA"/><stop offset=".6" stop-color="#FFE2CC"/><stop offset="1" stop-color="#F5C9AE"/></radialGradient>
<radialGradient id="hoodG" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#FFE27A"/><stop offset=".55" stop-color="#FFC21F"/><stop offset="1" stop-color="#E89A0C"/></radialGradient>
<linearGradient id="eyeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141838"/><stop offset=".6" stop-color="#26306E"/><stop offset="1" stop-color="#4E6BD8"/></linearGradient>
<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B6F86"/><stop offset="1" stop-color="#4F5268"/></linearGradient>
<filter id="freeze" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.30 0.45 0.10 0 0.02  0.32 0.47 0.11 0 0.06  0.36 0.52 0.14 0 0.16  0 0 0 1 0"/></filter>
<filter id="chill" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.80 0.10 0.05 0 0  0.08 0.82 0.10 0 0.02  0.08 0.12 0.86 0 0.08  0 0 0 1 0"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="shadowF" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dx="6" dy="10"/><feComponentTransfer><feFuncA type="linear" slope="0.45"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`;

// ---------- character ----------
function limb(x,y,a1,l1,a2,l2,w,fill){
  const [ex,ey]=pt(x,y,a1,l1); const [hx,hy]=pt(ex,ey,a1+a2,l2);
  const d=`M${x},${y} L${ex},${ey} L${hx},${hy}`;
  return {svg:`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w+7}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,end:[hx,hy],ang:a1+a2};
}
function hand(x,y,ang,skin,kind){
  if(kind==='peace'){
    return `<g transform="translate(${x},${y}) rotate(${-ang+180})">
    <rect x="-13" y="-46" width="11" height="34" rx="5.5" fill="${skin}" stroke="${INK}" stroke-width="4" transform="rotate(-12,-7,-12)"/>
    <rect x="2" y="-48" width="11" height="36" rx="5.5" fill="${skin}" stroke="${INK}" stroke-width="4" transform="rotate(10,8,-12)"/>
    <circle cx="0" cy="0" r="15" fill="${skin}" stroke="${INK}" stroke-width="4"/></g>`;
  }
  if(kind==='point'){
    return `<g transform="translate(${x},${y}) rotate(${-ang+180})"><rect x="-5" y="-40" width="11" height="32" rx="5.5" fill="${skin}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="0" r="14" fill="${skin}" stroke="${INK}" stroke-width="4"/></g>`;
  }
  return `<circle cx="${x}" cy="${y}" r="13" fill="${skin}" stroke="${INK}" stroke-width="4"/>`;
}
function hairBack(st,col){
  if(st==='long') return `<path d="M-84,-10 C-92,-90 -40,-118 0,-116 C40,-118 92,-90 84,-10 L92,110 C70,128 40,120 30,96 L-30,96 C-40,120 -70,128 -92,110 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
  if(st==='bun') return `<circle cx="0" cy="-96" r="30" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
  if(st==='curly'){let s='';for(let i=0;i<11;i++){const a=rad(-100+i*20);s+=`<circle cx="${Math.sin(a)*78}" cy="${-Math.cos(a)*78-6}" r="24" fill="${col}" stroke="${INK}" stroke-width="5"/>`;}return s;}
  return '';
}
function hairFront(st,col){
  if(st==='dex') return `<path d="M-76,-18 C-80,-70 -44,-100 0,-100 C46,-100 80,-70 76,-16 C64,-34 56,-40 50,-30 C46,-50 34,-58 26,-52 C22,-30 8,-40 2,-56 C-6,-36 -22,-34 -28,-50 C-36,-34 -48,-40 -52,-50 C-58,-34 -66,-30 -76,-18 Z" fill="#1B1B2B" stroke="${INK}" stroke-width="4"/><path d="M-30,-86 Q0,-98 32,-88" fill="none" stroke="#4A4F7A" stroke-width="7" stroke-linecap="round"/>`;
  if(st==='cap') return `<path d="M-80,-24 C-80,-92 80,-92 80,-24 Z" fill="#E8463C" stroke="${INK}" stroke-width="5"/><path d="M-10,-30 L100,-24 Q104,-14 94,-12 L-10,-18 Z" fill="#C8352C" stroke="${INK}" stroke-width="5"/>`;
  if(st==='curly') return `<path d="M-72,-22 C-70,-80 70,-80 72,-22 C56,-40 40,-30 30,-44 C20,-30 0,-34 -6,-46 C-16,-30 -40,-36 -46,-44 C-54,-30 -64,-30 -72,-22 Z" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
  return `<path d="M-78,-14 C-82,-76 -40,-100 0,-100 C42,-100 82,-76 78,-14 C64,-42 30,-54 10,-46 C-10,-38 -50,-46 -78,-14 Z" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
}
function face(o){
  let s='';
  const lx=o.look?o.look[0]:0, ly=o.look?o.look[1]:0;
  const ey=6;
  if(o.eyes!=='closed'&&(o.squint||0)>0.85&&o.eyes!=='happy'&&o.eyes!=='dot') o.eyes='closed';
  if(o.eyes==='closed'){
    s+=`<path d="M-44,${ey} Q-30,${ey+10} -16,${ey}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M16,${ey} Q30,${ey+10} 44,${ey}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  } else if(o.eyes==='happy'){
    s+=`<path d="M-44,${ey+6} Q-30,${ey-12} -16,${ey+6}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M16,${ey+6} Q30,${ey-12} 44,${ey+6}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  } else if(o.eyes==='dot'){
    s+=`<ellipse cx="${-28+lx}" cy="${ey+ly}" rx="7" ry="9" fill="${INK}"/><ellipse cx="${28+lx}" cy="${ey+ly}" rx="7" ry="9" fill="${INK}"/>`;
  } else {
    const wide=o.eyes==='wide'; const rx=wide?17:15, ry=wide?22:20; const sq=o.squint||0;
    for(const sx of [-1,1]){
      const cx=30*sx+lx, cy=ey+ly;
      s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry*(1-sq)}" fill="url(#eyeG)"/>`;
      s+=`<ellipse cx="${cx-5}" cy="${cy-8*(1-sq)}" rx="6" ry="${7*(1-sq)}" fill="#fff"/><circle cx="${cx+6}" cy="${cy+8*(1-sq)}" r="3" fill="#fff" opacity="${1-sq}"/>`;
      if(o.sparkle) s+=`<path d="M${cx+4},${cy-4} l3,-8 l3,8 l8,3 l-8,3 l-3,8 l-3,-8 l-8,-3 Z" fill="#fff"/>`;
    }
  }
  const br=o.brow||0;
  s+=`<path d="M-44,${-26-br} Q-30,${-34-br} -16,${-28-br}" fill="none" stroke="#1B1B2B" stroke-width="6" stroke-linecap="round"/><path d="M16,${-28-br} Q30,${-34-br} 44,${-26-br}" fill="none" stroke="#1B1B2B" stroke-width="6" stroke-linecap="round"/>`;
  if(o.blush!==false) s+=`<ellipse cx="-50" cy="30" rx="14" ry="8" fill="#FF8C9A" opacity=".7"/><ellipse cx="50" cy="30" rx="14" ry="8" fill="#FF8C9A" opacity=".7"/>`;
  const m=o.mouth||'smile';
  if(m==='grin') s+=`<path d="M-22,36 Q0,36 22,36 Q20,66 0,66 Q-20,66 -22,36 Z" fill="#7A1F33" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-19,38 L19,38 L18,45 L-18,45 Z" fill="#fff"/><path d="M-11,58 Q0,50 11,58 Q0,65 -11,58 Z" fill="#FF7E7E"/>`;
  else if(m==='o') s+=`<ellipse cx="0" cy="46" rx="8" ry="10" fill="#7A1F33" stroke="${INK}" stroke-width="4"/>`;
  else if(m==='yawn') s+=`<ellipse cx="0" cy="48" rx="15" ry="20" fill="#7A1F33" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="58" rx="9" ry="6" fill="#FF7E7E"/>`;
  else if(m==='laugh') s+=`<path d="M-16,38 Q0,38 16,38 Q14,58 0,58 Q-14,58 -16,38 Z" fill="#7A1F33" stroke="${INK}" stroke-width="4"/>`;
  else if(m==='flat') s+=`<path d="M-9,44 L9,44" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  else s+=`<path d="M-12,40 Q0,50 12,40" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  s+=`<circle cx="0" cy="24" r="2.5" fill="#E0A08A"/>`;
  return s;
}
function chibi(o){
  const s=o.s||1, x=o.x, y=o.y;
  const skin='url(#skin)', top=o.top||'#FFC21F', pants=o.pants||'#25263A';
  const bob=o.bob||0, lean=o.lean||0;
  let g=`<g transform="translate(${x},${y}) scale(${o.flip?-s:s},${s})">`;
  g+=`<ellipse cx="0" cy="6" rx="58" ry="11" fill="#000" opacity=".16"/>`;
  const sq=o.sq||1; g+=`<g transform="scale(${1/Math.sqrt(sq)},${sq})"><g transform="translate(0,${bob}) rotate(${lean},0,-60)">`;
  // legs
  const L=o.legL||[4,0], R=o.legR||[-4,0];
  for(const [hx,lg] of [[-15,L],[15,R]]){
    const l=limb(hx,-72,lg[0],38,lg[1],34,22,pants); g+=l.svg;
    if(o.stripe) g+=`<path d="M${hx+6},-66 L${l.end[0]+6},${l.end[1]-6}" stroke="#fff" stroke-width="4" opacity=".9"/>`;
    g+=`<path d="M${l.end[0]-16},${l.end[1]+6} Q${l.end[0]-16},${l.end[1]-12} ${l.end[0]+2},${l.end[1]-12} Q${l.end[0]+22},${l.end[1]-10} ${l.end[0]+24},${l.end[1]+6} Z" fill="${o.shoe||'#FFFFFF'}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  // back arm
  const aB=o.armB||[20,-10];
  const AL=o.armLen||1; const la=limb(-42,-150,aB[0],40,aB[1],36,22,top); g+=la.svg; g+=hand(la.end[0],la.end[1],la.ang,skin,o.handB);
  // torso
  g+=`<path d="M-48,-168 Q0,-180 48,-168 Q58,-110 54,-64 Q0,-54 -54,-64 Q-58,-110 -48,-168 Z" fill="${top}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  g+=`<path d="M-50,-160 Q-56,-110 -52,-66 Q-40,-62 -30,-61 Q-36,-110 -32,-164 Z" fill="#000" opacity=".12"/>`;
  if(o.type==='hoodie') g+=`<path d="M-28,-96 L28,-96 L34,-66 L-34,-66 Z" fill="none" stroke="${INK}" stroke-width="3.5" opacity=".55"/>`;
  if(o.type==='hoodie'&&o.strings!==false) for(const sx of [-1,1]){const sw=(o.sway||0); const d=`M${12*sx},-162 Q${14*sx+sw*8},-140 ${12*sx+(o.wind||0)*-20+sw*18},${-118-Math.abs(sw)*6}`; g+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>`;}
  if(o.type==='sweater') g+=`<path d="M-40,-80 L40,-80" stroke="#000" stroke-width="3" opacity=".2"/><path d="M-26,-168 Q0,-150 26,-168" fill="none" stroke="#000" stroke-width="5" opacity=".2"/>`;
  if(o.item==='phoneHold') {}
  // head
  const ht=o.tilt||0;
  g+=`<g transform="translate(0,-238) rotate(${ht})">`;
  if(o.hood) g+=`<path d="M-96,10 C-104,-80 -50,-122 0,-122 C${50-(o.wind||0)*30},-122 ${104-(o.wind||0)*40},-80 ${96-(o.wind||0)*30},10 C90,70 50,92 0,92 C-50,92 -90,70 -96,10 Z" fill="url(#hoodG)" stroke="${INK}" stroke-width="6"/><path d="M-70,-82 Q-30,-112 20,-108" fill="none" stroke="#FFF1B0" stroke-width="9" stroke-linecap="round" opacity=".85"/>`;
  g+=hairBack(o.hair,o.hairCol||'#5A3A2A');
  g+=`<ellipse cx="0" cy="0" rx="80" ry="78" fill="${skin}" stroke="${INK}" stroke-width="5.5"/>`;
  g+=hairFront(o.hair,o.hairCol||'#5A3A2A');
  if(o.hood) g+=`<path d="M-82,8 C-86,-70 -40,-104 0,-104 C40,-104 86,-70 82,8" fill="none" stroke="#FFC21F" stroke-width="13"/><path d="M-82,8 C-86,-70 -40,-104 0,-104 C40,-104 86,-70 82,8" fill="none" stroke="${INK}" stroke-width="3" transform="translate(0,-7) scale(1.08)"/>`;
  g+=face(o);
  if(o.acc==='glasses') g+=`<circle cx="-30" cy="6" r="24" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="6" r="24" fill="none" stroke="${INK}" stroke-width="5"/><path d="M-6,4 L6,4" stroke="${INK}" stroke-width="5"/>`;
  if(o.acc==='headphones') g+=`<path d="M-84,0 C-90,-110 90,-110 84,0" fill="none" stroke="#2B2F4A" stroke-width="10"/><rect x="-98" y="-14" width="22" height="40" rx="10" fill="#E8463C" stroke="${INK}" stroke-width="4"/><rect x="76" y="-14" width="22" height="40" rx="10" fill="#E8463C" stroke="${INK}" stroke-width="4"/>`;
  if(o.sweat) g+=`<path d="M70,-40 C78,-24 80,-12 72,-6 C62,0 54,-10 60,-24 Z" fill="#BFE6FF" stroke="${INK}" stroke-width="4"/>`;
  g+=`</g>`;
  // front arm
  const aF=o.armF||[-20,10];
  const ra=limb(42,-150,aF[0],40*AL,aF[1],36*AL,22,top); g+=ra.svg;
  if(o.item==='coffee'){g+=`<g transform="translate(${ra.end[0]},${ra.end[1]}) rotate(${o.cupRot||0})"><path d="M-14,-30 L14,-30 L11,14 L-11,14 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-16" y="-36" width="32" height="9" rx="3" fill="#8A5A3B" stroke="${INK}" stroke-width="4"/><rect x="-13" y="-14" width="26" height="12" fill="#C98A4B"/></g>`;}
  if(o.item==='phone'){g+=`<rect x="${ra.end[0]-12}" y="${ra.end[1]-34}" width="24" height="40" rx="5" fill="#2B2F4A" stroke="${INK}" stroke-width="4"/>`;}
  g+=hand(ra.end[0],ra.end[1],ra.ang,skin,o.handF);
  g+=`</g></g></g>`;
  return g;
}
function pigeon(x,y,s,t,mode){
  const flap=mode==='fly'?Math.sin(t*30)*35:0, wingUp=mode==='fly'?-30+flap:0;
  const peck=mode==='peck'?Math.max(0,Math.sin(t*5))*12:0;
  return `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="8" rx="30" ry="6" fill="#000" opacity="${mode==='fly'?0:.15}"/>
  <path d="M-36,-20 Q-10,-46 26,-30 Q40,-16 20,0 Q-20,6 -36,-20 Z" fill="#A9B4CC" stroke="${INK}" stroke-width="4"/>
  <g transform="translate(18,${-34+peck}) rotate(${peck})"><circle r="15" fill="#8D99B8" stroke="${INK}" stroke-width="4"/><circle cx="6" cy="-3" r="3.2" fill="${INK}"/><path d="M13,-1 L24,3 L13,6 Z" fill="#FFB020" stroke="${INK}" stroke-width="2.5"/></g>
  <path d="M-10,-26 L${-40},${-30+wingUp*1.4} L10,-20 Z" fill="#C3CCE0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  ${mode!=='fly'?`<path d="M-4,0 L-6,8 M8,0 L8,8" stroke="#E07A3C" stroke-width="4"/>`:''}
  </g>`;
}

// ---------- side-view runner ----------
function chibiSide(o){
  const s=o.s||1, x=o.x, y=o.y, ph=o.phase||0, top=o.top||'#FFC21F', pants=o.pants||'#1F2033', skin='url(#skin)';
  const bob=-Math.abs(Math.sin(ph*2*Math.PI))*10*(o.run??1);
  const lean=o.lean??16, w=o.wind??1;
  let g=`<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="6" rx="52" ry="10" fill="#000" opacity=".16"/>`;
  g+=`<g transform="translate(0,${bob}) rotate(${lean},0,-72)">`;
  const leg=(phi,front)=>{
    const th=42*Math.sin(phi), kn=-(18+72*(0.5+0.5*Math.cos(phi)));
    const l=limb(front?6:-6,-72,th,38,kn,36,22,pants); let q=l.svg;
    q+=`<path d="M${front?6:-6},-66 L${l.end[0]},${l.end[1]-8}" stroke="#fff" stroke-width="4" opacity="${front?.9:.5}"/>`;
    const fa=l.ang; // shoe oriented along foot
    q+=`<g transform="translate(${l.end[0]},${l.end[1]}) rotate(${clamp(-fa*0.5,-35,55)})"><path d="M-14,4 Q-16,-12 0,-12 Q22,-12 30,2 L30,8 L-14,8 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-14,6 L30,6" stroke="#3D8BFF" stroke-width="4"/></g>`;
    return q;};
  const arm=(phi,front)=>{
    const up=-48*Math.sin(phi), fr=88;
    const l=limb(front?6:-4,-150,up,38,fr,32,21,top); return l.svg+`<circle cx="${l.end[0]}" cy="${l.end[1]}" r="12" fill="${skin}" stroke="${INK}" stroke-width="4"/>`;};
  const P=ph*2*Math.PI;
  g+=arm(P,false)+leg(P+Math.PI,false);
  // torso (side)
  g+=`<path d="M-40,-170 Q8,-182 40,-162 Q50,-110 44,-64 Q0,-54 -44,-64 Q-52,-112 -40,-170 Z" fill="${top}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  g+=`<path d="M-42,-160 Q-50,-112 -44,-66 Q-30,-62 -22,-61 Q-30,-112 -24,-166 Z" fill="#000" opacity=".12"/>`;
  g+=`<path d="M6,-98 L40,-98 L42,-68 L4,-66 Z" fill="none" stroke="${INK}" stroke-width="3.5" opacity=".5"/>`;
  // drawstrings streaming back
  if(!o.noHood) for(const k of [0,1]){const yy=-160+k*6, f=Math.sin(o.t*18+k)*6; const d=`M${22-k*6},${yy} Q${-10},${yy+10+f} ${-38-k*8},${yy+4+f*1.4}`;
    g+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`;}
  g+=leg(P,true);
  // head (profile, facing right)
  g+=`<g transform="translate(6,-238) rotate(${-lean*0.35})">`;
  if(!o.noHood) g+=`<ellipse cx="-26" cy="-4" rx="88" ry="100" fill="url(#hoodG)" stroke="${INK}" stroke-width="6"/>`;
  if(!o.noHood) g+=`<path d="M-104,${14+Math.sin(o.t*20)*3} Q-${128+w*24},${18+Math.sin(o.t*20)*6} -${148+w*28},${38+Math.sin(o.t*20+1)*8} Q-${124+w*14},44 -96,42" fill="#F0AE14" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if(!o.noHood) g+=`<path d="M-88,-40 Q-74,-80 -34,-92" fill="none" stroke="#FFF1B0" stroke-width="9" stroke-linecap="round" opacity=".85"/>`;
  g+=`<ellipse cx="8" cy="0" rx="78" ry="78" fill="${skin}" stroke="${INK}" stroke-width="5.5"/>`;
  // hair: bangs swept back
  g+=`<path d="M-66,-30 C-70,-86 -10,-104 40,-94 C66,-88 82,-66 86,-40 C${70-w*10},-50 ${60-w*10},-48 52,-40 C46,-58 32,-60 24,-56 C18,-40 6,-46 0,-58 C-10,-44 -24,-44 -30,-56 C-40,-40 -54,-40 -66,-30 Z" fill="${o.hairCol||'#1B1B2B'}" stroke="${INK}" stroke-width="4"/>`;
  g+=`<path d="M-20,-88 Q16,-98 50,-88" fill="none" stroke="#4A4F7A" stroke-width="7" stroke-linecap="round"/>`;
  // hood front rim
  if(!o.noHood) g+=`<path d="M-56,54 A84,84 0 0 1 -6.6,-82.7" fill="none" stroke="#FFC21F" stroke-width="12" stroke-linecap="round"/>`;
  // ear
  g+=`<path d="M-28,2 q-14,12 0,26" fill="none" stroke="#D9A88C" stroke-width="5" stroke-linecap="round"/>`;
  // eye (profile anime eye)
  const ex=44, ey=4, det=o.expr==='determined';
  g+=`<ellipse cx="${ex}" cy="${ey}" rx="13" ry="20" fill="url(#eyeG)"/><ellipse cx="${ex+3}" cy="${ey-8}" rx="5" ry="6.5" fill="#fff"/><circle cx="${ex-4}" cy="${ey+8}" r="2.6" fill="#fff"/>`;
  g+=`<path d="M${ex-16},${det?-24:-30} Q${ex},${det?-30:-38} ${ex+16},${det?-30:-32}" fill="none" stroke="#1B1B2B" stroke-width="6" stroke-linecap="round"/>`;
  g+=`<ellipse cx="${ex-6}" cy="32" rx="13" ry="7" fill="#FF8C9A" opacity=".7"/>`;
  g+=`<path d="M84,18 q6,4 2,9" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  g+= o.mouth==='o'?`<ellipse cx="68" cy="46" rx="7" ry="9" fill="#7A1F33" stroke="${INK}" stroke-width="4"/>`
     :`<path d="M52,40 Q70,40 82,36 Q80,60 64,60 Q52,58 52,40 Z" fill="#7A1F33" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M54,41 L80,37 L79,44 L55,47 Z" fill="#fff"/>`;
  g+=`</g>`;
  g+=arm(P+Math.PI,true);
  g+=`</g></g>`;
  return g;
}

// ---------- background ----------
function cloud(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})" fill="#fff" opacity=".95"><ellipse cx="0" cy="0" rx="90" ry="38"/><ellipse cx="-50" cy="-18" rx="50" ry="40"/><ellipse cx="30" cy="-34" rx="60" ry="48"/><ellipse cx="80" cy="-6" rx="46" ry="34"/></g>`;}
function building(x,w,h,col,roof,seed){
  let s=`<rect x="${x}" y="${700-h}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
  s+=`<rect x="${x-8}" y="${700-h-18}" width="${w+16}" height="22" rx="6" fill="${roof}" stroke="${INK}" stroke-width="5"/>`;
  s+=`<rect x="${x}" y="${700-h+4}" width="${w*0.18}" height="${h-8}" fill="#000" opacity=".06"/>`;
  for(let wy=700-h+40; wy<620; wy+=96) for(let wx=x+34; wx<x+w-60; wx+=88){
    s+=`<rect x="${wx}" y="${wy}" width="52" height="60" rx="8" fill="#DDF1FF" stroke="${INK}" stroke-width="4"/><path d="M${wx+8},${wy+48} L${wx+34},${wy+10}" stroke="#fff" stroke-width="6" opacity=".9"/><rect x="${wx-4}" y="${wy+58}" width="60" height="8" rx="3" fill="${roof}" stroke="${INK}" stroke-width="3"/>`;
  }
  return s;
}
function tree(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-10" y="-90" width="20" height="90" fill="#8A5A3B" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-130" r="62" fill="#5CC46A" stroke="${INK}" stroke-width="5"/><circle cx="-40" cy="-100" r="42" fill="#5CC46A" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-104" r="44" fill="#5CC46A" stroke="${INK}" stroke-width="5"/><circle cx="-14" cy="-150" r="20" fill="#8BE08F" opacity=".7"/></g>`;}
function bgSky(t){
  let s=`<rect x="-1200" y="-400" width="6400" height="1700" fill="url(#sky)"/>`;
  s+=`<circle cx="400" cy="120" r="90" fill="#FFF6C8" opacity=".9"/><circle cx="400" cy="120" r="150" fill="#FFF6C8" opacity=".25"/>`;
  s+=cloud(300+t*6,170,1)+cloud(1300+t*4,120,1.3)+cloud(2300+t*5,200,1.1)+cloud(3300+t*4,140,1);
  return s;}
function bgFar(){
  let s='';
  const B=[[ -500,380,420,'#FFC9B8','#E8836E'],[-100,420,470,'#FFF0C2','#E8B24A'],[1000,360,400,'#BFE8D2','#5CB487'],[1380,400,500,'#D8CCFF','#8C78E0'],[1800,380,430,'#FFC9B8','#E8836E'],[2200,420,480,'#FFF0C2','#E8B24A'],[2640,380,410,'#BFE8D2','#5CB487'],[3040,400,470,'#D8CCFF','#8C78E0'],[3460,420,440,'#FFC9B8','#E8836E'],[3880,380,460,'#FFF0C2','#E8B24A']];
  for(const b of B) s+=building(...b);
  s+=tree(1180,700,0.9)+tree(2520,700,1)+tree(3300,700,0.95);
  return s;}
function bgNear(t,doorOpen){
  let s='';
  s+=`<rect x="600" y="300" width="380" height="400" fill="#FFE7B8" stroke="${INK}" stroke-width="5"/><path d="M580,310 L790,170 L1000,310 Z" fill="#E8836E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  s+=`<rect x="640" y="360" width="90" height="90" rx="8" fill="#DDF1FF" stroke="${INK}" stroke-width="4"/><rect x="850" y="360" width="90" height="90" rx="8" fill="#DDF1FF" stroke="${INK}" stroke-width="4"/><path d="M650,436 L700,372 M860,436 L910,372" stroke="#fff" stroke-width="7" opacity=".9"/>`;
  s+=`<rect x="735" y="500" width="110" height="200" fill="#3B2A4A" stroke="${INK}" stroke-width="5"/>`;
  const dw=110*(1-doorOpen*0.85);
  s+=`<rect x="735" y="500" width="${dw}" height="200" rx="4" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle cx="${735+dw-18}" cy="606" r="7" fill="${INK}"/><text x="790" y="490" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="${INK}">1</text>`;
  s+=`<rect x="700" y="690" width="180" height="14" fill="#C9C2DA" stroke="${INK}" stroke-width="4"/>`;
  s+=tree(420,700,1);
  // lamp posts + bench + bin for street detail
  for(const lx of [1120,2050,2980]) s+=`<rect x="${lx-6}" y="460" width="12" height="245" fill="#3A3F66" stroke="${INK}" stroke-width="4"/><path d="M${lx},470 q0,-30 40,-30 l10,0" fill="none" stroke="#3A3F66" stroke-width="10"/><rect x="${lx+34}" y="436" width="34" height="18" rx="6" fill="#FFF1B0" stroke="${INK}" stroke-width="4"/>`;
  s+=`<rect x="2700" y="655" width="150" height="16" rx="6" fill="#B07A45" stroke="${INK}" stroke-width="4"/><rect x="2700" y="625" width="150" height="16" rx="6" fill="#B07A45" stroke="${INK}" stroke-width="4"/><rect x="2712" y="671" width="10" height="30" fill="#3A3F66"/><rect x="2828" y="671" width="10" height="30" fill="#3A3F66"/>`;
  s+=`<rect x="-1200" y="700" width="6400" height="230" fill="#E6E1F0" stroke="${INK}" stroke-width="5"/>`;
  for(let x=-1200;x<5200;x+=160) s+=`<path d="M${x},700 L${x-40},930" stroke="#CFC8E0" stroke-width="4"/>`;
  s+=`<rect x="-1200" y="930" width="6400" height="20" fill="#B9B2CC" stroke="${INK}" stroke-width="5"/><rect x="-1200" y="950" width="6400" height="400" fill="url(#road)"/>`;
  for(let x=-1200;x<5200;x+=240) s+=`<rect x="${x}" y="1030" width="120" height="14" rx="7" fill="#F2F2F2" opacity=".8"/>`;
  return s;}
function motes(t){
  const tf=Math.min(t,FREEZE); let s='';
  for(let i=0;i<46;i++){const bx=(i*397)%3600-200, by=150+(i*211)%640; const x=bx+Math.sin(tf*0.6+i)*30+tf*8, y=by+Math.cos(tf*0.5+i*2)*20;
    const tw=t>FREEZE?(0.5+0.5*Math.sin(t*4+i*1.7)):0.35; const r=2+ (i%4);
    s+= t>FREEZE? `<path d="M${x},${y-r*2.2} L${x+r*0.6},${y} L${x},${y+r*2.2} L${x-r*0.6},${y} Z M${x-r*2.2},${y} L${x},${y+r*0.6} L${x+r*2.2},${y} L${x},${y-r*0.6} Z" fill="#FFFFFF" opacity="${tw}"/>` : `<circle cx="${x}" cy="${y}" r="${r*0.7}" fill="#FFFFFF" opacity="${tw}"/>`;}
  return s;}
