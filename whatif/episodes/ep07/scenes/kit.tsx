import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {span} from '../../../components/stage';
import {person, YOU, type Look} from '../../../characters/Hero';
import {Hero3D, type Hero3DProps as HeroProps} from '../../../three/Hero3D';
import {Ambergris3D, Beaks3D, Gut3D, GutFloor, Slime3D, Sphincter3D} from '../../../three/inside3d';
import {Torch3D, UwCamera3D} from '../../../three/ocean3d';
import {Sea3D} from '../../../three/sky3d';
import type {Light3} from '../../../three/Stage3D';
import {T} from '../../../three/toon';
import {handAt, type V3} from './util';

// Shared looks for Episode 7: who's in it, how each place is lit (above the
// sea, under it, inside the whale, the studio, home), and the pieces that
// come back again and again: you swimming, your torch, the first stomach.

export const P7: Record<string, Look> = {
	friend: person('#7FD8B0', '#2E8AE8', 'spiky', '#2A1E2E'),
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
	diver: person('#E8C8A0', '#2A2638', 'short', '#6A4A2A'),
	kayaker: person('#F2C89A', '#E8453C', 'short', '#2A1E2E'),
	dad: person('#D8C0A0', '#3A6A8A', 'short', '#8A8A8A'),
	sailor: person('#E8D0B8', '#2A3A6A', 'cap', '#2A2A3A'),
};
export {YOU};

const L = (sky: string, ground: string, ambient: number, sun: [number, number, number], sunColor: string, intensity: number, rimColor: string, rim: number, fog?: [string, number, number], points?: Light3['points']): Light3 => ({
	sky,
	ground,
	ambient,
	sun: {from: sun, color: sunColor, intensity},
	rim: {from: [-sun[0], 5, -sun[2]], color: rimColor, intensity: rim},
	fog: fog ? {color: fog[0], near: fog[1], far: fog[2]} : undefined,
	points,
});

export const LIGHT: Record<string, Light3> = {
	sea: L('#CFE8FF', '#3A7AB0', 1.35, [-8, 14, 9], '#FFF4E0', 2.8, '#FFE0A0', 1.4, ['#CFE8FF', 90, 260]),
	under: L('#BFF0FF', '#103A60', 1.3, [4, 20, 6], '#E8FFFF', 2.4, '#7FE0FF', 1.4, ['#1E78B0', 8, 95]),
	deep: L('#7FB0E0', '#0C2A50', 1.3, [4, 20, 6], '#C8E8FF', 2.1, '#5AA0E0', 1.6, ['#0C3A66', 8, 80]),
	dark: L('#5A80B0', '#061428', 1.05, [4, 20, 6], '#A8C8F0', 1.4, '#3A70B0', 1.3, ['#061E3A', 6, 60]),
	studio: L('#D8D0FF', '#3A2E80', 1.35, [4, 9, 8], '#FFFFFF', 2.4, '#FF8AD8', 1.8),
	ocean: L('#BFE8FF', '#2A4A8A', 1.35, [4, 12, 8], '#FFFFFF', 2.4, '#7FE0FF', 1.8, ['#2A5AA0', 40, 160]),
	home: L('#FFE6C8', '#6A6A8A', 1.35, [8, 12, 9], '#FFF0D8', 2.7, '#9FD0FF', 1.5),
	shed: L('#E8D8C0', '#4A3A2A', 1.2, [6, 10, 6], '#FFE8C8', 2.2, '#FFC890', 1.2),
	sunset: L('#FFB8A0', '#4A3A6A', 1.25, [-10, 7, -6], '#FFC080', 2.8, '#FF7AA8', 1.8, ['#FFB89A', 80, 260]),
	patagonia: L('#D8E8F8', '#5A6A8A', 1.3, [-8, 10, 6], '#F4F0E8', 2.4, '#C8D8FF', 1.4, ['#C8D8E8', 60, 220]),
};

/** Inside the whale: dark, red, lit by your torch (a light at `torch`, aimed at `spot`). */
export const gutLight = (torch: V3, spot: V3, on = 1, tint = '#FF8AA0'): Light3 => ({
	sky: '#7A3048',
	ground: '#2A0A18',
	ambient: 0.35 + 0.45 * on,
	sun: {from: [2, 8, 4], color: '#FFB0C0', intensity: 0.15 + 0.35 * on},
	points: [
		{at: torch, color: '#FFF0D0', intensity: 7 * on, distance: 9},
		{at: spot, color: '#FFF4D8', intensity: 6 * on, distance: 6},
		{at: [0, 3.2, -3], color: tint, intensity: 2.5 * on, distance: 10},
	],
});

