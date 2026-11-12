import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Hero} from '../../../characters/Hero';
import {blinking, cue, lerp, shake, SnapRing, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Big, Bubble, Count, Label, UI} from '../../../components/ui';
import {Desk, Monitor, Room, ROOMS} from '../../../sets/indoor';
import {Ball, Field, Goal} from '../../../sets/outdoor';
import {CAST, close, CityBack, detail, GROUND, H, medium, Shot, Street, wide} from './kit';

// Part 2: having fun with slow time, and the first real lesson.

const INK = '#140A28';

const GYM = {wall: '#4A6FD8', wallDark: '#3A58B8', floor: '#D9A86A', floorDark: '#C48E50', trim: '#FFF3D6'};
const LUNCH = {wall: '#F2A65A', wallDark: '#E08E42', floor: '#C9CED8', floorDark: '#AEB4C2', trim: '#FFF3D6'};

export const Dodge: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slowAt = cue(l0, 'To you');
	const stepAt = cue(l0, 'You just step');
	const ballX = frame < slowAt ? lerp(1700, 1150, span(frame, 0, slowAt, Easing.linear)) : frame < stepAt ? lerp(1150, 1120, span(frame, slowAt, stepAt)) : lerp(1120, 600, span(frame, stepAt, stepAt + 20, Easing.linear));
	const heroX = frame < stepAt ? 960 : lerp(960, 760, span(frame, stepAt, stepAt + 12));
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(1060, 560, 1.05), detail(ballX, 470, 2.2), close(heroX, GROUND, H, 0.08, 3), medium(heroX)]}
			world={
				<Room look={GYM}>
					<rect x={-400} y={GROUND + 120} width={2720} height={8} fill="#fff" opacity={0.7} />
					<Hero who={CAST.bigKid} x={1700} y={GROUND} size={H} face="determined" armR={[100, 110]} flip />
					<Hero x={heroX} y={GROUND} size={H} face={frame > stepAt ? 'smug' : 'shocked'} look={[0.8, -0.2]} />
					<Ball x={ballX} y={470} r={50} color="#E8453C" />
				</Room>
			}
			slow={{at: slowAt, until: stepAt + 20}}
			overlay={
				<>
					<Label text="BALL ≈ 15 M/S" x={480} y={200} frame={frame} at={cue(l0, 'fifteen')} />
					<Label text="SLOWED: 1.5 CM/S" x={1440} y={200} frame={frame} at={cue(l0, 'one and a half')} color={UI.yellow} />
				</>
			}
		/>
	);
};

export const Penalty: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const shotAt = cue(l0, 'A hard penalty');
	const slowAt = cue(l0, 'To you');
	const catchAt = cue(l0, 'pick it out');
	const sitAt = cue(l0, 'The striker');
	const ballX = frame < shotAt ? 1500 : frame < slowAt ? lerp(1500, 1180, span(frame, shotAt, slowAt, Easing.linear)) : frame < catchAt ? lerp(1180, 1080, span(frame, slowAt, catchAt)) : 1060;
	const ballY = frame < shotAt ? GROUND - 40 : frame < catchAt ? lerp(GROUND - 40, 520, span(frame, shotAt, catchAt)) : 520;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(1100, 560, 1.05), close(960, GROUND, H, 0.08), detail(ballX, ballY, 2.3), wide(1300, 560, 1.2), close(1600, GROUND, H, 0.06, -3)]}
			world={
				<g>
					<Field lines="pitch" />
					<Goal x={580} />
					<Hero x={960} y={GROUND} size={H} face={frame > catchAt ? 'smug' : 'determined'} armL={[60, 90]} armR={frame > catchAt ? [100, 130] : [60, 90]} stance={0.8} />
					<Hero who={CAST.friend} x={1620} y={GROUND} size={H} face={frame > sitAt ? 'sad' : 'determined'} sit={frame > sitAt} flip />
					<Ball x={ballX} y={ballY} r={44} />
				</g>
			}
			slow={{at: slowAt, until: catchAt + 10}}
			overlay={
				<>
					<Label text="PENALTY ≈ 30 M/S" x={480} y={200} frame={frame} at={shotAt} />
					<Label text="SLOWED: 3 CM/S" x={1440} y={200} frame={frame} at={cue(l0, 'three centimetres')} color={UI.yellow} />
					<Count from={0} to={10} x={1500} y={760} size={110} frame={frame} at={cue(l0, 'Ten penalties')} dur={30} suffix=" / 10 SAVED" />
				</>
			}
		/>
	);
};

