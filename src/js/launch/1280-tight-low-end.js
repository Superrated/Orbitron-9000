
/* v176: tight, low kick + bass + rumble in every mood. Kick decay capped (0.45; Deep Space 0.55) — its pitch already snaps to the key
   inside 41–60 Hz. Bass decay capped (0.3; Breaks 0.45) and Gate at most 0.6, so notes stop before the next kick. The bass bus ducks at
   least 65% under every kick (pads/leads keep the mood's own sidechain). Rumble gets a 40 Hz low cut so its sub doesn't pile up. */
{const KD={'Deep Space':.55},BD={Breaks:.45};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const K=TR[0].p,B=TR[6].p;
   K.dec=Math.min(K.dec,KD[curMood]||.45);B.dec=Math.min(B.dec,BD[curMood]||.3);if((B.bgt||0)>.6)B.bgt=.6;
   setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0)}catch(e){}return r};
 const _d=duck;duck=function(t){_d.apply(this,arguments);try{if(TR[0].m)return;const du=Math.max(0,Math.min(.95,G.duck+.4*mv("Sidechain depth",t)));
   if(du<.65){A.dkb.gain.cancelScheduledValues(t);A.dkb.gain.setValueAtTime(.35,t);A.dkb.gain.setTargetAtTime(1,t+G.rel*.12,G.rel*.38)}}catch(e){}};
 let RH=null;const rhp=()=>{if(!ctx||!A.rg||!A.rdk)return;if(RH&&RH.context===ctx)return;RH=ctx.createBiquadFilter();RH.type='highpass';RH.frequency.value=40;RH.Q.value=.6;
   try{A.rg.disconnect(A.rdk)}catch(e){}A.rg.connect(RH);RH.connect(A.rdk)};
 const _f=fire;fire=function(k,w){if(k===0&&!(RH&&RH.context===ctx))try{rhp()}catch(e){}return _f.apply(this,arguments)}}
