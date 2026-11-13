import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Box} from './sets3d';
import {Glow, T} from './toon';

// Props for Episode 3 (invisibility): eyes and light rays, a glass frog, an
// octopus, a pit viper, a cloak with bending waves, a giant hair, ancient
// Greece, a school stage, party bits, kitchen bits and signs drawn on canvases.

type V3 = [number, number, number];
const mix = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, t))).getHexString();
const UP = new THREE.Vector3(0, 1, 0);

/** A glowing line from a to b (a unit cylinder, scaled, so it can move every frame). */
export const Ray: React.FC<{a: V3; b: V3; r?: number; color: string; opacity?: number}> = ({a, b, r = 0.025, color, opacity = 1}) => {
	const va = new THREE.Vector3(...a);
	const vb = new THREE.Vector3(...b);
	const len = va.distanceTo(vb);
	if (len < 1e-4) {
		return null;
	}
	const mid = va.clone().add(vb).multiplyScalar(0.5);
	const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, vb.clone().sub(va).normalize()));
	return (
		<group position={[mid.x, mid.y, mid.z]} rotation={[e.x, e.y, e.z]} scale={[r / 0.025, len, r / 0.025]}>
			<Glow shape={{kind: 'cyl', r: 0.025, h: 1, seg: 8}} color={color} opacity={opacity} />
		</group>
	);
};

/** A path of rays through points, drawn up to fraction `p` of its length. */
export const RayPath: React.FC<{pts: V3[]; p: number; r?: number; color: string; opacity?: number}> = ({pts, p, r, color, opacity}) => {
	const lens = pts.slice(1).map((q, i) => new THREE.Vector3(...q).distanceTo(new THREE.Vector3(...pts[i])));
	const total = lens.reduce((x, y) => x + y, 0);
	let left = total * Math.max(0, Math.min(1, p));
	const out: React.ReactNode[] = [];
	for (let i = 0; i < lens.length && left > 0; i++) {
		const t = Math.min(1, left / lens[i]);
		const a = pts[i];
		const b = pts[i + 1];
		out.push(<Ray key={i} a={a} b={[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]} r={r} color={color} opacity={opacity} />);
		left -= lens[i];
	}
	return <group>{out}</group>;
};

/** A plane with a picture drawn on a canvas; redrawn when `dep` changes. */
export const CanvasPlane: React.FC<{w: number; h: number; px?: number; dep: string; draw: (ctx: CanvasRenderingContext2D, W: number, H: number) => void; position?: V3; rotation?: V3; lit?: boolean}> = ({w, h, px = 512, dep, draw, position, rotation, lit = false}) => {
	const W = px;
	const H = Math.round((px * h) / w);
	const {canvas, tex, seen} = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = W;
		c.height = H;
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		t.anisotropy = 4;
		return {canvas: c, tex: t, seen: {k: ''}};
	}, [W, H]);
	if (seen.k !== dep) {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.clearRect(0, 0, W, H);
			draw(ctx, W, H);
			tex.needsUpdate = true;
		}
		seen.k = dep;
	}
	return (
		<mesh position={position} rotation={rotation}>
			<planeGeometry args={[w, h]} />
			{lit ? <meshToonMaterial map={tex} transparent /> : <meshBasicMaterial map={tex} transparent toneMapped={false} />}
		</mesh>
	);
};

// ---------------------------------------------------------------- the eye

/**
 * A giant eye looking towards -x, cut open so the light inside shows. `clear`
 * 0 = a normal eye (rays focus on the glowing retina), 1 = a see-through eye
 * (rays pass straight out of the back). `p` = how far the light has travelled.
 */
export const Eye3D: React.FC<{at: V3; frame: number; clear: number; p: number}> = ({at, frame, clear, p}) => {
	const ys = [-0.42, -0.21, 0, 0.21, 0.42];
	const caught = clear < 0.5;
	return (
		<group position={at}>
			<T shape={{kind: 'sphere', r: 1, seg: 48}} color="#F4F6FF" opacity={0.42 - clear * 0.3} outline={0.025} />
			{/* iris, pupil and lens at the front (-x) */}
			<T shape={{kind: 'cyl', r: 0.46, h: 0.04, seg: 40}} color="#3FB7E8" position={[-0.93, 0, 0]} rotation={[0, 0, Math.PI / 2]} opacity={1 - clear * 0.8} outline={0.01} />
			<T shape={{kind: 'cyl', r: 0.2, h: 0.05, seg: 32}} color="#140A28" position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} opacity={1 - clear * 0.8} outline={0} />
			<T shape={{kind: 'sphere', r: 0.26}} color="#BFEFFF" position={[-0.72, 0, 0]} scale={[0.5, 1, 1]} opacity={0.6 - clear * 0.5} outline={0.008} />
			{/* the retina at the back */}
			<T shape={{kind: 'sphere', r: 0.9, seg: 40}} color="#FF7A5A" position={[0.25, 0, 0]} scale={[0.82, 1.05, 1.05]} opacity={(1 - clear) * 0.22} outline={0} />
			{caught ? (
				<Glow shape={{kind: 'sphere', r: 0.16}} color="#FFE24A" position={[0.93, 0, 0]} opacity={Math.max(0, Math.min(1, (p - 0.55) * 3)) * (0.7 + Math.sin(frame * 0.4) * 0.3)} />
			) : null}
			{ys.map((y, i) => {
				const pts: V3[] = caught ? [[-6, y, 0], [-0.75, y, 0], [0.93, -y * 0.05, 0]] : [[-6, y, 0], [6, y, 0]];
				return <RayPath key={i} pts={pts} p={p} r={0.03} color={i % 2 ? '#FFE24A' : '#FFF4B0'} />;
			})}
		</group>
	);
};

// ---------------------------------------------------------------- glass frog

