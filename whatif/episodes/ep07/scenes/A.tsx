import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Bars, Big, Count, Label, UI} from '../../../components/ui';
import {Ground, Splash3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Brain3D} from '../../../three/props3d';
import {Heart3D, Stink3D} from '../../../three/inside3d';
import {Boat3D, Bubbles3D, Fish3D, Krill3D, SoundRings3D, Squid3D, Underwater3D, UwCamera3D, Whale3D, whalePoint} from '../../../three/ocean3d';
import {Bus3D, Herd3D} from '../../../three/sky3d';
import {Scale3D} from '../../../three/grimoire3d';
import type {Cam3} from '../../../three/Stage3D';
import {Shot3, type Angle3} from '../../../three/shot3';
import {T} from '../../../three/toon';
import {beamSpot, BG, Forestomach, gutLight, HandTorch, LIGHT, P7, Panel, SeaSet, Swimmer, TORCH_ARM, torchHand, Vignette} from './kit';
import {handAt, headAt, type V3} from './util';

// Part A: inside the whale (the cold open), then back an hour: the dive boat,
// the dropped camera, the blue whale that can't swallow you, and the sperm
// whale that can.

const withShake = (a: Angle3, frame: number, at: number, k = 0.06, amount = 1, len = 18): Angle3 => {
	const s = shake(frame, at, amount, len);
	return {...a, at: [a.at[0] + s.x * k, a.at[1] + s.y * k, a.at[2]]};
};

/** A heartbeat: 1 on the thump, fading over 8 frames, every `every` frames from `from`. */
const beatAt = (frame: number, from: number, every = 26) => {
	if (frame < from) {
		return 0;
	}
	const k = (frame - from) % every;
	return k < 8 ? 1 - k / 8 : 0;
};

/** A flat sea-blue studio floor that fades into the dark. */
const SeaStudio: React.FC<{size?: number}> = ({size = 160}) => <Ground color="#1E3E7A" size={size} lines={{every: 4, color: '#2A4E90', along: 'z'}} />;

