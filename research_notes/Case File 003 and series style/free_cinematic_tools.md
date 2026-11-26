# Free cinematic tools, models and asset libraries for a one-person documentary channel (Remotion + ffmpeg + Python, CPU-only Linux)

Research date: 26 Nov 2026. Scope: only things that are free AND allowed for commercial YouTube use, runnable without a GPU. Non-commercial items are listed only to flag them as EXCLUDED.

Network note for the report writer: in this cloud session these hosts could not be reached: huggingface.co, help.archive.org, www.archives.gov, ffmpeg.org, www.sonniss.com. GitHub pages and web search worked. This matters for the pipeline: most model weights (Depth Anything V2, BiRefNet, ACE-Step, HeartMuLa) download from Hugging Face, so huggingface.co must be added to the container's allowed hosts before any of them can be installed. rembg pulls its ONNX models from GitHub releases (unverified in this session, see Gaps).

Also important for the whole pipeline: Remotion itself is free only for individuals, non-profits and for-profit organisations with up to 3 employees; larger companies need a paid Company Licence. A one-person channel qualifies for the free licence, which covers commercial video creation. — [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)

---

## 1. 2.5D / parallax from still photos (depth + inpainting)

### Takeaway
Use **Depth Anything V2 Small (Apache-2.0, 24.8M params)** or **MiDaS small (MIT)** for depth maps, and **LaMa (Apache-2.0)** for filling the background behind a cut-out subject. Depth Anything V2 Base/Large/Giant are CC-BY-NC-4.0 and are EXCLUDED. Apple Depth Pro uses a custom Apple licence with no explicit commercial grant, so treat it as risky. DepthFlow (the ready-made parallax renderer) is AGPL-3.0 and GPU-oriented, so for CPU it is simpler to do the displacement yourself in Remotion/three.js or in Python.

