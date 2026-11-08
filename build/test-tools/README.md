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
| `["cmd", "trains start 1"]` | run an in-app text command (opened with `/`); output is logged |
| `["until", regex, timeoutMs]` | wait until a `DBG` log line matches |
| `["nav", url]` | navigate (e.g. to the same game with `gui-3d=1`; the saved game keeps switches) |
| `["reload"]` | reload the page (saved game is restored) |
| `["shot", name]` | screenshot |

Useful text commands: `trains list`, `trains start <n>`, `trains stop <n>`, `trains turn <n>`,
`trains speed <n> <percent>`, `trains status <n>`, `switches list`,
`switches turn <name> <side>` (e.g. `switches turn outerUpperSiding left`).

## Notes

- The debug build shows a notification at startup; `["click",800,684]` after ~9 s closes it.
- Clicks only reach the game inside the background area; trains on hidden track are controlled
  via text commands.
- Measurements: add a temporary `console.log("DBG… " + JSON.stringify(...))` in `scripting.ts`
  (e.g. where the main thread receives train data from the worker), run, evaluate the logged
  lines, then remove it again. `until` waits for such lines, which makes timing exact.
- `sheet.py` combines screenshots into a contact sheet for a quick look.
