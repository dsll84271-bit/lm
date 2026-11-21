import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Bars, Big, Count, Label, UI} from '../../../components/ui';
import {Ground, NightSky3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Box, Street3, StreetLamp3} from '../../../three/sets3d';
import {Bird3D, Cliffs3D, CloudSea, Fields3D, Flyer, Mountains3D, Sea3D, Sun3D, Thermal3D, Town3D, Vee, veeSpot} from '../../../three/sky3d';
import {Says, Shot3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Bedroom, House} from './A';
import {BG, LIGHT, P5} from './kit';
import {headAt, mixArm, top, type V3} from './util';

// Part C: soaring on warm air, the condors, flying in a V and taking turns,
// home, the lesson, the bird watchers, and the question for the comments.

const rad = (d: number) => (d * Math.PI) / 180;
const yawOf = (a: number) => (Math.atan2(Math.cos(a), -Math.sin(a)) * 180) / Math.PI;

// ---------------------------------------------------------------- thermal

export const Thermal: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const soared = cue(l0, 'It soared');
	const sunny = cue(l0, 'Over the sunny');
	const spread = cue(l0, 'So you spread');
	const carry = cue(l0, 'and let it carry');
	const flash = frame < sunny - 4;
	const c: V3 = [0, 0, -36];
	const a = (frame - spread) * 0.045;
	const circling = frame > spread;
	const rise = span(frame, spread, dur, (v) => v);
	const R = 7;
	const hero: V3 = circling ? [c[0] + R * Math.sin(a), lerp(26, 44, rise), c[2] + R * Math.cos(a)] : [lerp(-30, -R, span(frame, sunny - 4, spread)), 25, c[2] + lerp(20, 0, span(frame, sunny - 4, spread))];
	const ca = a + Math.PI;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, soared - 4, sunny - 4, spread - 4, carry - 4]}
				angles={
					flash
						? [
								{at: [0, 20, 0], dist: 14, yaw: 30, pitch: 4, fov: 44},
								{at: [0, 20, 0], dist: 18, yaw: -20, pitch: 8, fov: 44},
								{at: [0, 20, 0], dist: 18, yaw: -20, pitch: 8, fov: 44},
							]
						: [
								{at: [0, 20, 0], dist: 14, yaw: 30, pitch: 4, fov: 44},
								{at: [0, 20, 0], dist: 14, yaw: 30, pitch: 4, fov: 44},
								{at: [-6, 24, -34], dist: 36, yaw: 25, pitch: 8, fov: 46},
								{at: hero, dist: 7, yaw: 30, pitch: 10, fov: 42, ddist: 0, dyaw: 0},
								{at: [c[0], lerp(30, 44, rise), c[2]], dist: 15, yaw: 20 + rise * 40, pitch: 12, fov: 50, ddist: 0, dyaw: 0},
							]
				}
				light={flash ? LIGHT.andes : LIGHT.cliffs}
				bg={flash ? BG.andes : BG.cliffs}
				grade={flash ? 'sepia(0.55) saturate(0.9)' : undefined}
				far={
					flash ? (
						<Mountains3D peaks={[{at: [-40, -120], h: 60}, {at: [20, -140], h: 80}]} />
					) : (
						<group>
							<Sea3D frame={frame} color="#3A7AC0" />
							<Cliffs3D at={[0, 0, -50]} h={22} len={200} seed={1} />
							<Ground color="#7ED05A" size={0.01} />
							<Sun3D at={[-90, 40, -160]} r={10} color="#FFD890" />
						</group>
					)
				}
				near={
					flash ? (
						<Bird3D kind="argentavis" at={[0, 20, 0]} frame={frame} wing="glide" yaw={70} bank={-8} />
					) : (
						<group>
							<Thermal3D at={[c[0], 20, c[2]]} frame={frame} h={40} r={8} color="#FF9A40" opacity={0.8} />
							<Flyer at={hero} pitch={circling ? 75 : 80} yaw={circling ? yawOf(a) : 90} bank={circling ? -22 : 0} frame={frame} pose={circling ? 'glide' : 'tired'} face={circling ? 'happy' : 'determined'} />
							{circling ? <Bird3D kind="condor" at={[c[0] + R * 1.3 * Math.sin(ca), lerp(29, 47, rise), c[2] + R * 1.3 * Math.cos(ca)]} frame={frame} wing="glide" yaw={yawOf(ca)} bank={-22} /> : null}
						</group>
					)
				}
				overlay={() => (
					<AbsoluteFill>
						{flash && frame > soared ? <Big text="IT SOARED" x={960} y={860} size={90} frame={frame} at={soared + 2} /> : null}
						{!flash && frame > sunny && frame < spread ? <Label text="WARM AIR RISING" x={960} y={210} frame={frame} at={sunny + 8} size={50} color={UI.orange} /> : null}
						{circling && frame > carry ? <Label text="ZERO FLAPPING" x={960} y={860} frame={frame} at={carry + 20} size={50} color={UI.green} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={sunny} volume={0.3} />
			<Sound name="chime" at={spread + 10} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- condor

export const Condor: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const year = cue(l0, 'In twenty twenty');
	const trackers = cue(l0, 'fitted them');
	const one = cue(l0, 'found they flap');
	const bird = cue(l0, 'One flew');
	const km = cue(l0, 'a hundred and seventy');
	const x = lerp(-6, 6, span(frame, 0, dur, (v) => v));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, year - 4, trackers - 4, one - 4, bird - 4]}
				angles={[
					{at: [x, 12, 0], dist: 9, yaw: 30, pitch: 6, fov: 42, ddist: 0},
					{at: [x, 12, 0], dist: 7, yaw: -35, pitch: 10, fov: 40, ddist: 0},
					{at: [x, 12.4, 0], dist: 3.2, yaw: 160, pitch: 30, fov: 38, ddist: 0},
					{at: [x, 12, 0], dist: 10, yaw: 60, pitch: 4, fov: 44, ddist: 0},
					{at: [x, 14, 0], dist: 40, yaw: 20, pitch: 10, fov: 46, dyaw: 20},
				]}
				light={LIGHT.andes}
				bg={BG.andes}
				far={
					<group>
						<Ground color="#B8A47A" size={400} />
						<Mountains3D peaks={[{at: [-50, -90], h: 70}, {at: [10, -120], h: 90}, {at: [70, -100], h: 75}, {at: [-100, -60], h: 50}]} rock="#8A7AA8" />
					</group>
				}
				near={<Bird3D kind="condor" at={[x, 12, 0]} frame={frame} wing="glide" tracker={frame > trackers - 4} yaw={90} bank={Math.sin(frame * 0.03) * 10} s={1.4} />}
				overlay={() => (
					<AbsoluteFill>
						<Label text="ANDEAN CONDOR" x={960} y={200} frame={frame} at={8} size={50} color={UI.cream} until={year - 4} />
						{frame > trackers ? <Label text="TRACKED · 2020" x={960} y={200} frame={frame} at={trackers + 8} size={46} color={UI.yellow} until={bird - 4} /> : null}
						{frame > one && frame < bird ? (
							<Bars
								items={[
									{label: 'FLAPPING', value: 0.01, color: UI.red, note: '≈ 1%'},
									{label: 'SOARING', value: 0.99, color: UI.green, note: '≈ 99%'},
								]}
								x={360}
								y={760}
								w={1200}
								frame={frame}
								at={one + 4}
							/>
						) : null}
						{frame > bird ? <Label text="ONE BIRD: OVER 5 HOURS WITHOUT A FLAP" x={960} y={200} frame={frame} at={bird + 4} size={46} color={UI.cream} /> : null}
						{frame > km ? <Count from={0} to={172} x={960} y={860} size={110} frame={frame} at={km + 2} dur={40} suffix=" KM" /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={trackers + 8} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- vee

/** Swirling air coming off a wingtip, trailing behind it. */
const Vortex: React.FC<{at: V3; frame: number; side: 1 | -1; len?: number; color?: string}> = ({at, frame, side, len = 3.5, color = '#BFF4FF'}) => (
	<group position={at}>
		{[...Array(18)].map((_, i) => {
			const t = i / 18;
			const a = frame * 0.3 * side + i * 0.9;
			const r = 0.12 + t * 0.25;
			return <Glow key={i} shape={{kind: 'sphere', r: 0.045, seg: 6}} color={color} position={[Math.cos(a) * r, Math.sin(a) * r, -t * len]} opacity={0.85 * (1 - t)} />;
		})}
	</group>
);

const VEE_S = 1.6;
const GAP = 2.0;

export const VeeScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const home = cue(l0, 'Towards home');
	const tuck = cue(l0, 'You tuck in');
	const easier = cue(l0, 'and suddenly');
	const riding = cue(l0, 'Every bird');
	const ibis = l1.a;
	const last = veeSpot(7, GAP);
	const join = span(frame, tuck - 4, tuck + 30);
	const hp: V3 = [lerp(last[0] * VEE_S - 6, last[0] * VEE_S, join), lerp(last[1] * VEE_S + 4, last[1] * VEE_S, join), lerp(last[2] * VEE_S - 6, last[2] * VEE_S, join)];
	const ibisShot = frame >= ibis - 4;
	const showSwirl = frame > riding - 4 && !ibisShot;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, home - 4, tuck - 4, easier - 4, riding - 4, ibis - 4]}
				angles={[
					{at: [0, 30, 3], dist: 13, yaw: 210, pitch: 12, fov: 46},
					{at: [0, 24, -40], dist: 44, yaw: 8, pitch: 6, fov: 46},
					{at: [hp[0], 30 + hp[1], hp[2]], dist: 9, yaw: 230, pitch: 10, fov: 42, ddist: 0, dyaw: 0},
					{at: [hp[0] + 1, 30.3, hp[2]], dist: 4, yaw: 120, pitch: 6, fov: 38},
					{at: [-2, 30, -2], dist: 9, yaw: 150, pitch: 30, fov: 44},
					{at: [0, 30, -3], dist: 10, yaw: 90, pitch: 4, fov: 42},
				]}
				light={LIGHT.sunset}
				bg={BG.sunset}
				far={
					<group>
						<Fields3D dusk seed={6} />
						<Sun3D at={[-60, 30, 160]} r={12} color="#FFC070" />
						{frame > home - 4 && frame < tuck - 4 ? (
							<group position={[0, 0, -105]}>
								<Town3D size={96} seed={5} night cars={false} />
							</group>
						) : null}
					</group>
				}
				near={
					ibisShot ? (
						<Vee kind="ibis" at={[0, 30, 0]} frame={frame} n={3} gap={GAP} s={1.3} yaw={180} sync />
					) : (
						<group position={[0, 30, 0]} rotation={[0, Math.PI, 0]}>
							<Vee at={[0, 0, 0]} frame={frame} n={4} gap={GAP} s={VEE_S} skip={[7]} />
							<Flyer at={hp} pitch={80} frame={frame} pose="glide" face={join > 0.9 ? 'happy' : 'determined'} />
							{showSwirl
								? [0, 1, 2, 3, 4, 5, 6].map((i) => {
										const p = veeSpot(i, GAP);
										const k = Math.ceil(i / 2);
										const wing = 0.78 * VEE_S;
										return [-1, 1].map((sd) => (sd === -1 && (i % 2 === 1 || i === 0)) || (sd === 1 && (i % 2 === 0)) ? <Vortex key={`${i}${sd}`} at={[p[0] * VEE_S + sd * wing, p[1] * VEE_S, p[2] * VEE_S - 0.2]} frame={frame} side={sd as 1 | -1} len={3 + k * 0.1} /> : null);
									})
								: null}
						</group>
					)
				}
				overlay={() => (
					<AbsoluteFill>
						{frame > home && frame < tuck - 4 ? <Label text="HOME IS THAT WAY" x={960} y={210} frame={frame} at={home + 2} size={48} color={UI.yellow} /> : null}
						{frame > easier && frame < riding - 4 ? <Label text="SUDDENLY: EASIER" x={960} y={860} frame={frame} at={easier + 6} size={50} color={UI.green} /> : null}
						{showSwirl ? <Label text="RISING AIR OFF EACH WINGTIP" x={960} y={860} frame={frame} at={riding + 6} size={48} color={UI.cyan} /> : null}
						{ibisShot ? <Label text="IBISES TIME THEIR WINGBEATS · 2014" x={960} y={200} frame={frame} at={ibis + 4} size={48} color={UI.yellow} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={tuck} volume={0.35} />
			<Sound name="chime" at={easier + 6} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- turns

export const Turns: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const take = cue(l0, 'So the birds take');
	const leader = cue(l0, 'When the leader');
	const your = cue(l0, "So when it's your");
	const lead = cue(l0, 'and you lead');
	// The old leader drifts back to the end of the right arm; bird 1 moves up to the front.
	const swap = span(frame, leader, leader + 50);
	const front = veeSpot(0, GAP);
	const endR = veeSpot(8, GAP);
	const one = veeSpot(1, GAP);
	const mix = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t) + Math.sin(t * Math.PI) * 0.6, lerp(a[2], b[2], t)];
	// Then you (at the end of the left arm) fly to the front, and the bird there drops into your place.
	const you = span(frame, your, your + 50);
	const last = veeSpot(7, GAP);
	const moved: Record<number, V3> = {};
	if (frame < your) {
		moved[0] = mix(front, [endR[0] + 1.6, endR[1], endR[2] - 1.5], swap);
		moved[1] = mix(one, front, swap);
	} else {
		moved[0] = [endR[0] + 1.6, endR[1], endR[2] - 1.5];
		moved[1] = mix(front, last, you);
	}
	const hp = mix(last, [0, 0, 0.4], you);
	const town = frame > lead - 10;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, take - 4, leader - 4, your - 4, lead - 4]}
				angles={[
					{at: [0, 30.3, -1], dist: 9, yaw: 200, pitch: 8, fov: 40},
					{at: [0, 30, -3], dist: 22, yaw: 160, pitch: 40, fov: 44},
					{at: [0, 30, -3], dist: 20, yaw: 120, pitch: 30, fov: 44},
					{at: [0, 30, -3], dist: 18, yaw: 220, pitch: 25, fov: 44},
					{at: [0, 28, -16], dist: 24, yaw: 15, pitch: 9, fov: 46, dyaw: -10},
				]}
				light={LIGHT.dusk}
				bg={BG.dusk}
				far={
					<group>
						<Fields3D dusk seed={6} />
						{town ? (
							<group position={[0, 0, -105]}>
								<Town3D size={128} seed={7} night cars={false} />
							</group>
						) : null}
					</group>
				}
				near={
					<group position={[0, 30, 0]} rotation={[0, Math.PI, 0]}>
						<Vee at={[0, 0, 0]} frame={frame} n={4} gap={GAP} s={VEE_S} skip={[7]} moved={moved} />
						<Flyer at={[hp[0] * VEE_S, hp[1] * VEE_S, hp[2] * VEE_S]} pitch={80} frame={frame} pose={you > 0.95 ? 'super' : 'glide'} face={frame > your ? 'happy' : 'determined'} />
					</group>
				}
				overlay={() => (
					<AbsoluteFill>
						{frame < take ? <Label text="FRONT: THE HARDEST SPOT" x={960} y={210} frame={frame} at={10} size={48} color={UI.red} /> : null}
						{frame > take ? <Label text="IBISES TAKE TURNS AT THE FRONT · 2015" x={960} y={210} frame={frame} at={take + 4} size={44} color={UI.yellow} until={your - 4} /> : null}
						{frame > your && frame < lead ? <Big text="YOUR TURN" x={960} y={860} size={90} frame={frame} at={your + 8} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="swish" at={leader + 10} volume={0.3} />
			<Sound name="whoosh" at={your + 6} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- home

export const Home: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const lights = cue(l0, 'just as the');
	const land = cue(l0, 'You land');
	const door = cue(l0, 'and your mum');
	const where = cue(l0, 'Where have you');
	const hug = cue(l0, 'And then she');
	const street = frame >= land - 4;
	const on = frame > lights + 6;
	const ly = track(frame, [[land - 4, 6], [land + 20, 0]]);
	const open = span(frame, door, door + 12);
	const mumIn = span(frame, door + 4, door + 20);
	const hugT = span(frame, hug, hug + 14);
	const mum: V3 = [lerp(0, 0, mumIn), 0.2, lerp(3.6, lerp(4.4, 5.0, hugT), mumIn)];
	const hero: V3 = [0, 0.2, 5.8];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, lights - 4, land - 4, door - 4, where - 4, hug - 4]}
				angles={[
					{at: [0, 20, 0], dist: 40, yaw: 30, pitch: 40, fov: 46},
					{at: [0, 3, 6], dist: 26, yaw: 20, pitch: 18, fov: 46},
					{at: [0, 2.4, 5], dist: 12, yaw: 15, pitch: 6, fov: 42},
					{at: [0, 1.5, 4.6], dist: 6, yaw: 25, pitch: 4, fov: 38},
					{at: [0, 1.5, 4.8], dist: 4.2, yaw: 70, pitch: 4, fov: 36},
					{at: [0, 1.3, 5.4], dist: 4, yaw: 40, pitch: 6, fov: 34, ddist: -0.4},
				]}
				light={LIGHT.evening}
				bg={BG.evening}
				far={
					<group>
						<Town3D frame={frame} night lit={on} clear={[{at: [0, 0], r: 14}]} cars={false} />
						<Ground color="#4A6A5A" size={28} />
						<House night lit={on} door={street ? open : 0} />
						{[-6, 6].map((x) => (
							<StreetLamp3 key={x} at={[x, 0, 9]} on={on} />
						))}
					</group>
				}
				near={
					street ? (
						<group>
							{frame > land + 18 ? (
								<Hero3D position={hero} turn={Math.PI} face={frame > hug ? 'happy' : 'sad'} armL={frame > hug ? [70, 90] : undefined} armR={frame > hug ? [70, 90] : undefined} reachL={frame > hug ? 70 : 0} reachR={frame > hug ? 70 : 0} />
							) : (
								<Flyer at={[hero[0], ly + 0.85 + 0.2, hero[2]]} pitch={track(frame, [[land - 4, 40], [land + 16, 0]])} yaw={180} frame={frame} pose="float" face="happy" />
							)}
							{frame > door ? <Hero3D who={P5.mum} position={mum} face={frame > hug ? 'happy' : 'shocked'} armL={mixArm([12, 6], [75, 95], hugT)} armR={mixArm([12, 6], [75, 95], hugT)} reachL={70 * hugT} reachR={70 * hugT} blink={frame > hug + 10 ? 1 : undefined} /> : null}
						</group>
					) : (
						<group>
							<Vee at={[lerp(-10, 40, span(frame, 0, land, (v) => v)), 16, -6]} frame={frame} n={3} gap={GAP} s={1.4} yaw={90} />
							<Flyer at={[lerp(-8, 2, span(frame, 0, land)), lerp(14, 5, span(frame, 0, land)), lerp(-4, 5, span(frame, 0, land))]} pitch={60} yaw={30} frame={frame} pose="float" face="happy" />
						</group>
					)
				}
				overlay={(cam) => <Says cam={cam} head={top(mum[0], mum[2], 0.2)} text="Where have you BEEN?!" frame={frame} at={where + 2} until={hug - 4} />}
			/>
			<Sound name="pop" at={lights + 6} volume={0.25} />
			<Sound name="thud" at={land + 18} volume={0.25} />
			<Sound name="pop" at={door} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- night

export const Night: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const flew = cue(l0, 'You flew higher');
	const turns = cue(l0, 'Turns out');
	const ride = cue(l0, 'They ride');
	const follow = cue(l0, 'They follow');
	const take = cue(l0, 'And they take');
	const outside = cue(l0, 'Outside your');
	const sky = frame >= outside - 4;
	const vx = lerp(0, 45, span(frame, outside, dur, (v) => v));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, flew - 4, turns - 4, outside - 4]}
				angles={
					sky
						? [{at: [50, 70, -150], dist: 181, yaw: -17, pitch: -22, fov: 30, ddist: 0, dyaw: 0}]
						: [
								{at: [-1, 1.0, -2.4], dist: 4.2, yaw: 30, pitch: 34, fov: 38},
								{at: [-1, 0.9, -3.0], dist: 2.2, yaw: 20, pitch: 50, fov: 34},
								{at: [-0.4, 1.4, -2.4], dist: 6.5, yaw: 15, pitch: 14, fov: 40},
							]
				}
				light={LIGHT.night}
				bg={sky ? BG.night : BG.bedroom}
				blur={sky ? 0 : 2.5}
				far={
					sky ? (
						<group>
							<NightSky3D frame={frame} />
						</group>
					) : (
						<Bedroom night />
					)
				}
				near={
					sky ? (
						<Vee at={[vx, 33, -66]} frame={frame} n={4} gap={GAP} s={2.6} yaw={90} />
					) : (
						<group>
							<group position={[-1, 0.66, -1.65]} rotation={[-Math.PI / 2, 0, 0]}>
								<Hero3D face="happy" armL={[30, 20]} armR={[30, 20]} blink={frame > take + 10 ? 1 : undefined} look={[0.3, 0.3]} />
							</group>
							<T shape={{kind: 'box', w: 1.16, h: 0.16, d: 1.3}} color="#FF8A3D" position={[-1, 0.8, -2.25]} outline={0.015} />
						</group>
					)
				}
				overlay={() => (
					<AbsoluteFill>
						{!sky && frame > ride ? <Label text="RIDE THE WARM AIR" x={450} y={860} frame={frame} at={ride} size={42} color={UI.orange} /> : null}
						{!sky && frame > follow ? <Label text="FOLLOW EACH OTHER" x={960} y={860} frame={frame} at={follow} size={42} color={UI.cyan} /> : null}
						{!sky && frame > take ? <Label text="TAKE TURNS" x={1480} y={860} frame={frame} at={take} size={42} color={UI.green} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={take} volume={0.2} />
		</>
	);
};

// ---------------------------------------------------------------- twist

const Binoculars: React.FC<{at: V3; turn: number}> = ({at, turn}) => (
	<group position={at} rotation={[0, turn, 0]}>
		{[-0.06, 0.06].map((x) => (
			<T key={x} shape={{kind: 'cyl', r: 0.045, h: 0.16}} color="#2A2638" position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.008} />
		))}
	</group>
);

