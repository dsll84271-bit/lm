import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {Biscuit, BiscuitFace} from '../../../characters/Biscuit';
import {blinkAt, Dex} from '../../../characters/Dex';
import {Mum} from '../../../characters/Mum';
import {Cam, cue, Finish, lerp, Paper, Pill, pop, Said, Sfx, shake, span, Svg, type ShotProps} from '../../../components/ui';
import {Kitchen, KITCHEN} from '../../../sets/Kitchen';
import {Wood} from '../../../sets/Macro';
import {BigSlipper, Magnifier, MilkDrop} from '../../../sets/props';
import {Building, Mouse, PondSkater} from '../../../sets/props2';
import {Big, Explainer, KitchenFloor, RuleNote, RuleShot, T, TableMacro} from './kit';
import {Sound} from './sound';

// The morning, part three: Mum can't hear him, Biscuit, and the milk.

const [DX, DY] = KITCHEN.dexDot;

/** A circle that zooms in on tiny Dex. */
const Callout: React.FC<{frame: number; at: number; cx: number; cy: number; children: React.ReactNode; from?: [number, number]}> = ({frame, at, cx, cy, children, from}) => {
	const p = pop(frame, at, 180);
	if (p <= 0.01) {
		return null;
	}
	return (
		<Svg>
			{from ? <line x1={from[0]} y1={from[1]} x2={cx - 160} y2={cy + 160} stroke={C.white} strokeWidth={8} opacity={p} /> : null}
			<g transform={`translate(${cx} ${cy}) scale(${p})`}>
				<defs>
					<clipPath id={`co${cx}`}>
						<circle r={230} />
					</clipPath>
				</defs>
				<g clipPath={`url(#co${cx})`}>
					<rect x={-240} y={-240} width={480} height={480} fill={C.tile} />
					<rect x={-240} y={110} width={480} height={200} fill={C.floor} />
					<rect x={-240} y={100} width={480} height={14} fill={C.white} />
					{children}
				</g>
				<circle r={230} fill="none" stroke={C.ink} strokeWidth={22} />
				<circle r={230} fill="none" stroke={C.white} strokeWidth={10} />
			</g>
		</Svg>
	);
};

export const MumShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const shout = cue(l0, 'shouts');
	const hop = frame > shout - 4 && frame < l1.a ? Math.abs(Math.sin(frame * 0.5)) * 8 : 0;
	return (
		<AbsoluteFill>
			<Cam zoom={lerp(1, 1.06, span(frame, 0, 200))}>
				<Svg>
					<Kitchen />
					<Mum x={KITCHEN.mumX} y={1000} size={620} face={frame < shout ? 'call' : 'look'} calling={frame < shout} look={Math.sin(frame * 0.07)} flip={frame > l1.a && frame % 70 < 35} />
					<Dex x={DX} y={DY - hop} size={9} face="yell" />
				</Svg>
			</Cam>
			<Said text="Dex? Breakfast's ready!" x={560} y={250} frame={frame} at={4} until={shout} size={52} />
			<Callout frame={frame} at={shout - 4} cx={1380} cy={420} from={[DX + 10, DY - 20]}>
				<rect x={-240} y={-240} width={150} height={340} rx={30} fill={C.slipper} stroke={C.ink} strokeWidth={8} opacity={0.8} />
				<Dex x={30} y={190 - hop * 4} size={330} face="yell" armR={[155, 175]} armL={[150, 165]} talk={Math.abs(Math.sin(frame * 0.6))} />
			</Callout>
			<Said text="MUM! DOWN HERE!" x={1380} y={140} frame={frame} at={shout} until={l1.b + 10} size={28} />
			<Pill text="VOLUME: ≈ 0" color={C.purple} x={1380} y={720} frame={frame} at={l1.a} size={50} />
			<Finish />
			<Sound name="pop" at={shout - 4} />
			<Sound name="buzz" at={l1.a} volume={0.3} />
		</AbsoluteFill>
	);
};

