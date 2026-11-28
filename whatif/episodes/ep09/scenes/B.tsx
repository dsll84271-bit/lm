import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Car3D} from '../../../three/sky3d';
import {Says, Shot3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Fence3D, Hedge3D, HitBox3D, Hotel3D, Lounger3D, Marker3D, PASTEL, PizzaBox3D, SavePoint3D, Scooter3D} from '../../../three/miami3d';
import {BG, HUD, LIGHT, light, lookFrom, MiamiSet, P9, SkyText} from './kit';
import type {V3} from './util';

// Part B: the racing sun, traffic on invisible tracks, bedtime at eight, the
// pizza mission, the super-jump, the exploding car, health, the wall glitch,
// hitboxes, the outfit spin, the delivery and the save point.

const Studio: React.FC = () => <Ground color="#3A2E80" size={200} lines={{every: 2, color: '#4A3E98', along: 'z'}} />;

/** A burst of cartoon flame and smoke (no one hurt). */
const Boom: React.FC<{at: V3; t: number}> = ({at, t}) =>
	t > 0 && t < 1 ? (
		<group position={at}>
			{[...Array(9)].map((_, i) => {
				const a = (i / 9) * Math.PI * 2;
				const r = 0.6 + t * 3.2;
				return <Glow key={i} shape={{kind: 'sphere', r: 1.2 * (1 - t * 0.5)}} color={i % 3 ? '#FFB43A' : '#FF5A3A'} position={[Math.cos(a) * r * 0.6, 1 + t * 3 + Math.sin(i) * 0.6, Math.sin(a) * r * 0.6]} opacity={1 - t} />;
			})}
			<Glow shape={{kind: 'sphere', r: 1.6 + t * 2}} color="#FFF0A0" position={[0, 1.4, 0]} opacity={(1 - t) * 0.8} />
		</group>
	) : null;

// ---------------------------------------------------------------- sun

