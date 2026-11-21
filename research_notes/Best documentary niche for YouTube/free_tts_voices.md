# Free text-to-speech for monetised YouTube documentary narration (as of 19 Nov 2026)

Scope: free TTS (open-weight models and free hosted tiers) judged on (1) realism for long narration, (2) a licence that permits commercial / monetised-YouTube use, (3) running on Linux, CPU only, ~8 GB RAM, ideally under ~2 GB of model weights.

Method note: licence fields, creation dates and file sizes below were pulled directly from the Hugging Face model API and model cards (huggingface.co/api/models/...) and GitHub READMEs on 19 Nov 2026. Several sites could not be reached from this research session (artificialanalysis.ai, the TTS Arena space, learn.microsoft.com, discuss.ai.google.dev, yaps.ai, micdrop.dev), so leaderboard numbers and hosted-service terms rely on search-result summaries of those pages and are flagged as such.

## 1. Open-weight models: exact weight licences and commercial status

### Takeaway
Of the models named in the brief, the weights that clearly allow commercial use are Kokoro (Apache 2.0), Chatterbox family (MIT), Dia/Dia2, Orpheus, Sesame CSM, Zonos, NeuTTS Air, Kitten TTS (Apache 2.0), MeloTTS and Piper (MIT, but Piper voices vary by dataset), and VibeVoice (MIT). F5-TTS, XTTS-v2, Spark-TTS are non-commercial. Many of the strongest 2026 releases (Fish Audio Drama 3 / S2 Pro, Higgs TTS 3, Breeze TTS 2, OmniVoice, Phonon 40M) are also non-commercial, while new commercial-friendly ones include Phonon 31M, Kitten TTS 2 Mini, ZONOS3-Mini, Qwen3-TTS, VoxCPM2, Ming-3.0-tts, Pocket TTS (CC-BY, attribution) and Supertonic 3 (OpenRAIL-M).

### Cited Findings