/** A glass frog, side-on facing +x. `clear` moves its blood into its liver (0..1). */
export const Frog3D: React.FC<{at: V3; frame: number; clear?: number; rot?: number}> = ({at, frame, clear = 0, rot = 0}) => {
	const green = '#A6EE7A';
	const beat = 1 + Math.max(0, Math.sin(frame * 0.45)) * 0.18;
	const blood = [...Array(18)].map((_, i) => {
		const a = i * 2.39;
		const home: V3 = [Math.cos(a) * 0.32, Math.sin(a * 1.3) * 0.12, Math.sin(a) * 0.22];
		const liver: V3 = [-0.02 + Math.cos(a) * 0.06, -0.06 + Math.sin(a) * 0.03, Math.sin(a * 2) * 0.05];
		const t = Math.max(0, Math.min(1, clear * 1.4 - (i % 5) * 0.08));
		return [home[0] + (liver[0] - home[0]) * t, home[1] + (liver[1] - home[1]) * t, home[2] + (liver[2] - home[2]) * t] as V3;
	});
	return (
		<group position={at} rotation={[0, rot, 0]}>
			<T shape={{kind: 'sphere', r: 0.5, seg: 40}} color={green} position={[0, 0.32, 0]} scale={[1.25, 0.62, 0.95]} opacity={0.58 - clear * 0.22} outline={0.018} />
			{/* insides: spine, heart, liver, blood */}
			<T shape={{kind: 'capsule', r: 0.025, len: 0.7}} color="#FFFFFF" position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} opacity={0.8} outline={0} />
			<T shape={{kind: 'sphere', r: 0.085}} color={mix('#E8304A', '#FF9AA8', clear)} position={[0.22, 0.28, 0]} scale={beat} outline={0.008} />
			<T shape={{kind: 'sphere', r: 0.13}} color={mix('#8A2A3A', '#C9D2DC', clear * 0.7)} position={[-0.02, 0.26, 0]} scale={[1.2, 0.55, 0.9]} outline={0.008} />
			{blood.map((b, i) => (
				<T key={i} shape={{kind: 'sphere', r: 0.022, seg: 10}} color="#E8304A" position={[b[0], 0.32 + b[1], b[2]]} outline={0} />
			))}
			{/* eyes on top, facing forward */}
			{[-0.17, 0.17].map((z) => (
				<group key={z} position={[0.44, 0.6, z]}>
					<T shape={{kind: 'sphere', r: 0.13}} color="#F2E6B8" outline={0.012} />
					<T shape={{kind: 'box', w: 0.04, h: 0.05, d: 0.1}} color="#140A28" position={[0.1, 0.02, 0]} outline={0} />
					<T shape={{kind: 'sphere', r: 0.022}} color="#FFFFFF" position={[0.12, 0.06, z > 0 ? 0.03 : -0.03]} outline={0} />
				</group>
			))}
			{/* legs, folded */}
			{[-1, 1].map((s) => (
				<group key={s}>
					<T shape={{kind: 'capsule', r: 0.07, len: 0.36}} color={green} position={[-0.32, 0.12, s * 0.36]} rotation={[0, s * 0.4, Math.PI / 2 - 0.2]} opacity={0.75} outline={0.012} />
					<T shape={{kind: 'capsule', r: 0.05, len: 0.2}} color={green} position={[0.38, 0.1, s * 0.3]} rotation={[s * 0.3, 0, 0.3]} opacity={0.75} outline={0.012} />
					{[0, 1, 2].map((k) => (
						<T key={k} shape={{kind: 'sphere', r: 0.035}} color="#FFF0A8" position={[0.45 + k * 0.05, 0.02, s * (0.26 + k * 0.05)]} outline={0.006} />
					))}
				</group>
			))}
		</group>
	);
};

/** A big rainforest leaf, flat-ish, pointing +x. */
export const Leaf3D: React.FC<{at: V3; s?: number; rot?: number}> = ({at, s = 1, rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]} scale={[s, s, s]}>
		<T shape={{kind: 'sphere', r: 1, seg: 32}} color="#2E8A4A" scale={[1.9, 0.06, 0.9]} outline={0.02} />
		<Box size={[3.4, 0.02, 0.04]} at={[0, 0.06, 0]} color="#7CC870" outline={0} />
		{[-1.2, -0.6, 0, 0.6, 1.2].map((x) => [-1, 1].map((sz) => <Box key={`${x}${sz}`} size={[0.6, 0.015, 0.03]} at={[x + 0.15, 0.055, sz * 0.25]} rot={[0, sz * 0.6, 0]} color="#5BB060" outline={0} />))}
	</group>
);

// ---------------------------------------------------------------- octopus

/** An octopus on the sea bed. `blend` 0..1 turns its skin from orange to the rock colour, spots and all. */
export const Octopus3D: React.FC<{at: V3; frame: number; blend: number; rock: string}> = ({at, frame, blend, rock}) => {
	const skin = mix('#FF7A3D', rock, blend);
	const dark = mix('#C8452A', mix(rock, '#2A2350', 0.35), blend);
	return (
		<group position={at}>
			<group position={[0, 0.85, -0.1]} rotation={[-0.35, 0, Math.sin(frame * 0.05) * 0.05]}>
				<T shape={{kind: 'sphere', r: 0.5, seg: 40}} color={skin} scale={[1, 1.25, 0.95]} />
				{[...Array(10)].map((_, i) => (
					<T key={i} shape={{kind: 'sphere', r: 0.06 + (i % 3) * 0.02, seg: 12}} color={dark} position={[Math.cos(i * 2.1) * 0.38, 0.1 + Math.sin(i * 1.7) * 0.35, 0.3 + Math.sin(i * 2.1) * 0.12]} scale={[1, 1, 0.4]} opacity={blend} outline={0} />
				))}
			</group>
			{[-0.2, 0.2].map((x) => (
				<group key={x} position={[x, 0.62, 0.36]}>
					<T shape={{kind: 'sphere', r: 0.11}} color="#FFF4D6" outline={0.012} />
					<T shape={{kind: 'box', w: 0.1, h: 0.035, d: 0.03}} color="#140A28" position={[0, 0, 0.1]} outline={0} />
				</group>
			))}
			{[...Array(8)].map((_, k) => {
				const a = (k / 8) * Math.PI * 2 + 0.2;
				return (
					<group key={k} rotation={[0, a, 0]}>
						{[...Array(8)].map((_, j) => {
							const t = j / 7;
							const wave = Math.sin(frame * 0.08 + k + j * 0.6) * 0.12 * t;
							return <T key={j} shape={{kind: 'sphere', r: 0.11 - t * 0.075, seg: 14}} color={j % 2 ? skin : dark} position={[0, 0.12 + Math.sin(t * Math.PI) * 0.15, 0.3 + t * 1.2 + wave * 0.3]} outline={0.008} />;
						})}
					</group>
				);
			})}
		</group>
	);
};

