# The Detective's voice

`detective_ref.wav` is the Fiction Files narrator. Every episode clones this exact clip with
Qwen3-TTS Base 1.7B (`whatif/tools/detective_vo.py`), so the voice stays the same across videos.

- **Current voice (v2, chosen 24 Nov 2026):** the "Welcome to the Fiction Files" take from Case File 001.
  Reference text: "Welcome to the Fiction Files. I'm your Detective. Every story is built on something real, and on this channel, we find it. Today's case file is… number one. The Reaping."
- **v1 (`detective_ref_v1.wav`):** No. 22 "Noir Detective", made with Qwen3-TTS VoiceDesign 1.7B from:
  "A deep, slightly gravelly male voice in his forties, like a seasoned detective narrating a noir film. Low pitch, slow and deliberate pace, calm but full of quiet intrigue, with dramatic pauses."

Qwen3-TTS is Apache 2.0, free for commercial use.

Lesson: when a paragraph repeats the reference clip's own words, the clone can drift to a different voice. Check every paragraph's pitch (median about the same as the reference) as well as its words.
