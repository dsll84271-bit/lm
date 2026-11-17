import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Board3, Desk3, ROOM3} from '../../../three/sets3d';
import {Bird3D, Bus3D, Car3D, SchoolTop3D} from '../../../three/sky3d';
import {Shot3, type Angle3} from '../../../three/shot3';
import {T} from '../../../three/toon';
import {AnkleHouse, Balance3D, Bed8, BigBen3D, Bridge3D, Eiffel3D, Elephant3D, House3D, Pants3D, Redwood3D, Ruler3D, Washing3D, Water8} from '../../../three/tall3d';
import {BG, bigLight, Giant, GIANT, HomeSet, housesIn, K, KIDS, LIGHT, lookFrom, P8, Panel, RainOver, smallLight, Vignette, YOU} from './kit';
import {handAt, headAt, type V3} from './util';

// Part A: you wake up a hundred metres tall, Mum's toast, how tall that is,
// the first step, how heavy you are, Haldane's giants, the sneeze, the walk
// to school and your new voice.


const withShake = (a: Angle3, frame: number, at: number, k = 1, amount = 1, len = 14): Angle3 => {
	const s = shake(frame, at, amount, len);
	return {...a, at: [a.at[0] + s.x * k, a.at[1] + s.y * k, a.at[2]]};
};
const BIGCAM = {near: 0.5, far: 5000};

/** The studio floor: a big purple plane with lines. */
const Studio: React.FC<{size?: number; every?: number}> = ({size = 3000, every = 20}) => <Ground color="#3A2E80" size={size} lines={{every, color: '#4A3E98', along: 'z'}} />;

// ---------------------------------------------------------------- cold

const SIT: V3 = [0, 0, 0];
const SIT_HEAD = headAt(SIT, true, GIANT);
const ANKLE: V3 = [0.14 * K, 0, 0.5 * K];
const BEDAT: V3 = [0, 0.56 * K, -0.23 * K];
const NOSE: V3 = [SIT_HEAD[0] + 0.02 * K, SIT_HEAD[1] - 0.02 * K, SIT_HEAD[2] + 0.31 * K];

