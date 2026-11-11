# Engine branch — AudioWorklet experiment (round 1)

Approach: every note's sound code runs unchanged against a virtual audio context; the node graph it builds is sent to one
AudioWorklet that renders it with Web Audio rules (wavetable oscillators, RBJ/Chrome biquads, automation timelines,
waveshapers, equal-power panning, delays). Fixed FX and master stay native. Automatic fallback to the classic engine.

Status
- Plays drums, perc, bass, pad, dub stab, Satellite, lead (Stack/Pulse/FM/Vowel/Organ/Sine, Acid). Mini engine (own ladder worklet) and
  Flight low-pass routing not yet supported.
- Main-thread node creation drops from ~180/s to ~32/s.

Stress test, heavy groove, Eco, CPU 4x slowed (audio load mean / over-budget quanta):
- v0.3 native: 42-45 % / 41-69
- worklet round 1: 54-58 % / 129-174

Conclusion: a generic graph interpreter in JavaScript is slower than Chrome's native nodes, even after incremental automation,
silent-node skipping and pass-through gains. A real gain needs voices written as fused DSP (one loop per voice), not a node emulation.
