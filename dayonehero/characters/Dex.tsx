import React, {useId} from 'react';
import {C} from '../brand/colours';

// Dex: a chibi kid in his favourite yellow hoodie, hood up, and blue slippers.
// Drawn 400 units tall with his feet at (0, 0). Every outline is C.ink.

export type DexFace = 'smile' | 'happy' | 'shock' | 'worried' | 'yell' | 'cold' | 'sleep' | 'grin';

export type DexProps = {
	x: number;
	y: number;
	/** Height on screen, in pixels. */
	size: number;
	face?: DexFace;
	/** Arms, in degrees: 0 hangs down, 90 sticks straight out, 180 points up. [upper arm, forearm]. */
	armL?: [number, number];
	armR?: [number, number];
	/** Walk cycle 0 to 1, or undefined to stand still. */
	walk?: number;
	/** Where he looks: -1 to 1 on each axis. */
	look?: [number, number];
	/** 0 to 1: mouth open for talking. */
	talk?: number;
	flip?: boolean;
	/** Whole-body lean, in degrees. */
	tilt?: number;
	/** Squash on landing: 1 is normal, 0.8 squashed. */
	squash?: number;
	blink?: number;
	/** Hide the slippers (he's standing in one, or they're on the floor). */
	noSlippers?: boolean;
	opacity?: number;
};

const OUT = 7; // outline width

