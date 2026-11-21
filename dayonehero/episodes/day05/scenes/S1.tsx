import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {FONT} from '../../../brand/fonts';
import {blinkAt, Dex} from '../../../characters/Dex';
import {Cam, cue, Finish, lerp, Pill, pop, Said, Sfx, span, Svg, track, Twinkle, type ShotProps} from '../../../components/ui';
import {Bedroom, BEDROOM} from '../../../sets/Bedroom';
import {Behind, PillowTop, Wood} from '../../../sets/Macro';
import {Ruler, Shrew, SugarCube, ToyCar} from '../../../sets/props';
import {Heart, Ladybird, Pencil} from '../../../sets/props2';
import {Big, Cube, Explainer, FloorMacro, RuleShot, T, Wipe} from './kit';
import {Sound} from './sound';

// The morning, part one: waking up small, the fun, and the cold.

const [PX, PY] = BEDROOM.pillow;

export const Open: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const toPillow = span(frame, cue(l0, 'pillow') - 10, cue(l0, 'pillow') + 25);
	const smaller = span(frame, l1.a - 4, l1.b + 6, Easing.inOut(Easing.cubic));
	const zoom = lerp(1, 2.4, toPillow) * lerp(1, 4.5, smaller);
	const ring = lerp(150, 26, smaller);
	return (
		<AbsoluteFill>
			<Cam x={lerp(960, PX, Math.max(toPillow, smaller))} y={lerp(540, PY, Math.max(toPillow, smaller))} zoom={zoom}>
				<Svg>
					<Bedroom frame={frame} />
					<Dex x={PX + 10} y={PY + 2} size={6} face="shock" />
					{toPillow > 0.05 ? <circle cx={PX + 10} cy={PY - 2} r={ring} fill="none" stroke={C.red} strokeWidth={10 / zoom + 3} strokeDasharray={`${24 / zoom + 6} ${14 / zoom + 4}`} opacity={toPillow} /> : null}
				</Svg>
			</Cam>
			<Finish />
			<Sound name="whoosh" at={cue(l0, 'pillow') - 10} volume={0.35} />
			<Sound name="whoosh" at={l1.a - 4} volume={0.45} />
		</AbsoluteFill>
	);
};

export const PillowShot: React.FC<ShotProps> = ({frame, dur}) => {
	const look = track(frame, [
		[0, 0],
		[14, -0.9],
		[34, 0.9],
		[54, 0],
	]);
	return (
		<AbsoluteFill>
			<Behind x={PX} y={PY - 20} zoom={5.5} blur={24}>
				<Bedroom frame={frame} />
			</Behind>
			<Cam zoom={lerp(1.3, 1.05, span(frame, 0, dur, Easing.out(Easing.cubic)))}>
				<PillowTop top={700} />
				<Svg>
					<Dex x={960} y={790} size={400} face={frame > 50 ? 'worried' : 'shock'} look={[look, -0.3]} armL={[30, 70]} armR={[30, 70]} blink={blinkAt(frame, 2)} />
				</Svg>
			</Cam>
			<Said text="Why is my pillow a mountain?" x={960} y={170} frame={frame} at={14} until={dur - 6} size={64} />
			<Finish />
		</AbsoluteFill>
	);
};

