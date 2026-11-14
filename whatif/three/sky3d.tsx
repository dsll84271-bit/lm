import React from 'react';
import * as THREE from 'three';
import {Hero3D, type Hero3DProps} from './Hero3D';
import {Many, rnd, type Copy} from './many';
import {Glow, T} from './toon';

// Episode 5's world: the hero flying, birds, clouds, a town seen from the
// sky, fields, sea, cliffs, mountains, rising warm air, and a pedal plane.
// Units are roughly metres (the hero is 1.7 tall).

type V3 = [number, number, number];
const deg = (d: number) => (d * Math.PI) / 180;

// ---------------------------------------------------------------- the hero, flying

/**
 * The hero in the air. `at` is the middle of the body. pitch 90 = lying flat,
 * head first (superhero), 0 = upright, -90 = on their back. yaw turns the way
 * they fly (0 = towards +z). bank rolls into a turn.
 */
export const Flyer: React.FC<{at: V3; yaw?: number; pitch?: number; bank?: number; frame: number; pose?: 'super' | 'glide' | 'float' | 'flap' | 'tired'; flap?: number} & Omit<Hero3DProps, 'position' | 'turn'>> = ({
	at,
	yaw = 0,
	pitch = 80,
	bank = 0,
	frame,
	pose = 'super',
	flap = 0.25,
	...hero
}) => {
	const k = (hero.height ?? 1.7) / 1.7;
	const f = Math.sin(frame * flap);
	const arms: Record<string, {l: [number, number]; r: [number, number]}> = {
		super: {l: [150, 165], r: [150, 165]},
		glide: {l: [92, 96], r: [92, 96]},
		float: {l: [40 + f * 6, 30], r: [40 - f * 6, 30]},
		flap: {l: [60 + f * 50, 70 + f * 50], r: [60 + f * 50, 70 + f * 50]},
		tired: {l: [70 + f * 20, 80 + f * 20], r: [70 + f * 20, 80 + f * 20]},
	};
	const a = arms[pose];
	const bob = Math.sin(frame * 0.08) * 0.05;
	return (
		<group position={[at[0], at[1] + bob, at[2]]} rotation={[0, deg(yaw), 0]}>
			<group rotation={[0, 0, deg(bank)]}>
				<group rotation={[deg(pitch), 0, 0]}>
					<Hero3D position={[0, -0.85 * k, 0]} armL={hero.armL ?? a.l} armR={hero.armR ?? a.r} headUp={hero.headUp ?? Math.min(80, Math.max(0, pitch * 0.95))} {...hero} />
				</group>
			</group>
		</group>
	);
};

/** Wind streaks rushing past something flying towards +z (in its own frame). */
export const Streaks: React.FC<{at: V3; yaw?: number; frame: number; n?: number; spread?: number; len?: number; speed?: number; color?: string; opacity?: number}> = ({at, yaw = 0, frame, n = 14, spread = 1.6, len = 3, speed = 0.6, color = '#FFFFFF', opacity = 0.7}) => (
	<group position={at} rotation={[0, deg(yaw), 0]}>
		{[...Array(n)].map((_, i) => {
			const a = rnd(i * 3.1) * Math.PI * 2;
			const r = spread * (0.5 + rnd(i * 5.7) * 0.6);
			const z = 4 - (((frame * speed + rnd(i * 1.3) * 12) % 12));
			const fade = Math.sin(((4 - z) / 12) * Math.PI);
			return <Glow key={i} shape={{kind: 'cyl', r: 0.018, h: len, seg: 5}} color={color} position={[Math.cos(a) * r, Math.sin(a) * r, z]} rotation={[Math.PI / 2, 0, 0]} opacity={opacity * fade} />;
		})}
	</group>
);

// ---------------------------------------------------------------- birds

export type BirdKind = 'pigeon' | 'falcon' | 'goose' | 'godwit' | 'frigate' | 'condor' | 'argentavis' | 'swift' | 'ibis';

type BirdLook = {
	body: string;
	belly: string;
	head: string;
	beak: string;
	legs: string;
	wing: string;
	tip: string;
	tail: string;
	len: number; // body length
	span: number; // wingspan
	beakLen: number;
	neck: number;
	chord: number;
	fingers?: boolean;
	fork?: boolean;
	pointed?: boolean;
};

const BIRDS: Record<BirdKind, BirdLook> = {
	pigeon: {body: '#8E93B8', belly: '#A9AECF', head: '#6E7398', beak: '#3A3550', legs: '#E8606A', wing: '#9AA0C4', tip: '#3E3A5A', tail: '#6E7398', len: 0.32, span: 0.66, beakLen: 0.035, neck: 0.04, chord: 0.15},
	falcon: {body: '#4E5A84', belly: '#F2E6CC', head: '#2A2E4A', beak: '#F2C24A', legs: '#F2C24A', wing: '#56638E', tip: '#2A2E4A', tail: '#4E5A84', len: 0.42, span: 1.05, beakLen: 0.04, neck: 0.03, chord: 0.2, pointed: true},
	goose: {body: '#C9CCD8', belly: '#EEF0F6', head: '#FFFFFF', beak: '#FF9A2E', legs: '#FF9A2E', wing: '#B8BCCB', tip: '#5A5E70', tail: '#9A9EB0', len: 0.75, span: 1.55, beakLen: 0.07, neck: 0.32, chord: 0.3},
	godwit: {body: '#C98A5A', belly: '#E8B888', head: '#B87A4A', beak: '#E890A0', legs: '#3A3040', wing: '#A8784E', tip: '#4A3A30', tail: '#F2EEE8', len: 0.38, span: 0.75, beakLen: 0.11, neck: 0.06, chord: 0.15, pointed: true},
	frigate: {body: '#2A2638', belly: '#3A3650', head: '#2A2638', beak: '#8A8AA0', legs: '#2A2638', wing: '#2A2638', tip: '#15121E', tail: '#2A2638', len: 0.9, span: 2.3, beakLen: 0.14, neck: 0.06, chord: 0.28, fork: true, pointed: true},
	condor: {body: '#1E1C28', belly: '#2A2836', head: '#D8826A', beak: '#E8DCC8', legs: '#8A8A9A', wing: '#24222E', tip: '#141220', tail: '#1E1C28', len: 1.1, span: 3.1, beakLen: 0.09, neck: 0.12, chord: 0.62, fingers: true},
	swift: {body: '#3A3040', belly: '#4A4050', head: '#3A3040', beak: '#1A1420', legs: '#1A1420', wing: '#2E2636', tip: '#1E1826', tail: '#2E2636', len: 0.17, span: 0.44, beakLen: 0.012, neck: 0.01, chord: 0.07, fork: true, pointed: true},
	ibis: {body: '#2A2E3A', belly: '#3A3E50', head: '#D84A4A', beak: '#C83A3A', legs: '#C83A3A', wing: '#2E3A4A', tip: '#1E2A3A', tail: '#2A2E3A', len: 0.6, span: 1.3, beakLen: 0.16, neck: 0.14, chord: 0.25},
	argentavis: {body: '#5A4030', belly: '#7A5A44', head: '#C8B8A0', beak: '#E8D8B0', legs: '#8A7A6A', wing: '#4E3828', tip: '#2E2018', tail: '#4E3828', len: 1.6, span: 7, beakLen: 0.22, neck: 0.22, chord: 1.15, fingers: true},
};

