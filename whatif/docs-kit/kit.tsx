/**
 * Documentary kit: the building blocks of every "real world behind the fiction"
 * video. Everything is drawn here (no film or game footage): archive photos,
 * paper, maps, stamps, type and data.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

// ---------------------------------------------------------------- fonts
const f = (family: string, file: string, weight = '400', style = 'normal') =>
	loadFont({family, url: staticFile(`fonts/${file}`), weight, style});
export const docFonts = Promise.all([
	f('Bebas', 'BebasNeue.woff2'),
	f('Oswald', 'Oswald-300.woff2', '300'),
	f('Oswald', 'Oswald-400.woff2', '400'),
	f('Oswald', 'Oswald-700.woff2', '700'),
	f('Playfair', 'Playfair-400.woff2', '400'),
	f('Playfair', 'Playfair-400i.woff2', '400', 'italic'),
	f('Playfair', 'Playfair-700.woff2', '700'),
	f('Playfair', 'Playfair-700i.woff2', '700', 'italic'),
	f('Elite', 'SpecialElite.woff2'),
	f('Caveat', 'Caveat-700.woff2', '700'),
]);

export const C = {
	ink: '#211C16',
	paper: '#E9DEC6',
	red: '#B8231E',
	yellow: '#F2C200',
	navy: '#0E1620',
	gold: '#BF8420',
	cream: '#F2EBDD',
	pink: '#F4B6C2',
	mint: '#A8E0CC',
	lavender: '#C9B6E4',
	sea: '#BCDDE3',
};

export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) =>
	interpolate(f, [a, b], [from, to], {...clamp, easing: e});
const asset = (p: string) => staticFile(`doc01/${p}`);
/** An image: a bare name is from doc01/img, a path with a slash is under public/. */
export const img = (n: string) => (n.includes('/') ? staticFile(n) : asset(`img/${n}`));

// a soft settle used for things dropping onto the desk
export const useDrop = (at: number, damping = 14) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - at, fps, config: {damping, mass: 0.8, stiffness: 120}});
};