export const Sun: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const games = cue(l0, 'In lots of games');
	const gta = cue(l0, 'In GTA five');
	const day = cue(l0, 'so a whole day');
	const cuts = [0, games - 4, gta - 4];
	const cycle = (frame / dur) * 1.4;
	const phase = cycle % 1;
	const kind = phase < 0.45 ? 'day' : phase < 0.6 ? 'sunset' : phase < 0.9 ? 'night' : 'day';
	const hh = Math.floor((phase * 24 + 8) % 24);
	const mm = Math.floor(((phase * 24 * 60) % 60) / 10) * 10;
	const sunAng = phase * Math.PI * 2;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([20, 2.2, 36], [0, 8, -10], 50, {dyaw: 3}), lookFrom([-10, 1.8, 30], [10, 10, -10], 52), lookFrom([10, 3, 30], [-10, 9, -20], 50)]}
				light={light([0, 0, 0], kind, 40)}
				bg={kind === 'day' ? BG.day : kind === 'sunset' ? BG.sunset : BG.night}
				far={<MiamiSet frame={frame} lit={kind === 'night' ? 1 : 0} night={kind === 'night'} />}
				near={
					<group>
						<Hero3D position={[2, 0, 24]} turn={Math.PI} face="shocked" look={[0, 0.8]} armL={[30, 30]} armR={[30, 30]} />
						<Glow shape={{kind: 'sphere', r: 8}} color={kind === 'night' ? '#F2F2FF' : '#FFE08A'} position={[Math.cos(sunAng) * 200, Math.abs(Math.sin(sunAng)) * 140 + 10, -260]} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} clock={`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`} />
						<Label text="GTA V: 1 GAME MINUTE = 2 REAL SECONDS" x={960} y={860} size={50} frame={frame} at={gta + 10} until={day - 2} color={UI.cream} />
						<Big text="A WHOLE DAY = 48 MINUTES" x={960} y={860} size={80} frame={frame} at={day + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- traffic

export const Traffic: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const honks = cue(l0, 'and honks');
	const tracks = cue(l0, 'Game cars follow');
	const forever = cue(l0, 'Step on the track');
	const cuts = [0, honks - 4, tracks - 4, forever - 4];
	const stopped = frame > 30;
	const cars = [0, 1, 2, 3, 4].map((i) => {
		const x = stopped ? 6 + i * 6 : lerp(60 + i * 6, 6 + i * 6, frame / 30);
		return <Car3D key={i} at={[x, 0, 1.5]} yaw={-Math.PI / 2} color={PASTEL[i]} />;
	});
	const honk = frame > 32 && Math.floor(frame / 8) % 2 === 0;
	const studio = frame >= tracks - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([-6, 1.6, 9], [6, 1, 1.5], 46), lookFrom([-1, 1.4, 4], [8, 1.2, 1.5], 44), {at: [0, 0, 0], dist: 18, yaw: 30, pitch: 40, fov: 44, dyaw: 6}, lookFrom([-6, 1.6, 9], [6, 1, 1.5], 46)]}
				light={studio && frame < forever - 4 ? LIGHT.studio : light([0, 0, 0], 'day', 30)}
				bg={studio && frame < forever - 4 ? BG.studio : BG.day}
				far={studio && frame < forever - 4 ? <Studio /> : <MiamiSet frame={frame} cars={false} />}
				near={
					studio && frame < forever - 4 ? (
						<group>
							{[-1.6, 1.6].map((z) => (
								<group key={z}>
									<T shape={{kind: 'box', w: 30, h: 0.02, d: 0.2}} color="#FFD84A" position={[0, 0.03, z]} outline={0} />
									{[...Array(10)].map((_, i) => <Glow key={i} shape={{kind: 'sphere', r: 0.12}} color="#FFD84A" position={[-14 + i * 3, 0.1, z]} />)}
								</group>
							))}
							{[0, 1, 2].map((i) => <Car3D key={i} at={[((frame * 0.12 + i * 9) % 30) - 15, 0, i % 2 ? 1.6 : -1.6]} yaw={i % 2 ? Math.PI / 2 : -Math.PI / 2} color={PASTEL[i + 1]} />)}
						</group>
					) : (
						<group>
							<Hero3D position={[0, 0, 1.5]} turn={Math.PI / 2} face={frame > honks ? 'scared' : 'neutral'} armL={[30, 30]} armR={[30, 30]} />
							{cars}
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} />
						{honk && !(studio && frame < forever - 4) ? <Big text="HONK!" x={1300} y={340} size={90} frame={frame} at={0} color={UI.yellow} rotate={-8} /> : null}
						<Label text="INVISIBLE TRACKS, LIKE A TRAIN SET" x={960} y={860} size={52} frame={frame} at={tracks + 10} until={forever - 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="brakes" at={24} volume={0.35} />
			{[0, 1, 2, 3].map((i) => <Sound key={i} name="ring" at={40 + i * 40} volume={0.18} />)}
		</>
	);
};

// ---------------------------------------------------------------- night

