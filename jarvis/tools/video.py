"""Video production toolkit built on ffmpeg.

Every function is usable directly (CLI: `python -m jarvis video ...`) and is
also exposed to the agent as a tool. No function ever overwrites its input.
"""

from __future__ import annotations

import json
import re
import subprocess
import tempfile
from pathlib import Path

from .. import config

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def _run(args: list[str], timeout: int = 1800) -> subprocess.CompletedProcess:
    proc = subprocess.run(
        [config.ffmpeg_path(), "-hide_banner", "-y", *args],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    if proc.returncode != 0:
        tail = proc.stderr.strip().splitlines()[-8:]
        raise RuntimeError("ffmpeg failed:\n" + "\n".join(tail))
    return proc


def probe(path: str) -> dict:
    """Duration, resolution, and fps parsed from ffmpeg's stream info."""
    src = Path(path)
    if not src.exists():
        raise FileNotFoundError(path)
    proc = subprocess.run(
        [config.ffmpeg_path(), "-hide_banner", "-i", str(src)],
        capture_output=True,
        text=True,
    )
    info = proc.stderr  # ffmpeg prints stream info to stderr and exits non-zero
    out: dict = {"path": str(src), "size_bytes": src.stat().st_size}
    if m := re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", info):
        h, mnt, s = m.groups()
        out["duration_sec"] = round(int(h) * 3600 + int(mnt) * 60 + float(s), 2)
    if m := re.search(r"Video:.*?\s(\d{2,5})x(\d{2,5})", info):
        out["width"], out["height"] = int(m.group(1)), int(m.group(2))
    if m := re.search(r"([\d.]+)\s*fps", info):
        out["fps"] = float(m.group(1))
    out["has_audio"] = "Audio:" in info
    return out


def _out_path(out: str | None, stem: str, suffix: str) -> Path:
    if out:
        p = Path(out)
        p.parent.mkdir(parents=True, exist_ok=True)
        return p
    config.ensure_dirs()
    return config.OUTPUT_DIR / f"{stem}{suffix}"


# ---------------------------------------------------------------------------
# Silence cutting (jump-cut editing)
# ---------------------------------------------------------------------------

def detect_silences(path: str, threshold_db: float = -35.0, min_silence: float = 0.45) -> list[tuple[float, float]]:
    proc = subprocess.run(
        [
            config.ffmpeg_path(), "-hide_banner", "-i", path,
            "-af", f"silencedetect=noise={threshold_db}dB:d={min_silence}",
            "-f", "null", "-",
        ],
        capture_output=True,
        text=True,
    )
    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", proc.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", proc.stderr)]
    return list(zip(starts, ends))


def cut_silence(
    path: str,
    out: str | None = None,
    threshold_db: float = -35.0,
    min_silence: float = 0.45,
    padding: float = 0.12,
) -> dict:
    """Remove silent gaps, keeping `padding` seconds around speech (jump cuts)."""
    meta = probe(path)
    duration = meta.get("duration_sec")
    if not duration:
        raise RuntimeError(f"Could not read duration of {path}")
    silences = detect_silences(path, threshold_db, min_silence)

    # Invert silences into keep-segments, padded so cuts don't clip words.
    keep: list[tuple[float, float]] = []
    cursor = 0.0
    for s_start, s_end in silences:
        seg_end = min(s_start + padding, duration)
        if seg_end - cursor > 0.05:
            keep.append((cursor, seg_end))
        cursor = max(s_end - padding, cursor)
    if duration - cursor > 0.05:
        keep.append((cursor, duration))

    dst = _out_path(out, Path(path).stem + "_cut", ".mp4")
    if not silences or not keep:
        _run(["-i", path, "-c", "copy", str(dst)])
        return {"output": str(dst), "segments": 1, "removed_sec": 0.0}

    # trim+concat filter graph, written to a script file so segment count
    # never overflows the argv limit.
    parts, refs = [], []
    for i, (a, b) in enumerate(keep):
        parts.append(f"[0:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS[v{i}];")
        parts.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS[a{i}];")
        refs.append(f"[v{i}][a{i}]")
    parts.append(f"{''.join(refs)}concat=n={len(keep)}:v=1:a=1[v][a]")
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write("".join(parts))
        script = f.name

    _run([
        "-i", path,
        "-filter_complex_script", script,
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(dst),
    ])
    kept = sum(b - a for a, b in keep)
    return {
        "output": str(dst),
        "segments": len(keep),
        "kept_sec": round(kept, 1),
        "removed_sec": round(duration - kept, 1),
    }


