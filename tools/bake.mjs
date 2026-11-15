#!/usr/bin/env node
// BAKE — turn a .orbit file (exported Sectors) into a game-ready loop pack for game/orbit-player.js.
//
//   node tools/bake.mjs my-set.orbit                    every Sector → seamless 8-bar loop (Ogg Opus) in my-set.pack/
//   node tools/bake.mjs my-set.orbit --bars 16          longer loops (less audible repetition, bigger files)
//   node tools/bake.mjs my-set.orbit --stems            also 3 stems per Sector (drums · bass · music) to fade layers in the game
//   node tools/bake.mjs my-set.orbit --format wav       wav (biggest, no codec) · ogg (default, small) · m4a (AAC, for old Safari)
//   node tools/bake.mjs my-set.orbit --only 1,3 --out sfx/music   only slots 1 and 3, into another folder
//
// Why bake: playing a Sector live needs the whole Orbitron engine (~1 MB of code, dozens of synth voices and effects per bar).
// A game only needs the SOUND, so each Sector is rendered once with the real engine — in headless Chrome, with an
// OfflineAudioContext, faster than real time — and the game plays the result back as a looping buffer (almost zero CPU).
//
// Seamless loops: the Sector plays WARM bars first (so reverb/delay tails and the level keeper have settled), then the
// loop bars are cut out. Their start already contains the tails of the bars before it, and the last 30 ms are crossfaded
// into the audio just before the loop start, so the seam is click-free.
// Needs Playwright + Chrome (same as the browser tests) and, for ogg/m4a, ffmpeg.
import { createRequire } from 'node:module';
import { execSync, execFileSync } from 'node:child_process';
import http from 'node:http';
import { existsSync, createReadStream, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, extname, basename, resolve } from 'node:path';
import { ROOT } from '../tests/harness.mjs';

const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i < 0 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const FILE = argv.find(a => !a.startsWith('--') && /\.orbit(\.json)?$|\.json$/i.test(a));
if (!FILE) { console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter(l => l.startsWith('//')).slice(0, 8).map(l => l.slice(3)).join('\n')); process.exit(2); }
const BARS = Math.max(1, +arg('--bars', 8)), WARM = Math.max(1, +arg('--warm', 2)), STEMS = argv.includes('--stems');
const FMT = String(arg('--format', 'ogg')), SR = 48000, XF = .03;
const ONLY = arg('--only', null) ? String(arg('--only')).split(',').map(n => +n - 1) : null;
const OUT = resolve(String(arg('--out', FILE.replace(/(\.orbit)?(\.json)?$/i, '') + '.pack')));
const STEMSET = { drums: [0, 1, 2, 3, 7], bass: [6], music: [4, 5, 8, 9] };
if (FMT !== 'wav') { try { execSync('ffmpeg -version', { stdio: 'ignore' }); } catch { console.error('ffmpeg not found: install it, or use --format wav'); process.exit(2); } }

const bank = JSON.parse(readFileSync(FILE, 'utf8'));
if (!bank || bank.app !== 'orbitron-9000' || !Array.isArray(bank.slots)) { console.error('Not an Orbitron .orbit file'); process.exit(2); }
const jobs = bank.slots.map((s, i) => ({ s, i })).filter(j => j.s && j.s.G && j.s.TR && (!ONLY || ONLY.includes(j.i)));
if (!jobs.length) { console.error('No Sectors to bake'); process.exit(2); }

// ---------- browser + server (same setup as tests/genre/run.mjs) ----------
const require = createRequire(import.meta.url);
const pw = (() => { const t = [process.env.PLAYWRIGHT_PATH, 'playwright', 'playwright-core']; try { const g = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); t.push(join(g, 'playwright'), join(g, 'playwright-core')); } catch {}
  for (const x of t.filter(Boolean)) { try { return require(x); } catch {} } return null; })();
if (!pw) { console.error('Playwright not found: npm i -g playwright (and a Chrome/Chromium)'); process.exit(2); }
const exe = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(p => p && existsSync(p));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); createReadStream(f).pipe(r); }).listen(0);
const URL0 = `http://localhost:${server.address().port}/index.html`;

