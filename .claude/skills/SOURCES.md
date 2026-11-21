# Installed skills: where they came from

Copied from the upstream repositories below on 2026-11-14 and read for safety before installing (no install-time scripts, no network calls hidden in instructions, no credential handling, no hidden characters). Each skill folder keeps its upstream licence in `LICENSE.upstream`. Test/eval fixtures and other tools' plugin files were left out.

| Skill(s) | Source | Commit | Licence |
|---|---|---|---|
| humanizer | github.com/blader/humanizer | b48c832 | MIT |
| find-skills | github.com/vercel-labs/skills | b716f9d | MIT |
| grill-me, grilling, tdd, diagnosing-bugs, codebase-design | github.com/mattpocock/skills | 5863806 | MIT |
| copywriting, seo-audit, ad-creative, cold-email, video, social, content-strategy, product-marketing | github.com/coreyhaines31/marketingskills | 1f83744 | MIT |
| lemo-opuscar | github.com/lemomo-ai/lemo-opuscar | 3a7132b | MIT (setup script), CC BY-NC 4.0 (SKILL.md and the library's guides) |
| hyperframes, hyperframes-cli, hyperframes-registry (added 2026-11-17) | github.com/heygen-com/hyperframes | 32ff8b3 | Apache-2.0 |

Notes:
- **lemo-opuscar** is a thin wrapper: on first use it clones its style library to `~/lemo-opuscar` and installs Node/Python packages there. Films you make with it are yours, commercial use included; the library's guides themselves may not be resold.
- Matt Pocock's `code-review` was not copied, because Claude Code already ships a `code-review` skill with the same name.
- The marketing skills read `.agents/product-marketing.md` for channel context.
- **hyperframes, hyperframes-cli, hyperframes-registry** come from github.com/heygen-com/hyperframes (v0.9.65, commit 32ff8b3, Apache-2.0). HyperFrames renders HTML to video locally for free; its launcher `hyperframes/scripts/plugin-cli.mjs` fetches the CLI from npm on first use, and the CLI sends usage telemetry unless `HYPERFRAMES_NO_TELEMETRY=1` or `DO_NOT_TRACK=1` is set. Left out: `style-sampling` (the ready-made Vox/Kurzgesagt-style templates need a paid HyperFrames Pro plan), `media-use` (HeyGen media), and the test files.
- Never add a skill here without reading it first.
