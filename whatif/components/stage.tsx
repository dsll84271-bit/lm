import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile} from 'remotion';

// Timing, the camera, the cut system, and the finish (bloom, vignette, letterbox).

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const span = (frame: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
	interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {...clamp, easing: ease});

export const track = (frame: number, keys: Array<[number, number]>, ease = Easing.inOut(Easing.cubic)) =>
	keys.length === 1
		? keys[0][1]
		: interpolate(
				frame,
				keys.map((k) => k[0]),
				keys.map((k) => k[1]),
				{...clamp, easing: ease},
			);

export const pop = (frame: number, at: number, stiff = 220) =>
	frame < at ? 0 : spring({frame: frame - at, fps: 30, config: {damping: 11, stiffness: stiff, mass: 0.6}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

/** Mouth movement while someone talks between frames a and b. */
export const talking = (frame: number, a: number, b: number) =>
	frame < a || frame > b ? 0 : 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.8)) * Math.min(1, (frame - a) / 3, (b - frame) / 3);

/** A blink every few seconds. */
export const blinking = (frame: number, seed = 0) => {
	const t = (frame + seed * 31) % 97;
	return t > 90 ? 1 - Math.abs(t - 93.5) / 3.5 : 0;
};

// ---------------------------------------------------------------- the cut system

/**
 * Where the cuts fall in a shot: at the start of every sentence, plus extra
 * cuts so no single picture lasts longer than `longest` frames. This gives
 * the 20+ cuts a minute that the top channels use.
 */
export const cutsFor = (lines: Line[], dur: number, longest = 84, shortest = 36): number[] => {
	const marks = new Set<number>([0]);
	for (const l of lines) {
		const parts = l.text.split(/(?<=[.!?])\s+/);
		let pos = 0;
		for (const p of parts) {
			const f = Math.round(l.a + (pos / l.text.length) * (l.b - l.a)) - 3;
			if (f > 0) {
				marks.add(f);
			}
			pos += p.length + 1;
		}
	}
	const sorted = [...marks].filter((m) => m < dur - shortest / 2).sort((x, y) => x - y);
	const out: number[] = [];
	for (let i = 0; i < sorted.length; i++) {
		const a = sorted[i];
		if (out.length && a - out[out.length - 1] < shortest) {
			continue;
		}
		out.push(a);
		const b = i + 1 < sorted.length ? sorted[i + 1] : dur;
		const n = Math.floor((b - a) / longest);
		for (let k = 1; k <= n; k++) {
			const m = Math.round(a + ((b - a) * k) / (n + 1));
			if (m - out[out.length - 1] >= shortest && b - m >= shortest) {
				out.push(m);
			}
		}
	}
	return out;
};

/** Which cut a frame is in, and how far through it. */
export const whichCut = (frame: number, cuts: number[], dur: number) => {
	let i = 0;
	while (i + 1 < cuts.length && frame >= cuts[i + 1]) {
		i++;
	}
	const a = cuts[i];
	const b = i + 1 < cuts.length ? cuts[i + 1] : dur;
	return {i, p: (frame - a) / Math.max(1, b - a), from: a, to: b};
};

/** A framing: the point of the 1920x1080 world at the centre, zoom, Dutch tilt. */
export type Angle = {x: number; y: number; zoom: number; rot?: number; push?: number; pan?: [number, number]};

/** The camera for this frame: cycle through `angles`, one per cut, each with a slow push. */
export const cameraFor = (frame: number, cuts: number[], dur: number, angles: Angle[], order?: number[]) => {
	const {i, p} = whichCut(frame, cuts, dur);
	const a = angles[(order ? order[i % order.length] : i) % angles.length];
	const push = a.push ?? 0.06;
	const e = Easing.inOut(Easing.quad)(p);
	return {
		x: a.x + (a.pan?.[0] ?? 0) * e,
		y: a.y + (a.pan?.[1] ?? 0) * e,
		zoom: a.zoom * (1 + push * e),
		rot: a.rot ?? 0,
		cut: i,
	};
};

// ---------------------------------------------------------------- drawing

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
		{children}
	</svg>
);

