import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Bg, C, Cam, clamp, Counter, Draw, Full, Grain, img, Kicker, Label, lerp, Neon, Photo, Rise, Stamp, Typed, Vignette, Water} from '../../docs-kit/kit';
import {Dot, MapView, MiniMap, P} from '../../docs-kit/map';
import type {ShotProps} from './timeline';

// 32 · back to 1980
export const S32: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const at = cue('nineteen');
	return (
		<AbsoluteFill>
			<Full src="miami_1980b.jpg" d={d} from={{x: 0, y: 0, s: 1.08}} to={{x: 0, y: 0, s: 1.0}} grade="saturate(.6) sepia(.25) brightness(.5)" letterbox={110} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
				<Kicker color="#E0A84A" style={{letterSpacing: 12}}>CHAPTER 6 · THE VICE YEARS</Kicker>
				<div style={{fontFamily: 'Bebas', fontSize: 320, color: C.cream, lineHeight: 1, opacity: lerp(frame, at - 6, at + 4, 0, 1), transform: `scale(${lerp(frame, at - 6, at + 30, 1.15, 1)})`}}>1980</div>
			</div>
			<Grain opacity={0.35} />
			<Vignette strength={0.7} />
		</AbsoluteFill>
	);
};

// 33 · the Mariel boatlift
export const S33: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const go = cue('crossed');
	const routes = [
		`M ${P.mariel[0]} ${P.mariel[1]} Q 790 620 ${P.keywest[0]} ${P.keywest[1] + 1}`,
		`M ${P.mariel[0] + 2} ${P.mariel[1] - 1} Q 805 615 ${P.miami[0] - 2} ${P.miami[1] + 3}`,
	];
	return (
		<AbsoluteFill>
			<MapView d={d} from={[728, 560, 185, 115]} to={[738, 562, 168, 112]} style="navy" hi={['12']}>
				{routes.map((r, i) => (
					<Draw key={i} d={r} at={go + i * 6} dur={40} color={C.yellow} width={0.7} dash="1.6 1.2" len={140} />
				))}
				{Array.from({length: 14}).map((_, i) => {
					const t = ((frame - go - i * 6) / 80) % 1;
					if (frame < go + i * 6) return null;
					const k = i % 2;
					const a = P.mariel;
					const b = k ? P.miami : P.keywest;
					const cx = k ? 805 : 790;
					const cy = k ? 615 : 620;
					const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * cx + t * t * b[0];
					const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * cy + t * t * b[1];
					return <circle key={i} cx={x} cy={y} r={0.55} fill={C.cream} />;
				})}
				<Dot p={P.mariel} label="Mariel, Cuba" at={0} r={1} size={3.4} color={C.yellow} textColor={C.cream} dx={-20} dy={5} />
				<Dot p={P.keywest} label="Key West" at={0} r={1} size={3.4} color={C.yellow} textColor={C.cream} dx={-14} dy={-2} />
				<Dot p={P.miami} label="Miami" at={0} r={1} size={3.4} color={C.yellow} textColor={C.cream} />
			</MapView>
			<div style={{position: 'absolute', left: 120, top: 130, color: C.cream}}>
				<Kicker color="#E0A84A">APRIL – OCTOBER 1980</Kicker>
				<Counter to={125000} at={go - 10} dur={50} style={{fontFamily: 'Bebas', fontSize: 170, lineHeight: 1}} />
				<div style={{fontFamily: 'Elite', fontSize: 26, color: '#C9D3DE'}}>PEOPLE, BY BOAT</div>
			</div>
			<Photo src="mariel_keywest_1980.jpg" x={1260} y={560} w={480} h={360} rot={3} at={cue('mariel') - 10} caption="Key West, 1980" captionFont="Caveat" />
			<Label text="THE MARIEL BOATLIFT" x={130} y={900} at={cue('mariel')} dark size={34} />
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 34 · cocaine, money, violence, "Paradise Lost?"
export const S34: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const coke = cue('cocaine');
	const mag = cue('time');
	return (
		<AbsoluteFill>
			<MapView d={mag} from={[640, 470, 330, 260]} to={[700, 500, 260, 200]} style="navy" hi={['12']}>
				{[0, 1, 2].map((i) => (
					<Draw
						key={i}
						d={`M ${900 + i * 30} ${760} Q ${850 + i * 10} ${650} ${P.miami[0] + 2} ${P.miami[1] + 2}`}
						at={coke + i * 6}
						dur={30}
						color="#E8E8E8"
						width={1.2}
						len={260}
						arrow
					/>
				))}
				<text x={860} y={640} fontFamily="Bebas" fontSize={9} fill="#E8E8E8" opacity={lerp(frame, coke + 10, coke + 20, 0, 1)}>
					COCAINE
				</text>
			</MapView>
			<div style={{position: 'absolute', left: 120, top: 130}}>
				<Stamp onDark text="DRUG MONEY" x={260} y={60} at={cue('money')} size={80} rot={-6} color={C.yellow} box />
				<Stamp onDark text="VIOLENCE" x={260} y={200} at={cue('violence')} size={80} rot={4} color="#FF5A4E" box />
			</div>
			<AbsoluteFill style={{opacity: lerp(frame, mag - 6, mag + 6, 0, 1)}}>
				<Full src="skyline_1980.jpg" d={d - mag} from={{x: 0, y: 0, s: 1.05}} to={{x: 0, y: 0, s: 1.1}} grade="saturate(.7) brightness(.45)" />
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', color: C.cream}}>
					<div style={{fontFamily: 'Elite', fontSize: 34, letterSpacing: 6, color: '#E0A84A'}}>TIME MAGAZINE COVER, 1981</div>
					<div style={{fontFamily: 'Playfair', fontWeight: 700, fontStyle: 'italic', fontSize: 170, marginTop: 30}}>
						<Typed text="“Paradise Lost?”" at={cue('paradise') - 4} cps={14} />
					</div>
				</div>
			</AbsoluteFill>
			<Grain opacity={0.2} />
			<Vignette strength={0.5} />
		</AbsoluteFill>
	);
};

