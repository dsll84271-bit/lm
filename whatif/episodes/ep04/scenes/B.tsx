import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Count, Label, UI} from '../../../components/ui';
import {Ant3D, AntCrowd, CatHead3D, CatPaw3D, Mouse3D, Strider3D, type AntSpot} from '../../../three/bugs3d';
import {BigCrumb3D, Boards3D, Carpet, Crumb3D, DoorGap3D, Drop3D, FridgeUnder3D, Ground, Grass, Slipper3D, Water3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Mic3D} from '../../../three/props3d2';
import {Box} from '../../../three/sets3d';
import {project} from '../../../three/Stage3D';
import {Shot3, Says, Thought} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {HeartMonitor} from '../../ep03/scenes/hud';
import {BG, LIGHT, P4} from './kit';
import {headAt, top, type V3} from './util';

// Part B: how many ants there are, Pip's strength, riding the scent trail,
// cold and hunger, Mum who can't hear you, the cat, a sticky drop of water,
// and the water strider.

/** A line of ants marching from a to b, `n` of them, spaced along it. */
export const antLine = (a: V3, b: V3, n: number, frame: number, speed = 0.02, s = 1): AntSpot[] => {
	const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
	const rot = Math.atan2(d[0], d[2]);
	return [...Array(n)].map((_, i) => {
		const t = (i / n + frame * speed) % 1;
		return {p: [a[0] + d[0] * t, a[1] + d[1] * t, a[2] + d[2] * t] as V3, rot, s, walk: frame / 14 + i * 0.37};
	});
};

/** A little bird, for the scales. */
const Bird: React.FC<{at: V3; rot?: number; color?: string; s?: number}> = ({at, rot = 0, color = '#3FB7E8', s = 1}) => (
	<group position={at} rotation={[0, rot, 0]} scale={s}>
		<T shape={{kind: 'sphere', r: 0.45, seg: 24}} color={color} position={[0, 0.45, 0]} scale={[0.9, 0.85, 1.2]} outline={0.02} />
		<T shape={{kind: 'sphere', r: 0.3, seg: 20}} color={color} position={[0, 0.85, 0.35]} outline={0.02} />
		<T shape={{kind: 'cone', r: 0.08, h: 0.25}} color="#FFB02A" position={[0, 0.83, 0.7]} rotation={[Math.PI / 2, 0, 0]} outline={0.01} />
		{[-1, 1].map((sd) => (
			<group key={sd}>
				<T shape={{kind: 'sphere', r: 0.05, seg: 10}} color="#140A28" position={[sd * 0.15, 0.92, 0.58]} outline={0} />
				<T shape={{kind: 'sphere', r: 0.3, seg: 16}} color={color} position={[sd * 0.38, 0.5, -0.05]} scale={[0.3, 0.6, 1]} outline={0.015} />
			</group>
		))}
	</group>
);

// ---------------------------------------------------------------- count

