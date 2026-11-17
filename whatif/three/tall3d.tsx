import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Many, rnd, type Copy} from './many';
import {Glow, INK, T, toonRamp} from './toon';

// Episode 8's world, in real metres: you are a hundred metres tall, so a
// house comes up to your shin and a car is a toy. Houses that fall apart, a
// stone bridge that breaks, Big Ben's tower, a giant redwood, the Eiffel
// Tower, a giraffe, an elephant with flapping ears, a drone, helicopters,
// washing lines, a stadium and the rest of a busy day.

type V3 = [number, number, number];
const box = () => new THREE.BoxGeometry(1, 1, 1);
const ball = () => new THREE.SphereGeometry(1, 14, 10);
const cyl = () => new THREE.CylinderGeometry(1, 1, 1, 10);
const cone = () => new THREE.ConeGeometry(1, 1, 10);

/** A shape from any geometry, cel-shaded, with the usual ink outline. */
export const Geo: React.FC<{make: () => THREE.BufferGeometry; k: string; color: string; position?: V3; rotation?: V3; scale?: V3 | number; outline?: number; shadow?: boolean}> = ({make, k, color, position, rotation, scale, outline = 0.05, shadow = true}) => {
	const geom = useMemo(make, [k]);
	const r = useMemo(() => {
		geom.computeBoundingSphere();
		return Math.max(0.05, geom.boundingSphere?.radius ?? 1);
	}, [geom]);
	const s = 1 + outline / r;
	const sc = typeof scale === 'number' ? ([scale, scale, scale] as V3) : scale;
	return (
		<group position={position} rotation={rotation} scale={sc}>
			<mesh geometry={geom} castShadow={shadow} receiveShadow>
				<meshToonMaterial color={color} gradientMap={toonRamp()} />
			</mesh>
			{outline > 0 ? (
				<mesh geometry={geom} scale={[s, s, s]}>
					<meshBasicMaterial color={INK} side={THREE.BackSide} />
				</mesh>
			) : null}
		</group>
	);
};

/** A triangular prism (a gable roof): width w across, height h, length d along z, base at y = 0. */
const prism = (w: number, h: number, d: number) => () => {
	const s = new THREE.Shape();
	s.moveTo(-w / 2, 0);
	s.lineTo(w / 2, 0);
	s.lineTo(0, h);
	s.closePath();
	const g = new THREE.ExtrudeGeometry(s, {depth: d, bevelEnabled: false});
	g.translate(0, 0, -d / 2);
	return g;
};

const WALLS = ['#FFE8C8', '#F6D2B0', '#E8C8E8', '#CFE0F2', '#F2E2A8', '#E8B8A0'];
const ROOFS = ['#D8583A', '#B8462E', '#5A5E8A', '#3A8A8A', '#C86A3A'];
const CARS = ['#E8453C', '#2E8AE8', '#F2C24A', '#FFFFFF', '#3AB87A', '#8A5AE8'];

// ---------------------------------------------------------------- houses

/**
 * A house, front towards +z. `fall` 0..1 drops the four walls outwards like a
 * cardboard box opening; `lift` raises and tips the roof off like a hat.
 */
export const House3D: React.FC<{at: V3; yaw?: number; w?: number; d?: number; h?: number; wall?: string; roof?: string; lift?: number; fall?: number; lit?: boolean; seed?: number}> = ({at, yaw = 0, w = 6.5, d = 7.5, h = 5.2, wall, roof, lift = 0, fall = 0, lit = false, seed = 0}) => {
	const wc = wall ?? WALLS[Math.floor(rnd(seed * 3.1 + 1) * WALLS.length)];
	const rc = roof ?? ROOFS[Math.floor(rnd(seed * 4.7 + 2) * ROOFS.length)];
	const t = 0.3;
	const a = fall * 1.45;
	const win = lit ? '#FFD98A' : '#CFE6F5';
	const panel = (key: string, pos: V3, rot: V3, size: [number, number], holes: Array<[number, number, number, number]>) => (
		<group key={key} position={pos} rotation={rot}>
			<T shape={{kind: 'box', w: size[0], h: size[1], d: t}} color={wc} position={[0, size[1] / 2, 0]} outline={0.05} />
			{holes.map(([x, y, hw, hh], i) => (
				<Glow key={i} shape={{kind: 'box', w: hw, h: hh, d: t + 0.04}} color={i === 0 && key === 'front' ? '#7A4A3A' : win} position={[x, y, 0]} />
			))}
		</group>
	);
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			{panel('front', [0, 0, d / 2], [a, 0, 0], [w, h], [[-w * 0.2, 1.1, 1.0, 2.1], [w * 0.22, 1.5, 1.3, 1.1], [-w * 0.22, 3.8, 1.3, 1.0], [w * 0.22, 3.8, 1.3, 1.0]])}
			{panel('back', [0, 0, -d / 2], [-a, 0, 0], [w, h], [[w * 0.2, 3.8, 1.3, 1.0], [-w * 0.2, 1.5, 1.3, 1.1]])}
			{panel('left', [-w / 2, 0, 0], [0, Math.PI / 2, -a], [d, h], [[0, 3.8, 1.2, 1.0]])}
			{panel('right', [w / 2, 0, 0], [0, Math.PI / 2, a], [d, h], [[0, 1.5, 1.2, 1.0]])}
			<group position={[lift * 3, h + lift * 14, 0]} rotation={[lift * 0.5, 0, -lift * 0.9]}>
				<Geo make={prism(w + 0.8, h * 0.55, d + 0.6)} k={`roof${w}${h}${d}`} color={rc} outline={0.06} />
				<T shape={{kind: 'box', w: 0.9, h: 1.6, d: 0.9}} color="#B8604A" position={[w * 0.22, h * 0.45, -d * 0.2]} outline={0.04} />
			</group>
			{fall > 0.5 ? <T shape={{kind: 'box', w: w * 0.9, h: 0.6, d: d * 0.9}} color="#C8A888" position={[0, 0.3, 0]} outline={0.04} /> : null}
		</group>
	);
};

