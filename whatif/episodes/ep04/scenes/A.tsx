import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ant3D} from '../../../three/bugs3d';
import {Alarm3D, BedTop, Brick3D, Carpet, Cornflake3D, DustBall3D, Ground, MM, Rice3D, Ruler3D, Sock3D} from '../../../three/giant3d';
import {Hero3D} from '../../../three/Hero3D';
import {Mouse3D} from '../../../three/bugs3d';
import {Ray} from '../../../three/props3d2';
import {Box} from '../../../three/sets3d';
import {project} from '../../../three/Stage3D';
import {Shot3, Says, Thought} from '../../../three/shot3';
import {Glow, T} from '../../../three/toon';
import {BG, LIGHT} from './kit';
import {mixArm, top, type V3} from './util';

// Part A: waking up three millimetres tall, falling safely, the carpet jungle,
// the square-cube law, and meeting Pip.

/** A glowing arrow from a to b with a cone head. */
export const Arrow: React.FC<{a: V3; b: V3; color: string; r?: number}> = ({a, b, color, r = 0.08}) => {
	const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
	const len = Math.hypot(...d);
	if (len < 0.05) {
		return null;
	}
	const u: V3 = [d[0] / len, d[1] / len, d[2] / len];
	const h = Math.min(len * 0.45, r * 5);
	const shaftEnd: V3 = [b[0] - u[0] * h, b[1] - u[1] * h, b[2] - u[2] * h];
	return (
		<group>
			<Ray a={a} b={shaftEnd} r={r} color={color} />
			<group position={[shaftEnd[0] + (u[0] * h) / 2, shaftEnd[1] + (u[1] * h) / 2, shaftEnd[2] + (u[2] * h) / 2]} rotation={[u[1] < 0 ? Math.PI : 0, 0, 0]}>
				<Glow shape={{kind: 'cone', r: r * 2.6, h}} color={color} />
			</group>
		</group>
	);
};

/** A hero lying on their back (feet at `at`, head towards -z), sitting up as `up` goes 0..1. */
const Lying: React.FC<{at: V3; up: number; children: React.ReactNode}> = ({at, up, children}) => (
	<group position={at} rotation={[lerp(-Math.PI / 2, 0, up), 0, 0]}>
		{children}
	</group>
);

