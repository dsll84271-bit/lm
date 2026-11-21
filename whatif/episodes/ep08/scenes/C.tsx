import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ant3D, Ladybird3D} from '../../../three/bugs3d';
import {Grass, Ground, NightSky3D, Pebble3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Bus3D, Car3D, Fields3D, Town3D} from '../../../three/sky3d';
import {Says, Shot3, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Bathtub3D, Bridge3D, Church3D, Helicopter3D, Hill3D, Pavilion3D, PoliceTape3D, Shops3D, Water8} from '../../../three/tall3d';
import {BG, bigLight, Flash, Giant, GIANT, K, KIDS, LIGHT, lookFrom, LyingGiant, P8, Panel, RainOver, smallLight, Vignette} from './kit';
import {handAt, headAt, type V3} from './util';

// Part C: alone in a field, Robert Wadlow, the storm, the bridge, the bus,
// the cheering, shrinking back… and further, and an old friend.

const BIGCAM = {near: 0.5, far: 6000};

/** The field outside town at evening or night: fields, the town in the distance, a hill. */
const FieldSet: React.FC<{lit?: boolean; dusk?: boolean}> = ({lit = false, dusk = false}) => (
	<group>
		<Fields3D size={2400} seed={12} dusk={dusk || lit} />
		<group position={[0, 0, -420]}>
			<Town3D size={700} seed={13} night={lit} lit={lit} />
		</group>
	</group>
);

const Stars: React.FC<{frame: number}> = ({frame}) => (
	<group scale={14} position={[0, -40, 0]}>
		<NightSky3D frame={frame} />
	</group>
);

// ---------------------------------------------------------------- alone

const SITF: V3 = [0, 0, 0];

