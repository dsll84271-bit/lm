# Free tiers of hosted/commercial TTS services for monetised YouTube narration (as of 26 Nov 2026)

**Method note (read first):** In this session, WebFetch could not reach `ai.google.dev` or `artificialanalysis.ai` (DNS blocked by the session's network allowlist). Everything below comes from WebSearch result summaries, which pull from official pages (cited where they did) plus third-party trackers. I could not read Google's official pricing, rate-limit and terms pages, or the live Artificial Analysis leaderboard, in full. Several numbers conflict between sources, and each conflict is flagged. Check the official pages before relying on any of this.

**Usage assumed:** one ~8-minute English documentary narration is about 1,100–1,300 words, roughly 6,500–8,000 characters. "A few videos a month" (3–5) comes to about 20,000–40,000 characters a month. (My estimate, not from a source.)

---

## 1. Google: Gemini TTS (AI Studio and the Gemini API free tier), plus Google Cloud TTS

### Takeaway
Gemini TTS is the strongest option that is free and plausibly licensed for commercial use. Google's Gemini API terms say Google does not claim ownership of generated output, and the current GA models (Gemini 3.8 Flash TTS / Flash-Lite TTS) are reported as free in AI Studio and on the API free tier. The catches: free-tier quotas are not published (you see them only inside your AI Studio project), free-tier text may be used by Google and read by human reviewers, and the older preview TTS models are being shut down right about now. Google Cloud Text-to-Speech separately gives 1M free Chirp 3: HD characters a month, many times what this channel needs, but it needs a billing account.

### Cited Findings
**Models and lifecycle**
- Google's release notes date Gemini 3.8 Flash TTS and Gemini 3.8 Flash-Lite TTS going GA, along with a Voices endpoint (`/v1beta/voices`), to 22 Sept 2026. — [Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog) (via search summary)
- According to the speech-generation docs, `gemini-3.8-flash-tts` supports single-speaker, multi-speaker (up to 2 speakers with prebuilt voices), voice design and voice replication. The code samples use the prebuilt voice "Kore". — [Gemini API TTS docs](https://ai.google.dev/gemini-api/docs/speech-generation)
- The deprecations page lists `gemini-3.1-flash-tts-preview`, `gemini-2.5-flash-preview-tts` and `gemini-2.5-pro-preview-tts` with a **17 Nov 2026** shutdown and names 3.8 Flash TTS / Flash-Lite TTS as replacements. — [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations). **Conflicts:** a 18 Sept release note reportedly says the 2.5 models "will continue to be served until further notice" ([changelog](https://ai.google.dev/gemini-api/docs/changelog)), and a third-party guide gives **18 Dec 2026** as the shutdown date ([invideo](https://invideo.io/blog/gemini-tts-ai-voice/)). In practice, plan on 3.8 Flash TTS.
- The 3.8 models are not available through the Cloud Text-to-Speech API. — [Google Cloud migration guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/text-to-speech/migration-guide)
- 3.8 is described as turning the 30 preset voices into a library of 2,000+ voices shaped by text prompts, with native two-speaker dialogue. — [ki-blog.mrn.one](https://ki-blog.mrn.one/en/posts/gemini-3-8-flash-tts-ai-voices/); [mer.vin](https://mer.vin/news/gemini-3-8-tts-2000-voices-and-native-two-speaker-dialogue/)
- Voice cloning (replication) needs a 30-second sample plus a spoken consent recording, and is not offered in AI Studio in the EEA, UK or Switzerland. — [arwriterai](https://arwriterai.com/en/blog/gemini-3-8-flash-tts-voice-studio-2026/)
- Anecdotal: some developers on the official forum say 3.8 voices sound flatter and less expressive than 3.1. — [Google AI Developers Forum](https://discuss.ai.google.dev/t/gemini-3-8-tts-voice-is-a-downgrade-for-personal-assistant-and-companion-apps/184911). Other forum posts report that 2.5 Pro TTS regressed with "micro-cuts and broken phonemes". — [forum](https://discuss.ai.google.dev/t/gemini-2-5-pro-tts-has-regressed-frequent-micro-cuts-and-broken-phonemes-make-it-unusable/187369)

**Is it free? Quotas**
- Several sources say both 3.8 Flash TTS and Flash-Lite TTS are free on the Gemini API free tier and in AI Studio, needing only a Google account. — [projedefteri](https://projedefteri.com/en/blog/is-gemini-3-8-tts-free/); [aitoolanalysis](https://aitoolanalysis.com/google-ai-studio-text-to-speech-review/)
- The free tier is rate-limited, and the free quota is "capped and not guaranteed to stay available". — [recaply](https://recaply.co/tools/gemini-3-8-flash-tts); [ki-blog.mrn.one](https://ki-blog.mrn.one/en/posts/gemini-3-8-flash-tts-ai-voices/)
- Free-tier rate limits are not in a public table. They "now live inside your AI Studio project". — [nemovideo](https://www.nemovideo.com/blog/gemini-3-1-flash-tts-pricing); [Gemini rate limits page](https://ai.google.dev/gemini-api/docs/rate-limits) (search summary: free-tier limits depend on the project, and preview models are more restricted)
- An unofficial community table lists Gemini 2.5 Flash Preview TTS at 3 RPM / 10,000 TPM / 15 RPD on the free tier. Not verified against Google. — [glama.ai mirror](https://glama.ai/mcp/servers/@PSYGER02/mcpserver/blob/5d77f6d5c7534750b9ff561f4272e2e2c111822d/MD%20files/API%20MODEL%20RATE%20LIMIT.md)
- Paid 3.8 Flash TTS pricing (for reference only; sources conflict): $0.50/M text-in and $9/M audio-out until 31 Dec 2026, then $1/$18 ([progressiverobot](https://www.progressiverobot.com/2026/09/23/gemini-3-8-flash-tts-flash-lite-tts-ai-studio/)); $1/$18 standard, half price for batch ([recaply](https://recaply.co/tools/gemini-3-8-flash-tts)).

**Terms and commercial use of free-tier output**
- Gemini API Additional Terms on generated content: Google "won't claim ownership over that content" but may produce the same or similar output for others. Users must follow applicable law and are responsible for their use of the output. — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms) (search summary of the live page)
- Unpaid Services (AI Studio and the unpaid API quota): Google may use prompts and responses to improve products, and human reviewers may read them. Don't submit sensitive or personal information. Paid services don't use data this way. — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
- The terms aim the service at developers "for professional or business purposes, not for consumer use". In the EEA, Switzerland and the UK, you may only make API clients available to users through *Paid* Services. — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
- Secondary sources disagree on whether free-tier output may be used commercially. Some say yes, since the free tier limits volume and not the licence. One claims the free tier "explicitly excludes commercial use". — [terms.law](https://terms.law/ai-output-rights/gemini/); [publicapis.io](https://publicapis.io/blog/is-gemini-api-free-lwle); [freetier.wiki](https://freetier.wiki/tools/gemini-api/)
- Forum users point to a clause in the general Google APIs Terms restricting sale or distribution of content returned by APIs "unless the content owner or law permits". This is a user question, not official guidance. — [forum: Lyria commercial SaaS](https://discuss.ai.google.dev/t/clarification-required-commercial-saas-application-using-lyria-api-generated-music-distribution-rights/197753); [forum: Lyria YouTube rights](https://discuss.ai.google.dev/t/commercial-use-and-youtube-publishing-rights-for-lyria-3-5-music-generated-via-paid-gemini-api/189157)

**Controllability**
- Gemini TTS takes a natural-language style prompt that says *how* to perform a line, plus inline tags for pauses, whispers, laughter and similar. — [mindstudio](https://www.mindstudio.ai/blog/gemini-3-1-flash-tts-controllable-text-to-speech); [buildfastwithai](https://www.buildfastwithai.com/blogs/gemini-3-1-flash-tts-google-ai-voice-model-2026)
- 30 prebuilt voices (3.1 era), 70–90+ languages (sources disagree), multi-speaker. — [mindstudio](https://www.mindstudio.ai/blog/gemini-3-1-flash-tts-review); [invideo](https://invideo.io/blog/gemini-tts-ai-voice/)

**Realism (leaderboard)**
- A cached Artificial Analysis page showed Gemini 3.1 Flash TTS leading the Speech Arena at 1214 Elo (an older snapshot). A later AA article said Alibaba's Fun-Realtime-TTS overtook Gemini 3.1 Flash TTS (about 176 days old). — [AA leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard); [AA article](https://artificialanalysis.ai/articles/fun-realtime-tts-new-text-to-speech-model-topping-artificial-analysis-leaderboard)
- I could not get the current Elo or rank for Gemini 3.8 Flash TTS (see section 7).

**Google Cloud Text-to-Speech (separate product)**
- The official pricing page gives Chirp 3: HD voices 0–1 million characters a month free, then $30 per 1M characters. — [Google Cloud TTS pricing](https://cloud.google.com/text-to-speech/pricing?hl=en)
- Other free allowances: 4M characters a month for Standard, 1M for WaveNet and Neural2. The free tier needs a billing account and charges only above the limit. Allowances are tracked per voice tier. — [texttolab](https://texttolab.com/blog/google-cloud-tts-pricing); [openapipricing](https://openapipricing.com/blog/tts/google-cloud-text-to-speech)
- Cloud TTS also offers Gemini TTS (`gemini-2.5-flash-tts`, 150 QPM quota), but not 3.8. — [Cloud TTS quotas](https://docs.cloud.google.com/text-to-speech/quotas); [Gemini-TTS on Cloud](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts)

### Inferences
- About 30k characters a month fits comfortably inside Cloud TTS's 1M free Chirp 3: HD characters. Cloud TTS is a paid, commercial Google Cloud service with a free allowance, so commercial use is covered by the normal Cloud terms. It is the most clearly licensed "free" Google route, but needs a billing account (card) and carries a risk of charges if you go over.
- AI Studio / Gemini API free-tier output: Google disclaims ownership and the terms target "professional or business purposes", which suggests commercial use is allowed. But no source quoted an explicit "commercial use permitted on the free tier" clause, and blogs disagree. Treat it as *probably allowed, not confirmed*. The free tier is also unavailable for serving users in the EEA/UK/CH, though for one creator generating their own narration that clause is about "making API Clients available to users", so it probably doesn't apply. This is unclear.
- With the 2.5/3.1 previews shutting down in Nov–Dec 2026, any narration workflow built on `gemini-2.5-flash-preview-tts` or `gemini-3.1-flash-tts-preview` should move to `gemini-3.8-flash-tts`.
- Gemini narration should be generated in chunks (a paragraph or two at a time), given the small per-day request quotas reported for preview TTS models and the reported audio glitches in long generations.

### Gaps
- Exact free-tier RPM/RPD for 3.8 Flash TTS: not published, visible only in AI Studio.
- Which male voices suit documentary narration best: I found no source naming them (e.g. Charon, Orus, Fenrir, Iapetus, Algenib were not confirmed by any result). The 3.8 voice list (`/v1beta/voices`) was not retrievable.
- The full output and commercial clause of the Gemini API terms (couldn't fetch ai.google.dev).
- Current AA arena rank for Gemini 3.8 Flash TTS.

---

## 2. Microsoft: Azure AI Speech F0, plus Edge Read Aloud / edge-tts

### Takeaway
Azure's free F0 tier (500,000 neural TTS characters a month, no expiry) is a properly licensed commercial service and covers this channel's volume about 12 times over, but reportedly *excludes* the newer HD voices. edge-tts and Edge Read Aloud have no published commercial licence, and Microsoft forum staff say commercial use without an Azure subscription "could be a violation of our terms". Avoid it for monetised videos.

### Cited Findings
- Azure Speech F0 includes 500,000 characters a month of neural TTS, no expiry, limited to 20 requests per minute, plus 5 audio hours of STT. — [texttolab](https://texttolab.com/blog/azure-text-to-speech-pricing); [openapipricing](https://openapipricing.com/blog/tts/azure-ai-speech); [cartesia.ai comparison](https://www.cartesia.ai/learn/top-microsoft-azure-text-to-speech-alternatives)
- Neural HD voices are listed as "Not included" in the free allowance. Paid HD is about $22/1M characters (reportedly reduced from $30 in March 2026). Standard neural is about $15–16/1M. — [texttolab](https://texttolab.com/blog/azure-text-to-speech-pricing); [pyai](https://pyai.com/blog/azure-speech-pricing) (third-party, not Microsoft's own page)
- Edge / edge-tts: a Microsoft Q&A answer says Microsoft "does not currently publish documentation that explicitly grants commercial redistribution rights" for Edge Read Aloud / edge-tts audio. A Microsoft moderator said commercial use without a valid Azure subscription "could be a violation of our terms of service" and pointed to Azure AI Speech. A separate question about monetised YouTube got the same answer. — [Microsoft Q&A 6007729](https://learn.microsoft.com/en-us/answers/questions/6007729/commercial-use-of-microsoft-edge-text-to-speech-vi); [Microsoft Q&A 5925556](https://learn.microsoft.com/en-au/answers/questions/5925556/commercial-use-of-edge-read-aloud-voices-via-edge); [Microsoft Q&A 2088770](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)
- edge-tts is an unofficial client of Edge's online TTS endpoint. Third-party projects flag that the endpoint is "NOT for commercial use". The "free for personal and commercial use" FAQ on edge-tts.com covers only that website and is not a Microsoft licence. — [GitHub issue](https://github.com/seeb83ai/vocabulary_trainer/issues/609); [rany2/edge-tts discussion](https://github.com/rany2/edge-tts/discussions/261)

### Inferences
- Azure F0 with standard neural voices (e.g. en-US Andrew/Guy/Davis/Brian-type male voices) is a legitimate, genuinely free, commercially usable option at this volume. It needs an Azure account. Realism is a step below Gemini/ElevenLabs-class models (my judgement; no current arena number found).
- The same Microsoft voices are reachable through edge-tts for free, but the licence is the problem, not the sound.

### Gaps
- Microsoft's official pricing page text (whether F0 now includes HD / Dragon HD voices) was not confirmed directly.
- Azure's current arena Elo.

---

## 3. ElevenLabs free plan

### Takeaway
Not usable: the free plan has no commercial licence and requires "elevenlabs.io" / "11.ai" attribution in the title. It also leads the realism leaderboards (Eleven v4 / v4 Turbo).

### Cited Findings
- "The free plan does not include a commercial license and cannot be used for any commercial purpose." Publishing free-plan output requires attributing ElevenLabs by including "elevenlabs.io" or "11.ai" in the title. — [ElevenLabs help center](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform); [help.elevenlabs.io](https://help.elevenlabs.io/hc/en-us/articles/13313564601361)
- Free plan: 10,000 credits a month (one source says characters). Commercial rights start at Starter, about $5–6/month. — [saasworthy (Nov 2026)](https://www.saasworthy.com/product/elevenlabs-io/pricing); [bigvu](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/)
- Realism: Eleven v4 Turbo leads the AA provider-voice Speech Arena at about 1345 Elo, Eleven v4 second, StepFun StepAudio 3 TTS third at 1315 (released Nov 2026). An article dated 2 Nov 2026 gives Eleven v4 Turbo 1336, ahead of Qwen-Audio 3.1 TTS Plus (1305) and Cartesia Sonic 3.6. — [AA provider-voice leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice) (search snippet); [search summary of third-party article](https://scholarcompass.net/en/tasks/text-to-speech/benchmarks/artificial-analysis-provider-voice-tts-arena)

### Inferences
- 10k credits would cover roughly one 8-minute video a month anyway. Only the $5–6 Starter plan makes ElevenLabs viable, which falls outside "genuinely free".

### Gaps
- None material.

---

## 4. Other providers

### Takeaway
Of the others, only **Speechify's developer API free tier** (by Speechify's own statement) and **CapCut's TTS** (by CapCut's own product page, voice-dependent) claim free commercial use. Amazon Polly's free allowance is time-limited (12 months / AWS credits). Hume, Cartesia, Fish Audio, Murf, PlayHT and the ElevenLabs free tiers are all non-commercial. I found nothing showing free OpenAI TTS access.

### Cited Findings
**Speechify (SpeechifyAI developer API, Simba models)**
- Speechify's developer page: "The Free plan includes 500K characters a month with commercial use", no card required. — [speechify.ai TTS API](https://speechify.ai/text-to-speech-api). **Conflicts:** Speechify's pricing-api page, a Speechify blog and Capterra list a 50,000-character free tier ([speechify.com/pricing-api](https://speechify.com/pricing-api/)). One source says the Simba 3.5 free allowance drops from 500K to 250K after 21 Nov 2026 ([usagepricing](https://www.usagepricing.com/blueprint/speechify)).
- The consumer Speechify Studio free tier has no commercial rights. — [undetectr](https://undetectr.com/blog/ai-voice-generator-free)
- Realism: Speechify says Simba 3.x topped the AA leaderboard, and press reported it beating OpenAI and ElevenLabs in a blind test (July 2026). This is vendor-sourced. — [speechify.ai blog](https://speechify.ai/blog/simba-3-tops-artificial-analysis-tts-leaderboard); [propakistani](https://propakistani.pk/2026/07/11/speechifys-new-ai-voice-model-beats-openai-and-elevenlabs-in-blind-test/)

**CapCut TTS**
- CapCut's product page says audio from its AI TTS tool can be used commercially, including in YouTube videos, subject to CapCut's terms. — [CapCut TTS tool](https://www.capcut.com/tools/text-to-speech); [CapCut resource page](https://www.capcut.com/resource/text-to-speech-free-tools-for-commercial-use)
- The web TTS tool has a "Commercial License" filter. Free voices aren't automatically cleared, and CapCut music, templates and effects need separate clearance. — [dev.to](https://dev.to/jadenvo259/monetization-safe-text-to-speech-for-youtube-licences-youtubes-ai-rules-and-a-workflow-that-4n9); [trend-rays (critical blog)](https://trend-rays.com/capcut-commercial-license-youtube-copyright-strike/)

**Amazon Polly**
- From 15 July 2025, new AWS customers get up to $200 in Free Tier credits usable on Polly. The free plan lasts 6 months, and credits must be used within 12 months. — [AWS Polly page](https://aws.amazon.com/polly/)
- The 12-month allowances are commonly cited as about 5M Standard, 1M Neural, 500K Long-Form and 100K Generative characters a month. Sources disagree on whether Standard is ongoing. — [texttolab](https://texttolab.com/blog/is-amazon-polly-free); [cartesia.ai comparison](https://www.cartesia.ai/learn/top-amazon-polly-alternatives)

**Hume (Octave)**: Free plan is 10,000 characters a month, "non-commercial testing" only. The cheapest commercial plan is disputed ($3 Starter vs $14 Creator). — [autogpt.net](https://autogpt.net/hume-ai-pricing-every-plan-explained/); [texttolab](https://texttolab.com/blog/hume-ai-review)

**Cartesia (Sonic)**: Most sources say Free has no commercial licence (it starts at Pro, about $4–5/month), with 20K free credits. **Conflict:** a snippet of Cartesia's own pricing page reportedly lists "Commercial use license" under Free. — [Cartesia pricing](https://www.cartesia.ai/pricing); [texttolab](https://texttolab.com/blog/cartesia-pricing); [cloudtalk](https://www.cloudtalk.io/blog/cartesia-pricing/)

**Fish Audio**: Free plan output is for "personal, non-commercial projects". Open weights (fish-speech/S1/S2) need a paid commercial licence. — [smallest.ai](https://smallest.ai/blog/fish-audio-pricing-plans-api-billing-commercial-use-in-2026); [Fish Audio plans](https://beta.fish.audio/plan/)

**Murf**: Free plan gives 10 minutes, "No Downloads and No Commercial Rights". — [undetectr citing Murf pricing](https://undetectr.com/blog/ai-voice-generator-free)

**PlayHT**: Free is non-commercial with attribution required (5,000 words or 12,500 characters a month; sources differ). — [undetectr](https://undetectr.com/blog/ai-voice-generator-free); [aicentralresources](https://www.aicentralresources.com/blog/elevenlabs-vs-murf-vs-playht-ai-voice-2026)

### Inferences
- The Speechify API free tier, if the 500K/250K figure and the commercial-use statement hold, would cover this channel's volume and is the most promising "free and commercial" alternative to Google and Azure. Its contradictory figures mean the user should screenshot the plan terms on signup.
- CapCut works if the chosen voice carries the Commercial License tag, but its English male narrator voices are generally less natural than the Gemini/ElevenLabs class (my judgement; no arena data).
- Polly is free only for new AWS accounts for a limited period, so it's not a durable free option.

### Gaps
- OpenAI TTS: I found no evidence of free access (my search didn't cover it). OpenAI's API is pay-as-you-go as far as I know, but this is unverified here.
- Kokoro web demos: not researched (open-weights, Apache-2.0 model, likely covered by the local/open-source research).
- Arena positions for Azure, Polly, Hume, Fish, Murf, PlayHT, CapCut.

---

## 5. YouTube monetisation and AI narration

### Takeaway
No source showed YouTube banning AI voices from monetisation. The governing rule is the YPP "inauthentic content" policy (renamed from "repetitious content" on 15 July 2025), which targets mass-produced or templated content, not the voice. Original, researched scripts with substantial editing are the safe path. A claimed July 2026 rule demonetising "synthetic narration over sourced information" is unverified.

### Cited Findings
- YouTube renamed "repetitious content" to "inauthentic content" on 15 July 2025, described as a clarification. AI narration itself isn't prohibited. Reviews judge the substance, so an AI voice reading a fresh script is fine and an AI voice reading copied text counts as reused content. — [narrationbox](https://narrationbox.com/blog/youtube-ai-voice-policy-explained-clearly); [trezalabs](https://www.trezalabs.com/blog/youtube-ai-content-monetization-policy); [tallyreel](https://tallyreel.com/guides/does-youtube-monetize-faceless-ai-videos)
- Disclosing AI content alone doesn't limit reach or monetisation eligibility. — [vidpal](https://www.vidpal.ai/blog/youtube-ai-content-monetization-policy-2026)
- Unverified: a 16 July 2026 update reportedly removed monetisation from categories including "synthetic narration over sourced, attributed information". — [deeporax](https://deeporax.com/blog/youtube-inauthentic-content-policy-2026); also mentioned by [faceless.so](https://faceless.so/guides/does-youtube-monetize-ai-videos). No official YouTube page confirmed this, and the sources are AI-tool vendor blogs.

### Inferences
- For documentaries, the risk sits in the script and edit (original research, commentary, visual variety), not the TTS vendor. If the unverified July 2026 language is real, it would bear directly on documentary-style AI narration of researched facts, so the user should read the live YPP policy page.
- YouTube's altered/synthetic content disclosure toggle is meant for realistic depictions of real people or events. A generic AI narrator voice probably doesn't require it, but I didn't confirm that here.

### Gaps
- The official YouTube Help Center text of the inauthentic-content policy (2026 version) was not retrieved.

---

## 6. Summary table (free, commercial-OK, fits about 30k characters a month?)

| Service | Free quota | Commercial / monetised YouTube on free tier | Attribution | Realism notes | Verdict |
|---|---|---|---|---|---|
| Gemini 3.8 Flash TTS (AI Studio / API free tier) | Free, unpublished rate limits | Probably yes (Google claims no ownership; "professional/business" use); not explicitly confirmed | None found | Gemini 3.1 led AA at 1214 Elo in an older snapshot; style prompts | **Best free pick; verify terms** |
| Google Cloud TTS, Chirp 3: HD | 1M characters/month free (billing account) | Yes (standard paid service) | None | High-quality HD voices | **Clearly licensed; needs card** |
| Azure Speech F0 (neural) | 500K characters/month, 20 RPM | Yes (standard Azure service) | None | Good neural; HD excluded from free | **Clearly licensed** |
| edge-tts / Edge Read Aloud | Unlimited (unofficial) | No published licence; Microsoft says possibly a ToS violation | n/a | Same voices as Azure neural | Avoid |
| ElevenLabs Free | 10K credits | **No** | Required | #1 on AA (v4 Turbo about 1345) | Not allowed |
| Speechify API Free | 500K (or 50K/250K; conflicting) | Yes per Speechify | Not stated | Simba claims top-tier ranking (vendor) | Promising; verify |
| CapCut TTS | Free voices in app | Yes per CapCut, for voices tagged Commercial License | No | Mid-tier | OK with care |
| Amazon Polly | 12-month / $200-credit trial | Yes | No | Mid-tier | Not durable |
| Hume, Cartesia, Fish, Murf, PlayHT | Small | **No** (Cartesia conflicting) | PlayHT requires it | Cartesia Sonic 3.6 top-tier | Not allowed |

## 7. Leaderboard context (Artificial Analysis Speech Arena)
- Latest snapshot found: Eleven v4 Turbo about 1345, Eleven v4 2nd, StepAudio 3 TTS 1315 (Nov 2026). Snapshot from 2 Nov 2026: Eleven v4 Turbo 1336, Qwen-Audio 3.1 TTS Plus 1305, Cartesia Sonic 3.6 next. — [AA provider-voice](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice) (search snippets only; the page couldn't be fetched)
- Gap: positions of Gemini 3.8 Flash TTS, Azure, Speechify Simba 3.5, Polly and others on the current board. TTS Arena (Hugging Face) was not checked.
