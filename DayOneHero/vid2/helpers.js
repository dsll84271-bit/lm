function txt(t,x,y,size,fill,anchor='middle',sw=null){const w=sw??size*0.14;
  return `<text x="${x+size*0.04}" y="${y+size*0.06}" text-anchor="${anchor}" font-family="Lilita One" font-size="${size}" fill="${INK}" stroke="${INK}" stroke-width="${w+4}" stroke-linejoin="round">${t}</text><text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Lilita One" font-size="${size}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" paint-order="stroke">${t}</text>`;}
function chip(t,x,y,fill,size=46){const w=t.length*size*0.56+60;
  return `<g transform="translate(${x},${y})"><rect x="${-w/2+6}" y="${-size*0.95+8}" width="${w}" height="${size*1.5}" rx="${size*0.5}" fill="${INK}"/><rect x="${-w/2}" y="${-size*0.95}" width="${w}" height="${size*1.5}" rx="${size*0.5}" fill="${fill}" stroke="${INK}" stroke-width="7"/><text x="0" y="${size*0.18}" text-anchor="middle" font-family="Lilita One" font-size="${size}" fill="#fff">${t}</text></g>`;}
function pop(t,a,d=0.4){return back(seg(t,a,a+d));}
function bgPanel(c1,c2){return `<defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#pg)"/>`;}
function rays(t,col,op=0.5){let s='';for(let a=0;a<360;a+=15){const r1=rad(a+t*6),r2=rad(a+7+t*6);s+=`<path d="M960,540 L${960+2400*Math.cos(r1)},${540+2400*Math.sin(r1)} L${960+2400*Math.cos(r2)},${540+2400*Math.sin(r2)} Z" fill="${col}" opacity="${op}"/>`;}return s;}

// speedometer gauge: value 0..max shown on a 240-degree dial
function gauge(x,y,r,val,maxv,label,col,cracked=false){
  const a0=-210, a1=30; const f=clamp(val/maxv,0,1.08); const ang=a0+(a1-a0)*f;
  let s=`<g transform="translate(${x},${y})"><circle r="${r+14}" fill="${INK}"/><circle r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>`;
  for(let i=0;i<=10;i++){const aa=rad(a0+(a1-a0)*i/10); s+=`<line x1="${Math.cos(aa)*(r-8)}" y1="${Math.sin(aa)*(r-8)}" x2="${Math.cos(aa)*(r-(i%5?22:34))}" y2="${Math.sin(aa)*(r-(i%5?22:34))}" stroke="${INK}" stroke-width="${i%5?4:7}" stroke-linecap="round"/>`;}
  const arc=(fr,to,c)=>{const p=a=>[Math.cos(rad(a))*(r-44),Math.sin(rad(a))*(r-44)];const [x0,y0]=p(fr),[x1,y1]=p(to);return `<path d="M${x0},${y0} A${r-44},${r-44} 0 ${to-fr>180?1:0} 1 ${x1},${y1}" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`;};
  s+=arc(a0,a0+(a1-a0)*0.7,'#7ED957')+arc(a0+(a1-a0)*0.7,a1,'#FF5A4E');
  const na=rad(ang); s+=`<line x1="0" y1="0" x2="${Math.cos(na)*(r-30)}" y2="${Math.sin(na)*(r-30)}" stroke="${col}" stroke-width="12" stroke-linecap="round"/><circle r="18" fill="${INK}"/>`;
  if(cracked) s+=`<path d="M${-r*0.2},${-r*0.9} L${-r*0.05},${-r*0.4} L${-r*0.3},${-r*0.1} L${r*0.1},${r*0.3} M${-r*0.05},${-r*0.4} L${r*0.4},${-r*0.5}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  s+=`<text y="${r*0.62}" text-anchor="middle" font-family="Lilita One" font-size="${r*(label.length>9?0.24:0.32)}" fill="${INK}">${label}</text></g>`;
  return s;}


// ---------- transitions: blue speed-wipe between scenes ----------
function wipe(t,at){const k=seg(t,at-0.22,at+0.22); if(k<=0||k>=1) return '';
  const x=lerp(-2400,1920,k); let s=`<g transform="translate(${x},0) skewX(-18)"><rect x="0" y="-100" width="2200" height="1300" fill="#3D8BFF"/><rect x="-80" y="-100" width="60" height="1300" fill="#7FD3FF"/><rect x="2220" y="-100" width="40" height="1300" fill="#FFC21F"/></g>`; return s;}


function car(x,y,s,col,flip=false){return `<g transform="translate(${x},${y}) scale(${flip?-s:s},${s})">
  <ellipse cx="0" cy="8" rx="150" ry="14" fill="#000" opacity=".18"/>
  <path d="M-150,-20 Q-150,-70 -110,-74 L-70,-76 Q-40,-130 20,-130 L60,-130 Q100,-128 120,-80 L140,-76 Q160,-70 160,-30 L160,-12 Q160,0 148,0 L-140,0 Q-150,0 -150,-12 Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M-56,-80 Q-34,-118 10,-118 L10,-80 Z M26,-80 L26,-118 L56,-118 Q88,-116 104,-80 Z" fill="#CFEFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M-36,-84 L-16,-112" stroke="#fff" stroke-width="7" opacity=".9"/>
  <rect x="140" y="-56" width="20" height="14" rx="5" fill="#FFF1B0" stroke="${INK}" stroke-width="4"/>
  ${[-92,96].map(wx=>`<circle cx="${wx}" cy="-2" r="32" fill="#2B2F4A" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="-2" r="13" fill="#C9C2DA" stroke="${INK}" stroke-width="4"/>`).join('')}
  <path d="M-150,-34 L160,-34" stroke="#000" stroke-width="4" opacity=".12"/></g>`;}

