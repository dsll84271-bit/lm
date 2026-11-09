const STONE=`<defs><filter id="stone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0.05  0.33 0.33 0.33 0 0.05  0.33 0.33 0.33 0 0.07  0 0 0 1 0"/></filter></defs>`;
function scissors(x,y,s,open,broken,t){
  if(broken){const k=seg(t,broken,broken+0.8);
    return `<g transform="translate(${x-120*k},${y-140*k+260*k*k}) rotate(${-200*k})"><path d="M0,0 L120,-14 L120,0 Z" fill="#C9D2E6" stroke="${INK}" stroke-width="5"/><circle cx="-22" cy="6" r="18" fill="none" stroke="#E8463C" stroke-width="8"/></g>
      <g transform="translate(${x+140*k},${y-100*k+260*k*k}) rotate(${260*k})"><path d="M0,0 L120,14 L120,0 Z" fill="#C9D2E6" stroke="${INK}" stroke-width="5"/><circle cx="-22" cy="-6" r="18" fill="none" stroke="#E8463C" stroke-width="8"/></g>`;}
  const a=open*18;
  return `<g transform="translate(${x},${y}) scale(${s})"><g transform="rotate(${-a})"><path d="M0,0 L130,-10 L130,4 Z" fill="#C9D2E6" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="10" r="20" fill="none" stroke="#E8463C" stroke-width="9"/></g><g transform="rotate(${a})"><path d="M0,0 L130,10 L130,-4 Z" fill="#C9D2E6" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="-10" r="20" fill="none" stroke="#E8463C" stroke-width="9"/></g><circle r="7" fill="${INK}"/></g>`;}