export const Folds: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const fastAt = cue(l0, 'Smaller');
	const speed = frame > fastAt ? 1.6 : 0.5;
	const amp = frame > fastAt ? 10 : 22;
	const open = Math.sin(frame * speed) * amp;
	return (
		<Explainer frame={frame}>
			<Svg>
				<g transform="translate(700 560)">
					<path d="M-220 -380 L-220 380 M220 -380 L220 380" stroke="#F2B7A8" strokeWidth={60} />
					<path d="M-220 -380 L-220 380 M220 -380 L220 380" stroke={C.ink} strokeWidth={8} strokeDasharray="1 0" opacity={0.0} />
					<rect x={-250} y={-380} width={500} height={760} rx={60} fill="#F7CFC4" stroke={C.ink} strokeWidth={10} />
					<path d={`M-250 0 Q-120 -40 ${-14 - open} 0 Q-120 40 -250 0 Z`} fill="#E06A7A" stroke={C.ink} strokeWidth={8} />
					<path d={`M250 0 Q120 -40 ${14 + open} 0 Q120 40 250 0 Z`} fill="#E06A7A" stroke={C.ink} strokeWidth={8} />
					{[0, 1, 2].map((i) => {
						const y = 340 - ((frame * 6 + i * 120) % 340);
						return <path key={i} d={`M${-60 + i * 60} ${y} l0 -60 m-16 18 l16 -18 l16 18`} stroke={C.cyan} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
					})}
				</g>
				{frame > cue(l0, 'children') ? (
					<g>
						<Dex x={1450} y={900} size={300} face="happy" talk={Math.abs(Math.sin(frame * 0.6))} />
						<T x={1450} y={980} size={44} color="#fff">KIDS: HIGHER</T>
					</g>
				) : null}
			</Svg>
			<Pill text="VOCAL FOLDS" color={C.red} x={700} y={110} frame={frame} at={cue(l0, 'two small folds')} size={52} />
			<Pill text="SMALLER = FASTER = HIGHER" color={C.purple} x={1350} y={300} frame={frame} at={fastAt} size={44} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'two small folds')} />
			<Sound name="pop" at={fastAt} />
		</Explainer>
	);
};

export const Pitch: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const goAt = cue(l0, 'could end up');
	const topAt = cue(l0, 'top of human hearing');
	const x0 = 220;
	const x1 = 1520;
	const mark = (hz: number) => x0 + (Math.log10(hz / 20) / 3) * (x1 - x0);
	const dexX = lerp(mark(300), 1800, span(frame, goAt, topAt + 30, Easing.inOut(Easing.quad)));
	return (
		<Explainer frame={frame}>
			<Svg>
				<defs>
					<linearGradient id="hear" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#4A6FE0" />
						<stop offset="100%" stopColor="#B068E0" />
					</linearGradient>
				</defs>
				<rect x={x0} y={480} width={x1 - x0} height={90} rx={16} fill="url(#hear)" stroke={C.ink} strokeWidth={8} />
				<rect x={x1} y={480} width={1820 - x1} height={90} rx={16} fill="#3A2448" stroke={C.ink} strokeWidth={8} strokeDasharray="20 14" />
				<T x={(x1 + 1820) / 2} y={540} size={34} color="#C9A4E8">TOO HIGH TO HEAR</T>
				{[20, 200, 2000, 20000].map((hz) => (
					<g key={hz}>
						<line x1={mark(hz)} y1={570} x2={mark(hz)} y2={600} stroke="#fff" strokeWidth={4} />
						<T x={mark(hz)} y={640} size={30} color="#fff">{hz.toLocaleString('en-GB')}</T>
					</g>
				))}
				<T x={960} y={700} size={34} color="#B7C2E8">VIBRATIONS A SECOND</T>
				<line x1={x1} y1={420} x2={x1} y2={620} stroke={C.yellow} strokeWidth={8} />
				{[
					['MUM', mark(200), C.red],
					['A KID', mark(300), C.green],
				].map(([label, x, col]) => (
					<g key={label as string}>
						<path d={`M${x} 470 l-18 -30 l36 0 Z`} fill={col as string} stroke={C.ink} strokeWidth={5} />
						<T x={x as number} y={label === 'MUM' ? 420 : 370} size={36} color="#fff">
							{label}
						</T>
					</g>
				))}
				{frame > goAt - 10 ? (
					<g>
						<path d={`M${dexX} 470 l-18 -30 l36 0 Z`} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
						<Dex x={dexX} y={420} size={120} face={dexX > x1 ? 'yell' : 'smile'} />
					</g>
				) : null}
			</Svg>
			<Pill text="EDGE OF HUMAN HEARING ≈ 20,000" color={C.yellow} x={1250} y={230} frame={frame} at={topAt} size={42} />
			<Finish />
			<Sound name="whoosh" at={goAt} volume={0.3} />
			<Sound name="pop" at={topAt} />
		</Explainer>
	);
};

