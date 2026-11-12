#!/usr/bin/env bash
# Renders Episode 1 in chunks (resumable), then joins them and sets the loudness.
#   bash tools/render.sh
set -euo pipefail
OUT=episodes/ep01/renders
CHUNKS=$OUT/chunks
SIZE=${CHUNK_FRAMES:-2000}
mkdir -p "$CHUNKS"
TOTAL=$(node -e "const t=require('./episodes/ep01/voiceover/timings.json');console.log(Math.round(t.seconds*30))")
BROWSER=()
if [ -n "${CHROME:-}" ]; then BROWSER=(--browser-executable "$CHROME"); fi
: > "$CHUNKS/list.txt"
for (( from = 0; from < TOTAL; from += SIZE )); do
	to=$(( from + SIZE - 1 ))
	if (( to >= TOTAL )); then to=$(( TOTAL - 1 )); fi
	name=$(printf "chunk-%05d.mkv" "$from")
	echo "file '$name'" >> "$CHUNKS/list.txt"
	[ -f "$CHUNKS/$name" ] && { echo "have $name"; continue; }
	start=$(date +%s)
	npx remotion render src/index.ts Ep01 "$CHUNKS/part.mkv" --codec=h264-mkv --audio-codec=pcm-16 \
		--frames="$from-$to" --concurrency="${CONCURRENCY:-4}" --timeout=240000 "${BROWSER[@]}" > "$CHUNKS/last.log" 2>&1
	mv "$CHUNKS/part.mkv" "$CHUNKS/$name"
	echo "done $name in $(( $(date +%s) - start )) s"
done
ffmpeg -loglevel error -y -f concat -safe 0 -i "$CHUNKS/list.txt" -c:v copy \
	-af "loudnorm=I=-15:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$OUT/ep01.mp4"
echo "wrote $OUT/ep01.mp4"
