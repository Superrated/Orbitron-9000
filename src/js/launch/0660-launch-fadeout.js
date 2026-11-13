/* ---- v80: Launch fades out the previous groove's ringing voices and effect tails quickly (~0.25 s) instead of letting them ring on ---- */
{function fadeOld(){if(!ctx||!playing)return;const now=ctx.currentTime,T=.25,alive=new Set(),ring=s=>!(s.__e===Infinity||!(s.__e>now+.3)||s.__s>now+.01);let loose=false;
  for(const s of QOS.src)if(ring(s)){if(s.__v)alive.add(s.__v);else loose=true}
  // each ringing voice fades at the point where it enters the mix (its routeTrack connection), then its sources stop
  for(let i=0;i<VON;i++){const n=VOn[i];if(!n||n.context!==ctx)continue;const v=VOv[i];if(!(v?alive.has(v):loose&&VOt[i]>now-8))continue;const dd=VOd[i];VOn[i]=VOd[i]=null;
   try{n.disconnect(dd)}catch(e){continue}try{const fg=ctx.createGain();fg.gain.setValueAtTime(1,now);fg.gain.linearRampToValueAtTime(0,now+T);n.connect(fg);fg.connect(dd)}catch(e){}}
  for(const s of QOS.src)if(ring(s)&&s.__v&&alive.has(s.__v))try{s.stop(now+T+.02)}catch(e){}
  // effect tails: cut feedback and returns briefly, then bring them back for the new groove
  const dip=(prm,back)=>{if(!prm)return;try{prm.cancelScheduledValues(now);prm.setValueAtTime(prm.value,now);prm.linearRampToValueAtTime(0,now+T);prm.setValueAtTime(0,now+T+.05);prm.linearRampToValueAtTime(back,now+T+.6)}catch(e){}};
  return dip}
 const _g80=generate;generate=function(){const dip=fadeOld();const r=_g80.apply(this,arguments);
  if(dip){dip(A.dF&&A.dF.gain,G.fb);dip(A.rO&&A.rO.gain,G.rev);if(A.sh)dip(A.sh.gain,G.shim||0);if(SHM.fb)dip(SHM.fb.gain,SHM.fb.gain.value);
   // flush the reverb tails once their outputs are down (re-setting a convolver's buffer clears what it holds)
   setTimeout(()=>{if(playing)return; /* v0.22 stability: never reload a reverb while playing (the dip above already fades the old tails) */[A.rcv,SHM.cv].forEach(cv=>{try{if(cv&&cv.buffer){const b=cv.buffer;cv.buffer=null;cv.buffer=b}}catch(e){}})},280)}return r}}
