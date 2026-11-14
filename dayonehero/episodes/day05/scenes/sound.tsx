import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type SoundName = 'alarm' | 'pop' | 'whoosh' | 'stomp' | 'sparkle' | 'ding' | 'buzz' | 'boing' | 'rumble' | 'snap' | 'shrink';

/** Plays one sound effect at a frame of the shot. */
export const Sound: React.FC<{name: SoundName; at: number; volume?: number}> = ({name, at, volume = 0.5}) =>
	at >= 0 ? (
		<Sequence from={Math.round(at)} layout="none">
			<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
		</Sequence>
	) : null;
