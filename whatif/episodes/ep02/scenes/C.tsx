import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import * as THREE from 'three';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Bars, Big, Count, Label, UI} from '../../../components/ui';
import {FONT} from '../../../brand/fonts';
import {Hero3D} from '../../../three/Hero3D';
import {Piano3D} from '../../../three/props3d';
import {Board3, Box, Chair3, Counter3, Desk3, Fair3, Lamp3, Plant3, Room3, ROOM3, School3, Screen3, Shelf3} from '../../../three/sets3d';
import {C, M, Says, Shot3, Thought, W} from '../../../three/shot3';
import {project} from '../../../three/Stage3D';
import {Glow} from '../../../three/toon';
import {BG, LIGHT, P2} from './kit';

// Part C: fame, the cost, the fair, and the twist.

const top = (x: number, z: number, y = 0, sit = false): [number, number, number] => [x, y + (sit ? 1.45 : 1.8), z];

export const Quiz: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const wild = cue(l1, 'The studio');
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -1.5, 8, 0, 10), C(1.6, -1.8, -25), C(-1.6, -1.8, 25), {at: [0, 2, -3.6], dist: 4.5, pitch: 4}, W(0, -1.5, 6, -20, 6)]}
				light={LIGHT.studio}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.studio} w={14}>
						<Screen3 at={[0, 2.3, -4.3]} w={4.4} h={2} color={frame > wild ? '#FFD84A' : '#7F5AF0'} />
						{[-5, -2.5, 2.5, 5].map((x) => (
							<Glow key={x} shape={{kind: 'cone', r: 0.6, h: 3.6}} color="#FFF3C4" position={[x, 2.1, -3.6]} opacity={0.12} />
						))}
						<Box size={[1, 1.1, 0.7]} at={[-1.6, 0.55, -2.4]} color="#7F5AF0" />
						<Box size={[1, 1.1, 0.7]} at={[1.6, 0.55, -2.4]} color="#FF4FD8" />
					</Room3>
				}
				near={
					<group>
						<Hero3D position={[-1.6, 0, -1.8]} turn={0.4} face={frame > wild ? 'happy' : 'smug'} armL={frame > wild ? [150, 170] : undefined} armR={frame > wild ? [150, 170] : undefined} hop={frame > wild ? Math.max(0, Math.sin(frame * 0.3)) * 0.2 : 0} />
						<Hero3D who={P2.host} position={[1.6, 0, -1.8]} turn={-0.4} face={frame > cue(l1, 'By question eight') ? 'scared' : 'happy'} talk={frame < l0.b ? Math.abs(Math.sin(frame * 0.45)) * 0.6 : 0} armL={[80, 100]} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Thought cam={cam} head={top(1.6, -1.8)} text="Answer: JUPITER" frame={frame} at={cue(l0, 'you hear the answer')} until={l1.a} size={36} />
						<Count from={0} to={10} x={480} y={300} size={90} frame={frame} at={l1.a} dur={30} suffix=" IN A ROW" color={UI.green} />
						<Thought cam={cam} head={top(1.6, -1.8)} text="Please get one wrong... we're out of budget!" frame={frame} at={cue(l1, 'please get one')} until={wild} size={30} shout />
						<Big text="£5,000" x={960} y={760} size={140} frame={frame} at={cue(l1, 'five thousand')} color={UI.yellow} />
					</>
				)}
			/>
			<Sound name="crowd" at={wild} volume={0.5} />
			<Sound name="coins" at={cue(l1, 'five thousand')} volume={0.5} />
		</>
	);
};

