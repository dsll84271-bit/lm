import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {FONT} from '../../../brand/fonts';
import {blinkAt, Dex, mouth} from '../../../characters/Dex';
import {Cam, cue, Finish, lerp, Paper, Pill, pop, Said, Sfx, span, Sunburst, Svg, track, type ShotProps} from '../../../components/ui';
import {Shrew} from '../../../sets/props';
import {Sound} from './sound';

// Part B: the science. Haldane's essay, then the bad news.

/** The dark wooden study behind the old papers. */
const Study: React.FC = () => (
	<Svg>
		<defs>
			<radialGradient id="study" cx="50%" cy="45%" r="75%">
				<stop offset="0%" stopColor="#6A4A36" />
				<stop offset="100%" stopColor="#2E1E16" />
			</radialGradient>
		</defs>
		<rect width={1920} height={1080} fill="url(#study)" />
		{[...Array(8)].map((_, i) => (
			<rect key={i} x={i * 260 - 40} y={0} width={14} height={1080} fill="#2A1A12" opacity={0.35} />
		))}
		<rect x={0} y={860} width={1920} height={220} fill="#4A3122" stroke={C.ink} strokeWidth={6} />
	</Svg>
);

const T: React.FC<{x: number; y: number; size: number; children: string; anchor?: 'start' | 'middle'; color?: string}> = ({x, y, size, children, anchor = 'middle', color = C.ink}) => (
	<text x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} textAnchor={anchor}>
		{children}
	</text>
);

/** Lines standing in for printed text. */
const Print: React.FC<{x: number; y: number; w: number; rows: number}> = ({x, y, w, rows}) => (
	<g>
		{[...Array(rows)].map((_, i) => (
			<rect key={i} x={x} y={y + i * 30} width={w * (i % 4 === 3 ? 0.6 : 1)} height={10} rx={5} fill="#B79A62" />
		))}
	</g>
);

export const Haldane: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const p = pop(frame, 2, 160);
	return (
		<AbsoluteFill>
			<Study />
			<Cam zoom={lerp(1, 1.08, span(frame, 0, dur))}>
				<Svg>
					<g transform={`translate(960 ${lerp(1200, 520, p)})`}>
						<Paper x={0} y={0} w={760} h={640} rotate={-2}>
							<T x={0} y={-200} size={56}>ON BEING</T>
							<T x={0} y={-140} size={56}>THE RIGHT SIZE</T>
							<line x1={-200} y1={-110} x2={200} y2={-110} stroke={C.ink} strokeWidth={4} />
							<T x={0} y={-60} size={34} color="#7A5A2E">J. B. S. HALDANE</T>
							<Print x={-290} y={-10} w={580} rows={7} />
							<T x={0} y={260} size={40} color="#7A5A2E">1926</T>
						</Paper>
					</g>
				</Svg>
			</Cam>
			<Pill text="J. B. S. HALDANE · 1926" color={C.orange} x={960} y={90} frame={frame} at={cue(l0, 'scientist')} size={50} />
			<Pill text="A FAMOUS ESSAY" color={C.purple} x={960} y={990} frame={frame} at={cue(l0, 'wrote')} size={44} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.35} />
			<Sound name="pop" at={cue(l0, 'scientist')} />
			<Sound name="pop" at={cue(l0, 'wrote')} />
		</AbsoluteFill>
	);
};

