/**
 * Case File 003's own world: Miami lab teal and courtroom amber on legal
 * pleading paper, microscope slides (always clean), and the slide box that
 * becomes the Reality Score meter. Red is kept for the house stamp only.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, lerp} from '../../docs-kit/kit';
import type {CaseTheme} from '../../docs-kit/series';
import {HOUSE_RED} from '../../docs-kit/series';
import {TV} from '../../docs-kit/tv';
import {PaperFinish, Piece, slap, useBoil, useTwos, V} from '../../docs-kit/vox';

export {Sfx, sec} from '../case001/parts';

export const TEAL = '#1FA4A0';
export const AMBER = '#D9A441';
export const NIGHT = '#0B1418';

export const T: CaseTheme = {no: 3, title: 'DEXTER ON TRIAL', accent: TEAL, accent2: AMBER, dir: 'case003', paper: '#ECEAE3', stamp: HOUSE_RED};

export const I = (n: string) => `case003/img/${n}.jpg`;
export const F = (n: string) => `case003/film/${n}.mp4`;

/** The paper board every collage scene sits on (a cooler, cleaner paper than Case 002's). */
export const Board: React.FC<{children?: React.ReactNode; dark?: boolean; tone?: string}> = ({children, dark, tone}) => (
	<AbsoluteFill style={{background: dark ? NIGHT : tone ?? T.paper, overflow: 'hidden'}}>
		{children}
		{!dark && <PaperFinish />}
	</AbsoluteFill>
);

/** A clip from the trailers, silent, on the 1960s TV, tinted teal. */
export const Clip: React.FC<{n: string; x?: number; y?: number; w?: number; rot?: number; on?: number; rate?: number; from?: number; mono?: boolean}> = ({n, x = 1340, y = 520, w = 820, rot = 1.5, on = 2, rate = 0.75, from = 0, mono}) => (
	<TV src={F(n)} x={x} y={y} w={w} rot={rot} on={on} grade={mono ? 'mono' : 'colour'} rate={rate} startFrom={from} tint={mono ? undefined : TEAL} />
);

/** Small typed credit under a clip. */
export const Credit: React.FC<{text: string; x: number; y: number; at?: number; id: string; dark?: boolean}> = ({text, x, y, at = 6, id, dark}) => (
	<Piece id={id} x={x} y={y} rot={-0.6} at={at}>
		<div style={{fontFamily: 'Elite', fontSize: 19, letterSpacing: 2, color: dark ? '#cfe7e3' : '#4a4740', background: dark ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.55)', padding: '3px 10px'}}>{text.toUpperCase()}</div>
	</Piece>
);

// ---------------------------------------------------------------- legal pleading paper
/** A sheet of numbered legal pleading paper with typed lines (transcripts, quotes, rulings). */
export const Pleading: React.FC<{
	id: string;
	x: number;
	y: number;
	w?: number;
	rot?: number;
	at: number;
	head?: string;
	lines: string[];
	cps?: number;
	size?: number;
	hl?: number[]; // line indexes to highlight in amber
	hlAt?: number;
	end?: number;
}> = ({id, x, y, w = 900, rot = -1.2, at, head, lines, cps = 1.6, size = 34, hl = [], hlAt = 0, end}) => {
	const f2 = useTwos();
	const lh = size * 1.55;
	let budget = Math.max(0, (f2 - at - 4) * cps);
	return (
		<Piece id={id} x={x} y={y} rot={rot} at={at} end={end}>
			<div style={{position: 'relative', width: w, padding: `40px 50px 46px 110px`, background: '#FBFAF5', boxShadow: '8px 12px 22px rgba(29,28,32,.32)'}}>
				<div style={{position: 'absolute', left: 84, top: 0, bottom: 0, width: 6, borderLeft: '2px solid #C9605A', borderRight: '2px solid #C9605A'}} />
				<div style={{position: 'absolute', right: 34, top: 0, bottom: 0, width: 2, background: '#C9605A', opacity: 0.6}} />
				{Array.from({length: Math.ceil((lines.length + (head ? 1.6 : 0)) * 1) + 1}).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: 30, top: 40 + i * lh + size * 0.18, fontFamily: 'Elite', fontSize: size * 0.55, color: '#9a958a'}}>
						{i + 1}
					</div>
				))}
				{head && <div style={{fontFamily: 'Elite', fontSize: size * 0.78, letterSpacing: 4, color: '#5d5a55', height: lh * 1.6, lineHeight: `${lh}px`}}>{head.toUpperCase()}</div>}
				{lines.map((ln, i) => {
					const n = Math.min(ln.length, Math.floor(budget));
					budget -= ln.length;
					const lit = hl.includes(i) && f2 >= hlAt;
					return (
						<div key={i} style={{position: 'relative', fontFamily: 'Elite', fontSize: size, lineHeight: `${lh}px`, color: V.ink, whiteSpace: 'pre'}}>
							{lit && <div style={{position: 'absolute', left: -6, top: lh * 0.18, height: lh * 0.68, width: `${Math.min(1, (f2 - hlAt) / 10) * (ln.length * size * 0.6 + 12)}px`, background: AMBER, opacity: 0.55, mixBlendMode: 'multiply'}} />}
							<span style={{position: 'relative'}}>
								{ln.slice(0, Math.max(0, n))}
								<span style={{opacity: 0}}>{ln.slice(Math.max(0, n))}</span>
							</span>
						</div>
					);
				})}
			</div>
		</Piece>
	);
};

