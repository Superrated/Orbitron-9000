#!/usr/bin/env node
// GENRE TEST SUITE — random Launches compared with real tracks of each mood's subgenre.
//
//   node tests/genre/run.mjs                      100 random Launches spread over all moods (pass/fail)
//   node tests/genre/run.mjs --n 20 --mood Acid   20 Launches of one mood
//   node tests/genre/run.mjs --seed 4242          repeat an earlier run exactly (the seed is printed every run)
//   node tests/genre/run.mjs --bars 4 --workers 2 longer audio per Launch / parallel browser tabs
//   node tests/genre/run.mjs --no-audio           patterns + arrangement only (seconds instead of minutes)
//
// How it works, fast: each Launch runs in a fresh headless-Chrome tab, but the app's AudioContext is swapped for an
// OfflineAudioContext, so the groove is rendered faster than real time (no speakers, no waiting). The sequencer is stepped
// by hand every 50 ms of audio. After 1 warm-up bar the next bars are measured (loudness, tone, stereo, glitches) inside the
// page, and the digest of what Launch decided (tempo, scale, every track's pattern) is checked against tests/genre/profiles.mjs.
// Writes tests/genre/out/report.json. Exit code 1 when any Launch fails.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import http from 'node:http';
import os from 'node:os';
import { existsSync, createReadStream, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ROOT } from '../harness.mjs';
import { PROFILES, DEFAULT_PROFILE } from './profiles.mjs';
import { check } from './rules.mjs';

// ---------- options ----------
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i < 0 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const N = +arg('--n', 100), BARS = +arg('--bars', 2), WARM = 1, ONLY = arg('--mood', null), AUDIO = !argv.includes('--no-audio');
const SEED = +arg('--seed', Date.now() % 1e6), WORKERS = +arg('--workers', Math.max(1, Math.min(4, os.cpus().length)));
const VERBOSE = argv.includes('--verbose');

// ---------- browser + server ----------
const require = createRequire(import.meta.url);
function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_PATH, 'playwright', 'playwright-core'];
  try { const g = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); tries.push(join(g, 'playwright'), join(g, 'playwright-core')); } catch {}
  for (const t of tries.filter(Boolean)) { try { return require(t); } catch {} }
  return null;
}
const pw = loadPlaywright();
if (!pw) { console.error('Playwright not found: npm i -g playwright-core (and a Chrome/Chromium)'); process.exit(2); }
const exe = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => p && existsSync(p));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); createReadStream(f).pipe(r);
}).listen(0);
const URL0 = `http://localhost:${server.address().port}/index.html`;

