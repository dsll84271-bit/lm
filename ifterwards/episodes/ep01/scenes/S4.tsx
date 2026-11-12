import React from 'react';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {POSES} from '../../../characters/stickman/poses';
import {mixExpression, mixPose} from '../../../characters/stickman/rig';
import {Caption} from '../../../components/Overlay';
import {Actor, blinks, cue, dolly, Ring, shot, span, Stage, talking, track, type ActorProps, type ShotProps} from '../../../components/Stage';
import {crowd, RingSound, seat, SIT, SIT_LEAN, SIT_LOW, SIT_TABLE, STAND_CHEER, STAND_OFFER, STAND_STIFF, walker} from './common';
import {EAR} from './S1';
import {HighStreet} from './sets2';
import {CardRoom, Interview, Lounge, Restaurant, Showroom} from './sets3';

// Section 4, Week 1: the advantage.

type P = ShotProps & {frame: number};
const flash = (frame: number, ring: number, amount = 0.07) => ({color: '#FF4D3D', opacity: amount * track(frame, [[ring, 0], [ring + 2, 1], [ring + 16, 0]])});

/** 4.1 The car showroom. */
export const S4_1: React.FC<P> = ({frame, dur, lines}) => {
	const [l0, l1, l2] = lines;
	const rings = [cue(l1, 'Ring', 0), cue(l1, 'Ring', 1)];
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const go = cue(l1, 'walks round');
	const back = cue(l1, 'walks back');
	const saved = l2.a;
	// The stickman strolls in, then stands his ground.
	const arrive = l0.b + 20;
	const walkIn = walker(Math.min(frame, arrive), -4.6, 0.3, 0.95 * (3.1 / (arrive / 30)) / 0.95, 0, {who: 'hero'});
	const stopped = span(frame, arrive - 6, arrive + 6);
	const hero: ActorProps = {
		...walkIn,
		at: [-4.6 + 3.1 * Math.min(1, frame / arrive), 0, 0.3],
		pose: mixPose(mixPose(walkIn.pose as never, POSES.stand, stopped), STAND_CHEER, span(frame, saved + 4, saved + 16)),
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, span(frame, rings[0], rings[0] + 8)), EXPRESSIONS.delighted, span(frame, saved, saved + 10)),
		gaze: [0.8, 0],
		scarf: {...walkIn.scarf, flow: (walkIn.scarf?.flow ?? 0) * (1 - stopped)},
	};
	// The salesman pitches, leaves "to check with his manager", and comes back.
	const away = track(frame, [[go, 0], [go + 50, 1], [back - 10, 1], [back + 40, 0]]);
	const moving = away > 0.02 && away < 0.98;
	const leaving = frame < (go + back) / 2;
	const stride = walker(frame, 0, 0, 1.2, 9);
	const salesman: ActorProps = {
		who: 'other',
		at: [0.1 + away * 5.6, 0, 0.3],
		scale: 1.04,
		flip: moving ? !leaving : true,
		turn: 0.85,
		pose: moving ? stride.pose : mixPose(mixPose(POSES.stand, STAND_OFFER, span(frame, l1.a, l1.a + 12)), POSES.slump, span(frame, saved - 10, saved + 10)),
		expression: frame > saved ? 'crushed' : 'delighted',
		talk: talking(frame, cue(l1, 'The salesman'), rings[0] - 5) + talking(frame, cue(l1, 'He says he'), rings[1] - 5) + talking(frame, cue(l1, 'He says, "I'), go - 4),
		blink: blinks(frame, 8),
	};
	const camera =
		frame < l1.a + 40
			? dolly(span(frame, 0, l1.a + 40), shot([-3.0, 1.15, 4.4], [0.6, 0.85, -0.7]), shot([-0.9, 1.35, 5.0], [-0.4, 1.0, 0]))
			: dolly(span(frame, l1.a + 40, dur), shot([-0.9, 1.35, 5.0], [-0.4, 1.0, 0]), shot([-0.9, 1.35, 3.4], [-0.9, 1.1, 0.2]));
	return (
		<Stage camera={camera} wash={flash(frame, last)} overlay={<Caption number="£1,100" text="SAVED" since={frame - saved - 8} />}>
			<Showroom />
			<Actor {...salesman} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - last} side={-1} />
			{rings.map((r) => <RingSound key={r} at={r} />)}
		</Stage>
	);
};

