import React from 'react';
import {FONT} from '../brand/fonts';
import {lerp, pop, span} from './stage';

// On-screen graphics in the house style: dark rounded labels with cream or
// yellow text, speech bubbles, comparison bars and big numbers.

export const UI = {
	box: 'rgba(14,8,34,0.86)',
	edge: 'rgba(255,255,255,0.18)',
	cream: '#FFF3D6',
	yellow: '#FFD84A',
	orange: '#FF8A3D',
	cyan: '#7FE0FF',
	red: '#FF5A5A',
	green: '#7CF2A0',
	ink: '#140A28',
};

/** A label: dark rounded box, bold rounded text. Position is its centre, in screen pixels. */
export const Label: React.FC<{text: string; x: number; y: number; frame: number; at: number; until?: number; size?: number; color?: string; icon?: string}> = ({
	text,
	x,
	y,
	frame,
	at,
	until,
	size = 46,
	color = UI.cream,
	icon,
}) => {
	const p = pop(frame, at, 260);
	const out = until === undefined ? 0 : span(frame, until, until + 7);
	if (p <= 0.01 || out >= 1) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) scale(${p * (1 - out)})`,
				background: UI.box,
				border: `3px solid ${UI.edge}`,
				borderRadius: size * 0.5,
				padding: `${size * 0.22}px ${size * 0.55}px ${size * 0.26}px`,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				lineHeight: 1,
				color,
				textShadow: `0 0 18px ${color}66`,
				boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
				whiteSpace: 'nowrap',
				display: 'flex',
				gap: size * 0.3,
				alignItems: 'center',
			}}
		>
			{icon ? <span>{icon}</span> : null}
			{text}
		</div>
	);
};

/** A speech bubble with a tail pointing at (tx, ty). */
export const Bubble: React.FC<{text: string; x: number; y: number; tx: number; ty: number; frame: number; at: number; until: number; size?: number; shout?: boolean}> = ({
	text,
	x,
	y,
	tx,
	ty,
	frame,
	at,
	until,
	size = 44,
	shout = false,
}) => {
	const p = pop(frame, at, 300);
	const out = span(frame, until, until + 6);
	if (p <= 0.01 || out >= 1) {
		return null;
	}
	const w = text.length * size * 0.56 + size * 1.2;
	const h = size * 1.7;
	const k = p * (1 - out);
	return (
		<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
				<path d={`M${x - w * 0.12} ${y + h / 2 - 4} L${tx} ${ty} L${x + w * 0.12} ${y + h / 2 - 4} Z`} fill="#fff" stroke={UI.ink} strokeWidth={6} strokeLinejoin="round" />
				<rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="#fff" stroke={UI.ink} strokeWidth={6} />
				<path d={`M${x - w * 0.12 + 6} ${y + h / 2 - 6} L${x + w * 0.12 - 6} ${y + h / 2 - 6}`} stroke="#fff" strokeWidth={8} />
				<text x={x} y={y + size * 0.36} fontFamily={FONT} fontWeight={700} fontSize={size} fill={shout ? '#E8333F' : UI.ink} textAnchor="middle">
					{text}
				</text>
			</g>
		</svg>
	);
};

/** Two (or more) bars comparing numbers. `values` are 0 to 1. */
export const Bars: React.FC<{items: Array<{label: string; value: number; color: string; note?: string}>; x: number; y: number; w: number; frame: number; at: number}> = ({items, x, y, w, frame, at}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, display: 'flex', flexDirection: 'column', gap: 22}}>
		{items.map((it, i) => {
			const p = span(frame, at + i * 10, at + i * 10 + 24);
			if (frame < at + i * 10) {
				return null;
			}
			return (
				<div key={i} style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<div style={{width: 230, textAlign: 'right', fontFamily: FONT, fontWeight: 700, fontSize: 38, color: UI.cream, textShadow: '0 3px 0 rgba(0,0,0,0.5)'}}>{it.label}</div>
					<div style={{flex: 1, height: 52, background: 'rgba(255,255,255,0.1)', borderRadius: 26, border: `3px solid ${UI.edge}`, overflow: 'hidden'}}>
						<div style={{width: `${Math.max(2, it.value * 100 * p)}%`, height: '100%', background: it.color, borderRadius: 26, boxShadow: `0 0 24px ${it.color}`}} />
					</div>
					<div style={{width: 280, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: it.color, opacity: p}}>{it.note}</div>
				</div>
			);
		})}
	</div>
);

/** A big glowing number or word. */
export const Big: React.FC<{text: string; x: number; y: number; size: number; frame: number; at: number; until?: number; color?: string; rotate?: number}> = ({text, x, y, size, frame, at, until, color = UI.yellow, rotate = 0}) => {
	const p = pop(frame, at, 240);
	const out = until === undefined ? 0 : span(frame, until, until + 6);
	if (p <= 0.01 || out >= 1) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${p * (1 - out)})`,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				color,
				lineHeight: 1,
				WebkitTextStroke: `${size * 0.1}px ${UI.ink}`,
				paintOrder: 'stroke fill',
				textShadow: `0 ${size * 0.07}px 0 ${UI.ink}, 0 0 40px ${color}88`,
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** A number that counts from `from` to `to`. */
export const Count: React.FC<{from: number; to: number; x: number; y: number; size: number; frame: number; at: number; dur?: number; prefix?: string; suffix?: string; color?: string}> = ({
	from,
	to,
	x,
	y,
	size,
	frame,
	at,
	dur = 40,
	prefix = '',
	suffix = '',
	color,
}) => {
	const v = Math.round(lerp(from, to, span(frame, at, at + dur)));
	return <Big text={`${prefix}${v.toLocaleString('en-GB')}${suffix}`} x={x} y={y} size={size} frame={frame} at={at} color={color} />;
};