export const BG = {
	sea: 'linear-gradient(#4A98E8 0%, #BFE4FF 72%)',
	under: 'linear-gradient(#6FD0F4 0%, #1E78B0 45%, #0A2A5A 100%)',
	deep: 'linear-gradient(#2A6AA0 0%, #0C3A66 40%, #041428 100%)',
	dark: 'linear-gradient(#0E2E52 0%, #061E3A 40%, #020A16 100%)',
	gut: '#1A0610',
	studio: '#2A1E66',
	ocean: 'linear-gradient(#1E3A80 0%, #2A5AA0 60%)',
	home: 'linear-gradient(#7FC0F2 0%, #FFE6CC 70%)',
	sunset: 'linear-gradient(#6A4AA0 0%, #FF8A7A 45%, #FFB89A 70%)',
	patagonia: 'linear-gradient(#8AB0E0 0%, #E8F0F8 70%)',
};

/**
 * You swimming: lying along `yaw` (0 = towards +z), `pitch` 90 = flat, more
 * nose-down past that. Fins kick, the mask is down.
 */
export const Swimmer: React.FC<{at: V3; yaw?: number; pitch?: number; roll?: number; frame: number; kick?: number; who?: Look} & Omit<HeroProps, 'position' | 'turn' | 'who'>> = ({at, yaw = 0, pitch = 85, roll = 0, frame, kick = 1, who = YOU, ...rest}) => {
	const k = (rest.height ?? 1.7) / 1.7;
	return (
		<group position={at} rotation={[0, (yaw * Math.PI) / 180, 0]}>
			<group rotation={[0, 0, (roll * Math.PI) / 180]}>
				<group rotation={[(pitch * Math.PI) / 180, 0, 0]}>
					<Hero3D who={who} position={[0, -0.85 * k, 0]} scuba walk={kick > 0 ? frame * 0.035 * kick : undefined} armL={rest.armL ?? [14, 10]} armR={rest.armR ?? [14, 10]} headUp={rest.headUp ?? Math.min(70, Math.max(0, pitch * 0.8))} {...rest} />
				</group>
			</group>
		</group>
	);
};

/** Where your right hand is when you hold the torch out in front (standing at `pos`, facing `turn`). */
export const TORCH_ARM: [number, number] = [22, 40];
export const torchHand = (pos: V3, turn: number, reach = 70) => handAt(pos, turn, TORCH_ARM, reach, 1);

/** Your torch, in your right hand, pointing where you face (plus `aim` yaw and `tip` pitch, radians). */
export const HandTorch: React.FC<{pos: V3; turn: number; reach?: number; aim?: number; tip?: number; on?: number; beam?: number}> = ({pos, turn, reach = 70, aim = 0, tip = 0, on = 1, beam = 4}) => {
	const h = torchHand(pos, turn, reach);
	return <Torch3D at={[h[0], h[1] + 0.02, h[2]]} rot={[tip, turn + aim, 0]} on={on} beam={beam} />;
};

/** Where the torch beam lands, roughly, for the light that follows it. */
export const beamSpot = (pos: V3, turn: number, aim = 0, tip = 0, d = 3): V3 => {
	const h = torchHand(pos, turn);
	const yaw = turn + aim;
	return [h[0] + Math.sin(yaw) * d * Math.cos(tip), h[1] - Math.sin(tip) * d, h[2] + Math.cos(yaw) * d * Math.cos(tip)];
};