// ---------------------------------------------------------------- cold

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const wrong = cue(l0, 'something');
	const miles = cue(l0, 'Your duvet');
	const cliff = cue(l0, 'Your pillow');
	const alarm = cue(l0, 'And far');
	const shrunk = cue(l1, "You've shrunk");
	const sitUp = span(frame, wrong - 4, wrong + 14);
	const stand = span(frame, miles - 10, miles + 6);
	const stretch = span(frame, 6, 30) * (1 - span(frame, wrong - 10, wrong));
	const you: V3 = [0, 0, 8];
	const arm = mixArm([12, 6], [168, 176], stretch);
	const lookAround = frame > miles ? Math.sin((frame - miles) * 0.05) * 0.9 : 0;
	const hero = (
		<Hero3D
			position={stand > 0.5 ? you : [0, 0, 0]}
			turn={stand > 0.5 ? lookAround * 0.8 : 0}
			face={frame > shrunk ? 'shocked' : frame > wrong ? 'scared' : stretch > 0.3 ? 'happy' : 'neutral'}
			blink={frame < 10 ? 1 : undefined}
			look={stand > 0.5 ? [lookAround, 0.3] : [0, 0]}
			armL={arm}
			armR={arm}
			sit={stand <= 0.5 && sitUp > 0.5}
		/>
	);
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, miles - 4, cliff - 4, alarm - 4, shrunk - 6]}
				angles={[
					{at: [0, 0.6, 7], dist: 7, yaw: 25, pitch: 30, dyaw: 8},
					{at: [-10, 4, -10], dist: 46, yaw: 35, pitch: 10, fov: 40, dyaw: -8},
					{at: [-4, 9, -30], dist: 46, yaw: -12, pitch: 3, fov: 40},
					{at: [30, 28, -50], dist: 70, yaw: -28, pitch: -14, fov: 40, dyaw: 4},
					{at: [0, 1.25, 8], dist: 2.6, yaw: 12, pitch: 4, fov: 30},
				]}
				light={LIGHT.bedroom}
				bg={BG.bedroom}
				far={
					<group>
						<BedTop top={0} edge={30} />
						<Alarm3D at={[34, 0, -62]} frame={frame} ring={frame > alarm - 10 ? 1 : 0.4} s={2.2} />
					</group>
				}
				near={stand > 0.5 ? hero : <Lying at={[you[0], 0.3, you[2] + 0.2]} up={sitUp}>{hero}</Lying>}
			/>
			{frame > alarm - 10 ? <Sound name="ring" at={alarm - 10} volume={0.35} loop={shrunk - alarm} /> : null}
			<Sound name="swish" at={wrong - 4} volume={0.35} />
			<Sound name="boom" at={shrunk - 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- size

export const Size: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const ant = cue(l0, 'The size');
	const times = cue(l0, "That's");
	const rice = cue(l1, 'A single');
	const carpet = cue(l1, 'Crossing');
	const bed = cue(l1, 'And your bed');
	const shotOf = frame < l1.a - 6 ? 0 : frame < rice - 4 ? 1 : frame < carpet - 4 ? 2 : frame < bed - 4 ? 3 : 4;
	const you: V3 = [-1.2 + 3 * MM, 0, -2];
	const walk = frame / 22;
	let far: React.ReactNode;
	let near: React.ReactNode;
	let overlay: React.ReactNode = null;
	if (shotOf <= 1) {
		far = <Ground color="#E8D8C0" />;
		near = (
			<group>
				<Ruler3D at={[0, 0, -2]} len={26} from={0} />
				<Hero3D position={you} face={shotOf === 1 ? 'happy' : 'shocked'} look={[0, -0.3]} />
				{/* the bracket from the 0 mark to the top of your head */}
				<Box size={[0.06, 1.7, 0.06]} at={[you[0] + 0.9, 0.85, -2]} color={UI.yellow} outline={0.01} />
			</group>
		);
	} else if (shotOf === 2) {
		far = <Ground color="#E8D8C0" />;
		near = (
			<group>
				<Ruler3D at={[0, 0, -4]} len={30} />
				<Rice3D at={[1.4, 0, -1.2]} />
				<Hero3D position={[-1.6, 0, -1.2]} turn={0.5} face="shocked" look={[0.8, 0]} />
			</group>
		);
	} else if (shotOf === 3) {
		far = <Carpet size={110} clear={2} gap={[0, 0]} seed={2} />;
		near = <Hero3D position={[lerp(-2, 2, span(frame, carpet, carpet + 60)), 0, 0]} walk={walk} turn={Math.PI / 2} face="neutral" />;
	} else {
		far = (
			<group>
				<Carpet size={120} clear={3} gap={[0, 18]} seed={4} center={[0, 10]} />
				<BedTop top={150} edge={-10} />
			</group>
		);
		near = <Hero3D position={[0, 0, 18]} turn={Math.PI} face="shocked" look={[0, 1]} />;
	}
	const angles = [
		{at: [0.5, 0.9, -2] as V3, dist: 7.5, yaw: 0, pitch: 18, fov: 32, dyaw: 0},
		{at: [0.5, 0.9, -2] as V3, dist: 6.5, yaw: 8, pitch: 30, fov: 32},
		{at: [0, 0.8, -1.2] as V3, dist: 7.5, yaw: 12, pitch: 18, fov: 32},
		{at: [0, 0, 0] as V3, dist: 34, yaw: 20, pitch: 58, fov: 40, ddist: 6},
		{at: [0, 40, -10] as V3, dist: 60, yaw: 0, pitch: -26, fov: 44, dyaw: 0, ddist: -4},
	];
	if (shotOf === 0) {
		overlay = null;
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, l1.a - 6, rice - 4, carpet - 4, bed - 4]}
				angles={angles}
				light={shotOf >= 3 ? LIGHT.carpet : LIGHT.kitchen}
				bg={shotOf >= 3 ? BG.carpet : BG.kitchen}
				far={far}
				near={near}
				overlay={(cam) => {
					if (shotOf <= 1) {
						const [x, y] = project(cam, [you[0] + 1.4, 1.0, -2]);
						return (
							<>
								<Label text="YOU: 3 MM" x={x + 150} y={y} frame={frame} at={14} size={54} color={UI.yellow} />
								<Label text="THE SIZE OF AN ANT" x={960} y={220} frame={frame} at={ant} size={46} />
								<Big text="500× SMALLER" x={960} y={880} size={110} frame={frame} at={times + 8} />
							</>
						);
					}
					if (shotOf === 2) {
						return <Label text="ONE GRAIN OF RICE = A CAR" x={960} y={860} frame={frame} at={rice} size={52} color={UI.yellow} />;
					}
					if (shotOf === 3) {
						return <Label text="CROSSING YOUR ROOM ≈ 2 KM" x={960} y={860} frame={frame} at={carpet + 4} size={56} color={UI.yellow} />;
					}
					return <Label text="YOUR BED = A SKYSCRAPER (250 M)" x={960} y={860} frame={frame} at={bed + 4} size={52} color={UI.yellow} />;
				}}
			/>
			{overlay}
			<Sound name="pop" at={14} volume={0.35} />
			<Sound name="boom" at={times + 8} volume={0.3} />
			<Sound name="pop" at={rice} volume={0.3} />
			<Sound name="steps" at={carpet} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- fall

