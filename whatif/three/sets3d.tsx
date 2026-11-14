import React from 'react';
import {Glow, T} from './toon';

// 3D sets for the new channel, built from cel-shaded shapes. Units are metres;
// people are about 1.7 tall. The floor is y = 0. Rooms open towards +z (the camera).

type V3 = [number, number, number];

export const Box: React.FC<{size: V3; at: V3; color: string; outline?: number; rot?: V3}> = ({size, at, color, outline = 0.02, rot}) => (
	<T shape={{kind: 'box', w: size[0], h: size[1], d: size[2]}} color={color} position={at} rotation={rot} outline={outline} />
);

// ---------------------------------------------------------------- rooms

export type RoomLook = {wall: string; floor: string; trim: string; ceiling?: string};

export const ROOM3 = {
	bedroom: {wall: '#4B3AA8', floor: '#6A4A7A', trim: '#8F7AE8'},
	kitchen: {wall: '#3FA89C', floor: '#E8D8C0', trim: '#F2F2F2'},
	classroom: {wall: '#F2C66E', floor: '#A8765A', trim: '#FFF3D6'},
	lunch: {wall: '#F2A65A', floor: '#C9CED8', trim: '#FFF3D6'},
	studio: {wall: '#1E1650', floor: '#2A2160', trim: '#7F5AF0'},
	police: {wall: '#8FA3B8', floor: '#5A6070', trim: '#C9D2DC'},
	lab: {wall: '#DCE8F2', floor: '#AEB8C8', trim: '#FFFFFF'},
	music: {wall: '#7A4A8A', floor: '#8A5A3E', trim: '#B88AD0'},
	bus: {wall: '#E8E4F0', floor: '#55597A', trim: '#3FB7E8'},
} satisfies Record<string, RoomLook>;

/** A room: floor, back wall, two side walls cut away towards the camera, skirting, a window, a ceiling light. */
export const Room3: React.FC<{look: RoomLook; w?: number; d?: number; h?: number; window?: {x: number; w?: number; night?: boolean}; children?: React.ReactNode}> = ({look, w = 12, d = 9, h = 4, window, children}) => (
	<group>
		<Box size={[w, 0.1, d]} at={[0, -0.05, 0]} color={look.floor} outline={0} />
		{[...Array(Math.floor(w / 1.2))].map((_, i) => (
			<Box key={i} size={[0.02, 0.012, d]} at={[-w / 2 + 0.6 + i * 1.2, 0.006, 0]} color="#000000" outline={0} />
		))}
		<Box size={[w, h, 0.2]} at={[0, h / 2, -d / 2]} color={look.wall} outline={0} />
		<Box size={[0.2, h, d]} at={[-w / 2, h / 2, 0]} color={look.wall} outline={0} />
		<Box size={[0.2, h, d]} at={[w / 2, h / 2, 0]} color={look.wall} outline={0} />
		<Box size={[w, 0.16, 0.06]} at={[0, 0.08, -d / 2 + 0.12]} color={look.trim} outline={0.01} />
		<Box size={[w, 0.08, 0.04]} at={[0, h - 0.4, -d / 2 + 0.12]} color={look.trim} outline={0} />
		{window ? (
			<group position={[window.x, 1.9, -d / 2 + 0.12]}>
				<Box size={[(window.w ?? 1.8) + 0.2, 1.7, 0.08]} at={[0, 0, 0]} color={look.trim} />
				<Glow shape={{kind: 'box', w: window.w ?? 1.8, h: 1.5, d: 0.02}} color={window.night ? '#2A2470' : '#BFE3FA'} position={[0, 0, 0.05]} />
				<Box size={[0.06, 1.5, 0.06]} at={[0, 0, 0.07]} color={look.trim} outline={0} />
				<Box size={[window.w ?? 1.8, 0.06, 0.06]} at={[0, 0.1, 0.07]} color={look.trim} outline={0} />
			</group>
		) : null}
		<group position={[0, h - 0.05, 0]}>
			<T shape={{kind: 'cyl', r: 0.4, r2: 0.15, h: 0.25}} color="#F2F2F2" position={[0, -0.3, 0]} outline={0.01} />
			<Glow shape={{kind: 'cyl', r: 0.36, h: 0.02}} color="#FFF3C4" position={[0, -0.43, 0]} />
		</group>
		{children}
	</group>
);