export const Cam: React.FC<{x?: number; y?: number; zoom?: number; rot?: number; blur?: number; children: React.ReactNode}> = ({x = 960, y = 540, zoom = 1, rot = 0, blur = 0, children}) => (
	<AbsoluteFill
		style={{
			transform: `translate(960px, 540px) rotate(${rot}deg) scale(${zoom}) translate(${-x}px, ${-y}px)`,
			transformOrigin: '0 0',
			filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
		}}
	>
		{children}
	</AbsoluteFill>
);

/** A layer further back, blurred and moving less (parallax). */
export const Back: React.FC<{cam: {x: number; y: number; zoom: number; rot: number}; depth?: number; blur?: number; children: React.ReactNode}> = ({cam, depth = 0.6, blur = 6, children}) => (
	<Cam x={960 + (cam.x - 960) * depth} y={540 + (cam.y - 540) * depth} zoom={1 + (cam.zoom - 1) * depth} rot={cam.rot * depth} blur={blur * Math.min(2, cam.zoom)}>
		{children}
	</Cam>
);

/** Bloom, vignette, a little grain-free warmth, and the 2.39:1 letterbox bars. */
export const Finish: React.FC<{dark?: number}> = ({dark = 1}) => (
	<>
		<AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(8,4,24,${0.5 * dark}) 100%)`}} />
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 138, background: '#05030C'}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 138, background: '#05030C'}} />
		</AbsoluteFill>
	</>
);

/** The look of stopped or slowed time: cool and desaturated, with a ring at the snap. */
export const TimeLook: React.FC<{frame: number; at: number; until?: number; strength?: number; children: React.ReactNode}> = ({frame, at, until, strength = 1, children}) => {
	const on = span(frame, at, at + 6) * (until === undefined ? 1 : 1 - span(frame, until, until + 6));
	const k = on * strength;
	return (
		<AbsoluteFill style={{filter: k > 0.01 ? `saturate(${1 - 0.55 * k}) hue-rotate(${-12 * k}deg) brightness(${1 - 0.05 * k})` : undefined}}>
			{children}
			{k > 0.01 ? <AbsoluteFill style={{background: `rgba(90,140,255,${0.12 * k})`, mixBlendMode: 'screen'}} /> : null}
		</AbsoluteFill>
	);
};

/** The ripple that spreads out from a finger snap. Centre in screen pixels. */
export const SnapRing: React.FC<{frame: number; at: number; x?: number; y?: number}> = ({frame, at, x = 960, y = 540}) => {
	const t = frame - at;
	if (t < 0 || t > 22) {
		return null;
	}
	const p = t / 22;
	return (
		<Svg>
			<circle cx={x} cy={y} r={40 + p * 1400} fill="none" stroke="#BFE8FF" strokeWidth={30 * (1 - p)} opacity={(1 - p) * 0.9} />
			<circle cx={x} cy={y} r={20 + p * 900} fill="none" stroke="#fff" strokeWidth={10 * (1 - p)} opacity={(1 - p) * 0.8} />
			{t < 4 ? <rect width={1920} height={1080} fill="#fff" opacity={(1 - t / 4) * 0.5} /> : null}
		</Svg>
	);
};

/** Shakes the picture for impacts. */
export const shake = (frame: number, at: number, amount = 16, length = 12) => {
	const t = frame - at;
	if (t < 0 || t > length) {
		return {x: 0, y: 0};
	}
	const k = (1 - t / length) * amount;
	return {x: Math.sin(t * 2.7) * k, y: Math.cos(t * 3.3) * k};
};

// ---------------------------------------------------------------- sound

export type SoundName = 'snap' | 'whoosh' | 'pop' | 'chime' | 'thud' | 'brakes' | 'rain' | 'crowd' | 'sizzle' | 'tick' | 'boom' | 'swish' | 'timestop' | 'timestart' | 'steps' | 'run' | 'coins' | 'heart';

export const Sound: React.FC<{name: SoundName; at: number; volume?: number; loop?: number}> = ({name, at, volume = 0.5, loop}) =>
	at >= 0 ? (
		<Sequence from={Math.round(at)} durationInFrames={loop} layout="none">
			<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} loop={loop !== undefined} />
		</Sequence>
	) : null;