/** A mouse drawn in ink, as a sketch. Facing right. */
const SketchMouse: React.FC<{x: number; y: number; s?: number; rot?: number; step?: number}> = ({x, y, s = 1, rot = 0, step = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
		<path d="M-60 -10 Q-110 -10 -130 -50" />
		<path d="M-60 0 Q-60 -60 0 -60 Q50 -60 70 -20 L90 -10 Q60 6 0 4 Q-50 4 -60 0 Z" fill="#E7D2A2" />
		<circle cx={18} cy={-62} r={18} fill="#E7D2A2" />
		<circle cx={58} cy={-26} r={4} fill={C.ink} />
		<circle cx={92} cy={-10} r={5} fill={C.ink} />
		<path d={`M-30 4 L${-36 + step * 8} 22 M30 4 L${36 - step * 8} 22`} />
	</g>
);

export const MouseShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const drop = cue(l0, 'dropped');
	const bottom = cue(l0, 'slight shock');
	const walk = cue(l0, 'walk away');
	const fall = span(frame, drop, bottom, Easing.in(Easing.quad));
	const away = span(frame, walk, dur, Easing.linear);
	const shaftX = 760;
	const mouseY = lerp(-300, 330, fall);
	const landed = frame >= bottom;
	return (
		<AbsoluteFill>
			<Study />
			<Svg>
				<Paper x={960} y={520} w={1500} h={860} rotate={1}>
					{/* the ground, the shaft and a sign */}
					<g stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round">
						<path d="M-700 -300 L-260 -300 M-140 -300 L700 -300" />
						<path d="M-260 -300 L-260 370 M-140 -300 L-140 370" strokeDasharray="26 14" />
						<path d="M-320 370 L700 370" />
						<path d="M-560 -300 L-560 -400 M-640 -440 L-480 -440 L-480 -390 L-640 -390 Z" />
					</g>
					<T x={-560} y={-404} size={30}>MINE</T>
					<g opacity={0.7}>
						<path d="M-200 -270 L-200 330" stroke="#B79A62" strokeWidth={4} strokeDasharray="8 16" />
					</g>
					<g transform={`translate(${-200 - shaftX + 760} 0)`}>
						{frame >= drop ? (
							<SketchMouse x={lerp(0, 760, away)} y={landed ? 340 : mouseY} s={1} rot={landed ? 0 : 90 + Math.sin(frame * 0.6) * 20} step={Math.sin(frame * 0.8)} />
						) : null}
						{!landed && frame >= drop
							? [0, 1, 2].map((i) => <line key={i} x1={-30 + i * 30} y1={mouseY - 160} x2={-30 + i * 30} y2={mouseY - 90} stroke={C.ink} strokeWidth={4} opacity={0.5} />)
							: null}
					</g>
					{landed && frame < walk + 10 ? (
						<g>
							<T x={-140} y={250} size={70}>!</T>
							{[0, 1, 2, 3].map((i) => (
								<line key={i} x1={-200 + Math.cos(i) * 70} y1={350 - Math.sin(i * 0.8) * 40} x2={-200 + Math.cos(i) * 110} y2={350 - Math.sin(i * 0.8) * 70} stroke={C.ink} strokeWidth={5} />
							))}
						</g>
					) : null}
				</Paper>
			</Svg>
			<Pill text="FROM THE ESSAY ITSELF" color="#A86F3C" x={960} y={60} frame={frame} at={4} size={42} />
			<Pill text="A MOUSE... WALKS AWAY" color={C.green} x={960} y={1010} frame={frame} at={walk} size={46} />
			<Finish />
			<Sound name="whoosh" at={drop} volume={0.35} />
			<Sound name="boing" at={bottom} volume={0.35} />
			<Sound name="pop" at={walk} />
		</AbsoluteFill>
	);
};

export const BadNews: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<AbsoluteFill>
			<Sunburst a={C.plumDark} b={C.plum} frame={frame} />
			<Cam zoom={lerp(1, 1.12, span(frame, 0, dur))}>
				<Svg>
					<Dex x={960} y={1050} size={760} face="worried" look={[0, 0.2]} blink={blinkAt(frame)} armL={[25, 40]} armR={[25, 40]} />
				</Svg>
			</Cam>
			<Pill text="BAD NEWS" color={C.red} x={960} y={110} frame={frame} at={cue(l0, 'bad')} size={70} />
			<Finish />
			<Sound name="buzz" at={cue(l0, 'bad')} volume={0.35} />
		</AbsoluteFill>
	);
};

/** A thermometer. `level` 0 (cold) to 1 (warm). */
const Thermo: React.FC<{x: number; y: number; h: number; level: number}> = ({x, y, h, level}) => {
	const col = level > 0.5 ? C.red : C.cyan;
	return (
		<g stroke={C.ink} strokeWidth={6}>
			<rect x={x - 22} y={y - h} width={44} height={h} rx={22} fill="#fff" />
			<circle cx={x} cy={y} r={36} fill={col} />
			<rect x={x - 10} y={y - 20 - (h - 40) * level} width={20} height={20 + (h - 40) * level} rx={10} fill={col} stroke="none" />
		</g>
	);
};

