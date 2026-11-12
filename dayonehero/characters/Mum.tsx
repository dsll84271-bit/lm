import React from 'react';
import {C} from '../brand/colours';

// Mum: blonde bun, red cardigan, blue slippers, like Day 4.
// Drawn 560 units tall with her feet at (0, 0).

export type MumFace = 'happy' | 'call' | 'look' | 'found';

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
}> = ({x, y, size, face = 'happy', talk = 0, flip = false, calling = false, walk, look = 0}) => {
	const k = size / 560;
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2);
	const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk * Math.PI * 2)) * 8;
	const arm = (side: 1 | -1) => {
		const sx = 56 * side;
		const pts = calling ? `M${sx} -360 L${sx + 30 * side} -300 L${18 * side} -420` : `M${sx} -360 L${sx + 14 * side} -270 L${sx + 10 * side} -200`;
		const hand = calling ? [18 * side, -420] : [sx + 10 * side, -196];
		return (
			<g key={side}>
				<path d={pts} stroke={C.ink} strokeWidth={36 + OUT * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<path d={pts} stroke={C.mumTop} strokeWidth={36} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<circle cx={hand[0]} cy={hand[1]} r={15} fill={C.skin} stroke={C.ink} strokeWidth={OUT - 1} />
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
				<path d="M-62 -380 Q0 -394 62 -380 L72 -190 Q72 -176 58 -176 L-58 -176 Q-72 -176 -72 -190 Z" fill={C.mumTop} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
				<path d="M-22 -384 L0 -300 L22 -384 Z" fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
				<path d="M0 -300 L0 -180" stroke="#B9302A" strokeWidth={5} />
				{[-250, -215].map((by) => (
					<circle key={by} cx={-8} cy={by} r={5} fill={C.white} stroke={C.ink} strokeWidth={3} />
				))}
				{arm(-1)}
				{arm(1)}
				{/* head */}
				<circle cx={0} cy={-560} r={36} fill={C.mumHair} stroke={C.ink} strokeWidth={OUT} />
				<circle cx={0} cy={-470} r={86} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
				<path d="M-88 -470 Q-92 -560 0 -562 Q92 -560 88 -470 Q70 -520 20 -518 Q-10 -496 -40 -514 Q-70 -510 -88 -470 Z" fill={C.mumHair} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
				<path d="M-30 -540 Q0 -552 34 -536" stroke="#F8DE97" strokeWidth={7} fill="none" strokeLinecap="round" />
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
				{face === 'call' || talk > 0.05 || face === 'found' ? (
					<ellipse cx={0} cy={-418} rx={face === 'found' ? 20 : 13} ry={6 + 14 * Math.max(talk, face === 'call' ? 0.8 : 0.6)} fill="#8E2A3A" stroke={C.ink} strokeWidth={5} />
				) : (
					<path d="M-16 -424 Q0 -408 16 -424" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
				)}
			</g>
		</g>
	);
};
