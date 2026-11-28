// The stickman rig.
//
// One function, buildStickman(), turns a pose + an expression into a short list
// of flat shapes (SVG path strings with a fill and a stroke). Everything that
// draws a character goes through it, so he can never go off-model:
//   - Stickman.tsx draws the shapes as SVG (stills, 2D shots, the model sheet).
//   - 3D scenes can paint the same shapes onto a flat card inside the set.
//
// Units: the character is about 390 units tall. The origin (0, 0) is the ground
// between his feet. x grows to the right of the screen, y grows downwards.
// Angles are in degrees: 0 points straight down, 90 points to screen right,
// 180 points straight up.

import {COLOURS} from '../../brand/colours';

// ---------------------------------------------------------------- types

export type Vec = readonly [number, number];

/** One flat shape. `d` is SVG path data, which SVG and canvas both understand. */
export type Shape = {
	d: string;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	/** Optional path the shape is clipped to (used to keep pupils inside eyes). */
	clip?: string;
};

/** [upper angle, lower angle], or a point for the hand to reach. */
export type ArmSpec =
	| readonly [number, number]
	| {
			/** Where the hand goes. */
			reach: Vec;
			/** 'head': in head radii from the head centre. 'ground': in units from the feet. */
			from: 'head' | 'ground';
			/** Which way the elbow folds: 1 or -1. */
			bend?: 1 | -1;
	  };

export type Pose = {
	/** Torso lean. Positive leans to screen right. */
	lean: number;
	/** Extra head tilt on top of the lean. */
	headTilt: number;
	/** Bows the head: 1 = chin down, looking at the floor. -1 = chin up. */
	nod?: number;
	/** Screen-left arm and screen-right arm. */
	armL: ArmSpec;
	armR: ArmSpec;
	/** Screen-left leg and screen-right leg: [thigh angle, shin angle]. */
	legL: readonly [number, number];
	legR: readonly [number, number];
	/** Lifts the whole body off the ground (jumps, sitting on something high). */
	lift?: number;
	/** Arms drawn in front of the head and scarf instead of joined to the body. */
	front?: ReadonlyArray<'armL' | 'armR'>;
};

/** A pose with every arm already worked out as angles, so two can be blended. */
export type SolvedPose = Omit<Pose, 'armL' | 'armR'> & {
	armL: readonly [number, number];
	armR: readonly [number, number];
};

export type Brow = {
	/** Height above the resting position. */
	y: number;
	/** Positive lifts the inner end (worried). Negative drops it (cross). */
	angle: number;
	/** Arch. */
	curve: number;
};

export type Eye = {
	/** How open the upper and lower lids are, 0 to 1. */
	top: number;
	bottom: number;
	scale: number;
};

export type Mouth = {
	/** Half the width. */
	w: number;
	/** Height of the corners. Negative is up (a smile), positive is down. */
	corner: number;
	/** Height of the middle of the upper and lower edge. Equal values = closed. */
	top: number;
	bottom: number;
	/** 0 = pointed corners, 1 = a round "o". */
	round: number;
	/** Sideways shift and tilt, for lopsided mouths. */
	x: number;
	tilt: number;
};

export type Expression = {
	browL: Brow;
	browR: Brow;
	eyeL: Eye;
	eyeR: Eye;
	/** Pupil size, 1 = normal. */
	pupil: number;
	/** Where he is looking, -1 to 1 on each axis. */
	gaze: Vec;
	mouth: Mouth;
};

export type Scarf = {
	/** 0 = hanging at rest, 1 = streaming flat out behind him. */
	flow: number;
	/** Which side the tails fall or stream towards: -1 screen left, 1 screen right. */
	side: -1 | 1;
	/** Advances the ripple. Feed it time. */
	phase: number;
};

export type StickmanLook = {
	head: string;
	limb: string;
	outline: string;
	scarf: string | null;
};

export type StickmanOptions = {
	pose: Pose | SolvedPose;
	expression: Expression;
	look?: StickmanLook;
	scarf?: Partial<Scarf>;
	/** Turns the face a little: -1 looks screen left, 1 screen right, 0 straight on. */
	turn?: number;
	/** 0 = eyes open, 1 = eyes shut. */
	blink?: number;
	/** Mirrors the whole character. */
	flip?: boolean;
	/** Seen from behind: the head has no face. */
	back?: boolean;
};

