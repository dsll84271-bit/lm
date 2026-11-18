import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Many, rnd, type Copy} from './many';
import {Glow, INK, T, toonRamp} from './toon';

// Episode 9's world: an ORIGINAL open-world game set in a real place, Miami.
// A beach, the sea, a beach-front road, pastel Art Deco hotels with neon,
// palm trees, lifeguard towers, a causeway over the bay, and the game bits:
// a mission marker, a save point, an invisible wall. Units are metres.
// Layout: sea for z > 46, sand from z = 6 to 46, the road at z = -6..4,
// hotels along z = -22 facing +z.

type V3 = [number, number, number];
const box = () => new THREE.BoxGeometry(1, 1, 1);
const ball = () => new THREE.SphereGeometry(1, 12, 8);


export const PASTEL = ['#F7B2C6', '#A8E6CF', '#FFF1A6', '#D7C2F2', '#FFC8A2', '#B8E2F2'];
export const NEON = ['#FF4FA3', '#3FF2E8', '#FFE14F', '#B86BFF', '#FF7A3F'];
export const GREY = '#8C8C98';

// ---------------------------------------------------------------- ground

/** Sand, sea, foam, the road and the pavement. `grey` 0..1 fades it all to grey (the world switching off). */
export const Beach: React.FC<{frame: number; len?: number; grey?: number; night?: boolean; seaColor?: string}> = ({frame, len = 400, grey = 0, night = false, seaColor}) => {
	const g = (c: string) => (grey > 0 ? '#' + new THREE.Color(c).lerp(new THREE.Color(GREY), grey).getHexString() : c);
	const foam: Copy[] = [];
	for (let i = 0; i < 70; i++) {
		const t = (frame * 0.01 + rnd(i * 1.7)) % 1;
		foam.push({p: [-len / 2 + rnd(i * 3.1) * len, 0.06, 46 + Math.sin(t * Math.PI) * 2.5], s: [3 + rnd(i) * 4, 0.05, 0.5], c: '#FFFFFF'});
	}
	return (
		<group>
			<T shape={{kind: 'box', w: len, h: 0.2, d: 42}} color={g(night ? '#8A7A9A' : '#F4DEA6')} position={[0, -0.1, 25]} outline={0} />
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 46 + 400]} receiveShadow>
				<planeGeometry args={[len * 3, 800]} />
				<meshToonMaterial color={g(seaColor ?? (night ? '#1E3A80' : '#2EC4D6'))} gradientMap={toonRamp()} />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 52]}>
				<planeGeometry args={[len * 3, 12]} />
				<meshToonMaterial color={g(night ? '#2A5AA0' : '#7FE6E0')} gradientMap={toonRamp()} />
			</mesh>
			{grey < 1 ? <Many kind={`foam${len}`} geom={ball} items={foam} outline={0} glow shadow={false} opacity={0.85} /> : null}
			<T shape={{kind: 'box', w: len, h: 0.2, d: 10}} color={g(night ? '#2A2650' : '#55597A')} position={[0, -0.05, -1]} outline={0} />
			{[-1, 1].map((s) => (
				<T key={s} shape={{kind: 'box', w: len, h: 0.3, d: 3}} color={g(night ? '#5A5080' : '#F2E6D8')} position={[0, 0.05, -1 + s * 6.5]} outline={0} />
			))}
			<T shape={{kind: 'box', w: len, h: 0.2, d: 12}} color={g(night ? '#4A4070' : '#E8DCCC')} position={[0, 0, -14]} outline={0} />
			<T shape={{kind: 'box', w: len * 3, h: 0.2, d: 200}} color={g(night ? '#2A2650' : '#C8C0B0')} position={[0, -0.12, -120]} outline={0} />
			{[...Array(Math.floor(len / 8))].map((_, i) => (
				<T key={i} shape={{kind: 'box', w: 2.6, h: 0.02, d: 0.2}} color={g('#F2F2F2')} position={[-len / 2 + i * 8, 0.06, -1]} outline={0} />
			))}
		</group>
	);
};

// ---------------------------------------------------------------- palms

