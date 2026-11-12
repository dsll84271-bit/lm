import React from 'react';
import {GROUND} from './outdoor';

// Indoor sets: a room generator and the furniture that goes in them.

const INK = '#140A28';

export type RoomLook = {wall: string; wallDark: string; floor: string; floorDark: string; trim?: string};

export const ROOMS = {
	bedroomNight: {wall: '#3B2E7A', wallDark: '#2A2060', floor: '#5A3E6A', floorDark: '#4A3058', trim: '#6A5AB0'},
	bedroomDay: {wall: '#8A7AD8', wallDark: '#6E5EC0', floor: '#B07A58', floorDark: '#94624A', trim: '#B8ACF0'},
	kitchen: {wall: '#4FA8A0', wallDark: '#3E8C86', floor: '#E8D8C0', floorDark: '#CFBEA4', trim: '#F2F2F2'},
	classroom: {wall: '#F2C66E', wallDark: '#E0AE52', floor: '#A8765A', floorDark: '#8E5E46', trim: '#FFF3D6'},
	studio: {wall: '#1E1650', wallDark: '#140E38', floor: '#2A2160', floorDark: '#201852', trim: '#7F5AF0'},
	lab: {wall: '#DCE8F2', wallDark: '#C4D4E2', floor: '#AEB8C8', floorDark: '#9AA4B6', trim: '#FFFFFF'},
	clinic: {wall: '#BFE8DC', wallDark: '#A6D6C8', floor: '#D8D8E8', floorDark: '#C2C2D6', trim: '#FFFFFF'},
	gamer: {wall: '#221A4E', wallDark: '#18123A', floor: '#2E2458', floorDark: '#251C4C', trim: '#5A3FD6'},
} satisfies Record<string, RoomLook>;

