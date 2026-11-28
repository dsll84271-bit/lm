import React from 'react';
import * as THREE from 'three';
import {Many, rnd, type Copy} from './many';
import {CanvasPlane, RayPath} from './props3d2';
import {Box} from './sets3d';
import {Glow, INK, T, toonRamp} from './toon';

// Props for Episode 6 (the five-leaf grimoire): the black spell book, the
// black sword, clovers (one, a field, the 63-leaf record), smoke, lightning,
// an airliner, a desk fan, a banana, a football, scales and a calculator.

type V3 = [number, number, number];
const deg = (d: number) => (d * Math.PI) / 180;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export const BOOK = {cover: '#221E2C', edge: '#3A3348', gold: '#E0B04A', page: '#F4E8C8', leaf: '#4A4060', ink: '#17121F'};

// ---------------------------------------------------------------- smoke

/** Black wisps curling up from a point; `amount` 0..1, `r` how wide. */
export const Smoke: React.FC<{at: V3; frame: number; amount?: number; r?: number; n?: number; rise?: number; seed?: number; color?: string}> = ({at, frame, amount = 1, r = 0.3, n = 12, rise = 0.9, seed = 0, color = '#1E1828'}) => {
	if (amount <= 0.01) {
		return null;
	}
	const puffs: React.ReactNode[] = [];
	for (let i = 0; i < n; i++) {
		const ph = (frame * 0.012 * (0.8 + rnd(i + seed) * 0.5) + i / n) % 1;
		const a = rnd(i * 3.7 + seed) * Math.PI * 2 + ph * 2.4;
		const d = r * (0.4 + ph * 0.8);
		const size = r * 0.3 * (1 - ph * 0.75) * amount;
		puffs.push(
			<T key={i} shape={{kind: 'sphere', r: 1, seg: 12}} scale={[size, size * 1.9, size]} color={i % 3 === 0 ? '#3A2A58' : color} position={[Math.cos(a) * d, ph * rise * (r / 0.3), Math.sin(a) * d]} rotation={[0, 0, Math.sin(a + ph * 3) * 0.5]} outline={0.1} opacity={0.9 * (1 - ph * ph)} shadow={false} />,
		);
	}
	return <group position={at}>{puffs}</group>;
};

// ---------------------------------------------------------------- clovers

const leafletG = () => {
	const a = new THREE.SphereGeometry(1, 10, 7);
	a.scale(0.75, 0.16, 0.5);
	a.rotateY(0.5);
	a.translate(1.1, 0, 0.48);
	const b = new THREE.SphereGeometry(1, 10, 7);
	b.scale(0.75, 0.16, 0.5);
	b.rotateY(-0.5);
	b.translate(1.1, 0, -0.48);
	const pa = a.attributes.position.array as Float32Array;
	const pb = b.attributes.position.array as Float32Array;
	const g = new THREE.BufferGeometry();
	const pos = new Float32Array(pa.length + pb.length);
	pos.set(pa, 0);
	pos.set(pb, pa.length);
	const ia = a.index!.array;
	const ib = b.index!.array;
	const idx = new Uint32Array(ia.length + ib.length);
	idx.set(ia, 0);
	for (let i = 0; i < ib.length; i++) {
		idx[ia.length + i] = ib[i] + pa.length / 3;
	}
	g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	g.setIndex(new THREE.BufferAttribute(idx, 1));
	g.computeVertexNormals();
	return g;
};

