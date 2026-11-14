import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Bars, Big, Label, UI} from '../../../components/ui';
import {Mouse3D} from '../../../three/bugs3d';
import {Ground} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Bed3, Box, Door3, Lamp3, Plant3, Poster3, Room3, ROOM3, School3, Shelf3, Street3} from '../../../three/sets3d';
import {Bird3D, Bus3D, Car3D, Cliffs3D, Cloud3D, Fields3D, Flyer, Gossamer3D, Mountains3D, Sea3D, Streaks, Town3D, townCell} from '../../../three/sky3d';
import {project, type Cam3} from '../../../three/Stage3D';
import {Says, Shot3, Thought, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {BG, LIGHT, P5} from './kit';
import {mixArm, top, type V3} from './util';

// Part A: waking up on the ceiling, flying to school, why people can't fly,
// how big wings would need to be, and the people who pedalled across the sea.

/** Your house from the front: two floors, a pitched roof, your bedroom window upstairs. Front faces +z. */
export const House: React.FC<{at?: V3; open?: number; night?: boolean; door?: number; lit?: boolean}> = ({at = [0, 0, 0], open = 0, night = false, door = 0, lit}) => {
	const glass = (lit ?? night) ? '#FFD98A' : night ? '#3A3470' : '#BFE3FA';
	return (
		<group position={at}>
			<T shape={{kind: 'box', w: 9, h: 6.4, d: 7}} color={night ? '#6A5A9A' : '#FFE2C0'} position={[0, 3.2, 0]} outline={0.05} />
			<T shape={{kind: 'box', w: 6.36, h: 6.36, d: 6.9}} color={night ? '#6A5A9A' : '#FFE2C0'} position={[0, 6.4, 0]} rotation={[0, 0, Math.PI / 4]} outline={0.04} />
			{[-1, 1].map((x) => (
				<T key={x} shape={{kind: 'box', w: 6.9, h: 0.35, d: 7.8}} color={night ? '#3A2E6A' : '#D8583A'} position={[x * 2.35, 8.85, 0]} rotation={[0, 0, -x * (Math.PI / 4)]} outline={0.05} />
			))}
			<T shape={{kind: 'box', w: 1, h: 2.4, d: 1}} color="#8A5A4A" position={[2.6, 10.2, -1]} outline={0.03} />
			{/* windows */}
			{[[-2.4, 1.9], [2.4, 1.9], [-2.4, 4.6], [2.4, 4.6]].map(([x, y], i) => (
				<group key={i} position={[x, y, 3.52]}>
					<Box size={[1.9, 1.6, 0.1]} at={[0, 0, 0]} color="#FFFFFF" outline={0.01} />
					{i === 3 && open > 0 ? (
						<group>
							<Glow shape={{kind: 'box', w: 1.6, h: 1.3, d: 0.02}} color="#3A2E80" position={[0, 0, 0.04]} />
							<group position={[-0.8, 0, 0.06]} rotation={[0, -open * 1.6, 0]}>
								<Glow shape={{kind: 'box', w: 1.6, h: 1.3, d: 0.03}} color={glass} position={[0.8, 0, 0]} />
							</group>
						</group>
					) : (
						<Glow shape={{kind: 'box', w: 1.6, h: 1.3, d: 0.02}} color={glass} position={[0, 0, 0.04]} />
					)}
					<Box size={[0.08, 1.4, 0.06]} at={[0, 0, 0.07]} color="#FFFFFF" outline={0} />
				</group>
			))}
			<group position={[0, 0, 3.52]}>
				<Door3 at={[0, 0, 0.02]} open={door} color="#2E8AE8" />
			</group>
			<Box size={[2.4, 0.2, 1.4]} at={[0, 0.1, 4.2]} color="#C8C0D8" outline={0.02} />
			{[-1, 1].map((x) => (
				<Plant3 key={x} at={[x * 1.6, 0, 4.2]} s={0.8} />
			))}
		</group>
	);
};

/** A dark card with a title, for facts. */
const Card: React.FC<{frame: number; at: number; until: number; children: React.ReactNode; w?: number; h?: number; paper?: boolean}> = ({frame, at, until, children, w = 680, h = 720, paper = true}) => {
	const p = span(frame, at, at + 14) * (1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{background: `rgba(10,6,30,${0.55 * p})`}}>
			<div
				style={{
					position: 'absolute',
					left: 960,
					top: 545,
					width: w,
					height: h,
					transform: `translate(-50%, -50%) rotate(${-2 + 2 * (1 - p)}deg) scale(${0.85 + 0.15 * p})`,
					opacity: p,
					background: paper ? 'linear-gradient(160deg, #F7EBCB, #E2CC98)' : 'linear-gradient(160deg, #10204A, #0A1230)',
					borderRadius: 10,
					boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
					fontFamily: paper ? 'Georgia, serif' : FONT,
					color: paper ? '#3A2A1A' : '#DCEBFF',
					padding: '48px 56px',
					overflow: 'hidden',
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- cold

const Ceiling: React.FC = () => <Box size={[12, 0.1, 9]} at={[0, 4.05, 0]} color="#5A48B8" outline={0} />;

export const Bedroom: React.FC<{night?: boolean; phone?: boolean; frame?: number}> = ({night = false, phone = false, frame = 0}) => (
	<Room3 look={ROOM3.bedroom} window={{x: 1.4, night}}>
		<Bed3 at={[-1.0, 0, -2.6]} />
		<Shelf3 at={[-3.8, 2, -4.3]} />
		<Poster3 at={[-1.0, 2.4, -4.35]} color="#2E8AE8" accent="#FFD84A" />
		<Plant3 at={[4.6, 0, -3.6]} />
		<Lamp3 at={[-2.4, 0, -3.9]} color={night ? '#FFD98A' : '#FFE7A8'} />
		<Door3 at={[3.6, 0, -4.38]} />
		{phone ? (
			<group position={[-0.8, 0.72, -2.3]} rotation={[0, 0.3 + Math.sin(frame * 1.7) * 0.06, 0]}>
				<Box size={[0.36, 0.04, 0.7]} at={[0, 0, 0]} color="#2A2638" outline={0.01} />
				<Glow shape={{kind: 'box', w: 0.3, h: 0.01, d: 0.6}} color="#7FE0FF" position={[0, 0.03, 0]} />
			</group>
		) : null}
	</Room3>
);

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const duvet = cue(l0, 'Your duvet');
	const bed = cue(l0, 'Your bed');
	const holding = cue(l0, "And you're not");
	const down = cue(l1, 'You think, down');
	const up = cue(l1, 'You think, up');
	const fly = cue(l1, 'You can fly');
	const y = track(frame, [[0, 3.62], [down + 6, 3.62], [down + 34, 1.9], [up + 6, 1.9], [up + 30, 2.9]]);
	const pitch = track(frame, [[0, -90], [holding - 2, -90], [holding + 12, -10], [down, 0], [fly - 2, 0], [fly + 12, 80]]);
	const x = track(frame, [[fly, -1], [fly + 50, 2.2]]);
	const z = track(frame, [[holding, -2.4], [holding + 20, -1.6]]);
	const yaw = frame > fly - 2 ? 90 : 0;
	const pose = frame > fly ? 'super' : frame > holding ? 'float' : 'glide';
	const face = frame > fly ? 'happy' : frame > holding ? 'scared' : frame > 12 ? 'shocked' : 'neutral';
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, duvet - 4, bed - 4, holding - 4, down - 4, up - 4, fly - 4]}
				angles={[
					{at: [-1, 3.6, -2.5], dist: 2.2, yaw: 20, pitch: 72, fov: 44, dyaw: 6},
					{at: [0, 0.4, -1.8], dist: 4.4, yaw: 40, pitch: 34, fov: 44},
					{at: [-1, 0.6, -2.6], dist: 2.8, yaw: 8, pitch: 74, fov: 46},
					{at: [-0.6, 2.3, -2.0], dist: 8.6, yaw: 12, pitch: 4, fov: 38},
					{at: [-1, 2.4, -1.8], dist: 5.2, yaw: -22, pitch: 4, fov: 36, dy: -0.6},
					{at: [-1, 2.4, -1.8], dist: 5.0, yaw: 24, pitch: 2, fov: 36, dy: 0.5},
					{at: [0.5, 2.6, -1.6], dist: 7.5, yaw: 20, pitch: 4, fov: 40, dyaw: -10},
				]}
				light={LIGHT.bedroom}
				bg={BG.bedroom}
				far={
					<group>
						<Bedroom />
						{frame >= duvet - 4 ? <Ceiling /> : null}
						<group position={[0.7, 0.04, -1.2]} rotation={[0, 0.5, 0]}>
							<T shape={{kind: 'box', w: 1.3, h: 0.08, d: 1.5}} color="#FF8A3D" outline={0.015} />
							<T shape={{kind: 'capsule', r: 0.09, len: 1.1}} color="#FF8A3D" position={[0, 0.06, 0.5]} rotation={[0, 0, Math.PI / 2]} outline={0.015} />
						</group>
					</group>
				}
				near={<Flyer at={[x, y, z]} pitch={pitch} yaw={yaw} frame={frame} pose={pose} face={face} blink={frame < 12 ? 1 : undefined} headUp={pitch < 0 ? 0 : undefined} />}
			/>
			<Sound name="boom" at={8} volume={0.2} />
			<Sound name="swish" at={holding} volume={0.3} />
			<Sound name="whoosh" at={down + 4} volume={0.3} />
			<Sound name="whoosh" at={up + 4} volume={0.3} />
			<Sound name="chime" at={fly} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- window

export const Window: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const open = cue(l0, 'You open');
	const jump = cue(l0, 'and you jump');
	const drops = cue(l0, 'The street drops');
	const houses = cue(l0, 'The houses look');
	const cars = cue(l0, 'The cars look');
	const wind = cue(l0, 'The wind roars');
	const loop = cue(l0, 'You do a loop');
	const shadow = cue(l0, 'and chase');
	const seg = frame < open - 4 ? 0 : frame < jump - 4 ? 1 : frame < drops - 4 ? 2 : frame < houses - 4 ? 3 : frame < cars - 4 ? 4 : frame < wind - 4 ? 5 : frame < loop - 4 ? 6 : frame < shadow - 4 ? 7 : 8;
	let far: React.ReactNode;
	let near: React.ReactNode;
	let angle: Angle3;
	let light = LIGHT.town;
	let bg = BG.town;
	let blur = 2.5;
	const town = <Town3D frame={frame} clear={[{at: [0, 0], r: 11}]} />;
	if (seg <= 1) {
		const walk = span(frame, 0, open - 6);
		const pos: V3 = [lerp(-1, 1.4, walk), 0, lerp(-1, -3.6, walk)];
		const reach = span(frame, open - 4, open + 10);
		light = LIGHT.bedroom;
		bg = BG.bedroom;
		far = (
			<group>
				<Bedroom />
				{seg === 1 ? <Glow shape={{kind: 'box', w: 1.8, h: 1.5, d: 0.03}} color="#FFFFFF" position={[1.4, 1.9, -4.3]} opacity={0.5 * reach} /> : null}
			</group>
		);
		near = <Hero3D position={pos} turn={Math.PI} walk={walk < 1 ? frame / 16 : undefined} armL={mixArm([12, 6], [100, 110], reach)} armR={mixArm([12, 6], [100, 110], reach)} reachL={60 * reach} reachR={60 * reach} face="happy" />;
		angle = seg === 0 ? {at: [0.4, 1.2, -2.6], dist: 6, yaw: 25, pitch: 10, fov: 38} : {at: [1.4, 1.5, -3.8], dist: 3.0, yaw: -35, pitch: 6, fov: 36};
	} else if (seg === 2) {
		const t = span(frame, jump - 4, drops - 4, (v) => v);
		const p: V3 = [lerp(2.4, 3.5, t), lerp(4.6, 13, t * t), lerp(4.2, 9, t)];
		far = (
			<group>
				{town}
				<House open={1} />
			</group>
		);
		near = <Flyer at={p} pitch={lerp(70, 20, t)} yaw={10} frame={frame} face="happy" pose="super" />;
		angle = {at: [2, 6, 3], dist: 16, yaw: 15, pitch: -12, fov: 50, dyaw: 0, ddist: 0};
	} else if (seg === 3) {
		const t = span(frame, drops - 4, houses - 4, (v) => v);
		const h = lerp(14, 40, t);
		far = (
			<group>
				{town}
				<House open={1} />
			</group>
		);
		near = <Flyer at={[3, h, 6]} pitch={10} yaw={0} frame={frame} face="happy" pose="float" look={[0, -0.6]} />;
		angle = {at: [3, h, 6], dist: 5, yaw: 20, pitch: 72, fov: 50, ddist: 0, dyaw: 30};
	} else if (seg === 4) {
		far = (
			<group>
				{town}
				<House open={1} />
			</group>
		);
		near = <Flyer at={[0, 46, 4]} pitch={60} yaw={-20} frame={frame} face="happy" />;
		angle = {at: [0, 44, 4], dist: 8, yaw: 160, pitch: 40, fov: 55, dyaw: 12};
	} else if (seg === 5) {
		const rx = townCell(3, 0)[0] - 16;
		far = <Town3D frame={frame} jam={undefined} />;
		const t = span(frame, cars - 4, wind - 4, (v) => v);
		near = <Flyer at={[rx, 16, lerp(30, 0, t)]} pitch={84} yaw={180} frame={frame} face="happy" look={[0, -0.5]} />;
		angle = {at: [rx, 12, lerp(30, 0, t) - 4], dist: 12, yaw: 20, pitch: 48, fov: 50, ddist: 0, dyaw: 0};
	} else if (seg === 6) {
		far = (
			<group>
				<Cloud3D at={[-14, -6, -40]} s={18} seed={2} />
				<Cloud3D at={[20, -12, -60]} s={22} seed={5} />
			</group>
		);
		near = (
			<group>
				<Flyer at={[0, 0, 0]} pitch={82} yaw={0} frame={frame} face="happy" talk={0.6} />
				<Streaks at={[0, 0, 0]} frame={frame} speed={0.9} />
			</group>
		);
		angle = {at: [0, 0.1, 0.4], dist: 2.6, yaw: 25, pitch: 6, fov: 38, dyaw: 6};
		bg = BG.day;
		light = LIGHT.day;
	} else if (seg === 7) {
		const t = span(frame, loop - 4, shadow - 6, (v) => v);
		const th = t * Math.PI * 2;
		const c: V3 = [0, 17, 0];
		const p: V3 = [c[0], c[1] - 5 * Math.cos(th), c[2] + 5 * Math.sin(th)];
		far = (
			<group>
				{town}
				<House open={1} />
			</group>
		);
		near = <Flyer at={p} pitch={90 - (th * 180) / Math.PI} frame={frame} face="happy" headUp={40} />;
		angle = {at: [0, 13, 0], dist: 22, yaw: 80, pitch: 8, fov: 45};
	} else {
		const t = span(frame, shadow - 4, dur, (v) => v);
		far = (
			<group>
				<Town3D frame={frame} clear={[{at: [0, 0], r: 14}]} cars={false} />
				<Ground color="#8ED46A" size={30} />
			</group>
		);
		near = <Flyer at={[lerp(-6, 6, t), 3.2, 9]} pitch={85} yaw={90} bank={Math.sin(frame * 0.12) * 10} frame={frame} face="happy" look={[0, -0.6]} />;
		angle = {at: [lerp(-5, 5, t), 2.2, 9], dist: 6.5, yaw: 30, pitch: 16, fov: 42, ddist: 0, dyaw: 0};
		blur = 0;
	}
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={[0, open - 4, jump - 4, drops - 4, houses - 4, cars - 4, wind - 4, loop - 4, shadow - 4]} angles={[angle, angle, angle, angle, angle, angle, angle, angle, angle]} light={light} bg={bg} blur={blur} far={far} near={near} />
			<Sound name="pop" at={open} volume={0.3} />
			<Sound name="whoosh" at={jump} volume={0.45} />
			<Sound name="whoosh" at={wind} volume={0.4} />
			<Sound name="swish" at={loop + 6} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- school

const kids = (frame: number, at: number, cheer: number): Array<{who: keyof typeof P5; p: V3; turn: number}> => [
	{who: 'kid1', p: [-3.2, 0, 1.8], turn: 0.9},
	{who: 'kid2', p: [3.0, 0, 1.6], turn: -0.9},
	{who: 'kid3', p: [-2.2, 0, 3.6], turn: 0.5},
	{who: 'kid4', p: [2.4, 0, 3.8], turn: -0.5},
	{who: 'w4', p: [0.4, 0, -1.6], turn: 0.1},
];

export const School: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const two = cue(l0, 'Today it takes');
	const over = cue(l0, 'You fly right');
	const land = cue(l0, 'and land');
	const stare = cue(l0, 'For a second');
	const scream = cue(l0, 'Then everyone');
	const friend = cue(l0, 'Your best friend');
	const noIdea = cue(l0, 'You have absolutely');
	const seg = frame < over - 4 ? 0 : frame < land - 4 ? 1 : 2;
	let far: React.ReactNode;
	let near: React.ReactNode;
	let angles: Angle3[];
	let light = LIGHT.street;
	let bg = BG.town;
	let blur = 2.5;
	let overlay: ((cam: Cam3) => React.ReactNode) | undefined;
	if (seg === 0) {
		const t = span(frame, 0, over - 4, (v) => v);
		const [sx, sz] = townCell(4, 2);
		const p: V3 = [lerp(-60, sx - 10, t), 30, lerp(-40, sz, t)];
		light = LIGHT.town;
		far = <Town3D frame={frame} park={[2, 4]} school={[4, 2]} jam={3} />;
		near = <Flyer at={p} pitch={84} yaw={(Math.atan2(sx - 10 + 60, sz + 40) * 180) / Math.PI} frame={frame} face="happy" />;
		angles = [{at: p, dist: 9, yaw: 200, pitch: 34, fov: 50, ddist: 0, dyaw: 0}];
		overlay = () => (
			<AbsoluteFill>
				<Label text="WALKING: 20 MINUTES" x={960} y={230} frame={frame} at={6} size={52} color={UI.cream} />
				<Big text="FLYING: 2 MINUTES" x={960} y={850} size={86} frame={frame} at={two} />
			</AbsoluteFill>
		);
	} else if (seg === 1) {
		const t = span(frame, over - 4, land - 4, (v) => v);
		const x = lerp(-18, 16, t);
		const y = 5.5 + Math.sin(t * Math.PI * 3) * 0.6;
		far = (
			<Street3>
				{[-16, -11, -6.5, 6, 10.5, 15].map((cx, i) => (
					<Car3D key={cx} at={[cx, 0, 1.2]} yaw={Math.PI / 2} color={['#E8453C', '#2E8AE8', '#3AB87A', '#FFFFFF', '#2A2638', '#8A5AE8'][i]} />
				))}
				<Bus3D at={[0, 0, 1.2]} yaw={Math.PI / 2} />
			</Street3>
		);
		near = <Flyer at={[x, y, 1.2]} pitch={84} yaw={90} frame={frame} face="happy" />;
		angles = [{at: [x - 1, 4.4, 1.2], dist: 9.5, yaw: -10, pitch: 4, fov: 46, ddist: 0, dyaw: 0}];
		blur = 1.5;
		overlay = (cam) => {
			const [bx, by] = project(cam, [0, 4.2, 1.2]);
			const [cx, cy] = project(cam, [15, 2.4, 1.2]);
			return (
				<AbsoluteFill>
					{frame > cue(l0, 'over the school bus') - 4 ? <Label text="SCHOOL BUS" x={bx} y={by - 40} frame={frame} at={cue(l0, 'over the school bus') - 4} size={36} /> : null}
					{frame > cue(l0, 'over your teacher') - 4 ? <Label text="YOUR TEACHER" x={Math.min(1700, cx)} y={cy - 60} frame={frame} at={cue(l0, 'over your teacher') - 4} size={36} color={UI.yellow} /> : null}
				</AbsoluteFill>
			);
		};
	} else {
		const ly = track(frame, [[land - 4, 6], [land + 22, 0]]);
		const landed = frame > land + 20;
		const cheer = frame > scream;
		const fwalk = span(frame, friend, friend + 30);
		const fpos: V3 = [lerp(-5, -1.2, fwalk), 0, lerp(2.5, 1.2, fwalk)];
		const shrug = span(frame, noIdea, noIdea + 10);
		far = <School3 />;
		near = (
			<group>
				{landed ? (
					<Hero3D position={[0, 0, 0.6]} turn={frame > friend ? -0.7 : 0} face={frame > noIdea ? 'scared' : 'happy'} armL={mixArm([12, 6], [50, 130], shrug)} armR={mixArm([12, 6], [50, 130], shrug)} />
				) : (
					<Flyer at={[0, ly + 0.85, 0.6]} pitch={track(frame, [[land - 4, 50], [land + 18, 0]])} frame={frame} pose="float" face="happy" />
				)}
				{kids(frame, land, scream).map((k, i) => (
					<Hero3D key={k.who} who={P5[k.who]} position={k.p} turn={k.turn} face={cheer ? 'happy' : 'shocked'} hop={cheer ? Math.abs(Math.sin(frame * 0.3 + i)) * 0.5 : 0} armL={cheer ? [160, 170] : [12, 6]} armR={cheer ? [160, 170] : [12, 6]} lite />
				))}
				<Hero3D who={P5.friend} position={fpos} turn={1.0} walk={fwalk > 0 && fwalk < 1 ? frame / 12 : undefined} face="happy" armL={frame > friend + 30 ? [150, 170] : undefined} />
			</group>
		);
		angles = [
			{at: [0, 3, 0.6], dist: 11, yaw: 0, pitch: 10, fov: 42},
			{at: [0, 1.1, 1], dist: 9, yaw: 10, pitch: 8, fov: 40},
			{at: [0, 1.2, 1.4], dist: 10, yaw: -14, pitch: 10, fov: 42},
			{at: [-0.6, 1.3, 0.9], dist: 4.2, yaw: 30, pitch: 6, fov: 36},
			{at: [0, 1.25, 0.6], dist: 3.0, yaw: -15, pitch: 4, fov: 32},
		];
		overlay = (cam) => (
			<AbsoluteFill>
				<Says cam={cam} head={top(-3.2, 1.8)} text="NO WAY!" frame={frame} at={scream + 4} until={friend - 6} />
				<Says cam={cam} head={top(fpos[0], fpos[2])} text="Can you teach me?!" frame={frame} at={friend + 26} until={noIdea + 6} />
				<Thought cam={cam} head={top(0, 0.6)} text="??" frame={frame} at={noIdea + 8} />
			</AbsoluteFill>
		);
	}
	const c2 = [land - 4, stare - 4, scream - 4, friend - 4, noIdea - 4];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={seg === 2 ? c2 : [0, over - 4, land - 4]} angles={seg === 2 ? angles : [angles[0], angles[0], angles[0]]} light={light} bg={bg} blur={blur} far={far} near={near} overlay={overlay} />
			<Sound name="whoosh" at={over} volume={0.4} />
			<Sound name="thud" at={land + 20} volume={0.3} />
			<Sound name="crowd" at={scream} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- flap

const ClimbingFrame: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		{[-1, 1].map((x) => [-1, 1].map((z) => <T key={`${x}${z}`} shape={{kind: 'cyl', r: 0.07, h: 2.4}} color="#E8453C" position={[x * 1.2, 1.2, z * 0.8]} outline={0.015} />))}
		{[0.8, 1.6, 2.4].map((y) => [-1, 1].map((z) => <T key={`${y}${z}`} shape={{kind: 'cyl', r: 0.05, h: 2.4}} color="#FFD84A" position={[0, y, z * 0.8]} rotation={[0, 0, Math.PI / 2]} outline={0.012} />))}
		<T shape={{kind: 'box', w: 2.5, h: 0.1, d: 1.7}} color="#2E8AE8" position={[0, 2.4, 0]} outline={0.015} />
	</group>
);

const Bench: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<Box size={[2.2, 0.1, 0.5]} at={[0, 0.48, 0]} color="#C98A5A" outline={0.01} />
		{[-0.9, 0.9].map((x) => (
			<Box key={x} size={[0.1, 0.48, 0.45]} at={[x, 0.24, 0]} color="#2A2350" outline={0.01} />
		))}
	</group>
);

