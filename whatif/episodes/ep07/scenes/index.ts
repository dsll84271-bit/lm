import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Blue, Boat, Click, Cold, Echo, Sperm, Throat, Under} from './A';
import {Acid, Air, Beaks, Dive, Grey, Gulp, Plan} from './B';
import {Deck, Myth, Out, Outro, Pump, Real, Twist} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	boat: Boat,
	under: Under,
	blue: Blue,
	throat: Throat,
	click: Click,
	echo: Echo,
	sperm: Sperm,
	gulp: Gulp,
	beaks: Beaks,
	air: Air,
	dive: Dive,
	acid: Acid,
	grey: Grey,
	plan: Plan,
	out: Out,
	deck: Deck,
	pump: Pump,
	myth: Myth,
	real: Real,
	twist: Twist,
	outro: Outro,
};