export const Police: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[W(0, -1.4, 6.5, 0, 12), C(1.0, -1.6, -50, 1.8), C(-1.0, -1.6, 50, 1.8), M(-2.4, -0.4, 30), C(1.0, -1.6, -40, 1.8)]}
			light={LIGHT.police}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.police}>
					<Box size={[2.2, 1.2, 0.05]} at={[2.8, 1.8, -4.35]} color="#1A1E2A" />
					<Lamp3 at={[-3.6, 0, -3.8]} color="#E8F2FF" />
				</Room3>
			}
			near={
				<group>
					<Desk3 at={[0, 0, -1.6]} w={1.3} d={0.9} color="#55597A" />
					<Chair3 at={[1.15, 0, -1.6]} rot={-Math.PI / 2} color="#2A2350" />
					<Chair3 at={[-1.15, 0, -1.6]} rot={Math.PI / 2} color="#2A2350" />
					<Hero3D who={P2.suspect} position={[1.0, 0.46, -1.6]} sit turn={-Math.PI / 2} face={frame > l1.a ? 'scared' : 'smug'} talk={frame > cue(l0, 'I was home') && frame < l0.b ? 0.5 : 0} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
					<Hero3D who={P2.detective} position={[-1.0, 0.46, -1.6]} sit turn={Math.PI / 2} face="determined" armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
					<Hero3D position={[-2.4, 0, -0.4]} turn={0.9} face={frame > l1.a ? 'smug' : 'neutral'} look={[0.8, 0]} armL={[40, 100]} armR={[40, 100]} reachL={30} reachR={30} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Says cam={cam} head={top(1.0, -1.6, 0.46, true)} text="I was home all night." frame={frame} at={cue(l0, 'I was home')} until={l1.a} />
					<Thought cam={cam} head={top(1.0, -1.6, 0.46, true)} text="...the bag's under the bridge." frame={frame} at={cue(l1, "the bag's")} until={l2.a} size={36} shout />
					<Label text="FOUND IN 20 MINUTES" x={960} y={860} frame={frame} at={cue(l1, 'twenty minutes')} until={l2.a} color={UI.green} />
					<Label text="POLYGRAPH: HEART · BREATHING · SWEAT" x={960} y={200} frame={frame} at={cue(l2, 'heart rate')} color={UI.cyan} />
					<Label text="= STRESS, NOT LIES" x={960} y={860} frame={frame} at={cue(l2, 'Signs of stress')} color={UI.red} />
				</>
			)}
		/>
	);
};

export const Eeg: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const wave = useMemo(() => [...Array(60)].map((_, i) => i), []);
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[M(-0.8, -1, 20, 1.9), C(-0.8, -1, 15, 1.9), W(0, -1.4, 6, -15, 12), C(1.4, -1.6, -30)]}
			light={LIGHT.lab}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.lab}>
					<Screen3 at={[1.6, 1.6, -4.3]} w={2.4} h={1.3} color="#0E2A1E" />
					<Shelf3 at={[-3.5, 2, -4.3]} />
				</Room3>
			}
			near={
				<group>
					<Chair3 at={[-0.8 - 0.05, 0, -1.12]} rot={0.3} color="#C9CED8" />
					<Hero3D position={[-0.8, 0.46, -1]} sit turn={0.3} face={frame > cue(l0, "You don't tell") ? 'smug' : 'neutral'} armL={[30, 60]} armR={[30, 60]} />
					{/* the EEG cap: a white net over the head, studded with sensors */}
					<group position={[-0.8, 0.46 + 1.0, -1]} rotation={[0, 0.3, 0]}>
						<mesh>
							<sphereGeometry args={[0.335, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
							<meshToonMaterial color="#F2F4F8" />
						</mesh>
						{[...Array(26)].map((_, i) => {
							const ring = i < 8 ? 0 : i < 18 ? 1 : 2;
							const k = ring === 0 ? i : ring === 1 ? i - 8 : i - 18;
							const n = ring === 0 ? 8 : ring === 1 ? 10 : 8;
							const pol = [0.38, 0.85, 1.22][ring];
							const az = (k / n) * Math.PI * 2 + ring * 0.3;
							const r = 0.345;
							return (
								<mesh key={i} position={[Math.sin(pol) * Math.sin(az) * r, Math.cos(pol) * r, Math.sin(pol) * Math.cos(az) * r]}>
									<sphereGeometry args={[0.032, 10, 8]} />
									<meshBasicMaterial color={i % 4 ? '#3A3368' : '#7CF2A0'} />
								</mesh>
							);
						})}
						<mesh position={[0, 0.36, 0]}>
							<sphereGeometry args={[0.03, 8, 6]} />
							<meshBasicMaterial color="#7CF2A0" />
						</mesh>
					</group>
					<Hero3D who={P2.scientist} position={[1.4, 0, -1.6]} turn={-0.6} face={frame > cue(l0, "can't see why") ? 'sad' : 'happy'} armL={[80, 110]} lite />
				</group>
			}
			overlay={() => (
				<>
					{frame > cue(l0, 'On the screen') ? (
						<div style={{position: 'absolute', left: 1180, top: 190, width: 640, height: 330, background: 'rgba(8,20,16,0.92)', border: '5px solid #7CF2A0', borderRadius: 26, boxShadow: '0 0 40px rgba(124,242,160,0.35)', overflow: 'hidden', transform: `scale(${span(frame, cue(l0, 'On the screen'), cue(l0, 'On the screen') + 8)})`}}>
							<div style={{position: 'absolute', left: 24, top: 16, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: '#7CF2A0'}}>EEG · LIVE</div>
							<div style={{position: 'absolute', right: 24, top: 16, width: 18, height: 18, borderRadius: 9, marginTop: 8, background: '#FF5A5A', opacity: Math.floor(frame / 15) % 2 ? 1 : 0.3}} />
							<svg viewBox="0 0 640 330" width={640} height={330} style={{position: 'absolute', left: 0, top: 0}}>
								{[0, 1, 2, 3].map((k) => (
									<path
										key={k}
										d={wave.map((i) => `${i ? 'L' : 'M'}${20 + i * 10.4} ${100 + k * 58 + Math.sin(i * 0.9 + frame * 0.4 + k * 1.7) * 14 + Math.sin(i * 2.3 + frame * 0.7 + k) * 8}`).join(' ')}
										stroke={['#7CF2A0', '#7FE0FF', '#FFD84A', '#C9A6FF'][k]}
										strokeWidth={4}
										fill="none"
									/>
								))}
							</svg>
						</div>
					) : null}
					<Label text="EEG: DOZENS OF SENSORS ON YOUR SCALP" x={960} y={860} frame={frame} at={cue(l0, 'EEG cap')} until={cue(l0, 'On the screen')} />
					<Label text="BUSY? YES.  THOUGHTS? NO." x={960} y={860} frame={frame} at={cue(l0, 'They can see')} color={UI.yellow} />
				</>
			)}
		/>
	);
};