/**
 * A cel-shaded bird facing +z, its body centre at `at`. wing: 'flap' beats the
 * wings, 'glide' holds them out, 'fold' tucks them along the body (perched),
 * 'dive' sweeps them back. pitch tips the nose up (+) or down (-).
 */
export const Bird3D: React.FC<{
	kind: BirdKind;
	at: V3;
	frame: number;
	yaw?: number;
	pitch?: number;
	bank?: number;
	wing?: 'flap' | 'glide' | 'fold' | 'dive';
	rate?: number;
	phase?: number;
	s?: number;
	perch?: boolean;
	sleepy?: boolean;
	tracker?: boolean;
	chest?: number;
	look?: number;
}> = ({kind, at, frame, yaw = 0, pitch = 0, bank = 0, wing = 'flap', rate, phase = 0, s = 1, perch = false, sleepy = false, tracker = false, chest = 0, look = 0}) => {
	const b = BIRDS[kind];
	const L = b.len;
	const big = L > 0.6;
	const beat = wing === 'flap' ? Math.sin(frame * (rate ?? (big ? 0.28 : 0.6)) + phase) : 0;
	const fold = wing === 'fold' ? 1 : wing === 'dive' ? 0.72 : 0;
	const lift = wing === 'flap' ? beat * 0.55 : wing === 'glide' ? 0.08 + Math.sin(frame * 0.05 + phase) * 0.04 : wing === 'dive' ? 0.15 : 0.1;
	const half = b.span / 2;
	const inner = half * 0.48;
	const outer = half * 0.52;
	const thick = Math.max(0.015, L * 0.035);
	const ol = Math.max(0.006, L * 0.02);
	const headAt: V3 = perch ? [0, L * 0.32 + b.neck * 0.8, L * 0.32 + b.neck * 0.25] : [0, L * 0.1 + b.neck * 0.15, L * 0.5 + b.neck * 0.85];
	const hr = L * (kind === 'condor' || kind === 'argentavis' ? 0.12 : 0.15);
	return (
		<group position={at} rotation={[0, deg(yaw), 0]} scale={[s, s, s]}>
			<group rotation={[0, 0, deg(bank)]}>
				<group rotation={[-deg(pitch + (perch ? 18 : 0)), 0, 0]}>
					{/* body */}
					<T shape={{kind: 'sphere', r: L * 0.3, seg: 28}} color={b.body} scale={[0.85, 0.78, 1.55]} outline={ol} />
					<T shape={{kind: 'sphere', r: L * 0.27, seg: 24}} color={b.belly} position={[0, -L * 0.07, L * 0.08]} scale={[0.82, 0.72, 1.4]} outline={0} />
					{chest > 0 ? <Glow shape={{kind: 'sphere', r: L * 0.24, seg: 20}} color="#FF4A5A" position={[0, -L * 0.04, L * 0.2]} opacity={0.7 * chest} /> : null}
					{/* neck and head */}
					<T shape={{kind: 'capsule', r: L * 0.09, len: b.neck + L * 0.12}} color={kind === 'goose' ? '#5A5E70' : kind === 'condor' ? '#C87A66' : b.body} position={[0, (headAt[1] + L * 0.05) / 2, (headAt[2] + L * 0.25) / 2]} rotation={[Math.atan2(headAt[2] - L * 0.25, headAt[1] - L * 0.05), 0, 0]} outline={ol} />
					{kind === 'condor' ? <T shape={{kind: 'torus', r: L * 0.11, tube: L * 0.05}} color="#F4F2F8" position={[0, L * 0.12, L * 0.42]} rotation={[Math.PI / 2 - 0.4, 0, 0]} outline={ol} /> : null}
					<group position={headAt} rotation={[perch ? 0.15 : -0.1, look, 0]}>
						<T shape={{kind: 'sphere', r: hr, seg: 24}} color={b.head} outline={ol} />
						{kind === 'goose'
							? [0.25, -0.05].map((y) => <T key={y} shape={{kind: 'torus', r: hr * 0.98, tube: hr * 0.09}} color="#2A2638" position={[0, hr * y, -hr * 0.15]} rotation={[0.2, Math.PI / 2, 0]} outline={0} />)
							: null}
						{kind === 'frigate' ? <T shape={{kind: 'sphere', r: hr * 1.1}} color="#E8303A" position={[0, -hr * 1.3, hr * 0.5]} scale={[0.8, 1, 1]} outline={ol} /> : null}
						{kind === 'falcon' ? [-1, 1].map((x) => <T key={x} shape={{kind: 'capsule', r: hr * 0.12, len: hr * 0.6}} color="#1A1A2A" position={[x * hr * 0.75, -hr * 0.45, hr * 0.35]} rotation={[0.2, 0, 0]} outline={0} />) : null}
						{/* beak */}
						<T shape={{kind: 'cone', r: Math.max(hr * 0.32, 0.012), h: b.beakLen}} color={b.beak} position={[0, -hr * 0.12, hr * 0.85 + b.beakLen / 2]} rotation={[Math.PI / 2 + (kind === 'condor' || kind === 'argentavis' || kind === 'falcon' ? 0.35 : 0.08), 0, 0]} outline={ol * 0.7} />
						{kind === 'frigate' || kind === 'argentavis' || kind === 'condor' ? <T shape={{kind: 'sphere', r: Math.max(hr * 0.2, 0.012)}} color={b.beak} position={[0, -hr * 0.42, hr * 0.85 + b.beakLen * 0.95]} outline={ol * 0.5} /> : null}
						{/* eyes */}
						{[-1, 1].map((x) => (
							<group key={x} position={[x * hr * 0.68, hr * 0.25, hr * 0.62]}>
								{sleepy && x === -1 ? (
									<T shape={{kind: 'capsule', r: hr * 0.05, len: hr * 0.22}} color="#15121E" rotation={[0, 0, Math.PI / 2]} outline={0} />
								) : (
									<>
										<T shape={{kind: 'sphere', r: hr * 0.24, seg: 16}} color={kind === 'pigeon' ? '#FF8A3D' : kind === 'falcon' ? '#F2C24A' : '#FFFFFF'} outline={0} />
										<T shape={{kind: 'sphere', r: hr * 0.15, seg: 12}} color="#15121E" position={[x * hr * 0.06, 0, hr * 0.1]} outline={0} />
										<Glow shape={{kind: 'sphere', r: hr * 0.05, seg: 8}} color="#FFFFFF" position={[x * hr * 0.03, hr * 0.07, hr * 0.2]} />
									</>
								)}
							</group>
						))}
					</group>
					{/* tail */}
					{b.fork ? (
						[-1, 1].map((x) => <T key={x} shape={{kind: 'box', w: L * 0.08, h: thick, d: L * 0.75}} color={b.tail} position={[x * L * 0.1, 0, -L * 0.75]} rotation={[0, x * 0.25, 0]} outline={ol} />)
					) : (
						<T shape={{kind: 'box', w: L * (kind === 'condor' || kind === 'argentavis' ? 0.42 : 0.32), h: thick, d: L * 0.45}} color={b.tail} position={[0, perch ? -L * 0.05 : 0.02 * L, -L * 0.6]} rotation={[perch ? -0.4 : 0, 0, 0]} outline={ol} />
					)}
					{/* wings */}
					{[-1, 1].map((side) => (
						<group key={side} position={[side * L * 0.2, L * 0.1, L * 0.08]} rotation={[0, side * deg(90) * fold, side * lift]} scale={[1 - 0.5 * fold, 1, 1]}>
							<T shape={{kind: 'box', w: inner, h: thick, d: b.chord}} color={b.wing} position={[side * inner * 0.5, 0, 0]} outline={ol} />
							{kind === 'condor' ? <T shape={{kind: 'box', w: inner * 0.9, h: thick * 1.1, d: b.chord * 0.38}} color="#F4F2F8" position={[side * inner * 0.5, 0.002, -b.chord * 0.3]} outline={0} /> : null}
							<group position={[side * inner, 0, 0]} rotation={[0, wing === 'glide' || wing === 'dive' ? side * 0.12 : 0, side * lift * 0.6]}>
								<T shape={{kind: 'box', w: outer * (b.fingers ? 0.7 : 1), h: thick * 0.9, d: b.chord * (b.pointed ? 0.62 : 0.8)}} color={b.tip} position={[side * outer * (b.fingers ? 0.35 : 0.5), 0, b.pointed ? -b.chord * 0.12 : 0]} rotation={[0, b.pointed ? side * 0.22 : 0, 0]} outline={ol} />
								{b.fingers
									? [...Array(5)].map((_, i) => (
											<T key={i} shape={{kind: 'box', w: outer * 0.42, h: thick * 0.6, d: b.chord * 0.12}} color={b.tip} position={[side * outer * 0.88, 0, b.chord * (0.3 - i * 0.15)]} rotation={[0, side * (0.35 - i * 0.18), 0]} outline={ol * 0.6} />
										))
									: null}
							</group>
						</group>
					))}
					{/* legs */}
					{perch
						? [-1, 1].map((x) => (
								<group key={x} position={[x * L * 0.1, -L * 0.2, L * 0.02]} rotation={[deg(pitch + 18), 0, 0]}>
									<T shape={{kind: 'capsule', r: L * 0.025, len: L * 0.28}} color={b.legs} position={[0, -L * 0.18, 0]} outline={ol * 0.5} />
									<T shape={{kind: 'box', w: L * 0.12, h: L * 0.03, d: L * 0.16}} color={b.legs} position={[0, -L * 0.36, L * 0.04]} outline={ol * 0.5} />
								</group>
							))
						: [-1, 1].map((x) => <T key={x} shape={{kind: 'capsule', r: L * 0.022, len: L * 0.18}} color={b.legs} position={[x * L * 0.07, -L * 0.15, -L * 0.42]} rotation={[Math.PI / 2 - 0.2, 0, 0]} outline={0} />)}
					{tracker ? (
						<group position={[0, L * 0.22, -L * 0.05]}>
							<T shape={{kind: 'box', w: L * 0.14, h: L * 0.06, d: L * 0.2}} color="#FFD84A" outline={ol * 0.6} />
							<Glow shape={{kind: 'sphere', r: L * 0.025}} color={frame % 30 < 15 ? '#FF4A5A' : '#5A1A20'} position={[0, L * 0.04, L * 0.06]} />
							<T shape={{kind: 'cyl', r: L * 0.006, h: L * 0.35}} color="#2A2638" position={[0, L * 0.02, -L * 0.25]} rotation={[Math.PI / 2 - 0.3, 0, 0]} outline={0} />
						</group>
					) : null}
				</group>
			</group>
		</group>
	);
};