/** 4.2 The job interview. */
export const S4_2: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const ring = cue(l, 'Ring');
	const stand = cue(l, 'You thank');
	const leave = cue(l, 'and you go') - 6;
	const up = span(frame, stand, stand + 14);
	const gone = Math.max(0, frame - leave) / 30;
	const stride = walker(frame, 0, 0, -1.1, 0);
	const base = seat(-1.1, -0.5, false);
	const hero: ActorProps = {
		who: 'hero',
		at: [base[0] - gone * 1.2, 0, base[2]],
		flip: gone > 0,
		turn: 0.85,
		pose: gone > 0 ? stride.pose : mixPose(mixPose(SIT, SIT_LEAN, span(frame, l.a, l.a + 12) * (1 - span(frame, ring, ring + 10))), POSES.stand, up),
		expression: mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, span(frame, ring, ring + 8)),
		talk: talking(frame, cue(l, '"Why'), cue(l, 'They say') - 4),
		gaze: [0.8, -0.1],
		blink: blinks(frame, 1),
		scarf: gone > 0 ? stride.scarf : undefined,
	};
	const panel = (x: number, seed: number, speaking: boolean): ActorProps => ({
		who: 'other',
		at: [x, -0.4, -1.75],
		scale: 1.02,
		turn: -0.7,
		pose: STAND_STIFF,
		expression: frame > stand ? 'shocked' : speaking ? 'delighted' : 'neutral',
		talk: speaking ? talking(frame, cue(l, '"She wanted'), ring - 5) : 0,
		gaze: [-0.6 - gone * 0.2, 0],
		blink: blinks(frame, seed),
	});
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-0.4, 1.45, 4.6], [0.2, 1.0, -1.0]), shot([-0.9, 1.35, 3.6], [-0.4, 1.05, -0.9]))} wash={flash(frame, ring)}>
			<Interview />
			<Actor {...panel(0.8, 4, true)} />
			<Actor {...panel(1.75, 6, false)} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - ring} side={-1} />
			<RingSound at={ring} />
		</Stage>
	);
};

/** 4.3 The first date. Nothing rings. */
export const S4_3: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const silence = cue(l, 'Silence');
	const truth = cue(l, "She's telling");
	const happy = span(frame, truth, truth + 12);
	const waiting = track(frame, [[silence - 4, 0], [silence + 4, 1], [truth - 2, 1], [truth + 6, 0]]);
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([0, 1.3, 3.8], [0, 1.0, 0]), shot([-0.2, 1.2, 2.6], [-0.1, 1.06, 0]))} exposure={1.15}>
			<Restaurant flicker={Math.sin(frame * 0.7) * Math.sin(frame * 0.23)} />
			<Actor who="other" at={seat(0.85, 0, true)} flip turn={0.85} scale={0.94} pose={mixPose(SIT_TABLE, SIT_LEAN, span(frame, cue(l, 'She says'), cue(l, 'She says') + 12))} expression={mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.delighted, 0.5 + 0.5 * happy)} talk={talking(frame, cue(l, '"I never'), silence - 6)} blink={blinks(frame, 5)} />
			<Actor
				who="hero"
				at={seat(-0.85, 0, false)}
				turn={0.85}
				pose={mixPose(SIT_TABLE, SIT_LEAN, happy)}
				expression={mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, waiting * 0.7), EXPRESSIONS.delighted, happy)}
				gaze={[0.8 - waiting * 1.3, -waiting * 0.5]}
				blink={blinks(frame, 1)}
			/>
		</Stage>
	);
};

