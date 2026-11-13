import React from 'react';
import {cue, lerp, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Big, Count, Label, PhoneFeed, UI} from '../../../components/ui';
import {Hero3D} from '../../../three/Hero3D';
import {Bowl3D, CanvasPlane, Eye3D, Flakes3D, Frog3D, Kettle3D, Leaf3D, Marking3D, Armchair3D, Pen3D, RayPath, Sink3D, Spoon3D, Toothbrush3D, Whiteboard3D} from '../../../three/props3d2';
import {Bed3, Board3, Box, Chair3, Clock3, Counter3, Desk3, Door3, Lamp3, Plant3, Poster3, Room3, ROOM3, School3, Shelf3} from '../../../three/sets3d';
import {project} from '../../../three/Stage3D';
import {C, M, Shot3, Says, Thought, W} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Book, MirrorFrame} from './hud';
import {BG, LIGHT, P3} from './kit';
import {handAt, headAt, mixArm, top, type V3} from './util';

// Part A: waking up invisible, the science of seeing, and the first week.

const VoidFloor: React.FC<{color?: string}> = ({color = '#140E38'}) => <Box size={[60, 0.1, 60]} at={[0, -0.05, 0]} color={color} outline={0} />;

/** Pulsing dashed rings round a ghost's two eyes (screen overlay). */
const EyeRings: React.FC<{cam: Parameters<typeof project>[0]; head: V3; turn?: number; frame: number; at: number; until?: number}> = ({cam, head, turn = 0, frame, at, until}) => {
	const p = span(frame, at, at + 10) * (until === undefined ? 1 : 1 - span(frame, until, until + 8));
	if (p <= 0) {
		return null;
	}
	return (
		<>
			{[-1, 1].map((s) => {
				const lx = s * 0.108;
				const e: V3 = [head[0] + lx * Math.cos(turn) + 0.3 * Math.sin(turn), head[1] - 0.025, head[2] - lx * Math.sin(turn) + 0.3 * Math.cos(turn)];
				const [x, y] = project(cam, e);
				const [x2] = project(cam, [e[0] + 0.09, e[1], e[2]]);
				const r = Math.max(22, Math.abs(x2 - x)) * (1 + Math.sin(frame * 0.25) * 0.08);
				return <div key={s} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `6px dashed ${UI.yellow}`, opacity: p, boxShadow: `0 0 20px ${UI.yellow}`}} />;
			})}
		</>
	);
};

// ---------------------------------------------------------------- cold

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const lookDown = cue(l0, 'look down');
	const hands = cue(l0, 'No hands');
	const feet = cue(l0, 'No feet');
	const duvet = cue(l0, 'Just the duvet');
	const opens = cue(l1, 'opens');
	const says = cue(l1, 'Already');
	const you: V3 = [-1.0, 0.56, -3.05];
	const rise = span(frame, duvet - 6, duvet + 22);
	const handsUp = span(frame, hands - 8, hands + 6) * (1 - span(frame, feet + 4, feet + 16));
	const arm = mixArm([18, 30], [55, 105], handsUp);
	const mumIn = span(frame, opens, opens + 24);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={frame < opens - 6 ? [W(-0.4, -2.8, 6.8, 14, 14), C(-1.0, -3.05, 0, 2.05), {at: [-1.0, 1.1, -2.5], dist: 3.2, yaw: 30, pitch: 22}, C(-1.0, -3.05, -18, 2.05)] : [{at: [0.4, 1.2, -3.2], dist: 6.2, yaw: -12, pitch: 10}, C(2.0, -3.5, -50, 1.95), C(-1.0, -3.05, 15, 2.05)]}
				light={LIGHT.morning}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.bedroom} window={{x: -0.6}}>
						<Bed3 at={[-1.0, 0, -2.6]} />
						<Door3 at={[2.4, 0, -4.38]} open={span(frame, opens - 8, opens + 12)} />
						<Shelf3 at={[-3.8, 2, -4.3]} />
						<Poster3 at={[1.0, 2.2, -4.35]} color="#FF8A3D" accent="#FFD84A" />
						<Plant3 at={[4.6, 0, -3.6]} />
						<Lamp3 at={[-2.4, 0, -3.9]} />
					</Room3>
				}
				near={
					<group>
						<Hero3D position={you} sit ghost={1} face={frame > lookDown ? 'shocked' : 'neutral'} blink={frame < 8 ? 1 : undefined} look={frame > lookDown && frame < duvet ? [0, 0.9] : [0, 0]} armL={arm} armR={arm} reachL={35} reachR={35} />
						<group position={[you[0], 0.66, -2.98]} rotation={[lerp(1.45, 0.1, rise), 0, 0]}>
							<Box size={[0.98, 0.62, 0.12]} at={[0, 0.31, 0]} color="#FF8A3D" />
						</group>
						<Hero3D who={P3.mum} position={[lerp(2.5, 2.0, mumIn), 0, lerp(-4.2, -3.5, mumIn)]} turn={-0.9} face={frame > says ? 'smug' : 'neutral'} talk={frame > says && frame < says + 40 ? 0.6 : 0} armL={[40, 100]} />
					</group>
				}
				overlay={(cam) => <Says cam={cam} head={top(2.0, -3.5)} text="Already up? That's a first." frame={frame} at={says} />}
			/>
			<Sound name="swish" at={duvet} volume={0.4} />
			<Sound name="pop" at={says} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- mirror

