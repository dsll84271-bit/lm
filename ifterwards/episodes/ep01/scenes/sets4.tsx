import React from 'react';
import {Layer, Solid} from '../../../components/DepthLayers';
import {Chair, Counter, CREAM, Door, Glow, INK, Lights, Mug, Picture, Plant, Room, RoundTable, Shelf, STEEL, WOOD, WOOD_DARK} from '../../../components/kit';

// Sets for Month 3, Month 6 and the turn: the office kitchen, the playroom
// and the hospital corridor.

const TEAL = '#19C2B1';
const RED = '#E2493B';

/** The kitchen at work: a counter, a coffee machine, a water cooler. */
export const OfficeKitchen: React.FC<{warm?: boolean}> = ({warm = false}) => (
	<>
		<Lights sky={warm ? '#FFEBD2' : '#E4ECF5'} ground={warm ? '#B79C8A' : '#98A3A8'} ambient={warm ? 1.3 : 1.2} sun={{from: [4, 6, 6], to: [0, 1, -1], color: warm ? '#FFE0B8' : '#F2F7FF', intensity: 2.2}} />
		<Layer name="bg">
			<Room wall={warm ? '#B7B49C' : '#A5B5B0'} side={warm ? '#A7A48C' : '#95A5A0'} floor={['#6D7A80', '#76848A']} tile={0.6} />
			<Counter at={[0.6, 0, -2.68]} w={4.2} color={warm ? '#7E8A6E' : '#6F8A8C'} top={CREAM} doors={6} />
			<Solid size={[4.2, 0.8, 0.36]} position={[0.6, 2.0, -2.8]} color={warm ? '#7E8A6E' : '#6F8A8C'} bevel={0.012} />
			{/* Coffee machine, kettle, mugs. */}
			<Solid size={[0.4, 0.46, 0.34]} position={[1.9, 1.15, -2.7]} color={INK} bevel={0.03} />
			<Solid shape="sphere" size={[0.018]} position={[1.78, 1.25, -2.52]} color={RED} emissive={RED} emissiveIntensity={1} cast={false} />
			<Solid shape="cylinder" size={[0.09, 0.22, 0.11]} position={[1.25, 1.03, -2.65]} color={STEEL} metalness={0.5} roughness={0.3} />
			{[-0.9, -0.65, -0.4].map((x) => <Mug key={x} at={[x, 0.93, -2.6]} band={x > -0.6 ? RED : TEAL} />)}
			<Solid size={[0.7, 0.02, 0.42]} position={[0.2, 0.93, -2.66]} color={STEEL} metalness={0.5} roughness={0.35} cast={false} />
			{/* Fridge, noticeboard, water cooler. */}
			<Solid size={[0.8, 1.9, 0.7]} position={[-2.2, 0.95, -2.62]} color="#D2D9E4" bevel={0.035} roughness={0.45} />
			<Solid size={[0.03, 0.5, 0.035]} position={[-1.87, 1.25, -2.25]} color={STEEL} metalness={0.5} bevel={0.012} />
			<Picture at={[3.6, 1.8, -2.98]} size={[1.0, 0.7]} color="#C9A26A" frame={WOOD_DARK} />
			{[[3.35, 1.95, CREAM], [3.75, 1.9, TEAL], [3.55, 1.65, RED], [3.9, 1.62, CREAM]].map(([x, y, c]) => (
				<Solid key={`${x}${y}`} size={[0.2, 0.16, 0.01]} position={[x as number, y as number, -2.95]} color={c as string} cast={false} />
			))}
			<Solid size={[0.36, 0.95, 0.36]} position={[-3.3, 0.475, -2.6]} color={CREAM} bevel={0.03} />
			<Solid shape="cylinder" size={[0.16, 0.42]} position={[-3.3, 1.17, -2.6]} color="#8FC1E8" roughness={0.15} />
			{/* Strip lights. */}
			{[-1.6, 1.6].map((x) => (
				<React.Fragment key={x}>
					<Solid size={[1.5, 0.05, 0.22]} position={[x, 3.2, -1.2]} color="#FFFFFF" emissive={warm ? '#FFE9C8' : '#F2F7FF'} emissiveIntensity={1.4} cast={false} />
					<Glow at={[x, 3.1, -1.0]} size={[3.4, 1.4]} color={warm ? '#FFE9C8' : '#EAF2FF'} opacity={0.3} />
				</React.Fragment>
			))}
		</Layer>
		<Layer name="mid">
			<RoundTable at={[1.6, 0, 0.2]} r={0.42} h={1.02} color={CREAM} leg="#6D7A80" />
			<Mug at={[1.5, 1.02, 0.25]} />
		</Layer>
		<Layer name="fg">
			<Solid size={[0.5, 3.4, 0.2]} position={[-2.5, 1.7, 3.2]} color="#2A3A40" bevel={0.02} />
			<Plant at={[2.8, 0, 2.9]} s={1.1} />
		</Layer>
	</>
);

