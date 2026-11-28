import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Count, Label, UI} from '../../../components/ui';
import {House} from '../../ep05/scenes/A';
import {Ground} from '../../../three/giant3d';
import {Banana3D, Burst3D, DeskFan3D, Grimoire3D, Scale3D} from '../../../three/grimoire3d';
import {Hero3D} from '../../../three/Hero3D';
import {Mri3D} from '../../../three/props3d';
import {CanvasPlane} from '../../../three/props3d2';
import {Bed3, Board3, Box, Chair3, Desk3, Door3, Lamp3, Plant3, Poster3, Room3, ROOM3, Shelf3, Table3} from '../../../three/sets3d';
import {project, type Cam3} from '../../../three/Stage3D';
import {Says, Shot3, Thought, type Angle3} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {BackSword, BG, HeldSword, LIGHT, P6, Panel, Park, ShoulderBook} from './kit';
import {handAt, mixArm, top, type V3} from './util';

// Part B: dragging the sword home, real sword weights, training, how muscles
// get stronger, finding out the sword cancels things, noise cancelling,
// antimatter, and the positrons in a banana.

// ---------------------------------------------------------------- heavy

/** A real medieval longsword (slim, steel), grip at the origin, blade along +y. */
const Longsword: React.FC<{at: V3; rot?: V3; s?: number}> = ({at, rot, s = 1}) => (
	<group position={at} rotation={rot} scale={s}>
		<T shape={{kind: 'cyl', r: 0.022, h: 0.24}} color="#5A3A2A" position={[0, -0.1, 0]} outline={0.006} />
		<T shape={{kind: 'sphere', r: 0.035}} color="#C9CED8" position={[0, -0.24, 0]} outline={0.006} />
		<T shape={{kind: 'box', w: 0.26, h: 0.03, d: 0.04}} color="#C9CED8" position={[0, 0.03, 0]} outline={0.006} />
		<T shape={{kind: 'box', w: 0.05, h: 0.9, d: 0.012}} color="#E8EEF6" position={[0, 0.5, 0]} outline={0.006} />
		<T shape={{kind: 'cone', r: 0.035, h: 0.1}} scale={[1, 1, 0.34]} color="#E8EEF6" position={[0, 1.0, 0]} rotation={[0, Math.PI / 4, 0]} outline={0.006} />
	</group>
);

const Sugar: React.FC<{at: V3}> = ({at}) => (
	<group position={at}>
		<T shape={{kind: 'box', w: 0.16, h: 0.24, d: 0.1}} color="#FFFFFF" position={[0, 0.12, 0]} outline={0.006} />
		<Box size={[0.162, 0.08, 0.102]} at={[0, 0.12, 0]} color="#2E8AE8" outline={0} />
	</group>
);

