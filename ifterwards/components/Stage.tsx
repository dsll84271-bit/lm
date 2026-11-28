import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {EXPRESSIONS, type ExpressionName} from '../characters/stickman/expressions';
import {POSES, type PoseName} from '../characters/stickman/poses';
import {
	getSkeleton,
	HERO_LOOK,
	OTHER_LOOK,
	type Expression,
	type Pose,
	type Scarf,
	type Skeleton,
	type SolvedPose,
	type StickmanOptions,
	type Vec,
} from '../characters/stickman/rig';
import {StickmanCard, UNIT} from '../characters/stickman/StickmanCard';
import {DepthLayers, Layer, type CameraPose} from './DepthLayers';
import type {V3} from './kit';
import {RingPulse} from './RingPulse';

// The stage: one 3D shot. A set, the people in it, a camera and a colour grade.

// ---------------------------------------------------------------- people

export type ActorProps = {
	/** 'hero' is the stickman. Everyone else is 'other'. */
	who?: 'hero' | 'other';
	/** Where their feet are, in metres. */
	at: V3;
	scale?: number;
	pose?: PoseName | Pose | SolvedPose;
	expression?: ExpressionName | Expression;
	/** Mirror them, to face the other way. */
	flip?: boolean;
	/** Turn the face: 1 looks the way the pose faces, 0 looks at us. */
	turn?: number;
	/** Seen from behind. */
	back?: boolean;
	/** Where the eyes point, -1 to 1 on each axis. */
	gaze?: Vec;
	/** 0 to 1: how far the mouth is open for talking. */
	talk?: number;
	blink?: number;
	scarf?: Partial<Scarf>;
	/** Sharper drawing for extreme close-ups. */
	pixels?: number;
};

const optionsFor = (a: ActorProps): StickmanOptions => {
	let expression: Expression =
		typeof a.expression === 'string' ? EXPRESSIONS[a.expression] : (a.expression ?? EXPRESSIONS.neutral);
	if (a.gaze) {
		expression = {...expression, gaze: a.gaze};
	}

	if (a.talk) {
		const jaw = a.talk * 7;
		expression = {
			...expression,
			mouth: {
				...expression.mouth,
				top: expression.mouth.top - jaw * 0.25,
				bottom: expression.mouth.bottom + jaw,
				round: Math.max(expression.mouth.round, Math.min(1, a.talk) * 0.5),
			},
		};
	}

	return {
		pose: typeof a.pose === 'string' ? POSES[a.pose] : (a.pose ?? POSES.stand),
		expression,
		look: a.who === 'other' ? OTHER_LOOK : HERO_LOOK,
		flip: a.flip,
		turn: a.turn,
		back: a.back,
		blink: a.blink,
		scarf: a.scarf,
	};
};

/** A person in the set. Always drawn sharp. */
export const Actor: React.FC<ActorProps> = (a) => (
	<Layer name="mid">
		<StickmanCard position={a.at} scale={a.scale} pixels={a.pixels} options={optionsFor(a)} />
	</Layer>
);

type Joint = Exclude<keyof Skeleton, 'headAngle'>;

/** Where one of a person's joints is in the room. */
export const jointOf = (a: ActorProps, joint: Joint): V3 => {
	const pose = typeof a.pose === 'string' ? POSES[a.pose] : (a.pose ?? POSES.stand);
	const p = getSkeleton(pose, a.flip)[joint];
	const s = UNIT * (a.scale ?? 1);
	return [a.at[0] + p[0] * s, a.at[1] - p[1] * s, a.at[2] + 0.03];
};

/** The ear on the given side of the screen (1 = right, -1 = left). */
export const earOf = (a: ActorProps, side: 1 | -1 = 1): V3 => {
	const l = jointOf(a, 'earL');
	const r = jointOf(a, 'earR');
	return (l[0] > r[0]) === (side === 1) ? l : r;
};

