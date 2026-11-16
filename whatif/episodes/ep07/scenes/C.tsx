import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Splash3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Ambergris3D, Beaks3D, Gut3D, Slime3D, Stink3D} from '../../../three/inside3d';
import {Many, rnd, type Copy} from '../../../three/many';
import {Boat3D, Bubbles3D, Fish3D, Kayak3D, Squid3D, Underwater3D, UwCamera3D, Whale3D, whalePoint} from '../../../three/ocean3d';
import {Desk3, Room3, Shelf3} from '../../../three/sets3d';
import {Mountains3D, Sea3D} from '../../../three/sky3d';
import {Shot3, type Angle3} from '../../../three/shot3';
import {T} from '../../../three/toon';
import {Bedroom} from '../../ep05/scenes/A';
import {BG, gutLight, HeldAmber, LIGHT, P7, Panel, SeaSet, Swimmer, Vignette} from './kit';
import {handAt, headAt, type V3} from './util';

// Part C: thrown back up and out, the whale's breath, back on the boat, the
// whale pump, the 1891 hoax, the two real people who ended up in a whale's
// mouth, the stink of fresh ambergris, the last photo, and the outro.

const withShake = (a: Angle3, frame: number, at: number, k = 0.06, amount = 1, len = 18): Angle3 => {
	const s = shake(frame, at, amount, len);
	return {...a, at: [a.at[0] + s.x * k, a.at[1] + s.y * k, a.at[2]]};
};

/** A whale's blow: a bushy spray of white droplets from `at` along `dir`, `t` 0..1 through the breath. */
const Spout3D: React.FC<{at: V3; dir: V3; t: number; n?: number; h?: number}> = ({at, dir, t, n = 160, h = 5}) => {
	if (t <= 0 || t >= 1) {
		return null;
	}
	const items: Copy[] = [];
	const d = new THREE.Vector3(...dir).normalize();
	for (let i = 0; i < n; i++) {
		const u = (rnd(i * 1.7) * 0.9 + t * 0.8) % 1;
		const life = Math.min(1, t * 3) * (1 - Math.max(0, t - 0.7) / 0.3);
		const s = u * h;
		const spread = 0.15 + u * 0.9;
		const p: V3 = [at[0] + d.x * s + (rnd(i * 3.1) - 0.5) * spread, at[1] + d.y * s + (rnd(i * 5.3) - 0.5) * spread - u * u * 1.2, at[2] + d.z * s + (rnd(i * 7.7) - 0.5) * spread];
		items.push({p, s: (0.22 + rnd(i * 2.2) * 0.3) * life * (0.6 + u * 0.6)});
	}
	return <Many kind={`spout${n}`} geom={() => new THREE.SphereGeometry(1, 10, 8)} items={items} color="#FFFFFF" outline={0.1} glow opacity={0.9} shadow={false} />;
};

/** Pink goo blobs flying with you. */
const Goo3D: React.FC<{at: V3; frame: number; n?: number; r?: number; seed?: number}> = ({at, frame, n = 40, r = 1.2, seed = 0}) => {
	const items: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const a = rnd(i * 1.3 + seed) * Math.PI * 2;
		const d = rnd(i * 2.7 + seed) * r;
		items.push({p: [at[0] + Math.cos(a) * d, at[1] + Math.sin(a) * d * 0.7, at[2] + (rnd(i * 4.4 + seed) - 0.5) * r * 2 + Math.sin(frame * 0.2 + i) * 0.1], s: 0.08 + rnd(i * 6.6 + seed) * 0.12, c: rnd(i * 8.1) > 0.5 ? '#F8B0C4' : '#E8889A'});
	}
	return <Many kind={`goo${n}`} geom={() => new THREE.SphereGeometry(1, 10, 8)} items={items} outline={0.2} shadow={false} />;
};

// ---------------------------------------------------------------- out

