import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Layer, Solid, useDrawn} from '../../../components/DepthLayers';
import {Box, Chair, Counter, CREAM, FloorLamp, Glow, INK, Lights, Pendant, Picture, Plant, Room, Screen, Sky, STEEL, Table, WOOD, WOOD_DARK, type V3} from '../../../components/kit';

// Sets for Day 1: the high street, the corner shop, the office, the diary
// desk and the bedroom.

const TEAL = '#19C2B1';
const RED = '#E2493B';

// ------------------------------------------------------------ high street

export type StreetMood = 'day' | 'dusk' | 'night';

const FRONTS: Array<{x: number; w: number; h: number; color: string; awning: string}> = [
	{x: -7.2, w: 3.2, h: 5.2, color: '#C9B7A0', awning: RED},
	{x: -3.9, w: 3.2, h: 6.2, color: '#8FA3C4', awning: CREAM},
	{x: -0.5, w: 3.4, h: 5.0, color: '#D8C6A4', awning: TEAL},
	{x: 3.0, w: 3.4, h: 6.6, color: '#B58C82', awning: CREAM},
	{x: 6.5, w: 3.4, h: 5.4, color: '#93A9A6', awning: RED},
];

/** A street of shop fronts. People walk along the pavement at about z = 0. */
export const HighStreet: React.FC<{mood?: StreetMood; lit?: number}> = ({mood = 'day', lit = mood === 'day' ? 0 : 1}) => {
	const day = mood === 'day';
	const pane = day ? '#9CC3DE' : '#FFD98F';
	return (
		<>
			<Lights
				sky={day ? '#DCE8FF' : mood === 'dusk' ? '#C9B6E2' : '#8E9BD6'}
				ground={day ? '#B9AFA6' : '#9A7E86'}
				ambient={day ? 1.5 : mood === 'dusk' ? 1.05 : 0.7}
				sun={
					day
						? {from: [-5, 8, 6], to: [0, 0, -1], color: '#FFF1D6', intensity: 3.4}
						: mood === 'dusk'
							? {from: [-9, 2.6, 2], to: [1, 0.8, -1], color: '#FF9E5E', intensity: 5}
							: undefined
				}
				fills={day ? [] : [{at: [-2.6, 3, -0.6], color: '#FFCF94', intensity: 16 * lit, distance: 9}, {at: [3.4, 3, -0.6], color: '#FFCF94', intensity: 16 * lit, distance: 9}]}
			/>
			<Layer name="bg">
				<Sky kind={mood} at={[0, 6, -12]} size={[44, 18]} roofs={false} />
				{/* Pavement, kerb and road. */}
				<Solid size={[30, 0.2, 7]} position={[0, -0.1, -0.5]} color={day ? '#B9B2A8' : '#8C8696'} bevel={0} />
				<Solid size={[30, 0.16, 8]} position={[0, -0.14, 7]} color={day ? '#5B6072' : '#3F4257'} bevel={0} cast={false} />
				{FRONTS.map((f, i) => (
					<group key={i} position={[f.x, 0, -3]}>
						<Solid size={[f.w, f.h, 1.4]} position={[0, f.h / 2, -0.7]} color={f.color} bevel={0.02} />
						{/* Shop window, door and awning. */}
						<Solid size={[f.w * 0.52, 1.5, 0.05]} position={[-f.w * 0.16, 1.25, 0.03]} color={pane} emissive={pane} emissiveIntensity={day ? 0.12 : 0.9 * lit} cast={false} roughness={0.2} />
						<Solid size={[0.8, 2.0, 0.05]} position={[f.w * 0.3, 1.0, 0.03]} color={INK} cast={false} />
						<Solid size={[f.w * 0.92, 0.07, 0.8]} rotation={[0.32, 0, 0]} position={[0, 2.45, 0.38]} color={f.awning} bevel={0.01} />
						<Solid size={[f.w * 0.6, 0.34, 0.04]} position={[0, 2.95, 0.03]} color={INK} cast={false} />
						{/* Upstairs windows. */}
						{[3.9, 5.2].filter((y) => y < f.h - 0.5).flatMap((y) =>
							[-0.28, 0.28].map((dx) => (
								<Solid
									key={`${y}${dx}`}
									size={[0.7, 0.9, 0.05]}
									position={[dx * f.w, y, 0.03]}
									color={pane}
									emissive={pane}
									emissiveIntensity={day ? 0.1 : ((i + Math.round(y) + (dx > 0 ? 1 : 0)) % 3 === 0 ? 0.15 : 1) * lit}
									cast={false}
									roughness={0.2}
								/>
							)),
						)}
					</group>
				))}
				{/* Street lamps and trees. */}
				{[-2.6, 3.4].map((x) => (
					<group key={x} position={[x, 0, -1.9]}>
						<Solid shape="cylinder" size={[0.05, 3.2]} position={[0, 1.6, 0]} color={INK} />
						<Solid shape="sphere" size={[0.16]} position={[0, 3.28, 0]} color={CREAM} emissive="#FFD9A0" emissiveIntensity={day ? 0 : 1.4 * lit} cast={false} />
						{day ? null : <Glow at={[0, 3.28, 0.2]} size={[2.6, 2.6]} color="#FFCF94" opacity={0.5 * lit} />}
					</group>
				))}
				{[-5.6, 0.6, 6.2].map((x) => (
					<group key={x} position={[x, 0, -2.1]}>
						<Solid shape="cylinder" size={[0.07, 1.5]} position={[0, 0.75, 0]} color={WOOD_DARK} />
						<Solid shape="sphere" size={[0.62]} scale={[1, 1.15, 1]} position={[0, 2.05, 0]} color={day ? '#3FA08C' : '#2F6F78'} roughness={1} />
					</group>
				))}
			</Layer>
			<Layer name="fg">
				<Solid shape="cylinder" size={[0.07, 3.6]} position={[-2.4, 1.8, 3.4]} color="#1F2A55" />
				<Solid size={[0.5, 0.9, 0.5]} position={[2.9, 0.45, 3.0]} color="#26315C" bevel={0.05} />
			</Layer>
		</>
	);
};

