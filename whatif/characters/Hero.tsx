import React, {useId} from 'react';

// The hero: a faceless "you". A glossy orange round head (no hair, no nose,
// no ears) so anyone can picture themselves, a deep purple hoodie with a
// glowing "?" on the chest, charcoal joggers and white trainers with orange
// soles. Drawn 1000 units tall, feet at (0, 0).

export const HERO = {
	ink: '#24152F',
	head: '#FF8A3D',
	headLight: '#FFC08A',
	headDark: '#D85A22',
	hoodie: '#5B3FD6',
	hoodieLight: '#8A6CFF',
	hoodieDark: '#33208F',
	legs: '#2B2A3A',
	legsLight: '#45445A',
	shoe: '#F7F5FF',
	sole: '#FF8A3D',
	emblem: '#FFD84A',
} as const;

export type HeroFace = 'smug' | 'shocked' | 'determined' | 'happy' | 'scared' | 'sad' | 'neutral';
export type Arm = [number, number];

export type HeroProps = {
	x: number;
	y: number;
	/** Height on screen, in pixels. */
	size: number;
	face?: HeroFace;
	/** Degrees: 0 hangs down, 90 sticks out sideways, 180 points up. [upper arm, forearm]. */
	armL?: Arm;
	armR?: Arm;
	/** Closed fists instead of open hands. */
	fists?: boolean;
	/** Feet apart (0 together, 1 wide power stance). */
	stance?: number;
	/** Where the eyes look, -1 to 1. */
	look?: [number, number];
	/** Head tilt in degrees. */
	tilt?: number;
	/** 0 to 1: glowing power aura. */
	aura?: number;
	auraColor?: string;
	flip?: boolean;
	blink?: number;
	/** Hand to chin (thinking): overrides armR. */
	thinking?: boolean;
};

const r = (d: number) => (d * Math.PI) / 180;

const Hand: React.FC<{x: number; y: number; angle: number; fist: boolean; id: string}> = ({x, y, angle, fist, id}) => (
	<g transform={`translate(${x} ${y}) rotate(${-angle})`}>
		{fist ? (
			<g>
				<ellipse cx={0} cy={20} rx={46} ry={42} fill={`url(#skin${id})`} stroke={HERO.ink} strokeWidth={7} />
				<path d="M-30 6 Q-14 -2 2 6 M-26 30 Q-8 22 10 30" stroke={HERO.headDark} strokeWidth={6} fill="none" strokeLinecap="round" />
			</g>
		) : (
			<g>
				<path d="M-38 0 Q-50 56 -24 82 Q0 96 26 82 Q50 56 38 0 Z" fill={`url(#skin${id})`} stroke={HERO.ink} strokeWidth={7} strokeLinejoin="round" />
				<ellipse cx={34} cy={30} rx={16} ry={24} fill={`url(#skin${id})`} stroke={HERO.ink} strokeWidth={6} transform="rotate(-20 34 30)" />
			</g>
		)}
	</g>
);

const ArmShape: React.FC<{side: 1 | -1; a: Arm; fist: boolean; id: string}> = ({side, a, fist, id}) => {
	const sx = 118 * side;
	const sy = -600;
	const ex = sx + Math.sin(r(a[0])) * 135 * side;
	const ey = sy + Math.cos(r(a[0])) * 135;
	const hx = ex + Math.sin(r(a[1])) * 120 * side;
	const hy = ey + Math.cos(r(a[1])) * 120;
	const d = `M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}`;
	return (
		<g>
			<path d={d} stroke={HERO.ink} strokeWidth={92 + 14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={HERO.hoodie} strokeWidth={92} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={HERO.hoodieLight} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.45} transform={`translate(${-14 * side} -10)`} />
			<circle cx={hx} cy={hy} r={44} fill={HERO.hoodieDark} stroke={HERO.ink} strokeWidth={7} />
			<Hand x={hx + Math.sin(r(a[1])) * 30 * side} y={hy + Math.cos(r(a[1])) * 30} angle={a[1] * side} fist={fist} id={id} />
		</g>
	);
};

