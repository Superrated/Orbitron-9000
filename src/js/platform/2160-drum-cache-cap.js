
/* ---- v0.4: the pre-rendered drum hits (kick, snare, clap, fixed perc) are capped at 60 variants, oldest dropped first, like the other
   sound caches — before, every new drum variant from a Launch stayed in memory for the whole set. ---- */
{try{const C=window.DR&&DR.cache;if(C&&!C.__cap){const set=C.set.bind(C);C.set=function(k,v){const r=set(k,v);while(C.size>60)C.delete(C.keys().next().value);return r};C.__cap=1}}catch(e){}}
