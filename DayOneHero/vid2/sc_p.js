function box(x,y,w,h,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" fill="#D9A866" stroke="${INK}" stroke-width="6"/><path d="M${-w/2},${-h*0.75} L${w/2},${-h*0.75} M0,${-h} L0,${-h*0.75}" stroke="${INK}" stroke-width="4"/></g>`;}
function track(){let s=bgPanel('#7ED0FF','#D6F0FF');
  s+=`<rect y="640" width="1920" height="200" fill="#86D17C" stroke="${INK}" stroke-width="5"/><rect y="830" width="1920" height="250" fill="url(#road)"/>`;
  for(let i=0;i<10;i++) s+=`<rect x="${i*200}" y="760" width="200" height="70" fill="${i%2?'#FFC21F':'#2B2F4A'}" stroke="${INK}" stroke-width="5"/>`;
  s+=`<rect x="1200" y="420" width="560" height="120" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="1480" y="500" text-anchor="middle" font-family="Lilita One" font-size="70" fill="#E8463C">CRASH TEST</text><rect x="1300" y="540" width="20" height="230" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><rect x="1640" y="540" width="20" height="230" fill="#8C93B8" stroke="${INK}" stroke-width="5"/>`;
  for(let i=0;i<12;i++) s+=`<rect x="${i*170}" y="960" width="90" height="14" rx="7" fill="#fff" opacity=".7"/>`;
  return s;}
function boxPile(t,burst){let s='';const B=[[120,960,150,110,0],[270,960,150,110,4],[195,850,140,100,-6],[60,850,120,90,8],[330,850,120,90,-3],[190,750,120,90,5]];
  B.forEach(([x,y,w,h,r],i)=>{if(burst){const k=seg(t,burst,burst+0.9),a=rad(-150+i*25);s+=box(x+Math.cos(a)*300*k,y+Math.sin(a)*260*k+300*k*k,w,h,r+k*200*(i%2?1:-1));}else s+=box(x,y,w,h,r);});return s;}
function scene(t){
  let s='';
  const imp=ST[2], land=imp+1.6;
  if(t<ST[4]-0.2){
    let w=track();
    const carX = t<imp ? lerp(2400,1060,seg(t,ST[1]+1.0,imp)) : lerp(1060,700,ease(seg(t,imp,imp+2.2)));
    if(t<ST[3]-0.2||t<ST[3]){ }
    w+=boxPile(t,t>land?land:0);
    w+=car(carX,1000,1.6,'#3D8BFF',true);
    w+=`<g transform="translate(${carX+30},${830})"><circle r="22" fill="#FFC21F" stroke="${INK}" stroke-width="4"/><path d="M-12,-2 a12,12 0 0 0 24,0" fill="none" stroke="${INK}" stroke-width="4"/></g>`;
    if(t<imp){const plant=t>ST[1]+DU[1]-1.6; w+=chibi({x:760,y:990,s:1.05,...DEX,eyes:'open',mouth:plant?'flat':'smile',brow:plant?8:0,armF:plant?[60,-60]:[-20,10],armB:plant?[-60,60]:[20,-10],legL:plant?[-14,0]:[0,0],legR:plant?[14,0]:[0,0]});
      w+=chipAt(t,ST[0]+0.4,760,150,'CAN HE STOP A CAR?','#3D8BFF',56,ST[1]+0.5);
      if(t>ST[1]+1.0) w+=`<g transform="translate(${carX},640)">${chip('50 km/h',0,0,'#E8463C',46)}</g>`;}
    else if(t<land){const k=seg(t,imp,land); w+=`<g transform="translate(${lerp(760,230,k)},${lerp(880,780,k)-Math.sin(k*Math.PI)*420}) rotate(${-k*720})">${chibi({...DEX,x:0,y:110,s:1.0,eyes:'wide',mouth:'o',armF:[150,40],armB:[-150,-40]})}</g>`;
      for(let i=0;i<5;i++) w+=`<line x1="${lerp(760,230,k)+60+i*30}" y1="${lerp(880,780,k)-Math.sin(k*Math.PI)*420-40+i*20}" x2="${lerp(760,230,k)+180+i*40}" y2="${lerp(880,780,k)-Math.sin(k*Math.PI)*420-40+i*20}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/>`;}
    else {const out=seg(t,ST[3]-0.4,ST[3]+0.3); w+=chibi({x:230,y:lerp(1060,980,out),s:1.0,...DEX,eyes:out>0?'happy':'dot',mouth:out>0?'grin':'o',sparkle:out>0,armF:out>0?[115,55]:[-20,10],armLen:out>0?1.4:1,handF:out>0?'peace':null,armB:[20,-10]}); if(out<=0) w+=stars(230,700,t,5,60);}
    const [sx,sy]=shake(t,imp,22,0.6); s+=`<g transform="translate(${sx},${sy})">${w}</g>`;
    s+=flash(t,imp,'#fff',0.25,0.8)+bang(t,imp,900,420,'BAM!','#FFC21F',150,-10,imp+1.3);
    if(t>imp+0.4&&t<ST[3]) s+=chipAt(t,imp+0.3,1450,200,'THE CAR WINS','#E8463C',58);
    if(t>=ST[3]){s+=chipAt(t,ST[3]+0.4,1200,200,'DAMAGE: 0','#7ED957',56); s+=chipAt(t,ST[3]+2.2,1200,300,'WEIGHT: STILL ≈ 50 kg','#3D8BFF',50);}
  } else if(t<ST[5]-0.2){ // scale + momentum
    s+=bgPanel('#FFF6E0','#FFE7B8');
    const tilt=lerp(0,14,ease(seg(t,ST[4]+0.4,ST[4]+1.6)));
    s+=`<path d="M920,940 L1000,940 L960,640 Z" fill="#8C93B8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    s+=`<g transform="translate(960,640) rotate(${-tilt})"><rect x="-640" y="-14" width="1280" height="28" rx="12" fill="#B07A4A" stroke="${INK}" stroke-width="7"/>${car(-430,-14,1.25,'#3D8BFF',false)}<g transform="translate(450,-14) rotate(${tilt})">${chibi({x:0,y:0,s:0.8,...DEX,eyes:'wide',mouth:'o',armF:[-20,10],armB:[20,-10]})}</g></g>`;
    s+=chipAt(t,ST[4]+1.0,520,300,'CAR ≈ 1,100 kg','#3D8BFF',48); s+=chipAt(t,ST[4]+1.6,1400,200,'DEX ≈ 50 kg','#FFC21F',48); s+=chipAt(t,ST[4]+2.4,960,140,'MORE THAN ×20','#E8463C',58);
    if(t>ST[4]+5.0){const k=ease(seg(t,ST[4]+5.0,ST[4]+6.0));
      s+=`<g transform="translate(0,880)"><rect x="300" y="-36" width="${560*k}" height="44" rx="10" fill="#3D8BFF" stroke="${INK}" stroke-width="5"/><text x="300" y="-60" font-family="Lilita One" font-size="38" fill="${INK}">CAR: BARELY SLOWS</text><rect x="1100" y="-36" width="${520*k}" height="44" rx="10" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><text x="1100" y="-60" font-family="Lilita One" font-size="38" fill="${INK}">DEX: LAUNCHED ≈ CAR SPEED</text></g>`;}
  } else if(t<ST[6]-0.2){ // ping-pong
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.4);
    s+=`<rect x="160" y="160" width="1600" height="800" rx="40" fill="#1E8F5C" stroke="${INK}" stroke-width="10"/><line x1="960" y1="160" x2="960" y2="960" stroke="#fff" stroke-width="10"/><rect x="160" y="555" width="1600" height="10" fill="#fff"/>`;
    const u=(t-ST[5])*1.3; const px=200+Math.abs(((u*1400)%2800+2800)%2800-1400)/1400*1520, py=220+Math.abs(((u*1900)%1500)-750)/750*640;
    s+=`<g transform="translate(${px},${py}) rotate(${u*600})"><circle r="95" fill="#FFF8E8" stroke="${INK}" stroke-width="7"/>${chibi({...DEX,x:0,y:105,s:0.6,eyes:'happy',mouth:'laugh',armF:[150,40],armB:[-150,-40]})}</g>`;
    s+=bang(t,ST[5]+0.5,560,300,'PING!','#FFF07A',90,-10)+bang(t,ST[5]+1.4,1380,780,'PONG!','#FFF07A',90,10);
    s+=chipAt(t,ST[5]+0.2,960,90,'AN UNBREAKABLE PING-PONG BALL','#E8463C',50);
  } else if(t<ST[7]-0.2){ // dent close-up
    s+=bgPanel('#7ED0FF','#D6F0FF')+`<rect y="860" width="1920" height="220" fill="url(#road)"/>`;
    s+=`<defs><filter id="dentF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.25  0 0 0 0 0.6  0 0 0 0.75 0"/></filter></defs>`;
    s+=car(1060,1000,3.6,'#3D8BFF',true);
    s+=`<g filter="url(#dentF)">${chibi({x:1150,y:985,s:0.85,...DEX,armF:[150,40],armB:[-150,-40],legL:[-30,0],legR:[30,0]})}</g>`;
    s+=`<g transform="translate(1150,840)">${[0,1,2,3,4,5].map(i=>{const a=rad(i*60+20);return `<line x1="${Math.cos(a)*130}" y1="${Math.sin(a)*150}" x2="${Math.cos(a)*180}" y2="${Math.sin(a)*200}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;}).join('')}</g>`;
    s+=chipAt(t,ST[6]+0.6,1400,180,'DEX-SHAPED DENT','#E8463C',58);
  } else if(t<ST[8]-0.2){ // lands on stuff
    s+=street();
    const k=seg(t,ST[7]+0.2,ST[7]+1.2), hit=ST[7]+1.2;
    const [sx,sy]=shake(t,hit,18,0.5);
    let w='';
    if(t<hit){w+=`<g transform="translate(860,920)"><rect x="-220" y="-110" width="440" height="34" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="-220" y="-60" width="440" height="30" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="-190" y="-30" width="22" height="70" fill="#5A3A2A"/><rect x="168" y="-30" width="22" height="70" fill="#5A3A2A"/></g>`;
      w+=`<g transform="translate(${lerp(-200,860,k)},${lerp(300,760,k)}) rotate(${k*540})">${chibi({...DEX,x:0,y:110,s:0.9,eyes:'wide',mouth:'o',armF:[150,40],armB:[-150,-40]})}</g>`;}
    else{w+=`<g transform="translate(860,940)"><g transform="rotate(-24) translate(-120,0)"><rect x="-110" y="-60" width="220" height="30" rx="8" fill="#B07A4A" stroke="${INK}" stroke-width="6"/></g><g transform="rotate(26) translate(120,0)"><rect x="-110" y="-60" width="220" height="30" rx="8" fill="#B07A4A" stroke="${INK}" stroke-width="6"/></g></g>`;
      w+=chibi({x:860,y:960,s:1.0,...DEX,eyes:'happy',mouth:'smile',armF:[-20,10],armB:[20,-10]});
      w+=chipAt(t,hit+0.6,520,260,'DEX: FINE ✓','#7ED957',52)+chipAt(t,hit+1.8,1350,260,'THE BENCH: ✗','#E8463C',52)+chipAt(t,ST[7]+DU[7]-1.6,960,140,'WHATEVER HE LANDS ON ISN’T','#3D8BFF',50);}
    s+=`<g transform="translate(${sx},${sy})">${w}</g>`+bang(t,hit,1200,560,'CRUNCH!','#FFC21F',100,8,hit+1.5);
  } else {
    s+=track()+chibi({x:560,y:990,s:1.15,...DEX,eyes:'happy',mouth:'grin',armF:[115,55],armLen:1.4,handF:'peace',armB:[20,-10]});
    s+=note(t,ST[8],1300,430,'RULE 2','NOT','IMMOVABLE.');
  }
  [ST[4]-0.2,ST[5]-0.2,ST[6]-0.2,ST[7]-0.2,ST[8]-0.2].forEach(w=>s+=wipe(t,w));
  return s;
}