// ---------------------------------------------------------------- pit viper

/** A green pit viper coiled in an S, head towards +x, with heat pits and a flicking tongue. */
export const Snake3D: React.FC<{at: V3; frame: number}> = ({at, frame}) => {
	const n = 34;
	const pts = [...Array(n)].map((_, i) => {
		const t = i / (n - 1);
		return [-1.2 + t * 2.2, 0.12, Math.sin(t * Math.PI * 2.2 + frame * 0.03) * 0.35 * (1 - t * 0.6)] as V3;
	});
	const head = pts[n - 1];
	const flick = (frame % 50) < 12;
	return (
		<group position={at}>
			{pts.map((p, i) => (
				<T key={i} shape={{kind: 'sphere', r: 0.06 + Math.sin((i / n) * Math.PI) * 0.06, seg: 14}} color={i % 4 === 0 ? '#3E7A2E' : '#7CC850'} position={p} outline={0.006} />
			))}
			<group position={[head[0] + 0.12, 0.16, head[2]]}>
				<T shape={{kind: 'sphere', r: 0.13, seg: 24}} color="#7CC850" scale={[1.5, 0.75, 1.05]} />
				{[-1, 1].map((s) => (
					<group key={s}>
						<T shape={{kind: 'sphere', r: 0.035}} color="#FFD84A" position={[0.08, 0.05, s * 0.1]} outline={0.006} />
						<T shape={{kind: 'box', w: 0.01, h: 0.04, d: 0.01}} color="#140A28" position={[0.1, 0.05, s * 0.125]} outline={0} />
						<T shape={{kind: 'sphere', r: 0.018}} color="#140A28" position={[0.17, 0.0, s * 0.08]} outline={0} />
					</group>
				))}
				{flick ? <Box size={[0.22, 0.01, 0.03]} at={[0.3, -0.03, 0]} color="#E8304A" outline={0} /> : null}
			</group>
		</group>
	);
};

/** A glass tank on a plinth. */
export const Tank3D: React.FC<{at: V3; w?: number; children?: React.ReactNode}> = ({at, w = 2.4, children}) => (
	<group position={at}>
		<Box size={[w + 0.2, 0.9, 1.4]} at={[0, 0.45, 0]} color="#2A2350" />
		<group position={[0, 0.9, 0]}>
			<Box size={[w, 0.12, 1.2]} at={[0, 0.06, 0]} color="#C9A06A" outline={0} />
			{children}
			<T shape={{kind: 'box', w, h: 1, d: 1.2}} color="#CFEFFF" position={[0, 0.5, 0]} opacity={0.16} outline={0.015} />
		</group>
	</group>
);

// ---------------------------------------------------------------- cloak

/**
 * The 2006 cloak, seen from above: rings of "metamaterial" around a copper
 * cylinder, and microwave wavefronts flowing left to right. With `on`, the
 * waves are squeezed through the rings and come out undisturbed (the real
 * mapping r' = R1 + r (R2 - R1) / R2); without it, the cylinder casts a shadow.
 */
export const Cloak3D: React.FC<{frame: number; on: number}> = ({frame, on}) => {
	const R1 = 0.55;
	const R2 = 1.75;
	const fronts = 9;
	const dots: React.ReactNode[] = [];
	for (let k = 0; k < fronts; k++) {
		const x0 = -6 + ((frame * 0.035 + k * 1.3) % (fronts * 1.3));
		for (let j = 0; j <= 60; j++) {
			const z0 = -4 + (j / 60) * 8;
			const r = Math.hypot(x0, z0);
			let x = x0;
			let z = z0;
			let o = 1;
			if (on > 0.5) {
				if (r < R2) {
					const rr = R1 + (r * (R2 - R1)) / R2;
					x = (x0 / Math.max(r, 1e-3)) * rr;
					z = (z0 / Math.max(r, 1e-3)) * rr;
				}
			} else {
				if (r < 0.42) {
					continue;
				}
				if (x0 > 0 && Math.abs(z0) < 0.42) {
					o = 0.12;
				}
			}
			dots.push(<Glow key={`${k}-${j}`} shape={{kind: 'sphere', r: 0.045, seg: 8}} color="#7FE0FF" position={[x, 0.08, z]} opacity={o} />);
		}
	}
	return (
		<group>
			<T shape={{kind: 'cyl', r: 0.4, h: 0.9}} color="#D98A4E" position={[0, 0.45, 0]} />
			{on > 0.5
				? [0.75, 1.0, 1.25, 1.5, 1.72].map((r) => (
						<group key={r}>
							{[...Array(Math.round(r * 18))].map((_, i) => {
								const a = (i / Math.round(r * 18)) * Math.PI * 2;
								return <Box key={i} size={[0.03, 0.8, 0.14]} at={[Math.cos(a) * r, 0.4, Math.sin(a) * r]} rot={[0, -a, 0]} color={i % 2 ? '#3FB7E8' : '#E8C27A'} outline={0.004} />;
							})}
						</group>
					))
				: null}
			{dots}
		</group>
	);
};

// ---------------------------------------------------------------- hair and light

