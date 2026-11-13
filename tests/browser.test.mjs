// Runtime regression tests in headless Chrome (~1 min). Skipped when Playwright is not installed.
//   node --test tests/*.test.mjs                      run everything
//   UPDATE_SNAPSHOTS=1 node --test tests/*.test.mjs   accept an INTENDED change to what Launch generates
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { openApp, unavailable, PAGE_HELPERS, ROOT } from './harness.mjs';

const why = unavailable();
const SNAP = join(ROOT, 'tests/snapshots/launch.json');

test('runtime (headless Chrome)', { skip: why || false, timeout: 240000 }, async t => {
  const app = await openApp();
  const { page, errors } = app;
  await page.evaluate(PAGE_HELPERS);
  try {
    await t.test('app loads without errors and exposes the core globals', async () => {
      const g = await page.evaluate(() => ({ generate: typeof generate, fire: typeof fire, tick: typeof tick, TR: TR.length, moods: __moods().length, MOODNAME: Object.keys(MOODNAME).length }));
      assert.deepEqual(errors, []);
      assert.equal(g.generate, 'function'); assert.equal(g.fire, 'function'); assert.equal(g.tick, 'function');
      assert.equal(g.TR, 10, 'ten tracks');
      assert.ok(g.moods >= 20, 'mood menu lists the moods');
    });

    await t.test('every mood has a display name and a MOODS entry', async () => {
      const bad = await page.evaluate(() => __moods().filter(m => !MOODNAME[m] || !MOODS[m]));
      assert.deepEqual(bad, []);
    });

    await t.test('Euclid patterns: hits spread evenly, rotate, never exceed steps', async () => {
      const r = await page.evaluate(() => {
        const p = (st, h, rr = 0) => pat({ st, h, r: rr }).join('');
        return { a: p(16, 4), b: p(8, 3), c: p(16, 4, 2), d: p(12, 0), e: p(13, 5), all: [5, 7, 12, 13, 16].every(st => [...Array(st + 1).keys()].every(h => pat({ st, h, r: 0 }).filter(Boolean).length === h)) };
      });
      assert.equal(r.a, '1000100010001000');
      assert.equal(r.b, '10010010');
      assert.equal(r.c, '0010001000100010');
      assert.equal(r.d, '000000000000');
      assert.equal(r.e.split('1').length - 1, 5);
      assert.ok(r.all, 'hit count = h for every steps/hits pair');
    });

    let launch;
    await t.test('Launch is deterministic and matches the snapshot for every mood', async () => {
      // Launch remembers earlier Launches (anti-repeat), so each sweep starts from a fresh page load
      const run = async () => {
        await page.reload(); await page.waitForFunction(() => typeof generate === 'function'); await page.evaluate(PAGE_HELPERS);
        return page.evaluate(() => {
          const out = {}, sel = document.querySelector('#mood');
          for (const m of __moods()) {
            __seed(1000); sel.value = m;
            const t0 = performance.now(); let err = null;
            try { generate(); } catch (e) { err = String(e && e.stack || e); }
            out[m] = { err, ms: performance.now() - t0, ...__digest() };
          }
          return out;
        });
      };
      const a = await run(), b = await run();
      launch = a;
      for (const m in a) assert.equal(a[m].err, null, `Launch threw in ${m}`);
      const snapOf = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { G: v.G, TR: v.TR }]));
      const diff = (x, y, path, out = []) => {
        if (out.length > 25) return out;
        if (x && y && typeof x === 'object' && typeof y === 'object') { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) diff(x[k], y[k], path + '.' + k, out); }
        else if (JSON.stringify(x) !== JSON.stringify(y)) out.push(`${path}: ${JSON.stringify(y)} → ${JSON.stringify(x)}`);
        return out;
      };
      const nd = diff(snapOf(a), snapOf(b), 'launch');
      assert.ok(!nd.length, 'two Launch sweeps with the same seed differ — Launch depends on something other than the seed:\n  ' + nd.join('\n  '));
      const snap = snapOf(a);
      if (process.env.UPDATE_SNAPSHOTS || !existsSync(SNAP)) {
        mkdirSync(join(ROOT, 'tests/snapshots'), { recursive: true });
        writeFileSync(SNAP, '{\n' + Object.entries(snap).map(([k, v]) => `${JSON.stringify(k)}: {"G": ${JSON.stringify(v.G)},\n "TR": [\n  ${v.TR.map(x => JSON.stringify(x)).join(',\n  ')}]}`).join(',\n') + '\n}\n');
        t.diagnostic('snapshot written: tests/snapshots/launch.json');
        return;
      }
      const d = diff(snap, JSON.parse(readFileSync(SNAP, 'utf8')), 'launch');
      assert.ok(!d.length, 'Launch output changed (if intended: UPDATE_SNAPSHOTS=1 node --test tests/*.test.mjs):\n  ' + d.join('\n  '));
    });

    await t.test('Launch stays fast (main-thread time per Launch)', async () => {
      const worst = Object.entries(launch).sort((x, y) => y[1].ms - x[1].ms)[0];
      t.diagnostic(`slowest Launch: ${worst[0]} ${worst[1].ms.toFixed(0)} ms`);
      assert.ok(worst[1].ms < 1500, `Launch of ${worst[0]} took ${worst[1].ms.toFixed(0)} ms`);
    });

    await t.test('every mood plays: audible, finite, under 0 dBFS, notes scheduled ahead, steady grid', async () => {
      await page.click('#play');
      await page.waitForFunction(() => window.__ctx && __ctx.state === 'running' && playing);
      const rows = [];
      for (const m of await page.evaluate(() => __moods())) {
        const r = await page.evaluate(async m => {
          __seed(2000); document.querySelector('#mood').value = m; generate();
          await new Promise(r => setTimeout(r, 2300)); // Launch lands on the next downbeat; let the groove settle
          return __listen(1600);
        }, m);
        rows.push([m, r]);
        assert.equal(r.nan, 0, `${m}: NaN samples in the output`);
        assert.ok(r.rms > 0.002, `${m}: output is (nearly) silent, rms ${r.rms}`);
        assert.ok(r.peak <= 1.0, `${m}: output clips, peak ${r.peak}`);
        assert.ok(r.notes > 0, `${m}: no notes fired`);
        assert.equal(r.late, 0, `${m}: ${r.late} notes were scheduled in the past`);
        assert.ok(r.stepMin !== null && Math.abs(r.stepMin - r.sd) < 1e-6 && Math.abs(r.stepMax - r.sd) < 1e-6, `${m}: step grid not steady (${r.stepMin}–${r.stepMax}, expected ${r.sd})`);
      }
      for (const [m, r] of rows) t.diagnostic(`${m.padEnd(18)} rms ${r.rms.toFixed(3)} peak ${r.peak.toFixed(2)} notes ${r.notes} lead ≥ ${(r.minLead * 1000).toFixed(0)} ms`);
      await page.click('#play');
    });

    await t.test('no page errors during the whole run', async () => {
      const inPage = await page.evaluate(() => window.__errors);
      assert.deepEqual([...errors, ...inPage], []);
    });
  } finally { await app.close(); }
});
