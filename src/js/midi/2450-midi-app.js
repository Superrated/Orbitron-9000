/* ---- v0.77: MIDI in the app (EXPERIMENTAL, shown in its own colour: magenta) — OFF unless switched on (open Orbitron once with ?midi at the end of the address). Then a MIDI button sits in the top bar: LEARN (tap any slider, any Flight fader or Flight button, Mute/Solo or Play, then move a knob), QUICK SETUP (turn knobs = the six Flight faders, press pads = the planet mutes), two presets for the Arturia MiniLab MkII and SYNC OTHER GEAR (MIDI clock out). Knobs move the same controls your finger does, so nothing new happens to the sound. Left out on purpose: risers and breakdowns (hold + drag), menus and dice buttons ---- */
{
  let on = false;
  try {
    if (/[?&]midi\b/.test(location.search)) localStorage.setItem('orb-midi-on', '1');
    on = localStorage.getItem('orb-midi-on') === '1';
  } catch (e) {}
  if (on && window.OrbMIDI) try { orbMidiApp(); } catch (e) { console.warn('[orbitron] midi app', e); }

  function orbMidiApp() {
    const M = OrbMIDI, $ = s => document.querySelector(s);

    // ---------- what a knob can move ----------
    // Flight faders: their own code moves them (and redraws them).
    const FL = {
      'f:lp':    { name: 'FILTER', sel: '.lpa', get: () => LOWPASS.pos(), set: v => LOWPASS.setPos(v) },
      'f:thin':  { name: 'THIN', sel: '.tha', get: () => THIN.m > 0 ? .5 + .5 * THIN.m : .5 - .5 * THIN.v, set: v => thinPos(v) },
      'f:lead':  { name: 'LEAD', sel: '.lmx:not(.lpa)', get: () => (leadMacro.x + 1) / 2, set: v => leadMacro.set(v * 2 - 1) },
      'f:bass':  { name: 'BASS', sel: '.bmx:not(.tha)', get: () => (bassMacro.x + 1) / 2, set: v => bassMacro.set(v * 2 - 1) },
      'f:drums': { name: 'DRUMS', sel: '.drm', get: () => (orbFlightDrums.x + 1) / 2, set: v => orbFlightDrums.set(v * 2 - 1) },
      'f:fx':    { name: 'FX', sel: '.fxm', get: () => (orbFlightFx.x + 1) / 2, set: v => orbFlightFx.set(v * 2 - 1) }
    };
    for (const id in FL) FL[id].kind = 'range';
    const flightOf = el => { for (const id of ['f:lp', 'f:thin', 'f:drums', 'f:fx', 'f:lead', 'f:bass']) if (el.closest(FL[id].sel)) return id; return null; };

    // Sliders and buttons: found on the page by where they are and what they're called (pages get rebuilt, ids stay the same).
    const SEC = { 't-drums': 'Drums', 't-synth': 'Synths', 't-mix': 'Mix', 't-lfo': 'LFO', 't-perf': 'Flight', 't-gen': 'Launch' };
    const where = el => {
      const s = el.closest('section.tp'), c = el.closest('.card'), p = el.closest('.panel');
      return (s ? s.id : 'top') + '|' + (c ? c.dataset.k : p && p.querySelector('h2') ? p.querySelector('h2').textContent.trim() : '');
    };
    const sliderName = i => {
      const cs = i.closest('.cs');   // a mixer channel strip: "Kick level", "Kick pan"
      if (cs) { const h = cs.querySelector('h3'), sp = i.parentElement.querySelector('span'), w = sp ? sp.textContent.trim() : ''; return (h ? h.textContent.trim() : '') + ' ' + (/^lvl$/i.test(w) ? 'level' : w.toLowerCase()); }
      const sl = i.closest('.sl'), sp = sl && sl.querySelector('span');
      const t = sp && sp.firstChild ? sp.firstChild.textContent : sl && sl.firstChild ? sl.firstChild.textContent : '';
      return t.trim() || i.id || 'slider';
    };
    const buttonName = b => {
      if (b.closest('.card .hd')) return b.classList.contains('solo') ? 'Solo' : 'Mute';
      if (b.id) return b.id;
      return (b.firstChild && b.firstChild.textContent || b.textContent).replace(/[○●]|\(.*?\)/g, '').trim();
    };
    const canButton = b => !b.closest('.rz') && (b.matches('#t-perf .pad') || b.matches('.card .hd button') || b.id === 'play');
    let els = new Map(), ids = new WeakMap(), scanned = 0;
    function scan() {   // only when learning, or when a saved control can't be found (at most once a second)
      els = new Map(); ids = new WeakMap(); scanned = performance.now();
      const seen = {};
      const add = (el, base) => { const n = seen[base] = (seen[base] || 0) + 1, id = base + '|' + (n - 1); els.set(id, el); ids.set(el, id); };
      for (const i of document.querySelectorAll('input[type=range]')) if (!i.closest('#midiPanel')) add(i, 's:' + where(i) + '|' + sliderName(i));
      for (const b of document.querySelectorAll('button')) if (canButton(b)) add(b, 'b:' + where(b) + '|' + buttonName(b));
    }
    function element(id) {
      let el = els.get(id);
      if ((!el || !el.isConnected) && performance.now() - scanned > 1000) { scan(); el = els.get(id); }
      return el && el.isConnected ? el : null;
    }
    const INPUT = new Event('input', { bubbles: true });
    const press = (el, type) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, isPrimary: true, pointerId: 1, button: 0 }));
    const live = new Map();   // id -> target object (made once, reused for every message)
    M.resolve = id => {
      if (FL[id]) return FL[id];
      const el = element(id); if (!el) return null;
      let t = live.get(id);
      if (!t) {
        t = id[0] === 's'
          ? { kind: 'range', el: null,
              get() { const i = this.el; return (i.value - i.min) / ((i.max - i.min) || 1); },
              set(n) { const i = this.el; i.value = +i.min + n * (i.max - i.min); i.dispatchEvent(INPUT); } }
          : { kind: 'hold', el: null,   // a press and release, exactly like a finger: holds hold, toggles toggle
              get: () => 0,
              set(v) { const b = this.el; if (v) press(b, 'pointerdown'); else { press(b, 'pointerup'); b.click(); } } };
        live.set(id, t);
      }
      t.el = el; return t;
    };
    function nameOf(id) {
      if (FL[id]) return 'Flight · ' + FL[id].name;
      const parts = id.slice(2).split('|'), sec = parts[0], ctx = parts[1], name = parts.slice(2, -1).join('|');
      const card = /^\d+$/.test(ctx) && document.querySelector('.card[data-k="' + ctx + '"] .hd span');
      const what = card ? card.textContent.trim() : ctx;
      return [SEC[sec] || (sec === 'top' ? '' : sec), what, name === 'bpm' ? 'Tempo' : name === 'play' ? 'Play' : name].filter(Boolean).join(' · ');
    }

    // ---------- presets for the Arturia MiniLab MkII (factory settings, memory 1) ----------
    // Knobs send CC on channel 1: knob 1–8 top row, 9–16 bottom row. Knobs 1 and 9 are endless (61–63 left, 65–67 right).
    // Pads 1–8 send notes 36–43 on channel 10. Mod strip = CC 1. (Checked against Ardour's MiniLab mkII map and the manual.)
    const ML_CC = [112, 74, 71, 76, 77, 93, 73, 75, 114, 18, 19, 16, 17, 91, 79, 72];
    const knob = (n, find) => ({ c: { kind: 'cc', ch: 0, num: ML_CC[n - 1], type: n === 1 || n === 9 ? 'encoder' : 'knob', enc: 'rel64' }, find });
    const pad = (n, find) => ({ c: { kind: 'note', ch: 9, num: 35 + n, type: 'button' }, find });
    const strip = find => ({ c: { kind: 'cc', ch: 0, num: 1, type: 'knob' }, find });
    const slider = (sel, name) => () => [...document.querySelectorAll(sel + ' input[type=range]')].find(i => sliderName(i) === name);
    const top = name => () => [...document.querySelectorAll('input[type=range]')].find(i => !i.closest('section.tp') && sliderName(i) === name);
    const level = name => slider('#t-mix', name + ' level');
    const first = b => (b.firstChild && b.firstChild.textContent || '').trim();
    const planet = name => () => [...document.querySelectorAll('#pads .pad')].find(b => first(b) === name);
    const thruster = name => () => [...document.querySelectorAll('#t-perf .pad')].find(b => !b.closest('.rz, #pads') && first(b) === name);
    const KNOBS = [   // same knobs in both presets: Flight faders on top, mixer levels below
      knob(1, top('Tempo')), knob(2, 'f:lp'), knob(3, 'f:thin'), knob(4, 'f:lead'), knob(5, 'f:bass'), knob(6, 'f:drums'), knob(7, 'f:fx'), knob(8, top('Swing')),
      knob(9, slider('#t-mix', 'Reverb mix')), knob(10, level('Kick')), knob(11, level('Snare')), knob(12, level('Hi-hat')), knob(13, level('Clap')),
      knob(14, level('Bass')), knob(15, level('Lead')), knob(16, level('Pad')), strip(slider('#t-mix', 'Delay mix'))
    ];
    const PRESETS = {
      mutes: { name: 'Perform + mutes', items: [...KNOBS, ...['Kick', 'Hi-hat', 'Clap', 'Snare', 'Bass', 'Lead', 'Pad', 'Stab'].map((n, i) => pad(i + 1, planet(n)))] },
      thrust: { name: 'Perform + thrusters', items: [...KNOBS, ...['Snare roll', '+1 octave', 'Drift', 'Break!', 'Fill', 'Hat push', 'Ride push', 'Lift'].map((n, i) => pad(i + 1, thruster(n)))] }
    };
    // when a MiniLab MkII is plugged in, call its controls by the names printed on it
    const ML_NAMES = new Map();
    ML_CC.forEach((cc, i) => ML_NAMES.set(M.keyOf(0, 0, cc), 'Knob ' + (i + 1)));
    for (let i = 0; i < 8; i++) ML_NAMES.set(M.keyOf(1, 9, 36 + i), 'Pad ' + (i + 1));
    ML_NAMES.set(M.keyOf(0, 0, 1), 'Mod strip');
    M.on('ports', () => { M.names = M.inputs().some(i => /minilab\s*mk\s*ii/i.test(i.name)) ? k => ML_NAMES.get(k) : null; });
    function loadPreset(key) {
      scan(); M.clear();
      let ok = 0;
      for (const it of PRESETS[key].items) {
        const id = typeof it.find === 'string' ? it.find : (el => el && ids.get(el))(it.find());
        if (id) { M.bind(it.c, id); ok++; }
      }
      return ok;
    }

    // ---------- the MIDI button and panel ----------
    const css = document.createElement('style');
    // MIDI mode has its own colour (magenta) so it is never mistaken for the yellow/green controls or the violet LFOs.
    // Everything else comes from the app's own styles: panels, buttons, menus, fonts, the current theme.
    css.textContent = `
:root{--midi:#ff4fd8}
#midiBtn{flex:0 0 auto;color:var(--midi);border-color:var(--midi)}
#midiBtn.on{background:var(--midi);color:var(--bg)}
#midiPanel{position:fixed;left:50%;top:56px;transform:translateX(-50%);width:min(94vw,420px);max-height:70vh;overflow:auto;z-index:50;border-color:var(--midi)!important;box-shadow:0 10px 40px rgba(0,0,0,.6);display:flex;flex-direction:column;gap:6px}
#midiPanel[hidden],#midiBar[hidden]{display:none}
#midiPanel h2{color:var(--midi);display:flex;align-items:center;gap:8px;margin:0}
#midiPanel h2 .x{margin-left:auto;flex:0 0 auto}
.midiExp{font-size:9px;letter-spacing:.12em;border:1px solid var(--midi);padding:1px 5px;color:var(--midi)}
#midiPanel .dim{color:var(--muted);font-size:12px}
#midiPanel button{flex:0 0 auto}
#midiPanel .go{background:var(--midi)!important;color:var(--bg)!important;border-color:var(--midi);padding:12px;font-size:12px;font-weight:700}
#midiPanel .row{display:flex;gap:6px;align-items:center;justify-content:space-between}
#midiPanel .row>button{flex:1}
#midiPanel button.on{color:var(--midi);border-color:var(--midi);box-shadow:inset 0 0 10px rgba(255,79,216,.3)}
#midiPanel .mp{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:4px 6px;border:1px solid rgba(255,79,216,.3);font-size:12px}
#midiPanel .mp b{color:var(--midi);font-weight:400}
#midiPanel input[type=range]{accent-color:var(--midi)}
#midiBar{position:fixed;left:4px;right:4px;bottom:4px;z-index:50;border-color:var(--midi)!important;display:flex;gap:8px;align-items:center;font-size:13px}
#midiBar span{flex:1}#midiBar b{color:var(--midi);font-weight:400}
#midiBar button{flex:0 0 auto}#midiBar .go{background:var(--midi)!important;color:var(--bg)!important;border-color:var(--midi)}
#midiFrame{position:fixed;inset:0;border:2px solid var(--midi);pointer-events:none;z-index:49;box-shadow:inset 0 0 18px rgba(255,79,216,.35)}#midiFrame[hidden]{display:none}
body.midiL input[type=range]{pointer-events:none}
.midiCan{outline:1px dashed rgba(255,79,216,.7)!important;outline-offset:1px}
.midiMap{outline:2px solid var(--midi)!important;outline-offset:1px}
.midiArm{outline:3px solid var(--midi)!important;outline-offset:1px;animation:midiBl .8s infinite}
@keyframes midiBl{50%{outline-color:transparent}}`;
    document.head.appendChild(css);
    const btn = document.createElement('button');
    btn.id = 'midiBtn'; btn.type = 'button'; btn.textContent = 'MIDI'; btn.title = 'MIDI controller (experimental)';
    const play = $('#play'); (play && play.parentElement ? play.parentElement : document.body).appendChild(btn);
    const panel = document.createElement('div'); panel.id = 'midiPanel'; panel.className = 'panel'; panel.hidden = true; document.body.appendChild(panel);
    const frame = document.createElement('div'); frame.id = 'midiFrame'; frame.hidden = true; document.body.appendChild(frame);   // magenta edge = MIDI mode is on
    const bar = document.createElement('div'); bar.id = 'midiBar'; bar.className = 'panel'; bar.hidden = true; document.body.appendChild(bar);
    btn.onclick = () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) { panel.style.top = Math.max(8, btn.getBoundingClientRect().bottom + 6) + 'px'; M.start(); draw(); }   // open just below the button, never over it
    };

    let status = 'Looking for a controller…';
    M.on('ports', () => { const i = M.inputs(); status = i.length ? '● ' + i.map(p => p.name).join(', ') : 'Plug in a MIDI controller'; if (!panel.hidden) draw(); });
    M.on('error', r => { status = r === 'unsupported' ? 'MIDI needs Chrome or Edge (computer) or Chrome (Android). Not iPhone/iPad.' : 'MIDI was blocked: allow it in the browser\'s site settings.'; if (!panel.hidden) draw(); });
    M.on('map', () => { if (!panel.hidden) draw(); if (learning) mark(); });
    M.start();   // MIDI is switched on, so connect straight away

    function draw() {
      const maps = M.list(), c = M.clock.settings(), outs = M.outputs();
      panel.innerHTML = `<h2>MIDI controller <span class="midiExp">EXPERIMENTAL</span><button class="x" data-a="close">✕</button></h2>
        <div class="dim">MIDI mode is experimental: it may change, and some controls can't be paired yet.</div>
        <div class="dim">${status}</div>
        <button class="go" data-a="learn">Learn · tap a control, turn a knob</button>
        <button data-a="quick">Quick setup</button>
        <h2 style="margin-top:6px">Presets · Arturia MiniLab MkII</h2>
        <div class="row"><button data-a="pre" data-p="mutes">Perform + mutes</button><button data-a="pre" data-p="thrust">Perform + thrusters</button></div>
        <div class="dim">Factory settings. Top row: Tempo · Filter · Thin · Lead · Bass · Drums · FX · Swing. Bottom row: Reverb · levels of Kick, Snare, Hi-hat, Clap, Bass, Lead, Pad. Mod strip: Delay. Pads: planet mutes or thrusters.</div>
        <h2 style="margin-top:6px">Your knobs · ${maps.length}</h2>
        ${maps.map(m => `<div class="mp"><span><b>${m.label}</b> → ${nameOf(m.id)}</span><button class="x" data-a="del" data-id="${encodeURIComponent(m.id)}">✕</button></div>`).join('') || '<div class="dim">None yet.</div>'}
        <div class="row"><button data-a="soft" class="${M.soft() ? 'on' : ''}">Smooth pickup ${M.soft() ? '✓' : '✗'}</button><button data-a="clk" class="${c.on ? 'on' : ''}">Sync other gear ${c.on ? '✓' : '✗'}</button></div>
        ${c.on ? `<div class="row"><span class="dim">Send clock to</span><select data-a="out">${outs.map(o => `<option value="${o.id}" ${o.id === c.out || o.name === c.outName ? 'selected' : ''}>${o.name}</option>`).join('') || '<option>No MIDI outputs</option>'}</select></div>
        <div class="row"><span class="dim">Timing ${c.offset} ms</span><input type="range" min="-50" max="50" value="${c.offset}" data-a="off"></div>` : ''}
        <div class="row"><button data-a="clear">Remove all knobs</button><button data-a="off-all">Turn MIDI off</button></div>`;
      if (c.on && outs.length && !outs.some(o => o.id === c.out || o.name === c.outName)) M.clock.setOutput(outs[0].id);
    }
    panel.addEventListener('click', e => {
      const a = e.target.dataset.a;
      if (a === 'close') panel.hidden = true;
      if (a === 'soft') { M.setSoft(!M.soft()); draw(); }
      if (a === 'clk') { M.clock.enable(!M.clock.settings().on); draw(); }
      if (a === 'learn') { panel.hidden = true; learn(true); }
      if (a === 'quick') { panel.hidden = true; quick(); }
      if (a === 'pre') {
        const k = e.target.dataset.p;
        if (M.list().length && !confirm('Replace your knobs with "' + PRESETS[k].name + '"?')) return;
        const n = loadPreset(k);
        status = '✓ ' + PRESETS[k].name + ' loaded: ' + n + ' controls'; draw();
      }
      if (a === 'del') M.unbind(decodeURIComponent(e.target.dataset.id));
      if (a === 'clear' && confirm('Remove all knobs?')) M.clear();
      if (a === 'off-all' && confirm('Turn MIDI off? (Open Orbitron with ?midi to turn it back on.)')) { try { localStorage.setItem('orb-midi-on', '0'); } catch (_) {} location.reload(); }
    });
    panel.addEventListener('change', e => {
      const a = e.target.dataset.a;
      if (a === 'out') M.clock.setOutput(e.target.value);
      if (a === 'off') { M.clock.setOffset(+e.target.value); draw(); }
    });

    // ---------- learn: tap a control, then move a knob ----------
    let learning = false, armed = null;
    function controlAt(target) {   // which mappable control was tapped (null = let the tap through, e.g. tabs)
      const f = flightOf(target); if (f) return { id: f, el: target.closest(FL[f].sel) };
      const row = target.closest('.sr, .sl, .spr, label'), inp = target.matches('input[type=range]') ? target : row && row.querySelector('input[type=range]');
      if (inp && !inp.closest('#midiPanel')) { scan(); return { id: ids.get(inp), el: inp }; }
      const b = target.closest('button'); if (b && canButton(b)) { scan(); return { id: ids.get(b), el: b }; }
      return null;
    }
    function mark() {   // dashed = can be learned, green = has a knob, orange = waiting for a knob
      for (const e of document.querySelectorAll('.midiCan,.midiMap,.midiArm')) e.classList.remove('midiCan', 'midiMap', 'midiArm');
      if (!learning) return;
      scan();
      const mapped = new Set(M.list().map(m => m.id));
      const tag = (id, el) => el && el.classList.add(armed && armed.id === id ? 'midiArm' : mapped.has(id) ? 'midiMap' : 'midiCan');
      for (const [id, el] of els) tag(id, el.matches('input') ? el.closest('.sl') || el : el);
      for (const id in FL) tag(id, $(FL[id].sel));
    }
    function say(html, buttons) { bar.hidden = false; bar.innerHTML = '<span><b>MIDI</b> <span class="midiExp">EXPERIMENTAL</span> ' + html + '</span>' + buttons.replace(/data-a="(done)"/g, 'class="go" data-a="$1"'); }
    function learnBar() {
      if (!armed) return say('<b>Learn:</b> tap a slider, Flight fader or button.', '<button data-a="done">Done</button>');
      const k = M.keyFor(armed.id);
      say(`Move a knob for <b>${nameOf(armed.id)}</b>${k ? ` (now ${k})` : ''}`, (k ? '<button data-a="unmap">Remove</button>' : '') + '<button data-a="done">Done</button>');
    }
    function stopTap(e) {
      if (bar.contains(e.target) || panel.contains(e.target) || e.target === btn) return;
      const c = controlAt(e.target); if (!c || !c.id) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (e.type !== 'pointerdown') return;
      armed = c; mark(); learnBar();
      M.catchNext(k => { const id = armed && armed.id; if (!id) return; M.bind(k, id); say(`✓ <b>${nameOf(id)}</b> → ${k.label}. Tap the next control.`, '<button data-a="done">Done</button>'); armed = null; mark(); });
    }
    function learn(onoff) {
      learning = onoff; armed = null; M.cancelCatch();
      document.body.classList.toggle('midiL', onoff); btn.classList.toggle('on', onoff); frame.hidden = !onoff;
      for (const t of ['pointerdown', 'click', 'mousedown', 'touchstart']) (onoff ? document.addEventListener : document.removeEventListener).call(document, t, stopTap, { capture: true, passive: false });
      if (onoff) learnBar(); else bar.hidden = true;
      mark();
    }
    bar.addEventListener('click', e => {
      const a = e.target.dataset.a;
      if (a === 'done') { learn(false); quickStop(); }
      if (a === 'unmap' && armed) { M.unbind(armed.id); armed = null; M.cancelCatch(); learnBar(); }
      if (a === 'skip') quickNext(true);
    });

    // ---------- quick setup: knobs -> the six Flight faders, pads -> the planet mutes ----------
    let steps = null, at = 0;
    function quick() {
      scan();
      const pads = [...document.querySelectorAll('#pads .pad')].map(p => ids.get(p)).filter(Boolean);
      steps = [...Object.keys(FL).map(id => ({ id, knob: true })), ...pads.map(id => ({ id, knob: false }))];
      at = 0; quickNext(false);
    }
    function quickStop() { steps = null; M.cancelCatch(); }
    function quickNext(skip) {
      if (!steps) return;
      if (skip) at++;
      if (at >= steps.length) { quickStop(); say('✓ Quick setup done. Your knobs move the Flight faders, your pads mute tracks (hold = solo).', '<button data-a="done">OK</button>'); return; }
      const s = steps[at];
      say(`Quick setup ${at + 1}/${steps.length}: ${s.knob ? 'turn the knob' : 'press the pad'} for <b>${nameOf(s.id).replace('Flight · ', '')}</b>`, '<button data-a="skip">Skip</button><button data-a="done">Stop</button>');
      M.catchNext(k => {
        if (!steps) return;
        if (s.knob && k.type === 'button') return quickNext(false);   // that was a button: wait for a knob
        M.bind(k, s.id); at++; quickNext(false);
      });
    }

    // ---------- clock out follows Play / Stop and the tempo (only while Sync is on) ----------
    let pumpT = 0;
    const _toggle = toggle;
    toggle = function () {
      const r = _toggle.apply(this, arguments);
      try {
        clearInterval(pumpT); pumpT = 0;
        if (playing && M.clock.settings().on) {
          M.clock.attach(ctx); M.clock.start(nextT, G.bpm);
          pumpT = setInterval(() => { M.clock.setTempo(G.bpm); M.clock.pump(); }, 25);
        } else M.clock.stop();
      } catch (e) { console.warn('[orbitron] midi clock', e); }
      return r;
    };
  }
}
