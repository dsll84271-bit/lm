import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Many, rnd, type Copy} from './many';
import {Glow, INK, T, toonRamp} from './toon';

// Inside the whale: fleshy chambers and tunnels that squeeze and throb, a
// floor of squid beaks, slime, the acid pool, a ring of muscle between
// chambers, a lump of ambergris, and a big cartoon heart.

type V3 = [number, number, number];

const deg = (d: number) => (d * Math.PI) / 180;

/**
 * A fleshy tunnel or chamber along z, centred at `at` (its middle), seen from
 * inside. `r(t)` is its radius along it (t 0..1), with folds, rings of muscle,
 * a squeeze wave travelling along it (`squeeze`) and a heartbeat `beat` (0..1).
 */
export const Gut3D: React.FC<{at?: V3; len: number; r: (t: number) => number; frame: number; squeeze?: number; beat?: number; color?: string; fold?: string; rings?: number; tilt?: number}> = ({
	at = [0, 0, 0],
	len,
	r,
	frame,
	squeeze = 0.06,
	beat = 0,
	color = '#E8788A',
	fold = '#B84A64',
	rings = 7,
	tilt = 0,
}) => {
	const N = 90;
	const M = 56;
	const geo = useMemo(() => {
		const g = new THREE.BufferGeometry();
		const pos = new Float32Array((N + 1) * M * 3);
		const col = new Float32Array((N + 1) * M * 3);
		const idx: number[] = [];
		const a = new THREE.Color(color);
		const b = new THREE.Color(fold);
		const c = new THREE.Color();
		for (let i = 0; i <= N; i++) {
			for (let j = 0; j < M; j++) {
				const ang = (j / M) * Math.PI * 2;
				const f = Math.sin(ang * 9 + i * 0.12) * 0.5 + 0.5;
				c.copy(a).lerp(b, Math.pow(f, 3) * 0.7 + (rnd(i * 7 + j * 3.1) > 0.93 ? 0.3 : 0));
				col.set([c.r, c.g, c.b], (i * M + j) * 3);
			}
		}
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < M; j++) {
				const p0 = i * M + j;
				const p1 = i * M + ((j + 1) % M);
				const p2 = (i + 1) * M + j;
				const p3 = (i + 1) * M + ((j + 1) % M);
				idx.push(p0, p1, p2, p1, p3, p2);
			}
		}
		g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		g.setAttribute('color', new THREE.BufferAttribute(col, 3));
		g.setIndex(idx);
		return g;
	}, [color, fold]);
	const pos = geo.attributes.position.array as Float32Array;
	const throb = 1 + beat * 0.035;
	for (let i = 0; i <= N; i++) {
		const t = i / N;
		const wave = 1 - squeeze * (0.5 + 0.5 * Math.sin(t * 12 - frame * 0.08));
		const R = r(t) * wave * throb;
		for (let j = 0; j < M; j++) {
			const ang = (j / M) * Math.PI * 2;
			const fold2 = 1 + 0.07 * Math.sin(ang * 9 + t * 4 + Math.sin(frame * 0.02) * 0.4) + 0.03 * Math.sin(ang * 23 + t * 9);
			pos.set([Math.cos(ang) * R * fold2, Math.sin(ang) * R * fold2, (t - 0.5) * len], (i * M + j) * 3);
		}
	}
	geo.attributes.position.needsUpdate = true;
	geo.computeVertexNormals();
	geo.computeBoundingSphere();
	return (
		<group position={at} rotation={[tilt, 0, 0]}>
			<mesh geometry={geo} receiveShadow>
				<meshToonMaterial vertexColors gradientMap={toonRamp()} side={THREE.BackSide} />
			</mesh>
			{[...Array(rings)].map((_, i) => {
				const t = (i + 0.5) / rings;
				const wave = 1 - squeeze * (0.5 + 0.5 * Math.sin(t * 12 - frame * 0.08));
				const R = r(t) * wave * throb * 0.99;
				return <T key={i} shape={{kind: 'torus', r: 1, tube: 0.045}} color={fold} position={[0, 0, (t - 0.5) * len]} scale={[R, R, Math.max(0.6, R * 0.5)]} outline={0.02} shadow={false} />;
			})}
		</group>
	);
};