/** A street along x: road, pavements, a row of houses on each side, lamp posts, garden trees and parked cars. */
export const Street8: React.FC<{len?: number; seed?: number; skip?: number[]; lit?: boolean; cars?: boolean; frame?: number; trees?: boolean}> = ({len = 120, seed = 0, skip = [], lit = false, cars = true, trees = true}) => {
	const n = Math.floor(len / 9);
	const houses = [];
	const stuff: Copy[] = [];
	const leaves: Copy[] = [];
	const carB: Copy[] = [];
	const carT: Copy[] = [];
	for (let side = -1; side <= 1; side += 2) {
		for (let i = 0; i < n; i++) {
			const idx = (side + 1) * 50 + i;
			const x = -len / 2 + 4.5 + i * 9;
			if (!skip.includes(idx)) {
				houses.push(<House3D key={idx} at={[x, 0, side * 13]} yaw={side > 0 ? Math.PI : 0} seed={seed * 31 + idx} lit={lit && rnd(idx * 2.3) > 0.3} />);
			}
			// low garden wall and a hedge
			stuff.push({p: [x, 0.4, side * 7.6], s: [8.2, 0.8, 0.4], c: '#C8B8A8'});
			if (trees && rnd(idx * 5.1 + seed) > 0.55) {
				const r = 1.8 + rnd(idx) * 0.8;
				leaves.push({p: [x + 3, 3.6 + r * 0.4, side * 9.4], s: [r, r * 1.1, r], c: rnd(idx * 7) > 0.5 ? '#3A9A4A' : '#58B85A'});
				stuff.push({p: [x + 3, 1.6, side * 9.4], s: [0.3, 3.2, 0.3], c: '#7A5A3A'});
			}
			if (i % 3 === 1) {
				stuff.push({p: [x, 2.5, side * 5.6], s: [0.15, 5, 0.15], c: '#2A2350'});
			}
			if (cars && rnd(idx * 3.7 + seed) > 0.55) {
				const c = CARS[Math.floor(rnd(idx * 9.1) * CARS.length)];
				carB.push({p: [x + 1, 0.6, side * 3.1], s: [4.1, 0.8, 1.8], c});
				carT.push({p: [x + 0.8, 1.25, side * 3.1], s: [2.2, 0.6, 1.6], c: '#CFE6F5'});
			}
		}
	}
	const dash: Copy[] = [];
	for (let i = 0; i < len / 6; i++) {
		dash.push({p: [-len / 2 + i * 6 + 1.5, 0.04, 0], s: [2.4, 0.02, 0.2], c: '#F2F2F2'});
	}
	return (
		<group>
			<T shape={{kind: 'box', w: len + 40, h: 0.1, d: 9}} color={lit ? '#2A2650' : '#55597A'} position={[0, 0, 0]} outline={0} />
			{[-1, 1].map((s) => (
				<T key={s} shape={{kind: 'box', w: len + 40, h: 0.2, d: 2.2}} color={lit ? '#3A3666' : '#A8A8C0'} position={[0, 0.05, s * 5.6]} outline={0} />
			))}
			<Many kind={`dash${len}`} geom={box} items={dash} outline={0} shadow={false} />
			<Many kind={`stuff${len}${seed}${trees}`} geom={box} items={stuff} outline={0.04} />
			<Many kind={`leaves${len}${seed}${trees}`} geom={ball} items={leaves} outline={0.06} />
			{cars ? <Many kind={`cb${len}${seed}`} geom={box} items={carB} outline={0.04} /> : null}
			{cars ? <Many kind={`ct${len}${seed}`} geom={box} items={carT} outline={0.03} /> : null}
			{houses}
		</group>
	);
};

/** Bits of a house wrapped round a giant ankle: wall panels and a roof, leaning in a ring. */
export const AnkleHouse: React.FC<{at: V3; r?: number; off?: number; seed?: number}> = ({at, r = 6.5, off = 0, seed = 3}) => {
	const pieces = [0, 1, 2, 3, 4].map((i) => {
		const a = (i / 5) * Math.PI * 2 + 0.3;
		const fall = Math.min(1, off * (1 + i * 0.2));
		const dist = r + fall * (8 + i * 3);
		return (
			<group key={i} position={[at[0] + Math.cos(a) * dist, at[1] + 2.2 * (1 - fall) + 0.3, at[2] + Math.sin(a) * dist]} rotation={[0, -a + Math.PI / 2, (1 - fall) * 0.28 + fall * 1.5]}>
				<T shape={{kind: 'box', w: 6.5, h: 4.6, d: 0.3}} color={WALLS[(seed + i) % WALLS.length]} outline={0.05} />
				<Glow shape={{kind: 'box', w: 1.3, h: 1.0, d: 0.36}} color="#CFE6F5" position={[i % 2 ? 1.4 : -1.4, 0.6, 0]} />
			</group>
		);
	});
	return (
		<group>
			{pieces}
			<group position={[at[0] + 5 + off * 20, at[1] + 5.5 * (1 - off) + 0.5, at[2] - 2]} rotation={[0.3, 0.4, 0.5 + off * 1.2]}>
				<Geo make={prism(7, 2.8, 8)} k="ankleRoof" color={ROOFS[seed % ROOFS.length]} outline={0.06} />
			</group>
		</group>
	);
};

/** A single bed (to stick on a giant's back). Long along z. */
export const Bed8: React.FC<{at: V3; rot?: V3}> = ({at, rot}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'box', w: 1, h: 0.25, d: 2}} color="#8A5A3A" outline={0.02} />
		<T shape={{kind: 'box', w: 0.95, h: 0.2, d: 1.9}} color="#F6F2FF" position={[0, 0.2, 0]} outline={0.02} />
		<T shape={{kind: 'box', w: 0.96, h: 0.08, d: 1.3}} color="#2E8AE8" position={[0, 0.32, 0.3]} outline={0.02} />
		<T shape={{kind: 'box', w: 0.6, h: 0.12, d: 0.35}} color="#FFFFFF" position={[0, 0.34, -0.7]} outline={0.02} />
		<T shape={{kind: 'box', w: 1, h: 0.8, d: 0.08}} color="#8A5A3A" position={[0, 0.4, -1]} outline={0.02} />
	</group>
);

// ---------------------------------------------------------------- landmarks

/** Elizabeth Tower (Big Ben): 96 m, a square stone shaft, four clock faces, a belfry and a spire. Base at `at`. */
export const BigBen3D: React.FC<{at: V3; yaw?: number}> = ({at, yaw = 0.4}) => {
	const stone = '#D8B878';
	const dark = '#8A6A3A';
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			<T shape={{kind: 'box', w: 12, h: 55, d: 12}} color={stone} position={[0, 27.5, 0]} outline={0.25} />
			{[-1, 0, 1].map((x) => [0, 1, 2, 3].map((s) => (
				<T key={`${x}${s}`} shape={{kind: 'box', w: 0.5, h: 50, d: 0.5}} color={dark} position={[Math.cos((s * Math.PI) / 2) * 6.05 + (s % 2 ? 0 : 0) + (s % 2 === 0 ? 0 : x * 3.4), 27, Math.sin((s * Math.PI) / 2) * 6.05 + (s % 2 === 0 ? x * 3.4 : 0)]} outline={0} />
			)))}
			<T shape={{kind: 'box', w: 13.5, h: 13, d: 13.5}} color={stone} position={[0, 61.5, 0]} outline={0.25} />
			{[0, 1, 2, 3].map((s) => {
				const a = (s * Math.PI) / 2;
				return (
					<group key={s} position={[Math.sin(a) * 6.8, 61.5, Math.cos(a) * 6.8]} rotation={[0, a, 0]}>
						<T shape={{kind: 'cyl', r: 4.4, h: 0.4}} color="#2A2350" rotation={[Math.PI / 2, 0, 0]} outline={0.1} />
						<Glow shape={{kind: 'cyl', r: 3.8, h: 0.5}} color="#FFF6D8" rotation={[Math.PI / 2, 0, 0]} />
						<T shape={{kind: 'box', w: 0.4, h: 3, d: 0.2}} color={INK} position={[0, 1.2, 0.35]} outline={0} />
						<T shape={{kind: 'box', w: 0.4, h: 2.2, d: 0.2}} color={INK} position={[0.8, -0.4, 0.35]} rotation={[0, 0, 1.1]} outline={0} />
					</group>
				);
			})}
			<T shape={{kind: 'box', w: 12, h: 8, d: 12}} color={stone} position={[0, 72, 0]} outline={0.25} />
			<Geo make={() => new THREE.ConeGeometry(8.6, 18, 4).rotateY(Math.PI / 4)} k="bbSpire" color="#3A3A6A" position={[0, 85, 0]} outline={0.2} />
			<T shape={{kind: 'cyl', r: 0.4, r2: 0.1, h: 6}} color="#E8C04A" position={[0, 96, 0]} outline={0.05} />
		</group>
	);
};

