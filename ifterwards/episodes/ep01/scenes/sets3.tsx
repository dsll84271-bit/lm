import React from 'react';
import {Layer, Solid} from '../../../components/DepthLayers';
import {Box, Chair, Counter, CREAM, Door, FloorLamp, Glow, INK, Lights, Mug, Pendant, Picture, Plant, Room, RoundTable, Screen, Shelf, Sofa, STEEL, Table, WOOD, WOOD_DARK, type SkyName, type V3} from '../../../components/kit';

// Sets for Day 3 and Week 1, plus the living room that several later scenes
// are dressed from.

const TEAL = '#19C2B1';
const RED = '#E2493B';

// ------------------------------------------------------------------ cafe

export const CAFE = {
	left: [-2.1, 0, -0.9] as V3,
	centre: [0.1, 0, 0.3] as V3,
	right: [2.2, 0, -0.9] as V3,
};

/** A cafe in soft, pale colours. Three round tables. */
export const Cafe: React.FC<{biscuit?: boolean}> = ({biscuit = true}) => (
	<>
		<Lights sky="#FFF6EA" ground="#D9C3B0" ambient={1.45} sun={{from: [-6, 5, -6], to: [0.5, 0.8, 0.3], color: '#FFEBCB', intensity: 3.2}} />
		<Layer name="bg">
			<Room wall="#E9D3C2" side="#DCC3B0" floor={['#C9A98C', '#D2B396']} tile={0.9} windows={[{x: -1.9, y: 1.7, w: 2.6, h: 1.5}]} sky="day" glow={{color: '#FFF3DD', opacity: 0.3}} />
			<Counter at={[2.3, 0, -2.6]} w={2.6} color="#A8C4BC" top={CREAM} doors={3} />
			<Solid size={[0.5, 0.5, 0.4]} position={[2.9, 1.17, -2.6]} color={STEEL} metalness={0.5} roughness={0.3} bevel={0.04} />
			{[1.5, 1.75, 2.0].map((x) => <Mug key={x} at={[x, 0.93, -2.55]} band="#E8B7A8" />)}
			<Shelf at={[2.3, 1.9, -2.86]} w={2.2} items={['#E8B7A8', CREAM, '#A8C4BC', '#F0D9A8', CREAM, '#E8B7A8']} />
			<Picture at={[0.3, 2.0, -2.98]} size={[0.8, 0.6]} color="#A8C4BC" />
			<Pendant at={[-2.1, 2.5, -0.9]} color="#E8B7A8" />
			<Pendant at={[2.2, 2.5, -0.9]} color="#A8C4BC" />
			<Plant at={[-4.2, 0, -2.4]} s={1.2} leaf="#7FB8A4" pot="#D8A48F" />
		</Layer>
		<Layer name="mid">
			{[CAFE.left, CAFE.centre, CAFE.right].map((t, i) => (
				<React.Fragment key={i}>
					<RoundTable at={t} r={0.5} color="#F2E6D4" leg="#B79C86" />
					<Chair at={[t[0] + 0.78, 0, t[2]]} color="#D8A48F" leg="#B79C86" />
					<Chair at={[t[0] - 0.78, 0, t[2]]} turn={180} color="#D8A48F" leg="#B79C86" />
					<Mug at={[t[0] + 0.2, 0.72, t[2] + 0.1]} band={i === 1 ? TEAL : '#E8B7A8'} />
					<Mug at={[t[0] - 0.22, 0.72, t[2] - 0.05]} band="#A8C4BC" />
				</React.Fragment>
			))}
			{/* The last biscuit, on the stickman's table. */}
			<Solid shape="cylinder" size={[0.1, 0.012]} position={[CAFE.centre[0], 0.726, CAFE.centre[2] + 0.22]} color={CREAM} roughness={0.4} />
			{biscuit ? <Solid shape="cylinder" size={[0.045, 0.014]} position={[CAFE.centre[0], 0.74, CAFE.centre[2] + 0.22]} color="#C98F52" /> : null}
		</Layer>
		<Layer name="fg">
			<Plant at={[-2.6, 0, 2.9]} s={1.1} leaf="#6FA893" pot="#C99380" />
			<Solid size={[0.9, 0.06, 0.5]} position={[2.7, 0.8, 2.6]} color="#CDB8A4" bevel={0.02} />
		</Layer>
	</>
);

