import React from 'react';

// Outdoor sets. Deep purples and navies with warm lights, like the top channels.
// World is 1920 x 1080; the ground line is around y = 880.

export const GROUND = 880;
const INK = '#140A28';

export type Time = 'night' | 'day' | 'dusk' | 'storm';

const SKY: Record<Time, [string, string, string]> = {
	night: ['#0E0A2E', '#2A1F6E', '#4B3AA8'],
	dusk: ['#2A1F6E', '#6A4FD8', '#F59A7A'],
	day: ['#5AA8F0', '#9FD0FA', '#E8F4FF'],
	storm: ['#0A0A1E', '#1E1F44', '#3A3A6A'],
};

export const Sky: React.FC<{time: Time; id?: string}> = ({time, id = 'sky'}) => {
	const [a, b, c] = SKY[time];
	return (
		<g>
			<defs>
				<linearGradient id={`${id}${time}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={a} />
					<stop offset="60%" stopColor={b} />
					<stop offset="100%" stopColor={c} />
				</linearGradient>
			</defs>
			<rect x={-400} y={-400} width={2720} height={1500} fill={`url(#${id}${time})`} />
			{time === 'night' ? [...Array(40)].map((_, i) => <circle key={i} cx={(i * 337) % 2400 - 200} cy={(i * 131) % 420} r={1.5 + (i % 3)} fill="#fff" opacity={0.5} />) : null}
			{time === 'day' ? (
				<g fill="#fff" opacity={0.9}>
					{[200, 900, 1500].map((x, i) => (
						<g key={x} transform={`translate(${x} ${120 + i * 40})`}>
							<ellipse cx={0} cy={0} rx={120} ry={46} />
							<ellipse cx={70} cy={-24} rx={80} ry={50} />
							<ellipse cx={-70} cy={-10} rx={70} ry={40} />
						</g>
					))}
				</g>
			) : null}
		</g>
	);
};

/** A row of buildings with lit windows. `back` = the far row (smaller, darker). */
export const City: React.FC<{time: Time; back?: boolean; seed?: number}> = ({time, back = false, seed = 0}) => {
	const lit = time === 'day' ? '#BFE3FA' : '#FFD98A';
	const wall = time === 'day' ? (back ? '#8FA3D8' : '#6E7FC0') : back ? '#22195A' : '#2E2470';
	const n = 11;
	return (
		<g>
			{[...Array(n)].map((_, i) => {
				const w = 190 + ((i * 53 + seed) % 70);
				const x = i * 220 - 300 + (back ? 90 : 0);
				const h = (back ? 520 : 420) + ((i * 137 + seed * 7) % 240);
				const top = GROUND - h;
				return (
					<g key={i}>
						<rect x={x} y={top} width={w} height={h} fill={wall} stroke={back ? 'none' : INK} strokeWidth={5} />
						{[...Array(Math.floor(h / 80))].map((__, r) =>
							[0, 1, 2].map((c) => {
								const on = (i * 3 + r * 7 + c * 5 + seed) % 4 !== 0;
								return <rect key={`${r}${c}`} x={x + 22 + c * ((w - 44) / 3)} y={top + 28 + r * 80} width={(w - 44) / 3 - 16} height={44} rx={4} fill={on ? lit : '#3A3090'} opacity={back ? 0.7 : 0.95} />;
							}),
						)}
					</g>
				);
			})}
		</g>
	);
};

/** The street itself: pavement, kerb, road with a reflective sheen. */
export const Road: React.FC<{time: Time; wet?: boolean}> = ({time, wet = false}) => (
	<g>
		<rect x={-400} y={GROUND} width={2720} height={60} fill={time === 'day' ? '#B9BCD6' : '#3A3368'} stroke={INK} strokeWidth={5} />
		<rect x={-400} y={GROUND + 60} width={2720} height={400} fill={time === 'day' ? '#55597A' : '#1C1640'} />
		{[...Array(12)].map((_, i) => (
			<rect key={i} x={i * 260 - 300} y={GROUND + 200} width={140} height={14} rx={7} fill={time === 'day' ? '#F2F2F2' : '#8F86C8'} opacity={0.8} />
		))}
		{wet
			? [...Array(9)].map((_, i) => <rect key={i} x={i * 240 - 100} y={GROUND + 70} width={60} height={300} fill="#FFD98A" opacity={0.12} />)
			: null}
	</g>
);

export const StreetLamp: React.FC<{x: number; time: Time}> = ({x, time}) => (
	<g>
		<rect x={x - 9} y={GROUND - 430} width={18} height={430} fill="#2A2350" stroke={INK} strokeWidth={4} />
		<path d={`M${x} ${GROUND - 430} Q${x + 40} ${GROUND - 470} ${x + 80} ${GROUND - 450}`} stroke="#2A2350" strokeWidth={14} fill="none" />
		<ellipse cx={x + 82} cy={GROUND - 440} rx={30} ry={14} fill="#FFE7A8" stroke={INK} strokeWidth={4} />
		{time !== 'day' ? <ellipse cx={x + 82} cy={GROUND - 300} rx={160} ry={300} fill="#FFE7A8" opacity={0.1} /> : null}
	</g>
);

export const BusStop: React.FC<{x: number}> = ({x}) => (
	<g stroke={INK} strokeWidth={5}>
		<rect x={x} y={GROUND - 320} width={16} height={320} fill="#3A3A6A" />
		<rect x={x + 300} y={GROUND - 320} width={16} height={320} fill="#3A3A6A" />
		<rect x={x - 10} y={GROUND - 340} width={340} height={26} rx={6} fill="#4B3AA8" />
		<rect x={x + 20} y={GROUND - 300} width={270} height={200} rx={8} fill="#9FD0FA" opacity={0.25} />
		<circle cx={x - 40} cy={GROUND - 380} r={36} fill="#FF5A5A" />
		<text x={x - 40} y={GROUND - 368} fontFamily="Fredoka" fontWeight={700} fontSize={34} fill="#fff" textAnchor="middle" stroke="none">
			B
		</text>
		<rect x={x - 44} y={GROUND - 344} width={8} height={344} fill="#3A3A6A" />
	</g>
);

export const Bus: React.FC<{x: number; doors?: number}> = ({x, doors = 1}) => (
	<g stroke={INK} strokeWidth={6}>
		<rect x={x} y={GROUND - 430} width={900} height={400} rx={40} fill="#E8453C" />
		<rect x={x + 20} y={GROUND - 400} width={860} height={150} rx={18} fill="#BFE3FA" />
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={x + 230 + i * 170} y1={GROUND - 400} x2={x + 230 + i * 170} y2={GROUND - 250} />
		))}
		<rect x={x + 60} y={GROUND - 240} width={160 * doors} height={200} rx={8} fill="#BFE3FA" opacity={0.9} />
		<rect x={x + 60 + 160 * doors} y={GROUND - 240} width={4} height={200} fill={INK} />
		{[x + 160, x + 740].map((wx) => (
			<g key={wx}>
				<circle cx={wx} cy={GROUND - 30} r={56} fill="#1C1830" />
				<circle cx={wx} cy={GROUND - 30} r={24} fill="#8F8AA8" />
			</g>
		))}
		<text x={x + 640} y={GROUND - 150} fontFamily="Fredoka" fontWeight={700} fontSize={70} fill="#fff" stroke="none">
			42
		</text>
	</g>
);

