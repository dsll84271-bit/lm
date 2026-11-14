import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ant3D, AntCrowd, ANT, Ladybird3D, Mosquito3D, type AntSpot} from '../../../three/bugs3d';
import {AntHill3D, Cornflake3D, Crumb3D, DandelionClock3D, Drop3D, Grass, Ground, NightSky3D, Pebble3D, Rain3D, Seed3D, Twig3D, Water3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Bed3, Box as _Box, Door3, Lamp3, Plant3, Poster3, Room3, ROOM3, Shelf3} from '../../../three/sets3d';
import {Box} from '../../../three/sets3d';
import {Fridge3D} from '../../../three/props3d2';
import {project} from '../../../three/Stage3D';
import {Shot3, Says} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {antLine} from './B';
import {BG, LIGHT, P4} from './kit';
import {top, type V3} from './util';

// Part C: flying on a dandelion seed, the garden, rain, the flood and the
// living raft, a night under the stars, home, the twist and the goodbye.

void _Box;

// ---------------------------------------------------------------- seed

export const SeedScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const forest = cue(l0, 'where the grass');
	const clock = cue(l0, 'A dandelion');
	const grab = cue(l0, 'You grab');
	const lifts = cue(l0, 'and the wind');
	const ringAt = cue(l1, 'Air flowing');
	const slows = cue(l1, 'which slows');
	const fly = frame > lifts - 6;
	const t = fly ? (frame - lifts + 6) / 30 : 0;
	const seedAt: V3 = fly ? [-4 + t * 6, 16 + t * 2.2 + Math.sin(t * 1.3) * 1.2, -2 + t * 1.5] : [-4, 16, -2];
	const science = frame > l1.a - 4;
	const handY = 1.7 + 0.4; // the hero holds the bottom of the stalk with both hands up
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, forest - 4, clock - 4, grab - 4, lifts - 4, l1.a - 4, ringAt - 4, slows - 4]}
				angles={[
					{at: [-1, 3.5, 2], dist: 15, yaw: 20, pitch: 4, fov: 40},
					{at: [0, 12, 0], dist: 40, yaw: 30, pitch: -8, fov: 42},
					{at: [-4, 14, -4], dist: 30, yaw: 20, pitch: 2, fov: 40},
					{at: [-4, 15, -2], dist: 7, yaw: 30, pitch: 6, fov: 36},
					{at: [seedAt[0], seedAt[1] + 4, seedAt[2]], dist: 25, yaw: -40, pitch: 8, fov: 40, ddist: 0, dyaw: 20},
					{at: [seedAt[0], seedAt[1] + 4, seedAt[2]], dist: 26, yaw: 10, pitch: 20, fov: 40, ddist: 0},
					{at: [seedAt[0], seedAt[1] + 7, seedAt[2]], dist: 15, yaw: 20, pitch: 14, fov: 40, ddist: 0},
					{at: [seedAt[0], seedAt[1] + 4, seedAt[2]], dist: 25, yaw: 60, pitch: 6, fov: 40, ddist: 0},
				]}
				light={LIGHT.garden}
				bg={BG.garden}
				far={
					<group>
						<Ground color="#5A7A3A" />
						<Grass size={160} clear={10} gap={[0, 4]} seed={41} tall={34} />
					</group>
				}
				near={
					<group>
						<DandelionClock3D at={[-4, 0, -6]} r={7} stalk={9} frame={frame} gone={fly ? 0.15 : 0} />
						{frame < grab - 4 ? (
							<group>
								<Hero3D position={[0, 0, 4]} turn={frame < clock ? Math.PI : Math.PI + 0.4} walk={frame < clock ? frame / 20 : undefined} face="happy" look={[0, 0.8]} />
								<Ant3D at={[1.6, 0, 4.4]} rot={Math.PI} frame={frame} pip walk={frame < clock ? frame / 14 : undefined} />
							</group>
						) : (
							<group position={seedAt} rotation={[0, 0, fly ? Math.sin(frame * 0.05) * 0.12 : 0]}>
								<Seed3D at={[0, handY - 0.6, 0]} frame={frame} ring={science ? span(frame, ringAt, ringAt + 20) : 0} />
								<Hero3D position={[0, -1.4, 0]} turn={0.3} armL={[172, 182]} armR={[172, 182]} face={fly ? 'happy' : 'determined'} look={[0, -0.4]} />
							</group>
						)}
					</group>
				}
				overlay={() =>
					science ? (
						<>
							<Label text="UNIVERSITY OF EDINBURGH · 2018" x={960} y={210} frame={frame} at={l1.a + 6} size={42} color={UI.cyan} />
							{frame > ringAt ? <Label text="A RING OF SPINNING AIR" x={960} y={870} frame={frame} at={ringAt + 10} until={slows - 4} size={50} color={UI.cyan} /> : null}
							{frame > slows ? <Big text="AN INVISIBLE PARACHUTE" x={960} y={880} size={84} frame={frame} at={slows + 6} color={UI.yellow} /> : null}
						</>
					) : null
				}
			/>
			<Sound name="whoosh" at={lifts} volume={0.45} />
			<Sound name="chime" at={ringAt + 10} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- garden