/** A giant coast redwood, `h` metres tall. */
export const Redwood3D: React.FC<{at: V3; h?: number; seed?: number}> = ({at, h = 116, seed = 0}) => {
	const clumps: Copy[] = [];
	for (let i = 0; i < 26; i++) {
		const y = h * (0.42 + 0.56 * (i / 26));
		const spread = (1 - i / 26) * 9 + 3;
		const a = rnd(seed * 7 + i) * Math.PI * 2;
		clumps.push({p: [Math.cos(a) * spread * 0.5, y, Math.sin(a) * spread * 0.5], s: [spread, spread * 0.55, spread], c: i % 3 ? '#2E6A3A' : '#3A8A4A'});
	}
	return (
		<group position={at}>
			<T shape={{kind: 'cyl', r: 4.5, r2: 1.2, h: h, seg: 12}} color="#8A4A32" position={[0, h / 2, 0]} outline={0.2} />
			<Many kind={`redwood${seed}${h}`} geom={ball} items={clumps} outline={0.25} />
		</group>
	);
};

/** The Eiffel Tower, `h` tall (330 m real), base at `at`. Stylised: four curved legs, platforms, a tapering spire. */
export const Eiffel3D: React.FC<{at: V3; h?: number}> = ({at, h = 330}) => {
	const k = h / 330;
	const iron = '#8A5A3A';
	const legs = [0, 1, 2, 3].map((i) => {
		const a = (i * Math.PI) / 2 + Math.PI / 4;
		return (
			<group key={i} rotation={[0, a, 0]}>
				<T shape={{kind: 'box', w: 14 * k, h: 62 * k, d: 14 * k}} color={iron} position={[0, 30 * k, 44 * k]} rotation={[0.48, 0, 0]} outline={0.6 * k} />
				<T shape={{kind: 'box', w: 10 * k, h: 64 * k, d: 10 * k}} color={iron} position={[0, 88 * k, 20 * k]} rotation={[0.28, 0, 0]} outline={0.5 * k} />
			</group>
		);
	});
	return (
		<group position={at}>
			{legs}
			<T shape={{kind: 'box', w: 72 * k, h: 6 * k, d: 72 * k}} color="#6A4A32" position={[0, 58 * k, 0]} outline={0.6 * k} />
			<T shape={{kind: 'box', w: 44 * k, h: 5 * k, d: 44 * k}} color="#6A4A32" position={[0, 116 * k, 0]} outline={0.5 * k} />
			<Geo make={() => new THREE.CylinderGeometry(4, 20, 160, 4, 1).rotateY(Math.PI / 4)} k="eiffelUp" color={iron} position={[0, 196 * k, 0]} scale={k} outline={0.5 * k} />
			<T shape={{kind: 'box', w: 12 * k, h: 6 * k, d: 12 * k}} color="#6A4A32" position={[0, 278 * k, 0]} outline={0.3 * k} />
			<T shape={{kind: 'cyl', r: 1.2 * k, r2: 0.4 * k, h: 50 * k}} color="#B8B8C8" position={[0, 305 * k, 0]} outline={0.2 * k} />
			{[0, 1, 2, 3].map((i) => {
				const a = (i * Math.PI) / 2;
				return <T key={i} shape={{kind: 'torus', r: 22 * k, tube: 2 * k}} color={iron} position={[Math.sin(a) * 34 * k, 32 * k, Math.cos(a) * 34 * k]} rotation={[0, a, 0]} scale={[1, 1.1, 0.4]} outline={0.3 * k} />;
			})}
		</group>
	);
};

/** A big beam balance (studio), arms tilted by `tilt` radians (+ = left pan down). Pans hang at x = ±arm. */
export const Balance3D: React.FC<{at: V3; arm?: number; tilt?: number; h?: number; children?: [React.ReactNode, React.ReactNode]}> = ({at, arm = 8, tilt = 0, h = 9, children}) => {
	const dy = Math.sin(tilt) * arm;
	return (
		<group position={at}>
			<T shape={{kind: 'cyl', r: 2.6, r2: 3.2, h: 0.8}} color="#E8C04A" position={[0, 0.4, 0]} outline={0.08} />
			<T shape={{kind: 'cyl', r: 0.35, h: h}} color="#E8C04A" position={[0, h / 2, 0]} outline={0.06} />
			<T shape={{kind: 'cone', r: 0.9, h: 1.4}} color="#FFD84A" position={[0, h + 0.4, 0]} outline={0.06} />
			<group position={[0, h, 0]} rotation={[0, 0, tilt]}>
				<T shape={{kind: 'box', w: arm * 2 + 1, h: 0.4, d: 0.5}} color="#E8C04A" outline={0.06} />
			</group>
			{[-1, 1].map((s, i) => {
				const py = h + (s < 0 ? dy : -dy) - 4;
				return (
					<group key={s} position={[s * arm * Math.cos(tilt), 0, 0]}>
						{[-1, 1].map((q) => (
							<T key={q} shape={{kind: 'cyl', r: 0.05, h: 4}} color="#8A8AA8" position={[q * 1.6, py + 2, 0]} rotation={[0, 0, -q * 0.38]} outline={0} />
						))}
						<T shape={{kind: 'cyl', r: 3.2, r2: 2.4, h: 0.5}} color="#F2D06A" position={[0, py - 0.2, 0]} outline={0.06} />
						<group position={[0, py, 0]}>{children?.[i]}</group>
					</group>
				);
			})}
		</group>
	);
};

// ---------------------------------------------------------------- the river, the bridge, the reservoir

