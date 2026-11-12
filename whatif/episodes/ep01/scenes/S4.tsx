import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Hero} from '../../../characters/Hero';
import {blinking, cue, lerp, shake, SnapRing, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ball, Car, Rain} from '../../../sets/outdoor';
import {CAST, close, CityBack, detail, GROUND, H, medium, Shot, Street, wide} from './kit';

// Part 4: the rescue, and the twist.

const KID = H * 0.62;
const ROAD_Y = GROUND + 190;

/** The afternoon street with the kid, the ball and the car. */
const Scene: React.FC<{carX: number; kidX: number; kidY: number; kidSit?: boolean; ballX: number; heroX: number; heroY?: number; heroFace?: React.ComponentProps<typeof Hero>['face']; heroArms?: [number, number]; walk?: number; frame: number; heroTilt?: number; driver?: boolean}> = ({
	carX,
	kidX,
	kidY,
	kidSit,
	ballX,
	heroX,
	heroY = GROUND + 20,
	heroFace = 'determined',
	heroArms,
	walk,
	frame,
	heroTilt = 0,
	driver = false,
}) => (
	<g>
		<Street time="dusk" stop={false} />
		<Ball x={ballX} y={ROAD_Y - 40} r={40} color="#E8453C" />
		<Hero who={CAST.kid} x={kidX} y={kidY} size={KID} face={kidSit ? 'shocked' : 'happy'} sit={kidSit} walk={kidSit ? undefined : 0.3} armR={kidSit ? [30, 40] : [100, 100]} flip />
		<Hero x={heroX} y={heroY} size={H} face={heroFace} walk={walk} armR={heroArms} armL={heroArms} tilt={heroTilt} blink={blinking(frame)} />
		<Car x={carX} flip color="#3FB7E8" lights driver={driver ? <g transform="scale(-1 1)"><Hero who={CAST.driver} x={-120} y={-60} size={200} face="neutral" look={[0, 1]} /></g> : undefined} />
	</g>
);

export const StreetShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const kidX = lerp(820, 1150, span(frame, cue(l0, 'chases'), cue(l0, 'A car')));
	const carX = lerp(2600, 1900, span(frame, cue(l0, 'A car'), dur, Easing.linear));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(1100, 560, 1.05), close(kidX, ROAD_Y, KID, 0.08), detail(carX - 300, ROAD_Y - 100, 1.8), close(400, GROUND + 20, H, 0.1, -4)]}
				bg={<CityBack time="dusk" />}
				world={<Scene frame={frame} carX={carX} kidX={kidX} kidY={ROAD_Y} ballX={kidX + 140} heroX={400} heroFace={frame > cue(l0, 'In about') ? 'shocked' : 'neutral'} />}
				overlay={
					<>
						<Label text="CAR ≈ 50 KM/H" x={480} y={200} frame={frame} at={cue(l0, 'fifty')} />
						<Label text="15 M AWAY" x={1440} y={200} frame={frame} at={cue(l0, 'Fifteen metres')} color={UI.yellow} />
						<Big text="1 SECOND" x={960} y={760} size={110} frame={frame} at={cue(l0, 'one second')} color={UI.red} />
					</>
				}
			/>
		</>
	);
};

export const SnapShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const carX = lerp(1900, 1890, span(frame, 0, dur));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[close(400, GROUND + 20, H, 0.08, 3), detail(1600, ROAD_Y - 120, 1.8), wide(1100, 560, 1.05), medium(400, GROUND + 20)]}
				bg={<CityBack time="dusk" />}
				world={<Scene frame={frame} carX={carX} kidX={1150} kidY={ROAD_Y} ballX={1290} heroX={400} heroFace="determined" heroArms={[110, 160]} />}
				slow={{at: 2}}
				overlay={
					<>
						<SnapRing frame={frame} at={2} x={960} y={420} />
						<Label text="CAR: 1.4 CM/S" x={480} y={200} frame={frame} at={cue(l0, 'crawling')} />
						<Label text="YOUR TIME: ≈ 18 MIN" x={1440} y={200} frame={frame} at={cue(l0, 'eighteen')} color={UI.yellow} />
						<Label text="YOU: 20 M AWAY" x={960} y={860} frame={frame} at={cue(l0, 'twenty metres')} color={UI.red} />
					</>
				}
			/>
			<Sound name="snap" at={2} volume={0.9} />
			<Sound name="whoosh" at={4} volume={0.4} />
		</>
	);
};

