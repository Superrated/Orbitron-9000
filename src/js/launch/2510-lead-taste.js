/* ---- v0.83: LEAD TASTE — some lead sounds are lovely but came out too bright and on top of the mix (by ear, Nov 2026).
   SOUND · in every mood, after a Launch: highest cutoff (Hz) · highest filter sweep (envA, Hz) · at least this much reverb send (rs),
           so they sit darker and further back.  Acid 303 lines are left alone.
   MOOD  · some moods also cap every lead's cutoff (Lost Signal · Afterglow 1500 Hz, Ion Storm 1800 Hz). ---- */
{const SOUND={
  'House piano':{cut:1500,env:2000,rs:.4}, 'Bright pluck':{cut:800,env:2200,rs:.4}, 'Chorus pulse':{cut:1100,env:1600,rs:.4},
  'EP stab':{cut:1300,env:1400,rs:.4},     'Hoover':{cut:1000,env:1100,rs:.35},     'FM keys':{cut:1400,rs:.4},
  'Organ stab':{cut:2000,rs:.35},          'Rave stab':{cut:1100,env:2000,rs:.35},  'Donk':{cut:1500,env:1000,rs:.2}};
 const MOOD={Melancholic:1500,'Melodic House':1500,'Distorted Electro':1800};
 window.orbLeadTaste={SOUND,MOOD};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const P=TR[4].p;if(P.mode==='Acid 303')return r;const s=SOUND[P.patch],mc=MOOD[curMood];
  if(s){if(P.cut>s.cut)P.cut=s.cut;if(s.env!=null&&P.envA>s.env)P.envA=s.env;if(!(P.rs>=s.rs))P.rs=s.rs}
  if(mc&&P.cut>mc)P.cut=mc;
  setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){console.warn('[orbitron] lead-taste sync',e)}},0)}
 catch(e){console.warn('[orbitron] lead taste',e)}return r}}
