import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {cue, Finish, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Label, UI} from '../../../components/ui';
import {Ground} from '../../../three/giant3d';
import {Hero3D, type Hero3DProps} from '../../../three/Hero3D';
import {Bird3D} from '../../../three/sky3d';
import {Says, Shot3, type Angle3} from '../../../three/shot3';
import {T} from '../../../three/toon';
import {Frustum3D, Palm3D, PASTEL} from '../../../three/miami3d';
import {BG, CROWD, HUD, LIGHT, light, lookFrom, MiamiSet, P9, stutter} from './kit';
import type {V3} from './util';

// Part A: waking up on a beach in a game, Miami, the map with no way home,
// the people who say the same thing, the sea you can stand on, a world that
// is only there when you look, triangles, and frames.

/** You (or anyone) lying on your back, head towards -z. */
export const Lying: React.FC<{at: V3; yaw?: number} & Omit<Hero3DProps, 'position' | 'turn'>> = ({at, yaw = 0, ...rest}) => (
	<group position={at} rotation={[0, yaw, 0]}>
		<group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
			<Hero3D position={[0, -0.85, 0]} {...rest} />
		</group>
	</group>
);

const Studio: React.FC = () => <Ground color="#3A2E80" size={200} lines={{every: 2, color: '#4A3E98', along: 'z'}} />;

// ---------------------------------------------------------------- cold

