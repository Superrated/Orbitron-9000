# Orbitron 9000

A generative Euclidean groovebox for live playing on phone and computer, in a single HTML file (Web Audio, no dependencies, no build step).

Ten tracks — kick, hi-hat, clap, perc, snare, lead, pad, bass, dub stab and sub drone — each a Euclidean rhythm. Pick one of twenty moods and press **🚀 Launch** for a complete groove; then shape it on the Drums and Synths tabs and perform it on Flight (risers, breakdowns, punch-ins, mutes, low-pass fader).

## Run it

- Open `index.html` in Chrome, Edge, Firefox or Safari — that's it.
- Or turn on **GitHub Pages** for this repository (Settings → Pages → deploy from `main`, root) and open the published URL on your phone.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The current version (v0.23) |
| `releases/orbitron-9000-v0.23.html` | Copy of v0.23 (follows `index.html` until v0.23 is frozen) |
| `releases/orbitron-9000-v0.22.html` | Frozen copy of v0.22 |
| `releases/orbitron-9000-v0.21.html` | Frozen copy of v0.21 |
| `releases/orbitron-9000-v0.2.html` | Frozen copy of v0.2 |
| `releases/orbitron-9000-v0.1.html` | Frozen copy of v0.1 |

## What's new in v0.23

- Mood refinement pass: fewer cluttered or cheesy launches, clearer identity per mood, per-mood level fixes (buried hats and leads raised)
- Optional tracks drop out per mood (for example no clap in Ethereal, pad rare in Acid, lead rare in Noir); a hook always stays
- Dark stays on one or two chords; Drone is strictly one chord in Phrygian or Minor; Tense plays short repeating motifs
- Dated sounds removed per mood (Brass and PWM pads, Supersaw and Cinematic arp leads where they did not fit)
- Melodic House hook flavour: the bass carries the hook; Distorted Electro sometimes gets one driven, slowly filtered riff

## What's new in v0.22

- Moods renamed to fit the ship: Event Horizon, Lost Signal, Nebula, Countdown, Aurora, First Light, Dark Side, Orbital Hum, Max Q, Low Orbit
- Balance pass across all moods (pads lower), no dated lead sounds from Launch, percussion kits per mood
- Darker harmony and melodies in the dark/techno moods (cinematic minor, Phrygian, hypnotic, suspended)
- Tight low end: kick tuned within 41–60 Hz, short kick and bass, bass always ducks under the kick, rumble low cut, PA stage (30 Hz cut, mono below 110 Hz)
- Contemporary leads (Cinematic arp, Donk, Rave stab), ducked lead echo and note dynamics
- Groove families (electro, two-step, broken techno, halftime, clave perc), drum bus, Fill, cleaner low end

## What's new in v0.21

- New mood **Temporal**: Neapolitan loop techno after Gaetano Parisio (Pummel, Shifting hats and Tribal flavours)
- Pad generation: Chord memory and Vamp styles, room for the lead, register discipline, no repeated progressions, 2–8 chord lengths, phrase endings (sus resolution or tension chord)
- Moods no longer inherit sounds from the previous mood; track menus always show what is playing
- Less cheesy leads (no fast vibrato or parallel fifths, tamer unison, darker FM and chip sounds); mood balance trims
- Fixes: Deep Space effects leaking into other moods, Power chord clash, blank LFO rate menu

## Highlights

- 20 moods, from warehouse, acid, groove and loop techno to melodic house, Floating Points-style modular house (Vector), Italo and beatless ambient
- Lead arp modes including Marbles, Turing loop, Converge/Diverge and Pedal arp, with Cycle, Note repeat and Reset on bar
- Polymeter, Rotate drift and three LFOs (one very slow)
- TB-303-style acid voice, Minimoog-style Mini engine, Marimba perc
- Sectors: 16 groove memories with export/import
- ● Rec: records what you hear to WAV
- Space (auto stereo movement), Master+ (level matching and peak control), per-mood mastering finish
- Phone-friendly: engine sleep when stopped, pause/resume when switching apps, load guard

## License

Copyright (c) 2026 Superrated. Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE.md): free to use, copy, modify and share for noncommercial purposes only.

Designed by Superrated and Claude.