# ---------------------------------------------------------------------------
# Captions
# ---------------------------------------------------------------------------

def burn_captions(
    path: str,
    srt: str,
    out: str | None = None,
    font_size: int = 14,
    margin_v: int = 40,
) -> dict:
    """Burn an SRT file into the video, styled for social (bold, outlined, centered)."""
    if not Path(srt).exists():
        raise FileNotFoundError(srt)
    dst = _out_path(out, Path(path).stem + "_captioned", ".mp4")
    style = (
        f"FontSize={font_size},Bold=1,Outline=1.5,Shadow=0.5,"
        f"PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
        f"Alignment=2,MarginV={margin_v}"
    )
    # The subtitles filter parses ':' and '\' specially; escape the path.
    srt_escaped = str(Path(srt)).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    _run([
        "-i", path,
        "-vf", f"subtitles='{srt_escaped}':force_style='{style}'",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "copy",
        str(dst),
    ])
    return {"output": str(dst)}


def caption_video(path: str, out: str | None = None, max_chars: int = 42) -> dict:
    """Transcribe speech and burn the result as captions (needs faster-whisper)."""
    from .transcribe import transcribe_to_srt

    srt = str(_out_path(None, Path(path).stem, ".srt"))
    result = transcribe_to_srt(path, srt, max_chars=max_chars)
    burned = burn_captions(path, srt, out)
    return {"output": burned["output"], "srt": srt, "language": result.get("language")}


# ---------------------------------------------------------------------------
# Voiceover + slideshow assembly (the "faceless video" pipeline)
# ---------------------------------------------------------------------------

def assemble_slideshow(
    images: list[str] | str,
    audio: str,
    out: str | None = None,
    width: int = 1080,
    height: int = 1920,
    ken_burns: bool = True,
    fps: int = 30,
) -> dict:
    """Narrated video from still images: each image covers an equal slice of the
    audio, scaled to fill the frame, with a slow Ken Burns zoom."""
    if isinstance(images, str):
        d = Path(images)
        if not d.is_dir():
            raise FileNotFoundError(images)
        images = sorted(str(p) for p in d.iterdir() if p.suffix.lower() in IMAGE_EXTS)
    if not images:
        raise ValueError("No images supplied")
    for img in images:
        if not Path(img).exists():
            raise FileNotFoundError(img)

    audio_meta = probe(audio)
    total = audio_meta.get("duration_sec")
    if not total:
        raise RuntimeError(f"Could not read duration of audio {audio}")
    per_image = total / len(images)

    dst = _out_path(out, "slideshow", ".mp4")
    args: list[str] = []
    for img in images:
        args += ["-loop", "1", "-t", f"{per_image:.3f}", "-i", img]
    args += ["-i", audio]

    parts, refs = [], []
    frames = max(int(per_image * fps), 1)
    for i in range(len(images)):
        # Cover-fit at 2x resolution first so the zoom has pixels to work with.
        chain = (
            f"[{i}:v]scale={width * 2}:{height * 2}:force_original_aspect_ratio=increase,"
            f"crop={width * 2}:{height * 2}"
        )
        if ken_burns:
            zoom_dir = "zoom+0.0006" if i % 2 == 0 else "if(eq(on,1),1.09,zoom-0.0006)"
            chain += (
                f",zoompan=z='{zoom_dir}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                f":d={frames}:s={width}x{height}:fps={fps}"
            )
        else:
            chain += f",scale={width}:{height},fps={fps}"
        chain += f",setsar=1[v{i}];"
        parts.append(chain)
        refs.append(f"[v{i}]")
    parts.append(f"{''.join(refs)}concat=n={len(images)}:v=1:a=0[v]")

    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write("".join(parts))
        script = f.name

    _run([
        *args,
        "-filter_complex_script", script,
        "-map", "[v]", "-map", f"{len(images)}:a",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        str(dst),
    ], timeout=3600)
    return {"output": str(dst), "images": len(images), "duration_sec": round(total, 1)}


