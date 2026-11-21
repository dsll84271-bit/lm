import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {span} from '../../../components/stage';
import {person, YOU, type Look} from '../../../characters/Hero';
import {Car3D} from '../../../three/sky3d';
import {Beach, HotelRow, Lifeguard3D, Lounger3D, Palm3D} from '../../../three/miami3d';
import type {Angle3} from '../../../three/shot3';
import type {Light3} from '../../../three/Stage3D';
import type {V3} from './util';

// Shared looks for Episode 9: the people of the game (who all say the same
// thing), how each moment is lit (sunny Miami, sunset, neon night, the grey
// of a world switching off, the studio, your bedroom), the beach-front set,
// and the game's HUD drawn over the picture.

export const P9: Record<string, Look> = {
	hat: person('#E8C8A0', '#FFD84A', 'cap', '#E8453C'),
	jogger: person('#9FD8FF', '#FF7AA8', 'long', '#2A1E2E'),
	door: person('#F2C8A0', '#3AB87A', 'bun', '#5A3A2A'),
	shop: person('#C8F2A0', '#8A5AE8', 'short', '#2A1E2E', {collar: true}),
	surfer: person('#FFB86A', '#2E8AE8', 'spiky', '#FFD84A'),
	tourist: person('#FFB8D8', '#F4F2FF', 'cap', '#3FBFE8'),
	gran: person('#E8D0B8', '#D7C2F2', 'bun', '#B8B8C8'),
};
export {YOU};
export const CROWD = [P9.hat, P9.jogger, P9.surfer, P9.tourist, P9.gran, P9.door];

const L = (sky: string, ground: string, ambient: number, sun: V3, sunColor: string, intensity: number, rimColor: string, rim: number, fog?: [string, number, number], shadow?: Light3['shadow'], points?: Light3['points']): Light3 => ({
	sky,
	ground,
	ambient,
	sun: {from: sun, color: sunColor, intensity},
	rim: {from: [-sun[0], Math.abs(sun[1]) * 0.4, -sun[2]], color: rimColor, intensity: rim},
	fog: fog ? {color: fog[0], near: fog[1], far: fog[2]} : undefined,
	shadow,
	points,
});

export const light = (at: V3 = [0, 0, 0], kind: 'day' | 'sunset' | 'night' | 'dark' | 'grey' = 'day', size = 30): Light3 => {
	const sh = {size, far: 260, at};
	switch (kind) {
		case 'sunset':
			return L('#FFC8A8', '#5A3A6A', 1.3, [-60, 22, 30], '#FFB070', 2.6, '#FF7AB8', 1.8, ['#FFB8A8', 120, 520], sh);
		case 'night':
			return L('#6A5AC8', '#14103A', 1.05, [30, 50, -30], '#B8C8FF', 1.3, '#FF4FA3', 1.6, ['#2A1E5A', 110, 480], sh, [
				{at: [at[0] - 10, 6, at[2] - 14], color: '#FF4FA3', intensity: 4, distance: 30},
				{at: [at[0] + 14, 6, at[2] - 14], color: '#3FF2E8', intensity: 4, distance: 30},
			]);
		case 'dark':
			return L('#7A7AA8', '#1E1C30', 1.0, [-30, 50, 30], '#C8C8E8', 1.4, '#FF5A5A', 1.4, ['#3A3650', 80, 420], sh);
		case 'grey':
			return L('#C8C8D0', '#6A6A78', 1.3, [-30, 50, 30], '#F2F2F8', 2.0, '#B8B8C8', 1.0, ['#A8A8B4', 60, 360], sh);
		default:
			return L('#CFF2FF', '#5A8A9A', 1.35, [-40, 70, 45], '#FFF6E0', 2.9, '#FFE0B0', 1.4, ['#CFF2FF', 160, 650], sh);
	}
};

export const LIGHT = {
	studio: L('#D8D0FF', '#3A2E80', 1.35, [4, 9, 8], '#FFFFFF', 2.4, '#FF8AD8', 1.8),
	room: L('#FFE6C8', '#6A5A8A', 1.35, [6, 10, 8], '#FFF0D8', 2.5, '#9FD0FF', 1.5),
};

export const BG = {
	day: 'linear-gradient(#3FB8F2 0%, #BFF0FF 62%)',
	sunset: 'linear-gradient(#5A4AB0 0%, #FF7A8A 45%, #FFC890 68%)',
	night: 'linear-gradient(#0E0A2E 0%, #3A1E6A 60%, #6A2A8A 75%)',
	dark: 'linear-gradient(#1E1C30 0%, #4A3A5A 70%)',
	grey: 'linear-gradient(#9A9AA6 0%, #C8C8D0 70%)',
	void: 'linear-gradient(#3FB8F2 0%, #2E6AD0 100%)',
	studio: '#2A1E66',
	room: '#F2E4CC',
};