const WAKE: V3 = [0, 0, 22];

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const bar = cue(l0, "there's a health bar");
	const same = cue(l0, 'And every single');
	const game = cue(l0, "You're inside");
	const player = l1.a;
	const off = cue(l1, 'this whole world');
	const out = cue(l1, 'You need to get out');
	const cuts = [0, bar - 4, same - 4, game - 4, player - 4, off - 4, out - 4];
	const sit = span(frame, bar - 10, bar + 14);
	const walkers = [0, 1, 2].map((i) => {
		const x = lerp(-14 + i * 4, 10 + i * 4, ((frame / 260 + i * 0.3) % 1));
		return <Hero3D key={i} who={CROWD[i]} position={[x, 0, WAKE[2] + 3 + i * 1.5]} turn={Math.PI / 2} walk={frame / 7 + i} lite face="happy" />;
	});
	const greyT = span(frame, off, off + 30) * (1 - span(frame, out, out + 20));
	const near = (
		<group>
			{sit < 0.5 ? (
				<Lying at={WAKE} face={frame > 20 ? 'shocked' : 'neutral'} blink={frame < 18 ? 1 : 0} armL={[20, 20]} armR={[20, 20]} />
			) : (
				<Hero3D position={WAKE} sit face={frame > game ? 'shocked' : 'scared'} turn={0.4} look={frame > same ? [-0.6, 0] : [0, 0.1]} armL={[30, 40]} armR={[30, 40]} />
			)}
			<T shape={{kind: 'box', w: 1.2, h: 0.03, d: 2.2}} color="#FF7AA8" position={[WAKE[0], 0.02, WAKE[2] - 0.2]} outline={0.01} />
			{walkers}
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([WAKE[0], 3.2, WAKE[2] - 0.2], [WAKE[0], 0.2, WAKE[2] - 0.25], 46, {roll: 90}),
		lookFrom([WAKE[0] + 3.4, 1.0, WAKE[2] + 3.2], [WAKE[0], 0.9, WAKE[2]], 42),
		lookFrom([WAKE[0] - 6, 1.4, WAKE[2] + 9], [WAKE[0] + 2, 1.1, WAKE[2] + 2], 46, {dyaw: 4}),
		lookFrom([WAKE[0] + 2.2, 1.0, WAKE[2] + 2.2], [WAKE[0], 0.95, WAKE[2]], 36),
		lookFrom([WAKE[0] + 40, 22, WAKE[2] + 50], [WAKE[0], 4, WAKE[2] - 20], 44, {dyaw: 3}),
		lookFrom([WAKE[0] + 30, 16, WAKE[2] + 40], [WAKE[0] - 20, 6, WAKE[2] - 40], 48),
		lookFrom([WAKE[0] + 2.2, 1.0, WAKE[2] + 2.2], [WAKE[0], 0.95, WAKE[2]], 34),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={greyT > 0 ? light(WAKE, 'grey', 40) : light(WAKE, 'day', 30)}
				bg={greyT > 0.3 ? BG.grey : BG.day}
				far={<MiamiSet frame={frame} grey={greyT} />}
				near={near}
				blur={0}
				overlay={(cam) => (
					<AbsoluteFill>
						{frame < 22 ? <AbsoluteFill style={{background: '#fff', opacity: 1 - span(frame, 2, 22)}} /> : null}
						<HUD frame={frame} health={1} fade={span(frame, bar, bar + 10)} />
						{frame > same && frame < game + 30 ? <Says cam={cam} head={[CROWD[0] ? lerp(-14, 10, ((frame / 260) % 1)) : 0, 1.9, WAKE[2] + 3]} text="Nice day for it!" frame={frame} at={same + 6} /> : null}
						<Big text="YOU'RE IN A GAME" x={960} y={860} size={90} frame={frame} at={game + 6} until={player - 4} color={UI.yellow} />
						<Label text="PLAYER COMES BACK = WORLD SWITCHES OFF" x={960} y={860} size={48} frame={frame} at={off + 8} until={out} color="#FF8A8A" />
						<Big text="GET OUT." x={960} y={300} size={130} frame={frame} at={out + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="appear" at={4} volume={0.3} />
			<Sound name="chime" at={bar + 2} volume={0.3} />
			<Sound name="vanish" at={off + 4} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- beach

export const Beach: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const hotels = cue(l0, 'Behind the beach');
	const real = cue(l0, "That's real");
	const deco = cue(l0, 'called Art Deco');
	const cuts = [0, hotels - 4, real - 4, deco - 4];
	const angles: Angle3[] = [
		lookFrom([12, 2.2, 40], [0, 4, 0], 48, {dyaw: 4}),
		lookFrom([-6, 1.8, 6], [10, 9, -26], 52, {dyaw: 3}),
		lookFrom([30, 12, 30], [-10, 8, -28], 44, {dyaw: 4}),
		lookFrom([4, 3, -10], [4, 10, -28], 54),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light([0, 0, -10], 'day', 40)}
				bg={BG.day}
				far={<MiamiSet frame={frame} />}
				near={<Hero3D position={[2, 0, 20]} turn={Math.PI + 0.3} face="happy" look={[0, 0.4]} armR={[150, 20]} />}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} />
						<Label text="MIAMI BEACH" x={960} y={220} size={60} frame={frame} at={8} until={hotels} color={UI.cream} />
						<Big text="≈ 960 HISTORIC BUILDINGS" x={960} y={860} size={78} frame={frame} at={real + 20} until={deco} color={UI.yellow} />
						<Label text="ART DECO · MOSTLY 1920s–1940s" x={960} y={860} size={56} frame={frame} at={deco + 10} color={UI.cream} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="whoosh" at={4} volume={0.2} />
		</>
	);
};

// ---------------------------------------------------------------- tuttle

export const Tuttle: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const woman = cue(l0, "It's often called");
	const rail = cue(l0, 'Julia Tuttle');
	const city = cue(l0, 'and in eighteen');
	const draw = span(frame, rail, city + 10);
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(160deg, #F6EBD2, #E8D4A8)', fontFamily: FONT}}>
				<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
					<path d="M900 120 C 980 300, 1000 500, 1060 700 C 1090 820, 1120 900, 1180 980 L 1920 980 L 1920 120 Z" fill="#9ED6E8" stroke="#5A4A3A" strokeWidth={6} />
					<path d="M900 120 C 980 300, 1000 500, 1060 700 C 1090 820, 1120 900, 1180 980" fill="none" stroke="#5A4A3A" strokeWidth={8} />
					{[...Array(16)].map((_, i) => <circle key={i} cx={760 + (i % 4) * 50} cy={500 + Math.floor(i / 4) * 60} r={12} fill="#8AA86A" opacity={0.6} />)}
					<path d={`M960 140 L 1000 ${140 + draw * 700}`} stroke="#3A2A1A" strokeWidth={10} strokeDasharray="30 14" fill="none" />
					{draw > 0.95 ? <circle cx={1004} cy={850} r={26} fill="#E8453C" stroke="#3A2A1A" strokeWidth={6} /> : null}
					<text x={1050} y={862} fontSize={54} fontWeight={700} fill="#3A2A1A" opacity={span(frame, city, city + 10)}>MIAMI, 1896</text>
					<g transform="translate(560 300)" opacity={span(frame, rail - 4, rail + 8)}>
						{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={Math.cos(i * 1.26) * 40} cy={Math.sin(i * 1.26) * 40} r={26} fill="#FFFFFF" stroke="#3A2A1A" strokeWidth={5} />)}
						<circle r={18} fill="#FFD84A" stroke="#3A2A1A" strokeWidth={5} />
						<text x={0} y={110} fontSize={34} fontWeight={700} fill="#3A2A1A" textAnchor="middle">ORANGE BLOSSOM</text>
					</g>
				</svg>
				<Label text="THE ONLY BIG U.S. CITY FOUNDED BY A WOMAN (OFTEN SAID)" x={960} y={220} size={44} frame={frame} at={woman + 10} color={UI.cream} />
				<Big text="JULIA TUTTLE" x={560} y={860} size={84} frame={frame} at={rail + 6} color="#E8453C" />
				<Finish />
			</AbsoluteFill>
			<Sound name="chime" at={city + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- map

export const MapShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const house = cue(l0, 'Your house');
	const not = cue(l0, "They're not there");
	const sea = cue(l0, 'The map stops');
	const zoom = span(frame, 6, house + 10);
	const search = (Math.sin(frame * 0.08) + 1) / 2;
	return (
		<>
			<AbsoluteFill style={{background: '#14103A', fontFamily: FONT}}>
				<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
					<defs>
						<clipPath id="mapc">
							<circle cx={960} cy={540} r={380} />
						</clipPath>
					</defs>
					<g clipPath="url(#mapc)">
						<g transform={`translate(960 540) scale(${lerp(3, 1, zoom)}) translate(-960 -540)`}>
							<rect x={0} y={0} width={1920} height={1080} fill="#2EC4D6" />
							<rect x={300} y={200} width={1320} height={320} fill="#E8DCCC" />
							<rect x={300} y={520} width={1320} height={110} fill="#F4DEA6" />
							<rect x={300} y={470} width={1320} height={36} fill="#55597A" />
							{[...Array(12)].map((_, i) => <rect key={i} x={330 + i * 105} y={260 + (i % 2) * 40} width={80} height={120} fill={PASTEL[i % PASTEL.length]} stroke="#140A28" strokeWidth={4} />)}
							<rect x={1200} y={620} width={40} height={460} fill="#C8C0B0" stroke="#140A28" strokeWidth={4} />
							<rect x={600} y={0} width={36} height={200} fill="#C8C0B0" stroke="#140A28" strokeWidth={4} />
							<path d="M960 470 L975 505 L960 495 L945 505 Z" fill="#FFD84A" stroke="#140A28" strokeWidth={4} />
						</g>
					</g>
					<circle cx={960} cy={540} r={380} fill="none" stroke="#140A28" strokeWidth={18} />
					<circle cx={960} cy={540} r={392} fill="none" stroke="#FFD84A" strokeWidth={6} />
					{frame > house ? (
						<g opacity={span(frame, house, house + 8)}>
							<circle cx={lerp(700, 1200, search)} cy={lerp(380, 300, search)} r={60} fill="none" stroke="#FFFFFF" strokeWidth={10} />
							<line x1={lerp(700, 1200, search) + 42} y1={lerp(380, 300, search) + 42} x2={lerp(700, 1200, search) + 90} y2={lerp(380, 300, search) + 90} stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" />
						</g>
					) : null}
				</svg>
				<Label text="YOUR HOUSE?  YOUR SCHOOL?" x={960} y={180} size={52} frame={frame} at={house + 4} until={not} color={UI.cream} />
				<Big text="NOT ON THE MAP" x={960} y={180} size={84} frame={frame} at={not + 4} until={sea + 30} color="#FF6A6A" />
				<Label text="NO ROAD HOME" x={960} y={900} size={60} frame={frame} at={sea + 20} color={UI.yellow} />
				<Finish />
			</AbsoluteFill>
			<Sound name="tick" at={house} volume={0.3} />
			<Sound name="thud" at={not + 4} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- npcs

const MAN: V3 = [6, 0, 8];

export const Npcs: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const again = cue(l0, 'You ask him again');
	const jogger = cue(l0, 'You ask a jogger');
	const gull = cue(l0, 'A seagull');
	const cuts = [0, again - 4, jogger - 4, gull - 4];
	const you: V3 = [MAN[0] - 1.6, 0, MAN[2] + 1.2];
	const jogX = lerp(-12, 20, span(frame, jogger - 30, gull + 10, (v) => v));
	const near = (
		<group>
			<Hero3D position={you} turn={2.1} face={frame > again ? 'neutral' : 'happy'} armR={frame < jogger ? [40, 80] : [14, 18]} reachR={40} />
			<Hero3D who={P9.hat} position={MAN} turn={-1.0} face="happy" talk={frame % 40 < 20 && frame < jogger ? 0.5 : 0} />
			<Hero3D who={P9.jogger} position={[jogX, 0, MAN[2] + 3]} turn={Math.PI / 2} run walk={frame / 4} face="happy" />
			<Bird3D kind="pigeon" at={[you[0] + 1.2, frame > gull ? 0 : lerp(4, 0, span(frame, gull - 20, gull)), you[2] + 0.4]} frame={frame} s={1.6} wing={frame > gull ? 'fold' : 'flap'} perch={frame > gull} yaw={-1.2} />
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([you[0] - 1, 1.6, you[2] + 4.2], [MAN[0], 1.5, MAN[2]], 42),
		lookFrom([you[0] + 0.6, 1.5, you[2] + 0.8], [MAN[0], 1.5, MAN[2]], 40),
		lookFrom([MAN[0] + 4, 1.4, MAN[2] + 8], [MAN[0], 1.2, MAN[2] + 2], 46),
		lookFrom([you[0] + 2.6, 0.7, you[2] + 2], [you[0] + 1.1, 0.5, you[2] + 0.4], 40),
	];
	const says = (cam: Parameters<typeof Says>[0]['cam']) => (
		<>
			{frame < jogger ? <Says cam={cam} head={[MAN[0], 1.9, MAN[2]]} text="Nice day for it!" frame={frame} at={frame < again ? 30 : again + 30} until={frame < again ? again - 6 : jogger - 6} /> : null}
			{frame >= jogger && frame < gull ? <Says cam={cam} head={[jogX, 1.9, MAN[2] + 3]} text="Nice day for it!" frame={frame} at={jogger + 14} until={gull - 4} /> : null}
		</>
	);
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={light(MAN, 'day', 20)} bg={BG.day} far={<MiamiSet frame={frame} />} near={near} blur={0} overlay={(cam) => <AbsoluteFill><HUD frame={frame} />{says(cam)}</AbsoluteFill>} />
			<Sound name="squeak" at={gull + 4} volume={0.25} />
		</>
	);
};

// ---------------------------------------------------------------- npc (the rules)

export const Npc: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const rules = cue(l0, 'The game moves');
	const walk = cue(l0, 'Walk.');
	const say = cue(l0, 'Say the line');
	const again = cue(l0, 'Walk again');
	const step = frame < say ? 0 : frame < again ? 1 : 2;
	const x = lerp(-2.5, 2.5, ((frame / 120) % 1));
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0]}
				angles={[{at: [0, 1.4, 0], dist: 9, yaw: 0, pitch: 6, fov: 40, dyaw: 4}]}
				light={LIGHT.studio}
				bg={BG.studio}
				far={<Studio />}
				near={<Hero3D who={P9.hat} position={[x, 0, 0]} turn={Math.PI / 2} walk={step === 1 ? undefined : frame / 7} talk={step === 1 ? 0.6 : 0} face="happy" />}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="NPC · NON-PLAYER CHARACTER" x={960} y={220} size={56} frame={frame} at={6} color={UI.yellow} />
						<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', opacity: span(frame, rules, rules + 10)}}>
							{['WALK', 'SAY LINE', 'WALK'].map((t, i) => {
								const on = i === step && frame > walk;
								return (
									<g key={i} transform={`translate(${560 + i * 400} 860)`}>
										<rect x={-150} y={-46} width={300} height={92} rx={46} fill={on ? '#FFD84A' : '#2A1E66'} stroke="#140A28" strokeWidth={6} />
										<text y={16} fontFamily={FONT} fontWeight={700} fontSize={42} fill={on ? '#140A28' : '#F2EEFF'} textAnchor="middle">{t}</text>
										{i < 2 ? <path d="M165 0 L235 0 M215 -16 L235 0 L215 16" stroke="#FFD84A" strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
									</g>
								);
							})}
						</svg>
					</AbsoluteFill>
				)}
			/>
		</>
	);
};

