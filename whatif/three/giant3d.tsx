import React from 'react';
import * as THREE from 'three';
import {Rod} from './bugs3d';
import {Many, rnd, type Copy} from './many';
import {CanvasPlane} from './props3d2';
import {Box} from './sets3d';
import {Glow, T} from './toon';

// The world at ant height, five hundred times bigger than usual: carpet fibres
// like trees, a cornflake like a bus, grass forests, raindrops as big as you,
// a dandelion seed you can hang from. The hero is 1.7 tall (3 mm), so 1 mm is
// about 0.57 units here.

type V3 = [number, number, number];
export const MM = 0.567;

// ---------------------------------------------------------------- floors

const fibreG = () => new THREE.CylinderGeometry(0.18, 0.32, 1, 7).translate(0, 0.5, 0);

/** Carpet: a forest of fibre tufts over a square of side `size`, leaving a clear circle of radius `clear` round `gap`. */
export const Carpet: React.FC<{size?: number; clear?: number; gap?: [number, number]; seed?: number; color?: string; tall?: number; center?: [number, number]}> = ({size = 60, clear = 4, gap = [0, 0], seed = 0, color = '#6A4AA8', tall = 4.5, center = [0, 0]}) => {
	const items: Copy[] = [];
	const c = new THREE.Color(color);
	const n = Math.round((size * size) / 2.2);
	for (let i = 0; i < n; i++) {
		const x = center[0] + (rnd(i + seed) - 0.5) * size;
		const z = center[1] + (rnd(i * 3.1 + seed + 7) - 0.5) * size;
		if (Math.hypot(x - gap[0], z - gap[1]) < clear + rnd(i * 5) * 1.5) {
			continue;
		}
		const h = tall * (0.7 + rnd(i * 1.7 + seed) * 0.6);
		const k = 0.82 + rnd(i * 2.3) * 0.3;
		items.push({
			p: [x, 0, z],
			s: [0.8 + rnd(i * 4.1) * 0.6, h, 0.8 + rnd(i * 4.7) * 0.6],
			r: [(rnd(i * 6.1) - 0.5) * 0.35, rnd(i) * 6, (rnd(i * 8.3) - 0.5) * 0.35],
			c: '#' + c.clone().multiplyScalar(k).getHexString(),
		});
	}
	return (
		<group>
			<Box size={[size * 1.6, 0.1, size * 1.6]} at={[center[0], -0.05, center[1]]} color={'#' + c.clone().multiplyScalar(0.55).getHexString()} outline={0} />
			<Many kind={`fibre${seed}`} geom={fibreG} items={items} outline={0.05} />
		</group>
	);
};

const bladeG = () => {
	const g = new THREE.ConeGeometry(1, 1, 4, 6, true).translate(0, 0.5, 0);
	const p = g.attributes.position;
	for (let i = 0; i < p.count; i++) {
		const y = p.getY(i);
		p.setZ(i, p.getZ(i) * 0.22 + y * y * 0.35);
	}
	g.computeVertexNormals();
	return g;
};

/** A forest of grass blades round a clearing. */
export const Grass: React.FC<{size?: number; clear?: number; gap?: [number, number]; seed?: number; tall?: number; density?: number}> = ({size = 80, clear = 6, gap = [0, 0], seed = 0, tall = 30, density = 1}) => {
	const items: Copy[] = [];
	const greens = ['#3FA84A', '#58C25A', '#2E8A44', '#7AD06A', '#46B05A'];
	const n = Math.round(((size * size) / 14) * density);
	for (let i = 0; i < n; i++) {
		const x = (rnd(i * 1.3 + seed) - 0.5) * size;
		const z = (rnd(i * 2.9 + seed + 3) - 0.5) * size;
		if (Math.hypot(x - gap[0], z - gap[1]) < clear + rnd(i * 5) * 3) {
			continue;
		}
		const h = tall * (0.45 + rnd(i * 1.9 + seed) * 0.8);
		items.push({p: [x, 0, z], s: [1.1 + rnd(i * 3.3) * 0.9, h, 1.1 + rnd(i * 3.7) * 0.9], r: [(rnd(i * 6.5) - 0.5) * 0.25, rnd(i * 7.7) * 6.3, (rnd(i * 8.9) - 0.5) * 0.25], c: greens[i % greens.length]});
	}
	return <Many kind={`grass${seed}`} geom={bladeG} items={items} outline={0.04} />;
};

