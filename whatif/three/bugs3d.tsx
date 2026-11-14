import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Many, rnd, type Copy} from './many';
import {Glow, T} from './toon';

// Creatures for Episode 4 (shrinking to ant size): Pip the ant and crowds of
// ants, a ladybird, a mosquito, a water strider, a mouse (and shrew), and the
// cat's head and paw. Built at "ant scale": the hero is 1.7 tall, so a real
// ant is about 2.6 long. Everything faces +z when rot = 0, like the hero.

type V3 = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);

/** A cel-shaded rod from a to b (static shapes only: the geometry is cached by length). */
export const Rod: React.FC<{a: V3; b: V3; r: number; color: string; outline?: number; opacity?: number}> = ({a, b, r, color, outline = 0.012, opacity}) => {
	const va = new THREE.Vector3(...a);
	const vb = new THREE.Vector3(...b);
	const len = Math.max(0.01, Math.round(va.distanceTo(vb) * 50) / 50);
	const mid = va.clone().add(vb).multiplyScalar(0.5);
	const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, vb.clone().sub(va).normalize()));
	return <T shape={{kind: 'capsule', r, len: Math.max(0.001, len - r * 2)}} color={color} position={[mid.x, mid.y, mid.z]} rotation={[e.x, e.y, e.z]} outline={outline} opacity={opacity} />;
};

// ---------------------------------------------------------------- ants

export type AntLook = {body: string; dark: string; light: string};
export const ANT: Record<string, AntLook> = {
	pip: {body: '#C2502E', dark: '#7A2A1E', light: '#E8845A'},
	red: {body: '#B23A26', dark: '#6A1E16', light: '#D86A4A'},
	black: {body: '#3A2A3E', dark: '#1E1426', light: '#6A5A7A'},
	fire: {body: '#C8602A', dark: '#7A3418', light: '#F09050'},
};

/** One leg: a femur up and out from the hip, a tibia down to the ground. */
const AntLeg: React.FC<{side: 1 | -1; z: number; spread: number; swing: number; lift: number; c: AntLook}> = ({side, z, spread, swing, lift, c}) => (
	<group position={[0.15 * side, 0.46 + lift * 0.1, z]} rotation={[0, side * spread + swing, 0]}>
		<group rotation={[0, 0, -side * 1.0]}>
			<T shape={{kind: 'capsule', r: 0.05, len: 0.42}} color={c.body} position={[0, 0.25, 0]} outline={0.012} />
			<group position={[0, 0.5, 0]} rotation={[0, 0, -side * (1.62 - lift * 0.35)]}>
				<T shape={{kind: 'capsule', r: 0.045, len: 0.86}} color={c.dark} position={[0, 0.47, 0]} outline={0.01} />
				<T shape={{kind: 'sphere', r: 0.055, seg: 12}} color={c.dark} position={[0, 0.94, 0]} outline={0.008} />
			</group>
		</group>
	</group>
);

export type AntProps = {
	at: V3;
	rot?: number;
	frame: number;
	look?: AntLook;
	/** Walking phase in cycles (undefined = standing). */
	walk?: number;
	/** Pip's big friendly eyes. */
	pip?: boolean;
	/** 0..1 reaches the feelers forward and down, to touch something in front. */
	tap?: number;
	/** 0..1 opens the jaws. */
	jaws?: number;
	/** Head turn (radians), and nod (radians, + looks down). */
	headTurn?: number;
	nod?: number;
	s?: number;
	/** Look of the pupils [x, y] in -1..1. */
	gaze?: [number, number];
	tilt?: number;
	children?: React.ReactNode;
};

