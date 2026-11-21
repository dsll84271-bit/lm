import React from 'react';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Hero3D} from '../../../three/Hero3D';
import {Balloons3D, Gift3D} from '../../../three/props3d';
import {Audience3D, Cake3D, CanvasPlane, DogBowl3D, Fridge3D, GhostDog3D, Lockers3D, Mic3D, PartyHat3D, Plate3D, Sausage3D, Stage3D} from '../../../three/props3d2';
import {Box, Chair3, Counter3, Desk3, Plant3, Room3, ROOM3, Screen3} from '../../../three/sets3d';
import {project} from '../../../three/Stage3D';
import {C, M, Shot3, Says, Thought, W, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Flash, HeartMonitor, PhotoFrame, SignUp, Vignette} from './hud';
import {BG, LIGHT, P3} from './kit';
import {handAt, headAt, mixArm, mouthAt, top, type V3} from './util';

// Part C: the cost of being unseen, the school show, and the twist.

// ---------------------------------------------------------------- the corridor

const Corridor: React.FC<{board?: boolean}> = ({board = false}) => (
	<Room3 look={{wall: '#7FB8D8', floor: '#C9C2B0', trim: '#FFFFFF'}} w={18} d={6} h={4}>
		{board ? (
			<group>
				<Lockers3D at={[-5.2, 0, -2.75]} n={8} />
				<Lockers3D at={[5.2, 0, -2.75]} n={8} />
				<Box size={[3.2, 1.8, 0.06]} at={[0, 1.75, -2.94]} color="#C9925A" />
				{[...Array(9)].map((_, i) => (
					<Box key={i} size={[0.5, 0.62, 0.01]} at={[-1.1 + (i % 4) * 0.72, 1.4 + Math.floor(i / 4) * 0.7, -2.9]} rot={[0, 0, ((i * 7) % 5) * 0.04 - 0.08]} color={['#FFFDF6', '#FFD84A', '#7FE0FF', '#FF8AD8', '#7CF2A0'][i % 5]} outline={0.004} />
				))}
			</group>
		) : (
			<Lockers3D at={[0, 0, -2.75]} n={26} />
		)}
	</Room3>
);

// ---------------------------------------------------------------- habit

export const Habit: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const asks = cue(l0, 'Nobody asks');
	const picks = cue(l0, 'Nobody picks');
	const looks = cue(l0, 'Nobody looks');
	const bump = cue(l0, 'Everybody bumps');
	const you: V3 = [0, 0, -1.2];
	const hit = bump + 6;
	const bx = frame < hit ? lerp(-5.5, -0.5, span(frame, hit - 70, hit, (t) => t)) : lerp(-0.5, -0.9, span(frame, hit, hit + 10));
	const walkers = [...Array(8)].map((_, i) => {
		const dir = i % 2 ? 1 : -1;
		const speed = 0.028 + (i % 3) * 0.006;
		const x = (((frame * speed + i * 2.3) % 18) - 9) * dir;
		const z = i % 2 ? -2.2 : -1.8;
		return <Hero3D key={i} who={P3.extras[i]} position={[x, 0, z]} turn={dir * (Math.PI / 2)} walk={frame / 14 + i * 0.3} face={i % 3 ? 'neutral' : 'happy'} lite />;
	});
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -1.2, 8.4, 0, 10), {at: [0, 1.15, -1.2], dist: 3.6, yaw: -14, pitch: 5}, C(0, -1.2, 18), {at: [-0.3, 1.1, -1.2], dist: 4.2, yaw: 24, pitch: 6}]}
				light={LIGHT.day}
				bg={BG.room}
				far={<Corridor />}
				near={
					<group>
						{walkers}
						<Hero3D who={P3.extras[6]} position={[bx, 0, -1.2]} turn={Math.PI / 2} walk={frame < hit ? frame / 13 : undefined} lean={frame >= hit && frame < hit + 30 ? -14 : 0} face={frame >= hit ? 'shocked' : 'neutral'} />
						<Hero3D position={you} turn={frame >= hit ? -0.3 : 0.2} ghost={1} face={frame >= hit ? 'shocked' : 'sad'} tilt={frame >= hit && frame < hit + 14 ? -12 : 0} look={[-0.3, 0.3]} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Big text="WEEK 3" x={960} y={240} size={90} frame={frame} at={4} until={asks - 6} color={UI.cyan} />
						<Label text="NO QUESTIONS" x={420} y={230} frame={frame} at={asks} until={bump + 30} size={40} />
						<Label text="NOT PICKED" x={420} y={320} frame={frame} at={picks} until={bump + 30} size={40} />
						<Label text="NOT SEEN" x={420} y={410} frame={frame} at={looks} until={bump + 30} size={40} />
						<Says cam={cam} head={top(bx, -1.2)} text="Oof! ...Sorry?" frame={frame} at={hit + 4} />
					</>
				)}
			/>
			<Sound name="thud" at={hit} volume={0.5} />
			<Sound name="pop" at={hit + 4} volume={0.35} />
			<Sound name="steps" at={0} volume={0.18} loop={dur} />
		</>
	);
};