export const Night: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const eight = cue(l0, 'And at exactly');
	const turn = cue(l0, 'and every single person');
	const timetable = cue(l0, 'Game characters run');
	const cuts = [0, eight - 4, turn - 4, timetable - 4];
	const dusk = span(frame, 0, eight);
	const lit = frame > eight + 10 ? 1 : 0;
	const leave = span(frame, turn + 4, turn + 60);
	const people = [0, 1, 2, 3, 4, 5].map((i) => {
		const x = -16 + i * 6;
		const doorX = -18 + i * 7;
		const p: V3 = [lerp(x, doorX, leave), 0, lerp(-6.5, -20.5, leave)];
		return leave < 0.98 ? <Hero3D key={i} who={[P9.hat, P9.jogger, P9.surfer, P9.tourist, P9.gran, P9.door][i]} position={p} turn={frame > turn ? Math.PI : Math.PI / 2} walk={frame / 7 + i} lite face="happy" /> : null;
	});
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([8, 3, 16], [0, 6, -18], 50), lookFrom([0, 2, 12], [0, 8, -24], 54), lookFrom([4, 2.2, 10], [-4, 2, -10], 50), lookFrom([14, 6, 18], [0, 4, -12], 48, {dyaw: 3})]}
				light={light([0, 0, -10], dusk < 0.6 ? 'sunset' : 'night', 40)}
				bg={dusk < 0.6 ? BG.sunset : BG.night}
				far={<MiamiSet frame={frame} lit={lit} night={dusk > 0.6} />}
				near={
					<group>
						{people}
						<Hero3D position={[2, 0, 2]} turn={Math.PI} face={frame > turn ? 'shocked' : 'neutral'} look={[0, 0.3]} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} clock={frame > eight ? '20:00' : '19:5' + Math.min(9, Math.floor(frame / 40))} />
						<Label text="NPC TIMETABLE · 20:00 → BEDTIME" x={960} y={860} size={52} frame={frame} at={timetable + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="appear" at={eight + 10} volume={0.35} />
			<Sound name="steps" at={turn + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- mission

const MARKER: V3 = [60, 0, 1];
const SCOOTER: V3 = [16, 0, -6.5];

export const Mission: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const words = cue(l0, 'and words slide');
	const pizza = cue(l0, 'You look at the pizza');
	const scooter = cue(l0, 'You look at the scooter');
	const way = cue(l0, 'Well, it might');
	const cuts = [0, words - 4, pizza - 4, scooter - 4, way - 4];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([0, 2, 12], [50, 6, 1], 46), lookFrom([0, 2, 12], [40, 14, 1], 50), lookFrom([SCOOTER[0] - 2.4, 1.6, SCOOTER[2] + 2.6], [SCOOTER[0], 0.9, SCOOTER[2] - 0.5], 40), lookFrom([SCOOTER[0] + 3, 1.2, SCOOTER[2] + 3], [SCOOTER[0], 0.7, SCOOTER[2]], 42), lookFrom([4, 1.8, 8], [SCOOTER[0], 1, SCOOTER[2]], 44)]}
				light={light([20, 0, 0], 'day', 40)}
				bg={BG.day}
				far={<MiamiSet frame={frame} />}
				near={
					<group>
						<Marker3D at={MARKER} frame={frame} />
						<Scooter3D at={SCOOTER} yaw={Math.PI / 2} />
						<Hero3D position={[2, 0, 6]} turn={frame > pizza ? 2.2 : 1.6} face="neutral" look={[0.3, 0]} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} mission="★ DELIVER THE PIZZA" missionAt={words + 10} />
						<SkyText frame={frame} at={words + 4} until={pizza - 4} top="NEW MISSION" big="DELIVER THE PIZZA" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={words + 4} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- jump