/** A single clover: `n` heart leaflets on a stem, leaf length about `s`. Several rings for big counts (the 63-leaf record). */
export const Clover3D: React.FC<{at: V3; n?: number; s?: number; rot?: V3; color?: string; stem?: number; glow?: number}> = ({at, n = 3, s = 0.1, rot, color = '#4FB05A', stem = 1, glow = 0}) => {
	const items: Copy[] = [];
	let left = n;
	let ring = 0;
	while (left > 0) {
		const k = Math.min(left, ring === 0 ? Math.min(n, 8) : 8 + ring * 5);
		const sz = (s / 1.85) * (n > 5 ? 1 + ring * 0.12 : 1);
		for (let i = 0; i < k; i++) {
			items.push({p: [0, -ring * s * 0.1, 0], s: [sz, sz, sz * (n === 3 ? 1 : n === 4 ? 0.85 : 0.7)], r: [0, (i / k) * Math.PI * 2 + ring * 0.37, deg(8 + ring * 7)], c: ring % 2 ? '#5CC468' : color});
		}
		left -= k;
		ring += 1;
	}
	return (
		<group position={at} rotation={rot}>
			{stem > 0 ? <T shape={{kind: 'cyl', r: s * 0.05, h: s * 2 * stem}} color="#3E9A4A" position={[0, -s * stem, 0]} outline={0.004} /> : null}
			{glow > 0 ? <Glow shape={{kind: 'sphere', r: s * 1.6}} color="#FFE07A" opacity={0.3 * glow} /> : null}
			<Many kind={`one-clover-${n}`} geom={leafletG} items={items} outline={0.1} />
		</group>
	);
};

/** A patch of clover around (0, 0): many three-leaf clovers in one draw call. `skip` keeps a circle clear. */
export const CloverField: React.FC<{size?: number; n?: number; s?: number; seed?: number; skip?: Array<[number, number, number]>; center?: [number, number]}> = ({size = 14, n = 900, s = 0.1, seed = 0, skip = [], center = [0, 0]}) => {
	const items: Copy[] = [];
	const greens = ['#3E9E4C', '#4FB05A', '#35904A', '#58BC62', '#2F8A42'];
	for (let i = 0; i < n; i++) {
		const x = center[0] + (rnd(i * 1.7 + seed) - 0.5) * size;
		const z = center[1] + (rnd(i * 2.3 + seed + 5) - 0.5) * size;
		if (skip.some(([sx, sz, sr]) => Math.hypot(x - sx, z - sz) < sr)) {
			continue;
		}
		const k = s * (0.75 + rnd(i * 4.1) * 0.6);
		const y = 0.03 + rnd(i * 5.3) * 0.08;
		const a0 = rnd(i * 6.1) * Math.PI * 2;
		const c = greens[i % greens.length];
		for (let j = 0; j < 3; j++) {
			const a = a0 + (j / 3) * Math.PI * 2;
			items.push({p: [x, y, z], s: [k * 0.5, k * 0.5, k * 0.5], r: [0, a, deg(14)], c});
		}
	}
	return <Many kind={`clover${seed}`} geom={leafletG} items={items} outline={0.12} />;
};

// ---------------------------------------------------------------- the grimoire

/** Draws five heart leaflets (a five-leaf clover) on a canvas, ink outline first, then the fill. */
export const drawClover = (ctx: CanvasRenderingContext2D, cx: number, cy: number, L: number, n: number, fill: string, ink: string, line: number, vein?: string) => {
	const parts = (pass: 'line' | 'fill') => {
		for (let i = 0; i < n; i++) {
			const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(a);
			ctx.beginPath();
			ctx.moveTo(L * 0.05, 0);
			ctx.lineTo(L * 0.62, -L * 0.36);
			ctx.lineTo(L * 0.62, L * 0.36);
			ctx.closePath();
			for (const sd of [-1, 1]) {
				ctx.moveTo(L * 0.66 + L * 0.22, sd * L * 0.2);
				ctx.arc(L * 0.66, sd * L * 0.2, L * 0.22, 0, Math.PI * 2);
			}
			if (pass === 'line') {
				ctx.lineWidth = line * 2;
				ctx.strokeStyle = ink;
				ctx.lineJoin = 'round';
				ctx.stroke();
			} else {
				ctx.fillStyle = fill;
				ctx.fill();
				if (vein) {
					ctx.beginPath();
					ctx.moveTo(L * 0.12, 0);
					ctx.lineTo(L * 0.62, 0);
					ctx.strokeStyle = vein;
					ctx.lineWidth = line * 0.6;
					ctx.stroke();
				}
			}
			ctx.restore();
		}
	};
	parts('line');
	parts('fill');
};