# ---------------------------------------------------------------------------
# Format conversions
# ---------------------------------------------------------------------------

def to_vertical(path: str, out: str | None = None, width: int = 1080, height: int = 1920) -> dict:
    """Center-crop to 9:16 and scale — landscape footage into Shorts/TikTok format."""
    dst = _out_path(out, Path(path).stem + "_vertical", ".mp4")
    vf = (
        f"crop='min(iw,ih*{width}/{height})':'min(ih,iw*{height}/{width})',"
        f"scale={width}:{height},setsar=1"
    )
    _run([
        "-i", path, "-vf", vf,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(dst),
    ])
    return {"output": str(dst)}


def normalize_audio(path: str, out: str | None = None) -> dict:
    """EBU R128 loudness normalization to -16 LUFS (spoken-content standard)."""
    dst = _out_path(out, Path(path).stem + "_norm", ".mp4")
    _run([
        "-i", path,
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        str(dst),
    ])
    return {"output": str(dst)}


def add_music(path: str, music: str, out: str | None = None, music_volume: float = 0.15) -> dict:
    """Mix a music bed under the existing audio, looping it to fit."""
    dst = _out_path(out, Path(path).stem + "_music", ".mp4")
    _run([
        "-i", path, "-stream_loop", "-1", "-i", music,
        "-filter_complex",
        f"[1:a]volume={music_volume}[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=2[a]",
        "-map", "0:v", "-map", "[a]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        str(dst),
    ])
    return {"output": str(dst)}


def thumbnail(path: str, at_sec: float = 1.0, out: str | None = None) -> dict:
    dst = _out_path(out, Path(path).stem + "_thumb", ".jpg")
    _run(["-ss", f"{at_sec:.2f}", "-i", path, "-frames:v", "1", "-q:v", "2", str(dst)])
    return {"output": str(dst)}


def trim(path: str, start: float, end: float, out: str | None = None) -> dict:
    dst = _out_path(out, Path(path).stem + f"_trim", ".mp4")
    _run([
        "-ss", f"{start:.3f}", "-to", f"{end:.3f}", "-i", path,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(dst),
    ])
    return {"output": str(dst)}


def concat_videos(paths: list[str], out: str | None = None) -> dict:
    """Concatenate clips, re-encoding so mismatched sources still join cleanly."""
    if len(paths) < 2:
        raise ValueError("Need at least two videos to concatenate")
    first = probe(paths[0])
    w, h = first.get("width", 1920), first.get("height", 1080)
    dst = _out_path(out, "joined", ".mp4")
    args: list[str] = []
    for p in paths:
        args += ["-i", p]
    parts, refs = [], []
    for i in range(len(paths)):
        parts.append(
            f"[{i}:v]scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v{i}];"
            f"[{i}:a]aresample=44100[a{i}];"
        )
        refs.append(f"[v{i}][a{i}]")
    parts.append(f"{''.join(refs)}concat=n={len(paths)}:v=1:a=1[v][a]")
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write("".join(parts))
        script = f.name
    _run([
        *args,
        "-filter_complex_script", script,
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(dst),
    ], timeout=3600)
    return {"output": str(dst), "clips": len(paths)}
