import React from 'react';
import {Audio, Sequence} from 'remotion';
import type {Pose} from '../../../characters/stickman/rig';
import ringSound from '../../../sfx/ring.wav';

/** Plays the ring at a given frame of the shot. */
export const RingSound: React.FC<{at: number; volume?: number}> = ({at, volume = 0.55}) =>
	at >= 0 ? (
		<Sequence from={Math.round(at)} layout="none">
			<Audio src={ringSound} volume={volume} />
		</Sequence>
	) : null;

// Sitting poses. They are drawn facing screen right; flip the actor to face left.
const LEGS = {legL: [90, 7], legR: [80, -5]} as const;
/** Sitting, hands in lap. */
export const SIT: Pose = {lean: 3, headTilt: -2, armL: [6, 52], armR: [22, 64], ...LEGS};
/** Sitting at a table, forearms resting on it. */
export const SIT_TABLE: Pose = {lean: 5, headTilt: -3, armL: [44, 108], armR: [58, 104], ...LEGS};
/** Sitting at a table, leaning in. */
export const SIT_LEAN: Pose = {lean: 12, headTilt: -5, armL: [50, 112], armR: [64, 108], ...LEGS};
/** Sitting, shoulders dropped, head bowed. */
export const SIT_LOW: Pose = {lean: 9, headTilt: 4, nod: 0.7, armL: [10, 40], armR: [22, 56], ...LEGS};
/** Sitting, hand to the ear on the side away from the way he faces. */
export const SIT_EAR: Pose = {
	lean: 1,
	headTilt: -7,
	armL: {reach: [-1.07, 0.1], from: 'head', bend: 1},
	armR: [56, 102],
	...LEGS,
	front: ['armL'],
};
/** Standing, hand to the screen-left ear. Flip for the right ear. */
export const STAND_EAR: Pose = {
	lean: 2,
	headTilt: -7,
	armL: {reach: [-1.06, 0.12], from: 'head', bend: 1},
	armR: [27, 14],
	legL: [-11, -11],
	legR: [11, 11],
	front: ['armL'],
};
/** Standing, arms folded in (a closed, careful stance). */
export const STAND_STIFF: Pose = {lean: 0, headTilt: 0, armL: [-8, -3], armR: [8, 3], legL: [-4, -4], legR: [4, 4]};
/** Standing, one arm out, offering or explaining. */
export const STAND_OFFER: Pose = {lean: 4, headTilt: -2, armL: [-24, -12], armR: [62, 96], legL: [-12, -12], legR: [10, 10]};
/** Standing, both arms up: delight. */
export const STAND_CHEER: Pose = {lean: -2, headTilt: -4, armL: [-140, -160], armR: [140, 160], legL: [-13, -13], legR: [13, 13]};
/** Standing, shrugging. */
export const STAND_SHRUG: Pose = {lean: 0, headTilt: 6, armL: [-50, -110], armR: [50, 110], legL: [-9, -9], legR: [9, 9]};

/** Where a sitter's feet go for a chair at `x`, `z`. `left` = facing screen left. */
export const seat = (x: number, z: number, left = true): [number, number, number] => [x + (left ? -0.06 : 0.06), 0, z + 0.22];

// ------------------------------------------------------------- walking

import {walkCycle} from '../../../characters/stickman/poses';
import {scarfForMotion} from '../../../characters/stickman/rig';
import {UNIT} from '../../../characters/stickman/StickmanCard';
import {blinks, type ActorProps} from '../../../components/Stage';

/** Someone walking along a street. `speed` is metres a second; negative walks left. */
export const walker = (frame: number, x0: number, z: number, speed: number, seed = 0, extra: Partial<ActorProps> = {}): ActorProps => {
	const t = frame / 30;
	return {
		who: 'other',
		at: [x0 + speed * t, 0, z],
		pose: walkCycle((t * 1.9 * Math.abs(speed) + seed * 0.37) % 1),
		flip: speed < 0,
		turn: 0.9,
		blink: blinks(frame, seed),
		scarf: scarfForMotion(Math.abs(speed) / UNIT, t),
		...extra,
	};
};

/** A street's worth of passers-by. */
export const crowd = (frame: number, count: number, spread = 9): ActorProps[] =>
	Array.from({length: count}, (_, i) => {
		const right = i % 2 === 0;
		const speed = (0.7 + ((i * 13) % 7) * 0.08) * (right ? 1 : -1);
		const x0 = (right ? -spread : spread) + ((i * 2.9) % (spread * 2)) * (right ? 1 : -1) * 0.9;
		return walker(frame, x0, -1.5 + ((i * 7) % 10) * 0.13 + (i % 3) * 0.5, speed, i + 3, {scale: 0.93 + ((i * 5) % 6) * 0.025});
	});
