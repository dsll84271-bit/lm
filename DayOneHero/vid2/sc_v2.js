// RIG2
// Ep2 "Last time" recap (6.47 s): "Last time, Dex woke up with super speed."
const RV = { x: 0, y: 700, z: 1 };
function runner(t, x, y, s, extra={}) { return chibiSide2({ x, y, s, phase: t*3.2, t, lean: 18, wind: 1.4, expr: 'determined', mouth: 'grin', ...extra }); }
const SHOTS_V = [
  { t: 0, ref: RV, cam: t => ({ x: t*2200 - 300, y: 800, z: 1.15, r: -2 }), draw: (t, c, L) => {
      const dx = t*2200;
      let w = streetGround() + runner(t, dx, GY - 40, 1.25);
      for (let i = 0; i < 6; i++) w += `<rect x="${dx - 300 - i*90 - hash(i + Math.floor(t*30))*200}" y="${GY - 330 + i*48}" width="${220 + hash(i)*200}" height="9" rx="4" fill="#7FD3FF" opacity=".85"/>`;
      return `<g filter="url(#chill)">${L(0, skyW(t)) + L(.35, cityFar(t, 820), 'mb2') + L(.7, streetMid(t), 'mb2') + L(1, w)}</g>`; } },
  { t: 1.5, ref: RV, cam: t => ({ x: (t - 1.5)*1800 + 2950 - 40, y: GY - 230, z: 2.3, r: 4 }), draw: (t, c, L) => {
      const dx = (t - 1.5)*1800 + 2950;
      let w = streetGround() + pigeon(dx + 260, GY - 330, 1.6, 0, 'fly') + runner(t, dx, GY - 40, 1.25);
      return `<g filter="url(#chill)">${L(0, skyW(t)) + L(.35, cityFar(t, 820), 'mb3') + L(.7, streetMid(t), 'mb3') + L(1, w)}</g>` + speedLines(t, 22, .7, '#FFFFFF', -1); } },
  { t: 3.0, ref: RV, cam: push(3.0, 4.6, { x: 900, y: 360, z: 1.3, r: 0 }, { x: 980, y: 300, z: 2.2, r: -3 }, 'in'), draw: (t, c, L) => {
      // rooftop: the red hood watches the street
      const roof = `<rect x="200" y="420" width="1600" height="900" fill="#8C78E0" stroke="${INK}" stroke-width="7"/><rect x="180" y="400" width="1640" height="34" rx="8" fill="#6E5BC4" stroke="${INK}" stroke-width="6"/>`;
      const eyes = seg(t, 3.6, 3.9);
      return L(0, skyW(t, -900, 300, '#1B2A6B55')) + L(.4, cityFar(t, 700, '#9AA3D6'), 'b4') + L(1, roof + redHood(980, 420, 1.3, eyes)) + `<rect width="1920" height="1080" fill="#14162A" opacity=".25"/>`; } },
  { t: 4.6, ref: RV, cam: hold(4.6, { x: 0, y: 540, z: 1 }), draw: (t, c, L) => {
      // rewind into Day 2: stamp + glitch
      let s = studioBack(t) + `<g transform="translate(960,470) scale(${pop(t, 4.7, .35)}) rotate(-6)"><rect x="-330" y="-120" width="660" height="240" rx="26" fill="#fff" stroke="${INK}" stroke-width="10"/>${txt('DAY 1 ✓', 0, 45, 130, '#7ED957')}</g>`;
      if (t > 5.7) { const k = seg(t, 5.7, 6.3); for (let i = 0; i < 9; i++) s += `<rect x="0" y="${hash(i + Math.floor(t*30))*1080}" width="1920" height="${10 + hash(i*3)*50}" fill="${['#3D8BFF','#FFC21F','#fff'][i%3]}" opacity="${k*.8}" transform="translate(${(hash(i*5 + Math.floor(t*30)) - .5)*200*k},0)"/>`; }
      return s; } },
];
function scene(t) {
  let s = playShots(t, SHOTS_V, [[3.0, 6, .3]]);
  if (t < 4.6) s += `<g transform="translate(70,70)"><rect width="330" height="74" rx="18" fill="#14162A" opacity=".75"/><circle cx="40" cy="37" r="13" fill="#E8463C" opacity="${(t*2 % 1) < .6 ? 1 : .2}"/><text x="68" y="52" font-family="Lilita One" font-size="42" fill="#fff">LAST TIME</text></g>`;
  s += vignette() + flash(t, 1.5, '#fff', .12, .5) + flash(t, 3.0, '#fff', .12, .4) + flash(t, 4.6, '#fff', .2, .8) + flash(t, 6.2, '#fff', .27, .95);
  return s;
}
