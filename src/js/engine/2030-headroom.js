
/* ---- v0.35: HEADROOM. A slow level keeper on the mix bus holds the summed mix around −1 dBFS peak before the mastering stage
   (so about 6 dB clear of the master saturator), in every mood. It moves slowly (down ≤1 dB/s, up ≤0.3 dB/s), stays within −7…+2 dB,
   and never lifts quiet passages on purpose (breakdowns, the Flight low-pass, stops). The mastering stage's loudness loop restores the level. ---- */
{const H={ctx:null,hist:[],db:0};window.orbHeadroom=H;
 METER.every(1,()=>{try{if(!ctx||ctx.state!=='running'||!playing||!A.m||A.m.context!==ctx||(window.DR&&DR.rendering))return;
  if(H.ctx!==ctx){H.ctx=ctx;H.hist=[];H.db=0}
  const p=METER.mix().peak;if(!isFinite(p))return;
  H.hist.push(p);if(H.hist.length>16)H.hist.shift();if(H.hist.length<6)return;           // ≈4 s window of 250 ms reads
  const base=.8*Math.pow(10,H.db/20);if(A.m.gain.value<base*.75)return;                    // a start or safety fade is running
  const pk=Math.max(...H.hist),raw=pk>0?20*Math.log10(pk/Math.pow(10,H.db/20)):-90;       // peak before the keeper
  const lp=window.LOWPASS&&LOWPASS.get&&LOWPASS.get()<.95;let tgt=-1-raw;tgt=Math.max(-7,Math.min(2,tgt));
  if(tgt>H.db&&(raw<-9||lp))return;                                                       // quiet on purpose: don't lift
  const st=tgt<H.db?Math.max(tgt-H.db,-.25):Math.min(tgt-H.db,.075);if(Math.abs(st)<.02)return;H.db+=st;
  A.m.gain.setTargetAtTime(.8*Math.pow(10,H.db/20),ctx.currentTime,.2)}catch(e){}})}
