import React from 'react';
import {Glow, T} from './toon';

type V3 = [number, number, number];

/** A friendly dog, side-on facing +x. `wag` and `walk` animate it. */
export const Dog3D: React.FC<{at: V3; rot?: number; frame: number; walk?: number}> = ({at, rot = 0, frame, walk}) => {
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2) * 0.5;
	const wag = Math.sin(frame * 0.6) * 0.5;
	const fur = '#C98A4E';
	return (
		<group position={at} rotation={[0, rot, 0]}>
			<T shape={{kind: 'capsule', r: 0.2, len: 0.45}} color={fur} position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} />
			{[
				[0.25, 0.12, w],
				[0.25, -0.12, -w],
				[-0.25, 0.12, -w],
				[-0.25, -0.12, w],
			].map(([x, z, s], i) => (
				<T key={i} shape={{kind: 'capsule', r: 0.06, len: 0.25}} color={i % 2 ? '#A86A34' : fur} position={[x, 0.2, z]} rotation={[0, 0, s]} outline={0.012} />
			))}
			<group position={[0.45, 0.72, 0]} rotation={[0, 0, Math.sin(frame * 0.07) * 0.1]}>
				<T shape={{kind: 'sphere', r: 0.22}} color={fur} />
				<T shape={{kind: 'sphere', r: 0.12}} color="#F2D2A6" position={[0.18, -0.05, 0]} scale={[1.3, 0.9, 1]} />
				<T shape={{kind: 'sphere', r: 0.05}} color="#140A28" position={[0.33, -0.02, 0]} outline={0} />
				{[-0.1, 0.1].map((z) => (
					<T key={z} shape={{kind: 'sphere', r: 0.035}} color="#140A28" position={[0.14, 0.08, z]} outline={0} />
				))}
				{[-0.15, 0.15].map((z) => (
					<T key={z} shape={{kind: 'capsule', r: 0.06, len: 0.14}} color="#A86A34" position={[-0.05, 0.05, z]} rotation={[0.2 * Math.sign(z), 0, 0.3]} outline={0.01} />
				))}
			</group>
			<T shape={{kind: 'capsule', r: 0.04, len: 0.3}} color={fur} position={[-0.45, 0.68, 0]} rotation={[wag, 0, 0.9]} outline={0.01} />
			<T shape={{kind: 'torus', r: 0.13, tube: 0.03}} color="#E8453C" position={[0.32, 0.62, 0]} rotation={[0, Math.PI / 2, 0.5]} outline={0} />
		</group>
	);
};

/** An MRI scanner: a big ring with a sliding bed. */
export const Mri3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'box', w: 2.6, h: 2.6, d: 1.4}} color="#E8EEF6" position={[0, 1.3, 0]} />
		<mesh position={[0, 1.2, 0.72]}>
			<circleGeometry args={[0.75, 48]} />
			<meshBasicMaterial color="#2A2350" />
		</mesh>
		<T shape={{kind: 'torus', r: 0.8, tube: 0.08}} color="#7F5AF0" position={[0, 1.2, 0.72]} />
		<T shape={{kind: 'box', w: 0.8, h: 0.15, d: 2.6}} color="#C9CED8" position={[0, 0.85, 1.8]} />
		<T shape={{kind: 'box', w: 0.6, h: 0.7, d: 0.6}} color="#AEB8C8" position={[0, 0.4, 2.6]} />
	</group>
);

