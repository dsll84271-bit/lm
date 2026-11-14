import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose, type Pose} from '../../../characters/stickman/rig';
import {Layer, Solid} from '../../../components/DepthLayers';
import {Caption} from '../../../components/Overlay';
import {Actor, blinks, cue, dolly, jointOf, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {RingSound, SIT, SIT_LEAN, SIT_LOW, STAND_OFFER, walker} from './common';
import {Lounge} from './sets3';
import {Playroom} from './sets4';

// Section 7, Month 6: a very small life.

type P = ShotProps & {frame: number};
const GRADE = 'saturate(0.6) brightness(0.97)';
const flash = (frame: number, ring: number, amount = 0.05) => ({color: '#FF4D3D', opacity: amount * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])});

export const SOFA_HIM: [number, number, number] = [0.42, 0, -0.5];
export const SOFA_HER: [number, number, number] = [1.6, 0, -0.5];
const DOZE: Pose = {...SIT, lean: -9, headTilt: -8};

/** 7.1 An empty flat. */
export const S7_1: React.FC<P> = ({frame, dur, lines}) => {
	const ring = cue(lines[2], 'It rings');
	const hero: ActorProps = {who: 'hero', at: SOFA_HIM, turn: 0.5, pose: SIT_LOW, expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, 0.7), gaze: [0.1, 0.6], blink: blinks(frame, 1)};
	const camera =
		frame < lines[1].a - 8
			? dolly(span(frame, 0, lines[1].a - 8), shot([-2.4, 0.95, 2.2], [-1.2, 0.5, 0.1], 30), shot([-1.9, 1.1, 2.9], [-0.6, 0.7, -0.2], 30))
			: dolly(span(frame, lines[1].a - 8, dur), shot([-1.6, 1.5, 5.0], [0.2, 0.95, -0.6]), shot([-0.4, 1.25, 3.0], [0.4, 1.0, -0.5]));
	return (
		<Stage grade={GRADE} camera={camera} wash={flash(frame, ring)}>
			<Lounge kind="flat" />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} strength={0.8} side={-1} />
			<RingSound at={ring} volume={0.4} />
		</Stage>
	);
};

/** 7.2 "Do you ever get tired of me?" "No." Ring. */
export const S7_2: React.FC<P> = ({frame, dur, lines}) => {
	const [, l4, l5, l6] = lines;
	const ring = l6.a - 2;
	const hurt = span(frame, ring, ring + 14);
	const hero: ActorProps = {
		who: 'hero',
		at: SOFA_HIM,
		turn: 0.85,
		pose: mixPose(mixPose(SIT, SIT_LEAN, span(frame, l4.a - 6, l4.a + 8) * 0.6), SIT_LOW, hurt),
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.3), EXPRESSIONS.crushed, hurt),
		gaze: [0.8 * (1 - hurt), 0.5 * hurt],
		talk: talking(frame, cue(l4, '"Do you'), l4.b),
		blink: blinks(frame, 1),
	};
	return (
		<Stage grade={GRADE} camera={dolly(span(frame, 0, dur), shot([0.5, 1.45, 4.6], [0.95, 0.95, -0.6]), shot([0.75, 1.2, 2.5], [0.85, 1.02, -0.5]))} wash={flash(frame, ring, 0.07)}>
			<Lounge kind="flat" />
			<Actor who="other" at={SOFA_HER} flip turn={0.85} scale={0.94} pose={DOZE} expression={mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.4)} blink={Math.max(0.55, blinks(frame, 5))} talk={talking(frame, cue(l5, '"No'), l5.b)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} side={-1} />
			<RingSound at={ring} volume={0.6} />
		</Stage>
	);
};