/** Plain ground: soil, wood, tiles. */
export const Ground: React.FC<{color: string; size?: number; lines?: {every: number; color: string; along?: 'x' | 'z'}}> = ({color, size = 400, lines}) => (
	<group>
		<Box size={[size, 0.2, size]} at={[0, -0.1, 0]} color={color} outline={0} />
		{lines
			? [...Array(Math.floor(size / lines.every))].map((_, i) => {
					const o = -size / 2 + (i + 0.5) * lines.every;
					return lines.along === 'z' ? (
						<Box key={i} size={[0.5, 0.04, size]} at={[o, 0.01, 0]} color={lines.color} outline={0} />
					) : (
						<Box key={i} size={[size, 0.04, 0.5]} at={[0, 0.01, o]} color={lines.color} outline={0} />
					);
				})
			: null}
	</group>
);

// ---------------------------------------------------------------- bedroom bits

/** The duvet, from ant height: soft rolling hills; the pillow: a white cliff. On top of the bed at y = top. */
export const BedTop: React.FC<{top: number; edge?: number}> = ({top, edge = 0}) => (
	<group>
		{/* the mattress side: a sheer wall down to the floor, in front of z = edge */}
		{top > 0 ? <Box size={[300, top, 6]} at={[0, top / 2, edge - 3]} color="#E8E0F8" outline={0} /> : null}
		{top > 0 ? <Box size={[300, 0.4, 0.4]} at={[0, top - 1, edge + 0.1]} color="#C9B8F0" outline={0} /> : null}
		<Box size={[300, 0.6, 200]} at={[0, top - 0.3, edge - 100]} color="#F2EEFF" outline={0} />
		{[...Array(9)].map((_, i) => {
			const x = -60 + i * 16 + rnd(i) * 6;
			const z = edge - 14 - rnd(i * 3) * 30;
			const r = 9 + rnd(i * 5) * 7;
			return <T key={i} shape={{kind: 'sphere', r, seg: 40}} color={i % 2 ? '#FF8A3D' : '#FFA45A'} position={[x, top + r * 0.18, z]} scale={[1.4, 0.55, 1]} outline={0.25} />;
		})}
		{[...Array(14)].map((_, i) => (
			<T key={`d${i}`} shape={{kind: 'sphere', r: 1.2, seg: 16}} color="#FFD84A" position={[-50 + i * 8, top + 0.3 + rnd(i) * 2, edge - 6 - rnd(i * 2) * 8]} scale={[1, 0.3, 1]} outline={0.05} />
		))}
		<T shape={{kind: 'box', w: 70, h: 22, d: 30}} color="#FFFFFF" position={[-10, top + 11, edge - 70]} outline={0.3} />
	</group>
);

