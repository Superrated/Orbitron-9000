// Headless-browser harness shared by tests/browser.test.mjs and tools/probe.mjs.
// Needs Playwright + a Chrome/Chromium (not a project dependency: a global install or $PLAYWRIGHT_PATH is used if present).
// The app is served from the repo over a throw-away local http server, Math.random is seeded,
// and an analyser is tapped onto the live audio output so tests can measure what you would hear.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import http from 'node:http';
import { existsSync, createReadStream } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_PATH, 'playwright'];
  try { tries.push(join(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(), 'playwright')); } catch {}
  for (const t of tries.filter(Boolean)) { try { return require(t); } catch {} }
  return null;
}
function chromePath() {
  return [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => p && existsSync(p));
}

/** Why the browser tests cannot run here, or null if they can. */
export function unavailable() {
  if (!loadPlaywright()) return 'Playwright not found (npm i -g playwright, or set PLAYWRIGHT_PATH)';
  return null;
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };

/** Runs in the page before any app script: seeded random, error capture, audio output tap. */
function initScript() {
  let s = 12345;
  const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  Math.random = rnd; // the app captures R=Math.random at load, so reseeding keeps working
  window.__seed = n => { s = n; };
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} // every load starts like a first visit
  window.__errors = [];
  addEventListener('error', e => window.__errors.push(String(e.error && e.error.stack || e.message)));
  addEventListener('unhandledrejection', e => window.__errors.push('unhandled rejection: ' + String(e.reason && e.reason.stack || e.reason)));
  const C = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (d, ...a) {
    const r = C.call(this, d, ...a);
    try {
      if (d instanceof AudioDestinationNode && !(this.context instanceof OfflineAudioContext)) {
        const c = this.context;
        if (!c.__tap) { c.__tap = c.createAnalyser(); c.__tap.fftSize = 2048; }
        window.__ctx = c; C.call(this, c.__tap);
      }
    } catch (e) {}
    return r;
  };
}

/** Open the app (debug: the error-reporting build debug.html — build it first with --debug). Returns { page, errors, close }. errors collects page errors + console errors. */
export async function openApp({ headless = true, debug = false } = {}) {
  const pw = loadPlaywright();
  if (!pw) throw new Error(unavailable());
  const server = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = join(ROOT, p);
    if (!f.startsWith(ROOT) || !existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); createReadStream(f).pipe(r);
  }).listen(0);
  const port = server.address().port;
  const exe = chromePath();
  const browser = await pw.chromium.launch({ headless, ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.stack || e.message)));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  await page.addInitScript(initScript);
  await page.goto(`http://localhost:${port}/${debug ? 'debug' : 'index'}.html`);
  await page.waitForFunction(() => typeof generate === 'function' && document.querySelector('#mood'));
  return { page, errors, close: async () => { await browser.close(); server.close(); } };
}

/** In-page helpers, installed with page.evaluate(PAGE_HELPERS). */
export const PAGE_HELPERS = () => {
  const r4 = v => typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v;
  const prim = o => { const x = {}; for (const k of Object.keys(o || {}).sort()) { const v = o[k]; if (v == null || ['number', 'string', 'boolean'].includes(typeof v)) x[k] = r4(v); else if (Array.isArray(v) && v.every(e => typeof e !== 'object')) x[k] = v.map(r4); } return x; };
  /** Compact, deterministic digest of everything a Launch decides. */
  window.__digest = () => ({ mood: curMood, G: prim(G), TR: TR.map(T => ({ n: T.n, st: T.st, h: T.h, r: T.r, lv: r4(T.lv), m: !!T.m, pt: (T.pt || []).join(''), p: prim(T.p) })) });
  window.__moods = () => [...document.querySelector('#mood').options].map(o => o.value).filter(v => v !== 'Auto');
  /** Measure the live output for ms: peak, rms, NaN count; plus scheduler timing (late notes, step spacing). */
  window.__listen = async ms => {
    const c = window.__ctx, a = c.__tap, buf = new Float32Array(a.fftSize);
    let pk = 0, ss = 0, n = 0, nan = 0; const lead = [], steps = [];
    const _f = fire, _a = arrStep;
    fire = function (k, w) { lead.push(w - ctx.currentTime); return _f.apply(this, arguments); };
    arrStep = function (w) { steps.push(w); return _a.apply(this, arguments); };
    try {
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        a.getFloatTimeDomainData(buf);
        for (const v of buf) { if (v !== v) nan++; else { const x = Math.abs(v); if (x > pk) pk = x; ss += v * v; n++; } }
        await new Promise(r => setTimeout(r, 30));
      }
    } finally { fire = _f; arrStep = _a; }
    const d = steps.slice(1).map((w, i) => w - steps[i]);
    return { peak: pk, rms: Math.sqrt(ss / Math.max(1, n)), nan, notes: lead.length, late: lead.filter(x => x < 0).length,
      minLead: lead.length ? Math.min(...lead) : null, steps: steps.length, stepMin: d.length ? Math.min(...d) : null, stepMax: d.length ? Math.max(...d) : null, sd: 60 / G.bpm / 4 };
  };
};
