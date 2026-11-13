# Orbitron 9000 — rules for coding agents

Generative Euclidean groovebox: a single-file Web Audio PWA. **Read PROJECT_CONTEXT.md first** (2 min), ARCHITECTURE.md only when you touch the audio path or the build.

## The 6 rules
1. **Edit `src/`, never `index.html`.** `index.html` is built: `node tools/build.mjs`. A test fails if they disagree.
2. **Order is behaviour.** `src/build.txt` lists every file in run order. Later files wrap functions from earlier ones (`generate` = Launch is wrapped 125×). Never reorder lines; add new files where they must run (usually the end).
3. **Find before you read.** Open `src/js/<area>/INDEX.md` (one line per file) → open 1–3 files. Use `docs/HOOKS.md` for "who wraps X", `docs/MOODS.md` for "where is mood X tuned". Don't read big files whole: grep inside them.
4. **Fix where the feature lives.** Change the file that introduced the behaviour (its header comment says so) instead of adding yet another wrapper on top. A new wrapper is for new behaviour only.
5. **Protect the audio path** (`fire`, `fireVoice`, voices, `tick`, anything called per note/step): no DOM access, no `console.*`, no new closures/arrays per call when avoidable, cache curves/buffers, never `exponentialRampToValueAtTime(0…)`. Screen updates go through `UI.on(fn)` / `UI.onBeat(fn)` / `UI.sync()`.
6. **Don't change sound you weren't asked to change.** The Launch snapshot test catches any change to what Launch generates; update it only for intended changes.

## Commands (Node ≥ 18, no npm install needed)
```
node tools/build.mjs            # build index.html (syntax-checks every script, maps errors to src file:line)
node tools/index.mjs            # refresh INDEX.md / HOOKS.md / MOODS.md after adding/renaming files
node --test tests/*.test.mjs    # static checks (1 s) + headless-Chrome runtime tests (~80 s; skipped without Playwright)
UPDATE_SNAPSHOTS=1 node --test tests/*.test.mjs   # accept an INTENDED change to Launch output
node tools/probe.mjs --mood Acid --launch "TR[4].p"   # inspect the running app headless
node tools/probe.mjs --debug --play --launch --listen 3000   # + list errors hidden by catch(e){} (with src file:line)
node tools/levels.mjs --moods Acid,Noir --out levels.json   # loudness of every part after a Launch (dB against the kick); no --moods = all, ~18 min
node tools/levels.mjs --loud --out loud.json   # loudness leaving the master per mood, at the start and settled (~2.5 min); --loudreport new.json old.json compares two runs
node tools/perf.mjs --moods Dreamy,Acid   # audio-engine load per mood: start vs end (must stay flat) and the busiest 52 ms (stutter risk); compare before/after
node tools/build.mjs --release 0.8   # also copy the build to releases/
```

## Done = all of these
- `node tools/build.mjs` and `node tools/index.mjs` ran; `node --test tests/*.test.mjs` passes.
- New file: `src/js/<area>/<NNNN>-<slug>.js`, number between its neighbours in `src/build.txt`, header comment `/* ---- vX.Y: WHAT it does, in plain words — why ---- */`.
- If you changed architecture (new area, new build step, new shared helper), update PROJECT_CONTEXT.md / ARCHITECTURE.md in the same change — keep them short.

Do not search or read `releases/` (17 MB of old builds) or `index.html` (generated); `.ignore` hides them from search.
