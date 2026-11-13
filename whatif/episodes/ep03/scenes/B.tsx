import React from 'react';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Bars, Big, Label, UI} from '../../../components/ui';
import {Hero3D} from '../../../three/Hero3D';
import {Dog3D} from '../../../three/props3d';
import {CanvasPlane, Cloak3D, CoffeeMachine3D, Hair3D, HonestyBox3D, Octopus3D, OliveTree3D, Ring3D, Sheep3D, Snake3D, StudyPoster3D, Tank3D, Temple3D, Throne3D, Umbrella3D} from '../../../three/props3d2';
import {Box, Counter3, Plant3, Room3, ROOM3, School3, Screen3, Street3} from '../../../three/sets3d';
import {project} from '../../../three/Stage3D';
import {C, M, Shot3, Says, Thought, W, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {ThermalHud} from './hud';
import {BG, HOT, LIGHT, P3} from './kit';
import {handAt, headAt, mixArm, top, type V3} from './util';

// Part B: what gives you away, the honesty question, and real cloaks.

// ---------------------------------------------------------------- shadow

export const Shadow: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const odd = cue(l0, 'something odd');
	const except = cue(l0, 'except you');
	const why = cue(l0, 'A shadow is');
	const you: V3 = [0.6, 0, -0.4];
	const kids: Array<[number, number, number]> = [
		[-2.6, -1.4, 0.4],
		[-1.2, -2.6, -0.3],
		[2.4, -1.8, -0.6],
		[3.4, -0.2, -1.2],
		[-3.2, 0.4, 0.9],
	];
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[{at: [0, 0.6, -0.8], dist: 7.5, pitch: 34, yaw: 4}, {at: [0.9, 0.5, -0.8], dist: 3.8, pitch: 42, yaw: 18}, C(0.6, -0.4, 8)]}
			light={LIGHT.sunny}
			bg={BG.sky}
			blur={0}
			far={<School3 />}
			near={
				<group>
					{kids.map(([x, z, r], i) => (
						<Hero3D key={i} who={P3.extras[i]} position={[x, 0, z]} turn={r} face={i % 2 ? 'happy' : 'neutral'} walk={i % 2 ? frame / 18 + i : undefined} lite />
					))}
					<Hero3D position={you} ghost={1} face={frame > except ? 'shocked' : 'neutral'} look={frame > odd ? [0.5, 1] : [0, 0]} />
				</group>
			}
			overlay={(cam) => {
				const [x, y] = project(cam, [you[0] + 0.55, 0, you[2] - 0.55]);
				const [x2] = project(cam, [you[0] + 1.25, 0, you[2] - 0.55]);
				const r = Math.abs(x2 - x);
				const p = span(frame, except, except + 10);
				return (
					<>
						{p > 0 ? (
							<div style={{position: 'absolute', left: x - r, top: y - r * 0.45, width: r * 2, height: r * 0.9, borderRadius: '50%', border: `6px dashed ${UI.yellow}`, opacity: p, display: 'flex', alignItems: 'center', justifyContent: 'center', color: UI.yellow, fontSize: 60, fontWeight: 700}}>?</div>
						) : null}
						<Label text="NO LIGHT BLOCKED = NO SHADOW" x={960} y={880} frame={frame} at={why} size={46} color={UI.yellow} />
					</>
				);
			}}
		/>
	);
};

// ---------------------------------------------------------------- dog

const Garden: React.FC = () => (
	<group>
		<Box size={[40, 0.1, 30]} at={[0, -0.05, 0]} color="#5BB060" outline={0} />
		{[...Array(30)].map((_, i) => (
			<Box key={i} size={[0.36, 1.6, 0.08]} at={[-8 + i * 0.55, 0.8, -4.4]} color={i % 2 ? '#C98A5A' : '#B8784A'} outline={0.008} />
		))}
		<Box size={[17, 0.1, 0.1]} at={[0, 1.3, -4.34]} color="#8A5A3E" outline={0} />
		<group position={[-3.4, 0, -2.9]} rotation={[0, 0.4, 0]}>
			<Box size={[1.2, 0.9, 1.0]} at={[0, 0.45, 0]} color="#E8453C" />
			<T shape={{kind: 'cyl', r: 0.9, h: 1.3, seg: 3}} color="#8A2A2A" position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[1, 1, 0.5]} />
			<Box size={[0.5, 0.55, 0.02]} at={[0, 0.32, 0.51]} color="#2A1420" outline={0} />
		</group>
		{[...Array(14)].map((_, i) => (
			<group key={i} position={[-6 + i * 0.9, 0, -3.9 + (i % 2) * 0.25]}>
				<T shape={{kind: 'cyl', r: 0.02, h: 0.4}} color="#2E8A4A" position={[0, 0.2, 0]} outline={0} />
				<T shape={{kind: 'sphere', r: 0.09}} color={['#FF4FD8', '#FFD84A', '#E8453C', '#C9A6FF'][i % 4]} position={[0, 0.42, 0]} outline={0.006} />
			</group>
		))}
		<group position={[4.2, 0, -3.4]}>
			<T shape={{kind: 'cyl', r: 0.2, r2: 0.28, h: 2.4}} color="#7A5A3E" position={[0, 1.2, 0]} />
			{[[0, 2.8, 0], [0.6, 2.4, 0.2], [-0.6, 2.5, -0.1]].map((p, i) => (
				<T key={i} shape={{kind: 'sphere', r: 0.85}} color={i % 2 ? '#3FA05A' : '#4FB86A'} position={p as V3} />
			))}
		</group>
	</group>
);