/** The emblem on the cover: a five-leaf clover inside a gold ring. Faces +z. */
const Emblem: React.FC<{s: number; glow: number}> = ({s, glow}) => (
	<group>
		<T shape={{kind: 'torus', r: s * 0.95, tube: s * 0.06}} color={BOOK.gold} outline={0.004} />
		<CanvasPlane
			w={s * 1.84}
			h={s * 1.84}
			px={512}
			dep={`emblem${glow > 0 ? 1 : 0}`}
			position={[0, 0, 0.002]}
			draw={(ctx, W, H) => {
				ctx.fillStyle = glow > 0 ? '#3A2E5A' : '#2A2438';
				ctx.beginPath();
				ctx.arc(W / 2, H / 2, W * 0.49, 0, Math.PI * 2);
				ctx.fill();
				drawClover(ctx, W / 2, H / 2, W * 0.42, 5, glow > 0 ? '#9A86E8' : '#6A5A96', '#120C1C', W * 0.014, glow > 0 ? '#E0D4FF' : '#8A7AB8');
				ctx.fillStyle = BOOK.gold;
				ctx.beginPath();
				ctx.arc(W / 2, H / 2, W * 0.045, 0, Math.PI * 2);
				ctx.fill();
			}}
		/>
		{glow > 0 ? <Glow shape={{kind: 'cyl', r: s * 1.1, h: 0.002}} color="#B89AFF" rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.003]} opacity={0.4 * glow} /> : null}
	</group>
);

/** A page lying on the right-hand page block (faces +z), with a sword drawn on it up to `ink`. */
const SwordSketch: React.FC<{w: number; h: number; ink: number; glow: number}> = ({w, h, ink, glow}) => {
	const k = clamp(ink);
	if (k <= 0) {
		return null;
	}
	const len = h * 0.84 * k;
	return (
		<group position={[0, -h * 0.4, 0.002]}>
			<Box size={[w * 0.06, Math.min(len, h * 0.16), 0.002]} at={[0, Math.min(len, h * 0.16) / 2, 0]} color="#5A2A2E" outline={0} />
			{k > 0.2 ? <Box size={[w * 0.5, h * 0.04, 0.002]} at={[0, h * 0.17, 0]} color={BOOK.ink} outline={0} /> : null}
			{len > h * 0.19 ? <Box size={[w * 0.22, len - h * 0.19, 0.002]} at={[0, h * 0.19 + (len - h * 0.19) / 2, 0]} color={BOOK.ink} outline={0} /> : null}
			{glow > 0 ? <Glow shape={{kind: 'box', w: w * 0.26, h: len + 0.02, d: 0.001}} color="#9A7AFF" position={[0, len / 2, -0.0005]} opacity={0.5 * glow} /> : null}
		</group>
	);
};

/**
 * The grimoire, standing up with its front cover facing +z (spine on the left,
 * x = -w/2). `open` 0 = shut, 1 = flat open; `riffle` = how many pages have
 * flipped over (fractions are pages mid-turn); `ink` draws the sword on the
 * right page; `glow` lights the clover.
 */
