import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Layer, Solid} from '../../../components/DepthLayers';
import {Caption, Counter} from '../../../components/Overlay';
import {Actor, blinks, cue, dolly, jointOf, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {crowd, RingSound, seat, SIT_TABLE, STAND_EAR, STAND_OFFER, STAND_SHRUG, walker} from './common';
import {EAR} from './S1';
import {Bedroom, DiaryDesk, HighStreet, Office, Shop} from './sets2';

// Section 2, Day 1: he works out the rule.

type P = ShotProps & {frame: number};
const flash = (frame: number, ring: number, amount = 0.07) => ({color: '#FF4D3D', opacity: amount * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])});
const PHONE: Pose = {lean: 3, headTilt: 6, nod: 0.4, armL: [-24, -12], armR: [38, 128], legL: [-10, -10], legR: [10, 10]};

/** 2.1 He walks down the high street, working it out. */
export const S2_1: React.FC<P> = ({frame, dur, lines}) => {
	const ring = cue(lines[0], 'you hear the ring');
	const stop = span(frame, ring - 4, ring + 8);
	const x = -3.4 + 0.95 * (Math.min(frame, ring) / 30) + 0.3 * stop;
	const walking = walker(Math.min(frame, ring), -3.4, 0, 0.95, 0, {who: 'hero'});
	const hero: ActorProps = {
		...walking,
		at: [x, 0, 0],
		pose: mixPose(walking.pose as Pose, {...STAND_EAR, lean: -2}, stop),
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.shocked, stop), EXPRESSIONS.delighted, span(frame, ring + 45, ring + 70)),
		scarf: {...walking.scarf, flow: (walking.scarf?.flow ?? 0) * (1 - stop)},
	};
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([x - 0.6, 1.35, 5.4], [x + 0.5, 1.05, 0]), shot([x + 0.2, 1.3, 4.3], [x + 0.2, 1.1, 0]))} wash={flash(frame, ring)}>
			<HighStreet />
			{crowd(frame, 7).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} side={-1} />
			<RingSound at={ring} />
		</Stage>
	);
};

/** 2.2 "Five minutes away." He checks his phone. */
export const S2_2: React.FC<P> = ({frame, dur, lines}) => {
	const ring = cue(lines[0], 'Ring');
	const hero: ActorProps = {
		who: 'hero',
		at: [0.4, 0, 0.2],
		turn: 0.6,
		pose: PHONE,
		gaze: frame < ring + 20 ? [0.5, 0.7] : [0, 0],
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, span(frame, ring, ring + 8)),
		blink: blinks(frame, 2),
	};
	const hand = jointOf(hero, 'handR');
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-0.4, 1.4, 4.0], [0.4, 1.15, 0]), shot([0.0, 1.35, 2.9], [0.45, 1.2, 0]))} wash={flash(frame, ring)}>
			<HighStreet />
			{crowd(frame + 200, 5).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
			<Layer name="mid">
				<Solid size={[0.075, 0.14, 0.012]} position={[hand[0] + 0.02, hand[1] + 0.05, hand[2] + 0.03]} color="#1C2244" bevel={0.005} emissive="#9CC3DE" emissiveIntensity={0.25} />
			</Layer>
			<Ring actor={hero} since={frame - ring} />
			<RingSound at={ring} />
		</Stage>
	);
};

/** 2.3 The shop. "The last one in stock." */
export const S2_3: React.FC<P> = ({frame, dur, lines}) => {
	const ring = cue(lines[0], 'Ring');
	const hero: ActorProps = {
		who: 'hero',
		at: [-0.9, 0, 0],
		turn: 0.85,
		pose: mixPose(POSES.stand, {...POSES.point, armR: [118, 124]}, span(frame, ring + 10, ring + 22)),
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, span(frame, ring, ring + 8)),
		gaze: [0.8, 0],
		blink: blinks(frame, 3),
	};
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-1.6, 1.45, 4.4], [0.3, 1.1, -0.8]), shot([-0.6, 1.4, 3.6], [0.4, 1.15, -0.8]))} wash={flash(frame, ring)}>
			<Shop />
			<Actor who="other" at={[1.0, 0, -1.45]} flip turn={0.8} scale={1.02} pose={STAND_SHRUG} talk={talking(frame, lines[0].a + 10, ring - 6)} blink={blinks(frame, 5)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} side={-1} />
			<RingSound at={ring} />
		</Stage>
	);
};

/** 2.4 The office. "No rush on this one." */
export const S2_4: React.FC<P> = ({frame, dur, lines}) => {
	const drop = cue(lines[0], 'No rush');
	const ring = cue(lines[0], 'Ring');
	const shake = track(frame, [[ring, 0], [ring + 2, 1], [ring + 22, 0]]) * Math.sin(frame * 2.4) * 0.03;
	const hero: ActorProps = {
		who: 'hero',
		at: seat(-1.0, -0.15, false),
		turn: 0.85,
		pose: mixPose(SIT_TABLE, {...EAR, front: ['armL']}, span(frame, ring, ring + 6)),
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.shocked, span(frame, ring, ring + 4)),
		gaze: frame < ring ? [0.7, -0.3] : undefined,
		blink: frame < ring ? blinks(frame, 4) : 0,
	};
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-0.3 + shake, 1.5, 4.6], [0.2, 1.0, -0.2]), shot([-0.2 + shake, 1.4 + shake, 3.5], [0.1, 1.05, -0.2]))} wash={flash(frame, ring, 0.13)}>
			<Office paper={frame < drop ? 0 : 34} />
			<Actor who="other" at={[1.55, 0, -0.1]} flip turn={0.85} scale={1.06} pose={mixPose(POSES.stand, STAND_OFFER, span(frame, drop - 12, drop))} expression="delighted" talk={talking(frame, drop, ring - 6)} blink={blinks(frame, 6)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} strength={1.7} side={-1} />
			<RingSound at={ring} volume={0.9} />
		</Stage>
	);
};

