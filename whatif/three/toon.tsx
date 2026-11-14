import React, {createContext, useContext, useMemo} from 'react';
import * as THREE from 'three';

// Cel shading: a 3-step light ramp, plus a dark "inverted hull" outline on
// every shape. This is the look the top "What if" channels use.

let ramp: THREE.DataTexture | null = null;
export const toonRamp = () => {
	if (!ramp) {
		const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
		ramp = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
		ramp.minFilter = THREE.NearestFilter;
		ramp.magFilter = THREE.NearestFilter;
		ramp.needsUpdate = true;
	}
	return ramp;
};

export const INK = '#140A28';

/**
 * Makes every shape inside it glassy: `fill` is the body's opacity, `line` the
 * outline's, and `tint` a colour the body is mixed towards. Used for the
 * invisible hero. fill = 1 means normal.
 */
export type FadeState = {fill: number; line: number; tint?: string; shadow?: boolean};
export const Fade = createContext<FadeState>({fill: 1, line: 1});
const mixColor = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

type Shape =
	| {kind: 'sphere'; r: number; seg?: number}
	| {kind: 'capsule'; r: number; len: number}
	| {kind: 'box'; w: number; h: number; d: number; round?: number}
	| {kind: 'cyl'; r: number; r2?: number; h: number; seg?: number}
	| {kind: 'torus'; r: number; tube: number}
	| {kind: 'cone'; r: number; h: number};

const geomFor = (s: Shape): THREE.BufferGeometry => {
	switch (s.kind) {
		case 'sphere':
			return new THREE.SphereGeometry(s.r, s.seg ?? 40, Math.round((s.seg ?? 40) * 0.7));
		case 'capsule':
			return new THREE.CapsuleGeometry(s.r, s.len, 8, 20);
		case 'box':
			return new THREE.BoxGeometry(s.w, s.h, s.d);
		case 'cyl':
			return new THREE.CylinderGeometry(s.r2 ?? s.r, s.r, s.h, s.seg ?? 32);
		case 'torus':
			return new THREE.TorusGeometry(s.r, s.tube, 16, 40);
		case 'cone':
			return new THREE.ConeGeometry(s.r, s.h, 32);
	}
};

/** One cel-shaded shape with an outline. */
export const T: React.FC<{
	shape: Shape;
	color: string;
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: [number, number, number] | number;
	outline?: number;
	emissive?: string;
	emissiveIntensity?: number;
	shadow?: boolean;
	receive?: boolean;
	opacity?: number;
	children?: React.ReactNode;
}> = ({shape, color, position, rotation, scale, outline = 0.025, emissive, emissiveIntensity = 1, shadow = true, receive = true, opacity = 1, children}) => {
	const fade = useContext(Fade);
	const key = JSON.stringify(shape);
	const geom = useMemo(() => geomFor(shape), [key]);
	const glassy = fade.fill < 1;
	const fillOpacity = opacity * fade.fill;
	const lineOpacity = opacity * fade.line;
	const bodyColor = glassy && fade.tint ? mixColor(color, fade.tint, 0.55) : color;
	const castsShadow = shadow && (fade.shadow ?? !glassy);
	const s = typeof scale === 'number' ? [scale, scale, scale] : scale;
	// The outline is the same shape, a little bigger, drawn inside-out in ink.
	const out = useMemo(() => {
		if (outline <= 0) {
			return null;
		}
		const g = geomFor(shape);
		g.computeBoundingSphere();
		return g;
	}, [key, outline]);
	const k = out ? 1 + outline / Math.max(0.05, out.boundingSphere?.radius ?? 1) : 1;
	return (
		<group position={position} rotation={rotation} scale={s as [number, number, number] | undefined}>
			<mesh geometry={geom} castShadow={castsShadow} receiveShadow={receive && !glassy} renderOrder={glassy ? 1 : 0}>
				<meshToonMaterial color={bodyColor} gradientMap={toonRamp()} emissive={emissive ?? '#000000'} emissiveIntensity={emissive ? emissiveIntensity : 0} transparent={fillOpacity < 1} opacity={fillOpacity} />
			</mesh>
			{out && lineOpacity > 0.01 ? (
				<mesh geometry={out} scale={[k, k, k]} renderOrder={glassy ? 2 : 0}>
					<meshBasicMaterial color={INK} side={THREE.BackSide} transparent={lineOpacity < 1} opacity={lineOpacity} />
				</mesh>
			) : null}
			{children}
		</group>
	);
};

/** A glowing, unlit shape (screens, windows, lamps). */
export const Glow: React.FC<{shape: Shape; color: string; position?: [number, number, number]; rotation?: [number, number, number]; opacity?: number}> = ({shape, color, position, rotation, opacity = 1}) => {
	const key = JSON.stringify(shape);
	const geom = useMemo(() => geomFor(shape), [key]);
	return (
		<mesh geometry={geom} position={position} rotation={rotation}>
			<meshBasicMaterial color={color} toneMapped={false} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1} />
		</mesh>
	);
};