// -------------------------------------------------------------- showroom

/** A car showroom: glossy floor, tall windows, one very shiny car. */
export const Showroom: React.FC = () => (
	<>
		<Lights sky="#F4F7FF" ground="#C9CEDB" ambient={1.5} sun={{from: [-5, 6, -6], to: [0, 0.6, 0], color: '#FFFFFF', intensity: 3.6}} fills={[{at: [0.6, 2.6, 1], color: '#FFFFFF', intensity: 10}]} />
		<Layer name="bg">
			<Room wall="#DCE2EE" side="#CCD3E2" floor={['#B9C1D2', '#C4CBDA']} tile={2.2} windows={[{x: -2.4, y: 1.8, w: 2.6, h: 2.6}, {x: 1.4, y: 1.8, w: 2.6, h: 2.6}]} sky="day" glow={{color: '#FFFFFF', opacity: 0.22}} />
			<Solid size={[2.4, 0.5, 0.06]} position={[3.9, 2.6, -2.95]} color={RED} bevel={0.02} cast={false} />
			{/* The partition the salesman walks behind. */}
			<Solid size={[0.3, 2.6, 2.2]} position={[3.6, 1.3, -1.6]} color="#C3CADB" bevel={0.03} />
		</Layer>
		<Layer name="mid">
			{/* The car, side on. */}
			<group position={[0.9, 0, -0.9]}>
				<Solid size={[3.3, 0.55, 1.4]} position={[0, 0.52, 0]} color={RED} bevel={0.2} roughness={0.18} metalness={0.3} />
				<Solid size={[1.75, 0.5, 1.26]} position={[-0.1, 0.98, 0]} color={RED} bevel={0.2} roughness={0.18} metalness={0.3} />
				<Solid size={[0.72, 0.3, 1.28]} position={[-0.52, 0.99, 0]} color="#1C2244" bevel={0.06} roughness={0.1} cast={false} />
				<Solid size={[0.72, 0.3, 1.28]} position={[0.34, 0.99, 0]} color="#1C2244" bevel={0.06} roughness={0.1} cast={false} />
				{[-1.05, 1.05].flatMap((x) =>
					[-0.62, 0.62].map((z) => (
						<React.Fragment key={`${x}${z}`}>
							<Solid shape="cylinder" size={[0.32, 0.22]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.32, z]} color={INK} />
							<Solid shape="cylinder" size={[0.17, 0.23]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.32, z]} color={STEEL} metalness={0.6} roughness={0.3} cast={false} />
						</React.Fragment>
					)),
				)}
				<Solid size={[0.1, 0.12, 0.3]} position={[1.63, 0.6, 0.45]} color="#FFF4E0" emissive="#FFF4E0" emissiveIntensity={0.6} bevel={0.03} cast={false} />
			</group>
			{/* A price stand. */}
			<Solid shape="cylinder" size={[0.02, 1.1]} position={[-1.35, 0.55, 0.25]} color={INK} />
			<Solid size={[0.5, 0.34, 0.02]} position={[-1.35, 1.2, 0.25]} color={CREAM} bevel={0.006} />
		</Layer>
		<Layer name="fg">
			<Plant at={[-3.0, 0, 3.0]} s={1.3} />
			<Solid size={[0.4, 1.1, 0.4]} position={[3.1, 0.55, 3.0]} color="#2A345F" bevel={0.03} />
		</Layer>
	</>
);

// --------------------------------------------------------- interview room

