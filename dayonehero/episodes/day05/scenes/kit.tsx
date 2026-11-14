import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {FONT} from '../../../brand/fonts';
import {Finish, lerp, pop, span, Sunburst, Svg} from '../../../components/ui';
import {Bedroom} from '../../../sets/Bedroom';
import {Kitchen} from '../../../sets/Kitchen';
import {Behind, Wood} from '../../../sets/Macro';
import {Sound} from './sound';

// Pieces many shots share.

/** The bedroom floor at Dex's size. */
export const FloorMacro: React.FC<{frame: number; at?: [number, number]; top?: number; shift?: number}> = ({frame, at = [1170, 700], top = 860, shift = 0}) => (
	<>
		<Behind x={at[0] + shift * 0.15} y={at[1]} zoom={4}>
			<Bedroom frame={frame} slippers={false} />
		</Behind>
		<Wood top={top} shift={shift} />
	</>
);

/** The kitchen table at Dex's size. */
export const TableMacro: React.FC<{at?: [number, number]; shift?: number}> = ({at = [1000, 560], shift = 0}) => (
	<>
		<Behind x={at[0] + shift * 0.15} y={at[1]} zoom={4.2}>
			<Kitchen />
		</Behind>
		<Wood top={860} color={C.woodLight} dark={C.wood} shift={shift} />
	</>
);

/** The kitchen floor at Dex's size. */
export const KitchenFloor: React.FC<{shift?: number}> = ({shift = 0}) => (
	<>
		<Behind x={585 + shift * 0.15} y={880} zoom={5}>
			<Kitchen />
		</Behind>
		<Wood top={880} shift={shift} />
	</>
);

/** The navy rays behind every explainer. */
export const Explainer: React.FC<{frame: number; children?: React.ReactNode; plum?: boolean}> = ({frame, children, plum}) => (
	<AbsoluteFill>
		<Sunburst a={plum ? C.plumDark : C.navyDark} b={plum ? C.plum : C.navy} frame={frame} />
		{children}
	</AbsoluteFill>
);

/** The dark wooden study behind the old papers. */
export const Study: React.FC = () => (
	<Svg>
		<defs>
			<radialGradient id="study" cx="50%" cy="45%" r="75%">
				<stop offset="0%" stopColor="#6A4A36" />
				<stop offset="100%" stopColor="#2E1E16" />
			</radialGradient>
		</defs>
		<rect width={1920} height={1080} fill="url(#study)" />
		{[...Array(8)].map((_, i) => (
			<rect key={i} x={i * 260 - 40} y={0} width={14} height={1080} fill="#2A1A12" opacity={0.35} />
		))}
		<rect x={0} y={860} width={1920} height={220} fill="#4A3122" stroke={C.ink} strokeWidth={6} />
	</Svg>
);

/** SVG text in the house font. */
export const T: React.FC<{x: number; y: number; size: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; color?: string; outline?: boolean}> = ({
	x,
	y,
	size,
	children,
	anchor = 'middle',
	color = C.ink,
	outline,
}) => (
	<text x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} textAnchor={anchor} stroke={outline ? C.ink : undefined} strokeWidth={outline ? size * 0.14 : undefined} paintOrder="stroke" strokeLinejoin="round">
		{children}
	</text>
);

/** Lines standing in for printed text. */
export const Print: React.FC<{x: number; y: number; w: number; rows: number}> = ({x, y, w, rows}) => (
	<g>
		{[...Array(rows)].map((_, i) => (
			<rect key={i} x={x} y={y + i * 30} width={w * (i % 4 === 3 ? 0.6 : 1)} height={10} rx={5} fill="#B79A62" />
		))}
	</g>
);

/**
 * A rule, on a yellow sticky note with tape, like Day 4's "RULE 1 / YOUR EYES
 * GIVE YOU AWAY." It sits over the picture, in the lower right.
 */
export const RuleNote: React.FC<{n: number | string; lines: string[]; frame: number; at: number; x?: number; y?: number; scale?: number}> = ({n, lines, frame, at, x = 1420, y = 700, scale = 1}) => {
	const p = pop(frame, at, 200);
	if (p <= 0.01) {
		return null;
	}
	return (
		<Svg>
			<g transform={`translate(${x} ${y}) rotate(-5) scale(${p * scale})`}>
				<rect x={-330 + 12} y={-200 + 16} width={660} height={400} rx={10} fill="rgba(0,0,0,0.25)" />
				<rect x={-330} y={-200} width={660} height={400} rx={10} fill="#FFE066" stroke={C.ink} strokeWidth={8} />
				<rect x={-80} y={-230} width={160} height={50} rx={6} fill="#CFE8F2" opacity={0.85} stroke={C.ink} strokeWidth={4} />
				<T x={0} y={-70} size={96} color={C.red}>{`RULE ${n}`}</T>
				{lines.map((l, i) => (
					<T key={i} x={0} y={30 + i * 72} size={58}>
						{l}
					</T>
				))}
			</g>
		</Svg>
	);
};

