
/* ---- v0.22: calmer pads from Launch — with the Ensemble chorus the unison detune stays at most 8 cents (the chorus already widens),
   and pad auto-pan is kept to 35 % so pads move gently instead of floating across the room. Hand edits are not limited. ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const P=TR[5].p;if(P.mov==='Ensemble'&&P.det>8)P.det=8;if((P.apan||0)>.35)P.apan=.35;setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){}return r}}