const Stands: React.FC = () => {
	const mesh = useMemo(() => {
		const n = 1400;
		const g = new THREE.BoxGeometry(0.25, 0.3, 0.25);
		const m = new THREE.MeshToonMaterial();
		const im = new THREE.InstancedMesh(g, m, n);
		const colours = ['#E8453C', '#3FB7E8', '#FFD84A', '#7CF2A0', '#C9A6FF', '#FF8A3D', '#F2F2F2'].map((c) => new THREE.Color(c));
		const o = new THREE.Object3D();
		for (let i = 0; i < n; i++) {
			const row = Math.floor(i / 70);
			const col = i % 70;
			o.position.set(-17 + col * 0.5 + (row % 2) * 0.25, 0.6 + row * 0.55, -8 - row * 0.6);
			o.updateMatrix();
			im.setMatrixAt(i, o.matrix);
			im.setColorAt(i, colours[(i * 7) % colours.length]);
		}
		return im;
	}, []);
	return (
		<group>
			<Box size={[60, 0.1, 40]} at={[0, -0.05, 0]} color="#4FB070" outline={0} />
			{[...Array(20)].map((_, r) => (
				<Box key={r} size={[36, 0.5, 0.6]} at={[0, 0.25 + r * 0.55, -8 - r * 0.6]} color="#3A3368" outline={0} />
			))}
			<primitive object={mesh} />
		</group>
	);
};

export const Noise: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const stadium = l1.a;
	const music = l2.a;
	const scene = frame < stadium ? 'school' : frame < music ? 'stadium' : 'music';
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={scene === 'school' ? [W(0, -1, 9, 0, 14), C(0, 0, 0, 1.7, 4)] : scene === 'stadium' ? [W(0, 0, 9, 0, 8), C(0, 0, 10, 1.7, -4)] : [W(0, -1.5, 6, 20, 10), C(-1, -1.5, 25, 1.55)]}
				light={scene === 'music' ? LIGHT.warm : LIGHT.day}
				bg={scene === 'music' ? BG.room : BG.sky}
				far={
					scene === 'school' ? (
						<School3 />
					) : scene === 'stadium' ? (
						<Stands />
					) : (
						<Room3 look={ROOM3.music}>
							<Piano3D at={[1.4, 0, -3.6]} />
							<Shelf3 at={[-3, 2, -4.3]} />
						</Room3>
					)
				}
				near={
					scene === 'music' ? (
						<Hero3D position={[-1, 0.1, -1.5]} sit face="sad" armL={[40, 60]} armR={[40, 60]} />
					) : (
						<group>
							{scene === 'school'
								? P2.extras.map((who, i) => <Hero3D key={i} who={who} lite position={[-5 + (i % 4) * 3, 0, -2 - Math.floor(i / 4) * 1.5]} turn={Math.PI} walk={frame / 16 + i * 0.25} />)
								: null}
							<Hero3D position={[0, 0, 0]} face="scared" armL={[120, 207]} armR={[120, 207]} tilt={Math.sin(frame * 0.2) * 4} />
						</group>
					)
				}
				overlay={() => (
					<>
						<Big text="≈ 6,200 THOUGHTS A DAY" x={960} y={250} size={70} frame={frame} at={cue(l0, 'six thousand')} until={cue(l0, 'Your school') - 2} />
						<Big text="× 1,000 PEOPLE" x={960} y={250} size={80} frame={frame} at={cue(l0, 'Your school')} until={cue(l0, "That's around") - 2} color={UI.cyan} />
						<Big text="≈ 6 MILLION A DAY" x={960} y={250} size={90} frame={frame} at={cue(l0, "That's around")} until={stadium} color={UI.red} />
						<Big text="60,000 FANS" x={960} y={250} size={100} frame={frame} at={cue(l1, 'Sixty thousand')} until={music} color={UI.orange} />
						<Label text="YOU LAST 11 MINUTES" x={960} y={860} frame={frame} at={cue(l1, 'eleven minutes')} until={music} color={UI.red} />
						<Label text="WEEK 4: LUNCH ALONE" x={960} y={860} frame={frame} at={cue(l2, 'week four')} />
						{scene !== 'music'
							? [...Array(Math.min(40, Math.floor(span(frame, 0, music) * 40)))].map((_, i) => (
									<div key={i} style={{position: 'absolute', left: (i % 2 ? 1390 : 30) + ((i * 397) % 480), top: 180 + ((i * 211) % 600), padding: '6px 14px', background: '#fff', border: '4px solid #140A28', borderRadius: 30, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: '#140A28', opacity: 0.9}}>
										{['...', 'hungry', 'REF!!', 'boring', 'later', 'why?', 'goal!', 'ugh', 'tired', 'what?'][i % 10]}
									</div>
								))
							: null}
					</>
				)}
			/>
			<Sound name="crowd" at={stadium} volume={0.5} />
		</>
	);
};

