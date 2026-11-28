/**
 * Fiction Files · Case File 002: The Real Ebenezer Scrooge Was Even Worse.
 * Narration: the Detective (docs/voice/detective_ref.wav), paced by tools/doc_vo.py.
 * One shot per paragraph of docs/case002-real-scrooge/narration.txt (46–47 share the verdict).
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

export const CASE002_FRAMES = TOTAL;
const all = {...A, ...B, ...Cc} as Record<string, React.FC<ShotProps>>;
const SHOTS: [number, number][] = [...Array.from({length: 45}, (_, i) => [i + 1, i + 1] as [number, number]), [46, 47]];

// score (tools/case002_music.py) by paragraph range
const BEDS: [number, number, string, number][] = [
	[1, 5, 'humbug', 0.17],
	[6, 9, 'ledger', 0.14],
	[10, 17, 'miser', 0.16],
	[18, 22, 'darkest', 0.18],
	[23, 27, 'suspects', 0.14],
	[28, 30, 'grave', 0.17],
	[31, 38, 'sledgehammer', 0.15],
	[39, 42, 'castaway', 0.16],
	[43, 46, 'verdict', 0.15],
];

const Bed: React.FC<{src: string; vol: number; d: number}> = ({src, vol, d}) => (
	<Audio
		src={staticFile(`case002/music/${src}.wav`)}
		loop
		volume={(f) => vol * interpolate(f, [0, 30, d - 30, d], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
	/>
);

export const Case002: React.FC = () => (
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
		<Audio src={staticFile('case002/vo/vo.wav')} />
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
