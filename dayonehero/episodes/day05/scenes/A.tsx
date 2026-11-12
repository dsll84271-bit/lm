import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {FONT} from '../../../brand/fonts';
import {blinkAt, Dex, mouth} from '../../../characters/Dex';
import {Cam, cue, Finish, lerp, Pill, pop, Said, Sfx, shake, span, Svg, track, Twinkle, type ShotProps} from '../../../components/ui';
import {Bedroom, BEDROOM} from '../../../sets/Bedroom';
import {Behind, DuvetWall, PillowTop, Wood} from '../../../sets/Macro';
import {AlarmClock, Brick, Ruler, SugarCube, ToyCar} from '../../../sets/props';
import {Sound} from './sound';

// Part A: waking up small, and the fun part.

/** The floor at Dex's size, with the bedroom blurred behind. */
export const FloorMacro: React.FC<{frame: number; at?: [number, number]; top?: number; shift?: number}> = ({frame, at = [1170, 700], top = 860, shift = 0}) => (
	<>
		<Behind x={at[0] + shift * 0.15} y={at[1]} zoom={4}>
			<Bedroom frame={frame} slippers={false} />
		</Behind>
		<Wood top={top} shift={shift} />
	</>
);

export const Alarm: React.FC<ShotProps> = ({frame}) => (
	<AbsoluteFill>
		<Behind x={BEDROOM.clock[0]} y={BEDROOM.clock[1] - 40} zoom={3.2} blur={22}>
			<Bedroom frame={frame} />
		</Behind>
		<Svg>
			<AlarmClock x={960} y={930} s={2.6} frame={frame} ringing />
		</Svg>
		<Sfx text="RING!" x={1420} y={300} frame={frame} at={3} size={150} wobble />
		<Sfx text="RING!" x={480} y={420} frame={frame} at={40} size={110} rotate={8} wobble />
		<Finish />
		<Sound name="alarm" at={0} volume={0.35} />
	</AbsoluteFill>
);

export const Room: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const big = cue(l1, 'big');
	const push = span(frame, 0, big, Easing.inOut(Easing.quad));
	const dive = span(frame, big - 4, dur, Easing.in(Easing.cubic));
	const [px, py] = BEDROOM.pillow;
	const zoom = lerp(1, 1.18, push) * lerp(1, 7, dive);
	return (
		<AbsoluteFill>
			<Cam x={lerp(lerp(960, 900, push), px, dive)} y={lerp(540, py, dive)} zoom={zoom}>
				<Svg>
					<Bedroom frame={frame} />
					<Dex x={px + 10} y={py + 4} size={5} face="shock" />
				</Svg>
			</Cam>
			<Pill text="NEW POWER EVERY DAY" color={C.green} x={960} y={110} frame={frame} at={cue(l0, 'brand') - 6} until={big - 6} size={52} />
			<Pill text="DAY 5" color={C.blue} x={960} y={200} frame={frame} at={cue(l0, 'power')} until={big - 6} size={48} />
			<Sfx text="?" x={960} y={420} frame={frame} at={big - 2} until={dur - 6} size={130} color={C.white} rotate={8} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'brand') - 6} />
			<Sound name="pop" at={cue(l0, 'power')} />
			<Sound name="whoosh" at={big - 4} volume={0.5} />
		</AbsoluteFill>
	);
};

export const Pillow: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const pull = span(frame, 6, dur, Easing.out(Easing.cubic));
	const lookX = track(frame, [
		[0, 0],
		[l0.a + 4, -0.9],
		[l0.a + 20, 0.9],
		[l0.a + 36, 0],
	]);
	return (
		<AbsoluteFill>
			<Behind x={BEDROOM.pillow[0]} y={BEDROOM.pillow[1] - 20} zoom={lerp(6, 4, pull)} blur={24}>
				<Bedroom frame={frame} />
			</Behind>
			<Cam zoom={lerp(1.45, 1, pull)} y={lerp(560, 540, pull)}>
				<PillowTop top={700} />
				<Svg>
					<Dex x={960} y={780} size={330} face={frame > l0.a + 30 ? 'worried' : 'shock'} look={[lookX, -0.3]} talk={mouth(frame, l0.a, l0.b)} blink={blinkAt(frame, 2)} armL={[30, 70]} armR={[30, 70]} />
				</Svg>
			</Cam>
			<Said text="Huh? Why is my pillow a mountain?" x={960} y={170} frame={frame} at={l0.a} until={l0.b + 8} size={58} />
			<Finish />
		</AbsoluteFill>
	);
};