/** The camera is the bathroom mirror, looking back at you. */
export const Mirror: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const inv = cue(l0, "You're invisible");
	const almost = l1.a;
	const you: V3 = [0, 0, -1.0];
	const armR: [number, number] = [35, -55 + Math.sin(frame * 0.9) * 9];
	const reachR = 120;
	const hand = handAt(you, 0, armR, reachR, 1);
	const tiles: React.ReactNode[] = [];
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 18; c++) {
			tiles.push(<Box key={`${r}-${c}`} size={[0.42, 0.42, 0.02]} at={[-3.6 + c * 0.44, 0.24 + r * 0.44, -2.88]} color={(r + c) % 2 ? '#BFEFE8' : '#A8E4DA'} outline={0} />);
		}
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, cue(l0, 'Just a toothbrush') - 4, almost - 4]}
				angles={[M(0, -1.0, 0), {at: [0.05, 1.25, -1.0], dist: 2.1, pitch: 2, fov: 32}, {at: [0, 1.34, -1.0], dist: 1.25, pitch: 0, fov: 30, dyaw: 0, ddist: -0.15}]}
				light={{...LIGHT.bath, sun: {from: [0.5, 9, 2.5], color: '#FFFFFF', intensity: 2.4}}}
				bg="#2A4A5A"
				far={
					<group>
						<Room3 look={{wall: '#9FE0D8', floor: '#E8F2F2', trim: '#FFFFFF'}} w={8} d={6} h={4}>
							{tiles}
							{[...Array(8)].map((_, i) => (
								<T key={i} shape={{kind: 'cyl', r: 0.14, h: 2.3, seg: 12}} color={i % 2 ? '#FF9AC0' : '#FFB8D4'} position={[-3.6 + i * 0.25, 1.4, -2.3]} outline={0.008} />
							))}
							<Box size={[2.2, 0.05, 0.05]} at={[-2.75, 2.58, -2.3]} color="#C9CED8" />
							<Box size={[0.9, 0.04, 0.04]} at={[2.6, 1.6, -2.8]} color="#C9CED8" />
							<Box size={[0.7, 0.9, 0.08]} at={[2.6, 1.2, -2.76]} color="#7F5AF0" />
							<Box size={[0.9, 0.05, 0.25]} at={[1.4, 2.2, -2.82]} color="#FFFFFF" />
							<T shape={{kind: 'sphere', r: 0.12}} color="#FFD84A" position={[1.3, 2.34, -2.8]} outline={0.008} />
							<T shape={{kind: 'sphere', r: 0.07}} color="#FFD84A" position={[1.38, 2.46, -2.78]} outline={0.006} />
							<T shape={{kind: 'cone', r: 0.03, h: 0.06}} color="#FF8A3D" position={[1.46, 2.45, -2.76]} rotation={[0, 0, -Math.PI / 2]} outline={0} />
						</Room3>
					</group>
				}
				near={
					<group>
						<Hero3D position={you} ghost={1} face={frame > almost ? 'smug' : 'neutral'} look={frame > almost ? [Math.sin((frame - almost) * 0.12), 0] : [0, -0.2]} armR={armR} reachR={reachR} armL={[14, 10]} />
						<Toothbrush3D at={hand} rot={[0, Math.PI, 0.12]} />
						<Sink3D at={[0, 0, -0.42]} />
					</group>
				}
				overlay={(cam) => (
					<>
						<MirrorFrame />
						<Big text="INVISIBLE." x={960} y={230} size={96} frame={frame} at={inv} until={almost - 2} />
						<EyeRings cam={cam} head={headAt(you)} frame={frame} at={almost + 6} />
					</>
				)}
			/>
			<Sound name="appear" at={almost + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- rules

export const Rules: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const sw = cue(l0, 'switch it on');
	const clothes = cue(l0, 'Your clothes');
	const pick = cue(l0, 'anything you pick');
	const you: V3 = [0, 0, -1.4];
	// Flicking it on and off, then on for good.
	let g = 1;
	if (frame >= sw && frame < clothes) {
		const ph = Math.floor((frame - sw) / 13);
		const t = span(frame, sw + ph * 13, sw + ph * 13 + 4);
		g = ph % 2 === 0 ? 1 - t : t;
		if (frame > clothes - 18) {
			g = 1 - span(frame, clothes - 18, clothes - 12);
		}
	}
	if (frame >= clothes) {
		g = span(frame, clothes + 6, clothes + 26);
	}
	const lift = span(frame, pick, pick + 22);
	const armR = mixArm([62, 70], [70, 150], lift);
	const reachR = lerp(20, 30, lift);
	const ballAt = handAt(you, 0.5, armR, reachR, 1);
	const rest = handAt(you, 0.5, [62, 70], 20, 1);
	const ball: V3 = frame < pick ? rest : [ballAt[0], ballAt[1] + Math.sin(frame * 0.15) * 0.01, ballAt[2]];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[M(0.2, -1.4, 12), {at: [0.4, 1.0, -1.4], dist: 4.6, yaw: -6, pitch: 8}, C(0.1, -1.4, 20), {at: [0.5, 1.0, -1.3], dist: 3.4, yaw: 30, pitch: 10}]}
				light={LIGHT.room}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.bedroom} window={{x: 2.2}}>
						<Bed3 at={[-3.2, 0, -2.6]} />
						<Shelf3 at={[-1.2, 2.1, -4.3]} />
						<Poster3 at={[3.6, 2.0, -4.35]} color="#3FB7E8" accent="#7CF2A0" />
						<Desk3 at={[rest[0] + 0.12, 0, rest[2]]} w={0.8} d={0.6} h={rest[1] - 0.14} color="#C98A5A" />
					</Room3>
				}
				near={
					<group>
						<Hero3D position={you} turn={0.5} ghost={g} face={frame > pick ? 'happy' : frame > sw ? 'determined' : 'neutral'} armR={armR} reachR={reachR} />
						<group position={ball}>
							<T shape={{kind: 'sphere', r: 0.11}} color="#FFFFFF" outline={0.01} />
							{[[0, 0.1, 0.03], [0.08, 0.02, 0.07], [-0.08, 0.02, 0.07], [0, -0.06, 0.09]].map((p, i) => (
								<T key={i} shape={{kind: 'sphere', r: 0.035}} color="#140A28" position={p as V3} scale={[1, 1, 0.4]} outline={0} />
							))}
						</group>
					</group>
				}
				overlay={() => (
					<>
						<Label text="1 · ON / OFF: JUST THINK IT" x={500} y={210} frame={frame} at={sw} size={40} />
						<Label text="2 · CLOTHES VANISH TOO" x={500} y={300} frame={frame} at={clothes} size={40} color={UI.cyan} />
						<Label text="3 · ANYTHING YOU HOLD FLOATS" x={500} y={390} frame={frame} at={pick} size={40} color={UI.yellow} />
					</>
				)}
			/>
			{[0, 1, 2, 3].map((k) => (
				<Sound key={k} name="pop" at={sw + k * 13} volume={0.3} />
			))}
			<Sound name="vanish" at={clothes + 4} volume={0.5} />
			<Sound name="swish" at={pick} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- eyes

