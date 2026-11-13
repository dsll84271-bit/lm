import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {HERO, YOU, type HeroFace, type Look} from '../characters/Hero';
import {drawFace} from './face';
import {INK, T} from './toon';

// The hero in 3D: a cel-shaded puppet (sphere head with a painted face,
// hoodie body, capsule limbs, mitten hands, chunky trainers), like the top
// channels use. About 1.7 units tall, feet at its position.

export type Arm3 = [number, number];

export type Hero3DProps = {
	who?: Look;
	position?: [number, number, number];
	/** Turn to face: 0 = towards the camera's default view (+z), in radians. */
	turn?: number;
	height?: number;
	face?: HeroFace;
	look?: [number, number];
	talk?: number;
	blink?: number;
	/** Degrees in the body's plane: 0 hangs down, 90 sideways, 180 up. [upper, fore]. */
	armL?: Arm3;
	armR?: Arm3;
	/** Degrees the arms reach forward (towards the way the body faces). */
	reachL?: number;
	reachR?: number;
	fists?: boolean;
	walk?: number;
	run?: boolean;
	sit?: boolean;
	hop?: number;
	tilt?: number;
	lean?: number;
	still?: boolean;
	opacity?: number;
	/** A glow behind the body. */
	aura?: string;
	/** Crowd extras: the face is painted once, not every frame. */
	lite?: boolean;
};

const R = 0.32; // head radius
const FACE_PX = 512;

const headDecal = () => {
	const g = new THREE.SphereGeometry(R * 1.006, 48, 32, 0, Math.PI, 0, Math.PI);
	const pos = g.attributes.position;
	const uv = g.attributes.uv;
	const F = R * 1.27;
	for (let i = 0; i < pos.count; i++) {
		uv.setXY(i, 0.5 + pos.getX(i) / (2 * F), 0.5 + pos.getY(i) / (2 * F));
	}
	uv.needsUpdate = true;
	return g;
};

const deg = (d: number) => (d * Math.PI) / 180;

const Limb: React.FC<{side: 1 | -1; a: Arm3; reach: number; color: string; dark: string; hand: string; fist: boolean; sway: number}> = ({side, a, reach, color, dark, hand, fist, sway}) => (
	<group position={[0.25 * side, 1.0, 0]} rotation={[-deg(reach) + sway, 0, deg(a[0]) * side]}>
		<T shape={{kind: 'capsule', r: 0.078, len: 0.16}} color={color} position={[0, -0.14, 0]} />
		<group position={[0, -0.28, 0]} rotation={[0, 0, deg(a[1] - a[0]) * side]}>
			<T shape={{kind: 'capsule', r: 0.074, len: 0.14}} color={color} position={[0, -0.12, 0]} />
			<T shape={{kind: 'cyl', r: 0.085, h: 0.05}} color={dark} position={[0, -0.23, 0]} outline={0.01} />
			<T shape={{kind: 'sphere', r: fist ? 0.085 : 0.09}} color={hand} position={[0, -0.31, 0]} scale={fist ? 1 : [1, 1.12, 0.8]} />
		</group>
	</group>
);

