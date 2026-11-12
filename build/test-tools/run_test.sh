#!/bin/bash
# Build the web platform in debug mode, serve it and drive it in headless Chromium with drive.mjs.
# usage: build/test-tools/run_test.sh <name> '<steps-json>' [query]
#   name:  screenshots go to build/.cache/test-tools/<name>-<shot>.png
#   query: URL query string, default "mode=singleplayer"
# The browser binary can be set with CHROMIUM (default: chromium), e.g. CHROMIUM=google-chrome.
# GPU=1 renders with the GPU (Vulkan): about 60 instead of a few frames per second in 3D.
CHROMIUM=${CHROMIUM:-chromium}
GPU_FLAGS=()
if [ -n "$GPU" ]; then
    GPU_FLAGS=(--enable-gpu --ignore-gpu-blocklist --use-angle=vulkan)
fi
TOOLS=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$TOOLS/../.." && pwd)
OUT=$REPO/build/.cache/test-tools
PORT_HTTP=8765
PORT_DEVTOOLS=9333
mkdir -p "$(dirname "$OUT/$1")"
(cd "$REPO/build" && bash build.sh -p web -d 1 2>&1 | tail -1)
cd "$REPO/out/web/latest" || exit 1
python3 -m http.server $PORT_HTTP --bind 127.0.0.1 >"$OUT/http.log" 2>&1 &
SERVER=$!
("$CHROMIUM" --headless=new "${GPU_FLAGS[@]}" --remote-debugging-port=$PORT_DEVTOOLS \
    --no-first-run about:blank >"$OUT/chrome.log" 2>&1 &)
sleep 4
timeout 600 node "$TOOLS/drive.mjs" $PORT_DEVTOOLS "http://127.0.0.1:$PORT_HTTP/?${3:-mode=singleplayer}" "$OUT/$1" "$2"
kill $SERVER
