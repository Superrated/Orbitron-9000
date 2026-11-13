// The checks. Each one compares a single Launch with the profile of its mood and returns pass/fail plus the measured value.
// Input: { mood, d (digest of what Launch decided), a (audio measurements), genMs, errors }
import { SCALES } from './profiles.mjs';

const LUFS_ALLOW = [2, 2.5];   // a loop may sit 2 LU quieter or 2.5 LU louder than the middle half of real releases
const r1 = v => v == null ? v : Math.round(v * 10) / 10;
const inR = (v, [lo, hi]) => v >= lo && v <= hi;
const rng = ([lo, hi]) => `${lo}…${hi}`;

/** 16-step view of a track (polymetric tracks are read over one bar) */
const bar = T => Array.from({ length: 16 }, (_, i) => T.pt[i % T.st] === '1');
const hitsPerBar = T => T.st ? [...T.pt].filter(c => c === '1').length * 16 / T.st : 0;
const active = T => !T.m && hitsPerBar(T) > 0;

export function check({ d, a, genMs, errors }, P) {
  const out = [], add = (group, rule, ok, value, want) => out.push({ group, rule, ok: !!ok, value, want });
  const TR = d.TR, K = TR[0], H = TR[1], C = TR[2], B = TR[6], S = TR[7];

  // ---------- PATTERN: does the groove follow the subgenre's rules? ----------
  add('pattern', 'tempo', inR(d.bpm, P.bpm), d.bpm, rng(P.bpm) + ' bpm');
  add('pattern', 'swing', inR(d.swing, P.swing), r1(d.swing * 100) / 100, rng(P.swing));
  if (P.kick !== 'any') {
    const on = active(K), q = on ? [0, 4, 8, 12].filter(i => bar(K)[i]).length : 0;
    if (P.kick === 'four') add('pattern', 'four-on-the-floor kick', on && q >= 3, on ? `${q}/4 beats` : 'no kick', '≥3 of 4 beats');
    else add('pattern', 'broken (non-4/4) kick', on && q < 4, on ? `${q}/4 beats` : 'no kick', 'kick plays, not on all 4 beats');
  }
  if (P.backbeat) {
    const bb = [C, S].some(T => active(T) && bar(T)[4] && bar(T)[12]);
    add('pattern', 'backbeat (clap/snare on 2 & 4)', bb, bb ? 'yes' : 'no', 'yes');
  }
  const hh = active(H) ? hitsPerBar(H) : 0;
  add('pattern', 'hi-hat hits per bar', inR(hh, P.hat), r1(hh), rng(P.hat));
  if (P.bass) add('pattern', 'bassline present', active(B), active(B) ? 'yes' : 'muted/empty', 'yes');
  if (P.scale !== 'any') add('pattern', `${P.scale} scale`, SCALES[P.scale].includes(d.scale), d.scale, P.scale + ' scale');

  // ---------- ARRANGEMENT: layers, space, low-end, steadiness over the bars ----------
  const mel = [4, 5, 8, 9].filter(k => active(TR[k])).length;
  add('arrangement', 'melodic layers (lead/pad/stab/sat)', inR(mel, P.melodic), mel, rng(P.melodic));
  const nt = TR.filter(active).length;
  add('arrangement', 'tracks playing', inR(nt, P.tracks), nt, rng(P.tracks));
  if (active(K) && active(B)) {
    const kb = bar(K), bb = bar(B), n = bb.filter(Boolean).length, ov = n ? bb.filter((x, i) => x && kb[i]).length / n : 0;
    add('arrangement', 'bass avoids kick', ov <= P.kickBass, Math.round(ov * 100) + '%', '≤' + Math.round(P.kickBass * 100) + '% of bass hits on kick');
  }
  if (a) add('arrangement', 'bar-to-bar loudness change', a.barSwing <= P.mix.barSwing, r1(a.barSwing) + ' LU', '≤' + P.mix.barSwing + ' LU');

  // ---------- MIX: loudness, tone, stereo, compared with real releases ----------
  if (a) {
    const M = P.mix, lw = [P.lufs[0] - LUFS_ALLOW[0], P.lufs[1] + LUFS_ALLOW[1]];
    add('mix', 'loudness', inR(a.lufs, lw), r1(a.lufs) + ' LUFS', rng(lw.map(r1)) + ' LUFS');
    add('mix', 'punch (peak-to-loudness)', inR(a.plr, M.plr), r1(a.plr) + ' dB', rng(M.plr) + ' dB');
    add('mix', 'tonal tilt', inR(a.tilt, M.tilt), r1(a.tilt) + ' dB/oct', rng(M.tilt) + ' dB/oct');
    add('mix', 'bass weight', inR(a.bassWeight, M.bassWeight), r1(a.bassWeight) + ' dB', rng(M.bassWeight) + ' dB');
    add('mix', 'air (6–20 kHz)', inR(a.air, M.air), r1(a.air) + ' dB', rng(M.air) + ' dB');
    add('mix', 'mono low end (<120 Hz side)', a.lowSide <= M.lowSide, r1(a.lowSide) + ' dB', '≤' + M.lowSide + ' dB');
    add('mix', 'stereo width', inR(a.width, M.width), r1(a.width) + ' dB', rng(M.width) + ' dB side/mid');
    add('mix', 'mono-safe (L/R correlation)', a.corr >= M.corr, r1(a.corr * 10) / 10, '≥' + M.corr);
    add('mix', 'no clipping', a.clips <= 8 && a.peak <= 0, `${a.clips} clipped, peak ${r1(a.peak)} dBFS`, '≤8 samples at 0 dBFS');
  }

  // ---------- GLITCH: crashes, broken audio, silence, slow Launch ----------
  add('glitch', 'no script errors', !errors.length, errors.length ? errors[0].slice(0, 90) : 'none', 'none');
  if (a) {
    add('glitch', 'no NaN audio', a.nan === 0, a.nan, 0);
    add('glitch', 'no DC offset', Math.abs(a.dc) < .01, r1(a.dc * 1000) / 1000, '<0.01');
    add('glitch', 'not silent', a.lufs > -35, r1(a.lufs) + ' LUFS', '> -35 LUFS');
    if (active(K)) add('glitch', 'no dropouts', a.gap < .3, r1(a.gap * 1000) / 1000 + ' s', '<0.3 s below -60 dBFS');
  }
  add('glitch', 'Launch is quick', genMs < 400, Math.round(genMs) + ' ms', '<400 ms');
  return out;
}
