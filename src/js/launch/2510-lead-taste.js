/* ---- v0.83: LEAD TASTE — per mood, lead sounds that came out cheesy are swapped for one that suits the mood, and the lead's cutoff
   can be capped so it doesn't get too bright. One line per mood:  ban · sounds swapped out · swap · what they become · cut · highest cutoff (Hz).
   Acid 303 lines are left alone. Notes by ear (Nov 2026): Lost Signal · Afterglow and Ion Storm too cheesy and bright, Gravity Assist cheesy;
   Organ stab, Rave stab and Donk are fine everywhere but filtered mellow (presets darker + a cutoff ceiling). ---- */
{const CHEESE=['House piano','Bright pluck','Chorus pulse','EP stab','Hoover'];
 /* every mood: these sounds are welcome but must stay mellow — their cutoff never goes above this after a Launch (by ear, Nov 2026) */
 const MELLOW={'Organ stab':2000,'Rave stab':1100,'Donk':1500};
 const LT={
  Melancholic:      {ban:CHEESE, swap:['Soft keys','String pluck','FM keys','Pluck'], cut:1500},
  'Melodic House':  {ban:CHEESE, swap:['Soft keys','String pluck','FM keys','Pluck'], cut:1500},
  'Groove Techno':  {ban:[...CHEESE,'FM keys'], swap:['Hypno stab','Techno stab','Hard sync','FM stab','Rubber blip']},
  'Distorted Electro':{ban:CHEESE, swap:['Hard sync','Techno stab','Hypno stab','FM stab','Metal FM','Mini edge','Aggro','Vowel'], cut:1800}};
 window.orbLeadTaste=LT;
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const t=LT[curMood]||{ban:[],swap:[]},P=TR[4].p;if(P.mode==='Acid 303')return r;
  if(t.ban.includes(P.patch)&&typeof applyLP==='function'&&typeof LPRE!=='undefined'){const ok=t.swap.filter(n=>LPRE[n]);if(ok.length)applyLP(pick(ok),1)}
  if(t.cut&&P.cut>t.cut)P.cut=t.cut;
  if(MELLOW[P.patch]&&P.cut>MELLOW[P.patch])P.cut=MELLOW[P.patch];
  setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){console.warn('[orbitron] lead-taste sync',e)}},0)}
 catch(e){console.warn('[orbitron] lead taste',e)}return r}}