export const Truth: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[M(0, -1.4, 0), C(0.9, -1.4, -25), M(-0.3, -1.4, 18)]}
			light={LIGHT.day}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.lunch} window={{x: 2.5}}>
					<Plant3 at={[-4.6, 0, -3.6]} />
				</Room3>
			}
			near={
				<group>
					<Hero3D position={[-0.9, 0, -1.4]} turn={0.6} face={frame > cue(l0, 'And thinks') ? 'sad' : 'happy'} talk={frame < cue(l0, 'laughs') ? 0.5 : 0} />
					<Hero3D who={P2.friend} position={[0.9, 0, -1.4]} turn={-0.6} face="happy" talk={Math.abs(Math.sin(frame * 0.6)) * 0.5} hop={Math.max(0, Math.sin(frame * 0.6)) * 0.05} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(0.9, -1.4)} text="Not funny. But I'll laugh anyway." frame={frame} at={cue(l0, 'not funny')} size={34} />
					<Label text="EVERY SMILE COMES WITH SUBTITLES" x={960} y={860} frame={frame} at={cue(l1, 'Every smile')} color={UI.yellow} />
				</>
			)}
		/>
	);
};

export const Mum: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const breakfast = cue(l0, 'She smiles');
	const night = frame < breakfast;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={night ? [W(-0.4, -1.8, 6, 10, 10), C(0.8, -2.9, -12, 1.9), M(-2.4, -1.0, 40)] : [M(0.8, -2.9, -10, 1.9), C(0.8, -2.9, -12, 1.9)]}
			light={night ? LIGHT.night : LIGHT.morning}
			bg={night ? BG.night : BG.room}
			far={
				<Room3 look={ROOM3.kitchen} window={{x: -2.4, night}}>
					<Counter3 at={[0.5, 0, -3.9]} w={5} />
				</Room3>
			}
			near={
				<group>
					<Desk3 at={[0.8, 0, -2.3]} w={1.6} d={0.9} color="#C98A5A" />
					<Chair3 at={[0.8, 0, -3.0]} color="#7A4A2A" />
					{[0, 1, 2, 3].map((i) => (
						<Box key={i} size={[0.24, 0.006, 0.32]} at={[0.35 + i * 0.28, 0.785 + i * 0.002, -2.15 + (i % 2) * 0.08]} rot={[0, (i - 1.5) * 0.25, 0]} color={i === 2 ? '#FFD0D0' : '#F2EEE6'} outline={0.004} />
					))}
					{night ? <Lamp3 at={[2.4, 0, -3.6]} color="#FFD27A" /> : null}
					<Hero3D who={P2.mum} position={[0.8, 0.46, -2.9]} sit face={night ? 'sad' : 'happy'} armL={[60, 110]} armR={[60, 110]} reachL={45} reachR={45} look={night ? [0, 0.6] : [0, 0]} />
					<Hero3D position={[-2.4, 0, -1.0]} turn={0.9} face="sad" look={[0.8, 0]} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={top(0.8, -2.9, 0.46, true)} text={night ? 'How are we going to pay this...' : 'Just smile. They mustn’t worry.'} frame={frame} at={night ? cue(l0, 'worrying') : breakfast + 10} size={32} />
					{night ? <Label text="2:07 AM" x={300} y={200} frame={frame} at={cue(l0, 'two in the morning')} color={UI.cyan} /> : null}
				</>
			)}
		/>
	);
};

