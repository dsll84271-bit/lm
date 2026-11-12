import type React from 'react';
import type {ShotProps} from '../../../components/Stage';
import {S1_1, S1_2, S1_3} from './S1';
import {S2_1, S2_2, S2_3, S2_4, S2_5, S2_6, S2_7, S2_8, S2_9} from './S2';

/** Every shot of Episode 1, by its id in shots.ts. */
export const SCENES: Record<string, React.FC<ShotProps & {frame: number}>> = {
	'1.1': S1_1,
	'1.2': S1_2,
	'1.3': S1_3,
	'2.1': S2_1,
	'2.2': S2_2,
	'2.3': S2_3,
	'2.4': S2_4,
	'2.5': S2_5,
	'2.6': S2_6,
	'2.7': S2_7,
	'2.8': S2_8,
	'2.9': S2_9,
};