/** A child's playroom in soft daylight. */
export const Playroom: React.FC = () => (
	<>
		<Lights sky="#FFF5E4" ground="#D6BFA8" ambient={1.45} sun={{from: [-6, 5, -6], to: [0.3, 0.6, 0.2], color: '#FFE7C0', intensity: 3.4}} />
		<Layer name="bg">
			<Room wall="#F0D9B8" side="#E4CBA8" floor={['#C7A27E', '#D0AC88']} tile={0.8} windows={[{x: -2.2, y: 1.7, w: 2.0, h: 1.4}]} sky="day" glow={{color: '#FFF0D0', opacity: 0.32}} />
			<Shelf at={[2.2, 1.0, -2.86]} w={2.4} items={[RED, TEAL, '#FFD27A', '#E8A0B0', TEAL, RED, '#FFD27A']} />
			<Shelf at={[2.2, 1.6, -2.86]} w={2.4} items={['#E8A0B0', '#FFD27A', TEAL, CREAM, RED]} />
			{[[0.3, 2.1, '#FFD27A'], [1.1, 2.3, TEAL], [3.4, 2.2, '#E8A0B0']].map(([x, y, c]) => (
				<Picture key={x as number} at={[x as number, y as number, -2.98]} size={[0.5, 0.4]} color={c as string} />
			))}
			<Plant at={[-4.2, 0, -2.4]} s={1.0} leaf="#7FB8A4" pot="#E8A0B0" />
		</Layer>
		<Layer name="mid">
			{/* A rug, toy blocks and a ball. */}
			<Solid shape="cylinder" size={[1.5, 0.012]} position={[0.1, 0.006, 0.2]} color="#E8B7A8" cast={false} roughness={1} />
			{[[1.2, 0.09, -0.3, RED], [1.38, 0.09, -0.24, TEAL], [1.29, 0.27, -0.27, '#FFD27A'], [-1.4, 0.09, -0.5, '#E8A0B0']].map(([x, y, z, c]) => (
				<Solid key={`${x}${y}`} size={[0.18, 0.18, 0.18]} position={[x as number, y as number, z as number]} color={c as string} bevel={0.025} />
			))}
			<Solid shape="sphere" size={[0.16]} position={[-1.0, 0.16, 0.5]} color={TEAL} roughness={0.4} />
		</Layer>
		<Layer name="fg">
			<Solid size={[0.9, 0.5, 0.5]} position={[2.6, 0.25, 2.6]} color="#C98F52" bevel={0.04} />
			<Solid shape="sphere" size={[0.3]} position={[-2.5, 0.3, 2.8]} color="#E8A0B0" roughness={0.5} />
		</Layer>
	</>
);

export const CORRIDOR_CHAIRS = [-0.6, 0.05, 0.7, 1.35];

/** A hospital corridor at night: a row of plastic chairs, a long empty floor. */
export const Corridor: React.FC = () => (
	<>
		<Lights sky="#DCE6F2" ground="#9DA8B4" ambient={1.0} fills={[{at: [0, 2.9, -0.5], color: '#EAF3FF', intensity: 16, distance: 9}, {at: [-4.2, 1.6, -1.6], color: '#9FD0FF', intensity: 6, distance: 5}]} />
		<Layer name="bg">
			<Room width={16} wall="#B8C4CC" side="#A9B5BE" floor={['#8C9AA6', '#94A2AE']} tile={0.7} backZ={-2.2} height={3.4} />
			{/* A handrail, doors and a noticeboard along the wall. */}
			<Solid size={[14, 0.06, 0.06]} position={[0, 0.95, -2.12]} color="#8C9AA6" cast={false} />
			<Solid size={[14, 0.5, 0.02]} position={[0, 0.3, -2.18]} color="#9EABB6" cast={false} />
			<Door at={[-3.0, 0, -2.16]} color="#D6DEE4" />
			<Door at={[3.6, 0, -2.16]} color="#D6DEE4" />
			<Picture at={[0.4, 1.9, -2.18]} size={[1.3, 0.8]} color="#D6DEE4" frame="#8C9AA6" />
			<Solid shape="cylinder" size={[0.2, 0.04]} rotation={[Math.PI / 2, 0, 0]} position={[2.2, 2.5, -2.17]} color={CREAM} cast={false} />
			{/* A vending machine glowing at the far end. */}
			<Solid size={[0.9, 1.9, 0.7]} position={[-4.6, 0.95, -1.8]} color="#3D4A60" bevel={0.03} />
			<Solid size={[0.6, 1.1, 0.02]} position={[-4.6, 1.2, -1.44]} color="#9FD0FF" emissive="#9FD0FF" emissiveIntensity={1.2} cast={false} />
			<Glow at={[-4.6, 1.2, -1.2]} size={[2.6, 3]} color="#9FD0FF" opacity={0.35} />
			{/* Ceiling lights. */}
			{[-4, 0, 4].map((x) => (
				<React.Fragment key={x}>
					<Solid size={[1.4, 0.05, 0.3]} position={[x, 3.36, -0.8]} color="#FFFFFF" emissive="#F2F7FF" emissiveIntensity={1.5} cast={false} />
					<Glow at={[x, 3.2, -0.6]} size={[3.6, 1.5]} color="#EAF3FF" opacity={0.3} />
				</React.Fragment>
			))}
		</Layer>
		<Layer name="mid">
			{/* The row of plastic chairs, bolted to one rail. */}
			<Solid size={[2.7, 0.05, 0.08]} position={[0.37, 0.36, -1.2]} color="#6F7C88" />
			{[-0.9, 1.65].map((x) => <Solid key={x} size={[0.06, 0.36, 0.4]} position={[x, 0.18, -1.2]} color="#6F7C88" />)}
			{CORRIDOR_CHAIRS.map((x) => (
				<React.Fragment key={x}>
					<Solid size={[0.52, 0.06, 0.46]} position={[x, 0.46, -1.15]} color="#7FA6C4" bevel={0.03} roughness={0.4} />
					<Solid size={[0.52, 0.5, 0.05]} position={[x, 0.78, -1.4]} color="#7FA6C4" bevel={0.025} roughness={0.4} />
				</React.Fragment>
			))}
		</Layer>
		<Layer name="fg">
			<Solid size={[0.4, 3.4, 0.3]} position={[-3.0, 1.7, 3.0]} color="#3A4654" bevel={0.02} />
			<Solid size={[1.0, 0.9, 0.5]} position={[3.2, 0.45, 2.7]} color="#46525F" bevel={0.04} />
		</Layer>
	</>
);
