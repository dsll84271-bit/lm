import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Hero} from '../../../characters/Hero';
import {blinking, cue, lerp, SnapRing, Sound, span, Svg, track, type ShotProps} from '../../../components/stage';
import {Big, Bubble, Count, Label, UI} from '../../../components/ui';
import {Board, Desk, Phone, Room, ROOMS, Stove} from '../../../sets/indoor';
import {Bus, Pigeon, Rain, Splash} from '../../../sets/outdoor';
import {CAST, close, CityBack, detail, GROUND, H, medium, Shot, Street, wide} from './kit';

// Part 1: the first snap, the blackout, learning to slow time.

const RAIN_SPEED = 30;

export const Cold: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const snapAt = cue(l0, 'snap');
	const frozen = frame >= snapAt;
	const rt = frozen ? snapAt * RAIN_SPEED : frame * RAIN_SPEED;
	const x = lerp(220, 640, Math.min(1, frame / snapAt));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(900, 560, 1.05), close(x, GROUND, H, 0.1, -4), detail(1260, 700, 2.2), wide(800, 560, 1.15)]}
				bg={<CityBack time="night" />}
				world={
					<g>
						<Street time="night" wet />
						<Bus x={1100} doors={track(frame, [[0, 1], [snapAt, 0.45]])} />
						<Hero x={x} y={GROUND + 20} size={H} face={frozen ? 'smug' : 'determined'} walk={frozen ? undefined : frame / 9} armR={frozen ? [110, 160] : [40, 80]} armL={[40, 80]} />
						<Rain t={rt} long={frozen ? 0 : 34} />
					</g>
				}
				slow={{at: snapAt}}
				overlay={<SnapRing frame={frame} at={snapAt} x={960} y={420} />}
			/>
			<Sound name="rain" at={0} volume={0.35} loop={snapAt} />
			<Sound name="snap" at={snapAt} volume={0.9} />
			<Sound name="whoosh" at={snapAt + 2} volume={0.4} />
		</>
	);
};

export const Frozen: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [, l1] = lines;
	const blackAt = l1.a;
	const x = lerp(600, 980, span(frame, 0, blackAt, Easing.linear));
	const dark = span(frame, blackAt + 6, blackAt + 22);
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[detail(700, 380, 2.4), detail(560, GROUND + 40, 2.2), medium(900), close(960, GROUND + 20, H, 0.1, 3), wide(900, 560, 1.1)]}
				bg={<CityBack time="night" />}
				world={
					<g>
						<Street time="night" wet />
						<Bus x={1100} doors={0.45} />
						<Splash x={560} rise={0.7} />
						<Pigeon x={700} y={380} flap={0.8} s={1.3} />
						<Hero x={x} y={GROUND + 20} size={H} face={frame > blackAt ? 'scared' : 'smug'} walk={frame < blackAt ? frame / 14 : undefined} look={[-0.6, -0.3]} />
						<Rain t={0} long={0} />
					</g>
				}
				slow={{at: -10}}
				overlay={<AbsoluteFill style={{background: '#000', opacity: dark}} />}
			/>
			<Sound name="thud" at={blackAt + 6} volume={0.4} />
		</>
	);
};

