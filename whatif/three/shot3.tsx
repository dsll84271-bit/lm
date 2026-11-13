import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {cutsFor, Finish, whichCut, type Line} from '../components/stage';
import {FONT} from '../brand/fonts';
import {project, Stage3D, type Cam3, type Light3} from './Stage3D';

// A 3D shot: a set, people, a camera that cuts on every sentence and drifts
// slowly during each cut, and 2D overlays (thoughts, labels) on top.

/** A framing: look at `at` from `dist` away, turned `yaw` degrees and tilted `pitch` degrees, drifting by `dyaw`/`ddist` over the cut. */
export type Angle3 = {at: [number, number, number]; dist: number; yaw?: number; pitch?: number; fov?: number; roll?: number; dyaw?: number; ddist?: number; dy?: number};

export const camOf = (a: Angle3, p: number): Cam3 => {
	const e = Easing.inOut(Easing.quad)(p);
	const yaw = (((a.yaw ?? 0) + (a.dyaw ?? 4) * e) * Math.PI) / 180;
	const pitch = ((a.pitch ?? 8) * Math.PI) / 180;
	const d = a.dist + (a.ddist ?? -a.dist * 0.06) * e;
	const at: [number, number, number] = [a.at[0], a.at[1] + (a.dy ?? 0) * e, a.at[2]];
	return {
		pos: [at[0] + Math.sin(yaw) * Math.cos(pitch) * d, at[1] + Math.sin(pitch) * d, at[2] + Math.cos(yaw) * Math.cos(pitch) * d],
		at,
		fov: a.fov ?? 34,
		roll: a.roll,
	};
};

/** Common framings around a person standing at (x, z), height h. */
export const W = (x: number, z: number, dist = 9, yaw = 0, pitch = 10): Angle3 => ({at: [x, 1.1, z], dist, yaw, pitch});
export const M = (x: number, z: number, yaw = 0, h = 1.7): Angle3 => ({at: [x, h * 0.62, z], dist: 3.6 * (h / 1.7), yaw, pitch: 6});
export const C = (x: number, z: number, yaw = 0, h = 1.7, roll = 0): Angle3 => ({at: [x, h * 0.77, z], dist: 2.6 * (h / 1.7), yaw, pitch: 4, roll, fov: 30});
export const L = (x: number, z: number, yaw = 0): Angle3 => ({at: [x, 1.2, z], dist: 3.2, yaw, pitch: -14, fov: 38});

export const Shot3: React.FC<{
	frame: number;
	dur: number;
	lines: Line[];
	angles: Angle3[];
	light: Light3;
	bg: string;
	far: React.ReactNode;
	near: React.ReactNode;
	overlay?: (cam: Cam3) => React.ReactNode;
	cuts?: number[];
	blur?: number;
	grade?: string;
}> = ({frame, dur, lines, angles, light, bg, far, near, overlay, cuts, blur = 2.5, grade}) => {
	const c = cuts ?? cutsFor(lines, dur);
	const {i, p} = whichCut(frame, c, dur);
	const cam = camOf(angles[i % angles.length], p);
	return (
		<AbsoluteFill style={{background: bg}}>
			<AbsoluteFill style={{filter: grade}}>
				<Stage3D cam={cam} light={light} bg={bg} far={far} near={near} blur={blur} />
			</AbsoluteFill>
			{overlay ? overlay(cam) : null}
			<Finish />
		</AbsoluteFill>
	);
};