export const Mice: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const lungAt = cue(l0, 'lungs');
	return (
		<Explainer frame={frame}>
			<Svg>
				{frame < lungAt - 6 ? (
					<Mouse x={820} y={760} s={1.6} frame={frame} squeak />
				) : (
					<g>
						<path d="M640 320 Q860 300 900 560 Q860 820 640 800 Q420 820 380 560 Q420 300 640 320 Z" fill="#F4E3B5" stroke={C.ink} strokeWidth={10} />
						<T x={640} y={930} size={44} color="#fff">A SESAME SEED</T>
						<g transform="translate(1340 560)">
							<ellipse cx={-18} cy={0} rx={14} ry={22} fill="#F28FA5" stroke={C.ink} strokeWidth={4} />
							<ellipse cx={18} cy={0} rx={14} ry={22} fill="#F28FA5" stroke={C.ink} strokeWidth={4} />
							<circle r={70} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
						</g>
						<T x={1340} y={930} size={44} color="#fff">DEX'S LUNGS</T>
					</g>
				)}
			</Svg>
			<Pill text="MICE: SQUEAK IN ULTRASOUND" color={C.purple} x={960} y={110} frame={frame} at={cue(l0, 'ultrasound')} until={lungAt - 6} size={48} />
			<Pill text="TINY LUNGS = TINY SOUND" color={C.cyan} x={960} y={110} frame={frame} at={lungAt} size={50} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'ultrasound')} />
			<Sound name="pop" at={lungAt} />
		</Explainer>
	);
};

export const Stomp: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const hit = l0.b + 4;
	const down = span(frame, hit - 12, hit, Easing.in(Easing.quad));
	const o = shake(frame, hit, 26, 16);
	const nopeAt = hit + 22;
	const run = span(frame, nopeAt + 10, dur, Easing.in(Easing.quad));
	const jump = frame >= hit && frame < hit + 14 ? Math.sin(((frame - hit) / 14) * Math.PI) * 120 : 0;
	return (
		<AbsoluteFill style={{transform: `translate(${o.x}px, ${o.y}px)`}}>
			<KitchenFloor />
			<Svg>
				<BigSlipper x={620} y={lerp(-300, 900, down)} s={0.95} />
				<Dex x={lerp(1300, 2300, run)} y={930 - jump} size={400} face={frame < hit ? 'smile' : 'shock'} look={[-0.8, 0]} walk={frame > nopeAt + 10 ? frame / 7 : undefined} armL={frame >= hit ? [150, 170] : [12, 6]} armR={frame >= hit ? [150, 170] : [12, 6]} />
			</Svg>
			<Sfx text="STOMP!" x={760} y={300} frame={frame} at={hit} size={170} />
			<Said text="Nope. Nope, nope, nope." x={1300} y={420} frame={frame} at={nopeAt} until={dur} size={54} />
			<Finish />
			<Sound name="stomp" at={hit} volume={0.7} />
		</AbsoluteFill>
	);
};