export const Garden: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const hill = cue(l0, 'a hill of earth');
	const lady = cue(l0, 'A ladybird');
	const carry = cue(l0, 'Ants carry');
	const busy = cue(l0, 'Life down here');
	const land = span(frame, 0, hill);
	const you: V3 = [lerp(-3, 2, land), lerp(10, 0, land), 6];
	const lineA = antLine([-14, 0, 9], [-1, 0, 2.4], 9, frame, 0.006);
	const lineB = antLine([1, 0, 2.4], [14, 0, 9], 9, frame, 0.006);
	const lb = span(frame, lady - 10, lady + 80);
	const loads: React.ReactNode[] = lineA.slice(0, 6).map((a, i) => (
		<group key={i} position={[a.p[0], 1.35, a.p[2]]} rotation={[0, a.rot, 0]}>
			{i % 3 === 0 ? <T shape={{kind: 'sphere', r: 0.6, seg: 16}} color="#7CC25A" scale={[1.3, 0.15, 0.9]} outline={0.02} /> : i % 3 === 1 ? <T shape={{kind: 'sphere', r: 0.35, seg: 14}} color="#C9A86A" scale={[1, 0.8, 1.4]} outline={0.02} /> : <Crumb3D at={[0, -0.2, 0]} s={0.25} />}
		</group>
	));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, hill - 4, lady - 4, carry - 4, busy - 4]}
				angles={[
					{at: [you[0], you[1] + 1.5, you[2]], dist: 12, yaw: 20, pitch: 6, fov: 38, ddist: 0},
					{at: [0, 3, 0], dist: 30, yaw: 10, pitch: 10, fov: 40},
					{at: [2, 1.2, 6], dist: 10, yaw: -40, pitch: 6, fov: 36},
					{at: [-6, 1, 5.5], dist: 7, yaw: 60, pitch: 10, fov: 34},
					{at: [0, 4, 4], dist: 26, yaw: -20, pitch: 14, fov: 40},
				]}
				light={LIGHT.garden}
				bg={BG.garden}
				far={
					<group>
						<Ground color="#6A5A3A" />
						<Grass size={190} clear={38} gap={[0, 4]} seed={43} tall={32} />
						<AntHill3D at={[0, 0, -6]} r={13} />
						<Pebble3D at={[12, 1.5, -2]} r={3} />
					</group>
				}
				near={
					<group>
						<AntCrowd frame={frame} ants={[...lineA, ...lineB]} />
						{loads}
						{frame > lady - 14 ? <Ladybird3D at={[lerp(16, -6, lb), 0, 11]} rot={-Math.PI / 2} frame={frame} walk={frame / 12} /> : null}
						<group position={you}>
							{land < 1 ? <Seed3D at={[0, 1.5, 0]} frame={frame} /> : null}
							<Hero3D position={[0, land < 1 ? -1.4 + 1.4 * 0 : 0, 0]} armL={land < 1 ? [172, 182] : undefined} armR={land < 1 ? [172, 182] : undefined} face="happy" turn={frame > lady ? Math.PI / 2 : 0} />
						</group>
						<Ant3D at={[4.5, 0, 5]} rot={-0.6} frame={frame} pip />
					</group>
				}
			/>
			<Sound name="steps" at={hill} volume={0.2} loop={dur - hill} />
		</>
	);
};

// ---------------------------------------------------------------- rain

