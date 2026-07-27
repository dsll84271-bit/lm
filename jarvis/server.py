"""Local web HUD for JARVIS: `python -m jarvis web` then open http://localhost:7870

Stdlib-only server. The browser supplies the microphone (speech recognition)
and the speakers (speech synthesis), so voice works with no extra setup.
"""

from __future__ import annotations

import json
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from . import config
from . import tools as tool_registry

INDEX = Path(__file__).parent / "web" / "index.html"

_jarvis = None
_jarvis_err: str | None = None
_lock = threading.Lock()


def _get_jarvis():
    global _jarvis, _jarvis_err
    if _jarvis is None and _jarvis_err is None:
        try:
            from .agent import Jarvis

            _jarvis = Jarvis()
        except Exception as exc:
            _jarvis_err = f"{type(exc).__name__}: {exc}"
    return _jarvis


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):  # keep the terminal clean
        pass

    def _json(self, obj, code: int = 200) -> None:
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in {"/", "/index.html"}:
            body = INDEX.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/api/status":
            import os

            has_key = bool(
                os.environ.get("ANTHROPIC_API_KEY")
                or os.environ.get("ANTHROPIC_AUTH_TOKEN")
                or (Path.home() / ".config" / "anthropic").exists()  # `ant auth login`
            )
            self._json(
                {
                    "model": config.MODEL,
                    "has_key": has_key,
                    "allow_actions": config.AUTO_APPROVE,
                    "greeting": f"All systems online, {config.USER_TITLE}. How can I help?",
                }
            )
        else:
            self._json({"error": "not found"}, 404)

    def do_POST(self):
        if self.path == "/api/reset":
            jarvis = _get_jarvis()
            if jarvis is not None:
                with _lock:
                    jarvis.reset()
            self._json({"ok": True})
            return
        if self.path != "/api/chat":
            self._json({"error": "not found"}, 404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            message = str(payload.get("message", "")).strip()
            if not message:
                self._json({"error": "Empty message"}, 400)
                return

            jarvis = _get_jarvis()
            if jarvis is None:
                self._json({"error": f"JARVIS could not start: {_jarvis_err}. "
                                     "Set ANTHROPIC_API_KEY and restart."})
                return

            events: list[dict] = []

            def on_tool(name: str, brief: str, ok: bool) -> None:
                events.append({"tool": name, "brief": brief, "ok": ok})

            with _lock:  # one conversation, one turn at a time
                reply = jarvis.ask(message, on_text=lambda t: None, on_tool=on_tool)
            self._json({"reply": reply, "events": events})
        except Exception as exc:
            self._json({"error": f"{type(exc).__name__}: {exc}"})


def serve(port: int = 7870, open_browser: bool = True) -> None:
    config.ensure_dirs()
    tool_registry.NON_INTERACTIVE = True  # web mode: gated tools need --allow-actions
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://localhost:{port}"
    print(f"\n  JARVIS HUD online at {url}")
    print("  Voice input needs Chrome or Edge. Ctrl-C to shut down.\n")
    if open_browser:
        try:
            webbrowser.open(url)
        except Exception:
            pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  JARVIS powering down.")
