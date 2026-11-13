
/* ---- v0.5: FIRST LIGHT rebalance — the lead (often a wide saw stack) took over: lead and arps a little lower, pad a touch lower ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(curMood!=='Hopeful')return r;const L=TR[4],P=TR[5];
  if(!L.m&&L.p.mode!=='Acid 303')L.lv=+((L.lv||.45)*.85).toFixed(3);if(!P.m)P.lv=+((P.lv||.5)*.9).toFixed(3);setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){}return r}}