export const RainScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const bigger = cue(l0, 'Every raindrop');
	const balloon = cue(l0, 'like a giant');
	const mosq = l1.a;
	const found = cue(l1, 'In twenty twelve');
	const light = cue(l1, 'A mosquito is so light');
	const carries = cue(l1, 'It carries');
	const slips = cue(l1, 'slips off');
	const mosqSet = frame >= mosq - 4;
	// the mosquito scene: a big drop falls onto it, carries it, it peels off
	const dropY = frame < light ? 20 : lerp(20, -4, span(frame, light, slips + 10, (t) => t));
	const ride = frame > carries - 10 && frame < slips;
	const mq: V3 = ride ? [0.5, dropY - 1.2, 1.5] : frame >= slips ? [lerp(0.4, 3.5, span(frame, slips, slips + 30)), lerp(dropY, 3.2, 0.7), lerp(0.6, 1.2, span(frame, slips, slips + 30))] : [0, 3.2, 0];
	const big: V3 = [0, 0, 0];
	const hitAt = bigger + 18;
	const splash = span(frame, hitAt, hitAt + 18);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, bigger - 4, balloon - 4, mosq - 4, light - 4, slips - 4]}
				angles={[
					{at: [0, 3, 0], dist: 20, yaw: 20, pitch: 6, fov: 40},
					{at: [1.5, 1.4, 1], dist: 9, yaw: -30, pitch: 4, fov: 38},
					{at: [0, 2, 0], dist: 18, yaw: 50, pitch: 18, fov: 40},
					{at: [0, 3.2, 0], dist: 9, yaw: 20, pitch: 4, fov: 36},
					{at: [0, Math.max(1.5, dropY - 0.8), 0], dist: 10, yaw: -20, pitch: 6, fov: 38, ddist: 0},
					{at: [1.5, 3, 0.6], dist: 10, yaw: 30, pitch: 6, fov: 38},
				]}
				light={LIGHT.rain}
				bg={mosqSet ? '#4A5A78' : BG.rain}
				grade={mosqSet ? undefined : 'saturate(0.85)'}
				far={
					mosqSet ? (
						<Box size={[80, 0.1, 80]} at={[0, -8, 0]} color="#2A3450" outline={0} />
					) : (
						<group>
							<Ground color="#4A3A2A" />
							<Grass size={140} clear={22} seed={45} tall={30} />
							<AntHill3D at={[0, 0, -10]} r={12} />
						</group>
					)
				}
				near={
					mosqSet ? (
						<group>
							<Mosquito3D at={mq} frame={frame} rot={[0, -0.8, ride ? 0.4 : 0]} />
							<group position={[0, dropY, 0]}>
								<Drop3D at={[0, 0, 0]} r={1.6} fall={1} opacity={0.6} />
							</group>
						</group>
					) : (
						<group>
							<Rain3D frame={frame} area={44} n={60} top={34} speed={1.4} r={1.0} center={[0, 2]} />
							<Drop3D at={[big[0] + 2.5, Math.max(1.0, 30 - (frame - (bigger - 10)) * 1.6), 2]} r={1.1} fall={frame < hitAt ? 1 : 0} opacity={frame < hitAt ? 0.6 : 0} />
							{frame >= hitAt ? <group position={[2.5, 0, 2]}><SplashBig t={splash} /></group> : null}
							<Hero3D position={[0, 0, 2]} turn={0.5 + (frame > hitAt ? 0.6 : 0)} face={frame > hitAt ? 'shocked' : 'scared'} armL={[150, 170]} armR={[150, 170]} look={[0, 0.7]} />
							<Ant3D at={[-2, 0, 1.4]} rot={0.8} frame={frame} pip />
						</group>
					)
				}
				overlay={() => (
					<>
						{!mosqSet && frame > bigger ? <Label text="EVERY RAINDROP IS BIGGER THAN YOU" x={960} y={870} frame={frame} at={bigger + 6} until={mosq - 8} size={46} color={UI.cyan} /> : null}
						{mosqSet ? <Label text="RAINDROP: UP TO 50× A MOSQUITO'S WEIGHT" x={960} y={210} frame={frame} at={mosq + 6} size={42} color={UI.cream} /> : null}
						{mosqSet && frame > found ? <Label text="GEORGIA TECH · 2012" x={960} y={300} frame={frame} at={found + 4} size={38} color={UI.cyan} /> : null}
						{frame > light ? <Big text={frame > slips ? 'IT SLIPS OFF' : 'TOO LIGHT TO SQUASH'} x={960} y={880} size={84} frame={frame} at={frame > slips ? slips + 4 : light + 10} color={UI.green} /> : null}
					</>
				)}
			/>
			<Sound name="rain" at={0} volume={0.18} loop={mosq} />
			<Sound name="splash" at={hitAt} volume={0.5} />
			<Sound name="bubbles" at={carries} volume={0.3} />
			<Sound name="whoosh" at={slips} volume={0.35} />
		</>
	);
};