// ---------------------------------------------------------------- seat

export const Seat: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const seat = cue(l0, "someone's sitting");
	const shrug = cue(l0, 'shrugs');
	const ages = cue(l0, "Haven't seen");
	const behind = cue(l0, "You're standing");
	const you: V3 = [0.95, 0, -3.1];
	const trayArm: [number, number] = [20, 70];
	const tray = handAt(you, 0, trayArm, 70, 1);
	const sh = span(frame, shrug - 4, shrug + 8) * (1 - span(frame, ages + 30, ages + 44));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0.2, -2.4, 6.4, 0, 10), {at: [-0.6, 1.3, -2.6], dist: 2.4, yaw: 8, pitch: 4, fov: 32}, {at: [0.65, 1.45, -2.85], dist: 3.0, pitch: 6, yaw: -6}, {at: [0.95, 1.4, -3.1], dist: 2.6, pitch: 8, yaw: 4, fov: 32}]}
				light={LIGHT.day}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.lunch} window={{x: -3, w: 2.4}}>
						<Desk3 at={[0, 0, -2.0]} w={3.4} d={0.9} color="#E8D8C0" />
						{[-1.2, -0.6, 0.3, 1.6].map((x) => (
							<Chair3 key={x} at={[x, 0, -2.65]} color="#FF8A3D" />
						))}
						<Plant3 at={[5, 0, -3.6]} />
					</Room3>
				}
				near={
					<group>
						<Hero3D who={P3.friend2} position={[-1.2, 0.46, -2.6]} sit face="happy" armL={[20, 60]} reachL={50} armR={[20, 60]} reachR={50} lite />
						<Hero3D who={P3.friend3} position={[-0.6, 0.46, -2.6]} sit face="neutral" armR={[20, 60 + Math.sin(frame * 0.3) * 20]} reachR={60} armL={[20, 60]} reachL={50} />
						<Hero3D who={P3.friend} position={[0.3, 0.46, -2.6]} sit face={frame > shrug ? 'neutral' : 'happy'} armL={mixArm([20, 60], [50, 120], sh)} armR={mixArm([20, 60], [50, 120], sh)} reachL={lerp(50, 10, sh)} reachR={lerp(50, 10, sh)} talk={frame > ages && frame < ages + 40 ? 0.5 : 0} />
						<Hero3D who={P3.extras[2]} position={[1.6, 0.46, -2.6]} sit face="happy" armL={[20, 60]} reachL={50} armR={[20, 60]} reachR={50} lite />
						{[-1.2, -0.6, 0.3, 1.6].map((x) => (
							<Box key={x} size={[0.36, 0.03, 0.26]} at={[x, 0.79, -1.9]} color="#C9CED8" />
						))}
						<Hero3D position={you} ghost={1} face="sad" armR={trayArm} reachR={70} armL={[20, 70]} reachL={70} look={[0, 0.5]} />
						<group position={[you[0], tray[1] - 0.02, tray[2] + 0.05]}>
							<Box size={[0.62, 0.03, 0.4]} at={[0, 0, 0]} color="#3FB7E8" />
							<T shape={{kind: 'cyl', r: 0.13, h: 0.02}} color="#FFFFFF" position={[-0.08, 0.025, 0]} outline={0.004} />
							<T shape={{kind: 'cyl', r: 0.04, h: 0.1}} color="#E8453C" position={[0.18, 0.06, 0.06]} outline={0.004} />
						</group>
					</group>
				}
				overlay={(cam) => {
					const [sx, sy] = project(cam, [-0.6, 2.05, -2.6]);
					return (
						<>
							{frame >= seat && frame < shrug + 10 ? <Label text="YOUR SEAT ↓" x={sx} y={sy} frame={frame} at={seat} size={38} color={UI.yellow} /> : null}
							<Says cam={cam} head={top(0.3, -2.6, 0.46, true)} text="Haven't seen them in ages." frame={frame} at={ages} />
						</>
					);
				}}
			/>
			<Sound name="pop" at={ages} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- photos