// ---------------------------------------------------------------- surfaces
export const Bg: React.FC<{kind?: 'paper' | 'cork' | 'navy' | 'black' | 'card'}> = ({kind = 'paper'}) =>
	kind === 'black' ? (
		<AbsoluteFill style={{background: '#050505'}} />
	) : (
		<AbsoluteFill>
			<Img src={asset(`tex/${kind}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</AbsoluteFill>
	);

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.22}) => {
	const frame = useCurrentFrame();
	const i = Math.floor(frame / 2) % 6;
	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
			<Img src={asset(`tex/grain${i}.png`)} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
		</AbsoluteFill>
	);
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
	<AbsoluteFill
		style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none'}}
	/>
);

export const Letterbox: React.FC<{h?: number}> = ({h = 120}) => (
	<>
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h, background: '#000'}} />
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: '#000'}} />
	</>
);

// fade a whole shot in from black/paper and out at its end
export const Fade: React.FC<{d: number; inF?: number; outF?: number; children: React.ReactNode}> = ({d, inF = 8, outF = 8, children}) => {
	const frame = useCurrentFrame();
	const o = Math.min(lerp(frame, 0, inF, inF ? 0 : 1, 1), lerp(frame, d - outF, d, 1, outF ? 0 : 1));
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- camera
export type View = {x: number; y: number; s: number; r?: number};
/** Moves a 1920x1080 "desk" under a slow camera, from one view to another. */
export const Cam: React.FC<{d: number; from: View; to: View; children: React.ReactNode; e?: (t: number) => number}> = ({
	d,
	from,
	to,
	children,
	e = Easing.bezier(0.33, 0, 0.3, 1),
}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, d], [0, 1], {...clamp, easing: e});
	const x = from.x + (to.x - from.x) * t;
	const y = from.y + (to.y - from.y) * t;
	const s = from.s + (to.s - from.s) * t;
	const r = (from.r ?? 0) + ((to.r ?? 0) - (from.r ?? 0)) * t;
	return (
		<AbsoluteFill style={{transform: `translate(960px,540px) rotate(${r}deg) scale(${s}) translate(${-x}px,${-y}px)`, transformOrigin: '0 0'}}>
			{children}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- photos
type PhotoProps = {
	src: string;
	x: number;
	y: number;
	w: number;
	h?: number;
	rot?: number;
	at?: number;
	caption?: string;
	captionFont?: 'Caveat' | 'Elite';
	tape?: boolean;
	bw?: boolean;
	sepia?: number;
	border?: number;
	pos?: string;
	zoom?: [number, number];
	d?: number;
	shadow?: boolean;
};
/** A printed photo dropped onto the desk: white border, tape, shadow and a caption. */
export const Photo: React.FC<PhotoProps> = ({
	src,
	x,
	y,
	w,
	h,
	rot = 0,
	at = 0,
	caption,
	captionFont = 'Elite',
	tape = true,
	bw,
	sepia = 0.1,
	border = 16,
	pos = '50% 50%',
	zoom = [1, 1.06],
	d = 300,
	shadow = true,
}) => {
	const frame = useCurrentFrame();
	const p = useDrop(at);
	if (frame < at) return null;
	const hh = h ?? w * 0.72;
	const z = lerp(frame, at, at + d, zoom[0], zoom[1], Easing.linear);
	const filter = `${bw ? 'grayscale(1) ' : ''}sepia(${sepia}) contrast(1.06)`;
	const capH = caption ? 64 : border;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w + border * 2,
				padding: `${border}px ${border}px ${capH}px`,
				background: '#F7F2E6',
				boxShadow: shadow ? `0 ${18 * p}px ${34 * p}px rgba(30,20,10,${0.32 * p}), 0 2px 5px rgba(30,20,10,.25)` : undefined,
				transform: `translateY(${(1 - p) * -60}px) rotate(${rot + (1 - p) * 6}deg) scale(${1 + (1 - p) * 0.12})`,
				opacity: Math.min(1, p * 1.6),
			}}
		>
			<div style={{width: w, height: hh, overflow: 'hidden', position: 'relative'}}>
				<Img
					src={img(src)}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter, transform: `scale(${z})`}}
				/>
			</div>
			{caption && (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: captionFont === 'Caveat' ? 8 : 18,
						textAlign: 'center',
						fontFamily: captionFont,
						fontWeight: captionFont === 'Caveat' ? 700 : 400,
						fontSize: captionFont === 'Caveat' ? 40 : 24,
						color: captionFont === 'Caveat' ? '#1E2A55' : C.ink,
					}}
				>
					{caption}
				</div>
			)}
			{tape && <Tape x={w / 2 - 70 + border} y={-22} rot={-3} />}
		</div>
	);
};

export const Tape: React.FC<{x: number; y: number; rot?: number; w?: number}> = ({x, y, rot = 0, w = 150}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: w,
			height: 42,
			background: 'rgba(244,232,190,.78)',
			boxShadow: '0 2px 4px rgba(0,0,0,.12)',
			transform: `rotate(${rot}deg)`,
		}}
	/>
);

/** A full-screen archive photo with a slow Ken Burns move. */
export const Full: React.FC<{
	src: string;
	d: number;
	from?: View;
	to?: View;
	bw?: boolean;
	sepia?: number;
	grade?: string;
	pos?: string;
	letterbox?: number;
	darken?: number;
}> = ({src, d, from = {x: 0, y: 0, s: 1.04}, to = {x: 0, y: 0, s: 1.14}, bw, sepia = 0, grade, pos = '50% 50%', letterbox, darken = 0}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, d], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.4, 1)});
	const s = from.s + (to.s - from.s) * t;
	const x = from.x + (to.x - from.x) * t;
	const y = from.y + (to.y - from.y) * t;
	const filter = grade ?? `${bw ? 'grayscale(1) ' : ''}sepia(${sepia}) contrast(1.08)`;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<Img
				src={img(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: pos,
					filter,
					transform: `scale(${s}) translate(${x}px,${y}px)`,
				}}
			/>
			{darken > 0 && <AbsoluteFill style={{background: `rgba(0,0,0,${darken})`}} />}
			{letterbox ? <Letterbox h={letterbox} /> : null}
		</AbsoluteFill>
	);
};

/** A cut-out sticker with a white edge. */
export const Sticker: React.FC<{src: string; x: number; y: number; h: number; rot?: number; at?: number}> = ({src, x, y, h, rot = 0, at = 0}) => {
	const frame = useCurrentFrame();
	const p = useDrop(at, 12);
	if (frame < at) return null;
	return (
		<Img
			src={img(src)}
			style={{
				position: 'absolute',
				left: x,
				top: y,
				height: h,
				transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * p})`,
				opacity: Math.min(1, p * 1.5),
				filter: 'drop-shadow(0 14px 18px rgba(30,20,10,.35))',
			}}
		/>
	);
};