export const Driver: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const kidAt = cue(l0, 'The kid');
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={frame < kidAt ? [detail(1750, GROUND - 130, 2.6), detail(1760, GROUND - 140, 3.2, -3)] : [close(1150, ROAD_Y, KID, 0.08, 3), detail(1290, ROAD_Y - 40, 2.6)]}
			bg={<CityBack time="dusk" />}
			world={
				<g>
					<Scene frame={frame} carX={1890} kidX={1150} kidY={ROAD_Y} ballX={1290} heroX={400} driver />
				</g>
			}
			slow={{at: -10}}
			overlay={
				<>
					<Label text="EYES ON HIS PHONE" x={960} y={200} frame={frame} at={cue(l0, 'phone')} until={kidAt} color={UI.red} />
					<Label text="HE HAS NO IDEA" x={960} y={860} frame={frame} at={cue(l0, 'no idea')} />
				</>
			}
		/>
	);
};

export const Dash: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const walkAt = cue(l0, 'So you walk');
	const x = frame < walkAt ? 400 : lerp(400, 820, span(frame, walkAt, dur, Easing.linear));
	const warn = span(frame, cue(l0, 'Run in slow time'), cue(l0, 'Run in slow time') + 10) * (1 - span(frame, walkAt - 6, walkAt));
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[close(x, GROUND + 20, H, 0.08, -3), wide(1000, 560, 1.05), detail(x, GROUND - 20, 2.4), medium(x, GROUND + 20)]}
			bg={<CityBack time="dusk" />}
			world={
				<g>
					<Scene frame={frame} carX={1888} kidX={1150} kidY={ROAD_Y} ballX={1290} heroX={x} heroFace={frame < walkAt ? 'scared' : 'determined'} walk={frame > walkAt ? frame / 40 : undefined} />
					{warn > 0.02 ? <ellipse cx={x + 160} cy={GROUND - 300} rx={200} ry={260} fill="#FF8A3D" opacity={0.35 * warn} /> : null}
				</g>
			}
			slow={{at: -10}}
			overlay={
				<>
					<Label text="SPRINT = BURN UP" x={960} y={200} frame={frame} at={cue(l0, 'burn you up')} until={walkAt + 30} color={UI.red} />
					<Label text="SLOW. CAREFUL." x={960} y={860} frame={frame} at={walkAt} color={UI.yellow} />
				</>
			}
		/>
	);
};

export const Reach: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const pushAt = l1.a;
	const k = span(frame, pushAt, dur - 10, Easing.linear);
	const kidY = lerp(ROAD_Y, GROUND + 60, k);
	const carX = lerp(1880, 1500, span(frame, 0, dur, Easing.linear));
	const shaking = frame > l2.a ? Math.sin(frame * 2.2) * 3 : 0;
	const clock = Math.round(lerp(0, 16, k));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[medium(1000, GROUND + 60), close(980, GROUND + 60, H, 0.08, 3), detail(carX - 300, ROAD_Y - 100, 2.2), close(1150, kidY, KID, 0.06, -3), wide(1150, 600, 1.1)]}
				bg={<CityBack time="dusk" />}
				world={<Scene frame={frame} carX={carX} kidX={1150} kidY={kidY} ballX={1290} heroX={980 + shaking} heroY={GROUND + 60} heroFace={frame > pushAt ? 'determined' : 'scared'} heroArms={frame > cue(l0, 'You reach') ? [80, 90] : [20, 10]} heroTilt={shaking} />}
				slow={{at: -10}}
				overlay={
					<>
						<Label text="3 MINUTES SPARE" x={480} y={200} frame={frame} at={cue(l0, 'three minutes')} until={pushAt} />
						<Label text="YANK = LIKE A CAR HIT" x={1440} y={200} frame={frame} at={cue(l0, 'yank')} until={pushAt} color={UI.red} />
						<Label text="PUSH: 1 MM / S" x={480} y={200} frame={frame} at={cue(l1, 'One millimetre')} color={UI.yellow} />
						{frame > pushAt ? <Big text={`${clock} : 00`} x={1500} y={760} size={110} frame={frame} at={pushAt} color={UI.cream} /> : null}
					</>
				}
			/>
			<Sound name="tick" at={pushAt} volume={0.3} />
		</>
	);
};