### Cited Findings
- Depth Anything V2 licences, quoted from the repo: "Depth-Anything-V2-Small model is under the Apache-2.0 license"; "Depth-Anything-V2-Base/Large/Giant models are under the CC-BY-NC-4.0 license." So only Small is allowed. — [Depth-Anything-V2 GitHub](https://github.com/DepthAnything/Depth-Anything-V2)
- Parameter counts: Small 24.8M, Base 97.5M, Large 335.3M, Giant 1.3B (Giant listed as "coming soon"). The sample code falls back to CPU automatically when no CUDA or MPS device is present. — [Depth-Anything-V2 GitHub](https://github.com/DepthAnything/Depth-Anything-V2)
- ONNX exports of Depth Anything V2 Small exist (onnx-community, fabio-sim/Depth-Anything-ONNX), which suit CPU inference with onnxruntime; default input size is 518x518. No published CPU seconds-per-image figure was found. — [onnx-community/depth-anything-v2-small](https://huggingface.co/onnx-community/depth-anything-v2-small); [fabio-sim Depth-Anything-ONNX](https://www.github.com/fabio-sim/Depth-Anything-ONNX)
- MiDaS is MIT-licensed; the repo was archived (read-only) on 25 Aug 2025. Lightweight models: midas_v21_small_256 (21M params), dpt_levit_224 (51M), dpt_swin2_tiny_256 (42M). The only CPU figure given: openvino_midas_v21_small_256 runs at 22 FPS on an Intel Core i7-1185G7 laptop CPU at 640x480. The small model is much less accurate (-76% vs the DPT-L-384 baseline). — [MiDaS GitHub](https://github.com/isl-org/MiDaS)
- Apple Depth Pro: code is under a custom Apple licence granting a "personal, non-exclusive license to use, reproduce, modify and redistribute the Apple Software". It neither grants nor forbids commercial use explicitly, and bars using Apple's name or marks. The README says weights are "released under the LICENSE terms" (same file). Speed given only for GPU (2.25 MP depth map in 0.3 s). — [ml-depth-pro LICENSE](https://github.com/apple/ml-depth-pro/blob/main/LICENSE); [ml-depth-pro README](https://github.com/apple/ml-depth-pro)
- LaMa (big-image inpainting) is Apache-2.0 and its Docker prediction path takes `device=cpu`. — [LaMa LICENSE](https://raw.githubusercontent.com/advimman/lama/main/LICENSE); [LaMa GitHub](https://github.com/advimman/lama)
- IOPaint (formerly lama-cleaner) is Apache-2.0, runs with `--device=cpu`, and uses LaMa as its default eraser model. The repo was archived on 13 Aug 2025 (still usable, no longer maintained). Its diffusion-inpainting options (Stable Diffusion inpainting, SDXL, BrushNet, PowerPaint) are heavy and have their own licences. — [IOPaint GitHub](https://github.com/Sanster/IOPaint)
- DepthFlow (photo-to-parallax renderer) is AGPL-3.0. It is a ray-marching GLSL shader advertised as "up to 8k50fps rendering with an RTX 3060-class GPU"; no CPU-only path is documented. — [DepthFlow GitHub](https://github.com/BrokenSource/DepthFlow)

### Inferences
- The practical CPU workflow ("2.5D camera move" as used on archive-photo documentaries): (1) cut the subject out with rembg/BiRefNet (section 2); (2) fill the hole on the background plate with LaMa via IOPaint on CPU; (3) optionally make a depth map with Depth Anything V2 Small (ONNX) for subtle displacement; (4) animate foreground and background layers at different scale and translate speeds in Remotion (plain CSS transforms on two `<Img>` layers need no GPU), or use a depth-displacement shader in @remotion/three. The two-layer version is the classic "Ken Burns parallax" effect and is the cheapest and most robust on CPU.
- Using AGPL DepthFlow only to render video output for YouTube probably does not trigger AGPL source-sharing duties (you're not distributing or serving the software), but its GPU focus makes it a poor fit for a CPU container anyway.
- The ambiguous Depth Pro licence plus the clean Apache-2.0 option means there is no reason to take the risk: prefer Depth Anything V2 Small.

### Gaps
- No reliable CPU timing found for Depth Anything V2 Small, LaMa or IOPaint on a cloud vCPU; expect seconds per image, not minutes, but benchmark locally.
- The Hugging Face model cards (which sometimes carry a different licence from the GitHub repo) could not be read because huggingface.co was blocked here.

---

## 2. Background removal / cut-outs for archive photos

### Takeaway
**rembg (MIT)** on CPU is the easy front door. Use its **u2net / isnet-general-use** models for speed, or **birefnet-general / birefnet-general-lite** (BiRefNet code is MIT) for better hair and edge quality. Do NOT use rembg's current default **bria-rmbg (RMBG-2.0)**: commercial use needs a paid agreement with BRIA, so it is EXCLUDED. Always pass the model name explicitly.

### Cited Findings
- rembg is MIT-licensed; CPU install is `pip install "rembg[cpu]"` (Python >=3.11, <3.14), and there is a CPU Docker image. — [rembg GitHub](https://github.com/danielgatis/rembg)
- Available rembg models: u2net, u2netp, u2net_human_seg, u2net_cloth_seg, silueta, isnet-general-use, isnet-anime, sam, birefnet-general / -fp16 / -lite / -portrait / -dis / -hrsod / -cod / -massive / -dynamic, and bria-rmbg (default). — [rembg GitHub](https://github.com/danielgatis/rembg)
- bria-rmbg (RMBG-2.0) "requires a paid agreement for commercial use". rembg notes that model weights carry their own licences separate from rembg's MIT. — [rembg GitHub](https://github.com/danielgatis/rembg)
- CPU performance notes from rembg: bria-rmbg is slower than u2net because it runs at 1024x1024; birefnet-general-fp16 is usually slower than birefnet-general on CPU. — [rembg GitHub](https://github.com/danielgatis/rembg)
- BiRefNet code is MIT; a BiRefNet_lite-2K variant handles 2560x1440 input; a Swin-Tiny general model exists alongside the default Swin-Large. GPU inference memory is 4.8 GB FP32; the only timings are GPU (ONNX ~165 ms SwinL, ~94 ms SwinT on A100). BiRefNet_lite runs in the browser with ONNX Runtime Web (third-party tools), which shows it can run without CUDA. — [BiRefNet GitHub](https://github.com/ZhengPeng7/BiRefNet)

### Inferences
- For black-and-white archive photos with grain, BiRefNet (general or lite) will usually give cleaner edges than U²-Net; on CPU budget, try birefnet-general-lite first and fall back to isnet-general-use.
- Expect several seconds to tens of seconds per image on CPU for BiRefNet at 1024 px; batch these offline in Python before the Remotion render.

### Gaps
- The licences of the U²-Net, IS-Net (DIS) and BiRefNet weights themselves were not confirmed (HF blocked; rembg doesn't state them). U²-Net and DIS repos are widely reported as Apache-2.0 but this was not verified here.
- No CPU benchmarks found for any rembg model.

---

## 3. Film looks: LUTs, grain, gate weave, light leaks, shaders in Remotion

### Takeaway
All of this can be done for free: ffmpeg's `lut3d` applies any `.cube` LUT; Remotion has a built-in WebGL `noise()` effect for grain plus a `createEffect()` API for custom shaders (vignette, gate weave, halation). Gate weave must be animated per frame (a tiny sub-pixel drift driven by frame number). The commercial "film emulation" tools (Dehancer, ARRI Film Lab, Boris Silhouette) are not free; build the look yourself instead.

### Cited Findings
- ffmpeg's `lut3d` filter applies a `.cube` LUT, e.g. `-vf "lut3d=osmo-vivid.cube"`. — [Jeff Geerling: Apply LUTs with ffmpeg (2026)](https://www.jeffgeerling.com/blog/2026/apply-lut-color-grade-with-ffmpeg/); syntax with `lut3d=file=...` shown in [ffmpeg trac ticket 2847](https://fftrac-bg.ffmpeg.org/ticket/2847)
- A suggested order for a film look on clean or synthetic footage: upscale, colour-correct, apply the LUT at partial strength (~50–70%), add 35mm-style grain at ~8–15%, then a light blur. — [invideo: LUTs and film grain](https://invideo.io/blog/luts-film-grain-ai-video/)
- Gate weave is a sub-pixel frame drift that changes over time and must be driven by frame number; a static frame can't show it. — [StraySpark: Blender film look (halation, grain, gate weave)](https://www.strayspark.studio/blog/blender-film-look-halation-grain-gate-weave)
- A pure LUT can't fully emulate film (grain, halation and gate weave aren't colour transforms). — [Frame.io: Can you really emulate film with a LUT?](https://blog.frame.io/2023/05/29/35mm-film-look-lut/)
- Remotion's `@remotion/effects` has a `noise()` effect (WebGL2) for canvas-based components (Video, HtmlInCanvas, Solid). An animated seed derived from the frame gives moving grain, and the docs recommend `noise()` rather than `whiteNoise()` for subtle additive film grain. — [Remotion docs: noise](https://www.remotion.dev/docs/effects/noise); [Remotion docs: white-noise](https://www.remotion.dev/docs/effects/white-noise)
- Remotion's shader docs: custom effects via `createEffect()`, and render with `--gl=angle` so the headless browser can create a WebGL context (this is how WebGL works without a GPU). — [Remotion docs: shaders](https://www.remotion.dev/docs/shaders)
- `@remotion/noise` (Perlin/simplex noise helpers) is on npm and is useful for organic camera shake or weave offsets. — [@remotion/noise on npm](https://npmjs.com/package/@remotion/noise); [Remotion noise visualization](https://www.remotion.dev/docs/noise-visualization)
- three.js ships a classic `FilmShader` (per-pixel grain from UV + time uniform, plus scanlines), a reference for a custom grain shader. — [three.js FilmShader.js (Debian source mirror)](https://sources.debian.org/src/three.js/111%2Bdfsg1-2/examples/jsm/shaders/FilmShader.js)
- `glsl-film-grain` is a small npm GLSL module for film grain. — [glsl-film-grain on yarn](https://classic.yarnpkg.com/en/package/glsl-film-grain)
- Commercial film-emulation tools that bundle grain, halation and gate weave are Dehancer, ARRI Film Lab and Boris Silhouette's Grunge node: NOT free, listed only for comparison. — [Dehancer features](https://www.dehancer.com/features); [ARRI Film Lab](https://www.arri.com/filmlab); [Silhouette Grunge nodes](https://borisfx.com/documentation/silhouette-2026.0/Silhouette-2026/Nodes-Grunge.html)

### Inferences
- Cheapest CPU recipe, applied as an ffmpeg post-pass after the Remotion render (from knowledge of ffmpeg filters; not re-verified this session because ffmpeg.org was unreachable, see [ffmpeg-filters](https://ffmpeg.org/ffmpeg-filters.html)): `lut3d` (grade) → `curves` (e.g. the built-in `vintage` preset or a custom S-curve) → `noise=alls=8:allf=t` (temporal grain) → `vignette` → a per-frame `crop` with expressions on `n`/`t` for gate weave → `gblur` on a screened copy for halation/bloom. Light leaks are easiest as a CC0/self-made overlay clip blended with `blend=all_mode=screen`, or drawn in Remotion as animated radial gradients with `mix-blend-mode: screen`.
- Doing grain and weave inside Remotion (with the `noise()` effect and a `createEffect()` shader) keeps the whole look in one render and makes it deterministic per frame; doing it in ffmpeg afterwards is faster to iterate. Either works on CPU (Remotion through ANGLE/SwiftShader software GL, which is slower).
- Free LUT sources: you can generate your own `.cube` LUTs in Python (e.g. a teal-orange or bleach-bypass curve) to avoid licence ambiguity on downloaded "free LUT packs", many of which are free for personal use only.

### Gaps
- No verified, explicitly commercial-licensed free LUT pack was found in this session; check each pack's licence or generate your own.
- No ffmpeg-only light-leak or gate-weave recipe from a primary source was found (the GitHub gist "FFmpeg: Ultimate film grain" was only seen as a snippet: [gist](https://gist.github.com/logiclrd/287140934c12bed1fd4be75e8624c118)).
- CPU render speed for Remotion WebGL effects under `--gl=angle` / swiftshader was not measured.

---

## 4. Free public-domain footage and photo archives (US crime / forensics / Miami)

### Takeaway
Best bets: **Florida Memory** (State Archives of Florida, all images offered under the Public Domain Mark, credit requested), **US federal works** (FBI Vault, NARA, NIST and DOJ material made by federal employees are public domain under 17 U.S.C. §105, with exceptions), **Library of Congress** items marked "No known restrictions", **Prelinger Archives** on the Internet Archive (~65% public domain, no guarantee), and **Wikimedia Commons** filtered to PD-USGov or Florida tags. Always check each item: third-party photos inside FOIA files, contractor work, insignia and privacy/publicity rights are the usual traps.

### Cited Findings
- Florida Memory: the FAQ says it offers all images under the Creative Commons Public Domain Mark 1.0; a 2017 Florida Department of State release says the photos are free of copyright restrictions and asks users to credit the State Archives of Florida. — [Florida Memory FAQ](https://floridamemory.com/share/order-info/faq.php); [FL Dept. of State press release 2017](https://dos.fl.gov/communications/press-releases/2017/florida-memory-achieves-major-milestone-with-the-200-000th-historical-photograph-added-online/)
- Florida Memory caveat: use of materials is governed by state law and in some cases by donor agreements (quoted via a Wikipedia page, not an official page). — [Florida Photographic Collection (Wikipedia)](https://en.wikipedia.org/wiki/Florida_Photographic_Collection); official disclaimer page: [Florida Memory disclaimer](https://www.floridamemory.com/learn/about/disclaimer.php)
- Many Florida Photographic Collection images are already on Wikimedia Commons. — [Commons category](https://commons.wikipedia.com/wiki/Category:Images_from_the_Florida_Photographic_Collection)
- Wikimedia Commons: works of the US federal government are public domain in the US (17 U.S.C. §105), but insignia/identification have commercial-use restrictions, images on .gov sites are not automatically PD (contractor/grantee works can be copyrighted), and Commons says most California and Florida agency works are public domain. — [Commons: Copyright rules by territory/United States](https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/United_States); [Wikipedia: copyright status of US federal works](https://www.wikipedia.org/wiki/PD-USGov)
- FBI Records Vault is the FBI's electronic FOIA reading room (nearly 7,000 documents as of 2017). — [FBI Vault (archived 2017)](https://webarchive.library.unt.edu/web/20170213231230/https://www.fbi.gov/services/records-management/vault); [FBI: new Records Vault](https://www.fbi.gov/news/stories/new-records-vault-comes-online)
- DOJ (Bureau of Justice Statistics) reuse policy: information generated by the Department is public domain and may be reused without permission. — [BJS reuse policy](https://bjs.ojp.gov/reuse-policy)
- The FBI seal, name and initials have separate legal protection; unauthorised use can be prosecuted, even though the seal artwork is PD in copyright terms. — [Commons: Seal of the FBI](https://commons.wikipedia.com/wiki/File:Seal_of_the_FBI.svg)
- NARA: not all records held by NARA are public domain; check each item. — [NARA still pictures permissions](https://www.archives.gov/research/still-pictures/permissions); [NARA: publish photos](https://www.archives.gov/research/still-pictures/publish-photos)
- Library of Congress: rights are assessed per collection; "No known restrictions on publication" generally means copyright was not renewed or no rights holder was found; privacy/publicity rights may still apply. LoC flags "free to use and reuse" sets. — [LoC Detroit Publishing Co. rights](https://www.loc.gov/collections/detroit-publishing-company/about-this-collection/rights-and-access/); [LoC blog: free to use and reuse](https://blogs.loc.gov/loc/2018/02/free-to-use-and-reuse-making-public-domain-and-rights-clear-content-easier-to-find/); [Commons: Library of Congress](https://commons.wikipedia.com/wiki/Commons:Library_of_Congress)
- Prelinger Archives: roughly 65% of holdings are US public domain (expired copyright or no notice); the Internet Archive does not guarantee copyright status; no notification needed but a credit line is suggested; commercial users wanting film-original quality plus indemnity license through Getty Images. — [Prelinger Archives (Wikipedia)](https://en.wikipedia.org/wiki/Prelinger_Archives); [Internet Archive help: Prelinger](https://help.archive.org/help/prelinger-archive/); [Internet Archive rights FAQ](https://help.archive.org/help/rights/); [No Film School: PD footage](https://nofilmschool.com/2015/10/need-public-domain-footage-your-documentary-here-are-5-great-sources)
- NIST forensic datasets are NOT uniformly free to redistribute: SD 302 (10,000 annotated latent fingerprints) and SD 303 are released "for free to the research community"; SD 300 says it "will not be further distributed, published, copied, or disseminated". NIST released OpenLQM print-quality software in March 2026. — [NIST news Mar 2026](https://www.nist.gov/news-events/news/2026/03/nist-helps-fingerprint-examiners-new-data-and-software-release); [NIST SD 303](https://www.nist.gov/publications/nist-special-database-303)
- CSAFE ShoeCase (936 mock-crime-scene shoeprints, NIST-funded) is on figshare; licence not confirmed. — [ShoeCase on figshare](https://figshare.com/articles/dataset/ShoeCase_A_data_set_of_mock_crime_scene_footwear_impressions/22814438)

### Inferences
- For forensic visuals (fingerprints, shoeprints, lab equipment) it is safer to recreate them as code-drawn graphics or photograph your own props than to rely on research datasets with "research community" terms.
- Real crime-scene or victim photos raise ethics and YouTube-policy issues regardless of copyright; prefer documents, maps, places and period street life.

### Gaps
- No primary FBI Vault reuse statement was found; NARA, Internet Archive and ffmpeg pages could not be fetched directly in this session.
- NIJ image libraries: no NIJ-specific public image library with a clear reuse statement was found.

---

## 5. Free sound: SFX, foley, ambience, and an original noir score

### Takeaway
Use **Freesound filtered to CC0** and the **Sonniss GDC bundles** (royalty-free, commercial, no attribution; can't resell raw files or use for AI training). **BBC Sound Effects (RemArc licence) is EXCLUDED**: personal, educational and research use only, and a monetised YouTube channel counts as commercial. For music, render your own noir motif from MIDI with **FluidSynth + FluidR3_GM (MIT)**; GeneralUser GS also allows commercial music-making but has unclear sample provenance.

### Cited Findings
- Freesound: choosing only "Creative Commons 0" sounds avoids any attribution or commercial-use limits; CC BY needs credit; CC BY-NC cannot be used commercially. Some CC0 sound descriptions still ask for credit, so read each page. — [Freesound forum (legal help)](https://freesound.org/forum/legal-help-and-attribution-questions/42190); [Freesound FAQ](https://www.freesound.org/help/faq)
- Sonniss GDC bundles: royalty-free, commercially usable, no attribution, unlimited projects, lifetime. — [Bedroom Producers Blog: GDC 2020 bundle](https://bedroomproducersblog.com/2020/09/22/sonniss-gdc-2020-bundle/); GDC 2023 licence text (third-party copy): [License.pdf](https://scrubby.duckdns.org/Sonniss.com%20-%20GDC%202023%20-%20Game%20Audio%20Bundle/License.pdf)
- Sonniss GDC 2024 bundle (27.5 GB+): cannot be used to train AI models. — [GameFromScratch: GDC 2024](https://gamefromscratch.com/sonniss-27-5gb-sound-effect-giveaway-at-gdc-2024/)
- Republishing the Sonniss files unchanged (e.g. on Freesound) breaches the licence. — [Freesound forum](https://freesound.org/forum/legal-help-and-attribution-questions/42190)
- GDC 2026 bundle: ~7.47 GB. — [Bedroom Producers Blog: GDC 2026](https://bedroomproducersblog.com/2026/03/16/sonniss-gdc-2026-bundle/); [rekkerd.org](https://rekkerd.org/sonniss-releases-gdc-2026-game-audio-bundle/)
- BBC Sound Effects (33,000+ files) are BBC copyright under the RemArc licence for personal, educational or research purposes only; commercial use needs a licence via Pro Sound Effects; monetised or ad-funded projects count as commercial. — [MusicRadar](https://www.musicradar.com/news/the-bbc-is-letting-you-download-more-than-16000-free-sound-effect-samples-from-its-archive); [Freesound forum on BBC terms](https://freesound.org/forum/legal-help-and-attribution-questions/45079); [DIYPhotography](https://www.diyphotography.net/the-bbc-sound-effects-archive-is-now-free-to-download-with-over-33000-files/)
- FluidR3_GM SoundFont: released by Frank Wen under the MIT licence; packaged as MIT by openSUSE. — [Debian copyright: fluidr3mono-gm-soundfont](https://sources.debian.org/copyright/license/fluidr3mono-gm-soundfont/2.315-7); [openSUSE fluid-soundfont](https://build.opensuse.org/package/show/home:goupilmtos:multimedia:apps/fluid-soundfont?expand=0)
- GeneralUser GS: the author's licence allows use "without restriction for your own music creation, private or commercial", but Debian reviewers doubt the provenance of some samples. — [GeneralUser GS 2.0 licence (ScanCode)](https://scancode-licensedb.aboutcode.org/generaluser-gs-2.0.LICENSE); [debian-legal thread](https://lists.debian.org/debian-legal/2023/03/msg00001.html)
- MuseScore General SoundFont has its own licence file (MIT-based, derived from FluidR3Mono). — [MuseScore_General_License.md (Fedora)](https://src.fedoraproject.org/rpms/mscore/blob/f36/f/MuseScore_General_License.md)

### Inferences
- Noir score pipeline on CPU: write the motif in Python (`mido` or `pretty_midi`), render with FluidSynth using FluidR3_GM (muted trumpet, upright bass, brushed drums, vibraphone, piano), then add reverb and tape saturation in ffmpeg or sox. Rendering MIDI is far faster than real time on CPU, and you own the composition outright. You can also synthesise drones and risers directly with numpy.
- Ambience for Miami/courtroom/police scenes: Sonniss bundles (city, crowd, rain, sirens) plus Freesound CC0 searches. Keep a licence log per file.

### Gaps
- The official Sonniss licence page (sonniss.com) could not be fetched; terms above are from secondary coverage and a third-party copy of the 2023 licence.
- The FluidSynth (LGPL) licence was not re-verified this session; it's only used as a tool, so the output audio is unaffected.

---

## 6. Open-source text-to-music / audio models with commercial licences that run on CPU

### Takeaway
Licence-cleared options exist, but none is practical on CPU. **ACE-Step 1.5** (code MIT; weights reported as Apache-2.0/MIT by third parties) is the most likely candidate: it lists CPU as a supported backend but publishes only GPU speeds, and the 2B model needs about 4.7 GB of weights. **HeartMuLa-oss-3B** is Apache-2.0 (code and weights), but it runs at about real time on GPU and its CPU path isn't documented. **MusicGen (CC-BY-NC weights)** and **YuE2 (reported CC BY-NC by default)** are EXCLUDED. **Stable Audio Open / Small** uses the Stability Community Licence: free for organisations under $1M annual revenue, revocable, and not open source. Recommendation: use MIDI + soundfont composition (section 5) for the score; only try ACE-Step if a long CPU render is acceptable.

### Cited Findings
- ACE-Step 1.5: code is MIT; supported backends "CUDA GPU recommended (also supports MPS / ROCm / Intel XPU / CPU)"; runs in under 4 GB VRAM; DiT sizes 2B (~4.7 GB bf16 weights) and XL 4B (~9 GB); the LM is Qwen3-based, 0.6B–4B. No CPU timings; the disclaimer asks users to verify originality and disclose AI involvement. — [ACE-Step-1.5 GitHub](https://github.com/ace-step/ACE-Step-1.5)
- ACE-Step weights are reported as Apache-2.0 (v1) and MIT (1.5) by secondary sources. — [ComfyUI docs: ACE-Step](https://docs.comfy.org/tutorials/audio/ace-step/ace-step-v1); [Boppy: best open-source music models 2026](https://boppy.me/blog/best-open-source-ai-music-models)
- HeartMuLa: "We update the license of this repo and all related model weights to Apache 2.0" (20 Jan 2026); released model is 3B; speed is about RTF 1.0 (≈ real time, on GPU); default max length 4 minutes; no instrumental flag documented (it's driven by lyrics and tags files). Without a GPU, the README points to the hosted site. — [HeartMuLa heartlib GitHub](https://github.com/HeartMuLa/heartlib)
- DiffRhythm is reported as Apache 2.0 (code and DiT weights) but needs about 8 GB VRAM. YuE v1 is Apache 2.0; YuE2 weights are reported as CC BY-NC 4.0 by default. MusicGen weights are CC BY-NC 4.0. — [Spheron: open-source music generation 2026](https://www.spheron.network/blog/deploy-open-source-ai-music-generation-gpu-cloud-2026/); [SoundGen: AI music models and licences](https://soundgen.ai/ai-music-models); [songcreator.pro comparison](https://songcreator.pro/blog/best-open-source-ai-music-models)
- Stable Audio Open Small: Stability AI Community Licence; free for researchers, hobbyists and businesses under $1M annual revenue; enterprise licence above that; revocable on violation. — [TechCrunch](https://techcrunch.com/?p=3007115); [Stability AI licence page](https://stability.ai/license)

### Inferences
- On a CPU-only container, a 3B–4B music model at "≈real time on GPU" will likely be many times slower than real time; for a 2-minute cue, expect a very long render if it works at all. That's a reasonable guess, not a measurement.
- The Stability Community Licence technically permits a small channel's commercial use, but it is a "revocable" custom licence, not FOSS. Treat it as allowed-with-caveats, not as a first choice.
- Any AI music sounds generic; an original MIDI motif is more distinctive for a series identity.

### Gaps
- No CPU benchmarks exist for ACE-Step, HeartMuLa or DiffRhythm; the weight licences could not be confirmed on Hugging Face (host blocked). Several 2026 comparison sites contain dubious claims, so verify on each model card before use.

---

## 7. Other high-impact free tools: 3D, upscaling, typography/titles, subtitles

### Takeaway
**Blender** (GPL; your renders are your own property, commercial use fine; Cycles and EEVEE can run on CPU, slowly) and **three.js via @remotion/three** for 3D evidence boards, maps and rooms. **Real-ESRGAN (BSD-3-Clause)** for upscaling archive photos; on CPU use the Python version with `--fp32` and the small `realesr-general-x4v3` model, expecting about 30–60 s per 512→2048 image (the ncnn-vulkan portable build targets GPUs).

### Cited Findings
- Blender: "what you create with Blender is your sole property"; the GPL applies to the application, not your artwork; studios use it commercially. — [Blender licence page](https://www.blender.org/?p=658); [Blender manual: About Free Software and the GPL](https://docs.blender.org/manual/en/4.2/getting_started/about/license.html)
- Real-ESRGAN is BSD-3-Clause; its portable `realesrgan-ncnn-vulkan` executables are for "Intel/AMD/Nvidia GPU" and need no CUDA or PyTorch. — [Real-ESRGAN GitHub](https://github.com/xinntao/Real-ESRGAN)
- On CPU, Real-ESRGAN needs `--fp32` (fp16 ops are not implemented on CPU); `--tile` lowers memory use; realesr-general-x4v3 is the small general model. — [Real-ESRGAN FAQ](https://www.github.com/xinntao/Real-ESRGAN/blob/master/docs/FAQ.md); [Real-ESRGAN inference guide (mintlify mirror)](https://mintlify.com/xinntao/Real-ESRGAN/guides/inference)
- Rough CPU timing: 512x512 → x4 in about 30–60 s (reported by a third-party Space, rough guide only). — [HF Space README](https://huggingface.co/spaces/hungdang1610/Image-Enhancement/blob/main/README.md?code=true)
- Remotion shaders/three.js rendering in headless Chrome needs `--gl=angle`. — [Remotion docs: shaders](https://www.remotion.dev/docs/shaders)

### Inferences
- Upscaling AI-hallucinates texture, so for faces in real archive photos use it lightly (2x) or not at all, to stay consistent with the "no AI-generated images of real people" rule. Real-ESRGAN invents fine detail, so heavy 4x upscales of identifiable people come close to that rule.
- Subtitles: ffmpeg's `subtitles`/`ass` filters (libass) burn in styled captions, or render them in Remotion with `@remotion/captions`; both are free. Not verified this session.
- Typography: Google Fonts under the SIL Open Font License are commercially usable (for example Special Elite and Courier Prime for case-file typewriter text, or Bebas Neue and Oswald for titles). Not verified this session; check each font's OFL page.

### Gaps
- No CPU benchmark for Blender Cycles/EEVEE in this container; @remotion/captions, libass and OFL font licences were not fetched this session due to the tool-call budget.
- No Remotion title-animation library with a confirmed licence was researched.