/** A cartoon ant, about 2.6 long and 1.1 tall at s = 1. Children ride on its back (sit at y ≈ 0.75). */
export const Ant3D: React.FC<AntProps> = ({at, rot = 0, frame, look = ANT.pip, walk, pip = false, tap = 0, jaws = 0, headTurn = 0, nod = 0, s = 1, gaze = [0, 0], tilt = 0, children}) => {
	const c = look;
	const ph = walk === undefined ? null : walk * Math.PI * 2;
	const legs: Array<{side: 1 | -1; z: number; spread: number; set: number}> = [];
	[0.22, 0, -0.22].forEach((z, i) => {
		[1, -1].forEach((side) => {
			legs.push({side: side as 1 | -1, z, spread: [0.55, 0, -0.55][i] * side * -1, set: (i + (side > 0 ? 0 : 1)) % 2});
		});
	});
	const bob = ph === null ? Math.sin(frame * 0.08) * 0.01 : Math.abs(Math.sin(ph * 2)) * 0.03;
	const wig = Math.sin(frame * 0.17) * 0.12;
	const blink = (frame + Math.round(at[0] * 7)) % 97 > 92 ? 0.15 : 1;
	return (
		<group position={at} rotation={[0, rot, tilt]} scale={s}>
			{legs.map((l, i) => {
				const p = ph === null ? 0 : ph + (l.set ? Math.PI : 0);
				const swing = ph === null ? Math.sin(frame * 0.05 + i) * 0.03 : Math.sin(p) * 0.32 * -l.side;
				const lift = ph === null ? 0 : Math.max(0, Math.cos(p));
				return <AntLeg key={i} side={l.side} z={l.z} spread={l.spread} swing={swing} lift={lift} c={c} />;
			})}
			<group position={[0, bob, 0]}>
				{/* thorax, waist, abdomen */}
				<T shape={{kind: 'capsule', r: 0.2, len: 0.42}} color={c.body} position={[0, 0.58, 0.02]} rotation={[Math.PI / 2 - 0.25, 0, 0]} outline={0.018} />
				<T shape={{kind: 'sphere', r: 0.13, seg: 20}} color={c.dark} position={[0, 0.52, -0.36]} outline={0.012} />
				<group position={[0, 0.66, -0.92]} rotation={[0.35, 0, 0]}>
					<T shape={{kind: 'sphere', r: 0.55, seg: 40}} color={c.body} scale={[0.86, 0.78, 1.08]} outline={0.02} />
					{[-0.2, 0.08, 0.34].map((z, i) => (
						<T key={i} shape={{kind: 'torus', r: 0.43 - Math.abs(z) * 0.35, tube: 0.035}} color={c.dark} position={[0, 0, z]} scale={[0.95, 0.88, 1]} outline={0} />
					))}
					<mesh position={[-0.18, 0.28, 0.1]} scale={[0.5, 0.3, 0.6]}>
						<sphereGeometry args={[0.3, 16, 12]} />
						<meshBasicMaterial color="#ffffff" transparent opacity={0.35} toneMapped={false} />
					</mesh>
				</group>
				{/* head */}
				<group position={[0, 0.8, 0.5]} rotation={[nod, headTurn, 0]} scale={1.15}>
					<T shape={{kind: 'sphere', r: 0.36, seg: 40}} color={c.body} scale={[1.05, 0.92, 0.95]} position={[0, 0, 0.1]} outline={0.02} />
					<mesh position={[-0.14, 0.2, 0.3]} scale={[0.6, 0.35, 0.4]}>
						<sphereGeometry args={[0.15, 16, 12]} />
						<meshBasicMaterial color="#ffffff" transparent opacity={0.5} toneMapped={false} />
					</mesh>
					{/* eyes */}
					{[-1, 1].map((sd) =>
						pip ? (
							<group key={sd} position={[sd * 0.18, 0.09, 0.37]}>
								<T shape={{kind: 'sphere', r: 0.15, seg: 24}} color="#FFFFFF" scale={[1, blink, 0.8]} outline={0.012} />
								{blink > 0.5 ? (
									<group>
										<T shape={{kind: 'sphere', r: 0.075, seg: 16}} color="#140A28" position={[gaze[0] * 0.04, gaze[1] * 0.04, 0.07]} outline={0} />
										<Glow shape={{kind: 'sphere', r: 0.025, seg: 8}} color="#FFFFFF" position={[gaze[0] * 0.04 - 0.025, gaze[1] * 0.04 + 0.03, 0.13]} />
									</group>
								) : null}
							</group>
						) : (
							<group key={sd} position={[sd * 0.25, 0.06, 0.3]}>
								<T shape={{kind: 'sphere', r: 0.085, seg: 16}} color="#1E1426" outline={0.008} />
								<Glow shape={{kind: 'sphere', r: 0.022, seg: 8}} color="#FFFFFF" position={[-0.02, 0.03, 0.07]} />
							</group>
						),
					)}
					{/* jaws */}
					{[-1, 1].map((sd) => (
						<group key={`j${sd}`} position={[sd * 0.13, -0.2, 0.36]} rotation={[0.3, sd * (0.5 + jaws * 0.5), 0]}>
							<T shape={{kind: 'capsule', r: 0.045, len: 0.16}} color={c.dark} position={[-sd * 0.04, 0, 0.1]} rotation={[Math.PI / 2, 0, sd * 0.5]} outline={0.01} />
						</group>
					))}
					{/* feelers: a long stalk up, then an elbow forward */}
					{[-1, 1].map((sd) => {
						const up = 0.35 - tap * 0.3;
						const fwd = 0.9 + tap * 0.7;
						return (
							<group key={`a${sd}`} position={[sd * 0.12, 0.28, 0.25]} rotation={[-up + Math.sin(frame * 0.21 + sd) * 0.06, 0, sd * (0.3 + wig * sd * 0.5)]}>
								<T shape={{kind: 'capsule', r: 0.03, len: 0.34}} color={c.dark} position={[0, 0.2, 0]} outline={0.008} />
								<group position={[0, 0.4, 0]} rotation={[fwd, 0, 0]}>
									<T shape={{kind: 'capsule', r: 0.026, len: 0.46}} color={c.dark} position={[0, 0.26, 0]} outline={0.008} />
									<T shape={{kind: 'sphere', r: 0.05, seg: 12}} color={c.light} position={[0, 0.52, 0]} outline={0.008} />
								</group>
							</group>
						);
					})}
				</group>
				{children}
			</group>
		</group>
	);
};