export const Eyes: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const catchAt = cue(l0, 'catch light');
	const cells = cue(l0, 'hundred million');
	const pass = cue(l1, 'pass straight');
	const blind = cue(l1, 'completely blind');
	const stays = cue(l2, 'your eyes');
	const dots = cue(l2, 'Two little dots');
	const ours = frame >= l2.a - 2;
	const clear = span(frame, l1.a, l1.a + 24);
	const p = frame < l1.a ? span(frame, catchAt - 20, catchAt + 50) : span(frame, pass - 10, pass + 60);
	const you: V3 = [0, 0, 0];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					ours
						? [{at: [0, 1.33, 0], dist: 1.6, pitch: 2, fov: 30, dyaw: 6}, M(0, 0, 18), {at: [0, 1.2, 0], dist: 4.2, yaw: -20, pitch: 6}]
						: [{at: [0, 1.4, 0], dist: 6.4, pitch: 4, dyaw: 8}, {at: [0.3, 1.4, 0], dist: 3.6, yaw: 28, pitch: 10}, {at: [0, 1.4, 0], dist: 5.0, yaw: -24, pitch: -4}]
				}
				light={LIGHT.void}
				bg={ours ? BG.studio : BG.void}
				blur={0}
				far={<VoidFloor color={ours ? '#2A2070' : undefined} />}
				near={
					ours ? (
						<Hero3D position={you} ghost={1} face={frame > dots ? 'happy' : 'neutral'} look={[Math.sin(frame * 0.05) * 0.6, 0]} />
					) : (
						<group>
							<Eye3D at={[0, 1.4, 0]} frame={frame} clear={clear} p={p} />
							<Glow shape={{kind: 'sphere', r: 0.35}} color="#FFF4B0" position={[-6.2, 1.4, 0]} />
						</group>
					)
				}
				overlay={(cam) => {
					const [rx, ry] = project(cam, [0.93, 1.4, 0]);
					return ours ? (
						<>
							<EyeRings cam={cam} head={headAt(you)} frame={frame} at={dots} />
							<Label text="THE ONE PART THAT STAYS: YOUR EYES" x={960} y={880} frame={frame} at={stays} until={dots - 4} size={42} color={UI.yellow} />
							<Label text="TWO LITTLE DOTS" x={960} y={880} frame={frame} at={dots} size={46} />
						</>
					) : (
						<>
							<Label text="RETINA" x={rx + 150} y={ry - 120} frame={frame} at={cells - 30} until={l1.a} size={34} color={UI.orange} />
							<Label text="100+ MILLION LIGHT-CATCHING CELLS IN EACH EYE" x={960} y={880} frame={frame} at={cells} until={l1.a - 2} size={40} />
							<Label text="SEE-THROUGH EYE: THE LIGHT GOES STRAIGHT THROUGH" x={960} y={880} frame={frame} at={pass} until={blind - 3} size={40} color={UI.cyan} />
							<Big text="NOTHING CAUGHT = BLIND" x={960} y={230} size={88} frame={frame} at={blind} color={UI.red} />
						</>
					);
				}}
			/>
			<Sound name="chime" at={catchAt + 30} volume={0.3} />
			<Sound name="whoosh" at={pass} volume={0.4} />
			<Sound name="thud" at={blind} volume={0.5} />
			<Sound name="appear" at={l2.a} volume={0.4} />
			<Sound name="pop" at={dots} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- glass

const Apple: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'sphere', r: 0.3, seg: 40}} color="#E8303A" scale={[1, 0.92, 1]} />
		<T shape={{kind: 'cyl', r: 0.02, h: 0.14}} color="#5A3A2A" position={[0, 0.3, 0]} rotation={[0, 0, 0.2]} outline={0.005} />
		<T shape={{kind: 'sphere', r: 0.08}} color="#2EA86A" position={[0.08, 0.34, 0]} scale={[1.4, 0.4, 0.8]} outline={0.006} />
		<T shape={{kind: 'sphere', r: 0.06}} color="#FFFFFF" position={[-0.12, 0.14, 0.22]} scale={[1, 0.6, 0.3]} opacity={0.7} outline={0} />
	</group>
);

