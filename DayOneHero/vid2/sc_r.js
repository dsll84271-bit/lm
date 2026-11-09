function brick(x,y,r){return `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-44" y="-20" width="88" height="40" rx="6" fill="#C8573E" stroke="${INK}" stroke-width="5"/></g>`;}
function scaffold(){let g='';for(let i=0;i<5;i++) g+=`<rect x="${1060+i*170}" y="180" width="18" height="760" fill="#8C93B8" stroke="${INK}" stroke-width="4"/>`;
  for(let j=0;j<4;j++) g+=`<rect x="1040" y="${260+j*190}" width="720" height="22" fill="#C9A06A" stroke="${INK}" stroke-width="4"/>`;
  g+=`<rect x="1100" y="120" width="620" height="140" fill="#E6E1F0" stroke="${INK}" stroke-width="6" opacity=".6"/><g transform="translate(1600,820)"><path d="M0,-90 L80,60 L-80,60 Z" fill="#FFC21F" stroke="${INK}" stroke-width="6"/><text y="40" text-anchor="middle" font-family="Lilita One" font-size="70" fill="${INK}">!</text></g>`;return g;}
function scene(t){
  let s='';
  if(t<ST[5]-0.2){
    s+=bgPanel('#8FD6FF','#D6F0FF')+`<g opacity=".7">${bgFar()}</g><rect y="900" width="1920" height="180" fill="#E6E1F0" stroke="${INK}" stroke-width="5"/>`+scaffold();
    const slip=ST[1]+3.0, run0=ST[3]+0.2, push=ST[3]+1.4, hit=after(3,0.2), getup=ST[4]+1.8;
    // kid
    let kx=t<ST[1]?-200:lerp(-200,1050,seg(t,ST[1],ST[1]+2.8)); if(t>push) kx=lerp(1050,1400,ease(seg(t,push,push+0.8)));
    const kph=t*7, walking=(t>ST[1]&&t<ST[1]+2.8);
    s+=chibi({x:kx,y:920,s:0.72,type:'jacket',top:'#7ED957',hair:'cap',pants:'#3D5AFE',eyes:t>getup?'wide':(t>push?'dot':'happy'),mouth:t>getup+1.0?'grin':(t>push?'o':'smile'),look:[t>push?-10:8,0],legL:walking?[Math.sin(kph)*18,0]:[0,0],legR:walking?[-Math.sin(kph)*18,0]:[0,0],tilt:t>push&&t<push+0.8?15:0});
    // bricks
    const bricks=[[-60,0],[30,0],[-15,-40],[75,-40],[-105,-40],[30,-80]];
    const fallK= t<slip?0 : t<ST[2]? seg(t,slip,slip+1.2)*0.35 : t<ST[3]? 0.35+seg(t,ST[2],ST[3])*0.08 : 0.43+seg(t,ST[3],hit)*0.57;
    const down=t>=hit&&t<getup;
    if(!down&&t<getup){bricks.forEach(([bx,by],i)=>{const y0=270+by, y1=820+by*0.3; s+=brick(1100+bx+Math.sin(i)*fallK*40,lerp(y0,y1,fallK*fallK*(t>ST[3]?1:1)),fallK*(i%2?120:-90));});}
    if(t<slip+0.2) s+=`<g transform="translate(1100,282) rotate(${-14*seg(t,slip-0.6,slip)})"><rect x="-140" y="-10" width="280" height="20" fill="#B07A4A" stroke="${INK}" stroke-width="4"/></g>`;
    // Dex
    if(t<run0){const worried=t>slip; s+=chibi({x:420,y:930,s:1.05,...DEX,eyes:worried?'wide':'open',mouth:worried?'o':'smile',sweat:worried,look:[10,-6],armF:[-20,10],armB:[20,-10]});}
    else if(t<hit){const k=seg(t,run0,push); s+=chibiSide({x:lerp(420,1000,k),y:930,s:1.05,phase:(t*3)%1,t,expr:'determined',lean:20,wind:1}); if(t>push) s+=bang(t,push,1180,700,'GENTLE PUSH','#7ED957',54,-6,push+1.2);}
    else if(t<getup){s+=`<g>${lying({...DEX,eyes:'dot',mouth:'o',armF:[150,30],armB:[-150,-30]},1100,925,1.0,-90)}</g>`;
      [[1000,830],[1090,840],[1180,830],[1050,790],[1140,790],[1100,755]].forEach(([bx,by],i)=>s+=brick(bx,by,(i*37)%30-15));
      s+=stars(1100,700,t,5,90);
      const dk=seg(t,hit,hit+1.2); s+=`<g opacity="${1-dk}">${[0,1,2,3,4].map(i=>`<circle cx="${1100+(i-2)*90*(0.5+dk)}" cy="${880-dk*60}" r="${60+dk*50}" fill="#C9B9A6"/>`).join('')}</g>`;
      s+=bang(t,hit,1300,560,'BONK BONK BONK','#FFC21F',70,-6,hit+1.6);}
    else {s+=chibi({x:1080,y:930,s:1.05,...DEX,eyes:'happy',mouth:'grin',sparkle:true,armF:[115,55],armLen:1.4,handF:'peace',armB:[20,-10]});
      [[880,880],[960,890],[1260,885],[1320,870],[800,890],[1200,890]].forEach(([bx,by],i)=>s+=brick(bx,by,(i*53)%50-25));
      s+=chipAt(t,getup+0.4,700,200,'NOT A SCRATCH','#7ED957',54);}
    if(t>=ST[2]&&t<ST[3]){s+=chipAt(t,ST[2]+0.2,960,110,'SLOW-MO','#3D8BFF',46)+chipAt(t,ST[2]+0.8,520,260,'CATCH THEM? ✗','#E8463C',46)+chipAt(t,ST[2]+1.8,520,360,'STOP THEM? ✗','#E8463C',46)+chipAt(t,ST[2]+3.2,520,460,'DOESN’T NEED TO','#7ED957',46);
      s+=`<rect width="1920" height="1080" fill="#7FD3FF" opacity=".12"/>`;}
    const [sx,sy]=shake(t,hit,16,0.5); if(sx) s=`<g transform="translate(${sx},${sy})">${s}</g>`;
  } else {
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.5);
    s+=chibi({x:860,y:1060,s:1.5,...DEX,eyes:'open',sparkle:true,mouth:'smile',armF:[-30,10],armB:[30,-10]});
    s+=chibi({x:1260,y:1060,s:0.95,type:'jacket',top:'#7ED957',hair:'cap',pants:'#3D5AFE',eyes:'happy',mouth:'grin',armF:[160,-20],armLen:1.3,armB:[20,-10],look:[-10,0]});
    s+=`<g transform="translate(960,170) scale(${pop(t,ST[5]+1.6,0.35)})">${txt('THE REAL POWER:',0,0,70,'#FFFFFF')}${txt('STANDING IN THE WAY',0,100,96,'#FFC21F')}</g>`;
  }
  s+=wipe(t,ST[5]-0.2);
  return s;
}