export const Title: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const at = cue(l0, 'shrunk') - 2;
	const p = pop(frame, at, 160);
	const shrink = span(frame, at, at + 26, Easing.out(Easing.cubic));
	const letters = 'SHRINKING'.split('');
	return (
		<AbsoluteFill>
			<Cam x={1330} y={440} zoom={lerp(1.5, 1.62, span(frame, 0, dur))}>
				<Svg>
					<Bedroom frame={frame} />
					{[...Array(9)].map((_, i) => (
						<Twinkle key={i} x={1560 + ((i * 67) % 200)} y={190 + ((i * 131) % 480)} r={26} frame={frame} seed={i} />
					))}
				</Svg>
			</Cam>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{display: 'flex', transform: `scale(${p * lerp(2.3, 1, shrink)})`, opacity: Math.min(1, p * 2)}}>
					{letters.map((ch, i) => (
						<span
							key={i}
							style={{
								fontFamily: FONT,
								fontWeight: 700,
								fontSize: 190,
								color: C.white,
								WebkitTextStroke: `18px ${C.ink}`,
								paintOrder: 'stroke fill',
								textShadow: `0 12px 0 ${C.ink}`,
								display: 'inline-block',
								transform: `translateY(${Math.sin(frame * 0.25 + i * 0.7) * 6}px) rotate(${Math.sin(frame * 0.2 + i) * 3}deg)`,
								letterSpacing: 4,
							}}
						>
							{ch}
						</span>
					))}
				</div>
			</AbsoluteFill>
			<Finish />
			<Sound name="shrink" at={at} volume={0.45} />
			<Sound name="sparkle" at={at + 4} volume={0.4} />
		</AbsoluteFill>
	);
};

export const RulerShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const cmAt = cue(l0, 'one centimetre');
	const sugarAt = cue(l0, 'Smaller');
	const cm = 330;
	const lineP = span(frame, cmAt, cmAt + 12);
	const cube = pop(frame, sugarAt - 4, 180);
	return (
		<AbsoluteFill>
			<Behind x={BEDROOM.clock[0] - 60} y={BEDROOM.clock[1] - 50} zoom={4.2}>
				<Bedroom frame={frame} />
			</Behind>
			<Wood top={850} color={C.woodLight} dark={C.wood} />
			<Svg>
				<Ruler x={430} y={870} cm={cm} count={2} />
				<line x1={560} y1={870 - 20 - cm} x2={lerp(560, 830, lineP)} y2={870 - 20 - cm} stroke={C.red} strokeWidth={8} strokeDasharray="22 14" opacity={lineP > 0 ? 1 : 0} />
				<Dex x={900} y={870} size={cm + 20} face={frame > sugarAt ? 'shock' : 'smile'} look={frame > sugarAt ? [0.9, -0.6] : [-0.6, -0.2]} blink={blinkAt(frame, 4)} />
				<g transform={`translate(1380 870) scale(1 ${cube})`}>
					<SugarCube x={0} y={0} w={cm * 1.5} />
				</g>
			</Svg>
			<Pill text="HEIGHT: ≈ 1 CM" color={C.yellow} x={760} y={150} frame={frame} at={cmAt} size={54} />
			<Pill text="SUGAR CUBE: TALLER" color={C.cyan} x={1420} y={140} frame={frame} at={sugarAt + 6} size={46} />
			<Finish />
			<Sound name="pop" at={cmAt} />
			<Sound name="pop" at={sugarAt + 6} />
		</AbsoluteFill>
	);
};