/** A palm tree, `h` tall, leaning by `lean` radians. `wire` shows its triangles. */
export const Palm3D: React.FC<{at: V3; h?: number; lean?: number; yaw?: number; seed?: number; grey?: boolean; wire?: number; sway?: number}> = ({at, h = 9, lean = 0.12, yaw = 0, seed = 0, grey = false, wire = 0, sway = 0}) => {
	const segs = 7;
	const parts = [];
	let x = 0;
	let y = 0;
	for (let i = 0; i < segs; i++) {
		const t = i / segs;
		const a = lean * (0.3 + t * 1.2) + sway * t;
		const L = h / segs;
		parts.push(
			<group key={i} position={[x, y + L / 2, 0]} rotation={[0, 0, -a]}>
				<T shape={{kind: 'cyl', r: 0.26 - t * 0.08, r2: 0.22 - t * 0.08, h: L * 1.05, seg: 8}} color={grey ? GREY : i % 2 ? '#B8865A' : '#A87650'} outline={0.04} />
				{wire > 0 ? (
					<mesh>
						<cylinderGeometry args={[0.22 - t * 0.08 + 0.01, 0.26 - t * 0.08 + 0.01, L * 1.05, 8, 2]} />
						<meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={wire} />
					</mesh>
				) : null}
			</group>,
		);
		x += Math.sin(a) * L;
		y += Math.cos(a) * L;
	}
	const fronds = [...Array(8)].map((_, i) => {
		const a = (i / 8) * Math.PI * 2 + rnd(seed + i) * 0.4;
		const droop = 0.5 + rnd(seed * 3 + i) * 0.4 + Math.sin(sway * 3 + i) * 0.05;
		return (
			<group key={i} position={[x, y, 0]} rotation={[0, a, 0]}>
				<group rotation={[0, 0, -droop]}>
					<T shape={{kind: 'box', w: 3.6, h: 0.06, d: 0.9}} color={grey ? GREY : i % 2 ? '#2EA85A' : '#3FBF6A'} position={[1.8, 0, 0]} scale={[1, 1, 1]} outline={0.04} />
					<T shape={{kind: 'box', w: 1.8, h: 0.06, d: 0.6}} color={grey ? GREY : '#2E9A50'} position={[3.6, -0.5, 0]} rotation={[0, 0, -0.5]} outline={0.03} />
					{wire > 0 ? (
						<mesh position={[1.8, 0.04, 0]}>
							<boxGeometry args={[3.6, 0.06, 0.9, 3, 1, 1]} />
							<meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={wire} />
						</mesh>
					) : null}
				</group>
			</group>
		);
	});
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			{parts}
			{fronds}
			{[0, 1, 2].map((i) => <T key={i} shape={{kind: 'sphere', r: 0.22}} color={grey ? GREY : '#8A5A2A'} position={[x + Math.cos(i * 2) * 0.25, y - 0.2, Math.sin(i * 2) * 0.25]} outline={0.02} />)}
		</group>
	);
};

// ---------------------------------------------------------------- hotels

/**
 * A pastel Art Deco hotel, front towards +z: rounded corner, "eyebrow"
 * ledges over the windows, a stepped centre tower, porthole windows and a
 * vertical neon fin. `grey` 0..1 switches it off; `gone` hides it (not drawn yet).
 */