export type AntSpot = {p: V3; rot: number; s?: number; walk?: number; look?: AntLook; pitch?: number; roll?: number};

const sphereG = () => new THREE.SphereGeometry(1, 14, 10);
const legG = () => new THREE.CylinderGeometry(0.035, 0.03, 1, 6).translate(0, 0.5, 0);

/** Lots of simple ants in a few draw calls: crowds, lines, rafts. */
export const AntCrowd: React.FC<{ants: AntSpot[]; frame: number; look?: AntLook; legs?: boolean}> = ({ants, frame, look = ANT.red, legs = true}) => {
	const parts = useMemo(() => ({head: [] as Copy[], thorax: [] as Copy[], gaster: [] as Copy[], leg: [] as Copy[], eye: [] as Copy[]}), []);
	parts.head.length = 0;
	parts.thorax.length = 0;
	parts.gaster.length = 0;
	parts.leg.length = 0;
	parts.eye.length = 0;
	const m = new THREE.Matrix4();
	const q = new THREE.Quaternion();
	const v = new THREE.Vector3();
	const e = new THREE.Euler();
	ants.forEach((a, i) => {
		const s = a.s ?? 1;
		const c = a.look ?? look;
		e.set(a.pitch ?? 0, a.rot, a.roll ?? 0);
		q.setFromEuler(e);
		m.compose(new THREE.Vector3(...a.p), q, new THREE.Vector3(s, s, s));
		const at = (x: number, y: number, z: number): V3 => {
			v.set(x, y, z).applyMatrix4(m);
			return [v.x, v.y, v.z];
		};
		const r: V3 = [e.x, e.y, e.z];
		const ph = a.walk === undefined ? 0 : a.walk * Math.PI * 2;
		const bob = a.walk === undefined ? 0 : Math.abs(Math.sin(ph * 2)) * 0.03;
		parts.gaster.push({p: at(0, 0.66 + bob, -0.9), s: [0.47 * s, 0.42 * s, 0.6 * s], r, c: c.body});
		parts.thorax.push({p: at(0, 0.58 + bob, 0.02), s: [0.2 * s, 0.2 * s, 0.4 * s], r, c: c.body});
		parts.head.push({p: at(0, 0.8 + bob, 0.6), s: [0.4 * s, 0.36 * s, 0.37 * s], r, c: c.body});
		for (const sd of [-1, 1]) {
			parts.eye.push({p: at(sd * 0.26, 0.88 + bob, 0.86), s: 0.08 * s, r});
		}
		if (legs) {
			[0.22, 0, -0.22].forEach((z, k) => {
				for (const sd of [-1, 1]) {
					const set = (k + (sd > 0 ? 0 : 1)) % 2;
					const p = ph + (set ? Math.PI : 0);
					const sw = a.walk === undefined ? Math.sin(frame * 0.05 + i + k) * 0.03 : Math.sin(p) * 0.3;
					const lift = a.walk === undefined ? 0 : Math.max(0, Math.cos(p)) * 0.12;
					const fz = z + [0.45, 0, -0.45][k] + sw;
					const hip = at(sd * 0.15, 0.5 + bob, z);
					const knee = at(sd * 0.6, 0.78 + lift, (z + fz) / 2);
					const foot = at(sd * 1.15, lift * 0.5, fz);
					for (const [p0, p1] of [
						[hip, knee],
						[knee, foot],
					] as Array<[V3, V3]>) {
						const d = new THREE.Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
						const len = d.length();
						const rq = new THREE.Quaternion().setFromUnitVectors(UP, d.normalize());
						const re = new THREE.Euler().setFromQuaternion(rq);
						parts.leg.push({p: p0, s: [s, len, s], r: [re.x, re.y, re.z], c: c.dark});
					}
				}
			});
		}
	});
	return (
		<group>
			<Many kind="ant-g" geom={sphereG} items={parts.gaster} outline={0.06} />
			<Many kind="ant-t" geom={sphereG} items={parts.thorax} outline={0.1} />
			<Many kind="ant-h" geom={sphereG} items={parts.head} outline={0.07} />
			<Many kind="ant-e" geom={sphereG} items={parts.eye} color="#140A28" outline={0} glow />
			{legs ? <Many kind="ant-l" geom={legG} items={parts.leg} outline={0} shadow={false} /> : null}
		</group>
	);
};

