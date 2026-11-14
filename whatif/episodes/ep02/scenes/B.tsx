import React from 'react';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Count, Label, UI} from '../../../components/ui';
import {Hero3D} from '../../../three/Hero3D';
import {Balloons3D, Bike3D, CardReader3D, Crisps3D, Gift3D, Mri3D} from '../../../three/props3d';
import {Board3, Box, Chair3, Clock3, Counter3, Desk3, Lamp3, Pitch3, Plant3, Poster3, Room3, ROOM3, Screen3, Shelf3, Street3, Table3} from '../../../three/sets3d';
import {C, L, M, Says, Shot3, Thought, W} from '../../../three/shot3';
import {Glow} from '../../../three/toon';
import {BG, LIGHT, P2} from './kit';

// Part B: the science, and the fun.

const top = (x: number, z: number, y = 0, sit = false): [number, number, number] => [x, y + (sit ? 1.45 : 1.8), z];

export const Decoder: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const you = l2.a;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={frame < you ? [W(0, -1.5, 7.5, 20, 10), {at: [0, 1.1, -0.2], dist: 3, yaw: -30, pitch: 10}, M(2.6, -0.8, -30), C(2.6, -0.8, -20)] : [C(-2.2, 0.5, 20), M(-2.2, 0.5, 10)]}
			light={LIGHT.lab}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.lab}>
					<Mri3D at={[0, 0, -2.5]} />
					<Screen3 at={[3.4, 1.6, -3.9]} w={1.8} h={1} color="#120C30" />
					<Shelf3 at={[-4, 1.8, -4.3]} />
					<Plant3 at={[-4.8, 0, -3.5]} />
				</Room3>
			}
			near={
				<group>
					<Hero3D who={P2.extras[3]} position={[0, 0.95, -0.4]} sit still face="neutral" blink={1} lite />
					<Hero3D who={P2.scientist} position={[2.6, 0, -0.8]} turn={-0.8} face="happy" talk={frame < you ? Math.abs(Math.sin(frame * 0.4)) * 0.4 : 0} armL={[80, 100]} lite />
					{frame >= you ? <Hero3D position={[-2.2, 0, 0.5]} turn={0.3} face="smug" armR={[100, 160]} /> : null}
				</group>
			}
			overlay={() => (
				<>
					<Label text="UNIVERSITY OF TEXAS · 2023" x={960} y={200} frame={frame} at={cue(l0, 'two thousand')} until={l1.a} color={UI.yellow} />
					<Label text="BRAIN SCANS → ROUGH MEANING" x={960} y={860} frame={frame} at={cue(l0, 'rough meaning')} until={l1.a} />
					<Count from={0} to={16} x={960} y={250} size={90} frame={frame} at={cue(l1, 'sixteen hours')} dur={30} suffix=" HOURS IN A SCANNER" color={UI.cream} />
					<Label text="THE GIST ✓   EXACT WORDS ✗" x={960} y={860} frame={frame} at={cue(l1, 'gist')} until={you} color={UI.cyan} />
					<Label text="ONLY IF THEY WANT IT TO" x={480} y={300} frame={frame} at={cue(l1, 'only worked')} until={you} color={UI.green} />
					<Big text="NO SCANNER. EXACT WORDS." x={960} y={860} size={70} frame={frame} at={you} color={UI.orange} />
				</>
			)}
		/>
	);
};

const desks: Array<[number, number]> = [];
for (let r = 0; r < 3; r++) {
	for (let c = 0; c < 4; c++) {
		desks.push([-3 + c * 2, -0.5 - r * 1.4]);
	}
}

