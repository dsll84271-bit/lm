#!/usr/bin/env bash
# Start JARVIS (Mac/Linux). First run sets everything up and asks for your API key.
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required — install it from https://www.python.org/downloads/"
  exit 1
fi

[ -d .venv ] || { echo "First run — setting things up, one moment, Sir…"; python3 -m venv .venv; }
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

ENV_FILE="$HOME/.jarvis/env"
[ -f "$ENV_FILE" ] && source "$ENV_FILE"
if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo
  echo "I need an Anthropic API key to think with."
  echo "Get one at https://console.anthropic.com  (Settings → API keys)"
  echo
  printf "Paste key here and press Enter: "
  read -r ANTHROPIC_API_KEY
  mkdir -p "$HOME/.jarvis"
  printf 'export ANTHROPIC_API_KEY=%s\n' "$ANTHROPIC_API_KEY" > "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  export ANTHROPIC_API_KEY
fi

exec python3 -m jarvis web
