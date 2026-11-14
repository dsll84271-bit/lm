import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero, type HeroProps, type Look, person} from '../../../characters/Hero';
import {Back, Cam, cameraFor, cutsFor, Finish, Svg, TimeLook, type Angle, type Line} from '../../../components/stage';
import {BusStop, City, GROUND, Road, Sky, StreetLamp, type Time} from '../../../sets/outdoor';

// Shared pieces for Episode 1's shots.

export {GROUND};

/** The usual hero size in a scene, and where the face is, for close-ups. */
export const H = 620;
export const faceY = (y: number, size = H) => y - size * 0.78;

/** Camera framings around a person standing at (x, y). */
export const wide = (x = 960, y = 540, zoom = 1): Angle => ({x, y, zoom, push: 0.05});
export const medium = (x: number, y = GROUND, size = H, push = 0.06): Angle => ({x, y: y - size * 0.52, zoom: (0.82 * 804) / size, push});
export const close = (x: number, y = GROUND, size = H, push = 0.08, rot = 0): Angle => ({x, y: y - size * 0.7, zoom: 1120 / size, push, rot});
export const detail = (x: number, y: number, zoom: number, rot = 0): Angle => ({x, y, zoom, push: 0.1, rot});

/** People who appear in the episode. */
export const CAST = {
	friend: person('#7FD0FF', '#2EA86A', 'short', '#2A1E2E'),
	kid: person('#FFD08A', '#E8453C', 'spiky', '#5A3A2A'),
	teacher: person('#C9A6FF', '#3A6FD8', 'bun', '#3A2A4A', {collar: true, glasses: true}),
	driver: person('#A8E0B8', '#55597A', 'cap', '#2A2350'),
	host: person('#FFB0C8', '#7F5AF0', 'long', '#2A1E2E', {collar: true}),
	scientist: person('#B8C4FF', '#F2F2F2', 'short', '#8A8AA8', {collar: true, glasses: true}),
	doctor: person('#9FE0D8', '#FFFFFF', 'bun', '#2A1E2E', {collar: true}),
	bigKid: person('#E8B07A', '#55597A', 'cap', '#E8453C'),
	stranger: person('#3A3A5A', '#141428', 'none', '#000', {}),
	crowdA: person('#B8A6FF', '#E8453C', 'short', '#2A1E2E'),
	crowdB: person('#FFE08A', '#3FB7E8', 'long', '#7A4A2A'),
	crowdC: person('#A6E8B0', '#FF8A3D', 'cap', '#2A2350'),
} satisfies Record<string, Look>;

/** A person in the world. */
export const P: React.FC<HeroProps> = (p) => <Hero {...p} />;

/**
 * One shot: a background layer (blurred, parallax), the world, overlays on top,
 * and a camera that cuts between `angles` on every sentence.
 */
export const Shot: React.FC<{
	frame: number;
	dur: number;
	lines: Line[];
	angles: Angle[];
	order?: number[];
	bg?: React.ReactNode;
	world: React.ReactNode;
	overlay?: React.ReactNode;
	slow?: {at: number; until?: number; strength?: number};
	cuts?: number[];
	shakeXY?: {x: number; y: number};
	dark?: number;
	/** Soft out-of-focus lights floating in front, for depth. */
	bokeh?: string;
	/** Things very close to the camera: drawn big, blurred, moving faster. */
	fg?: React.ReactNode;
}> = ({frame, dur, lines, angles, order, bg, world, overlay, slow, cuts, shakeXY, dark, bokeh = '#FFE2A0', fg}) => {
	const c = cuts ?? cutsFor(lines, dur);
	const cam = cameraFor(frame, c, dur, angles, order);
	const body = (
		<AbsoluteFill style={shakeXY ? {transform: `translate(${shakeXY.x}px, ${shakeXY.y}px)`} : undefined}>
			{bg ? (
				<Back cam={cam} depth={0.55} blur={7}>
					<Svg>{bg}</Svg>
				</Back>
			) : null}
			<Cam x={cam.x} y={cam.y} zoom={cam.zoom} rot={cam.rot}>
				<Svg>{world}</Svg>
			</Cam>
			{fg ? (
				<Cam x={960 + (cam.x - 960) * 1.4} y={540 + (cam.y - 540) * 1.4} zoom={cam.zoom * 1.25} rot={cam.rot} blur={10}>
					<Svg>{fg}</Svg>
				</Cam>
			) : null}
			<Cam x={960 + (cam.x - 960) * 1.6} y={540 + (cam.y - 540) * 1.6} zoom={1} blur={5}>
				<Svg>
					{[...Array(14)].map((_, i) => (
						<circle key={i} cx={((i * 331 + frame * (0.4 + (i % 3) * 0.2)) % 2400) - 240} cy={((i * 173) % 900) + 90 + Math.sin(frame * 0.03 + i) * 20} r={10 + (i % 4) * 9} fill={bokeh} opacity={0.12 + (i % 3) * 0.05} />
					))}
				</Svg>
			</Cam>
		</AbsoluteFill>
	);
	return (
		<AbsoluteFill style={{background: '#0B0720', overflow: 'hidden'}}>
			{slow ? (
				<TimeLook frame={frame} at={slow.at} until={slow.until} strength={slow.strength}>
					{body}
				</TimeLook>
			) : (
				body
			)}
			{overlay}
			<Finish dark={dark} />
		</AbsoluteFill>
	);
};