/** An alarm clock tower, ringing (shake 0..1). */
export const Alarm3D: React.FC<{at: V3; frame: number; ring?: number; s?: number}> = ({at, frame, ring = 0, s = 1}) => {
	const sh = Math.sin(frame * 2.1) * 0.06 * ring;
	return (
		<group position={at} rotation={[0, 0, sh]} scale={s}>
			<T shape={{kind: 'cyl', r: 14, h: 6, seg: 48}} color="#E8453C" position={[0, 16, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.4} />
			<CanvasPlane
				w={22}
				h={22}
				px={256}
				dep="clock"
				position={[0, 16, 3.05]}
				draw={(ctx, W, H) => {
					ctx.fillStyle = '#FFF8E8';
					ctx.beginPath();
					ctx.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillStyle = '#2A2350';
					for (let i = 0; i < 12; i++) {
						const a = (i / 12) * Math.PI * 2;
						ctx.beginPath();
						ctx.arc(W / 2 + Math.sin(a) * W * 0.4, H / 2 - Math.cos(a) * H * 0.4, i % 3 ? 4 : 8, 0, Math.PI * 2);
						ctx.fill();
					}
					ctx.strokeStyle = '#2A2350';
					ctx.lineCap = 'round';
					ctx.lineWidth = 12;
					ctx.beginPath();
					ctx.moveTo(W / 2, H / 2);
					ctx.lineTo(W / 2 + W * 0.2, H / 2 + H * 0.05);
					ctx.stroke();
					ctx.lineWidth = 8;
					ctx.beginPath();
					ctx.moveTo(W / 2, H / 2);
					ctx.lineTo(W / 2, H / 2 - H * 0.34);
					ctx.stroke();
				}}
			/>
			{[-1, 1].map((sd) => (
				<group key={sd} position={[sd * 9, 30, 0]} rotation={[0, 0, sd * -0.5 + Math.sin(frame * 2.7 + sd) * 0.15 * ring]}>
					<T shape={{kind: 'sphere', r: 5, seg: 24}} color="#FFD84A" scale={[1, 0.8, 1]} outline={0.3} />
				</group>
			))}
			<Box size={[2, 6, 2]} at={[0, 31, 0]} color="#2A2350" />
			{[-1, 1].map((sd) => (
				<Rod key={`l${sd}`} a={[sd * 7, 4, 0]} b={[sd * 10, 0, 0]} r={1} color="#2A2350" outline={0.2} />
			))}
		</group>
	);
};

/** A toy brick (2 x 4), as big as a house. */
export const Brick3D: React.FC<{at: V3; rot?: number; color?: string}> = ({at, rot = 0, color = '#E8303A'}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<T shape={{kind: 'box', w: 18, h: 5.4, d: 9}} color={color} position={[0, 2.7, 0]} outline={0.15} />
		{[...Array(8)].map((_, i) => (
			<T key={i} shape={{kind: 'cyl', r: 1.4, h: 1, seg: 24}} color={color} position={[-6.75 + (i % 4) * 4.5, 5.9, i < 4 ? -2.25 : 2.25]} outline={0.1} />
		))}
	</group>
);

const fuzzG = () => new THREE.ConeGeometry(0.25, 2.2, 5).translate(0, 1.1, 0);

/** A dust ball, rolling (roll in radians). */
export const DustBall3D: React.FC<{at: V3; roll?: number; r?: number}> = ({at, roll = 0, r = 2.4}) => {
	const items: Copy[] = [];
	for (let i = 0; i < 90; i++) {
		const u = rnd(i * 2.1) * 2 - 1;
		const a = rnd(i * 3.7) * Math.PI * 2;
		const d = new THREE.Vector3(Math.sqrt(1 - u * u) * Math.cos(a), u, Math.sqrt(1 - u * u) * Math.sin(a));
		const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d));
		items.push({p: [d.x * r * 0.6, d.y * r * 0.6, d.z * r * 0.6], s: [1, 0.7 + rnd(i) * 0.7, 1], r: [e.x, e.y, e.z], c: i % 3 ? '#B8B0C8' : '#9A92AE'});
	}
	return (
		<group position={at} rotation={[0, 0, roll]}>
			<T shape={{kind: 'sphere', r: r * 0.75, seg: 24}} color="#A8A0BC" outline={0.08} />
			<Many kind="fuzz" geom={fuzzG} items={items} outline={0.03} />
		</group>
	);
};

