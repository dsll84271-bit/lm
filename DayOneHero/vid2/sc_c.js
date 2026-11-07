function scene(t){
  let s='';
  if(t<ST[1]-0.2){ // bedroom, alarm
    s+=bgPanel('#FFE9C9','#FFD6A8');
    s+=`<rect x="1240" y="170" width="420" height="330" rx="20" fill="#9FD8FF" stroke="${INK}" stroke-width="8"/><path d="M1450,170 L1450,500 M1240,335 L1660,335" stroke="${INK}" stroke-width="7"/><circle cx="1580" cy="250" r="40" fill="#FFE07A"/>`;
    s+=`<rect y="860" width="1920" height="220" fill="#C99E73" stroke="${INK}" stroke-width="6"/>`;
    s+=`<rect x="160" y="640" width="720" height="140" rx="30" fill="#7FB3FF" stroke="${INK}" stroke-width="8"/><rect x="140" y="560" width="70" height="300" rx="20" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="180" y="610" width="220" height="80" rx="30" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="160" y="770" width="720" height="40" fill="#B07A4A" stroke="${INK}" stroke-width="6"/>`;
    const ring=t<ST[0]+1.6; const j=ring?Math.sin(t*70)*7:0;
    s+=`<rect x="980" y="700" width="200" height="160" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><g transform="translate(${1080+j},640) rotate(${j})"><circle r="56" fill="#E8463C" stroke="${INK}" stroke-width="7"/><circle r="40" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0,0 L0,-26 M0,0 L18,8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="-40" cy="-50" r="16" fill="#FFC21F" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-50" r="16" fill="#FFC21F" stroke="${INK}" stroke-width="5"/></g>`;
    if(ring) s+=bang(t,0.3,1100,500,'RING!','#E8463C',80,8);
    const up=t>ST[0]+1.4;
    s+=chibi({x:620,y:860,s:1.2,...DEX,eyes:up?'open':'closed',mouth:up?'yawn':'flat',armF:up?[160,-10]:[-20,10],armB:up?[-160,10]:[20,-10],armLen:up?1.3:1,sway:Math.sin(t*2)*2});
    s+=chipAt(t,0.6,200,110,'DAY 2','#3D8BFF',56);
  } else if(t<ST[3]-0.2){ // stairs tumble
    s+=bgPanel('#F4E3FF','#E3CCF5');
    s+=`<rect x="0" y="0" width="1920" height="1080" fill="#EBD9F7"/>`;
    let st='';for(let i=0;i<8;i++){st+=`<rect x="${240+i*150}" y="${430+i*65}" width="${1920}" height="70" fill="#B9865A" stroke="${INK}" stroke-width="6"/>`;}
    s+=st+`<rect y="950" width="1920" height="130" fill="#C99E73" stroke="${INK}" stroke-width="6"/>`;
    s+=`<rect x="0" y="420" width="250" height="660" fill="#B9865A" stroke="${INK}" stroke-width="6"/>`;
    const a=ST[1]+0.1,b=ST[1]+2.9; const k=seg(t,a,b)*8; const i=Math.min(7,Math.floor(k)), f=k-i;
    const [sx,sy]=shake(t,b,10,0.4);
    if(t<a){s+=chibi({x:200,y:430,s:0.85,...DEX,eyes:'open',mouth:'smile',armF:[-20,10],armB:[20,-10]});}
    else if(t<b){const x=230+k*150, y=430+i*65-Math.sin(f*Math.PI)*70-40; s+=`<g transform="translate(${x},${y}) rotate(${k*200})">${chibi({...DEX,x:0,y:110,s:0.75,eyes:'wide',mouth:'o',armF:[120,40],armB:[-120,-40]})}</g>`;
      for(let j=0;j<=i;j++){const tt=a+(j+0.5)*(b-a)/8; if(t>tt&&t<tt+0.5) s+=bang(t,tt,330+j*150,360+j*65,'BONK','#FFC21F',44,-10+j*5);}}
    else { const upk=seg(t,ST[2],ST[2]+0.5);
      if(upk<=0){s+=`<g transform="translate(${1520+sx},${930+sy})">${lying({...DEX,eyes:'dot',mouth:'o',armF:[60,20],armB:[-60,-20]},0,0,0.8,-80)}</g>`+stars(1440,770,t,5,70);}
      else s+=chibi({x:1500,y:950,s:0.95,...DEX,eyes:'happy',mouth:'grin',sparkle:true,armF:[115,55],armLen:1.4,handF:'peace',armB:[20,-10]});
      s+=chipAt(t,ST[2]+0.6,1200,200,'SCRATCHES: 0','#7ED957',56);}
  } else if(t<ST[4]-0.2){ // bee sting, stinger bends
    s+=bgPanel('#8FD6FF','#D6F0FF')+`<rect y="860" width="1920" height="220" fill="#86D17C" stroke="${INK}" stroke-width="5"/>`;
    s+=chibi({x:760,y:1060,s:1.6,...DEX,eyes:'open',mouth:t>ST[3]+1.6?'o':'smile',look:[12,6],armF:[60,20],armB:[20,-10]});
    const k=seg(t,ST[3]-0.1,ST[3]+1.0); const bx=lerp(1700,1050,ease(k)), by=lerp(300,610,ease(k));
    const bent=t>ST[3]+1.3;
    s+=`<g transform="translate(${bx},${by})">${bee(0,0,1.0,t,-25)}<path d="${bent?'M50,30 q20,10 10,30 q-8,14 -26,6':'M50,30 l38,22'}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`;
    if(bent){s+=bang(t,ST[3]+1.3,bx+120,by-120,'BOING','#FFC21F',70,10); if(t>ST[3]+2.0) s+=`<g transform="translate(${bx-60},${by-130}) scale(${pop(t,ST[3]+2.0,0.3)})">${txt('?',0,0,90,'#fff')}</g>`;}
  } else if(t<ST[6]-0.15){ // invincible reveal
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.55);
    s+=`<circle cx="960" cy="700" r="${330+10*Math.sin(t*4)}" fill="#7FD3FF" opacity=".16"/>`;
    s+=chibi({x:960,y:1060,s:1.55,...DEX,eyes:'open',sparkle:true,mouth:'grin',armF:[-30,10],armB:[30,-10],brow:-4});
    s+=`<g transform="translate(960,190) scale(${pop(t,ST[4]+0.3,0.4)})">${txt('INVINCIBLE',0,0,150,'#FFC21F')}</g>`;
    ['NO CUTS','NO CRUSHING','NO BURNS'].forEach((w,i)=>{s+=chipAt(t,ST[4]+1.6+i*0.7,[420,960,1500][i],360,w,'#7ED957',44,ST[5]);});
    if(t>ST[5]) s+=chipAt(t,ST[5]+0.2,420,520,'SAFEST POWER EVER?','#3D8BFF',44);
    if(t>ST[5]+3.0){const k=pop(t,ST[5]+3.0,0.25); s+=`<g transform="translate(1460,560) rotate(-10) scale(${k})"><rect x="-260" y="-90" width="520" height="180" rx="24" fill="none" stroke="#E8463C" stroke-width="16"/>${txt('WEIRDER.',0,40,110,'#E8463C')}</g>`;}
  } else if(t<ST[7]-0.1){ // hook montage
    const P=[['HIT BY A CAR','#E8463C'],['STRUCK BY LIGHTNING','#B07CFF'],['DROPPED IN LAVA','#FF8A3D'],['NO PARACHUTE','#3D8BFF']];
    const span=(ST[7]-0.1-ST[6])/4; const i=Math.max(0,Math.min(3,Math.floor((t-ST[6])/span))); const lt=Math.max(0,t-ST[6]-i*span);
    s+=bgPanel(['#FFD1C9','#E9DCFF','#FFD6A8','#CFEFFF'][i],'#ffffff');
    s+=rays(t,['#FFB9AE','#D9C6FF','#FFC48A','#A9DEFF'][i],0.5);
    const z=1+lt*0.06;
    let g='';
    if(i===0){g+=car(1300,820,1.6,'#E8463C',true)+chibi({x:700-lt*200,y:700-Math.sin(lt*3)*120,s:1.0,...DEX,eyes:'wide',mouth:'o',armF:[150,40],armB:[-150,-40],tilt:-30-lt*90});}
    if(i===1){g+=`<path d="M1000,0 L900,330 L1010,330 L880,640" fill="none" stroke="#FFF07A" stroke-width="40" stroke-linejoin="round"/><path d="M1000,0 L900,330 L1010,330 L880,640" fill="none" stroke="#fff" stroke-width="14" stroke-linejoin="round"/>`+chibi({x:880,y:1000,s:1.1,...DEX,eyes:'wide',mouth:'o',armF:[150,40],armB:[-150,-40]});}
    if(i===2){g+=`<path d="M0,820 Q480,780 960,820 T1920,820 L1920,1080 L0,1080 Z" fill="#FF6A2A" stroke="${INK}" stroke-width="6"/>`+lying({...DEX,eyes:'happy',mouth:'smile',armF:[150,20],armB:[-150,-20]},960,800,1.0,-90)+smoke(960,700,t,4,0.8);}
    if(i===3){for(let c=0;c<4;c++){const cy=((c*300-lt*900)%1300+1300)%1300-100; g+=cloud(300+c*420,cy,1.2);} g+=lying({...DEX,eyes:'happy',mouth:'laugh',armF:[100,-60],armB:[-100,60]},960,620,1.1,-90);}
    s+=`<g transform="translate(960,540) scale(${z}) translate(-960,-540)">${g}</g>`;
    s+=`<g transform="translate(960,150) scale(${pop(t,ST[6]+i*span,0.2)})">${chip(P[i][0],0,0,P[i][1],62)}</g>`;
    s+=flash(t,ST[6]+i*span,'#fff',0.2,0.7);
  } else if(t<after(7,0.15)){
    s+=bgPanel('#5DB6FF','#C9E9FF')+`<g opacity=".6">${bgFar()}</g><rect y="860" width="1920" height="220" fill="#86D17C" stroke="${INK}" stroke-width="5"/>`;
    s+=chibi({x:960,y:1080,s:1.9,...DEX,eyes:'open',mouth:'smile',look:[0,4],armF:[-20,10],armB:[20,-10],tilt:-4});
  } else { // title card
    const tt=after(7,0.15);
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.55);
    s+=`<g transform="translate(960,330) scale(${pop(t,tt,0.35)})">${txt('WHAT IF YOU WOKE UP',0,0,96,'#FFFFFF')}</g>`;
    s+=`<g transform="translate(960,520) scale(${pop(t,tt+0.35,0.4)})">${txt('INVINCIBLE?',0,0,190,'#FFC21F')}</g>`;
    s+=chipAt(t,tt+0.8,960,720,'DAY 2','#3D8BFF',64);
    s+=chibi({x:1640,y:1160,s:1.2,...DEX,eyes:'happy',mouth:'grin',sparkle:true,armF:[115,55],armLen:1.4,handF:'peace',armB:[20,-10],tilt:-8});
    s+=flash(t,tt,'#fff',0.3,0.6);
  }
  const ws=[ST[1]-0.2,ST[3]-0.2,ST[4]-0.2,ST[7]-0.1]; ws.forEach(w=>s+=wipe(t,w));
  return s;
}
