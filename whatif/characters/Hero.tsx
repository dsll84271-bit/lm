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

/** Colours (and hair) so the same body can be anyone in the world. */
export type Look = {
	head: string;
	headLight: string;
	headDark: string;
	hoodie: string;
	hoodieLight: string;
	hoodieDark: string;
	legs: string;
	legsLight: string;
	shoe: string;
	sole: string;
	/** The glowing "?" is the hero's alone. */
	emblem?: boolean;
	hair?: 'none' | 'bun' | 'spiky' | 'long' | 'cap' | 'short';
	hairColor?: string;
	/** A collared top instead of a hoodie (teachers, doctors, the TV host). */
	collar?: boolean;
	glasses?: boolean;
};

export const YOU: Look = {...HERO, emblem: true, hair: 'none'};

const tint = (hex: string, amt: number) => {
	const n = parseInt(hex.slice(1), 16);
	const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + (amt > 0 ? (255 - c) * amt : c * amt))));
	const r2 = f(n >> 16);
	const g = f((n >> 8) & 255);
	const b = f(n & 255);
	return `#${((r2 << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

/** A quick look for an extra: head colour, top colour, hair. */
export const person = (head: string, top: string, hair: Look['hair'] = 'none', hairColor = '#2A1E2E', extra: Partial<Look> = {}): Look => ({
	head,
	headLight: tint(head, 0.45),
	headDark: tint(head, -0.25),
	hoodie: top,
	hoodieLight: tint(top, 0.35),
	hoodieDark: tint(top, -0.35),
	legs: '#2B2A3A',
	legsLight: '#45445A',
	shoe: '#F7F5FF',
	sole: tint(top, -0.2),
	hair,
	hairColor,
	...extra,
});

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
	who?: Look;
	/** Walk cycle 0 to 1. */
	walk?: number;
	/** Sitting down: the legs fold forward. */
	sit?: boolean;
	/** Talking: 0 to 1 mouth open. */
	talk?: number;
	/** Squash for landings / jumps. */
	squash?: number;
	opacity?: number;
};

const r = (d: number) => (d * Math.PI) / 180;

// The palette being drawn. Set at the start of each <Hero> render.
let P: Look = YOU;
const INK = HERO.ink;

const Hand: React.FC<{x: number; y: number; angle: number; fist: boolean; id: string}> = ({x, y, angle, fist, id}) => (
	<g transform={`translate(${x} ${y}) rotate(${-angle})`}>
		{fist ? (
			<g>
				<ellipse cx={0} cy={20} rx={46} ry={42} fill={`url(#skin${id})`} stroke={INK} strokeWidth={7} />
				<path d="M-30 6 Q-14 -2 2 6 M-26 30 Q-8 22 10 30" stroke={P.headDark} strokeWidth={6} fill="none" strokeLinecap="round" />
			</g>
		) : (
			<g>
				<path d="M-38 0 Q-50 56 -24 82 Q0 96 26 82 Q50 56 38 0 Z" fill={`url(#skin${id})`} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
				<ellipse cx={34} cy={30} rx={16} ry={24} fill={`url(#skin${id})`} stroke={INK} strokeWidth={6} transform="rotate(-20 34 30)" />
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
			<path d={d} stroke={INK} strokeWidth={92 + 14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={P.hoodie} strokeWidth={92} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={P.hoodieLight} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.45} transform={`translate(${-14 * side} -10)`} />
			<circle cx={hx} cy={hy} r={44} fill={P.hoodieDark} stroke={INK} strokeWidth={7} />
			<Hand x={hx + Math.sin(r(a[1])) * 30 * side} y={hy + Math.cos(r(a[1])) * 30} angle={a[1] * side} fist={fist} id={id} />
		</g>
	);
};

