# Orbitron 9000 — performance branch (work in progress)

Separate copy: `perf/index.html` (the original `index.html` on main is untouched).

## Done
- Branch `perf`, copy of v0.26, profiling harness in `perf/tools/`:
  - `pf.py <file> heavy,ui,launch <cpu-throttle>`: late steps, underruns, tick cost and timer gaps, long tasks, main-thread busy %, AudioNodes created/s, audio render load per 128-sample quantum (Chrome trace).
  - `pfd.py <file> heavy`: audio render cost broken down by node type.
- Baseline (headless Chromium, 4x CPU throttle, all tracks on, Afterglow, 128 BPM):
  - heavy: 0 late steps, render load mean 45%, p99 96%, 59 quanta over budget in 20 s; 172 nodes created/s; main thread 28% busy.
  - ui stress: render p99 99%, 73 quanta over budget; worst timer gap 139 ms; 5 long tasks (max 89 ms).
  - launch every ~4 s: longest task 245 ms; worst timer gap 257 ms.
  - Render cost per quantum (no throttle): biquads 0.30 ms, oscillators 0.13, convolvers 0.13 (+0.09 FFT), gains 0.12, waveshapers 0.12, compressors 0.06.
    About 85 biquad filters and 97 gains are processed every quantum with ~65 voices.

## Next
1. Audio thread: cut per-voice filters/gains (biggest render cost), check convolver + shimmer size.
2. Main thread: Launch cost (245 ms task), timer gaps during UI interaction.
3. Review CPU modes / buffer modes.
4. Before/after table on the same machine.

## Update (v0.27 base)
- New baseline on v0.27 (4x CPU, heavy): audio render load mean ~63%, over-budget quanta ~280 per 20 s; ~185 AudioNodes created/s.
- Experiment 1 (in `perf/index-wip.html`): disconnect each source node as soon as it ends.
  3 alternating A/B runs: render load mean 62.9% -> 55.4%, over-budget quanta 283 -> 157. Main thread unchanged.
  A per-node trace disagreed (more node visits), so this needs one more isolated check before it is kept.
- Experiment 2: dub stab uses one panner + one level per side/waveform instead of per note: nodes created/s 183 -> 153, same sound.
- Main thread: 84 intervals together ~4-5% of the main thread at 4x throttle (none dominant); card rebuilds 30-140 ms but only on opening Drums/Synths.
- Biggest remaining cost: the number of live nodes visited per audio quantum (600-1100), not any single effect. Convolution reverb ~6%.
