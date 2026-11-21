import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Layer} from '../../../components/DepthLayers';
import {Box} from '../../../components/kit';
import {Caption} from '../../../components/Overlay';
import {Actor, blinks, cue, dolly, jointOf, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {RingSound, seat, SIT_LOW, SIT_TABLE, STAND_CHEER, STAND_OFFER} from './common';
import {Lounge} from './sets3';

// Section 5, Month 1: the birthday, and what it costs.

type P = ShotProps & {frame: number};
const flash = (frame: number, ring: number, amount = 0.06) => ({color: '#FF4D3D', opacity: amount * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])});
const COOL = (c: number) => `saturate(${1 - 0.35 * c}) brightness(${1 - 0.06 * c})`;

const HERO_AT: [number, number, number] = [-0.85, 0, 0.85];
const HOLD: Pose = {lean: 2, headTilt: 4, nod: 0.5, armL: [20, 100], armR: [34, 96], legL: [-9, -9], legR: [9, 9]};

/** The four friends, standing around the room. */
const friends = (frame: number, acts: Record<number, Partial<ActorProps>> = {}): ActorProps[] =>
	[
		{at: [-2.3, 0, -0.5], flip: false, scale: 0.96},
		{at: [1.9, 0, -0.9], flip: true, scale: 1.02},
		{at: [2.7, 0, 0.1], flip: true, scale: 0.93},
		{at: [-1.9, 0, -1.4], flip: false, scale: 1.05},
	].map((f, i) => ({
		who: 'other' as const,
		at: f.at as [number, number, number],
		flip: f.flip,
		scale: f.scale,
		turn: 0.8,
		pose: POSES.stand,
		expression: 'delighted' as const,
		blink: blinks(frame, i + 3),
		...acts[i],
	}));

const present = (holder: ActorProps, dx = 0) => {
	const hand = jointOf(holder, 'handR');
	return (
		<Layer name="mid">
			<Box at={[hand[0] + dx, hand[1] - 0.06, hand[2] + 0.05]} size={[0.24, 0.18, 0.2]} color="#19C2B1" ribbon="#FFF4E0" turn={12} />
		</Layer>
	);
};

/** 5.1 The party. */
export const S5_1: React.FC<P> = ({frame, dur, lines}) => {
	const over = cue(lines[1], 'And one by one');
	const cheer = span(frame, lines[0].a, lines[0].a + 14) * (1 - span(frame, lines[1].a, lines[1].a + 20));
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-1.6, 1.7, 6.2], [0, 1.05, -0.4]), shot([-0.5, 1.45, 4.4], [-0.1, 1.05, 0.1]))}>
			<Lounge kind="party" />
			{friends(frame, {
				0: {pose: mixPose(POSES.stand, STAND_CHEER, cheer), at: [-2.3 + 0.7 * span(frame, over, dur), 0, -0.5]},
				1: {pose: mixPose(POSES.stand, STAND_CHEER, cheer * 0.9), talk: talking(frame, 40, 120)},
				2: {pose: mixPose(POSES.stand, STAND_CHEER, cheer)},
				3: {talk: talking(frame, 100, 190)},
			}).map((f, i) => <Actor key={i} {...f} />)}
			<Actor who="hero" at={HERO_AT} turn={0.3} pose="stand" expression="delighted" gaze={[Math.sin(frame * 0.06) * 0.7, 0]} blink={blinks(frame, 1)} />
		</Stage>
	);
};