export const Desk3: React.FC<{at: V3; w?: number; d?: number; h?: number; color?: string; rot?: number}> = ({at, w = 1.4, d = 0.7, h = 0.75, color = '#9A6A48', rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<Box size={[w, 0.06, d]} at={[0, h, 0]} color={color} />
		{[-1, 1].map((sx) =>
			[-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.06, h, 0.06]} at={[sx * (w / 2 - 0.06), h / 2, sz * (d / 2 - 0.06)]} color={color} outline={0.01} />),
		)}
	</group>
);

export const Chair3: React.FC<{at: V3; rot?: number; color?: string}> = ({at, rot = 0, color = '#3FB7E8'}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<Box size={[0.48, 0.06, 0.46]} at={[0, 0.46, 0]} color={color} />
		<Box size={[0.48, 0.5, 0.06]} at={[0, 0.74, -0.21]} color={color} />
		{[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.04, 0.46, 0.04]} at={[sx * 0.2, 0.23, sz * 0.18]} color="#2A2350" outline={0.008} />))}
	</group>
);

export const Shelf3: React.FC<{at: V3; w?: number}> = ({at, w = 1.6}) => {
	const colours = ['#E8453C', '#3FB7E8', '#FFD84A', '#7CF2A0', '#C9A6FF', '#FF8A3D'];
	return (
		<group position={at}>
			<Box size={[w, 0.05, 0.3]} at={[0, 0, 0]} color="#8A5A3E" />
			{[...Array(Math.floor(w / 0.16))].map((_, i) => (
				<Box key={i} size={[0.12, 0.28 + (i % 3) * 0.05, 0.22]} at={[-w / 2 + 0.1 + i * 0.16, 0.17 + (i % 3) * 0.025, 0]} color={colours[i % colours.length]} outline={0.008} />
			))}
		</group>
	);
};

export const Plant3: React.FC<{at: V3; s?: number}> = ({at, s = 1}) => (
	<group position={at} scale={[s, s, s]}>
		<T shape={{kind: 'cyl', r: 0.22, r2: 0.28, h: 0.4}} color="#D9644A" position={[0, 0.2, 0]} />
		{[0, 1, 2, 3, 4].map((i) => (
			<T key={i} shape={{kind: 'sphere', r: 0.22}} color={i % 2 ? '#2EA86A' : '#3FC07C'} position={[Math.cos(i * 1.3) * 0.18, 0.62 + (i % 2) * 0.18, Math.sin(i * 1.3) * 0.18]} scale={[1, 1.4, 1]} />
		))}
	</group>
);

export const Poster3: React.FC<{at: V3; w?: number; h?: number; color: string; accent: string}> = ({at, w = 0.8, h = 1.1, color, accent}) => (
	<group position={at}>
		<Box size={[w, h, 0.02]} at={[0, 0, 0]} color={color} outline={0.01} />
		<Glow shape={{kind: 'cyl', r: Math.min(w, h) * 0.25, h: 0.01}} color={accent} position={[0, h * 0.08, 0.02]} rotation={[Math.PI / 2, 0, 0]} />
	</group>
);

