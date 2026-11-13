#!/usr/bin/env node
// Orbitron 9000 build: stitches src/ into the single-file app index.html, in the order of src/build.txt.
// No dependencies. Pure concatenation: the output is exactly the sources, nothing is minified or rewritten.
//
//   node tools/build.mjs                 build index.html (syntax-checks every script first)
//   node tools/build.mjs --check         exit 1 if index.html is not what src/ builds (used by the tests)
//   node tools/build.mjs --release 0.71  build, then also copy to releases/orbitron-9000-v0.71.html
//   node tools/build.mjs --debug         ALSO write debug.html (not shipped, git-ignored): every script is named after its
//                                        src file in stack traces, and the ~560 silent `catch(e){}` blocks report what they
//                                        swallow — call orbErrors() in the console, or use tools/probe.mjs --debug
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const GLUE = { '': '\n', '-': '', nl2: '\n\n' };

/** Parse src/build.txt → [{kind, path, glue, line}] */
export function readManifest() {
  const out = [];
  readFileSync(join(SRC, 'build.txt'), 'utf8').split('\n').forEach((l, i) => {
    const t = l.trim();
    if (!t || t.startsWith('#')) return;
    const [kind, path, glue = ''] = t.split(/\s+/);
    if (!['raw', 'js', 'js+'].includes(kind)) throw new Error(`src/build.txt:${i + 1}: unknown kind "${kind}"`);
    if (!(glue in GLUE)) throw new Error(`src/build.txt:${i + 1}: unknown glue "${glue}"`);
    out.push({ kind, path, glue, line: i + 1 });
  });
  return out;
}

/** Group manifest entries into the output pieces; each script = list of files */
export function assemble() {
  const entries = readManifest();
  const scripts = []; // [{files:[{path, text, startLine}], glue}]
  let html = '', cur = null;
  const close = () => { if (cur) { html += '</script>' + GLUE[cur.glue]; cur = null; } };
  for (const e of entries) {
    const file = join(SRC, e.path);
    if (!existsSync(file)) throw new Error(`src/build.txt:${e.line}: missing file src/${e.path}`);
    const text = readFileSync(file, 'utf8');
    if (e.kind === 'js+') {
      if (!cur) throw new Error(`src/build.txt:${e.line}: js+ without an open script`);
      cur.files.push({ path: e.path, text }); cur.glue = e.glue; html += text; continue;
    }
    close();
    if (e.kind === 'raw') { html += text; continue; }
    html += '<script>';
    cur = { files: [{ path: e.path, text }], glue: e.glue };
    scripts.push(cur);
    html += text;
  }
  close();
  return { html, scripts, entries };
}

/** Every src/js file listed exactly once, every listed file exists */
function checkListing(entries) {
  const listed = entries.map(e => e.path);
  const dup = listed.filter((p, i) => listed.indexOf(p) !== i);
  if (dup.length) throw new Error('listed twice in src/build.txt: ' + dup.join(', '));
  const walk = d => readdirSync(d).flatMap(f => statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]);
  const missing = walk(join(SRC, 'js')).map(f => relative(SRC, f).split('\\').join('/')).filter(f => f.endsWith('.js') && !listed.includes(f));
  if (missing.length) throw new Error('not in src/build.txt (would be left out of the app): ' + missing.join(', '));
}

/** Compile (not run) every script; map a syntax error back to src file:line */
export function syntaxCheck(scripts) {
  const errors = [];
  for (const s of scripts) {
    const code = s.files.map(f => f.text).join('');
    try { new vm.Script(code, { filename: 'script' }); }
    catch (err) {
      const m = /script:(\d+)/.exec(err.stack || '');
      let ln = m ? +m[1] : 0, where = s.files[0].path;
      for (const f of s.files) { const n = f.text.split('\n').length - 1; if (ln <= n + 1) { where = f.path; break; } ln -= n; }
      errors.push(`src/${where}:${ln}  ${err.message}`);
    }
  }
  return errors;
}

/** Debug build: same app, plus error reporting. Never shipped. */
export function assembleDebug() {
  const { scripts, entries } = assemble();
  const map = {}; // sourceURL -> [[firstLine, srcPath], ...] for scripts made of several files
  let html = '', cur = null, si = 0;
  const close = () => { if (cur) { html += `\n//# sourceURL=orbitron/${cur.url}\n</script>` + GLUE[cur.glue]; cur = null; } };
  const swallow = t => t.replace(/catch\s*\((\w+)\)\s*\{\s*\}/g, 'catch($1){__orbCaught($1)}');
  for (const e of entries) {
    const text = readFileSync(join(SRC, e.path), 'utf8');
    if (e.kind === 'js+') { map[cur.url].push([cur.line, e.path]); cur.line += text.split('\n').length - 1; html += swallow(text); cur.glue = e.glue; continue; }
    close();
    if (e.kind === 'raw') { html += text; continue; }
    if (!si++) html += '<script>' + readFileSync(join(ROOT, 'tools/debug-prelude.js'), 'utf8') + '</script>';
    cur = { url: e.path, glue: e.glue, line: 1 + text.split('\n').length - 1 };
    map[e.path] = [[1, e.path]];
    html += '<script>' + swallow(text);
  }
  close();
  html = html.replace('/*__ORB_SRCMAP__*/{}', JSON.stringify(Object.fromEntries(Object.entries(map).filter(([, v]) => v.length > 1))));
  return { html, scripts };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('build.mjs')) {
  const args = process.argv.slice(2);
  try {
    const { html, scripts, entries } = assemble();
    checkListing(entries);
    const errs = syntaxCheck(scripts);
    if (errs.length) { console.error('Syntax error(s) — index.html NOT written:\n  ' + errs.join('\n  ')); process.exit(1); }
    const target = join(ROOT, 'index.html');
    if (args.includes('--check')) {
      const same = existsSync(target) && readFileSync(target, 'utf8') === html;
      console.log(same ? 'index.html is up to date with src/' : 'index.html is OUT OF DATE — run: node tools/build.mjs');
      process.exit(same ? 0 : 1);
    }
    writeFileSync(target, html);
    console.log(`index.html written: ${(html.length / 1024).toFixed(0)} KB from ${entries.length} parts, ${scripts.length} scripts`);
    if (args.includes('--debug')) {
      const d = assembleDebug();
      const bad = (() => { try { const ss = [...d.html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]); ss.forEach(c => new vm.Script(c)); return null; } catch (e) { return e.message; } })();
      if (bad) throw new Error('debug build does not compile: ' + bad);
      writeFileSync(join(ROOT, 'debug.html'), d.html); console.log('debug.html written (error-reporting build, not for release)');
    }
    const ri = args.indexOf('--release');
    if (ri >= 0) {
      const v = args[ri + 1]; if (!v) throw new Error('--release needs a version, e.g. --release 0.71');
      const rel = join(ROOT, 'releases', `orbitron-9000-v${v}.html`);
      writeFileSync(rel, html); console.log('release written: ' + relative(ROOT, rel));
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
