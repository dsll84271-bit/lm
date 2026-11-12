import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {FONT} from '../../../brand/fonts';
import {Mum} from '../../../characters/Mum';
import {blinkAt, Dex, mouth} from '../../../characters/Dex';
import {Cam, cue, Finish, lerp, Paper, Pill, pop, Said, Sfx, shake, span, Sunburst, Svg, track, Twinkle, type ShotProps} from '../../../components/ui';
import {Bedroom, BEDROOM} from '../../../sets/Bedroom';
import {Kitchen, KITCHEN} from '../../../sets/Kitchen';
import {Behind, Wood} from '../../../sets/Macro';
import {BigSlipper, Hoop, Magnifier, MilkDrop} from '../../../sets/props';
import {Sound} from './sound';

// Part C: Mum, breakfast, the milk, and the end of the day.

const TableMacro: React.FC<{at?: [number, number]}> = ({at = [1000, 560]}) => (
	<>
		<Behind x={at[0]} y={at[1]} zoom={4.2}>
			<Kitchen />
		</Behind>
		<Wood top={860} color={C.woodLight} dark={C.wood} />
	</>
);

export const MumShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [mum, dex, narr] = lines;
	const [dx, dy] = KITCHEN.dexDot;
	const hop = frame > dex.a - 4 && frame < dex.b + 6 ? Math.abs(Math.sin(frame * 0.5)) * 8 : 0;
	const callout = pop(frame, dex.a - 6, 180);
	return (
		<AbsoluteFill>
			<Cam zoom={lerp(1, 1.06, span(frame, 0, 200))}>
				<Svg>
					<Kitchen />
					<Mum x={KITCHEN.mumX} y={1000} size={620} face={frame < mum.b + 4 ? 'call' : 'look'} calling={frame < mum.b + 4} talk={mouth(frame, mum.a, mum.b)} flip={frame > mum.b + 20 && frame % 70 < 35} look={Math.sin(frame * 0.07)} />
					<Dex x={dx} y={dy - hop} size={9} face="yell" />
				</Svg>
			</Cam>
			<Svg>
				{callout > 0.01 ? (
					<g>
						<line x1={dx + 10} y1={dy - 20} x2={1280} y2={560} stroke={C.white} strokeWidth={8} opacity={callout} />
						<g transform={`translate(1380 420) scale(${callout})`}>
							<defs>
								<clipPath id="callout">
									<circle r={230} />
								</clipPath>
							</defs>
							<g clipPath="url(#callout)">
								<rect x={-240} y={-240} width={480} height={480} fill={C.wall} />
								<rect x={-240} y={110} width={480} height={200} fill={C.floor} />
								<rect x={-240} y={100} width={480} height={14} fill={C.white} />
								<rect x={-240} y={-240} width={150} height={340} rx={30} fill={C.slipper} stroke={C.ink} strokeWidth={8} opacity={0.8} />
								<Dex x={30} y={190 - hop * 4} size={330} face="yell" armR={[155, 175]} armL={[150, 165]} talk={mouth(frame, dex.a, dex.b)} />
							</g>
							<circle r={230} fill="none" stroke={C.ink} strokeWidth={22} />
							<circle r={230} fill="none" stroke={C.white} strokeWidth={10} />
						</g>
					</g>
				) : null}
			</Svg>
			<Said text="Dex? Breakfast! Where are you?" x={560} y={250} frame={frame} at={mum.a} until={mum.b + 10} size={50} />
			<Said text="Mum! Down here! Mum!" x={1380} y={140} frame={frame} at={dex.a} until={dex.b + 10} size={26} />
			<Pill text="VOLUME: ≈ 0" color={C.purple} x={1380} y={720} frame={frame} at={cue(narr, 'hear')} size={50} />
			<Finish />
			<Sound name="pop" at={dex.a - 6} />
			<Sound name="buzz" at={cue(narr, 'hear')} volume={0.3} />
		</AbsoluteFill>
	);
};

