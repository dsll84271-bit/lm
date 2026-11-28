import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, useCurrentFrame} from 'remotion';
import {Bg, C, Cam, ChapterTitle, clamp, Counter, Draw, Full, Grain, img, Kicker, Label, lerp, Photo, Rise, Stamp, Sticker, Typed, Vignette} from '../../docs-kit/kit';
import {Dot, MapView, P} from '../../docs-kit/map';
import type {ShotProps} from './timeline';

const Swatch: React.FC<{x: number; y: number; color: string; name: string; at: number}> = ({x, y, color, name, at}) => {
	const frame = useCurrentFrame();
	const p = lerp(frame, at, at + 10, 0, 1, Easing.out(Easing.back(1.6)));
	if (frame < at) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${p}) rotate(-3deg)`, background: '#FBF8EF', padding: 14, boxShadow: '0 10px 22px rgba(0,0,0,.3)'}}>
			<div style={{width: 200, height: 150, background: color}} />
			<div style={{fontFamily: 'Elite', fontSize: 26, marginTop: 10, color: C.ink}}>{name}</div>
		</div>
	);
};

// 16 · chapter 3: the pastel hotels
export const S16: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Bg kind="paper" />
		<Cam d={d} from={{x: 960, y: 540, s: 1.02}} to={{x: 1000, y: 540, s: 1.1}}>
			<div style={{position: 'absolute', left: 130, top: 120}}>
				<Kicker>CHAPTER 3 · PAINTED PINK</Kicker>
			</div>
			<Photo src="v_highsmith0.jpg" x={130} y={230} w={420} h={540} rot={-3} at={2} caption="Ocean Drive, Miami Beach" />
			<Photo src="v_highsmith2.jpg" x={640} y={210} w={640} h={500} rot={2} at={8} caption="The Cavalier Hotel" />
			<Swatch x={1380} y={180} color={C.pink} name="PINK" at={cue('pink')} />
			<Swatch x={1440} y={430} color={C.mint} name="MINT" at={cue('mint')} />
			<Swatch x={1380} y={680} color={C.lavender} name="LAVENDER" at={cue('lavender')} />
			<Label text="So where did it come from?" x={700} y={860} at={cue('where')} size={34} />
		</Cam>
		<Vignette />
	</AbsoluteFill>
);

// 17 · Art Deco
export const S17: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const call: [string, string, number, number, number, number][] = [
		['ROUNDED CORNERS', 'rounded', 1180, 300, 980, 420],
		['RACING STRIPES', 'racing', 1180, 470, 960, 560],
		['GLASS BLOCKS', 'glass', 1180, 640, 900, 700],
		['NEON SIGNS', 'neon', 1180, 810, 860, 330],
	];
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.0}} to={{x: 940, y: 540, s: 1.06}}>
				<Photo src="colony_hotel.jpg" x={560} y={110} w={560} h={780} rot={-1.5} at={0} bw caption="Colony Hotel, Ocean Drive" />
				<Photo src="albion_hotel_1940.jpg" x={90} y={200} w={420} h={300} rot={-4} at={6} bw caption="Albion Hotel, 1940" />
				<Photo src="park_central_habs.jpg" x={110} y={580} w={330} h={420} rot={3} at={12} bw caption="Park Central" />
				<svg width={1920} height={1080} style={{position: 'absolute'}}>
					{call.map(([, w, x, y, tx, ty], i) => (
						<Draw key={i} d={`M ${x - 10} ${y + 20} L ${tx} ${ty}`} at={cue(w)} dur={8} color={C.red} width={3} len={600} />
					))}
				</svg>
				{call.map(([t, w, x, y], i) => (
					<Label key={i} text={t} x={x} y={y} at={cue(w)} rot={i % 2 ? 1 : -1.5} size={30} />
				))}
				<div style={{position: 'absolute', left: 1180, top: 120, fontFamily: 'Bebas', fontSize: 120, color: C.ink, opacity: lerp(frame, cue('neon') + 18, cue('neon') + 26, 0, 1)}}>
					ART DECO
				</div>
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 18 · run-down by the 1970s
export const S18: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Full src="neron_hotel_1978.jpg" d={d} bw sepia={0.35} from={{x: 0, y: 0, s: 1.04}} to={{x: 20, y: 0, s: 1.14}} darken={0.25} letterbox={100} />
		<div style={{position: 'absolute', left: 140, top: 150}}>
			<Kicker color="#D9C9A3">MIAMI BEACH · 1970s</Kicker>
		</div>
		<Stamp onDark text="BULLDOZE?" x={1400} y={600} at={cue('bulldoze')} size={130} rot={-9} />
		<Grain opacity={0.3} />
		<Vignette strength={0.6} />
	</AbsoluteFill>
);

// 19 · Barbara Capitman and the 1979 listing
export const S19: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const doc = cue('nineteen');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 520, s: 1.0}} to={{x: 960, y: 560, s: 1.08}}>
				<div
					style={{
						position: 'absolute',
						left: 480,
						top: 140,
						width: 960,
						height: 760,
						background: '#FBF7EC',
						boxShadow: '0 20px 40px rgba(40,25,10,.3)',
						transform: 'rotate(-1deg)',
						padding: '60px 80px',
						boxSizing: 'border-box',
						opacity: lerp(frame, doc - 20, doc - 8, 0, 1),
						border: '1px solid #CFC3A8',
					}}
				>
					<div style={{fontFamily: 'Elite', fontSize: 26, letterSpacing: 4, color: '#3A3226', textAlign: 'center'}}>UNITED STATES DEPARTMENT OF THE INTERIOR</div>
					<div style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 56, textAlign: 'center', marginTop: 24, color: C.ink}}>National Register of Historic Places</div>
					<div style={{height: 2, background: '#3A3226', margin: '28px 0'}} />
					<div style={{fontFamily: 'Elite', fontSize: 32, lineHeight: '52px', color: C.ink}}>
						<Typed text="DISTRICT: Miami Beach Architectural District" at={doc} cps={30} />
						<br />
						<Typed text="LISTED: May 14, 1979" at={doc + 30} cps={30} />
						<br />
						<Typed text="BUILDINGS: more than 800" at={cue('eight')} cps={30} />
					</div>
				</div>
				<Stamp text="PROTECTED" x={1180} y={760} at={cue('protected')} size={110} rot={-10} />
				<Label text="Barbara Capitman, preservationist" x={500} y={60} at={cue('capitman') - 6} rot={-2} size={28} />
				<Label text="The first of its kind for 20th-century buildings" x={170} y={900} at={cue('first')} rot={1} size={28} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 20 · Leonard Horowitz repaints the buildings
export const S20: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const paint = cue('repainted');
	const wipe = lerp(frame, paint, paint + 50, 0, 100, Easing.inOut(Easing.cubic));
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.02}} to={{x: 960, y: 540, s: 1.1}}>
				<div style={{position: 'absolute', left: 560, top: 110, width: 800, height: 840}}>
					<Img src={img('v_cavalier_sticker.png')} style={{position: 'absolute', left: 0, top: 0, width: 800, filter: 'grayscale(1) brightness(.85) contrast(.9)'}} />
					<Img
						src={img('v_cavalier_sticker.png')}
						style={{position: 'absolute', left: 0, top: 0, width: 800, clipPath: `inset(0 ${100 - wipe}% 0 0)`, filter: 'saturate(1.6) hue-rotate(-12deg)'}}
					/>
					<div style={{position: 'absolute', left: `${wipe}%`, top: 40, width: 10, height: 600, background: C.pink, opacity: wipe > 1 && wipe < 99 ? 1 : 0, boxShadow: '0 0 20px rgba(0,0,0,.3)'}} />
				</div>
				<Label text="Leonard Horowitz, designer" x={160} y={220} at={cue('horowitz') - 6} size={30} rot={-2} />
				<div style={{position: 'absolute', left: 160, top: 360, display: 'flex', flexDirection: 'column', gap: 24}}>
					{[C.pink, C.mint, C.lavender].map((c, i) => (
						<div key={i} style={{width: 260, height: 90, background: c, boxShadow: '0 8px 16px rgba(0,0,0,.25)', transform: `scaleX(${lerp(frame, paint + 10 + i * 8, paint + 22 + i * 8, 0, 1)})`, transformOrigin: 'left'}} />
					))}
				</div>
				<Label text="…so people would stop and look" x={1300} y={880} at={cue('stop')} size={28} rot={1.5} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 21 · the twist
export const S21: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const t = cue('paint');
	return (
		<AbsoluteFill>
			<Full src="cardoza_color.jpg" d={d} from={{x: 0, y: 0, s: 1.1}} to={{x: 0, y: -30, s: 1.25}} grade="saturate(1.3) blur(6px) brightness(.55)" />
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', color: C.cream}}>
				<div style={{fontFamily: 'Elite', fontSize: 34, letterSpacing: 8, color: C.pink, opacity: lerp(frame, 0, 10, 0, 1)}}>HERE'S THE TWIST</div>
				<div style={{fontFamily: 'Bebas', fontSize: 190, lineHeight: 1, marginTop: 30, opacity: lerp(frame, t - 12, t, 0, 1), transform: `scale(${lerp(frame, t - 12, t + 6, 1.1, 1)})`}}>
					A 1980s PAINT JOB
				</div>
			</div>
			<Grain opacity={0.2} />
			<Vignette strength={0.6} />
		</AbsoluteFill>
	);
};

// 22 · into the swamp: Grassrivers is the Everglades
export const S22: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const real = cue('everglades');
	return (
		<AbsoluteFill>
			<MapView d={d} from={[775, 535, 70, 50]} to={[730, 500, 140, 110]}>
				<ellipse cx={802} cy={572} rx={22} ry={16} fill="#6E9C5A" opacity={lerp(frame, real - 10, real + 10, 0, 0.45)} />
				<Dot p={P.miami} label="Miami" at={0} r={1.2} size={3.6} />
				<text x={786} y={566} fontFamily="Bebas" fontSize={6} fill="#2F5A26" opacity={lerp(frame, real, real + 10, 0, 1)} letterSpacing={0.4}>
					THE EVERGLADES
				</text>
			</MapView>
			<div style={{position: 'absolute', left: 120, top: 120}}>
				<Kicker>CHAPTER 4 · THE RIVER OF GRASS</Kicker>
			</div>
			<Label text="IN THE GAME: “GRASSRIVERS”" x={120} y={820} at={cue('grassrivers')} size={34} />
			<Label text="IN REAL LIFE: THE EVERGLADES" x={180} y={900} at={real} size={34} rot={1} />
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 23 · a river, not a field
export const S23: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const river = cue('river');
	return (
		<AbsoluteFill>
			<Full src="everglades_highsm.jpg" d={d} from={{x: 0, y: 0, s: 1.05}} to={{x: -40, y: -10, s: 1.18}} grade="contrast(1.08) saturate(1.1) brightness(.95)" />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,30,.5), rgba(10,20,30,0) 30%, rgba(10,20,30,0) 60%, rgba(5,12,20,.6))'}} />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{[0, 1, 2, 3, 4].map((i) => {
					const y = 700 + i * 60;
					const o = lerp(frame, river + i * 4, river + 14 + i * 4, 0, 0.8);
					const off = ((frame * 2 + i * 80) % 300) - 150;
					return (
						<g key={i} opacity={o}>
							<path d={`M ${300 + off} ${y} q 120 -20 240 0 t 240 0`} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="20 18" />
							<path d={`M ${1100 + off} ${y + 20} q 120 -20 240 0 t 240 0`} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="20 18" />
						</g>
					);
				})}
			</svg>
			<div style={{position: 'absolute', left: 110, top: 96, color: '#fff', fontFamily: 'Oswald'}}>
				<div style={{fontSize: 22, letterSpacing: 9}}>EVERGLADES NATIONAL PARK</div>
				<div style={{fontWeight: 300, fontSize: 19, letterSpacing: 5, opacity: 0.75, marginTop: 8}}>25.29° N &nbsp; 80.90° W</div>
			</div>
			<div style={{position: 'absolute', left: 110, top: 230, color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,.4)'}}>
				<div style={{fontFamily: 'Oswald', fontWeight: 300, fontSize: 120, opacity: lerp(frame, river - 4, river + 8, 0, 1)}}>It's a river.</div>
			</div>
			<div style={{position: 'absolute', right: 110, bottom: 110, textAlign: 'right', color: '#fff', fontFamily: 'Oswald', fontWeight: 300}}>
				<div style={{fontSize: 46, opacity: lerp(frame, cue('inches'), cue('inches') + 8, 0, 1)}}>often only inches deep</div>
				<div style={{fontSize: 46, opacity: lerp(frame, cue('dozens'), cue('dozens') + 8, 0, 1)}}>dozens of miles wide</div>
			</div>
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 24 · 1.3 million alligators
export const S24: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Full src="gator_menacing_2020.jpg" d={d} from={{x: 0, y: 0, s: 1.05}} to={{x: 30, y: 0, s: 1.15}} darken={0.25} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.7), rgba(0,0,0,0) 55%)'}} />
		<div style={{position: 'absolute', left: 130, top: 330, color: C.cream}}>
			<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 4, color: '#E8D9B0'}}>ALLIGATORS IN FLORIDA (FWC ESTIMATE)</div>
			<Counter to={1300000} at={cue('one')} dur={45} style={{fontFamily: 'Bebas', fontSize: 230, lineHeight: 1}} />
		</div>
		<Grain opacity={0.15} />
		<Vignette strength={0.5} />
	</AbsoluteFill>
);

// 25 · Burmese pythons
export const S25: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const snake = cue('burmese');
	const pts: string[] = [];
	const head = lerp(frame, snake - 6, snake + 90, -200, 2100, Easing.linear);
	for (let i = 0; i < 60; i++) {
		const x = head - i * 22;
		const y = 820 + Math.sin(x / 120 + frame / 10) * 40;
		pts.push(`${x},${y}`);
	}
	const car = cue('car');
	return (
		<AbsoluteFill>
			<Full src="egrets_highsm.jpg" d={d} from={{x: 0, y: 0, s: 1.05}} to={{x: 20, y: -10, s: 1.12}} darken={0.35} />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<polyline points={pts.join(' ')} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={56} strokeLinecap="round" strokeLinejoin="round" transform="translate(6 10)" />
				<polyline points={pts.join(' ')} fill="none" stroke="#4A3B1E" strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
				<polyline points={pts.join(' ')} fill="none" stroke="#A88A4E" strokeWidth={30} strokeDasharray="26 20" strokeLinecap="round" />
				<polyline points={pts.join(' ')} fill="none" stroke="#2C2210" strokeWidth={8} strokeDasharray="10 36" strokeLinecap="round" />
				{(() => {
					const [hx, hy] = pts[0].split(',').map(Number);
					return (
						<g transform={`translate(${hx} ${hy})`}>
							<ellipse cx={18} cy={0} rx={42} ry={26} fill="#4A3B1E" />
							<ellipse cx={22} cy={-4} rx={28} ry={14} fill="#A88A4E" />
							<circle cx={38} cy={-10} r={5} fill="#111" />
						</g>
					);
				})()}
			</svg>
			<div style={{position: 'absolute', left: 130, top: 140, color: C.cream}}>
				<Kicker color="#E8D9B0">AN INVASIVE SPECIES</Kicker>
				<div style={{fontFamily: 'Bebas', fontSize: 130, marginTop: 10, opacity: lerp(frame, snake, snake + 8, 0, 1)}}>BURMESE PYTHONS</div>
			</div>
			<div style={{position: 'absolute', left: 1180, top: 160, opacity: lerp(frame, car - 4, car + 6, 0, 1)}}>
				<div style={{fontFamily: 'Elite', fontSize: 26, color: C.cream}}>SOME GROW LONGER THAN A CAR</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}>
					<div style={{width: 500, height: 18, background: C.yellow}} />
					<div style={{fontFamily: 'Oswald', fontSize: 24, color: C.cream}}>PYTHON</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10}}>
					<div style={{width: 430, height: 18, background: '#8FA3B5'}} />
					<div style={{fontFamily: 'Oswald', fontSize: 24, color: C.cream}}>CAR</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 130, top: 420, color: C.cream, opacity: lerp(frame, cue('removed') - 4, cue('removed') + 8, 0, 1)}}>
				<Counter to={19000} at={cue('removed')} dur={40} suffix="+" style={{fontFamily: 'Bebas', fontSize: 170, lineHeight: 1}} />
				<div style={{fontFamily: 'Elite', fontSize: 28, color: '#E8D9B0'}}>REMOVED BY STATE CONTRACTORS SINCE 2017</div>
			</div>
			<Stamp onDark text="STILL THERE" x={1460} y={560} at={cue('still')} size={90} rot={-8} />
			<Grain opacity={0.15} />
			<Vignette strength={0.5} />
		</AbsoluteFill>
	);
};

// 26 · Marjory Stoneman Douglas
export const S26: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const book = cue('river');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.02}} to={{x: 980, y: 540, s: 1.1}}>
				<Photo src="douglas.jpg" x={180} y={150} w={400} h={590} rot={-3} at={cue('douglas') - 8} caption="Marjory Stoneman Douglas" captionFont="Caveat" sepia={0.2} />
				<div
					style={{
						position: 'absolute',
						left: 760,
						top: 160,
						width: 470,
						height: 680,
						background: '#2F4A2B',
						boxShadow: '0 22px 40px rgba(0,0,0,.4), inset 12px 0 0 rgba(0,0,0,.25)',
						transform: `rotate(2deg) scale(${lerp(frame, book - 10, book, 0.9, 1)})`,
						opacity: lerp(frame, book - 10, book, 0, 1),
						color: '#EFE3B8',
						textAlign: 'center',
						padding: '90px 40px',
						boxSizing: 'border-box',
					}}
				>
					<div style={{fontFamily: 'Elite', fontSize: 26, letterSpacing: 4}}>1947</div>
					<div style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 64, marginTop: 50, lineHeight: 1.05}}>The Everglades</div>
					<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontSize: 58, marginTop: 20}}>River of Grass</div>
					<div style={{width: 120, height: 2, background: '#EFE3B8', margin: '50px auto'}} />
					<div style={{fontFamily: 'Elite', fontSize: 24, letterSpacing: 2}}>MARJORY STONEMAN DOUGLAS</div>
				</div>
				<Stamp text="NATIONAL PARK · DEC 1947" x={1500} y={760} at={cue('dedicated')} size={60} rot={-6} color="#2F5A26" />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 27 · River of Grass -> Grassrivers
export const S27: React.FC<ShotProps> = ({d}) => {
	const frame = useCurrentFrame();
	const t = lerp(frame, 30, 60, 0, 1, Easing.inOut(Easing.cubic));
	return (
		<AbsoluteFill style={{background: '#13201A'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'Bebas', fontSize: 150, color: '#EFE3B8', letterSpacing: 6, opacity: lerp(frame, 56, 62, 1, 0)}}>
				<span style={{display: 'inline-block', transform: `translateX(${t * 300}px)`, opacity: 1 - t * 0.2}}>RIVER</span>
				<span style={{display: 'inline-block', margin: '0 40px', opacity: 1 - t}}>OF</span>
				<span style={{display: 'inline-block', transform: `translateX(${-t * 760}px)`, color: t > 0.5 ? C.yellow : '#EFE3B8'}}>GRASS</span>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'Bebas', fontSize: 170, color: C.yellow, letterSpacing: 8, opacity: lerp(frame, 58, 66, 0, 1), textShadow: '0 0 30px rgba(242,194,0,.35)'}}>
				GRASSRIVERS
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 300, fontSize: 40, letterSpacing: 8, color: '#9DB59A', opacity: lerp(frame, 60, 70, 0, 1)}}>
				ROCKSTAR JUST FLIPPED IT AROUND
			</div>
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// 28 · chapter 5: Florida Man
const Phone: React.FC<{x: number; y: number; rot: number; at: number; tint: string; label: string}> = ({x, y, rot, at, tint, label}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const p = lerp(frame, at, at + 10, 0, 1, Easing.out(Easing.back(1.4)));
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 300, height: 560, borderRadius: 40, background: '#111', padding: 14, boxSizing: 'border-box', transform: `rotate(${rot}deg) scale(${p})`, boxShadow: '0 20px 40px rgba(0,0,0,.5)'}}>
			<div style={{width: '100%', height: '100%', borderRadius: 28, background: tint, position: 'relative', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 18, top: 18, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Oswald', fontWeight: 700, color: '#fff', fontSize: 22}}>
					<div style={{width: 14, height: 14, borderRadius: 7, background: '#FF3B30', opacity: Math.floor(frame / 15) % 2 ? 1 : 0.3}} />
					REC
				</div>
				<div style={{position: 'absolute', bottom: 20, left: 18, right: 18, fontFamily: 'Oswald', fontSize: 24, color: '#fff', fontWeight: 700}}>{label}</div>
			</div>
		</div>
	);
};
export const S28: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const fm = cue('florida', 1);
	return (
		<AbsoluteFill style={{background: '#0E0E12'}}>
			<Cam d={d} from={{x: 960, y: 540, s: 1.0}} to={{x: 960, y: 540, s: 1.08}}>
				<Phone x={180} y={240} rot={-6} at={cue('chaos')} tint="linear-gradient(160deg,#FF8A5B,#7A3FB0)" label="you won't believe this…" />
				<Phone x={560} y={200} rot={3} at={cue('filming')} tint="linear-gradient(160deg,#2BC0E4,#1D3557)" label="only in florida 😳" />
				<Phone x={940} y={260} rot={-2} at={cue('filming') + 10} tint="linear-gradient(160deg,#F7B733,#FC4A1A)" label="bro what is he DOING" />
				<Phone x={1320} y={220} rot={5} at={cue('feed')} tint="linear-gradient(160deg,#56AB2F,#1E5631)" label="the gator was FINE" />
			</Cam>
			<AbsoluteFill style={{background: `rgba(14,14,18,${lerp(frame, fm - 10, fm, 0, 0.8)})`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: lerp(frame, fm - 6, fm + 4, 0, 1)}}>
				<Kicker color="#E0A84A" style={{letterSpacing: 10}}>CHAPTER 5</Kicker>
				<div style={{fontFamily: 'Bebas', fontSize: 220, color: C.cream, lineHeight: 1}}>FLORIDA MAN</div>
			</div>
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// 29 · the headlines
export const S29: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const lines = ['ARRESTED FOR ________', 'CHARGED AFTER ________', 'FOUND WITH ________', 'ARRESTED AGAIN FOR ________'];
	return (
		<AbsoluteFill>
			<Bg kind="card" />
			<Cam d={d} from={{x: 960, y: 520, s: 1.05}} to={{x: 960, y: 560, s: 1.0}}>
				{lines.map((l, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 160 + (i % 2) * 120,
							top: 140 + i * 200,
							transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`,
							background: '#F4EFE2',
							padding: '22px 40px',
							boxShadow: '0 10px 24px rgba(0,0,0,.25)',
							opacity: frame >= i * 10 ? 1 : 0,
						}}
					>
						<div style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 70, color: C.ink, whiteSpace: 'nowrap'}}>FLORIDA MAN {l}</div>
					</div>
				))}
			</Cam>
			<Label text="You've seen the headlines." x={1300} y={930} at={cue('seen')} size={30} />
			<Vignette />
		</AbsoluteFill>
	);
};