/** The beach-front: road, pavements, sand, sea, a row of hotels, palms, lifeguard towers, loungers, parked cars. */
export const MiamiSet: React.FC<{frame: number; lit?: number; grey?: number; hotelState?: (i: number, x: number) => number; night?: boolean; palms?: boolean; cars?: boolean; sea?: string}> = ({frame, lit = 0, grey = 0, hotelState, night = false, palms = true, cars = true, sea}) => {
	const palmXs = [-130, -104, -78, -52, -26, 0, 26, 52, 78, 104, 130];
	return (
		<group>
			<Beach frame={frame} len={420} grey={grey} night={night} seaColor={sea} />
			<HotelRow x0={-160} n={18} z={-28} lit={lit} state={hotelState ?? (() => grey)} />
			{palms
				? palmXs.flatMap((x, i) => [
						<Palm3D key={`a${i}`} at={[x, 0, -9.5]} h={9 + (i % 3)} lean={0.1 + (i % 2) * 0.08} yaw={i} seed={i} grey={grey > 0.5} sway={Math.sin(frame * 0.03 + i) * 0.05} />,
						<Palm3D key={`b${i}`} at={[x + 12, 0, 8.5]} h={8 + (i % 2) * 2} lean={0.18} yaw={i * 2.1 + 1} seed={i + 20} grey={grey > 0.5} sway={Math.sin(frame * 0.03 + i * 2) * 0.05} />,
					])
				: null}
			{[-90, -20, 50, 120].map((x, i) => (
				<Lifeguard3D key={i} at={[x, 0, 34]} yaw={Math.PI} color={['#FF7AA8', '#FFD84A', '#3FBFE8', '#A8E6CF'][i]} grey={grey > 0.5} />
			))}
			{[-60, -50, -40, 30, 40, 70, 80].map((x, i) => (
				<Lounger3D key={i} at={[x, 0, 26 + (i % 2) * 3]} yaw={Math.PI} color={['#3FBFE8', '#FF7AA8', '#FFD84A'][i % 3]} />
			))}
			{cars
				? [-120, -70, -35, 45, 90, 140].map((x, i) => <Car3D key={i} at={[x, 0, i % 2 ? -4.6 : 2.6]} yaw={Math.PI / 2} color={['#FF7AA8', '#3FBFE8', '#FFFFFF', '#FFD84A', '#A8E6CF', '#E8453C'][i]} />)
				: null}
		</group>
	);
};

/** A camera framing from a point `from` looking at `to`. */
export const lookFrom = (from: V3, to: V3, fov = 40, extra: Partial<Angle3> = {}): Angle3 => {
	const dx = from[0] - to[0];
	const dy = from[1] - to[1];
	const dz = from[2] - to[2];
	const dist = Math.hypot(dx, dy, dz);
	return {at: to, dist, yaw: (Math.atan2(dx, dz) * 180) / Math.PI, pitch: (Math.asin(dy / dist) * 180) / Math.PI, fov, dyaw: 0, ddist: 0, near: 0.1, far: 1200, ...extra};
};

// ---------------------------------------------------------------- the HUD

/**
 * The game's HUD, in our own style: a heart and health bar top-left, a round
 * mini-map bottom-left with a yellow arrow, an optional mission line and coins.
 */
