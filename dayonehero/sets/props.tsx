import React from 'react';
import {C} from '../brand/colours';
import {FONT} from '../brand/fonts';

const OUT = 6;

/** The red alarm clock. Drawn about 240 wide at s = 1, sitting on (x, y). */
export const AlarmClock: React.FC<{x: number; y: number; s?: number; frame: number; ringing?: boolean}> = ({x, y, s = 1, frame, ringing}) => {
	const jig = ringing ? Math.sin(frame * 2.2) * 6 : 0;
	const hop = ringing ? Math.abs(Math.sin(frame * 1.1)) * 6 : 0;
	return (
		<g transform={`translate(${x} ${y - hop}) scale(${s}) rotate(${jig})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
			<path d="M-70 -20 L-90 10 M70 -20 L90 10" strokeWidth={12} strokeLinecap="round" />
			<circle cx={-62} cy={-168} r={32} fill={C.red} />
			<circle cx={62} cy={-168} r={32} fill={C.red} />
			<rect x={-8} y={-196} width={16} height={22} rx={4} fill={C.ink} />
			<circle cx={0} cy={-95} r={95} fill={C.red} />
			<circle cx={0} cy={-95} r={72} fill={C.white} />
			{[...Array(12)].map((_, i) => {
				const a = (i / 12) * Math.PI * 2;
				return <circle key={i} cx={Math.sin(a) * 58} cy={-95 - Math.cos(a) * 58} r={i % 3 === 0 ? 5 : 3} fill={C.ink} stroke="none" />;
			})}
			<path d="M0 -95 L0 -140 M0 -95 L30 -80" strokeWidth={8} strokeLinecap="round" />
			<circle cx={0} cy={-95} r={6} fill={C.red} />
			{ringing
				? [1, -1].map((side) => (
						<g key={side} fill="none" strokeWidth={7} strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame * 0.8))}>
							<path d={`M${side * 120} -150 Q${side * 140} -110 ${side * 120} -70`} />
							<path d={`M${side * 150} -170 Q${side * 178} -110 ${side * 150} -50`} />
						</g>
					))
				: null}
		</g>
	);
};

/** A wooden ruler standing on end, in centimetres. `cm` is how many pixels make one centimetre. */
export const Ruler: React.FC<{x: number; y: number; cm: number; count?: number}> = ({x, y, cm, count = 3}) => {
	const h = cm * count + 40;
	return (
		<g transform={`translate(${x} ${y})`}>
			<rect x={0} y={-h} width={120} height={h} rx={8} fill="#F5C76A" stroke={C.ink} strokeWidth={OUT} />
			{[...Array(count * 10 + 1)].map((_, i) => {
				const long = i % 10 === 0;
				const mid = i % 5 === 0;
				const ty = -20 - (i * cm) / 10;
				return <line key={i} x1={0} y1={ty} x2={long ? 56 : mid ? 40 : 26} y2={ty} stroke={C.ink} strokeWidth={long ? 5 : 3} />;
			})}
			{[...Array(count + 1)].map((_, i) => (
				<text key={i} x={92} y={-20 - i * cm + 12} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.ink} textAnchor="middle">
					{i}
				</text>
			))}
		</g>
	);
};

/** A sugar cube. `w` is its width in pixels. */
export const SugarCube: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => {
	const d = w * 0.28;
	return (
		<g transform={`translate(${x} ${y})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
			<path d={`M${-w / 2} 0 L${w / 2} 0 L${w / 2} ${-w} L${-w / 2} ${-w} Z`} fill="#FFFFFF" />
			<path d={`M${-w / 2} ${-w} L${-w / 2 + d} ${-w - d} L${w / 2 + d} ${-w - d} L${w / 2} ${-w} Z`} fill="#F3F1EE" />
			<path d={`M${w / 2} 0 L${w / 2 + d} ${-d} L${w / 2 + d} ${-w - d} L${w / 2} ${-w} Z`} fill="#DCD8D2" />
			{[...Array(30)].map((_, i) => (
				<rect key={i} x={-w / 2 + ((i * 53) % w)} y={-w + ((i * 97) % w)} width={9} height={9} fill="#E7E3DD" stroke="none" transform={`rotate(${i * 17} ${-w / 2 + ((i * 53) % w)} ${-w + ((i * 97) % w)})`} />
			))}
		</g>
	);
};

/** A red toy car, side view, wheels on (x, y). About 900 wide at s = 1. */
export const ToyCar: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT * 1.5} strokeLinejoin="round">
		<path d="M-440 -90 Q-450 -230 -330 -240 L-200 -250 Q-140 -400 40 -400 L180 -400 Q290 -390 330 -250 L420 -235 Q470 -220 460 -100 L460 -80 L-440 -80 Z" fill={C.red} />
		<path d="M-150 -260 Q-110 -360 20 -362 L20 -260 Z" fill={C.glass} />
		<path d="M60 -362 L170 -362 Q250 -350 280 -260 L60 -260 Z" fill={C.glass} />
		<path d="M-300 -180 L380 -180" stroke="#B22A22" strokeWidth={8} />
		{[-260, 280].map((wx) => (
			<g key={wx} transform={`translate(${wx} -70) rotate(${frame * 25})`}>
				<circle r={92} fill="#2B2B38" />
				<circle r={44} fill="#C9CED8" />
				<path d="M-44 0 L44 0 M0 -44 L0 44" stroke={C.ink} strokeWidth={8} />
			</g>
		))}
	</g>
);

