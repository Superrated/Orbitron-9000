/* ---- v0.82: every Launch sets the lead's filter Cutoff about 10 % lower (all moods) — the lead came out a tad too bright.
   Only the base cutoff; the per-note brightness sweep (Env amount) is left alone. The new value shows on the lead's Cutoff knob. ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const P=TR[4].p;if(P.cut>0)P.cut=Math.max(150,Math.round(P.cut*.9/10)*10)}catch(e){console.warn('[orbitron] darker lead',e)}return r}}
