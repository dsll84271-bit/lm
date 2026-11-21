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

export type Decor = 'bedroom' | 'kitchen' | 'classroom' | 'gym' | 'lunch' | 'studio' | 'lab' | 'clinic' | 'gamer' | 'none';

/** Things on the walls and at the edges of a room, so it never looks empty. */
const RoomDecor: React.FC<{decor: Decor; look: RoomLook}> = ({decor, look}) => {
	const shelf = (x: number, y: number, items: string[]) => (
		<g stroke={INK} strokeWidth={5}>
			{items.map((c, i) => (
				<rect key={i} x={x + 12 + i * 34} y={y - 70 + (i % 3) * 12} width={28} height={70 - (i % 3) * 12} rx={4} fill={c} />
			))}
			<rect x={x} y={y} width={items.length * 34 + 24} height={14} rx={4} fill="#8A5A3E" />
		</g>
	);
	const poster = (x: number, y: number, w: number, h: number, a: string, b: string) => (
		<g stroke={INK} strokeWidth={5}>
			<rect x={x} y={y} width={w} height={h} rx={6} fill={a} transform={`rotate(-2 ${x} ${y})`} />
			<circle cx={x + w / 2} cy={y + h * 0.42} r={Math.min(w, h) * 0.25} fill={b} stroke="none" />
			<rect x={x + w * 0.2} y={y + h * 0.75} width={w * 0.6} height={10} rx={5} fill={b} stroke="none" />
		</g>
	);
	const plant = (x: number) => (
		<g stroke={INK} strokeWidth={5}>
			{[-40, -15, 10, 35].map((dx, i) => (
				<ellipse key={i} cx={x + dx} cy={GROUND - 200 - (i % 2) * 40} rx={26} ry={70} fill={i % 2 ? '#2EA86A' : '#3FC07C'} transform={`rotate(${dx} ${x + dx} ${GROUND - 140})`} />
			))}
			<path d={`M${x - 55} ${GROUND - 130} L${x + 55} ${GROUND - 130} L${x + 40} ${GROUND} L${x - 40} ${GROUND} Z`} fill="#D9644A" />
		</g>
	);
	const clock = (x: number, y: number) => (
		<g stroke={INK} strokeWidth={6}>
			<circle cx={x} cy={y} r={52} fill="#fff" />
			<path d={`M${x} ${y} L${x} ${y - 34} M${x} ${y} L${x + 24} ${y + 8}`} strokeLinecap="round" />
		</g>
	);
	switch (decor) {
		case 'bedroom':
			return (
				<g>
					{poster(120, 220, 170, 230, '#FF8A3D', '#FFD84A')}
					{shelf(1620, 420, ['#E8453C', '#3FB7E8', '#FFD84A', '#7CF2A0', '#C9A6FF'])}
					{plant(1820)}
					<ellipse cx={960} cy={GROUND + 120} rx={620} ry={70} fill="#FF8A3D" opacity={0.25} />
				</g>
			);
		case 'kitchen':
			return (
				<g stroke={INK} strokeWidth={6}>
					{[...Array(7)].map((_, i) => (
						<rect key={i} x={620 + i * 170} y={150} width={160} height={200} rx={8} fill={look.trim ?? '#fff'} />
					))}
					{[...Array(26)].map((_, i) => (
						<rect key={`t${i}`} x={620 + (i % 13) * 92} y={390 + Math.floor(i / 13) * 60} width={86} height={54} fill="#fff" opacity={0.35} strokeWidth={2} />
					))}
					<rect x={1700} y={GROUND - 620} width={240} height={620} rx={14} fill="#E8EEF6" />
					<line x1={1700} y1={GROUND - 380} x2={1940} y2={GROUND - 380} />
					{plant(120)}
				</g>
			);
		case 'classroom':
			return (
				<g>
					{clock(1560, 220)}
					{poster(150, 230, 200, 150, '#7CF2A0', '#3FB7E8')}
					{poster(1700, 300, 160, 200, '#C9A6FF', '#FF8A3D')}
					{shelf(80, 640, ['#E8453C', '#3FB7E8', '#FFD84A', '#7CF2A0', '#C9A6FF', '#FF8A3D'])}
				</g>
			);
		case 'gym':
			return (
				<g stroke={INK} strokeWidth={6}>
					{[...Array(9)].map((_, i) => (
						<rect key={i} x={i * 240 - 120} y={GROUND - 260} width={220} height={230} rx={12} fill="#2E4A9E" />
					))}
					{[...Array(5)].map((_, i) => (
						<rect key={`w${i}`} x={i * 420 + 40} y={60} width={300} height={110} rx={8} fill="#BFE3FA" />
					))}
					<rect x={1620} y={260} width={180} height={120} rx={6} fill="#fff" />
					<circle cx={1710} cy={420} r={50} fill="none" stroke="#FF8A3D" strokeWidth={10} />
				</g>
			);
		case 'lunch':
			return (
				<g stroke={INK} strokeWidth={6}>
					<rect x={120} y={200} width={420} height={240} rx={14} fill="#2A2350" />
					{[0, 1, 2, 3].map((i) => (
						<rect key={i} x={160} y={240 + i * 46} width={260 - (i % 2) * 80} height={18} rx={9} fill="#FFD84A" stroke="none" />
					))}
					<rect x={1680} y={GROUND - 560} width={220} height={560} rx={12} fill="#E8453C" />
					<rect x={1710} y={GROUND - 520} width={160} height={300} rx={8} fill="#BFE3FA" />
					{poster(1300, 220, 180, 200, '#7CF2A0', '#FF8A3D')}
				</g>
			);
		case 'studio':
			return (
				<g stroke={INK} strokeWidth={6}>
					<rect x={560} y={150} width={800} height={380} rx={20} fill="#120C30" />
					<rect x={580} y={170} width={760} height={340} rx={12} fill="#7F5AF0" opacity={0.8} />
					<text x={960} y={370} fontFamily="Fredoka" fontWeight={700} fontSize={90} fill="#fff" textAnchor="middle" stroke="none">
						MORNING LIVE
					</text>
					{[...Array(12)].map((_, i) => (
						<circle key={i} cx={100 + i * 160} cy={60} r={18} fill="#FFE7A8" />
					))}
				</g>
			);
		case 'lab':
			return (
				<g stroke={INK} strokeWidth={5}>
					{shelf(1500, 330, ['#BFE8FF', '#7CF2A0', '#BFE8FF', '#FFD84A', '#BFE8FF'])}
					{shelf(1500, 500, ['#C9A6FF', '#BFE8FF', '#FF8A3D', '#BFE8FF'])}
					<rect x={120} y={200} width={300} height={220} rx={8} fill="#fff" />
					{[...Array(18)].map((_, i) => (
						<rect key={i} x={135 + (i % 6) * 46} y={215 + Math.floor(i / 6) * 64} width={40} height={56} fill={['#FFB0C8', '#BFE8FF', '#FFE08A'][i % 3]} strokeWidth={2} />
					))}
				</g>
			);
		case 'clinic':
			return (
				<g stroke={INK} strokeWidth={5}>
					<rect x={160} y={200} width={200} height={300} rx={8} fill="#fff" />
					{['E', 'F P', 'T O Z', 'L P E D'].map((t, i) => (
						<text key={t} x={260} y={260 + i * 60} fontFamily="Fredoka" fontWeight={700} fontSize={50 - i * 9} fill={INK} textAnchor="middle" stroke="none">
							{t}
						</text>
					))}
					<rect x={1650} y={GROUND - 420} width={240} height={420} rx={10} fill="#E8EEF6" />
					{plant(1520)}
				</g>
			);
		case 'gamer':
			return (
				<g>
					<rect x={-400} y={130} width={2720} height={10} fill="#FF4FD8" opacity={0.8} />
					<rect x={-400} y={130} width={2720} height={60} fill="#FF4FD8" opacity={0.12} />
					{poster(140, 230, 190, 260, '#3FB7E8', '#FF4FD8')}
					{poster(1640, 250, 210, 160, '#FF8A3D', '#7F5AF0')}
					{shelf(1600, 560, ['#7CF2A0', '#FF4FD8', '#FFD84A', '#3FB7E8'])}
				</g>
			);
		default:
			return null;
	}
};