/** The night-time bridge, for the flash-forward. */
const Teaser: React.FC<{frame: number}> = ({frame}) => (
	<group>
		<Water8 at={[0, -1, 0]} frame={frame} w={70} d={800} color="#4A4A3A" caps="#8A8A7A" flow={0.3} />
		{[-1, 1].map((x) => (
			<mesh key={x} position={[x * 335, -0.5, 0]}>
				<boxGeometry args={[600, 1, 800]} />
				<meshToonMaterial color="#2A4A3A" />
			</mesh>
		))}
		<Bridge3D at={[0, 0, 0]} crack={0.7} drop={0.2} />
		<Bus3D at={[0, 9.1, 0]} yaw={Math.PI / 2} />
	</group>
);

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const bed = cue(l0, 'Your bed');
	const house = cue(l0, "What's left");
	const pigeon = cue(l0, 'And a pigeon');
	const tonight = l1.a;
	const first = cue(l1, 'But first');
	const cuts = [0, bed - 4, house - 4, pigeon - 4, tonight - 2, first - 2];
	const teaser = frame >= tonight - 2 && frame < first - 2;
	const land = span(frame, pigeon, pigeon + 24);
	const pg: V3 = [NOSE[0] + (1 - land) * 30, NOSE[1] + 1 + (1 - land) * 18, NOSE[2] + 1.5 + (1 - land) * 12];
	const near = teaser ? null : (
		<group>
			<Giant at={SIT} sit face={frame > first ? 'happy' : frame > pigeon + 20 ? 'shocked' : 'neutral'} look={frame > pigeon + 10 && frame < first ? [0, -0.6] : [0, 0]} armL={[24, 30]} armR={[24, 30]} blink={frame < 30 ? 0.8 : 0} />
			<Bed8 at={BEDAT} rot={[-1.25, 0, 0.15]} />
			<AnkleHouse at={ANKLE} r={0.075 * K} />
			<Bird3D kind="pigeon" at={pg} frame={frame} s={10} wing={land < 1 ? 'flap' : 'fold'} perch={land >= 1} yaw={Math.PI} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 0.45 * K, 0.1 * K], dist: 300, yaw: 28, pitch: 14, fov: 36, dyaw: 6, ddist: -40, ...BIGCAM},
		{at: [BEDAT[0], BEDAT[1] + 4, BEDAT[2]], dist: 70, yaw: 200, pitch: 12, fov: 38, dyaw: 8, ...BIGCAM},
		{at: [ANKLE[0], 6, ANKLE[2]], dist: 52, yaw: 40, pitch: 10, fov: 40, dyaw: 8, ...BIGCAM},
		{at: [NOSE[0], NOSE[1] + 1, NOSE[2]], dist: 34, yaw: 30, pitch: 6, fov: 38, ddist: -8, dyaw: -6, ...BIGCAM},
		{at: [0, 6, 0], dist: 70, yaw: 35, pitch: 10, fov: 40, dyaw: 8, near: 0.5, far: 3000},
		{at: [SIT_HEAD[0], SIT_HEAD[1], SIT_HEAD[2]], dist: 110, yaw: 15, pitch: 4, fov: 36, ddist: -10, ...BIGCAM},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={teaser ? smallLight([0, 0, 0], 'storm', 40) : bigLight([0, 0, 20], 'day', 140)}
				bg={teaser ? BG.storm : BG.day}
				far={teaser ? <Teaser frame={frame} /> : <HomeSet skip={housesIn(-55, 55)} />}
				near={near}
				blur={0}
				grade={teaser ? 'saturate(0.7) brightness(0.8)' : undefined}
				overlay={() => (
					<AbsoluteFill>
						{frame < 26 ? <AbsoluteFill style={{background: '#000', opacity: 1 - span(frame, 4, 26)}} /> : null}
						<Big text="100 METRES TALL" x={960} y={250} size={110} frame={frame} at={14} until={bed - 8} color={UI.yellow} />
						{teaser ? <RainOver frame={frame} /> : null}
						{teaser ? <Vignette amount={0.5} /> : null}
						<Label text="TONIGHT…" x={960} y={220} size={64} frame={frame} at={tonight + 6} until={first - 6} color={UI.cream} />
						<Big text="BUT FIRST: BREAKFAST" x={960} y={860} size={84} frame={frame} at={first + 16} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="crunch" at={8} volume={0.35} />
			<Sound name="squeak" at={pigeon + 10} volume={0.25} />
			<Sound name="rain" at={tonight} volume={0.3} />
			<Sound name="pop" at={first + 16} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- mum

const CROUCH: V3 = [0, 0, -30];
const LOW_HAND = handAt(CROUCH, 0, [2, 2], 0, 1, true, GIANT);
const MUM: V3 = [LOW_HAND[0] + 1.6, 0, LOW_HAND[2] + 1.4];
const MUM_TURN = Math.atan2(LOW_HAND[0] - MUM[0], LOW_HAND[2] - MUM[2]);

export const Mum: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const holds = cue(l0, 'She holds');
	const pinch = cue(l0, 'You pinch');
	const crumb = cue(l0, "It's the size");
	const word = cue(l0, "She doesn't");
	const inside = cue(l0, 'She just goes');
	const cuts = [0, holds - 4, pinch - 4, crumb - 4, word - 4, inside - 4];
	const up = span(frame, holds, holds + 18) * (1 - span(frame, word + 10, word + 30));
	const raise = span(frame, crumb - 30, crumb + 6);
	const armR: [number, number] = [lerp(2, 70, raise), lerp(2, 140, raise)];
	const hand = handAt(CROUCH, 0, armR, 60 * raise, 1, true, GIANT);
	const taken = frame > pinch + 14;
	const mumArm: [number, number] = [lerp(30, 168, up), lerp(70, 10, up)];
	const walk = span(frame, inside + 6, inside + 80, (v) => v);
	const mumNow: V3 = [MUM[0] + walk * 2, 0, MUM[2] + walk * 10];
	const mh = handAt(MUM, MUM_TURN, mumArm, 60, 1);
	const mh2 = handAt(MUM, MUM_TURN, mumArm, 60, -1);
	const plateAt: V3 = [(mh[0] + mh2[0]) / 2, (mh[1] + mh2[1]) / 2 + 0.05, (mh[2] + mh2[2]) / 2];
	const toast: V3 = taken ? [hand[0] - 0.05 * K * 0.12, hand[1] - 0.6, hand[2] + 0.4] : [plateAt[0], plateAt[1] + 0.04, plateAt[2]];
	const near = (
		<group>
			<Giant at={CROUCH} sit face={frame > crumb ? 'smug' : 'happy'} armR={armR} reachR={60 * raise} armL={[14, 20]} look={frame > crumb ? [0.3, 0.2] : [0.5, -0.8]} />
			<Hero3D who={P8.mum} position={mumNow} turn={frame > inside + 4 ? 0.2 : MUM_TURN} armR={frame > inside ? [12, 10] : mumArm} reachR={60} armL={frame > inside ? [12, 10] : mumArm} reachL={60} face={frame > word ? 'neutral' : 'shocked'} look={[0, 0.8]} walk={frame > inside + 4 ? frame / 6 : undefined} />
			{frame < inside ? <T shape={{kind: 'cyl', r: 0.17, h: 0.03}} color="#FFFFFF" position={plateAt} outline={0.01} /> : null}
			{frame < crumb + 40 ? <T shape={{kind: 'box', w: 0.14, h: 0.025, d: 0.14}} color="#E8A85A" position={toast} outline={0.008} /> : null}
			<House3D at={[MUM[0] + 3, 0, MUM[2] + 15]} yaw={Math.PI} seed={4} />
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([MUM[0] + 3, 1.6, MUM[2] + 7], [CROUCH[0] + 4, 46, CROUCH[2] + 6], 60, {dyaw: 3}),
		lookFrom([MUM[0] - 1.6, 1.1, MUM[2] - 2.6], [MUM[0], 1.9, MUM[2]], 44, {dyaw: 4}),
		lookFrom([MUM[0] + 5, 2.2, MUM[2] + 5], [LOW_HAND[0], 2.6, LOW_HAND[2]], 46, {dyaw: -4}),
		lookFrom([hand[0] + 6, hand[1] - 1, hand[2] + 14], [hand[0], hand[1] - 0.4, hand[2]], 30),
		lookFrom([MUM[0] - 1.2, 1.4, MUM[2] - 2.2], [MUM[0], 1.45, MUM[2]], 36),
		lookFrom([MUM[0] + 14, 4, MUM[2] + 6], [MUM[0] + 2, 1.2, MUM[2] + 8], 46, {dyaw: 4}),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={smallLight([MUM[0], 0, MUM[2]], 'day', 40)}
				bg={BG.day}
				far={<HomeSet skip={housesIn(-40, 40)} />}
				near={near}
				blur={0}
				overlay={() => <Label text="ONE SLICE OF TOAST" x={960} y={860} size={56} frame={frame} at={crumb + 6} until={word} color={UI.yellow} />}
			/>
			<Sound name="squeak" at={pinch + 8} volume={0.25} />
			<Sound name="steps" at={inside + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- tall

export const Tall: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const ben = cue(l0, 'Taller than');
	const sixty = cue(l0, 'About sixty');
	const tree = cue(l0, 'The tallest tree');
	const still = cue(l0, 'So at least');
	const cuts = [0, ben - 4, sixty - 4, tree - 4, still - 4];
	const grow = span(frame, 6, 50);
	const near = (
		<group>
			<Ruler3D at={[-110, 0, 0]} h={120} every={10} w={4} />
			{frame > ben - 6 ? <BigBen3D at={[-55, 0, 0]} yaw={0.3} /> : null}
			<Giant at={[0, 0, 0]} face="happy" armL={[10, 10]} armR={[10, 10]} />
			<Hero3D position={[16, 0, 22]} face="happy" armR={[160, 20]} />
			{frame > tree - 6 ? <Redwood3D at={[60, 0, -5]} h={116} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [-30, 50, 0], dist: 260, yaw: 0, pitch: 4, fov: 36, ddist: -20, ...BIGCAM},
		{at: [-30, 50, 0], dist: 240, yaw: 8, pitch: 4, fov: 36, dyaw: 4, ...BIGCAM},
		{at: [16, 1.0, 22], dist: 6, yaw: 20, pitch: 6, fov: 40, ddist: 230, dy: 50, dyaw: -20, ...BIGCAM},
		{at: [20, 60, 0], dist: 270, yaw: -8, pitch: 4, fov: 38, dyaw: -4, ...BIGCAM},
		{at: [35, 95, 0], dist: 120, yaw: -15, pitch: 2, fov: 38, ...BIGCAM},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.studioBig}
				bg={BG.studio}
				far={<Studio />}
				near={<group scale={[1, 0.15 + 0.85 * grow, 1]}>{near}</group>}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="100 M" x={300} y={220} size={60} frame={frame} at={10} until={ben} color={UI.yellow} />
						<Label text="ELIZABETH TOWER (BIG BEN) · 96 M" x={620} y={220} size={50} frame={frame} at={ben + 8} until={sixty - 4} color={UI.cream} />
						<Label text="YOU, YESTERDAY" x={1180} y={720} size={52} frame={frame} at={sixty + 10} until={tree - 4} color={UI.cream} />
						<Big text="60× TALLER" x={960} y={300} size={110} frame={frame} at={sixty + 24} until={tree - 4} color={UI.yellow} />
						<Label text="HYPERION · A REDWOOD · ABOUT 116 M" x={1240} y={220} size={50} frame={frame} at={tree + 26} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={6} volume={0.3} />
			<Sound name="pop" at={ben + 6} volume={0.3} />
			<Sound name="pop" at={tree + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- step

export const Step: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const sorry = cue(l0, 'Sorry, Mum');
	const over = cue(l0, 'You step over');
	const down = cue(l0, 'Your trainer');
	const cracks = cue(l0, 'and the tarmac');
	const cuts = [0, sorry - 2, over - 4, down - 4, cracks - 4];
	const shakeOff = span(frame, 10, 50);
	const lift = span(frame, over, down + 6) * (1 - span(frame, down + 6, cracks + 4));
	// Standing on the left of the street, stepping your right foot across it.
	const at: V3 = [0, 0, -40];
	const footX = lerp(0.15 * K, 0.15 * K, lift);
	const footZ = lerp(-40, 18, span(frame, over, cracks + 4));
	const landed = frame > cracks + 4;
	const near = (
		<group>
			<Giant at={at} face={frame > down ? 'scared' : 'neutral'} look={[0, -0.8]} armL={[40, 20]} armR={[40, 20]} walk={lift > 0 && !landed ? lift * 0.25 : undefined} />
			<AnkleHouse at={[0.14 * K, 0, -40 + 0.04 * K]} r={0.075 * K} off={shakeOff} />
			{landed
				? [0, 1, 2, 3, 4, 5].map((i) => <T key={i} shape={{kind: 'box', w: 9 + i * 1.5, h: 0.12, d: 0.4}} color="#2A2236" position={[footX + Math.cos(i * 1.05) * 6, 0.1, footZ + Math.sin(i * 1.05) * 6]} rotation={[0, i * 1.05 + 0.3, 0]} outline={0} />)
				: null}
			<Car3D at={[30, 0, 3.1]} yaw={Math.PI / 2} color="#2E8AE8" />
			<Car3D at={[-20, 0, -3.1]} yaw={-Math.PI / 2} color="#F2C24A" />
		</group>
	);
	const angles: Angle3[] = [
		{at: [10, 15, -30], dist: 120, yaw: 50, pitch: 12, fov: 40, dyaw: 6, ...BIGCAM},
		{at: [0, 30, -30], dist: 200, yaw: 20, pitch: 10, fov: 38, ...BIGCAM},
		{at: [0, 50, -20], dist: 240, yaw: 90, pitch: 6, fov: 38, dyaw: 6, ...BIGCAM},
		{at: [0.15 * K, 8, 4], dist: 40, yaw: 100, pitch: 4, fov: 50, ...BIGCAM},
		withShake({at: [0.15 * K, 3, 16], dist: 26, yaw: 100, pitch: 8, fov: 50, ...BIGCAM}, frame, cracks + 4, 0.6, 1, 16),
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={bigLight([0, 0, -10], 'day', 120)} bg={BG.day} far={<HomeSet skip={housesIn(-30, 30, [-1])} />} near={near} blur={0} />
			<Sound name="crunch" at={20} volume={0.35} />
			<Sound name="boom" at={cracks + 4} volume={0.45} />
			<Sound name="crunch" at={cracks + 6} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- weight

export const Weight: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const heavy = cue(l0, 'Very heavy');
	const grows = cue(l0, 'When something');
	const wider = cue(l0, 'sixty times wider');
	const thicker = cue(l0, 'and sixty times thicker');
	const eiffel = cue(l0, 'So now');
	const cuts = [0, grows - 4, eiffel - 4];
	const tilt = frame < eiffel ? 0.35 : lerp(0.35, 0, span(frame, eiffel + 20, eiffel + 50));
	const sx = 1 + span(frame, wider, wider + 14) * 0.6;
	const sz = 1 + span(frame, thicker, thicker + 14) * 0.6;
	const showE = frame > eiffel + 4;
	const angles: Angle3[] = [
		{at: [0, 5, 0], dist: 24, yaw: 0, pitch: 6, fov: 38, ddist: -2},
		{at: [-6, 3.6, 0], dist: 10, yaw: 6, pitch: 6, fov: 38, dyaw: -6},
		{at: [0, 5, 0], dist: 25, yaw: -6, pitch: 6, fov: 38, ddist: -2},
	];
	const left = <group scale={frame < eiffel ? [sx, 1, sz] : [1, 1, 1]}><Hero3D height={2.4} face={frame > heavy ? 'smug' : 'happy'} /></group>;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.studio}
				bg={BG.studio}
				far={<Ground color="#3A2E80" size={200} lines={{every: 2, color: '#4A3E98', along: 'z'}} />}
				near={<Balance3D at={[0, 0, 0]} arm={6} h={8} tilt={tilt}>{[left, showE ? <Eiffel3D key="e" at={[0, 0, 0]} h={6} /> : null]}</Balance3D>}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="60× TALLER" x={960} y={210} size={72} frame={frame} at={grows + 10} until={eiffel - 4} color={UI.cream} />
						<Big text="× 60× WIDER" x={960} y={300} size={72} frame={frame} at={wider + 4} until={eiffel - 4} color={UI.cream} />
						<Big text="× 60× THICKER" x={960} y={390} size={72} frame={frame} at={thicker + 4} until={eiffel - 4} color={UI.cream} />
						<Big text="≈ 216,000× HEAVIER" x={960} y={860} size={80} frame={frame} at={thicker + 24} until={eiffel - 4} color={UI.yellow} />
						<Label text="YOU ≈ THE EIFFEL TOWER · ABOUT 10,000 TONNES" x={960} y={870} size={54} frame={frame} at={eiffel + 50} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="thud" at={8} volume={0.35} />
			<Sound name="pop" at={grows + 10} volume={0.25} />
			<Sound name="pop" at={wider + 4} volume={0.25} />
			<Sound name="pop" at={thicker + 4} volume={0.25} />
			<Sound name="thud" at={eiffel + 8} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- bones

export const Bones: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const giant = cue(l0, 'a real giant');
	const snap = cue(l0, 'would snap');
	const you = cue(l0, "You're sixty");
	const story = cue(l0, 'So in our story');
	const lucky = cue(l0, 'Lucky');
	const cuts = [0, giant - 4, snap - 2, you - 4, story - 4];
	const stepT = span(frame, snap, snap + 20);
	const cracked = frame > snap + 18;
	const glow = span(frame, story + 10, story + 30);
	const angles: Angle3[] = [
		{at: [0, 1.4, 0], dist: 6, yaw: 0, pitch: 4, fov: 36},
		{at: [-1, 9, 0], dist: 46, yaw: 10, pitch: 4, fov: 38, ddist: -4},
		withShake({at: [-4, 6, 0], dist: 26, yaw: 30, pitch: 4, fov: 40}, frame, snap + 18, 0.3, 1, 14),
		{at: [0, 50, 0], dist: 230, yaw: 0, pitch: 4, fov: 38, ...BIGCAM},
		{at: [0, 55, 0], dist: 200, yaw: 10, pitch: 4, fov: 38, dyaw: -6, ...BIGCAM},
	];
	const studioBig = frame > you - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={studioBig ? LIGHT.studioBig : LIGHT.studio}
				bg={BG.studio}
				far={<Studio />}
				near={
					studioBig ? (
						<Giant at={[0, 0, 0]} face={frame > lucky ? 'smug' : 'determined'} armL={[90, 150]} armR={[90, 150]} fists aura={glow > 0 ? '#FFD84A' : undefined} />
					) : (
						<group>
							<Hero3D who={P8.wadlow} position={[3, 0, 2]} face="neutral" />
							{frame > giant - 4 ? <Hero3D who={P8.jones} position={[-4, 0, 0]} height={17} face={cracked ? 'scared' : 'neutral'} walk={stepT * 0.25} still={frame < snap} /> : null}
							{cracked ? <T shape={{kind: 'capsule', r: 0.55, len: 3.4}} color="#FF3A4A" position={[-3.2, 5.2, 1.2]} rotation={[0.2, 0, 0.1]} outline={0.05} /> : null}
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Panel frame={frame} at={6} until={giant - 6} x={960} y={540} w={900} h={460} dark={false}>
							<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, fontFamily: FONT}}>
								<div style={{fontSize: 30, letterSpacing: 4, color: '#8A6A3A'}}>AN ESSAY · 1926</div>
								<div style={{fontSize: 70, fontWeight: 700, fontStyle: 'italic', color: '#2A1E14'}}>On Being the Right Size</div>
								<div style={{fontSize: 42, color: '#5A4A3A'}}>J. B. S. Haldane</div>
							</div>
						</Panel>
						<Label text="10× TALLER THAN A PERSON" x={960} y={220} size={56} frame={frame} at={giant + 10} until={snap - 2} color={UI.cream} />
						<Big text="CRACK!" x={760} y={420} size={130} frame={frame} at={snap + 18} until={you - 6} color="#FF5A5A" rotate={-8} />
						<Label text="THIGH BONE · SNAPS EVERY STEP" x={960} y={860} size={52} frame={frame} at={snap + 26} until={you - 6} color="#FF8A8A" />
						<Big text="60× TALLER" x={960} y={240} size={96} frame={frame} at={you + 6} until={story} color={UI.yellow} />
						<Label text="STORY BONES: SUPER STRONG" x={960} y={860} size={56} frame={frame} at={story + 24} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="steps" at={snap} volume={0.3} />
			<Sound name="crunch" at={snap + 18} volume={0.5} />
			<Sound name="appear" at={story + 10} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- sneeze

const STAND: V3 = [0, 0, -40];
const STAND_HEAD = headAt(STAND, false, GIANT);

export const Sneeze: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const breath = cue(l0, 'You take');
	const ah = cue(l0, 'Ah.');
	const choo = cue(l0, 'Choo');
	const empties = cue(l0, 'Every washing');
	const pants = cue(l0, 'and twenty pairs');
	const jones = cue(l0, 'Mr Jones');
	const cuts = [0, breath - 4, ah - 4, choo - 2, pants - 4, jones - 4];
	const inhale = span(frame, breath, breath + 40) * (1 - span(frame, choo, choo + 6));
	const jerk = span(frame, choo, choo + 6) * (1 - span(frame, choo + 10, choo + 30));
	const blown = span(frame, choo + 8, jones + 20, (v) => v);
	const jonesAt: V3 = [30, 0, 9];
	const catchT = span(frame, jones + 6, jones + 30);
	const near = (
		<group>
			<Giant at={STAND} face={frame > choo + 20 ? 'smug' : frame > ah ? 'scared' : 'neutral'} tilt={-inhale * 8 + jerk * 18} lean={jerk * 14} armL={[20, 20]} armR={[20, 20]} />
			<Hero3D who={P8.jones} position={jonesAt} turn={-0.6} armL={[lerp(20, 165, catchT), 10]} armR={[lerp(20, 165, catchT), 10]} face={catchT > 0.5 ? 'happy' : 'shocked'} look={[0, 0.8]} />
			{frame > jones ? <Pants3D at={[jonesAt[0] + lerp(-6, 0, catchT), lerp(9, 2.15, catchT), jonesAt[2]]} color="#FF7AA8" rot={[0, 0, (1 - catchT) * 3]} s={1.3} /> : null}
		</group>
	);
	const washing = (
		<group>
			{[-60, -30, 0, 30, 60].map((x, i) => (
				<group key={i}>
					<Washing3D at={[x, 0, 24]} blown={blown} seed={i} ps={2.4} len={12} />
					<Washing3D at={[x + 10, 0, -24]} blown={blown * 0.9} seed={i + 3} ps={2.4} len={12} />
				</group>
			))}
		</group>
	);
	const angles: Angle3[] = [
		{at: [STAND_HEAD[0], STAND_HEAD[1] - 10, STAND_HEAD[2]], dist: 130, yaw: 20, pitch: 6, fov: 38, ...BIGCAM},
		{at: [STAND_HEAD[0], STAND_HEAD[1] - 4, STAND_HEAD[2]], dist: 80, yaw: 30, pitch: 4, fov: 38, ddist: -10, ...BIGCAM},
		{at: [STAND_HEAD[0], STAND_HEAD[1], STAND_HEAD[2]], dist: 70, yaw: 5, pitch: 2, fov: 36, ddist: -14, ...BIGCAM},
		withShake({at: [0, 30, 0], dist: 260, yaw: 70, pitch: 10, fov: 40, ...BIGCAM}, frame, choo, 3, 1, 16),
		lookFrom([10, 2, 70], [30, 22, 24], 52, {dyaw: 6}),
		{at: [jonesAt[0], 1.6, jonesAt[2]], dist: 7, yaw: -40, pitch: -6, fov: 44, ...BIGCAM},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={bigLight([0, 0, 0], 'day', 120)}
				bg={BG.day}
				far={<group><HomeSet skip={housesIn(-30, 30, [-1])} />{washing}</group>}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Panel frame={frame} at={breath + 10} until={ah} x={1440} y={420} w={640} h={380} title="EACH BREATH">
							<svg viewBox="0 0 640 316" width={640} height={316}>
								<g transform="translate(150 170)">
									<path d="M-80 -90 Q-110 -40 -100 40 Q-90 100 -30 90 Q-10 60 -10 -60 Z" fill="#FF8AA8" stroke="#140A28" strokeWidth={6} />
									<path d="M80 -90 Q110 -40 100 40 Q90 100 30 90 Q10 60 10 -60 Z" fill="#FF8AA8" stroke="#140A28" strokeWidth={6} />
									<rect x={-8} y={-130} width={16} height={60} fill="#F2B8C8" stroke="#140A28" strokeWidth={5} />
								</g>
								<text x={300} y={180} fontFamily={FONT} fontSize={80} fontWeight={700} fill="#FFD84A">≈</text>
								<g transform="translate(470 180)">
									<rect x={-80} y={-50} width={160} height={110} fill="#FFE8C8" stroke="#140A28" strokeWidth={6} />
									<path d="M-100 -50 L0 -130 L100 -50 Z" fill="#D8583A" stroke="#140A28" strokeWidth={6} strokeLinejoin="round" />
									<rect x={-20} y={10} width={40} height={50} fill="#7A4A3A" stroke="#140A28" strokeWidth={5} />
								</g>
								<text x={320} y={300} fontFamily={FONT} fontSize={34} fontWeight={700} fill="#F2EEFF" textAnchor="middle">YOUR LUNGS ≈ A HOUSE OF AIR</text>
							</svg>
						</Panel>
						<Big text="AAAH…" x={960} y={250} size={110} frame={frame} at={ah + 2} until={choo - 2} color={UI.cream} />
						<Big text="CHOO!" x={960} y={300} size={170} frame={frame} at={choo} until={choo + 40} color={UI.yellow} rotate={-6} />
						<Label text="NUMBER 12" x={960} y={860} size={48} frame={frame} at={jones + 8} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={breath + 4} volume={0.3} />
			<Sound name="boom" at={choo} volume={0.5} />
			<Sound name="whoosh" at={choo + 2} volume={0.5} />
			<Sound name="pop" at={jones + 28} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- school

const SCHOOL: V3 = [180, 0, -60];

/** The classroom from inside, with your eye in the window. */
const WIN = {x: 0, y: 1.9, w: 3.4, h: 2.0, z: -4.5};
const EYE_DX = 0.12 * K;
const EYE_DY = 0.03 * K;
const Classroom: React.FC<{frame: number; mug: number; stare: number}> = ({frame, mug, stare}) => {
	const look = ROOM3.classroom;
	const W = 12;
	const H = 4;
	const wl = (W - WIN.w) / 2;
	const R = 0.32 * K;
	const headZ = WIN.z - Math.sqrt(Math.max(1, R * R - EYE_DX * EYE_DX - EYE_DY * EYE_DY)) - 0.6;
	return (
		<group>
			<T shape={{kind: 'box', w: W, h: 0.1, d: 10}} color={look.floor} position={[0, -0.05, 0]} outline={0} />
			<T shape={{kind: 'box', w: W, h: 0.1, d: 10}} color="#FFF3D6" position={[0, H, 0]} outline={0} />
			{[-1, 1].map((sx) => <T key={sx} shape={{kind: 'box', w: 0.2, h: H, d: 10}} color={look.wall} position={[sx * W / 2, H / 2, 0]} outline={0} />)}
			{/* back wall with a hole for the window */}
			{[-1, 1].map((sx) => <T key={sx} shape={{kind: 'box', w: wl, h: H, d: 0.2}} color={look.wall} position={[sx * (WIN.w / 2 + wl / 2), H / 2, WIN.z]} outline={0} />)}
			<T shape={{kind: 'box', w: WIN.w, h: WIN.y - WIN.h / 2, d: 0.2}} color={look.wall} position={[0, (WIN.y - WIN.h / 2) / 2, WIN.z]} outline={0} />
			<T shape={{kind: 'box', w: WIN.w, h: H - WIN.y - WIN.h / 2, d: 0.2}} color={look.wall} position={[0, (H + WIN.y + WIN.h / 2) / 2, WIN.z]} outline={0} />
			{[-1, 0, 1].map((i) => <T key={i} shape={{kind: 'box', w: 0.08, h: WIN.h, d: 0.12}} color={look.trim} position={[i * WIN.w / 2, WIN.y, WIN.z + 0.05]} outline={0.01} />)}
			{[-1, 1].map((i) => <T key={i} shape={{kind: 'box', w: WIN.w + 0.1, h: 0.08, d: 0.12}} color={look.trim} position={[0, WIN.y + i * WIN.h / 2, WIN.z + 0.05]} outline={0.01} />)}
			<Board3 at={[-3.8, 2, WIN.z + 0.14]} w={2.6} />
			{[-1, 1].flatMap((side) => [0, 1, 2].map((r) => <Desk3 key={`${side}${r}`} at={[side * 2.4, 0, -1.2 + r * 1.6]} />))}
			{[-1, 1].flatMap((side) =>
				[0, 1, 2].map((r) => (
					<Hero3D key={`${side}${r}`} who={KIDS[(r * 2 + (side > 0 ? 1 : 0)) % KIDS.length]} position={[side * 2.4 + (r % 2 ? 0.3 : -0.3), 0, -1.2 + r * 1.6 + 0.6]} turn={Math.PI + (side > 0 ? 0.25 : -0.25) * stare} sit face={stare > 0.5 ? 'shocked' : 'neutral'} look={[0, 0.2]} lite height={1.4} />
				)),
			)}
			<Hero3D who={P8.teacher} position={[3.8, 0, -3.0]} turn={-0.9 + stare * -0.6} armR={[30 + mug * 10, 60 - mug * 50]} reachR={50} face={stare > 0.5 ? 'shocked' : 'neutral'} />
			<T shape={{kind: 'cyl', r: 0.05, h: 0.1}} color="#E8453C" position={mug < 1 ? [4.05, 1.0 - mug * 0.95, -2.65] : [4.05, 0.05, -2.6]} rotation={mug < 1 ? [mug * 2, 0, 0] : [Math.PI / 2, 0.4, 0]} outline={0.008} />
			{/* your face outside: one eye right behind the window */}
			<Hero3D who={YOU} position={[WIN.x - EYE_DX, WIN.y - EYE_DY - 1.36 * K, headZ]} height={GIANT} face="happy" blink={Math.sin(frame * 0.05) > 0.97 ? 1 : 0} />
			<pointLight position={[0, 3.5, 0]} intensity={2} distance={14} color="#FFF3C4" />
		</group>
	);
};

export const School: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const legs = cue(l0, 'Long legs');
	const step40 = cue(l0, 'but each');
	const car = cue(l0, 'So you stroll');
	const crouch = l1.a;
	const eye = cue(l1, 'Your whole eye');
	const stare = cue(l1, 'Thirty kids');
	const mug = cue(l1, 'Your teacher');
	const cuts = [0, legs - 4, step40 - 4, car - 4, crouch - 4, eye - 4, stare - 4, mug - 4];
	const walkT = span(frame, 0, crouch, (v) => v);
	const x = lerp(-60, SCHOOL[0] - 40, walkT);
	const inside = frame >= eye - 4;
	const sit = frame > crouch + 10;
	const pos: V3 = [sit ? SCHOOL[0] - 40 : x, 0, SCHOOL[2] + 40];
	const angles: Angle3[] = [
		{at: [x, 50, pos[2]], dist: 320, yaw: 160, pitch: 10, fov: 40, ...BIGCAM},
		{at: [x, 20, pos[2]], dist: 110, yaw: 120, pitch: 6, fov: 40, ...BIGCAM},
		{at: [x, 10, pos[2]], dist: 170, yaw: 180, pitch: 8, fov: 40, ...BIGCAM},
		{at: [x + 6, 8, pos[2] + 20], dist: 46, yaw: 75, pitch: 4, fov: 46, ...BIGCAM},
		{at: [SCHOOL[0] - 20, 30, SCHOOL[2] + 20], dist: 200, yaw: 140, pitch: 12, fov: 40, ...BIGCAM},
		{at: [0, 1.9, -1], dist: 6.5, yaw: 0, pitch: 4, fov: 50},
		{at: [0, 1.0, 1.5], dist: 5, yaw: 180, pitch: 6, fov: 50, dyaw: 6},
		{at: [3.4, 1.2, -2.4], dist: 3, yaw: 230, pitch: 4, fov: 44},
	];
	const carAt: V3 = [x + 14, 0, pos[2] + 34];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={inside ? smallLight([0, 0, 0], 'room', 10) : bigLight([SCHOOL[0] - 60, 0, SCHOOL[2] + 30], 'day', 160)}
				bg={inside ? BG.room : BG.day}
				far={
					inside ? null : (
						<group>
							<HomeSet skip={housesIn(-100, 100, [1])} />
							<SchoolTop3D at={[SCHOOL[0], SCHOOL[2]]} block={60} />
							<T shape={{kind: 'box', w: 400, h: 0.08, d: 9}} color="#55597A" position={[60, 0.02, pos[2] + 34]} outline={0} />
						</group>
					)
				}
				near={
					inside ? (
						<Classroom frame={frame} mug={span(frame, mug + 6, mug + 22, (v) => v * v)} stare={span(frame, stare, stare + 12)} />
					) : (
						<group>
							<Giant at={pos} turn={sit ? Math.PI * 0.8 : Math.PI / 2} sit={sit} lean={sit ? 30 : 0} walk={sit ? undefined : frame * 0.045} face="happy" armL={[20, 20]} armR={[20, 20]} />
							<Car3D at={carAt} yaw={Math.PI / 2} color="#E8453C" />
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="EACH STEP ≈ 40 M" x={960} y={860} size={56} frame={frame} at={step40 + 6} until={car - 4} color={UI.yellow} />
						<Label text="≈ 40 KM/H · AS FAST AS A CAR IN TOWN" x={960} y={860} size={52} frame={frame} at={car + 10} until={crouch - 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="thud" at={10} volume={0.3} />
			<Sound name="thud" at={legs + 10} volume={0.3} />
			<Sound name="thud" at={car} volume={0.3} />
			<Sound name="crunch" at={mug + 22} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- voice

export const Voice: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const rattle = cue(l0, 'and every window');
	const nobody = cue(l0, 'But nobody');
	const deep = cue(l0, 'Your voice');
	const ele = cue(l0, 'Elephants do this');
	const carry = cue(l0, 'and that can carry');
	const cuts = [0, rattle - 4, nobody - 4, deep - 4, ele - 4, carry - 4];
	const studio = frame >= ele - 4;
	const shakeK = frame > 6 && frame < deep ? Math.sin(frame * 2.1) * 0.02 : 0;
	const rings = (base: V3, scale: number) =>
		[0, 1, 2, 3].map((i) => {
			const t = ((frame * 0.012 + i * 0.25) % 1);
			return (
				<mesh key={i} position={base} rotation={[-Math.PI / 2, 0, 0]}>
					<ringGeometry args={[t * scale, t * scale + scale * 0.015, 64]} />
					<meshBasicMaterial color="#FFD84A" transparent opacity={0.8 * (1 - t)} />
				</mesh>
			);
		});
	const angles: Angle3[] = [
		{at: [0, 1.6, 0], dist: 5.5, yaw: 0, pitch: 2, fov: 50, roll: shakeK * 40},
		{at: [0, 1.0, 1.5], dist: 5, yaw: 180, pitch: 6, fov: 50, roll: shakeK * 40},
		{at: [0, 1.2, 0], dist: 4.5, yaw: 200, pitch: 2, fov: 50},
		{at: [0, 1.9, -1], dist: 6.5, yaw: 0, pitch: 4, fov: 50},
		{at: [0, 2.2, 0], dist: 14, yaw: 30, pitch: 8, fov: 40, dyaw: 6},
		{at: [0, 1, 0], dist: 70, yaw: 20, pitch: 30, fov: 40, ddist: 60, near: 0.5, far: 3000},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={studio ? LIGHT.garden : smallLight([0, 0, 0], 'room', 10)}
				bg={studio ? 'linear-gradient(#FFC890 0%, #FFE8B8 60%)' : BG.room}
				far={studio ? <Ground color="#E8C870" size={3000} /> : null}
				near={
					studio ? (
						<group>
							<Elephant3D at={[0, 0, 0]} yaw={0.4} rumble={Math.sin(frame * 0.6)} />
							<Elephant3D at={[-9, 0, -6]} yaw={0.9} s={0.8} />
							{rings([0, 0.2, 0], frame > carry ? 120 : 24)}
						</group>
					) : (
						<Classroom frame={frame} mug={1} stare={1} />
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{!studio && frame < deep ? (
							<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
								{[0, 1, 2].map((i) => {
									const t = ((frame * 0.03 + i / 3) % 1);
									return <circle key={i} cx={960} cy={420} r={60 + t * 700} fill="none" stroke="#FFD84A" strokeWidth={10} opacity={0.6 * (1 - t)} />;
								})}
							</svg>
						) : null}
						<Big text="hello!" x={960} y={250} size={110} frame={frame} at={4} until={nobody} color={UI.cream} />
						<Label text="TOO DEEP FOR HUMAN EARS" x={960} y={860} size={56} frame={frame} at={deep + 10} until={ele - 4} color={UI.yellow} />
						<Label text="ELEPHANT RUMBLES · TOO LOW FOR US" x={960} y={220} size={52} frame={frame} at={ele + 10} color={UI.cream} />
						<Big text="UP TO 10 KM" x={960} y={860} size={96} frame={frame} at={carry + 16} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="boom" at={4} volume={0.45} />
			<Sound name="squeak" at={rattle + 2} volume={0.2} />
			<Sound name="boom" at={ele + 8} volume={0.3} />
		</>
	);
};