export const Grimoire3D: React.FC<{at: V3; rot?: V3; s?: number; open?: number; riffle?: number; ink?: number; glow?: number; frame: number; smoke?: number; shadow?: boolean}> = ({at, rot, s = 1, open = 0, riffle = 0, ink = 0, glow = 0, frame, smoke = 1, shadow = true}) => {
	const w = 0.42;
	const h = 0.56;
	const d = 0.14;
	const c = 0.025; // cover thickness
	const a = clamp(open) * Math.PI;
	const pages = 6;
	return (
		<group position={at} rotation={rot} scale={s}>
			{/* back cover and page block */}
			<T shape={{kind: 'box', w, h, d: c}} color={BOOK.cover} position={[0, 0, -d / 2 + c / 2]} outline={0.01} shadow={shadow} />
			<T shape={{kind: 'box', w: w - 0.03, h: h - 0.04, d: d - 2 * c}} color={BOOK.page} position={[0.01, 0, 0]} outline={0.006} shadow={shadow} />
			<Box size={[0.003, h - 0.05, d - 2 * c - 0.01]} at={[w / 2 - 0.004, 0, 0]} color="#D8C8A0" outline={0} />
			<T shape={{kind: 'box', w: 0.035, h, d}} color={BOOK.edge} position={[-w / 2, 0, 0]} outline={0.01} shadow={shadow} />
			{[-1, 1].map((y) => (
				<Box key={y} size={[0.04, 0.03, d + 0.01]} at={[-w / 2, y * h * 0.32, 0]} color={BOOK.gold} outline={0.004} />
			))}
			{/* the sword sketch on the first page of the block */}
			<group position={[0.01, 0, d / 2 - c + 0.001]}>
				<SwordSketch w={w - 0.03} h={h - 0.04} ink={ink} glow={glow} />
			</group>
			{/* pages turning */}
			{riffle > 0
				? [...Array(pages)].map((_, i) => {
						const t = clamp(riffle - i);
						if (t <= 0 || t >= 1) {
							return null;
						}
						return (
							<group key={i} position={[-w / 2 + 0.02, 0, d / 2 - c]} rotation={[0, -t * Math.PI, 0]}>
								<Box size={[w - 0.04, h - 0.05, 0.003]} at={[(w - 0.04) / 2, 0, 0]} color={BOOK.page} outline={0.003} />
							</group>
						);
					})
				: null}
			{/* front cover, hinged on the spine */}
			<group position={[-w / 2, 0, d / 2 - c / 2]} rotation={[0, -a, 0]}>
				<group position={[w / 2, 0, 0]}>
					<T shape={{kind: 'box', w, h, d: c}} color={BOOK.cover} outline={0.01} shadow={shadow} />
					{/* the inside of the cover: a pasted-down page */}
					<Box size={[w - 0.04, h - 0.05, 0.004]} at={[0, 0, -c / 2 - 0.002]} color="#EADBB4" outline={0} />
					{/* gold corners */}
					{[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, y]) => (
						<group key={`${x}${y}`} position={[x * (w / 2 - 0.035), y * (h / 2 - 0.035), c / 2 + 0.002]} rotation={[0, 0, Math.PI / 4]}>
							<Box size={[0.06, 0.06, 0.008]} at={[0, 0, 0]} color={BOOK.gold} outline={0.003} />
						</group>
					))}
					<group position={[0, 0.02, c / 2 + 0.006]}>
						<Emblem s={0.15} glow={glow} />
					</group>
					<Box size={[w * 0.7, 0.012, 0.004]} at={[0, -h * 0.36, c / 2 + 0.002]} color={BOOK.gold} outline={0} />
				</group>
			</group>
			<Smoke at={[-w * 0.45, -h * 0.1, -0.08]} frame={frame} amount={smoke} r={0.12} rise={0.7} n={7} />
			<Smoke at={[w * 0.45, -h * 0.1, -0.08]} frame={frame} amount={smoke} r={0.12} rise={0.7} n={7} seed={3} />
			<Smoke at={[0, h * 0.3, -0.1]} frame={frame} amount={smoke} r={0.14} rise={0.6} n={8} seed={7} />
		</group>
	);
};

// ---------------------------------------------------------------- the sword

/**
 * The black sword. The grip is at the origin; the blade points along +y. About
 * 1.6 long at s = 1 (nearly as tall as you).
 */
