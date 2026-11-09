function sub(x,y,s,crush){return `<g transform="translate(${x},${y}) scale(${s},${s*(1-0.6*crush)})"><ellipse rx="160" ry="70" fill="#FFC21F" stroke="${INK}" stroke-width="7"/><rect x="-30" y="-110" width="70" height="50" rx="12" fill="#FFC21F" stroke="${INK}" stroke-width="6"/>${[-80,0,80].map(cx=>`<circle cx="${cx}" cy="0" r="22" fill="#9FD8FF" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;}
function fish(x,y,s,col,t){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="50" ry="28" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M45,0 l40,-26 l0,52 Z" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="-6" r="6" fill="${INK}"/></g>`;}
function scene(t){
  let s='';
  const jump=after(0,0.2), up=ST[4]+0.6, out=after(4,0.3);
  // depth 0..1
  let d= t<jump?0 : t<ST[2]? ease(seg(t,jump,ST[1]+1.5)) : t<up?1 : 1-ease(seg(t,up,out));
  if(t>=out) d=0;
  const surface=t<jump+0.5||t>=out;
  if(surface){
    s+=bgPanel('#7ED0FF','#D6F0FF')+`<rect y="560" width="1920" height="520" fill="#2E8BD9"/><path d="M0,560 ${Array.from({length:33},(_,i)=>`L${i*60},${560+Math.sin(i+t*3)*8}`).join(' ')} L1920,560" fill="none" stroke="#fff" stroke-width="6"/>`;
    s+=`<g transform="translate(1300,${560+Math.sin(t*2)*6})"><path d="M-260,-20 L260,-20 L200,60 L-200,60 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-140" width="20" height="130" fill="#8C93B8" stroke="${INK}" stroke-width="5"/></g>`;
    if(t<jump) s+=chibi({x:1180,y:540,s:0.95,...DEX,eyes:'open',sparkle:true,mouth:'grin',armF:[-20,10],armB:[20,-10]});
    else if(t<jump+0.5){const k=seg(t,jump,jump+0.5); s+=chibi({x:lerp(1180,900,k),y:lerp(540,660,k)-Math.sin(k*Math.PI)*160,s:0.95,...DEX,eyes:'happy',mouth:'laugh',armF:[160,10],armB:[-160,-10]});}
    else {const g=t<ST[5]; s+=chibi({x:860,y:850,s:1.0,...DEX,eyes:g?'wide':'happy',mouth:g?'o':'smile',sweat:g,armF:[-20,10],armB:[20,-10]}); s+=`<rect y="${640}" width="1920" height="440" fill="#2E8BD9" opacity=".75"/>`;
      s+=bang(t,out,1080,500,'GASP!','#FFF07A',100,-6,out+1.4); s+=note(t,ST[5],1380,330,'RULE 5','STILL NEED','AIR.');}
    s+=chipAt(t,ST[0]+0.4,600,150,'THE DEEPEST OCEAN?','#3D8BFF',54,jump);
  } else {
    const c1=`rgb(${lerp(46,6,d)|0},${lerp(139,14,d)|0},${lerp(217,40,d)|0})`, c2=`rgb(${lerp(20,2,d)|0},${lerp(90,6,d)|0},${lerp(170,20,d)|0})`;
    s+=`<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#sea)"/>`;
    const dir=t<up?1:-4;
    for(let i=0;i<26;i++){const yy=((i*173 - t*120*dir)%1180+1180)%1180-50; s+=`<circle cx="${(i*331)%1920}" cy="${yy}" r="${3+i%4}" fill="#fff" opacity=".35"/>`;}
    if(d<0.6) for(let i=0;i<3;i++) s+=fish(((i*600+t*80)%2200)-150,300+i*220,0.9,['#FF8A3D','#7ED957','#FF5A7A'][i],t);
    const panic=t>=ST[2]+0.6;
    const dy=540+Math.sin(t*1.6)*12;
    s+=chibi({x:960,y:dy+170,s:1.0,...DEX,eyes:panic?'wide':(t>ST[1]+3?'happy':'open'),mouth:panic?'flat':'smile',sweat:panic,armF:t>=up?[170,0]:[-60,20],armB:t>=up?[-170,0]:[60,-20],tilt:Math.sin(t*1.3)*5});
    if(panic) for(let i=0;i<4;i++){const ph=((t*1.2+i*0.25)%1); s+=`<circle cx="${980+Math.sin(ph*9+i)*20}" cy="${dy-140-ph*260}" r="${8+i*3}" fill="none" stroke="#fff" stroke-width="4" opacity="${1-ph}"/>`;}
    s+=`<g transform="translate(1690,540)"><rect x="-150" y="-60" width="300" height="120" rx="20" fill="#1B1D33" stroke="#fff" stroke-width="5"/><text y="-12" text-anchor="middle" font-family="Lilita One" font-size="30" fill="#9FD8FF">DEPTH</text><text y="40" text-anchor="middle" font-family="Lilita One" font-size="50" fill="#7ED957">${Math.round(d*10935).toLocaleString('en-GB')} m</text></g>`;
    if(t>=ST[1]&&t<ST[2]){s+=chipAt(t,ST[1]+0.4,560,160,'PRESSURE: ×1,000','#E8463C',56);
      const cr=ease(seg(t,ST[1]+4.2,ST[1]+5.2)); s+=`<g transform="translate(420,760) scale(${pop(t,ST[1]+3.6,0.3)})">${sub(0,0,0.9,cr)}</g>`+chipAt(t,ST[1]+4.6,420,920,'NORMAL SUB: CRUSHED','#E8463C',38)+chipAt(t,ST[1]+6.6,960,940,'DEX: DOESN’T NOTICE','#7ED957',44);
      s+=`<g transform="translate(1500,300)"><path d="M0,0 Q60,-120 120,-90" fill="none" stroke="#8C93B8" stroke-width="5"/><circle cx="120" cy="-90" r="${16+Math.sin(t*5)*3}" fill="#FFF07A" opacity=".9"/><circle cx="120" cy="-90" r="40" fill="#FFF07A" opacity=".2"/><ellipse rx="110" ry="70" fill="#3E3A44" stroke="#14162A" stroke-width="6"/><path d="M-80,20 l20,-14 l20,14 l20,-14 l20,14 l20,-14" fill="none" stroke="#fff" stroke-width="5"/><circle cx="-50" cy="-20" r="10" fill="#fff"/></g>`;}
    if(t>=ST[2]&&t<up){s+=`<g transform="translate(960,190) scale(${pop(t,ST[2]+1.2,0.3)})">${txt('AIR.',0,0,150,'#FFFFFF')}</g>`;
      if(t>ST[3]){const k=seg(t,ST[3]+0.3,ST[3]+DU[3]+0.8); s+=`<g transform="translate(440,560)"><circle r="150" fill="#1B1D33" stroke="#fff" stroke-width="6"/><path d="M0,0 L0,-140 A140,140 0 ${k<0.5?1:0} 1 ${Math.sin(k*2*Math.PI)*-140*-1},${-Math.cos(k*2*Math.PI)*140} Z" transform="scale(-1,1)" fill="#7FD3FF" opacity="${1-k*0.2}"/><text y="20" text-anchor="middle" font-family="Lilita One" font-size="64" fill="#fff">0:${String(Math.floor(k*60)).padStart(2,'0')}</text></g>`+chipAt(t,ST[3]+2.4,440,780,'MOST PEOPLE: ≈ 1 MIN','#E8463C',44);}}
    if(t>=up){s+=chipAt(t,ST[4]+3.2,960,150,'NO DEEP SEA · NO SPACE','#E8463C',56);}
  }
  s+=flash(t,out,'#fff',0.3,0.6);
  return s;
}