/** A sock lying on the carpet, as big as a circus tent. */
export const Sock3D: React.FC<{at: V3; rot?: number}> = ({at, rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<T shape={{kind: 'capsule', r: 9, len: 40}} color="#3FB7E8" position={[0, 6, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.65]} outline={0.4} />
		{[-16, -8, 0, 8].map((x) => (
			<T key={x} shape={{kind: 'torus', r: 8.2, tube: 1.3}} color="#FFFFFF" position={[x, 6, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 1, 0.65]} outline={0} />
		))}
		<T shape={{kind: 'sphere', r: 10, seg: 32}} color="#FFD84A" position={[26, 6, 0]} scale={[1, 0.95, 0.68]} outline={0.4} />
	</group>
);

// ---------------------------------------------------------------- food

/** A cornflake as big as a bus (about 14 across), lying flat at its position. */
export const Cornflake3D: React.FC<{at: V3; rot?: V3; s?: number}> = ({at, rot, s = 1}) => (
	<group position={at} rotation={rot} scale={s}>
		<T shape={{kind: 'sphere', r: 7, seg: 48}} color="#F2B84A" scale={[1, 0.12, 0.78]} outline={0.12} />
		{[...Array(9)].map((_, i) => {
			const a = i * 2.4;
			const d = 1.5 + rnd(i) * 4;
			return <T key={i} shape={{kind: 'sphere', r: 1.2 + rnd(i * 2) * 1.2, seg: 20}} color={i % 3 ? '#E8A23A' : '#FFD27A'} position={[Math.cos(a) * d, 0.55, Math.sin(a) * d * 0.7]} scale={[1, 0.3, 1]} outline={0} />;
		})}
		{[...Array(6)].map((_, i) => {
			const a = i * 1.05 + 0.4;
			return <T key={`b${i}`} shape={{kind: 'sphere', r: 0.5, seg: 12}} color="#C9782A" position={[Math.cos(a) * 4, 0.7, Math.sin(a) * 3]} scale={[1, 0.3, 1]} outline={0} />;
		})}
	</group>
);

/** A crumb of toast as big as a sofa. */
export const Crumb3D: React.FC<{at: V3; rot?: number; s?: number; bitten?: number}> = ({at, rot = 0, s = 1, bitten = 0}) => (
	<group position={at} rotation={[0, rot, 0]} scale={s}>
		<T shape={{kind: 'box', w: 3.2, h: 1.7, d: 2.2}} color="#F2D8A0" position={[0, 0.85, 0]} rotation={[0.1, 0.2, 0.05]} outline={0.06} />
		<T shape={{kind: 'box', w: 3.3, h: 0.5, d: 2.3}} color="#B8642A" position={[0, 1.75, 0]} rotation={[0.1, 0.2, 0.05]} outline={0.05} />
		<T shape={{kind: 'box', w: 0.5, h: 1.8, d: 2.3}} color="#C9782A" position={[-1.6, 0.9, -0.1]} rotation={[0.1, 0.2, 0.05]} outline={0.05} />
		{[...Array(6)].map((_, i) => (
			<T key={i} shape={{kind: 'sphere', r: 0.18 + rnd(i) * 0.15, seg: 10}} color="#D8B070" position={[-1 + rnd(i * 2) * 2.4, 0.4 + rnd(i * 3) * 1.1, 1.18]} scale={[1, 1, 0.3]} outline={0} />
		))}
		{bitten > 0 ? <T shape={{kind: 'sphere', r: 1.1 * bitten, seg: 20}} color="#F2D8A0" position={[1.5, 1.3, 0.8]} outline={0} /> : null}
	</group>
);

/** A biscuit crumb for Pip to lift (about 3 across). */
export const BigCrumb3D: React.FC<{at: V3; rot?: V3}> = ({at, rot}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'sphere', r: 1.6, seg: 24}} color="#E8B060" scale={[1.2, 0.8, 1]} outline={0.05} />
		<T shape={{kind: 'sphere', r: 0.9, seg: 16}} color="#D89A48" position={[0.9, 0.4, 0.3]} outline={0.04} />
		{[...Array(5)].map((_, i) => (
			<T key={i} shape={{kind: 'sphere', r: 0.22, seg: 8}} color="#6A3A1E" position={[Math.cos(i * 1.3) * 1.2, 0.8, Math.sin(i * 1.3) * 0.9]} outline={0} />
		))}
	</group>
);

/** A grain of rice (about 4 long), lying along x. */
export const Rice3D: React.FC<{at: V3; rot?: number}> = ({at, rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<T shape={{kind: 'capsule', r: 0.58, len: 2.8}} color="#FFFDF2" position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.85]} outline={0.05} />
	</group>
);

/** A wooden ruler with millimetre marks, lying flat along x, its top face at y = 0. */
export const Ruler3D: React.FC<{at: V3; len?: number; from?: number}> = ({at, len = 40, from = 0}) => (
	<group position={at}>
		<Box size={[len, 0.8, 12]} at={[0, -0.4, 0]} color="#F2C66E" outline={0.05} />
		<CanvasPlane
			w={len}
			h={12}
			px={2048}
			dep={`ruler${len}${from}`}
			position={[0, 0.01, 0]}
			rotation={[-Math.PI / 2, 0, 0]}
			draw={(ctx, W, H) => {
				ctx.fillStyle = '#F7D888';
				ctx.fillRect(0, 0, W, H);
				const per = W / (len / MM);
				ctx.fillStyle = '#2A2350';
				ctx.font = `bold ${Math.round(H * 0.16)}px Fredoka, sans-serif`;
				ctx.textAlign = 'center';
				for (let i = 0; i <= len / MM; i++) {
					const x = i * per;
					const big = (i + from) % 10 === 0;
					const mid = (i + from) % 5 === 0;
					ctx.fillRect(x - (big ? 3 : 2), 0, big ? 6 : 4, H * (big ? 0.36 : mid ? 0.26 : 0.17));
					if (big) {
						ctx.fillText(String((i + from) / 10), x, H * 0.55);
					}
				}
				ctx.font = `bold ${Math.round(H * 0.1)}px Fredoka, sans-serif`;
				ctx.fillText('cm', W - per * 3, H * 0.85);
			}}
		/>
	</group>
);