/** A rule shot: some picture, then the note pops on. */
export const RuleShot: React.FC<{frame: number; n: number; lines: string[]; at: number; children: React.ReactNode}> = ({frame, n, lines, at, children}) => (
	<AbsoluteFill>
		{children}
		<RuleNote n={n} lines={lines} frame={frame} at={at} />
		<Finish />
		<Sound name="ding" at={at} volume={0.55} />
	</AbsoluteFill>
);

/** Day 4's scene change: a blue panel with a yellow edge sweeps across. */
export const Wipe: React.FC<{frame: number}> = ({frame}) => {
	if (frame > 12) {
		return null;
	}
	const p = span(frame, 0, 12, Easing.inOut(Easing.cubic));
	const x = lerp(-300, 2400, p);
	return (
		<Svg>
			<path d={`M${x - 2600} 0 L${x} 0 L${x - 300} 1080 L${x - 2900} 1080 Z`} fill={C.blue} />
			<path d={`M${x} 0 L${x + 50} 0 L${x - 250} 1080 L${x - 300} 1080 Z`} fill={C.yellow} />
		</Svg>
	);
};

/** A count-up number in the house style. */
export const Big: React.FC<{text: string; x: number; y: number; size: number; color?: string; frame: number; at: number}> = ({text, x, y, size, color = C.yellow, frame, at}) => {
	const p = pop(frame, at, 220);
	if (p <= 0.01) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) scale(${p})`,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				color,
				WebkitTextStroke: `${size * 0.1}px ${C.ink}`,
				paintOrder: 'stroke fill',
				textShadow: `0 ${size * 0.07}px 0 ${C.ink}`,
				whiteSpace: 'nowrap',
				lineHeight: 1,
			}}
		>
			{text}
		</div>
	);
};

/** An isometric cube with its top-front corner at (x, y). */
export const Cube: React.FC<{x: number; y: number; s: number; glow?: boolean}> = ({x, y, s, glow}) => {
	const dx = s * 0.87;
	const dy = s * 0.5;
	return (
		<g stroke={C.ink} strokeWidth={Math.max(2, s * 0.05)} strokeLinejoin="round">
			<path d={`M${x} ${y} L${x - dx} ${y - dy} L${x} ${y - 2 * dy} L${x + dx} ${y - dy} Z`} fill={glow ? '#FFE27A' : '#FFD45C'} />
			<path d={`M${x} ${y} L${x - dx} ${y - dy} L${x - dx} ${y - dy + s} L${x} ${y + s} Z`} fill={glow ? '#FFC531' : C.hoodieDark} />
			<path d={`M${x} ${y} L${x + dx} ${y - dy} L${x + dx} ${y - dy + s} L${x} ${y + s} Z`} fill={glow ? '#FFB020' : '#C98A12'} />
		</g>
	);
};

/** Under the drinks fridge: dark, dusty, with warm light at the back. */
export const UnderFridge: React.FC<{frame: number; warm?: number; shift?: number}> = ({frame, warm = 0.4, shift = 0}) => (
	<Svg>
		<defs>
			<radialGradient id="motor" cx="85%" cy="55%" r="55%">
				<stop offset="0%" stopColor="#FF9A4A" stopOpacity={0.55 * warm + 0.1} />
				<stop offset="100%" stopColor="#1A1424" stopOpacity={0} />
			</radialGradient>
			<linearGradient id="exit" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor="#FFF1C9" stopOpacity={0.8} />
				<stop offset="100%" stopColor="#FFF1C9" stopOpacity={0} />
			</linearGradient>
		</defs>
		<rect width={1920} height={1080} fill="#1E1A2A" />
		<rect width={1920} height={1080} fill="url(#motor)" />
		<rect x={0} y={0} width={1920} height={200} fill="#2B2738" stroke={C.ink} strokeWidth={8} />
		{[...Array(9)].map((_, i) => {
			const x = ((i * 260 - shift) % 2340 + 2340) % 2340 - 210;
			return <rect key={i} x={x} y={150} width={160} height={30} rx={6} fill="#3A3548" />;
		})}
		<rect x={0} y={820} width={1920} height={260} fill="#4A4558" />
		{[...Array(12)].map((_, i) => {
			const x = ((i * 190 - shift) % 2280 + 2280) % 2280 - 180;
			return <line key={i} x1={x} y1={820} x2={x - 60} y2={1080} stroke="#3A3548" strokeWidth={5} />;
		})}
		<rect x={0} y={812} width={1920} height={14} fill="#5E596E" stroke={C.ink} strokeWidth={6} />
		{[...Array(30)].map((_, i) => (
			<circle key={i} cx={((i * 157 - shift * 0.5) % 1920 + 1920) % 1920} cy={260 + ((i * 89 + frame * 0.4) % 540)} r={2 + (i % 3)} fill="#C9C2DA" opacity={0.35} />
		))}
		<rect x={0} y={200} width={160} height={620} fill="url(#exit)" />
	</Svg>
);