/** 7.3 He does not sleep. In the morning he lies too. */
export const S7_3: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const say = cue(l, 'you tell her');
	const ring = cue(l, 'That rings');
	const go = cue(l, 'Only one') - 4;
	const gone = Math.max(0, frame - go) / 30;
	const stride = walker(frame, 0, 0, 1, 5);
	const hero: ActorProps = {who: 'hero', at: SOFA_HIM, turn: 0.6, pose: SIT_LOW, expression: 'crushed', gaze: [0.3, 0.5], talk: talking(frame, say, ring - 6), blink: blinks(frame, 1) * 0.5 + 0.25};
	return (
		<Stage grade={GRADE} camera={dolly(span(frame, 0, dur), shot([0.2, 1.35, 4.2], [0.9, 1.0, -0.5]), shot([0.0, 1.25, 3.0], [0.5, 1.05, -0.5]))} wash={flash(frame, ring)}>
			<Lounge kind="dawn" />
			<Actor who="other" at={[1.9 + gone * 1.3, 0, -0.3]} flip={gone === 0} turn={0.85} scale={0.94} pose={gone > 0 ? stride.pose : POSES.stand} expression={mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.crushed, span(frame, say + 20, ring))} blink={blinks(frame, 5)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} strength={0.9} side={-1} />
			<RingSound at={ring} volume={0.5} />
		</Stage>
	);
};

/** 7.4 The fact: children learn kind lies at three or four. */
export const S7_4: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const name = cue(l, 'prosocial');
	const kids = cue(l, 'Children');
	const give = span(frame, kids - 20, kids + 10);
	const child: ActorProps = {who: 'other', at: [-0.35, 0, 0.3], scale: 0.56, turn: 0.85, pose: mixPose(POSES.stand, {...STAND_OFFER, armR: [80, 110]}, give), expression: 'delighted', blink: blinks(frame, 3), talk: talking(frame, kids + 30, kids + 90)};
	const adult: ActorProps = {who: 'other', at: [0.75, 0, 0.3], flip: true, turn: 0.85, pose: mixPose(POSES.stand, {...STAND_OFFER, lean: 16, headTilt: 8, armR: [50, 70]}, give), expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, give), gaze: [0.5, 0.6], blink: blinks(frame, 6)};
	const hand = jointOf(give < 0.6 ? child : adult, 'handR');
	return (
		<Stage
			grade="saturate(0.9)"
			camera={dolly(span(frame, 0, dur), shot([0.1, 1.2, 4.6], [0.2, 0.75, 0.2]), shot([0.15, 0.95, 2.9], [0.2, 0.8, 0.3]))}
			overlay={
				<>
					<Caption text="PROSOCIAL LIES" since={frame - name} until={kids - name - 12} />
					<Caption text="IT STARTS AT" number="3" numberLast since={frame - cue(l, 'three or four')} />
				</>
			}
		>
			<Playroom />
			<Actor {...adult} />
			<Actor {...child} />
			{/* The drawing. */}
			<Layer name="mid">
				<Solid size={[0.2, 0.26, 0.008]} position={[hand[0], hand[1] + 0.08, hand[2] + 0.04]} color="#FFF4E0" cast={false} />
				<Solid shape="sphere" size={[0.05]} scale={[1, 1, 0.1]} position={[hand[0] - 0.02, hand[1] + 0.11, hand[2] + 0.047]} color="#E2493B" cast={false} />
				<Solid size={[0.1, 0.03, 0.004]} position={[hand[0] + 0.02, hand[1] + 0.02, hand[2] + 0.047]} color="#19C2B1" cast={false} />
			</Layer>
		</Stage>
	);
};

/** 7.5 What he has lost is the benefit of the doubt. */
export const S7_5: React.FC<P> = ({frame, dur}) => (
	<Stage grade={GRADE} camera={dolly(span(frame, 0, dur), shot([-1.9, 1.45, 1.4], [-2.3, 1.35, -2.4]), shot([-0.6, 1.8, 6.0], [-0.8, 1.1, -1.5]))}>
		<Lounge kind="flat" />
		<Actor who="hero" at={[-2.35, 0, -2.0]} back pose={{...POSES.stand, lean: 0, armL: [-14, -6], armR: [14, 6]}} scarf={{side: -1, phase: frame * 0.05}} />
	</Stage>
);
