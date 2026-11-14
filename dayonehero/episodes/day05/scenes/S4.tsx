import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C} from '../../../brand/colours';
import {FONT} from '../../../brand/fonts';
import {blinkAt, Dex} from '../../../characters/Dex';
import {Mum, PATEL_LOOK} from '../../../characters/Mum';
import {Cam, cue, Finish, lerp, Pill, pop, Said, Sfx, span, Svg, Twinkle, type ShotProps} from '../../../components/ui';
import {Bedroom, BEDROOM} from '../../../sets/Bedroom';
import {Behind, Wood} from '../../../sets/Macro';
import {DustBunny, GoldRing, Spider} from '../../../sets/props2';
import {Shop, SHOP, Street} from '../../../sets/Shop';
import {Big, Explainer, T, UnderFridge, Wipe} from './kit';
import {Sound} from './sound';

// The evening: the corner shop, the ring under the fridge, and the end of the day.

const MUM_POCKET_DX = 70; // the pocket, relative to Mum's feet at size 560
const MUM_POCKET_DY = -230;

/** Mum's cardigan pocket up close, with Dex peeking out. */
const Pocket: React.FC<{frame: number; bob: number; face?: 'happy' | 'sleep' | 'grin'; night?: boolean}> = ({frame, bob, face = 'happy', night}) => (
	<AbsoluteFill>
		<Behind x={960} y={500} zoom={2.2} blur={20}>
			<Street frame={frame} night={night} />
		</Behind>
		<Svg>
			<g transform={`translate(0 ${bob})`}>
				<rect x={-50} y={380} width={2020} height={900} fill={C.mumTop} stroke={C.ink} strokeWidth={10} />
				<path d="M-50 380 L2000 380" stroke="#B9302A" strokeWidth={30} />
				<Dex x={960} y={1000} size={620} face={face} armL={face === 'sleep' ? [40, 100] : [150, 175]} armR={face === 'sleep' ? [40, 100] : [70, 100]} blink={face === 'sleep' ? 0 : blinkAt(frame)} />
				<path d="M380 700 L1540 700 L1540 1200 L380 1200 Z" fill={C.mumTop} stroke={C.ink} strokeWidth={12} />
				<path d="M380 700 L1540 700" stroke="#B9302A" strokeWidth={34} strokeLinecap="round" />
				<path d="M420 760 L1500 760" stroke="#F07A72" strokeWidth={10} strokeDasharray="26 20" />
			</g>
		</Svg>
	</AbsoluteFill>
);

export const Evening: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	if (frame < l1.a - 4) {
		const x = lerp(-200, 1500, span(frame, 0, l1.a + 40, Easing.linear));
		return (
			<AbsoluteFill>
				<Svg>
					<Street frame={frame} />
					<Mum x={x} y={1000} size={560} walk={frame / 18} face="happy" />
					<rect x={x + MUM_POCKET_DX - 30} y={1000 + MUM_POCKET_DY - 8} width={60} height={46} rx={8} fill="#B9302A" stroke={C.ink} strokeWidth={4} />
					<circle cx={x + MUM_POCKET_DX} cy={1000 + MUM_POCKET_DY - 14} r={7} fill={C.hoodie} stroke={C.ink} strokeWidth={3} />
				</Svg>
				<Pill text="THAT EVENING" color={C.purple} x={960} y={110} frame={frame} at={10} size={54} />
				<Pill text="MUM'S POCKET" color={C.red} x={x + MUM_POCKET_DX} y={1000 + MUM_POCKET_DY - 110} frame={frame} at={cue(l0, 'pocket')} size={40} />
				<Wipe frame={frame} />
				<Finish />
				<Sound name="whoosh" at={0} volume={0.4} />
				<Sound name="pop" at={10} />
				<Sound name="pop" at={cue(l0, 'pocket')} />
			</AbsoluteFill>
		);
	}
	const step = Math.abs(Math.sin(frame * 0.18));
	return (
		<AbsoluteFill>
			<Pocket frame={frame} bob={-step * 160 + 60} face={step > 0.7 ? 'happy' : 'grin'} />
			<Pill text="BUMPY RIDE" color={C.orange} x={960} y={110} frame={frame} at={l1.a + 4} size={52} />
			<Pill text="EACH STEP ≈ 2 FLOORS UP" color={C.cyan} x={960} y={200} frame={frame} at={cue(l1, 'two storey')} size={44} />
			<Finish />
			<Sound name="pop" at={l1.a + 4} />
			<Sound name="pop" at={cue(l1, 'two storey')} />
		</AbsoluteFill>
	);
};