/** Runs before the app: seeded random, clean storage, and the app's first AudioContext becomes an OfflineAudioContext. */
function initScript() {
  let s = 1; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  window.__errors = []; addEventListener('error', e => window.__errors.push(String(e.error && e.error.stack || e.message)));
  const OAC = OfflineAudioContext, RealAC = window.AudioContext; window.__SEC = 10;
  const Fake = function (opts) { if (window.__oc) return new RealAC(opts);
    const oc = new OAC(2, Math.ceil(48000 * window.__SEC), 48000);
    oc.__res = oc.resume.bind(oc); oc.resume = () => Promise.resolve(); oc.suspend = () => Promise.resolve();
    oc.close = () => Promise.resolve(); oc.baseLatency = 0; oc.outputLatency = 0; oc.getOutputTimestamp = () => ({ contextTime: oc.currentTime, performanceTime: performance.now() });
    window.__oc = oc; return oc; };
  Fake.prototype = RealAC.prototype; window.AudioContext = window.webkitAudioContext = Fake;
  Object.defineProperty(OAC, Symbol.hasInstance, { value: o => o != null && o !== window.__oc && Object.getPrototypeOf(o) === OAC.prototype });
}

/** One render in a fresh page: load the Sector, play it offline, return the loop as 16-bit stereo + its loudness. */
async function render(page, S, warm, bars, keep) {
  await page.goto(URL0);
  await page.waitForFunction(() => typeof generate === 'function' && window.SECTORS && document.querySelector('#mood'));
  return page.evaluate(async ({ S, warm, bars, keep, XF }) => {
    const bpm0 = +S.G.bpm || 120; window.__SEC = (warm + bars) * 240 / bpm0 + XF + .6;   // the offline engine's length: set BEFORE the tap, which builds the engine
    const L = SECTORS.list(); L[0] = S; SECTORS.state.prot = 0; SECTORS.tap(0);          // load the Sector exactly as a tap on its slot does
    if (keep) TR.forEach((T, k) => { if (!keep.includes(k)) T.m = true; });             // stems: mute everything outside this stem
    if (window.QOS && !QOS.__pinned) { QOS.__pinned = 1; Object.defineProperty(QOS, 'lvl', { configurable: true, get: () => 0, set() {} }); } // render like a strong device: no voice shedding
    const barS = 240 / G.bpm; if (Math.abs(G.bpm - bpm0) > .01) throw new Error('tempo changed while loading the Sector');
    toggle();                                                                             // ▶ Play → init() builds the engine on the offline context
    const oc = window.__oc; if (!oc) throw new Error('engine did not start');
    try { applyFX(); } catch (e) {} try { window.moodFinish && moodFinish.apply(); } catch (e) {} try { window.orbHeadroom && orbHeadroom.start && orbHeadroom.start(); } catch (e) {}   // what the tap would do a moment later, done now so the render starts complete
    const OS = OfflineAudioContext.prototype.suspend, end = oc.length / oc.sampleRate - .02;
    for (let t = .05; t < end; t += .05) OS.call(oc, +t.toFixed(4)).then(() => { try { if (ctx === oc) tick(); } catch (e) { __errors.push('tick: ' + e); } oc.__res(); });
    try { tick(); } catch (e) {}
    const buf = await oc.startRendering();
    const sr = buf.sampleRate, a = Math.round(warm * barS * sr), n = Math.round(bars * barS * sr), x = Math.round(XF * sr);
    const out = new Int16Array(n * 2); let pk = 0, z = 0, nan = 0;
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c);
      // K-weighting (BS.1770) for a plain loudness number the player can use to even out loops
      let a1 = 0, a2 = 0, b1 = 0, b2 = 0, c1 = 0, c2 = 0, d1 = 0, d2 = 0;
      for (let i = 0; i < n; i++) { let v = d[a + i];
        if (i >= n - x) { const f = (i - (n - x) + .5) / x; v = v * Math.cos(f * Math.PI / 2) + d[a - (n - i)] * Math.sin(f * Math.PI / 2); } // equal-power seam crossfade into the pre-roll
        if (!(v === v && v !== undefined)) { v = 0; nan++; } if (Math.abs(v) > pk) pk = Math.abs(v);
        out[i * 2 + c] = Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
        const s1 = 1.53512485958697 * v - 2.69169618940638 * a1 + 1.19839281085285 * a2 + 1.69065929318241 * b1 - .73248077421585 * b2; a2 = a1; a1 = v; b2 = b1; b1 = s1;
        const s2 = s1 - 2 * c1 + c2 + 1.99004745483398 * d1 - .99007225036621 * d2; c2 = c1; c1 = s1; d2 = d1; d1 = s2; z += s2 * s2; } }
    let bin = ''; const u8 = new Uint8Array(out.buffer); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { pcm: btoa(bin), sr, frames: n, bpm: G.bpm, root: G.root, scale: G.scale, mood: curMood, peak: 20 * Math.log10(pk + 1e-9), lufs: -0.691 + 10 * Math.log10(z / n + 1e-12), nan, errors: [...__errors] };
  }, { S, warm, bars, keep, XF });
}