export const Jump: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const land = cue(l0, 'and land perfectly');
	const heroes = cue(l0, 'Game characters');
	const record = cue(l0, 'The real high jump');
	const since = cue(l0, "Nobody's beaten");
	const cuts = [0, land - 4, heroes - 4, record - 4];
	const t = span(frame, 6, land, (v) => v);
	const x = lerp(-6, 8, t);
	const y = Math.max(0, Math.sin(Math.min(1, t * 1.05) * Math.PI) * 3.2);
	const studio = frame >= record - 4;
	const bar = 2.45;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([1, 1.6, 12], [1, 2, 0], 52), lookFrom([10, 1.2, 5], [8, 0.9, 0], 42), lookFrom([1, 1.6, 12], [1, 2, 0], 52), {at: [0, 1.4, 0], dist: 9, yaw: 20, pitch: 4, fov: 40}]}
				light={studio ? LIGHT.studio : light([0, 0, 0], 'day', 20)}
				bg={studio ? BG.studio : BG.day}
				far={studio ? <Studio /> : <MiamiSet frame={frame} />}
				near={
					studio ? (
						<group>
							{[-2, 2].map((x0) => <T key={x0} shape={{kind: 'box', w: 0.1, h: 2.7, d: 0.1}} color="#F2F2F2" position={[x0, 1.35, 0]} outline={0.01} />)}
							<T shape={{kind: 'cyl', r: 0.03, h: 4}} color="#FFD84A" position={[0, bar, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />
							<Hero3D position={[0, 0, 1.4]} face="happy" height={1.7} />
						</group>
					) : (
						<group>
							<Hedge3D at={[-2, 0, 0]} yaw={Math.PI / 2} len={3} />
							<Fence3D at={[1.5, 0, 0]} yaw={Math.PI / 2} len={3} />
							<Lounger3D at={[5, 0, 0]} yaw={Math.PI / 2} />
							<Hero3D position={[x, y, 0]} turn={Math.PI / 2} run walk={frame < land ? frame / 4 : undefined} face="determined" armL={y > 0.3 ? [150, 160] : [30, 40]} armR={y > 0.3 ? [150, 160] : [30, 40]} />
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} mission="★ DELIVER THE PIZZA" />
						<Big text="WORLD RECORD: 2.45 M" x={960} y={250} size={90} frame={frame} at={record + 10} color={UI.yellow} />
						<Label text="JAVIER SOTOMAYOR · 1993 · STILL UNBEATEN" x={960} y={860} size={50} frame={frame} at={since - 4} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={10} volume={0.35} />
			<Sound name="thud" at={land} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- crash

export const Crash: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const bump = cue(l0, 'you bump');
	const flips = cue(l0, 'It flips');
	const blink = cue(l0, 'Nobody nearby');
	const real = l1.a;
	const liquid = cue(l1, 'Fuel in a tank');
	const films = cue(l1, 'which is why');
	const cuts = [0, bump - 4, flips - 2, blink - 4, real - 4, liquid - 4, films - 4];
	const ride = span(frame, 0, bump + 6, (v) => v);
	const sx = lerp(-14, 3.2, ride);
	const fly = span(frame, flips, flips + 30, (v) => v);
	const carY = Math.sin(fly * Math.PI) * 6;
	const carRot = fly * Math.PI * 2;
	const boom = span(frame, flips + 8, flips + 50, (v) => v);
	const studio = frame >= real - 4;
	const s = shake(frame, flips + 8, 1, 16);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					lookFrom([sx - 4, 1.4, 6], [sx + 2, 0.8, 1.5], 46),
					lookFrom([0, 1.2, 7], [4, 0.8, 2.6], 46),
					{...lookFrom([-6, 2.4, 12], [6, 3, 2.6], 52), at: [6 + s.x * 0.02, 3 + s.y * 0.02, 2.6]},
					lookFrom([-3, 1.6, 9], [3, 1.4, 4], 46),
					{at: [0, 1, 0], dist: 10, yaw: 25, pitch: 10, fov: 40, dyaw: 4},
					{at: [0, 1, 0], dist: 8, yaw: -20, pitch: 6, fov: 40},
					{at: [0, 1, 0], dist: 10, yaw: 25, pitch: 10, fov: 40, dyaw: 4},
				]}
				light={studio ? LIGHT.studio : light([0, 0, 0], 'day', 20)}
				bg={studio ? BG.studio : BG.day}
				far={studio ? <Studio /> : <MiamiSet frame={frame} cars={false} />}
				near={
					studio ? (
						<group>
							<Car3D at={[0, 0, 0]} yaw={0.6} color="#3FBFE8" />
							<T shape={{kind: 'box', w: 0.9, h: 0.4, d: 0.6}} color="#2A2236" position={[0.4, 0.45, -1.2]} outline={0.02} />
							{frame > liquid ? <T shape={{kind: 'box', w: 0.8, h: 0.25, d: 0.5}} color="#FFD84A" position={[0.4, 0.38, -1.2]} outline={0} /> : null}
						</group>
					) : (
						<group>
							<Scooter3D at={[sx, 0, 1.5]} yaw={Math.PI / 2} tilt={frame > bump ? 0.2 : 0} />
							<Hero3D position={[sx - 0.1, 0.45, 1.5]} turn={Math.PI / 2} sit face={frame > flips ? 'shocked' : 'happy'} armL={[50, 80]} armR={[50, 80]} reachL={60} reachR={60} />
							<group position={[6.5, carY, 2.6]} rotation={[0, Math.PI / 2, carRot]}>
								<Car3D at={[0, 0, 0]} color="#FF7AA8" />
							</group>
							<Boom at={[6.5, 0, 2.6]} t={boom} />
							<Hero3D who={P9.tourist} position={[8, 0, -6.5]} turn={0.4} face="happy" />
						</group>
					)
				}
				blur={0}
				overlay={(cam) => (
					<AbsoluteFill>
						{!studio ? <HUD frame={frame} mission="★ DELIVER THE PIZZA" /> : null}
						{frame > blink && frame < real - 4 ? <Says cam={cam} head={[8, 1.9, -6.5]} text="Nice day for it!" frame={frame} at={blink + 4} /> : null}
						<Label text="REAL CARS ALMOST NEVER EXPLODE" x={960} y={220} size={56} frame={frame} at={real + 6} color={UI.yellow} />
						<Label text="FUEL IS A LIQUID · AN EXPLOSION NEEDS VAPOUR + AIR + A SPARK" x={960} y={860} size={42} frame={frame} at={liquid + 10} until={films - 2} color={UI.cream} />
						<Label text="FILMS USE SPECIAL EFFECTS" x={960} y={860} size={56} frame={frame} at={films + 6} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="thud" at={bump + 2} volume={0.25} />
			<Sound name="boom" at={flips + 8} volume={0.55} />
		</>
	);
};

// ---------------------------------------------------------------- health

export const Health: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const red = cue(l0, 'and your health bar');
	const hide = cue(l0, 'So you hide');
	const full = cue(l0, 'Five seconds later');
	const real = cue(l0, 'Real bodies');
	const cuts = [0, hide - 4, full - 4, real - 4];
	const hp = frame < red ? 1 : frame < full ? 0.18 : lerp(0.18, 1, span(frame, full, full + 20));
	const fall = span(frame, 0, 20);
	const studio = frame >= real - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([-3, 1.2, 6], [1, 0.6, 1.5], 44), lookFrom([-2, 1.2, -9], [-0.6, 0.8, -12.5], 44), lookFrom([-2.6, 1.0, -9.6], [-0.6, 0.8, -12.5], 40), {at: [0, 1, 0], dist: 6, yaw: 10, pitch: 6, fov: 40}]}
				light={studio ? LIGHT.studio : light([0, 0, -6], 'day', 20)}
				bg={studio ? BG.studio : BG.day}
				far={studio ? <Studio /> : <MiamiSet frame={frame} cars={false} />}
				near={
					studio ? (
						<group>
							<Hero3D position={[0, 0, 0]} face="sad" armL={[60, 120]} reachL={50} />
							<T shape={{kind: 'box', w: 0.22, h: 0.42, d: 0.22}} color="#F4F2FF" position={[-0.42, 1.0, 0.18]} rotation={[0.5, 0, 0.4]} outline={0.01} />
						</group>
					) : frame < hide - 4 ? (
						<group>
							<Scooter3D at={[3, 0, 1.5]} yaw={Math.PI / 2} tilt={1.4} />
							<Hero3D position={[1, 0, 1.5 + fall]} turn={0.4} sit face="scared" tilt={-20 * (1 - fall)} />
						</group>
					) : (
						<group>
							<T shape={{kind: 'box', w: 4, h: 2.2, d: 0.5}} color="#F7B2C6" position={[-0.6, 1.1, -14]} outline={0.03} />
							<Hero3D position={[-0.6, 0, -12.5]} turn={Math.PI} sit face={frame > full ? 'happy' : 'sad'} />
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{!studio ? <HUD frame={frame} health={hp} mission="★ DELIVER THE PIZZA" /> : null}
						{frame > hide && frame < full ? <Big text={`${Math.max(1, 5 - Math.floor((frame - hide) / 30))}…`} x={1500} y={420} size={110} frame={frame} at={hide} color={UI.cream} /> : null}
						<Label text="FULL HEALTH IN 5 SECONDS" x={960} y={860} size={56} frame={frame} at={full + 10} until={real - 4} color="#7CF27A" />
						<Big text="BROKEN ARM: 6–8 WEEKS" x={960} y={860} size={84} frame={frame} at={real + 20} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="thud" at={8} volume={0.35} />
			<Sound name="chime" at={full + 10} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- clip (into the wall)

export const Clip: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const half = cue(l0, 'and you walk halfway');
	const tpose = cue(l0, 'Your arms snap');
	const wiggle = cue(l0, 'You wiggle');
	const remember = cue(l0, 'Remember that');
	const cuts = [0, half - 4, tpose - 4, wiggle - 4, remember - 4];
	const x = lerp(-4, frame < wiggle ? -0.2 : lerp(-0.2, 3.6, span(frame, wiggle + 10, wiggle + 30)), span(frame, 0, half + 10));
	const t = frame > tpose && frame < wiggle + 30;
	const jig = frame > wiggle && frame < wiggle + 30 ? Math.sin(frame * 1.2) * 0.15 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([-3, 1.6, -6], [0, 1.2, -13.8], 48), lookFrom([1.5, 1.3, -10.5], [0, 1.2, -13.8], 44), lookFrom([0, 1.4, -10], [0, 1.3, -13.8], 40), lookFrom([4, 1.5, -10], [1, 1.2, -13.8], 44), lookFrom([5, 1.6, -9], [2, 1.2, -13.8], 44)]}
				light={light([0, 0, -12], 'day', 20)}
				bg={BG.day}
				far={<MiamiSet frame={frame} cars={false} />}
				near={
					<group>
						<Hotel3D at={[0, 0, -18]} w={8} h={12} d={8} color="#A8E6CF" seed={2} />
						<Hero3D position={[x + jig, 0, -13.9]} turn={Math.PI / 2} walk={!t && frame < half + 10 ? frame / 7 : undefined} face={t ? 'shocked' : 'determined'} armL={t ? [90, 90] : [20, 20]} armR={t ? [90, 90] : [20, 20]} still={t} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} mission="★ DELIVER THE PIZZA" glitch={t ? 0.6 : 0} />
						<Big text="REMEMBER THIS." x={960} y={860} size={84} frame={frame} at={remember + 6} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="snap" at={tpose + 2} volume={0.35} />
			<Sound name="pop" at={wiggle + 28} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- hitbox