const FRIDGE_GAP_X = SHOP.fridgeX + SHOP.fridgeW / 2;

export const ShopShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const fridgeAt = cue(l0, 'fridge');
	return (
		<AbsoluteFill>
			<Svg>
				<Shop />
				<Mum x={720} y={1010} size={600} face="look" look={0.8} />
				<Mum x={1080} y={1010} size={600} face="sad" who={PATEL_LOOK} look={0.5} />
				{frame > fridgeAt ? <path d={`M${FRIDGE_GAP_X - 260} 680 Q${FRIDGE_GAP_X - 120} 640 ${FRIDGE_GAP_X - 40} 770`} stroke={C.yellow} strokeWidth={14} fill="none" strokeLinecap="round" markerEnd="url(#arrow)" /> : null}
				<defs>
					<marker id="arrow" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
						<path d="M0 0 L6 3 L0 6 Z" fill={C.yellow} />
					</marker>
				</defs>
			</Svg>
			<Pill text="MRS PATEL" color="#2A9D8F" x={1080} y={230} frame={frame} at={cue(l0, 'Mrs Patel')} size={50} />
			<Said text="My ring!" x={1080} y={330} frame={frame} at={cue(l0, 'close to tears')} until={fridgeAt + 30} size={56} />
			<Pill text="RING: UNDER THE FRIDGE" color={C.red} x={FRIDGE_GAP_X - 160} y={560} frame={frame} at={fridgeAt} size={40} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'Mrs Patel')} />
			<Sound name="buzz" at={fridgeAt} volume={0.3} />
		</AbsoluteFill>
	);
};

export const Gap: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const handAt = cue(l0, 'hand');
	const broomAt = cue(l0, 'broom');
	const dexAt = l1.a;
	const handX = frame < broomAt ? lerp(1950, 1730, span(frame, handAt - 10, handAt + 10)) : 2100;
	const broomX = frame >= broomAt && frame < dexAt ? lerp(2100, 1720, span(frame, broomAt, broomAt + 12)) + Math.sin(frame * 0.8) * 8 : 2300;
	const dexX = lerp(1300, 1560, span(frame, dexAt, dexAt + 60, Easing.linear));
	return (
		<AbsoluteFill>
			<Cam x={1550} y={780} zoom={4.4}>
				<Svg>
					<Shop />
					<g stroke={C.ink} strokeWidth={2}>
						<rect x={handX} y={770} width={160} height={70} rx={30} fill={C.skin} />
						<rect x={broomX} y={786} width={300} height={14} rx={6} fill="#A8743F" />
					</g>
					{frame >= dexAt ? <Dex x={dexX} y={SHOP.floorY - 4} size={11} walk={frame / 8} face="grin" /> : null}
				</Svg>
			</Cam>
			<Pill text="GAP ≈ 1 CM" color={C.yellow} x={960} y={110} frame={frame} at={6} size={56} />
			<Pill text="TOO SMALL FOR A HAND ✗" color={C.red} x={600} y={260} frame={frame} at={handAt + 8} until={dexAt} size={42} />
			<Pill text="BROOM WON'T REACH ✗" color={C.red} x={1320} y={260} frame={frame} at={broomAt + 8} until={dexAt} size={42} />
			<Pill text="JUST RIGHT FOR DEX ✓" color={C.green} x={960} y={985} frame={frame} at={cue(l1, 'too small') + 4} size={50} />
			<Finish />
			<Sound name="pop" at={6} />
			<Sound name="buzz" at={handAt + 8} volume={0.3} />
			<Sound name="buzz" at={broomAt + 8} volume={0.3} />
			<Sound name="ding" at={cue(l1, 'too small') + 4} />
		</AbsoluteFill>
	);
};