/** A plain interview room: one long desk, his chair facing it. */
export const Interview: React.FC = () => (
	<>
		<Lights sky="#E8EEF7" ground="#9AA6A8" ambient={1.3} sun={{from: [5, 6, 5], to: [0, 1, -1], color: '#FFF7E8', intensity: 2.4}} />
		<Layer name="bg">
			<Room wall="#7FA09C" side="#6F908C" floor={['#5F6F78', '#687883']} tile={0.8} windows={[{x: 3.2, y: 1.8, w: 1.5, h: 1.3}]} sky="grey" />
			<Picture at={[-2.6, 1.95, -2.98]} size={[1.0, 0.7]} color="#CFE0DC" />
			<Solid shape="cylinder" size={[0.22, 0.04]} rotation={[Math.PI / 2, 0, 0]} position={[0.9, 2.5, -2.97]} color={CREAM} cast={false} />
			<Door at={[-4.2, 0, -2.96]} color="#D5DFDC" />
			<Plant at={[4.5, 0, -2.4]} s={1.1} />
		</Layer>
		<Layer name="mid">
			<Table at={[1.2, 0, -1.2]} size={[2.6, 0.8]} h={0.76} color="#D9D2C2" leg="#5F6F78" />
			{/* The front of the desk, so the panel are seen from the chest up. */}
			<Solid size={[2.5, 0.64, 0.03]} position={[1.2, 0.4, -0.84]} color="#C9C1AF" bevel={0.01} />
			<Solid size={[0.3, 0.02, 0.22]} position={[0.8, 0.77, -1.05]} color={CREAM} cast={false} />
			<Solid size={[0.3, 0.02, 0.22]} position={[1.75, 0.77, -1.05]} color={CREAM} cast={false} />
			<Chair at={[-1.1, 0, -0.5]} turn={180} color="#3D4A73" leg={INK} />
		</Layer>
		<Layer name="fg">
			<Solid size={[0.5, 3.4, 0.2]} position={[-2.2, 1.7, 3.0]} color="#263A3C" bevel={0.02} />
		</Layer>
	</>
);

// ------------------------------------------------------------- restaurant

/** A restaurant at night: one table for two, a candle between them. */
export const Restaurant: React.FC<{flicker?: number}> = ({flicker = 0}) => (
	<>
		<Lights sky="#C9A8B0" ground="#7A5560" ambient={0.75} fills={[{at: [0, 1.15, 0.1], color: '#FFB86B', intensity: 9 + flicker * 1.5, distance: 5}, {at: [-2.6, 2.4, -1.6], color: '#FFCF94', intensity: 7, distance: 6}, {at: [2.8, 2.4, -1.6], color: '#FFCF94', intensity: 7, distance: 6}]} />
		<Layer name="bg">
			<Room wall="#6B3A4A" side="#5A303E" floor={['#3E2630', '#472C37']} tile={0.9} windows={[{x: 0, y: 1.9, w: 2.2, h: 1.5}]} sky="night" glow={{color: '#9FB6FF', opacity: 0.12}} />
			{[-2.6, 2.8].map((x) => (
				<React.Fragment key={x}>
					<RoundTable at={[x, 0, -1.9]} r={0.48} color={CREAM} leg="#3E2630" />
					<Solid shape="cylinder" size={[0.02, 0.14]} position={[x, 0.79, -1.9]} color={CREAM} emissive="#FFD9A0" emissiveIntensity={1} cast={false} />
					<Glow at={[x, 0.95, -1.7]} size={[1.4, 1.4]} color="#FFB86B" opacity={0.45} />
					<Pendant at={[x, 2.55, -1.9]} on color="#D9A066" />
				</React.Fragment>
			))}
			<Picture at={[-3.4, 2.0, -2.98]} size={[0.7, 0.9]} color="#D9A066" frame="#3E2630" />
			<Picture at={[3.6, 2.0, -2.98]} size={[0.7, 0.9]} color="#A8566A" frame="#3E2630" />
		</Layer>
		<Layer name="mid">
			<RoundTable at={[0, 0, 0]} r={0.55} color={CREAM} leg="#3E2630" />
			<Chair at={[0.85, 0, 0]} color="#7A4E3A" leg="#3E2630" />
			<Chair at={[-0.85, 0, 0]} turn={180} color="#7A4E3A" leg="#3E2630" />
			<Solid shape="cylinder" size={[0.022, 0.16]} position={[0, 0.8, 0.05]} color={CREAM} cast={false} />
			<Solid shape="sphere" size={[0.022]} scale={[1, 1.7 + flicker * 0.3, 1]} position={[0, 0.91, 0.05]} color="#FFD27A" emissive="#FFB040" emissiveIntensity={2} cast={false} />
			<Glow at={[0, 0.93, 0.2]} size={[1.5 + flicker * 0.1, 1.5 + flicker * 0.1]} color="#FFB86B" opacity={0.55} />
			{[-0.28, 0.28].map((x) => (
				<React.Fragment key={x}>
					<Solid shape="cylinder" size={[0.11, 0.012]} position={[x, 0.726, 0.1]} color="#FFF4E0" roughness={0.4} />
					<Solid shape="cylinder" size={[0.03, 0.15, 0.02]} position={[x * 1.2, 0.8, -0.2]} color="#C9D6F0" roughness={0.1} cast={false} />
				</React.Fragment>
			))}
		</Layer>
		<Layer name="fg">
			<Solid shape="cylinder" size={[0.5, 0.05]} position={[-2.2, 0.74, 2.6]} color="#D9CDB6" />
			<Plant at={[2.6, 0, 2.8]} s={1.2} leaf="#2F6F60" />
		</Layer>
	</>
);