/** A V of birds behind a leader at `at`, flying towards +z (turned by yaw). `n` per side. */
/** Where bird i of a Vee sits (in the Vee's own frame, before scaling): 0 leads, odd on the left, even on the right. */
export const veeSpot = (i: number, gap = 1.6): V3 => {
	if (i === 0) {
		return [0, 0, 0];
	}
	const k = Math.ceil(i / 2);
	const side = i % 2 ? -1 : 1;
	return [side * k * gap * 0.85, -k * 0.05, -k * gap * 0.8];
};

export const Vee: React.FC<{kind?: BirdKind; at: V3; frame: number; n?: number; gap?: number; yaw?: number; s?: number; skip?: number[]; wing?: 'flap' | 'glide'; sync?: boolean; moved?: Record<number, V3>}> = ({kind = 'goose', at, frame, n = 4, gap = 1.6, yaw = 0, s = 1, skip = [], wing = 'flap', sync = false, moved = {}}) => {
	const spots: Array<{p: V3; i: number}> = [{p: [0, 0, 0], i: 0}];
	for (let k = 1; k <= n; k++) {
		spots.push({p: [-k * gap * 0.85, -k * 0.05, -k * gap * 0.8], i: k * 2 - 1});
		spots.push({p: [k * gap * 0.85, -k * 0.05, -k * gap * 0.8], i: k * 2});
	}
	return (
		<group position={at} rotation={[0, deg(yaw), 0]}>
			{spots
				.filter((sp) => !skip.includes(sp.i))
				.map((sp) => (
					<Bird3D key={sp.i} kind={kind} at={moved[sp.i] ? [moved[sp.i][0] * s, moved[sp.i][1] * s, moved[sp.i][2] * s] : [sp.p[0] * s, sp.p[1] * s + Math.sin(frame * 0.05 + sp.i) * 0.06 * s, sp.p[2] * s]} frame={frame} wing={wing} phase={sync ? Math.ceil(sp.i / 2) * -0.5 : sp.i * 0.35} s={s} />
				))}
		</group>
	);
};