export const Photos: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const squeeze = cue(l0, 'squeezes in');
	const flash = cue(l0, 'Flash');
	const ff = Math.min(frame, flash);
	const sq = span(ff, squeeze - 4, squeeze + 18);
	const xs = [-1.7, -0.85, 0, 0.85, 1.7].map((x) => x * lerp(1.35, 1, sq));
	const who = [P3.friend2, P3.friend, null, P3.friend3, P3.extras[1]];
	const hats = ['#3FB7E8', '#FFD84A', '#FF4FD8', '#7CF2A0', '#E8453C'];
	const z = -1.7;
	return (
		<>
			<Shot3
				frame={ff}
				dur={dur}
				lines={lines}
				cuts={[0, squeeze - 6, flash]}
				angles={[W(0, -1.8, 7, -8, 10), {at: [0, 1.3, z], dist: 4.6, yaw: 12, pitch: 4}, {at: [0, 1.32, z], dist: 4.4, pitch: 2, dyaw: 0, ddist: -0.4}]}
				light={LIGHT.warm}
				bg={BG.room}
				far={
					<Room3 look={{wall: '#C86AA8', floor: '#8A5A7A', trim: '#FFD84A'}}>
						<Balloons3D at={[-3.6, 0, -3.8]} frame={ff} />
						<Balloons3D at={[3.4, 0, -3.8]} frame={ff + 30} />
						{[...Array(16)].map((_, i) => (
							<T key={i} shape={{kind: 'cone', r: 0.12, h: 0.26}} color={hats[i % 5]} position={[-4.5 + i * 0.6, 3.1 - Math.sin((i / 15) * Math.PI) * 0.4, -4.3]} rotation={[0, 0, Math.PI]} outline={0.006} />
						))}
						<Desk3 at={[0, 0, -3.4]} w={2.4} d={0.8} color="#FFFDF6" />
						<Cake3D at={[0, 0.78, -3.4]} frame={ff} />
						<Gift3D at={[-0.9, 0.78, -3.4]} />
						<Gift3D at={[0.9, 0.78, -3.4]} open={0} />
						<CanvasPlane w={2.6} h={0.5} px={650} dep="bday" position={[0, 3.55, -4.36]} draw={(ctx, W2, H) => {
							ctx.fillStyle = '#FFD84A';
							ctx.font = `bold ${H * 0.7}px Fredoka, sans-serif`;
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillText('HAPPY BIRTHDAY!', W2 / 2, H * 0.55);
						}} />
					</Room3>
				}
				near={
					<group>
						{xs.map((x, i) => {
							const w = who[i];
							const pos: V3 = [x, 0, z + (i % 2) * 0.1];
							const h = headAt(pos);
							return (
								<group key={i}>
									{w ? <Hero3D who={w} position={pos} turn={-x * 0.08} face="happy" armL={i === 0 ? [140, 170] : [40, 80]} armR={i === 4 ? [140, 170] : [40, 80]} /> : <Hero3D position={pos} ghost={1} face="happy" />}
									<PartyHat3D at={[h[0], h[1] + 0.26, h[2]]} color={hats[i]} tilt={((i % 3) - 1) * 0.15} />
								</group>
							);
						})}
					</group>
				}
				overlay={(cam) => {
					const [hx, hy] = project(cam, [0, 1.8, z]);
					const p = span(frame, l1.a, l1.a + 10);
					return (
						<>
							<Flash frame={frame} at={flash} />
							<PhotoFrame frame={frame} at={flash + 4} caption="HAPPY BIRTHDAY!" />
							{p > 0 ? <div style={{position: 'absolute', left: hx - 110, top: hy - 110, width: 220, height: 220, borderRadius: '50%', border: `7px dashed ${UI.red}`, opacity: p}} /> : null}
							<Label text="CAMERAS NEED LIGHT TOO" x={960} y={200} frame={frame} at={l1.a + 4} size={44} color={UI.yellow} />
						</>
					);
				}}
			/>
			<Sound name="shutter" at={flash} volume={0.6} />
		</>
	);
};

// ---------------------------------------------------------------- show

export const Show: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const remember = cue(l0, 'Then you remember');
	const name = cue(l0, 'put your name');
	const singing = cue(l0, 'Singing');
	const friday = cue(l0, 'On Friday');
	const everyone = cue(l0, 'In front of everyone');
	const you: V3 = [1.0, 0, -1.6];
	const turned = frame > friday - 4;
	const sheetOut = span(frame, friday - 4, friday + 6);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, name - 6, friday - 4, everyone - 4]}
				angles={[W(0.4, -1.8, 6, -8, 8), {at: [0, 1.7, -2.9], dist: 3.2, pitch: 2}, C(1.0, -1.6, -20), {at: [1.0, 1.3, -1.6], dist: 1.6, yaw: -24, pitch: 2, fov: 30}]}
				light={LIGHT.day}
				bg={BG.room}
				far={<Corridor board />}
				near={<Hero3D position={you} turn={turned ? -0.4 : Math.PI + 0.35} ghost={1} face={frame > singing ? 'scared' : frame > remember ? 'shocked' : 'neutral'} look={turned ? [0, 0] : [0, -0.3]} />}
				overlay={() => (
					<>
						{sheetOut < 1 ? (
							<div style={{position: 'absolute', inset: 0, opacity: 1 - sheetOut}}>
								<SignUp frame={frame} at={name} circleAt={singing} />
							</div>
						) : null}
						<Big text="FRIDAY." x={960} y={240} size={100} frame={frame} at={friday} until={everyone - 2} color={UI.yellow} />
						<Big text="IN FRONT OF EVERYONE." x={960} y={240} size={86} frame={frame} at={everyone} color={UI.red} />
						<Vignette strength={span(frame, everyone, everyone + 20) * 0.8} />
					</>
				)}
			/>
			<Sound name="pop" at={name} volume={0.4} />
			<Sound name="swish" at={singing} volume={0.35} />
			<Sound name="heart" at={everyone} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- nerves (Karolinska, 2015)

