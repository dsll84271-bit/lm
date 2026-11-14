import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Layer, Solid} from '../../../components/DepthLayers';
import {Box} from '../../../components/kit';
import {Caption} from '../../../components/Overlay';
import {Actor, blinks, cue, dolly, jointOf, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {RingSound, SIT, SIT_LEAN, SIT_LOW, SIT_TABLE, STAND_CHEER, STAND_EAR, STAND_OFFER, walker} from './common';
import {CLOSE, heroAt, Kitchen, MEDIUM, mumAt, WIDE} from './S1';
import {KITCHEN} from './kitchen/KitchenSet';
import {HighStreet} from './sets2';
import {Lounge} from './sets3';
import {OfficeKitchen, STOOLS} from './sets4';

// Section 9, Year 1: he has learned to ask why. Warm again.

type P = ShotProps & {frame: number};
const WARM = 'saturate(1.08)';
const flash = (frame: number, ring: number) => ({color: '#FFB703', opacity: 0.04 * track(frame, [[ring, 0], [ring + 3, 1], [ring + 20, 0]])});
const PHONE: Pose = {lean: 3, headTilt: 6, nod: 0.4, armL: [-24, -12], armR: [38, 128], legL: [-10, -10], legR: [10, 10]};
const easy = mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.45);

/** 9.1 The same kitchen, a year on. */
export const S9_1: React.FC<P> = ({frame, dur, lines}) => {
	const rings = [cue(lines[0], 'You still hear'), cue(lines[0], 'Thirty')];
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const hero = heroAt(frame, SIT_TABLE, {expression: easy, gaze: [0.5 + 0.3 * Math.sin(frame * 0.03), 0], turn: 0.6});
	return (
		<Stage grade={WARM} camera={dolly(span(frame, 0, dur), WIDE, MEDIUM)} wash={flash(frame, last)}>
			<Kitchen mood="evening">
				<Actor {...hero} />
				<Ring actor={hero} since={frame - last} strength={0.6} />
			</Kitchen>
			{rings.map((r) => <RingSound key={r} at={r} volume={0.22} />)}
		</Stage>
	);
};

/** 9.2 "Five minutes away." He puts the kettle on. */
export const S9_2: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const ring = cue(l, 'Ring');
	const kettle = span(frame, cue(l, 'You put'), cue(l, 'You put') + 16);
	const hero: ActorProps = {
		who: 'hero',
		at: [1.05, 0, -1.75],
		flip: true,
		turn: 0.8,
		pose: mixPose(PHONE, {...POSES.point, armR: [84, 78]}, kettle),
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.6 * span(frame, ring, ring + 12)),
		gaze: kettle > 0.5 ? [0.7, 0.2] : [0.5, 0.7],
		blink: blinks(frame, 1),
	};
	const hand = jointOf(hero, 'handR');
	return (
		<Stage grade={WARM} camera={dolly(span(frame, 0, dur), shot([0.3, 1.45, 2.6], [0.8, 1.15, -1.9]), shot([0.5, 1.4, 1.7], [0.75, 1.15, -1.9]))} wash={flash(frame, ring)} overlay={<Caption number="20" text="MORE LIKE" numberLast since={frame - cue(l, "He'll be")} />}>
			<Kitchen mood="evening">
				<Actor {...hero} />
				{kettle < 0.5 ? (
					<Layer name="mid">
						<Solid size={[0.075, 0.14, 0.012]} position={[hand[0] - 0.02, hand[1] + 0.05, hand[2] + 0.03]} color="#1C2244" bevel={0.005} emissive="#9CC3DE" emissiveIntensity={0.3} />
					</Layer>
				) : null}
				<Ring actor={hero} since={frame - ring} strength={0.7} />
			</Kitchen>
			<RingSound at={ring} volume={0.3} />
		</Stage>
	);
};