// ---------------------------------------------------------------- water

/** A drop of water sitting on the floor (or falling, with `fall`), see-through and glossy. */
export const Drop3D: React.FC<{at: V3; r?: number; squash?: number; fall?: number; wobble?: number; frame?: number; opacity?: number}> = ({at, r = 1.3, squash = 0.85, fall = 0, wobble = 0, frame = 0, opacity = 0.5}) => {
	const w = Math.sin(frame * 0.6) * wobble;
	const sy = fall > 0 ? 1 + fall * 0.25 : squash + w * 0.08;
	const sx = fall > 0 ? 1 - fall * 0.1 : 1 / Math.sqrt(squash) - w * 0.04;
	return (
		<group position={at}>
			<group position={[0, fall > 0 ? 0 : r * sy, 0]} scale={[sx, sy, sx]}>
				<T shape={{kind: 'sphere', r, seg: 48}} color="#A8DCFF" opacity={opacity} outline={0.04 * r} />
				<T shape={{kind: 'sphere', r: r * 0.7, seg: 32}} color="#E8F8FF" position={[r * 0.15, -r * 0.2, r * 0.1]} opacity={opacity * 0.4} outline={0} />
				<mesh position={[-r * 0.4, r * 0.48, r * 0.55]} scale={[1, 0.6, 0.4]}>
					<sphereGeometry args={[r * 0.2, 16, 12]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
				</mesh>
				<mesh position={[r * 0.2, r * 0.62, r * 0.55]} scale={[1, 0.6, 0.4]}>
					<sphereGeometry args={[r * 0.08, 12, 8]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
				</mesh>
			</group>
			{fall > 0 ? null : (
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
					<circleGeometry args={[r * sx * 0.95, 40]} />
					<meshBasicMaterial color="#5AA8E8" transparent opacity={0.35} depthWrite={false} />
				</mesh>
			)}
		</group>
	);
};

/** A raindrop's splash, `t` 0..1 after it lands. */
export const Splash3D: React.FC<{at: V3; t: number; r?: number}> = ({at, t, r = 1.4}) => {
	if (t <= 0 || t >= 1) {
		return null;
	}
	const o = 1 - t;
	return (
		<group position={at}>
			<T shape={{kind: 'torus', r: r * (0.6 + t * 1.8), tube: r * 0.18 * o + 0.05}} color="#BFE6FF" position={[0, r * 0.25 * Math.sin(t * Math.PI), 0]} rotation={[Math.PI / 2, 0, 0]} opacity={0.75 * o} outline={0.03} />
			{[...Array(8)].map((_, i) => {
				const a = (i / 8) * Math.PI * 2 + 0.3;
				const d = r * (0.8 + t * 2.6);
				return <T key={i} shape={{kind: 'sphere', r: r * 0.16, seg: 12}} color="#DFF4FF" position={[Math.cos(a) * d, r * 2.4 * t * (1 - t) * 2, Math.sin(a) * d]} opacity={0.85 * o} outline={0.02} />;
			})}
		</group>
	);
};

/** Flat water (a puddle, a pond) with a gentle sheen; its surface at y = level. */
export const Water3D: React.FC<{at?: V3; size?: [number, number]; level: number; color?: string; frame: number; ripples?: Array<[number, number, number]>}> = ({at = [0, 0, 0], size = [200, 200], level, color = '#4AA8E8', frame, ripples = []}) => (
	<group position={at}>
		<mesh position={[0, level / 2, 0]}>
			<boxGeometry args={[size[0], Math.max(0.01, level), size[1]]} />
			<meshToonMaterial color={color} transparent opacity={0.72} />
		</mesh>
		{ripples.map(([x, z, born], i) => {
			const t = ((frame - born) % 60) / 60;
			return (
				<mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, level + 0.02, z]}>
					<ringGeometry args={[0.5 + t * 4, 0.8 + t * 4, 40]} />
					<meshBasicMaterial color="#DFF6FF" transparent opacity={0.6 * (1 - t)} toneMapped={false} />
				</mesh>
			);
		})}
	</group>
);

// ---------------------------------------------------------------- garden