/** A giant hair lying along x, with cuticle scales, and a tiny light wave running beside it. */
export const Hair3D: React.FC<{frame: number}> = ({frame}) => {
	const wave: React.ReactNode[] = [];
	for (let i = 0; i < 160; i++) {
		const x = -0.4 + i * 0.005;
		const y = 3.62 + Math.sin(x * ((Math.PI * 2) / 0.05) - frame * 0.25) * 0.008;
		wave.push(<Glow key={i} shape={{kind: 'sphere', r: 0.0025, seg: 6}} color="#7FE0FF" position={[x, y, 0.2]} />);
	}
	return (
		<group>
			<T shape={{kind: 'cyl', r: 3.5, h: 40, seg: 64}} color="#6A4A3A" position={[0, 0, -0.5]} rotation={[0, 0, Math.PI / 2]} outline={0.04} />
			{[...Array(40)].map((_, i) => (
				<T key={i} shape={{kind: 'torus', r: 3.52, tube: 0.05}} color="#5A3A2A" position={[-19 + i, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} outline={0} />
			))}
			{wave}
		</group>
	);
};

// ---------------------------------------------------------------- ancient Greece

export const Temple3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		{[0, 1, 2].map((i) => (
			<Box key={i} size={[7 - i * 0.4, 0.25, 4 - i * 0.4]} at={[0, 0.125 + i * 0.25, 0]} color="#EDE6D6" />
		))}
		{[-2.6, -1.56, -0.52, 0.52, 1.56, 2.6].map((x) => (
			<group key={x}>
				<T shape={{kind: 'cyl', r: 0.24, r2: 0.28, h: 3, seg: 20}} color="#F6F1E4" position={[x, 2.25, 1.3]} outline={0.015} />
				<Box size={[0.7, 0.18, 0.7]} at={[x, 3.84, 1.3]} color="#EDE6D6" outline={0.01} />
			</group>
		))}
		<Box size={[6.8, 0.4, 3.4]} at={[0, 4.1, 0.2]} color="#EDE6D6" />
		<T shape={{kind: 'cyl', r: 1.1, h: 6.8, seg: 3}} color="#E8DCC4" position={[0, 4.86, 0.2]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[1, 1, 0.5]} />
		<Box size={[5, 3, 0.2]} at={[0, 2.25, -0.9]} color="#C9A86A" outline={0} />
	</group>
);

export const Sheep3D: React.FC<{at: V3; rot?: number; frame: number}> = ({at, rot = 0, frame}) => (
	<group position={at} rotation={[0, rot, 0]}>
		{[[-0.18, 0.5, 0], [0.12, 0.52, 0.1], [0.1, 0.5, -0.12], [-0.05, 0.62, 0]].map((p, i) => (
			<T key={i} shape={{kind: 'sphere', r: 0.26, seg: 20}} color="#F6F4EE" position={p as V3} outline={0.012} />
		))}
		<group position={[0.42, 0.62 + Math.sin(frame * 0.08) * 0.02, 0]}>
			<T shape={{kind: 'sphere', r: 0.14}} color="#2A2350" scale={[1.3, 1, 1]} />
			{[-0.08, 0.08].map((z) => (
				<T key={z} shape={{kind: 'sphere', r: 0.025}} color="#FFFFFF" position={[0.12, 0.05, z]} outline={0} />
			))}
		</group>
		{[[-0.2, -0.1], [-0.2, 0.1], [0.2, -0.1], [0.2, 0.1]].map(([x, z], i) => (
			<T key={i} shape={{kind: 'capsule', r: 0.04, len: 0.22}} color="#2A2350" position={[x, 0.17, z]} outline={0.006} />
		))}
	</group>
);

export const OliveTree3D: React.FC<{at: V3; s?: number}> = ({at, s = 1}) => (
	<group position={at} scale={[s, s, s]}>
		<T shape={{kind: 'cyl', r: 0.12, r2: 0.2, h: 1.6}} color="#7A5A3E" position={[0, 0.8, 0]} rotation={[0, 0, 0.12]} />
		{[[0, 1.9, 0], [0.5, 1.7, 0.2], [-0.5, 1.75, -0.1], [0.1, 2.2, -0.2]].map((p, i) => (
			<T key={i} shape={{kind: 'sphere', r: 0.55}} color={i % 2 ? '#7A9A5A' : '#8AAE68'} position={p as V3} scale={[1.2, 0.8, 1]} />
		))}
	</group>
);

/** The ring of Gyges: a gold band that glints. */
export const Ring3D: React.FC<{at: V3; frame: number; s?: number}> = ({at, frame, s = 1}) => (
	<group position={at} scale={[s, s, s]} rotation={[0.5, frame * 0.03, 0]}>
		<T shape={{kind: 'torus', r: 0.12, tube: 0.03}} color="#FFD84A" emissive="#FFB020" emissiveIntensity={0.4} outline={0.006} />
		<Glow shape={{kind: 'sphere', r: 0.03}} color="#FFFFFF" position={[0.12, 0.05, 0]} opacity={0.5 + Math.sin(frame * 0.3) * 0.5} />
	</group>
);

export const Throne3D: React.FC<{at: V3; frame: number; crown?: boolean}> = ({at, frame, crown = true}) => (
	<group position={at}>
		<Box size={[1.2, 0.5, 1]} at={[0, 0.25, 0]} color="#C9A06A" />
		<Box size={[1.1, 0.12, 0.9]} at={[0, 0.56, 0]} color="#B8283C" />
		<Box size={[1.2, 1.8, 0.2]} at={[0, 1.2, -0.45]} color="#E8B83A" />
		<T shape={{kind: 'sphere', r: 0.12}} color="#FFD84A" position={[0, 2.18, -0.45]} />
		{crown ? (
			<group position={[0, 0.84 + Math.sin(frame * 0.06) * 0.04, 0.05]}>
				<T shape={{kind: 'cyl', r: 0.2, h: 0.14}} color="#FFD84A" emissive="#FFB020" emissiveIntensity={0.3} />
				{[...Array(5)].map((_, i) => {
					const a = (i / 5) * Math.PI * 2;
					return <T key={i} shape={{kind: 'cone', r: 0.05, h: 0.14}} color="#FFD84A" position={[Math.cos(a) * 0.17, 0.12, Math.sin(a) * 0.17]} outline={0.006} />;
				})}
			</group>
		) : null}
	</group>
);

// ---------------------------------------------------------------- the school stage and hall