export const Rule4: React.FC<ShotProps> = ({frame, lines}) => (
	<RuleShot frame={frame} n={4} lines={['NOBODY CAN', 'HEAR YOU.']} at={lines[0].a}>
		<KitchenFloor />
		<Svg>
			<Dex x={500} y={930} size={420} face="worried" blink={blinkAt(frame)} />
		</Svg>
	</RuleShot>
);

export const BiscuitShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const inAt = cue(l0, 'Biscuit');
	const x = lerp(2300, 1300, span(frame, inAt - 20, inAt + 40, Easing.out(Easing.cubic)));
	return (
		<AbsoluteFill>
			<Cam zoom={1.04}>
				<Svg>
					<Kitchen />
					<Biscuit x={x} y={1000} s={0.55} frame={frame} walk={frame < inAt + 40 ? frame / 12 : undefined} flip />
					<Dex x={DX} y={DY} size={9} face="shock" />
				</Svg>
			</Cam>
			<Pill text="BISCUIT" color={C.orange} x={1300} y={300} frame={frame} at={inAt + 4} size={60} />
			<Pill text="FROM DAY 4" color={C.blue} x={1300} y={400} frame={frame} at={cue(l0, 'down the road')} size={40} />
			<Finish />
			<Sound name="pop" at={inAt + 4} />
		</AbsoluteFill>
	);
};

export const DogSize: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const upAt = cue(l0, 'If you scaled');
	const grow = span(frame, upAt, upAt + 40, Easing.out(Easing.cubic));
	const ground = 960;
	const H = 780; // 70 m on screen
	const floorH = H / 23;
	return (
		<Explainer frame={frame}>
			<Svg>
				{frame > cue(l0, 'twenty storey') - 10 ? <Building x={1180} y={ground} w={380} h={floorH * 20} floors={20} /> : null}
				<line x1={0} y1={ground} x2={1920} y2={ground} stroke="#fff" strokeWidth={6} opacity={0.4} />
				<g transform={`translate(560 ${ground}) scale(${lerp(0.12, 1.45, grow)})`}>
					<Biscuit x={0} y={0} s={1} frame={frame} />
				</g>
				{grow > 0.9 ? (
					<g>
						<line x1={1000} y1={ground} x2={1000} y2={ground - H} stroke={C.yellow} strokeWidth={8} />
						<T x={1000} y={ground - H - 20} size={50} color={C.yellow} outline>
							≈ 70 M
						</T>
					</g>
				) : null}
			</Svg>
			<Pill text="SCALED UP ×140" color={C.orange} x={480} y={110} frame={frame} at={upAt} size={50} />
			<Pill text="TALLER THAN 20 FLOORS" color={C.cyan} x={1370} y={110} frame={frame} at={cue(l0, 'twenty storey')} size={46} />
			<Finish />
			<Sound name="shrink" at={upAt} volume={0.3} />
			<Sound name="pop" at={cue(l0, 'twenty storey')} />
		</Explainer>
	);
};