const SUBJECT: V3 = [-1.5, 0.46, -1.4];

export const Nerves: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const year = cue(l0, 'two thousand and fifteen');
	const inv = cue(l0, 'bodies were invisible');
	const strangers = cue(l0, 'Then they put');
	const less = cue(l1, 'less stressed');
	const calm = cue(l1, 'Being unseen');
	const tempt = cue(l1, 'tempting');
	const back = frame >= calm - 4;
	const g = span(frame, inv, inv + 18);
	const come = span(frame, strangers, strangers + 24);
	const crowd: Array<[number, number, number]> = [
		[1.1, -2.2, 0],
		[1.5, -1.5, 1],
		[1.2, -0.7, 2],
		[1.9, -2.6, 3],
	];
	const hero: V3 = [4.5, 0, -1.4];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					back
						? [{at: [hero[0], 1.15, hero[2]], dist: 3.6, yaw: -50, pitch: 4}, {at: [hero[0], 1.32, hero[2]], dist: 2.3, yaw: -57, pitch: 3, fov: 30}]
						: [W(0, -1.6, 7.2, 0, 10), {at: [-1.2, 1.45, -1.4], dist: 2.3, yaw: 70, pitch: 4, fov: 30}, {at: [1.4, 1.3, -1.6], dist: 3.4, yaw: -70, pitch: 6}, {at: [0, 1.3, -1.5], dist: 6, yaw: -10, pitch: 8}]
				}
				light={back ? LIGHT.stageDark : LIGHT.lab}
				bg={back ? BG.stage : BG.room}
				far={
					back ? (
						<group>
							<Stage3D spot={[0, -1]} spotOn={0.5} />
							<Box size={[30, 8, 0.2]} at={[0, 4, 14]} color="#1A1240" outline={0} />
						</group>
					) : (
						<Room3 look={ROOM3.lab}>
							<Chair3 at={[SUBJECT[0], 0, SUBJECT[2]]} rot={Math.PI / 2} color="#7F5AF0" />
							<Desk3 at={[-3.6, 0, -3.4]} w={2} d={0.8} color="#C9CED8" />
							<Screen3 at={[-3.6, 1.15, -3.6]} w={0.8} h={0.5} color="#7CF2A0" />
							<Screen3 at={[-2.8, 1.15, -3.6]} w={0.6} h={0.45} color="#7FE0FF" />
							<CanvasPlane w={2.6} h={0.42} px={650} dep="ki" position={[0.5, 3.0, -4.38]} draw={(ctx, W2, H) => {
								ctx.fillStyle = '#2A2350';
								ctx.fillRect(0, 0, W2, H);
								ctx.fillStyle = '#FFF3D6';
								ctx.font = `bold ${H * 0.45}px Fredoka, sans-serif`;
								ctx.textAlign = 'center';
								ctx.textBaseline = 'middle';
								ctx.fillText('BODY ILLUSION LAB', W2 / 2, H * 0.55);
							}} />
						</Room3>
					)
				}
				near={
					back ? (
						<group>
							<Audience3D z0={2.2} frame={frame} rows={8} cols={22} />
							<Hero3D position={hero} turn={-1.0} ghost={1} face="neutral" look={[-0.6, 0]} aura="#C9B8FF" />
						</group>
					) : (
						<group>
							<Hero3D who={P3.extras[3]} position={SUBJECT} sit turn={Math.PI / 2} ghost={g * 0.85} face="neutral" armL={[20, 60]} armR={[20, 60]} reachL={50} reachR={50} />
							<group position={[SUBJECT[0] + 0.25, SUBJECT[1] + 1.0, SUBJECT[2]]}>
								<Box size={[0.2, 0.22, 0.5]} at={[0, 0, 0]} color="#2A2350" />
								<Glow shape={{kind: 'box', w: 0.01, h: 0.12, d: 0.36}} color="#7FE0FF" position={[0.105, 0, 0]} />
								<T shape={{kind: 'torus', r: 0.3, tube: 0.03}} color="#2A2350" position={[-0.2, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0} />
							</group>
							{crowd.map(([x, z, k]) => (
								<Hero3D key={k} who={P3.extras[(k + 4) % 8]} position={[lerp(x + 3, x, come), 0, z]} turn={-Math.PI / 2 + (k - 1.5) * 0.12} face={k % 2 ? 'smug' : 'neutral'} look={[0, 0]} walk={come > 0 && come < 1 ? frame / 12 : undefined} lite />
							))}
							<Hero3D who={P3.scientist} position={[-3.2, 0, -2.6]} turn={0.7} face="neutral" armL={[40, 120]} reachL={40} lite />
						</group>
					)
				}
				overlay={(cam) => (
					<>
						<Label text="KAROLINSKA INSTITUTE · SWEDEN · 2015" x={960} y={230} frame={frame} at={year} until={strangers - 4} size={44} />
						<Label text="A HEADSET MAKES YOUR BODY 'VANISH'" x={960} y={880} frame={frame} at={inv} until={strangers - 4} size={40} color={UI.cyan} />
						<Label text="THEN: A GROUP OF STARING STRANGERS" x={960} y={880} frame={frame} at={strangers + 6} until={l1.a - 4} size={40} color={UI.orange} />
						{!back ? (
							<>
								<HeartMonitor frame={frame} at={l1.a} bpm={110} label="VISIBLE BODY" tag="RACING" x={560} y={300} color={UI.red} />
								<HeartMonitor frame={frame} at={l1.a + 10} bpm={72} label="INVISIBLE BODY" tag="CALMER" x={1360} y={300} color={UI.green} />
								<Label text="SMALLER HEART-RATE RISE · LESS STRESSED" x={960} y={880} frame={frame} at={less} size={40} color={UI.green} />
							</>
						) : (
							<Thought cam={cam} head={top(hero[0], hero[2])} text="Maybe I just... stay like this." frame={frame} at={tempt} size={32} />
						)}
					</>
				)}
			/>
			<Sound name="vanish" at={inv} volume={0.4} />
			<Sound name="steps" at={strangers} volume={0.3} loop={24} />
			<Sound name="heart" at={l1.a} volume={0.4} />
			<Sound name="crowd" at={calm} volume={0.15} />
		</>
	);
};

