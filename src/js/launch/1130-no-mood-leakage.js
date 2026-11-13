
/* v161: no sound leakage between moods. When the mood changes, Launch first restores perc, lead, pad, bass, stab, sub,
   hat and clap sound parameters to their defaults and clears mood-only flags, so a mood sounds the same whatever came before it. */
{const cp=o=>JSON.parse(JSON.stringify(o,(k,v)=>v instanceof AudioNode||v instanceof AudioParam||typeof v==='function'?undefined:v));
 const S1=window.__orbSnap1||[],S2=TR.map(T=>cp(T.p)),KS=[1,2,3,4,5,6,8,9];
 const DEF=TR.map((T,k)=>Object.assign({},S2[k],S1[k]||{}));
 const MUTE={3:TR[3].m,5:TR[5].m,9:TR[9].m};
 const GF=['tmpFlav','pcol','prhy','leadSty','vecFlav','stabv','pad80','mhFlav','gtLead','deFlav','pnote','cmPat','cmShape'];
 let last=null;
 const reset=()=>{KS.forEach(k=>{const P=TR[k].p,D=DEF[k];for(const key of Object.keys(P)){const v=P[key];if(v instanceof AudioNode||v instanceof AudioParam||typeof v==='function')continue;if(!(key in D))delete P[key]}
   Object.assign(P,cp(D))});
  for(const k in MUTE)TR[k].m=MUTE[k];GF.forEach(k=>{delete G[k]});
  const L=LFOS[2];if(L)Object.assign(L,{tg:'Master low-pass',div:64,d:0})};
 const _g=generate;generate=function(){const sel=$('#mood').value;
  if(sel==='Auto'||sel!==last){try{reset()}catch(e){console.warn('[orbitron] reset',e)}}
  const r=_g.apply(this,arguments);last=sel;return r};
 window.orbMoodReset=reset}