/** A big splash right next to you. */
const SplashBig: React.FC<{t: number}> = ({t}) => (
	<group>
		{t < 1 ? (
			<>
				<T shape={{kind: 'torus', r: 1 + t * 2.6, tube: 0.3 * (1 - t) + 0.05}} color="#BFE6FF" position={[0, 0.3 * Math.sin(t * Math.PI), 0]} rotation={[Math.PI / 2, 0, 0]} opacity={0.8 * (1 - t)} outline={0.03} />
				{[...Array(10)].map((_, i) => {
					const a = (i / 10) * Math.PI * 2;
					const d = 1 + t * 3.2;
					return <T key={i} shape={{kind: 'sphere', r: 0.22, seg: 12}} color="#DFF4FF" position={[Math.cos(a) * d, 3.2 * t * (1 - t) * 2 + 0.2, Math.sin(a) * d]} opacity={0.9 * (1 - t)} outline={0.02} />;
				})}
			</>
		) : null}
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
			<circleGeometry args={[1.4 + t * 1.2, 32]} />
			<meshBasicMaterial color="#5A8AC8" transparent opacity={0.4} depthWrite={false} />
		</mesh>
	</group>
);

// ---------------------------------------------------------------- flood

export const Flood: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const creeps = cue(l0, 'A puddle');
	const stuck = cue(l0, 'and Pip is caught');
	const grab = cue(l1, 'So you grab');
	const heave = cue(l1, 'and heave');
	const letsGo = cue(l1, 'The water stretches');
	const out = cue(l1, 'Pip tumbles');
	const level = lerp(0.02, 0.35, span(frame, creeps, dur));
	const free = frame > out - 4;
	const pry = span(frame, heave - 6, letsGo + 10);
	const tumble = span(frame, out - 4, out + 16);
	const dropAt: V3 = [2.2, 0, 0];
	const pipAt: V3 = free ? [lerp(2.2, 0.4, tumble), Math.sin(tumble * Math.PI) * 1.2, lerp(0, 1.4, tumble)] : [2.2, 0.35, 0];
	const twigOn = frame > grab - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, creeps - 4, stuck - 4, grab - 4, heave - 4, out - 6]}
				angles={[
					{at: [0, 2, 0], dist: 20, yaw: 15, pitch: 10, fov: 40},
					{at: [0, 0.6, 3], dist: 12, yaw: 40, pitch: 14, fov: 38},
					{at: [2.2, 1.2, 0], dist: 5, yaw: 20, pitch: 6, fov: 34},
					{at: [0.4, 1.2, 0.6], dist: 7, yaw: -35, pitch: 8, fov: 36},
					{at: [1.2, 1.2, 0.3], dist: 5.5, yaw: 50, pitch: 6, fov: 34},
					{at: [0.6, 1, 0.8], dist: 6, yaw: 15, pitch: 10, fov: 34},
				]}
				light={LIGHT.rain}
				bg={BG.rain}
				far={
					<group>
						<Ground color="#4A3A2A" />
						<Grass size={140} clear={20} seed={47} tall={28} />
						<AntHill3D at={[0, 0, -12]} r={12} />
					</group>
				}
				near={
					<group>
						<Rain3D frame={frame} area={40} n={40} top={30} speed={1.4} r={0.9} center={[0, -2]} />
						<Water3D level={level} frame={frame} size={[60, 60]} color="#5A8AC8" ripples={[[-3, 2, 0], [4, -2, 20], [1, 4, 40]]} />
						{free ? null : <Drop3D at={dropAt} r={1.2} frame={frame} wobble={0.6 + pry * 0.6} squash={0.85 + pry * 0.1} />}
						<Ant3D at={pipAt} rot={free ? -0.6 + tumble * 3 : 0.4} frame={frame} pip walk={free ? undefined : frame / 6} tilt={free ? (1 - tumble) * 1.2 : 0} gaze={free ? [0, 0] : [0.3, 0.2]} />
						<Hero3D position={[-0.2, 0, 0.2]} turn={Math.PI / 2} face={free ? 'happy' : twigOn ? 'determined' : 'shocked'} armL={twigOn ? [80, 100] : undefined} armR={twigOn ? [80, 100] : undefined} reachL={twigOn ? 20 : 0} reachR={twigOn ? 20 : 0} lean={twigOn ? -10 - pry * 8 : 0} />
						{twigOn ? <Twig3D at={[0.9 + pry * 0.1, 1.05 - pry * 0.2, 0.3]} rot={[0, 0, -0.22 + pry * 0.32]} len={3.6} thick={0.3} /> : null}
					</group>
				}
				overlay={() => (
					<>
						{frame > grab - 4 && frame < out - 6 ? <Label text="500× STRONGER FOR YOUR SIZE" x={960} y={210} frame={frame} at={grab} size={44} color={UI.yellow} /> : null}
						{frame > out ? <Big text="PIP IS FREE!" x={960} y={880} size={90} frame={frame} at={out + 8} color={UI.green} /> : null}
					</>
				)}
			/>
			<Sound name="bubbles" at={stuck} volume={0.35} />
			<Sound name="swish" at={heave} volume={0.35} />
			<Sound name="pop" at={out} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- raft