// ---------------------------------------------------------------- the stage

const SPOT: V3 = [0, 0, -1.0];

const Hall: React.FC<{frame: number; up?: number; clap?: boolean; spot?: number}> = ({frame, up = 0, clap = false, spot = 1}) => (
	<group>
		<Stage3D spot={[SPOT[0], SPOT[2]]} spotOn={spot} />
		<Box size={[30, 8, 0.2]} at={[0, 4, 14]} color="#1A1240" outline={0} />
		{[-1, 1].map((s) => (
			<Box key={s} size={[0.2, 8, 16]} at={[s * 14, 4, 6]} color="#1E1650" outline={0} />
		))}
		<Audience3D z0={2.2} frame={frame} up={up} clap={clap} />
	</group>
);

/** Little music notes floating up from a point (screen overlay). */
const Notes: React.FC<{cam: Parameters<typeof project>[0]; from: V3; frame: number; at: number; until?: number}> = ({cam, from, frame, at, until}) => {
	if (frame < at || (until !== undefined && frame > until)) {
		return null;
	}
	const [x, y] = project(cam, from);
	return (
		<>
			{[0, 1, 2, 3, 4].map((i) => {
				const t = ((frame - at + i * 14) % 70) / 70;
				return (
					<div key={i} style={{position: 'absolute', left: x + 60 + Math.sin(t * 6 + i) * 40 + i * 14, top: y - t * 300, fontSize: 64, color: i % 2 ? UI.yellow : UI.cyan, opacity: Math.sin(t * Math.PI), textShadow: '0 0 16px rgba(255,255,255,0.6)', fontWeight: 700}}>
						{i % 2 ? '♪' : '♫'}
					</div>
				);
			})}
		</>
	);
};

const MIC_ARM: [number, number] = [30, -75];
const MIC_REACH = 110;

export const StageScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const called = cue(l0, 'Your name is called');
	const walk = cue(l0, 'You walk on');
	const sees = cue(l0, 'The audience sees');
	const laughs = cue(l1, 'laughs');
	const dry = cue(l1, 'Your mouth goes dry');
	const could = cue(l1, 'You could just');
	const w = span(frame, walk - 4, sees - 6);
	const you: V3 = [lerp(5, SPOT[0], w), 0, SPOT[2]];
	const arrived = w >= 1;
	const turn = arrived ? 0 : -Math.PI / 2;
	const shake: V3 = [Math.sin(frame * 1.7) * 0.012, Math.sin(frame * 2.3) * 0.01, 0];
	const hand = handAt(you, turn, MIC_ARM, MIC_REACH, 1);
	const mic: V3 = arrived ? [hand[0] + shake[0], hand[1] + shake[1], hand[2]] : handAt(you, turn, [20, 60], 30, 1);
	const angles: Angle3[] = [
		{at: [0, 1.6, -1.5], dist: 14, pitch: 9},
		{at: [0.2, 1.3, -1.0], dist: 3.0, yaw: 8, pitch: 5},
		{at: [0, 1.5, 5.5], dist: 6, yaw: 180, pitch: 6},
		{at: [0, 1.32, -1.0], dist: 1.9, pitch: 2, fov: 30},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, called - 4, walk + 10, sees - 4, laughs - 4, dry - 4, could - 4]}
				angles={[angles[0], {at: [-4.2, 1.3, -0.6], dist: 3.4, yaw: 40, pitch: 4}, angles[1], angles[3], angles[2], angles[3], angles[0]]}
				light={LIGHT.stageDark}
				bg={BG.stage}
				far={<Hall frame={frame} />}
				near={
					<group>
						<Hero3D who={P3.teacher} position={[-4.4, 0, -0.6]} turn={0.9} face="happy" armL={[40, 120]} reachL={40} talk={frame > called && frame < called + 40 ? 0.5 : 0} />
						<Hero3D position={you} turn={turn} ghost={1} aura="#FFE8B0" walk={arrived ? undefined : frame / 15} face={frame > dry ? 'scared' : 'neutral'} armR={arrived ? MIC_ARM : [20, 60]} reachR={arrived ? MIC_REACH : 30} look={frame > laughs ? [0.3, -0.4] : [0, 0]} />
						<Mic3D at={mic} rot={arrived ? [0.35, 0, 0.15] : [0, 0, 0]} />
					</group>
				}
				overlay={(cam) => {
					const [bx, by] = project(cam, [4, 2.6, 11]);
					return (
						<>
							<Says cam={cam} head={top(-4.4, -0.6)} text="Next up... singing!" frame={frame} at={called} until={walk + 10} />
							{frame >= laughs && frame < dry + 10 ? <div style={{position: 'absolute', left: Math.min(1700, Math.max(220, bx)), top: Math.max(220, by), transform: 'translate(-50%, -50%) rotate(-6deg)', fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 70, color: UI.yellow, textShadow: '0 4px 0 #140A28'}}>HA HA HA!</div> : null}
							<Vignette strength={span(frame, dry, dry + 20) * 0.9} />
						</>
					);
				}}
			/>
			<Sound name="pop" at={called} volume={0.35} />
			<Sound name="steps" at={walk} volume={0.3} loop={sees - walk} />
			<Sound name="crowd" at={laughs} volume={0.3} />
			<Sound name="heart" at={dry} volume={0.55} />
			<Sound name="heart" at={dry + 30} volume={0.5} />
		</>
	);
};

