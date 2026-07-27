# JARVIS

A real, working JARVIS: a voice-capable AI assistant built on the Claude API with a
full video-production toolkit — it can talk, remember, run commands (with your
permission), **edit YouTube videos, voice them, and build faceless videos end to end**.

```
You: edit my_talking_video.mp4 for youtube
JARVIS: ⚙ video_cut_silence(...)   removed 74s of dead air
        ⚙ video_caption(...)       transcribed + burned captions
        ⚙ video_normalize_audio()  -16 LUFS
        Done, Sir. Final cut: ~/.jarvis/output/my_talking_video_cut_captioned_norm.mp4
```

## What it can actually do

| Capability | How |
|---|---|
| Converse with the JARVIS persona ("Sir", dry wit, concise) | Claude Opus 5, streaming |
| Speak replies out loud | `edge-tts` neural voices (free), offline `pyttsx3` fallback |
| Remember things between sessions | `~/.jarvis/memory.md`, auto-loaded into every session |
| Run shell commands / read & write files | gated behind a y/N confirmation |
| **Edit talking videos** | silence removal (jump cuts), auto captions, loudness normalization, trims, concat |
| **Voice videos** | script → neural narration MP3 (`voiceover`) |
| **Build faceless videos** | images + narration → 1080×1920 video with Ken Burns motion, captions |
| Convert landscape → Shorts/TikTok vertical | center crop 9:16 |
| Thumbnails, background music beds | ffmpeg |
| Upload to YouTube | Data API v3, defaults to **private**, gated behind confirmation |

Honest limits: it does not browse the web, it is not sentient, and "does everything"
is a roadmap, not a property of software. But every row in that table works today.

## Quick start — see JARVIS and talk to him

This runs on **your computer** (it is not a website). One-time setup, then two commands:

1. Install [Python 3.10+](https://www.python.org/downloads/) (on Windows, tick "Add to PATH").
2. Get the code: `git clone` this repo, or GitHub → green **Code** button → **Download ZIP** → unzip.
3. In a terminal, inside the folder:

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...    # from console.anthropic.com  (Windows: set ANTHROPIC_API_KEY=sk-ant-...)
python -m jarvis web
```

Your browser opens the **JARVIS HUD** — a glowing arc reactor, a chat, a 🎙 button.
Click the mic and talk to him (Chrome/Edge); he answers out loud. No extra setup:
your browser provides the microphone and the voice.

Prefer the terminal instead?

```bash
python -m jarvis                       # chat in the terminal
python -m jarvis --voice               # terminal chat + spoken replies (edge-tts)
python -m jarvis web --allow-actions   # HUD, with shell/upload actions enabled
```

Optional extras:

```bash
pip install faster-whisper                                  # transcription + auto captions
pip install google-api-python-client google-auth-oauthlib   # YouTube upload
```

ffmpeg is bundled via `imageio-ffmpeg` — no system install needed.

## Using it

**Chat / autonomous tasks** (needs API key):

```bash
python -m jarvis
python -m jarvis do "cut the silences out of raw.mp4, caption it, and give me a thumbnail"
python -m jarvis do "turn script.txt into a vertical faceless video using the images in ./frames"
```

**Direct video pipeline** (no API key needed — plain CLI over the same tools):

```bash
python -m jarvis video probe input.mp4
python -m jarvis video cut-silence input.mp4 --threshold -35 --min-silence 0.45
python -m jarvis video caption input.mp4                 # needs faster-whisper
python -m jarvis video voiceover @script.txt --out narration.mp3
python -m jarvis video assemble narration.mp3 ./images --out short.mp4
python -m jarvis video vertical landscape.mp4
python -m jarvis video music short.mp4 bed.mp3 --volume 0.12
python -m jarvis video trim input.mp4 12.5 48.0
python -m jarvis video concat intro.mp4 main.mp4 outro.mp4
python -m jarvis video thumbnail input.mp4 --at 3
python -m jarvis speak "All systems online, Sir."
```

**The faceless-channel pipeline in one command:**

```bash
python -m jarvis do "Read script.txt. Generate a voiceover, assemble it with the
images in ./scenes into a vertical video, burn captions, and normalize the audio."
```

## YouTube upload (optional)

1. Google Cloud Console → new project → enable **YouTube Data API v3**
2. OAuth consent screen → External → add yourself as a test user
3. Credentials → **OAuth client ID → Desktop app** → download the JSON to `~/.jarvis/client_secrets.json`
4. First upload opens a browser to authorize; the token is cached afterwards

Uploads default to `private` and always ask for confirmation first.

## Configuration

Copy `.env.example`. Highlights: `JARVIS_MODEL` (default `claude-opus-5`),
`JARVIS_EFFORT` (`low`–`max`), `JARVIS_VOICE` (any `edge-tts --list-voices` name),
`JARVIS_AUTO_APPROVE=1` to skip confirmation gates (use with care).

## Architecture

```
jarvis/
  __main__.py     CLI: `web` HUD, chat REPL, `do`, `speak`, `video ...`
  server.py       local web server for the HUD (stdlib, no extra deps)
  web/index.html  the JARVIS HUD (arc reactor, chat, browser mic + voice)
  agent.py        Claude tool-use loop (streaming, refusal/pause handling)
  personality.py  system prompt: persona (cached) + long-term memory
  memory.py       ~/.jarvis/memory.md
  config.py       env-driven settings
  tools/
    __init__.py   tool schemas + dispatcher + confirmation gates
    video.py      ffmpeg: probe, silence cuts, captions, slideshow, vertical, music…
    speech.py     TTS (edge-tts → pyttsx3) + playback
    transcribe.py faster-whisper STT → SRT
    youtube.py    YouTube Data API upload (private by default)
```

Design notes: the persona block carries a `cache_control` breakpoint so repeated
turns hit the prompt cache; consequential tools (`run_command`, `youtube_upload`)
are gated behind explicit confirmation; every video op writes a new file and
reports its path — inputs are never overwritten.
