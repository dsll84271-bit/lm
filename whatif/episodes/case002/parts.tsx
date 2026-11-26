/** Building blocks for Case File 002 (The Real Scrooge): snow, quote cards, the gravestone, book covers. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Ink, Piece, useBoil, useTwos, V} from '../../docs-kit/vox';

export {Board, Chapter, Film, Pic, Sfx, sec} from '../case001/parts';
export const I = (n: string) => `case002/img/${n}.jpg`;

const rnd = (i: number, k: number) => {
	const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Slow falling snow, drawn on twos. */
export const Snow: React.FC<{n?: number; opacity?: number}> = ({n = 90, opacity = 0.75}) => {
	const f2 = useTwos();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity}}>
			<svg width={1920} height={1080}>
				{Array.from({length: n}).map((_, i) => {
					const sp = 0.6 + rnd(i, 1) * 1.4;
					const y = ((rnd(i, 2) * 1200 + f2 * sp) % 1200) - 60;
					const x = rnd(i, 3) * 1920 + Math.sin(f2 / 40 + i) * 24;
					const r = 1.5 + rnd(i, 4) * 3.5;
					return <circle key={i} cx={x} cy={y} r={r} fill="#F4F1EA" opacity={0.5 + rnd(i, 5) * 0.5} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** A typed quotation on a beige card, with its source underneath. */
export const Quote: React.FC<{
	text: string;
	source: string;
	x: number;
	y: number;
	w?: number;
	at: number;
	id: string;
	size?: number;
	rot?: number;
	cps?: number;
	dark?: boolean;
	end?: number;
}> = ({text, source, x, y, w = 900, at, id, size = 54, rot = -1.5, cps = 1.6, dark, end}) => {
	const f2 = useTwos();
	const n = Math.max(0, Math.floor((f2 - at - 4) * cps));
	return (
		<Piece id={id} x={x} y={y} rot={rot} at={at} end={end}>
			<div style={{width: w, background: dark ? '#1E1D21' : V.beige, padding: '36px 44px 30px', boxShadow: '6px 9px 16px rgba(29,28,32,.35)', color: dark ? '#ECE8DE' : V.ink}}>
				<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: size, lineHeight: 1.18}}>
					“{text.slice(0, n)}
					<span style={{opacity: 0}}>{text.slice(n)}</span>”
				</div>
				<div style={{fontFamily: 'Elite', fontSize: 20, letterSpacing: 2.5, marginTop: 18, opacity: n >= text.length ? 1 : 0}}>— {source.toUpperCase()}</div>
			</div>
		</Piece>
	);
};

/** A book or pamphlet cover, typeset like the 1840s. */
export const Book: React.FC<{title: string; sub?: string; x: number; y: number; at: number; id: string; w?: number; rot?: number}> = ({title, sub, x, y, at, id, w = 560, rot = -3}) => (
	<Piece id={id} x={x} y={y} rot={rot} at={at}>
		<div style={{width: w, background: '#E9DFC6', border: `3px double ${V.ink}`, padding: '40px 36px', textAlign: 'center', boxShadow: '6px 9px 16px rgba(29,28,32,.35)', color: V.ink}}>
			<div style={{height: 3, background: V.ink, margin: '0 40px 22px'}} />
			<div style={{fontFamily: 'Caslon', fontWeight: 700, fontSize: 52, lineHeight: 1.08, textTransform: 'uppercase', letterSpacing: 2}}>{title}</div>
			{sub && <div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 28, marginTop: 16}}>{sub}</div>}
			<div style={{height: 3, background: V.ink, margin: '22px 40px 0'}} />
		</div>
	</Piece>
);

/** An engraved gravestone. At `misread`, "MEAL" is scribbled over and becomes "MEAN". */
export const Gravestone: React.FC<{x: number; y: number; at: number; misread: number; stampAt?: number}> = ({x, y, at, misread}) => {
	const f2 = useTwos();
	const boil = useBoil('grave');
	if (f2 < at) return null;
	const rise = Math.min(1, (f2 - at) / 10);
	const mean = f2 >= misread + 8;
	return (
		<div style={{position: 'absolute', left: x, top: y + (1 - rise) * 80, opacity: rise, transform: boil}}>
			<svg width={620} height={760}>
				<defs>
					<pattern id="stone" patternUnits="userSpaceOnUse" width={10} height={10} patternTransform="rotate(30)">
						<line x1={0} y1={0} x2={0} y2={10} stroke={V.ink} strokeWidth={1} opacity={0.25} />
					</pattern>
				</defs>
				<path d="M 60 760 L 60 220 Q 60 40 310 40 Q 560 40 560 220 L 560 760 Z" fill="#D8D2C4" stroke={V.ink} strokeWidth={6} />
				<path d="M 60 760 L 60 220 Q 60 40 310 40 Q 560 40 560 220 L 560 760 Z" fill="url(#stone)" />
				<text x={310} y={200} textAnchor="middle" fontFamily="Caslon" fontSize={34} fill={V.ink} letterSpacing={4}>HERE LIES</text>
				<text x={310} y={290} textAnchor="middle" fontFamily="Caslon" fontWeight={700} fontSize={50} fill={V.ink}>EBENEZER</text>
				<text x={310} y={350} textAnchor="middle" fontFamily="Caslon" fontSize={34} fill={V.ink} letterSpacing={3}>LENNOX</text>
				<text x={310} y={420} textAnchor="middle" fontFamily="Caslon" fontWeight={700} fontSize={56} fill={V.ink}>SCROGGIE</text>
				<text x={310} y={540} textAnchor="middle" fontFamily="Caslon" fontStyle="italic" fontSize={54} fill={V.ink}>
					{mean ? 'mean man' : 'meal man'}
				</text>
			</svg>
			{f2 >= misread && !mean && <div style={{position: 'absolute', left: 300, top: 490, width: 70, height: 60, background: 'rgba(237,189,46,.85)', mixBlendMode: 'multiply'}} />}
			{mean && <div style={{position: 'absolute', left: 335, top: 498, width: 38, height: 52, border: `5px solid ${V.yellow}`, borderRadius: 24}} />}
		</div>
	);
};

/** A hand-drawn candle that slowly gutters out. */
export const Candle: React.FC<{x: number; y: number; at: number; outAt?: number; id: string}> = ({x, y, at, outAt = 99999, id}) => {
	const frame = useCurrentFrame();
	const lit = frame < outAt;
	const flick = 1 + Math.sin(frame * 0.9) * 0.08 + Math.sin(frame * 2.3) * 0.05;
	return (
		<>
			<Ink id={`${id}b`} d={`M ${x - 30} ${y} L ${x - 30} ${y - 220} L ${x + 30} ${y - 220} L ${x + 30} ${y}`} at={at} dur={10} width={6} len={600} />
			<Ink id={`${id}w`} d={`M ${x} ${y - 220} L ${x} ${y - 250}`} at={at + 8} dur={3} width={4} len={40} />
			{lit && frame >= at + 12 && (
				<div style={{position: 'absolute', left: x - 22, top: y - 330, width: 44, height: 80, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'radial-gradient(ellipse at 50% 70%, #FFF7D6, #EDBD2E 55%, rgba(237,189,46,0))', transform: `scaleY(${flick})`, transformOrigin: '50% 100%'}} />
			)}
			{!lit && <div style={{position: 'absolute', left: x - 14, top: y - 330 - (frame - outAt) * 2, width: 28, height: 60, opacity: Math.max(0, 1 - (frame - outAt) / 40), background: 'radial-gradient(circle, rgba(29,28,32,.35), rgba(29,28,32,0) 70%)'}} />}
		</>
	);
};
