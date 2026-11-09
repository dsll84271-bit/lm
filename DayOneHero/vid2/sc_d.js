function plane(){return bgPanel('#D9DEEA','#BFC6D9')+`<rect x="0" y="0" width="1920" height="1080" fill="#C9CFDF"/>${[0,1,2,3,4,5].map(i=>`<rect x="${i*340}" y="120" width="220" height="140" rx="60" fill="#9FD8FF" stroke="${INK}" stroke-width="6"/>`).join('')}<rect y="900" width="1920" height="180" fill="#8C93B8" stroke="${INK}" stroke-width="6"/>`;}
function scene(t){
  let s='';
  const jump=after(1,0.3), impact=ST[4]+0.5;
  if(t<jump+0.6){
    s+=plane();
    const door=`<rect x="1100" y="260" width="560" height="640" rx="20" fill="#7ED0FF" stroke="${INK}" stroke-width="9"/>`;
    let sky='';for(let i=0;i<4;i++){const cy=((i*260-t*500)%900+900)%900+200; sky+=cloud(1200+(i*140)%400,cy,0.9);}
    s+=door+`<svg x="1100" y="260" width="560" height="640" viewBox="1100 260 560 640" overflow="hidden">${sky}</svg>`;
    if(t<jump){s+=chibi({x:1260,y:900,s:1.25,...DEX,eyes:'open',sparkle:true,mouth:'grin',armF:t>ST[1]?[115,55]:[-20,10],armLen:t>ST[1]?1.4:1,handF:t>ST[1]?'peace':null,armB:[20,-10],acc:'glasses'});}
    else {const k=seg(t,jump,jump+0.6); s+=chibi({x:lerp(1260,1500,k),y:lerp(900,1200,k*k),s:1.25,...DEX,eyes:'happy',mouth:'laugh',armF:[160,20],armB:[-160,-20],acc:'glasses',tilt:k*40});}
    s+=chipAt(t,ST[0]+0.4,560,300,'ONE THING ONLY HE CAN DO','#3D8BFF',48,ST[1]);
    if(t>=ST[1]) s+=chipAt(t,ST[1]+0.8,560,300,'PARACHUTE: ✗','#E8463C',62);
  } else if(t<impact){ // freefall
    const alt=1-seg(t,ST[2],impact); const near=seg(t,ST[4]-1.6,impact);
    s+=bgPanel('#4FA8F0','#BFE6FF');
    for(let i=0;i<7;i++){const cy=((i*230-t*900)%1400+1400)%1400-150; s+=cloud((i*317)%1920,cy,1.0+(i%3)*0.4);}
    if(near>0) s+=`<g transform="translate(960,${1180-near*500}) scale(${0.3+near*3})"><rect x="-1200" y="0" width="2400" height="900" fill="#86D17C"/>${[0,1,2,3,4].map(i=>`<rect x="${-1000+i*420}" y="${40}" width="300" height="200" fill="${i%2?'#6FBF5E':'#A6DD7A'}"/>`).join('')}</g>`;
    const wob=Math.sin(t*3)*4;
    s+=`<g transform="translate(960,${520+wob})">${lying({...DEX,eyes:t>ST[3]?'happy':'wide',mouth:t>ST[3]?'laugh':'o',armF:[90,-60],armB:[-90,60],acc:'glasses',legL:[-20,0],legR:[20,0]},0,0,1.2,-90)}</g>`;
    for(let i=0;i<6;i++) s+=`<line x1="${720+i*90}" y1="${680+((i*97+t*1400)%300)}" x2="${720+i*90}" y2="${760+((i*97+t*1400)%300)}" stroke="#fff" stroke-width="6" opacity=".7"/>`;
    const v=Math.min(200, 200*(1-Math.exp(-(t-jump)/3.2)));
    s+=`<g transform="translate(260,760)"><circle r="150" fill="#1B1D33" stroke="#fff" stroke-width="6"/>${[0,1,2,3,4].map(i=>{const a=rad(-210+i*60);return `<text x="${Math.cos(a)*112}" y="${Math.sin(a)*112+12}" text-anchor="middle" font-family="Lilita One" font-size="28" fill="#9FD8FF">${i*50}</text>`;}).join('')}<line x1="0" y1="0" x2="${Math.cos(rad(-210+v*1.2))*120}" y2="${Math.sin(rad(-210+v*1.2))*120}" stroke="#E8463C" stroke-width="10" stroke-linecap="round"/><text y="215" text-anchor="middle" font-family="Lilita One" font-size="48" fill="#fff" stroke="#1B1D33" stroke-width="8" paint-order="stroke">${Math.round(v)} km/h</text></g>`;
    s+=`<g transform="translate(1660,800)"><rect x="-170" y="-70" width="340" height="140" rx="20" fill="#1B1D33" stroke="#fff" stroke-width="6"/><text y="-14" text-anchor="middle" font-family="Lilita One" font-size="32" fill="#9FD8FF">ALTITUDE</text><text y="44" text-anchor="middle" font-family="Lilita One" font-size="56" fill="#7ED957">${Math.round(alt*4000).toLocaleString('en-GB')} m</text></g>`;
    if(t>ST[2]+2.6&&t<ST[3]){s+=`<path d="M700,390 L700,300" stroke="#7FD3FF" stroke-width="18"/><path d="M668,316 L700,256 L732,316 Z" fill="#7FD3FF" stroke="${INK}" stroke-width="4"/><text x="750" y="320" font-family="Lilita One" font-size="40" fill="#fff" stroke="#1B1D33" stroke-width="7" paint-order="stroke">AIR PUSHING UP</text><path d="M700,670 L700,760" stroke="#E8463C" stroke-width="18"/><path d="M668,744 L700,804 L732,744 Z" fill="#E8463C" stroke="${INK}" stroke-width="4"/><text x="750" y="760" font-family="Lilita One" font-size="40" fill="#fff" stroke="#1B1D33" stroke-width="7" paint-order="stroke">WEIGHT</text>`+chipAt(t,ST[2]+2.8,1300,200,'AIR PUSH = WEIGHT','#3D8BFF',44);}
    s+=chipAt(t,ST[2]+5.0,960,90,'TERMINAL VELOCITY ≈ 200 km/h','#E8463C',54,ST[3]);
    if(t>=ST[3]) s+=chipAt(t,ST[3]+0.6,960,90,'4 km UP · JUST OVER A MINUTE','#3D8BFF',52,ST[4]-1.6);
  } else if(t<ST[5]-0.2){ // impact
    const [sx,sy]=shake(t,impact,30,0.9);
    let w=bgPanel('#7ED0FF','#D6F0FF')+`<rect y="700" width="1920" height="380" fill="#86D17C" stroke="${INK}" stroke-width="6"/>`;
    w+=`<ellipse cx="960" cy="760" rx="${lerp(0,360,seg(t,impact,impact+0.3))}" ry="70" fill="#5E4A3A" stroke="${INK}" stroke-width="6"/>`;
    const dk=seg(t,impact,impact+2.5); w+=`<g opacity="${1-dk*0.7}">${[0,1,2,3,4,5,6].map(i=>`<circle cx="${960+(i-3)*130*(0.6+dk)}" cy="${700-dk*120-(i%2)*60}" r="${90+dk*80}" fill="#C9B9A6"/>`).join('')}</g>`;
    for(let i=0;i<8;i++){const a=rad(-160+i*20),k=seg(t,impact,impact+1.2); w+=`<circle cx="${960+Math.cos(a)*500*k}" cy="${740+Math.sin(a)*400*k+500*k*k}" r="14" fill="#6E4A3A" stroke="${INK}" stroke-width="4"/>`;}
    s+=`<g transform="translate(${sx},${sy})">${w}</g>`+flash(t,impact,'#fff',0.4,0.95)+bang(t,impact+0.05,960,340,'BOOM!','#FFC21F',180,-6,impact+1.6);
    s+=chipAt(t,ST[4]+2.6,960,140,'≈ A SMALL CAR CRASHING AT 40 km/h','#E8463C',50);
  } else if(t<ST[7]-0.2){ // crater, laughing
    s+=bgPanel('#7ED0FF','#D6F0FF')+`<rect y="560" width="1920" height="520" fill="#86D17C" stroke="${INK}" stroke-width="6"/>`;
    s+=`<path d="M360,570 Q960,1180 1560,570 Z" fill="#6E4A3A" stroke="${INK}" stroke-width="8"/><path d="M420,580 Q960,1100 1500,580" fill="none" stroke="#5E3E30" stroke-width="10"/>`;
    s+=`<path d="M300,575 Q330,520 380,560 M1540,560 Q1590,520 1620,575" fill="#6E4A3A" stroke="${INK}" stroke-width="6"/>`;
    const climb=seg(t,ST[5]+0.4,ST[5]+2.6);
    if(t<ST[6]) s+=chibi({x:lerp(960,1320,climb),y:lerp(860,640,climb),s:1.1,...DEX,eyes:t>ST[5]+2.6?'happy':'open',mouth:t>ST[5]+2.6?'laugh':'smile',armF:[150,-20],armB:[-60,20],tilt:lerp(-20,0,climb),acc:'glasses'});
    else s+=lying({...DEX,eyes:'happy',mouth:'laugh',armF:[-160,60],armB:[160,-60],acc:'glasses'},960,820,1.15,-90);
    if(t>=ST[6]){s+=chipAt(t,ST[6]+0.4,560,160,'NORMAL PERSON: ✗','#E8463C',50)+chipAt(t,ST[6]+2.6,1360,160,'DEX: BEST DAY EVER','#7ED957',50);
      for(let i=0;i<14;i++){const ph=((t*0.5+i*0.07)%1);s+=`<rect x="${(i*137)%1920}" y="${ph*1080-40}" width="16" height="26" fill="${['#FFC21F','#E8463C','#3D8BFF','#7ED957'][i%4]}" transform="rotate(${ph*500},${(i*137)%1920},${ph*1080})"/>`;}}
    else s+=bang(t,ST[5]+2.8,1460,420,'HA HA HA!','#FFC21F',80,-6);
  } else { // red hood at rim
    s+=bgPanel('#5E6A9E','#B9C2E6')+`<path d="M0,1080 L0,760 Q960,560 1920,760 L1920,1080 Z" fill="#6E4A3A" stroke="${INK}" stroke-width="8"/>`;
    const gone=after(8,0.6);
    if(t<gone){const eo=seg(t,ST[7]+2.2,ST[7]+2.6); s+=mystery(1180,705,1.15,eo);}
    const sk=seg(t,gone,gone+0.5); if(t>=gone&&sk<1) s+=`<path d="M1180,520 Q1500,${380-200*sk} 2100,300" fill="none" stroke="#E8463C" stroke-width="${70*(1-sk)+8}" stroke-linecap="round" opacity="${1-sk}"/>`;
    s+=`<g transform="translate(560,1220)">${chibi({x:0,y:0,s:1.6,...DEX,eyes:t>ST[7]+2.4?'wide':'happy',mouth:t>ST[7]+2.4?'o':'smile',look:[12,-12],sweat:t>gone,armF:[-20,10],armB:[20,-10],acc:'glasses'})}</g>`;
    if(t>=ST[8]) s+=`<g transform="translate(960,130) scale(${pop(t,ST[8]+0.1,0.35)})">${txt('THE SAME RED HOOD…',0,0,84,'#E8463C')}</g>`;
    s+=`<defs><radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#vig)"/>`;
  }
  s+=wipe(t,ST[5]-0.2);
  return s;
}
