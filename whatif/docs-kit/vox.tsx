/**
 * Vox-style collage kit: everything animates on twos, paper "boils",
 * pieces slap down (never fade), ink writes itself on, numbers arrive as
 * ransom-note letters, and maps are engraved with one yellow accent.
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';

const f = (family: string, file: string, weight = '400', style = 'normal') =>
	loadFont({family, url: staticFile(`fonts/${file}`), weight, style});
export const voxFonts = Promise.all([
	f('Caslon', 'LibreCaslon-400.woff2'),
	f('Caslon', 'LibreCaslon-400i.woff2', '400', 'italic'),
	f('Caslon', 'LibreCaslon-700.woff2', '700'),
	f('Marker', 'PermanentMarker.woff2'),
	f('Anton', 'Anton.woff2'),
]);

export const V = {board: '#EFEBE3', ink: '#1D1C20', yellow: '#EDBD2E', beige: '#F1EDE4'};

/** The frame, held for two frames ("on twos"). */
export const useTwos = () => {
	const frame = useCurrentFrame();
	return Math.floor(frame / 2) * 2;
};

const hash = (s: string) => {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return (h >>> 0) / 4294967295;
};
/** A repeatable random number in [-1, 1] for an id, a boil step and a channel. */
const jit = (id: string, step: number, ch: number) => hash(`${id}:${step % 3}:${ch}`) * 2 - 1;

/** Paper boil: ±1.5 px and ±0.4°, changing every 8 frames. */
export const useBoil = (id: string) => {
	const frame = useCurrentFrame();
	const step = Math.floor(frame / 8);
	return `translate(${(jit(id, step, 0) * 1.5).toFixed(2)}px, ${(jit(id, step, 1) * 1.5).toFixed(2)}px) rotate(${(jit(id, step, 2) * 0.4).toFixed(2)}deg)`;
};

/** Slap-in scale (1.1 → 0.98 → 1.0, on twos). Null before it lands. */
export const slap = (f2: number, at: number) => {
	const t = f2 - at;
	if (t < 0) return null;
	return t < 2 ? 1.1 : t < 4 ? 0.98 : 1;
};

type Pos = {x: number; y: number; rot?: number; at: number; id: string};

/** A piece that slaps down and boils. */
export const Piece: React.FC<Pos & {children: React.ReactNode; origin?: string; end?: number}> = ({x, y, rot = 0, at, id, children, origin = '50% 50%', end}) => {
	const f2 = useTwos();
	const boil = useBoil(id);
	const s = slap(f2, at);
	if (s === null || (end !== undefined && f2 >= end)) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `${boil} rotate(${rot}deg) scale(${s})`, transformOrigin: origin}}>{children}</div>
	);
};

/** Cut-paper ransom letters, one slapped down every 3–4 frames. */
export const Ransom: React.FC<Pos & {text: string; size?: number; end?: number}> = ({text, size = 120, x, y, rot = 0, at, id, end}) => {
	const f2 = useTwos();
	const fonts = [
		{fontFamily: 'Caslon', fontWeight: 700},
		{fontFamily: 'Anton', fontWeight: 400},
		{fontFamily: 'Elite', fontWeight: 400},
	];
	const looks = [
		{background: V.ink, color: V.beige},
		{background: V.beige, color: V.ink},
		{background: V.yellow, color: V.ink},
	];
	if (end !== undefined && f2 >= end) return null;
	let t = at;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, display: 'flex', gap: size * 0.06, alignItems: 'center'}}>
			{text.split('').map((ch, i) => {
				const myAt = t;
				t += i % 2 ? 4 : 3;
				if (ch === ' ') return <div key={i} style={{width: size * 0.3}} />;
				const s = slap(f2, myAt);
				if (s === null) return <div key={i} style={{width: size * 0.62, visibility: 'hidden'}} />;
				const k = Math.floor(hash(`${id}${i}`) * 3);
				const r = (hash(`${id}r${i}`) * 2 - 1) * 7;
				return (
					<Boiler key={i} id={`${id}-${i}`}>
						<div
							style={{
								...fonts[(i + k) % 3],
								...looks[(i * 2 + k) % 3],
								fontSize: size * (0.78 + hash(`${id}s${i}`) * 0.3),
								lineHeight: 1,
								padding: `${size * 0.08}px ${size * 0.1}px ${size * 0.04}px`,
								transform: `rotate(${r}deg) scale(${s})`,
								boxShadow: '4px 6px 8px rgba(29,28,32,.32)',
							}}
						>
							{ch}
						</div>
					</Boiler>
				);
			})}
		</div>
	);
};

