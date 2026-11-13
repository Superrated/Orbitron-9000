
/* ---- v0.5: Marimba level matched closer to the other perc sounds ---- */
{const _gm=generate;generate=function(){const r=_gm.apply(this,arguments);try{const P=TR[3].p;if(P.pv==='Marimba'||P.pv==='Woodblock')P.filt=Math.min(+P.filt||2200,2200)}catch(e){}return r};   /* v0.6: Marimba Launches use a lower low-pass */
 const _wd=wood;wood=function(w){const T=TR[3],o=T.lv;T.lv=o*Math.pow(10,-9.5/20);   /* v0.5: the Marimba voice played ~10 dB above the other perc sounds at the same fader: now 7 dB down, and it follows the mood levels like the others */try{return _wd.apply(this,arguments)}finally{T.lv=o}}}
