import React from 'react';
import {C} from '../brand/colours';

// More props for Day 5. All drawn with the same dark outline.

const OUT = 6;

/** A ladybird walking right, about 300 long at s = 1, on (x, y). */
export const Ladybird: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => {
	const step = Math.sin(frame * 0.8) * 10;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" strokeLinecap="round">
			{[-60, 0, 60].map((lx, i) => (
				<path key={lx} d={`M${lx} -40 L${lx + (i % 2 ? step : -step)} 0`} fill="none" strokeWidth={8} />
			))}
			<path d="M-150 -40 Q-150 -200 0 -200 Q150 -200 150 -40 Z" fill={C.red} />
			<path d="M0 -200 L0 -40" />
			{[
				[-80, -120],
				[-40, -80],
				[60, -140],
				[90, -80],
				[-100, -70],
			].map(([sx, sy], i) => (
				<circle key={i} cx={sx} cy={sy} r={20} fill={C.ink} stroke="none" />
			))}
			<path d="M140 -40 Q220 -60 200 -130 Q150 -140 130 -100 Z" fill={C.ink} />
			<circle cx={185} cy={-100} r={10} fill="#fff" stroke="none" />
			<path d="M200 -130 Q230 -180 250 -170 M190 -134 Q200 -190 225 -190" fill="none" strokeWidth={5} />
		</g>
	);
};

/** A yellow pencil lying on its side, pointing right. `len` long, centred on (x, y). */
export const Pencil: React.FC<{x: number; y: number; len: number; rotate?: number}> = ({x, y, len, rotate = 0}) => {
	const h = len * 0.09;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
			<rect x={-len / 2} y={-h / 2} width={len * 0.12} height={h} rx={10} fill="#F28FA5" />
			<rect x={-len / 2 + len * 0.1} y={-h / 2} width={len * 0.06} height={h} fill="#C9CED8" />
			<rect x={-len / 2 + len * 0.16} y={-h / 2} width={len * 0.64} height={h} fill={C.yellow} />
			<path d={`M${-len / 2 + len * 0.16} 0 L${len * 0.3} 0`} stroke="#E0A010" strokeWidth={6} />
			<path d={`M${len * 0.3} ${-h / 2} L${len / 2} 0 L${len * 0.3} ${h / 2} Z`} fill="#F3D7A8" />
			<path d={`M${len * 0.44} ${-h * 0.15} L${len / 2} 0 L${len * 0.44} ${h * 0.15} Z`} fill={C.ink} />
		</g>
	);
};

