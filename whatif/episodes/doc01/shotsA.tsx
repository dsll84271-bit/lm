import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Bg, C, Cam, ChapterTitle, Circle, clamp, Counter, Draw, Full, Grain, IndexCard, Kicker, Label, lerp, Letterbox, Photo, Pin, Rise, Stamp, Sticker, Typed, Vignette} from '../../docs-kit/kit';
import {Dot, MapView, MiniMap, P} from '../../docs-kit/map';
import type {ShotProps} from './timeline';

const FL: [number, number, number, number] = [640, 440, 230, 190];

// 1 · the state that doesn't exist
export const S01: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const tags: [string, string, [number, number], number, number][] = [
		['A NEON CITY', 'neon', P.miami, 6, -2],
		['A SWAMP FULL OF ALLIGATORS', 'swamp', P.evergladesnp, -66, -8],
		['TROPICAL ISLANDS', 'islands', P.keywest, 8, -3],
		['THE STRANGEST PEOPLE IN GAMING', 'strangest', P.orlando, 6, -6],
	];
	const name = lerp(frame, cue('called'), cue('called') + 12, 0, 1);
	return (
		<AbsoluteFill>
			<MapView d={d} from={[0, 0, 975, 610]} to={[668, 482, 215, 130]} style="navy" hi={['12']} hiGlow lines={false}>
				<text x={752} y={530} fontFamily="Bebas" fontSize={13} fill={C.cream} opacity={name} letterSpacing={1.5}>
					LEONIDA?
				</text>
				{tags.map(([t, w, p, dx, dy], i) => {
					const a = cue(w);
					const o = lerp(frame, a, a + 8, 0, 1);
					return (
						<g key={i} opacity={o}>
							<circle cx={p[0]} cy={p[1]} r={1.3} fill={C.yellow} />
							<line x1={p[0]} y1={p[1]} x2={p[0] + dx * 0.6} y2={p[1] + dy} stroke={C.yellow} strokeWidth={0.3} />
							<text x={p[0] + dx} y={p[1] + dy} fontFamily="Oswald" fontWeight={700} fontSize={4.2} fill={C.cream} letterSpacing={0.3}>
								{t}
							</text>
						</g>
					);
				})}
			</MapView>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,12,18,.85), rgba(8,12,18,0) 32%)'}} />
			<div style={{position: 'absolute', left: 110, top: 90, opacity: lerp(frame, 0, 10, 0, 1)}}>
				<Kicker color="#E0A84A">GRAND THEFT AUTO VI</Kicker>
				<div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 70, color: C.cream, marginTop: 8}}>
					<Rise text="This state doesn't exist." at={4} />
				</div>
			</div>
			<Vignette strength={0.6} />
		</AbsoluteFill>
	);
};

// 2 · none of it was invented
export const S02: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Bg kind="paper" />
		<Cam d={d} from={{x: 960, y: 560, s: 1.0}} to={{x: 990, y: 520, s: 1.12}}>
			<Photo src="cardoza_color.jpg" x={180} y={150} w={330} h={450} rot={-5} at={2} caption="Ocean Drive" captionFont="Caveat" />
			<Photo src="everglades_highsm.jpg" x={600} y={120} w={460} h={330} rot={3} at={8} caption="the Everglades" captionFont="Caveat" />
			<Photo src="gator_menacing_2020.jpg" x={1150} y={170} w={420} h={290} rot={-3} at={14} caption="1.3 million of these" captionFont="Caveat" />
			<Photo src="v_hurricane1926.jpg" x={420} y={560} w={560} h={250} rot={2} at={cue('one')} bw caption="Miami, 1926" captionFont="Caveat" />
			<Photo src="skyline_1980.jpg" x={1080} y={560} w={430} h={300} rot={-2} at={cue('one') + 6} caption="Miami, 1980" captionFont="Caveat" />
			<Stamp text="100% REAL" x={1000} y={520} at={cue('real')} size={110} rot={-9} />
		</Cam>
		<Vignette />
	</AbsoluteFill>
);