/** A squid beak: a hard, hooked, dark brown point. */
const beakGeom = () => {
	const g = new THREE.ConeGeometry(0.05, 0.16, 10, 4);
	const p = g.attributes.position;
	for (let i = 0; i < p.count; i++) {
		const y = p.getY(i) + 0.08;
		p.setX(i, p.getX(i) + y * y * 2.2);
	}
	g.computeVertexNormals();
	return g;
};

/** Squid beaks scattered over a floor at height `y`, inside radius `r` of `at`, leaving `clear` free round `hole`. */
export const Beaks3D: React.FC<{at?: V3; r?: number; n?: number; y?: number; hole?: [number, number]; clear?: number; s?: number; seed?: number}> = ({at = [0, 0, 0], r = 4, n = 900, y = 0.03, hole, clear = 0, s = 1, seed = 0}) => {
	const items: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const a = rnd(i * 1.3 + seed) * Math.PI * 2;
		const d = Math.sqrt(rnd(i * 2.9 + seed)) * r;
		const x = at[0] + Math.cos(a) * d;
		const z = at[2] + Math.sin(a) * d * 1.6;
		if (hole && Math.hypot(x - hole[0], z - hole[1]) < clear) {
			continue;
		}
		const pile = rnd(i * 5.1 + seed) > 0.7 ? 0.06 : 0;
		items.push({p: [x, at[1] + y + pile, z], s: s * (0.7 + rnd(i * 4.3 + seed) * 0.6), r: [deg(80 + rnd(i * 6.1) * 30), rnd(i * 7.7) * 6.3, rnd(i * 8.8) * 2], c: rnd(i * 9.9 + seed) > 0.5 ? '#2A1E24' : '#4A2E2A'});
	}
	return <Many kind={`beaks${items.length}`} geom={beakGeom} items={items} outline={0.012} />;
};

/** The squishy floor inside a chamber, with glossy puddles. */
export const GutFloor: React.FC<{at?: V3; w?: number; d?: number; color?: string; frame: number}> = ({at = [0, 0, 0], w = 8, d = 12, color = '#D8607A', frame}) => (
	<group position={at}>
		<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
			<planeGeometry args={[w, d]} />
			<meshToonMaterial color={color} gradientMap={toonRamp()} />
		</mesh>
		{[...Array(9)].map((_, i) => (
			<mesh key={i} position={[(rnd(i * 3.1) - 0.5) * w * 0.7, 0.012, (rnd(i * 5.7) - 0.5) * d * 0.7]} rotation={[-Math.PI / 2, 0, rnd(i) * 3]} scale={[1 + rnd(i * 2) * 1.5, 0.5 + rnd(i * 4) * 0.5, 1]}>
				<circleGeometry args={[0.4 + 0.05 * Math.sin(frame * 0.05 + i), 24]} />
				<meshBasicMaterial color="#FFB8C8" transparent opacity={0.45} toneMapped={false} depthWrite={false} />
			</mesh>
		))}
	</group>
);

