import React from 'react';
import {Composition, Still} from 'remotion';
import '../brand/fonts';
import {HeroSheet} from '../characters/Sheet';
import {TestThumb} from '../characters/TestThumb';
import {Test3D} from '../three/Test3D';
import {Test3D2} from '../three/Test3D2';
import {TestGhost} from '../three/TestGhost';
import {EP01_FRAMES, Episode01} from '../episodes/ep01/Episode';
import {EP02_FRAMES, Episode02} from '../episodes/ep02/Episode';
import {EP03_FRAMES, Episode03} from '../episodes/ep03/Episode';

export const Root: React.FC = () => (
	<>
		<Composition id="Ep01" component={Episode01} width={1920} height={1080} fps={30} durationInFrames={EP01_FRAMES} />
		<Composition id="Ep02" component={Episode02} width={1920} height={1080} fps={30} durationInFrames={EP02_FRAMES} />
		<Composition id="Ep03" component={Episode03} width={1920} height={1080} fps={30} durationInFrames={EP03_FRAMES} />
		<Still id="HeroSheet" component={HeroSheet} width={1920} height={1080} />
		<Still id="TestThumb" component={TestThumb} width={1920} height={1080} />
		<Still id="Test3D" component={Test3D} width={1920} height={1080} />
		<Composition id="TestGhost" component={TestGhost} width={1920} height={1080} fps={30} durationInFrames={100} />
		<Composition id="Test3D2" component={Test3D2} width={1920} height={1080} fps={30} durationInFrames={300} />
	</>
);