export const CountScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const scientists = cue(l0, 'In twenty');
	const quad = cue(l0, 'twenty quadrillion');
	const each = cue(l0, "That's two");
	const scale = l1.a;
	const outweigh = cue(l1, "they'd outweigh");
	const tilt = span(frame, outweigh - 10, outweigh + 20) * 0.22;
	const crowd: AntSpot[] = [];
	for (let r = 0; r < 14; r++) {
		for (let c = 0; c < 22; c++) {
			crowd.push({p: [-16 + c * 1.5 + (r % 2) * 0.7, 0, -4 - r * 2.2], rot: Math.PI + Math.sin(r * 3 + c) * 0.3, walk: frame / 15 + r * 0.3 + c * 0.17});
		}
	}
	const heap: AntSpot[] = [];
	for (let i = 0; i < 60; i++) {
		const a = i * 2.4;
		const d = Math.sqrt(i / 60) * 2.6;
		heap.push({p: [Math.cos(a) * d, 0.3 + (1 - d / 2.6) * 1.6 + (i % 3) * 0.15, Math.sin(a) * d], rot: a * 1.7, s: 0.6, pitch: Math.sin(i) * 0.4});
	}
	const beamY = 9;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, scientists - 4, each - 4, scale - 4]}
				angles={[
					{at: [0, 1.4, -6], dist: 18, yaw: 160, pitch: 14, fov: 40, ddist: 4},
					{at: [0, 1.5, 0], dist: 14, yaw: 20, pitch: 10, fov: 36},
					{at: [0, 1.4, -6], dist: 22, yaw: 190, pitch: 20, fov: 40},
					{at: [0, 6, 0], dist: 22, yaw: 0, pitch: 6, fov: 40, dyaw: 0},
				]}
				light={frame < scale - 4 ? LIGHT.carpet : LIGHT.studio}
				bg={frame < scale - 4 ? BG.carpet : BG.studio}
				far={frame < scale - 4 ? <Carpet size={90} clear={6} gap={[0, 2]} seed={21} /> : <Box size={[90, 0.1, 90]} at={[0, -0.05, 0]} color="#2A2160" outline={0} />}
				near={
					frame < scale - 4 ? (
						<group>
							<Hero3D position={[-1, 0, 4]} turn={Math.PI} face="shocked" />
							<Ant3D at={[1.2, 0, 4]} rot={Math.PI} frame={frame} pip />
							{frame < scientists - 4 || frame > each - 4 ? <AntCrowd frame={frame} ants={crowd} /> : null}
						</group>
					) : (
						<group>
							<T shape={{kind: 'cyl', r: 0.5, r2: 0.9, h: beamY, seg: 20}} color="#C9A06A" position={[0, beamY / 2, -1]} outline={0.04} />
							<group position={[0, beamY, -1]} rotation={[0, 0, tilt]}>
								<Box size={[18, 0.5, 0.6]} at={[0, 0, 0]} color="#E8B83A" />
								{[-1, 1].map((sd) => (
									<group key={sd} position={[sd * 8.5, 0, 0]} rotation={[0, 0, -tilt]}>
										{[[-1, -1], [1, -1], [0, 1]].map(([x, z], k) => (
											<T key={k} shape={{kind: 'cyl', r: 0.04, h: 5.2, seg: 6}} color="#8A6A3A" position={[x * 1.3, -2.6, z * 1.1]} rotation={[z * 0.24, 0, -x * 0.24]} outline={0} />
										))}
										<T shape={{kind: 'cyl', r: 3.2, r2: 2.6, h: 0.5, seg: 36}} color="#E8B83A" position={[0, -5.3, 0]} outline={0.04} />
										<group position={[0, -5.05, 0]}>
											{sd < 0 ? (
												<AntCrowd frame={frame} ants={heap} legs={false} />
											) : (
												<group>
													<Bird at={[-1.2, 0, 0.4]} rot={0.6} />
													<Bird at={[0.9, 0, -0.6]} rot={-0.4} color="#E8453C" />
													<Mouse3D at={[0.6, 0, 1.2]} frame={frame} rot={-0.3} s={1.4} />
													<Mouse3D at={[-0.8, 0, -1.2]} frame={frame} rot={0.8} s={1.2} shrew />
												</group>
											)}
										</group>
									</group>
								))}
							</group>
						</group>
					)
				}
				overlay={(cam) =>
					frame < scientists - 4 ? null : frame < each - 4 ? (
						<AbsoluteFill style={{background: 'rgba(10,6,30,0.55)'}}>
							<Count from={0} to={20_000_000_000_000_000} x={960} y={500} size={96} frame={frame} at={quad - 30} dur={36} />
							<Label text="ANTS ON EARTH" x={960} y={640} frame={frame} at={quad} size={56} color={UI.cream} />
							<Label text="2022 · HUNDREDS OF STUDIES WORLDWIDE" x={960} y={760} frame={frame} at={scientists + 8} size={40} color={UI.cyan} />
						</AbsoluteFill>
					) : frame < scale - 4 ? (
						<Big text="2.5 MILLION ANTS PER PERSON" x={960} y={880} size={80} frame={frame} at={each + 6} />
					) : (
						<>
							<Label text="ALL THE ANTS" x={project(cam, [-8.5, 3, -1])[0]} y={260} frame={frame} at={scale + 6} size={46} color={UI.yellow} />
							<Label text="ALL WILD BIRDS + MAMMALS" x={project(cam, [8.5, 3, -1])[0]} y={260} frame={frame} at={scale + 16} size={42} color={UI.cyan} />
							<Big text="ANTS WEIGH MORE" x={960} y={890} size={90} frame={frame} at={outweigh + 20} color={UI.green} />
						</>
					)
				}
			/>
			<Sound name="tick" at={quad - 30} volume={0.3} loop={36} />
			<Sound name="boom" at={quad + 6} volume={0.3} />
			<Sound name="thud" at={outweigh + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- neck

export const Neck: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const tested = cue(l0, 'engineers');
	const found = cue(l0, 'found the joint');
	const five = cue(l0, 'five thousand');
	const lift = span(frame, 10, 40);
	const ring = frame > found - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, tested - 4, found - 4]}
				angles={[
					{at: [0, 1.6, 0], dist: 7, yaw: 55, pitch: 6, fov: 34},
					{at: [0, 1.8, 0], dist: 9, yaw: -40, pitch: 10, fov: 36},
					{at: [0, 1.0, 0.5], dist: 3.6, yaw: 80, pitch: 6, fov: 32},
				]}
				light={LIGHT.carpet}
				bg={BG.carpet}
				far={<Carpet size={80} clear={4} seed={23} />}
				near={
					<group>
						<Ant3D at={[0, 0, 0]} rot={0} frame={frame} pip nod={-0.45 * lift} jaws={0.5}>
							<BigCrumb3D at={[0, lerp(0.9, 2.6, lift), lerp(1.4, 0.9, lift)]} rot={[0.2, frame * 0.004, 0]} />
						</Ant3D>
						{ring ? (
							<group position={[0, 0.75, 0.32]} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
								<T shape={{kind: 'torus', r: 0.24, tube: 0.04}} color="#FFD84A" emissive="#FFD84A" emissiveIntensity={0.6} outline={0} opacity={0.6 + Math.sin(frame * 0.3) * 0.3} />
							</group>
						) : null}
						<Hero3D position={[-2.4, 0, 1.6]} turn={1.2} face="shocked" look={[0.6, 0.5]} />
					</group>
				}
				overlay={() => (
					<>
						<Label text="OHIO STATE UNIVERSITY · 2014" x={960} y={210} frame={frame} at={tested} size={42} color={UI.cyan} />
						{ring ? <Label text="THE NECK JOINT" x={1320} y={430} frame={frame} at={found} size={42} color={UI.yellow} /> : null}
						<Big text="~5,000× ITS WEIGHT" x={960} y={880} size={96} frame={frame} at={five} />
					</>
				)}
			/>
			<Sound name="whoosh" at={12} volume={0.3} />
			<Sound name="pop" at={found} volume={0.3} />
			<Sound name="boom" at={five} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- ride

