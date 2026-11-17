import {ThreeCanvas} from '@remotion/three';
import {useFrame} from '@react-three/fiber';
import React, {useMemo, useRef} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// One 3D shot: a camera, lights, and the scene. Two passes give a cheap depth
// of field: the far set is drawn blurred behind, the near layer (people and
// close props) sharp in front.

export type Cam3 = {pos: [number, number, number]; at: [number, number, number]; fov?: number; roll?: number; near?: number; far?: number};

const CameraRig: React.FC<{cam: Cam3}> = ({cam}) => {
	const latest = useRef(cam);
	latest.current = cam;
	useFrame(({camera}) => {
		const c = camera as THREE.PerspectiveCamera;
		const p = latest.current;
		c.fov = p.fov ?? 35;
		c.near = p.near ?? 0.05;
		c.far = p.far ?? 200;
		c.position.set(...p.pos);
		c.up.set(0, 1, 0);
		c.lookAt(...p.at);
		if (p.roll) {
			c.rotateZ((p.roll * Math.PI) / 180);
		}
		c.updateProjectionMatrix();
		c.updateMatrixWorld();
	}, -1);
	return null;
};

export type Light3 = {
	/** Sky / ground hemisphere colours. */
	sky: string;
	ground: string;
	ambient?: number;
	/** Main light, casts shadows. */
	sun: {from: [number, number, number]; color: string; intensity: number};
	/** A coloured light from behind, for the rim glow. */
	rim?: {from: [number, number, number]; color: string; intensity: number};
	points?: Array<{at: [number, number, number]; color: string; intensity: number; distance?: number}>;
	fog?: {color: string; near: number; far: number};
	/** The box the sun's shadows cover (half-size, depth, centre). Default: 8 units round the origin. */
	shadow?: {size?: number; far?: number; at?: [number, number, number]};
};

const Lights: React.FC<{l: Light3; shadows: boolean}> = ({l, shadows}) => {
	const target = useMemo(() => new THREE.Object3D(), []);
	const sz = l.shadow?.size ?? 8;
	const at = l.shadow?.at ?? [0, 0.8, 0];
	const sun: [number, number, number] = l.shadow?.at ? [at[0] + l.sun.from[0], at[1] + l.sun.from[1], at[2] + l.sun.from[2]] : l.sun.from;
	return (
		<>
			<hemisphereLight args={[l.sky, l.ground, l.ambient ?? 1.1]} />
			<primitive object={target} position={at} />
			<directionalLight position={sun} color={l.sun.color} intensity={l.sun.intensity} castShadow={shadows} target={target} shadow-mapSize={l.shadow ? [2048, 2048] : [1024, 1024]} shadow-bias={-0.0006} shadow-normalBias={0.02}>
				<orthographicCamera attach="shadow-camera" args={[-sz, sz, sz, -sz, 0.5, l.shadow?.far ?? 40]} />
			</directionalLight>
			{l.rim ? <directionalLight position={l.rim.from} color={l.rim.color} intensity={l.rim.intensity} target={target} /> : null}
			{(l.points ?? []).map((p, i) => (
				<pointLight key={i} position={p.at} color={p.color} intensity={p.intensity} distance={p.distance ?? 8} decay={1.5} />
			))}
			{l.fog ? <fog attach="fog" args={[l.fog.color, l.fog.near, l.fog.far]} /> : null}
		</>
	);
};

/**
 * Draws `far` (the set) blurred, then `near` (the people) sharp, through the
 * same camera. Pass `blur={0}` to draw everything sharp in one pass.
 */
export const Stage3D: React.FC<{cam: Cam3; light: Light3; bg: string; far: React.ReactNode; near: React.ReactNode; blur?: number}> = ({cam, light, bg, far, near, blur = 3}) => {
	const {width, height} = useVideoConfig();
	const gl = {antialias: true, preserveDrawingBuffer: true};
	if (blur <= 0) {
		return (
			<AbsoluteFill style={{background: bg}}>
				<ThreeCanvas width={width} height={height} shadows dpr={1} gl={gl} camera={{fov: cam.fov ?? 35, near: cam.near ?? 0.05, far: cam.far ?? 200}}>
					<CameraRig cam={cam} />
					<Lights l={light} shadows />
					{far}
					{near}
				</ThreeCanvas>
			</AbsoluteFill>
		);
	}
	return (
		<AbsoluteFill style={{background: bg}}>
			<AbsoluteFill style={{filter: `blur(${blur}px)`, transform: 'scale(1.02)'}}>
				<ThreeCanvas width={width} height={height} shadows dpr={0.6} gl={gl} camera={{fov: cam.fov ?? 35, near: cam.near ?? 0.05, far: cam.far ?? 200}}>
					<CameraRig cam={cam} />
					<Lights l={light} shadows />
					{far}
				</ThreeCanvas>
			</AbsoluteFill>
			<AbsoluteFill>
				<ThreeCanvas width={width} height={height} shadows dpr={1} gl={{...gl, alpha: true}} camera={{fov: cam.fov ?? 35, near: cam.near ?? 0.05, far: cam.far ?? 200}}>
					<CameraRig cam={cam} />
					<Lights l={light} shadows />
					{near}
				</ThreeCanvas>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** Where a 3D point lands on screen (pixels), for speech and thought bubbles. */
export const project = (cam: Cam3, p: [number, number, number], width = 1920, height = 1080): [number, number] => {
	const c = new THREE.PerspectiveCamera(cam.fov ?? 35, width / height, cam.near ?? 0.05, cam.far ?? 200);
	c.position.set(...cam.pos);
	c.lookAt(...cam.at);
	if (cam.roll) {
		c.rotateZ((cam.roll * Math.PI) / 180);
	}
	c.updateMatrixWorld();
	c.updateProjectionMatrix();
	const v = new THREE.Vector3(...p).project(c);
	return [(v.x + 1) * 0.5 * width, (1 - v.y) * 0.5 * height];
};