/** Water with drifting light streaks: a rectangle `w` × `d` (river or flood), or a disc of radius `r`. */
export const Water8: React.FC<{at?: V3; w?: number; d?: number; r?: number; frame: number; color?: string; caps?: string; flow?: number; n?: number}> = ({at = [0, 0, 0], w = 60, d = 300, r, frame, color = '#3A7AC0', caps = '#CFE6FF', flow = 0.05, n = 60}) => {
	const items: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const u = rnd(i * 1.7) - 0.5;
		const v = rnd(i * 3.1) - 0.5;
		const t = (frame * 0.01 + rnd(i * 4.4)) % 1;
		const s = Math.sin(t * Math.PI);
		const size = r ? r * 2 : Math.min(w, d);
		const along = r ? 0 : (((v + 0.5 + frame * flow * 0.004) % 1) - 0.5) * d;
		items.push({p: [u * (r ? r * 1.4 : w * 0.9), 0.08, r ? v * r * 1.4 : along], s: [size * 0.05 * s + 0.01, 0.04, size * 0.012 * s + 0.01], c: caps});
	}
	return (
		<group position={at}>
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				{r ? <circleGeometry args={[r, 48]} /> : <planeGeometry args={[w, d]} />}
				<meshToonMaterial color={color} gradientMap={toonRamp()} />
			</mesh>
			<Many kind={`water${n}${r ?? w}`} geom={ball} items={items} outline={0} glow shadow={false} opacity={0.8} />
		</group>
	);
};

/**
 * An old stone bridge along x with three arches, `len` long, deck at height
 * `top`. `crack` 0..1 opens dark cracks and loosens stones; `fall` 0..1 drops
 * the middle span into the river.
 */
export const Bridge3D: React.FC<{at: V3; yaw?: number; len?: number; top?: number; crack?: number; fall?: number; drop?: number}> = ({at, yaw = 0, len = 66, top = 9, crack = 0, fall = 0, drop = 0}) => {
	const stone = '#B8A890';
	const dark = '#8A7A68';
	const span = len / 3;
	const w = 9;
	const part = (i: number) => {
		const mid = i === 1;
		const dy = mid ? -fall * (top + 4) : 0;
		const tilt = mid ? fall * 0.35 : 0;
		return (
			<group key={i} position={[-len / 2 + span * (i + 0.5), dy, 0]} rotation={[tilt * 0.4, 0, tilt]}>
				<T shape={{kind: 'box', w: span, h: 1.6, d: w}} color={stone} position={[0, top - 0.8, 0]} outline={0.08} />
				<T shape={{kind: 'box', w: span, h: 0.15, d: w - 2}} color="#55597A" position={[0, top + 0.05, 0]} outline={0} />
				{[-1, 1].map((s) => (
					<T key={s} shape={{kind: 'box', w: span, h: 1.1, d: 0.6}} color={dark} position={[0, top + 0.55, s * (w / 2 - 0.3)]} outline={0.05} />
				))}
				{/* the arch: a wall from the river up to the deck, with a round-topped hole */}
				<Geo make={() => {
					const R = span / 2;
					const sh = new THREE.Shape();
					sh.moveTo(-R, -2);
					sh.lineTo(R, -2);
					sh.lineTo(R, top - 1.6);
					sh.lineTo(-R, top - 1.6);
					sh.closePath();
					const hole = new THREE.Path();
					const r = R * 0.78;
					const spring = Math.max(0.5, top - 2.6 - r * 0.75);
					hole.moveTo(-r, -1.4);
					hole.lineTo(r, -1.4);
					hole.lineTo(r, spring);
					hole.absellipse(0, spring, r, r * 0.75, 0, Math.PI, false, 0);
					hole.lineTo(-r, -1.4);
					sh.holes.push(hole);
					const g = new THREE.ExtrudeGeometry(sh, {depth: w - 0.4, bevelEnabled: false});
					g.translate(0, 0, -(w - 0.4) / 2);
					return g;
				}} k={`arch${span}${top}${w}`} color={stone} outline={0.06} />
				{crack > 0 && (i === 1 || i === 0) ? (
					<group>
						{[...Array(5)].map((_, j) =>
							[-1, 1].map((side) => (
								<T key={`${j}${side}`} shape={{kind: 'box', w: 0.18, h: 2.4 + j * 0.5, d: 0.08}} color="#2A2236" position={[(i === 1 ? -span / 2 + 0.6 : span / 2 - 0.6) + (rnd(j + i * 7) - 0.5) * 2.4, top - 1.6 - j * 0.35, side * (w / 2 - 0.15)]} rotation={[0, 0, (rnd(j * 3) - 0.5) * 1.1]} scale={[1, crack, 1]} outline={0} />
							)),
						)}
					</group>
				) : null}
			</group>
		);
	};
	const stones = [...Array(8)].map((_, j) => {
		const t = Math.max(0, Math.min(1, drop * 8 - j));
		const x = -span / 2 + (rnd(j * 5.3) - 0.5) * span * 0.6;
		const z = (rnd(j * 2.1) - 0.5) * w;
		return t > 0 ? <T key={j} shape={{kind: 'box', w: 1.6, h: 1, d: 1.2}} color={stone} position={[x, top - 1 - t * t * (top + 2), z]} rotation={[t * 3, t * 2, 0]} outline={0.05} /> : null;
	});
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			{[0, 1, 2].map(part)}
			{stones}
			{[-1, 1].map((s) => (
				<T key={s} shape={{kind: 'box', w: 14, h: top, d: w + 2}} color="#9AA078" position={[s * (len / 2 + 7), top / 2 - 0.5, 0]} outline={0.08} />
			))}
		</group>
	);
};

// ---------------------------------------------------------------- animals (studio)

/** A giraffe, facing +z, about 5.5 m tall at s = 1. `flow` 0..1 runs a red blood drop up the neck. */
export const Giraffe3D: React.FC<{at: V3; yaw?: number; s?: number; flow?: number; frame?: number}> = ({at, yaw = 0, s = 1, flow = -1, frame = 0}) => {
	const coat = '#F2B84A';
	const spot = '#A8602A';
	const spots: Copy[] = [];
	for (let i = 0; i < 26; i++) {
		const a = rnd(i * 1.9) * Math.PI * 2;
		const z = (rnd(i * 2.7) - 0.5) * 2;
		spots.push({p: [Math.cos(a) * 0.62, 2.7 + Math.sin(a) * 0.5, z], s: [0.18, 0.16, 0.18], c: spot});
	}
	const neckA = 0.45;
	const neckLen = 2.6;
	const n0: V3 = [0, 2.9, 0.9];
	const nAt = (t: number): V3 => [0, n0[1] + Math.cos(neckA) * neckLen * t, n0[2] + Math.sin(neckA) * neckLen * t];
	const drop = flow >= 0 ? nAt(flow) : null;
	return (
		<group position={at} rotation={[0, yaw, 0]} scale={s}>
			<T shape={{kind: 'capsule', r: 0.62, len: 1.5}} color={coat} position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.04} />
			<Many kind="giraffeSpots" geom={ball} items={spots} outline={0} />
			{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'capsule', r: 0.12, len: 2.1}} color={coat} position={[x * 0.38, 1.15, z * 0.75]} outline={0.03} />))}
			<T shape={{kind: 'capsule', r: 0.24, len: neckLen}} color={coat} position={nAt(0.5)} rotation={[neckA, 0, 0]} outline={0.03} />
			{[0.2, 0.45, 0.7].map((t, i) => <T key={i} shape={{kind: 'sphere', r: 0.12}} color={spot} position={[0.18, nAt(t)[1], nAt(t)[2]]} outline={0} />)}
			<group position={nAt(1.05)}>
				<T shape={{kind: 'capsule', r: 0.24, len: 0.55}} color={coat} position={[0, 0.05, 0.22]} rotation={[Math.PI / 2 - 0.3, 0, 0]} outline={0.03} />
				{[-1, 1].map((x) => (
					<group key={x}>
						<T shape={{kind: 'cyl', r: 0.05, h: 0.4}} color={spot} position={[x * 0.12, 0.38, -0.05]} outline={0.02} />
						<T shape={{kind: 'sphere', r: 0.08}} color="#6A3A1A" position={[x * 0.12, 0.6, -0.05]} outline={0.02} />
						<T shape={{kind: 'sphere', r: 0.07}} color={INK} position={[x * 0.2, 0.15, 0.3]} outline={0} />
						<T shape={{kind: 'sphere', r: 0.13}} color={coat} position={[x * 0.3, 0.25, -0.1]} scale={[1.6, 0.6, 0.8]} outline={0.02} />
					</group>
				))}
			</group>
			<T shape={{kind: 'cyl', r: 0.05, h: 0.9}} color={coat} position={[0, 2.8, -1.4]} rotation={[0.6 + Math.sin(frame * 0.2) * 0.2, 0, 0]} outline={0.02} />
			{drop ? <Glow shape={{kind: 'sphere', r: 0.2}} color="#FF3A4A" position={[0.3, drop[1], drop[2]]} /> : null}
		</group>
	);
};