export const Hitbox: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slow = cue(l0, 'That would be');
	const boxes = cue(l0, 'They use simple');
	const gap = cue(l0, "And where two boxes");
	const cuts = [0, boxes - 4, gap - 4];
	const x = gap > 0 && frame > gap + 10 ? lerp(-3, 3, span(frame, gap + 10, gap + 60)) : -3;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[{at: [0, 1.2, 0], dist: 10, yaw: 30, pitch: 14, fov: 40, dyaw: 6}, {at: [0, 1.2, 0], dist: 9, yaw: 10, pitch: 18, fov: 40}, {at: [0, 1.2, 0], dist: 8, yaw: 0, pitch: 60, fov: 44}]}
				light={LIGHT.studio}
				bg={BG.studio}
				far={<Studio />}
				near={
					<group>
						<T shape={{kind: 'box', w: 0.4, h: 2.6, d: 2}} color="#A8E6CF" position={[0, 1.3, -1.2]} outline={0.02} opacity={frame > boxes ? 0.5 : 1} />
						<T shape={{kind: 'box', w: 0.4, h: 2.6, d: 2}} color="#F7B2C6" position={[0, 1.3, 1.2]} outline={0.02} opacity={frame > boxes ? 0.5 : 1} />
						<Hero3D position={[x, 0, 0]} turn={Math.PI / 2} walk={frame > gap + 10 ? frame / 7 : undefined} face="happy" opacity={frame > boxes ? 0.6 : 1} />
						{frame > boxes ? (
							<group>
								<HitBox3D at={[0, 1.3, -1.25]} size={[0.5, 2.7, 2]} color="#3FF2E8" />
								<HitBox3D at={[0, 1.3, 1.25]} size={[0.5, 2.7, 2]} color="#3FF2E8" />
								<HitBox3D at={[x, 0.9, 0]} size={[0.6, 1.8, 0.4]} color="#FFD84A" />
							</group>
						) : null}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="CHECKING EVERY TRIANGLE: TOO SLOW" x={960} y={860} size={50} frame={frame} at={slow + 6} until={boxes - 4} color={UI.cream} />
						<Big text="HITBOXES" x={960} y={250} size={110} frame={frame} at={boxes + 10} color={UI.yellow} />
						<Label text="A GAP BETWEEN BOXES = A WAY THROUGH" x={960} y={860} size={52} frame={frame} at={gap + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
		</>
	);
};

