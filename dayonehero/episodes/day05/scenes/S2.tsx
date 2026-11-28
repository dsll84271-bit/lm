import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {blinkAt, Dex} from '../../../characters/Dex';
import {Cam, cue, Finish, lerp, Paper, Pill, pop, Said, Sfx, shake, span, Svg, track, Twinkle, type ShotProps} from '../../../components/ui';
import {Bedroom} from '../../../sets/Bedroom';
import {Kitchen} from '../../../sets/Kitchen';
import {Behind, DuvetWall} from '../../../sets/Macro';
import {Shrew} from '../../../sets/props';
import {Ant, Cornflake, Crumb} from '../../../sets/props2';
import {Big, Explainer, FloorMacro, Print, RuleShot, Study, T, TableMacro, Wipe} from './kit';
import {Sound} from './sound';

// The morning, part two: food, the fall, Haldane, and strength.

export const Breakfast: React.FC<ShotProps> = ({frame, dur}) => (
	<AbsoluteFill>
		<Cam x={lerp(960, 1100, span(frame, 0, dur))} y={lerp(540, 560, span(frame, 0, dur))} zoom={lerp(1, 1.4, span(frame, 0, dur))}>
			<Svg>
				<Kitchen />
			</Svg>
		</Cam>
		<Pill text="NEXT PROBLEM: BREAKFAST" color={C.orange} x={960} y={110} frame={frame} at={8} size={58} />
		<Wipe frame={frame} />
		<Finish />
		<Sound name="whoosh" at={0} volume={0.4} />
		<Sound name="pop" at={8} />
	</AbsoluteFill>
);

const Scale: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const tilt = frame < at + 20 ? 0 : Math.sin((frame - at) * 0.12) * 4 * Math.exp(-(frame - at - 20) / 40);
	return (
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
	);
};

const Clock: React.FC<{x: number; y: number; r: number; frame: number; speed: number}> = ({x, y, r, frame, speed}) => {
	const a = frame * speed;
	return (
		<g stroke={C.ink}>
			<circle cx={x} cy={y} r={r} fill="#fff" strokeWidth={10} />
			{[...Array(12)].map((_, i) => {
				const t = (i / 12) * Math.PI * 2;
				return <circle key={i} cx={x + Math.sin(t) * r * 0.8} cy={y - Math.cos(t) * r * 0.8} r={6} fill={C.ink} stroke="none" />;
			})}
			<line x1={x} y1={y} x2={x + Math.sin(a / 12) * r * 0.5} y2={y - Math.cos(a / 12) * r * 0.5} strokeWidth={12} strokeLinecap="round" />
			<line x1={x} y1={y} x2={x + Math.sin(a) * r * 0.75} y2={y - Math.cos(a) * r * 0.75} strokeWidth={8} strokeLinecap="round" />
			<circle cx={x} cy={y} r={10} fill={C.red} />
		</g>
	);
};

export const Fuel: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const scaleAt = cue(l0, 'Shrews');
	const clockAt = cue(l0, 'every few hours');
	const starveAt = cue(l0, 'starve');
	return (
		<Explainer frame={frame}>
			<Svg>
				{frame < scaleAt ? (
					<g>
						{[...Array(10)].map((_, i) => (
							<path key={i} d={`M${700 + i * 60} ${700 - ((frame * 6 + i * 40) % 300)} q10 -30 0 -60 q-10 -30 0 -60`} stroke={C.orange} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
						))}
						<Dex x={960} y={1000} size={520} face="cold" armL={[40, 125]} armR={[40, 125]} />
					</g>
				) : (
					<g>
						<Scale frame={frame} at={scaleAt} />
						{frame > clockAt ? <Clock x={1620} y={760} r={150} frame={frame} speed={0.4} /> : null}
					</g>
				)}
			</Svg>
			<Pill text="TINY BODY = BURNS FUEL ALL DAY" color={C.orange} x={960} y={110} frame={frame} at={cue(l0, 'burn fuel')} until={scaleAt - 2} size={48} />
			<Pill text="≈ OWN WEIGHT IN FOOD, DAILY" color={C.yellow} x={960} y={110} frame={frame} at={cue(l0, 'body weight')} size={48} />
			<Pill text="EAT EVERY FEW HOURS" color={C.cyan} x={1560} y={960} frame={frame} at={clockAt} size={40} />
			<Pill text="NO FOOD: < 1 DAY" color={C.red} x={560} y={985} frame={frame} at={starveAt} size={52} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'burn fuel')} />
			<Sound name="pop" at={cue(l0, 'body weight')} />
			<Sound name="pop" at={clockAt} />
			<Sound name="buzz" at={starveAt} volume={0.3} />
		</Explainer>
	);
};