const wav = (pcm, sr) => { const d = Buffer.from(pcm, 'base64'), h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + d.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(d.length, 40); return Buffer.concat([h, d]); };
function save(r, name) {
  const w = wav(r.pcm, r.sr);
  if (FMT === 'wav') { writeFileSync(join(OUT, name + '.wav'), w); return name + '.wav'; }
  const tmp = join(OUT, '.tmp-' + name + '.wav'); writeFileSync(tmp, w);
  const f = name + '.' + FMT, args = FMT === 'm4a' ? ['-c:a', 'aac', '-b:a', '160k'] : ['-c:a', 'libopus', '-b:a', '128k'];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, ...args, join(OUT, f)]); rmSync(tmp); return f;
}
const NN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const slug = t => String(t || 'sector').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sector';

// ---------- run ----------
mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ headless: true, ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage(); await page.addInitScript(initScript);
const pack = { app: 'orbitron-9000', kind: 'loop-pack', v: 1, source: basename(FILE), made: new Date().toISOString(), format: FMT, bars: BARS, sectors: [] };
const used = new Set(); let bad = 0;
console.log(`Baking ${jobs.length} Sector${jobs.length > 1 ? 's' : ''} from ${basename(FILE)} · ${BARS} bars · ${FMT}${STEMS ? ' · + stems' : ''} → ${OUT}`);
for (const { s, i } of jobs) {
  let id = slug(s.nm); while (used.has(id)) id += '-' + (i + 1); used.add(id);
  const t0 = Date.now(), r = await render(page, s, WARM, BARS, null);
  const e = { id, name: s.nm || 'Sector ' + (i + 1), slot: i + 1, mood: r.mood, bpm: r.bpm, key: NN[((r.root % 12) + 12) % 12] + ' ' + r.scale, bars: BARS, beatsPerBar: 4,
    seconds: +(r.frames / r.sr).toFixed(4), lufs: +r.lufs.toFixed(1), peakDb: +r.peak.toFixed(1), file: save(r, id) };
  if (r.nan || r.errors.length) { bad++; console.warn(`  ! ${e.name}: ${r.nan ? r.nan + ' broken samples ' : ''}${r.errors.slice(0, 2).join(' | ')}`); }
  if (STEMS) { e.stems = {}; for (const [st, keep] of Object.entries(STEMSET)) { const q = await render(page, s, WARM, BARS, keep); e.stems[st] = save(q, id + '.' + st); } }
  pack.sectors.push(e);
  console.log(`  ✓ ${String(i + 1).padStart(2)} ${e.name.padEnd(14)} ${e.mood.padEnd(16)} ${String(e.bpm).padStart(5)} BPM  ${e.key.padEnd(14)} ${e.seconds.toFixed(1)} s  ${e.lufs} LUFS  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
writeFileSync(join(OUT, 'pack.json'), JSON.stringify(pack, null, 1));
await browser.close(); server.close();
console.log(`Done: ${join(OUT, 'pack.json')}  — load it in the game with  OrbitPlayer.load('${basename(OUT)}/pack.json')`);
process.exitCode = bad ? 1 : 0;