export const Glass: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const appleAt = cue(l0, 'red apple');
	const bounce = cue(l0, 'bounces');
	const bends = cue(l1, 'bends');
	const water = cue(l2, 'sixty percent');
	const air = cue(l2, 'exactly the way air');
	const lamp: V3 = [-3.4, 2.5, -0.6];
	const apple: V3 = [-1.2, 1.08, 0];
	const viewer: V3 = [-2.72, 1.36, 0.85];
	const p1 = span(frame, appleAt - 6, appleAt + 34);
	const p2 = span(frame, bounce, bounce + 30);
	const p3 = span(frame, bends - 30, bends + 30);
	const third = frame >= l2.a - 2;
	const rays = [
		['#FF4A4A', 0],
		['#5AE87A', 0.1],
		['#4A8AFF', -0.1],
	] as const;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					third
						? [M(0.6, -1.3, 0), {at: [1.0, 1.15, -0.6], dist: 4.4, yaw: 18, pitch: 6}, C(0.6, -1.3, -12)]
						: frame < l1.a
							? [{at: [-1.8, 1.5, 0.3], dist: 6.2, pitch: 8, yaw: -4}, {at: [-1.3, 1.15, 0], dist: 2.8, yaw: -20, pitch: 10}, {at: [-2.0, 1.4, 0.5], dist: 4.6, yaw: 25, pitch: 6}]
							: [{at: [1.6, 1.15, 0], dist: 3.6, yaw: 8, pitch: 8}, {at: [1.45, 1.1, 0], dist: 2.3, yaw: -18, pitch: 4}]
				}
				light={LIGHT.void}
				bg={BG.studio}
				blur={0}
				far={
					<group>
						<VoidFloor color="#2A2070" />
						<Box size={[6.4, 0.08, 1.6]} at={[0, 0.75, 0]} color="#C98A5A" />
						{[-3, 3].map((x) => [-0.65, 0.65].map((z) => <Box key={`${x}${z}`} size={[0.08, 0.75, 0.08]} at={[x, 0.375, z]} color="#8A5A3E" outline={0.01} />))}
					</group>
				}
				near={
					<group>
						<Glow shape={{kind: 'sphere', r: 0.22}} color="#FFF4B0" position={lamp} />
						<T shape={{kind: 'cone', r: 0.36, h: 0.4}} color="#2A2350" position={[lamp[0], lamp[1] + 0.22, lamp[2]]} />
						<Apple at={apple} />
						{/* someone looking at the apple: the red light lands in their eye */}
						{!third ? <Hero3D who={P3.extras[3]} position={[-3.0, 0, 1.0]} turn={2.1} face="happy" look={[0.6, 0.3]} /> : null}
						{rays.map(([c, o], i) => (
							<RayPath key={c} pts={[[lamp[0] + 0.1, lamp[1] - 0.1 + o, lamp[2]], [apple[0] - 0.2 + o, apple[1] + 0.18 + o * 0.5, apple[2] - 0.08]]} p={p1 * (1 - span(frame, l1.a - 10, l1.a))} r={0.03} color={c} opacity={i === 0 || p1 < 1 ? 1 : 0.4} />
						))}
						<RayPath pts={[[apple[0] - 0.25, apple[1] + 0.12, apple[2] + 0.1], viewer]} p={p2 * (1 - span(frame, l1.a - 10, l1.a))} r={0.035} color="#FF4A4A" />
						{/* the glass of water */}
						<T shape={{kind: 'cyl', r: 0.3, h: 0.5, seg: 40}} color="#7FD0FF" position={[1.5, 1.04, 0]} opacity={0.35} outline={0} />
						<T shape={{kind: 'cyl', r: 0.33, h: 0.8, seg: 40}} color="#E8F8FF" position={[1.5, 1.19, 0]} opacity={0.22} outline={0.012} />
						{[0.92, 1.04, 1.16].map((y, i) => (
							<RayPath key={y} pts={[[-0.6, y, 0], [1.18, y, 0], [1.82, 1.04 + (y - 1.04) * 0.4, 0], [3.4, 1.04 - (y - 1.04) * 0.8, 0]]} p={p3} r={0.025} color={i === 1 ? '#FFFFFF' : '#FFF4B0'} />
						))}
						{third ? <Hero3D position={[0.6, 0, -1.3]} ghost={1} face={frame > air ? 'determined' : 'shocked'} look={[0.6, 0.3]} /> : null}
					</group>
				}
				overlay={() => (
					<>
						<Label text="WE SEE THE LIGHT THAT BOUNCES OFF THINGS" x={960} y={880} frame={frame} at={cue(l0, 'Things look')} until={appleAt - 4} size={40} />
						<Label text="SOAKS UP GREEN & BLUE · BOUNCES RED" x={960} y={880} frame={frame} at={appleAt + 10} until={l1.a - 4} size={40} color={UI.red} />
						<Label text="SEE-THROUGH ≠ INVISIBLE" x={960} y={230} frame={frame} at={l1.a} until={bends - 4} size={48} />
						<Label text="WATER & GLASS BEND LIGHT" x={960} y={880} frame={frame} at={bends} until={l2.a - 4} size={44} color={UI.cyan} />
						<Big text="YOU ≈ 60% WATER" x={960} y={230} size={92} frame={frame} at={water} color={UI.cyan} />
						<Label text="TO VANISH: BEND LIGHT EXACTLY LIKE AIR" x={960} y={880} frame={frame} at={air} size={42} color={UI.yellow} />
					</>
				)}
			/>
			<Sound name="chime" at={bounce + 24} volume={0.35} />
			<Sound name="swish" at={bends - 20} volume={0.35} />
			<Sound name="pop" at={water} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- frog

