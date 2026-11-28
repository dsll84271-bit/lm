import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Solid, useDrawn, usePass} from './DepthLayers';

// The set kit: rooms, lights and furniture that every location is built from.
// Distances are in metres. x runs left to right, y is height, z comes towards
// the camera. Each piece belongs to whichever <Layer> it is placed inside.

export type V3 = [number, number, number];

const texture = (
	draw: (ctx: CanvasRenderingContext2D, size: number) => void,
	size = 256,
) => {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (ctx) {
		draw(ctx, size);
	}

	const t = new THREE.CanvasTexture(canvas);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
};

// ------------------------------------------------------------------ skies

/** Colours of the sky from top to bottom. */
export const SKIES = {
	dawn: ['#7FA2E8', '#F4C9A4', '#FFB36B', '#F08A5D'],
	day: ['#6FAEE8', '#A9D2F2', '#D9ECF7', '#EAF4F8'],
	dusk: ['#2E3270', '#6A4C86', '#D5777A', '#F3A765'],
	night: ['#070B24', '#0E1740', '#1B2A5E', '#2B3A72'],
	grey: ['#8E97A8', '#A7AFBD', '#BFC5CF', '#CCD1D9'],
} as const;
export type SkyName = keyof typeof SKIES;

/** A glowing picture of the sky. It lights nothing; it is just seen. */
export const Sky: React.FC<{kind: SkyName; at: V3; size: [number, number]; roofs?: boolean}> = ({
	kind,
	at,
	size,
	roofs = true,
}) => {
	const drawn = useDrawn();
	const map = useMemo(
		() =>
			texture((ctx, s) => {
				const g = ctx.createLinearGradient(0, 0, 0, s);
				SKIES[kind].forEach((c, i, all) => g.addColorStop(i / (all.length - 1), c));
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, s, s);
				if (kind === 'night') {
					ctx.fillStyle = '#FFF4E0';
					for (let i = 0; i < 60; i++) {
						const r = ((i * 37) % 10) / 10;
						ctx.globalAlpha = 0.3 + 0.7 * r;
						ctx.fillRect(((i * 97) % s) + r, ((i * 53) % (s * 0.7)) + r, 1.5, 1.5);
					}

					ctx.globalAlpha = 1;
					ctx.beginPath();
					ctx.arc(s * 0.72, s * 0.24, s * 0.06, 0, 7);
					ctx.fill();
				}

				if (roofs) {
					ctx.fillStyle = kind === 'day' ? '#8FA3C4' : kind === 'grey' ? '#7C8597' : '#3A3562';
					[0.86, 0.8, 0.84, 0.76, 0.81, 0.88, 0.79, 0.85].forEach((h, i, all) => {
						ctx.fillRect((i * s) / all.length, h * s, s / all.length + 1, s);
					});
				}
			}, 512),
		[kind, roofs],
	);
	if (!drawn) {
		return null;
	}

	return (
		<mesh position={at}>
			<planeGeometry args={size} />
			<meshBasicMaterial map={map} toneMapped={false} />
		</mesh>
	);
};

/** A soft glow: light spilling from a window, a lamp, a screen. */
export const Glow: React.FC<{at: V3; size: [number, number]; color: string; opacity: number}> = ({
	at,
	size,
	color,
	opacity,
}) => {
	const drawn = useDrawn();
	const map = useMemo(
		() =>
			texture((ctx, s) => {
				const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
				g.addColorStop(0, 'rgba(255,255,255,1)');
				g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
				g.addColorStop(1, 'rgba(255,255,255,0)');
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, s, s);
			}),
		[],
	);
	if (!drawn || opacity <= 0) {
		return null;
	}

	return (
		<mesh position={at} renderOrder={3}>
			<planeGeometry args={size} />
			<meshBasicMaterial
				map={map}
				color={color}
				transparent
				opacity={opacity}
				blending={THREE.AdditiveBlending}
				depthWrite={false}
				toneMapped={false}
			/>
		</mesh>
	);
};

// ----------------------------------------------------------------- lights

export type KeyLight = {from: V3; to: V3; color: string; intensity: number};
export type FillLight = {at: V3; color: string; intensity: number; distance?: number};