export const DogScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const sniff = cue(l0, 'sniffs twice');
	const trots = cue(l0, 'trots');
	const smell = cue(l1, 'three hundred');
	const toast = cue(l1, 'Like toast');
	const you: V3 = [1.3, 0, -1.0];
	const go = span(frame, trots - 4, trots + 40);
	const dog: V3 = [lerp(-2.2, 0.55, go), 0, lerp(-1.6, -0.9, go)];
	const rot = frame < trots - 4 ? -Math.PI / 2 + Math.sin(frame * 0.2) * 0.15 : lerp(-Math.PI / 2, -0.1, span(frame, trots - 4, trots + 8));
	const pet = span(frame, trots + 40, trots + 56);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					frame < l1.a
						? [W(-0.4, -1.2, 7, 0, 12), {at: [dog[0] + 0.3, 0.6, dog[2]], dist: 2.2, yaw: 10, pitch: 10, fov: 32}, {at: [0.8, 0.8, -1.0], dist: 3.6, yaw: 25, pitch: 10}]
						: [{at: [0.9, 0.8, -1.0], dist: 3.8, yaw: -10, pitch: 10}, {at: [0.8, 0.65, -0.95], dist: 2.2, yaw: 30, pitch: 12, fov: 32}, C(1.3, -1.0, -25)]
				}
				light={LIGHT.day}
				bg={BG.sky}
				far={<Garden />}
				near={
					<group>
						<Dog3D at={dog} rot={rot} frame={frame} walk={frame > trots - 4 && frame < trots + 40 ? frame / 7 : undefined} />
						<Hero3D position={you} turn={-0.9} ghost={1} face={frame > trots + 20 ? 'happy' : 'neutral'} look={[-0.8, 0.8]} armR={mixArm([12, 6], [40, 30], pet)} reachR={lerp(0, 55, pet)} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Thought cam={cam} head={[dog[0] + 0.4, 1.15, dog[2]]} text="sniff... sniff..." frame={frame} at={sniff} until={trots + 10} size={34} />
						<Thought cam={cam} head={[dog[0] + 0.4, 1.15, dog[2]]} text="TOAST + TRAINERS = YOU!" frame={frame} at={toast} size={34} />
						{frame >= smell - 2 && frame < toast - 4 ? (
							<Bars
								x={360}
								y={190}
								w={1200}
								frame={frame}
								at={smell}
								items={[
									{label: 'DOG', value: 0.98, color: UI.orange, note: '≈ 300 MILLION'},
									{label: 'YOU', value: 0.03, color: UI.cyan, note: '≈ 6 MILLION'},
								]}
							/>
						) : null}
						{frame >= smell - 2 && frame < toast - 4 ? <Label text="SMELL RECEPTORS" x={960} y={880} frame={frame} at={smell + 6} size={42} /> : null}
					</>
				)}
			/>
			<Sound name="pop" at={sniff} volume={0.3} />
			<Sound name="steps" at={trots} volume={0.3} loop={40} />
			<Sound name="pop" at={toast} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- rain

/** Raindrops sitting on an invisible body: fixed points on head, body and legs. */
const DROPS: V3[] = [...Array(70)].map((_, i) => {
	const a = i * 2.39996;
	const kind = i % 7;
	if (kind < 2) {
		const v = ((i * 0.618) % 1) * 2 - 1;
		const rr = Math.sqrt(1 - v * v);
		return [Math.cos(a) * rr * 0.33, 1.36 + v * 0.33, Math.sin(a) * rr * 0.33];
	}
	if (kind < 5) {
		return [Math.cos(a) * 0.29, 0.5 + ((i * 0.37) % 1) * 0.58, Math.sin(a) * 0.29];
	}
	return [(i % 2 ? 0.09 : -0.09) + Math.cos(a) * 0.08, 0.08 + ((i * 0.53) % 1) * 0.4, Math.sin(a) * 0.08];
});

export const Rain: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const lands = cue(l0, 'lands on you');
	const outline = cue(l0, 'outline');
	const drops = cue(l0, 'drops his umbrella');
	const home = cue(l0, 'long way home');
	const wet = span(frame, lands, outline + 10);
	const you: V3 = [lerp(1.6, -3.6, frame / dur), 0, -4.0];
	const turn = -Math.PI / 2;
	const man: V3 = [-2.1, 0, -5.4];
	const fall = span(frame, drops, drops + 14);
	const streaks: React.ReactNode[] = [];
	for (let i = 0; i < 320; i++) {
		const x = ((i * 37.3) % 18) - 9;
		const z = ((i * 13.7) % 12) - 9;
		const y = 7 - ((frame * 0.5 + i * 0.83) % 7);
		streaks.push(<Glow key={i} shape={{kind: 'box', w: 0.022, h: 0.42, d: 0.022}} color="#E8F2FF" position={[x, y, z]} opacity={0.8} />);
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[{at: [you[0] - 0.4, 1.1, you[2]], dist: 5.4, yaw: -8, pitch: 6}, {at: [you[0], 1.15, you[2]], dist: 2.9, yaw: -55, pitch: 6}, C(man[0], man[2], 30), {at: [you[0] - 0.3, 1.15, you[2]], dist: 3.4, yaw: -25, pitch: 4}]}
				light={LIGHT.rain}
				bg={BG.rain}
				far={
					<Street3>
						{[[-4, 1.5], [2, 0.4], [5.5, 2.2]].map(([x, z], i) => (
							<Glow key={i} shape={{kind: 'cyl', r: 0.9 + i * 0.2, h: 0.01, seg: 32}} color="#AFC8E8" position={[x, 0.01, z]} opacity={0.45} />
						))}
						<group position={[man[0] - 0.2, 0, man[2] - 0.5]}>
							<Box size={[2.4, 0.08, 1.1]} at={[0, 2.4, 0.2]} color="#2A2350" />
							<T shape={{kind: 'box', w: 2.4, h: 2.2, d: 0.04}} color="#CFEFFF" position={[0, 1.2, -0.3]} opacity={0.3} outline={0.01} />
							<Box size={[0.08, 2.4, 0.08]} at={[1.16, 1.2, -0.3]} color="#2A2350" outline={0.006} />
							<Box size={[0.08, 2.4, 0.08]} at={[-1.16, 1.2, -0.3]} color="#2A2350" outline={0.006} />
						</group>
					</Street3>
				}
				near={
					<group>
						{streaks}
						{[...Array(5)].map((_, i) => {
							const t = ((frame * 0.03 + i * 0.37) % 1);
							return <T key={i} shape={{kind: 'torus', r: 0.1 + t * 0.4, tube: 0.01}} color="#DCEBFF" position={[-3 + i * 1.6, 0.02, 0.4 + (i % 2) * 1.4]} rotation={[Math.PI / 2, 0, 0]} opacity={1 - t} outline={0} />;
						})}
						<Hero3D position={you} turn={turn} ghost={1 - wet * 0.42} face={frame > drops ? 'smug' : 'sad'} walk={frame / 15} shimmer={false} />
						<group position={you} rotation={[0, turn, 0]}>
							{DROPS.map((d, i) => {
								const on = span(frame, lands + (i % 23) * 2, lands + (i % 23) * 2 + 4);
								return on > 0 ? <Glow key={i} shape={{kind: 'sphere', r: 0.032, seg: 8}} color="#E8F6FF" position={[d[0], d[1] + Math.abs(Math.cos((frame / 15) * Math.PI * 2)) * 0.03, d[2]]} opacity={on * (0.7 + 0.3 * Math.sin(frame * 0.3 + i))} /> : null;
							})}
						</group>
						<Hero3D who={P3.man} position={man} turn={0.6} face={frame > drops ? 'shocked' : 'neutral'} armR={frame < drops ? [40, 150] : [130, 200]} reachR={frame < drops ? 20 : 0} armL={frame > drops ? [130, 200] : undefined} />
						{frame < drops ? (
							<Umbrella3D at={[man[0] + 0.1, 2.15, man[2] + 0.1]} color="#3FB7E8" />
						) : (
							<group position={[man[0] + 0.5 * fall, lerp(2.15, 0.3, fall), man[2] + 0.4 * fall]} rotation={[0, 0, -1.3 * fall]}>
								<Umbrella3D at={[0, 0, 0]} color="#3FB7E8" />
							</group>
						)}
					</group>
				}
				overlay={() => (
					<>
						<Label text="EVERY DROP SHOWS WHERE YOU ARE" x={960} y={880} frame={frame} at={lands + 6} until={drops - 4} size={42} color={UI.cyan} />
						<Label text="THE LONG WAY HOME..." x={960} y={880} frame={frame} at={home} size={40} />
					</>
				)}
			/>
			<Sound name="rain" at={0} volume={0.35} loop={dur} />
			<Sound name="thud" at={drops + 12} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- heat camera