// ---------------------------------------------------------------- type
/** A rubber stamp that thumps down. */
export const Stamp: React.FC<{text: string; x: number; y: number; at?: number; rot?: number; size?: number; color?: string; box?: boolean; onDark?: boolean}> = ({
	text,
	x,
	y,
	at = 0,
	rot = -8,
	size = 90,
	color = C.red,
	box = true,
	onDark,
}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const t = frame - at;
	const s = interpolate(t, [0, 4, 7], [1.8, 0.94, 1], clamp);
	const o = interpolate(t, [0, 3], [0, 0.9], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`,
				opacity: o,
				color,
				fontFamily: 'Bebas',
				fontSize: size,
				letterSpacing: size * 0.06,
				lineHeight: 1,
				padding: box ? `${size * 0.12}px ${size * 0.25}px ${size * 0.04}px` : 0,
				border: box ? `${Math.max(4, size * 0.07)}px solid ${color}` : undefined,
				borderRadius: size * 0.08,
				whiteSpace: 'nowrap',
				WebkitMaskImage: `url(${asset('tex/grunge.png')})`,
				WebkitMaskSize: '420px 210px',
				mixBlendMode: onDark ? 'normal' : 'multiply',
			}}
		>
			{text}
		</div>
	);
};

/** Text typed out letter by letter. */
export const Typed: React.FC<{text: string; at?: number; cps?: number; style?: React.CSSProperties}> = ({text, at = 0, cps = 28, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const n = Math.max(0, Math.floor(((frame - at) / fps) * cps));
	return (
		<span style={style}>
			{text.slice(0, n)}
			<span style={{opacity: 0}}>{text.slice(n)}</span>
		</span>
	);
};

/** Words rising in one by one. */
export const Rise: React.FC<{text: string; at?: number; gap?: number; style?: React.CSSProperties}> = ({text, at = 0, gap = 4, style}) => {
	const frame = useCurrentFrame();
	return (
		<span style={style}>
			{text.split(' ').map((w, i) => {
				const t = frame - at - i * gap;
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: lerp(t, 0, 8, 0, 1),
							transform: `translateY(${lerp(t, 0, 10, 24, 0)}px)`,
							marginRight: '0.25em',
						}}
					>
						{w}
					</span>
				);
			})}
		</span>
	);
};

export const Kicker: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
	children,
	color = C.red,
	size = 30,
	style,
}) => <div style={{fontFamily: 'Elite', fontSize: size, letterSpacing: size * 0.18, color, ...style}}>{children}</div>;

/** A chapter card: kicker, big title, italic subtitle. */
export const ChapterTitle: React.FC<{n: string; title: string; sub?: string; at?: number; dark?: boolean; x?: number; y?: number}> = ({
	n,
	title,
	sub,
	at = 0,
	dark,
	x = 150,
	y = 330,
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	return (
		<div style={{position: 'absolute', left: x, top: y, color: dark ? C.cream : C.ink}}>
			<div style={{opacity: lerp(t, 0, 10, 0, 1)}}>
				<Kicker color={dark ? '#E0A84A' : C.red}>{n}</Kicker>
			</div>
			<div
				style={{
					fontFamily: 'Bebas',
					fontSize: 210,
					lineHeight: 0.92,
					marginTop: 16,
					clipPath: `inset(0 ${lerp(t, 4, 26, 100, 0)}% 0 0)`,
				}}
			>
				{title}
			</div>
			{sub && (
				<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 46, marginTop: 18, opacity: lerp(t, 20, 34, 0, 1)}}>
					{sub}
				</div>
			)}
		</div>
	);
};

/** A typed label on a paper strip. */
export const Label: React.FC<{text: string; x: number; y: number; rot?: number; at?: number; size?: number; dark?: boolean}> = ({
	text,
	x,
	y,
	rot = -1.5,
	at = 0,
	size = 26,
	dark,
}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const o = lerp(frame, at, at + 8, 0, 1);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `rotate(${rot}deg)`,
				opacity: o,
				fontFamily: 'Elite',
				fontSize: size,
				letterSpacing: 1,
				padding: '7px 16px',
				background: dark ? 'rgba(14,22,32,.88)' : '#F8F2E2',
				color: dark ? C.cream : C.ink,
				border: dark ? '1px solid rgba(242,235,221,.35)' : `1.5px solid ${C.ink}`,
				boxShadow: '0 6px 14px rgba(0,0,0,.25)',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** A number that counts up. */
export const Counter: React.FC<{to: number; at?: number; dur?: number; style?: React.CSSProperties; suffix?: string; prefix?: string; decimals?: number}> = ({
	to,
	at = 0,
	dur = 40,
	style,
	suffix = '',
	prefix = '',
	decimals = 0,
}) => {
	const frame = useCurrentFrame();
	const v = lerp(frame, at, at + dur, 0, to, Easing.out(Easing.cubic));
	const s = v.toLocaleString('en-GB', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
	return (
		<span style={style}>
			{prefix}
			{s}
			{suffix}
		</span>
	);
};

/** A hand-drawn marker circle that draws itself. */
export const Circle: React.FC<{x: number; y: number; rx: number; ry: number; at?: number; color?: string; width?: number; dur?: number}> = ({
	x,
	y,
	rx,
	ry,
	at = 0,
	color = C.yellow,
	width = 8,
	dur = 18,
}) => {
	const frame = useCurrentFrame();
	const p = lerp(frame, at, at + dur, 0, 1);
	const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.12;
	return (
		<svg style={{position: 'absolute', left: x - rx - 20, top: y - ry - 20, overflow: 'visible'}} width={rx * 2 + 40} height={ry * 2 + 40}>
			<path
				d={`M ${20 + rx * 2} ${20 + ry} A ${rx} ${ry} 0 1 1 ${20 + rx * 2 - 4} ${20 + ry - ry * 0.35} L ${20 + rx * 1.86} ${20 + ry * 0.2}`}
				fill="none"
				stroke={color}
				strokeWidth={width}
				strokeLinecap="round"
				strokeDasharray={len}
				strokeDashoffset={len * (1 - p)}
				transform={`rotate(-12 ${20 + rx} ${20 + ry})`}
			/>
		</svg>
	);
};

/** A path that draws itself (arrows, rail lines, routes). */
export const Draw: React.FC<{d: string; at?: number; dur?: number; color?: string; width?: number; dash?: string; len?: number; arrow?: boolean}> = ({
	d,
	at = 0,
	dur = 30,
	color = C.red,
	width = 4,
	dash,
	len = 3000,
	arrow,
}) => {
	const frame = useCurrentFrame();
	const p = lerp(frame, at, at + dur, 0, 1);
	const id = React.useId().replace(/:/g, '');
	return (
		<>
			{arrow && (
				<defs>
					<marker id={`ah${id}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill={color} />
					</marker>
				</defs>
			)}
			{dash ? (
				<>
					<mask id={`m${id}`}>
						<path d={d} fill="none" stroke="#fff" strokeWidth={width * 3} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
					</mask>
					<path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} mask={`url(#m${id})`} />
				</>
			) : (
				<path
					d={d}
					fill="none"
					stroke={color}
					strokeWidth={width}
					strokeLinecap="round"
					strokeDasharray={len}
					strokeDashoffset={len * (1 - p)}
					markerEnd={arrow && p > 0.97 ? `url(#ah${id})` : undefined}
				/>
			)}
		</>
	);
};