const HandShape: React.FC<{x: number; y: number; open: number}> = ({x, y, open}) => (
	<g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={7}>
		<circle r={90} fill="#FFD08A" />
		{[...Array(4)].map((_, i) => (
			<rect key={i} x={-70 + i * 40} y={-90 - 90 * open} width={34} height={20 + 90 * open} rx={16} fill="#FFD08A" />
		))}
	</g>
);

export const Rps: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slowAt = cue(l0, 'For you');
	const winsAt = cue(l0, 'You win');
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), close(700, GROUND, H, 0.08), close(1260, GROUND, H, 0.08, 3), medium(1000)]}
			world={
				<Room look={ROOMS.classroom}>
					<Hero x={700} y={GROUND} size={H} face={frame > slowAt ? 'smug' : 'determined'} armR={[90, 90]} fists />
					<Hero who={CAST.crowdA} x={1260} y={GROUND} size={H} face="determined" armL={[90, 90]} fists={frame < slowAt || Math.floor(frame / 40) % 2 === 0} flip />
				</Room>
			}
			slow={{at: slowAt, until: winsAt}}
			overlay={
				<>
					<Label text="HANDS GIVE AWAY ≈ 0.25 S EARLY" x={960} y={200} frame={frame} at={cue(l0, 'quarter of a second')} />
					<Label text="SLOWED: 4 MINUTES" x={1440} y={860} frame={frame} at={cue(l0, 'four whole')} color={UI.yellow} />
					<Count from={0} to={50} x={480} y={420} size={120} frame={frame} at={winsAt} dur={40} suffix=" WINS" color={UI.green} />
					<Label text="BANNED" x={960} y={560} frame={frame} at={cue(l0, 'They ban')} color={UI.red} size={70} />
				</>
			}
		/>
	);
};

const Fly: React.FC<{x: number; y: number; wing: number; s?: number}> = ({x, y, wing, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={4}>
		<ellipse cx={-16} cy={-26 - wing * 20} rx={24} ry={12} fill="#DDF6FF" opacity={0.85} transform={`rotate(${-30 - wing * 30} -16 -10)`} />
		<ellipse cx={16} cy={-26 - wing * 20} rx={24} ry={12} fill="#DDF6FF" opacity={0.85} transform={`rotate(${30 + wing * 30} 16 -10)`} />
		<ellipse cx={0} cy={0} rx={26} ry={18} fill="#2A2350" />
		<circle cx={20} cy={-4} r={12} fill="#2A2350" />
		<circle cx={24} cy={-8} r={6} fill="#E8453C" />
	</g>
);

export const FlyShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slowAt = cue(l0, 'In slow time');
	const takeAt = cue(l0, 'take it gently');
	const letAt = cue(l0, 'let it go');
	const payAt = cue(l0, 'Five pounds.');
	const wing = frame < slowAt ? (frame % 2) : Math.abs(Math.sin(frame * 0.02));
	const fx = frame < takeAt ? 1180 + Math.sin(frame * (frame < slowAt ? 0.4 : 0.01)) * 60 : lerp(1180, 1700, span(frame, letAt, letAt + 30));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(1000, 560, 1.05), detail(fx, 520, 3.2), close(900, GROUND, H, 0.08, -3), medium(1500), detail(fx, 520, 2.6, 4)]}
				bg={<CityBack time="day" />}
				world={
					<g>
						<Field />
						<Hero who={CAST.bigKid} x={1500} y={GROUND} size={H * 1.15} face={frame > payAt ? 'shocked' : 'smug'} flip />
						<Hero x={frame < takeAt ? 900 : 1060} y={GROUND} size={H} face={frame > payAt ? 'happy' : 'smug'} armR={frame > takeAt && frame < letAt ? [100, 140] : [20, 10]} walk={frame > slowAt && frame < takeAt ? frame / 14 : undefined} />
						<Fly x={fx} y={520} wing={wing} s={1.2} />
					</g>
				}
				slow={{at: slowAt, until: letAt}}
				overlay={
					<>
						<Bubble text="Bet £5 you can't catch a fly." x={1500} y={230} tx={1480} ty={290} frame={frame} at={4} until={cue(l0, 'A housefly')} size={36} />
						<Label text="FLY WINGS ≈ 200 BEATS / S" x={480} y={200} frame={frame} at={cue(l0, 'two hundred')} />
						<Label text="SLOWED: 1 FLAP / 5 S" x={1440} y={200} frame={frame} at={cue(l0, 'one flap')} color={UI.yellow} />
						<Big text="+£5 +£5 +£5" x={960} y={760} size={90} frame={frame} at={payAt} color={UI.green} />
					</>
				}
			/>
			<Sound name="snap" at={slowAt} volume={0.6} />
		</>
	);
};

