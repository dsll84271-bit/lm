import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Book, Clover, Cold, Gene, Luck, Record} from './A';
import {Anti, Banana, Heavy, Muscles, Noise, Power, Train} from './B';
import {After, Count6, Faraday, Odds, Outro, Storm, Strike, Thunder, Twist} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	book: Book,
	clover: Clover,
	gene: Gene,
	record: Record,
	luck: Luck,
	heavy: Heavy,
	train: Train,
	muscles: Muscles,
	power: Power,
	noise: Noise,
	anti: Anti,
	banana: Banana,
	storm: Storm,
	count: Count6,
	thunder: Thunder,
	strike: Strike,
	odds: Odds,
	faraday: Faraday,
	after: After,
	twist: Twist,
	outro: Outro,
};