/** A raft of ants: a flat disc of linked ants, `n` rings. */
const raftAnts = (frame: number, rings = 5): AntSpot[] => {
	const out: AntSpot[] = [];
	for (let r = 0; r <= rings; r++) {
		const n = r === 0 ? 1 : r * 7;
		for (let i = 0; i < n; i++) {
			const a = (i / n) * Math.PI * 2 + r * 0.4;
			const d = r * 1.05;
			out.push({p: [Math.cos(a) * d, 0.05 + Math.sin(frame * 0.12 + i + r) * 0.04 + (r < 2 ? 0.25 : 0), Math.sin(a) * d], rot: -a + Math.PI / 2 + Math.sin(i * 7) * 0.4, s: 0.8, pitch: Math.sin(i * 3.1 + r) * 0.15});
		}
	}
	return out;
};

export const Raft: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const link = cue(l0, 'They grab');
	const board = cue(l0, 'Pip pulls');
	const fire = l1.a;
	const air = cue(l1, 'Air trapped');
	const level = 1.2;
	const gather = span(frame, link - 10, link + 50);
	const raft = raftAnts(frame);
	const ants = raft.map((a, i) => {
		const sx = Math.cos(i * 2.1) * 9;
		const sz = Math.sin(i * 2.1) * 9 - 4;
		return {...a, p: [lerp(sx, a.p[0], gather), lerp(level - 0.6, level + a.p[1] - 0.45, gather), lerp(sz, a.p[2], gather)] as V3, walk: gather < 1 ? frame / 10 + i : undefined};
	});
	const onboard = span(frame, board, board + 20);
	const drift = frame > board + 20 ? (frame - board - 20) * 0.02 : 0;
	const bob = Math.sin(frame * 0.08) * 0.08;
	const science = frame > fire - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, link - 4, board - 4, fire - 4, air - 4]}
				angles={[
					{at: [0, 2, 0], dist: 16, yaw: 20, pitch: 20, fov: 40},
					{at: [0, 1.4, 0], dist: 12, yaw: 50, pitch: 40, fov: 38},
					{at: [drift, 2.2, 0], dist: 7, yaw: 10, pitch: 10, fov: 34, ddist: 0},
					{at: [0, 1.4, 0], dist: 9, yaw: -30, pitch: 50, fov: 38},
					{at: [0, 1.2, 0], dist: 10, yaw: 30, pitch: 38, fov: 36},
				]}
				light={LIGHT.rain}
				bg={BG.rain}
				far={
					<group>
						<Ground color="#3A3028" />
						<Grass size={140} clear={26} seed={49} tall={28} />
					</group>
				}
				near={
					<group>
						<Rain3D frame={frame} area={40} n={30} top={30} speed={1.4} r={0.8} />
						<Water3D level={level} frame={frame} size={[80, 80]} color="#5A8AC8" ripples={[[-4, 3, 0], [5, -3, 25], [2, 5, 45]]} />
						<group position={[drift, bob, 0]}>
							<AntCrowd frame={frame} ants={ants} look={ANT.fire} />
							{science ? (
								<group>
									{[...Array(18)].map((_, i) => {
										const a = i * 2.39;
										const d = 1 + (i % 5) * 0.9;
										return <Glow key={i} shape={{kind: 'sphere', r: 0.18, seg: 10}} color="#DFF8FF" position={[Math.cos(a) * d, level - 0.15, Math.sin(a) * d]} opacity={0.8} />;
									})}
								</group>
							) : null}
							<Ant3D at={[0.6, level + 0.35, 0.4]} rot={0.3} frame={frame} pip />
							<Hero3D position={[lerp(3.5, -0.6, onboard), level + 0.35 * onboard - 0.9 * (1 - onboard), lerp(1.5, 0.3, onboard)]} turn={0.6} face={onboard > 0.8 ? 'happy' : 'scared'} armL={onboard < 1 ? [150, 170] : undefined} armR={onboard < 1 ? [150, 170] : undefined} />
						</group>
					</group>
				}
				overlay={() => (
					<>
						{frame > link && frame < fire - 4 ? <Big text="A LIVING RAFT" x={960} y={880} size={96} frame={frame} at={link + 30} color={UI.yellow} /> : null}
						{science ? <Label text="FIRE ANTS · GEORGIA TECH · 2011" x={960} y={210} frame={frame} at={fire + 6} size={42} color={UI.cyan} /> : null}
						{frame > air ? <Label text="TRAPPED AIR KEEPS THEM AFLOAT: DAYS, EVEN WEEKS" x={960} y={870} frame={frame} at={air + 6} size={42} color={UI.cream} /> : null}
					</>
				)}
			/>
			<Sound name="steps" at={link} volume={0.3} loop={50} />
			<Sound name="pop" at={board + 10} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- night