// ---------------------------------------------------------------- ladybird

/** A ladybird, about 3.5 long, facing +z. */
export const Ladybird3D: React.FC<{at: V3; rot?: number; frame: number; walk?: number}> = ({at, rot = 0, frame, walk = 0}) => {
	const spots: V3[] = [
		[0.55, 0.95, 0.35],
		[-0.55, 0.95, 0.35],
		[0.75, 0.75, -0.45],
		[-0.75, 0.75, -0.45],
		[0, 1.15, -0.35],
		[0.4, 0.85, -1.05],
		[-0.4, 0.85, -1.05],
	];
	return (
		<group position={at} rotation={[0, rot, 0]}>
			{[0.45, -0.1, -0.65].map((z, i) =>
				[-1, 1].map((sd) => {
					const p = walk * Math.PI * 2 + (i + (sd > 0 ? 0 : 1)) * Math.PI;
					return <Rod key={`${i}${sd}`} a={[sd * 0.6, 0.35, z]} b={[sd * 1.15, 0, z + Math.sin(p) * 0.18]} r={0.05} color="#1E1426" />;
				}),
			)}
			<T shape={{kind: 'sphere', r: 1.2, seg: 48}} color="#E8303A" position={[0, 0.3, -0.25]} scale={[1, 0.75, 1.15]} outline={0.03} />
			<T shape={{kind: 'box', w: 0.04, h: 0.9, d: 2.6}} color="#1E1426" position={[0, 0.88, -0.25]} outline={0} />
			{spots.map((p, i) => (
				<T key={i} shape={{kind: 'sphere', r: 0.24, seg: 16}} color="#1E1426" position={p} scale={[1, 0.45, 1]} outline={0} />
			))}
			<mesh position={[-0.4, 0.9, 0.1]} scale={[0.8, 0.3, 0.6]}>
				<sphereGeometry args={[0.3, 16, 12]} />
				<meshBasicMaterial color="#ffffff" transparent opacity={0.45} toneMapped={false} />
			</mesh>
			<T shape={{kind: 'sphere', r: 0.52, seg: 32}} color="#1E1426" position={[0, 0.32, 1.0]} scale={[1, 0.7, 0.7]} outline={0.02} />
			{[-1, 1].map((sd) => (
				<group key={sd}>
					<T shape={{kind: 'sphere', r: 0.16, seg: 16}} color="#FFFFFF" position={[sd * 0.3, 0.42, 1.25]} scale={[1, 0.6, 0.6]} outline={0.008} />
					<Rod a={[sd * 0.15, 0.5, 1.3]} b={[sd * 0.35, 0.75 + Math.sin(frame * 0.2 + sd) * 0.05, 1.7]} r={0.025} color="#1E1426" />
				</group>
			))}
		</group>
	);
};

