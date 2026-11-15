/* ---- OrbitPlayer v1.0: plays baked Orbitron Sectors (a loop pack from tools/bake.mjs) as game music — almost zero CPU ----
   Why baked: a live Sector needs the whole Orbitron engine. Baked, each Sector is one looping audio buffer, so the
   per-frame cost is the browser copying samples: no synths, no scheduler, no timers. Everything here runs only when you
   call it (or once per frame in update(), if you want beat/bar callbacks).

   Quick start
     const music = new OrbitPlayer();                 // or new OrbitPlayer({ context: myCtx, output: myMusicBus })
     await music.load('music/my-set.pack/pack.json');
     music.play('kepira');                            // a Sector by id, name or slot number
     music.play('vexlon', { when: 'bar', fade: 2 });  // switch on the next bar line with a 2 s crossfade
     music.filter(600, 3);                            // close a low-pass over 3 s (underwater, dream, "other layer")
     music.warp(0.85, 4);                             // slow down + pitch down over 4 s (tape-stop feel); warp(1) = normal
     music.layer('drums', 0, 2);                      // with stems: fade the drums out over 2 s
     music.stop({ fade: 3 });

   Sync game events to the music (no timers: call update() from your game loop)
     music.on('beat', c => pulse()); music.on('bar', c => { if (c.bar % 4 === 0) spawnShadow(); });
     function frame() { music.update(); ...; requestAnimationFrame(frame) }
     music.nextTime('bar')                             // AudioContext time of the next bar: schedule an SFX exactly on it
     music.clock()                                     // { id, bpm, bar, beat, beatInBar, phase, loop, playing }
   ---- */
