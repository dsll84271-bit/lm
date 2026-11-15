import React from 'react';
import {AbsoluteFill} from 'remotion';
import * as THREE from 'three';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {House} from '../../ep05/scenes/A';
import {Ground} from '../../../three/giant3d';
import {Airliner3D, Ball3D, Bolt3D, Burst3D, Calculator3D, Clover3D, Grimoire3D, Smoke} from '../../../three/grimoire3d';
import {Hero3D} from '../../../three/Hero3D';
import {Many, rnd, type Copy} from '../../../three/many';
import {Umbrella3D} from '../../../three/props3d2';
import {Bed3, Box, Pitch3, Poster3, Room3, ROOM3, Shelf3} from '../../../three/sets3d';
import {Car3D, Cloud3D} from '../../../three/sky3d';
import {project, type Cam3} from '../../../three/Stage3D';
import {Says, Shot3, Thought, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {BackSword, BG, HeldSword, LIGHT, P6, Panel, Park, ShoulderBook, Tree} from './kit';
import {handAt, mixArm, top, type V3} from './util';

// Part C: the storm at the football match, counting to the thunder, how hot
// lightning is, cancelling the bolt, the odds of being struck, Faraday
// cages, falling asleep, the library twist, and the question for you.

// ---------------------------------------------------------------- shared

/** Rain at people scale: thin falling streaks round `center`. */
const Rain: React.FC<{frame: number; area?: number; n?: number; top?: number; center?: [number, number]; speed?: number}> = ({frame, area = 24, n = 500, top = 10, center = [0, 0], speed = 0.45}) => {
	const items: Copy[] = [];
	for (let i = 0; i < n; i++) {
		const per = top / speed;
		const t = (frame + rnd(i * 3.1) * per) % per;
		items.push({p: [center[0] + (rnd(i * 1.3) - 0.5) * area, top - t * speed, center[1] + (rnd(i * 2.7) - 0.5) * area], s: [0.012, 0.28, 0.012], r: [0.08, 0, 0.05]});
	}
	return <Many kind="rainstreaks" geom={() => new THREE.CylinderGeometry(1, 1, 1, 5)} items={items} color="#CFE4FF" outline={0} opacity={0.6} shadow={false} />;
};

/** Dark storm clouds in a band overhead. */
const StormClouds: React.FC<{dark: number; z?: number; y?: number}> = ({dark, z = -40, y = 22}) => {
	if (dark <= 0.01) {
		return null;
	}
	const c = new THREE.Color('#FFFFFF').lerp(new THREE.Color('#4A4466'), dark).getStyle();
	const sh = new THREE.Color('#E4E0FF').lerp(new THREE.Color('#2E2A44'), dark).getStyle();
	return (
		<group>
			{[[-30, 0, 16, 1], [0, 3, 20, 4], [30, -2, 17, 7], [-12, 6, 14, 9], [16, 8, 15, 12]].map(([x, dz, s, seed], i) => (
				<Cloud3D key={i} at={[x, y + (i % 2) * 3, z + dz]} s={s} seed={seed} color={c} shade={sh} />
			))}
		</group>
	);
};

/** The school field: the pitch, a goal, the school behind, trees. */
const Field: React.FC = () => (
	<group>
		<Pitch3 />
		<Box size={[0.12, 0.02, 40]} at={[10, 0.012, 0]} color="#F2F2F2" outline={0} />
		<Box size={[0.12, 0.02, 40]} at={[-10, 0.012, 0]} color="#F2F2F2" outline={0} />
		<group position={[0, 0, -24]}>
			<Box size={[30, 7, 4]} at={[0, 3.5, 0]} color="#C98A6A" />
			{[...Array(10)].map((_, i) =>
				[0, 1].map((r) => <Glow key={`${i}${r}`} shape={{kind: 'box', w: 1.4, h: 1.6, d: 0.02}} color="#CFE6F5" position={[-12 + i * 2.7, 2.2 + r * 2.8, 2.02]} />),
			)}
		</group>
		{[[-18, -14], [18, -12], [-22, 6], [22, 8]].map(([x, z], i) => (
			<Tree key={i} at={[x, 0, z]} s={1.6} />
		))}
	</group>
);

const TEAM: Array<{who: keyof typeof P6; base: V3}> = [
	{who: 'kid1', base: [-4, 0, -2]},
	{who: 'kid2', base: [-1, 0, 1]},
	{who: 'kid3', base: [2, 0, -1]},
	{who: 'kid4', base: [4, 0, 2]},
	{who: 'kid5', base: [-3, 0, 3]},
	{who: 'kid6', base: [1.5, 0, 4]},
	{who: 'friend', base: [0, 0, -0.5]},
];

const playerAt = (base: V3, i: number, frame: number): {p: V3; turn: number} => {
	const a = frame * 0.03 + i * 1.7;
	const p: V3 = [base[0] + Math.sin(a) * 1.6, 0, base[2] + Math.cos(a * 0.8) * 1.2];
	return {p, turn: Math.atan2(Math.cos(a) * 1.6, -Math.sin(a * 0.8) * 0.96)};
};

const Players: React.FC<{frame: number; stop?: number; flee?: number}> = ({frame, stop, flee = 0}) => (
	<group>
		{TEAM.map((t, i) => {
			const f = stop === undefined ? frame : Math.min(frame, stop);
			const {p, turn} = playerAt(t.base, i, f);
			const fp: V3 = [p[0] * (1 - flee * 0.3), 0, p[2] - flee * 14];
			const running = stop === undefined || frame < stop || flee > 0;
			return <Hero3D key={t.who} who={P6[t.who]} position={flee > 0 ? fp : p} turn={flee > 0 ? Math.PI : turn} walk={running ? frame / 9 + i : undefined} run={running} face={flee > 0 ? 'scared' : 'happy'} lite={i < 6} />;
		})}
	</group>
);

const ballAt = (frame: number): V3 => [Math.sin(frame * 0.045) * 3.5, 0.11 + Math.abs(Math.sin(frame * 0.09)) * 0.4, Math.cos(frame * 0.035) * 2];

// ---------------------------------------------------------------- storm

export const Storm: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const friends = cue(l0, 'Your friends');
	const watch = cue(l0, "and you've come");
	const dark = cue(l0, 'Halfway through');
	const thunder = cue(l0, 'Thunder rumbles');
	const nobody = cue(l0, 'And nobody');
	const cuts = [0, friends - 4, watch - 4, dark - 4, thunder - 4, nobody - 4];
	const d = span(frame, dark, dark + 40);
	const stormy = frame >= dark;
	const flash = frame >= thunder && frame < thunder + 5;
	const you: V3 = [10.8, 0, 3];
	const turn = -Math.PI / 2;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [0, 1, 0], dist: 18, yaw: 25, pitch: 16, fov: 44},
					{at: [0, 1, 1], dist: 9, yaw: -15, pitch: 10, fov: 42},
					{at: [10.8, 1.2, 3], dist: 3.6, yaw: -70, pitch: 6, fov: 38},
					{at: [2, 4, -2], dist: 20, yaw: 15, pitch: 10, fov: 46},
					{at: [0, 3, -4], dist: 16, yaw: -20, pitch: 6, fov: 46},
					{at: [0, 1, 1], dist: 8, yaw: 30, pitch: 10, fov: 42},
				]}
				light={flash ? LIGHT.flash : stormy ? LIGHT.storm : LIGHT.match}
				bg={flash ? BG.flash : stormy ? BG.storm : BG.day}
				far={
					<group>
						<Field />
						<StormClouds dark={d} />
						{flash ? <Bolt3D from={[-30, 24, -60]} to={[-26, 0, -60]} seed={5} r={0.25} /> : null}
					</group>
				}
				near={
					<group>
						<Players frame={frame} />
						<Ball3D at={ballAt(frame)} spin={frame * 0.3} />
						<Hero3D position={you} turn={turn} face={stormy ? 'scared' : 'happy'} look={stormy ? [0, 0.5] : [0, 0]} />
						<BackSword pos={you} turn={turn} />
						<ShoulderBook pos={you} turn={turn} frame={frame} side={1} />
					</group>
				}
				blur={0}
				overlay={() => <AbsoluteFill>{flash ? <AbsoluteFill style={{background: 'rgba(255,255,255,0.35)'}} /> : null}<Label text="SATURDAY" x={960} y={220} frame={frame} at={6} until={friends - 6} size={50} color={UI.yellow} /></AbsoluteFill>}
			/>
			<Sound name="crowd" at={friends} volume={0.18} />
			<Sound name="boom" at={thunder} volume={0.5} />
		</>
	);
};