export type Skeleton = {
	hip: Vec;
	neck: Vec;
	shoulder: Vec;
	head: Vec;
	headAngle: number;
	elbowL: Vec;
	handL: Vec;
	elbowR: Vec;
	handR: Vec;
	kneeL: Vec;
	footL: Vec;
	kneeR: Vec;
	footR: Vec;
	/** The ears, for the ring in Episode 1. */
	earL: Vec;
	earR: Vec;
};

// ---------------------------------------------------------------- model

/** The fixed proportions. Changing these changes the character everywhere. */
export const MODEL = {
	headR: 58,
	headOutline: 8,
	torso: 112,
	shoulderDrop: 12,
	upperArm: 60,
	foreArm: 60,
	thigh: 80,
	shin: 82,
	limbWidth: 15,
	limbOutline: 6.5,
	eyeX: 21.5,
	eyeY: -5,
	eyeRx: 13,
	eyeRy: 16.5,
	eyeOutline: 3,
	pupilR: 6.6,
	browGap: 9,
	browLength: 23,
	browWidth: 7,
	mouthY: 29,
	mouthStroke: 5.5,
	scarfWidth: 21,
	scarfOutline: 6,
} as const;

/** The stickman: cream, with the amber scarf. */
export const HERO_LOOK: StickmanLook = {
	head: COLOURS.cream,
	limb: COLOURS.cream,
	outline: COLOURS.navy,
	scarf: COLOURS.amber,
};

/** Everyone else: same build, blue-grey head, no scarf. */
export const OTHER_LOOK: StickmanLook = {
	head: COLOURS.blueGrey,
	limb: COLOURS.cream,
	outline: COLOURS.navy,
	scarf: null,
};

// ---------------------------------------------------------------- maths

const RAD = Math.PI / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
	Math.min(hi, Math.max(lo, v));
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s];
/** Unit vector for an angle: 0 = down, 90 = right, 180 = up. */
const dir = (deg: number): Vec => [Math.sin(deg * RAD), Math.cos(deg * RAD)];
/** Unit vector pointing "up" along a body part that leans by `deg`. */
const up = (deg: number): Vec => [Math.sin(deg * RAD), -Math.cos(deg * RAD)];
const rotate = (p: Vec, deg: number): Vec => {
	const c = Math.cos(deg * RAD);
	const s = Math.sin(deg * RAD);
	return [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
};
const n = (v: number) => Math.round(v * 100) / 100;

/** A tiny path writer. Every point passes through `map` before it is written. */
const pen = (map: (p: Vec) => Vec) => {
	const out: string[] = [];
	const pt = (x: number, y: number) => {
		const [X, Y] = map([x, y]);
		return `${n(X)} ${n(Y)}`;
	};
	const api = {
		M: (x: number, y: number) => (out.push(`M${pt(x, y)}`), api),
		L: (x: number, y: number) => (out.push(`L${pt(x, y)}`), api),
		Q: (cx: number, cy: number, x: number, y: number) => (
			out.push(`Q${pt(cx, cy)} ${pt(x, y)}`), api
		),
		C: (
			ax: number,
			ay: number,
			bx: number,
			by: number,
			x: number,
			y: number,
		) => (out.push(`C${pt(ax, ay)} ${pt(bx, by)} ${pt(x, y)}`), api),
		Z: () => (out.push('Z'), api),
		circle: (cx: number, cy: number, r: number) => {
			const k = 0.5523 * r;
			return api
				.M(cx - r, cy)
				.C(cx - r, cy - k, cx - k, cy - r, cx, cy - r)
				.C(cx + k, cy - r, cx + r, cy - k, cx + r, cy)
				.C(cx + r, cy + k, cx + k, cy + r, cx, cy + r)
				.C(cx - k, cy + r, cx - r, cy + k, cx - r, cy)
				.Z();
		},
		polyline: (pts: ReadonlyArray<Vec>, close = false) => {
			pts.forEach((p, i) => (i === 0 ? api.M(p[0], p[1]) : api.L(p[0], p[1])));
			return close ? api.Z() : api;
		},
		toString: () => out.join(''),
	};
	return api;
};

// ---------------------------------------------------------------- skeleton

const isAngles = (a: ArmSpec): a is readonly [number, number] =>
	Array.isArray(a);

type Core = {hip: Vec; neck: Vec; shoulder: Vec; head: Vec; headAngle: number};

/** Torso and head before the body is dropped onto the ground. */
const core = (pose: Pose | SolvedPose): Core => {
	const hip: Vec = [0, 0];
	const neck = add(hip, scale(up(pose.lean), MODEL.torso));
	const shoulder = add(neck, scale(up(pose.lean), -MODEL.shoulderDrop));
	const headAngle = pose.lean + pose.headTilt;
	// A bowed head sinks a little towards the shoulders.
	const sink = 5 + 7 * Math.max(0, pose.nod ?? 0);
	const head = add(neck, scale(up(headAngle), MODEL.headR - sink));
	return {hip, neck, shoulder, head, headAngle};
};

const solveArm = (spec: ArmSpec, c: Core): readonly [number, number] => {
	if (isAngles(spec)) {
		return spec;
	}

	const target: Vec =
		spec.from === 'head'
			? add(c.head, rotate(scale(spec.reach, MODEL.headR), c.headAngle))
			: spec.reach;
	const dx = target[0] - c.shoulder[0];
	const dy = target[1] - c.shoulder[1];
	const l1 = MODEL.upperArm;
	const l2 = MODEL.foreArm;
	const d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01, l1 + l2 - 0.01);
	const toTarget = Math.atan2(dx, dy) / RAD;
	const inner =
		Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) / RAD;
	const upper = toTarget + (spec.bend ?? 1) * inner;
	const elbow = add(c.shoulder, scale(dir(upper), l1));
	const reachable = add(
		c.shoulder,
		scale([dx, dy], d / Math.max(Math.hypot(dx, dy), 0.01)),
	);
	const fore =
		Math.atan2(reachable[0] - elbow[0], reachable[1] - elbow[1]) / RAD;
	return [upper, fore];
};