// ---------------------------------------------------------------- sky

const puff = () => new THREE.SphereGeometry(1, 18, 12);

/** One puffy cartoon cloud, `s` across-ish, centred on `at`. */
export const Cloud3D: React.FC<{at: V3; s?: number; seed?: number; color?: string; shade?: string; outline?: number}> = ({at, s = 10, seed = 0, color = '#FFFFFF', shade = '#E4E0FF', outline = 0.04}) => {
	const items: Copy[] = [];
	const n = 9;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2 + rnd(seed + i) * 0.6;
		const rr = 0.25 + rnd(seed * 3 + i) * 0.22;
		const r = s * rr;
		items.push({p: [Math.cos(a) * s * 0.32, r * 0.35 + rnd(seed + i * 7) * s * 0.06, Math.sin(a) * s * 0.2], s: [r, r * 0.8, r], c: i % 3 === 0 ? shade : color});
	}
	items.push({p: [0, s * 0.2, 0], s: [s * 0.36, s * 0.32, s * 0.3], c: color});
	items.push({p: [s * 0.1, s * 0.3, 0], s: [s * 0.24, s * 0.22, s * 0.22], c: color});
	return (
		<group position={at}>
			<Many kind={`cloud${seed}`} geom={puff} items={items} outline={outline} shadow={false} />
		</group>
	);
};

/** A sea of cloud tops at height y, filling a square `size` across, with an optional clear hole. */
export const CloudSea: React.FC<{y: number; size?: number; seed?: number; hole?: {at: [number, number]; r: number}; color?: string; shade?: string; frame?: number}> = ({y, size = 300, seed = 0, hole, color = '#FFFFFF', shade = '#DCD8F8', frame = 0}) => {
	const items: Copy[] = [];
	const step = 9;
	const n = Math.floor(size / step);
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const id = seed * 1000 + i * n + j;
			const x = -size / 2 + (i + rnd(id) * 0.8) * step + frame * 0.01;
			const z = -size / 2 + (j + rnd(id * 1.7) * 0.8) * step;
			if (hole && Math.hypot(x - hole.at[0], z - hole.at[1]) < hole.r) {
				continue;
			}
			const r = 6 + rnd(id * 2.3) * 5;
			items.push({p: [x, y + rnd(id * 3.1) * 2.5 - r * 0.45, z], s: [r, r * 0.7, r], c: rnd(id * 4.1) > 0.7 ? shade : color});
		}
	}
	return (
		<group>
			<Many kind={`sea${seed}${size}${hole ? 'h' : ''}`} geom={puff} items={items} outline={0.05} shadow={false} />
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y - 3, 0]}>
				<planeGeometry args={[size, size]} />
				<meshBasicMaterial color={shade} />
			</mesh>
		</group>
	);
};

/** A low sun glowing in the sky. */
export const Sun3D: React.FC<{at: V3; r?: number; color?: string}> = ({at, r = 8, color = '#FFE08A'}) => (
	<group position={at}>
		<Glow shape={{kind: 'sphere', r, seg: 32}} color={color} />
		<Glow shape={{kind: 'sphere', r: r * 1.6, seg: 32}} color={color} opacity={0.25} />
		<Glow shape={{kind: 'sphere', r: r * 2.4, seg: 32}} color={color} opacity={0.1} />
	</group>
);

/** Rising warm air: a twisting column of faint rings drifting upwards. */
export const Thermal3D: React.FC<{at: V3; frame: number; h?: number; r?: number; color?: string; opacity?: number}> = ({at, frame, h = 40, r = 6, color = '#FFC27A', opacity = 0.35}) => (
	<group position={at}>
		{[...Array(14)].map((_, i) => {
			const t = ((i / 14 + frame * 0.004) % 1);
			const y = t * h;
			const rr = r * (0.7 + t * 0.6);
			const fade = Math.sin(t * Math.PI);
			return (
				<group key={i} position={[Math.sin(t * 9 + i) * r * 0.2, y, Math.cos(t * 9 + i) * r * 0.2]} rotation={[Math.PI / 2 + Math.sin(i) * 0.15, 0, frame * 0.02 + i]}>
					<mesh>
						<torusGeometry args={[rr, 0.12 + t * 0.1, 6, 48, Math.PI * 1.5]} />
						<meshBasicMaterial color={color} transparent opacity={opacity * fade} depthWrite={false} toneMapped={false} />
					</mesh>
				</group>
			);
		})}
	</group>
);

// ---------------------------------------------------------------- the ground from above

const box = () => new THREE.BoxGeometry(1, 1, 1);
const ball = () => new THREE.SphereGeometry(1, 14, 10);
const cyl = () => new THREE.CylinderGeometry(1, 1, 1, 8);

const WALLS = ['#FFE8C8', '#F6D2B0', '#E8C8E8', '#CFE0F2', '#F2E2A8', '#E8B8A0'];
const ROOFS = ['#D8583A', '#B8462E', '#5A5E8A', '#3A8A8A', '#C86A3A'];
const CARS = ['#E8453C', '#2E8AE8', '#F2C24A', '#FFFFFF', '#3AB87A', '#8A5AE8', '#2A2638'];

export type TownOpts = {size?: number; block?: number; road?: number; seed?: number; clear?: Array<{at: [number, number]; r: number}>; frame?: number; cars?: boolean; park?: [number, number]; school?: [number, number]; jam?: number; night?: boolean};

/**
 * A town seen from the sky: a grid of roads, houses with pitched roofs,
 * gardens, trees and cars. Blocks listed in `park` or `school` (grid cell
 * i, j) are a park or the school instead of houses.
 */