/** A body as a block, with heat leaving through its skin. */
const Block: React.FC<{x: number; y: number; w: number; frame: number; cold: boolean}> = ({x, y, w, frame, cold}) => {
	const arrows = [];
	const n = 3;
	for (let side = 0; side < 4; side++) {
		for (let i = 0; i < n; i++) {
			const f = (i + 0.5) / n;
			const t = ((frame * 0.03 + i * 0.33 + side * 0.17) % 1);
			const len = 30 + w * 0.15;
			const off = w / 2 + 14 + t * 40;
			const [dx, dy, px, py] = side === 0 ? [0, -1, -w / 2 + f * w, 0] : side === 1 ? [1, 0, 0, -w / 2 + f * w] : side === 2 ? [0, 1, -w / 2 + f * w, 0] : [-1, 0, 0, -w / 2 + f * w];
			const sx = x + px + dx * off;
			const sy = y + py + dy * off;
			arrows.push(
				<path
					key={`${side}-${i}`}
					d={`M${sx} ${sy} Q${sx + dx * len * 0.5 + dy * 10} ${sy + dy * len * 0.5 + dx * 10} ${sx + dx * len} ${sy + dy * len}`}
					stroke={C.orange}
					strokeWidth={Math.max(4, w * 0.03)}
					fill="none"
					strokeLinecap="round"
					opacity={1 - t}
				/>,
			);
		}
	}
	return (
		<g>
			{arrows}
			<rect x={x - w / 2} y={y - w / 2} width={w} height={w} rx={w * 0.12} fill={cold ? '#9CC8F0' : C.hoodie} stroke={C.ink} strokeWidth={7} />
		</g>
	);
};

export const Cold: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const diagram = l1.a - 4;
	const shiver = Math.sin(frame * 3.1) * 5;
	return (
		<AbsoluteFill>
			{frame < diagram ? (
				<>
					<Sunburst a="#173B73" b="#3E7FC2" frame={frame} />
					<Svg>
						{[...Array(30)].map((_, i) => {
							const x = (i * 197) % 1920 + Math.sin(frame * 0.05 + i) * 30;
							const y = ((i * 131 + frame * 4) % 1180) - 50;
							return <circle key={i} cx={x} cy={y} r={6 + (i % 3) * 4} fill="#fff" opacity={0.85} />;
						})}
						<Dex x={960 + shiver} y={1040} size={700} face="cold" armL={[40, 125]} armR={[40, 125]} />
					</Svg>
					<Sfx text="brrr" x={1450} y={330} frame={frame} at={l0.a + 6} size={110} color={C.cyan} rotate={8} wobble />
					<Pill text="FEELS LIKE: FREEZING" color={C.cyan} x={960} y={110} frame={frame} at={cue(l0, 'freezing')} size={54} />
				</>
			) : (
				<>
					<Sunburst a={C.navyDark} b={C.navy} frame={frame} />
					<Svg>
						<Block x={620} y={560} w={380} frame={frame} cold={false} />
						<Block x={1300} y={640} w={90} frame={frame} cold={frame > cue(l1, 'smaller')} />
						<Thermo x={330} y={760} h={260} level={0.8} />
						<Thermo x={1560} y={760} h={260} level={track(frame, [[cue(l1, 'smaller'), 0.8], [cue(l1, 'smaller') + 30, 0.18]])} />
						<text x={620} y={860} fontFamily={FONT} fontWeight={700} fontSize={54} fill="#fff" textAnchor="middle">BIG</text>
						<text x={1300} y={860} fontFamily={FONT} fontWeight={700} fontSize={54} fill="#fff" textAnchor="middle">TINY</text>
					</Svg>
					<Pill text="HEAT LEAVES THROUGH SKIN" color={C.orange} x={960} y={110} frame={frame} at={cue(l1, 'skin')} size={50} />
					<Pill text="SMALLER = MORE SKIN FOR YOUR SIZE" color={C.cyan} x={960} y={985} frame={frame} at={cue(l1, 'more skin')} size={46} />
				</>
			)}
			<Finish />
			<Sound name="pop" at={cue(l0, 'freezing')} />
			<Sound name="whoosh" at={diagram} volume={0.3} />
			<Sound name="pop" at={cue(l1, 'skin')} />
			<Sound name="pop" at={cue(l1, 'more skin')} />
		</AbsoluteFill>
	);
};