export const HighFive: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const swing = cue(l0, 'swing');
	const burnAt = cue(l1, 'It slams');
	const hot = span(frame, cue(l1, 'two thousand'), burnAt + 10);
	const o = shake(frame, burnAt, 18, 16);
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[medium(1100), close(900, GROUND, H, 0.08, -4), detail(1120, 470, 2.6), wide(1100, 560, 1.1), detail(1120, 470, 3, 6)]}
				world={
					<Room look={LUNCH}>
						<Hero who={CAST.friend} x={1360} y={GROUND} size={H} face={frame > burnAt ? 'shocked' : 'happy'} armL={[150, 165]} flip />
						<Hero x={900} y={GROUND} size={H} face={frame > burnAt ? 'scared' : frame > swing ? 'happy' : 'smug'} armR={frame > swing ? [130, 150] : [20, 10]} />
						{hot > 0.02 ? (
							<g>
								<ellipse cx={1130} cy={470} rx={140 * hot} ry={110 * hot} fill="#FF8A3D" opacity={0.5 * hot} />
								<ellipse cx={1130} cy={470} rx={70 * hot} ry={55 * hot} fill="#FFF3B0" opacity={0.8 * hot} />
								{[...Array(6)].map((_, i) => (
									<path key={i} d={`M${1120} ${470} Q${1200 + i * 20} ${380 - i * 30} ${1280 + i * 30} ${420 - i * 40}`} stroke="#FFD84A" strokeWidth={6} fill="none" opacity={hot} />
								))}
							</g>
						) : null}
					</Room>
				}
				shakeXY={o}
				slow={{at: -10, until: burnAt + 30}}
				overlay={
					<>
						<Label text="YOUR HAND: 2 M/S" x={480} y={200} frame={frame} at={cue(l1, 'two metres')} />
						<Label text="REAL WORLD: 2,000 M/S" x={1440} y={200} frame={frame} at={cue(l1, 'two thousand')} color={UI.red} />
						<Big text="MACH 6" x={960} y={760} size={130} frame={frame} at={cue(l1, 'Six times')} color={UI.orange} />
					</>
				}
			/>
			<Sound name="whoosh" at={swing} volume={0.5} />
			<Sound name="sizzle" at={burnAt} volume={0.6} />
			<Sound name="thud" at={burnAt} volume={0.4} />
		</>
	);
};

export const Careful: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const x = lerp(700, 900, span(frame, cue(l0, 'From then'), dur, Easing.linear));
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[close(800, GROUND, H, 0.06), medium(x), wide(900, 560, 1.1)]}
			world={
				<Room look={ROOMS.bedroomDay} window={{x: 1300, w: 420}}>
					<Hero x={x} y={GROUND} size={H} face={frame > cue(l0, 'Gently') ? 'determined' : 'sad'} armR={[70, 110]} walk={frame > cue(l0, 'From then') ? frame / 40 : undefined} />
					<rect x={x + 85} y={GROUND - 470} width={70} height={40} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
				</Room>
			}
			slow={{at: cue(l0, 'From then'), strength: 0.6}}
			overlay={<Label text="RULE: MOVE LIKE A SLOTH" x={960} y={860} frame={frame} at={cue(l0, 'like a sloth')} color={UI.yellow} />}
		/>
	);
};

export const Teleport: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const jumpAt = cue(l0, 'the next');
	const forkAt = cue(l0, 'drops his fork');
	const gapAt = cue(l0, 'You start');
	const heroX = frame < jumpAt ? 760 : frame < gapAt ? 1500 : lerp(1500, 1000, span(frame, gapAt, gapAt + 60, Easing.linear));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(1100, 560, 1.05), close(1000, GROUND, H, 0.08, 3), close(heroX, GROUND, H, 0.06), wide(1100, 560, 1.15)]}
				world={
					<Room look={LUNCH}>
						<Desk x={560} w={1000} color="#C98A5A" h={230} />
						<Hero who={CAST.friend} x={1000} y={GROUND} size={H} face={frame > forkAt ? 'shocked' : 'happy'} sit armL={[60, 100]} armR={[60, 100]} />
						<Hero x={heroX} y={GROUND} size={H} face="smug" sit={frame < jumpAt} walk={frame > gapAt && frame < gapAt + 60 ? frame / 14 : undefined} armR={frame > jumpAt && frame < gapAt ? [90, 140] : [20, 10]} />
						{frame > jumpAt && frame < gapAt ? <circle cx={heroX + 150} cy={GROUND - 520} r={34} fill="#C98A5A" stroke={INK} strokeWidth={5} /> : null}
					</Room>
				}
				overlay={
					<>
						<Bubble text="HOW?!" x={1000} y={260} tx={1000} ty={330} frame={frame} at={forkAt} until={gapAt} shout size={60} />
						<Label text="TO EVERYONE ELSE: YOU TELEPORT" x={960} y={860} frame={frame} at={cue(l0, 'you teleport')} color={UI.cyan} />
					</>
				}
			/>
			<Sound name="swish" at={jumpAt} volume={0.6} />
			<Sound name="thud" at={forkAt} volume={0.3} />
		</>
	);
};

