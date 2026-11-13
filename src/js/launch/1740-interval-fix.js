
/* ---- v0.26: lead generator fix — Interval mode with almost no Spread got stuck on one note; it now always walks a little ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const P=TR[4].p;if(P.mode==='Interval'&&!(P.spread>=.3))P.spread=+(.3+R()*.15).toFixed(2)}catch(e){}return r}}