// 35 · only about a quarter
export const S35: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const q = cue('quarter');
	const a = lerp(frame, q - 6, q + 14, 0, 90);
	const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
	const arc = `M 0 0 L ${Math.cos(rad(0)) * 260} ${Math.sin(rad(0)) * 260} A 260 260 0 0 1 ${Math.cos(rad(a)) * 260} ${Math.sin(rad(a)) * 260} Z`;
	return (
		<AbsoluteFill style={{background: '#0E1620'}}>
			<Bg kind="navy" />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<g transform="translate(1340 560)">
					<circle r={260} fill="#2A3A4C" />
					{a > 0.5 && <path d={arc} fill={C.gold} stroke="#0E1620" strokeWidth={4} />}
				</g>
			</svg>
			<div style={{position: 'absolute', left: 130, top: 300, width: 760, color: C.cream}}>
				<div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 70, lineHeight: 1.1}}>
					<Rise text="The new arrivals got much of the blame." at={0} gap={3} />
				</div>
				<div style={{fontFamily: 'Oswald', fontWeight: 300, fontSize: 44, marginTop: 40, color: '#C9D3DE', opacity: lerp(frame, q - 20, q - 8, 0, 1)}}>
					One criminologist's estimate of their share of the rise in crime:
				</div>
				<div style={{fontFamily: 'Bebas', fontSize: 150, color: C.gold, opacity: lerp(frame, q, q + 10, 0, 1)}}>ABOUT 1/4</div>
			</div>
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 36 · Scarface, Miami Vice
export const S36: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const words: [string, string, string, number, number][] = [
		['PASTEL SUITS', 'pastel', '#7FE7FF', 180, 760],
		['FAST CARS', 'fast', '#FF4FA3', 620, 820],
		['NEON', 'neon', '#FFD84F', 1050, 760],
		['SYNTH MUSIC', 'synth', '#B67CFF', 1380, 820],
	];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2A1033, #0B0510 70%)'}}>
			<svg width={1920} height={1080} style={{position: 'absolute', opacity: 0.35}}>
				{Array.from({length: 22}).map((_, i) => (
					<line key={i} x1={960} y1={540} x2={-400 + i * 130} y2={1080} stroke="#FF4FA3" strokeWidth={1.5} />
				))}
				{Array.from({length: 8}).map((_, i) => (
					<line key={`h${i}`} x1={0} y1={600 + i * i * 9} x2={1920} y2={600 + i * i * 9} stroke="#FF4FA3" strokeWidth={1.5} />
				))}
			</svg>
			<div style={{position: 'absolute', left: 180, top: 150}}>
				<Kicker color="#FFB3D9">HOLLYWOOD SAW A STORY</Kicker>
			</div>
			<div style={{position: 'absolute', left: 180, top: 260, display: 'flex', gap: 140}}>
				<div style={{opacity: frame >= cue('scarface') - 8 ? 1 : 0}}>
					<div style={{fontFamily: 'Elite', fontSize: 36, color: '#FFB3D9'}}>1983 · FILM</div>
					<Neon text="SCARFACE" color="#FF4F4F" size={130} at={cue('scarface') - 8} />
				</div>
				<div style={{opacity: frame >= cue('vice') - 10 ? 1 : 0}}>
					<div style={{fontFamily: 'Elite', fontSize: 36, color: '#B3F0FF'}}>1984 · TV SHOW</div>
					<Neon text="MIAMI VICE" color="#3FE0FF" size={130} at={cue('vice') - 10} />
				</div>
			</div>
			{words.map(([t, w, c, x, y], i) => (
				<div key={i} style={{position: 'absolute', left: x, top: y}}>
					<Neon text={t} color={c} size={64} at={cue(w)} />
				</div>
			))}
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// 37 · 2002: Grand Theft Auto: Vice City
export const S37: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const city = cue('city');
	const parts: [string, string, string][] = [
		['cardoza_color.jpg', 'hotels', 'the pastel hotels'],
		['skyline_1980.jpg', 'cocaine', 'the cocaine-era crime'],
		['', 'soundtrack', 'the Miami Vice soundtrack'],
	];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2A1033, #0B0510 70%)'}}>
			<div style={{position: 'absolute', left: 150, top: 120}}>
				<Neon text="2002" color="#FF4FA3" size={140} at={cue('two') - 4} />
			</div>
			<div style={{position: 'absolute', left: 150, top: 330, display: 'flex', gap: 60}}>
				{parts.map(([src, w, cap], i) => {
					const a = cue(w) - 4;
					const o = lerp(frame, a, a + 8, 0, 1);
					return (
						<div key={i} style={{opacity: o, transform: `translateY(${(1 - o) * 30}px)`}}>
							<div style={{width: 460, height: 300, background: '#120818', border: '3px solid #FF4FA3', boxShadow: '0 0 30px rgba(255,79,163,.5)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								{src ? (
									<div style={{width: '100%', height: '100%', background: `url(${img(src)}) center/cover`, filter: 'saturate(1.3)'}} />
								) : (
									<svg width={260} height={170} viewBox="0 0 260 170">
										<rect x={5} y={5} width={250} height={160} rx={14} fill="none" stroke="#3FE0FF" strokeWidth={6} />
										<circle cx={80} cy={80} r={30} fill="none" stroke="#3FE0FF" strokeWidth={6} />
										<circle cx={180} cy={80} r={30} fill="none" stroke="#3FE0FF" strokeWidth={6} />
										<rect x={60} y={125} width={140} height={30} fill="none" stroke="#3FE0FF" strokeWidth={5} />
									</svg>
								)}
							</div>
							<div style={{fontFamily: 'Oswald', fontSize: 34, color: '#FFE3F1', marginTop: 16}}>{cap}</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', opacity: lerp(frame, city - 30, city - 18, 0, 1)}}>
				<div style={{fontFamily: 'Bebas', fontSize: 120, color: C.cream, letterSpacing: 6}}>GRAND THEFT AUTO: VICE CITY</div>
			</div>
			<Grain opacity={0.2} />
		</AbsoluteFill>
	);
};

// 38 · a memory of Miami
export const S38: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const m = cue('memory');
	const strip = ['cardoza_color.jpg', 'v_highsmith2.jpg', 'skyline_1980.jpg', 'v_highsmith0.jpg', 'miami_1980a.jpg', 'cardoza_color.jpg', 'v_highsmith2.jpg'];
	const x = -frame * 2.2;
	return (
		<AbsoluteFill style={{background: '#0B0510'}}>
			<div style={{position: 'absolute', left: x, top: 230, display: 'flex', gap: 0, background: '#111', padding: '34px 0'}}>
				{strip.map((s, i) => (
					<div key={i} style={{width: 520, height: 360, margin: '0 14px', background: `url(${img(s)}) center/cover`, filter: 'saturate(1.25) sepia(.25) blur(.4px)', opacity: 0.85}} />
				))}
			</div>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(11,5,16,0) 30%, rgba(11,5,16,.85) 85%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', color: C.cream}}>
				<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 110, opacity: lerp(frame, m - 6, m + 8, 0, 1)}}>a memory of Miami</div>
				<div style={{fontFamily: 'Oswald', fontWeight: 300, fontSize: 38, letterSpacing: 6, marginTop: 20, opacity: lerp(frame, cue('movies'), cue('movies') + 10, 0, 1)}}>
					BUILT FROM MOVIES, TV SHOWS, AND A 1980s PAINT JOB
				</div>
			</div>
			<Grain opacity={0.25} />
		</AbsoluteFill>
	);
};

