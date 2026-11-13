
/* ---- v0.5: GRAVITY ASSIST a little less hot: bus clip, grit and rumble capped slightly lower, kick less driven, more cut around 280 Hz ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(curMood!=='Groove Techno')return r;
  G.clip=Math.min(+G.clip||0,.38);G.bgrit=Math.min(+G.bgrit||0,.18);G.rumble=Math.min(+G.rumble||0,.22);const K=TR[0].p;K.drive=Math.min(+K.drive||0,2.5);
  setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){}return r}}
/* ---- v0.83: Gravity Assist lead is never cheesy — Organ stab, EP stab, Rave stab, FM keys, House piano and Bright pluck are swapped for
   one of the mood's techno sounds (Hypno stab, Techno stab, Hard sync, FM stab, Rubber blip). Acid 303 lines are left alone. ---- */
{const CHEESE=new Set(['Organ stab','EP stab','Rave stab','FM keys','House piano','Bright pluck','Chorus pulse','Hoover']),TECH=['Hypno stab','Techno stab','Hard sync','FM stab','Rubber blip'];
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(curMood!=='Groove Techno')return r;const P=TR[4].p;
  if(P.mode!=='Acid 303'&&CHEESE.has(P.patch)&&typeof applyLP==='function'&&typeof LPRE!=='undefined'){const ok=TECH.filter(n=>LPRE[n]);if(ok.length){applyLP(pick(ok),1);setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){console.warn('[orbitron] gravity lead sync',e)}},0)}}}
 catch(e){console.warn('[orbitron] gravity-assist lead',e)}return r}}
