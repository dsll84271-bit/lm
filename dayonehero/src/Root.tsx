import React from 'react';
import {Composition, Still} from 'remotion';
import '../brand/fonts';
import {DAY05_FRAMES, Day05} from '../episodes/day05/Episode';
import {Day05Thumbnail} from '../episodes/day05/Thumbnail';

export const Root: React.FC = () => (
	<>
		<Composition id="Day05" component={Day05} width={1920} height={1080} fps={30} durationInFrames={DAY05_FRAMES} />
		<Still id="Day05Thumbnail" component={Day05Thumbnail} width={1920} height={1080} />
	</>
);
