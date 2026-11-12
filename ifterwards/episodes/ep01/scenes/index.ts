import type React from 'react';
import type {ShotProps} from '../../../components/Stage';
import {S1_1, S1_2, S1_3} from './S1';
import {S3_1, S3_2, S3_3} from './S3';
import {S4_1, S4_2, S4_3, S4_4, S4_5, S4_6} from './S4';
import {S5_1, S5_2, S5_3, S5_4, S5_5} from './S5';
import {S6_1, S6_2, S6_3} from './S6';
import {S7_1, S7_2, S7_3, S7_4, S7_5} from './S7';
import {S8_1, S8_2, S8_3, S8_4, S8_5} from './S8';
import {S9_1, S9_2, S9_3, S9_4, S9_5, S9_6, S9_7} from './S9';
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
	'3.1': S3_1,
	'3.2': S3_2,
	'3.3': S3_3,
	'4.1': S4_1,
	'4.2': S4_2,
	'4.3': S4_3,
	'4.4': S4_4,
	'4.5': S4_5,
	'4.6': S4_6,
	'5.1': S5_1,
	'5.2': S5_2,
	'5.3': S5_3,
	'5.4': S5_4,
	'5.5': S5_5,
	'6.1': S6_1,
	'6.2': S6_2,
	'6.3': S6_3,
	'7.1': S7_1,
	'7.2': S7_2,
	'7.3': S7_3,
	'7.4': S7_4,
	'7.5': S7_5,
	'8.1': S8_1,
	'8.2': S8_2,
	'8.3': S8_3,
	'8.4': S8_4,
	'8.5': S8_5,
	'9.1': S9_1,
	'9.2': S9_2,
	'9.3': S9_3,
	'9.4': S9_4,
	'9.5': S9_5,
	'9.6': S9_6,
	'9.7': S9_7,
};