export const Under: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const shift = frame * 3;
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} shift={shift} />
			<Svg>
				<DustBunny x={520 - shift * 0.6} y={830} w={460} frame={frame} />
				<DustBunny x={1650 - shift * 0.6} y={830} w={380} frame={frame} />
				{frame > cue(l0, 'sugar') - 6 ? (
					<g transform={`translate(${1220 - shift * 0.6} 830)`}>
						<rect x={-14} y={-28} width={28} height={28} fill="#fff" stroke={C.ink} strokeWidth={3} transform="rotate(12)" />
					</g>
				) : null}
				<line x1={1700} y1={190} x2={1700} y2={300 + Math.sin(frame * 0.05) * 10} stroke="#C9C2DA" strokeWidth={3} />
				<Spider x={1700} y={360 + Math.sin(frame * 0.05) * 10} s={0.9} frame={frame} />
				<Dex x={lerp(700, 1000, span(frame, 0, dur, Easing.linear))} y={830} size={380} walk={frame / 12} face="worried" look={[0.6, -0.2]} />
			</Svg>
			<Pill text="DUST BUNNY ≈ A SHEEP" color={C.purple} x={560} y={330} frame={frame} at={cue(l0, 'sheep')} size={42} />
			<Pill text="SUGAR GRAIN ≈ TENNIS BALL" color={C.cyan} x={1250} y={985} frame={frame} at={cue(l0, 'sugar')} size={40} />
			<Pill text="A SPIDER" color={C.red} x={1500} y={500} frame={frame} at={cue(l0, 'spider')} size={42} />
			<Finish strength={1.4} />
			<Sound name="pop" at={cue(l0, 'sheep')} />
			<Sound name="pop" at={cue(l0, 'sugar')} />
			<Sound name="pop" at={cue(l0, 'spider')} />
		</AbsoluteFill>
	);
};

export const Puddle: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const t = span(frame, 0, dur, Easing.linear);
	const x = lerp(250, 1700, t);
	const arc = Math.sin(t * Math.PI);
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} />
			<Svg>
				<Dex x={x} y={830 - arc * 70} size={380 - arc * 90} walk={frame / 11} face="grin" look={[0.5, 0.4]} />
				<ellipse cx={960} cy={900} rx={560} ry={70} fill="#5FA8E8" stroke={C.ink} strokeWidth={8} opacity={0.9} />
				<ellipse cx={860} cy={885} rx={260} ry={16} fill="#BFE3F7" opacity={0.7} />
				<path d={`M300 760 Q960 ${720} 1700 760`} stroke={C.green} strokeWidth={8} strokeDasharray="20 16" fill="none" opacity={0.8} />
			</Svg>
			<Pill text="A PUDDLE" color={C.cyan} x={960} y={1010} frame={frame} at={cue(l0, 'puddle')} size={46} />
			<Pill text="RULE 5" color={C.red} x={760} y={110} frame={frame} at={cue(l0, 'Rule five')} size={52} />
			<Pill text="THE LONG WAY ROUND" color={C.green} x={1260} y={110} frame={frame} at={cue(l0, 'long way')} size={44} />
			<Finish strength={1.4} />
			<Sound name="pop" at={cue(l0, 'puddle')} />
			<Sound name="ding" at={cue(l0, 'Rule five')} />
		</AbsoluteFill>
	);
};

export const Warm: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const warmAt = cue(l0, 'first time');
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} warm={1} />
			<Svg>
				{[...Array(8)].map((_, i) => {
					const y = 760 - ((frame * 4 + i * 80) % 560);
					return <path key={i} d={`M${1500 + (i % 3) * 120} ${y} q20 -30 0 -60 q-20 -30 0 -60`} stroke={C.orange} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />;
				})}
				<Dex x={1000} y={830} size={420} face={frame > warmAt ? 'happy' : 'cold'} armL={[70, 95]} armR={[70, 95]} flip />
			</Svg>
			<Pill text="FRIDGE MOTOR: WARM AIR" color={C.orange} x={960} y={110} frame={frame} at={cue(l0, 'motor')} size={48} />
			<Pill text="RULE 1: SORTED ✓" color={C.green} x={960} y={985} frame={frame} at={warmAt + 10} size={50} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'motor')} />
			<Sound name="ding" at={warmAt + 10} />
		</AbsoluteFill>
	);
};