export const Alone: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const tape = cue(l0, 'You sit');
	const heli = cue(l0, 'and helicopters');
	const cant = cue(l0, "You can't go");
	const lie = cue(l0, 'When you lie');
	const soup = cue(l0, 'Your mum brings');
	const sip = cue(l0, 'You drink');
	const ear = cue(l0, 'Your little brother');
	const no = cue(l0, 'Mum says');
	const cuts = [0, tape - 4, heli - 4, cant - 4, lie - 4, soup - 4, sip - 4, ear - 4, no - 4];
	const lying = frame >= lie - 4 && frame < soup - 4;
	const head = headAt(SITF, true, GIANT);
	const fam: V3 = [0.42 * K, 0, 0.3 * K];
	const sipT = span(frame, sip, sip + 30);
	const tubHand = handAt(SITF, 0, [lerp(10, 70, sipT), lerp(10, 150, sipT)], lerp(0, 60, sipT), 1, true, GIANT);
	const tub: V3 = frame > sip ? [tubHand[0], tubHand[1] - 3, tubHand[2]] : [fam[0] - 2, 0, fam[2]];
	const earAt: V3 = [head[0] + 0.33 * K, head[1], head[2]];
	const helis = [0, 1, 2].map((i) => {
		const a = frame * 0.02 + (i * Math.PI * 2) / 3;
		return <Helicopter3D key={i} at={[Math.cos(a) * 60, head[1] + 14 + i * 6, Math.sin(a) * 60]} yaw={-a} frame={frame} color={['#E8453C', '#2E8AE8', '#F4F2FF'][i]} spot={1} />;
	});
	const near = lying ? (
		<group>
			<LyingGiant at={[0, 0, 0]} yaw={Math.PI / 2} face="sad" armL={[20, 20]} armR={[20, 20]} />
			{helis}
		</group>
	) : (
		<group>
			<Giant at={SITF} sit face={frame > ear ? 'happy' : 'sad'} armR={[lerp(10, 70, sipT), lerp(10, 150, sipT)]} reachR={lerp(0, 60, sipT)} armL={[14, 18]} look={frame > ear ? [0.7, 0] : [0.3, -0.5]} talk={frame > sip + 26 && frame < sip + 40 ? 0.7 : 0} />
			{helis}
			<T shape={{kind: 'box', w: 3, h: 0.04, d: 2.4}} color="#E8453C" position={[fam[0], 0.03, fam[2]]} outline={0.02} />
			<Hero3D who={P8.mum} position={[fam[0] + 0.8, 0, fam[2] + 0.6]} turn={-2.2} face="happy" look={[0, 0.9]} armR={frame > no ? [60, 80] : [20, 20]} />
			{frame < ear ? <Hero3D who={P8.brother} position={[fam[0] - 0.6, 0, fam[2] + 0.9]} turn={-2.2} height={1.2} face="happy" look={[0, 0.9]} /> : null}
			{frame >= ear ? <Hero3D who={P8.brother} position={[earAt[0] + 1.5, earAt[1] - 0.04 * K, earAt[2] + 3]} turn={-1.6} height={1.2} face="happy" sit /> : null}
			<Bathtub3D at={tub} yaw={0.4} soup={frame < sip + 26} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 40, 0], dist: 300, yaw: 30, pitch: 10, fov: 38, ...BIGCAM},
		{at: [0, 10, 0], dist: 260, yaw: 70, pitch: 16, fov: 40, ...BIGCAM},
		{at: [head[0], head[1] + 8, head[2]], dist: 140, yaw: 20, pitch: 6, fov: 40, ...BIGCAM},
		{at: [head[0], head[1], head[2]], dist: 90, yaw: 10, pitch: 4, fov: 38, ...BIGCAM},
		{at: [0, 10, 0], dist: 330, yaw: 0, pitch: 18, fov: 40, ...BIGCAM},
		lookFrom([fam[0] + 8, 2.4, fam[2] + 10], [fam[0], 1.2, fam[2]], 44),
		{at: [tubHand[0], tubHand[1] + 4, tubHand[2]], dist: 70, yaw: 30, pitch: 4, fov: 40, ...BIGCAM},
		lookFrom([earAt[0] + 6, earAt[1] - 0.04 * K + 2, earAt[2] + 9], [earAt[0] + 1.5, earAt[1] - 0.04 * K + 0.8, earAt[2] + 3], 42),
		lookFrom([fam[0] + 6, 1.8, fam[2] + 6], [fam[0] + 0.8, 1.4, fam[2] + 0.6], 40),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={bigLight([0, 0, 0], 'evening', 160)}
				bg={BG.evening}
				far={<group><FieldSet dusk /><PoliceTape3D at={[0, 0, 0]} r={150} posts={40} /></group>}
				near={near}
				blur={0}
				overlay={(cam) => (
					<AbsoluteFill>
						<Label text="STAY BACK" x={960} y={860} size={60} frame={frame} at={tape + 10} until={heli} color="#FF5A5A" />
						{frame >= ear && frame < no ? <Says cam={cam} head={[earAt[0] + 1.5, earAt[1] - 0.04 * K + 1.4, earAt[2] + 3]} text="Can I sleep in your ear?" frame={frame} at={ear + 6} /> : null}
						{frame >= no ? <Says cam={cam} head={[fam[0] + 0.8, 1.9, fam[2] + 0.6]} text="No." frame={frame} at={no + 2} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={heli} volume={0.3} />
			<Sound name="splash" at={sip + 20} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- wadlow

/** Robert Wadlow, drawn simply: 2.72 m, leg braces, a walking stick. */
const Wadlow: React.FC<{at: V3; walk?: number; duck?: number}> = ({at, walk, duck = 0}) => {
	const h = 2.72;
	const k = h / 1.7;
	return (
		<group position={at}>
			<Hero3D who={P8.wadlow} position={[0, 0, 0]} height={h} face="happy" lean={duck * 20} walk={walk} armR={[18, 30]} reachR={20} />
			{[-1, 1].map((x) => (
				<group key={x}>
					<T shape={{kind: 'box', w: 0.025 * k, h: 0.45 * k, d: 0.025 * k}} color="#B8B8C8" position={[x * 0.16 * k, 0.25 * k, 0.07 * k]} outline={0.004} />
					<T shape={{kind: 'box', w: 0.025 * k, h: 0.45 * k, d: 0.025 * k}} color="#B8B8C8" position={[x * 0.16 * k, 0.25 * k, -0.07 * k]} outline={0.004} />
				</group>
			))}
			<T shape={{kind: 'cyl', r: 0.018, h: 1.3}} color="#5A3A2A" position={[0.62, 0.65, 0.25]} rotation={[0.1, 0, 0.12]} outline={0.006} />
		</group>
	);
};

export const WadlowShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const tallest = cue(l0, 'The tallest person');
	const braces = cue(l0, 'He needed');
	const blister = cue(l0, 'In nineteen forty');
	const only = cue(l0, 'He was only');
	const cuts = [0, tallest - 4, braces - 4, blister - 4, only - 4];
	const angles: Angle3[] = [
		{at: [0, 1.5, 0], dist: 8, yaw: 0, pitch: 6, fov: 36, ddist: -1},
		{at: [0, 1.6, 0], dist: 7, yaw: 15, pitch: 4, fov: 36},
		{at: [-0.4, 0.5, 0], dist: 2.6, yaw: 25, pitch: 6, fov: 36, dyaw: 6},
		{at: [-0.4, 0.4, 0], dist: 2.8, yaw: -20, pitch: 8, fov: 36},
		{at: [0, 1.6, 0], dist: 9, yaw: 0, pitch: 4, fov: 36, ddist: 2},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.sepia}
				bg={BG.sepia}
				far={<Ground color="#6A5440" size={60} lines={{every: 1, color: '#7A6450', along: 'z'}} />}
				near={
					<group>
						<Wadlow at={[-0.4, 0, 0]} />
						<Hero3D who={P8.jones} position={[1.1, 0, 0.3]} height={1.75} face="happy" turn={-0.3} look={[-0.4, 0.6]} />
						<group position={[-2.2, 0, -0.6]}>
							{[-1, 1].map((x) => <T key={x} shape={{kind: 'box', w: 0.12, h: 2.1, d: 0.2}} color="#8A6A4A" position={[x * 0.5, 1.05, 0]} outline={0.01} />)}
							<T shape={{kind: 'box', w: 1.12, h: 0.12, d: 0.2}} color="#8A6A4A" position={[0, 2.1, 0]} outline={0.01} />
						</group>
					</group>
				}
				blur={0}
				grade="sepia(0.65) saturate(0.8)"
				overlay={() => (
					<AbsoluteFill>
						<Vignette amount={0.5} color="#1A1008" />
						<Label text="ROBERT WADLOW · 1918–1940" x={960} y={220} size={56} frame={frame} at={tallest + 6} color={UI.cream} />
						<Big text="2.72 M" x={500} y={500} size={110} frame={frame} at={tallest + 40} until={braces} color={UI.cream} />
						<Label text="TALLEST PERSON EVER RECORDED" x={960} y={860} size={52} frame={frame} at={tallest + 50} until={braces - 2} color={UI.cream} />
						<Label text="LEG BRACES · A WALKING STICK" x={960} y={860} size={52} frame={frame} at={braces + 10} until={blister - 2} color={UI.cream} />
						<Label text="A BLISTER · AN INFECTION" x={960} y={860} size={52} frame={frame} at={blister + 30} until={only - 2} color={UI.cream} />
						<Label text="HE WAS 22" x={960} y={860} size={60} frame={frame} at={only + 10} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
		</>
	);
};

// ---------------------------------------------------------------- storm

/** The river valley at night: water, banks, the old bridge, the town on one side. */
const River: React.FC<{frame: number; flood?: number; crack?: number; drop?: number; fall?: number; bus?: boolean; car?: boolean}> = ({frame, flood = 1, crack = 0, drop = 0, fall = 0, bus = true, car = true}) => (
	<group>
		<Water8 at={[0, -1 + flood * 1.4, 0]} frame={frame} w={70 + flood * 40} d={2000} color="#5A5040" caps="#9A9080" flow={0.6} n={120} />
		{[-1, 1].map((x) => (
			<mesh key={x} position={[x * (335 + flood * 20), -0.5, 0]} receiveShadow>
				<boxGeometry args={[600, 1, 2000]} />
				<meshToonMaterial color="#2E4A3A" />
			</mesh>
		))}
		<Bridge3D at={[0, 0, 0]} crack={crack} drop={drop} fall={fall} />
		{bus ? <Bus3D at={[-4, 9.1, 0]} yaw={Math.PI / 2} glass={0.35} /> : null}
		{car ? <group><Car3D at={[18, 9.1, 0]} yaw={Math.PI / 2} color="#E8453C" /><T shape={{kind: 'sphere', r: 0.28}} color="#A8703A" position={[16.8, 10.5, 0]} outline={0.02} /></group> : null}
		<group position={[-220, 0, 0]}>
			<Town3D size={300} seed={14} night lit />
		</group>
		<Hill3D at={[160, 0, -60]} r={120} h={26} color="#2E5A3A" />
	</group>
);

export const Storm: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const mist = cue(l0, 'To you');
	const flood = cue(l0, 'To the town');
	const banks = cue(l0, 'The river bursts');
	const bus = cue(l0, 'The school bus');
	const crack = cue(l0, 'And the bridge');
	const cuts = [0, mist - 4, flood - 4, banks - 4, bus - 4, crack - 4];
	const valley = frame >= flood - 4;
	const phone = frame >= banks + 30 && frame < bus + 50;
	const flashes = [20, 90, flood + 10, crack + 4];
	const near = valley ? null : <Giant at={[0, -0.36 * K, 0]} sit face="neutral" look={[0, 0.8]} blink={frame % 60 < 4 ? 1 : 0} armL={[14, 18]} armR={[14, 18]} />;
	const angles: Angle3[] = [
		{at: [0, 40, 0], dist: 260, yaw: 30, pitch: 10, fov: 38, ...BIGCAM},
		{at: [0, 0.98 * K - 0.36 * K, 0], dist: 70, yaw: 10, pitch: 6, fov: 38, ...BIGCAM},
		{at: [-40, 4, 0], dist: 260, yaw: 70, pitch: 16, fov: 40, ...BIGCAM},
		{at: [0, 4, 0], dist: 160, yaw: 40, pitch: 12, fov: 40, ...BIGCAM},
		lookFrom([30, 14, 40], [-4, 10, 0], 44),
		withShake(lookFrom([-12, 4, 28], [0, 6, 0], 46), frame, crack + 4),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={valley ? {...smallLight([0, 0, 0], 'storm', 90), fog: {color: '#4A5470', near: 140, far: 900}} : bigLight([0, 0, 0], 'storm', 140)}
				bg={BG.storm}
				far={valley ? <River frame={frame} flood={span(frame, flood, banks + 30)} crack={span(frame, crack, crack + 40)} /> : <FieldSet lit />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<RainOver frame={frame} amount={valley ? 1 : 0.6} />
						<Flash frame={frame} at={flashes} />
						<Label text="TO YOU: A FINE MIST" x={960} y={860} size={56} frame={frame} at={mist + 10} until={flood - 4} color={UI.cream} />
						<Label text="WORST FLOOD IN 50 YEARS" x={960} y={220} size={58} frame={frame} at={flood + 10} until={banks + 20} color="#FF8A8A" />
						{phone ? (
							<div style={{position: 'absolute', left: 1260, top: 200, width: 420, height: 680, borderRadius: 50, background: '#140A28', border: '8px solid #3A2E5A', transform: `translateY(${(1 - span(frame, banks + 30, banks + 42)) * 400}px) rotate(${Math.sin(frame * 1.3) * 2}deg)`}}>
								<div style={{position: 'absolute', left: 22, right: 22, top: 60, bottom: 60, borderRadius: 24, background: '#F4F2FF', padding: 22, fontFamily: FONT, fontWeight: 700}}>
									<div style={{fontSize: 30, color: '#E8333F'}}>⚠ FLOOD ALERT</div>
									<div style={{marginTop: 24, fontSize: 40, color: '#140A28', lineHeight: 1.2}}>SCHOOL BUS STUCK ON THE OLD BRIDGE</div>
								</div>
							</div>
						) : null}
						<Big text="CRACK…" x={960} y={260} size={110} frame={frame} at={crack + 20} color="#FF5A5A" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="rain" at={0} volume={0.35} loop={dur} />
			<Sound name="boom" at={flood + 10} volume={0.4} />
			<Sound name="ring" at={banks + 30} volume={0.3} />
			<Sound name="crunch" at={crack + 6} volume={0.4} />
		</>
	);
};

const withShake = (a: Angle3, frame: number, at: number, k = 0.4): Angle3 => {
	const s = shake(frame, at, 1, 16);
	return {...a, at: [a.at[0] + s.x * k, a.at[1] + s.y * k, a.at[2]]};
};

// ---------------------------------------------------------------- bridge

/** The dark town on the way: church, shops, the pavilion, flood water up to your ankles. */
const RunTown: React.FC<{frame: number}> = ({frame}) => (
	<group>
		<Town3D size={640} seed={15} night lit clear={[{at: [0, 0], r: 80}]} />
		<Water8 at={[0, 0.6, 0]} frame={frame} w={2000} d={2000} color="#4A4A40" caps="#8A8A7A" flow={0.2} n={160} />
		<Church3D at={[-40, 0, 20]} yaw={0.3} />
		<Shops3D at={[30, 0, -30]} yaw={-0.4} lit n={5} />
		<Pavilion3D at={[80, 0, 30]} yaw={0.6} />
	</group>
);

export const BridgeShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const church = cue(l0, 'You step over');
	const slip = cue(l0, 'Your foot slips');
	const kids = l1.a;
	const stone = cue(l1, 'A stone');
	const another = cue(l1, 'Then another');
	const go = cue(l1, 'Then the whole');
	const cuts = [0, church - 4, slip - 4, kids - 4, stone - 4, another - 4, go - 4];
	const onBridge = frame >= kids - 4;
	const runX = lerp(-140, 140, span(frame, 0, kids, (v) => v));
	const slipT = span(frame, slip, slip + 20) * (1 - span(frame, slip + 30, slip + 60));
	const drop = span(frame, stone + 6, go + 40, (v) => v);
	const near = onBridge ? (
		<group>
			{[0, 1, 2, 3, 4].map((i) => <Hero3D key={i} who={KIDS[i]} position={[-7.6 + i * 1.45, 9.6, 0.75]} turn={0.15} height={1.25} face="scared" armL={[150, 20]} reachL={40} lite />)}
		</group>
	) : (
		<Giant at={[runX, 0, 0]} turn={Math.PI / 2} run walk={frame * 0.05} face="determined" tilt={slipT * 14} lean={slipT * 18} armL={[40 + slipT * 50, 60]} armR={[40 + slipT * 50, 60]} />
	);
	const angles: Angle3[] = [
		{at: [runX, 40, 0], dist: 260, yaw: 150, pitch: 10, fov: 40, ...BIGCAM},
		lookFrom([runX + 110, 12, 130], [runX, 30, 0], 50),
		{at: [runX, 30, 0], dist: 200, yaw: 100, pitch: 10, fov: 40, ...BIGCAM},
		lookFrom([-4, 11.2, 7.5], [-4, 11.0, 0], 50),
		lookFrom([6, 4, 26], [0, 6, 0], 46),
		lookFrom([-14, 1.5, 20], [0, 6, 0], 46),
		withShake(lookFrom([40, 18, 60], [0, 6, 0], 42), frame, go + 4),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={onBridge ? {...smallLight([0, 0, 0], 'storm', 60), fog: {color: '#4A5470', near: 120, far: 800}} : bigLight([runX, 0, 0], 'storm', 140)}
				bg={BG.storm}
				far={onBridge ? <River frame={frame} crack={1} drop={drop} fall={span(frame, go + 10, dur + 30) * 0.15} /> : <RunTown frame={frame} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<RainOver frame={frame} />
						<Label text="THE SUPERMARKET" x={960} y={860} size={52} frame={frame} at={slip + 10} until={kids - 4} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="rain" at={0} volume={0.3} loop={dur} />
			<Sound name="run" at={4} volume={0.35} />
			<Sound name="splash" at={slip + 6} volume={0.45} />
			<Sound name="crunch" at={stone + 6} volume={0.45} />
			<Sound name="splash" at={stone + 30} volume={0.35} />
			<Sound name="crunch" at={another + 4} volume={0.45} />
			<Sound name="boom" at={go + 6} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- save

export const Save: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const lift = cue(l0, 'You lift');
	const walk = cue(l0, 'You walk');
	const down = cue(l0, 'and put it down');
	const doors = cue(l0, 'The doors');
	const fine = cue(l0, "Everybody's fine");
	const bark = l1.a;
	const car = cue(l1, 'A little car');
	const two = cue(l1, "You've only");
	const pocket = cue(l1, 'So you pick');
	const enjoy = cue(l1, 'The dog');
	const cuts = [0, lift - 4, walk - 4, down - 4, doors - 4, bark - 4, car - 4, pocket - 4, enjoy - 4];
	// You crouch beside the bridge (bus at x -4), lift the bus, carry it to the hill.
	const start: V3 = [-4, 0, -0.45 * K];
	const hill: V3 = [160, 26, -60];
	const fall = span(frame, 30, lift + 10);
	const up = span(frame, lift, walk);
	const carry = span(frame, walk, down, (v) => v);
	const set = span(frame, down, down + 30);
	const sit = frame < walk || frame > down;
	const pos: V3 = [lerp(start[0], hill[0] - 10, carry), carry > 0 && carry < 1 ? 0 : frame > down ? hill[1] * 0.6 : 0, lerp(start[2], hill[2] - 0.45 * K, carry)];
	const turn = carry > 0 && carry < 1 ? Math.PI / 2 - 0.3 : 0;
	const arm: [number, number] = sit ? [12, lerp(30, 60, up)] : [4, 14];
	const reach = sit ? lerp(70, 80, up) : 86;
	const hR = handAt(pos, turn, arm, reach, 1, sit, GIANT);
	const hL = handAt(pos, turn, arm, reach, -1, sit, GIANT);
	const mid: V3 = [(hR[0] + hL[0]) / 2, (hR[1] + hL[1]) / 2 + 1.2, (hR[2] + hL[2]) / 2];
	const busOnHill: V3 = [hill[0] - 10, hill[1] + 0.1, hill[2] - 4];
	const placed = frame > down + 30;
	const busAt: V3 = frame < 30 ? [-4, 9.1, 0] : placed ? busOnHill : frame > down ? [lerp(mid[0], busOnHill[0], set), lerp(mid[1], busOnHill[1], set), lerp(mid[2], busOnHill[2], set)] : [lerp(-4, mid[0], fall), lerp(9.1, mid[1], fall), lerp(0, mid[2], fall)];
	const pocketAt: V3 = [pos[0] + 0.1 * K, (sit ? 0.5 : 0.62) * K, pos[2] + 0.27 * K];
	const carIn = span(frame, pocket + 10, pocket + 40);
	const carAt: V3 = frame < pocket ? [18, 9.1, 0] : [lerp(18, pocketAt[0], carIn), lerp(9.1, pocketAt[1], carIn), lerp(0, pocketAt[2], carIn)];
	const near = (
		<group>
			<Giant at={pos} turn={turn} sit={sit} walk={!sit ? frame * 0.035 : undefined} face={frame > fine ? 'happy' : 'determined'} armL={arm} armR={arm} reachL={reach} reachR={reach} look={[0, -0.5]} />
			<Bus3D at={busAt} yaw={placed || frame < 30 ? Math.PI / 2 : turn + Math.PI / 2} />
			{placed && frame > doors ? [0, 1, 2, 3].map((i) => <Hero3D key={i} who={KIDS[i]} position={[busOnHill[0] - 2 + i * 1.3, busOnHill[1], busOnHill[2] + 2.6 + (i % 2)]} turn={0.3} height={1.2} face="happy" armR={[160, 10]} lite />) : null}
			<Car3D at={carAt} yaw={Math.PI / 2} color="#E8453C" />
			<T shape={{kind: 'sphere', r: 0.28}} color="#A8703A" position={[carAt[0] - 1.2, carAt[1] + 1.4, carAt[2]]} outline={0.02} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [-4, 10, 0], dist: 150, yaw: 40, pitch: 8, fov: 40, ...BIGCAM},
		lookFrom([mid[0] + 18, mid[1] + 2, mid[2] + 26], mid, 46),
		{at: [pos[0], 45, pos[2]], dist: 230, yaw: 75, pitch: 8, fov: 40, ...BIGCAM},
		lookFrom([busOnHill[0] + 60, busOnHill[1] + 14, busOnHill[2] + 70], [busOnHill[0] - 10, busOnHill[1] + 20, busOnHill[2] - 20], 46),
		lookFrom([busOnHill[0] + 6, busOnHill[1] + 1.6, busOnHill[2] + 9], [busOnHill[0], busOnHill[1] + 1.4, busOnHill[2] + 1.5], 44),
		lookFrom([30, 12, 18], [18, 10, 0], 44),
		lookFrom([24, 10.5, 6], [18, 10, 0], 40),
		lookFrom([pocketAt[0] + 30, pocketAt[1] + 6, pocketAt[2] + 50], [pocketAt[0], pocketAt[1] + 4, pocketAt[2]], 44),
		lookFrom([pocketAt[0] + 7, pocketAt[1] + 2.5, pocketAt[2] + 9], [carAt[0], carAt[1] + 1, carAt[2]], 40),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={bigLight([60, 0, -20], 'storm', 160)}
				bg={BG.storm}
				far={<River frame={frame} crack={1} drop={1} fall={span(frame, 20, 60)} bus={false} car={false} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<RainOver frame={frame} amount={0.8} />
						<Label text="WOOF!" x={960} y={220} size={60} frame={frame} at={bark + 6} until={car + 20} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="crunch" at={30} volume={0.45} />
			<Sound name="splash" at={60} volume={0.5} />
			<Sound name="thud" at={down + 30} volume={0.4} />
			<Sound name="swish" at={doors} volume={0.3} />
			<Sound name="pop" at={pocket + 40} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- cheer

export const Cheer: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const kids = cue(l0, 'The kids');
	const driver = cue(l0, 'The bus driver');
	const mum = cue(l0, 'Your mum gives');
	const lie = cue(l0, 'You lie back');
	const hard = cue(l0, 'Being big');
	const cuts = [0, kids - 4, driver - 4, mum - 4, lie - 4, hard - 4];
	const pos: V3 = [0, 0, 0];
	const lying = frame >= lie - 4;
	const hand = handAt(pos, 0, [10, 10], 0, 1, true, GIANT);
	const crowd = [];
	for (let i = 0; i < 26; i++) {
		const a = (i / 26) * Math.PI * 0.9 + 0.2;
		const r = 26 + (i % 3) * 3;
		crowd.push(<Hero3D key={i} who={KIDS[i % KIDS.length]} position={[hand[0] + Math.cos(a) * r, 0, hand[2] + Math.sin(a) * r]} turn={Math.atan2(-Math.cos(a), -Math.sin(a))} face="happy" armR={[150 + Math.sin(frame * 0.4 + i) * 20, 10]} armL={[40, 30]} lite look={[0, 0.8]} />);
	}
	const torches = [];
	for (let i = 0; i < 20; i++) {
		torches.push(<Glow key={i} shape={{kind: 'sphere', r: 0.12}} color="#FFF6C8" position={[hand[0] + Math.cos(i * 0.3 + 0.2) * (27 + (i % 3) * 3), 2.1, hand[2] + Math.sin(i * 0.3 + 0.2) * (27 + (i % 3) * 3)]} />);
	}
	const near = lying ? (
		<LyingGiant at={[0, 0, 0]} yaw={0.4} face="happy" armL={[30, 30]} armR={[30, 30]} />
	) : (
		<group>
			<Giant at={pos} sit face="happy" armR={[10, 10]} armL={[14, 18]} look={[0.5, -0.6]} />
			{crowd}
			{torches}
			<Hero3D who={P8.driver} position={[hand[0] + 1.6, 0, hand[2] + 2]} turn={-2.4} face="happy" armL={[60, 70]} armR={[60, 70]} reachL={70} reachR={70} />
			<Hero3D who={P8.mum} position={[hand[0] + 5, 0, hand[2] + 6]} turn={-2.6} face="happy" armL={[150, 120]} armR={[150, 120]} fists />
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 30, 0], dist: 260, yaw: 30, pitch: 10, fov: 40, ...BIGCAM},
		lookFrom([hand[0] + 40, 6, hand[2] + 46], [hand[0], 8, hand[2]], 50),
		lookFrom([hand[0] + 6, 2, hand[2] + 8], [hand[0] + 1, 1.6, hand[2] + 1.5], 44),
		lookFrom([hand[0] + 9, 1.8, hand[2] + 11], [hand[0] + 5, 1.4, hand[2] + 6], 40),
		{at: [0, 10, 0], dist: 300, yaw: 20, pitch: 30, fov: 40, ...BIGCAM},
		lookFrom([0, 6, 200], [0, 200, -600], 50),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={bigLight([0, 0, 0], 'night', 160)}
				bg={BG.night}
				far={<group><FieldSet lit /><Stars frame={frame} /></group>}
				near={near}
				blur={0}
				overlay={() => <Big text="WORTH IT." x={960} y={860} size={100} frame={frame} at={hard + 40} color={UI.yellow} />}
			/>
			<Sound name="crowd" at={kids} volume={0.35} />
			<Sound name="applause" at={kids + 10} volume={0.3} />
			<Sound name="chime" at={hard + 40} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- shrink

export const Shrink: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const down = cue(l0, 'Down, and down');
	const phew = cue(l0, 'Phew');
	const stop = cue(l0, "But you don't stop");
	const forest = cue(l0, 'The grass grows');
	const lady = cue(l0, 'A ladybird');
	const cuts = [0, down - 4, phew - 4, stop - 4, lady - 4];
	const ant = frame >= stop - 4;
	const h = lerp(GIANT, 1.7, span(frame, 0, phew, (v) => 1 - Math.pow(1 - v, 2)));
	const grow = span(frame, stop, lady);
	const near = ant ? (
		<group>
			<Hero3D position={[0, 0, 0]} face={frame > forest ? 'shocked' : 'scared'} look={[0, 0.7]} armL={[30, 30]} armR={[30, 30]} />
			{frame > lady - 10 ? <Ladybird3D at={[lerp(18, -14, span(frame, lady - 10, dur)), 0, 6]} rot={-Math.PI / 2} frame={frame} walk={frame / 10} /> : null}
		</group>
	) : (
		<Hero3D position={[0, 0, 0]} height={h} face={frame > phew ? 'happy' : 'shocked'} armL={[20, 20]} armR={[20, 20]} />
	);
	const angles: Angle3[] = [
		{at: [0, h * 0.6, 0], dist: h * 2.6, yaw: 20, pitch: 6, fov: 40, ddist: 0, dyaw: 4, near: 0.05, far: 6000},
		{at: [0, h * 0.6, 0], dist: h * 2.6, yaw: 20, pitch: 6, fov: 40, ddist: 0, dyaw: 4, near: 0.05, far: 6000},
		{at: [0, 1.1, 0], dist: 4, yaw: 20, pitch: 6, fov: 40, near: 0.05, far: 2000},
		{at: [0, 1.2, 0], dist: 9, yaw: 30, pitch: 10, fov: 44, ddist: 10, dy: 6},
		{at: [0, 1.2, 0], dist: 14, yaw: -20, pitch: 8, fov: 44},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={ant ? LIGHT.gardenNight : bigLight([0, 0, 0], 'night', Math.max(20, h * 1.6))}
				bg={ant ? BG.gardenNight : BG.night}
				far={ant ? <group scale={[1, 0.05 + 0.95 * grow, 1]}><Grass size={160} clear={12} seed={41} tall={34} /></group> : <group><FieldSet lit /><Stars frame={frame} /></group>}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="NORMAL SIZE" x={960} y={860} size={56} frame={frame} at={phew - 2} until={stop - 4} color={UI.cream} />
						<Big text="…AND SHRINKING" x={960} y={250} size={100} frame={frame} at={stop + 10} until={lady - 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="vanish" at={4} volume={0.35} />
			<Sound name="vanish" at={stop + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- twist

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const legs = cue(l0, 'Six legs');
	const taps = cue(l0, 'It taps');
	const pip = cue(l0, "It's Pip");
	const lowers = cue(l0, 'Pip lowers');
	const before = cue(l0, 'Looks like');
	const cuts = [0, legs - 4, taps - 4, pip - 4, lowers - 4, before - 4];
	const come = span(frame, 0, taps - 10, (v) => v);
	const antAt: V3 = [lerp(-14, -2.6, come), lerp(2.2, 0, span(frame, 0, legs + 20)), lerp(-6, 0.3, come)];
	const tap = span(frame, taps, taps + 12) * (1 - span(frame, taps + 30, taps + 44));
	const wave = frame > taps + 30 && frame < lowers ? Math.sin(frame * 0.4) : 0;
	const nod = span(frame, lowers, lowers + 20) * 0.5;
	const climb = span(frame, before, before + 30);
	const near = (
		<group>
			<Pebble3D at={[-12, 0, -5]} r={4} />
			<Ant3D at={antAt} rot={Math.PI / 2 - 0.2} frame={frame} pip walk={come < 1 ? frame / 12 : undefined} tap={tap} nod={nod} headTurn={wave * 0.25} gaze={[0.6, 0.2]}>
				{climb > 0.5 ? <Hero3D position={[0, 0.75, 0]} sit face="happy" armR={[150, 120]} armL={[30, 30]} /> : null}
			</Ant3D>
			{climb <= 0.5 ? <Hero3D position={[0, 0, 0]} turn={-Math.PI / 2 + 0.2} face={frame > pip ? 'happy' : 'scared'} look={[0, 0.3]} armL={[30, 30]} armR={frame > pip ? [160, 20] : [30, 30]} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [-6, 1.6, -2], dist: 12, yaw: 50, pitch: 8, fov: 44, dyaw: 6},
		{at: [-4, 1.0, -1], dist: 7, yaw: 70, pitch: 6, fov: 44},
		{at: [-1.3, 1.3, 0.2], dist: 5, yaw: 150, pitch: 6, fov: 42},
		{at: [-2.6, 1.0, 0.3], dist: 4.2, yaw: 100, pitch: 4, fov: 40},
		{at: [-1.3, 1.1, 0.2], dist: 6, yaw: 30, pitch: 8, fov: 42},
		{at: [-2.6, 1.0, 0.3], dist: 7, yaw: 60, pitch: 18, fov: 42, ddist: 30, dy: 12},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.gardenNight}
				bg={BG.gardenNight}
				far={<Grass size={160} clear={12} seed={41} tall={34} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="PIP!" x={960} y={250} size={130} frame={frame} at={pip + 4} until={lowers - 4} color={UI.yellow} />
						<Label text="REMEMBER?" x={960} y={860} size={56} frame={frame} at={pip + 30} until={lowers} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="steps" at={6} volume={0.25} />
			<Sound name="squeak" at={taps + 4} volume={0.3} />
			<Sound name="chime" at={pip + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const comments = cue(l0, 'Tell me');
	const missed = cue(l0, 'And if you missed');
	const hi = cue(l0, 'Pip says');
	const cuts = [0];
	const angles: Angle3[] = [{at: [0, 1.0, 0], dist: 12, yaw: 30, pitch: 14, fov: 40, dyaw: 10}];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={smallLight([0, 0, 0], 'day', 20)}
				bg={BG.day}
				far={<group><Fields3D size={600} seed={16} /><T shape={{kind: 'sphere', r: 1, seg: 40}} color="#5AA8E8" position={[0, 0.06, -4]} scale={[7, 0.05, 15]} outline={0} /></group>}
				near={
					<group>
						<Hero3D position={[-1, 0, 2]} turn={0.3} face="happy" armR={[160, 10]} talk={frame < comments ? 0.3 : 0} />
						<Hero3D who={P8.friend} position={[1, 0, 2.4]} turn={-0.3} face="happy" armL={[150, 20]} />
						{[0, 1, 2].map((i) => <T key={i} shape={{kind: 'sphere', r: 0.18}} color="#FFFFFF" position={[-2 + i * 1.6 + Math.sin(frame * 0.05 + i) * 0.3, 0.1, -4 + i * 2]} scale={[1.3, 0.8, 1]} outline={0.01} />)}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Panel frame={frame} at={6} until={missed - 6} x={960} y={420} w={1100} h={330}>
							<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: FONT, fontWeight: 700}}>
								<div style={{fontSize: 44, color: '#B88AFF'}}>WOULD YOU RATHER BE…</div>
								<div style={{display: 'flex', gap: 60, alignItems: 'center', fontSize: 72}}>
									<span style={{color: '#FFD84A'}}>100 M TALL</span>
									<span style={{color: '#F2EEFF', fontSize: 50}}>or</span>
									<span style={{color: '#7CF27A'}}>ANT-SIZED?</span>
								</div>
							</div>
						</Panel>
						<Panel frame={frame} at={missed + 4} x={1340} y={470} w={760} h={440} title="WATCH NEXT">
							<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: FONT, fontWeight: 700, textAlign: 'center', padding: 30}}>
								<div style={{fontSize: 46, color: '#F2EEFF', lineHeight: 1.15}}>What If You Shrank to the Size of an Ant?</div>
								<svg viewBox="0 0 300 140" width={300} height={140}>
									{[0, 1, 2].map((i) => <line key={i} x1={110 + i * 40} y1={80} x2={90 + i * 50} y2={128} stroke="#140A28" strokeWidth={8} strokeLinecap="round" />)}
									<ellipse cx={90} cy={72} rx={38} ry={30} fill="#E8453C" stroke="#140A28" strokeWidth={7} />
									<ellipse cx={160} cy={72} rx={30} ry={24} fill="#E8453C" stroke="#140A28" strokeWidth={7} />
									<circle cx={225} cy={62} r={34} fill="#E8453C" stroke="#140A28" strokeWidth={7} />
									<circle cx={238} cy={54} r={11} fill="#fff" stroke="#140A28" strokeWidth={4} />
									<path d="M222 32 Q215 8 196 6 M240 30 Q250 6 270 8" fill="none" stroke="#140A28" strokeWidth={7} strokeLinecap="round" />
								</svg>
							</div>
						</Panel>
						<Label text="PIP SAYS HI" x={960} y={860} size={56} frame={frame} at={hi + 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={6} volume={0.3} />
			<Sound name="pop" at={missed + 6} volume={0.3} />
		</>
	);
};