export const Room: React.FC<{look: RoomLook; window?: {x: number; w: number; night?: boolean}; children?: React.ReactNode}> = ({look, window, children}) => (
	<g>
		<defs>
			<linearGradient id={`wall${look.wall}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={look.wallDark} />
				<stop offset="100%" stopColor={look.wall} />
			</linearGradient>
		</defs>
		<rect x={-400} y={-400} width={2720} height={GROUND + 400} fill={`url(#wall${look.wall})`} />
		{window ? (
			<g stroke={INK} strokeWidth={8}>
				<rect x={window.x} y={170} width={window.w} height={380} rx={10} fill={window.night ? '#1C1850' : '#BFE3FA'} />
				{window.night ? [...Array(8)].map((_, i) => <circle key={i} cx={window.x + 30 + ((i * 97) % (window.w - 60))} cy={200 + ((i * 61) % 200)} r={3} fill="#fff" stroke="none" />) : null}
				<line x1={window.x + window.w / 2} y1={170} x2={window.x + window.w / 2} y2={550} />
				<line x1={window.x} y1={360} x2={window.x + window.w} y2={360} />
				<rect x={window.x - 20} y={548} width={window.w + 40} height={22} rx={6} fill={look.trim ?? '#fff'} />
			</g>
		) : null}
		<rect x={-400} y={GROUND - 30} width={2720} height={34} fill={look.trim ?? '#fff'} stroke={INK} strokeWidth={6} />
		<rect x={-400} y={GROUND} width={2720} height={600} fill={look.floor} />
		{[...Array(14)].map((_, i) => (
			<line key={i} x1={i * 200 - 400} y1={GROUND} x2={i * 200 - 500} y2={GROUND + 600} stroke={look.floorDark} strokeWidth={6} />
		))}
		{children}
	</g>
);

export const Desk: React.FC<{x: number; w?: number; color?: string; h?: number}> = ({x, w = 520, color = '#8A5A3E', h = 240}) => (
	<g stroke={INK} strokeWidth={7}>
		<rect x={x + 20} y={GROUND - h + 30} width={30} height={h - 30} fill={color} />
		<rect x={x + w - 50} y={GROUND - h + 30} width={30} height={h - 30} fill={color} />
		<rect x={x} y={GROUND - h} width={w} height={36} rx={8} fill={color} />
	</g>
);

export const Monitor: React.FC<{x: number; y: number; w?: number; glow?: string; children?: React.ReactNode}> = ({x, y, w = 320, glow = '#7F5AF0', children}) => (
	<g stroke={INK} strokeWidth={7}>
		<rect x={x - 20} y={y + w * 0.56} width={40} height={60} fill="#2A2350" />
		<rect x={x - 90} y={y + w * 0.56 + 54} width={180} height={18} rx={6} fill="#2A2350" />
		<rect x={x - w / 2} y={y} width={w} height={w * 0.58} rx={12} fill="#120C30" />
		<rect x={x - w / 2 + 14} y={y + 14} width={w - 28} height={w * 0.58 - 28} rx={6} fill={glow} opacity={0.85} />
		{children}
		<ellipse cx={x} cy={y + w * 0.3} rx={w * 0.9} ry={w * 0.6} fill={glow} opacity={0.12} stroke="none" />
	</g>
);

export const Bed: React.FC<{x: number}> = ({x}) => (
	<g stroke={INK} strokeWidth={7}>
		<rect x={x} y={GROUND - 260} width={40} height={260} rx={10} fill="#6A4A8A" />
		<rect x={x + 30} y={GROUND - 150} width={560} height={110} rx={16} fill="#E8E4F8" />
		<rect x={x + 40} y={GROUND - 200} width={160} height={70} rx={30} fill="#fff" />
		<path d={`M${x + 200} ${GROUND - 160} L${x + 600} ${GROUND - 160} L${x + 600} ${GROUND - 40} L${x + 210} ${GROUND - 40} Z`} fill="#FF8A3D" />
	</g>
);

export const Board: React.FC<{x: number; w?: number; text?: string}> = ({x, w = 820, text}) => (
	<g stroke={INK} strokeWidth={8}>
		<rect x={x} y={200} width={w} height={360} rx={12} fill="#2E5A4A" />
		<rect x={x - 10} y={550} width={w + 20} height={20} fill="#C9A06A" />
		{text ? (
			<text x={x + w / 2} y={400} fontFamily="Fredoka" fontWeight={700} fontSize={64} fill="#F2F2E8" textAnchor="middle" stroke="none" opacity={0.9}>
				{text}
			</text>
		) : null}
	</g>
);

export const Stove: React.FC<{x: number; frozen?: boolean; frame: number}> = ({x, frozen = false, frame}) => (
	<g stroke={INK} strokeWidth={7}>
		<rect x={x} y={GROUND - 300} width={440} height={300} rx={10} fill="#E8E8F2" />
		<rect x={x + 30} y={GROUND - 200} width={380} height={160} rx={10} fill="#2A2350" />
		<rect x={x - 10} y={GROUND - 320} width={460} height={30} rx={8} fill="#C9CED8" />
		<path d={`M${x + 100} ${GROUND - 330} L${x + 340} ${GROUND - 330} L${x + 320} ${GROUND - 440} L${x + 120} ${GROUND - 440} Z`} fill="#8F8AA8" />
		<ellipse cx={x + 220} cy={GROUND - 440} rx={104} ry={18} fill="#9FD0FA" />
		{[...Array(9)].map((_, i) => {
			const t = frozen ? 0.5 : ((frame * 0.05 + i * 0.37) % 1);
			return <circle key={i} cx={x + 140 + ((i * 41) % 170)} cy={GROUND - 450 - t * 60} r={10 + (i % 3) * 4} fill="#E9FBFF" stroke={INK} strokeWidth={3} opacity={1 - t * 0.8} />;
		})}
		<ellipse cx={x + 220} cy={GROUND - 446} rx={30} ry={20} fill="#FFF8E8" />
	</g>
);

export const StudioLights: React.FC = () => (
	<g>
		{[200, 760, 1320, 1880].map((x, i) => (
			<g key={x}>
				<path d={`M${x} 0 L${x - 260} ${GROUND} L${x + 260} ${GROUND} Z`} fill={i % 2 ? '#FF8A3D' : '#7FE0FF'} opacity={0.1} />
				<rect x={x - 40} y={-20} width={80} height={50} rx={10} fill="#2A2350" stroke={INK} strokeWidth={5} />
			</g>
		))}
		<rect x={500} y={GROUND - 60} width={920} height={60} rx={10} fill="#7F5AF0" stroke={INK} strokeWidth={6} />
	</g>
);

export const LabBench: React.FC<{x: number}> = ({x}) => (
	<g stroke={INK} strokeWidth={7}>
		<rect x={x} y={GROUND - 250} width={700} height={250} rx={10} fill="#E8EEF6" />
		<rect x={x - 10} y={GROUND - 270} width={720} height={30} rx={8} fill="#2A2350" />
		<path d={`M${x + 120} ${GROUND - 270} L${x + 120} ${GROUND - 420} L${x + 90} ${GROUND - 420} L${x + 90} ${GROUND - 270}`} fill="#BFE8FF" />
		<rect x={x + 300} y={GROUND - 420} width={220} height={150} rx={12} fill="#120C30" />
		<path d={`M${x + 320} ${GROUND - 350} L${x + 360} ${GROUND - 350} L${x + 380} ${GROUND - 400} L${x + 400} ${GROUND - 300} L${x + 420} ${GROUND - 350} L${x + 500} ${GROUND - 350}`} stroke="#7CF2A0" strokeWidth={6} fill="none" />
	</g>
);

export const Phone: React.FC<{x: number; y: number; rot?: number; s?: number}> = ({x, y, rot = 0, s = 1}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={INK} strokeWidth={5}>
		<rect x={-34} y={-62} width={68} height={124} rx={12} fill="#2A2350" />
		<rect x={-26} y={-52} width={52} height={100} rx={6} fill="#7F5AF0" />
	</g>
);

export const Cake: React.FC<{x: number}> = ({x}) => (
	<g stroke={INK} strokeWidth={6}>
		<rect x={x - 140} y={GROUND - 330} width={280} height={110} rx={14} fill="#FFB0C8" />
		<rect x={x - 150} y={GROUND - 230} width={300} height={20} rx={8} fill="#fff" />
		{[-80, -30, 20, 70].map((dx) => (
			<g key={dx}>
				<rect x={x + dx - 6} y={GROUND - 380} width={12} height={50} fill="#7FE0FF" />
				<ellipse cx={x + dx} cy={GROUND - 392} rx={9} ry={14} fill="#FFD84A" />
			</g>
		))}
	</g>
);