/** The scent trail: soft green dots on the floor along x = 0, from z0 to z1, pulsing. */
const Trail: React.FC<{z0: number; z1: number; frame: number; x?: number}> = ({z0, z1, frame, x = 0}) => (
	<group>
		{[...Array(Math.floor(Math.abs(z1 - z0) / 1.2))].map((_, i) => {
			const z = z0 + Math.sign(z1 - z0) * i * 1.2;
			const pulse = 0.45 + 0.35 * Math.sin(frame * 0.2 - i * 0.6);
			return <Glow key={i} shape={{kind: 'sphere', r: 0.35, seg: 12}} color="#9CFF8A" position={[x + Math.sin(i * 0.7) * 0.3, 0.08, z]} opacity={pulse} />;
		})}
	</group>
);

export const Ride: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const trail = cue(l0, 'Pip follows');
	const door = cue(l0, 'Under your');
	const hall = cue(l0, 'along the hall');
	const kitchen = cue(l0, 'all the way');
	const smell = cue(l0, 'Lots of ants');
	const climb = span(frame, 4, 22);
	const z = frame < trail ? 0 : (frame - trail) * 0.32;
	const set = frame < door - 4 ? 'carpet' : frame < hall - 4 ? 'door' : 'hall';
	const pz = set === 'door' ? (frame - door) * 0.32 - 8 : set === 'hall' ? (frame - hall) * 0.36 : z;
	const antAt: V3 = [0, 0, pz];
	const riding = climb >= 1;
	const you: V3 = riding ? [0, 0.62, -0.25] : [lerp(-1.4, 0, climb), climb * 0.8, lerp(0.2, -0.25, climb)];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, trail - 4, door - 4, hall - 4, smell - 4]}
				angles={[
					{at: [0, 1.2, 0], dist: 6, yaw: 60, pitch: 10, fov: 34},
					{at: [0, 1.0, pz + 2], dist: 8, yaw: 160, pitch: 18, fov: 36, ddist: 0, dyaw: 10},
					{at: [0, 2.5, pz], dist: 12, yaw: 70, pitch: 2, fov: 38, ddist: 0},
					{at: [0, 1.3, pz], dist: 7, yaw: 20, pitch: 6, fov: 36, ddist: 0},
					{at: [0, 1.0, pz + 0.6], dist: 3.2, yaw: 30, pitch: 4, fov: 32, ddist: 0},
				]}
				light={set === 'carpet' ? LIGHT.carpet : LIGHT.hall}
				bg={set === 'carpet' ? BG.carpet : BG.hall}
				far={
					set === 'carpet' ? (
						<group>
							<Carpet size={120} clear={3} gap={[0, 0]} seed={29} />
							<Trail z0={-20} z1={60} frame={frame} />
						</group>
					) : set === 'door' ? (
						<group>
							<Boards3D />
							<DoorGap3D at={[0, 0, 0]} gap={5} />
							<Trail z0={-40} z1={40} frame={frame} />
						</group>
					) : (
						<group>
							<Boards3D />
							<Trail z0={-40} z1={160} frame={frame} />
						</group>
					)
				}
				near={
					<Ant3D at={antAt} rot={0} frame={frame} pip walk={frame > trail ? frame / 7 : undefined} gaze={frame > smell ? [0, -0.2] : [0, 0]}>
						<Hero3D position={you} sit={riding} face={frame > smell ? 'neutral' : riding ? 'happy' : 'determined'} armL={riding ? [30, 60] : [120, 160]} armR={riding ? [30, 60] : [120, 160]} reachL={riding ? 30 : 0} reachR={riding ? 30 : 0} />
					</Ant3D>
				}
				overlay={() => (
					<>
						{set === 'carpet' && frame > trail ? <Label text="A SCENT TRAIL" x={960} y={870} frame={frame} at={trail + 10} size={50} color={UI.green} /> : null}
						{frame > smell - 4 ? <Label text="MANY ANTS FIND THE WAY BY SMELL" x={960} y={870} frame={frame} at={smell} size={46} color={UI.green} /> : null}
					</>
				)}
			/>
			<Sound name="pop" at={20} volume={0.3} />
			<Sound name="run" at={trail} volume={0.25} loop={dur - trail} />
			<Sound name="whoosh" at={door} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- crumbs