const WATCHERS: Array<{who: keyof typeof P5; p: V3; turn: number}> = [
	{who: 'w1', p: [-3.4, 0, 9.5], turn: Math.PI - 0.3},
	{who: 'w2', p: [-1.6, 0, 10.6], turn: Math.PI - 0.1},
	{who: 'w3', p: [0.6, 0, 9.8], turn: Math.PI},
	{who: 'w4', p: [2.4, 0, 10.8], turn: Math.PI + 0.15},
	{who: 'w5', p: [4.2, 0, 9.6], turn: Math.PI + 0.35},
	{who: 'kid3', p: [-5.4, 0, 11], turn: Math.PI - 0.4},
	{who: 'kid2', p: [6.2, 0, 11.2], turn: Math.PI + 0.45},
	{who: 'w2', p: [-0.4, 0, 12.2], turn: Math.PI},
	{who: 'w1', p: [3.4, 0, 12.4], turn: Math.PI + 0.2},
];

const Paper: React.FC<{frame: number; at: number; until: number}> = ({frame, at, until}) => {
	const p = span(frame, at, at + 14) * (1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{background: `rgba(10,6,30,${0.5 * p})`}}>
			<div style={{position: 'absolute', left: 960, top: 540, width: 760, transform: `translate(-50%, -50%) rotate(${-4 + 10 * (1 - p)}deg) scale(${0.6 + 0.4 * p})`, opacity: p, background: '#F4F0E6', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', padding: '30px 40px', fontFamily: 'Georgia, serif', color: '#1A1420'}}>
				<div style={{fontSize: 56, fontWeight: 700, textAlign: 'center', letterSpacing: 2, borderBottom: '4px solid #1A1420', paddingBottom: 10}}>THE MORNING POST</div>
				<div style={{fontSize: 62, fontWeight: 700, lineHeight: 1.05, marginTop: 20, textAlign: 'center'}}>RARE GIANT ORANGE BIRD SEEN WITH GEESE</div>
				<svg viewBox="0 0 680 230" width={680} height={230} style={{display: 'block', marginTop: 18, background: '#C8D0DC'}}>
					{[0, 1, 2, 3, 4, 5].map((i) => {
						const k = Math.ceil(i / 2);
						const s = i % 2 ? -1 : 1;
						const x = 300 + (i === 0 ? 0 : s * k * 60);
						const y = 80 + k * 30;
						return <path key={i} d={`M${x - 26} ${y} q13 -14 26 0 q13 -14 26 0`} stroke="#2A2638" strokeWidth={6} fill="none" />;
					})}
					<circle cx={500} cy={170} r={18} fill="#FF8A3D" stroke="#2A2638" strokeWidth={4} />
					<path d="M470 190 l60 0" stroke="#5A3AA8" strokeWidth={14} />
					<text x={540} y={140} fontFamily={FONT} fontSize={30} fill="#E8453C" fontWeight={700}>
						?!
					</text>
				</svg>
				<div style={{fontSize: 24, marginTop: 12, fontStyle: 'italic', textAlign: 'center'}}>Bird watchers flock to quiet street</div>
			</div>
		</AbsoluteFill>
	);
};

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const last = cue(l0, 'Last night');
	const every = cue(l0, 'and now every');
	const hood = l1.a;
	const out = frame >= hood - 10;
	const hoodUp = frame > hood + 12;
	const raise = span(frame, hood + 2, hood + 12) * (1 - span(frame, hood + 16, hood + 26));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, last - 4, every - 4, hood - 10]}
				angles={[
					{at: [0, 2.4, 9], dist: 16, yaw: 25, pitch: 10, fov: 44},
					{at: [0, 2.4, 9], dist: 16, yaw: 25, pitch: 10, fov: 44},
					{at: [0.6, 1.5, 10.5], dist: 6, yaw: 200, pitch: 6, fov: 40},
					{at: [0, 1.25, 5.8], dist: 3.2, yaw: 10, pitch: 4, fov: 34},
				]}
				light={LIGHT.morning}
				bg={BG.morning}
				far={
					<group>
						<Street3 />
						<Ground color="#8ED46A" size={18} />
						<House />
					</group>
				}
				near={
					<group>
						{WATCHERS.map((w, i) => {
							const turn = out ? w.turn : w.turn + Math.sin(frame * 0.03 + i) * 0.2;
							const h = headAt(w.p);
							return (
								<group key={i}>
									<Hero3D who={P5[w.who]} position={w.p} turn={turn} armL={[25, -65]} armR={[25, -65]} reachL={130} reachR={130} face={out ? 'shocked' : 'neutral'} look={[0, 0.3]} lite />
									<Binoculars at={[h[0] + Math.sin(turn) * 0.36, h[1] + 0.02, h[2] + Math.cos(turn) * 0.36]} turn={turn} />
								</group>
							);
						})}
						{out ? <Hero3D position={[0, 0.2, 5.8]} face={hoodUp ? 'smug' : 'shocked'} hood={hoodUp} armL={mixArm([12, 6], [165, 175], raise)} armR={mixArm([12, 6], [165, 175], raise)} /> : null}
					</group>
				}
				overlay={() => <Paper frame={frame} at={last + 4} until={every + 30} />}
			/>
			<Sound name="shutter" at={every + 40} volume={0.3} />
			<Sound name="swish" at={hood + 8} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const options = cue(l0, 'Above the clouds');
	const comments = cue(l0, 'Tell us');
	const sub = cue(l0, 'subscribe');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0]}
				angles={[{at: [0, 0.2, 0], dist: 5.5, yaw: 40, pitch: 8, fov: 38, dyaw: 30, ddist: -0.5}]}
				light={LIGHT.sunset}
				bg={BG.sunset}
				far={
					<group>
						<CloudSea y={-14} />
						<Sun3D at={[-80, 10, -160]} r={12} color="#FFD07A" />
					</group>
				}
				near={<Flyer at={[0, 0, 0]} frame={frame} face="happy" />}
				overlay={() => (
					<AbsoluteFill style={{fontFamily: FONT}}>
						<Big text="WOULD YOU?" x={960} y={220} size={110} frame={frame} at={8} />
						{frame > options ? <Label text="CLOUDS · MOUNTAINS · OR SCHOOL?" x={960} y={370} frame={frame} at={options} size={48} color={UI.cream} /> : null}
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

void rad;
void Box;
