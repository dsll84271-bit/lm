import React from 'react';
import {Easing} from 'remotion';
import {Hero} from '../../../characters/Hero';
import {blinking, cue, lerp, Sound, span, type ShotProps} from '../../../components/stage';
import {Big, Bubble, Calendar, Count, Label, PhoneFeed, SpeedRace, UI} from '../../../components/ui';
import {Cake, LabBench, Room, ROOMS, StudioLights} from '../../../sets/indoor';
import {City, Field, Lightning, Rain, Sky} from '../../../sets/outdoor';
import {CAST, close, CityBack, detail, GROUND, H, medium, Shot, Street, wide} from './kit';

// Part 3: wonder, fame, and the cost.

const INK = '#140A28';

export const Race: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const goAt = cue(l0, 'so you shuffle');
	const x = lerp(260, 1600, span(frame, goAt, l1.a + 10, Easing.linear));
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), close(x, GROUND, H, 0.06), detail(x, GROUND - 40, 2.6), wide(1300, 560, 1.15)]}
			world={
				<g>
					<Field lines="track" />
					<rect x={1700} y={GROUND - 160} width={18} height={400} fill="#fff" />
					<rect x={1700} y={GROUND - 160} width={260} height={40} fill="#fff" opacity={0.5} />
					{[0, 1].map((i) => (
						<Hero key={i} who={i ? CAST.crowdA : CAST.crowdC} x={lerp(260, 900, span(frame, goAt, l1.a + 10)) - 160 - i * 160} y={GROUND + 60 + i * 30} size={H * 0.9} face="determined" walk={frame / 6} run />
					))}
					<Hero x={x} y={GROUND + 20} size={H} face={frame > l1.a ? 'happy' : 'determined'} walk={frame > goAt ? frame / 40 : undefined} armL={frame > l1.a ? [150, 165] : [30, 60]} armR={frame > l1.a ? [150, 165] : [30, 60]} />
				</g>
			}
			slow={{at: goAt, until: l1.a, strength: 0.7}}
			overlay={
				<>
					<Label text="YOU: 1 CM/S" x={480} y={200} frame={frame} at={cue(l0, 'One centimetre')} />
					<Label text="REAL WORLD: 10 M/S" x={1440} y={200} frame={frame} at={cue(l0, 'ten metres')} color={UI.yellow} />
					<SpeedRace frame={frame} at={cue(l0, 'Usain')} x={960} y={780} w={1100} items={[{label: 'USAIN BOLT', speed: 1, color: UI.green}, {label: 'YOU', speed: 0.97, color: UI.orange}, {label: 'EVERYONE ELSE', speed: 0.6, color: UI.cyan}]} />
					<Big text="9.98 S" x={960} y={500} size={130} frame={frame} at={l1.a} color={UI.green} />
					<Label text="FOR YOU: ≈ 3 HOURS" x={1440} y={290} frame={frame} at={cue(l1, 'three hours')} color={UI.red} />
				</>
			}
		/>
	);
};

const Hummingbird: React.FC<{x: number; y: number; wing: number}> = ({x, y, wing}) => (
	<g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
		<path d={`M-10 -10 Q-60 ${-80 - wing * 40} -140 ${-60 - wing * 60} Q-70 ${-20} -10 10 Z`} fill="#7FE0FF" opacity={0.85} />
		<ellipse cx={0} cy={0} rx={60} ry={26} fill="#2EA86A" transform="rotate(-15)" />
		<circle cx={56} cy={-24} r={22} fill="#2EA86A" />
		<path d="M76 -26 L170 -36 L76 -18 Z" fill="#2A2350" />
		<circle cx={62} cy={-30} r={5} fill={INK} />
		<path d="M-50 10 L-110 40 L-60 20 Z" fill="#E8453C" />
	</g>
);