// ---------------------------------------------------------------- count

export const Count6: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const flashAt = cue(l0, 'a flash');
	const counting = cue(l0, 'and you start');
	const nums = ['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.'].map((w) => cue(l0, w));
	const hits = cue(l0, 'Then the thunder');
	const trick = cue(l0, "That's a real trick");
	const light = cue(l0, 'Light reaches');
	const so = cue(l0, 'So six seconds');
	const closer = cue(l0, "And it's getting");
	const cuts = [0, counting - 4, hits - 4, trick - 4, so - 4, closer - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const you: V3 = [10.8, 0, 3];
	const turn = -Math.PI / 2 - 0.5;
	const flashOn = frame >= flashAt + 4 && frame < flashAt + 10;
	const counted = nums.filter((n) => frame >= n).length;
	const fingers: [number, number] = counted > 0 ? [100 + counted * 6, 150] : [60, 110];
	const science = seg === 3 || seg === 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [-10, 6, -40], dist: 50, yaw: 20, pitch: 4, fov: 40},
					{at: [10.8, 1.35, 3], dist: 2.6, yaw: -105, pitch: 4, fov: 36},
					{at: [6, 2, 0], dist: 12, yaw: -30, pitch: 8, fov: 44},
					{at: [6, 2, 0], dist: 14, yaw: -50, pitch: 8, fov: 44},
					{at: [6, 2, 0], dist: 14, yaw: -40, pitch: 8, fov: 44},
					{at: [0, 6, -20], dist: 34, yaw: -15, pitch: 6, fov: 44, ddist: -6},
				]}
				light={flashOn ? LIGHT.flash : LIGHT.storm}
				bg={flashOn ? BG.flash : BG.storm}
				far={
					<group>
						<Field />
						{[[-40, -70, 14], [-10, -80, 18], [25, -72, 15], [55, -78, 17]].map(([x, z, r], i) => (
							<T key={i} shape={{kind: 'sphere', r: r as number}} scale={[1.6, 0.5, 1]} color="#4A6A5A" position={[x as number, 0, z as number]} outline={0.1} />
						))}
						<StormClouds dark={1} z={seg === 5 ? lerp(-60, -30, span(frame, closer, dur)) : -60} y={20} />
						{flashOn ? <Bolt3D from={[-14, 22, -62]} to={[-12, 2, -64]} seed={7} r={0.3} /> : null}
					</group>
				}
				near={
					<group>
						<Players frame={frame} />
						<Ball3D at={ballAt(frame)} spin={frame * 0.3} />
						<Hero3D position={you} turn={turn} face={frame >= hits ? 'shocked' : 'determined'} armR={fingers} reachR={20} look={[0, 0.3]} />
						<BackSword pos={you} turn={turn} />
						<ShoulderBook pos={you} turn={turn} frame={frame} side={-1} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{flashOn ? <AbsoluteFill style={{background: 'rgba(255,255,255,0.3)'}} /> : null}
						{seg === 1 ? nums.map((n, i) => <Big key={i} text={String(i + 1)} x={1300 + (i % 3) * 140} y={260 + Math.floor(i / 3) * 150} size={120} frame={frame} at={n} color={UI.cream} />) : null}
						{seg === 2 ? <Big text="BOOM!" x={960} y={300} size={180} frame={frame} at={hits + 2} color={UI.yellow} rotate={-6} /> : null}
						{science ? (
							<Panel frame={frame} at={trick + 4} x={960} y={540} w={1100} h={520} title="FLASH TO BANG">
								<svg viewBox="0 0 1100 456" width="100%" height="100%">
									<text x={60} y={90} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#FFD84A">⚡ LIGHT: ALMOST INSTANT</text>
									<text x={60} y={170} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#7FE0FF">🔊 SOUND: ABOUT 1 KM EVERY 3 SECONDS</text>
									<line x1={60} y1={260} x2={1040} y2={260} stroke="#5A5A8A" strokeWidth={6} />
									{[0, 1, 2].map((k) => (
										<g key={k}>
											<line x1={60 + k * 490} y1={245} x2={60 + k * 490} y2={275} stroke="#F2EEFF" strokeWidth={5} />
											<text x={60 + k * 490} y={315} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#F2EEFF">{k} KM</text>
										</g>
									))}
									<circle cx={60 + Math.min(980, span(frame, light + 10, so - 10, (v) => v) * 980)} cy={260} r={20} fill="#7FE0FF" stroke="#140A28" strokeWidth={4} />
									{frame >= so ? <text x={550} y={410} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#FFD84A">6 SECONDS ÷ 3 = 2 KM</text> : null}
								</svg>
							</Panel>
						) : null}
						{seg === 5 ? <Big text="GETTING CLOSER" x={960} y={860} size={90} frame={frame} at={closer + 6} color={UI.red} /> : null}
					</AbsoluteFill>
				)}
			/>
			{nums.map((n, i) => (
				<Sound key={i} name="tick" at={n} volume={0.3} />
			))}
			<Sound name="boom" at={hits} volume={0.6} />
			<Sound name="pop" at={trick + 4} volume={0.3} />
			<Sound name="boom" at={closer + 10} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- thunder