/** 9.3 She loves the present. He kept the receipt. */
export const S9_3: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const ring = cue(l, 'Ring');
	const hand = span(frame, cue(l, 'You hand'), cue(l, 'You hand') + 14);
	const laugh = span(frame, cue(l, 'she laughs'), cue(l, 'she laughs') + 10);
	const bounce = laugh * Math.abs(Math.sin(frame * 0.5)) * 0.04;
	const friend: ActorProps = {who: 'other', at: [0.95, bounce, 0.4], flip: true, turn: 0.85, scale: 0.96, pose: mixPose(STAND_OFFER, STAND_CHEER, laugh * 0.6), expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.6 + 0.4 * laugh), talk: talking(frame, l.a + 10, ring - 6) + laugh * 0.8, blink: blinks(frame, 4)};
	const hero: ActorProps = {who: 'hero', at: [-0.45, 0, 0.4], turn: 0.85, pose: mixPose(POSES.stand, STAND_OFFER, hand), expression: mixExpression(easy, EXPRESSIONS.delighted, laugh), gaze: [0.8, 0], blink: blinks(frame, 1)};
	const hers = jointOf(friend, 'handR');
	const his = jointOf(hero, 'handR');
	return (
		<Stage grade={WARM} camera={dolly(span(frame, 0, dur), shot([-0.4, 1.45, 4.2], [0.25, 1.1, 0.4]), shot([0.0, 1.35, 3.2], [0.25, 1.15, 0.4]))} wash={flash(frame, ring)}>
			<Lounge kind="present" />
			<Actor {...friend} />
			<Actor {...hero} />
			<Layer name="mid">
				<Box at={[hers[0] - 0.05, hers[1] - 0.05, hers[2] + 0.05]} size={[0.24, 0.18, 0.2]} color="#E2493B" ribbon="#FFF4E0" turn={-10} />
				{hand > 0.2 ? <Solid size={[0.09, 0.2, 0.004]} rotation={[0, 0, 0.2]} position={[his[0] + 0.04, his[1] + 0.06, his[2] + 0.04]} color="#FFF4E0" cast={false} /> : null}
			</Layer>
			<Ring actor={hero} since={frame - ring} strength={0.7} side={-1} />
			<RingSound at={ring} volume={0.3} />
		</Stage>
	);
};

/** 9.4 "I'm fine." Ring. He sits down. "I've got time." */
export const S9_4: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const ring = cue(l, 'Ring');
	const sit = cue(l, 'you sit down');
	const down = span(frame, sit - 4, sit + 14);
	const arrive = Math.min(1, frame / Math.max(1, sit - 8));
	const walking = walker(frame, 0, 0, 1, 0);
	const hero: ActorProps = {
		who: 'hero',
		at: [-1.6 + (STOOLS[0] + 0.06 + 1.6) * arrive, 0.27 * down, 0.22],
		turn: 0.85,
		pose: mixPose(mixPose(walking.pose as Pose, POSES.stand, span(frame, sit - 18, sit - 6)), SIT_LEAN, down),
		expression: easy,
		gaze: [0.8, 0],
		talk: talking(frame, cue(l, '"Okay'), l.b),
		blink: blinks(frame, 1),
		scarf: {...walking.scarf, flow: (walking.scarf?.flow ?? 0) * (1 - span(frame, sit - 18, sit - 4)) * 0.6},
	};
	return (
		<Stage grade={WARM} camera={dolly(span(frame, 0, dur), shot([0.6, 1.5, 4.6], [1.5, 1.15, 0.2]), shot([1.2, 1.4, 3.2], [1.6, 1.25, 0.2]))} wash={flash(frame, ring)}>
			<OfficeKitchen warm />
			<Actor who="other" at={[STOOLS[1] - 0.06, 0.27, 0.22]} flip turn={0.6 + 0.25 * down} scale={0.98} pose={mixPose(SIT_LOW, SIT, down * 0.7)} expression={mixExpression(EXPRESSIONS.crushed, EXPRESSIONS.neutral, down * 0.6)} gaze={[0.75 * down, 0.5 * (1 - down)]} talk={talking(frame, cue(l, '"I\'m fine'), ring - 6)} blink={blinks(frame, 4)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} strength={0.7} side={-1} />
			<RingSound at={ring} volume={0.3} />
		</Stage>
	);
};

/** 9.5 He calls her. Nothing rings. */
export const S9_5: React.FC<P> = ({frame, dur, lines}) => {
	const [l5, , l7] = lines;
	const relief = span(frame, cue(l7, 'For once'), cue(l7, 'For once') + 20);
	const hero: ActorProps = {
		who: 'hero',
		at: [-1.4, 0, -1.2],
		flip: true,
		turn: 0.5,
		pose: {...STAND_EAR, lean: 2},
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.4 * (1 - relief)), EXPRESSIONS.delighted, 0.5 * relief),
		gaze: [0.2, 0.3 * (1 - relief)],
		talk: talking(frame, cue(l5, '"I asked'), l5.b),
		blink: blinks(frame, 1),
	};
	const ear = jointOf(hero, 'handL');
	return (
		<Stage grade={WARM} camera={dolly(span(frame, 0, dur), shot([-0.4, 1.5, 3.6], [-1.3, 1.15, -1.2]), shot([-0.9, 1.35, 1.6], [-1.35, 1.25, -1.2]))}>
			<Lounge kind="dawn" />
			<Actor {...hero} />
			<Layer name="mid">
				<Solid size={[0.07, 0.14, 0.012]} position={[ear[0] - 0.01, ear[1] + 0.02, ear[2] + 0.05]} color="#1C2244" bevel={0.005} />
			</Layer>
		</Stage>
	);
};

