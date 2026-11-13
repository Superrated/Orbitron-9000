
/* v181: (2) ducked reverb — the reverb tail dips about 3 dB under every kick (on top of the synth-bus sidechain) and under each lead note,
   then blooms back in the gaps. (3) cleaner, louder master — a transparent peak clipper between the mood saturator and the limiter
   (linear up to ~-2.5 dBFS, rounds off only the peaks above, 4x oversampled), the saturator oversampled 4x, a slightly gentler limiter,
   and Master+'s final limiter (when Master+ is off) acts as a ceiling at -0.5 dBFS so nothing clips. No new controls. */
{let RV=null,PC=null,SC=null;
 const kneeCurve=(t,ceil)=>{const n=4096,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1,a=Math.abs(x);c[i]=Math.sign(x)*(a<=t?a:t+(ceil-t)*Math.tanh((a-t)/(ceil-t)))}return c};
 function mkMaster(){if(!ctx)return;
  if(A.rcv&&A.rO&&!(RV&&RV.context===ctx)){RV=ctx.createGain();try{A.rcv.disconnect(A.rO)}catch(e){}A.rcv.connect(RV);RV.connect(A.rO)}
  if(A.clip&&A.lim&&!(PC&&PC.context===ctx)){PC=ctx.createWaveShaper();PC.curve=kneeCurve(.75,.97);PC.oversample='none';try{A.clip.disconnect(A.lim)}catch(e){}A.clip.connect(PC);PC.connect(A.lim);
   try{A.clip.oversample='2x';A.lim.attack.value=.002;A.lim.release.value=.12}catch(e){}}}
 const dip=(t,to,back,tc)=>{if(!RV)return;const g=RV.gain;g.cancelScheduledValues(t);g.setTargetAtTime(to,t,.006);g.setTargetAtTime(1,t+back,tc)};
 const _d=duck;duck=function(t){_d.apply(this,arguments);try{dip(t,.7,.02,60/G.bpm/4*.45)}catch(e){}};
 const _f=fire;fire=function(k,w){if(!(RV&&RV.context===ctx&&PC&&PC.context===ctx))try{mkMaster()}catch(e){console.warn('[orbitron] master',e)}
  const r=_f.apply(this,arguments);try{if(k===4&&!TR[4].m&&RV){const P=TR[4].p,len=Math.max(.08,Math.min(.5,(P.sus>.01?(P.hold||1)*60/G.bpm/4:(P.dec||.25))));dip(w||ctx.currentTime,.7,len,.12)}}catch(e){}return r};
 window.masterFX=()=>({RV,PC,SC:true})}