export const Games: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const rankAt = cue(l0, 'number one');
	const chatAt = cue(l0, 'Half the chat');
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), detail(1200, 470, 2.4), close(760, GROUND, H, 0.08, -3), medium(900)]}
			world={
				<Room look={ROOMS.gamer}>
					<Desk x={880} w={640} color="#2A2350" h={260} />
					<Monitor x={1200} y={330} w={420} glow="#7F5AF0">
						<text x={1200} y={430} fontFamily="Fredoka" fontWeight={700} fontSize={frame > rankAt ? 70 : 40} fill="#fff" textAnchor="middle" stroke="none">
							{frame > rankAt ? '#1' : 'RANKED'}
						</text>
					</Monitor>
					<Hero x={760} y={GROUND} size={H} face={frame > rankAt ? 'smug' : 'determined'} sit armL={[70, 100]} armR={[70, 100]} look={[0.8, -0.2]} blink={blinking(frame)} />
				</Room>
			}
			slow={{at: cue(l0, 'You get'), until: rankAt, strength: 0.6}}
			overlay={
				<>
					<Label text="NORMAL REACTION ≈ 0.25 S" x={480} y={200} frame={frame} at={cue(l0, 'quarter of a second')} />
					<Label text="YOURS: ≈ 4 MINUTES" x={1440} y={200} frame={frame} at={cue(l0, 'four minutes')} color={UI.yellow} />
					<Big text="#1 WORLDWIDE" x={960} y={760} size={100} frame={frame} at={rankAt} />
					<Bubble text="HACKER??" x={1500} y={300} tx={1300} ty={380} frame={frame} at={chatAt} until={dur} shout size={46} />
				</>
			}
		/>
	);
};

export const Magic: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const hatAt = cue(l0, 'the hat');
	const coins = Math.round(span(frame, hatAt, hatAt + 50) * 200);
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(1000, 560, 1.05), close(900, GROUND, H, 0.08), close(1400, GROUND, H, 0.06, 3), detail(1060, 690, 2.4)]}
				bg={<CityBack time="day" />}
				world={
					<g>
						<Street time="day" stop={false} />
						<Desk x={760} w={420} color="#7F5AF0" h={220} />
						{[0, 1, 2].map((i) => (
							<rect key={i} x={860 + i * 60} y={GROUND - 270} width={44} height={60} rx={6} fill="#fff" stroke={INK} strokeWidth={4} transform={`rotate(${(i - 1) * 12} ${880 + i * 60} ${GROUND - 240})`} />
						))}
						<path d={`M1040 ${GROUND + 40} L1180 ${GROUND + 40} L1160 ${GROUND - 60} L1060 ${GROUND - 60} Z`} fill="#2A2350" stroke={INK} strokeWidth={6} />
						{coins > 0 ? <ellipse cx={1110} cy={GROUND - 60} rx={50} ry={10 + coins / 20} fill="#FFD84A" stroke={INK} strokeWidth={4} /> : null}
						<Hero x={900} y={GROUND + 20} size={H} face="smug" armR={[80, 110]} />
						<Hero who={CAST.crowdB} x={1400} y={GROUND + 20} size={H} face={frame > cue(l0, 'back pocket') ? 'shocked' : 'happy'} flip />
						<Hero who={CAST.crowdC} x={1700} y={GROUND + 20} size={H * 0.95} face={frame > cue(l0, "friend's hand") ? 'shocked' : 'neutral'} flip />
					</g>
				}
				overlay={
					<>
						<Label text="NOBODY SEES YOU MOVE" x={960} y={200} frame={frame} at={cue(l0, 'Nobody sees')} color={UI.cyan} />
						<Count from={0} to={200} x={1500} y={760} size={110} frame={frame} at={hatAt} prefix="£" dur={50} color={UI.green} />
					</>
				}
			/>
			<Sound name="crowd" at={hatAt} volume={0.35} />
		</>
	);
};