/** A jump: height over a cycle of `period` frames, starting from `base`. */
const jumpY = (frame: number, period: number, phase: number, base: number, h: number) => {
	const t = ((frame + phase) % period) / period;
	return t < 0.35 ? base + Math.sin((t / 0.35) * Math.PI) * h - (t > 0.175 ? (base * (t - 0.175)) / 0.175 : 0) : 0;
};

export const Flap: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const flap = cue(l0, 'Your friends flap');
	const bench = cue(l0, 'They jump off benches');
	const climb = cue(l0, 'They jump off the climbing');
	const nobody = cue(l0, 'Nobody leaves');
	const pigeon = cue(l0, 'And a pigeon');
	const beat = Math.sin(frame * 0.45);
	const flapArm: [number, number] = [70 + beat * 55, 80 + beat * 55];
	const benchY = Math.max(0, jumpY(frame, 40, 0, 0.5, 0.45));
	const climbY = frame > climb ? Math.max(0, jumpY(frame - climb, 46, 0, 2.45, 0.4)) : 2.45;
	const lift = span(frame, pigeon + 14, pigeon + 50, (v) => v);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, flap - 4, bench - 4, climb - 4, nobody - 4, pigeon - 4]}
				angles={[
					{at: [0, 1.2, 0.5], dist: 11, yaw: 0, pitch: 8, fov: 42},
					{at: [-0.2, 1.1, 1.0], dist: 5, yaw: 15, pitch: 6, fov: 38},
					{at: [-3.6, 1.0, 2.2], dist: 5, yaw: 30, pitch: 6, fov: 38},
					{at: [3.4, 2.9, 0], dist: 7.5, yaw: -30, pitch: 4, fov: 40},
					{at: [0, 1.0, 1], dist: 10, yaw: -8, pitch: 6, fov: 42},
					{at: [1.4 + lift * 0.5, 0.3 + lift * 3, 3.2], dist: 2.8, yaw: 25, pitch: 6, fov: 38, ddist: 0},
				]}
				light={LIGHT.street}
				bg={BG.town}
				far={
					<group>
						<School3 />
						<Bench at={[-3.6, 0, 2.2]} />
						<ClimbingFrame at={[3.4, 0, 0]} />
					</group>
				}
				near={
					<group>
						<Hero3D position={[0, 0, -0.4]} face="happy" armL={[20, 40]} armR={[20, 40]} />
						<Hero3D who={P5.friend} position={[-0.8, 0, 1.2]} turn={0.3} armL={frame > flap - 4 ? flapArm : undefined} armR={frame > flap - 4 ? flapArm : undefined} face="determined" hop={frame > flap - 4 ? Math.max(0, Math.sin(frame * 0.2)) * 0.35 : 0} />
						<Hero3D who={P5.kid1} position={[-3.6, benchY, 2.2]} turn={0.4} armL={flapArm} armR={flapArm} face="happy" lite />
						<Hero3D who={P5.kid2} position={[3.4, climbY, 0.2]} turn={-0.2} armL={[150, 165]} armR={[150, 165]} face={climbY < 2 ? 'shocked' : 'happy'} lite />
						<Bird3D kind="pigeon" at={[1.4 + lift * 0.5, 0.2 + lift * 3, 3.2]} frame={frame} wing={frame > pigeon + 10 ? 'flap' : 'fold'} perch={frame < pigeon + 14} yaw={-60} pitch={lift > 0 ? 20 : 0} s={1.4} />
					</group>
				}
				overlay={() => (frame > nobody ? <Label text="TIME IN THE AIR: ABOUT HALF A SECOND" x={960} y={860} frame={frame} at={nobody} size={44} color={UI.cream} until={pigeon - 6} /> : null)}
			/>
			<Sound name="thud" at={bench + 14} volume={0.25} />
			<Sound name="thud" at={climb + 18} volume={0.25} />
			<Sound name="swish" at={pigeon + 12} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- borelli