// 3 · the four promises
export const S03: React.FC<ShotProps> = ({d, cue}) => {
	const cards: [string, string, number, number, number][] = [
		['FILE 01', 'Why are the hotels pink?', cue('pink'), 150, 170],
		['FILE 02', 'Where does "Grassrivers" come from?', cue('grassrivers'), 1260, 170],
		['FILE 03', 'Why does Florida Man exist?', cue('man'), 150, 640],
		['FILE 04', 'The race it might not win', cue('race'), 1260, 640],
	];
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Bg kind="cork" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.0}} to={{x: 960, y: 540, s: 1.08}}>
				<svg width={1920} height={1080} style={{position: 'absolute'}}>
					{cards.map(([, , at, x, y], i) => (
						<Draw key={i} d={`M ${x + 230} ${y + 20} Q ${(x + 230 + 960) / 2} ${(y + 540) / 2 + 60} 960 470`} at={at + 4} dur={14} color="#B3121B" width={4} len={1400} />
					))}
				</svg>
				<div
					style={{
						position: 'absolute',
						left: 760,
						top: 430,
						width: 400,
						padding: '26px 0 20px',
						background: '#F3E9C9',
						transform: 'rotate(1.5deg)',
						textAlign: 'center',
						boxShadow: '0 14px 26px rgba(0,0,0,.35)',
					}}
				>
					<div style={{fontFamily: 'Elite', fontSize: 22, letterSpacing: 4, color: C.red}}>CASE FILE</div>
					<div style={{fontFamily: 'Bebas', fontSize: 96, lineHeight: 0.95, color: '#1B1B1B', marginTop: 8}}>
						WHY
						<br />
						FLORIDA?
					</div>
				</div>
				<Pin x={960} y={448} />
				{cards.map(([h, b, at, x, y], i) => (
					<React.Fragment key={i}>
						<IndexCard x={x} y={y} w={470} rot={i % 2 ? 2 : -2} head={h} body={b} at={at} />
						{frame >= at && <Pin x={x + 230} y={y + 20} />}
					</React.Fragment>
				))}
			</Cam>
			<Vignette strength={0.7} />
		</AbsoluteFill>
	);
};

// 4 · title card
export const S04: React.FC<ShotProps> = ({d}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.04}} to={{x: 960, y: 540, s: 1.0}}>
				<div style={{position: 'absolute', left: 80, top: 140, transform: 'rotate(-2.4deg)', boxShadow: '0 18px 30px rgba(40,25,10,.28)', background: '#F3EBDA'}}>
					<MiniMap w={760} h={610} vb={[628, 446, 222, 178]}>
						<circle cx={P.miami[0]} cy={P.miami[1]} r={2.2} fill={C.red} />
						<text x={705} y={478} fontFamily="Playfair" fontStyle="italic" fontWeight={700} fontSize={9} fill="#2A241C">
							Florida
						</text>
					</MiniMap>
				</div>
				<Circle x={752} y={568} rx={44} ry={32} at={8} />
				<div style={{position: 'absolute', left: 960, top: 150}}>
					<Kicker>THE REAL STATE BEHIND GTA VI</Kicker>
					<div style={{fontFamily: 'Bebas', fontSize: 210, lineHeight: 0.9, color: C.ink, marginTop: 14, clipPath: `inset(0 ${lerp(frame, 2, 22, 100, 0)}% 0 0)`}}>
						WHY FLORIDA?
					</div>
					<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 40, color: '#3A3226', marginTop: 10, opacity: lerp(frame, 18, 30, 0, 1)}}>
						Sun, swamps, and a hundred years of headlines.
					</div>
				</div>
				<Sticker src="v_cavalier_sticker.png" x={1430} y={520} h={430} rot={3} at={10} />
				<Photo src="v_miami0.jpg" x={930} y={560} w={420} h={300} rot={-4} at={6} bw caption="Midwinter crowd, Miami Beach" />
				<Stamp text="1948" x={1250} y={590} at={16} size={70} rot={12} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 5 · younger than the Eiffel Tower
