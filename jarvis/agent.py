"""The agent core: a manual tool-use loop over the Anthropic Messages API.

Streams text live, executes tool calls through the registry (with confirmation
gates), lets Claude use Anthropic's server-side web search/fetch, and persists
the conversation so JARVIS remembers where you left off after a restart.
"""

from __future__ import annotations

import json
import sys

import anthropic

from . import config
from .personality import system_prompt
from .tools import TOOL_SCHEMAS, execute

# Anthropic-hosted tools: searches run on Anthropic's servers, results come
# back inside the same response. This is how JARVIS reaches the internet.
SERVER_TOOLS = [
    {"type": "web_search_20260209", "name": "web_search", "max_uses": 5},
    {"type": "web_fetch_20260209", "name": "web_fetch", "max_uses": 10},
]

HISTORY_FILE = config.HOME / "history.json"
MAX_HISTORY_MESSAGES = 40


class Jarvis:
    def __init__(self, speak_replies: bool = False, persist: bool = True):
        self.client = anthropic.Anthropic()  # ANTHROPIC_API_KEY / ant auth profile
        self.speak_replies = speak_replies
        self.persist = persist and config.PERSIST
        self.web_enabled = config.WEB_TOOLS
        self.messages: list = _load_history() if self.persist else []

    # ------------------------------------------------------------------
    def reset(self) -> None:
        self.messages = []
        if HISTORY_FILE.exists():
            HISTORY_FILE.unlink()

    # ------------------------------------------------------------------
    def ask(self, user_text: str, on_text=None, on_tool=None) -> str:
        """Send one user turn and run the agentic loop to completion.

        `on_text` receives streamed text deltas (defaults to stdout).
        `on_tool(name, brief, ok)` is called after each tool execution.
        Returns the final assistant text.
        """
        if on_text is None:
            on_text = lambda t: (sys.stdout.write(t), sys.stdout.flush())

        self.messages.append({"role": "user", "content": user_text})
        final_text_parts: list[str] = []

        for _ in range(config.MAX_TOOL_TURNS):
            response = self._request(on_text)

            if response.stop_reason == "refusal":
                note = "I can't help with that request."
                if response.stop_details and response.stop_details.explanation:
                    note = response.stop_details.explanation
                on_text(f"\n{note}\n")
                self.messages.append({"role": "assistant", "content": response.content})
                self._save()
                return note

            self.messages.append({"role": "assistant", "content": response.content})
            final_text_parts = [b.text for b in response.content if b.type == "text"]

            if response.stop_reason == "pause_turn":
                continue  # server-side tool turn paused; re-send to resume

            if response.stop_reason != "tool_use":
                break

            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue  # server_tool_use etc. already ran on Anthropic's side
                on_text(f"\n  ⚙ {block.name}({_brief(block.input)})\n")
                result, is_error = execute(block.name, block.input)
                if is_error:
                    on_text(f"  ✗ {result[:300]}\n")
                if on_tool:
                    on_tool(block.name, _brief(block.input), not is_error)
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                        "is_error": is_error,
                    }
                )
            self.messages.append({"role": "user", "content": tool_results})
        else:
            on_text("\n[Stopped: hit the tool-turn limit for one request.]\n")

        self._save()
        text = "".join(final_text_parts).strip()
        if self.speak_replies and text:
            from .tools.speech import say

            try:
                say(text[:600])
            except Exception:
                pass  # never let audio problems kill the session
        return text

    # ------------------------------------------------------------------
    def _request(self, on_text):
        tools = TOOL_SCHEMAS + (SERVER_TOOLS if self.web_enabled else [])
        try:
            return self._stream_once(tools, on_text)
        except anthropic.BadRequestError as exc:
            # Orgs without web-tool access get a 400 — drop them and carry on.
            if self.web_enabled and ("web_search" in str(exc) or "web_fetch" in str(exc)):
                self.web_enabled = False
                return self._stream_once(TOOL_SCHEMAS, on_text)
            raise

    def _stream_once(self, tools, on_text):
        with self.client.messages.stream(
            model=config.MODEL,
            max_tokens=config.MAX_TOKENS,
            system=system_prompt(web_enabled=self.web_enabled),
            thinking={"type": "adaptive"},
            output_config={"effort": config.EFFORT},
            tools=tools,
            messages=self.messages,
        ) as stream:
            for event in stream:
                if (
                    event.type == "content_block_delta"
                    and event.delta.type == "text_delta"
                ):
                    on_text(event.delta.text)
            return stream.get_final_message()

    # ------------------------------------------------------------------
    def _save(self) -> None:
        if not self.persist:
            return
        try:
            config.ensure_dirs()
            serializable = [_to_dict(m) for m in self.messages]
            HISTORY_FILE.write_text(
                json.dumps(serializable, default=str), encoding="utf-8"
            )
        except Exception:
            pass  # persistence is best-effort; never break the conversation


def _to_dict(message) -> dict:
    content = message["content"]
    if isinstance(content, str):
        return {"role": message["role"], "content": content}
    blocks = []
    for b in content:
        blocks.append(b if isinstance(b, dict) else b.model_dump(exclude_none=True))
    return {"role": message["role"], "content": blocks}


def _load_history() -> list:
    try:
        if not HISTORY_FILE.exists():
            return []
        messages = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        return _trim(messages)
    except Exception:
        return []


def _trim(messages: list) -> list:
    """Keep recent history, cut only at a clean boundary: the conversation must
    start with a plain user text message (never an orphaned tool_result)."""
    messages = messages[-MAX_HISTORY_MESSAGES:]
    while messages and not (
        messages[0].get("role") == "user" and isinstance(messages[0].get("content"), str)
    ):
        messages.pop(0)
    return messages


def _brief(tool_input: dict) -> str:
    s = ", ".join(f"{k}={str(v)[:60]!r}" for k, v in tool_input.items())
    return s if len(s) <= 140 else s[:140] + "…"