/** Turns "reach for this point" arms into plain angles, so poses can be blended. */
export const solvePose = (pose: Pose | SolvedPose): SolvedPose => {
	const c = core(pose);
	return {
		...pose,
		armL: solveArm(pose.armL, c),
		armR: solveArm(pose.armR, c),
	};
};

/** Blends two poses. t = 0 gives `a`, t = 1 gives `b`. */
export const mixPose = (
	a: Pose | SolvedPose,
	b: Pose | SolvedPose,
	t: number,
): SolvedPose => {
	const A = solvePose(a);
	const B = solvePose(b);
	const pair = (
		p: readonly [number, number],
		q: readonly [number, number],
	): readonly [number, number] => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
	return {
		lean: lerp(A.lean, B.lean, t),
		headTilt: lerp(A.headTilt, B.headTilt, t),
		nod: lerp(A.nod ?? 0, B.nod ?? 0, t),
		armL: pair(A.armL, B.armL),
		armR: pair(A.armR, B.armR),
		legL: pair(A.legL, B.legL),
		legR: pair(A.legR, B.legR),
		lift: lerp(A.lift ?? 0, B.lift ?? 0, t),
		front: t < 0.5 ? A.front : B.front,
	};
};

/** Blends two expressions. t = 0 gives `a`, t = 1 gives `b`. */
export const mixExpression = (
	a: Expression,
	b: Expression,
	t: number,
): Expression => {
	const brow = (p: Brow, q: Brow): Brow => ({
		y: lerp(p.y, q.y, t),
		angle: lerp(p.angle, q.angle, t),
		curve: lerp(p.curve, q.curve, t),
	});
	const eye = (p: Eye, q: Eye): Eye => ({
		top: lerp(p.top, q.top, t),
		bottom: lerp(p.bottom, q.bottom, t),
		scale: lerp(p.scale, q.scale, t),
	});
	return {
		browL: brow(a.browL, b.browL),
		browR: brow(a.browR, b.browR),
		eyeL: eye(a.eyeL, b.eyeL),
		eyeR: eye(a.eyeR, b.eyeR),
		pupil: lerp(a.pupil, b.pupil, t),
		gaze: [lerp(a.gaze[0], b.gaze[0], t), lerp(a.gaze[1], b.gaze[1], t)],
		mouth: {
			w: lerp(a.mouth.w, b.mouth.w, t),
			corner: lerp(a.mouth.corner, b.mouth.corner, t),
			top: lerp(a.mouth.top, b.mouth.top, t),
			bottom: lerp(a.mouth.bottom, b.mouth.bottom, t),
			round: lerp(a.mouth.round, b.mouth.round, t),
			x: lerp(a.mouth.x, b.mouth.x, t),
			tilt: lerp(a.mouth.tilt, b.mouth.tilt, t),
		},
	};
};

/**
 * Where every joint is, with the lowest foot resting on the ground (y = 0).
 * Scenes use this to line props up with him: a chair under the hip, a hand to hold.
 */