/** A bike, side-on along x. */
export const Bike3D: React.FC<{at: V3; rot?: number; color?: string}> = ({at, rot = 0, color = '#E8453C'}) => (
	<group position={at} rotation={[0, rot, 0]}>
		{[-0.55, 0.55].map((x) => (
			<T key={x} shape={{kind: 'torus', r: 0.34, tube: 0.04}} color="#2A2350" position={[x, 0.36, 0]} outline={0.01} />
		))}
		<T shape={{kind: 'cyl', r: 0.04, h: 1.1}} color={color} position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />
		<T shape={{kind: 'cyl', r: 0.04, h: 0.6}} color={color} position={[-0.25, 0.48, 0]} rotation={[0, 0, 0.9]} outline={0.01} />
		<T shape={{kind: 'cyl', r: 0.04, h: 0.6}} color={color} position={[0.25, 0.48, 0]} rotation={[0, 0, -0.9]} outline={0.01} />
		<T shape={{kind: 'box', w: 0.3, h: 0.06, d: 0.12}} color="#140A28" position={[-0.25, 0.84, 0]} outline={0} />
		<T shape={{kind: 'cyl', r: 0.03, h: 0.5}} color="#2A2350" position={[0.5, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.008} />
	</group>
);

/** A glowing brain made of soft lobes, with sparks of activity. */
export const Brain3D: React.FC<{at: V3; frame: number; s?: number}> = ({at, frame, s = 1}) => (
	<group position={at} scale={[s, s, s]} rotation={[0, frame * 0.01, 0]}>
		{[...Array(14)].map((_, i) => {
			const a = (i / 14) * Math.PI * 2;
			const y = Math.sin(i * 1.7) * 0.25;
			return <T key={i} shape={{kind: 'sphere', r: 0.38}} color="#FFB0C8" position={[Math.cos(a) * 0.55, y, Math.sin(a) * 0.4]} scale={[1, 0.8, 1]} outline={0.015} />;
		})}
		<T shape={{kind: 'sphere', r: 0.7}} color="#FF9ABA" scale={[1.2, 0.85, 1]} />
		{[...Array(26)].map((_, i) => {
			const t = ((frame * 0.03 + i * 0.37) % 1) * Math.PI * 2;
			const r = 0.95;
			return <Glow key={`s${i}`} shape={{kind: 'sphere', r: 0.04}} color={i % 3 ? '#7FE0FF' : '#FFD84A'} position={[Math.cos(t + i) * r, Math.sin(t * 1.3 + i) * 0.55, Math.sin(t + i) * r * 0.8]} />;
		})}
	</group>
);

/** A bunch of balloons on strings. */
export const Balloons3D: React.FC<{at: V3; frame: number}> = ({at, frame}) => (
	<group position={at}>
		{['#E8453C', '#FFD84A', '#3FB7E8', '#7CF2A0'].map((c, i) => (
			<group key={c} position={[(i - 1.5) * 0.35, 2 + (i % 2) * 0.3 + Math.sin(frame * 0.05 + i) * 0.05, 0]}>
				<T shape={{kind: 'sphere', r: 0.25}} color={c} scale={[1, 1.2, 1]} />
				<T shape={{kind: 'cyl', r: 0.006, h: 1.4}} color="#ffffff" position={[0, -0.95, 0]} outline={0} />
			</group>
		))}
	</group>
);

/** A shop card reader on a counter. */
export const CardReader3D: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'box', w: 0.18, h: 0.3, d: 0.06}} color="#2A2350" position={[0, 0.15, 0]} rotation={[-0.3, 0, 0]} />
		<Glow shape={{kind: 'box', w: 0.14, h: 0.08, d: 0.01}} color="#7CF2A0" position={[0, 0.22, 0.04]} />
	</group>
);

/** A gift box with a bow; `open` lifts the lid. */
export const Gift3D: React.FC<{at: V3; open?: number}> = ({at, open = 0}) => (
	<group position={at}>
		<T shape={{kind: 'box', w: 0.5, h: 0.4, d: 0.5}} color="#3FB7E8" position={[0, 0.2, 0]} />
		<group position={[0, 0.42 + open * 0.5, 0]} rotation={[open * 0.8, 0, 0]}>
			<T shape={{kind: 'box', w: 0.56, h: 0.08, d: 0.56}} color="#2EA0D8" />
			<T shape={{kind: 'torus', r: 0.08, tube: 0.03}} color="#FFD84A" position={[0, 0.1, 0]} outline={0.01} />
		</group>
	</group>
);

/** A poker table's pile of crisp packets. `n` packets. */
export const Crisps3D: React.FC<{at: V3; n: number}> = ({at, n}) => (
	<group position={at}>
		{[...Array(n)].map((_, i) => (
			<T key={i} shape={{kind: 'box', w: 0.22, h: 0.06, d: 0.3}} color={['#E8453C', '#FFD84A', '#3FB7E8', '#7CF2A0'][i % 4]} position={[((i * 37) % 5) * 0.12 - 0.25, 0.04 + Math.floor(i / 5) * 0.06, ((i * 53) % 3) * 0.1 - 0.1]} rotation={[0, i * 0.7, 0]} outline={0.008} />
		))}
	</group>
);

/** An upright piano (the quiet music room). */
export const Piano3D: React.FC<{at: V3; rot?: number}> = ({at, rot = 0}) => (
	<group position={at} rotation={[0, rot, 0]}>
		<T shape={{kind: 'box', w: 1.5, h: 1.3, d: 0.6}} color="#2A1E2E" position={[0, 0.65, 0]} />
		<T shape={{kind: 'box', w: 1.4, h: 0.05, d: 0.25}} color="#F2F2F2" position={[0, 0.8, 0.4]} />
	</group>
);