/** The lighting for a set: soft all-round light, one main light, small fills. */
export const Lights: React.FC<{
	sky?: string;
	ground?: string;
	ambient?: number;
	sun?: KeyLight;
	fills?: FillLight[];
}> = ({sky = '#CFD6FF', ground = '#9C8A8A', ambient = 1, sun, fills = []}) => {
	const pass = usePass();
	const target = useMemo(() => new THREE.Object3D(), []);
	return (
		<>
			<hemisphereLight args={[sky, ground, ambient]} />
			{sun ? (
				<>
					<primitive object={target} position={sun.to} />
					<directionalLight
						position={sun.from}
						target={target}
						color={sun.color}
						// Things close to the lens stay in shade, as dark shapes.
						intensity={pass === 'fg' ? 0 : sun.intensity}
						castShadow={pass !== 'fg'}
						shadow-mapSize-width={pass === 'mid' ? 1536 : 768}
						shadow-mapSize-height={pass === 'mid' ? 1536 : 768}
						shadow-bias={-0.0006}
						shadow-normalBias={0.02}
						shadow-radius={5}
					>
						<orthographicCamera attach="shadow-camera" args={[-7, 7, 6, -6, 0.5, 30]} />
					</directionalLight>
				</>
			) : null}
			{fills.map((f, i) => (
				<pointLight key={i} position={f.at} color={f.color} intensity={f.intensity} distance={f.distance ?? 8} decay={1.6} />
			))}
		</>
	);
};

// ------------------------------------------------------------------ rooms

export type WindowSpec = {x: number; y: number; w: number; h: number};

/**
 * A room: floor, back wall (with optional windows), side walls and ceiling.
 * The back wall is at z = backZ and the room comes forward from there.
 */
export const Room: React.FC<{
	width?: number;
	depth?: number;
	height?: number;
	backZ?: number;
	wall: string;
	side?: string;
	floor: [string, string];
	tile?: number;
	windows?: WindowSpec[];
	sky?: SkyName;
	frame?: string;
	glow?: {color: string; opacity: number};
}> = ({
	width = 11,
	depth = 11,
	height = 3.8,
	backZ = -3,
	wall,
	side,
	floor,
	tile = 1.2,
	windows = [],
	sky = 'day',
	frame = '#F5ECD9',
	glow,
}) => {
	const drawn = useDrawn();
	const half = width / 2;
	const zc = backZ + depth / 2;
	const floorMap = useMemo(() => {
		const t = texture((ctx, s) => {
			ctx.fillStyle = floor[0];
			ctx.fillRect(0, 0, s, s);
			ctx.fillStyle = floor[1];
			ctx.fillRect(0, 0, s / 2, s / 2);
			ctx.fillRect(s / 2, s / 2, s / 2, s / 2);
		});
		t.wrapS = THREE.RepeatWrapping;
		t.wrapT = THREE.RepeatWrapping;
		t.repeat.set(width / tile, depth / tile);
		t.anisotropy = 8;
		return t;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [floor[0], floor[1], width, depth, tile]);

	const sorted = [...windows].sort((a, b) => a.x - b.x);
	const pieces: Array<{x0: number; x1: number; y0: number; y1: number}> = [];
	let cursor = -half;
	for (const w of sorted) {
		pieces.push({x0: cursor, x1: w.x - w.w / 2, y0: 0, y1: height});
		pieces.push({x0: w.x - w.w / 2, x1: w.x + w.w / 2, y0: 0, y1: w.y - w.h / 2});
		pieces.push({x0: w.x - w.w / 2, x1: w.x + w.w / 2, y0: w.y + w.h / 2, y1: height});
		cursor = w.x + w.w / 2;
	}

	pieces.push({x0: cursor, x1: half, y0: 0, y1: height});

	return (
		<>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, zc]} receiveShadow={drawn}>
				<planeGeometry args={[width, depth]} />
				{drawn ? (
					<meshStandardMaterial map={floorMap} roughness={0.75} />
				) : (
					// In the other layers the floor is invisible but still solid, so
					// nothing below floor level (a seated person's legs) shows through.
					<meshBasicMaterial colorWrite={false} />
				)}
			</mesh>
			{pieces
				.filter((p) => p.x1 - p.x0 > 0.01 && p.y1 - p.y0 > 0.01)
				.map((p, i) => (
					<Solid
						key={i}
						size={[p.x1 - p.x0, p.y1 - p.y0, 0.24]}
						position={[(p.x0 + p.x1) / 2, (p.y0 + p.y1) / 2, backZ - 0.12]}
						color={wall}
						bevel={0}
					/>
				))}
			<Solid size={[0.24, height, depth]} position={[-half, height / 2, zc]} color={side ?? wall} bevel={0} />
			<Solid size={[0.24, height, depth]} position={[half, height / 2, zc]} color={side ?? wall} bevel={0} />
			<Solid size={[width + 0.4, 0.2, depth + 0.4]} position={[0, height + 0.1, zc]} color={side ?? wall} bevel={0} />
			<Solid size={[width, 0.1, 0.03]} position={[0, 0.05, backZ + 0.015]} color={side ?? wall} cast={false} />
			{sorted.map((w, i) => (
				<React.Fragment key={i}>
					<Solid size={[w.w + 0.14, 0.07, 0.1]} position={[w.x, w.y + w.h / 2 + 0.035, backZ + 0.03]} color={frame} />
					<Solid size={[w.w + 0.14, 0.07, 0.1]} position={[w.x, w.y - w.h / 2 - 0.035, backZ + 0.03]} color={frame} />
					<Solid size={[0.07, w.h + 0.14, 0.1]} position={[w.x - w.w / 2 - 0.035, w.y, backZ + 0.03]} color={frame} />
					<Solid size={[0.07, w.h + 0.14, 0.1]} position={[w.x + w.w / 2 + 0.035, w.y, backZ + 0.03]} color={frame} />
					<Solid size={[0.04, w.h, 0.05]} position={[w.x, w.y, backZ - 0.06]} color={frame} />
					<Sky kind={sky} at={[w.x, w.y + 0.1, backZ - 0.7]} size={[w.w + 2.6, w.h + 1.6]} />
					{glow ? <Glow at={[w.x, w.y, backZ + 0.2]} size={[w.w * 2.6, w.h * 3]} color={glow.color} opacity={glow.opacity} /> : null}
				</React.Fragment>
			))}
		</>
	);
};