export const Help: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const quietAt = cue(l0, 'for the first time');
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[{at: [0.8, 1.0, -2.4], dist: 2.8, pitch: 25, fov: 40}, M(0.8, -2.9, -10, 1.9), C(0.8, -2.9, -15, 1.9)]}
			light={LIGHT.morning}
			bg={BG.room}
			far={
				<Room3 look={ROOM3.kitchen} window={{x: -2.4}}>
					<Counter3 at={[0.5, 0, -3.9]} w={5} />
				</Room3>
			}
			near={
				<group>
					<Desk3 at={[0.8, 0, -2.3]} w={1.6} d={0.9} color="#C98A5A" />
					<Chair3 at={[0.8, 0, -3.0]} color="#7A4A2A" />
					<Box size={[0.42, 0.03, 0.26]} at={[0.8, 0.8, -2.05]} color="#F2EEE6" outline={0.006} />
					<Box size={[0.18, 0.008, 0.1]} at={[0.8, 0.82, -2.05]} color="#FFD84A" outline={0} />
					<Hero3D who={P2.mum} position={[0.8, 0.46, -2.9]} sit face={frame > quietAt ? 'happy' : 'neutral'} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Label text="THE QUIZ MONEY · 'FOR THE BILLS'" x={960} y={860} frame={frame} at={cue(l0, 'The quiz money')} until={quietAt} />
					<Thought cam={cam} head={top(0.8, -2.9, 0.46, true)} text="♥" frame={frame} at={quietAt + 10} size={60} />
				</>
			)}
		/>
	);
};

const fairCrowd = (frame: number) =>
	P2.extras.map((who, i) => <Hero3D key={i} who={who} lite position={[-8 + ((i * 2.3 + frame * 0.01 * (i % 2 ? 1 : -1)) % 16), 0, -1 - (i % 4) * 1.2]} turn={i % 2 ? Math.PI / 2 : -Math.PI / 2} walk={frame / 18 + i * 0.3} />);

export const Fair: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[W(0, -1, 11, 0, 10), C(1.2, 0.5, -20), W(0, -1, 7, 25, 14)]}
			light={LIGHT.fair}
			bg={BG.dusk}
			far={<Fair3 frame={frame} />}
			near={
				<group>
					{fairCrowd(frame)}
					<Hero3D who={P2.extras[7]} position={[1.2, 0, 0.5]} face="scared" talk={0.8} armL={[100, 170]} armR={[100, 170]} turn={-0.3} />
					<Hero3D position={[-1.4, 0, 1]} face="shocked" turn={0.5} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Says cam={cam} head={top(1.2, 0.5)} text="LILY! LILY!!" frame={frame} at={cue(l0, 'screaming')} until={dur} />
					<Label text="LOST · 5 YEARS OLD" x={480} y={200} frame={frame} at={cue(l0, 'Five years')} color={UI.red} />
					<Label text="≈ 20,000 PEOPLE" x={1440} y={200} frame={frame} at={cue(l0, 'twenty thousand')} color={UI.yellow} />
				</>
			)}
		/>
	);
};

const FLOOD = ['Hot dogs!', 'Where is my phone', 'Rides!!', 'Lost my car keys', 'So hot today', 'One more go', 'Candyfloss?', "I'm bored", 'Is that Sam?', 'Need a wee', 'Too loud', 'Pizza later', 'My feet hurt', 'Did I lock up?', 'LOOK AT THAT', 'Text her back', 'Win a prize!', 'Where are you?', 'Queue is huge', 'Best day ever'];