/** Strings of slime hanging from the roof at height `top`, with drips falling. */
export const Slime3D: React.FC<{at?: V3; top: number; frame: number; n?: number; area?: number; seed?: number}> = ({at = [0, 0, 0], top, frame, n = 14, area = 5, seed = 0}) => {
	const strands: Copy[] = [];
	const drops: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const x = at[0] + (rnd(i * 2.3 + seed) - 0.5) * area;
		const z = at[2] + (rnd(i * 4.1 + seed) - 0.5) * area * 1.6;
		const L = 0.4 + rnd(i * 6.7 + seed) * 1.0 + Math.sin(frame * 0.03 + i) * 0.08;
		strands.push({p: [x, top - L / 2, z], s: [0.05, L / 2, 0.05]});
		const t = ((frame * 0.02 + rnd(i * 3.3 + seed)) % 1);
		drops.push({p: [x, top - L - t * t * (top - L), z], s: 0.06 * (1 - t * 0.3)});
	}
	return (
		<group>
			<Many kind={`slime${n}`} geom={() => new THREE.SphereGeometry(1, 10, 8)} items={strands} color="#F8C8D8" outline={0.25} opacity={0.75} shadow={false} />
			<Many kind={`drop${n}`} geom={() => new THREE.SphereGeometry(1, 10, 8)} items={drops} color="#FFE0EA" outline={0.25} opacity={0.8} shadow={false} />
		</group>
	);
};