export const Town3D: React.FC<TownOpts> = ({size = 220, block = 26, road = 6, seed = 0, clear = [], frame = 0, cars = true, park, school, jam, night = false}) => {
	const cell = block + road;
	const n = Math.ceil(size / cell);
	const walls: Copy[] = [];
	const roofs: Copy[] = [];
	const trees: Copy[] = [];
	const trunks: Copy[] = [];
	const lawns: Copy[] = [];
	const carBody: Copy[] = [];
	const carTop: Copy[] = [];
	const lines: Copy[] = [];
	const lit: Copy[] = [];
	const blocked = (x: number, z: number, pad = 0) => clear.some((c) => Math.hypot(x - c.at[0], z - c.at[1]) < c.r + pad);
	const off = -(n * cell) / 2;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const cx = off + i * cell + road + block / 2;
			const cz = off + j * cell + road + block / 2;
			const id = seed * 977 + i * 31 + j;
			const isPark = park && park[0] === i && park[1] === j;
			const isSchool = school && school[0] === i && school[1] === j;
			lawns.push({p: [cx, 0.05, cz], s: [block, 0.1, block], c: isPark ? '#6CC25A' : isSchool ? '#B8BCD0' : '#8ED46A'});
			if (isPark) {
				for (let t = 0; t < 22; t++) {
					const a = (t / 22) * Math.PI * 2;
					const x = cx + Math.cos(a) * block * 0.42;
					const z = cz + Math.sin(a) * block * 0.42;
					if (!blocked(x, z, 2)) {
						const r = 1.6 + rnd(id + t) * 0.9;
						trees.push({p: [x, 2.6 + r * 0.6, z], s: [r, r * 1.1, r], c: t % 3 ? '#3A9A4A' : '#58B85A'});
						trunks.push({p: [x, 1.4, z], s: [0.3, 2.8, 0.3], c: '#7A5A3A'});
					}
				}
				continue;
			}
			if (isSchool) {
				continue;
			}
			// houses along the four edges of the block, facing the road
			const per = 3;
			for (let side = 0; side < 4; side++) {
				for (let h = 0; h < per; h++) {
					const along = -block / 2 + block / (per * 2) + (h * block) / per;
					const inset = block / 2 - 5;
					const x = cx + (side === 0 ? along : side === 1 ? inset : side === 2 ? -along : -inset);
					const z = cz + (side === 0 ? inset : side === 1 ? along : side === 2 ? -inset : -along);
					if (blocked(x, z, 4)) {
						continue;
					}
					const k = id * 13 + side * 5 + h;
					const w = 5.2 + rnd(k) * 1.2;
					const d = 6 + rnd(k * 1.3) * 1.5;
					const ht = 3.8 + rnd(k * 2.1) * 1.4;
					const yaw = side % 2 ? Math.PI / 2 : 0;
					walls.push({p: [x, ht / 2, z], s: side % 2 ? [d, ht, w] : [w, ht, d], c: night ? '#4A4280' : WALLS[Math.floor(rnd(k * 3.3) * WALLS.length)]});
					const a = w * 0.74;
					roofs.push({p: [x, ht, z], s: [a, a, d * 1.04], r: [0, yaw, Math.PI / 4], c: night ? '#2A2458' : ROOFS[Math.floor(rnd(k * 4.7) * ROOFS.length)]});
					if (night && rnd(k * 6.1) > 0.35) {
						const fx = side === 1 ? -1 : side === 3 ? 1 : 0;
						const fz = side === 0 ? 1 : side === 2 ? -1 : 0;
						lit.push({p: [x + fx * (d / 2 + 0.02), ht * 0.45, z + fz * (d / 2 + 0.02)], s: [fx ? 0.05 : 1.2, 1, fz ? 0.05 : 1.2], c: '#FFD98A'});
					}
				}
			}
			// garden trees in the middle of the block
			for (let t = 0; t < 3; t++) {
				const x = cx + (rnd(id * 7 + t) - 0.5) * block * 0.3;
				const z = cz + (rnd(id * 9 + t) - 0.5) * block * 0.3;
				if (blocked(x, z, 2)) {
					continue;
				}
				const r = 1.4 + rnd(id + t * 3) * 0.8;
				trees.push({p: [x, 2.2 + r * 0.6, z], s: [r, r * 1.1, r], c: t % 2 ? '#3A9A4A' : '#58B85A'});
				trunks.push({p: [x, 1.2, z], s: [0.28, 2.4, 0.28], c: '#7A5A3A'});
			}
		}
	}
	// roads: dashes and cars
	for (let i = 0; i <= n; i++) {
		const rc = off + i * cell + road / 2;
		for (let t = 0; t < n * 4; t++) {
			const o = off + t * (cell / 4) + 2;
			lines.push({p: [rc, 0.03, o], s: [0.25, 0.02, 2.2], c: '#F2F2F2'});
			lines.push({p: [o, 0.03, rc], s: [2.2, 0.02, 0.25], c: '#F2F2F2'});
		}
		if (!cars) {
			continue;
		}
		const isJam = jam !== undefined && i === jam;
		const count = isJam ? Math.floor((n * cell) / 6) : 5;
		for (let c = 0; c < count; c++) {
			const id = seed * 71 + i * 17 + c;
			const lane = c % 2 ? 1 : -1;
			const speed = isJam ? 0 : (0.12 + rnd(id) * 0.1) * lane;
			const span = n * cell;
			const pos = isJam ? off + c * 6 + 3 : off + (((rnd(id * 3) * span + frame * speed) % span) + span) % span;
			const along = i % 2 === 0;
			const x = along ? rc + lane * 1.4 : pos;
			const z = along ? pos : rc + lane * 1.4;
			if (blocked(x, z, 1)) {
				continue;
			}
			const col = CARS[Math.floor(rnd(id * 5) * CARS.length)];
			carBody.push({p: [x, 0.55, z], s: along ? [1.8, 0.8, 4] : [4, 0.8, 1.8], c: col});
			carTop.push({p: [x, 1.15, z], s: along ? [1.6, 0.6, 2] : [2, 0.6, 1.6], c: '#CFE6F5'});
		}
	}
	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
				<planeGeometry args={[n * cell + 400, n * cell + 400]} />
				<meshToonMaterial color={night ? '#1C1840' : '#6A6E8A'} />
			</mesh>
			<Many kind={`lawn${seed}${n}${park?.join()}${school?.join()}${night}`} geom={box} items={lawns} outline={0} shadow={false} />
			<Many kind={`walls${seed}${n}${night}`} geom={box} items={walls} outline={0.06} />
			<Many kind={`roofs${seed}${n}${night}`} geom={box} items={roofs} outline={0.06} />
			<Many kind={`trees${seed}${n}`} geom={ball} items={trees} outline={0.08} color={night ? '#1E4A3A' : '#3A9A4A'} />
			<Many kind={`trunks${seed}${n}`} geom={cyl} items={trunks} outline={0} />
			<Many kind={`lines${seed}${n}`} geom={box} items={lines} outline={0} shadow={false} />
			{cars ? <Many kind={`cars${seed}${n}${jam}`} geom={box} items={carBody} outline={0.06} /> : null}
			{cars ? <Many kind={`tops${seed}${n}${jam}`} geom={box} items={carTop} outline={0.04} /> : null}
			{lit.length ? <Many kind={`lit${seed}${n}`} geom={box} items={lit} outline={0} glow shadow={false} /> : null}
		</group>
	);
};