export const Black: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const lightAt = cue(l0, 'light is always');
	const airAt = cue(l0, 'And the air');
	const glow = 0.25 + 0.1 * Math.sin(frame * 0.2);
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[close(960, GROUND, H, 0.06), wide(960, 540, 1), close(960, GROUND, H, 0.12, -3), wide(960, 540, 1.1)]}
			world={
				<g>
					<rect x={-400} y={-400} width={2720} height={1900} fill="#05030C" />
					<g opacity={glow + 0.4}>
						<Hero x={960} y={GROUND} size={H} face="scared" look={[0, -0.2]} />
					</g>
					{frame > lightAt ? (
						<g>
							<circle cx={260} cy={260} r={40} fill="#FFE7A8" />
							<line x1={290} y1={280} x2={lerp(290, 760, span(frame, lightAt, lightAt + 20))} y2={lerp(280, 400, span(frame, lightAt, lightAt + 20))} stroke="#FFE7A8" strokeWidth={10} strokeDasharray="30 20" />
							{[0, 1, 2, 3, 4].map((i) => (
								<circle key={i} cx={lerp(290, 760, span(frame, lightAt, lightAt + 20)) - i * 60} cy={lerp(280, 400, span(frame, lightAt, lightAt + 20)) - i * 15} r={9} fill="#FFF8D8" />
							))}
						</g>
					) : null}
					{frame > airAt
						? [...Array(40)].map((_, i) => <circle key={i} cx={760 + ((i * 97) % 420)} cy={460 + ((i * 53) % 280)} r={6} fill="#7FE0FF" opacity={0.8} />)
						: null}
				</g>
			}
			overlay={
				<>
					<Label text="LIGHT ≈ 300,000 KM/S" x={520} y={200} frame={frame} at={cue(l0, 'three hundred thousand')} until={airAt} color={UI.yellow} />
					<Label text="STOPPED: NO NEW LIGHT" x={1400} y={860} frame={frame} at={cue(l0, 'Stop time')} until={airAt} color={UI.red} />
					<Label text="AIR MOLECULES ≈ 500 M/S" x={560} y={200} frame={frame} at={cue(l0, 'five hundred')} color={UI.cyan} />
					<Label text="FROZEN: NOTHING TO BREATHE" x={1380} y={860} frame={frame} at={cue(l0, 'Freeze them')} color={UI.red} />
				</>
			}
			dark={1.3}
		/>
	);
};

export const Gasp: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [, l1] = lines;
	const practise = l1.a;
	const bigAt = cue(l1, 'A thousand');
	if (frame < practise - 4) {
		return (
			<>
				<Shot
					frame={frame}
					dur={dur}
					lines={lines}
					angles={[close(760, GROUND + 20, H, 0.06), wide(1000, 560, 1.05), medium(760, GROUND + 20)]}
					bg={<CityBack time="night" />}
					world={
						<g>
							<Street time="night" wet />
							<Bus x={lerp(1100, 2600, span(frame, 10, practise, Easing.in(Easing.quad)))} doors={0} />
							<Hero x={760} y={GROUND + 20} size={H} face="scared" sit armL={[60, 120]} armR={[60, 120]} />
							<Rain t={frame * RAIN_SPEED} long={34} />
						</g>
					}
					overlay={<SnapRing frame={frame} at={0} x={760} y={420} />}
				/>
				<Sound name="snap" at={0} volume={0.8} />
				<Sound name="rain" at={0} volume={0.35} loop={practise} />
			</>
		);
	}
	const f = frame - practise;
	return (
		<>
			<Shot
				frame={f}
				dur={dur - practise}
				lines={[{...l1, a: 0, b: l1.b - practise}]}
				angles={[wide(960, 540, 1.05), close(960, GROUND, H, 0.1), medium(960)]}
				world={
					<Room look={ROOMS.bedroomNight} window={{x: 1300, w: 420, night: true}}>
						<Hero x={960} y={GROUND} size={H} face={frame > bigAt ? 'smug' : 'determined'} armR={[110, 160]} thinking={frame < bigAt - 20} />
					</Room>
				}
				slow={{at: bigAt - practise, strength: 0.7}}
				overlay={
					<>
						<Label text="NIGHT 1" x={300} y={200} frame={f} at={4} until={30} />
						<Label text="NIGHT 2" x={300} y={200} frame={f} at={36} until={66} />
						<Label text="NIGHT 3" x={300} y={200} frame={f} at={72} />
						<Big text="1,000× SLOWER" x={960} y={760} size={110} frame={frame} at={bigAt} />
						<SnapRing frame={frame} at={bigAt} x={1120} y={380} />
					</>
				}
			/>
			<Sound name="snap" at={bigAt} volume={0.8} />
			<Sound name="chime" at={bigAt + 4} volume={0.5} />
		</>
	);
};