export const Bed3: React.FC<{at: V3; rot?: number}> = ({at, rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<Box size={[1.2, 0.35, 2.1]} at={[0, 0.25, 0]} color="#6A4A8A" />
		<Box size={[1.1, 0.18, 2.0]} at={[0, 0.5, 0]} color="#F2EEFF" />
		<Box size={[1.12, 0.12, 1.4]} at={[0, 0.62, 0.3]} color="#FF8A3D" />
		<Box size={[0.7, 0.14, 0.4]} at={[0, 0.66, -0.75]} color="#ffffff" />
		<Box size={[1.2, 0.9, 0.1]} at={[0, 0.65, -1.05]} color="#6A4A8A" />
	</group>
);

export const Door3: React.FC<{at: V3; open?: number; color?: string}> = ({at, open = 0, color = '#C98A5A'}) => (
	<group position={at}>
		<Box size={[1.1, 2.2, 0.08]} at={[0, 1.1, -0.02]} color="#2A2350" outline={0} />
		<group position={[-0.5, 0, 0]} rotation={[0, -open * 1.2, 0]}>
			<Box size={[1.0, 2.1, 0.06]} at={[0.5, 1.05, 0.03]} color={color} />
			<T shape={{kind: 'sphere', r: 0.04}} color="#FFD84A" position={[0.88, 1.05, 0.08]} outline={0.005} />
		</group>
	</group>
);

export const Board3: React.FC<{at: V3; w?: number}> = ({at, w = 3.4}) => (
	<group position={at}>
		<Box size={[w + 0.12, 1.42, 0.06]} at={[0, 0, 0]} color="#C9A06A" />
		<Box size={[w, 1.3, 0.04]} at={[0, 0, 0.03]} color="#2E5A4A" outline={0} />
	</group>
);

export const Clock3: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.28, h: 0.05}} color="#ffffff" rotation={[Math.PI / 2, 0, 0]} />
		<Box size={[0.03, 0.2, 0.02]} at={[0, 0.08, 0.04]} color="#140A28" outline={0} />
		<Box size={[0.14, 0.03, 0.02]} at={[0.06, 0, 0.04]} color="#140A28" outline={0} />
	</group>
);

export const Lamp3: React.FC<{at: V3; color?: string}> = ({at, color = '#FFE7A8'}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.03, h: 1.5}} color="#2A2350" position={[0, 0.75, 0]} outline={0.008} />
		<T shape={{kind: 'cyl', r: 0.12, r2: 0.28, h: 0.32}} color={color} position={[0, 1.55, 0]} emissive={color} emissiveIntensity={0.6} />
	</group>
);

export const Screen3: React.FC<{at: V3; w?: number; h?: number; color?: string; rot?: number}> = ({at, w = 1.2, h = 0.7, color = '#7F5AF0', rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<Box size={[w + 0.1, h + 0.1, 0.06]} at={[0, 0, 0]} color="#120C30" />
		<Glow shape={{kind: 'box', w, h, d: 0.01}} color={color} position={[0, 0, 0.035]} />
	</group>
);

export const Table3: React.FC<{at: V3; r?: number; color?: string}> = ({at, r = 0.8, color = '#2EA86A'}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r, h: 0.06}} color={color} position={[0, 0.74, 0]} />
		<T shape={{kind: 'cyl', r: 0.06, h: 0.72}} color="#2A2350" position={[0, 0.36, 0]} outline={0.01} />
		<T shape={{kind: 'cyl', r: 0.35, h: 0.04}} color="#2A2350" position={[0, 0.02, 0]} outline={0.01} />
	</group>
);

export const Counter3: React.FC<{at: V3; w?: number; color?: string}> = ({at, w = 4, color = '#3FB7E8'}) => (
	<group position={at}>
		<Box size={[w, 0.9, 0.65]} at={[0, 0.45, 0]} color={color} />
		<Box size={[w + 0.06, 0.06, 0.7]} at={[0, 0.93, 0]} color="#F2EEE6" />
		{[...Array(Math.floor(w / 0.8))].map((_, i) => (
			<Box key={i} size={[0.2, 0.03, 0.02]} at={[-w / 2 + 0.4 + i * 0.8, 0.7, 0.34]} color="#140A28" outline={0} />
		))}
	</group>
);

// ---------------------------------------------------------------- outdoors