export const Night: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const stars = cue(l0, 'The stars');
	const alone = cue(l0, 'Not one');
	const miss = cue(l0, 'You miss');
	const warm = cue(l0, 'But squeezed');
	const level = 1.2;
	const bob = Math.sin(frame * 0.05) * 0.06;
	const lying = (
		<group position={[-0.4, level + 0.95, 0.3]} rotation={[-Math.PI / 2, 0, 0.3]}>
			<Hero3D position={[0, 0, 0]} face={frame > warm ? 'happy' : frame > miss ? 'sad' : 'neutral'} look={[0, 0]} armL={[60, 120]} armR={[40, 100]} still />
		</group>
	);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, stars - 4, alone - 4, miss - 4, warm - 4]}
				angles={[
					{at: [0, 6, -10], dist: 30, yaw: 10, pitch: 4, fov: 46, dyaw: 6},
					{at: [0, 40, -80], dist: 90, yaw: 0, pitch: -15, fov: 46},
					{at: [0, 1.6, 0], dist: 9, yaw: 20, pitch: 30, fov: 38},
					{at: [-0.4, 2.2, 0.3], dist: 3.4, yaw: 10, pitch: 62, fov: 32},
					{at: [0, 1.6, 0], dist: 7, yaw: -20, pitch: 36, fov: 36},
				]}
				light={LIGHT.night}
				bg={BG.night}
				far={
					<group>
						<NightSky3D frame={frame} />
						<Box size={[400, 0.2, 400]} at={[0, 0.9, 0]} color="#1E2A50" outline={0} />
						<Grass size={160} clear={40} seed={51} tall={30} />
					</group>
				}
				near={
					<group position={[0, bob, 0]}>
						<Water3D level={level} frame={frame} size={[30, 30]} color="#2A4A8A" />
						<AntCrowd frame={frame} ants={raftAnts(frame).map((a) => ({...a, p: [a.p[0], level + a.p[1] - 0.45, a.p[2]] as V3}))} look={ANT.fire} />
						<Ant3D at={[0.9, level + 0.35, 0.2]} rot={-1.2} frame={frame} pip gaze={[0, 0.6]} />
						{lying}
						{frame > warm ? <Glow shape={{kind: 'sphere', r: 2.2, seg: 24}} color="#FFB060" position={[-0.4, level + 0.6, 0.3]} opacity={0.15 * span(frame, warm, warm + 30)} /> : null}
					</group>
				}
				overlay={() => (frame > stars && frame < alone - 4 ? <Label text="THE STARS DON'T CHANGE: THEY'RE TOO FAR AWAY" x={960} y={870} frame={frame} at={stars + 10} size={42} color={UI.cream} /> : null)}
			/>
		</>
	);
};

// ---------------------------------------------------------------- home

