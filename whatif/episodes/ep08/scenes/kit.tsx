import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {span} from '../../../components/stage';
import {person, YOU, type Look} from '../../../characters/Hero';
import {Hero3D, type Hero3DProps} from '../../../three/Hero3D';
import {Town3D} from '../../../three/sky3d';
import type {Angle3} from '../../../three/shot3';
import type {Light3} from '../../../three/Stage3D';
import {Street8} from '../../../three/tall3d';
import {handAt, type V3} from './util';

// Shared looks for Episode 8: who's in it, how each place is lit (the giant's
// world in metres, the street at people height, the studio, evening, the
// storm, the ant-sized world at the end), you at a hundred metres, and the
// home street.

export const GIANT = 100;
export const K = GIANT / 1.7; // how much bigger you are than a normal Hero3D

export const P8: Record<string, Look> = {
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
	friend: person('#7FD8B0', '#2E8AE8', 'spiky', '#2A1E2E'),
	teacher: person('#F2C8A0', '#3AB87A', 'long', '#8A4A2A', {collar: true, glasses: true}),
	brother: person('#FFB86A', '#3AB87A', 'none', '#2A1E2E'),
	driver: person('#D8C0A0', '#2A3A6A', 'cap', '#2A2A3A'),
	scientist: person('#E8D0B8', '#F4F2FF', 'short', '#6A4A2A', {collar: true, glasses: true}),
	jones: person('#E8C8A0', '#8A5AE8', 'none', '#8A8A8A'),
	wadlow: person('#E8D2B0', '#3A3A4A', 'short', '#4A3A2A', {collar: true}),
	kid1: person('#FFB8D8', '#FFD84A', 'long', '#3A2A1A'),
	kid2: person('#9FD8FF', '#E8453C', 'short', '#2A1E2E'),
	kid3: person('#C8F2A0', '#8A5AE8', 'spiky', '#5A3A2A'),
};
export {YOU};
export const KIDS = [P8.kid1, P8.kid2, P8.kid3, P8.friend, P8.brother];

const L = (sky: string, ground: string, ambient: number, sun: V3, sunColor: string, intensity: number, rimColor: string, rim: number, fog?: [string, number, number], shadow?: Light3['shadow']): Light3 => ({
	sky,
	ground,
	ambient,
	sun: {from: sun, color: sunColor, intensity},
	rim: {from: [-sun[0], sun[1] * 0.3, -sun[2]], color: rimColor, intensity: rim},
	fog: fog ? {color: fog[0], near: fog[1], far: fog[2]} : undefined,
	shadow,
});

/** The giant's world: shadows over a 320 m box round `at`. */
export const bigLight = (at: V3 = [0, 0, 0], kind: 'day' | 'noon' | 'evening' | 'storm' | 'night' = 'day', size = 160): Light3 => {
	const sh = {size, far: 900, at};
	switch (kind) {
		case 'noon':
			return L('#D8ECFF', '#5A7A6A', 1.35, [-90, 300, 120], '#FFF8E8', 2.9, '#FFE0B0', 1.3, ['#D8ECFF', 340, 1400], sh);
		case 'evening':
			return L('#FFC8A8', '#4A3A6A', 1.25, [-260, 120, -160], '#FFC080', 2.6, '#FF8AB8', 1.6, ['#F4B0A0', 400, 2000], sh);
		case 'storm':
			return L('#7A88A8', '#1E2436', 1.05, [-120, 260, 140], '#C8D4F0', 1.4, '#7FA8FF', 1.4, ['#4A5470', 120, 900], sh);
		case 'night':
			return L('#5A6AB0', '#10142C', 1.0, [160, 240, -120], '#C8D8FF', 1.5, '#FFD9A0', 1.1, ['#1E2650', 400, 1800], sh);
		default:
			return L('#CFE6FF', '#5A7A6A', 1.3, [-140, 240, 170], '#FFF2DC', 2.8, '#FFD0A0', 1.3, ['#CFE6FF', 320, 1300], sh);
	}
};

