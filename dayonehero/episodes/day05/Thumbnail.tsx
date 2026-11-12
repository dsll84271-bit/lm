import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../../brand/colours';
import {FONT} from '../../brand/fonts';
import {Dex} from '../../characters/Dex';
import {Finish, Svg, Twinkle} from '../../components/ui';
import {Kitchen} from '../../sets/Kitchen';
import {Behind, Wood} from '../../sets/Macro';
import {Hoop} from '../../sets/props';

// The Day 5 thumbnail: tiny Dex, shocked, next to one giant cereal hoop.

const big = (size: number, color: string): React.CSSProperties => ({
	fontFamily: FONT,
	fontWeight: 700,
	fontSize: size,
	color,
	lineHeight: 0.92,
	WebkitTextStroke: `${size * 0.11}px ${C.ink}`,
	paintOrder: 'stroke fill',
	textShadow: `0 ${size * 0.08}px 0 ${C.ink}`,
	whiteSpace: 'nowrap',
});

export const Day05Thumbnail: React.FC = () => (
	<AbsoluteFill>
		<Behind x={1100} y={540} zoom={4.4} blur={18}>
			<Kitchen />
		</Behind>
		<Wood top={880} color={C.woodLight} dark={C.wood} />
		<Svg>
			<Hoop x={1720} y={900} d={760} rotate={-6} />
			<Dex x={1200} y={915} size={560} face="shock" look={[0.9, -0.6]} armL={[150, 170]} armR={[150, 170]} />
			{[...Array(5)].map((_, i) => (
				<Twinkle key={i} x={780 + i * 230} y={110 + (i % 2) * 90} r={34} frame={10 + i * 7} seed={i} />
			))}
		</Svg>
		<div style={{position: 'absolute', left: 60, top: 50, background: C.blue, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 92, padding: '8px 44px 14px', borderRadius: 46, border: `10px solid ${C.ink}`, boxShadow: `0 10px 0 ${C.ink}`}}>
			DAY 5
		</div>
		<div style={{position: 'absolute', left: 50, top: 250, transform: 'rotate(-4deg)'}}>
			<div style={big(230, C.white)}>DEX</div>
			<div style={big(185, C.yellow)}>SHRANK?!</div>
		</div>
		<Finish strength={1.2} />
	</AbsoluteFill>
);
