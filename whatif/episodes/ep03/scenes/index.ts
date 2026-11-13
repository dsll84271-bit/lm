import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Breakfast, Cold, Eyes, Frog, Glass, Mirror, Prank, Register, Rules, Staff} from './A';
import {CanteenScene, Choice, Cloak, DogScene, Gyges, Heat, Honesty, Octopus, Rain, Shadow, Tiny} from './B';
import {Appear, Habit, Home, Nerves, Outro, Photos, Seat, Show, StageScene, Twist} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	mirror: Mirror,
	rules: Rules,
	eyes: Eyes,
	glass: Glass,
	frog: Frog,
	breakfast: Breakfast,
	register: Register,
	prank: Prank,
	staff: Staff,
	shadow: Shadow,
	dog: DogScene,
	rain: Rain,
	heat: Heat,
	canteen: CanteenScene,
	honesty: Honesty,
	gyges: Gyges,
	choice: Choice,
	cloak: Cloak,
	tiny: Tiny,
	octopus: Octopus,
	habit: Habit,
	seat: Seat,
	photos: Photos,
	show: Show,
	nerves: Nerves,
	stage: StageScene,
	appear: Appear,
	home: Home,
	twist: Twist,
	outro: Outro,
};