/** The town's grid cell centre (for placing the school, park or a hero). */
export const townCell = (i: number, j: number, size = 220, block = 26, road = 6): [number, number] => {
	const cell = block + road;
	const n = Math.ceil(size / cell);
	const off = -(n * cell) / 2;
	return [off + i * cell + road + block / 2, off + j * cell + road + block / 2];
};

/** A school from the sky: a long building with a flat roof and a marked playground. */
export const SchoolTop3D: React.FC<{at: [number, number]; block?: number}> = ({at, block = 26}) => (
	<group position={[at[0], 0, at[1]]}>
		<T shape={{kind: 'box', w: block * 0.9, h: 7, d: 8}} color="#E8A07A" position={[0, 3.5, -block * 0.25]} outline={0.08} />
		<T shape={{kind: 'box', w: block * 0.9, h: 0.4, d: 8.4}} color="#8A8EA8" position={[0, 7.2, -block * 0.25]} outline={0.04} />
		<T shape={{kind: 'box', w: 5, h: 1.2, d: 0.3}} color="#2EA86A" position={[0, 5.6, -block * 0.25 + 4.2]} outline={0.02} />
		{[...Array(8)].map((_, i) => (
			<Glow key={i} shape={{kind: 'box', w: 1.6, h: 1.4, d: 0.05}} color="#CFE6F5" position={[-block * 0.38 + i * 2.8, 2.2, -block * 0.25 + 4.03]} />
		))}
		<T shape={{kind: 'box', w: block * 0.9, h: 0.12, d: block * 0.55}} color="#9AA0B8" position={[0, 0.12, block * 0.17]} outline={0} />
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, block * 0.17]}>
			<ringGeometry args={[2.6, 2.9, 40]} />
			<meshBasicMaterial color="#FFFFFF" />
		</mesh>
		{[-1, 1].map((x) => (
			<T key={x} shape={{kind: 'box', w: 0.3, h: 0.04, d: block * 0.5}} color="#FFD84A" position={[x * block * 0.3, 0.2, block * 0.17]} outline={0} />
		))}
		{[...Array(5)].map((_, i) => (
			<T key={i} shape={{kind: 'box', w: 1.2, h: 0.04, d: 1.2}} color={['#E8453C', '#2E8AE8', '#F2C24A', '#3AB87A', '#8A5AE8'][i]} position={[-block * 0.2 + i * 1.5, 0.2, block * 0.36]} outline={0} />
		))}
	</group>
);

/** A car from street level. */
export const Car3D: React.FC<{at: V3; yaw?: number; color?: string}> = ({at, yaw = 0, color = '#E8453C'}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: 1.8, h: 0.7, d: 4.1}} color={color} position={[0, 0.65, 0]} outline={0.03} />
		<T shape={{kind: 'box', w: 1.6, h: 0.6, d: 2.2}} color={color} position={[0, 1.3, -0.2]} outline={0.03} />
		<Glow shape={{kind: 'box', w: 1.62, h: 0.44, d: 2.0}} color="#CFE6F5" position={[0, 1.32, -0.2]} />
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.36, h: 0.3}} color="#2A2638" position={[x * 0.9, 0.36, z * 1.3]} rotation={[0, 0, Math.PI / 2]} outline={0.02} />))}
		{[-1, 1].map((x) => <Glow key={x} shape={{kind: 'sphere', r: 0.12}} color="#FFF6D8" position={[x * 0.6, 0.75, 2.06]} />)}
	</group>
);

/** A yellow school bus. */
export const Bus3D: React.FC<{at: V3; yaw?: number}> = ({at, yaw = 0}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: 2.5, h: 2.6, d: 10}} color="#F2B83A" position={[0, 1.75, 0]} outline={0.05} />
		<T shape={{kind: 'box', w: 2.5, h: 0.3, d: 10}} color="#2A2638" position={[0, 1.2, 0]} outline={0} />
		{[...Array(6)].map((_, i) => [-1, 1].map((x) => <Glow key={`${i}${x}`} shape={{kind: 'box', w: 0.05, h: 0.8, d: 1.2}} color="#CFE6F5" position={[x * 1.26, 2.4, -3.8 + i * 1.45]} />))}
		<Glow shape={{kind: 'box', w: 2.2, h: 1, d: 0.05}} color="#CFE6F5" position={[0, 2.3, 5.01]} />
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.5, h: 0.4}} color="#2A2638" position={[x * 1.15, 0.5, z * 3.4]} rotation={[0, 0, Math.PI / 2]} outline={0.02} />))}
	</group>
);

// ---------------------------------------------------------------- land and sea