export const Out: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const teeth = cue(l0, 'out between');
	const bright = cue(l0, 'and into the bright');
	const kick = cue(l0, 'You kick');
	const pop = cue(l0, 'and pop up');
	const comes = cue(l0, 'Then the whale');
	const breathes = cue(l0, 'and breathes out');
	const blowhole = cue(l0, "A sperm whale's");
	const straight = cue(l0, 'Straight over');
	const cuts = [0, teeth - 4, bright - 4, kick - 4, pop - 4, comes - 4, breathes - 4, blowhole - 4, straight - 4];
	const part = frame < teeth - 4 ? 'tube' : frame < kick - 4 ? 'mouth' : frame < pop - 4 ? 'up' : 'top';
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light = LIGHT.under;
	let bg = BG.under;
	let angle: Angle3[] = [];
	const boatAt: V3 = [0, 0, 0];
	const heroTop: V3 = [-3.2, -0.95, -5.6];
	const surfaceT = span(frame, comes, comes + 40);
	const whaleTop: V3 = [-10.7, lerp(-5, -0.9, surfaceT), -13.3];
	const whaleRot: V3 = [lerp(-0.3, 0.02, surfaceT), 0.55, 0];
	const bh = whalePoint(whaleTop, whaleRot, 16, 0.955, 0.045, 0.11);
	const spoutDir = new THREE.Vector3(0.55, 1.0, 0.75).applyEuler(new THREE.Euler(0, whaleRot[1], 0));
	const spoutT1 = (frame - breathes) / 70;
	const spoutT2 = (frame - (straight - 20)) / 80;
	if (part === 'tube') {
		const z = frame * 0.5;
		light = gutLight([0, 1.4, z + 2], [0, 1, z - 2], 0.7);
		bg = BG.gut;
		far = (
			<group>
				<Gut3D at={[0, 1.2, 10]} len={40} r={() => 1.6} frame={frame} squeeze={0.2} rings={16} />
				<Slime3D at={[0, 0, z]} top={2.6} frame={frame} n={10} area={1.6} seed={11} />
			</group>
		);
		near = (
			<group>
				<group position={[0, 1.0, z]} rotation={[-Math.PI / 2 + 0.3, 0, frame * 0.15]}>
					<Hero3D position={[0, -0.85, 0]} scuba face="shocked" armL={[150, 165]} armR={[150, 165]} />
				</group>
				<HeldAmber pos={[0, 0.2, z + 0.4]} turn={0} />
				<Goo3D at={[0, 1.0, z - 1.4]} frame={frame} n={50} r={1.2} />
				<Beaks3D at={[0, 1.0, z - 2]} r={0.9} n={40} y={0} seed={3} />
			</group>
		);
		angle = [withShake({at: [0, 1.1, z], dist: 3.2, yaw: 0, pitch: 4, fov: 56, dyaw: 0}, frame, 2, 0.12, 1.4, 40)];
	} else if (part === 'mouth') {
		const t = frame - (teeth - 4);
		const wAt: V3 = [0, -6, 0];
		const mouth = whalePoint(wAt, [0, 0, 0], 16, 0.93, 0, -0.1);
		const shot = Math.min(1, t / 20);
		const hero: V3 = [mouth[0], mouth[1] + shot * 1.5 + Math.max(0, t - 20) * 0.04, mouth[2] + shot * 5 + Math.max(0, t - 20) * 0.08];
		far = <Underwater3D frame={frame} surface={2} center={[0, -6, 4]} />;
		near = (
			<group>
				<Whale3D kind="sperm" at={wAt} len={16} frame={frame} swim={0.3} jaw={0.7 * (1 - span(frame, bright + 10, bright + 26))} />
				<Swimmer at={hero} pitch={-40} frame={frame} kick={0} armL={[150, 165]} armR={[150, 165]} face="shocked" />
				<Goo3D at={[hero[0], hero[1] - 0.5, hero[2] - 1.5]} frame={frame} n={50} r={1.6} seed={2} />
				<Beaks3D at={[hero[0], hero[1] - 0.6, hero[2] - 1.8]} r={1.4} n={50} y={0} seed={4} />
				<Bubbles3D at={[hero[0], hero[1] - 0.6, hero[2] - 1.0]} frame={frame} n={30} rise={2.4} r={0.12} spread={1.4} every={24} />
			</group>
		);
		angle = [{at: [0, -5, 6.5], dist: 9, yaw: 70, pitch: 4, fov: 46, dyaw: 6}, {at: [0, -4.6, 8], dist: 8, yaw: 20, pitch: 6, fov: 46, dyaw: -6}];
	} else if (part === 'up') {
		const t = frame - (kick - 4);
		const hero: V3 = [0, -5 + t * 0.09, 0];
		far = <Underwater3D frame={frame} surface={0} center={hero} />;
		near = (
			<group>
				<Swimmer at={hero} pitch={-10} frame={frame} kick={1.6} armL={[150, 165]} armR={[150, 165]} face="determined" headUp={0} />
				<Bubbles3D at={[hero[0], hero[1] + 0.6, hero[2] + 0.2]} frame={frame} n={10} rise={1.6} />
				<Boat3D at={[2.5, 0, -1]} frame={frame} />
			</group>
		);
		angle = [{at: [0.5, hero[1] + 1.5, 0], dist: 7, yaw: 40, pitch: -40, fov: 46, dyaw: 8}];
	} else {
		light = LIGHT.sea;
		bg = BG.sea;
		const bob = Math.sin(frame * 0.12) * 0.08;
		const popT = span(frame, pop - 4, pop + 8);
		const hero: V3 = [heroTop[0], lerp(-2, heroTop[1], popT) + bob, heroTop[2]];
		const soaked = frame > straight;
		far = <SeaSet frame={frame} />;
		near = (
			<group>
				<Boat3D at={boatAt} frame={frame} />
				<Hero3D position={hero} turn={-0.9} scuba face={frame > breathes ? 'shocked' : 'happy'} armL={[100, 120]} armR={[100, 120]} look={frame > comes ? [-0.6, 0.3] : [0, 0]} />
				<HeldAmber pos={hero} turn={-0.9} />
				<Splash3D at={[hero[0], 0.05, hero[2]]} t={(frame - (pop - 4)) / 24} r={0.8} />
				<Whale3D kind="sperm" at={whaleTop} rot={whaleRot} len={16} frame={frame} swim={0.3} />
				<Splash3D at={whalePoint(whaleTop, whaleRot, 16, 0.85)} t={(frame - comes) / 40} r={3} />
				<Spout3D at={bh} dir={[spoutDir.x, spoutDir.y, spoutDir.z]} t={spoutT1} h={6} />
				<Spout3D at={bh} dir={[spoutDir.x, spoutDir.y * 0.6, spoutDir.z]} t={spoutT2} h={7} />
				{soaked ? <Goo3D at={[hero[0], hero[1] + 1.4, hero[2]]} frame={frame} n={14} r={0.4} seed={7} /> : null}
			</group>
		);
		const mid: V3 = [(hero[0] + whaleTop[0]) / 2, 1.2, (hero[2] + whaleTop[2]) / 2];
		angle = [
			{at: [hero[0], 0.5, hero[2]], dist: 3.6, yaw: 30, pitch: 4, fov: 42, dyaw: 6},
			{at: mid, dist: 18, yaw: 150, pitch: 6, fov: 44, dyaw: -6},
			{at: [bh[0], bh[1] + 2, bh[2]], dist: 14, yaw: 160, pitch: 8, fov: 46, dyaw: 6},
			{at: [bh[0] + 1, bh[1] + 0.5, bh[2]], dist: 7, yaw: 200, pitch: 25, fov: 44, dyaw: -6},
			{at: [hero[0] - 1, 1.2, hero[2]], dist: 8, yaw: 120, pitch: 8, fov: 46, dyaw: 6},
		];
	}
	// Each cut's framing, from the list for the part we're in: tube, mouth, mouth, up, then the surface.
	const angles: Angle3[] = cuts.map((_, i) => (i === 0 ? angle[0] : i <= 2 ? angle[i - 1] : i === 3 ? angle[0] : angle[i - 4]) ?? angle[0]);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={bg}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{part === 'tube' ? <Vignette amount={0.4} /> : null}
						<Big text="WHOOSH!" x={960} y={300} size={150} frame={frame} at={4} until={teeth - 8} color={UI.cream} rotate={-6} />
						<Label text="BLOWHOLE ON THE LEFT" x={960} y={204} size={56} frame={frame} at={blowhole + 6} until={straight - 6} color={UI.cyan} />
						<Label text="SPOUT: FORWARDS & TO THE LEFT" x={960} y={879} size={52} frame={frame} at={blowhole + 40} until={straight - 6} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={2} volume={0.5} />
			<Sound name="squeak" at={6} volume={0.35} />
			<Sound name="bubbles" at={teeth} volume={0.5} />
			<Sound name="bubbles" at={kick} volume={0.3} />
			<Sound name="splash" at={pop} volume={0.45} />
			<Sound name="splash" at={comes + 10} volume={0.5} />
			<Sound name="whoosh" at={breathes} volume={0.5} />
			<Sound name="whoosh" at={straight - 20} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- deck

const DECK_HERO: V3 = [0, 0.85, -3.0];
const DECK_FRIEND: V3 = [0.9, 0.85, -2.2];

