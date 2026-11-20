/**
 * Maps from real data: US states (us-atlas, US Census) and nearby countries
 * (world-atlas, Natural Earth), all in the same Albers projection.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import states from './allstates.json';
import world from './world.json';
import {C, clamp} from './kit';

export const P = world.pts as unknown as Record<string, [number, number]>;
export type VB = [number, number, number, number];

export const MapStyles = {
	paper: {sea: '#BFDDE3', land: '#EFE6D0', stroke: '#3A3226', other: '#DCD2BA', hi: '#F3D9A0', text: '#3A3226', sw: 0.7},
	navy: {sea: '#0E1620', land: '#1C2836', stroke: '#34465A', other: '#18222E', hi: C.gold, text: '#C9D3DE', sw: 0.5},
} as const;

/**
 * A map whose camera moves from one viewBox to another.
 * Children are drawn in map coordinates (the same as P points).
 */
export const MapView: React.FC<{
	d: number;
	from: VB;
	to?: VB;
	style?: keyof typeof MapStyles;
	hi?: string[];
	hiGlow?: boolean;
	lines?: boolean;
	children?: React.ReactNode;
	e?: (t: number) => number;
}> = ({d, from, to, style = 'paper', hi = [], hiGlow, lines = true, children, e = Easing.bezier(0.4, 0, 0.25, 1)}) => {
	const frame = useCurrentFrame();
	const s = MapStyles[style];
	const t = interpolate(frame, [0, d], [0, 1], {...clamp, easing: e});
	const end = to ?? from;
	const vb = from.map((v, i) => v + (end[i] - v) * t);
	// keep 16:9
	const w = vb[2];
	const h = (w * 9) / 16;
	const cy = vb[1] + vb[3] / 2;
	const view = `${vb[0]} ${cy - h / 2} ${w} ${h}`;
	const sw = (s.sw * w) / 975;
	return (
		<AbsoluteFill style={{background: s.sea}}>
			<svg width={1920} height={1080} viewBox={view} preserveAspectRatio="xMidYMid slice">
				<defs>
					<pattern id={`sea-${style}`} width={6} height={6} patternUnits="userSpaceOnUse">
						<line x1={0} y1={3} x2={6} y2={3} stroke={style === 'paper' ? '#9FC7CF' : '#132030'} strokeWidth={0.35} />
					</pattern>
					<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation={3 * (w / 975)} result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<rect x={-2000} y={-2000} width={6000} height={6000} fill={lines ? `url(#sea-${style})` : s.sea} />
				{world.countries.map((c) => (
					<path key={c.id} d={c.d} fill={s.other} stroke={s.stroke} strokeWidth={sw * 0.8} />
				))}
				{states.st.map((st) => (
					<path
						key={st.id}
						d={st.d}
						fill={hi.includes(st.id) ? s.hi : s.land}
						stroke={hi.includes(st.id) && style === 'navy' ? '#F6D58E' : s.stroke}
						strokeWidth={hi.includes(st.id) ? sw * 1.6 : sw}
						filter={hi.includes(st.id) && hiGlow ? 'url(#glow)' : undefined}
					/>
				))}
				{children}
			</svg>
		</AbsoluteFill>
	);
};

/** A city dot with a label, sized in map units. */
export const Dot: React.FC<{p: [number, number]; label?: string; at?: number; r?: number; color?: string; dx?: number; dy?: number; size?: number; font?: string; textColor?: string}> = ({
	p,
	label,
	at = 0,
	r = 1.6,
	color = C.red,
	dx = 3,
	dy = 1.2,
	size = 5,
	font = 'Elite',
	textColor = '#3A3226',
}) => {
	const frame = useCurrentFrame();
	const k = interpolate(frame, [at, at + 8], [0, 1], clamp);
	if (k <= 0) return null;
	return (
		<g opacity={k}>
			<circle cx={p[0]} cy={p[1]} r={r * (0.4 + 0.6 * k)} fill={color} />
			{label && (
				<text x={p[0] + dx} y={p[1] + dy} fontFamily={font} fontSize={size} fill={textColor}>
					{label}
				</text>
			)}
		</g>
	);
};

/** A small static map for a paper card (no camera). */
export const MiniMap: React.FC<{w: number; h: number; vb: VB; hi?: string[]; style?: keyof typeof MapStyles; children?: React.ReactNode}> = ({
	w,
	h,
	vb,
	hi = ['12'],
	style = 'paper',
	children,
}) => {
	const s = MapStyles[style];
	const sw = (s.sw * vb[2]) / 975;
	return (
		<svg width={w} height={h} viewBox={vb.join(' ')} preserveAspectRatio="xMidYMid slice" style={{display: 'block', background: s.sea}}>
			<defs>
				<pattern id={`msea-${style}`} width={4} height={4} patternUnits="userSpaceOnUse">
					<line x1={0} y1={2} x2={4} y2={2} stroke={style === 'paper' ? '#9FC7CF' : '#132030'} strokeWidth={0.25} />
				</pattern>
			</defs>
			<rect x={-2000} y={-2000} width={6000} height={6000} fill={`url(#msea-${style})`} />
			{world.countries.map((c) => (
				<path key={c.id} d={c.d} fill={s.other} stroke={s.stroke} strokeWidth={sw * 0.8} />
			))}
			{states.st.map((st) => (
				<path key={st.id} d={st.d} fill={hi.includes(st.id) ? s.hi : s.land} stroke={s.stroke} strokeWidth={hi.includes(st.id) ? sw * 1.5 : sw} />
			))}
			{children}
		</svg>
	);
};