export const getSkeleton = (
	poseIn: Pose | SolvedPose,
	flip = false,
): Skeleton => {
	const pose = solvePose(poseIn);
	const c = core(pose);
	const limb = (
		from: Vec,
		angles: readonly [number, number],
		l1: number,
		l2: number,
	): [Vec, Vec] => {
		const mid = add(from, scale(dir(angles[0]), l1));
		return [mid, add(mid, scale(dir(angles[1]), l2))];
	};
	const [elbowL, handL] = limb(
		c.shoulder,
		pose.armL,
		MODEL.upperArm,
		MODEL.foreArm,
	);
	const [elbowR, handR] = limb(
		c.shoulder,
		pose.armR,
		MODEL.upperArm,
		MODEL.foreArm,
	);
	const [kneeL, footL] = limb(c.hip, pose.legL, MODEL.thigh, MODEL.shin);
	const [kneeR, footR] = limb(c.hip, pose.legR, MODEL.thigh, MODEL.shin);

	const sole = MODEL.limbWidth / 2 + MODEL.limbOutline;
	const drop = -(Math.max(footL[1], footR[1]) + sole) - (pose.lift ?? 0);
	const place = (p: Vec): Vec => [flip ? -p[0] : p[0], p[1] + drop];
	const ear = (side: number) =>
		add(c.head, rotate([side * MODEL.headR, 0], c.headAngle));

	return {
		hip: place(c.hip),
		neck: place(c.neck),
		shoulder: place(c.shoulder),
		head: place(c.head),
		headAngle: flip ? -c.headAngle : c.headAngle,
		elbowL: place(elbowL),
		handL: place(handL),
		elbowR: place(elbowR),
		handR: place(handR),
		kneeL: place(kneeL),
		footL: place(footL),
		kneeR: place(kneeR),
		footR: place(footR),
		earL: place(ear(-1)),
		earR: place(ear(1)),
	};
};

// ---------------------------------------------------------------- drawing

const DEFAULT_SCARF: Scarf = {flow: 0, side: -1, phase: 0};

/** The centre line of one scarf tail, as points. */
const scarfTail = (
	from: Vec,
	scarf: Scarf,
	length: number,
	baseOffset: number,
	phaseOffset: number,
): Vec[] => {
	const steps = 16;
	const seg = length / steps;
	const pts: Vec[] = [from];
	let p = from;
	for (let i = 1; i <= steps; i++) {
		const u = i / steps;
		const base = lerp(16, 97, scarf.flow) + baseOffset;
		const droop = lerp(10, 34, scarf.flow) * u;
		const ripple =
			lerp(3, 17, scarf.flow) *
			Math.sin(scarf.phase + phaseOffset - i * 0.5) *
			(0.2 + 0.8 * u);
		p = add(p, scale(dir(scarf.side * (base - droop + ripple)), seg));
		pts.push(p);
	}

	return pts;
};

/** Turns a centre line into a ribbon outline that narrows towards the tip. */
const ribbon = (line: Vec[], w0: number, w1: number): Vec[] => {
	const left: Vec[] = [];
	const right: Vec[] = [];
	line.forEach((p, i) => {
		const a = line[Math.max(0, i - 1)];
		const b = line[Math.min(line.length - 1, i + 1)];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
		const nx = -(b[1] - a[1]) / len;
		const ny = (b[0] - a[0]) / len;
		const w = lerp(w0, w1, i / (line.length - 1)) / 2;
		left.push([p[0] + nx * w, p[1] + ny * w]);
		right.push([p[0] - nx * w, p[1] - ny * w]);
	});
	return [...left, ...right.reverse()];
};

/**
 * Builds the character as a list of flat shapes, back to front.
 * Draw them in order and you have the stickman.
 */