/** A crumb of toast. `w` across, sitting on (x, y). */
export const Crumb: React.FC<{x: number; y: number; w: number; bite?: number}> = ({x, y, w, bite = 0}) => (
	<g transform={`translate(${x} ${y})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
		<path d={`M${-w / 2} 0 L${-w * 0.45} ${-w * 0.55} L${-w * 0.1} ${-w * 0.7} L${w * 0.35} ${-w * 0.6} L${w / 2} ${-w * 0.2} L${w * 0.4} 0 Z`} fill="#E3A65C" />
		<path d={`M${-w * 0.3} ${-w * 0.15} L${-w * 0.3} ${-w * 0.5} L${w * 0.25} ${-w * 0.48} L${w * 0.3} ${-w * 0.12} Z`} fill="#F7D9A2" stroke="none" />
		{[...Array(7)].map((_, i) => (
			<circle key={i} cx={-w * 0.25 + ((i * 37) % 100) / 100 * w * 0.5} cy={-w * 0.2 - ((i * 53) % 100) / 100 * w * 0.3} r={w * 0.025} fill="#D79B55" stroke="none" />
		))}
		{bite > 0 ? <circle cx={w * 0.38} cy={-w * 0.48} r={w * 0.16 * bite} fill="#F6E7CF" stroke={C.ink} strokeWidth={OUT} /> : null}
	</g>
);

/** A cornflake. `w` across, centred on (x, y). */
export const Cornflake: React.FC<{x: number; y: number; w: number; rotate?: number}> = ({x, y, w, rotate = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rotate})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
		<path
			d={`M${-w / 2} ${w * 0.05} Q${-w * 0.45} ${-w * 0.3} ${-w * 0.1} ${-w * 0.28} Q${w * 0.1} ${-w * 0.38} ${w * 0.4} ${-w * 0.2} Q${w * 0.55} ${w * 0.05} ${w * 0.35} ${w * 0.2} Q${0} ${w * 0.3} ${-w * 0.3} ${w * 0.22} Q${-w * 0.55} ${w * 0.2} ${-w / 2} ${w * 0.05} Z`}
			fill="#F0B54A"
		/>
		<path d={`M${-w * 0.3} ${-w * 0.05} Q0 ${-w * 0.15} ${w * 0.3} ${-w * 0.05}`} fill="none" stroke="#C98420" strokeWidth={8} />
		<path d={`M${-w * 0.2} ${w * 0.1} Q${w * 0.05} ${w * 0.04} ${w * 0.25} ${w * 0.1}`} fill="none" stroke="#FAD889" strokeWidth={10} />
	</g>
);

/** An ant, side view facing right, about 300 long at s = 1, feet on (x, y). */
export const Ant: React.FC<{x: number; y: number; s?: number; frame: number; carry?: boolean}> = ({x, y, s = 1, frame, carry}) => {
	const step = Math.sin(frame * 1.2) * 12;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" strokeLinecap="round">
			{[-40, 10, 60].map((lx, i) => (
				<path key={lx} d={`M${lx} -60 L${lx + (i % 2 ? step : -step) - 20} -30 L${lx + (i % 2 ? step : -step)} 0`} fill="none" strokeWidth={7} />
			))}
			<ellipse cx={-90} cy={-80} rx={70} ry={50} fill="#4A2E2A" />
			<ellipse cx={20} cy={-75} rx={45} ry={32} fill="#5A3A34" />
			<circle cx={110} cy={-95} r={42} fill="#5A3A34" />
			<circle cx={125} cy={-105} r={8} fill="#fff" stroke="none" />
			<path d="M130 -130 Q160 -190 200 -180 M120 -134 Q140 -200 170 -205" fill="none" strokeWidth={5} />
			{carry ? <path d="M60 -150 Q140 -260 260 -190 Q200 -120 60 -150 Z" fill="#62C14E" /> : null}
		</g>
	);
};

/** A gold ring standing on its edge, like a wheel. `d` across, sitting on (x, y). */
export const GoldRing: React.FC<{x: number; y: number; d: number; rotate?: number; glow?: number}> = ({x, y, d, rotate = 0, glow = 0}) => {
	const r = d / 2;
	return (
		<g transform={`translate(${x} ${y - r})`}>
			{glow > 0 ? <circle r={r * 1.25} fill="#FFE27A" opacity={0.25 * glow} /> : null}
			<g transform={`rotate(${rotate})`}>
				<circle r={r * 0.86} fill="none" stroke={C.ink} strokeWidth={r * 0.28 + 14} />
				<circle r={r * 0.86} fill="none" stroke="#F2B829" strokeWidth={r * 0.28} />
				<circle r={r * 0.9} fill="none" stroke="#FFE27A" strokeWidth={r * 0.08} />
				<circle r={r * 0.8} fill="none" stroke="#C88A12" strokeWidth={r * 0.06} />
				<path d={`M${-r * 0.5} ${-r * 0.75} Q${-r * 0.2} ${-r * 0.95} ${r * 0.2} ${-r * 0.92}`} stroke="#fff" strokeWidth={r * 0.05} fill="none" strokeLinecap="round" />
			</g>
		</g>
	);
};

/** A round, friendly house spider. Body centred on (x, y). */
export const Spider: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
		{[-1, 1].map((side) =>
			[0, 1, 2, 3].map((i) => {
				const a = -30 + i * 25 + Math.sin(frame * 0.2 + i) * 3;
				const r = (a * Math.PI) / 180;
				return <path key={`${side}${i}`} d={`M0 0 Q${side * 120 * Math.cos(r)} ${-80 + i * 20} ${side * 200 * Math.cos(r)} ${100 + i * 10}`} />;
			}),
		)}
		<ellipse cx={0} cy={0} rx={90} ry={80} fill="#3A3448" />
		<circle cx={-30} cy={-10} r={20} fill="#fff" />
		<circle cx={30} cy={-10} r={20} fill="#fff" />
		<circle cx={-26} cy={-6} r={9} fill={C.ink} stroke="none" />
		<circle cx={34} cy={-6} r={9} fill={C.ink} stroke="none" />
	</g>
);

/** A fluffy dust bunny. `w` across, sitting on (x, y). */
export const DustBunny: React.FC<{x: number; y: number; w: number; frame: number}> = ({x, y, w, frame}) => {
	const pts = [];
	for (let i = 0; i <= 28; i++) {
		const a = Math.PI + (i / 28) * Math.PI;
		const rr = w / 2 + Math.sin(i * 2.7 + frame * 0.05) * w * 0.06 + (i % 2) * w * 0.05;
		pts.push(`${Math.cos(a) * rr} ${Math.sin(a) * rr * 0.75}`);
	}
	return (
		<g transform={`translate(${x} ${y})`}>
			<path d={`M${pts.join(' L')} Z`} fill="#B9B4C4" stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" />
			<path d={`M${-w * 0.25} ${-w * 0.2} Q0 ${-w * 0.3} ${w * 0.2} ${-w * 0.15}`} stroke="#D9D5E2" strokeWidth={8} fill="none" />
		</g>
	);
};

/** A cute mouse, side view facing right, about 400 long at s = 1, feet on (x, y). */
export const Mouse: React.FC<{x: number; y: number; s?: number; frame: number; squeak?: boolean}> = ({x, y, s = 1, frame, squeak}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round" strokeLinecap="round">
		<path d="M-140 -40 Q-260 -20 -280 -110" fill="none" strokeWidth={10} />
		<path d="M-150 -40 Q-150 -170 0 -170 Q110 -170 150 -80 L190 -60 Q160 -20 100 -10 L-120 -10 Q-150 -15 -150 -40 Z" fill="#B7B1C2" />
		<circle cx={60} cy={-170} r={48} fill="#B7B1C2" />
		<circle cx={60} cy={-170} r={26} fill="#F2A7B5" stroke="none" />
		<circle cx={120} cy={-100} r={10} fill={C.ink} stroke="none" />
		<circle cx={190} cy={-62} r={11} fill="#F2A7B5" />
		<path d="M170 -70 L230 -90 M170 -60 L235 -62" strokeWidth={3} />
		{squeak
			? [0, 1, 2].map((i) => {
					const t = ((frame * 0.05 + i / 3) % 1) * 160;
					return <path key={i} d={`M${240 + t} -150 Q${270 + t} -90 ${240 + t} -30`} fill="none" stroke={C.purple} strokeWidth={10} opacity={1 - t / 160} />;
				})
			: null}
	</g>
);

/** A pond skater standing on water. Body centred on (x, y), water line at y + 60*s. */
export const PondSkater: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none">
		<path d="M-40 0 Q-160 10 -260 60 M40 0 Q160 10 260 60 M-10 10 Q-60 40 -120 60 M10 10 Q60 40 120 60" />
		{[-260, 260, -120, 120].map((fx) => (
			<ellipse key={fx} cx={fx} cy={64} rx={26} ry={6} fill="#9CD2F0" strokeWidth={3} />
		))}
		<ellipse cx={0} cy={0} rx={70} ry={18} fill="#3E3A50" />
		<circle cx={70} cy={-4} r={14} fill="#3E3A50" />
	</g>
);

/** A block of flats, for scale. Bottom-left corner on (x, y). */
export const Building: React.FC<{x: number; y: number; w: number; h: number; floors: number}> = ({x, y, w, h, floors}) => (
	<g>
		<rect x={x} y={y - h} width={w} height={h} fill="#8FA3C8" stroke={C.ink} strokeWidth={OUT} />
		{[...Array(floors)].map((_, f) =>
			[0, 1, 2].map((c) => <rect key={`${f}${c}`} x={x + w * (0.12 + c * 0.28)} y={y - h + (f + 0.25) * (h / floors)} width={w * 0.18} height={(h / floors) * 0.5} fill="#E8F0FF" stroke={C.ink} strokeWidth={2} />),
		)}
	</g>
);

/** A cartoon heart. Centred on (x, y). */
export const Heart: React.FC<{x: number; y: number; r: number; color?: string}> = ({x, y, r, color = C.red}) => (
	<path
		d={`M${x} ${y + r * 0.9} C${x - r * 1.6} ${y - r * 0.1} ${x - r * 0.9} ${y - r * 1.3} ${x} ${y - r * 0.45} C${x + r * 0.9} ${y - r * 1.3} ${x + r * 1.6} ${y - r * 0.1} ${x} ${y + r * 0.9} Z`}
		fill={color}
		stroke={C.ink}
		strokeWidth={6}
		strokeLinejoin="round"
	/>
);
