function scene(t){
  let s='';
  const strike=ST[1]+1.0, burnt=t>strike;
  if(t<ST[3]-0.2){
    const dk=seg(t,ST[1]-0.4,ST[1]+0.6);
    s+=bgPanel(burnt||dk>0.5?'#4A4E6E':'#8FD6FF',burnt||dk>0.5?'#8A8FAE':'#D6F0FF');
    for(let i=0;i<5;i++) s+=`<g opacity="${dk}">${cloud(200+i*380,120+(i%2)*40,1.6).replace('fill="#fff"','fill="#6E7290"')}</g>`;
    s+=`<rect y="860" width="1920" height="220" fill="${dk>0.5?'#5E9E62':'#86D17C'}" stroke="${INK}" stroke-width="5"/>`;
    const o={...DEX,eyes:'open',mouth:'smile',armF:[-20,10],armB:[20,-10]};
    if(burnt){Object.assign(o,{eyes:t<ST[2]?'dot':'happy',mouth:t<ST[2]?'o':'grin'});}
    s+=`<defs><filter id="soot" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.42 0.06 0.02 0 0  0.04 0.4 0.04 0 0  0.04 0.04 0.4 0 0.02  0 0 0 1 0"/></filter></defs>`;
    s+=burnt?`<g filter="url(#soot)">${chibi({x:960,y:900,s:1.35,...o})}</g>`:chibi({x:960,y:900,s:1.35,...o});
    if(burnt) s+=smoke(1060,660,t,5,0.8,'#7A7690')+`<path d="M900,700 l20,-10 M1010,760 l14,8" stroke="#FF8A3D" stroke-width="6"/>`;
    if(t>=strike&&t<strike+0.5){s+=`<path d="M1020,0 L900,260 L1030,280 L930,560" fill="none" stroke="#FFF07A" stroke-width="44" stroke-linejoin="round"/><path d="M1020,0 L900,260 L1030,280 L930,560" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/>`;}
    s+=flash(t,strike,'#fff',0.45,0.95)+bang(t,strike+0.1,1300,380,'KRAKOOM!','#FFF07A',110,-8,strike+1.4);
    if(t<ST[1]){s+=chipAt(t,ST[0]+0.6,560,200,'DEX: INVINCIBLE ✓','#7ED957',50); s+=chipAt(t,ST[0]+2.0,1380,200,'HIS CLOTHES: ✗','#E8463C',50);}
    else if(t<ST[2]){s+=chipAt(t,ST[1]+2.4,500,220,'≈ 30,000 °C','#E8463C',58); s+=chipAt(t,ST[1]+5.0,1400,220,'≈ 5× THE SUN’S SURFACE','#FF8A3D',50);}
    else {s+=chipAt(t,ST[2]+0.3,520,220,'DEX: FINE ✓','#7ED957',52); s+=chipAt(t,ST[2]+1.4,1400,220,'HOODIE: TOAST','#3E3A44',52);}
  } else if(t<ST[4]-0.2){ // washing line
    s+=bgPanel('#FFF6E0','#FFE7B8')+`<rect y="900" width="1920" height="180" fill="#86D17C" stroke="${INK}" stroke-width="5"/>`;
    s+=`<rect x="150" y="260" width="20" height="660" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><rect x="1750" y="260" width="20" height="660" fill="#8C93B8" stroke="${INK}" stroke-width="5"/><path d="M160,300 Q960,380 1760,300" fill="none" stroke="${INK}" stroke-width="5"/>`;
    [['LAVA',540],['CRASH TEST',960],['LIGHTNING',1380]].forEach(([l,x],i)=>{const a=ST[3]+0.3+i*1.1; if(t<a) return; s+=`<g transform="translate(${x},${470}) scale(${pop(t,a,0.3)})">${hoodieOnly(0,0,1.25,i===1?'#9A7A2A':'#3E3A44',Math.sin(t*2+i)*3)}${smoke(0,-80,t+i,3,0.5,'#8C8696')}</g>${chipAt(t,a+0.2,x,700,l,'#E8463C',40)}`;});
    s+=chipAt(t,ST[3]+DU[3]-1.4,960,140,'1 ADVENTURE = 1 HOODIE','#3D8BFF',52);
  } else {
    s+=bgPanel('#FFD7E2','#FFF0F4');
    s+=`<g transform="translate(560,560)"><rect x="-300" y="-380" width="600" height="760" rx="20" fill="#B07A4A" stroke="${INK}" stroke-width="8"/><rect x="-270" y="-350" width="540" height="700" fill="#5A3A2A"/><path d="M-260,-300 L260,-300" stroke="#C9C2DA" stroke-width="8"/>${[0,1,2,3,4].map(i=>hoodieOnly(-200+i*100,-150,0.55,'#FFC21F',(i-2)*3)).join('')}${[0,1,2,3,4].map(i=>hoodieOnly(-200+i*100,140,0.55,'#FFC21F',(i-2)*-3)).join('')}</g>`;
    s+=chibi({x:1080,y:980,s:1.2,...DEX,eyes:'happy',mouth:'grin',sparkle:true,armF:[115,55],armLen:1.4,handF:'peace',armB:[20,-10]});
    s+=note(t,ST[4],1500,380,'RULE 4½','PACK SPARE','HOODIES.');
  }
  s+=wipe(t,ST[3]-0.2)+wipe(t,ST[4]-0.2);
  return s;
}