const Studio: React.FC = () => (
	<group>
		<Box size={[80, 0.1, 80]} at={[0, -0.05, 0]} color="#2A2160" outline={0} />
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
			<ringGeometry args={[3.2, 3.4, 64]} />
			<meshBasicMaterial color="#5A48C8" />
		</mesh>
	</group>
);

const WingedMan: React.FC = () => (
	<svg viewBox="0 0 400 260" width={560} height={364} style={{display: 'block', margin: '10px auto'}}>
		<g stroke="#3A2A1A" strokeWidth={3} fill="none" strokeLinecap="round">
			<circle cx={200} cy={70} r={22} />
			<path d="M200 92 L200 170 M200 170 L178 236 M200 170 L222 236" />
			<path d="M200 110 L120 80 M200 110 L280 80" />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<path key={i} d={`M${120 - i * 14} ${80 - i * 8} q-20 ${30 + i * 6} ${-6 + i * 2} ${70 + i * 4}`} />
			))}
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<path key={`r${i}`} d={`M${280 + i * 14} ${80 - i * 8} q20 ${30 + i * 6} ${6 - i * 2} ${70 + i * 4}`} />
			))}
			<path d="M60 250 L340 250" strokeDasharray="6 8" />
		</g>
	</svg>
);

export const Borelli: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const nearly = cue(l0, 'Nearly');
	const muscles = cue(l0, 'and showed');
	const pigeon = l1.a;
	const yours = cue(l1, 'Yours are');
	const beat = Math.sin(frame * 0.5);
	const second = frame >= pigeon - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, nearly - 4, muscles - 4, pigeon - 4, yours - 4]}
				angles={[
					{at: [0, 1.1, 0], dist: 6, yaw: 15, pitch: 6, fov: 38},
					{at: [0, 1.1, 0], dist: 6, yaw: 15, pitch: 6, fov: 38},
					{at: [0, 1.0, 0], dist: 3.8, yaw: -20, pitch: 6, fov: 36},
					{at: [-0.8, 1.1, 0], dist: 5.6, yaw: 25, pitch: 6, fov: 38},
					{at: [0, 1.1, 0], dist: 7, yaw: 0, pitch: 6, fov: 40},
				]}
				light={LIGHT.studio}
				bg={BG.studio}
				blur={0}
				far={<Studio />}
				near={
					second ? (
						<group>
							<Bird3D kind="pigeon" at={[-1.2, 1.25, 0]} frame={frame} wing="fold" perch s={4.2} yaw={0.4} chest={0.6 + Math.sin(frame * 0.2) * 0.3} />
							{frame > yours - 4 ? (
								<group>
									<Hero3D position={[1.6, 0, 0.3]} turn={-0.3} face="neutral" look={[0, -0.4]} />
									<Glow shape={{kind: 'sphere', r: 0.05, seg: 12}} color="#FF4A5A" position={[1.52, 0.95, 0.6]} opacity={0.9} />
								</group>
							) : null}
						</group>
					) : (
						<Hero3D position={[0, Math.max(0, Math.sin(frame * 0.25)) * 0.2, 0]} face="determined" armL={[80 + beat * 60, 90 + beat * 60]} armR={[80 + beat * 60, 90 + beat * 60]} />
					)
				}
				overlay={() => (
					<AbsoluteFill>
						<Card frame={frame} at={nearly - 4} until={pigeon - 18}>
							<div style={{fontSize: 24, letterSpacing: 6, textAlign: 'center'}}>ROME · 1680</div>
							<div style={{height: 4, background: '#3A2A1A', margin: '14px 0 22px'}} />
							<div style={{fontSize: 60, lineHeight: 1.05, textAlign: 'center', fontWeight: 700}}>De Motu Animalium</div>
							<div style={{fontSize: 28, textAlign: 'center', marginTop: 12, fontStyle: 'italic'}}>On the Movement of Animals · Giovanni Borelli</div>
							<WingedMan />
							<div style={{fontSize: 30, textAlign: 'center', fontWeight: 700, opacity: span(frame, muscles, muscles + 12)}}>Human chest and arm muscles: far too weak to fly by flapping.</div>
						</Card>
						{second ? <Label text="PIGEON FLIGHT MUSCLE: ABOUT 1/5 OF ITS WEIGHT" x={960} y={220} frame={frame} at={pigeon + 6} size={46} color={UI.red} /> : null}
						{frame > yours ? <Bars items={[{label: 'PIGEON', value: 0.2, color: UI.red, note: '≈ 20%'}, {label: 'YOU', value: 0.02, color: UI.orange, note: 'TINY'}]} x={460} y={780} w={1000} frame={frame} at={yours + 4} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={nearly} volume={0.3} />
			<Sound name="pop" at={pigeon + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- bones

const XRay: React.FC<{frame: number; dense: number}> = ({frame, dense}) => (
	<svg viewBox="0 0 560 520" width={560} height={520}>
		<text x={280} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#7FE0FF">
			INSIDE A BIRD BONE
		</text>
		<g transform="translate(280 270)">
			<ellipse rx={210} ry={150} fill="none" stroke="#DCEBFF" strokeWidth={22 + dense * 14} opacity={0.95} />
			{[...Array(9)].map((_, i) => {
				const a = (i / 9) * Math.PI * 2 + 0.3;
				const b = a + 1.9 + (i % 3) * 0.4;
				return <line key={i} x1={Math.cos(a) * 200} y1={Math.sin(a) * 140} x2={Math.cos(b) * 200} y2={Math.sin(b) * 140} stroke="#DCEBFF" strokeWidth={7} opacity={0.75} />;
			})}
			<text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#FFD84A" opacity={0.9}>
				HOLLOW
			</text>
		</g>
		<text x={280} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#FF8A3D" opacity={dense}>
			BUT THE WALLS ARE DENSER THAN OURS
		</text>
	</svg>
);

export const Bones: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const hollow = cue(l0, 'Their bones are hollow');
	const ten = cue(l0, 'But in twenty ten');
	const heavier = cue(l0, 'heavier for their size');
	const skeleton = cue(l0, "A bird's skeleton");
	const secret = cue(l0, "Light bones aren't");
	const muscles = cue(l0, 'Huge muscles');
	const fly = span(frame, muscles, muscles + 40, (v) => v);
	const scale = frame > skeleton - 4;
	const tilt = scale ? Math.sin(frame * 0.12) * 0.03 * (1 - span(frame, skeleton, skeleton + 30)) : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, hollow - 4, skeleton - 4, secret - 4, muscles - 4]}
				angles={[
					{at: [0, 1.4, 0], dist: 5, yaw: 20, pitch: 8, fov: 38},
					{at: [0, 1.4, 0], dist: 5, yaw: 20, pitch: 8, fov: 38},
					{at: [0, 1.5, 0], dist: 5.2, yaw: 0, pitch: 10, fov: 38},
					{at: [-1.1, 1.9, 0], dist: 3.2, yaw: 25, pitch: 6, fov: 36},
					{at: [-1.1, 2.6 + fly * 1.6, 0], dist: 5, yaw: 15, pitch: 4, fov: 42, ddist: 0},
				]}
				light={LIGHT.studio}
				bg={BG.studio}
				blur={0}
				far={<Studio />}
				near={
					<group>
						{/* a balance: beam, two pans */}
						<T shape={{kind: 'cyl', r: 0.08, h: 1.6}} color="#C9A06A" position={[0, 0.8, 0]} outline={0.015} />
						<group position={[0, 1.6, 0]} rotation={[0, 0, tilt]}>
							<T shape={{kind: 'box', w: 2.6, h: 0.08, d: 0.12}} color="#C9A06A" outline={0.012} />
							{[-1, 1].map((x) => (
								<group key={x} position={[x * 1.1, -0.02, 0]} rotation={[0, 0, -tilt]}>
									<T shape={{kind: 'cyl', r: 0.5, r2: 0.42, h: 0.08}} color="#E8D8B0" position={[0, 0.06, 0]} outline={0.012} />
								</group>
							))}
						</group>
						<Bird3D kind="pigeon" at={[-1.1 + fly * 0.4, 1.95 + fly * 2.2, 0]} frame={frame} wing={fly > 0 ? 'flap' : 'fold'} perch={fly <= 0} s={1.9} yaw={0.5} pitch={fly > 0 ? 25 : 0} />
						<Mouse3D at={[1.1, 1.72, 0]} frame={frame} rot={-0.5} s={0.38} />
					</group>
				}
				overlay={() => (
					<AbsoluteFill>
						{frame > hollow - 4 && frame < skeleton ? (
							<div style={{position: 'absolute', left: 960, top: 520, transform: `translate(-50%, -50%) scale(${span(frame, hollow - 4, hollow + 8)})`, background: 'linear-gradient(160deg, #10204A, #0A1230)', borderRadius: 24, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', opacity: 1 - span(frame, skeleton - 10, skeleton)}}>
								<XRay frame={frame} dense={span(frame, heavier - 4, heavier + 10)} />
							</div>
						) : null}
						{frame > ten && frame < skeleton ? <Label text="ELIZABETH DUMONT · 2010" x={960} y={900} frame={frame} at={ten} size={40} color={UI.cyan} /> : null}
						{scale ? <Label text="SKELETONS: ABOUT THE SAME WEIGHT FOR THEIR SIZE" x={960} y={220} frame={frame} at={skeleton + 4} size={44} until={muscles - 6} /> : null}
						{frame > muscles ? <Big text="HUGE MUSCLES + THE RIGHT WINGS" x={960} y={860} size={70} frame={frame} at={muscles + 6} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={hollow} volume={0.3} />
			<Sound name="swish" at={muscles + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- giant

export const Giant: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const biggest = cue(l0, 'The biggest bird');
	const lived = cue(l0, 'lived in South');
	const weighed = cue(l0, 'It weighed');
	const wings = cue(l0, 'and its wings');
	const car = cue(l0, 'longer than a car');
	const even = cue(l0, 'And even it');
	const soared = cue(l0, 'It soared');
	const landT = span(frame, biggest - 4, biggest + 30);
	const go = span(frame, soared - 2, soared + 50, (v) => v * v);
	const bird: V3 = [lerp(-14, -2.5, landT) + go * 30, lerp(14, 1.15, landT) + go * 10, lerp(-10, 0, landT)];
	const flapping = frame > even && frame < soared;
	const shrug = span(frame, 6, 20) * (1 - span(frame, biggest - 6, biggest));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, biggest - 4, weighed - 4, wings - 4, even - 4, soared - 4]}
				angles={[
					{at: [1.5, 1.2, 2], dist: 4, yaw: 20, pitch: 6, fov: 36},
					{at: [-1, 2.5, 0], dist: 16, yaw: 25, pitch: 6, fov: 44},
					{at: [-1, 1.4, 1], dist: 8, yaw: 10, pitch: 4, fov: 40},
					{at: [-1, 2.0, -1], dist: 13, yaw: 0, pitch: 6, fov: 46},
					{at: [-1.5, 1.6, 0], dist: 10, yaw: 35, pitch: 6, fov: 42},
					{at: [6, 5, 0], dist: 26, yaw: 20, pitch: 6, fov: 46, ddist: 0},
				]}
				light={LIGHT.andes}
				bg={BG.andes}
				far={
					<group>
						<Ground color="#C8B87A" size={400} />
						<Mountains3D peaks={[{at: [-60, -120], h: 70}, {at: [-10, -150], h: 90}, {at: [50, -130], h: 75}, {at: [100, -110], h: 55}]} rock="#8A7AA8" />
					</group>
				}
				near={
					<group>
						<Bird3D kind="argentavis" at={bird} frame={frame} wing={flapping ? 'flap' : 'glide'} rate={0.14} perch={go <= 0 && landT > 0.9} pitch={landT < 1 ? 10 : go > 0 ? 15 : 0} yaw={landT < 1 ? 60 : go > 0 ? 80 : 0} />
						<Hero3D position={[1.5, 0, 2]} turn={frame > biggest ? -0.7 : 0} face={frame > biggest ? 'shocked' : 'neutral'} armL={mixArm([12, 6], [60, 120], shrug)} armR={mixArm([12, 6], [60, 120], shrug)} look={frame > biggest ? [-0.4, 0.2] : [0, -0.2]} />
						<Car3D at={[0.2, 0, -3.4]} yaw={Math.PI / 2} color="#2E8AE8" />
					</group>
				}
				overlay={(cam) => {
					const [lx, ly] = project(cam, [bird[0] - 3.5, bird[1] + 0.4, bird[2]]);
					const [rx, ry] = project(cam, [bird[0] + 3.5, bird[1] + 0.4, bird[2]]);
					const [ax, ay] = project(cam, [-1.85, 0.05, -3.4]);
					const [bx, by] = project(cam, [2.25, 0.05, -3.4]);
					const showSpan = frame > wings && frame < even;
					return (
						<AbsoluteFill>
							<Label text="ARGENTAVIS" x={960} y={210} frame={frame} at={biggest + 10} size={56} color={UI.yellow} until={weighed - 4} />
							{frame > lived ? <Label text="SOUTH AMERICA · 6 MILLION YEARS AGO" x={960} y={300} frame={frame} at={lived} size={40} until={weighed - 4} /> : null}
							{frame > weighed ? <Label text="ABOUT 70 KG: AS HEAVY AS A GROWN-UP" x={960} y={220} frame={frame} at={weighed + 4} size={44} until={wings - 4} /> : null}
							{showSpan ? (
								<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
									<line x1={lx} y1={ly - 60} x2={rx} y2={ry - 60} stroke={UI.yellow} strokeWidth={6} strokeDasharray="14 10" />
									<text x={(lx + rx) / 2} y={(ly + ry) / 2 - 80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={UI.yellow} stroke={UI.ink} strokeWidth={10} paintOrder="stroke">
										WINGS ≈ 7 M
									</text>
									{frame > car ? (
										<>
											<line x1={ax} y1={ay} x2={bx} y2={by} stroke={UI.cyan} strokeWidth={6} strokeDasharray="10 8" />
											<text x={(ax + bx) / 2} y={(ay + by) / 2 + 52} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill={UI.cyan} stroke={UI.ink} strokeWidth={8} paintOrder="stroke">
												CAR ≈ 4 M
											</text>
										</>
									) : null}
								</svg>
							) : null}
							{frame > even && frame < soared ? <Label text="TOO HEAVY TO KEEP FLAPPING" x={960} y={860} frame={frame} at={even + 10} size={46} color={UI.red} /> : null}
							{frame > soared ? <Big text="IT SOARED" x={960} y={860} size={90} frame={frame} at={soared + 4} /> : null}
						</AbsoluteFill>
					);
				}}
			/>
			<Sound name="whoosh" at={biggest} volume={0.4} />
			<Sound name="thud" at={biggest + 28} volume={0.3} />
			<Sound name="whoosh" at={soared + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- gossamer

const Santorini: React.FC = () => (
	<group position={[30, 0, -110]}>
		<Cliffs3D h={22} len={120} seed={3} />
		{[...Array(26)].map((_, i) => (
			<T key={i} shape={{kind: 'box', w: 3 + (i % 3), h: 2.6, d: 3}} color={i % 7 === 0 ? '#3A6AE8' : '#FFFFFF'} position={[-50 + i * 4, 24.5 + (i % 4) * 0.8, -8 + (i % 5) * 1.5]} outline={0.05} />
		))}
	</group>
);

export const Gossamer: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const year = cue(l0, 'In nineteen');
	const wings = cue(l0, 'Its wings were');
	const weight = cue(l0, 'and the whole plane');
	const took = cue(l0, 'It took him');
	const later = cue(l0, 'Nine years later');
	const daedalus = cue(l0, 'pedalling a plane called');
	const greek = frame >= later - 4;
	const pedal = Math.sin(frame * 0.4);
	const pilot = <Hero3D who={P5.pilot} position={[0, 0.5, 0.3]} sit face="determined" lean={pedal * 3} armL={[40, 70]} armR={[40, 70]} reachL={60} reachR={60} />;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, year - 4, wings - 4, weight - 4, took - 4, later - 4, daedalus - 4]}
				angles={[
					{at: [0, 2.6, 0], dist: 34, yaw: 30, pitch: 10, fov: 44},
					{at: [0, 1.6, 0.3], dist: 7, yaw: 35, pitch: 6, fov: 38},
					{at: [0, 3, 0], dist: 40, yaw: 2, pitch: 14, fov: 46, ddist: -2},
					{at: [0, 1.6, 0.3], dist: 5.5, yaw: -40, pitch: 6, fov: 36},
					{at: [0, 1.5, 0], dist: 30, yaw: 70, pitch: 3, fov: 44, dyaw: 10},
					{at: [0, 2.6, 0], dist: 38, yaw: -25, pitch: 10, fov: 46},
					{at: [0, 2.2, 0], dist: 30, yaw: 140, pitch: 6, fov: 46, dyaw: 10},
				]}
				light={greek ? LIGHT.aegean : LIGHT.grey}
				bg={greek ? BG.aegean : BG.grey}
				far={
					<group>
						<Sea3D frame={frame} color={greek ? '#2E86D0' : '#5A7AA0'} />
						{greek ? <Santorini /> : null}
					</group>
				}
				near={
					<Gossamer3D at={[0, 0.9, 0]} frame={frame} span={greek ? 34 : 29} stripe={greek ? '#2E6AE8' : '#B83A3A'}>
						{pilot}
					</Gossamer3D>
				}
				overlay={() => (
					<AbsoluteFill>
						{frame > year && frame < later - 4 ? <Label text="GOSSAMER ALBATROSS · 1979" x={960} y={210} frame={frame} at={year + 4} size={50} color={UI.yellow} /> : null}
						{frame > wings && frame < weight - 2 ? <Big text="WINGS ≈ 29 M" x={960} y={860} size={84} frame={frame} at={wings + 4} /> : null}
						{frame > weight && frame < took - 2 ? <Label text="WHOLE PLANE ≈ 32 KG: LESS THAN ITS PILOT" x={960} y={860} frame={frame} at={weight + 4} size={44} /> : null}
						{frame > took && frame < later - 4 ? <Label text="ENGLISH CHANNEL · 36 KM · 2 H 49 MIN" x={960} y={860} frame={frame} at={took + 4} size={46} color={UI.cyan} /> : null}
						{frame > daedalus ? <Label text="DAEDALUS · 1988" x={960} y={210} frame={frame} at={daedalus + 4} size={50} color={UI.yellow} /> : null}
						{frame > cue(l0, 'from Crete') ? <Label text="CRETE → SANTORINI · 115 KM" x={960} y={860} frame={frame} at={cue(l0, 'from Crete')} size={50} color={UI.cyan} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={year + 4} volume={0.3} />
			<Sound name="pop" at={daedalus + 4} volume={0.3} />
		</>
	);
};

void Fields3D;
