import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame} from 'remotion';
import {COLOURS} from '../../brand/colours';
import {FONT_FAMILY} from '../../brand/fonts';
import {DayCard} from '../../components/DayCard';
import type {ShotProps} from '../../components/Stage';
import {SCENES} from './scenes';
import {CARD_FRAMES, END_CARD_FRAMES, TIMELINE} from './timeline';
import vo1 from './voiceover/01-cold-open.wav';
import vo2 from './voiceover/02-day-1-the-rule.wav';
import vo3 from './voiceover/03-day-3-what-the-lies-are.wav';
import vo4 from './voiceover/04-week-1-the-advantage.wav';
import vo5 from './voiceover/05-month-1-the-cost.wav';
import vo6 from './voiceover/06-month-3-people-find-out.wav';
import vo7 from './voiceover/07-month-6-a-very-small-life.wav';
import vo8 from './voiceover/08-the-turn.wav';
import vo9 from './voiceover/09-year-1-asking-why.wav';

// Episode 1, assembled: narration, day cards, every shot, and the end card.

const VOICE = [vo1, vo2, vo3, vo4, vo5, vo6, vo7, vo8, vo9];
export const EP01_FRAMES = TIMELINE.total;

/** Gives a shot its own frame count, starting from 0. */
const Run: React.FC<{C: React.FC<ShotProps & {frame: number}>} & ShotProps> = ({C, dur, lines}) => {
	const frame = useCurrentFrame();
	return <C frame={frame} dur={dur} lines={lines} />;
};

/** Stands in for a shot that has not been built yet. */
const Missing: React.FC<{id: string}> = ({id}) => (
	<AbsoluteFill style={{backgroundColor: COLOURS.navy, alignItems: 'center', justifyContent: 'center'}}>
		<div style={{fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 90, color: COLOURS.blueGrey}}>SHOT {id}</div>
	</AbsoluteFill>
);

const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: COLOURS.navy, alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, frame / 12)}}>
			<div style={{fontFamily: FONT_FAMILY, fontWeight: 700, textAlign: 'center', transform: `scale(${1 + frame * 0.0004})`}}>
				<div style={{color: COLOURS.amber, fontSize: 56, letterSpacing: 10}}>NEXT</div>
				<div style={{color: COLOURS.cream, fontSize: 92, marginTop: 26, lineHeight: 1.15}}>
					What If You Never Had
					<br />
					to Sleep Again?
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Episode01: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLOURS.navy}}>
		{TIMELINE.sections.map((s) => (
			<React.Fragment key={s.index}>
				{s.card ? (
					<Sequence from={s.card.start} durationInFrames={CARD_FRAMES}>
						<DayCard label={s.card.label} previous={s.card.previous} />
					</Sequence>
				) : null}
				<Sequence from={s.start} durationInFrames={s.dur} layout="none">
					<Audio src={VOICE[s.index - 1]} volume={0.85} />
				</Sequence>
			</React.Fragment>
		))}
		{TIMELINE.shots.map((sh) => {
			const C = SCENES[sh.id];
			return (
				<Sequence key={sh.id} from={sh.start} durationInFrames={sh.dur}>
					{C ? <Run C={C} dur={sh.dur} lines={sh.lines} /> : <Missing id={sh.id} />}
				</Sequence>
			);
		})}
		<Sequence from={TIMELINE.endCard} durationInFrames={END_CARD_FRAMES}>
			<EndCard />
		</Sequence>
	</AbsoluteFill>
);