export const Hotel3D: React.FC<{at: V3; w?: number; h?: number; d?: number; color?: string; neon?: string; lit?: number; grey?: number; yaw?: number; seed?: number}> = ({at, w = 16, h = 14, d = 12, color = PASTEL[0], neon = NEON[0], lit = 0, grey = 0, yaw = 0, seed = 0}) => {
	const g = (c: string) => (grey > 0 ? '#' + new THREE.Color(c).lerp(new THREE.Color(GREY), grey).getHexString() : c);
	const floors = Math.max(2, Math.round(h / 3.4));
	const cols = Math.max(3, Math.round(w / 3.2));
	const accent = PASTEL[(PASTEL.indexOf(color) + 2 + seed) % PASTEL.length];
	const win = lit > 0 && grey < 0.5 ? '#FFD98A' : g('#7AC8E8');
	const items: React.ReactNode[] = [];
	for (let f = 0; f < floors; f++) {
		const y = 2.6 + f * (h - 3) / floors;
		items.push(<T key={`l${f}`} shape={{kind: 'box', w: w + 0.4, h: 0.18, d: 0.9}} color={g('#FFFFFF')} position={[0, y + 1.0, d / 2 + 0.4]} outline={0.02} />);
		for (let c = 0; c < cols; c++) {
			const x = -w / 2 + (c + 0.5) * (w / cols);
			if (Math.abs(x) < 1.8 && f < floors - 1) continue;
			items.push(<Glow key={`w${f}${c}`} shape={{kind: 'box', w: (w / cols) * 0.55, h: 1.2, d: 0.06}} color={win} position={[x, y + 0.1, d / 2 + 0.04]} />);
		}
	}
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			<T shape={{kind: 'box', w, h, d}} color={g(color)} position={[0, h / 2, 0]} outline={0.08} />
			<T shape={{kind: 'cyl', r: d * 0.2, h: h, seg: 24}} color={g(color)} position={[w / 2, h / 2, d / 2 - d * 0.2]} outline={0.06} />
			<T shape={{kind: 'box', w: w * 0.34, h: 4, d: d * 0.7}} color={g(accent)} position={[0, h + 2, 0]} outline={0.06} />
			<T shape={{kind: 'box', w: w * 0.18, h: 3, d: d * 0.5}} color={g(color)} position={[0, h + 5.5, 0]} outline={0.05} />
			{[-1, 1].map((s) => <T key={s} shape={{kind: 'box', w: 0.5, h: h + 3, d: 0.5}} color={g(accent)} position={[s * w * 0.17, (h + 3) / 2, d / 2 + 0.3]} outline={0.03} />)}
			<T shape={{kind: 'box', w: w, h: 0.5, d: 1.6}} color={g(accent)} position={[0, 2.2, d / 2 + 0.8]} outline={0.03} />
			<Glow shape={{kind: 'box', w: 2.6, h: 2.2, d: 0.06}} color={g('#2A2236')} position={[0, 1.1, d / 2 + 0.04]} />
			{items}
			{[0, 1].map((i) => (
				<T key={i} shape={{kind: 'cyl', r: 0.55, h: 0.1, seg: 20}} color={g('#FFFFFF')} position={[w / 2 + d * 0.2 - 0.05, 4 + i * 4, d / 2 - d * 0.2]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />
			))}
			{/* the neon fin */}
			<group position={[-w * 0.36, h * 0.55, d / 2 + 1.0]}>
				<T shape={{kind: 'box', w: 0.5, h: h * 0.7, d: 1.6}} color={g('#2A2236')} outline={0.03} />
				{lit > 0 && grey < 0.5 ? (
					[...Array(5)].map((_, i) => <Glow key={i} shape={{kind: 'box', w: 0.56, h: h * 0.1, d: 1.2}} color={neon} position={[0, h * 0.25 - i * h * 0.13, 0]} opacity={0.6 + 0.4 * lit} />)
				) : (
					[...Array(5)].map((_, i) => <T key={i} shape={{kind: 'box', w: 0.56, h: h * 0.1, d: 1.2}} color={g('#E8E0F0')} position={[0, h * 0.25 - i * h * 0.13, 0]} outline={0} />)
				)}
			</group>
			{lit > 0 && grey < 0.5 ? <Glow shape={{kind: 'box', w: w, h: 0.25, d: 0.1}} color={neon} position={[0, 2.5, d / 2 + 1.62]} /> : null}
		</group>
	);
};

/** The row of hotels along the beach road. `state(i)` gives each hotel's grey (0..1) or -1 for "not drawn". */
export const HotelRow: React.FC<{x0?: number; n?: number; z?: number; lit?: number; state?: (i: number, x: number) => number; seed?: number}> = ({x0 = -150, n = 16, z = -26, lit = 0, state, seed = 0}) => {
	const out = [];
	let x = x0;
	for (let i = 0; i < n; i++) {
		const w = 14 + rnd(i * 3.7 + seed) * 8;
		const h = 11 + rnd(i * 1.9 + seed) * 10;
		const s = state ? state(i, x + w / 2) : 0;
		if (s >= 0) {
			out.push(<Hotel3D key={i} at={[x + w / 2, 0, z]} w={w} h={h} color={PASTEL[(i + seed) % PASTEL.length]} neon={NEON[(i * 2 + seed) % NEON.length]} lit={lit} grey={s} seed={i} />);
		}
		x += w + 3;
	}
	return <group>{out}</group>;
};