const H = 70; // the height of the bed, from ant height (cheated down from 280 so it fits the camera)

export const Fall: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slip = cue(l0, 'and slip');
	const fall = cue(l0, 'You fall');
	const land = cue(l0, 'You land');
	const bounce = cue(l0, 'You bounce');
	const standUp = cue(l0, 'You stand');
	const scratch = cue(l0, 'Not a');
	const tip = span(frame, slip - 2, slip + 10);
	// fall slowly and steadily: a small thing soon stops speeding up
	const y = frame < slip + 6 ? H : frame < land ? lerp(H, 0, Math.min(1, (frame - slip - 6) / (land - slip - 6))) : 0;
	const hop = frame >= land && frame < standUp ? Math.abs(Math.sin(((frame - land) / (standUp - land)) * Math.PI * 2)) * Math.max(0, 1 - (frame - land) / (standUp - land)) * 1.6 : 0;
	const spin = frame > slip && frame < land ? (frame - slip) * 0.05 : 0;
	const pos: V3 = frame < slip + 6 ? [0, H, -1 + tip * 0.6] : [0, y, 3];
	const airborne = frame > slip + 6 && frame < land;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, fall - 4, land - 2, scratch - 6]}
				angles={[
					{at: [0, H + 0.6, -1], dist: 6.5, yaw: 160, pitch: 38, fov: 38, dyaw: 0},
					{at: [0, Math.max(1, y) + 0.8, 3], dist: 7, yaw: 30, pitch: 4, fov: 36, dyaw: 30, ddist: 0},
					{at: [0, 0.8, 3], dist: 6.5, yaw: -20, pitch: 8, fov: 34},
					{at: [0, 1.2, 3], dist: 2.8, yaw: 10, pitch: 4, fov: 30},
				]}
				light={LIGHT.bedroom}
				bg={BG.bedroom}
				far={
					<group>
						<Carpet size={90} clear={4} gap={[0, 3]} seed={7} />
						<BedTop top={H} edge={0} />
					</group>
				}
				near={
					<group position={[0, hop, 0]}>
						<group position={pos} rotation={[airborne ? Math.sin(spin) * 0.5 : tip * 0.5, spin, airborne ? Math.cos(spin * 0.7) * 0.3 : 0]}>
							<Hero3D position={[0, 0, 0]} turn={frame < slip + 6 ? Math.PI : 0} face={frame > scratch - 4 ? 'happy' : frame > slip ? 'scared' : 'neutral'} look={frame < slip ? [0, -0.8] : [0, 0]} armL={airborne ? [150, 165] : frame > scratch ? [150, 200] : undefined} armR={airborne ? [150, 165] : frame > scratch ? [150, 200] : undefined} />
						</group>
					</group>
				}
				overlay={() =>
					airborne ? (
						<AbsoluteFill style={{pointerEvents: 'none'}}>
							{[...Array(14)].map((_, i) => {
								const x = 200 + ((i * 397) % 1520);
								const yy = 1080 - (((frame * 26 + i * 211) % 1300) - 100);
								return <div key={i} style={{position: 'absolute', left: x, top: yy, width: 6, height: 140, borderRadius: 3, background: 'rgba(255,255,255,0.55)'}} />;
							})}
						</AbsoluteFill>
					) : frame > scratch - 2 ? (
						<Label text="NOT A SCRATCH" x={960} y={860} frame={frame} at={scratch} size={58} color={UI.green} />
					) : null
				}
			/>
			<Sound name="whoosh" at={slip} volume={0.45} />
			<Sound name="thud" at={land} volume={0.35} />
			<Sound name="pop" at={bounce} volume={0.3} />
			<Sound name="chime" at={scratch} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- haldane

