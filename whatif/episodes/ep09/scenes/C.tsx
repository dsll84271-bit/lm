import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Bed3, Desk3, Door3, Lamp3, Plant3, Poster3, ROOM3, Room3, Shelf3} from '../../../three/sets3d';
import {Car3D} from '../../../three/sky3d';
import {Shot3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {Causeway3D, Flamingo3D, Fountain3D, GameBoxes3D, Lifeguard3D, Palm3D, WallShimmer} from '../../../three/miami3d';
import {BG, HUD, LIGHT, light, lookFrom, MiamiSet, P9, SkyText} from './kit';
import type {V3} from './util';

// Part C: the countdown, how huge these games are, the run with the world
// switching off behind you, the invisible wall, falling through the bottom of
// the world, waking up on release day, and the twist.

const Studio: React.FC = () => <Ground color="#3A2E80" size={300} lines={{every: 2, color: '#4A3E98', along: 'z'}} />;

/** The giant countdown in the sky. */
const Countdown: React.FC<{frame: number; secs: number; at?: number}> = ({frame, secs, at = 0}) => {
	const p = span(frame, at, at + 12);
	if (p <= 0) {
		return null;
	}
	const s = Math.max(0, Math.ceil(secs));
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: p}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: FONT, fontWeight: 700}}>
				<div style={{fontSize: 36, color: '#FFFFFF', letterSpacing: 6, WebkitTextStroke: '2px #140A28'}}>PLAYER RETURNING</div>
				<div style={{fontSize: 96, color: s <= 30 ? '#FF4A5A' : '#FFD84A', WebkitTextStroke: '4px #140A28'}}>
					{Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- countdown

export const CountdownShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const timer = cue(l0, 'and a giant timer');
	const wrong = cue(l0, 'Things start');
	const palm = cue(l0, 'A palm tree');
	const taxi = cue(l0, 'A taxi');
	const edge = cue(l0, 'And far away');
	const cuts = [0, timer - 4, wrong - 4, palm - 4, taxi - 4, edge - 4];
	const flick = frame > palm && Math.floor(frame / 5) % 2 === 0;
	const taxiX = lerp(-40, 40, span(frame, taxi - 10, taxi + 70, (v) => v));
	const greyEdge = span(frame, edge, dur);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([10, 2.2, 30], [0, 10, -10], 52), lookFrom([4, 1.6, 22], [0, 18, -10], 56), lookFrom([6, 2, 16], [0, 3, 0], 50), lookFrom([-26 + 3, 1.6, -9.5 + 6], [-26, 4, -9.5], 48), lookFrom([taxiX - 6, 1.4, 8], [taxiX, 1, -3.4], 48), lookFrom([-20, 30, 60], [-100, 6, -20], 46)]}
				light={light([0, 0, 0], 'dark', 40)}
				bg={BG.dark}
				far={<MiamiSet frame={frame} lit={1} hotelState={(i, x) => (x < -150 + greyEdge * 60 ? 1 : 0)} />}
				near={
					<group>
						<Hero3D position={[2, 0, 6]} turn={Math.PI} face="scared" look={[0, 0.7]} />
						{flick ? <Glow shape={{kind: 'sphere', r: 6}} color="#2A1E5A" position={[-26, 6, -9.5]} opacity={0.5} /> : null}
						<group position={[taxiX, 1.5, -3.4]} rotation={[Math.PI, Math.PI / 2, 0]}>
							<Car3D at={[0, -1.5, 0]} color="#FFD84A" />
						</group>
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} coins={50} glitch={frame > wrong ? 0.4 : 0} />
						<Countdown frame={frame} secs={180 - Math.max(0, frame - timer) / 30} at={timer} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="timestop" at={timer} volume={0.4} />
			<Sound name="vanish" at={edge + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- huge

export const Huge: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const sold = cue(l0, 'GTA five has sold');
	const trailer = cue(l0, 'And the very first');
	const guinness = cue(l0, "That's a Guinness");
	const phone = frame >= trailer - 4;
	const views = Math.round(lerp(0, 90421491, span(frame, trailer + 10, guinness, (v) => v)));
	const stack = Math.round(lerp(6, 240, span(frame, sold, trailer - 10, (v) => v)));
	return (
		<>
			{phone ? (
				<AbsoluteFill style={{background: BG.studio, fontFamily: FONT}}>
					<div style={{position: 'absolute', left: 760, top: 160, width: 400, height: 760, borderRadius: 56, background: '#140A28', border: '10px solid #3A2E5A'}}>
						<div style={{position: 'absolute', left: 22, right: 22, top: 70, bottom: 70, borderRadius: 26, background: '#F4F2FF', padding: 20}}>
							<div style={{height: 200, borderRadius: 16, background: 'linear-gradient(#FF7AA8, #FFC890)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<div style={{width: 0, height: 0, borderTop: '40px solid transparent', borderBottom: '40px solid transparent', borderLeft: '64px solid #FFFFFF', marginLeft: 16}} />
							</div>
							<div style={{marginTop: 30, fontSize: 30, color: '#7A6AA8'}}>views · first 24 hours</div>
							<div style={{marginTop: 6, fontSize: 52, fontWeight: 700, color: '#140A28'}}>{views.toLocaleString('en-GB')}</div>
						</div>
					</div>
					<Label text="GTA VI · FIRST TRAILER · DECEMBER 2023" x={960} y={170} size={44} frame={frame} at={trailer + 4} color={UI.cream} />
					<Big text="GUINNESS WORLD RECORD" x={960} y={880} size={78} frame={frame} at={guinness + 4} color={UI.yellow} />
				</AbsoluteFill>
			) : (
				<Shot3
					frame={frame}
					dur={dur}
					lines={lines}
					cuts={[0]}
					angles={[{at: [0, 2 + stack * 0.012, 0], dist: 9 + stack * 0.03, yaw: 20, pitch: 8, fov: 42, ddist: 0, dyaw: 4}]}
					light={LIGHT.studio}
					bg={BG.studio}
					far={<Studio />}
					near={<GameBoxes3D at={[0, 0, 0]} n={stack} h={1.4} />}
					blur={0}
					overlay={() => <Big text="230 MILLION+ COPIES" x={960} y={860} size={84} frame={frame} at={sold + 20} color={UI.yellow} />}
				/>
			)}
			<Sound name="coins" at={sold + 10} volume={0.3} />
			<Sound name="chime" at={guinness + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- run

export const Run: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const neon = cue(l0, 'Along the beach road');
	const grey = cue(l0, 'The hotels go grey');
	const hat = cue(l0, 'The man in the sun hat');
	const jump = cue(l0, 'You jump a fountain');
	const bridge = cue(l0, 'and you head for');
	const cuts = [0, neon - 4, grey - 4, hat - 4, jump - 4, bridge - 4];
	const runX = lerp(-80, 120, span(frame, 0, dur, (v) => v));
	const wave = runX - 40;
	const hotelState = (i: number, x: number) => (x < wave ? 1 : 0);
	const hatX = -10;
	const hatGrey = frame > hat + 30;
	const jumpY = frame > jump && frame < jump + 70 ? Math.abs(Math.sin(((frame - jump) / 70) * Math.PI * 3)) * 2.4 : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([runX + 10, 2, 6], [runX, 1.4, -6.5], 52), lookFrom([runX + 14, 6, 16], [runX - 20, 6, -14], 54), lookFrom([runX - 6, 4, 10], [runX - 40, 8, -20], 56), lookFrom([hatX + 3, 1.6, -3], [hatX, 1.5, -6.5], 44), lookFrom([runX + 12, 2, 4], [runX, 1.6, -6.5], 52), lookFrom([runX + 20, 8, 20], [runX + 60, 4, 20], 50)]}
				light={light([runX, 0, -6], 'night', 40)}
				bg={BG.night}
				far={<MiamiSet frame={frame} lit={1} night hotelState={hotelState} palms />}
				near={
					<group>
						<Hero3D position={[runX, jumpY, -6.5]} turn={Math.PI / 2} run walk={frame / 3.5} face="determined" armL={[40, 70]} armR={[40, 70]} />
						<Hero3D who={P9.hat} position={[hatX, 0, -6.5]} turn={0.6} face="happy" opacity={hatGrey ? 0.35 : 1} lite />
						{hatGrey ? <T shape={{kind: 'capsule', r: 0.4, len: 0.9}} color="#8C8C98" position={[hatX, 0.9, -6.5]} outline={0.02} /> : null}
						<Fountain3D at={[runX > 20 ? 60 : 30, 0, -6.5]} frame={frame} />
						<Lifeguard3D at={[78, 0, -6.5]} yaw={Math.PI / 2} />
						<Flamingo3D at={[94, 0, -6.5]} yaw={-1} frame={frame} flap={frame > jump + 40 ? 1 : 0} s={1.4} />
						{[...Array(10)].map((_, i) => {
							const x = -160 + i * 30;
							return x < wave ? <T key={i} shape={{kind: 'box', w: 30, h: 40, d: 120}} color="#8C8C98" position={[x, 20, 0]} outline={0} opacity={0.0} /> : null;
						})}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} coins={50} glitch={0.3} />
						<Countdown frame={frame} secs={140 - frame / 30} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="run" at={4} volume={0.35} loop={dur - 10} />
			<Sound name="squeak" at={jump + 50} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- edge

const BRIDGE: V3 = [130, 0, 46];
const WALL_Z = BRIDGE[2] + 220;

export const Edge: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const smack = cue(l0, 'you smack into');
	const wall = cue(l0, 'An invisible wall');
	const every = cue(l0, 'Every game world');
	const push = cue(l0, 'You push');
	const behind = cue(l0, 'Behind you');
	const thirty = cue(l0, 'Thirty seconds');
	const cuts = [0, smack - 4, wall - 4, every - 4, push - 4, behind - 4, thirty - 4];
	const z = Math.min(WALL_Z - 0.6, lerp(BRIDGE[2] + 120, WALL_Z - 0.6, span(frame, 0, smack, (v) => v)));
	const bump = frame > smack && frame < smack + 10 ? Math.sin(((frame - smack) / 10) * Math.PI) * -0.5 : 0;
	const hit = frame > smack ? (frame > push && frame < behind ? 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.3)) : 1 - span(frame, smack, smack + 40) * 0.6) : 0;
	const greyT = (t: number) => (t * 220 < span(frame, behind, dur) * 200 ? 1 : 0);
	const s = frame > push && frame < behind ? shake(frame, push, 1, 6) : {x: 0, y: 0};
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([BRIDGE[0] + 6, 6, z - 14], [BRIDGE[0], 4.5, z], 50), lookFrom([BRIDGE[0] + 3, 5.6, z - 4], [BRIDGE[0], 5, z + 0.4], 46), lookFrom([BRIDGE[0] - 4, 6, WALL_Z + 6], [BRIDGE[0], 5.5, WALL_Z], 48), lookFrom([BRIDGE[0] + 30, 20, WALL_Z - 40], [BRIDGE[0], 4, WALL_Z], 46), lookFrom([BRIDGE[0] + 3 + s.x * 0.02, 5.5, z - 3.5], [BRIDGE[0], 5, z + 0.5], 44), lookFrom([BRIDGE[0] + 4, 7, WALL_Z + 4], [BRIDGE[0], 5, WALL_Z - 80], 48), lookFrom([BRIDGE[0] + 2.4, 5.4, z - 2.6], [BRIDGE[0], 5.2, z], 38)]}
				light={light([BRIDGE[0], 0, WALL_Z - 20], 'night', 40)}
				bg={BG.night}
				far={
					<group>
						<MiamiSet frame={frame} lit={1} night hotelState={() => 1} palms={false} />
						<Causeway3D at={BRIDGE} len={220} grey={greyT} />
					</group>
				}
				near={
					<group>
						<Hero3D position={[BRIDGE[0], 3.7, z + bump]} turn={0} run={frame < smack} walk={frame < smack ? frame / 3.5 : undefined} face={frame > thirty ? 'scared' : 'determined'} armL={frame > push ? [70, 100] : [40, 70]} armR={frame > push ? [70, 100] : [40, 70]} reachL={frame > push ? 70 : 0} reachR={frame > push ? 70 : 0} />
						<WallShimmer at={[BRIDGE[0], 3.7, WALL_Z]} frame={frame} hit={hit} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} coins={50} glitch={0.3} />
						<Countdown frame={frame} secs={70 - frame / 30} />
						<Label text="THE EDGE OF THE MAP" x={960} y={860} size={56} frame={frame} at={every + 6} until={push - 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="thud" at={smack} volume={0.5} />
			{[0, 1, 2].map((i) => <Sound key={i} name="thud" at={push + 6 + i * 22} volume={0.35} />)}
			<Sound name="tick" at={thirty} volume={0.4} loop={dur - thirty} />
		</>
	);
};

