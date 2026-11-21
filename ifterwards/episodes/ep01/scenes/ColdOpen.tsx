import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {EXPRESSIONS} from '../../../characters/stickman/expressions';
import {
	getSkeleton,
	HERO_LOOK,
	mixExpression,
	mixPose,
	OTHER_LOOK,
	solvePose,
	type Expression,
	type Pose,
	type SolvedPose,
} from '../../../characters/stickman/rig';
import {StickmanCard, UNIT} from '../../../characters/stickman/StickmanCard';
import {DepthLayers, Layer, type CameraPose} from '../../../components/DepthLayers';
import {RingPulse} from '../../../components/RingPulse';
import ring from '../../../sfx/ring.wav';
import {KITCHEN, KitchenLights, KitchenSet} from './kitchen/KitchenSet';

// Episode 1, cold open: the kitchen. A 20-second test of the first scene.
// Times below are in frames (30 a second) until the voiceover exists; after
// that they will be read from the voiceover file.

export const COLD_OPEN_FRAMES = 600;

const RING_1 = 135; // 4.5 s  "And something rings in your left ear."
const RING_2 = 430; // 14.3 s "It rings again."

// The poses are drawn facing screen right, then the whole character is
// mirrored, so he sits on the right of the table facing left, towards Mum.
const LEGS = {legL: [90, 7], legR: [80, -5]} as const;
// Both forearms rest on the table.
const SIT: Pose = {lean: 5, headTilt: -3, armL: [44, 108], armR: [58, 104], ...LEGS};
const SIT_ASK: Pose = {lean: 12, headTilt: -5, armL: [50, 112], armR: [64, 108], ...LEGS};
const SIT_EAR_REACH: Pose = {
	lean: 1,
	headTilt: -7,
	// His left ear: the side of his head nearest the camera once he is mirrored.
	armL: {reach: [-1.07, 0.1], from: 'head', bend: 1},
	armR: [56, 102],
	...LEGS,
	front: ['armL'],
};
// Work the reach out as angles, then write the forearm's angle the long way
// round (up and over, not down and under). That decides the path his hand
// takes between the table and his ear: across his front, not behind his back.
const earAngles = solvePose(SIT_EAR_REACH);
const SIT_EAR: SolvedPose = {
	...earAngles,
	armL: [earAngles.armL[0], earAngles.armL[1] + 360],
};
const SIT_LOW: Pose = {lean: 8, headTilt: 3, nod: 0.55, armL: [42, 104], armR: [56, 100], ...LEGS};

