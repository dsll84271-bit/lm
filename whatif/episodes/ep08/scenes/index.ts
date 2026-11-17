import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Bones, Cold, Mum, School, Sneeze, Step, Tall, Voice, Weight} from './A';

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
};
