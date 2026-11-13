#!/usr/bin/env node
// Measure how loud every part is after a Launch, per mood: plays the app headless, solos each unmuted track in turn and
// reads its loudness (K-weighted, like LUFS without gating) where the buses meet (A.m, before the master chain).
// So bus gains, the lead compressor and the echo/reverb returns are all included; the master's automatic loudness is not.
//
//   node tools/levels.mjs                         every mood, seeds 1-6, 8 browsers in parallel  -> JSON on stdout
//   node tools/levels.mjs --moods Acid,Noir --seeds 1,2,3 --workers 2 --out levels.json
//   node tools/levels.mjs --report levels.json    table: per mood and part, median dB against the kick / against the full mix
//
// Per Launch: tracks[k] = { db (absolute), lv, trim, s (the sound's text settings) }, mix = the full groove.
// qos = the highest load level seen (above 1 the app sheds effects and voices: use fewer --workers and measure again).
import { openApp, unavailable, PAGE_HELPERS } from '../tests/harness.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const a = process.argv.slice(2), val = k => { const i = a.indexOf(k); if (i < 0) return undefined; const v = a[i + 1]; a.splice(i, 2); return v; };
const NM = ['kick', 'hat', 'clap', 'perc', 'lead', 'pad', 'bass', 'snare', 'stab', 'sat'];
const med = v => { const s = [...v].sort((x, y) => x - y); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : NaN; };

const rep = val('--report');
if (rep) { report(JSON.parse(readFileSync(rep, 'utf8'))); process.exit(0); }

export function summarize(rows) {
  const by = {};
  for (const r of rows) (by[r.mood] || (by[r.mood] = [])).push(r);
  const out = {};
  for (const m in by) {
    out[m] = {};
    for (let k = 0; k < 10; k++) {
      const rs = by[m].filter(r => r.tracks[k]);
      if (!rs.length) continue;
      const vk = rs.filter(r => r.tracks[0]).map(r => r.tracks[k].db - r.tracks[0].db), vm = rs.map(r => r.tracks[k].db - r.mix);
      out[m][k] = { n: rs.length, of: by[m].length, kick: med(vk), mix: med(vm), lo: Math.min(...vm), hi: Math.max(...vm) };
    }
  }
  return out;
}
function report(rows) {
  const S = summarize(rows), f = v => v == null || v !== v ? '    .' : (v > 0 ? '+' : '') + v.toFixed(1).padStart(v > 0 ? 4 : 5);
  for (const ref of ['kick', 'mix']) {
    console.log(`\nmedian dB against the ${ref}  (n = Launches in which the part played)`);
    console.log('mood'.padEnd(20) + NM.map(n => n.padStart(9)).join(''));
    for (const m in S) console.log(m.padEnd(20) + NM.map((_, k) => S[m][k] ? (f(S[m][k][ref]) + '/' + S[m][k].n).padStart(9) : '        .').join(''));
  }
  console.log('\nspread per mood against the mix (max - min over Launches, dB)');
  for (const m in S) console.log(m.padEnd(20) + NM.map((_, k) => S[m][k] && S[m][k].n > 1 ? (S[m][k].hi - S[m][k].lo).toFixed(1).padStart(9) : '        .').join(''));
}

const why = unavailable();
if (why) { console.error(why); process.exit(2); }
const seeds = (val('--seeds') || '1,2,3,4,5,6').split(',').map(Number), nW = +(val('--workers') || 8), outF = val('--out'), moodArg = val('--moods');

/** In the page, with the Launch playing: solo every unmuted track in turn. */
const pageMeasure = async ({ mood, seed }) => {
  const c = window.__ctx;
  if (!window.__lv) {
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 38; hp.Q.value = .5;
    const sh = c.createBiquadFilter(); sh.type = 'highshelf'; sh.frequency.value = 1500; sh.gain.value = 4;
    const an = c.createAnalyser(); an.fftSize = 2048; A.m.connect(hp); hp.connect(sh); sh.connect(an);
    window.__lv = { an, buf: new Float32Array(2048) };
  }
  const { an, buf } = window.__lv, wait = ms => new Promise(r => setTimeout(r, ms));
  const meas = async ms => { let ss = 0, n = 0; const t0 = performance.now();
    while (performance.now() - t0 < ms) { an.getFloatTimeDomainData(buf); for (let i = 0; i < buf.length; i++) ss += buf[i] * buf[i]; n += buf.length; await wait(20); }
    return 10 * Math.log10(ss / Math.max(1, n) + 1e-12); };
  await wait(1500);
  const bar = 16 * 60 / G.bpm / 4 * 1000, M0 = TR.map(T => !!T.m), res = { mood, seed, bpm: G.bpm, tracks: {}, qos: 0 };
  const txt = p => { const o = {}; for (const k in p) if (typeof p[k] === 'string') o[k] = p[k]; return o; };
  try {
    res.mix = +(await meas(2 * bar)).toFixed(2);
    for (const k of [0, 1, 2, 7, 3, 6, 4, 8, 9, 5]) {
      if (M0[k]) continue;
      TR.forEach((T, j) => { T.m = j !== k; }); await wait(1000);
      res.qos = Math.max(res.qos, QOS.lvl || 0);
      const db = await meas((k < 4 || k === 7 ? 2 : 4) * bar);
      if (db > -90) res.tracks[k] = { db: +db.toFixed(2), lv: +(+TR[k].lv).toFixed(3), trim: (window.TRIM || TRIM)[k], s: txt(TR[k].p) };
    }
  } finally { TR.forEach((T, j) => { T.m = M0[j]; }); }
  await wait(1200);
  return res;
};

const first = await openApp();
await first.page.evaluate(PAGE_HELPERS);
const moods = moodArg ? moodArg.split(',') : await first.page.evaluate(() => __moods());
const jobs = []; for (const mood of moods) for (const seed of seeds) jobs.push({ mood, seed });
const rows = []; let done = 0;
const prep = async page => {
  await page.evaluate(PAGE_HELPERS);
  await page.evaluate(() => {
    viz = function () {};                                       // no visuals: more browsers fit on the machine
    for (const k of ['lvl', 'ml']) Object.defineProperty(QOS, k, { get: () => 0, set() {} });   // a busy test machine must not make the app shed voices and effects
  });
};
const worker = async app => {
  try {
    const { page } = app;
    for (let j; (j = jobs.shift());) {
      try {
        await page.reload(); await page.waitForFunction(() => typeof generate === 'function' && document.querySelector('#mood'));
        await prep(page);   // a fresh page per Launch, launched while stopped: the same mood + seed is the same groove in every run, so before / after can be compared
        await page.evaluate(({ mood, seed }) => { __seed(seed); document.querySelector('#mood').value = mood; generate(); }, j);
        await page.waitForTimeout(300); await page.click('#play'); await page.waitForFunction(() => window.__ctx && playing);
        rows.push(await page.evaluate(pageMeasure, j));
      } catch (e) { console.error(`failed ${j.mood} #${j.seed}: ${e.message}`); }
      console.error(`${++done} ${j.mood} #${j.seed}`);
    }
  } finally { await app.close(); }
};
const apps = [first]; for (let i = 1; i < Math.min(nW, jobs.length); i++) apps.push(await openApp());
await Promise.all(apps.map(worker));
rows.sort((x, y) => moods.indexOf(x.mood) - moods.indexOf(y.mood) || x.seed - y.seed);
const json = JSON.stringify(rows);
if (outF) { writeFileSync(outF, json); report(rows); } else console.log(json);
