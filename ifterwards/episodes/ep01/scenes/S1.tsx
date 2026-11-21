import React from 'react';
import {spring} from 'remotion';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {mixExpression, mixPose, solvePose, type Pose, type SolvedPose} from '../../../characters/stickman/rig';
import {Actor, blinks, cue, dolly, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {RingSound, SIT_EAR, SIT_LEAN, SIT_LOW, SIT_TABLE} from './common';
import {KITCHEN, KitchenLights, KitchenSet, type KitchenMood} from './kitchen/KitchenSet';

// Section 1, the cold open: the kitchen, early morning.

// The hand-to-ear reach, with the forearm written the long way round so his
// hand travels across his front, not behind his back.
const ear = solvePose(SIT_EAR);
export const EAR: SolvedPose = {...ear, armL: [ear.armL[0], ear.armL[1] + 360]};

const MUM: Pose = {lean: 0, headTilt: 0, armL: [-36, 20], armR: [36, -20], legL: [-7, -7], legR: [7, 7]};

export const WIDE = shot([-0.35, 1.52, 5.6], [0.1, 1.02, -1.3]);
export const MEDIUM = shot([0.2, 1.38, 3.8], [0.68, 1.06, -0.66]);
export const CLOSE = shot([0.66, 1.26, 2.3], [1.14, 1.1, -0.15]);
const CLOSER = shot([0.84, 1.2, 1.75], [1.22, 1.13, -0.1]);

/** Mum at the sink. `still` (0 to 1) stops her washing up while she answers. */
export const mumAt = (frame: number, still: number, faceUs = false): ActorProps => {
	const scrub = Math.sin(frame * 0.42) * 7 * (1 - still);
	return {
		who: 'other',
		at: KITCHEN.mum,
		scale: 0.97,
		back: !faceUs,
		pose: {
			...MUM,
			lean: Math.sin(frame * 0.037) * 0.8,
			headTilt: still * 7,
			armL: [-36 - scrub * 0.4, 20 + scrub],
			armR: [36 - scrub * 0.4, -20 + scrub],
		},
	};
};

/** The stickman on his kitchen chair, facing Mum. */
export const heroAt = (frame: number, pose: Pose | SolvedPose, extra: Partial<ActorProps> = {}): ActorProps => ({
	who: 'hero',
	at: KITCHEN.stickman,
	flip: true,
	turn: 0.85,
	pose,
	blink: blinks(frame, 1),
	scarf: {side: -1, flow: 0.04, phase: frame * 0.08},
	...extra,
});

export const Kitchen: React.FC<{mood?: KitchenMood; children: React.ReactNode}> = ({mood, children}) => (
	<>
		<KitchenLights mood={mood} />
		<KitchenSet mood={mood} />
		{children}
	</>
);

const snap = (frame: number, at: number) =>
	spring({frame: frame - at, fps: 30, config: {damping: 13, stiffness: 190, mass: 0.6}});

export const S1_1: React.FC<ShotProps & {frame: number}> = ({frame, dur, lines}) => {
	const [l0, l1] = lines;
	const answer = cue(l0, 'She says');
	const ring = l0.b + 8;
	const toEar = snap(frame, ring) * (1 - span(frame, l1.b - 60, l1.b - 15));
	const shocked = track(frame, [[ring, 0], [ring + 4, 1], [ring + 55, 1], [ring + 85, 0]]);
	const suspicious = span(frame, ring + 60, ring + 90);
	let expression = mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, suspicious);
	expression = mixExpression(expression, EXPRESSIONS.shocked, shocked);
	const hero = heroAt(frame, mixPose(SIT_TABLE, EAR, toEar), {
		expression,
		gaze: shocked > 0.5 ? undefined : [0.8, -0.1],
		blink: shocked > 0.1 ? 0 : blinks(frame, 1),
		talk: talking(frame, l0.a, answer - 6),
	});
	return (
		<Stage camera={dolly(span(frame, 0, dur), WIDE, MEDIUM)} wash={{color: '#FF4D3D', opacity: 0.07 * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])}}>
			<Kitchen>
				<Actor {...mumAt(frame, track(frame, [[answer - 8, 0], [answer, 1], [l0.b, 1], [l0.b + 12, 0]]))} />
				<Actor {...hero} />
				<Ring actor={hero} since={frame - ring} />
			</Kitchen>
			<RingSound at={ring} volume={0.6} />
		</Stage>
	);
};

export const S1_2: React.FC<ShotProps & {frame: number}> = ({frame, dur, lines}) => {
	const [l2] = lines;
	const answer = cue(l2, 'Honestly');
	const ring = l2.b + 5;
	const lean = track(frame, [[l2.a - 8, 0], [l2.a + 6, 1], [answer + 10, 1], [ring, 0]]);
	const toEar = snap(frame, ring);
	const shocked = span(frame, ring, ring + 4);
	const hero = heroAt(frame, mixPose(mixPose(SIT_TABLE, SIT_LEAN, lean), EAR, toEar), {
		expression: mixExpression(EXPRESSIONS.suspicious, EXPRESSIONS.shocked, shocked),
		gaze: shocked > 0.5 ? undefined : [0.8, -0.1],
		talk: talking(frame, l2.a, answer - 5),
	});
	return (
		<Stage camera={dolly(span(frame, 0, dur), MEDIUM, CLOSE)} wash={{color: '#FF4D3D', opacity: 0.08 * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])}}>
			<Kitchen>
				<Actor {...mumAt(frame, track(frame, [[answer - 8, 0], [answer, 1], [l2.b, 1], [l2.b + 12, 0]]))} />
				<Actor {...hero} />
				<Ring actor={hero} since={frame - ring} strength={1.35} />
			</Kitchen>
			<RingSound at={ring} volume={0.75} />
		</Stage>
	);
};

export const S1_3: React.FC<ShotProps & {frame: number}> = ({frame, dur, lines}) => {
	const cut = cue(lines[0], 'And from') - 6;
	const onMum = frame < cut;
	const sink = span(frame, cut, dur - 30);
	const hero = heroAt(frame, mixPose(mixPose(EAR, SIT_TABLE, span(frame, cut - 20, cut + 30)), SIT_LOW, sink * 0.6), {
		expression: mixExpression(EXPRESSIONS.suspicious, EXPRESSIONS.crushed, sink),
		gaze: [0.8 * (1 - span(frame, dur - 70, dur - 40)), -0.05],
		turn: 0.85 - 0.5 * span(frame, dur - 70, dur - 40),
	});
	const camera = onMum
		? dolly(span(frame, 0, cut), shot([-0.5, 1.5, 1.6], [-1.3, 1.3, -2.2]), shot([-0.75, 1.46, 0.6], [-1.3, 1.32, -2.2]))
		: dolly(span(frame, cut, dur), CLOSE, CLOSER);
	return (
		<Stage camera={camera}>
			<Kitchen>
				<Actor {...mumAt(frame, 0)} />
				<Actor {...hero} />
			</Kitchen>
		</Stage>
	);
};
