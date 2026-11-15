import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {span} from '../../../components/stage';
import {person, YOU, type Look} from '../../../characters/Hero';
import {Ground} from '../../../three/giant3d';
import {Hero3D, type Hero3DProps as HeroProps} from '../../../three/Hero3D';
import {CloverField, Grimoire3D, Sword3D} from '../../../three/grimoire3d';
import {Box} from '../../../three/sets3d';
import type {Light3} from '../../../three/Stage3D';
import {T} from '../../../three/toon';
import type {V3} from './util';

// Shared looks for Episode 6: who's in it, how each place is lit, and the
// park, the trees, and where the book and the sword sit on you.

export const P6: Record<string, Look> = {
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
	friend: person('#7FD8B0', '#2E8AE8', 'spiky', '#2A1E2E'),
	kid1: person('#F2B8D8', '#FFD84A', 'long', '#5A2A1A'),
	kid2: person('#B8A8F0', '#3AB87A', 'cap', '#E8453C'),
	kid3: person('#F2C89A', '#FF5A8A', 'short', '#2A1E2E'),
	kid4: person('#8FD0F2', '#8A5AE8', 'bun', '#3A2A1A'),
	kid5: person('#D8D0A0', '#E8453C', 'spiky', '#3A2A1A'),
	kid6: person('#C8B8E8', '#2EA86A', 'short', '#6A4A2A'),
	ref: person('#E8C8A0', '#2A2638', 'short', '#2A1E2E', {collar: true}),
	teacher: person('#F2C8B0', '#3A6A8A', 'bun', '#6A4A3A', {collar: true, glasses: true}),
	librarian: person('#F2D8C8', '#8A5AA0', 'bun', '#D8D8E0', {collar: true, glasses: true}),
	scientist: person('#E8D0B8', '#F2F2F2', 'short', '#8A8A8A', {collar: true, glasses: true}),
};
export {YOU};

const L = (sky: string, ground: string, ambient: number, sun: [number, number, number], sunColor: string, intensity: number, rimColor: string, rim: number, fog?: [string, number, number]): Light3 => ({
	sky,
	ground,
	ambient,
	sun: {from: sun, color: sunColor, intensity},
	rim: {from: [-sun[0], 5, -sun[2]], color: rimColor, intensity: rim},
	fog: fog ? {color: fog[0], near: fog[1], far: fog[2]} : undefined,
});

export const LIGHT: Record<string, Light3> = {
	park: L('#FFE6C0', '#5A7A4A', 1.3, [-8, 9, 8], '#FFD9A0', 2.8, '#FF9AD0', 1.4, ['#FFE2C0', 40, 140]),
	dark: L('#8A70C0', '#2A2040', 1.1, [-6, 9, 8], '#E0C8FF', 2.0, '#B080FF', 2.2, ['#5A4A7A', 30, 120]),
	dawn: L('#FFD6C8', '#5A6A8A', 1.3, [10, 6, 6], '#FFC8A0', 2.6, '#9FD0FF', 1.6, ['#FFD8C8', 40, 150]),
	day: L('#CFE6FF', '#6A8A5A', 1.35, [8, 14, 9], '#FFF6E0', 2.8, '#FFE0A0', 1.4, ['#BFE4FF', 60, 190]),
	home: L('#FFE6C8', '#6A6A8A', 1.35, [8, 12, 9], '#FFF0D8', 2.7, '#9FD0FF', 1.5, ['#FFE6CC', 50, 170]),
	bedroom: L('#E8DCFF', '#5A4A7A', 1.35, [6, 12, 8], '#FFF1D6', 2.6, '#7FE0FF', 1.8),
	night: L('#3A4A90', '#0E1430', 0.95, [6, 10, 8], '#DCE6FF', 1.5, '#FFD9A0', 1.2),
	classroom: L('#FFF0D8', '#8A6A5A', 1.4, [6, 12, 8], '#FFF6E0', 2.4, '#FFE0A0', 1.2),
	studio: L('#D8D0FF', '#3A2E80', 1.35, [4, 9, 8], '#FFFFFF', 2.4, '#FF8AD8', 1.8),
	lab: L('#E8F0FF', '#8A9AB8', 1.4, [4, 10, 8], '#FFFFFF', 2.5, '#9FD0FF', 1.5),
	match: L('#CFE6FF', '#6A8A5A', 1.35, [8, 14, 9], '#FFF6E0', 2.8, '#FFE0A0', 1.3, ['#CFEAFF', 60, 190]),
	storm: L('#7A7AA8', '#2A2A40', 1.15, [-6, 12, 6], '#C8C8E8', 1.6, '#9FA8FF', 1.6, ['#4A4A6A', 30, 140]),
	flash: L('#E8E8FF', '#6A6A9A', 1.7, [-2, 14, 4], '#FFFFFF', 3.4, '#DCD8FF', 2.4, ['#8A8AAA', 40, 160]),
	sunset: L('#FFB8A0', '#4A3A6A', 1.25, [-10, 7, -6], '#FFC080', 2.8, '#FF7AA8', 1.8, ['#FFB89A', 50, 160]),
	sky: L('#9FB0D8', '#3A3A5A', 1.2, [8, 14, 6], '#E8E8FF', 2.2, '#9FA8FF', 1.6, ['#5A5A80', 60, 199]),
};

