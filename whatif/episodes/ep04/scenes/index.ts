import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {AntScene, CarpetScene, Cold, Cube, Fall, Haldane, Size, Strong} from './A';
import {Cat, CountScene, Crumbs, DropScene, Mum, Neck, Ride, Shrew, StriderScene, Voice} from './B';
import {Flood, Garden, Home, Night, Outro, Raft, RainScene, SeedScene, Twist} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	size: Size,
	fall: Fall,
	haldane: Haldane,
	carpet: CarpetScene,
	strong: Strong,
	cube: Cube,
	ant: AntScene,
	count: CountScene,
	neck: Neck,
	ride: Ride,
	crumbs: Crumbs,
	shrew: Shrew,
	mum: Mum,
	voice: Voice,
	cat: Cat,
	drop: DropScene,
	strider: StriderScene,
	seed: SeedScene,
	garden: Garden,
	rain: RainScene,
	flood: Flood,
	raft: Raft,
	night: Night,
	home: Home,
	twist: Twist,
	outro: Outro,
};
