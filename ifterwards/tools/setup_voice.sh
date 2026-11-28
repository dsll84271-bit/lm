#!/usr/bin/env bash
# Sets up the Kokoro voice on a new machine: installs the Python packages and
# downloads the voice model (about 350 MB). Run once, from the ifterwards folder:
#   bash tools/setup_voice.sh
set -euo pipefail
python3 -m venv .venv
.venv/bin/pip install -q kokoro-onnx soundfile
mkdir -p tools/models
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -f tools/models/kokoro-v1.0.onnx ] || curl -L -o tools/models/kokoro-v1.0.onnx "$base/kokoro-v1.0.onnx"
[ -f tools/models/voices-v1.0.bin ] || curl -L -o tools/models/voices-v1.0.bin "$base/voices-v1.0.bin"
echo "Voice ready."