export const Crumbs: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const eat = cue(l0, 'You eat');
	const later = cue(l0, 'Ten minutes');
	const freezing = cue(l0, 'And freezing');
	const cold = frame > later - 4;
	const shiver = frame > freezing ? Math.sin(frame * 2.2) * 0.04 : 0;
	const you: V3 = [0.8 + shiver, 0, 1.2];
	const bites = cold ? 1 : span(frame, eat, eat + 40);
	const breaths = frame > freezing ? [0, 1, 2].map((k) => ((frame - freezing + k * 12) % 36) / 36) : [];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, eat - 4, later - 4, freezing - 4]}
				angles={[
					{at: [0, 1.2, 0], dist: 10, yaw: 25, pitch: 10, fov: 36},
					{at: [0.5, 1.3, 1], dist: 4.2, yaw: 50, pitch: 6, fov: 32},
					{at: [0.5, 1.2, 1], dist: 6.5, yaw: -30, pitch: 10, fov: 34},
					{at: [0.8, 1.25, 1.2], dist: 2.8, yaw: 10, pitch: 4, fov: 30},
				]}
				light={cold ? LIGHT.cold : LIGHT.kitchen}
				bg={cold ? '#C8D8F0' : BG.kitchen}
				grade={cold ? 'saturate(0.8) hue-rotate(-8deg)' : undefined}
				far={<Ground color="#F2E8D8" lines={{every: 60, color: '#D8C8B0'}} />}
				near={
					<group>
						<Crumb3D at={[-1.6, 0, -0.5]} rot={0.3} bitten={bites} s={1.1} />
						<Hero3D position={you} turn={cold ? 0 : -1.1} face={cold ? 'scared' : bites > 0 && bites < 1 ? 'happy' : 'happy'} talk={bites > 0 && bites < 1 ? 0.5 : 0} armL={cold ? [40, 120] : [60, 110]} armR={cold ? [40, 120] : [60, 110]} reachL={cold ? 60 : 30} reachR={cold ? 60 : 30} />
						<Ant3D at={[2.8, 0, -1.6]} rot={-0.6} frame={frame} pip />
						{breaths.map((t, k) => (
							<Glow key={k} shape={{kind: 'sphere', r: 0.12 + t * 0.25, seg: 12}} color="#FFFFFF" position={[you[0] + 0.05, 1.3 + t * 0.4, you[2] + 0.4 + t * 0.6]} opacity={0.6 * (1 - t)} />
						))}
					</group>
				}
				overlay={() => (
					<>
						{cold ? <Label text="10 MINUTES LATER" x={960} y={210} frame={frame} at={later} size={46} /> : null}
						{frame > freezing ? <Big text="STARVING + FREEZING" x={960} y={880} size={84} frame={frame} at={freezing + 4} color={UI.cyan} /> : null}
					</>
				)}
			/>
			<Sound name="crunch" at={eat + 4} volume={0.35} />
			<Sound name="crunch" at={eat + 24} volume={0.3} />
			<Sound name="swish" at={later - 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- shrew

/** Heat leaving a body: warm rings expanding outwards. */
const HeatOut: React.FC<{at: V3; frame: number; strength?: number}> = ({at, frame, strength = 1}) => (
	<group position={at}>
		{[0, 1, 2, 3].map((k) => {
			const t = ((frame + k * 10) % 40) / 40;
			return <Glow key={k} shape={{kind: 'sphere', r: 0.6 + t * 1.6, seg: 24}} color="#FF8A3D" opacity={0.18 * (1 - t) * strength} />;
		})}
	</group>
);

export const Shrew: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const etruscan = cue(l0, 'The Etruscan');
	const heart = cue(l0, 'Its heart');
	const eat = cue(l0, 'and it has to eat');
	const ants = cue(l1, "Ants don't");
	const you = cue(l1, 'You do');
	const shrewSet = frame >= etruscan - 4 && frame < l1.a - 4;
	const nibble = frame > eat ? Math.abs(Math.sin(frame * 0.5)) : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, etruscan - 4, heart - 4, eat - 4, l1.a - 4, ants - 4, you - 4]}
				angles={[
					{at: [0, 1.1, 0], dist: 5, yaw: 20, pitch: 6, fov: 34},
					{at: [0, 0.6, 0], dist: 4.5, yaw: 40, pitch: 10, fov: 34},
					{at: [0, 0.6, 0], dist: 3.2, yaw: 10, pitch: 6, fov: 32},
					{at: [0.3, 0.5, 0.3], dist: 2.8, yaw: -30, pitch: 10, fov: 32},
					{at: [0, 0.8, 0], dist: 8, yaw: 0, pitch: 6, fov: 36},
					{at: [1.6, 0.6, 0], dist: 4.5, yaw: 30, pitch: 8, fov: 34},
					{at: [-1.6, 1.1, 0], dist: 3.6, yaw: -10, pitch: 4, fov: 32},
				]}
				light={shrewSet ? LIGHT.garden : frame < l1.a - 4 ? LIGHT.cold : LIGHT.studio}
				bg={shrewSet ? BG.garden : frame < l1.a - 4 ? '#C8D8F0' : BG.studio}
				far={
					shrewSet ? (
						<group>
							<Ground color="#6A4A2E" />
							{[...Array(14)].map((_, i) => (
								<T key={i} shape={{kind: 'sphere', r: 0.8, seg: 16}} color={i % 2 ? '#C9782A' : '#A8642A'} position={[-6 + (i % 7) * 2, 0.02, -3 - Math.floor(i / 7) * 2.5]} scale={[1.3, 0.08, 0.7]} rotation={[0, i, 0]} outline={0.02} />
							))}
						</group>
					) : frame < l1.a - 4 ? (
						<Ground color="#F2E8D8" />
					) : (
						<Box size={[80, 0.1, 80]} at={[0, -0.05, 0]} color="#2A2160" outline={0} />
					)
				}
				near={
					shrewSet ? (
						<group>
							<Mouse3D at={[0, 0, 0]} frame={frame} shrew rot={0.5 + Math.sin(frame * 0.07) * 0.2} s={1.0} sing={nibble * 0.6} />
							{frame > eat ? <T shape={{kind: 'sphere', r: 0.08, seg: 10}} color="#3A6A2A" position={[0.35, 0.3, 0.75]} scale={[1, 0.6, 1.6]} outline={0.01} /> : null}
						</group>
					) : frame < l1.a - 4 ? (
						<group>
							<Hero3D position={[0, 0, 0]} face="scared" armL={[40, 120]} armR={[40, 120]} reachL={60} reachR={60} />
							<HeatOut at={[0, 0.9, 0]} frame={frame} />
						</group>
					) : (
						<group>
							<Mouse3D at={[-1.6, 0, 0]} frame={frame} shrew rot={0.5} />
							<group position={[1.6, 0, 0]}>
								<Ant3D at={[0, 0, 0]} rot={-0.6} frame={frame} s={0.35} look={undefined} />
							</group>
							{frame > you - 4 ? (
								<group>
									<Hero3D position={[-1.6, 0, 0]} face="scared" armL={[40, 120]} armR={[40, 120]} reachL={60} reachR={60} />
									<HeatOut at={[-1.6, 0.9, 0]} frame={frame} strength={1.4} />
								</group>
							) : null}
						</group>
					)
				}
				overlay={() => (
					<>
						{frame < etruscan - 4 ? <Label text="SMALL BODIES LOSE HEAT FAST" x={960} y={870} frame={frame} at={10} size={48} color={UI.orange} /> : null}
						{shrewSet ? <Label text="ETRUSCAN SHREW · ABOUT 2 GRAMS" x={960} y={210} frame={frame} at={etruscan + 6} size={44} color={UI.cream} /> : null}
						{frame > heart - 4 && frame < eat - 4 ? <HeartMonitor frame={frame} at={heart} bpm={900} label="HEART" tag="UP TO 1,511 / MIN" x={960} y={820} color={UI.red} /> : null}
						{frame > eat - 4 && shrewSet ? <Label text="EATS ALMOST ALL DAY" x={960} y={870} frame={frame} at={eat + 6} size={48} color={UI.yellow} /> : null}
						{frame > l1.a - 4 && frame < you - 4 ? <Label text="NO WARM-BLOODED ANIMAL IS THIS SMALL" x={960} y={210} frame={frame} at={l1.a + 4} size={44} color={UI.cream} /> : null}
						{frame > ants - 4 && frame < you - 4 ? <Label text="ANTS: NO BODY HEAT OF THEIR OWN" x={1300} y={870} frame={frame} at={ants + 4} size={40} color={UI.cyan} /> : null}
						{frame > you - 4 ? <Big text="HEAT POURS OUT" x={960} y={880} size={88} frame={frame} at={you + 6} color={UI.orange} /> : null}
					</>
				)}
			/>
			<Sound name="heart" at={heart} volume={0.4} loop={eat - heart} />
			<Sound name="crunch" at={eat + 4} volume={0.25} />
			<Sound name="pop" at={l1.a + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- mum

const MUM_H = 110;

export const Mum: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slipper = cue(l0, 'Your mum');
	const where = cue(l0, 'Where is');
	const shout = cue(l0, 'You shout');
	const look = cue(l0, "She doesn't");
	const step = cue(l0, 'She steps');
	const k = MUM_H / 1.7;
	const land = span(frame, slipper - 2, slipper + 10);
	const stepT = span(frame, step, step + 40);
	const mumZ = lerp(-12, -12 + 40 * Math.min(1, stepT * 1.4), 1);
	const sh = shake(frame, slipper + 10, 20, 16);
	const sh2 = shake(frame, step + 30, 14, 12);
	const you: V3 = [6, 0, 6];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, slipper - 4, where - 4, shout - 4, step - 4]}
				angles={[
					{at: [6, 1.2, 6], dist: 6, yaw: 30, pitch: 6, fov: 34, dyaw: 0},
					{at: [0, 6, -6], dist: 40, yaw: 30, pitch: 6, fov: 40, dyaw: 0},
					{at: [0, 60, -12], dist: 70, yaw: 12, pitch: -32, fov: 44, dyaw: 2},
					{at: [6, 1.3, 6], dist: 3.2, yaw: 15, pitch: 10, fov: 32},
					{at: [6, 4, 6], dist: 30, yaw: 70, pitch: 4, fov: 42, dyaw: -10},
				]}
				light={LIGHT.kitchen}
				bg={BG.kitchen}
				far={<Ground color="#F2E8D8" lines={{every: 60, color: '#D8C8B0'}} />}
				near={
					<group position={[sh.x * 0.02 + sh2.x * 0.02, 0, 0]}>
						<group position={[0, lerp(30, 0, land), 0]}>
							<Hero3D who={P4.mum} position={[0, 0, mumZ]} height={MUM_H} turn={0.2} face="neutral" look={[0.4, 0.3]} talk={frame > where && frame < where + 40 ? 0.6 : 0} walk={frame > step ? stepT * 3 : undefined} />
							{[-1, 1].map((sd) => (
								<Slipper3D key={sd} at={[0.09 * k * sd + Math.sin(0.2) * 0, 0, mumZ + 0.07 * k]} rot={0.2} />
							))}
						</group>
						<Hero3D position={you} turn={-2.4} face={frame > look ? 'sad' : frame > shout ? 'shocked' : 'scared'} talk={frame > shout && frame < look ? 0.8 : 0} armL={frame > shout && frame < look ? [150, 170] : undefined} armR={frame > shout && frame < look ? [150, 170] : undefined} look={[0, 0.9]} />
					</group>
				}
				overlay={(cam) => (
					<>
						{frame > where - 2 && frame < shout ? <Says cam={cam} head={headAt([0, 0, mumZ], false, MUM_H)} text="Where is that child?!" frame={frame} at={where} size={44} /> : null}
						{frame > shout && frame < step ? <Says cam={cam} head={top(you[0], you[2])} text="mum! down here!" frame={frame} at={shout + 4} size={22} /> : null}
					</>
				)}
			/>
			<Sound name="thud" at={slipper + 8} volume={0.6} />
			<Sound name="boom" at={slipper + 8} volume={0.25} />
			<Sound name="thud" at={step + 30} volume={0.5} />
			<Sound name="squeak" at={shout + 4} volume={0.4} />
			<Sound name="squeak" at={shout + 14} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- voice