/** The first chamber of the stomach: a big round fleshy room with a floor of squid beaks. */
export const Forestomach: React.FC<{frame: number; beat?: number; squeeze?: number; hole?: [number, number]; camera?: V3 | null; amber?: boolean; tilt?: number}> = ({frame, beat = 0, squeeze = 0.05, hole = [0, 1], camera, tilt = 0}) => (
	<group rotation={[tilt, 0, 0]}>
		<Gut3D at={[0, 2.0, 0]} len={14} r={(t) => 1.4 + 2.6 * Math.pow(Math.sin(Math.PI * t), 0.7)} frame={frame} beat={beat} squeeze={squeeze} />
		<GutFloor frame={frame} w={8} d={13} />
		<Beaks3D r={3.1} n={1100} hole={hole} clear={0.75} />
		<Slime3D top={4.6} frame={frame} n={16} area={5} />
		<group position={[0, 2.0, -6.6]}>
			<Sphincter3D at={[0, 0, 0]} r={1.5} open={0.15} />
			<mesh position={[0, 0, -0.4]}>
				<circleGeometry args={[2.4, 32]} />
				<meshBasicMaterial color="#3A0A1C" />
			</mesh>
		</group>
		<group position={[0, 2.0, 6.6]} rotation={[0, Math.PI, 0]}>
			<Sphincter3D at={[0, 0, 0]} r={1.5} open={0.1} />
			<mesh position={[0, 0, -0.4]}>
				<circleGeometry args={[2.4, 32]} />
				<meshBasicMaterial color="#3A0A1C" />
			</mesh>
		</group>
		{camera ? <UwCamera3D at={camera} rot={[0, 0.6, 0.2]} s={1.2} /> : null}
	</group>
);

/** A lump of ambergris held in the crook of your left arm (standing at `pos`, facing `turn`). */
export const HeldAmber: React.FC<{pos: V3; turn: number; s?: number}> = ({pos, turn, s = 0.22}) => {
	const h = handAt(pos, turn, [30, 100], 60, -1);
	return <Ambergris3D at={[h[0], h[1] + 0.12, h[2]]} s={s} />;
};

/** The sea from the boat: water to the horizon and a far island. */
export const SeaSet: React.FC<{frame: number; dusk?: boolean}> = ({frame, dusk = false}) => (
	<group>
		<Sea3D frame={frame} size={600} color={dusk ? '#C86A8A' : '#2E86D0'} dusk={dusk} />
		<T shape={{kind: 'sphere', r: 30, seg: 32}} color={dusk ? '#6A4A7A' : '#4FA86A'} position={[-120, -18, -220]} scale={[2.2, 1, 1]} outline={0.3} />
		<T shape={{kind: 'sphere', r: 20, seg: 32}} color={dusk ? '#5A3A6A' : '#3F985A'} position={[-60, -12, -230]} scale={[1.8, 1, 1]} outline={0.3} />
	</group>
);

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
					background: dark ? 'linear-gradient(160deg, #10284A, #081830)' : 'linear-gradient(160deg, #FFF8E8, #F2E2C0)',
					border: `5px solid ${dark ? '#3FB0E8' : '#3A2A1A'}`,
					borderRadius: 26,
					boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
					overflow: 'hidden',
					fontFamily: FONT,
					color: dark ? '#EAF6FF' : '#2A1E14',
				}}
			>
				{title ? <div style={{background: dark ? '#2E8AC8' : '#3A2A1A', color: '#fff', fontWeight: 700, fontSize: 34, padding: '10px 24px', letterSpacing: 1}}>{title}</div> : null}
				<div style={{position: 'relative', width: '100%', height: title ? h - 64 : h}}>{children}</div>
			</div>
		</AbsoluteFill>
	);
};

/** A dark vignette (the edges of your mask, or the dark of a whale). */
export const Vignette: React.FC<{amount: number; color?: string}> = ({amount, color = '#000000'}) =>
	amount > 0 ? <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent ${Math.round(60 - amount * 45)}%, ${color} ${Math.round(100 - amount * 20)}%)`, opacity: Math.min(1, amount * 1.2), pointerEvents: 'none'}} /> : null;

/** Your air, top right, while you're inside the whale: minutes and seconds left in the tank. */
export const AirHud: React.FC<{frame: number; left: number; at?: number}> = ({frame, left, at = 0}) => {
	const p = span(frame, at, at + 10);
	if (p <= 0) {
		return null;
	}
	const secs = Math.max(0, Math.round(left * 60 - frame / 30));
	const mm = Math.floor(secs / 60);
	const ss = secs % 60;
	return (
		<div style={{position: 'absolute', right: 60, top: 162, opacity: p, display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(14,8,34,0.86)', border: '3px solid rgba(255,255,255,0.18)', borderRadius: 30, padding: '12px 26px', fontFamily: FONT, fontWeight: 700, fontSize: 46, color: '#FFD84A'}}>
			<div style={{width: 24, height: 46, borderRadius: 12, background: '#FFD23A', border: '4px solid #140A28'}} />
			AIR {mm}:{String(ss).padStart(2, '0')}
		</div>
	);
};
