import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Many, rnd, type Copy} from './many';
import {Glow, INK, T, toonRamp} from './toon';

// Episode 7's sea: whales (blue, humpback, sperm) built from smooth bodies
// that bend as they swim, a giant squid, krill, fish, the underwater world
// seen from inside it, a dive boat, a kayak, bubbles, a dive torch and an
// underwater camera. Units are metres (the hero is 1.7 tall). Every creature
// faces +z when rot = 0.

type V3 = [number, number, number];

// ---------------------------------------------------------------- smooth bodies

/** A smooth curve through [t, value] points (t rising from 0 to 1). */
const curve = (pts: Array<[number, number]>) => (t: number) => {
	if (t <= pts[0][0]) {
		return pts[0][1];
	}
	for (let i = 1; i < pts.length; i++) {
		if (t <= pts[i][0]) {
			const [t0, v0] = pts[i - 1];
			const [t1, v1] = pts[i];
			const u = (t - t0) / (t1 - t0);
			const s = u * u * (3 - 2 * u);
			return v0 + (v1 - v0) * s;
		}
	}
	return pts[pts.length - 1][1];
};

/**
 * A body of revolution along z (t = 0 at the tail, 1 at the nose, length 1),
 * with an oval (or boxy, p < 1) cross-section. a0..a1 is the slice of the ring
 * that's built (all of it, or the top or bottom half of a jaw, closed by a flat lid).
 */
type BodySpec = {
	r: (t: number) => number;
	w?: (t: number) => number;
	h?: (t: number) => number;
	p?: (t: number) => number;
	t0?: number;
	t1?: number;
	a0?: number;
	a1?: number;
	n?: number;
	m?: number;
	color: (t: number, a: number) => string;
	lid?: string;
	/** Extra roundness downwards (a throat pouch filling up), 0..1. */
	pouch?: number;
};

const ringPoint = (s: BodySpec, t: number, a: number, grow: number, bend: (t: number) => number): V3 => {
	const r = s.r(t);
	const w = s.w ? s.w(t) : 1;
	const h = s.h ? s.h(t) : 1;
	const p = s.p ? s.p(t) : 1;
	const c = Math.cos(a);
	const sn = Math.sin(a);
	const cx = Math.sign(c) * Math.pow(Math.abs(c), p);
	const sy = Math.sign(sn) * Math.pow(Math.abs(sn), p);
	const pouch = s.pouch && sn < 0 ? 1 + s.pouch * 2.4 * Math.pow(-sn, 1.5) * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - (s.t0 ?? 0)) / ((s.t1 ?? 1) - (s.t0 ?? 0))))) : 1;
	return [(r * w + grow) * cx, bend(t) + (r * h * pouch + grow) * sy, t];
};

/** Builds the body (and a slightly fatter copy for the ink outline). */
const makeBody = (s: BodySpec, grow: number) => {
	const n = s.n ?? 64;
	const m = s.m ?? 40;
	const t0 = s.t0 ?? 0;
	const t1 = s.t1 ?? 1;
	const a0 = s.a0 ?? 0;
	const a1 = s.a1 ?? Math.PI * 2;
	const full = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6;
	const cols = full ? m : m + 1;
	const verts = (n + 1) * cols + (s.lid ? (n + 1) * 2 : 0);
	const pos = new Float32Array(verts * 3);
	const col = new Float32Array(verts * 3);
	const idx: number[] = [];
	const c = new THREE.Color();
	for (let i = 0; i <= n; i++) {
		const t = t0 + ((t1 - t0) * i) / n;
		for (let j = 0; j < cols; j++) {
			const a = a0 + ((a1 - a0) * j) / m;
			c.set(s.color(t, a));
			col.set([c.r, c.g, c.b], (i * cols + j) * 3);
		}
	}
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			const a = i * cols + j;
			const b = i * cols + (full ? (j + 1) % m : j + 1);
			const cc = (i + 1) * cols + j;
			const d = (i + 1) * cols + (full ? (j + 1) % m : j + 1);
			idx.push(a, b, cc, b, d, cc);
		}
	}
	if (s.lid) {
		const base = (n + 1) * cols;
		c.set(s.lid);
		for (let i = 0; i <= n; i++) {
			col.set([c.r, c.g, c.b], (base + i * 2) * 3);
			col.set([c.r, c.g, c.b], (base + i * 2 + 1) * 3);
		}
		for (let i = 0; i < n; i++) {
			const a = base + i * 2;
			idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
		}
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	g.setAttribute('color', new THREE.BufferAttribute(col, 3));
	g.setIndex(idx);
	return {g, n, m, cols, full, t0, t1, a0, a1, grow};
};

type Body = ReturnType<typeof makeBody>;

/** Moves the body's points for this frame's bend. */
const shapeBody = (b: Body, s: BodySpec, bend: (t: number) => number, stretch = 0) => {
	const pos = b.g.attributes.position.array as Float32Array;
	const span = b.t1 - b.t0;
	for (let i = 0; i <= b.n; i++) {
		const t = b.t0 + (span * i) / b.n;
		// The outline copy reaches a little past each end.
		const z = stretch ? b.t0 - stretch + (t - b.t0) * (1 + (2 * stretch) / span) : t;
		for (let j = 0; j < b.cols; j++) {
			const a = b.a0 + ((b.a1 - b.a0) * j) / b.m;
			const p = ringPoint(s, t, a, b.grow, bend);
			pos.set([p[0], p[1], z], (i * b.cols + j) * 3);
		}
	}
	if (s.lid) {
		const base = (b.n + 1) * b.cols;
		for (let i = 0; i <= b.n; i++) {
			const t = b.t0 + (span * i) / b.n;
			const z = stretch ? b.t0 - stretch + (t - b.t0) * (1 + (2 * stretch) / span) : t;
			const p0 = ringPoint(s, t, b.a0, b.grow, bend);
			const p1 = ringPoint(s, t, b.a1, b.grow, bend);
			pos.set([p0[0], p0[1], z], (base + i * 2) * 3);
			pos.set([p1[0], p1[1], z], (base + i * 2 + 1) * 3);
		}
	}
	b.g.attributes.position.needsUpdate = true;
	b.g.computeVertexNormals();
	b.g.computeBoundingSphere();
};