// ---------------------------------------------------------------- microscope slides
/** A clean glass microscope slide with a frosted, typed label. */
export const Slide: React.FC<{label: string; w?: number; glow?: number; dim?: boolean}> = ({label, w = 360, glow = 0, dim}) => {
	const h = w * 0.33;
	return (
		<div
			style={{
				position: 'relative',
				width: w,
				height: h,
				borderRadius: 4,
				background: dim ? 'linear-gradient(135deg, rgba(160,180,185,.18), rgba(120,140,150,.1))' : 'linear-gradient(135deg, rgba(225,245,245,.75), rgba(170,205,210,.45) 45%, rgba(235,250,250,.7))',
				border: '1.5px solid rgba(255,255,255,.75)',
				boxShadow: `0 6px 12px rgba(0,0,0,.3)${glow ? `, 0 0 ${30 * glow}px ${TEAL}` : ''}`,
				overflow: 'hidden',
			}}
		>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.34, background: dim ? '#5b6366' : '#F1F0EA', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontFamily: 'Elite', fontSize: w * 0.078, lineHeight: 1.05, color: '#2b2a27', textAlign: 'center', padding: 4, whiteSpace: 'pre'}}>{label}</div>
			</div>
			<div style={{position: 'absolute', left: w * 0.34, top: 0, right: 0, bottom: 0, background: 'linear-gradient(115deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,.3) 100%)'}} />
			{glow > 0 && <div style={{position: 'absolute', left: w * 0.34, top: 0, right: 0, bottom: 0, background: TEAL, opacity: 0.35 * glow}} />}
		</div>
	);
};

/** A slide that slaps down on the board with a glass clink. */
export const SlidePiece: React.FC<{id: string; label: string; x: number; y: number; at: number; rot?: number; w?: number; glow?: number}> = ({id, label, x, y, at, rot = -4, w, glow}) => (
	<Piece id={id} x={x} y={y} rot={rot} at={at}>
		<Slide label={label} w={w} glow={glow} />
	</Piece>
);

/**
 * The signature prop: a slide box with ten slots. In the verdict, `fill`
 * slides drop into the box and glow teal: the Reality Score meter.
 */