export const Room: React.FC<{look: RoomLook; window?: {x: number; w: number; night?: boolean}; decor?: Decor; children?: React.ReactNode}> = ({look, window, decor = 'none', children}) => (
	<g>
		<defs>
			<linearGradient id={`wall${look.wall}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={look.wallDark} />
				<stop offset="100%" stopColor={look.wall} />
			</linearGradient>
			<linearGradient id={`floor${look.floor}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={look.floorDark} />
				<stop offset="100%" stopColor={look.floor} />
			</linearGradient>
			<linearGradient id="ao" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="#000" stopOpacity={0} />
				<stop offset="100%" stopColor="#000" stopOpacity={0.28} />
			</linearGradient>
		</defs>
		<rect x={-400} y={-400} width={2720} height={GROUND + 400} fill={`url(#wall${look.wall})`} />
		{[...Array(16)].map((_, i) => (
			<rect key={i} x={i * 180 - 400} y={-400} width={6} height={GROUND + 400} fill="#000" opacity={0.05} />
		))}
		<rect x={-400} y={86} width={2720} height={18} fill={look.trim ?? '#fff'} opacity={0.6} />
		{window ? (
			<g>
				{!window.night ? <path d={`M${window.x} 170 L${window.x + window.w} 170 L${window.x + window.w + 380} ${GROUND + 200} L${window.x + 160} ${GROUND + 200} Z`} fill="#FFF3C4" opacity={0.14} /> : <path d={`M${window.x} 170 L${window.x + window.w} 170 L${window.x + window.w + 260} ${GROUND + 160} L${window.x + 120} ${GROUND + 160} Z`} fill="#8FA8FF" opacity={0.08} />}
				<g stroke={INK} strokeWidth={8}>
					<rect x={window.x - 16} y={154} width={window.w + 32} height={412} rx={14} fill={look.trim ?? '#fff'} />
					<rect x={window.x} y={170} width={window.w} height={380} rx={8} fill={window.night ? '#1C1850' : '#BFE3FA'} />
					{window.night ? [...Array(8)].map((_, i) => <circle key={i} cx={window.x + 30 + ((i * 97) % (window.w - 60))} cy={200 + ((i * 61) % 200)} r={3} fill="#fff" stroke="none" />) : <path d={`M${window.x + 30} 330 L${window.x + 120} 200`} stroke="#fff" strokeWidth={14} opacity={0.6} />}
					<line x1={window.x + window.w / 2} y1={170} x2={window.x + window.w / 2} y2={550} />
					<line x1={window.x} y1={360} x2={window.x + window.w} y2={360} />
					<rect x={window.x - 30} y={548} width={window.w + 60} height={24} rx={6} fill={look.trim ?? '#fff'} />
				</g>
				<path d={`M${window.x - 70} 130 Q${window.x - 30} 360 ${window.x - 60} 600 L${window.x - 10} 600 Q${window.x + 10} 360 ${window.x - 10} 130 Z`} fill="#7F5AF0" stroke={INK} strokeWidth={6} opacity={0.9} />
				<path d={`M${window.x + window.w + 70} 130 Q${window.x + window.w + 30} 360 ${window.x + window.w + 60} 600 L${window.x + window.w + 10} 600 Q${window.x + window.w - 10} 360 ${window.x + window.w + 10} 130 Z`} fill="#7F5AF0" stroke={INK} strokeWidth={6} opacity={0.9} />
			</g>
		) : null}
		<RoomDecor decor={decor} look={look} />
		<rect x={-400} y={GROUND - 120} width={2720} height={120} fill="url(#ao)" />
		<rect x={-400} y={GROUND - 30} width={2720} height={34} fill={look.trim ?? '#fff'} stroke={INK} strokeWidth={6} />
		<rect x={-400} y={GROUND} width={2720} height={600} fill={`url(#floor${look.floor})`} />
		{[...Array(14)].map((_, i) => (
			<line key={i} x1={i * 200 - 400} y1={GROUND} x2={i * 200 - 500} y2={GROUND + 600} stroke={look.floorDark} strokeWidth={6} />
		))}
		<ellipse cx={960} cy={GROUND + 60} rx={900} ry={40} fill="#fff" opacity={0.06} />
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
