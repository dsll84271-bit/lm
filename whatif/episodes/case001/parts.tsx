/** Building blocks for Case File 001: film frames, the lottery board, the bias chart, the timeline. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp, lerp} from '../../docs-kit/kit';
import {PaperFinish, slap, Tag, useBoil, useTwos, V} from '../../docs-kit/vox';
import LOT from '../../public/case001/lottery1969.json';

export const L = LOT as [number, number, number][]; // [month, day, draft number]
export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const F = (n: string) => `case001/film/${n}.mp4`;
export const I = (n: string) => `case001/img/${n}.jpg`;
export const sec = (s: number) => Math.round(s * 30);

/** The paper board every collage scene sits on. */
export const Board: React.FC<{children?: React.ReactNode; dark?: boolean}> = ({children, dark}) => (
	<AbsoluteFill style={{background: dark ? '#17161A' : V.board, overflow: 'hidden'}}>
		{children}
		{!dark && <PaperFinish />}
	</AbsoluteFill>
);

/** A projected film print: archive footage in a flickering gate with sprocket holes. */
export const Film: React.FC<{
	src: string;
	from?: number; // seconds into the clip
	w?: number;
	x?: number;
	y?: number;
	rot?: number;
	bw?: boolean;
	push?: [number, number]; // scale start → end across the shot
	d?: number;
	at?: number;
	id?: string;
}> = ({src, from = 0, w = 1240, x = 960, y = 540, rot = 0, bw, push = [1.02, 1.1], d = 300, at = 0, id = 'film'}) => {
	const frame = useCurrentFrame();
	const f2 = useTwos();
	const boil = useBoil(id);
	const s = slap(f2, at);
	if (s === null) return null;
	const h = w * 0.604;
	const z = push[0] + (push[1] - push[0]) * Math.min(1, frame / Math.max(1, d));
	const weave = `translate(${Math.sin(frame * 1.7) * 1.2}px, ${Math.sin(frame * 2.3) * 1.5}px)`;
	const flick = 0.93 + 0.07 * Math.abs(Math.sin(frame * 12.9898) * 0.7 + Math.sin(frame * 3.1) * 0.3);
	return (
		<div style={{position: 'absolute', left: x - w / 2 - 46, top: y - h / 2 - 26, transform: `${boil} rotate(${rot}deg) scale(${s})`}}>
			<div style={{position: 'relative', width: w + 92, height: h + 52, background: '#0E0D0C', borderRadius: 6, boxShadow: '8px 12px 22px rgba(0,0,0,.45)'}}>
				{[0, 1].map((side) => (
					<div
						key={side}
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							[side ? 'right' : 'left']: 12,
							width: 22,
							backgroundImage: 'linear-gradient(#E8E2D2 0 0)',
							backgroundSize: '22px 16px',
							backgroundRepeat: 'repeat-y',
							maskImage: 'repeating-linear-gradient(180deg, #000 0 16px, transparent 16px 34px)',
							WebkitMaskImage: 'repeating-linear-gradient(180deg, #000 0 16px, transparent 16px 34px)',
							opacity: 0.85,
							transform: `translateY(${-(frame * 6) % 34}px)`,
						}}
					/>
				))}
				<div style={{position: 'absolute', left: 46, top: 26, width: w, height: h, overflow: 'hidden', background: '#000'}}>
					<div style={{position: 'absolute', inset: 0, transform: `${weave} scale(${z})`, filter: `${bw ? 'grayscale(1) ' : 'saturate(.8) sepia(.15) '}contrast(1.1) brightness(${flick})`}}>
						<OffthreadVideo src={staticFile(src)} startFrom={sec(from)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</div>
					<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,.55) 100%)'}} />
				</div>
			</div>
		</div>
	);
};

