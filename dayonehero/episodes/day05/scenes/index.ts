import type React from 'react';
import type {ShotProps} from '../../../components/ui';
import {Alarm, Fall, FallWhy, Fun, Hide, Lift, Pillow, Ride, Room, RulerShot, Title} from './A';
import {BadNews, Cold, Haldane, Hungry, MouseShot, Voice} from './B';
import {Breakfast, Cliff, Found, HoopShot, Milk, MumShot, Next, Rule, Score, Stomp, Surface} from './C';

/** Every shot in the script, by its name in script.md. */
export const SCENES: Record<string, React.FC<ShotProps>> = {
	alarm: Alarm,
	room: Room,
	pillow: Pillow,
	title: Title,
	ruler: RulerShot,
	fun: Fun,
	ride: Ride,
	hide: Hide,
	lift: Lift,
	fall: Fall,
	fallwhy: FallWhy,
	haldane: Haldane,
	mouse: MouseShot,
	badnews: BadNews,
	cold: Cold,
	hungry: Hungry,
	voice: Voice,
	mum: MumShot,
	stomp: Stomp,
	breakfast: Breakfast,
	hoop: HoopShot,
	milk: Milk,
	surface: Surface,
	cliff: Cliff,
	rule: Rule,
	found: Found,
	score: Score,
	next: Next,
};
