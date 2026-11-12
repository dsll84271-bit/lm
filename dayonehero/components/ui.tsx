import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {C} from '../brand/colours';
import {FONT} from '../brand/fonts';

// ------------------------------------------------------------------ timing

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0 to 1 between two frames, eased. */
export const span = (frame: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
	interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {...clamp, easing: ease});

/** Runs a value through [frame, value] keys. */
export const track = (frame: number, keys: Array<[number, number]>, ease = Easing.inOut(Easing.cubic)) =>
	keys.length === 1
		? keys[0][1]
		: interpolate(
				frame,
				keys.map((k) => k[0]),
				keys.map((k) => k[1]),
				{...clamp, easing: ease},
			);

/** A springy 0 to 1 (with overshoot) starting at `at`. */
export const pop = (frame: number, at: number, stiff = 220) =>
	frame < at ? 0 : spring({frame: frame - at, fps: 30, config: {damping: 11, stiffness: stiff, mass: 0.6}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** One spoken line, in frames from the start of the shot. */
export type Line = {who: string; text: string; a: number; b: number};
export type ShotProps = {frame: number; dur: number; lines: Line[]};

/** Roughly when a word is said: the frame where the nth match of `word` begins. */
export const cue = (line: Line | undefined, word: string, nth = 0): number => {
	if (!line) {
		return 0;
	}
	let i = -1;
	for (let n = 0; n <= nth; n++) {
		i = line.text.indexOf(word, i + 1);
		if (i < 0) {
			return line.a;
		}
	}
	return Math.round(line.a + (i / line.text.length) * (line.b - line.a));
};

// ------------------------------------------------------------------ canvas

/** A 1920 x 1080 drawing surface. */
export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', inset: 0, ...style}}>
		{children}
	</svg>
);

/**
 * The camera. `x`, `y` is the point of the 1920 x 1080 picture to put in the
 * middle of the screen; `zoom` 1 shows the whole picture.
 */
export const Cam: React.FC<{x?: number; y?: number; zoom?: number; rotate?: number; blur?: number; children: React.ReactNode}> = ({
	x = 960,
	y = 540,
	zoom = 1,
	rotate = 0,
	blur = 0,
	children,
}) => (
	<AbsoluteFill
		style={{
			transform: `translate(960px, 540px) rotate(${rotate}deg) scale(${zoom}) translate(${-x}px, ${-y}px)`,
			transformOrigin: '0 0',
			filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
		}}
	>
		{children}
	</AbsoluteFill>
);

/** Soft dark corners and a little warmth, like the Day 4 picture. */
export const Finish: React.FC<{strength?: number}> = ({strength = 1}) => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(42,37,70,0) 60%, rgba(42,37,70,${0.32 * strength}) 100%)`,
		}}
	/>
);

/** A shaking camera for impacts. */
export const shake = (frame: number, at: number, amount = 18, length = 14) => {
	const t = frame - at;
	if (t < 0 || t > length) {
		return {x: 0, y: 0};
	}
	const k = (1 - t / length) * amount;
	return {x: Math.sin(t * 2.7) * k, y: Math.cos(t * 3.3) * k};
};

// ------------------------------------------------------------------ labels

const LABEL_SHADOW = `0 4px 0 ${C.ink}`;

/** A rounded label, like "NEW POWER EVERY DAY". */
export const Pill: React.FC<{
	text: string;
	color: string;
	x: number;
	y: number;
	frame: number;
	at: number;
	until?: number;
	size?: number;
	dark?: boolean;
	rotate?: number;
}> = ({text, color, x, y, frame, at, until, size = 46, dark = false, rotate = 0}) => {
	const p = pop(frame, at);
	const out = until === undefined ? 0 : span(frame, until, until + 8);
	if (p <= 0.001 || out >= 1) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${p * (1 - out)})`,
				background: color,
				color: dark ? C.ink : C.white,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				letterSpacing: 1,
				lineHeight: 1,
				padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.26}px`,
				borderRadius: size * 0.42,
				border: `${Math.max(4, size * 0.1)}px solid ${C.ink}`,
				boxShadow: `0 ${size * 0.12}px 0 ${C.ink}`,
				textShadow: dark ? undefined : `0 3px 0 rgba(42,37,70,0.45)`,
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** A big comic sound word: RING! STOMP! */
export const Sfx: React.FC<{text: string; x: number; y: number; frame: number; at: number; until?: number; size?: number; color?: string; rotate?: number; wobble?: boolean}> = ({
	text,
	x,
	y,
	frame,
	at,
	until,
	size = 120,
	color = C.red,
	rotate = -8,
	wobble = false,
}) => {
	const p = pop(frame, at, 300);
	const out = until === undefined ? 0 : span(frame, until, until + 6);
	if (p <= 0.001 || out >= 1) {
		return null;
	}
	const w = wobble ? Math.sin(frame * 1.7) * 4 : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rotate + w}deg) scale(${p * (1 - out)})`,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				color,
				WebkitTextStroke: `${size * 0.09}px ${C.ink}`,
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