const MUM: Pose = {
	lean: 0,
	headTilt: 0,
	// Elbows a little out, hands in the sink in front of her.
	armL: [-36, 20],
	armR: [36, -20],
	legL: [-7, -7],
	legR: [7, 7],
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

/** Runs a value through a list of [frame, amount] keys. */
const track = (frame: number, keys: Array<[number, number]>) =>
	interpolate(
		frame,
		keys.map((k) => k[0]),
		keys.map((k) => k[1]),
		{...clamp, easing: ease},
	);

const blinkAt = (frame: number, at: number[]) =>
	Math.max(
		0,
		...at.map((b) => interpolate(frame, [b - 2, b, b + 3], [0, 1, 0], clamp)),
	);

export const ColdOpen: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const seconds = frame / fps;

	// ---------------------------------------------------------- the stickman
	// How far he is into each pose, 0 to 1.
	const snap = (at: number) =>
		spring({frame: frame - at, fps, config: {damping: 13, stiffness: 190, mass: 0.6}});
	const toEar =
		frame < RING_2
			? snap(RING_1) * (1 - track(frame, [[205, 0], [250, 1]]))
			: snap(RING_2) * (1 - track(frame, [[515, 0], [565, 1]]));
	const asking = track(frame, [[278, 0], [300, 1], [345, 1], [378, 0]]);
	const sinking = track(frame, [[520, 0], [585, 1]]);
	const breathe = Math.sin(seconds * 1.7) * 0.7;

	let pose: SolvedPose = mixPose(SIT, SIT_ASK, asking);
	pose = mixPose(pose, SIT_LOW, sinking);
	pose = mixPose(pose, SIT_EAR, toEar);
	pose = {...pose, lean: pose.lean + breathe, headTilt: pose.headTilt - breathe * 0.5};

	const shocked =
		track(frame, [[RING_1, 0], [RING_1 + 4, 1], [182, 1], [212, 0]]) +
		track(frame, [[RING_2, 0], [RING_2 + 4, 1], [472, 1], [515, 0]]);
	const suspicious = track(frame, [[185, 0], [215, 1], [RING_2 - 2, 1], [RING_2 + 3, 0]]);
	const crushed = track(frame, [[478, 0], [540, 1]]);
	let expression: Expression = EXPRESSIONS.neutral;
	expression = mixExpression(expression, EXPRESSIONS.suspicious, suspicious * (1 - 0.45 * asking));
	expression = mixExpression(expression, EXPRESSIONS.crushed, crushed);
	expression = mixExpression(expression, EXPRESSIONS.shocked, Math.min(1, shocked));
	// "You ask your mum..." and "You ask again": his mouth moves, with no voice.
	const talking =
		track(frame, [[26, 0], [30, 1], [62, 1], [66, 0]]) +
		track(frame, [[300, 0], [304, 1], [338, 1], [342, 0]]);
	const jaw = talking * (0.5 + 0.5 * Math.sin(frame * 1.25)) * 7;
	// His eyes stay on Mum, apart from the moment each ring hits.
	const watching = 1 - Math.min(1, shocked);
	expression = {
		...expression,
		gaze: [
			expression.gaze[0] * (1 - watching) + 0.8 * watching,
			expression.gaze[1] * (1 - watching * 0.6) - 0.1 * watching,
		],
		mouth: {
			...expression.mouth,
			top: expression.mouth.top - jaw * 0.25,
			bottom: expression.mouth.bottom + jaw,
			round: Math.max(expression.mouth.round, talking * 0.5),
		},
	};

	const jolt = Math.max(
		interpolate(frame, [RING_1, RING_1 + 5, RING_1 + 40], [0, 1, 0], clamp),
		interpolate(frame, [RING_2, RING_2 + 5, RING_2 + 40], [0, 1, 0], clamp),
	);

	// Where his ear is in the room, for the ring.
	const ear = getSkeleton(pose, true).earL;
	const earWorld: [number, number, number] = [
		KITCHEN.stickman[0] + ear[0] * UNIT,
		-ear[1] * UNIT,
		KITCHEN.stickman[2] + 0.03,
	];

	// ------------------------------------------------------------------ Mum
	// She is washing up, and stops for a moment each time she answers.
	const answering =
		track(frame, [[88, 0], [98, 1], [124, 1], [136, 0]]) +
		track(frame, [[352, 0], [362, 1], [412, 1], [426, 0]]);
	const scrub = Math.sin(frame * 0.42) * 7 * (1 - answering);
	const mumPose: Pose = {
		...MUM,
		lean: Math.sin(seconds * 1.1) * 0.8,
		headTilt: answering * 7 + Math.sin(frame * 0.21) * 1.2 * (1 - answering),
		armL: [-36 - scrub * 0.4, 20 + scrub],
		armR: [36 - scrub * 0.4, -20 + scrub],
	};

	// --------------------------------------------------------------- camera
	// One slow push-in from the doorway to his face, with a nudge on each ring.
	const push = interpolate(frame, [0, COLD_OPEN_FRAMES], [0, 1], {
		...clamp,
		easing: Easing.inOut(Easing.quad),
	});
	const nudge = track(frame, [[RING_1, 0], [RING_1 + 14, 1]]) * 0.03 +
		track(frame, [[RING_2, 0], [RING_2 + 14, 1]]) * 0.04;
	const p = Math.min(1, push + nudge);
	const mix = (a: number, b: number) => a + (b - a) * p;
	const camera: CameraPose = {
		position: [mix(-0.35, 0.66), mix(1.52, 1.26), mix(5.6, 2.3)],
		target: [mix(0.1, 1.14), mix(1.02, 1.1), mix(-1.3, -0.15)],
		fov: 32,
	};

	const flash = Math.max(
		interpolate(frame, [RING_1, RING_1 + 2, RING_1 + 16], [0, 1, 0], clamp),
		interpolate(frame, [RING_2, RING_2 + 2, RING_2 + 16], [0, 1, 0], clamp),
	);

	return (
		<AbsoluteFill>
			<DepthLayers camera={camera} backgroundBlur={3} foregroundBlur={7} exposure={1.05}>
				<KitchenLights />
				<KitchenSet />
				<Layer name="mid">
					<StickmanCard
						position={KITCHEN.mum}
						scale={0.97}
						options={{pose: mumPose, expression: EXPRESSIONS.neutral, look: OTHER_LOOK, back: true}}
					/>
					<StickmanCard
						position={KITCHEN.stickman}
						options={{
							pose,
							expression,
							look: HERO_LOOK,
							flip: true,
							turn: 0.85,
							blink: blinkAt(frame, [48, 116, 244, 392, 556]),
							scarf: {side: -1, flow: 0.04 + jolt * 0.3, phase: seconds * 2.4 + jolt * 3},
						}}
					/>
					<RingPulse position={earWorld} age={(frame - RING_1) / fps} strength={frame < RING_2 ? 1 : 0} />
					<RingPulse position={earWorld} age={(frame - RING_2) / fps} strength={1.35} />
				</Layer>
			</DepthLayers>

			{/* A soft vignette, and a breath of red on each ring. */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 75% 75% at 50% 48%, rgba(11,20,55,0) 55%, rgba(11,20,55,0.5) 100%)',
				}}
			/>
			<AbsoluteFill style={{backgroundColor: '#FF4D3D', opacity: flash * 0.07}} />

			<Sequence from={RING_1} layout="none">
				<Audio src={ring} volume={0.7} />
			</Sequence>
			<Sequence from={RING_2} layout="none">
				<Audio src={ring} volume={0.95} />
			</Sequence>
		</AbsoluteFill>
	);
};