/** A pitch scale from 20 Hz to 200 kHz (log), the band humans can hear, and a marker for your voice. */
const PitchMeter: React.FC<{frame: number; at: number; hz: number; label: string; extra?: Array<[number, number, string]>}> = ({frame, at, hz, label, extra = []}) => {
	const p = span(frame, at, at + 12);
	if (p <= 0) {
		return null;
	}
	const x0 = 260;
	const w = 1400;
	const X = (f: number) => x0 + (Math.log10(f / 20) / Math.log10(200000 / 20)) * w;
	const waveF = 0.6 + Math.log10(hz / 20) * 1.2;
	const pts: string[] = [];
	for (let i = 0; i <= 200; i++) {
		pts.push(`${(i / 200) * w},${60 + Math.sin(i * 0.06 * waveF ** 1.6 - frame * 0.6) * 40}`);
	}
	return (
		<div style={{position: 'absolute', left: 0, top: 640, width: 1920, opacity: p, fontFamily: FONT, fontWeight: 700}}>
			<div style={{position: 'absolute', left: x0 - 40, top: -30, width: w + 80, height: 300, background: UI.box, border: `3px solid ${UI.edge}`, borderRadius: 30}} />
			<svg width={w} height={120} style={{position: 'absolute', left: x0, top: -10}}>
				<polyline points={pts.join(' ')} fill="none" stroke={UI.yellow} strokeWidth={5} />
			</svg>
			<div style={{position: 'absolute', left: x0, top: 140, width: w, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.12)'}} />
			<div style={{position: 'absolute', left: X(20), top: 140, width: X(20000) - X(20), height: 30, borderRadius: 15, background: 'rgba(124,242,160,0.6)'}} />
			<div style={{position: 'absolute', left: X(20), top: 185, width: X(20000) - X(20), textAlign: 'center', color: UI.green, fontSize: 30}}>HUMAN HEARING</div>
			{extra.map(([a, b, t]) => (
				<div key={t}>
					<div style={{position: 'absolute', left: X(a), top: 140, width: X(b) - X(a), height: 30, borderRadius: 15, background: 'rgba(127,224,255,0.7)'}} />
					<div style={{position: 'absolute', left: X(a), top: 185, width: X(b) - X(a), textAlign: 'center', color: UI.cyan, fontSize: 30}}>{t}</div>
				</div>
			))}
			<div style={{position: 'absolute', left: X(hz) - 4, top: 120, width: 8, height: 70, background: UI.yellow, borderRadius: 4, boxShadow: `0 0 20px ${UI.yellow}`}} />
			<div style={{position: 'absolute', left: X(hz), top: 92, transform: 'translateX(-50%)', color: UI.yellow, fontSize: 30, whiteSpace: 'nowrap'}}>{label}</div>
		</div>
	);
};

export const Voice: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const faster = cue(l0, 'Smaller things');
	const high = cue(l0, 'Probably');
	const mice = l1.a;
	const found = cue(l1, 'In two thousand');
	const mics = cue(l1, 'special');
	const up = span(frame, faster, high + 10);
	const hz = 250 * Math.pow(500, up);
	const mouseSet = frame >= mice - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, faster - 4, mice - 4, found - 4, mics - 4]}
				angles={[
					{at: [0, 1.2, 0], dist: 3.4, yaw: 20, pitch: 6, fov: 32},
					{at: [0, 1.5, 0], dist: 5, yaw: -15, pitch: 2, fov: 34, dy: 0},
					{at: [0, 0.6, 0], dist: 4, yaw: 30, pitch: 8, fov: 34},
					{at: [0, 0.7, 0], dist: 3, yaw: -20, pitch: 6, fov: 32},
					{at: [0.8, 0.8, 0], dist: 4.2, yaw: 40, pitch: 8, fov: 34},
				]}
				light={mouseSet ? LIGHT.lab ?? LIGHT.studio : LIGHT.kitchen}
				bg={mouseSet ? BG.studio : BG.kitchen}
				far={mouseSet ? <Box size={[60, 0.1, 60]} at={[0, -0.05, 0]} color="#2A2160" outline={0} /> : <Ground color="#F2E8D8" />}
				near={
					mouseSet ? (
						<group>
							<Mouse3D at={[0, 0, 0]} frame={frame} rot={0.4} sing={Math.abs(Math.sin(frame * 0.35))} s={1.2} />
							{frame > mics - 4 ? <Mic3D at={[1.3, 0, 0.6]} stand rot={[0, -0.8, 0]} /> : null}
						</group>
					) : (
						<Hero3D position={[0, 0, 0]} face="shocked" talk={0.9} armL={[150, 170]} armR={[150, 170]} look={[0, 0.8]} />
					)
				}
				overlay={() =>
					mouseSet ? (
						<>
							<PitchMeter frame={frame} at={mice + 4} hz={60000} label="MOUSE SONG" extra={[[30000, 110000, '30,000–110,000 Hz']]} />
							<Label text="WASHINGTON UNIVERSITY · 2005" x={960} y={200} frame={frame} at={found} size={42} color={UI.cyan} />
							{frame > mics ? <Label text="ONLY SPECIAL MICROPHONES HEAR IT" x={960} y={300} frame={frame} at={mics + 4} size={40} /> : null}
							{[0, 1, 2].map((k) => {
								const t = ((frame + k * 20) % 60) / 60;
								return <div key={k} style={{position: 'absolute', left: 1040 + k * 60 + t * 80, top: 420 - t * 160, fontSize: 70, color: 'transparent', WebkitTextStroke: `3px ${UI.cyan}`, opacity: 1 - t, fontFamily: FONT}}>♪</div>;
							})}
						</>
					) : (
						<PitchMeter frame={frame} at={faster - 6} hz={hz} label={up > 0.95 ? 'YOU: TOO HIGH TO HEAR' : 'YOUR VOICE'} />
					)
				}
			/>
			<Sound name="whoosh" at={faster} volume={0.3} />
			<Sound name="chime" at={mice + 6} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- cat