// -------------------------------------------------------------- furniture

type Placed = {at: V3; turn?: number};
const Place: React.FC<Placed & {children: React.ReactNode}> = ({at, turn = 0, children}) => (
	<group position={at} rotation={[0, (turn * Math.PI) / 180, 0]}>
		{children}
	</group>
);

export const WOOD = '#B8804F';
export const WOOD_DARK = '#8F5F3B';
export const CREAM = '#F5ECD9';
export const STEEL = '#B9C4D6';
export const INK = '#1C2244';

export const Table: React.FC<Placed & {size?: [number, number]; h?: number; color?: string; leg?: string}> = ({
	at,
	turn,
	size = [1.6, 0.9],
	h = 0.7,
	color = WOOD,
	leg = WOOD_DARK,
}) => (
	<Place at={at} turn={turn}>
		<Solid size={[size[0], 0.055, size[1]]} position={[0, h - 0.0275, 0]} color={color} bevel={0.02} roughness={0.6} />
		{[-1, 1].flatMap((sx) =>
			[-1, 1].map((sz) => (
				<Solid
					key={`${sx}${sz}`}
					size={[0.07, h - 0.05, 0.07]}
					position={[sx * (size[0] / 2 - 0.08), (h - 0.05) / 2, sz * (size[1] / 2 - 0.08)]}
					color={leg}
				/>
			)),
		)}
	</Place>
);

export const RoundTable: React.FC<Placed & {r?: number; h?: number; color?: string; leg?: string}> = ({
	at,
	r = 0.6,
	h = 0.72,
	color = WOOD,
	leg = WOOD_DARK,
}) => (
	<Place at={at}>
		<Solid shape="cylinder" size={[r, 0.05]} position={[0, h - 0.025, 0]} color={color} roughness={0.6} />
		<Solid shape="cylinder" size={[0.05, h - 0.05]} position={[0, (h - 0.05) / 2, 0]} color={leg} />
		<Solid shape="cylinder" size={[r * 0.55, 0.03]} position={[0, 0.015, 0]} color={leg} />
	</Place>
);

/** A chair. turn 0 = backrest on the +x side (the sitter faces screen left). */
export const Chair: React.FC<Placed & {color?: string; leg?: string}> = ({at, turn, color = WOOD, leg = WOOD_DARK}) => (
	<Place at={at} turn={turn}>
		<Solid size={[0.46, 0.05, 0.46]} position={[0, 0.46, 0]} color={color} bevel={0.02} />
		<Solid size={[0.045, 0.45, 0.045]} position={[-0.19, 0.225, -0.19]} color={leg} />
		<Solid size={[0.045, 0.45, 0.045]} position={[-0.19, 0.225, 0.19]} color={leg} />
		<Solid size={[0.045, 1.02, 0.045]} position={[0.19, 0.51, -0.19]} color={leg} />
		<Solid size={[0.045, 1.02, 0.045]} position={[0.19, 0.51, 0.19]} color={leg} />
		<Solid size={[0.04, 0.2, 0.44]} position={[0.19, 0.9, 0]} color={color} bevel={0.018} />
	</Place>
);

