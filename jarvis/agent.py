"""The agent core: a manual tool-use loop over the Anthropic Messages API.

Streams text live, executes tool calls through the registry (with confirmation
gates), and keeps looping until Claude finishes the task.
"""

from __future__ import annotations

import sys

import anthropic

from . import config
from .personality import system_prompt
from .tools import TOOL_SCHEMAS, execute


class Jarvis:
    def __init__(self, speak_replies: bool = False):
        self.client = anthropic.Anthropic()  # ANTHROPIC_API_KEY / ant auth profile
        self.messages: list[dict] = []
        self.speak_replies = speak_replies

    # ------------------------------------------------------------------
    def ask(self, user_text: str, on_text=None) -> str:
        """Send one user turn and run the agentic loop to completion.

        `on_text` receives streamed text deltas (defaults to stdout).
        Returns the final assistant text.
        """
        if on_text is None:
            on_text = lambda t: (sys.stdout.write(t), sys.stdout.flush())

        self.messages.append({"role": "user", "content": user_text})
        final_text_parts: list[str] = []

        for _ in range(config.MAX_TOOL_TURNS):
            with self.client.messages.stream(
                model=config.MODEL,
                max_tokens=config.MAX_TOKENS,
                system=system_prompt(),
                thinking={"type": "adaptive"},
                output_config={"effort": config.EFFORT},
                tools=TOOL_SCHEMAS,
                messages=self.messages,
            ) as stream:
                for event in stream:
                    if (
                        event.type == "content_block_delta"
                        and event.delta.type == "text_delta"
                    ):
                        on_text(event.delta.text)
                response = stream.get_final_message()

            if response.stop_reason == "refusal":
                note = "I can't help with that request."
                if response.stop_details and response.stop_details.explanation:
                    note = response.stop_details.explanation
                on_text(f"\n{note}\n")
                self.messages.append({"role": "assistant", "content": response.content})
                return note

            self.messages.append({"role": "assistant", "content": response.content})
            final_text_parts = [b.text for b in response.content if b.type == "text"]

            if response.stop_reason == "pause_turn":
                continue  # server-side turn paused; re-send to resume

            if response.stop_reason != "tool_use":
                break

            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue
                on_text(f"\n  ⚙ {block.name}({_brief(block.input)})\n")
                result, is_error = execute(block.name, block.input)
                if is_error:
                    on_text(f"  ✗ {result[:300]}\n")
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

        text = "".join(final_text_parts).strip()
        if self.speak_replies and text:
            from .tools.speech import say

            try:
                say(text[:600])
            except Exception:
                pass  # never let audio problems kill the session
        return text


def _brief(tool_input: dict) -> str:
    s = ", ".join(f"{k}={str(v)[:60]!r}" for k, v in tool_input.items())
    return s if len(s) <= 140 else s[:140] + "…"