/** One smooth body with its outline, re-shaped every frame. */
const BodyMesh: React.FC<{spec: BodySpec; k: string; outline: number; bend: (t: number) => number; opacity?: number}> = ({spec, k, outline, bend, opacity = 1}) => {
	const {body, line} = useMemo(() => ({body: makeBody(spec, 0), line: outline > 0 ? makeBody({...spec, lid: undefined}, outline) : null}), [k, outline]);
	shapeBody(body, spec, bend);
	if (line) {
		shapeBody(line, {...spec, lid: undefined}, bend, spec.r(line.t0) < 0.002 || spec.r(line.t1) < 0.002 ? outline : 0);
	}
	return (
		<group>
			<mesh geometry={body.g} castShadow receiveShadow>
				<meshToonMaterial vertexColors gradientMap={toonRamp()} side={spec.lid ? THREE.DoubleSide : THREE.FrontSide} transparent={opacity < 1} opacity={opacity} />
			</mesh>
			{line && opacity > 0.3 ? (
				<mesh geometry={line.g}>
					<meshBasicMaterial color={INK} side={THREE.BackSide} />
				</mesh>
			) : null}
		</group>
	);
};

/** A whale's tail flukes: span `span` (both sides), chord `chord`, in body units. */
const Flukes: React.FC<{span: number; chord: number; color: string; outline: number; under?: string}> = ({span, chord, color, outline, under}) => {
	const {g, o} = useMemo(() => {
		const sh = new THREE.Shape();
		const S = span / 2;
		const C = chord;
		sh.moveTo(0, 0.02 * C);
		sh.quadraticCurveTo(S * 0.45, 0.05 * C, S, -0.75 * C);
		sh.quadraticCurveTo(S * 0.75, -0.9 * C, S * 0.4, -0.85 * C);
		sh.quadraticCurveTo(S * 0.12, -0.82 * C, 0, -0.62 * C);
		sh.quadraticCurveTo(-S * 0.12, -0.82 * C, -S * 0.4, -0.85 * C);
		sh.quadraticCurveTo(-S * 0.75, -0.9 * C, -S, -0.75 * C);
		sh.quadraticCurveTo(-S * 0.45, 0.05 * C, 0, 0.02 * C);
		const th = C * 0.08;
		const make = (bevel: number) => {
			const geo = new THREE.ExtrudeGeometry(sh, {depth: th, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel + th * 0.3, bevelSegments: 2, curveSegments: 16});
			geo.translate(0, 0, -th / 2);
			geo.rotateX(Math.PI / 2);
			return geo;
		};
		return {g: make(th * 0.2), o: make(th * 0.2 + outline)};
	}, [span, chord, outline]);
	return (
		<group>
			<mesh geometry={g} castShadow>
				<meshToonMaterial color={color} gradientMap={toonRamp()} />
			</mesh>
			{under ? (
				<mesh geometry={g} position={[0, -chord * 0.012, 0]} scale={[0.92, 1, 0.9]}>
					<meshToonMaterial color={under} gradientMap={toonRamp()} />
				</mesh>
			) : null}
			<mesh geometry={o}>
				<meshBasicMaterial color={INK} side={THREE.BackSide} />
			</mesh>
		</group>
	);
};

/** A small cartoon eye on the side of a big animal (side 1 = left, -1 = right as it faces +z). */
const SmallEye: React.FC<{at: V3; r: number; side: 1 | -1; shut?: number}> = ({at, r, side, shut = 0}) => (
	<group position={at}>
		<T shape={{kind: 'sphere', r, seg: 20}} color="#F4F0E8" outline={r * 0.25} scale={[0.6, 1 - shut * 0.85, 1.2]} />
		{shut < 0.6 ? <T shape={{kind: 'sphere', r: r * 0.62, seg: 16}} color="#1E1626" position={[side * r * 0.32, 0, r * 0.15]} outline={0} /> : null}
		{shut < 0.6 ? <Glow shape={{kind: 'sphere', r: r * 0.2, seg: 10}} color="#ffffff" position={[side * r * 0.55, r * 0.25, r * 0.35]} /> : null}
	</group>
);

const hex = (c: string) => new THREE.Color(c);
const mix = (a: string, b: string, t: number) => '#' + hex(a).lerp(hex(b), Math.max(0, Math.min(1, t))).getHexString();

// ---------------------------------------------------------------- whales

export type WhaleKind = 'blue' | 'humpback' | 'sperm';

type WhaleProps = {
	at: V3;
	/** [pitch, yaw, roll] in radians. Pitch > 0 noses down. */
	rot?: V3;
	/** Length in metres. */
	len?: number;
	frame: number;
	/** How fast the tail beats (0 = still). */
	swim?: number;
	/** Mouth: 0 shut, 1 wide open. */
	jaw?: number;
	/** Blue/humpback throat pouch filling with water, 0..1. */
	pouch?: number;
	/** The eye: 0 open, 1 shut (or a wink). */
	wink?: number;
	opacity?: number;
	seed?: number;
};

const BLUE = {top: '#6A8DB8', mottle: '#8FAED0', belly: '#B4C8DE', groove: '#55729A', palate: '#2E2638', tongue: '#C86A7E'};
const HUMP = {top: '#2E3348', mottle: '#4A5068', belly: '#E8ECF2', groove: '#9AA2B8', palate: '#2E2638', tongue: '#C86A7E', fin: '#EEF0F4'};
const SPERM = {top: '#5E5868', wrinkle: '#544E5E', light: '#6E687A', lip: '#EEE6E6', mouth: '#F4EEEE'};