/** 9.6 Most people are lying to give you something. */
export const S9_6: React.FC<P> = ({frame, dur, lines}) => {
	const toParty = lines[2].a - 8;
	if (frame < toParty) {
		const hero = heroAt(frame, SIT_TABLE, {expression: mixExpression(easy, EXPRESSIONS.delighted, span(frame, 30, 120) * 0.5), gaze: [0.8, -0.1]});
		const mum = mumAt(frame, 1, true);
		return (
			<Stage grade={WARM} camera={dolly(span(frame, 0, toParty), MEDIUM, CLOSE)}>
				<Kitchen mood="evening">
					<Actor {...mum} at={[-0.9, 0, -1.6]} turn={0.8} pose={mixPose(POSES.stand, STAND_OFFER, 0.4)} expression={mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.7)} gaze={[0.75, 0]} blink={blinks(frame, 5)} talk={talking(frame, 40, 110)} />
					<Actor {...hero} />
				</Kitchen>
			</Stage>
		);
	}

	const local = frame - toParty;
	const cheer = (i: number) => 0.5 + 0.5 * Math.sin(local * 0.09 + i * 1.7);
	const spots: Array<[number, number, number]> = [[-2.2, 0, -0.4], [-1.5, 0, 0.6], [1.5, 0, 0.7], [2.3, 0, -0.3], [0.9, 0, -1.2]];
	return (
		<Stage grade={WARM} camera={dolly(span(frame, toParty, dur), shot([-0.6, 1.6, 5.6], [0, 1.1, 0]), shot([-0.2, 1.4, 3.6], [-0.1, 1.2, 0.4]))}>
			<Lounge kind="party" />
			{spots.map((at, i) => (
				<Actor key={i} who="other" at={at} flip={at[0] > 0} turn={0.8} scale={[0.96, 1.02, 0.93, 1.05, 0.97][i]} pose={mixPose(POSES.stand, STAND_CHEER, cheer(i) * 0.8)} expression="delighted" blink={blinks(frame, i + 3)} />
			))}
			<Actor who="hero" at={[-0.4, 0, 0.9]} turn={0.2} pose={mixPose(POSES.stand, STAND_CHEER, 0.3 * cheer(9))} expression="delighted" blink={blinks(frame, 1)} />
		</Stage>
	);
};

/** 9.7 At the window. Pull back through the glass as the lights come on. */
export const S9_7: React.FC<P> = ({frame, dur, lines}) => {
	const out = lines[0].b - 30;
	if (frame < out) {
		return (
			<Stage grade={WARM} camera={dolly(span(frame, 0, out), shot([-1.6, 1.5, 1.2], [-2.3, 1.4, -2.4]), shot([-1.9, 1.48, 0.2], [-2.35, 1.42, -2.4]))}>
				<Lounge kind="dawn" />
				<Actor who="hero" at={[-2.35, 0, -2.0]} back pose={{...POSES.stand, armL: [-14, -6], armR: [14, 6]}} scarf={{side: -1, phase: frame * 0.05}} />
			</Stage>
		);
	}

	const p = span(frame, out, dur);
	const listening = cue(lines[2], 'listening') + 6;
	const hero: ActorProps = {who: 'hero', at: [0.45, 3.42, -2.92], scale: 0.5, pose: 'stand', expression: easy, blink: blinks(frame, 1)};
	return (
		<Stage grade={WARM} backgroundBlur={0} camera={dolly(p, shot([0.5, 3.9, 0.6], [0.45, 3.9, -3]), shot([-1.4, 3.2, 11], [0.2, 2.6, -3], 34))}>
			<HighStreet mood="dusk" lit={span(frame, out + 20, dur - 60)} />
			<Layer name="bg">
				<Actor {...hero} />
			</Layer>
			<Ring actor={hero} since={frame - listening} strength={0.6} />
			<RingSound at={listening} volume={0.3} />
			{KITCHEN && SIT ? null : null}
		</Stage>
	);
};