export const Quiet: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const birdAt = cue(l0, 'A hummingbird');
	const voiceAt = l1.a;
	if (frame < voiceAt - 4) {
		return (
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(960, 540, 1.05), detail(1200, 460, 2.6), close(760, GROUND, H, 0.06), detail(1200, 460, 3.2, 4)]}
				bg={<CityBack time="night" />}
				world={
					<g>
						<Street time="night" wet stop={false} />
						<Hero x={760} y={GROUND + 20} size={H} face="happy" look={[0.8, -0.4]} blink={blinking(frame)} />
						{frame > birdAt ? <Hummingbird x={1200} y={460} wing={Math.abs(Math.sin(frame * 0.05))} /> : null}
						<Rain t={frame * 0.3} long={0} />
					</g>
				}
				slow={{at: -10}}
				overlay={
					<>
						<Label text="RAIN ≈ A SNAIL'S PACE" x={480} y={200} frame={frame} at={cue(l0, 'snail')} />
						<Label text="WINGS: 50 / S → 1 PER 20 S" x={1440} y={200} frame={frame} at={cue(l0, 'one lazy')} color={UI.yellow} />
					</>
				}
			/>
		);
	}
	const f = frame - voiceAt;
	return (
		<Shot
			frame={f}
			dur={dur - voiceAt}
			lines={[{...l1, a: 0, b: l1.b - voiceAt}]}
			angles={[medium(1000), close(1260, GROUND, H, 0.06, 3), wide(1000, 540, 1.1)]}
			world={
				<Room look={ROOMS.bedroomDay} decor="bedroom" window={{x: 200, w: 380}}>
					<Hero x={760} y={GROUND} size={H} face="sad" look={[0.8, 0]} />
					<Hero who={CAST.friend} x={1260} y={GROUND} size={H} face="happy" talk={0.3 + 0.3 * Math.abs(Math.sin(f * 0.4))} armL={[60 + Math.sin(f * 0.15) * 30, 110]} flip />
					{[0, 1, 2].map((i) => (
						<ellipse key={i} cx={1180 - i * 120 - (f % 60)} cy={560} rx={30 + i * 40} ry={60 + i * 50} fill="none" stroke="#7FE0FF" strokeWidth={6} opacity={0.5 - i * 0.12} strokeDasharray="14 12" />
					))}
				</Room>
			}
			slow={{at: -10}}
			overlay={
				<>
					<Label text="A VOICE ≈ 200 VIBRATIONS / S" x={520} y={200} frame={frame} at={cue(l1, 'two hundred')} />
					<Label text="SLOWED: TOO LOW TO HEAR" x={1400} y={200} frame={frame} at={cue(l1, 'far too low')} color={UI.red} />
					<Bubble text="..." x={1260} y={250} tx={1260} ty={320} frame={frame} at={voiceAt + 10} until={dur} size={60} />
				</>
			}
		/>
	);
};

export const LightningShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const slowAt = cue(l0, 'In slow time');
	const p = frame < slowAt ? (frame % 20 < 4 ? 1 : 0) : span(frame, slowAt, dur - 10, Easing.linear);
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(960, 520, 1.05), detail(1200, 300, 1.8), close(760, GROUND - 80, H, 0.06, -3), wide(1000, 480, 1.15)]}
				bg={
					<g>
						<Sky time="storm" />
						<City time="night" back />
					</g>
				}
				world={
					<g>
						<City time="night" />
						<rect x={-400} y={GROUND - 80} width={2720} height={700} fill="#2A2350" stroke={INK} strokeWidth={6} />
						<Lightning p={p} />
						<Hero x={760} y={GROUND - 80} size={H} face="happy" sit look={[0.8, -0.8]} />
						<Rain t={frame < slowAt ? frame * 30 : slowAt * 30 + (frame - slowAt) * 0.03} long={frame < slowAt ? 34 : 0} />
					</g>
				}
				slow={{at: slowAt, strength: 0.6}}
				overlay={
					<>
						<Label text="A FLASH ≈ 1/5 SECOND" x={480} y={200} frame={frame} at={cue(l0, 'fifth of a second')} />
						<Label text="SLOWED: 3+ MINUTES" x={1440} y={200} frame={frame} at={cue(l0, 'three minutes')} color={UI.yellow} />
					</>
				}
			/>
			<Sound name="boom" at={8} volume={0.5} />
		</>
	);
};