/** Runs in the page before the app: seeded random, error capture, offline audio engine, the analyser. */
function initScript() {
  let s = 1; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  window.__seed = n => { s = n; };
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  window.__errors = [];
  addEventListener('error', e => window.__errors.push(String(e.error && e.error.stack || e.message)));
  addEventListener('unhandledrejection', e => window.__errors.push('unhandled rejection: ' + String(e.reason && e.reason.stack || e.reason)));
  // the FIRST AudioContext the app makes (its engine) becomes an offline one we can render faster than real time
  const SR = 48000, OAC = OfflineAudioContext, RealAC = window.AudioContext;
  window.__SEC = 10;
  const Fake = function (opts) {
    if (window.__oc) return new RealAC(opts);
    const oc = new OAC(2, Math.ceil(SR * window.__SEC), SR);
    oc.__res = oc.resume.bind(oc); oc.resume = () => Promise.resolve(); oc.suspend = (t => oc.__sus ? oc.__sus(t) : Promise.resolve()); oc.__sus = null;
    oc.close = () => Promise.resolve(); oc.baseLatency = 0; oc.outputLatency = 0; oc.getOutputTimestamp = () => ({ contextTime: oc.currentTime, performanceTime: performance.now() });
    window.__oc = oc; return oc;
  };
  Fake.prototype = RealAC.prototype;
  window.AudioContext = window.webkitAudioContext = Fake;

  /** Measure rendered audio: loudness (BS.1770 / LUFS), peaks, tone, stereo, glitches. Runs in the page so the samples never leave it. */
  window.__analyze = (buf, from, barLen, bars) => {
    const L = buf.getChannelData(0).subarray(from, from + barLen * bars), R = buf.getChannelData(1).subarray(from, from + barLen * bars), n = L.length;
    let nan = 0, dc = 0, pk = 0, clips = 0, sLR = 0, sLL = 0, sRR = 0;
    for (let i = 0; i < n; i++) { const l = L[i], r = R[i]; if (l !== l || r !== r) { nan++; continue; } dc += l + r; const a = Math.max(Math.abs(l), Math.abs(r)); if (a > pk) pk = a; if (a >= .999) clips++; sLR += l * r; sLL += l * l; sRR += r * r; }
    // K-weighting (ITU-R BS.1770, 48 kHz coefficients)
    const kw = x => { const y = new Float32Array(x.length); let a1 = 0, a2 = 0, b1 = 0, b2 = 0, c1 = 0, c2 = 0, d1 = 0, d2 = 0;
      for (let i = 0; i < x.length; i++) { const v = x[i] === x[i] ? x[i] : 0;
        const s1 = 1.53512485958697 * v - 2.69169618940638 * a1 + 1.19839281085285 * a2 + 1.69065929318241 * b1 - .73248077421585 * b2; a2 = a1; a1 = v; b2 = b1; b1 = s1;
        const s2 = s1 - 2 * c1 + c2 + 1.99004745483398 * d1 - .99007225036621 * d2; c2 = c1; c1 = s1; d2 = d1; d1 = s2; y[i] = s2; } return y; };
    const kL = kw(L), kR = kw(R), ms = (a, b, i0, i1) => { let z = 0; for (let i = i0; i < i1; i++) z += a[i] * a[i] + b[i] * b[i]; return z / Math.max(1, i1 - i0); };
    const lu = z => -0.691 + 10 * Math.log10(z + 1e-12);
    const blk = Math.round(SR * .4), hop = Math.round(SR * .1), zs = [];
    for (let i = 0; i + blk <= n; i += hop) zs.push(ms(kL, kR, i, i + blk));
    let g = zs.filter(z => lu(z) > -70); const rel = lu(g.reduce((a, b) => a + b, 0) / Math.max(1, g.length)) - 10; g = g.filter(z => lu(z) > rel);
    const lufs = lu(g.reduce((a, b) => a + b, 0) / Math.max(1, g.length));
    const barL = []; for (let b = 0; b < bars; b++) barL.push(lu(ms(kL, kR, b * barLen, (b + 1) * barLen)));
    // spectrum of mid and side (4096-point FFT, Hann window)
    const N = 4096, W = new Float32Array(N).map((_, i) => .5 - .5 * Math.cos(2 * Math.PI * i / N)), PM = new Float64Array(N / 2), PS = new Float64Array(N / 2);
    const re = new Float64Array(N), im = new Float64Array(N);
    const fft = () => { for (let i = 1, j = 0; i < N; i++) { let b = N >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
      for (let len = 2; len <= N; len <<= 1) { const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
        for (let i = 0; i < N; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const p = i + k, q = p + len / 2, tr = re[q] * cr - im[q] * ci, ti = re[q] * ci + im[q] * cr; re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } } };
    for (let o = 0; o + N <= n; o += N) for (const [P, sg] of [[PM, 1], [PS, -1]]) {
      for (let i = 0; i < N; i++) { const l = L[o + i], r = R[o + i]; re[i] = (l === l && r === r ? (l + sg * r) / 2 : 0) * W[i]; im[i] = 0; }
      fft(); for (let k = 0; k < N / 2; k++) P[k] += re[k] * re[k] + im[k] * im[k];
    }
    const band = (P, f1, f2) => { let z = 1e-20; for (let k = Math.max(1, Math.round(f1 * N / SR)); k <= Math.min(N / 2 - 1, Math.round(f2 * N / SR)); k++) z += P[k]; return z; };
    const db = x => 10 * Math.log10(x);
    const oct = [63, 125, 250, 500, 1000, 2000, 4000, 8000].map(fc => db(band(PM, fc / Math.SQRT2, fc * Math.SQRT2)));
    const mx = 3.5, my = oct.reduce((a, b) => a + b, 0) / 8; let num = 0, den = 0; oct.forEach((y, i) => { num += (i - mx) * (y - my); den += (i - mx) ** 2; });
    // dropouts: longest stretch of 10 ms windows below -60 dBFS
    let gap = 0, run = 0; const w = Math.round(SR * .01);
    for (let i = 0; i + w <= n; i += w) { const z = ms(L, R, i, i + w) / 2; if (z < 1e-6) { run += .01; gap = Math.max(gap, run); } else run = 0; }
    return { lufs, peak: db(pk * pk + 1e-20) , clips, nan, dc: dc / (2 * n), plr: db(pk * pk + 1e-20) - lufs, barL, barSwing: Math.max(...barL) - Math.min(...barL),
      tilt: num / den, bassWeight: db(band(PM, 20, 250) / band(PM, 250, 6000)), air: db(band(PM, 6000, 20000) / band(PM, 20, 20000)),
      lowSide: db(band(PS, 20, 120) / band(PM, 20, 120)), width: db(band(PS, 20, 20000) / band(PM, 20, 20000)), corr: sLR / Math.sqrt(sLL * sRR + 1e-20), gap, octaves: oct.map(v => Math.round(v * 10) / 10) };
  };
}

/** One Launch inside a fresh page: generate, play offline, measure. */
async function launchOnce(page, job) {
  await page.goto(URL0);
  await page.waitForFunction(() => typeof generate === 'function' && document.querySelector('#mood'));
  return page.evaluate(async ({ mood, seed, warm, bars, audio }) => {
    const sel = document.querySelector('#mood'); sel.value = mood; __seed(seed);
    const t0 = performance.now(); let genErr = null;
    try { generate(); } catch (e) { genErr = String(e && e.stack || e); }
    const genMs = performance.now() - t0;
    let a = null;
    if (audio && !genErr) {
      const barS = 240 / G.bpm; window.__SEC = (warm + bars) * barS + .1;
      toggle(); // ▶ Ignite
      const oc = window.__oc;
      if (!oc) throw new Error('engine did not start');
      const step = .05, end = window.__SEC - .02, OS = OfflineAudioContext.prototype.suspend;
      for (let t = step; t < end; t += step) OS.call(oc, +t.toFixed(4)).then(() => { try { if (ctx === oc) tick(); } catch (e) { __errors.push('tick: ' + e) } oc.__res(); });
      try { tick(); } catch (e) {}
      const buf = await oc.startRendering();
      if (ctx !== oc) __errors.push('audio engine was rebuilt during the render');
      a = __analyze(buf, Math.round(warm * barS * 48000), Math.round(barS * 48000), bars);
    }
    const r4 = v => Math.round(v * 1e4) / 1e4;
    const d = { mood: curMood, bpm: G.bpm, swing: r4(G.swing || 0), scale: G.scale, root: G.root,
      TR: TR.map(T => ({ n: T.n, st: T.st, h: T.h, m: !!T.m, pt: (T.pt || []).map(x => x ? 1 : 0).join(''), mode: T.p && (T.p.mode || T.p.pv) || '' })) };
    const errors = [...__errors]; if (genErr) errors.unshift('generate: ' + genErr);
    return { d, a, genMs, errors };
  }, { ...job, warm: WARM, bars: BARS, audio: AUDIO });
}

// ---------- run ----------
const t0 = Date.now();
const browser = await pw.chromium.launch({ headless: true, ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const pages = await Promise.all(Array.from({ length: WORKERS }, async () => {
  const p = await browser.newPage(); p.__console = [];
  p.on('pageerror', e => p.__console.push(String(e.message)));
  p.on('console', m => { if (m.type() === 'error') p.__console.push('console.error: ' + m.text()); });
  await p.addInitScript(initScript); return p;
}));
await pages[0].goto(URL0); await pages[0].waitForFunction(() => document.querySelector('#mood'));
const pageMoods = await pages[0].evaluate(() => [...document.querySelector('#mood').options].map(o => o.value).filter(v => v !== 'Auto'));
const moods = ONLY ? [ONLY] : pageMoods;
const missing = pageMoods.filter(m => !PROFILES[m]);
const jobs = Array.from({ length: N }, (_, i) => ({ i, mood: moods[i % moods.length], seed: SEED + i * 7919 }));
console.log(`Orbitron genre suite · ${N} Launches · ${moods.length} moods · ${AUDIO ? BARS + ' bars of audio each' : 'no audio'} · ${WORKERS} tabs · seed ${SEED}`);
if (missing.length) console.log(`  ! no profile for: ${missing.join(', ')} (generic rules used)`);

const results = []; let done = 0;
await Promise.all(pages.map(async page => {
  for (let job; (job = jobs.shift());) {
    page.__console.length = 0;
    let res;
    try { res = await launchOnce(page, job); res.errors.push(...page.__console); }
    catch (e) { res = { d: null, a: null, genMs: 0, errors: ['harness: ' + String(e.message).split('\n')[0]] }; }
    const P = PROFILES[job.mood] || DEFAULT_PROFILE;
    const checks = res.d ? check(res, P) : [{ group: 'glitch', rule: 'Launch ran', ok: false, value: res.errors[0], want: 'runs' }];
    const fails = checks.filter(c => !c.ok);
    results.push({ ...job, genre: P.genre, pass: !fails.length, fails, checks, digest: res.d, audio: res.a, genMs: res.genMs, errors: res.errors });
    done++;
    if (VERBOSE || process.stdout.isTTY) process.stdout.write(`\r  ${done}/${N} done`);
  }
}));
await browser.close(); server.close();
if (process.stdout.isTTY || VERBOSE) process.stdout.write('\n');

// ---------- report ----------
results.sort((a, b) => a.i - b.i);
const pass = results.filter(r => r.pass).length, secs = ((Date.now() - t0) / 1000).toFixed(0);
const byMood = {}; for (const r of results) (byMood[r.mood] ||= []).push(r);
const byRule = {}; for (const r of results) for (const f of r.fails) { const k = f.group + ' · ' + f.rule; (byRule[k] ||= { n: 0, ex: [] }).n++; if (byRule[k].ex.length < 3) byRule[k].ex.push(`${r.mood}: ${f.value}`); }

console.log(`\nRESULT  ${pass}/${N} Launches pass  (${Math.round(100 * pass / N)}%)  in ${secs} s\n`);
console.log('By mood (pass/total · subgenre · most common problem)');
for (const m of moods) { const rs = byMood[m] || []; if (!rs.length) continue;
  const p = rs.filter(r => r.pass).length, cnt = {}; rs.forEach(r => r.fails.forEach(f => cnt[f.rule] = (cnt[f.rule] || 0) + 1));
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => `${k} ×${v}`).join(', ');
  console.log(`  ${p === rs.length ? '✓' : '✗'} ${m.padEnd(18)} ${String(p).padStart(2)}/${rs.length}  ${(PROFILES[m] || DEFAULT_PROFILE).genre.padEnd(28)} ${top}`); }
console.log('\nBy rule (Launches failing · examples)');
for (const [k, v] of Object.entries(byRule).sort((a, b) => b[1].n - a[1].n)) console.log(`  ${String(v.n).padStart(3)}  ${k.padEnd(48)} ${v.ex.join(' | ')}`);
if (AUDIO) {
  const med = (k, rs) => { const v = rs.map(r => r.audio && r.audio[k]).filter(x => x != null && isFinite(x)).sort((a, b) => a - b); return v.length ? (Math.round(v[v.length >> 1] * 10) / 10) : '-'; };
  console.log('\nMedian mix per mood   LUFS   PLR  tilt  bassW   air  width');
  for (const m of moods) { const rs = byMood[m] || []; if (!rs.length) continue; console.log(`  ${m.padEnd(18)} ${['lufs', 'plr', 'tilt', 'bassWeight', 'air', 'width'].map(k => String(med(k, rs)).padStart(6)).join('')}`); }
}
const OUT = join(ROOT, 'tests/genre/out'); mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'report.json'), JSON.stringify({ seed: SEED, n: N, bars: BARS, pass, seconds: +secs, results }, null, 1));
console.log(`\nFull details: tests/genre/out/report.json · repeat this run: node tests/genre/run.mjs --seed ${SEED}${ONLY ? ' --mood "' + ONLY + '"' : ''} --n ${N}`);
process.exitCode = pass === N ? 0 : 1;