export const BG = {
	park: 'linear-gradient(#6AA8F0 0%, #FFD6B0 75%)',
	dark: 'linear-gradient(#1E1440 0%, #5A3A7A 70%)',
	dawn: 'linear-gradient(#7A8AD8 0%, #FFC8B0 70%)',
	day: 'linear-gradient(#5AA8F0 0%, #BFE4FF 70%)',
	home: 'linear-gradient(#7FC0F2 0%, #FFE6CC 70%)',
	bedroom: '#2A1E50',
	night: '#0E1440',
	classroom: '#3A2A20',
	studio: '#2A1E66',
	lab: 'linear-gradient(#3A4A8A 0%, #8AA0D8 80%)',
	storm: 'linear-gradient(#141020 0%, #3A2E5A 60%, #4A4A6A 100%)',
	flash: 'linear-gradient(#8A80C8 0%, #DCD8FF 70%)',
	sunset: 'linear-gradient(#6A4AA0 0%, #FF8A7A 45%, #FFB89A 70%)',
	sky: 'linear-gradient(#141030 0%, #3A3A6A 70%)',
};

/** A round cartoon tree. */
export const Tree: React.FC<{at: V3; s?: number; color?: string}> = ({at, s = 1, color = '#3FA84A'}) => (
	<group position={at} scale={s}>
		<T shape={{kind: 'cyl', r: 0.18, r2: 0.12, h: 2.2}} color="#8A5A3A" position={[0, 1.1, 0]} outline={0.02} />
		<T shape={{kind: 'sphere', r: 1.2}} color={color} position={[0, 2.8, 0]} outline={0.03} />
		<T shape={{kind: 'sphere', r: 0.85}} color={color} position={[0.8, 2.3, 0.3]} outline={0.03} />
		<T shape={{kind: 'sphere', r: 0.8}} color={color} position={[-0.7, 2.4, -0.2]} outline={0.03} />
	</group>
);

/** The park: grass, a carpet of clover round (0, 0), trees, a path and a bench. `hole` keeps a spot clear (for the book coming up). */
export const Park: React.FC<{hole?: [number, number, number]; dusk?: boolean; clover?: boolean; cracks?: number}> = ({hole, dusk = false, clover = true, cracks = 0}) => (
	<group>
		<Ground color={dusk ? '#5A9A5A' : '#5CB860'} size={160} />
		<Box size={[2.2, 0.03, 60]} at={[-7, 0.015, 0]} color="#E8D8B0" outline={0} />
		{clover ? <CloverField size={12} n={1300} skip={hole ? [hole] : []} /> : null}
		{[[-12, -10, 1.4], [8, -14, 1.6], [14, -4, 1.2], [-4, -18, 1.8], [18, -16, 1.5], [-16, 2, 1.3], [12, 8, 1.2]].map(([x, z, s], i) => (
			<Tree key={i} at={[x, 0, z]} s={s} color={i % 2 ? '#3FA84A' : '#4FB85A'} />
		))}
		<group position={[-5.4, 0, -3]} rotation={[0, Math.PI / 2, 0]}>
			<Box size={[2.2, 0.1, 0.5]} at={[0, 0.48, 0]} color="#C98A5A" outline={0.01} />
			<Box size={[2.2, 0.5, 0.08]} at={[0, 0.8, -0.22]} color="#C98A5A" outline={0.01} />
			{[-0.9, 0.9].map((x) => (
				<Box key={x} size={[0.1, 0.48, 0.45]} at={[x, 0.24, 0]} color="#2A2350" outline={0.01} />
			))}
		</group>
		{cracks > 0
			? [...Array(7)].map((_, i) => {
					const a = (i / 7) * Math.PI * 2 + 0.3;
					const l = 0.5 + (i % 3) * 0.25;
					return <Box key={i} size={[l * cracks, 0.02, 0.04]} at={[Math.cos(a) * (0.25 + (l * cracks) / 2), 0.02, Math.sin(a) * (0.25 + (l * cracks) / 2)]} color="#2A1A20" outline={0} rot={[0, -a, 0]} />;
				})
			: null}
	</group>
);