// -------------------------------------------------------------- card room

/** A card table under one lamp. */
export const CardRoom: React.FC = () => (
	<>
		<Lights sky="#9FB0A8" ground="#5A5248" ambient={0.6} fills={[{at: [0, 1.7, 0], color: '#FFD9A0', intensity: 22, distance: 6}]} />
		<Layer name="bg">
			<Room wall="#2F4A46" side="#27403C" floor={['#3A2F2A', '#433630']} />
			<Shelf at={[-2.6, 1.7, -2.86]} w={1.6} items={['#B5654A', CREAM, '#8F5F3B', TEAL, '#B5654A']} />
			<Picture at={[2.4, 1.9, -2.98]} size={[1.0, 0.7]} color="#5A7A72" frame={WOOD_DARK} />
			<FloorLamp at={[3.6, 0, -2.3]} />
		</Layer>
		<Layer name="mid">
			<RoundTable at={[0, 0, 0]} r={0.85} h={0.74} color="#2F7A5C" leg={WOOD_DARK} />
			<Chair at={[1.2, 0, 0]} color={WOOD} />
			<Chair at={[-1.2, 0, 0]} turn={180} color={WOOD} />
			<Pendant at={[0, 2.1, 0]} on />
			{/* Cards and chips: nearly all of the chips are on his side. */}
			{[[-0.1, 0.1, 0.3], [0.05, -0.1, -0.2], [0.2, 0.15, 0.7], [-0.25, -0.2, -0.5]].map(([x, z, r], i) => (
				<Solid key={i} size={[0.09, 0.004, 0.13]} rotation={[0, r, 0]} position={[x, 0.745, z]} color="#FFF4E0" cast={false} />
			))}
			{[RED, TEAL, CREAM, RED, TEAL].map((c, i) => (
				<Solid key={i} shape="cylinder" size={[0.04, 0.03 + i * 0.022]} position={[-0.5 - (i % 2) * 0.1, 0.755 + i * 0.011, -0.2 + i * 0.11]} color={c} />
			))}
			<Solid shape="cylinder" size={[0.04, 0.02]} position={[0.5, 0.75, 0.1]} color={CREAM} />
		</Layer>
		<Layer name="fg">
			<Solid size={[0.9, 1.0, 0.1]} position={[2.3, 0.5, 2.6]} color="#1F2E2C" bevel={0.03} />
		</Layer>
	</>
);

// ------------------------------------------------------------ living room

export type LoungeKind = 'tv' | 'party' | 'after' | 'flat' | 'dawn' | 'present';