export const Sniff: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const runAt = cue(l1, 'Dex runs');
	const sniffing = frame < runAt ? 1 : 0;
	const blow = sniffing * Math.max(0, Math.sin(frame * 0.8));
	const run = span(frame, runAt, dur, Easing.in(Easing.quad));
	return (
		<AbsoluteFill>
			<KitchenFloor />
			<Svg>
				<BiscuitFace x={760} y={lerp(80, 40, Math.sin(frame * 0.05))} s={0.95} frame={frame} sniff={sniffing} />
				{sniffing
					? [...Array(6)].map((_, i) => {
							const t = ((frame * 0.07 + i / 6) % 1);
							return <line key={i} x1={1500 - t * 600} y1={650 + i * 40} x2={1700 - t * 600} y2={650 + i * 40} stroke="#fff" strokeWidth={8} opacity={0.6 * (1 - t)} strokeLinecap="round" />;
						})
					: null}
				<Dex x={lerp(1350, 2300, run)} y={930} size={380} face={run > 0 ? 'shock' : 'worried'} tilt={-6 * blow} walk={run > 0 ? frame / 6 : undefined} armL={[40 + blow * 30, 60]} armR={[40, 60]} look={[-0.8, -0.6]} />
			</Svg>
			<Sfx text="SNIFF!" x={1250} y={300} frame={frame} at={6} until={runAt} size={120} color={C.white} wobble />
			<Pill text="SOUNDS LIKE: JET ENGINE" color={C.red} x={1460} y={500} frame={frame} at={cue(l0, 'jet engine')} until={runAt} size={38} />
			<Pill text="FEELS LIKE: HURRICANE" color={C.cyan} x={1460} y={580} frame={frame} at={cue(l0, 'hurricane')} until={runAt} size={38} />
			<RuleNote n="5 (DAY 4)" lines={['DOGS', 'KNOW.']} frame={frame} at={cue(l0, 'Dogs know')} x={480} y={760} scale={0.7} />
			<Sfx text="hello!" x={760} y={900} frame={frame} at={cue(l1, 'say hello') - 4} until={runAt} size={90} color={C.yellow} rotate={4} />
			<Finish />
			<Sound name="whoosh" at={6} volume={0.5} />
			<Sound name="whoosh" at={40} volume={0.4} />
			<Sound name="ding" at={cue(l0, 'Dogs know')} volume={0.5} />
		</AbsoluteFill>
	);
};

export const Milk: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const reach = cue(l0, 'reaches');
	const x = lerp(300, 1000, span(frame, 0, reach, Easing.linear));
	return (
		<AbsoluteFill>
			<TableMacro at={[930, 560]} />
			<Svg>
				<MilkDrop x={1360} y={890} r={200} wobble={frame * 0.2} />
				<Dex x={x} y={890} size={400} walk={frame < reach ? frame / 14 : undefined} face={frame > l1.a ? 'worried' : 'happy'} look={frame > l1.a ? [0, 0.2] : [0.8, 0]} armR={frame > reach ? [85, 90] : [12, 6]} blink={blinkAt(frame, 1)} />
			</Svg>
			<Pill text="THIRSTY" color={C.cyan} x={960} y={110} frame={frame} at={cue(l0, 'thirsty')} size={52} />
			<Sfx text="uh-oh" x={760} y={300} frame={frame} at={l1.a} size={100} color={C.white} rotate={-6} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'thirsty')} />
		</AbsoluteFill>
	);
};

/** Where Dex's right hand is, for armR [90, 90], leaning back by `tilt` degrees. */
const handOf = (x: number, y: number, size: number, tilt: number) => {
	const k = size / 400;
	const lx = 144 * k;
	const ly = -160 * k;
	const r = (tilt * Math.PI) / 180;
	return [x + lx * Math.cos(r) - ly * Math.sin(r), y + lx * Math.sin(r) + ly * Math.cos(r)];
};

/** Dex stuck to the milk drop. `snap` is the frame he pops free, or Infinity. */
const Stuck: React.FC<{frame: number; snap: number}> = ({frame, snap}) => {
	const tug = frame < snap ? Math.max(0, Math.sin(frame * 0.35)) : 0;
	const back = Math.min(1, frame / 60);
	const x = frame < snap ? lerp(1010, 860, back) - tug * 40 : lerp(860, 520, span(frame, snap, snap + 10, Easing.out(Easing.cubic)));
	const tilt = frame < snap ? -12 - tug * 8 : lerp(-20, -50, span(frame, snap, snap + 8));
	const [hx, hy] = handOf(x, 890, 400, tilt);
	return (
		<Svg>
			<Dex x={x} y={frame < snap ? 890 : 890 - Math.max(0, 1 - (frame - snap) / 10) * 60} size={400} face={frame < snap ? 'yell' : frame < snap + 30 ? 'shock' : 'worried'} armR={frame < snap ? [90, 90] : [130, 160]} armL={[60, 30]} tilt={tilt} squash={frame > snap + 9 && frame < snap + 16 ? 0.86 : 1} />
			<MilkDrop x={1360} y={890} r={200} pull={frame < snap ? Math.min(1, frame / 12) : 0} tx={hx} ty={hy} wobble={frame * 0.4} />
			{frame >= snap && frame < snap + 18
				? [...Array(6)].map((_, i) => {
						const a = (i / 6) * Math.PI * 2;
						const d = (frame - snap) * 16;
						return <circle key={i} cx={hx + 120 + Math.cos(a) * d} cy={hy + Math.sin(a) * d} r={16} fill="#fff" stroke={C.ink} strokeWidth={4} />;
					})
				: null}
		</Svg>
	);
};

