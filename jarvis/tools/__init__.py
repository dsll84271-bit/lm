"""Tool registry: schemas Claude sees, the dispatcher that runs them, and the
confirmation gate for consequential actions."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

from .. import config, memory

# Tools that never run without an explicit yes (unless JARVIS_AUTO_APPROVE=1).
GATED_TOOLS = {"run_command", "youtube_upload"}

# Set by the web server: there is no terminal to ask on, so gated tools are
# declined unless auto-approve was enabled at launch (`jarvis web --allow-actions`).
NON_INTERACTIVE = False


def _p(name: str, desc: str, required: bool = True) -> dict:
    return {name: {"type": "string", "description": desc}}


TOOL_SCHEMAS: list[dict] = [
    {
        "name": "run_command",
        "description": (
            "Run a shell command on the user's machine and return stdout/stderr. "
            "Use for anything the dedicated tools don't cover. Requires user "
            "confirmation before executing."
        ),
        "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string", "description": "The shell command"}},
            "required": ["command"],
        },
    },
    {
        "name": "read_file",
        "description": "Read a text file (first 50KB).",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "File path"}},
            "required": ["path"],
        },
    },
    {
        "name": "write_file",
        "description": "Write text to a file, creating parent directories. Refuses to overwrite unless overwrite=true.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Destination path"},
                "content": {"type": "string", "description": "File contents"},
                "overwrite": {"type": "boolean", "description": "Allow replacing an existing file"},
            },
            "required": ["path", "content"],
        },
    },
    {
        "name": "list_dir",
        "description": "List the contents of a directory.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "Directory path"}},
            "required": ["path"],
        },
    },
    {
        "name": "remember",
        "description": "Save a durable note to long-term memory (user preferences, channel facts, decisions). It will be available in future sessions.",
        "input_schema": {
            "type": "object",
            "properties": {"note": {"type": "string", "description": "The fact to remember"}},
            "required": ["note"],
        },
    },
    {
        "name": "speak",
        "description": "Say a short line out loud through the speakers (text-to-speech).",
        "input_schema": {
            "type": "object",
            "properties": {"text": {"type": "string", "description": "What to say"}},
            "required": ["text"],
        },
    },
    {
        "name": "video_probe",
        "description": "Get duration, resolution, and fps of a video or audio file.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "Media file path"}},
            "required": ["path"],
        },
    },
    {
        "name": "video_cut_silence",
        "description": "Edit a talking video by removing silent gaps (jump cuts). Returns the new file path and how much was removed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "out": {"type": "string", "description": "Optional output path"},
                "threshold_db": {"type": "number", "description": "Silence threshold in dB, default -35"},
                "min_silence": {"type": "number", "description": "Minimum silence length in seconds, default 0.45"},
            },
            "required": ["path"],
        },
    },
    {
        "name": "video_transcribe",
        "description": "Transcribe the speech in a video/audio file. Returns full text plus timestamped segments.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "Media file path"}},
            "required": ["path"],
        },
    },
    {
        "name": "video_caption",
        "description": "Auto-transcribe a video and burn styled captions into it (social-media style).",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["path"],
        },
    },
    {
        "name": "video_burn_srt",
        "description": "Burn an existing SRT subtitle file into a video.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "srt": {"type": "string", "description": "SRT file path"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["path", "srt"],
        },
    },
    {
        "name": "voiceover",
        "description": "Synthesize a narration MP3 from a script using a neural voice. Returns the file path and duration.",
        "input_schema": {
            "type": "object",
            "properties": {
                "script": {"type": "string", "description": "The narration text"},
                "out": {"type": "string", "description": "Optional output path (.mp3)"},
                "voice": {"type": "string", "description": "Optional edge-tts voice name"},
            },
            "required": ["script"],
        },
    },
    {
        "name": "video_assemble",
        "description": (
            "Build a narrated video from still images plus a voiceover audio file "
            "(the faceless-channel pipeline). Images are shown evenly across the "
            "narration with a slow Ken Burns zoom. Defaults to vertical 1080x1920."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "images": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Image paths in order, or a single directory path",
                },
                "audio": {"type": "string", "description": "Narration audio file"},
                "out": {"type": "string", "description": "Optional output path"},
                "width": {"type": "integer", "description": "Default 1080"},
                "height": {"type": "integer", "description": "Default 1920"},
            },
            "required": ["images", "audio"],
        },
    },
    {
        "name": "video_to_vertical",
        "description": "Convert a landscape video to 9:16 vertical (center crop) for Shorts/TikTok.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["path"],
        },
    },
    {
        "name": "video_normalize_audio",
        "description": "Normalize a video's loudness to the spoken-content standard (-16 LUFS).",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["path"],
        },
    },
    {
        "name": "video_add_music",
        "description": "Mix a background music file under a video's existing audio.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "music": {"type": "string", "description": "Music file"},
                "out": {"type": "string", "description": "Optional output path"},
                "music_volume": {"type": "number", "description": "0.0-1.0, default 0.15"},
            },
            "required": ["path", "music"],
        },
    },
    {
        "name": "video_trim",
        "description": "Cut a clip out of a video between two timestamps (seconds).",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "start": {"type": "number", "description": "Start time in seconds"},
                "end": {"type": "number", "description": "End time in seconds"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["path", "start", "end"],
        },
    },
    {
        "name": "video_concat",
        "description": "Join multiple video clips into one (re-encodes so formats can differ).",
        "input_schema": {
            "type": "object",
            "properties": {
                "paths": {"type": "array", "items": {"type": "string"}, "description": "Clips in order"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["paths"],
        },
    },
    {
        "name": "video_thumbnail",
        "description": "Extract a frame as a JPEG thumbnail.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Input video"},
                "at_sec": {"type": "number", "description": "Timestamp, default 1.0"},
                "out": {"type": "string", "description": "Optional output path"},
            },
            "required": ["path"],
        },
    },
    {
        "name": "youtube_upload",
        "description": (
            "Upload a finished video to the user's YouTube channel. Defaults to "
            "private. Requires OAuth credentials to be configured and user "
            "confirmation before running."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Video file"},
                "title": {"type": "string", "description": "Video title"},
                "description": {"type": "string", "description": "Video description"},
                "tags": {"type": "array", "items": {"type": "string"}, "description": "Tags"},
                "privacy": {"type": "string", "enum": ["private", "unlisted", "public"]},
            },
            "required": ["path", "title"],
        },
    },
]


def _confirm(action: str) -> bool:
    if config.AUTO_APPROVE:
        return True
    if NON_INTERACTIVE:
        return False
    try:
        answer = input(f"\n  ⚠ JARVIS wants to: {action}\n  Allow? [y/N] ").strip().lower()
    except EOFError:
        return False
    return answer in {"y", "yes"}


def execute(name: str, args: dict) -> tuple[str, bool]:
    """Run one tool call. Returns (result_json, is_error)."""
    try:
        if name in GATED_TOOLS:
            summary = args.get("command") or f"upload '{args.get('path')}' to YouTube ({args.get('privacy', 'private')})"
            if not _confirm(summary):
                reason = (
                    "Gated actions are off in web mode. Restart with "
                    "`python -m jarvis web --allow-actions` to enable them."
                    if NON_INTERACTIVE and not config.AUTO_APPROVE
                    else "The user declined this action."
                )
                return json.dumps({"declined": reason}), True

        result = _dispatch(name, args)
        return json.dumps(result, default=str), False
    except Exception as exc:
        return json.dumps({"error": f"{type(exc).__name__}: {exc}"}), True


def _dispatch(name: str, args: dict):
    from . import speech, video

    if name == "run_command":
        proc = subprocess.run(
            args["command"], shell=True, capture_output=True, text=True, timeout=600
        )
        return {
            "exit_code": proc.returncode,
            "stdout": proc.stdout[-8000:],
            "stderr": proc.stderr[-4000:],
        }
    if name == "read_file":
        return {"content": Path(args["path"]).read_text(encoding="utf-8", errors="replace")[:50_000]}
    if name == "write_file":
        dst = Path(args["path"])
        if dst.exists() and not args.get("overwrite"):
            raise FileExistsError(f"{dst} exists; pass overwrite=true to replace it")
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(args["content"], encoding="utf-8")
        return {"written": str(dst), "bytes": len(args["content"].encode())}
    if name == "list_dir":
        d = Path(args["path"])
        return {"entries": sorted(p.name + ("/" if p.is_dir() else "") for p in d.iterdir())}
    if name == "remember":
        return {"result": memory.remember(args["note"])}
    if name == "speak":
        return speech.say(args["text"])
    if name == "video_probe":
        return video.probe(args["path"])
    if name == "video_cut_silence":
        return video.cut_silence(
            args["path"],
            out=args.get("out"),
            threshold_db=args.get("threshold_db", -35.0),
            min_silence=args.get("min_silence", 0.45),
        )
    if name == "video_transcribe":
        from . import transcribe

        return transcribe.transcribe(args["path"])
    if name == "video_caption":
        return video.caption_video(args["path"], out=args.get("out"))
    if name == "video_burn_srt":
        return video.burn_captions(args["path"], args["srt"], out=args.get("out"))
    if name == "voiceover":
        return speech.synthesize(args["script"], out=args.get("out"), voice=args.get("voice"))
    if name == "video_assemble":
        images = args["images"]
        if isinstance(images, list) and len(images) == 1 and Path(images[0]).is_dir():
            images = images[0]
        return video.assemble_slideshow(
            images,
            args["audio"],
            out=args.get("out"),
            width=args.get("width", 1080),
            height=args.get("height", 1920),
        )
    if name == "video_to_vertical":
        return video.to_vertical(args["path"], out=args.get("out"))
    if name == "video_normalize_audio":
        return video.normalize_audio(args["path"], out=args.get("out"))
    if name == "video_add_music":
        return video.add_music(
            args["path"], args["music"], out=args.get("out"),
            music_volume=args.get("music_volume", 0.15),
        )
    if name == "video_trim":
        return video.trim(args["path"], args["start"], args["end"], out=args.get("out"))
    if name == "video_concat":
        return video.concat_videos(args["paths"], out=args.get("out"))
    if name == "video_thumbnail":
        return video.thumbnail(args["path"], at_sec=args.get("at_sec", 1.0), out=args.get("out"))
    if name == "youtube_upload":
        from . import youtube

        return youtube.upload(
            args["path"],
            args["title"],
            description=args.get("description", ""),
            tags=args.get("tags"),
            privacy=args.get("privacy", "private"),
        )
    raise ValueError(f"Unknown tool: {name}")