const blueR = curve([[0, 0], [0.025, 0.014], [0.12, 0.022], [0.3, 0.05], [0.5, 0.071], [0.68, 0.074], [0.85, 0.062], [0.95, 0.045], [0.99, 0.024], [1, 0]]);
const humpR = curve([[0, 0], [0.025, 0.017], [0.12, 0.03], [0.3, 0.074], [0.5, 0.104], [0.65, 0.104], [0.8, 0.086], [0.92, 0.058], [0.985, 0.03], [1, 0]]);
const spermR = curve([[0, 0], [0.025, 0.016], [0.1, 0.028], [0.25, 0.055], [0.45, 0.084], [0.6, 0.096], [0.7, 0.1], [0.85, 0.101], [0.95, 0.097], [0.985, 0.08], [1, 0]]);

/** Mottled grey-blue skin with a paler belly and throat grooves. */
const baleenSkin = (P: typeof BLUE, seed: number, grooveFrom: number) => (t: number, a: number) => {
	const s = Math.sin(a);
	const spot = rnd(Math.floor(t * 60) * 13.1 + Math.floor(((a + 7) % (Math.PI * 2)) * 6) * 7.7 + seed) > 0.8;
	let c = s > -0.25 ? (spot ? P.mottle : P.top) : mix(P.top, P.belly, Math.min(1, (-s - 0.25) * 2.5));
	if (s < -0.45 && t > grooveFrom && Math.floor(a * 9) % 2 === 0) {
		c = P.groove;
	}
	return c;
};

/** Where a point on a whale's body (t along it, 0 = tail, 1 = nose; x, y across it, in body lengths) is in the world. */
export const whalePoint = (at: V3, rot: V3, len: number, t: number, x = 0, y = 0): V3 => {
	const v = new THREE.Vector3(x * len, y * len, (t - 0.5) * len).applyEuler(new THREE.Euler(rot[0], rot[1], rot[2], 'YXZ'));
	return [at[0] + v.x, at[1] + v.y, at[2] + v.z];
};

/**
 * A whale. Blue whales and humpbacks open their mouths by dropping the lower
 * jaw (the throat pouch balloons as it fills); a sperm whale drops its thin,
 * toothed lower jaw from under its huge square head.
 */