// ---------------------------------------------------------------- swim

export const Swim: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const stops = cue(l0, 'the water just stops');
	const stamp = cue(l0, 'You stamp');
	const look = cue(l0, 'You look down');
	const built = cue(l0, 'Nobody built');
	const cuts = [0, stops - 4, stamp - 4, look - 4, built - 4];
	const wade = span(frame, 0, stops, (v) => v);
	const z = lerp(40, 52, wade);
	const up = span(frame, stops, stops + 16);
	const y = lerp(-0.9 * (1 - up) * Math.min(1, wade * 3), 0.05, up);
	const stampK = frame > stamp ? Math.max(0, Math.sin((frame - stamp) * 0.4)) : 0;
	const near = <Hero3D position={[0, frame > stops ? 0.05 : y, z]} turn={Math.PI} walk={frame < stops ? frame / 7 : undefined} face={frame > look ? 'shocked' : 'neutral'} look={frame > look ? [0, -0.9] : [0, 0]} hop={stampK * 0.15} armL={[30, 30]} armR={[30, 30]} />;
	const angles: Angle3[] = [
		lookFrom([6, 2.0, 34], [0, 0.6, 48], 46),
		lookFrom([4, 1.2, z + 5], [0, 0.6, z], 42),
		lookFrom([2.4, 0.5, z + 2.4], [0, 0.3, z], 44),
		lookFrom([0.6, -2.6, z + 2.5], [0, 0.2, z], 52),
		lookFrom([10, 4, z + 14], [0, 0.5, z], 44, {dyaw: 4}),
	];
	const under = frame >= look - 4 && frame < built - 4;
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light([0, 0, 50], 'day', 20)}
				bg={under ? 'linear-gradient(#0A4A6A 0%, #04203A 100%)' : BG.day}
				far={<MiamiSet frame={frame} sea={under ? '#7FE6F2' : undefined} />}
				near={near}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<HUD frame={frame} />
						<Big text="CLONK." x={960} y={300} size={120} frame={frame} at={stamp + 6} until={look - 4} color={UI.cream} />
						<Label text="NOTHING DOWN HERE" x={960} y={860} size={60} frame={frame} at={look + 10} color={UI.yellow} />
					</AbsoluteFill>
				)}
			/>
			<Sound name="splash" at={6} volume={0.3} />
			<Sound name="thud" at={stamp + 4} volume={0.4} />
			<Sound name="thud" at={stamp + 14} volume={0.35} />
		</>
	);
};