/** An elephant facing +z, about 3.2 m at the shoulder at s = 1. `flap` 0..1 swings the ears; `hot` shows red veins in them. */
export const Elephant3D: React.FC<{at: V3; yaw?: number; s?: number; flap?: number; hot?: number; trunk?: number; rumble?: number}> = ({at, yaw = 0, s = 1, flap = 0, hot = 0, trunk = 0, rumble = 0}) => {
	const skin = '#9A9AB8';
	const ear = hot > 0 ? '#' + new THREE.Color('#B8B8D0').lerp(new THREE.Color('#FF7A8A'), hot).getHexString() : '#B8B8D0';
	return (
		<group position={at} rotation={[0, yaw, 0]} scale={s}>
			<T shape={{kind: 'sphere', r: 1}} color={skin} position={[0, 2.25, -0.2]} scale={[1.25, 1.1, 1.7]} outline={0.04} />
			{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.36, h: 1.6}} color={skin} position={[x * 0.62, 0.8, z * 0.95 - 0.2]} outline={0.03} />))}
			<group position={[0, 2.7, 1.45]} rotation={[rumble * 0.05, 0, 0]}>
				<T shape={{kind: 'sphere', r: 0.85}} color={skin} outline={0.04} />
				{[-1, 1].map((x) => (
					<group key={x} position={[x * 0.62, 0.1, -0.2]} rotation={[0, x * (0.25 + flap * 0.9), 0]}>
						<T shape={{kind: 'sphere', r: 1}} color={ear} position={[x * 0.75, -0.1, -0.1]} scale={[0.9, 1.05, 0.1]} outline={0.03} />
						{hot > 0
							? [0, 1, 2].map((v) => <T key={v} shape={{kind: 'box', w: 0.9, h: 0.06, d: 0.05}} color="#D82A4A" position={[x * 0.75, 0.3 - v * 0.35, x > 0 ? 0.0 : 0.0]} rotation={[0, 0, (v - 1) * 0.4]} outline={0} />)
							: null}
					</group>
				))}
				{[-1, 1].map((x) => <T key={x} shape={{kind: 'sphere', r: 0.09}} color={INK} position={[x * 0.42, 0.18, 0.7]} outline={0} />)}
				<T shape={{kind: 'capsule', r: 0.2, len: 1.6}} color={skin} position={[0, -1.0, 0.75 + trunk * 0.4]} rotation={[0.2 + trunk * 0.9, 0, 0]} outline={0.03} />
				{[-1, 1].map((x) => <T key={x} shape={{kind: 'cone', r: 0.09, h: 0.7}} color="#FFF8E8" position={[x * 0.32, -0.45, 0.7]} rotation={[1.9, 0, 0]} outline={0.02} />)}
			</group>
			<T shape={{kind: 'cyl', r: 0.04, h: 0.8}} color={skin} position={[0, 2.1, -1.95]} rotation={[0.4, 0, 0]} outline={0.02} />
		</group>
	);
};

// ---------------------------------------------------------------- machines

export const Drone3D: React.FC<{at: V3; frame: number; yaw?: number; s?: number; laser?: number}> = ({at, frame, yaw = 0, s = 1, laser = 0}) => (
	<group position={at} rotation={[0, yaw, 0]} scale={s}>
		<T shape={{kind: 'box', w: 0.4, h: 0.15, d: 0.4}} color="#2A2638" outline={0.015} />
		{[0, 1, 2, 3].map((i) => {
			const a = (i * Math.PI) / 2 + Math.PI / 4;
			return (
				<group key={i} position={[Math.cos(a) * 0.35, 0.05, Math.sin(a) * 0.35]}>
					<T shape={{kind: 'box', w: 0.04, h: 0.04, d: 0.3}} color="#4A4660" rotation={[0, -a + Math.PI / 2, 0]} position={[-Math.cos(a) * 0.15, 0, -Math.sin(a) * 0.15]} outline={0} />
					<group rotation={[0, frame * 1.7 + i, 0]}>
						<T shape={{kind: 'box', w: 0.3, h: 0.01, d: 0.04}} color="#CFE6F5" position={[0, 0.06, 0]} outline={0} />
					</group>
				</group>
			);
		})}
		<Glow shape={{kind: 'sphere', r: 0.04}} color="#FF3A4A" position={[0, -0.06, 0.2]} />
		{laser > 0 ? <Glow shape={{kind: 'cyl', r: 0.02, h: 30 * laser}} color="#FF3A4A" position={[0, -0.08, 0.2 + 15 * laser]} rotation={[Math.PI / 2, 0, 0]} opacity={0.8} /> : null}
	</group>
);