// ------------------------------------------------------------ corner shop

/** A small shop: a counter, a till and a back wall of identical boxes. */
export const Shop: React.FC = () => (
	<>
		<Lights sky="#FFF1DC" ground="#B99F8A" ambient={1.25} sun={{from: [-3, 6, 6], to: [0.3, 1, -1.5], color: '#FFE2B8', intensity: 2.2}} fills={[{at: [0.5, 2.6, -0.8], color: '#FFD9A0', intensity: 10}]} />
		<Layer name="bg">
			<Room wall="#D9B88C" side="#C7A377" floor={['#8C6F5C', '#9A7C68']} tile={0.8} />
			{/* Shelves, floor to ceiling, of the same teal box. */}
			{[0.55, 1.15, 1.75, 2.35].map((y) => (
				<React.Fragment key={y}>
					<Solid size={[6.4, 0.04, 0.34]} position={[0.4, y, -2.8]} color={WOOD} />
					{Array.from({length: 16}, (_, i) => (
						<Solid key={i} size={[0.3, 0.42, 0.24]} position={[-2.6 + i * 0.4, y + 0.23, -2.8]} color={(i + Math.round(y * 2)) % 7 === 3 ? '#16AC9D' : TEAL} bevel={0.012} roughness={0.6} />
					))}
				</React.Fragment>
			))}
			<Pendant at={[-1.2, 2.7, -1]} on />
			<Pendant at={[1.6, 2.7, -1]} on />
		</Layer>
		<Layer name="mid">
			<Counter at={[0.9, 0, -0.9]} w={2.6} h={0.95} d={0.6} color="#7A4E3A" top="#E9DEC8" doors={3} />
			<Solid size={[0.42, 0.26, 0.34]} position={[1.75, 1.09, -0.9]} color={INK} bevel={0.03} />
			<Solid size={[0.3, 0.2, 0.03]} rotation={[-0.4, 0, 0]} position={[1.75, 1.3, -0.82]} color="#9CC3DE" emissive="#9CC3DE" emissiveIntensity={0.5} cast={false} />
			<Box at={[0.35, 0.96, -0.85]} size={[0.3, 0.42, 0.24]} color={TEAL} turn={18} />
		</Layer>
		<Layer name="fg">
			<Solid size={[0.9, 2.2, 0.4]} position={[-2.25, 1.1, 2.6]} color="#3A2A2A" bevel={0.02} />
			<Box at={[2.6, 0, 2.5]} size={[0.6, 0.7, 0.5]} color="#5B4638" />
		</Layer>
	</>
);

// ----------------------------------------------------------------- office