export const Sword3D: React.FC<{at: V3; rot?: V3; s?: number; frame?: number; smoke?: number; glow?: number}> = ({at, rot, s = 1, frame = 0, smoke = 0, glow = 0}) => {
	const blade = 1.18;
	const bw = 0.24;
	const bt = 0.035;
	const b0 = 0.1;
	return (
		<group position={at} rotation={rot} scale={s}>
			{/* grip, wrapped */}
			<T shape={{kind: 'cyl', r: 0.034, h: 0.34}} color="#4A2A2E" position={[0, -0.12, 0]} outline={0.008} />
			{[-0.24, -0.16, -0.08, 0].map((y) => (
				<T key={y} shape={{kind: 'torus', r: 0.035, tube: 0.008}} color="#2A1A20" position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0} />
			))}
			<T shape={{kind: 'sphere', r: 0.055}} color="#B8903A" position={[0, -0.32, 0]} outline={0.008} />
			{/* crossguard */}
			<T shape={{kind: 'box', w: 0.44, h: 0.07, d: 0.09}} color="#2E2A3A" position={[0, 0.07, 0]} outline={0.01} />
			{[-1, 1].map((x) => (
				<T key={x} shape={{kind: 'box', w: 0.06, h: 0.12, d: 0.1}} color="#3A3448" position={[x * 0.23, 0.08, 0]} outline={0.008} />
			))}
			{/* blade */}
			<T shape={{kind: 'box', w: bw, h: blade, d: bt}} color="#26232E" position={[0, b0 + blade / 2, 0]} outline={0.012} />
			{[-1, 1].map((x) => (
				<Box key={x} size={[0.03, blade - 0.04, bt + 0.004]} at={[x * (bw / 2 - 0.018), b0 + blade / 2, 0]} color="#4A4558" outline={0} />
			))}
			{/* the tip: a squashed four-sided cone */}
			<T shape={{kind: 'cone', r: bw * 0.71, h: 0.26}} scale={[1, 1, bt / (bw * 0.71)]} color="#26232E" position={[0, b0 + blade + 0.13, 0]} rotation={[0, Math.PI / 4, 0]} outline={0.012} />
			{/* chips out of the edges and a crack */}
			{[[1, 0.45], [-1, 0.78], [1, 1.02], [-1, 0.3]].map(([x, y], i) => (
				<group key={i} position={[x * (bw / 2 + 0.004), b0 + y, 0]} rotation={[0, 0, Math.PI / 4]}>
					<Box size={[0.05, 0.05, bt + 0.01]} at={[0, 0, 0]} color="#0E0A16" outline={0} />
				</group>
			))}
			<Box size={[0.012, 0.32, bt + 0.004]} at={[0.03, b0 + 0.62, 0]} color="#5A5468" outline={0} rot={[0, 0, 0.2]} />
			{glow > 0 ? <Glow shape={{kind: 'box', w: bw + 0.12, h: blade + 0.3, d: 0.01}} color="#8A6AFF" position={[0, b0 + blade / 2 + 0.05, 0]} opacity={0.3 * glow} /> : null}
			{smoke > 0 ? (
				<group>
					<Smoke at={[0, b0 + 0.3, 0]} frame={frame} amount={smoke} r={0.2} rise={0.5} n={6} seed={1} />
					<Smoke at={[0, b0 + 0.85, 0]} frame={frame} amount={smoke} r={0.2} rise={0.5} n={6} seed={4} />
				</group>
			) : null}
		</group>
	);
};

// ---------------------------------------------------------------- lightning

const jag = (from: V3, to: V3, seed: number, n = 9, wiggle = 0.6): V3[] => {
	const pts: V3[] = [from];
	for (let i = 1; i < n; i++) {
		const t = i / n;
		pts.push([from[0] + (to[0] - from[0]) * t + (rnd(seed + i * 3.1) - 0.5) * wiggle * 2, from[1] + (to[1] - from[1]) * t, from[2] + (to[2] - from[2]) * t + (rnd(seed + i * 5.7) - 0.5) * wiggle]);
	}
	pts.push(to);
	return pts;
};

