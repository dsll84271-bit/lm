import React from 'react';
import {C} from '../brand/colours';
import {AlarmClock} from './props';

// Dex's bedroom, drawn to fill 1920 x 1080. Bed on the left with the pillow at
// the right end, bedside table, window with red curtains, shelf, tall mirror.

export const BEDROOM = {
	pillow: [735, 545] as const,
	clock: [985, 560] as const,
	slippers: [1170, 800] as const,
	floorY: 745,
	bedTop: 560,
	mirror: [1645, 430] as const,
};

const OUT = 6;

export const Window: React.FC<{x: number; y: number; w: number; h: number; night?: boolean}> = ({x, y, w, h, night}) => (
	<g>
		<defs>
			<linearGradient id={night ? 'skyN' : 'skyD'} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={night ? '#1C2350' : C.skyTop} />
				<stop offset="100%" stopColor={night ? '#3A3F7A' : C.skyBottom} />
			</linearGradient>
		</defs>
		<rect x={x} y={y} width={w} height={h} rx={10} fill={`url(#${night ? 'skyN' : 'skyD'})`} />
		{[0.08, 0.3, 0.52, 0.72].map((f, i) => (
			<rect key={i} x={x + w * f} y={y + h * (0.48 - (i % 2) * 0.12)} width={w * 0.16} height={h} fill={night ? '#2A2F62' : '#9D86C2'} opacity={0.55} />
		))}
		{night ? [0.2, 0.5, 0.8].map((f) => <circle key={f} cx={x + w * f} cy={y + h * 0.18} r={3} fill="#fff" />) : null}
		<rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={C.white} strokeWidth={18} />
		<rect x={x - 9} y={y - 9} width={w + 18} height={h + 18} rx={14} fill="none" stroke={C.ink} strokeWidth={OUT} />
		<path d={`M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h * 0.45} L${x + w} ${y + h * 0.45}`} stroke={C.white} strokeWidth={14} />
		<path d={`M${x + w * 0.12} ${y + h * 0.35} L${x + w * 0.3} ${y + h * 0.1}`} stroke="#fff" strokeWidth={8} opacity={0.6} strokeLinecap="round" />
		<rect x={x - 30} y={y + h + 4} width={w + 60} height={20} rx={6} fill={C.white} stroke={C.ink} strokeWidth={OUT} />
	</g>
);

export const Curtains: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
	<g fill={C.curtain} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
		<path d={`M${x - 70} ${y - 20} L${x + 40} ${y - 20} Q${x + 10} ${y + h * 0.5} ${x + 30} ${y + h + 40} L${x - 70} ${y + h + 40} Z`} />
		<path d={`M${x + w + 70} ${y - 20} L${x + w - 40} ${y - 20} Q${x + w - 10} ${y + h * 0.5} ${x + w - 30} ${y + h + 40} L${x + w + 70} ${y + h + 40} Z`} />
		<rect x={x - 90} y={y - 34} width={w + 180} height={16} rx={8} fill={C.wood} />
	</g>
);

export const Books: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g stroke={C.ink} strokeWidth={5}>
		{[C.red, C.blue, C.yellow, C.green, C.purple].map((c, i) => (
			<rect key={i} x={x + 10 + i * 30} y={y - 70 + (i % 2) * 10} width={26} height={70 - (i % 2) * 10} rx={4} fill={c} />
		))}
		<rect x={x - 10} y={y} width={190} height={16} rx={5} fill={C.wood} />
	</g>
);

export const Wall: React.FC<{color?: string; stripe?: string; floorY: number}> = ({color = C.wall, stripe = C.wallStripe, floorY}) => (
	<g>
		<rect width={1920} height={floorY} fill={color} />
		{[...Array(22)].map((_, i) => (
			<rect key={i} x={i * 90} y={0} width={44} height={floorY} fill={stripe} opacity={0.6} />
		))}
	</g>
);