// 39 · the population boom (US Census)
const POP: [number, number][] = [
	[1900, 528542], [1910, 752619], [1920, 968470], [1930, 1468211], [1940, 1897414], [1950, 2771305], [1960, 4951560],
	[1970, 6789443], [1980, 9746324], [1990, 12937926], [2000, 15982378], [2010, 18801310], [2020, 21538187],
];
export const S39: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const x0 = 1120, x1 = 1800, y0 = 860, y1 = 430;
	const X = (y: number) => x0 + ((y - 1900) / 120) * (x1 - x0);
	const Y = (p: number) => y0 - (p / 25e6) * (y0 - y1);
	const start = cue('nineteen');
	const prog = lerp(frame, start, cue('million', 1) + 6, 0, 1, Easing.inOut(Easing.cubic));
	const n = 1 + prog * (POP.length - 1);
	const pts = POP.filter((_, i) => i < n).map(([y, p]) => [X(y), Y(p)] as [number, number]);
	const k = Math.floor(n - 1);
	if (k < POP.length - 1) {
		const f = n - 1 - k;
		const [ya, pa] = POP[k];
		const [yb, pb] = POP[k + 1];
		pts.push([X(ya + (yb - ya) * f), Y(pa + (pb - pa) * f)]);
	}
	const line = pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
	const area = `M ${x0} ${y0} L ${line.split(' ').join(' L ')} L ${pts[pts.length - 1][0]} ${y0} Z`;
	return (
		<AbsoluteFill>
			<Bg kind="navy" />
			<div style={{position: 'absolute', left: -40, top: 250, opacity: 0.95}}>
				<MiniMap w={1060} h={660} vb={[0, 20, 975, 610]} style="navy" />
			</div>
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<defs>
					<linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={C.gold} stopOpacity={0.45} />
						<stop offset="1" stopColor={C.gold} stopOpacity={0.03} />
					</linearGradient>
				</defs>
				{[5e6, 10e6, 15e6, 20e6].map((v) => (
					<g key={v}>
						<line x1={x0} x2={x1} y1={Y(v)} y2={Y(v)} stroke="#2A3A4C" />
						<text x={x0 - 14} y={Y(v) + 6} textAnchor="end" fontFamily="Oswald" fontWeight={300} fontSize={18} fill="#8A9AAC">
							{v / 1e6}M
						</text>
					</g>
				))}
				<line x1={x0} x2={x1} y1={y0} y2={y0} stroke="#5A6C80" strokeWidth={1.5} />
				{[1900, 1950, 2000, 2020].map((y) => (
					<text key={y} x={X(y)} y={y0 + 34} textAnchor="middle" fontFamily="Oswald" fontWeight={300} fontSize={18} fill="#8A9AAC">
						{y}
					</text>
				))}
				{prog > 0 && <path d={area} fill="url(#ag)" />}
				{prog > 0 && <polyline points={line} fill="none" stroke={C.gold} strokeWidth={3} strokeLinejoin="round" />}
				<circle cx={X(1900)} cy={Y(528542)} r={6} fill={C.gold} stroke="#0E1620" strokeWidth={2} opacity={lerp(frame, start, start + 6, 0, 1)} />
				<text x={X(1900) + 14} y={Y(528542) - 16} fontFamily="Oswald" fontSize={22} fill="#C9D3DE" opacity={lerp(frame, start, start + 6, 0, 1)}>
					0.5M in 1900
				</text>
				{prog > 0.98 && (
					<>
						<circle cx={X(2020)} cy={Y(21538187)} r={7} fill={C.gold} stroke="#0E1620" strokeWidth={2} />
						<text x={X(2020) - 12} y={Y(21538187) - 22} textAnchor="end" fontFamily="Oswald" fontWeight={700} fontSize={30} fill={C.cream}>
							21.5M in 2020
						</text>
					</>
				)}
			</svg>
			<div style={{position: 'absolute', left: 110, top: 96}}>
				<Kicker color="#E0A84A">CHAPTER 7 · THE BOOM THAT NEVER STOPPED</Kicker>
				<div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 76, color: C.cream, marginTop: 10, opacity: lerp(frame, cue('forty') - 4, cue('forty') + 6, 0, 1)}}>
					Florida grew 40× in 120 years
				</div>
			</div>
			<div style={{position: 'absolute', left: 1120, top: 330, fontFamily: 'Oswald', fontWeight: 300, fontSize: 22, letterSpacing: 2, color: '#8A9AAC'}}>FLORIDA POPULATION, EVERY CENSUS 1900–2020</div>
			<Label text="2014: PASSES NEW YORK, NOW 3RD BIGGEST STATE" x={1050} y={920} at={cue('overtook')} dark size={26} />
			<div style={{position: 'absolute', left: 110, bottom: 36, fontFamily: 'Oswald', fontWeight: 300, fontSize: 17, letterSpacing: 2, color: '#6E7E90'}}>SOURCE: U.S. CENSUS BUREAU</div>
			<Grain opacity={0.12} />
		</AbsoluteFill>
	);
};