/** 4.4 Poker, exactly once. */
export const S4_4: React.FC<P> = ({frame, dur, lines}) => {
	const sour = span(frame, cue(lines[0], 'Nobody'), cue(lines[0], 'Nobody') + 14);
	const glare = (x: number, seed: number): ActorProps => ({who: 'other', at: [x, -0.42, -0.95], turn: -0.5, pose: STAND_STIFF, expression: 'suspicious', gaze: [-0.7, 0.2], blink: blinks(frame, seed), scale: 0.98 + seed * 0.01});
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-0.9, 1.55, 3.9], [0, 0.95, 0]), shot([0.5, 1.4, 3.3], [-0.1, 0.98, 0]))}>
			<CardRoom />
			<Actor {...glare(-0.3, 3)} />
			<Actor {...glare(0.55, 5)} />
			<Actor who="other" at={seat(1.2, 0, true)} flip turn={0.85} pose={SIT_LOW} expression="crushed" blink={blinks(frame, 7)} />
			<Actor who="hero" at={seat(-1.2, 0, false)} turn={0.6 - sour * 0.4} pose={{...SIT_TABLE, lean: -3}} expression={mixExpression(EXPRESSIONS.delighted, EXPRESSIONS.neutral, sour)} gaze={[0.6 - sour * 0.6, 0]} blink={blinks(frame, 1)} />
		</Stage>
	);
};

/** 4.5 He can no longer watch television. */
export const S4_5: React.FC<P> = ({frame, dur, lines}) => {
	const l = lines[0];
	const first = cue(l, 'adverts');
	const rings = [first, cue(l, 'press'), cue(l, 'anybody'), cue(l, 'selling'), cue(l, 'Your living'), cue(l, 'smoke'), cue(l, 'flat battery')];
	const last = [...rings].reverse().find((r) => frame >= r) ?? -999;
	const red = frame - last < 9;
	const worn = span(frame, rings[1], rings[5]);
	const hero: ActorProps = {
		who: 'hero',
		at: [1.22, 0, -0.28],
		flip: true,
		turn: 0.85,
		pose: mixPose(mixPose(SIT, EAR, span(frame, rings[2], rings[2] + 10)), SIT_LOW, span(frame, rings[5], dur) * 0.4),
		expression: mixExpression(mixExpression(EXPRESSIONS.neutral, EXPRESSIONS.suspicious, span(frame, first, first + 8)), EXPRESSIONS.crushed, worn * 0.7),
		gaze: [0.8, 0],
		blink: blinks(frame, 1),
	};
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([-0.2, 1.35, 4.4], [-0.5, 0.95, -0.5]), shot([0.0, 1.28, 3.5], [-0.25, 1.0, -0.5]))} wash={flash(frame, last, 0.1)}>
			<Lounge kind="tv" screen={red ? '#FF4D3D' : ['#9CC3DE', '#B8E0C8', '#E8D9A0'][Math.floor(frame / 50) % 3]} />
			<Actor {...hero} />
			<Ring actor={hero} since={frame - last} strength={0.9} />
			{rings.map((r) => <RingSound key={r} at={r} volume={0.4} />)}
		</Stage>
	);
};

/** 4.6 The hardest person in the country to fool. */
export const S4_6: React.FC<P> = ({frame, dur}) => {
	const hero = walker(frame, 2.8, 0.2, -1.0, 0, {who: 'hero', expression: 'delighted'});
	const x = hero.at[0];
	return (
		<Stage camera={dolly(span(frame, 0, dur), shot([x - 1.9, 0.75, 3.0], [x - 0.2, 1.2, 0]), shot([x - 2.6, 1.0, 5.2], [x - 0.3, 1.25, 0]))}>
			<HighStreet />
			{crowd(frame + 700, 9).map((c, i) => <Actor key={i} {...c} />)}
			<Actor {...hero} />
		</Stage>
	);
};