export const Cat: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const eyes = cue(l0, 'Two huge');
	const cat = cue(l0, 'The cat');
	const paw = cue(l0, 'A paw');
	const run = cue(l0, 'and you and Pip');
	const glow = span(frame, eyes - 6, eyes + 14);
	const swipe = span(frame, paw, paw + 14);
	const pawAt: V3 = [lerp(-10, 3.5, swipe), lerp(40, 0, swipe), lerp(-16, -3, swipe)];
	const flee = frame > run ? (frame - run) * 0.35 : 0;
	const you: V3 = [0.5 + flee * 0.15, 0, flee];
	const sh = shake(frame, paw + 14, 18, 14);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, eyes - 4, cat - 2, paw - 4, run - 2]}
				angles={[
					{at: [0.5, 1.2, 0], dist: 5, yaw: 200, pitch: 4, fov: 34},
					{at: [0, 30, -40], dist: 60, yaw: 0, pitch: -8, fov: 40},
					{at: [0, 32, -40], dist: 30, yaw: 4, pitch: -4, fov: 38, ddist: -8},
					{at: [1, 3, -1], dist: 18, yaw: 25, pitch: 10, fov: 40, dyaw: 0},
					{at: [0.5, 1, flee], dist: 6, yaw: 160, pitch: 10, fov: 36, ddist: 0},
				]}
				light={LIGHT.dark}
				bg={BG.dark}
				far={
					<group>
						<Ground color="#3A3450" lines={{every: 60, color: '#2A2440'}} />
						<FridgeUnder3D at={[0, 0, 40]} gap={7} />
					</group>
				}
				near={
					<group position={[sh.x * 0.03, sh.y * 0.03, 0]}>
						<CatHead3D at={[0, 34, -46]} frame={frame} pupil={frame > paw ? 0.95 : 0.6} glow={glow} />
						{frame > paw - 2 ? <CatPaw3D at={pawAt} rot={[0, 0.4, 0]} claws={swipe} /> : null}
						<Hero3D position={you} turn={frame > run ? 0 : Math.PI} run={frame > run} walk={frame > run ? frame / 8 : undefined} face="scared" look={[0, 0.7]} />
						<Ant3D at={[-1.2 + flee * 0.1, 0, flee + 0.3]} rot={frame > run ? 0 : Math.PI} frame={frame} pip walk={frame > run ? frame / 5 : undefined} />
					</group>
				}
			/>
			<Sound name="vanish" at={eyes} volume={0.3} />
			<Sound name="whoosh" at={paw + 2} volume={0.5} />
			<Sound name="thud" at={paw + 14} volume={0.6} />
			<Sound name="run" at={run} volume={0.4} loop={dur - run} />
		</>
	);
};