/** An old magazine page with the essay's title. */
const Essay: React.FC<{frame: number; at: number; until: number}> = ({frame, at, until}) => {
	const p = span(frame, at, at + 14) * (1 - span(frame, until, until + 10));
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{background: `rgba(10,6,30,${0.6 * p})`}}>
			<div style={{position: 'absolute', left: 960, top: 545, width: 640, height: 760, transform: `translate(-50%, -50%) rotate(${-3 + 3 * (1 - p)}deg) scale(${0.85 + 0.15 * p})`, opacity: p, background: 'linear-gradient(160deg, #F7EBCB, #E8D5A6)', borderRadius: 8, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', fontFamily: 'Georgia, serif', color: '#3A2A1A', padding: '56px 60px'}}>
				<div style={{fontSize: 26, letterSpacing: 6, textAlign: 'center'}}>HARPER'S MAGAZINE · 1926</div>
				<div style={{height: 4, background: '#3A2A1A', margin: '18px 0 28px'}} />
				<div style={{fontSize: 64, lineHeight: 1.05, textAlign: 'center', fontWeight: 700}}>On Being the Right Size</div>
				<div style={{fontSize: 30, textAlign: 'center', marginTop: 18, fontStyle: 'italic'}}>by J. B. S. Haldane</div>
				<div style={{fontSize: 27, lineHeight: 1.5, marginTop: 36, textAlign: 'justify'}}>
					“You can drop a mouse down a thousand-yard mine shaft; and, on arriving at the bottom, it gets a slight shock and walks away.”
				</div>
				<div style={{position: 'absolute', left: 60, right: 60, bottom: 50, display: 'flex', flexDirection: 'column', gap: 14}}>
					{[0.95, 0.88, 0.92, 0.7].map((w, i) => (
						<div key={i} style={{height: 10, width: `${w * 100}%`, background: 'rgba(58,42,26,0.25)', borderRadius: 5}} />
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Haldane: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const wrote = cue(l0, 'A hundred');
	const drop = cue(l0, 'drop a mouse');
	const bottom = cue(l0, 'and at the bottom');
	const walkAway = cue(l0, 'walk away');
	const shaft = 26; // depth of the shaft
	const my = frame < drop ? shaft : frame < bottom ? lerp(shaft, 0.02, (frame - drop) / (bottom - drop)) : 0.02;
	const landed = frame >= bottom;
	const squash = landed ? Math.max(0, 1 - (frame - bottom) / 8) : 0;
	const walk = frame > walkAway ? (frame - walkAway) / 14 : undefined;
	const mx = frame > walkAway ? (frame - walkAway) * 0.05 : 0;
	const diagram = frame >= l1.a - 4;
	// Diagram: weight goes with size cubed, air push with size squared.
	const big = 2.6;
	const small = 0.9;
	const fallBig = diagram ? Math.min(6, ((frame - l1.a) / 30) ** 2 * 1.2) : 0;
	const fallSmall = diagram ? Math.min(6, (frame - l1.a) / 30 * 0.6) : 0;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, drop - 6, bottom - 8, l1.a - 4, cue(l1, 'So small') - 4]}
				angles={[
					{at: [0, shaft + 1, 0], dist: 9, yaw: 20, pitch: 60, fov: 40},
					{at: [0, my + 0.5, 0], dist: 7, yaw: 25, pitch: 30, fov: 38, ddist: 0},
					{at: [0.5, 0.6, 0], dist: 5, yaw: 30, pitch: 14, fov: 34},
					{at: [0, 3, 0], dist: 16, yaw: 0, pitch: 4, fov: 36},
					{at: [0, 3, 0], dist: 15, yaw: 10, pitch: 4, fov: 36},
				]}
				light={diagram ? LIGHT.studio : LIGHT.mine}
				bg={diagram ? BG.studio : BG.mine}
				blur={diagram ? 0 : 2.5}
				far={
					diagram ? (
						<Box size={[80, 0.1, 80]} at={[0, -0.05, 0]} color="#2A2160" outline={0} />
					) : (
						<group>
							{/* the shaft: four walls of rock, wooden props every few metres, soft earth at the bottom */}
							<Ground color="#6A4A2E" size={40} />
							{[-1, 1].map((s) => (
								<group key={s}>
									<Box size={[0.6, shaft + 10, 8]} at={[s * 3.2, (shaft + 10) / 2, 0]} color="#5A3A26" outline={0.04} />
									<Box size={[8, shaft + 10, 0.6]} at={[0, (shaft + 10) / 2, s * 3.2]} color="#4A2E1E" outline={0.04} />
								</group>
							))}
							{[...Array(6)].map((_, i) => (
								<Box key={i} size={[6.4, 0.5, 0.5]} at={[0, 3 + i * 5, -2.9]} color="#A8724A" outline={0.03} />
							))}
							{[...Array(9)].map((_, i) => (
								<T key={`e${i}`} shape={{kind: 'sphere', r: 0.6 + (i % 3) * 0.2, seg: 12}} color="#7A5A3A" position={[-2 + (i % 3) * 2, 0.05, -2 + Math.floor(i / 3) * 2]} scale={[1, 0.35, 1]} outline={0.03} />
							))}
						</group>
					)
				}
				near={
					diagram ? (
						<group>
							<group position={[-3.5, 6 - fallBig, 0]}>
								<T shape={{kind: 'box', w: big, h: big, d: big}} color="#FF8A3D" outline={0.04} />
								<Arrow a={[0, -big / 2 - 0.1, big / 2 + 0.2]} b={[0, -big / 2 - 3.2, big / 2 + 0.2]} color="#FF5A5A" r={0.14} />
								<Arrow a={[0, big / 2 + 0.1, big / 2 + 0.2]} b={[0, big / 2 + 1.2, big / 2 + 0.2]} color="#7FE0FF" r={0.14} />
							</group>
							<group position={[3.5, 6 - fallSmall, 0]}>
								<T shape={{kind: 'box', w: small, h: small, d: small}} color="#7CF2A0" outline={0.03} />
								<Arrow a={[0, -small / 2 - 0.1, small / 2 + 0.2]} b={[0, -small / 2 - 0.7, small / 2 + 0.2]} color="#FF5A5A" r={0.1} />
								<Arrow a={[0, small / 2 + 0.1, small / 2 + 0.2]} b={[0, small / 2 + 0.7, small / 2 + 0.2]} color="#7FE0FF" r={0.1} />
							</group>
						</group>
					) : (
						<group>
							<group position={[mx, my, 0]}>
								<Mouse3D at={[0, 0, 0]} frame={frame} rot={walk === undefined ? 0.6 : Math.PI / 2} walk={walk} squash={squash} s={1.2} />
							</group>
						</group>
					)
				}
				overlay={(cam) =>
					diagram ? (
						<>
							<Label text="WEIGHT" x={project(cam, [-3.5, 6 - fallBig - 3.0, 1.6])[0] - 170} y={project(cam, [-3.5, 6 - fallBig - 2.6, 1.6])[1]} frame={frame} at={l1.a + 6} size={40} color={UI.red} />
							<Label text="AIR PUSH" x={project(cam, [-3.5, 6 - fallBig + 2.2, 1.6])[0] - 190} y={project(cam, [-3.5, 6 - fallBig + 2.2, 1.6])[1]} frame={frame} at={l1.a + 14} size={40} color={UI.cyan} />
							<Big text={fallBig >= 6 ? 'FAST' : ''} x={600} y={900} size={90} frame={frame} at={l1.a + 40} color={UI.red} />
							<Big text="SLOW" x={1320} y={900} size={90} frame={frame} at={cue(l1, 'So small')} color={UI.green} />
						</>
					) : null
				}
			/>
			<Essay frame={frame} at={wrote - 4} until={drop - 10} />
			<Sound name="swish" at={drop} volume={0.3} />
			<Sound name="thud" at={bottom} volume={0.25} />
			<Sound name="pop" at={l1.a + 6} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- carpet

export const CarpetScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const fibre = cue(l0, 'Every fibre');
	const dust = cue(l0, 'A ball of dust');
	const brick = cue(l0, 'A toy brick');
	const sock = cue(l0, 'And somewhere');
	const walk = frame / 20;
	const you: V3 = [0, 0, lerp(4, -2, span(frame, 0, dust))];
	const dx = lerp(-16, 16, span(frame, dust - 10, brick, (t) => t));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, fibre - 4, dust - 6, brick - 4, sock - 4]}
				angles={[
					{at: [0, 3, 0], dist: 18, yaw: 15, pitch: 8, fov: 40},
					{at: [you[0], 1.2, you[2]], dist: 5, yaw: 150, pitch: 18, fov: 36, dyaw: 20},
					{at: [0, 1.5, -2], dist: 10, yaw: 5, pitch: 4, fov: 38, dyaw: 0},
					{at: [-6, 4, -14], dist: 26, yaw: 30, pitch: 4, fov: 38},
					{at: [10, 8, -30], dist: 46, yaw: -10, pitch: 4, fov: 40},
				]}
				light={LIGHT.carpet}
				bg={BG.carpet}
				far={
					<group>
						<Carpet size={110} clear={3.5} gap={[0, 0]} seed={11} />
						<Brick3D at={[-12, 0, -16]} rot={0.4} color="#3FB7E8" />
						<Sock3D at={[18, 0, -46]} rot={-0.3} />
					</group>
				}
				near={
					<group>
						<Hero3D position={frame < dust ? you : [0, 0, -2]} turn={frame < dust ? Math.PI : frame > brick ? Math.PI + 0.6 : 0.3} walk={frame < dust ? walk : undefined} face={frame > dust ? 'shocked' : 'happy'} look={frame > dust && frame < brick ? [Math.max(-1, Math.min(1, dx / 8)), 0] : [0, 0.2]} />
						{frame > dust - 12 ? <DustBall3D at={[dx, 2.3, 1.5]} roll={-dx / 2.3} /> : null}
					</group>
				}
			/>
			<Sound name="steps" at={0} volume={0.2} />
			<Sound name="whoosh" at={dust} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- strong

export const Strong: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const push = cue(l0, 'You give');
	const moves = cue(l0, 'it moves');
	const lift = cue(l0, 'You lift');
	const shake = cue(l0, 'Your arms');
	const slide = span(frame, moves - 6, moves + 14);
	const up = span(frame, lift, lift + 24);
	const flakeAt: V3 = up > 0 ? [0, lerp(0.9, 2.55, up), lerp(-3.4, 0, up)] : [0, 0.9, lerp(-3.9, -3.4, slide)];
	const pushArm: [number, number] = [70, 95];
	const liftArm: [number, number] = [172, 178];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, push - 6, lift - 4, shake - 4]}
				angles={[
					{at: [0, 1.5, -2], dist: 13, yaw: 25, pitch: 10, fov: 38},
					{at: [0, 1, -1.5], dist: 5.5, yaw: 70, pitch: 6, fov: 36},
					{at: [0, 1.6, 0], dist: 8, yaw: -25, pitch: 2, fov: 36},
					{at: [0, 1.5, 0], dist: 4.2, yaw: 15, pitch: -4, fov: 34},
				]}
				light={LIGHT.underbed}
				bg={BG.under}
				far={
					<group>
						<Carpet size={80} clear={5} gap={[0, -1]} seed={13} color="#5A3E98" />
						<Box size={[300, 2, 300]} at={[0, 34, -100]} color="#2A1E50" outline={0} />
					</group>
				}
				near={
					<group>
						<Hero3D position={[0, 0, up > 0 ? 0 : lerp(-0.6, -0.2, slide)]} turn={Math.PI} armL={up > 0 ? liftArm : pushArm} armR={up > 0 ? liftArm : pushArm} reachL={up > 0 ? 0 : 40} reachR={up > 0 ? 0 : 40} face={frame > shake ? 'smug' : 'determined'} lean={up > 0 ? 0 : 10} walk={frame > push && frame < moves + 10 && up === 0 ? frame / 16 : undefined} />
						<Cornflake3D at={flakeAt} rot={[up > 0 ? 0 : -1.2 + 1.2 * 0, 0.3, 0]} s={0.42} />
					</group>
				}
				overlay={() => <Big text="LIKE LIFTING A BUS" x={960} y={880} size={80} frame={frame} at={lift + 20} color={UI.yellow} />}
			/>
			<Sound name="swish" at={moves - 4} volume={0.3} />
			<Sound name="whoosh" at={lift + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- cube

export const Cube: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const thick = cue(l0, 'How strong');
	const heavy = cue(l0, 'How heavy');
	const weaker = cue(l1, 'and your muscles');
	const weight = cue(l1, 'But your weight');
	const result = cue(l1, 'So for your size');
	const galileo = l2.a;
	const antsToo = cue(l2, 'Ants have');
	const shrink = span(frame, l1.a, l1.a + 40);
	const s = lerp(3, 0.6, shrink);
	const slice = frame > thick && frame < galileo;
	const whole = frame > heavy && frame < galileo;
	const showAnt = frame > antsToo - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, thick - 4, heavy - 4, l1.a - 4, result - 4, galileo - 4, antsToo - 4]}
				angles={[
					{at: [0, 1.8, 0], dist: 12, yaw: 30, pitch: 18, fov: 36},
					{at: [0, 1.8, 0], dist: 11, yaw: 40, pitch: 16, fov: 36},
					{at: [0, 1.8, 0], dist: 11, yaw: 20, pitch: 22, fov: 36},
					{at: [0, 1.5, 0], dist: 12, yaw: 25, pitch: 18, fov: 36},
					{at: [0, 1.3, 2], dist: 6, yaw: 15, pitch: 6, fov: 34},
					{at: [0, 1.5, 0], dist: 12, yaw: 25, pitch: 18, fov: 36},
					{at: [0, 0.9, 2], dist: 6.5, yaw: 40, pitch: 10, fov: 34},
				]}
				light={LIGHT.studio}
				bg={BG.studio}
				blur={0}
				far={<Box size={[80, 0.1, 80]} at={[0, -0.05, 0]} color="#2A2160" outline={0} />}
				near={
					frame > result - 4 && frame < galileo - 4 ? (
						<group>
							<Hero3D position={[0, 0, 2]} armL={[172, 178]} armR={[172, 178]} face="happy" />
							<Cornflake3D at={[0, 2.55, 2]} rot={[0, 0.3, 0]} s={0.42} />
						</group>
					) : showAnt ? (
						<group>
							<Ant3D at={[0, 0, 2]} rot={0.6} frame={frame} walk={frame / 18} look={undefined} />
							<group position={[0.3, 1.6, 2.6]}>
								<T shape={{kind: 'sphere', r: 0.9, seg: 24}} color="#7CC25A" scale={[1.4, 0.15, 1]} outline={0.03} />
							</group>
						</group>
					) : (
						<group position={[0, s / 2, 0]}>
							<T shape={{kind: 'box', w: s, h: s, d: s}} color={whole ? '#FF8A6A' : '#C9B8FF'} opacity={slice ? 0.55 : 1} outline={0.03} />
							{slice ? <T shape={{kind: 'box', w: s * 1.02, h: s * 1.02, d: s * 0.06}} color="#FFD84A" outline={0.02} emissive="#FFD84A" emissiveIntensity={0.4} /> : null}
						</group>
					)
				}
				overlay={() => (
					<>
						{frame < l1.a - 4 ? <Label text="STRENGTH: HOW THICK (A SLICE)" x={960} y={210} frame={frame} at={thick + 4} size={44} color={UI.yellow} /> : null}
						{frame < l1.a - 4 ? <Label text="WEIGHT: ALL OF YOU (THE WHOLE BLOCK)" x={960} y={880} frame={frame} at={heavy + 4} size={44} color={UI.red} /> : null}
						{frame >= l1.a - 4 && frame < result - 4 ? (
							<>
								<Label text="STRENGTH ÷ 250,000" x={960} y={220} frame={frame} at={weaker} size={54} color={UI.yellow} />
								<Label text="WEIGHT ÷ 125,000,000" x={960} y={870} frame={frame} at={weight} size={54} color={UI.red} />
							</>
						) : null}
						{frame >= result - 4 && frame < galileo - 4 ? <Big text="500× STRONGER" x={960} y={880} size={110} frame={frame} at={result + 10} color={UI.green} /> : null}
						{frame >= galileo - 4 && frame < antsToo - 4 ? <Galileo frame={frame} at={galileo} /> : null}
					</>
				)}
			/>
			<Sound name="pop" at={thick + 4} volume={0.3} />
			<Sound name="pop" at={heavy + 4} volume={0.3} />
			<Sound name="swish" at={l1.a} volume={0.3} />
			<Sound name="boom" at={result + 10} volume={0.3} />
			<Sound name="chime" at={galileo + 4} volume={0.3} />
		</>
	);
};

