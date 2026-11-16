import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, shake, Sound, span, type ShotProps} from '../../../components/stage';
import {Bars, Big, Count, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Smoke} from '../../../three/grimoire3d';
import {AcidPool3D, Ambergris3D, Beaks3D, Gut3D, GutFloor, Slime3D, Sphincter3D} from '../../../three/inside3d';
import {Bubbles3D, Underwater3D, UwCamera3D, Whale3D, whalePoint} from '../../../three/ocean3d';
import {Shot3, type Angle3} from '../../../three/shot3';
import {AirHud, beamSpot, BG, Forestomach, gutLight, HandTorch, HeldAmber, LIGHT, Panel, Swimmer, TORCH_ARM, torchHand, Vignette} from './kit';
import {handAt, headAt, type V3} from './util';

// Part B: swallowed. Down the throat, the first stomach and its squid beaks,
// the air you've got left, the whale's deep dive, the acid, the ambergris,
// and your plan to get out.

const withShake = (a: Angle3, frame: number, at: number, k = 0.06, amount = 1, len = 18): Angle3 => {
	const s = shake(frame, at, amount, len);
	return {...a, at: [a.at[0] + s.x * k, a.at[1] + s.y * k, a.at[2]]};
};

/** Air left in the tank at the start of each shot inside the whale, in minutes. */
const AIR = {beaks: 59.6, air: 59.2, dive: 58.8, acid: 57.4, grey: 56.6, plan: 55.4};

// ---------------------------------------------------------------- gulp

