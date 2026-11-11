import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Layer, Solid, useDrawn, usePass} from '../../../../components/DepthLayers';

// The kitchen from the cold open. Early morning: a cool blue room with low,
// warm sunlight coming in through the window over the sink.
//
// Distances are in metres. x runs left to right, y is height, z comes towards
// the camera. The back wall is at z = -3.

export const KITCHEN = {
	/** Middle of the window, where the sun comes in. */
	window: [-1.3, 1.66, -3] as [number, number, number],
	/** Where Mum stands at the sink. */
	mum: [-1.3, 0, -2.18] as [number, number, number],
	/** Where the stickman's feet go when he sits on his chair. */
	/** A little nearer the camera than the chair, so the chair sits behind him. */
	stickman: [1.44, 0, 0.07] as [number, number, number],
	tableTop: 0.7,
};

const C = {
	wall: '#46527F',
	wallDark: '#3A4570',
	ceiling: '#333C63',
	floorA: '#343C5E',
	floorB: '#3F486C',
	cabinet: '#35767A',
	cabinetDark: '#2B6165',
	worktop: '#E9DEC8',
	frame: '#F5ECD9',
	fridge: '#C3CEE2',
	wood: '#B8804F',
	woodDark: '#8F5F3B',
	steel: '#B9C4D6',
	red: '#E2493B',
	cream: '#FFF4E0',
	teal: '#19C2B1',
	leaf: '#2A9485',
	pot: '#B5654A',
	rug: '#7C3F52',
};

const PLANT_X = 1.78;
/** Ceiling height. Tall enough that the camera never sees the ceiling. */
const ROOM_H = 3.8;

const FlatTexture = (
	draw: (ctx: CanvasRenderingContext2D, size: number) => void,
	size = 512,
) => {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (ctx) {
		draw(ctx, size);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	return texture;
};

/** The tiled floor. */
const Floor: React.FC = () => {
	const drawn = useDrawn();
	const texture = useMemo(() => {
		const t = FlatTexture((ctx, s) => {
			ctx.fillStyle = C.floorA;
			ctx.fillRect(0, 0, s, s);
			ctx.fillStyle = C.floorB;
			ctx.fillRect(0, 0, s / 2, s / 2);
			ctx.fillRect(s / 2, s / 2, s / 2, s / 2);
		}, 256);
		t.wrapS = THREE.RepeatWrapping;
		t.wrapT = THREE.RepeatWrapping;
		t.repeat.set(9, 9);
		t.anisotropy = 8;
		return t;
	}, []);
	if (!drawn) {
		return null;
	}

	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]} receiveShadow>
			<planeGeometry args={[10.8, 10.8]} />
			<meshStandardMaterial map={texture} roughness={0.7} />
		</mesh>
	);
};

/** The sunrise outside the window. It glows; it is not lit by anything. */
const Sky: React.FC = () => {
	const drawn = useDrawn();
	const texture = useMemo(
		() =>
			FlatTexture((ctx, s) => {
				const g = ctx.createLinearGradient(0, 0, 0, s);
				g.addColorStop(0, '#7FA2E8');
				g.addColorStop(0.45, '#F4C9A4');
				g.addColorStop(0.72, '#FFB36B');
				g.addColorStop(1, '#F08A5D');
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, s, s);
				// The low sun, and a line of rooftops.
				const sun = ctx.createRadialGradient(s * 0.3, s * 0.7, 0, s * 0.3, s * 0.7, s * 0.4);
				sun.addColorStop(0, 'rgba(255,250,225,1)');
				sun.addColorStop(0.18, 'rgba(255,225,160,0.85)');
				sun.addColorStop(1, 'rgba(255,200,120,0)');
				ctx.fillStyle = sun;
				ctx.fillRect(0, 0, s, s);
				ctx.fillStyle = '#5A4A78';
				const roofs = [0.86, 0.8, 0.83, 0.74, 0.8, 0.88, 0.79, 0.84];
				roofs.forEach((h, i) => {
					ctx.fillRect((i * s) / roofs.length, h * s, s / roofs.length + 1, s);
				});
			}),
		[],
	);
	if (!drawn) {
		return null;
	}

	return (
		<mesh position={[KITCHEN.window[0], 1.75, -3.7]}>
			<planeGeometry args={[4.2, 2.6]} />
			<meshBasicMaterial map={texture} toneMapped={false} />
		</mesh>
	);
};