// ---------------------------------------------------------------- mosquito

/** A mosquito, about 2.4 long, facing +z. `flap` beats the wings. */
export const Mosquito3D: React.FC<{at: V3; rot?: V3; frame: number; flap?: boolean}> = ({at, rot, frame, flap = true}) => {
	const w = flap ? Math.sin(frame * 2.3) * 0.6 : 0.2;
	return (
		<group position={at} rotation={rot}>
			<T shape={{kind: 'capsule', r: 0.14, len: 1.1}} color="#6A6A80" position={[0, 0.05, -0.75]} rotation={[Math.PI / 2 + 0.2, 0, 0]} outline={0.012} />
			{[-0.4, -0.7, -1.0].map((z) => (
				<T key={z} shape={{kind: 'torus', r: 0.13, tube: 0.02}} color="#E8E8F2" position={[0, 0.05 + (z + 0.4) * 0.2, z]} outline={0} />
			))}
			<T shape={{kind: 'sphere', r: 0.24, seg: 24}} color="#55597A" position={[0, 0.15, 0]} scale={[0.9, 0.9, 1.1]} outline={0.014} />
			<T shape={{kind: 'sphere', r: 0.14, seg: 20}} color="#3A3A50" position={[0, 0.2, 0.3]} outline={0.012} />
			{[-1, 1].map((sd) => (
				<T key={sd} shape={{kind: 'sphere', r: 0.07, seg: 12}} color="#E8303A" position={[sd * 0.09, 0.25, 0.38]} outline={0.006} />
			))}
			<Rod a={[0, 0.12, 0.42]} b={[0, -0.15, 1.1]} r={0.02} color="#2A2A3A" />
			{[-1, 1].map((sd) => (
				<group key={`w${sd}`} position={[sd * 0.12, 0.3, -0.05]} rotation={[0, 0, sd * (0.25 + w)]}>
					<mesh position={[sd * 0.6, 0, -0.25]} rotation={[0, sd * 0.35, 0]} scale={[0.6, 0.02, 0.18]}>
						<sphereGeometry args={[1, 20, 10]} />
						<meshBasicMaterial color="#DCEFFF" transparent opacity={0.45} toneMapped={false} />
					</mesh>
				</group>
			))}
			{[0.15, 0, -0.15].map((z, i) =>
				[-1, 1].map((sd) => (
					<group key={`${i}${sd}`}>
						<Rod a={[sd * 0.1, 0.05, z]} b={[sd * 0.7, 0.35, z + (1 - i) * 0.5]} r={0.018} color="#2A2A3A" outline={0.006} />
						<Rod a={[sd * 0.7, 0.35, z + (1 - i) * 0.5]} b={[sd * 1.3, -0.5, z + (1 - i) * 1.0]} r={0.014} color="#2A2A3A" outline={0.006} />
					</group>
				)),
			)}
		</group>
	);
};