// ---------------------------------------------------------------- shop

export const Shop: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const spin1 = cue(l0, 'spin round once');
	const hat = cue(l0, 'Spin again');
	const back = cue(l0, 'You spin back');
	const used = cue(l0, 'Some things');
	const cuts = [0, spin1 - 4, back - 4, used - 4];
	const outfit = frame < spin1 + 10 ? 0 : frame < hat + 10 ? 1 : frame < back + 10 ? 2 : 0;
	const spinning = [spin1, hat, back].some((c) => frame > c && frame < c + 12);
	const turn = spinning ? frame * 0.6 : 0.2;
	const who = outfit === 1 ? {...YOU_SHIRT} : YOU_BASE;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[{at: [0, 1.2, 0], dist: 6, yaw: 20, pitch: 6, fov: 44, dyaw: 4}, {at: [0, 1.1, 0], dist: 4.2, yaw: 10, pitch: 4, fov: 40}, {at: [0, 1.1, 0], dist: 4.2, yaw: -14, pitch: 4, fov: 40}, {at: [0, 1.3, 0], dist: 3.2, yaw: 6, pitch: 2, fov: 36}]}
				light={LIGHT.room}
				bg="#F7D2E0"
				far={
					<group>
						<T shape={{kind: 'box', w: 12, h: 0.1, d: 10}} color="#F2E6D8" position={[0, -0.05, 0]} outline={0} />
						<T shape={{kind: 'box', w: 12, h: 4, d: 0.2}} color="#F7B2C6" position={[0, 2, -3]} outline={0} />
						{[-3, 3].map((x) => (
							<group key={x} position={[x, 0, -2]}>
								<T shape={{kind: 'cyl', r: 0.03, h: 2.4}} color="#C8C8D8" position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} outline={0} />
								{[0, 1, 2, 3, 4].map((i) => <T key={i} shape={{kind: 'box', w: 0.45, h: 0.7, d: 0.06}} color={PASTEL[(i + (x > 0 ? 2 : 0)) % PASTEL.length]} position={[-1 + i * 0.5, 0.75, 0.05]} outline={0.01} />)}
							</group>
						))}
						<Hero3D who={P9.shop} position={[3, 0, 1]} turn={-1} face="happy" />
					</group>
				}
				near={
					<group>
						<mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
							<ringGeometry args={[0.7, 0.9, 40]} />
							<meshBasicMaterial color="#FFD84A" />
						</mesh>
						<Hero3D who={who} position={[0, 0, 0]} turn={turn} face="happy" />
						{outfit === 2 ? (
							<group position={[0, 0, 0]} rotation={[0, turn, 0]}>
								<T shape={{kind: 'cyl', r: 0.5, h: 0.04}} color="#A8703A" position={[0, 1.68, 0]} outline={0.01} />
								<T shape={{kind: 'cyl', r: 0.24, r2: 0.2, h: 0.24}} color="#A8703A" position={[0, 1.8, 0]} outline={0.01} />
							</group>
						) : null}
						{spinning ? <Glow shape={{kind: 'cyl', r: 0.9, h: 2.2, seg: 24}} color="#FFF6C8" position={[0, 1.1, 0]} opacity={0.3} /> : null}
					</group>
				}
				blur={0}
				overlay={(cam) => (
					<AbsoluteFill>
						<HUD frame={frame} mission="★ DELIVER THE PIZZA" />
						{frame > used ? <Says cam={cam} head={[3, 1.9, 1]} text="Nice day for it!" frame={frame} at={used + 10} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="swish" at={spin1 + 2} volume={0.3} />
			<Sound name="swish" at={hat + 2} volume={0.3} />
			<Sound name="swish" at={back + 2} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- pizza

const HOUSE: V3 = [80, 0, -24];

export const Pizza: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const coins = cue(l0, 'and gold coins');
	const complete = cue(l0, 'Mission complete');
	const nothing = cue(l0, 'But nothing else');
	const cuts = [0, coins - 4, complete - 4, nothing - 4];
	const give = span(frame, 10, coins - 10);
	const burst = span(frame, coins, coins + 40, (v) => v);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([HOUSE[0] + 4, 1.6, HOUSE[2] + 9], [HOUSE[0], 1.4, HOUSE[2] + 4], 46), lookFrom([HOUSE[0] + 3, 1.8, HOUSE[2] + 8], [HOUSE[0], 2, HOUSE[2] + 4], 52), lookFrom([HOUSE[0] - 4, 2, HOUSE[2] + 10], [HOUSE[0], 3, HOUSE[2] + 4], 50), lookFrom([HOUSE[0] + 1.2, 1.4, HOUSE[2] + 7.5], [HOUSE[0], 1.3, HOUSE[2] + 5], 40)]}
				light={light(HOUSE, 'sunset', 20)}
				bg={BG.sunset}
				far={<MiamiSet frame={frame} />}
				near={
					<group>
						<T shape={{kind: 'box', w: 8, h: 5, d: 6}} color="#FFC8A2" position={[HOUSE[0], 2.5, HOUSE[2]]} outline={0.04} />
						<Glow shape={{kind: 'box', w: 1.2, h: 2.2, d: 0.05}} color="#5A3A2A" position={[HOUSE[0], 1.1, HOUSE[2] + 3.02]} />
						<Hero3D who={P9.door} position={[HOUSE[0], 0, HOUSE[2] + 3.6]} face="happy" armR={[lerp(14, 60, give), 80]} reachR={50} />
						<Hero3D position={[HOUSE[0] + 0.3, 0, HOUSE[2] + 5.2]} turn={Math.PI} armR={[lerp(60, 14, give), 80]} reachR={50} face={frame > nothing ? 'sad' : 'happy'} />
						<PizzaBox3D at={[HOUSE[0] + 0.15, 1.05, HOUSE[2] + lerp(4.8, 4.0, give)]} />
						{burst > 0 && burst < 1
							? [...Array(16)].map((_, i) => {
									const a = (i / 16) * Math.PI * 2;
									return <T key={i} shape={{kind: 'cyl', r: 0.14, h: 0.03}} color="#FFD84A" position={[HOUSE[0] + Math.cos(a) * burst * 3, 1.4 + Math.sin(burst * Math.PI) * 2 + Math.sin(a) * burst, HOUSE[2] + 4.4 + Math.sin(a) * burst * 2]} rotation={[Math.PI / 2, a, 0]} outline={0.01} />;
								})
							: null}
					</group>
				}
				blur={0}
				overlay={(cam) => (
					<AbsoluteFill>
						<HUD frame={frame} coins={frame > coins ? 50 : 0} />
						{frame < coins + 10 ? <Says cam={cam} head={[HOUSE[0], 1.9, HOUSE[2] + 3.6]} text="Nice day for it!" frame={frame} at={14} /> : null}
						<SkyText frame={frame} at={complete} until={nothing} top="★" big="MISSION COMPLETE" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="coins" at={coins + 2} volume={0.4} />
			<Sound name="chime" at={complete} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- save

export const Save: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const point = cue(l0, 'A save point');
	const step = cue(l0, 'You step into it');
	const saving = cue(l0, 'Saving.');
	const hope = cue(l0, 'You really');
	const cuts = [0, point - 4, step - 4, hope - 4];
	const SP: V3 = [HOUSE[0] + 4, 0, HOUSE[2] + 7];
	const walk = span(frame, step - 20, step + 6, (v) => v);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([SP[0] + 4, 1.5, SP[2] + 5], [SP[0], 1.4, SP[2]], 44), lookFrom([SP[0] + 2.2, 1.6, SP[2] + 2.4], [SP[0], 1.6, SP[2]], 40), lookFrom([SP[0] + 4, 2.2, SP[2] + 6], [SP[0], 1.2, SP[2]], 46), lookFrom([SP[0] + 1.6, 1.5, SP[2] + 2.2], [SP[0], 1.4, SP[2]], 38)]}
				light={light(SP, 'sunset', 20)}
				bg={BG.sunset}
				far={<MiamiSet frame={frame} />}
				near={
					<group>
						<SavePoint3D at={SP} frame={frame} on={frame > saving ? 1 : 0} />
						<Hero3D position={[lerp(SP[0] - 3, SP[0], walk), 0, lerp(SP[2] + 2, SP[2], walk)]} turn={walk < 1 ? 2.2 : 0.3} walk={walk < 1 && walk > 0 ? frame / 7 : undefined} face={frame > hope ? 'scared' : 'neutral'} look={[0, 0.5]} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} coins={50} />
						<SkyText frame={frame} at={saving} top="SAVING…" big="DO NOT SWITCH OFF" color="#7FB0FF" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={saving} volume={0.35} />
		</>
	);
};

const YOU_BASE = undefined;
const YOU_SHIRT = {head: '#FF8A3D', headLight: '#FFC08A', headDark: '#C8642A', hoodie: '#FF7AA8', hoodieLight: '#FFB0CC', hoodieDark: '#C8507A', legs: '#2B2A3A', legsLight: '#45445A', shoe: '#F7F5FF', sole: '#C8507A', hair: 'none' as const, emblem: false};


