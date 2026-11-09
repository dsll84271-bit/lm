function lavaLake(y,t,c1='#FF6A2A',c2='#FFB23D',bub=4){let p=`M0,${y}`;for(let x=0;x<=1920;x+=60)p+=` L${x},${y+Math.sin(x*0.01+t*2)*10}`;p+=` L1920,1080 L0,1080 Z`;
  let g=`<defs><linearGradient id="lv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><path d="${p}" fill="url(#lv)" stroke="${INK}" stroke-width="6"/>`;
  for(let i=0;i<bub;i++){const ph=((t*0.6+i*0.37)%1); g+=`<circle cx="${(i*523)%1900}" cy="${y+60+((i*137)%200)}" r="${8+ph*26}" fill="none" stroke="#FFE07A" stroke-width="5" opacity="${1-ph}"/>`;}
  return g;}
function volcanoBg(dark){let s=bgPanel(dark?'#3B1E3F':'#FF8A5B',dark?'#7A2E3A':'#FFD3A3');
  s+=`<path d="M-100,700 L380,260 L520,260 L1000,700 Z" fill="${dark?'#2A1A2E':'#6E3B3B'}" stroke="${INK}" stroke-width="7"/><path d="M900,700 L1400,330 L1520,330 L2100,700 Z" fill="${dark?'#33203A':'#7E4646'}" stroke="${INK}" stroke-width="7"/>`;
  s+=smoke(450,250,0,0)+`<circle cx="1600" cy="160" r="70" fill="#FFE07A" opacity="${dark?0.3:0.8}"/>`;return s;}
function duck(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="44" fill="#FFD21F" stroke="${INK}" stroke-width="6"/><circle cx="40" cy="-50" r="34" fill="#FFD21F" stroke="${INK}" stroke-width="6"/><path d="M70,-50 l34,6 l-34,10 Z" fill="#FF8A3D" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="-58" r="6" fill="${INK}"/></g>`;}
function scene(t){
  let s='';
  const jump=after(0,0.2), land=jump+1.0;
  if(t<ST[3]-0.2){
    s+=volcanoBg(false)+lavaLake(720,t,'#FF5A1F','#FFB23D',6);
    s+=`<path d="M0,620 L460,640 L520,1080 L0,1080 Z" fill="#4A3A4E" stroke="${INK}" stroke-width="7"/>`;
    const bob=Math.sin(t*2.4)*8;
    if(t<jump){s+=chibi({x:330,y:630,s:1.1,...DEX,eyes:'open',sparkle:true,mouth:'grin',armF:[-20,10],armB:[20,-10],acc:'glasses'});}
    else if(t<land){const k=seg(t,jump,land); s+=`<g transform="translate(${lerp(330,960,k)},${lerp(520,700,k)-Math.sin(k*Math.PI)*300}) rotate(${-90*k})">${chibi({...DEX,x:0,y:110,s:1.0,eyes:'happy',mouth:'laugh',armF:[150,30],armB:[-150,-30],acc:'glasses'})}</g>`;}
    else {s+=lying({...DEX,eyes:t>ST[1]&&t<ST[2]?'wide':'happy',mouth:t>ST[1]&&t<ST[2]?'o':'smile',armF:[-150,40],armB:[150,-40],acc:'glasses'},940,720+bob,1.0,-90)+smoke(900,660,t,3,0.6,'#8C8696');
      s+=bang(t,land,980,500,'PLOP?','#FFF07A',90,-6,land+1.4);}
    s+=chipAt(t,ST[0]+2.4,1450,140,'LAVA: 1,000+ °C','#E8463C',54,ST[1]);
    if(t>ST[1]&&t<ST[2]){const k=ease(seg(t,ST[1]+2.6,ST[1]+4.0));
      s+=`<g transform="translate(1480,380) scale(${pop(t,ST[1]+2.2,0.35)})"><rect x="-330" y="-230" width="660" height="400" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/><text y="-170" text-anchor="middle" font-family="Lilita One" font-size="42" fill="${INK}">DENSITY (× WATER)</text>
        ${[['LAVA',2.6,'#FF6A2A'],['WATER',1.0,'#3D8BFF'],['DEX',1.0,'#FFC21F']].map(([n,v,c],i)=>`<text x="-300" y="${-90+i*100}" font-family="Lilita One" font-size="40" fill="${INK}">${n}</text><rect x="-120" y="${-125+i*100}" width="${160*v*k}" height="50" rx="12" fill="${c}" stroke="${INK}" stroke-width="5"/><text x="${-100+160*v*k+20}" y="${-87+i*100}" font-family="Lilita One" font-size="38" fill="${INK}">${(v*k).toFixed(1)}</text>`).join('')}</g>`;
      s+=chipAt(t,ST[1]+5.4,700,140,'AS THICK AS KETCHUP','#FF8A3D',48);}
    if(t>=ST[2]-0.1){s+=duck(1180,700+Math.sin(t*2.4+1)*8,0.9); s+=chipAt(t,ST[2]+3.2,960,150,'A RUBBER DUCK IN A VERY HOT BATH','#FFC21F',48);}
  } else if(t<ST[4]-0.2){ // Hawaii gas-rich lake
    s+=volcanoBg(true)+lavaLake(700,t,'#E8463C','#FF9A3D',18);
    const sink=ease(seg(t,ST[3]+5.6,ST[3]+8.8));
    s+=`<g transform="translate(960,${700+sink*170})">${lying({...DEX,eyes:sink>0.2?'wide':'open',mouth:sink>0.2?'o':'smile',armF:[150,40],armB:[-150,-40],sweat:sink>0.2},0,0,1.0,-90)}</g>`;
    s+=lavaLake(760,t+1.3,'#E8463C','#FF9A3D',0).replace('id="lv"','id="lv2"').replace('url(#lv)','url(#lv2)').replace('stroke-width="6"','stroke-width="4" opacity=".92"');
    for(let i=0;i<10;i++){const ph=((t*0.9+i*0.13)%1);s+=`<circle cx="${720+i*55}" cy="${760-ph*160}" r="${10+i%3*5}" fill="none" stroke="#FFE07A" stroke-width="5" opacity="${1-ph}"/>`;}
    s+=chipAt(t,ST[3]+0.8,960,130,'HAWAII LAVA LAKE (2011)','#B07CFF',52);
    s+=chipAt(t,ST[3]+3.0,960,240,'SO MANY GAS BUBBLES: LIGHTER THAN WATER','#E8463C',44);
    if(sink>0.3) s+=bang(t,ST[3]+7.4,1240,520,'GLUG','#FFF07A',80,8);
  } else { // sunbathing + rule
    s+=volcanoBg(false)+lavaLake(760,t,'#FF5A1F','#FFB23D',5);
    s+=lying({...DEX,eyes:'happy',mouth:'smile',armF:[-160,60],armB:[160,-60],acc:'glasses'},560,760+Math.sin(t*2.4)*6,1.0,-90);
    s+=`<g transform="translate(760,760)"><path d="M0,0 L0,-260" stroke="${INK}" stroke-width="10"/><path d="M-170,-250 Q0,-380 170,-250 Z" fill="#7ED957" stroke="${INK}" stroke-width="7"/></g>`;
    s+=note(t,ST[4],1350,390,'RULE 4','YOU CAN’T SWIM','IN LAVA. (MOSTLY)');
  }
  s+=wipe(t,ST[3]-0.2)+wipe(t,ST[4]-0.2);
  return s;
}