export const Frog: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const name = cue(l0, 'glass frog');
	const heart = cue(l0, 'heart beat');
	const packs = cue(l1, 'packs');
	const liver = cue(l1, 'liver');
	const more = cue(l1, 'two to three');
	const clear = span(frame, packs, liver + 20);
	const frogAt: V3 = [0, 1.13, 0];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[{at: [0, 1.25, 0], dist: 4.8, pitch: 10, yaw: 12}, {at: [0.1, 1.38, 0.05], dist: 2.9, yaw: 30, pitch: 12, fov: 30}, {at: [0.05, 1.35, 0], dist: 2.5, yaw: 55, pitch: 28, fov: 30}, {at: [0.1, 1.36, 0], dist: 3.1, yaw: 5, pitch: 6, fov: 30}]}
				light={LIGHT.jungle}
				bg={BG.jungle}
				far={
					<group>
						<Box size={[40, 0.1, 40]} at={[0, -0.05, 0]} color="#0E2A20" outline={0} />
						{[[-4, -6], [-1.5, -8], [2.5, -7], [5, -5], [-6, -3.5], [7, -9]].map(([x, z], i) => (
							<T key={i} shape={{kind: 'cyl', r: 0.35 + (i % 2) * 0.15, h: 12, seg: 14}} color={i % 2 ? '#2A3A2A' : '#1E2E24'} position={[x, 6, z]} outline={0.02} />
						))}
						<Glow shape={{kind: 'sphere', r: 1.4}} color="#E8F4FF" position={[4, 7, -14]} />
						{[[-2.4, 0.9, -1.8, 0.8, 0.6], [2.2, 1.6, -2.4, 0.9, -2.2], [-1.4, 2.2, -3, 0.7, 2.6], [3.2, 0.7, -1, 0.6, -0.8], [-3.4, 1.4, -0.6, 0.7, 0.3]].map(([x, y, z, s, r], i) => (
							<group key={i}>
								<T shape={{kind: 'cyl', r: 0.03, h: y}} color="#2E6A3A" position={[x, y / 2, z]} outline={0.006} />
								<Leaf3D at={[x, y, z]} s={s} rot={r} />
							</group>
						))}
					</group>
				}
				near={
					<group>
						<T shape={{kind: 'cyl', r: 0.035, h: 1.08}} color="#2E6A3A" position={[-0.6, 0.54, 0]} outline={0.006} />
						<Leaf3D at={[0, 1.08, 0]} s={0.62} rot={-0.6} />
						<Frog3D at={frogAt} frame={frame} clear={clear} rot={-0.6} />
						{[...Array(16)].map((_, i) => {
							const t = frame * 0.01 + i * 0.7;
							return <Glow key={i} shape={{kind: 'sphere', r: 0.035, seg: 8}} color="#E8FF8A" position={[Math.sin(t * 1.3 + i) * 3, 1.2 + Math.sin(t * 2 + i) * 0.8, -1.5 + Math.cos(t + i) * 1.5]} opacity={0.4 + 0.6 * Math.max(0, Math.sin(frame * 0.2 + i * 1.7))} />;
						})}
					</group>
				}
				overlay={() => (
					<>
						<Big text="GLASS FROG" x={960} y={230} size={96} frame={frame} at={name} until={heart - 4} color={UI.green} />
						<Label text="♥ YOU CAN SEE ITS HEART BEAT" x={960} y={880} frame={frame} at={heart} until={l1.a - 4} size={44} color={UI.red} />
						<Label text="STUDY · 2022" x={960} y={230} frame={frame} at={l1.a} until={packs - 4} size={46} />
						<Count from={0} to={89} suffix="%" x={960} y={235} size={120} frame={frame} at={packs} dur={40} color={UI.red} />
						<Label text="OF ITS RED BLOOD CELLS HIDE IN ITS LIVER" x={960} y={880} frame={frame} at={packs + 10} until={more - 4} size={40} />
						<Label text="2-3× MORE SEE-THROUGH" x={960} y={880} frame={frame} at={more} size={46} color={UI.cyan} />
					</>
				)}
			/>
			<Sound name="heart" at={heart} volume={0.45} />
			<Sound name="heart" at={heart + 30} volume={0.4} />
			<Sound name="chime" at={liver + 10} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- breakfast