export const Car: React.FC<{x: number; color?: string; flip?: boolean; lights?: boolean; driver?: React.ReactNode}> = ({x, color = '#3FB7E8', flip = false, lights = false, driver}) => (
	<g transform={`translate(${x} ${GROUND + 120}) scale(${flip ? -1 : 1} 1)`} stroke={INK} strokeWidth={6} strokeLinejoin="round">
		<path d="M-300 -40 Q-310 -140 -220 -150 L-140 -160 Q-90 -260 40 -260 L130 -260 Q210 -250 240 -160 L300 -140 Q330 -120 320 -40 Z" fill={color} />
		{driver ? (
			<g>
				<defs>
					<clipPath id={`carwin${Math.round(x)}`}>
						<path d="M-110 -168 Q-70 -240 20 -240 L20 -168 Z M50 -240 L120 -240 Q180 -232 205 -168 L50 -168 Z" />
					</clipPath>
				</defs>
				<g clipPath={`url(#carwin${Math.round(x)})`}>
					<rect x={-120} y={-250} width={340} height={90} fill="#2A2350" stroke="none" />
					{driver}
				</g>
			</g>
		) : null}
		<path d="M-110 -168 Q-70 -240 20 -240 L20 -168 Z" fill="#BFE3FA" opacity={0.55} />
		<path d="M50 -240 L120 -240 Q180 -232 205 -168 L50 -168 Z" fill="#BFE3FA" opacity={0.55} />
		{[-190, 200].map((wx) => (
			<g key={wx}>
				<circle cx={wx} cy={-30} r={60} fill="#1C1830" />
				<circle cx={wx} cy={-30} r={26} fill="#C9CED8" />
			</g>
		))}
		<ellipse cx={305} cy={-100} rx={18} ry={14} fill="#FFF3B0" />
		{lights ? <path d="M320 -100 L700 -180 L700 0 Z" fill="#FFF3B0" opacity={0.18} stroke="none" /> : null}
	</g>
);

