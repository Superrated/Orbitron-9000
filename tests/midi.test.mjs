// Unit tests for the MIDI core (src/js/midi/2440-midi-core.js), run in Node with a fake browser:
// fake localStorage, a fake controller (feed messages in), a fake MIDI output (records what is sent), fake timers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const SRC = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../src/js/midi/2440-midi-core.js'), 'utf8');

function load(store = {}) {
  const sent = [], timers = [];
  const out = { id: 'out1', name: 'Fake Synth', send: (b, ts) => sent.push({ b: b[0], ts }) };
  const inp = { id: 'in1', name: 'Fake Ctrl', onmidimessage: null };
  const access = { inputs: new Map([['in1', inp]]), outputs: new Map([['out1', out]]), onstatechange: null };
  let now = 0;
  const sb = {
    console, JSON, Math, Map, Array, Object, Number, Promise, isFinite,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; } },
    navigator: { requestMIDIAccess: async () => access },
    performance: { now: () => now * 1000 },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout: () => {}
  };
  sb.window = sb;
  vm.createContext(sb); vm.runInContext(SRC, sb);
  const M = sb.OrbMIDI;
  // three pretend controls: a 0..1 value, an on/off, and a hold button
  const V = { cut: 0.5, mute: 0, held: [] };
  const T = {
    cut: { kind: 'range', get: () => V.cut, set: v => { V.cut = v; } },
    mute: { kind: 'toggle', get: () => V.mute, set: v => { V.mute = v; } },
    hold: { kind: 'hold', get: () => 0, set: v => V.held.push(v) }
  };
  M.resolve = id => T[id] || null;
  const run = () => { while (timers.length) timers.shift()(); };   // run pending timers (learn wait, frame flush, save)
  const feed = (...b) => { inp.onmidimessage ? inp.onmidimessage({ data: b }) : M._test.feed(b); };
  const learn = (id, ...msgs) => { let got; M.catchNext(c => { got = c; M.bind(c, id); }); for (const m of msgs) feed(...m); run(); return got; };
  return { M, V, sent, store, feed, run, learn, ctx: { get currentTime() { return now; } }, setNow: t => { now = t; } };
}

test('learn: touch a knob, it moves the control (applied once per frame)', async () => {
  const t = load(); await t.M.start();
  const c = t.learn('cut', [0xB0, 21, 60], [0xB0, 21, 62], [0xB0, 21, 64]);
  assert.equal(c.type, 'knob'); assert.equal(c.label, 'Knob 21');
  assert.equal(t.M.keyFor('cut'), 'Knob 21');
  t.feed(0xB0, 21, 64); t.feed(0xB0, 21, 65); t.feed(0xB0, 21, 66);
  assert.equal(t.V.cut, 0.5, 'not applied yet: waits for the next frame');
  t.run();
  assert.equal(t.V.cut, 66 / 127, 'only the newest value is applied');
});

test('one knob = one thing, one thing = one knob', async () => {
  const t = load(); await t.M.start();
  t.learn('cut', [0xB0, 1, 10]);
  t.learn('mute', [0xB0, 1, 10]);
  assert.deepEqual([...t.M.list().map(m => m.id)], ['mute']);
  t.learn('mute', [0xB0, 2, 10]);
  assert.deepEqual([...t.M.list().map(m => m.label)], ['Knob 2']);
  t.M.unbind('mute'); assert.equal(t.M.list().length, 0);
});

test('tells knobs, endless knobs and buttons apart', () => {
  const g = load().M._test.guess;
  assert.equal(g([10, 11, 12]).type, 'knob');
  assert.equal(g([127, 0]).type, 'button');
  assert.equal(g([1, 1, 1]).enc, 'rel2c');
  assert.equal(g([127, 127, 126]).enc, 'rel2c');
  assert.equal(g([65, 65, 66]).enc, 'rel64');
  assert.equal(g([63, 63, 62]).enc, 'rel64');
});

test('smooth pickup: a knob takes over only when it reaches the value', async () => {
  const t = load(); await t.M.start(); t.V.cut = 0.8;
  t.learn('cut', [0xB0, 7, 0]);
  let hint = 0; t.M.on('pickup', (id, dir) => { hint = dir; });
  t.feed(0xB0, 7, 10); t.run(); assert.equal(t.V.cut, 0.8, 'far away: ignored');
  assert.equal(hint, 1, 'says: turn up');
  t.feed(0xB0, 7, 110); t.run(); assert.equal(t.V.cut, 110 / 127, 'passed the value: taken over');
  t.feed(0xB0, 7, 20); t.run(); assert.equal(t.V.cut, 20 / 127);
  t.V.cut = 0.9;   // moved on screen
  t.feed(0xB0, 7, 25); t.run(); assert.equal(t.V.cut, 0.9, 'moved elsewhere: pick up again');
  t.M.setSoft(false);
  t.feed(0xB0, 7, 30); t.run(); assert.equal(t.V.cut, 30 / 127, 'pickup off: jumps');
});

test('endless knob nudges the value', async () => {
  const t = load(); await t.M.start();
  t.learn('cut', [0xB0, 9, 1], [0xB0, 9, 1], [0xB0, 9, 1]);
  t.feed(0xB0, 9, 1); t.feed(0xB0, 9, 1); t.run();
  assert.ok(Math.abs(t.V.cut - 0.52) < 1e-9, 'two clicks right, added up within one frame');
  t.feed(0xB0, 9, 127); t.run(); assert.ok(Math.abs(t.V.cut - 0.51) < 1e-9);
  for (let i = 0; i < 99; i++) t.feed(0xB0, 9, 10);
  t.run(); assert.equal(t.V.cut, 1, 'stops at the end');
});