export const Helicopter3D: React.FC<{at: V3; frame: number; yaw?: number; s?: number; color?: string; spot?: number}> = ({at, frame, yaw = 0, s = 1, color = '#E8453C', spot = 0}) => (
	<group position={at} rotation={[0, yaw, 0]} scale={s}>
		<T shape={{kind: 'sphere', r: 1.3}} color={color} scale={[1, 0.95, 1.5]} outline={0.04} />
		<Glow shape={{kind: 'sphere', r: 0.9}} color="#CFE6F5" position={[0, 0.25, 1.05]} />
		<T shape={{kind: 'box', w: 0.3, h: 0.35, d: 4}} color={color} position={[0, 0.2, -3]} outline={0.03} />
		<T shape={{kind: 'box', w: 0.1, h: 1.2, d: 0.6}} color={color} position={[0, 0.7, -4.9]} outline={0.02} />
		<group position={[0, 1.4, 0]} rotation={[0, frame * 1.3, 0]}>
			<T shape={{kind: 'box', w: 8, h: 0.06, d: 0.3}} color="#3A3650" outline={0} />
			<T shape={{kind: 'box', w: 0.3, h: 0.06, d: 8}} color="#3A3650" outline={0} />
		</group>
		<T shape={{kind: 'cyl', r: 0.12, h: 0.5}} color="#3A3650" position={[0, 1.15, 0]} outline={0} />
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'box', w: 0.1, h: 0.1, d: 2.6}} color="#3A3650" position={[x * 0.8, -1.3, 0]} outline={0.01} />)}
		{spot > 0 ? <Glow shape={{kind: 'cone', r: 4, h: 18}} color="#FFF6C8" position={[0, -10, 0.5]} opacity={0.18 * spot} /> : null}
	</group>
);

export const Van3D: React.FC<{at: V3; yaw?: number; color?: string; stripe?: string}> = ({at, yaw = 0, color = '#F4F2FF', stripe = '#2E8AE8'}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: 2.1, h: 2.3, d: 5.2}} color={color} position={[0, 1.55, 0]} outline={0.04} />
		<T shape={{kind: 'box', w: 2.12, h: 0.4, d: 5.22}} color={stripe} position={[0, 1.5, 0]} outline={0} />
		<Glow shape={{kind: 'box', w: 1.9, h: 0.8, d: 0.05}} color="#CFE6F5" position={[0, 2.1, 2.62]} />
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.4, h: 0.3}} color="#2A2638" position={[x * 0.95, 0.4, z * 1.7]} rotation={[0, 0, Math.PI / 2]} outline={0.02} />))}
		<T shape={{kind: 'box', w: 0.8, h: 0.5, d: 0.8}} color="#8A8AA8" position={[0, 2.95, -1]} outline={0.02} />
	</group>
);

export const Lorry3D: React.FC<{at: V3; yaw?: number; rot?: V3; color?: string}> = ({at, yaw = 0, rot, color = '#2E8AE8'}) => (
	<group position={at} rotation={rot ?? [0, yaw, 0]}>
		<T shape={{kind: 'box', w: 2.4, h: 2.6, d: 2.2}} color={color} position={[0, 1.7, 3.6]} outline={0.04} />
		<Glow shape={{kind: 'box', w: 2.2, h: 0.9, d: 0.05}} color="#CFE6F5" position={[0, 2.3, 4.72]} />
		<T shape={{kind: 'box', w: 2.5, h: 3, d: 6.8}} color="#F2F2F2" position={[0, 2, -1]} outline={0.04} />
		<T shape={{kind: 'box', w: 2.52, h: 0.5, d: 6.82}} color={color} position={[0, 2.6, -1]} outline={0} />
		{[3.6, 0.2, -3].map((z) => [-1, 1].map((x) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.5, h: 0.4}} color="#2A2638" position={[x * 1.1, 0.5, z]} rotation={[0, 0, Math.PI / 2]} outline={0.02} />))}
	</group>
);

export const Kite3D: React.FC<{at: V3; rot?: V3; s?: number; frame?: number}> = ({at, rot, s = 1, frame = 0}) => (
	<group position={at} rotation={rot} scale={s}>
		<Geo make={() => {
			const sh = new THREE.Shape();
			sh.moveTo(0, 0.6);
			sh.lineTo(0.4, 0);
			sh.lineTo(0, -0.9);
			sh.lineTo(-0.4, 0);
			sh.closePath();
			return new THREE.ExtrudeGeometry(sh, {depth: 0.02, bevelEnabled: false});
		}} k="kite" color="#E8453C" outline={0.015} />
		{[0, 1, 2, 3].map((i) => (
			<T key={i} shape={{kind: 'box', w: 0.14, h: 0.08, d: 0.02}} color={['#FFD84A', '#2E8AE8', '#3AB87A', '#FFD84A'][i]} position={[Math.sin(frame * 0.2 + i) * 0.08, -1.1 - i * 0.3, 0]} rotation={[0, 0, 0.5]} outline={0} />
		))}
	</group>
);

/** A round oak tree, about `h` tall. */
export const Oak3D: React.FC<{at: V3; h?: number; seed?: number}> = ({at, h = 16, seed = 0}) => {
	const items: Copy[] = [];
	for (let i = 0; i < 9; i++) {
		const a = rnd(seed * 5 + i) * Math.PI * 2;
		const r = h * (0.18 + rnd(i * 3 + seed) * 0.08);
		items.push({p: [Math.cos(a) * h * 0.18, h * (0.62 + rnd(i * 7) * 0.2), Math.sin(a) * h * 0.18], s: [r, r * 0.9, r], c: i % 2 ? '#3A9A4A' : '#58B85A'});
	}
	return (
		<group position={at}>
			<T shape={{kind: 'cyl', r: h * 0.05, r2: h * 0.035, h: h * 0.6}} color="#7A5A3A" position={[0, h * 0.3, 0]} outline={0.06} />
			<Many kind={`oak${seed}${h}`} geom={ball} items={items} outline={0.1} />
		</group>
	);
};

/** A ginger cat, facing +z, about 0.45 m long. `climb` tips it up a trunk. */
export const Cat8: React.FC<{at: V3; yaw?: number; rot?: V3; s?: number}> = ({at, yaw = 0, rot, s = 1}) => (
	<group position={at} rotation={rot ?? [0, yaw, 0]} scale={s}>
		<T shape={{kind: 'capsule', r: 0.11, len: 0.25}} color="#F29A3A" position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.012} />
		<T shape={{kind: 'sphere', r: 0.1}} color="#F29A3A" position={[0, 0.3, 0.22]} outline={0.012} />
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'cone', r: 0.04, h: 0.08}} color="#F29A3A" position={[x * 0.06, 0.4, 0.22]} outline={0.008} />)}
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'sphere', r: 0.018}} color={INK} position={[x * 0.04, 0.32, 0.31]} outline={0} />)}
		<T shape={{kind: 'capsule', r: 0.025, len: 0.25}} color="#F29A3A" position={[0, 0.32, -0.25]} rotation={[-0.7, 0, 0]} outline={0.008} />
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.03, h: 0.14}} color="#F29A3A" position={[x * 0.06, 0.07, z * 0.12]} outline={0.006} />))}
	</group>
);

// ---------------------------------------------------------------- town things