// ---------------------------------------------------------------- drop

export const DropScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const reach = cue(l0, 'so you reach');
	const sinks = cue(l0, 'Your arm sinks');
	const sticky = cue(l0, 'At your size');
	const grabs = l1.a;
	const owe = cue(l1, 'You owe');
	const pull = span(frame, grabs + 10, grabs + 36);
	const popOut = frame > grabs + 30;
	const stuck = frame > sinks - 4 && !popOut;
	const you: V3 = [lerp(-1.75, -2.6, pull), 0, 0];
	const armR: [number, number] = stuck || (frame > reach && !popOut) ? [85, 92] : [12, 6];
	const strain = stuck && frame > sticky - 10 ? Math.sin(frame * 0.6) * 4 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, reach - 4, sinks - 4, sticky - 4, grabs - 4, owe - 4]}
				angles={[
					{at: [-0.5, 1.2, 0], dist: 9, yaw: 30, pitch: 10, fov: 36},
					{at: [-1, 1.1, 0], dist: 4.5, yaw: 15, pitch: 6, fov: 32},
					{at: [-0.6, 1.1, 0], dist: 3.2, yaw: 60, pitch: 4, fov: 32},
					{at: [-0.4, 1.1, 0], dist: 5, yaw: -30, pitch: 8, fov: 34},
					{at: [-2, 1.1, 0], dist: 6, yaw: 35, pitch: 8, fov: 34},
					{at: [-2.4, 1.2, 0], dist: 4.2, yaw: 20, pitch: 6, fov: 32},
				]}
				light={LIGHT.fridge}
				bg={BG.fridge}
				far={
					<group>
						<Ground color="#4A5070" />
						<FridgeUnder3D at={[0, 0, 12]} gap={7} />
					</group>
				}
				near={
					<group>
						<Drop3D at={[0, 0, 0]} r={1.25} frame={frame} wobble={stuck ? 0.8 : 0.15} />
						<Hero3D position={you} turn={Math.PI / 2} face={popOut ? (frame > owe ? 'happy' : 'shocked') : stuck ? 'scared' : 'neutral'} armR={armR} reachR={stuck ? 0 : 0} armL={stuck ? [40 + strain, 80] : undefined} lean={stuck ? -12 : 0} />
						<Ant3D at={[lerp(-5.5, -3.6, span(frame, grabs - 6, grabs + 8)) - pull * 0.8, 0, 0]} rot={Math.PI / 2} frame={frame} pip jaws={frame > grabs + 6 ? 0.1 : 0.6} walk={frame > grabs - 8 && frame < grabs + 8 ? frame / 8 : undefined} />
					</group>
				}
				overlay={(cam) => (
					<>
						{frame > sticky - 4 && frame < grabs - 4 ? <Big text="WATER IS STICKY" x={960} y={880} size={90} frame={frame} at={sticky + 4} color={UI.cyan} /> : null}
						{frame > owe ? <Says cam={cam} head={top(you[0], you[2])} text="Thanks, Pip!" frame={frame} at={owe + 4} /> : null}
					</>
				)}
			/>
			<Sound name="bubbles" at={sinks} volume={0.35} />
			<Sound name="splash" at={grabs + 30} volume={0.35} />
			<Sound name="chime" at={owe + 4} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- strider