export const Fun: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const yay = cue(l0, 'amazing') - 4;
	const jump = frame > yay ? Math.abs(Math.sin((frame - yay) * 0.22)) * 90 : 0;
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} />
			<Svg>
				<Dex x={960} y={930 - jump} size={470} face={frame > yay ? 'happy' : 'grin'} armL={frame > yay ? [160, 170] : [20, 10]} armR={frame > yay ? [160, 170] : [20, 10]} squash={jump < 8 && frame > yay ? 0.92 : 1} />
				{frame > yay ? [...Array(12)].map((_, i) => <Twinkle key={i} x={300 + ((i * 263) % 1300)} y={150 + ((i * 157) % 500)} r={30} frame={frame} seed={i} color={[C.yellow, C.cyan, C.white][i % 3]} />) : null}
			</Svg>
			<Finish />
			<Sound name="sparkle" at={yay} volume={0.45} />
		</AbsoluteFill>
	);
};

export const Ride: React.FC<ShotProps> = ({frame, dur}) => {
	const shift = frame * 26;
	const bump = Math.abs(Math.sin(frame * 0.6)) * 6;
	const carX = lerp(-200, 1060, span(frame, 0, 26, Easing.out(Easing.cubic)));
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} shift={shift} at={[700, 700]} />
			<Svg>
				{[...Array(6)].map((_, i) => {
					const y = 380 + i * 70;
					const x = ((i * 410 - frame * 60) % 2200 + 2200) % 2200 - 140;
					return <line key={i} x1={x} y1={y} x2={x + 260} y2={y} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.6} />;
				})}
				<g transform={`translate(0 ${-bump})`}>
					<ToyCar x={carX} y={960} s={0.62} frame={frame} />
					<Dex x={carX + 40} y={960 - 0.62 * 400} size={300} face="happy" armL={[150, 160]} armR={[120, 140]} tilt={-4} />
				</g>
			</Svg>
			<Pill text="FREE RIDES" color={C.green} x={960} y={120} frame={frame} at={10} until={dur - 4} size={60} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.5} />
			<Sound name="pop" at={10} />
		</AbsoluteFill>
	);
};

export const Hide: React.FC<ShotProps> = ({frame, dur}) => {
	const up = track(frame, [
		[6, 0],
		[16, 1],
		[dur - 14, 1],
		[dur - 4, 0.3],
	]);
	const look = Math.sin(frame * 0.12);
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} />
			<Svg>
				<Dex x={960} y={lerp(1300, 1010, up)} size={400} face="grin" look={[look, 0]} noSlippers blink={blinkAt(frame, 3)} />
				{/* the slipper, in front of him */}
				<g stroke={C.ink} strokeWidth={10} strokeLinejoin="round">
					<path d="M180 1100 Q140 860 420 830 L1500 830 Q1800 840 1820 980 L1820 1100 Z" fill={C.slipper} />
					<path d="M420 830 Q960 890 1500 830" fill="none" stroke={C.slipperDark} strokeWidth={22} />
					<circle cx={1640} cy={870} r={90} fill={C.white} />
				</g>
			</Svg>
			<Pill text="BEST HIDING PLACE" color={C.purple} x={960} y={130} frame={frame} at={14} until={dur - 4} size={56} />
			<Finish />
			<Sound name="pop" at={14} />
		</AbsoluteFill>
	);
};