export const CrumbShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const mealAt = cue(l0, 'proper meal');
	const snacks = [cue(l0, 'snack', 0), cue(l0, 'snack', 1), cue(l0, 'snack', 2)];
	const bite = span(frame, mealAt, mealAt + 60);
	const chew = frame > mealAt ? Math.abs(Math.sin(frame * 0.5)) : 0;
	return (
		<AbsoluteFill>
			<TableMacro at={[880, 560]} />
			<Svg>
				<Crumb x={1150} y={880} w={420} bite={bite} />
				<Dex x={800} y={890} size={400} face={frame > mealAt ? 'happy' : 'grin'} talk={chew} armR={[80, 70]} look={[0.8, 0]} blink={blinkAt(frame, 3)} />
			</Svg>
			<Pill text="1 CRUMB = A PROPER MEAL" color={C.green} x={960} y={110} frame={frame} at={mealAt} size={50} />
			{snacks.map((s, i) => (
				<Pill key={i} text="SNACK" color={C.yellow} x={1300 + i * 120} y={330 + i * 120} frame={frame} at={s} size={50} rotate={(i - 1) * 6} />
			))}
			<Sfx text="nom" x={640} y={380} frame={frame} at={mealAt + 8} until={mealAt + 50} size={90} color={C.orange} />
			<Finish />
			<Sound name="pop" at={mealAt} />
			{snacks.map((s, i) => (
				<Sound key={i} name="pop" at={s} />
			))}
		</AbsoluteFill>
	);
};

export const Journey: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const kmAt = cue(l0, 'two kilometres');
	const stepAt = cue(l1, 'four millimetres');
	const halfAt = cue(l1, 'half an hour');
	const walk = span(frame, 20, l1.b + 20, Easing.linear) * 0.35;
	// path from bedroom (left) to kitchen (right)
	const pts: Array<[number, number]> = [
		[-480, 120],
		[-200, 120],
		[-200, -60],
		[300, -60],
		[300, 120],
		[480, 120],
	];
	const along = (t: number) => {
		const segs = pts.length - 1;
		const f = Math.min(segs - 0.001, t * segs);
		const i = Math.floor(f);
		const k = f - i;
		return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
	};
	const [mx, my] = along(walk);
	return (
		<AbsoluteFill>
			<Study />
			<Svg>
				<Paper x={960} y={540} w={1400} h={760} rotate={0}>
					<g stroke={C.ink} strokeWidth={8} fill="none">
						<rect x={-620} y={-300} width={1240} height={600} />
						<path d="M-320 -300 L-320 40 M-320 160 L-320 300 M180 -300 L180 0 M180 120 L180 300 M-320 40 L-120 40" />
					</g>
					<T x={-470} y={-220} size={40} color="#7A5A2E">BEDROOM</T>
					<T x={420} y={-220} size={40} color="#7A5A2E">KITCHEN</T>
					<path d={`M${pts.map((p) => p.join(' ')).join(' L')}`} stroke={C.red} strokeWidth={6} strokeDasharray="18 14" fill="none" />
					<circle cx={mx} cy={my} r={12} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
					<circle cx={480} cy={120} r={22} fill="none" stroke={C.green} strokeWidth={6} />
				</Paper>
			</Svg>
			<Pill text="THE HOUSE: ≈ 15 M" color={C.cyan} x={600} y={70} frame={frame} at={cue(l0, 'other end')} size={44} />
			<Pill text="FOR DEX: ≈ 2 KM" color={C.orange} x={1320} y={70} frame={frame} at={kmAt} size={44} />
			<Pill text="1 STEP ≈ 4 MM" color={C.purple} x={600} y={1010} frame={frame} at={stepAt} size={44} />
			<Pill text="TRIP ≈ 30 MINUTES" color={C.red} x={1320} y={1010} frame={frame} at={halfAt} size={44} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'other end')} />
			<Sound name="pop" at={kmAt} />
			<Sound name="pop" at={stepAt} />
			<Sound name="pop" at={halfAt} />
		</AbsoluteFill>
	);
};

export const Rule2: React.FC<ShotProps> = ({frame, lines}) => (
	<RuleShot frame={frame} n={2} lines={['EAT ALL', 'THE TIME.']} at={lines[0].a}>
		<TableMacro at={[880, 560]} />
		<Svg>
			<Crumb x={1150} y={880} w={420} bite={1} />
			<Dex x={560} y={890} size={400} face="happy" talk={Math.abs(Math.sin(frame * 0.5))} armR={[80, 70]} look={[0.8, 0]} />
		</Svg>
	</RuleShot>
);