export const HUD: React.FC<{frame: number; health?: number; map?: boolean; mission?: string; missionAt?: number; coins?: number; clock?: string; fade?: number; glitch?: number}> = ({frame, health = 1, map = true, mission, missionAt = 0, coins, clock, fade = 1, glitch = 0}) => {
	const hp = Math.max(0, Math.min(1, health));
	const col = hp > 0.6 ? '#5AE85A' : hp > 0.3 ? '#FFD84A' : '#FF4A5A';
	const jitter = glitch > 0 ? Math.sin(frame * 3.1) * 8 * glitch : 0;
	const mp = mission ? span(frame, missionAt, missionAt + 10) : 0;
	return (
		<AbsoluteFill style={{opacity: fade, pointerEvents: 'none', transform: `translateX(${jitter}px)`}}>
			<div style={{position: 'absolute', left: 60, top: 165, display: 'flex', alignItems: 'center', gap: 14}}>
				<svg viewBox="0 0 60 54" width={60} height={54}>
					<path d="M30 52 L6 28 A14 14 0 0 1 30 10 A14 14 0 0 1 54 28 Z" fill={col} stroke="#140A28" strokeWidth={5} strokeLinejoin="round" />
				</svg>
				<div style={{width: 300, height: 30, borderRadius: 15, background: 'rgba(20,10,40,0.75)', border: '4px solid #140A28', overflow: 'hidden'}}>
					<div style={{width: `${hp * 100}%`, height: '100%', background: col}} />
				</div>
				{coins !== undefined ? <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 38, color: '#FFD84A', WebkitTextStroke: '2px #140A28', marginLeft: 18}}>● {coins}</div> : null}
			</div>
			{clock ? <div style={{position: 'absolute', right: 70, top: 165, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#FFFFFF', WebkitTextStroke: '2px #140A28'}}>{clock}</div> : null}
			{map ? (
				<div style={{position: 'absolute', left: 60, top: 690, width: 220, height: 220, borderRadius: '50%', overflow: 'hidden', border: '6px solid #140A28', background: '#2EC4D6'}}>
					<svg viewBox="0 0 220 220" width={220} height={220}>
						<rect x={0} y={0} width={220} height={120} fill="#E8DCCC" />
						<rect x={0} y={120} width={220} height={36} fill="#F4DEA6" />
						<rect x={0} y={96} width={220} height={16} fill="#55597A" />
						{[20, 70, 120, 170].map((x) => <rect key={x} x={x} y={30} width={34} height={50} fill="#F7B2C6" stroke="#140A28" strokeWidth={2} />)}
						<rect x={150} y={150} width={10} height={70} fill="#C8C0B0" />
						<path d={`M110 ${102 - 14} L120 ${102 + 10} L110 ${102 + 4} L100 ${102 + 10} Z`} fill="#FFD84A" stroke="#140A28" strokeWidth={3} transform={`rotate(${Math.sin(frame * 0.02) * 20} 110 102)`} />
					</svg>
				</div>
			) : null}
			{mission && mp > 0 ? (
				<div style={{position: 'absolute', right: 70, top: clock ? 225 : 168, textAlign: 'right', opacity: mp, transform: `translateX(${(1 - mp) * 40}px)`}}>
					<div style={{display: 'inline-block', fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#FFD84A', letterSpacing: 2, WebkitTextStroke: '2px #140A28'}}>{mission}</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Big words across the sky (NEW MISSION, MISSION COMPLETE, SAVING…, the countdown). */
export const SkyText: React.FC<{frame: number; at: number; until?: number; top: string; big: string; color?: string; y?: number}> = ({frame, at, until, top, big, color = '#FFD84A', y = 300}) => {
	const p = span(frame, at, at + 12) * (until === undefined ? 1 : 1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: p}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: y - 70, textAlign: 'center', fontFamily: FONT, fontWeight: 700}}>
				<div style={{fontSize: 40, color: '#FFFFFF', letterSpacing: 6, WebkitTextStroke: '2px #140A28'}}>{top}</div>
				<div style={{fontSize: 110, color, letterSpacing: 2, WebkitTextStroke: '4px #140A28', transform: `scale(${0.85 + 0.15 * p})`}}>{big}</div>
			</div>
		</AbsoluteFill>
	);
};

/** A 2D science panel with a title strip. */
export const Panel: React.FC<{frame: number; at: number; until?: number; x?: number; y?: number; w?: number; h?: number; title?: string; children: React.ReactNode}> = ({frame, at, until, x = 1430, y = 540, w = 760, h = 620, title, children}) => {
	const p = span(frame, at, at + 12) * (until === undefined ? 1 : 1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%) scale(${0.88 + 0.12 * p})`, opacity: p, background: 'linear-gradient(160deg, #2A1E66, #140E3A)', border: '5px solid #B88AFF', borderRadius: 26, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', overflow: 'hidden', fontFamily: FONT, color: '#F2EEFF'}}>
				{title ? <div style={{background: '#7A4AE8', color: '#fff', fontWeight: 700, fontSize: 34, padding: '10px 24px', letterSpacing: 1}}>{title}</div> : null}
				<div style={{position: 'relative', width: '100%', height: title ? h - 64 : h}}>{children}</div>
			</div>
		</AbsoluteFill>
	);
};

/** Stuttering: holds the frame number on a coarser step (a flipbook look). */
export const stutter = (frame: number, step: number) => Math.floor(frame / step) * step;
