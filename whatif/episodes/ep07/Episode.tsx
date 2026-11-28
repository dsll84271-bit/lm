import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../../brand/fonts';
import type {ShotProps} from '../../components/stage';
import {SCENES} from './scenes';
import {SHOTS, TOTAL} from './timeline';

export const EP07_FRAMES = TOTAL;

const Missing: React.FC<{id: string}> = ({id}) => (
	<AbsoluteFill style={{background: '#1A1240', color: '#fff', fontFamily: FONT, fontSize: 80, alignItems: 'center', justifyContent: 'center'}}>{id}</AbsoluteFill>
);

const Run: React.FC<{Scene: React.FC<ShotProps>; dur: number; lines: ShotProps['lines']}> = ({Scene, dur, lines}) => {
	const frame = useCurrentFrame();
	return <Scene frame={frame} dur={dur} lines={lines} />;
};

const at = (id: string) => SHOTS.find((s) => s.id === id)!;

/**
 * Music: the main bed for the boat, the dive and the whales, the tense bed
 * from the gulp to the escape, main again from the deck to the end of the
 * real stories, quiet for the twist, main for the outro.
 */
const BEDS: Array<{from: number; to: number; src: string; volume: number}> = [
	{from: at('boat').from, to: at('gulp').from, src: 'music/main.wav', volume: 0.15},
	{from: at('gulp').from, to: at('deck').from, src: 'music/tense.wav', volume: 0.15},
	{from: at('deck').from, to: at('twist').from, src: 'music/main.wav', volume: 0.15},
	{from: at('outro').from, to: TOTAL, src: 'music/main.wav', volume: 0.16},
];

export const Episode07: React.FC = () => (
	<AbsoluteFill style={{background: '#05030C'}}>
		{SHOTS.map((s) => {
			const Scene = SCENES[s.id];
			return (
				<Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
					{Scene ? <Run Scene={Scene} dur={s.dur} lines={s.lines} /> : <Missing id={s.id} />}
				</Sequence>
			);
		})}
		<Audio src={staticFile('ep07-voiceover/voiceover.wav')} />
		{BEDS.map((b, i) => (
			<Sequence key={i} from={b.from} durationInFrames={b.to - b.from} name={`music ${i}`}>
				<Audio src={staticFile(b.src)} loop volume={(f) => b.volume * Math.min(1, f / 20) * Math.min(1, (b.to - b.from - f) / 24)} />
			</Sequence>
		))}
	</AbsoluteFill>
);
