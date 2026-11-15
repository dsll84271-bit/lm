import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, track, type ShotProps} from '../../../components/stage';
import {Big, Count, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Clover3D, CloverField, Grimoire3D, Smoke} from '../../../three/grimoire3d';
import {Hero3D} from '../../../three/Hero3D';
import {Box} from '../../../three/sets3d';
import type {Cam3} from '../../../three/Stage3D';
import {Says, Shot3, Thought, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {BG, Crawl, HeldSword, LIGHT, P6, Panel, Park} from './kit';
import {handAt, mixArm, top, type V3} from './util';

// Part A: the five-leaf clover, the book that climbs out of the ground, the
// sword you can't lift, and the science of clovers and luck.

const BOOK_AT: V3 = [0, 0, 1.15];

const withShake = (a: Angle3, frame: number, at: number, k = 0.06): Angle3 => {
	const s = shake(frame, at, 1, 18);
	return {...a, at: [a.at[0] + s.x * k, a.at[1] + s.y * k, a.at[2]]};
};

// ---------------------------------------------------------------- cold

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const three0 = cue(l0, 'Three leaves');
	const three1 = cue(l0, 'Three leaves', 1);
	const three2 = cue(l0, 'Three leaves', 2);
	const five = cue(l0, 'And then you find');
	const pick = l1.a;
	const shakeAt = cue(l1, 'the ground starts');
	const book = cue(l1, 'A book pushes');
	const black = cue(l1, "It's black");
	const cover = cue(l1, 'And on the cover');
	const cuts = [0, three0 - 4, three1 - 4, three2 - 4, five - 4, pick - 4, book - 4, black - 4, cover - 4];
	// You crawl forward until you find it, then sit back with it in your hand.
	const crawlZ = track(frame, [[0, -1.5], [five, -0.4]]);
	const sitBack = span(frame, book + 6, book + 22);
	const rise = span(frame, book, cover - 10, (v) => v);
	const bookY = lerp(-0.4, 0.55, rise);
	const handR = handAt([0, 0, 0], 0, [60, 110], 30, 1, true);
	const near = (
		<group>
			{frame < pick - 4 ? (
				<Crawl pos={[0, 0, crawlZ]} pitch={90} hip={0.5} armL={[8, 8]} armR={[8, 8]} reachL={80 + Math.sin(frame * 0.2) * 8} reachR={80 - Math.sin(frame * 0.2) * 8} headUp={55} look={[0, -0.5]} face={frame > five ? 'shocked' : 'neutral'} />
			) : (
				<Crawl pos={[0, 0, -0.5]} pitch={lerp(60, 0, sitBack)} hip={lerp(0.36, 0.14, sitBack)} armR={[60, 110]} reachR={30} armL={mixArm([10, 10], [40, 60], sitBack)} reachL={lerp(70, 10, sitBack)} headUp={lerp(40, 0, sitBack)} face={frame > shakeAt ? 'shocked' : 'happy'} look={[0, -0.2]} />
			)}
			{frame >= pick - 4 ? <Clover3D at={[handR[0], handR[1] + 0.1, handR[2] - 0.5 + 0.05]} n={5} s={0.06} glow={1} /> : null}
			{frame >= book - 4 ? (
				<group>
					<Grimoire3D at={[BOOK_AT[0], bookY, BOOK_AT[2]]} rot={[0, Math.sin(frame * 0.05) * 0.15, Math.sin(frame * 0.07) * 0.05]} frame={frame} smoke={1} s={1.1} glow={span(frame, cover - 6, cover + 10)} />
					<Smoke at={[BOOK_AT[0], 0.05, BOOK_AT[2] + 0.1]} frame={frame} amount={1 - span(frame, cover - 10, cover)} r={0.28} rise={1.0} n={10} seed={9} />
				</group>
			) : null}
		</group>
	);
	const fiveLeaf: V3 = [0.2, 0.1, 0.95];
	const angles: Angle3[] = [
		{at: [-0.5, 0.4, -0.3], dist: 5.5, yaw: 50, pitch: 10, fov: 40, dyaw: 8},
		{at: [-0.6, 0.06, 0.6], dist: 0.7, yaw: 10, pitch: 60, fov: 40, dyaw: 6},
		{at: [0.5, 0.06, 1.2], dist: 0.7, yaw: -30, pitch: 60, fov: 40, dyaw: 6},
		{at: [-0.3, 0.06, 1.8], dist: 0.7, yaw: 40, pitch: 60, fov: 40, dyaw: 6},
		{at: [0.2, 0.2, 0.92], dist: 0.8, yaw: 20, pitch: 22, fov: 38, dyaw: 10, ddist: -0.12},
		withShake({at: [0, 0.6, -0.3], dist: 3.2, yaw: 25, pitch: 12, fov: 40}, frame, shakeAt),
		withShake({at: [0, 0.5, 0.5], dist: 4.2, yaw: -30, pitch: 10, fov: 42}, frame, book, 0.08),
		{at: [0, 0.55, 1.15], dist: 1.6, yaw: 15, pitch: 6, fov: 38, dyaw: -10},
		{at: [0, 0.57, 1.15], dist: 0.95, yaw: 0, pitch: 2, fov: 34, ddist: -0.15},
	];
	// The three-leaf clovers you check, and the five.
	const checks: Array<[V3, number]> = [
		[[-0.6, 0.08, 0.6], three0],
		[[0.5, 0.08, 1.2], three1],
		[[-0.3, 0.08, 1.8], three2],
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.park}
				bg={BG.park}
				far={
					<group>
						<Park hole={[0, 1.15, 0.6]} cracks={span(frame, book - 4, book + 10)} />
						{checks.map(([p], i) => (
							<Clover3D key={i} at={p} n={3} s={0.08} />
						))}
						{frame < pick - 4 ? <Clover3D at={fiveLeaf} n={5} s={0.08} glow={span(frame, five, five + 10)} /> : null}
					</group>
				}
				near={near}
				blur={frame >= three0 - 4 && frame < pick - 4 ? 1.5 : 0}
				overlay={() => (
					<AbsoluteFill>
						{checks.map(([, at], i) => (
							<Big key={i} text="3" x={1500} y={300} size={140} frame={frame} at={at + 4} until={cuts[i + 2] - 6} color={UI.cream} />
						))}
						<Big text="5!" x={1480} y={300} size={170} frame={frame} at={five + 8} until={pick - 6} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="swish" at={three0} volume={0.25} />
			<Sound name="swish" at={three1} volume={0.25} />
			<Sound name="swish" at={three2} volume={0.25} />
			<Sound name="chime" at={five + 6} volume={0.4} />
			<Sound name="boom" at={shakeAt} volume={0.35} />
			<Sound name="crunch" at={book} volume={0.4} />
			<Sound name="appear" at={cover} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- book

export const Book: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const flips = cue(l0, 'and flips');
	const page = cue(l0, 'Page after page');
	const ink = cue(l0, 'Then ink');
	const touch = cue(l0, 'You touch it');
	const black = cue(l0, "It's black");
	const hits = cue(l0, 'It hits the ground');
	const tryIt = l1.a;
	const pull = cue(l1, 'You pull');
	const lean = cue(l1, 'you lean back');
	const foot = cue(l1, 'you put your foot');
	const nothing = cue(l1, 'Nothing.');
	const floats = cue(l1, 'The book just floats');
	const know = cue(l1, 'And somehow');
	const chose = cue(l1, 'It chose you');
	const cuts = [0, flips - 4, page - 4, ink - 4, touch - 4, black - 4, hits - 6, tryIt - 4, pull - 4, lean - 4, nothing - 4, floats - 4, know - 4, chose - 4];
	const you: V3 = [-0.35, 0, -0.1];
	// The book floats up from the grass to your face, opens, riffles, inks the sword.
	const up = span(frame, 0, flips - 2);
	const bookPos: V3 = frame < hits ? [0, lerp(0.55, 1.45, up), lerp(1.15, 0.7, up)] : [-0.75, 1.5 + Math.sin(frame * 0.08) * 0.06, 0.55];
	const open = frame < hits ? span(frame, flips, flips + 14) : 0.25 + Math.max(0, Math.sin(frame * 0.5)) * 0.35 * span(frame, floats, floats + 6) * (1 - span(frame, know - 4, know + 6));
	const riffle = span(frame, page - 4, ink - 4, (v) => v) * 6.5;
	const inked = span(frame, ink + 6, touch - 6, (v) => v);
	// The sword slides out of the page towards you, then drops and sticks in the ground.
	const out = span(frame, touch + 6, black - 4, (v) => v);
	const drop = span(frame, hits - 8, hits, (v) => v * v);
	const swordGrip: V3 = [0, 1.1 + out * 0.3, lerp(0.66, 0.3, out)];
	const pulling = frame >= pull - 4 && frame < nothing;
	const leanBack = frame >= lean - 4 && frame < nothing ? 18 + Math.sin(frame * 0.6) * 4 : 0;
	const strain = pulling ? Math.sin(frame * 0.9) * 0.02 : 0;
	const heroPos: V3 = frame >= tryIt - 4 ? [0.4, 0, 0.42 + strain] : you;
	const grip: V3 = [0.4, 1.1, 0.98];
	const glow = span(frame, chose - 4, chose + 8);
	const bookFace = frame < hits ? 2.5 : frame > floats ? 1.68 : 0.6;
	let near: React.ReactNode;
	if (frame < tryIt - 4) {
		near = (
			<group>
				<Hero3D position={you} face={frame > black ? 'shocked' : frame > ink ? 'happy' : 'shocked'} look={[0, 0.3]} armR={frame > touch && frame < black ? [90, 100] : undefined} reachR={frame > touch && frame < black ? 70 : 0} armL={frame > hits ? [40, 140] : undefined} />
				<Grimoire3D at={bookPos} rot={[0.1, bookFace, 0]} frame={frame} open={open} riffle={riffle} ink={inked} glow={inked > 0 ? 1 - out : 0} smoke={0.7} s={1.2} />
				{frame >= touch + 6 && frame < hits - 8 ? <HeldSword grip={swordGrip} tilt={0} frame={frame} smoke={0.6} s={lerp(0.25, 1, Math.min(1, out * 1.4))} /> : null}
			</group>
		);
	} else {
		near = (
			<group>
				<Hero3D
					position={heroPos}
					face={frame > nothing ? (frame > chose ? 'happy' : 'sad') : pulling ? 'determined' : 'neutral'}
					turn={frame > floats ? lerp(0, -1.46, span(frame, floats, floats + 16)) : 0}
					armL={pulling || frame < pull ? [12, 18] : [12, 6]}
					armR={pulling || frame < pull ? [12, 18] : [12, 6]}
					reachL={pulling || frame < pull ? 78 : 0}
					reachR={pulling || frame < pull ? 78 : 0}
					lean={-leanBack}
					fists={pulling}
					look={frame > floats ? [0, 0.3] : [0, 0.2]}
				/>
				<Grimoire3D at={bookPos} rot={[0.1, bookFace + Math.sin(frame * 0.05) * 0.1, 0]} frame={frame} open={open} glow={glow} smoke={0.7} s={1.1} />
			</group>
		);
	}
	const sticking = frame >= hits - 8;
	const far = (
		<group>
			<Park hole={[0, 1, 0.5]} cracks={frame >= hits ? 1 : 0} />
			{sticking ? <HeldSword grip={[lerp(0.1, grip[0], drop), lerp(2.1, 1.38, drop), lerp(0.5, grip[2], drop)]} tilt={lerp(120, 180, drop)} frame={frame} smoke={0.5} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [0, 1.1, 0.6], dist: 4.4, yaw: 30, pitch: 8, fov: 40},
		{at: [0, 1.4, 0.6], dist: 1.9, yaw: 125, pitch: 6, fov: 40},
		{at: [0, 1.45, 0.7], dist: 1.6, yaw: 122, pitch: 8, fov: 36, dyaw: 0},
		{at: [0, 1.42, 0.72], dist: 1.35, yaw: 125, pitch: 4, fov: 34, ddist: -0.1, dyaw: 0},
		{at: [0, 1.4, 0.5], dist: 2.4, yaw: 120, pitch: 6, fov: 38},
		{at: [0.1, 1.2, 0.5], dist: 2.6, yaw: 60, pitch: -6, fov: 40},
		withShake({at: [0.4, 0.8, 0.95], dist: 3.6, yaw: 30, pitch: 10, fov: 40, dyaw: 0}, frame, hits, 0.1),
		{at: [0.4, 1.0, 0.7], dist: 3.6, yaw: 40, pitch: 8, fov: 40},
		{at: [0.4, 1.2, 0.7], dist: 2.4, yaw: 75, pitch: 4, fov: 38},
		{at: [0.4, 1.0, 0.6], dist: 3.0, yaw: -50, pitch: 4, fov: 38},
		{at: [0.4, 1.3, 0.6], dist: 2.0, yaw: 20, pitch: 4, fov: 34},
		{at: [-0.2, 1.2, 0.6], dist: 3.2, yaw: 30, pitch: 6, fov: 38},
		{at: [-0.15, 1.35, 0.5], dist: 2.6, yaw: 150, pitch: 4, fov: 38, dyaw: -6},
		{at: [-0.15, 1.42, 0.5], dist: 2.0, yaw: 155, pitch: 2, fov: 36, ddist: -0.2},
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={LIGHT.park} bg={BG.park} far={far} near={near} blur={0} />
			<Sound name="whoosh" at={flips} volume={0.3} />
			<Sound name="swish" at={page} volume={0.35} />
			<Sound name="swish" at={page + 12} volume={0.3} />
			<Sound name="swish" at={page + 24} volume={0.3} />
			<Sound name="sizzle" at={ink} volume={0.2} />
			<Sound name="appear" at={touch + 6} volume={0.35} />
			<Sound name="boom" at={hits} volume={0.45} />
			<Sound name="crunch" at={hits + 2} volume={0.35} />
			<Sound name="squeak" at={pull + 6} volume={0.2} />
			<Sound name="chime" at={chose} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- clover

export const Clover: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const white = cue(l0, 'A white clover');
	const pick = cue(l0, 'Pick thousands');
	const four = cue(l0, 'one with four');
	const most = cue(l0, 'Most counts');
	const five = cue(l0, 'And five leaves');
	const cuts = [0, white - 4, pick - 4, four - 4, most - 4, five - 4];
	const angles: Angle3[] = [
		{at: [0, 0.1, 0], dist: 7, yaw: 20, pitch: 55, fov: 44, dyaw: 10},
		{at: [0, 0.18, 0], dist: 0.55, yaw: 15, pitch: 40, fov: 36, dyaw: 18},
		{at: [0, 0.1, 0], dist: 14, yaw: -10, pitch: 70, fov: 44, ddist: 4},
		{at: [0.9, 0.18, 0.4], dist: 0.6, yaw: -20, pitch: 38, fov: 36, dyaw: 18},
		{at: [0.9, 0.18, 0.4], dist: 1.4, yaw: 10, pitch: 45, fov: 40, dyaw: 10},
		{at: [-0.8, 0.18, -0.6], dist: 0.6, yaw: 20, pitch: 38, fov: 36, dyaw: 22},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.day}
				bg={BG.day}
				far={
					<group>
						<Ground color="#4FA850" size={160} />
						<CloverField size={30} n={4200} skip={[[0, 0, 0.3], [0.9, 0.4, 0.3], [-0.8, -0.6, 0.3]]} />
					</group>
				}
				near={
					<group>
						<Clover3D at={[0, 0.14, 0]} n={3} s={0.11} />
						<Clover3D at={[0.9, 0.14, 0.4]} n={4} s={0.11} glow={span(frame, four, four + 10)} />
						<Clover3D at={[-0.8, 0.14, -0.6]} n={5} s={0.11} glow={span(frame, five, five + 10)} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="WHITE CLOVER: 3 LEAFLETS" x={960} y={880} frame={frame} at={white + 8} until={pick - 6} size={50} />
						<Count from={0} to={5000} x={960} y={300} size={110} frame={frame} at={pick + 4} dur={50} color={UI.cream} />
						<Label text="FOUR LEAVES" x={960} y={880} frame={frame} at={four + 4} until={most - 6} size={54} color={UI.green} />
						<Big text="ABOUT 1 IN 5,000 – 10,000" x={960} y={850} size={84} frame={frame} at={most + 4} until={five - 6} />
						<Label text="FIVE LEAVES: RARER STILL" x={960} y={880} frame={frame} at={five + 6} size={54} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={white + 8} volume={0.3} />
			<Sound name="tick" at={pick + 4} volume={0.3} />
			<Sound name="chime" at={four + 4} volume={0.35} />
			<Sound name="chime" at={five + 6} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- gene

/** A double helix standing up at `at`, turning. */
const Helix: React.FC<{at: V3; frame: number; h?: number; r?: number}> = ({at, frame, h = 2.4, r = 0.3}) => {
	const n = 22;
	return (
		<group position={at} rotation={[0, frame * 0.03, 0]}>
			{[...Array(n)].map((_, i) => {
				const y = (i / (n - 1)) * h;
				const a = i * 0.55;
				const p1: V3 = [Math.cos(a) * r, y, Math.sin(a) * r];
				const p2: V3 = [-Math.cos(a) * r, y, -Math.sin(a) * r];
				return (
					<group key={i}>
						<T shape={{kind: 'sphere', r: 0.06}} color="#7FE0FF" position={p1} outline={0.01} />
						<T shape={{kind: 'sphere', r: 0.06}} color="#FF8AD8" position={p2} outline={0.01} />
						<group position={[0, y, 0]} rotation={[0, -a, 0]}>
							<Box size={[r * 2, 0.025, 0.025]} at={[0, 0, 0]} color={i % 2 ? '#FFD84A' : '#7CF2A0'} outline={0} />
						</group>
					</group>
				);
			})}
		</group>
	);
};

export const Gene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const found = cue(l0, 'found the genes');
	const butGenes = cue(l0, "But genes aren't");
	const canStill = cue(l0, 'A clover with those');
	const warm = cue(l0, 'how warm');
	const so = cue(l0, 'So the luck');
	const cuts = [0, found - 4, butGenes - 4, canStill - 4, warm - 4, so - 4];
	const sun = span(frame, warm, warm + 12);
	const angles: Angle3[] = [
		{at: [-0.2, 1.1, 0], dist: 3.4, yaw: 15, pitch: 8, fov: 40},
		{at: [0.4, 1.0, 0], dist: 1.9, yaw: -20, pitch: 22, fov: 38},
		{at: [0, 1.0, 0], dist: 4.2, yaw: 0, pitch: 10, fov: 40},
		{at: [2.2, 0.85, 0], dist: 3.2, yaw: 10, pitch: 12, fov: 42},
		{at: [2.2, 0.85, 0], dist: 3.4, yaw: -12, pitch: 16, fov: 42},
		{at: [2.2, 0.85, 0], dist: 3.8, yaw: 0, pitch: 10, fov: 42},
	];
	const pot = (x: number, n: number, shade: boolean) => (
		<group position={[x, 0, 0]}>
			<T shape={{kind: 'cyl', r: 0.35, r2: 0.26, h: 0.4}} color="#C8704A" position={[0, 0.2, 0]} outline={0.015} />
			<T shape={{kind: 'cyl', r: 0.33, h: 0.04}} color="#5A3A2A" position={[0, 0.4, 0]} outline={0} />
			<Clover3D at={[0, 0.75, 0]} n={n} s={0.28} glow={shade ? 0 : sun} stem={1.2} />
			{shade ? (
				<group>
					<T shape={{kind: 'sphere', r: 0.35}} scale={[1.5, 0.7, 1]} color="#8A9AB8" position={[0, 1.6, 0]} outline={0.02} />
					<T shape={{kind: 'sphere', r: 0.3}} scale={[1.4, 0.75, 1]} color="#8A9AB8" position={[0.35, 1.7, 0]} outline={0.02} />
				</group>
			) : (
				<group position={[0.35, 1.65, 0]} rotation={[0, 0, frame * 0.01]}>
					<Glow shape={{kind: 'sphere', r: 0.22}} color="#FFD84A" />
					{[...Array(8)].map((_, i) => (
						<group key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
							<Box size={[0.05, 0.14, 0.02]} at={[0, 0.38, 0]} color="#FFB84A" outline={0} />
						</group>
					))}
				</group>
			)}
		</group>
	);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.lab}
				bg={BG.lab}
				far={
					<group>
						<Ground color="#C8D4E8" size={60} lines={{every: 2, color: '#B8C4DA'}} />
						<Box size={[30, 8, 0.2]} at={[0, 4, -4]} color="#9AACD0" outline={0} />
					</group>
				}
				near={
					frame < canStill - 4 ? (
						<group>
							<Helix at={[-0.9, 0, -0.6]} frame={frame} />
							<T shape={{kind: 'cyl', r: 0.5, h: 0.6}} color="#F2F2F2" position={[0.4, 0.3, 0]} outline={0.02} />
							<Clover3D at={[0.4, 0.98, 0]} n={4} s={0.3} stem={0.9} glow={span(frame, found, found + 10)} />
						</group>
					) : (
						<group>
							{pot(1.4, 4, false)}
							{pot(3.0, 3, true)}
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="CROP SCIENCE · 2010" x={960} y={220} frame={frame} at={found - 2} until={butGenes - 6} size={48} color={UI.yellow} />
						<Label text="UNIVERSITY OF GEORGIA" x={960} y={870} frame={frame} at={found + 6} until={butGenes - 6} size={46} />
						<Label text="GENES FOR EXTRA LEAVES" x={960} y={870} frame={frame} at={butGenes} until={canStill - 6} size={46} color={UI.green} />
						<Label text="SAME GENES" x={960} y={220} frame={frame} at={canStill + 6} size={48} color={UI.cream} />
						<Label text="SUN · WARMTH · WATER" x={660} y={870} frame={frame} at={warm + 4} until={so - 6} size={42} color={UI.yellow} />
						<Big text="PLANT + WEATHER" x={960} y={860} size={90} frame={frame} at={so + 6} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={found} volume={0.3} />
			<Sound name="chime" at={warm + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- record

export const Record: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const man = cue(l0, 'a man in Japan');
	const grew = cue(l0, 'grew a clover');
	const guin = cue(l0, "It's in the Guinness");
	const cuts = [0, man - 4, grew - 4, guin - 4];
	const angles: Angle3[] = [
		{at: [-0.1, 1.0, 0], dist: 2.8, yaw: 0, pitch: 30, fov: 38},
		{at: [0, 1.0, 0], dist: 3.0, yaw: -20, pitch: 34, fov: 40},
		{at: [0.5, 1.12, 0], dist: 1.4, yaw: 15, pitch: 55, fov: 38, dyaw: 25},
		{at: [0.1, 1.0, 0], dist: 2.6, yaw: 10, pitch: 40, fov: 40, dyaw: 12},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.studio}
				bg={BG.studio}
				far={
					<group>
						<Ground color="#2A2160" size={60} />
						<T shape={{kind: 'cyl', r: 1.8, h: 0.2}} color="#3E2F96" position={[0, 0.1, 0]} outline={0.02} />
					</group>
				}
				near={
					<group>
						<group position={[-0.7, 0, 0]}>
							<T shape={{kind: 'cyl', r: 0.25, h: 0.6}} color="#F2F2F2" position={[0, 0.5, 0]} outline={0.015} />
							<Clover3D at={[0, 1.02, 0]} n={5} s={0.16} stem={0.9} />
						</group>
						<group position={[0.5, 0, 0]} rotation={[0, frame * 0.012, 0]}>
							<T shape={{kind: 'cyl', r: 0.35, h: 0.6}} color="#FFD84A" position={[0, 0.5, 0]} outline={0.015} />
							<Clover3D at={[0, 1.04, 0]} n={63} s={0.15} stem={0.9} glow={span(frame, grew, grew + 12)} />
						</group>
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="5 LEAVES" x={560} y={870} frame={frame} at={6} size={44} />
						<Label text="YOSHIHARU WATANABE · JAPAN" x={960} y={220} frame={frame} at={man + 4} until={guin - 6} size={46} />
						<Big text="63 LEAVES" x={1240} y={860} size={100} frame={frame} at={grew + 12} />
						<Label text="GUINNESS WORLD RECORDS · 2024" x={960} y={220} frame={frame} at={guin + 2} size={46} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={grew + 12} volume={0.4} />
			<Sound name="applause" at={guin + 4} volume={0.15} />
		</>
	);
};

// ---------------------------------------------------------------- luck

/** The newspaper page: a grid of photos, and (on page two) the huge message. */
const Paper: React.FC<{frame: number; at: number; until?: number; page: 1 | 2; counted: number; x?: number}> = ({frame, at, until, page, counted, x = 1380}) => {
	const p = span(frame, at, at + 12) * (until === undefined ? 1 : 1 - span(frame, until, until + 8));
	if (p <= 0) {
		return null;
	}
	const photos = page === 1 ? 12 : 4;
	return (
		<div style={{position: 'absolute', left: x, top: 545, width: 640, height: 760, transform: `translate(-50%, -50%) rotate(${2 - p * 2}deg) scale(${0.8 + 0.2 * p})`, opacity: p, background: '#F4F0E6', borderRadius: 6, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', padding: 26, fontFamily: 'Georgia, serif', color: '#1A1A1A', overflow: 'hidden'}}>
			<div style={{fontSize: 40, fontWeight: 700, borderBottom: '4px double #1A1A1A', paddingBottom: 6, textAlign: 'center'}}>THE DAILY NEWS</div>
			<div style={{fontSize: 18, textAlign: 'right', marginTop: 4}}>PAGE {page}</div>
			{page === 2 ? (
				<div style={{marginTop: 14, border: '5px solid #1A1A1A', padding: '18px 14px', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.1, background: '#FFF6C8'}}>
					STOP COUNTING.
					<div style={{fontSize: 34, marginTop: 8}}>THERE ARE 43 PHOTOGRAPHS IN THIS NEWSPAPER.</div>
				</div>
			) : null}
			<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 16}}>
				{[...Array(photos)].map((_, i) => (
					<div key={i} style={{height: page === 1 ? 130 : 110, background: ['#9AB8D8', '#C8A88A', '#A8C89A', '#D8B0C0'][i % 4], border: '3px solid #1A1A1A', position: 'relative'}}>
						{page === 1 && i < counted ? (
							<div style={{position: 'absolute', right: 6, top: 4, width: 38, height: 38, borderRadius: 19, background: '#E8453C', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
};

export const Luck: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const wiseman = cue(l0, 'A psychologist');
	const gave = cue(l0, 'He gave them');
	const page2 = cue(l0, 'But on page two');
	const lucky = cue(l0, 'The lucky people');
	const unlucky = cue(l0, 'The unlucky people');
	const noticing = l1.a;
	const cuts = [0, wiseman - 4, gave - 4, page2 - 4, lucky - 4, unlucky - 4, noticing - 4];
	const you: V3 = [-0.7, 0, 0];
	const fr: V3 = [0.7, 0, 0];
	const reading = frame >= gave - 4;
	const holdArm: [number, number] = [12, 40];
	const counted = Math.floor(span(frame, gave + 20, page2 - 4, (v) => v) * 12);
	const angles: Angle3[] = [
		{at: [-0.7, 1.4, 0], dist: 3.0, yaw: 20, pitch: 6, fov: 36},
		{at: [0, 1.1, 0], dist: 4.6, yaw: 0, pitch: 6, fov: 40},
		{at: [-0.2, 1.0, 0], dist: 3.6, yaw: 25, pitch: 8, fov: 40},
		{at: [-0.4, 1.0, 0], dist: 3.6, yaw: 25, pitch: 8, fov: 40},
		{at: [-0.7, 1.35, 0], dist: 2.5, yaw: 18, pitch: 6, fov: 34},
		{at: [0.7, 1.35, 0], dist: 2.5, yaw: -18, pitch: 6, fov: 34},
		{at: [-0.7, 1.3, 0], dist: 2.8, yaw: 10, pitch: 4, fov: 36, dyaw: -10},
	];
	const paperAt = (pos: V3): V3 => [pos[0], 0.95, pos[2] + 0.52];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={LIGHT.studio}
				bg={BG.studio}
				far={
					<group>
						<Ground color="#2A2160" size={60} />
						<T shape={{kind: 'cyl', r: 2.4, h: 0.2}} color="#3E2F96" position={[0, 0.1, 0]} outline={0.02} />
					</group>
				}
				near={
					<group>
						<Hero3D position={[you[0], 0.2, you[2]]} face={frame > lucky && frame < unlucky ? 'happy' : frame > noticing ? 'smug' : 'neutral'} armL={reading ? holdArm : [60, 110]} armR={reading ? holdArm : undefined} reachL={reading ? 70 : 40} reachR={reading ? 70 : 0} look={reading ? [0, -0.5] : [0.4, 0.2]} />
						<Hero3D who={P6.friend} position={[fr[0], 0.2, fr[2]]} face={frame > unlucky ? 'determined' : 'neutral'} armL={reading ? holdArm : undefined} armR={reading ? holdArm : undefined} reachL={reading ? 70 : 0} reachR={reading ? 70 : 0} look={reading ? [0, -0.6] : [-0.4, 0.2]} talk={frame > unlucky ? 0.5 : 0} />
						{reading ? (
							<group>
								{[you, fr].map((p, i) => (
									<group key={i} position={[paperAt(p)[0], paperAt(p)[1] + 0.2, paperAt(p)[2]]} rotation={[-0.95, 0, 0]}>
										<Box size={[0.62, 0.44, 0.012]} at={[0, 0, 0]} color="#F4F0E6" outline={0.006} />
										{[...Array(6)].map((_, j) => (
											<Box key={j} size={[0.14, 0.1, 0.004]} at={[-0.2 + (j % 3) * 0.2, 0.08 - Math.floor(j / 3) * 0.16, 0.008]} color={['#9AB8D8', '#C8A88A', '#A8C89A'][j % 3]} outline={0} />
										))}
									</group>
								))}
							</group>
						) : (
							<Clover3D at={[handAt([you[0], 0.2, you[2]], 0, [60, 110], 40, -1)[0], handAt([you[0], 0.2, you[2]], 0, [60, 110], 40, -1)[1] + 0.1, handAt([you[0], 0.2, you[2]], 0, [60, 110], 40, -1)[2]]} n={5} s={0.07} glow={1} />
						)}
					</group>
				}
				blur={0}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						<Thought cam={cam} head={top(you[0], you[2], 0.2)} text="Lucky?" frame={frame} at={8} until={wiseman - 6} />
						<Label text="RICHARD WISEMAN · PSYCHOLOGIST" x={960} y={220} frame={frame} at={wiseman + 4} until={gave - 6} size={46} color={UI.yellow} />
						<Label text="‘LUCKY’" x={720} y={870} frame={frame} at={cue(l0, 'who said they were lucky')} until={gave - 6} size={46} color={UI.green} />
						<Label text="‘UNLUCKY’" x={1200} y={870} frame={frame} at={cue(l0, "who said they weren't")} until={gave - 6} size={46} color={UI.red} />
						<Paper frame={frame} at={gave + 10} until={page2 - 4} page={1} counted={counted} />
						<Paper frame={frame} at={page2} until={lucky - 4} page={2} counted={0} />
						<Big text="SPOTTED IN SECONDS" x={960} y={870} size={84} frame={frame} at={lucky + 6} until={unlucky - 6} color={UI.green} />
						<Count from={1} to={43} x={1500} y={300} size={84} frame={frame} at={unlucky + 4} dur={90} color={UI.red} />
						<Says cam={cam} head={top(fr[0], fr[2], 0.2)} text="…41, 42, 43!" frame={frame} at={unlucky + 96} until={noticing - 4} />
						<Big text="LUCK = NOTICING" x={960} y={860} size={96} frame={frame} at={noticing + 8} />
						<div style={{position: 'absolute', left: 960, top: 980, transform: 'translateX(-50%)', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: '#C8C0F0', opacity: span(frame, wiseman + 4, wiseman + 14) * (1 - span(frame, gave - 6, gave))}}>THE LUCK FACTOR · 2003</div>
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={wiseman + 4} volume={0.3} />
			<Sound name="swish" at={gave + 10} volume={0.3} />
			<Sound name="swish" at={page2} volume={0.3} />
			<Sound name="chime" at={lucky + 6} volume={0.35} />
			<Sound name="tick" at={unlucky + 4} volume={0.25} />
			<Sound name="chime" at={noticing + 8} volume={0.35} />
		</>
	);
};