export const Listen: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [, l1, l2] = lines;
	const smallAt = cue(l2, 'I want');
	const fade = span(frame, l2.a, smallAt);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[C(0, 0, 0, 1.7), C(0, 0, 20, 1.7, -5), {at: [0, 1.3, 0], dist: 1.4, pitch: 2}]}
				light={LIGHT.fair}
				bg={BG.dusk}
				blur={5}
				far={<Fair3 frame={frame} />}
				near={
					<group>
						{fairCrowd(frame)}
						<Hero3D position={[0, 0, 0]} face={frame > smallAt ? 'determined' : 'scared'} blink={frame < smallAt ? 1 : 0} armL={[120, 207]} armR={[120, 207]} tilt={frame > l1.a && frame < smallAt ? Math.sin(frame * 0.3) * 5 : 0} />
					</group>
				}
				overlay={() => (
					<>
						{frame > l1.a
							? FLOOD.slice(0, Math.min(FLOOD.length, Math.floor((frame - l1.a) / 3) + 1)).map((t, i) => (
									<div
										key={t}
										style={{
											position: 'absolute',
											left: (i * 389) % 1700 + 60,
											top: 160 + ((i * 233) % 640),
											padding: '10px 20px',
											background: '#fff',
											border: '5px solid #140A28',
											borderRadius: 40,
											fontFamily: FONT,
											fontWeight: 700,
											fontSize: 30 + (i % 3) * 6,
											color: '#140A28',
											opacity: (1 - fade) * 0.95,
											transform: `rotate(${((i * 13) % 11) - 5}deg)`,
										}}
									>
										{t}
									</div>
								))
							: null}
						{frame > smallAt ? (
							<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
								<div style={{padding: '10px 26px', background: '#fff', border: '5px solid #140A28', borderRadius: 40, fontFamily: FONT, fontWeight: 700, fontSize: 30, fontStyle: 'italic', color: '#140A28', opacity: span(frame, smallAt, smallAt + 10), marginTop: -260}}>
									I want mummy...
								</div>
							</AbsoluteFill>
						) : null}
					</>
				)}
			/>
			<Sound name="crowd" at={l1.a} volume={0.6} />
			<Sound name="heart" at={smallAt} volume={0.5} loop={dur - smallAt} />
		</>
	);
};

/** The 'signal' meter: how loud the one thought you are following is. */
const Meter: React.FC<{value: number; frame: number}> = ({value, frame}) => {
	const color = value > 0.6 ? UI.green : value > 0.3 ? UI.yellow : UI.red;
	const note = value > 0.6 ? 'LOUDER' : value > 0.3 ? 'FAINT' : 'LOST';
	return (
		<div style={{position: 'absolute', left: 60, top: 170, width: 560, padding: '16px 24px', background: UI.box, border: `4px solid ${color}`, borderRadius: 26, boxShadow: `0 0 30px ${color}55`}}>
			<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 700, fontSize: 32, color: UI.cream}}>
				<span>"I want mummy"</span>
				<span style={{color, opacity: note === 'LOST' ? 0.5 + 0.5 * Math.sin(frame * 0.5) : 1}}>{note}</span>
			</div>
			<div style={{display: 'flex', gap: 8, marginTop: 12}}>
				{[...Array(12)].map((_, i) => (
					<div key={i} style={{flex: 1, height: 22 + i * 3, alignSelf: 'flex-end', borderRadius: 6, background: i < Math.round(value * 12) ? color : 'rgba(255,255,255,0.12)'}} />
				))}
			</div>
		</div>
	);
};

export const Search: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const blocked = l2.a;
	const found = cue(l2, 'There.');
	const x = lerp(-6, 8, span(frame, 0, dur));
	const signal = frame < l1.a ? 0.35 + 0.25 * Math.sin(frame * 0.08) : frame < blocked ? lerp(0.45, 0.75, span(frame, l1.a, blocked)) : frame < found ? 0.05 : 0.95;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[{at: [x, 1.1, 0.8], dist: 7, yaw: -20, pitch: 8, dyaw: 6}, C(x, 0.8, 55, 1.7), {at: [x, 1.2, 0.8], dist: 4, yaw: 60, pitch: 6}, C(x, 0.8, 75, 1.7, 4)]}
				light={LIGHT.fair}
				bg={BG.dusk}
				far={<Fair3 frame={frame} />}
				near={
					<group>
						{fairCrowd(frame)}
						{frame > blocked && frame < found
							? [0, 1, 2, 3].map((i) => <Hero3D key={`b${i}`} who={P2.extras[i + 2]} lite position={[x + 0.8 + i * 0.6, 0, -0.2 - i * 0.45]} turn={-Math.PI / 2} />)
							: null}
						<Hero3D position={[x, 0, 0.8]} walk={frame < blocked || frame > found ? frame / 14 : undefined} turn={Math.PI / 2 + Math.sin(frame * 0.05) * 0.5} face="determined" blink={frame > blocked && frame < found ? 1 : undefined} />
						<Hero3D who={P2.driver} lite position={[x + 2.5, 0, -1.5]} turn={-0.4} face="determined" />
					</group>
				}
				overlay={(cam) => (
					<>
						<Meter value={signal} frame={frame} />
						<Thought cam={cam} head={top(x + 2.5, -1.5)} text="Did I lock the car? Did I?" frame={frame} at={cue(l1, 'a man thinking')} until={cue(l1, 'Your head')} size={30} />
						{frame > cue(l1, 'nose') && frame < blocked ? <AbsoluteFill style={{background: 'rgba(200,0,30,0.12)', opacity: 0.5 + 0.5 * Math.sin(frame * 0.4)}} /> : null}
						<Big text="BEHIND THE GHOST TRAIN" x={960} y={860} size={64} frame={frame} at={found} color={UI.green} />
					</>
				)}
			/>
			<Sound name="heart" at={0} volume={0.45} loop={dur} />
			<Sound name="crowd" at={blocked} volume={0.5} />
		</>
	);
};