export const Stomp: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [nope] = lines;
	const hit = 12;
	const down = span(frame, 0, hit, Easing.in(Easing.quad));
	const o = shake(frame, hit, 26, 16);
	const run = span(frame, nope.a + 8, dur, Easing.in(Easing.quad));
	const jump = frame >= hit && frame < hit + 14 ? Math.sin(((frame - hit) / 14) * Math.PI) * 120 : 0;
	return (
		<AbsoluteFill style={{transform: `translate(${o.x}px, ${o.y}px)`}}>
			<Behind x={KITCHEN.dexDot[0]} y={KITCHEN.dexDot[1] - 120} zoom={5}>
				<Kitchen />
			</Behind>
			<Wood top={880} />
			<Svg>
				<BigSlipper x={620} y={lerp(-300, 900, down)} s={0.95} />
				<Dex
					x={lerp(1300, 2300, run)}
					y={930 - jump}
					size={400}
					face={frame < hit ? 'smile' : 'shock'}
					look={[-0.8, 0]}
					walk={frame > nope.a + 8 ? frame / 7 : undefined}
					talk={mouth(frame, nope.a, nope.b)}
					armL={frame >= hit ? [150, 170] : [12, 6]}
					armR={frame >= hit ? [150, 170] : [12, 6]}
				/>
			</Svg>
			<Sfx text="STOMP!" x={760} y={300} frame={frame} at={hit} size={170} />
			<Said text="Nope. Nope, nope, nope." x={1300} y={420} frame={frame} at={nope.a} until={nope.b + 8} size={52} />
			<Finish />
			<Sound name="stomp" at={hit} volume={0.7} />
		</AbsoluteFill>
	);
};

export const Breakfast: React.FC<ShotProps> = ({frame, dur}) => (
	<AbsoluteFill>
		<Cam x={lerp(960, 1100, span(frame, 0, dur))} y={lerp(540, 560, span(frame, 0, dur))} zoom={lerp(1, 1.55, span(frame, 0, dur))}>
			<Svg>
				<Kitchen />
			</Svg>
		</Cam>
		<Pill text="NEXT PROBLEM: BREAKFAST" color={C.orange} x={960} y={110} frame={frame} at={4} size={58} />
		<Finish />
		<Sound name="pop" at={4} />
	</AbsoluteFill>
);

export const HoopShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	return (
		<AbsoluteFill>
			<TableMacro />
			<Svg>
				<Hoop x={1260} y={880} d={600} />
				<Dex x={620} y={890} size={400} face="shock" look={[0.9, -0.7]} blink={blinkAt(frame, 5)} />
			</Svg>
			<Pill text="1 HOOP > 1 DEX" color={C.yellow} x={960} y={110} frame={frame} at={cue(l0, 'bigger')} size={60} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'bigger')} />
		</AbsoluteFill>
	);
};

export const Milk: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const x = lerp(300, 1000, span(frame, 0, l0.b, Easing.linear));
	const walking = frame < l0.b;
	return (
		<AbsoluteFill>
			<TableMacro at={[930, 560]} />
			<Svg>
				<MilkDrop x={1360} y={890} r={200} wobble={frame * 0.2} />
				<Dex x={x} y={890} size={400} walk={walking ? frame / 14 : undefined} face={frame > l1.a ? 'worried' : 'happy'} look={frame > l1.a ? [0, 0.2] : [0.8, 0]} blink={blinkAt(frame, 1)} />
			</Svg>
			<Sfx text="uh-oh" x={760} y={300} frame={frame} at={l1.a} size={100} color={C.white} rotate={-6} />
			<Finish />
		</AbsoluteFill>
	);
};

/** Where Dex's right hand is, for armR [90, 90], as he leans back by `tilt` degrees. */
const handOf = (x: number, y: number, size: number, tilt: number) => {
	const k = size / 400;
	const lx = 144 * k;
	const ly = -160 * k;
	const r = (tilt * Math.PI) / 180;
	return [x + lx * Math.cos(r) - ly * Math.sin(r), y + lx * Math.sin(r) + ly * Math.cos(r)];
};

export const Surface: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const snap = cue(l0, 'not let go') + 16;
	const tug = frame < snap ? Math.max(0, Math.sin(frame * 0.35)) : 0;
	const back = span(frame, 4, snap, Easing.inOut(Easing.quad));
	const x = frame < snap ? lerp(1010, 830, back) - tug * 40 : lerp(830, 520, span(frame, snap, snap + 10, Easing.out(Easing.cubic)));
	const tilt = frame < snap ? -12 - tug * 8 : lerp(-20, -50, span(frame, snap, snap + 8));
	const size = 400;
	const [hx, hy] = handOf(x, 890, size, tilt);
	const pull = frame < snap ? span(frame, 2, 14) : 0;
	return (
		<AbsoluteFill>
			<TableMacro at={[930, 560]} />
			<Svg>
				<Dex
					x={x}
					y={frame < snap ? 890 : 890 - Math.max(0, 1 - (frame - snap) / 10) * 60}
					size={size}
					face={frame < snap ? 'yell' : frame < snap + 30 ? 'shock' : 'worried'}
					armR={frame < snap ? [90, 90] : [130, 160]}
					armL={[60, 30]}
					tilt={tilt}
					squash={frame > snap + 9 && frame < snap + 16 ? 0.86 : 1}
				/>
				<MilkDrop x={1360} y={890} r={200} pull={pull} tx={hx} ty={hy} wobble={frame * 0.4} />
				{frame >= snap && frame < snap + 18
					? [...Array(6)].map((_, i) => {
							const a = (i / 6) * Math.PI * 2;
							const d = (frame - snap) * 16;
							return <circle key={i} cx={hx + 120 + Math.cos(a) * d} cy={hy + Math.sin(a) * d} r={16} fill="#fff" stroke={C.ink} strokeWidth={4} />;
						})
					: null}
			</Svg>
			<Sfx text="POP!" x={1080} y={360} frame={frame} at={snap} until={snap + 26} size={140} color={C.white} />
			<Pill text="SURFACE TENSION" color={C.cyan} x={960} y={110} frame={frame} at={cue(l0, 'stretchy')} size={56} />
			<Pill text="ONE DROP CAN TRAP YOU" color={C.red} x={960} y={985} frame={frame} at={cue(l0, 'One drop')} size={50} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'stretchy')} />
			<Sound name="pop" at={cue(l0, 'One drop')} />
			<Sound name="snap" at={snap} volume={0.6} />
			<Sound name="boing" at={snap + 9} volume={0.4} />
		</AbsoluteFill>
	);
};