/** People height (a street, a classroom): shadows over a 60 m box round `at`. */
export const smallLight = (at: V3 = [0, 0, 0], kind: 'day' | 'evening' | 'storm' | 'night' | 'room' = 'day', size = 30): Light3 => {
	const sh = {size, far: 220, at};
	switch (kind) {
		case 'evening':
			return L('#FFC8A8', '#4A3A6A', 1.25, [-60, 30, -40], '#FFC080', 2.5, '#FF8AB8', 1.6, ['#F4B0A0', 120, 700], sh);
		case 'storm':
			return L('#7A88A8', '#1E2436', 1.1, [-30, 60, 40], '#C8D4F0', 1.5, '#7FA8FF', 1.5, ['#4A5470', 30, 260], sh);
		case 'night':
			return L('#5A6AB0', '#10142C', 1.0, [40, 60, -30], '#C8D8FF', 1.4, '#FFD9A0', 1.2, ['#1E2650', 120, 600], sh);
		case 'room':
			return L('#FFF0D8', '#8A7A6A', 1.4, [6, 14, 9], '#FFF4E0', 2.4, '#7FE0FF', 1.5, undefined, {size: 14, far: 60, at});
		default:
			return L('#CFE6FF', '#5A7A6A', 1.3, [-30, 60, 40], '#FFF2DC', 2.8, '#FFD0A0', 1.3, ['#CFE6FF', 160, 900], sh);
	}
};

export const LIGHT = {
	studio: L('#D8D0FF', '#3A2E80', 1.35, [4, 9, 8], '#FFFFFF', 2.4, '#FF8AD8', 1.8),
	studioBig: L('#D8D0FF', '#3A2E80', 1.35, [80, 180, 160], '#FFFFFF', 2.4, '#FF8AD8', 1.8, undefined, {size: 140, far: 700, at: [0, 0, 0]}),
	sepia: L('#F2E2C0', '#5A4A3A', 1.35, [4, 9, 8], '#FFF4E0', 2.2, '#FFC890', 1.2),
	garden: L('#CFEFFF', '#4A7A3A', 1.3, [-8, 14, 9], '#FFF6E0', 2.9, '#FFE0A0', 1.4, ['#BFE4F2', 30, 130]),
	gardenNight: L('#5A6AB0', '#14203A', 1.05, [8, 12, -9], '#C8D8FF', 1.5, '#7CF27A', 1.0, ['#1A2448', 25, 110]),
};

export const BG = {
	day: 'linear-gradient(#5AA8F0 0%, #CFEFFF 70%)',
	noon: 'linear-gradient(#4A9AF0 0%, #D8F0FF 70%)',
	evening: 'linear-gradient(#6A5AB0 0%, #FF9A8A 55%, #FFC8A8 75%)',
	storm: 'linear-gradient(#2A3048 0%, #5A6480 60%)',
	night: 'linear-gradient(#0A0E2A 0%, #1E2650 70%)',
	studio: '#2A1E66',
	sepia: '#3A2A1A',
	room: '#F2E4CC',
	garden: '#BFE4F2',
	gardenNight: '#141C38',
};

/** You, a hundred metres tall. Takes every Hero3D prop. */
export const Giant: React.FC<{at: V3; turn?: number} & Omit<Hero3DProps, 'position' | 'turn' | 'height'>> = ({at, turn = 0, ...rest}) => <Hero3D who={YOU} position={at} turn={turn} height={GIANT} {...rest} />;

/** You lying on your back, head towards -z, feet towards +z (or turned by `yaw`). */
export const LyingGiant: React.FC<{at: V3; yaw?: number; roll?: number} & Omit<Hero3DProps, 'position' | 'turn' | 'height'>> = ({at, yaw = 0, roll = 0, ...rest}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<group rotation={[-Math.PI / 2, 0, roll]} position={[0, 0.3 * K * 0.55, 0]}>
			<Hero3D who={YOU} position={[0, -0.85 * K, 0]} height={GIANT} {...rest} />
		</group>
	</group>
);

/** The home street: a long road of houses, and the whole town round it. */
export const HomeSet: React.FC<{skip?: number[]; lit?: boolean; townClear?: number; seed?: number}> = ({skip = [], lit = false, townClear = 120, seed = 2}) => (
	<group>
		<Town3D size={760} seed={seed} clear={[{at: [0, 0], r: townClear}]} night={lit} lit={lit} />
		<Street8 len={200} skip={skip} lit={lit} />
	</group>
);

/** Houses on the home street that fall inside a box (so you can sit or stand there). */
export const housesIn = (x0: number, x1: number, sides: Array<-1 | 1> = [-1, 1], len = 200) => {
	const out: number[] = [];
	const n = Math.floor(len / 9);
	for (const side of sides) {
		for (let i = 0; i < n; i++) {
			const x = -len / 2 + 4.5 + i * 9;
			if (x > x0 && x < x1) {
				out.push((side + 1) * 50 + i);
			}
		}
	}
	return out;
};