/** A dandelion clock: a stalk and a ball of seeds. `gone` 0..1 removes seeds (the wind takes them). */
export const DandelionClock3D: React.FC<{at: V3; r?: number; stalk?: number; gone?: number; frame: number}> = ({at, r = 9, stalk = 40, gone = 0, frame}) => {
	const sway = Math.sin(frame * 0.04) * 0.03;
	const beaks: Copy[] = [];
	const bristles: Copy[] = [];
	const N = 90;
	for (let i = 0; i < N; i++) {
		if (rnd(i * 9.1) < gone) {
			continue;
		}
		const u = 1 - (2 * (i + 0.5)) / N;
		const a = i * 2.39996;
		const d = new THREE.Vector3(Math.sqrt(1 - u * u) * Math.cos(a), u, Math.sqrt(1 - u * u) * Math.sin(a));
		const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d));
		beaks.push({p: [d.x * r * 0.12, d.y * r * 0.12, d.z * r * 0.12], s: [1, r * 0.72, 1], r: [e.x, e.y, e.z]});
		const tip = d.clone().multiplyScalar(r * 0.84);
		for (let k = 0; k < 7; k++) {
			const b = new THREE.Vector3(Math.cos((k / 7) * Math.PI * 2), 0.9, Math.sin((k / 7) * Math.PI * 2)).normalize();
			b.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d));
			const eb = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b));
			bristles.push({p: [tip.x, tip.y, tip.z], s: [1, r * 0.22, 1], r: [eb.x, eb.y, eb.z]});
		}
	}
	return (
		<group position={at} rotation={[sway, 0, sway * 0.5]}>
			<T shape={{kind: 'cyl', r: 0.9, r2: 0.7, h: stalk, seg: 16}} color="#7AB05A" position={[0, stalk / 2, 0]} outline={0.1} />
			<group position={[0, stalk + 0.5, 0]}>
				<T shape={{kind: 'sphere', r: r * 0.14, seg: 24}} color="#C9A86A" outline={0.08} />
				<Many kind="dbeak" geom={() => new THREE.CylinderGeometry(0.06, 0.06, 1, 5).translate(0, 0.5, 0)} items={beaks} color="#F2F2E8" outline={0} shadow={false} />
				<Many kind="dbristle" geom={() => new THREE.CylinderGeometry(0.035, 0.035, 1, 4).translate(0, 0.5, 0)} items={bristles} color="#FFFFFF" outline={0} glow shadow={false} opacity={0.9} />
			</group>
		</group>
	);
};

/** One dandelion seed: a fluffy parachute on top, a long stalk, the seed below. About 7 across. `ring` shows the spinning air ring. */
export const Seed3D: React.FC<{at: V3; rot?: V3; frame: number; ring?: number}> = ({at, rot, frame, ring = 0}) => {
	const R = 3.4;
	const items: Copy[] = [];
	for (let i = 0; i < 100; i++) {
		const a = i * 2.39996;
		const b = new THREE.Vector3(Math.cos(a), 0.25 + (i % 5) * 0.05, Math.sin(a)).normalize();
		const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b));
		items.push({p: [0, 0, 0], s: [1, R, 1], r: [e.x, e.y, e.z]});
	}
	return (
		<group position={at} rotation={rot}>
			<group position={[0, 6, 0]}>
				<Many kind="pappus" geom={() => new THREE.CylinderGeometry(0.035, 0.03, 1, 4).translate(0, 0.5, 0)} items={items} color="#FFFFFF" outline={0} glow shadow={false} />
				<T shape={{kind: 'sphere', r: 0.25, seg: 12}} color="#F2F2E8" outline={0.03} />
				{ring > 0 ? (
					<group position={[0, 1.6, 0]}>
						<T shape={{kind: 'torus', r: 2.2, tube: 0.8}} color="#9FE8FF" rotation={[Math.PI / 2, 0, 0]} opacity={0.28 * ring} outline={0} />
						{[...Array(16)].map((_, i) => {
							const a = (i / 16) * Math.PI * 2;
							const s = frame * 0.18 + i * 1.7;
							return <Glow key={i} shape={{kind: 'sphere', r: 0.16, seg: 8}} color="#DFF8FF" position={[Math.cos(a) * (2.2 + Math.cos(s) * 0.8), Math.sin(s) * 0.8, Math.sin(a) * (2.2 + Math.cos(s) * 0.8)]} opacity={ring} />;
						})}
					</group>
				) : null}
			</group>
			<T shape={{kind: 'cyl', r: 0.07, h: 6, seg: 8}} color="#F2F2E8" position={[0, 3, 0]} outline={0.02} />
			<T shape={{kind: 'capsule', r: 0.22, len: 1.3}} color="#8A6A3A" position={[0, -0.7, 0]} outline={0.03} />
		</group>
	);
};

