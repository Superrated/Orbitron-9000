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