/** A stage at z = 0 facing +z: platform, red curtains, a spotlight on `spot`. */
export const Stage3D: React.FC<{spot?: [number, number]; spotOn?: number}> = ({spot = [0, -1], spotOn = 1}) => (
	<group>
		<Box size={[30, 0.1, 30]} at={[0, -0.06, 6]} color="#2A2148" outline={0} />
		<Box size={[12, 1, 5]} at={[0, -0.5, -2]} color="#8A5A3E" />
		<Box size={[12, 0.05, 5]} at={[0, 0.01, -2]} color="#A8724A" outline={0} />
		<Box size={[12, 6, 0.2]} at={[0, 3, -4.5]} color="#1E1650" outline={0} />
		{[-1, 1].map((s) => (
			<group key={s}>
				{[...Array(9)].map((_, i) => (
					<T key={i} shape={{kind: 'cyl', r: 0.22, h: 6, seg: 16}} color={i % 2 ? '#B8283C' : '#D6304A'} position={[s * (3.2 + i * 0.33), 3, -0.2 - (i % 2) * 0.1]} outline={0.01} />
				))}
			</group>
		))}
		{[...Array(30)].map((_, i) => (
			<T key={`v${i}`} shape={{kind: 'cyl', r: 0.2, h: 1.1, seg: 12}} color={i % 2 ? '#B8283C' : '#D6304A'} position={[-6 + i * 0.41, 5.5, -0.1]} outline={0.006} />
		))}
		<Box size={[12.4, 0.25, 0.3]} at={[0, 6.1, 0]} color="#E8B83A" />
		{spotOn > 0 ? (
			<group>
				<Glow shape={{kind: 'cyl', r: 1.1, h: 0.01, seg: 48}} color="#FFF3C4" position={[spot[0], 0.04, spot[1]]} opacity={0.55 * spotOn} />
				<group position={[spot[0], 3.5, spot[1] + 1]} rotation={[0.28, 0, 0]}>
					<Glow shape={{kind: 'cyl', r: 1.1, r2: 0.12, h: 7, seg: 40}} color="#FFF3C4" opacity={0.12 * spotOn} />
				</group>
			</group>
		) : null}
	</group>
);

/** Rows of audience heads and shoulders facing -z, from z = `z0` back. `up` 0..1 stands them up. */
export const Audience3D: React.FC<{z0: number; frame: number; up?: number; rows?: number; cols?: number; clap?: boolean}> = ({z0, frame, up = 0, rows = 12, cols = 26, clap = false}) => {
	const {heads, bodies, eyes} = useMemo(() => {
		const n = rows * cols;
		const hg = new THREE.SphereGeometry(0.2, 16, 12);
		const bg = new THREE.CylinderGeometry(0.2, 0.26, 0.5, 12);
		const hm = new THREE.MeshToonMaterial();
		const bm = new THREE.MeshToonMaterial();
		const h = new THREE.InstancedMesh(hg, hm, n);
		const b = new THREE.InstancedMesh(bg, bm, n);
		const skins = ['#FFD08A', '#7FD0FF', '#FFB0C8', '#A6E8B0', '#C9A6FF', '#E8B07A', '#9FB0D0', '#FFE08A'].map((c) => new THREE.Color(c));
		const tops = ['#E8453C', '#3FB7E8', '#FFD84A', '#2EA86A', '#7F5AF0', '#FF8A3D', '#55597A', '#F2F2F2'].map((c) => new THREE.Color(c));
		for (let i = 0; i < n; i++) {
			h.setColorAt(i, skins[(i * 5) % skins.length]);
			b.setColorAt(i, tops[(i * 3 + 1) % tops.length]);
		}
		const e = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({color: '#140A28'}), n * 2);
		return {heads: h, bodies: b, eyes: e};
	}, [rows, cols]);
	const o = useMemo(() => new THREE.Object3D(), []);
	for (let i = 0; i < rows * cols; i++) {
		const r = Math.floor(i / cols);
		const c = i % cols;
		const x = -((cols - 1) * 0.55) / 2 + c * 0.55 + (r % 2) * 0.27;
		const z = z0 + r * 0.9;
		const seat = 0.45 + r * 0.12;
		const jig = clap ? Math.abs(Math.sin(frame * 0.5 + i * 1.7)) * 0.05 : Math.sin(frame * 0.05 + i) * 0.01;
		const lift = up * Math.max(0, Math.min(1, up * 3 - ((i * 7) % 10) / 10)) * 0.55;
		o.position.set(x, seat + 0.25 + lift + jig, z);
		o.updateMatrix();
		bodies.setMatrixAt(i, o.matrix);
		o.position.set(x, seat + 0.72 + lift + jig, z);
		o.updateMatrix();
		heads.setMatrixAt(i, o.matrix);
		for (const s of [0, 1]) {
			o.position.set(x + (s ? 0.07 : -0.07), seat + 0.76 + lift + jig, z - 0.185);
			o.updateMatrix();
			eyes.setMatrixAt(i * 2 + s, o.matrix);
		}
	}
	eyes.instanceMatrix.needsUpdate = true;
	heads.instanceMatrix.needsUpdate = true;
	bodies.instanceMatrix.needsUpdate = true;
	return (
		<group>
			<primitive object={bodies} />
			<primitive object={heads} />
			<primitive object={eyes} />
		</group>
	);
};

/** A microphone; with `stand`, on its stand at floor level. */
export const Mic3D: React.FC<{at: V3; stand?: boolean; rot?: V3}> = ({at, stand = false, rot}) => (
	<group position={at} rotation={rot}>
		{stand ? (
			<group>
				<T shape={{kind: 'cyl', r: 0.22, h: 0.04}} color="#2A2350" position={[0, 0.02, 0]} outline={0.008} />
				<T shape={{kind: 'cyl', r: 0.02, h: 1.4}} color="#55597A" position={[0, 0.7, 0]} outline={0.006} />
			</group>
		) : null}
		<group position={stand ? [0, 1.45, 0.05] : [0, 0, 0]}>
			<T shape={{kind: 'cyl', r: 0.035, r2: 0.025, h: 0.22}} color="#2A2350" position={[0, -0.1, 0]} outline={0.006} />
			<T shape={{kind: 'sphere', r: 0.06, seg: 16}} color="#8F96A8" position={[0, 0.04, 0]} outline={0.006} />
		</group>
	</group>
);

