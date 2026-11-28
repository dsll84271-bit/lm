import React from 'react';
import {C} from '../brand/colours';

// Biscuit: the friendly brown dog from Day 4. Side view, facing right, about
// 600 long at s = 1, with paws on (x, y). Plus a giant face for close-ups.

const FUR = '#C98A4E';
const FUR_DARK = '#A86A34';
const MUZZLE = '#F2D2A6';
const OUT = 7;

export const Biscuit: React.FC<{x: number; y: number; s?: number; frame: number; walk?: number; flip?: boolean}> = ({x, y, s = 1, frame, walk, flip}) => {
	const w = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2);
	const wag = Math.sin(frame * 0.7) * 18;
	return (
		<g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" strokeLinecap="round">
			<ellipse cx={0} cy={-4} rx={240} ry={18} fill="rgba(42,37,70,0.18)" stroke="none" />
			<path d={`M-220 -250 Q-300 ${-330 + wag} -270 ${-390 + wag}`} fill="none" strokeWidth={30} />
			<path d={`M-220 -250 Q-300 ${-330 + wag} -270 ${-390 + wag}`} fill="none" stroke={FUR} strokeWidth={18} />
			{[
				[-170, w],
				[-120, -w],
				[110, -w],
				[160, w],
			].map(([lx, sw], i) => (
				<g key={i} transform={`rotate(${sw * 18} ${lx} -150)`}>
					<rect x={lx - 22} y={-170} width={44} height={170} rx={20} fill={i % 2 ? FUR_DARK : FUR} />
					<ellipse cx={lx + 8} cy={-6} rx={32} ry={16} fill={MUZZLE} />
				</g>
			))}
			<path d="M-250 -300 Q-250 -380 -150 -380 L120 -380 Q220 -380 220 -280 Q220 -170 120 -160 L-150 -160 Q-250 -170 -250 -300 Z" fill={FUR} />
			<path d="M-150 -200 Q0 -150 140 -200" fill="none" stroke={MUZZLE} strokeWidth={30} />
			<rect x={150} y={-420} width={70} height={40} rx={12} fill={C.red} />
			{/* head */}
			<g transform={`translate(260 -440) rotate(${Math.sin(frame * 0.1) * 4})`}>
				<path d="M-60 -60 Q-110 -40 -100 60 Q-80 90 -50 40 Z" fill={FUR_DARK} />
				<circle cx={0} cy={0} r={110} fill={FUR} />
				<path d="M40 20 Q170 10 170 70 Q150 120 60 110 Q20 100 30 50 Z" fill={MUZZLE} />
				<ellipse cx={165} cy={50} rx={24} ry={18} fill={C.ink} />
				<path d="M100 104 Q120 140 140 106" fill="#F07A86" />
				<circle cx={40} cy={-26} r={16} fill={C.ink} stroke="none" />
				<circle cx={46} cy={-32} r={6} fill="#fff" stroke="none" />
				<path d="M-40 -90 Q-10 -150 30 -100 Q0 -60 -40 -90 Z" fill={FUR_DARK} />
			</g>
		</g>
	);
};

/** Biscuit's face, huge, for when he's looking down at tiny Dex. Centred on (x, y). */
export const BiscuitFace: React.FC<{x: number; y: number; s?: number; frame: number; sniff?: number}> = ({x, y, s = 1, frame, sniff = 0}) => {
	const twitch = Math.sin(frame * 1.6) * 6 * sniff;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round">
			<path d="M-560 -300 Q-720 -100 -640 260 Q-560 360 -470 160 Z" fill={FUR_DARK} />
			<path d="M560 -300 Q720 -100 640 260 Q560 360 470 160 Z" fill={FUR_DARK} />
			<ellipse cx={0} cy={0} rx={560} ry={520} fill={FUR} />
			<ellipse cx={0} cy={260} rx={330} ry={250} fill={MUZZLE} />
			<circle cx={-230} cy={-120} r={70} fill={C.ink} />
			<circle cx={230} cy={-120} r={70} fill={C.ink} />
			<circle cx={-205} cy={-148} r={24} fill="#fff" stroke="none" />
			<circle cx={255} cy={-148} r={24} fill="#fff" stroke="none" />
			<path d="M-300 -230 Q-230 -270 -160 -230 M160 -230 Q230 -270 300 -230" fill="none" stroke={FUR_DARK} strokeWidth={22} />
			<g transform={`translate(0 ${120 + twitch}) scale(${1 + sniff * 0.04 * Math.sin(frame * 1.6)})`}>
				<ellipse cx={0} cy={0} rx={150} ry={100} fill={C.ink} />
				<ellipse cx={-55} cy={10} rx={30} ry={22} fill="#5A5470" stroke="none" />
				<ellipse cx={55} cy={10} rx={30} ry={22} fill="#5A5470" stroke="none" />
				<ellipse cx={-40} cy={-50} rx={40} ry={16} fill="#6E6888" stroke="none" />
			</g>
			<path d="M0 220 L0 300 Q-80 380 -160 320 M0 300 Q80 380 160 320" fill="none" />
		</g>
	);
};