export const buildStickman = (options: StickmanOptions): Shape[] => {
	const {expression: ex, flip = false, turn = 0, blink = 0} = options;
	const look = options.look ?? HERO_LOOK;
	const scarf: Scarf = {...DEFAULT_SCARF, ...options.scarf};
	const pose = solvePose(options.pose);
	// Work unflipped, then mirror every point at the very end.
	const sk = getSkeleton(pose, false);
	const mirror = (p: Vec): Vec => (flip ? [-p[0], p[1]] : p);
	const world = () => pen(mirror);
	const shapes: Shape[] = [];

	const limbStroke = MODEL.limbWidth;
	const limbOutline = MODEL.limbWidth + MODEL.limbOutline * 2;
	const inFront = new Set(pose.front ?? []);

	const limbs: Array<{id: string; d: string}> = [
		{id: 'torso', d: world().polyline([sk.hip, sk.neck]).toString()},
		{
			id: 'legL',
			d: world().polyline([sk.hip, sk.kneeL, sk.footL]).toString(),
		},
		{
			id: 'legR',
			d: world().polyline([sk.hip, sk.kneeR, sk.footR]).toString(),
		},
		{
			id: 'armL',
			d: world().polyline([sk.shoulder, sk.elbowL, sk.handL]).toString(),
		},
		{
			id: 'armR',
			d: world().polyline([sk.shoulder, sk.elbowR, sk.handR]).toString(),
		},
	];
	const outlineOf = (d: string): Shape => ({
		d,
		stroke: look.outline,
		strokeWidth: limbOutline,
	});
	const fillOf = (d: string): Shape => ({
		d,
		stroke: look.limb,
		strokeWidth: limbStroke,
	});

	// 1. Body. All the outlines first, then all the cream, so the limbs join
	//    into one clean shape instead of cutting across each other.
	const body = limbs.filter((l) => !inFront.has(l.id as 'armL' | 'armR'));
	body.forEach((l) => shapes.push(outlineOf(l.d)));
	body.forEach((l) => shapes.push(fillOf(l.d)));

	// 2. Head. Everything on the face is drawn in "head space" (0,0 = centre of
	//    the head) and then tilted and moved into place.
	const headSpace = () =>
		pen((p) => mirror(add(sk.head, rotate(p, sk.headAngle))));
	const R = MODEL.headR;

	shapes.push({
		d: headSpace().circle(0, 0, R).toString(),
		fill: look.head,
		stroke: look.outline,
		strokeWidth: MODEL.headOutline,
	});
	// A soft shade along the lower edge of the head, opposite the light. It is
	// the only shading on him, and it stops him looking like a paper cut-out.
	shapes.push({
		d: headSpace()
			.M(-R * 0.94, R * 0.2)
			.C(-R * 0.72, R * 1.0, R * 0.5, R * 1.12, R * 0.9, R * 0.3)
			.C(R * 0.52, R * 0.86, -R * 0.52, R * 0.84, -R * 0.94, R * 0.2)
			.Z()
			.toString(),
		fill: look.outline,
		opacity: 0.1,
		clip: headSpace()
			.circle(0, 0, R - MODEL.headOutline / 2)
			.toString(),
	});

	const faceX = turn * R * 0.15;
	const showFace = !options.back;
	const faceY = (pose.nod ?? 0) * R * 0.2;
	const eyes = [
		{side: -1, eye: ex.eyeL, brow: ex.browL},
		{side: 1, eye: ex.eyeR, brow: ex.browR},
	];
	for (const {side, eye, brow} of showFace ? eyes : []) {
		// The eye further from the camera narrows a touch when the face turns.
		const far = side * turn < 0 ? 1 - 0.16 * Math.abs(turn) : 1;
		const rx = MODEL.eyeRx * eye.scale * far;
		const ry = MODEL.eyeRy * eye.scale;
		const cx = faceX + side * MODEL.eyeX * (1 - 0.08 * Math.abs(turn));
		const cy = MODEL.eyeY + faceY;
		const top = clamp(eye.top * (1 - blink), 0.03, 1);
		const bottom = clamp(eye.bottom * (1 - blink), 0.03, 1);
		const k = 4 / 3;
		const eyePath = () =>
			headSpace()
				.M(cx - rx, cy)
				.C(cx - rx, cy - ry * top * k, cx + rx, cy - ry * top * k, cx + rx, cy)
				.C(
					cx + rx,
					cy + ry * bottom * k,
					cx - rx,
					cy + ry * bottom * k,
					cx - rx,
					cy,
				)
				.Z()
				.toString();

		shapes.push({d: eyePath(), fill: COLOURS.white});
		const pr = MODEL.pupilR * ex.pupil * eye.scale;
		// At rest the pupils sit a touch towards the nose, which reads as focus
		// instead of a blank stare.
		const px = cx - side * 1.4 * far + ex.gaze[0] * Math.max(0, rx - pr * 0.8);
		const py =
			cy +
			(ry * (bottom - top)) / 2 +
			ex.gaze[1] * Math.max(0, (ry * (top + bottom)) / 2 - pr * 0.8);
		shapes.push({
			d: headSpace().circle(px, py, pr).toString(),
			fill: look.outline,
			clip: eyePath(),
		});
		// A small catch-light, so the eyes look alive.
		shapes.push({
			d: headSpace()
				.circle(px - pr * 0.36, py - pr * 0.38, pr * 0.27)
				.toString(),
			fill: COLOURS.white,
			clip: eyePath(),
		});
		shapes.push({
			d: eyePath(),
			stroke: look.outline,
			strokeWidth: MODEL.eyeOutline,
		});

		// Brow: a short thick stroke above the eye.
		const by = cy - MODEL.eyeRy - MODEL.browGap - brow.y;
		const half = (MODEL.browLength / 2) * far;
		const tilt = side * brow.angle;
		const b = (x: number, y: number): Vec =>
			add([cx, by], rotate([x, y], tilt));
		const [b0, b1, b2] = [b(-half, 0), b(0, -brow.curve * 2), b(half, 0)];
		shapes.push({
			d: headSpace()
				.M(b0[0], b0[1])
				.Q(b1[0], b1[1], b2[0], b2[1])
				.toString(),
			stroke: look.outline,
			strokeWidth: MODEL.browWidth,
		});
	}

	// Mouth: one closed shape. When top and bottom meet it collapses into a line.
	if (showFace) {
		const m = ex.mouth;
		const mc: Vec = [faceX + m.x, MODEL.mouthY + faceY * 0.8];
		const q = (x: number, y: number): Vec => add(mc, rotate([x, y], m.tilt));
		const kx = m.w * lerp(0.45, 1, m.round);
		const ctrl = (mid: number) => (mid - 0.25 * m.corner) / 0.75;
		const [l, r] = [q(-m.w, m.corner), q(m.w, m.corner)];
		const [t0, t1] = [q(-kx, ctrl(m.top)), q(kx, ctrl(m.top))];
		const [u0, u1] = [q(kx, ctrl(m.bottom)), q(-kx, ctrl(m.bottom))];
		shapes.push({
			d: headSpace()
				.M(l[0], l[1])
				.C(t0[0], t0[1], t1[0], t1[1], r[0], r[1])
				.C(u0[0], u0[1], u1[0], u1[1], l[0], l[1])
				.Z()
				.toString(),
			fill: look.outline,
			stroke: look.outline,
			strokeWidth: MODEL.mouthStroke,
		});
	}

	// 3. Scarf: two tails, then the band round the neck, then the knot.
	if (look.scarf) {
		const bandR = R + 7;
		const arc = (deg: number): Vec => scale(dir(deg), bandR);
		const span = 37;
		const band: Vec[] = [];
		for (let a = -span; a <= span; a += 3.7) {
			band.push(arc(a));
		}

		const knot = arc(scarf.side * (span - 9));
		const knotWorld = add(sk.head, rotate(knot, sk.headAngle));
		const outline = MODEL.scarfOutline;

		const tails = [
			{length: 86, w0: 17, w1: 13, base: -16, phase: 1.4},
			{length: 112, w0: 19, w1: 14, base: 0, phase: 0},
		];
		for (const t of tails) {
			const line = scarfTail(knotWorld, scarf, t.length, t.base, t.phase);
			const d = world().polyline(ribbon(line, t.w0, t.w1), true).toString();
			shapes.push({
				d,
				fill: look.scarf,
				stroke: look.outline,
				strokeWidth: outline,
			});
		}

		const bandPath = headSpace().polyline(band).toString();
		shapes.push({
			d: bandPath,
			stroke: look.outline,
			strokeWidth: MODEL.scarfWidth + outline,
		});
		shapes.push({
			d: bandPath,
			stroke: look.scarf,
			strokeWidth: MODEL.scarfWidth - outline,
		});
		shapes.push({
			d: headSpace().circle(knot[0], knot[1], 10.5).toString(),
			fill: look.scarf,
			stroke: look.outline,
			strokeWidth: outline / 2 + 1.5,
		});
	}

	// 4. Any arm that has to pass in front of the head (hand to ear).
	limbs
		.filter((l) => inFront.has(l.id as 'armL' | 'armR'))
		.forEach((l) => shapes.push(outlineOf(l.d), fillOf(l.d)));

	return shapes;
};

/**
 * Scarf settings for a character moving at `speed` (units per second, positive
 * = moving to screen right). The tails stream out behind him and ripple.
 */
export const scarfForMotion = (speed: number, seconds: number): Scarf => ({
	flow: clamp(Math.abs(speed) / 260, 0, 1),
	side: speed > 0 ? -1 : 1,
	phase: seconds * lerp(2.2, 9, clamp(Math.abs(speed) / 260, 0, 1)),
});