export const Cliff: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const p = pop(frame, 2, 160);
	const q = (text: string, y: number) => (
		<text x={0} y={y} fontFamily={FONT} fontWeight={700} fontSize={64} fill={C.ink} textAnchor="middle">
			{text}
		</text>
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
						<text x={0} y={190} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#7A5A2E" textAnchor="middle">
							J. B. S. HALDANE, 1926
						</text>
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

export const Rule: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const p = pop(frame, l0.a, 200);
	return (
		<AbsoluteFill>
			<Behind x={1500} y={300} zoom={2.2}>
				<Kitchen />
			</Behind>
			<Wood top={990} color={C.woodLight} dark={C.wood} />
			<Svg>
				<g transform={`translate(860 470) rotate(-4) scale(${p})`}>
					<rect x={-380 + 12} y={-230 + 16} width={760} height={460} rx={10} fill="rgba(0,0,0,0.25)" />
					<rect x={-380} y={-230} width={760} height={460} rx={10} fill="#FFE066" stroke={C.ink} strokeWidth={8} />
					<rect x={-90} y={-262} width={180} height={56} rx={6} fill="#CFE8F2" opacity={0.85} stroke={C.ink} strokeWidth={4} />
					<text x={0} y={-60} fontFamily={FONT} fontWeight={700} fontSize={110} fill={C.red} textAnchor="middle">
						RULE 1
					</text>
					<text x={0} y={60} fontFamily={FONT} fontWeight={700} fontSize={62} fill={C.ink} textAnchor="middle">
						NEVER GO NEAR
					</text>
					<text x={0} y={140} fontFamily={FONT} fontWeight={700} fontSize={62} fill={C.ink} textAnchor="middle">
						DRINKS.
					</text>
				</g>
				<Dex x={1560} y={1040} size={420} face="grin" blink={blinkAt(frame)} armR={[150, 175]} look={[-0.6, -0.3]} />
			</Svg>
			<Finish />
			<Sound name="ding" at={l0.a} volume={0.6} />
		</AbsoluteFill>
	);
};

export const Found: React.FC<ShotProps> = ({frame, lines}) => {
	const [mum, narr] = lines;
	const slide = span(frame, 0, 22, Easing.out(Easing.cubic));
	const lx = lerp(2500, 1260, slide);
	const ly = 450;
	const r = 330;
	const smile = frame > mum.a;
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
			<Said text="There you are!" x={1260} y={70} frame={frame} at={mum.a} until={mum.b + 16} size={60} />
			<Pill text="FOUND HIM ✓" color={C.green} x={600} y={200} frame={frame} at={cue(narr, 'found')} size={50} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.4} />
			<Sound name="ding" at={cue(narr, 'found')} />
		</AbsoluteFill>
	);
};