/** An ant hill: a mound of earth with a dark doorway facing +z. */
export const AntHill3D: React.FC<{at: V3; r?: number}> = ({at, r = 14}) => {
	const grains: Copy[] = [];
	for (let i = 0; i < 160; i++) {
		const a = rnd(i * 3.3) * Math.PI * 2;
		const d = Math.sqrt(rnd(i * 1.1)) * r;
		const y = Math.sqrt(Math.max(0, 1 - (d / r) ** 2)) * r * 0.42;
		grains.push({p: [Math.cos(a) * d, y, Math.sin(a) * d], s: 0.4 + rnd(i) * 0.5, c: i % 3 ? '#8A5A3A' : '#A8724A'});
	}
	return (
		<group position={at}>
			<T shape={{kind: 'sphere', r, seg: 48}} color="#7A4A2E" scale={[1, 0.42, 1]} outline={0.2} />
			<Many kind="grains" geom={() => new THREE.DodecahedronGeometry(1)} items={grains} outline={0.05} />
			<group position={[0, r * 0.18, r * 0.86]} rotation={[-0.45, 0, 0]}>
				<T shape={{kind: 'sphere', r: 2.6, seg: 24}} color="#1E120E" scale={[1.2, 0.8, 0.35]} outline={0.08} />
			</group>
		</group>
	);
};

/** A twig, about 20 long, as thick as a tree trunk, lying along x. */
export const Twig3D: React.FC<{at: V3; rot?: V3; len?: number}> = ({at, rot, len = 20}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'cyl', r: 0.45, r2: 0.6, h: len, seg: 12}} color="#8A5A3A" rotation={[0, 0, Math.PI / 2]} outline={0.06} />
		<T shape={{kind: 'cyl', r: 0.22, r2: 0.3, h: 5, seg: 8}} color="#7A4A2E" position={[len * 0.2, 1.6, 0]} rotation={[0, 0, -0.7]} outline={0.04} />
		{[-0.3, 0.1, 0.35].map((x) => (
			<T key={x} shape={{kind: 'sphere', r: 0.55, seg: 10}} color="#6A3A22" position={[x * len, 0, 0]} scale={[0.6, 1.1, 1.1]} outline={0.03} />
		))}
	</group>
);

/** A pebble, as big as a boulder. */
export const Pebble3D: React.FC<{at: V3; r?: number; color?: string}> = ({at, r = 4, color = '#A8A0B8'}) => (
	<T shape={{kind: 'sphere', r, seg: 24}} color={color} position={at} scale={[1.2, 0.6, 1]} outline={0.1} />
);

// ---------------------------------------------------------------- the house, from ant height

/** Mum's slipper, the size of a bus, toe towards +z. */
export const Slipper3D: React.FC<{at: V3; rot?: number}> = ({at, rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<T shape={{kind: 'capsule', r: 6, len: 22}} color="#FF9AC0" position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.15, 0.55, 1]} outline={0.25} />
		<T shape={{kind: 'sphere', r: 7.5, seg: 32}} color="#FFB8D4" position={[0, 5, 8]} scale={[1, 0.75, 1.2]} outline={0.25} />
		<T shape={{kind: 'capsule', r: 6.3, len: 22}} color="#E86A9A" position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.18, 0.15, 1]} outline={0.15} />
		{[...Array(10)].map((_, i) => (
			<T key={i} shape={{kind: 'sphere', r: 1.6, seg: 12}} color="#FFFFFF" position={[Math.cos(i * 0.6 - 0.2) * 7.5, 8.2 + rnd(i) * 0.6, 6 + Math.sin(i * 0.6 - 0.2) * 3]} outline={0.05} />
		))}
	</group>
);

/** The bottom of a door, overhead: a dark slab with a gap of `gap` under it. */
export const DoorGap3D: React.FC<{at: V3; gap?: number; color?: string}> = ({at, gap = 4, color = '#C98A5A'}) => (
	<group position={at}>
		<Box size={[200, 60, 3]} at={[0, gap + 30, 0]} color={color} outline={0.1} />
		<Box size={[200, 0.6, 3.2]} at={[0, gap + 0.3, 0]} color="#8A5A3A" outline={0.05} />
	</group>
);

