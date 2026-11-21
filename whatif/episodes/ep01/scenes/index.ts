import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Black, BusShot, Cold, Egg, Frozen, Gasp, Rules, Tests, TestShot} from './S1';
import {Careful, Dodge, FlyShot, Games, HighFive, Magic, Penalty, Rps, Teleport} from './S2';
import {Cost, Doctor, Drift, Famous, LightningShot, Lonely, Quiet, Race, Sleep} from './S3';
import {Dash, Driver, Miss, Outro, Reach, SnapShot, StreetShot, Twist} from './S4';

/** Every shot in the script, by its name in script.md. */
export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	frozen: Frozen,
	black: Black,
	gasp: Gasp,
	rules: Rules,
	tests: Tests,
	egg: Egg,
	bus: BusShot,
	test: TestShot,
	dodge: Dodge,
	penalty: Penalty,
	rps: Rps,
	fly: FlyShot,
	highfive: HighFive,
	careful: Careful,
	teleport: Teleport,
	games: Games,
	magic: Magic,
	race: Race,
	quiet: Quiet,
	lightning: LightningShot,
	famous: Famous,
	cost: Cost,
	sleep: Sleep,
	lonely: Lonely,
	drift: Drift,
	doctor: Doctor,
	street: StreetShot,
	snap: SnapShot,
	driver: Driver,
	dash: Dash,
	reach: Reach,
	miss: Miss,
	twist: Twist,
	outro: Outro,
};
