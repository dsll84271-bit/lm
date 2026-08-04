#!/usr/bin/env bash
# Beat-synced montage editor (Mac/Linux). First run installs the toolkit.
set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required — install it from https://www.python.org/downloads/"
  exit 1
fi

[ -d .venv ] || { echo "First run — setting things up, one moment, Sir…"; python3 -m venv .venv; }
# shellcheck disable=SC1091
source .venv/bin/activate

# The editing toolkit is a heavy optional extra, so install it on demand rather
# than burdening every JARVIS install with it.
if ! python -c "import librosa, moviepy, cv2, soundfile" >/dev/null 2>&1; then
  echo "Installing the editing toolkit. A few hundred megabytes, once only —"
  echo "go and make a coffee, Sir."
  pip install -q librosa "moviepy>=2.1" opencv-python soundfile imageio-ffmpeg
fi

echo
echo "============================================"
echo "  Beat-synced montage editor"
echo "============================================"
echo
echo "Tip: drag a file into this window to paste its path."
echo

read -r -p "  Movie file    : " VIDEO
VIDEO="${VIDEO%\"}"; VIDEO="${VIDEO#\"}"; VIDEO="${VIDEO%\'}"; VIDEO="${VIDEO#\'}"
[ -f "$VIDEO" ] || { echo; echo "I cannot find that file. Drag it in rather than typing the path."; exit 1; }

read -r -p "  Music track   : " AUDIO
AUDIO="${AUDIO%\"}"; AUDIO="${AUDIO#\"}"; AUDIO="${AUDIO%\'}"; AUDIO="${AUDIO#\'}"
[ -f "$AUDIO" ] || { echo; echo "I cannot find that file. Drag it in rather than typing the path."; exit 1; }

read -r -p "  Save as       : " OUT
OUT="${OUT:-edit.mp4}"
OUT="${OUT%\"}"; OUT="${OUT#\"}"

echo
echo "Bake the music into the file, or leave it silent so you can add the"
echo "licensed track inside TikTok? Silent is the safer option — in-app audio"
echo "is never muted."
read -r -p "  Leave it silent? [Y/n] : " SILENT
case "$SILENT" in
  [nN]*) SILENTFLAG="" ;;
  *)     SILENTFLAG="--silent-video" ;;
esac

# Plan first. On a feature-length film the scan is the slow part, so the plan is
# saved to an EDL and the render reuses it instead of scanning twice.
echo
echo "Planning the edit. Nothing is rendered yet — this reads the music and"
echo "scans the film for action, which can take 20–30 minutes on a long movie."
echo
python auto_editor.py --video "$VIDEO" --audio "$AUDIO" --output "$OUT" --ramp --dry-run

EDL="${OUT%.*}.edl.json"

echo
read -r -p "  Happy with that plan? Render it now? [Y/n] : " GO
case "$GO" in
  [nN]*)
    echo
    echo "Stopped. The plan is saved at $EDL"
    echo "Render it later with:"
    echo "   python auto_editor.py --from-edl \"$EDL\" --output \"$OUT\" $SILENTFLAG"
    exit 0
    ;;
esac

echo
# shellcheck disable=SC2086
python auto_editor.py --from-edl "$EDL" --output "$OUT" $SILENTFLAG --ramp

echo
echo "Done, Sir. Your edit: $OUT"