export const Tension: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	return (
		<AbsoluteFill>
			<TableMacro at={[930, 560]} />
			<Stuck frame={frame} snap={Infinity} />
			<Pill text="SURFACE TENSION" color={C.cyan} x={960} y={110} frame={frame} at={cue(l0, 'surface tension')} size={56} />
			<Pill text="LIKE A STRETCHY SKIN" color={C.purple} x={960} y={210} frame={frame} at={cue(l0, 'stretchy')} size={44} />
			<Pill text="BIG + HEAVY: YOU DON'T NOTICE" color={C.green} x={960} y={985} frame={frame} at={cue(l0, 'barely notice')} size={42} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'stretchy')} />
			<Sound name="pop" at={cue(l0, 'surface tension')} />
			<Sound name="pop" at={cue(l0, 'barely notice')} />
		</AbsoluteFill>
	);
};

export const Skater: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const backAt = cue(l0, 'And it') - 4;
	const snap = dur - 40;
	if (frame < backAt) {
		return (
			<Explainer frame={frame}>
				<Svg>
					<rect x={0} y={640} width={1920} height={440} fill="#3A86C8" />
					<path d={`M0 640 ${[...Array(25)].map((_, i) => `Q${i * 80 + 40} ${640 + Math.sin(frame * 0.1 + i) * 6} ${(i + 1) * 80} 640`).join(' ')}`} stroke="#9CD2F0" strokeWidth={8} fill="none" />
					<PondSkater x={960 + Math.sin(frame * 0.03) * 200} y={580} s={1.6} />
				</Svg>
				<Pill text="TINY BODY: SURFACE TENSION IS STRONG" color={C.cyan} x={960} y={110} frame={frame} at={cue(l0, 'strong')} size={42} />
				<Pill text="POND SKATER" color={C.green} x={960} y={320} frame={frame} at={cue(l0, 'pond skaters')} size={52} />
				<Finish />
				<Sound name="pop" at={cue(l0, 'strong')} />
				<Sound name="pop" at={cue(l0, 'pond skaters')} />
			</Explainer>
		);
	}
	const f = frame - backAt + 60;
	const snapF = snap - backAt + 60;
	return (
		<AbsoluteFill>
			<TableMacro at={[930, 560]} />
			<Stuck frame={f} snap={snapF} />
			<Pill text="ONE DROP CAN TRAP YOU" color={C.red} x={960} y={110} frame={frame} at={backAt + 4} size={52} />
			<Sfx text="POP!" x={1080} y={360} frame={frame} at={snap} until={snap + 26} size={140} color={C.white} />
			<Finish />
			<Sound name="pop" at={backAt + 4} />
			<Sound name="snap" at={snap} volume={0.6} />
			<Sound name="boing" at={snap + 9} volume={0.4} />
		</AbsoluteFill>
	);
};

