# Orbitron 9000 — project context

**What it is.** A generative techno/ambient groovebox in the browser. One tap ("🚀 Launch") builds a whole groove for a *mood*: key, tempo, ten Euclidean drum/synth tracks, sounds and mix. You then shape it live on the *Flight* page. Pure Web Audio API, no framework, no dependencies, works offline as an installable PWA. Phones are locked to portrait.

**How it ships.** One self-contained file, `index.html` (~920 KB), served with `sw.js` (offline cache), `manifest.webmanifest` and `icons/`. Old builds live in `releases/` (don't read them). Since v0.7 the code is edited in `src/` and stitched together by `tools/build.mjs` (plain concatenation, so the output is byte-for-byte the sources).

## Repository map
```
src/build.txt            run order of every source file (THE most important file: order = behaviour)
src/html/, src/css/      page skeleton and base CSS (most UI is built by JS)
src/js/<area>/NNNN-*.js  the code, ~250 small files (median 2.4 KB), one feature/patch each
src/js/<area>/INDEX.md   generated: one line per file — what it does, what it defines, what it wraps
src/meta.json            area descriptions + summary overrides for the generated indexes
docs/HOOKS.md            generated: for every wrapped function, the chain of files that wrap it
docs/MOODS.md            generated: for every mood, the files whose code names it
tools/build.mjs          build / --check / --debug (error-reporting debug.html) / --release
tools/index.mjs          regenerates the INDEX.md / HOOKS.md / MOODS.md maps
tools/probe.mjs          run the app headless and inspect state, audio level and swallowed errors
tests/                   build.test.mjs (static), browser.test.mjs (runtime), midi.test.mjs (MIDI module), snapshots/launch.json
```

## Areas (folders) — open the folder's INDEX.md, then 1–3 files
| area | what lives there |
|---|---|
| `core` | the foundation (6 big files): state `G`, tracks `TR`, scales `SC`, audio graph `A` + `init()`, voices `fireVoice()`, scheduler `tick()`, `MOODS` table, pad synth `pad()`, the generator `generate()` |
| `engine` | mix bus, master chain (glue, clip, limiter, mastering), reverb/shimmer/delay, sidechain, metering |
| `instruments` | how tracks sound: lead engines (Stack/FM/…, Mini, Acid 303), pad types, stab, bass, perc sounds, satellite, patches |
| `sequencer` | what plays when: Euclid tools, bassline/arp tools, LFOs, feel/micro-timing, evolve, rotate drift |
| `launch` | Launch = `generate()` and its ~125 wrappers: moods, flavours, riffs, progressions, per-mood trims, dice buttons |
| `flight` | the performance page: risers, breakdowns, thrusters, drop hits, LOW-PASS / THIN / LEAD / BASS / DRUMS / FX faders |
| `ui` | tabs, cards, faders, menus, Mix/LFO pages, the solar-system visuals, CSS injected from JS |
| `platform` | robustness + speed: timer heartbeat, render queue, load/overload guards, recovery, audio buffer, PWA install, caches |
| `state` | persistence: export/save, sectors (16 memory slots), WAV recorder, renamed-setting migrations |
| `midi` | MIDI controllers, OFF unless opened once with `?midi`: `2440-midi-core` (OrbMIDI: knob/endless/button handling, smooth pickup, clock out; no timers, nothing allocated per message, knob moves applied once per frame) and `2450-midi-app` (🎛 panel: Learn = tap any slider / Flight fader / Flight button / Mute·Solo / Play then move a knob; Quick setup; clock follows Play and tempo). Risers, breakdowns, menus and dice are left out on purpose |

## Key globals (all scripts share one global scope)
- `G` settings of the current groove (bpm, root, scale, mix/FX amounts, many feature flags) · `curMood` internal mood key · `MOODS[key]` mood recipe · `MOODNAME[key]` display name (`MN(key)`).
- `TR[0..9]` tracks: 0 Kick · 1 Hi-hat · 2 Clap · 3 Perc · 4 Lead · 5 Pad · 6 Bass · 7 Snare · 8 Stab · 9 Satellite. Each: `st` steps, `h` hits, `r` rotate, `pt` pattern (from `pat(T)`), `lv` level, `m` mute, `p` sound params, `x` slider specs.
- `ctx` AudioContext (created on first Play by `init()`), `A` named audio nodes (`A.m` mix in, `A.glue`, `A.clip`, `A.lim`, `A.rO` reverb, `A.dO` delay …), `routeTrack(node, k, dest, dly, rev)` every voice's exit.
- `R()` / `pick(a)` randomness (seedable in tests) · `$()` querySelector · `build()` rebuild the cards · `UI.on/onBeat/sync` event-driven screen refresh · `QOS` load level (0 nominal … 3 overload).

## Where to change what (start here, then follow HOOKS.md)
| task | look at |
|---|---|
| tune a mood (tempo, sounds, levels) | `docs/MOODS.md` → the mood's own file(s) in `launch/`; per-mood tables: `launch/1220-mood-settings-row`, `1680-mood-flavours`, trims `0190`, `1250`, `1300`, `1930` |
| add a mood | copy the pattern of `launch/1150-temporal-mood.js` (newest complete mood), add `MOODNAME` entry (`core/0050`), check `docs/MOODS.md` "all-mood tables" for tables that need a row |
| change a drum or bass sound | `fireVoice()` in `core/0090` (k: 0 kick, 1 hat, 2 clap, 3 perc, 6 bass) + `instruments/` files named after it; drum hits are pre-rendered (`platform/0430`, `1920`, `2160`) |
| change a lead / pad / stab / satellite sound | `instruments/0160-lead-engine`, `0480-mini-lead-engine`, acid in `core/0090` + `instruments/2200`, `2220`; `pad()` in `core/0120` + `instruments/0670`, `0690`; stab `instruments/0490`; satellite `1790` |
| master, mix bus, effects | `engine/` — the final chain is `1950-mastering`, `2030-headroom`, `2168-master-final-clipper` |
| patterns / timing / swing | `pat()` + `tick()` in `core/0050`, `core/0090`; `sequencer/2000-feel-microtiming`; `arrStep` chain in HOOKS.md |
| what Launch does | `generate()` chain in `docs/HOOKS.md` — the last files run first; `launch/1530-launch-polish`, `1660-launch-quality`, `1690-in-time-launch` |
| Flight page | `flight/INDEX.md`; layout `flight/2090-thruster-order` |
| a UI page or control | `ui/INDEX.md`; faders/menus sync: `ui/0930-faders-show-value`, `ui/0080-event-driven-sync` |
| stutters, CPU, recovery | `platform/INDEX.md`: `0300-load-guard`, `1580-overload-guard`, `1700-safety-loop`, `1490-audio-buffer` |
| saving, sectors, export | `state/0830-sectors`, `state/0060-saving-share-download` |
| MIDI controllers, clock out | `midi/2440-midi-core` (header shows the API), `midi/2450-midi-app` (what a knob can move); `tests/midi.test.mjs` |

## Conventions
- File = one feature. Header comment first line: `/* ---- vX.Y: WHAT — why ---- */`, in plain English (the indexes show it).
- Extending a function: `{const _g=generate;generate=function(){const r=_g.apply(this,arguments);/* … */return r}}` inside a block so helpers stay local. Expose shared helpers as `window.name` on purpose; everything at top level of a file is global.
- Guard optional collaborators: `window.X&&X()` / `typeof X==='function'`. Wrap risky non-audio code in `try{}catch(e){}` — but prefer `catch(e){console.warn('[orbitron] what',e)}` in new code, so failures are visible.
- Dense one-line style is the house style; match it in existing files, readable code is welcome in new ones.
- Settings in `localStorage` use the `orb-` prefix. Renamed values get a migration (`state/2170-ep-stab-rename.js` pattern).

## Known debts (not urgent, documented so nobody trips on them)
- Behaviour is spread over long wrap chains (`generate` 125, `fire` 38, `arrStep` 20). Read the end of a chain first.
- ~560 `catch(e){}` hide failures; `node tools/probe.mjs --debug …` lists them. Found so far: `say()` (mission-control banner) is local to `ui/0380`, so banner messages from 10 other files never show; `engine/1330` cannot set `A.lim.attack` (the limiter is not a compressor any more), so that tweak never applied.
- The head comment in `src/html/head.html` still says v0.34.