/** An open-plan office: his desk, a window with blinds, filing cabinets. */
export const Office: React.FC<{paper?: number}> = ({paper = 0}) => (
	<>
		<Lights sky="#E6ECFF" ground="#9FA6B8" ambient={1.3} sun={{from: [-6, 5, -6], to: [0.5, 0.8, 0], color: '#FFF2DC', intensity: 4}} />
		<Layer name="bg">
			<Room wall="#8D9BBE" side="#7C89AB" floor={['#59627F', '#626C8B']} tile={0.7} windows={[{x: -1.6, y: 1.75, w: 2.4, h: 1.4}]} sky="day" glow={{color: '#EAF2FF', opacity: 0.22}} />
			{[1.2, 1.42, 1.64, 1.86, 2.08, 2.3].map((y) => (
				<Solid key={y} size={[2.4, 0.03, 0.09]} rotation={[0.5, 0, 0]} position={[-1.6, y, -2.96]} color={CREAM} cast={false} />
			))}
			{[1.6, 2.35, 3.1].map((x) => (
				<React.Fragment key={x}>
					<Solid size={[0.7, 1.3, 0.55]} position={[x, 0.65, -2.7]} color="#6C7896" bevel={0.02} />
					{[0.3, 0.72, 1.14].map((y) => (
						<Solid key={y} size={[0.24, 0.03, 0.03]} position={[x, y, -2.41]} color={STEEL} metalness={0.5} cast={false} />
					))}
				</React.Fragment>
			))}
			<Picture at={[2.35, 2.05, -2.98]} size={[0.9, 0.55]} color="#D6DDF0" />
			<Plant at={[-3.6, 0, -2.5]} s={1.1} />
		</Layer>
		<Layer name="mid">
			<Table at={[0.2, 0, -0.15]} size={[1.9, 0.9]} color="#C9CFDE" leg="#59627F" />
			<Chair at={[-1.0, 0, -0.15]} turn={180} color="#3D4A73" leg={INK} />
			<Screen at={[0.75, 1.06, -0.4]} turn={-38} size={[0.62, 0.38]} color="#9CC3DE" glow={0.12} />
			<Solid size={[0.07, 0.2, 0.07]} position={[0.75, 0.8, -0.4]} color={INK} />
			<Solid size={[0.42, 0.02, 0.15]} rotation={[0, 0.3, 0]} position={[0.2, 0.71, -0.02]} color={INK} bevel={0.006} />
			{/* The pile of paper his manager drops. `paper` is its height in sheets. */}
			{paper > 0 ? <Box at={[0.1, 0.7, -0.32]} size={[0.3, 0.012 * paper, 0.4]} color="#F4EFE4" turn={8} /> : null}
		</Layer>
		<Layer name="fg">
			<Solid size={[1.6, 1.25, 0.08]} position={[-2.7, 0.62, 2.7]} color="#39456E" bevel={0.03} />
			<Plant at={[2.5, 0.2, 2.3]} s={0.9} />
		</Layer>
	</>
);

// ------------------------------------------------------------- diary desk

/** A desk under a lamp with an open diary. `marks` tally marks are drawn in it. */
export const DiaryDesk: React.FC<{marks: number}> = ({marks}) => {
	const drawn = useDrawn();
	const {canvas, map} = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = 1024;
		c.height = 512;
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		t.anisotropy = 8;
		return {canvas: c, map: t};
	}, []);
	const ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.fillStyle = '#FFF4E0';
		ctx.fillRect(0, 0, 1024, 512);
		ctx.fillStyle = '#D9CDB6';
		ctx.fillRect(506, 0, 12, 512);
		ctx.strokeStyle = '#C9D3EA';
		ctx.lineWidth = 2;
		for (let y = 70; y < 512; y += 62) {
			ctx.beginPath();
			ctx.moveTo(30, y);
			ctx.lineTo(994, y);
			ctx.stroke();
		}

		ctx.strokeStyle = '#0B1437';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		for (let i = 0; i < Math.floor(marks); i++) {
			const group = Math.floor(i / 5);
			const col = group % 6;
			const row = Math.floor(group / 6);
			const x = (col < 3 ? 60 : 560) + (col % 3) * 140 + (i % 5) * 20;
			const y = 28 + row * 62;
			ctx.beginPath();
			if (i % 5 === 4) {
				ctx.moveTo(x - 92, y + 30);
				ctx.lineTo(x + 6, y + 6);
			} else {
				ctx.moveTo(x, y);
				ctx.lineTo(x + 3, y + 36);
			}

			ctx.stroke();
		}

		map.needsUpdate = true;
	}

	return (
		<>
			<Lights sky="#FFE7C4" ground="#6A4E3C" ambient={0.75} sun={{from: [-2, 3, 1.5], to: [0, 0.75, 0], color: '#FFD49A', intensity: 3.5}} />
			<Layer name="bg">
				<Room wall="#3B3554" floor={['#2C2740', '#332D4A']} backZ={-2.2} />
				<FloorLamp at={[-1.9, 0, -1.7]} />
				<Picture at={[1.2, 1.7, -2.18]} color="#5A6A9A" />
			</Layer>
			<Layer name="mid">
				<Solid size={[2.6, 0.06, 1.3]} position={[0, 0.72, 0]} color={WOOD} bevel={0.02} roughness={0.55} />
				<Solid size={[1.02, 0.03, 0.56]} position={[0, 0.765, 0.05]} color="#7A2F3A" bevel={0.012} />
				{drawn ? (
					<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.784, 0.05]} receiveShadow>
						<planeGeometry args={[0.96, 0.5]} />
						<meshStandardMaterial map={map} roughness={0.9} />
					</mesh>
				) : null}
				<Solid shape="cylinder" size={[0.012, 0.3]} rotation={[Math.PI / 2, 0, 0.5]} position={[0.62, 0.762, 0.2]} color={INK} />
			</Layer>
			<Layer name="fg">
				<Solid shape="cylinder" size={[0.09, 0.2]} position={[-0.75, 0.85, 0.75]} color="#FFF4E0" roughness={0.4} />
				<Solid size={[0.5, 0.1, 0.34]} position={[0.9, 0.8, 0.8]} color="#2A9485" bevel={0.02} />
			</Layer>
		</>
	);
};