export const Appear: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const off = cue(l0, 'switch it off');
	const faces = cue(l0, 'four hundred faces');
	const sing = l1.a;
	const chorus = cue(l1, 'By the chorus');
	const claps = cue(l2, 'claps');
	const forYou = cue(l2, 'For you');
	const g = 1 - span(frame, off, off + 22);
	const you = SPOT;
	const mic = handAt(you, 0, MIC_ARM, MIC_REACH, 1);
	const singing = frame >= sing && frame < claps - 10;
	const up = span(frame, claps - 4, claps + 30);
	const burst = span(frame, off, off + 26);
	const angles: Angle3[] = [
		{at: [0, 1.32, -1.0], dist: 1.9, pitch: 2, fov: 30},
		{at: [0, 1.5, 5.5], dist: 6, yaw: 180, pitch: 6},
		{at: [0, 1.6, -1.5], dist: 14, pitch: 9, dyaw: 0},
		{at: [0, 1.2, -1.0], dist: 3.6, yaw: 15, pitch: 4},
		{at: [0, 1.32, -1.0], dist: 2.2, yaw: -12, pitch: 3, fov: 30},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, faces - 4, sing - 2, chorus - 4, claps - 6, forYou - 6]}
				angles={[angles[0], angles[1], angles[3], angles[0], angles[2], angles[4]]}
				light={frame > off ? LIGHT.stage : LIGHT.stageDark}
				bg={BG.stage}
				far={<Hall frame={frame} up={up} clap={frame > claps - 4} />}
				near={
					<group>
						<Hero3D position={you} ghost={g} aura={g > 0.3 ? '#FFE8B0' : undefined} face={frame > claps ? 'happy' : singing ? (frame > chorus ? 'happy' : 'determined') : frame > off ? 'determined' : 'scared'} talk={singing ? 0.35 + Math.abs(Math.sin(frame * 0.35)) * 0.4 : 0} armR={frame > forYou ? [100, 150] : MIC_ARM} reachR={frame > forYou ? 0 : MIC_REACH} armL={frame > chorus && singing ? [60 + Math.sin(frame * 0.1) * 20, 100] : frame > forYou ? [100, 150] : undefined} blink={frame > forYou + 10 ? 1 : undefined} />
						{frame <= forYou ? <Mic3D at={mic} rot={[0.35, 0, 0.15]} /> : <Mic3D at={handAt(you, 0, [100, 150], 0, 1)} rot={[0, 0, 0.3]} />}
						{burst > 0 && burst < 1 ? <T shape={{kind: 'torus', r: 0.4 + burst * 2.2, tube: 0.04}} color="#FFF3C4" position={[0, 0.9, -1.0]} rotation={[Math.PI / 2, 0, 0]} opacity={1 - burst} outline={0} /> : null}
						{burst > 0 && burst < 1
							? [...Array(14)].map((_, i) => {
									const a = (i / 14) * Math.PI * 2;
									return <Glow key={i} shape={{kind: 'sphere', r: 0.04, seg: 8}} color={i % 2 ? '#FFD84A' : '#FFFFFF'} position={[Math.cos(a) * (0.3 + burst * 1.6), 0.9 + Math.sin(a) * (0.3 + burst * 1.6), -1.0]} opacity={1 - burst} />;
								})
							: null}
					</group>
				}
				overlay={(cam) => (
					<>
						<Notes cam={cam} from={mouthAt(you, 0)} frame={frame} at={sing + 10} until={claps - 8} />
						<Vignette strength={(1 - span(frame, off, off + 20)) * 0.8} />
					</>
				)}
			/>
			<Sound name="appear" at={off} volume={0.6} />
			<Sound name="applause" at={claps - 4} volume={0.7} />
			<Sound name="crowd" at={claps + 10} volume={0.35} />
			<Sound name="applause" at={claps + 120} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- home