export const Breakfast: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const swallow = cue(l0, 'swallow');
	const turns = cue(l1, 'turns round');
	const hours = cue(l1, 'few hours');
	const you: V3 = [0.4, 0.46, -2.2];
	const eating = frame < swallow + 6;
	const t = eating ? 0.5 - 0.5 * Math.cos(Math.max(0, frame - 4) * 0.13) : 0;
	const armR = mixArm([10, 25], [5, -30], t);
	const reachR = lerp(75, 120, t);
	const hand = handAt(you, 0, armR, reachR, 1, true);
	const flakesY = track(frame, [
		[swallow, 1.32],
		[l2.a, 0.98],
	]);
	const hide = cue(l2, 'he has to hide');
	const book = frame >= l2.a - 2 && frame < hide + 12;
	const after = frame >= hide + 12;
	const mumTurn = lerp(Math.PI, 0.95, span(frame, turns - 4, turns + 10));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					after
						? [{at: [0.4, 1.15, -2.1], dist: 1.9, yaw: -12, pitch: 4, fov: 30}]
						: book
						? [{at: [-0.4, 1.2, -2.4], dist: 7.2, pitch: 10, yaw: 8, dyaw: 4}]
						: frame < l1.a
							? [W(-0.2, -2.2, 6.6, 6, 12), C(0.4, -2.2, 0, 1.95), {at: [0.62, 1.15, -1.9], dist: 1.9, yaw: 25, pitch: 12, fov: 30}]
							: [C(-1.8, -3.2, 56), {at: [0.4, 1.15, -2.1], dist: 1.7, yaw: -10, pitch: 4, fov: 30}, W(-0.4, -2.4, 6.6, -10, 12), C(0.4, -2.2, 10, 1.95)]
				}
				light={LIGHT.morning}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.kitchen} window={{x: 1.8}}>
						<Counter3 at={[-2.0, 0, -3.9]} w={4.6} />
						<Counter3 at={[3.8, 0, -3.9]} w={2.4} color="#E8453C" />
						<Kettle3D at={[-3.3, 0.96, -3.9]} />
						<Plant3 at={[5.2, 0, -2.8]} />
						<Desk3 at={[0.4, 0, -1.7]} w={1.7} d={0.95} color="#E8D8C0" />
						<Chair3 at={[0.4, 0, -2.3]} color="#E8453C" />
						<Chair3 at={[-0.6, 0, -1.7]} rot={Math.PI / 2} color="#3FB7E8" />
					</Room3>
				}
				near={
					<group>
						<Hero3D position={you} sit ghost={1} face={frame > turns ? 'scared' : 'happy'} look={frame > turns ? [-1, 0] : [0, 0.6]} armR={armR} reachR={reachR} armL={[12, 40]} reachL={60} />
						<Bowl3D at={[0.82, 0.78, -1.64]} />
						<Spoon3D at={hand} rot={[0, 0.9, 0.35]} flakes={eating && t > 0.35} />
						{frame >= swallow - 2 ? <Flakes3D at={[0.4, flakesY, -2.06]} /> : null}
						<Hero3D who={P3.mum} position={[-1.8, 0, -3.2]} turn={mumTurn} face={frame > turns + 6 ? 'shocked' : 'neutral'} armL={frame > turns + 6 ? [120, 207] : [30, 60]} armR={frame > turns + 6 ? [120, 207] : [30, 60]} reachR={frame > turns + 6 ? 0 : 50} reachL={frame > turns + 6 ? 0 : 50} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Says cam={cam} head={top(-1.8, -3.2)} text="Cornflakes?! FLOATING?!" frame={frame} at={turns + 10} until={l2.a - 4} />
						<Label text="⏳ A STOMACH TAKES A FEW HOURS TO EMPTY" x={960} y={880} frame={frame} at={hours} until={l2.a - 4} size={40} />
						{book ? <Book frame={frame} at={l2.a + 4} until={hide + 2} /> : null}
						<Label text="HE HID UNTIL EVERY MEAL WAS DIGESTED" x={960} y={880} frame={frame} at={hide + 14} size={40} color={UI.yellow} />
					</>
				)}
			/>
			<Sound name="crunch" at={swallow - 14} volume={0.5} />
			<Sound name="pop" at={turns + 10} volume={0.45} />
			<Sound name="whoosh" at={l2.a} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- the classroom (sideways: the board is on the left wall)

const ROWS = [-2.6, -1.0, 0.6, 2.2];
const LINES = [-3.0, -1.6];
const YOUR_SEAT: [number, number] = [0.6, -1.6];

const Classroom: React.FC<{text?: string; teacher?: boolean}> = ({text, teacher = true}) => (
	<Room3 look={ROOM3.classroom} window={{x: 2.6, w: 2.4}}>
		<group position={[-5.85, 1.9, -1.9]} rotation={[0, Math.PI / 2, 0]}>
			{text !== undefined ? <Whiteboard3D at={[0, 0, 0]} text={text} /> : <Board3 at={[0, 0, 0]} />}
		</group>
		<Clock3 at={[-1.8, 3.0, -4.35]} />
		<Poster3 at={[-3.6, 2.2, -4.35]} color="#7CF2A0" accent="#3FB7E8" />
		<Shelf3 at={[4.2, 1.6, -4.3]} />
		{teacher ? <Desk3 at={[-4.4, 0, -0.4]} w={1.2} d={0.7} color="#8A5A3E" /> : null}
		{ROWS.map((x) =>
			LINES.map((z) => (
				<group key={`${x}${z}`}>
					<Desk3 at={[x - 0.55, 0, z]} w={0.6} d={0.9} h={0.7} />
					<Chair3 at={[x + 0.1, 0, z]} rot={-Math.PI / 2} color="#3FB7E8" />
				</group>
			)),
		)}
	</Room3>
);

/** The class: everyone except you, seated facing the board (-x), each turning towards `look` by `t`. */
const Pupils: React.FC<{frame: number; look?: [number, number]; t?: number; face?: (i: number) => 'neutral' | 'shocked' | 'scared' | 'happy'; scream?: number}> = ({frame, look, t = 0, face, scream = 0}) => (
	<group>
		{ROWS.flatMap((x, r) =>
			LINES.map((z, c) => {
				if (x === YOUR_SEAT[0] && z === YOUR_SEAT[1]) {
					return null;
				}
				const i = r * 2 + c;
				const toward = look ? Math.atan2(look[0] - x, look[1] - z) : -Math.PI / 2;
				let d = toward - -Math.PI / 2;
				while (d > Math.PI) d -= Math.PI * 2;
				while (d < -Math.PI) d += Math.PI * 2;
				const up = scream > 0 && i % 2 === 0;
				return (
					<Hero3D
						key={i}
						who={P3.extras[i % P3.extras.length]}
						position={[x, 0.46 + (up ? Math.abs(Math.sin(frame * 0.4 + i)) * 0.06 * scream : 0), z]}
						sit
						turn={-Math.PI / 2 + d * t}
						face={face ? face(i) : 'neutral'}
						armL={up ? [150 * scream + 20, 175 * scream + 20] : [20, 60]}
						armR={up ? [150 * scream + 20, 175 * scream + 20] : [20, 60]}
						reachL={up ? 0 : 50}
						reachR={up ? 0 : 50}
						lite
					/>
				);
			}),
		)}
	</group>
);

