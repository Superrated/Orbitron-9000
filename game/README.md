# Orbitron music in a game

Play your Orbitron Sectors (`.orbit` export) as the music of a browser game, at almost no CPU cost.

```
my-set.orbit ──► node tools/bake.mjs my-set.orbit ──► my-set.pack/ (pack.json + one loop per Sector) ──► game/orbit-player.js in your game
```

**Why two steps?** A `.orbit` file isn't audio. It's the full settings of each Sector, and playing it live needs the whole Orbitron engine (~1 MB of code, dozens of synths and effects running all the time). A game only needs the *sound*, so each Sector is rendered once by the real engine into a seamless loop (**bake**). The game then just loops audio buffers: about 0.06 % of one CPU core for a full mix (measured: 1,500× faster than real time).

## 1. Bake
Export your Sectors in Orbitron (Launch tab → Sectors → ⇪ Export), then:
```
node tools/bake.mjs my-set.orbit               # every Sector → seamless 8-bar loop (Ogg Opus, ~300 KB each)
node tools/bake.mjs my-set.orbit --stems       # + drums / bass / music stems per Sector, to fade layers in the game
node tools/bake.mjs my-set.orbit --bars 16     # longer loops = less audible repetition
node tools/bake.mjs my-set.orbit --format wav  # or m4a (AAC) for old Safari versions
node tools/bake.mjs my-set.orbit --only 2,5    # just slots 2 and 5
```
Needs Node 18+, Playwright with Chrome (the same setup as the browser tests) and ffmpeg (not needed for `--format wav`). Each Sector takes about 5 s (about 20 s with stems).

The loop is cut after 2 warm-up bars, so reverb and delay tails from the previous cycle are already in it, and its last 30 ms crossfade into what came just before the loop start. That makes the seam click-free. Sectors with slowly evolving parts (drift, LFOs, breaks) still loop; the change just resets at the seam, so pick `--bars 16` if you hear that.

## 2. Play
Copy `orbit-player.js` and the `.pack` folder into your game:
```html
<script src="orbit-player.js"></script>
<script>
  const music = new OrbitPlayer();                    // or { context: gameAudioCtx, output: musicBus }
  await music.load('audio/my-set.pack/pack.json');
  music.play('kepira');                               // id, name or slot number (see music.sectors())
</script>
```

| call | what it does |
|---|---|
| `play(x, { when, fade, stems, volume })` | start or crossfade to a Sector. `when`: `'now'`, `'beat'`, `'bar'` (default), `'loop'`, or a number of bars (4 = on the next 4-bar line) |
| `stop({ when, fade })` | fade out |
| `layer('drums'\|'bass'\|'music', 0…1, sec)` | stem levels (pack baked with `--stems`) |
| `filter(hz, sec)` / `filter(null)` | low-pass sweep, e.g. underwater or another reality layer. The filter only exists once you first use it |
| `warp(rate, sec)` | speed and pitch together (0.5 = half speed, an octave down). The beat clock follows |
| `volume(g, sec)` | music level |
| `clock()` | `{ id, bpm, bar, beat, beatInBar, phase, loop, playing }`, pure maths, call it anytime |
| `nextTime('beat'\|'bar'\|'loop'\|n)` | AudioContext time of the next beat or bar: schedule an SFX exactly on the beat |
| `on('beat'\|'bar'\|'loop', fn)` + `update()` | callbacks, fired from your game loop (call `update()` once per frame); no timers of its own |
| `preload(x)` / `unload(x)` | decode ahead of a level change / free memory (it keeps the last 3 Sectors by default: `{ keep: n }`) |

Options: `new OrbitPlayer({ context, output, volume, normalize: -14, keep: 3, pauseHidden: true })`. Loops are evened out to -14 LUFS by default (baked loops are about -9 LUFS, loud like the app), so switching Sectors doesn't jump in level and there's room for sound effects. Use `normalize: false` for the raw level.

Try it: `game/demo.html` (open a pack folder, or `demo.html?pack=path/to/pack.json`).

**Formats:** Ogg Opus plays in Chrome, Edge, Firefox and Android, and in Safari 18.4 and later. For older iPhones and Macs, bake with `--format m4a`.
