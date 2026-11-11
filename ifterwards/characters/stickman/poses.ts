// The six poses the rulebook asks for first.
// Angles are in degrees: 0 points straight down, 90 to screen right, 180 up.
// Each pair is [upper part, lower part]: upper arm and forearm, thigh and shin.

import type {Pose, SolvedPose} from './rig';

/**
 * One moment of the walk. `phase` runs 0 to 1 for one full stride, then repeats.
 * He walks towards screen right; flip the character to walk left.
 */
export const walkCycle = (phase: number): SolvedPose => {
	const a = phase * Math.PI * 2;
	const swing = Math.sin(a);
	const leg = (s: number, lifting: number): [number, number] => {
		const thigh = 3 + 27 * s;
		// The knee folds while the leg swings forward, and straightens to land.
		const knee = 7 + 36 * Math.max(0, lifting) ** 1.4;
		return [thigh, thigh - knee];
	};
	const arm = (s: number): [number, number] => {
		const upper = -25 * s;
		return [upper, upper + 14 + 14 * Math.max(0, -s)];
	};
	return {
		lean: 5,
		headTilt: -2,
		legR: leg(swing, Math.cos(a)),
		legL: leg(-swing, -Math.cos(a)),
		armR: arm(swing),
		armL: arm(-swing),
	};
};

export const POSES = {
	stand: {
		lean: 0,
		headTilt: 0,
		armL: [-30, -17],
		armR: [30, 17],
		legL: [-11, -11],
		legR: [11, 11],
	},
	walk: walkCycle(0.2),
	sit: {
		lean: 4,
		headTilt: -2,
		armL: [6, 52],
		armR: [22, 64],
		legL: [90, 8],
		legR: [78, -6],
	},
	point: {
		lean: 3,
		headTilt: -1,
		armL: [-26, -14],
		armR: [97, 101],
		legL: [-13, -13],
		legR: [11, 11],
	},
	slump: {
		lean: 9,
		headTilt: 9,
		nod: 1,
		armL: [-9, -4],
		armR: [12, 7],
		legL: [-10, -15],
		legR: [14, 4],
	},
	handToEar: {
		lean: -2,
		headTilt: 7,
		armL: [-27, -14],
		// His left ear, which is on screen right when he faces us.
		armR: {reach: [1.06, 0.12], from: 'head', bend: -1},
		legL: [-11, -11],
		legR: [11, 11],
		front: ['armR'],
	},
} as const satisfies Record<string, Pose | SolvedPose>;

export type PoseName = keyof typeof POSES;