// 40 · draining, dredging, building
export const S40: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Full src="aerial_bay_2020.jpg" d={d} from={{x: 0, y: 0, s: 1.05}} to={{x: -40, y: 0, s: 1.16}} grade="contrast(1.05) saturate(1.05) brightness(.55)" />
		<Stamp onDark text="DRAINING." x={420} y={260} at={cue('draining')} size={120} rot={-6} color={C.yellow} />
		<Stamp onDark text="DREDGING." x={960} y={430} at={cue('dredging')} size={120} rot={3} color={C.yellow} />
		<Stamp onDark text="BUILDING." x={1460} y={600} at={cue('building')} size={120} rot={-4} color={C.yellow} />
		<Label text="right up to the edge of the water" x={640} y={900} at={cue('edge')} dark size={32} />
		<Grain opacity={0.15} />
		<Vignette strength={0.5} />
	</AbsoluteFill>
);

// 41 · the edge is moving
export const S41: React.FC<ShotProps> = ({d}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Full src="aerial_bay_2020.jpg" d={d} from={{x: -40, y: 0, s: 1.16}} to={{x: -50, y: 0, s: 1.2}} grade="contrast(1.05) saturate(.8) brightness(.6)" />
			<Water level={lerp(frame, 0, d, 1080, 860)} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 100, color: C.cream, textShadow: '0 4px 24px rgba(0,0,0,.6)'}}>
				And that edge is moving.
			</div>
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 42 · Vice City will look like this forever
export const S42: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const wont = cue("won't");
	return (
		<AbsoluteFill>
			<Full src="skyline_bay_1980.jpg" d={d} from={{x: 0, y: 0, s: 1.04}} to={{x: 0, y: 0, s: 1.1}} grade={`saturate(${lerp(frame, wont - 10, wont + 20, 1.2, 0.6)}) brightness(.85)`} />
			<Water level={lerp(frame, wont - 6, d, 1080, 700)} opacity={0.6} />
			<div style={{position: 'absolute', left: 120, top: 120, color: C.cream, textShadow: '0 3px 18px rgba(0,0,0,.6)'}}>
				<Kicker color="#E0A84A">CHAPTER 8 · RACING THE SEA</Kicker>
				<div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 70, marginTop: 14}}>
					<Rise text="In the game, it looks like this forever." at={4} gap={3} />
				</div>
				<div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 70, color: '#FFB0A8', opacity: lerp(frame, wont - 6, wont + 4, 0, 1)}}>The real one won't.</div>
			</div>
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