/** A lightning bolt from `from` to `to`, drawn down to fraction `p`, with forks. `fade` 0..1 dims it. */
export const Bolt3D: React.FC<{from: V3; to: V3; p?: number; seed?: number; fade?: number; r?: number; color?: string}> = ({from, to, p = 1, seed = 1, fade = 0, r = 0.1, color = '#F6F2FF'}) => {
	if (fade >= 1) {
		return null;
	}
	const main = jag(from, to, seed, 10, Math.abs(from[1] - to[1]) * 0.05);
	const forks = [3, 5, 7].map((k, i) => {
		const a = main[k];
		const b: V3 = [a[0] + (rnd(seed + i * 9) - 0.5) * 3, a[1] - (from[1] - to[1]) * 0.15, a[2] + (rnd(seed + i * 11) - 0.5) * 1.5];
		return jag(a, b, seed + 40 + i * 13, 4, 0.3);
	});
	const op = 1 - fade;
	return (
		<group>
			<RayPath pts={main} p={p} r={r * 4} color="#A898FF" opacity={0.3 * op} />
			<RayPath pts={main} p={p} r={r} color={color} opacity={op} />
			{forks.map((f, i) => (p > 0.3 + i * 0.15 ? <RayPath key={i} pts={f} p={Math.min(1, (p - 0.3 - i * 0.15) * 3)} r={r * 0.55} color={color} opacity={0.85 * op} /> : null))}
		</group>
	);
};

/** Black shards and a purple flash bursting out from a point (anti-magic cancelling something). `t` 0..1. */
export const Burst3D: React.FC<{at: V3; t: number; n?: number; r?: number; seed?: number}> = ({at, t, n = 22, r = 2.2, seed = 0}) => {
	if (t <= 0 || t >= 1) {
		return null;
	}
	const e = 1 - (1 - t) * (1 - t);
	return (
		<group position={at}>
			<Glow shape={{kind: 'sphere', r: 0.5 + e * r * 0.5}} color="#C8B8FF" opacity={0.6 * (1 - t)} />
			<Glow shape={{kind: 'sphere', r: 0.2 + e * 0.4}} color="#FFFFFF" opacity={0.9 * (1 - t) * (1 - t)} />
			{[...Array(n)].map((_, i) => {
				const a = rnd(i * 2.1 + seed) * Math.PI * 2;
				const b = (rnd(i * 3.9 + seed) - 0.3) * 1.6;
				const d = e * r * (0.5 + rnd(i * 1.3 + seed) * 0.8);
				const k = 0.1 * (1 - t * 0.7);
				return (
					<group key={i} position={[Math.cos(a) * Math.cos(b) * d, Math.sin(b) * d, Math.sin(a) * Math.cos(b) * d]} rotation={[a, b, t * 6 + i]}>
						<T shape={{kind: 'box', w: 1, h: 1, d: 0.3}} scale={k} color={i % 4 === 0 ? '#5A3A9A' : '#120C1C'} outline={0.15} shadow={false} />
					</group>
				);
			})}
		</group>
	);
};

// ---------------------------------------------------------------- an airliner