/** A full-screen archive photo with a slow push, kept in black and white. */
export const Pic: React.FC<{src: string; d: number; from?: number; to?: number; pos?: string; ox?: [number, number]; oy?: [number, number]; dark?: number; color?: boolean}> = ({
	src,
	d,
	from = 1.04,
	to = 1.14,
	pos = '50% 50%',
	ox = [0, 0],
	oy = [0, 0],
	dark = 0,
	color,
}) => {
	const frame = useCurrentFrame();
	const t = Math.min(1, frame / Math.max(1, d));
	const e = t * t * (3 - 2 * t);
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<Img
				src={staticFile(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: pos,
					filter: color ? 'contrast(1.05) saturate(.85)' : 'grayscale(1) contrast(1.12)',
					transform: `scale(${from + (to - from) * e}) translate(${ox[0] + (ox[1] - ox[0]) * e}px, ${oy[0] + (oy[1] - oy[0]) * e}px)`,
				}}
			/>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${dark}) 45%, rgba(0,0,0,${0.55 + dark}) 100%)`}} />
		</AbsoluteFill>
	);
};

/** A chapter card: "PART 2", then the chapter name typed in Caslon, underlined in yellow. */
export const Chapter: React.FC<{n: number; title: string; at?: number}> = ({n, title, at = 2}) => {
	const f2 = useTwos();
	const boil = useBoil(`ch${n}`);
	const typed = Math.max(0, Math.floor((f2 - at - 8) * 1.2));
	const u = lerp(f2, at + 8 + title.length / 1.2, at + 20 + title.length / 1.2, 0, 1);
	return (
		<Board>
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', transform: boil}}>
				<Tag id={`chp${n}`} text={`PART ${n}`} x={880} y={-20} at={at} size={30} rot={-2} />
				<div style={{fontFamily: 'Caslon', fontSize: 150, color: V.ink, lineHeight: 1.05, marginTop: 90}}>
					{title.slice(0, typed)}
					<span style={{opacity: 0}}>{title.slice(typed)}</span>
				</div>
				<div style={{width: 900 * u, height: 16, background: V.yellow, margin: '18px auto 0', mixBlendMode: 'multiply', transform: 'rotate(-0.6deg)'}} />
			</div>
		</Board>
	);
};

/**
 * The 1969 lottery board: 12 months across, 31 days down, each cell the draft number.
 * `shown` = how many numbers have been drawn (in draw order), `cut` = highlight numbers ≤ cut.
 */
export const LotteryBoard: React.FC<{shown: number; cut?: number; cutOn?: number; x?: number; y?: number; scale?: number; month?: number}> = ({
	shown,
	cut = 0,
	cutOn = 0,
	x = 0,
	y = 0,
	scale = 1,
	month = -1,
}) => {
	const cw = 128,
		ch = 27.5;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: '0 0', width: cw * 12 + 70, background: '#F6F2E8', padding: '14px 18px 18px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)'}}>
			<div style={{display: 'flex', marginLeft: 40}}>
				{MONTHS.map((m, i) => (
					<div key={m} style={{width: cw, textAlign: 'center', fontFamily: 'Anton', fontSize: 26, color: V.ink, background: i === month ? V.yellow : 'transparent'}}>
						{m}
					</div>
				))}
			</div>
			{Array.from({length: 31}).map((_, d) => (
				<div key={d} style={{display: 'flex', alignItems: 'center', height: ch, borderTop: '1px solid rgba(29,28,32,.12)'}}>
					<div style={{width: 40, fontFamily: 'Elite', fontSize: 17, color: '#6b6660'}}>{d + 1}</div>
					{MONTHS.map((_, m) => {
						const e = L.find((r) => r[0] === m + 1 && r[1] === d + 1);
						if (!e) return <div key={m} style={{width: cw}} />;
						const vis = e[2] <= shown;
						const hot = cut > 0 && e[2] <= cut && cutOn >= 1;
						return (
							<div
								key={m}
								style={{
									width: cw,
									textAlign: 'center',
									fontFamily: 'Elite',
									fontSize: 21,
									color: V.ink,
									opacity: vis ? 1 : 0,
									background: hot ? `rgba(237,189,46,${Math.min(1, cutOn) * 0.85})` : m === month ? 'rgba(237,189,46,.18)' : 'transparent',
								}}
							>
								{e[2]}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

/** Average draft number per birth month, as ink bars growing up from a baseline. */
export const MonthBars: React.FC<{p: number; hiDec?: number; x?: number; y?: number}> = ({p, hiDec = 0, x = 260, y = 230}) => {
	const avg = MONTHS.map((_, m) => {
		const v = L.filter((r) => r[0] === m + 1).map((r) => r[2]);
		return v.reduce((a, b) => a + b, 0) / v.length;
	});
	const H = 560,
		bw = 96,
		gap = 22;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 12 * (bw + gap), height: H + 120}}>
			<div style={{position: 'absolute', left: -10, right: -10, top: H, height: 5, background: V.ink}} />
			{avg.map((a, m) => {
				const g = Math.max(0, Math.min(1, p * 12 - m * 0.6));
				const h = (a / 240) * H * g;
				const dec = m === 11;
				return (
					<div key={m} style={{position: 'absolute', left: m * (bw + gap), top: H - h, width: bw, height: h, background: dec && hiDec > 0 ? V.yellow : V.ink, opacity: 0.92}}>
						<div style={{position: 'absolute', top: -46, width: '100%', textAlign: 'center', fontFamily: 'Anton', fontSize: 32, color: V.ink, opacity: g >= 1 ? 1 : 0}}>{Math.round(a)}</div>
						<div style={{position: 'absolute', top: h + 14, width: '100%', textAlign: 'center', fontFamily: 'Anton', fontSize: 28, color: V.ink}}>{MONTHS[m]}</div>
					</div>
				);
			})}
		</div>
	);
};

/** A dated timeline strip: Nov 3 → Nov 15 → Dec 1, 1969. */
export const Timeline: React.FC<{active: number; p?: number}> = ({active, p = 1}) => {
	const pts: [string, string][] = [
		['NOV 3', 'Nixon: "the great silent majority"'],
		['NOV 15', 'Hundreds of thousands march on Washington'],
		['DEC 1', 'The draft lottery, live on TV'],
	];
	const xs = [300, 960, 1620];
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>
			<div style={{position: 'absolute', left: 240, top: 820, width: 1440 * p, height: 6, background: V.ink}} />
			{pts.map(([d, t], i) => (
				<div key={d} style={{position: 'absolute', left: xs[i] - 170, top: 760, width: 340, textAlign: 'center', opacity: i <= active ? 1 : 0.25}}>
					<div style={{width: 34, height: 34, borderRadius: 17, background: i === active ? V.yellow : V.ink, border: `5px solid ${V.ink}`, margin: '43px auto 0'}} />
					<div style={{fontFamily: 'Anton', fontSize: 56, color: V.ink, marginTop: 14}}>{d}</div>
					<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 28, color: V.ink, marginTop: 4}}>{t}</div>
				</div>
			))}
		</div>
	);
};

/** Quick fade-in helper used for overlays. */
export const fade = (f: number, a: number, len = 8) => lerp(f, a, a + len, 0, 1);
export {clamp};

/** A one-shot paper/ink sound effect at a local frame. */
export const Sfx: React.FC<{n: string; at: number; v?: number}> = ({n, at, v = 0.55}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none">
		<Audio src={staticFile(`vox/sfx/${n}.wav`)} volume={v} />
	</Sequence>
);