/** 5.2 Three friends, three rings. */
export const S5_2: React.FC<P> = ({frame, lines}) => {
	const i = frame < lines[1].a - 6 ? 0 : frame < lines[2].a - 6 ? 1 : 2;
	const l = lines[i];
	const from = i === 0 ? 0 : l.a - 6;
	const ring = cue(l, 'Ring');
	const rings = lines.map((x) => cue(x, 'Ring'));
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const slip = [0.15, 0.5, 0.85][i] + 0.15 * span(frame, ring, ring + 10);
	const hero: ActorProps = {
		who: 'hero',
		at: HERO_AT,
		turn: 0.85,
		pose: 'stand',
		expression: mixExpression(EXPRESSIONS.delighted, mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.5), slip),
		gaze: [0.75, 0],
		blink: blinks(frame, 1),
	};
	const cams = [
		[shot([-1.6, 1.4, 3.4], [-0.35, 1.2, 0.8]), shot([-1.4, 1.38, 3.0], [-0.35, 1.2, 0.8])],
		[shot([0.7, 1.45, 3.5], [-0.4, 1.2, 0.8]), shot([0.5, 1.4, 3.1], [-0.4, 1.2, 0.8])],
		[shot([-0.6, 1.45, 3.2], [-0.45, 1.3, 0.8]), shot([-0.65, 1.42, 2.8], [-0.5, 1.3, 0.8])],
	][i];
	return (
		<Stage grade={COOL(0.15 * i)} camera={dolly(span(frame, from, l.b + 14), cams[0], cams[1])} wash={flash(frame, last)}>
			<Lounge kind="party" cool={0.12 * i} />
			{friends(frame).filter((_, k) => k !== i).map((f, k) => <Actor key={k} {...f} />)}
			<Actor who="other" at={[0.05, 0, 0.85]} flip turn={0.85} scale={[0.96, 1.02, 0.93][i]} pose={mixPose(POSES.stand, STAND_OFFER, span(frame, l.a - 4, l.a + 8))} expression="delighted" talk={talking(frame, l.a, ring - 5)} blink={blinks(frame, 4 + i)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - last} side={-1} />
			{rings.map((r) => <RingSound key={r} at={r} volume={0.5} />)}
		</Stage>
	);
};

/** 5.3 The present he clearly bought on the way here. */
export const S5_3: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const ring = cue(l, 'Ring');
	const give = span(frame, cue(l, 'hands you'), cue(l, 'hands you') + 14);
	const friend: ActorProps = {who: 'other', at: [0.15, 0, 0.85], flip: true, turn: 0.85, scale: 1.05, pose: mixPose(POSES.stand, STAND_OFFER, give), expression: 'delighted', talk: talking(frame, cue(l, '"Saw it'), ring - 5), blink: blinks(frame, 6)};
	const hero: ActorProps = {who: 'hero', at: HERO_AT, turn: 0.85, pose: 'stand', expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.4), EXPRESSIONS.crushed, span(frame, ring, ring + 12)), gaze: [0.6, 0.35], blink: blinks(frame, 1)};
	return (
		<Stage grade={COOL(0.4)} camera={dolly(span(frame, 0, dur), shot([-0.3, 1.5, 3.6], [-0.35, 1.2, 0.85]), shot([-0.35, 1.4, 2.8], [-0.38, 1.24, 0.85]))} wash={flash(frame, ring)}>
			<Lounge kind="party" cool={0.4} />
			{friends(frame).slice(0, 3).map((f, k) => <Actor key={k} {...f} />)}
			<Actor {...friend} />
			<Actor {...hero} />
			{present(friend, -0.1)}
			<Ring actor={hero} since={frame - ring} side={-1} />
			<RingSound at={ring} volume={0.5} />
		</Stage>
	);
};