/** A passenger jet flying along +x, nose at +x. About 12 long at s = 1. */
export const Airliner3D: React.FC<{at: V3; rot?: V3; s?: number; skin?: number}> = ({at, rot, s = 1, skin = 0}) => {
	const body = skin > 0 ? '#F2F0FF' : '#E8ECF4';
	return (
		<group position={at} rotation={rot} scale={s}>
			<T shape={{kind: 'capsule', r: 0.75, len: 10}} color={body} rotation={[0, 0, Math.PI / 2]} outline={0.04} />
			<T shape={{kind: 'box', w: 2.2, h: 0.14, d: 12}} color="#C8D0DC" position={[0.2, -0.3, 0]} rotation={[0, 0.35, 0]} outline={0.03} />
			<T shape={{kind: 'box', w: 1.2, h: 0.1, d: 4.2}} color="#C8D0DC" position={[-5.1, 0.2, 0]} rotation={[0, 0.3, 0]} outline={0.025} />
			<T shape={{kind: 'box', w: 1.6, h: 2.2, d: 0.12}} color="#2E5AA8" position={[-5.2, 1.5, 0]} rotation={[0, 0, -0.4]} outline={0.025} />
			{[-1, 1].map((z) => (
				<T key={z} shape={{kind: 'capsule', r: 0.32, len: 0.9}} color="#AEB8C8" position={[0.7, -0.75, z * 2.6]} rotation={[0, 0, Math.PI / 2]} outline={0.02} />
			))}
			{[...Array(14)].map((_, i) => (
				<Glow key={i} shape={{kind: 'box', w: 0.22, h: 0.22, d: 0.02}} color="#FFE9A8" position={[3.6 - i * 0.6, 0.18, 0.74]} />
			))}
			<Box size={[11, 0.12, 1.52]} at={[-0.2, -0.15, 0]} color="#2E5AA8" outline={0} />
			{skin > 0 ? <Glow shape={{kind: 'capsule', r: 0.82, len: 10}} color="#C8C0FF" rotation={[0, 0, Math.PI / 2]} opacity={0.35 * skin} /> : null}
		</group>
	);
};

// ---------------------------------------------------------------- small things

/** A desk fan facing +z; `spin` is the blade angle in radians, `on` shows a blur disc while it spins. */
export const DeskFan3D: React.FC<{at: V3; rot?: number; spin: number; on?: number}> = ({at, rot = 0, spin, on = 1}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<T shape={{kind: 'cyl', r: 0.14, h: 0.04}} color="#F2F2F2" position={[0, 0.02, 0]} outline={0.006} />
		<T shape={{kind: 'cyl', r: 0.02, h: 0.3}} color="#F2F2F2" position={[0, 0.17, 0]} outline={0.005} />
		<group position={[0, 0.36, 0.02]}>
			<T shape={{kind: 'torus', r: 0.17, tube: 0.01}} color="#BFE3FA" outline={0.004} />
			<T shape={{kind: 'sphere', r: 0.045}} color="#3FB7E8" outline={0.005} />
			<group rotation={[0, 0, spin]}>
				{[0, 1, 2].map((i) => (
					<group key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]}>
						<T shape={{kind: 'box', w: 0.06, h: 0.14, d: 0.01}} color="#7FD0F2" position={[0, 0.09, 0]} rotation={[0.3, 0, 0]} outline={0.004} />
					</group>
				))}
			</group>
			{on > 0.5 ? <Glow shape={{kind: 'cyl', r: 0.16, h: 0.005}} color="#DFF4FF" rotation={[Math.PI / 2, 0, 0]} opacity={0.25} /> : null}
		</group>
	</group>
);

const bananaGeom = (extra: number) => {
	const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.32, 0.16, 0), new THREE.Vector3(0, -0.12, 0), new THREE.Vector3(0.32, 0.16, 0));
	const g = new THREE.TubeGeometry(curve, 24, 1, 10, false);
	const pos = g.attributes.position;
	const c = new THREE.Vector3();
	// Taper the tube: thick in the middle, thin at the ends.
	for (let i = 0; i <= 24; i++) {
		const t = i / 24;
		curve.getPoint(t, c);
		const r = 0.055 * Math.sin(Math.PI * (0.08 + t * 0.84)) + extra;
		for (let j = 0; j <= 10; j++) {
			const k = i * 11 + j;
			const x = pos.getX(k);
			const y = pos.getY(k);
			const z = pos.getZ(k);
			const d = Math.hypot(x - c.x, y - c.y, z - c.z) || 1;
			pos.setXYZ(k, c.x + ((x - c.x) / d) * r, c.y + ((y - c.y) / d) * r, c.z + ((z - c.z) / d) * r);
		}
	}
	g.computeVertexNormals();
	return g;
};

