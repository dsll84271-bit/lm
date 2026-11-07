// RIG2  pose sheet: every Rig 2.0 key pose, for checking (python shot.py ps 0)
function scene(t){let s=R2DEFS+bgPanel('#EAF4FF','#D6E8FF');const names=Object.keys(POSES);
 names.forEach((n,i)=>{const c=i%9,r=Math.floor(i/9),x=110+c*212,y=250+r*268;
  s+=chibi2({...DEX2,...mixPose(POSES[n],POSES[n],1),x,y:y-(POSES[n].air?40:0),s:.62,t:1.3,sway:.4,hoodTip:4});
  s+=`<text x="${x}" y="${y+30}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="22" fill="${INK}">${i+1}. ${n}</text>`;});
 return s;}