const Eyes: React.FC<{face: HeroFace; look: [number, number]; blink: number}> = ({face, look, blink}) => {
	const lx = look[0] * 12;
	const ly = look[1] * 10;
	if (face === 'happy') {
		return (
			<g stroke={HERO.ink} strokeWidth={16} fill="none" strokeLinecap="round">
				<path d="M-98 -760 Q-64 -800 -30 -760" />
				<path d="M30 -760 Q64 -800 98 -760" />
			</g>
		);
	}
	const big = face === 'shocked' || face === 'scared';
	const rx = big ? 40 : 34;
	const ry = big ? 52 : 44;
	const pr = big ? 13 : 19;
	const lid = blink > 0 ? blink : face === 'smug' ? 0.45 : face === 'determined' ? 0.32 : face === 'sad' ? 0.3 : 0;
	return (
		<g>
			{[-64, 64].map((cx) => {
				const lidSide = face === 'smug' ? (cx < 0 ? 0.5 : 0.4) : lid;
				const cid = `eye${cx < 0 ? 'L' : 'R'}${Math.round(rx)}`;
				const lidY = -765 - ry + ry * 2 * lidSide;
				const slope = face === 'determined' ? (cx < 0 ? 10 : -10) : face === 'sad' ? (cx < 0 ? -10 : 10) : 0;
				return (
					<g key={cx}>
						<defs>
							<clipPath id={cid}>
								<ellipse cx={cx} cy={-765} rx={rx} ry={ry} />
							</clipPath>
						</defs>
						<ellipse cx={cx} cy={-765} rx={rx} ry={ry} fill="#FFFFFF" />
						<g clipPath={`url(#${cid})`}>
							<ellipse cx={cx + lx} cy={-760 + ly} rx={pr} ry={pr * 1.25} fill={HERO.ink} />
							<circle cx={cx + lx + pr * 0.45} cy={-760 + ly - pr * 0.55} r={pr * 0.38} fill="#fff" />
							{lidSide > 0 ? (
								<path d={`M${cx - rx - 10} ${-765 - ry - 10} L${cx + rx + 10} ${-765 - ry - 10} L${cx + rx + 10} ${lidY - slope} Q${cx} ${lidY + 10} ${cx - rx - 10} ${lidY + slope} Z`} fill={HERO.head} />
							) : null}
							{lidSide > 0 ? <path d={`M${cx - rx - 10} ${lidY + slope} Q${cx} ${lidY + 10} ${cx + rx + 10} ${lidY - slope}`} stroke={HERO.ink} strokeWidth={9} fill="none" /> : null}
						</g>
						<ellipse cx={cx} cy={-765} rx={rx} ry={ry} fill="none" stroke={HERO.ink} strokeWidth={7} />
					</g>
				);
			})}
		</g>
	);
};

const Brows: React.FC<{face: HeroFace}> = ({face}) => {
	// [inner y, outer y] offsets per brow, from a base line
	const base = -836;
	const shapes: Record<HeroFace, [number, number, number, number]> = {
		neutral: [0, 0, 0, 0],
		smug: [6, -6, -22, -8],
		shocked: [-26, -22, -26, -22],
		determined: [22, -12, 22, -12],
		happy: [-14, -8, -14, -8],
		scared: [-28, -6, -28, -6],
		sad: [-20, 10, -20, 10],
	};
	const [li, lo, ri, ro] = shapes[face];
	return (
		<g stroke={HERO.ink} strokeWidth={20} strokeLinecap="round" fill="none">
			<path d={`M-108 ${base + lo} Q-70 ${base + (lo + li) / 2 - 10} -32 ${base + li}`} />
			<path d={`M32 ${base + ri} Q70 ${base + (ro + ri) / 2 - 10} 108 ${base + ro}`} />
		</g>
	);
};

