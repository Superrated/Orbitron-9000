
/* ---- v0.35: HEADROOM. A slow level keeper on the mix bus holds the summed mix around −1 dBFS peak before the mastering stage
   (so about 6 dB clear of the master saturator), in every mood. It moves slowly (down ≤1 dB/s, up ≤0.3 dB/s), stays within −7…+2 dB,
   and never lifts quiet passages on purpose (breakdowns, the Flight low-pass, stops). The mastering stage's loudness loop restores the level. ---- */
/* v0.79: A FIXED START LEVEL PER MOOD. Measured over 6 Launches of every mood: each one started 2–3 dB hot and then slid down over the
   first ten seconds while this keeper found its place (it ended 2 to 6 dB down, depending on the mood). The keeper now starts where that
   mood settles (HS, dB; a touch above the measured value, so it only ever has a little left to do), set as the Launch is made and when the
   audio engine starts — the level is right from bar 1 and nothing new moves while you play. */
{const HS={Dark:-3.5,Melancholic:-3,'Melodic House':-3,Dreamy:-2.5,Tense:-4.5,'Deep Space':-1.5,Ethereal:-3.5,Hopeful:-4.5,Noir:-4,Drone:-3,Acid:-2.5,Power:-3.5,Italo:-4.5,Breaks:-3.5,Bleep:-3,'Distorted Electro':-3,Ambient:-3.5,'Groove Techno':-4.5,Vector:-2.5,Temporal:-4,Polymeter:-4.5,Chug:-5},H={ctx:null,hist:[],db:0};window.orbHeadroom=H;
 const start=()=>{H.db=HS[curMood]!=null?HS[curMood]:-3.5;H.hist=[];try{if(ctx&&A.m&&A.m.context===ctx){const v=.8*Math.pow(10,H.db/20),t=ctx.currentTime;
   if(ctx.state!=='running'||!playing)A.m.gain.value=v;else if(A.m.gain.value>=.4)A.m.gain.setTargetAtTime(v,t,.08)}}catch(e){}};H.start=start;   /* a start or safety fade in progress is left alone; the keeper takes over after it. v1.0: H.start lets a Sector load of another mood start where that mood settles */
 {const _g=generate;generate=function(){const r=_g.apply(this,arguments);start();return r}}
 METER.every(1,()=>{try{if(!ctx||ctx.state!=='running'||!playing||!A.m||A.m.context!==ctx||(window.DR&&DR.rendering))return;
  if(H.ctx!==ctx){H.ctx=ctx;start()}
  const p=METER.mix().peak;if(!isFinite(p))return;
  H.hist.push(p);if(H.hist.length>16)H.hist.shift();if(H.hist.length<6)return;           // ≈4 s window of 250 ms reads
  const base=.8*Math.pow(10,H.db/20);if(A.m.gain.value<base*.75)return;                    // a start or safety fade is running
  const pk=Math.max(...H.hist),raw=pk>0?20*Math.log10(pk/Math.pow(10,H.db/20)):-90;       // peak before the keeper
  const lp=window.LOWPASS&&LOWPASS.get&&LOWPASS.get()<.95;let tgt=-1-raw;tgt=Math.max(-7,Math.min(2,tgt));
  if(tgt>H.db&&(raw<-9||lp))return;                                                       // quiet on purpose: don't lift
  const st=tgt<H.db?Math.max(tgt-H.db,-.25):Math.min(tgt-H.db,.075);if(Math.abs(st)<.02)return;H.db+=st;
  A.m.gain.setTargetAtTime(.8*Math.pow(10,H.db/20),ctx.currentTime,.2)}catch(e){}})}