export const RingShot: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const glow = 0.6 + 0.4 * Math.sin(frame * 0.15);
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} warm={0.6} />
			<Svg>
				<GoldRing x={1260} y={840} d={600} glow={glow} />
				{[...Array(6)].map((_, i) => (
					<Twinkle key={i} x={1000 + i * 100} y={260 + (i % 3) * 120} r={28} frame={frame} seed={i} color="#FFE27A" />
				))}
				<Dex x={620} y={830} size={400} face={frame > cue(l0, 'taller') ? 'happy' : 'shock'} look={[0.9, -0.6]} blink={blinkAt(frame, 2)} />
			</Svg>
			<Sfx text="found it!" x={620} y={300} frame={frame} at={cue(l0, 'finds')} size={90} color={C.yellow} />
			<Pill text="TALLER THAN DEX" color={C.yellow} x={1260} y={110} frame={frame} at={cue(l0, 'taller')} size={48} />
			<Finish strength={1.2} />
			<Sound name="sparkle" at={cue(l0, 'finds')} volume={0.45} />
			<Sound name="pop" at={cue(l0, 'taller')} />
		</AbsoluteFill>
	);
};

export const Heavy: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const tryAt = cue(l0, 'tries');
	const strain = frame > tryAt ? Math.sin(frame * 1.1) * 0.5 + 0.5 : 0;
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} warm={0.6} />
			<Svg>
				<GoldRing x={1180} y={840} d={600} />
				<Dex x={900 + strain * 4} y={830} size={400} face={frame > tryAt ? 'yell' : 'grin'} armL={[95, 120]} armR={[95, 120]} tilt={10} squash={1 - strain * 0.04} />
			</Svg>
			<Pill text="RING ≈ 3 G" color={C.yellow} x={1300} y={110} frame={frame} at={cue(l0, 'three grams')} size={52} />
			<Pill text="DEX ≈ 0.01 G" color={C.cyan} x={600} y={110} frame={frame} at={cue(l0, 'hundredth')} size={52} />
			<Big text="≈ 250×" x={960} y={300} size={130} frame={frame} at={cue(l0, 'hundredth') + 20} />
			<Pill text="LIKE YOU LIFTING AN ELEPHANT" color={C.red} x={960} y={985} frame={frame} at={cue(l0, 'elephant')} size={46} />
			<Pill text="TOO HEAVY ✗" color={C.red} x={600} y={460} frame={frame} at={cue(l0, 'far too much')} size={46} rotate={-4} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'three grams')} />
			<Sound name="pop" at={cue(l0, 'hundredth')} />
			<Sound name="pop" at={cue(l0, 'elephant')} />
			<Sound name="buzz" at={cue(l0, 'far too much')} volume={0.3} />
		</AbsoluteFill>
	);
};

export const Wheel: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const wheelAt = cue(l0, 'wheel');
	const rollAt = cue(l0, 'roll it');
	const a = frame > rollAt ? (frame - rollAt) * 3 : 0;
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} warm={0.6} />
			<Svg>
				<GoldRing x={1180 + (frame > rollAt ? (frame - rollAt) * 3 : 0) * 1.6} y={840} d={600} rotate={a} />
				{frame > wheelAt ? (
					<path d="M900 250 A 330 330 0 0 1 1460 250" stroke={C.green} strokeWidth={16} fill="none" strokeLinecap="round" markerEnd="url(#warrow)" />
				) : null}
				<defs>
					<marker id="warrow" markerWidth={5} markerHeight={5} refX={2.5} refY={2.5} orient="auto">
						<path d="M0 0 L5 2.5 L0 5 Z" fill={C.green} />
					</marker>
				</defs>
				<Dex x={760} y={830} size={400} face="grin" armR={frame > rollAt ? [95, 95] : [150, 175]} tilt={frame > rollAt ? 10 : 0} />
			</Svg>
			<Pill text="A RING IS ROUND" color={C.yellow} x={960} y={110} frame={frame} at={cue(l0, 'round')} size={48} />
			<Pill text="ON ITS EDGE = A WHEEL" color={C.green} x={960} y={985} frame={frame} at={wheelAt} size={50} />
			<Sfx text="ROLL IT!" x={1500} y={460} frame={frame} at={rollAt} size={100} color={C.white} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'round')} />
			<Sound name="ding" at={wheelAt} />
		</AbsoluteFill>
	);
};