// ---------------------------------------------------------------- popin

export const Popin: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const spin = cue(l0, 'you spin round');
	const grey = cue(l0, 'Just grey');
	const pop = cue(l0, 'Then the hotels');
	const cuts = [0, grey - 4, pop - 4];
	const turn = lerp(0, Math.PI, span(frame, spin, spin + 14));
	const p = span(frame, pop + 4, pop + 50, (v) => v);
	// The hotels pop in one by one, roof first; before that, only grey.
	const state = (i: number) => (frame < pop + 4 ? -1 : i % 6 < p * 7 ? 0 : -1);
	const angles: Angle3[] = [
		lookFrom([0, 1.6, 10], [0, 1.4, 4], 44),
		lookFrom([1.5, 1.7, 7.5], [0, 6, -26], 56),
		lookFrom([1.5, 1.7, 7.5], [0, 6, -26], 56),
	];
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={cuts}
				angles={angles}
				light={light([0, 0, 0], 'day', 30)}
				bg={frame >= grey - 4 && frame < pop + 4 ? BG.grey : BG.day}
				far={frame >= grey - 4 ? <group><MiamiSet frame={frame} palms={p > 0.5} cars={p > 0.3} hotelState={state} grey={frame < pop + 4 ? 1 : 0} /></group> : <MiamiSet frame={frame} />}
				near={<Hero3D position={[0, 0, 4]} turn={turn} face={frame > grey ? 'shocked' : 'neutral'} armL={[40, 40]} armR={[40, 40]} />}
				blur={0}
				overlay={() => <HUD frame={frame} />}
			/>
			<Sound name="whoosh" at={spin} volume={0.35} />
			{[0, 1, 2, 3, 4].map((i) => <Sound key={i} name="pop" at={pop + 6 + i * 8} volume={0.25} />)}
		</>
	);
};

