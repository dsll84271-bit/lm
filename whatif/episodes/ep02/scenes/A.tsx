import React from 'react';
import {Easing} from 'remotion';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Bars, Big, Label, UI} from '../../../components/ui';
import {Hero3D} from '../../../three/Hero3D';
import {Brain3D, Dog3D} from '../../../three/props3d';
import {Bed3, Box, Chair3, Counter3, Door3, Lamp3, Plant3, Poster3, Room3, ROOM3, School3, Shelf3} from '../../../three/sets3d';
import {C, L, M, Shot3, Thought, W, Says} from '../../../three/shot3';
import {BG, LIGHT, P2} from './kit';

// Part A: waking up able to hear thoughts.

/** Head-top point for a thought bubble, for someone standing (or sitting) at (x, y, z). */
const top = (x: number, z: number, y = 0, sit = false): [number, number, number] => [x, y + (sit ? 1.45 : 1.8), z];

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const morning = cue(l0, 'Morning');
	const thinkAt = cue(l1, 'I hope');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -2.6, 7.5, 12, 12), C(2.2, -3.4, -35), C(-1.7, -1.6, 25, 1.9), M(0.2, -2.6, -10), C(2.2, -3.4, -20, 1.7, 3)]}
				light={LIGHT.morning}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.bedroom} window={{x: -0.4}}>
						<Bed3 at={[-1.8, 0, -2.6]} />
						<Door3 at={[2.4, 0, -4.38]} open={span(frame, 0, 20)} />
						<Shelf3 at={[-4, 2, -4.3]} />
						<Poster3 at={[1.0, 2.2, -4.35]} color="#FF8A3D" accent="#FFD84A" />
						<Plant3 at={[4.6, 0, -3.6]} />
					</Room3>
				}
				near={
					<group>
						<Hero3D position={[-1.8, 0.46, -1.7]} sit turn={0.5} face={frame > thinkAt ? 'shocked' : 'neutral'} look={[0.8, -0.2]} armL={[30, 60]} armR={[30, 60]} />
						<Hero3D who={P2.mum} position={[2.2, 0, -3.5]} turn={-0.7} face="happy" talk={frame > morning && frame < morning + 30 ? 0.6 : 0} armL={[60, 120]} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Says cam={cam} head={top(2.2, -3.5)} text="Morning, love!" frame={frame} at={morning} until={thinkAt - 4} />
						<Thought cam={cam} head={top(2.2, -3.5)} text="I hope they didn't notice I ate their chocolate..." frame={frame} at={thinkAt} />
					</>
				)}
			/>
			<Sound name="pop" at={thinkAt} volume={0.5} />
		</>
	);
};

export const Dog: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const words = [
		[cue(l0, 'Walk?'), 'Walk?'],
		[cue(l0, 'Walk.'), 'Walk.'],
		[cue(l0, 'Sausage?'), 'Sausage??'],
		[cue(l0, 'Walk.', 1), 'WALK!'],
		[l1.a + 20, 'GENIUS.'],
	] as const;
	const current = [...words].reverse().find(([at]) => frame >= at);
	const give = cue(l1, 'You give');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -1.2, 6.5, -10, 10), C(1.1, -1, -30, 1.1), M(-0.8, -1, 25), L(0.6, -1, -15), C(-0.8, -1, 20)]}
				light={LIGHT.day}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.kitchen} window={{x: 2.4}}>
						<Counter3 at={[-1.5, 0, -3.9]} w={5} />
						<Counter3 at={[3.2, 0, -3.9]} w={2.4} color="#E8453C" />
						<Plant3 at={[-4.8, 0, -3.6]} />
					</Room3>
				}
				near={
					<group>
						<Hero3D position={[-0.8, 0, -1]} turn={0.7} face={frame > give ? 'happy' : 'smug'} reachR={frame > give ? 60 : 0} armR={frame > give ? [40, 60] : undefined} />
						<Dog3D at={[0.9, 0, -1]} rot={Math.PI} frame={frame} walk={frame > l1.a + 20 ? frame / 8 : undefined} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Label text="A DOG KNOWS ≈ 89 WORDS" x={960} y={200} frame={frame} at={cue(l0, 'eighty nine')} until={cue(l0, 'Walk?')} />
						{current ? <Thought cam={cam} head={[1.3, 1.1, -1]} text={current[1]} frame={frame} at={current[0]} size={44} shout={current[1] === 'WALK!'} /> : null}
					</>
				)}
			/>
			{words.map(([at], i) => (
				<Sound key={i} name="pop" at={at} volume={0.4} />
			))}
		</>
	);
};

