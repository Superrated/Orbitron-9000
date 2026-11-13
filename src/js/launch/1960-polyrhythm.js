
/* ---- v0.33: a little more polyrhythm after every Launch — the family drum programming resets rings to 16 steps, so when no
   track runs another length, perc or the dub stab (sometimes the hats in the groovy moods) gets a 7-, 10-, 11-, 12-, 13- or 14-step ring. ---- */
{const ST={3:[12,14,10,7,11,13],8:[12,14,10],1:[12,14]},GR=new Set(['Groove Techno','Temporal','Bleep','Vector','Breaks','Melodic House']);
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const act=[1,3,4,8].filter(k=>TR[k]&&!TR[k].m);
   if(!act.some(k=>TR[k].st!==16)&&R()<.12){const c=[3,8].concat(GR.has(curMood)?[1]:[]).filter(k=>TR[k]&&!TR[k].m&&TR[k].h>0);
    if(c.length){const k=pick(c),T=TR[k],st=pick(ST[k]);T.h=Math.max(1,Math.min(st-1,Math.round(T.h*st/16)||1));T.st=st;T.r=Math.floor(R()*st);T.pt=pat(T)}}}catch(e){}return r}}
