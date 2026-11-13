#!/usr/bin/env node
// Look inside the running app without a human: loads index.html in headless Chrome (seeded random,
// clean storage), optionally plays / launches, evaluates an expression and prints the result + any errors.
//
//   node tools/probe.mjs "G.bpm"                                  read state
//   node tools/probe.mjs --mood Acid --launch "TR[4].p.mode"      Launch a mood, inspect the lead
//   node tools/probe.mjs --play --mood Noir --launch --listen 2000  hear it: peak / rms / late notes / step grid
//   node tools/probe.mjs --seed 7 "(generate(), __digest())"       full Launch digest (same as the snapshot test)
//   node tools/probe.mjs --debug --play --launch --listen 3000      debug build: also list errors swallowed by catch(e){}
// Exit code 1 if the page logged errors. Needs Playwright (see tests/harness.mjs).
import { openApp, unavailable, PAGE_HELPERS } from '../tests/harness.mjs';

const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); if (i < 0) return undefined; a.splice(i, 1); return true; };
const val = k => { const i = a.indexOf(k); if (i < 0) return undefined; const v = a[i + 1]; a.splice(i, 2); return v; };
const debug = opt('--debug'), seed = val('--seed'), mood = val('--mood'), listen = val('--listen'), play = opt('--play'), launch = opt('--launch');
const expr = a.join(' ');
const why = unavailable();
if (why) { console.error(why); process.exit(2); }
if (debug) { const { execFileSync } = await import('node:child_process'); execFileSync(process.execPath, [new URL('./build.mjs', import.meta.url).pathname, '--debug'], { stdio: 'ignore' }); }
const app = await openApp({ debug });
try {
  const { page, errors } = app;
  await page.evaluate(PAGE_HELPERS);
  if (seed) await page.evaluate(n => __seed(n), +seed);
  if (play) { await page.click('#play'); await page.waitForFunction(() => window.__ctx && playing); }
  if (mood) await page.evaluate(m => { document.querySelector('#mood').value = m; }, mood);
  if (launch) await page.evaluate(() => generate());
  if (launch && play) await page.waitForTimeout(2300);
  const out = {};
  if (listen) out.listen = await page.evaluate(ms => __listen(ms), +listen);
  if (expr) out.result = await page.evaluate(e => Promise.resolve((0, eval)(e)).then(v => v === undefined ? 'undefined' : JSON.parse(JSON.stringify(v))), expr);
  const errs = [...errors, ...await page.evaluate(() => window.__errors)];
  if (errs.length) out.errors = errs;
  if (debug) out.swallowed = await page.evaluate(() => orbErrors());
  console.log(JSON.stringify(out, null, 1));
  process.exitCode = errs.length ? 1 : 0;
} catch (e) { console.error('probe failed: ' + e.message); process.exitCode = 1; }
finally { await app.close(); }