export const Test: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const teacher = l1.a;
	const answers = [
		[cue(l1, 'Question one'), 'Q1: 42'],
		[cue(l1, 'Question two'), 'Q1: 42. Q2: 7.5'],
	] as const;
	const now = [...answers].reverse().find(([at]) => frame >= at);
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={frame < teacher ? [W(0, -1.5, 8, 0, 18), C(-1, -0.5, 10, 1.7), M(1, -1.9, -10)] : [{at: [0, 1.3, -4.4], dist: 3.6, pitch: 24, fov: 32}, {at: [0, 1.45, -4.4], dist: 2.7, pitch: 20, yaw: -18, fov: 30}, W(0, -1.5, 8, 20, 18)]}
			light={LIGHT.room}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.classroom} d={10}>
					<Board3 at={[0, 2.2, -4.85]} />
					<Clock3 at={[3.2, 3.1, -4.85]} />
					<Desk3 at={[0, 0, -3.75]} w={1.6} color="#7A4A2A" />
					<Chair3 at={[0, 0, -4.35]} color="#2A2350" />
					{desks.map(([x, z], i) => (
						<group key={i}>
							<Desk3 at={[x, 0, z - 0.45]} w={0.9} d={0.55} h={0.72} color="#C98A5A" />
							<Chair3 at={[x, 0, z + 0.3]} color="#3FB7E8" />
						</group>
					))}
				</Room3>
			}
			near={
				<group>
					{desks.map(([x, z], i) =>
						i === 5 ? (
							<Hero3D key={i} position={[x, 0.46, z + 0.2]} sit face={frame > teacher ? 'smug' : 'neutral'} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
						) : (
							<Hero3D key={i} who={P2.extras[i % P2.extras.length]} lite position={[x, 0.46, z + 0.2]} sit face="scared" armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
						),
					)}
					<Hero3D who={P2.teacher} position={[0, 0.46, -4.4]} sit face="neutral" armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
				</group>
			}
			overlay={(cam) => (
				<>
					{[0, 2, 7, 9].map((i) => (
						<Thought key={i} cam={cam} head={top(desks[i][0], desks[i][1] + 0.2, 0.46, true)} text="I have no idea." frame={frame} at={cue(l0, 'I have no idea') + i * 3} until={teacher} size={26} />
					))}
					{now ? <Thought cam={cam} head={top(0, -4.4, 0.46, true)} text={now[1]} frame={frame} at={now[0]} size={34} /> : null}
					<Label text="29 / 30 HAVE NO IDEA" x={960} y={860} frame={frame} at={cue(l0, 'twenty nine')} until={teacher} color={UI.red} />
				</>
			)}
		/>
	);
};

export const Honest: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[C(0, 0, 0, 1.55), M(0, 0, 20)]}
			light={LIGHT.room}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.classroom}>
					<Board3 at={[0, 2.2, -4.35]} />
					<Desk3 at={[0, 0, 0.5]} w={1} d={0.6} h={0.72} color="#C98A5A" />
					<Chair3 at={[0, 0, -0.1]} color="#3FB7E8" />
				</Room3>
			}
			near={<Hero3D position={[0, 0.46, 0]} sit face={frame > cue(l0, 'Mostly') ? 'smug' : 'determined'} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />}
			overlay={() => <Big text="B+" x={1500} y={760} size={150} frame={frame} at={cue(l0, 'Mostly')} color={UI.green} />}
		/>
	);
};

