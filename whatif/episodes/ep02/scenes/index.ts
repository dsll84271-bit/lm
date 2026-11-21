import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Brain, Bus, Cold, Dog, Energy, Rules, School} from './A';
import {Bike, Crush, Decoder, Gifts, Honest, Party, Penalty, Pins, Poker, Test} from './B';
import {Eeg, Fair, Found, Help, Listen, Mum, Noise, Outro, Police, Quiet, Quiz, Search, Truth, Twist} from './C';

/** Every shot in the script, by its name in script.md. */
export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold, dog: Dog, bus: Bus, school: School, rules: Rules, brain: Brain, energy: Energy,
	decoder: Decoder, test: Test, honest: Honest, poker: Poker, penalty: Penalty, gifts: Gifts, bike: Bike, pins: Pins, party: Party, crush: Crush,
	quiz: Quiz, police: Police, eeg: Eeg, noise: Noise, truth: Truth, mum: Mum, help: Help, fair: Fair, listen: Listen, search: Search,
	found: Found, quiet: Quiet, twist: Twist, outro: Outro,
};
