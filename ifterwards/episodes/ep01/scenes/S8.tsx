import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Actor, blinks, cue, dolly, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {RingSound, SIT, SIT_LOW, walker} from './common';
import {Kitchen, mumAt, heroAt, WIDE, MEDIUM} from './S1';
import {SIT_TABLE} from './common';
import {Corridor} from './sets4';

// Section 8, the turn: the hospital corridor. Almost no colour, no music.

type P = ShotProps & {frame: number};
const MONO = 'saturate(0.16) contrast(1.04)';

const HIM: [number, number, number] = [0.11, 0, -0.9];
const HER: [number, number, number] = [1.2, 0, -0.9];
const WAIT: Pose = {...SIT, lean: 6, headTilt: 3, nod: 0.45, armL: [10, 50], armR: [20, 58]};
const REACH: Pose = {...SIT, lean: 7, headTilt: -2, armL: [10, 50], armR: [66, 92]};

const mum = (frame: number, extra: Partial<ActorProps> = {}): ActorProps => ({
	who: 'other',
	at: HER,
	flip: true,
	turn: 0.55,
	scale: 0.97,
	pose: WAIT,
	expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.45),
	gaze: [0.1, 0.5],
	blink: blinks(frame, 5),
	...extra,
});

const him = (frame: number, extra: Partial<ActorProps> = {}): ActorProps => ({
	who: 'hero',
	at: HIM,
	turn: 0.85,
	pose: SIT,
	expression: 'neutral',
	gaze: [0.8, 0],
	blink: blinks(frame, 1),
	...extra,
});

/** 8.1 Mum, alone in the corridor. */
export const S8_1: React.FC<P> = ({frame, dur}) => (
	<Stage grade={MONO} camera={dolly(span(frame, 0, dur), shot([-3.4, 1.5, 6.4], [0.6, 1.0, -1.0]), shot([-1.6, 1.4, 5.0], [0.8, 1.0, -1.0]))}>
		<Corridor />
		<Actor {...mum(frame)} />
	</Stage>
);

/** 8.2 He sits down next to her and asks. */
export const S8_2: React.FC<P> = ({frame, dur, lines}) => {
	const [l2, l3] = lines;
	const sitAt = cue(l2, 'and you ask') - 10;
	const walking = walker(frame, 0, 0, 1, 0);
	const arrive = Math.min(1, frame / Math.max(1, sitAt - 12));
	const down = span(frame, sitAt - 12, sitAt + 6);
	const hero = him(frame, {
		at: [-2.6 + (HIM[0] + 2.6) * arrive, 0, HIM[2]],
		pose: mixPose(mixPose(walking.pose as Pose, POSES.stand, span(frame, sitAt - 22, sitAt - 12)), SIT, down),
		scarf: {...walking.scarf, flow: (walking.scarf?.flow ?? 0) * (1 - span(frame, sitAt - 22, sitAt - 8)) * 0.6},
		talk: talking(frame, l3.a, l3.b),
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.35),
	});
	return (
		<Stage grade={MONO} camera={dolly(span(frame, 0, dur), shot([-0.6, 1.4, 4.6], [0.5, 1.0, -0.9]), shot([0.4, 1.25, 3.0], [0.65, 1.05, -0.9]))}>
			<Corridor />
			<Actor {...mum(frame, {gaze: [0.1 + 0.6 * span(frame, l3.a, l3.b), 0.5 * (1 - span(frame, l3.a, l3.b))]})} />
			<Actor {...hero} />
		</Stage>
	);
};

