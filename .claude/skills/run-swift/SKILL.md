---
name: run-swift
description: Run, screenshot, or smoke-test the "swift" hotel-booking dashboard prototype (preview/*.html) - static Tailwind CDN + vanilla ES modules, no build step. Use when asked to run, start, launch, build, screenshot, or test this app, or check that a CSS/JS change actually renders.
---

Static prototype, no build step: three pages (`landing.html`, `room-booking.html`,
`order-processing.html`) under `preview/`, served as-is by any static file
server. Shared markup (aside/topbar/modals) is fetched at runtime via
`js/partials.js`; behavior is vanilla ES modules. There is nothing to compile.

All paths below are relative to the repo root, not this skill directory.
The driver lives at `.claude/skills/run-swift/driver.mjs`.

## Prerequisites

Verified on macOS (Darwin), this session:
- Node >= 22 (native `WebSocket`, no npm deps): `node --version`
- Python 3 (any 3.x): `python3 --version`
- Google Chrome installed at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

If Chrome lives somewhere else (e.g. Linux), set `CHROME_BIN` to the binary
path before running any `shot`/`eval`/`smoke` command below. Not verified on
Linux in this session - the driver doesn't use xvfb because Chrome's
`--headless=new` runs natively headless, but this hasn't actually been run
outside macOS here.

No `npm install`, no build step, nothing to compile.

## Run (agent path)

The driver at `.claude/skills/run-swift/driver.mjs` launches an ephemeral
`python3 -m http.server` + headless Chrome over CDP, so you don't hand-roll
that boilerplate again. Four subcommands, all run from the repo root:

```bash
# Screenshot a page
node .claude/skills/run-swift/driver.mjs shot landing.html --out /tmp/shot.png

# Screenshot after waiting for a JS condition and clicking something
node .claude/skills/run-swift/driver.mjs shot room-booking.html \
  --wait 'document.querySelectorAll("#calGrid .day").length >= 42' \
  --click '[data-modal-open="modalRoomEditBackdrop"]' \
  --out /tmp/room-edit-modal.png

# Evaluate arbitrary JS in the page and print the JSON result
node .claude/skills/run-swift/driver.mjs eval room-booking.html \
  'document.querySelectorAll("#calGrid .day").length' \
  --wait 'document.querySelectorAll("#calGrid .day").length >= 42'

# Run the project's own assertion suite (console errors, chart data,
# modal open/close, CSS import chain - see scripts/smoke-test.mjs)
node .claude/skills/run-swift/driver.mjs smoke
```

`shot`/`eval` flags: `--viewport WxH` (default `1440x900`; width < 768 flips
mobile emulation on), `--wait "<js expr>"` (poll until truthy, up to 10s,
before clicking/evaluating/screenshotting), `--click "<css selector>"`
(shot only, fires after `--wait`).

Every page (`shot`/`eval`) waits for `[data-partial]` mounts (aside/topbar/
etc.) to hydrate before doing anything else - that part is automatic. It
does **not** wait for page-specific JS to finish (see Gotchas below);
pass `--wait` for that.

## Run (human path)

```bash
node .claude/skills/run-swift/driver.mjs serve 8000
```

Starts `python3 -m http.server 8000 --directory preview` in the foreground;
open `http://localhost:8000/landing.html` in a real browser. Ctrl-C to stop.
Pages must be served over HTTP - opening the file directly (`file://`) breaks
the `fetch()` calls that load partials (CORS).

## Test

```bash
node .claude/skills/run-swift/driver.mjs smoke
```

Same as `scripts/smoke-test.mjs` directly - 3 pages, ~30 checks total
(console errors, Chart.js instantiation, aside drawer/accordion, session
and topbar modals, CSS `@import` chain integrity). Not part of the
pre-commit hook (needs Chrome, runs a few seconds); run manually after
touching any page, partial, JS module, or CSS entrypoint.

Static checks (no browser needed, faster, part of pre-commit):
```bash
./scripts/lint-conventions.sh   # ASCII-only, no inline style, no hardcoded hex, min-width mobile-safe
./scripts/lint-fonts.sh         # no <12px font sizes
./scripts/lint-tokens.sh        # tokens.md vs base.css color mirror
./scripts/lint-partials.sh      # per-page partial/module manifest + composed duplicate-id/modal-target check
```

## Gotchas

- **`shot`/`eval` only wait for partials, not page-specific JS.** Tested
  live: `eval room-booking.html 'document.querySelectorAll("#calGrid .day").length'`
  without `--wait` returned `0`, because the calendar renders after
  `initRoomBookingBehaviors()` runs post-hydration, not during partial
  load. Adding `--wait 'document.querySelectorAll("#calGrid .day").length >= 42'`
  fixed it - always pass a page-specific readiness condition for anything
  that isn't in the initial partial-mounted DOM.
- **Charts need an explicit wait too.** `shot landing.html` without
  `--wait` screenshots the dashboard before Chart.js paints - the two
  chart boxes come back empty. Use
  `--wait 'window.Chart && Chart.getChart(document.getElementById("chartBar"))'`.
- **`--click` selector must go through `JSON.stringify` before landing in
  the injected JS string, twice** (once for the `querySelector()` call,
  once for the error message) - the driver got this wrong on first pass:
  a selector containing `"` (e.g. `[data-modal-open="modalRoomEditBackdrop"]`)
  broke out of a naively-interpolated string and threw
  `SyntaxError: missing ) after argument list`. Fixed by stringifying once
  and reusing the escaped literal in both places (see `driver.mjs`
  `cmdShot`'s `--click` branch).
- **`app.css` is an `@import`-only entrypoint** for five domain stylesheets
  (`shell.css`, `dashboard.css`, `modals.css`, `room-booking.css`,
  `order-processing.css`). A previous unterminated-comment bug in that
  file silently zeroed out every domain stylesheet without throwing a JS
  error or failing any line-based lint - `scripts/smoke-test.mjs`'s
  `APP_CSS_LOADED_CHECK` (also exercised by `smoke` here) specifically
  guards against this class of regression; don't remove or weaken it
  when touching `app.css`.
- **macOS has no `timeout(1)`.** If you need to background-and-kill the
  `serve` subcommand for a scripted check, use `spawn ... &` + `kill $PID`
  (see verification transcript), not `timeout N cmd`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `driver error: chrome devtools endpoint timeout` | A prior headless Chrome instance is still holding a stale user-data-dir / port. `pgrep -fl "Google Chrome.*headless"` and `kill` strays, then retry. |
| `eval`/`shot` hangs until the 15s partial-wait deadline, then proceeds anyway with an incomplete DOM | The page never got `[data-partial]` elements removed - check the dev server actually started (`curl -I http://127.0.0.1:<port>/<page>`) and that the page path is correct (`landing.html`, not `/landing.html` or `preview/landing.html`). |
| Screenshot shows correct layout but empty/unstyled areas | Check `app.css`'s `<link>` actually resolved and its `@import`s parsed - run `smoke` first; `APP_CSS_LOADED_CHECK` will name the exact missing/mismatched stylesheet. |
