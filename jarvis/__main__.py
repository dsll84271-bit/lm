"""JARVIS command-line interface.

  python -m jarvis                          chat (REPL)
  python -m jarvis --voice                  chat, replies spoken aloud
  python -m jarvis do "task"                one-shot autonomous task
  python -m jarvis speak "text"             say a line
  python -m jarvis video <cmd> ...          direct video pipeline (no API key needed)
"""

from __future__ import annotations

import argparse
import json
import sys

from . import config

BANNER = r"""
     ██╗ █████╗ ██████╗ ██╗   ██╗██╗███████╗
     ██║██╔══██╗██╔══██╗██║   ██║██║██╔════╝
     ██║███████║██████╔╝██║   ██║██║███████╗
██   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║
╚█████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝
 Just A Rather Very Intelligent System
"""


def _print_json(obj) -> None:
    print(json.dumps(obj, indent=2, default=str))


def cmd_chat(args) -> int:
    from .agent import Jarvis

    print(BANNER)
    print(f"  Model: {config.MODEL} · effort {config.EFFORT}"
          f" · auto-approve {'ON' if config.AUTO_APPROVE else 'off'}")
    print("  Type your request. Ctrl-D or 'exit' to leave.\n")
    jarvis = Jarvis(speak_replies=args.voice)
    greeting = f"All systems online, {config.USER_TITLE}. How can I help?"
    print(f"JARVIS: {greeting}\n")
    if args.voice:
        from .tools.speech import say

        try:
            say(greeting)
        except Exception:
            pass

    while True:
        try:
            user = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nJARVIS: Powering down. Goodbye.")
            return 0
        if not user:
            continue
        if user.lower() in {"exit", "quit", "bye"}:
            print("JARVIS: Goodbye.")
            return 0
        print("JARVIS: ", end="", flush=True)
        try:
            jarvis.ask(user)
        except Exception as exc:
            print(f"\n[error] {type(exc).__name__}: {exc}")
        print("\n")


def cmd_do(args) -> int:
    from .agent import Jarvis

    jarvis = Jarvis(speak_replies=args.voice)
    try:
        jarvis.ask(args.task)
        print()
        return 0
    except Exception as exc:
        print(f"[error] {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1


def cmd_speak(args) -> int:
    from .tools.speech import say

    result = say(args.text, voice=args.voice_name)
    if not result.get("played"):
        print(f"(no audio player found — saved to {result['output']})")
    return 0


def cmd_video(args) -> int:
    from .tools import video

    try:
        if args.vcmd == "probe":
            _print_json(video.probe(args.input))
        elif args.vcmd == "cut-silence":
            _print_json(video.cut_silence(
                args.input, out=args.out,
                threshold_db=args.threshold, min_silence=args.min_silence,
            ))
        elif args.vcmd == "caption":
            _print_json(video.caption_video(args.input, out=args.out))
        elif args.vcmd == "burn-srt":
            _print_json(video.burn_captions(args.input, args.srt, out=args.out))
        elif args.vcmd == "transcribe":
            from .tools import transcribe

            _print_json(transcribe.transcribe(args.input))
        elif args.vcmd == "voiceover":
            from .tools import speech

            script = args.text
            if script.startswith("@"):
                with open(script[1:], encoding="utf-8") as f:
                    script = f.read()
            _print_json(speech.synthesize(script, out=args.out, voice=args.voice_name))
        elif args.vcmd == "assemble":
            images = args.images if len(args.images) > 1 else args.images[0]
            _print_json(video.assemble_slideshow(
                images, args.audio, out=args.out,
                width=args.width, height=args.height,
            ))
        elif args.vcmd == "vertical":
            _print_json(video.to_vertical(args.input, out=args.out))
        elif args.vcmd == "normalize":
            _print_json(video.normalize_audio(args.input, out=args.out))
        elif args.vcmd == "music":
            _print_json(video.add_music(args.input, args.music, out=args.out, music_volume=args.volume))
        elif args.vcmd == "trim":
            _print_json(video.trim(args.input, args.start, args.end, out=args.out))
        elif args.vcmd == "concat":
            _print_json(video.concat_videos(args.inputs, out=args.out))
        elif args.vcmd == "thumbnail":
            _print_json(video.thumbnail(args.input, at_sec=args.at, out=args.out))
        return 0
    except Exception as exc:
        print(f"[error] {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="jarvis", description="JARVIS — voice + video AI assistant")
    p.add_argument("--voice", action="store_true", help="speak replies aloud")
    sub = p.add_subparsers(dest="cmd")

    d = sub.add_parser("do", help="run one task autonomously")
    d.add_argument("task")
    d.add_argument("--voice", action="store_true")

    s = sub.add_parser("speak", help="say a line out loud")
    s.add_argument("text")
    s.add_argument("--voice-name", default=None)

    v = sub.add_parser("video", help="video pipeline (works without an API key)")
    vs = v.add_subparsers(dest="vcmd", required=True)

    x = vs.add_parser("probe"); x.add_argument("input")
    x = vs.add_parser("cut-silence"); x.add_argument("input"); x.add_argument("--out")
    x.add_argument("--threshold", type=float, default=-35.0)
    x.add_argument("--min-silence", type=float, default=0.45)
    x = vs.add_parser("caption"); x.add_argument("input"); x.add_argument("--out")
    x = vs.add_parser("burn-srt"); x.add_argument("input"); x.add_argument("srt"); x.add_argument("--out")
    x = vs.add_parser("transcribe"); x.add_argument("input")
    x = vs.add_parser("voiceover"); x.add_argument("text", help="script text, or @file.txt")
    x.add_argument("--out"); x.add_argument("--voice-name", default=None)
    x = vs.add_parser("assemble"); x.add_argument("audio")
    x.add_argument("images", nargs="+", help="image files in order, or one directory")
    x.add_argument("--out"); x.add_argument("--width", type=int, default=1080)
    x.add_argument("--height", type=int, default=1920)
    x = vs.add_parser("vertical"); x.add_argument("input"); x.add_argument("--out")
    x = vs.add_parser("normalize"); x.add_argument("input"); x.add_argument("--out")
    x = vs.add_parser("music"); x.add_argument("input"); x.add_argument("music")
    x.add_argument("--out"); x.add_argument("--volume", type=float, default=0.15)
    x = vs.add_parser("trim"); x.add_argument("input")
    x.add_argument("start", type=float); x.add_argument("end", type=float); x.add_argument("--out")
    x = vs.add_parser("concat"); x.add_argument("inputs", nargs="+"); x.add_argument("--out")
    x = vs.add_parser("thumbnail"); x.add_argument("input")
    x.add_argument("--at", type=float, default=1.0); x.add_argument("--out")
    return p


def main() -> int:
    config.ensure_dirs()
    parser = build_parser()
    args = parser.parse_args()
    if args.cmd == "do":
        return cmd_do(args)
    if args.cmd == "speak":
        return cmd_speak(args)
    if args.cmd == "video":
        return cmd_video(args)
    return cmd_chat(args)


if __name__ == "__main__":
    raise SystemExit(main())