function longHair(x,y,s,len){if(len<=0)return '';const top=y-185*s;let g='';[-1,1].forEach(d=>{g+=`<path d="M${x+d*50*s},${top} C${x+d*105*s},${top+len*0.35} ${x+d*80*s},${top+len*0.7} ${x+d*110*s},${top+len} Q${x+d*80*s},${top+len+20} ${x+d*58*s},${top+len-6} C${x+d*48*s},${top+len*0.6} ${x+d*62*s},${top+len*0.3} ${x+d*40*s},${top}Z" fill="#1F2140" stroke="${INK}" stroke-width="5"/>`;});return g;}
function scene(t){
  let s=STONE;
  if(t<ST[3]-0.2){ // statue problem
    s+=bgPanel('#E9E4F2','#D3CCE3');
    s+=`<rect x="680" y="900" width="560" height="120" rx="12" fill="#B9B3C9" stroke="${INK}" stroke-width="7"/><rect x="640" y="1010" width="640" height="70" fill="#A39DB5" stroke="${INK}" stroke-width="7"/>`;
    const stone=t>ST[1]-0.3&&t<ST[2]+0.2;
    const d=chibi({x:960,y:905,s:1.45,...DEX,eyes:stone?'open':'open',mouth:stone?'flat':'smile',armF:[-20,10],armB:[20,-10],sway:stone?0:Math.sin(t*2)*2});
    s+=stone?`<g filter="url(#stone)">${d}</g><path d="M900,520 l20,40 l-14,30 M1010,700 l-24,30" stroke="#6E6880" stroke-width="5" fill="none"/>`:d;
    s+=`<g transform="translate(960,150) scale(${pop(t,ST[0]+0.3,0.35)})">${chip('WHAT DOES INVINCIBLE MEAN?',0,0,'#3D8BFF',54)}</g>`;
    if(stone){['CAN’T BEND','CAN’T BLINK','CAN’T BREATHE'].forEach((w,i)=>{s+=chipAt(t,ST[1]+1.6+i*1.2,[420,1500,420][i],[420,520,620][i],w+' ✗','#E8463C',44);});
      s+=chipAt(t,ST[1]+5.6,1500,700,'= A STATUE','#6E6880',52);}
    if(t>ST[2]+0.2){s+=chipAt(t,ST[2]+0.3,430,450,'MOVES NORMALLY ✓','#7ED957',46); s+=chipAt(t,ST[2]+1.4,1490,450,'CAN’T BE DAMAGED ✓','#7ED957',46);}
  } else if(t<ST[5]-0.2){ // barber
    s+=bgPanel('#D7F0FF','#B9E2F5');
    s+=`<g>${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${i*200}" y="0" width="100" height="1080" fill="#C9EBFA"/>`).join('')}</g>`;
    s+=`<rect x="220" y="120" width="520" height="560" rx="30" fill="#E9F7FF" stroke="${INK}" stroke-width="8"/><rect x="250" y="150" width="460" height="500" rx="20" fill="#BFE6FF"/><path d="M300,200 l120,-30 M300,260 l200,-60" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>`;
    s+=`<rect x="1630" y="140" width="70" height="320" rx="35" fill="#fff" stroke="${INK}" stroke-width="6"/>${[0,1,2,3].map(i=>`<path d="M1632,${180+i*70} L1698,${150+i*70}" stroke="#E8463C" stroke-width="18"/>`).join('')}`;
    s+=`<rect y="930" width="1920" height="150" fill="#EDE6D8" stroke="${INK}" stroke-width="6"/>`;
    s+=`<rect x="820" y="760" width="300" height="60" rx="20" fill="#2E3150" stroke="${INK}" stroke-width="7"/><rect x="940" y="820" width="60" height="110" fill="#8C93B8" stroke="${INK}" stroke-width="6"/><rect x="860" y="910" width="220" height="30" rx="12" fill="#8C93B8" stroke="${INK}" stroke-width="6"/>`;
    const snapT=ST[4]+1.0, snapped=t>snapT;
    s+=chibi({x:970,y:900,s:1.15,...DEX,eyes:snapped?'happy':'open',mouth:snapped?'grin':'smile',armF:[-20,10],armB:[20,-10]});
    s+=chibi({x:1360,y:960,s:1.15,type:'jacket',top:'#FFFFFF',hair:'short',hairCol:'#5A3A2A',pants:'#3D3F66',eyes:snapped?'wide':'happy',mouth:snapped?'o':'smile',armF:[150,-20],armLen:1.3,armB:[20,-10],acc:'glasses'});
    const cut=t>ST[3]+DU[3]&&!snapped; const open=cut?Math.abs(Math.sin(t*8)):0.6;
    s+=snapped?scissors(1130,560,1,0,snapT,t):scissors(1150,560,1,open,0,t);
    if(snapped){s+=bang(t,snapT,1180,380,'SNAP!','#FFC21F',110); s+=chipAt(t,ST[4]+DU[4]-0.6,960,140,'HAIR = BODY = UNCUTTABLE','#E8463C',50);}
    s+=chipAt(t,ST[3]+0.3,480,780,'HAIRCUT DAY','#3D8BFF',46,ST[4]);
  } else if(t<ST[6]-0.2){ // growth chart
    s+=bgPanel('#FFF6E0','#FFE7B8');
    const yr=seg(t,ST[5]+0.4,ST[5]+DU[5]); const len=60+yr*110;
    s+=`<g transform="translate(1250,200)"><rect x="-40" y="0" width="80" height="760" rx="12" fill="#FFE07A" stroke="${INK}" stroke-width="7"/>${Array.from({length:16},(_,i)=>`<line x1="-40" y1="${i*50}" x2="${i%2?-10:5}" y2="${i*50}" stroke="${INK}" stroke-width="5"/>`).join('')}<text x="70" y="40" font-family="Lilita One" font-size="40" fill="${INK}">0 cm</text><text x="70" y="770" font-family="Lilita One" font-size="40" fill="${INK}">75 cm</text></g>`;
    s+=longHair(860,1040,1.5,len)+chibi({x:860,y:1040,s:1.5,...DEX,eyes:'open',mouth:'smile',look:[-6,0],armF:[-20,10],armB:[20,-10]});
    s+=chipAt(t,ST[5]+0.6,1620,330,'+1.25 cm / MONTH','#3D8BFF',44); s+=chipAt(t,ST[5]+3.0,1620,430,'≈ 15 cm / YEAR','#E8463C',48);
  } else { // 5 years later + rule 1
    s+=bgPanel('#FFD7E2','#FFF0F4');
    const rule=t>=ST[7]-0.2;
    s+=`<rect y="930" width="1920" height="150" fill="#F2C9D4" stroke="${INK}" stroke-width="6"/>`+longHair(rule?600:960,940,1.6,320)+chibi({x:rule?600:960,y:940,s:1.6,...DEX,eyes:rule?'happy':'dot',mouth:rule?'grin':'flat',armF:rule?[115,55]:[-20,10],armLen:rule?1.4:1,handF:rule?'peace':null,armB:[20,-10]});
    if(!rule){s+=`<g transform="translate(960,130) scale(${pop(t,ST[6]+0.1,0.35)})">${txt('5 YEARS LATER…',0,0,90,'#E8463C')}</g>`;
      s+=chipAt(t,ST[6]+1.6,1500,420,'HAIR ≈ 75 cm','#B07CFF',50); s+=chipAt(t,ST[6]+4.4,1500,540,'NAILS +4 cm / YEAR','#FF8A3D',50); s+=chipAt(t,ST[6]+6.0,1500,660,'FOREVER.','#E8463C',50);
}
    else s+=note(t,ST[7],1340,440,'RULE 1','NO HAIRCUTS.','EVER.');
  }
  [ST[3]-0.2,ST[5]-0.2,ST[6]-0.2].forEach(w=>s+=wipe(t,w));
  return s;
}
