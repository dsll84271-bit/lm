// Writes episodes/ep01/shotlist.md from shots.ts and the voiceover timings.
//   npx tsx tools/shotlist.ts
import {writeFileSync} from 'node:fs';
import {CARD_FRAMES, END_CARD_FRAMES, FPS, TIMELINE} from '../episodes/ep01/timeline';

const tc = (frames: number) => {
	const s = frames / FPS;
	return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};

const out: string[] = [
	'# Episode 1 shot list',
	'',
	'What If You Could Hear Every Lie?',
	'',
	`Running time: ${tc(TIMELINE.total)} (${TIMELINE.shots.length} shots, ${TIMELINE.sections.filter((s) => s.card).length} day cards, 1 end card).`,
	'',
	'This file is written by `tools/shotlist.ts` from `shots.ts` and the voiceover timings. Edit `shots.ts`, not this file.',
	'',
];
for (const section of TIMELINE.sections) {
	if (section.card) {
		out.push(`**Day card: ${section.card.label}** at ${tc(section.card.start)} (${CARD_FRAMES / FPS} s)`, '');
	}

	out.push(`## ${section.index}. ${section.title}`, '', `Starts ${tc(section.start)}, runs ${(section.dur / FPS).toFixed(1)} s.`, '');
	out.push('| Shot | Starts | Length | Where | What happens | Camera | Narration |', '| --- | --- | --- | --- | --- | --- | --- |');
	for (const shot of TIMELINE.shots.filter((s) => s.section === section.index)) {
		const words = shot.lines.map((l) => l.text).join(' ');
		const short = words.length > 90 ? `${words.slice(0, 87)}...` : words;
		out.push(`| ${shot.id} | ${tc(shot.start)} | ${(shot.dur / FPS).toFixed(1)} s | ${shot.where} | ${shot.what} | ${shot.camera} | ${short.replace(/\|/g, '/')} |`);
	}

	out.push('');
}

out.push(`**End card** at ${tc(TIMELINE.endCard)} (${END_CARD_FRAMES / FPS} s): "Next: What If You Never Had to Sleep Again?"`, '');
writeFileSync('episodes/ep01/shotlist.md', out.join('\n'));
console.log(`wrote shotlist.md: ${TIMELINE.shots.length} shots, ${tc(TIMELINE.total)}`);