/** Where the book floats beside you: over your right shoulder, bobbing. `turn` = which way you face. */
export const bookSpot = (pos: V3, turn: number, frame: number, side = 1): V3 => {
	const ox = 0.62 * side;
	const oz = -0.15;
	return [pos[0] + ox * Math.cos(turn) + oz * Math.sin(turn), pos[1] + 1.55 + Math.sin(frame * 0.08) * 0.06, pos[2] - ox * Math.sin(turn) + oz * Math.cos(turn)];
};

/** The book floating at your shoulder, turned the way you face. */
export const ShoulderBook: React.FC<{pos: V3; turn: number; frame: number; side?: number; open?: number; smoke?: number}> = ({pos, turn, frame, side = 1, open = 0, smoke = 0.6}) => (
	<Grimoire3D at={bookSpot(pos, turn, frame, side)} rot={[0.1, turn + side * 0.3, Math.sin(frame * 0.06) * 0.06]} s={0.75} frame={frame} open={open} smoke={smoke} />
);

/** The sword strapped across your back (blade up over the left shoulder). */
export const BackSword: React.FC<{pos: V3; turn: number; frame?: number; smoke?: number}> = ({pos, turn, frame = 0, smoke = 0}) => (
	<group position={pos} rotation={[0, turn, 0]}>
		<Sword3D at={[0.12, 0.62, -0.28]} rot={[0, 0, 0.5]} s={0.82} frame={frame} smoke={smoke} />
		<Box size={[0.07, 0.75, 0.03]} at={[0, 1.0, 0.2]} color="#6A3A2A" outline={0.006} rot={[0, 0, -0.75]} />
	</group>
);

/** A 2D science panel on the right (or left) with a title strip. */
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
					background: dark ? 'linear-gradient(160deg, #1A1440, #0E0A26)' : 'linear-gradient(160deg, #FFF8E8, #F2E2C0)',
					border: `5px solid ${dark ? '#7F5AF0' : '#3A2A1A'}`,
					borderRadius: 26,
					boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
					overflow: 'hidden',
					fontFamily: FONT,
					color: dark ? '#F2EEFF' : '#2A1E14',
				}}
			>
				{title ? (
					<div style={{background: dark ? '#7F5AF0' : '#3A2A1A', color: '#fff', fontWeight: 700, fontSize: 34, padding: '10px 24px', letterSpacing: 1}}>{title}</div>
				) : null}
				<div style={{position: 'relative', width: '100%', height: title ? h - 64 : h}}>{children}</div>
			</div>
		</AbsoluteFill>
	);
};

/**
 * You on all fours (pitch 90) or sitting on the ground (pitch 0), hinged at the
 * hips. Uses Hero3D's sitting legs, so at pitch 90 the legs point down like knees.
 */
export const Crawl: React.FC<{pos: V3; turn?: number; pitch: number; hip?: number; children?: never} & Omit<HeroProps, 'position' | 'turn' | 'sit'>> = ({pos, turn = 0, pitch, hip, ...rest}) => {
	const h = hip ?? 0.14 + (0.36 * pitch) / 90;
	return (
		<group position={[pos[0], pos[1] + h, pos[2]]} rotation={[0, turn, 0]}>
			<group rotation={[(pitch * Math.PI) / 180, 0, 0]}>
				<Hero3D position={[0, -0.14, 0]} sit {...rest} />
			</group>
		</group>
	);
};

/** A sword held by its grip at `grip`: `turn` = which way it faces, `tilt` 0 = blade straight up, 90 = pointing forward, 180 = down. */
export const HeldSword: React.FC<{grip: V3; turn?: number; tilt?: number; roll?: number; frame?: number; smoke?: number; glow?: number; s?: number}> = ({grip, turn = 0, tilt = 0, roll = 0, frame = 0, smoke = 0, glow = 0, s = 1}) => (
	<group position={grip} rotation={[0, turn, 0]}>
		<group rotation={[(tilt * Math.PI) / 180, 0, (roll * Math.PI) / 180]}>
			<Sword3D at={[0, 0, 0]} frame={frame} smoke={smoke} glow={glow} s={s} />
		</group>
	</group>
);