const Boiler: React.FC<{id: string; children: React.ReactNode}> = ({id, children}) => {
	const boil = useBoil(id);
	return <div style={{transform: boil}}>{children}</div>;
};

/** A felt-marker note, lower-case, written on at 1.3 letters per frame. */
export const MarkerNote: React.FC<Pos & {text: string; size?: number; end?: number; color?: string}> = ({text, size = 64, x, y, rot = -3, at, id, end, color = V.ink}) => {
	const f2 = useTwos();
	const boil = useBoil(id);
	if (f2 < at || (end !== undefined && f2 >= end)) return null;
	const n = Math.floor((f2 - at) * 1.3);
	const t = text.toLowerCase();
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `${boil} rotate(${rot}deg)`, fontFamily: 'Marker', fontSize: size, color, lineHeight: 1.05, whiteSpace: 'pre'}}>
			{t.slice(0, n)}
			<span style={{opacity: 0}}>{t.slice(n)}</span>
		</div>
	);
};

/** A typed tag on a small yellow paper strip. */
export const Tag: React.FC<Pos & {text: string; size?: number; end?: number}> = ({text, size = 24, ...p}) => (
	<Piece {...p}>
		<div style={{fontFamily: 'Elite', fontSize: size, letterSpacing: size * 0.18, color: V.ink, background: V.yellow, padding: '6px 14px 4px', whiteSpace: 'nowrap', boxShadow: '3px 5px 6px rgba(29,28,32,.28)'}}>
			{text.toUpperCase()}
		</div>
	</Piece>
);

/** The beige title card, top left: a Caslon headline typing 1 letter per frame, then an italic dateline. */
export const TitleCard: React.FC<{fig: number; title: string; sub?: string; at: number; id?: string; end?: number}> = ({fig, title, sub = '', at, id = 'title', end}) => {
	const f2 = useTwos();
	const boil = useBoil(id);
	const s = slap(f2, at);
	if (s === null || (end !== undefined && f2 >= end)) return null;
	const n = Math.max(0, f2 - at - 4);
	const m = Math.max(0, n - title.length - 4);
	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				top: 50,
				width: 560,
				padding: '50px 34px 30px',
				background: V.beige,
				transform: `${boil} rotate(-1.2deg) scale(${s})`,
				transformOrigin: '0 0',
				boxShadow: '5px 7px 12px rgba(29,28,32,.32)',
			}}
		>
			<div style={{position: 'absolute', left: 24, top: 16, background: V.yellow, fontFamily: 'Elite', fontSize: 18, letterSpacing: 3, padding: '2px 10px', color: V.ink}}>
				FIG. {String(fig).padStart(2, '0')}
			</div>
			<div style={{fontFamily: 'Caslon', fontSize: 68, lineHeight: 1.04, color: V.ink}}>
				{title.slice(0, n)}
				<span style={{opacity: 0}}>{title.slice(n)}</span>
			</div>
			{sub && (
				<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 30, color: V.ink, marginTop: 12, borderTop: `2px solid ${V.ink}`, paddingTop: 10}}>
					{sub.slice(0, m)}
					<span style={{opacity: 0}}>{sub.slice(m)}</span>
				</div>
			)}
		</div>
	);
};