/** A soft glow, used for the light spilling in through the window. */
const Glow: React.FC<{
	position: [number, number, number];
	size: [number, number];
	color: string;
	opacity: number;
}> = ({position, size, color, opacity}) => {
	const drawn = useDrawn();
	const texture = useMemo(
		() =>
			FlatTexture((ctx, s) => {
				const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
				g.addColorStop(0, 'rgba(255,255,255,1)');
				g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
				g.addColorStop(1, 'rgba(255,255,255,0)');
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, s, s);
			}, 256),
		[],
	);
	if (!drawn) {
		return null;
	}

	return (
		<mesh position={position} renderOrder={3}>
			<planeGeometry args={size} />
			<meshBasicMaterial
				map={texture}
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

const Chair: React.FC<{
	position: [number, number, number];
	/** Turn, in degrees. 0 = the backrest is on the +x side. */
	turn?: number;
}> = ({position, turn = 0}) => {
	const leg = (x: number, z: number, h: number) => (
		<Solid
			key={`${x}${z}`}
			size={[0.045, h, 0.045]}
			position={[x, h / 2, z]}
			color={C.woodDark}
		/>
	);
	return (
		<group position={position} rotation={[0, (turn * Math.PI) / 180, 0]}>
			<Solid size={[0.46, 0.05, 0.46]} position={[0, 0.46, 0]} color={C.wood} bevel={0.02} />
			{leg(-0.19, -0.19, 0.45)}
			{leg(-0.19, 0.19, 0.45)}
			{leg(0.19, -0.19, 1.02)}
			{leg(0.19, 0.19, 1.02)}
			<Solid size={[0.04, 0.2, 0.44]} position={[0.19, 0.9, 0]} color={C.wood} bevel={0.018} />
			<Solid size={[0.03, 0.06, 0.4]} position={[0.19, 0.68, 0]} color={C.wood} />
		</group>
	);
};

const Mug: React.FC<{position: [number, number, number]; band: string}> = ({
	position,
	band,
}) => (
	<group position={position}>
		<Solid shape="cylinder" size={[0.045, 0.1]} position={[0, 0.05, 0]} color={C.cream} roughness={0.4} />
		<Solid shape="cylinder" size={[0.0465, 0.028]} position={[0, 0.045, 0]} color={band} roughness={0.4} />
		<Solid size={[0.018, 0.06, 0.03]} position={[-0.055, 0.052, 0]} color={C.cream} bevel={0.008} />
		<Solid shape="cylinder" size={[0.038, 0.004]} position={[0, 0.099, 0]} color="#5B3A2A" cast={false} />
	</group>
);

/**
 * The beam of sunlight hanging in the air between the window and the room:
 * a few see-through sheets, soft at every edge, that glow faintly.
 */
const SunBeam: React.FC = () => {
	const drawn = useDrawn();
	const texture = useMemo(
		() =>
			FlatTexture((ctx, s) => {
				const image = ctx.createImageData(s, s);
				for (let y = 0; y < s; y++) {
					for (let x = 0; x < s; x++) {
						// Soft across the beam, bright near the window, gone by the far end.
						const across = Math.sin((Math.PI * x) / (s - 1)) ** 1.6;
						const v = y / (s - 1);
						const along = Math.min(1, v / 0.1) * (1 - v) ** 1.4;
						const i = (y * s + x) * 4;
						image.data[i] = 255;
						image.data[i + 1] = 255;
						image.data[i + 2] = 255;
						image.data[i + 3] = 255 * across * along;
					}
				}

				ctx.putImageData(image, 0, 0);
			}, 128),
		[],
	);
	const {position, quaternion, length} = useMemo(() => {
		const from = new THREE.Vector3(...KITCHEN.window);
		const dir = sunDirection();
		const len = 5.4;
		const mid = from.clone().add(dir.clone().multiplyScalar(len / 2));
		// Stand each sheet along the beam, with its face turned to the camera.
		const up = dir.clone().negate();
		const toCamera = new THREE.Vector3(0, 0.15, 1);
		const right = new THREE.Vector3().crossVectors(up, toCamera).normalize();
		const normal = new THREE.Vector3().crossVectors(right, up).normalize();
		const q = new THREE.Quaternion().setFromRotationMatrix(
			new THREE.Matrix4().makeBasis(right, up, normal),
		);
		return {position: mid, quaternion: q, length: len};
	}, []);
	if (!drawn) {
		return null;
	}

	return (
		<group position={position} quaternion={quaternion}>
			{[-0.5, -0.17, 0.17, 0.5].map((z, i) => (
				<mesh key={z} position={[(i % 2) * 0.12 - 0.06, 0, z]} renderOrder={4}>
					<planeGeometry args={[1.25 + (i % 2) * 0.3, length]} />
					<meshBasicMaterial
						map={texture}
						color="#FFC58A"
						transparent
						opacity={0.26}
						blending={THREE.AdditiveBlending}
						depthWrite={false}
						toneMapped={false}
						side={THREE.DoubleSide}
					/>
				</mesh>
			))}
		</group>
	);
};

/** Which way the sunlight travels: from the window towards his chair. */
const sunDirection = () =>
	new THREE.Vector3(KITCHEN.stickman[0] - 0.1, 0.95, KITCHEN.stickman[2])
		.sub(new THREE.Vector3(...KITCHEN.window))
		.normalize();

/** The whole kitchen. Put the characters in alongside it. */
export const KitchenSet: React.FC = () => {
	const [wx, , wz] = KITCHEN.window;
	const win = {l: wx - 0.8, r: wx + 0.8, b: 1.12, t: 2.2};
	const top = KITCHEN.tableTop;

	return (
		<>
			{/* ---------- Background: the room, slightly out of focus ---------- */}
			<Layer name="bg">
				<Floor />
				<Sky />

				{/* Back wall, built in four pieces around the window opening. */}
				<Solid size={[win.l + 5.4, ROOM_H, 0.24]} position={[(win.l - 5.4) / 2, ROOM_H / 2, wz - 0.12]} color={C.wall} bevel={0} />
				<Solid size={[5.4 - win.r, ROOM_H, 0.24]} position={[(win.r + 5.4) / 2, ROOM_H / 2, wz - 0.12]} color={C.wall} bevel={0} />
				<Solid size={[win.r - win.l, win.b, 0.24]} position={[wx, win.b / 2, wz - 0.12]} color={C.wall} bevel={0} />
				<Solid size={[win.r - win.l, ROOM_H - win.t, 0.24]} position={[wx, (ROOM_H + win.t) / 2, wz - 0.12]} color={C.wall} bevel={0} />
				{/* Side walls and ceiling. */}
				<Solid size={[0.24, ROOM_H, 10.8]} position={[-5.4, ROOM_H / 2, 1.5]} color={C.wallDark} bevel={0} />
				<Solid size={[0.24, ROOM_H, 10.8]} position={[5.4, ROOM_H / 2, 1.5]} color={C.wallDark} bevel={0} />
				<Solid size={[11, 0.2, 11]} position={[0, ROOM_H + 0.1, 1.5]} color={C.ceiling} bevel={0} />
				{/* Skirting board. */}
				<Solid size={[10.8, 0.1, 0.03]} position={[0, 0.05, wz + 0.015]} color={C.wallDark} cast={false} />

				{/* Window frame, glazing bars and sill. */}
				<Solid size={[1.74, 0.07, 0.1]} position={[wx, win.t + 0.035, wz + 0.03]} color={C.frame} />
				<Solid size={[1.74, 0.07, 0.1]} position={[wx, win.b - 0.035, wz + 0.03]} color={C.frame} />
				<Solid size={[0.07, 1.22, 0.1]} position={[win.l - 0.035, 1.66, wz + 0.03]} color={C.frame} />
				<Solid size={[0.07, 1.22, 0.1]} position={[win.r + 0.035, 1.66, wz + 0.03]} color={C.frame} />
				<Solid size={[0.04, 1.08, 0.05]} position={[wx, 1.66, wz - 0.06]} color={C.frame} />
				<Solid size={[1.6, 0.04, 0.05]} position={[wx, 1.78, wz - 0.06]} color={C.frame} />
				<Solid size={[1.9, 0.045, 0.2]} position={[wx, win.b - 0.09, wz + 0.09]} color={C.frame} />
				<Glow position={[wx, 1.7, wz + 0.2]} size={[4.4, 3.4]} color="#FFC387" opacity={0.34} />
				<SunBeam />

				{/* A plant on the sill. */}
				<Solid shape="cylinder" size={[0.07, 0.11, 0.055]} position={[wx + 0.55, win.b - 0.01, wz + 0.1]} color={C.pot} />
				{[[-0.05, 0.13, 0.3], [0.04, 0.16, -0.25], [0, 0.2, 0.05], [0.07, 0.1, 0.5]].map(([dx, dy, rz], i) => (
					<Solid
						key={i}
						shape="sphere"
						size={[0.07]}
						scale={[0.55, 1.5, 0.4]}
						rotation={[0, 0, rz]}
						position={[wx + 0.55 + dx, win.b + 0.04 + dy, wz + 0.1]}
						color={C.leaf}
					/>
				))}

				{/* Worktop run under the window, with cupboard doors. */}
				<Solid size={[4.5, 0.86, 0.62]} position={[-1.15, 0.43, wz + 0.31]} color={C.cabinet} bevel={0.01} />
				<Solid size={[4.56, 0.05, 0.66]} position={[-1.15, 0.885, wz + 0.33]} color={C.worktop} bevel={0.02} roughness={0.5} />
				<Solid size={[4.5, 0.1, 0.56]} position={[-1.15, 0.05, wz + 0.27]} color={C.cabinetDark} cast={false} />
				{[-3.05, -2.3, -1.55, -0.8, -0.05, 0.7].map((x) => (
					<React.Fragment key={x}>
						<Solid size={[0.68, 0.62, 0.025]} position={[x, 0.46, wz + 0.63]} color={C.cabinet} bevel={0.012} cast={false} />
						<Solid shape="sphere" size={[0.022]} position={[x + 0.24, 0.66, wz + 0.655]} color={C.frame} cast={false} roughness={0.4} />
					</React.Fragment>
				))}

				{/* Sink and tap, under the window. */}
				<Solid size={[0.74, 0.02, 0.44]} position={[wx, 0.912, wz + 0.33]} color={C.steel} metalness={0.5} roughness={0.35} cast={false} />
				<Solid size={[0.6, 0.02, 0.32]} position={[wx, 0.916, wz + 0.33]} color="#55627F" cast={false} />
				<Solid shape="cylinder" size={[0.018, 0.3]} position={[wx, 1.06, wz + 0.12]} color={C.steel} metalness={0.6} roughness={0.3} />
				<Solid size={[0.03, 0.03, 0.2]} position={[wx, 1.2, wz + 0.2]} color={C.steel} metalness={0.6} roughness={0.3} bevel={0.012} />
				{/* Washing-up: a rack of plates and a bottle. */}
				{[0, 1, 2, 3].map((i) => (
					<Solid
						key={i}
						shape="cylinder"
						size={[0.11, 0.012]}
						rotation={[Math.PI / 2 - 0.25, 0, 0]}
						position={[wx - 0.72, 1.02, wz + 0.2 + i * 0.07]}
						color={C.cream}
						roughness={0.4}
					/>
				))}
				<Solid size={[0.3, 0.03, 0.36]} position={[wx - 0.72, 0.925, wz + 0.32]} color={C.steel} metalness={0.4} />
				<Solid shape="cylinder" size={[0.035, 0.17]} position={[wx + 0.52, 0.995, wz + 0.2]} color={C.teal} roughness={0.4} />
				<Solid shape="cylinder" size={[0.014, 0.05]} position={[wx + 0.52, 1.1, wz + 0.2]} color={C.frame} />

				{/* Hob and the red kettle. */}
				<Solid size={[0.62, 0.015, 0.46]} position={[0.45, 0.917, wz + 0.33]} color="#232B4D" cast={false} roughness={0.3} />
				<Solid shape="sphere" size={[0.12]} scale={[1, 0.82, 1]} position={[0.32, 1.01, wz + 0.36]} color={C.red} roughness={0.35} />
				<Solid shape="cylinder" size={[0.03, 0.03]} position={[0.32, 1.115, wz + 0.36]} color="#1C2244" />
				<Solid shape="cylinder" size={[0.014, 0.13, 0.022]} rotation={[0, 0, -0.9]} position={[0.46, 1.04, wz + 0.36]} color={C.red} roughness={0.35} />
				<Solid size={[0.2, 0.022, 0.03]} position={[0.3, 1.17, wz + 0.36]} color="#1C2244" bevel={0.01} />
				<Solid size={[0.022, 0.08, 0.03]} position={[0.21, 1.135, wz + 0.36]} color="#1C2244" />

				{/* Wall cupboards and a shelf of jars. */}
				<Solid size={[1.46, 0.86, 0.36]} position={[0.42, 1.93, wz + 0.18]} color={C.cabinet} bevel={0.012} />
				{[0.06, 0.78].map((x) => (
					<React.Fragment key={x}>
						<Solid size={[0.68, 0.78, 0.025]} position={[x, 1.93, wz + 0.37]} color={C.cabinet} bevel={0.012} cast={false} />
						<Solid shape="sphere" size={[0.022]} position={[x + (x < 0.4 ? 0.26 : -0.26), 1.64, wz + 0.395]} color={C.frame} cast={false} />
					</React.Fragment>
				))}
				<Solid size={[1.1, 0.04, 0.24]} position={[-2.95, 1.62, wz + 0.12]} color={C.wood} />
				{[
					[-3.35, 0.2, C.frame],
					[-3.1, 0.26, C.pot],
					[-2.85, 0.16, C.teal],
					[-2.6, 0.22, C.frame],
				].map(([x, h, col]) => (
					<Solid
						key={x as number}
						shape="cylinder"
						size={[0.06, h as number]}
						position={[x as number, 1.64 + (h as number) / 2, wz + 0.12]}
						color={col as string}
						roughness={0.4}
					/>
				))}

				{/* Fridge, with a few notes stuck to it. */}
				<Solid size={[0.86, 1.95, 0.72]} position={[1.98, 0.975, wz + 0.37]} color={C.fridge} bevel={0.035} roughness={0.45} />
				<Solid size={[0.84, 0.012, 0.02]} position={[1.98, 1.3, wz + 0.735]} color="#8E9AB5" cast={false} />
				<Solid size={[0.03, 0.34, 0.035]} position={[1.63, 1.55, wz + 0.75]} color={C.steel} metalness={0.5} bevel={0.012} />
				<Solid size={[0.03, 0.5, 0.035]} position={[1.63, 0.95, wz + 0.75]} color={C.steel} metalness={0.5} bevel={0.012} />
				{[
					[2.02, 1.62, C.cream, 0.08],
					[2.2, 1.5, C.red, -0.12],
					[2.05, 1.42, C.teal, 0.05],
				].map(([x, y, col, rot]) => (
					<Solid
						key={`${x}${y}`}
						size={[0.12, 0.12, 0.006]}
						rotation={[0, 0, rot as number]}
						position={[x as number, y as number, wz + 0.735]}
						color={col as string}
						cast={false}
					/>
				))}

				{/* A rug under the table. */}
				<Solid size={[3.1, 0.012, 2.1]} position={[0.35, 0.006, -0.15]} color={C.rug} bevel={0.005} cast={false} roughness={1} />
			</Layer>

			{/* ---------- Middle: the table, where the story happens ---------- */}
			<Layer name="mid">
				<Solid size={[1.7, 0.055, 0.95]} position={[0.35, top - 0.0275, -0.15]} color={C.wood} bevel={0.02} roughness={0.6} />
				<Solid size={[1.5, 0.08, 0.03]} position={[0.35, top - 0.095, 0.27]} color={C.woodDark} />
				<Solid size={[1.5, 0.08, 0.03]} position={[0.35, top - 0.095, -0.57]} color={C.woodDark} />
				{[
					[-0.42, -0.55],
					[-0.42, 0.25],
					[1.12, -0.55],
					[1.12, 0.25],
				].map(([x, z]) => (
					<Solid key={`${x}${z}`} size={[0.07, top - 0.05, 0.07]} position={[x, (top - 0.05) / 2, z]} color={C.woodDark} />
				))}

				{/* His chair, and the empty one opposite. */}
				<Chair position={[1.5, 0, -0.15]} />
				<Chair position={[-0.82, 0, -0.15]} turn={180} />

				{/* Breakfast. */}
				<Mug position={[0.82, top, 0.02]} band={C.teal} />
				<Mug position={[-0.08, top, -0.3]} band={C.red} />
				<Solid shape="cylinder" size={[0.13, 0.014, 0.1]} position={[0.62, top + 0.007, -0.3]} color={C.cream} roughness={0.4} />
				<Solid size={[0.13, 0.022, 0.12]} rotation={[0, 0.4, 0]} position={[0.62, top + 0.026, -0.3]} color="#D9A066" bevel={0.01} />
				<Solid size={[0.2, 0.28, 0.07]} rotation={[0, -0.5, 0]} position={[0.18, top + 0.14, -0.42]} color={C.teal} bevel={0.006} roughness={0.6} />
				<Solid size={[0.14, 0.09, 0.004]} rotation={[0, -0.5, 0]} position={[0.196, top + 0.17, -0.388]} color={C.cream} cast={false} />
				<Solid shape="cylinder" size={[0.035, 0.12, 0.05]} position={[0.3, top + 0.06, -0.02]} color={C.frame} roughness={0.35} />
				<Solid shape="cylinder" size={[0.005, 0.2]} position={[0.3, top + 0.2, -0.02]} color={C.leaf} />
				<Solid shape="sphere" size={[0.04]} position={[0.3, top + 0.31, -0.02]} color={C.red} roughness={0.5} />

				{/* The lamp over the table. Switched off: it is morning. */}
				<Solid shape="cylinder" size={[0.006, 1.8]} position={[0.35, 2.9, -0.15]} color="#1C2244" cast={false} />
				<Solid shape="cone" size={[0.24, 0.2]} position={[0.35, 1.95, -0.15]} color={C.frame} roughness={0.5} />
			</Layer>

			{/* ---------- Foreground: close to the lens, out of focus ---------- */}
			<Layer name="fg">
				{/* The edge of the doorway we are looking through. */}
				<Solid size={[0.5, 3.4, 0.2]} position={[-1.48, 1.7, 3.3]} color="#232C55" bevel={0.02} />
				{/* A plant by the door. */}
				<Solid shape="cylinder" size={[0.2, 0.34, 0.15]} position={[PLANT_X, 0.17, 1.9]} color={C.pot} />
				{[
					[-0.16, 0.62, 0.5],
					[0.14, 0.7, -0.45],
					[0, 0.86, 0.1],
					[-0.26, 0.5, 0.9],
					[0.27, 0.52, -0.85],
					[0.08, 0.55, 0.3],
				].map(([dx, dy, rz], i) => (
					<Solid
						key={i}
						shape="sphere"
						size={[0.2]}
						scale={[0.42, 1.5, 0.3]}
						rotation={[0, 0, rz]}
						position={[PLANT_X + dx, 0.3 + dy, 1.9]}
						color={C.leaf}
					/>
				))}
			</Layer>
		</>
	);
};

/** The kitchen's lighting: cool room, low warm sun through the window. */
export const KitchenLights: React.FC<{sun?: number}> = ({sun = 1}) => {
	const [wx, wy, wz] = KITCHEN.window;
	const pass = usePass();
	// Things close to the lens sit in the dark doorway, out of the sun.
	const sunOn = pass === 'fg' ? 0 : 1;
	// The sun shines from outside the window towards the stickman's chair.
	const aim = new THREE.Vector3(KITCHEN.stickman[0] - 0.1, 0.95, KITCHEN.stickman[2]);
	const from = new THREE.Vector3(wx, wy, wz);
	const dir = aim.clone().sub(from);
	const lightPos = from.clone().sub(dir.clone().multiplyScalar(1.6));
	// The light points at this invisible marker.
	const target = useMemo(() => new THREE.Object3D(), []);

	return (
		<>
			<hemisphereLight args={['#CFD6FF', '#B48A72', 1.05]} />
			{/* Sunlight bouncing around the room from the window. */}
			<pointLight position={[wx + 0.2, 1.7, wz + 1.1]} color="#FFC48E" intensity={9} distance={7} decay={1.6} />
			<primitive object={target} position={[aim.x, aim.y, aim.z]} />
			<directionalLight
				position={[lightPos.x, lightPos.y, lightPos.z]}
				target={target}
				color="#FFB978"
				intensity={15 * sun * sunOn}
				castShadow={pass !== 'fg'}
				shadow-mapSize-width={pass === 'mid' ? 1536 : 768}
				shadow-mapSize-height={pass === 'mid' ? 1536 : 768}
				shadow-bias={-0.0006}
				shadow-normalBias={0.02}
				shadow-radius={5}
			>
				<orthographicCamera attach="shadow-camera" args={[-6, 6, 5, -5, 0.5, 24]} />
			</directionalLight>
			{/* A weak cool light from the hallway, so nothing goes fully black. */}
			<directionalLight position={[-2, 3, 6]} color="#8EA6FF" intensity={0.55} />
		</>
	);
};
