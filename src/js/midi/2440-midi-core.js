/* ---- v0.77: MIDI core (window.OrbMIDI) — knobs, faders and buttons on a MIDI controller move Orbitron's controls; optional MIDI clock out. Small and idle until switched on: no timers of its own, nothing allocated per MIDI message, knob moves applied at most once per screen frame. The app side (what can be controlled, the screens) lives in midi/2450-midi-app ---- */
/*
  OrbMIDI.resolve = id => ({ kind, get, set }) | null    // set by the app: turns a saved id into the live control
     kind: 'range' (get/set 0..1) · 'toggle' (on/off) · 'hold' (set(1) on press, set(0) on release) · 'trigger' (set(1) on press)
  OrbMIDI.start()                       ask the browser for MIDI (Chrome / Edge / Android; not iPhone)
  OrbMIDI.catchNext(c => OrbMIDI.bind(c, id))    the next knob/button you touch now controls id
  OrbMIDI.unbind(id) · clear() · list() · keyFor(id) · on('ports'|'activity'|'map'|'pickup'|'error', fn)
  OrbMIDI.clock.attach(ctx) · start(audioTime, bpm) · stop() · setTempo(bpm) · pump() (call every ≤ 50 ms while playing)
*/
window.OrbMIDI = (function () {
  'use strict';
  const STORE = 'orb-midi';
  const CATCH = 0.03, MOVED = 0.02;              // smooth pickup: "close enough", "was moved on screen"
  const LOOK = 0.1;                              // clock: pulses are booked this far ahead (s)
  const CLK = [0xF8], START = [0xFA], STOP = [0xFC];

  // ---------- events (no objects made when nobody listens) ----------
  const L = {};
  function on(ev, fn) { (L[ev] = L[ev] || []).push(fn); }
  function emit(ev, a, b) { const l = L[ev]; if (l) for (let i = 0; i < l.length; i++) { try { l[i](a, b); } catch (e) { console.warn('[orbitron] midi', ev, e); } } }

  // ---------- saved settings ----------
  const S = { maps: [], soft: true, clock: { on: false, out: '', outName: '', offset: 0 } };
  try {
    const d = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (d && Array.isArray(d.maps)) S.maps = d.maps.filter(m => m && Number.isInteger(m.key) && typeof m.id === 'string');
    if (d && typeof d.soft === 'boolean') S.soft = d.soft;
    if (d && d.clock) Object.assign(S.clock, d.clock);
  } catch (e) { console.warn('[orbitron] midi settings unreadable, starting fresh', e); }
  let saveT = 0;
  function save() { if (!saveT) saveT = setTimeout(() => { saveT = 0; try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }, 100); }

  // ---------- controls: key = number (kind·channel·number), so a message never builds a string ----------
  // kind 0 = CC (knob, fader, or a button that sends CC), 1 = note (pad or key)
  const keyOf = (kind, ch, num) => (kind << 11) | (ch << 7) | num;
  const NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  function label(m) {
    const k = m.key, kind = k >> 11, ch = (k >> 7) & 15, num = k & 127;
    const known = OrbMIDI.names && OrbMIDI.names(k); if (known) return known;   // the app can name a known controller's knobs
    const s = kind ? 'Pad ' + NOTE[num % 12] + (Math.floor(num / 12) - 1) : (m.type === 'button' ? 'Button ' : 'Knob ') + num;
    return ch ? s + ' · ch ' + (ch + 1) : s;
  }
  let byKey = new Map(), byId = new Map();
  function reindex() {
    byKey = new Map(); byId = new Map();
    for (const m of S.maps) { m.r = { caught: false, lastIn: -1, lastSet: -1, down: false, pend: -1, t: null }; byKey.set(m.key, m); byId.set(m.id, m); }
  }
  function changed() { reindex(); save(); emit('map'); }
  reindex();

  /** Make a control (from catchNext) move `id`. One knob = one thing, one thing = one knob. */
  function bind(c, id) {
    const key = keyOf(c.kind === 'note' ? 1 : 0, c.ch, c.num);
    S.maps = S.maps.filter(m => m.key !== key && m.id !== id);
    S.maps.push({ key, id, type: c.type || (c.kind === 'note' ? 'button' : 'knob'), enc: c.enc || 'rel2c' });
    changed();
  }
  function unbind(id) { const n = S.maps.length; S.maps = S.maps.filter(m => m.id !== id); if (S.maps.length !== n) changed(); }
  function clear() { S.maps = []; changed(); }
  function list() { return S.maps.map(m => ({ key: m.key, id: m.id, type: m.type, label: label(m) })); }
  function keyFor(id) { const m = byId.get(id); return m ? label(m) : ''; }

  // ---------- telling knobs, endless knobs and buttons apart (from the values sent while you wiggle it) ----------
  function guess(v) {
    if (v.length && v.every(x => x === 0 || x === 127) && v.includes(127)) return { type: 'button' };
    if (v.length >= 3 && v.some((x, i) => i && x === v[i - 1])) {   // knobs never repeat a value; endless knobs do
      if (v.every(x => (x >= 1 && x <= 15) || x >= 113)) return { type: 'encoder', enc: 'rel2c' };   // 1 / 127
      if (v.every(x => x >= 49 && x <= 79)) return { type: 'encoder', enc: 'rel64' };               // 65 / 63
      if (v.every(x => (x >= 1 && x <= 15) || (x >= 65 && x <= 79))) return { type: 'encoder', enc: 'relsign' };
    }
    return { type: 'knob' };
  }
  const steps = (enc, v) => enc === 'rel64' ? v - 64 : enc === 'relsign' ? (v & 64 ? -(v & 63) : v) : (v < 64 ? v : v - 128);

  let catcher = null;
  /** Wait for the next control you touch; calls back with { kind, ch, num, type, enc, label, id } (id = what it moves now). */
  function catchNext(cb) { cancelCatch(); catcher = { cb, key: -1, vals: [], timer: 0, c: null }; }
  function cancelCatch() { if (catcher) clearTimeout(catcher.timer); catcher = null; }
  function catchMsg(kind, ch, num, val, key) {
    const k = catcher;
    if (k.key >= 0) { if (k.key === key) k.vals.push(val); return; }
    if (kind === 1 && val === 0) return;   // a pad release is not a new control
    k.key = key; k.vals.push(val); k.c = { kind: kind ? 'note' : 'cc', ch, num };
    k.timer = setTimeout(() => {
      if (catcher !== k) return; catcher = null;
      const c = Object.assign(k.c, kind ? { type: 'button' } : guess(k.vals)), m = byKey.get(key);
      c.label = label({ key, type: c.type }); c.id = m ? m.id : null;
      k.cb(c);
    }, kind ? 0 : 500);
  }

  // ---------- incoming MIDI ----------
  function onMessage(e) {
    const d = e.data, st = d[0], type = st & 0xF0;
    if (st >= 0xF0 || (type !== 0xB0 && type !== 0x90 && type !== 0x80)) return;   // clock, sysex, pitch bend…: ignored
    const kind = type === 0xB0 ? 0 : 1, ch = st & 15, num = d[1], val = type === 0x80 ? 0 : d[2], key = keyOf(kind, ch, num);
    if (L.activity) emit('activity', key);
    if (catcher) return catchMsg(kind, ch, num, val, key);
    const m = byKey.get(key); if (!m || !OrbMIDI.resolve) return;
    const t = OrbMIDI.resolve(m.id); if (!t) return;   // that control isn't there right now
    apply(m, t, kind, val);
  }
  function apply(m, t, kind, val) {
    const r = m.r;
    if (m.type === 'button' || t.kind === 'hold' || t.kind === 'trigger') {   // buttons act at once
      const down = kind ? val > 0 : val >= 64;
      if (down === r.down) return; r.down = down;
      if (t.kind === 'hold') t.set(down ? 1 : 0);
      else if (down) t.set(t.kind === 'trigger' ? 1 : (t.get() >= 0.5 ? 0 : 1));
      return;
    }
    if (t.kind === 'toggle') { const on = m.type === 'encoder' ? steps(m.enc, val) > 0 : val >= 64; if (on !== (t.get() >= 0.5)) t.set(on ? 1 : 0); return; }
    const now = r.pend >= 0 ? r.pend : t.get();
    let n;
    if (m.type === 'encoder') n = Math.min(1, Math.max(0, now + steps(m.enc, val) / 100));
    else {
      n = val / 127;
      if (S.soft) {   // smooth pickup: only take over once the knob reaches the current value, so nothing jumps
        if (r.pend < 0 && r.lastSet >= 0 && Math.abs(now - r.lastSet) > MOVED) r.caught = false;   // moved on screen / by Launch
        if (!r.caught) {
          const ok = Math.abs(n - now) <= CATCH || (r.lastIn >= 0 && (r.lastIn - now) * (n - now) <= 0);
          r.lastIn = n;
          if (!ok) { if (L.pickup) emit('pickup', m.id, n < now ? 1 : -1); return; }
          r.caught = true;
        }
        r.lastIn = n;
      }
    }
    queue(r, t, n);
  }
  // knob moves: keep only the newest value per control and apply them together once per frame
  const dirty = []; let flushing = false;
  const later = typeof requestAnimationFrame === 'function' ? fn => (document.hidden ? setTimeout(fn, 16) : requestAnimationFrame(fn)) : fn => setTimeout(fn, 16);
  function queue(r, t, n) {
    if (r.pend < 0) dirty.push(r);
    r.pend = n; r.t = t;
    if (!flushing) { flushing = true; later(flush); }
  }
  function flush() {
    flushing = false;
    for (let i = 0; i < dirty.length; i++) {
      const r = dirty[i], n = r.pend; r.pend = -1;
      try { r.t.set(n); r.lastSet = r.t.get(); } catch (e) { console.warn('[orbitron] midi set', e); }
      r.t = null;
    }
    dirty.length = 0;
  }

  // ---------- ports ----------
  let access = null;
  const supported = () => typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function';
  const ports = m => m ? [...m.values()].map(p => ({ id: p.id, name: p.name })) : [];
  const inputs = () => ports(access && access.inputs), outputs = () => ports(access && access.outputs);
  function listen() { for (const i of access.inputs.values()) i.onmidimessage = onMessage; emit('ports'); }
  async function start() {
    if (access) return true;
    if (!supported()) { emit('error', 'unsupported'); return false; }
    try { access = await navigator.requestMIDIAccess(); } catch (e) { emit('error', 'blocked'); return false; }
    access.onstatechange = listen; listen();
    return true;
  }

  // ---------- MIDI clock out: 24 pulses per beat, booked ahead with exact timestamps; Play = Start (from the top) ----------
  const C = { ctx: null, playing: false, bpm: 120, next: 0, off: null, at: -1e9 };
  function out() { return access ? access.outputs.get(S.clock.out) || [...access.outputs.values()].find(o => o.name === S.clock.outName) || null : null; }
  // audio time -> MIDI time (ms). The gap between the two clocks is smoothed (lowest seen, slowly let go), because the audio
  // clock moves in steps; then the speaker delay and the user's Timing offset are added, so pulses line up with what you hear.
  let base = 0;   // ms to add to an audio time, worked out once per pump
  function sync() {
    const c = C.ctx, now = performance.now();
    if (!c) { base = S.clock.offset; return; }
    if (now - C.at < 10 && C.off !== null) return;   // already worked out a moment ago
    C.at = now;
    const o = now - c.currentTime * 1000;
    C.off = C.off === null ? o : Math.min(o, C.off + 0.05);   // lowest gap seen, allowed to creep up slowly
    base = C.off + (c.outputLatency || c.baseLatency || 0) * 1000 + S.clock.offset;
  }
  const ms = t => Math.max(0, t * 1000 + base);
  const audioNow = () => C.ctx ? C.ctx.currentTime : performance.now() / 1000;
  const clock = {
    attach(ctx) { if (ctx !== C.ctx) { C.ctx = ctx; C.off = null; } },
    start(at, bpm) {
      C.playing = true; if (bpm) C.bpm = bpm;
      const o = S.clock.on && out(); if (!o) return;
      const t = at == null ? audioNow() + 0.02 : at;
      sync(); try { o.send(START, ms(t)); } catch (e) {}
      C.next = t; clock.pump();
    },
    stop() {
      const was = C.playing; C.playing = false;
      const o = was && S.clock.on && out(); if (o) try { o.send(STOP); } catch (e) {}
    },
    setTempo(bpm) { if (bpm >= 20 && bpm <= 300) C.bpm = bpm; },
    pump() {
      if (!C.playing || !S.clock.on) return;
      const o = out(); if (!o) return;
      sync(); const a = audioNow(), end = a + LOOK, dt = 60 / (C.bpm * 24);
      if (C.next < a - 0.05) C.next = a;   // fell far behind (tab was asleep): carry on, no burst
      while (C.next < end) { try { o.send(CLK, ms(C.next)); } catch (e) {} C.next += dt; }
    },
    enable(on) { if (!on) clock.stop(); S.clock.on = !!on; save(); },
    setOutput(id) { const o = access && access.outputs.get(id); S.clock.out = id || ''; S.clock.outName = o ? o.name : ''; save(); },
    setOffset(ms) { S.clock.offset = Math.max(-50, Math.min(50, +ms || 0)); save(); },
    settings: () => Object.assign({}, S.clock)
  };

  const OrbMIDI = {
    resolve: null, names: null, keyOf,
    supported, start, inputs, outputs,
    bind, unbind, clear, list, keyFor, catchNext, cancelCatch,
    soft: () => S.soft, setSoft(on) { S.soft = !!on; save(); reindex(); },
    clock, on,
    _test: { feed: (bytes) => onMessage({ data: bytes }), guess, flush, C }
  };
  return OrbMIDI;
})();