export const Miss: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const brake = cue(l0, 'Brakes');
	const carX = lerp(1500, 1380, span(frame, 0, brake + 14, Easing.out(Easing.cubic)));
	const o = shake(frame, brake, 12, 14);
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(1150, 580, 1.05), detail(1150, GROUND + 40, 2.2), close(1150, GROUND + 60, KID, 0.08, 3), close(980, GROUND + 60, H, 0.06), wide(1100, 560, 1.15)]}
				bg={<CityBack time="dusk" />}
				world={<Scene frame={frame} carX={carX} kidX={1150} kidY={GROUND + 60} kidSit ballX={1290} heroX={980} heroY={GROUND + 60} heroFace={frame > l1.a ? 'smug' : 'neutral'} />}
				shakeXY={o}
				overlay={
					<>
						<SnapRing frame={frame} at={0} x={960} y={420} />
						<Label text="NOT A SCRATCH ✓" x={960} y={200} frame={frame} at={cue(l0, 'without a scratch')} color={UI.green} />
						<Label text="NOBODY SAW YOU MOVE" x={960} y={860} frame={frame} at={l1.a} color={UI.cyan} />
					</>
				}
			/>
			<Sound name="snap" at={0} volume={0.8} />
			<Sound name="brakes" at={brake} volume={0.6} />
		</>
	);
};

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const stopAt = cue(l0, 'Everything stops');
	const otherAt = l1.a;
	const theirSnap = cue(l2, 'snap their');
	const frozenRain = frame >= stopAt && frame < theirSnap;
	const rt = frame < stopAt ? frame * 30 : frame < theirSnap ? stopAt * 30 : stopAt * 30 + (frame - theirSnap) * 30;
	const turn = span(frame, cue(l1, 'They turn'), cue(l1, 'They turn') + 20);
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					frame < otherAt
						? [wide(960, 540, 1.05), close(700, GROUND + 20, H, 0.06)]
						: [detail(1450, GROUND - 260, 2.2), close(700, GROUND + 20, H, 0.1, -4), close(1450, GROUND - 40, H * 0.8, 0.12, 3)]
				}
				bg={<CityBack time="night" />}
				world={
					<g>
						<Street time="night" wet stop={false} />
						<Hero who={CAST.stranger} x={1450} y={GROUND - 40} size={H * 0.8} face={turn > 0.5 ? 'smug' : 'neutral'} flip={turn < 0.5} walk={frame > otherAt && turn < 0.5 ? frame / 14 : undefined} armR={frame > cue(l2, 'lift') ? [110, 160] : [20, 10]} opacity={0.95} />
						<Hero x={700} y={GROUND + 20} size={H} face={frame > otherAt ? 'shocked' : 'happy'} look={frame > otherAt ? [0.9, -0.2] : [0, -0.6]} />
						<Rain t={rt} long={frozenRain ? 0 : 34} />
					</g>
				}
				slow={{at: stopAt, until: theirSnap}}
				overlay={
					<>
						<SnapRing frame={frame} at={stopAt} x={700} y={400} />
						<SnapRing frame={frame} at={theirSnap} x={1450} y={420} />
						{frame > theirSnap + 4 ? <AbsoluteFill style={{background: '#000', opacity: span(frame, theirSnap + 4, theirSnap + 20)}} /> : null}
					</>
				}
			/>
			<Sound name="rain" at={0} volume={0.3} loop={stopAt} />
			<Sound name="snap" at={stopAt} volume={0.7} />
			<Sound name="snap" at={theirSnap} volume={1} />
		</>
	);
};

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[close(960, GROUND, H, 0.06), medium(960)]}
			world={
				<g>
					<rect x={-400} y={-400} width={2720} height={1900} fill="#0E0A2E" />
					<circle cx={960} cy={560} r={400} fill="#7F5AF0" opacity={0.15} />
					<Hero x={960} y={GROUND} size={H} face="smug" armR={[110, 160]} aura={0.4 + 0.2 * Math.sin(frame * 0.1)} auraColor="#7F5AF0" />
				</g>
			}
			overlay={
				<>
					<Big text="WOULD YOU?" x={960} y={250} size={100} frame={frame} at={cue(l0, 'would you')} />
					<Label text="TELL US IN THE COMMENTS" x={960} y={860} frame={frame} at={cue(l0, 'comments')} color={UI.yellow} />
					<Label text="SUBSCRIBE FOR MORE WHAT IFS" x={960} y={860} frame={frame} at={cue(l0, 'subscribe')} color={UI.cream} />
				</>
			}
		/>
	);
};

