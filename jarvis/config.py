"""Runtime configuration for JARVIS.

Everything is overridable via environment variables so the assistant can be
tuned without touching code. Secrets (the Anthropic API key) are read by the
SDK itself from ANTHROPIC_API_KEY.
"""

from __future__ import annotations

import os
import shutil
from pathlib import Path

# Where JARVIS keeps its memory, generated media, and OAuth tokens.
HOME = Path(os.environ.get("JARVIS_HOME", Path.home() / ".jarvis"))
MEMORY_FILE = HOME / "memory.md"
OUTPUT_DIR = Path(os.environ.get("JARVIS_OUTPUT_DIR", HOME / "output"))

MODEL = os.environ.get("JARVIS_MODEL", "claude-opus-5")
EFFORT = os.environ.get("JARVIS_EFFORT", "high")  # low | medium | high | xhigh | max
MAX_TOKENS = int(os.environ.get("JARVIS_MAX_TOKENS", "16000"))
MAX_TOOL_TURNS = int(os.environ.get("JARVIS_MAX_TOOL_TURNS", "40"))

# "Sir" by default, obviously.
USER_TITLE = os.environ.get("JARVIS_USER_TITLE", "Sir")
ASSISTANT_NAME = os.environ.get("JARVIS_NAME", "JARVIS")

# TTS voice (any `edge-tts --list-voices` entry). en-GB-RyanNeural is the
# closest stock voice to the film JARVIS.
TTS_VOICE = os.environ.get("JARVIS_VOICE", "en-GB-RyanNeural")

# Whisper model used for transcription/captions when faster-whisper is installed.
WHISPER_MODEL = os.environ.get("JARVIS_WHISPER_MODEL", "base")

# When true, shell commands and uploads run without asking first.
AUTO_APPROVE = os.environ.get("JARVIS_AUTO_APPROVE", "").lower() in {"1", "true", "yes"}

# Anthropic server-side web search/fetch (JARVIS_WEB=0 to disable).
WEB_TOOLS = os.environ.get("JARVIS_WEB", "1").lower() not in {"0", "false", "no"}

# Remember the conversation across restarts (JARVIS_PERSIST=0 to disable).
PERSIST = os.environ.get("JARVIS_PERSIST", "1").lower() not in {"0", "false", "no"}


def ensure_dirs() -> None:
    HOME.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def ffmpeg_path() -> str:
    """A working ffmpeg binary: system install first, bundled static build second."""
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "No ffmpeg found. Install ffmpeg or `pip install imageio-ffmpeg`."
        ) from exc
