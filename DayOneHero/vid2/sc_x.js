function earth(cx,cy,r){return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#6E4A3A" stroke="${INK}" stroke-width="8"/><circle cx="${cx}" cy="${cy}" r="${r*0.94}" fill="#E8693C"/><circle cx="${cx}" cy="${cy}" r="${r*0.55}" fill="#FFB23D" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${r*0.2}" fill="#FFF3B0" stroke="${INK}" stroke-width="5"/><path d="M${cx-r*0.7},${cy-r*0.72} A${r},${r} 0 0 1 ${cx+r*0.7},${cy-r*0.72}" fill="none" stroke="#7ED957" stroke-width="16"/></g>`;}
function scene(t){
  let s='';
  if(t<ST[3]-0.2||(t>=ST[4]-0.2&&t<ST[5]-0.2)){
    s+=bgPanel('#14162A','#2A3D8F');
    for(let i=0;i<40;i++) s+=`<circle cx="${(i*487)%1920}" cy="${(i*263)%1080}" r="${1+i%3}" fill="#fff" opacity=".6"/>`;
    const hole=t>=ST[4]-0.2;
    s+=earth(hole?620:960,600,hole?430:440);
    if(!hole){
      s+=chibi({x:960,y:170,s:0.32,...DEX,eyes:'open',mouth:'smile',armF:[-20,10],armB:[20,-10]});
      s+=chipAt(t,ST[0]+0.4,960,60,'TO THE CENTRE OF THE EARTH?','#3D8BFF',52);
      if(t>ST[1]){s+=`<path d="M1050,600 L1400,420" stroke="#fff" stroke-width="5"/>`+chipAt(t,ST[1]+1.6,1560,400,'5,000+ °C ≈ SUN’S SURFACE','#E8463C',42)+chipAt(t,ST[1]+4.4,1560,500,'3 MILLION+ × AIR PRESSURE','#B07CFF',42);}
      if(t>ST[2]){s+=`<g transform="translate(960,600) scale(${pop(t,ST[2]+0.3,0.3)})">${chibi({x:0,y:40,s:0.3,...DEX,eyes:'happy',mouth:'grin',armF:[115,55],armLen:1.4,handF:'peace',armB:[20,-10]})}</g>`;
        if(t>ST[2]+2.2){const k=seg(t,ST[2]+2.2,ST[2]+3.4); s+=`<path d="M960,190 L960,${190+k*330}" stroke="#fff" stroke-width="8" stroke-dasharray="20 14"/>${t>ST[2]+3.4?`<g transform="translate(1040,380) scale(${pop(t,ST[2]+3.4,0.3)})">${txt('?',0,0,100,'#FFC21F')}</g>`:''}`;}}
    } else {
      const k=ease(seg(t,ST[4]+0.6,ST[4]+2.0));
      s+=`<path d="M620,170 L620,${170+k*3}" stroke="#fff" stroke-width="6"/><circle cx="620" cy="172" r="${30}" fill="none" stroke="#FFF07A" stroke-width="5"/>`;
      s+=`<g transform="translate(1440,300)"><rect x="-60" y="0" width="120" height="640" rx="16" fill="#E8693C" stroke="${INK}" stroke-width="7"/><rect x="-60" y="0" width="120" height="${Math.max(2,640*0.0019)+4}" fill="#FFF07A" stroke="${INK}" stroke-width="3"/>
        <text x="90" y="20" font-family="Lilita One" font-size="40" fill="#fff">SURFACE</text><text x="90" y="640" font-family="Lilita One" font-size="40" fill="#fff">CENTRE · 6,371 km</text></g>`;
      s+=chipAt(t,ST[4]+1.0,1440,180,'DEEPEST HOLE EVER: ≈ 12 km','#FFC21F',44)+chipAt(t,ST[4]+4.2,1500,700,'≈ 0.2% OF THE WAY','#E8463C',48);
    }
  } else if(t<ST[4]-0.2){ // digging
    s+=bgPanel('#8FD6FF','#D6F0FF')+`<rect y="760" width="1920" height="320" fill="#8E6A4A" stroke="${INK}" stroke-width="6"/><rect y="760" width="1920" height="50" fill="#86D17C" stroke="${INK}" stroke-width="5"/>`;
    const dig=Math.max(0,Math.sin((t-ST[3])*5)); const bent=t>ST[3]+2.6;
    s+=chibi({x:860,y:790,s:1.25,...DEX,eyes:bent?'dot':'closed',mouth:bent?'o':'flat',brow:bent?0:8,sweat:true,armF:[60+dig*30,10],armB:[50+dig*30,10]});
    s+=`<g transform="translate(1040,${560+dig*60}) rotate(${20+dig*10})"><rect x="-10" y="-200" width="20" height="260" fill="#B07A4A" stroke="${INK}" stroke-width="5"/><path d="${bent?'M-50,60 Q0,40 40,110 L-30,120 Z':'M-50,60 L50,60 L40,150 L-40,150 Z'}" fill="#C9D2E6" stroke="${INK}" stroke-width="6"/></g>`;
    if(bent) s+=bang(t,ST[3]+2.6,1120,520,'BOINK','#FFC21F',80,8,ST[3]+4.0);
    s+=note(t,ST[3]+0.6,1520,250,'RULE 3','NOT','STRONG.',4);
  } else {
    s+=bgPanel('#14162A','#2A3D8F')+earth(960,600,440);
    s+=`<g transform="translate(960,600)">${chibi({x:0,y:40,s:0.3,...DEX,eyes:'wide',mouth:'o',sweat:true,armF:[-20,10],armB:[20,-10]})}</g>`;
    s+=note(t,ST[5]+0.2,1440,330,'RULE 5','THERE’S','NO AIR.',4);
  }
  [ST[3]-0.2,ST[4]-0.2,ST[5]-0.2].forEach(w=>s+=wipe(t,w));
  return s;
}
