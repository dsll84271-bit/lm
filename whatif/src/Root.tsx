import React from 'react';
import {Still} from 'remotion';
import '../brand/fonts';
import {HeroSheet} from '../characters/Sheet';

export const Root: React.FC = () => (
	<>
		<Still id="HeroSheet" component={HeroSheet} width={1920} height={1080} />
	</>
);