export const Found: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const back = l1.a;
	const kneel = cue(l0, 'You kneel');
	if (frame >= back) {
		const f = frame - back;
		const mumX = lerp(8, 1.2, span(f, 0, 30));
		return (
			<Shot3
				frame={f}
				dur={dur - back}
				lines={[{...l1, a: 0, b: l1.b - back}]}
				angles={[W(0.4, 0.1, 5, 0, 8), C(0.6, 0.1, -15, 1.4)]}
				light={LIGHT.fair}
				bg={BG.dusk}
				far={<Fair3 frame={frame} />}
				near={
					<group>
						<Hero3D position={[-0.6, 0, 0]} face="happy" turn={0.3} />
						<Hero3D who={P2.girl} height={1.05} position={[0.2, 0, 0.2]} face="happy" turn={0.4} />
						<Hero3D who={P2.extras[7]} position={[mumX, 0, 0]} face="happy" walk={f < 30 ? f / 5 : undefined} run={f < 30} turn={-Math.PI / 2} armL={f > 30 ? [100, 150] : undefined} armR={f > 30 ? [100, 150] : undefined} />
					</group>
				}
			/>
		);
	}
	return (
		<Shot3
			frame={frame}
			dur={back}
			lines={lines.slice(0, 1)}
			angles={[W(10.6, -0.6, 4.5, 0, 10), C(11.2, -0.6, -40, 1.05), C(10, -0.6, 45, 1.3)]}
			light={LIGHT.sunset}
			bg={BG.dusk}
			far={<Fair3 frame={frame} />}
			near={
				<group>
					<Hero3D who={P2.girl} height={1.05} position={[11.2, 0.15, -0.6]} sit turn={-0.9} face="sad" talk={0.2} armL={[40, 70]} armR={[40, 70]} />
					<Hero3D position={[10, frame > kneel ? 0.1 : 0, -0.6]} sit={frame > kneel} turn={0.9} walk={frame < kneel ? frame / 14 : undefined} face="happy" reachR={frame > kneel ? 50 : 0} armR={frame > kneel ? [40, 60] : undefined} />
				</group>
			}
			overlay={(cam) => (
				<>
					<Thought cam={cam} head={[11.2, 1.3, -0.6]} text="Strangers are scary... I want mummy" frame={frame} at={cue(l0, 'too scared')} until={cue(l0, 'because you can hear') + 20} size={28} />
					<Thought cam={cam} head={[11.2, 1.3, -0.6]} text="...they know mummy?" frame={frame} at={cue(l0, 'because you can hear') + 26} size={30} />
				</>
			)}
		/>
	);
};