const VISITORS: Array<[number, number, number]> = [
	[-1.7, -1.3, 0],
	[-0.5, -1.6, 1],
	[1.7, -1.4, 2],
];
const YOU_HEAT: V3 = [0.6, 0, -1.15];

/** The heat camera's picture, drawn on the museum screen: glowing figures on a dark blue ground. */
const drawThermal = (ctx: CanvasRenderingContext2D, W2: number, H: number) => {
	ctx.fillStyle = '#1A0E5A';
	ctx.fillRect(0, 0, W2, H);
	const g = ctx.createLinearGradient(0, H * 0.75, 0, H);
	g.addColorStop(0, '#2A1A7A');
	g.addColorStop(1, '#3A2A9A');
	ctx.fillStyle = g;
	ctx.fillRect(0, H * 0.75, W2, H * 0.25);
	const people = [...VISITORS.map(([x]) => x), YOU_HEAT[0]];
	for (const x of people) {
		const cx = W2 / 2 + (x / 2.2) * (W2 / 2);
		const body = ctx.createRadialGradient(cx, H * 0.62, 4, cx, H * 0.62, H * 0.3);
		body.addColorStop(0, '#FFF4A0');
		body.addColorStop(0.5, '#FF8A2A');
		body.addColorStop(1, 'rgba(200,30,60,0)');
		ctx.fillStyle = body;
		ctx.beginPath();
		ctx.ellipse(cx, H * 0.62, H * 0.13, H * 0.26, 0, 0, Math.PI * 2);
		ctx.fill();
		const head = ctx.createRadialGradient(cx, H * 0.3, 2, cx, H * 0.3, H * 0.11);
		head.addColorStop(0, '#FFFFFF');
		head.addColorStop(0.5, '#FFE24A');
		head.addColorStop(1, 'rgba(255,120,40,0)');
		ctx.fillStyle = head;
		ctx.beginPath();
		ctx.arc(cx, H * 0.3, H * 0.11, 0, Math.PI * 2);
		ctx.fill();
	}
};

const Museum: React.FC<{hot: boolean; frame: number}> = ({hot, frame}) => {
	const c = (normal: string, heat: string) => (hot ? heat : normal);
	return (
		<Room3 look={hot ? {wall: '#0E0638', floor: '#140A48', trim: '#1E1060'} : {wall: '#3A3A7A', floor: '#C9C2D8', trim: '#7F5AF0'}}>
			<Screen3 at={[0, 2.35, -4.36]} w={3.4} h={1.9} color={c('#1A0E5A', '#2A1A7A')} />
			{!hot ? <CanvasPlane w={3.4} h={1.9} px={680} dep="thermal" position={[0, 2.35, -4.29]} draw={drawThermal} /> : null}
			<CanvasPlane w={2.2} h={0.36} px={560} dep={`sign${hot}`} position={[0, 3.6, -4.36]} draw={(ctx, W2, H) => {
				ctx.fillStyle = hot ? '#2A1A7A' : '#FFD84A';
				ctx.fillRect(0, 0, W2, H);
				ctx.fillStyle = hot ? '#3A2A9A' : '#2A2350';
				ctx.font = `bold ${H * 0.6}px Fredoka, sans-serif`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText('HEAT CAMERA', W2 / 2, H * 0.54);
			}} />
			<group position={[2.4, 0, -3.5]} rotation={[0, -0.4, 0]}>
				{[-1, 0, 1].map((k) => (
					<T key={k} shape={{kind: 'cyl', r: 0.02, h: 1.3}} color={c('#2A2350', '#3A2A9A')} position={[k * 0.15, 0.62, (k === 0 ? -0.15 : 0.08)]} rotation={[k === 0 ? 0.2 : -0.1, 0, k * 0.2]} outline={0.005} />
				))}
				<Box size={[0.32, 0.24, 0.4]} at={[0, 1.38, 0]} color={c('#2A2350', '#3A2A9A')} />
				<T shape={{kind: 'cyl', r: 0.09, h: 0.16}} color={c('#55597A', '#3A2A9A')} position={[0, 1.38, 0.26]} rotation={[Math.PI / 2, 0, 0]} outline={0.006} />
				{!hot ? <Glow shape={{kind: 'sphere', r: 0.03}} color="#FF5A5A" position={[0.12, 1.52, 0.2]} opacity={frame % 30 < 18 ? 1 : 0.2} /> : null}
			</group>
			<Box size={[1, 1, 1]} at={[-4.2, 0.5, -3.2]} color={c('#7F5AF0', '#2A1A7A')} />
			<T shape={{kind: 'sphere', r: 0.4}} color={c('#7FE0FF', '#2A1A7A')} position={[-4.2, 1.4, -3.2]} />
			<Box size={[1, 1, 1]} at={[-2.6, 0.5, -3.6]} color={c('#FF8A3D', '#2A1A7A')} />
			<T shape={{kind: 'cone', r: 0.35, h: 0.8}} color={c('#FFD84A', '#2A1A7A')} position={[-2.6, 1.4, -3.6]} />
		</Room3>
	);
};

const Mouse: React.FC<{at: V3; hot: boolean}> = ({at, hot}) => (
	<group position={at}>
		<T shape={{kind: 'sphere', r: 0.08}} color={hot ? '#FFE24A' : '#8F8AA8'} scale={[1.4, 0.8, 0.9]} outline={0.006} />
		<T shape={{kind: 'sphere', r: 0.045}} color={hot ? '#FFF4A0' : '#8F8AA8'} position={[0.11, 0.02, 0]} outline={0.005} />
		{[-1, 1].map((s) => (
			<T key={s} shape={{kind: 'sphere', r: 0.025}} color={hot ? '#FF8A2A' : '#C9A6B8'} position={[0.09, 0.07, s * 0.04]} outline={0.004} />
		))}
		<T shape={{kind: 'capsule', r: 0.008, len: 0.16}} color={hot ? '#E8453C' : '#C9A6B8'} position={[-0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]} outline={0} />
	</group>
);