/** A row of buildings with lit windows, along z = `z`, facing +z. */
export const Buildings3: React.FC<{z: number; night?: boolean; from?: number; to?: number; seed?: number}> = ({z, night = false, from = -14, to = 14, seed = 0}) => {
	const out = [];
	let x = from;
	let i = 0;
	while (x < to) {
		const w = 2.2 + ((i * 37 + seed) % 10) / 10;
		const h = 5 + ((i * 53 + seed * 7) % 50) / 10;
		const wall = night ? (i % 2 ? '#2E2470' : '#3A2E80') : i % 2 ? '#C98A6A' : '#B8775A';
		out.push(
			<group key={i} position={[x + w / 2, 0, z]}>
				<Box size={[w, h, 2]} at={[0, h / 2, 0]} color={wall} />
				{[...Array(Math.floor((h - 1) / 1.1))].map((_, r) =>
					[0, 1].map((c) => {
						const lit = night ? (r + c + i) % 3 !== 0 : true;
						return <Glow key={`${r}${c}`} shape={{kind: 'box', w: 0.55, h: 0.6, d: 0.02}} color={lit ? (night ? '#FFD98A' : '#CFE6F5') : '#2A2350'} position={[-w / 4 + c * (w / 2), 1.6 + r * 1.1, 1.02]} />;
					}),
				)}
			</group>,
		);
		x += w + 0.1;
		i++;
	}
	return <group>{out}</group>;
};

export const StreetLamp3: React.FC<{at: V3; on?: boolean}> = ({at, on = true}) => (
	<group position={at}>
		<T shape={{kind: 'cyl', r: 0.06, h: 4}} color="#2A2350" position={[0, 2, 0]} outline={0.01} />
		<T shape={{kind: 'box', w: 0.6, h: 0.08, d: 0.08}} color="#2A2350" position={[0.25, 4, 0]} outline={0.01} />
		<Glow shape={{kind: 'sphere', r: 0.16}} color={on ? '#FFE7A8' : '#8F8AA8'} position={[0.5, 3.88, 0]} />
	</group>
);

export const Street3: React.FC<{night?: boolean; children?: React.ReactNode}> = ({night = false, children}) => (
	<group>
		<Box size={[40, 0.1, 30]} at={[0, -0.06, 0]} color={night ? '#1C1640' : '#55597A'} outline={0} />
		<Box size={[40, 0.18, 4]} at={[0, 0.0, -5]} color={night ? '#3A3368' : '#B9BCD6'} outline={0} />
		{[...Array(10)].map((_, i) => (
			<Box key={i} size={[1.4, 0.012, 0.15]} at={[-18 + i * 4, 0.0, 1]} color={night ? '#8F86C8' : '#F2F2F2'} outline={0} />
		))}
		<Buildings3 z={-8} night={night} />
		<Buildings3 z={-14} night={night} seed={5} from={-20} to={20} />
		{[-9, -3, 3, 9].map((x) => (
			<StreetLamp3 key={x} at={[x, 0, -3.6]} on={night} />
		))}
		{children}
	</group>
);

/** The school: a long building with windows and a gate. */
export const School3: React.FC = () => (
	<group>
		<Box size={[40, 0.1, 30]} at={[0, -0.06, 0]} color="#9AA0B8" outline={0} />
		<Box size={[22, 7, 3]} at={[0, 3.5, -9]} color="#C98A6A" />
		{[...Array(9)].map((_, i) =>
			[0, 1].map((r) => <Glow key={`${i}${r}`} shape={{kind: 'box', w: 1.4, h: 1.6, d: 0.02}} color="#CFE6F5" position={[-9.6 + i * 2.4, 2.2 + r * 2.8, -7.48]} />),
		)}
		<Box size={[4, 0.6, 0.2]} at={[0, 6.2, -7.4]} color="#2EA86A" />
		{[-6, 6].map((x) => (
			<Box key={x} size={[0.4, 2.6, 0.4]} at={[x, 1.3, -4]} color="#2A2350" />
		))}
		{[...Array(26)].map((_, i) => (
			<Box key={i} size={[0.06, 2, 0.06]} at={[-6 + i * 0.48, 1, -4]} color="#2A2350" outline={0} />
		))}
	</group>
);