export const Poker: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const seats: Array<[number, number, number]> = [
		[0, 1.0, Math.PI],
		[-1.0, 0, Math.PI / 2],
		[1.0, 0, -Math.PI / 2],
		[0, -1.0, 0],
	];
	const who = [null, P2.friend, P2.friend2, P2.friend3];
	const hands = [
		[cue(l0, 'Pair of threes'), 1, 'Pair of threes...'],
		[cue(l0, 'Nothing'), 2, 'Nothing. Act confident.'],
		[cue(l0, 'Bluffing'), 3, 'Bluffing, bluffing, bluffing'],
	] as const;
	const won = span(frame, l1.a, l1.a + 60);
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[W(0, -1.5, 5.5, 0, 25), {at: [0, 1.45, -2.5], dist: 2.4, pitch: 28}, {at: [-1, 1.4, -1.5], dist: 2.4, pitch: 28, yaw: 90}, {at: [1, 1.4, -1.5], dist: 2.4, pitch: 28, yaw: -90}, {at: [0, 0.8, -1.5], dist: 2.6, pitch: 84, fov: 40}]}
			light={LIGHT.warm}
			bg={BG.night}
			far={
				<Room3 look={ROOM3.bedroom} window={{x: 2.6, night: true}}>
					<Lamp3 at={[-3.8, 0, -3.6]} />
					<Shelf3 at={[-1.5, 2.2, -4.3]} />
				</Room3>
			}
			near={
				<group position={[0, 0, -1.5]}>
					<Table3 at={[0, 0, 0]} r={0.85} color="#2EA86A" />
					<Crisps3D at={[lerp(0, 0, 0), 0.78, lerp(0, 0.45, won)]} n={Math.round(lerp(6, 14, won))} />
					{seats.map(([x, z, r], i) => (
						<Chair3 key={i} at={[x * 1.15, 0, z * 1.15]} rot={r} color="#7F5AF0" />
					))}
					{seats.map(([x, z, r], i) =>
						i === 0 ? (
							<Hero3D key={i} position={[x, 0.46, z]} sit turn={r} face={frame > l1.a ? 'happy' : 'smug'} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
						) : (
							<Hero3D key={i} who={who[i]!} position={[x, 0.46, z]} sit turn={r} face={frame > l1.a ? 'sad' : 'determined'} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} lite />
						),
					)}
				</group>
			}
			overlay={(cam) => (
				<>
					{hands.map(([at, i, text], j) => (
						<Thought key={j} cam={cam} head={top(seats[i][0], seats[i][1] - 1.5, 0.46, true)} text={text} frame={frame} at={at} until={l1.a} size={30} />
					))}
					<Count from={0} to={14} x={1500} y={300} size={90} frame={frame} at={l1.a + 10} dur={50} suffix=" BAGS OF CRISPS" color={UI.yellow} />
				</>
			)}
		/>
	);
};

export const Penalty: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const runAt = cue(l0, 'The striker');
	const dive = cue(l0, 'You dive');
	const d = span(frame, dive, dive + 12);
	const strikerZ = lerp(10, 6.5, span(frame, runAt, dive + 10));
	const ball = frame < dive + 10 ? [0, 0.15, 5.5] : [lerp(0, -2.4, span(frame, dive + 10, dive + 20)), lerp(0.15, 0.6, span(frame, dive + 10, dive + 20)), lerp(5.5, -3.6, span(frame, dive + 10, dive + 20))];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[{at: [0, 1.2, -1], dist: 9, yaw: 180, pitch: 8}, C(0, strikerZ, 180), {at: [0, 1, -3], dist: 7, yaw: 0, pitch: 6}, C(lerp(0, -1.6, d), -3.5, 10), W(0, 2, 14, 15, 12)]}
				light={LIGHT.day}
				bg={BG.sky}
				far={<Pitch3 />}
				near={
					<group>
						<Hero3D position={[lerp(0, -1.6, d), d * 0.3, -3.5]} turn={0} face={frame > dive ? 'determined' : 'smug'} armL={frame > dive ? [160, 175] : [50, 80]} armR={[50, 80]} tilt={0} lean={0} />
						<Hero3D who={P2.friend3} position={[0, 0, strikerZ]} turn={Math.PI} face="determined" walk={frame < dive + 10 ? frame / 6 : undefined} run={frame < dive + 10} />
						<mesh position={ball as [number, number, number]}>
							<sphereGeometry args={[0.13, 20, 14]} />
							<meshToonMaterial color="#ffffff" />
						</mesh>
					</group>
				}
				overlay={(cam) => (
					<>
						<Thought cam={cam} head={top(0, strikerZ)} text="Bottom left. Bottom left. BOTTOM LEFT." frame={frame} at={cue(l0, 'bottom left')} until={dive + 30} size={30} shout />
						<Count from={0} to={7} x={1500} y={760} size={110} frame={frame} at={cue(l0, 'Seven penalties')} dur={30} suffix=" / 7 SAVED" color={UI.green} />
					</>
				)}
			/>
			<Sound name="thud" at={dive + 10} volume={0.4} />
			<Sound name="crowd" at={cue(l0, 'Seven saves')} volume={0.3} />
		</>
	);
};

