/* ---- quick win 1: one screen rebuild per Launch. The Launch layers called build() ~24 times, syncMix() ~6 and lfoUI() ~3 times; each call also queued
   a dozen follow-up UI jobs. While a Launch runs, those calls are now collected and done once at its end. Sound is unchanged. ---- */
{let inGen=0;const want={};const hold=n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(){if(inGen){want[n]=1;return}return f.apply(this,arguments)}};
 hold('build');hold('lfoUI');hold('syncMix');
 const _g=generate;generate=function(){inGen++;try{return _g.apply(this,arguments)}finally{inGen--;if(!inGen){for(const n of ['syncMix','build','lfoUI'])if(want[n]){want[n]=0;try{window[n]()}catch(e){console.warn('[orbitron] launch '+n,e)}}}}}}