export const Floor: React.FC<{y: number; color?: string; dark?: string}> = ({y, color = C.floor, dark = C.floorDark}) => (
	<g>
		<rect x={0} y={y} width={1920} height={1080 - y} fill={color} />
		{[0.18, 0.4, 0.66].map((f, i) => {
			const ly = y + (1080 - y) * f;
			return (
				<g key={i}>
					<line x1={0} y1={ly} x2={1920} y2={ly} stroke={dark} strokeWidth={5} />
					{[...Array(4)].map((_, j) => (
						<line key={j} x1={(j * 560 + i * 230) % 1920} y1={ly} x2={(j * 560 + i * 230) % 1920} y2={ly + (1080 - y) * 0.22} stroke={dark} strokeWidth={5} />
					))}
				</g>
			);
		})}
		<rect x={0} y={y - 26} width={1920} height={28} fill={C.white} stroke={C.ink} strokeWidth={OUT} />
	</g>
);

export const Slippers: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		{[-50, 50].map((dx) => (
			<g key={dx}>
				<ellipse cx={dx} cy={0} rx={52} ry={22} fill={C.slipper} stroke={C.ink} strokeWidth={OUT} />
				<path d={`M${dx - 36} -6 Q${dx} -26 ${dx + 36} -6`} stroke={C.slipperDark} strokeWidth={7} fill="none" />
				<circle cx={dx + 22} cy={-16} r={10} fill={C.white} stroke={C.ink} strokeWidth={4} />
			</g>
		))}
	</g>
);

export const Bedroom: React.FC<{frame: number; night?: boolean; ringing?: boolean; slippers?: boolean; dexAsleep?: React.ReactNode}> = ({
	frame,
	night = false,
	ringing = false,
	slippers = true,
	dexAsleep,
}) => {
	const F = BEDROOM.floorY;
	return (
		<g>
			<Wall floorY={F} />
			<Floor y={F} />
			<Curtains x={800} y={70} w={400} h={300} />
			<Window x={800} y={70} w={400} h={300} night={night} />
			<Books x={1300} y={330} />
			{/* mirror */}
			<g>
				<rect x={1520} y={130} width={250} height={600} rx={16} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
				<rect x={1544} y={154} width={202} height={552} rx={8} fill={C.glass} stroke={C.ink} strokeWidth={4} />
				<path d="M1600 300 L1700 180 M1580 460 L1720 290 M1640 620 L1730 510" stroke="#fff" strokeWidth={10} opacity={0.65} strokeLinecap="round" />
			</g>
			{/* bed */}
			<g stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
				<rect x={128} y={500} width={46} height={250} rx={14} fill={C.wood} />
				<rect x={820} y={430} width={52} height={320} rx={16} fill={C.wood} />
				<rect x={150} y={640} width={690} height={70} rx={10} fill={C.woodLight} />
				<rect x={160} y={560} width={670} height={90} rx={20} fill={C.white} />
				<rect x={640} y={512} width={176} height={70} rx={30} fill={C.white} />
				<path d="M660 540 Q730 528 800 540" stroke="#DDE3EE" strokeWidth={6} fill="none" />
				{dexAsleep}
				<path d="M150 570 Q380 548 640 572 L650 668 Q400 690 150 672 Z" fill={C.duvet} />
				<path d="M210 610 Q400 596 600 616" stroke={C.duvetDark} strokeWidth={6} fill="none" />
			</g>
			{/* bedside table */}
			<g stroke={C.ink} strokeWidth={OUT}>
				<rect x={890} y={570} width={190} height={175} rx={10} fill={C.wood} />
				<rect x={910} y={600} width={150} height={52} rx={8} fill={C.woodLight} />
				<circle cx={985} cy={626} r={6} fill={C.ink} />
			</g>
			<AlarmClock x={BEDROOM.clock[0]} y={BEDROOM.clock[1] + 10} s={0.55} frame={frame} ringing={ringing} />
			{slippers ? <Slippers x={BEDROOM.slippers[0]} y={BEDROOM.slippers[1]} /> : null}
			{night ? <rect width={1920} height={1080} fill="#1B2366" opacity={0.42} /> : null}
		</g>
	);
};
