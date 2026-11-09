function miniNote(t,a,x,y,txt1,rot){const k=pop(t,a,0.3);return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})"><rect x="-150" y="-80" width="300" height="160" fill="#FFF07A" stroke="${INK}" stroke-width="6"/><text y="-20" text-anchor="middle" font-family="Lilita One" font-size="30" fill="#E8463C">${txt1[0]}</text><text y="30" text-anchor="middle" font-family="Lilita One" font-size="34" fill="${INK}">${txt1[1]}</text></g>`;}
function scene(t){
  let s='';
  if(t<ST[2]-0.2){
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.45);
    if(t<ST[1]-0.2){
      s+=`<g transform="translate(960,200) scale(${pop(t,ST[0]+0.2,0.4)})">${txt('WOULD YOU SURVIVE',0,0,92,'#FFFFFF')}${txt('DAY TWO?',0,110,120,'#FFC21F')}</g>`;
      const yes=t>ST[0]+2.6;
      s+=chibi({x:960,y:1060,s:1.45,...DEX,eyes:yes?'happy':'open',mouth:yes?'laugh':'smile',sparkle:yes,armF:yes?[160,-20]:[-20,10],armB:yes?[-160,20]:[20,-10],armLen:yes?1.3:1,bob:yes?-Math.abs(Math.sin(t*6))*14:0});
      if(yes){const k=pop(t,ST[0]+2.6,0.25); s+=`<g transform="translate(1480,580) rotate(-10) scale(${k})"><rect x="-180" y="-90" width="360" height="180" rx="24" fill="none" stroke="#7ED957" stroke-width="16"/>${txt('YES.',0,40,120,'#7ED957')}</g>`;}
      s+=chipAt(t,ST[0]+5.2,420,560,'BEST SURVIVAL POWER','#7ED957',44);
    } else {
      s+=chipAt(t,ST[1]+0.2,960,110,'BUT IT’S A TRAP','#E8463C',62);
      const N=[['RULE 1','NO HAIRCUTS'],['RULE 2','NOT IMMOVABLE'],['RULE 3','NOT STRONG'],['RULE 4','LAVA: YOU FLOAT'],['RULE 5','STILL NEED AIR']];
      const A=[ST[1]+0.9,ST[1]+2.6,ST[1]+1.8,ST[1]+3.4,ST[1]+4.4];
      N.forEach((n,i)=>s+=miniNote(t,A[i],[340,720,1100,1480,910][i],[380,330,380,330,620][i],n,[-5,4,-3,5,-2][i]));
      if(t>ST[1]+6.4){s+=`<rect width="1920" height="1080" fill="#000" opacity="${0.45*seg(t,ST[1]+6.4,ST[1]+6.8)}"/>`;s+=`<g transform="translate(960,860) scale(${pop(t,ST[1]+6.6,0.35)})">${chip('MOST DANGEROUS: THINKING YOU’RE UNSTOPPABLE',0,0,'#E8463C',50)}</g>`;}
    }
  } else if(t<ST[3]-0.2){
    s+=bgPanel('#FFF6E0','#FFE7B8');
    s+=`<g transform="translate(960,360) scale(${pop(t,ST[2]+0.2,0.4)})">${txt('UNBREAKABLE',0,-60,130,'#3D8BFF')}${txt('≠',0,50,110,'#FFFFFF')}${txt('UNSTOPPABLE',0,170,130,'#E8463C')}</g>`;
    s+=chibi({x:1640,y:1080,s:1.15,...DEX,eyes:'open',mouth:'smile',armF:[-20,10],armB:[20,-10],tilt:-6});
  } else if(t<ST[4]-0.1){
    if(t<after(3,0.1)){
      s+=bgPanel('#FFD7E2','#FFF0F4');
      s+=`<g transform="translate(960,420) scale(${pop(t,ST[3]+0.2,0.35)})"><rect x="-560" y="-170" width="1120" height="300" rx="50" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M-360,128 L-400,230 L-260,128 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-300" y="124" width="80" height="14" fill="#fff"/>${txt('WHICH RULE SURPRISED',0,-50,72,INK,'middle',0)}${txt('YOU THE MOST?',0,50,84,'#E8463C','middle',0)}</g>`;
      s+=chibi({x:1500,y:1060,s:1.2,...DEX,eyes:'open',mouth:'smile',armF:[115,55],armLen:1.3,handF:'point',armB:[20,-10]});
      s+=chipAt(t,ST[3]+1.6,560,860,'TELL ME IN THE COMMENTS','#3D8BFF',50);
    } else {
      s+=`<rect width="1920" height="1080" fill="#0B0C16"/>`;
      const a=after(3,0.15), k=pop(t,a,0.3), sh=(1-seg(t,a,a+0.5))*12;
      s+=`<g transform="translate(${960+Math.sin(t*80)*sh},540) scale(${k})">${txt('DAY 3:',0,-70,110,'#FFFFFF')}${txt('???',0,100,200,'#FFC21F')}</g>`;
    }
  } else { // end card
    s+=bgPanel('#2A3D8F','#1B2A6B')+rays(t,'#34489E',0.4);
    s+=`<g transform="translate(960,130) scale(${pop(t,ST[4]+0.2,0.35)})">${txt('NEXT: DAY 3 — A POWER YOU PICKED',0,0,70,'#FFC21F')}</g>`;
    s+=`<rect x="200" y="260" width="900" height="506" rx="26" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/>`;
    s+=`<circle cx="1440" cy="513" r="190" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/>`;
    s+=`<g transform="translate(1440,780)">${chip('SUBSCRIBE',0,0,'#E8463C',54)}</g>`;
    const pk=ease(seg(t,ST[4]+0.6,ST[4]+1.4));
    s+=chibi({x:1730,y:lerp(1500,1240,pk),s:1.2,...DEX,eyes:'happy',mouth:'grin',sparkle:true,armF:[150,-30],armLen:1.3,handF:'point',armB:[20,-10],tilt:-10+Math.sin(t*2)*3});
    // easter egg: red hood peeks from behind the subscribe circle for a moment
    const pe=seg(t,ST[4]+12,ST[4]+12.6)*(1-seg(t,ST[4]+14.2,ST[4]+14.8));
    if(pe>0) s+=`<g opacity="${pe}">${mystery(1650,720+80*(1-pe),0.55,pe)}</g><circle cx="1440" cy="513" r="190" fill="#14162A" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="26 18" opacity=".85"/>`;
  }
  [ST[1]-0.2,ST[2]-0.2,ST[3]-0.2,ST[4]-0.1].forEach(w=>s+=wipe(t,w));
  return s;
}
