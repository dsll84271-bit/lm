import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Car3D, Fields3D, SchoolTop3D, Town3D} from '../../../three/sky3d';
import {Shot3, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Billboard3D, Cat8, Drone3D, Elephant3D, Giraffe3D, Goal8, Kite3D, Lorry3D, Oak3D, PizzaPile, Stadium3D, Trays3D, Van3D, Water8} from '../../../three/tall3d';
import {BG, bigLight, Giant, GIANT, HomeSet, housesIn, K, KIDS, LIGHT, leanHand, lookFrom, P8, Panel, smallLight} from './kit';
import {handAt, headAt, type V3} from './util';

// Part B: on the news, the shoulder ride, the view, the head rush, lunch,
// how much you'd eat, the scientists, overheating, being useful, and the
// footsteps that shake the town.

const BIGCAM = {near: 0.5, far: 9000};
const Studio: React.FC = () => <Ground color="#3A2E80" size={3000} lines={{every: 20, color: '#4A3E98', along: 'z'}} />;
const SmallStudio: React.FC = () => <Ground color="#3A2E80" size={200} lines={{every: 2, color: '#4A3E98', along: 'z'}} />;

/** The playground: the school, its yard, the field beside it. */
const SchoolSet: React.FC = () => (
	<group>
		<Town3D size={760} seed={5} clear={[{at: [0, 0], r: 150}]} />
		<SchoolTop3D at={[0, -70]} block={60} />
		<T shape={{kind: 'box', w: 260, h: 0.1, d: 180}} color="#7AC85A" position={[0, 0.03, 30]} outline={0} />
		<Goal8 at={[-40, 0, 30]} yaw={Math.PI / 2} />
		<Goal8 at={[40, 0, 30]} yaw={-Math.PI / 2} />
	</group>
);

// ---------------------------------------------------------------- news