const Eyes: React.FC<{face: HeroFace; look: [number, number]; blink: number}> = ({face, look, blink}) => {
	const lx = look[0] * 12;
	const ly = look[1] * 10;
	if (face === 'happy') {
		return (
			<g stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round">
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
							<ellipse cx={cx + lx} cy={-760 + ly} rx={pr} ry={pr * 1.25} fill={INK} />
							<circle cx={cx + lx + pr * 0.45} cy={-760 + ly - pr * 0.55} r={pr * 0.38} fill="#fff" />
							{lidSide > 0 ? (
								<path d={`M${cx - rx - 10} ${-765 - ry - 10} L${cx + rx + 10} ${-765 - ry - 10} L${cx + rx + 10} ${lidY - slope} Q${cx} ${lidY + 10} ${cx - rx - 10} ${lidY + slope} Z`} fill={P.head} />
							) : null}
							{lidSide > 0 ? <path d={`M${cx - rx - 10} ${lidY + slope} Q${cx} ${lidY + 10} ${cx + rx + 10} ${lidY - slope}`} stroke={INK} strokeWidth={9} fill="none" /> : null}
						</g>
						<ellipse cx={cx} cy={-765} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={7} />
					</g>
				);
			})}
		</g>
	);
};

const Hair: React.FC = () => {
	const c = P.hairColor ?? '#2A1E2E';
	switch (P.hair) {
		case 'spiky':
			return <path d="M-180 -840 L-150 -960 L-100 -900 L-60 -990 L-10 -910 L40 -1000 L80 -910 L130 -975 L150 -880 L185 -830 Q120 -900 0 -905 Q-120 -900 -180 -840 Z" fill={c} stroke={INK} strokeWidth={9} strokeLinejoin="round" />;
		case 'short':
		case 'bun':
		case 'long':
			return <path d="M-188 -800 Q-190 -972 0 -972 Q190 -972 188 -800 Q150 -890 60 -880 Q0 -860 -60 -884 Q-150 -890 -188 -800 Z" fill={c} stroke={INK} strokeWidth={9} strokeLinejoin="round" />;
		case 'cap':
			return (
				<g stroke={INK} strokeWidth={9} strokeLinejoin="round">
					<path d="M-186 -820 Q-180 -975 0 -975 Q180 -975 186 -820 Z" fill={c} />
					<path d="M-186 -820 Q-120 -790 60 -800 L250 -790 Q240 -830 186 -830 Z" fill={c} />
				</g>
			);
		default:
			return null;
	}
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
		<g stroke={INK} strokeWidth={20} strokeLinecap="round" fill="none">
			<path d={`M-108 ${base + lo} Q-70 ${base + (lo + li) / 2 - 10} -32 ${base + li}`} />
			<path d={`M32 ${base + ri} Q70 ${base + (ro + ri) / 2 - 10} 108 ${base + ro}`} />
		</g>
	);
};