const Mouth: React.FC<{face: HeroFace}> = ({face}) => {
	const y = -660;
	switch (face) {
		case 'smug':
			return <path d={`M-40 ${y} Q10 ${y + 18} 52 ${y - 14}`} stroke={HERO.ink} strokeWidth={13} fill="none" strokeLinecap="round" />;
		case 'shocked':
			return (
				<g>
					<ellipse cx={0} cy={y + 6} rx={30} ry={40} fill="#5A1A2A" stroke={HERO.ink} strokeWidth={8} />
					<ellipse cx={0} cy={y + 30} rx={18} ry={10} fill="#F27A8A" />
				</g>
			);
		case 'determined':
			return <path d={`M-40 ${y + 4} Q0 ${y - 6} 40 ${y + 4}`} stroke={HERO.ink} strokeWidth={13} fill="none" strokeLinecap="round" />;
		case 'happy':
			return (
				<g>
					<path d={`M-60 ${y - 16} Q0 ${y - 22} 60 ${y - 16} Q50 ${y + 50} 0 ${y + 52} Q-50 ${y + 50} -60 ${y - 16} Z`} fill="#5A1A2A" stroke={HERO.ink} strokeWidth={8} strokeLinejoin="round" />
					<path d={`M-50 ${y - 14} Q0 ${y - 4} 50 ${y - 14} L48 ${y - 2} Q0 ${y + 8} -48 ${y - 2} Z`} fill="#fff" />
					<ellipse cx={0} cy={y + 34} rx={26} ry={12} fill="#F27A8A" />
				</g>
			);
		case 'scared':
			return <path d={`M-44 ${y + 4} Q-30 ${y - 10} -14 ${y + 4} Q0 ${y + 16} 14 ${y + 4} Q30 ${y - 10} 44 ${y + 4}`} stroke={HERO.ink} strokeWidth={12} fill="none" strokeLinecap="round" />;
		case 'sad':
			return <path d={`M-40 ${y + 10} Q0 ${y - 16} 40 ${y + 10}`} stroke={HERO.ink} strokeWidth={13} fill="none" strokeLinecap="round" />;
		default:
			return <path d={`M-30 ${y} Q0 ${y + 10} 30 ${y}`} stroke={HERO.ink} strokeWidth={12} fill="none" strokeLinecap="round" />;
	}
};

