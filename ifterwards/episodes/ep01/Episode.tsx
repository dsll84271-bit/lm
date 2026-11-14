import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {COLOURS} from '../../brand/colours';
import {FONT_FAMILY} from '../../brand/fonts';
import {DayCard} from '../../components/DayCard';
import type {ShotProps} from '../../components/Stage';
import bedCool from '../../music/bed-cool.wav';
import bedWarm from '../../music/bed-warm.wav';
import whoosh from '../../sfx/whoosh.wav';
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

// The music bed for each section. The colour arc in sound: warm, then cool,
// then nothing at all for the turn (section 8), then warm again.
const BEDS: Record<number, string | null> = {1: bedWarm, 2: bedWarm, 3: bedWarm, 4: bedWarm, 5: bedCool, 6: bedCool, 7: bedCool, 8: null, 9: bedWarm};
const BED_VOLUME = 0.2;

/** Runs of neighbouring sections that share a bed, so the music is not chopped up. */
const bedRuns = () => {
	const runs: Array<{src: string; from: number; to: number}> = [];
	for (const s of TIMELINE.sections) {
		const src = BEDS[s.index];
		const start = s.card ? s.card.start : s.start;
		const last = runs[runs.length - 1];
		if (!src) {
			continue;
		}

		if (last && last.src === src && last.to === start) {
			last.to = s.start + s.dur;
		} else {
			runs.push({src, from: start, to: s.start + s.dur});
		}
	}

	return runs;
};

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
		{bedRuns().map((run) => {
			const length = run.to - run.from;
			return (
				<Sequence key={run.from} from={run.from} durationInFrames={length} layout="none">
					<Audio
						src={run.src}
						loop
						volume={(f) => interpolate(f, [0, 45, length - 60, length], [0, BED_VOLUME, BED_VOLUME, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
					/>
				</Sequence>
			);
		})}
		{/* A soft whoosh on every cut to a new location. */}
		{TIMELINE.shots.map((sh, i) =>
			i > 0 && TIMELINE.shots[i - 1].where !== sh.where && sh.section !== 8 ? (
				<Sequence key={`w${sh.id}`} from={Math.max(0, sh.start - 5)} layout="none">
					<Audio src={whoosh} volume={0.22} />
				</Sequence>
			) : null,
		)}
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