export const hotelX = (i: number, x0 = -150, seed = 0) => {
	let x = x0;
	for (let k = 0; k < i; k++) {
		x += 14 + rnd(k * 3.7 + seed) * 8 + 3;
	}
	return x + (14 + rnd(i * 3.7 + seed) * 8) / 2;
};

// ---------------------------------------------------------------- beach things

export const Lifeguard3D: React.FC<{at: V3; yaw?: number; color?: string; grey?: boolean}> = ({at, yaw = 0, color = '#FF7AA8', grey = false}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'box', w: 0.2, h: 2.6, d: 0.2}} color={grey ? GREY : '#F2F2F2'} position={[x * 1.1, 1.3, z * 0.9]} outline={0.02} />))}
		<T shape={{kind: 'box', w: 2.8, h: 0.2, d: 2.4}} color={grey ? GREY : '#F2F2F2'} position={[0, 2.7, 0]} outline={0.02} />
		<T shape={{kind: 'box', w: 2.4, h: 1.8, d: 2.0}} color={grey ? GREY : color} position={[0, 3.7, 0]} outline={0.03} />
		<T shape={{kind: 'box', w: 2.8, h: 0.3, d: 2.4}} color={grey ? GREY : '#3FBFE8'} position={[0, 4.75, 0]} outline={0.03} />
		<Glow shape={{kind: 'box', w: 1.6, h: 0.7, d: 0.05}} color={grey ? '#A0A0A8' : '#CFE6F5'} position={[0, 3.9, 1.03]} />
		<T shape={{kind: 'box', w: 0.3, h: 3, d: 1}} color={grey ? GREY : '#F2F2F2'} position={[0, 1.3, 1.6]} rotation={[0.5, 0, 0]} outline={0.02} />
	</group>
);

export const Lounger3D: React.FC<{at: V3; yaw?: number; color?: string}> = ({at, yaw = 0, color = '#3FBFE8'}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: 0.7, h: 0.08, d: 1.4}} color={color} position={[0, 0.35, 0.2]} outline={0.01} />
		<T shape={{kind: 'box', w: 0.7, h: 0.08, d: 0.7}} color={color} position={[0, 0.55, -0.7]} rotation={[0.6, 0, 0]} outline={0.01} />
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'box', w: 0.05, h: 0.35, d: 0.05}} color="#F2F2F2" position={[x * 0.3, 0.17, z * 0.6]} outline={0} />))}
		<T shape={{kind: 'cone', r: 1.1, h: 0.5}} color="#FFFFFF" position={[0.7, 2.1, -0.6]} outline={0.02} />
		<T shape={{kind: 'cyl', r: 0.03, h: 2}} color="#F2F2F2" position={[0.7, 1, -0.6]} outline={0} />
		{[0, 1, 2, 3, 4, 5].map((i) => <T key={i} shape={{kind: 'box', w: 0.04, h: 0.02, d: 1.1}} color={i % 2 ? '#FF7AA8' : '#FFFFFF'} position={[0.7 + Math.cos(i) * 0.55, 1.98, -0.6 + Math.sin(i) * 0.55]} rotation={[0, i, 0.3]} outline={0} />)}
	</group>
);

export const Hedge3D: React.FC<{at: V3; len?: number; yaw?: number}> = ({at, len = 4, yaw = 0}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<T shape={{kind: 'box', w: len, h: 1.1, d: 0.9}} color="#3FA85A" position={[0, 0.55, 0]} outline={0.03} />
	</group>
);

export const Fence3D: React.FC<{at: V3; len?: number; yaw?: number}> = ({at, len = 4, yaw = 0}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		{[...Array(Math.round(len / 0.3))].map((_, i) => <T key={i} shape={{kind: 'box', w: 0.1, h: 1.2, d: 0.05}} color="#FFFFFF" position={[-len / 2 + i * 0.3, 0.6, 0]} outline={0.006} />)}
		{[0.3, 0.9].map((y) => <T key={y} shape={{kind: 'box', w: len, h: 0.08, d: 0.05}} color="#FFFFFF" position={[0, y, 0.04]} outline={0.006} />)}
	</group>
);