// 43 · limestone: water comes up from underneath
export const S43: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const up = cue('underneath');
	const rise = lerp(frame, cue('rises'), up + 40, 0, 1);
	const seaY = 560 - rise * 70;
	const holes: [number, number, number][] = [];
	for (let i = 0; i < 70; i++) holes.push([120 + ((i * 197) % 1300), 640 + ((i * 89) % 330), 10 + (i % 4) * 5]);
	const seep = lerp(frame, up - 10, up + 50, 0, 1);
	const puddle = lerp(frame, cue('sunny') - 10, cue('sunny') + 20, 0, 1);
	return (
		<AbsoluteFill style={{background: '#CFE3EC'}}>
			<svg width={1920} height={1080}>
				<rect x={0} y={0} width={1920} height={560} fill="#BFDDEA" />
				<circle cx={1680} cy={160} r={70} fill="#F6D365" opacity={lerp(frame, cue('sunny') - 10, cue('sunny'), 0, 1)} />
				{/* the city on top */}
				{[160, 330, 480, 700, 900, 1100].map((x, i) => (
					<rect key={i} x={x} y={360 - (i % 3) * 90} width={120} height={200 + (i % 3) * 90} fill={['#F4B6C2', '#A8E0CC', '#C9B6E4'][i % 3]} stroke="#3A3226" strokeWidth={3} />
				))}
				<rect x={0} y={556} width={1440} height={14} fill="#55595E" />
				{/* limestone */}
				<rect x={0} y={570} width={1440} height={510} fill="#D8CBA8" />
				{holes.map(([x, y, r], i) => (
					<circle key={i} cx={x} cy={y} r={r} fill={y > 1000 - seep * 430 ? '#3C7FA6' : '#B9AA84'} />
				))}
				{/* the sea on the right */}
				<rect x={1440} y={seaY} width={480} height={1080 - seaY} fill="#3C7FA6" />
				<path d={`M 1440 ${seaY} q 60 -10 120 0 t 120 0 t 120 0 t 120 0`} fill="none" stroke="#fff" strokeWidth={3} />
				{/* water coming up through the street */}
				{[260, 600, 1000].map((x, i) => (
					<ellipse key={i} cx={x} cy={556} rx={90 * puddle} ry={10 * puddle} fill="#3C7FA6" opacity={0.9} />
				))}
				{[0, 1, 2, 3, 4].map((i) => (
					<path key={i} d={`M ${250 + i * 240} 1000 L ${250 + i * 240} 600`} stroke="#3C7FA6" strokeWidth={6} strokeDasharray="14 16" strokeDashoffset={-frame * 3} opacity={seep} markerEnd="" />
				))}
			</svg>
			<Label text="LIMESTONE: A ROCK FULL OF HOLES" x={120} y={980} at={cue('limestone')} size={30} />
			<Label text="THE SEA RISES" x={1480} y={420} at={cue('rises')} size={28} />
			<div style={{position: 'absolute', left: 120, top: 90}}>
				<div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 64, color: C.ink, opacity: lerp(frame, up - 6, up + 4, 0, 1)}}>The water comes up from underneath.</div>
				<div style={{fontFamily: 'Oswald', fontWeight: 300, fontSize: 40, color: '#3A3226', opacity: lerp(frame, cue('sunny') - 4, cue('sunny') + 6, 0, 1)}}>Flooding on sunny days, at the highest tides of the year.</div>
			</div>
		</AbsoluteFill>
	);
};