export const Heavy: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const groove = cue(l0, 'It leaves a groove');
	const thing = cue(l0, "Here's the thing");
	const light = cue(l0, 'Real ones');
	const most = cue(l0, 'Most medieval');
	const sugar = cue(l0, 'about as much as a bag');
	const slab = cue(l0, 'But a solid slab');
	const nine = cue(l0, "That's like swinging");
	const cuts = [0, groove - 4, thing - 4, light - 4, most - 4, sugar - 4, slab - 4, nine - 4];
	const studio = frame >= thing - 4;
	// Dragging: you walk towards the house (at z = -10), the sword's tip scraping behind you.
	const t = span(frame, 0, thing - 4, (v) => v);
	const z = lerp(4, -4.5, t);
	const you: V3 = [0, 0, z];
	const hand = handAt(you, Math.PI, [28, 20], -35, 1);
	const tip: V3 = [hand[0] + 0.15, 0.02, hand[2] + 1.45];
	const dx = tip[0] - hand[0];
	const dy = tip[1] - hand[1];
	const dz = tip[2] - hand[2];
	const tilt = (Math.acos(dy / Math.hypot(dx, dy, dz)) * 180) / Math.PI;
	let near: React.ReactNode;
	let far: React.ReactNode;
	let angles: Angle3[];
	let light3 = LIGHT.home;
	let bg = BG.home;
	if (!studio) {
		far = (
			<group>
				<Ground color="#5CB860" size={160} />
				<Box size={[1.6, 0.03, 16]} at={[0, 0.015, 0]} color="#D8C8A8" outline={0} />
				<Box size={[0.08, 0.035, Math.max(0.01, 4.6 - tip[2])]} at={[0.15, 0.03, (4.6 + tip[2]) / 2]} color="#4A3A2A" outline={0} />
				<group position={[0, 0, -10]}>
					<House door={1} />
				</group>
			</group>
		);
		near = (
			<group>
				<Hero3D position={you} turn={Math.PI} walk={frame / 22} armR={[28, 20]} reachR={-35} face="determined" lean={8} />
				<HeldSword grip={hand} turn={0} tilt={tilt} frame={frame} />
				<ShoulderBook pos={you} turn={Math.PI} frame={frame} side={-1} />
				<Hero3D who={P6.mum} position={[0.4, 0, -6.2]} face={frame > groove + 30 ? 'shocked' : 'neutral'} armL={[150, 165]} />
			</group>
		);
		angles = [
			{at: [0, 1, z - 2.5], dist: 10, yaw: 100, pitch: 12, fov: 42, ddist: 0, dyaw: 0},
			{at: [0.15, 0.2, tip[2] + 0.5], dist: 2.4, yaw: 30, pitch: 18, fov: 40, ddist: 0, dyaw: 0},
		];
	} else {
		light3 = LIGHT.studio;
		bg = BG.studio;
		const squash = span(frame, slab + 10, slab + 18);
		far = (
			<group>
				<Ground color="#2A2160" size={60} />
				<T shape={{kind: 'cyl', r: 2.6, h: 0.2}} color="#3E2F96" position={[0, 0.1, 0]} outline={0.02} />
			</group>
		);
		near = (
			<group>
				<Scale3D at={[-1.3, 0.2, 0]} needle={span(frame, most, most + 12) * 1.2} />
				<Longsword at={[-1.3, 0.5, 0]} rot={[0, 0, Math.PI / 2]} s={1} />
				<Scale3D at={[-0.3, 0.2, 0.2]} w={0.5} needle={span(frame, sugar, sugar + 12) * 1.0} />
				{frame >= sugar - 4 ? <Sugar at={[-0.3, 0.32, 0.2]} /> : null}
				{frame >= slab - 4 ? (
					<group>
						<Scale3D at={[1.0, 0.2, 0]} squash={squash} needle={squash * 6} />
						<HeldSword grip={[0.3, lerp(1.6, 0.42 - squash * 0.05, span(frame, slab, slab + 10, (v) => v * v)), 0]} turn={Math.PI / 2} tilt={90} frame={frame} />
					</group>
				) : null}
				{frame >= nine - 4 ? (
					<group>
						<Scale3D at={[2.3, 0.2, 0.1]} squash={0.3} needle={5} />
						<Hero3D who={P6.kid3} position={[2.3, 0.26, 0.1]} height={1.32} face="happy" armL={[150, 165]} armR={[150, 165]} />
					</group>
				) : null}
			</group>
		);
		angles = [
			{at: [-0.8, 0.6, 0], dist: 3.0, yaw: 10, pitch: 14, fov: 38},
			{at: [-1.3, 0.55, 0], dist: 2.0, yaw: 15, pitch: 18, fov: 36},
			{at: [-0.8, 0.5, 0.1], dist: 2.4, yaw: -10, pitch: 16, fov: 38},
			{at: [1.0, 0.55, 0], dist: 3.0, yaw: 10, pitch: 14, fov: 38},
			{at: [1.5, 0.75, 0], dist: 3.8, yaw: -8, pitch: 10, fov: 40},
		];
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={studio ? [angles[0], angles[0], angles[0], angles[0], angles[1], angles[2], angles[3], angles[4]] : [angles[0], angles[1], angles[1], angles[1], angles[1], angles[1], angles[1], angles[1]]}
				light={light3}
				bg={bg}
				far={far}
				near={near}
				blur={0}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						{!studio ? <Says cam={cam} head={top(0.4, -6.2)} text="WHERE did you get THAT?!" frame={frame} at={groove + 30} until={thing - 6} /> : null}
						{studio ? (
							<>
								<Label text="REAL SWORDS" x={960} y={220} frame={frame} at={light} until={slab - 6} size={48} color={UI.cream} />
								<Big text="1 – 1.5 KG" x={600} y={860} size={84} frame={frame} at={most + 10} until={slab - 6} color={UI.green} />
								<Label text="BAG OF SUGAR: 1 KG" x={1300} y={860} frame={frame} at={sugar + 8} until={slab - 6} size={44} />
								<Label text="YOUR SWORD" x={960} y={220} frame={frame} at={slab} size={48} color={UI.yellow} />
								<Big text="≈ 30 KG" x={760} y={860} size={96} frame={frame} at={slab + 16} color={UI.red} />
								<Label text="A 9-YEAR-OLD: ≈ 30 KG" x={1380} y={860} frame={frame} at={nine + 6} size={44} />
							</>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="crunch" at={4} volume={0.2} />
			<Sound name="crunch" at={groove} volume={0.25} />
			<Sound name="pop" at={most + 10} volume={0.3} />
			<Sound name="thud" at={slab + 10} volume={0.45} />
			<Sound name="crunch" at={slab + 12} volume={0.3} />
			<Sound name="pop" at={nine + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- train

export const Train: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const every = cue(l0, 'Every morning');
	const push = cue(l0, 'Push ups');
	const squat = cue(l0, 'Squats');
	const sprint = cue(l0, 'Sprints');
	const day1 = cue(l0, 'On day one');
	const day10 = cue(l0, 'By day ten');
	const day30 = cue(l0, 'And by day thirty');
	const cuts = [0, every - 4, push - 4, squat - 4, sprint - 4, day1 - 4, day10 - 4, day30 - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const you: V3 = [0, 0, 0];
	let hero: React.ReactNode;
	let extra: React.ReactNode = null;
	let angle: Angle3;
	if (seg <= 1) {
		hero = (
			<group>
				<Hero3D position={you} face="determined" armL={[160, 175]} armR={[160, 175]} hop={seg === 1 ? Math.abs(Math.sin(frame * 0.25)) * 0.3 : 0} />
				<BackSword pos={you} turn={0} />
				<ShoulderBook pos={you} turn={0} frame={frame} />
			</group>
		);
		angle = seg === 0 ? {at: [0, 1.2, 0], dist: 8, yaw: 30, pitch: 8, fov: 40} : {at: [0, 1.1, 0], dist: 3.6, yaw: -20, pitch: 6, fov: 38};
	} else if (seg === 2) {
		const up = (Math.sin(frame * 0.3) + 1) / 2;
		hero = (
			<group position={[0, 0.04, 0]}>
				<group position={[0, 0.08 + up * 0.25, 0]} rotation={[lerp(1.35, 1.15, up), 0, 0]}>
					<Hero3D position={[0, -0.05, 0]} armL={[8, 8]} armR={[8, 8]} reachL={lerp(95, 75, up)} reachR={lerp(95, 75, up)} headUp={60} face="determined" />
				</group>
				<BackSword pos={[0, 0.3, 0.9]} turn={0} />
			</group>
		);
		angle = {at: [0, 0.4, 0.5], dist: 3.0, yaw: 80, pitch: 8, fov: 38};
	} else if (seg === 3) {
		const dn = (Math.sin(frame * 0.28) + 1) / 2;
		hero = dn > 0.5 ? (
			<Hero3D position={[0, 0.3, 0]} sit armL={[8, 8]} armR={[8, 8]} reachL={90} reachR={90} face="determined" />
		) : (
			<Hero3D position={you} armL={[8, 8]} armR={[8, 8]} reachL={90} reachR={90} face="determined" />
		);
		angle = {at: [0, 0.9, 0], dist: 3.4, yaw: 55, pitch: 6, fov: 38};
	} else if (seg === 4) {
		const t = span(frame, sprint - 4, day1 - 4, (v) => v);
		const a = t * Math.PI * 1.2;
		const p: V3 = [Math.sin(a) * 6, 0, Math.cos(a) * 6 - 6];
		const turn = a + Math.PI / 2;
		hero = (
			<group>
				<Hero3D position={p} turn={turn} walk={frame / 10} run face="determined" />
				<BackSword pos={p} turn={turn} />
				<ShoulderBook pos={p} turn={turn} frame={frame} />
			</group>
		);
		angle = {at: [p[0], 1, p[2]], dist: 5, yaw: (turn * 180) / Math.PI + 40, pitch: 10, fov: 40, ddist: 0, dyaw: 0};
	} else {
		const day = seg - 5;
		const swing = day === 2 ? span(frame, day30 + 6, day30 + 30) : 0;
		const arm: [number, number] = day === 0 ? [20, 40] : day === 1 ? [25, 60] : mixArm([60, 90], [165, 172], swing);
		const reach = day === 0 ? 55 : day === 1 ? 70 : lerp(60, 10, swing);
		const hl = handAt([0, 0, 0], 0, arm, reach, -1);
		const hr = handAt([0, 0, 0], 0, arm, reach, 1);
		const grip: V3 = [(hl[0] + hr[0]) / 2, (hl[1] + hr[1]) / 2, (hl[2] + hr[2]) / 2];
		const tilt = day === 0 ? 112 + Math.sin(frame * 0.8) * 3 : day === 1 ? 88 + Math.sin(frame * 0.6) * 3 : lerp(80, -10, swing);
		hero = (
			<group>
				<Hero3D position={[0, 0, 0]} armL={arm} armR={arm} reachL={reach} reachR={reach} fists face={day === 2 ? 'happy' : 'determined'} lean={day === 0 ? 12 : 0} />
				<HeldSword grip={grip} tilt={tilt} frame={frame} smoke={day === 2 ? 0.6 : 0} />
				<ShoulderBook pos={[0, 0, 0]} turn={0} frame={frame} side={-1} />
			</group>
		);
		extra = null;
		angle = day === 2 ? {at: [0, 1.5, 0.3], dist: 5.0, yaw: 45, pitch: 8, fov: 42} : {at: [0, 1.0, 0.4], dist: 4.2, yaw: 50, pitch: 6, fov: 40};
	}
	const day = seg - 5;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[angle, angle, angle, angle, angle, angle, angle, angle]}
				light={LIGHT.dawn}
				bg={BG.dawn}
				far={<Park clover={false} />}
				near={
					<group>
						{hero}
						{extra}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="6:30 AM" x={1500} y={300} frame={frame} at={every + 2} until={push - 6} size={48} color={UI.yellow} />
						{seg === 2 ? <Count from={1} to={20} x={1500} y={300} size={90} frame={frame} at={push} dur={Math.max(10, squat - push - 6)} color={UI.cream} /> : null}
						{seg === 3 ? <Count from={1} to={30} x={1500} y={300} size={90} frame={frame} at={squat} dur={Math.max(10, sprint - squat - 6)} color={UI.cream} /> : null}
						{day >= 0 ? <Big text={['DAY 1', 'DAY 10', 'DAY 30'][day]} x={1500} y={300} size={110} frame={frame} at={cuts[5 + day] + 6} color={day === 2 ? UI.yellow : UI.cream} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="tick" at={push + 4} volume={0.2} />
			<Sound name="tick" at={squat + 4} volume={0.2} />
			<Sound name="run" at={sprint} volume={0.25} />
			<Sound name="thud" at={day1 + 10} volume={0.3} />
			<Sound name="whoosh" at={day30 + 10} volume={0.4} />
			<Sound name="chime" at={day30 + 30} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- muscles

/** The arm diagram: a nerve from the brain to the biceps, with signals racing down it; the muscle grows by `grow`. */
const ArmDiagram: React.FC<{frame: number; signals: number; grow: number}> = ({frame, signals, grow}) => {
	const pts = [[120, 60], [170, 120], [210, 210], [260, 260]];
	const path = 'M120 60 C 160 110, 200 170, 260 260';
	return (
		<svg viewBox="40 10 560 380" width="100%" height="100%">
			<circle cx={110} cy={70} r={52} fill="#FF8AD8" stroke="#140A28" strokeWidth={6} />
			<text x={110} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#140A28">BRAIN</text>
			{/* upper arm and forearm */}
			<rect x={200} y={240} width={300} height={90} rx={45} fill="#FF8A3D" stroke="#140A28" strokeWidth={6} />
			<rect x={450} y={120} width={86} height={210} rx={43} fill="#FF8A3D" stroke="#140A28" strokeWidth={6} transform="rotate(-10 493 330)" />
			<ellipse cx={350} cy={250} rx={95 + grow * 30} ry={42 + grow * 26} fill="#E8453C" stroke="#140A28" strokeWidth={6} />
			<text x={350} y={260 - grow * 4} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#fff">MUSCLE</text>
			<path d={path} stroke="#FFD84A" strokeWidth={8} fill="none" strokeLinecap="round" />
			{signals > 0
				? [0, 1, 2, 3].map((i) => {
						const t = ((frame * 0.03 + i * 0.25) % 1) * signals;
						const a = Math.min(pts.length - 1.001, t * (pts.length - 1));
						const j = Math.floor(a);
						const f = a - j;
						const x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f;
						const y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f;
						return <circle key={i} cx={x} cy={y} r={14} fill="#FFF6B0" stroke="#FFD84A" strokeWidth={4} />;
					})
				: null}
			<text x={210} y={150} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#FFD84A">NERVE</text>
		</svg>
	);
};

/** Bars for weeks 1–8: how much of the strength gain comes from the nerves (yellow) and from bigger muscle (red). */
const GainChart: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const weeks = [1, 2, 3, 4, 5, 6, 7, 8];
	return (
		<svg viewBox="0 0 760 520" width="100%" height="100%">
			{weeks.map((w, i) => {
				const p = span(frame, at + i * 4, at + i * 4 + 14);
				const total = (40 + w * 38) * p;
				const nerve = total * Math.max(0.25, 0.9 - i * 0.09);
				const x = 60 + i * 84;
				return (
					<g key={w}>
						<rect x={x} y={440 - nerve} width={60} height={nerve} fill="#FFD84A" stroke="#140A28" strokeWidth={4} />
						<rect x={x} y={440 - total} width={60} height={total - nerve} fill="#E8453C" stroke="#140A28" strokeWidth={4} />
						<text x={x + 30} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#F2EEFF">{w}</text>
					</g>
				);
			})}
			<text x={380} y={514} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#C8C0F0">WEEKS OF TRAINING</text>
			<rect x={70} y={20} width={26} height={26} fill="#FFD84A" stroke="#140A28" strokeWidth={3} />
			<text x={106} y={42} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#F2EEFF">NERVES</text>
			<rect x={300} y={20} width={26} height={26} fill="#E8453C" stroke="#140A28" strokeWidth={3} />
			<text x={336} y={42} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#F2EEFF">BIGGER MUSCLE</text>
		</svg>
	);
};

export const Muscles: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const when = cue(l0, 'When you start');
	const notBigger = cue(l0, "But at first");
	const in79 = cue(l0, 'In nineteen');
	const found = cue(l0, 'found that');
	const grows = cue(l0, 'The muscle itself');
	const rest = cue(l0, 'And it rebuilds');
	const cuts = [0, when - 4, notBigger - 4, in79 - 4, found - 4, grows - 4, rest - 4];
	const asleep = frame >= rest - 4;
	const lift = (Math.sin(frame * 0.12) + 1) / 2;
	const arm: [number, number] = [4, 8];
	const reachUp = lerp(70, 165, lift);
	const hl = handAt([-1.3, 0, 0], 0.3, arm, reachUp, -1);
	const hr = handAt([-1.3, 0, 0], 0.3, arm, reachUp, 1);
	const grip: V3 = [(hl[0] + hr[0]) / 2, (hl[1] + hr[1]) / 2, (hl[2] + hr[2]) / 2];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={asleep ? [{at: [0, 0.7, 0], dist: 3.4, yaw: 30, pitch: 30, fov: 40}] : [{at: [-0.6, 1.6, 0], dist: 5.2, yaw: 20, pitch: 6, fov: 42}, {at: [-0.9, 1.6, 0], dist: 5.6, yaw: 25, pitch: 6, fov: 42}]}
				light={asleep ? LIGHT.night : LIGHT.studio}
				bg={asleep ? BG.night : BG.studio}
				far={
					asleep ? (
						<Room3 look={ROOM3.bedroom} window={{x: 1.4, night: true}}>
							<Shelf3 at={[-3.8, 2, -4.3]} />
							<Poster3 at={[-1.0, 2.4, -4.35]} color="#2E8AE8" accent="#FFD84A" />
						</Room3>
					) : (
						<group>
							<Ground color="#2A2160" size={60} />
							<T shape={{kind: 'cyl', r: 2.2, h: 0.2}} color="#3E2F96" position={[-1.3, 0.1, 0]} outline={0.02} />
						</group>
					)
				}
				near={
					asleep ? (
						<group>
							<Bed3 at={[0, 0, 0]} />
							<group position={[0, 0.7, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
								<Hero3D position={[0, -0.8, 0]} face="happy" blink={1} armL={[20, 10]} armR={[20, 10]} />
							</group>
							<Grimoire3D at={[0.2, 0.75, 0.85]} rot={[-Math.PI / 2, 0, 0.3]} frame={frame} s={0.8} smoke={0.4} />
						</group>
					) : (
						<group position={[0, 0.2, 0]}>
							<Hero3D position={[-1.3, 0, 0]} turn={0.3} armL={arm} armR={arm} reachL={reachUp} reachR={reachUp} fists face="determined" />
							<HeldSword grip={[grip[0], grip[1] + 0.2, grip[2]]} turn={0.3} tilt={lerp(85, 5, lift)} frame={frame} />
						</group>
					)
				}
				blur={0}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						{!asleep ? (
							<>
								<Label text="STRONGER FAST" x={480} y={220} frame={frame} at={when + 8} until={in79 - 6} size={46} color={UI.green} />
								<Panel frame={frame} at={notBigger} until={in79 - 4} title="NOT BIGGER MUSCLES… YET">
									<ArmDiagram frame={frame} signals={0} grow={0} />
								</Panel>
								<Label text="MORITANI & DE VRIES · 1979" x={480} y={220} frame={frame} at={in79 + 4} until={rest - 6} size={42} color={UI.yellow} />
								<Panel frame={frame} at={in79 + 4} until={found + 30} title="FIRST WEEKS: YOUR NERVES LEARN">
									<ArmDiagram frame={frame} signals={1} grow={0} />
								</Panel>
								<Panel frame={frame} at={found + 30} until={rest - 4} title="WHERE THE STRENGTH COMES FROM">
									<GainChart frame={frame} at={found + 34} />
								</Panel>
								<Label text="LATER: THE MUSCLE GROWS" x={480} y={880} frame={frame} at={grows + 4} until={rest - 6} size={42} color={UI.red} />
							</>
						) : (
							<>
								<Thought cam={cam} head={[0, 1.1, -0.6]} text="Zzz…" frame={frame} at={rest + 4} />
								<Big text="REBUILT WHILE YOU REST" x={960} y={870} size={80} frame={frame} at={rest + 10} />
							</>
						)}
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={notBigger} volume={0.3} />
			<Sound name="pop" at={in79 + 4} volume={0.3} />
			<Sound name="pop" at={found + 30} volume={0.3} />
			<Sound name="chime" at={rest + 10} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- power

const NightRoom: React.FC<{lamp: boolean; fanSpin: number; fanOn: boolean; phoneOn: boolean}> = ({lamp, fanSpin, fanOn, phoneOn}) => (
	<Room3 look={ROOM3.bedroom} window={{x: 1.4, night: true}}>
		<Bed3 at={[-1.0, 0, -2.6]} />
		<Shelf3 at={[-3.8, 2, -4.3]} />
		<Poster3 at={[-1.0, 2.4, -4.35]} color="#2E8AE8" accent="#FFD84A" />
		<Plant3 at={[4.6, 0, -3.6]} />
		<Lamp3 at={[-2.4, 0, -3.9]} color={lamp ? '#FFD98A' : '#4A4060'} />
		{lamp ? <Glow shape={{kind: 'sphere', r: 0.5}} color="#FFD98A" position={[-2.4, 1.55, -3.9]} opacity={0.25} /> : null}
		<Door3 at={[3.6, 0, -4.38]} />
		<Desk3 at={[2.6, 0, -3.6]} />
		<DeskFan3D at={[2.6, 0.78, -3.7]} spin={fanSpin} on={fanOn ? 1 : 0} />
		<group position={[-0.8, 0.72, -2.3]} rotation={[0, 0.3, 0]}>
			<Box size={[0.36, 0.04, 0.7]} at={[0, 0, 0]} color="#2A2638" outline={0.01} />
			{phoneOn ? <Glow shape={{kind: 'box', w: 0.3, h: 0.01, d: 0.6}} color="#7FE0FF" position={[0, 0.03, 0]} /> : null}
		</group>
	</Room3>
);

const Notes: React.FC<{cam: Cam3; at: V3; frame: number; on: boolean}> = ({cam, at, frame, on}) => {
	if (!on) {
		return null;
	}
	const [x, y] = project(cam, at);
	return (
		<AbsoluteFill>
			{[0, 1, 2].map((i) => {
				const t = (frame * 0.02 + i / 3) % 1;
				return (
					<div key={i} style={{position: 'absolute', left: x + Math.sin(t * 6 + i) * 40 + (i - 1) * 50, top: y - 40 - t * 160, fontSize: 64, opacity: 1 - t, color: ['#7FE0FF', '#FFD84A', '#FF8AD8'][i], textShadow: '0 0 6px #140A28, 0 0 2px #140A28'}}>
						{i % 2 ? '♫' : '♪'}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

export const Power: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const fan = cue(l0, 'When the blade gets close');
	const fanStops = cue(l0, 'the fan stops');
	const phone = cue(l0, 'When it gets close');
	const music = cue(l0, 'the music cuts out');
	const lamp = cue(l0, 'When it touches');
	const lightOut = cue(l0, 'the light goes out');
	const pull = cue(l0, 'You pull');
	const doesnt = cue(l0, "The sword doesn't");
	const cancels = cue(l0, 'It cancels them');
	const cuts = [0, fan - 4, phone - 4, lamp - 4, pull - 4, doesnt - 4, cancels - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const back = frame >= pull + 6;
	const fanOn = frame < fanStops || back;
	const phoneOn = frame < music || back;
	const lampOn = frame < lightOut || back;
	const fanSpin = fanOn ? frame * 0.9 : fanStops * 0.9;
	// Where you stand and which way the blade points, per cut.
	const spots: Array<{p: V3; turn: number; tilt: number}> = [
		{p: [0.4, 0, -0.6], turn: 0.4, tilt: 30},
		{p: [2.6, 0, -2.3], turn: Math.PI, tilt: lerp(40, 72, span(frame, fan, fanStops))},
		{p: [-0.5, 0, -1.1], turn: Math.PI + 0.4, tilt: lerp(40, 75, span(frame, phone, music))},
		{p: [-2.1, 0, -2.7], turn: Math.PI + 0.25, tilt: lerp(40, 66, span(frame, lamp, lightOut))},
		{p: [0.2, 0, -1.4], turn: 0, tilt: 20},
		{p: [0.2, 0, -1.4], turn: 0, tilt: 10},
		{p: [0.2, 0, -1.4], turn: 0, tilt: 0},
	];
	const sp = spots[seg];
	const arm: [number, number] = sp.tilt > 25 ? [20, 30] : [30, 75];
	const reach = sp.tilt > 25 ? 70 : 40;
	const hand = handAt(sp.p, sp.turn, arm, reach, 1);
	const angles: Angle3[] = [
		{at: [0, 1.2, -1.6], dist: 6.5, yaw: 15, pitch: 12, fov: 44},
		{at: [2.5, 0.9, -3.0], dist: 3.2, yaw: 90, pitch: 36, fov: 42},
		{at: [-0.65, 0.8, -1.7], dist: 3.0, yaw: 85, pitch: 40, fov: 42},
		{at: [-2.3, 1.0, -3.3], dist: 3.4, yaw: 60, pitch: 40, fov: 42},
		{at: [0, 1.2, -2.2], dist: 6.5, yaw: 0, pitch: 10, fov: 44},
		{at: [0.2, 1.4, -1.4], dist: 2.6, yaw: 10, pitch: 4, fov: 36},
		{at: [0.2, 1.5, -1.4], dist: 2.0, yaw: -10, pitch: 2, fov: 34, ddist: -0.2},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={lampOn ? LIGHT.bedroom : LIGHT.night}
				bg={BG.bedroom}
				far={<NightRoom lamp={lampOn} fanSpin={fanSpin} fanOn={fanOn} phoneOn={phoneOn} />}
				near={
					<group>
						<Hero3D position={sp.p} turn={sp.turn} armR={arm} reachR={reach} face={seg >= 5 ? 'shocked' : seg === 0 ? 'neutral' : 'shocked'} />
						<HeldSword grip={hand} turn={sp.turn} tilt={sp.tilt} frame={frame} smoke={0.4} glow={seg >= 6 ? 1 : 0} />
						<ShoulderBook pos={sp.p} turn={sp.turn} frame={frame} side={-1} smoke={0.4} />
						{frame >= fanStops && frame < fanStops + 14 ? <Burst3D at={[2.6, 1.15, -3.6]} t={(frame - fanStops) / 14} n={10} r={0.6} /> : null}
						{frame >= music && frame < music + 14 ? <Burst3D at={[-0.8, 0.8, -2.3]} t={(frame - music) / 14} n={10} r={0.6} /> : null}
						{frame >= lightOut && frame < lightOut + 14 ? <Burst3D at={[-2.4, 1.55, -3.9]} t={(frame - lightOut) / 14} n={10} r={0.6} /> : null}
					</group>
				}
				blur={0}
				overlay={(cam: Cam3) => (
					<AbsoluteFill>
						<Notes cam={cam} at={[-0.8, 0.8, -2.3]} frame={frame} on={phoneOn && (seg === 2 || seg === 0 || seg === 4)} />
						<Big text="IT CANCELS THEM" x={960} y={860} size={100} frame={frame} at={cancels + 6} color="#B89AFF" />
					</AbsoluteFill>
				)}
			/>
			<Sound name="vanish" at={fanStops} volume={0.35} />
			<Sound name="vanish" at={music} volume={0.35} />
			<Sound name="vanish" at={lightOut} volume={0.35} />
			<Sound name="appear" at={pull + 6} volume={0.35} />
			<Sound name="boom" at={cancels + 4} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- noise

/** A wobbly sound wave across the screen at height y; `amp` 0 = flat. */
const Wave: React.FC<{y: number; amp: number; frame: number; color: string; x0?: number; x1?: number; flip?: boolean; width?: number}> = ({y, amp, frame, color, x0 = 0, x1 = 1920, flip = false, width = 10}) => {
	const pts: string[] = [];
	for (let x = x0; x <= x1; x += 12) {
		const v = Math.sin(x * 0.02 - frame * 0.25) * 0.7 + Math.sin(x * 0.047 - frame * 0.4) * 0.3;
		pts.push(`${x},${y + (flip ? -1 : 1) * v * amp}`);
	}
	return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />;
};

const kidsAt: Array<{who: keyof typeof P6; p: V3}> = [
	{who: 'kid1', p: [-1.6, 0, -0.6]},
	{who: 'kid2', p: [0, 0, -0.6]},
	{who: 'kid4', p: [1.6, 0, -0.6]},
	{who: 'kid5', p: [-1.6, 0, 1.0]},
	{who: 'friend', p: [1.6, 0, 1.0]},
];

export const Noise: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const loud = cue(l0, 'and it is loud');
	const lift = cue(l0, 'You lift the sword');
	const silent = cue(l0, 'the whole room');
	const real = l1.a;
	const wave = cue(l1, 'Sound is a wave');
	const opposite = cue(l1, 'and if you make');
	const head = cue(l1, "That's how");
	const patent = cue(l1, 'A German physicist');
	const cuts = [0, loud - 4, lift - 4, silent - 4, real - 4, wave - 4, opposite - 4, head - 4, patent - 4];
	const science = frame >= real - 4;
	const quiet = span(frame, silent - 2, silent + 10);
	const amp = (frame < loud - 4 ? 40 : 90) * (1 - quiet);
	const covering = frame >= loud && frame < silent + 6;
	const you: V3 = [0, 0, 2.2];
	const arm: [number, number] = frame >= lift ? [60, 120] : [12, 6];
	const hand = handAt(you, 0, arm, 20, 1);
	const phones = frame >= head - 4;
	const sciAmp = 70;
	const cancelP = span(frame, opposite + 10, opposite + 40);
	const classroom = (
		<Room3 look={ROOM3.classroom} window={{x: 3, w: 2.4}}>
			<Board3 at={[0, 2.0, -4.3]} />
			{kidsAt.map((k) => (
				<group key={k.who}>
					<Desk3 at={[k.p[0], 0, k.p[2] + 0.55]} w={1.0} d={0.6} />
					<Chair3 at={[k.p[0], 0, k.p[2]]} rot={Math.PI} />
				</group>
			))}
		</Room3>
	);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={
					science
						? [{at: [0.9, 1.3, 0], dist: 3.2, yaw: -10, pitch: 6, fov: 38}, {at: [0.8, 1.35, 0], dist: 2.8, yaw: 10, pitch: 4, fov: 36}]
						: [
								{at: [0, 1.0, 0.4], dist: 7.5, yaw: 20, pitch: 14, fov: 44},
								{at: [0, 1.0, 0.2], dist: 6, yaw: -25, pitch: 10, fov: 42},
								{at: [0, 1.3, 2.2], dist: 2.8, yaw: 30, pitch: 4, fov: 36},
								{at: [0, 1.0, 0.4], dist: 7.5, yaw: 15, pitch: 14, fov: 44},
							]
				}
				light={science ? LIGHT.studio : LIGHT.classroom}
				bg={science ? BG.studio : BG.classroom}
				far={
					science ? (
						<group>
							<Ground color="#2A2160" size={60} />
							<T shape={{kind: 'cyl', r: 1.8, h: 0.2}} color="#3E2F96" position={[0, 0.1, 0]} outline={0.02} />
						</group>
					) : (
						classroom
					)
				}
				near={
					science ? (
						<group position={[0, 0.2, 0]}>
							<Hero3D position={[0, 0, 0]} face={phones ? 'happy' : 'neutral'} blink={phones ? 1 : undefined} />
							{phones ? (
								<group position={[0, 1.36, 0]}>
									{[...Array(9)].map((_, i) => {
										const a = (i / 8) * Math.PI;
										return <T key={i} shape={{kind: 'box', w: 0.07, h: 0.06, d: 0.09}} color="#2A2638" position={[Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0]} rotation={[0, 0, a]} outline={0.006} />;
									})}
									{[-1, 1].map((x) => (
										<T key={x} shape={{kind: 'cyl', r: 0.13, h: 0.1}} color="#E8453C" position={[x * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]} outline={0.01} />
									))}
								</group>
							) : null}
						</group>
					) : (
						<group>
							{kidsAt.map((k, i) => (
								<Hero3D key={k.who} who={P6[k.who]} position={k.p} sit turn={0} face={covering ? 'scared' : frame > silent + 6 ? 'shocked' : 'neutral'} armL={covering ? [150, 30] : [12, 6]} armR={covering ? [150, 30] : [12, 6]} reachL={covering ? -10 : 0} reachR={covering ? -10 : 0} lite={i > 2} />
							))}
							<Hero3D position={you} turn={0} armR={arm} reachR={20} face={frame >= lift ? 'determined' : 'scared'} />
							<HeldSword grip={hand} tilt={frame >= lift ? 5 : 160} frame={frame} smoke={frame >= lift ? 0.7 : 0} glow={quiet} />
							<ShoulderBook pos={you} turn={0} frame={frame} side={-1} smoke={0.5} />
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						{!science ? (
							<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', opacity: 0.85}}>
								<Wave y={420} amp={amp} frame={frame} color="#FF8AD8" />
								<Wave y={560} amp={amp * 0.8} frame={frame + 20} color="#7FE0FF" />
							</svg>
						) : (
							<Panel frame={frame} at={wave} until={patent + 60} x={1400} title={cancelP > 0.5 ? 'WAVE + OPPOSITE WAVE = SILENCE' : 'SOUND IS A WAVE'}>
								<svg viewBox="0 0 760 540" width="100%" height="100%">
									<Wave y={110} amp={sciAmp} frame={frame} color="#7FE0FF" x0={30} x1={730} />
									{frame >= opposite ? <Wave y={270} amp={sciAmp} frame={frame} color="#FF8AD8" x0={30} x1={730} flip /> : null}
									{frame >= opposite + 10 ? <Wave y={430} amp={sciAmp * (1 - cancelP)} frame={frame} color="#FFD84A" x0={30} x1={730} /> : null}
									{frame >= opposite ? <text x={20} y={200} fontFamily={FONT} fontWeight={700} fontSize={56} fill="#F2EEFF">+</text> : null}
									{frame >= opposite + 10 ? <text x={20} y={360} fontFamily={FONT} fontWeight={700} fontSize={56} fill="#F2EEFF">=</text> : null}
								</svg>
							</Panel>
						)}
						{!science ? <Big text="SHHH…" x={960} y={860} size={100} frame={frame} at={silent + 8} until={real - 6} color="#B89AFF" /> : null}
						{science ? <Label text="NOISE-CANCELLING HEADPHONES" x={520} y={880} frame={frame} at={head + 4} until={patent - 4} size={42} color={UI.cyan} /> : null}
						{science ? <Label text="PAUL LUEG · PATENT · 1930s" x={520} y={880} frame={frame} at={patent + 4} size={42} color={UI.yellow} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="boom" at={loud} volume={0.25} />
			<Sound name="boom" at={loud + 14} volume={0.2} />
			<Sound name="vanish" at={silent} volume={0.4} />
			<Sound name="pop" at={wave} volume={0.3} />
			<Sound name="chime" at={opposite + 30} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- anti

export const Anti: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const real = cue(l0, 'And anti is real');
	const dirac = cue(l0, 'In nineteen twenty eight');
	const twin = cue(l0, 'every particle should');
	const anderson = cue(l0, 'Four years later');
	const positron = cue(l0, 'Today we call it');
	const meets = cue(l0, 'And when a particle');
	const vanish = cue(l0, 'they both vanish');
	const cuts = [0, real - 4, dirac - 4, twin - 4, anderson - 4, positron - 4, meets - 4];
	const seg = cuts.filter((c) => c <= frame).length - 1;
	const collide = span(frame, meets, vanish + 6, (v) => v * v);
	const orbit = frame * 0.05;
	const sep = seg >= 6 ? lerp(0.9, 0, collide) : 0.9;
	const e1: V3 = [Math.cos(orbit) * sep, 1.4 + Math.sin(orbit * 2) * 0.05, Math.sin(orbit) * sep * 0.5];
	const e2: V3 = [-e1[0], e1[1], -e1[2]];
	const boom = frame >= vanish + 6 && frame < vanish + 30;
	const showTwins = seg === 3 || seg >= 5;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={[
					{at: [0, 1.3, 0], dist: 3.4, yaw: 15, pitch: 6, fov: 38},
					{at: [0, 1.3, 0], dist: 4.2, yaw: -15, pitch: 6, fov: 40},
					{at: [-0.6, 1.5, -1.2], dist: 3.6, yaw: 10, pitch: 4, fov: 40},
					{at: [0, 1.4, 0], dist: 3.2, yaw: 0, pitch: 4, fov: 38},
					{at: [0.3, 1.5, -1.2], dist: 4.2, yaw: -10, pitch: 4, fov: 40},
					{at: [0, 1.4, 0], dist: 3.2, yaw: 20, pitch: 4, fov: 38},
					{at: [0, 1.4, 0], dist: 3.4, yaw: 0, pitch: 4, fov: 38},
				]}
				light={LIGHT.studio}
				bg="#120C30"
				far={
					<group>
						<Ground color="#1E1650" size={60} />
						{seg === 2 || seg === 4 ? (
							<group position={[-0.6, 1.6, -2.4]}>
								<Box size={[3.4, 1.9, 0.08]} at={[0, 0, 0]} color="#C9A06A" />
								<CanvasPlane
									w={3.2}
									h={1.7}
									px={1024}
									dep="dirac"
									position={[0, 0, 0.05]}
									draw={(ctx, W, H) => {
										ctx.fillStyle = '#2E4A3E';
										ctx.fillRect(0, 0, W, H);
										ctx.fillStyle = '#F2F2E8';
										ctx.font = `bold ${H * 0.2}px Georgia, serif`;
										ctx.textAlign = 'center';
										ctx.fillText('(iγ·∂ − m) ψ = 0', W / 2, H * 0.42);
										ctx.font = `bold ${H * 0.12}px Georgia, serif`;
										ctx.fillText('e⁻  ↔  e⁺   ?', W / 2, H * 0.72);
									}}
								/>
							</group>
						) : null}
					</group>
				}
				near={
					<group>
						{seg <= 1 ? (
							<group>
								<Hero3D position={[0, 0, 0]} face="shocked" armR={[60, 110]} reachR={40} />
								<Grimoire3D at={[0.8, 1.3, 0.2]} rot={[0.1, -0.5, 0]} frame={frame} open={1} glow={1} s={1.0} smoke={0.8} />
							</group>
						) : null}
						{seg === 2 || seg === 4 ? (
							<Hero3D who={P6.scientist} position={[0.9, 0, -1.6]} turn={-0.6} armR={[120, 150]} reachR={40} face="happy" talk={0.5} />
						) : null}
						{showTwins && frame < vanish + 6 ? (
							<group>
								<T shape={{kind: 'sphere', r: 0.22}} color="#3FB7E8" position={e1} outline={0.015} emissive="#3FB7E8" emissiveIntensity={0.3} />
								<T shape={{kind: 'sphere', r: 0.22}} color="#E8453C" position={e2} outline={0.015} emissive="#E8453C" emissiveIntensity={0.3} />
							</group>
						) : null}
						{boom ? <Burst3D at={[0, 1.4, 0]} t={(frame - vanish - 6) / 24} n={26} r={2.4} /> : null}
					</group>
				}
				blur={0}
				overlay={(cam: Cam3) => {
					const [x1, y1] = project(cam, e1);
					const [x2, y2] = project(cam, e2);
					const sign = (x: number, y: number, s: string, c: string) => (
						<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', fontFamily: FONT, fontWeight: 700, fontSize: 64, color: '#fff', textShadow: `0 0 10px ${c}`}}>{s}</div>
					);
					return (
						<AbsoluteFill>
							{seg <= 1 ? <Big text="ANTI" x={960} y={300} size={170} frame={frame} at={6} color="#B89AFF" /> : null}
							{seg === 2 ? <Label text="PAUL DIRAC · 1928" x={960} y={860} frame={frame} at={dirac + 4} size={50} color={UI.yellow} /> : null}
							{showTwins && collide < 0.97 ? sign(x1, y1, '−', '#3FB7E8') : null}
							{showTwins && collide < 0.97 ? sign(x2, y2, '+', '#E8453C') : null}
							{seg === 3 ? <Label text="EVERY PARTICLE HAS AN OPPOSITE TWIN" x={960} y={860} frame={frame} at={twin + 6} size={46} /> : null}
							{seg === 4 ? (
								<Panel frame={frame} at={anderson + 4} x={1420} w={640} h={560} title="CLOUD CHAMBER · 1932">
									<svg viewBox="0 0 640 500" width="100%" height="100%">
										<rect x={0} y={0} width={640} height={500} fill="#0A0818" />
										{[...Array(30)].map((_, i) => (
											<circle key={i} cx={(i * 97) % 640} cy={(i * 53) % 500} r={2} fill="#6A6A9A" />
										))}
										<rect x={0} y={240} width={640} height={20} fill="#4A4A6A" />
										<path d={`M 320 490 C 330 380, 380 300, 360 250 S 300 120, 360 40`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeDasharray={`${span(frame, anderson + 10, anderson + 50) * 700} 700`} />
									</svg>
								</Panel>
							) : null}
							{seg === 4 ? <Label text="CARL ANDERSON" x={560} y={860} frame={frame} at={anderson + 8} size={46} color={UI.yellow} /> : null}
							{seg === 5 ? <Big text="POSITRON" x={960} y={860} size={100} frame={frame} at={positron + 6} color="#FF8A8A" /> : null}
							{seg === 6 ? <Big text="PURE ENERGY" x={960} y={860} size={100} frame={frame} at={vanish + 8} color={UI.yellow} /> : null}
						</AbsoluteFill>
					);
				}}
			/>
			<Sound name="appear" at={4} volume={0.35} />
			<Sound name="pop" at={dirac + 4} volume={0.3} />
			<Sound name="shutter" at={anderson + 10} volume={0.35} />
			<Sound name="boom" at={vanish + 6} volume={0.45} />
		</>
	);
};

// ---------------------------------------------------------------- banana

export const Banana: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const full = cue(l0, 'Bananas are full');
	const radio = cue(l0, 'and a tiny bit');
	const every = cue(l0, 'So an ordinary');
	const hosp = cue(l0, 'Hospitals use');
	const cuts = [0, full - 4, radio - 4, every - 4, hosp - 4];
	const scan = frame >= hosp - 4;
	const sparkAt = every + 20;
	const slide = span(frame, hosp + 10, hosp + 70);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={
					scan
						? [{at: [0, 1.0, 1.4], dist: 4.6, yaw: 35, pitch: 10, fov: 40}]
						: [
								{at: [0, 0.9, 0], dist: 2.6, yaw: 20, pitch: 22, fov: 38},
								{at: [0.05, 0.92, 0.05], dist: 1.5, yaw: -15, pitch: 30, fov: 36},
								{at: [0.05, 0.92, 0.05], dist: 1.2, yaw: 10, pitch: 25, fov: 34},
								{at: [0, 0.92, 0], dist: 1.6, yaw: 30, pitch: 30, fov: 38},
							]
				}
				light={scan ? LIGHT.lab : LIGHT.home}
				bg={scan ? BG.lab : BG.home}
				far={
					scan ? (
						<Room3 look={ROOM3.lab} />
					) : (
						<Room3 look={ROOM3.kitchen} window={{x: 2}}>
							<Table3 at={[0, 0, 0]} />
						</Room3>
					)
				}
				near={
					scan ? (
						<group>
							<Mri3D at={[0, 0, 0]} />
							<group position={[0, 1.05, lerp(2.6, 1.0, slide)]} rotation={[-Math.PI / 2, 0, 0]}>
								<Hero3D who={P6.mum} position={[0, -0.85, 0]} face="happy" armL={[8, 6]} armR={[8, 6]} />
							</group>
						</group>
					) : (
						<group>
							<T shape={{kind: 'cyl', r: 0.32, r2: 0.22, h: 0.14}} color="#FFFFFF" position={[0, 0.84, 0]} outline={0.01} />
							<Banana3D at={[0.02, 0.98, 0.04]} rot={[0.2, 0.3, 0]} s={0.8} />
							<Banana3D at={[-0.05, 1.02, -0.06]} rot={[0.1, -0.4, 0.2]} s={0.8} />
							<T shape={{kind: 'sphere', r: 0.1}} color="#E8453C" position={[0.18, 0.96, -0.12]} outline={0.008} />
							<T shape={{kind: 'sphere', r: 0.09}} color="#7CC85A" position={[-0.2, 0.95, 0.12]} outline={0.008} />
							{frame >= sparkAt && frame < sparkAt + 16 ? <Burst3D at={[0.15, 1.08, 0.06]} t={(frame - sparkAt) / 16} n={6} r={0.25} /> : null}
						</group>
					)
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="POTASSIUM" x={960} y={220} frame={frame} at={full + 8} until={radio - 6} size={50} color={UI.yellow} />
						<Label text="A TINY BIT IS POTASSIUM-40 (RADIOACTIVE)" x={960} y={220} frame={frame} at={radio + 6} until={every - 6} size={42} color={UI.green} />
						<Big text="1 POSITRON EVERY ~75 MIN" x={960} y={860} size={84} frame={frame} at={sparkAt + 2} until={hosp - 6} color="#FF8A8A" />
						<Label text="PET SCANNER" x={960} y={220} frame={frame} at={hosp + 6} size={52} color={UI.cyan} />
						<Label text="POSITRON EMISSION TOMOGRAPHY" x={960} y={870} frame={frame} at={hosp + 20} size={40} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="pop" at={full + 8} volume={0.3} />
			<Sound name="sizzle" at={sparkAt} volume={0.25} />
			<Sound name="chime" at={sparkAt + 2} volume={0.3} />
			<Sound name="whoosh" at={hosp + 10} volume={0.25} />
		</>
	);
};