export const Whale3D: React.FC<WhaleProps & {kind: WhaleKind}> = ({kind, at, rot = [0, 0, 0], len = 20, frame, swim = 1, jaw = 0, pouch = 0, wink = 0, opacity = 1, seed = 0}) => {
	const phase = frame * 0.06 * swim + seed;
	const amp = 0.025 * Math.min(1, swim);
	const beat = Math.sin(phase);
	const bend = (t: number) => amp * beat * Math.pow(Math.max(0, 0.6 - t) / 0.6, 2);
	const tailPitch = Math.atan(3.33 * amp * beat) + Math.sin(phase - 0.8) * 0.25 * Math.min(1, swim);
	const o = 0.05 / len;
	const tailY = bend(0);
	if (kind === 'sperm') {
		const p = (t: number) => (t < 0.55 ? 1 : t > 0.72 ? 0.5 : 1 - ((t - 0.55) / 0.17) * 0.5);
		const h = (t: number) => (t < 0.55 ? 0.95 : t > 0.72 ? 1.18 : 0.95 + ((t - 0.55) / 0.17) * 0.23);
		const w = (t: number) => (t < 0.55 ? 1 : t > 0.72 ? 0.86 : 1 - ((t - 0.55) / 0.17) * 0.14);
		const spec: BodySpec = {
			r: spermR,
			h,
			w,
			p,
			n: 80,
			m: 44,
			color: (t, a) => {
				const s = Math.sin(a);
				const cc = Math.cos(a);
				if (t > 0.64 && t < 0.975 && s < -0.86 && Math.abs(cc) < 0.5) {
					return SPERM.lip;
				}
				if (t < 0.62) {
					return Math.floor(t * 70 + Math.sin(a * 3) * 0.6) % 3 === 0 ? SPERM.wrinkle : rnd(Math.floor(t * 50) + Math.floor(a * 5) * 3.3 + seed) > 0.94 ? SPERM.light : SPERM.top;
				}
				return rnd(Math.floor(t * 40) * 7 + Math.floor(a * 4) * 3.1 + seed) > 0.96 ? SPERM.light : SPERM.top;
			},
		};
		const head = (t: number) => spermR(t) * h(t);
		const jawY = -head(0.8) + 0.004;
		const open = jaw * 1.1;
		return (
			<group position={at} rotation={new THREE.Euler(rot[0], rot[1], rot[2], 'YXZ')} scale={len}>
			<group position={[0, 0, -0.5]}>
				<BodyMesh spec={spec} k={`sperm${seed}`} outline={o} bend={bend} opacity={opacity} />
				{/* the thin lower jaw, hinged at the back of the mouth */}
				<group position={[0, jawY, 0.64]} rotation={[open, 0, 0]}>
					<T shape={{kind: 'capsule', r: 0.013, len: 0.29}} color={SPERM.top} position={[0, -0.004, 0.155]} rotation={[Math.PI / 2, 0, 0]} scale={[1.25, 1, 0.75]} outline={o * 0.8} />
					<T shape={{kind: 'box', w: 0.024, h: 0.004, d: 0.29}} color={SPERM.mouth} position={[0, 0.006, 0.15]} outline={0} />
					<Many
						kind="spermTeeth"
						geom={() => new THREE.ConeGeometry(0.0032, 0.011, 8)}
						color="#F6F0DE"
						outline={0.0012}
						items={[...Array(40)].map((_, i) => ({p: [(i % 2 ? 1 : -1) * 0.0085, 0.012, 0.035 + Math.floor(i / 2) * 0.0125] as V3, s: 1 - Math.floor(i / 2) * 0.012}))}
					/>
				</group>
				{/* the white roof of the mouth, seen when the jaw drops */}
				{jaw > 0.02 ? <T shape={{kind: 'box', w: 0.05, h: 0.004, d: 0.31}} color={SPERM.mouth} position={[0, jawY + 0.002, 0.8]} outline={0} /> : null}
				{/* the blowhole, on the front left of the head */}
				<T shape={{kind: 'capsule', r: 0.004, len: 0.012}} color="#231E2C" position={[0.045, head(0.955) - 0.002, 0.955]} rotation={[Math.PI / 2, 0, 0.5]} outline={0} />
				{/* the hump and knuckles on the back */}
				{[0.36, 0.3, 0.26, 0.22, 0.18].map((t, i) => (
					<T key={t} shape={{kind: 'sphere', r: 1, seg: 16}} color={SPERM.top} position={[0, bend(t) + spermR(t) * 0.95 - 0.004, t]} scale={i === 0 ? [0.012, 0.016, 0.035] : [0.008, 0.008, 0.014]} outline={o * 0.6} />
				))}
				{/* flippers */}
				{[-1, 1].map((x) => (
					<T key={x} shape={{kind: 'sphere', r: 1, seg: 16}} color={SPERM.top} position={[x * 0.082, -0.06, 0.63]} rotation={[0.2, x * 0.6, -x * (0.6 + Math.sin(phase * 0.5) * 0.15)]} scale={[0.03, 0.005, 0.018]} outline={o * 0.6} />
				))}
				{[-1, 1].map((x) => (
					<SmallEye key={x} at={[x * spermR(0.68) * w(0.68) * 0.93, -0.05, 0.68]} r={0.006} side={x as 1 | -1} shut={wink} />
				))}
				<group position={[0, tailY, 0.008]} rotation={[tailPitch, 0, 0]}>
					<Flukes span={0.26} chord={0.075} color={SPERM.top} outline={o} />
				</group>
			</group>
			</group>
		);
	}
	const P = kind === 'blue' ? BLUE : HUMP;
	const R = kind === 'blue' ? blueR : humpR;
	const tj = kind === 'blue' ? 0.79 : 0.76;
	const ww = (t: number) => (kind === 'blue' ? 1 + Math.max(0, t - 0.75) * 0.8 : 1.02);
	const hh = (t: number) => (kind === 'blue' ? 0.95 - Math.max(0, t - 0.75) * 0.6 : 0.98 - Math.max(0, t - 0.8) * 0.4);
	const skin = baleenSkin(P, seed, kind === 'blue' ? 0.52 : 0.46);
	const back: BodySpec = {r: R, w: ww, h: hh, t1: tj, n: 70, m: 44, color: skin};
	const lip = 0.12;
	const upper: BodySpec = {r: R, w: ww, h: hh, t0: tj, t1: 1, a0: -lip, a1: Math.PI + lip, n: 24, m: 24, color: skin, lid: P.palate};
	const lower: BodySpec = {r: R, w: ww, h: hh, t0: tj, t1: 1, a0: Math.PI + lip, a1: Math.PI * 2 - lip, n: 24, m: 20, color: skin, lid: P.tongue, pouch: Math.round(pouch * 20) / 20};
	const hinge = R(tj) * hh(tj) * -Math.sin(lip);
	const open = jaw * 0.75;
	const fins = kind === 'blue' ? {t: 0.7, len: 0.07, wid: 0.017, c: P.top} : {t: 0.66, len: 0.16, wid: 0.022, c: HUMP.fin};
	return (
		<group position={at} rotation={new THREE.Euler(rot[0], rot[1], rot[2], 'YXZ')} scale={len}>
			<group position={[0, 0, -0.5]}>
			<BodyMesh spec={back} k={`${kind}b${seed}`} outline={o} bend={bend} opacity={opacity} />
			<BodyMesh spec={upper} k={`${kind}u${seed}`} outline={o} bend={bend} opacity={opacity} />
			<group position={[0, hinge, tj]} rotation={[open, 0, 0]}>
				<group position={[0, -hinge, -tj]}>
					<BodyMesh spec={lower} k={`${kind}l${seed}${lower.pouch}`} outline={o} bend={bend} opacity={opacity} />
				</group>
			</group>
			{/* baleen, hanging from the upper jaw */}
			{jaw > 0.05 ? (
				<Many
					kind={`baleen${kind}`}
					geom={() => new THREE.BoxGeometry(0.0025, 0.02, 0.005)}
					color="#4A4050"
					outline={0}
					items={[...Array(120)].map((_, i) => {
						const t = tj + 0.01 + ((i % 60) / 60) * (0.97 - tj);
						const x = (i < 60 ? 1 : -1) * R(t) * ww(t) * 0.86;
						return {p: [x, hinge - 0.01, t] as V3};
					})}
				/>
			) : null}
			{/* flippers */}
			{[-1, 1].map((x) => (
				<T key={x} shape={{kind: 'sphere', r: 1, seg: 20}} color={fins.c} position={[x * (R(fins.t) * ww(fins.t) + fins.len * 0.35), -R(fins.t) * 0.45, fins.t - fins.len * 0.25]} rotation={[0.1, x * 0.75, -x * (0.45 + Math.sin(phase * 0.5) * 0.12)]} scale={[fins.len, 0.006, fins.wid]} outline={o * 0.7} />
			))}
			{/* small dorsal fin */}
			<T shape={{kind: 'cone', r: 1, h: 1}} color={P.top} position={[0, bend(kind === 'blue' ? 0.24 : 0.32) + R(kind === 'blue' ? 0.24 : 0.32) * 0.92, kind === 'blue' ? 0.24 : 0.32]} rotation={[-0.7, 0, 0]} scale={kind === 'blue' ? [0.004, 0.018, 0.012] : [0.008, 0.02, 0.02]} outline={o * 0.6} />
			{/* humpback knobs on the head */}
			{kind === 'humpback'
				? [...Array(14)].map((_, i) => {
						const t = 0.82 + (i % 7) * 0.024;
						const x = (i < 7 ? 1 : -1) * R(t) * 0.35;
						return <T key={i} shape={{kind: 'sphere', r: 0.006, seg: 10}} color={P.mottle} position={[x, R(t) * hh(t) * 0.93, t]} outline={o * 0.4} />;
					})
				: null}
			{/* splash guard round the blowholes */}
			<T shape={{kind: 'sphere', r: 1, seg: 14}} color={P.top} position={[0, R(0.8) * hh(0.8) * 0.97, 0.8]} scale={[0.012, 0.006, 0.02]} outline={o * 0.5} />
			{[-1, 1].map((x) => (
				<SmallEye key={x} at={[x * R(tj - 0.005) * ww(tj) * 0.97, R(tj) * 0.12, tj - 0.004]} r={0.0055} side={x as 1 | -1} shut={wink} />
			))}
			<group position={[0, tailY, 0.01]} rotation={[tailPitch, 0, 0]}>
				<Flukes span={kind === 'blue' ? 0.24 : 0.3} chord={kind === 'blue' ? 0.06 : 0.075} color={P.top} under={kind === 'humpback' ? '#E8ECF2' : undefined} outline={o} />
			</group>
			</group>
		</group>
	);
};