export const Bus: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const driverAt = cue(l0, 'The driver');
	const womanAt = cue(l0, 'The woman');
	const manAt = cue(l0, 'The man behind');
	const madAt = cue(l0, 'driving you mad');
	const sway = Math.sin(frame * 0.08) * 0.02;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[W(0, -1.5, 6, 0, 8), C(-3.2, -2.4, 40), C(1, -1.6, -20, 1.7), C(2.3, -2.8, -25), C(-0.6, -0.6, 15)]}
			light={LIGHT.day}
			bg={BG.sky}
			far={
				<group rotation={[0, 0, sway]}>
					<Room3 look={ROOM3.bus} w={9} d={6} h={2.8} window={{x: 0, w: 6}} />
					{[-2.2, -0.6, 1, 2.6].map((x) => (
						<Chair3 key={x} at={[x, 0, -1.9]} color="#3FB7E8" />
					))}
					{[-2.2, -0.6, 1, 2.6].map((x) => (
						<Chair3 key={`b${x}`} at={[x, 0, -3]} color="#3FB7E8" />
					))}
					<Box size={[0.8, 0.9, 0.6]} at={[-3.6, 0.45, -2.4]} color="#2A2350" />
					<Box size={[0.5, 0.05, 0.5]} at={[-3.2, 1.2, -2.0]} color="#140A28" rot={[0.9, 0, 0]} />
				</group>
			}
			near={
				<group rotation={[0, 0, sway]}>
					<Hero3D who={P2.driver} position={[-3.3, 0.46, -2.5]} sit turn={1.3} face="sad" lite armL={[60, 90]} armR={[60, 90]} />
					<Hero3D who={P2.extras[1]} position={[1, 0.46, -1.85]} sit face="determined" talk={0.2} lite />
					<Hero3D who={P2.extras[2]} position={[2.6, 0.46, -2.95]} sit face="happy" tilt={Math.sin(frame * 0.3) * 6} lite />
					<Hero3D position={[-0.6, 0.46, -0.6]} sit turn={0.2} face={frame > madAt ? 'determined' : 'neutral'} look={[0.6, 0]} armL={[30, 60]} armR={[30, 60]} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(-3.3, -2.5, 0.46, true)} text="12 more years till I retire..." frame={frame} at={driverAt} size={30} />
					<Thought cam={cam} head={top(1, -1.85, 0.46, true)} text="'I'm a hard worker. I'm a team player...'" frame={frame} at={womanAt} size={30} />
					<Thought cam={cam} head={top(2.6, -2.95, 0.46, true)} text="♪ oh yeah, oh yeah, oh yeah... ♪" frame={frame} at={manAt} size={30} />
				</>
			)}
		/>
	);
};

const SCHOOL_THOUGHTS = ['Is it lunch yet?', 'Forgot my homework', 'Does she like me?', 'So tired', 'Football later!', "Don't look at me", 'What day is it?', 'Need a wee', 'I hate Mondays', 'New trainers!!'];

export const School: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const noiseAt = cue(l0, 'The thinking');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -1, 10, 0, 12), C(0, 0, 0, 1.7, -4), W(0, -1, 7, 35, 6), C(0, 0, -15)]}
				light={LIGHT.day}
				bg={BG.sky}
				far={<School3 />}
				near={
					<group>
						{P2.extras.map((who, i) => (
							<Hero3D key={i} who={who} lite position={[-5 + (i % 4) * 3 + Math.sin(i) * 0.5, 0, -1.5 - Math.floor(i / 4) * 1.5 - ((frame * 0.012 + i * 0.3) % 1.5)]} turn={Math.PI} walk={frame / 16 + i * 0.25} />
						))}
						<Hero3D position={[0, 0, 0]} face={frame > noiseAt ? 'scared' : 'neutral'} armL={frame > noiseAt ? [120, 207] : undefined} armR={frame > noiseAt ? [120, 207] : undefined} />
					</group>
				}
				overlay={(cam) => (
					<>
						{SCHOOL_THOUGHTS.map((t, i) => {
							const who = i % P2.extras.length;
							const x = -5 + (who % 4) * 3 + Math.sin(who) * 0.5;
							const z = -1.5 - Math.floor(who / 4) * 1.5 - ((frame * 0.012 + who * 0.3) % 1.5);
							return <Thought key={t} cam={cam} head={[x, 1.8, z]} text={t} frame={frame} at={noiseAt + i * 5} until={l1.a + 30} size={26} />;
						})}
						<Label text="RANGE ≈ 10 METRES" x={960} y={860} frame={frame} at={cue(l1, 'ten metres')} color={UI.yellow} />
					</>
				)}
			/>
			{SCHOOL_THOUGHTS.map((_, i) => (
				<Sound key={i} name="pop" at={noiseAt + i * 5} volume={0.25} />
			))}
		</>
	);
};