/** A thought bubble (cloud) above a head at world point `head`, holding `text`. */
export const Thought: React.FC<{cam: Cam3; head: [number, number, number]; text: string; frame: number; at: number; until?: number; size?: number; shout?: boolean; icon?: boolean}> = ({
	cam,
	head,
	text,
	frame,
	at,
	until,
	size: sizeIn = 34,
	shout = false,
}) => {
	const size = Math.round(Math.max(sizeIn, 28) * 1.3);
	if (frame < at || (until !== undefined && frame > until + 6)) {
		return null;
	}
	const [hx, hy] = project(cam, head);
	if (hx < -400 || hx > 2320 || hy < -400 || hy > 1500) {
		return null;
	}
	const t = Math.min(1, (frame - at) / 7);
	const out = until === undefined ? 0 : Math.min(1, Math.max(0, (frame - until) / 6));
	const k = (0.3 + 0.7 * t) * (1 - out);
	const one = text.length * size * 0.52;
	const w = Math.min(880, one + size * 1.6);
	const h = size * (one > 880 ? 2.8 : 1.9);
	const bx = Math.max(w / 2 + 20, Math.min(1920 - w / 2 - 20, hx + 40));
	const by = Math.max(165 + h / 2, hy - 150 - h / 2);
	const puffs = [];
	const n = Math.max(6, Math.round(w / 70));
	for (let j = 0; j < n; j++) {
		const a = (j / n) * Math.PI * 2;
		puffs.push(<ellipse key={j} cx={bx + Math.cos(a) * w * 0.47} cy={by + Math.sin(a) * h * 0.42} rx={h * 0.42} ry={h * 0.38} fill="#fff" stroke="#140A28" strokeWidth={5} />);
	}
	return (
		<AbsoluteFill style={{opacity: k, pointerEvents: 'none'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
				<g transform={`translate(${bx} ${by}) scale(${0.85 + 0.15 * k}) translate(${-bx} ${-by})`}>
					{[0.25, 0.5].map((f, j) => (
						<circle key={j} cx={hx + (bx - hx) * f * 0.6} cy={hy - 30 + (by + h * 0.5 - hy) * f} r={10 + j * 8} fill="#fff" stroke="#140A28" strokeWidth={4} />
					))}
					{puffs}
					<ellipse cx={bx} cy={by} rx={w * 0.5} ry={h * 0.48} fill="#fff" />
				</g>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: bx,
					top: by,
					width: w * 0.92,
					transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * k})`,
					textAlign: 'center',
					fontFamily: FONT,
					fontWeight: 700,
					fontSize: size,
					lineHeight: 1.1,
					color: shout ? '#E8333F' : '#140A28',
					fontStyle: 'italic',
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

/** A speech bubble (pointed tail) above a head. */
export const Says: React.FC<{cam: Cam3; head: [number, number, number]; text: string; frame: number; at: number; until?: number; size?: number}> = ({cam, head, text, frame, at, until, size: sizeIn = 36}) => {
	const size = Math.round(sizeIn * 1.3);
	if (frame < at || (until !== undefined && frame > until + 6)) {
		return null;
	}
	const [hx, hy] = project(cam, head);
	const t = Math.min(1, (frame - at) / 6);
	const out = until === undefined ? 0 : Math.min(1, Math.max(0, (frame - until) / 6));
	const k = t * (1 - out);
	const w = text.length * size * 0.55 + size * 1.4;
	const h = size * 1.7;
	const bx = Math.max(w / 2 + 20, Math.min(1920 - w / 2 - 20, hx - 60));
	const by = Math.max(165 + h / 2, hy - 110 - h / 2);
	return (
		<AbsoluteFill style={{opacity: k}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute'}}>
				<path d={`M${bx - 20} ${by + h / 2 - 4} L${hx} ${hy - 30} L${bx + 24} ${by + h / 2 - 4} Z`} fill="#fff" stroke="#140A28" strokeWidth={5} strokeLinejoin="round" />
				<rect x={bx - w / 2} y={by - h / 2} width={w} height={h} rx={h / 2} fill="#fff" stroke="#140A28" strokeWidth={5} />
				<path d={`M${bx - 16} ${by + h / 2 - 5} L${bx + 20} ${by + h / 2 - 5}`} stroke="#fff" strokeWidth={8} />
				<text x={bx} y={by + size * 0.36} fontFamily={FONT} fontWeight={700} fontSize={size} fill="#140A28" textAnchor="middle">
					{text}
				</text>
			</svg>
		</AbsoluteFill>
	);
};
