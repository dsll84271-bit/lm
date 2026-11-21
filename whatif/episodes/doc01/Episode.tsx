/**
 * Documentary 1: Why GTA 6 Is Set in Florida (The Real State Behind Leonida).
 * Narration: CapCut "FM Radio", cleaned and paced by tools/doc_vo.py.
 * One shot per paragraph of narration.txt, timed from public/doc01/vo/timings.json.
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {Grain} from '../../docs-kit/kit';
import {FPS, shotEnd, shotStart, span, TOTAL} from './timeline';
import type {ShotProps} from './timeline';
import * as A from './shotsA';
import * as B from './shotsB';
import * as Cc from './shotsC';

export const DOC01_FRAMES = TOTAL;

const all = {...A, ...B, ...Cc} as Record<string, React.FC<ShotProps>>;

// music beds by paragraph range [from, to]
const BEDS: [number, number, string, number][] = [
	[1, 9, 'curious', 0.16],
	[10, 11, 'deco', 0.15],
	[12, 15, 'storm', 0.2],
	[16, 21, 'deco', 0.14],
	[22, 27, 'curious', 0.15],
	[28, 31, 'deco', 0.14],
	[32, 38, 'synth', 0.15],
	[39, 41, 'curious', 0.15],
	[42, 45, 'ominous', 0.2],
	[46, 48, 'curious', 0.17],
];

const Bed: React.FC<{src: string; vol: number; d: number}> = ({src, vol, d}) => (
	<Audio
		src={staticFile(`doc01/music/${src}.wav`)}
		loop
		volume={(f) => vol * interpolate(f, [0, 30, d - 30, d], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
	/>
);

export const Doc01: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		{Array.from({length: 48}).map((_, i) => {
			const n = i + 1;
			const C = all[`S${String(n).padStart(2, '0')}`];
			const {startF, d, cue} = span(n);
			return (
				<Sequence key={n} from={startF} durationInFrames={d} name={`p${n}`}>
					{C ? <C d={d} cue={cue} /> : <AbsoluteFill style={{background: '#333', color: '#fff', fontSize: 60}}>p{n}</AbsoluteFill>}
				</Sequence>
			);
		})}
		<Grain opacity={0.12} />
		<Audio src={staticFile('doc01/vo/vo.wav')} />
		{BEDS.map(([a, b, src, vol]) => {
			const s = Math.max(0, Math.round(shotStart(a) * FPS) - 15);
			const e = Math.min(TOTAL, Math.round(shotEnd(b) * FPS) + 15);
			return (
				<Sequence key={`${a}`} from={s} durationInFrames={e - s} name={`music ${src}`}>
					<Bed src={src} vol={vol} d={e - s} />
				</Sequence>
			);
		})}
	</AbsoluteFill>
);