export const Deck: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slime = cue(l0, "You're covered");
	const beak = cue(l0, "and there's a squid");
	const oneHand = cue(l0, 'But in one hand');
	const other = cue(l0, 'And in the other');
	const looks = cue(l0, 'Your friend looks');
	const atWhale = cue(l0, 'Then at the whale');
	const backAt = cue(l0, 'Then back at');
	const cuts = [0, slime - 4, beak - 4, oneHand - 4, other - 4, looks - 4, atWhale - 4, backAt - 4];
	const haul = span(frame, 0, slime - 6);
	const hero: V3 = [DECK_HERO[0], lerp(-0.9, DECK_HERO[1], haul), lerp(-4.4, DECK_HERO[2], haul)];
	const toHero = Math.atan2(hero[0] - DECK_FRIEND[0], hero[2] - DECK_FRIEND[2]);
	const toWhale = Math.atan2(-14 - DECK_FRIEND[0], -8 - DECK_FRIEND[2]);
	const fTurn = frame < atWhale ? toHero : frame < backAt ? lerp(toHero, toWhale, span(frame, atWhale, atWhale + 8)) : lerp(toWhale, toHero, span(frame, backAt, backAt + 6));
	const pull = frame < slime;
	const showCam = frame > oneHand - 4;
	const rh = handAt(hero, 0.2, [30, 70], 50, 1);
	const mask = headAt(hero);
	const goo: Copy[] = [...Array(12)].map((_, i) => ({p: [hero[0] + (rnd(i * 2.1) - 0.5) * 0.5, hero[1] + 0.35 + rnd(i * 3.3) * 1.2, hero[2] + 0.27 + rnd(i * 4.4) * 0.05], s: 0.025 + rnd(i * 5.5) * 0.03}));
	const passengers = (
		<group>
			<Hero3D who={P7.friend} position={DECK_FRIEND} turn={fTurn} armL={pull ? [60, 80] : frame > backAt ? [40, 150] : [12, 8]} armR={pull ? [60, 80] : frame > backAt ? [40, 150] : [12, 8]} reachL={pull ? 70 : frame > backAt ? 50 : 0} reachR={pull ? 70 : frame > backAt ? 50 : 0} face={frame > backAt ? 'shocked' : frame > looks ? 'neutral' : 'happy'} />
			<Hero3D position={hero} turn={0.2} scuba armR={showCam ? [30, 70] : [12, 8]} reachR={showCam ? 50 : 0} armL={frame > other - 4 ? [30, 100] : [12, 8]} reachL={frame > other - 4 ? 60 : 0} face={frame > slime ? 'happy' : 'determined'} />
			{haul > 0.9 ? <Many kind="deckgoo" geom={() => new THREE.SphereGeometry(1, 10, 8)} items={goo} color="#F2A0B8" outline={0.2} shadow={false} /> : null}
			{haul > 0.9 ? <Beaks3D at={[mask[0] + 0.12, mask[1] + 0.06, mask[2] + 0.33]} r={0.001} n={1} y={0} s={0.8} seed={11} /> : null}
			{showCam ? <UwCamera3D at={[rh[0], rh[1] + 0.08, rh[2]]} rot={[0, 0.2, 0]} s={0.9} /> : null}
			{frame > other - 4 ? <HeldAmber pos={hero} turn={0.2} s={0.24} /> : null}
		</group>
	);
	const near = (
		<group>
			<Boat3D at={[0, 0, 0]} frame={frame}>
				{passengers}
			</Boat3D>
			<Whale3D kind="sperm" at={[-14, -1.0, -8]} rot={[0.03, 0.9, 0]} len={16} frame={frame} swim={0.3} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [0.4, 1.4, -3.4], dist: 5, yaw: 140, pitch: 10, fov: 42, dyaw: 6},
		{at: [0, 1.8, -3.0], dist: 3.4, yaw: 30, pitch: 6, fov: 38, dyaw: -6},
		{at: [mask[0], mask[1], mask[2]], dist: 1.3, yaw: 15, pitch: 4, fov: 32, dyaw: 6},
		{at: [rh[0], rh[1], rh[2]], dist: 1.6, yaw: -30, pitch: 10, fov: 36, dyaw: -6},
		{at: [0, 1.6, -3.0], dist: 2.6, yaw: -20, pitch: 6, fov: 38, dyaw: 6},
		{at: [0.5, 1.8, -2.6], dist: 3.6, yaw: 70, pitch: 6, fov: 40, dyaw: -4},
		{at: [-4, 1.5, -5], dist: 14, yaw: 70, pitch: 6, fov: 44, dyaw: 4},
		{at: [0.5, 1.8, -2.6], dist: 3.4, yaw: 80, pitch: 6, fov: 40, ddist: -0.4},
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={LIGHT.sea} bg={BG.sea} far={<SeaSet frame={frame} />} near={near} blur={0} overlay={() => <Big text="?!" x={1250} y={300} size={150} frame={frame} at={backAt + 8} color={UI.yellow} />} />
			<Sound name="splash" at={4} volume={0.35} />
			<Sound name="squeak" at={slime + 4} volume={0.35} />
			<Sound name="pop" at={oneHand + 6} volume={0.3} />
			<Sound name="chime" at={other + 8} volume={0.35} />
			<Sound name="swish" at={atWhale + 2} volume={0.3} />
			<Sound name="swish" at={backAt + 2} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- pump

/** A spreading brown cloud of whale poop (full of iron and nitrogen for the plankton). */
const PoopCloud: React.FC<{at: V3; frame: number; t: number}> = ({at, frame, t}) => {
	const items: Copy[] = [];
	for (let i = 0; i < 60; i++) {
		const a = rnd(i * 1.9) * Math.PI * 2;
		const d = Math.sqrt(rnd(i * 3.7)) * (0.6 + t * 4.5);
		items.push({p: [at[0] + Math.cos(a) * d - t * 1.5, at[1] + (rnd(i * 5.1) - 0.3) * (0.4 + t * 2.4) + Math.sin(frame * 0.03 + i) * 0.1, at[2] + Math.sin(a) * d * 0.6], s: (0.25 + rnd(i * 2.3) * 0.35) * (0.5 + t * 0.8), c: rnd(i * 7.7) > 0.5 ? '#9A7A4A' : '#7A5A34'});
	}
	return <Many kind="poop60" geom={() => new THREE.SphereGeometry(1, 12, 9)} items={items} outline={0.08} opacity={0.85} shadow={false} />;
};