// ---------------------------------------------------------------- culling

export const Culling: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const save = cue(l0, 'Games save work');
	const skipped = cue(l0, 'Everything outside');
	const behind = cue(l0, 'So right now');
	const yaw = Math.sin(frame * 0.02) * 0.9;
	const inView = (x: number, z: number) => {
		const a = Math.atan2(x, z);
		return Math.abs(a - yaw) < 0.62;
	};
	const props = [];
	for (let i = 0; i < 14; i++) {
		const a = (i / 14) * Math.PI * 2;
		const x = Math.sin(a) * 7;
		const z = Math.cos(a) * 7;
		const vis = inView(x, z);
		props.push(
			<group key={i} position={[x, 0, z]}>
				{vis ? (
					i % 2 ? <Palm3D at={[0, 0, 0]} h={3.4} seed={i} /> : <T shape={{kind: 'box', w: 1.4, h: 2.2, d: 1.4}} color={PASTEL[i % PASTEL.length]} position={[0, 1.1, 0]} outline={0.03} />
				) : (
					<mesh position={[0, 1.1, 0]}>
						<boxGeometry args={[1.4, 2.2, 1.4]} />
						<meshBasicMaterial color="#8A7AD8" wireframe />
					</mesh>
				)}
			</group>,
		);
	}
	return (
		<>
			<Shot3
				frame={frame}
				dur={dur}
				lines={lines}
				cuts={[0, save - 4]}
				angles={[{at: [0, 1, 0], dist: 15, yaw: 200, pitch: 34, fov: 44, dyaw: 6}, {at: [0, 1, 0], dist: 16, yaw: 160, pitch: 40, fov: 44, dyaw: 6}]}
				light={LIGHT.studio}
				bg={BG.studio}
				far={<Studio />}
				near={
					<group>
						<Frustum3D at={[0, 1.2, 0]} yaw={yaw} len={8} />
						{props}
					</group>
				}
				blur={0}
				overlay={() => (
					<AbsoluteFill>
						<Label text="ONLY WHAT THE CAMERA SEES GETS DRAWN" x={960} y={220} size={52} frame={frame} at={save + 10} color={UI.yellow} />
						<Label text="EVERYTHING ELSE: SKIPPED" x={960} y={860} size={56} frame={frame} at={skipped + 10} until={behind} color={UI.cream} />
						<Big text="BEHIND YOU: NOTHING" x={960} y={860} size={80} frame={frame} at={behind + 10} color="#FF8A8A" />
					</AbsoluteFill>
				)}
			/>
		</>
	);
};

