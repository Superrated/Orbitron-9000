
/* ---- v0.5: 303 LEVEL ON LAUNCH — for about 4 bars after an acid Launch the acid bus measures the line and sets one correction
   (at most ±6 dB) so every acid Launch sits at the same level in the mix; then it freezes, so your own fader moves are never undone. ---- */
{const T0=.279;   /* v0.6: 303 about 1.5 dB more present */ const LV={trim:1,cal:null};window.orbAcidLvl=LV;
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(TR[4].p.mode==='Acid 303'&&!TR[4].m){LV.trim=1;LV.cal={t0:performance.now(),dur:Math.max(6000,4*4*60/G.bpm*1000),sum:0,n:0};
   if(window.__AB&&__AB.ctx===ctx)__AB.trim.gain.setTargetAtTime(1,ctx.currentTime,.05)}else LV.cal=null}catch(e){}return r};
 setInterval(()=>{try{const C=LV.cal,AB=window.__AB;if(!C||!playing||!AB||AB.ctx!==ctx||TR[4].m)return;const buf=METER.read(AB.an,1024);let ss=0;for(let i=0;i<1024;i++)ss+=buf[i]*buf[i];const rms=Math.sqrt(ss/1024);
   if(rms>.002){C.sum+=rms;C.n++}
   if(performance.now()-C.t0>C.dur&&C.n>=8){const m=C.sum/C.n,tr=Math.max(.5,Math.min(2,T0*(curMood==='Acid'?.9:1)/m));   /* Solar Flare: 303 a little lower (it's the main part there) */LV.trim=tr;LV.cal=null;AB.trim.gain.setTargetAtTime(tr,ctx.currentTime,1.2)}}catch(e){}},250)}
