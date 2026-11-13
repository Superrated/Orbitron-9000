# Orbitron 9000 — architecture

Read this when you touch the audio path, the scheduler, Launch internals or the build. For "where is X", use PROJECT_CONTEXT.md.

## 1. Build model
```
src/html/head.html ─┐
src/css/base.css    ├─ raw ─┐
src/html/body.html ─┘       │
src/js/**/NNNN-*.js ── js / js+ (order from src/build.txt) ──► tools/build.mjs ──► index.html (single file, shipped)
                                                                   └── --debug ──► debug.html (error reporting, not shipped)
```
- Pure concatenation, no transpiling or minifying: what you write is what runs, so line numbers in a stack trace of `debug.html` map straight to `src/` files.
- `js` opens a `<script>`, `js+` continues the open one. The six `core/` files and a few others are ONE script: they share hoisting, and an exception stops the rest of that script. Every other file is its own script, so one broken feature cannot take down the next.
- All scripts share the global scope (top-level `const/let/function` are globals). There are no ES modules on purpose: the app must stay a single file that runs from anywhere, offline.

## 2. The patch (wrap) model
The app grew by versions. Each feature file adds behaviour by wrapping earlier functions:
```js
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);/* adjust the groove */;return r}}
```
- Run order = `src/build.txt` order. The last wrapper is the outermost: it runs first and decides whether/how to call inward.
- Chains (docs/HOOKS.md): `generate` (Launch) 125 · `fire` (per note) 38 · `arrStep` (per step) 20 · `pad` 13 · `init` (audio graph) 11 · `leadNote`, `mix`, `viz` 9 …
- `build()` (card rebuild) is NOT a chain any more: it has a hook queue (`BUILD.hooks`, `BUILD.sync`) in `core/0050`. Prefer such registries over new wrappers for UI work.

## 3. Runtime flow
```
Play ─► toggle() ─► init()  (first time: AudioContext + master graph A.*; wrapped by 11 files that add buses/FX)
          └─► setInterval(tick, 25 ms)            (main thread; a worker-driven clock keeps it alive in the background: platform/0740)
tick(): while nextT < ctx.currentTime + look-ahead (≈120 ms, QOS.la / LAMIN):
          arrStep(w)          per step: arrangement, breaks, evolve, sectors, drift … (20 wraps)
          for each track: pattern hit? ─► fire(k, w) ─► fireVoice / snare / stab / pad / satellite  (fire: 38 wraps)
                                        voice builds nodes, schedules them at time w, exits through routeTrack()
          UI.beat() every beat, UI.sync() every bar   (both deferred with setTimeout: never block the scheduler)
routeTrack(node, k) ─► per-track send/level ─► drum bus / synth bus / lead bus ─► A.m (mix)
A.m ─► shaper ─► A.hp / A.lp (risers, Flight low-pass) ─► glue compressor ─► clip ─► mastering (engine/1950)
     ─► headroom keeper (2030) ─► limiter A.lim ─► final clipper (2168) ─► destination
reverb / delay / shimmer: sends from routeTrack, returns into the bus; sidechain "duck" dips buses on kicks
```
- Timing: every sound is scheduled on the audio clock (`w` = ctx time), never on `setTimeout`. Swing and micro-timing shift `w` inside `fire`/feel files. Tests assert notes are never scheduled in the past and the step grid stays exact.
- AudioWorklet: only the Mini lead's ladder filter (`instruments/0480`, a fixed pool of nodes) and the WAV recorder (`state/0990`). Everything else is native nodes.
- Pre-rendering: drum, hat and perc hits are rendered once per variant in `OfflineAudioContext` (queued one at a time by `platform/0010-render-queue`) and replayed as buffers — CPU per hit stays tiny. Caches are capped (`platform/2160`).
- Launch handover: `launch/0660` crossfades ringing old notes over ~1 beat at the bar line (`window.__launchAt`) and only dips the effect returns.
- Load management: `platform/0300-load-guard` measures voices, lateness and frame time and sets `QOS` level; `1580-overload-guard` compares audio clock with real time; higher levels shed visuals, then effects, then voices. `1700-safety-loop` is the lifeboat: at the first warning signs (2 dropouts in 3 s, late notes, overload stage 3) a pre-rendered kick+hat loop on a second AudioContext takes over on the beat while the engine rests, then hands back on a bar; it rebuilds the engine only if trouble goes on (or NaN, silence).

## 4. Launch flow
```
🚀 Launch / Random warp ─► (playing? launch/1690: book the old groove up to the next bar line, then run generate()
                            a moment BEFORE it — 1.5x this device's measured Launch time — and pre-render the new drums) ─► generate()
generate() core (core/0120): pick mood → key, scale, bpm, base patterns, base params from MOODS[mood]
          wrappers (launch/*, plus some sequencer/instruments/engine files): flavours, riffs, progressions, basslines,
          sound choices, per-mood trims, polish, groove score … → build() + UI.sync() redraw once
```
Launch must stay deterministic for a given random seed (the snapshot test depends on it): use `R()`/`pick()`, never `Date`/`performance.now()` for musical decisions. Launch remembers recent picks to avoid repeats, so the same seed gives a different groove on the 2nd Launch — by design.

## 5. UI model
- Screens are built by JS: tab sections in `html/body.html`, cards from `TR[k].x` slider specs (`buildCards`), extra controls added by `BUILD.sync` hooks.
- Refresh is event-driven: register a refresh with `UI.on(fn)` (runs after Launch, rebuild, Play/Stop, taps, each bar), playhead displays with `UI.onBeat(fn)`. Slow `setInterval`s (≥ 200 ms) are merged into one 100 ms heartbeat (`platform/0030`). Visuals (`ui/0210…`) drop frame rate under load and pause off-screen.

## 6. Performance rules (the audio path)
Audio path = `tick`, `arrStep`, `fire`, `fireVoice`, every voice function, `routeTrack`, `duck`, anything they call.
- No DOM reads/writes, no layout, no `console.*`, no `localStorage` there. Hand data to the UI via state + `UI.on`.
- Create only the nodes the note needs; reuse shared stages (per-track sends, shared LFOs, cached curves `CC`, `BDC`, `FC`). Finished sources are disconnected automatically (`platform/0040`).
- Avoid per-call arrays/closures in per-step code when a loop or cached value does; keep heavy maths (impulse responses, curves) lazy and cached.
- Parameter ramps: never ramp exponentially to 0 (use `.0001` or `setTargetAtTime`); `engine/0070` guards it anyway.
- Measure: `node tools/probe.mjs --play --mood <m> --launch --listen 3000` (peak, rms, late notes, step grid) and the browser tests.

## 7. Tests and debugging
- `tests/build.test.mjs`: build is in sync, every script compiles, manifest complete, file naming, maps fresh, service-worker file list.
- `tests/browser.test.mjs` (headless Chrome via Playwright, seeded `Math.random`, clean storage): app loads without errors, mood tables complete, Euclid `pat()` maths, Launch snapshot for every mood (deterministic), Launch time budget, every mood plays (audible, no NaN, ≤ 0 dBFS, no late notes, exact step grid).
- `debug.html` (`--debug`): each script carries `//# sourceURL`, and every empty `catch(e){}` reports to `orbErrors()` with `src/file:line` — nothing changes in the shipped build.
