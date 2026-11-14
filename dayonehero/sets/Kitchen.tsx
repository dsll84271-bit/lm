import React from 'react';
import {C} from '../brand/colours';
import {Curtains, Floor, Window} from './Bedroom';

// The kitchen: blue cabinets, pale green tiles, window with red curtains, a
// wooden table at the front with breakfast on it.

export const KITCHEN = {floorY: 760, tableTop: 640, mumX: 470, dexDot: [585, 1000] as const, table: [1100, 640] as const};

const OUT = 6;

export const Kitchen: React.FC<{table?: boolean}> = ({table = true}) => {
	const F = KITCHEN.floorY;
	return (
		<g>
			<rect width={1920} height={F} fill={C.tile} />
			{[...Array(20)].map((_, i) => (
				<line key={`h${i}`} x1={0} y1={230 + i * 46} x2={1920} y2={230 + i * 46} stroke="#CFE3CC" strokeWidth={4} />
			))}
			{[...Array(30)].map((_, i) => (
				<line key={`v${i}`} x1={i * 70} y1={230} x2={i * 70} y2={F} stroke="#CFE3CC" strokeWidth={4} />
			))}
			{/* upper cabinets */}
			{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
				const x = i * 220 - 10;
				if (x > 660 && x < 1220) {
					return null;
				}
				return (
					<g key={i}>
						<rect x={x + 8} y={-20} width={204} height={210} rx={10} fill={C.cabinet} stroke={C.ink} strokeWidth={OUT} />
						<rect x={x + 90} y={150} width={40} height={10} rx={5} fill={C.ink} />
					</g>
				);
			})}
			<Curtains x={760} y={40} w={400} h={240} />
			<Window x={760} y={40} w={400} h={240} />
			{/* counter */}
			<rect x={0} y={480} width={1920} height={F - 480} fill={C.cabinet} stroke={C.ink} strokeWidth={OUT} />
			{[...Array(9)].map((_, i) => (
				<g key={i}>
					<rect x={i * 220 + 14} y={512} width={192} height={F - 540} rx={8} fill="none" stroke={C.cabinetDark} strokeWidth={6} />
					<rect x={i * 220 + 80} y={530} width={60} height={10} rx={5} fill={C.ink} />
				</g>
			))}
			<rect x={-10} y={456} width={1940} height={34} rx={8} fill={C.woodLight} stroke={C.ink} strokeWidth={OUT} />
			<g transform="translate(250 456)" stroke={C.ink} strokeWidth={5}>
				<rect x={0} y={-60} width={50} height={60} rx={8} fill="#fff" />
				<path d="M50 -46 Q72 -40 50 -18" fill="none" strokeWidth={7} />
				<rect x={6} y={-44} width={38} height={14} fill={C.red} />
			</g>
			<Floor y={F} />
			{table ? <Table /> : null}
		</g>
	);
};

/** The breakfast table at the front of the kitchen. */
export const Table: React.FC = () => {
	const T = KITCHEN.tableTop;
	return (
		<g stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
			<rect x={760} y={T + 20} width={30} height={330} fill={C.wood} />
			<rect x={1460} y={T + 20} width={30} height={330} fill={C.wood} />
			<rect x={720} y={T} width={810} height={34} rx={8} fill={C.woodLight} />
			{/* cereal box */}
			<g transform={`translate(1250 ${T})`}>
				<rect x={0} y={-230} width={150} height={230} rx={8} fill={C.red} />
				<circle cx={75} cy={-140} r={42} fill={C.yellow} />
				<rect x={20} y={-60} width={110} height={30} rx={6} fill={C.white} />
			</g>
			{/* bowl */}
			<g transform={`translate(1090 ${T})`}>
				<path d="M-100 -80 L100 -80 Q90 0 0 0 Q-90 0 -100 -80 Z" fill="#7FC4EE" />
				<ellipse cx={0} cy={-80} rx={100} ry={18} fill="#F6E3B0" />
				{[-50, -10, 30, 60].map((dx) => (
					<circle key={dx} cx={dx} cy={-84} r={11} fill="#E9A54B" strokeWidth={4} />
				))}
			</g>
			{/* milk */}
			<g transform={`translate(1430 ${T})`}>
				<path d="M-40 0 L-40 -150 L0 -190 L40 -150 L40 0 Z" fill="#fff" />
				<rect x={-40} y={-110} width={80} height={44} fill={C.blue} />
			</g>
			{/* a spill */}
			<ellipse cx={930} cy={T + 2} rx={16} ry={4} fill="#fff" />
		</g>
	);
};
