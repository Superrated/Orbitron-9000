/* ---- v80: Launch fades out the previous groove's ringing voices and effect tails quickly (~0.25 s) instead of letting them ring on
   v0.8: SHORT CROSSFADE — the handover now happens on the new groove's first beat (launch/1690 builds the groove just before the bar line;
   window.__launchAt is that bar line). Old notes that still ring there fade out over about one beat on a smooth curve while the new groove
   starts. Reverb, shimmer and echo no longer drop to silence (that left a small gap): their returns only dip a little and the echo
   feedback is cut harder, so old echoes die away quickly, then everything comes back to the new groove's settings over two beats. ---- */
{const FADE=(()=>{const n=33,a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=Math.cos(i/(n-1)*Math.PI/2);a[n-1]=0;return a})();   // equal-power fade-out
 function fadeOld(){if(!ctx||!playing)return null;const now=ctx.currentTime,at=Math.max(now,window.__launchAt||0),T=Math.min(.7,Math.max(.3,60/G.bpm)),
   alive=new Set(),ring=s=>s.__e!==Infinity&&s.__e>at+T*.5&&s.__s<=at+.01;let loose=false;
  for(const s of QOS.src)if(ring(s)){if(s.__v)alive.add(s.__v);else loose=true}
  // each ringing voice fades at the point where it enters the mix (its routeTrack connection), then its sources stop
  for(let i=0;i<VON;i++){const n=VOn[i];if(!n||n.context!==ctx)continue;const v=VOv[i];if(!(v?alive.has(v):loose&&VOt[i]>now-8))continue;const dd=VOd[i];VOn[i]=VOd[i]=null;
   try{n.disconnect(dd)}catch(e){continue}try{const fg=ctx.createGain();fg.gain.setValueAtTime(1,at);fg.gain.setValueCurveAtTime(FADE,at,T);n.connect(fg);fg.connect(dd);if(v)orbVEX(fg,v)}catch(e){try{n.connect(dd)}catch(x){}}}
  for(const s of QOS.src)if(ring(s)&&s.__v&&alive.has(s.__v))try{s.stop(at+T+.02)}catch(e){}
  // effect returns: remember where they are now; after the new groove is built, dip them gently at the bar line
  const P=[[A.dF&&A.dF.gain,.2,()=>G.fb],[A.rO&&A.rO.gain,.55,()=>G.rev],[A.sh&&A.sh.gain,.5,()=>G.shim||0],[SHM.fb&&SHM.fb.gain,.5,null]].filter(x=>x[0]).map(x=>[x[0],x[1],x[2],x[0].value]);
  return ()=>{const b2=2*60/G.bpm;for(const[prm,depth,nv,old]of P){try{const back=nv?nv():prm.value,o=isFinite(old)?old:back,n2=ctx.currentTime;
    prm.cancelScheduledValues(n2);prm.setValueAtTime(o,n2);if(at>n2+.005)prm.setValueAtTime(o,at);prm.linearRampToValueAtTime(Math.min(o,back)*depth,at+T);prm.linearRampToValueAtTime(back,at+T+b2)}catch(e){}}}}
 const _g80=generate;generate=function(){const dip=fadeOld();const r=_g80.apply(this,arguments);
  if(dip){dip();
   // flush the reverb tails once their outputs are down (re-setting a convolver's buffer clears what it holds)
   setTimeout(()=>{if(playing)return; /* v0.22 stability: never reload a reverb while playing (the dip above already fades the old tails) */[A.rcv,SHM.cv].forEach(cv=>{try{if(cv&&cv.buffer){const b=cv.buffer;cv.buffer=null;cv.buffer=b}}catch(e){}})},280)}return r}}