export const Hungry: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, dex] = lines;
	const scaleAt = cue(l0, 'A shrew') - 6;
	const tilt = frame < scaleAt + 20 ? 0 : Math.sin((frame - scaleAt) * 0.12) * 4 * Math.exp(-(frame - scaleAt - 20) / 40);
	return (
		<AbsoluteFill>
			{frame < dex.a - 6 ? (
				<>
					<Sunburst a={C.navyDark} b={C.navy} frame={frame} />
					<Svg>
						{frame < scaleAt ? (
							<g>
								{[...Array(8)].map((_, i) => {
									const a = (i / 8) * Math.PI * 2 + frame * 0.02;
									return (
										<g key={i} transform={`translate(${960 + Math.cos(a) * 320} ${540 + Math.sin(a) * 260})`}>
											{i % 2 ? (
												<g>
													<circle r={34} fill={C.red} stroke={C.ink} strokeWidth={6} />
													<path d="M-6 -30 Q4 -50 18 -46" stroke="#2E8B3E" strokeWidth={8} fill="none" strokeLinecap="round" />
												</g>
											) : (
												<ellipse rx={30} ry={42} fill="#C98A45" stroke={C.ink} strokeWidth={6} transform={`rotate(${i * 30})`} />
											)}
										</g>
									);
								})}
								<Shrew x={1010} y={640} s={1} frame={frame} />
							</g>
						) : (
							<g>
								<path d="M960 820 L960 330" stroke={C.ink} strokeWidth={16} />
								<path d="M860 840 L1060 840" stroke={C.ink} strokeWidth={18} strokeLinecap="round" />
								<g transform={`rotate(${tilt} 960 330)`}>
									<rect x={480} y={318} width={960} height={24} rx={12} fill={C.woodLight} stroke={C.ink} strokeWidth={6} />
									{[560, 1360].map((px) => (
										<g key={px}>
											<path d={`M${px} 330 L${px - 130} 560 M${px} 330 L${px + 130} 560`} stroke={C.ink} strokeWidth={5} />
											<path d={`M${px - 170} 560 L${px + 170} 560 Q${px + 150} 620 ${px} 620 Q${px - 150} 620 ${px - 170} 560 Z`} fill="#C9CED8" stroke={C.ink} strokeWidth={6} />
										</g>
									))}
									<Shrew x={580} y={570} s={0.62} frame={frame} />
									{[...Array(14)].map((_, i) => (
										<ellipse key={i} cx={1290 + (i % 5) * 34} cy={548 - Math.floor(i / 5) * 26} rx={22} ry={14} fill={['#B0723A', '#D79C55', '#8E5A2B'][i % 3]} stroke={C.ink} strokeWidth={4} />
									))}
								</g>
							</g>
						)}
					</Svg>
					<Pill text="TINY = EAT ALL THE TIME" color={C.orange} x={960} y={110} frame={frame} at={cue(l0, 'eat almost')} size={50} />
					<Pill text="A SHREW EATS ≈ ITS OWN WEIGHT, DAILY" color={C.yellow} x={960} y={985} frame={frame} at={cue(l0, 'own body weight')} size={44} />
				</>
			) : (
				<>
					<Sunburst a={C.plumDark} b={C.plum} frame={frame} />
					<Svg>
						<Dex x={960} y={1050} size={720} face="worried" armL={[25, 95]} armR={[25, 95]} talk={mouth(frame, dex.a, dex.b)} blink={blinkAt(frame, 2)} />
					</Svg>
					<Sfx text="grumble" x={1420} y={760} frame={frame} at={dex.a - 2} size={90} color={C.orange} rotate={-6} wobble />
					<Said text="So I'm hungry... forever?" x={960} y={140} frame={frame} at={dex.a} until={dex.b + 14} size={64} />
				</>
			)}
			<Finish />
			<Sound name="pop" at={cue(l0, 'eat almost')} />
			<Sound name="pop" at={cue(l0, 'own body weight')} />
			<Sound name="rumble" at={dex.a - 4} volume={0.6} />
		</AbsoluteFill>
	);
};

export const Voice: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const wave = (y: number, amp: number, len: number, speed: number) => {
		let d = '';
		for (let x = 260; x <= 1760; x += 6) {
			const v = Math.sin((x / len) * Math.PI * 2 - frame * speed) * amp;
			d += `${x === 260 ? 'M' : 'L'}${x} ${y + v} `;
		}
		return d;
	};
	const tiny = cue(l0, 'tiny voice');
	return (
		<AbsoluteFill>
			<Sunburst a={C.navyDark} b={C.navy} frame={frame} />
			<Svg>
				<rect x={200} y={180} width={1620} height={300} rx={30} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
				<rect x={200} y={600} width={1620} height={300} rx={30} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
				<path d={wave(330, 110, 520, 0.12)} stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" />
				{frame > tiny ? <path d={wave(750, 10 * (frame > cue(l0, 'quiet') ? 0.6 : 1), 26, 0.9)} stroke={C.hoodie} strokeWidth={6} fill="none" /> : null}
			</Svg>
			<Pill text="MUM" color={C.red} x={300} y={180} frame={frame} at={2} size={42} />
			<Pill text="DEX" color={C.yellow} x={300} y={600} frame={frame} at={tiny} size={42} />
			<Pill text="VERY HIGH" color={C.purple} x={1150} y={600} frame={frame} at={cue(l0, 'high')} size={46} />
			<Pill text="VERY QUIET" color={C.cyan} x={1560} y={600} frame={frame} at={cue(l0, 'quiet')} size={46} />
			<Finish />
			<Sound name="pop" at={tiny} />
			<Sound name="pop" at={cue(l0, 'high')} />
			<Sound name="pop" at={cue(l0, 'quiet')} />
		</AbsoluteFill>
	);
};