// ---------------------------------------------------------------- water strider

/** A water strider standing on water at y = 0, facing +z, legs making dimples. */
export const Strider3D: React.FC<{at: V3; rot?: number; frame: number}> = ({at, rot = 0, frame}) => {
	const feet: Array<[V3, V3]> = [
		[[0.15, 0.55, 0.45], [0.7, 0.05, 1.5]],
		[[-0.15, 0.55, 0.45], [-0.7, 0.05, 1.5]],
		[[0.15, 0.55, 0.1], [3.0, 0.02, 0.9]],
		[[-0.15, 0.55, 0.1], [-3.0, 0.02, 0.9]],
		[[0.12, 0.55, -0.1], [2.6, 0.02, -2.6]],
		[[-0.12, 0.55, -0.1], [-2.6, 0.02, -2.6]],
	];
	const bob = Math.sin(frame * 0.1) * 0.02;
	return (
		<group position={at} rotation={[0, rot, 0]}>
			<T shape={{kind: 'capsule', r: 0.14, len: 1.5}} color="#3A3A50" position={[0, 0.6 + bob, -0.3]} rotation={[Math.PI / 2, 0, 0]} outline={0.014} />
			<T shape={{kind: 'sphere', r: 0.16, seg: 20}} color="#3A3A50" position={[0, 0.66 + bob, 0.6]} outline={0.012} />
			{[-1, 1].map((sd) => (
				<T key={sd} shape={{kind: 'sphere', r: 0.06, seg: 12}} color="#FFD84A" position={[sd * 0.11, 0.72 + bob, 0.7]} outline={0.005} />
			))}
			{feet.map(([h, f], i) => {
				const knee: V3 = [h[0] + (f[0] - h[0]) * 0.35, 1.0, h[2] + (f[2] - h[2]) * 0.35];
				return (
					<group key={i}>
						<Rod a={h} b={knee} r={0.03} color="#2A2A3A" outline={0.006} />
						<Rod a={knee} b={f} r={0.025} color="#2A2A3A" outline={0.006} />
						{/* the dimple: a dark ring and a bright ring round each foot */}
						{i > 1 ? (
							<group position={[f[0], 0.005, f[2]]}>
								<mesh rotation={[-Math.PI / 2, 0, 0]}>
									<ringGeometry args={[0.18, 0.34, 32]} />
									<meshBasicMaterial color="#1E4A7A" transparent opacity={0.5} />
								</mesh>
								<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
									<ringGeometry args={[0.34, 0.44, 32]} />
									<meshBasicMaterial color="#DFF6FF" transparent opacity={0.7} toneMapped={false} />
								</mesh>
							</group>
						) : null}
					</group>
				);
			})}
		</group>
	);
};

// ---------------------------------------------------------------- mouse and shrew

