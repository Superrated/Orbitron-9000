# Orbitron 9000 — performance pass (v0.27 perf)

Separate copy: `perf/index.html` on branch `perf`. The original (`index.html` on `main`) is untouched.
Test copy for the phone: the "Orbitron 9000 Perf Test" artifact.

## How it was measured
Headless Chromium 153, phone viewport, CPU throttled 4x (main thread) to approximate a mid-range phone; seeded randomness.
Scenarios: **heavy** (all 10 tracks on, 128 BPM), **ui** (tab switching + 3 slider moves every 250 ms + low-pass sweeps), **launch** (a Launch every ~4 s).
Metrics: audio render time per 128-frame quantum from Chrome's audio trace (load = render time / quantum length), quanta over budget,
main-thread busy %, timer gaps, long tasks, AudioNodes created per second. Tools in `perf/tools/` (`pf.py`, `ab.sh`, `pfd.py`, `nc.py`, `live.py`, `gp.py`, `tim.py`).
The cloud machine is noisy: differences under ~5 points of load are within noise; results below are from repeated, alternating runs.

## Changes and rationale
1. **Finished sources are disconnected at once** (`ended` → `disconnect()`). Filters/gains behind a finished note fall out of the render graph instead of being processed until garbage collection.
   heavy: render load −6 to −13 points per round, over-budget quanta roughly halved (e.g. 577 → 260). Sound unchanged.
2. **Dub stab node merge**: one panner + one level per side and waveform per stab instead of per note. Same sum; AudioNodes created 183/s → 153/s.
3. **UI sync only when visible**: card fader/menu sync and the Mix page rebuild ran on every Launch even when hidden; now merged and deferred until the page is opened.
   `generate()` (a Launch) 16.5 ms → 10.3 ms mean on desktop (≈65 → ≈40 ms on a 4x slower phone). Values verified when pages are opened.
4. **Timers**: redundant 300 ms chip mute poll removed (mute sync handles it on change); ring playheads only drawn while a card page is on screen. Timer work −21% on the Launch tab.
5. **Engine quality "Eco" fixed**: two definitions disagreed and Eco kept the engine permanently in the saving level (lead unison capped at 2, shorter reverb).
   Eco now saves only when the load meter asks for it; "Eco eco" still saves permanently. Sound in Eco is now the full design.

## Comparison (final rounds, `final_ab.txt`)
| scenario | version | render load mean | quanta over budget / 20 s | main thread busy |
|---|---|---|---|---|
| heavy | v0.27 original (Eco) | 68–69 % | 436–500 | 29–34 % |
| heavy | optimised, same Eco settings (o4) | 62–64 % | 301–313 | 28–30 % |
| heavy | optimised + full-quality Eco (o5) | 69–71 % | 629–670 | 36–39 % |
| launch | all three | 34–42 % | 10–82 | 36–39 % |
| ui | all three | 50–71 % (noise between rounds larger than differences) | | 40–54 % |

Reading: the optimisations remove ~10% of the audio work and ~40% of Launch UI work; the new Eco spends that headroom on full-quality sound,
landing at roughly the old cost. On the phone, the Perf Test copy should give the same stability as before with the full sound.

## CPU / buffer modes review
- Engine quality: Hi-fi / Auto / Eco / Eco eco — sensible set; Eco was broken (see 5).
- Audio buffer: Extra large (102 ms) default is the right choice for stability. "Standard" means "device default" and can be larger than "Large · 52 ms" on some phones — the name is misleading.
- Scheduler lookahead (0.3 s on phones, 0.6–1.2 s when hidden) + worker clock: no late steps in any test.

## Remaining bottlenecks / limits
- Audio thread: cost is dominated by the number of live nodes (600–1100 per quantum in a full groove); the pad (~22 oscillators per chord, ~9 s each) is the largest group. Cutting further would change the sound.
- Each note passes through ~40 layered `fire` wrappers (≈5% main thread during playback). Flattening is possible but risky.
- 84 setInterval timers remain (≈3.5% main thread at 4x); none dominant.
- Headless Chrome does not throttle the audio thread, so audio numbers are desktop-class; real A56 numbers need the on-device comparison.
- AudioWorklet: not used for new DSP — no single custom DSP block is expensive enough to justify it (the Mini ladder already uses one).

## Update: quick wins round 2
6. Launch: ring fitting memoised, master clip curve computed once and only re-sent on change, Mix channel strips / bass card / card menus only sync while visible.
   `generate()` median 13.7 ms → 2.6 ms, mean 16.3 → 4.3 ms (60 Launches over 12 moods, desktop).
7. Shimmer reverb impulse (2.5 s, ≈100 ms of maths) prepared in idle time after start instead of during the first Deep Space Launch; drum pre-renders use idle time.
8. Tried: disconnecting rumble/shimmer when turned to 0 — no measurable gain (Chrome already skips silent branches); not kept.
9. Old master limiter removed (the master's own limiter catches peaks; worst peak in the all-mood run 0.908, no clipping); the static 20 kHz safety low-pass removed;
   the master low-pass that breakdowns/risers use now joins the path only while it moves. CPU gain ~1–2% (within noise); sound path is shorter.
10. "Small · 26 ms" audio buffer option added (also on main).

## Update: round 3 (pre-rendered drums, one heartbeat, load-aware visuals)
11. Pre-rendered drums: kick, snare, clap, fixed perc and hats were already cached. The hat cache key used the exact tone, which the analog drift
    keeps moving, so it missed and re-rendered; keys now use 1 % tone / 2 ms decay / 5 % metal steps (rendered at those values), and a Hat hits LFO
    no longer forces live hats (only tone/decay LFOs do, ~16 % of Launches). A cached hat costs 2 nodes instead of ~8.
12. One heartbeat: all setInterval timers of 200 ms or more (72 of them) run from one shared 100 ms clock; fast timers keep their own.
    Timer wake-ups 388/s → 294/s (−24 %).
13. Visuals step down with load: ≤24 fps at LOAD (existing), 12 fps at SAVING, 6 fps at OVERLOAD or for 3 s after an audio underrun.
Regression: all moods, no errors, no late steps, worst peak 0.896; every control on every tab pressed twice during playback: no errors.

## Update: lighter Eco (round 4)
14. Eco = light floor: lead unison up to 4 (was 2 in v0.27, 7 in the previous perf build), 1.4 s reverb; still steps down further when the load meter asks.
    The CORE badge does not show Eco's own built-in setting as LOAD.
    Stress test vs live v0.27 (2 rounds, full groove): render load 66–68 % → 58–64 %, quanta over budget 420–574 → 212–326 (≈ −45 %),
    while the sound stays fuller than live (unison 4 vs 2). Repeated Launches: audio within noise, longest main-thread freeze 176–182 → 71–75 ms.