/** 8.3 "No. Not a bit." Two seconds of silence. Then it rings. */
export const S8_3: React.FC<P> = ({frame, dur, lines}) => {
	const [l4, l5] = lines;
	const answer = cue(l4, '"No');
	const cut = l4.b + 14;
	const ring = l5.a - 6;
	const onMum = frame < cut;
	const smile = span(frame, cue(l4, 'She smiles'), cue(l4, 'She smiles') + 16);
	const hero = him(frame, {
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.35), EXPRESSIONS.shocked, span(frame, ring, ring + 4)),
		gaze: frame < ring ? [0.8, 0] : undefined,
		blink: frame < ring ? blinks(frame, 1) : 0,
	});
	const camera = onMum
		? dolly(span(frame, 0, cut), shot([0.5, 1.2, 1.9], [1.15, 1.1, -0.9]), shot([0.7, 1.17, 1.3], [1.17, 1.11, -0.9]))
		: dolly(span(frame, cut, dur), shot([0.7, 1.2, 1.6], [0.16, 1.1, -0.9]), shot([0.5, 1.17, 1.0], [0.15, 1.12, -0.9]));
	return (
		<Stage grade={MONO} camera={camera} wash={{color: '#FF4D3D', opacity: 0.16 * track(frame, [[ring, 0], [ring + 2, 1], [ring + 26, 0]])}}>
			<Corridor />
			<Actor {...mum(frame, {turn: 0.75, expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.45), EXPRESSIONS.delighted, smile * 0.55), gaze: [0.75, 0], talk: talking(frame, answer, l4.b), pixels: 2048})} />
			<Actor {...hero} pixels={2048} />
			<Ring actor={hero} since={frame - ring} strength={2} side={-1} />
			<RingSound at={ring} volume={1} />
		</Stage>
	);
};

/** 8.4 He understands. It was the same ring in the kitchen. */
export const S8_4: React.FC<P> = ({frame, dur, lines}) => {
	const [l6, , l8, l9] = lines;
	const toMum = l8.a - 6;
	const toKitchen = l9.a - 6;
	if (frame >= toKitchen) {
		// The first morning again, with the colour starting to come back.
		const local = frame - toKitchen;
		const ring = cue(l9, '"Fine') - toKitchen;
		const hero = heroAt(local, SIT_TABLE, {gaze: [0.8, -0.1]});
		return (
			<Stage grade="saturate(0.7)" camera={dolly(span(frame, toKitchen, dur), WIDE, MEDIUM)}>
				<Kitchen>
					<Actor {...mumAt(local, span(local, ring - 20, ring))} />
					<Actor {...hero} />
					<Ring actor={hero} since={local - ring} strength={0.9} />
				</Kitchen>
				<RingSound at={ring + toKitchen} volume={0.35} />
			</Stage>
		);
	}

	const soften = span(frame, l6.a, l6.b);
	const onMum = frame >= toMum;
	const camera = onMum
		? dolly(span(frame, toMum, toKitchen), shot([0.2, 1.3, 2.6], [0.95, 1.08, -0.9]), shot([0.5, 1.22, 1.7], [1.1, 1.1, -0.9]))
		: dolly(span(frame, 0, toMum), shot([0.5, 1.17, 1.0], [0.15, 1.12, -0.9]), shot([0.75, 1.22, 1.9], [0.3, 1.1, -0.9]));
	return (
		<Stage grade={MONO} camera={camera}>
			<Corridor />
			<Actor {...mum(frame, {turn: 0.4, gaze: [0, 0.3], expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.3)})} />
			<Actor {...him(frame, {expression: mixExpression(EXPRESSIONS.shocked, mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.45), soften), gaze: [0.8, 0.1], pixels: 2048})} />
		</Stage>
	);
};

/** 8.5 He takes her hand. "Yeah. Me neither." It rings for him. */
export const S8_5: React.FC<P> = ({frame, dur, lines}) => {
	const [l10, l11] = lines;
	const take = span(frame, cue(l10, 'You take'), cue(l10, 'You take') + 18);
	const ring = l11.a + 12;
	const hero = him(frame, {
		pose: mixPose(SIT, REACH, take),
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.35), EXPRESSIONS.delighted, 0.4 * span(frame, cue(l10, '"Yeah'), cue(l10, '"Yeah') + 12)),
		talk: talking(frame, cue(l10, '"Yeah'), l10.b),
	});
	return (
		<Stage grade={`saturate(${0.16 + 0.3 * span(frame, ring, dur)}) contrast(1.04)`} camera={dolly(span(frame, 0, dur), shot([0.3, 1.3, 3.2], [0.65, 1.0, -0.9]), shot([0.55, 1.15, 2.1], [0.65, 1.0, -0.9]))} wash={{color: '#FFB703', opacity: 0.05 * track(frame, [[ring, 0], [ring + 3, 1], [ring + 30, 0]])}}>
			<Corridor />
			<Actor {...mum(frame, {pose: mixPose(WAIT, REACH, take), gaze: [0.75, 0], turn: 0.8, expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.25 + 0.3 * take)})} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} strength={0.8} side={-1} />
			<RingSound at={ring} volume={0.4} />
			{SIT_LOW ? null : null}
		</Stage>
	);
};