export const Thunder: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const bolt = cue(l0, 'A bolt of lightning');
	const five = cue(l0, 'about five times');
	const strike = cue(l0, 'And it can strike');
	const rule = cue(l0, 'The real rule');
	const roars = cue(l0, 'When thunder roars');
	const cuts = [0, bolt - 4, five - 4, strike - 4, rule - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const boltOn = (frame % 50) < 6 || seg === 1;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [0, 1.4, 0], dist: 4, yaw: 0, pitch: 4, fov: 40},
					{at: [-1.2, 3, 0], dist: 9, yaw: 10, pitch: 4, fov: 40},
					{at: [0, 3, 0], dist: 11, yaw: 0, pitch: 4, fov: 44},
					{at: [0, 3, 0], dist: 11, yaw: 0, pitch: 4, fov: 44},
					{at: [0, 1.3, 0], dist: 3.4, yaw: -10, pitch: 4, fov: 38},
				]}
				light={LIGHT.storm}
				bg={BG.storm}
				far={
					<group>
						<Ground color="#2E2A44" size={80} />
						<StormClouds dark={1} z={-20} y={14} />
					</group>
				}
				near={
					<group>
						{seg === 0 || seg === 4 ? (
							<group>
								<Hero3D position={[0, 0, 0]} face={seg === 4 ? 'determined' : 'scared'} armL={seg === 4 ? [150, 170] : undefined} look={[0, 0.4]} />
								<BackSword pos={[0, 0, 0]} turn={0} />
							</group>
						) : null}
						{seg === 1 || seg === 2 ? (
							<group>
								<Bolt3D from={[-3, 8, 0]} to={[-2.6, 0, 0]} seed={11} r={0.12} fade={seg === 2 ? 0 : 0} />
								<Glow shape={{kind: 'sphere', r: 0.9, seg: 32}} color="#FFD84A" position={[2.2, 3, 0]} />
								<Glow shape={{kind: 'sphere', r: 1.3, seg: 32}} color="#FFB84A" position={[2.2, 3, 0]} opacity={0.3} />
							</group>
						) : null}
						{seg === 3 ? <Bolt3D from={[-7, 12, -6]} to={[-4, 0, -2]} seed={13} r={0.14} fade={boltOn ? 0 : 0.6} /> : null}
					</group>
				}
				blur={0}
				overlay={(cam: Cam3) => {
					const [bx, by] = project(cam, [-2.8, 0.3, 0]);
					const [sx, sy] = project(cam, [2.2, 1.6, 0]);
					return (
						<AbsoluteFill>
							{seg === 1 || seg === 2 ? (
								<>
									<Label text="LIGHTNING ≈ 28,000 °C" x={bx} y={Math.min(860, by + 40)} frame={frame} at={bolt + 6} size={44} color={UI.cream} />
									<Label text="SUN'S SURFACE ≈ 5,500 °C" x={sx} y={Math.min(860, sy + 60)} frame={frame} at={bolt + 30} size={44} color={UI.yellow} />
								</>
							) : null}
							{seg === 2 ? <Big text="5× HOTTER" x={960} y={280} size={120} frame={frame} at={five + 6} color={UI.red} /> : null}
							{seg === 3 ? (
								<Panel frame={frame} at={strike + 2} x={1380} w={700} h={520} title="IT CAN STRIKE FAR FROM THE STORM">
									<svg viewBox="0 0 700 456" width="100%" height="100%">
										<circle cx={350} cy={228} r={200 * span(frame, strike + 8, strike + 40)} fill="rgba(255,90,90,0.18)" stroke="#FF5A5A" strokeWidth={5} strokeDasharray="14 10" />
										<ellipse cx={350} cy={228} rx={70} ry={40} fill="#4A4466" stroke="#140A28" strokeWidth={5} />
										<text x={350} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#fff">STORM</text>
										<line x1={350} y1={228} x2={550} y2={228} stroke="#FFD84A" strokeWidth={5} />
										<text x={460} y={212} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#FFD84A">16 KM</text>
									</svg>
								</Panel>
							) : null}
							{seg === 4 ? <Big text="WHEN THUNDER ROARS, GO INDOORS" x={960} y={860} size={74} frame={frame} at={roars + 2} color={UI.yellow} /> : null}
						</AbsoluteFill>
					);
				}}
			/>
			<Sound name="boom" at={bolt} volume={0.45} />
			<Sound name="pop" at={strike + 2} volume={0.3} />
			<Sound name="chime" at={roars + 2} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- strike

