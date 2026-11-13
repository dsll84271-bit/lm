import React from 'react';
import {AbsoluteFill, Audio, Loop, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../../brand/fonts';
import type {ShotProps} from '../../components/stage';
import {SCENES} from './scenes';
import {SHOTS, TOTAL} from './timeline';

export const EP02_FRAMES = TOTAL;

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

/** Music: the main bed, the tense bed from the lost child to the rescue, silence for the twist. */
const BEDS: Array<{from: number; to: number; src: string; volume: number}> = [
	{from: 0, to: at('fair').from, src: 'music/main.wav', volume: 0.16},
	{from: at('fair').from, to: end('found'), src: 'music/tense.wav', volume: 0.2},
	{from: at('quiet').from, to: at('twist').from, src: 'music/main.wav', volume: 0.12},
	{from: at('outro').from, to: TOTAL, src: 'music/main.wav', volume: 0.16},
];

/** The background sound of each scene. */
const AMB: Record<string, string> = {
	cold: 'amb_room', dog: 'amb_field', bus: 'amb_city', school: 'amb_crowd', rules: 'amb_slow', brain: 'amb_slow', energy: 'amb_slow',
	decoder: 'amb_room', test: 'amb_crowd', honest: 'amb_room', poker: 'amb_room', penalty: 'amb_field', gifts: 'amb_room', bike: 'amb_city',
	pins: 'amb_room', party: 'amb_crowd', crush: 'amb_crowd', quiz: 'amb_crowd', police: 'amb_room', eeg: 'amb_room', noise: 'amb_crowd',
	truth: 'amb_crowd', mum: 'amb_room', help: 'amb_room', fair: 'amb_crowd', listen: 'amb_crowd', search: 'amb_crowd', found: 'amb_field',
	quiet: 'amb_field', twist: 'amb_room', outro: 'amb_slow',
};
const AMB_LOOP = 8 * 30;

export const Episode02: React.FC = () => (
	<AbsoluteFill style={{background: '#05030C'}}>
		{SHOTS.map((s) => {
			const Scene = SCENES[s.id];
			return (
				<Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
					{Scene ? <Run Scene={Scene} dur={s.dur} lines={s.lines} /> : <Missing id={s.id} />}
				</Sequence>
			);
		})}
		{SHOTS.filter((s) => AMB[s.id]).map((s) => (
			<Sequence key={`amb-${s.id}`} from={s.from} durationInFrames={s.dur} name={`amb ${s.id}`}>
				<Loop durationInFrames={AMB_LOOP}>
					<Audio src={staticFile(`sfx/${AMB[s.id]}.wav`)} volume={0.22} />
				</Loop>
			</Sequence>
		))}
		<Audio src={staticFile('ep02-voiceover/voiceover.wav')} />
		{BEDS.map((b, i) => (
			<Sequence key={i} from={b.from} durationInFrames={b.to - b.from} name={`music ${i}`}>
				<Loop durationInFrames={LOOP}>
					<Audio src={staticFile(b.src)} volume={(f) => b.volume * Math.min(1, f / 20)} />
				</Loop>
			</Sequence>
		))}
	</AbsoluteFill>
);
