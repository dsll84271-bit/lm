import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Layer} from '../../../components/DepthLayers';
import {Mug} from '../../../components/kit';
import {Actor, blinks, cue, dolly, jointOf, shot, span, Stage, talking, type ActorProps, type ShotProps} from '../../../components/Stage';
import {STAND_OFFER, STAND_STIFF, walker} from './common';
import {OfficeKitchen} from './sets4';

// Section 6, Month 3: people find out.

type P = ShotProps & {frame: number};
const GRADE = 'saturate(0.7) brightness(0.98)';
const MUG_HOLD: Pose = {lean: 3, headTilt: 5, nod: 0.5, armL: [-20, -10], armR: [30, 104], legL: [-9, -9], legR: [9, 9]};

const SPOTS: Array<[number, number, number]> = [[0.5, 0, -0.9], [1.3, 0, -1.3], [2.2, 0, -0.7]];

/** The three colleagues. `stiff` (0 to 1) is how careful they have become. */
const colleagues = (frame: number, stiff: number, acts: Record<number, Partial<ActorProps>> = {}): ActorProps[] =>
	SPOTS.map((at, i) => ({
		who: 'other' as const,
		at,
		scale: [1.0, 1.05, 0.95][i],
		// They face each other while they chat, and turn to him when he arrives.
		flip: stiff > 0.5 ? true : i === 2,
		turn: 0.8,
		pose: mixPose(i === 1 ? STAND_OFFER : POSES.stand, STAND_STIFF, stiff),
		expression: mixExpression(EXPRESSIONS.delighted, EXPRESSIONS.neutral, stiff),
		talk: (1 - stiff) * talking(frame, i * 25, 400),
		blink: blinks(frame, i + 3),
		...acts[i],
	}));

/** 6.1 He walks in and the talking stops. */
export const S6_1: React.FC<P> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const enter = l0.a;
	const arrive = cue(l1, 'they change');
	const walking = walker(Math.max(0, frame - enter), -4.4, 0.2, 2.9 / ((arrive - enter) / 30), 0, {who: 'hero'});
	const there = span(frame, arrive - 8, arrive + 6);
	const hero: ActorProps = {
		...walking,
		at: [-4.4 + 2.9 * Math.min(1, Math.max(0, frame - enter) / (arrive - enter)), 0, 0.2],
		pose: mixPose(walking.pose as Pose, POSES.stand, there),
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.5 * span(frame, arrive + 10, dur)),
		gaze: [0.8, 0],
		scarf: {...walking.scarf, flow: (walking.scarf?.flow ?? 0) * (1 - there)},
	};
	const x = hero.at[0];
	return (
		<Stage grade={GRADE} camera={dolly(span(frame, 0, dur), shot([x * 0.4 - 0.4, 1.5, 5.2], [x * 0.4 + 0.6, 1.05, -0.5]), shot([-0.4, 1.4, 4.2], [0.2, 1.1, -0.5]))}>
			<OfficeKitchen />
			{colleagues(frame, span(frame, arrive - 14, arrive + 2)).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
		</Stage>
	);
};

/** 6.2 Three very careful sentences. */
export const S6_2: React.FC<P> = ({frame, lines}) => {
	const i = frame < lines[1].a - 6 ? 0 : frame < lines[2].a - 6 ? 1 : 2;
	const l = lines[i];
	const from = i === 0 ? 0 : l.a - 6;
	const [x, , z] = SPOTS[i];
	const h = 1.36 * [1.0, 1.05, 0.95][i];
	return (
		<Stage grade={GRADE} camera={dolly(span(frame, from, l.b + 12), shot([x - 0.9, h, z + 2.6], [x - 0.05, h - 0.02, z]), shot([x - 0.75, h, z + 2.1], [x - 0.05, h - 0.01, z]))} backgroundBlur={4}>
			<OfficeKitchen />
			{colleagues(frame, 1, {
				[i]: {talk: talking(frame, l.a, l.b), gaze: [0.5 * Math.sin(frame * 0.12), 0.25], turn: 0.55},
			}).map((c, k) => <Actor key={k} {...c} />)}
		</Stage>
	);
};

/** 6.3 Everyone honest, and he has never felt more lied to. */
export const S6_3: React.FC<P> = ({frame, dur}) => {
	const hero: ActorProps = {who: 'hero', at: [-1.5, 0, 0.2], turn: 0.3, pose: MUG_HOLD, expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.5 + 0.5 * span(frame, 0, dur)), gaze: [0.1, 0.6], blink: blinks(frame, 1)};
	const hand = jointOf(hero, 'handR');
	return (
		<Stage grade={GRADE} camera={dolly(span(frame, 0, dur), shot([-1.3, 1.35, 2.6], [-1.25, 1.2, 0.2]), shot([-0.6, 1.7, 6.2], [0, 1.0, -0.4]))}>
			<OfficeKitchen />
			{colleagues(frame, 1, {0: {gaze: [0.8, 0]}, 1: {gaze: [0.8, 0]}, 2: {gaze: [0.8, 0.1]}}).map((c, k) => <Actor key={k} {...c} />)}
			<Actor {...hero} />
			<Layer name="mid">
				<Mug at={[hand[0] + 0.03, hand[1] - 0.02, hand[2] + 0.04]} />
			</Layer>
		</Stage>
	);
};