export const Heat: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const everyone = cue(l0, 'Everyone on the screen');
	const soDo = cue(l0, 'so do you');
	const temp = cue(l1, 'thirty seven');
	const ir = cue(l1, 'infrared');
	const eyesCant = cue(l1, "Our eyes can't");
	const camCan = cue(l1, 'but this camera');
	const notInv = cue(l1, 'not invisible at all');
	const vipers = cue(l2, 'Pit vipers');
	const mouse = cue(l2, 'warm mouse');
	const cuts = [0, everyone - 3, soDo - 3, temp - 3, eyesCant - 3, camCan - 3, notInv - 3, l2.a - 3, vipers - 3, mouse - 3];
	const hotOf = [false, true, true, true, false, true, true, false, false, true];
	const angles: Angle3[] = [
		{at: [0, 1.6, -1.8], dist: 7.2, pitch: 8, yaw: 0},
		{at: [0, 1.1, -1.3], dist: 5.6, yaw: 180, pitch: 4},
		{at: [YOU_HEAT[0], 1.15, YOU_HEAT[2]], dist: 2.6, yaw: 180, pitch: 3, fov: 30},
		{at: [0, 1.1, -1.3], dist: 5, yaw: 165, pitch: 6},
		{at: [YOU_HEAT[0], 1.3, YOU_HEAT[2]], dist: 1.9, yaw: 0, pitch: 2, fov: 30},
		{at: [0.2, 1.1, -1.3], dist: 4.6, yaw: 195, pitch: 5},
		{at: [YOU_HEAT[0], 1.15, YOU_HEAT[2]], dist: 2.3, yaw: 180, pitch: 2, fov: 30},
		{at: [2.6, 1.35, -2.6], dist: 3.2, yaw: -8, pitch: 12},
		{at: [3.8, 1.2, -2.6], dist: 1.7, yaw: 25, pitch: 14, fov: 30},
		{at: [2.8, 1.2, -2.6], dist: 2.2, yaw: 0, pitch: 10, fov: 30},
	];
	let i = 0;
	while (i + 1 < cuts.length && frame >= cuts[i + 1]) {
		i++;
	}
	const hot = hotOf[i];
	const youTurn = frame >= eyesCant - 3 && frame < camCan - 3 ? 0 : Math.PI;
	const snake = frame >= l2.a - 3;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={hot ? LIGHT.thermal : LIGHT.museum}
				bg={hot ? BG.thermal : BG.room}
				far={
					<group>
						<Museum hot={hot} frame={frame} />
						<Tank3D at={[2.7, 0, -2.6]}>
							{hot && snake ? null : <Snake3D at={[0, 0.12, 0]} frame={frame} />}
							{snake ? <Mouse at={[-0.7, 0.2, 0.2]} hot={hot} /> : null}
						</Tank3D>
					</group>
				}
				near={
					<group>
						{VISITORS.map(([x, z, k]) => (
							<Hero3D key={k} who={hot ? [HOT.a, HOT.b, HOT.c][k] : P3.extras[k + 2]} position={[x, 0, z]} turn={Math.PI} face="happy" armR={k === 1 ? [100, 150] : undefined} lite />
						))}
						<Hero3D who={hot ? HOT.you : undefined} position={YOU_HEAT} turn={youTurn} ghost={hot ? 0 : 1} face={hot ? 'shocked' : 'smug'} armL={hot ? [70, 120] : undefined} armR={hot ? [70, 120] : undefined} />
						{hot && snake ? (
							<group position={[2.7, 0.9, -2.6]}>
								<Snake3D at={[0, 0.12, 0]} frame={frame} cold />
							</group>
						) : null}
					</group>
				}
				overlay={(cam) => {
					const pit = project(cam, [3.95, 1.2, -2.6]);
					return (
						<>
							{hot && !snake ? <ThermalHud frame={frame} /> : null}
							{hot && snake ? <ThermalHud frame={frame} /> : null}
							<Big text="≈ 37°C" x={960} y={250} size={110} frame={frame} at={temp} until={eyesCant - 4} color={UI.yellow} />
							<Label text="WARM THINGS GIVE OFF INFRARED LIGHT" x={960} y={880} frame={frame} at={ir} until={eyesCant - 4} size={42} color={UI.orange} />
							<Label text="OUR EYES CAN'T SEE IT" x={960} y={880} frame={frame} at={eyesCant} until={camCan - 4} size={44} />
							<Label text="TO A HEAT CAMERA: NOT INVISIBLE" x={960} y={880} frame={frame} at={notInv} until={l2.a - 4} size={44} color={UI.yellow} />
							<Big text="PIT VIPER" x={960} y={240} size={96} frame={frame} at={vipers} until={mouse - 4} color={UI.green} />
							{frame >= vipers + 10 && frame < mouse - 4 ? <Label text="← HEAT-SENSING PITS" x={pit[0] + 250} y={pit[1] - 60} frame={frame} at={vipers + 10} size={38} color={UI.yellow} /> : null}
							<Label text="IT FINDS WARM PREY IN THE DARK" x={960} y={880} frame={frame} at={mouse} size={42} color={UI.orange} />
						</>
					);
				}}
			/>
			<Sound name="swish" at={everyone - 3} volume={0.4} />
			<Sound name="swish" at={camCan - 3} volume={0.35} />
			<Sound name="pop" at={temp} volume={0.4} />
			<Sound name="swish" at={mouse - 3} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- canteen

const YOU_C: V3 = [-2.7, 0, -1.9];
const LADY: V3 = [1.8, 0, -3.3];