export const Home: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const noIdea = cue(l0, 'You have no idea');
	const mum = cue(l0, 'Your mum says');
	const crumb = l1.a;
	const lunch = cue(l1, 'By lunchtime');
	const last = cue(l1, 'The last one');
	const wake = span(frame, 6, 26);
	const sill = frame >= crumb - 4;
	const ants = antLine([-3, 0, 0], [3, 0, 0], 8, frame, 0.004, 1);
	const waver = frame > last;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, noIdea - 4, mum - 4, crumb - 4, lunch - 4, last - 4]}
				angles={
					sill
						? [
								{at: [0.3, 1.2, -1.0], dist: 3.2, yaw: -40, pitch: 12, fov: 34},
								{at: [0.3, 1.2, -1.0], dist: 3.2, yaw: -40, pitch: 12, fov: 34},
								{at: [0.3, 1.2, -1.0], dist: 3.2, yaw: -40, pitch: 12, fov: 34},
								{at: [0.3, 1.2, -1.0], dist: 3.2, yaw: -40, pitch: 12, fov: 34},
								{at: [0.3, 0.6, 0], dist: 6, yaw: 20, pitch: 10, fov: 34},
								{at: [-2.2, 0.8, 0], dist: 4.2, yaw: 30, pitch: 8, fov: 32},
							]
						: [
								{at: [-1.0, 0.9, -2.6], dist: 4.2, yaw: 20, pitch: 22, fov: 34},
								{at: [-1.0, 1.0, -2.6], dist: 3.2, yaw: -20, pitch: 10, fov: 32},
								{at: [0, 1.2, -2.6], dist: 6, yaw: -10, pitch: 8, fov: 36},
							]
				}
				light={sill && frame > lunch - 4 ? LIGHT.garden : LIGHT.morning}
				bg={sill && frame > lunch - 4 ? BG.garden : BG.room}
				far={
					sill && frame > lunch - 4 ? (
						<group>
							<Box size={[60, 2, 6]} at={[0, -1, 0]} color="#F2F2F2" outline={0.05} />
							<Box size={[60, 30, 0.6]} at={[0, 14, -3]} color="#BFE3FA" outline={0} />
						</group>
					) : (
						<Room3 look={ROOM3.bedroom} window={{x: 1.4}}>
							<Bed3 at={[-1.0, 0, -2.6]} />
							<Shelf3 at={[-3.8, 2, -4.3]} />
							<Poster3 at={[-1.0, 2.4, -4.35]} color="#FF8A3D" accent="#FFD84A" />
							<Plant3 at={[4.6, 0, -3.6]} />
							<Lamp3 at={[-2.4, 0, -3.9]} />
							<Door3 at={[3.2, 0, -4.38]} />
						</Room3>
					)
				}
				near={
					sill ? (
						frame > lunch - 4 ? (
							<group>
								<AntCrowd frame={frame} ants={waver ? ants.slice(0, 7) : ants} />
								{ants.slice(0, 7).map((a, i) =>
									i % 2 === 0 ? (
										<group key={i} position={[a.p[0], 1.3, a.p[2]]}>
											<Crumb3D at={[0, -0.2, 0]} s={0.3} />
										</group>
									) : null,
								)}
								{waver ? <Ant3D at={[-2.2, 0, 0]} rot={0.9} frame={frame} pip tap={0.3 + Math.sin(frame * 0.4) * 0.3} gaze={[0.4, 0.4]} /> : null}
							</group>
						) : (
							<group>
								<Box size={[3, 0.12, 0.6]} at={[0, 0.94, -1.3]} color="#F2F2F2" outline={0.01} />
								<Box size={[3, 1.6, 0.05]} at={[0, 1.8, -1.6]} color="#BFE3FA" outline={0.01} />
								<Crumb3D at={[0.1, 1.0, -1.25]} s={0.04} />
								<Hero3D position={[0.9, 0, -0.5]} turn={Math.PI + 0.5} armR={[60, 80]} reachR={50} face="happy" />
							</group>
						)
					) : (
						<group>
							<group position={[-1.0, 0.56 + wake * 0.0, -3.05]}>
								<Hero3D position={[0, 0, 0]} sit face={frame > mum + 10 ? 'smug' : frame > noIdea ? 'neutral' : 'shocked'} blink={frame < 8 ? 1 : undefined} look={frame > noIdea && frame < mum ? [0.6, -0.4] : [0, 0]} />
								{[0, 1, 2, 3].map((k) => (
									<T key={k} shape={{kind: 'sphere', r: 0.05, seg: 8}} color="#7A5A3A" position={[-0.12 + k * 0.09, 0.7 + (k % 2) * 0.2, 0.28]} scale={[1, 0.6, 0.4]} outline={0} />
								))}
							</group>
							<Box size={[1.0, 0.16, 0.95]} at={[-1.0, 0.72, -2.55]} color="#FF8A3D" />
							{frame > mum - 6 ? <Hero3D who={P4.mum} position={[1.6, 0, -2.2]} turn={-1.1} face="smug" talk={frame > mum && frame < mum + 50 ? 0.6 : 0} armL={[40, 100]} /> : null}
						</group>
					)
				}
				overlay={(cam) => (
					<>
						{frame > mum && !sill ? <Says cam={cam} head={top(1.6, -2.2)} text="Sleepwalking again?" frame={frame} at={mum + 4} until={crumb - 8} /> : null}
						{frame > lunch - 4 && frame < last - 4 ? <Label text="BY LUNCHTIME" x={960} y={210} frame={frame} at={lunch} size={44} /> : null}
					</>
				)}
			/>
			<Sound name="chime" at={10} volume={0.25} />
			<Sound name="pop" at={last + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- twist

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const lean = cue(l0, 'You lean');
	const itsMum = cue(l0, "It's your mum");
	const waving = cue(l0, 'and waving');
	const runs = l1.a;
	const closer = span(frame, lean, lean + 30);
	const arms: [number, number] = [150 + Math.sin(frame * 0.5) * 20, 175];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, lean - 4, itsMum - 4, waving - 2, runs - 4]}
				angles={[
					{at: [1, 1.2, 0], dist: 9, yaw: 10, pitch: 10, fov: 36},
					{at: [14, 8, 0], dist: 42, yaw: 0, pitch: 6, fov: 44},
					{at: [0.5, 0.9, 0], dist: 12, yaw: 45, pitch: 48, fov: 30},
					{at: [0, 1.1, 0], dist: 3.2, yaw: 30, pitch: 6, fov: 30},
					{at: [12, 7, 0], dist: 40, yaw: -10, pitch: 6, fov: 46},
				]}
				light={LIGHT.kitchen}
				bg={BG.kitchen}
				blur={0}
				far={
					<group>
						<Ground color="#E8E0F2" lines={{every: 30, color: '#D0C4E0'}} />
						<Box size={[400, 200, 2]} at={[0, 100, -120]} color="#3FA89C" outline={0} />
					</group>
				}
				near={
					<group>
						<Cornflake3D at={[2.6, 0.7, -1.2]} rot={[0.15, 0.6, 0.05]} s={0.42} />
						<Hero3D who={P4.mum} position={[0, 0, 0]} turn={0.5} face={frame > waving ? 'shocked' : 'scared'} talk={0.7} armL={arms} armR={arms} hop={Math.abs(Math.sin(frame * 0.3)) * 0.3} />
						<Hero3D position={[lerp(50, 38, closer), -34, -4]} height={60} turn={-Math.PI / 2} face="shocked" look={[0, -0.8]} lean={closer * 12} />
					</group>
				}
				overlay={(cam) => (
					<>
						{frame < lean ? <Says cam={cam} head={top(0, 0)} text="squeak!" frame={frame} at={6} size={22} /> : null}
						{frame > waving ? <Says cam={cam} head={top(0, 0)} text="Help! I've shrunk!" frame={frame} at={waving + 4} size={26} /> : null}
						{frame > runs ? <Big text="RUNS IN THE FAMILY" x={960} y={880} size={84} frame={frame} at={runs + 6} color={UI.yellow} /> : null}
					</>
				)}
			/>
			<Sound name="squeak" at={6} volume={0.4} />
			<Sound name="squeak" at={waving + 4} volume={0.4} />
			<Sound name="boom" at={itsMum} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const ride = cue(l0, 'Ride an ant');
	const comments = cue(l0, 'Tell us');
	const sub = cue(l0, 'subscribe');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0]}
				angles={[{at: [0, 1.2, 0], dist: 7, yaw: 70, pitch: 10, fov: 36, dyaw: 12, ddist: -0.6}]}
				light={LIGHT.studio}
				bg={BG.studio}
				blur={0}
				far={<Box size={[60, 0.1, 60]} at={[0, -0.05, 0]} color="#2A2160" outline={0} />}
				near={
					<Ant3D at={[0, 0, 0]} rot={0.4} frame={frame} pip walk={frame / 16}>
						<Hero3D position={[0, 0.62, -0.25]} sit face="happy" armL={[150, 175]} armR={[30, 60]} reachR={30} />
					</Ant3D>
				}
				overlay={() => (
					<AbsoluteFill style={{fontFamily: FONT}}>
						<Big text="WOULD YOU?" x={960} y={220} size={110} frame={frame} at={8} />
						{frame > ride ? <Label text="RIDE AN ANT  or  FLY ON A SEED?" x={960} y={370} frame={frame} at={ride} size={48} color={UI.cream} /> : null}
						{frame > comments ? <Label text="TELL US IN THE COMMENTS" x={960} y={790} frame={frame} at={comments} size={44} color={UI.cyan} /> : null}
						{frame > sub ? <Label text="SUBSCRIBE FOR MORE WHAT IFS" x={960} y={880} frame={frame} at={sub} size={48} color={UI.yellow} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={8} volume={0.3} />
			<Sound name="pop" at={sub} volume={0.3} />
		</>
	);
};

void project;
void shake;
void Door3;
void Fridge3D;
