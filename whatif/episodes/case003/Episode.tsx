/**
 * Fiction Files · Case File 003: Would Dexter's Forensics Survive a Real Courtroom?
 * Narration: the Detective (docs/voice/detective_ref.wav), paced by tools/doc_vo.py.
 * One shot per paragraph of docs/case003-dexter-courtroom/narration.txt. The series
 * pieces (slate, ident, brief, Exhibits, board, Reality Score, CASE CLOSED) come from
 * docs-kit/series.tsx; this case's world is in ./parts.tsx.
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

export const CASE003_FRAMES = TOTAL;
const all = {...A, ...B, ...Cc} as Record<string, React.FC<ShotProps>>;
const N = 52;

// score (tools/case003_music.py) by paragraph range; the offset leaves a beat of silence on each Exhibit card
const BEDS: [number, number, string, number, number][] = [
	[1, 4, 'hook', 0.16, 0],
	[6, 9, 'fiction', 0.12, 0],
	[10, 16, 'gate', 0.15, 24],
	[17, 25, 'science', 0.13, 24],
	[26, 34, 'insider', 0.16, 24],
	[35, 47, 'clock', 0.13, 30],
	[48, 51, 'verdict', 0.15, 0],
];

const Bed: React.FC<{src: string; vol: number; d: number}> = ({src, vol, d}) => (
	<Audio
		src={staticFile(`case003/music/${src}.wav`)}
		loop
		volume={(f) => vol * interpolate(f, [0, 24, d - 30, d], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
	/>
);

export const Case003: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		{Array.from({length: N}, (_, i) => i + 1).map((a) => {
			const C = all[`S${String(a).padStart(2, '0')}`];
			const {startF, d, cue} = span(a, a);
			return (
				<Sequence key={a} from={startF} durationInFrames={d} name={`p${a}`}>
					{C ? <C d={d} cue={cue} /> : <AbsoluteFill style={{background: '#333', color: '#fff', fontSize: 60}}>p{a}</AbsoluteFill>}
				</Sequence>
			);
		})}
		<Grain opacity={0.08} />
		<Audio src={staticFile('case003/vo/vo.wav')} />
		{BEDS.map(([a, b, src, vol, off]) => {
			const s = Math.max(0, Math.round(shotStart(a) * FPS) - 15 + off);
			const e = Math.min(TOTAL, Math.round(shotEnd(b) * FPS) + 15);
			return (
				<Sequence key={a} from={s} durationInFrames={e - s} name={`music ${src}`}>
					<Bed src={src} vol={vol} d={e - s} />
				</Sequence>
			);
		})}
	</AbsoluteFill>
);