export const Hero3D: React.FC<Hero3DProps> = ({
	who = YOU,
	position = [0, 0, 0],
	turn = 0,
	height = 1.7,
	face = 'neutral',
	look = [0, 0],
	talk = 0,
	blink: blinkIn,
	armL: armLIn,
	armR: armRIn,
	reachL = 0,
	reachR = 0,
	fists = false,
	walk,
	run = false,
	sit = false,
	hop = 0,
	tilt = 0,
	lean = 0,
	still = false,
	opacity = 1,
	aura,
	lite = false,
}) => {
	const frame = useCurrentFrame();
	const seed = (Math.abs(Math.round(position[0] * 13 + position[2] * 7 + height * 10)) % 97) / 9;
	const alive = still ? 0 : 1;
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2) * (run ? 1.5 : 1);
	const bob = walk === undefined ? Math.sin(frame * 0.09 + seed) * 0.008 * alive : Math.abs(Math.cos(walk * Math.PI * 2)) * (run ? 0.06 : 0.03);
	const sway = Math.sin(frame * 0.07 + seed) * 0.04 * alive;
	const baseL: Arm3 = armLIn ?? (run ? [25, 95] : [12, 6]);
	const baseR: Arm3 = armRIn ?? (run ? [25, 95] : [12, 6]);
	const armSwing = walk === undefined ? 0 : (run ? 0.9 : armLIn || armRIn ? 0.15 : 0.45) * w;
	const blink =
		blinkIn ??
		(still
			? 0
			: (() => {
					const t = (frame + seed * 31) % 101;
					return t > 94 ? 1 - Math.abs(t - 97.5) / 3.5 : 0;
				})());
	const nod = (talk > 0.05 ? Math.sin(frame * 0.55) * 0.05 : 0) + Math.sin(frame * 0.05 + seed) * 0.03 * alive;

	// The face texture, redrawn every frame.
	const {canvas, tex, decal} = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = FACE_PX;
		c.height = FACE_PX;
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		t.anisotropy = 4;
		return {canvas: c, tex: t, decal: headDecal()};
	}, []);
	const ctx = canvas.getContext('2d');
	const faceKey = `${face}|${look.join(',')}|${talk > 0.05 ? 1 : 0}|${blink > 0.5 ? 1 : 0}`;
	const drawn = useMemo(() => ({key: ''}), []);
	if (ctx && (!lite || drawn.key !== faceKey)) {
		drawn.key = faceKey;
		drawFace(ctx, FACE_PX, {face, look, blink, talk, skin: who.head, glasses: who.glasses});
		tex.needsUpdate = true;
	}

	const sitDrop = sit ? 0.36 : 0;
	const k = height / 1.7;
	const hairColor = who.hairColor ?? '#2A1E2E';
	return (
		<group position={[position[0], position[1] + hop * 0.5 * k, position[2]]} rotation={[0, turn, 0]} scale={[k, k, k]}>
			{aura ? (
				<mesh position={[0, 0.9, -0.3]}>
					<circleGeometry args={[0.9, 48]} />
					<meshBasicMaterial color={aura} transparent opacity={0.35 * opacity} toneMapped={false} />
				</mesh>
			) : null}
			{/* legs and trainers */}
			{[-1, 1].map((s) => {
				const legRot = sit ? -Math.PI / 2 : w * s * (run ? 0.7 : 0.45);
				return (
					<group key={s} position={[0.09 * s, 0.5 - sitDrop, 0]} rotation={[legRot, 0, 0]}>
						<T shape={{kind: 'capsule', r: 0.08, len: 0.26}} color={who.legs} position={[0, -0.2, 0]} />
						<group position={[0, -0.42, 0.05]} rotation={[sit ? Math.PI / 2 : 0, 0, 0]}>
							<T shape={{kind: 'box', w: 0.15, h: 0.09, d: 0.27}} color={who.shoe} position={[0, 0.01, 0.02]} outline={0.012} />
							<T shape={{kind: 'box', w: 0.16, h: 0.035, d: 0.29}} color={who.sole} position={[0, -0.045, 0.02]} outline={0.01} />
						</group>
					</group>
				);
			})}
			<group position={[0, bob - sitDrop, 0]} rotation={[deg(lean), 0, 0]}>
				{/* body */}
				<T shape={{kind: 'cyl', r: 0.29, r2: 0.25, h: 0.6, seg: 40}} color={who.hoodie} position={[0, 0.78, 0]} />
				<T shape={{kind: 'cyl', r: 0.3, h: 0.06, seg: 40}} color={who.hoodieDark} position={[0, 0.5, 0]} outline={0.01} />
				{who.collar ? (
					<T shape={{kind: 'cone', r: 0.12, h: 0.14}} color="#ffffff" position={[0, 1.02, 0.18]} rotation={[Math.PI, 0, 0]} outline={0.01} />
				) : (
					<T shape={{kind: 'torus', r: 0.21, tube: 0.075}} color={who.hoodieDark} position={[0, 1.06, -0.02]} rotation={[Math.PI / 2 - 0.25, 0, 0]} />
				)}
				{who.emblem ? (
					<group position={[0, 0.84, 0.265]}>
						<mesh>
							<circleGeometry args={[0.085, 40]} />
							<meshBasicMaterial color={HERO.emblem} toneMapped={false} />
						</mesh>
						<mesh position={[0, 0, 0.002]}>
							<circleGeometry args={[0.068, 40]} />
							<meshBasicMaterial color={who.hoodieDark} />
						</mesh>
						<mesh position={[0, -0.003, 0.004]}>
							<planeGeometry args={[0.1, 0.1]} />
							<meshBasicMaterial map={qTexture()} transparent toneMapped={false} />
						</mesh>
					</group>
				) : null}
				{!who.collar
					? [-0.07, 0.07].map((x) => <T key={x} shape={{kind: 'capsule', r: 0.012, len: 0.12}} color={who.sole} position={[x, 0.98, 0.25]} outline={0.006} />)
					: null}
				<Limb side={-1} a={baseL} reach={reachL + (walk !== undefined ? armSwing * 40 : 0)} color={who.hoodie} dark={who.hoodieDark} hand={who.head} fist={fists} sway={sway} />
				<Limb side={1} a={baseR} reach={reachR - (walk !== undefined ? armSwing * 40 : 0)} color={who.hoodie} dark={who.hoodieDark} hand={who.head} fist={fists} sway={-sway} />
				{/* head */}
				<group position={[0, 1.36, 0]} rotation={[nod, 0, deg(tilt)]}>
					{who.hair === 'long' ? <T shape={{kind: 'capsule', r: 0.31, len: 0.25}} color={hairColor} position={[0, -0.1, -0.08]} /> : null}
					{who.hair === 'bun' ? <T shape={{kind: 'sphere', r: 0.11}} color={hairColor} position={[0, 0.34, -0.06]} /> : null}
					<T shape={{kind: 'sphere', r: R, seg: 48}} color={who.head} outline={0.02} />
					<mesh geometry={decal}>
						<meshBasicMaterial map={tex} transparent alphaTest={0.05} toneMapped={false} />
					</mesh>
					{/* gloss highlight */}
					<mesh position={[-0.13, 0.17, 0.22]} rotation={[0, -0.4, -0.5]} scale={[1, 0.55, 0.3]}>
						<sphereGeometry args={[0.06, 16, 12]} />
						<meshBasicMaterial color="#ffffff" transparent opacity={0.75} toneMapped={false} />
					</mesh>
					{who.hair === 'short' || who.hair === 'bun' || who.hair === 'long' ? (
						<T shape={{kind: 'sphere', r: R * 1.05, seg: 40}} color={hairColor} position={[0, 0.1, -0.04]} scale={[1, 0.72, 0.98]} outline={0.015} />
					) : null}
					{who.hair === 'spiky'
						? [-0.18, -0.06, 0.06, 0.18].map((x, i) => <T key={x} shape={{kind: 'cone', r: 0.08, h: 0.2}} color={hairColor} position={[x, 0.3 - Math.abs(x) * 0.3, -0.02]} rotation={[-0.3, 0, -x * 2]} outline={0.01} />)
						: null}
					{who.hair === 'cap' ? (
						<group>
							<T shape={{kind: 'sphere', r: R * 1.05, seg: 40}} color={hairColor} position={[0, 0.07, 0]} scale={[1, 0.7, 1]} />
							<T shape={{kind: 'box', w: 0.34, h: 0.03, d: 0.26}} color={hairColor} position={[0, 0.14, 0.3]} outline={0.01} />
						</group>
					) : null}
				</group>
			</group>
		</group>
	);
};

let q: THREE.CanvasTexture | null = null;
const qTexture = () => {
	if (!q) {
		const c = document.createElement('canvas');
		c.width = 128;
		c.height = 128;
		const x = c.getContext('2d')!;
		x.fillStyle = HERO.emblem;
		x.font = 'bold 110px Fredoka, sans-serif';
		x.textAlign = 'center';
		x.textBaseline = 'middle';
		x.fillText('?', 64, 70);
		q = new THREE.CanvasTexture(c);
		q.colorSpace = THREE.SRGBColorSpace;
	}
	return q;
};

export {INK};