/** A red toy brick with studs on top. `w` wide. */
export const Brick: React.FC<{x: number; y: number; w: number; rotate?: number}> = ({x, y, w, rotate = 0}) => {
	const h = w * 0.62;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
			{[-0.25, 0.25].map((f) => (
				<rect key={f} x={w * f - w * 0.16} y={-h - w * 0.13} width={w * 0.32} height={w * 0.16} rx={6} fill="#E8453C" />
			))}
			<rect x={-w / 2} y={-h} width={w} height={h} rx={10} fill={C.red} />
			<rect x={-w / 2 + 14} y={-h + 14} width={w * 0.3} height={h * 0.3} rx={6} fill="#FF7A70" stroke="none" opacity={0.6} />
		</g>
	);
};

/** One cereal hoop standing on its edge. `d` is its diameter. */
export const Hoop: React.FC<{x: number; y: number; d: number; rotate?: number}> = ({x, y, d, rotate = 0}) => {
	const r = d / 2;
	return (
		<g transform={`translate(${x} ${y - r}) rotate(${rotate})`}>
			<circle r={r * 0.72} fill="none" stroke={C.ink} strokeWidth={r * 0.56 + OUT * 2} />
			<circle r={r * 0.72} fill="none" stroke="#E9A54B" strokeWidth={r * 0.56} />
			<circle r={r * 0.78} fill="none" stroke="#F6C46E" strokeWidth={r * 0.18} opacity={0.8} />
			{[...Array(22)].map((_, i) => {
				const a = (i / 22) * Math.PI * 2;
				const rr = r * (0.55 + ((i * 7) % 5) * 0.08);
				return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r={r * 0.035} fill="#B7712E" />;
			})}
		</g>
	);
};