export const S05: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const t = cue('younger');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.0}} to={{x: 960, y: 560, s: 1.06}}>
				<div style={{position: 'absolute', left: 150, top: 120}}>
					<Kicker>CHAPTER 1 · THE CITY A FROST BUILT</Kicker>
				</div>
				<Photo src="flagler_street_1896.jpg" x={1050} y={250} w={640} h={430} rot={2} at={2} caption="Flagler Street, Miami, 1896" />
				<div style={{position: 'absolute', left: 170, top: 300, opacity: lerp(frame, t - 4, t + 6, 0, 1)}}>
					<div style={{fontFamily: 'Elite', fontSize: 30, color: '#3A3226'}}>EIFFEL TOWER COMPLETED</div>
					<div style={{fontFamily: 'Bebas', fontSize: 190, color: '#7A6E5C', lineHeight: 1}}>1889</div>
				</div>
				<div style={{position: 'absolute', left: 170, top: 600, opacity: lerp(frame, t + 6, t + 14, 0, 1)}}>
					<div style={{fontFamily: 'Elite', fontSize: 30, color: C.red}}>MIAMI BECOMES A CITY</div>
					<div style={{fontFamily: 'Bebas', fontSize: 190, color: C.ink, lineHeight: 1}}>1896</div>
				</div>
				<Stamp text="YOUNGER" x={720} y={760} at={t + 16} size={80} rot={-10} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 6 · the Great Freeze
export const S06: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const frost = lerp(frame, cue('freezes'), cue('wiped') + 20, 0, 1);
	const y = 450 + frost * 70; // frost line moves south
	const south = cue('biscayne');
	return (
		<AbsoluteFill>
			<MapView d={d} from={FL} to={[650, 450, 210, 170]}>
				<defs>
					<linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#DDEFFF" stopOpacity={0.85} />
						<stop offset="1" stopColor="#DDEFFF" stopOpacity={0} />
					</linearGradient>
				</defs>
				<rect x={600} y={420} width={300} height={y - 420 + 14} fill="url(#frost)" />
				<line x1={600} y1={y} x2={900} y2={y} stroke="#7FB4E0" strokeWidth={0.6} strokeDasharray="2 1.5" opacity={frost} />
				<text x={790} y={y - 3} fontFamily="Elite" fontSize={5} fill="#3A6A90" opacity={frost}>
					THE GREAT FREEZE, 1894–95
				</text>
				<Dot p={P.miami} at={south} r={2.4} color="#3E9B4F" label="Biscayne Bay: no frost" dx={-62} dy={2} size={5} />
				<Draw d={`M ${P.miami[0] + 9} ${P.miami[1]} a 9 7 0 1 1 -0.5 -2`} at={south + 4} dur={16} color="#3E9B4F" width={1.1} len={70} />
			</MapView>
			<div style={{position: 'absolute', left: 120, top: 140}}>
				<Photo src="orange_grove_1904.jpg" x={0} y={0} w={480} h={340} rot={-3} at={4} bw caption="Florida orange grove" />
			</div>
			<Stamp text="FROZEN" x={600} y={170} at={cue('wiped')} size={90} rot={-8} color="#2F6FA8" />
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 7 · Julia Tuttle and Henry Flagler
export const S07: React.FC<ShotProps> = ({d, cue}) => {
	const blossom = cue('blossoms');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 900, y: 520, s: 1.05}} to={{x: 1000, y: 560, s: 1.12}}>
				<Photo src="julia_tuttle.jpg" x={190} y={150} w={360} h={545} rot={-3} at={cue('tuttle') - 6} sepia={0.25} />
				<Photo src="flagler_portrait.jpg" x={1230} y={170} w={360} h={500} rot={3} at={cue('flagler') - 4} caption="Henry Flagler" captionFont="Caveat" sepia={0.25} />
				<svg width={1920} height={1080} style={{position: 'absolute'}}>
					<Draw d="M 560 380 C 800 280, 1000 300, 1230 380" at={cue('trains')} dur={24} color={C.red} width={5} dash="16 12" len={800} arrow />
				</svg>
				<Label text="“bring your trains south”" x={720} y={250} at={cue('trains') + 10} rot={-2} />
				<Photo src="orange_grove_1898.jpg" x={640} y={560} w={540} h={380} rot={2} at={blossom - 20} caption="An orange grove, 1898" />
				<Stamp text="LEGEND?" x={1100} y={600} at={blossom + 6} size={84} rot={-8} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 8 · the railroad arrives, 1896