// ---------------------------------------------------------------- cold

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const smells = cue(l0, 'And it smells');
	const torch = cue(l0, 'You click');
	const pink = cue(l0, 'and the walls');
	const moving = cue(l0, "they're moving");
	const thump = cue(l0, 'Something huge');
	const inside = cue(l0, 'You are inside');
	const how = l1.a;
	const back = cue(l1, "Let's go back");
	const cuts = [0, smells - 4, torch - 4, pink - 4, thump - 4, inside - 4, how - 4];
	const flick = frame < torch ? 0 : frame < torch + 5 ? [1, 0.2, 1, 0.4, 1][frame - torch] : 1;
	const on = Math.max(0.1, flick);
	const pos: V3 = [0, 0, 1];
	const turn = 0.5;
	const aim = frame > pink ? Math.sin((frame - pink) * 0.035) * 0.6 : 0.05;
	const tip = frame > moving ? lerp(0.1, -0.45, span(frame, moving, moving + 20)) : 0.1;
	const beat = beatAt(frame, thump);
	const light = gutLight(torchHand(pos, turn), beamSpot(pos, turn, aim, tip, 3), on);
	const face = frame > inside ? 'shocked' : frame > smells ? 'scared' : 'neutral';
	const head = headAt(pos);
	const near = (
		<group>
			<Hero3D position={pos} turn={turn} scuba armR={TORCH_ARM} reachR={70} armL={frame > smells && frame < torch ? [40, 150] : [12, 8]} reachL={frame > smells && frame < torch ? 60 : 0} face={face} look={frame > pink ? [aim * 1.2, -tip] : [0, 0]} />
			<HandTorch pos={pos} turn={turn} aim={aim} tip={tip} on={flick} beam={4.5} />
			{frame > smells && frame < pink ? <Stink3D at={[head[0] + 0.1, head[1] + 0.2, head[2] + 0.2]} frame={frame} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [head[0], head[1] - 0.05, head[2]], dist: 1.6, yaw: 35, pitch: 4, fov: 32, dyaw: 4},
		{at: [head[0], head[1] - 0.05, head[2]], dist: 1.25, yaw: 18, pitch: 2, fov: 32, dyaw: -4},
		{at: [0.9, 1.3, 2.4], dist: 2.4, yaw: 196, pitch: 10, fov: 44, dyaw: 6},
		{at: [0.2, 1.7, 1.6], dist: 3.0, yaw: 100, pitch: 6, fov: 52, dyaw: -14},
		withShake({at: [0, 2.0, 0.5], dist: 3.2, yaw: 160, pitch: -12, fov: 54, dyaw: 6}, frame, frame - ((frame - thump + 260) % 26), 0.12, 1, 10),
		{at: [0, 1.3, 1], dist: 3.6, yaw: 205, pitch: 18, fov: 50, ddist: 0.9, dyaw: 8},
		{at: [head[0], head[1] - 0.05, head[2]], dist: 1.4, yaw: 28, pitch: 3, fov: 32, ddist: -0.2},
	];
	const rewind = span(frame, back, dur - 2);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={BG.gut}
				far={<Forestomach frame={frame} beat={beat} squeeze={frame > moving ? 0.08 : 0.04} />}
				near={near}
				blur={0}
				grade={rewind > 0 ? `saturate(${1 - rewind * 0.6}) blur(${rewind * 4}px)` : undefined}
				overlay={() => (
					<AbsoluteFill>
						{frame < torch ? <AbsoluteFill style={{background: '#050003', opacity: 0.72}} /> : null}
						<Vignette amount={frame < torch ? 0.9 : 0.45} />
						<Label text="INSIDE A WHALE" x={960} y={930} size={60} frame={frame} at={inside + 8} until={how - 6} color={UI.yellow} />
						<Big text="1 HOUR EARLIER…" x={960} y={540} size={120} frame={frame} at={back + 6} color={UI.cream} />
						{rewind > 0.7 ? <AbsoluteFill style={{background: '#ffffff', opacity: span(frame, dur - 12, dur - 1)}} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="bubbles" at={4} volume={0.2} />
			<Sound name="squeak" at={smells + 4} volume={0.25} />
			<Sound name="snap" at={torch} volume={0.35} />
			<Sound name="heart" at={thump} volume={0.5} loop={Math.max(1, how - thump)} />
			<Sound name="timestop" at={back + 2} volume={0.4} />
			<Sound name="whoosh" at={dur - 14} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- boat

const BOAT_HERO: V3 = [0, 0.85, -3.1];
const BOAT_FRIEND: V3 = [0.9, 0.85, -1.9];
const FRIEND_TURN = Math.atan2(BOAT_HERO[0] - BOAT_FRIEND[0], BOAT_HERO[2] - BOAT_FRIEND[2]);

export const Boat: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const miles = cue(l0, 'miles out');
	const friend = cue(l0, 'Your best friend');
	const held = cue(l0, 'You held it');
	const slipped = cue(l0, 'Then it slipped');
	const sank = cue(l0, 'and sank');
	const mask = cue(l0, 'So you pulled');
	const flipped = cue(l0, 'and flipped');
	const cuts = [0, miles - 4, friend - 4, held - 4, slipped - 4, mask - 4, flipped - 4];
	// The camera goes from your friend's hand to yours, then over the back.
	const fHand = handAt(BOAT_FRIEND, FRIEND_TURN, [20, 40], 70, 1);
	const yHand = handAt(BOAT_HERO, 0, [20, 40], 70, 1);
	const yMid: V3 = [(yHand[0] + handAt(BOAT_HERO, 0, [20, 40], 70, -1)[0]) / 2, yHand[1] + 0.05, yHand[2]];
	const give = span(frame, friend + 14, friend + 40);
	const fall = span(frame, slipped + 6, slipped + 22, (v) => v * v);
	let cam: V3 = [lerp(fHand[0], yMid[0], give), lerp(fHand[1], yMid[1], give) + Math.sin(give * Math.PI) * 0.2, lerp(fHand[2], yMid[2], give)];
	if (frame > slipped + 6) {
		cam = [yMid[0] + fall * 0.1, lerp(yMid[1], -0.95, fall) + Math.sin(fall * Math.PI) * 0.35, lerp(yMid[2], -4.7, Math.min(1, fall * 1.4))];
	}
	const camGone = frame > slipped + 24;
	const maskDown = span(frame, mask + 4, mask + 18);
	const flip = span(frame, flipped, flipped + 26, (v) => v);
	const inWater = flip > 0.82;
	const hold = frame > held - 10 && frame < slipped + 6;
	const reach = frame >= slipped + 6 && frame < mask;
	const handsUp = frame >= mask && frame < flipped;
	const arm: [number, number] = handsUp ? [40, 150] : hold ? [20, 40] : reach ? [30, 60] : [12, 8];
	const armReach = handsUp ? 55 : hold ? 70 : reach ? 110 : 0;
	const heroFace = frame > slipped + 4 && frame < mask ? 'shocked' : frame > mask ? 'determined' : 'happy';
	const fFace = frame > slipped + 4 ? 'shocked' : 'happy';
	const fArm: [number, number] = frame < friend + 40 ? [20, 40] : [12, 8];
	const splashAt = flipped + 15;
	const passengers = (
		<group>
			<Hero3D who={P7.friend} position={BOAT_FRIEND} turn={FRIEND_TURN} armR={fArm} reachR={frame < friend + 40 ? 70 : 0} face={fFace} armL={frame > slipped + 6 ? [40, 150] : [12, 8]} reachL={frame > slipped + 6 ? 40 : 0} />
			{!inWater ? (
				<group position={[BOAT_HERO[0], BOAT_HERO[1] + Math.sin(flip * Math.PI) * 0.5 - flip * 1.6, BOAT_HERO[2] - flip * 1.5]} rotation={[-flip * 2.4, 0, 0]}>
					<Hero3D position={[0, 0, 0]} scuba mask={maskDown} armL={arm} armR={arm} reachL={armReach} reachR={armReach} face={heroFace} look={reach ? [0, 0.6] : [0, 0]} />
				</group>
			) : null}
			{!camGone ? <UwCamera3D at={cam} rot={[fall * 4, 0.2 + fall * 3, 0]} s={0.9} /> : null}
		</group>
	);
	const near = (
		<group>
			<Boat3D at={[0, 0, 0]} frame={frame}>
				{passengers}
			</Boat3D>
			<Splash3D at={[0, 0.05, -4.8]} t={(frame - (slipped + 22)) / 24} r={0.4} />
			<Splash3D at={[0, 0.05, -5.0]} t={(frame - splashAt) / 30} r={1.3} />
			{frame > splashAt ? <Bubbles3D at={[0, -0.6, -5]} frame={frame} n={10} rise={0.6} r={0.08} spread={0.6} /> : null}
		</group>
	);
	const head: V3 = [BOAT_HERO[0], BOAT_HERO[1] + 1.36, BOAT_HERO[2]];
	const angles: Angle3[] = [
		{at: [0, 1.4, -0.5], dist: 20, yaw: 118, pitch: 10, fov: 38, dyaw: 6},
		{at: [0, 0.5, 0], dist: 46, yaw: 60, pitch: 32, fov: 40, dyaw: 10},
		{at: [0.4, 1.95, -2.5], dist: 4.4, yaw: 92, pitch: 6, fov: 36, dyaw: -6},
		{at: [yMid[0], yMid[1], yMid[2]], dist: 1.4, yaw: 30, pitch: 14, fov: 36, dyaw: 6},
		{at: [0, 0.8, -4.1], dist: 2.8, yaw: 205, pitch: 10, fov: 46, dyaw: -6},
		{at: [head[0], head[1] - 0.05, head[2]], dist: 1.5, yaw: 8, pitch: 3, fov: 32, dyaw: 6},
		{at: [0, 0.9, -4.2], dist: 7.5, yaw: 98, pitch: 6, fov: 40, dyaw: -8},
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={LIGHT.sea} bg={BG.sea} far={<SeaSet frame={frame} />} near={near} blur={0} />
			<Sound name="pop" at={friend + 30} volume={0.3} />
			<Sound name="squeak" at={slipped + 4} volume={0.3} />
			<Sound name="splash" at={slipped + 22} volume={0.35} />
			<Sound name="snap" at={mask + 14} volume={0.25} />
			<Sound name="whoosh" at={flipped + 2} volume={0.3} />
			<Sound name="splash" at={splashAt} volume={0.6} />
		</>
	);
};

// ---------------------------------------------------------------- under

export const Under: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const chasing = cue(l0, 'chasing');
	const tumbles = cue(l0, 'tumbles');
	const sudden = cue(l0, 'Then, all of');
	const passing = cue(l0, 'Something is passing');
	const enormous = cue(l0, 'Something enormous');
	const cuts = [0, chasing - 4, tumbles - 4, sudden - 4, passing - 4, enormous - 4];
	// You dive down and forward, after the camera.
	const d = frame * 0.032;
	const hero: V3 = [0, -1.2 - d * 0.75, d * 0.55];
	const camT = Math.min(frame, sudden + 20);
	const camPos: V3 = [0.3, -3.0 - camT * 0.026, 1.0 + camT * 0.016];
	const roll = span(frame, passing, passing + 24) * 180;
	const pitch = lerp(140, 70, span(frame, sudden, passing + 10));
	// The blue whale glides across above you.
	const wx = lerp(-38, 14, span(frame, sudden - 40, dur, (v) => v));
	const whale: V3 = [wx, hero[1] + 5.5, hero[2] + 2];
	const over = Math.max(0, 1 - Math.abs(wx - hero[0]) / 22);
	const dark = Math.min(0.75, over * 0.9);
	const near = (
		<group>
			<Swimmer at={hero} pitch={pitch} roll={roll} frame={frame} armL={roll > 90 ? [40, 60] : [150, 165]} armR={roll > 90 ? [40, 60] : [120, 150]} face={frame > sudden ? 'shocked' : 'determined'} headUp={roll > 90 ? 10 : 50} look={roll > 90 ? [0, -0.6] : [0, 0]} />
			<Bubbles3D at={[hero[0], hero[1] + 0.4, hero[2] + 0.2]} frame={frame} n={8} rise={1.6} />
			{frame < 40 ? <Bubbles3D at={[0, -1.2, 0]} frame={frame + 40} n={30} rise={1.4} r={0.1} spread={1.2} every={50} seed={4} /> : null}
			<UwCamera3D at={camPos} rot={[frame * 0.05, frame * 0.07, frame * 0.03]} s={0.9} />
			<Whale3D kind="blue" at={whale} rot={[0, Math.PI / 2, 0.05]} len={25} frame={frame} swim={0.6} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, -1.6, 0.3], dist: 5, yaw: 30, pitch: -32, fov: 44, dyaw: 8},
		{at: hero, dist: 4.2, yaw: 190, pitch: 28, fov: 42, dyaw: -8},
		{at: [camPos[0], camPos[1] + 0.6, camPos[2]], dist: 2.6, yaw: 25, pitch: -8, fov: 42, dyaw: 6},
		{at: [hero[0], hero[1] + 2, hero[2]], dist: 10, yaw: 60, pitch: -38, fov: 46, dyaw: 6},
		{at: [hero[0], hero[1] + 0.3, hero[2]], dist: 3, yaw: 30, pitch: -24, fov: 44, dyaw: 6},
		{at: [hero[0] - 3, hero[1] + 3, hero[2]], dist: 30, yaw: 75, pitch: -24, fov: 44, dyaw: 4},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={{...LIGHT.under, ambient: 1.3 - dark * 0.6, sun: {...LIGHT.under.sun, intensity: 2.4 * (1 - dark * 0.7)}}}
				bg={BG.under}
				far={<Underwater3D frame={frame} surface={0} center={[hero[0], hero[1], hero[2]]} dark={dark} />}
				near={near}
				blur={0}
				overlay={() => <AbsoluteFill style={{background: '#021428', opacity: dark * 0.45}} />}
			/>
			<Sound name="bubbles" at={2} volume={0.35} />
			<Sound name="whoosh" at={sudden + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- blue

/** A see-saw: a plank on a wedge, tipped by `tip` radians. */
const Seesaw: React.FC<{at: V3; len?: number; tip?: number; children?: React.ReactNode}> = ({at, len = 9, tip = 0, children}) => (
	<group position={at}>
		<T shape={{kind: 'cone', r: 0.7, h: 1.1}} color="#FFD84A" position={[0, 0.55, 0]} outline={0.03} />
		<group position={[0, 1.15, 0]} rotation={[0, 0, tip]}>
			<T shape={{kind: 'box', w: len, h: 0.18, d: 1.6}} color="#C98A5A" outline={0.03} />
			{children}
		</group>
	</group>
);

export const Blue: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const biggest = cue(l0, 'The biggest');
	const dino = cue(l0, 'bigger than any');
	const grow = cue(l0, 'It can grow');
	const buses = cue(l0, 'about as long as three');
	const heart = cue(l0, 'Its heart');
	const tongue = cue(l0, 'And its tongue');
	const cuts = [0, biggest - 4, dino - 4, grow - 4, buses - 4, heart - 4, tongue - 4];
	const sea = frame < grow - 4;
	const studioPart = frame < heart - 4 ? 'buses' : frame < tongue - 4 ? 'heart' : 'tongue';
	// Underwater: the whale glides past your face.
	const rot: V3 = [0, Math.PI / 2, 0];
	const wAt: V3 = [-4 + frame * 0.09, -5, -2];
	const eye = whalePoint(wAt, rot, 25, 0.78, 0.07, 0.01);
	const hero: V3 = [eye[0] + 0.5, eye[1] + 0.4, eye[2] + 3.2];
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light = LIGHT.under;
	let bg = BG.under;
	if (sea) {
		far = <Underwater3D frame={frame} surface={6} center={hero} />;
		near = (
			<group>
				<Whale3D kind="blue" at={wAt} rot={rot} len={25} frame={frame} swim={0.5} />
				<Swimmer at={hero} yaw={180} pitch={35} frame={frame} kick={0.4} armL={[50, 70]} armR={[50, 70]} face="shocked" headUp={20} look={[0.4, 0]} />
				<Bubbles3D at={[hero[0], hero[1] + 0.5, hero[2] - 0.2]} frame={frame} n={8} rise={1.4} />
				<Fish3D at={[hero[0] + 4, hero[1] + 1, hero[2] - 1]} frame={frame} n={24} r={2} s={0.18} />
			</group>
		);
	} else {
		light = LIGHT.ocean;
		bg = BG.ocean;
		far = <SeaStudio />;
		if (studioPart === 'buses') {
			near = (
				<group>
					<Whale3D kind="blue" at={[0, 5.2, 0]} len={30} frame={frame} swim={0.4} />
					{[-10, 0, 10].map((z) => (
						<Bus3D key={z} at={[0, 0, z]} />
					))}
					<Hero3D position={[3.2, 0, 13]} turn={-0.6} face="shocked" scuba mask={0} />
				</group>
			);
		} else if (studioPart === 'heart') {
			const b = beatAt(frame, heart, 30);
			near = (
				<group>
					<Scale3D at={[0, 0, 0]} w={2.6} needle={2.2} />
					<Heart3D at={[0, 1.15, 0]} s={1.25} beat={b} />
					<Hero3D position={[1.9, 0, 0.6]} turn={-0.9} face="shocked" scuba mask={0} />
				</group>
			);
		} else {
			const ele = {p: [3.0, 1.24, 0] as V3, s: 0.55, yaw: -Math.PI / 2};
			near = (
				<group>
					<Seesaw at={[0, 0, 0]} tip={Math.sin(frame * 0.05) * 0.015}>
						<T shape={{kind: 'sphere', r: 1, seg: 32}} color="#E87A8A" position={[-3.0, 0.55, 0]} scale={[1.5, 0.55, 0.9]} outline={0.03} />
					</Seesaw>
					<Herd3D items={[ele]} />
				</group>
			);
		}
	}
	const angles: Angle3[] = [
		{at: [(eye[0] + hero[0]) / 2, eye[1] + 0.2, (eye[2] + hero[2]) / 2], dist: 5.5, yaw: 150, pitch: 6, fov: 44, dyaw: 8},
		{at: [wAt[0] + 2, wAt[1], wAt[2]], dist: 42, yaw: 170, pitch: -14, fov: 44, dyaw: 6},
		{at: [wAt[0] + 6, wAt[1], wAt[2]], dist: 30, yaw: 120, pitch: -6, fov: 44, dyaw: -8},
		{at: [0, 4, 0], dist: 46, yaw: 90, pitch: 8, fov: 40, dyaw: 6},
		{at: [0, 2.5, 6], dist: 22, yaw: 140, pitch: 4, fov: 44, dyaw: -8},
		{at: [0.4, 1.4, 0], dist: 6, yaw: 20, pitch: 8, fov: 40, dyaw: 8},
		{at: [0, 1.6, 0], dist: 13, yaw: 6, pitch: 8, fov: 40, dyaw: -6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={bg}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="BLUE WHALE" x={960} y={140} size={60} frame={frame} at={8} until={biggest - 6} color={UI.cyan} />
						<Label text="BIGGEST ANIMAL EVER KNOWN" x={960} y={140} size={56} frame={frame} at={biggest + 6} until={grow - 6} color={UI.yellow} />
						{frame < heart - 4 ? <Count from={0} to={30} x={960} y={150} size={120} frame={frame} at={grow + 4} dur={30} prefix="≈ " suffix=" M" color={UI.yellow} /> : null}
						<Label text="= 3 BUSES" x={960} y={950} size={60} frame={frame} at={buses + 10} until={heart - 6} color={UI.cream} />
						{frame >= heart - 4 && frame < tongue - 4 ? <Label text="HEART ≈ 180 KG" x={1460} y={300} size={60} frame={frame} at={heart + 8} until={tongue - 6} color={UI.red} /> : null}
						<Label text="TONGUE ≈ 2.7 TONNES" x={560} y={250} size={54} frame={frame} at={tongue + 10} color={UI.cream} />
						<Label text="≈ AN ELEPHANT" x={1380} y={250} size={54} frame={frame} at={tongue + 22} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={grow - 4} volume={0.3} />
			<Sound name="heart" at={heart + 2} volume={0.45} />
			<Sound name="thud" at={tongue + 8} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- throat

/** A dinner plate held up in both hands. */
const Plate: React.FC<{at: V3; rot?: V3}> = ({at, rot}) => (
	<group position={at} rotation={rot}>
		<T shape={{kind: 'cyl', r: 0.14, r2: 0.13, h: 0.02, seg: 40}} color="#F4F4F8" rotation={[Math.PI / 2, 0, 0]} outline={0.006} />
		<T shape={{kind: 'torus', r: 0.115, tube: 0.008}} color="#7FB8E8" position={[0, 0, 0.012]} outline={0} />
	</group>
);

/** A side-on whale with its little throat, for the diagram. */
const ThroatDiagram: React.FC<{frame: number; at: number; blue: number; hump: number}> = ({frame, at, blue, hump}) => {
	const p = span(frame, at + 6, at + 30);
	return (
		<svg viewBox="0 0 700 520" width={700} height={520} style={{position: 'absolute', left: 30, top: 10}}>
			<path d="M40 250 Q120 180 330 170 Q520 165 600 210 Q640 240 600 280 Q520 320 330 315 Q150 310 40 250 Z" fill="#6A8DB8" stroke="#140A28" strokeWidth={6} />
			<path d="M40 250 L0 215 L18 252 L0 290 Z" fill="#6A8DB8" stroke="#140A28" strokeWidth={6} />
			<path d="M470 255 Q540 262 600 250" fill="none" stroke="#140A28" strokeWidth={5} />
			<circle cx={472} cy={242} r={6} fill="#140A28" />
			<circle cx={430} cy={280} r={10 + 4 * Math.sin(frame * 0.2)} fill="#FFD84A" stroke="#140A28" strokeWidth={4} opacity={p} />
			<path d={`M430 290 L430 380`} stroke="#FFD84A" strokeWidth={5} opacity={p} />
			<g opacity={p} transform="translate(430 430)">
				<ellipse cx={0} cy={0} rx={70} ry={26} fill="#F4F4F8" stroke="#140A28" strokeWidth={5} />
				<ellipse cx={0} cy={0} rx={50} ry={17} fill="none" stroke="#7FB8E8" strokeWidth={4} />
			</g>
			<text x={150} y={110} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#FFF3D6" opacity={p}>
				THROAT ≈ A DINNER PLATE
			</text>
			{blue > 0 ? (
				<text x={20} y={500} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#FF5A5A" opacity={blue}>
					✗ BLUE WHALE
				</text>
			) : null}
			{hump > 0 ? (
				<text x={360} y={500} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#FF5A5A" opacity={hump}>
					✗ HUMPBACK
				</text>
			) : null}
		</svg>
	);
};

export const Throat: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const think = cue(l0, 'and you think');
	const notAfter = cue(l0, "But it's not");
	const krill = cue(l0, "It's after a cloud");
	const millions = cue(l0, 'millions');
	const surprising = cue(l0, "And here's");
	const plate = cue(l0, "It's only about");
	const couldnt = cue(l0, 'A blue whale');
	const hump = cue(l0, 'Neither could');
	const cuts = [0, think - 4, notAfter - 4, krill - 4, millions - 4, surprising - 4, plate - 4, couldnt - 4];
	const jaw = span(frame, 0, think + 10) * (1 - span(frame, millions + 20, millions + 44));
	const pouch = span(frame, krill, millions + 30) * (1 - span(frame, surprising + 40, dur));
	const lunge = span(frame, 0, millions + 30, (v) => v);
	const wAt: V3 = [0, -6, lerp(-26, -12, lunge) + Math.max(0, frame - (millions + 30)) * 0.05];
	const rot: V3 = [0, 0, 0];
	const mouth = whalePoint(wAt, rot, 25, 0.95, 0, -0.01);
	const cloud: V3 = [0, -5.5, 2];
	const hero: V3 = [7.5, -5.2, 2.5];
	const diagram = frame >= surprising - 4;
	const holdPlate = frame >= plate - 4;
	const near = (
		<group>
			<Whale3D kind="blue" at={wAt} rot={rot} len={25} frame={frame} swim={0.6} jaw={jaw} pouch={pouch} />
			<Krill3D at={cloud} frame={frame} r={4} n={900} suck={mouth} p={span(frame, krill - 10, millions + 26, (v) => v)} />
			<Swimmer at={hero} yaw={-110} pitch={20} frame={frame} kick={0.4} armL={holdPlate ? [30, 80] : [80, 150]} armR={holdPlate ? [30, 80] : [80, 150]} reachL={holdPlate ? 80 : 30} reachR={holdPlate ? 80 : 30} face={frame < notAfter ? 'scared' : holdPlate ? 'happy' : 'shocked'} headUp={10} />
			{holdPlate ? <Plate at={handAt([hero[0], hero[1] - 0.85, hero[2]], (-110 * Math.PI) / 180, [30, 80], 80, 1).map((v, i) => (i === 0 ? v - 0.12 : i === 1 ? v + 0.18 : v)) as V3} rot={[0, (-110 * Math.PI) / 180, 0]} /> : null}
			<Bubbles3D at={[hero[0], hero[1] + 0.5, hero[2]]} frame={frame} n={8} rise={1.4} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [2, -5.5, -2], dist: 26, yaw: 30, pitch: 4, fov: 44, dyaw: 6},
		{at: [hero[0], hero[1] + 0.4, hero[2]], dist: 2.6, yaw: -70, pitch: 4, fov: 40, dyaw: -8},
		{at: [3, -6, -2], dist: 30, yaw: 95, pitch: 4, fov: 44, dyaw: 6},
		{at: cloud, dist: 9, yaw: 30, pitch: 10, fov: 44, dyaw: -10},
		{at: [0, -8, -6], dist: 30, yaw: 120, pitch: -8, fov: 44, dyaw: 8},
		{at: [hero[0] - 1.5, hero[1] + 0.2, hero[2]], dist: 5.5, yaw: -40, pitch: 4, fov: 44, dyaw: 6},
		{at: [hero[0] - 0.5, hero[1] + 0.4, hero[2]], dist: 3.2, yaw: -60, pitch: 4, fov: 40, dyaw: -6},
		{at: [hero[0] - 1.5, hero[1] + 0.2, hero[2]], dist: 6, yaw: -30, pitch: 4, fov: 44, dyaw: 6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.under}
				bg={BG.under}
				far={<Underwater3D frame={frame} surface={4} center={[2, -6, 0]} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="KRILL" x={760} y={860} size={56} frame={frame} at={krill + 6} until={millions + 20} color={UI.cream} />
						{diagram ? (
							<Panel frame={frame} at={surprising} x={1450} y={560} w={760} h={600} title="CAN'T SWALLOW YOU">
								<ThroatDiagram frame={frame} at={surprising} blue={span(frame, couldnt + 4, couldnt + 12)} hump={span(frame, hump + 4, hump + 12)} />
							</Panel>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={8} volume={0.3} />
			<Sound name="bubbles" at={krill} volume={0.35} />
			<Sound name="thud" at={millions + 40} volume={0.3} />
			<Sound name="pop" at={plate} volume={0.3} />
			<Sound name="tick" at={couldnt + 4} volume={0.4} />
			<Sound name="tick" at={hump + 4} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- click

export const Click: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const k1 = cue(l0, 'Click.');
	const k2 = cue(l0, 'Click.', 1);
	const k3 = cue(l0, 'Click.', 2);
	const chest = cue(l0, 'You can feel');
	const rings = cue(l0, 'Rings of sound');
	const out = cue(l0, 'Out of the dark');
	const square = cue(l0, 'with a giant square');
	const jaw = cue(l0, 'and a thin lower');
	const sperm = cue(l0, 'A sperm whale');
	const cuts = [0, k1 - 4, chest - 4, rings - 4, out - 4, square - 4, jaw - 4, sperm - 4];
	const hero: V3 = [0, -7, 0];
	const wz = lerp(-70, -20, span(frame, out - 20, sperm, (v) => 1 - (1 - v) * (1 - v)));
	const wAt: V3 = [0, -7.5, wz];
	const head = whalePoint(wAt, [0, 0, 0], 16, 0.99);
	const clicks = [k1, k2, k3, chest + 10, rings, rings + 20, rings + 40, out, out + 30, square + 10];
	const near = (
		<group>
			<Swimmer at={hero} pitch={15} frame={frame} kick={0.3} armL={frame > chest && frame < rings + 30 ? [20, 120] : [40, 50]} reachL={frame > chest && frame < rings + 30 ? 70 : 20} armR={[40, 50]} reachR={20} face={frame > out ? 'shocked' : 'scared'} headUp={0} look={frame > rings ? [0, 0] : [Math.sin(frame * 0.05) * 0.6, 0]} />
			<Bubbles3D at={[hero[0], hero[1] + 0.5, hero[2] + 0.2]} frame={frame} n={8} rise={1.6} />
			<SoundRings3D at={head} frame={frame} starts={clicks} speed={0.6} life={120} />
			<Whale3D kind="sperm" at={wAt} len={16} frame={frame} swim={0.5} jaw={frame > jaw ? 0.25 * span(frame, jaw, jaw + 20) : 0} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, -6.4, 0], dist: 4.2, yaw: 20, pitch: 4, fov: 40, dyaw: 6},
		{at: [0, -5.65, 0], dist: 1.6, yaw: 10, pitch: 2, fov: 34, dyaw: -4},
		{at: [0, -6.2, 0], dist: 3.4, yaw: -25, pitch: 4, fov: 40, dyaw: 6},
		{at: [0, -6.2, -6], dist: 16, yaw: 80, pitch: 4, fov: 44, dyaw: -6},
		{at: [0, -7, -18], dist: 22, yaw: 6, pitch: 3, fov: 42, ddist: -2},
		{at: whalePoint(wAt, [0, 0, 0], 16, 0.85), dist: 13, yaw: 35, pitch: 6, fov: 42, dyaw: 6},
		{at: whalePoint(wAt, [0, 0, 0], 16, 0.8, 0, -0.1), dist: 8, yaw: 50, pitch: -12, fov: 42, dyaw: -6},
		{at: wAt, dist: 26, yaw: 75, pitch: 4, fov: 42, dyaw: 6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.deep}
				bg={BG.deep}
				far={<Underwater3D frame={frame} surface={6} center={hero} rays={0.6} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{[k1, k2, k3].map((k, i) => (
							<Big key={i} text="CLICK" x={480 + i * 480} y={220 + (i % 2) * 80} size={110} frame={frame} at={k} until={k + 22} color={UI.cyan} rotate={i % 2 ? 6 : -6} />
						))}
						<Label text="SPERM WHALE" x={960} y={930} size={70} frame={frame} at={sperm + 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			{[k1, k2, k3].map((k, i) => (
				<Sound key={i} name="tick" at={k} volume={0.6} />
			))}
			{[rings, rings + 20, rings + 40, out, out + 30].map((k, i) => (
				<Sound key={`r${i}`} name="tick" at={k} volume={0.25} />
			))}
			<Sound name="whoosh" at={out + 10} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- echo

/** Bat and dolphin, drawn flat. */
const SameTrick: React.FC<{frame: number; dolphin: number; bat: number}> = ({frame, dolphin, bat}) => (
	<svg viewBox="0 0 700 460" width={700} height={460} style={{position: 'absolute', left: 30, top: 20}}>
		<g opacity={dolphin} transform={`translate(190 230) scale(${0.8 + 0.2 * dolphin})`}>
			<path d="M-150 10 Q-60 -70 70 -40 Q120 -30 150 -5 Q120 10 80 20 Q0 60 -100 40 L-150 75 L-135 25 L-175 0 Z" fill="#8AA0C0" stroke="#140A28" strokeWidth={6} />
			<path d="M-10 -55 L10 -100 L40 -48 Z" fill="#8AA0C0" stroke="#140A28" strokeWidth={6} />
			<circle cx={95} cy={-18} r={6} fill="#140A28" />
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M${165 + i * 22} -30 Q${180 + i * 22} -5 ${165 + i * 22} 20`} fill="none" stroke="#7FE0FF" strokeWidth={6} opacity={(Math.sin(frame * 0.3 - i) + 1) / 2} />
			))}
			<text x={-60} y={130} fontFamily={FONT} fontWeight={700} fontSize={46} fill="#FFF3D6">
				DOLPHINS
			</text>
		</g>
		<g opacity={bat} transform={`translate(520 220) scale(${0.8 + 0.2 * bat})`}>
			<path d="M0 -20 Q-40 -70 -120 -60 Q-100 -30 -110 0 Q-80 -10 -60 10 Q-40 -5 -20 15 Q-10 5 0 20 Q10 5 20 15 Q40 -5 60 10 Q80 -10 110 0 Q100 -30 120 -60 Q40 -70 0 -20 Z" fill="#4A3A5A" stroke="#140A28" strokeWidth={6} />
			<circle cx={0} cy={-20} r={22} fill="#4A3A5A" stroke="#140A28" strokeWidth={6} />
			<path d="M-14 -36 L-10 -58 L-2 -40 M14 -36 L10 -58 L2 -40" fill="#4A3A5A" stroke="#140A28" strokeWidth={5} />
			<text x={-50} y={120} fontFamily={FONT} fontWeight={700} fontSize={46} fill="#FFF3D6">
				BATS
			</text>
		</g>
	</svg>
);

export const Echo: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const sends = cue(l0, 'The whale sends');
	const fast = cue(l0, 'If the echo');
	const longer = cue(l0, 'If it takes');
	const sound = cue(l0, 'And sound travels');
	const dolphins = cue(l0, 'Dolphins');
	const bats = cue(l0, 'So do bats');
	const cuts = [0, sends - 4, fast - 4, longer - 4, sound - 4, dolphins - 4];
	const part = frame < fast - 4 ? 0 : frame < longer - 4 ? 1 : 2;
	const rot: V3 = [0, Math.PI / 2, 0];
	const wAt: V3 = [-14, 0, 0];
	const nose = whalePoint(wAt, rot, 16, 1.0);
	const dist = [16, 7, 24][part];
	const squidAt: V3 = [nose[0] + dist + 1.2, 0.3, 0];
	const speed = 0.35;
	const start = [sends + 4, fast + 6, longer + 6][part];
	const back = start + dist / speed;
	const hit = frame >= back && frame < back + 14;
	const echoBack = back + dist / speed;
	const near = (
		<group>
			<Whale3D kind="sperm" at={wAt} rot={rot} len={16} frame={frame} swim={0.4} />
			<Squid3D at={squidAt} rot={[0, -Math.PI / 2, 0]} len={2.4} frame={frame} color={hit ? '#FF8A6A' : '#D0503A'} />
			<SoundRings3D at={nose} frame={frame} starts={[start]} speed={speed} life={dist / speed + 4} yaw={Math.PI / 2} color="#9FF0FF" tube={0.08} />
			<SoundRings3D at={squidAt} frame={frame} starts={[back]} speed={speed} life={dist / speed + 2} yaw={Math.PI / 2} color="#FFD84A" tube={0.08} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [-4, 0, 0], dist: 34, yaw: 0, pitch: 4, fov: 42, dyaw: 4},
		{at: [-2, 0, 0], dist: 34, yaw: 0, pitch: 4, fov: 42, dyaw: -4},
		{at: [-5, 0, 0], dist: 28, yaw: 0, pitch: 4, fov: 42, dyaw: 4},
		{at: [0, 0, 0], dist: 40, yaw: 0, pitch: 4, fov: 42, dyaw: -4},
		{at: [-6, 0, 0], dist: 36, yaw: -14, pitch: 4, fov: 42, dyaw: 4},
		{at: [-6, 0, 0], dist: 36, yaw: 14, pitch: 4, fov: 42, dyaw: -4},
	];
	const elapsed = frame >= start ? Math.min(frame, echoBack) - start : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.deep}
				bg={BG.deep}
				far={<Underwater3D frame={frame} surface={14} center={[0, 0, 0]} rays={0.4} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="ECHOLOCATION" x={960} y={130} size={64} frame={frame} at={6} until={fast - 6} color={UI.cyan} />
						{frame < sound - 4 && frame >= start ? (
							<div style={{position: 'absolute', left: 660, top: 880, width: 600, height: 60, borderRadius: 30, background: UI.box, border: `3px solid ${UI.edge}`, overflow: 'hidden'}}>
								<div style={{width: `${Math.min(100, (elapsed / (2 * 24 / speed)) * 100)}%`, height: '100%', background: frame >= echoBack ? UI.yellow : UI.cyan}} />
							</div>
						) : null}
						<Label text="FAST ECHO = CLOSE" x={960} y={130} size={64} frame={frame} at={fast + 30} until={longer - 6} color={UI.green} />
						<Label text="SLOW ECHO = FAR" x={960} y={130} size={64} frame={frame} at={longer + 60} until={sound - 6} color={UI.orange} />
						{frame >= sound - 4 && frame < dolphins - 4 ? (
							<Bars
								x={360}
								y={330}
								w={1200}
								frame={frame}
								at={sound + 8}
								items={[
									{label: 'AIR', value: 0.23, color: UI.cream, note: '343 m/s'},
									{label: 'WATER', value: 1, color: UI.cyan, note: '≈ 1,500 m/s'},
								]}
							/>
						) : null}
						<Big text="OVER 4× FASTER" x={960} y={720} size={96} frame={frame} at={sound + 50} until={dolphins - 6} color={UI.yellow} />
						{frame >= dolphins - 4 ? (
							<Panel frame={frame} at={dolphins} x={960} y={540} w={760} h={560} title="SAME TRICK">
								<SameTrick frame={frame} dolphin={span(frame, dolphins + 4, dolphins + 14)} bat={span(frame, bats + 2, bats + 12)} />
							</Panel>
						) : null}
					</AbsoluteFill>
				)}
			/>
			{[0, 1, 2].map((i) => {
				const s0 = [sends + 4, fast + 6, longer + 6][i];
				const d0 = [16, 7, 24][i];
				return (
					<React.Fragment key={i}>
						<Sound name="tick" at={s0} volume={0.5} />
						<Sound name="tick" at={s0 + (2 * d0) / speed} volume={0.3} />
					</React.Fragment>
				);
			})}
			<Sound name="pop" at={dolphins + 4} volume={0.3} />
			<Sound name="pop" at={bats + 2} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- sperm

export const Sperm: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const loudest = cue(l0, 'Their clicks');
	const db = cue(l0, 'around two hundred');
	const echoes = cue(l0, 'and they use');
	const brain = cue(l0, 'They have the biggest');
	const five = cue(l0, 'more than five');
	const teeth = cue(l0, 'Their big teeth');
	const hunt = cue(l0, 'And they hunt');
	const whole = cue(l0, 'and swallow them');
	const ninety = cue(l0, 'Out of about');
	const only = cue(l0, 'the sperm whale is the only');
	const cuts = [0, loudest - 4, echoes - 4, brain - 4, five - 4, teeth - 4, hunt - 4, ninety - 4, only - 4];
	const brainPart = frame >= brain - 4 && frame < teeth - 4;
	const yaw = Math.PI / 2 + Math.sin(frame * 0.006) * 0.25;
	const rot: V3 = [0, yaw, 0];
	const wAt: V3 = [0, 4, 0];
	const nose = whalePoint(wAt, rot, 16, 1.0);
	const jaw = frame >= teeth - 4 && frame < hunt - 4 ? span(frame, teeth, teeth + 16) * 0.55 : frame >= hunt - 4 && frame < ninety - 4 ? span(frame, hunt + 10, hunt + 26) * (1 - span(frame, whole + 16, whole + 26)) * 0.7 : 0;
	const suck = span(frame, whole - 4, whole + 18, (v) => v * v);
	const squidStart: V3 = [nose[0] + 6, nose[1] - 1, nose[2]];
	const squidAt: V3 = [lerp(squidStart[0], nose[0] - 0.8, suck), lerp(squidStart[1], nose[1] - 1.3, suck), nose[2]];
	const dark = frame >= echoes - 4 && frame < brain - 4;
	const clicks = [loudest + 6, loudest + 26, db + 6, db + 26, echoes + 6, echoes + 30, echoes + 54];
	let near: React.ReactNode;
	if (brainPart) {
		near = (
			<group>
				<T shape={{kind: 'cyl', r: 1.4, h: 0.8}} color="#2A4E90" position={[-2.2, 0.4, 0]} outline={0.03} />
				<T shape={{kind: 'cyl', r: 0.6, h: 0.8}} color="#2A4E90" position={[2.2, 0.4, 0]} outline={0.03} />
				<Brain3D at={[-2.2, 1.85, 0]} frame={frame} s={1.0} />
				<Brain3D at={[2.2, 1.18, 0]} frame={frame} s={0.38} />
				<Hero3D position={[3.4, 0, 0.6]} turn={-0.7} face="smug" scuba mask={0} />
			</group>
		);
	} else {
		near = (
			<group>
				<Whale3D kind="sperm" at={wAt} rot={rot} len={16} frame={frame} swim={0.3} jaw={jaw} />
				<SoundRings3D at={nose} frame={frame} starts={clicks} speed={0.45} life={60} yaw={yaw} />
				{frame >= hunt - 4 && frame < ninety - 4 && suck < 0.97 ? <Squid3D at={squidAt} rot={[0, -Math.PI / 2, 0]} len={lerp(4, 1.5, suck)} frame={frame} /> : null}
				{frame >= ninety - 4 ? <Hero3D position={[nose[0] + 3, 0, nose[2] + 1.5]} turn={-1.9} scuba mask={0} face="scared" /> : null}
			</group>
		);
	}
	const angles: Angle3[] = [
		{at: [0, 4, 0], dist: 30, yaw: 10, pitch: 6, fov: 42, dyaw: 8},
		{at: [nose[0] - 3, nose[1], nose[2]], dist: 18, yaw: 20, pitch: 4, fov: 42, dyaw: -6},
		{at: [0, 4, 0], dist: 30, yaw: -15, pitch: 6, fov: 42, dyaw: 6},
		{at: [0, 1.2, 0], dist: 9, yaw: 0, pitch: 8, fov: 40, dyaw: 6},
		{at: [0.8, 1.2, 0], dist: 7, yaw: 12, pitch: 8, fov: 40, dyaw: -6},
		{at: [nose[0] - 3, nose[1] - 1.6, nose[2]], dist: 7, yaw: 25, pitch: 14, fov: 42, dyaw: 6},
		{at: [nose[0] + 1, nose[1] - 1, nose[2]], dist: 15, yaw: 20, pitch: 4, fov: 42, dyaw: -6},
		{at: [0, 3, 0], dist: 34, yaw: 25, pitch: 6, fov: 42, dyaw: 6},
		{at: [nose[0] + 1, 2.2, nose[2] + 1], dist: 13, yaw: 30, pitch: 6, fov: 42, dyaw: -6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={dark ? LIGHT.dark : LIGHT.ocean}
				bg={dark ? BG.dark : BG.ocean}
				far={dark ? <Underwater3D frame={frame} surface={30} center={[0, 4, 0]} rays={0} dark={0.8} /> : <SeaStudio />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="LOUDEST ANIMAL ON EARTH" x={960} y={140} size={60} frame={frame} at={loudest + 6} until={echoes - 6} color={UI.cyan} />
						<Big text="≈ 230 DECIBELS" x={960} y={900} size={100} frame={frame} at={db + 10} until={echoes - 6} color={UI.yellow} />
						<Label text="FINDS FOOD IN THE PITCH DARK" x={960} y={930} size={54} frame={frame} at={echoes + 10} until={brain - 6} color={UI.cream} />
						<Label text="SPERM WHALE ≈ 8 KG" x={560} y={200} size={54} frame={frame} at={brain + 10} until={teeth - 6} color={UI.yellow} />
						<Label text="YOU ≈ 1.3 KG" x={1400} y={300} size={54} frame={frame} at={brain + 24} until={teeth - 6} color={UI.cream} />
						<Big text="5× HEAVIER" x={960} y={900} size={96} frame={frame} at={five + 8} until={teeth - 6} color={UI.orange} />
						<Label text="TEETH ONLY IN THE LOWER JAW" x={960} y={140} size={56} frame={frame} at={teeth + 10} until={hunt - 6} color={UI.cream} />
						<Label text="GIANT SQUID: SWALLOWED WHOLE" x={960} y={140} size={56} frame={frame} at={whole} until={ninety - 6} color={UI.orange} />
						<Label text="1 OF ABOUT 90 KINDS OF WHALE" x={960} y={140} size={56} frame={frame} at={ninety + 6} until={only - 6} color={UI.cream} />
						<Label text="THE ONLY THROAT BIG ENOUGH FOR YOU" x={960} y={140} size={56} frame={frame} at={only + 6} color={UI.red} />
					</AbsoluteFill>
				)}
			/>
			{clicks.map((k, i) => (
				<Sound key={i} name="tick" at={k} volume={0.35} />
			))}
			<Sound name="pop" at={brain + 10} volume={0.3} />
			<Sound name="snap" at={whole + 22} volume={0.45} />
		</>
	);
};
