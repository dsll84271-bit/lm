import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Bones, Cold, Mum, School, Sneeze, Step, Tall, Voice, Weight} from './A';
import {Dizzy, Food, Friend, Heat, Lunch, Measure, News, Quake, Useful, View} from './B';
import {Alone, BridgeShot, Cheer, Outro, Save, Shrink, Storm, Twist, WadlowShot} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	mum: Mum,
	tall: Tall,
	step: Step,
	weight: Weight,
	bones: Bones,
	sneeze: Sneeze,
	school: School,
	voice: Voice,
	news: News,
	friend: Friend,
	view: View,
	dizzy: Dizzy,
	lunch: Lunch,
	food: Food,
	measure: Measure,
	heat: Heat,
	useful: Useful,
	quake: Quake,
	alone: Alone,
	wadlow: WadlowShot,
	storm: Storm,
	bridge: BridgeShot,
	save: Save,
	cheer: Cheer,
	shrink: Shrink,
	twist: Twist,
	outro: Outro,
};