export const News: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const photo = cue(l0, 'Your best friend');
	const not = cue(l0, 'You were not');
	const scratch = cue(l0, 'You were scratching');
	const nobody = cue(l0, 'Nobody believes');
	const cuts = [0, photo - 4, not - 4, nobody - 4];
	const pos: V3 = [0, 0, 0];
	const scr = Math.sin(frame * 0.5) * 6;
	const head = headAt(pos, false, GIANT);
	const tv = frame < photo - 4;
	const angles: Angle3[] = [
		{at: [head[0], head[1] - 6, head[2]], dist: 150, yaw: 35, pitch: 14, fov: 30, dyaw: 4, ...BIGCAM},
		{at: [head[0], head[1] - 6, head[2]], dist: 150, yaw: 35, pitch: 14, fov: 30, dyaw: 2, ...BIGCAM},
		{at: [head[0], head[1] - 4, head[2]], dist: 80, yaw: 15, pitch: 4, fov: 36, ...BIGCAM},
		{at: [head[0], head[1] - 4, head[2]], dist: 92, yaw: -10, pitch: 4, fov: 36, ...BIGCAM},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={bigLight([0, 0, 0], 'day', 120)}
				bg={BG.day}
				far={<HomeSet skip={housesIn(-40, 40)} />}
				near={<Giant at={pos} face={frame > nobody ? 'sad' : frame > not ? 'determined' : 'neutral'} armR={[150 + scr, 168]} reachR={42} armL={[14, 18]} look={[0.3, 0.2]} />}
				blur={0}
				grade={tv ? 'saturate(1.15) contrast(1.05)' : undefined}
				overlay={() => (
					<AbsoluteFill>
						{tv || frame < not - 4 ? (
							<AbsoluteFill>
								<div style={{position: 'absolute', inset: 0, border: '70px solid #120C24', borderRadius: 40, boxShadow: 'inset 0 0 0 6px #3A2E5A'}} />
								<div style={{position: 'absolute', left: 130, top: 170, background: '#E8333F', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 40, padding: '6px 22px', borderRadius: 10}}>● LIVE</div>
								<div style={{position: 'absolute', left: 70, right: 70, bottom: 150, height: 110, display: 'flex', fontFamily: FONT, fontWeight: 700}}>
									<div style={{background: '#E8333F', color: '#fff', fontSize: 44, padding: '0 30px', display: 'flex', alignItems: 'center'}}>BREAKING</div>
									<div style={{flex: 1, background: '#F4F2FF', color: '#140A28', fontSize: 52, padding: '0 30px', display: 'flex', alignItems: 'center'}}>GIANT CHILD IN TOWN</div>
								</div>
							</AbsoluteFill>
						) : null}
						{frame >= photo - 4 && frame < not - 4 ? (
							<AbsoluteFill>
								<AbsoluteFill style={{background: 'rgba(10,6,30,0.55)'}} />
								<div style={{position: 'absolute', left: 1180, top: 160, width: 460, height: 760, borderRadius: 56, background: '#140A28', border: '8px solid #3A2E5A', transform: `translateY(${(1 - span(frame, photo, photo + 12)) * 300}px)`}}>
									<div style={{position: 'absolute', left: 24, right: 24, top: 70, bottom: 70, borderRadius: 26, background: '#F4F2FF', padding: 20, fontFamily: FONT, fontWeight: 700}}>
										<div style={{fontSize: 30, color: '#7A6AA8'}}>Best friend</div>
										<div style={{marginTop: 20, height: 260, borderRadius: 18, background: 'linear-gradient(#5AA8F0, #CFEFFF)', position: 'relative', overflow: 'hidden'}}>
											<div style={{position: 'absolute', left: 120, top: 40, width: 150, height: 150, borderRadius: '50%', background: '#FF8A3D', border: '6px solid #140A28'}} />
											<div style={{position: 'absolute', left: 230, top: 120, width: 40, height: 90, borderRadius: 20, background: '#FF8A3D', border: '6px solid #140A28', transform: 'rotate(-20deg)'}} />
											<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: '#E8333F', color: '#fff', fontSize: 22, padding: '4px 10px'}}>BREAKING · GIANT CHILD</div>
										</div>
										<div style={{marginTop: 22, background: '#2E8AE8', color: '#fff', fontSize: 34, padding: '16px 20px', borderRadius: 24}}>YOU'RE PICKING YOUR NOSE ON TELLY</div>
									</div>
								</div>
							</AbsoluteFill>
						) : null}
						<Big text="SCRATCHING." x={960} y={260} size={110} frame={frame} at={scratch + 4} until={nobody} color={UI.yellow} />
						<Label text="NOBODY BELIEVES YOU" x={960} y={860} size={56} frame={frame} at={nobody + 8} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={6} volume={0.3} />
			<Sound name="ring" at={photo + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- friend

const CR: V3 = [0, 0, -20];

export const Friend: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const climbs = cue(l0, 'climbs onto');
	const lift = cue(l0, 'So you lift');
	const hood = cue(l0, 'They grab');
	const quiet = cue(l0, 'and for once');
	const cuts = [0, climbs - 4, lift - 4, hood - 4, quiet - 4];
	const up = span(frame, lift + 4, hood - 6);
	const lean = lerp(26, 0, up);
	const armR: [number, number] = [lerp(5, 92, up), lerp(5, 150, up)];
	const hand = leanHand(CR, 0, armR, lerp(0, 40, up), 1, lean);
	const ground = leanHand(CR, 0, [5, 5], 0, 1, 26);
	const run = span(frame, 0, climbs + 10, (v) => v);
	const start: V3 = [ground[0] + 30, 0, ground[2] + 60];
	const onHand = frame > climbs + 10;
	const shoulder: V3 = [CR[0] + 0.3 * K, (1.06 - 0.36) * K + 0.6, CR[2] - 0.02 * K];
	const atShoulder = frame > hood - 6;
	const palm: V3 = [hand[0] + 0.02 * K, hand[1] + 0.1 * K, hand[2] + 0.02 * K];
	const friend: V3 = atShoulder ? shoulder : onHand ? palm : [lerp(start[0], ground[0] + 5, run), 0, lerp(start[2], ground[2] + 6, run)];
	const fTurn = onHand ? -Math.PI / 2 : Math.atan2(ground[0] - start[0], ground[2] - start[2]);
	const near = (
		<group>
			<Giant at={CR} sit lean={atShoulder ? 0 : lean} face="happy" armR={atShoulder ? [10, 10] : armR} reachR={atShoulder ? 0 : lerp(0, 40, up)} armL={[14, 18]} look={atShoulder ? [0.8, 0] : [0.4, -0.6]} />
			<Hero3D who={P8.friend} position={friend} turn={atShoulder ? 0 : fTurn} run={!onHand} walk={!onHand ? frame / 4 : undefined} sit={atShoulder} face="happy" armL={atShoulder ? [150, 120] : onHand ? [120, 60] : [20, 20]} armR={atShoulder ? [150, 120] : onHand ? [120, 60] : [20, 20]} reachL={atShoulder ? 40 : 0} reachR={atShoulder ? 40 : 0} />
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([start[0] + 5, 1.5, start[2] + 9], [ground[0], 9, ground[2]], 58, {dyaw: 3}),
		{at: [CR[0] + 14, 18, CR[2] + 10], dist: 150, yaw: 50, pitch: 8, fov: 40, ...BIGCAM},
		lookFrom([CR[0] + 70, 24, CR[2] + 110], [CR[0] + 12, 30, CR[2]], 46, {dyaw: 3}),
		lookFrom([shoulder[0] + 14, shoulder[1] + 4, shoulder[2] + 20], [shoulder[0], shoulder[1] + 0.9, shoulder[2]], 16),
		lookFrom([shoulder[0] + 20, shoulder[1] + 2, shoulder[2] + 30], [shoulder[0] - 2, shoulder[1] + 1.4, shoulder[2]], 20, {dyaw: 2}),
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={bigLight([CR[0], 0, CR[2]], 'day', 90)} bg={BG.day} far={<SchoolSet />} near={near} blur={0} />
			<Sound name="run" at={6} volume={0.25} />
			<Sound name="whoosh" at={lift + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- view

/** Everything you can see from a hundred metres up: town, fields, a far city, the sea. */
const FarLand: React.FC<{frame: number}> = ({frame}) => {
	const towers = [];
	for (let i = 0; i < 26; i++) {
		const h = 40 + ((i * 37) % 9) * 14;
		towers.push(<T key={i} shape={{kind: 'box', w: 30, h, d: 30}} color={i % 3 ? '#B8B8D8' : '#9A9AC8'} position={[-600 + (i % 7) * 44 + (i % 2) * 10, h / 2, -1350 + Math.floor(i / 7) * 46]} outline={0.6} />);
	}
	return (
		<group>
			<Fields3D size={4400} seed={3} coast={-1900} />
			<Town3D size={900} seed={6} clear={[{at: [0, 0], r: 60}]} cars={false} />
			{towers}
			<Water8 at={[1300, 0.2, -1500]} w={60} d={3000} frame={frame} color="#3A7AC0" />
		</group>
	);
};

export const View: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const normal = cue(l0, 'When you were');
	const now = cue(l0, 'Now,');
	const city = cue(l0, 'You can see the next');
	const sea = cue(l0, 'You can see the sea');
	const cuts = [0, normal - 4, now - 4, city - 4, sea - 4];
	const rise = span(frame, 0, 40);
	const pos: V3 = [0, 0, 0];
	const head = headAt(pos, false, GIANT);
	const shoulder: V3 = [0.3 * K, 1.06 * K + 0.6, -0.02 * K];
	const near = (
		<group>
			<Giant at={[0, lerp(-0.36 * K, 0, rise), 0]} turn={Math.PI} sit={rise < 0.3} face="happy" armL={[14, 18]} armR={[14, 18]} />
			{rise > 0.3 ? <Hero3D who={P8.friend} position={[-shoulder[0], shoulder[1], -shoulder[2]]} turn={Math.PI} sit face="happy" armR={[150, 150]} reachR={20} armL={[30, 40]} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 60, 0], dist: 260, yaw: 20, pitch: 6, fov: 38, ...BIGCAM},
		lookFrom([head[0] + 46, head[1] + 8, head[2] + 18], [200, 30, -1500], 50),
		lookFrom([head[0] + 46, head[1] + 8, head[2] + 18], [200, 0, -3000], 46),
		lookFrom([head[0] + 40, head[1] + 8, head[2] + 14], [-500, 40, -1350], 40),
		lookFrom([head[0] + 46, head[1] + 8, head[2] + 18], [300, 0, -3600], 42),
	];
	const light = {...bigLight([0, 0, 0], 'day', 160), fog: {color: '#D8ECFF', near: 900, far: 4200}};
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg="linear-gradient(#4A98F0 0%, #D8ECFF 52%)"
				far={<FarLand frame={frame} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="YOU, YESTERDAY: HORIZON ≈ 4 KM" x={960} y={220} size={54} frame={frame} at={normal + 8} until={now - 4} color={UI.cream} />
						<Big text="NOW: ≈ 35 KM" x={960} y={250} size={110} frame={frame} at={now + 4} until={city - 4} color={UI.yellow} />
						<Label text="THE NEXT CITY" x={760} y={420} size={54} frame={frame} at={city + 10} until={sea - 2} color={UI.cream} />
						<Label text="THE SEA" x={960} y={420} size={60} frame={frame} at={sea + 10} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={4} volume={0.3} />
			<Sound name="pop" at={now + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- dizzy

export const Dizzy: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const fast = cue(l0, 'You stood up');
	const climb = cue(l0, 'Your blood');
	const giraffe = cue(l0, 'Giraffes have');
	const twice = cue(l0, 'Their blood pressure');
	const cuts = [0, fast - 4, climb - 4, giraffe - 4, twice - 4];
	const studio = frame >= giraffe - 4;
	const wob = frame < climb ? Math.sin(frame * 0.25) * 10 * (1 - span(frame, fast + 20, climb)) : 0;
	const sitT = span(frame, fast + 10, fast + 34, (v) => v * v);
	const pos: V3 = [0, lerp(0, -0.36 * K, sitT), 0];
	const near = studio ? (
		<group>
			<Giraffe3D at={[0, 0, 0]} yaw={0.5} flow={((frame - giraffe) % 45) / 45} frame={frame} />
			<Hero3D position={[3.5, 0, 0.5]} turn={-0.4} face="happy" />
		</group>
	) : (
		<group>
			<Giant at={pos} sit={sitT > 0.5} face={frame > fast ? 'scared' : 'shocked'} tilt={wob} lean={wob * 0.5} armL={[50 + wob, 40]} armR={[50 - wob, 40]} />
			{frame > climb - 4 ? <T shape={{kind: 'capsule', r: 0.04 * K, len: 0.5 * K}} color="#FF3A4A" position={[0, pos[1] + 0.95 * K, 0.2 * K]} outline={0} opacity={0.7} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 60, 0], dist: 220, yaw: 15, pitch: 6, fov: 38, roll: wob * 0.6, ...BIGCAM},
		{at: [0, 40, 0], dist: 240, yaw: 30, pitch: 8, fov: 38, ...BIGCAM},
		{at: [0, 50, 0], dist: 160, yaw: 70, pitch: 4, fov: 40, ...BIGCAM},
		{at: [0, 3.2, 0], dist: 13, yaw: 25, pitch: 6, fov: 38},
		{at: [0, 4, 0], dist: 9, yaw: 50, pitch: 4, fov: 38, dyaw: -8},
	];
	const swirl = frame < climb ? Math.max(0, Math.sin(frame * 0.15)) * (1 - span(frame, fast + 20, climb)) : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={studio ? LIGHT.studio : bigLight([0, 0, 0], 'day', 120)}
				bg={studio ? BG.studio : BG.day}
				far={studio ? <SmallStudio /> : <SchoolSet />}
				near={near}
				blur={0}
				grade={swirl > 0 ? `hue-rotate(${swirl * 12}deg) blur(${swirl * 3}px) saturate(${1 + swirl * 0.3})` : undefined}
				overlay={() => (
					<AbsoluteFill>
						<Label text="HEART → BRAIN: A LONG CLIMB" x={960} y={860} size={52} frame={frame} at={climb + 8} until={giraffe - 4} color="#FF8A8A" />
						<Label text="GIRAFFE: HEART → BRAIN ≈ 2 M" x={960} y={220} size={52} frame={frame} at={giraffe + 8} color={UI.cream} />
						<Big text="≈ 2× YOUR BLOOD PRESSURE" x={960} y={860} size={78} frame={frame} at={twice + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={6} volume={0.35} />
			<Sound name="thud" at={fast + 34} volume={0.5} />
			<Sound name="heart" at={giraffe + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- lunch

export const Lunch: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const wheel = cue(l0, 'The dinner ladies');
	const tip = cue(l0, 'You tip');
	const bite = cue(l0, 'and eat it');
	const rumble = cue(l0, 'Your stomach');
	const cuts = [0, wheel - 4, tip - 4, bite - 4, rumble - 4];
	const roll = span(frame, wheel, tip, (v) => v);
	const lift = span(frame, tip + 10, bite + 4);
	const armR: [number, number] = [lerp(10, 70, lift), lerp(10, 150, lift)];
	const hand = handAt(CR, 0, armR, lerp(0, 60, lift), 1, true, GIANT);
	const trays: V3 = frame > tip + 10 ? [hand[0], hand[1] + 1.4, hand[2]] : [hand[0] + 6, 0, lerp(hand[2] + 40, hand[2] + 6, roll)];
	const eaten = frame > bite + 14;
	const rumbleK = frame > rumble ? Math.sin(frame * 1.7) * 0.6 * (1 - span(frame, rumble + 30, rumble + 60)) : 0;
	const near = (
		<group>
			<Giant at={CR} sit face={eaten ? 'happy' : 'shocked'} talk={frame > bite && frame < bite + 14 ? 0.8 : 0} armR={armR} reachR={lerp(0, 60, lift)} armL={[14, 18]} look={[0.4, -0.4]} tilt={rumbleK} />
			{!eaten ? <Trays3D at={trays} n={8} /> : null}
			{frame < tip + 10 ? [0, 1, 2].map((i) => <Hero3D key={i} who={P8.teacher} position={[trays[0] - 4 + i * 3, 0, trays[2] + 1.5]} turn={Math.PI} walk={frame / 6} armL={[30, 70]} armR={[30, 70]} reachL={50} reachR={50} />) : null}
			<Car3D at={[CR[0] + 70, 0, CR[2] + 60]} yaw={0.4} color="#2E8AE8" />
			{frame > rumble + 6 && frame % 12 < 6 ? <Glow shape={{kind: 'sphere', r: 0.3}} color="#FFB84A" position={[CR[0] + 70, 1.2, CR[2] + 62]} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [CR[0], 40, CR[2]], dist: 200, yaw: 40, pitch: 10, fov: 40, ...BIGCAM},
		lookFrom([trays[0] + 10, 2, trays[2] + 18], [trays[0], 1, trays[2]], 46, {dyaw: 3}),
		lookFrom([hand[0] + 30, hand[1] + 6, hand[2] + 40], [hand[0], hand[1], hand[2]], 46),
		{at: [CR[0], 0.9 * K, CR[2]], dist: 90, yaw: 25, pitch: 4, fov: 38, ...BIGCAM},
		lookFrom([CR[0] + 78, 1.6, CR[2] + 70], [CR[0] + 30, 30, CR[2]], 50),
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={bigLight([CR[0], 0, CR[2]], 'noon', 100)} bg={BG.noon} far={<SchoolSet />} near={near} blur={0} overlay={() => <Big text="RUMBLE…" x={960} y={250} size={110} frame={frame} at={rumble + 6} color={UI.yellow} rotate={-4} />} />
			<Sound name="steps" at={wheel + 4} volume={0.25} />
			<Sound name="crunch" at={bite + 6} volume={0.45} />
			<Sound name="boom" at={rumble + 4} volume={0.4} />
			<Sound name="ring" at={rumble + 8} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- food

export const Food: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const ten = cue(l0, 'but you');
	const ele = cue(l0, 'Elephants spend');
	const heavier = cue(l0, "And you're more");
	const cuts = [0, ten - 4, ele - 4, heavier - 4];
	const pile = Math.round(lerp(1, 600, span(frame, ten, ele - 10)));
	const big = frame >= heavier - 4;
	const angles: Angle3[] = [
		{at: [0, 1.5, 0], dist: 8, yaw: 20, pitch: 12, fov: 38, ddist: 10, dy: 2},
		{at: [0, 2.5, 0], dist: 20, yaw: 20, pitch: 12, fov: 40, ddist: 6},
		{at: [0, 3, 0], dist: 13, yaw: 30, pitch: 6, fov: 38, dyaw: 6},
		{at: [10, 50, 0], dist: 220, yaw: 10, pitch: 4, fov: 38, ...BIGCAM},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={big ? LIGHT.studioBig : LIGHT.studio}
				bg={BG.studio}
				far={big ? <Studio /> : <SmallStudio />}
				near={
					big ? (
						<group>
							<Giant at={[0, 0, 0]} face="happy" armL={[14, 18]} armR={[14, 18]} />
							<Elephant3D at={[30, 0, 10]} yaw={-0.5} />
						</group>
					) : frame < ele - 4 ? (
						<PizzaPile at={[0, 0, 0]} n={pile} r={4} />
					) : (
						<group>
							<Elephant3D at={[0, 0, 0]} yaw={0.6} trunk={0.5 + Math.sin(frame * 0.2) * 0.4} />
							<Oak3D at={[2.4, 0, -3.5]} h={6} seed={2} />
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="≈ 10,000× MORE FOOD" x={960} y={250} size={96} frame={frame} at={ten + 20} until={ele - 4} color={UI.yellow} />
						<Label text="ELEPHANTS: UP TO 16 HOURS A DAY EATING" x={960} y={860} size={52} frame={frame} at={ele + 10} until={heavier - 4} color={UI.cream} />
						<Label text="YOU: OVER 1,000× HEAVIER THAN AN ELEPHANT" x={960} y={860} size={52} frame={frame} at={heavier + 10} color={UI.yellow} />
						<Label text="ELEPHANT" x={1180} y={760} size={40} frame={frame} at={heavier + 20} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={ten + 20} volume={0.3} />
			<Sound name="crunch" at={ele + 10} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- measure

export const Measure: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const drone = cue(l0, 'They fly');
	const exact = cue(l0, 'A hundred metres');
	const ask = cue(l0, 'Then they ask');
	const give = cue(l0, 'You give');
	const thick = cue(l0, "It's as thick");
	const carry = cue(l0, 'and it takes six');
	const cuts = [0, drone - 4, exact - 4, ask - 4, give - 4, thick - 4, carry - 4];
	const pos: V3 = [0, 0, 0];
	const head = headAt(pos, false, GIANT);
	const dUp = span(frame, drone, exact + 10, (v) => v);
	const droneAt: V3 = [24, lerp(2, head[1] + 4, dUp), 30];
	const van: V3 = [40, 0, 50];
	const pluck = span(frame, give, give + 30);
	const armR: [number, number] = [lerp(14, 160, pluck), lerp(18, 170, pluck)];
	const down = span(frame, thick - 10, thick + 30);
	const armD: [number, number] = frame > thick - 10 ? [lerp(160, 30, down), lerp(170, 50, down)] : armR;
	const hand = handAt(pos, 0, armD, frame > thick - 10 ? lerp(40, 70, down) : 40 * pluck, 1, false, GIANT);
	const walkAway = span(frame, carry + 6, dur, (v) => v);
	const hairMid: V3 = frame > thick + 30 ? [lerp(30, van[0] - 2, walkAway), 1.6, lerp(28, van[2] - 4, walkAway)] : [hand[0], hand[1] - 2, hand[2]];
	const sci = [0, 1, 2, 3, 4, 5];
	const near = (
		<group>
			<Giant at={pos} face={frame > ask ? 'happy' : 'neutral'} armR={armD} reachR={frame > thick - 10 ? lerp(40, 70, down) : 40 * pluck} armL={[14, 18]} look={[0.5, -0.5]} />
			<Drone3D at={droneAt} frame={frame} s={2} laser={frame > exact - 10 && frame < exact + 30 ? 1 : 0} yaw={-2.4} />
			<Van3D at={van} yaw={-0.6} />
			{frame > give ? <T shape={{kind: 'capsule', r: 0.05, len: 4}} color="#140A28" position={hairMid} rotation={[0, frame > thick + 30 ? -0.6 : 0, Math.PI / 2]} outline={0} /> : null}
			{sci.map((i) => {
				const carrying = frame > thick + 30;
				const p: V3 = carrying ? [hairMid[0] - 1.6 + i * 0.64, 0, hairMid[2] - (i % 2 ? 0.45 : -0.45) + (i - 2.5) * 0.4] : [28 + (i % 3) * 1.6, 0, 26 + Math.floor(i / 3) * 1.8];
				return <Hero3D key={i} who={P8.scientist} position={p} turn={carrying ? 0.9 : -2.4} walk={carrying ? frame / 6 + i : undefined} armL={carrying ? [150, 170] : [20, 20]} armR={carrying ? [150, 170] : [20, 20]} face="happy" look={[0, 0.8]} lite />;
			})}
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([60, 3, 80], [10, 30, 0], 50, {dyaw: 3}),
		lookFrom([droneAt[0] + 12, droneAt[1] + 2, droneAt[2] + 18], droneAt, 46),
		lookFrom([head[0] + 30, head[1] + 4, head[2] + 50], [head[0] + 6, head[1] - 2, head[2] + 10], 44),
		lookFrom([24, 1.4, 34], [29, 1.6, 27], 42),
		lookFrom([hand[0] + 30, hand[1] + 2, hand[2] + 40], hand, 44),
		lookFrom([hairMid[0] + 6, 2.2, hairMid[2] + 8], hairMid, 46),
		lookFrom([hairMid[0] + 8, 2.6, hairMid[2] + 10], hairMid, 46),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={smallLight([20, 0, 30], 'day', 60)}
				bg={BG.day}
				far={<group><Fields3D size={1400} seed={4} /><Town3D size={700} seed={7} clear={[{at: [0, 0], r: 220}]} cars={false} /></group>}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="100.0 M" x={960} y={260} size={120} frame={frame} at={exact + 4} until={ask} color="#FF5A5A" />
						<Label text="ONE HAIR: THICK AS A PENCIL LEAD · LONG AS A CAR" x={960} y={860} size={48} frame={frame} at={thick + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={drone + 6} volume={0.3} />
			<Sound name="chime" at={exact + 4} volume={0.3} />
			<Sound name="snap" at={give + 26} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- heat

const RES: V3 = [0, 0, -120];

export const Heat: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const big = cue(l0, 'A big body');
	const ele = cue(l0, 'Elephants cool');
	const ears = cue(l0, "You don't have");
	const sit = cue(l0, 'So you go');
	const closed = cue(l0, 'The reservoir is closed');
	const why = cue(l0, 'Nobody will');
	const cuts = [0, big - 4, ele - 4, ears - 4, sit - 4, closed - 4];
	const studio = frame >= ele - 4 && frame < ears - 4;
	const inWater = frame >= sit - 4;
	const sink = span(frame, sit + 6, sit + 40);
	const fan = Math.sin(frame * 0.5) * 30;
	const near = studio ? (
		<Elephant3D at={[0, 0, 0]} yaw={0.4} flap={(Math.sin(frame * 0.4) + 1) / 2} hot={1 - span(frame, ele + 30, ears - 10)} />
	) : inWater ? (
		<group>
			<Giant at={[RES[0], lerp(-0.36 * K + 8, -0.36 * K - 10, sink), RES[2]]} sit face={frame > closed ? 'smug' : 'happy'} armL={[40, 30]} armR={[40, 30]} />
			<Water8 at={[RES[0], 1.3, RES[2]]} r={240} frame={frame} color="#3A8AD0" />
			{[0, 1, 2].map((i) => {
				const t = span(frame, sit + 20 + i * 8, sit + 120 + i * 8);
				return t > 0 && t < 1 ? (
					<mesh key={i} position={[RES[0], 1, RES[2]]} rotation={[-Math.PI / 2, 0, 0]}>
						<ringGeometry args={[60 + t * 160, 63 + t * 160, 64]} />
						<meshBasicMaterial color="#FFFFFF" transparent opacity={0.8 * (1 - t)} />
					</mesh>
				) : null;
			})}
		</group>
	) : (
		<group>
			<Giant at={[0, 0, 0]} face="sad" armR={[120 + fan * 0.2, 150]} reachR={30} armL={[14, 18]} />
			<group position={handAt([0, 0, 0], 0, [120 + fan * 0.2, 150], 30, 1, false, GIANT)} rotation={[0, fan * 0.02, 0]}>
				<Billboard3D at={[0, 6, 0]} w={14} h={6} />
			</group>
			{[0, 1, 2, 3].map((i) => {
				const t = ((frame * 0.02 + i * 0.25) % 1);
				return <T key={i} shape={{kind: 'sphere', r: 1.6}} color="#8AD0FF" position={[(i - 1.5) * 8, 0.95 * K - t * 40, 0.2 * K]} scale={[0.8, 1.2, 0.8]} outline={0.1} />;
			})}
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 60, 0], dist: 210, yaw: 20, pitch: 6, fov: 38, ...BIGCAM},
		{at: [0, 70, 0], dist: 150, yaw: -20, pitch: 4, fov: 38, ...BIGCAM},
		{at: [0, 3, 0], dist: 9, yaw: 30, pitch: 6, fov: 40},
		{at: [0, 70, 0], dist: 120, yaw: 30, pitch: 4, fov: 38, ...BIGCAM},
		{at: [RES[0], 30, RES[2]], dist: 420, yaw: 30, pitch: 14, fov: 38, ...BIGCAM},
		{at: [RES[0], 40, RES[2]], dist: 300, yaw: -20, pitch: 10, fov: 38, ...BIGCAM},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={studio ? LIGHT.studio : bigLight(inWater ? RES : [0, 0, 0], 'noon', inWater ? 260 : 120)}
				bg={studio ? BG.studio : BG.noon}
				far={studio ? <SmallStudio /> : <group><Fields3D size={2400} seed={8} /><Town3D size={700} seed={9} clear={[{at: [0, 0], r: 80}, {at: [RES[0], RES[2]], r: 260}]} /></group>}
				near={near}
				blur={0}
				grade={!studio && !inWater ? 'saturate(1.2) sepia(0.15)' : undefined}
				overlay={() => (
					<AbsoluteFill>
						{!studio && !inWater ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(255,90,40,0.35) 100%)'}} /> : null}
						<Label text="LOTS OF HEAT · NOT MUCH SKIN FOR YOUR SIZE" x={960} y={860} size={50} frame={frame} at={big + 10} until={ele - 4} color="#FF9A6A" />
						<Label text="WARM BLOOD IN THIN EARS · FLAP TO COOL" x={960} y={860} size={52} frame={frame} at={ele + 10} until={ears - 4} color={UI.cream} />
						<Label text="RESERVOIR CLOSED" x={960} y={220} size={64} frame={frame} at={closed + 6} color="#FF5A5A" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="sizzle" at={6} volume={0.25} />
			<Sound name="whoosh" at={ele + 6} volume={0.25} />
			<Sound name="splash" at={sit + 10} volume={0.6} />
		</>
	);
};

// ---------------------------------------------------------------- useful

export const Useful: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const goal = cue(l0, "You're the goal");
	const lets = cue(l0, 'You let in');
	const home = l1.a;
	const kite = cue(l1, 'You pick');
	const lorry = cue(l1, 'You lift');
	const cat = cue(l1, 'You rescue');
	const back = cue(l1, 'It climbs');
	const cuts = [0, goal - 4, lets - 4, home - 4, kite - 4, lorry - 4, cat - 4, back - 4];
	const scene = frame < home - 4 ? 'goal' : frame < kite - 4 ? 'walk' : frame < lorry - 4 ? 'kite' : frame < cat - 4 ? 'lorry' : 'cat';
	const pos: V3 = [0, 0, 0];
	// The football: kids at the far end, the ball through your feet.
	const ballT = (frame % 40) / 40;
	const ballAt: V3 = [lerp(-30, 0, ballT) + 0.0, 0.11 + Math.sin(ballT * Math.PI) * 1.2, lerp(30, 0, ballT)];
	const reachArm: [number, number] = [10, 40];
	const rHand = handAt(pos, 0, reachArm, 80, 1, true, GIANT);
	const t = scene === 'kite' ? span(frame, kite + 4, kite + 40) : scene === 'lorry' ? span(frame, lorry + 4, lorry + 40) : span(frame, cat + 4, cat + 40);
	const treeAt: V3 = [rHand[0] + 4, 0, rHand[2] + 8];
	let near: React.ReactNode = null;
	let angles: Angle3[] = [];
	if (scene === 'goal' || scene === 'walk') {
		near = (
			<group>
				<Giant at={pos} turn={scene === 'walk' ? Math.PI / 2 : 0} face="happy" walk={scene === 'walk' ? frame * 0.045 : undefined} armL={[20, 20]} armR={[20, 20]} />
				{scene === 'goal'
					? [0, 1, 2, 3, 4, 5].map((i) => <Hero3D key={i} who={KIDS[i % KIDS.length]} position={[-28 + (i % 3) * 3, 0, 26 + Math.floor(i / 3) * 3]} turn={-2.4} run walk={frame / 4 + i} face="happy" lite />)
					: null}
				{scene === 'goal' ? <T shape={{kind: 'sphere', r: 0.3}} color="#FFFFFF" position={ballAt} outline={0.03} /> : null}
			</group>
		);
		angles = [lookFrom([-40, 1.6, 40], [0, 12, 0], 56), lookFrom([-20, 1.0, 22], [0, 6, 0], 56), lookFrom([-70, 30, 70], [0, 20, 0], 46), {at: [0, 50, 0], dist: 260, yaw: 120, pitch: 8, fov: 38, ...BIGCAM}];
	} else {
		const held: V3 = [lerp(treeAt[0], rHand[0], t), lerp(scene === 'lorry' ? 0.5 : 18, rHand[1] - 3, t), lerp(treeAt[2], rHand[2], t)];
		const arm: [number, number] = [lerp(10, 10, t), lerp(10, 40, t)];
		near = (
			<group>
				<Giant at={pos} sit face="happy" armR={arm} reachR={lerp(70, 80, t)} armL={[14, 18]} look={[0.5, -0.6]} />
				{scene !== 'lorry' ? <Oak3D at={treeAt} h={22} seed={3} /> : <T shape={{kind: 'box', w: 30, h: 3, d: 10}} color="#5A7A3A" position={[treeAt[0], -1.4, treeAt[2]]} outline={0} />}
				{scene === 'kite' ? <Kite3D at={held} rot={[0, 0, 0.4]} s={1.8} frame={frame} /> : null}
				{scene === 'kite' && t > 0.9 ? <Hero3D who={P8.brother} position={[treeAt[0] + 6, 0, treeAt[2] + 6]} turn={-0.6} face="happy" armR={[160, 10]} height={1.3} /> : null}
				{scene === 'lorry' ? <Lorry3D at={held} rot={[lerp(0.5, 0, t), -0.4, lerp(0.3, 0, t)]} /> : null}
				{scene === 'cat' ? <Cat8 at={frame > back ? [treeAt[0] + 1.5, lerp(0, 16, span(frame, back + 4, back + 40)), treeAt[2] + 1.5] : [held[0], lerp(18, 0.2, span(frame, cat + 20, cat + 50)), held[2]]} rot={frame > back ? [-1.4, 0.6, 0] : [0, 0.6, 0]} s={3} /> : null}
			</group>
		);
		const look = scene === 'lorry' ? held : [treeAt[0], 12, treeAt[2]];
		angles = [scene === 'lorry' ? lookFrom([look[0] + 26, look[1] + 4, look[2] + 34], look as V3, 46) : lookFrom([treeAt[0] + 48, 20, treeAt[2] - 14], [treeAt[0] - 10, 20, treeAt[2] - 2], 50)];
	}
	const which = scene === 'goal' ? (frame < goal - 4 ? 0 : frame < lets - 4 ? 1 : 2) : scene === 'walk' ? 3 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0]}
				angles={[angles[Math.min(which, angles.length - 1)]]}
				light={bigLight([0, 0, 0], 'day', 100)}
				bg={BG.day}
				far={scene === 'goal' ? <SchoolSet /> : <group><Fields3D size={1600} seed={10} /><Town3D size={800} seed={11} clear={[{at: [0, 0], r: 120}]} /></group>}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="THE GOAL" x={960} y={860} size={56} frame={frame} at={goal + 6} until={lets - 4} color={UI.yellow} />
						<Big text="47 GOALS" x={960} y={260} size={110} frame={frame} at={lets + 20} until={home - 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="swish" at={goal} volume={0.3} />
			<Sound name="crowd" at={lets + 10} volume={0.25} />
			<Sound name="pop" at={kite + 30} volume={0.3} />
			<Sound name="thud" at={lorry + 40} volume={0.3} />
			<Sound name="squeak" at={back + 4} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- quake

export const Quake: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const uni = cue(l0, 'and the scientists');
	const measured = cue(l0, 'Ground shaking');
	const swift = cue(l0, 'In twenty twenty three');
	const mag = cue(l0, 'as much as');
	const cuts = [0, uni - 4, measured - 4, swift - 4, mag - 4];
	const step = 34;
	const thoom = frame < swift - 4 ? frame % step < 3 : false;
	const s = frame < swift - 4 ? shake(frame, frame - (frame % step), 1, 12) : {x: 0, y: 0};
	const studio = frame >= swift - 4;
	const cup = frame < swift - 4 ? Math.max(0, 0.15 - (frame % step) * 0.01) : 0;
	const walkX = lerp(-200, 40, span(frame, 0, swift, (v) => v));
	const near = studio ? (
		<Stadium3D at={[0, 0, 0]} frame={frame} bounce={1} />
	) : (
		<group>
			<Giant at={[walkX, 0, -60]} turn={Math.PI / 2} walk={frame * 0.045} face="happy" armL={[20, 20]} armR={[20, 20]} />
			<T shape={{kind: 'cyl', r: 0.45, h: 0.05}} color="#FFFFFF" position={[0, 0.75, 6]} outline={0.01} />
			<T shape={{kind: 'cyl', r: 0.05, h: 0.75}} color="#4A4660" position={[0, 0.37, 6]} outline={0.005} />
			<T shape={{kind: 'cyl', r: 0.05, r2: 0.06, h: 0.1}} color="#E8453C" position={[0.1, 0.83 + cup, 6]} outline={0.006} />
			<Car3D at={[4, 0, 3]} yaw={0.2} color="#3AB87A" />
			{thoom || frame % 10 < 5 ? <Glow shape={{kind: 'sphere', r: 0.14}} color="#FFB84A" position={[4.7, 0.75, 5.1]} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([1.5, 1.1, 9.5], [walkX * 0.25, 40, -60], 60),
		lookFrom([-1.5, 1.0, 8.5], [0, 0.9, 6], 44),
		{at: [0, 1, 6], dist: 6, yaw: 40, pitch: 8, fov: 50, ...BIGCAM},
		{at: [0, 1.2, 0], dist: 24, yaw: 20, pitch: 30, fov: 38, dyaw: 8},
		{at: [0, 1.2, 0], dist: 20, yaw: -10, pitch: 24, fov: 38},
	];
	const a = angles;
	if (!studio) {
		a[0] = {...a[0], at: [a[0].at[0] + s.x * 0.02, a[0].at[1] + s.y * 0.02, a[0].at[2]]};
	}
	const needle = (x: number) => {
		const k = frame < swift - 4 ? Math.exp(-((frame - x) % step) / 8) : (Math.sin(frame * 0.55) + 1) / 2;
		return k;
	};
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={a}
				light={studio ? LIGHT.studio : smallLight([0, 0, 0], 'evening', 30)}
				bg={studio ? BG.studio : BG.evening}
				far={studio ? <SmallStudio /> : <HomeSet skip={housesIn(-20, 20, [1])} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Panel frame={frame} at={uni + 4} until={swift - 6} x={1460} y={500} w={680} h={360} title="SEISMOMETER">
							<svg viewBox="0 0 680 296" width={680} height={296}>
								<rect width={680} height={296} fill="#F4F2FF" />
								{[...Array(5)].map((_, i) => <line key={i} x1={0} y1={60 + i * 45} x2={680} y2={60 + i * 45} stroke="#D8D0F0" strokeWidth={2} />)}
								<polyline
									fill="none"
									stroke="#E8333F"
									strokeWidth={4}
									points={[...Array(120)].map((_, i) => {
										const ff = frame - (120 - i) * 0.6;
										const k = ff < 0 ? 0 : Math.exp(-((ff + 400) % step) / 6);
										return `${i * 5.6},${150 + Math.sin(i * 2.3) * 90 * k}`;
									}).join(' ')}
								/>
							</svg>
						</Panel>
						{studio ? (
							<AbsoluteFill>
								<Label text="SEATTLE · 2023" x={960} y={220} size={60} frame={frame} at={swift + 4} color={UI.cream} />
								<Big text="LIKE A MAGNITUDE 2.3 QUAKE" x={960} y={860} size={78} frame={frame} at={mag + 6} color={UI.yellow} />
								<div style={{position: 'absolute', left: 1560, top: 380, width: 16, height: 260, background: '#F4F2FF', borderRadius: 8, border: '4px solid #140A28'}}>
									<div style={{position: 'absolute', left: -60, top: 120 - needle(0) * 100, width: 130, height: 8, background: '#E8333F', borderRadius: 4}} />
								</div>
							</AbsoluteFill>
						) : null}
					</AbsoluteFill>
				)}
			/>
			{[...Array(Math.ceil(swift / step))].map((_, i) => <Sound key={i} name="thud" at={i * step} volume={0.45} />)}
			<Sound name="ring" at={10} volume={0.2} />
			<Sound name="crowd" at={swift + 4} volume={0.3} />
		</>
	);
};


