# Headless test tools

Drive MOROway App (web, debug build) in headless Chromium to check changes in the running app:
screenshots, in-app text commands and measurements via temporary log lines.

Requirements: Linux, Chromium or Chrome, Node.js 22 or newer (built-in `WebSocket`), `python3`
(Pillow for `sheet.py`), plus the usual build requirements. The browser binary defaults to
`chromium`; set another one with the `CHROMIUM` environment variable, e.g.
`CHROMIUM=google-chrome build/test-tools/run_test.sh …`.

## Run

```bash
build/test-tools/run_test.sh loop/run '[["wait",9000],["click",800,684],["wait",2000],["cmd","trains start 1"],["wait",20000],["shot","after"]]'
```

This builds `web` in debug mode, serves `out/web/latest` on port 8765, starts Chromium with
DevTools on port 9333 (1600 × 800 px) and runs the steps. Screenshots and logs go to
`build/.cache/test-tools/` (ignored by git). A third argument sets the URL query, e.g.
`"mode=singleplayer&gui-3d=1"`.

## Steps

| Step | Meaning |
| --- | --- |
| `["wait", ms]` | wait |
| `["click", x, y]` | click at screen position |
| `["hold", x, y, ms]` | press, hold, release |
| `["holdshot", x, y, ms, name]` | hold on an empty spot (shows all switches), screenshot, release |
| `["middrag", x, y, dx, dy, n]` | middle-button drag by dx, dy in n steps (tilts the 3D view) |
| `["twofinger", x, y, d, dx, dy, deg, scale, n]` | two-finger touch gesture (see notes) |
| `["key", key, ms, mods]` | hold an arrow key for ms; mods `"ctrl"`, `"shift"` or `"ctrl+shift"` |
| `["cmd", "trains start 1"]` | run an in-app text command (opened with `/`); output is logged |
| `["until", regex, timeoutMs]` | wait until a `DBG` log line matches |
| `["nav", url]` | navigate (e.g. to the same game with `gui-3d=1`; the saved game keeps switches) |
| `["reload"]` | reload the page (saved game is restored) |
| `["size", w, h]` | change the window size (default 1600 × 800), e.g. before a `reload` |
| `["eval", expression]` | evaluate JavaScript in the page and log the result (awaits promises) |
| `["shot", name]` | screenshot |

Useful text commands: `trains list`, `trains start <n>`, `trains stop <n>`, `trains turn <n>`,
`trains speed <n> <percent>`, `trains status <n>`, `switches list`,
`switches turn <name> <side>` (e.g. `switches turn outerUpperSiding left`).

## Notes

- The debug build shows a notification at startup; after ~9 s, `["click",800,684]` closes it at
  the default size, and at any size
  `["eval","document.querySelector(\".server-note-button-no\")?.click()"]`.
- Clicks only reach the game inside the background area; trains on hidden track are controlled
  via text commands.
- Measurements: add a temporary `console.log("DBG… " + JSON.stringify(...))` in `scripting.ts`
  (e.g. where the main thread receives train data from the worker), run, evaluate the logged
  lines, then remove it again. `until` waits for such lines, which makes timing exact.
- The animation worker is attached too: its exceptions appear in the output like the page's,
  and `DBG` lines logged in `scripting_worker_animate.ts` count as well.
- `sheet.py` combines screenshots into a contact sheet for a quick look.
- Saved games across two builds (e.g. a migration): run both with one persistent browser profile
  (a `CHROMIUM` wrapper passing `--user-data-dir`). The service worker then serves the first build
  again; clear it before testing the second one:
  `["eval","(async () => { for (const r of await navigator.serviceWorker.getRegistrations())
  await r.unregister(); for (const k of await caches.keys()) await caches.delete(k); })()"]`,
  then `["reload"]`.
- 3D renders at only a few frames per second without a GPU, so anything that changes per frame
  (e.g. holding Ctrl + arrow to tilt) moves very slowly. `GPU=1 build/test-tools/run_test.sh …`
  renders with the GPU (Vulkan, about 60 frames per second).
- `twofinger`: two fingers at distance d around x, y; in n steps the centre moves by dx, dy, the
  fingers turn by deg degrees and their distance is scaled by scale. A move at scale 1 tilts the 3D
  view, a scale other than 1 pinches (zooms). `key` with `"ctrl"` on an arrow key tilts as well.
- `middrag` tilts the 3D view (bird's eye); it shows the hidden tracks outside the background in
  perspective.
