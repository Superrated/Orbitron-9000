
/* ---- v0.78: LEVEL BALANCE after a Launch — every part sits where it belongs, in every mood and with every sound. Measured, not guessed:
   tools/levels.mjs played 6 Launches of each mood (two rounds), soloed every part and read its loudness against the kick where the buses meet
   (so the lead compressor, bus gains, echo and reverb are included). Before this pass a lead could land anywhere from 3 to 24 dB under
   the kick, a pad from 4 to 33 dB under it, and the bass moved by up to 20 dB inside one mood — the sound picked mattered more than the mood.
   Two small tables put that right, in dB:
     MB  per mood and part   (1 hat · 2 clap · 3 perc · 4 lead · 5 pad · 6 bass · 7 snare · 8 stab · 9 Satellite)
     SB  per sound           (a Marimba is far louder than a Conga; an 808 held bass far quieter than a Reese …)
   Where the parts are aimed, against the kick: bass −7.5 · pad −13 (−10 in Aurora, Low Orbit, Orbital Hum) · snare −14.5 · clap −15.5 ·
   stab −18.5 · hat and perc −20 (Tidal Lock toms −15) · Satellite −24 · lead by mood: forward −11 (Lost Signal, Afterglow, Nebula,
   First Light, Solar Flare, Satellite Disco, Telemetry, Trajectory), soft −17 (Aurora, Low Orbit, Orbital Hum), tucked in −15 elsewhere.
   Applied once, as the Launch ends: the lead through its bus level, the perc around its voice, the others through the track trims.
   Outer Rim's hats are left alone (its cosmic events play through every solo, so they cannot be read). The Level faders are not moved
   and nothing listens or corrects while you play. To retune: measure again, change a number. ---- */
{const MB={
  Dark:{'2':-2,'3':1.5,'4':-3.3,'5':10,'8':-1},
  Melancholic:{'1':1.2,'3':3.5,'4':2.9,'6':1.4,'9':3.7},
  Dreamy:{'1':5.4,'2':3.1,'3':3.3,'4':2.4,'9':4.1},
  Tense:{'1':-2.5,'3':2.7,'5':7.6},
  Ethereal:{'1':-1.7,'2':1.4,'3':3.2,'4':-5.3,'7':2.1},
  Hopeful:{'1':3.2,'2':-1.7,'3':3.3,'4':2.2,'5':-9.1,'6':-3.1,'8':1.3,'9':4.3},
  Noir:{'1':4.6,'3':2.4,'4':-4.6,'5':-6.8,'7':1},
  Drone:{'3':2.9,'4':-2.3,'5':9,'6':-3.6,'9':-1.4},
  Acid:{'1':2.1,'2':-2.3,'3':-1.5,'7':-1.8},
  Power:{'1':-1.5,'2':-3.2,'3':1.8,'4':5.4,'5':-2.5},
  Italo:{'1':1,'2':2,'3':4.8,'4':3.6,'5':-10,'6':2.2,'9':4.6},
  Breaks:{'1':-1.5,'2':1.7,'3':-3.5,'4':-1.6,'5':1.5,'7':1},
  Bleep:{'3':-1.7,'4':5.1,'6':-2.6},
  'Distorted Electro':{'1':2.7,'2':2.3,'3':2.8,'4':-1.4,'5':1.7,'7':-3.4},
  Ambient:{'1':4.6,'2':9.8,'3':2.6,'4':1,'5':7.6,'6':5.2},
  'Groove Techno':{'1':-4.9,'2':-3.1,'5':-3,'6':1},
  Vector:{'1':1.1,'5':-2.1,'6':2.4,'7':-1.1},
  Temporal:{'1':2.6,'2':-2.3,'3':1.4,'5':4.9,'6':2.6,'8':4.7,'9':6.9},
  Polymeter:{'1':-6.4,'2':3,'3':2.2,'4':3.2,'6':2.1},
  Chug:{'1':-1.4,'2':-1.4,'3':1.2,'5':4.6,'8':2.8},
  'Deep Space':{'3':3.2,'4':-4.2,'5':10,'6':1.8,'9':-1.3},
  'Melodic House':{'4':2.9,'5':-7.3,'6':-2.7,'7':1.4}},
 SB={
  3:{Ride:1.1,Cowbell:2.2,Marimba:-8,Blip:-1.8},   // perc sound
  4:{'Techno stab':4,'House piano':-1.4,'Bright pluck':2.5,'Organ stab':3.2,'Rave stab':2.3,'EP stab':-4.4,'Chorus pulse':-4.9,'Rubber blip':5.7,'Mini drone':-4.1,Pluck:3.5,'Mini brass':3.5,'FM stab':6.4,'Hollow BP':-1.1,Hoover:-3.5,'Weird drone':-6.9,'String pluck':-1.4,'Cinematic arp':1.9,'Wide saw':1.4,'Hypno stab':2.5,'Mini flute':1.3,'FM keys':-1.2},   // lead patch
  5:{Abyss:-2.6,Tape:4.9,Air:-10,Choir:-4.6,Strings:4.3,Brass:10,'Warm saw':1.2,Hollow:-1.8,Wavetable:1.8,'Bell pad':-3.6,'EP chords':-1.4,Cloud:1.4},   // pad sound
  6:{'Rolling techno':1.5,Reese:-3.4,'Held, syncopated · 808':7.5,'Held, syncopated':-1.3,Held:-3,'Rolling 16ths':2.3,'Off-beat':3.1,'Held · 808':10,'Octave bounce':-1.5,'Modern minimal · 808':3.9,'Modern minimal':1.7,Gallop:3.3,'Rolling techno · 808':-4,Pedal:-1.2,Bouncy:-1.3,'Modern bounce · 808':1.4}   // bass style (· 808 = the 808 bass engine)
 };
 const snd=k=>{const p=TR[k].p;return k===4?(p.mode==='Acid 303'?'Acid 303':p.patch):k===5?p.patch:k===3?p.pv:(p.bsty||'')+(p.beng==='808'?' · 808':'')};
 /* the perc sounds read the track level themselves (most are played from pre-rendered hits), so the track trim never reached them: their part of the balance is applied here, around the voice */
 let pg=1;{const _fv=fireVoice;fireVoice=function(k,w){if(k!==3||pg===1)return _fv.apply(this,arguments);const T=TR[3],o=T.lv;T.lv=o*pg;try{return _fv.apply(this,arguments)}finally{T.lv=o}}}
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);
  try{pg=1;const b=MB[curMood]||{};for(let k=1;k<10;k++){const s=SB[k],d=(b[k]||0)+((s&&s[snd(k)])||0);if(!d)continue;
    if(k===4)G.ldMul=+((G.ldMul||1)*Math.pow(10,d/20)).toFixed(3);else if(k===3)pg=Math.pow(10,d/20);else TRIM[k]=(TRIM[k]||0)+d}}catch(e){console.warn('[orbitron] level balance',e)}
  return r};
 window.orbLevelBalance={MB,SB}}
