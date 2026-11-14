import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../brand/fonts';
import {Hero, HERO, type HeroFace} from './Hero';

// The model sheet for the new hero: expressions, poses and colours.

const FACES: HeroFace[] = ['smug', 'shocked', 'determined', 'happy', 'scared', 'sad'];

const Label: React.FC<{x: number; y: number; children: string; size?: number}> = ({x, y, children, size = 30}) => (
	<text x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize={size} fill="#fff" textAnchor="middle" stroke="#120A24" strokeWidth={size * 0.18} paintOrder="stroke">
		{children}
	</text>
);

export const HeroSheet: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 50% 30%, #3B2A8A 0%, #1A1240 55%, #0C0820 100%)'}}>
		<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
			{[...Array(40)].map((_, i) => (
				<circle key={i} cx={(i * 397) % 1920} cy={(i * 233) % 1080} r={1.5 + (i % 3)} fill="#fff" opacity={0.25} />
			))}
			<Label x={960} y={70} size={52}>THE HERO: "YOU"</Label>
			<Label x={960} y={110} size={24}>faceless on purpose, so every viewer pictures themselves</Label>
			{/* expressions: head and shoulders */}
			<defs>
				<clipPath id="bust">
					<rect x={-150} y={-280} width={300} height={260} rx={30} />
				</clipPath>
			</defs>
			{FACES.map((f, i) => {
				const cx = 200 + i * 304;
				return (
					<g key={f}>
						<rect x={cx - 140} y={140} width={280} height={250} rx={28} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
						<g transform={`translate(${cx} 410)`} clipPath="url(#bust)">
							<Hero x={0} y={330} size={560} face={f} />
						</g>
						<Label x={cx} y={425}>{f.toUpperCase()}</Label>
					</g>
				);
			})}
			{/* poses (the power-up first, so its glow sits behind the others) */}
			<Hero x={940} y={1010} size={540} face="determined" fists armL={[30, 45]} armR={[30, 45]} stance={1} aura={1} />
			<Hero x={230} y={1010} size={520} face="neutral" />
			<Label x={230} y={1060}>STAND</Label>
			<Hero x={560} y={1010} size={520} face="smug" armR={[95, 95]} look={[0.6, 0]} />
			<Label x={560} y={1060}>POINT</Label>
			<Label x={940} y={1060}>POWER UP</Label>
			<Hero x={1310} y={1010} size={520} face="smug" thinking look={[0.4, -0.6]} />
			<Label x={1310} y={1060}>THINKING</Label>
			<Hero x={1630} y={1010} size={520} face="happy" armL={[150, 165]} armR={[150, 165]} stance={0.7} />
			<Label x={1630} y={1060}>WIN</Label>
			{/* colours */}
			{[HERO.head, HERO.hoodie, HERO.legs, HERO.shoe, HERO.emblem].map((c, i) => (
				<circle key={c} cx={1790 + (i % 2) * 50} cy={160 + Math.floor(i / 2) * 50} r={0} fill={c} />
			))}
		</svg>
	</AbsoluteFill>
);