/** A patchwork of fields, hedges and the odd farmhouse, optionally ending at a coast (sea for z < coast). */
export const Fields3D: React.FC<{size?: number; seed?: number; coast?: number; dusk?: boolean}> = ({size = 360, seed = 0, coast, dusk = false}) => {
	const fields: Copy[] = [];
	const hedges: Copy[] = [];
	const farms: Copy[] = [];
	const step = 28;
	const n = Math.floor(size / step);
	const cols = dusk ? ['#7A9A4A', '#9AAA4A', '#6A8A3A', '#B8A04A', '#5A7A3A'] : ['#8ED46A', '#B8D84A', '#6CC25A', '#E8D06A', '#58A84A', '#C8B87A'];
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const id = seed * 503 + i * n + j;
			const x = -size / 2 + (i + 0.5) * step;
			const z = -size / 2 + (j + 0.5) * step;
			if (coast !== undefined && z < coast + step * 0.5) {
				continue;
			}
			fields.push({p: [x, 0.05, z], s: [step - 1.4, 0.1, step - 1.4], r: [0, (rnd(id) - 0.5) * 0.08, 0], c: cols[Math.floor(rnd(id * 2.7) * cols.length)]});
			hedges.push({p: [x + step / 2, 0.5, z], s: [0.9, 1, step], c: '#3A7A3A'});
			hedges.push({p: [x, 0.5, z + step / 2], s: [step, 1, 0.9], c: '#3A7A3A'});
			if (rnd(id * 5.3) > 0.9) {
				farms.push({p: [x + 6, 2, z - 5], s: [6, 4, 9], c: '#F2E2C8'});
			}
		}
	}
	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
				<planeGeometry args={[size * 2, size * 2]} />
				<meshToonMaterial color={dusk ? '#4A6A3A' : '#5A9A4A'} />
			</mesh>
			<Many kind={`fields${seed}${size}${coast}${dusk}`} geom={box} items={fields} outline={0} shadow={false} />
			<Many kind={`hedges${seed}${size}${coast}`} geom={box} items={hedges} outline={0} shadow={false} />
			<Many kind={`farms${seed}${size}${coast}`} geom={box} items={farms} outline={0.08} />
			{coast !== undefined ? (
				<group>
					<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, coast - size / 2]}>
						<planeGeometry args={[size * 2, size]} />
						<meshToonMaterial color={dusk ? '#2E5A9A' : '#2E86D0'} />
					</mesh>
					<T shape={{kind: 'box', w: size * 2, h: 0.3, d: 5}} color="#F2DCA0" position={[0, 0.05, coast + 2.5]} outline={0} />
				</group>
			) : null}
		</group>
	);
};

/** Open sea with drifting white wave caps. */
export const Sea3D: React.FC<{frame: number; size?: number; color?: string; caps?: number; dusk?: boolean}> = ({frame, size = 400, color = '#2E86D0', caps = 160, dusk = false}) => {
	const items: Copy[] = [];
	for (let i = 0; i < caps; i++) {
		const x = (rnd(i * 1.3) - 0.5) * size * 0.6;
		const z = (rnd(i * 2.9) - 0.5) * size * 0.6;
		const t = ((frame * 0.012 + rnd(i * 4.4)) % 1);
		const s = Math.sin(t * Math.PI);
		items.push({p: [x + t * 3, 0.12, z], s: [1.6 * s + 0.01, 0.08, 0.35 * s + 0.01], r: [0, rnd(i) * 0.3, 0], c: dusk ? '#FFD8C8' : '#EAF6FF'});
	}
	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[size, size]} />
				<meshToonMaterial color={color} />
			</mesh>
			<Many kind={`caps${caps}`} geom={ball} items={items} outline={0} glow shadow={false} />
		</group>
	);
};

/** Sunny sea cliffs along x, their face towards +z, tops at `h`. */
export const Cliffs3D: React.FC<{at?: V3; h?: number; len?: number; seed?: number}> = ({at = [0, 0, 0], h = 24, len = 160, seed = 0}) => {
	const rocks: Copy[] = [];
	const caps: Copy[] = [];
	const stones: Copy[] = [];
	const n = Math.floor(len / 16);
	for (let i = 0; i < n; i++) {
		const x = -len / 2 + i * 16 + 8;
		const hh = h * (0.85 + Math.sin(i * 0.9 + seed) * 0.12 + rnd(seed + i) * 0.08);
		const z = Math.sin(i * 1.7 + seed) * 2.5;
		rocks.push({p: [x, hh / 2, z - 8], s: [17, hh, 16], r: [0, (rnd(i * 7) - 0.5) * 0.12, 0], c: i % 2 ? '#E8C08A' : '#DDB27C'});
		rocks.push({p: [x, hh * 0.3, z - 0.5], s: [16.5, 0.5, 1], c: '#C8986A'});
		rocks.push({p: [x, hh * 0.6, z - 0.4], s: [16.5, 0.5, 1], c: '#C8986A'});
		caps.push({p: [x, hh + 0.6, z - 8], s: [17.4, 1.4, 16.4], c: i % 2 ? '#6CC25A' : '#62B852'});
		for (let k = 0; k < 2; k++) {
			const r = 1.5 + rnd(seed * 3 + i * 2 + k) * 2;
			stones.push({p: [x - 5 + k * 9 + rnd(i + k) * 3, r * 0.5, z + 1.5 + rnd(i * 3 + k) * 2], s: [r * 1.3, r, r], c: '#C8986A'});
		}
	}
	return (
		<group position={at}>
			<Many kind={`cliffs${seed}${n}${h}`} geom={box} items={rocks} outline={0.05} />
			<Many kind={`cliffc${seed}${n}${h}`} geom={box} items={caps} outline={0.05} />
			<Many kind={`cliffs2${seed}${n}${h}`} geom={ball} items={stones} outline={0.08} />
		</group>
	);
};

/** A snowy mountain range: cones with white caps. */
export const Mountains3D: React.FC<{peaks: Array<{at: [number, number]; h: number; r?: number}>; rock?: string; snow?: string}> = ({peaks, rock = '#7A7AB0', snow = '#F6F8FF'}) => (
	<group>
		{peaks.map((p, i) => {
			const r = p.r ?? p.h * 0.75;
			const cap = 0.38;
			return (
				<group key={i} position={[p.at[0], 0, p.at[1]]} rotation={[0, i * 1.3, 0]}>
					<T shape={{kind: 'cone', r, h: p.h}} color={i % 2 ? rock : '#6A6AA0'} position={[0, p.h / 2, 0]} outline={0.25} />
					<T shape={{kind: 'cone', r: r * cap * 1.03, h: p.h * cap}} color={snow} position={[0, p.h * (1 - cap / 2) + 0.05, 0]} outline={0.15} />
				</group>
			);
		})}
	</group>
);

/** A thin cartoon thermometer or oxygen bar in the world (for frosty moments). */
export const Frost: React.FC<{at: V3; amount: number; frame: number}> = ({at, amount, frame}) => (
	<group position={at}>
		{[...Array(18)].map((_, i) => {
			const a = rnd(i * 2.1) * Math.PI * 2;
			const y = rnd(i * 3.7) * 1.5 - 0.6;
			const r = 0.3 + rnd(i * 1.9) * 0.1;
			const tw = 0.6 + 0.4 * Math.sin(frame * 0.2 + i);
			return <Glow key={i} shape={{kind: 'sphere', r: 0.025 + rnd(i) * 0.02, seg: 6}} color="#E8F8FF" position={[Math.cos(a) * r, y, Math.sin(a) * r]} opacity={Math.min(1, amount * 1.4) * tw} />;
		})}
	</group>
);

