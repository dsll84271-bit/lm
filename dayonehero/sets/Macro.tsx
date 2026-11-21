import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../brand/colours';
import {Cam, Svg} from '../components/ui';

// Close-ups at Dex's size: the room behind is blown up and blurred, and the
// surface he stands on is drawn big and sharp in front.

/** A set, blown up and out of focus, centred on (x, y). */
export const Behind: React.FC<{x: number; y: number; zoom: number; blur?: number; children: React.ReactNode}> = ({x, y, zoom, blur = 16, children}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<Cam x={x} y={y} zoom={zoom} blur={blur / zoom}>
			<Svg>{children}</Svg>
		</Cam>
	</AbsoluteFill>
);

/** A big wooden surface (floor or table) from `top` down to the bottom of the screen. */
export const Wood: React.FC<{top: number; shift?: number; color?: string; dark?: string; edge?: boolean}> = ({top, shift = 0, color = C.floor, dark = C.floorDark, edge = true}) => {
	const lines = [];
	for (let i = 0; i < 7; i++) {
		const y = top + 40 + i * 52 + i * i * 6;
		lines.push(<path key={i} d={`M-100 ${y} Q500 ${y - 10} 960 ${y + 4} T2020 ${y - 6}`} stroke={dark} strokeWidth={4 + i} fill="none" opacity={0.5} />);
	}
	const joints = [];
	for (let j = 0; j < 4; j++) {
		const x = ((j * 700 - shift) % 2800 + 2800) % 2800 - 400;
		joints.push(<line key={j} x1={x} y1={top} x2={x - 60} y2={1080} stroke={dark} strokeWidth={8} />);
	}
	return (
		<Svg>
			<rect x={0} y={top} width={1920} height={1080 - top} fill={color} />
			{lines}
			{joints}
			{edge ? <rect x={0} y={top - 6} width={1920} height={14} fill="#E2AE78" stroke={C.ink} strokeWidth={6} /> : null}
		</Svg>
	);
};

/** The top of the pillow, a soft white hill. */
export const PillowTop: React.FC<{top: number}> = ({top}) => (
	<Svg>
		<path d={`M-50 1100 L-50 ${top + 80} Q300 ${top - 30} 960 ${top} Q1600 ${top + 20} 1970 ${top + 120} L1970 1100 Z`} fill="#FFFFFF" stroke={C.ink} strokeWidth={8} />
		<path d={`M200 ${top + 150} Q700 ${top + 90} 1200 ${top + 160}`} stroke="#E3E8F1" strokeWidth={16} fill="none" strokeLinecap="round" />
		<path d={`M900 ${top + 300} Q1300 ${top + 250} 1750 ${top + 320}`} stroke="#E3E8F1" strokeWidth={16} fill="none" strokeLinecap="round" />
		<path d={`M-50 ${top + 360} Q600 ${top + 330} 1970 ${top + 420} L1970 1100 L-50 1100 Z`} fill="#EEF1F7" />
	</Svg>
);

/** The side of the duvet, for the fall: a tall blue wall that scrolls up. */
export const DuvetWall: React.FC<{scroll: number}> = ({scroll}) => {
	const stitches = [];
	for (let i = -1; i < 8; i++) {
		const y = ((i * 260 - scroll) % 2080 + 2080) % 2080 - 200;
		stitches.push(<path key={i} d={`M0 ${y} Q300 ${y + 30} 640 ${y}`} stroke={C.duvetDark} strokeWidth={10} strokeDasharray="30 22" fill="none" />);
	}
	return (
		<Svg>
			<path d="M-20 -20 L620 -20 Q700 540 640 1100 L-20 1100 Z" fill={C.duvet} stroke={C.ink} strokeWidth={10} />
			{stitches}
			<path d="M560 -20 Q630 540 580 1100" stroke="#8DBBF4" strokeWidth={24} fill="none" opacity={0.6} />
		</Svg>
	);
};
