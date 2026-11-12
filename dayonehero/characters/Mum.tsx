import React from 'react';
import {C} from '../brand/colours';

// Mum: blonde bun, red cardigan, blue slippers, like Day 4.
// Drawn 560 units tall with her feet at (0, 0).

export type MumFace = 'happy' | 'call' | 'look' | 'found' | 'sad';

/** Colours, so the same body can be another grown-up (Mrs Patel). */
export type Grownup = {hair: string; top: string; topDark: string; skin: string; glasses?: boolean; shine: string};
export const MUM_LOOK: Grownup = {hair: C.mumHair, top: C.mumTop, topDark: '#B9302A', skin: C.skin, shine: '#F8DE97'};
export const PATEL_LOOK: Grownup = {hair: '#2B2230', top: '#2A9D8F', topDark: '#1F7A6F', skin: '#D9A07A', glasses: true, shine: '#5A5068'};

const OUT = 7;

export const Mum: React.FC<{
	x: number;
	y: number;
	size: number;
	face?: MumFace;
	talk?: number;
	flip?: boolean;
	/** Hands cupped round the mouth, calling. */
	calling?: boolean;
	walk?: number;
	look?: number;
	who?: Grownup;
	/** One hand held out low, palm up (holding something). */
	holding?: boolean;
}> = ({x, y, size, face = 'happy', talk = 0, flip = false, calling = false, walk, look = 0, who = MUM_LOOK, holding = false}) => {
	const k = size / 560;
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2);
	const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk * Math.PI * 2)) * 8;
	const arm = (side: 1 | -1) => {
		const sx = 56 * side;
		const hold = holding && side === 1;
		const pts = calling ? `M${sx} -360 L${sx + 30 * side} -300 L${18 * side} -420` : hold ? `M${sx} -360 L${sx + 20} -280 L${sx + 90} -270` : `M${sx} -360 L${sx + 14 * side} -270 L${sx + 10 * side} -200`;
		const hand = calling ? [18 * side, -420] : hold ? [sx + 100, -270] : [sx + 10 * side, -196];
		return (
			<g key={side}>
				<path d={pts} stroke={C.ink} strokeWidth={36 + OUT * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<path d={pts} stroke={who.top} strokeWidth={36} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<circle cx={hand[0]} cy={hand[1]} r={15} fill={who.skin} stroke={C.ink} strokeWidth={OUT - 1} />
			</g>
		);
	};
	const eyesOpen = face !== 'happy';
	const lx = look * 6;
	return (
		<g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * k} ${k})`}>
			<ellipse cx={0} cy={-2} rx={86} ry={13} fill="rgba(42,37,70,0.18)" />
			<g transform={`translate(0 ${-bob})`}>
				<rect x={-40 - w * 16} y={-190} width={34} height={170} rx={12} fill={C.legs} stroke={C.ink} strokeWidth={OUT - 1} />
				<rect x={6 + w * 16} y={-190} width={34} height={170} rx={12} fill={C.legs} stroke={C.ink} strokeWidth={OUT - 1} />
				{[-26 - w * 16, 26 + w * 16].map((sx, i) => (
					<g key={i}>
						<ellipse cx={sx} cy={-16} rx={40} ry={17} fill={C.slipper} stroke={C.ink} strokeWidth={OUT - 1} />
						<circle cx={sx + (i ? 12 : -12)} cy={-30} r={8} fill={C.white} stroke={C.ink} strokeWidth={4} />
					</g>
				))}
				<path d="M-62 -380 Q0 -394 62 -380 L72 -190 Q72 -176 58 -176 L-58 -176 Q-72 -176 -72 -190 Z" fill={who.top} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
				<path d="M-22 -384 L0 -300 L22 -384 Z" fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
				<path d="M0 -300 L0 -180" stroke={who.topDark} strokeWidth={5} />
				{[-250, -215].map((by) => (
					<circle key={by} cx={-8} cy={by} r={5} fill={C.white} stroke={C.ink} strokeWidth={3} />
				))}
				{arm(-1)}
				{arm(1)}
				{/* head */}
				<circle cx={0} cy={-560} r={36} fill={who.hair} stroke={C.ink} strokeWidth={OUT} />
				<circle cx={0} cy={-470} r={86} fill={who.skin} stroke={C.ink} strokeWidth={OUT} />
				<path d="M-88 -470 Q-92 -560 0 -562 Q92 -560 88 -470 Q70 -520 20 -518 Q-10 -496 -40 -514 Q-70 -510 -88 -470 Z" fill={who.hair} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
				<path d="M-30 -540 Q0 -552 34 -536" stroke={who.shine} strokeWidth={7} fill="none" strokeLinecap="round" />
				<ellipse cx={-52} cy={-432} rx={16} ry={10} fill={C.cheek} />
				<ellipse cx={52} cy={-432} rx={16} ry={10} fill={C.cheek} />
				{eyesOpen ? (
					<g>
						<ellipse cx={-30 + lx} cy={-462} rx={10} ry={13} fill={C.ink} />
						<ellipse cx={30 + lx} cy={-462} rx={10} ry={13} fill={C.ink} />
						<circle cx={-27 + lx} cy={-466} r={3.5} fill={C.white} />
						<circle cx={33 + lx} cy={-466} r={3.5} fill={C.white} />
					</g>
				) : (
					<g stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round">
						<path d="M-44 -458 Q-30 -474 -16 -458" />
						<path d="M16 -458 Q30 -474 44 -458" />
					</g>
				)}
				{who.glasses ? (
					<g fill="rgba(255,255,255,0.25)" stroke={C.ink} strokeWidth={6}>
						<circle cx={-30} cy={-462} r={26} />
						<circle cx={30} cy={-462} r={26} />
						<path d="M-4 -464 L4 -464" />
					</g>
				) : null}
				{face === 'sad' ? (
					<g>
						<path d="M-16 -414 Q0 -430 16 -414" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
						<path d="M-44 -440 Q-48 -424 -44 -416" stroke="#7FC4EE" strokeWidth={8} fill="none" strokeLinecap="round" />
					</g>
				) : face === 'call' || talk > 0.05 || face === 'found' ? (
					<ellipse cx={0} cy={-418} rx={face === 'found' ? 20 : 13} ry={6 + 14 * Math.max(talk, face === 'call' ? 0.8 : 0.6)} fill="#8E2A3A" stroke={C.ink} strokeWidth={5} />
				) : (
					<path d="M-16 -424 Q0 -408 16 -424" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
				)}
			</g>
		</g>
	);
};
