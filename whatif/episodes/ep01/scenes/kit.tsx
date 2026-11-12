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
}> = ({frame, dur, lines, angles, order, bg, world, overlay, slow, cuts, shakeXY, dark}) => {
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

/** The street in front: near buildings, lamps, bus stop, road. */
export const Street: React.FC<{time: Time; wet?: boolean; stop?: boolean}> = ({time, wet = false, stop = true}) => (
	<g>
		<City time={time} />
		<StreetLamp x={260} time={time} />
		<StreetLamp x={1500} time={time} />
		{stop ? <BusStop x={1240} /> : null}
		<Road time={time} wet={wet} />
	</g>
);
