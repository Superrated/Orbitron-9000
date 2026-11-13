/* Orbitron debug prelude — only in debug.html (node tools/build.mjs --debug), never in index.html.
   Collects errors that the app swallows in catch(e){} and uncaught ones, deduplicated, with the src/ file and line.
   Console: orbErrors() → table · orbErrors(true) → also full stacks · orbErrors.clear() */
(function () {
  const MAP = /*__ORB_SRCMAP__*/{};
  const seen = new Map();
  const where = st => {
    for (const m of String(st || '').matchAll(/orbitron\/([^\s:)]+):(\d+)/g)) {
      const url = m[1]; let ln = +m[2]; const parts = MAP[url];
      if (!parts) return `src/${url}:${ln}`;
      let f = parts[0];
      for (const p of parts) if (p[0] <= ln) f = p; // [firstLine, srcPath]
      return `src/${f[1]}:${ln - f[0] + 1}`;
    }
    return '(no src frame)';
  };
  const note = (kind, e) => {
    const msg = String(e && e.message || e), at = where(e && e.stack), k = kind + '|' + msg + '|' + at;
    const r = seen.get(k);
    if (r) { r.count++; return; }
    seen.set(k, { kind, msg, at, count: 1, stack: e && e.stack });
    if (kind !== 'caught') console.warn('[orbitron ' + kind + '] ' + msg + ' @ ' + at);
  };
  window.__orbCaught = e => { try { note('caught', e); } catch (_) {} };
  addEventListener('error', ev => note('uncaught', ev.error || ev.message));
  addEventListener('unhandledrejection', ev => note('rejection', ev.reason));
  window.orbErrors = full => {
    const rows = [...seen.values()].sort((a, b) => b.count - a.count);
    console.table(rows.map(r => ({ kind: r.kind, count: r.count, at: r.at, msg: r.msg.slice(0, 120) })));
    if (full) rows.forEach(r => console.log(r.at + '\n' + r.stack));
    return rows.map(({ stack, ...r }) => r);
  };
  window.orbErrors.clear = () => seen.clear();
})();