export const Rules: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[medium(960), close(960, GROUND + 20, H, 0.08, 2), wide(960, 560, 1.05)]}
			bg={<CityBack time="night" />}
			world={
				<g>
					<Street time="night" wet />
					<Hero x={960} y={GROUND + 20} size={H} face={frame > cue(l0, "Don't ask") ? 'happy' : 'smug'} armL={[40, 60]} armR={[40, 60]} blink={blinking(frame)} />
					<Rain t={frame * 0.4} long={0} />
				</g>
			}
			slow={{at: -10, strength: 0.75}}
			overlay={
				<>
					<Label text="AIR: SLOW, BUT BREATHABLE ✓" x={480} y={200} frame={frame} at={cue(l0, 'breathe')} color={UI.green} size={40} />
					<Label text="LIGHT: STILL GETS THROUGH ✓" x={1440} y={200} frame={frame} at={cue(l0, 'see')} color={UI.green} size={40} />
					<Label text="PHYSICISTS: ???" x={960} y={870} frame={frame} at={cue(l0, 'Physicists')} color={UI.yellow} />
				</>
			}
		/>
	);
};

export const Tests: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const knock = cue(l0, 'You knock');
	const snapAt = cue(l0, 'Snap');
	const catchAt = cue(l0, 'catch it');
	const phoneY = frame < knock ? 616 : frame < snapAt ? lerp(616, 680, span(frame, knock, snapAt)) : frame < catchAt ? lerp(680, 700, span(frame, snapAt, catchAt)) : 700;
	const heroX = frame < snapAt ? 760 : frame < catchAt ? 760 + Math.sin((frame - snapAt) * 0.03) * 220 : 860;
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(960, 560, 1.05), detail(1080, 660, 2.6), close(heroX, GROUND, H, 0.08), medium(960), detail(1080, 680, 3, 4)]}
				world={
					<Room look={ROOMS.bedroomNight} window={{x: 1350, w: 380, night: true}}>
						<Desk x={880} w={460} />
						<Phone x={1080} y={phoneY} rot={frame < knock ? 90 : (frame - knock) * (frame < snapAt ? 3 : 0.1)} />
						<Hero x={heroX} y={GROUND} size={H} face={frame > catchAt ? 'happy' : frame > snapAt ? 'smug' : 'neutral'} walk={frame > snapAt && frame < catchAt ? frame / 16 : undefined} armR={frame > catchAt ? [80, 100] : [20, 10]} blink={blinking(frame, 2)} />
					</Room>
				}
				slow={{at: snapAt}}
				overlay={
					<>
						<Label text="PHONE FALL ≈ 0.5 S" x={420} y={200} frame={frame} at={cue(l0, 'half a second')} />
						<Label text="SLOWED ≈ 7.5 MINUTES" x={1500} y={200} frame={frame} at={cue(l0, 'seven and a half')} color={UI.yellow} />
						<Count from={0} to={200} x={1500} y={760} size={110} frame={frame} at={l1.a} dur={70} suffix=" CATCHES" />
						<SnapRing frame={frame} at={snapAt} x={760} y={430} />
					</>
				}
			/>
			<Sound name="snap" at={snapAt} volume={0.8} />
			<Sound name="pop" at={catchAt} />
		</>
	);
};

export const Egg: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const cereal = cue(l0, 'You snap back');
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), detail(1340, 430, 2.6), close(860, GROUND, H, 0.08, -3), medium(900)]}
			world={
				<Room look={ROOMS.kitchen} window={{x: 200, w: 400}}>
					<Stove x={1120} frozen={frame < cereal} frame={frame} />
					<Hero x={860} y={GROUND} size={H} face={frame > cereal ? 'happy' : frame > cue(l0, 'nearly a week') ? 'shocked' : 'neutral'} look={[0.8, 0]} armR={frame > cereal ? [70, 110] : [20, 10]} blink={blinking(frame, 3)} />
				</Room>
			}
			slow={{at: -10, until: cereal}}
			overlay={
				<>
					<Label text="BOILED EGG ≈ 10 MIN" x={480} y={200} frame={frame} at={cue(l0, 'ten minutes')} />
					<Label text="SLOWED ≈ 7 DAYS" x={1440} y={200} frame={frame} at={cue(l0, 'nearly a week')} color={UI.red} />
				</>
			}
		/>
	);
};