// ---------------------------------------------------------------- the pedal plane

/** The Gossamer Albatross: a huge thin wing, a canard out front, a clear pod, a pusher propeller. Faces +z. */
export const Gossamer3D: React.FC<{at: V3; frame: number; yaw?: number; children?: React.ReactNode; span?: number; stripe?: string}> = ({at, frame, yaw = 0, children, span = 29, stripe = '#B83A3A'}) => (
	<group position={at} rotation={[0, deg(yaw), 0]}>
		{/* main wing */}
		<T shape={{kind: 'box', w: span, h: 0.08, d: 2.4}} color="#F4F2FF" position={[0, 3.2, 0]} outline={0.04} opacity={0.85} />
		{[...Array(15)].map((_, i) => (
			<T key={i} shape={{kind: 'box', w: 0.06, h: 0.1, d: 2.42}} color={stripe} position={[-span / 2 + (i + 0.5) * (span / 15), 3.2, 0]} outline={0} />
		))}
		<T shape={{kind: 'box', w: span, h: 0.12, d: 0.12}} color="#2A2638" position={[0, 3.2, 0.7]} outline={0} />
		{/* bracing wires */}
		{[-1, 1].flatMap((x) =>
			[0.2, 0.38].map((f) => {
				const dx = span * f;
				const dy = 3.2 - 1.9;
				return <T key={`${x}${f}`} shape={{kind: 'cyl', r: 0.015, h: Math.hypot(dx, dy)}} color="#2A2638" position={[(x * dx) / 2, 1.9 + dy / 2, 0]} rotation={[0, 0, -Math.atan2(x * dx, dy)]} outline={0} />;
			}),
		)}
		<T shape={{kind: 'cyl', r: 0.05, h: 3.2}} color="#2A2638" position={[0, 4.6, 0]} outline={0} />
		{/* canard and boom */}
		<T shape={{kind: 'cyl', r: 0.06, h: 6}} color="#2A2638" position={[0, 2.4, 3]} rotation={[Math.PI / 2, 0, 0]} outline={0} />
		<T shape={{kind: 'box', w: 6, h: 0.06, d: 1.2}} color="#F4F2FF" position={[0, 2.5, 6]} outline={0.03} opacity={0.85} />
		{/* pod */}
		<T shape={{kind: 'capsule', r: 0.85, len: 1.6}} color="#DCEFFF" position={[0, 1.4, 0.2]} rotation={[Math.PI / 2, 0, 0]} outline={0.03} opacity={0.35} />
		{children}
		{/* propeller */}
		<group position={[0, 1.6, -1.6]} rotation={[0, 0, frame * 0.7]}>
			<T shape={{kind: 'box', w: 3.4, h: 0.22, d: 0.06}} color="#2A2638" outline={0.01} />
		</group>
	</group>
);

/** A wing for the hero: a big feathered wing strapped to one arm (for showing how big wings would need to be). */
export const BigWing: React.FC<{side: 1 | -1; len: number; color?: string; tip?: string}> = ({side, len, color = '#F4EEE0', tip = '#C9B89A'}) => (
	<group>
		<T shape={{kind: 'box', w: len * 0.55, h: 0.06, d: len * 0.2}} color={color} position={[(side * len * 0.55) / 2, 0, 0]} outline={0.03} />
		{[...Array(7)].map((_, i) => (
			<T key={i} shape={{kind: 'box', w: len * 0.5, h: 0.04, d: len * 0.05}} color={i % 2 ? color : tip} position={[side * (len * 0.55 + len * 0.2), 0, len * 0.1 - i * len * 0.035]} rotation={[0, side * (0.1 - i * 0.07), 0]} outline={0.02} />
		))}
	</group>
);

/** A simple elephant toy facing +z, about 3 tall at s=1 (for "a cloud weighs a hundred elephants"). */
export const elephantParts = (p: V3, s: number, yaw: number, c = '#9A9AB8') => {
	const rot = (x: number, z: number): [number, number] => [x * Math.cos(yaw) + z * Math.sin(yaw), -x * Math.sin(yaw) + z * Math.cos(yaw)];
	const at = (x: number, y: number, z: number): V3 => {
		const [rx, rz] = rot(x, z);
		return [p[0] + rx * s, p[1] + y * s, p[2] + rz * s];
	};
	return {
		body: {p: at(0, 1.9, 0), s: [1.2 * s, 1.05 * s, 1.6 * s] as V3, r: [0, yaw, 0] as V3, c},
		head: {p: at(0, 2.3, 1.55), s: [0.8 * s, 0.8 * s, 0.75 * s] as V3, r: [0, yaw, 0] as V3, c},
		ears: [-1, 1].map((x) => ({p: at(x * 0.8, 2.35, 1.35), s: [0.12 * s, 0.75 * s, 0.6 * s] as V3, r: [0, yaw + x * 0.3, 0] as V3, c: '#B8B8D0'})),
		trunk: {p: at(0, 1.5, 2.15), s: [0.18 * s, 0.8 * s, 0.18 * s] as V3, r: [0.25, yaw, 0] as V3, c},
		legs: [-1, 1].flatMap((x) => [-1, 1].map((z) => ({p: at(x * 0.6, 0.55, z * 0.85), s: [0.3 * s, 1.1 * s, 0.3 * s] as V3, r: [0, yaw, 0] as V3, c}))),
	};
};

export const Herd3D: React.FC<{items: Array<{p: V3; s: number; yaw: number}>}> = ({items}) => {
	const bodies: Copy[] = [];
	const heads: Copy[] = [];
	const ears: Copy[] = [];
	const trunks: Copy[] = [];
	const legs: Copy[] = [];
	items.forEach((it) => {
		const e = elephantParts(it.p, it.s, it.yaw);
		bodies.push(e.body);
		heads.push(e.head);
		ears.push(...e.ears);
		trunks.push(e.trunk);
		legs.push(...e.legs);
	});
	return (
		<group>
			<Many kind={`eb${items.length}`} geom={ball} items={bodies} outline={0.05} />
			<Many kind={`eh${items.length}`} geom={ball} items={heads} outline={0.05} />
			<Many kind={`ee${items.length}`} geom={ball} items={ears} outline={0.05} />
			<Many kind={`et${items.length}`} geom={cyl} items={trunks} outline={0.04} />
			<Many kind={`el${items.length}`} geom={cyl} items={legs} outline={0.04} />
		</group>
	);
};
