"""Speech-to-text via faster-whisper (optional dependency)."""

from __future__ import annotations

from pathlib import Path


def _format_ts(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _load_model():
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise RuntimeError(
            "faster-whisper is not installed. Run: pip install faster-whisper"
        ) from exc
    from .. import config

    return WhisperModel(config.WHISPER_MODEL, device="cpu", compute_type="int8")


def transcribe(path: str) -> dict:
    """Full transcript with word-level segments."""
    if not Path(path).exists():
        raise FileNotFoundError(path)
    model = _load_model()
    segments, info = model.transcribe(path, beam_size=1, vad_filter=True, word_timestamps=True)
    out = []
    for seg in segments:
        out.append({"start": round(seg.start, 2), "end": round(seg.end, 2), "text": seg.text.strip()})
    return {
        "language": info.language,
        "duration_sec": round(info.duration, 1),
        "segments": out,
        "text": " ".join(s["text"] for s in out),
    }


def transcribe_to_srt(path: str, srt_out: str, max_chars: int = 42) -> dict:
    """Transcribe and write short, social-style caption lines to an SRT file."""
    if not Path(path).exists():
        raise FileNotFoundError(path)
    model = _load_model()
    segments, info = model.transcribe(path, beam_size=1, vad_filter=True, word_timestamps=True)

    # Re-chunk by words so caption lines stay short enough to read on a phone.
    entries: list[tuple[float, float, str]] = []
    cur_words: list = []
    for seg in segments:
        for word in seg.words or []:
            cur_words.append(word)
            text = "".join(w.word for w in cur_words).strip()
            if len(text) >= max_chars or word.word.strip().endswith((".", "?", "!")):
                entries.append((cur_words[0].start, cur_words[-1].end, text))
                cur_words = []
    if cur_words:
        text = "".join(w.word for w in cur_words).strip()
        entries.append((cur_words[0].start, cur_words[-1].end, text))

    lines = []
    for i, (start, end, text) in enumerate(entries, 1):
        lines.append(f"{i}\n{_format_ts(start)} --> {_format_ts(end)}\n{text}\n")
    Path(srt_out).parent.mkdir(parents=True, exist_ok=True)
    Path(srt_out).write_text("\n".join(lines), encoding="utf-8")
    return {"srt": srt_out, "captions": len(entries), "language": info.language}
