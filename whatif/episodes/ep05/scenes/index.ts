import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Bones, Borelli, Cold, Flap, Giant, Gossamer, School, Window} from './A';
import {Clouds, Geese, Godwit, High, Lost, Race, Sleep, Tired} from './B';
import {Condor, Home, Night, Outro, Thermal, Turns, Twist, VeeScene} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	window: Window,
	school: School,
	flap: Flap,
	borelli: Borelli,
	bones: Bones,
	giant: Giant,
	gossamer: Gossamer,
	race: Race,
	clouds: Clouds,
	high: High,
	geese: Geese,
	lost: Lost,
	godwit: Godwit,
	sleep: Sleep,
	tired: Tired,
	thermal: Thermal,
	condor: Condor,
	vee: VeeScene,
	turns: Turns,
	home: Home,
	night: Night,
	twist: Twist,
	outro: Outro,
};