/** A bubbling pool of stomach acid, `r` across, with fizzing bubbles. */
export const AcidPool3D: React.FC<{at: V3; r?: number; frame: number; glow?: number}> = ({at, r = 2.2, frame, glow = 1}) => {
	const bubbles: Copy[] = [];
	for (let i = 0; i < 40; i++) {
		const t = ((frame * 0.025 + rnd(i * 2.1)) % 1);
		const a = rnd(i * 3.7) * Math.PI * 2;
		const d = Math.sqrt(rnd(i * 5.3)) * r * 0.85;
		bubbles.push({p: [at[0] + Math.cos(a) * d, at[1] + 0.02 + t * 0.25, at[2] + Math.sin(a) * d * 1.3], s: 0.04 + t * 0.07});
	}
	return (
		<group>
			<mesh position={[at[0], at[1] + 0.02, at[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.3, 1]}>
				<circleGeometry args={[r, 48]} />
				<meshBasicMaterial color="#C8F04A" toneMapped={false} transparent opacity={0.85 * glow} />
			</mesh>
			<mesh position={[at[0], at[1] + 0.025, at[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.3, 1]}>
				<ringGeometry args={[r * 0.98, r * 1.06, 48]} />
				<meshBasicMaterial color={INK} />
			</mesh>
			<Many kind="acidBub" geom={() => new THREE.SphereGeometry(1, 10, 8)} items={bubbles} color="#E8FF8A" outline={0.2} glow opacity={0.9} shadow={false} />
		</group>
	);
};

/** A ring of muscle between two chambers; `open` 0 shut, 1 wide. It faces +z. */
export const Sphincter3D: React.FC<{at: V3; r?: number; open?: number; color?: string}> = ({at, r = 1.6, open = 0.3, color = '#C85A74'}) => (
	<group position={at}>
		<mesh position={[0, 0, -0.1]}>
			<circleGeometry args={[r * 0.35 + r * 0.55 * open, 40]} />
			<meshBasicMaterial color="#2A0A18" />
		</mesh>
		<T shape={{kind: 'torus', r: r * 0.65 + r * 0.25 * open, tube: r * 0.35 - r * 0.12 * open}} color={color} outline={0.04} />
		{[...Array(8)].map((_, i) => {
			const a = (i / 8) * Math.PI * 2;
			const R = r * 0.65 + r * 0.25 * open;
			return <T key={i} shape={{kind: 'sphere', r: r * 0.12, seg: 12}} color="#E8889A" position={[Math.cos(a) * R, Math.sin(a) * R, r * 0.2]} scale={[1, 1, 0.6]} outline={0.02} />;
		})}
	</group>
);

/** A lump of ambergris: grey, waxy and knobbly, about `s` across. `fresh` makes it dark and sticky. */
export const Ambergris3D: React.FC<{at: V3; rot?: V3; s?: number; fresh?: number}> = ({at, rot, s = 0.3, fresh = 0}) => {
	const {g, o} = useMemo(() => {
		const make = (grow: number) => {
			const geo = new THREE.SphereGeometry(1, 40, 30);
			const p = geo.attributes.position;
			const col = new Float32Array(p.count * 3);
			const c = new THREE.Color();
			for (let i = 0; i < p.count; i++) {
				const x = p.getX(i);
				const y = p.getY(i);
				const z = p.getZ(i);
				const n = 1 + 0.16 * Math.sin(x * 5 + y * 3) * Math.cos(z * 4 - x * 2) + 0.08 * Math.sin(y * 11 + z * 7) + grow;
				p.setXYZ(i, x * n * 1.15, y * n * 0.82, z * n);
				const m = Math.sin(x * 9 + z * 6) * Math.cos(y * 8) > 0.35;
				c.set(m ? '#C8C0A8' : '#8A8478');
				col.set([c.r, c.g, c.b], i * 3);
			}
			geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
			geo.computeVertexNormals();
			return geo;
		};
		return {g: make(0), o: make(0.06)};
	}, []);
	const tint = fresh > 0 ? '#5A5048' : '#ffffff';
	return (
		<group position={at} rotation={rot} scale={s}>
			<mesh geometry={g} castShadow>
				<meshToonMaterial vertexColors color={tint} gradientMap={toonRamp()} />
			</mesh>
			<mesh geometry={o}>
				<meshBasicMaterial color={INK} side={THREE.BackSide} />
			</mesh>
		</group>
	);
};

/** Wavy green stink lines rising from `at`. */
export const Stink3D: React.FC<{at: V3; frame: number; n?: number; h?: number; color?: string}> = ({at, frame, n = 3, h = 0.9, color = '#9AE05A'}) => (
	<group>
		{[...Array(n)].map((_, k) => {
			const pts: Copy[] = [];
			for (let i = 0; i < 10; i++) {
				const u = i / 9;
				const t = (frame * 0.015 + k / n) % 1;
				pts.push({p: [at[0] + (k - (n - 1) / 2) * 0.22 + Math.sin(u * 8 + frame * 0.12 + k) * 0.07, at[1] + 0.1 + u * h + t * 0.2, at[2]], s: 0.035 * (1 - Math.abs(u - 0.5)) + 0.01});
			}
			return <Many key={k} kind={`stink${k}`} geom={() => new THREE.SphereGeometry(1, 8, 6)} items={pts} color={color} outline={0.3} shadow={false} />;
		})}
	</group>
);

/** A big red cartoon heart (the organ), about `s` tall. */
export const Heart3D: React.FC<{at: V3; s?: number; beat?: number; rot?: V3}> = ({at, s = 1, beat = 0, rot}) => {
	const k = s * (1 + beat * 0.08);
	return (
		<group position={at} scale={k} rotation={rot}>
			<T shape={{kind: 'sphere', r: 0.42, seg: 28}} color="#D8303A" position={[-0.2, 0.08, 0]} outline={0.02} />
			<T shape={{kind: 'sphere', r: 0.42, seg: 28}} color="#D8303A" position={[0.2, 0.08, 0]} outline={0.02} />
			<T shape={{kind: 'cone', r: 0.6, h: 0.75}} color="#D8303A" position={[0, -0.36, 0]} rotation={[Math.PI, 0, 0]} outline={0.02} />
			<T shape={{kind: 'cyl', r: 0.12, h: 0.45}} color="#E86A70" position={[0.08, 0.6, 0]} rotation={[0, 0, -0.3]} outline={0.015} />
			<T shape={{kind: 'cyl', r: 0.09, h: 0.35}} color="#5A7AD8" position={[-0.22, 0.55, 0.05]} rotation={[0, 0, 0.3]} outline={0.015} />
			<Glow shape={{kind: 'sphere', r: 0.08, seg: 10}} color="#FFFFFF" position={[-0.32, 0.25, 0.35]} opacity={0.7} />
		</group>
	);
};