export const BusShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const snapAt = cue(l0, 'Snap');
	const boardAt = cue(l0, 'You stroll');
	const backAt = cue(l0, 'snap back');
	const x = frame < boardAt ? 700 : lerp(700, 1220, span(frame, boardAt, backAt, Easing.linear));
	const doors = frame < snapAt ? lerp(1, 0.75, span(frame, 0, snapAt)) : frame < backAt ? lerp(0.75, 0.6, span(frame, snapAt, backAt)) : lerp(0.6, 0, span(frame, backAt, backAt + 6));
	return (
		<>
			<Shot
				frame={frame}
				dur={dur}
				lines={lines}
				angles={[wide(1100, 560, 1.05), detail(1260, 700, 2.2), close(x, GROUND + 20, H, 0.08, 3)]}
				bg={<CityBack time="day" />}
				world={
					<g>
						<Street time="day" stop={false} />
						<Bus x={1100} doors={doors} />
						<Hero x={x} y={GROUND + 20} size={H} face="smug" walk={frame > boardAt && frame < backAt ? frame / 14 : undefined} opacity={frame > backAt ? 0 : 1} />
					</g>
				}
				slow={{at: snapAt, until: backAt}}
				overlay={
					<>
						<Label text="DOORS: 0.5 S → 8 MIN" x={960} y={200} frame={frame} at={cue(l0, 'eight whole')} color={UI.yellow} />
						<SnapRing frame={frame} at={snapAt} x={700} y={420} />
						<SnapRing frame={frame} at={backAt} x={1240} y={420} />
					</>
				}
			/>
			<Sound name="snap" at={snapAt} volume={0.7} />
			<Sound name="snap" at={backAt} volume={0.7} />
		</>
	);
};

export const TestShot: React.FC<ShotProps> = ({frame, dur, lines}) => {
	const [l0] = lines;
	const scoreAt = cue(l0, 'You score');
	const checkAt = cue(l0, 'Your teacher');
	const books = Math.min(9, Math.floor(span(frame, cue(l0, 'three weeks'), scoreAt) * 9));
	return (
		<Shot
			frame={frame}
			dur={dur}
			lines={lines}
			angles={[wide(960, 560, 1.05), close(820, GROUND, H, 0.08), detail(1060, 560, 2.2), medium(1000)]}
			world={
				<Room look={ROOMS.classroom}>
					<Board x={560} text={frame > scoreAt ? '100%' : 'TEST'} />
					<Desk x={700} w={520} color="#C98A5A" h={260} />
					{[...Array(books)].map((_, i) => (
						<rect key={i} x={1000 + (i % 2) * 8} y={GROUND - 290 - i * 36} width={170} height={34} rx={6} fill={['#E8453C', '#3FB7E8', '#FFD84A', '#7CF2A0'][i % 4]} stroke="#140A28" strokeWidth={5} />
					))}
					<Hero x={820} y={GROUND} size={H} face={frame > scoreAt ? 'smug' : 'determined'} sit armL={[70, 100]} armR={[70, 100]} blink={blinking(frame)} />
					{frame > checkAt ? <Hero who={CAST.teacher} x={1380} y={GROUND} size={H * 1.15} face="determined" look={[-0.8, 0.2]} flip /> : null}
				</Room>
			}
			slow={{at: cue(l0, 'thirty minute'), until: scoreAt, strength: 0.7}}
			overlay={
				<>
					<Label text="30 MIN LUNCH ≈ 3 WEEKS" x={960} y={200} frame={frame} at={cue(l0, 'three weeks')} color={UI.yellow} />
					<Big text="100%" x={1520} y={760} size={150} frame={frame} at={scoreAt} color={UI.green} />
					<Bubble text="Show me your sleeves." x={1380} y={250} tx={1380} ty={330} frame={frame} at={checkAt + 6} until={dur} size={38} />
				</>
			}
		/>
	);
};