export const Flamingo3D: React.FC<{at: V3; yaw?: number; frame?: number; flap?: number; s?: number}> = ({at, yaw = 0, frame = 0, flap = 0, s = 1}) => (
	<group position={at} rotation={[0, yaw, 0]} scale={s}>
		<T shape={{kind: 'sphere', r: 0.28}} color="#FF7AA8" position={[0, 1.0, 0]} scale={[1, 0.8, 1.4]} outline={0.015} />
		<T shape={{kind: 'cyl', r: 0.02, h: 0.9}} color="#FF7AA8" position={[0, 0.45, 0]} outline={0.006} />
		<T shape={{kind: 'cyl', r: 0.02, h: 0.45}} color="#FF7AA8" position={[0.1, 0.62, 0]} rotation={[0, 0, 1.2]} outline={0.006} />
		<T shape={{kind: 'capsule', r: 0.04, len: 0.6}} color="#FF7AA8" position={[0, 1.4, 0.3]} rotation={[-0.4, 0, 0]} outline={0.008} />
		<T shape={{kind: 'sphere', r: 0.09}} color="#FF7AA8" position={[0, 1.72, 0.4]} outline={0.008} />
		<T shape={{kind: 'cone', r: 0.04, h: 0.16}} color="#2A2236" position={[0, 1.66, 0.52]} rotation={[1.9, 0, 0]} outline={0} />
		<T shape={{kind: 'sphere', r: 0.02}} color={INK} position={[0.06, 1.75, 0.45]} outline={0} />
		{[-1, 1].map((x) => <T key={x} shape={{kind: 'sphere', r: 0.24}} color="#FF5A90" position={[x * 0.2, 1.05 + flap * 0.2, -0.05]} rotation={[0, 0, x * (0.3 + flap * Math.sin(frame * 0.8))]} scale={[0.3, 0.7, 1.2]} outline={0.01} />)}
	</group>
);

export const Fountain3D: React.FC<{at: V3; frame: number}> = ({at, frame}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 2.2, h: 0.6, seg: 24}} color="#F2E6D8" position={[0, 0.3, 0]} outline={0.03} />
		<T shape={{kind: 'cyl', r: 1.9, h: 0.1, seg: 24}} color="#5AD0E8" position={[0, 0.62, 0]} outline={0} />
		<T shape={{kind: 'cyl', r: 0.25, h: 1.6}} color="#F2E6D8" position={[0, 1.2, 0]} outline={0.02} />
		{[0, 1, 2, 3, 4, 5].map((i) => {
			const t = ((frame * 0.05 + i / 6) % 1);
			return <Glow key={i} shape={{kind: 'sphere', r: 0.12}} color="#CFF6FF" position={[Math.cos(i) * t * 1.4, 2 + Math.sin(t * Math.PI) * 0.8 - t, Math.sin(i) * t * 1.4]} opacity={0.8} />;
		})}
	</group>
);

/** A long causeway over the bay along +z from `at`, `len` long, with lampposts; `grey(t)` per lamppost switches it off. */
export const Causeway3D: React.FC<{at: V3; len?: number; grey?: (t: number) => number; lit?: boolean}> = ({at, len = 300, grey, lit = true}) => {
	const posts = [];
	const n = Math.floor(len / 20);
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const g = grey ? grey(t) : 0;
		posts.push(
			<group key={i} position={[0, 0, i * 20]}>
				{[-1, 1].map((s) => (
					<group key={s} position={[s * 5.2, 0, 0]}>
						<T shape={{kind: 'cyl', r: 0.1, h: 5}} color={g > 0.5 ? GREY : '#4A4660'} position={[0, 2.5 + 3, 0]} outline={0.01} />
						{lit && g < 0.5 ? <Glow shape={{kind: 'sphere', r: 0.35}} color="#FFE7A8" position={[0, 8.1, 0]} /> : <T shape={{kind: 'sphere', r: 0.35}} color={GREY} position={[0, 8.1, 0]} outline={0} />}
					</group>
				))}
				<T shape={{kind: 'box', w: 1.6, h: 3, d: 1.6}} color={g > 0.5 ? GREY : '#C8C0B0'} position={[0, 1.5, 0]} outline={0.03} />
			</group>,
		);
	}
	return (
		<group position={at}>
			<T shape={{kind: 'box', w: 11, h: 0.8, d: len}} color="#C8C0B0" position={[0, 3.2, len / 2]} outline={0.06} />
			<T shape={{kind: 'box', w: 8, h: 0.1, d: len}} color="#55597A" position={[0, 3.65, len / 2]} outline={0} />
			{[-1, 1].map((s) => <T key={s} shape={{kind: 'box', w: 0.3, h: 0.9, d: len}} color="#F2F2F2" position={[s * 5.4, 4.1, len / 2]} outline={0.02} />)}
			{posts}
		</group>
	);
};

