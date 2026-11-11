// The five expressions the rulebook asks for first.
// Brows and mouth carry the acting; the eyes back them up.

import type {Expression} from './rig';

const brow = (y: number, angle: number, curve: number) => ({y, angle, curve});
const eye = (top: number, bottom: number, scale = 1) => ({top, bottom, scale});

export const EXPRESSIONS = {
	neutral: {
		browL: brow(0, 0, 1.5),
		browR: brow(0, 0, 1.5),
		eyeL: eye(0.92, 1),
		eyeR: eye(0.92, 1),
		pupil: 1,
		gaze: [0, 0],
		mouth: {w: 12, corner: -1.5, top: 1, bottom: 1, round: 0, x: 0, tilt: 0},
	},
	delighted: {
		browL: brow(5, 5, 4),
		browR: brow(5, 5, 4),
		eyeL: eye(1, 0.6, 1.04),
		eyeR: eye(1, 0.6, 1.04),
		pupil: 1.12,
		gaze: [0, -0.1],
		mouth: {w: 23, corner: -8, top: -2, bottom: 17, round: 0.3, x: 0, tilt: 0},
	},
	shocked: {
		browL: brow(7, 9, 3),
		browR: brow(7, 9, 3),
		eyeL: eye(1, 1, 1.18),
		eyeR: eye(1, 1, 1.18),
		pupil: 0.56,
		gaze: [0, 0],
		mouth: {w: 9, corner: 2, top: -9, bottom: 14, round: 1, x: 0, tilt: 0},
	},
	suspicious: {
		browL: brow(-9, -17, 0),
		browR: brow(5, -3, 4),
		eyeL: eye(0.36, 0.7),
		eyeR: eye(0.58, 0.8),
		pupil: 0.95,
		gaze: [0.75, 0],
		mouth: {w: 12, corner: 0, top: 0, bottom: 0, round: 0, x: 6, tilt: -10},
	},
	crushed: {
		browL: brow(-3, 23, -1),
		browR: brow(-3, 23, -1),
		eyeL: eye(0.62, 0.95),
		eyeR: eye(0.62, 0.95),
		pupil: 1.1,
		gaze: [0, 0.6],
		mouth: {w: 13, corner: 6, top: -3, bottom: -3, round: 0, x: 0, tilt: 0},
	},
} as const satisfies Record<string, Expression>;

export type ExpressionName = keyof typeof EXPRESSIONS;
