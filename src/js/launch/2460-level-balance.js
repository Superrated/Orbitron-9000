
/* ---- v0.78: LEVEL BALANCE after a Launch — every part sits where it belongs, in every mood and with every sound. Measured, not guessed:
   tools/levels.mjs played 6 Launches of each mood (four rounds, the last on the v0.81 build), soloed every part and read its loudness against the kick where the buses meet
   (so the lead compressor, bus gains, echo and reverb are included). Before this pass a lead could land anywhere from 3 to 24 dB under
   the kick, a pad from 4 to 33 dB under it, and the bass moved by up to 20 dB inside one mood — the sound picked mattered more than the mood.
   Two small tables put that right, in dB:
     MB  per mood and part   (1 hat · 2 clap · 3 perc · 4 lead · 5 pad · 6 bass · 7 snare · 8 stab)
     SB  per sound           (a Marimba is far louder than a Conga; an 808 held bass far quieter than a Reese …)
   Where the parts are aimed, against the kick (read with the headroom keeper held still, so every part is read at the same mix gain):
   bass −7.5 · pad −17.5 (−14.5 in Aurora, Outer Rim, Low Orbit, Orbital Hum) · snare −17 · clap −17.5 · hat −21.5 · perc −23
   (Tidal Lock toms −18) · stab −24 · lead by mood: forward −15 (Lost Signal, Afterglow, Nebula, First Light, Solar Flare, Satellite Disco,
   Telemetry, Trajectory), soft −21 (Aurora, Outer Rim, Low Orbit, Orbital Hum), tucked in −19 elsewhere. These are the levels the parts
   had on average before this pass: the balance evens out moods and sounds, it does not make any part louder or quieter overall.
   Applied once, as the Launch ends: the lead through its bus level, the perc around its voice, the others through the track trims.
   Outer Rim's hats are left alone (its cosmic events play through every solo, so they cannot be read), and so is the Satellite
   (it plays too rarely to be read in four bars). The Level faders are not moved
   and nothing listens or corrects while you play. To retune: measure again, change a number. ---- */
{const MB={
  Dark:{'4':-1,'5':10,'6':4.3,'8':1},
  Melancholic:{'3':3.5,'4':2.7,'5':7.5,'6':2.3},
  Dreamy:{'1':3.9,'2':4.1,'3':5.3,'4':2.9},
  Tense:{'1':-1.6,'3':3.8,'5':5.5},
  Ethereal:{'1':1,'2':1.5,'3':4.7,'4':-4.5,'5':2.8,'7':2.4},
  Hopeful:{'1':3.6,'3':3.5,'4':2.5,'5':-8.9,'6':-3.2},
  Noir:{'1':3.9,'2':1.2,'3':3.8,'4':-5.3,'5':-8.2,'6':1.4,'7':1.1},
  Drone:{'3':3.9,'4':-2.5,'5':9,'6':-3.7},
  Acid:{'2':-2.7,'3':-2.9,'7':-2.4},
  Power:{'1':-2,'2':-3.9,'3':1.5,'4':5.7,'5':-1.7,'6':-1.3},
  Italo:{'2':2.6,'3':4.6,'4':3.6,'5':-10,'6':2.3},
  Breaks:{'1':-2.1,'2':2,'3':-6.4,'4':-1.4,'5':4.4},
  Bleep:{'1':1.2,'3':-2.1,'4':4.6,'6':-4.1},
  'Distorted Electro':{'1':2,'2':2.2,'3':4.2,'4':-2.4,'7':-4},
  Ambient:{'1':4.3,'2':5.9,'3':3.6,'5':1.7,'6':6},
  'Groove Techno':{'1':-2.1,'2':-3.9,'5':-2},
  Vector:{'5':-3.4,'6':2.7,'7':-1.5},
  Temporal:{'1':2.8,'2':-2.7,'5':4.9,'6':1.7,'8':5.5},
  Polymeter:{'1':-1.7,'2':2.8,'4':2.2,'6':1.8},
  Chug:{'1':-1.5,'3':1,'5':6.7,'8':3.1},
  'Deep Space':{'2':-2.1,'3':5.4,'4':-5.7,'5':10},
  'Melodic House':{'3':1.9,'4':4.7,'5':-5.3,'6':-3.2,'7':1.4}},
 SB={
  3:{Ride:2.1,Cowbell:3.4,Marimba:-10,Blip:-4.3},   // perc sound
  4:{'Techno stab':4.5,'House piano':-1.3,'Bright pluck':2.6,'Organ stab':2.7,'Rave stab':2.3,'EP stab':-4.4,'Chorus pulse':-4.7,'Rubber blip':5.4,'Mini drone':-5.1,Pluck:4.3,'Mini brass':2.7,'FM stab':6.3,'Hollow BP':-1,Hoover:-3.5,'Weird drone':-7.9,'String pluck':-1.4,'Wide saw':1.2,'Hypno stab':3.1,Vowel:-2.6},   // lead patch
  5:{Abyss:-2.9,Tape:1.5,Air:-9.2,Choir:-6.3,Strings:2.3,Brass:10,'Warm saw':1.5,Hollow:-3.8,Wavetable:1.8,'Bell pad':-2.1,'EP chords':-1.5,Cloud:1.5},   // pad sound
  6:{'Rolling techno':1.2,Reese:-3.5,'Held, syncopated · 808':7.2,'Held, syncopated':-1.2,Held:-2.9,'Rolling 16ths':3.3,'Off-beat':3.3,'Held · 808':10,'Octave bounce':-1.5,'Modern minimal · 808':4.7,'Modern minimal':1.8,Gallop:3.4,'Rolling techno · 808':-4.8,Bouncy:-2.8,'Modern bounce · 808':1.5,'Modern bounce':-1.2}   // bass style (· 808 = the 808 bass engine)
 };
 /* v0.79: the kick is what everything else is measured against, so it has to be the same size whatever drum kit a flavour picks.
    Played alone on the same grooves, Rumble came out 1.3 dB quieter and Raw 1.2 dB louder than 909 and 808 (which agree). */
 const KB={Rumble:2.5,Raw:-2.5};   /* the drum bus gives back about half of a kick trim, so the trims are twice the difference */
 const snd=k=>{const p=TR[k].p;return k===4?(p.mode==='Acid 303'?'Acid 303':p.patch):k===5?p.patch:k===3?p.pv:(p.bsty||'')+(p.beng==='808'?' · 808':'')};
 /* the perc sounds read the track level themselves (most are played from pre-rendered hits), so the track trim never reached them: their part of the balance is applied here, around the voice */
 let pg=1;{const _fv=fireVoice;fireVoice=function(k,w){if(k!==3||pg===1)return _fv.apply(this,arguments);const T=TR[3],o=T.lv;T.lv=o*pg;try{return _fv.apply(this,arguments)}finally{T.lv=o}}}
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);
  try{pg=1;const kb=KB[G.kit];if(kb)TRIM[0]=(TRIM[0]||0)+kb;const b=MB[curMood]||{};for(let k=1;k<10;k++){const s=SB[k],d=(b[k]||0)+((s&&s[snd(k)])||0);if(!d)continue;
    if(k===4)G.ldMul=+((G.ldMul||1)*Math.pow(10,d/20)).toFixed(3);else if(k===3)pg=Math.pow(10,d/20);else TRIM[k]=(TRIM[k]||0)+d}}catch(e){console.warn('[orbitron] level balance',e)}
  return r};
 window.orbLevelBalance={MB,SB}}