/** Floorboards along z, with dark gaps. */
export const Boards3D: React.FC<{size?: number; every?: number; color?: string}> = ({size = 300, every = 12, color = '#B8845A'}) => (
	<group>
		<Box size={[size, 0.2, size]} at={[0, -0.1, 0]} color={color} outline={0} />
		{[...Array(Math.floor(size / every))].map((_, i) => (
			<Box key={i} size={[0.7, 0.08, size]} at={[-size / 2 + i * every, 0.02, 0]} color="#5A3A2A" outline={0} />
		))}
		{[...Array(40)].map((_, i) => (
			<Box key={`g${i}`} size={[every * 0.6, 0.03, 0.18]} at={[-size / 2 + (i % 25) * every + every / 2, 0.015, (rnd(i) - 0.5) * size]} color="#A0704A" outline={0} />
		))}
	</group>
);

/** The underside of the fridge, overhead, with its grille. */
export const FridgeUnder3D: React.FC<{at: V3; gap?: number}> = ({at, gap = 7}) => (
	<group position={at}>
		<Box size={[120, 1.5, 120]} at={[0, gap + 0.75, -50]} color="#3A3A4A" outline={0.05} />
		<Box size={[120, 30, 1]} at={[0, gap + 15.5, 10]} color="#F2F2F2" outline={0.1} />
		{[...Array(12)].map((_, i) => (
			<Box key={i} size={[110, 0.5, 0.5]} at={[0, gap + 1.5 + i * 0.9, 10.6]} color="#2A2A3A" outline={0} />
		))}
		{[-40, 40].map((x) => (
			<T key={x} shape={{kind: 'cyl', r: 2.4, h: gap, seg: 16}} color="#2A2A3A" position={[x, gap / 2, 4]} outline={0.06} />
		))}
	</group>
);

/** Stars and a big moon, far away in the sky. */
export const NightSky3D: React.FC<{frame: number}> = ({frame}) => {
	const stars: Copy[] = [];
	for (let i = 0; i < 260; i++) {
		const a = rnd(i * 1.7) * Math.PI * 1.2 - Math.PI * 0.1;
		const h = 10 + rnd(i * 2.3) * 120;
		stars.push({p: [Math.cos(a) * 160, h, -Math.sin(a) * 160], s: 0.3 + rnd(i * 4.3) * 0.5 * (0.7 + 0.3 * Math.sin(frame * 0.1 + i))});
	}
	return (
		<group>
			<Many kind="stars" geom={() => new THREE.SphereGeometry(1, 6, 4)} items={stars} color="#FFF6D8" outline={0} glow shadow={false} />
			<Glow shape={{kind: 'sphere', r: 16, seg: 40}} color="#FFF3C4" position={[50, 70, -150]} />
			<Glow shape={{kind: 'sphere', r: 24, seg: 32}} color="#FFF3C4" position={[50, 70, -152]} opacity={0.15} />
		</group>
	);
};

/** Falling rain: drops over an area, falling from `top` to the ground in a loop; returns nothing where a drop is inside `hole`. */
export const Rain3D: React.FC<{frame: number; area?: number; n?: number; top?: number; speed?: number; r?: number; center?: [number, number]}> = ({frame, area = 50, n = 70, top = 40, speed = 1.6, r = 1.1, center = [0, 0]}) => {
	const drops: Copy[] = [];
	const splashes: React.ReactNode[] = [];
	for (let i = 0; i < n; i++) {
		const per = top / speed;
		const t = (frame + rnd(i * 3.1) * per) % per;
		const x = center[0] + (rnd(i * 1.3) - 0.5) * area;
		const z = center[1] + (rnd(i * 2.7) - 0.5) * area;
		const y = top - t * speed;
		drops.push({p: [x, y, z], s: [r * 0.85, r * 1.35, r * 0.85]});
		if (i % 2 === 0 && t < 14) {
			splashes.push(<Splash3D key={i} at={[x, 0.05, z]} t={t / 14} r={r} />);
		}
	}
	return (
		<group>
			<Many kind="raindrops" geom={() => new THREE.SphereGeometry(1, 16, 12)} items={drops} color="#BFE6FF" outline={0.08} opacity={0.75} shadow={false} />
			{splashes}
		</group>
	);
};