export const Cliff: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const p = pop(frame, 2, 160);
	const q = (text: string, y: number) => (
		<T x={0} y={y} size={64}>
			{text}
		</T>
	);
	return (
		<AbsoluteFill>
			<Svg>
				<rect width={1920} height={1080} fill="#3B2719" />
				<g transform={`translate(960 ${lerp(1300, 540, p)})`}>
					<Paper x={0} y={0} w={1400} h={640} rotate={-1}>
						{q('“An insect going for a drink', -140)}
						{q('is in as great danger as a man', -50)}
						{q('leaning out over a precipice.”', 40)}
						<T x={0} y={190} size={40} color="#7A5A2E">
							J. B. S. HALDANE, 1926
						</T>
					</Paper>
				</g>
			</Svg>
			<Pill text="HALDANE AGAIN" color={C.orange} x={960} y={90} frame={frame} at={cue(l0, 'Haldane')} size={50} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.35} />
			<Sound name="pop" at={cue(l0, 'Haldane')} />
		</AbsoluteFill>
	);
};

export const Rule5: React.FC<ShotProps> = ({frame, lines}) => (
	<RuleShot frame={frame} n={5} lines={['STAY AWAY', 'FROM DRINKS.']} at={lines[0].a}>
		<TableMacro at={[930, 560]} />
		<Svg>
			<MilkDrop x={1100} y={890} r={200} wobble={frame * 0.2} />
			<Dex x={420} y={890} size={400} face="worried" look={[0.8, 0]} blink={blinkAt(frame)} />
		</Svg>
	</RuleShot>
);

export const Found: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const slide = span(frame, 0, 22, Easing.out(Easing.cubic));
	const lx = lerp(2500, 1260, slide);
	const ly = 450;
	const r = 330;
	const smile = frame > cue(l0, 'magnifying') - 10;
	const wave = Math.sin(frame * 0.4) * 20;
	return (
		<AbsoluteFill>
			<TableMacro at={[980, 560]} />
			<Svg>
				<Dex x={660} y={890} size={400} face={smile ? 'happy' : 'smile'} armR={[150 + wave, 170 + wave]} blink={blinkAt(frame, 3)} />
				<defs>
					<clipPath id="lens">
						<circle cx={lx} cy={ly} r={r} />
					</clipPath>
				</defs>
				<g clipPath="url(#lens)">
					<rect x={lx - r} y={ly - r} width={r * 2} height={r * 2} fill={C.skin} />
					<path d={`M${lx - r} ${ly - r * 0.7} Q${lx} ${ly - r * 1.05} ${lx + r} ${ly - r * 0.8} L${lx + r} ${ly - r} L${lx - r} ${ly - r} Z`} fill={C.mumHair} />
					<path d={`M${lx - 190} ${ly - 170} Q${lx} ${ly - 230} ${lx + 190} ${ly - 160}`} stroke="#C9A04A" strokeWidth={26} fill="none" strokeLinecap="round" />
					{smile ? (
						<path d={`M${lx - 170} ${ly + 30} Q${lx} ${ly - 140} ${lx + 170} ${ly + 30}`} stroke={C.ink} strokeWidth={34} fill="none" strokeLinecap="round" />
					) : (
						<g>
							<ellipse cx={lx} cy={ly} rx={130} ry={170} fill={C.ink} />
							<circle cx={lx + 45} cy={ly - 60} r={42} fill="#fff" />
							<circle cx={lx - 40} cy={ly + 70} r={18} fill="#fff" />
						</g>
					)}
					<ellipse cx={lx + 200} cy={ly + 230} rx={110} ry={60} fill={C.cheek} opacity={0.8} />
				</g>
				<Magnifier x={lx} y={ly} r={r} />
			</Svg>
			<Said text="There you are!" x={1260} y={70} frame={frame} at={cue(l0, 'finds')} until={frame + 999} size={60} />
			<Pill text="FOUND HIM ✓" color={C.green} x={600} y={200} frame={frame} at={cue(l0, 'magnifying')} size={50} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.4} />
			<Sound name="ding" at={cue(l0, 'magnifying')} />
		</AbsoluteFill>
	);
};