export const Strike: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const run = cue(l0, 'and they start');
	const flash = cue(l0, 'Then the sky');
	const towards = cue(l0, 'comes straight down');
	const think = cue(l0, "You don't even");
	const jump = cue(l0, 'You jump');
	const swing = cue(l0, 'and swing');
	const exactly = cue(l0, 'exactly the way');
	const hit = cue(l0, 'The lightning hits');
	const gone = cue(l0, "It's gone");
	const cancelled = cue(l0, 'Cancelled');
	const silence = l1.a;
	const rain = cue(l1, 'Then the rain');
	const staring = cue(l1, 'and everyone is');
	const fine = cue(l1, 'Your best friend');
	const cuts = [0, run - 4, flash - 4, towards - 4, think - 4, jump - 4, swing - 4, exactly - 4, hit - 4, gone - 4, silence - 4, rain - 4, staring - 4, fine - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const friend: V3 = [0, 0, 0];
	// You: from the touchline, running in, leaping up beside your friend.
	const runIn = span(frame, flash, jump, (v) => v);
	const leap = span(frame, jump, swing + 6);
	const fall = span(frame, cancelled + 10, silence + 10);
	const youX = lerp(lerp(7, 1.8, runIn), 0.9, leap);
	const youY = Math.max(0, Math.sin(leap * Math.PI * 0.5) * 1.1 * (1 - fall));
	const you: V3 = [youX, youY, 0.6];
	const turn = -Math.PI / 2 + 0.6 * leap;
	const overhead = frame >= swing;
	const arm: [number, number] = overhead ? [168, 174] : mixArm([12, 6], [80, 120], span(frame, 0, run));
	const reach = overhead ? 8 : 20;
	const hl = handAt(you, turn, arm, reach, -1);
	const hr = handAt(you, turn, arm, reach, 1);
	const grip: V3 = [(hl[0] + hr[0]) / 2, (hl[1] + hr[1]) / 2 + 0.05, (hl[2] + hr[2]) / 2];
	const tipY = grip[1] + 1.55;
	// The bolt: it grows slowly (slow motion) towards your friend; then it ends on your blade.
	const growing = span(frame, towards, hit, (v) => v);
	const target: V3 = frame >= swing ? [grip[0], tipY, grip[2]] : [0, 1.6, 0];
	const fade = span(frame, gone, cancelled + 4);
	const boltP = frame < hit ? 0.45 + growing * 0.5 : 1;
	const burstT = (frame - hit) / 30;
	const raining = frame >= rain;
	const flashOn = (frame >= flash && frame < flash + 5) || (frame >= hit && frame < hit + 4);
	const slow = frame >= towards && frame < hit;
	const hairUp = frame >= fine;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [7, 1.3, 1], dist: 3.0, yaw: -110, pitch: 6, fov: 38},
					{at: [0, 1, -2], dist: 14, yaw: 20, pitch: 10, fov: 44},
					{at: [0, 4, -2], dist: 16, yaw: -10, pitch: 12, fov: 46},
					{at: [0, 2.6, 0], dist: 4.5, yaw: 20, pitch: -25, fov: 64, dyaw: 0, ddist: 0},
					{at: [youX, 1.4, 0.6], dist: 2.6, yaw: -40, pitch: 4, fov: 36},
					{at: [0.8, 1.4, 0.3], dist: 6, yaw: 10, pitch: 4, fov: 42},
					{at: [0.9, 2.4, 0.6], dist: 5, yaw: 30, pitch: -10, fov: 46},
					{at: [0.9, 2.6, 0.6], dist: 3.6, yaw: -20, pitch: -16, fov: 46, dyaw: 30},
					{at: [0.9, 3.0, 0.6], dist: 7, yaw: 15, pitch: 0, fov: 48},
					{at: [0.9, 2.8, 0.6], dist: 5, yaw: -10, pitch: -4, fov: 44},
					{at: [0.4, 1.2, 0.3], dist: 9, yaw: 25, pitch: 8, fov: 42},
					{at: [0.4, 1.2, 0.3], dist: 6, yaw: -25, pitch: 6, fov: 42},
					{at: [0.4, 1.1, -2], dist: 10, yaw: 215, pitch: 25, fov: 44},
					{at: [0.4, 1.3, 0.2], dist: 3.4, yaw: -25, pitch: 4, fov: 36},
				]}
				light={flashOn ? LIGHT.flash : LIGHT.storm}
				bg={flashOn ? BG.flash : BG.storm}
				far={
					<group>
						<Field />
						<StormClouds dark={1} z={-26} y={20} />
					</group>
				}
				near={
					<group>
						{/* everyone else running for the school, then stopping to stare */}
						{TEAM.filter((t) => t.who !== 'friend').map((t, i) => {
							const go = span(frame, run, flash + 30);
							const stop = frame >= staring;
							const p: V3 = [t.base[0] * 1.4, 0, lerp(t.base[2], -9 - (i % 3), go)];
							return <Hero3D key={t.who} who={P6[t.who]} position={p} turn={stop ? 0.1 * (i - 3) : Math.PI} walk={!stop && go < 1 ? frame / 8 + i : undefined} run={!stop} face={stop ? 'shocked' : 'scared'} lite />;
						})}
						<Hero3D who={P6.friend} position={friend} turn={0.4} face={hairUp ? 'happy' : frame >= towards ? 'scared' : 'neutral'} look={frame >= towards && frame < hit ? [0, 0.8] : [0, 0]} armL={frame >= towards && frame < hit + 20 ? [150, 30] : undefined} armR={frame >= towards && frame < hit + 20 ? [150, 30] : undefined} />
						{hairUp ? (
							<group position={[0, 1.62, 0]}>
								{[...Array(9)].map((_, i) => {
									const a = (i / 9) * Math.PI * 2;
									return <T key={i} shape={{kind: 'cone', r: 0.06, h: 0.28}} color="#2A1E2E" position={[Math.cos(a) * 0.16, 0.14, Math.sin(a) * 0.16]} rotation={[Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4]} outline={0.008} />;
								})}
								<Smoke at={[0, 0.3, 0]} frame={frame} amount={0.5} r={0.18} n={5} rise={0.5} color="#6A6A80" />
							</group>
						) : null}
						<Hero3D position={you} turn={turn} armL={arm} armR={arm} reachL={reach} reachR={reach} fists={overhead} face={frame >= hit ? 'determined' : frame >= towards ? 'shocked' : 'scared'} talk={frame < run + 10 ? 0.8 : 0} look={overhead ? [0, 0.8] : [0, 0]} aura={overhead && frame < silence ? '#5A3A9A' : undefined} />
						{overhead ? <HeldSword grip={grip} turn={turn} tilt={0} frame={frame} smoke={frame < silence ? 1 : 0.3} glow={frame >= hit && frame < cancelled ? 1 : 0} /> : <BackSword pos={you} turn={turn} />}
						{frame < hit + 2 ? <ShoulderBook pos={[you[0], 0, you[2]]} turn={turn} frame={frame} side={-1} open={overhead ? 0.4 : 0} smoke={overhead ? 1 : 0.5} /> : null}
						{frame >= flash + 2 && frame < cancelled + 6 ? <Bolt3D from={[-3, 17, -6]} to={target} p={boltP} seed={21} r={0.14} fade={fade} /> : null}
						{burstT > 0 && burstT < 1 ? <Burst3D at={[grip[0], tipY, grip[2]]} t={burstT} n={30} r={3} /> : null}
						{raining ? <Rain frame={frame} center={[0, 0]} /> : null}
					</group>
				}
				blur={0}
				grade={slow ? 'saturate(0.7) contrast(1.1)' : undefined}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						{flashOn ? <AbsoluteFill style={{background: 'rgba(255,255,255,0.45)'}} /> : null}
						<Says cam={cam} head={top(you[0], you[2])} text="GET INSIDE!" frame={frame} at={6} until={run + 20} />
						{seg === 6 || seg === 7 ? <Big text="1,000 PRACTICE SWINGS" x={960} y={870} size={70} frame={frame} at={exactly} color="#B89AFF" /> : null}
						{seg === 9 ? <Big text="CANCELLED." x={960} y={300} size={150} frame={frame} at={cancelled} color="#B89AFF" /> : null}
						{hairUp ? <Thought cam={cam} head={top(0, 0, 0.3)} text="…whoa." frame={frame} at={fine + 30} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="boom" at={flash} volume={0.5} />
			<Sound name="whoosh" at={jump} volume={0.45} />
			<Sound name="swish" at={swing + 4} volume={0.5} />
			<Sound name="timestop" at={towards} volume={0.25} />
			<Sound name="boom" at={hit} volume={0.7} />
			<Sound name="vanish" at={gone} volume={0.5} />
			<Sound name="rain" at={rain} volume={0.25} loop={dur - rain} />
		</>
	);
};