/** The photo on the fridge: you on stage, mid-note, in the spotlight. */
const drawStagePhoto = (ctx: CanvasRenderingContext2D, W2: number, H: number) => {
	ctx.fillStyle = '#FFFDF6';
	ctx.fillRect(0, 0, W2, H);
	const p = 18;
	const ih = H * 0.8;
	ctx.fillStyle = '#1E1650';
	ctx.fillRect(p, p, W2 - p * 2, ih);
	ctx.fillStyle = 'rgba(255,243,196,0.35)';
	ctx.beginPath();
	ctx.moveTo(W2 / 2 - 30, p);
	ctx.lineTo(W2 / 2 + 30, p);
	ctx.lineTo(W2 / 2 + 130, p + ih);
	ctx.lineTo(W2 / 2 - 130, p + ih);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = '#C8283C';
	ctx.fillRect(p, p, 60, ih);
	ctx.fillRect(W2 - p - 60, p, 60, ih);
	ctx.fillStyle = '#5B3FD6';
	ctx.beginPath();
	ctx.ellipse(W2 / 2, p + ih * 0.82, 70, 110, 0, Math.PI, 0);
	ctx.fill();
	ctx.fillRect(W2 / 2 - 70, p + ih * 0.82, 140, ih * 0.18);
	ctx.fillStyle = '#FF8A3D';
	ctx.beginPath();
	ctx.arc(W2 / 2, p + ih * 0.42, 70, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#FFFFFF';
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.ellipse(W2 / 2 + s * 24, p + ih * 0.38, 13, 17, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = '#140A28';
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.arc(W2 / 2 + s * 24, p + ih * 0.385, 7, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = '#5A1A2A';
	ctx.beginPath();
	ctx.ellipse(W2 / 2, p + ih * 0.5, 16, 20, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#2A2350';
	ctx.fillRect(W2 / 2 + 50, p + ih * 0.5, 14, 70);
	ctx.fillStyle = '#FFD84A';
	ctx.font = `bold 60px Fredoka, sans-serif`;
	ctx.fillText('♪', W2 / 2 + 80, p + ih * 0.3);
	ctx.fillStyle = '#2A2350';
	ctx.font = `bold 34px Fredoka, sans-serif`;
	ctx.textAlign = 'center';
	ctx.fillText('SCHOOL SHOW ★', W2 / 2, H - 30);
};

export const Home: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const photo = cue(l0, "It's you");
	const magnets = cue(l0, 'three magnets');
	const scary = l1.a;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, photo - 4, magnets - 4, scary - 4]}
				angles={[W(0.6, -2.8, 6.4, -8, 10), {at: [1.68, 1.62, -3.5], dist: 1.45, pitch: 0, fov: 30}, {at: [1.66, 1.62, -3.5], dist: 1.25, yaw: 12, pitch: 2, fov: 30}, {at: [0.7, 1.3, -2.6], dist: 2.8, yaw: -12, pitch: 3}]}
				light={LIGHT.evening}
				bg={BG.night}
				far={
					<Room3 look={ROOM3.kitchen} window={{x: -1.6, night: true}}>
						<Counter3 at={[-2.4, 0, -3.9]} w={3.6} />
						<Fridge3D at={[1.6, 0, -3.9]} photo={drawStagePhoto} photoKey="stage" />
						<Plant3 at={[4.6, 0, -3.4]} />
						<Desk3 at={[-1.6, 0, -1.4]} w={1.4} d={0.9} color="#E8D8C0" />
					</Room3>
				}
				near={
					<group>
						<Hero3D who={P3.mum} position={[0.2, 0, -2.6]} turn={frame > scary ? -0.3 : 2.4} face="happy" armR={[60, 100]} reachR={30} />
						<Hero3D position={[1.1, 0, -2.4]} turn={frame > scary ? -0.2 : 2.7} face="happy" />
					</group>
				}
				overlay={() => <Label text="3 MAGNETS. JUST TO BE SAFE." x={960} y={880} frame={frame} at={magnets + 6} until={scary - 4} size={44} color={UI.yellow} />}
			/>
			<Sound name="pop" at={magnets + 6} volume={0.35} />
			<Sound name="chime" at={scary + 20} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- twist

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const asks = cue(l0, 'Has anyone');
	const lifts = cue(l1, 'lifts into the air');
	const bites = cue(l1, 'bite by bite');
	const height = cue(l1, 'dog height');
	const only = l2.a;
	const dog: V3 = [-0.25, 0, -1.25];
	const lift = span(frame, lifts - 6, lifts + 18);
	const n = Math.max(0, Math.min(4, Math.floor((frame - bites + 6) / 9) + 1));
	const left = frame < bites - 6 ? 1 : 1 - n / 4;
	const dogRot = frame < only - 4 ? 0 : lerp(0, -1.15, span(frame, only - 4, only + 10));
	const eyes = span(frame, only - 4, only + 6);
	const sausage: V3 = [lerp(0.5, 0.42, lift), lerp(0.04, 0.68, lift), -1.25];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, asks - 4, l1.a - 4, bites - 4, height - 4, only - 4]}
				angles={[W(0, -1.8, 6.4, 0, 12), C(-1.4, -2.5, 30), {at: [0.25, 0.55, -1.25], dist: 2.6, pitch: -2, yaw: 6}, {at: [0.35, 0.65, -1.25], dist: 1.6, pitch: 0, yaw: 14, fov: 30}, C(0.9, -2.4, -20, 1.9), {at: [0.0, 0.8, -0.7], dist: 1.15, pitch: 2, yaw: 24, fov: 30}]}
				light={LIGHT.morning}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.kitchen} window={{x: 2.2}}>
						<Counter3 at={[-2.0, 0, -3.9]} w={4.6} />
						<Fridge3D at={[3.6, 0, -3.9]} photo={drawStagePhoto} photoKey="stage" />
						<Desk3 at={[0, 0, -2.1]} w={1.8} d={0.95} color="#E8D8C0" />
						<Chair3 at={[0.9, 0, -2.75]} color="#E8453C" />
						<DogBowl3D at={[-2.6, 0, -2.8]} />
						<Box size={[0.9, 0.12, 0.7]} at={[-3.6, 0.06, -2.6]} color="#7F5AF0" />
						<CanvasPlane w={0.5} h={0.14} px={250} dep="biscuit" position={[-2.6, 0.06, -2.57]} draw={(ctx, W2, H) => {
							ctx.fillStyle = '#FFFFFF';
							ctx.font = `bold ${H * 0.7}px Fredoka, sans-serif`;
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillText('BISCUIT', W2 / 2, H * 0.55);
						}} />
					</Room3>
				}
				near={
					<group>
						<Plate3D at={[-0.3, 0.78, -1.95]} />
						<Plate3D at={[0.4, 0.78, -1.95]} />
						<Hero3D who={P3.mum} position={[-1.4, 0, -2.5]} turn={0.5} face={frame > lifts ? 'shocked' : 'sad'} look={frame > lifts ? [0.4, 0.9] : [0.5, 0.5]} armL={[40, 100]} reachL={40} armR={[40, 100]} reachR={40} talk={frame > asks && frame < asks + 40 ? 0.5 : 0} />
						<Hero3D position={[0.9, 0.46, -2.7]} sit face={frame > lifts ? 'shocked' : 'happy'} look={frame > lifts ? [-0.6, 0.9] : [0, 0]} armL={[20, 60]} reachL={50} armR={[20, 60]} reachR={50} />
						<Sausage3D at={sausage} left={left} />
						<GhostDog3D at={dog} rot={dogRot} frame={frame} eyes={eyes} />
					</group>
				}
				overlay={(cam) => <Says cam={cam} head={top(-1.4, -2.5)} text="Has anyone seen the sausages?" frame={frame} at={asks} until={l1.a + 10} />}
			/>
			<Sound name="pop" at={asks} volume={0.4} />
			<Sound name="swish" at={lifts} volume={0.3} />
			{[0, 1, 2, 3].map((k) => (
				<Sound key={k} name="crunch" at={bites - 6 + k * 9} volume={0.55} />
			))}
			<Sound name="appear" at={only - 4} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const bye = cue(l0, 'See you');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0]}
				angles={[{at: [0, 1.15, 0], dist: 3.2, pitch: 4, dyaw: 12}]}
				light={LIGHT.void}
				bg={BG.void}
				blur={0}
				far={<Box size={[40, 0.1, 40]} at={[0, -0.05, 0]} color="#140E38" outline={0} />}
				near={<Hero3D position={[0, 0, 0]} face="smug" armR={[100, 160]} aura={frame < bye ? '#7F5AF0' : undefined} ghost={span(frame, bye, bye + 18)} />}
				overlay={() => (
					<>
						<Big text="WOULD YOU?" x={960} y={250} size={110} frame={frame} at={cue(l0, 'would you')} />
						<Label text="WHAT'S THE FIRST THING YOU'D DO?" x={960} y={860} frame={frame} at={cue(l0, 'first thing')} until={cue(l0, 'comments') - 2} color={UI.cyan} />
						<Label text="TELL US IN THE COMMENTS" x={960} y={860} frame={frame} at={cue(l0, 'comments')} until={cue(l0, 'subscribe') - 2} color={UI.yellow} />
						<Label text="SUBSCRIBE FOR MORE WHAT IFS" x={960} y={860} frame={frame} at={cue(l0, 'subscribe')} />
					</>
				)}
			/>
			<Sound name="vanish" at={bye} volume={0.5} />
		</>
	);
};