export const Gulp: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const notSquid = cue(l0, 'You are not');
	const strange = cue(l0, 'But this whale');
	const swings = cue(l0, 'It swings');
	const drops = cue(l0, 'drops open');
	const sucks = cue(l0, 'and sucks you');
	const snap = cue(l0, 'Snap.');
	const darkness = cue(l0, 'Darkness.');
	const down = cue(l0, 'And down the');
	const cuts = [0, notSquid - 4, strange - 4, swings - 4, drops - 4, sucks - 4, snap - 4, darkness - 2, down - 4];
	const hero0: V3 = [0, -7, 0];
	const len = 16;
	// The whale swims across, swings round to face you and closes in.
	const turnP = span(frame, swings - 10, drops + 10);
	const yaw = lerp(Math.PI / 2, 0, turnP);
	const rot: V3 = [0, yaw, 0];
	const start: V3 = [-16, -6, -20];
	const end: V3 = [0, -7 + 1.44, -8.2];
	const cruise: V3 = [start[0] + frame * 0.03, start[1], start[2]];
	const wAt: V3 = [lerp(cruise[0], end[0], turnP), lerp(cruise[1], end[1], turnP), lerp(cruise[2], end[2], turnP)];
	const jaw = span(frame, drops - 4, drops + 14) * (1 - span(frame, snap - 2, snap + 2));
	const pull = span(frame, sucks, snap - 2, (v) => v * v);
	const mouth = whalePoint(wAt, rot, len, 0.92, 0, -0.09);
	const hero: V3 = [lerp(hero0[0], mouth[0], pull), lerp(hero0[1], mouth[1], pull), lerp(hero0[2], mouth[2], pull)];
	const camAt: V3 = [lerp(0.8, mouth[0] + 0.4, pull), lerp(-7.6 - Math.min(frame, sucks) * 0.004, mouth[1], pull), lerp(0.6, mouth[2], pull)];
	const gone = frame >= snap;
	const inside = frame >= down - 4;
	const blackout = frame >= snap && frame < down - 4;
	const slide = Math.max(0, frame - (down - 4));
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light = LIGHT.deep;
	let bg = BG.deep;
	if (inside) {
		light = gutLight([0, 1.4, -slide * 0.12 + 1], [0, 0.6, -slide * 0.12 - 2], 0.7);
		bg = BG.gut;
		far = (
			<group>
				<Gut3D at={[0, 1.1, -10]} len={30} r={() => 1.5} frame={frame} squeeze={0.12} rings={14} />
				<Slime3D at={[0, 0, -slide * 0.12 - 2]} top={2.4} frame={frame} n={10} area={1.6} seed={3} />
			</group>
		);
		near = (
			<group position={[0, 0.0, -slide * 0.12]}>
				<group rotation={[Math.PI / 2 - 0.25, Math.PI, 0]} position={[0, 0.25, 0]}>
					<Hero3D position={[0, -0.85, 0]} scuba face="scared" armL={[150, 165]} armR={[150, 165]} headUp={60} />
				</group>
			</group>
		);
	} else {
		far = <Underwater3D frame={frame} surface={6} center={[0, -7, -4]} rays={0.5} />;
		near = (
			<group>
				<Whale3D kind="sperm" at={wAt} rot={rot} len={len} frame={frame} swim={turnP > 0.9 ? 0.2 : 0.6} jaw={jaw} />
				{!gone ? (
					<group>
						<Swimmer at={hero} pitch={lerp(20, 80, pull)} roll={0} yaw={lerp(0, 180, pull)} frame={frame} kick={pull > 0 ? 2 : 0.4} armL={pull > 0 ? [150, 160] : [40, 50]} armR={pull > 0 ? [150, 160] : [40, 50]} face={frame > swings ? 'shocked' : frame > notSquid ? 'smug' : 'neutral'} headUp={10} />
						<UwCamera3D at={camAt} rot={[frame * 0.05, frame * 0.04, 0]} s={0.9} />
						{pull > 0 ? <Bubbles3D at={[hero[0], hero[1] - 1, hero[2] + 1]} frame={frame} n={24} rise={-2.4} r={0.08} spread={1.2} every={20} /> : null}
					</group>
				) : null}
			</group>
		);
	}
	const angles: Angle3[] = [
		{at: [-4, -7, -8], dist: 24, yaw: 30, pitch: 4, fov: 44, dyaw: 6},
		{at: [0, -6.4, 0], dist: 3.2, yaw: 20, pitch: 4, fov: 40, dyaw: -6},
		{at: [-6, -6.5, -16], dist: 24, yaw: 60, pitch: 4, fov: 44, dyaw: 6},
		{at: [0, -6.6, -4], dist: 10, yaw: 160, pitch: 6, fov: 44, dyaw: -6},
		{at: [0, -7.5, -2], dist: 7.5, yaw: 200, pitch: -6, fov: 46, dyaw: 4},
		{at: [0, -7, -1.5], dist: 9, yaw: 95, pitch: 4, fov: 44, dyaw: -4},
		withShake({at: [0, -7, -2], dist: 8, yaw: 110, pitch: 2, fov: 44, dyaw: 2}, frame, snap, 0.3),
		{at: [0, -7, -2], dist: 8, yaw: 110, pitch: 2, fov: 44},
		{at: [0, 0.6, -slide * 0.12], dist: 3.2, yaw: 180, pitch: 14, fov: 52, dyaw: 0},
	];
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
				grade={inside ? 'saturate(1.15)' : undefined}
				overlay={() => (
					<AbsoluteFill>
						<Label text="IN REAL LIFE: ALMOST CERTAINLY NEVER" x={960} y={140} size={50} frame={frame} at={6} until={notSquid - 6} color={UI.cream} />
						<Label text="YOU ARE NOT A SQUID" x={960} y={140} size={56} frame={frame} at={notSquid + 4} until={swings - 6} color={UI.orange} />
						<Big text="SNAP!" x={960} y={480} size={170} frame={frame} at={snap} until={darkness + 8} color={UI.cream} />
						{blackout ? <AbsoluteFill style={{background: '#000', opacity: span(frame, snap + 6, snap + 12)}} /> : null}
						{inside ? <Vignette amount={0.5} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={swings} volume={0.35} />
			<Sound name="bubbles" at={sucks} volume={0.5} />
			<Sound name="snap" at={snap} volume={0.7} />
			<Sound name="boom" at={snap + 1} volume={0.3} />
			<Sound name="squeak" at={down} volume={0.3} />
			<Sound name="whoosh" at={down + 6} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- beaks

/** Three stomach chambers, flat, with "YOU ARE HERE" on the first. */
const Chambers: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const p = span(frame, at + 4, at + 20);
	return (
		<svg viewBox="0 0 700 500" width={700} height={500} style={{position: 'absolute', left: 30, top: 10}}>
			<path d="M40 150 Q20 120 60 110 L120 110" fill="none" stroke="#F4A0B0" strokeWidth={26} strokeLinecap="round" />
			{[
				[210, 170, 115, '1'],
				[420, 230, 90, '2'],
				[580, 330, 70, '3'],
			].map(([x, y, r, n], i) => (
				<g key={i} opacity={span(frame, at + 6 + i * 8, at + 16 + i * 8)}>
					<circle cx={x as number} cy={y as number} r={r as number} fill={i === 0 ? '#E8788A' : '#B85A70'} stroke="#140A28" strokeWidth={6} />
					<text x={x as number} y={(y as number) + 22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#FFF3D6">
						{n}
					</text>
				</g>
			))}
			<g opacity={p}>
				<path d="M210 330 L210 290" stroke="#FFD84A" strokeWidth={8} />
				<path d="M190 300 L210 280 L230 300" fill="none" stroke="#FFD84A" strokeWidth={8} />
				<text x={210} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#FFD84A">
					YOU ARE HERE
				</text>
			</g>
		</svg>
	);
};

export const Beaks: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const several = cue(l0, "A sperm whale's");
	const noAcid = cue(l0, "There's no acid");
	const bag = cue(l0, "It's a big squeezing");
	const floor = cue(l0, 'And the floor');
	const hard = cue(l0, 'Squid have hard');
	const whalers = cue(l0, 'and whalers found');
	const camera = cue(l0, 'Oh, and there');
	const cuts = [0, several - 4, noAcid - 4, bag - 4, floor - 4, hard - 4, whalers - 4, camera - 4];
	const pos: V3 = [0, 0, 1];
	const turn = 0.5;
	const aim = frame > noAcid ? Math.sin((frame - noAcid) * 0.03) * 0.7 : 0;
	const tip = frame > floor - 4 && frame < camera - 4 ? 0.6 : frame >= camera - 4 ? 0.7 : 0.1;
	const squeeze = frame > bag && frame < floor ? 0.16 : 0.05;
	const holdBeak = frame > hard && frame < camera;
	const camSpot: V3 = [1.25, 0.1, 2.3];
	const picked = frame > camera + 26;
	const light = gutLight(torchHand(pos, turn), frame >= camera - 4 ? camSpot : beamSpot(pos, turn, aim, tip, 3), 1);
	const lh = handAt(pos, turn, [30, 100], 70, -1);
	const near = (
		<group>
			<Hero3D position={pos} turn={turn} scuba armR={TORCH_ARM} reachR={70} armL={holdBeak ? [30, 100] : picked ? [30, 100] : [12, 8]} reachL={holdBeak || picked ? 70 : 0} face={frame > camera ? 'happy' : frame > bag && frame < floor ? 'scared' : 'neutral'} look={[aim, -tip * 0.6]} />
			<HandTorch pos={pos} turn={turn} aim={frame >= camera - 4 ? 0.35 : aim} tip={tip} beam={4.5} />
			{holdBeak ? <Beaks3D at={[lh[0], lh[1] + 0.05, lh[2]]} r={0.001} n={1} y={0} s={1.8} seed={2} /> : null}
			{picked ? <UwCamera3D at={[lh[0], lh[1] + 0.1, lh[2]]} rot={[0, turn, 0]} s={1.0} /> : null}
		</group>
	);
	const head = headAt(pos);
	const angles: Angle3[] = [
		{at: [head[0], head[1] - 0.2, head[2]], dist: 2.4, yaw: 35, pitch: 4, fov: 36, dyaw: 6},
		{at: [-0.6, 1.6, 0.6], dist: 3.2, yaw: 140, pitch: 6, fov: 52, dyaw: -8},
		{at: [0.4, 1.4, 1.6], dist: 2.4, yaw: 200, pitch: 8, fov: 46, dyaw: 8},
		withShake({at: [0, 2, 0], dist: 3.2, yaw: 75, pitch: 2, fov: 56, dyaw: -6}, frame, bag + 6, 0.12, 1, 30),
		{at: [0.4, 0.1, 2.2], dist: 1.4, yaw: 20, pitch: 28, fov: 44, dyaw: 10},
		{at: [lh[0], lh[1] + 0.1, lh[2]], dist: 1.2, yaw: 50, pitch: 8, fov: 36, dyaw: -6},
		{at: [0, 0.2, 0.8], dist: 3.4, yaw: 120, pitch: 50, fov: 50, dyaw: 8},
		{at: [camSpot[0] - 0.3, 0.4, camSpot[2] - 0.2], dist: 2.2, yaw: 230, pitch: 22, fov: 44, dyaw: -6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={BG.gut}
				far={<Forestomach frame={frame} squeeze={squeeze} camera={picked ? null : camSpot} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Vignette amount={0.45} />
						<AirHud frame={frame} left={AIR.beaks} at={10} />
						{frame >= several - 4 && frame < noAcid + 30 ? (
							<Panel frame={frame} at={several} until={noAcid + 20} x={1450} y={560} w={760} h={560} title="STOMACH CHAMBERS">
								<Chambers frame={frame} at={several} />
							</Panel>
						) : null}
						<Label text="NO ACID IN HERE" x={960} y={930} size={56} frame={frame} at={noAcid + 8} until={bag - 6} color={UI.green} />
						<Label text="A SQUEEZING BAG OF MUSCLE" x={960} y={930} size={56} frame={frame} at={bag + 8} until={floor - 6} color={UI.cream} />
						<Label text="SQUID BEAKS" x={960} y={930} size={60} frame={frame} at={floor + 10} until={whalers - 6} color={UI.orange} />
						{frame >= whalers - 4 && frame < camera - 4 ? <Count from={0} to={14000} x={960} y={500} size={150} frame={frame} at={whalers + 6} dur={36} prefix="UP TO " color={UI.yellow} /> : null}
						<Label text="BEAKS IN ONE STOMACH" x={960} y={640} size={56} frame={frame} at={whalers + 30} until={camera - 6} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="squeak" at={bag + 4} volume={0.35} />
			<Sound name="crunch" at={floor + 6} volume={0.4} />
			<Sound name="coins" at={whalers + 6} volume={0.3} />
			<Sound name="chime" at={camera + 4} volume={0.4} />
			<Sound name="crunch" at={camera + 24} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- air

/** A round air gauge with a needle. */
const Gauge: React.FC<{frame: number; at: number; until?: number; value: number; x: number; y: number}> = ({frame, at, until, value, x, y}) => {
	const p = span(frame, at, at + 10) * (until === undefined ? 1 : 1 - span(frame, until, until + 8));
	if (p <= 0) {
		return null;
	}
	const a = -130 + 260 * value;
	return (
		<svg viewBox="0 0 400 400" width={400} height={400} style={{position: 'absolute', left: x - 200, top: y - 200, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
			<circle cx={200} cy={200} r={170} fill="#F4F4F8" stroke="#140A28" strokeWidth={14} />
			<path d="M84 286 A140 140 0 0 1 72 150" fill="none" stroke="#FF5A5A" strokeWidth={22} />
			<path d="M72 150 A140 140 0 1 1 316 286" fill="none" stroke="#7CF2A0" strokeWidth={22} />
			<line x1={200} y1={200} x2={200 + 120 * Math.sin((a * Math.PI) / 180)} y2={200 - 120 * Math.cos((a * Math.PI) / 180)} stroke="#140A28" strokeWidth={12} strokeLinecap="round" />
			<circle cx={200} cy={200} r={18} fill="#140A28" />
			<text x={200} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#140A28">
				AIR
			</text>
		</svg>
	);
};

export const Air: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const isnt = cue(l0, "There isn't");
	const noOx = cue(l0, "A whale's stomach");
	const most = cue(l0, 'Most people');
	const record = cue(l0, 'The world record');
	const pure = cue(l0, 'but that was');
	const luckily = cue(l0, 'Luckily');
	const nearS = cue(l0, 'Near the surface');
	const so = cue(l0, "So, you've got");
	const cuts = [0, isnt - 4, noOx - 4, most - 4, luckily - 4, nearS - 4, so - 4];
	const pos: V3 = [0, 0, 1];
	const turn = 0.2;
	const light = gutLight(torchHand(pos, turn), beamSpot(pos, turn, 0, 0.3, 3), 1);
	const tankTap = frame > luckily && frame < so;
	const head = headAt(pos);
	const near = (
		<group>
			<Hero3D position={pos} turn={turn} scuba armR={TORCH_ARM} reachR={70} armL={tankTap ? [150, 190] : frame > noOx && frame < most ? [40, 150] : [12, 8]} reachL={tankTap ? -40 : frame > noOx && frame < most ? 55 : 0} face={frame > luckily ? 'happy' : frame > isnt ? 'scared' : 'neutral'} />
			<HandTorch pos={pos} turn={turn} tip={0.3} beam={4} />
		</group>
	);
	const angles: Angle3[] = [
		{at: [head[0], head[1] - 0.15, head[2]], dist: 2.2, yaw: 25, pitch: 4, fov: 36, dyaw: 6},
		{at: [head[0], head[1] - 0.05, head[2]], dist: 1.4, yaw: 10, pitch: 2, fov: 34, dyaw: -4},
		{at: [0, 1.2, 1], dist: 3.4, yaw: 50, pitch: 6, fov: 44, dyaw: 6},
		{at: [-0.6, 1.2, 1], dist: 4.2, yaw: 30, pitch: 6, fov: 44, dyaw: -4},
		{at: [0, 0.95, 0.6], dist: 1.8, yaw: 170, pitch: 10, fov: 40, dyaw: 8},
		{at: [-0.5, 1.1, 0.9], dist: 3.4, yaw: 20, pitch: 6, fov: 44, dyaw: -4},
		{at: [head[0], head[1] - 0.1, head[2]], dist: 1.8, yaw: 16, pitch: 3, fov: 34, ddist: -0.3},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={BG.gut}
				far={<Forestomach frame={frame} squeeze={0.05} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Vignette amount={0.45} />
						<AirHud frame={frame} left={AIR.air} at={0} />
						<Big text="NO OXYGEN" x={960} y={880} size={110} frame={frame} at={noOx + 8} until={most - 6} color={UI.red} />
						{frame >= most - 4 && frame < luckily - 4 ? (
							<Bars
								x={340}
								y={340}
								w={1240}
								frame={frame}
								at={most + 6}
								items={[
									{label: 'MOST PEOPLE', value: 0.04, color: UI.cream, note: '≈ 1 MIN'},
									{label: 'RECORD', value: 1, color: UI.yellow, note: '24 MIN 37 S'},
								]}
							/>
						) : null}
						<Label text="…AFTER BREATHING PURE OXYGEN" x={960} y={700} size={50} frame={frame} at={pure + 6} until={luckily - 6} color={UI.cyan} />
						<Label text="SCUBA TANK" x={960} y={140} size={60} frame={frame} at={luckily + 10} until={so - 6} color={UI.yellow} />
						<Gauge frame={frame} at={nearS + 4} until={so - 6} value={0.95} x={1500} y={520} />
						<Label text="≈ 1 HOUR" x={1500} y={800} size={64} frame={frame} at={nearS + 14} until={so - 6} color={UI.green} />
						<Big text="1 HOUR TO ESCAPE" x={960} y={880} size={110} frame={frame} at={so + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="squeak" at={isnt + 4} volume={0.3} />
			<Sound name="pop" at={most + 6} volume={0.3} />
			<Sound name="pop" at={record + 4} volume={0.3} />
			<Sound name="tick" at={nearS + 4} volume={0.4} />
			<Sound name="chime" at={so + 10} volume={0.4} />
		</>
	);
};

// ---------------------------------------------------------------- dive

/** A depth gauge down the left of the screen, 0 at the top to 2,500 m at the bottom. */
const DepthBar: React.FC<{frame: number; at: number; depth: number; until?: number}> = ({frame, at, depth, until}) => {
	const p = span(frame, at, at + 10) * (until === undefined ? 1 : 1 - span(frame, until, until + 8));
	if (p <= 0) {
		return null;
	}
	const H = 760;
	const y = (d: number) => 160 + (d / 2500) * H;
	return (
		<svg viewBox="0 0 520 1080" width={520} height={1080} style={{position: 'absolute', left: 30, top: 0, opacity: p}}>
			<rect x={60} y={150} width={40} height={H + 20} rx={20} fill="rgba(14,8,34,0.86)" stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
			<rect x={66} y={160} width={28} height={Math.max(0, y(depth) - 160)} rx={14} fill="#7FE0FF" />
			{[0, 500, 1000, 1500, 2000, 2500].map((d) => (
				<g key={d}>
					<line x1={104} y1={y(d)} x2={124} y2={y(d)} stroke="#FFF3D6" strokeWidth={4} />
					<text x={132} y={y(d) + 12} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#FFF3D6">
						{d.toLocaleString('en-GB')} m
					</text>
				</g>
			))}
			<circle cx={80} cy={y(depth)} r={22} fill="#FFD84A" stroke="#140A28" strokeWidth={5} />
		</svg>
	);
};

/** Lungs that fold flat, and a muscle swatch that darkens. */
const LungsPanel: React.FC<{frame: number; fold: number; dark: number}> = ({frame, fold, dark}) => {
	const sq = 1 - fold * 0.75;
	const muscle = `rgb(${Math.round(lerp(200, 40, dark))},${Math.round(lerp(60, 20, dark))},${Math.round(lerp(70, 34, dark))})`;
	return (
		<svg viewBox="0 0 700 480" width={700} height={480} style={{position: 'absolute', left: 30, top: 10}}>
			<g transform={`translate(190 200) scale(${0.6 + 0.4 * sq} ${sq})`}>
				<path d="M-10 -120 L-10 -40" stroke="#E8A0B0" strokeWidth={18} />
				<ellipse cx={-70} cy={20} rx={60} ry={100} fill="#F4A0B8" stroke="#140A28" strokeWidth={6} />
				<ellipse cx={50} cy={20} rx={60} ry={100} fill="#F4A0B8" stroke="#140A28" strokeWidth={6} />
			</g>
			<text x={190} y={400} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#FFF3D6">
				LUNGS FOLD FLAT
			</text>
			<g opacity={span(frame, 0, 1) * (dark > 0 ? 1 : 0.4)}>
				<rect x={430} y={90} width={200} height={130} rx={20} fill="#C83C46" stroke="#140A28" strokeWidth={6} />
				<text x={530} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#FFF3D6">
					YOUR MUSCLE
				</text>
				<rect x={430} y={270} width={200} height={130} rx={20} fill={muscle} stroke="#140A28" strokeWidth={6} />
				<text x={530} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#FFF3D6">
					SPERM WHALE
				</text>
			</g>
		</svg>
	);
};

export const Dive: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const uhoh = cue(l0, 'Uh oh');
	const diving = cue(l0, 'The whale is diving');
	const often = cue(l0, 'Sperm whales often');
	const deepest = cue(l0, 'The deepest');
	const downThere = cue(l0, 'Down there');
	const lucky = cue(l0, 'Luckily for you');
	const turnsUp = cue(l0, 'It turns back up');
	const survive = l1.a;
	const lungs = cue(l1, 'Its lungs');
	const muscles = cue(l1, 'and it carries');
	const black = cue(l1, "There's so much");
	const cuts = [0, uhoh - 4, diving - 4, often - 4, deepest - 4, downThere - 4, lucky - 4, survive - 4, muscles - 4, black - 4];
	const insidePart = frame < often - 4;
	const tilt = -0.32 * span(frame, 4, 24);
	const slip = span(frame, 8, uhoh + 20) * 0.5;
	// Outside: the whale dives into the dark, then turns back up.
	const depth = frame < often - 4 ? lerp(0, 400, span(frame, diving, often)) : frame < lucky ? lerp(400, 1600, span(frame, often, downThere + 30)) : lerp(1600, 1100, span(frame, lucky, turnsUp + 40));
	const pitch = frame < lucky ? 1.15 : lerp(1.15, -0.7, span(frame, lucky + 10, turnsUp + 30));
	const wAt: V3 = [0, 0, 0];
	const dark = Math.min(0.85, depth / 1800);
	const pos: V3 = [0, 0, 1 - slip];
	const turn = 0.5;
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light = LIGHT.deep;
	let bg = BG.deep;
	if (insidePart) {
		light = gutLight(torchHand(pos, turn), beamSpot(pos, turn, 0, 0.3, 3), 1);
		bg = BG.gut;
		far = <Forestomach frame={frame} squeeze={0.05} tilt={tilt} />;
		near = (
			<group rotation={[tilt, 0, 0]}>
				<Hero3D position={pos} turn={turn} scuba armR={TORCH_ARM} reachR={70} armL={[60, 90]} lean={-10} face="shocked" />
				<HandTorch pos={pos} turn={turn} tip={0.3} beam={4} />
			</group>
		);
	} else if (frame < survive - 4) {
		light = {...LIGHT.deep, ambient: 1.0 - dark * 0.6, sun: {...LIGHT.deep.sun, intensity: 1.4 * (1 - dark * 0.7)}, fog: {color: dark > 0.5 ? '#041428' : '#0C3A66', near: 6, far: 70 - dark * 30}};
		bg = dark > 0.5 ? BG.dark : BG.deep;
		far = <Underwater3D frame={frame} surface={60} center={[0, 0, 0]} rays={1 - dark} dark={dark} />;
		near = <Whale3D kind="sperm" at={wAt} rot={[pitch, 0.4, 0]} len={16} frame={frame} swim={0.8} />;
	} else {
		light = LIGHT.ocean;
		bg = BG.ocean;
		far = <Ground color="#1E3E7A" size={160} lines={{every: 4, color: '#2A4E90', along: 'z'}} />;
		near = <Whale3D kind="sperm" at={[-3, 4, 0]} rot={[0, Math.PI / 2 + Math.sin(frame * 0.008) * 0.2, 0]} len={16} frame={frame} swim={0.3} />;
	}
	const head = headAt(pos);
	const angles: Angle3[] = [
		{at: [head[0], head[1] - 0.3, head[2]], dist: 3.0, yaw: 40, pitch: 4, fov: 44, roll: tilt * 30, dyaw: 4},
		withShake({at: [0, 1.4, 0.4], dist: 3.3, yaw: 90, pitch: 4, fov: 52, roll: tilt * 40}, frame, uhoh, 0.15),
		{at: [0, 1.4, 0.4], dist: 3.0, yaw: 200, pitch: 10, fov: 52, roll: -tilt * 30, dyaw: 6},
		{at: [0, 0, 0], dist: 30, yaw: 70, pitch: 8, fov: 44, dyaw: 8},
		{at: [0, -2, 0], dist: 24, yaw: 20, pitch: -30, fov: 44, dyaw: -8},
		{at: [0, 0, 0], dist: 28, yaw: 110, pitch: 4, fov: 44, dyaw: 6},
		{at: [0, 0, 0], dist: 30, yaw: 80, pitch: 6, fov: 44, dyaw: -6},
		{at: [-3, 4, 0], dist: 30, yaw: 0, pitch: 6, fov: 42, dyaw: 4},
		{at: [-1, 4, 0], dist: 28, yaw: 8, pitch: 6, fov: 42, dyaw: -4},
		{at: [-1, 4, 0], dist: 28, yaw: -8, pitch: 6, fov: 42, dyaw: 4},
	];
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
						{insidePart ? <Vignette amount={0.45} /> : null}
						{insidePart ? <AirHud frame={frame} left={AIR.dive} /> : null}
						<Big text="UH OH" x={960} y={300} size={150} frame={frame} at={uhoh} until={diving + 20} color={UI.yellow} rotate={-5} />
						<DepthBar frame={frame} at={diving + 4} until={survive - 6} depth={depth} />
						<Label text="OFTEN 1–2 KM DOWN · OVER AN HOUR" x={1100} y={140} size={52} frame={frame} at={often + 8} until={deepest - 6} color={UI.cyan} />
						<Label text="DEEPEST MEASURED ≈ 2.25 KM" x={1100} y={140} size={52} frame={frame} at={deepest + 8} until={downThere - 6} color={UI.yellow} />
						<Big text="200× THE PRESSURE" x={1100} y={880} size={96} frame={frame} at={downThere + 10} until={lucky - 6} color={UI.red} />
						<Label text="IT JUST ATE. IT TURNS BACK UP." x={1100} y={140} size={52} frame={frame} at={lucky + 10} until={survive - 6} color={UI.green} />
						{frame >= lungs - 4 ? (
							<Panel frame={frame} at={lungs} x={1430} y={560} w={760} h={560} title="HOW WHALES DIVE">
								<LungsPanel frame={frame} fold={span(frame, lungs + 6, lungs + 30)} dark={span(frame, muscles + 6, black + 30)} />
							</Panel>
						) : null}
						<Label text="OXYGEN STORED IN MUSCLE · MYOGLOBIN" x={960} y={950} size={48} frame={frame} at={muscles + 30} until={black - 6} color={UI.cream} />
						<Label text="MEAT: ALMOST BLACK" x={960} y={950} size={54} frame={frame} at={black + 10} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="squeak" at={6} volume={0.35} />
			<Sound name="crunch" at={14} volume={0.4} />
			<Sound name="boom" at={uhoh} volume={0.3} />
			<Sound name="whoosh" at={often} volume={0.3} />
			<Sound name="whoosh" at={lucky + 14} volume={0.3} />
			<Sound name="pop" at={lungs + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- acid

const Melts: React.FC<{frame: number; at: number; real: number}> = ({frame, at, real}) => (
	<svg viewBox="0 0 700 440" width={700} height={440} style={{position: 'absolute', left: 30, top: 20}}>
		<g opacity={span(frame, at + 4, at + 14)}>
			<text x={40} y={110} fontFamily={FONT} fontWeight={700} fontSize={50} fill="#FFF3D6">
				CARTOONS
			</text>
			<text x={420} y={110} fontFamily={FONT} fontWeight={700} fontSize={50} fill="#FF5A5A">
				SECONDS ✗
			</text>
		</g>
		<g opacity={real}>
			<text x={40} y={250} fontFamily={FONT} fontWeight={700} fontSize={50} fill="#FFF3D6">
				REAL LIFE
			</text>
			<text x={420} y={250} fontFamily={FONT} fontWeight={700} fontSize={50} fill="#7CF2A0">
				HOURS ✓
			</text>
			<text x={40} y={380} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#C8E8FF">
				…but it would sting and burn
			</text>
		</g>
	</svg>
);

export const Acid: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const next = cue(l0, 'into the next');
	const worse = cue(l0, "and it's even");
	const acid = cue(l0, 'This is where');
	const gloves = cue(l0, 'Your gloves');
	const cartoons = cue(l0, 'In cartoons');
	const real = cue(l0, 'In real life');
	const skin = cue(l0, 'But your skin');
	const cuts = [0, next - 4, acid - 4, gloves - 4, cartoons - 4, skin - 4];
	const through = frame < next + 10;
	const open = span(frame, 10, 34) * (1 - span(frame, next, next + 10));
	// Squeezing through, then standing by the acid pool.
	const sq = span(frame, 20, next + 6, (v) => v);
	const posA: V3 = [0, 0, lerp(-3.6, -6.4, sq)];
	const pos: V3 = [frame > skin + 10 ? lerp(-0.4, -1.2, span(frame, skin + 10, skin + 30)) : -0.4, 0, 2.0];
	const turn = Math.PI - 0.3;
	const hop = frame > skin + 10 && frame < skin + 40 ? Math.abs(Math.sin((frame - skin) * 0.3)) * 0.25 : 0;
	const fizz = frame > gloves;
	const lh = handAt(pos, turn, [20, 30], 50, -1);
	const rh = handAt(pos, turn, [20, 30], 50, 1);
	let far: React.ReactNode;
	let near: React.ReactNode;
	let light: ReturnType<typeof gutLight>;
	if (through) {
		light = gutLight(torchHand(posA, Math.PI), beamSpot(posA, Math.PI, 0, 0.1, 2.5), 1);
		far = <Forestomach frame={frame} squeeze={0.05} />;
		near = (
			<group>
				<Hero3D position={posA} turn={Math.PI} scuba armL={[150, 170]} armR={[150, 170]} reachL={40} reachR={40} face="determined" />
				<Sphincter3D at={[0, 1.4, -6.55]} r={1.5} open={open} />
			</group>
		);
	} else {
		light = {...gutLight(torchHand(pos, turn), [0, 0.4, -1.5], 1, '#C8F04A'), points: [...gutLight(torchHand(pos, turn), [0, 0.4, -1.5], 1).points!, {at: [0, 0.8, -1.5] as V3, color: '#C8FF6A', intensity: 6, distance: 8}]};
		far = (
			<group>
				<Gut3D at={[0, 2.2, 0]} len={14} r={() => 3.1} frame={frame} color="#D86A80" fold="#A84A60" squeeze={0.04} />
				<GutFloor frame={frame} w={8} d={13} color="#C85A70" />
				<AcidPool3D at={[0, 0, -1.5]} r={2.2} frame={frame} />
				<Smoke at={[0, 0.1, -1.5]} frame={frame} amount={0.8} r={1.3} n={12} rise={1.4} color="#9AC85A" seed={4} />
				<Sphincter3D at={[0, 1.6, 6.4]} r={1.5} open={0.2} />
				<Slime3D top={4.8} frame={frame} n={12} area={5} seed={6} />
			</group>
		);
		near = (
			<group>
				<Hero3D position={[pos[0], hop, pos[2]]} turn={turn} scuba armL={fizz ? [20, 30] : [12, 8]} armR={fizz ? [20, 30] : TORCH_ARM} reachL={fizz ? 50 : 0} reachR={fizz ? 50 : 70} face={frame > skin ? 'scared' : frame > gloves ? 'shocked' : 'scared'} look={fizz && frame < cartoons ? [0, 0.8] : [0, 0]} />
				{fizz ? (
					<group>
						<Bubbles3D at={lh} frame={frame} n={10} rise={0.35} r={0.03} spread={0.12} every={20} />
						<Bubbles3D at={rh} frame={frame} n={10} rise={0.35} r={0.03} spread={0.12} every={20} seed={3} />
						<Smoke at={lh} frame={frame} amount={0.5} r={0.08} n={6} rise={0.5} color="#C8F08A" seed={2} />
					</group>
				) : null}
			</group>
		);
	}
	const head = headAt(pos);
	const angles: Angle3[] = [
		{at: [0, 1.3, -5], dist: 3.0, yaw: 20, pitch: 6, fov: 50, dyaw: 6},
		{at: [0, 1.0, 0], dist: 3.2, yaw: 160, pitch: 18, fov: 54, dyaw: -8},
		{at: [0, 0.4, -1.5], dist: 4.2, yaw: 140, pitch: 30, fov: 50, dyaw: 8},
		{at: [(lh[0] + rh[0]) / 2, lh[1], lh[2]], dist: 1.3, yaw: 160, pitch: 14, fov: 40, dyaw: -6},
		{at: [head[0], head[1] - 0.3, head[2]], dist: 3.0, yaw: 150, pitch: 6, fov: 44, dyaw: 6},
		{at: [-0.4, 1.0, 1.0], dist: 3.4, yaw: 120, pitch: 10, fov: 50, dyaw: -6},
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={BG.gut}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Vignette amount={0.45} />
						<AirHud frame={frame} left={AIR.acid} />
						<Label text="CHAMBER 2 · ACID" x={960} y={140} size={60} frame={frame} at={acid + 6} until={cartoons - 6} color={UI.green} />
						<Big text="FIZZ!" x={1300} y={420} size={120} frame={frame} at={gloves + 6} until={cartoons - 6} color={UI.green} rotate={8} />
						{frame >= cartoons - 4 && frame < skin + 60 ? (
							<Panel frame={frame} at={cartoons} until={skin + 50} x={1430} y={540} w={760} h={500} title="HOW FAST DOES ACID WORK?">
								<Melts frame={frame} at={cartoons} real={span(frame, real + 4, real + 14)} />
							</Panel>
						) : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="squeak" at={16} volume={0.4} />
			<Sound name="squeak" at={next - 6} volume={0.3} />
			<Sound name="sizzle" at={acid} volume={0.25} />
			<Sound name="sizzle" at={gloves + 2} volume={0.5} />
			<Sound name="pop" at={cartoons + 4} volume={0.3} />
			<Sound name="pop" at={real + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- grey (ambergris)

/** A squid beak wrapped in layer after layer of wax. */
const Layers: React.FC<{frame: number; n: number}> = ({frame, n}) => (
	<svg viewBox="0 0 700 440" width={700} height={440} style={{position: 'absolute', left: 30, top: 10}}>
		{[...Array(Math.max(0, Math.round(n)))].map((_, i) => {
			const r = 70 + (Math.round(n) - i) * 26;
			return <ellipse key={i} cx={350} cy={220} rx={r * 1.2} ry={r * 0.9} fill={i % 2 ? '#A8A090' : '#8A8478'} stroke="#140A28" strokeWidth={4} />;
		}).reverse()}
		<path d="M330 250 Q340 180 380 190 Q360 205 362 250 Z" fill="#2A1E24" stroke="#140A28" strokeWidth={4} transform={`rotate(${Math.sin(frame * 0.05) * 5} 350 220)`} />
		<text x={350} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#FFF3D6">
			SQUID BEAK + WAX, LAYER AFTER LAYER
		</text>
	</svg>
);

/** 100 little whales, one gold. */
const OneIn100: React.FC<{frame: number; at: number}> = ({frame, at}) => (
	<svg viewBox="0 0 700 440" width={700} height={440} style={{position: 'absolute', left: 30, top: 10}}>
		{[...Array(100)].map((_, i) => {
			const x = 50 + (i % 10) * 62;
			const y = 40 + Math.floor(i / 10) * 38;
			const on = span(frame, at + i * 0.3, at + i * 0.3 + 4);
			const gold = i === 57;
			return (
				<g key={i} opacity={on} transform={`translate(${x} ${y})`}>
					<path d="M-22 0 Q-10 -12 14 -10 Q24 -8 24 0 Q24 8 14 10 Q-10 12 -22 0 L-30 -8 L-27 0 L-30 8 Z" fill={gold ? '#FFD84A' : '#5E5868'} stroke="#140A28" strokeWidth={2.5} />
				</g>
			);
		})}
	</svg>
);

/** A perfume bottle and a fishing boat with a big grey lump. */
const Riches: React.FC<{frame: number; perfume: number; yemen: number}> = ({frame, perfume, yemen}) => (
	<svg viewBox="0 0 700 440" width={700} height={440} style={{position: 'absolute', left: 30, top: 10}}>
		<g opacity={perfume * (1 - yemen)} transform={`translate(350 210) scale(${0.85 + 0.15 * perfume})`}>
			<rect x={-90} y={-60} width={180} height={190} rx={40} fill="#F2B8E8" stroke="#140A28" strokeWidth={7} />
			<rect x={-30} y={-110} width={60} height={50} rx={10} fill="#FFD84A" stroke="#140A28" strokeWidth={7} />
			<ellipse cx={-40} cy={0} rx={18} ry={40} fill="#ffffff" opacity={0.6} />
			{[0, 1, 2].map((i) => (
				<circle key={i} cx={110 + i * 30} cy={-120 - i * 20 + Math.sin(frame * 0.1 + i) * 6} r={8 + i * 3} fill="#F2B8E8" opacity={0.7} />
			))}
		</g>
		<g opacity={yemen} transform="translate(350 260)">
			<path d="M-230 0 L230 0 L180 80 L-190 80 Z" fill="#E8453C" stroke="#140A28" strokeWidth={7} />
			<rect x={-200} y={-20} width={400} height={22} fill="#F4F4F8" stroke="#140A28" strokeWidth={5} />
			<ellipse cx={0} cy={-70} rx={120} ry={60} fill="#8A8478" stroke="#140A28" strokeWidth={7} />
			<ellipse cx={-30} cy={-90} rx={30} ry={14} fill="#C8C0A8" />
		</g>
	</svg>
);

export const Grey: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const odd = cue(l0, 'your torch lands');
	const lump = cue(l0, 'A big, grey');
	const found = cue(l0, "You've just found");
	const when = cue(l0, 'When a squid');
	const layer = cue(l0, 'layer after');
	const only = cue(l0, 'Only about');
	const perfume = cue(l0, "And it's used");
	const yemen = cue(l0, 'In twenty twenty one');
	const sold = cue(l0, 'and sold it');
	const cuts = [0, odd - 4, lump - 4, found - 4, when - 4, only - 4, perfume - 4, yemen - 4, sold - 4];
	const walk = span(frame, 0, odd + 10, (v) => v);
	const pos: V3 = [0, 0, lerp(2.5, -0.6, walk)];
	const turn = Math.PI;
	const amber: V3 = [1.25, 1.05, -2.1];
	const aim = frame > odd ? -0.55 : 0;
	const tip = frame > odd ? -0.1 : 0.2;
	const poke = frame > lump + 6 && frame < found + 20;
	const light = gutLight(torchHand(pos, turn), frame > odd ? amber : beamSpot(pos, turn, aim, tip, 3), 1, '#E87A6A');
	const near = (
		<group>
			<Hero3D position={pos} turn={turn} scuba walk={walk < 1 ? frame * 0.04 : undefined} armR={TORCH_ARM} reachR={70} armL={poke ? [40, 50] : [12, 8]} reachL={poke ? 80 + Math.sin(frame * 0.5) * 8 : 0} face={frame > found ? 'happy' : frame > odd ? 'shocked' : 'neutral'} look={frame > odd ? [-0.5, 0.1] : [0, 0]} />
			<HandTorch pos={pos} turn={turn} aim={aim} tip={tip} beam={3.5} />
			<Ambergris3D at={amber} s={0.32} rot={[0.3, 0.6, 0]} />
		</group>
	);
	const far = (
		<group>
			<Gut3D at={[0, 1.9, -2]} len={16} r={() => 2.0} frame={frame} squeeze={0.07} rings={10} color="#E07A86" fold="#A84A62" />
			<GutFloor frame={frame} w={4} d={16} color="#C85A70" at={[0, 0, -2]} />
			<Beaks3D at={[0, 0, -2]} r={1.2} n={160} hole={[0, -0.6]} clear={0.5} seed={9} />
			<Slime3D at={[0, 0, -2]} top={3.6} frame={frame} n={10} area={2.4} seed={8} />
		</group>
	);
	const diagram = frame >= when - 4;
	const angles: Angle3[] = [
		{at: [0, 1.2, 0.8], dist: 3.0, yaw: 20, pitch: 6, fov: 48, dyaw: 6},
		{at: [0.7, 1.1, -1.4], dist: 2.8, yaw: 150, pitch: 6, fov: 46, dyaw: -6},
		{at: amber, dist: 1.4, yaw: 210, pitch: 6, fov: 40, dyaw: 8},
		{at: [0.6, 1.1, -1.3], dist: 2.0, yaw: 120, pitch: 4, fov: 42, dyaw: -6},
		{at: [0.3, 1.1, -1.2], dist: 3.4, yaw: 160, pitch: 6, fov: 48, dyaw: 4},
		{at: [0.3, 1.1, -1.2], dist: 3.4, yaw: 140, pitch: 6, fov: 48, dyaw: -4},
		{at: [0.3, 1.1, -1.2], dist: 3.4, yaw: 170, pitch: 6, fov: 48, dyaw: 4},
		{at: [0.3, 1.1, -1.2], dist: 3.4, yaw: 150, pitch: 6, fov: 48, dyaw: -4},
		{at: [0.3, 1.1, -1.2], dist: 3.4, yaw: 130, pitch: 6, fov: 48, dyaw: 4},
	];
	const title = frame < only - 4 ? 'HOW AMBERGRIS FORMS' : frame < perfume - 4 ? 'HOW RARE?' : frame < yemen - 4 ? 'WHAT IT’S FOR' : 'YEMEN · 2021';
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={BG.gut}
				far={far}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Vignette amount={0.45} />
						<AirHud frame={frame} left={AIR.grey} />
						<Label text="AMBERGRIS" x={diagram ? 520 : 960} y={930} size={70} frame={frame} at={found + 6} color={UI.yellow} />
						{diagram ? (
							<Panel frame={frame} at={when} x={1430} y={540} w={760} h={560} title={title}>
								{frame < only - 4 ? <Layers frame={frame} n={lerp(0, 5, span(frame, coatsAt(l0), layer + 40))} /> : frame < perfume - 4 ? <OneIn100 frame={frame} at={only} /> : <Riches frame={frame} perfume={span(frame, perfume + 4, perfume + 14)} yemen={span(frame, yemen + 4, yemen + 14)} />}
							</Panel>
						) : null}
						<Label text="≈ 1 IN 100 SPERM WHALES" x={1430} y={900} size={50} frame={frame} at={only + 20} until={perfume - 6} color={UI.yellow} />
						<Label text="EXPENSIVE PERFUMES" x={1430} y={900} size={50} frame={frame} at={perfume + 14} until={yemen - 6} color={UI.cream} />
						{frame >= yemen - 4 ? <Count from={0} to={127} x={1250} y={920} size={70} frame={frame} at={yemen + 20} dur={30} suffix=" KG" color={UI.cream} /> : null}
						{frame >= sold - 4 ? <Label text="≈ $1.5 MILLION" x={1640} y={920} size={56} frame={frame} at={sold + 14} color={UI.green} /> : null}
					</AbsoluteFill>
				)}
			/>
			<Sound name="chime" at={odd + 6} volume={0.35} />
			<Sound name="squeak" at={lump + 10} volume={0.35} />
			<Sound name="appear" at={found + 4} volume={0.35} />
			<Sound name="pop" at={when + 4} volume={0.3} />
			<Sound name="pop" at={only + 4} volume={0.3} />
			<Sound name="coins" at={sold + 12} volume={0.45} />
		</>
	);
};

const coatsAt = (l: Parameters<typeof cue>[0]) => cue(l, 'the whale coats');

// ---------------------------------------------------------------- plan

export const Plan: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const exit = cue(l0, "And there's one");
	const scientists = cue(l0, 'Scientists think');
	const grab = cue(l0, 'So you grab');
	const scoop = cue(l0, 'scoop up');
	const prod = cue(l0, 'and start prodding');
	const shudder = cue(l0, 'The walls shudder');
	const rumble = cue(l0, 'A rumble');
	const here = cue(l0, 'Here it comes');
	const cuts = [0, exit - 4, scientists - 4, grab - 4, prod - 4, shudder - 4, rumble - 4, here - 4];
	const pos: V3 = [1.6, 0, 1.2];
	const turn = Math.PI / 2;
	const prodding = frame > prod;
	const jab = prodding ? Math.max(0, Math.sin((frame - prod) * 0.45)) : 0;
	const squeeze = frame > shudder ? 0.18 : 0.05;
	const beat = frame > rumble ? Math.abs(Math.sin(frame * 0.6)) : 0;
	const rh = handAt(pos, turn, [40, 60], 60 + jab * 30, 1);
	const light = gutLight(torchHand(pos, turn), [3.2, 1.2, 1.2], 0.9);
	const head = headAt(pos);
	const near = (
		<group>
			<Hero3D position={pos} turn={turn} scuba armR={prodding ? [40, 60] : [12, 8]} reachR={prodding ? 60 + jab * 30 : 0} armL={frame > grab ? [30, 100] : [12, 8]} reachL={frame > grab ? 60 : 0} face={frame > rumble ? 'scared' : prodding ? 'determined' : 'smug'} look={frame > here ? [-0.8, 0] : [0, 0]} />
			{frame > grab ? <HeldAmber pos={pos} turn={turn} /> : null}
			{frame > scoop ? <Beaks3D at={[head[0] + 0.15, 0.95, head[2] + 0.3]} r={0.2} n={22} y={0} s={1.1} seed={5} /> : null}
			{prodding ? <Beaks3D at={rh} r={0.001} n={1} y={0} s={1.8} seed={7} /> : null}
		</group>
	);
	const angles: Angle3[] = [
		{at: [head[0], head[1] - 0.2, head[2]], dist: 2.4, yaw: 60, pitch: 4, fov: 38, dyaw: 6},
		{at: [0.5, 1.4, 1], dist: 3.2, yaw: 20, pitch: 6, fov: 50, dyaw: -6},
		{at: [0.5, 1.4, 1], dist: 3.2, yaw: 40, pitch: 6, fov: 50, dyaw: 6},
		{at: [head[0], head[1] - 0.4, head[2]], dist: 2.2, yaw: 120, pitch: 10, fov: 44, dyaw: -6},
		{at: [2.6, 1.2, 1.2], dist: 2.4, yaw: 20, pitch: 6, fov: 46, dyaw: 6},
		withShake({at: [0.5, 1.8, 0.5], dist: 3.2, yaw: 300, pitch: 4, fov: 56}, frame, shudder + 4, 0.3, 1, 40),
		withShake({at: [0.5, 1.8, 0.5], dist: 3.2, yaw: 160, pitch: -4, fov: 56}, frame, rumble + 2, 0.35, 1.4, 60),
		withShake({at: [head[0], head[1] - 0.1, head[2]], dist: 1.6, yaw: 70, pitch: 2, fov: 36, ddist: -0.3}, frame, here, 0.2, 1.4, 50),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light}
				bg={BG.gut}
				far={<Forestomach frame={frame} beat={beat} squeeze={squeeze} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Vignette amount={0.45} />
						<AirHud frame={frame} left={AIR.plan} />
						<Label text="WHALES THROW UP MOST SQUID BEAKS" x={960} y={140} size={54} frame={frame} at={scientists + 10} until={grab - 6} color={UI.yellow} />
						<Big text="RUMBLE…" x={960} y={860} size={120} frame={frame} at={rumble + 6} until={here - 4} color={UI.orange} rotate={-4} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="crunch" at={scoop + 4} volume={0.4} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sound key={i} name="squeak" at={prod + 4 + i * 14} volume={0.25} />
			))}
			<Sound name="boom" at={shudder + 2} volume={0.35} />
			<Sound name="boom" at={rumble + 2} volume={0.45} />
			<Sound name="thud" at={here} volume={0.5} />
		</>
	);
};
