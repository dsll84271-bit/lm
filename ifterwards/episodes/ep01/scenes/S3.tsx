import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Actor, blinks, cue, dolly, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {RingSound, seat, SIT, SIT_LOW, SIT_TABLE} from './common';
import {EAR} from './S1';
import {Cafe, CAFE} from './sets3';

// Section 3, Day 3: the lies are small and kind.

type P = ShotProps & {frame: number};
const SOFT = 'saturate(0.82) brightness(1.04)';
const flash = (frame: number, ring: number, amount = 0.05) => ({color: '#FF4D3D', opacity: amount * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])});

const TOUCH_HAIR: Pose = {...SIT, armR: {reach: [0.35, -0.95], from: 'head', bend: -1}, front: ['armR']};
const SIT_PHONE: Pose = {...SIT, headTilt: 5, nod: 0.3, armR: [36, 126]};
const SIT_PUSH: Pose = {...SIT_TABLE, lean: 9, armR: [72, 98]};

const left = (x: number, z: number) => seat(x - 0.78, z, false);
const right = (x: number, z: number) => seat(x + 0.78, z, true);

/** Everyone in the cafe. `acts` overrides what individual people are doing. */
const cast = (frame: number, hero: Partial<ActorProps>, acts: Record<string, Partial<ActorProps>> = {}) => {
	const [l, c, r] = [CAFE.left, CAFE.centre, CAFE.right];
	const other = (key: string, at: [number, number, number], flip: boolean, seed: number, scale: number): ActorProps => ({
		who: 'other',
		at,
		flip,
		turn: 0.85,
		scale,
		pose: SIT,
		blink: blinks(frame, seed),
		...acts[key],
	});
	const stickman: ActorProps = {who: 'hero', at: right(c[0], c[2]), flip: true, turn: 0.8, pose: SIT_TABLE, blink: blinks(frame, 1), ...hero};
	return {
		hero: stickman,
		all: [
			other('l1', left(l[0], l[2]), false, 3, 0.95),
			other('l2', right(l[0], l[2]), true, 4, 1.0),
			other('r1', left(r[0], r[2]), false, 5, 1.02),
			other('r2', right(r[0], r[2]), true, 6, 0.94),
			other('friend', left(c[0], c[2]), false, 7, 0.98),
			stickman,
		],
	};
};

/** 3.1 He watches the cafe. */
export const S3_1: React.FC<P> = ({frame, dur}) => {
	const {all} = cast(frame, {gaze: [Math.sin(frame * 0.05) * 0.8, 0], expression: 'neutral'}, {
		l2: {talk: talking(frame, 20, 90)},
		r1: {talk: talking(frame, 70, 150)},
	});
	return (
		<Stage grade={SOFT} camera={dolly(span(frame, 0, dur), shot([-0.6, 1.6, 6.0], [0, 0.95, -0.5]), shot([0, 1.45, 4.6], [0.2, 1.0, -0.2]))}>
			<Cafe />
			{all.map((a, i) => <Actor key={i} {...a} />)}
		</Stage>
	);
};

/** 3.2 Three small lies: the haircut, the text, the last biscuit. */
export const S3_2: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const [a, b, c] = [cue(l, '"Love'), cue(l, '"I was'), cue(l, '"No, you')];
	const rings = [b - 14, c - 14, l.b - 4];
	const part = frame < b - 4 ? 0 : frame < c - 4 ? 1 : 2;
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const wince = track(frame, [[last, 0], [last + 4, 1], [last + 30, 1], [last + 45, 0.4]]);
	const {hero, all} = cast(
		frame,
		{
			expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, wince),
			gaze: part === 0 ? [0.9, 0] : part === 1 ? [-0.9, 0] : [0.7, 0.2],
			turn: part === 1 ? -0.6 : 0.8,
		},
		{
			l1: {pose: mixPose(SIT, TOUCH_HAIR, span(frame, a - 30, a - 12)), expression: 'delighted'},
			l2: {talk: talking(frame, a, b - 16), expression: 'delighted'},
			r2: {pose: SIT_PHONE, talk: talking(frame, b, c - 16), gaze: [0.4, 0.6]},
			r1: {expression: 'suspicious'},
			friend: {pose: mixPose(SIT_TABLE, SIT_PUSH, span(frame, c - 6, c + 10)), talk: talking(frame, c, l.b - 6), expression: 'delighted'},
		},
	);
	const cams = [
		dolly(span(frame, 0, b), shot([-0.4, 1.35, 3.9], [-0.75, 1.0, -0.4]), shot([-0.6, 1.3, 3.3], [-0.85, 1.0, -0.5])),
		dolly(span(frame, b, c), shot([1.2, 1.35, 3.9], [1.45, 1.0, -0.4]), shot([1.4, 1.3, 3.3], [1.55, 1.0, -0.5])),
		dolly(span(frame, c, dur), shot([0.1, 1.3, 3.2], [0.1, 0.98, 0.3]), shot([0.2, 1.22, 2.5], [0.15, 1.0, 0.3])),
	];
	return (
		<Stage grade={SOFT} camera={cams[part]} wash={flash(frame, last)}>
			<Cafe />
			{all.map((x, i) => <Actor key={i} {...x} />)}
			<Ring actor={hero} since={frame - last} strength={0.85} />
			{rings.map((r) => <RingSound key={r} at={r} volume={0.45} />)}
		</Stage>
	);
};

/** 3.3 He can hear every one of them tear. */
export const S3_3: React.FC<P> = ({frame, dur, lines}) => {
	const tear = lines[1].a;
	const rings = [tear + 6, tear + 30, tear + 52];
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const down = span(frame, 20, tear);
	const {hero, all} = cast(
		frame,
		{
			pose: mixPose(mixPose(SIT_TABLE, SIT_LOW, down * 0.5), EAR, span(frame, tear + 4, tear + 14)),
			expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, down * 0.8),
			gaze: [0.2, 0.3],
		},
		{l2: {talk: talking(frame, 10, 120)}, r1: {talk: talking(frame, 60, 200)}, friend: {talk: talking(frame, 130, 250), expression: 'delighted'}},
	);
	return (
		<Stage grade={SOFT} camera={dolly(span(frame, 0, dur), shot([0.2, 1.4, 4.4], [0.4, 1.0, 0]), shot([0.75, 1.24, 2.2], [0.85, 1.08, 0.5]))} wash={flash(frame, last)}>
			<Cafe biscuit={false} />
			{all.map((x, i) => <Actor key={i} {...x} />)}
			<Ring actor={hero} since={frame - last} strength={0.8} />
			{rings.map((r) => <RingSound key={r} at={r} volume={0.38} />)}
		</Stage>
	);
};