/** A spoken line, written small next to whoever says it. */
export const Said: React.FC<{text: string; x: number; y: number; frame: number; at: number; until: number; size?: number}> = ({
	text,
	x,
	y,
	frame,
	at,
	until,
	size = 44,
}) => {
	if (frame < at || frame > until + 6) {
		return null;
	}
	const p = pop(frame, at, 260);
	const out = span(frame, until, until + 6);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) scale(${p * (1 - out)})`,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				color: C.white,
				WebkitTextStroke: `${size * 0.16}px ${C.ink}`,
				paintOrder: 'stroke fill',
				whiteSpace: 'nowrap',
				lineHeight: 1,
			}}
		>
			{text}
		</div>
	);
};

/** A four-point twinkle. */
export const Twinkle: React.FC<{x: number; y: number; r: number; frame: number; seed?: number; color?: string}> = ({x, y, r, frame, seed = 0, color = C.white}) => {
	const t = ((frame + seed * 13) % 40) / 40;
	const s = Math.sin(t * Math.PI) ** 2;
	if (s < 0.02) {
		return null;
	}
	const k = r * s;
	const d = `M0 ${-k} Q${k * 0.18} ${-k * 0.18} ${k} 0 Q${k * 0.18} ${k * 0.18} 0 ${k} Q${-k * 0.18} ${k * 0.18} ${-k} 0 Q${-k * 0.18} ${-k * 0.18} 0 ${-k} Z`;
	return <path d={d} transform={`translate(${x} ${y}) rotate(${frame * 2})`} fill={color} stroke={C.ink} strokeWidth={2.5} />;
};

/** The rays behind explainers. */
export const Sunburst: React.FC<{a: string; b: string; frame: number; cx?: number; cy?: number}> = ({a, b, frame, cx = 960, cy = 540}) => {
	const rays = 24;
	const paths = [];
	for (let i = 0; i < rays; i++) {
		const t0 = ((i / rays) * 360 + frame * 0.15) * (Math.PI / 180);
		const t1 = t0 + (Math.PI / rays) * 0.9;
		const R = 2400;
		paths.push(
			<path key={i} d={`M${cx} ${cy} L${cx + Math.cos(t0) * R} ${cy + Math.sin(t0) * R} L${cx + Math.cos(t1) * R} ${cy + Math.sin(t1) * R} Z`} fill={b} opacity={0.45} />,
		);
	}
	return (
		<Svg>
			<defs>
				<radialGradient id="burst" cx="50%" cy="50%" r="70%">
					<stop offset="0%" stopColor={b} />
					<stop offset="100%" stopColor={a} />
				</radialGradient>
			</defs>
			<rect width={1920} height={1080} fill="url(#burst)" />
			{paths}
			{[...Array(26)].map((_, i) => (
				<circle key={i} cx={(i * 337) % 1920} cy={(i * 211 + 90) % 1080} r={2 + (i % 3)} fill="#fff" opacity={0.18} />
			))}
		</Svg>
	);
};

/** An old paper card, for the 1926 essay. */
export const Paper: React.FC<{x: number; y: number; w: number; h: number; rotate?: number; children?: React.ReactNode}> = ({x, y, w, h, rotate = -1.5, children}) => (
	<g transform={`translate(${x} ${y}) rotate(${rotate})`}>
		<rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={14} fill="rgba(0,0,0,0.3)" />
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="#EFD9A6" stroke={C.ink} strokeWidth={6} />
		<rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h - 36} rx={8} fill="none" stroke="#C9AE74" strokeWidth={3} />
		{children}
	</g>
);