/** Galileo's book, 1638. */
const Galileo: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const p = span(frame, at, at + 14);
	return (
		<AbsoluteFill style={{background: `rgba(10,6,30,${0.55 * p})`}}>
			<div style={{position: 'absolute', left: 960, top: 545, width: 520, height: 680, transform: `translate(-50%, -50%) rotate(${3 - 3 * p}deg) scale(${0.85 + 0.15 * p})`, opacity: p, background: 'linear-gradient(160deg, #F2E4C4, #DCC79A)', borderRadius: 8, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', fontFamily: 'Georgia, serif', color: '#3A2A1A', textAlign: 'center', padding: '60px 40px'}}>
				<div style={{fontSize: 30, letterSpacing: 5}}>DISCORSI</div>
				<div style={{fontSize: 22, letterSpacing: 2, marginTop: 8}}>“TWO NEW SCIENCES”</div>
				<div style={{height: 3, background: '#3A2A1A', margin: '26px 30px'}} />
				<div style={{fontSize: 60, fontWeight: 700, lineHeight: 1.1}}>GALILEO<br />GALILEI</div>
				<svg width={200} height={200} viewBox="0 0 200 200" style={{marginTop: 26}}>
					<rect x={30} y={70} width={110} height={110} fill="none" stroke="#3A2A1A" strokeWidth={6} />
					<rect x={150} y={150} width={30} height={30} fill="none" stroke="#3A2A1A" strokeWidth={6} />
				</svg>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, fontSize: 40, fontWeight: 700}}>1638</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- ant

export const AntScene: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const legs = cue(l0, 'Six legs');
	const antIs = cue(l0, "It's an ant");
	const pony = cue(l0, 'the size of a pony');
	const taps = l1.a;
	const notFood = cue(l1, 'decides');
	const pip = cue(l1, 'You decide');
	const come = span(frame, 0, legs + 10);
	const antAt: V3 = [lerp(0.8, 0.6, come), lerp(2.6, 0, Math.min(1, come * 1.6)) * 0, lerp(-9, -0.6, come)];
	const tap = frame > taps ? Math.max(0, Math.sin((frame - taps) * 0.22)) * span(frame, taps, taps + 6) * (1 - span(frame, notFood + 6, notFood + 14)) : 0;
	const you: V3 = [-0.4, 0, 1.6];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, legs - 4, antIs - 4, pony - 4, taps - 4, pip - 4]}
				angles={[
					{at: [0, 1.2, -3], dist: 9, yaw: 160, pitch: 6, fov: 36},
					{at: [antAt[0], 0.8, antAt[2]], dist: 4.2, yaw: 20, pitch: 6, fov: 34},
					{at: [0, 1, 0.5], dist: 8, yaw: 70, pitch: 10, fov: 36},
					{at: [0.2, 1, 0.5], dist: 7, yaw: 90, pitch: 4, fov: 34},
					{at: [-0.1, 1.2, 1], dist: 3.6, yaw: 40, pitch: 6, fov: 32},
					{at: [0.1, 1.1, 0.6], dist: 5.2, yaw: -30, pitch: 6, fov: 34},
				]}
				light={LIGHT.carpet}
				bg={BG.carpet}
				far={<Carpet size={100} clear={4} gap={[0, -2]} seed={17} />}
				near={
					<group>
						<Ant3D at={antAt} rot={0} frame={frame} pip walk={come < 1 ? frame / 16 : undefined} tap={tap} gaze={frame > taps ? [-0.3, 0.6] : [0, 0]} jaws={frame > taps && frame < notFood ? 0.4 : 0} />
						<Hero3D position={you} turn={Math.PI + 0.25} face={frame > pip ? 'happy' : frame > notFood ? 'neutral' : 'scared'} look={[0, frame > taps ? 0.4 : 0]} armL={frame < notFood ? [30, 60] : undefined} armR={frame < notFood ? [30, 60] : undefined} lean={frame > taps && frame < notFood ? -8 : 0} />
					</group>
				}
				overlay={(cam) => (
					<>
						<Label text="ANT ≈ A PONY, TO YOU" x={960} y={870} frame={frame} at={pony + 4} until={taps - 6} size={50} color={UI.yellow} />
						{frame > pip ? <Says cam={cam} head={top(you[0], you[2])} text="I'll call you Pip!" frame={frame} at={pip + 6} /> : null}
						{frame > taps + 6 && frame < pip ? <Thought cam={cam} head={[antAt[0], 1.9, antAt[2]]} text="Not food." frame={frame} at={notFood} /> : null}
					</>
				)}
			/>
			<Sound name="steps" at={0} volume={0.25} />
			<Sound name="tick" at={taps} volume={0.25} />
			<Sound name="chime" at={pip + 6} volume={0.3} />
		</>
	);
};