export const Pump: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const feed = cue(l0, 'They feed');
	const poop = cue(l0, 'and then poop');
	const feeds = cue(l0, 'That feeds');
	const half = cue(l0, 'And phytoplankton');
	const pumpC = cue(l0, 'Scientists call');
	const breathe = cue(l0, 'So in a way');
	const cuts = [0, feed - 4, poop - 4, feeds - 4, half - 4, pumpC - 4, breathe - 4];
	const deep = frame >= feed - 4 && frame < poop - 4;
	const end = frame >= breathe - 4;
	const rise = span(frame, poop - 4, poop + 30);
	const wAt: V3 = deep ? [0, -30, 0] : [0, lerp(-14, -5, rise), 0];
	const wRot: V3 = deep ? [0.1, Math.PI / 2, 0] : [lerp(-0.5, 0, rise), Math.PI / 2, 0];
	const tail = whalePoint(wAt, wRot, 16, 0.02);
	const bloom = span(frame, feeds, half + 30);
	const phyto: Copy[] = [];
	for (let i = 0; i < 400; i++) {
		const on = span(frame, feeds + rnd(i * 3.1) * 60, feeds + rnd(i * 3.1) * 60 + 20);
		if (on <= 0) {
			continue;
		}
		phyto.push({p: [tail[0] + (rnd(i * 1.7) - 0.5) * 22, -1.5 - rnd(i * 2.9) * 5, (rnd(i * 4.3) - 0.5) * 14], s: 0.08 * on + Math.sin(frame * 0.1 + i) * 0.01});
	}
	let near: React.ReactNode;
	let far: React.ReactNode;
	let light = LIGHT.under;
	let bg = BG.under;
	if (end) {
		light = LIGHT.sea;
		bg = BG.sea;
		far = <SeaSet frame={frame} />;
		near = (
			<Boat3D at={[0, 0, 0]} frame={frame}>
				<Hero3D position={[0, 0.85, -2.6]} turn={0.3} scuba mask={0} face="happy" armL={[100, 130]} armR={[100, 130]} reachL={-20} reachR={-20} />
			</Boat3D>
		);
	} else {
		if (deep) {
			light = LIGHT.dark;
			bg = BG.dark;
		}
		far = <Underwater3D frame={frame} surface={0} center={[0, deep ? -30 : -5, 0]} rays={deep ? 0 : 1} dark={deep ? 0.8 : 0} />;
		near = (
			<group>
				<Whale3D kind="sperm" at={wAt} rot={wRot} len={16} frame={frame} swim={0.5} />
				{deep ? <Squid3D at={[12, -30, 1]} rot={[0, -Math.PI / 2, 0]} len={3} frame={frame} /> : null}
				{frame > poop + 10 ? <PoopCloud at={[tail[0] - 1, tail[1], tail[2]]} frame={frame} t={span(frame, poop + 10, poop + 70, (v) => v)} /> : null}
				{phyto.length ? <Many kind={`phyto${phyto.length}`} geom={() => new THREE.SphereGeometry(1, 8, 6)} items={phyto} color="#7CF2A0" outline={0} glow shadow={false} /> : null}
				{frame > half ? <Bubbles3D at={[tail[0] + 2, -4, 0]} frame={frame} n={30} rise={3.6} r={0.12} spread={10} every={60} /> : null}
				{deep ? null : <Fish3D at={[-6, -3, -3]} frame={frame} n={20} r={2} s={0.3} />}
			</group>
		);
	}
	const angles: Angle3[] = [
		{at: [0, -4, 0], dist: 26, yaw: 0, pitch: 4, fov: 44, dyaw: 6},
		{at: [0, -30, 0], dist: 26, yaw: 0, pitch: 4, fov: 44, dyaw: -6},
		{at: [-2, -4, 0], dist: 26, yaw: 10, pitch: 4, fov: 44, dyaw: 6},
		{at: [-6, -4, 0], dist: 20, yaw: -10, pitch: 4, fov: 44, dyaw: -6},
		{at: [-6, -3, 0], dist: 18, yaw: 5, pitch: -6, fov: 44, dyaw: 6},
		{at: [-4, -3.5, 0], dist: 24, yaw: 0, pitch: 4, fov: 44, dyaw: -4},
		{at: [0, 2.0, -2.6], dist: 3.6, yaw: 30, pitch: 6, fov: 38, dyaw: 6},
	];
	void bloom;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={bg}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="FEEDS DEEP DOWN" x={960} y={204} size={56} frame={frame} at={feed + 6} until={poop - 6} color={UI.cyan} />
						<Label text="POOPS NEAR THE SURFACE" x={960} y={204} size={56} frame={frame} at={poop + 10} until={feeds - 6} color={UI.orange} />
						<Label text="PHYTOPLANKTON" x={960} y={207} size={60} frame={frame} at={feeds + 20} until={half - 6} color={UI.green} />
						<Label text="≈ HALF THE OXYGEN ON EARTH" x={960} y={204} size={56} frame={frame} at={half + 10} until={pumpC - 6} color={UI.green} />
						<Big text="THE WHALE PUMP" x={960} y={852} size={110} frame={frame} at={pumpC + 6} until={breathe - 6} color={UI.yellow} />
						<Label text="WHALES HELP YOU BREATHE" x={960} y={876} size={56} frame={frame} at={breathe + 10} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={feed} volume={0.3} />
			<Sound name="bubbles" at={poop + 10} volume={0.35} />
			<Sound name="appear" at={feeds + 20} volume={0.35} />
			<Sound name="chime" at={pumpC + 6} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- myth