export const Gifts: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const open = span(frame, cue(l0, 'Your gifts'), cue(l0, 'Your gifts') + 15);
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[M(0.5, -1, -10), C(1.2, -1, -25), W(0.5, -1.4, 5.5, 15, 12)]}
			light={LIGHT.warm}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.kitchen}>
					<Counter3 at={[0, 0, -3.9]} w={6} />
					<Balloons3D at={[-2.8, 0, -3]} frame={frame} />
				</Room3>
			}
			near={
				<group>
					<Desk3 at={[0.5, 0, -1.5]} w={1.6} d={0.8} color="#C98A5A" />
					<Gift3D at={[0.5, 0.78, -1.5]} open={open} />
					<Hero3D position={[-0.4, 0, -0.6]} turn={0.6} face="smug" />
					<Hero3D who={P2.friend} position={[1.3, 0, -0.8]} turn={-0.6} face={open > 0.5 ? 'happy' : 'shocked'} hop={open > 0.5 ? Math.max(0, Math.sin(frame * 0.3)) * 0.12 : 0} armL={open > 0.5 ? [150, 170] : undefined} armR={open > 0.5 ? [150, 170] : undefined} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(1.3, -0.8)} text="EXACTLY what I wanted!!" frame={frame} at={cue(l0, 'Your gifts') + 15} size={36} />
					<Label text="PERFECT GIFTS: 100%" x={960} y={860} frame={frame} at={cue(l0, 'Every single')} color={UI.green} />
				</>
			)}
		/>
	);
};

export const Bike: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const thinkAt = cue(l1, "I'd take");
	const shake = cue(l1, 'He shakes');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, 0, 7, 20, 10), C(1, 0, -30), C(-1, 0, 30), M(0, 0, 0)]}
				light={LIGHT.day}
				bg={BG.sky}
				far={<Street3 />}
				near={
					<group>
						<Bike3D at={[0, 0, -0.9]} />
						<Hero3D position={[-1, 0, 0]} turn={0.9} face={frame > thinkAt ? 'smug' : 'neutral'} reachR={frame > shake ? 60 : 0} armR={frame > shake ? [40, 50] : undefined} />
						<Hero3D who={P2.seller} position={[1, 0, 0]} turn={-0.9} face={frame > shake ? 'happy' : 'determined'} armL={frame < l1.a ? [70, 150] : undefined} armR={frame < l1.a ? [70, 150] : undefined} reachL={frame > shake ? 60 : 0} talk={frame > cue(l0, 'Sixty') && frame < l0.b ? 0.5 : 0} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Says cam={cam} head={top(1, 0)} text="£60. Not a penny less." frame={frame} at={cue(l0, 'Sixty')} until={thinkAt - 4} />
						<Thought cam={cam} head={top(1, 0)} text="Honestly, I'd take £40..." frame={frame} at={thinkAt} until={shake + 20} size={34} />
						<Big text="£60 → £40" x={960} y={860} size={90} frame={frame} at={cue(l1, 'You offer')} color={UI.green} />
					</>
				)}
			/>
		</>
	);
};

export const Pins: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const pinAt = cue(l0, 'people think');
	const humAt = cue(l0, 'You stare');
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[W(0, -1.5, 6, -15, 10), M(0.6, -2.6, -39), C(-1.2, -1, 20)]}
			light={LIGHT.room}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.lunch}>
					<Counter3 at={[1, 0, -3.4]} w={3} color="#E8453C" />
					<CardReader3D at={[0.6, 0.96, -3.2]} />
					<Shelf3 at={[-3, 1.4, -4.3]} />
					<Shelf3 at={[-3, 2.2, -4.3]} />
					<Plant3 at={[4.5, 0, -3.8]} />
				</Room3>
			}
			near={
				<group>
					<Hero3D who={P2.extras[4]} position={[0.6, 0, -2.6]} turn={Math.PI} face="neutral" reachR={50} armR={[30, 40]} lite />
					<Hero3D who={P2.extras[6]} position={[2.2, 0, -1.6]} turn={Math.PI * 0.9} face="neutral" lite />
					<Hero3D position={[-1.2, 0, -1]} turn={0.3} face={frame > humAt ? 'happy' : 'shocked'} look={frame > humAt ? [0, -1] : [0.8, 0]} talk={frame > humAt ? 0.3 : 0} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(0.6, -2.6)} text="• • • •" frame={frame} at={pinAt} until={humAt + 20} size={44} />
					<Label text="LOOK AWAY. HUM. NEVER USE THEM." x={960} y={860} frame={frame} at={humAt} color={UI.yellow} />
				</>
			)}
		/>
	);
};