/** A row of washing-line posts with pants on the line; `blown` 0..1 lifts them off and floats them away along +x. */
export const Washing3D: React.FC<{at: V3; yaw?: number; len?: number; blown?: number; seed?: number; ps?: number}> = ({at, yaw = 0, len = 8, blown = 0, seed = 0, ps = 1}) => {
	const cols = ['#FF7AA8', '#2E8AE8', '#FFD84A', '#3AB87A', '#FFFFFF', '#E8453C'];
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			{[-1, 1].map((s) => <T key={s} shape={{kind: 'cyl', r: 0.05, h: 2}} color="#C8C8D8" position={[(s * len) / 2, 1, 0]} outline={0.01} />)}
			<T shape={{kind: 'box', w: len, h: 0.02, d: 0.02}} color="#F2F2F2" position={[0, 1.95, 0]} outline={0} />
			{[...Array(5)].map((_, i) => {
				const t = Math.max(0, Math.min(1, blown * 1.6 - i * 0.12));
				const x = -len / 2 + 1 + i * ((len - 2) / 4) + t * t * (30 + i * 6);
				const y = 1.75 + t * (14 + rnd(i + seed) * 10) - t * t * 6;
				const z = t * (rnd(i * 3 + seed) - 0.5) * 12;
				return <Pants3D key={i} at={[x, y, z]} color={cols[(i + seed) % cols.length]} rot={[t * 2, t * 4 * (i % 2 ? 1 : -1), t * 1.5]} s={ps} />;
			})}
		</group>
	);
};

export const Pants3D: React.FC<{at: V3; color: string; rot?: V3; s?: number}> = ({at, color, rot, s = 1}) => (
	<group position={at} rotation={rot} scale={s}>
		<T shape={{kind: 'box', w: 0.5, h: 0.18, d: 0.04}} color={color} position={[0, 0.06, 0]} outline={0.008} />
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'box', w: 0.2, h: 0.22, d: 0.04}} color={color} position={[x * 0.15, -0.12, 0]} rotation={[0, 0, x * 0.2]} outline={0.008} />)}
	</group>
);

export const Church3D: React.FC<{at: V3; yaw?: number}> = ({at, yaw = 0}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: 10, h: 9, d: 22}} color="#C8C0B0" position={[0, 4.5, 0]} outline={0.08} />
		<Geo make={prism(11, 6, 23)} k="churchRoof" color="#5A5E8A" position={[0, 9, 0]} outline={0.08} />
		<T shape={{kind: 'box', w: 6, h: 22, d: 6}} color="#C8C0B0" position={[0, 11, 13]} outline={0.08} />
		<Geo make={() => new THREE.ConeGeometry(4.6, 14, 4).rotateY(Math.PI / 4)} k="churchSpire" color="#5A5E8A" position={[0, 29, 13]} outline={0.08} />
		{[-6, -2, 2, 6].map((z) => [-1, 1].map((x) => <Glow key={`${x}${z}`} shape={{kind: 'box', w: 0.1, h: 3.4, d: 1.4}} color="#8AC8F0" position={[x * 5.02, 5, z]} />))}
	</group>
);

export const Shops3D: React.FC<{at: V3; yaw?: number; n?: number; lit?: boolean}> = ({at, yaw = 0, n = 4, lit = false}) => {
	const cols = ['#E8453C', '#2E8AE8', '#3AB87A', '#FFD84A', '#8A5AE8'];
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			{[...Array(n)].map((_, i) => (
				<group key={i} position={[(i - (n - 1) / 2) * 8, 0, 0]}>
					<T shape={{kind: 'box', w: 7.8, h: 8, d: 10}} color={WALLS[(i + 2) % WALLS.length]} position={[0, 4, 0]} outline={0.06} />
					<T shape={{kind: 'box', w: 7.8, h: 0.4, d: 10.4}} color="#8A8EA8" position={[0, 8.2, 0]} outline={0.04} />
					<Glow shape={{kind: 'box', w: 6, h: 2.6, d: 0.05}} color={lit ? '#FFD98A' : '#CFE6F5'} position={[0, 1.8, 5.02]} />
					<T shape={{kind: 'box', w: 7, h: 0.9, d: 1.6}} color={cols[i % cols.length]} position={[0, 3.6, 5.6]} rotation={[0.35, 0, 0]} outline={0.03} />
				</group>
			))}
		</group>
	);
};

export const Pavilion3D: React.FC<{at: V3; yaw?: number}> = ({at, yaw = 0}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: 14, h: 4, d: 7}} color="#F6F2E8" position={[0, 2, 0]} outline={0.06} />
		<Geo make={prism(15, 3, 8)} k="pavRoof" color="#3A8A6A" position={[0, 4, 0]} outline={0.06} />
		<T shape={{kind: 'box', w: 1.4, h: 1.2, d: 1.4}} color="#F6F2E8" position={[0, 7.2, 0]} outline={0.03} />
		<Glow shape={{kind: 'cyl', r: 0.45, h: 0.1}} color="#FFFFFF" position={[0, 7.3, 0.72]} rotation={[Math.PI / 2, 0, 0]} />
	</group>
);

/** A hill: a flattened green dome, radius `r`, height `h`. */
export const Hill3D: React.FC<{at: V3; r?: number; h?: number; color?: string}> = ({at, r = 60, h = 14, color = '#6CC25A'}) => (
	<T shape={{kind: 'sphere', r: 1, seg: 40}} color={color} position={at} scale={[r, h, r]} outline={0} />
);

/** Police tape round a circle: posts and red-white stripes. */
export const PoliceTape3D: React.FC<{at: V3; r?: number; posts?: number}> = ({at, r = 120, posts = 28}) => {
	const items: Copy[] = [];
	const tape: Copy[] = [];
	for (let i = 0; i < posts; i++) {
		const a = (i / posts) * Math.PI * 2;
		const a2 = ((i + 1) / posts) * Math.PI * 2;
		const p: V3 = [Math.cos(a) * r, 0.6, Math.sin(a) * r];
		items.push({p, s: [0.12, 1.2, 0.12], c: '#F2F2F2'});
		const seg = 6;
		for (let k = 0; k < seg; k++) {
			const t = (k + 0.5) / seg;
			const aa = a + (a2 - a) * t;
			const L = ((a2 - a) * r) / seg;
			tape.push({p: [Math.cos(aa) * r, 1.0, Math.sin(aa) * r], s: [L, 0.18, 0.04], r: [0, -aa + Math.PI / 2, 0], c: k % 2 ? '#F2F2F2' : '#E8333F'});
		}
	}
	return (
		<group position={at}>
			<Many kind={`tapePosts${posts}${r}`} geom={box} items={items} outline={0} />
			<Many kind={`tape${posts}${r}`} geom={box} items={tape} outline={0} shadow={false} />
		</group>
	);
};

export const Bathtub3D: React.FC<{at: V3; yaw?: number; soup?: boolean}> = ({at, yaw = 0, soup = true}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'capsule', r: 0.42, len: 0.9}} color="#F6F6FF" position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.85, 1.2]} outline={0.02} />
		{soup ? <T shape={{kind: 'box', w: 1.2, h: 0.04, d: 0.68}} color="#E8823A" position={[0, 0.75, 0]} outline={0} /> : null}
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'sphere', r: 0.07}} color="#E8C04A" position={[x * 0.6, 0.06, z * 0.32]} outline={0.01} />))}
	</group>
);