export const Quiet: React.FC<ShotProps> = ({frame, dur, lines}) => (
	<Shot3
		frame={frame}
		dur={dur}
		lines={lines}
		cuts={[0]}
		angles={[{at: [0, 1, 0], dist: 7, yaw: 25, pitch: 6, dyaw: 8}]}
		light={LIGHT.sunset}
		bg={BG.dusk}
		far={<Fair3 frame={frame} />}
		near={
			<group>
				<Box size={[2, 0.08, 0.5]} at={[0, 0.44, -0.12]} color="#8A5A3E" />
				<Box size={[2, 0.45, 0.06]} at={[0, 0.78, -0.38]} color="#8A5A3E" />
				{[-0.85, 0.85].map((x) => (
					<Box key={x} size={[0.08, 0.44, 0.44]} at={[x, 0.22, -0.12]} color="#2A2350" outline={0.01} />
				))}
				<Hero3D position={[0, 0.46, 0]} sit face="happy" armL={[30, 60]} armR={[30, 60]} />
			</group>
		}
	/>
);

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2, l3, l4] = lines;
	const lookAt = cue(l2, 'They turn');
	// Everyone faces us; you sit in the front row; the new kid sits behind you and never stops watching.
	const rows: Array<[number, number]> = [
		[-2.2, -1.2],
		[2.2, -1.2],
		[-2.2, -2.6],
		[0, -2.6],
		[2.2, -2.6],
	];
	const kid: [number, number] = [1.0, -2.0];
	const you: [number, number] = [-0.6, -0.8];
	const bubbles = ['So bored', 'Lunch?', 'Maths, ugh', 'Who is that?', 'Hungry'];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					frame < l1.a
						? [W(0, -1.8, 8, 0, 14), C(you[0], you[1], 10, 1.9)]
						: frame < l3.a
							? [C(kid[0], kid[1], -8, 1.9), C(you[0], you[1], 12, 1.9, -3), M(kid[0], kid[1], -12, 1.9)]
							: [{at: [kid[0], 1.38, kid[1]], dist: 2.5, pitch: 3, fov: 28, ddist: -0.4}, C(you[0], you[1], 8, 1.9, 4), {at: [kid[0], 1.4, kid[1]], dist: 2.1, pitch: 2, fov: 26, ddist: -0.2}]
				}
				light={LIGHT.morning}
				bg={BG.room}
				far={
					<Room3 look={ROOM3.classroom} d={10}>
						<Board3 at={[0, 2.2, -4.85]} />
					</Room3>
				}
				near={
					<group>
						{[...rows, kid, you].map(([x, z], i) => (
							<group key={i}>
								<Desk3 at={[x, 0, z + 0.5]} w={0.9} d={0.55} h={0.72} color="#C98A5A" />
								<Chair3 at={[x, 0, z - 0.1]} color="#3FB7E8" />
							</group>
						))}
						{rows.map(([x, z], i) => (
							<Hero3D key={i} who={P2.extras[i]} lite position={[x, 0.46, z]} sit face="neutral" armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
						))}
						<Hero3D who={P2.newKid} position={[kid[0], 0.46, kid[1]]} sit turn={-0.15} face={frame > l3.a ? 'smug' : 'neutral'} look={frame > lookAt ? [-0.5, 0.1] : [0, 0]} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
						<Hero3D position={[you[0], 0.46, you[1]]} sit turn={frame > lookAt ? lerp(0, 0.5, span(frame, lookAt, lookAt + 15)) : 0} face={frame > l3.a ? 'shocked' : frame > l1.a ? 'scared' : 'neutral'} look={frame > l1.a ? [0.7, 0] : [0, 0]} armL={[60, 110]} armR={[60, 110]} reachL={40} reachR={40} />
					</group>
				}
				overlay={(cam) => (
					<>
						{rows.map(([x, z], i) => (
							<Thought key={i} cam={cam} head={top(x, z, 0.46, true)} text={bubbles[i]} frame={frame} at={cue(l0, 'same old noise') + i * 6} until={l1.a + 10} size={26} />
						))}
						{frame > cue(l1, 'Complete silence') && frame < l3.a ? (
							<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>
								{(() => {
									const [hx, hy0] = project(cam, [kid[0], 1.95, kid[1]]);
									const hy = Math.max(270, hy0);
									return (
										<div style={{position: 'absolute', left: hx, top: hy - 60, transform: 'translate(-50%, -50%)', width: 120, height: 120, borderRadius: 60, border: '6px dashed rgba(255,255,255,0.8)', fontFamily: FONT, fontWeight: 700, fontSize: 56, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: '0 4px 0 #140A28'}}>
											?
										</div>
									);
								})()}
							</div>
						) : null}
						<Label text="THEIR THOUGHTS: NOTHING. SILENCE." x={960} y={860} frame={frame} at={cue(l1, 'Complete silence')} until={l3.a} color={UI.cyan} />
						{frame > l3.a ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(20,10,60,0) 25%, rgba(20,10,60,0.85) 75%)', opacity: span(frame, l3.a, l3.a + 15)}} /> : null}
						{frame > l3.a ? (
							<AbsoluteFill style={{alignItems: 'center'}}>
								<div style={{position: 'absolute', top: 790, fontFamily: FONT, fontWeight: 700, fontSize: 92, color: '#C9A6FF', textShadow: '0 0 40px #7F5AF0, 0 6px 0 #140A28', opacity: span(frame, l3.a, l3.a + 12) * (1 - span(frame, l4.a + 30, l4.a + 50)), fontStyle: 'italic'}}>
									"I can hear you too."
								</div>
							</AbsoluteFill>
						) : null}
						{frame > l4.a + 50 ? <AbsoluteFill style={{background: '#000', opacity: span(frame, dur - 25, dur)}} /> : null}
					</>
				)}
			/>
			<Sound name="timestop" at={l3.a} volume={0.5} />
		</>
	);
};

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
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
			near={<Hero3D position={[0, 0, 0]} face="smug" armR={[100, 160]} aura="#7F5AF0" />}
			overlay={() => (
				<>
					<Big text="WOULD YOU?" x={960} y={250} size={110} frame={frame} at={cue(l0, 'would you')} />
					<Label text="TELL US IN THE COMMENTS" x={960} y={860} frame={frame} at={cue(l0, 'comments')} until={cue(l0, 'subscribe') - 2} color={UI.yellow} />
					<Label text="SUBSCRIBE FOR MORE WHAT IFS" x={960} y={860} frame={frame} at={cue(l0, 'subscribe')} />
				</>
			)}
		/>
	);
};