/** An old newspaper page, a crew list, a quote card and a HOAX stamp. */
const Paper: React.FC<{frame: number; at: number; until?: number; children: React.ReactNode; rot?: number; x?: number; y?: number; w?: number; h?: number}> = ({frame, at, until, children, rot = -2, x = 960, y = 560, w = 900, h = 640}) => {
	const p = span(frame, at, at + 12) * (until === undefined ? 1 : 1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%) rotate(${rot}deg) translateY(${(1 - p) * 300}px)`, opacity: p, background: 'linear-gradient(160deg, #F4E6C4, #E2CC9C)', border: '5px solid #3A2A1A', borderRadius: 10, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', fontFamily: 'Georgia, serif', color: '#2A1E14', overflow: 'hidden'}}>
			{children}
		</div>
	);
};

export const Myth: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const y1891 = cue(l0, 'In eighteen');
	const found = cue(l0, 'and found alive');
	const historians = cue(l0, 'But when historians');
	const wife = cue(l0, "The captain's wife");
	const hoax = cue(l0, 'It was a hoax');
	const cuts = [0, y1891 - 4, found - 4, historians - 4, wife - 4, hoax - 4];
	const scan = span(frame, historians + 10, wife - 10, (v) => v);
	const crew = ['T. ADAMS', 'J. BRENNAN', 'W. CARTER', 'H. DOYLE', 'R. EVANS', 'P. FLYNN', 'S. GRANT', 'E. HUGHES', 'M. KEANE', 'A. LOWE'];
	const near = (
		<group>
			<Boat3D at={[0, 0, 0]} frame={frame} rock={1.4}>
				<Hero3D who={P7.sailor} position={[0, 0.85, -2.2]} turn={-0.6} face={frame > found ? 'shocked' : 'scared'} armL={[30, 60]} reachL={60} />
			</Boat3D>
			<Whale3D kind="sperm" at={[-12, -1.2, -10]} rot={[0.02, 0.8, 0]} len={16} frame={frame} swim={0.4} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [-3, 1.5, -4], dist: 18, yaw: 120, pitch: 8, fov: 42, dyaw: 6},
		{at: [-3, 1.5, -4], dist: 20, yaw: 100, pitch: 8, fov: 42, dyaw: -4},
		{at: [-3, 1.5, -4], dist: 20, yaw: 110, pitch: 8, fov: 42, dyaw: 4},
		{at: [-3, 1.5, -4], dist: 20, yaw: 90, pitch: 8, fov: 42, dyaw: -4},
		{at: [-3, 1.5, -4], dist: 20, yaw: 130, pitch: 8, fov: 42, dyaw: 4},
		{at: [-3, 1.5, -4], dist: 22, yaw: 115, pitch: 8, fov: 42, dyaw: -4},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.sea}
				bg={BG.sea}
				far={<SeaSet frame={frame} />}
				near={near}
				blur={0}
				grade="sepia(0.85) contrast(1.05) brightness(0.92)"
				overlay={() => (
					<AbsoluteFill>
						<Paper frame={frame} at={y1891 + 6} until={historians - 8}>
							<div style={{borderBottom: '4px double #3A2A1A', textAlign: 'center', padding: '18px 0 8px', fontSize: 64, fontWeight: 700, letterSpacing: 2}}>THE DAILY GAZETTE</div>
							<div style={{textAlign: 'center', fontSize: 28, padding: 6}}>1891</div>
							<div style={{textAlign: 'center', fontSize: 72, fontWeight: 700, padding: '20px 30px 10px', lineHeight: 1.05}}>A MODERN JONAH</div>
							<div style={{textAlign: 'center', fontSize: 36, padding: '0 50px', lineHeight: 1.3}}>Sailor James Bartley swallowed by a sperm whale — and found alive inside it the next day!</div>
							<div style={{display: 'flex', gap: 24, padding: '30px 50px'}}>
								{[0, 1, 2].map((i) => (
									<div key={i} style={{flex: 1, height: 150, background: 'repeating-linear-gradient(#2A1E14 0 3px, transparent 3px 16px)', opacity: 0.35}} />
								))}
							</div>
						</Paper>
						<Paper frame={frame} at={historians} until={wife - 6} rot={2} w={760} h={700}>
							<div style={{textAlign: 'center', fontSize: 44, fontWeight: 700, padding: '24px 0 4px'}}>CREW LIST</div>
							<div style={{textAlign: 'center', fontSize: 28, paddingBottom: 14, borderBottom: '3px solid #3A2A1A'}}>Star of the East · 1891</div>
							{crew.map((n, i) => (
								<div key={n} style={{fontSize: 36, padding: '6px 70px', fontFamily: 'Georgia, serif', background: Math.abs(scan * 10 - i) < 0.7 ? 'rgba(255,216,74,0.5)' : 'transparent'}}>
									{n}
								</div>
							))}
						</Paper>
						{frame > wife - 30 && frame < wife - 6 ? <Label text="NO JAMES BARTLEY" x={960} y={873} size={60} frame={frame} at={wife - 30} until={wife - 8} color={UI.red} /> : null}
						<Paper frame={frame} at={wife} rot={-1} w={1100} h={420}>
							<div style={{fontSize: 58, fontStyle: 'italic', padding: '60px 70px 20px', lineHeight: 1.2, textAlign: 'center'}}>“There is not one word of truth in the whale story.”</div>
							<div style={{fontSize: 34, textAlign: 'center'}}>— the captain’s wife</div>
						</Paper>
						{frame > hoax ? (
							<div style={{position: 'absolute', left: 960, top: 560, transform: `translate(-50%, -50%) rotate(-14deg) scale(${lerp(2.2, 1, span(frame, hoax + 2, hoax + 10))})`, opacity: span(frame, hoax + 2, hoax + 6), border: '14px solid #D82A2A', color: '#D82A2A', fontFamily: FONT, fontWeight: 700, fontSize: 180, padding: '0 50px', borderRadius: 20, letterSpacing: 10}}>HOAX</div>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="swish" at={y1891 + 6} volume={0.35} />
			<Sound name="swish" at={historians} volume={0.35} />
			<Sound name="tick" at={wife - 30} volume={0.4} />
			<Sound name="swish" at={wife} volume={0.35} />
			<Sound name="thud" at={hoax + 4} volume={0.6} />
		</>
	);
};

// ---------------------------------------------------------------- real

export const Real: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const y2021 = cue(l0, 'In twenty twenty one');
	const scooped = cue(l0, 'was scooped');
	const thirty = cue(l0, 'He spent about');
	const surfaced = cue(l0, 'until the whale');
	const bruised = cue(l0, 'He was bruised');
	const y2025 = cue(l0, 'And in twenty twenty five');
	const letGo = cue(l0, 'and let him go');
	const dad = cue(l0, 'His dad');
	const both = cue(l0, 'Both times');
	const lunch = cue(l0, 'They were just');
	const cuts = [0, y2021 - 4, scooped - 4, thirty - 4, surfaced - 4, bruised - 4, y2025 - 4, letGo - 4, dad - 4, both - 4, lunch - 4];
	const part = frame < y2021 - 4 ? 'intro' : frame < thirty - 4 ? 'scoop' : frame < surfaced - 4 ? 'dark' : frame < y2025 - 4 ? 'spit' : frame < both - 4 ? 'kayak' : 'lunch';
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light = LIGHT.under;
	let bg = BG.under;
	let angle: Angle3 = {at: [0, -6, 0], dist: 20, yaw: 40, pitch: 6, fov: 44};
	if (part === 'intro' || part === 'lunch') {
		const t = part === 'intro' ? frame : frame - (both - 4);
		const lungeT = span(t, 10, 80);
		const wAt: V3 = [0, lerp(-14, -6, lungeT), lerp(-10, 2, lungeT)];
		const wRot: V3 = [lerp(-0.6, -0.1, lungeT), 0.3, 0];
		const mouth = whalePoint(wAt, wRot, 15, 0.97);
		far = <Underwater3D frame={frame} surface={2} center={[0, -6, 0]} />;
		near = (
			<group>
				<Whale3D kind="humpback" at={wAt} rot={wRot} len={15} frame={frame} jaw={span(t, 20, 50) * (1 - span(t, 90, 120))} pouch={span(t, 40, 110)} swim={0.6} />
				<Fish3D at={[mouth[0] + 1, -4.5, 6]} frame={frame} n={60} r={3} s={0.22} color="#C8D8E8" speed={2} />
			</group>
		);
		angle = {at: [0, -6, 2], dist: 24, yaw: 60, pitch: 2, fov: 46, dyaw: 6};
	} else if (part === 'scoop') {
		const t = frame - (y2021 - 4);
		const lungeT = span(t, 30, 130);
		const diver: V3 = [0, -11.5, 0];
		const wAt: V3 = [lerp(-1, 0, lungeT), lerp(-22, -9, lungeT), lerp(-12, 1.0, lungeT)];
		const wRot: V3 = [lerp(-0.9, -0.5, lungeT), 0, 0];
		const engulfed = lungeT > 0.85;
		far = <Underwater3D frame={frame} surface={0} center={diver} floor={-13} />;
		near = (
			<group>
				<Whale3D kind="humpback" at={wAt} rot={wRot} len={14} frame={frame} jaw={span(t, 40, 90) * (1 - span(t, 120, 140))} pouch={span(t, 80, 140)} swim={0.8} />
				{!engulfed ? <Swimmer who={P7.diver} at={diver} pitch={80} frame={frame} kick={0.5} armL={[40, 60]} armR={[40, 60]} face="neutral" /> : null}
				{!engulfed ? <Bubbles3D at={[diver[0], diver[1] + 0.5, diver[2] + 0.4]} frame={frame} n={8} rise={1.6} /> : null}
			</group>
		);
		angle = {at: [0, -10.5, 0], dist: 18, yaw: 80, pitch: 8, fov: 46, dyaw: 6};
	} else if (part === 'dark') {
		light = gutLight([0, 1.4, 0.8], [0, 1, -1], 0.35, '#5A2030');
		bg = '#0A0306';
		far = <Gut3D at={[0, 1.4, 0]} len={10} r={() => 2.4} frame={frame} squeeze={0.03} rings={0} color="#C86A7E" fold="#8A3A50" />;
		near = (
			<group>
				<Swimmer who={P7.diver} at={[0, 1.2, 0]} pitch={30} frame={frame} kick={0.3} armL={[60, 80]} armR={[60, 80]} face="scared" />
				<Bubbles3D at={[0, 2.0, 0.4]} frame={frame} n={10} rise={1.2} />
			</group>
		);
		angle = {at: [0, 1.6, 0], dist: 3.2, yaw: 30, pitch: 4, fov: 44, dyaw: 6};
	} else if (part === 'spit') {
		const t = frame - (surfaced - 4);
		const up = span(t, 0, 30);
		const fly = span(t, 26, 50, (v) => v);
		light = LIGHT.sea;
		bg = BG.sea;
		const wAt: V3 = [0, lerp(-9, -3.5, up), 0];
		const wRot: V3 = [-1.0, 0, 0];
		const head = whalePoint(wAt, wRot, 14, 0.98);
		const diver: V3 = [lerp(head[0], 3.5, fly), head[1] + Math.sin(fly * Math.PI) * 2.5 - fly * 1.2, lerp(head[2], 4, fly)];
		far = <SeaSet frame={frame} />;
		near = (
			<group>
				<Whale3D kind="humpback" at={wAt} rot={wRot} len={14} frame={frame} swim={0.3} jaw={span(t, 20, 30) * 0.6} />
				{fly > 0 ? <Hero3D who={P7.diver} position={[diver[0], diver[1] - 0.8, diver[2]]} turn={0.6} scuba face={fly > 0.9 ? 'happy' : 'shocked'} armL={[120, 150]} armR={[120, 150]} /> : null}
				<Splash3D at={[0, 0.05, 0]} t={t / 40} r={3} />
				<Splash3D at={[3.5, 0.05, 4]} t={(t - 50) / 24} r={0.8} />
			</group>
		);
		angle = {at: [1.5, 2.5, 1.5], dist: 16, yaw: 100, pitch: 6, fov: 44, dyaw: 6};
	} else {
		// Chile: a yellow kayak on calm water, mountains behind, a humpback surfacing.
		const t = frame - (y2025 - 4);
		light = LIGHT.patagonia;
		bg = BG.patagonia;
		const gulp = span(t, 50, 70);
		const release = span(frame, letGo, letGo + 20);
		const engulfed = gulp > 0.6 && release < 0.5;
		const kayak: V3 = [0, 0, 0];
		const wAt: V3 = [0.5, lerp(-7, -2.4, gulp) - release * 3, lerp(-6, -1, gulp)];
		const wRot: V3 = [-0.8, 0, 0];
		far = (
			<group>
				<Sea3D frame={frame} size={600} color="#5A7A9A" caps={60} />
				<Mountains3D peaks={[{at: [-60, -160], h: 70}, {at: [10, -190], h: 90}, {at: [80, -170], h: 60}, {at: [-130, -150], h: 50}]} />
			</group>
		);
		near = (
			<group>
				{!engulfed ? (
					<group position={[kayak[0] + release * 1.5, release > 0 ? Math.sin(release * Math.PI) * 0.5 : 0, kayak[2] + release * 2]}>
						<Kayak3D at={[0, 0, 0]} rot={[0, 0.4, 0]} frame={frame} />
						<Hero3D who={P7.kayaker} position={[0, -0.05, 0]} turn={0.4} sit face={release > 0 ? 'shocked' : 'happy'} armL={[40, 60]} armR={[40, 60]} reachL={40} reachR={40} />
						<T shape={{kind: 'box', w: 0.5, h: 0.4, d: 0.24}} color="#FF7A2A" position={[0, 0.62, 0.04]} outline={0.01} />
					</group>
				) : null}
				<Whale3D kind="humpback" at={wAt} rot={wRot} len={13} frame={frame} swim={0.3} jaw={gulp * (1 - release)} />
				<Splash3D at={[0.5, 0.05, -0.5]} t={(t - 50) / 40} r={2.4} />
				<group position={[6, 0, 4]}>
					<Kayak3D at={[0, 0, 0]} rot={[0, -0.9, 0]} frame={frame + 30} />
					<Hero3D who={P7.dad} position={[0, -0.05, 0]} turn={-0.9} sit face={engulfed ? 'shocked' : 'neutral'} armR={[40, 80]} reachR={70} armL={[40, 80]} reachL={70} />
					<T shape={{kind: 'box', w: 0.12, h: 0.22, d: 0.02}} color="#24203A" position={handAt([0, -0.05, 0], -0.9, [40, 80], 70, 1, true).map((v, i) => (i === 1 ? v + 0.1 : v)) as V3} rotation={[0, -0.9, 0]} outline={0.006} />
				</group>
			</group>
		);
		angle = frame >= dad - 4 ? {at: [5, 1.2, 4], dist: 4, yaw: -70, pitch: 6, fov: 40, dyaw: 6} : {at: [1.8, 1.0, 1.2], dist: 9.5, yaw: 145, pitch: 7, fov: 42, dyaw: -4};
	}
	const angles = cuts.map((_, i) => ({...angle, yaw: (angle.yaw ?? 0) + [0, 20, -18, 12, -10][i % 5]}));
	const sec = part === 'dark' ? Math.min(30, Math.round(((frame - (thirty - 4)) / (surfaced - thirty)) * 30)) : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={bg}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="TRUE STORIES" x={960} y={207} size={60} frame={frame} at={6} until={y2021 - 6} color={UI.yellow} />
						<Label text="2021 · CAPE COD, USA · A HUMPBACK" x={960} y={201} size={52} frame={frame} at={y2021 + 4} until={thirty - 6} color={UI.cream} />
						{part === 'dark' ? <Big text={`${sec} SECONDS`} x={960} y={858} size={100} frame={frame} at={thirty} color={UI.yellow} /> : null}
						{part === 'dark' ? <Vignette amount={0.7} /> : null}
						<Label text="BRUISED · NOTHING BROKEN" x={960} y={876} size={56} frame={frame} at={bruised + 6} until={y2025 - 6} color={UI.green} />
						<Label text="2025 · CHILE · A KAYAKER" x={960} y={204} size={56} frame={frame} at={y2025 + 6} until={letGo - 6} color={UI.cream} />
						<Label text="LET GO AFTER A COUPLE OF SECONDS" x={960} y={201} size={52} frame={frame} at={letGo + 10} until={dad - 6} color={UI.green} />
						{frame >= dad - 4 && frame < both - 4 ? (
							<div style={{position: 'absolute', left: 80, top: 166, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 48, color: '#fff', opacity: (Math.floor(frame / 15) % 2) * 0.4 + 0.6}}>
								<div style={{width: 34, height: 34, borderRadius: 17, background: '#FF3A3A'}} />
								REC
							</div>
						) : null}
						<Label text="NOT HUNTING ANYONE" x={960} y={204} size={56} frame={frame} at={both + 6} until={lunch - 6} color={UI.cream} />
						<Label text="JUST IN THE WAY OF ITS LUNCH" x={960} y={204} size={56} frame={frame} at={lunch + 6} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={y2021 + 30} volume={0.35} />
			<Sound name="snap" at={scooped + 24} volume={0.4} />
			<Sound name="splash" at={surfaced + 22} volume={0.55} />
			<Sound name="splash" at={y2025 + 46} volume={0.5} />
			<Sound name="splash" at={letGo + 6} volume={0.45} />
			<Sound name="shutter" at={dad + 6} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- twist

/** The last photo on the camera: looking out of a whale's mouth, between its teeth. */
const LastPhoto: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const p = span(frame, at, at + 12);
	if (p <= 0) {
		return null;
	}
	return (
		<div style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`, opacity: p, width: 1240, height: 820, borderRadius: 40, background: '#24203A', border: '10px solid #FFD23A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', padding: 30}}>
			<svg viewBox="0 0 1160 700" width={1160} height={700} style={{borderRadius: 20}}>
				<defs>
					<linearGradient id="sea7" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#8FE0FF" />
						<stop offset="1" stopColor="#1E78B0" />
					</linearGradient>
				</defs>
				<rect width={1160} height={700} fill="url(#sea7)" />
				{[0, 1, 2, 3, 4].map((i) => (
					<path key={i} d={`M${200 + i * 200} 0 L${260 + i * 200} 0 L${160 + i * 190} 700 L${120 + i * 190} 700 Z`} fill="#ffffff" opacity={0.12} />
				))}
				<path d="M420 120 L760 120 L720 160 L460 160 Z" fill="#2A3A5A" opacity={0.6} />
				<path d="M0 0 L1160 0 L1160 130 Q580 220 0 130 Z" fill="#E8DCDC" />
				<path d="M0 700 L1160 700 L1160 560 Q580 470 0 560 Z" fill="#E8DCDC" />
				{[...Array(11)].map((_, i) => (
					<path key={`b${i}`} d={`M${60 + i * 100} ${560 - Math.abs(i - 5) * -8} l30 -110 l30 110 Z`} fill="#F6F0DE" stroke="#140A28" strokeWidth={5} />
				))}
				<path d="M0 0 L1160 0 L1160 70 Q580 160 0 70 Z" fill="#3A2E3E" />
				<path d="M0 700 L1160 700 L1160 640 Q580 560 0 640 Z" fill="#3A2E3E" />
			</svg>
			<div style={{position: 'absolute', top: 44, left: 60, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: '#FFF3D6', textShadow: '0 2px 0 #000'}}>PHOTO 127 / 127</div>
		</div>
	);
};