export const Intro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const at = cue(l1, 'shrinking') - 2;
	const p = pop(frame, at, 160);
	const shrink = span(frame, at, at + 26, Easing.out(Easing.cubic));
	return (
		<AbsoluteFill>
			<Cam x={1250} y={440} zoom={lerp(1.45, 1.62, span(frame, 0, dur))}>
				<Svg>
					<Bedroom frame={frame} />
					{[...Array(9)].map((_, i) => (
						<Twinkle key={i} x={1560 + ((i * 67) % 200)} y={190 + ((i * 131) % 480)} r={26} frame={frame} seed={i} />
					))}
				</Svg>
			</Cam>
			<Pill text="NEW POWER EVERY DAY" color={C.green} x={960} y={110} frame={frame} at={cue(l0, 'brand') - 4} until={at - 4} size={52} />
			<Pill text="DAY 5" color={C.blue} x={960} y={200} frame={frame} at={cue(l0, 'superpower')} until={at - 4} size={48} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{display: 'flex', transform: `scale(${p * lerp(2.3, 1, shrink)})`, opacity: Math.min(1, p * 2)}}>
					{'SHRINKING'.split('').map((ch, i) => (
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
			<Sound name="pop" at={cue(l0, 'brand') - 4} />
			<Sound name="pop" at={cue(l0, 'superpower')} />
			<Sound name="shrink" at={at} volume={0.45} />
			<Sound name="sparkle" at={at + 4} volume={0.4} />
		</AbsoluteFill>
	);
};

export const RulerShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const cmAt = cue(l0, 'one centimetre');
	const bugAt = cue(l0, 'ladybird') - 10;
	const sugarAt = cue(l0, 'sugar cube') - 4;
	const timesAt = cue(l0, 'hundred and forty');
	const cm = 330;
	const lineP = span(frame, cmAt, cmAt + 12);
	const cube = pop(frame, sugarAt, 180);
	const bugX = lerp(2200, -500, span(frame, bugAt, bugAt + 150, Easing.linear));
	return (
		<AbsoluteFill>
			<Behind x={BEDROOM.clock[0] - 60} y={BEDROOM.clock[1] - 50} zoom={4.2}>
				<Bedroom frame={frame} />
			</Behind>
			<Wood top={850} color={C.woodLight} dark={C.wood} />
			<Svg>
				<Ruler x={330} y={870} cm={cm} count={2} />
				<line x1={460} y1={870 - 20 - cm} x2={lerp(460, 730, lineP)} y2={870 - 20 - cm} stroke={C.red} strokeWidth={8} strokeDasharray="22 14" opacity={lineP > 0 ? 1 : 0} />
				<g transform={`translate(1380 870) scale(1 ${cube})`}>
					<SugarCube x={0} y={0} w={cm * 1.5} />
				</g>
				{frame > bugAt ? <Ladybird x={bugX} y={890} s={0.95} frame={frame} /> : null}
				<Dex x={800} y={870} size={cm + 20} face={frame > sugarAt ? 'shock' : frame > bugAt ? 'happy' : 'smile'} look={frame > sugarAt ? [0.9, -0.6] : frame > bugAt ? [0.8, 0] : [-0.6, -0.2]} blink={blinkAt(frame, 4)} />
			</Svg>
			<Pill text="HEIGHT: ≈ 1 CM" color={C.yellow} x={620} y={150} frame={frame} at={cmAt} size={52} />
			<Pill text="≈ A LADYBIRD" color={C.red} x={620} y={250} frame={frame} at={bugAt + 10} size={44} />
			<Pill text="SUGAR CUBE: TALLER" color={C.cyan} x={1420} y={140} frame={frame} at={sugarAt + 4} size={44} />
			<Big text="≈ 140× SHORTER" x={1300} y={300} size={84} frame={frame} at={timesAt} />
			<Finish />
			<Sound name="pop" at={cmAt} />
			<Sound name="pop" at={bugAt + 10} />
			<Sound name="pop" at={sugarAt + 4} />
			<Sound name="pop" at={timesAt} />
		</AbsoluteFill>
	);
};

