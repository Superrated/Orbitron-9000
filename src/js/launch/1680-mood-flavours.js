
/* ---- v0.24: MOOD FLAVOURS — every mood has 5 flavours (v0.78; it was 2–3), each a neighbouring style of the mood. A Launch picks one; the flavour sets tempo range,
   drum kit, lead sound and pattern style, pad, perc and a bass figure of its own (so basslines stop sounding generic).
   Moods that already had flavours keep them and gain the new sounds. Moods with built-in flavours (Trajectory, Time Dilation, Ion Storm,
   Afterglow) keep those and take one from this table by chance, so that they have five in all. Tidal Lock and Red Giant have five here. Afterwards two clean-up rules run on every Launch:
   · no plain, unfiltered oscillators: simple leads get a closed-down filter with an envelope (and sines a touch of fold)
   · no cheesy note runs: straight 16th up/down arps only in the flavours that are built on them (Twin arps, Hi-NRG, Cascade) ---- */
{const RI=(a,b)=>a+Math.floor(R()*(b-a+1));
 const FL={
  Dark:[{n:'Raw loop',bpm:[132,136],kit:'Raw',lead:{p:['Hard sync','Techno stab','Metal FM'],m:['Motif'],len:[2,3],h:[3,5],mute:.2},pad:{p:['Sync sweep'],mute:.6},bass:{s:['Rolling 16ths','Gallop'],n:['Root','Root + fifth'],ch:'gritty'},perc:{mute:.3}},
   {n:'Industrial',bpm:[128,133],kit:'Raw',lead:{p:['Metal FM','Hollow BP','Hard sync'],m:['Interval','Motif'],len:[2,4],h:[2,4],mute:.4},pad:{p:['Abyss'],mute:.5},bass:{s:['Syncopated','Off-beat'],n:['Root'],ch:'gritty'}},
   {n:'Hypnotic loop',bpm:[124,128],kit:'Rumble',lead:{p:['Hollow BP','Mini lead','Reese'],m:['Turing loop'],len:[5,7],h:[4,6],mute:.3},pad:{p:['Abyss'],mute:.3},bass:{s:['Pedal','Off-beat'],n:['Pedal','Root'],ch:'deep'},drift:1},
   {n:'Warehouse stab',bpm:[130,134],kit:'909',lead:{p:['Rave stab','Hypno stab','Techno stab'],m:['Motif'],len:[2,3],h:[3,4],mute:.15},pad:{mute:.8},bass:{s:['Rolling techno','Off-beat'],n:['Root'],ch:'gritty'},perc:{pv:'Ride',ch:.4}},
   {n:'Dub cavern',bpm:[122,126],kit:'Rumble',lead:{p:['Mist','Weird drone','Hollow BP'],m:['Turing loop','Interval'],len:[4,6],h:[2,3],mute:.4},pad:{p:['Wind','Abyss'],mute:.1},bass:{s:['Dub sub','Pedal'],n:['Root'],ch:'deep'},drift:1}],
  Tense:[{n:'Loop techno',bpm:[134,138],kit:'909',lead:{p:['Hard sync','Mini edge','Techno stab'],m:['Motif'],len:[2,3],h:[4,6]},pad:{mute:.9},bass:{s:['Rolling 16ths','Syncopated'],n:['Root'],ch:'rubbery'}},
   {n:'Wash techno',bpm:[130,134],kit:'Rumble',lead:{p:['Hollow BP','Metal FM'],m:['Interval'],len:[3,4],h:[2,4],mute:.3},pad:{p:['Sync sweep'],mute:.2},bass:{s:['Off-beat','Gallop'],n:['Root','Root + fifth'],ch:'deep'}},
   {n:'Siren run',bpm:[136,140],kit:'Raw',lead:{p:['Hoover','Rave stab','Aggro'],m:['Interval','Motif'],len:[2,3],h:[3,5]},pad:{mute:.9},bass:{s:['Gallop','Rolling 16ths'],n:['Root'],ch:'gritty'}},
   {n:'Clockwork',bpm:[132,136],kit:'909',lead:{p:['Rubber blip','Bleep','Square chip'],m:['Turing loop'],len:[5,7],h:[5,7]},pad:{mute:.8},bass:{s:['Syncopated','Rolling techno'],n:['Root'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.4},drift:1},
   {n:'Low pressure',bpm:[128,132],kit:'Rumble',lead:{p:['Reese','Mini drone','Hollow BP'],m:['Motif'],len:[2,4],h:[2,3],mute:.3},pad:{p:['Abyss','Sync sweep'],mute:.3},bass:{s:['Pedal','Off-beat'],n:['Pedal','Root'],ch:'deep'}}],
  Power:[{n:'Hard drive',kit:'Rumble',pad:{mute:.8},bass:{s:['Rolling 16ths'],ch:'gritty'}},{n:'Dark grind',kit:'Raw',pad:{p:['Sync sweep','Abyss'],mute:.3},bass:{s:['Gallop','Off-beat'],ch:'deep'}},
   {n:'Steel press',kit:'909',pad:{mute:.9},bass:{s:['Rolling techno'],ch:'gritty'},perc:{pv:'Ride',ch:.5}},
   {n:'Afterburner',kit:'Raw',pad:{p:['Sync sweep'],mute:.5},bass:{s:['Octave bounce','Gallop'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.35}},
   {n:'Heavy orbit',kit:'Rumble',pad:{p:['Abyss','Wind'],mute:.2},bass:{s:['Pedal','Off-beat'],n:['Root'],ch:'deep'}}],
  Drone:[{n:'Deep drone',kit:'Rumble',lead:{m:['Turing loop'],h:[3,5],mute:.4},pad:{p:['Wind','Abyss'],mute:0},bass:{held:.6,ch:'deep'}},
   {n:'Fog loop',bpm:[118,124],kit:'Rumble',lead:{mute:.8},pad:{p:['Wind'],mute:0},bass:{held:.8,ch:'round'},perc:{mute:.7}},
   {n:'Tidal hum',bpm:[114,120],kit:'808',lead:{p:['Mist','Soft sine'],m:['Interval'],h:[2,3],mute:.5},pad:{p:['Tape','Choir'],mute:0},bass:{held:.7,ch:'round'}},
   {n:'Machine room',bpm:[122,128],kit:'Raw',lead:{p:['Weird drone','Metal FM'],m:['Turing loop'],h:[3,4],mute:.4},pad:{p:['Sync sweep','Abyss'],mute:0},bass:{s:['Pedal'],n:['Pedal'],ch:'gritty'},perc:{pv:'Ride',ch:.3}},
   {n:'Long wave',kit:'Rumble',lead:{mute:.7},pad:{p:['Cloud','Wind','Air'],mute:0},bass:{s:['Slow pulse','Dub sub'],ch:'deep'},perc:{mute:.5}}],
  'Groove Techno':[{n:'Minimal groove',kit:'909',lead:{p:['Techno stab','Hard sync'],m:['Motif'],len:[2,3],h:[2,4],mute:.3},pad:{mute:.8},bass:{s:['Off-beat','Syncopated'],n:['Root'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.35}},
   {n:'Tool groove',kit:'909',lead:{mute:.6},bass:{s:['Rolling 16ths','Gallop'],ch:'deep'},perc:{pv:'Conga',ch:.4}},
   {n:'Tribal tool',kit:'909',lead:{mute:.7},bass:{s:['Syncopated','Bouncy'],ch:'rubbery'},perc:{pv:'Conga',ch:.8}},
   {n:'Organ loop',kit:'909',lead:{p:['Organ stab','Hypno stab','EP stab'],m:['Motif'],len:[2,3],h:[3,4]},pad:{mute:.8},bass:{s:['Off-beat','Octave bounce'],n:['Root'],ch:'round'}},
   {n:'Deep roller',kit:'Rumble',lead:{p:['Hollow BP','Rubber blip'],m:['Turing loop'],len:[4,6],h:[3,5],mute:.4},pad:{p:['Abyss'],mute:.5},bass:{s:['Rolling techno','Rolling 16ths'],ch:'deep'},drift:1}],
  Temporal:()=>{const r=R();return r<.2?{n:'Dub chord techno',kit:'Rumble',lead:{mute:1},pad:{p:['EP chords','Organ'],mute:0},bass:{s:['Pedal','Off-beat'],ch:'deep'}}
   :r<.4?{n:'Organ jack',kit:'909',lead:{p:['Organ stab','Techno stab'],m:['Motif'],len:[2,2],h:[3,4]},pad:{mute:1},bass:{s:['Off-beat','Syncopated'],n:['Root'],ch:'rubbery'}}:null},   /* else Pummel, Shifting hats or Tribal as built */
  Acid:[{n:'Raw acid',bpm:[124,128],kit:'808',pad:{mute:.8}},{n:'Rolling acid',bpm:[136,142],kit:'909',pad:{mute:.7}},
   {n:'Deep acid',bpm:[120,124],kit:'808',pad:{p:['Abyss','Wind'],mute:.2},perc:{pv:'Conga',ch:.4}},
   {n:'Acid trance',bpm:[132,136],kit:'909',pad:{p:['Strings','Poly'],mute:.3}},
   {n:'Warehouse acid',bpm:[128,132],kit:'Raw',pad:{mute:.9},perc:{pv:'Ride',ch:.5}}],
  'Distorted Electro':()=>{const r=R();return r<.2?{n:'Robot funk',kit:'808',lead:{p:['Talkbox','Vowel','Square chip'],m:['Motif'],len:[3,4],h:[3,5]},bass:{s:['Syncopated','Bouncy'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.5}}
   :r<.4?{n:'Static charge',kit:'Raw',lead:{p:['Metal FM','Aggro','Hard sync'],m:['Interval'],h:[2,4],mute:.2},pad:{mute:.8},bass:{s:['Gallop','Rolling 16ths'],ch:'gritty'}}
   :r<.6?{n:'Dark electro',kit:'Raw',lead:{p:['Hard sync','Aggro','Techno stab']},pad:{p:['Sync sweep'],mute:.2}}:null},   /* else Broken or Techno as built */
  Melancholic:[{n:'Dark arp',bpm:[120,124],kit:'909',lead:{p:['Formant wave','Mini lead','Hollow BP'],m:['Motif','Turing loop'],len:[4,6],h:[4,6]},pad:{p:['Abyss','Strings'],mute:.2},bass:{s:['Syncopated','Pedal'],n:['Melodic','Root + fifth'],ch:'round'}},
   {n:'Melancholic synth',bpm:[118,122],kit:'808',lead:{p:['Chorus pulse','Glass'],m:['Interval','Motif'],len:[3,4],h:[3,5]},pad:{p:['EP chords','Tape'],mute:.1},bass:{held:.4,s:['Off-beat'],n:['Chord tones'],ch:'deep'}},
   {n:'Night drive',bpm:[116,120],kit:'808',lead:{p:['Wide saw','Chorus pulse','Mini lead'],m:['Motif'],len:[4,8],h:[4,6]},pad:{p:['Poly','Strings'],mute:.1},bass:{s:['Octave 8ths','Rolling 16ths'],n:['Root'],ch:'round'}},
   {n:'Piano rain',bpm:[118,122],kit:'808',lead:{p:['House piano','Soft keys','EP stab'],m:['Motif','Interval'],len:[3,4],h:[3,4]},pad:{p:['Tape','Strings'],mute:.1},bass:{s:['Held, syncopated','Syncopated'],n:['Melodic'],ch:'round'}},
   {n:'Cold wave',bpm:[122,126],kit:'909',lead:{p:['Square chip','Hollow BP','Glass'],m:['Turing loop','Motif'],len:[4,6],h:[4,6]},pad:{p:['PWM','Choir'],mute:.3},bass:{s:['Octave bounce','Off-beat'],n:['Root + fifth'],ch:'rubbery'}}],
  'Melodic House':()=>{const r=R();return r<.2?{n:'Sunrise keys',lead:{p:['House piano','Sunny keys']},pad:{p:['Strings','Poly'],mute:0}}
   :r<.4?{n:'Deep organ',kit:'808',lead:{p:['Organ stab','Soft keys']},pad:{p:['EP chords'],mute:0},bass:{s:['Off-beat','Bouncy'],ch:'round'}}
   :r<.6?{n:'Deep arp',kit:'808',lead:{p:['String pluck','FM keys'],m:['Motif'],len:[3,4],h:[3,5]},pad:{p:['EP chords'],mute:0},bass:{s:['Walking','Syncopated'],n:['Melodic'],ch:'round'},perc:{pv:'Conga',ch:.6}}
   :G.mhFlav==='cinematic'?{n:'Melodic hook',lead:R()<.5?{p:['Formant wave']}:null}:{n:'Hook house',lead:R()<.5?{p:['String pluck']}:null}},
  Noir:[{n:'Trip-hop dub',bpm:[118,122],kit:'808',lead:{mute:.7},pad:{p:['EP chords','Abyss'],mute:0},bass:{s:['Pedal','Syncopated'],n:['Root'],ch:'deep'}},
   {n:'Rain garage',bpm:[124,128],kit:'Rumble',lead:{p:['Formant wave','Mist'],m:['Turing loop'],h:[2,4],mute:.4},pad:{p:['Wind','Abyss'],mute:0},bass:{s:['Off-beat'],ch:'deep',held:.3}},
   {n:'Smoky keys',bpm:[112,118],kit:'808',lead:{p:['Soft keys','EP stab','FM keys'],m:['Motif','Interval'],len:[3,4],h:[2,4],mute:.2},pad:{p:['Tape','EP chords'],mute:.1},bass:{s:['Slow pulse','Syncopated'],n:['Melodic','Root + fifth'],ch:'round'}},
   {n:'Low-slung dub',bpm:[120,124],kit:'Rumble',lead:{p:['Organ stab','Hypno stab'],m:['Motif'],len:[2,3],h:[2,3],mute:.3},pad:{p:['Abyss'],mute:.3},bass:{s:['Dub sub','Off-beat'],n:['Root'],ch:'deep'},perc:{pv:'Conga',ch:.4}},
   {n:'Night bus',bpm:[126,130],kit:'808',lead:{p:['Vowel','Glass','Mist'],m:['Turing loop'],len:[4,6],h:[3,5],mute:.3},pad:{p:['Choir','Air'],mute:0},bass:{s:['Half-time','Reese'],ch:'deep'}}],
  Vector:()=>{const r=R();return r<.2?{n:'Marimba garden',lead:{p:['Rubber blip','Glass']},perc:{pv:'Marimba',ch:1}}:r<.4?{n:'Bell lab',lead:{p:['FM bell','Mini sparkle']},pad:{p:['Bell pad','Wavetable'],mute:0}}
   :G.vecFlav&&/rubber/.test(G.vecFlav)&&R()<.4?{n:'Modular fold',lead:{p:['West Coast fold']}}:G.vecFlav&&/night/.test(G.vecFlav)&&R()<.5?{n:'Night modular',pad:{p:['EP chords'],mute:0}}:null},   /* else Rubber, Cascade or Night as built */
  Dreamy:[{n:'Folk electronica',bpm:[118,122],kit:'808',lead:{p:['String pluck','Glass'],m:['Motif','Marbles'],len:[4,6],h:[4,7]},pad:{p:['EP chords','Bell pad'],mute:.2},bass:{s:['Syncopated','Walking'],n:['Melodic'],ch:'round'},perc:{pv:'Conga',ch:.5}},
   {n:'Warm psych',bpm:[120,124],kit:'909',lead:{p:['Chorus pulse','Soft sine'],m:['Interval','Motif'],len:[3,4],h:[3,5]},pad:{p:['Glass','Poly'],mute:.2},bass:{s:['Octave bounce','Off-beat'],n:['Root + fifth'],ch:'rubbery'}},
   {n:'Lagoon',bpm:[112,118],kit:'808',lead:{p:['Mini flute','Soft sine','Vowel'],m:['Motif','Marbles'],len:[4,6],h:[3,5]},pad:{p:['Choir','Tape'],mute:0},bass:{s:['Slow pulse','Syncopated'],n:['Melodic'],ch:'round'},perc:{pv:'Marimba',ch:.6}},
   {n:'Sparkle drift',bpm:[120,124],kit:'909',lead:{p:['Mini sparkle','FM bell','Bright pluck'],m:['Turing loop','Converge'],len:[5,7],h:[5,7]},pad:{p:['Wavetable','Cloud'],mute:.1},bass:{s:['Melodic pulse','Off-beat'],n:['Root + fifth'],ch:'round'},drift:1},
   {n:'Cassette house',bpm:[118,122],kit:'808',lead:{p:['Sunny keys','Soft keys','EP stab'],m:['Motif','Interval'],len:[3,4],h:[3,4]},pad:{p:['Tape','EP chords'],mute:.1},bass:{s:['Bouncy','Octave bounce'],ch:'rubbery'}}],
  Ethereal:[{n:'Tape nostalgia',bpm:[100,110],kit:'808',lead:{p:['Soft sine','Glass'],m:['Motif'],h:[2,4]},pad:{p:['Tape','Air'],mute:0},bass:{held:.6,ch:'round'}},
   {n:'Glacial ambient',bpm:[108,116],kit:'Rumble',lead:{p:['West Coast fold','Glass'],m:['Turing loop'],h:[3,5]},pad:{p:['Wind','Glass'],mute:0},bass:{held:.4,ch:'deep'}},
   {n:'Choir dawn',bpm:[96,106],kit:'808',lead:{p:['Vowel','Mist'],m:['Interval'],h:[2,3],mute:.3},pad:{p:['Choir','Strings'],mute:0},bass:{held:.7,ch:'round'}},
   {n:'Bell mist',bpm:[104,112],kit:'808',lead:{p:['FM bell','Mini sparkle','Glass'],m:['Marbles','Turing loop'],h:[3,5]},pad:{p:['Bell pad','Cloud'],mute:0},bass:{held:.5,ch:'round'},perc:{pv:'Marimba',ch:.4}},
   {n:'Slow tide',bpm:[100,108],kit:'Rumble',lead:{p:['Mini flute','Soft sine'],m:['Motif'],len:[4,6],h:[2,4]},pad:{p:['Wavetable','Air'],mute:0},bass:{s:['Slow pulse','Dub sub'],ch:'deep'}}],
  Hopeful:[{n:'Twin arps',bpm:[124,128],kit:'909',arp:1,lead:{p:['Chorus pulse'],m:['Pedal arp','Chord arp'],h:[8,12]},pad:{p:['Strings','Glass'],mute:0},bass:{s:['Octave bounce','Off-beat'],ch:'rubbery'}},
   {n:'Trance pulse',bpm:[126,130],kit:'909',lead:{p:['String pluck','Pluck'],m:['Motif'],len:[3,4],h:[5,7]},pad:{p:['Poly'],mute:.4},bass:{s:['Rolling 16ths','Syncopated'],ch:'deep'}},
   {n:'Piano sunrise',bpm:[122,126],kit:'909',lead:{p:['House piano','Sunny keys'],m:['Motif'],len:[3,4],h:[4,6]},pad:{p:['Strings','Poly'],mute:.1},bass:{s:['Octave bounce','Bouncy'],ch:'round'}},
   {n:'Wide open',bpm:[126,130],kit:'909',lead:{p:['Wide saw','Supersaw'],m:['Motif','Interval'],len:[3,4],h:[3,5]},pad:{p:['Poly','Brass'],mute:.3},bass:{s:['Rolling 16ths','Off-beat'],ch:'deep'}},
   {n:'Bell cascade',bpm:[124,128],kit:'808',arp:1,lead:{p:['FM bell','Bright pluck','Glass'],m:['Chord arp','Pedal arp'],h:[8,12]},pad:{p:['Bell pad','Glass'],mute:0},bass:{s:['Melodic pulse','Syncopated'],ch:'round'}}],
  Italo:[{n:'Sequencer disco',bpm:[116,120],kit:'808',lead:{p:['Chorus pulse','Mini lead'],m:['Motif'],len:[4,8],h:[5,7]},pad:{mute:.5},bass:{s:['Octave 8ths','Octave bounce'],ch:'rubbery'}},
   {n:'Hi-NRG',bpm:[122,126],kit:'909',arp:1,lead:{p:['Chorus pulse','Mini edge'],m:['Pedal arp'],h:[8,12]},bass:{s:['Octave 8ths','Disco run'],ch:'gritty'},perc:{pv:'Cowbell',ch:.6}},
   {n:'Cosmic disco',bpm:[108,114],kit:'808',lead:{p:['Mini brass','Mini lead','Wide saw'],m:['Motif'],len:[4,8],h:[3,5]},pad:{p:['Strings','Poly'],mute:.1},bass:{s:['Octave bounce','Syncopated'],ch:'round'},perc:{pv:'Conga',ch:.6}},
   {n:'Robot disco',bpm:[118,122],kit:'808',lead:{p:['Talkbox','Vowel','Square chip'],m:['Motif'],len:[3,4],h:[4,6]},pad:{mute:.6},bass:{s:['Octave 8ths'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.5}},
   {n:'House disco',bpm:[120,124],kit:'909',lead:{p:['House piano','Organ stab','EP stab'],m:['Motif'],len:[2,4],h:[3,5]},pad:{p:['Strings'],mute:.4},bass:{s:['Bouncy','Octave bounce'],ch:'rubbery'}}],
  Breaks:[{n:'Liquid atmos',kit:'808',lead:{p:['Soft sine','Glass'],h:[3,3]},pad:{p:['EP chords','Wind','Air'],mute:0},bass:{s:['Syncopated'],ch:'deep'},perc:{pv:'Conga',ch:.5}},
   {n:'Jungle sweep',kit:'Rumble',lead:{p:['Reese','Hollow BP'],h:[2,3]},pad:{p:['Abyss','Strings'],mute:.2},bass:{s:['Syncopated','Rolling 16ths'],ch:'gritty'}},
   {n:'Rave breaks',kit:'909',lead:{p:['Rave stab','Hoover','House piano'],m:['Motif'],h:[3,4]},pad:{mute:.7},bass:{s:['Syncopated','Bouncy'],ch:'gritty'}},
   {n:'Electro breaks',kit:'808',lead:{p:['Bleep','Square chip','Talkbox'],h:[3,5]},pad:{mute:.6},bass:{s:['Syncopated','Octave bounce'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.5}},
   {n:'Dub breaks',kit:'Rumble',lead:{p:['Organ stab','Mist'],h:[2,3],mute:.3},pad:{p:['Abyss','Tape'],mute:.1},bass:{s:['Dub sub','Half-time'],ch:'deep'}}],
  Bleep:[{n:'Sub bleep',kit:'909',lead:{p:['Bleep','Hollow BP'],m:['Motif'],h:[3,5]},pad:{mute:.8},bass:{s:['Off-beat','Syncopated'],n:['Root'],ch:'deep'}},
   {n:'Bleep bass',kit:'808',lead:{p:['West Coast fold','Bleep'],m:['Interval'],h:[2,4]},pad:{mute:.7},bass:{s:['Syncopated'],ch:'round'},perc:{pv:'Cowbell',ch:.5}},
   {n:'Night shift',kit:'909',lead:{p:['Space blip','Rubber blip','Bleep'],m:['Turing loop'],h:[4,6]},pad:{p:['Hollow','Abyss'],mute:.5},bass:{s:['Off-beat','Dub sub'],n:['Root'],ch:'deep'},drift:1},
   {n:'Chip signal',kit:'808',lead:{p:['Square chip','Bleep'],m:['Motif'],len:[3,4],h:[4,6]},pad:{mute:.8},bass:{s:['Octave bounce','Syncopated'],ch:'rubbery'}},
   {n:'Bell telemetry',kit:'808',lead:{p:['FM bell','Glass','Space blip'],m:['Interval','Marbles'],h:[2,4]},pad:{p:['Bell pad','Glass'],mute:.3},bass:{s:['Slow pulse','Syncopated'],ch:'round'},perc:{pv:'Marimba',ch:.5}}],
  'Deep Space':[{n:'Arctic drone',kit:'Rumble',lead:{p:['Mist','Soft sine'],h:[1,2]},pad:{p:['Wind','Air'],mute:0}},
   {n:'Space techno',kit:'Rumble',lead:{p:['Formant wave','Mini drone'],m:['Turing loop'],h:[2,3]},pad:{p:['Abyss','Glass'],mute:0}},
   {n:'Solar choir',kit:'Rumble',lead:{p:['Vowel','Mist'],h:[1,2],mute:.3},pad:{p:['Choir','Air'],mute:0}},
   {n:'Signal drift',kit:'808',lead:{p:['Space blip','FM bell'],m:['Marbles'],h:[2,3]},pad:{p:['Cloud','Wavetable'],mute:0}},
   {n:'Dark matter',kit:'Rumble',lead:{p:['Weird drone','Mini drone'],h:[1,2],mute:.4},pad:{p:['Abyss','Sync sweep'],mute:0}}],
  Polymeter:[{n:'Iron lattice',kit:'Raw',lead:{p:['Metal FM','Hard sync']},bass:{s:['Rolling techno'],ch:'gritty'}},
   {n:'Hollow tide',kit:'Rumble',lead:{p:['Hollow BP','Mist'],mute:.3},pad:{p:['Abyss','Wind'],mute:.4},bass:{s:['Pedal','Off-beat'],ch:'deep'}},
   {n:'Drum circle',kit:'909',lead:{mute:.7},bass:{s:['Syncopated'],ch:'rubbery'},perc:{pv:'Conga',ch:1}},
   {n:'Blip matrix',kit:'909',lead:{p:['Rubber blip','Bleep','Space blip']},bass:{s:['Off-beat'],n:['Root'],ch:'rubbery'}},
   {n:'Stab cycle',kit:'909',lead:{p:['Hypno stab','Techno stab','Organ stab']},bass:{s:['Rolling 16ths','Gallop'],ch:'deep'},perc:{pv:'Ride',ch:.4}}],
  Chug:[{n:'Tar pit',kit:'Rumble',lead:{p:['Reese','Mini bass']},bass:{s:['Reese','Half-time'],ch:'gritty'}},
   {n:'Slow burn',kit:'808',lead:{p:['Mini lead','Chorus pulse']},pad:{p:['Strings','Poly'],mute:.4},bass:{s:['Octave bounce','Bouncy'],ch:'rubbery'},perc:{pv:'Cowbell',ch:.5}},
   {n:'Dust storm',kit:'Raw',lead:{p:['Hard sync','Aggro'],mute:.2},pad:{p:['Sync sweep'],mute:.5},bass:{s:['Gallop','Syncopated'],ch:'gritty'}},
   {n:'Cosmic crawl',kit:'808',lead:{p:['Mini brass','Wide saw']},pad:{p:['Tron','Choir'],mute:.3},bass:{s:['Slow pulse','Pedal'],ch:'round'},perc:{pv:'Conga',ch:.5}},
   {n:'Dub giant',kit:'Rumble',lead:{p:['Organ stab','Hollow BP'],mute:.3},pad:{p:['Abyss','Tape'],mute:.3},bass:{s:['Dub sub','Off-beat'],ch:'deep'}}],
  Ambient:[{n:'Generative ambient',lead:{p:['Glass','Soft sine'],h:[1,3]},pad:{p:['Wind','EP chords'],mute:0}},{n:'Slow strings',lead:{mute:.7},pad:{p:['Strings','Abyss','Air'],mute:0}},
   {n:'Tape garden',lead:{p:['Soft keys','Mini flute'],h:[1,3]},pad:{p:['Tape','Bell pad'],mute:0}},
   {n:'Cloud field',lead:{p:['Mist','Glass'],m:['Marbles'],h:[1,2],mute:.4},pad:{p:['Cloud','Wavetable','Air'],mute:0}},
   {n:'Night choir',lead:{p:['Vowel','Soft sine'],h:[1,2],mute:.5},pad:{p:['Choir','Strings'],mute:0}}]};
 const ARPOK=()=>G.arpOn||G.flavArp||(curMood==='Vector'&&/cascade/.test(G.vecFlav||''));
 /* v0.25: quick arp leads in the moods they belong to — filtered, a slow filter sweep on a free LFO, a touch of echo; never a bare oscillator */
 const ARPM={Melancholic:.45,'Melodic House':.4,Hopeful:.5,Italo:.35,Vector:.3,Dreamy:.3,Tense:.25};
 const ARPP={Melancholic:['Formant wave','Pluck','Mini lead','Cinematic arp'],'Melodic House':['Cinematic arp','Formant wave','Pluck','String pluck'],Hopeful:['Chorus pulse','Pluck','String pluck'],
  Italo:['Chorus pulse','Mini lead','Pluck'],Vector:['Pluck','West Coast fold','Glass'],Dreamy:['String pluck','Glass','Chorus pulse'],Tense:['Hollow BP','Mini edge','Hard sync']};
 /* v0.25: a bit more rotate drift in the hypnotic, spacious and melodic moods — one more track (perc, hats, stab or a non-arp lead) rotates every 8 or 16 bars */
 const DRM={Ethereal:.7,Drone:.7,'Deep Space':.7,Melancholic:.6,Dreamy:.6,Bleep:.6,'Melodic House':.55,Noir:.55,Power:.5,Breaks:.45,Acid:.45,'Groove Techno':.3,Temporal:.3,Hopeful:.3,Vector:.3,Italo:.2,Dark:.25,Tense:.25};   /* v0.33: slightly higher */
 const driftMore=()=>{const ch=DRM[curMood];if(!ch||R()>=ch)return;const c=[3,1,8,4].filter(k=>{const T=TR[k];return T&&!T.m&&!((T.p.rdr||0)>0)&&T.h>0&&!(k===4&&(G.arpOn||T.p.mode==='Acid 303'||T.p.mode==='Riff'))&&!(k===1&&window.rigidHats&&rigidHats.on())});
  if(c.length)TR[pick(c)].p.rdr=pick([8,16,16])};
 const arpify=()=>{G.arpOn=0;const L=TR[4],P=L.p,ch=ARPM[curMood];if(!ch||L.m||P.mode==='Acid 303'||ARPOK()||R()>=ch)return;
  const ok=(ARPP[curMood]||[]).filter(n=>LPRE[n]);if(ok.length)applyLP(pick(ok),1);G.arpOn=1;
  Object.assign(L,{st:16,ten:0});L.h=pick([16,16,12,8]);L.r=0;L.pt=pat(L);P.mode=pick(['Chord arp','Up/Down','Pedal arp','Chord arp','Up']);P.range=2;P.lock=Math.max(P.lock||0,.8);
  P.dec=Math.min(P.dec||.2,.22);P.ds=Math.max(P.ds||0,.28);P.rdr=0;L.lv=(L.lv||.45)*.85;buf=[];mot=[];mp=-1;
  const F=LFOS.find(x=>!(x.d>0));if(F)Object.assign(F,{tg:'Lead cutoff',sh:0,sync:1,div:pick([32,64]),d:+(.3+R()*.2).toFixed(2),ph:0})};
 const ringH=(T,h)=>{const hh=Math.max(1,Math.min(T.st-1,Math.round(h*T.st/16)));if(T.h!==hh){T.h=hh;T.pt=pat(T)}};
 const apply=f=>{const L=TR[4],P=L.p,PD=TR[5],B=TR[6],P3=TR[3],acid=P.mode==='Acid 303';G.flav=f.n;G.flavArp=f.arp?1:0;
  if(f.bpm&&!G.bpmLock){G.bpm=RI(f.bpm[0],f.bpm[1]);$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm;try{if(A.dl)A.dl.delayTime.value=(G.dt||.75)*60/G.bpm}catch(e){}}
  if(f.kit&&window.orbKit)orbKit(f.kit);
  const l=f.lead;if(l&&!acid){if(l.mute!=null&&R()<l.mute)L.m=true;else if(l.p||l.m||l.h){L.m=false;
    if(l.p){const ok=l.p.filter(n=>LPRE[n]);if(ok.length)applyLP(pick(ok),1)}if(l.m)P.mode=pick(l.m);if(l.len)P.len=RI(l.len[0],l.len[1]);if(l.h)ringH(L,RI(l.h[0],l.h[1]));buf=[];mot=[];mp=-1}}
  const p=f.pad;if(p){if(p.p)PD.p.patch=pick(p.p);if(p.mute!=null)PD.m=R()<p.mute}
  const b=f.bass;if(b&&!B.m){if(b.s&&window.bassStyle)try{bassStyle(pick(b.s))}catch(e){}if(b.n)B.p.bns=pick(b.n);
   if(b.held&&R()<b.held){B.p.bsus=+(.55+R()*.25).toFixed(2);B.p.bns='Melodic';B.p.bsl=pick([.15,.25])}else if(b.s)B.p.bsus=0;if(b.ch&&window.orbBassChar)orbBassChar(b.ch)}
  const pc=f.perc;if(pc){if(pc.pv&&R()<(pc.ch||1)){try{window.setPercSound&&setPercSound(pc.pv)}catch(e){}P3.m=false}if(pc.mute!=null&&R()<pc.mute)P3.m=true}
  if(f.drift&&!L.m)P.rdr=pick([8,16])};
 const clean=()=>{const L=TR[4],P=L.p;if(L.m||P.mode==='Acid 303')return;const eng=(!P.eng||P.eng==='Saw')?'Stack':P.eng;
  // no plain, unfiltered oscillators
  if(['Stack','Pulse','Sine','Organ','Vowel'].includes(eng)||eng==='Mini'){const cap=eng==='Mini'?2500:1800;if((P.cut||0)>cap)P.cut=Math.round(cap*(.5+R()*.35));
   if(eng!=='Mini'){P.envA=Math.max(P.envA||0,1400);P.res=Math.max(P.res||0,2.5);if(P.ft==='HP')P.ft='LP12'}}
  if(eng==='Sine'&&(P.fold||0)<.15){P.fold=.22;P.fenv=Math.max(P.fenv||0,.5)}
  if(eng==='FM'&&(P.fmi||0)<.6)P.fmi=.9;
  // no cheesy runs
  const run=['Up','Up/Down','Random','Chord arp','Pedal arp'].includes(P.mode);if(run&&!ARPOK()){if(L.h>=8||P.mode==='Random'){P.mode=pick(['Motif','Interval','Turing loop']);if(L.st===16&&L.h>7){L.h=pick([4,5,6]);L.pt=pat(L)}buf=[];mot=[];mp=-1}}};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{G.flav=null;G.flavArp=0;let f=FL[curMood];if(typeof f==='function')f=f();else if(Array.isArray(f))f=pick(f);if(f)apply(f);arpify();clean();driftMore();
   const Q=window.orbQuality;if(Q){Q.gate();Q.slots();if(!TR[4].m&&TR[4].p.mode!=='Acid 303'){Q.bestRotation();Q.bestMelody()}}}catch(e){console.warn('[orbitron] flavour',e)}
  try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync();if(typeof lfoUI==='function')lfoUI()}catch(e){}},0);return r};
 window.orbFlavours=FL}