// ---------------------------------------------------------------- bedroom

/** His bedroom at night, with a lie detector on the desk. `t` is time in frames. */
export const Bedroom: React.FC<{t: number}> = ({t}) => {
	const drawn = useDrawn();
	const {canvas, map} = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = 512;
		c.height = 256;
		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return {canvas: c, map: tex};
	}, []);
	const ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.fillStyle = '#FFF4E0';
		ctx.fillRect(0, 0, 512, 256);
		ctx.lineWidth = 4;
		[['#E2493B', 60, 1.0], ['#0B1437', 128, 1.7], ['#19C2B1', 196, 0.6]].forEach(([colour, y0, speed]) => {
			ctx.strokeStyle = colour as string;
			ctx.beginPath();
			for (let x = 0; x <= 512; x += 6) {
				const u = (x + t * 5) * 0.045 * (speed as number);
				const y = (y0 as number) + Math.sin(u) * 14 + Math.sin(u * 2.7) * 9 * Math.sin(u * 0.31);
				if (x === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}

			ctx.stroke();
		});
		map.needsUpdate = true;
	}

	const desk: V3 = [0.9, 0, -1.2];
	return (
		<>
			<Lights sky="#8FA0E0" ground="#5A4E72" ambient={0.75} fills={[{at: [0.5, 1.5, -0.6], color: '#FFCF94', intensity: 12, distance: 6}, {at: [-2.2, 1.9, -2.4], color: '#9FB6FF', intensity: 5, distance: 6}]} />
			<Layer name="bg">
				<Room wall="#2F3A6E" side="#28325F" floor={['#3A3558', '#423C63']} windows={[{x: -2.2, y: 1.8, w: 1.5, h: 1.2}]} sky="night" glow={{color: '#9FB6FF', opacity: 0.16}} />
				{/* Bed. */}
				<Solid size={[2.1, 0.4, 1.5]} position={[-2.4, 0.25, -1.9]} color="#5B4638" bevel={0.03} />
				<Solid size={[2.0, 0.22, 1.4]} position={[-2.4, 0.52, -1.9]} color="#C3CEE2" bevel={0.08} roughness={1} />
				<Solid size={[1.3, 0.14, 1.42]} position={[-2.05, 0.64, -1.9]} color="#4F6FA8" bevel={0.06} roughness={1} />
				<Solid size={[0.5, 0.16, 0.9]} position={[-3.1, 0.68, -1.9]} color="#FFF4E0" bevel={0.07} roughness={1} />
				<Picture at={[2.6, 1.9, -2.98]} size={[0.7, 0.9]} color="#5A6A9A" />
				<Plant at={[3.3, 0, -2.4]} s={0.9} />
			</Layer>
			<Layer name="mid">
				<Table at={desk} size={[1.5, 0.7]} h={0.74} />
				<FloorLamp at={[1.95, 0, -1.4]} />
				{/* The lie detector: a box, a roll of paper and three twitching needles. */}
				<Solid size={[0.62, 0.16, 0.42]} position={[desk[0], 0.82, desk[2]]} color="#55627F" bevel={0.03} />
				{drawn ? (
					<mesh rotation={[-Math.PI / 2, 0, 0]} position={[desk[0], 0.903, desk[2] + 0.02]}>
						<planeGeometry args={[0.5, 0.26]} />
						<meshStandardMaterial map={map} roughness={0.9} />
					</mesh>
				) : null}
				{[-0.08, 0, 0.08].map((dz, i) => (
					<Solid key={dz} size={[0.2, 0.012, 0.012]} rotation={[0, Math.sin(t * (0.5 + i * 0.23) + i) * 0.35, 0]} position={[desk[0] + 0.22, 0.915, desk[2] + 0.02 + dz]} color={INK} cast={false} />
				))}
				<Solid shape="sphere" size={[0.022]} position={[desk[0] - 0.24, 0.915, desk[2] + 0.15]} color={RED} emissive={RED} emissiveIntensity={0.6 + 0.6 * Math.sin(t * 0.4)} cast={false} />
			</Layer>
			<Layer name="fg">
				<Solid size={[0.6, 1.0, 0.5]} position={[-2.3, 0.5, 2.5]} color="#1F2A55" bevel={0.04} />
			</Layer>
		</>
	);
};