/** The summer fair: tents, a ferris wheel, a ghost train, string lights. */
export const Fair3: React.FC<{frame: number}> = ({frame}) => (
	<group>
		<Box size={[60, 0.1, 40]} at={[0, -0.06, 0]} color="#4FB070" outline={0} />
		{/* ferris wheel */}
		<group position={[-6, 6.5, -14]} rotation={[0, 0, frame * 0.004]}>
			<T shape={{kind: 'torus', r: 5.5, tube: 0.12}} color="#FF4FD8" />
			{[...Array(12)].map((_, i) => (
				<group key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]}>
					<Box size={[0.08, 5.5, 0.08]} at={[0, 2.75, 0]} color="#2A2350" outline={0} />
					<T shape={{kind: 'box', w: 0.8, h: 0.7, d: 0.7}} color={['#FFD84A', '#3FB7E8', '#E8453C', '#7CF2A0'][i % 4]} position={[0, 5.5, 0]} rotation={[0, 0, -(i / 12) * Math.PI * 2 - frame * 0.004]} />
				</group>
			))}
		</group>
		<T shape={{kind: 'cone', r: 1.2, h: 7}} color="#2A2350" position={[-6, 3.2, -14.4]} outline={0.02} />
		{/* tents */}
		{[[4, -9, '#E8453C'], [8, -11, '#3FB7E8'], [-1, -8, '#FFD84A'], [12, -8, '#7F5AF0'], [-12, -9, '#2EA86A']].map(([x, z, c], i) => (
			<group key={i} position={[x as number, 0, z as number]}>
				<T shape={{kind: 'cyl', r: 1.6, h: 2.2, seg: 10}} color="#F2EEE6" position={[0, 1.1, 0]} />
				<T shape={{kind: 'cone', r: 1.9, h: 1.6}} color={c as string} position={[0, 3, 0]} />
			</group>
		))}
		{/* ghost train */}
		<group position={[13, 0, -4]}>
			<Box size={[5, 3.2, 3]} at={[0, 1.6, 0]} color="#2A2350" />
			<Box size={[5.2, 0.8, 0.2]} at={[0, 3.3, 1.5]} color="#7CF2A0" />
			<Glow shape={{kind: 'box', w: 1.6, h: 2, d: 0.02}} color="#120C30" position={[0, 1, 1.52]} />
		</group>
		{/* generator, behind the ghost train */}
		<group position={[10.2, 0, -1.6]}>
			<Box size={[1.4, 1.1, 0.9]} at={[0, 0.55, 0]} color="#FFD84A" />
			<Box size={[1.42, 0.12, 0.92]} at={[0, 1.1, 0]} color="#2A2350" />
		</group>
		{/* string lights */}
		{[...Array(30)].map((_, i) => (
			<Glow key={i} shape={{kind: 'sphere', r: 0.08}} color={['#FFD84A', '#FF4FD8', '#7FE0FF', '#7CF2A0'][i % 4]} position={[-14 + i, 4 - Math.sin((i % 10) / 10 * Math.PI) * 0.8, -5]} />
		))}
	</group>
);

/** The football pitch with one goal. */
export const Pitch3: React.FC = () => (
	<group>
		<Box size={[60, 0.1, 40]} at={[0, -0.06, 0]} color="#4FB070" outline={0} />
		{[...Array(8)].map((_, i) => (
			<Box key={i} size={[60, 0.012, 2]} at={[0, 0.005, -18 + i * 5]} color="#5BC07C" outline={0} />
		))}
		<group position={[0, 0, -4]}>
			{[-3.66, 3.66].map((x) => (
				<T key={x} shape={{kind: 'cyl', r: 0.07, h: 2.44}} color="#ffffff" position={[x, 1.22, 0]} outline={0.01} />
			))}
			<T shape={{kind: 'cyl', r: 0.07, h: 7.32}} color="#ffffff" position={[0, 2.44, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />
			<Box size={[7.32, 2.44, 0.02]} at={[0, 1.22, -1.2]} color="#E8EEF6" outline={0} />
		</group>
	</group>
);
