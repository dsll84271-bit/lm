import React from 'react';
import {AbsoluteFill, Audio, Loop, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../../brand/fonts';
import type {ShotProps} from '../../components/stage';
import {SCENES} from './scenes';
import {SHOTS, TOTAL} from './timeline';

export const EP01_FRAMES = TOTAL;

const Missing: React.FC<{id: string}> = ({id}) => (
	<AbsoluteFill style={{background: '#1A1240', color: '#fff', fontFamily: FONT, fontSize: 80, alignItems: 'center', justifyContent: 'center'}}>{id}</AbsoluteFill>
);

const Run: React.FC<{Scene: React.FC<ShotProps>; dur: number; lines: ShotProps['lines']}> = ({Scene, dur, lines}) => {
	const frame = useCurrentFrame();
	return <Scene frame={frame} dur={dur} lines={lines} />;
};

const LOOP = Math.round(19.2 * 30);
const at = (id: string) => SHOTS.find((s) => s.id === id)!;
const end = (id: string) => at(id).from + at(id).dur;

/** Music: the main bed, silence for the blackout, the tense bed for the rescue, silence for the twist. */
const BEDS: Array<{from: number; to: number; src: string; volume: number}> = [
	{from: 0, to: at('black').from, src: 'music/main.wav', volume: 0.16},
	{from: at('gasp').from + 60, to: at('street').from, src: 'music/main.wav', volume: 0.16},
	{from: at('street').from, to: end('miss'), src: 'music/tense.wav', volume: 0.2},
	{from: at('outro').from, to: TOTAL, src: 'music/main.wav', volume: 0.16},
];

export const Episode01: React.FC = () => (
	<AbsoluteFill style={{background: '#05030C'}}>
		{SHOTS.map((s) => {
			const Scene = SCENES[s.id];
			return (
				<Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
					{Scene ? <Run Scene={Scene} dur={s.dur} lines={s.lines} /> : <Missing id={s.id} />}
				</Sequence>
			);
		})}
		<Audio src={staticFile('ep01-voiceover/voiceover.wav')} />
		{BEDS.map((b, i) => (
			<Sequence key={i} from={b.from} durationInFrames={b.to - b.from} name={`music ${i}`}>
				<Loop durationInFrames={LOOP}>
					<Audio src={staticFile(b.src)} volume={(f) => b.volume * Math.min(1, f / 20)} />
				</Loop>
			</Sequence>
		))}
	</AbsoluteFill>
);
