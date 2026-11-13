
/* ---- v0.5: GRAVITY ASSIST a little less hot: bus clip, grit and rumble capped slightly lower, kick less driven, more cut around 280 Hz ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(curMood!=='Groove Techno')return r;
  G.clip=Math.min(+G.clip||0,.38);G.bgrit=Math.min(+G.bgrit||0,.18);G.rumble=Math.min(+G.rumble||0,.22);const K=TR[0].p;K.drive=Math.min(+K.drive||0,2.5);
  setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){}return r}}