export const Famous: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	if (frame < l1.a - 4) {
		return (
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(960, 540, 1.05), detail(1300, 470, 2.2), close(820, GROUND, H, 0.06)]}
				world={
					<Room look={ROOMS.gamer} decor="gamer">
						<Hero x={760} y={GROUND} size={H} face="shocked" look={[0.8, 0]} armR={[60, 120]} />
					</Room>
				}
				overlay={
					<>
						<PhoneFeed frame={frame} at={6} views={frame > cue(l0, 'fifty million') ? 50000000 : 120000} x={1360} y={540} comments={['HOW DID THEY CATCH THAT', 'fake 100%', 'slow it down 0.25x...', 'NO WAY', 'this is edited right??']}>
							<svg viewBox="0 0 400 420" width={400} height={420}>
								<rect width={400} height={420} fill="#4A6FD8" />
								<Hero x={200} y={400} size={300} face="smug" armR={[100, 130]} />
							</svg>
						</PhoneFeed>
					</>
				}
			/>
		);
	}
	if (frame < l2.a - 4) {
		const f = frame - l1.a;
		return (
			<>
				<Shot
					frame={f}
					dur={l2.a - l1.a}
					lines={[{...l1, a: 0, b: l1.b - l1.a}]}
					angles={[wide(960, 540, 1.05), detail(1150, 560, 2.2), close(800, GROUND, H, 0.06, 3)]}
					world={
						<Room look={ROOMS.studio} decor="studio">
							<StudioLights />
							<Hero who={CAST.host} x={1350} y={GROUND} size={H * 1.1} face="happy" armL={[100 + Math.sin(f * 0.3) * 30, 120]} talk={Math.abs(Math.sin(f * 0.45)) * 0.6} hop={Math.max(0, Math.sin(f * 0.2)) * 0.08} flip />
							<Hero x={800} y={GROUND} size={H} face="smug" armR={[100, 130]} armL={[100, 130]} />
							{[0, 1, 2, 3, 4].map((i) => (
								<rect key={i} x={1020 + i * 50} y={560 + ((i * 37) % 80) - Math.min(30, f * 0.05)} width={16} height={60} rx={6} fill="#C9CED8" stroke={INK} strokeWidth={4} transform={`rotate(${i * 30} ${1028 + i * 50} ${590 + ((i * 37) % 80)})`} />
							))}
						</Room>
					}
					slow={{at: 10, strength: 0.6}}
				/>
				<Sound name="crowd" at={l1.a + cue({...l1, a: 0, b: l1.b - l1.a}, 'screams') - 0} volume={0.4} />
			</>
		);
	}
	const f = frame - l2.a;
	const lightP = (f % 60) / 60;
	return (
		<Shot
			frame={f}
			dur={dur - l2.a}
			lines={[{...l2, a: 0, b: l2.b - l2.a}]}
			angles={[wide(960, 540, 1.05), detail(900, 560, 2.6), close(1450, GROUND, H, 0.06), medium(1200)]}
			world={
				<Room look={ROOMS.lab} decor="lab">
					<LabBench x={540} />
					<g transform="translate(900 560)">
						<path d="M-80 60 L-80 -20 Q-80 -60 -40 -70 L-40 -120 L40 -120 L40 -70 Q80 -60 80 -20 L80 60 Z" fill="#BFE8FF" opacity={0.6} stroke={INK} strokeWidth={6} />
						<circle cx={lerp(-70, 70, lightP)} cy={10} r={14} fill="#FFF3B0" />
						<circle cx={lerp(-70, 70, lightP)} cy={10} r={34} fill="#FFF3B0" opacity={0.3} />
					</g>
					<Hero who={CAST.scientist} x={1450} y={GROUND} size={H * 1.1} face="happy" armL={[90 + Math.sin(f * 0.2) * 20, 100]} talk={Math.abs(Math.sin(f * 0.5)) * 0.5} flip />
					<Hero x={1180} y={GROUND} size={H} face="smug" />
				</Room>
			}
			overlay={
				<>
					<Label text="MIT · 2011" x={480} y={200} frame={frame} at={cue(l2, 'two thousand and eleven')} color={UI.yellow} />
					<Label text="≈ 1 TRILLION FRAMES / S" x={1440} y={200} frame={frame} at={cue(l2, 'trillion')} color={UI.cyan} />
				</>
			}
		/>
	);
};

export const Cost: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[medium(960), close(960, GROUND, H, 0.08), wide(960, 540, 1.05)]}
			world={
				<g>
					<rect x={-400} y={-400} width={2720} height={1900} fill="#140E38" />
					<circle cx={960} cy={420} r={330} fill="#7F5AF0" opacity={0.12} />
					<Hero x={960} y={GROUND} size={H} face={frame > l1.a ? 'sad' : 'neutral'} />
				</g>
			}
			overlay={
				<>
					<Label text="1 SLOW MINUTE ≈ 16 HOURS OF YOUR LIFE" x={960} y={200} frame={frame} at={cue(l0, 'sixteen hours')} color={UI.red} />
					<Label text="15 MIN A DAY = +10 DAYS, EVERY DAY" x={960} y={860} frame={frame} at={cue(l0, 'Fifteen minutes')} color={UI.yellow} />
					<Calendar frame={frame} at={l1.a} from={14} to={15} label="FRIENDS: AGE" x={480} y={540} color="#2EA86A" />
					<Calendar frame={frame} at={cue(l1, 'more like eleven')} from={14} to={25} label="YOUR BODY: AGE" x={1440} y={540} />
				</>
			}
		/>
	);
};