export const Hoodie: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const pencilAt = cue(l1, 'Anything') - 4;
	const strain = frame > cue(l1, 'pencil') ? Math.sin(frame * 0.9) * 0.5 + 0.5 : 0;
	const showPencil = frame >= pencilAt;
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} at={[1050, 690]} />
			<Svg>
				{showPencil ? <Pencil x={1250} y={900 - 130} len={2900} rotate={-2 + strain * 0.6} /> : null}
				<Dex
					x={showPencil ? 760 : 960}
					y={930}
					size={420}
					face={showPencil ? (strain > 0 ? 'yell' : 'shock') : 'grin'}
					armL={showPencil ? [70, 95] : [20, 10]}
					armR={showPencil ? [70, 95] : [150, 175]}
					tilt={showPencil ? 8 + strain * 4 : 0}
					look={showPencil ? [0.8, 0] : [0, 0]}
					blink={blinkAt(frame, 1)}
				/>
			</Svg>
			<Pill text="WHAT HE HAD ON: SHRUNK" color={C.cyan} x={1400} y={110} frame={frame} at={cue(l0, 'shrinks')} size={44} />
			<Pill text="FAVOURITE HOODIE ✓" color={C.yellow} x={1400} y={200} frame={frame} at={cue(l0, 'favourite')} size={44} />
			<Pill text="PICKED UP LATER: NORMAL SIZE" color={C.red} x={960} y={990} frame={frame} at={cue(l1, 'stays')} size={44} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'shrinks')} />
			<Sound name="pop" at={cue(l0, 'favourite')} />
			<Sound name="pop" at={cue(l1, 'stays')} />
		</AbsoluteFill>
	);
};

export const Ride: React.FC<ShotProps> = ({frame, dur}) => {
	const shift = frame * 26;
	const bump = Math.abs(Math.sin(frame * 0.6)) * 6;
	const carX = lerp(-200, 1060, span(frame, 0, 20, Easing.out(Easing.cubic)));
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
			<Pill text="RIDE ANYTHING" color={C.green} x={960} y={120} frame={frame} at={4} until={dur - 4} size={60} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.5} />
		</AbsoluteFill>
	);
};

export const Hide: React.FC<ShotProps> = ({frame, dur}) => {
	const up = track(frame, [
		[4, 0],
		[12, 1],
		[dur - 10, 1],
		[dur - 2, 0.3],
	]);
	return (
		<AbsoluteFill>
			<FloorMacro frame={frame} />
			<Svg>
				<Dex x={960} y={lerp(1300, 1010, up)} size={400} face="grin" look={[Math.sin(frame * 0.2), 0]} noSlippers />
				<g stroke={C.ink} strokeWidth={10} strokeLinejoin="round">
					<path d="M180 1100 Q140 860 420 830 L1500 830 Q1800 840 1820 980 L1820 1100 Z" fill={C.slipper} />
					<path d="M420 830 Q960 890 1500 830" fill="none" stroke={C.slipperDark} strokeWidth={22} />
					<circle cx={1640} cy={870} r={90} fill={C.white} />
				</g>
			</Svg>
			<Pill text="HIDE ANYWHERE" color={C.purple} x={960} y={130} frame={frame} at={4} until={dur - 4} size={60} />
			<Finish />
			<Sound name="pop" at={6} />
		</AbsoluteFill>
	);
};

export const Door: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const x = lerp(-250, 2200, span(frame, 0, dur, Easing.linear));
	return (
		<AbsoluteFill>
			<Svg>
				<rect width={1920} height={1080} fill="#FFF0C4" />
				<rect x={0} y={0} width={1920} height={760} fill="#E9C38C" stroke={C.ink} strokeWidth={10} />
				<rect x={120} y={-40} width={1680} height={720} rx={20} fill="#D9AE74" stroke={C.ink} strokeWidth={8} />
				<rect x={0} y={740} width={1920} height={24} fill="#C8925A" stroke={C.ink} strokeWidth={8} />
				<rect x={0} y={1000} width={1920} height={80} fill={C.floor} stroke={C.ink} strokeWidth={8} />
				{[...Array(10)].map((_, i) => (
					<line key={i} x1={i * 220 + 40} y1={790} x2={i * 220 - 20} y2={1000} stroke="#FFE7A8" strokeWidth={14} opacity={0.6} />
				))}
				<Dex x={x} y={1000} size={220} walk={frame / 9} face="happy" />
			</Svg>
			<Pill text="WALK UNDER DOORS" color={C.cyan} x={960} y={120} frame={frame} at={4} size={60} />
			<Sfx text="amazing!" x={1500} y={430} frame={frame} at={cue(l0, 'amazing')} size={90} color={C.yellow} rotate={-6} />
			<Finish />
			<Sound name="sparkle" at={cue(l0, 'amazing')} volume={0.4} />
		</AbsoluteFill>
	);
};