// ---------------------------------------------------------------- squid, krill, fish

/** A giant squid, swimming mantle-first towards +z (arms trailing behind), about `len` long without tentacles. */
export const Squid3D: React.FC<{at: V3; rot?: V3; len?: number; frame: number; color?: string}> = ({at, rot, len = 6, frame, color = '#D0503A'}) => {
	const arms: Copy[] = [];
	const clubs: Copy[] = [];
	for (let a = 0; a < 10; a++) {
		const long = a >= 8;
		const ang = (a / 8) * Math.PI * 2 + 0.2;
		const n = long ? 18 : 11;
		for (let i = 0; i < n; i++) {
			const u = i / n;
			const L = long ? 1.5 : 0.75;
			const wav = Math.sin(frame * 0.08 - u * 5 + a) * 0.06 * u;
			const spread = long ? 0.05 : 0.08 + u * 0.1;
			const x = Math.cos(long ? (a === 8 ? 0.4 : 2.7) : ang) * spread + wav;
			const y = Math.sin(long ? (a === 8 ? 0.4 : 2.7) : ang) * spread + Math.cos(frame * 0.07 - u * 4 + a) * 0.04 * u;
			arms.push({p: [x, y, -0.62 - u * L], s: (long ? 0.022 : 0.04) * (1 - u * 0.75)});
		}
		if (long) {
			clubs.push({p: [Math.cos(a === 8 ? 0.4 : 2.7) * 0.05, Math.sin(a === 8 ? 0.4 : 2.7) * 0.05, -0.62 - 1.55], s: [0.035, 0.035, 0.09]});
		}
	}
	return (
		<group position={at} rotation={rot} scale={len}>
			<T shape={{kind: 'cyl', r: 0.11, r2: 0.02, h: 0.62, seg: 28}} color={color} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.008} />
			<T shape={{kind: 'sphere', r: 0.11, seg: 24}} color={color} position={[0, 0, -0.31]} scale={[1, 1, 0.6]} outline={0.008} />
			{[-1, 1].map((x) => (
				<T key={x} shape={{kind: 'sphere', r: 1, seg: 16}} color={mix(color, '#FF8A6A', 0.3)} position={[x * 0.07, 0, 0.24]} rotation={[0, x * 0.4, 0]} scale={[0.09, 0.01, 0.07]} outline={0.006} />
			))}
			<T shape={{kind: 'sphere', r: 0.085, seg: 24}} color={mix(color, '#FFB08A', 0.2)} position={[0, 0, -0.42]} scale={[1, 0.95, 1.25]} outline={0.008} />
			{[-1, 1].map((x) => (
				<group key={x} position={[x * 0.075, 0.01, -0.42]}>
					<T shape={{kind: 'sphere', r: 0.034, seg: 20}} color="#F4F0E8" outline={0.005} />
					<T shape={{kind: 'sphere', r: 0.022, seg: 16}} color="#1E1626" position={[x * 0.016, 0, 0]} outline={0} />
					<Glow shape={{kind: 'sphere', r: 0.008, seg: 8}} color="#ffffff" position={[x * 0.03, 0.012, 0.008]} />
				</group>
			))}
			<Many kind="squidArms" geom={() => new THREE.SphereGeometry(1, 12, 10)} items={arms} color={mix(color, '#E8705A', 0.2)} outline={0.25} />
			<Many kind="squidClubs" geom={() => new THREE.SphereGeometry(1, 12, 10)} items={clubs} color={color} outline={0.25} />
		</group>
	);
};

/** A swirling cloud of krill around `at`. */
export const Krill3D: React.FC<{at: V3; frame: number; r?: number; n?: number; suck?: V3; p?: number}> = ({at, frame, r = 6, n = 700, suck, p = 0}) => {
	const items: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const a = rnd(i * 1.7) * Math.PI * 2 + frame * 0.01 * (0.5 + rnd(i));
		const b = (rnd(i * 2.3) - 0.5) * Math.PI;
		const d = Math.cbrt(rnd(i * 3.9)) * r;
		let pt: V3 = [at[0] + Math.cos(a) * Math.cos(b) * d, at[1] + Math.sin(b) * d * 0.6 + Math.sin(frame * 0.05 + i) * 0.1, at[2] + Math.sin(a) * Math.cos(b) * d];
		if (suck && p > 0) {
			const q = Math.min(1, p * (1.2 + rnd(i * 5.1)));
			pt = [pt[0] + (suck[0] - pt[0]) * q, pt[1] + (suck[1] - pt[1]) * q, pt[2] + (suck[2] - pt[2]) * q];
		}
		items.push({p: pt, s: 0.05 + rnd(i * 4.4) * 0.04, r: [rnd(i) * 3, rnd(i * 2) * 3, 0], c: rnd(i * 6.6) > 0.5 ? '#FF8A8A' : '#FFB0A0'});
	}
	return <Many kind={`krill${n}`} geom={() => new THREE.CapsuleGeometry(0.4, 1.6, 4, 8)} items={items} outline={0} shadow={false} />;
};