// ---------------------------------------------------------------- game things

/** A mission marker: a tall glowing yellow beam with a ring on the ground. */
export const Marker3D: React.FC<{at: V3; frame: number; color?: string; h?: number}> = ({at, frame, color = '#FFD84A', h = 30}) => (
	<group position={at}>
		<Glow shape={{kind: 'cyl', r: 1.2, h, seg: 24}} color={color} position={[0, h / 2, 0]} opacity={0.35} />
		<Glow shape={{kind: 'cyl', r: 0.5, h, seg: 16}} color={color} position={[0, h / 2, 0]} opacity={0.6} />
		{[0, 1].map((i) => {
			const t = ((frame * 0.02 + i * 0.5) % 1);
			return (
				<mesh key={i} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<ringGeometry args={[1 + t * 3, 1.3 + t * 3, 40]} />
					<meshBasicMaterial color={color} transparent opacity={1 - t} />
				</mesh>
			);
		})}
	</group>
);

/** A save point: a glowing spinning disk icon over a ring. */
export const SavePoint3D: React.FC<{at: V3; frame: number; on?: number}> = ({at, frame, on = 0}) => (
	<group position={at}>
		<group position={[0, 1.6 + Math.sin(frame * 0.08) * 0.15, 0]} rotation={[0, frame * 0.05, 0]}>
			<T shape={{kind: 'box', w: 1.0, h: 1.0, d: 0.12}} color="#3F7AF2" emissive="#3F7AF2" emissiveIntensity={0.4 + on * 0.6} outline={0.02} />
			<T shape={{kind: 'box', w: 0.55, h: 0.35, d: 0.14}} color="#F2F2F2" position={[0, 0.25, 0]} outline={0} />
			<T shape={{kind: 'box', w: 0.6, h: 0.3, d: 0.14}} color="#2A2236" position={[0, -0.25, 0]} outline={0} />
		</group>
		<mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
			<ringGeometry args={[0.9, 1.2, 40]} />
			<meshBasicMaterial color="#7FB0FF" transparent opacity={0.6 + on * 0.4} />
		</mesh>
		{on > 0 ? <Glow shape={{kind: 'cyl', r: 1.1, h: 3, seg: 24}} color="#7FB0FF" position={[0, 1.5, 0]} opacity={0.25 * on} /> : null}
	</group>
);

/** An invisible wall made visible for a moment: a hexagon shimmer where you hit it. */
export const WallShimmer: React.FC<{at: V3; frame: number; hit: number; yaw?: number}> = ({at, frame, hit, yaw = 0}) => {
	if (hit <= 0) {
		return null;
	}
	const cells = [];
	for (let i = -4; i <= 4; i++) {
		for (let j = 0; j <= 6; j++) {
			const d = Math.hypot(i, j - 2.5);
			const k = Math.max(0, 1 - d / (2 + hit * 5)) * hit * (0.6 + 0.4 * Math.sin(frame * 0.3 + d));
			if (k > 0.02) {
				cells.push(
					<mesh key={`${i}${j}`} position={[i * 1.1 + (j % 2) * 0.55, j * 0.95, 0]}>
						<circleGeometry args={[0.55, 6]} />
						<meshBasicMaterial color="#7FE8FF" transparent opacity={k * 0.7} side={THREE.DoubleSide} />
					</mesh>,
				);
			}
		}
	}
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			{cells}
		</group>
	);
};

