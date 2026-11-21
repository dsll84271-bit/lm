import {useFrame, useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {createContext, useContext, useMemo, useRef} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Depth layers: how every 3D shot gets "background slightly blurred,
// characters sharp" from the rulebook.
//
// The same set is drawn three times, through the same camera:
//   bg  - everything far away, drawn slightly out of focus
//   mid - the characters and whatever they touch, drawn sharp
//   fg  - anything close to the lens, drawn out of focus
// The three pictures are stacked. An object that belongs to another layer is
// still there invisibly, so its shadow falls correctly across all three.

export type Pass = 'bg' | 'mid' | 'fg';

export type CameraPose = {
	position: [number, number, number];
	target: [number, number, number];
	/** Field of view in degrees. Smaller = longer lens. */
	fov: number;
};

const PassContext = createContext<Pass>('mid');
const LayerContext = createContext<Pass>('mid');

/** Which of the three pictures is being drawn right now. */
export const usePass = () => useContext(PassContext);
/** Which layer the current object belongs to. */
export const useLayer = () => useContext(LayerContext);
/** True when the current object should actually be visible. */
export const useDrawn = () => usePass() === useLayer();

/** Everything inside belongs to this layer. */
export const Layer: React.FC<{name: Pass; children: React.ReactNode}> = ({
	name,
	children,
}) => <LayerContext.Provider value={name}>{children}</LayerContext.Provider>;

const CameraRig: React.FC<{pose: CameraPose; exposure: number}> = ({
	pose,
	exposure,
}) => {
	const latest = useRef(pose);
	latest.current = pose;
	const gl = useThree((s) => s.gl);
	gl.toneMappingExposure = exposure;
	useFrame(({camera}) => {
		const cam = camera as THREE.PerspectiveCamera;
		const p = latest.current;
		cam.position.set(...p.position);
		cam.fov = p.fov;
		cam.near = 0.1;
		cam.far = 80;
		cam.lookAt(...p.target);
		cam.updateProjectionMatrix();
		cam.updateMatrixWorld();
	}, -1);
	return null;
};

export type DepthLayersProps = {
	camera: CameraPose;
	/** The set. It is drawn once per layer. */
	children: React.ReactNode;
	/** Blur in pixels at 1080p. */
	backgroundBlur?: number;
	foregroundBlur?: number;
	exposure?: number;
	/** Colour behind everything. */
	backdrop?: string;
};

export const DepthLayers: React.FC<DepthLayersProps> = ({
	camera,
	children,
	backgroundBlur = 3,
	foregroundBlur = 6,
	exposure = 1,
	backdrop = '#0B1437',
}) => {
	const {width, height} = useVideoConfig();
	const k = height / 1080;
	// The two blurred layers are drawn at half size: the blur hides the
	// difference and the render is much faster.
	const passes: Array<{pass: Pass; blur: number; detail: number}> = [
		{pass: 'bg', blur: backgroundBlur * k, detail: backgroundBlur > 0 ? 0.5 : 1},
		{pass: 'mid', blur: 0, detail: 1},
		{pass: 'fg', blur: foregroundBlur * k, detail: foregroundBlur > 0 ? 0.5 : 1},
	];

	return (
		<AbsoluteFill style={{backgroundColor: backdrop}}>
			{passes.map(({pass, blur, detail}) => (
				<AbsoluteFill
					key={pass}
					style={{filter: blur > 0 ? `blur(${blur}px)` : undefined}}
				>
					<ThreeCanvas
						width={width}
						height={height}
						shadows={pass === 'fg' ? false : 'soft'}
						dpr={detail}
						gl={{antialias: detail === 1, alpha: true}}
						camera={{fov: camera.fov, near: 0.1, far: 80}}
					>
						<PassContext.Provider value={pass}>
							<CameraRig pose={camera} exposure={exposure} />
							{children}
						</PassContext.Provider>
					</ThreeCanvas>
				</AbsoluteFill>
			))}
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------ set pieces

type Vec3 = [number, number, number];

export type SolidProps = {
	/** 'box' has softly rounded edges. */
	shape?: 'box' | 'cylinder' | 'sphere' | 'cone';
	/** box: [width, height, depth]. cylinder/cone: [radius, height]. sphere: [radius]. */
	size: number[];
	position?: Vec3;
	rotation?: Vec3;
	scale?: Vec3;
	color: string;
	/** How rounded a box's edges are, in metres. */
	bevel?: number;
	roughness?: number;
	metalness?: number;
	/** Makes it glow. */
	emissive?: string;
	emissiveIntensity?: number;
	/** Whether it throws a shadow. */
	cast?: boolean;
	receive?: boolean;
};

const SHADOW_ONLY = new THREE.MeshBasicMaterial({
	colorWrite: false,
	depthWrite: false,
});

/** One solid piece of a set: a box, cylinder, ball or cone. */
export const Solid: React.FC<SolidProps> = ({
	shape = 'box',
	size,
	position,
	rotation,
	scale,
	color,
	bevel,
	roughness = 0.85,
	metalness = 0,
	emissive,
	emissiveIntensity = 1,
	cast = true,
	receive = true,
}) => {
	const drawn = useDrawn();
	const key = size.join(',');
	const geometry = useMemo(() => {
		if (shape === 'cylinder') {
			return new THREE.CylinderGeometry(size[0], size[2] ?? size[0], size[1], 40);
		}

		if (shape === 'cone') {
			return new THREE.ConeGeometry(size[0], size[1], 40);
		}

		if (shape === 'sphere') {
			return new THREE.SphereGeometry(size[0], 40, 28);
		}

		const r = Math.min(bevel ?? 0.012, Math.min(size[0], size[1], size[2]) / 2.01);
		if (r <= 0) {
			return new THREE.BoxGeometry(size[0], size[1], size[2]);
		}

		return new RoundedBoxGeometry(size[0], size[1], size[2], 3, r);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shape, key, bevel]);

	if (!drawn && !cast) {
		return null;
	}

	return (
		<mesh
			geometry={geometry}
			position={position}
			rotation={rotation}
			scale={scale}
			castShadow={cast}
			receiveShadow={receive && drawn}
			material={drawn ? undefined : SHADOW_ONLY}
		>
			{drawn ? (
				<meshStandardMaterial
					color={color}
					roughness={roughness}
					metalness={metalness}
					emissive={emissive ?? '#000000'}
					emissiveIntensity={emissive ? emissiveIntensity : 0}
				/>
			) : null}
		</mesh>
	);
};