export const Register: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const looks = cue(l0, 'looks up');
	const absent = cue(l0, 'marks you absent');
	const here = l1.a;
	const turnT = span(frame, cue(l1, 'Thirty heads') - 6, cue(l1, 'Thirty heads') + 14);
	const you: V3 = [YOUR_SEAT[0], 0.46, YOUR_SEAT[1]];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={frame < here - 4 ? [W(-1.2, -1.6, 7.6, 8, 12), C(-4.6, -1.0, 90), C(-4.6, -1.0, 75, 1.7, -2)] : [{at: [0.6, 1.4, -1.6], dist: 3.0, yaw: -70, pitch: 28, fov: 32}, W(-0.8, -1.4, 7.4, -12, 14), {at: [0.2, 1.2, -1.8], dist: 4.6, yaw: -40, pitch: 22}]}
				light={LIGHT.day}
				bg={BG.room}
				far={<Classroom />}
				near={
					<group>
						<Hero3D who={P3.teacher} position={[-4.6, 0, -1.0]} turn={Math.PI / 2} face={frame > absent ? 'determined' : frame > here ? 'shocked' : 'neutral'} talk={frame > absent - 4 && frame < absent + 20 ? 0.5 : 0} look={frame > looks ? [0.6, 0] : [0.4, 0.6]} armL={[40, 120]} reachL={40} />
						<Box size={[0.3, 0.4, 0.03]} at={handAt([-4.6, 0, -1.0], Math.PI / 2, [40, 120], 40, -1)} color="#C98A5A" rot={[0, Math.PI / 2, -0.4]} />
						<Pupils frame={frame} look={YOUR_SEAT} t={turnT} face={(i) => (frame > here + 10 ? (i % 3 === 0 ? 'scared' : 'shocked') : 'neutral')} />
						<Hero3D position={you} sit turn={-Math.PI / 2} ghost={1} face={frame > here ? 'smug' : 'neutral'} look={frame > here ? [0, 0] : [-0.4, 0]} armL={[20, 60]} armR={[20, 60]} reachL={50} reachR={50} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Says cam={cam} head={top(-4.6, -1.0)} text="Absent." frame={frame} at={absent} until={here - 2} />
						<Says cam={cam} head={top(you[0], you[2], 0.46, true)} text="Here!" frame={frame} at={here} size={56} />
					</>
				)}
			/>
			<Sound name="pop" at={absent} volume={0.4} />
			<Sound name="pop" at={here} volume={0.5} />
			<Sound name="swish" at={cue(l1, 'Thirty heads')} volume={0.35} />
		</>
	);
};