(function (root) {
  'use strict';
  const STEMS = ['drums', 'bass', 'music'];
  const SAFE = 0.0001;                                  // never ramp gains to exactly 0

  class OrbitPlayer {
    /**
     * @param {object} [o]
     * @param {AudioContext} [o.context]  share the game's AudioContext (recommended: one context per page)
     * @param {AudioNode}    [o.output]   where the music goes (default: the context's speakers)
     * @param {number|false} [o.normalize=-14]  even out loops to this loudness (LUFS); false = as baked (~ -9, loud)
     * @param {number}       [o.volume=1]
     * @param {number}       [o.keep=3]   how many Sectors stay decoded in memory (each is ~6 MB per 15 s)
     * @param {boolean}      [o.pauseHidden=true]  suspend the audio while the tab is hidden
     */
    constructor(o = {}) {
      this.ctx = o.context || new (root.AudioContext || root.webkitAudioContext)({ latencyHint: 'playback' }); // big buffer = least CPU wake-ups
      this.norm = o.normalize === undefined ? -14 : o.normalize;
      this.keep = Math.max(1, o.keep || 3);
      this.out = this.ctx.createGain(); this.out.gain.value = o.volume ?? 1;
      this.out.connect(o.output || this.ctx.destination);
      this.lp = null;                                   // the low-pass is only built the first time filter() is used
      this.pack = null; this.base = ''; this.list = []; this.buf = new Map(); this.pend = new Map(); this.use = [];
      this.cur = null; this.old = [];                   // cur = playing voice; old = voices fading out
      this.rate = { t: 0, p: 0, r0: 1, r1: 1, t1: 0 };  // playback-rate ramp (for warp + the clock)
      this.cb = { beat: [], bar: [], loop: [] }; this.last = null;
      this.gainL = { drums: 1, bass: 1, music: 1 };
      if (o.pauseHidden !== false && root.document) document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.ctx.suspend().catch(() => {}); else if (this._unlocked) this.ctx.resume().catch(() => {});
      });
      // browsers start audio only after a tap/click/key: resume on the first one
      const un = () => { this._unlocked = true; this.ctx.resume().catch(() => {}); ['pointerdown', 'keydown', 'touchend'].forEach(e => root.removeEventListener(e, un, true)); };
      if (root.addEventListener) ['pointerdown', 'keydown', 'touchend'].forEach(e => root.addEventListener(e, un, true));
    }

    /** Load a pack.json URL (from tools/bake.mjs), or the parsed pack object itself. preload: true = decode every Sector now, or a list of ids. */
    async load(url, { preload = false } = {}) {
      let p = url;
      if (typeof url === 'string') { const r = await fetch(url); if (!r.ok) throw new Error('OrbitPlayer: cannot load ' + url); p = await r.json();
        this.base = new URL('.', new URL(url, root.location ? root.location.href : undefined)).href; } else this.base = '';
      if (!p || p.kind !== 'loop-pack') throw new Error('OrbitPlayer: not a loop pack (bake the .orbit first: node tools/bake.mjs file.orbit)');
      this.stop({ fade: 0.3 }); this.buf.clear(); this.use = [];
      this.pack = p; this.list = p.sectors;
      const ids = preload === true ? this.list.map(s => s.id) : Array.isArray(preload) ? preload : [];
      await Promise.all(ids.map(id => this._get(this.find(id), false)));
      return this.list;
    }
    /** All Sectors in the pack: [{ id, name, slot, mood, bpm, key, bars, seconds, stems? }] */
    sectors() { return this.list.slice(); }
    /** Find a Sector by id, name or slot number. */
    find(x) {
      const s = typeof x === 'object' && x ? x : this.list.find(s => s.id === x || s.name === x || s.slot === +x);
      if (!s) throw new Error('OrbitPlayer: no Sector "' + x + '"'); return s;
    }
    /** Decode a Sector ahead of time (e.g. while a level loads) so play() is instant. */
    preload(x, { stems = false } = {}) { return this._get(this.find(x), stems); }
    /** Free a Sector's memory (it is decoded again when played). */
    unload(x) { const s = this.find(x); for (const k of [...this.buf.keys()]) if (k.startsWith(s.id + '|')) this.buf.delete(k); }

    /**
     * Play a Sector. If one is already playing, crossfade into it.
     * @param x Sector id, name or slot
     * @param {object} [o]
     * @param {'now'|'beat'|'bar'|'loop'|number} [o.when='bar']  when to switch: now, next beat/bar, end of the loop, or every N bars
     * @param {number}  [o.fade=1.5]    crossfade seconds (0 = hard cut on the beat)
     * @param {boolean} [o.stems]       play the 3 stems (drums/bass/music) so layer() works; default: if the pack has them
     * @param {number}  [o.volume=1]    this Sector's own level
     */
    async play(x, o = {}) {
      const s = this.find(x), stems = (o.stems ?? !!s.stems) && !!s.stems, fade = Math.max(0, o.fade ?? 1.5);
      const tok = this._tok = (this._tok || 0) + 1;
      const set = await this._get(s, stems);
      if (tok !== this._tok) return;                    // a newer play() came in while this one was decoding
      const t = Math.max(this.ctx.currentTime + 0.05, this.cur ? this.nextTime(o.when ?? 'bar') : 0);
      const v = { s, t, stems, g: this.ctx.createGain(), src: [], lg: {} };
      const lvl = (o.volume ?? 1) * (this.norm === false || s.lufs == null ? 1 : Math.min(2, Math.pow(10, (this.norm - s.lufs) / 20)));
      v.lvl = lvl; v.g.connect(this.lp || this.out);
      const r = this._rateAt(t);
      for (const [name, b] of set) {
        const src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true; src.loopStart = 0;
        src.loopEnd = Math.min(b.duration, s.seconds);  // exact loop length from the bake (codecs can add a sample)
        src.playbackRate.value = r; if (this.rate.t1 > t) src.playbackRate.linearRampToValueAtTime(this.rate.r1, this.rate.t1);
        let node = src;
        if (stems) { const lg = this.ctx.createGain(); lg.gain.value = Math.max(SAFE, this.gainL[name] ?? 1); src.connect(lg); node = lg; v.lg[name] = lg; }
        node.connect(v.g); src.start(t); v.src.push(src);
      }
      const prev = this.cur;
      if (prev) { this._fadeOut(prev, t, fade); v.g.gain.setValueAtTime(fade ? SAFE : lvl, t); if (fade) v.g.gain.exponentialRampToValueAtTime(lvl, t + fade); }
      else { v.g.gain.setValueAtTime(SAFE, t); v.g.gain.exponentialRampToValueAtTime(lvl, t + Math.max(0.02, o.fade ?? 0.02)); }
      this.cur = v; this.last = null;
      if (this.ctx.state === 'suspended' && !this.ctx.startRendering) this.ctx.resume().catch(() => {}); // play() from a tap also unlocks audio
      return s;
    }

    /** Stop the music. { when: 'now'|'beat'|'bar'|'loop', fade: seconds } */
    stop({ when = 'now', fade = 1 } = {}) {
      this._tok = (this._tok || 0) + 1; const v = this.cur; if (!v) return;
      this._fadeOut(v, Math.max(this.ctx.currentTime, this.nextTime(when)), Math.max(0.02, fade)); this.cur = null;
    }

    /** Master music volume (0…1+), ramped over `sec`. */
    volume(g, sec = 0.5) { this._ramp(this.out.gain, Math.max(SAFE, g), sec); }

    /** Stem level: layer('drums'|'bass'|'music', 0…1, seconds). Works when the pack was baked with --stems. */
    layer(name, g, sec = 1) {
      if (!STEMS.includes(name)) throw new Error('OrbitPlayer: stems are ' + STEMS.join(', '));
      this.gainL[name] = g; const v = this.cur; if (v && v.lg[name]) this._ramp(v.lg[name].gain, Math.max(SAFE, g), sec);
    }

    /** Low-pass filter: filter(hz, seconds, q). filter(null) opens it fully. */
    filter(hz, sec = 1, q = 0.9) {
      if (!this.lp) {                                   // built on first use: until then the music has no filter cost at all
        if (hz == null) return;
        this.lp = this.ctx.createBiquadFilter(); this.lp.type = 'lowpass'; this.lp.frequency.value = 20000; this.lp.Q.value = q; this.lp.connect(this.out);
        for (const v of [this.cur, ...this.old]) if (v) { v.g.disconnect(); v.g.connect(this.lp); }
      }
      this._ramp(this.lp.frequency, Math.min(20000, Math.max(30, hz ?? 20000)), sec); this._ramp(this.lp.Q, q, sec, true);
    }

    /** Warp the playback speed (and pitch) over `sec`: 0.5 = half speed, an octave down; 1 = normal. The clock follows. */
    warp(r, sec = 1) {
      const now = this.ctx.currentTime, p = this._posAt(now), r0 = this._rateAt(now); r = Math.max(0.05, Math.min(4, r));
      this.rate = { t: now, p, r0, r1: r, t1: now + Math.max(0.001, sec) };
      for (const v of [this.cur, ...this.old]) if (v) for (const src of v.src) {
        const a = src.playbackRate; a.cancelScheduledValues(now); a.setValueAtTime(r0, now); a.linearRampToValueAtTime(r, now + Math.max(0.001, sec));
      }
    }

    /** Where the music is: { id, bpm, bar, beat, beatInBar, phase (0…1 within the beat), loop, playing }. Cheap: pure maths. */
    clock(t = this.ctx.currentTime) {
      const v = this.cur; if (!v || t < v.t) return { id: v ? v.s.id : null, bpm: v ? v.s.bpm : 0, bar: 0, beat: 0, beatInBar: 0, phase: 0, loop: 0, playing: false };
      const s = v.s, spb = 60 / s.bpm, pos = this._posAt(t) - this._posAt(v.t);   // seconds of music played since this Sector started (warp-aware)
      const beats = pos / spb, beat = Math.floor(beats), bpb = s.beatsPerBar || 4;
      return { id: s.id, bpm: s.bpm * this._rateAt(t), bar: Math.floor(beat / bpb), beat, beatInBar: beat % bpb, phase: beats - beat, loop: Math.floor(pos / s.seconds), playing: true };
    }

    /** AudioContext time of the next 'beat' | 'bar' | 'loop' | N bars (or 'now'). Use it to schedule SFX in time. */
    nextTime(when = 'bar') {
      const now = this.ctx.currentTime + 0.03, v = this.cur;
      if (!v || when === 'now') return now;
      if (typeof when === 'number' && when > 9999) return when;  // an absolute AudioContext time
      const s = v.s, spb = 60 / s.bpm, bpb = s.beatsPerBar || 4;
      const unit = when === 'beat' ? spb : when === 'loop' ? s.seconds : typeof when === 'number' ? when * bpb * spb : bpb * spb;
      const played = this._posAt(now) - this._posAt(v.t);
      const target = Math.ceil(Math.max(0, played) / unit - 1e-6) * unit + this._posAt(v.t);
      return this._timeAtPos(target, now);
    }

    /** Subscribe to 'beat' | 'bar' | 'loop'. Fired from update(), so call update() once per game frame. Returns an unsubscribe function. */
    on(ev, fn) { (this.cb[ev] || (this.cb[ev] = [])).push(fn); return () => { this.cb[ev] = this.cb[ev].filter(f => f !== fn); }; }
    /** Call once per frame (only needed for on() callbacks). Also cleans up faded-out voices. */
    update() {
      const now = this.ctx.currentTime;
      if (this.old.length) this.old = this.old.filter(v => { if (now < v.end) return true; v.src.forEach(s => { try { s.stop(); s.disconnect(); } catch (e) {} }); v.g.disconnect(); return false; });
      const c = this.clock(now); if (!c.playing) { this.last = null; return c; }
      const l = this.last; this.last = c;
      if (!l || l.id !== c.id) { this._emit('bar', c); this._emit('beat', c); return c; }
      if (c.beat !== l.beat) { if (c.bar !== l.bar) { if (c.loop !== l.loop) this._emit('loop', c); this._emit('bar', c); } this._emit('beat', c); }
      return c;
    }

    // ---------- internals ----------
    _emit(ev, c) { for (const f of this.cb[ev] || []) { try { f(c); } catch (e) { console.warn('[OrbitPlayer] ' + ev + ' callback', e); } } }
    _ramp(a, v, sec, lin) {
      const now = this.ctx.currentTime; a.cancelScheduledValues(now); a.setValueAtTime(a.value, now);
      if (!sec) a.setValueAtTime(v, now); else if (lin) a.linearRampToValueAtTime(v, now + sec); else a.exponentialRampToValueAtTime(Math.max(SAFE, v), now + sec);
    }
    _fadeOut(v, t, fade) {
      const g = v.g.gain, now = this.ctx.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(Math.max(SAFE, g.value), now); g.setValueAtTime(Math.max(SAFE, g.value), t);
      g.exponentialRampToValueAtTime(SAFE, t + Math.max(0.02, fade)); v.end = t + Math.max(0.02, fade) + 0.05;
      v.src.forEach(s => { try { s.stop(v.end); } catch (e) {} }); this.old.push(v);
    }
    // playback-rate ramp → how far the music has advanced (integral of the rate), so the clock stays true under warp
    _rateAt(t) { const R = this.rate; if (t >= R.t1) return R.r1; if (t <= R.t) return R.r0; return R.r0 + (R.r1 - R.r0) * (t - R.t) / (R.t1 - R.t); }
    _posAt(t) {
      const R = this.rate; if (t <= R.t) return R.p - (R.t - t) * R.r0;
      const tr = Math.min(t, R.t1), ramp = (tr - R.t) * (R.r0 + this._rateAt(tr)) / 2;
      return R.p + ramp + Math.max(0, t - R.t1) * R.r1;
    }
    _timeAtPos(p, from) {                               // inverse of _posAt (Newton steps; exact when the rate is steady)
      let t = from + (p - this._posAt(from)) / Math.max(0.05, this._rateAt(from));
      for (let i = 0; i < 4; i++) t += (p - this._posAt(t)) / Math.max(0.05, this._rateAt(t));
      return Math.max(from, t);
    }
    _files(s, stems) { return stems ? STEMS.map(n => [n, s.stems[n]]) : [['mix', s.file]]; }
    async _get(s, stems) {                              // decode on demand, keep the last few, share in-flight decodes
      const out = [];
      for (const [name, f] of this._files(s, stems)) {
        const key = s.id + '|' + name;
        if (!this.buf.has(key)) {
          if (!this.pend.has(key)) this.pend.set(key, fetch(/^(blob:|data:|https?:)/.test(f) ? f : this.base + f).then(r => { if (!r.ok) throw new Error('OrbitPlayer: missing ' + f); return r.arrayBuffer(); })
            .then(a => new Promise((ok, no) => this.ctx.decodeAudioData(a, ok, no))).finally(() => this.pend.delete(key)));
          this.buf.set(key, await this.pend.get(key));
        }
        out.push([name, this.buf.get(key)]);
      }
      this.use = this.use.filter(id => id !== s.id); this.use.push(s.id);
      while (this.use.length > this.keep) { const id = this.use.shift(); if (!this.cur || this.cur.s.id !== id) this.unload(id); }
      return out;
    }
  }

  root.OrbitPlayer = OrbitPlayer;
  if (typeof module === 'object' && module.exports) module.exports = OrbitPlayer;
})(typeof window !== 'undefined' ? window : globalThis);
