# The Detective's voice

`detective_ref.wav` is the Fiction Files narrator, chosen from 27 free voices (No. 22, "Noir Detective").

- Made with Qwen3-TTS VoiceDesign 1.7B (Apache 2.0, free for commercial use) from this description:
  "A deep, slightly gravelly male voice in his forties, like a seasoned detective narrating a noir film. Low pitch, slow and deliberate pace, calm but full of quiet intrigue, with dramatic pauses."
- Every episode clones this exact clip with Qwen3-TTS Base 1.7B (`whatif/tools/detective_vo.py`), so the voice stays identical across videos.
- Reference text: "It's fiction. But fifty-seven years ago, America did something terrifyingly close. Live on TV, a man reached into a container, pulled out a date of birth, and decided which young men would be sent to war. Welcome to the Fiction Files. I'm your Detective. Today's case file is number one. The Reaping."