// ---------------------------------------------------------------- triangles

const PALM_AT: V3 = [-26, 0, -9.5];

export const Triangles: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const poke = cue(l0, 'and poke it');
	const flat = cue(l0, "It's made of flat");
	const sand = cue(l0, 'So is the sand');
	const hand = cue(l0, 'So is your hand');
	const every = cue(l0, 'Every 3D');
	const cuts = [0, poke - 4, flat - 4, sand - 4, hand - 4, every - 4];
	const wire = span(frame, flat, flat + 12);
	const you: V3 = [PALM_AT[0] + 0.9, 0, PALM_AT[2] + 1.0];
	const near = (
		<group>
			<Palm3D at={PALM_AT} h={9} lean={0.12} seed={3} wire={wire} />
			<Hero3D position={you} turn={-2.4} armR={frame > poke ? [60, 70] : [14, 18]} reachR={70} face={frame > flat ? 'shocked' : 'neutral'} look={frame > hand && frame < every ? [0.6, -0.3] : [0, 0.2]} />
			{frame > hand - 4 ? (
				<mesh position={[you[0] + 0.1, 1.05, you[2] - 0.45]}>
					<sphereGeometry args={[0.1, 6, 4]} />
					<meshBasicMaterial color="#FFFFFF" wireframe />
				</mesh>
			) : null}
			{frame > sand - 4 ? (
				<mesh position={[you[0], 0.06, you[2] + 1]} rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[6, 6, 8, 8]} />
					<meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.6} />
				</mesh>
			) : null}
		</group>
	);
	const angles: Angle3[] = [
		lookFrom([you[0] + 5, 1.8, you[2] + 6], [PALM_AT[0], 2.4, PALM_AT[2]], 44),
		lookFrom([you[0] + 1.6, 1.3, you[2] + 0.8], [PALM_AT[0] + 0.2, 1.2, PALM_AT[2] + 0.1], 40),
		lookFrom([PALM_AT[0] + 1.3, 2.0, PALM_AT[2] + 1.6], [PALM_AT[0] + 0.2, 1.6, PALM_AT[2]], 46),
		lookFrom([you[0] + 2, 2.4, you[2] + 3], [you[0], 0, you[2] + 1], 50),
		lookFrom([you[0] + 0.7, 1.3, you[2] - 0.4], [you[0] + 0.1, 1.05, you[2] - 0.45], 40),
		lookFrom([you[0] + 12, 6, you[2] + 14], [PALM_AT[0], 3, PALM_AT[2]], 46, {dyaw: 4}),
	];
	return (
		<>
			<Shot3 frame={frame} dur={dur} lines={lines} cuts={cuts} angles={angles} light={light(PALM_AT, 'day', 20)} bg={BG.day} far={<MiamiSet frame={frame} />} near={near} blur={0} overlay={() => <AbsoluteFill><HUD frame={frame} /><Label text="FLAT TRIANGLES" x={960} y={860} size={60} frame={frame} at={flat + 10} until={every - 4} color={UI.yellow} /><Label text="EVERY 3D GAME: MILLIONS OF TRIANGLES" x={960} y={860} size={52} frame={frame} at={every + 6} color={UI.cream} /></AbsoluteFill>} />
			<Sound name="pop" at={poke + 10} volume={0.3} />
		</>
	);
};