/** A mouse (or, with `shrew`, an Etruscan shrew), about 1.6 long at s = 1, facing +z. */
export const Mouse3D: React.FC<{at: V3; rot?: number; frame: number; shrew?: boolean; walk?: number; s?: number; sing?: number; squash?: number}> = ({at, rot = 0, frame, shrew = false, walk, s = 1, sing = 0, squash = 0}) => {
	const fur = shrew ? '#8A6A5A' : '#B8B0C8';
	const belly = shrew ? '#C9B0A0' : '#E8E4F0';
	const pink = '#FFB0C0';
	const ph = walk === undefined ? 0 : walk * Math.PI * 2;
	const breathe = 1 + Math.sin(frame * (shrew ? 0.9 : 0.25)) * (shrew ? 0.04 : 0.02);
	return (
		<group position={at} rotation={[0, rot, 0]} scale={[s * (1 + squash * 0.25), s * (1 - squash * 0.35), s]}>
			{/* tail */}
			{[...Array(5)].map((_, i) => {
				const a = i * 0.45 + Math.sin(frame * 0.1 + i) * 0.1;
				return <T key={i} shape={{kind: 'capsule', r: 0.035 - i * 0.004, len: 0.16}} color={pink} position={[Math.sin(a) * 0.15 * i, 0.12 + i * 0.02, -0.55 - i * 0.16]} rotation={[Math.PI / 2, 0, 0]} outline={0.006} />;
			})}
			{/* feet */}
			{[-1, 1].map((sd) =>
				[0.25, -0.25].map((z, k) => (
					<T key={`${sd}${z}`} shape={{kind: 'sphere', r: 0.07, seg: 12}} color={pink} position={[sd * 0.18, 0.04 + (walk === undefined ? 0 : Math.max(0, Math.sin(ph + k * Math.PI + (sd > 0 ? 0 : Math.PI))) * 0.06), z + (walk === undefined ? 0 : Math.sin(ph + k * Math.PI) * 0.06)]} scale={[1, 0.6, 1.3]} outline={0.006} />
				)),
			)}
			<T shape={{kind: 'sphere', r: 0.42, seg: 36}} color={fur} position={[0, 0.34, -0.15]} scale={[0.85 * breathe, 0.75 * breathe, 1.15]} outline={0.016} />
			<T shape={{kind: 'sphere', r: 0.3, seg: 24}} color={belly} position={[0, 0.27, 0.0]} scale={[0.75, 0.6, 0.9]} outline={0} />
			<group position={[0, 0.45, 0.3]} rotation={[sing * -0.35, 0, 0]}>
				<T shape={{kind: 'sphere', r: 0.24, seg: 32}} color={fur} scale={[1, 0.9, 1.05]} outline={0.014} />
				<T shape={{kind: 'cone', r: 0.13, h: shrew ? 0.5 : 0.3}} color={fur} position={[0, -0.04, shrew ? 0.38 : 0.28]} rotation={[Math.PI / 2, 0, 0]} outline={0.01} />
				<T shape={{kind: 'sphere', r: 0.05, seg: 12}} color={pink} position={[0, -0.04, shrew ? 0.64 : 0.44]} outline={0.006} />
				{[-1, 1].map((sd) => (
					<group key={sd}>
						<T shape={{kind: 'sphere', r: shrew ? 0.035 : 0.05, seg: 12}} color="#140A28" position={[sd * 0.12, 0.06, 0.18]} outline={0} />
						<Glow shape={{kind: 'sphere', r: 0.014, seg: 6}} color="#FFFFFF" position={[sd * 0.12 - 0.012, 0.075, 0.225]} />
						<group position={[sd * 0.17, shrew ? 0.12 : 0.2, -0.04]} rotation={[0.2, sd * 0.4, sd * -0.3]}>
							<T shape={{kind: 'sphere', r: shrew ? 0.08 : 0.16, seg: 20}} color={fur} scale={[1, 1, 0.3]} outline={0.01} />
							<T shape={{kind: 'sphere', r: shrew ? 0.05 : 0.11, seg: 16}} color={pink} position={[0, 0, 0.02]} scale={[1, 1, 0.25]} outline={0} />
						</group>
						{[0, 1].map((k) => (
							<Rod key={k} a={[sd * 0.06, -0.05, shrew ? 0.55 : 0.38]} b={[sd * 0.38, -0.02 + k * 0.08, shrew ? 0.6 : 0.42]} r={0.006} color="#140A28" outline={0} />
						))}
					</group>
				))}
				{sing > 0.05 ? <T shape={{kind: 'sphere', r: 0.05, seg: 10}} color="#5A1E2A" position={[0, -0.12, shrew ? 0.45 : 0.36]} scale={[1, sing, 0.5]} outline={0} /> : null}
			</group>
		</group>
	);
};

// ---------------------------------------------------------------- the cat

