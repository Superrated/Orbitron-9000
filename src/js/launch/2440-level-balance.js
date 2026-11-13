
/* ---- v0.78: LEVEL BALANCE after a Launch — every part sits where it belongs, in every mood and with every sound. Measured, not guessed:
   tools/levels.mjs played 6 Launches of each mood, soloed every part and read its loudness against the kick where the buses meet
   (so the lead compressor, bus gains, echo and reverb are included). Before this pass a lead could land anywhere from 3 to 24 dB under
   the kick, a pad from 4 to 33 dB under it, and the bass moved by up to 20 dB inside one mood — the sound picked mattered more than the mood.
   Two small tables put that right, in dB:
     MB  per mood and part   (1 hat · 2 clap · 3 perc · 4 lead · 5 pad · 6 bass · 7 snare · 8 stab · 9 Satellite)
     SB  per sound           (a Marimba is far louder than a Conga; an 808 held bass far quieter than a Reese …)
   Where the parts are aimed, against the kick: bass −7.5 · pad −13 (−10 in Aurora, Low Orbit, Orbital Hum) · snare −14.5 · clap −15.5 ·
   stab −18.5 · hat and perc −20 (Tidal Lock toms −15) · Satellite −24 · lead by mood: forward −11 (Lost Signal, Afterglow, Nebula,
   First Light, Solar Flare, Satellite Disco, Telemetry, Trajectory), soft −17 (Aurora, Low Orbit, Orbital Hum), tucked in −15 elsewhere.
   Applied once, as the Launch ends: the lead through its bus level, the others through the track trims. The Level faders are not moved
   and nothing listens or corrects while you play. To retune: measure again, change a number. ---- */
{const MB={
  Dark:{'2':-1.3,'3':2.2,'4':-3.2,'5':8,'6':-1.4},
  Melancholic:{'4':3.9,'5':-7.1,'6':-2.8},
  Dreamy:{'1':3.1,'2':3.3,'3':4.8,'4':2.6,'5':-2.6,'6':1.2,'9':4.5},
  Tense:{'1':-1,'3':3.5,'4':-1.3,'5':3.7},
  Ethereal:{'1':-7.6,'2':2.2,'3':3.4,'4':-3.2,'5':8,'6':1.7},
  Hopeful:{'1':3.1,'3':3.2,'4':1.6,'5':-8,'6':-1.7,'9':4.8},
  Noir:{'1':2.7,'2':1.4,'3':3.7,'4':-3,'5':-8},
  Drone:{'3':2.5,'4':-1.9,'5':8,'6':-1.7,'9':-2.2},
  Acid:{'1':2.6,'2':-1,'4':1.1},
  Power:{'1':-2.1,'2':-2.8,'3':1.4,'4':3.2,'5':-2.3},
  Italo:{'2':1.7,'3':4.8,'4':1.8,'5':-8,'6':2.3,'9':2.3},
  Breaks:{'1':-1.9,'2':1.8,'3':-3.9,'5':6.6,'7':1.6},
  Bleep:{'1':-1.7,'3':-1.2,'4':4.7},
  'Distorted Electro':{'1':2.3,'2':2.2,'3':3.7,'5':1.8,'7':-1.6},
  Ambient:{'1':1.4,'2':4.7,'4':-1.4,'5':6.5,'6':2},
  'Groove Techno':{'1':-5.6,'2':-2.9,'3':1.9,'5':3.3,'6':2.7},
  Vector:{'2':1.4,'5':-4.2,'7':-1.2},
  Temporal:{'2':-1.9,'3':1.9,'5':4.9,'6':2.6,'8':4.9,'9':3.7},
  Polymeter:{'1':-4.9,'2':4.1,'4':3.1,'6':2.8,'8':1},
  Chug:{'1':-1.6,'2':-1.2,'4':-1.5,'5':4.6,'8':2.1},
  'Deep Space':{'1':-7.6,'2':2.2,'3':3.4,'4':-3.2,'5':8,'6':1.7},
  'Melodic House':{'4':3.9,'5':-7.1,'6':-2.8}},
 SB={
  3:{Cowbell:1.8,Marimba:-8,Blip:-3},   // perc sound
  4:{'Techno stab':3.1,'House piano':-1.3,'Bright pluck':1.5,'Organ stab':2.7,'Rave stab':1.1,'EP stab':-3.1,'Chorus pulse':-3.7,'Rubber blip':3.3,'Mini drone':-3.4,Pluck:1.4,'Mini brass':2.6,'FM stab':5.2,'Hollow BP':-1,Hoover:-2.1,'Weird drone':-3.9},   // lead patch
  5:{Abyss:-2.6,Tape:3.6,Air:-5.6,Choir:-1.4,Strings:3.8,Brass:8,'Warm saw':1.7,Hollow:-3.2,Wavetable:6,Glass:-2.4},   // pad sound
  6:{'Rolling techno':1.7,Reese:-1.7,'Held, syncopated · 808':5.2,'Held, syncopated':-1.5,Held:-2.2,'Rolling 16ths':1.8,'Off-beat':1.4,'Held · 808':7.4,'Octave bounce':-1.4,'Modern minimal · 808':1.9,'Modern minimal':2.8,Gallop:2.5,'Rolling techno · 808':-1.5,Pedal:-1.3}   // bass style (· 808 = the 808 bass engine)
 };
 const snd=k=>{const p=TR[k].p;return k===4?(p.mode==='Acid 303'?'Acid 303':p.patch):k===5?p.patch:k===3?p.pv:(p.bsty||'')+(p.beng==='808'?' · 808':'')};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);
  try{const b=MB[curMood]||{};for(let k=1;k<10;k++){const s=SB[k],d=(b[k]||0)+((s&&s[snd(k)])||0);if(!d)continue;
    if(k===4)G.ldMul=+((G.ldMul||1)*Math.pow(10,d/20)).toFixed(3);else TRIM[k]=(TRIM[k]||0)+d}}catch(e){console.warn('[orbitron] level balance',e)}
  return r};
 window.orbLevelBalance={MB,SB}}