export const Fall: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const stepOff = l0.b - 4;
	const land = dur - 46;
	const phase = frame < stepOff + 10 ? 'edge' : frame < land ? 'fall' : 'land';
	const sway = Math.sin(frame * 0.18) * 60;
	const o = shake(frame, land, 10, 10);
	return (
		<AbsoluteFill>
			{phase === 'edge' ? (
				<>
					<Behind x={520} y={560} zoom={4.5}>
						<Bedroom frame={frame} />
					</Behind>
					<Svg>
						<path d="M-40 760 L1180 760 Q1240 760 1240 820 L1240 1100 L-40 1100 Z" fill={C.duvet} stroke={C.ink} strokeWidth={10} />
						<path d="M0 840 Q500 820 1150 850" stroke={C.duvetDark} strokeWidth={10} strokeDasharray="30 22" fill="none" />
						{(() => {
							const t = Math.min(frame, stepOff);
							const x = lerp(380, 1250, span(t, 0, stepOff, Easing.linear));
							const drop = frame > stepOff ? (frame - stepOff) ** 2 * 6 : 0;
							return <Dex x={x} y={770 + drop} size={300} walk={frame < stepOff ? frame / 16 : undefined} face={frame > stepOff - 6 ? 'shock' : 'grin'} look={[0.8, 0]} armL={frame > stepOff ? [160, 170] : [12, 6]} armR={frame > stepOff ? [160, 170] : [12, 6]} />;
						})()}
					</Svg>
					<Pill text="SHORTCUT!" color={C.green} x={960} y={140} frame={frame} at={cue(l0, 'shortcut')} size={56} />
				</>
			) : phase === 'fall' ? (
				<>
					<Behind x={1000} y={lerp(560, 760, span(frame, stepOff, land))} zoom={4}>
						<Bedroom frame={frame} />
					</Behind>
					<DuvetWall scroll={frame * 18} />
					<Svg>
						{[...Array(7)].map((_, i) => {
							const x = 760 + i * 150;
							const y = ((i * 300 - frame * 40) % 1400 + 1400) % 1400 - 200;
							return <line key={i} x1={x} y1={y} x2={x} y2={y + 180} stroke="#fff" strokeWidth={8} opacity={0.5} strokeLinecap="round" />;
						})}
						<Dex x={1150 + sway} y={720} size={330} face="shock" armL={[165, 175]} armR={[165, 175]} tilt={Math.sin(frame * 0.18) * 10} />
					</Svg>
					<Said text="Whoooa!" x={1150 + sway} y={220} frame={frame} at={stepOff + 12} until={land - 4} size={70} />
				</>
			) : (
				<AbsoluteFill style={{transform: `translate(${o.x}px, ${o.y}px)`}}>
					<FloorMacro frame={frame} at={[620, 720]} />
					<Svg>
						<Dex
							x={1000}
							y={930 - Math.max(0, (land + 6 - frame) * 40)}
							size={420}
							face={frame > land + 14 ? 'happy' : 'shock'}
							squash={track(frame, [
								[land + 4, 1],
								[land + 7, 0.8],
								[land + 14, 1],
							])}
							armR={frame > land + 14 ? [150, 175] : [40, 30]}
							armL={[25, 15]}
						/>
					</Svg>
					<Said text="I'm okay!" x={1000} y={330} frame={frame} at={land + 14} until={dur} size={70} />
				</AbsoluteFill>
			)}
			<Finish />
			<Sound name="whoosh" at={stepOff} volume={0.4} />
			<Sound name="boing" at={land + 6} volume={0.5} />
		</AbsoluteFill>
	);
};

