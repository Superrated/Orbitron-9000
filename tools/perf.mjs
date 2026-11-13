#!/usr/bin/env node
// Audio-engine load per mood, headless Chrome. For stutter work: does the load stay flat, and how bad are the worst moments?
//   node tools/perf.mjs                                    Survival, Large · 52 ms buffer, moods Dreamy,Acid,Power,Noir, 40 s each
//   node tools/perf.mjs --ls orb-mst=0 --eval "G.rev=0"       try an idea: extra localStorage settings, JS run right after Launch
//   node tools/perf.mjs --quality Eco --buffer "Extra large · 102 ms" --moods Acid --secs 60
// Per mood:  start = mean load over the first 10 s · end = mean over the last 10 s (should be ≈ start: no creep) ·
//            worst52 = busiest 52 ms stretch of the run (must stay well under 100 % for a 52 ms buffer; 102 ms buffer → see worst102).
// Load = time the audio thread spent rendering ÷ real time (100 % = it cannot keep up → dropouts). Measured on THIS machine:
// a phone is slower, so compare runs (before/after a change) rather than reading the numbers as absolute.
import { openApp, unavailable, PAGE_HELPERS } from '../tests/harness.mjs';

const a = process.argv.slice(2), val = (k, d) => { const i = a.indexOf(k); return i < 0 ? d : a[i + 1]; };
const Q = val('--quality', 'Survival'), BUF = val('--buffer', 'Large · 52 ms'), MOODS = val('--moods', 'Dreamy,Acid,Power,Noir').split(','), SECS = +val('--secs', 40), EVAL = val('--eval', ''), LS = (val('--ls', '') || '').split(',').filter(Boolean).map(x => x.split('='));
const why = unavailable(); if (why) { console.error(why); process.exit(2); }

async function run(mood) {
  const app = await openApp(); const { page } = app; const browser = page.context().browser();
  try {
    await page.addInitScript(([q, b, ls]) => { try { localStorage.setItem('orb-q', q); localStorage.setItem('orb-q2', '1'); localStorage.setItem('orb-buf2', b); for (const [k, v] of ls) localStorage.setItem(k, v); } catch (e) {} }, [Q, BUF, LS]);
    await page.reload(); await page.waitForFunction(() => typeof generate === 'function' && document.querySelector('#mood'));
    await page.evaluate(PAGE_HELPERS); await page.evaluate(n => __seed(n), 7);
    await page.click('#play'); await page.waitForFunction(() => window.__ctx && playing); await page.waitForTimeout(1500);
    await page.evaluate(m => { document.querySelector('#mood').value = m; generate(); }, mood);
    if (EVAL) await page.evaluate(e => { (0, eval)(e); }, EVAL);
    await page.waitForTimeout(500);
    await browser.startTracing(page, { categories: ['webaudio'] });
    await page.waitForTimeout(SECS * 1000);
    const trace = JSON.parse((await browser.stopTracing()).toString());
    const sr = await page.evaluate(() => __ctx.sampleRate);
    const R = (trace.traceEvents || trace).filter(e => e.ph === 'X' && e.name === 'RealtimeAudioDestinationHandler::Render').map(e => [e.ts, e.dur]).sort((x, y) => x[0] - y[0]);
    const q = 128 / sr * 1e6, t0 = R[0][0];
    const mean = (from, to) => { let s = 0, n = 0; for (const [t, d] of R) if (t - t0 >= from * 1e6 && t - t0 < to * 1e6) { s += d; n++; } return n ? 100 * s / (n * q) : 0; };
    const worst = ms => { const W = Math.max(1, Math.round(ms * 1000 / q)); let s = 0, m = 0; for (let i = 0; i < R.length; i++) { s += R[i][1]; if (i >= W) s -= R[i - W][1]; if (i >= W - 1) m = Math.max(m, s); } return 100 * m / (W * q); };
    return { mood, start: mean(0, 10), end: mean(SECS - 10, SECS), worst52: worst(52), worst102: worst(102) };
  } finally { await app.close(); }
}

console.log(`quality ${Q} · buffer ${BUF} · ${SECS} s per mood`);
console.log('mood'.padEnd(16) + 'start'.padStart(7) + 'end'.padStart(7) + 'worst52'.padStart(9) + 'worst102'.padStart(10));
const p = x => (x.toFixed(0) + '%');
for (const m of MOODS) { const r = await run(m); console.log(r.mood.padEnd(16) + p(r.start).padStart(7) + p(r.end).padStart(7) + p(r.worst52).padStart(9) + p(r.worst102).padStart(10)); }