// ---------------------------------------------------------------- party

export const PartyHat3D: React.FC<{at: V3; color?: string; tilt?: number}> = ({at, color = '#FF4FD8', tilt = 0}) => (
	<group position={at} rotation={[0, 0, tilt]}>
		<T shape={{kind: 'cone', r: 0.14, h: 0.34}} color={color} position={[0, 0.17, 0]} outline={0.01} />
		<T shape={{kind: 'torus', r: 0.11, tube: 0.018}} color="#FFD84A" position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0} />
		<T shape={{kind: 'sphere', r: 0.05}} color="#FFD84A" position={[0, 0.36, 0]} outline={0.006} />
	</group>
);

export const Cake3D: React.FC<{at: V3; frame: number}> = ({at, frame}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.3, h: 0.22}} color="#FFB0C8" position={[0, 0.11, 0]} />
		<T shape={{kind: 'cyl', r: 0.31, h: 0.05}} color="#FFFFFF" position={[0, 0.23, 0]} outline={0.008} />
		{[...Array(5)].map((_, i) => {
			const a = (i / 5) * Math.PI * 2;
			return (
				<group key={i} position={[Math.cos(a) * 0.17, 0.32, Math.sin(a) * 0.17]}>
					<T shape={{kind: 'cyl', r: 0.015, h: 0.14}} color={['#3FB7E8', '#FFD84A', '#7CF2A0'][i % 3]} outline={0.004} />
					<Glow shape={{kind: 'sphere', r: 0.025, seg: 8}} color="#FFC850" position={[0, 0.09 + Math.sin(frame * 0.6 + i) * 0.005, 0]} />
				</group>
			);
		})}
	</group>
);

export const Umbrella3D: React.FC<{at: V3; color?: string; tilt?: number}> = ({at, color = '#E8453C', tilt = 0}) => (
	<group position={at} rotation={[tilt, 0, tilt * 0.5]}>
		<T shape={{kind: 'cone', r: 0.62, h: 0.3, }} color={color} position={[0, 0.15, 0]} outline={0.012} />
		<T shape={{kind: 'cyl', r: 0.015, h: 0.9}} color="#2A2350" position={[0, -0.3, 0]} outline={0.004} />
	</group>
);

// ---------------------------------------------------------------- around the house and school

export const Toothbrush3D: React.FC<{at: V3; rot?: V3}> = ({at, rot}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'box', w: 0.2, h: 0.025, d: 0.025}} color="#3FB7E8" outline={0.004} />
		<T shape={{kind: 'box', w: 0.045, h: 0.03, d: 0.022}} color="#FFFFFF" position={[0.08, 0.025, 0]} outline={0.003} />
	</group>
);

export const Bowl3D: React.FC<{at: V3; full?: number}> = ({at, full = 1}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.16, r2: 0.1, h: 0.1}} color="#FFFFFF" position={[0, 0.05, 0]} outline={0.008} />
		{full > 0 ? <T shape={{kind: 'cyl', r: 0.145 * Math.min(1, full + 0.3), h: 0.02}} color="#F2C66E" position={[0, 0.095, 0]} outline={0} /> : null}
	</group>
);

export const Spoon3D: React.FC<{at: V3; rot?: V3; flakes?: boolean}> = ({at, rot, flakes = false}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'box', w: 0.18, h: 0.012, d: 0.022}} color="#C9CED8" position={[-0.07, 0, 0]} outline={0.003} />
		<T shape={{kind: 'sphere', r: 0.035}} color="#C9CED8" position={[0.04, 0, 0]} scale={[1.3, 0.35, 1]} outline={0.004} />
		{flakes ? <T shape={{kind: 'sphere', r: 0.03}} color="#F2C66E" position={[0.04, 0.012, 0]} scale={[1.2, 0.5, 1]} outline={0} /> : null}
	</group>
);

/** A clump of cornflakes (a mouthful) hanging in the air. */
export const Flakes3D: React.FC<{at: V3; n?: number}> = ({at, n = 9}) => (
	<group position={at}>
		{[...Array(n)].map((_, i) => (
			<T key={i} shape={{kind: 'box', w: 0.045, h: 0.008, d: 0.04}} color={i % 2 ? '#F2C66E' : '#E8A84A'} position={[Math.cos(i * 2.4) * 0.03, Math.sin(i * 1.7) * 0.025, Math.sin(i * 2.4) * 0.03]} rotation={[i, i * 0.7, i * 1.3]} outline={0.003} />
		))}
	</group>
);

export const Pen3D: React.FC<{at: V3; rot?: V3; color?: string}> = ({at, rot, color = '#E8453C'}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'cyl', r: 0.018, h: 0.16}} color={color} outline={0.004} />
		<T shape={{kind: 'cone', r: 0.018, h: 0.03}} color="#140A28" position={[0, -0.095, 0]} rotation={[Math.PI, 0, 0]} outline={0} />
	</group>
);

export const Kettle3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.13, r2: 0.15, h: 0.26}} color="#C9CED8" position={[0, 0.13, 0]} />
		<T shape={{kind: 'cyl', r: 0.025, r2: 0.035, h: 0.16}} color="#C9CED8" position={[0.16, 0.18, 0]} rotation={[0, 0, -0.9]} outline={0.006} />
		<T shape={{kind: 'torus', r: 0.08, tube: 0.02}} color="#2A2350" position={[-0.14, 0.2, 0]} outline={0} />
		<Box size={[0.08, 0.02, 0.02]} at={[0.0, 0.28, 0.14]} color="#E8453C" outline={0} />
	</group>
);