export const Hero: React.FC<HeroProps> = ({
	x,
	y,
	size,
	face = 'neutral',
	armL = [14, 8],
	armR = [14, 8],
	fists = false,
	stance = 0.3,
	look = [0, 0],
	tilt = 0,
	aura = 0,
	auraColor = '#FFB020',
	flip = false,
	blink = 0,
	thinking = false,
}) => {
	const id = useId().replace(/[^a-zA-Z0-9]/g, '');
	const k = size / 1000;
	const legX = 40 + stance * 70;
	const ar: Arm = thinking ? [18, 196] : armR;
	return (
		<g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * k} ${k})`}>
			<defs>
				<radialGradient id={`head${id}`} cx="38%" cy="32%" r="75%">
					<stop offset="0%" stopColor={HERO.headLight} />
					<stop offset="45%" stopColor={HERO.head} />
					<stop offset="100%" stopColor={HERO.headDark} />
				</radialGradient>
				<radialGradient id={`skin${id}`} cx="40%" cy="30%" r="80%">
					<stop offset="0%" stopColor={HERO.headLight} />
					<stop offset="60%" stopColor={HERO.head} />
					<stop offset="100%" stopColor={HERO.headDark} />
				</radialGradient>
				<linearGradient id={`body${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor={HERO.hoodieLight} />
					<stop offset="45%" stopColor={HERO.hoodie} />
					<stop offset="100%" stopColor={HERO.hoodieDark} />
				</linearGradient>
				<linearGradient id={`legs${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor={HERO.legsLight} />
					<stop offset="100%" stopColor={HERO.legs} />
				</linearGradient>
				<filter id={`soft${id}`} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation={18} />
				</filter>
				<filter id={`glow${id}`} x="-60%" y="-60%" width="220%" height="220%">
					<feGaussianBlur stdDeviation={40} />
				</filter>
			</defs>
			{aura > 0 ? (
				<g opacity={aura}>
					<ellipse cx={0} cy={-500} rx={420} ry={560} fill={auraColor} filter={`url(#glow${id})`} opacity={0.75} />
					<ellipse cx={0} cy={-520} rx={300} ry={470} fill="#FFF3C4" filter={`url(#glow${id})`} opacity={0.5} />
				</g>
			) : null}
			<ellipse cx={0} cy={-6} rx={250} ry={34} fill="rgba(10,5,30,0.45)" filter={`url(#soft${id})`} />
			{/* legs */}
			{[-1, 1].map((s) => (
				<g key={s}>
					<path d={`M${s * 30} -320 L${s * legX} -70`} stroke={HERO.ink} strokeWidth={96} strokeLinecap="round" />
					<path d={`M${s * 30} -320 L${s * legX} -70`} stroke={`url(#legs${id})`} strokeWidth={82} strokeLinecap="round" />
					{/* trainer */}
					<g transform={`translate(${s * (legX + 18)} -34)`}>
						<path d={`M${-70} 6 Q-78 -50 -20 -58 L30 -58 Q86 -50 92 0 L92 14 L-70 14 Z`} transform={s < 0 ? 'scale(-1 1)' : undefined} fill={HERO.shoe} stroke={HERO.ink} strokeWidth={7} strokeLinejoin="round" />
						<rect x={-74} y={8} width={170} height={26} rx={12} transform={s < 0 ? 'scale(-1 1)' : undefined} fill={HERO.sole} stroke={HERO.ink} strokeWidth={7} />
						<path d="M-30 -30 Q10 -14 52 -36" transform={s < 0 ? 'scale(-1 1)' : undefined} stroke={HERO.hoodie} strokeWidth={12} fill="none" strokeLinecap="round" />
					</g>
				</g>
			))}
			{/* back arm (drawn behind body when it hangs down) */}
			<ArmShape side={-1} a={armL} fist={fists} id={id} />
			{/* hoodie body */}
			<path d="M-150 -640 Q0 -680 150 -640 Q190 -470 168 -300 Q160 -270 130 -270 L-130 -270 Q-160 -270 -168 -300 Q-190 -470 -150 -640 Z" fill={`url(#body${id})`} stroke={HERO.ink} strokeWidth={9} strokeLinejoin="round" />
			<path d="M-120 -330 L120 -330" stroke={HERO.hoodieDark} strokeWidth={24} strokeLinecap="round" />
			<path d="M-96 -420 Q0 -440 96 -420 L110 -340 L-110 -340 Z" fill={HERO.hoodieDark} opacity={0.5} />
			{/* the "?" emblem */}
			<g transform="translate(0 -500)">
				<circle r={58} fill={HERO.emblem} opacity={0.25} filter={`url(#soft${id})`} />
				<circle r={44} fill={HERO.hoodieDark} stroke={HERO.emblem} strokeWidth={8} />
				<text x={0} y={22} fontFamily="Fredoka" fontWeight={700} fontSize={64} fill={HERO.emblem} textAnchor="middle">
					?
				</text>
			</g>
			{/* drawstrings */}
			{[-44, 44].map((dx) => (
				<g key={dx}>
					<path d={`M${dx} -620 Q${dx * 1.1} -580 ${dx * 1.05} -540`} stroke={HERO.ink} strokeWidth={16} fill="none" strokeLinecap="round" />
					<path d={`M${dx} -620 Q${dx * 1.1} -580 ${dx * 1.05} -540`} stroke={HERO.sole} strokeWidth={8} fill="none" strokeLinecap="round" />
				</g>
			))}
			{thinking ? null : <ArmShape side={1} a={ar} fist={fists} id={id} />}
			{/* head, with the hood bunched behind the neck */}
			<g transform={`rotate(${tilt} 0 -640)`}>
				<path d="M-170 -640 Q0 -560 170 -640 Q150 -720 0 -720 Q-150 -720 -170 -640 Z" fill={HERO.hoodieDark} stroke={HERO.ink} strokeWidth={9} />
				<circle cx={0} cy={-780} r={190} fill={`url(#head${id})`} stroke={HERO.ink} strokeWidth={9} />
				<path d="M120 -900 Q185 -800 140 -660" stroke="#FFE2C4" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.55} />
				<ellipse cx={-78} cy={-886} rx={52} ry={28} fill="#fff" opacity={0.65} transform="rotate(-28 -78 -886)" />
				<circle cx={-128} cy={-846} r={11} fill="#fff" opacity={0.6} />
				<ellipse cx={-92} cy={-700} rx={34} ry={18} fill="#FF6A4A" opacity={0.35} />
				<ellipse cx={92} cy={-700} rx={34} ry={18} fill="#FF6A4A" opacity={0.35} />
				<Brows face={face} />
				<Eyes face={face} look={look} blink={blink} />
				<Mouth face={face} />
				{face === 'scared' ? <path d="M160 -880 Q182 -840 166 -820 Q146 -840 160 -880 Z" fill="#9FD6F5" stroke={HERO.ink} strokeWidth={6} /> : null}
			</g>
			{thinking ? <ArmShape side={1} a={ar} fist id={id} /> : null}
		</g>
	);
};
