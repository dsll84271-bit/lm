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

// ---------------------------------------------------------------- richer graphics

const panel: React.CSSProperties = {
	position: 'absolute',
	background: 'rgba(14,8,34,0.9)',
	border: `3px solid ${UI.edge}`,
	borderRadius: 22,
	boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
	fontFamily: FONT,
	fontWeight: 700,
	color: UI.cream,
};

/**
 * The slowed-time HUD: two clocks side by side, real time crawling and your
 * time racing. `real` and `yours` are seconds.
 */
export const TimeHud: React.FC<{real: number; yours: number; frame: number; at: number; x?: number; y?: number}> = ({real, yours, frame, at, x = 1500, y = 780}) => {
	const p = pop(frame, at, 240);
	if (p <= 0.01) {
		return null;
	}
	const fmt = (s: number) => {
		if (s < 60) {
			return `${s.toFixed(2)} s`;
		}
		const m = Math.floor(s / 60);
		const h = Math.floor(m / 60);
		return h > 0 ? `${h}h ${String(m % 60).padStart(2, '0')}m` : `${m}m ${String(Math.floor(s % 60)).padStart(2, '0')}s`;
	};
	return (
		<div style={{...panel, left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, padding: '14px 26px', display: 'flex', gap: 34, fontSize: 30}}>
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: 22, opacity: 0.7}}>REAL TIME</div>
				<div style={{color: UI.cyan, fontSize: 44}}>{fmt(real)}</div>
			</div>
			<div style={{width: 3, background: UI.edge}} />
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: 22, opacity: 0.7}}>YOUR TIME</div>
				<div style={{color: UI.yellow, fontSize: 44}}>{fmt(yours)}</div>
			</div>
		</div>
	);
};

/** A phone showing a viral clip: play bar, views counting, hearts floating, comments popping. */
export const PhoneFeed: React.FC<{frame: number; at: number; views: number; x?: number; y?: number; comments?: string[]; children?: React.ReactNode}> = ({frame, at, views, x = 1400, y = 540, comments = [], children}) => {
	const p = pop(frame, at, 200);
	if (p <= 0.01) {
		return null;
	}
	const v = Math.round(views * span(frame, at, at + 70));
	const short = v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : `${v}`;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 420, height: 760, transform: `translate(-50%, -50%) scale(${p})`, background: '#0B0720', border: '10px solid #2A2350', borderRadius: 48, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', fontFamily: FONT, fontWeight: 700, color: '#fff'}}>
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3B2A8A, #120C30)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 120, height: 420}}>{children}</div>
			<div style={{position: 'absolute', left: 24, right: 24, top: 560, height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 4}}>
				<div style={{width: `${((frame - at) % 120) / 1.2}%`, height: '100%', background: UI.red, borderRadius: 4}} />
			</div>
			<div style={{position: 'absolute', left: 24, top: 50, fontSize: 40, textShadow: '0 3px 0 rgba(0,0,0,0.5)'}}>{short} views</div>
			{(() => {
				const shownC = Math.max(0, Math.min(comments.length, Math.floor((frame - at - 30) / 22) + 1));
				return comments.slice(Math.max(0, shownC - 3), shownC).map((c, i) => (
					<div key={c} style={{position: 'absolute', left: 20, right: 20, top: 590 + i * 50, fontSize: 24, background: 'rgba(255,255,255,0.14)', padding: '6px 14px', borderRadius: 14, whiteSpace: 'nowrap', overflow: 'hidden'}}>
						{c}
					</div>
				));
			})()}
			{[0, 1, 2, 3].map((i) => {
				const t = ((frame - at + i * 20) % 80) / 80;
				return (
					<div key={i} style={{position: 'absolute', right: 30 + (i % 2) * 20, top: 520 - t * 360, fontSize: 40, opacity: 1 - t, color: UI.red}}>
						♥
					</div>
				);
			})}
		</div>
	);
};

/** A live chat feed (games, streams). */
export const ChatFeed: React.FC<{frame: number; at: number; messages: Array<[string, string]>; x?: number; y?: number}> = ({frame, at, messages, x = 1560, y = 560}) => {
	const p = pop(frame, at, 220);
	if (p <= 0.01) {
		return null;
	}
	const shown = Math.min(messages.length, Math.max(0, Math.floor((frame - at) / 14) + 1));
	const colours = [UI.cyan, UI.yellow, UI.green, UI.orange, '#FF8AD8'];
	return (
		<div style={{...panel, left: x, top: y, width: 520, transform: `translate(-50%, -50%) scale(${p})`, padding: 20, fontSize: 28, display: 'flex', flexDirection: 'column', gap: 10}}>
			<div style={{fontSize: 22, opacity: 0.7}}>LIVE CHAT</div>
			{messages.slice(Math.max(0, shown - 6), shown).map(([who, text], i) => (
				<div key={`${who}${i}`} style={{whiteSpace: 'nowrap'}}>
					<span style={{color: colours[(who.length + i) % colours.length]}}>{who}: </span>
					<span>{text}</span>
				</div>
			))}
		</div>
	);
};

/** A speed comparison: lines racing across, labelled. */
export const SpeedRace: React.FC<{frame: number; at: number; items: Array<{label: string; speed: number; color: string}>; x?: number; y?: number; w?: number}> = ({frame, at, items, x = 960, y = 540, w = 1200}) => {
	const p = pop(frame, at, 220);
	if (p <= 0.01) {
		return null;
	}
	return (
		<div style={{...panel, left: x, top: y, width: w, transform: `translate(-50%, -50%) scale(${p})`, padding: 24, display: 'flex', flexDirection: 'column', gap: 18}}>
			{items.map((it, i) => {
				const prog = Math.min(1, ((frame - at) * it.speed) / 100);
				return (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<div style={{width: 260, fontSize: 30, textAlign: 'right'}}>{it.label}</div>
						<div style={{flex: 1, height: 14, background: 'rgba(255,255,255,0.1)', borderRadius: 7, position: 'relative'}}>
							<div style={{position: 'absolute', left: `calc(${prog * 100}% - 18px)`, top: -11, width: 36, height: 36, borderRadius: 18, background: it.color, boxShadow: `0 0 20px ${it.color}`}} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

/** A flipping calendar / age counter. */
export const Calendar: React.FC<{frame: number; at: number; from: number; to: number; label: string; x?: number; y?: number; color?: string}> = ({frame, at, from, to, label, x = 480, y = 560, color = UI.red}) => {
	const p = pop(frame, at, 220);
	if (p <= 0.01) {
		return null;
	}
	const v = Math.round(lerp(from, to, span(frame, at + 6, at + 60)));
	return (
		<div style={{...panel, left: x, top: y, width: 300, transform: `translate(-50%, -50%) scale(${p}) rotate(-3deg)`, overflow: 'hidden', textAlign: 'center'}}>
			<div style={{background: color, color: '#fff', fontSize: 30, padding: '10px 0'}}>{label}</div>
			<div style={{fontSize: 130, padding: '6px 0 18px', color: '#fff'}}>{v}</div>
		</div>
	);
};
