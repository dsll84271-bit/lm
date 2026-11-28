// Where things are on a Hero3D, so props can sit in an invisible hand.

export type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;

/** Head-top point for a bubble, for someone standing (or sitting) at (x, y, z). */
export const top = (x: number, z: number, y = 0, sit = false): V3 => [x, y + (sit ? 1.45 : 1.8), z];

/** The world position of a hand, from the same arm angles Hero3D uses. side 1 = right (armR), -1 = left (armL). */
export const handAt = (pos: V3, turn: number, arm: [number, number], reach: number, side: 1 | -1, sit = false, height = 1.7): V3 => {
	const r = rad(reach);
	const a0 = rad(arm[0]);
	const a1 = rad(arm[1]);
	const u = [side * Math.sin(a0), -Math.cos(a0) * Math.cos(r), Math.cos(a0) * Math.sin(r)];
	const f = [side * Math.sin(a1), -Math.cos(a1) * Math.cos(r), Math.cos(a1) * Math.sin(r)];
	const k = height / 1.7;
	const lx = 0.25 * side + 0.28 * u[0] + 0.31 * f[0];
	const ly = 1.0 - (sit ? 0.36 : 0) + 0.28 * u[1] + 0.31 * f[1];
	const lz = 0.28 * u[2] + 0.31 * f[2];
	return [pos[0] + k * (lx * Math.cos(turn) + lz * Math.sin(turn)), pos[1] + k * ly, pos[2] + k * (-lx * Math.sin(turn) + lz * Math.cos(turn))];
};

/** The centre of the head. */
export const headAt = (pos: V3, sit = false, height = 1.7): V3 => [pos[0], pos[1] + (1.36 - (sit ? 0.36 : 0)) * (height / 1.7), pos[2]];

/** A point in front of the face (the mouth), for someone facing `turn`. */
export const mouthAt = (pos: V3, turn: number, sit = false): V3 => {
	const h = headAt(pos, sit);
	return [h[0] + Math.sin(turn) * 0.34, h[1] - 0.1, h[2] + Math.cos(turn) * 0.34];
};

/** Mixes two arm poses. */
export const mixArm = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