/** A wobbly mountain of exercise books. */
export const Marking3D: React.FC<{at: V3; n?: number}> = ({at, n = 14}) => (
	<group position={at}>
		{[...Array(n)].map((_, i) => (
			<Box key={i} size={[0.42, 0.04, 0.3]} at={[Math.sin(i * 1.7) * 0.03, 0.02 + i * 0.042, Math.cos(i * 2.1) * 0.02]} rot={[0, Math.sin(i * 3.1) * 0.25, 0]} color={['#3FB7E8', '#E8453C', '#FFD84A', '#7CF2A0', '#C9A6FF'][i % 5]} outline={0.005} />
		))}
	</group>
);

export const Armchair3D: React.FC<{at: V3; rot?: number; color?: string}> = ({at, rot = 0, color = '#7A4A8A'}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<Box size={[1.0, 0.42, 0.85]} at={[0, 0.21, 0]} color={color} />
		<Box size={[0.9, 0.12, 0.7]} at={[0, 0.46, 0.04]} color={mix(color, '#FFFFFF', 0.2)} />
		<Box size={[1.0, 0.75, 0.22]} at={[0, 0.75, -0.32]} color={color} />
		{[-1, 1].map((s) => (
			<Box key={s} size={[0.18, 0.3, 0.85]} at={[s * 0.44, 0.55, 0]} color={color} />
		))}
	</group>
);

export const Fridge3D: React.FC<{at: V3; photo?: (ctx: CanvasRenderingContext2D, W: number, H: number) => void; photoKey?: string}> = ({at, photo, photoKey = ''}) => (
	<group position={at}>
		<Box size={[0.9, 2.0, 0.7]} at={[0, 1.0, 0]} color="#F2F4FA" />
		<Box size={[0.88, 0.02, 0.02]} at={[0, 1.3, 0.36]} color="#C9CED8" outline={0} />
		<Box size={[0.04, 0.4, 0.04]} at={[-0.36, 1.6, 0.37]} color="#8F96A8" outline={0.004} />
		{photo ? (
			<group position={[0.08, 1.62, 0.37]} rotation={[0, 0, -0.05]}>
				<CanvasPlane w={0.5} h={0.6} px={400} dep={photoKey} draw={photo} position={[0, 0, 0.005]} />
				{[[-0.2, 0.28], [0.2, 0.28], [0, -0.29]].map(([x, y], i) => (
					<T key={i} shape={{kind: 'cyl', r: 0.035, h: 0.02}} color={['#E8453C', '#FFD84A', '#3FB7E8'][i]} position={[x, y, 0.02]} rotation={[Math.PI / 2, 0, 0]} outline={0.004} />
				))}
			</group>
		) : null}
	</group>
);

export const Plate3D: React.FC<{at: V3; sausages?: number}> = ({at, sausages = 0}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.2, r2: 0.16, h: 0.03}} color="#FFFFFF" position={[0, 0.015, 0]} outline={0.006} />
		{[...Array(sausages)].map((_, i) => (
			<Sausage3D key={i} at={[0, 0.05, -0.06 + i * 0.07]} rot={[0, 0, 0]} />
		))}
	</group>
);

/** A sausage along x; `left` 0..1 is how much is still uneaten (bitten from the +x end). */
export const Sausage3D: React.FC<{at: V3; rot?: V3; left?: number}> = ({at, rot, left = 1}) => (
	<group position={at} rotation={rot}>
		{left > 0.02 ? (
			<group position={[-(1 - left) * 0.11, 0, 0]} scale={[Math.max(0.05, left), 1, 1]}>
				<T shape={{kind: 'capsule', r: 0.035, len: 0.16}} color="#A8583A" rotation={[0, 0, Math.PI / 2]} outline={0.006} />
			</group>
		) : null}
	</group>
);

export const DogBowl3D: React.FC<{at: V3; label?: boolean}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.2, r2: 0.24, h: 0.1}} color="#E8453C" position={[0, 0.05, 0]} outline={0.008} />
		<T shape={{kind: 'cyl', r: 0.16, h: 0.02}} color="#5A3A2A" position={[0, 0.095, 0]} outline={0} />
	</group>
);