/** Neon sign text with a flicker-on. */
export const Neon: React.FC<{text: string; color?: string; size?: number; at?: number; font?: string; style?: React.CSSProperties}> = ({
	text,
	color = '#FF4FA3',
	size = 120,
	at = 0,
	font = 'Bebas',
	style,
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	const flick = t < 0 ? 0 : t < 3 ? 1 : t < 5 ? 0.2 : t < 7 ? 1 : t < 8 ? 0.4 : 1;
	return (
		<div
			style={{
				fontFamily: font,
				fontSize: size,
				color: '#FFF4FA',
				opacity: flick,
				textShadow: `0 0 6px ${color}, 0 0 18px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`,
				letterSpacing: size * 0.05,
				...style,
			}}
		>
			{text}
		</div>
	);
};

/** An index card with a red header line, used on the investigation board. */
export const IndexCard: React.FC<{x: number; y: number; w?: number; rot?: number; head: string; body?: string; at?: number}> = ({
	x,
	y,
	w = 400,
	rot = 0,
	head,
	body,
	at = 0,
}) => {
	const frame = useCurrentFrame();
	const p = useDrop(at);
	if (frame < at) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w,
				padding: '18px 22px',
				background: 'repeating-linear-gradient(#FBF8EF 0 33px,#B9D3E6 33px 34px)',
				backgroundPosition: '0 46px',
				backgroundColor: '#FBF8EF',
				transform: `rotate(${rot}deg) scale(${0.8 + 0.2 * p})`,
				opacity: Math.min(1, p * 1.5),
				boxShadow: '0 14px 26px rgba(0,0,0,.35)',
				fontFamily: 'Elite',
				color: '#222',
			}}
		>
			<div style={{fontSize: 24, color: C.red, borderBottom: '2px solid #E3A0A0', paddingBottom: 6, marginBottom: 6}}>{head}</div>
			{body && <div style={{fontSize: 26, lineHeight: '34px'}}>{body}</div>}
		</div>
	);
};

export const Pin: React.FC<{x: number; y: number}> = ({x, y}) => (
	<div
		style={{
			position: 'absolute',
			left: x - 13,
			top: y - 13,
			width: 26,
			height: 26,
			borderRadius: 13,
			background: 'radial-gradient(circle at 35% 35%, #FF8A80, #D32F2F 45%, #7A0E0E)',
			boxShadow: '3px 5px 4px rgba(0,0,0,.35)',
		}}
	/>
);

/** Rising water with a moving wavy top edge. */
export const Water: React.FC<{level: number; color?: string; opacity?: number}> = ({level, color = '#2C6E8F', opacity = 0.72}) => {
	const frame = useCurrentFrame();
	const pts: string[] = [];
	for (let x = 0; x <= 1920; x += 40) {
		const y = level + Math.sin(x / 90 + frame / 9) * 7 + Math.sin(x / 37 - frame / 6) * 3;
		pts.push(`${x},${y.toFixed(1)}`);
	}
	return (
		<svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
			<polygon points={`0,1080 ${pts.join(' ')} 1920,1080`} fill={color} opacity={opacity} />
			<polyline points={pts.join(' ')} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={3} />
		</svg>
	);
};