/** The ring, pulsing from a person's ear. `since` is frames since it began. */
export const Ring: React.FC<{actor: ActorProps; since: number; strength?: number; side?: 1 | -1}> = ({
	actor,
	since,
	strength = 1,
	side = 1,
}) => (
	<Layer name="mid">
		<RingPulse position={earOf(actor, side)} age={since / 30} strength={strength} side={side} />
	</Layer>
);

// ---------------------------------------------------------------- timing

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Runs a value through [frame, amount] keys, easing between them. */
export const track = (frame: number, keys: Array<[number, number]>) =>
	keys.length === 1
		? keys[0][1]
		: interpolate(
				frame,
				keys.map((k) => k[0]),
				keys.map((k) => k[1]),
				{...clamp, easing: Easing.inOut(Easing.cubic)},
			);

/** 0 to 1 over a span of frames. */
export const span = (frame: number, from: number, to: number) =>
	interpolate(frame, [from, Math.max(to, from + 1)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

/** Blinks every few seconds. Give each person a different `seed`. */
export const blinks = (frame: number, seed = 0) => {
	const t = (frame + seed * 37) % 104;
	return interpolate(t, [96, 99, 103], [0, 1, 0], clamp);
};

/** Mouth movement between two frames, for someone talking (silently). */
export const talking = (frame: number, from: number, to: number) =>
	interpolate(frame, [from, from + 3, to - 3, to], [0, 1, 1, 0], clamp) * (0.45 + 0.55 * Math.sin(frame * 1.25) ** 2);

/** One spoken line, in frames from the start of the shot. */
export type Line = {text: string; a: number; b: number};

/** Roughly when a word is said: the frame the `nth` match of `word` begins. */
export const cue = (line: Line, word: string, nth = 0): number => {
	let index = -1;
	for (let i = 0; i <= nth; i++) {
		index = line.text.indexOf(word, index + 1);
		if (index < 0) {
			return line.b;
		}
	}

	return Math.round(line.a + (index / line.text.length) * (line.b - line.a));
};

/** What every shot is given: its length and its lines, in frames. */
export type ShotProps = {dur: number; lines: Line[]};

// ---------------------------------------------------------------- camera

/** A camera move: p = 0 is the first position, p = 1 the second. */
export const dolly = (p: number, from: CameraPose, to: CameraPose): CameraPose => {
	const m = (a: number, b: number) => a + (b - a) * p;
	return {
		position: [m(from.position[0], to.position[0]), m(from.position[1], to.position[1]), m(from.position[2], to.position[2])],
		target: [m(from.target[0], to.target[0]), m(from.target[1], to.target[1]), m(from.target[2], to.target[2])],
		fov: m(from.fov, to.fov),
	};
};

export const shot = (position: V3, target: V3, fov = 32): CameraPose => ({position, target, fov});

// ----------------------------------------------------------------- stage

export type StageProps = {
	camera: CameraPose;
	/** The set, the lights and the people. */
	children: React.ReactNode;
	backgroundBlur?: number;
	foregroundBlur?: number;
	exposure?: number;
	/** A CSS colour grade, e.g. "saturate(0.3)" for the near-monochrome turn. */
	grade?: string;
	/** A wash of colour over the whole picture. */
	wash?: {color: string; opacity: number};
	/** Text and counters, drawn on top, never graded. */
	overlay?: React.ReactNode;
};

export const Stage: React.FC<StageProps> = ({
	camera,
	children,
	backgroundBlur = 3,
	foregroundBlur = 7,
	exposure = 1.05,
	grade,
	wash,
	overlay,
}) => (
	<AbsoluteFill style={{backgroundColor: '#0B1437'}}>
		<AbsoluteFill style={{filter: grade}}>
			<DepthLayers camera={camera} backgroundBlur={backgroundBlur} foregroundBlur={foregroundBlur} exposure={exposure}>
				{children}
			</DepthLayers>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 75% 75% at 50% 48%, rgba(11,20,55,0) 55%, rgba(11,20,55,0.5) 100%)',
				}}
			/>
			{wash ? <AbsoluteFill style={{backgroundColor: wash.color, opacity: wash.opacity}} /> : null}
		</AbsoluteFill>
		{overlay}
	</AbsoluteFill>
);