/** The cat's head, huge, facing +z, at ant scale (about 60 across). `pupil` 0..1 narrows the slits. */
export const CatHead3D: React.FC<{at: V3; rot?: V3; frame: number; pupil?: number; glow?: number}> = ({at, rot, frame, pupil = 0.5, glow = 1}) => {
	const fur = '#D8844A';
	const furL = '#F2C8A0';
	const blink = (frame % 120) > 114 ? 0.1 : 1;
	return (
		<group position={at} rotation={rot}>
			<T shape={{kind: 'sphere', r: 26, seg: 48}} color={fur} scale={[1.15, 0.92, 0.9]} outline={0.6} />
			<T shape={{kind: 'sphere', r: 12, seg: 32}} color={furL} position={[0, -9, 19]} scale={[1.2, 0.75, 0.7]} outline={0.4} />
			{[-1, 1].map((sd) => (
				<group key={sd}>
					<T shape={{kind: 'cone', r: 10, h: 18}} color={fur} position={[sd * 18, 22, -2]} rotation={[0, 0, -sd * 0.35]} outline={0.5} />
					<T shape={{kind: 'cone', r: 6, h: 11}} color="#C98A9A" position={[sd * 18, 21, 2]} rotation={[0, 0, -sd * 0.35]} outline={0} />
					<group position={[sd * 10.5, 3, 20]}>
						<T shape={{kind: 'sphere', r: 6.2, seg: 40}} color="#7CF27A" scale={[1, blink, 0.6]} outline={0.35} emissive="#3AD84A" emissiveIntensity={0.35 * glow} />
						{blink > 0.5 ? (
							<group>
								<T shape={{kind: 'sphere', r: 5.6, seg: 32}} color="#140A28" position={[0, 0, 1.4]} scale={[0.12 + (1 - pupil) * 0.6, 0.95, 0.5]} outline={0} />
								<Glow shape={{kind: 'sphere', r: 1.1, seg: 12}} color="#FFFFFF" position={[-2.2, 2.4, 3.9]} />
							</group>
						) : null}
						<Glow shape={{kind: 'sphere', r: 9, seg: 24}} color="#7CF27A" opacity={0.12 * glow} />
					</group>
					{[0, 1, 2].map((k) => (
						<Rod key={k} a={[sd * 6, -9 + k * 1.2, 26]} b={[sd * 46, -6 + k * 4 - 4, 22]} r={0.18} color="#F2F2F2" outline={0.08} />
					))}
				</group>
			))}
			<T shape={{kind: 'cone', r: 2.4, h: 2.6}} color="#FF8AA8" position={[0, -5, 26.5]} rotation={[Math.PI, 0, 0]} outline={0.2} />
		</group>
	);
};

/** A cat's paw, huge, pad side down, at ant scale. */
export const CatPaw3D: React.FC<{at: V3; rot?: V3; claws?: number}> = ({at, rot, claws = 0}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'cyl', r: 7, r2: 8, h: 60, seg: 32}} color="#D8844A" position={[0, 32, -3]} outline={0.5} />
		<T shape={{kind: 'sphere', r: 9, seg: 40}} color="#F2C8A0" position={[0, 3, 0]} scale={[1.1, 0.6, 1.2]} outline={0.5} />
		{[-1.5, -0.5, 0.5, 1.5].map((k) => (
			<group key={k} position={[k * 4.4, 2, 8.5 - Math.abs(k) * 1.6]}>
				<T shape={{kind: 'sphere', r: 3.2, seg: 24}} color="#F2C8A0" scale={[1, 0.75, 1.1]} outline={0.3} />
				<T shape={{kind: 'sphere', r: 2.1, seg: 20}} color="#FF9AB8" position={[0, -1.6, 0.3]} scale={[1, 0.4, 1]} outline={0} />
				{claws > 0 ? <T shape={{kind: 'cone', r: 0.8, h: 3 * claws}} color="#F2F2F2" position={[0, -0.5, 3 + claws]} rotation={[Math.PI / 2 + 0.3, 0, 0]} outline={0.1} /> : null}
			</group>
		))}
		<T shape={{kind: 'sphere', r: 4.5, seg: 24}} color="#FF9AB8" position={[0, -1.2, -1]} scale={[1.3, 0.35, 1]} outline={0} />
	</group>
);

export {rnd};
