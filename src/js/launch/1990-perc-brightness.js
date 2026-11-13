
/* ---- v0.34: the newer perc sounds (Conga, Cowbell/rim, Marimba) are kept from getting too bright on Launch: the Perc filter
   (low-pass) is capped per sound, a little higher in bright moods. Only ever lowers the filter; the ride is left as it is.
   v0.83: Cowbell (the rim sound) darker: cap 2800–3900 → 1900–2700 Hz, no bright-mood lift; Cowbell and Marimba get at least 0.3 reverb send so they
   sit in the room with the other drums instead of on top (they sounded too bright and unglued). ---- */
{const CAP={Conga:[3200,4400],Cowbell:[1900,2700],Marimba:[3000,4200]},BR=new Set(['Hopeful','Italo','Dreamy','Ethereal','Melodic House','Vector','Breaks','Bleep']);
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const T=TR[3],P=T.p,c=CAP[P.pv];if(c&&!T.m){const v=Math.round((c[0]+R()*(c[1]-c[0]))*(BR.has(curMood)&&P.pv!=='Cowbell'?1.2:1));
   if(!(P.filt>0)||P.filt>v)P.filt=v;if((P.pv==='Cowbell'||P.pv==='Marimba')&&!(P.rs>=.3))P.rs=.3;setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},80)}}catch(e){}return r}}