test('buttons: on/off, hold (press + release), pads and CC buttons', async () => {
  const t = load(); await t.M.start();
  t.learn('mute', [0x99, 36, 100]);
  t.learn('hold', [0xB0, 50, 127], [0xB0, 50, 0]);
  t.feed(0x99, 36, 100); t.feed(0x89, 36, 0); assert.equal(t.V.mute, 1, 'pad press: on');
  t.feed(0x99, 36, 90); t.feed(0x99, 36, 0); assert.equal(t.V.mute, 0, 'press again: off (velocity 0 = release)');
  t.feed(0xB0, 50, 127); t.feed(0xB0, 50, 0);
  assert.deepEqual([...t.V.held], [1, 0], 'hold: press, then release');
});

test('a control that is not on the page right now is skipped', async () => {
  const t = load(); await t.M.start();
  t.learn('gone', [0xB0, 3, 3]);
  assert.doesNotThrow(() => { t.feed(0xB0, 3, 90); t.run(); });
});

test('ignores clock, pitch bend and other messages', async () => {
  const t = load(); await t.M.start(); let got = null;
  t.M.catchNext(c => { got = c; });
  t.feed(0xF8); t.feed(0xFE); t.feed(0xE0, 0, 64); t.feed(0xD0, 30); t.run();
  assert.equal(got, null);
});

test('saved and back after a reload; broken settings start fresh', async () => {
  const t = load(); await t.M.start();
  t.learn('cut', [0xB0, 21, 5]); t.M.setSoft(false); t.run();
  const r = load(t.store);
  assert.equal(r.M.keyFor('cut'), 'Knob 21'); assert.equal(r.M.soft(), false);
  assert.equal(load({ 'orb-midi': '{nope' }).M.list().length, 0);
});

test('clock out: Start on the downbeat, 24 even pulses per beat, Stop', async () => {
  const t = load(); await t.M.start();
  t.M.clock.attach(t.ctx); t.M.clock.setOutput('out1'); t.M.clock.enable(true);
  t.setNow(10); t.M.clock.start(10.05, 120);
  for (let s = 10; s <= 11.0001; s += 0.025) { t.setNow(s); t.M.clock.pump(); }
  assert.equal(t.sent[0].b, 0xFA); assert.equal(t.sent[0].ts, 10050);
  const p = t.sent.filter(x => x.b === 0xF8);
  assert.equal(p[0].ts, 10050, 'first pulse = beat 1');
  for (let i = 1; i < p.length; i++) assert.ok(Math.abs(p[i].ts - p[i - 1].ts - 1000 / 48) < 1e-6);
  t.M.clock.stop(); assert.equal(t.sent.at(-1).b, 0xFC);
  const n = t.sent.length; t.setNow(12); t.M.clock.pump(); assert.equal(t.sent.length, n, 'nothing after Stop');
});

test('clock: off sends nothing; offset and tempo changes apply', async () => {
  const t = load(); await t.M.start(); t.M.clock.attach(t.ctx); t.M.clock.setOutput('out1');
  t.setNow(1); t.M.clock.start(1, 120); t.M.clock.pump(); t.M.clock.stop();
  assert.equal(t.sent.length, 0, 'Sync off: silent');
  t.M.clock.enable(true); t.M.clock.setOffset(-4);
  t.setNow(2); t.M.clock.start(2, 60);
  assert.equal(t.sent[0].ts, 1996);
  t.M.clock.setTempo(240); t.setNow(2.3); t.M.clock.pump();
  const p = t.sent.filter(x => x.b === 0xF8);
  assert.ok(Math.abs(p.at(-1).ts - p.at(-2).ts - 1000 / 96) < 1e-6);
});

test('an endless knob learned as a normal knob is fixed while you play (and the other way round)', async () => {
  const t = load(); await t.M.start(); t.M.setSoft(false);
  t.learn('cut', [0xB0, 30, 65]);   // turned too slowly: only one value, so it was taken for a normal knob
  assert.equal(t.M.list()[0].type, 'knob');
  t.feed(0xB0, 30, 65); t.feed(0xB0, 30, 65); t.feed(0xB0, 30, 65); t.run();
  assert.equal(t.M.list()[0].type, 'encoder', 'same step value three times: endless knob');
  const v = t.V.cut;
  t.feed(0xB0, 30, 65); t.feed(0xB0, 30, 65); t.run();
  assert.ok(Math.abs(t.V.cut - (v + 0.02)) < 1e-9, 'now each click moves it a little, and it stays there');
  t.feed(0xB0, 30, 63); t.run();
  assert.ok(Math.abs(t.V.cut - (v + 0.01)) < 1e-9, '63 = one step left');
  assert.equal(load(t.store).M.list()[0].type, 'encoder', 'the fix is saved');
  // the other way: a normal knob that was set up as endless
  t.learn('mute', [0xB0, 31, 1], [0xB0, 31, 1], [0xB0, 31, 1]);
  t.feed(0xB0, 31, 40);
  assert.equal(t.M.list().find(m => m.id === 'mute').type, 'knob', 'a value like 40 only comes from a normal knob');
});