export const S08: React.FC<ShotProps> = ({d, cue}) => {
	const rail = `M ${P.jacksonville[0]} ${P.jacksonville[1]} L ${P.stagustine[0]} ${P.stagustine[1]} L 797 505 L 806 525 L ${P.westpalm[0]} ${P.westpalm[1]} L ${P.miami[0]} ${P.miami[1]}`;
	const city = cue('miami');
	return (
		<AbsoluteFill>
			<MapView d={d} from={[680, 440, 200, 170]} to={[705, 470, 165, 150]}>
				<Draw d={rail} at={2} dur={cue('railroad') + 30} color="#1E1A16" width={0.8} dash="1.8 1" len={200} />
				<Dot p={P.jacksonville} label="Jacksonville" at={0} size={3.2} r={1.1} />
				<Dot p={P.westpalm} label="West Palm Beach" at={20} size={3.2} r={1.1} />
				<Dot p={P.miami} label="MIAMI" at={city} r={1.8} size={6} font="Bebas" dx={3} dy={2} />
			</MapView>
			<Photo src="flagler_street_1896.jpg" x={150} y={420} w={520} h={340} rot={-3} at={cue('summer')} caption="Miami, 1896" captionFont="Caveat" />
			<Stamp text="INCORPORATED · JULY 28, 1896" x={560} y={900} at={city + 4} size={58} rot={-4} />
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 9 · invented, fast
export const S09: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Full src="biscayne_palms_1900.jpg" d={d} bw sepia={0.25} from={{x: 0, y: 0, s: 1.05}} to={{x: -30, y: -10, s: 1.18}} letterbox={110} darken={0.2} />
			<AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,.8), rgba(0,0,0,0) 55%)'}} />
			<div style={{position: 'absolute', left: 150, top: 640, color: C.cream, textShadow: '0 2px 18px rgba(0,0,0,.8)'}}>
				<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 92, opacity: lerp(frame, cue('invented'), cue('invented') + 10, 0, 1)}}>
					Invented. Fast.
				</div>
				<div style={{fontFamily: 'Oswald', fontWeight: 300, fontSize: 36, letterSpacing: 6, marginTop: 10, opacity: lerp(frame, cue('dream'), cue('dream') + 10, 0, 1)}}>
					BY PEOPLE SELLING A DREAM
				</div>
			</div>
			<Grain opacity={0.3} />
			<Vignette strength={0.6} />
		</AbsoluteFill>
	);
};

// 10 · chapter 2: the boom
export const S10: React.FC<ShotProps> = ({d}) => (
	<AbsoluteFill>
		<Bg kind="paper" />
		<Cam d={d} from={{x: 960, y: 540, s: 1.0}} to={{x: 980, y: 540, s: 1.05}}>
			<ChapterTitle n="CHAPTER 2" title="THE BOOM" sub="Get rich quick. Cash out. Lose it all." x={130} y={300} />
			<Photo src="realestate_billboard_1922.jpg" x={1120} y={200} w={620} h={470} rot={4} at={10} bw caption="Selling lots, 1922" />
		</Cam>
		<Vignette />
	</AbsoluteFill>
);

// 11 · the 1920s land rush
export const S11: React.FC<ShotProps> = ({d, cue}) => {
	const sold = cue('sell');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 760, y: 520, s: 1.12}} to={{x: 1240, y: 560, s: 1.0}}>
				<Photo src="causeway_1926.jpg" x={80} y={140} w={700} h={360} rot={-2} at={cue('drained')} bw caption="The causeway to Miami Beach, 1926" />
				<Photo src="mb_casino_1923.jpg" x={140} y={590} w={560} h={400} rot={2} at={cue('dredged')} bw caption="Miami Beach, 1923" />
				<Photo src="realestate_billboard_1922.jpg" x={860} y={240} w={520} h={400} rot={-3} at={cue('bought') - 10} bw />
				{[0, 1, 2].map((i) => (
					<Stamp key={i} text="SOLD" x={980 + i * 170} y={360 + i * 120} at={sold + i * 6} size={80} rot={-10 + i * 7} />
				))}
				<Photo src="carl_fisher.jpg" x={1480} y={160} w={420} h={300} rot={3} at={cue('fisher') - 4} bw caption="Carl Fisher (in the car)" />
				<Photo src="flamingo_hotel_1920.jpg" x={1450} y={560} w={460} h={290} rot={-2} at={cue('resort')} caption="Fisher's Flamingo Hotel" />
				<Label text="FORTUNES WERE MADE IN MONTHS" x={1050} y={900} at={cue('fortunes')} size={30} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 12 · 18 September 1926
