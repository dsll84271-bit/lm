"""Text-to-speech (voiceover + spoken replies) and audio playback."""

from __future__ import annotations

import asyncio
import shutil
import subprocess
from pathlib import Path

from .. import config


def synthesize(text: str, out: str | None = None, voice: str | None = None) -> dict:
    """Neural TTS via edge-tts. Free, no API key; needs internet on first use."""
    config.ensure_dirs()
    dst = Path(out) if out else config.OUTPUT_DIR / "voiceover.mp3"
    dst.parent.mkdir(parents=True, exist_ok=True)
    voice = voice or config.TTS_VOICE
    try:
        import edge_tts
    except ImportError as exc:
        raise RuntimeError("edge-tts is not installed. Run: pip install edge-tts") from exc

    async def _go() -> None:
        await edge_tts.Communicate(text, voice).save(str(dst))

    try:
        asyncio.run(_go())
    except Exception as exc:
        # Offline fallback so the pipeline still produces audio.
        try:
            import pyttsx3

            engine = pyttsx3.init()
            wav = dst.with_suffix(".wav")
            engine.save_to_file(text, str(wav))
            engine.runAndWait()
            dst = wav
        except Exception:
            raise RuntimeError(
                f"TTS failed ({exc}). edge-tts needs internet; "
                "for offline use: pip install pyttsx3"
            ) from exc

    from .video import probe

    meta = probe(str(dst))
    return {"output": str(dst), "duration_sec": meta.get("duration_sec"), "voice": voice}


def play(path: str) -> bool:
    """Best-effort local playback; returns False when no player is available."""
    players = [
        ["afplay", path],                                # macOS
        ["ffplay", "-nodisp", "-autoexit", "-loglevel", "quiet", path],
        ["mpv", "--no-video", "--really-quiet", path],
        ["paplay", path],
        ["aplay", "-q", path],
    ]
    for cmd in players:
        if shutil.which(cmd[0]):
            try:
                subprocess.run(cmd, check=True, capture_output=True, timeout=600)
                return True
            except Exception:
                continue
    return False


def say(text: str, voice: str | None = None) -> dict:
    """Speak a line out loud (synthesize to a temp file, then play it)."""
    result = synthesize(text, out=str(config.OUTPUT_DIR / "_say.mp3"), voice=voice)
    result["played"] = play(result["output"])
    return result