export const Prank: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const floats = cue(l0, 'A pen floats');
	const writes = cue(l0, 'writes');
	const screams = cue(l0, 'Half the class screams');
	const films = cue(l0, 'films it');
	const haunted = l1.a;
	const you: V3 = [-5.05, 0, -1.9];
	const n = Math.max(0, Math.min(5, Math.floor((frame - writes) / 7)));
	const writing = frame >= writes && n < 5;
	const armR: [number, number] = frame < floats ? [14, 10] : [lerp(55, 95, (n + (writing ? ((frame - writes) % 7) / 7 : 0)) / 5), lerp(60, 100, span(frame, floats, writes))];
	const reachR = frame < floats ? 0 : lerp(20, 78, span(frame, floats, writes));
	const pen = frame < floats ? ([-4.4, 0.74, -0.4] as V3) : handAt(you, -Math.PI / 2, armR, reachR, 1);
	const outside = frame >= haunted - 2;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					outside
						? [W(0, -1.0, 9, 0, 6), C(-1.1, 0.2, 10)]
						: [{at: [-5.5, 1.65, -1.6], dist: 3.6, yaw: 42, pitch: 4}, W(-1.6, -1.6, 7.2, 6, 10), {at: [-1.6, 1.3, -2.2], dist: 3.6, yaw: -58, pitch: 6}, {at: [-5.5, 1.6, -1.6], dist: 2.8, yaw: 35, pitch: 2}]
				}
				light={LIGHT.day}
				bg={BG.sky}
				far={outside ? <School3 /> : <Classroom text={'HELLO'.slice(0, n)} teacher={false} />}
				near={
					outside ? (
						<group>
							{[-3, -1.8, -0.4, 1, 2.2, 3.4].map((x, i) => (
								<Hero3D key={x} who={P3.extras[i]} position={[x, 0, 0.2 - (i % 2) * 0.8]} turn={i % 2 ? 0.3 : -0.2} face={i % 2 ? 'scared' : 'shocked'} armR={i % 3 === 0 ? [95, 150] : [30, 50]} reachR={i % 3 === 0 ? -60 : 0} lite />
							))}
							<Hero3D position={[-1.1, 0, 0.2]} ghost={1} face="smug" look={[0.5, 0]} />
						</group>
					) : (
						<group>
							<Pupils frame={frame} face={(i) => (frame > screams ? (i % 2 ? 'shocked' : 'scared') : 'neutral')} scream={span(frame, screams, screams + 8)} />
							<Hero3D position={you} turn={-Math.PI / 2} ghost={1} face="happy" armR={armR} reachR={reachR} />
							<Pen3D at={pen} rot={frame < floats ? [0, 0, Math.PI / 2] : [0, 0, -0.5]} />
							{[1, 3, 5].map((i) => {
								const x = ROWS[Math.floor(i / 2)];
								const z = LINES[i % 2];
								return frame > films ? <Box key={i} size={[0.08, 0.14, 0.02]} at={[x - 0.42, 1.25, z + 0.06]} rot={[0, -Math.PI / 2, 0]} color="#140A28" /> : null;
							})}
						</group>
					)
				}
				overlay={(cam) =>
					outside ? (
						<Big text="HAUNTED?!" x={960} y={230} size={110} frame={frame} at={haunted + 4} color={UI.red} rotate={-3} />
					) : (
						<>
							<Says cam={cam} head={top(ROWS[0], LINES[0], 0.46, true)} text="AAAAH!" frame={frame} at={screams} size={44} />
							<Says cam={cam} head={top(ROWS[2], LINES[0], 0.46, true)} text="A GHOST!!" frame={frame} at={screams + 8} size={44} />
							<PhoneFeed frame={frame} at={films} views={48000} x={1560} y={560} comments={['NO WAY', 'thats MY school!!', 'fake...', "who's doing that??"]} />
						</>
					)
				}
			/>
			<Sound name="swish" at={floats} volume={0.3} />
			{[0, 1, 2, 3, 4].map((k) => (
				<Sound key={k} name="tick" at={writes + k * 7} volume={0.25} />
			))}
			<Sound name="crowd" at={screams} volume={0.45} />
			<Sound name="boom" at={haunted + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- staff room

export const Staff: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const kettle = cue(l0, 'broken kettle');
	const marking = cue(l0, 'mountain of marking');
	const maths = cue(l0, 'maths teacher');
	const sad = cue(l0, 'huge disappointment');
	const walk = span(frame, 0, sad);
	const you: V3 = [lerp(3.4, 1.6, walk), 0, lerp(-3.6, -1.4, walk)];
	const puffs = [...Array(6)].map((_, i) => {
		const t = ((frame * 0.012 + i / 6) % 1);
		return <T key={i} shape={{kind: 'sphere', r: 0.08 + t * 0.12}} color="#9A94A8" position={[-3.15 + t * 0.15, 1.3 + t * 0.9, -3.9]} opacity={(1 - t) * 0.8} outline={0} />;
	});
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, sad - 6, kettle - 4, marking - 4, maths - 4]}
				angles={[W(0.4, -2.4, 7.4, -6, 12), C(1.6, -1.4, -30), {at: [-3.2, 1.25, -3.9], dist: 1.9, yaw: 12, pitch: 10, fov: 30}, {at: [0.9, 1.1, -2.4], dist: 2.0, yaw: -14, pitch: 18, fov: 32}, C(-1.3, -2.0, 30, 1.55)]}
				light={LIGHT.warm}
				bg={BG.room}
				far={
					<Room3 look={{wall: '#C9B48A', floor: '#7A6A5A', trim: '#EDE2C8'}} window={{x: -0.6}}>
						<Door3 at={[3.6, 0, -4.38]} open={span(frame, 0, 18) * (1 - span(frame, sad, sad + 20))} color="#8A5A3E" />
						<CanvasPlane w={0.9} h={0.32} px={360} dep="staff" position={[3.6, 2.45, -4.36]} draw={(ctx, W2, H) => {
							ctx.fillStyle = '#FFFFFF';
							ctx.fillRect(0, 0, W2, H);
							ctx.fillStyle = '#2A2350';
							ctx.font = `bold ${H * 0.42}px Fredoka, sans-serif`;
							ctx.textAlign = 'center';
							ctx.fillText('STAFF ROOM', W2 / 2, H * 0.48);
							ctx.fillStyle = '#E8453C';
							ctx.font = `bold ${H * 0.28}px Fredoka, sans-serif`;
							ctx.fillText('NO PUPILS', W2 / 2, H * 0.86);
						}} />
						<Counter3 at={[-2.6, 0, -3.9]} w={3.2} color="#8A9AB8" />
						<Kettle3D at={[-3.3, 0.96, -3.9]} />
						<Desk3 at={[0.9, 0, -2.4]} w={1.3} d={0.8} color="#9A6A48" />
						<Box size={[2.2, 1.2, 0.05]} at={[1.6, 2.0, -4.38]} color="#C9925A" />
						{[...Array(7)].map((_, i) => (
							<Box key={i} size={[0.3, 0.36, 0.01]} at={[0.8 + (i % 4) * 0.5, 1.75 + Math.floor(i / 4) * 0.5, -4.34]} rot={[0, 0, (i % 3) * 0.08 - 0.08]} color={['#FFF3D6', '#FFD84A', '#7FE0FF', '#FF8AD8'][i % 4]} outline={0.004} />
						))}
					</Room3>
				}
				near={
					<group>
						<Marking3D at={[0.9, 0.78, -2.4]} n={16} />
						<Marking3D at={[1.3, 0.78, -2.3]} n={9} />
						{puffs}
						<Glow shape={{kind: 'sphere', r: 0.03, seg: 8}} color="#FFE24A" position={[-3.18, 1.16 + Math.sin(frame) * 0.02, -3.78]} opacity={frame % 9 < 3 ? 1 : 0} />
						<Armchair3D at={[-1.3, 0, -2.1]} rot={0.5} />
						<Hero3D who={P3.maths} position={[-1.3, 0.5, -2.05]} sit turn={0.5} face="neutral" blink={1} tilt={18} still armL={[25, 50]} armR={[25, 50]} reachL={40} reachR={40} />
						<T shape={{kind: 'cyl', r: 0.06, h: 0.1}} color="#FF8A3D" position={[-0.82, 0.66, -1.8]} outline={0.006} />
						<Hero3D position={you} turn={lerp(-0.6, -0.5, walk)} ghost={1} face={frame > sad ? 'sad' : 'happy'} walk={frame < sad ? frame / 16 : undefined} look={frame > maths ? [-1, 0.2] : [-0.5, 0]} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Thought cam={cam} head={[-1.15, 2.3, -2.05]} text="Zzz..." frame={frame} at={maths} size={40} />
					</>
				)}
			/>
			<Sound name="sizzle" at={kettle} volume={0.3} />
			<Sound name="thud" at={marking} volume={0.25} />
		</>
	);
};