// 30 · the public records law
export const S30: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const law = cue('records');
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.0}} to={{x: 1000, y: 560, s: 1.08}}>
				<div style={{position: 'absolute', left: 160, top: 120, width: 820, height: 840, background: '#FBF7EC', boxShadow: '0 20px 40px rgba(40,25,10,.3)', transform: 'rotate(-1.5deg)', padding: 60, boxSizing: 'border-box', border: '1px solid #CFC3A8'}}>
					<div style={{fontFamily: 'Elite', fontSize: 24, letterSpacing: 3, color: '#3A3226'}}>FLORIDA STATUTES</div>
					<div style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 64, marginTop: 14, color: C.ink}}>Chapter 119</div>
					<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontSize: 40, color: '#3A3226'}}>Public Records</div>
					<div style={{height: 2, background: '#3A3226', margin: '30px 0'}} />
					<div style={{fontFamily: 'Elite', fontSize: 30, lineHeight: '48px', color: C.ink}}>
						<Typed text="Records are open for personal inspection and copying by any person." at={law} cps={32} />
					</div>
				</div>
				<div style={{position: 'absolute', left: 1100, top: 160, display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 24, opacity: lerp(frame, cue('mugshots') - 6, cue('mugshots') + 4, 0, 1)}}>
					{Array.from({length: 6}).map((_, i) => (
						<div key={i} style={{height: 240, background: '#BFC4C9', position: 'relative', boxShadow: '0 8px 16px rgba(0,0,0,.25)', overflow: 'hidden'}}>
							{[0, 1, 2, 3, 4].map((k) => (
								<div key={k} style={{position: 'absolute', left: 0, right: 0, top: 30 + k * 40, height: 2, background: 'rgba(0,0,0,.25)'}} />
							))}
							<div style={{position: 'absolute', left: 60, top: 50, width: 80, height: 80, borderRadius: 40, background: '#3B4048'}} />
							<div style={{position: 'absolute', left: 30, top: 140, width: 140, height: 120, borderRadius: '70px 70px 0 0', background: '#3B4048'}} />
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: 'Elite', fontSize: 18}}>?</div>
						</div>
					))}
				</div>
				<Stamp text="PUBLISHED SAME DAY" x={1420} y={820} at={cue('publish')} size={70} rot={-7} />
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 31 · the punchline
export const S31: React.FC<ShotProps> = ({cue}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#14110D'}}>
			<div style={{position: 'absolute', left: 200, right: 200, top: 300, color: C.cream, textAlign: 'center'}}>
				<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 6, color: '#B7A98C', opacity: lerp(frame, 0, 10, 0, 1)}}>SOME EXPERTS SAY IT'S NOT THE WHOLE STORY. BUT…</div>
				<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 80, lineHeight: 1.2, marginTop: 50}}>
					<Rise text="Florida doesn't have weirder people." at={cue("doesn't") - 4} gap={3} />
					<br />
					<Rise text="We just get to read about them." at={cue('read') - 8} gap={3} style={{color: C.yellow}} />
				</div>
			</div>
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// keep imports used in this file
void interpolate;
void clamp;
void Sticker;
void ChapterTitle;
void Rise;