export const BadNews: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const coldAt = cue(l0, 'cold');
	return (
		<AbsoluteFill>
			<Explainer frame={frame} plum>
				<Cam zoom={lerp(1, 1.1, span(frame, 0, dur))}>
					<Svg>
						<Dex x={960} y={1050} size={740} face={frame > coldAt ? 'cold' : 'worried'} look={[0, 0.2]} blink={blinkAt(frame)} armL={[25, 40]} armR={[25, 40]} />
					</Svg>
				</Cam>
			</Explainer>
			<Pill text="BAD NEWS" color={C.red} x={960} y={110} frame={frame} at={cue(l0, 'bad news')} size={70} />
			<Pill text="TINY BODY = COLD, FAST" color={C.cyan} x={960} y={985} frame={frame} at={coldAt} size={52} />
			<Wipe frame={frame} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.4} />
			<Sound name="buzz" at={cue(l0, 'bad news')} volume={0.35} />
			<Sound name="pop" at={coldAt} />
		</AbsoluteFill>
	);
};

export const Heat: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const waves = [];
	for (let i = 0; i < 4; i++) {
		const t = ((frame * 0.025 + i / 4) % 1);
		waves.push(<ellipse key={i} cx={960} cy={720} rx={260 + t * 380} ry={330 + t * 300} fill="none" stroke={C.orange} strokeWidth={14} opacity={(1 - t) * 0.7} strokeDasharray="40 30" />);
	}
	return (
		<Explainer frame={frame}>
			<Svg>
				{waves}
				<Dex x={960} y={1060} size={700} face="smile" blink={blinkAt(frame)} />
			</Svg>
			<Pill text="YOU MAKE HEAT" color={C.orange} x={500} y={200} frame={frame} at={cue(l0, 'making heat')} size={50} rotate={-3} />
			<Pill text="IT ESCAPES THROUGH SKIN" color={C.red} x={1420} y={200} frame={frame} at={cue(l0, 'skin')} size={50} rotate={3} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'making heat')} />
			<Sound name="pop" at={cue(l0, 'skin')} />
		</Explainer>
	);
};

export const Cubes: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const cutAt = cue(l0, 'cut it');
	const twiceAt = cue(l0, 'twice');
	const againAt = cue(l0, 'Keep cutting');
	const split = span(frame, cutAt, cutAt + 18, Easing.out(Easing.back(1.4)));
	const split2 = span(frame, againAt, againAt + 18, Easing.out(Easing.back(1.4)));
	const S = 300;
	const cubes = [];
	if (frame < againAt) {
		if (split <= 0.001) {
			cubes.push(<Cube key="big" x={960} y={330 + S} s={S * 2} />);
		} else {
			// 2 x 2 x 2, drawn back to front
			const h = S;
			const gap = split * 70;
			for (const zz of [1, 0]) {
				for (const yy of [1, 0]) {
					for (const xx of [0, 1]) {
						const ox = (xx - zz) * (h * 0.87 + gap * 0.87);
						const oy = (xx + zz) * (h * 0.5 + gap * 0.5) - yy * (h + gap);
						cubes.push(<Cube key={`${xx}${yy}${zz}`} x={960 + ox} y={330 + S + oy} s={h} glow={split > 0.5} />);
					}
				}
			}
		}
	} else {
		const n = 4;
		const h = (S * 2) / n;
		const gap = split2 * 40;
		for (let zz = n - 1; zz >= 0; zz--) {
			for (let yy = n - 1; yy >= 0; yy--) {
				for (let xx = 0; xx < n; xx++) {
					const ox = (xx - zz) * (h * 0.87 + gap * 0.87);
					const oy = (xx + zz) * (h * 0.5 + gap * 0.5) - yy * (h + gap);
					cubes.push(<Cube key={`${xx}${yy}${zz}`} x={960 + ox} y={330 + S * 0.9 + oy} s={h} glow />);
				}
			}
		}
	}
	const label = frame < twiceAt ? '×1' : frame < againAt + 10 ? '×2' : '×4';
	return (
		<Explainer frame={frame}>
			<Svg>{cubes}</Svg>
			<Pill text="SAME STUFF" color={C.green} x={420} y={180} frame={frame} at={cue(l0, 'same amount')} size={48} />
			<Pill text="OUTSIDE SURFACE" color={C.orange} x={1500} y={180} frame={frame} at={cutAt} size={48} />
			<Big text={label} x={1500} y={330} size={140} frame={frame} at={cutAt} />
			<Finish />
			<Sound name="snap" at={cutAt} volume={0.5} />
			<Sound name="pop" at={twiceAt} />
			<Sound name="snap" at={againAt} volume={0.5} />
		</Explainer>
	);
};