/** A school of little fish circling `at`. */
export const Fish3D: React.FC<{at: V3; frame: number; n?: number; r?: number; s?: number; color?: string; speed?: number}> = ({at, frame, n = 40, r = 3, s = 0.25, color = '#FFD23A', speed = 1}) => {
	const bodies: Copy[] = [];
	const tails: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const a = rnd(i * 2.1) * Math.PI * 2 + frame * 0.012 * speed;
		const d = r * (0.6 + rnd(i * 3.3) * 0.5);
		const y = (rnd(i * 4.7) - 0.5) * r * 0.5 + Math.sin(frame * 0.04 + i) * 0.1;
		const px = at[0] + Math.cos(a) * d;
		const pz = at[2] + Math.sin(a) * d;
		const yaw = -a + Math.PI;
		const k = s * (0.8 + rnd(i * 9.1) * 0.4);
		const wag = Math.sin(frame * 0.4 + i) * 0.4;
		bodies.push({p: [px, at[1] + y, pz], s: [k * 0.35, k * 0.5, k], r: [0, yaw, 0], c: i % 5 === 0 ? '#7FE0FF' : color});
		tails.push({p: [px - Math.sin(yaw) * k * 1.0, at[1] + y, pz - Math.cos(yaw) * k * 1.0], s: [k * 0.1, k * 0.45, k * 0.4], r: [0, yaw + wag, 0], c: i % 5 === 0 ? '#4FB0E0' : '#FF9A3A'});
	}
	return (
		<group>
			<Many kind={`fishb${n}`} geom={() => new THREE.SphereGeometry(1, 14, 10)} items={bodies} outline={0.12} />
			<Many kind={`fisht${n}`} geom={() => new THREE.SphereGeometry(1, 10, 8)} items={tails} outline={0.12} />
		</group>
	);
};

/** Bubbles rising from `at` (a regulator, a whale's blow). */
export const Bubbles3D: React.FC<{at: V3; frame: number; n?: number; rise?: number; r?: number; spread?: number; every?: number; seed?: number}> = ({at, frame, n = 14, rise = 2.2, r = 0.05, spread = 0.12, every = 40, seed = 0}) => {
	const items: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const t = ((frame + rnd(i * 3.1 + seed) * every) % every) / every;
		const wob = Math.sin(frame * 0.3 + i) * spread * t;
		items.push({p: [at[0] + wob + (rnd(i * 1.3 + seed) - 0.5) * spread, at[1] + t * rise, at[2] + (rnd(i * 2.7 + seed) - 0.5) * spread], s: r * (0.6 + rnd(i * 5.5 + seed) * 0.8) * (0.6 + t * 0.6)});
	}
	return <Many kind={`bub${n}`} geom={() => new THREE.SphereGeometry(1, 12, 10)} items={items} color="#DDF8FF" outline={0.18} opacity={0.75} shadow={false} />;
};

// ---------------------------------------------------------------- the world underwater

let ripple: THREE.CanvasTexture | null = null;
const rippleTex = () => {
	if (!ripple) {
		const c = document.createElement('canvas');
		c.width = 512;
		c.height = 512;
		const x = c.getContext('2d')!;
		x.fillStyle = '#8FDcF8';
		x.fillRect(0, 0, 512, 512);
		x.strokeStyle = 'rgba(255,255,255,0.75)';
		x.lineWidth = 6;
		for (let i = 0; i < 70; i++) {
			const cx = rnd(i * 3.3) * 512;
			const cy = rnd(i * 7.1) * 512;
			x.beginPath();
			x.moveTo(cx - 40, cy);
			x.bezierCurveTo(cx - 15, cy - 18, cx + 15, cy + 18, cx + 40, cy);
			x.stroke();
		}
		ripple = new THREE.CanvasTexture(c);
		ripple.wrapS = THREE.RepeatWrapping;
		ripple.wrapT = THREE.RepeatWrapping;
		ripple.repeat.set(10, 10);
		ripple.colorSpace = THREE.SRGBColorSpace;
	}
	return ripple;
};

let fadeTex: THREE.CanvasTexture | null = null;
const rayFade = () => {
	if (!fadeTex) {
		const c = document.createElement('canvas');
		c.width = 4;
		c.height = 128;
		const x = c.getContext('2d')!;
		const g = x.createLinearGradient(0, 0, 0, 128);
		g.addColorStop(0, 'rgba(255,255,255,1)');
		g.addColorStop(1, 'rgba(255,255,255,0)');
		x.fillStyle = g;
		x.fillRect(0, 0, 4, 128);
		fadeTex = new THREE.CanvasTexture(c);
	}
	return fadeTex;
};

/**
 * Inside the sea: the bright rippling surface seen from below at `surface`,
 * sunbeams slanting down, drifting specks around `center`, and (optionally) a
 * sandy floor with rocks and swaying kelp.
 */