// ---------------------------------------------------------------- odds

export const Odds: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const us = cue(l0, 'In the United States');
	const life = cue(l0, 'But over a whole');
	const safest = cue(l0, "That's why");
	const cuts = [0, us - 4, life - 4, safest - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[{at: [-0.9, 1.2, 0], dist: 3.6, yaw: 15, pitch: 6, fov: 38}, {at: [-1.6, 1.2, 0], dist: 4.4, yaw: 10, pitch: 6, fov: 40}, {at: [-1.6, 1.2, 0], dist: 4.4, yaw: -5, pitch: 6, fov: 40}, {at: [0, 1.2, 0], dist: 3.0, yaw: 10, pitch: 4, fov: 36}]}
				light={LIGHT.storm}
				bg={BG.storm}
				far={
					<group>
						<Ground color="#2E2A44" size={80} />
						<T shape={{kind: 'cyl', r: 2.2, h: 0.2}} color="#3E2F96" position={[0, 0.1, 0]} outline={0.02} />
					</group>
				}
				near={
					<group position={[0, 0.2, 0]}>
						<Hero3D position={[0, 0, 0]} face={seg === 3 ? 'smug' : 'neutral'} armR={[30, 70]} reachR={30} armL={seg === 3 ? [20, 40] : undefined} />
						<Umbrella3D at={[0.3, 1.95, 0.05]} color="#7F5AF0" />
						<BackSword pos={[0, 0, 0]} turn={0} />
						<Rain frame={frame} area={4} n={160} top={6} />
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{seg === 1 || seg === 2 ? (
							<Panel frame={frame} at={us} x={1340} w={820} h={560} title="NATIONAL WEATHER SERVICE (US)">
								<svg viewBox="0 0 820 496" width="100%" height="100%">
									{[...Array(12 * 6)].map((_, i) => {
										const x = 60 + (i % 12) * 60;
										const y = 40 + Math.floor(i / 12) * 44;
										const lit = i === 41;
										return (
											<g key={i}>
												<circle cx={x} cy={y} r={12} fill={lit ? '#FFD84A' : '#5A5A8A'} />
												<rect x={x - 10} y={y + 12} width={20} height={16} rx={6} fill={lit ? '#FFD84A' : '#5A5A8A'} />
											</g>
										);
									})}
									<text x={410} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#F2EEFF">ONE YEAR: ~1 IN 1,200,000</text>
									{seg === 2 ? <text x={410} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#FFD84A">LIFETIME: ~1 IN 15,300</text> : null}
								</svg>
							</Panel>
						) : null}
						{seg === 3 ? <Big text="DON'T RELY ON LUCK" x={960} y={860} size={90} frame={frame} at={safest + 6} color={UI.yellow} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={us} volume={0.3} />
			<Sound name="pop" at={life} volume={0.3} />
			<Sound name="rain" at={0} volume={0.12} loop={dur} />
		</>
	);
};

// ---------------------------------------------------------------- faraday

export const Faraday: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const plane = cue(l0, 'A passenger plane');
	const runs = cue(l0, 'The electricity runs');
	const cage = cue(l0, "It's called a Faraday");
	const built = cue(l0, 'who built a room');
	const blasted = cue(l0, 'blasted the outside');
	const showed = cue(l0, 'and showed');
	const cars = cue(l0, 'Cars work');
	const metal = cue(l0, "It's the metal");
	const cuts = [0, plane - 4, runs - 4, cage - 4, built - 4, showed - 4, cars - 4, metal - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const planeScene = seg >= 1 && seg <= 3;
	const room = seg === 4 || seg === 5;
	const car = seg >= 6;
	const px = lerp(-14, 14, span(frame, plane - 4, cage + 30, (v) => v));
	const skin = span(frame, runs, runs + 10) * (1 - span(frame, cage, cage + 20));
	const zap = (k: number) => (frame + k * 7) % 22 < 5;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [0, 1.4, 0], dist: 3.2, yaw: 10, pitch: 4, fov: 38},
					{at: [px, 20, 0], dist: 30, yaw: 20, pitch: 4, fov: 44, ddist: 0, dyaw: 0},
					{at: [px, 20, 0], dist: 20, yaw: 30, pitch: 6, fov: 44, ddist: 0, dyaw: 0},
					{at: [px, 20, 0], dist: 24, yaw: -20, pitch: 4, fov: 44, ddist: 0, dyaw: 0},
					{at: [0, 1.4, 0], dist: 7, yaw: 25, pitch: 10, fov: 42},
					{at: [0, 1.2, 0.4], dist: 3.6, yaw: 10, pitch: 6, fov: 40},
					{at: [0, 1.0, 0], dist: 8, yaw: 35, pitch: 10, fov: 42},
					{at: [0, 0.6, 0], dist: 6, yaw: 60, pitch: 6, fov: 40},
				]}
				light={LIGHT.sky}
				bg={BG.sky}
				far={
					<group>
						{planeScene ? (
							<group>
								<StormClouds dark={1} z={-30} y={16} />
								<Cloud3D at={[-10, 12, 20]} s={14} seed={3} color="#5A5478" shade="#3A3458" />
							</group>
						) : (
							<group>
								<Ground color="#2E2A44" size={80} />
								<StormClouds dark={1} z={-30} y={14} />
							</group>
						)}
					</group>
				}
				near={
					<group>
						{seg === 0 ? (
							<group>
								<Hero3D position={[0, 0, 0]} face="sad" armR={[40, 60]} reachR={20} />
								<HeldSword grip={handAt([0, 0, 0], 0, [40, 60], 20, 1)} tilt={150} frame={frame} />
							</group>
						) : null}
						{planeScene ? (
							<group>
								<Airliner3D at={[px, 20, 0]} rot={[0, 0, 0.03]} skin={skin} />
								{frame >= runs - 2 && frame < runs + 14 ? <Bolt3D from={[px + 4, 34, -4]} to={[px + 5.6, 20.3, 0]} seed={31} r={0.2} /> : null}
								{frame >= runs + 8 && frame < runs + 20 ? <Bolt3D from={[px - 5.6, 21, 0]} to={[px - 9, 6, 2]} seed={33} r={0.18} /> : null}
							</group>
						) : null}
						{room ? (
							<group>
								<T shape={{kind: 'box', w: 3, h: 2.6, d: 3}} color="#C9CED8" position={[0, 1.3, -0.4]} outline={0.03} emissive="#8A8A9A" emissiveIntensity={0.2} />
								<Glow shape={{kind: 'box', w: 2.2, h: 2.0, d: 0.02}} color="#2A2440" position={[0, 1.15, 1.11]} />
								<Hero3D who={P6.scientist} position={[0, 0, 1.0]} face={seg === 5 ? 'happy' : 'neutral'} armR={[60, 120]} reachR={30} />
								{seg >= 4 && frame >= blasted - 2
									? [0, 1, 2].map((k) => (zap(k) ? <Bolt3D key={k} from={[-3 + k * 3, 5, -2.5]} to={[-1.2 + k * 1.2, 2.6, -0.4]} seed={41 + k} r={0.06} /> : null))
									: null}
							</group>
						) : null}
						{car ? (
							<group>
								<Car3D at={[0, 0, 0]} yaw={Math.PI / 2} color="#E8453C" />
								<Hero3D who={P6.mum} position={[0.2, 0.3, -0.4]} turn={Math.PI / 2} height={1.2} lite face={seg === 7 ? 'happy' : 'neutral'} />
								{frame % 40 < 8 ? <Bolt3D from={[2, 14, -2]} to={[0.4, 1.65, 0]} seed={51} r={0.1} /> : null}
								{frame % 40 < 8 ? <Glow shape={{kind: 'box', w: 4.3, h: 0.08, d: 1.9}} color="#DCD8FF" position={[0, 1.0, 0]} opacity={0.6} /> : null}
							</group>
						) : null}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{seg === 0 ? <Label text="NO ANTI-MAGIC SWORDS IN REAL LIFE" x={960} y={870} frame={frame} at={6} size={44} /> : null}
						{seg === 1 ? <Big text="≈ ONCE A YEAR" x={960} y={860} size={96} frame={frame} at={plane + 30} color={UI.yellow} /> : null}
						{seg === 2 ? <Label text="IT RUNS ALONG THE METAL SKIN…" x={960} y={860} frame={frame} at={runs + 6} size={48} color={UI.cyan} /> : null}
						{seg === 3 ? <Big text="FARADAY CAGE" x={960} y={860} size={100} frame={frame} at={cage + 4} color="#B89AFF" /> : null}
						{room ? <Label text="MICHAEL FARADAY · 1836" x={960} y={220} frame={frame} at={built + 2} size={48} color={UI.yellow} /> : null}
						{seg === 5 ? <Big text="NO CHARGE INSIDE" x={960} y={860} size={90} frame={frame} at={showed + 6} color={UI.green} /> : null}
						{seg === 6 ? <Label text="CARS: THE SAME" x={960} y={220} frame={frame} at={cars + 2} size={48} /> : null}
						{seg === 7 ? <Big text="THE METAL, NOT THE TYRES" x={960} y={860} size={84} frame={frame} at={metal + 4} color={UI.yellow} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="boom" at={runs} volume={0.45} />
			<Sound name="pop" at={cage + 4} volume={0.3} />
			<Sound name="sizzle" at={blasted} volume={0.3} />
			<Sound name="chime" at={showed + 6} volume={0.3} />
			<Sound name="boom" at={cars + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- after

export const After: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const sinks = cue(l0, 'The sword sinks');
	const curls = cue(l0, 'and the book curls');
	const asleep = cue(l0, 'You fall asleep');
	const growing = cue(l0, 'Which, as it happens');
	const cuts = [0, sinks - 4, curls - 4, asleep - 4, growing - 4];
	const down = span(frame, sinks + 4, curls - 6, (v) => v);
	const flop = span(frame, 4, 24);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [-1, 0.9, -2.4], dist: 4.6, yaw: 35, pitch: 18, fov: 40},
					{at: [-0.3, 1.0, -1.4], dist: 2.2, yaw: 40, pitch: 20, fov: 38},
					{at: [-1, 0.8, -1.8], dist: 2.8, yaw: 20, pitch: 28, fov: 38},
					{at: [-1, 0.8, -2.6], dist: 3.0, yaw: 60, pitch: 30, fov: 40},
					{at: [-1, 1.0, -2.4], dist: 5.0, yaw: 25, pitch: 20, fov: 42, dyaw: 8},
				]}
				light={LIGHT.night}
				bg={BG.night}
				far={
					<Room3 look={ROOM3.bedroom} window={{x: 1.4, night: true}}>
						<Shelf3 at={[-3.8, 2, -4.3]} />
						<Poster3 at={[-1.0, 2.4, -4.35]} color="#2E8AE8" accent="#FFD84A" />
						<Bed3 at={[-1.0, 0, -2.6]} />
					</Room3>
				}
				near={
					<group>
						<group position={[-1.0, lerp(0.9, 0.75, flop), -2.85]} rotation={[lerp(-0.2, -Math.PI / 2, flop), 0, 0]}>
							<Hero3D position={[0, -0.8, 0]} face={frame >= asleep ? 'happy' : 'sad'} blink={frame >= asleep ? 1 : undefined} armL={[40, 20]} armR={[40, 20]} />
						</group>
						{frame < curls - 4 ? (
							<group>
								<Grimoire3D at={[-0.1, 0.8, -1.2]} rot={[-1.2, 0.4, 0]} frame={frame} open={1} smoke={0.5} />
								{frame < curls - 6 ? <HeldSword grip={[-0.1, lerp(1.9, 0.85, down), -1.2]} tilt={180} frame={frame} s={lerp(1, 0.2, down)} /> : null}
							</group>
						) : (
							<group position={[-1.0, 0.82, -1.68]} rotation={[0, 0.4, 0]}>
								<Grimoire3D at={[0, 0.1, 0]} rot={[-Math.PI / 2 + 0.25, 0, Math.sin(frame * 0.05) * 0.05]} frame={frame} open={0.08 + Math.sin(frame * 0.12) * 0.04} s={0.9} smoke={0} />
								<Smoke at={[0.2, 0.25, 0.1]} frame={frame} amount={0.5} r={0.1} n={4} rise={0.6} />
							</group>
						)}
					</group>
				}
				blur={0}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						<Thought cam={cam} head={[-1.0, 0.9, -3.3]} text="Zzz…" frame={frame} at={asleep + 10} />
						<Big text="MUSCLES GROWING…" x={960} y={860} size={90} frame={frame} at={growing + 10} color={UI.green} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="thud" at={14} volume={0.35} />
			<Sound name="vanish" at={sinks + 10} volume={0.3} />
			<Sound name="chime" at={growing + 10} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- twist