/** A small scooter, facing +z, with a pizza box on the back. */
export const Scooter3D: React.FC<{at: V3; yaw?: number; tilt?: number; pizza?: boolean; color?: string}> = ({at, yaw = 0, tilt = 0, pizza = true, color = '#3FBFE8'}) => (
	<group position={at} rotation={[0, yaw, tilt]}>
		{[-1, 1].map((z) => <T key={z} shape={{kind: 'cyl', r: 0.28, h: 0.14}} color="#2A2638" position={[0, 0.28, z * 0.6]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />)}
		<T shape={{kind: 'box', w: 0.4, h: 0.3, d: 1.1}} color={color} position={[0, 0.5, -0.05]} outline={0.015} />
		<T shape={{kind: 'box', w: 0.36, h: 0.9, d: 0.2}} color={color} position={[0, 0.85, 0.5]} rotation={[-0.25, 0, 0]} outline={0.015} />
		<T shape={{kind: 'box', w: 0.7, h: 0.06, d: 0.06}} color="#2A2638" position={[0, 1.32, 0.62]} outline={0.006} />
		<T shape={{kind: 'box', w: 0.38, h: 0.12, d: 0.5}} color="#2A2638" position={[0, 0.72, -0.3]} outline={0.008} />
		{pizza ? <PizzaBox3D at={[0, 0.84, -0.55]} /> : null}
	</group>
);

export const PizzaBox3D: React.FC<{at: V3; rot?: V3; s?: number}> = ({at, rot, s = 1}) => (
	<group position={at} rotation={rot} scale={s}>
		<T shape={{kind: 'box', w: 0.5, h: 0.08, d: 0.5}} color="#F2F2F2" outline={0.008} />
		<T shape={{kind: 'cyl', r: 0.13, h: 0.01}} color="#E8453C" position={[0, 0.045, 0]} outline={0} />
	</group>
);

// ---------------------------------------------------------------- studio

/** A camera with its view drawn as a glowing pyramid (the frustum). */
export const Frustum3D: React.FC<{at: V3; yaw?: number; len?: number}> = ({at, yaw = 0, len = 9}) => {
	const geom = useMemo(() => {
		const g = new THREE.ConeGeometry(len * 0.55, len, 4, 1, true);
		g.rotateY(Math.PI / 4);
		g.rotateX(-Math.PI / 2);
		g.translate(0, 0, len / 2);
		return g;
	}, [len]);
	return (
		<group position={at} rotation={[0, yaw, 0]}>
			<T shape={{kind: 'box', w: 0.9, h: 0.6, d: 0.7}} color="#2A2236" outline={0.02} />
			<T shape={{kind: 'cyl', r: 0.22, h: 0.4}} color="#4A4660" position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} outline={0.01} />
			<mesh geometry={geom}>
				<meshBasicMaterial color="#FFD84A" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
			</mesh>
			<mesh geometry={geom}>
				<meshBasicMaterial color="#FFD84A" wireframe />
			</mesh>
		</group>
	);
};

/** A wireframe box (a hitbox). */
export const HitBox3D: React.FC<{at: V3; size: V3; color?: string}> = ({at, size, color = '#3FF2E8'}) => (
	<mesh position={at}>
		<boxGeometry args={size} />
		<meshBasicMaterial color={color} wireframe />
	</mesh>
);

/** A stack of unlabelled game boxes. */
export const GameBoxes3D: React.FC<{at: V3; n?: number; h?: number}> = ({at, n = 120, h = 1}) => {
	const items: Copy[] = [];
	const cols = ['#E8453C', '#2E8AE8', '#FFD84A', '#3AB87A', '#B86BFF', '#FF7AA8'];
	for (let i = 0; i < n; i++) {
		const layer = Math.floor(i / 6);
		const k = i % 6;
		items.push({p: [(k % 3) * 1.1 - 1.1, layer * 0.16 * h + 0.08, Math.floor(k / 3) * 1.5 - 0.75], s: [1, 0.14 * h, 1.4], r: [0, (rnd(i) - 0.5) * 0.2, 0], c: cols[i % cols.length]});
	}
	return (
		<group position={at}>
			<Many kind={`boxes${n}`} geom={box} items={items} outline={0.02} />
		</group>
	);
};