export const Underwater3D: React.FC<{frame: number; surface?: number; center?: V3; floor?: number; rays?: number; snow?: number; dark?: number}> = ({frame, surface = 0, center = [0, -6, 0], floor, rays = 1, snow = 1, dark = 0}) => {
	const tex = rippleTex();
	tex.offset.set(frame * 0.0015, frame * 0.001);
	const specks: Copy[] = [];
	for (let i = 0; i < Math.round(260 * snow); i++) {
		const t = (frame * 0.002 + rnd(i * 1.9)) % 1;
		specks.push({p: [center[0] + (rnd(i * 3.7) - 0.5) * 30, center[1] + (rnd(i * 5.3) - 0.5) * 16 - t * 2, center[2] + (rnd(i * 7.9) - 0.5) * 30], s: 0.02 + rnd(i * 2.2) * 0.03});
	}
	const kelp: Copy[] = [];
	const rocks: Copy[] = [];
	if (floor !== undefined) {
		for (let i = 0; i < 40; i++) {
			const x = (rnd(i * 4.1) - 0.5) * 60;
			const z = (rnd(i * 6.3) - 0.5) * 60;
			rocks.push({p: [x, floor, z], s: [1 + rnd(i) * 2, 0.5 + rnd(i * 2) * 1.2, 1 + rnd(i * 3) * 2], c: rnd(i * 8) > 0.5 ? '#6A6A8A' : '#7A6A7A'});
			for (let k = 0; k < 6; k++) {
				const sway = Math.sin(frame * 0.04 + i + k * 0.5) * 0.12 * k;
				kelp.push({p: [x + 1.5 + sway, floor + 0.6 + k * 1.1, z + 0.5], s: [0.25, 0.7, 0.12], r: [0, i, sway * 0.5], c: k % 2 ? '#3FA86A' : '#4FB87A'});
			}
		}
	}
	return (
		<group>
			<mesh position={[center[0], surface, center[2]]} rotation={[Math.PI / 2, 0, 0]}>
				<planeGeometry args={[400, 400]} />
				<meshBasicMaterial map={tex} color={dark > 0 ? mix('#ffffff', '#20405A', dark) : '#ffffff'} toneMapped={false} fog={false} side={THREE.DoubleSide} />
			</mesh>
			{rays > 0
				? [...Array(9)].map((_, i) => {
						const x = center[0] + (i - 4) * 3.2 + Math.sin(i * 2.3) * 1.5;
						const z = center[2] - 4 + Math.cos(i * 1.7) * 6;
						const op = (0.1 + 0.06 * Math.sin(frame * 0.03 + i * 1.3)) * rays * (1 - dark);
						return (
							<mesh key={i} position={[x, surface - 9, z]} rotation={[0.25, 0.3, 0.22]}>
								<planeGeometry args={[1.2 + (i % 3) * 0.8, 18]} />
								<meshBasicMaterial map={rayFade()} color="#E8FFFF" transparent opacity={op} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
							</mesh>
						);
					})
				: null}
			{snow > 0 ? <Many kind={`snow${specks.length}`} geom={() => new THREE.SphereGeometry(1, 6, 5)} items={specks} color="#E8FFFF" outline={0} glow opacity={0.6} shadow={false} /> : null}
			{floor !== undefined ? (
				<group>
					<mesh position={[center[0], floor, center[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
						<planeGeometry args={[200, 200]} />
						<meshToonMaterial color="#D8C890" gradientMap={toonRamp()} />
					</mesh>
					<Many kind="rocks40" geom={() => new THREE.SphereGeometry(1, 12, 9)} items={rocks} outline={0.05} />
					<Many kind="kelp240" geom={() => new THREE.SphereGeometry(1, 10, 8)} items={kelp} outline={0.05} />
				</group>
			) : null}
		</group>
	);
};

// ---------------------------------------------------------------- boats

/** A little white dive boat facing +z, deck about 1 m above the water at y = 0. */
export const Boat3D: React.FC<{at: V3; rot?: number; frame: number; rock?: number; children?: React.ReactNode}> = ({at, rot = 0, frame, rock = 1, children}) => {
	const L = 8;
	const hull: BodySpec = {
		r: curve([[0, 0.12], [0.08, 0.15], [0.6, 0.155], [0.85, 0.12], [0.97, 0.05], [1, 0]]),
		w: () => 1,
		h: () => 0.75,
		a0: Math.PI,
		a1: Math.PI * 2,
		n: 40,
		m: 24,
		color: (t, a) => {
			const s = Math.sin(a);
			return s > -0.3 ? '#2E7FD8' : s > -0.55 ? '#F4F4F8' : s > -0.85 ? '#F4F4F8' : '#C8403A';
		},
		lid: '#C8A070',
	};
	const roll = Math.sin(frame * 0.05) * 0.035 * rock;
	const pitch = Math.sin(frame * 0.037 + 1) * 0.02 * rock;
	const heave = Math.sin(frame * 0.045) * 0.08 * rock;
	return (
		<group position={[at[0], at[1] + heave, at[2]]} rotation={[pitch, rot, roll]}>
			<group position={[0, 0.85, -L / 2]} scale={L}>
				<BodyMesh spec={hull} k="boat" outline={0.004} bend={() => 0} />
			</group>
			{/* the cabin */}
			<T shape={{kind: 'box', w: 1.6, h: 1.2, d: 1.8}} color="#F4F4F8" position={[0, 1.45, 1.0]} outline={0.03} />
			<T shape={{kind: 'box', w: 1.8, h: 0.12, d: 2.1}} color="#2E7FD8" position={[0, 2.1, 1.0]} outline={0.03} />
			<Glow shape={{kind: 'box', w: 1.4, h: 0.45, d: 0.05}} color="#BFE8FF" position={[0, 1.65, 1.92]} />
			{[-1, 1].map((x) => (
				<Glow key={x} shape={{kind: 'box', w: 0.05, h: 0.4, d: 1.2}} color="#BFE8FF" position={[x * 0.81, 1.65, 1.0]} />
			))}
			{/* rails */}
			{[-1, 1].map((x) => (
				<group key={x}>
					<T shape={{kind: 'cyl', r: 0.03, h: 5.4}} color="#D8DCE8" position={[x * 1.1, 1.45, -1.0]} rotation={[Math.PI / 2, 0, 0]} outline={0.01} />
					{[-3.5, -2, -0.5, 1.2].map((z) => (
						<T key={z} shape={{kind: 'cyl', r: 0.025, h: 0.6}} color="#D8DCE8" position={[x * 1.1, 1.15, z]} outline={0.008} />
					))}
				</group>
			))}
			{/* scuba tanks in a rack */}
			{[-0.5, -0.1, 0.3].map((x) => (
				<T key={x} shape={{kind: 'capsule', r: 0.12, len: 0.45}} color="#FFD23A" position={[x, 1.2, -0.4]} outline={0.015} />
			))}
			{/* the dive flag: red with a white diagonal stripe */}
			<T shape={{kind: 'cyl', r: 0.03, h: 1.6}} color="#D8DCE8" position={[0.6, 2.9, 0.4]} outline={0.008} />
			<group position={[0.98, 3.4, 0.4]} rotation={[0, 0, Math.sin(frame * 0.2) * 0.05]}>
				<T shape={{kind: 'box', w: 0.75, h: 0.5, d: 0.02}} color="#E8303A" outline={0.008} />
				<T shape={{kind: 'box', w: 0.88, h: 0.1, d: 0.025}} color="#FFFFFF" rotation={[0, 0, -0.55]} outline={0} />
			</group>
			{/* the ladder at the back */}
			{[-0.3, 0.3].map((x) => (
				<T key={x} shape={{kind: 'cyl', r: 0.03, h: 1.6}} color="#B8BCC8" position={[x, 0.55, -4.05]} outline={0.008} />
			))}
			{[0, 0.4, 0.8].map((y) => (
				<T key={y} shape={{kind: 'cyl', r: 0.025, h: 0.6}} color="#B8BCC8" position={[0, 0.05 + y, -4.05]} rotation={[0, 0, Math.PI / 2]} outline={0.006} />
			))}
			{children}
		</group>
	);
};

/** A yellow sea kayak facing +z, sitting on the water at y = 0. */
export const Kayak3D: React.FC<{at: V3; rot?: V3; frame: number}> = ({at, rot, frame}) => {
	const hull: BodySpec = {
		r: curve([[0, 0], [0.08, 0.06], [0.4, 0.085], [0.6, 0.085], [0.92, 0.06], [1, 0]]),
		h: () => 0.7,
		a0: Math.PI,
		a1: Math.PI * 2,
		n: 30,
		m: 18,
		color: () => '#FFD23A',
		lid: '#FFC21A',
	};
	return (
		<group position={at} rotation={rot}>
			<group position={[0, 0.15 + Math.sin(frame * 0.06) * 0.03, -2]} scale={4}>
				<BodyMesh spec={hull} k="kayak" outline={0.006} bend={() => 0} />
			</group>
			<T shape={{kind: 'torus', r: 0.32, tube: 0.05}} color="#24203A" position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.5, 1]} outline={0.008} />
		</group>
	);
};

/** Rings of sound spreading from `at`: one per start frame in `starts`, growing at `speed` m per frame. They face along `yaw`. */
export const SoundRings3D: React.FC<{at: V3; frame: number; starts: number[]; speed?: number; life?: number; color?: string; yaw?: number; tube?: number}> = ({at, frame, starts, speed = 0.5, life = 70, color = '#9FF0FF', yaw = 0, tube = 0.06}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		{starts.map((s0, i) => {
			const t = frame - s0;
			if (t < 0 || t > life) {
				return null;
			}
			const r = 0.3 + t * speed;
			return (
				<group key={i}>
					{[0, 0.12].map((k) => (
						<mesh key={k} rotation={[0, 0, 0]}>
							<torusGeometry args={[r * (1 - k), tube * (1 + r * 0.04), 8, 72]} />
							<meshBasicMaterial color={color} transparent opacity={(1 - t / life) * (k ? 0.35 : 0.7)} depthWrite={false} toneMapped={false} />
						</mesh>
					))}
				</group>
			);
		})}
	</group>
);

// ---------------------------------------------------------------- gear

/** A chunky yellow underwater camera (lens towards +z). */
export const UwCamera3D: React.FC<{at: V3; rot?: V3; s?: number; flash?: number}> = ({at, rot, s = 1, flash = 0}) => (
	<group position={at} rotation={rot} scale={s}>
		<T shape={{kind: 'box', w: 0.26, h: 0.18, d: 0.14}} color="#FFD23A" outline={0.012} />
		<T shape={{kind: 'cyl', r: 0.06, h: 0.08}} color="#24203A" position={[0.03, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} outline={0.008} />
		<Glow shape={{kind: 'cyl', r: 0.042, h: 0.01}} color={flash > 0 ? '#FFFFFF' : '#5AA0D8'} position={[0.03, 0, 0.145]} rotation={[Math.PI / 2, 0, 0]} />
		<T shape={{kind: 'box', w: 0.05, h: 0.04, d: 0.04}} color="#24203A" position={[-0.09, 0.11, 0]} outline={0.006} />
		<T shape={{kind: 'torus', r: 0.06, tube: 0.012}} color="#24203A" position={[-0.17, 0, 0]} rotation={[0, Math.PI / 2, 0]} outline={0.004} />
	</group>
);

/** A dive torch (light towards +z), with its beam. */
export const Torch3D: React.FC<{at: V3; rot?: V3; on?: number; beam?: number}> = ({at, rot = [0, 0, 0], on = 1, beam = 4}) => (
	<group position={at} rotation={new THREE.Euler(rot[0], rot[1], rot[2], 'YXZ')}>
		<T shape={{kind: 'cyl', r: 0.04, h: 0.24}} color="#24203A" rotation={[Math.PI / 2, 0, 0]} outline={0.006} />
		<T shape={{kind: 'cyl', r: 0.055, r2: 0.04, h: 0.06}} color="#3A3650" position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]} outline={0.006} />
		{on > 0 ? (
			<group>
				<Glow shape={{kind: 'cyl', r: 0.05, h: 0.01}} color="#FFF8D8" position={[0, 0, 0.175]} rotation={[Math.PI / 2, 0, 0]} />
				<mesh position={[0, 0, 0.17 + beam / 2]} rotation={[-Math.PI / 2, 0, 0]}>
					<coneGeometry args={[beam * 0.32, beam, 32, 1, true]} />
					<meshBasicMaterial color="#FFF6C8" transparent opacity={0.13 * on} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
				</mesh>
			</group>
		) : null}
	</group>
);