// ---------------------------------------------------------------- fps

export const Fps: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const gull = cue(l0, 'A seagull');
	const still = cue(l0, "Games aren't");
	const films = cue(l0, 'Films usually');
	const sixty = cue(l0, 'Lots of games');
	const studio = frame >= still - 4;
	const f = frame < still ? stutter(frame, frame % 50 < 25 ? 6 : 1) : frame;
	const flip = Math.floor(frame / (frame > sixty ? 1 : 2.5)) % 12;
	return (
		<>
			{studio ? (
				<AbsoluteFill style={{background: BG.studio, fontFamily: FONT}}>
					<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
						{[...Array(6)].map((_, i) => (
							<g key={i} transform={`translate(${960 - 30 * (5 - i)} ${520 - 14 * (5 - i)})`} opacity={0.3 + i * 0.12}>
								<rect x={-260} y={-170} width={520} height={340} rx={16} fill="#F4F2FF" stroke="#140A28" strokeWidth={6} />
							</g>
						))}
						<g transform="translate(960 520)">
							<rect x={-260} y={-170} width={520} height={340} rx={16} fill="#BFF0FF" stroke="#140A28" strokeWidth={6} />
							<g transform={`translate(${-180 + flip * 30} ${-40 + Math.sin(flip) * 20})`}>
								<ellipse rx={50} ry={22} fill="#FFFFFF" stroke="#140A28" strokeWidth={5} />
								<path d={`M-10 0 L-60 ${flip % 2 ? -50 : 20} L10 -6 Z`} fill="#E8E8F0" stroke="#140A28" strokeWidth={5} />
								<path d={`M10 0 L60 ${flip % 2 ? -50 : 20} L-10 -6 Z`} fill="#E8E8F0" stroke="#140A28" strokeWidth={5} />
							</g>
						</g>
					</svg>
					<Label text="STILL PICTURES, VERY FAST" x={960} y={220} size={56} frame={frame} at={still + 6} until={films - 2} color={UI.yellow} />
					<Label text="FILMS: 24 A SECOND" x={960} y={860} size={60} frame={frame} at={films + 6} until={sixty - 2} color={UI.cream} />
					<Big text="MANY GAMES: 60 A SECOND" x={960} y={860} size={80} frame={frame} at={sixty + 6} color={UI.yellow} />
					<Finish />
				</AbsoluteFill>
			) : (
				<Shot3
					frame={f}
					dur={dur}
					lines={lines}
					cuts={[0, gull - 4]}
					angles={[lookFrom([6, 1.8, 30], [0, 3, 10], 46), lookFrom([3, 3, 18], [0, 4.5, 10], 44)]}
					light={light([0, 0, 10], 'day', 30)}
					bg={BG.day}
					far={<MiamiSet frame={f} />}
					near={
						<group>
							<Hero3D position={[1, 0, 22]} turn={Math.PI} face="neutral" look={[0, 0.6]} />
							<Bird3D kind="pigeon" at={[lerp(-8, 8, (f % 120) / 120), 4.5, 10]} frame={f} s={2} yaw={Math.PI / 2} />
						</group>
					}
					blur={0}
					overlay={() => <HUD frame={f} />}
				/>
			)}
			<Sound name="tick" at={still + 4} volume={0.25} loop={films - still} />
		</>
	);
};