export const FallWhy: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const antAt = cue(l0, 'An ant');
	const loop = (period: number, off = 0) => ((frame + off) % period) / period;
	if (frame >= antAt - 6) {
		const t = frame - (antAt - 6);
		const fallY = Math.min(890, -200 + t * 14);
		const landed = fallY >= 890;
		const walkX = landed ? 1000 + (t - 78) * 9 : 1000;
		return (
			<AbsoluteFill>
				<FloorMacro frame={frame} at={[620, 720]} />
				<Svg>
					<Ant x={walkX} y={fallY} s={0.9} frame={landed ? frame : 0} />
					{!landed ? [0, 1, 2].map((i) => <path key={i} d={`M${940 + i * 60} ${fallY + 60} l0 -60 m-16 18 l16 -18 l16 18`} stroke={C.cyan} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />) : null}
					<Dex x={500} y={930} size={420} face="grin" look={[0.8, -0.3]} blink={blinkAt(frame, 2)} />
				</Svg>
				<Pill text="ANTS: ANY HEIGHT ✓" color={C.green} x={960} y={110} frame={frame} at={antAt + 4} size={56} />
				<Finish />
				<Sound name="pop" at={antAt + 4} />
			</AbsoluteFill>
		);
	}
	const bigY = lerp(-300, 1300, loop(28));
	const smallY = lerp(-150, 1150, loop(220, 40));
	return (
		<Explainer frame={frame}>
			<Svg>
				<line x1={960} y1={180} x2={960} y2={1000} stroke="rgba(255,255,255,0.25)" strokeWidth={6} strokeDasharray="20 20" />
				{frame > cue(l0, 'big and heavy') ? (
					<g>
						<rect x={380} y={bigY - 180} width={240} height={180} rx={20} fill={C.red} stroke={C.ink} strokeWidth={8} />
						<line x1={500} y1={bigY - 200} x2={500} y2={bigY - 360} stroke="#fff" strokeWidth={8} opacity={0.6} />
						<path d={`M500 ${bigY + 40} l0 -40 m-12 14 l12 -14 l12 14`} stroke={C.cyan} strokeWidth={6} fill="none" />
					</g>
				) : null}
				{frame > cue(l0, 'tiny and light') ? (
					<g>
						<Dex x={1420 + Math.sin(frame * 0.15) * 50} y={smallY} size={150} face="happy" armL={[160, 170]} armR={[160, 170]} />
						{[0, 1, 2, 3].map((i) => (
							<path key={i} d={`M${1360 + i * 40} ${smallY + 110} l0 -90 m-18 24 l18 -24 l18 24`} stroke={C.cyan} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
						))}
					</g>
				) : null}
			</Svg>
			<Pill text="AIR PUSHES BACK" color={C.cyan} x={960} y={110} frame={frame} at={cue(l0, 'air pushes')} size={52} />
			<Pill text="BIG + HEAVY: BARELY SLOWED" color={C.red} x={500} y={985} frame={frame} at={cue(l0, 'big and heavy')} size={40} />
			<Pill text="TINY + LIGHT: SLOWED RIGHT DOWN" color={C.green} x={1420} y={985} frame={frame} at={cue(l0, 'tiny and light')} size={40} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'air pushes')} />
			<Sound name="pop" at={cue(l0, 'big and heavy')} />
			<Sound name="pop" at={cue(l0, 'tiny and light')} />
		</Explainer>
	);
};

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
			<Pill text="J. B. S. HALDANE · 1926" color={C.orange} x={960} y={90} frame={frame} at={cue(l0, 'Haldane')} size={50} />
			<Pill text="A FAMOUS ESSAY" color={C.purple} x={960} y={990} frame={frame} at={cue(l0, 'famous')} size={44} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.35} />
			<Sound name="pop" at={cue(l0, 'Haldane')} />
			<Sound name="pop" at={cue(l0, 'famous')} />
		</AbsoluteFill>
	);
};

