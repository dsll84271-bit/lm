import React from 'react';
import {AbsoluteFill, Audio, Loop, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../../brand/colours';
import {FONT} from '../../brand/fonts';
import type {ShotProps} from '../../components/ui';
import {SCENES} from './scenes';
import {SHOTS, TOTAL} from './timeline';

export const DAY05_FRAMES = TOTAL;

const Missing: React.FC<{id: string}> = ({id}) => (
	<AbsoluteFill style={{background: C.navy, color: '#fff', fontFamily: FONT, fontSize: 80, alignItems: 'center', justifyContent: 'center'}}>{id}</AbsoluteFill>
);

const Run: React.FC<{Scene: React.FC<ShotProps>; dur: number; lines: ShotProps['lines']; from: number}> = ({Scene, dur, lines}) => {
	const frame = useCurrentFrame();
	return <Scene frame={frame} dur={dur} lines={lines} />;
};

// The music sits under the voices, a little lower whenever someone speaks.
const MUSIC = 0.24;

export const Day05: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		{SHOTS.map((s) => {
			const Scene = SCENES[s.id];
			return (
				<Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
					{Scene ? <Run Scene={Scene} dur={s.dur} lines={s.lines} from={s.from} /> : <Missing id={s.id} />}
				</Sequence>
			);
		})}
		<Audio src={staticFile('day05-voiceover/voiceover.wav')} />
		<Loop durationInFrames={Math.round(17.142 * 30)}>
			<Audio src={staticFile('music/bed.wav')} volume={MUSIC} />
		</Loop>
	</AbsoluteFill>
);