const Arm: React.FC<{side: 1 | -1; a: [number, number]}> = ({side, a}) => {
	const sx = 50 * side;
	const sy = -160;
	const r = (deg: number) => (deg * Math.PI) / 180;
	const ex = sx + Math.sin(r(a[0])) * 44 * side;
	const ey = sy + Math.cos(r(a[0])) * 44;
	const hx = ex + Math.sin(r(a[1])) * 40 * side;
	const hy = ey + Math.cos(r(a[1])) * 40;
	const d = `M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}`;
	return (
		<g>
			<path d={d} stroke={C.ink} strokeWidth={34 + OUT * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
			<path d={d} stroke={C.hoodie} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
			<circle cx={hx + Math.sin(r(a[1])) * 10 * side} cy={hy + Math.cos(r(a[1])) * 10} r={14} fill={C.skin} stroke={C.ink} strokeWidth={OUT - 1} />
		</g>
	);
};

const Eye: React.FC<{cx: number; cy: number; face: DexFace; look: [number, number]; blink: number; side: 1 | -1}> = ({cx, cy, face, look, blink, side}) => {
	if (face === 'happy') {
		return <path d={`M${cx - 18} ${cy + 6} Q${cx} ${cy - 18} ${cx + 18} ${cy + 6}`} stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />;
	}
	if (face === 'sleep' || blink > 0.6) {
		return <path d={`M${cx - 18} ${cy} Q${cx} ${cy + 12} ${cx + 18} ${cy}`} stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />;
	}
	if (face === 'cold') {
		return <path d={`M${cx - 16 * side} ${cy - 12} L${cx + 12 * side} ${cy} L${cx - 16 * side} ${cy + 12}`} stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
	}
	const lx = look[0] * 6;
	const ly = look[1] * 6;
	if (face === 'shock') {
		return (
			<g>
				<circle cx={cx} cy={cy} r={27} fill={C.white} stroke={C.ink} strokeWidth={5} />
				<circle cx={cx + lx * 1.6} cy={cy + ly * 1.6} r={11} fill={C.irisDark} />
				<circle cx={cx + lx * 1.6 + 4} cy={cy + ly * 1.6 - 4} r={3.5} fill={C.white} />
			</g>
		);
	}
	const ry = 25 * (1 - blink * 0.8);
	return (
		<g>
			<defs>
				<linearGradient id={`iris${side}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={C.irisDark} />
					<stop offset="100%" stopColor={C.iris} />
				</linearGradient>
			</defs>
			<ellipse cx={cx + lx} cy={cy + ly} rx={20} ry={ry} fill={`url(#iris${side})`} stroke={C.ink} strokeWidth={4} />
			<ellipse cx={cx + lx} cy={cy + ly + ry * 0.35} rx={11} ry={ry * 0.35} fill="#6F8EF0" opacity={0.7} />
			<circle cx={cx + lx + 7} cy={cy + ly - ry * 0.4} r={7} fill={C.white} />
			<circle cx={cx + lx - 7} cy={cy + ly + ry * 0.45} r={3.5} fill={C.white} />
		</g>
	);
};

const Mouth: React.FC<{face: DexFace; talk: number}> = ({face, talk}) => {
	const y = -196;
	if (face === 'happy' || face === 'yell' || talk > 0.05) {
		const open = face === 'yell' ? 1 : face === 'happy' ? 0.85 : talk;
		const w = face === 'yell' ? 22 : 18;
		const h = 6 + 24 * open;
		return (
			<g>
				<path d={`M${-w} ${y - 4} Q0 ${y - 8} ${w} ${y - 4} Q${w * 0.8} ${y + h} 0 ${y + h} Q${-w * 0.8} ${y + h} ${-w} ${y - 4} Z`} fill="#8E2A3A" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
				<ellipse cx={0} cy={y + h - 6} rx={w * 0.5} ry={Math.max(2, h * 0.22)} fill="#F07A86" />
			</g>
		);
	}
	if (face === 'shock') {
		return <ellipse cx={0} cy={y + 4} rx={11} ry={15} fill="#8E2A3A" stroke={C.ink} strokeWidth={5} />;
	}
	if (face === 'worried') {
		return <path d={`M-14 ${y + 2} Q-7 ${y - 6} 0 ${y + 2} Q7 ${y + 10} 14 ${y + 2}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
	}
	if (face === 'cold') {
		return (
			<g>
				<rect x={-18} y={y - 8} width={36} height={18} rx={6} fill={C.white} stroke={C.ink} strokeWidth={5} />
				<path d={`M-18 ${y + 1} L-12 ${y - 4} L-6 ${y + 5} L0 ${y - 4} L6 ${y + 5} L12 ${y - 4} L18 ${y + 1}`} stroke={C.ink} strokeWidth={3} fill="none" />
			</g>
		);
	}
	if (face === 'sleep') {
		return <ellipse cx={0} cy={y} rx={6} ry={5} fill="#8E2A3A" stroke={C.ink} strokeWidth={4} />;
	}
	if (face === 'grin') {
		return <path d={`M-18 ${y - 4} Q0 ${y + 14} 18 ${y - 6}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
	}
	return <path d={`M-11 ${y - 2} Q0 ${y + 8} 11 ${y - 2}`} stroke={C.ink} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
};

const Brows: React.FC<{face: DexFace}> = ({face}) => {
	const y = -272;
	const lift = face === 'shock' ? -12 : face === 'happy' ? -6 : 0;
	const tiltIn = face === 'worried' || face === 'cold' ? -10 : face === 'grin' || face === 'yell' ? 9 : 0;
	return (
		<g stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none">
			<path d={`M-52 ${y + lift + tiltIn * -0.5} Q-38 ${y + lift - 6} -22 ${y + lift + tiltIn * 0.5}`} />
			<path d={`M22 ${y + lift + tiltIn * 0.5} Q38 ${y + lift - 6} 52 ${y + lift + tiltIn * -0.5}`} />
		</g>
	);
};

export const Dex: React.FC<DexProps> = ({
	x,
	y,
	size,
	face = 'smile',
	armL = [12, 6],
	armR = [12, 6],
	walk,
	look = [0, 0],
	talk = 0,
	flip = false,
	tilt = 0,
	squash = 1,
	blink = 0,
	noSlippers = false,
	opacity = 1,
}) => {
	const id = useId().replace(/[^a-zA-Z0-9]/g, '');
	const k = size / 400;
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2);
	const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk * Math.PI * 2)) * 8;
	const legL = -w * 14;
	const legR = w * 14;
	return (
		<g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * k * (2 - squash)} ${k * squash}) rotate(${tilt})`} opacity={opacity}>
			<ellipse cx={0} cy={-2} rx={70} ry={12} fill="rgba(42,37,70,0.18)" />
			<g transform={`translate(0 ${-bob})`}>
				{/* legs */}
				<rect x={-30 + legL} y={-74} width={26} height={62} rx={10} fill={C.legs} stroke={C.ink} strokeWidth={OUT - 1} />
				<rect x={4 + legR} y={-74} width={26} height={62} rx={10} fill={C.legs} stroke={C.ink} strokeWidth={OUT - 1} />
				{noSlippers ? null : (
					<g>
						{[
							[-24 + legL, 1],
							[26 + legR, 1],
						].map(([sx], i) => (
							<g key={i}>
								<ellipse cx={sx} cy={-14} rx={36} ry={16} fill={C.slipper} stroke={C.ink} strokeWidth={OUT - 1} />
								<path d={`M${sx - 26} ${-18} Q${sx} ${-30} ${sx + 26} ${-18}`} stroke={C.slipperDark} strokeWidth={6} fill="none" />
								<circle cx={sx + (i === 0 ? -10 : 10)} cy={-27} r={8} fill={C.white} stroke={C.ink} strokeWidth={4} />
							</g>
						))}
					</g>
				)}
				{/* hoodie */}
				<path d="M-54 -178 Q0 -190 54 -178 L66 -78 Q68 -60 50 -60 L-50 -60 Q-68 -60 -66 -78 Z" fill={C.hoodie} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
				<path d="M18 -176 Q40 -182 54 -178 L66 -78 Q68 -60 50 -60 L34 -60 Q44 -120 18 -176 Z" fill={C.hoodieDark} opacity={0.55} />
				<path d="M-38 -116 L38 -116 L44 -76 L-44 -76 Z" fill="none" stroke={C.hoodieDark} strokeWidth={5} strokeLinejoin="round" />
				{[-13, 13].map((dx) => (
					<g key={dx}>
						<path d={`M${dx} -172 L${dx * 1.15} -132`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
						<path d={`M${dx} -172 L${dx * 1.15} -132`} stroke={C.white} strokeWidth={4.5} strokeLinecap="round" />
					</g>
				))}
				<Arm side={-1} a={armL} />
				<Arm side={1} a={armR} />
				{/* head: the hood, the face inside it, hair, eyes */}
				<defs>
					<clipPath id={`face${id}`}>
						<ellipse cx={0} cy={-246} rx={90} ry={84} />
					</clipPath>
				</defs>
				<circle cx={0} cy={-262} r={120} fill={C.hoodie} stroke={C.ink} strokeWidth={OUT} />
				<path d="M60 -360 Q118 -300 104 -200 Q96 -170 76 -160 Q104 -260 60 -360 Z" fill={C.hoodieDark} opacity={0.5} />
				<ellipse cx={0} cy={-246} rx={98} ry={92} fill={C.hoodieDark} opacity={0.65} />
				<ellipse cx={0} cy={-246} rx={90} ry={84} fill={C.skin} stroke={C.ink} strokeWidth={OUT - 1} />
				<g clipPath={`url(#face${id})`}>
					<path
						d="M-100 -350 L100 -350 L100 -262 Q88 -270 78 -258 Q66 -286 46 -266 Q30 -292 8 -268 Q-12 -294 -30 -268 Q-50 -290 -66 -262 Q-82 -276 -100 -256 Z"
						fill={C.hair}
					/>
					<ellipse cx={-34} cy={-306} rx={22} ry={8} fill="#4A4560" opacity={0.6} transform="rotate(-12 -34 -306)" />
					<ellipse cx={0} cy={-170} rx={92} ry={14} fill="#F2C4AC" opacity={0.4} />
				</g>
				<ellipse cx={-60} cy={-210} rx={16} ry={10} fill={face === 'cold' ? '#9CC8F0' : C.cheek} opacity={0.85} />
				<ellipse cx={60} cy={-210} rx={16} ry={10} fill={face === 'cold' ? '#9CC8F0' : C.cheek} opacity={0.85} />
				<Brows face={face} />
				<Eye cx={-36} cy={-236} face={face} look={look} blink={blink} side={-1} />
				<Eye cx={36} cy={-236} face={face} look={look} blink={blink} side={1} />
				<path d="M-3 -218 L3 -218" stroke="#E2A890" strokeWidth={4} strokeLinecap="round" />
				<Mouth face={face} talk={talk} />
				{face === 'worried' ? <path d="M92 -300 Q104 -280 96 -270 Q86 -278 92 -300 Z" fill="#9FD6F5" stroke={C.ink} strokeWidth={4} /> : null}
			</g>
		</g>
	);
};

/** Mouth movement for a line between frames a and b. */
export const mouth = (frame: number, a: number, b: number) =>
	frame < a || frame > b ? 0 : 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.9)) * Math.min(1, (frame - a) / 3, (b - frame) / 3);

/** A blink every few seconds. */
export const blinkAt = (frame: number, seed = 0) => {
	const t = (frame + seed * 31) % 95;
	return t > 88 ? 1 - Math.abs(t - 91.5) / 3.5 : 0;
};