export const Party: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const mirror = cue(l0, 'practising');
	const jump = cue(l0, 'jump out');
	if (frame >= mirror - 4) {
		return (
			<Shot3
				frame={frame - mirror}
				dur={dur - mirror}
				lines={[]}
				cuts={[0]}
				angles={[C(0, -2, 0, 1.7)]}
				light={LIGHT.room}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.bedroom}>
						<Box size={[1.4, 2, 0.06]} at={[0, 1.2, -3.2]} color="#BFE3FA" />
					</Room3>
				}
				near={<Hero3D position={[0, 0, -2]} face={(frame >> 3) % 2 ? 'shocked' : 'scared'} armL={[150, 170]} armR={[150, 170]} />}
			/>
		);
	}
	return (
		<Shot3
			frame={frame}
			dur={mirror}
			lines={lines}
			angles={[W(0, -1.5, 6, 0, 10), C(0.8, -1.8, -15), M(0, -1.5, 15)]}
			light={LIGHT.warm}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.kitchen}>
					<Counter3 at={[0, 0, -3.9]} w={6} />
					<Balloons3D at={[2.6, 0, -3]} frame={frame} />
				</Room3>
			}
			near={
				<group>
					<Hero3D who={P2.friend} position={[-0.6, 0, -1.8]} turn={0.5} face="smug" talk={0.4} armR={[90, 160]} lite />
					<Hero3D who={P2.friend2} position={[0.8, 0, -1.8]} turn={-0.5} face="happy" hop={frame > jump ? Math.max(0, Math.sin(frame * 0.4)) * 0.2 : 0} armL={frame > jump ? [150, 170] : undefined} lite />
					{frame > jump ? <Hero3D position={[2.1, 0, -0.9]} turn={-1.9} face="shocked" /> : null}
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(-0.6, -1.8)} text="SURPRISE PARTY. Saturday. Don't tell them!" frame={frame} at={cue(l0, 'You hear')} until={jump} size={30} />
					<Big text="SURPRISE!" x={960} y={300} size={110} frame={frame} at={jump} color={UI.yellow} />
				</>
			)}
		/>
	);
};

export const Crush: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const sitAt = l1.a;
	const x = frame < sitAt ? -2.5 : lerp(-2.5, 0.9, span(frame, sitAt, sitAt + 25));
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[W(0, -1.5, 7, 0, 12), C(1.6, -2.1, -25, 1.55), C(-2.5, -0.6, 20), M(1.2, -1.8, 0)]}
			light={LIGHT.day}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.lunch} window={{x: -2.6}}>
					<Desk3 at={[1.2, 0, -2.6]} w={2.6} d={0.9} color="#F2EEE6" />
					<Desk3 at={[-2.5, 0, -1.4]} w={2} d={0.9} color="#F2EEE6" />
					<Poster3 at={[2.8, 2.2, -4.35]} color="#7CF2A0" accent="#FF8A3D" />
				</Room3>
			}
			near={
				<group>
					<Chair3 at={[1.6, 0, -2.2]} rot={-0.4} color="#3FB7E8" />
					<Chair3 at={[0.9, 0, -2.1]} rot={0.3} color="#3FB7E8" />
					<Hero3D who={P2.crush} position={[1.6, 0.46, -2.1]} sit turn={-0.4} face={frame > sitAt + 20 ? 'happy' : 'smug'} look={[-0.8, 0]} talk={frame > sitAt + 30 ? Math.abs(Math.sin(frame * 0.4)) * 0.5 : 0} />
					<Hero3D position={[x, frame < sitAt + 25 ? 0 : 0.46, frame < sitAt ? -0.6 : -2.0]} sit={frame >= sitAt + 25} walk={frame > sitAt && frame < sitAt + 25 ? frame / 10 : undefined} turn={frame < sitAt ? 0.6 : 0.3} face={frame > sitAt ? 'happy' : 'shocked'} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(1.6, -2.1, 0.46, true)} text="I hope they sit here ♥" frame={frame} at={cue(l0, 'I hope')} until={sitAt + 20} size={34} />
					<Label text="IT GOES SURPRISINGLY WELL" x={960} y={860} frame={frame} at={cue(l1, 'surprisingly')} color={UI.green} />
				</>
			)}
		/>
	);
};