/** 5.4 The ring says a sentence is false. It never says why. */
export const S5_4: React.FC<P> = ({frame, dur, lines}) => {
	const [, l7, l8] = lines;
	const toFriend = cue(l7, 'and a friend who is exhausted') - 6;
	const backToHim = l8.a - 8;
	const onFriend = frame >= toFriend && frame < backToHim;
	const cool = 0.45 + 0.5 * span(frame, 0, dur);
	const hero: ActorProps = {who: 'hero', at: HERO_AT, turn: 0.2, pose: HOLD, expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.6 + 0.4 * span(frame, 0, dur)), gaze: [0.1, 0.6], blink: blinks(frame, 1)};
	const tired: ActorProps = {who: 'other', at: [2.2, 0, 0.4], flip: true, turn: 0.4, scale: 1.05, pose: mixPose(POSES.slump, POSES.stand, span(frame, cue(l7, 'and came anyway'), cue(l7, 'and came anyway') + 20)), expression: mixExpression(EXPRESSIONS.crushed, EXPRESSIONS.delighted, 0.7 * span(frame, cue(l7, 'and came anyway'), cue(l7, 'and came anyway') + 20)), blink: Math.max(blinks(frame, 6), track(frame, [[toFriend + 30, 0], [toFriend + 40, 1], [toFriend + 62, 1], [toFriend + 72, 0]]))};
	const camera = onFriend
		? dolly(span(frame, toFriend, backToHim), shot([1.4, 1.4, 3.6], [2.15, 1.2, 0.4]), shot([1.7, 1.35, 2.7], [2.15, 1.22, 0.4]))
		: frame < toFriend
			? dolly(span(frame, 0, toFriend), shot([-0.9, 1.3, 2.5], [-0.85, 1.15, 0.85]), shot([-1.3, 1.5, 4.6], [-0.5, 1.1, 0.4]))
			: dolly(span(frame, backToHim, dur), shot([-1.0, 1.32, 2.9], [-0.85, 1.2, 0.85]), shot([-0.95, 1.3, 2.2], [-0.85, 1.22, 0.85]));
	return (
		<Stage grade={COOL(cool)} camera={camera} overlay={<Caption text="WHY?" red size={150} since={frame - cue(l8, 'You never')} />}>
			<Lounge kind="party" cool={cool} />
			{friends(frame, {0: {talk: talking(frame, 30, 200)}, 1: {talk: talking(frame, 150, 330)}}).slice(0, 3).map((f, k) => <Actor key={k} {...f} />)}
			<Actor {...tired} />
			<Actor {...hero} />
			{present(hero, 0.02)}
		</Stage>
	);
};

/** 5.5 Alone at the table. Now it rings when he talks. */
export const S5_5: React.FC<P> = ({frame, dur, lines}) => {
	const [l9, l10, l11, l12, l13, l14] = lines;
	const rings = [cue(l11, 'Ring'), cue(l12, 'Ring'), cue(l13, 'That one')];
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const quiet = last === rings[2];
	const hero: ActorProps = {
		who: 'hero',
		at: seat(1.25, 0.1, true),
		flip: true,
		turn: 0.8 - 0.55 * span(frame, l14.a, l14.a + 30),
		pose: mixPose(SIT_LOW, SIT_TABLE, 0.3),
		expression: mixExpression(EXPRESSIONS.crushed, EXPRESSIONS.suspicious, 0.35 * span(frame, l9.a, l9.b)),
		gaze: frame > l14.a + 20 ? [0, 0] : [0.3, 0.5],
		talk: talking(frame, l11.a, rings[0] - 4) + talking(frame, l12.a, rings[1] - 4) + talking(frame, l13.a, rings[2] - 6),
		blink: blinks(frame, 1),
	};
	const camera =
		frame < l10.a - 8
			? dolly(span(frame, 0, l10.a - 8), shot([-1.2, 1.7, 5.6], [0.4, 0.95, 0]), shot([-0.6, 1.5, 4.6], [0.5, 0.98, 0]))
			: frame < l14.a - 8
				? dolly(span(frame, l10.a - 8, l14.a - 8), shot([0.2, 1.3, 3.4], [1.0, 1.02, 0.2]), shot([0.5, 1.25, 2.7], [1.05, 1.05, 0.25]))
				: dolly(span(frame, l14.a - 8, dur), shot([0.9, 1.22, 2.6], [1.15, 1.08, 0.3]), shot([1.0, 1.18, 1.9], [1.17, 1.1, 0.3]));
	return (
		<Stage grade={COOL(1)} camera={camera} wash={flash(frame, last, quiet ? 0.025 : 0.06)}>
			<Lounge kind="after" />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - last} strength={quiet ? 0.45 : 0.9} />
			<RingSound at={rings[0]} volume={0.5} />
			<RingSound at={rings[1]} volume={0.5} />
			<RingSound at={rings[2]} volume={0.18} />
		</Stage>
	);
};
