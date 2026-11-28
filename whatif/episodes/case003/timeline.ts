import t from '../../public/case003/vo/timings.json';

export const FPS = 30;
export const TOTAL = Math.ceil(t.seconds * FPS);
type Para = {n: number; start: number; end: number; cut: number};
const paras = t.paras as Para[];
const words = t.words as [string, number, number][];

/** When a paragraph's shot starts (the middle of the pause before it). */
export const shotStart = (n: number) => (n === 1 ? 0 : paras[n - 2].cut);
/** When a paragraph's shot ends (the middle of the pause after it). */
export const shotEnd = (n: number) => paras[n - 1].cut;

/** Seconds at which a word is spoken in paragraph n (nth match, 0-based). */
export const wordAt = (n: number, word: string, nth = 0) => {
	const w = word.toLowerCase();
	const hits = words.filter(([x, , p]) => p === n && x === w);
	if (!hits.length) throw new Error(`word "${word}" not in paragraph ${n}`);
	return hits[Math.min(nth, hits.length - 1)][1];
};

export type Cue = (word: string, nth?: number) => number;
export type ShotProps = {d: number; cue: Cue};
export type ShotDef = {from: number; to?: number; C: React.FC<ShotProps>; name: string};

/** Frames for a shot spanning paragraphs from..to, plus a cue() that gives local frames of words. */
export const span = (from: number, to = from) => {
	const s = shotStart(from);
	const e = shotEnd(to);
	const startF = Math.round(s * FPS);
	const d = Math.round(e * FPS) - startF;
	const cue: Cue = (word, nth = 0) => {
		for (let n = from; n <= to; n++) {
			try {
				return Math.max(0, Math.round(wordAt(n, word, nth) * FPS) - startF);
			} catch {
				// try the next paragraph
			}
		}
		throw new Error(`cue "${word}" not found in paragraphs ${from}-${to}`);
	};
	return {startF, d, cue};
};

export const paraStartF = (n: number) => Math.round(paras[n - 1].start * FPS);