export const S12: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const at = cue('eighteenth');
	return (
		<AbsoluteFill>
			<Full src="v_hurricane1926.jpg" d={d} bw sepia={0.25} from={{x: 40, y: 0, s: 1.05}} to={{x: -40, y: 0, s: 1.15}} letterbox={130} darken={0.25} />
			<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.75), rgba(0,0,0,0) 60%)'}} />
			<div style={{position: 'absolute', left: 150, top: 560, color: '#EDE6D6', textShadow: '0 2px 14px rgba(0,0,0,.7)'}}>
				<div style={{fontFamily: 'Oswald', fontSize: 26, letterSpacing: 10, color: '#D9C9A3', opacity: lerp(frame, 0, 10, 0, 1)}}>MIAMI, FLORIDA</div>
				<div style={{width: 70, height: 2, background: '#D9C9A3', margin: '22px 0 20px'}} />
				<div style={{fontFamily: 'Playfair', fontSize: 96, lineHeight: 1}}>
					<Typed text="September 18, 1926" at={at - 6} cps={18} />
				</div>
			</div>
			<Grain opacity={0.35} />
			<Vignette strength={0.7} />
		</AbsoluteFill>
	);
};

// 13 · walking into the eye
export const S13: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const calm = cue('calm');
	const hit = cue('hit');
	const shake = frame > hit && frame < hit + 18 ? Math.sin(frame * 3.1) * 14 * (1 - (frame - hit) / 18) : 0;
	const flash = interpolate(frame, [hit, hit + 2, hit + 10], [0, 0.85, 0], clamp);
	const rot = frame * 1.6;
	const people = lerp(frame, calm + 20, calm + 40, 0, 1);
	return (
		<AbsoluteFill style={{background: '#0B1118', transform: `translateX(${shake}px)`}}>
			<svg width={1920} height={1080}>
				<defs>
					<radialGradient id="cloud" cx=".5" cy=".5" r=".5">
						<stop offset="0.22" stopColor="#0B1118" stopOpacity={0} />
						<stop offset="0.3" stopColor="#5D7488" stopOpacity={0.55} />
						<stop offset="0.75" stopColor="#2A3A4A" stopOpacity={0.35} />
						<stop offset="1" stopColor="#0B1118" stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle cx={960} cy={540} r={560} fill="url(#cloud)" />
				<g transform={`translate(960 540) rotate(${rot}) scale(1.5)`}>
					{Array.from({length: 9}).map((_, i) => (
						<path
							key={i}
							d={`M 0 0 m 120 0 a ${200 + i * 70} ${170 + i * 60} 0 0 1 ${-60 - i * 30} ${260 + i * 80}`}
							fill="none"
							stroke="#7F98AE"
							strokeOpacity={0.5 - i * 0.05}
							strokeWidth={26 - i * 2}
							transform={`rotate(${i * 40})`}
							strokeLinecap="round"
						/>
					))}
				</g>
				<circle cx={960} cy={540} r={120} fill="#1A2633" stroke="#D9E6F0" strokeWidth={3} strokeDasharray="8 8" />
				<text x={960} y={530} textAnchor="middle" fontFamily="Bebas" fontSize={50} fill="#D9E6F0" opacity={lerp(frame, calm - 4, calm + 6, 0, 1)}>
					THE EYE
				</text>
				<text x={960} y={566} textAnchor="middle" fontFamily="Elite" fontSize={22} fill="#AFC3D3" opacity={lerp(frame, calm, calm + 10, 0, 1)}>
					calm, for a while
				</text>
				{[-40, 0, 40].map((dx, i) => (
					<g key={i} opacity={people} transform={`translate(${960 + dx} 610)`}>
						<circle cx={0} cy={-18} r={7} fill={C.cream} />
						<rect x={-6} y={-10} width={12} height={22} rx={4} fill={C.cream} />
					</g>
				))}
			</svg>
			<div style={{position: 'absolute', left: 150, top: 110}}>
				<Kicker color="#E0A84A">WHAT HAPPENED</Kicker>
			</div>
			<AbsoluteFill style={{background: '#fff', opacity: flash}} />
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// 14 · the bust
export const S14: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const crash = cue('collapsed');
	const pts = [0, 0.2, 0.45, 0.75, 1.0, 0.98, 0.5, 0.18, 0.12];
	const n = pts.length - 1;
	const prog = lerp(frame, crash - 30, crash + 30, 0, 1, Easing.linear);
	const path = pts
		.slice(0, Math.max(2, Math.ceil(prog * n) + 1))
		.map((v, i) => `${i ? 'L' : 'M'} ${100 + i * 70} ${300 - v * 220}`)
		.join(' ');
	return (
		<AbsoluteFill>
			<Full src="v_hurricane1926.jpg" d={d} bw sepia={0.3} pos="80% 50%" from={{x: -60, y: 0, s: 1.35}} to={{x: -90, y: 10, s: 1.5}} darken={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.7), rgba(0,0,0,0) 45%)'}} />
			<div style={{position: 'absolute', left: 140, top: 150, color: C.cream}}>
				<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 4, color: '#D9C9A3'}}>AT LEAST</div>
				<Counter to={372} at={2} dur={40} style={{fontFamily: 'Bebas', fontSize: 220, lineHeight: 1}} />
				<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 4, color: '#D9C9A3'}}>PEOPLE DIED</div>
			</div>
			<div style={{position: 'absolute', left: 1080, top: 520, opacity: lerp(frame, crash - 34, crash - 24, 0, 1)}}>
				<div style={{fontFamily: 'Elite', fontSize: 24, color: '#D9C9A3', marginBottom: 6}}>THE LAND BOOM</div>
				<svg width={720} height={340}>
					<line x1={100} y1={300} x2={680} y2={300} stroke="#D9C9A3" strokeWidth={2} />
					<path d={path} fill="none" stroke={C.yellow} strokeWidth={5} strokeLinejoin="round" />
					<text x={100} y={330} fontFamily="Elite" fontSize={20} fill="#D9C9A3">
						1920
					</text>
					<text x={580} y={330} fontFamily="Elite" fontSize={20} fill="#D9C9A3">
						1927
					</text>
				</svg>
			</div>
			<Stamp onDark text="BUST" x={1640} y={420} at={crash + 6} size={120} rot={-10} />
			<Letterbox h={90} />
			<Grain opacity={0.3} />
			<Vignette strength={0.6} />
		</AbsoluteFill>
	);
};

// 15 · boom, bust, reinvent
export const S15: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const tv = cue('tv');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 520, s: 1.0}} to={{x: 960, y: 560, s: 1.08}}>
				<Stamp text="BOOM" x={460} y={330} at={cue('boom')} size={170} rot={-8} color={C.ink} />
				<Stamp text="BUST" x={960} y={330} at={cue('bust')} size={170} rot={4} color={C.red} />
				<Stamp text="REINVENT" x={1440} y={330} at={cue('reinvent')} size={150} rot={-5} color="#1E5E8C" />
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 52, color: '#3A3226', opacity: lerp(frame, cue('pattern'), cue('pattern') + 10, 0, 1)}}>
					Remember the pattern.
				</div>
				<div
					style={{
						position: 'absolute',
						left: 760,
						top: 680,
						width: 400,
						height: 280,
						borderRadius: 26,
						background: '#1A1A1A',
						border: '14px solid #3A3226',
						opacity: lerp(frame, tv - 20, tv - 10, 0, 1),
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div style={{fontFamily: 'Bebas', fontSize: 150, color: '#FF4FA3', textShadow: '0 0 20px #FF4FA3, 0 0 50px #FF4FA3'}}>?</div>
				</div>
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};