export const Skin: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const smallAt = cue(l0, 'for every gram');
	const arrows = (cx: number, cy: number, r: number, n: number, len: number) =>
		[...Array(n)].map((_, i) => {
			const a = (i / n) * Math.PI * 2;
			const t = ((frame * 0.04 + i * 0.13) % 1);
			const r0 = r + t * len;
			return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * (r0 + len * 0.6)} y2={cy + Math.sin(a) * (r0 + len * 0.6)} stroke={C.orange} strokeWidth={8} strokeLinecap="round" opacity={1 - t} />;
		});
	return (
		<Explainer frame={frame}>
			<Svg>
				<Dex x={560} y={960} size={600} face="smile" />
				{frame > smallAt ? (
					<g>
						{arrows(1400, 840, 60, 18, 120)}
						<Dex x={1400} y={900} size={110} face="cold" />
					</g>
				) : null}
				<T x={560} y={1040} size={52} color="#fff">YESTERDAY</T>
				{frame > smallAt ? <T x={1400} y={1040} size={52} color="#fff">TODAY</T> : null}
			</Svg>
			<Pill text="SKIN FOR EVERY GRAM" color={C.orange} x={960} y={110} frame={frame} at={cue(l0, 'Shrink')} size={52} />
			<Big text="×1" x={560} y={260} size={110} frame={frame} at={cue(l0, 'Shrink') + 6} color={C.white} />
			<Big text="×140" x={1400} y={500} size={150} frame={frame} at={cue(l0, 'hundred and forty times more')} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'Shrink')} />
			<Sound name="pop" at={cue(l0, 'hundred and forty times more')} />
		</Explainer>
	);
};

/** A heart that beats every `period` frames. */
const Beat: React.FC<{x: number; y: number; r: number; frame: number; period: number}> = ({x, y, r, frame, period}) => {
	const t = (frame % period) / period;
	const k = 1 + 0.18 * Math.exp(-t * 8);
	return (
		<g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
			<Heart x={x} y={y} r={r} />
		</g>
	);
};

