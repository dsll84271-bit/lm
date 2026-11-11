import React from 'react';
import {Composition, Series, Still} from 'remotion';
import '../brand/fonts';
import {DAY_CARD_FRAMES, DayCard} from '../components/DayCard';
import {
	SHEET_HEIGHT,
	SHEET_WIDTH,
	StickmanSheet,
} from '../characters/stickman/Sheet';

const DAY_CARD_LABELS = ['DAY 1', 'WEEK 1', 'MONTH 1', 'YEAR 1'];

/** The four standard day cards, one after another, for checking the flip. */
const DayCardDemo: React.FC = () => (
	<Series>
		{DAY_CARD_LABELS.map((label, i) => (
			<Series.Sequence key={label} durationInFrames={DAY_CARD_FRAMES}>
				<DayCard label={label} previous={DAY_CARD_LABELS[i - 1]} />
			</Series.Sequence>
		))}
	</Series>
);

// The list of everything that can be rendered. Each entry shows up in the
// Remotion Studio sidebar (npm run studio).
export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="DayCard"
				component={DayCard}
				width={1920}
				height={1080}
				fps={30}
				durationInFrames={DAY_CARD_FRAMES}
				defaultProps={{label: 'DAY 1'}}
			/>
			<Composition
				id="DayCardDemo"
				component={DayCardDemo}
				width={1920}
				height={1080}
				fps={30}
				durationInFrames={DAY_CARD_FRAMES * DAY_CARD_LABELS.length}
			/>
			<Still
				id="StickmanSheet"
				component={StickmanSheet}
				width={SHEET_WIDTH}
				height={SHEET_HEIGHT}
			/>
		</>
	);
};
