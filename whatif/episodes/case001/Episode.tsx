/**
 * Fiction Files · Case File 001: Sunrise on the Reaping Is Based on Something Real.
 * Narration: the Detective (Qwen3-TTS, cloned from docs/voice/detective_ref.wav), paced by tools/doc_vo.py.
 * One shot per paragraph of docs/case001-the-reaping/narration.txt (44–45 share the verdict).
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {Grain} from '../../docs-kit/kit';
import '../../docs-kit/vox';
import {FPS, shotEnd, shotStart, span, TOTAL} from './timeline';
import type {ShotProps} from './timeline';
import * as A from './shotsA';
import * as B from './shotsB';
import * as Cc from './shotsC';

export const CASE001_FRAMES = TOTAL;
const all = {...A, ...B, ...Cc} as Record<string, React.FC<ShotProps>>;

// [first paragraph, last paragraph] of every shot
const SHOTS: [number, number][] = [...Array.from({length: 43}, (_, i) => [i + 1, i + 1] as [number, number]), [44, 45]];

// score (tools/case001_music.py) by paragraph range
const BEDS: [number, number, string, number][] = [
	[1, 4, 'reaping', 0.17],
	[5, 11, 'panem', 0.15],
	[12, 21, 'archive', 0.15],
	[22, 26, 'rigged', 0.15],
	[27, 31, 'father', 0.16],
	[32, 40, 'hume', 0.15],
	[41, 44, 'verdict', 0.15],
];

const Bed: React.FC<{src: string; vol: number; d: number}> = ({src, vol, d}) => (
	<Audio
		src={staticFile(`case001/music/${src}.wav`)}
		loop
		volume={(f) => vol * interpolate(f, [0, 30, d - 30, d], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
	/>
);

export const Case001: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		{SHOTS.map(([a, b]) => {
			const C = all[`S${String(a).padStart(2, '0')}`];
			const {startF, d, cue} = span(a, b);
			return (
				<Sequence key={a} from={startF} durationInFrames={d} name={`p${a}${b > a ? `-${b}` : ''}`}>
					{C ? <C d={d} cue={cue} /> : <AbsoluteFill style={{background: '#333', color: '#fff', fontSize: 60}}>p{a}</AbsoluteFill>}
				</Sequence>
			);
		})}
		<Grain opacity={0.1} />
		<Audio src={staticFile('case001/vo/vo.wav')} />
		{BEDS.map(([a, b, src, vol]) => {
			const s = Math.max(0, Math.round(shotStart(a) * FPS) - 15);
			const e = Math.min(TOTAL, Math.round(shotEnd(b) * FPS) + 15);
			return (
				<Sequence key={a} from={s} durationInFrames={e - s} name={`music ${src}`}>
					<Bed src={src} vol={vol} d={e - s} />
				</Sequence>
			);
		})}
	</AbsoluteFill>
);