export const StriderScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const insects = cue(l0, 'and some insects');
	const hairs = cue(l0, "A water strider's");
	const found = cue(l0, 'In two thousand');
	const sink = cue(l0, "So it doesn't");
	const stands = cue(l0, 'It stands');
	const skate = frame > sink ? (frame - sink) * 0.12 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, insects - 4, hairs - 4, found - 4, sink - 4]}
				angles={[
					{at: [0, 0.4, 0], dist: 8, yaw: 30, pitch: 22, fov: 36},
					{at: [0, 0.6, 0], dist: 6, yaw: -20, pitch: 14, fov: 34},
					{at: [2.9, 0.3, 0.9], dist: 2.2, yaw: 40, pitch: 16, fov: 30},
					{at: [0, 0.6, 0], dist: 7, yaw: 10, pitch: 30, fov: 36},
					{at: [skate * 0.3, 0.5, skate], dist: 8, yaw: 60, pitch: 16, fov: 36, ddist: 0},
				]}
				light={LIGHT.pond}
				bg={BG.pond}
				far={
					<group>
						<Box size={[200, 0.2, 200]} at={[0, -2, 0]} color="#1E4A6A" outline={0} />
						<Grass size={120} clear={30} seed={31} tall={22} />
					</group>
				}
				near={
					<group>
						<Water3D level={0.01} frame={frame} size={[120, 120]} ripples={frame > sink ? [[skate * 0.3, skate - 2, sink]] : []} />
						<Strider3D at={[skate * 0.3, 0, skate]} rot={0.3} frame={frame} />
					</group>
				}
				overlay={() => (
					<>
						{frame < hairs - 4 ? <Big text="SURFACE TENSION" x={960} y={880} size={90} frame={frame} at={insects - 6} color={UI.cyan} /> : null}
						{frame > hairs - 4 && frame < found - 4 ? <Label text="TINY HAIRS KEEP THE WATER OUT" x={960} y={870} frame={frame} at={hairs + 10} size={48} color={UI.cream} /> : null}
						{frame > found - 4 && frame < sink - 4 ? (
							<>
								<Label text="CHINA · 2004" x={960} y={210} frame={frame} at={found} size={42} color={UI.cyan} />
								<Big text="1 LEG HOLDS ~15× ITS WEIGHT" x={960} y={880} size={78} frame={frame} at={found + 20} />
							</>
						) : null}
						{frame > stands ? <Label text="IT STANDS ON WATER" x={960} y={870} frame={frame} at={stands + 4} size={50} color={UI.green} /> : null}
					</>
				)}
			/>
			<Sound name="bubbles" at={4} volume={0.2} />
			<Sound name="pop" at={found + 20} volume={0.3} />
			<Sound name="swish" at={sink} volume={0.3} />
		</>
	);
};

void Grass;
void Thought;
