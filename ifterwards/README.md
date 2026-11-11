# Ifterwards

Animated "What if you..." stories. Read `rulebook.md` first: every episode follows it.

## What is in each folder

| Folder | What it holds |
| --- | --- |
| `rulebook.md` | The channel's rules. Do not change without asking Leo. |
| `references/` | Videos whose quality we want to match. |
| `brand/` | Colours, the Fredoka font, channel artwork. |
| `characters/stickman/` | The stickman rig, and `sheet.png`, the model sheet. |
| `components/` | Reusable pieces: day card, captions, counters. |
| `episodes/ep01/` | Episode 1: script, voiceover, shot list, scenes, renders. |
| `sfx/`, `music/` | Sound effects and music (free for commercial use only). |
| `src/` | The list of everything that can be rendered. |

## The two tools

- **Remotion** assembles the video: it plays the scenes frame by frame, adds captions and audio, and writes the final file.
- **Three.js** builds the 3D sets the flat characters stand in.

## Using it

You need [Node.js](https://nodejs.org) (version 20 or newer). Then, in this folder:

```bash
npm install
```

Open the preview window, where every scene can be played and scrubbed:

```bash
npm run studio
```

Re-draw the stickman model sheet (`characters/stickman/sheet.png`):

```bash
npm run sheet
```

## The stickman

- `characters/stickman/rig.ts` is the character. Its proportions and colours live in one place, so he cannot go off-model.
- `expressions.ts` holds the five expressions, `poses.ts` the six poses and the walk.
- `Stickman.tsx` draws him. The same file draws everyone else: `who="other"` gives a blue-grey head and no scarf.

## The day card

- `components/DayCard.tsx` is the calendar page that flips to DAY 1, WEEK 1 and so on. It always lasts 2 seconds and always plays `sfx/paper-flip.wav`.
- The flip sound was made from scratch by `sfx/make_paper_flip.py`, so it is free to use commercially. To use a recorded sound instead, replace `paper-flip.wav`.

## Licence note

Remotion is free for individuals and for companies of up to three people. Larger companies need a paid licence: see remotion.dev/license.