/** 2.5 "The best day of your life." */
export const S2_5: React.FC<P> = ({frame, dur}) => {
	const hero = walker(frame, -2.6, 0.2, 1.15, 0, {who: 'hero', expression: 'delighted'});
	const x = hero.at[0];
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([x + 1.6, 0.7, 3.2], [x + 0.2, 1.15, 0]), shot([x + 2.2, 0.9, 5.0], [x + 0.3, 1.2, 0]))}>
			<HighStreet />
			{crowd(frame + 500, 6).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
		</Stage>
	);
};

/** 2.6 The lie diary. */
export const S2_6: React.FC<P> = ({frame, dur, lines}) => (
	<Stage
		camera={dolly(span(frame, 0, dur), shot([-0.5, 1.7, 1.9], [0, 0.78, 0.05], 30), shot([0.15, 1.45, 1.25], [0.02, 0.78, 0.05], 30))}
		backgroundBlur={5}
		overlay={
			<>
				<Caption text="A DIARY OF LIES" since={frame - cue(lines[0], 'a psychologist')} until={lines[0].b - cue(lines[0], 'a psychologist') - 10} />
				<Caption text="EVERYONE. EVERY DAY." since={frame - lines[1].a} />
			</>
		}
	>
		<DiaryDesk marks={track(frame, [[cue(lines[0], 'keep a diary'), 0], [lines[1].b, 58]])} />
	</Stage>
);

/** 2.7 Thirty people on a normal Tuesday. */
export const S2_7: React.FC<P> = ({frame, dur, lines}) => {
	const hero: ActorProps = {who: 'hero', at: [0, 0, 0.3], pose: 'stand', expression: 'neutral', gaze: [Math.sin(frame * 0.09) * 0.7, 0], blink: blinks(frame, 1)};
	return (
		<Stage
			camera={dolly(span(frame, 0, dur), shot([0.2, 1.5, 4.2], [0, 1.1, 0]), shot([0.6, 2.4, 7.4], [0, 1.0, -0.4]))}
			overlay={<Counter value={Math.round(track(frame, [[lines[0].a, 0], [lines[0].b - 8, 30]]))} label="PEOPLE A DAY" since={frame - lines[0].a} />}
		>
			<HighStreet />
			{crowd(frame + 90, 16, 7).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
		</Stage>
	);
};

/** 2.8 Walking home: 1, 9, 23. */
export const S2_8: React.FC<P> = ({frame, dur, lines}) => {
	const rings = [8, Math.round(dur * 0.36), Math.round(dur * 0.66)];
	const count = frame < rings[1] ? 1 : frame < rings[2] ? 9 : 23;
	const hero = walker(frame, 2.6, 0.1, -0.8, 0, {who: 'hero', expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, span(frame, rings[1], rings[2]))});
	const x = hero.at[0];
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	return (
		<Stage
			camera={dolly(span(frame, 0, dur), shot([x - 1.2, 1.3, 4.6], [x - 0.3, 1.1, 0]), shot([x - 1.0, 1.3, 4.0], [x - 0.2, 1.1, 0]))}
			wash={flash(frame, last, 0.06)}
			overlay={<Counter value={count} label="LIES HEARD" since={frame - rings[0]} />}
		>
			<HighStreet mood="dusk" />
			{crowd(frame + 320, 7).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
			<Ring actor={hero} since={frame - last} strength={0.8} />
			{rings.map((r) => <RingSound key={r} at={r} volume={0.4} />)}
			{lines.length ? null : null}
		</Stage>
	);
};

/** 2.9 The lie detector does not detect lies. He does. */
export const S2_9: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const cut = cue(l, 'Which means');
	const onMachine = frame < cut;
	const proud = span(frame, cue(l, 'you are the only'), cue(l, 'you are the only') + 14);
	const hero: ActorProps = {
		who: 'hero',
		at: [-0.35, 0, -1.0],
		turn: 0.8,
		pose: mixPose({...POSES.stand, lean: 6, headTilt: 4}, {...POSES.stand, lean: -2, armR: [24, 158]}, proud),
		expression: mixExpression(EXPRESSIONS.suspicious, EXPRESSIONS.delighted, proud),
		gaze: [0.75 * (1 - proud), 0.4 * (1 - proud)],
		blink: blinks(frame, 2),
	};
	const machine = cue(l, 'The machine');
	const camera = onMachine
		? dolly(span(frame, 0, cut), shot([0.2, 1.75, 1.6], [0.9, 0.9, -1.2], 34), shot([0.75, 1.5, 0.3], [0.9, 0.9, -1.2], 34))
		: dolly(span(frame, cut, dur), shot([-0.9, 1.4, 2.6], [-0.1, 1.15, -1.0]), shot([-0.7, 1.35, 1.7], [-0.25, 1.2, -1.0]));
	return (
		<Stage camera={camera} overlay={<Caption text="NOT A LIE DETECTOR" since={frame - cue(l, "doesn't detect")} until={cut - cue(l, "doesn't detect") - 12} />}>
			<Bedroom t={frame < machine ? frame * 0.3 : frame} />
			<Actor {...hero} />
		</Stage>
	);
};