/** Rain. `t` is how far the drops have fallen (in pixels); freeze it to stop time. */
export const Rain: React.FC<{t: number; count?: number; long?: number; seed?: number}> = ({t, count = 90, long = 30, seed = 0}) => (
	<g>
		{[...Array(count)].map((_, i) => {
			const x = ((i * 263 + seed * 31) % 2400) - 240;
			const y = (((i * 151 + t * (0.7 + (i % 5) * 0.1)) % 1300) + 1300) % 1300 - 160;
			return long > 4 ? (
				<line key={i} x1={x} y1={y} x2={x - 4} y2={y + long} stroke="#BFE8FF" strokeWidth={3} opacity={0.55} strokeLinecap="round" />
			) : (
				<g key={i} transform={`translate(${x} ${y})`}>
					<path d="M0 -14 Q8 0 0 8 Q-8 0 0 -14 Z" fill="#DDF6FF" stroke={INK} strokeWidth={2} opacity={0.95} />
					<circle cx={-2} cy={-2} r={2} fill="#fff" />
				</g>
			);
		})}
	</g>
);

/** A puddle with a splash. `rise` 0 to 1 is how high the splash has got. */
export const Splash: React.FC<{x: number; rise: number}> = ({x, rise}) => (
	<g transform={`translate(${x} ${GROUND + 90})`}>
		<ellipse cx={0} cy={0} rx={200} ry={26} fill="#5FA8E8" stroke={INK} strokeWidth={5} opacity={0.85} />
		{rise > 0.02
			? [-140, -70, 0, 70, 140].map((dx, i) => {
					const h = (90 + (i % 2) * 60) * rise;
					return (
						<g key={dx}>
							<path d={`M${dx} -4 Q${dx + 8} ${-h * 0.6} ${dx + 22} ${-h}`} stroke="#CFF4FF" strokeWidth={14} fill="none" strokeLinecap="round" />
							<circle cx={dx + 24} cy={-h - 14} r={13} fill="#CFF4FF" stroke={INK} strokeWidth={3} />
						</g>
					);
				})
			: null}
	</g>
);