const Canteen: React.FC<{frame: number}> = ({frame}) => (
	<Room3 look={ROOM3.lunch} window={{x: 3.4, w: 2.2}}>
		<Counter3 at={[0, 0, -2.6]} w={5.4} color="#C9CED8" />
		<Box size={[5.6, 0.06, 0.4]} at={[0, 1.0, -2.2]} color="#C9CED8" />
		{[-1.8, -0.6, 0.6].map((x, i) => (
			<group key={x}>
				<Box size={[0.9, 0.05, 0.5]} at={[x, 0.98, -2.6]} color="#7F8AA8" />
				{[...Array(16)].map((_, k) => (
					<Box key={k} size={[0.05, 0.05, 0.22]} at={[x - 0.3 + (k % 6) * 0.11, 1.03 + Math.floor(k / 6) * 0.04, -2.6 + ((k * 7) % 5) * 0.04 - 0.08]} rot={[0, (k * 0.7) % 1.2, 0]} color={i === 0 ? '#FFD84A' : i === 1 ? '#7CC850' : '#E8A84A'} outline={0.004} />
				))}
				{[0, 1, 2].map((k) => {
					const t = (frame * 0.015 + k / 3 + i * 0.2) % 1;
					return <T key={k} shape={{kind: 'sphere', r: 0.06 + t * 0.06}} color="#FFFFFF" position={[x - 0.1 + k * 0.1, 1.15 + t * 0.6, -2.6]} opacity={(1 - t) * 0.35} outline={0} />;
				})}
				<Glow shape={{kind: 'box', w: 0.8, h: 0.05, d: 0.3}} color="#FFB060" position={[x, 1.8, -2.6]} />
			</group>
		))}
		<Box size={[0.5, 0.35, 0.4]} at={[2.3, 1.13, -2.6]} color="#2A2350" />
		<Glow shape={{kind: 'box', w: 0.36, h: 0.18, d: 0.01}} color="#7CF2A0" position={[2.3, 1.2, -2.39]} />
		<CanvasPlane w={2.4} h={0.5} px={600} dep="menu" position={[0, 3.0, -4.38]} draw={(ctx, W2, H) => {
			ctx.fillStyle = '#2A2350';
			ctx.fillRect(0, 0, W2, H);
			ctx.fillStyle = '#FFD84A';
			ctx.font = `bold ${H * 0.55}px Fredoka, sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('CHIPS · £1.20', W2 / 2, H * 0.55);
		}} />
		<Plant3 at={[-5.2, 0, -3.8]} />
	</Room3>
);

export const CanteenScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const chips = cue(l0, 'A tray of hot chips');
	const know = cue(l0, 'Nobody would');
	const reach = span(frame, know - 6, know + 16);
	return (
		<Shot3
			frame={frame}
			dur={dur}
			lines={lines}
			cuts={[0, chips - 3, know - 6]}
			angles={[W(-0.6, -2.2, 7.2, 4, 12), {at: [-1.8, 1.1, -2.5], dist: 1.9, yaw: 25, pitch: 22, fov: 32}, C(YOU_C[0], YOU_C[2], 80, 1.7)]}
			light={LIGHT.day}
			bg={BG.room}
			far={<Canteen frame={frame} />}
			near={
				<group>
					<Hero3D who={P3.dinnerLady} position={LADY} turn={Math.PI} face="neutral" armL={[50 + Math.sin(frame * 0.3) * 10, 100]} reachL={40} armR={[40, 90]} reachR={40} />
					<Hero3D position={YOU_C} turn={Math.PI / 2 + 0.25} ghost={1} face="smug" look={[-0.4, 0.4]} armR={mixArm([12, 6], [35, 40], reach)} reachR={lerp(0, 70, reach)} />
				</group>
			}
			overlay={(cam) => <Thought cam={cam} head={top(YOU_C[0], YOU_C[2])} text="Nobody would ever know..." frame={frame} at={know} size={34} />}
		/>
	);
};

export const Choice: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const on = cue(l0, 'switch yourself back on');
	const pay = cue(l0, 'and you pay');
	const smiles = cue(l0, 'smiles');
	const know = cue(l0, 'Mostly');
	const g = 1 - span(frame, on, on + 20);
	const put = span(frame, 0, 20);
	const payT = span(frame, pay - 4, pay + 12) * (1 - span(frame, smiles + 10, smiles + 24));
	const ladyTurn = lerp(Math.PI, -1.25, span(frame, pay - 10, pay + 10));
	const coin = handAt(YOU_C, Math.PI / 2 + 0.25, [70, 80], 40, 1);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[C(YOU_C[0], YOU_C[2], 70), W(-0.6, -2.4, 7, 6, 12), C(LADY[0], LADY[2], -72), C(YOU_C[0], YOU_C[2], 95, 1.7, 2)]}
				light={LIGHT.day}
				bg={BG.room}
				far={<Canteen frame={frame} />}
				near={
					<group>
						<Hero3D who={P3.dinnerLady} position={LADY} turn={ladyTurn} face={frame > smiles - 4 ? 'happy' : 'neutral'} armL={[30, 60]} armR={[30, 60]} />
						<Hero3D position={YOU_C} turn={Math.PI / 2 + 0.25} ghost={g} face={frame > know ? 'happy' : frame > on ? 'determined' : 'sad'} armR={payT > 0 ? mixArm([12, 6], [70, 80], payT) : mixArm([35, 40], [12, 6], put)} reachR={payT > 0 ? lerp(0, 40, payT) : lerp(70, 0, put)} />
						{payT > 0.6 ? <T shape={{kind: 'cyl', r: 0.05, h: 0.012}} color="#FFD84A" position={coin} rotation={[Math.PI / 2, 0, 0]} outline={0.004} /> : null}
					</group>
				}
				overlay={() => <Big text="BECAUSE YOU'D KNOW." x={960} y={240} size={86} frame={frame} at={cue(l0, "you'd know")} />}
			/>
			<Sound name="appear" at={on} volume={0.5} />
			<Sound name="coins" at={pay + 6} volume={0.45} />
		</>
	);
};

// ---------------------------------------------------------------- honesty box

export const Honesty: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const year = cue(l0, 'two thousand and six');
	const box = cue(l0, 'honesty box');
	const flowers = cue(l0, 'Some weeks');
	const eyes = cue(l0, 'Other weeks');
	const three = cue(l1, 'nearly three times');
	const notReal = cue(l1, 'Not real eyes');
	const eyesOn = frame >= eyes;
	const payer: V3 = [1.2, 0, -3.15];
	const drop = eyesOn ? (frame - eyes) % 50 : 999;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -2.8, 6.6, 0, 10), {at: [0.2, 1.7, -3.9], dist: 2.8, pitch: 10, yaw: 4}, {at: [0.45, 1.15, -3.8], dist: 1.6, yaw: -18, pitch: 22, fov: 32}, {at: [0.4, 1.5, -3.6], dist: 4.0, yaw: 25, pitch: 6}]}
				light={LIGHT.room}
				bg={BG.room}
				far={
					<Room3 look={{wall: '#E8DCC8', floor: '#8A7A6A', trim: '#FFFFFF'}} window={{x: -3.2}}>
						<Counter3 at={[0, 0, -3.9]} w={4} color="#7A9AB8" />
						<CoffeeMachine3D at={[-0.8, 0.96, -3.9]} />
						<HonestyBox3D at={[0.45, 0.96, -3.82]} />
						<StudyPoster3D at={[0.1, 2.05, -4.33]} kind={eyesOn ? 'eyes' : 'flowers'} />
						{[-1.6, -1.35].map((x) => (
							<T key={x} shape={{kind: 'cyl', r: 0.06, h: 0.1}} color={x < -1.5 ? '#E8453C' : '#3FB7E8'} position={[x, 1.02, -3.8]} outline={0.006} />
						))}
						<CanvasPlane w={1.6} h={0.3} px={480} dep="newcastle" position={[3.0, 2.8, -4.36]} draw={(ctx, W2, H) => {
							ctx.fillStyle = '#2A2350';
							ctx.fillRect(0, 0, W2, H);
							ctx.fillStyle = '#FFF3D6';
							ctx.font = `bold ${H * 0.5}px Fredoka, sans-serif`;
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillText('COFFEE ROOM', W2 / 2, H * 0.55);
						}} />
					</Room3>
				}
				near={
					<group>
						<Hero3D who={P3.scientist} position={payer} turn={-2.29} face={eyesOn ? 'shocked' : 'neutral'} armR={drop < 20 ? [50, 90] : [14, 10]} reachR={drop < 20 ? 60 : 0} look={[0, -0.8]} />
						<Hero3D who={P3.extras[5]} position={[-2.2, 0, -2.4]} turn={0.4} face="happy" armR={[70, 140]} reachR={30} lite />
						{drop < 26 ? <T shape={{kind: 'cyl', r: 0.04, h: 0.01}} color="#FFD84A" position={[0.45, lerp(1.4, 1.24, span(drop, 12, 22)), -3.82]} rotation={[Math.PI / 2, 0, 0]} outline={0.004} /> : null}
					</group>
				}
				overlay={() => (
					<>
						<Label text="NEWCASTLE UNIVERSITY · 2006" x={960} y={230} frame={frame} at={year} until={flowers - 4} size={46} />
						<Label text="HONESTY BOX: PAY WHAT YOU OWE" x={960} y={880} frame={frame} at={box} until={flowers - 4} size={42} color={UI.yellow} />
						<Label text="WEEKS WITH FLOWERS" x={960} y={230} frame={frame} at={flowers} until={eyes - 4} size={46} color={UI.green} />
						<Label text="WEEKS WITH EYES" x={960} y={230} frame={frame} at={eyes} until={three - 6} size={46} color={UI.orange} />
						{frame >= three - 4 ? (
							<Bars
								x={360}
								y={190}
								w={1200}
								frame={frame}
								at={three}
								items={[
									{label: 'FLOWERS', value: 0.32, color: UI.green, note: 'PAID 1×'},
									{label: 'EYES', value: 0.9, color: UI.orange, note: '≈ 3×'},
								]}
							/>
						) : null}
						<Label text="JUST A PICTURE OF EYES" x={960} y={880} frame={frame} at={notReal} size={46} color={UI.yellow} />
					</>
				)}
			/>
			<Sound name="coins" at={eyes + 14} volume={0.35} />
			<Sound name="coins" at={eyes + 64} volume={0.35} />
			<Sound name="pop" at={three} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- Gyges

export const Gyges: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const plato = cue(l0, 'the philosopher Plato');
	const gyges = cue(l0, 'Gyges');
	const ring = cue(l0, 'found a ring');
	const inv = cue(l0, 'made him invisible');
	const take = cue(l1, 'take the whole kingdom');
	const asked = cue(l1, 'And Plato asked');
	const q = cue(l1, 'If nobody');
	const palace = frame >= l1.a - 2;
	const shep: V3 = palace ? [lerp(-2.6, 0.2, span(frame, l1.a, take)), 0, lerp(-0.4, -1.6, span(frame, l1.a, take))] : [0, 0, -1];
	const pick = span(frame, ring, ring + 16);
	const armR = mixArm([20, 40], [60, 120], pick);
	const hand = handAt(shep, -0.3, armR, lerp(70, 40, pick), 1);
	const ringPos: V3 = frame < ring ? [0.35, 0.05, -0.35] : hand;
	const g = palace ? 1 : span(frame, inv, inv + 18);
	const crownUp = span(frame, take - 6, take + 24);
	const head = headAt(shep);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={
					palace
						? [W(0.2, -2, 8.5, 0, 10), {at: [shep[0], 1.6, shep[2]], dist: 3.8, yaw: 18, pitch: 6}, {at: [0, 1.8, -2.4], dist: 6, yaw: -10, pitch: 8}]
						: [W(0, -1.5, 9, 0, 8), C(0, -1, -15), {at: [0.3, 0.4, -0.5], dist: 1.6, yaw: -10, pitch: 30, fov: 32}, M(0, -1, 10)]
				}
				light={palace ? LIGHT.palace : LIGHT.greek}
				bg={palace ? BG.room : BG.greek}
				far={
					palace ? (
						<Room3 look={{wall: '#C8784A', floor: '#E8D8B0', trim: '#FFD84A'}} w={14} d={10} h={5}>
							{[-4.5, -2.5, 2.5, 4.5].map((x) => (
								<T key={x} shape={{kind: 'cyl', r: 0.35, h: 5, seg: 20}} color="#F6F1E4" position={[x, 2.5, -4]} outline={0.015} />
							))}
							<Throne3D at={[0.2, 0, -3.2]} frame={frame} crown={false} />
							<Box size={[2.6, 0.04, 5]} at={[0.2, 0.02, -1.6]} color="#B8283C" outline={0} />
						</Room3>
					) : (
						<group>
							<Box size={[60, 0.1, 40]} at={[0, -0.05, 0]} color="#A8B868" outline={0} />
							<T shape={{kind: 'sphere', r: 10, seg: 40}} color="#98B060" position={[-12, -7, -16]} />
							<T shape={{kind: 'sphere', r: 12, seg: 40}} color="#8AA858" position={[10, -8, -20]} />
							<Temple3D at={[5, 1.2, -16]} />
							<OliveTree3D at={[-3.2, 0, -3]} s={1.2} />
							<OliveTree3D at={[3.8, 0, -4.2]} />
							<OliveTree3D at={[-6, 0, -6]} s={0.9} />
							{[[-2.2, -2.2, 0.4], [2.2, -2.6, 2.6], [-1, -3.6, -0.6], [3, -1.4, 3.6]].map(([x, z, r], i) => (
								<Sheep3D key={i} at={[x, 0, z]} rot={r} frame={frame + i * 20} />
							))}
						</group>
					)
				}
				near={
					<group>
						<Hero3D who={P3.shepherd} position={shep} turn={palace ? 0.7 : -0.3} ghost={g} face={frame > inv ? 'shocked' : frame > ring ? 'happy' : 'neutral'} armR={palace ? [14, 10] : armR} reachR={palace ? 0 : lerp(70, 40, pick)} armL={palace ? [14, 10] : [30, 10]} walk={palace && frame < take ? frame / 16 : undefined} />
						{!palace ? <T shape={{kind: 'cyl', r: 0.025, h: 1.9}} color="#8A5A3E" position={handAt(shep, -0.3, [30, 10], 0, -1).map((v, k) => (k === 1 ? v + 0.55 : v)) as V3} outline={0.006} /> : null}
						{!palace ? <Ring3D at={ringPos} frame={frame} s={frame < ring ? 1.4 : 1} /> : null}
						{palace ? (
							<group position={[lerp(0.2, head[0], crownUp), lerp(0.84, head[1] + 0.36, crownUp), lerp(-3.15, head[2], crownUp)]}>
								<T shape={{kind: 'cyl', r: 0.2, h: 0.14}} color="#FFD84A" emissive="#FFB020" emissiveIntensity={0.3} />
								{[...Array(5)].map((_, k) => {
									const a = (k / 5) * Math.PI * 2;
									return <T key={k} shape={{kind: 'cone', r: 0.05, h: 0.14}} color="#FFD84A" position={[Math.cos(a) * 0.17, 0.12, Math.sin(a) * 0.17]} outline={0.006} />;
								})}
							</group>
						) : null}
						{palace
							? [-1.6, 2.0].map((x, k) => <Hero3D key={x} who={{...P3.extras[k + 3], hoodie: '#B8283C'}} position={[x, 0, -2.4]} turn={k ? -0.4 : 0.4} face="neutral" lite />)
							: null}
					</group>
				}
				overlay={() => (
					<>
						<Label text="PLATO · ABOUT 2,400 YEARS AGO" x={960} y={230} frame={frame} at={plato} until={gyges - 4} size={46} />
						<Big text="GYGES" x={960} y={230} size={100} frame={frame} at={gyges} until={l1.a - 4} color={UI.yellow} />
						<Label text="THE RING OF INVISIBILITY" x={960} y={880} frame={frame} at={ring + 6} until={l1.a - 4} size={42} color={UI.yellow} />
						{frame >= q - 6 ? <div style={{position: 'absolute', inset: 0, background: `rgba(10,6,30,${0.6 * span(frame, q - 6, q + 8)})`}} /> : null}
						<Label text="PLATO'S QUESTION:" x={960} y={400} frame={frame} at={asked} size={46} />
						<Big text="IF NOBODY COULD SEE YOU..." x={960} y={540} size={80} frame={frame} at={q} />
						<Big text="WOULD YOU STILL BE GOOD?" x={960} y={680} size={88} frame={frame} at={cue(l1, 'would you still')} color={UI.yellow} />
					</>
				)}
			/>
			<Sound name="chime" at={ring} volume={0.4} />
			<Sound name="vanish" at={inv} volume={0.5} />
			<Sound name="swish" at={take} volume={0.35} />
			<Sound name="boom" at={cue(l1, 'would you still')} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- cloak

export const Cloak: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const duke = cue(l0, 'two thousand and six');
	const rings = cue(l0, 'made rings');
	const carried = cue(l0, 'carried on');
	const notLight = cue(l1, 'not light');
	const flat = cue(l1, 'flat slice');
	const freq = cue(l1, 'one frequency');
	const on = frame >= rings ? 1 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[{at: [0, 0, 0], dist: 9.5, pitch: 72, dyaw: 6}, {at: [0, 0.3, 0], dist: 6.2, pitch: 38, yaw: 30}, {at: [0, 0.2, 0], dist: 5, pitch: 58, yaw: -25}]}
				light={LIGHT.void}
				bg={BG.void}
				blur={0}
				far={
					<group>
						<Box size={[40, 0.1, 40]} at={[0, -0.05, 0]} color="#120C34" outline={0} />
						{[...Array(17)].map((_, i) => (
							<Box key={i} size={[0.02, 0.01, 16]} at={[-8 + i, 0.005, 0]} color="#2A2160" outline={0} />
						))}
						{[...Array(17)].map((_, i) => (
							<Box key={`z${i}`} size={[16, 0.01, 0.02]} at={[0, 0.005, -8 + i]} color="#2A2160" outline={0} />
						))}
					</group>
				}
				near={<Cloak3D frame={frame} on={on} />}
				overlay={() => (
					<>
						<Label text="MICROWAVES → COPPER CYLINDER = A SHADOW" x={960} y={880} frame={frame} at={6} until={duke - 4} size={40} color={UI.cyan} />
						<Label text="DUKE UNIVERSITY · 2006" x={960} y={230} frame={frame} at={duke} until={l1.a - 4} size={48} />
						<Label text="THE RINGS STEER THE WAVES AROUND IT" x={960} y={880} frame={frame} at={rings + 6} until={carried - 4} size={40} color={UI.cyan} />
						<Label text="NO SHADOW: AS IF IT ISN'T THERE" x={960} y={880} frame={frame} at={carried} until={l1.a - 4} size={42} color={UI.green} />
						<Label text="THE CATCH:" x={420} y={230} frame={frame} at={l1.a} size={44} color={UI.red} />
						<Label text="✕ MICROWAVES, NOT LIGHT" x={420} y={330} frame={frame} at={notLight} size={40} />
						<Label text="✕ ONE FLAT SLICE" x={420} y={420} frame={frame} at={flat} size={40} />
						<Label text="✕ ONE FREQUENCY" x={420} y={510} frame={frame} at={freq} size={40} />
					</>
				)}
			/>
			<Sound name="appear" at={rings} volume={0.4} />
			<Sound name="pop" at={notLight} volume={0.35} />
			<Sound name="pop" at={flat} volume={0.35} />
			<Sound name="pop" at={freq} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- tiny

/** A metamaterial suit: a lattice of glowing points over an invisible body. */
const Lattice: React.FC<{frame: number}> = ({frame}) => (
	<group>
		{[...Array(160)].map((_, i) => {
			const a = i * 2.39996;
			const k = i % 5;
			const p: V3 = k < 1 ? [Math.cos(a) * 0.34, 1.36 + Math.sin(i * 1.3) * 0.3, Math.sin(a) * 0.34] : k < 4 ? [Math.cos(a) * 0.31, 0.48 + ((i * 0.37) % 1) * 0.62, Math.sin(a) * 0.31] : [(i % 2 ? 0.09 : -0.09) + Math.cos(a) * 0.09, 0.05 + ((i * 0.53) % 1) * 0.42, Math.sin(a) * 0.09];
			return <Glow key={i} shape={{kind: 'sphere', r: 0.014, seg: 6}} color={i % 3 ? '#7FE0FF' : '#C9A6FF'} position={p} opacity={0.5 + 0.5 * Math.sin(frame * 0.2 + i)} />;
		})}
	</group>
);

export const Tiny: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const tiny = cue(l0, 'light waves are tiny');
	const patterns = cue(l0, 'patterns smaller');
	const hair = cue(l0, 'hundred times');
	const every = cue(l0, 'covering every part');
	const suit = frame >= every - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, tiny - 10, patterns - 4, every - 4]}
				angles={[{at: [0, 0, 0], dist: 42, pitch: 6, yaw: -10, ddist: -8}, {at: [0, 3.62, 0.2], dist: 6, pitch: 10, yaw: 10, ddist: -5.2, dyaw: 0}, {at: [0, 3.62, 0.2], dist: 0.75, pitch: 8, yaw: 18, ddist: -0.1}, {at: [0, 1.0, 0], dist: 3.6, pitch: 6, dyaw: 20}]}
				light={LIGHT.void}
				bg={BG.void}
				blur={0}
				far={suit ? <Box size={[40, 0.1, 40]} at={[0, -0.05, 0]} color="#140E38" outline={0} /> : null}
				near={
					suit ? (
						<group>
							<Hero3D position={[0, 0, 0]} ghost={1} face="determined" shimmer={false} />
							<Lattice frame={frame} />
						</group>
					) : (
						<Hair3D frame={frame} />
					)
				}
				overlay={() => (
					<>
						<Label text="A HUMAN HAIR ≈ 70,000 NANOMETRES WIDE" x={960} y={880} frame={frame} at={8} until={tiny - 12} size={40} color={UI.orange} />
						<Label text="A LIGHT WAVE ≈ 500 NANOMETRES" x={960} y={880} frame={frame} at={tiny + 20} until={patterns - 6} size={42} color={UI.cyan} />
						<Label text="CLOAK PATTERNS MUST BE SMALLER THAN THE WAVE" x={960} y={230} frame={frame} at={patterns} until={every - 6} size={40} />
						<Label text="100+ TIMES THINNER THAN A HAIR" x={960} y={880} frame={frame} at={hair} until={every - 6} size={44} color={UI.yellow} />
						<Label text="...COVERING EVERY PART OF YOU" x={960} y={880} frame={frame} at={every} size={44} color={UI.cyan} />
					</>
				)}
			/>
			<Sound name="whoosh" at={tiny - 10} volume={0.4} />
			<Sound name="appear" at={every} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- octopus

const ROCK = '#8A7A9A';

export const Octopus: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const bags = cue(l0, 'tiny bags of colour');
	const match = cue(l0, 'matching the rocks');
	const vanish = cue(l0, "They don't vanish");
	const blend = cue(l0, 'They blend in');
	const b = span(frame, match - 4, match + 26);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[W(0, -0.6, 6.4, 0, 14), {at: [0, 0.75, -0.5], dist: 3.8, yaw: 15, pitch: 12}, {at: [0, 0.8, -0.5], dist: 3.2, yaw: -20, pitch: 8, fov: 32}, {at: [0, 0.7, -0.6], dist: 4.2, yaw: 8, pitch: 10}]}
				light={LIGHT.sea}
				bg={BG.sea}
				far={
					<group>
						<Box size={[40, 0.1, 40]} at={[0, -0.05, 0]} color="#E8D8A8" outline={0} />
						{[[-3.5, -3, 1.4], [3.2, -3.5, 1.6], [-1.6, -5, 1.2], [5, -1.5, 1.0], [-5.2, -1, 0.9]].map(([x, z, r], i) => (
							<group key={i} position={[x, 0, z]}>
								{[...Array(5)].map((_, k) => (
									<T key={k} shape={{kind: 'cone', r: 0.12, h: r}} color={['#FF6A8A', '#FF9A5A', '#FFB0D0', '#FF7AB0'][(i + k) % 4]} position={[Math.cos(k * 1.3) * 0.4, r / 2, Math.sin(k * 1.3) * 0.4]} rotation={[Math.sin(k) * 0.3, 0, Math.cos(k) * 0.3]} outline={0.008} />
								))}
							</group>
						))}
						{[...Array(10)].map((_, i) => (
							<group key={i} position={[-6 + i * 1.3, 0, -2.5 - (i % 3)]}>
								{[0, 1, 2, 3].map((k) => (
									<T key={k} shape={{kind: 'capsule', r: 0.05, len: 0.35}} color="#3FA05A" position={[Math.sin(frame * 0.04 + i + k) * 0.06 * k, 0.2 + k * 0.38, 0]} rotation={[0, 0, Math.sin(frame * 0.04 + i + k) * 0.25]} outline={0.006} />
								))}
							</group>
						))}
						{[...Array(6)].map((_, i) => (
							<group key={`f${i}`} position={[((frame * 0.02 + i * 2.3) % 14) - 7, 1.4 + (i % 3) * 0.6, -3 - (i % 2) * 1.5]}>
								<T shape={{kind: 'sphere', r: 0.1}} color={i % 2 ? '#FFD84A' : '#FF8A3D'} scale={[1.5, 1, 0.6]} outline={0.008} />
								<T shape={{kind: 'cone', r: 0.08, h: 0.14}} color={i % 2 ? '#FFD84A' : '#FF8A3D'} position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.006} />
							</group>
						))}
						{[...Array(5)].map((_, i) => (
							<Glow key={`r${i}`} shape={{kind: 'cyl', r: 0.3, r2: 0.6, h: 9, seg: 16}} color="#CFF8FF" position={[-4 + i * 2, 4.5, -4]} rotation={[0, 0, 0.25]} opacity={0.07} />
						))}
					</group>
				}
				near={
					<group>
						{[[0, 0.5, -1.6, 1.0], [-1.1, 0.35, -1.0, 0.6], [1.0, 0.3, -1.1, 0.55], [0.6, 0.25, 0.3, 0.35]].map(([x, y, z, r], i) => (
							<group key={i}>
								<T shape={{kind: 'sphere', r: r, seg: 28}} color={ROCK} position={[x, y, z]} scale={[1.3, 0.8, 1]} />
								{[...Array(6)].map((_, k) => (
									<T key={k} shape={{kind: 'sphere', r: r * 0.12, seg: 10}} color={'#6A5A7A'} position={[x + Math.cos(k * 2.1) * r * 0.8, y + Math.sin(k * 1.7) * r * 0.3 + r * 0.3, z + r * 0.6]} scale={[1, 1, 0.4]} outline={0} />
								))}
							</group>
						))}
						<Octopus3D at={[0, 0, -0.5]} frame={frame} blend={b} rock={ROCK} />
						{[...Array(10)].map((_, i) => {
							const t = (frame * 0.01 + i * 0.13) % 1;
							return <Glow key={i} shape={{kind: 'sphere', r: 0.03 + (i % 3) * 0.01, seg: 8}} color="#FFFFFF" position={[-2 + i * 0.45, t * 4, -0.8 + Math.sin(i) * 0.6]} opacity={0.6 * (1 - t)} />;
						})}
					</group>
				}
				overlay={() => (
					<>
						<Label text="OCTOPUSES & CUTTLEFISH" x={960} y={230} frame={frame} at={6} until={bags - 4} size={46} color={UI.orange} />
						<Label text="SKIN FULL OF TINY BAGS OF COLOUR" x={960} y={880} frame={frame} at={bags} until={match - 2} size={42} />
						<Label text="MATCHED IN UNDER A SECOND" x={960} y={880} frame={frame} at={match + 10} until={vanish - 4} size={44} color={UI.yellow} />
						<Big text="THEY DON'T VANISH." x={960} y={240} size={84} frame={frame} at={vanish} />
						<Big text="THEY BLEND IN." x={960} y={860} size={84} frame={frame} at={blend} color={UI.cyan} />
					</>
				)}
			/>
			<Sound name="bubbles" at={0} volume={0.35} />
			<Sound name="bubbles" at={Math.round(dur / 2)} volume={0.3} />
			<Sound name="vanish" at={match} volume={0.4} />
		</>
	);
};