/** An invisible dog: just its red collar and two little eyes, at dog height, facing +x. */
export const GhostDog3D: React.FC<{at: V3; rot?: number; frame: number; eyes?: number}> = ({at, rot = 0, frame, eyes = 1}) => {
	const blink = frame % 70 > 66;
	return (
		<group position={at} rotation={[0, rot, 0]}>
			<T shape={{kind: 'torus', r: 0.13, tube: 0.03}} color="#E8453C" position={[0.32, 0.62, 0]} rotation={[0, Math.PI / 2, 0.5]} outline={0.006} />
			<T shape={{kind: 'cyl', r: 0.04, h: 0.01}} color="#FFD84A" position={[0.36, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.003} />
			{eyes > 0
				? [-0.1, 0.1].map((z) => (
						<group key={z} position={[0.6, 0.8, z]} scale={[1, blink ? 0.15 : 1, 1]}>
							<T shape={{kind: 'sphere', r: 0.055}} color="#FFFFFF" outline={0.008} opacity={eyes} />
							<T shape={{kind: 'sphere', r: 0.033}} color="#140A28" position={[0.03, 0, 0]} outline={0} opacity={eyes} />
						</group>
					))
				: null}
		</group>
	);
};

export const Lockers3D: React.FC<{at: V3; n?: number}> = ({at, n = 14}) => {
	const colours = ['#3FB7E8', '#2EA0D8', '#3FB7E8', '#E8453C'];
	return (
		<group position={at}>
			{[...Array(n)].map((_, i) => (
				<group key={i} position={[(i - (n - 1) / 2) * 0.62, 0, 0]}>
					<Box size={[0.6, 1.9, 0.5]} at={[0, 0.95, 0]} color={colours[i % colours.length]} outline={0.012} />
					{[0, 1, 2].map((k) => (
						<Box key={k} size={[0.3, 0.025, 0.02]} at={[0, 1.6 - k * 0.06, 0.26]} color="#1E3A60" outline={0} />
					))}
					<Box size={[0.04, 0.14, 0.04]} at={[0.2, 1.0, 0.27]} color="#C9CED8" outline={0.004} />
				</group>
			))}
		</group>
	);
};

/** A coffee room's honesty box: a tin with a slot, and a price list. */
export const HonestyBox3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<Box size={[0.36, 0.26, 0.26]} at={[0, 0.13, 0]} color="#FFD84A" />
		<Box size={[0.16, 0.012, 0.03]} at={[0, 0.265, 0]} color="#140A28" outline={0} />
		<CanvasPlane w={0.3} h={0.12} px={300} dep="honesty" position={[0, 0.13, 0.135]} draw={(ctx, W, H) => {
			ctx.fillStyle = '#140A28';
			ctx.font = `bold ${H * 0.55}px Fredoka, sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('HONESTY BOX', W / 2, H / 2);
		}} />
	</group>
);

export const CoffeeMachine3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<Box size={[0.5, 0.65, 0.45]} at={[0, 0.325, 0]} color="#2A2350" />
		<Box size={[0.3, 0.04, 0.2]} at={[0, 0.1, 0.18]} color="#55597A" outline={0} />
		<T shape={{kind: 'cyl', r: 0.06, r2: 0.05, h: 0.1}} color="#FFFFFF" position={[0, 0.18, 0.2]} outline={0.005} />
		<Glow shape={{kind: 'sphere', r: 0.02}} color="#7CF2A0" position={[0.18, 0.55, 0.23]} />
	</group>
);

/** A poster above the honesty box: a row of flowers, or a pair of staring eyes. */
export const StudyPoster3D: React.FC<{at: V3; kind: 'eyes' | 'flowers'}> = ({at, kind}) => (
	<group position={at}>
		<Box size={[1.3, 0.62, 0.03]} at={[0, 0, 0]} color="#FFFFFF" outline={0.01} />
		<CanvasPlane w={1.2} h={0.52} px={600} dep={kind} position={[0, 0, 0.02]} draw={(ctx, W, H) => {
			ctx.fillStyle = kind === 'eyes' ? '#F6E8D6' : '#E8F6E0';
			ctx.fillRect(0, 0, W, H);
			if (kind === 'eyes') {
				for (const cx of [W * 0.3, W * 0.7]) {
					ctx.fillStyle = '#FFFFFF';
					ctx.beginPath();
					ctx.ellipse(cx, H * 0.5, W * 0.15, H * 0.26, 0, 0, Math.PI * 2);
					ctx.fill();
					ctx.lineWidth = 8;
					ctx.strokeStyle = '#140A28';
					ctx.stroke();
					ctx.fillStyle = '#5A3A2A';
					ctx.beginPath();
					ctx.arc(cx, H * 0.52, H * 0.17, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillStyle = '#140A28';
					ctx.beginPath();
					ctx.arc(cx, H * 0.52, H * 0.08, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillStyle = '#FFFFFF';
					ctx.beginPath();
					ctx.arc(cx + H * 0.06, H * 0.45, H * 0.035, 0, Math.PI * 2);
					ctx.fill();
					ctx.strokeStyle = '#3A2A1A';
					ctx.lineWidth = 12;
					ctx.beginPath();
					ctx.moveTo(cx - W * 0.13, H * 0.14);
					ctx.quadraticCurveTo(cx, H * 0.02, cx + W * 0.13, H * 0.12);
					ctx.stroke();
				}
			} else {
				const cols = ['#FF4FD8', '#FFD84A', '#E8453C', '#7F5AF0', '#FF8A3D'];
				for (let i = 0; i < 5; i++) {
					const cx = W * (0.12 + i * 0.19);
					ctx.strokeStyle = '#2EA86A';
					ctx.lineWidth = 8;
					ctx.beginPath();
					ctx.moveTo(cx, H * 0.95);
					ctx.lineTo(cx, H * 0.45);
					ctx.stroke();
					for (let k = 0; k < 6; k++) {
						const a = (k / 6) * Math.PI * 2;
						ctx.fillStyle = cols[i];
						ctx.beginPath();
						ctx.arc(cx + Math.cos(a) * H * 0.12, H * 0.38 + Math.sin(a) * H * 0.12, H * 0.09, 0, Math.PI * 2);
						ctx.fill();
					}
					ctx.fillStyle = '#FFE24A';
					ctx.beginPath();
					ctx.arc(cx, H * 0.38, H * 0.07, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}} />
	</group>
);

/** A whiteboard whose text is written out letter by letter. */
export const Whiteboard3D: React.FC<{at: V3; w?: number; text: string}> = ({at, w = 3.2, text}) => (
	<group position={at}>
		<Box size={[w + 0.12, 1.32, 0.06]} at={[0, 0, 0]} color="#C9CED8" />
		<CanvasPlane w={w} h={1.2} px={1024} dep={text} position={[0, 0, 0.035]} draw={(ctx, W, H) => {
			ctx.fillStyle = '#FBFCFF';
			ctx.fillRect(0, 0, W, H);
			ctx.fillStyle = '#E8453C';
			ctx.font = `bold ${H * 0.42}px Fredoka, sans-serif`;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			const full = 'HELLO';
			const wFull = ctx.measureText(full).width;
			ctx.save();
			ctx.translate(W / 2 - wFull / 2, H * 0.52);
			ctx.rotate(-0.04);
			ctx.fillText(text, 0, 0);
			ctx.restore();
		}} />
	</group>
);

/** A bathroom sink unit. */
export const Sink3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<Box size={[1.4, 0.85, 0.55]} at={[0, 0.425, 0]} color="#F2F4FA" />
		<T shape={{kind: 'cyl', r: 0.26, r2: 0.2, h: 0.12}} color="#FFFFFF" position={[0, 0.86, 0.02]} outline={0.008} />
		<T shape={{kind: 'cyl', r: 0.02, h: 0.24}} color="#C9CED8" position={[0, 1.0, -0.2]} outline={0.005} />
		<T shape={{kind: 'cyl', r: 0.018, h: 0.16}} color="#C9CED8" position={[0, 1.1, -0.13]} rotation={[Math.PI / 2, 0, 0]} outline={0.005} />
		<T shape={{kind: 'cyl', r: 0.05, h: 0.14}} color="#7CF2A0" position={[0.5, 0.92, -0.1]} outline={0.006} />
	</group>
);