export const Lift: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const lift = span(frame, 6, 22, Easing.out(Easing.back(1.6)));
	const wob = Math.sin(frame * 0.5) * 2;
	const head = 900 - 345 * 0.955;
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} />
			<Svg>
				<g transform={`rotate(${wob} 960 ${head})`}>
					<Brick x={960} y={lerp(900, head + 10, lift)} w={420} />
				</g>
				<Dex x={960} y={900} size={345} face={lift > 0.5 ? 'grin' : 'smile'} armL={[lerp(20, 168, lift), lerp(10, 175, lift)]} armR={[lerp(20, 168, lift), lerp(10, 175, lift)]} squash={1 - 0.04 * lift} />
			</Svg>
			<Pill text="STRONG FOR HIS SIZE" color={C.orange} x={960} y={110} frame={frame} at={cue(l0, 'super strong')} size={54} />
			<Pill text="MUSCLES: WEAKER" color={C.red} x={460} y={420} frame={frame} at={cue(l1, 'muscles')} size={44} rotate={-3} />
			<Pill text="WEIGHT: WAY, WAY LIGHTER" color={C.green} x={1450} y={420} frame={frame} at={cue(l1, 'weight')} size={44} rotate={3} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'super strong')} />
			<Sound name="pop" at={cue(l1, 'muscles')} />
			<Sound name="pop" at={cue(l1, 'weight')} />
		</AbsoluteFill>
	);
};

export const Fall: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, whoa, ok] = lines;
	const stepOff = l0.b - 2;
	const land = ok.a - 10;
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
							const x = lerp(420, 1250, span(t, 0, stepOff, Easing.linear));
							const drop = frame > stepOff ? (frame - stepOff) ** 2 * 6 : 0;
							return <Dex x={x} y={770 + drop} size={300} walk={frame < stepOff ? frame / 16 : undefined} face={frame > stepOff - 6 ? 'shock' : 'smile'} look={[0.8, 0]} armL={frame > stepOff ? [160, 170] : [12, 6]} armR={frame > stepOff ? [160, 170] : [12, 6]} />;
						})()}
					</Svg>
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
					<Said text="Whoooa!" x={1150 + sway} y={220} frame={frame} at={whoa.a} until={whoa.b + 10} size={70} />
				</>
			) : (
				<AbsoluteFill style={{transform: `translate(${o.x}px, ${o.y}px)`}}>
					<FloorMacro frame={frame} at={[620, 720]} />
					<Svg>
						<Dex
							x={1000}
							y={930 - Math.max(0, (land + 6 - frame) * 40)}
							size={420}
							face={frame > ok.a ? 'happy' : 'shock'}
							squash={track(frame, [
								[land + 4, 1],
								[land + 7, 0.8],
								[land + 14, 1],
							])}
							armR={frame > ok.a ? [150, 175] : [40, 30]}
							armL={[25, 15]}
							talk={mouth(frame, ok.a, ok.b)}
						/>
					</Svg>
					<Said text="I'm okay!" x={1000} y={330} frame={frame} at={ok.a} until={dur} size={64} />
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
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} at={[620, 720]} />
			<Svg>
				{[...Array(16)].map((_, i) => {
					const x = 200 + ((i * 211) % 1500) + Math.sin(frame * 0.05 + i) * 30;
					const y = ((i * 97 + frame * 2.2) % 760) + 60;
					return <circle key={i} cx={x} cy={y} r={6 + (i % 3) * 3} fill="#fff" opacity={0.55} />;
				})}
				{/* air pushing up */}
				{[0, 1, 2].map((i) => {
					const y = 640 - ((frame * 3 + i * 60) % 180);
					return <path key={i} d={`M${1350 + i * 70} ${y + 120} L${1350 + i * 70} ${y} M${1330 + i * 70} ${y + 24} L${1350 + i * 70} ${y} L${1370 + i * 70} ${y + 24}`} stroke={C.cyan} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
				})}
				<Dex x={720} y={930} size={440} face="grin" armR={[150, 175]} blink={blinkAt(frame, 1)} />
			</Svg>
			<Pill text="AIR SLOWS SMALL THINGS" color={C.cyan} x={1420} y={200} frame={frame} at={cue(l0, 'air')} size={46} />
			<Pill text="FALLING: HARMLESS ✓" color={C.green} x={1420} y={300} frame={frame} at={cue(l0, 'falling')} size={46} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'air')} />
			<Sound name="ding" at={cue(l0, 'falling')} />
		</AbsoluteFill>
	);
};