/** The inside of the front cover, with the library card pocket and the stamp. */
const Stamp: React.FC<{frame: number; at: number; until: number}> = ({frame, at, until}) => {
	const p = span(frame, at, at + 12) * (1 - span(frame, until, until + 8));
	if (p <= 0) {
		return null;
	}
	const thump = span(frame, at + 22, at + 28);
	return (
		<AbsoluteFill style={{background: `rgba(10,6,30,${0.5 * p})`}}>
			<div style={{position: 'absolute', left: 960, top: 545, width: 640, height: 760, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p}) rotate(-2deg)`, opacity: p, background: 'linear-gradient(160deg, #EADBB4, #D8C49A)', borderRadius: 8, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', padding: 40, fontFamily: 'Georgia, serif', color: '#3A2A1A'}}>
				<div style={{fontSize: 30, textAlign: 'center', letterSpacing: 2}}>— PROPERTY OF —</div>
				<div style={{fontSize: 52, fontWeight: 700, textAlign: 'center', marginTop: 6}}>CLOVER LANE LIBRARY</div>
				<div style={{margin: '40px auto 0', width: 420, height: 420, background: '#F7F0DC', border: '3px solid #8A6A4A', padding: 24, position: 'relative'}}>
					<div style={{fontSize: 30, fontWeight: 700, borderBottom: '2px solid #8A6A4A', paddingBottom: 8}}>DATE DUE</div>
					{['', '', ''].map((_, i) => (
						<div key={i} style={{height: 50, borderBottom: '1px solid #C8B08A'}} />
					))}
					<div
						style={{
							position: 'absolute',
							left: 40,
							top: 110,
							transform: `rotate(-8deg) scale(${1.6 - thump * 0.6})`,
							opacity: thump,
							border: '6px solid #C8303A',
							color: '#C8303A',
							padding: '10px 18px',
							fontFamily: FONT,
							fontWeight: 700,
							fontSize: 40,
							lineHeight: 1.1,
							textAlign: 'center',
						}}
					>
						DUE BACK
						<br />3 MAR 1626
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Twist: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const lady = cue(l0, 'On the doorstep');
	const hides = cue(l0, 'The book hides');
	const reaches = cue(l0, 'She reaches');
	const clover = cue(l0, 'Clover Lane');
	const overdue = l1.a;
	const calc = cue(l1, "And she's brought");
	const cuts = [0, lady - 4, hides - 4, reaches - 4, overdue - 4, calc - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const you: V3 = [0, 0, 3.8];
	const her: V3 = [0.15, 0, 5.3];
	const hide = span(frame, hides, hides + 14);
	const bookPos: V3 = [lerp(0.62, 0.05, hide), lerp(1.55, 1.1, hide), lerp(3.65, 3.62, hide)];
	const calcOn = frame >= calc;
	const herHand = handAt(her, Math.PI - 0.55, [30, 80], 50, 1, false, 1.5);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [0, 2.6, 3], dist: 13, yaw: 10, pitch: 8, fov: 42},
					{at: [0.1, 1.2, 4.55], dist: 3.6, yaw: 100, pitch: 4, fov: 38},
					{at: [0, 1.2, 3.8], dist: 2.6, yaw: -35, pitch: 4, fov: 38},
					{at: [0.1, 1.2, 4.55], dist: 3.2, yaw: 104, pitch: 6, fov: 38},
					{at: [0.1, 1.25, 4.55], dist: 3.8, yaw: 96, pitch: 4, fov: 38},
					{at: [0.15, 1.25, 4.9], dist: 2.4, yaw: 95, pitch: 4, fov: 36},
				]}
				light={LIGHT.home}
				bg={BG.home}
				far={
					<group>
						<Ground color="#5CB860" size={160} />
						<Box size={[1.6, 0.03, 12]} at={[0, 0.015, 8]} color="#D8C8A8" outline={0} />
						<House door={1} />
						<Box size={[0.2, 0.2, 0.06]} at={[1.0, 1.3, 3.56]} color="#FFD84A" outline={0.006} />
					</group>
				}
				near={
					<group>
						<Hero3D position={you} turn={0.45} face={seg >= 4 ? 'shocked' : seg >= 2 ? 'scared' : 'neutral'} look={[0, 0.1]} />
						<Grimoire3D at={bookPos} rot={[0.05, 0, 0]} frame={frame} s={0.75} smoke={0.5} open={frame >= reaches + 10 && frame < overdue + 20 ? 0.6 : 0} />
						<Hero3D who={P6.librarian} position={her} turn={Math.PI - 0.55} height={1.5} face={seg >= 4 ? 'smug' : 'happy'} armR={frame >= reaches && frame < overdue ? [40, 60] : calcOn ? [30, 80] : [12, 6]} reachR={frame >= reaches && frame < overdue ? 70 : calcOn ? 50 : 0} armL={[30, 80]} reachL={40} />
						<Box size={[0.12, 0.08, 0.01]} at={handAt(her, Math.PI - 0.55, [30, 80], 40, -1, false, 1.5)} color="#F2F2F2" outline={0.004} />
						{calcOn ? <Calculator3D at={[herHand[0], herHand[1] + 0.06, herHand[2]]} rot={[-0.5, Math.PI, 0]} s={1.2} /> : null}
					</group>
				}
				blur={0}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						<Stamp frame={frame} at={clover - 6} until={overdue - 4} />
						<Big text="400 YEARS OVERDUE" x={960} y={860} size={96} frame={frame} at={overdue + 6} until={calc - 6} color={UI.red} />
						{calcOn ? <Says cam={cam} head={top(her[0], her[2], 0, false)} text="Now then…" frame={frame} at={calc + 10} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="ring" at={6} volume={0.4} />
			<Sound name="swish" at={hides + 4} volume={0.3} />
			<Sound name="thud" at={clover + 16} volume={0.4} />
			<Sound name="crunch" at={calc + 6} volume={0.2} />
		</>
	);
};

// ---------------------------------------------------------------- outro

export const Outro: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const power = cue(l0, 'And if your book');
	const tell = cue(l0, 'Tell me');
	const check = cue(l0, 'And if you ever');
	const cuts = [0, power - 4, tell - 4, check - 4];
	const you: V3 = [0, 0, 0];
	const turn = 0.3;
	const glimmer = span(frame, check + 30, check + 50);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [0, 1.3, 0], dist: 5.5, yaw: 20, pitch: 6, fov: 40, dyaw: 10},
					{at: [0.3, 1.5, 0], dist: 3.2, yaw: -10, pitch: 4, fov: 36},
					{at: [0, 1.2, 0], dist: 6.5, yaw: 30, pitch: 8, fov: 42},
					{at: [0.8, 0.1, 1.4], dist: 1.6, yaw: 25, pitch: 30, fov: 38, ddist: -0.5},
				]}
				light={LIGHT.sunset}
				bg={BG.sunset}
				far={<Park dusk />}
				near={
					<group>
						<Hero3D position={you} turn={turn} face="happy" armL={[150, 170]} />
						<BackSword pos={you} turn={turn} frame={frame} smoke={0.3} />
						<ShoulderBook pos={you} turn={turn} frame={frame} side={1} />
						<Clover3D at={[0.8, 0.12, 1.4]} n={5} s={0.1} glow={glimmer} />
						{glimmer > 0 ? <Smoke at={[0.8, 0.02, 1.4]} frame={frame} amount={glimmer * 0.6} r={0.12} n={5} rise={0.4} /> : null}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Big text="WOULD YOU?" x={960} y={250} size={140} frame={frame} at={12} until={check - 6} />
						<Label text="WHAT WOULD YOUR GRIMOIRE DO?" x={960} y={860} frame={frame} at={power + 4} until={tell - 6} size={50} color={UI.cream} />
						<Label text="TELL ME IN THE COMMENTS" x={960} y={860} frame={frame} at={tell + 2} until={check - 6} size={50} color={UI.yellow} />
						<Big text="CHECK UNDER IT FIRST…" x={960} y={860} size={80} frame={frame} at={check + 20} color="#B89AFF" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={12} volume={0.3} />
			<Sound name="appear" at={check + 32} volume={0.3} />
		</>
	);
};

