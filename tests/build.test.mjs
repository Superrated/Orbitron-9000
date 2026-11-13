// Fast static checks (no browser, ~1 s):  node --test tests/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { assemble, syntaxCheck } from '../tools/build.mjs';
import { buildMaps } from '../tools/index.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const walk = d => readdirSync(d).flatMap(f => statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]);

test('index.html is exactly what src/ builds (run: node tools/build.mjs)', () => {
  const { html } = assemble();
  assert.ok(readFileSync(join(ROOT, 'index.html'), 'utf8') === html, 'index.html is stale or was edited by hand — edit src/ and rebuild');
});

test('every script compiles', () => {
  const { scripts } = assemble();
  assert.deepEqual(syntaxCheck(scripts), []);
});

test('every src/js file is listed once in src/build.txt and parses on its own', () => {
  const { entries } = assemble();
  const listed = entries.map(e => e.path);
  assert.equal(new Set(listed).size, listed.length, 'a file is listed twice');
  for (const f of walk(join(ROOT, 'src/js')).filter(f => f.endsWith('.js'))) {
    const rel = f.slice(join(ROOT, 'src').length + 1).split('\\').join('/');
    assert.ok(listed.includes(rel), `${rel} is not in src/build.txt`);
    assert.doesNotThrow(() => new vm.Script(readFileSync(f, 'utf8'), { filename: rel }), `${rel} does not parse on its own`);
  }
});

test('file names follow src/js/<area>/<NNNN>-<slug>.js and numbers rise in build order', () => {
  const { entries } = assemble();
  const AREAS = Object.keys(JSON.parse(readFileSync(join(ROOT, 'src/meta.json'), 'utf8')).areas);
  let last = -1;
  for (const e of entries.filter(e => e.kind !== 'raw')) {
    const m = /^js\/([a-z]+)\/(\d{4})-[a-z0-9-]+\.js$/.exec(e.path);
    assert.ok(m, `bad file name: ${e.path}`);
    assert.ok(AREAS.includes(m[1]), `unknown area "${m[1]}" (add it to src/meta.json): ${e.path}`);
    assert.ok(+m[2] > last, `number out of order in src/build.txt: ${e.path}`);
    last = +m[2];
  }
});

test('code maps are up to date (run: node tools/index.mjs)', () => {
  for (const [p, c] of Object.entries(buildMaps())) assert.ok(readFileSync(join(ROOT, p), 'utf8') === c, `${p} is stale`);
});

test('service worker caches every file the app needs', () => {
  const sw = readFileSync(join(ROOT, 'sw.js'), 'utf8'), html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:href|src)="((?:icons\/)[^"]+)"/g)) assert.ok(sw.includes('./' + m[1]), `sw.js CORE is missing ./${m[1]}`);
  assert.ok(sw.includes("'./index.html'"));
});