/** A sofa facing the camera. */
export const Sofa: React.FC<Placed & {w?: number; color?: string; dark?: string}> = ({
	at,
	turn,
	w = 2,
	color = '#4F6FA8',
	dark = '#3D5888',
}) => (
	<Place at={at} turn={turn}>
		<Solid size={[w, 0.3, 0.85]} position={[0, 0.25, 0]} color={dark} bevel={0.06} roughness={1} />
		<Solid size={[w, 0.7, 0.24]} position={[0, 0.55, -0.36]} color={color} bevel={0.09} roughness={1} />
		<Solid size={[0.24, 0.5, 0.85]} position={[-w / 2 + 0.06, 0.4, 0]} color={color} bevel={0.09} roughness={1} />
		<Solid size={[0.24, 0.5, 0.85]} position={[w / 2 - 0.06, 0.4, 0]} color={color} bevel={0.09} roughness={1} />
		<Solid size={[w / 2 - 0.2, 0.14, 0.62]} position={[-w / 4 + 0.05, 0.44, 0.06]} color={color} bevel={0.06} roughness={1} />
		<Solid size={[w / 2 - 0.2, 0.14, 0.62]} position={[w / 4 - 0.05, 0.44, 0.06]} color={color} bevel={0.06} roughness={1} />
	</Place>
);

/** A cupboard or counter, with a worktop and door fronts. */
export const Counter: React.FC<Placed & {w: number; h?: number; d?: number; color: string; top?: string; doors?: number}> = ({
	at,
	turn,
	w,
	h = 0.9,
	d = 0.6,
	color,
	top = '#E9DEC8',
	doors = Math.round(w / 0.75),
}) => (
	<Place at={at} turn={turn}>
		<Solid size={[w, h - 0.04, d]} position={[0, (h - 0.04) / 2, 0]} color={color} bevel={0.01} />
		<Solid size={[w + 0.06, 0.05, d + 0.05]} position={[0, h - 0.015, 0.01]} color={top} bevel={0.02} roughness={0.5} />
		{Array.from({length: doors}, (_, i) => {
			const dw = w / doors;
			const x = -w / 2 + dw * (i + 0.5);
			return (
				<React.Fragment key={i}>
					<Solid size={[dw - 0.07, h - 0.24, 0.025]} position={[x, (h - 0.04) / 2, d / 2 + 0.01]} color={color} bevel={0.012} cast={false} />
					<Solid shape="sphere" size={[0.022]} position={[x + dw * 0.32, h * 0.72, d / 2 + 0.035]} color={CREAM} cast={false} roughness={0.4} />
				</React.Fragment>
			);
		})}
	</Place>
);

/** A wall shelf with things on it. */
export const Shelf: React.FC<Placed & {w?: number; items: string[]; color?: string}> = ({at, w = 1.1, items, color = WOOD}) => (
	<Place at={at}>
		<Solid size={[w, 0.04, 0.24]} position={[0, 0, 0]} color={color} />
		{items.map((c, i) => {
			const h = 0.16 + ((i * 7) % 5) * 0.03;
			return (
				<Solid
					key={i}
					shape={i % 3 === 2 ? 'box' : 'cylinder'}
					size={i % 3 === 2 ? [0.13, h, 0.13] : [0.06, h]}
					position={[-w / 2 + (w / (items.length + 1)) * (i + 1), 0.02 + h / 2, 0]}
					color={c}
					roughness={0.45}
				/>
			);
		})}
	</Place>
);

export const Plant: React.FC<Placed & {s?: number; pot?: string; leaf?: string}> = ({at, s = 1, pot = '#B5654A', leaf = '#2A9485'}) => (
	<Place at={at}>
		<Solid shape="cylinder" size={[0.2 * s, 0.34 * s, 0.15 * s]} position={[0, 0.17 * s, 0]} color={pot} />
		{[
			[-0.16, 0.62, 0.5],
			[0.14, 0.7, -0.45],
			[0, 0.86, 0.1],
			[-0.26, 0.5, 0.9],
			[0.27, 0.52, -0.85],
		].map(([dx, dy, rz], i) => (
			<Solid
				key={i}
				shape="sphere"
				size={[0.2 * s]}
				scale={[0.42, 1.5, 0.3]}
				rotation={[0, 0, rz]}
				position={[dx * s, (0.3 + dy) * s, 0]}
				color={leaf}
			/>
		))}
	</Place>
);

/** A lamp hanging from the ceiling. `on` makes it glow. */
export const Pendant: React.FC<{at: V3; on?: boolean; color?: string}> = ({at, on = false, color = CREAM}) => (
	<Place at={at}>
		<Solid shape="cylinder" size={[0.006, 2]} position={[0, 1.1, 0]} color={INK} cast={false} />
		<Solid shape="cone" size={[0.24, 0.2]} position={[0, 0, 0]} color={color} roughness={0.5} emissive={on ? '#FFD9A0' : undefined} emissiveIntensity={0.6} />
		{on ? <Glow at={[0, -0.15, 0.1]} size={[1.6, 1.4]} color="#FFD9A0" opacity={0.5} /> : null}
	</Place>
);