export const Roll: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const shift = frame * 9;
	const exit = span(frame, cue(l0, 'into the light') - 10, dur);
	return (
		<AbsoluteFill>
			<UnderFridge frame={frame} shift={shift} warm={0.3} />
			<Svg>
				<ellipse cx={1700 - shift * 0.9} cy={900} rx={420} ry={50} fill="#5FA8E8" stroke={C.ink} strokeWidth={8} />
				<line x1={2200 - shift * 0.8} y1={190} x2={2200 - shift * 0.8} y2={330} stroke="#C9C2DA" strokeWidth={3} />
				<Spider x={2200 - shift * 0.8} y={390} s={0.8} frame={frame * 3} />
				<GoldRing x={1100} y={840 - (frame % 30 < 15 ? 0 : 3)} d={560} rotate={frame * 4} />
				<Dex x={790} y={830} size={400} face="grin" armL={[95, 95]} armR={[95, 95]} tilt={14} walk={frame / 9} />
			</Svg>
			<AbsoluteFill style={{background: `linear-gradient(90deg, rgba(255,241,201,0) 0%, rgba(255,241,201,${exit}) 100%)`}} />
			<Finish />
			<Sound name="whoosh" at={cue(l0, 'into the light') - 10} volume={0.3} />
		</AbsoluteFill>
	);
};

export const Return: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0, l1] = lines;
	const outX = lerp(1450, 900, span(frame, 0, 50, Easing.out(Easing.quad)));
	const peek = span(frame, l1.a, l1.a + 14);
	return (
		<AbsoluteFill>
			<Behind x={FRIDGE_GAP_X - 200} y={700} zoom={3} blur={14}>
				<Shop />
			</Behind>
			<Svg>
				<rect x={1300} y={0} width={700} height={720} fill="#E9EEF6" stroke={C.ink} strokeWidth={10} />
				<rect x={1300} y={720} width={700} height={160} fill="#1E1A2A" stroke={C.ink} strokeWidth={10} />
			</Svg>
			<Wood top={880} color="#D9D4CB" dark="#C2BCB0" />
			<Svg>
				<GoldRing x={outX} y={890} d={360} rotate={outX * 0.6} glow={0.4} />
				<Dex x={lerp(1500, 1180, peek)} y={890} size={260} face="happy" armR={[150 + Math.sin(frame * 0.4) * 20, 170]} opacity={peek} />
			</Svg>
			<Sfx text="?!" x={600} y={300} frame={frame} at={cue(l0, "can't believe")} size={150} color={C.white} />
			<Pill text="ALL BY ITSELF?" color={C.purple} x={960} y={110} frame={frame} at={cue(l0, 'all by itself')} size={52} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'all by itself')} />
			<Sound name="sparkle" at={l1.a} volume={0.4} />
		</AbsoluteFill>
	);
};

export const Thanks: React.FC<ShotProps> = ({frame, lines}) => {
	const [l0] = lines;
	const smileAt = cue(l0, 'smiles');
	const p = pop(frame, cue(l0, 'shouts') - 6, 180);
	return (
		<AbsoluteFill>
			<Cam x={1000} y={560} zoom={1.15}>
				<Svg>
					<Shop />
					<Mum x={1080} y={1010} size={600} face={frame > smileAt ? 'happy' : 'found'} who={PATEL_LOOK} holding />
					<circle cx={1080 + 156 * (600 / 560) * (600 / 600)} cy={1010 - 270 * (600 / 560)} r={9} fill="none" stroke="#F2B829" strokeWidth={6} />
				</Svg>
			</Cam>
			<Said text="Thank you, whoever you are." x={1000} y={160} frame={frame} at={4} until={cue(l0, 'shouts') - 4} size={54} />
			{p > 0.01 ? (
				<Svg>
					<g transform={`translate(1600 760) scale(${p})`}>
						<circle r={210} fill="#D9D4CB" stroke={C.ink} strokeWidth={20} />
						<circle r={210} fill="none" stroke="#fff" strokeWidth={8} />
						<Dex x={0} y={170} size={300} face="yell" armR={[155, 175]} armL={[150, 165]} talk={Math.abs(Math.sin(frame * 0.6))} />
					</g>
				</Svg>
			) : null}
			<Said text="You're welcome!" x={1600} y={500} frame={frame} at={cue(l0, 'shouts')} until={cue(l0, "can't hear") + 10} size={26} />
			<Pill text="RULE 4" color={C.red} x={1600} y={1010} frame={frame} at={cue(l0, 'Rule four')} size={44} />
			<Finish />
			<Sound name="pop" at={cue(l0, 'shouts') - 6} />
			<Sound name="ding" at={cue(l0, 'Rule four')} />
			<Sound name="sparkle" at={smileAt} volume={0.35} />
		</AbsoluteFill>
	);
};