export const Rules: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const night = l1.a;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={frame < night ? [M(0, -1.4, 10), C(0, -1.4, -10), W(0, -1.6, 6, 0, 10)] : [W(0, -2.4, 6.5, 0, 14), C(1.3, -2.3, -25, 1.9), C(-1.4, -2.2, 25, 1.9)]}
			light={frame < night ? LIGHT.room : LIGHT.night}
			bg={frame < night ? BG.room : BG.night}
			far={
				<Room3 look={ROOM3.bedroom} window={{x: 0, night: frame >= night}}>
					<Bed3 at={[-1.4, 0, -2.6]} />
					<Bed3 at={[1.4, 0, -2.6]} />
					<Lamp3 at={[3.6, 0, -3.8]} />
				</Room3>
			}
			near={
				frame < night ? (
					<Hero3D position={[0, 0, -1.4]} face="determined" armR={[100, 140]} reachR={30} />
				) : (
					<group>
						<Hero3D position={[-1.4, 0.46, -2.4]} sit face="sad" look={[0.8, 0]} armL={[30, 60]} armR={[30, 60]} />
						<Hero3D who={P2.brother} height={1.25} position={[1.4, 0.6, -2.4]} sit face="scared" blink={1} still />
					</group>
				)
			}
			overlay={(cam) => (
				<>
					<Label text="RANGE ≈ 10 M" x={420} y={200} frame={frame} at={cue(l0, 'ten metres')} until={night - 4} />
					<Label text="FEAR = LOUD · BOREDOM = QUIET" x={960} y={860} frame={frame} at={cue(l0, 'Strong feelings')} until={night - 4} color={UI.yellow} />
					<Label text="NO OFF SWITCH" x={1500} y={200} frame={frame} at={cue(l0, 'no off switch')} until={night - 4} color={UI.red} />
					<Thought cam={cam} head={[1.4, 1.6, -2.4]} text="AAAH! A GIANT SANDWICH!" frame={frame} at={cue(l1, 'Tonight')} size={34} shout />
				</>
			)}
		/>
	);
};

export const Brain: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[{at: [0, 1.4, 0], dist: 4.5, pitch: 6, dyaw: 25}, {at: [0, 1.4, 0], dist: 2.6, yaw: 40, pitch: 10, dyaw: 20}, {at: [0, 1.4, 0], dist: 3.4, yaw: -60, pitch: -8, dyaw: 25}]}
			light={LIGHT.void}
			bg={BG.void}
			blur={0}
			far={<Box size={[40, 0.1, 40]} at={[0, -0.05, 0]} color="#140E38" outline={0} />}
			near={<Brain3D at={[0, 1.4, 0]} frame={frame} s={frame > l1.a ? 1.15 : 1} />}
			overlay={() => (
				<>
					<Big text="86 BILLION NEURONS" x={960} y={230} size={84} frame={frame} at={cue(l0, 'eighty six')} until={cue(l0, 'twenty watts') - 4} />
					<Big text="≈ 20 WATTS" x={960} y={230} size={100} frame={frame} at={cue(l0, 'twenty watts')} until={l1.a} color={UI.cyan} />
					<Label text="LESS THAN A LIGHT BULB" x={960} y={860} frame={frame} at={cue(l0, 'Less than')} until={l1.a} />
					<Label text="A THOUGHT = MILLIONS OF NEURONS FIRING TOGETHER" x={960} y={860} frame={frame} at={cue(l1, 'millions')} color={UI.yellow} size={40} />
				</>
			)}
		/>
	);
};

export const Energy: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const eat = cue(l0, 'Which might');
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[M(0, -1, 0), C(0, -1, 15), W(0, -1.4, 6, -15, 10)]}
			light={LIGHT.day}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.kitchen} window={{x: -2.2}}>
					<Counter3 at={[0, 0, -3.9]} w={6} />
				</Room3>
			}
			near={<Hero3D position={[0, 0, -1]} face={frame > eat ? 'happy' : 'neutral'} talk={frame > eat ? Math.abs(Math.sin(frame * 0.5)) * 0.6 : 0} armR={frame > eat ? [70 + Math.sin(frame * 0.4) * 12, 140] : undefined} reachR={frame > eat ? 25 : 0} />}
			overlay={() => (
				<Bars
					x={360}
					y={190}
					w={1200}
					frame={frame}
					at={cue(l0, 'two percent')}
					items={[
						{label: 'WEIGHT', value: 0.08, color: UI.cyan, note: '≈ 2%'},
						{label: 'ENERGY', value: 0.8, color: UI.orange, note: '≈ 20%'},
					]}
				/>
			)}
		/>
	);
};

