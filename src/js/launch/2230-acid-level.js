
/* ---- v0.76: 303 LEVEL — a fixed amount, +6.5 dB on the acid bus, so the 303 sits forward from its first note.
   Until v0.75 the acid bus measured the line for about 4 bars after an acid Launch and then set one correction (at most ±6 dB).
   That measurement always turned the 303 UP, by 2.7 to 6 dB (4 dB in the middle, over 15 acid Launches), so every acid line
   started too quiet and stepped up about four bars in. It now starts at its full level from the first note: the old middle correction
   plus 2.5 dB to sit further forward, and Solar Flare no longer holds it 1 dB back. No measuring, no timer; your Level fader is as before. ---- */
{const LV={trim:Math.pow(10,6.5/20),cal:null};window.orbAcidLvl=LV;
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(window.__AB&&__AB.ctx===ctx)__AB.trim.gain.setTargetAtTime(LV.trim,ctx.currentTime,.05)}catch(e){}return r}}
