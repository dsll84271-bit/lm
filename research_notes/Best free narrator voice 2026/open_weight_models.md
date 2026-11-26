# Open-weight English TTS models for long-form male documentary narration (late Nov 2026)

Method note: WebFetch could not reach huggingface.co or artificialanalysis.ai from this session (both blocked by the network allowlist), so leaderboards and model cards were NOT read directly. Everything below comes from web-search result pages (official GitHub/HF pages where they appeared in results, otherwise secondary blogs). Many 2026 "best TTS" listicles look AI-generated and contradict each other; conflicts are flagged. Re-check the official LICENSE file of any model before publishing.

Use-case constraints applied throughout: English, male narrator, monetised YouTube (commercial), CPU-only 4 cores / ~15 GB RAM / ~6 GB free disk, target ~8 min audio in 1–2 h, i.e. a real-time factor (RTF = compute time / audio time) of about 7.5 or better (15 at the outside).

## Q1. Which open-weight models are currently rated most natural (blind human preference)?

### Takeaway
The open-weight top of the blind-vote boards in H2 2026 is dominated by new 2026 releases (Fish Audio Drama 3 / S2 Pro, Step-Audio-EditX, Voxtral TTS, Ming-3.0-tts, Higgs Audio V3, VoxCPM2, Qwen3-TTS), not the 2025 models in the original list; but the boards disagree with each other and snapshots shift monthly. Of the top-ranked open models, the ones that are both commercially usable and highly rated are Step-Audio-EditX (Apache-2.0), Ming-3.0-tts (MIT), Fish Audio Drama 3 (free commercial use under US$500k revenue), VoxCPM2 and Qwen3-TTS (Apache-2.0); Kokoro-82M is the highest-placed tiny model and the only top-board entry that is clearly CPU-friendly.