export const Sleep: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), close(1300, GROUND, H, 0.06), detail(700, GROUND - 80, 2.2)]}
			world={
				<Room look={ROOMS.classroom} decor="classroom">
					<Hero who={CAST.crowdA} x={1300} y={GROUND} size={H} face="happy" sit armR={[80, 150]} />
					<Hero who={CAST.crowdB} x={1650} y={GROUND} size={H} face="neutral" sit armL={[80, 150]} />
					<g transform={`translate(700 ${GROUND - 60}) rotate(-90)`}>
						<Hero x={0} y={0} size={H * 0.9} face="sad" blink={1} />
					</g>
					{[0, 1, 2].map((i) => {
						const t = ((frame + i * 25) % 75) / 75;
						return (
							<text key={i} x={760 + t * 80} y={GROUND - 260 - t * 160} fontFamily="Fredoka" fontWeight={700} fontSize={50 + i * 12} fill="#fff" opacity={Math.sin(t * Math.PI)} stroke={INK} strokeWidth={5} paintOrder="stroke">
								z
							</text>
						);
					})}
				</Room>
			}
			slow={{at: -10}}
			overlay={
				<>
					<Label text="≈ 8 HOURS SLEEP PER DAY AWAKE" x={960} y={200} frame={frame} at={cue(l0, 'eight hours')} />
					<Count from={0} to={21} x={960} y={760} size={110} frame={frame} at={cue(l0, 'twenty one')} dur={30} suffix=" NIGHTS IN ONE LUNCH" color={UI.yellow} />
				</>
			}
		/>
	);
};

export const Lonely: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 540, 1.1), close(960, GROUND + 20, H, 0.08), detail(1400, 520, 2)]}
			bg={<CityBack time="dusk" />}
			world={
				<g>
					<Street time="dusk" stop={false} />
					<rect x={1240} y={380} width={320} height={420} rx={8} fill="#BFE3FA" opacity={0.35} stroke={INK} strokeWidth={6} />
					{[200, 480, 1350, 1650].map((x, i) => (
						<Hero key={x} who={[CAST.crowdA, CAST.crowdB, CAST.crowdC, CAST.friend][i]} x={x} y={GROUND + 30} size={H * 0.95} face="neutral" walk={0.25} flip={i % 2 === 1} />
					))}
					<Hero x={960} y={GROUND + 20} size={H} face="sad" look={[0.8, 0]} />
				</g>
			}
			slow={{at: -10}}
			overlay={<Label text="AGE 14" x={960} y={860} frame={frame} at={cue(l0, "You're fourteen")} color={UI.red} />}
		/>
	);
};

export const Drift: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), close(1350, GROUND, H, 0.06, 3), close(700, GROUND, H, 0.06, -3), detail(1000, GROUND - 300, 2.2)]}
			world={
				<Room look={ROOMS.kitchen} decor="kitchen" window={{x: 160, w: 380}}>
					<rect x={760} y={GROUND - 220} width={500} height={220} fill="#C98A5A" stroke={INK} strokeWidth={6} />
					<Cake x={1010} />
					<Hero who={CAST.friend} x={1400} y={GROUND} size={H} face="happy" armL={[150 + Math.sin(frame * 0.3) * 15, 165]} armR={[150 - Math.sin(frame * 0.3) * 15, 165]} hop={Math.max(0, Math.sin(frame * 0.3)) * 0.08} talk={frame < cue(l0, 'You miss') ? Math.abs(Math.sin(frame * 0.5)) * 0.6 : 0} flip />
					<Hero x={620} y={GROUND} size={H} face="sad" look={[0.6, 0]} blink={blinking(frame)} />
				</Room>
			}
			overlay={
				<>
					<Bubble text="Remember what I said?" x={1400} y={260} tx={1400} ty={330} frame={frame} at={4} until={cue(l0, 'You miss')} size={36} />
					<Label text="FOR YOU: AN EXTRA SUMMER" x={960} y={860} frame={frame} at={cue(l0, 'extra summer')} color={UI.yellow} />
				</>
			}
		/>
	);
};

export const Doctor: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), close(1300, GROUND, H, 0.06, 3), detail(1080, 440, 2.4), close(720, GROUND, H, 0.06)]}
			world={
				<Room look={ROOMS.clinic} decor="clinic">
					<rect x={960} y={300} width={240} height={300} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
					{[0, 1, 2, 3].map((i) => (
						<rect key={i} x={990} y={340 + i * 60} width={180 - (i % 2) * 50} height={14} rx={7} fill="#AEB8C8" />
					))}
					<Hero who={CAST.doctor} x={1320} y={GROUND} size={H * 1.1} face={frame > cue(l0, 'checks it twice') ? 'shocked' : 'determined'} armL={[90 + Math.sin(frame * 0.15) * 15, 100]} look={[Math.sin(frame * 0.06), 0]} flip />
					<Hero x={720} y={GROUND} size={H} face="smug" sit armL={[40, 60]} armR={[40, 60]} />
				</Room>
			}
			overlay={
				<>
					<Label text="DATE OF BIRTH SAYS: 14" x={480} y={200} frame={frame} at={cue(l0, 'birth certificate')} />
					<Label text="YOUR BODY SAYS: OLDER" x={1440} y={200} frame={frame} at={cue(l0, 'birth certificate') + 12} color={UI.red} />
				</>
			}
		/>
	);
};
