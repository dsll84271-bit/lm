import React from 'react';
import {C} from '../brand/colours';

// The corner shop and the high street outside it, in the evening.

const OUT = 6;

export const SHOP = {floorY: 820, fridgeX: 1340, fridgeW: 420, gapY: 790, counterX: 120};

const PRODUCT = [C.red, C.yellow, C.blue, C.green, C.orange, C.purple, C.cyan];

export const Shop: React.FC = () => {
	const F = SHOP.floorY;
	return (
		<g>
			<rect width={1920} height={F} fill="#F3E3C8" />
			<rect width={1920} height={120} fill="#E2CDA8" />
			{/* shelves */}
			{[200, 360, 520].map((sy, r) => (
				<g key={sy}>
					{[...Array(13)].map((_, i) => {
						const x = 640 + i * 52;
						const h = 60 + ((i * 7 + r * 3) % 4) * 18;
						return <rect key={i} x={x} y={sy - h} width={42} height={h} rx={6} fill={PRODUCT[(i + r * 2) % PRODUCT.length]} stroke={C.ink} strokeWidth={4} />;
					})}
					<rect x={620} y={sy} width={700} height={16} rx={5} fill={C.wood} stroke={C.ink} strokeWidth={OUT} />
				</g>
			))}
			{/* floor tiles */}
			<rect x={0} y={F} width={1920} height={1080 - F} fill="#D9D4CB" />
			{[...Array(16)].map((_, i) => (
				<line key={i} x1={i * 130} y1={F} x2={i * 130 - 80} y2={1080} stroke="#C2BCB0" strokeWidth={4} />
			))}
			<line x1={0} y1={F + 120} x2={1920} y2={F + 120} stroke="#C2BCB0" strokeWidth={4} />
			<rect x={0} y={F - 18} width={1920} height={20} fill="#B9B2A4" stroke={C.ink} strokeWidth={OUT} />
			{/* drinks fridge, standing on short feet: the gap underneath */}
			<g stroke={C.ink} strokeWidth={OUT}>
				<rect x={SHOP.fridgeX} y={120} width={SHOP.fridgeW} height={SHOP.gapY - 120} rx={14} fill="#E9EEF6" />
				<rect x={SHOP.fridgeX + 30} y={150} width={SHOP.fridgeW - 60} height={SHOP.gapY - 220} rx={8} fill="#BFE3F7" />
				{[0, 1, 2, 3].map((r) => (
					<g key={r}>
						{[...Array(6)].map((_, i) => (
							<rect key={i} x={SHOP.fridgeX + 50 + i * 56} y={180 + r * 130} width={34} height={96} rx={10} fill={PRODUCT[(i + r) % PRODUCT.length]} strokeWidth={4} />
						))}
						<line x1={SHOP.fridgeX + 30} y1={280 + r * 130} x2={SHOP.fridgeX + SHOP.fridgeW - 30} y2={280 + r * 130} strokeWidth={4} />
					</g>
				))}
				<rect x={SHOP.fridgeX + 30} y={SHOP.gapY - 60} width={SHOP.fridgeW - 60} height={34} rx={6} fill="#5B6378" />
				<rect x={SHOP.fridgeX + 20} y={SHOP.gapY} width={30} height={F - SHOP.gapY - 14} fill="#5B6378" />
				<rect x={SHOP.fridgeX + SHOP.fridgeW - 50} y={SHOP.gapY} width={30} height={F - SHOP.gapY - 14} fill="#5B6378" />
			</g>
			<rect x={SHOP.fridgeX + 50} y={SHOP.gapY + 2} width={SHOP.fridgeW - 100} height={F - SHOP.gapY - 6} fill="#1E1A2A" />
			{/* counter */}
			<g stroke={C.ink} strokeWidth={OUT}>
				<rect x={SHOP.counterX} y={560} width={460} height={F - 560} fill={C.wood} />
				<rect x={SHOP.counterX - 20} y={540} width={500} height={30} rx={8} fill={C.woodLight} />
				<rect x={SHOP.counterX + 300} y={440} width={140} height={100} rx={10} fill="#3E4660" />
				<rect x={SHOP.counterX + 316} y={456} width={108} height={40} rx={5} fill="#7FE0C0" />
			</g>
			{/* sign */}
			<rect x={700} y={20} width={520} height={80} rx={16} fill={C.red} stroke={C.ink} strokeWidth={OUT} />
			<text x={960} y={78} fontFamily="Fredoka" fontWeight={700} fontSize={50} fill="#fff" textAnchor="middle">
				CORNER SHOP
			</text>
		</g>
	);
};

/** The high street at dusk: a brick terrace of shops, lamps, the pavement. */
export const Street: React.FC<{frame: number; night?: boolean}> = ({night = false}) => (
	<g>
		<defs>
			<linearGradient id={night ? 'duskN' : 'dusk'} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={night ? '#151B45' : '#5B5BA6'} />
				<stop offset="100%" stopColor={night ? '#3A3570' : '#F2A27A'} />
			</linearGradient>
		</defs>
		<rect width={1920} height={760} fill={`url(#${night ? 'duskN' : 'dusk'})`} />
		{[...Array(6)].map((_, i) => {
			const x = i * 330 - 40;
			const shop = i === 3;
			return (
				<g key={i} stroke={C.ink} strokeWidth={OUT}>
					<path d={`M${x} 200 L${x + 165} 120 L${x + 330} 200 Z`} fill="#8E4A3A" />
					<rect x={x} y={200} width={330} height={560} fill={i % 2 ? '#C8664A' : '#B9573E'} />
					{[0, 1].map((c) => (
						<rect key={c} x={x + 50 + c * 140} y={250} width={90} height={110} fill={night ? '#FFD98A' : '#CFE6F5'} strokeWidth={4} />
					))}
					{shop ? (
						<g>
							<rect x={x + 20} y={430} width={290} height={70} fill={C.red} />
							<text x={x + 165} y={480} fontFamily="Fredoka" fontWeight={700} fontSize={40} fill="#fff" textAnchor="middle" stroke="none">
								CORNER SHOP
							</text>
							<rect x={x + 30} y={520} width={170} height={200} fill="#FFE7A8" />
							<rect x={x + 220} y={520} width={80} height={240} fill="#3E4660" />
						</g>
					) : (
						<g>
							<rect x={x + 50} y={480} width={110} height={130} fill={night ? '#FFD98A' : '#CFE6F5'} strokeWidth={4} />
							<rect x={x + 200} y={540} width={90} height={220} fill="#2E3A6A" />
						</g>
					)}
				</g>
			);
		})}
		{[260, 1060, 1720].map((lx) => (
			<g key={lx} stroke={C.ink} strokeWidth={OUT}>
				<rect x={lx - 10} y={420} width={20} height={360} fill="#3E4660" />
				<circle cx={lx} cy={410} r={30} fill="#FFE7A8" />
				<circle cx={lx} cy={410} r={90} fill="#FFE7A8" opacity={0.18} stroke="none" />
			</g>
		))}
		<rect x={0} y={760} width={1920} height={320} fill="#A9A7B8" stroke={C.ink} strokeWidth={OUT} />
		<rect x={0} y={760} width={1920} height={24} fill="#C9C7D6" stroke={C.ink} strokeWidth={OUT} />
		{[...Array(10)].map((_, i) => (
			<line key={i} x1={i * 220} y1={784} x2={i * 220 - 100} y2={1080} stroke="#938FA6" strokeWidth={4} />
		))}
		{night ? <rect width={1920} height={1080} fill="#151B55" opacity={0.3} /> : null}
	</g>
);
