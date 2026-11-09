function brickWall(x,y,w,h,face){let g=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C8573E" stroke="${INK}" stroke-width="8"/>`;
  for(let r=0;r<h/60;r++){g+=`<line x1="${x}" y1="${y+r*60}" x2="${x+w}" y2="${y+r*60}" stroke="#8E3A28" stroke-width="5"/>`;for(let c=0;c<w/120+1;c++){const bx=x+c*120+(r%2?60:0);if(bx>x&&bx<x+w)g+=`<line x1="${bx}" y1="${y+r*60}" x2="${bx}" y2="${y+r*60+60}" stroke="#8E3A28" stroke-width="5"/>`;}}
  if(face) g+=`<g transform="translate(${x+w/2},${y+h*0.38})"><ellipse cx="-50" cy="0" rx="22" ry="${face==='bored'?8:22}" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="50" cy="0" rx="22" ry="${face==='bored'?8:22}" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-50" cy="${face==='bored'?2:4}" r="8" fill="${INK}"/><circle cx="50" cy="${face==='bored'?2:4}" r="8" fill="${INK}"/><path d="M-30,60 L30,60" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></g>`;
  return g;}
function scene(t){
  let s='';
  if(t<ST[3]-0.2){
    s+=bgPanel('#8FD6FF','#D6F0FF')+`<rect y="900" width="1920" height="180" fill="#E6E1F0" stroke="${INK}" stroke-width="5"/>`;
    const hit=ST[1]+1.4; const [sx,sy]=shake(t,hit,10,0.3);
    s+=`<g transform="translate(${sx},${sy})">${brickWall(1050,260,620,650,t>ST[2]?'bored':null)}</g>`;
    const wind=t>ST[1]+0.4&&t<hit, punch=t>=hit&&t<hit+1.2;
    s+=chibi({x:900,y:910,s:1.25,...DEX,eyes:punch?'closed':'open',mouth:t>hit+0.6?'grin':(wind?'flat':'smile'),brow:wind?8:0,armF:punch?[90,0]:wind?[-40,-80]:[-20,10],armLen:punch?1.5:1,armB:[20,-10],lean:punch?8:0});
    s+=bang(t,hit,1180,330,'THUD.','#FFF07A',90,-6,hit+1.4);
    s+=chipAt(t,ST[0]+0.3,960,120,'CAN HE BREAK THINGS?','#3D8BFF',56,ST[1]+0.8);
    s+=chipAt(t,hit+0.8,420,300,'PAIN: 0','#7ED957',54);
    s+=chipAt(t,ST[2]+0.3,1360,170,'WALL DAMAGE: 0','#E8463C',54);
  } else if(t<ST[4]-0.2){ // muscles
    s+=bgPanel('#FFF6E0','#FFE7B8');
    s+=chibi({x:560,y:1000,s:1.35,...DEX,eyes:'open',mouth:'flat',armF:[100,-60],armB:[-100,60]});
    s+=`<g transform="translate(1300,330) scale(${pop(t,ST[3]+0.3,0.35)})"><rect x="-380" y="-110" width="760" height="220" rx="28" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="-340" y="-30" font-family="Lilita One" font-size="44" fill="${INK}">BODY: UNBREAKABLE</text><rect x="-340" y="0" width="680" height="36" rx="18" fill="#7ED957" stroke="${INK}" stroke-width="5"/></g>`;
    const mk=ease(seg(t,ST[3]+2.6,ST[3]+3.4));
    s+=`<g transform="translate(1300,620) scale(${pop(t,ST[3]+2.4,0.35)})"><rect x="-380" y="-110" width="760" height="220" rx="28" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="-340" y="-30" font-family="Lilita One" font-size="44" fill="${INK}">MUSCLES: SAME AS YESTERDAY</text><rect x="-340" y="0" width="680" height="36" rx="18" fill="#EEE9F6" stroke="${INK}" stroke-width="5"/><rect x="-336" y="4" width="${200*mk}" height="28" rx="14" fill="#FFC21F"/></g>`;
  } else if(t<ST[5]-0.2){ // arm wrestle with nan
    s+=bgPanel('#FFE3EC','#FFF0F4');
    s+=`<rect x="0" y="780" width="1920" height="300" fill="#E9C9A0" stroke="${INK}" stroke-width="6"/>`;
    const slam=ST[4]+1.5, k=t<slam?Math.sin(t*14)*0.06:Math.min(1,(t-slam)*6);
    s+=chibi({x:620,y:1035,s:1.2,...DEX,eyes:t>slam?'dot':'closed',mouth:t>slam?'o':'flat',brow:t<slam?8:0,sweat:t<slam,armF:[60,20],armB:[20,-10]});
    s+=chibi({x:1300,y:1035,s:1.2,type:'sweater',top:'#B07CFF',hair:'bun',hairCol:'#E6E6EE',pants:'#3D3F66',eyes:t>slam?'happy':'open',mouth:t>slam?'grin':'smile',acc:'glasses',armF:[-60,-20],armB:[-20,10]});
    s+=`<rect x="460" y="900" width="1000" height="60" rx="16" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="500" y="955" width="920" height="160" fill="#8E5E3A" stroke="${INK}" stroke-width="7"/>`;
    const ang=-90+lerp(0,-70,Math.max(0,k))+(t<slam?k*30:0);
    s+=`<g transform="translate(960,905) rotate(${ang+90})"><rect x="-30" y="-200" width="60" height="200" rx="28" fill="#FFC21F" stroke="${INK}" stroke-width="6"/><rect x="-28" y="-200" width="56" height="200" rx="28" fill="#B07CFF" stroke="${INK}" stroke-width="6" transform="rotate(8)"/><circle cx="0" cy="-200" r="38" fill="url(#skin)" stroke="${INK}" stroke-width="6"/></g>`;
    s+=bang(t,slam,960,360,'SLAM!','#E8463C',110,-6,slam+1.6);
    s+=chipAt(t,ST[4]+0.2,960,120,'DEX vs NAN','#B07CFF',58);
    if(t>slam+0.6) s+=chipAt(t,slam+0.6,1550,420,'NAN WINS','#E8463C',52);
  } else if(t<ST[6]-0.2){ // training montage
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.4);
    const up=Math.abs(Math.sin(t*3));
    s+=chibi({x:960,y:1000,s:1.4,...DEX,eyes:'closed',mouth:'grin',brow:6,sweat:true,armF:[170-up*40,-30],armB:[-170+up*40,30],armLen:1.2});
    const by=1000-1.4*330-up*60;
    s+=`<g transform="translate(960,${by})"><rect x="-260" y="-12" width="520" height="24" rx="10" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><rect x="-300" y="-60" width="50" height="120" rx="10" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/><rect x="250" y="-60" width="50" height="120" rx="10" fill="#2B2F4A" stroke="${INK}" stroke-width="5"/></g>`;
    s+=chipAt(t,ST[5]+0.8,960,140,'TRAIN FOREVER · 0 INJURIES','#7ED957',54);
  } else {
    s+=bgPanel('#8FD6FF','#D6F0FF')+`<rect y="900" width="1920" height="180" fill="#E6E1F0" stroke="${INK}" stroke-width="5"/>`+brickWall(1380,380,420,530,'bored');
    s+=chibi({x:560,y:910,s:1.2,...DEX,eyes:'happy',mouth:'smile',armF:[-20,10],armB:[20,-10],tilt:-6});
    s+=note(t,ST[6]+DU[6]-1.6,1000,380,'RULE 3','NOT','STRONG.');
  }
  [ST[3]-0.2,ST[4]-0.2,ST[5]-0.2,ST[6]-0.2].forEach(w=>s+=wipe(t,w));
  return s;
}