export const SlideBox: React.FC<{x?: number; y?: number; fill: number; fillAt: number; step?: number; scale?: number}> = ({x = 960, y = 400, fill, fillAt, step = 9, scale = 1}) => {
	const frame = useCurrentFrame();
	const W = 1240,
		H = 300;
	return (
		<div style={{position: 'absolute', left: x - (W * scale) / 2, top: y - (H * scale) / 2, width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0'}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(180deg,#26302F,#151B1C)', boxShadow: '0 30px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.08)'}} />
			<div style={{position: 'absolute', left: 30, top: 18, fontFamily: 'Elite', fontSize: 22, letterSpacing: 6, color: '#8FB9B6'}}>SLIDE BOX · CASE 003</div>
			{Array.from({length: 10}).map((_, i) => {
				const at = fillAt + i * step;
				const isIn = i < fill;
				const drop = isIn ? interpolate(frame - at, [0, 6, 9], [-240, 6, 0], clamp) : 0;
				const shown = isIn && frame >= at;
				return (
					<div key={i} style={{position: 'absolute', left: 40 + i * 118, top: 60, width: 100, height: 210}}>
						<div style={{position: 'absolute', inset: 0, borderRadius: 6, background: '#0B1011', boxShadow: 'inset 0 4px 10px rgba(0,0,0,.8)'}} />
						<div style={{position: 'absolute', left: 0, right: 0, bottom: -34, textAlign: 'center', fontFamily: 'Bebas', fontSize: 30, color: shown ? TEAL : '#4b5759'}}>{i + 1}</div>
						{shown && (
							<div
								style={{
									position: 'absolute',
									left: 36,
									top: 12 + drop,
									width: 28,
									height: 186,
									borderRadius: 3,
									background: 'linear-gradient(90deg, rgba(225,250,250,.9), rgba(140,210,208,.7))',
									boxShadow: `0 0 26px ${TEAL}, 0 0 6px #fff`,
								}}
							>
								<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: '#F1F0EA', borderRadius: '3px 3px 0 0'}} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

// ---------------------------------------------------------------- charts and icons
/** Ten little figures, `lit` of them coloured: "9 in 10", "less than half". */
export const TenDots: React.FC<{lit: number; at: number; color?: string; x: number; y: number; size?: number; off?: string; partial?: number}> = ({lit, at, color = TEAL, x, y, size = 70, off = '#C9C5BB', partial = 0}) => {
	const f2 = useTwos();
	return (
		<div style={{position: 'absolute', left: x, top: y, display: 'flex', gap: size * 0.28}}>
			{Array.from({length: 10}).map((_, i) => {
				const s = slap(f2, at + i * 2);
				const on = i < lit;
				const part = i === lit && partial > 0;
				return (
					<div key={i} style={{width: size, height: size * 1.6, opacity: s === null ? 0 : 1, transform: `scale(${s ?? 1})`, position: 'relative'}}>
						<Person size={size} color={on ? color : off} />
						{part && (
							<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - partial * 100}% 0 0)`}}>
								<Person size={size} color={color} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

const Person: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size * 1.6} viewBox="0 0 50 80" style={{position: 'absolute', left: 0, top: 0}}>
		<circle cx={25} cy={14} r={12} fill={color} />
		<path d="M5 78 L5 44 Q5 30 25 30 Q45 30 45 44 L45 78 Z" fill={color} />
	</svg>
);

/** A coin that flips on twos and lands heads (teal) or tails (grey). */
export const Coin: React.FC<{x: number; y: number; at: number; size?: number; win?: boolean; id: string}> = ({x, y, at, size = 110, win = true, id}) => {
	const f2 = useTwos();
	const t = f2 - at;
	if (t < 0) return null;
	const flipping = t < 14;
	const sy = flipping ? Math.abs(Math.cos(t * 0.9)) : 1;
	const yy = flipping ? -Math.sin((t / 14) * Math.PI) * 120 : 0;
	return (
		<div style={{position: 'absolute', left: x, top: y + yy, width: size, height: size, transform: `scaleY(${Math.max(0.08, sy)})`}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					borderRadius: '50%',
					background: flipping ? 'radial-gradient(circle at 35% 30%, #F4E3A1, #B8902F 70%)' : win ? `radial-gradient(circle at 35% 30%, #BDF0EC, ${TEAL} 70%)` : 'radial-gradient(circle at 35% 30%, #ddd, #8b8b8b 70%)',
					boxShadow: '4px 8px 10px rgba(0,0,0,.3), inset 0 0 0 6px rgba(255,255,255,.25)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: 'Bebas',
					fontSize: size * 0.5,
					color: '#1D1C20',
				}}
			>
				{flipping ? '' : win ? '✓' : '✗'}
			</div>
		</div>
	);
};

/** A typed big number that counts up. */
export const CountUp: React.FC<{to: number; at: number; dur?: number; x: number; y: number; size?: number; color?: string; suffix?: string; comma?: boolean; id: string}> = ({to, at, dur = 30, x, y, size = 200, color = V.ink, suffix = '', comma = true, id}) => {
	const frame = useCurrentFrame();
	const boil = useBoil(id);
	if (frame < at) return null;
	const v = Math.round(interpolate(frame, [at, at + dur], [0, to], {...clamp, easing: Easing.out(Easing.cubic)}));
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: boil, fontFamily: 'Anton', fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap'}}>
			{comma ? v.toLocaleString('en-US') : v}
			{suffix}
		</div>
	);
};

/** Simple line icons for "the one piece of data". */
export const Icon: React.FC<{k: 'dna' | 'card' | 'tree' | 'cpu' | 'camera' | 'gavel'; size?: number; color?: string}> = ({k, size = 140, color = V.ink}) => {
	const sw = 5;
	const common = {fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<svg width={size} height={size} viewBox="0 0 100 100">
			{k === 'dna' && (
				<g {...common}>
					<path d="M30 8 C70 30 30 70 70 92" />
					<path d="M70 8 C30 30 70 70 30 92" />
					{[20, 35, 50, 65, 80].map((y) => (
						<line key={y} x1={38} y1={y} x2={62} y2={y} strokeWidth={3} />
					))}
				</g>
			)}
			{k === 'card' && (
				<g {...common}>
					<rect x={10} y={24} width={80} height={52} rx={7} />
					<line x1={10} y1={38} x2={90} y2={38} strokeWidth={9} />
					<rect x={18} y={52} width={20} height={14} rx={2} strokeWidth={3} />
					<line x1={50} y1={64} x2={80} y2={64} strokeWidth={3} />
				</g>
			)}
			{k === 'tree' && (
				<g {...common}>
					<rect x={40} y={8} width={20} height={14} rx={3} />
					<line x1={50} y1={22} x2={50} y2={34} />
					<line x1={22} y1={34} x2={78} y2={34} />
					{[22, 50, 78].map((x) => (
						<g key={x}>
							<line x1={x} y1={34} x2={x} y2={46} />
							<rect x={x - 10} y={46} width={20} height={14} rx={3} />
						</g>
					))}
					<line x1={50} y1={60} x2={50} y2={72} />
					<rect x={40} y={72} width={20} height={14} rx={3} fill={TEAL} stroke={color} />
				</g>
			)}
			{k === 'cpu' && (
				<g {...common}>
					<rect x={14} y={18} width={72} height={50} rx={5} />
					<line x1={38} y1={84} x2={62} y2={84} />
					<line x1={50} y1={68} x2={50} y2={84} />
					{[[30, 34], [44, 46], [58, 30], [70, 52], [36, 54]].map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={3.5} fill={i < 3 ? HOUSE_RED : color} stroke="none" />
					))}
					<circle cx={44} cy={38} r={16} strokeWidth={3} strokeDasharray="4 3" />
				</g>
			)}
			{k === 'camera' && (
				<g {...common}>
					<rect x={12} y={34} width={56} height={30} rx={4} />
					<path d="M68 42 L86 34 L86 64 L68 56" />
					<line x1={30} y1={64} x2={26} y2={86} />
					<circle cx={24} cy={46} r={4} fill={HOUSE_RED} stroke="none" />
				</g>
			)}
			{k === 'gavel' && (
				<g {...common}>
					<rect x={30} y={14} width={44} height={22} rx={4} transform="rotate(35 52 25)" />
					<line x1={44} y1={40} x2={18} y2={78} strokeWidth={7} />
					<rect x={52} y={76} width={40} height={10} rx={3} />
				</g>
			)}
		</svg>
	);
};

/** A labelled icon card that slaps down. */
export const IconCard: React.FC<{k: React.ComponentProps<typeof Icon>['k']; label: string; sub?: string; x: number; y: number; at: number; id: string; rot?: number; accent?: string}> = ({k, label, sub, x, y, at, id, rot = 0, accent = TEAL}) => (
	<Piece id={id} x={x} y={y} rot={rot} at={at}>
		<div style={{width: 360, padding: '26px 24px 22px', background: '#FBF8EF', boxShadow: '6px 9px 16px rgba(29,28,32,.32)', borderTop: `14px solid ${accent}`, textAlign: 'center'}}>
			<Icon k={k} size={150} />
			<div style={{fontFamily: 'Bebas', fontSize: 52, color: V.ink, marginTop: 8, lineHeight: 1}}>{label}</div>
			{sub && <div style={{fontFamily: 'Elite', fontSize: 22, letterSpacing: 2, color: '#5d5a55', marginTop: 8}}>{sub.toUpperCase()}</div>}
		</div>
	</Piece>
);

/** An archive photo, full frame, with a slow push and a teal-cool grade. */
export const Plate: React.FC<{src: string; d: number; from?: number; to?: number; pos?: string; dark?: number; mono?: boolean; ox?: [number, number]}> = ({src, d, from = 1.04, to = 1.14, pos = '50% 50%', dark = 0.1, mono, ox = [0, 0]}) => {
	const frame = useCurrentFrame();
	const e = interpolate(frame, [0, d], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<Img
				src={staticFile(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: pos,
					filter: mono ? 'grayscale(1) contrast(1.15)' : 'saturate(.75) contrast(1.06) brightness(.95)',
					transform: `scale(${from + (to - from) * e}) translateX(${ox[0] + (ox[1] - ox[0]) * e}px)`,
				}}
			/>
			{!mono && <AbsoluteFill style={{background: TEAL, mixBlendMode: 'soft-light', opacity: 0.35}} />}
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${dark}) 45%, rgba(0,0,0,${0.55 + dark}) 100%)`}} />
		</AbsoluteFill>
	);
};

/** A white marker label with a dark backing, for use over photos. */
export const Caption: React.FC<{text: string; x: number; y: number; at: number; id: string; size?: number}> = ({text, x, y, at, id, size = 26}) => (
	<Piece id={id} x={x} y={y} rot={-1} at={at}>
		<div style={{fontFamily: 'Elite', fontSize: size, letterSpacing: size * 0.15, color: '#F3EEE3', background: 'rgba(11,20,24,.78)', padding: '6px 14px', whiteSpace: 'nowrap'}}>{text.toUpperCase()}</div>
	</Piece>
);

export const fadeIn = (f: number, a: number, len = 8) => lerp(f, a, a + len, 0, 1);
