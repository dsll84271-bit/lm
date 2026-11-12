# Day One Hero

Every morning Dex wakes up with a new power, and each episode finds out what it would really be like, with real science. This folder holds Day 5, "Dex Shrinks", rebuilt from scratch in the style of the Day 4 episode.

## What is where

| Folder | What it holds |
| --- | --- |
| `characters/` | Dex (yellow hoodie, hood up, blue slippers) and Mum (blonde bun, red cardigan), drawn in code so they can move and change expression |
| `sets/` | The bedroom, the kitchen, the close-up "tiny world" surfaces, and props (alarm clock, ruler, sugar cube, toy car, cereal hoop, milk drop, magnifying glass, shrew) |
| `components/ui.tsx` | Labels ("NEW POWER EVERY DAY"), sound words ("STOMP!"), spoken lines, sparkles, the camera |
| `episodes/day05/script.md` | The script. Each `### name` is one shot |
| `episodes/day05/scenes/` | The 57 shots, in four parts: waking up small and cold (S1), food, falling and strength (S2), Mum, Biscuit and the milk (S3), the ring under the fridge (S4); shared pieces in `kit.tsx` |
| `episodes/day05/voiceover/` | The narration and its timings |
| `sfx/`, `music/` | Sound effects and the music loop, all generated from scratch, so free to use |

## How to change things

- **Change a line:** edit `episodes/day05/script.md`, then remake the narration. Everything re-times itself.
  ```bash
  .venv/bin/python tools/voiceover.py episodes/day05
  ```
- **Preview:** `npm run studio` opens Remotion Studio in a browser.
- **Render the episode:**
  ```bash
  npx remotion render src/index.ts Day05 episodes/day05/renders/day05.mp4 --concurrency=4
  ```

## How it matches Day 4

Measured from the Day 4 clips (speech-to-text plus a voice-matching model):
- **Narrator:** Kokoro's "Heart" voice (`af_heart`), just under normal speed. It matched Day 4's narrator better than any other Kokoro voice.
- **Characters don't speak out loud.** Dex's and Mum's lines are written on screen.
- **Rules:** each limit of the power is numbered, on a yellow sticky note: "RULE 1. SMALL MEANS COLD."
- **Shape:** the morning is the science, with real numbers; the evening is a story where Dex uses the power, limits and all, to help someone.
- **Music:** a steady bed about 6 dB under the voice, like Day 4.
- **Length:** 8 minutes or more.

The voice tool and model are shared with the Ifterwards project next door; make `.venv` and `tools/models` links to it (see `../ifterwards/tools/setup_voice.sh`).

## The science in Day 5

- J. B. S. Haldane, "On Being the Right Size" (1926): a mouse dropped down a deep mine shaft gets a slight shock and walks away; "an insect going for a drink is in as great danger as a man leaning out over a precipice".
- Strength depends on a muscle's cross-section, which shrinks more slowly than weight, so small bodies are strong for their size.
- Heat leaves through the skin; small bodies have more skin for their size, so they cool faster.
- Shrews eat roughly their own body weight in food every day.
- Small vocal folds make a high voice; small lungs make a quiet one.
- To something tiny, a liquid's surface tension can be strong enough to trap it.
