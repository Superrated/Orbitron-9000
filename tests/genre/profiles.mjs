// Reference profiles: what a REAL track in each mood's subgenre looks like, written down as numbers.
// The test suite compares every random Launch against the profile of its mood.
//
// Where the numbers come from (checked Nov 2026):
//   · Tempo: genre BPM tables from Mixgraph (catalog medians), Ableton/Splice/iZotope via digitaldjpool.com, beatkitchen.io.
//   · Loudness (LUFS): Mixgraph's measured medians per Beatport-style genre ("middle half" = 25th–75th percentile of real releases).
//     A Launch is one loop of the main groove, so it is allowed to sit a little louder than a full track (whose intro/breakdown pull the average down).
//   · Patterns, layers, tonal balance, stereo: standard production conventions for each style (four-on-the-floor, backbeat,
//     mono low end, number of melodic layers…). These are rules of thumb, so their ranges are kept wide.
//
// Units: bpm · swing = G.swing (0 straight … 0.25 heavy) · hits = per bar of 16 steps · lufs = integrated LUFS · plr = peak-to-loudness (dB)
//        tilt = octave-band slope 63 Hz–8 kHz in dB/octave · bassWeight = 20–250 Hz vs 250 Hz–6 kHz (dB) · air = 6–20 kHz vs everything (dB)

// --- shared building blocks -------------------------------------------------------------------------------
const CLUB_MIX = { plr: [5, 13], tilt: [-4.5, -0.8], bassWeight: [2, 16], air: [-32, -11], lowSide: -12, corr: 0.1, width: [-28, -3], barSwing: 3 };
const SOFT_MIX = { plr: [6, 18], tilt: [-5.5, -0.3], bassWeight: [-6, 14], air: [-36, -10], lowSide: -9, corr: 0.0, width: [-30, -2], barSwing: 4 };
const FOUR = 'four';      // kick on all four beats (3 of 4 tolerated as a variation)
const BROKEN = 'broken';  // kick must NOT be a plain four-on-the-floor (breakbeat / electro / D&B)
const ANY = 'any';

// lufs: [low, high] of real releases' middle half (Mixgraph), before the allowance in rules.mjs
const L = {
  hardTechno: [-8.2, -6.2], techPeak: [-9.9, -7.6], techRaw: [-9.3, -8.0], dnb: [-7.9, -5.2], breaks: [-9.9, -7.3],
  house: [-10.4, -8.3], deep: [-10.9, -9.3], prog: [-10.5, -9.2], organic: [-10.9, -9.4], indie: [-10.8, -8.5],
  mht: [-11.5, -9.2], electronica: [-11.2, -8.6], minimal: [-11.4, -9.4],
};

