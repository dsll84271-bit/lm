#!/usr/bin/env bash
# Renders the whole of Episode 1 in chunks, then joins them into one file.
# If it is interrupted, run it again: finished chunks are kept and skipped.
#   bash tools/render_episode.sh
# Set CHROME to a browser path if Remotion's own browser is not installed.
set -euo pipefail
OUT=episodes/ep01/renders
CHUNKS=$OUT/chunks
SIZE=${CHUNK_FRAMES:-800}
mkdir -p "$CHUNKS"
TOTAL=$(npx --yes tsx -e "import {TIMELINE} from './episodes/ep01/timeline'; console.log(TIMELINE.total)" | tail -1)
echo "episode is $TOTAL frames ($(( TOTAL / 30 / 60 )) min $(( TOTAL / 30 % 60 )) s)"
BROWSER=()
if [ -n "${CHROME:-}" ]; then BROWSER=(--browser-executable "$CHROME"); fi
: > "$CHUNKS/list.txt"
for (( from = 0; from < TOTAL; from += SIZE )); do
	to=$(( from + SIZE - 1 ))
	if (( to >= TOTAL )); then to=$(( TOTAL - 1 )); fi
	name=$(printf "chunk-%05d.mkv" "$from")
	echo "file '$name'" >> "$CHUNKS/list.txt"
	if [ -f "$CHUNKS/$name" ]; then
		echo "have $name"
		continue
	fi
	start=$(date +%s)
	npx remotion render src/index.ts Ep01 "$CHUNKS/part.mkv" --codec=h264-mkv --audio-codec=pcm-16 \
		--frames="$from-$to" --concurrency="${CONCURRENCY:-4}" --timeout=240000 "${BROWSER[@]}" > "$CHUNKS/last.log" 2>&1
	mv "$CHUNKS/part.mkv" "$CHUNKS/$name"
	echo "done $name (frames $from-$to) in $(( $(date +%s) - start )) s"
done
# The sound is lifted to about -16 LUFS, a normal level for YouTube, with a limiter to catch the peaks.
ffmpeg -loglevel error -y -f concat -safe 0 -i "$CHUNKS/list.txt" -c:v copy -af "volume=6dB,alimiter=limit=0.84:level=false" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$OUT/ep01.mp4"
echo "wrote $OUT/ep01.mp4"
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT/ep01.mp4"