/** A standing lamp. */
export const FloorLamp: React.FC<{at: V3; on?: boolean}> = ({at, on = true}) => (
	<Place at={at}>
		<Solid shape="cylinder" size={[0.14, 0.03]} position={[0, 0.015, 0]} color={INK} />
		<Solid shape="cylinder" size={[0.015, 1.4]} position={[0, 0.7, 0]} color={INK} />
		<Solid shape="cylinder" size={[0.14, 0.3, 0.2]} position={[0, 1.5, 0]} color={CREAM} emissive={on ? '#FFD9A0' : undefined} emissiveIntensity={0.9} cast={false} />
		{on ? <Glow at={[0, 1.5, 0.25]} size={[2.2, 2.2]} color="#FFCF94" opacity={0.45} /> : null}
	</Place>
);

/** A framed picture on the wall. */
export const Picture: React.FC<{at: V3; size?: [number, number]; color: string; frame?: string}> = ({
	at,
	size = [0.6, 0.45],
	color,
	frame = CREAM,
}) => (
	<Place at={at}>
		<Solid size={[size[0] + 0.08, size[1] + 0.08, 0.03]} color={frame} cast={false} />
		<Solid size={[size[0], size[1], 0.035]} position={[0, 0, 0.004]} color={color} cast={false} bevel={0.004} />
	</Place>
);

export const Door: React.FC<Placed & {color?: string}> = ({at, turn, color = '#D9CDB6'}) => (
	<Place at={at} turn={turn}>
		<Solid size={[0.95, 2.1, 0.06]} position={[0, 1.05, 0]} color={color} bevel={0.015} cast={false} />
		<Solid size={[0.7, 0.8, 0.02]} position={[0, 1.5, 0.035]} color={color} bevel={0.012} cast={false} />
		<Solid size={[0.7, 0.7, 0.02]} position={[0, 0.55, 0.035]} color={color} bevel={0.012} cast={false} />
		<Solid shape="sphere" size={[0.035]} position={[0.36, 1.02, 0.07]} color={STEEL} metalness={0.5} cast={false} />
	</Place>
);

/** A mug. */
export const Mug: React.FC<{at: V3; band?: string}> = ({at, band = '#19C2B1'}) => (
	<Place at={at}>
		<Solid shape="cylinder" size={[0.045, 0.1]} position={[0, 0.05, 0]} color="#FFF4E0" roughness={0.4} />
		<Solid shape="cylinder" size={[0.0465, 0.028]} position={[0, 0.045, 0]} color={band} roughness={0.4} />
		<Solid size={[0.018, 0.06, 0.03]} position={[-0.055, 0.052, 0]} color="#FFF4E0" bevel={0.008} />
	</Place>
);

/** A flat screen. `glow` is the colour it throws into the room. */
export const Screen: React.FC<Placed & {size?: [number, number]; color: string; glow?: number}> = ({
	at,
	turn,
	size = [1.3, 0.75],
	color,
	glow = 0.5,
}) => (
	<Place at={at} turn={turn}>
		<Solid size={[size[0] + 0.06, size[1] + 0.06, 0.05]} color={INK} bevel={0.012} />
		<Solid size={[size[0], size[1], 0.01]} position={[0, 0, 0.027]} color={color} emissive={color} emissiveIntensity={1.2} cast={false} bevel={0.003} />
		<Glow at={[0, 0, 0.2]} size={[size[0] * 2.6, size[1] * 3]} color={color} opacity={glow} />
	</Place>
);

/** A cardboard box, a present, a stack of anything boxy. */
export const Box: React.FC<{at: V3; size: V3; color: string; turn?: number; ribbon?: string}> = ({at, size, color, turn, ribbon}) => (
	<Place at={at} turn={turn}>
		<Solid size={size} position={[0, size[1] / 2, 0]} color={color} bevel={0.01} roughness={0.7} />
		{ribbon ? (
			<>
				<Solid size={[size[0] + 0.006, size[1] + 0.006, size[2] * 0.16]} position={[0, size[1] / 2, 0]} color={ribbon} cast={false} />
				<Solid size={[size[0] * 0.16, size[1] + 0.006, size[2] + 0.006]} position={[0, size[1] / 2, 0]} color={ribbon} cast={false} />
			</>
		) : null}
	</Place>
);