/** A banana lying on its side, curved, along x. */
export const Banana3D: React.FC<{at: V3; rot?: V3; s?: number}> = ({at, rot, s = 1}) => {
	const body = React.useMemo(() => bananaGeom(0), []);
	const line = React.useMemo(() => bananaGeom(0.008), []);
	return (
		<group position={at} rotation={rot} scale={s}>
			<mesh geometry={body} castShadow receiveShadow>
				<meshToonMaterial color="#FFD84A" gradientMap={toonRamp()} />
			</mesh>
			<mesh geometry={line}>
				<meshBasicMaterial color={INK} side={THREE.BackSide} />
			</mesh>
			{[-1, 1].map((x) => (
				<T key={x} shape={{kind: 'cyl', r: 0.012, h: 0.05}} color="#6A4A2A" position={[x * 0.33, 0.17, 0]} rotation={[0, 0, -x * 1.0]} outline={0.003} />
			))}
		</group>
	);
};

/** A football. */
export const Ball3D: React.FC<{at: V3; spin?: number; r?: number}> = ({at, spin = 0, r = 0.11}) => (
	<group position={at} rotation={[spin, spin * 0.6, 0]}>
		<T shape={{kind: 'sphere', r}} color="#FFFFFF" outline={0.008} />
		{[[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]].map((v, i) => (
			<T key={i} shape={{kind: 'sphere', r: r * 0.36}} color="#2A2638" position={[v[0] * r * 0.82, v[1] * r * 0.82, v[2] * r * 0.82]} outline={0} />
		))}
	</group>
);

/** A floor scale with a dial; `squash` 0..1 crumples it. */
export const Scale3D: React.FC<{at: V3; w?: number; squash?: number; needle?: number}> = ({at, w = 0.7, squash = 0, needle = 0}) => (
	<group position={at} scale={[1 + squash * 0.25, 1 - squash * 0.6, 1 + squash * 0.25]}>
		<T shape={{kind: 'box', w, h: 0.12, d: w * 0.8}} color="#F2F2F2" position={[0, 0.06, 0]} outline={0.01} />
		<group position={[0, 0.13, w * 0.28]}>
			<T shape={{kind: 'cyl', r: w * 0.14, h: 0.02}} color="#FFFFFF" outline={0.006} />
			<Box size={[0.012, 0.012, w * 0.12]} at={[Math.sin(needle) * w * 0.05, 0.015, -Math.cos(needle) * w * 0.05]} color="#E8453C" outline={0} rot={[0, -needle, 0]} />
		</group>
	</group>
);

/** A pocket calculator (held flat), facing +z. */
export const Calculator3D: React.FC<{at: V3; rot?: V3; s?: number}> = ({at, rot, s = 1}) => (
	<group position={at} rotation={rot} scale={s}>
		<T shape={{kind: 'box', w: 0.16, h: 0.24, d: 0.025}} color="#3A3448" outline={0.005} />
		<Glow shape={{kind: 'box', w: 0.12, h: 0.05, d: 0.004}} color="#BFF2C8" position={[0, 0.075, 0.014]} />
		{[...Array(12)].map((_, i) => (
			<Box key={i} size={[0.026, 0.022, 0.006]} at={[-0.04 + (i % 3) * 0.04, 0.02 - Math.floor(i / 3) * 0.032, 0.015]} color={i === 11 ? '#FF8A3D' : '#C9CED8'} outline={0} />
		))}
	</group>
);

/** A sports training cone. */
export const Cone3D: React.FC<{at: V3; s?: number}> = ({at, s = 1}) => (
	<group position={at} scale={s}>
		<T shape={{kind: 'cone', r: 0.12, h: 0.3}} color="#FF8A3D" position={[0, 0.15, 0]} outline={0.008} />
		<T shape={{kind: 'box', w: 0.26, h: 0.02, d: 0.26}} color="#FF8A3D" position={[0, 0.01, 0]} outline={0.006} />
	</group>
);