export const ShrewShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const shrewAt = cue(l0, 'Etruscan');
	const heartAt = cue(l0, 'heart');
	const youAt = cue(l0, 'Yours');
	const ecg = (y: number, period: number, until: number) => {
		let d = '';
		for (let x = 0; x <= 520; x += 4) {
			const ph = ((x + frame * 8) % period) / period;
			const v = ph > 0.45 && ph < 0.5 ? -70 : ph >= 0.5 && ph < 0.55 ? 40 : 0;
			d += `${x === 0 ? 'M' : 'L'}${x} ${y + v} `;
		}
		return frame > until ? <path d={d} stroke="#7CF2A0" strokeWidth={6} fill="none" /> : null;
	};
	return (
		<Explainer frame={frame}>
			<Svg>
				{frame < heartAt ? (
					<g>
						<Shrew x={1000} y={620} s={1.2} frame={frame} />
						{frame > shrewAt ? (
							<g>
								<rect x={700} y={640} width={560} height={40} rx={14} fill="#C9CED8" stroke={C.ink} strokeWidth={6} />
								<rect x={900} y={680} width={160} height={120} rx={10} fill="#8E95A8" stroke={C.ink} strokeWidth={6} />
							</g>
						) : null}
					</g>
				) : (
					<g>
						<g transform="translate(330 300)">
							<rect x={-60} y={-160} width={640} height={320} rx={30} fill="#10183A" stroke={C.ink} strokeWidth={8} />
							<g transform="translate(0 0)">{ecg(0, 900, youAt)}</g>
						</g>
						<g transform="translate(1070 300)">
							<rect x={-60} y={-160} width={640} height={320} rx={30} fill="#10183A" stroke={C.ink} strokeWidth={8} />
							{ecg(0, 70, heartAt)}
						</g>
						{frame > youAt ? <Beat x={570} y={700} r={150} frame={frame} period={26} /> : null}
						<Beat x={1310} y={700} r={90} frame={frame} period={2} />
						<Shrew x={1360} y={980} s={0.5} frame={frame} />
						{frame > youAt ? <Dex x={560} y={1020} size={170} face="smile" /> : null}
					</g>
				)}
			</Svg>
			<Pill text="SMALL ANIMALS = LITTLE FURNACES" color={C.orange} x={960} y={110} frame={frame} at={cue(l0, 'furnaces') - 10} until={heartAt - 2} size={46} />
			<Pill text="ETRUSCAN SHREW" color={C.purple} x={960} y={230} frame={frame} at={shrewAt} until={heartAt - 2} size={50} />
			<Pill text="≈ 2 G" color={C.yellow} x={980} y={880} frame={frame} at={cue(l0, 'two grams')} until={heartAt - 2} size={60} />
			<Pill text="SHREW: 1,000+ BEATS / MIN" color={C.red} x={1370} y={100} frame={frame} at={cue(l0, 'thousand')} size={44} />
			<Pill text="YOU: ≈ 70 / MIN" color={C.cyan} x={570} y={100} frame={frame} at={youAt} size={44} />
			<Finish />
			<Sound name="pop" at={shrewAt} />
			<Sound name="pop" at={cue(l0, 'two grams')} />
			<Sound name="pop" at={cue(l0, 'thousand')} />
			<Sound name="pop" at={youAt} />
		</Explainer>
	);
};

const ColdPillow: React.FC<{frame: number}> = ({frame}) => {
	const shiver = Math.sin(frame * 3.1) * 5;
	return (
		<>
			<Behind x={PX} y={PY - 20} zoom={5.5} blur={24}>
				<Bedroom frame={frame} />
			</Behind>
			<PillowTop top={700} />
			<Svg>
				{[...Array(26)].map((_, i) => {
					const x = (i * 197) % 1920 + Math.sin(frame * 0.05 + i) * 30;
					const y = ((i * 131 + frame * 4) % 1180) - 50;
					return <circle key={i} cx={x} cy={y} r={6 + (i % 3) * 4} fill="#fff" opacity={0.85} stroke="#B9D8F2" strokeWidth={2} />;
				})}
				<Dex x={960 + shiver} y={790} size={420} face="cold" armL={[40, 125]} armR={[40, 125]} />
			</Svg>
			<AbsoluteFill style={{background: 'rgba(120,170,230,0.18)'}} />
		</>
	);
};

export const Freezing: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	return (
		<AbsoluteFill>
			<ColdPillow frame={frame} />
			<Sfx text="brrr" x={1450} y={330} frame={frame} at={cue(l0, 'freezing') - 6} size={120} color={C.cyan} rotate={8} wobble />
			<Pill text="MUCH SMALLER THAN A SHREW" color={C.purple} x={960} y={110} frame={frame} at={cue(l0, 'much smaller')} size={46} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'much smaller')} />
		</AbsoluteFill>
	);
};

export const Rule1: React.FC<ShotProps> = ({frame, lines}) => (
	<RuleShot frame={frame} n={1} lines={['SMALL MEANS', 'COLD.']} at={lines[0].a}>
		<ColdPillow frame={frame} />
	</RuleShot>
);
