#!/usr/bin/env bash
# Renders a documentary in chunks (resumable), then joins them and sets the loudness.
#   DOC=01 bash tools/render_doc.sh
set -euo pipefail
DOC=${DOC:-01}
OUT=renders/doc$DOC
CHUNKS=$OUT/chunks
SIZE=${CHUNK_FRAMES:-3000}
mkdir -p "$CHUNKS"
TOTAL=$(node -e "const t=require('./public/doc'+process.argv[1]+'/vo/timings.json');console.log(Math.ceil(t.seconds*30))" $DOC)
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
	npx remotion render src/index.ts Doc$DOC "$CHUNKS/part.mkv" --codec=h264-mkv --audio-codec=pcm-16 --crf=18 \
		--frames="$from-$to" --concurrency="${CONCURRENCY:-4}" --timeout=240000 "${BROWSER[@]}" > "$CHUNKS/last.log" 2>&1
	mv "$CHUNKS/part.mkv" "$CHUNKS/$name"
	echo "done $name in $(( $(date +%s) - start )) s"
done
ffmpeg -loglevel error -y -f concat -safe 0 -i "$CHUNKS/list.txt" -c:v copy \
	-af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$OUT/doc$DOC.mp4"
echo "wrote $OUT/doc$DOC.mp4"