const SHED = {wall: '#8A5A3A', floor: '#6A4A2A', trim: '#C98A5A'};

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const stinks = cue(l0, 'It stinks');
	const fresh = cue(l0, 'Fresh from');
	const pale = cue(l0, 'It only turns');
	const worth = cue(l0, "That's when");
	const mum = cue(l0, 'Your mum');
	const ten = cue(l0, 'For the next');
	const camQ = l1.a;
	const photo = cue(l1, 'Including one');
	const friendQ = cue(l1, 'Your friend still');
	const cuts = [0, stinks - 4, fresh - 4, pale - 4, mum - 4, ten - 4, camQ - 4, photo - 4, friendQ - 4];
	const part = frame < mum - 4 ? 'room' : frame < camQ - 4 ? 'shed' : frame < friendQ - 4 ? 'camera' : 'sniff';
	const desk: V3 = [1.2, 0, -2.4];
	const lump: V3 = [desk[0], 0.86, desk[2]];
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light = LIGHT.home;
	let bg = BG.home;
	let angles: Angle3[];
	if (part === 'room' || part === 'camera') {
		const pinch = frame > stinks;
		far = <Bedroom />;
		near = (
			<group>
				<Desk3 at={desk} w={1.6} />
				<Ambergris3D at={[lump[0], lump[1] + 0.18, lump[2]]} s={0.24} fresh={1} />
				<Stink3D at={[lump[0], lump[1] + 0.25, lump[2]]} frame={frame} n={3} h={1.1} />
				<Hero3D position={[0, 0, -1.4]} turn={0.7} face={pinch ? 'sad' : 'happy'} armL={pinch ? [60, 80] : [12, 8]} reachL={pinch ? 50 + Math.sin(frame * 0.5) * 18 : 0} />
				{part === 'camera' ? <UwCamera3D at={[0.4, 1.1, -1.0]} rot={[0, 0.7, 0]} s={0.9} /> : null}
			</group>
		);
		angles = [
			{at: [0.6, 1.0, -2.0], dist: 4.6, yaw: 10, pitch: 8, fov: 40, dyaw: 6},
			{at: [0.2, 1.3, -1.6], dist: 2.4, yaw: 30, pitch: 4, fov: 36, dyaw: -6},
			{at: [lump[0], lump[1] + 0.3, lump[2]], dist: 1.6, yaw: -20, pitch: 12, fov: 36, dyaw: 6},
			{at: [0.6, 1.0, -2.0], dist: 4.6, yaw: -10, pitch: 8, fov: 40, dyaw: -6},
		];
	} else if (part === 'shed') {
		light = LIGHT.shed;
		far = (
			<Room3 look={SHED} w={6} d={5} h={3}>
				<Shelf3 at={[0, 1.5, -2.35]} w={2.4} />
			</Room3>
		);
		near = (
			<group>
				<Ambergris3D at={[0, 1.78, -2.25]} s={0.22} fresh={1} />
				<Stink3D at={[0, 1.85, -2.2]} frame={frame} n={3} h={0.7} />
				<Hero3D who={P7.mum} position={[-1.0, 0, -0.8]} turn={0.4} face="sad" armR={[40, 150]} reachR={50} />
				<T shape={{kind: 'box', w: 0.14, h: 0.05, d: 0.05}} color="#E8453C" position={[-0.87, 1.27, -0.5]} rotation={[0, 0.4, 0]} outline={0.006} />
				<Hero3D position={[0.9, 0, -0.9]} turn={-0.4} face="sad" />
			</group>
		);
		angles = [
			{at: [0, 1.3, -1.4], dist: 4.2, yaw: 0, pitch: 6, fov: 44, dyaw: 6},
			{at: [0, 1.3, -1.4], dist: 4.2, yaw: 10, pitch: 6, fov: 44, dyaw: -6},
		];
	} else {
		const f: V3 = [0, 0, -1.2];
		const rh = handAt(f, 0.3, [30, 120], 40, 1);
		far = <Bedroom />;
		near = (
			<group>
				<Hero3D who={P7.friend} position={f} turn={0.3} face="sad" armR={[30, 120]} reachR={40} armL={[40, 160]} reachL={40} />
				<UwCamera3D at={[rh[0], rh[1] + 0.05, rh[2]]} rot={[0, 0.3, 0]} s={0.9} />
				<Stink3D at={[rh[0], rh[1] + 0.1, rh[2]]} frame={frame} n={2} h={0.6} />
			</group>
		);
		angles = [{at: [0, 1.4, -1.2], dist: 2.4, yaw: 20, pitch: 4, fov: 36, dyaw: 6}];
	}
	const allAngles = cuts.map((_, i) => angles[i % angles.length]);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={allAngles}
				light={light}
				bg={bg}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="IT STINKS" x={960} y={240} size={130} frame={frame} at={stinks + 2} until={fresh - 6} color={UI.green} rotate={-5} />
						{frame >= fresh - 4 && frame < mum - 4 ? (
							<Panel frame={frame} at={fresh} until={mum - 8} x={1400} y={540} w={820} h={520} title="FRESH vs AGED AMBERGRIS">
								<svg viewBox="0 0 800 440" width={800} height={440} style={{position: 'absolute', left: 10, top: 10}}>
									<ellipse cx={150} cy={170} rx={110} ry={80} fill="#4A4038" stroke="#140A28" strokeWidth={6} />
									<text x={150} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#FFF3D6">
										FRESH
									</text>
									<text x={150} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#9AE05A">
										DARK, SOFT, STINKY
									</text>
									<g opacity={span(frame, pale + 4, pale + 16)}>
										<text x={400} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#FFD84A">
											YEARS OF
										</text>
										<text x={400} y={205} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#7FE0FF">
											SUN & SEA →
										</text>
										<ellipse cx={650} cy={170} rx={110} ry={80} fill="#E8E0C8" stroke="#140A28" strokeWidth={6} />
										<text x={650} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#FFF3D6">
											AGED
										</text>
										<text x={650} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#F2B8E8">
											PALE & SWEET
										</text>
									</g>
									<text x={400} y={425} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#7CF2A0" opacity={span(frame, worth + 4, worth + 14)}>
										…AND WORTH THE MOST
									</text>
								</svg>
							</Panel>
						) : null}
						<Label text="SEE YOU IN 10 YEARS" x={960} y={870} size={64} frame={frame} at={ten + 4} until={camQ - 6} color={UI.yellow} />
						{part === 'camera' ? <LastPhoto frame={frame} at={photo} /> : null}
						<Label text="WHY DOES IT SMELL OF SQUID?" x={960} y={204} size={56} frame={frame} at={friendQ + 10} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="squeak" at={stinks + 2} volume={0.4} />
			<Sound name="pop" at={fresh + 4} volume={0.3} />
			<Sound name="thud" at={mum + 6} volume={0.35} />
			<Sound name="tick" at={ten + 4} volume={0.4} />
			<Sound name="shutter" at={photo + 2} volume={0.45} />
			<Sound name="squeak" at={friendQ + 10} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const animal = cue(l0, 'And if you could');
	const comments = cue(l0, 'Tell me');
	const next = cue(l0, 'And next time');
	const cuts = [0, animal - 4, comments - 4, next - 4];
	const diveT = span(frame, 10, animal + 70, (v) => v);
	const wAt: V3 = [-14, lerp(-1.2, -9.5, diveT), -16];
	const wRot: V3 = [lerp(0.3, 1.45, span(frame, 10, animal, (v) => v)), 0.6, 0];
	const drop = span(frame, next + 14, next + 30, (v) => v * v);
	const fh = handAt([0.9, 0.85, -2.2], -2.4, [30, 70], 60, 1);
	const camAt: V3 = [fh[0] - drop * 0.8, lerp(fh[1] + 0.05, -0.2, drop), fh[2] - drop * 1.2];
	const near = (
		<group>
			<Boat3D at={[0, 0, 0]} frame={frame} rock={0.6}>
				<Hero3D position={[-0.4, 0.85, -2.6]} turn={-2.3} scuba mask={0} face={frame > next + 30 ? 'smug' : 'happy'} armL={frame > next + 34 ? [150, 170] : [12, 8]} />
				<Hero3D who={P7.friend} position={[0.9, 0.85, -2.2]} turn={-2.4} face={frame > next + 16 ? 'shocked' : 'happy'} armR={[30, 70]} reachR={frame < next + 14 ? 60 : 30} />
				{drop < 1 ? <UwCamera3D at={camAt} rot={[drop * 3, 0, 0]} s={0.9} /> : null}
			</Boat3D>
			<Splash3D at={[0.2, 0.05, -3.8]} t={(frame - (next + 30)) / 20} r={0.4} />
			<Whale3D kind="sperm" at={wAt} rot={wRot} len={16} frame={frame} swim={0.8} />
			<Splash3D at={[-14, 0.1, -16]} t={(frame - (animal + 30)) / 40} r={3} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [-5, 2, -7], dist: 16, yaw: 60, pitch: 6, fov: 44, dyaw: 6},
		{at: [0.2, 1.9, -2.4], dist: 4.2, yaw: 200, pitch: 6, fov: 40, dyaw: -6},
		{at: [0, 2, -2.4], dist: 5.5, yaw: 120, pitch: 8, fov: 40, dyaw: 6},
		{at: [0.4, 1.6, -2.8], dist: 4.6, yaw: 150, pitch: 10, fov: 40, dyaw: -6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.sunset}
				bg={BG.sunset}
				far={<SeaSet frame={frame} dusk />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="WOULD YOU?" x={960} y={252} size={150} frame={frame} at={8} until={animal - 6} color={UI.yellow} />
						<Label text="WOULD YOU DIVE BACK IN?" x={960} y={873} size={60} frame={frame} at={20} until={animal - 6} color={UI.cream} />
						<Label text="ONE DAY AS ANY OCEAN ANIMAL?" x={960} y={207} size={60} frame={frame} at={animal + 6} until={comments - 6} color={UI.cyan} />
						<Label text="TELL ME IN THE COMMENTS" x={960} y={207} size={60} frame={frame} at={comments + 4} until={next - 6} color={UI.yellow} />
						<Big text="…MAYBE JUST LET IT GO" x={960} y={219} size={96} frame={frame} at={next + 34} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="splash" at={animal + 34} volume={0.35} />
			<Sound name="squeak" at={next + 14} volume={0.35} />
			<Sound name="splash" at={next + 30} volume={0.4} />
		</>
	);
};