/** A 2D science panel with a title strip. */
export const Panel: React.FC<{frame: number; at: number; until?: number; x?: number; y?: number; w?: number; h?: number; title?: string; children: React.ReactNode; dark?: boolean}> = ({frame, at, until, x = 1430, y = 540, w = 760, h = 620, title, children, dark = true}) => {
	const p = span(frame, at, at + 12) * (until === undefined ? 1 : 1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: w,
					height: h,
					transform: `translate(-50%, -50%) scale(${0.88 + 0.12 * p})`,
					opacity: p,
					background: dark ? 'linear-gradient(160deg, #2A1E66, #140E3A)' : 'linear-gradient(160deg, #FFF8E8, #F2E2C0)',
					border: `5px solid ${dark ? '#B88AFF' : '#3A2A1A'}`,
					borderRadius: 26,
					boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
					overflow: 'hidden',
					fontFamily: FONT,
					color: dark ? '#F2EEFF' : '#2A1E14',
				}}
			>
				{title ? <div style={{background: dark ? '#7A4AE8' : '#3A2A1A', color: '#fff', fontWeight: 700, fontSize: 34, padding: '10px 24px', letterSpacing: 1}}>{title}</div> : null}
				<div style={{position: 'relative', width: '100%', height: title ? h - 64 : h}}>{children}</div>
			</div>
		</AbsoluteFill>
	);
};

export const Vignette: React.FC<{amount: number; color?: string}> = ({amount, color = '#000000'}) =>
	amount > 0 ? <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent ${Math.round(60 - amount * 45)}%, ${color} ${Math.round(100 - amount * 20)}%)`, opacity: Math.min(1, amount * 1.2), pointerEvents: 'none'}} /> : null;

/** Falling rain streaks over the whole picture. */
export const RainOver: React.FC<{frame: number; amount?: number; slant?: number}> = ({frame, amount = 1, slant = 0.25}) => {
	const drops = [];
	for (let i = 0; i < Math.round(120 * amount); i++) {
		const x = ((i * 137.5) % 1920) + ((frame * 22 * slant + i * 31) % 120);
		const y = ((frame * 38 + i * 97) % 1260) - 120;
		drops.push(<line key={i} x1={x} y1={y} x2={x - 30 * slant} y2={y + 60} stroke="#CFE0FF" strokeWidth={3} strokeLinecap="round" opacity={0.55} />);
	}
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				{drops}
			</svg>
		</AbsoluteFill>
	);
};

/** A quick white flash (lightning). */
export const Flash: React.FC<{frame: number; at: number[]}> = ({frame, at}) => {
	const k = Math.max(0, ...at.map((a) => (frame >= a && frame < a + 8 ? 1 - (frame - a) / 8 : 0)));
	return k > 0 ? <AbsoluteFill style={{background: '#E8F0FF', opacity: k * 0.55, pointerEvents: 'none'}} /> : null;
};

/** A camera framing from a point `from` looking at `to` (so shots can be placed exactly). */
export const lookFrom = (from: V3, to: V3, fov = 40, extra: Partial<Angle3> = {}): Angle3 => {
	const dx = from[0] - to[0];
	const dy = from[1] - to[1];
	const dz = from[2] - to[2];
	const dist = Math.hypot(dx, dy, dz);
	return {at: to, dist, yaw: (Math.atan2(dx, dz) * 180) / Math.PI, pitch: (Math.asin(dy / dist) * 180) / Math.PI, fov, dyaw: 0, ddist: 0, near: 0.3, far: 5000, ...extra};
};

/**
 * Where your hand is when you lean forward `lean` degrees (Hero3D's lean tips
 * the upper body forward round the hips). Same arms as handAt; sitting by default.
 */
export const leanHand = (pos: V3, turn: number, arm: [number, number], reach: number, side: 1 | -1, lean: number, sit = true): V3 => {
	const l = handAt([0, 0, 0], 0, arm, reach, side, sit, 1.7);
	const pivot = sit ? -0.36 : 0;
	const t = (lean * Math.PI) / 180;
	const ry = l[1] - pivot;
	const y2 = ry * Math.cos(t) - l[2] * Math.sin(t);
	const z2 = ry * Math.sin(t) + l[2] * Math.cos(t);
	const x = l[0];
	return [pos[0] + K * (x * Math.cos(turn) + z2 * Math.sin(turn)), pos[1] + K * (y2 + pivot), pos[2] + K * (-x * Math.sin(turn) + z2 * Math.cos(turn))];
};

/** The middle of your head when leaning forward `lean` degrees. */
export const leanHead = (pos: V3, turn: number, lean: number, sit = true): V3 => {
	const pivot = sit ? -0.36 : 0;
	const t = (lean * Math.PI) / 180;
	const ry = 1.36 + (sit ? 0 : 0);
	const y2 = ry * Math.cos(t);
	const z2 = ry * Math.sin(t);
	return [pos[0] + K * z2 * Math.sin(turn), pos[1] + K * (y2 + pivot), pos[2] + K * z2 * Math.cos(turn)];
};