/** A slice-cut pizza, radius r. */
export const Pizza3D: React.FC<{at: V3; r?: number; rot?: V3}> = ({at, r = 0.2, rot}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'cyl', r, h: r * 0.12}} color="#E8B86A" outline={r * 0.06} />
		<T shape={{kind: 'cyl', r: r * 0.86, h: r * 0.14}} color="#E8453C" position={[0, r * 0.02, 0]} outline={0} />
		<T shape={{kind: 'cyl', r: r * 0.8, h: r * 0.16}} color="#FFE08A" position={[0, r * 0.03, 0]} scale={[1, 1, 0.9]} outline={0} />
		{[0, 1, 2, 3, 4].map((i) => <T key={i} shape={{kind: 'cyl', r: r * 0.12, h: r * 0.2}} color="#B8262E" position={[Math.cos(i * 1.3) * r * 0.5, r * 0.05, Math.sin(i * 1.3) * r * 0.5]} outline={0} />)}
	</group>
);

/** A heap of pizzas (`n` of them). */
export const PizzaPile: React.FC<{at: V3; n?: number; r?: number}> = ({at, n = 300, r = 6}) => {
	const crust: Copy[] = [];
	const top: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const u = rnd(i * 1.7);
		const a = rnd(i * 2.9) * Math.PI * 2;
		const rr = Math.sqrt(u) * r;
		const y = (1 - rr / r) * r * 0.75 + rnd(i * 4.1) * 0.3;
		const tilt: V3 = [(rnd(i) - 0.5) * 0.9, 0, (rnd(i * 5) - 0.5) * 0.9];
		crust.push({p: [Math.cos(a) * rr, y, Math.sin(a) * rr], s: [0.5, 0.06, 0.5], r: tilt, c: '#E8B86A'});
		top.push({p: [Math.cos(a) * rr, y + 0.035, Math.sin(a) * rr], s: [0.42, 0.04, 0.42], r: tilt, c: i % 4 ? '#E8453C' : '#FFE08A'});
	}
	return (
		<group position={at}>
			<Many kind={`pizC${n}${r}`} geom={cyl} items={crust} outline={0.02} />
			<Many kind={`pizT${n}${r}`} geom={cyl} items={top} outline={0} />
		</group>
	);
};

/** Dinner trays on trolleys: `rows` of stacked trays with food. */
export const Trays3D: React.FC<{at: V3; n?: number}> = ({at, n = 6}) => {
	const items: Copy[] = [];
	const food: Copy[] = [];
	for (let i = 0; i < n; i++) {
		for (let k = 0; k < 6; k++) {
			const p: V3 = [(i - (n - 1) / 2) * 1.2, 0.3 + k * 0.22, 0];
			items.push({p, s: [0.9, 0.04, 0.6], c: k % 2 ? '#2E8AE8' : '#E8453C'});
			food.push({p: [p[0] - 0.2, p[1] + 0.06, 0.1], s: [0.12, 0.06, 0.12], c: '#FFD84A'});
			food.push({p: [p[0] + 0.2, p[1] + 0.06, -0.1], s: [0.14, 0.06, 0.1], c: '#7AD06A'});
		}
	}
	return (
		<group position={at}>
			<Many kind={`trays${n}`} geom={box} items={items} outline={0.01} />
			<Many kind={`trayFood${n}`} geom={ball} items={food} outline={0} />
		</group>
	);
};

/** A billboard on two legs, face towards +z. */
export const Billboard3D: React.FC<{at: V3; rot?: V3; w?: number; h?: number; color?: string}> = ({at, rot, w = 12, h = 5, color = '#FFD84A'}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'box', w, h, d: 0.3}} color={color} position={[0, 0, 0]} outline={0.05} />
		<T shape={{kind: 'box', w: w * 0.7, h: h * 0.3, d: 0.32}} color="#E8453C" position={[-w * 0.05, h * 0.12, 0]} outline={0} />
		<T shape={{kind: 'box', w: w * 0.5, h: h * 0.14, d: 0.32}} color="#2A2350" position={[-w * 0.12, -h * 0.25, 0]} outline={0} />
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'box', w: 0.3, h: h * 1.2, d: 0.3}} color="#4A4660" position={[x * w * 0.3, -h * 0.9, -0.2]} outline={0.02} />)}
	</group>
);

/** A stadium bowl (studio): stands round an oval pitch, a crowd that bounces by `bounce`. */
export const Stadium3D: React.FC<{at: V3; frame: number; bounce?: number; s?: number}> = ({at, frame, bounce = 1, s = 1}) => {
	const crowd: Copy[] = [];
	const cols = ['#FF7AA8', '#FFD84A', '#2E8AE8', '#E8453C', '#B88AFF', '#FFFFFF'];
	for (let ring = 0; ring < 5; ring++) {
		const n = 46 + ring * 6;
		for (let i = 0; i < n; i++) {
			const a = (i / n) * Math.PI * 2;
			const rx = 7.2 + ring * 0.8;
			const rz = 4.8 + ring * 0.8;
			const hop = Math.max(0, Math.sin(frame * 0.55 + (i % 3))) * 0.2 * bounce;
			crowd.push({p: [Math.cos(a) * rx, 0.9 + ring * 0.55 + hop, Math.sin(a) * rz], s: [0.18, 0.28, 0.18], c: cols[(i + ring) % cols.length]});
		}
	}
	return (
		<group position={at} scale={s}>
			<T shape={{kind: 'cyl', r: 11, r2: 8.5, h: 3.4}} color="#8A8EB8" position={[0, 1.7, 0]} scale={[1, 1, 0.7]} outline={0.06} />
			<T shape={{kind: 'cyl', r: 7, h: 0.2}} color="#5AB86A" position={[0, 0.6, 0]} scale={[1, 1, 0.68]} outline={0} />
			<Many kind="stadiumCrowd" geom={ball} items={crowd} outline={0.015} />
			<T shape={{kind: 'box', w: 4, h: 1.2, d: 1}} color="#2A2350" position={[0, 1.2, -3.6]} outline={0.03} />
		</group>
	);
};

/** A goal: two posts and a crossbar, `w` wide, `h` high, facing +z. */
export const Goal8: React.FC<{at: V3; w?: number; h?: number; yaw?: number}> = ({at, w = 7.3, h = 2.4, yaw = 0}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'cyl', r: 0.06, h}} color="#FFFFFF" position={[(x * w) / 2, h / 2, 0]} outline={0.01} />)}
		<T shape={{kind: 'cyl', r: 0.06, h: w}} color="#FFFFFF" position={[0, h, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />
	</group>
);

/** A tall measuring pole with a stripe every `every` metres. */
export const Ruler3D: React.FC<{at: V3; h?: number; every?: number; w?: number}> = ({at, h = 100, every = 10, w = 2}) => {
	const items: Copy[] = [];
	for (let i = 0; i < h / every; i++) {
		items.push({p: [0, i * every + every / 2, 0], s: [w, every, w], c: i % 2 ? '#FFFFFF' : '#FFD84A'});
	}
	return (
		<group position={at}>
			<Many kind={`ruler${h}${every}${w}`} geom={box} items={items} outline={0.1} />
		</group>
	);
};
