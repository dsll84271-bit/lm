function scene(t) {
  let s = `<rect width="1920" height="1080" fill="${PAPER}"/>`;
  const names = Object.keys(SP); names.forEach((n, i) => { const x = 110 + i*160; s += stick({ ...poseAt([[0, n]], 0), x, y: 330, s: .8 }) + `<text x="${x}" y="370" text-anchor="middle" font-family="Inter" font-weight="900" font-size="18">${n}</text>`; });
  for (let i = 0; i < 4; i++) s += stick({ ...runPose(i/4), x: 120 + i*150, y: 640, s: .8 }) + stick({ ...walkPose(i/4), x: 760 + i*150, y: 640, s: .8 });
  s += trex({ x: 1500, y: 640, s: .55, ph: .2, walk: 1, t: 1 }) + trex({ x: 520, y: 1040, s: .5, jaw: 1, head: 18, t: 1 }) + bus(1200, 1040, .6) + phoneBox(1500, 1040, .8) + car(1750, 1040, .7) + bike(1100, 1040, .7, .2);
  return s;
}
