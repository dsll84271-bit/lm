import type React from 'react';
import type {ShotProps} from '../../../components/stage';
import {Beach, Cold, Culling, Fps, MapShot, Npc, Npcs, Popin, Swim, Triangles, Tuttle} from './A';
import {Clip, Crash, Health, Hitbox, Jump, Mission, Night, Pizza, Save, Shop, Sun, Traffic} from './B';
import {CountdownShot, Edge, Huge, Outro, Run, Through, Twist, Wake} from './C';

export const SCENES: Record<string, React.FC<ShotProps>> = {
	cold: Cold,
	beach: Beach,
	tuttle: Tuttle,
	map: MapShot,
	npcs: Npcs,
	npc: Npc,
	swim: Swim,
	popin: Popin,
	culling: Culling,
	triangles: Triangles,
	fps: Fps,
	sun: Sun,
	traffic: Traffic,
	night: Night,
	mission: Mission,
	jump: Jump,
	crash: Crash,
	health: Health,
	clip: Clip,
	hitbox: Hitbox,
	shop: Shop,
	pizza: Pizza,
	save: Save,
	countdown: CountdownShot,
	huge: Huge,
	run: Run,
	edge: Edge,
	through: Through,
	wake: Wake,
	twist: Twist,
	outro: Outro,
};
