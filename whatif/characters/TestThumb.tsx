import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../brand/fonts';
import {Hero} from './Hero';

// A test thumbnail for episode 1, "What If You Could Stop Time?":
// a frozen city street in the rain, raindrops hanging in the air, a frozen
// splash, a glowing stopped clock, and the hero, smug, hand up.

const big = (size: number, color: string): React.CSSProperties => ({
	fontFamily: FONT,
	fontWeight: 700,
	fontSize: size,
	color,
	lineHeight: 0.9,
	WebkitTextStroke: `${size * 0.12}px #140A28`,
	paintOrder: 'stroke fill',
	textShadow: `0 ${size * 0.08}px 0 #140A28, 0 0 40px rgba(0,0,0,0.5)`,
	whiteSpace: 'nowrap',
});

export const TestThumb: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #2A1F6E 0%, #5B3FD6 55%, #F08A6A 100%)'}}>
		<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
			<defs>
				<filter id="blur8" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation={8} />
				</filter>
				<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation={30} />
				</filter>
				<radialGradient id="clock" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#E9FBFF" />
					<stop offset="70%" stopColor="#9BE8FF" />
					<stop offset="100%" stopColor="#3FB7E8" />
				</radialGradient>
			</defs>
			{/* city, out of focus */}
			<g filter="url(#blur8)" opacity={0.85}>
				{[...Array(9)].map((_, i) => {
					const x = i * 230 - 60;
					const h = 380 + ((i * 137) % 260);
					return (
						<g key={i}>
							<rect x={x} y={860 - h} width={200} height={h} fill={i % 2 ? '#2B2168' : '#352A80'} />
							{[...Array(12)].map((__, j) => (
								<rect key={j} x={x + 24 + (j % 3) * 58} y={860 - h + 30 + Math.floor(j / 3) * 70} width={34} height={40} fill={(i + j) % 3 ? '#FFD98A' : '#3A3090'} opacity={0.9} />
							))}
						</g>
					);
				})}
			</g>
			<rect x={0} y={860} width={1920} height={220} fill="#241A55" />
			<ellipse cx={1150} cy={900} rx={700} ry={40} fill="#FFD98A" opacity={0.15} filter="url(#glow)" />
			{/* the stopped clock, glowing */}
			<g transform="translate(1330 420)">
				<circle r={360} fill="#7FE0FF" opacity={0.35} filter="url(#glow)" />
				<circle r={300} fill="url(#clock)" stroke="#140A28" strokeWidth={14} opacity={0.9} />
				{[...Array(12)].map((_, i) => {
					const a = (i / 12) * Math.PI * 2;
					return <rect key={i} x={-8} y={-280} width={16} height={i % 3 ? 30 : 54} fill="#140A28" transform={`rotate(${(a * 180) / Math.PI})`} />;
				})}
				<path d="M0 0 L0 -200 M0 0 L140 -80" stroke="#140A28" strokeWidth={22} strokeLinecap="round" />
				<path d="M-120 -250 L-60 -120 L-140 -40 L-60 60" stroke="#fff" strokeWidth={8} fill="none" opacity={0.8} />
			</g>
			{/* raindrops, frozen in the air */}
			{[...Array(70)].map((_, i) => {
				const x = (i * 263) % 1920;
				const y = (i * 151) % 1000;
				const s = 0.6 + ((i * 7) % 5) * 0.2;
				return (
					<g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
						<path d="M0 -26 Q14 0 0 14 Q-14 0 0 -26 Z" fill="#CFF4FF" stroke="#140A28" strokeWidth={3} opacity={0.9} />
						<circle cx={-3} cy={-2} r={3} fill="#fff" />
					</g>
				);
			})}
			{/* a frozen splash from a puddle */}
			<g transform="translate(560 900)">
				<ellipse cx={0} cy={0} rx={220} ry={30} fill="#5FA8E8" stroke="#140A28" strokeWidth={6} />
				{[-150, -80, -10, 60, 130].map((dx, i) => (
					<g key={dx}>
						<path d={`M${dx} -6 Q${dx + 10} ${-90 - i * 20} ${dx + 30} ${-160 - (i % 2) * 60}`} stroke="#CFF4FF" strokeWidth={18} fill="none" strokeLinecap="round" />
						<circle cx={dx + 34} cy={-190 - (i % 2) * 60} r={18} fill="#CFF4FF" stroke="#140A28" strokeWidth={4} />
					</g>
				))}
			</g>
			<Hero x={1360} y={1560} size={1350} face="smug" armR={[100, 165]} look={[-0.5, 0]} />
		</svg>
		<div style={{position: 'absolute', left: 60, top: 70, transform: 'rotate(-4deg)'}}>
			<div style={big(250, '#FFFFFF')}>TIME</div>
			<div style={big(210, '#FFD84A')}>STOPPED</div>
		</div>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 80% at 55% 50%, rgba(0,0,0,0) 60%, rgba(10,5,30,0.45) 100%)'}} />
	</AbsoluteFill>
);