/**
 * A living room, dressed six ways:
 *   tv      - the sofa faces a television (Week 1)
 *   party   - bunting, balloons, a cake with candles lit (Month 1)
 *   after   - the same party with the candles out and the light gone cold
 *   flat    - his own flat at night, nearly bare (Month 6)
 *   dawn    - the flat as the sun comes up
 *   present - a friend's living room on a warm evening (Year 1)
 * `screen` is the television's colour. `cool` (0 to 1) cools the party light.
 */
export const Lounge: React.FC<{kind: LoungeKind; screen?: string; cool?: number}> = ({kind, screen = '#9CC3DE', cool = 0}) => {
	const party = kind === 'party' || kind === 'after';
	const flat = kind === 'flat' || kind === 'dawn';
	const sky: SkyName = kind === 'tv' || kind === 'flat' ? 'night' : kind === 'dawn' ? 'dawn' : kind === 'present' ? 'dusk' : 'dusk';
	const c = kind === 'after' ? 1 : cool;
	const warm = 1 - c;
	const wall = flat ? '#3A4470' : kind === 'tv' ? '#4A4A7A' : kind === 'present' ? '#B98A6E' : '#A8748A';
	return (
		<>
			<Lights
				sky={flat ? '#9AA8E0' : kind === 'tv' ? '#9CA6DC' : '#FFE6CC'}
				ground={flat ? '#4E4A6A' : '#A0806E'}
				ambient={flat ? (kind === 'dawn' ? 0.95 : 0.6) : kind === 'tv' ? 0.6 : 0.75 + 0.45 * warm}
				sun={kind === 'dawn' ? {from: [-7, 2.4, -6], to: [1, 0.9, 0], color: '#FFB978', intensity: 7} : undefined}
				fills={
					flat
						? [{at: [-2.2, 1.8, -2.2], color: '#9FB6FF', intensity: kind === 'dawn' ? 0 : 7, distance: 7}]
						: kind === 'tv'
							? [{at: [-1.6, 1.0, -0.4], color: screen, intensity: 14, distance: 6}]
							: [
									{at: [0.2, 2.0, 0.4], color: '#FFCF94', intensity: 20 * warm + 3, distance: 8},
									{at: [0, 2.2, 1.5], color: '#8EA6FF', intensity: 14 * c, distance: 8},
								]
				}
			/>
			<Layer name="bg">
				<Room wall={wall} floor={flat ? ['#33304E', '#3A3657'] : ['#7A5A48', '#846250']} tile={0.9} windows={[{x: -2.4, y: 1.8, w: 1.7, h: 1.4}]} sky={sky} glow={{color: sky === 'night' ? '#9FB6FF' : '#FFC387', opacity: sky === 'night' ? 0.14 : 0.3 * (0.4 + 0.6 * warm)}} />
				{flat ? null : <Picture at={[0.6, 2.0, -2.98]} size={[1.0, 0.65]} color="#E8B7A8" />}
				{flat ? null : <Shelf at={[3.2, 1.75, -2.86]} w={1.5} items={[TEAL, CREAM, '#B5654A', '#E8B7A8', CREAM]} />}
				{flat ? null : <Plant at={[4.3, 0, -2.4]} s={1.2} />}
				{kind === 'tv' ? null : <FloorLamp at={[3.9, 0, -2.2]} on={!flat && c < 0.6} />}
				{kind === 'tv' ? null : <Sofa at={[1.3, 0, -2.3]} w={2.2} color={flat ? '#4A5890' : '#5B79B0'} dark={flat ? '#3C4877' : '#476296'} />}
				{party
					? [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
							<Solid key={x} shape="cone" size={[0.2, 0.34]} rotation={[Math.PI, 0, 0]} position={[x, 2.75 - Math.cos(x * 0.5) * 0.18, -2.9]} color={[RED, TEAL, CREAM, '#FFD27A'][i % 4]} cast={false} />
						))
					: null}
				{party
					? [[-3.6, 2.3, RED], [-3.25, 2.55, TEAL], [3.7, 2.5, '#FFD27A'], [4.05, 2.25, RED]].map(([x, y, col]) => (
							<React.Fragment key={x as number}>
								<Solid shape="sphere" size={[0.24]} scale={[1, 1.2, 1]} position={[x as number, y as number, -2.4]} color={col as string} roughness={0.3} />
								<Solid shape="cylinder" size={[0.004, y as number]} position={[x as number, (y as number) / 2 - 0.25, -2.4]} color={CREAM} cast={false} />
							</React.Fragment>
						))
					: null}
			</Layer>
			<Layer name="mid">
				{kind === 'tv' ? (
					<>
						<Sofa at={[1.5, 0, -0.5]} turn={-90} w={1.9} />
						<Counter at={[-2.5, 0, -0.6]} turn={90} w={1.6} h={0.5} d={0.45} color={WOOD_DARK} top={WOOD} doors={2} />
						<Screen at={[-2.45, 1.02, -0.6]} turn={62} size={[1.25, 0.72]} color={screen} glow={0.55} />
					</>
				) : null}
				{party ? (
					<>
						<Table at={[0.2, 0, 0.1]} size={[1.5, 0.85]} color={CREAM} leg={WOOD_DARK} />
						<Chair at={[1.25, 0, 0.1]} />
						{/* The cake. */}
						<Solid shape="cylinder" size={[0.2, 0.13]} position={[0.2, 0.765, 0.1]} color="#FFF4E0" roughness={0.6} />
						<Solid shape="cylinder" size={[0.205, 0.035]} position={[0.2, 0.83, 0.1]} color="#E8A0B0" roughness={0.6} cast={false} />
						{[-0.1, -0.03, 0.04, 0.11].map((dx) => (
							<React.Fragment key={dx}>
								<Solid shape="cylinder" size={[0.008, 0.08]} position={[0.2 + dx, 0.89, 0.1 + dx * 0.3]} color={TEAL} cast={false} />
								{kind === 'party' ? <Solid shape="sphere" size={[0.014]} scale={[1, 1.6, 1]} position={[0.2 + dx, 0.945, 0.1 + dx * 0.3]} color="#FFD27A" emissive="#FFB040" emissiveIntensity={2} cast={false} /> : null}
							</React.Fragment>
						))}
						{kind === 'party' ? <Glow at={[0.2, 0.96, 0.3]} size={[1.2, 1.0]} color="#FFB86B" opacity={0.5 * warm} /> : null}
						<Mug at={[-0.25, 0.7, 0.25]} band={RED} />
						<Mug at={[0.62, 0.7, -0.05]} />
					</>
				) : null}
				{flat ? (
					<>
						<Table at={[-0.6, 0, 0.2]} size={[1.0, 0.6]} h={0.46} color="#55527A" leg="#3C3A5A" />
						{/* His phone, face down. */}
						<Solid size={[0.075, 0.012, 0.15]} rotation={[0, 0.5, 0]} position={[-0.55, 0.467, 0.22]} color={INK} bevel={0.004} />
					</>
				) : null}
				{kind === 'present' ? <Table at={[0.3, 0, 0.4]} size={[1.1, 0.6]} h={0.46} /> : null}
			</Layer>
			<Layer name="fg">
				{party ? <Solid shape="sphere" size={[0.34]} scale={[1, 1.2, 1]} position={[-2.3, 2.0, 2.8]} color={TEAL} roughness={0.3} /> : null}
				{party ? <Solid shape="sphere" size={[0.3]} scale={[1, 1.2, 1]} position={[2.9, 0.5, 2.9]} color={RED} roughness={0.3} /> : null}
				{flat ? <Box at={[2.5, 0, 2.6]} size={[0.7, 0.5, 0.6]} color="#5B4638" /> : null}
				{kind === 'tv' || kind === 'present' ? <Plant at={[2.7, 0, 2.8]} s={1.2} /> : null}
				{kind === 'tv' ? <Solid size={[0.5, 3.4, 0.2]} position={[-2.3, 1.7, 3.1]} color="#1F2A55" bevel={0.02} /> : null}
			</Layer>
		</>
	);
};