export const Home: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const sleepAt = cue(l0, 'asleep');
	if (frame > sleepAt - 6) {
		const bob = Math.sin(frame * 0.12) * 18;
		return (
			<AbsoluteFill>
				<Pocket frame={frame} bob={bob} face="sleep" night />
				<Svg>
					{[0, 1, 2].map((i) => {
						const t = ((frame + i * 25) % 75) / 75;
						return (
							<text key={i} x={1160 + t * 120} y={420 - t * 220} fontFamily={FONT} fontWeight={700} fontSize={60 + i * 16} fill="#fff" opacity={Math.sin(t * Math.PI)} stroke={C.ink} strokeWidth={6} paintOrder="stroke">
								z
							</text>
						);
					})}
				</Svg>
				<Pill text="EXHAUSTED" color={C.purple} x={960} y={110} frame={frame} at={cue(l0, 'exhausting')} size={52} />
				<Finish strength={1.4} />
				<Sound name="pop" at={cue(l0, 'exhausting')} />
			</AbsoluteFill>
		);
	}
	const x = lerp(1900, 300, span(frame, 0, dur, Easing.linear));
	return (
		<AbsoluteFill>
			<Svg>
				<Street frame={frame} night />
				<Mum x={x} y={1000} size={560} walk={frame / 18} face="happy" flip />
			</Svg>
			<Finish strength={1.4} />
		</AbsoluteFill>
	);
};

export const Score: React.FC<ShotProps> = ({frame, lines}) => {
	const [, l1, l2] = lines;
	const rows: Array<[boolean, string, number]> = [
		[true, 'FALL FROM ANYWHERE', cue(l1, 'fall from')],
		[true, 'CARRY BIG THINGS', cue(l1, 'carry')],
		[true, 'SQUEEZE THROUGH GAPS', cue(l1, 'squeeze')],
		[false, 'ALWAYS COLD', cue(l2, 'always cold')],
		[false, 'ALWAYS HUNGRY', cue(l2, 'always hungry')],
		[false, 'NOBODY CAN HEAR YOU', cue(l2, 'nobody')],
		[false, 'THE DOG IS A SKYSCRAPER', cue(l2, 'skyscraper')],
		[false, 'MILK DROPS CAN TRAP YOU', cue(l2, 'drop of milk')],
	];
	return (
		<Explainer frame={frame}>
			<Svg>
				<rect x={400} y={70} width={1120} height={960} rx={40} fill="#fff" stroke={C.ink} strokeWidth={10} />
				<T x={960} y={170} size={76}>
					SHRINKING
				</T>
				<line x1={490} y1={200} x2={1430} y2={200} stroke="#E3DFEA" strokeWidth={6} />
				{rows.map(([good, text, at], i) => {
					const p = pop(frame, at, 240);
					if (p <= 0.01) {
						return null;
					}
					return (
						<g key={i} transform={`translate(520 ${270 + i * 98}) scale(${p})`}>
							<circle r={34} fill={good ? C.green : C.red} stroke={C.ink} strokeWidth={6} />
							{good ? <path d="M-15 0 L-4 12 L17 -13" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
							<T x={64} y={18} size={52} anchor="start">
								{text}
							</T>
						</g>
					);
				})}
			</Svg>
			<Wipe frame={frame} />
			<Finish />
			<Sound name="whoosh" at={0} volume={0.4} />
			{rows.map(([good, , at], i) => (
				<Sound key={i} name={good ? 'ding' : 'buzz'} at={at} volume={good ? 0.5 : 0.28} />
			))}
		</Explainer>
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
			<Pill text="DAY 6?" color={C.blue} x={960} y={150} frame={frame} at={cue(l0, 'brand new')} size={80} />
			<Pill text="WHAT POWER NEXT?" color={C.yellow} x={960} y={280} frame={frame} at={cue(l1, 'What should')} size={56} />
			<Sfx text="TELL US IN THE COMMENTS!" x={960} y={930} frame={frame} at={cue(l1, 'comments')} size={90} color={C.white} rotate={-3} />
			<Finish strength={1.4} />
			<Sound name="pop" at={cue(l0, 'brand new')} />
			<Sound name="pop" at={cue(l1, 'What should')} />
			<Sound name="sparkle" at={cue(l1, 'comments')} volume={0.4} />
		</AbsoluteFill>
	);
};
