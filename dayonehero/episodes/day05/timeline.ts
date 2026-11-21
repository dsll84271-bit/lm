import timings from './voiceover/timings.json';
import type {Line} from '../../components/ui';

// Every shot's start and length in frames, worked out from the narration.
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

export type TimedShot = {id: string; from: number; dur: number; lines: Line[]};

export const SHOTS: TimedShot[] = timings.shots.map((s, i) => {
	const from = f(s.start);
	const next = i + 1 < timings.shots.length ? f(timings.shots[i + 1].start) : f(timings.seconds);
	return {
		id: s.id,
		from,
		dur: next - from,
		lines: s.lines.map((l) => ({who: l.who, text: l.text, a: f(l.start) - from, b: f(l.end) - from})),
	};
});

export const TOTAL = f(timings.seconds);