const Mouth: React.FC<{face: HeroFace}> = ({face}) => {
	const y = -660;
	switch (face) {
		case 'smug':
			return <path d={`M-40 ${y} Q10 ${y + 18} 52 ${y - 14}`} stroke={INK} strokeWidth={13} fill="none" strokeLinecap="round" />;
		case 'shocked':
			return (
				<g>
					<ellipse cx={0} cy={y + 6} rx={30} ry={40} fill="#5A1A2A" stroke={INK} strokeWidth={8} />
					<ellipse cx={0} cy={y + 30} rx={18} ry={10} fill="#F27A8A" />
				</g>
			);
		case 'determined':
			return <path d={`M-40 ${y + 4} Q0 ${y - 6} 40 ${y + 4}`} stroke={INK} strokeWidth={13} fill="none" strokeLinecap="round" />;
		case 'happy':
			return (
				<g>
					<path d={`M-60 ${y - 16} Q0 ${y - 22} 60 ${y - 16} Q50 ${y + 50} 0 ${y + 52} Q-50 ${y + 50} -60 ${y - 16} Z`} fill="#5A1A2A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
					<path d={`M-50 ${y - 14} Q0 ${y - 4} 50 ${y - 14} L48 ${y - 2} Q0 ${y + 8} -48 ${y - 2} Z`} fill="#fff" />
					<ellipse cx={0} cy={y + 34} rx={26} ry={12} fill="#F27A8A" />
				</g>
			);
		case 'scared':
			return <path d={`M-44 ${y + 4} Q-30 ${y - 10} -14 ${y + 4} Q0 ${y + 16} 14 ${y + 4} Q30 ${y - 10} 44 ${y + 4}`} stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />;
		case 'sad':
			return <path d={`M-40 ${y + 10} Q0 ${y - 16} 40 ${y + 10}`} stroke={INK} strokeWidth={13} fill="none" strokeLinecap="round" />;
		default:
			return <path d={`M-30 ${y} Q0 ${y + 10} 30 ${y}`} stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />;
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
	who = YOU,
	walk,
	sit = false,
	talk = 0,
	squash = 1,
	opacity = 1,
}) => {
	P = who;
	const id = useId().replace(/[^a-zA-Z0-9]/g, '');
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2);
	const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk * Math.PI * 2)) * 18;
	const sitDrop = sit ? 230 : 0;
	const k = size / 1000;
	const legX = 40 + stance * 70;
	const ar: Arm = thinking ? [18, 196] : armR;
	return (
		<g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * k * (2 - squash)} ${k * squash})`} opacity={opacity}>
			<defs>
				<radialGradient id={`head${id}`} cx="38%" cy="32%" r="75%">
					<stop offset="0%" stopColor={P.headLight} />
					<stop offset="45%" stopColor={P.head} />
					<stop offset="100%" stopColor={P.headDark} />
				</radialGradient>
				<radialGradient id={`skin${id}`} cx="40%" cy="30%" r="80%">
					<stop offset="0%" stopColor={P.headLight} />
					<stop offset="60%" stopColor={P.head} />
					<stop offset="100%" stopColor={P.headDark} />
				</radialGradient>
				<linearGradient id={`body${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor={P.hoodieLight} />
					<stop offset="45%" stopColor={P.hoodie} />
					<stop offset="100%" stopColor={P.hoodieDark} />
				</linearGradient>
				<linearGradient id={`legs${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor={P.legsLight} />
					<stop offset="100%" stopColor={P.legs} />
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
			{[-1, 1].map((s) => {
				const lift = walk === undefined ? 0 : Math.max(0, w * s) * 46;
				const swing = walk === undefined ? 0 : w * s * 16;
				const hipY = sit ? -110 : -320;
				const footX = sit ? s * (legX + 30) : s * legX + swing;
				const footY = sit ? -64 : -70 - lift;
				return (
					<g key={s}>
						<path d={`M${s * 30} ${hipY} L${footX} ${footY}`} stroke={INK} strokeWidth={96} strokeLinecap="round" />
						<path d={`M${s * 30} ${hipY} L${footX} ${footY}`} stroke={`url(#legs${id})`} strokeWidth={82} strokeLinecap="round" />
						{/* trainer */}
						<g transform={`translate(${footX + s * 18} ${-34 - lift})`}>
							<path d={`M${-70} 6 Q-78 -50 -20 -58 L30 -58 Q86 -50 92 0 L92 14 L-70 14 Z`} transform={s < 0 ? 'scale(-1 1)' : undefined} fill={P.shoe} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
							<rect x={-74} y={8} width={170} height={26} rx={12} transform={s < 0 ? 'scale(-1 1)' : undefined} fill={P.sole} stroke={INK} strokeWidth={7} />
							<path d="M-30 -30 Q10 -14 52 -36" transform={s < 0 ? 'scale(-1 1)' : undefined} stroke={P.hoodie} strokeWidth={12} fill="none" strokeLinecap="round" />
						</g>
					</g>
				);
			})}
			<g transform={`translate(0 ${sitDrop - bob})`}>
			{/* back arm (drawn behind body when it hangs down) */}
			<ArmShape side={-1} a={armL} fist={fists} id={id} />
			{/* hoodie body */}
			<path d="M-150 -640 Q0 -680 150 -640 Q190 -470 168 -300 Q160 -270 130 -270 L-130 -270 Q-160 -270 -168 -300 Q-190 -470 -150 -640 Z" fill={`url(#body${id})`} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
			<path d="M-120 -330 L120 -330" stroke={P.hoodieDark} strokeWidth={24} strokeLinecap="round" />
			<path d="M-96 -420 Q0 -440 96 -420 L110 -340 L-110 -340 Z" fill={P.hoodieDark} opacity={0.5} />
			{P.emblem ? (
				<g transform="translate(0 -500)">
					<circle r={58} fill={HERO.emblem} opacity={0.25} filter={`url(#soft${id})`} />
					<circle r={44} fill={P.hoodieDark} stroke={HERO.emblem} strokeWidth={8} />
					<text x={0} y={22} fontFamily="Fredoka" fontWeight={700} fontSize={64} fill={HERO.emblem} textAnchor="middle">
						?
					</text>
				</g>
			) : null}
			{P.collar ? (
				<g stroke={INK} strokeWidth={7} strokeLinejoin="round">
					<path d="M-70 -640 L0 -560 L-20 -630 Z M70 -640 L0 -560 L20 -630 Z" fill="#fff" />
					<path d="M0 -560 L0 -300" stroke={P.hoodieDark} strokeWidth={6} />
				</g>
			) : (
				[-44, 44].map((dx) => (
					<g key={dx}>
						<path d={`M${dx} -620 Q${dx * 1.1} -580 ${dx * 1.05} -540`} stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
						<path d={`M${dx} -620 Q${dx * 1.1} -580 ${dx * 1.05} -540`} stroke={P.sole} strokeWidth={8} fill="none" strokeLinecap="round" />
					</g>
				))
			)}
			{thinking ? null : <ArmShape side={1} a={ar} fist={fists} id={id} />}
			{/* head, with the hood bunched behind the neck */}
			<g transform={`rotate(${tilt} 0 -640)`}>
				{P.collar ? null : <path d="M-170 -640 Q0 -560 170 -640 Q150 -720 0 -720 Q-150 -720 -170 -640 Z" fill={P.hoodieDark} stroke={INK} strokeWidth={9} />}
				{P.hair === 'long' ? <path d="M-200 -800 Q-210 -560 -150 -520 L150 -520 Q210 -560 200 -800 Z" fill={P.hairColor} stroke={INK} strokeWidth={9} /> : null}
				{P.hair === 'bun' ? <circle cx={0} cy={-985} r={62} fill={P.hairColor} stroke={INK} strokeWidth={9} /> : null}
				<circle cx={0} cy={-780} r={190} fill={`url(#head${id})`} stroke={INK} strokeWidth={9} />
				<Hair />
				<path d="M120 -900 Q185 -800 140 -660" stroke="#FFE2C4" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.55} />
				<ellipse cx={-78} cy={-886} rx={52} ry={28} fill="#fff" opacity={0.65} transform="rotate(-28 -78 -886)" />
				<circle cx={-128} cy={-846} r={11} fill="#fff" opacity={0.6} />
				<ellipse cx={-92} cy={-700} rx={34} ry={18} fill="#FF6A4A" opacity={0.35} />
				<ellipse cx={92} cy={-700} rx={34} ry={18} fill="#FF6A4A" opacity={0.35} />
				<Brows face={face} />
				<Eyes face={face} look={look} blink={blink} />
				{talk > 0.05 && face !== 'happy' && face !== 'shocked' ? <ellipse cx={0} cy={-655} rx={30} ry={8 + 26 * talk} fill="#5A1A2A" stroke={INK} strokeWidth={8} /> : <Mouth face={face} />}
				{P.glasses ? (
					<g fill="rgba(255,255,255,0.15)" stroke={INK} strokeWidth={9}>
						<circle cx={-64} cy={-765} r={56} />
						<circle cx={64} cy={-765} r={56} />
						<path d="M-8 -770 L8 -770" />
					</g>
				) : null}
				{face === 'scared' ? <path d="M160 -880 Q182 -840 166 -820 Q146 -840 160 -880 Z" fill="#9FD6F5" stroke={INK} strokeWidth={6} /> : null}
			</g>
			{thinking ? <ArmShape side={1} a={ar} fist id={id} /> : null}
			</g>
		</g>
	);
};