**Commercial use allowed (weights)**
- Kokoro-82M (hexgrad): Apache-2.0; created 26 Dec 2024, last updated Apr 2025; ~13.1M downloads in the last month, the most-downloaded TTS model on HF — [HF API / model card](https://huggingface.co/hexgrad/Kokoro-82M)
- Chatterbox (Resemble AI): MIT (original, Apr 2025); Chatterbox-Turbo (350M, Dec 2025) MIT; Chatterbox-Turbo-ONNX MIT; Chatterbox-Nano (110M, Apr 2026) MIT; Chatterbox-Flash (May 2026) MIT; Chatterbox-Multilingual regional variants (Apr 2026) MIT — [HF ResembleAI org](https://huggingface.co/ResembleAI)
- Chatterbox README now says "As of August 2026, Chatterbox is retired research and is no longer maintained" and the code "stays public as an archive under the MIT license, with no support, updates, or paid tier" — [GitHub resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)
- Every Chatterbox output carries Resemble AI's imperceptible PerTh watermark (survives MP3 compression) — [GitHub resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)
- Orpheus 3B (Canopy Labs, Mar 2025): card licence apache-2.0; HF repo is gated (auto-approve) — [HF canopylabs/orpheus-3b-0.1-ft](https://huggingface.co/canopylabs/orpheus-3b-0.1-ft)
- Dia-1.6B (Nari Labs, Apr 2025): apache-2.0; Dia2-2B (created 15 Nov 2025): apache-2.0 — [HF nari-labs/Dia-1.6B](https://huggingface.co/nari-labs/Dia-1.6B); [HF nari-labs/Dia2-2B](https://huggingface.co/nari-labs/Dia2-2B)
- Sesame CSM-1B (Mar 2025): apache-2.0, gated (auto) — [HF sesame/csm-1b](https://huggingface.co/sesame/csm-1b)
- Zonos v0.1 transformer (Zyphra, Feb 2025): apache-2.0 — [HF Zyphra/Zonos-v0.1-transformer](https://huggingface.co/Zyphra/Zonos-v0.1-transformer)
- ZONOS3-Mini (Zyphra, created 9 Nov 2026): "Model weights are released under Apache 2.0"; 100M active parameters, 43 languages, voice cloning and voice design; "runs in real time on phones and laptops, including directly in the browser"; native runtimes listed for CPU, CUDA, Metal or Vulkan — [HF Zyphra/ZONOS3-Mini](https://huggingface.co/Zyphra/ZONOS3-Mini)
- MeloTTS-English (MyShell): MIT — [HF myshell-ai/MeloTTS-English](https://huggingface.co/myshell-ai/MeloTTS-English)
- Piper voices repo (rhasspy/piper-voices): repo card licence MIT; English voices include en_GB alan, alba, aru, cori (high), jenny_dioco, northern_english_male, semaine, southern_english_female, vctk, and en_US amy, bryce, joe, john, kristin, lessac (high), libritts (high), ljspeech (high), ryan (high), norman, sam etc. — [HF rhasspy/piper-voices voices.json](https://huggingface.co/rhasspy/piper-voices)
- Kitten TTS nano 0.2 (Aug 2025): apache-2.0 — [HF KittenML/kitten-tts-nano-0.2](https://huggingface.co/KittenML/kitten-tts-nano-0.2)
- Kitten TTS 2 Mini (created 13 Nov 2026): "Apache-2.0 (the models, voice packs and the bundled G2P files)"; 82M parameters, 16 languages, 118 voices, 24 kHz — [HF KittenML/kitten-tts-2-mini](https://huggingface.co/KittenML/kitten-tts-2-mini)
- NeuTTS Air (Neuphonic, Sep 2025, updated Aug 2026): apache-2.0, gated (auto) — [HF neuphonic/neutts-air](https://huggingface.co/neuphonic/neutts-air)
- Phonon 31M English (Gradium, created 19 Oct 2026): "The weights, tokenizer and voices in this repository are released under Apache 2.0, which allows commercial use. The runtime is a separate project, licensed MIT OR Apache-2.0." — [HF gradium/phonon-31m-en](https://huggingface.co/gradium/phonon-31m-en)
- Qwen3-TTS (Alibaba, Jan 2026): 0.6B Base, 1.7B CustomVoice and 1.7B VoiceDesign all apache-2.0 — [HF Qwen/Qwen3-TTS-12Hz-0.6B-Base](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base)
- VoxCPM2 (OpenBMB, Apr 2026): 2B params, 30 languages, 48 kHz; "Apache-2.0 license, free for commercial use"; VoxCPM1.5 (Dec 2025) also apache-2.0 — [HF openbmb/VoxCPM2](https://huggingface.co/openbmb/VoxCPM2)
- Ming-3.0-tts-0.5B (inclusionAI, Sep 2026): MIT; zero-shot cloning; built-in voices including "UK_George" and "US_Emma" — [HF inclusionAI/Ming-3.0-tts-0.5B](https://huggingface.co/inclusionAI/Ming-3.0-tts-0.5B)
- Audio8-TTS-Realistic-Air (Edge0, Oct 2026): apache-2.0, 601M main-model params plus codec, zero-shot cloning, llama.cpp/GGUF support added 16 Nov 2026 — [HF Edge0/Audio8-TTS-Realistic-Air](https://huggingface.co/Edge0/Audio8-TTS-Realistic-Air)
- Maya1 (Maya Research, Oct 2025): apache-2.0; Maya 2 Native (Oct 2026) apache-2.0 but focused on 11 Indian languages + English and needs an NVIDIA GPU (~9.2 GB peak) — [HF maya-research/maya1](https://huggingface.co/maya-research/maya1); [HF maya-research/maya2-native](https://huggingface.co/maya-research/maya2-native)
- Soprano-80M (Dec 2025): apache-2.0 — [HF ekwek/Soprano-80M](https://huggingface.co/ekwek/Soprano-80M)
- VibeVoice-1.5B (Microsoft, Aug 2025) and VibeVoice-Realtime-0.5B (Dec 2025): card licence MIT — [HF microsoft/VibeVoice-1.5B](https://huggingface.co/microsoft/VibeVoice-1.5B); [HF microsoft/VibeVoice-Realtime-0.5B](https://huggingface.co/microsoft/VibeVoice-Realtime-0.5B)

**Commercial use allowed but with conditions**
- Pocket TTS (Kyutai, released Jan 2026; HF repo updated Oct 2026): weights CC-BY-4.0 (attribution required); HF repo gated — [HF kyutai/pocket-tts](https://huggingface.co/kyutai/pocket-tts). Kyutai TTS 1.6B en/fr is also CC-BY-4.0 — [HF kyutai/tts-1.6b-en_fr](https://huggingface.co/kyutai/tts-1.6b-en_fr)
- Pocket TTS voice catalogue licences vary per voice: volunteer-donated voices are CC0, VCTK voices CC BY 4.0, but Expresso-derived voices are "Non-commercial use only" (CC BY-NC 4.0) — [HF kyutai/tts-voices](https://huggingface.co/kyutai/tts-voices)
- Supertonic 3 (Supertone, created 6 May 2026): sample code MIT, model under OpenRAIL-M with use-based restrictions (Attachment A, "You agree not to use the Model or Derivatives of the Model: ...") — [HF Supertone/supertonic-3](https://huggingface.co/Supertone/supertonic-3). A third-party blog reports Supertone archived the repo in Sept 2026 ("Development and support have ended") while weights stay downloadable — reported via [search summary of yaps.ai](https://www.yaps.ai/blog/best-local-tts-models) (not verified directly)
- Kitten TTS 2 (1.7B, Sep 2026): Stellon Labs Community License: "Research, non-commercial and limited commercial use are free of charge; the commercial grant ends once you or your affiliates pass USD $1,000,000 in annual revenue or in total cumulative funding"; distribution carries attribution requirements — [HF KittenML/kitten-tts-2](https://huggingface.co/KittenML/kitten-tts-2)
- IndexTTS2 (bilibili): "bilibili Model Use License Agreement" covering weights and code; separate licence needed only if you or affiliates exceed 100 million monthly active users or a revenue threshold; also "You may not Use the bilibili indextts2 or any Derivative Work to improve any AI model" other than itself or non-commercial models — [GitHub index-tts LICENSE](https://github.com/index-tts/index-tts/blob/main/LICENSE)
- StyleTTS2: code MIT, but the README states for pretrained models: "Before using these pre-trained models, you agree to inform the listeners that the speech samples are synthesized by the pre-trained models, unless you have the permission to use the voice you synthesize"; inference depends on a GPL-licensed package — [GitHub yl4579/StyleTTS2](https://github.com/yl4579/StyleTTS2)

**Non-commercial (do not use for monetised video)**
- F5-TTS: weights cc-by-nc-4.0 — [HF SWivid/F5-TTS](https://huggingface.co/SWivid/F5-TTS)
- XTTS-v2 (Coqui): "coqui-public-model-license" (coqui.ai/cpml), last updated Dec 2023 — [HF coqui/XTTS-v2](https://huggingface.co/coqui/XTTS-v2)
- Spark-TTS-0.5B: cc-by-nc-sa-4.0 — [HF SparkAudio/Spark-TTS-0.5B](https://huggingface.co/SparkAudio/Spark-TTS-0.5B)
- OmniVoice (k2-fsa, Mar 2026): "code is released under the Apache 2.0 License. The pre-trained model is licensed under the CC-BY-NC due to constraints from its training data (e.g., Emilia)" — [HF k2-fsa/OmniVoice](https://huggingface.co/k2-fsa/OmniVoice)
- Higgs TTS 3 4B (Boson AI, Jun 2026): "boson-higgs-tts-3-research-and-non-commercial-license"; Higgs TTS 2 3B base licence "other" (not inspected) — [HF bosonai org](https://huggingface.co/bosonai)
- Fish Audio Drama 3 (Oct 2026) and S2 Pro (Mar 2026): "fish-audio-research-license" — [HF fishaudio/drama-3](https://huggingface.co/fishaudio/drama-3); [HF fishaudio/s2-pro](https://huggingface.co/fishaudio/s2-pro). Artificial Analysis reportedly lists Drama 3 as "open weights, not open source, with no full commercial-use rights" — via [search summary of orcarouter.ai](https://www.orcarouter.ai/blog/fish-audio-drama-3-tops-both-speech-arenas)
- Breeze-TTS-2 (BreezeBlue, Aug 2026): "breezeblue-research-and-non-commercial-license" — [HF BreezeBlue/Breeze-TTS-2](https://huggingface.co/BreezeBlue/Breeze-TTS-2)
- Phonon 40M en / multilingual (Gradium, Oct 2026): cc-by-nc-4.0 (only the 31M English model is Apache) — [HF gradium/phonon-40m-en](https://huggingface.co/gradium/phonon-40m-en)

### Inferences
- The "best-ranked" open models of late 2026 are mostly non-commercial, so a monetised channel has to choose from a narrower commercial-safe set: Kokoro, Phonon 31M, Kitten TTS 2 Mini, ZONOS3-Mini, Chatterbox family, Ming-3.0-tts, Qwen3-TTS, VoxCPM2, Pocket TTS (with credit) and Supertonic 3 (with use restrictions).
- Pocket TTS CC-BY-4.0 means a credit line such as "Narration generated with Kyutai Pocket TTS (CC BY 4.0)" in the video description should satisfy attribution; pick a CC0 or CC-BY voice, never an Expresso voice.
- Chatterbox being retired (Aug 2026) and Supertonic archived means no bug fixes; fine for offline generation but a risk if dependencies drift.

### Gaps
- Orpheus and Sesame CSM are built on Meta Llama 3.2 backbones; whether the Llama 3.2 Community Licence also applies to their weights was not checked this session.
- Piper voices: each voice's MODEL_CARD names its dataset licence; per-voice licences (e.g. lessac, ljspeech, jenny_dioco, alan) were not verified this session. Check each voice's MODEL_CARD before monetised use.
- VibeVoice: I did not re-verify reports (from before this session) that Microsoft withdrew the GitHub repo in 2025 over misuse and recommends research-only use; the HF licence field is MIT.
- XTTS-v2: the CPML text itself was not fetched; it is widely described as non-commercial, and Coqui (the company that could sell commercial licences) shut down in early 2024 (not re-verified here).
- Higgs Audio v2 (generation 3B base) licence could not be retrieved (repo name changed / not public under the old ID).

## 2. Realism rankings: which open models come closest to ElevenLabs?

### Takeaway
On public arenas the top hosted models (Cartesia Sonic 3.5, ElevenLabs v3, Inworld) still lead; the strongest open weights (Fish Audio Drama 3, Breeze TTS 2) are non-commercial. Among commercial-safe models, Ming-3.0-tts (MIT) ranks highest on Artificial Analysis, then Phonon 31M (Apache); Kokoro and Chatterbox sit roughly level with each other, well below the leaders. I could not open the leaderboards directly, so all Elo figures are second-hand.

### Cited Findings
- Artificial Analysis open-weights Provider Voice Arena (snapshot date not shown in the search summary): 1 Fish Audio Drama 3 (Elo 1281), Drama 3 Preview (1236), Breeze TTS 2 (1231), Ming-3.0-tts (1182), Phonon 31M English (1108) — via search summary of [Artificial Analysis open-weights leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice/open-weights) (page not directly reachable)
- An Oct 2026 report gave Fish Audio Drama 3 Preview as best open model (1245) and "Ming-3.0-tts as the leading model a company can ship freely, at 1188", with Kokoro at 1061 and Chatterbox at 1023 — via search summary of third-party blogs (e.g. [lukeocodes.dev](https://lukeocodes.dev/open-weights-eating-ai-best-open-tts-models), [texttolab.com](https://texttolab.com/blog/open-source-text-to-speech)); exact source page not confirmed
- Artificial Analysis "Controlled Voice Arena" (same 8 cloned voices, 2 US male, 2 US female, 2 UK male, 2 UK female; 1–2 minute samples): top overall Cartesia Sonic 3.5 (1,122), ElevenLabs Eleven v3 (1,088), Inworld Realtime TTS-2 preview (1,070); open-weight leaders Fish Audio S2 Pro (1,034), Mistral Voxtral TTS (1,024), Resemble AI Chatterbox (930) — [Wes Roth on X, summarising Artificial Analysis](https://x.com/WesRoth/status/2075248621797384271) (approx. July 2026). A later write-up puts Drama 3 12th on that arena at 1,085 — [orcarouter.ai](https://www.orcarouter.ai/blog/fish-audio-drama-3-tops-both-speech-arenas)
- Hugging Face TTS Arena (Oct 2026, per a blog): now mostly hosted APIs; Kokoro 32nd at Elo 1464 and no longer collecting votes; another blog puts Chatterbox 28th of 39 at 1481, statistically level with Kokoro (1478 ±22 vs 1481 ±19) — via search summary of [ocdevel.com](https://ocdevel.com/blog/20250720-tts), [pinggy.io](https://pinggy.io/blog/best_open_source_self_hosted_text_to_speech_models/), [tts.ai](https://tts.ai/tts-arena/)
- Gradium's own blind pairwise test (US English, 468 raters, 8,290 votes): phonon-40m-en 2117, phonon-31m-en 2098, Kokoro 2043, NeuTTS 2034, Magpie 1939; hard-sentence (numbers/dates) LLM-WER: Phonon 31M 1.5% vs Kokoro 3.5% vs NeuTTS 8.7% — [HF gradium/phonon-31m-en](https://huggingface.co/gradium/phonon-31m-en) (vendor-run benchmark)
- Kokoro's own voice grades (author-assigned): American female af_heart "A", af_bella "A-", af_nicole "B-"; American male best am_fenrir / am_michael / am_puck "C+"; British female bf_emma "B-", bf_isabella "C"; British male bm_george and bm_fable "C", bm_lewis "D+", bm_daniel "D" — [HF hexgrad/Kokoro-82M VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)

### Inferences
- No commercial-safe CPU model is at ElevenLabs level. The realistic CPU tier (Kokoro, Phonon 31M, Kitten 2 Mini, Pocket TTS, Supertonic 3) is "good audiobook-ish" rather than expressive-documentary quality; GPU models (Ming-3.0-tts, Qwen3-TTS, VoxCPM2, Chatterbox Turbo) are a step closer.
- Kokoro's weakest area is exactly the user's need for a male documentary narrator: its male voices are graded C+ or below, its best voice is American female.

### Gaps
- No direct access to the live Artificial Analysis or TTS Arena pages; no snapshot dated November 2026 was confirmed. Where Kitten TTS 2 Mini (13 Nov 2026), ZONOS3-Mini (9 Nov 2026) and Pocket TTS rank is unknown.
- No independent blind test focused on long-form documentary narration was found.

## 3. CPU feasibility (disk, RAM, speed, ONNX/quantised builds)

### Takeaway
Under the user's limits (CPU only, ~8 GB RAM, <2 GB weights), the strong fits are Kokoro (86–327 MB), Phonon 31M (55–103 MB), Kitten TTS 2 Mini (47–83 MB ONNX), Pocket TTS (~100M params, 2 CPU cores, ~6x real-time), Supertonic 3 (~394 MB ONNX) and Piper. Chatterbox-Nano fits only just (~1.9 GB) and needs a reference clip. Qwen3-TTS, VoxCPM2, Ming-3.0-tts, Orpheus, Dia2, Higgs etc. are GPU-class.

### Cited Findings
- Kokoro: PyTorch weights kokoro-v1_0.pth 327 MB (repo 363 MB total) — [HF hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M). ONNX builds: fp32 326 MB, fp16 163 MB, uint8 177 MB, quantized 92 MB, q8f16 86 MB — [HF onnx-community/Kokoro-82M-v1.0-ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX)
- Phonon 31M: 31M params (excluding the Mimi audio tokenizer); model.q4k.gguf 55 MB, model.q8.gguf 65 MB, safetensors 103 MB; designed to run "in a browser tab, on a phone, or on a laptop CPU"; ~100 voices in gradium/phonon-voices — [HF gradium/phonon-31m-en](https://huggingface.co/gradium/phonon-31m-en)
- Kitten TTS 2 Mini: ONNX int8 82.7 MB or int4 47.5 MB, "both run on CPU" — [HF KittenML/kitten-tts-2-mini](https://huggingface.co/KittenML/kitten-tts-2-mini)
- Pocket TTS: "designed to run efficiently on CPUs", 100M params (English models down to 1.9M), "~6x real-time on a CPU of MacBook Air M4", "Uses only 2 CPU cores", voice cloning; README has a "CPU-only installation" section for Linux "to avoid pulling in the CUDA build of PyTorch"; Oct 2026 small English variants of 18.2M, 6.9M and 1.9M params — [GitHub kyutai-labs/pocket-tts](https://github.com/kyutai-labs/pocket-tts); blog [kyutai.org 2026-01-13](https://kyutai.org/blog/2026-01-13-pocket-tts)
- Supertonic 3: ~99M params across ONNX assets (text_encoder 36 MB, vector_estimator 257 MB, vocoder 101 MB); "runs fast on CPU... It does not require a GPU"; fixed preset voice styles (e.g. "M1") — [HF Supertone/supertonic-3](https://huggingface.co/Supertone/supertonic-3)
- Chatterbox-Nano: 110M params, "3x faster than realtime on 8 cores", English, CPU supported; files t3_nano_v1 870 MB + s3gen ~1,056 MB (≈1.9 GB); "requires a reference clip for voice cloning" — [HF ResembleAI/chatterbox-nano](https://huggingface.co/ResembleAI/chatterbox-nano)
- Chatterbox-Turbo: 350M, files ~1.9 GB T3 + ~1 GB S3Gen; ONNX version with q4 shards (e.g. conditional_decoder_q4 246 MB, embed_tokens_q4 37 MB, language model larger) — [HF ResembleAI/chatterbox-turbo](https://huggingface.co/ResembleAI/chatterbox-turbo); [HF chatterbox-turbo-ONNX](https://huggingface.co/ResembleAI/chatterbox-turbo-ONNX). Chatterbox-Flash's ~9–13x real-time relies on FlashInfer/CUDA graphs (GPU) — [HF ResembleAI/chatterbox-flash](https://huggingface.co/ResembleAI/chatterbox-flash)
- NeuTTS Air: model.safetensors 1,496 MB, BF16 GGUF 1,504 MB — [HF neuphonic/neutts-air](https://huggingface.co/neuphonic/neutts-air)
- ZONOS3-Mini: GGUF backbone 663 MB but full CPU stack also lists zac.gguf 2,200 MB, ssl-teacher 1,549 MB, zac-encoder 4,035 MB etc. (repo ~31 GB in all); "runs in real time on phones and laptops"; browser build uses WebGPU (GPU) — [HF Zyphra/ZONOS3-Mini](https://huggingface.co/Zyphra/ZONOS3-Mini)
- Qwen3-TTS 0.6B Base: 1,829 MB + 682 MB tokenizer (~2.5 GB); a blog notes the 1.7B needs a 6 GB+ GPU — [HF Qwen3-TTS-12Hz-0.6B-Base](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base); search summary of [openvoxai.com](https://openvoxai.com/blog/best-free-local-tts-models-2026)
- Ming-3.0-tts-0.5B: model.safetensors 2,959 MB; inference requires the GitHub repo — [HF inclusionAI/Ming-3.0-tts-0.5B](https://huggingface.co/inclusionAI/Ming-3.0-tts-0.5B)
- VoxCPM2: 4,580 MB + 377 MB VAE; quoted RTF ~0.3 on an RTX 4090 — [HF openbmb/VoxCPM2](https://huggingface.co/openbmb/VoxCPM2)
- Audio8 Realistic Air: model 1.2 GB + codec 1.35 GB; llama.cpp F32 bundle ~3.7 GB; tested on NVIDIA H20 — [HF Edge0/Audio8-TTS-Realistic-Air](https://huggingface.co/Edge0/Audio8-TTS-Realistic-Air)
- OmniVoice claims RTF 0.025 but is CC-BY-NC — [HF k2-fsa/OmniVoice](https://huggingface.co/k2-fsa/OmniVoice)

### Inferences
- For PyTorch-based models (Kokoro .pth, Pocket TTS, Chatterbox), install the CPU-only PyTorch wheel (`pip install torch --index-url https://download.pytorch.org/whl/cpu`, roughly 200 MB versus multi-GB CUDA builds) to stay within the disk budget. ONNX/GGUF routes (Kokoro ONNX, Kitten 2 Mini ONNX, Phonon GGUF, Supertonic ONNX) avoid PyTorch entirely.
- On an 8 GB box, all of Kokoro, Phonon 31M, Kitten 2 Mini, Pocket TTS and Supertonic 3 should leave plenty of headroom; Chatterbox-Nano should run but slower and closer to the disk limit.
- For long documentaries, generate paragraph by paragraph and concatenate; small models are fast enough that a 20-minute script should render in minutes on CPU (inferred from the real-time factors above, not measured).

### Gaps
- No measured RAM figures or x86 Linux real-time factors were found for Phonon 31M, Kitten 2 Mini, Supertonic 3 or ZONOS3-Mini; Pocket TTS's 6x figure is on Apple M4.
- Exact minimal CPU file set for ZONOS3-Mini was not determined.

## 4. Voice cloning: which models can clone, and the limits

### Takeaway
Zero-shot cloning from a short clip is available in Pocket TTS, Chatterbox (all variants; Nano needs a clip), ZONOS3-Mini, Qwen3-TTS, VoxCPM2, Ming-3.0-tts, Audio8, Kitten TTS 2 (1.7B), NeuTTS Air and Zonos v0.1. Kokoro, Phonon 31M (locally), Kitten 2 Mini, Supertonic 3 (open package) and Piper use fixed built-in voices. Only clone your own voice or one you have written consent/licence for.

### Cited Findings
- Kitten TTS 2 clones "from 5-30 seconds of a single speaker" — [HF KittenML/kitten-tts-2](https://huggingface.co/KittenML/kitten-tts-2)
- Pocket TTS lists voice cloning as a feature — [GitHub kyutai-labs/pocket-tts](https://github.com/kyutai-labs/pocket-tts)
- Phonon: "Instant voice cloning and voice design are available through the Gradium studio" (not in the open package); card warns not "to clone a voice without the speaker's consent. Tell listeners when speech is synthetic" — [HF gradium/phonon-31m-en](https://huggingface.co/gradium/phonon-31m-en)
- Supertonic 3: "The open-weight package includes fixed preset voice styles"; zero-shot custom voices shown only in a demo — [HF Supertone/supertonic-3](https://huggingface.co/Supertone/supertonic-3)
- Ming-3.0-tts: cloning and built-in voices are "for research and legitimate creative use. Do not use them to impersonate a real person without consent" — [HF inclusionAI/Ming-3.0-tts-0.5B](https://huggingface.co/inclusionAI/Ming-3.0-tts-0.5B)
- OmniVoice: "Users are strictly prohibited from using this model for unauthorized voice cloning, voice impersonation, fraud..." — [HF k2-fsa/OmniVoice](https://huggingface.co/k2-fsa/OmniVoice)
- StyleTTS2 pretrained models: only use voices whose speakers grant permission, or disclose synthesis — [GitHub yl4579/StyleTTS2](https://github.com/yl4579/StyleTTS2)
- Chatterbox outputs are watermarked (PerTh), so cloned audio is detectable — [GitHub resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)
- Licensed reference voices: Kyutai's tts-voices repo has CC0 donated voices and CC-BY VCTK voices that are usable as cloning references commercially (with credit for CC-BY); Expresso voices are NC — [HF kyutai/tts-voices](https://huggingface.co/kyutai/tts-voices)

### Inferences
- Safest options: a built-in voice whose licence is the model's own (Kokoro, Phonon 31M, Kitten 2 Mini voice packs are all Apache 2.0), your own recorded voice, or a CC0/CC-BY reference voice. Never clone a famous narrator (e.g. Attenborough-style imitation of a real person) — likely to breach consent rules, platform policy and personality/publicity rights.
- Disclose synthetic narration. YouTube asks creators to label realistic altered/synthetic content in some cases; a description note is low-cost (YouTube policy specifics not researched here).

### Gaps
- YouTube's current (Nov 2026) AI-disclosure and "inauthentic/mass-produced content" monetisation rules were not researched in this scope.

## 5. Free tiers of hosted services and edge-tts

### Takeaway
ElevenLabs, Cartesia and Fish Audio free tiers do not permit commercial use. Google Cloud TTS free monthly allowance is the clearest free hosted option for commercial output (needs a billing account). Azure's free F0 tier has conflicting forum answers on commercial output rights. edge-tts is an unofficial wrapper around Edge's read-aloud service with no licence granting commercial rights, so it is risky for a monetised channel.

### Cited Findings
- ElevenLabs official help: the free plan "does not include a commercial license and cannot be used for any commercial purpose"; content created outside a paid subscription "cannot be used commercially and always requires attribution when shared non-commercially" — [ElevenLabs help: Can I publish the content I generate?](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform) (via search summary); third-party guides say putting free-plan audio in a monetised YouTube video violates the terms — [licenseorg.com](https://licenseorg.com/blog/elevenlabs-licensing-guide-ai-voices)
- Google Cloud TTS: reported ~4M Standard characters/month free and ~1M WaveNet/Neural2; billing must be enabled — via search summary of [novita.ai](https://blogs.novita.ai/best-text-to-speech-api-2026/) and [artifilog.com](https://www.artifilog.com/posts/free-ai-voice-api-2026) (secondary sources)
- Azure AI Speech F0: reported 500K neural characters/month; a 2026 Microsoft Q&A thread quotes Product Terms granting output use rights to "customers of the paid tier TTS Service only" and advises a paid resource for YouTube narration, while another answer says free-tier audio is usable commercially — conflicting; via search summary of [Microsoft Q&A 5805156](https://learn.microsoft.com/en-us/answers/questions/5805156/please-clarify-the-conflicting-information-regardi) (page not reachable directly)
- edge-tts: README says it uses "Microsoft Edge's online text-to-speech service" without Edge, Windows or an API key, and that "Microsoft prevents the use of any SSML that could not be generated by Microsoft Edge itself" — [GitHub rany2/edge-tts](https://github.com/rany2/edge-tts). A Microsoft Q&A reply warns commercial use of proprietary services without a valid Azure subscription "could be a violation of our terms of service"; no official Microsoft statement approving edge-tts for monetised YouTube was found — via search summary of [Microsoft Q&A 2088770](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)
- Cartesia: free tier (~10–20K credits/month) described as evaluation-only; commercial licence starts at the paid Pro tier (~$5/month) — via search summary of secondary blogs ([novita.ai](https://blogs.novita.ai/best-text-to-speech-api-2026/), [artifilog.com](https://www.artifilog.com/posts/free-ai-voice-api-2026))
- Fish Audio: free tier reported as personal-use only; commercial requires paid plan (~$11–15/month) — via search summary of secondary blogs (same as above)
- Hume: ~10,000 characters/month free; no source found stating whether commercial use is allowed — via search summary (secondary)
- Gemini TTS free tier for monetised YouTube was asked about on Google's developer forum; answer not retrieved — [discuss.ai.google.dev thread](https://discuss.ai.google.dev/t/can-i-use-free-tier-gemini-tts-audio-in-monetized-youtube-videos/196204)

### Inferences
- For a zero-cost, licence-clean pipeline, local open-weight models are safer than hosted free tiers; Google Cloud's free allowance is the hosted fallback (Neural2/WaveNet/Chirp voices are higher quality than most CPU models, but billing details and current Chirp 3 HD free quotas need checking).
- edge-tts should be treated as "not licensed for commercial use": a channel could lose its audio or face a claim if Microsoft enforces.

### Gaps
- PlayHT: status not checked this session (it was reported shut down after acquisition in 2025, not re-verified).
- Official Google Cloud and Azure pricing/terms pages and Hume/Cartesia/Fish terms pages could not be opened directly; figures above are secondary.

## 6. Ranked recommendation for this setup, and best male/female British/American narrators

### Takeaway
For CPU-only, 8 GB RAM, <2 GB disk and commercial use: (1) Kokoro-82M as the proven default (best for American female af_heart / af_bella; British female bf_emma); (2) Phonon 31M as the strongest new challenger (vendor tests beat Kokoro; Apache incl. voices; ~65 MB); (3) Kitten TTS 2 Mini for its narrator-styled voice packs (brand new, unproven); (4) Pocket TTS with a CC0/CC-BY or own-voice reference for a better male/British narrator (credit Kyutai). Chatterbox-Nano is the fallback if you have a consented reference voice. Avoid edge-tts and free hosted tiers for monetised use.

### Cited Findings
- Ranking inputs: licences and sizes in sections 1 and 3; Phonon 31M Elo 2098 vs Kokoro 2043 (vendor test) and AA open-weights Elo 1108 — [HF gradium/phonon-31m-en](https://huggingface.co/gradium/phonon-31m-en); search summary of [Artificial Analysis open weights](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice/open-weights)
- Kokoro voice grades: female US af_heart (A), af_bella (A-); female UK bf_emma (B-); male US am_michael / am_fenrir / am_puck (C+); male UK bm_george / bm_fable (C) — [HF hexgrad/Kokoro-82M VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)
- Kitten TTS 2 Mini English voices include "Eleanor – Somber historian (female)", "Martha – Weathered radio journalist (female)", "Iris – Hushed museum guide (female)", "Vincent – Hushed museum guide (male)", "Otis – Rumbling blues musician (male)", "Danny – Cheerful podcast host (male)" — [HF KittenML/kitten-tts-2-mini](https://huggingface.co/KittenML/kitten-tts-2-mini)
- Ming-3.0-tts recommends built-in "UK_George" and "US_Emma" voices (GPU-class, 3 GB) — [HF inclusionAI/Ming-3.0-tts-0.5B](https://huggingface.co/inclusionAI/Ming-3.0-tts-0.5B)
- Piper offers British voices (en_GB-alan, alba, cori-high, jenny_dioco, northern_english_male, southern_english_female) at very low compute — [HF rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices)

### Inferences
Suggested ranking (realism × licence × fits CPU/8 GB/<2 GB):
1. **Kokoro-82M** (Apache 2.0, v1.0, ~86–327 MB). Best proven; strongest for female voices. Female US: af_heart; female UK: bf_emma. Male US: am_michael or am_fenrir (weaker). Male UK: bm_george / bm_fable (weakest point).
2. **Phonon 31M English** (Gradium, Oct 2026, Apache 2.0 including voices, 55–103 MB). Likely the most realistic commercial-safe CPU model on current evidence; US English only (no British model confirmed); audition its ~100 voices for a male narrator.
3. **Kitten TTS 2 Mini** (13 Nov 2026, Apache 2.0, 47–83 MB ONNX). Voice packs explicitly styled for narration ("Somber historian", "museum guide"); worth an A/B test, but no third-party ranking yet.
4. **Pocket TTS** (Kyutai, Jan 2026 + Oct 2026 updates, CC-BY 4.0, ~100M, CPU). Cloning lets you use your own voice or a CC0/CC-BY reference voice for a deeper male or British narrator; add attribution; avoid Expresso NC voices.
5. **Supertonic 3** (May 2026, OpenRAIL-M, ~394 MB ONNX). Fast on CPU; preset voices only; use restrictions; reportedly archived.
6. **Chatterbox-Nano** (Apr 2026, MIT, ~1.9 GB, 3x RT on 8 cores). Expressive Chatterbox quality on CPU, but requires a reference clip, project retired, output watermarked.
7. **ZONOS3-Mini** (9 Nov 2026, Apache 2.0). Promising (cloning, accent design, 43 languages) but CPU file set is large and it is untested by third parties.
8. **Piper / MeloTTS / Soprano** (MIT/Apache, tiny). Fallbacks; noticeably more synthetic for long narration.
- GPU-only, commercial-safe, closest to ElevenLabs if hardware is upgraded or a free GPU (e.g. Colab/Kaggle) is used: Ming-3.0-tts (MIT), Qwen3-TTS (Apache), VoxCPM2 (Apache), Chatterbox Turbo (MIT), Audio8 Realistic Air (Apache), Dia2 (Apache).
- Do not use for monetised work: F5-TTS, XTTS-v2, Spark-TTS, OmniVoice, Fish Drama 3 / S2 Pro, Higgs TTS 3, Breeze TTS 2, Phonon 40M, ElevenLabs/Cartesia/Fish free tiers; edge-tts is a licence risk.
- Practical tip: whichever model, post-process (light EQ, compression, room reverb, background music bed) and split scripts into sentences/paragraphs to avoid long-form drift; test a 2–3 minute sample of each top candidate with the same script before committing.

### Gaps
- No direct listening test was done in this research; the ranking of 2–4 is based on vendor benchmarks and model cards, not independent long-form evaluations.
- No commercial-safe CPU model with a confirmed high-quality British male voice was found; Pocket TTS cloning from a licensed British reference (e.g. a CC0 donated voice or your own) is the likely workaround but unverified.
