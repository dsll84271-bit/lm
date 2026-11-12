import React from 'react';
import {Composition, Still} from 'remotion';
import '../brand/fonts';
import {HeroSheet} from '../characters/Sheet';
import {TestThumb} from '../characters/TestThumb';
import {EP01_FRAMES, Episode01} from '../episodes/ep01/Episode';

export const Root: React.FC = () => (
	<>
		<Composition id="Ep01" component={Episode01} width={1920} height={1080} fps={30} durationInFrames={EP01_FRAMES} />
		<Still id="HeroSheet" component={HeroSheet} width={1920} height={1080} />
		<Still id="TestThumb" component={TestThumb} width={1920} height={1080} />
	</>
);