// melodic = lead, pad, stab, satellite playing at once · tracks = all unmuted tracks that have hits
// kickBass = most share of bass hits allowed on kick steps (rolling bass avoids the kick)
const P = {
  'Dark':              { genre: 'Dark techno',               bpm: [126, 138], swing: [0, .12], kick: FOUR,   backbeat: false, lufs: L.techRaw,     mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [2, 14], bass: true,  kickBass: .5, scale: 'dark' },
  'Melancholic':       { genre: 'Deep house',                bpm: [116, 125], swing: [0, .22], kick: FOUR,   backbeat: true,  lufs: L.deep,        mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [2, 14], bass: true,  kickBass: .7, scale: 'any' },
  'Dreamy':            { genre: 'Progressive house',         bpm: [118, 128], swing: [0, .2],  kick: FOUR,   backbeat: true,  lufs: L.prog,        mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [2, 14], bass: true,  kickBass: .7, scale: 'any' },
  'Tense':             { genre: 'Peak-time techno',          bpm: [128, 140], swing: [0, .08], kick: FOUR,   backbeat: false, lufs: L.techPeak,    mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [3, 16], bass: true,  kickBass: .5, scale: 'dark' },
  'Ethereal':          { genre: 'Organic house / downtempo', bpm: [98, 120],  swing: [0, .22], kick: ANY,    backbeat: false, lufs: L.organic,     mix: SOFT_MIX, melodic: [1, 3], tracks: [3, 9], hat: [0, 14], bass: false, kickBass: .8, scale: 'any' },
  'Hopeful':           { genre: 'Uplifting progressive',     bpm: [122, 132], swing: [0, .2],  kick: FOUR,   backbeat: true,  lufs: L.prog,        mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [2, 14], bass: true,  kickBass: .7, scale: 'bright' },
  'Noir':              { genre: 'Indie dance / dark disco',  bpm: [115, 126], swing: [0, .2],  kick: FOUR,   backbeat: true,  lufs: L.indie,       mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [2, 14], bass: true,  kickBass: .7, scale: 'dark' },
  'Drone':             { genre: 'Hypnotic / dub techno',     bpm: [118, 132], swing: [0, .12], kick: FOUR,   backbeat: false, lufs: L.techRaw,     mix: CLUB_MIX, melodic: [1, 2], tracks: [4, 8], hat: [2, 14], bass: true,  kickBass: .6, scale: 'any' },
  'Acid':              { genre: 'Acid techno',               bpm: [125, 140], swing: [0, .1],  kick: FOUR,   backbeat: false, lufs: L.techPeak,    mix: CLUB_MIX, melodic: [1, 2], tracks: [4, 8], hat: [2, 16], bass: false, kickBass: .6, scale: 'dark' },
  'Power':             { genre: 'Hard techno',               bpm: [138, 160], swing: [0, .06], kick: FOUR,   backbeat: false, lufs: L.hardTechno,  mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [3, 16], bass: true,  kickBass: .5, scale: 'dark' },
  'Italo':             { genre: 'Italo disco',               bpm: [110, 128], swing: [0, .12], kick: FOUR,   backbeat: true,  lufs: L.indie,       mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [3, 16], bass: true,  kickBass: .7, scale: 'any' },
  'Breaks':            { genre: 'Jungle / drum & bass',      bpm: [160, 178], swing: [0, .18], kick: BROKEN, backbeat: true,  lufs: L.dnb,         mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [3, 16], bass: true,  kickBass: .8, scale: 'any' },
  'Bleep':             { genre: 'Bleep techno',              bpm: [120, 135], swing: [0, .25], kick: FOUR,   backbeat: false, lufs: L.techRaw,     mix: CLUB_MIX, melodic: [1, 2], tracks: [4, 8], hat: [2, 14], bass: true,  kickBass: .6, scale: 'any' },
  'Distorted Electro': { genre: 'Electro',                   bpm: [120, 135], swing: [0, .08], kick: BROKEN, backbeat: true,  lufs: L.breaks,      mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [3, 16], bass: true,  kickBass: .8, scale: 'dark' },
  'Ambient':           { genre: 'Ambient techno / house',    bpm: [95, 120],  swing: [0, .22], kick: ANY,    backbeat: false, lufs: L.electronica, mix: SOFT_MIX, melodic: [1, 4], tracks: [3, 8], hat: [0, 12], bass: false, kickBass: .8, scale: 'any' },
  'Groove Techno':     { genre: 'Groove / hypnotic techno',  bpm: [130, 142], swing: [0, .25], kick: FOUR,   backbeat: false, lufs: L.techPeak,    mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [3, 16], bass: true,  kickBass: .5, scale: 'any' },
  'Vector':            { genre: 'Melodic house & techno',    bpm: [120, 130], swing: [0, .25], kick: FOUR,   backbeat: false, lufs: L.mht,         mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [2, 14], bass: true,  kickBass: .6, scale: 'any' },
  'Temporal':          { genre: 'Peak-time / hypnotic techno', bpm: [130, 145], swing: [0, .25], kick: FOUR, backbeat: false, lufs: L.techPeak,    mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [3, 16], bass: true,  kickBass: .5, scale: 'any' },
  'Polymeter':         { genre: 'Minimal / polymetric techno', bpm: [124, 134], swing: [0, .12], kick: FOUR, backbeat: false, lufs: L.minimal,     mix: CLUB_MIX, melodic: [1, 2], tracks: [5, 8], hat: [2, 14], bass: true,  kickBass: .5, scale: 'any' },
  'Chug':              { genre: 'Chug / slow dark disco',    bpm: [96, 112],  swing: [0, .12], kick: FOUR,   backbeat: true,  lufs: L.indie,       mix: CLUB_MIX, melodic: [1, 3], tracks: [5, 9], hat: [2, 14], bass: true,  kickBass: .7, scale: 'dark' },
};

// scale "brightness": dark moods should sit in a minor-type scale, bright ones in a major-type scale
export const SCALES = {
  dark: ['Minor', 'Phrygian', 'Harm. minor', 'Hijaz', 'Double harmonic', 'Min pentatonic', 'In', 'Hirajoshi', 'Locrian', 'Dorian', 'Pelog'],
  bright: ['Major', 'Lydian', 'Mixolydian', 'Major pentatonic', 'Sus pentatonic', 'Dorian', 'Whole tone'],
};

export const PROFILES = P;
export const DEFAULT_PROFILE = { genre: 'Generic electronic', bpm: [90, 180], swing: [0, .3], kick: ANY, backbeat: false, lufs: [-12, -6], mix: SOFT_MIX, melodic: [0, 4], tracks: [3, 10], hat: [0, 16], bass: false, kickBass: 1, scale: 'any' };
