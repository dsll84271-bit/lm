import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Bars, Big, Count, Label, UI} from '../../../components/ui';
import {Ground, NightSky3D, Splash3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {StreetLamp3} from '../../../three/sets3d';
import {Bird3D, Cliffs3D, Cloud3D, CloudSea, Fields3D, Flyer, Frost, Herd3D, Mountains3D, Sea3D, Streaks, Sun3D, Town3D, Vee} from '../../../three/sky3d';
import {project} from '../../../three/Stage3D';
import {Shot3, Thought, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {rnd} from '../../../three/many';
import {Bedroom} from './A';
import {BG, LIGHT} from './kit';
import {mixArm, type V3} from './util';

// Part B: racing a pigeon, a falcon, into the clouds, the cold thin air, the
// geese, getting lost over the sea, the godwit, sleeping birds, and running
// out of strength.

// ---------------------------------------------------------------- race

const Park: React.FC = () => (
	<group>
		<Ground color="#7ED05A" size={400} />
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
			<planeGeometry args={[400, 5]} />
			<meshToonMaterial color="#E8D8B0" />
		</mesh>
		<T shape={{kind: 'cyl', r: 9, h: 0.1, seg: 48}} color="#4AA8E8" position={[10, 0.05, -18]} outline={0.05} />
		{[...Array(40)].map((_, i) => {
			const x = -70 + (i % 20) * 7 + rnd(i) * 3;
			const z = i < 20 ? -9 - rnd(i * 3) * 10 : 9 + rnd(i * 5) * 10;
			const r = 2 + rnd(i * 7) * 1.2;
			return (
				<group key={i} position={[x, 0, z]}>
					<T shape={{kind: 'cyl', r: 0.3, h: 3}} color="#7A5A3A" position={[0, 1.5, 0]} outline={0.03} />
					<T shape={{kind: 'sphere', r, seg: 20}} color={i % 3 ? '#3A9A4A' : '#58B85A'} position={[0, 3 + r * 0.7, 0]} outline={0.06} />
				</group>
			);
		})}
	</group>
);

export const Race: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const race = cue(l0, 'After school');
	const win = cue(l0, 'and you win');
	const lamp = cue(l0, 'The pigeon lands');
	const missile = cue(l0, 'Then something');
	const falcon = cue(l0, 'A peregrine');
	const fastest = cue(l0, 'Peregrines are');
	const dive = cue(l0, 'When they dive');
	const seg = frame < race - 4 ? 0 : frame < lamp - 4 ? 1 : frame < missile - 4 ? 2 : frame < falcon - 4 ? 3 : 4;
	const t = span(frame, race - 4, lamp - 4, (v) => v);
	const heroX = lerp(-30, 30, t);
	const pigeonX = lerp(-29, 22, t) - span(frame, win, lamp, (v) => v) * 3;
	let near: React.ReactNode;
	let angle: Angle3;
	let blur = 2.5;
	let far: React.ReactNode = <Park />;
	let bg = BG.day;
	if (seg === 0) {
		near = <Flyer at={[-4, 3, 0]} pitch={20} frame={frame} pose="float" face="happy" />;
		angle = {at: [-4, 3, 0], dist: 7, yaw: 25, pitch: 4, fov: 38};
	} else if (seg === 1) {
		near = (
			<group>
				<Flyer at={[heroX, 3.2, 0]} pitch={84} yaw={90} frame={frame} face={frame > win ? 'happy' : 'determined'} />
				<Bird3D kind="pigeon" at={[pigeonX, 3.4, 1.2]} frame={frame} yaw={90} s={1.6} rate={0.9} />
			</group>
		);
		angle = {at: [heroX + 0.4, 3.3, 0.6], dist: 6, yaw: 45, pitch: 4, fov: 40, ddist: 0, dyaw: 0};
	} else if (seg === 2) {
		near = (
			<group>
				<StreetLamp3 at={[0, 0, 0]} on={false} />
				<Bird3D kind="pigeon" at={[0.42, 4.33, 0]} frame={frame} wing="fold" perch s={1.6} yaw={0.6} look={0.3} />
				<Flyer at={[2.4, 3.6, 1.6]} pitch={20} yaw={-60} frame={frame} pose="float" face="smug" />
			</group>
		);
		angle = frame < lamp + 30 ? {at: [0.5, 4.4, 0], dist: 2.8, yaw: 20, pitch: 4, fov: 36} : {at: [1.3, 4.1, 0.6], dist: 4.6, yaw: 10, pitch: 4, fov: 38};
	} else if (seg === 3) {
		const ft = span(frame, missile - 4, missile + 20, (v) => v);
		near = (
			<group>
				<Flyer at={[0, 4, 0]} pitch={30} frame={frame} pose="float" face="shocked" look={[-0.4, 0]} />
				<Bird3D kind="falcon" at={[lerp(-10, 8, ft), lerp(14, -2, ft), 1.2]} frame={frame} wing="dive" pitch={-50} yaw={90} s={1.4} />
				{ft > 0 && ft < 1 ? <Streaks at={[lerp(-10, 8, ft), lerp(14, -2, ft), 1.2]} yaw={90} frame={frame} n={10} spread={0.8} len={4} /> : null}
			</group>
		);
		angle = {at: [0, 4.4, 0], dist: 5, yaw: 15, pitch: 4, fov: 40};
	} else {
		bg = 'linear-gradient(#3A86E8, #BFE4FF)';
		far = (
			<group>
				<Cloud3D at={[-20, -30, -50]} s={20} seed={3} />
				<Cloud3D at={[25, -50, -70]} s={26} seed={6} />
			</group>
		);
		near = (
			<group>
				<Bird3D kind="falcon" at={[0, 0, 0]} frame={frame} wing="dive" pitch={-72} s={1.4} />
				<Streaks at={[0, 0, 0]} yaw={0} frame={frame} n={18} spread={1.4} len={5} speed={1.4} />
			</group>
		);
		angle = {at: [0, 0, 0], dist: 3.6, yaw: 60, pitch: -20, fov: 42, dyaw: 10};
		blur = 3;
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, race - 4, lamp - 4, missile - 4, falcon - 4]}
				angles={[angle, angle, angle, angle, angle]}
				light={LIGHT.day}
				bg={bg}
				blur={blur}
				far={far}
				near={near}
				overlay={(cam) => (
					<AbsoluteFill>
						{seg === 2 ? <Thought cam={cam} head={[0.5, 4.8, 0]} text="Show-off." frame={frame} at={lamp + 14} /> : null}
						{seg === 1 && frame > win ? <Label text="YOU WIN!" x={960} y={220} frame={frame} at={win + 2} size={56} color={UI.yellow} /> : null}
						{frame > falcon ? <Label text="PEREGRINE FALCON" x={960} y={200} frame={frame} at={falcon + 4} size={50} color={UI.cream} /> : null}
						{frame > dive ? <Count from={0} to={300} x={960} y={840} size={110} frame={frame} at={dive + 4} dur={36} prefix="OVER " suffix=" KM/H" /> : frame > fastest ? <Label text="THE FASTEST ANIMAL ON EARTH" x={960} y={860} frame={frame} at={fastest + 4} size={48} color={UI.yellow} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={race} volume={0.35} />
			<Sound name="chime" at={win + 2} volume={0.25} />
			<Sound name="whoosh" at={missile} volume={0.5} />
			<Sound name="whoosh" at={falcon} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- clouds

const Droplets: React.FC<{frame: number}> = ({frame}) => (
	<group>
		{[...Array(60)].map((_, i) => {
			const x = (rnd(i) - 0.5) * 8;
			const z = (rnd(i * 2.3) - 0.5) * 8;
			const y = 5 - (((frame * 0.25 + rnd(i * 3.1) * 10) % 10));
			return <Glow key={i} shape={{kind: 'sphere', r: 0.03 + rnd(i * 5) * 0.03, seg: 6}} color="#FFFFFF" position={[x, y, z]} opacity={0.8} />;
		})}
	</group>
);

export const Clouds: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const inside = cue(l0, 'Inside a cloud');
	const burst = cue(l0, 'Then you burst');
	const world = cue(l0, "and there's a whole");
	const ncar = cue(l1, 'Scientists');
	const tonnes = cue(l1, 'an ordinary');
	const elephants = cue(l1, "That's about");
	const seg = frame < inside - 4 ? 0 : frame < burst - 4 ? 1 : frame < world - 4 ? 2 : frame < l1.a - 4 ? 3 : 4;
	let far: React.ReactNode;
	let near: React.ReactNode;
	let angle: Angle3;
	let light = LIGHT.above;
	let bg = BG.above;
	let blur = 0;
	if (seg === 0) {
		const y = track(frame, [[0, 0], [inside, 14]]);
		far = (
			<group>
				<Cloud3D at={[0, 34, 0]} s={44} seed={11} />
				<Cloud3D at={[-50, 26, -40]} s={28} seed={4} />
			</group>
		);
		near = <Flyer at={[0, y, 0]} pitch={0} frame={frame} face="happy" headUp={-30} />;
		angle = {at: [0, y + 6, 0], dist: 14, yaw: 20, pitch: -40, fov: 50, ddist: 0, dyaw: 0};
		light = LIGHT.day;
		bg = BG.day;
	} else if (seg === 1) {
		far = <Droplets frame={frame} />;
		near = <Flyer at={[0, 0, 0]} pitch={0} frame={frame} face="determined" headUp={-20} />;
		angle = {at: [0, 0.3, 0], dist: 3.4, yaw: 20, pitch: -8, fov: 40, dyaw: 30};
		light = LIGHT.fog;
		bg = BG.fog;
	} else if (seg === 2 || seg === 3) {
		const y = track(frame, [[burst - 4, -2], [burst + 22, 5]]);
		far = (
			<group>
				<CloudSea y={0} frame={frame} />
				<Sun3D at={[80, 60, -140]} r={10} color="#FFF0B0" />
			</group>
		);
		near = <Flyer at={[0, y, 0]} pitch={seg === 3 ? 40 : 0} frame={frame} pose={seg === 3 ? 'glide' : 'super'} face="happy" headUp={seg === 3 ? 20 : -10} />;
		angle = seg === 2 ? {at: [0, 5, 0], dist: 8, yaw: 20, pitch: 8, fov: 46} : {at: [0, 6, 0], dist: 26, yaw: 160, pitch: 12, fov: 50, dyaw: 12};
	} else {
		light = LIGHT.day;
		bg = BG.day;
		const herd = [...Array(100)].map((_, i) => ({p: [-15 + (i % 10) * 3.3 + rnd(i) * 0.8, 0, -8 + Math.floor(i / 10) * 2.8 + rnd(i * 2) * 0.6] as V3, s: 0.55, yaw: 0.4 + rnd(i * 3) * 0.6}));
		far = (
			<group>
				<Ground color="#9ED870" size={400} />
				<Cloud3D at={[1, 22, 4]} s={26} seed={9} />
			</group>
		);
		near = (
			<group>
				<Herd3D items={herd} />
				<Flyer at={[14, 14, 12]} pitch={20} yaw={-60} frame={frame} pose="float" face="shocked" look={[-0.4, 0.4]} />
			</group>
		);
		angle = frame < elephants - 4 ? {at: [0, 14, 2], dist: 44, yaw: 25, pitch: 6, fov: 46} : {at: [0, 3, 2], dist: 26, yaw: 35, pitch: 22, fov: 46, dyaw: 8};
		blur = 2;
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, inside - 4, burst - 4, world - 4, l1.a - 4, elephants - 4]}
				angles={[angle, angle, angle, angle, angle, angle]}
				light={light}
				bg={bg}
				blur={blur}
				far={far}
				near={near}
				overlay={() => (
					<AbsoluteFill>
						{seg === 4 && frame > ncar ? <Label text="NATIONAL CENTER FOR ATMOSPHERIC RESEARCH" x={960} y={200} frame={frame} at={ncar + 4} size={40} color={UI.cyan} until={elephants - 4} /> : null}
						{seg === 4 && frame > tonnes ? <Big text="ONE PUFFY CLOUD ≈ 500 TONNES" x={960} y={860} size={74} frame={frame} at={tonnes + 6} until={elephants - 6} /> : null}
						{seg === 4 && frame > elephants ? <Big text="≈ 100 ELEPHANTS" x={960} y={860} size={96} frame={frame} at={elephants + 4} color={UI.cyan} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={inside - 4} volume={0.35} />
			<Sound name="whoosh" at={burst} volume={0.45} />
			<Sound name="chime" at={world} volume={0.25} />
			<Sound name="thud" at={elephants + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- high

const Thermo: React.FC<{frame: number; at: number; t: number}> = ({frame, at, t}) => {
	const p = span(frame, at, at + 10);
	if (p <= 0) {
		return null;
	}
	const temp = Math.round(lerp(15, -40, t));
	const km = lerp(0, 8.5, t).toFixed(1);
	return (
		<div style={{position: 'absolute', left: 1500, top: 560, transform: `translate(-50%, -50%) scale(${p})`, background: UI.box, border: `3px solid ${UI.edge}`, borderRadius: 26, padding: '20px 28px', fontFamily: FONT, fontWeight: 700, color: UI.cream, display: 'flex', gap: 26, alignItems: 'center'}}>
			<svg width={60} height={300} viewBox="0 0 60 300">
				<rect x={18} y={10} width={24} height={240} rx={12} fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth={3} />
				<rect x={22} y={14 + 232 * t * 0.85} width={16} height={236 - 232 * t * 0.85} rx={8} fill={t > 0.5 ? UI.cyan : UI.red} />
				<circle cx={30} cy={268} r={24} fill={t > 0.5 ? UI.cyan : UI.red} stroke="#fff" strokeWidth={3} />
			</svg>
			<div>
				<div style={{fontSize: 34, color: UI.cyan}}>HEIGHT</div>
				<div style={{fontSize: 64}}>{km} KM</div>
				<div style={{fontSize: 34, color: UI.cyan, marginTop: 10}}>AIR</div>
				<div style={{fontSize: 64}}>{temp} °C</div>
			</div>
		</div>
	);
};

export const High: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const every = cue(l0, 'Every kilometre');
	const frost = cue(l0, 'Frost grows');
	const breathe = cue(l0, 'And no matter');
	const ears = cue(l0, 'Your ears pop');
	const everest = cue(l1, 'At the top');
	const breath = cue(l1, 'every breath');
	const t = span(frame, 0, l1.a, (v) => v);
	const second = frame >= l1.a - 4;
	const y = second ? 52 : lerp(0, 30, t);
	const puffs = frame > breathe - 4 && !second;
	const climb = (
		<group>
			<Flyer at={[0, y, 0]} pitch={second ? 15 : 8} frame={frame} pose={second ? 'float' : 'super'} face={frame > breathe ? 'scared' : frame > frost ? 'sad' : 'determined'} talk={puffs ? 0.6 : 0} headUp={second ? 0 : -10} aura={frame > frost ? '#BFEFFF' : undefined} />
			{frame > frost - 4 ? <Frost at={[0, y, 0]} amount={span(frame, frost - 4, frost + 30)} frame={frame} /> : null}
			{puffs
				? [0, 1, 2].map((i) => {
						const k = ((frame + i * 12) % 36) / 36;
						return <Glow key={i} shape={{kind: 'sphere', r: 0.1 + k * 0.25, seg: 12}} color="#FFFFFF" position={[0.1, y + 0.55 + k * 0.4, 0.4 + k * 0.6]} opacity={0.6 * (1 - k)} />;
					})
				: null}
		</group>
	);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, every - 4, frost - 4, breathe - 4, l1.a - 4, everest - 4, breath - 4]}
				angles={[
					{at: [0, y, 0], dist: 9, yaw: 30, pitch: -6, fov: 44, ddist: 0},
					{at: [0, y, 0], dist: 12, yaw: -30, pitch: 0, fov: 44, ddist: 0},
					{at: [0, y + 0.3, 0], dist: 2.8, yaw: 20, pitch: 4, fov: 36, ddist: 0},
					{at: [0, y + 0.5, 0], dist: 2.4, yaw: -20, pitch: 2, fov: 32, ddist: 0},
					{at: [0, 40, -20], dist: 70, yaw: 15, pitch: 4, fov: 46},
					{at: [0, 44, -20], dist: 56, yaw: -10, pitch: 6, fov: 46},
					{at: [0, y, 0], dist: 8, yaw: 30, pitch: 2, fov: 42},
				]}
				light={LIGHT.high}
				bg={BG.high}
				blur={2}
				far={
					<group>
						<CloudSea y={second ? 8 : -20 - t * 20} />
						{second ? <Mountains3D peaks={[{at: [0, -20], h: 58, r: 34}, {at: [-50, -60], h: 44}, {at: [60, -70], h: 48}]} /> : null}
						<Sun3D at={[90, 70, -150]} r={8} color="#FFFFFF" />
					</group>
				}
				near={climb}
				overlay={() => (
					<AbsoluteFill>
						{!second ? <Thermo frame={frame} at={every - 4} t={span(frame, every - 4, l1.a - 4)} /> : null}
						{!second && frame > every ? <Label text="ABOUT 6.5 °C COLDER FOR EVERY 1,000 M" x={760} y={210} frame={frame} at={every + 6} size={44} color={UI.cyan} until={frost - 4} /> : null}
						{!second && frame > ears ? <Label text="EARS POP · FINGERS GO NUMB" x={760} y={210} frame={frame} at={ears + 2} size={44} color={UI.cream} /> : null}
						{second && frame > everest ? <Label text="MOUNT EVEREST · 8,849 M" x={960} y={200} frame={frame} at={everest + 4} size={50} color={UI.yellow} /> : null}
						{second && frame > breath ? (
							<Bars
								items={[
									{label: 'BEACH', value: 1, color: UI.green, note: 'ALL OF IT'},
									{label: 'EVEREST', value: 0.33, color: UI.red, note: 'ABOUT 1/3'},
								]}
								x={360}
								y={760}
								w={1200}
								frame={frame}
								at={breath + 4}
							/>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={4} volume={0.3} />
			<Sound name="sizzle" at={frost} volume={0.2} />
			<Sound name="pop" at={ears} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- geese

const Himalaya: React.FC = () => (
	<group>
		<CloudSea y={0} seed={2} />
		<Mountains3D
			peaks={[
				{at: [-40, -70], h: 46},
				{at: [-5, -95], h: 62},
				{at: [35, -80], h: 52},
				{at: [80, -100], h: 58},
				{at: [-90, -100], h: 50},
			]}
		/>
	</group>
);

export const Geese: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const geese = cue(l0, 'Geese.');
	const bar = cue(l0, 'Bar headed');
	const tracked = cue(l0, 'When scientists');
	const blood = cue(l0, 'Their blood');
	const yours = cue(l0, "Yours isn't");
	const spins = cue(l0, 'Your head spins');
	const drop = cue(l0, 'and you drop');
	const vx = lerp(-30, 30, span(frame, 0, tracked + 20, (v) => v));
	const dizzy = frame > spins;
	const fall = span(frame, drop, drop + 30, (v) => v * v);
	const hero: V3 = [0, 14 - fall * 16, 4];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, geese - 4, bar - 4, tracked - 4, blood - 4, yours - 4, spins - 4, drop - 4]}
				angles={[
					{at: [0, 14.4, 4], dist: 4, yaw: 40, pitch: 4, fov: 38},
					{at: [vx * 0.5, 14, 2], dist: 9, yaw: 10, pitch: 2, fov: 42, ddist: 0},
					{at: [0, 22, -40], dist: 90, yaw: 8, pitch: 6, fov: 46},
					{at: [vx, 14, 0], dist: 7, yaw: 70, pitch: 6, fov: 40, ddist: 0, dyaw: 0},
					{at: [vx - 2, 14, 0], dist: 7, yaw: 40, pitch: 6, fov: 38, ddist: 0, dyaw: 0},
					{at: [0, 14.4, 4], dist: 3, yaw: -25, pitch: 2, fov: 34},
					{at: [0, 14.4, 4], dist: 3.2, yaw: 30, pitch: 4, fov: 36, roll: Math.sin(frame * 0.15) * 8},
					{at: [0, 10, 4], dist: 14, yaw: 20, pitch: 22, fov: 46, ddist: 0},
				]}
				light={LIGHT.high}
				bg={BG.high}
				far={
					<group>
						<Himalaya />
						<Sun3D at={[90, 80, -150]} r={8} color="#FFFFFF" />
					</group>
				}
				near={
					<group>
						<Vee at={[vx, 14, -1]} frame={frame} yaw={90} n={4} gap={2.2} s={1.3} />
						<Flyer at={hero} pitch={fall > 0 ? -40 + fall * 200 : 12} bank={dizzy ? Math.sin(frame * 0.2) * 25 : 0} frame={frame} pose={fall > 0 ? 'flap' : 'float'} face={dizzy ? 'scared' : frame > geese ? 'shocked' : 'sad'} look={[frame > geese && frame < blood ? 0.5 : 0, 0]} />
					</group>
				}
				overlay={() => (
					<AbsoluteFill>
						{frame > bar && frame < blood ? <Label text="BAR-HEADED GEESE · HIMALAYAS" x={960} y={200} frame={frame} at={bar + 4} size={48} color={UI.cream} /> : null}
						{frame > tracked && frame < blood ? <Big text="TRACKED AT 7,290 M" x={960} y={860} size={84} frame={frame} at={tracked + 8} /> : null}
						{frame > blood && frame < spins ? <Label text="BLOOD BUILT TO GRAB OXYGEN" x={960} y={860} frame={frame} at={blood + 4} size={48} color={UI.green} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={geese - 6} volume={0.35} />
			<Sound name="swish" at={drop} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- lost

export const Lost: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const starving = cue(l0, "You're starving");
	const noIdea = cue(l0, 'And you have no idea');
	const fields = cue(l0, 'Every field');
	const towns = cue(l0, 'Every town');
	const sea = cue(l0, 'And straight ahead');
	const phone = cue(l0, 'Your phone');
	const home = frame >= phone - 4;
	const look = frame > noIdea ? Math.sin((frame - noIdea) * 0.08) * 0.8 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, starving - 4, noIdea - 4, fields - 4, towns - 4, sea - 4, phone - 4]}
				angles={[
					{at: [0, 30, 0], dist: 9, yaw: 205, pitch: 14, fov: 42},
					{at: [0, 30.3, 0], dist: 2.8, yaw: 15, pitch: 4, fov: 34},
					{at: [0, 30.2, 0], dist: 4, yaw: -25, pitch: 4, fov: 38},
					{at: [0, 0, 20], dist: 90, yaw: 20, pitch: 60, fov: 50},
					{at: [60, 0, 40], dist: 80, yaw: -30, pitch: 50, fov: 50},
					{at: [0, 28, -10], dist: 9, yaw: 180, pitch: 10, fov: 50, ddist: 2},
					{at: [-0.8, 0.8, -2.3], dist: 2.4, yaw: 20, pitch: 40, fov: 38},
				]}
				light={home ? LIGHT.bedroom : LIGHT.overcast}
				bg={home ? BG.bedroom : BG.overcast}
				far={
					home ? (
						<Bedroom phone frame={frame} />
					) : (
						<group>
							<Fields3D coast={-60} seed={4} />
							<group position={[-70, 0, 60]}>
								<Town3D size={64} seed={3} cars={false} />
							</group>
							<group position={[80, 0, 30]}>
								<Town3D size={64} seed={3} cars={false} />
							</group>
						</group>
					)
				}
				near={home ? null : <Flyer at={[0, 30, 0]} pitch={10} frame={frame} pose="float" face={frame > noIdea ? 'scared' : frame > starving ? 'sad' : 'neutral'} look={[look, -0.2]} yaw={frame > sea - 4 ? 180 : 0} />}
				overlay={(cam) => (
					<AbsoluteFill>
						{!home ? <Thought cam={cam} head={[0, 31.2, 0]} text="SO HUNGRY" frame={frame} at={starving + 6} until={noIdea - 2} /> : null}
						{frame > fields && frame < sea - 4 ? <Label text="WHICH ONE IS HOME?" x={960} y={210} frame={frame} at={towns} size={50} color={UI.yellow} /> : null}
						{home ? <Label text="YOUR PHONE" x={960} y={210} frame={frame} at={phone} size={50} color={UI.cyan} /> : null}
					</AbsoluteFill>
				)}
			/>
			{home ? <Sound name="tick" at={phone} volume={0.4} /> : null}
		</>
	);
};

// ---------------------------------------------------------------- godwit

const PacificMap: React.FC<{frame: number; at: number; t: number}> = ({frame, at, t}) => {
	const p = span(frame, at, at + 12);
	if (p <= 0) {
		return null;
	}
	const path = 'M720 120 C 640 300, 520 420, 260 600';
	const bx = (u: number) => {
		const x0 = 720, x1 = 640, x2 = 520, x3 = 260;
		const y0 = 120, y1 = 300, y2 = 420, y3 = 600;
		const m = 1 - u;
		return [m * m * m * x0 + 3 * m * m * u * x1 + 3 * m * u * u * x2 + u * u * u * x3, m * m * m * y0 + 3 * m * m * u * y1 + 3 * m * u * u * y2 + u * u * u * y3];
	};
	const [gx, gy] = bx(t);
	return (
		<div style={{position: 'absolute', left: 700, top: 540, transform: `translate(-50%, -50%) scale(${(0.9 + 0.1 * p) * 0.82})`, opacity: p, borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: `4px solid ${UI.edge}`}}>
			<svg viewBox="0 0 900 680" width={900} height={680}>
				<rect width={900} height={680} fill="#1E5A9A" />
				{[...Array(10)].map((_, i) => (
					<path key={i} d={`M0 ${60 + i * 64} Q450 ${40 + i * 64} 900 ${60 + i * 64}`} stroke="rgba(255,255,255,0.06)" strokeWidth={2} fill="none" />
				))}
				<path d="M560 20 L900 20 L900 170 L820 150 L760 120 L700 140 L640 100 L600 60 Z" fill="#7ED05A" stroke="#140A28" strokeWidth={5} />
				<path d="M40 380 L230 360 L300 420 L320 520 L250 560 L120 560 L40 480 Z" fill="#E8C08A" stroke="#140A28" strokeWidth={5} />
				<path d="M240 590 L285 585 L280 625 L250 630 Z" fill="#E8C08A" stroke="#140A28" strokeWidth={5} />
				<path d="M420 560 L450 540 L470 600 L430 650 L410 630 Z" fill="#7ED05A" stroke="#140A28" strokeWidth={5} />
				<path d={path} stroke="#FFD84A" strokeWidth={8} strokeDasharray="20 14" fill="none" pathLength={1} style={{strokeDasharray: `${t} 1`}} />
				<circle cx={gx} cy={gy} r={14} fill="#FF8A3D" stroke="#fff" strokeWidth={4} />
				<text x={760} y={210} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke="#140A28" strokeWidth={8} paintOrder="stroke" textAnchor="middle">
					ALASKA
				</text>
				<text x={260} y={668} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke="#140A28" strokeWidth={8} paintOrder="stroke" textAnchor="middle">
					TASMANIA
				</text>
				<text x={560} y={340} fontFamily={FONT} fontWeight={700} fontSize={30} fill="rgba(255,255,255,0.5)" textAnchor="middle">
					PACIFIC OCEAN
				</text>
			</svg>
		</div>
	);
};

export const Godwit: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const year = cue(l0, 'In twenty twenty two');
	const sugar = cue(l0, 'a bird that weighs');
	const flew = cue(l0, 'flew from Alaska');
	const km = cue(l0, 'Thirteen');
	const days = cue(l0, 'in eleven days');
	const taught = cue(l0, 'Nobody even');
	const find = cue(l0, 'Birds find');
	const stars = cue(l0, 'the stars');
	const magnetic = cue(l0, "the Earth's magnetic");
	const none = cue(l0, "You've got none");
	const mapOn = frame > flew - 6 && frame < taught - 4;
	const night = frame >= find - 4 && frame < none - 4;
	const you = frame >= none - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, year - 4, flew - 4, taught - 4, find - 4, none - 4]}
				angles={[
					{at: [0, 6, 0], dist: 4, yaw: 40, pitch: 6, fov: 38},
					{at: [0, 6, 0], dist: 2.6, yaw: -30, pitch: 4, fov: 34},
					{at: [0, 6, 0], dist: 6, yaw: 20, pitch: 4, fov: 40},
					{at: [0, 6, 0], dist: 14, yaw: 120, pitch: 8, fov: 44, dyaw: 12},
					{at: [0, 6, 0], dist: 5, yaw: 30, pitch: 10, fov: 44, dyaw: 10},
					{at: [0, 6, 0], dist: 4, yaw: 25, pitch: 4, fov: 38},
				]}
				light={night ? LIGHT.night : you ? LIGHT.dusk : LIGHT.day}
				bg={night ? BG.night : you ? BG.dusk : BG.day}
				far={
					<group>
						<Sea3D frame={frame} color={night ? '#1A2E6A' : you ? '#2E5A9A' : '#2E86D0'} dusk={you} />
						{night ? <NightSky3D frame={frame} /> : null}
					</group>
				}
				near={you ? <Flyer at={[0, 6, 0]} pitch={20} frame={frame} pose="float" face="sad" armL={mixArm([40, 30], [60, 130], span(frame, none, none + 10))} armR={mixArm([40, 30], [60, 130], span(frame, none, none + 10))} /> : <Bird3D kind="godwit" at={[0, 6, 0]} frame={frame} s={2.2} rate={0.5} />}
				overlay={() => (
					<AbsoluteFill>
						{frame > year && frame < flew ? <Label text="BAR-TAILED GODWIT · 2022" x={960} y={200} frame={frame} at={year + 4} size={50} color={UI.yellow} /> : null}
						{frame > sugar && frame < flew ? <Label text="LIGHTER THAN A BAG OF SUGAR" x={960} y={860} frame={frame} at={sugar + 4} size={46} /> : null}
						{mapOn ? <PacificMap frame={frame} at={flew - 6} t={span(frame, flew, days + 30, (v) => v)} /> : null}
						{mapOn && frame > km ? <Count from={0} to={13560} x={1460} y={430} size={84} frame={frame} at={km + 2} dur={40} suffix=" KM" /> : null}
						{mapOn && frame > days ? <Label text="11 DAYS" x={1460} y={560} frame={frame} at={days + 4} size={52} color={UI.cyan} /> : null}
						{mapOn && frame > days + 12 ? <Label text="NO FOOD · NO REST" x={1460} y={660} frame={frame} at={days + 12} size={44} color={UI.cream} /> : null}
						{frame > taught && frame < find - 4 ? <Label text="ITS VERY FIRST TRIP" x={960} y={860} frame={frame} at={taught + 4} size={50} color={UI.yellow} /> : null}
						{night ? (
							<>
								<Label text="THE SUN" x={470} y={860} frame={frame} at={find + 10} size={46} color={UI.yellow} />
								<Label text="THE STARS" x={880} y={860} frame={frame} at={stars} size={46} color={UI.cream} />
								<Label text="EARTH'S MAGNETIC FIELD" x={1420} y={860} frame={frame} at={magnetic} size={46} color={UI.cyan} />
							</>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={flew} volume={0.3} />
			<Sound name="chime" at={find + 10} volume={0.2} />
		</>
	);
};

// ---------------------------------------------------------------- sleep

const Brain: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const p = span(frame, at, at + 12);
	if (p <= 0) {
		return null;
	}
	return (
		<div style={{position: 'absolute', left: 1480, top: 520, transform: `translate(-50%, -50%) scale(${p})`, background: UI.box, border: `3px solid ${UI.edge}`, borderRadius: 26, padding: 20}}>
			<svg viewBox="0 0 340 260" width={340} height={260}>
				<path d="M170 30 C 90 20, 30 70, 40 140 C 46 200, 110 230, 170 220 Z" fill="#4A4A7A" stroke="#fff" strokeWidth={5} />
				<path d="M170 30 C 250 20, 310 70, 300 140 C 294 200, 230 230, 170 220 Z" fill="#FFD84A" stroke="#fff" strokeWidth={5} />
				<text x={100} y={130} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#fff" textAnchor="middle">
					ASLEEP
				</text>
				<text x={240} y={130} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#140A28" textAnchor="middle">
					AWAKE
				</text>
				<text x={170} y={256} fontFamily={FONT} fontWeight={700} fontSize={22} fill={UI.cyan} textAnchor="middle">
					ONE EYE OPEN
				</text>
			</svg>
		</div>
	);
};

export const Sleep: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const drop = cue(l0, 'drop like');
	const wake = cue(l0, 'and wake up');
	const birds = cue(l0, 'Some birds');
	const year = cue(l0, 'In twenty sixteen');
	const half = cue(l0, 'sometimes with');
	const eye = cue(l0, 'keeping one eye');
	const swifts = l1.a;
	const fall = span(frame, drop, wake, (v) => v * v);
	const bounce = span(frame, wake, wake + 16);
	const y = frame < wake ? lerp(6, 0.7, fall) : lerp(0.7, 3, bounce);
	const heroShot = frame < birds - 4;
	const swiftShot = frame >= swifts - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, drop - 4, wake - 4, birds - 4, year - 4, half - 4, swifts - 4]}
				angles={[
					{at: [0, 6.3, 0], dist: 3, yaw: 30, pitch: 4, fov: 36},
					{at: [0, 3.5, 0], dist: 9, yaw: 25, pitch: 6, fov: 44},
					{at: [0, y + 0.2, 0], dist: 4, yaw: -20, pitch: 6, fov: 40, ddist: 0},
					{at: [0, 8, 0], dist: 6, yaw: 35, pitch: 6, fov: 40},
					{at: [0, 8.1, 0.2], dist: 3.2, yaw: 50, pitch: 4, fov: 34},
					{at: [-0.6, 8, 0], dist: 6, yaw: 20, pitch: 6, fov: 40},
					{at: [0, 10, -2], dist: 7, yaw: 15, pitch: 4, fov: 44, dyaw: 10},
				]}
				light={LIGHT.sunset}
				bg={BG.sunset}
				far={
					<group>
						<Sea3D frame={frame} color="#3A5A9A" dusk />
						<Sun3D at={[-80, 14, -170]} r={12} color="#FFD07A" />
					</group>
				}
				near={
					heroShot ? (
						<group>
							<Flyer at={[0, y, 0]} pitch={frame < wake ? lerp(70, 10, fall) : 20} frame={frame} pose={frame < drop ? 'glide' : frame < wake ? 'float' : 'flap'} face={frame > wake ? 'shocked' : 'neutral'} blink={frame < wake ? (frame > 10 ? 1 : 0.5) : undefined} />
							<Splash3D at={[0, 0, 0]} t={(frame - wake + 2) / 20} r={1.6} />
						</group>
					) : swiftShot ? (
						<group>
							{[...Array(6)].map((_, i) => {
								const ph = ((frame * 0.05 + i * 0.37) % 1.4) - 0.7;
								return <Bird3D key={i} kind="swift" at={[ph * 14 + i * 0.4, 9.5 + Math.sin(frame * 0.07 + i) * 0.8 + (i % 3) * 0.5, -i * 1.2]} frame={frame} yaw={90 + Math.sin(frame * 0.05 + i) * 20} wing={i % 2 ? 'glide' : 'flap'} rate={1.1} s={3} bank={Math.sin(frame * 0.07 + i) * 30} />;
							})}
						</group>
					) : (
						<Bird3D kind="frigate" at={[0, 8, 0]} frame={frame} wing="glide" sleepy={frame > half - 6} s={1.3} bank={-6} />
					)
				}
				overlay={() => (
					<AbsoluteFill>
						{frame > year && !swiftShot ? <Label text="FRIGATEBIRDS SLEEP WHILE FLYING · 2016" x={960} y={200} frame={frame} at={year + 4} size={46} color={UI.yellow} /> : null}
						{frame > half && !swiftShot ? <Brain frame={frame} at={half + 4} /> : null}
						{swiftShot ? <Label text="COMMON SWIFTS" x={960} y={200} frame={frame} at={swifts + 4} size={50} color={UI.cream} /> : null}
						{swiftShot ? <Big text="10 MONTHS WITHOUT LANDING" x={960} y={860} size={78} frame={frame} at={swifts + 20} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="swish" at={drop} volume={0.35} />
			<Sound name="splash" at={wake - 2} volume={0.45} />
			<Sound name="pop" at={year + 4} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- tired

export const Tired: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const ache = cue(l0, 'Your arms ache');
	const sun = cue(l0, 'The sun is going');
	const coast = cue(l0, 'The coast');
	const harder = cue(l0, 'You flap harder');
	const ifYou = cue(l0, 'If you keep');
	const flapping = frame > harder && frame < ifYou;
	const sink = span(frame, 0, dur, (v) => v);
	const y = 5 - sink * 2.5;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, ache - 4, sun - 4, coast - 4, harder - 4, ifYou - 4]}
				angles={[
					{at: [0, y, 0], dist: 6, yaw: 210, pitch: 4, fov: 40, ddist: 0},
					{at: [0, y + 0.2, 0], dist: 2.6, yaw: 150, pitch: 4, fov: 34, ddist: 0},
					{at: [0, y + 1.5, -20], dist: 30, yaw: -12, pitch: -2, fov: 46, ddist: 0},
					{at: [0, y, 20], dist: 24, yaw: 185, pitch: 3, fov: 46, ddist: 0},
					{at: [0, y, 0], dist: 4, yaw: 220, pitch: 4, fov: 38, ddist: 0},
					{at: [0, y, 0], dist: 18, yaw: 200, pitch: 22, fov: 46, ddist: 14},
				]}
				light={LIGHT.dusk}
				bg={BG.dusk}
				far={
					<group>
						<Sea3D frame={frame} color="#2E4A8A" dusk />
						<Sun3D at={[-40, 6, -170]} r={14} color="#FFB070" />
						<Cliffs3D at={[0, 0, 150]} h={12} len={200} />
					</group>
				}
				near={
					<group>
						<Flyer at={[0, y, 0]} pitch={60} yaw={180} frame={frame} pose={flapping ? 'flap' : 'tired'} flap={flapping ? 0.6 : 0.15} face={frame > ifYou ? 'scared' : 'sad'} headUp={50} />
						{[0, 1].map((i) => {
							const k = ((frame + i * 18) % 36) / 36;
							return <Glow key={i} shape={{kind: 'sphere', r: 0.05, seg: 8}} color="#9FE0FF" position={[0.25 - i * 0.5, y + 0.3 - k * 0.8, -0.6]} opacity={1 - k} />;
						})}
					</group>
				}
				overlay={() => (frame > ache && frame < sun ? <Label text="ARMS ACHING" x={960} y={210} frame={frame} at={ache + 2} size={46} color={UI.red} /> : null)}
			/>
			<Sound name="whoosh" at={harder} volume={0.3} />
		</>
	);
};

void project;
void Hero3D;
