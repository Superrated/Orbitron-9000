#!/usr/bin/env node
// Regenerates the code maps that let an agent find the right file without reading the code:
//   src/js/<area>/INDEX.md  one line per file: what it does, what it defines, what it wraps
//   docs/HOOKS.md           every global function that later files wrap, with the wrap chain in run order
// No dependencies. Run after adding, removing or renaming files:  node tools/index.mjs
// `--check` exits 1 if the maps are stale (used by the tests).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManifest } from './build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

/** Strip strings, template literals, comments and regex literals (replaced by spaces) so brace depth and names can be read safely. */
export function blank(code, keepStrings = false) {
  let out = '', i = 0, prev = '';
  const n = code.length;
  const regexOk = () => !prev || /[(,=:[!&|?{};+\-*%<>~^]$/.test(prev) || /\b(return|typeof|case|do|else|in|of|void|delete|new|throw)$/.test(prev);
  while (i < n) {
    const c = code[i], d = code[i + 1];
    if (c === '/' && d === '/') { const j = code.indexOf('\n', i); const e = j < 0 ? n : j; out += ' '.repeat(e - i); i = e; continue; }
    if (c === '/' && d === '*') { const j = code.indexOf('*/', i + 2); const e = j < 0 ? n : j + 2; out += code.slice(i, e).replace(/[^\n]/g, ' '); i = e; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      if (c === '`') { // template: keep ${…} expressions (they can hold braces/functions) — treat simply as opaque
        let depth = 0;
        for (; j < n; j++) { const x = code[j]; if (x === '\\') { j++; continue; } if (depth === 0 && x === '`') break; if (x === '$' && code[j + 1] === '{') { depth++; j++; continue; } if (depth && x === '}') depth--; }
      } else { for (; j < n; j++) { const x = code[j]; if (x === '\\') { j++; continue; } if (x === c || x === '\n') break; } }
      out += keepStrings ? code.slice(i, j + 1) : code[i] + code.slice(i + 1, j).replace(/[^\n]/g, ' ') + (code[j] || ''); i = j + 1; prev = 'x'; continue;
    }
    if (c === '/' && regexOk()) {
      let j = i + 1, cls = false;
      for (; j < n; j++) { const x = code[j]; if (x === '\\') { j++; continue; } if (x === '\n') break; if (x === '[') cls = true; else if (x === ']') cls = false; else if (x === '/' && !cls) break; }
      out += ' '.repeat(j + 1 - i); i = j + 1; prev = 'x'; continue;
    }
    out += c; if (!/\s/.test(c)) prev = /[\w$]/.test(c) ? (/[\w$]/.test(prev.slice(-1)) ? prev + c : c) : c; i++;
  }
  return out;
}

/** Names declared at depth 0 (function / const / let / var / class) and window.X assignments anywhere. */
export function analyse(code) {
  const b = blank(code);
  const defs = new Set(), assigns = [];
  let depth = 0;
  for (let i = 0; i < b.length; i++) {
    const c = b[i];
    if (c === '{' || c === '(' || c === '[') { depth++; continue; }
    if (c === '}' || c === ')' || c === ']') { depth--; continue; }
    if (depth !== 0 || !/[a-z]/.test(c) || /[\w$.]/.test(b[i - 1] || '')) continue;
    const m = /^(?:async\s+)?(function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([^;]*)|class\s+([A-Za-z_$][\w$]*))/.exec(b.slice(i, i + 4000));
    if (!m) continue;
    if (m[2]) defs.add(m[2]);
    else if (m[4]) defs.add(m[4]);
    else if (m[3]) { // const a=…, b=… : names at bracket depth 0 of the declaration list
      let dd = 0, seg = '';
      for (const ch of m[3]) { if ('([{'.includes(ch)) dd++; else if (')]}'.includes(ch)) dd--; if (dd === 0) seg += ch; else seg += ' '; }
      for (const part of seg.split(',')) { const k = /^\s*([A-Za-z_$][\w$]*)\s*(=|$)/.exec(part); if (k) defs.add(k[1]); }
    }
  }
  for (const m of b.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=(?![=>])/g)) defs.add(m[1]);
  // reassignments `name=function`, `name=(…)=>`, `window.name=function` — candidate wraps / overrides
  for (const m of b.matchAll(/(?<![\w$.])(?:window\.)?([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g)) {
    if (/\b(?:const|let|var)\s+$/.test(b.slice(Math.max(0, m.index - 8), m.index))) continue; // a local declaration, not a wrap
    assigns.push(m[1]);
  }
  return { defs: [...defs], assigns };
}

/** First comment of a file, flattened to one line. */
export function summary(code, max = 150) {
  const m = /\/\*([\s\S]*?)\*\//.exec(code.slice(0, 3000));
  let s = m ? m[1] : code.slice(0, 200);
  s = s.replace(/\s+/g, ' ').replace(/^[\s-]*/, '').replace(/[\s-]*$/, '').trim();
  return s.length > max ? s.slice(0, max - 1).replace(/\s+\S*$/, '') + ' …' : s;
}

export function buildMaps() {
  const files = readManifest().filter(e => e.kind !== 'raw').map(e => {
    const text = readFileSync(join(SRC, e.path), 'utf8');
    return { path: e.path, area: e.path.split('/')[1], text, ...analyse(text) };
  });
  const firstDef = new Map();
  files.forEach((f, i) => f.defs.forEach(d => { if (!firstDef.has(d)) firstDef.set(d, i); }));
  // a wrap = reassigning a global that an EARLIER file already defined
  const chains = new Map();
  files.forEach((f, i) => {
    f.wraps = [...new Set(f.assigns.filter(a => firstDef.has(a) && firstDef.get(a) < i))];
    f.wraps.forEach(w => { if (!chains.has(w)) chains.set(w, []); chains.get(w).push(f.path); });
    f.newDefs = f.defs.filter(d => firstDef.get(d) === i);
  });
  const areas = {};
  for (const f of files) (areas[f.area] ||= []).push(f);
  const out = {};
  const META = JSON.parse(readFileSync(join(SRC, 'meta.json'), 'utf8')), AREA = META.areas, NOTE = META.notes || {};
  for (const [a, list] of Object.entries(areas)) {
    let md = `# src/js/${a}/ — ${AREA[a] || ''}\n\nGenerated by \`node tools/index.mjs\` — do not edit by hand. Files run in src/build.txt order (number = position).\n` +
      `Per file: what it does · **defines** new globals · **wraps** globals defined by earlier files (see docs/HOOKS.md for the full chains).\n\n`;
    for (const f of list) {
      const name = f.path.split('/').pop();
      const kb = (f.text.length / 1024).toFixed(1);
      md += `- **${name}** (${kb} KB) — ${NOTE[f.path] || summary(f.text)}`;
      const nd = f.newDefs.filter(d => d.length > 1).slice(0, 14);
      if (nd.length) md += `\n  defines: ${nd.join(' ')}${f.newDefs.length > 14 ? ' …' : ''}`;
      if (f.wraps.length) md += `\n  wraps: ${f.wraps.join(' ')}`;
      md += '\n';
    }
    out[`src/js/${a}/INDEX.md`] = md;
  }
  let hooks = `# Wrap chains (generated by \`node tools/index.mjs\` — do not edit)\n\n` +
    `A file "wraps" a global when it reassigns a function an earlier file defined, usually \`{const _g=fn;fn=function(){…_g.apply(this,arguments)…}}\`.\n` +
    `Call order: the LAST file listed runs first and calls down the chain. To change what a function finally does, read the last few files of its chain.\n` +
    `Defined in = the first file that declares it.\n\n`;
  const sorted = [...chains.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  for (const [name, list] of sorted) {
    const def = files[firstDef.get(name)].path;
    hooks += `## ${name} — ${list.length} wrap${list.length > 1 ? 's' : ''}, defined in ${def}\n`;
    hooks += list.map(p => p.replace(/^js\//, '')).join(' → ') + '\n\n';
  }
  out['docs/HOOKS.md'] = hooks;
  // mood map: which files name each mood (internal key) in code — strings and object keys, comments ignored
  const base = files.find(f => /window\.MOODNAME=/.test(f.text));
  const mn = base && /window\.MOODNAME=\{[\s\S]*?\};/.exec(base.text);
  const moods = mn ? Object.entries(new Function('const window={};' + mn[0] + 'return window.MOODNAME')()) : []; // data literal only
  let mm = `# Mood map (generated by \`node tools/index.mjs\` — do not edit)\n\n` +
    `Moods have an internal key (used in code, sectors, exports) and a display name (MOODNAME, shown in the UI).\n` +
    `Each line lists the files whose CODE names that key (comments ignored), in run order — start with the last ones: they win.\n` +
    `Files that touch most moods at once (tables keyed by every mood) are listed once under "all-mood tables".\n\n`;
  const code = files.map(f => blank(f.text, true));
  const hit = moods.map(([k]) => { const re = new RegExp(`(['"])${k.replace(/ /g, ' ')}\\1|[{,]\\s*${/ /.test(k) ? '(?!)' : k}\\s*:`); return files.filter((f, i) => re.test(code[i])).map(f => f.path); });
  const many = files.filter(f => hit.filter(h => h.includes(f.path)).length >= Math.ceil(moods.length * 0.6)).map(f => f.path);
  mm += `**all-mood tables** (${many.length} files): ${many.map(p => p.replace(/^js\//, '')).join(', ')}\n\n`;
  moods.forEach(([k, d], i) => {
    const own = hit[i].filter(p => !many.includes(p));
    mm += `- **${k}** (“${d}”) — ${own.length ? own.map(p => p.replace(/^js\//, '')).join(', ') : 'only the all-mood tables'}\n`;
  });
  out['docs/MOODS.md'] = mm;
  return out;
}

if (process.argv[1]?.endsWith('index.mjs')) {
  const maps = buildMaps();
  if (process.argv.includes('--check')) {
    const stale = Object.entries(maps).filter(([p, c]) => !existsSync(join(ROOT, p)) || readFileSync(join(ROOT, p), 'utf8') !== c).map(([p]) => p);
    console.log(stale.length ? 'stale maps — run: node tools/index.mjs\n  ' + stale.join('\n  ') : 'code maps are up to date');
    process.exit(stale.length ? 1 : 0);
  }
  for (const [p, c] of Object.entries(maps)) writeFileSync(join(ROOT, p), c);
  console.log('wrote ' + Object.keys(maps).join(', '));
}