/** A pigeon, wings at `flap` (0 down, 1 up). */
export const Pigeon: React.FC<{x: number; y: number; flap: number; s?: number}> = ({x, y, flap, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
		<path d={`M-10 -10 Q-80 ${-60 - flap * 80} -150 ${-30 - flap * 120} Q-90 ${-10 - flap * 30} -20 10 Z`} fill="#8F8AB8" />
		<ellipse cx={0} cy={0} rx={70} ry={42} fill="#A9A4CC" />
		<circle cx={66} cy={-30} r={30} fill="#A9A4CC" />
		<path d="M94 -30 L120 -22 L94 -16 Z" fill="#FFB020" />
		<circle cx={74} cy={-36} r={6} fill={INK} />
		<path d={`M10 -10 Q60 ${-50 - flap * 90} 120 ${-20 - flap * 140} Q70 ${-0 - flap * 20} 20 10 Z`} fill="#BDB8DE" />
	</g>
);

/** A sports field: grass, a fence, the sky behind. */
export const Field: React.FC<{time?: Time; lines?: 'pitch' | 'track' | 'none'}> = ({time = 'day', lines = 'none'}) => (
	<g>
		<Sky time={time} id="field" />
		<rect x={-400} y={GROUND - 220} width={2720} height={40} fill="#2E6B4E" />
		{[...Array(30)].map((_, i) => (
			<rect key={i} x={i * 90 - 400} y={GROUND - 300} width={10} height={120} fill="#3A3A6A" />
		))}
		<rect x={-400} y={GROUND - 300} width={2720} height={10} fill="#3A3A6A" />
		<rect x={-400} y={GROUND - 180} width={2720} height={700} fill="#4FB070" />
		{[...Array(8)].map((_, i) => (
			<rect key={i} x={-400} y={GROUND - 180 + i * 90} width={2720} height={45} fill="#5BC07C" opacity={0.5} />
		))}
		{lines === 'track'
			? [...Array(6)].map((_, i) => <rect key={i} x={-400} y={GROUND - 140 + i * 70} width={2720} height={60} fill="#D9644A" stroke="#fff" strokeWidth={5} />)
			: null}
	</g>
);

export const Goal: React.FC<{x: number}> = ({x}) => (
	<g stroke="#fff" strokeWidth={14} fill="none">
		<rect x={x} y={GROUND - 520} width={760} height={480} />
		{[...Array(12)].map((_, i) => (
			<line key={i} x1={x + i * 64} y1={GROUND - 520} x2={x + i * 64} y2={GROUND - 40} strokeWidth={3} opacity={0.6} />
		))}
		{[...Array(8)].map((_, i) => (
			<line key={i} x1={x} y1={GROUND - 520 + i * 64} x2={x + 760} y2={GROUND - 520 + i * 64} strokeWidth={3} opacity={0.6} />
		))}
	</g>
);

export const Ball: React.FC<{x: number; y: number; r: number; color?: string}> = ({x, y, r, color = '#FFFFFF'}) => (
	<g>
		<circle cx={x} cy={y} r={r} fill={color} stroke={INK} strokeWidth={Math.max(3, r * 0.08)} />
		<path d={`M${x - r * 0.3} ${y - r * 0.3} l${r * 0.3} ${-r * 0.15} l${r * 0.3} ${r * 0.15} l${-r * 0.1} ${r * 0.35} l${-r * 0.4} 0 Z`} fill={INK} />
		<ellipse cx={x - r * 0.4} cy={y - r * 0.45} rx={r * 0.22} ry={r * 0.12} fill="#fff" opacity={0.7} />
	</g>
);

/** Lightning, drawn up to `p` (0 to 1) of its length. */
export const Lightning: React.FC<{p: number; x?: number}> = ({p, x = 1200}) => {
	const pts: Array<[number, number]> = [
		[x, -200],
		[x - 60, 0],
		[x + 40, 120],
		[x - 80, 300],
		[x + 20, 420],
		[x - 60, 600],
	];
	const n = Math.max(2, Math.ceil(pts.length * p));
	const d = pts
		.slice(0, n)
		.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`)
		.join(' ');
	return (
		<g>
			<path d={d} stroke="#BFE8FF" strokeWidth={40} fill="none" opacity={0.35} strokeLinejoin="round" />
			<path d={d} stroke="#fff" strokeWidth={12} fill="none" strokeLinejoin="round" />
			{p > 0.5 ? <path d={`M${x + 40} 120 L${x + 160} 220 L${x + 130} 330`} stroke="#fff" strokeWidth={6} fill="none" /> : null}
		</g>
	);
};