// ---------------------------------------------------------------- through

export const Through: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const gap = cue(l0, 'So you find');
	const tpose = cue(l0, 'and your arms snap');
	const wiggle = cue(l0, 'You wiggle');
	const fall = cue(l0, 'And you fall');
	const cuts = [0, gap - 4, tpose - 4, fall - 4];
	const falling = frame > fall + 6;
	const fy = falling ? -span(frame, fall + 6, dur, (v) => v * v) * 60 : 3.7;
	const jig = frame > wiggle && frame < fall + 6 ? Math.sin(frame * 1.2) * 0.12 : 0;
	const t = frame > tpose;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[lookFrom([BRIDGE[0] + 3, 5.6, WALL_Z - 5], [BRIDGE[0], 5, WALL_Z], 46), lookFrom([BRIDGE[0] + 5.6, 4.4, WALL_Z - 2], [BRIDGE[0] + 4.6, 4.2, WALL_Z], 44), lookFrom([BRIDGE[0] + 6, 5.2, WALL_Z - 3], [BRIDGE[0] + 4.6, 4.6, WALL_Z], 42), lookFrom([BRIDGE[0] + 4.6, fy - 6, WALL_Z + 1], [BRIDGE[0] + 4.6, fy + 4, WALL_Z], 60, {roll: frame * 0.6})]}
				light={falling ? light([BRIDGE[0], 0, WALL_Z], 'day', 40) : light([BRIDGE[0], 0, WALL_Z - 20], 'night', 40)}
				bg={falling ? BG.void : BG.night}
				far={
					falling ? null : (
						<group>
							<MiamiSet frame={frame} lit={1} night hotelState={() => 1} palms={false} />
							<Causeway3D at={BRIDGE} len={220} grey={() => 1} />
						</group>
					)
				}
				near={
					<group>
						{falling ? (
							<group position={[BRIDGE[0] + 4.6, 0, WALL_Z]}>
								<T shape={{kind: 'box', w: 40, h: 1, d: 40}} color="#55597A" position={[0, 6, 0]} outline={0.05} />
								<T shape={{kind: 'box', w: 40, h: 0.2, d: 40}} color="#2EC4D6" position={[0, 3.5, 20]} outline={0} />
							</group>
						) : (
							<group>
								<T shape={{kind: 'cyl', r: 0.12, h: 5}} color="#8C8C98" position={[BRIDGE[0] + 5.2, 6.2, WALL_Z - 0.1]} outline={0.01} />
								<WallShimmer at={[BRIDGE[0], 3.7, WALL_Z]} frame={frame} hit={frame > gap ? 0.5 : 0.2} />
							</group>
						)}
						<Hero3D position={[BRIDGE[0] + 4.6 + jig, fy, WALL_Z - 0.2]} turn={0} face={falling ? 'shocked' : 'determined'} armL={t ? [90, 90] : [40, 60]} armR={t ? [90, 90] : [40, 60]} still={t && !falling} tilt={falling ? frame * 4 : 0} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{!falling ? <HUD frame={frame} coins={50} glitch={t ? 0.8 : 0.3} /> : null}
						{!falling ? <Countdown frame={frame} secs={25 - frame / 30} /> : null}
						{falling ? <AbsoluteFill style={{background: '#FFFFFF', opacity: span(frame, dur - 18, dur - 2)}} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="snap" at={tpose + 2} volume={0.4} />
			<Sound name="whoosh" at={fall + 6} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- wake

/** Your bedroom, with a TV on a low unit at the foot of the bed and the new game on the desk. */
const Bedroom: React.FC<{frame: number; tv?: number; boxOn?: boolean}> = ({frame, tv = 0, boxOn = true}) => (
	<Room3 look={ROOM3.bedroom} window={{x: 1.4}}>
		<Bed3 at={[-1.0, 0, -2.6]} />
		<Shelf3 at={[-3.8, 2, -4.3]} />
		<Poster3 at={[-1.0, 2.4, -4.35]} color="#2E8AE8" accent="#FFD84A" />
		<Plant3 at={[4.6, 0, -3.6]} />
		<Lamp3 at={[-2.4, 0, -3.9]} />
		<Door3 at={[3.6, 0, -4.38]} />
		<Desk3 at={[3.2, 0, -1.4]} />
		{boxOn ? <T shape={{kind: 'box', w: 0.3, h: 0.04, d: 0.4}} color="#FF7AA8" position={[3.0, 0.8, -1.4]} outline={0.01} /> : null}
		<group position={[-1.0, 0, 1.6]} rotation={[0, Math.PI, 0]}>
			<T shape={{kind: 'box', w: 1.8, h: 0.5, d: 0.5}} color="#4A3A6A" position={[0, 0.25, 0]} outline={0.02} />
			<T shape={{kind: 'box', w: 1.6, h: 0.95, d: 0.08}} color="#140A28" position={[0, 1.0, 0]} outline={0.02} />
			<Glow shape={{kind: 'box', w: 1.48, h: 0.83, d: 0.02}} color={tv > 0 ? '#BFF0FF' : '#1E1640'} position={[0, 1.0, 0.05]} />
			{tv > 0 ? (
				<group position={[0, 1.0, 0.07]}>
					<Glow shape={{kind: 'box', w: 1.48, h: 0.3, d: 0.01}} color="#F4DEA6" position={[0, -0.27, 0]} />
					<Glow shape={{kind: 'box', w: 1.48, h: 0.12, d: 0.01}} color="#2EC4D6" position={[0, -0.1, 0]} />
					<Hero3D position={[0, -0.4, 0.02]} height={0.36} face={tv > 0.6 ? 'neutral' : 'happy'} turn={tv > 0.5 ? 0 : 0.8} look={[0, 0]} />
				</group>
			) : null}
		</group>
		{frame < 0 ? null : null}
	</Room3>
);

export const Wake: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const real = cue(l0, 'Real sunlight');
	const hand = cue(l0, 'You check your hand');
	const dream = cue(l0, 'It was a dream');
	const buzz = cue(l0, 'Then your phone');
	const release = cue(l0, "It's release day");
	const cuts = [0, real - 4, hand - 4, dream - 4, buzz - 4, release - 4];
	const sit = frame > 18;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[{at: [-1, 0.9, -2.4], dist: 3.2, yaw: 30, pitch: 30, fov: 44}, {at: [-1, 1.1, -2.4], dist: 4.4, yaw: 50, pitch: 10, fov: 42}, {at: [-0.7, 1.15, -2.1], dist: 1.6, yaw: 30, pitch: 6, fov: 36}, {at: [-1, 1.1, -2.4], dist: 4.6, yaw: 20, pitch: 8, fov: 42}, {at: [-0.6, 1.0, -2.2], dist: 2.2, yaw: 60, pitch: 20, fov: 40}, {at: [0.5, 1.2, -1.5], dist: 6, yaw: 30, pitch: 10, fov: 44}]}
				light={LIGHT.room}
				bg={BG.room}
				far={<Bedroom frame={frame} />}
				near={
					<group>
						<Hero3D position={[-1, sit ? 0.45 : 0.6, -2.4]} turn={sit ? 0.5 : 0} sit={sit} face={frame > dream ? 'happy' : 'shocked'} armR={frame > hand && frame < dream ? [60, 120] : [20, 20]} reachR={60} look={frame > hand && frame < dream ? [0.5, -0.4] : [0, 0]} />
						{frame > buzz ? (
							<group position={[-0.5, 0.75, -2.1]} rotation={[0, 0.3 + Math.sin(frame * 1.7) * 0.06, 0]}>
								<T shape={{kind: 'box', w: 0.36, h: 0.04, d: 0.7}} color="#2A2638" outline={0.01} />
								<Glow shape={{kind: 'box', w: 0.3, h: 0.01, d: 0.6}} color="#FF7AA8" position={[0, 0.03, 0]} />
							</group>
						) : null}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{frame < 16 ? <AbsoluteFill style={{background: '#FFFFFF', opacity: 1 - span(frame, 0, 16)}} /> : null}
						<Label text="NO TRIANGLES" x={960} y={860} size={56} frame={frame} at={hand + 20} until={dream} color={UI.cream} />
						<Big text="IT'S RELEASE DAY" x={960} y={250} size={110} frame={frame} at={release + 4} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="ring" at={buzz + 2} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- twist

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const start = cue(l0, 'and press start');
	const wakes = cue(l0, 'On the screen');
	const orange = cue(l0, 'It has a round');
	const turns = cue(l0, 'It turns round');
	const looks = cue(l0, 'And it looks');
	const cuts = [0, wakes - 4, orange - 4, turns - 4, looks - 4];
	const tv = frame > start ? (frame > looks ? 1 : frame > turns ? 0.55 : 0.3) : 0;
	const tvAt: V3 = [-1.0, 1.0, 1.6];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[{at: [-1, 1, -0.4], dist: 4.6, yaw: 160, pitch: 8, fov: 44}, lookFrom([tvAt[0], 1.05, tvAt[2] - 2.2], [tvAt[0], 0.95, tvAt[2]], 40), lookFrom([tvAt[0], 1.0, tvAt[2] - 1.4], [tvAt[0], 0.85, tvAt[2]], 36), lookFrom([tvAt[0], 1.0, tvAt[2] - 1.2], [tvAt[0], 0.82, tvAt[2]], 32), lookFrom([tvAt[0], 0.95, tvAt[2] - 0.9], [tvAt[0], 0.82, tvAt[2]], 30, {ddist: -0.3})]}
				light={LIGHT.room}
				bg={BG.room}
				far={<Bedroom frame={frame} tv={tv} boxOn={false} />}
				near={<Hero3D position={[-1, 0, -0.8]} turn={Math.PI} sit face={frame > looks ? 'shocked' : 'happy'} armL={[40, 90]} armR={[40, 90]} reachL={50} reachR={50} />}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="PRESS START" x={960} y={860} size={70} frame={frame} at={start - 6} until={wakes} color={UI.cream} />
						{frame > looks + 30 ? (
							<div style={{position: 'absolute', left: 1080, top: 300, background: '#FFFFFF', border: '5px solid #140A28', borderRadius: 30, padding: '10px 26px', fontFamily: FONT, fontWeight: 700, fontSize: 42, color: '#140A28', opacity: span(frame, looks + 30, looks + 40)}}>Don't press start.</div>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={start + 4} volume={0.35} />
			<Sound name="timestop" at={looks + 4} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const which = cue(l0, 'And which game');
	const giant = cue(l0, "And if you'd rather");
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0]}
				angles={[lookFrom([6, 2, 30], [0, 3, 18], 44, {dyaw: 6})]}
				light={light([0, 0, 20], 'sunset', 20)}
				bg={BG.sunset}
				far={<MiamiSet frame={frame} lit={1} />}
				near={
					<group>
						<Hero3D position={[0, 0, 22]} face="happy" armR={[160, 10]} />
						<Palm3D at={[4, 0, 20]} h={8} seed={9} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<SkyText frame={frame} at={6} until={giant - 6} top="WOULD YOU WANT TO LIVE IN A" big="VIDEO GAME?" y={330} />
						<Label text="WHICH GAME? TELL ME IN THE COMMENTS" x={960} y={860} size={52} frame={frame} at={which + 6} until={giant - 4} color={UI.cream} />
						<Label text="WATCH NEXT: WHAT IF YOU WOKE UP 100 METRES TALL?" x={960} y={860} size={48} frame={frame} at={giant + 6} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={6} volume={0.3} />
		</>
	);
};