### Cited Findings
Leaderboard snapshots (conflicting, treat as indicative):
- Artificial Analysis Speech Arena snapshot (date unclear): Fish Audio S2 Pro is the top open-weights TTS at Elo 1123, then Step Audio EditX 1111, Voxtral TTS 1067, Kokoro 82M v1.0 1062; overall leader Gemini 3.1 Flash TTS 1214 — [Artificial Analysis leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard?tab=leaderboard) (via search snippet, not fetched)
- A different Artificial Analysis page snapshot shows Eleven v4 Turbo leading overall at 1345 and StepFun "StepAudio 3 TTS" at 1315 (released Nov 2026); open-weights list was garbled in the snippet. I found no evidence StepAudio 3 TTS is open-weight — [Artificial Analysis provider-voice](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice); [StepFun HF search result](https://huggingface.co/stepfun-ai/Step-Audio-EditX)
- July 2026 roundup: Step Audio EditX top open-weight on Speech Arena (1,118), Fish Audio S2 Pro second (1,110) — [builderai.tools](https://builderai.tools/blog/open-weight-text-to-speech-models-2026) / [presenc.ai](https://presenc.ai/research/best-open-weight-text-to-speech-models-2026) (search summary; exact attribution between these two pages unclear)
- October 2026 roundup: best open model Fish Audio Drama 3 Preview at 1245; Ming-3.0-tts led "open models a company can ship freely" at 1188 — [yaps.ai licence-checked list](https://www.yaps.ai/blog/best-local-tts-models) / [cekura.ai](https://www.cekura.ai/blogs/open-source-tts) (search summary)
- An August 2026 board used by one comparison had Voxtral TTS leading at 1,082, comparing Breeze TTS 2, Fish S2 Pro, Step Audio EditX, Voxtral, Qwen3-TTS, VoxCPM2, GLM-TTS, Higgs Audio V3, Kokoro, Chatterbox — [presenc.ai](https://presenc.ai/research/best-open-weight-text-to-speech-models-2026)
- Pinggy (~3 months old): Breeze TTS 2 at 1,215 Elo but weights non-commercial — [Pinggy](https://pinggy.io/blog/best_open_source_self_hosted_text_to_speech_models/)
- 17nas.com board (updated 15 Nov 2026) lists Fish Audio Drama 3 at Elo 1275 as top open-weight — [17nas TTS leaderboard](https://17nas.com/tts-leaderboard.php?lang=en-US)
- The Open Weights leaderboard (appears older) puts Kokoro 82M v1.0 (1,064) #1 among open models, then Maya1 and Higgs Audio V3 — [theopenweights.com](https://theopenweights.com/leaderboards/text-to-speech)
- Fish Audio Drama 3 (released 14 Oct 2026): 35B MoE open-weight TTS with word-level emotion direction; reported #1 on Artificial Analysis Pronunciation Robustness at 93.2% — [MarkTechPost](https://www.marktechpost.com/2026/10/14/fish-audio-drama-3-open-weight-tts-model/); [AICoder](https://aicoder.com/news/news-20261014-fish-audio-drama-3-open-weight-tts-moe)
- Voxtral TTS review claims it beats ElevenLabs 68% of the time in preference tests — [texttolab](https://texttolab.com/blog/voxtral-tts-review) (secondary; not verified)
- Kokoro 82M MOS 4.44 vs Pocket TTS 4.10 in one CPU benchmark — [heyneo](https://heyneo.com/blog/kokoro-supertonic-inflect-nano-pocket-tts-cpu-benchmark)
- Fish Audio is "the most consistent name" for top open-weights TTS across Nov 2026 sources, though Elo values differ by board — [17nas](https://17nas.com/tts-leaderboard.php?lang=en-US); [Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard?tab=leaderboard)
- TTS Arena V2 (huggingface.co/spaces/TTS-AGI/TTS-Arena-V2): could not be fetched (huggingface.co blocked) and no current standings appeared in search results.

### Inferences
- In naturalness terms the ranking is roughly: Fish Drama 3 ≥ Fish S2 Pro ≈ Step-Audio-EditX > Ming-3.0-tts / Voxtral / Higgs V3 / VoxCPM2 / Qwen3-TTS > Kokoro/Maya1 > older 2025 models (Chatterbox, F5, Orpheus, Dia, CosyVoice). Elo gaps of ~10–50 points between adjacent open models are small; listener preference for a specific male documentary voice will matter more than rank.
- All the top-ranked open models are 2B–35B parameters; none of the arena leaders is realistic on 4 CPU cores with 6 GB free disk (see Q3).

### Gaps
- No direct read of TTS Arena V2 or the live Artificial Analysis open-weights filter; the current (late-Nov 2026) Elo values are unconfirmed.
- No arena position found for Qwen3-TTS, Chatterbox Turbo, Pocket TTS, IndexTTS-2, CosyVoice 3, VibeVoice specifically in a current snapshot.
- No blind-preference data specific to long-form narration (arena clips are short single sentences).

## Q2. Per-model facts: size, licence, commercial/cloning restrictions, English quality, long-form stability, expressiveness, cloning/design

### Takeaway
Commercially clean for monetised YouTube (permissive licence on the weights): Qwen3-TTS (Apache-2.0), Chatterbox / Turbo / Multilingual (MIT), Kokoro (Apache-2.0), VoxCPM2 (Apache-2.0), Step-Audio-EditX (Apache-2.0), Ming-3.0-tts (MIT, confirmed by maintainers), CosyVoice 3 0.5B (Apache-2.0), MOSS-TTSD (Apache-2.0), Kani-TTS-2 (Apache-2.0), Maya1 (Apache-2.0), VibeVoice 1.5B/Realtime (MIT, but Microsoft restricts cloning and use intent), Kyutai TTS 1.6B (CC-BY-4.0 with attribution; some voice packs NC), Fish Drama 3 (Community Licence: free commercial under US$500k revenue, "Built with Fish Audio" notice). NOT OK without a paid/separate licence: Fish S2 Pro and OpenAudio S1-mini (Fish research/non-commercial, S1-mini contested), Voxtral TTS (CC BY-NC), F5-TTS official weights (CC BY-NC), Higgs Audio V3 (research/non-commercial), IndexTTS-2 (bilibili licence, commercial needs written authorisation), Breeze TTS 2 (non-commercial). Grey: Higgs Audio v2 (custom licence, 100k-AAU cap; Boson said it is open to reviewing a monetised-YouTube case), Dia2 (Apache but "research and educational" wording), Orpheus (Apache + Llama licence), Pocket TTS (MIT vs CC-BY-4.0 conflict, cloning weights gated), NeuTTS Air (Apache weights but repo licence NeuTTS Open Licence), Supertonic 3 (OpenRAIL-M use restrictions).

### Cited Findings

**Qwen3-TTS (Alibaba Qwen; 0.6B and 1.7B; "12Hz" tokenizer)**
- Family: Base (voice cloning), CustomVoice (9 built-in voices with instruction/emotion control), VoiceDesign (voice from a text description) — [QwenLM GitHub](https://github.com/QwenLM/Qwen3-TTS); [AI Game Dev listing](https://ai-game.dev/packages/aigd.audio-qwen3-tts-1-7b-customvoice)
- CustomVoice speakers: Vivian, Serena, Uncle_Fu, Dylan, Eric, Ryan, Aiden, Ono_Anna, Sohee (default Ryan); Ryan described as "male, warm and natural", Aiden "male, clear and versatile English" (third-party descriptions) — [AI Game Dev listing](https://ai-game.dev/packages/aigd.audio-qwen3-tts-1-7b-customvoice)
- Size label inconsistent: an official-card snippet says "2B parameters" for the 1.7B models — [HF CustomVoice card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice) (snippet)
- Licence Apache-2.0; commercial use of model and generated speech allowed per model-card licence field — [AI Game Dev 0.6B Base](https://ai-game.dev/packages/aigd.audio-qwen3-tts-0-6b-base); clones from ~3 s of audio — [cekura](https://www.cekura.ai/blogs/open-source-tts)
- Long-form: one write-up says "over 10+ minutes of narration, Qwen3 1.7B maintains consistency where others tend to drift" (single blog, anecdotal) — [Medium, Data Science Collective](https://medium.com/data-science-collective/high-quality-long-form-tts-with-qwen3-open-weight-models-cdd6e3d00df0); but a narrator fine-tune repo still chunks text to ≤300 characters because "the model drifts on very long outputs" — [qwen3-tts-audiobook-finetune](https://github.com/sabari245/qwen3-tts-audiobook-finetune)
- Phone-style tricky-text test: Kokoro 0.61 > Orpheus-3B 0.54 > Qwen3-TTS 0.49 — [dograh](https://www.dograh.com/hub/blogs/open-source-tts-models)
- Supported in LocalText2Voice desktop app (with chunking for long text) — [LocalText2Voice](https://github.com/estebanstifli/LocalText2Voice)

**Microsoft VibeVoice (1.5B, 7B, Realtime-0.5B)**
- Released 25 Aug 2025, repo disabled 5 Sep 2025 for "uses inconsistent with the stated intent" — [byteiota](https://byteiota.com/microsoft-vibevoice-the-voice-ai-microsoft-pulled-back/); [HN](https://news.ycombinator.com/item?id=45148114)
- Status contested: one Aug 2026 guide says official 1.5B weights are on HF; another says 7B was pulled and TTS code lives only in the vibevoice-community fork; another claims 7B still on HF; re-release reportedly restricts voice cloning — [localaimaster](https://localaimaster.com/blog/vibevoice-local-setup-guide); [joaoqueiros](https://www.ai.joaoqueiros.com/blog/vibevoice-local-tts-microsoft-removed-code-safe-setup); [getvivax](https://getvivax.com/blog/vibevoice-open-tts); [community fork](https://github.com/vibevoice-community/VibeVoice)
- Realtime-0.5B: MIT; ~300 ms to first audio; "NVIDIA T4 / Mac M4 Pro achieve realtime... other devices may require further testing"; English presets Carter, Davis, Emma, Frank, Grace, Mike, Samuel; 11 extra English style voices added 16 Dec 2025; EN/ZH only — [HF card](https://huggingface.co/microsoft/VibeVoice-Realtime-0.5B); [official doc](https://raw.githubusercontent.com/microsoft/VibeVoice/refs/heads/main/docs/vibevoice-realtime-0.5b.md); [official README](https://raw.githubusercontent.com/microsoft/VibeVoice/HEAD/README.md)
- Compliance concern raised for commercial use — [Affiverse](https://www.affiversemedia.com/microsofts-vibevoice-is-free-open-source-and-a-compliance-problem-waiting-to-happen/)

**Boson Higgs Audio v2 / v2.5 / V3**
- v2 tokenizer licence: expanded licence needed above 100,000 annual active users; Boson said threshold applies to the product using the materials and it is open to reviewing an expanded licence for a monetised YouTube channel — [HF discussion](https://huggingface.co/bosonai/higgs-audio-v2-tokenizer/discussions/8)
- v2 3B generation model licence listed as "other"; third-party write-ups say research-focused / production needs separate licence (unverified against LICENSE file) — [HF README mirror](https://huggingface.co/PierrunoYT/higgs-audio-v2-generation-3B-base/blob/main/README.md); [HackerNoon](https://hackernoon.com/the-higgs-tts-2-3b-base-model-a-text-to-speech-foundation-model)
- V3 (4B): research/non-commercial; revenue use needs separate commercial licence; bans non-consensual cloning; v2 and v2.5 remain on HF — [Boson README](https://raw.githubusercontent.com/boson-ai/higgs-audio/HEAD/README.md); [HF V3 card](https://huggingface.co/bosonai/higgs-audio-v3-tts-4b). One secondary source mentions a "Creator Use Grant" for monetised creator content but terms were cut off — unverified.

**IndexTTS-2 / 2.5 (bilibili)**
- Custom "bilibili Model Use License Agreement"; commercial use requires registration and prior written authorisation; several sites wrongly call it Apache-2.0 — [index-tts LICENSE](https://github.com/index-tts/index-tts/blob/main/LICENSE); [localaimaster](https://localaimaster.com/blog/indextts-2-setup-guide)
- Known for emotion sliders and duration control — [localaimaster](https://localaimaster.com/blog/indextts-2-setup-guide)

**Resemble Chatterbox / Turbo / Multilingual / Nano**
- "Chatterbox, Chatterbox Multilingual, and Chatterbox Turbo are released under the MIT license" — [Resemble via search](https://www.resemble.ai/learn/models/chatterbox-turbo)
- Turbo: one site "excellent for audiobooks and long-form"; another lists over-acting on long text as a known limitation — [tts.ai](https://tts.ai/voices/chatterbox-turbo/); [Growwstacks](https://growwstacks.com/blog/chatterbox-turbo-open-source-voice-ai)
- Chatterbox Nano (110M): vendor claim 3x realtime on CPU with 8 threads — [Resemble Nano/Flash](https://www.resemble.ai/resources/chatterbox-nano-and-flash-speed-at-the-edge-throughput-at-scale)

**Fish Audio OpenAudio S1-mini / S2 Pro / Drama 3**
- S2 Pro weights: Fish Audio Research License — research/non-commercial free, commercial needs separate agreement (business@fish.audio); S2.1 Pro supersedes it — [HF s2-pro](https://huggingface.co/fishaudio/s2-pro); [fish-speech GitHub](https://github.com/fishaudio/fish-speech); [Vercel](https://vercel.com/ai-gateway/models/fish-audio/s2-pro)
- Drama 3: 35B MoE (≈3B active per one source title "35B-A3B"); Fish Audio Community License v1.0 — commercial free under US$500k annual revenue, hosted TTS service needs separate licence, must display "Built with Fish Audio", no non-consensual cloning; HF tag still shows research licence (likely stale) — [eesel review](https://www.eesel.ai/blog/fish-audio-drama-3-review); [explainx](https://explainx.ai/blog/fish-audio-drama-3-open-weights-35b-a3b-word-level-editing-how-to-run-2026); [MarkTechPost](https://www.marktechpost.com/2026/10/14/fish-audio-drama-3-open-weight-tts-model/)
- OpenAudio S1-mini licence contested: one source says Apache-2.0, another "non-commercial only" — [hyper.ai](https://hyper.ai/en/notebooks/40534); [cartesia](https://www.cartesia.ai/learn/open-source-tts). (My recollection from training data is CC-BY-NC-SA-4.0 for S1-mini weights; unverified here.)

**Kyutai Pocket TTS (100M) and Kyutai TTS 1.6B**
- Pocket TTS: 100M params, real-time on CPU (Kyutai), ~6x real time on MacBook Air M4 CPU, uses ~2 cores; zero-shot cloning from ~5 s — [Kyutai](https://kyutai.org/tts/); [eWeek](https://www.eweek.com/news/pocket-tts-real-time-voice-ai-laptop-neuron/); [OSTechNix](https://ostechnix.com/pocket-tts-local-text-to-speech-no-gpu/)
- Pocket licence conflict: MIT (several blogs) vs CC-BY-4.0 (CoreML port inheriting from kyutai/pocket-tts); cloning weights gated separately; terms forbid non-consensual cloning — [aifoss](https://aifoss.dev/blog/kyutai-pocket-tts-voice-cloning-guide-2026/); [FluidInference CoreML README](https://huggingface.co/FluidInference/pocket-tts-coreml/blob/main/README.md); [AI Game Dev](https://ai-game.dev/packages/aigd.tts-pocket)
- Kyutai TTS 1.6B: weights CC-BY-4.0, actually ~1.8B params; EN/FR; voices from Expresso are CC-BY-NC (non-commercial), others CC-BY or CC0 — [HF card](https://huggingface.co/kyutai/tts-1.6b-en_fr); [raw README](https://huggingface.co/kyutai/tts-1.6b-en_fr/raw/main/README.md); [kyutai/tts-voices](https://huggingface.co/kyutai/tts-voices)

**Nari Dia / Dia2; Canopy Orpheus**
- Dia2: Apache-2.0 but card says intended for research/educational use; GPU (CUDA 12.8+), CPU fallback — [cekura](https://www.cekura.ai/blogs/open-source-tts); [micdrop](https://micdrop.dev/blog/top-open-source-text-to-speech-models)
- Orpheus: weights Apache-2.0 but Llama backbone so Meta Llama licence also applies; GPU, llama.cpp for CPU — [cartesia](https://www.cartesia.ai/learn/open-source-tts); [codesota](https://www.codesota.com/guides/tts-models)
- Orpheus, Dia and Sesame CSM "have had no update since late 2025" — [bentoml](https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models)

**CosyVoice 3 (Alibaba FunAudioLLM)**
- Fun-CosyVoice3-0.5B-2512 released with code under Apache-2.0; the 1.5B model in the paper is not open — [cosyvoice.org](https://cosyvoice.org/cosyvoice-3); [AI Game Dev](https://ai-game.dev/packages/aigd.tts-cosyvoice3)

**F5-TTS**
- MIT code, CC BY-NC 4.0 weights (Emilia training data); community retrain OpenF5-TTS is Apache — [ghtrends](https://ghtrends.dev/SWivid/F5-TTS/); [assemblyai](https://www.assemblyai.com/blog/free-open-source-text-to-speech)

**VoxCPM / VoxCPM2 (OpenBMB)**
- VoxCPM2 (Apr 2026): 2B params, tokenizer-free diffusion-autoregressive, 30 languages, 48 kHz, >2M hours training; Apache-2.0 "free for commercial use"; voice design + cloning; impersonation/fraud forbidden, AI audio should be labelled — [OpenBMB GitHub](https://github.com/OpenBMB/VoxCPM); [HF VoxCPM2](https://huggingface.co/openbmb/VoxCPM2); [aihola](https://aihola.com/article/openbmb-voxcpm2-tts-release)

**MOSS-TTSD / MOSS-TTS (OpenMOSS)**
- MOSS-TTSD Apache-2.0; long-form multi-speaker dialogue with zero-shot cloning — [MOSS-TTSD GitHub](https://github.com/OpenMOSS/MOSS-TTSD); MOSS-TTS family covers long-form speech, voice design, realtime streaming — [MOSS-TTS GitHub](https://github.com/OpenMOSS/MOSS-TTS)

**Kokoro-82M**
- 82M params, Apache-2.0, "best default open-source TTS in 2026" for permissive use — [cekura](https://www.cekura.ai/blogs/open-source-tts); long-form risk is flatter prosody on expressive material rather than drift — [spokio](https://spokio.pro/tts-for-audiobooks-long-form-narration)
- No cloning (fixed preset voices) — inference from all sources describing it as preset-voice; see Gaps.

**Kani-TTS-2 (nineninesix)**
- ~400M params, ~3 GB VRAM, Apache-2.0, cloning; "slow on CPU, GPU strongly recommended"; one HF thread reports cloning doesn't really clone — [daily pac / MarkTechPost repost](https://thedailypac.blogspot.com/2026/02/meet-kani-tts-2-400m-param-open-source.html); [Clore docs](https://docs.clore.ai/guides/audio-and-voice/kani-tts); [HF discussion](https://huggingface.co/nineninesix/kani-tts-2-en/discussions/2)

**NeuTTS Air (Neuphonic)**
- Weights Apache-2.0 (English, gated on HF) but repo LICENSE is NeuTTS Open License 1.0 (newer Nano models; commercial limited to <$5M revenue); Q4 GGUF ~400–600 MB, CPU-viable (vendor claim) — [cekura](https://www.cekura.ai/blogs/open-source-tts); [Spheron](https://www.spheron.network/blog/neutts-air-spheron-voice-ai/)

**Maya1 (Maya Research)**
- 3B params, Apache-2.0, English, voice design via description with emotion tags (laugh, cry, whisper); no CPU figures — [cekura](https://www.cekura.ai/blogs/open-source-tts)

**Step-Audio-EditX (StepFun)**
- 3B (HF metadata says 4B) LLM-based RL audio editing model with zero-shot TTS; Apache-2.0 code/repo, weights on HF + AWQ-4bit variant; disclaimer forbids cloning without permission; bundled Paraformer encoder under FunASR model licence — [GitHub](https://github.com/stepfun-ai/Step-Audio-EditX); [HF](https://huggingface.co/stepfun-ai/Step-Audio-EditX); [mlx-community](https://huggingface.co/mlx-community/Step-Audio-EditX-bf16)

**Newer 2026 releases found**
- Ming-3.0-tts (inclusionAI/Ant): 0.5B dense and 7.9B-A1.3B MoE (+ "tiny"); cloning, voice design, natural-language control; MIT, maintainers confirmed weights commercially usable incl. consented cloning (LICENSE file missing from weights repo at time of issue) — [GitHub](https://github.com/inclusionAI/Ming-3.0-tts); [Issue #19](https://github.com/inclusionAI/Ming-3.0-tts/issues/19)
- Voxtral TTS (Mistral, Mar 2026): 4B; weights CC BY-NC 4.0 per paper; commercial via Mistral API — [arXiv 2603.25551](https://arxiv.org/html/2603.25551v1); [texttolab](https://texttolab.com/blog/voxtral-tts-review)
- Supertonic 3 (Supertone): ~99M, CPU/ONNX, 31 languages, OpenRAIL-M weights (use restrictions) + MIT code — [HF card](https://huggingface.co/Supertone/supertonic-3); [mer.vin](https://mer.vin/2026/06/supertonic-3-99m-on-device-tts-with-onnx-31-languages-and-1200-chars-sec/)
- Breeze TTS 2: high Elo (1,215) but non-commercial weights — [Pinggy](https://pinggy.io/blog/best_open_source_self_hosted_text_to_speech_models/)
- GLM-TTS, Higgs Audio V3, Fish S2.1 Pro, Voicebox "TADA" (vendor claims 700s+ coherent audio without drift) also appear in 2026 comparisons — [presenc.ai](https://presenc.ai/research/best-open-weight-text-to-speech-models-2026); [voicebox.sh](https://voicebox.sh/)

**Long-form stability in general**
- Drift (pronunciation, timbre across chunks) is a known problem across open TTS; chunking is the standard mitigation — [spokio](https://spokio.pro/tts-for-audiobooks-long-form-narration); [qwen3 finetune repo](https://github.com/sabari245/qwen3-tts-audiobook-finetune)

### Inferences
- For a male documentary narrator with commercial rights, the strongest realistic candidates are: Qwen3-TTS 1.7B (CustomVoice "Ryan"/"Aiden", VoiceDesign for a "deep, measured documentary narrator" voice, or Base clone of a voice you own), Chatterbox/Turbo (MIT clone), VoxCPM2 (Apache, voice design), Ming-3.0-tts 0.5B (MIT), Kokoro (fast but flatter, preset male voices).
- Cloning a real person (e.g. a famous documentary narrator) is barred by most licences/usage terms (Step-Audio-EditX, Fish, Higgs, Kyutai, VoxCPM2, Ming) and by YouTube's own policies; use preset/designed voices or your own consented voice.

### Gaps
- Official LICENSE texts could not be opened (huggingface.co blocked). Unverified: Pocket TTS licence (MIT vs CC-BY-4.0), OpenAudio S1-mini licence, Higgs v2 generation-model licence text, VibeVoice 1.5B/7B current availability.
- No independent long-form (8+ minute) drift tests found for most models; long-form claims are single-blog or vendor.
- Kokoro male voice list and cloning capability not confirmed from a source in this session.
- Dia (v1), CosyVoice 3 long-form, Chatterbox Multilingual English quality: no specific evidence found.

## Q3. CPU feasibility on 4 cores / ~15 GB RAM / ~6 GB free disk; which can make ~8 min of audio in 1–2 h?

### Takeaway
Comfortably feasible: Kokoro-82M (RTF ~0.5–0.9 on CPU, i.e. 8 min in ~5–8 min), Pocket TTS (real time on ~2 cores), Supertonic 3, NeuTTS Air (GGUF). Feasible with patience: Qwen3-TTS 0.6B int8 (measured RTF ~3.07 on a 4-vCPU/15 GB box, so 8 min ≈ 25 min) and probably Qwen3-TTS 1.7B and Chatterbox/Turbo (no 4-core measurement; extrapolation puts them inside the 1–2 h window but this is unverified). Not practical: anything ≥2B (VoxCPM2, Step-Audio-EditX, Higgs, Voxtral, VibeVoice 1.5B/7B, Maya1, Fish S2 Pro/Drama 3, Ming MoE) because of CPU speed and/or the 6 GB disk limit.

### Cited Findings
- Qwen3-TTS 0.6B int8 on a shared 4-vCPU/15 GB box: RTF ≈ 3.07 (~0.33x real time); int4 was slower (RTF 3.26); ARM Neoverse-N1 RTF ≈ 1.28 — [OCDevel, Jul 2026](https://ocdevel.com/blog/20260711-quantized-cpu-tts)
- Other Qwen3-TTS CPU claims: RTF 2.11 for 0.6B (hardware unstated); estimate RTF 3–5 on high-end CPU; some guides wrongly say it needs an NVIDIA GPU — [qwen3-tts.app](https://qwen3-tts.app/blog/qwen3-tts-performance-benchmarks-hardware-guide-2026); [dev.to guide](https://dev.to/czmilo/qwen3-tts-the-complete-2026-guide-to-open-source-voice-cloning-and-ai-speech-generation-1in6)
- Kokoro-82M CPU RTF: ONNX 0.57, PyTorch 0.79; another run ONNX 0.64 / PyTorch 0.67, PyTorch climbing to 0.83 on long inputs — [heyneo](https://heyneo.com/blog/kokoro-tts-vs-supertonic-3-tts); [gauravvij benchmark repo](https://github.com/gauravvij/kokoro-tts-vs-supertonic-3-tts)
- Kokoro on 2 ARM cores ×0.91–0.93 real time; sentence splitting costs ~8% throughput — [obole-ia tts-cpu-benchmark](https://github.com/obole-ia/tts-cpu-benchmark)
- Pocket TTS CPU RTF 0.714 (hardware unstated); 6x real time on M4 Air; ~2 cores — [heyneo](https://heyneo.com/blog/kokoro-supertonic-inflect-nano-pocket-tts-cpu-benchmark); [eWeek](https://www.eweek.com/news/pocket-tts-real-time-voice-ai-laptop-neuron/)
- Chatterbox Turbo llama.cpp/GGML port: ~1.2–1.7x faster than real time on a 16-thread x86 CPU, 2.5 GB memory, measured on a long request — [AI Game Dev Turbo](https://ai-game.dev/packages/aigd.tts-chatterbox-turbo); NVIDIA ACE also ships a GGML/llama.cpp Chatterbox — [NVIDIA programming guide](https://docs.nvidia.com/ace-for-games/chatterbox-tts/programming-guide-tts-chatterbox.html)
- Original Chatterbox on CPU: "expect 5-10x slower inference" / "slower than real-time but usable for batch" (informal) — [localaimaster](https://localaimaster.com/blog/chatterbox-tts-setup-guide); Turbo "meant for a GPU" — [socialvik summary via search](https://www.socialvik.com/blog/chatterbox-tts-cpu-commercial-use)
- Supertonic 3: ~99M, runs fast on CPU, low memory — [HF card](https://huggingface.co/Supertone/supertonic-3)
- NeuTTS Air Q4 GGUF 400–600 MB, CPU-viable (vendor claim) — [Spheron](https://www.spheron.network/blog/neutts-air-spheron-voice-ai/)
- VibeVoice-Realtime-0.5B: realtime on T4 / M4 Pro; no CPU benchmark found — [official doc](https://raw.githubusercontent.com/microsoft/VibeVoice/refs/heads/main/docs/vibevoice-realtime-0.5b.md)
- Kani-TTS-2: "slow on CPU... GPU 10–50x faster" — [Clore docs](https://docs.clore.ai/guides/audio-and-voice/kani-tts)
- Chatterbox, CosyVoice 3, MOSS-TTS-Realtime, Ming-3.0-tts listed as GPU models in one roundup — [OCDevel 2025/26 roundup via search](https://ocdevel.com/blog/20250720-tts)
- Voxtral TTS claimed to run on ~3 GB RAM (secondary, unverified; licence non-commercial anyway) — [qwe.edu.pl](https://www.qwe.edu.pl/tutorial/voxtral-tts-open-weight-voice-ai/)

### Inferences
- Budget: 8 min audio in 60–120 min ⇒ need RTF ≤ ~7.5–15.
- Qwen3-TTS 0.6B (CustomVoice/Base) at RTF ~3 → ~25 min per 8 min: fits easily. Qwen3-TTS 1.7B has ~3x the parameters; a rough linear extrapolation gives RTF ~6–10 on the same box → ~50–80 min per 8 min: borderline-feasible (unmeasured). Disk: 1.7B weights at bf16 ≈ 3.4–4 GB plus a CPU PyTorch install (~1–2 GB) — tight but possibly within 6 GB; the 0.6B (~1.2–1.5 GB) is safe. (Byte estimates are arithmetic from parameter count, not sourced.)
- Chatterbox Turbo GGML at 1.2–1.7x real time on 16 threads → maybe RTF ~1.5–3 on 4 cores (extrapolation) → well inside budget; the official PyTorch build is likely much slower.
- Kokoro and Pocket TTS make 8 min in under ~10 min; they are the safe fallback but rate below the 1B+ models on expressiveness.
- VoxCPM2 (2B), Step-Audio-EditX (3–4B), Higgs (3–4B), Maya1 (3B), Voxtral (4B), VibeVoice 1.5B/7B, Fish S2 Pro / Drama 3 (35B MoE) are impractical: weights alone approach or exceed the 6 GB disk and CPU RTF would likely be far beyond 15.
- Recommended shortlist for this machine and use case: (1) Qwen3-TTS 1.7B CustomVoice/VoiceDesign if it fits on disk and RTF tests OK, else 0.6B; (2) Chatterbox Turbo (MIT) via a GGML/llama.cpp port with a consented male reference voice; (3) Kokoro-82M as fast, licence-clean fallback; (4) Pocket TTS if its licence is confirmed. Always chunk by sentence/paragraph to limit drift.

### Gaps
- No measured 4-core CPU RTF for Qwen3-TTS 1.7B, Chatterbox (PyTorch or Turbo), CosyVoice 3 0.5B, Ming-3.0-tts 0.5B, VibeVoice-Realtime, or MOSS-TTS.
- No r/LocalLLaMA threads surfaced in search; community CPU reports are therefore thin.
- Exact on-disk sizes per model were not retrieved (huggingface.co blocked).