// 44 · two feet by 2060, 50 days a year by 2050
export const S44: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const a = cue('two');
	const p = lerp(frame, a - 4, a + 40, 0, 1);
	const x0 = 200, x1 = 1000, y0 = 820, yTop = 380;
	return (
		<AbsoluteFill>
			<Bg kind="navy" />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<line x1={x0} x2={x1} y1={y0} y2={y0} stroke="#5A6C80" strokeWidth={2} />
				<text x={x0} y={y0 + 40} fontFamily="Oswald" fontSize={24} fill="#8A9AAC">TODAY</text>
				<text x={x1} y={y0 + 40} textAnchor="end" fontFamily="Oswald" fontSize={24} fill="#8A9AAC">~2060</text>
				<path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${y0 - 60} ${x0 + (x1 - x0) * p} ${y0 - (y0 - yTop) * p * p}`} fill="none" stroke="#5FB3E0" strokeWidth={6} />
				{p > 0.95 && (
					<text x={x1 - 10} y={yTop - 24} textAnchor="end" fontFamily="Bebas" fontSize={90} fill={C.cream}>
						+2 FT
					</text>
				)}
			</svg>
			<div style={{position: 'absolute', left: 200, top: 130, fontFamily: 'Elite', fontSize: 28, color: '#C9D3DE', letterSpacing: 3}}>SEA LEVEL RISE EXPECTED BY LOCAL PLANNERS</div>
			<div style={{position: 'absolute', left: 1180, top: 330, color: C.cream, opacity: lerp(frame, cue('noaa') - 6, cue('noaa') + 6, 0, 1)}}>
				<div style={{fontFamily: 'Elite', fontSize: 28, color: '#C9D3DE'}}>NOAA WARNING: HIGH-TIDE FLOODING BY 2050</div>
				<div style={{fontFamily: 'Bebas', fontSize: 200, lineHeight: 1}}>
					UP TO <Counter to={50} at={cue('fifty') - 4} dur={30} />
				</div>
				<div style={{fontFamily: 'Oswald', fontWeight: 300, fontSize: 50}}>days a year</div>
			</div>
			<Grain opacity={0.12} />
		</AbsoluteFill>
	);
};

// 45 · fighting back
export const S45: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Full src="aerial_bay_2020.jpg" d={d} from={{x: 40, y: 0, s: 1.1}} to={{x: 0, y: 0, s: 1.02}} grade="contrast(1.05) brightness(.6)" />
			<div style={{position: 'absolute', left: 120, top: 120, color: C.cream}}>
				<Kicker color="#E0A84A">MIAMI BEACH IS FIGHTING BACK</Kicker>
			</div>
			<Label text="RAISING ROADS" x={160} y={300} at={cue('raising')} dark size={40} />
			<Label text="PUMPS: HUNDREDS OF MILLIONS OF DOLLARS" x={220} y={400} at={cue('pumps')} dark size={40} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', color: C.cream, textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>
				<div style={{fontFamily: 'Bebas', fontSize: 130, opacity: lerp(frame, cue('decades') - 4, cue('decades') + 6, 0, 1)}}>DECADES? ✓</div>
				<div style={{fontFamily: 'Bebas', fontSize: 130, color: '#FFB0A8', opacity: lerp(frame, cue('century') - 4, cue('century') + 6, 0, 1)}}>A CENTURY?</div>
			</div>
			<Grain opacity={0.15} />
			<Vignette strength={0.5} />
		</AbsoluteFill>
	);
};

// 46 · recap
export const S46: React.FC<ShotProps> = ({d, cue}) => {
	const items: [string, string, string, number, number, number, boolean][] = [
		['orange_grove_1904.jpg', 'frost', 'a frost', 120, 130, -4, true],
		['v_hurricane1926.jpg', 'hurricane', 'a hurricane', 700, 110, 3, true],
		['cardoza_color.jpg', 'paint', 'a paint job', 1320, 130, -2, false],
		['everglades_highsm.jpg', 'grass', 'a river of grass', 160, 580, 2, false],
		['skyline_1980.jpg', 'crime', 'a crime wave', 760, 600, -3, false],
		['realestate_billboard_1922.jpg', 'headlines', 'the headlines', 1340, 590, 3, true],
	];
	return (
		<AbsoluteFill>
			<Bg kind="paper" />
			<Cam d={d} from={{x: 960, y: 540, s: 1.08}} to={{x: 960, y: 540, s: 0.98}}>
				{items.map(([src, w, cap, x, y, r, bw], i) => (
					<Photo key={i} src={src} x={x} y={y} w={440} h={300} rot={r} at={cue(w) - 6} bw={bw} caption={cap} captionFont="Caveat" />
				))}
			</Cam>
			<Vignette />
		</AbsoluteFill>
	);
};

// 47 · the race against the sea
export const S47: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Full src="skyline_bay_1980.jpg" d={d} from={{x: 0, y: 0, s: 1.1}} to={{x: 0, y: 0, s: 1.0}} grade="saturate(.8) brightness(.6)" />
			<Water level={lerp(frame, 0, d, 900, 760)} opacity={0.55} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', color: C.cream, textShadow: '0 4px 24px rgba(0,0,0,.6)'}}>
				<div style={{fontFamily: 'Bebas', fontSize: 210, lineHeight: 1}}>WHY FLORIDA?</div>
				<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 56, marginTop: 20, opacity: lerp(frame, cue('race') - 10, cue('race'), 0, 1)}}>
					The real Vice City is in a race against the sea.
				</div>
			</div>
			<Grain opacity={0.2} />
			<Vignette strength={0.6} />
		</AbsoluteFill>
	);
};

// 48 · next time: Arrakis
export const S48: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const sub = cue('subscribe');
	const dunes = (o: number, amp: number, y: number) => {
		let s = `M 0 1080 L 0 ${y}`;
		for (let x = 0; x <= 1920; x += 40) s += ` L ${x} ${(y + Math.sin(x / 260 + o + frame / 200) * amp + Math.sin(x / 90 + o) * amp * 0.25).toFixed(1)}`;
		return s + ' L 1920 1080 Z';
	};
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #F6C27A 0%, #E8955A 45%, #B9603A 100%)'}}>
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<circle cx={1450} cy={300} r={120} fill="#FFE7B8" opacity={0.9} />
				<path d={dunes(0, 40, 640)} fill="#D88A4E" />
				<path d={dunes(2, 50, 760)} fill="#B9693C" />
				<path d={dunes(4, 60, 880)} fill="#8E4A2A" />
			</svg>
			<div style={{position: 'absolute', left: 150, top: 230, color: '#2A160C'}}>
				<Kicker color="#5A2A14">NEXT TIME</Kicker>
				<div style={{fontFamily: 'Bebas', fontSize: 190, lineHeight: 0.95, marginTop: 14, opacity: lerp(frame, cue('arrakis') - 8, cue('arrakis') + 4, 0, 1)}}>
					COULD ARRAKIS
					<br />
					REALLY EXIST?
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 150,
					top: 720,
					padding: '22px 46px',
					background: '#C4302B',
					color: '#fff',
					fontFamily: 'Oswald',
					fontWeight: 700,
					fontSize: 48,
					letterSpacing: 2,
					borderRadius: 10,
					transform: `scale(${lerp(frame, sub - 6, sub + 6, 0.6, 1, Easing.out(Easing.back(2)))})`,
					opacity: lerp(frame, sub - 6, sub, 0, 1),
					boxShadow: '0 12px 24px rgba(0,0,0,.3)',
				}}
			>
				SUBSCRIBE
			</div>
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

void interpolate;
void clamp;
void Cam;