export const Score: React.FC<ShotProps> = ({frame, lines}) => {
	const [, l1, l2] = lines;
	const rows: Array<[boolean, string, number]> = [
		[true, 'STRONG FOR HIS SIZE', cue(l1, 'strong')],
		[true, 'SAFE FALLS', cue(l1, 'fall')],
		[false, 'ALWAYS COLD', cue(l2, 'always cold')],
		[false, 'ALWAYS HUNGRY', cue(l2, 'always hungry')],
		[false, 'NOBODY CAN HEAR HIM', cue(l2, 'nobody')],
		[false, 'DRINKS CAN TRAP HIM', cue(l2, 'milk')],
	];
	const stampAt = l2.b + 4;
	const stamp = pop(frame, stampAt, 260);
	return (
		<AbsoluteFill>
			<Sunburst a={C.navyDark} b={C.navy} frame={frame} />
			<Svg>
				<rect x={430} y={120} width={1060} height={860} rx={40} fill="#fff" stroke={C.ink} strokeWidth={10} />
				<text x={960} y={230} fontFamily={FONT} fontWeight={700} fontSize={80} fill={C.ink} textAnchor="middle">
					SHRINKING
				</text>
				<line x1={520} y1={265} x2={1400} y2={265} stroke="#E3DFEA" strokeWidth={6} />
				{rows.map(([good, text, at], i) => {
					const p = pop(frame, at, 240);
					if (p <= 0.01) {
						return null;
					}
					const y = 340 + i * 105;
					return (
						<g key={i} transform={`translate(560 ${y}) scale(${p})`}>
							<circle r={36} fill={good ? C.green : C.red} stroke={C.ink} strokeWidth={6} />
							{good ? (
								<path d="M-16 0 L-4 13 L18 -14" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
							) : (
								<path d="M-13 -13 L13 13 M13 -13 L-13 13" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
							)}
							<text x={70} y={20} fontFamily={FONT} fontWeight={700} fontSize={56} fill={C.ink}>
								{text}
							</text>
						</g>
					);
				})}
			</Svg>
			{stamp > 0.01 ? (
				<div
					style={{
						position: 'absolute',
						left: 1300,
						top: 820,
						transform: `translate(-50%, -50%) rotate(-12deg) scale(${lerp(2, 1, Math.min(1, stamp))})`,
						opacity: Math.min(1, stamp * 1.5),
						border: `12px solid ${C.red}`,
						borderRadius: 24,
						padding: '10px 34px',
						color: C.red,
						fontFamily: FONT,
						fontWeight: 700,
						fontSize: 96,
						background: 'rgba(255,255,255,0.85)',
						whiteSpace: 'nowrap',
					}}
				>
					NOT WORTH IT
				</div>
			) : null}
			<Finish />
			{rows.map(([good, , at], i) => (
				<Sound key={i} name={good ? 'ding' : 'buzz'} at={at} volume={good ? 0.5 : 0.3} />
			))}
			<Sound name="stomp" at={stampAt} volume={0.5} />
		</AbsoluteFill>
	);
};

export const Next: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const [px, py] = BEDROOM.pillow;
	const zoom = lerp(1.15, 1.6, span(frame, 0, dur));
	return (
		<AbsoluteFill>
			<Cam x={lerp(880, px - 20, span(frame, 0, dur))} y={lerp(500, py, span(frame, 0, dur))} zoom={zoom}>
				<Svg>
					<Bedroom
						frame={frame}
						night
						dexAsleep={
							<g>
								<g transform={`translate(${px - 250} ${py + 20}) rotate(90)`}>
									<Dex x={0} y={0} size={330} face="sleep" />
								</g>
								<path d={`M420 ${py + 2} Q560 ${py - 22} ${px - 82} ${py + 6} L${px - 78} ${py + 120} L420 ${py + 126} Z`} fill={C.duvet} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
							</g>
						}
					/>
					{[0, 1, 2].map((i) => {
						const t = ((frame + i * 25) % 75) / 75;
						return (
							<text key={i} x={px + 40 + t * 80} y={py - 80 - t * 160} fontFamily={FONT} fontWeight={700} fontSize={40 + i * 10} fill="#fff" opacity={Math.sin(t * Math.PI)} stroke={C.ink} strokeWidth={4} paintOrder="stroke">
								z
							</text>
						);
					})}
				</Svg>
			</Cam>
			<Pill text="DAY 6?" color={C.blue} x={960} y={150} frame={frame} at={cue(l0, 'Tomorrow')} size={80} />
			<Pill text="WHAT POWER NEXT?" color={C.yellow} x={960} y={280} frame={frame} at={cue(l1, 'Which')} size={56} />
			<Sfx text="TELL US IN THE COMMENTS!" x={960} y={930} frame={frame} at={cue(l1, 'comments')} size={90} color={C.white} rotate={-3} />
			{[...Array(6)].map((_, i) => (
				<Svg key={i}>
					<Twinkle x={200 + i * 300} y={80 + (i % 2) * 60} r={20} frame={frame} seed={i} />
				</Svg>
			))}
			<Finish strength={1.4} />
			<Sound name="pop" at={cue(l0, 'Tomorrow')} />
			<Sound name="pop" at={cue(l1, 'Which')} />
			<Sound name="sparkle" at={cue(l1, 'comments')} volume={0.4} />
		</AbsoluteFill>
	);
};

