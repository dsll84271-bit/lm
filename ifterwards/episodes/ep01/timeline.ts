import type {Line} from '../../components/Stage';
import {CARDS, SHOTS, type ShotDef} from './shots';
import timings from './voiceover/timings.json';

// Works out where everything sits in the episode, in frames, from the
// voiceover timings. Nothing here is typed in by hand.

export const FPS = 30;
export const CARD_FRAMES = 60;
export const END_CARD_FRAMES = 150;

export type PlacedShot = ShotDef & {start: number; dur: number; lines: Line[]};
export type PlacedSection = {
	index: number;
	title: string;
	file: string;
	start: number;
	dur: number;
	card?: {label: string; previous?: string; start: number};
};

const f = (seconds: number) => Math.round(seconds * FPS);

const build = () => {
	const sections: PlacedSection[] = [];
	const shots: PlacedShot[] = [];
	let cursor = 0;
	let lastCard: string | undefined;

	timings.sections.forEach((section, i) => {
		const index = i + 1;
		const label = CARDS[index];
		let card: PlacedSection['card'];
		if (label) {
			card = {label, previous: lastCard, start: cursor};
			lastCard = label;
			cursor += CARD_FRAMES;
		}

		const dur = f(section.seconds);
		sections.push({index, title: section.title, file: section.file, start: cursor, dur, card});

		const mine = SHOTS.filter((s) => s.section === index);
		mine.forEach((shot, k) => {
			// A shot starts halfway through the pause before its first line.
			const from = k === 0 ? 0 : f((section.lines[mine[k - 1].to].end + section.lines[shot.from].start) / 2);
			const to = k === mine.length - 1 ? dur : f((section.lines[shot.to].end + section.lines[mine[k + 1].from].start) / 2);
			shots.push({
				...shot,
				start: cursor + from,
				dur: to - from,
				lines: section.lines.slice(shot.from, shot.to + 1).map((l) => ({text: l.text, a: f(l.start) - from, b: f(l.end) - from})),
			});
		});
		cursor += dur;
	});

	return {sections, shots, endCard: cursor, total: cursor + END_CARD_FRAMES};
};

export const TIMELINE = build();