const SketchMouse: React.FC<{x: number; y: number; rot?: number; step?: number}> = ({x, y, rot = 0, step = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
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
	const drop = cue(l0, 'drop a mouse');
	const bottom = cue(l0, 'slight shock');
	const walk = cue(l0, 'walk away');
	const fall = span(frame, drop, bottom, Easing.in(Easing.quad));
	const away = span(frame, walk, dur + 20, Easing.linear);
	const mouseY = lerp(-300, 330, fall);
	const landed = frame >= bottom;
	return (
		<AbsoluteFill>
			<Study />
			<Svg>
				<Paper x={960} y={520} w={1500} h={860} rotate={1}>
					<g stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round">
						<path d="M-700 -300 L-260 -300 M-140 -300 L700 -300" />
						<path d="M-260 -300 L-260 370 M-140 -300 L-140 370" strokeDasharray="26 14" />
						<path d="M-320 370 L700 370" />
						<path d="M-560 -300 L-560 -400 M-640 -440 L-480 -440 L-480 -390 L-640 -390 Z" />
					</g>
					<T x={-560} y={-404} size={30}>MINE</T>
					<g transform="translate(-200 0)">
						{frame >= drop ? <SketchMouse x={lerp(0, 760, away)} y={landed ? 340 : mouseY} rot={landed ? 0 : 90 + Math.sin(frame * 0.6) * 20} step={Math.sin(frame * 0.8)} /> : null}
						{!landed && frame >= drop ? [0, 1, 2].map((i) => <line key={i} x1={-30 + i * 30} y1={mouseY - 160} x2={-30 + i * 30} y2={mouseY - 90} stroke={C.ink} strokeWidth={4} opacity={0.5} />) : null}
					</g>
					{landed && frame < walk + 10 ? <T x={-140} y={250} size={70}>!</T> : null}
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

export const Rule3: React.FC<ShotProps> = ({frame, lines}) => (
	<RuleShot frame={frame} n={3} lines={['FALLING', 'IS FINE.']} at={lines[0].a}>
		<FloorMacro frame={frame} at={[620, 720]} />
		<Svg>
			<Dex x={560} y={930} size={420} face="happy" armR={[150, 175]} blink={blinkAt(frame)} />
		</Svg>
	</RuleShot>
);

export const Strong: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const shrinkAt = cue(l0, 'When you shrink');
	const s = lerp(1, 0.35, span(frame, shrinkAt, shrinkAt + 90));
	const strength = s * s;
	const weight = s * s * s;
	const H = 560;
	const bar = (x: number, v: number, color: string, label: string) => (
		<g>
			<rect x={x - 110} y={880 - H} width={220} height={H} rx={20} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
			<rect x={x - 110} y={880 - H * v} width={220} height={H * v} rx={20} fill={color} stroke={C.ink} strokeWidth={8} />
			<T x={x} y={950} size={52} color="#fff">
				{label}
			</T>
		</g>
	);
	return (
		<Explainer frame={frame}>
			<Svg>
				{frame > cue(l0, 'muscle') ? bar(620, strength, C.orange, 'STRENGTH') : null}
				{frame > cue(l0, 'how heavy') ? bar(1300, weight, C.cyan, 'WEIGHT') : null}
			</Svg>
			<Pill text="EASIER WHEN SMALL" color={C.green} x={960} y={100} frame={frame} at={cue(l0, 'easier')} size={50} />
			<Pill text="DEPENDS ON THICKNESS" color={C.orange} x={620} y={230} frame={frame} at={cue(l0, 'thick')} size={38} />
			<Pill text="DEPENDS ON WHOLE BODY" color={C.cyan} x={1300} y={230} frame={frame} at={cue(l0, 'whole body')} size={38} />
			<Big text={`STRONG FOR SIZE: ×${(strength / weight).toFixed(1)}`} x={960} y={1030} size={60} frame={frame} at={shrinkAt} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'easier')} />
			<Sound name="pop" at={cue(l0, 'thick')} />
			<Sound name="pop" at={cue(l0, 'whole body')} />
			<Sound name="shrink" at={shrinkAt} volume={0.3} />
		</Explainer>
	);
};

export const CornflakeShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const dexAt = cue(l0, 'Dex can carry');
	if (frame < dexAt - 4) {
		const x = lerp(-300, 2200, span(frame, 0, dexAt, Easing.linear));
		return (
			<AbsoluteFill>
				<FloorMacro frame={frame} at={[900, 700]} />
				<Svg>
					<Ant x={x} y={900} s={1.4} frame={frame} carry />
				</Svg>
				<Pill text="ANTS: CARRY MANY TIMES THEIR WEIGHT" color={C.green} x={960} y={110} frame={frame} at={cue(l0, 'ant')} size={44} />
				<Finish />
				<Sound name="pop" at={cue(l0, 'ant')} />
			</AbsoluteFill>
		);
	}
	const lift = span(frame, dexAt, dexAt + 16, Easing.out(Easing.back(1.6)));
	const head = 930 - 420 * 0.955;
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} />
			<Svg>
				<Cornflake x={960} y={lerp(900, head - 40, lift)} w={560} rotate={Math.sin(frame * 0.2) * 4} />
				<Dex x={960} y={930} size={420} face="grin" armL={[lerp(20, 168, lift), lerp(10, 175, lift)]} armR={[lerp(20, 168, lift), lerp(10, 175, lift)]} />
				{[...Array(5)].map((_, i) => (
					<Twinkle key={i} x={600 + i * 180} y={180 + (i % 2) * 80} r={24} frame={frame} seed={i} />
				))}
			</Svg>
			<Pill text="CORNFLAKE: BIGGER THAN DEX" color={C.yellow} x={960} y={110} frame={frame} at={dexAt + 6} size={48} />
			<Pill text="≈ A FEW TIMES HIS WEIGHT" color={C.orange} x={960} y={990} frame={frame} at={cue(l1, 'few times')} size={46} />
			<Finish />
			<Sound name="pop" at={dexAt + 6} />
			<Sound name="pop" at={cue(l1, 'few times')} />
		</AbsoluteFill>
	);
};