/** A drop of milk sitting on a surface. `pull` (0 to 1) stretches it towards (tx, ty). */
export const MilkDrop: React.FC<{x: number; y: number; r: number; pull?: number; tx?: number; ty?: number; wobble?: number}> = ({x, y, r, pull = 0, tx = 0, ty = 0, wobble = 0}) => {
	const w = 1 + Math.sin(wobble) * 0.04;
	const body = `M${x - r * w} ${y} Q${x - r * w} ${y - r * 1.05} ${x} ${y - r * 1.05} Q${x + r * w} ${y - r * 1.05} ${x + r * w} ${y} Z`;
	return (
		<g>
			{pull > 0.01 ? (
				<path
					d={`M${x + r * 0.2} ${y - r * 0.85} Q${(x + tx) / 2} ${(y - r * 0.5 + ty) / 2 - 20 * pull} ${tx} ${ty - 34} L${tx} ${ty + 34} Q${(x + tx) / 2} ${(y + ty) / 2 + 30} ${x + r * 0.3} ${y - r * 0.15} Z`}
					fill="#FFFFFF"
					stroke={C.ink}
					strokeWidth={OUT}
					strokeLinejoin="round"
				/>
			) : null}
			<path d={body} fill="#FFFFFF" stroke={C.ink} strokeWidth={OUT} />
			<ellipse cx={x - r * 0.35} cy={y - r * 0.68} rx={r * 0.18} ry={r * 0.1} fill="#E6EEF8" />
			<ellipse cx={x} cy={y - 4} rx={r * 0.85} ry={8} fill="#E6EEF8" />
		</g>
	);
};

/** A shrew, side view, facing right. About 420 long at s = 1. */
export const Shrew: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => {
	const sniff = Math.sin(frame * 1.4) * 4;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT} strokeLinejoin="round">
			<path d="M-150 -40 Q-260 -30 -300 -90" fill="none" strokeWidth={12} strokeLinecap="round" />
			<path d="M-150 -40 Q-260 -30 -300 -90" fill="none" stroke="#C99A86" strokeWidth={6} strokeLinecap="round" />
			<ellipse cx={-30} cy={-80} rx={150} ry={80} fill="#7A5E52" />
			<path d={`M90 -120 Q190 -100 ${226 + sniff} -70 Q190 -48 100 -40 Z`} fill="#8C6E60" />
			<circle cx={230 + sniff} cy={-70} r={12} fill="#F09AA6" />
			<circle cx={120} cy={-98} r={9} fill={C.ink} stroke="none" />
			<circle cx={123} cy={-101} r={3} fill="#fff" stroke="none" />
			<ellipse cx={70} cy={-140} rx={22} ry={16} fill="#B08878" />
			{[-90, 20].map((fx) => (
				<ellipse key={fx} cx={fx} cy={-6} rx={22} ry={10} fill="#E7B3A6" />
			))}
			<ellipse cx={-50} cy={-120} rx={60} ry={20} fill="#9A7C6E" stroke="none" opacity={0.6} />
		</g>
	);
};

/** Mum's slipper, side view, toe to the right. About 1000 long at s = 1. */
export const BigSlipper: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={OUT * 2} strokeLinejoin="round">
		<rect x={-470} y={-1800} width={260} height={1600} rx={40} fill={C.legs} />
		<path d="M-500 0 Q-520 -220 -380 -230 L-140 -240 Q200 -330 420 -200 Q520 -140 500 -40 Q490 0 440 0 Z" fill={C.slipper} />
		<path d="M-480 -40 L470 -40" stroke={C.slipperDark} strokeWidth={22} />
		<circle cx={330} cy={-250} r={70} fill={C.white} />
	</g>
);

/** A hollow magnifying glass. The lens is centred on (x, y). */
export const Magnifier: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
	<g stroke={C.ink} strokeLinecap="round">
		<path d={`M${x + r * 0.72} ${y + r * 0.72} L${x + r * 1.55} ${y + r * 1.55}`} strokeWidth={r * 0.28 + 14} />
		<path d={`M${x + r * 0.72} ${y + r * 0.72} L${x + r * 1.55} ${y + r * 1.55}`} stroke="#5B3A2A" strokeWidth={r * 0.28} />
		<circle cx={x} cy={y} r={r} fill="none" strokeWidth={r * 0.13 + 14} />
		<circle cx={x} cy={y} r={r} fill="none" stroke="#C9CED8" strokeWidth={r * 0.13} />
		<path d={`M${x - r * 0.6} ${y - r * 0.35} Q${x - r * 0.5} ${y - r * 0.6} ${x - r * 0.25} ${y - r * 0.7}`} stroke="#fff" strokeWidth={r * 0.06} fill="none" opacity={0.7} />
	</g>
);