/** A real archive photo (path under public/) as a halftone cut-out with a scissor edge. */
export const Cutout: React.FC<Pos & {src: string; w: number; h: number; pos?: string; end?: number}> = ({src, w, h, pos = '50% 50%', ...p}) => {
	const f2 = useTwos();
	const seed = Math.floor(f2 / 8) % 3;
	return (
		<Piece {...p}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={`edge-${p.id}-${seed}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={seed + 3} />
					<feDisplacementMap in="SourceGraphic" scale={6} />
				</filter>
			</svg>
			<div style={{position: 'relative', width: w + 14, height: h + 14, filter: `drop-shadow(5px 7px 6px rgba(29,28,32,.32))`}}>
				<div style={{position: 'absolute', inset: 0, background: '#fff', filter: `url(#edge-${p.id}-${seed})`}} />
				<div style={{position: 'absolute', left: 7, top: 7, width: w, height: h, overflow: 'hidden', background: '#ddd'}}>
					<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.25)'}} />
					<div
						style={{
							position: 'absolute',
							inset: -20,
							backgroundImage: 'radial-gradient(rgba(29,28,32,.9) 32%, transparent 36%)',
							backgroundSize: '5px 5px',
							transform: 'rotate(45deg)',
							mixBlendMode: 'multiply',
							opacity: 0.34,
						}}
					/>
				</div>
			</div>
		</Piece>
	);
};

// ---------------------------------------------------------------- ink
/** Felt-marker ink: a wobbly line that writes itself on, in screen space. */
export const Ink: React.FC<{d: string; at: number; dur?: number; width?: number; color?: string; dash?: boolean; len?: number; id: string; end?: number; arrow?: [number, number, number] | null}> = ({
	d,
	at,
	dur = 12,
	width = 5.5,
	color = V.ink,
	dash,
	len = 2400,
	id,
	end,
	arrow,
}) => {
	const f2 = useTwos();
	if (f2 < at || (end !== undefined && f2 >= end)) return null;
	const p = Math.min(1, (f2 - at) / dur);
	const seed = Math.floor(f2 / 8) % 3;
	const fid = `ink-${id}-${seed}`;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<defs>
				<filter id={fid} x="-10%" y="-10%" width="120%" height="120%">
					<feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={seed + 11} />
					<feDisplacementMap in="SourceGraphic" scale={3.2} />
				</filter>
				<mask id={`m-${id}`}>
					<path d={d} fill="none" stroke="#fff" strokeWidth={width * 4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
				</mask>
			</defs>
			<g filter={`url(#${fid})`} mask={`url(#m-${id})`}>
				<path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? '27 19' : undefined} />
				<path d={d} fill="none" stroke={color} strokeWidth={width * 0.32} strokeLinecap="round" strokeDasharray="7 3 2 4" transform="translate(1.4 -1.1)" opacity={0.8} />
			</g>
			{arrow && p >= 1 && (
				<g filter={`url(#${fid})`} stroke={color} strokeWidth={width} strokeLinecap="round">
					<line x1={arrow[0]} y1={arrow[1]} x2={arrow[0] - 26 * Math.cos(arrow[2] - 0.48)} y2={arrow[1] - 26 * Math.sin(arrow[2] - 0.48)} />
					<line x1={arrow[0]} y1={arrow[1]} x2={arrow[0] - 26 * Math.cos(arrow[2] + 0.48)} y2={arrow[1] - 26 * Math.sin(arrow[2] + 0.48)} />
				</g>
			)}
		</svg>
	);
};

export const InkCircle: React.FC<{x: number; y: number; r: number; at: number; id: string; end?: number}> = ({x, y, r, at, id, end}) => {
	const rx = r * 1.15;
	const d = `M ${x + rx} ${y} A ${rx} ${r} 0 1 1 ${x + rx - 3} ${y - r * 0.4} L ${x + rx * 0.82} ${y - r * 0.82}`;
	return <Ink d={d} at={at} dur={12} id={id} end={end} len={8 * r} />;
};

export const InkX: React.FC<{x: number; y: number; at: number; id: string; end?: number}> = ({x, y, at, id, end}) => (
	<>
		<Ink d={`M ${x - 20} ${y - 20} L ${x + 20} ${y + 20}`} at={at} dur={4} id={`${id}a`} end={end} len={80} />
		<Ink d={`M ${x + 20} ${y - 20} L ${x - 20} ${y + 20}`} at={at + 2} dur={4} id={`${id}b`} end={end} len={80} />
	</>
);

/** Yellow highlighter swipe (multiplied). */
export const Highlighter: React.FC<{x: number; y: number; w: number; h?: number; at: number; dur?: number}> = ({x, y, w, h = 30, at, dur = 10}) => {
	const f2 = useTwos();
	if (f2 < at) return null;
	const p = Math.min(1, (f2 - at) / dur);
	return <div style={{position: 'absolute', left: x, top: y, width: w * p, height: h, background: V.yellow, mixBlendMode: 'multiply', opacity: 0.9, transform: 'rotate(-1deg)'}} />;
};

/** Paper finish over everything: texture, vignette and dust swapped every 8 frames. */
export const PaperFinish: React.FC = () => {
	const f2 = useTwos();
	const step = Math.floor(f2 / 8) % 3;
	const specks = Array.from({length: 26}).map((_, i) => ({x: hash(`dx${step}${i}`) * 1920, y: hash(`dy${step}${i}`) * 1080, r: 0.6 + hash(`dr${step}${i}`) * 1.6}));
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{mixBlendMode: 'multiply', opacity: 0.55}}>
				<Img src={staticFile('doc01/tex/card.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(60,45,30,.22) 100%)'}} />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{specks.map((s, i) => (
					<circle key={i} cx={s.x} cy={s.y} r={s.r} fill={V.ink} opacity={0.35} />
				))}
			</svg>
		</AbsoluteFill>
	);
};