/** The city at night (or day): sky and far buildings for the background layer. */
export const CityBack: React.FC<{time: Time}> = ({time}) => (
	<g>
		<Sky time={time} />
		<City time={time} back seed={3} />
	</g>
);

/** Shop fronts along the pavement, with awnings and glowing windows. */
const Shops: React.FC<{time: Time}> = ({time}) => {
	const glow = time === 'day' ? '#DDF1FF' : '#FFE2A0';
	const awn = ['#E8453C', '#2EA86A', '#7F5AF0', '#FF8A3D', '#3FB7E8'];
	return (
		<g stroke="#140A28" strokeWidth={5}>
			{[...Array(7)].map((_, i) => {
				const x = i * 330 - 260;
				return (
					<g key={i}>
						<rect x={x} y={GROUND - 290} width={320} height={290} fill={time === 'day' ? '#C9B8E8' : '#3A2E80'} />
						<rect x={x + 24} y={GROUND - 230} width={190} height={170} rx={6} fill={glow} opacity={time === 'day' ? 0.8 : 0.9} />
						<rect x={x + 234} y={GROUND - 230} width={66} height={230} fill={time === 'day' ? '#55597A' : '#1C1640'} />
						<path d={`M${x - 6} ${GROUND - 300} L${x + 326} ${GROUND - 300} L${x + 306} ${GROUND - 250} L${x + 14} ${GROUND - 250} Z`} fill={awn[i % awn.length]} />
						{[0, 1, 2, 3, 4, 5].map((k) => (
							<line key={k} x1={x + 20 + k * 52} y1={GROUND - 300} x2={x + 30 + k * 50} y2={GROUND - 250} stroke="#fff" strokeWidth={8} opacity={0.35} />
						))}
						{time !== 'day' ? <rect x={x + 24} y={GROUND - 60} width={190} height={60} fill={glow} opacity={0.15} stroke="none" /> : null}
					</g>
				);
			})}
		</g>
	);
};

const Tree: React.FC<{x: number; time: Time}> = ({x, time}) => (
	<g stroke="#140A28" strokeWidth={5}>
		<rect x={x - 12} y={GROUND - 300} width={24} height={300} fill="#5A3A2A" />
		{[[-60, -330, 90], [50, -350, 100], [0, -420, 110], [-20, -300, 80]].map(([dx, dy, r], i) => (
			<circle key={i} cx={x + dx} cy={GROUND + dy} r={r} fill={time === 'day' ? (i % 2 ? '#3FC07C' : '#2EA86A') : i % 2 ? '#2A5A6A' : '#1F4A5A'} />
		))}
	</g>
);

const Bench: React.FC<{x: number}> = ({x}) => (
	<g stroke="#140A28" strokeWidth={5}>
		<rect x={x} y={GROUND - 90} width={240} height={20} rx={6} fill="#8A5A3E" />
		<rect x={x} y={GROUND - 150} width={240} height={20} rx={6} fill="#8A5A3E" />
		<rect x={x + 20} y={GROUND - 90} width={14} height={90} fill="#2A2350" />
		<rect x={x + 206} y={GROUND - 90} width={14} height={90} fill="#2A2350" />
	</g>
);

const Bin: React.FC<{x: number}> = ({x}) => (
	<g stroke="#140A28" strokeWidth={5}>
		<path d={`M${x - 40} ${GROUND - 130} L${x + 40} ${GROUND - 130} L${x + 32} ${GROUND} L${x - 32} ${GROUND} Z`} fill="#2EA86A" />
		<rect x={x - 46} y={GROUND - 146} width={92} height={20} rx={6} fill="#24865A" />
	</g>
);

/** Puddles that reflect the lights. */
const Puddles: React.FC<{time: Time}> = ({time}) => (
	<g>
		{[[200, 120, 160], [860, 150, 220], [1500, 110, 180]].map(([x, y, w], i) => (
			<g key={i}>
				<ellipse cx={x} cy={GROUND + y} rx={w} ry={22} fill={time === 'day' ? '#9FD0FA' : '#3A3090'} opacity={0.8} />
				<ellipse cx={x - w * 0.3} cy={GROUND + y - 4} rx={w * 0.3} ry={6} fill={time === 'day' ? '#fff' : '#FFE2A0'} opacity={0.5} />
			</g>
		))}
	</g>
);

/** The street in front: buildings, shop fronts, trees, lamps, bus stop, road. */
export const Street: React.FC<{time: Time; wet?: boolean; stop?: boolean}> = ({time, wet = false, stop = true}) => (
	<g>
		<City time={time} />
		<Shops time={time} />
		<Tree x={90} time={time} />
		<Tree x={1830} time={time} />
		<StreetLamp x={260} time={time} />
		<StreetLamp x={1500} time={time} />
		<Bin x={520} />
		{stop ? <BusStop x={1240} /> : <Bench x={1180} />}
		<Road time={time} wet={wet} />
		{wet ? <Puddles time={time} /> : null}
	</g>
);
