"""Persistent memory: a plain markdown file JARVIS reads on boot and appends to."""

from __future__ import annotations

from datetime import date

from . import config

MAX_MEMORY_CHARS = 8000


def read_memory() -> str:
    if not config.MEMORY_FILE.exists():
        return ""
    text = config.MEMORY_FILE.read_text(encoding="utf-8").strip()
    # Keep the newest notes if the file has grown past what belongs in a prompt.
    if len(text) > MAX_MEMORY_CHARS:
        text = text[-MAX_MEMORY_CHARS:]
        text = text[text.find("\n") + 1 :]
    return text


def remember(note: str) -> str:
    config.ensure_dirs()
    line = f"- [{date.today().isoformat()}] {note.strip()}\n"
    with config.MEMORY_FILE.open("a", encoding="utf-8") as f:
        f.write(line)
    return f"Noted: {note.strip()}"
