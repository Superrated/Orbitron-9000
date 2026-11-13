
/* ---- v0.34: FLIGHT without stutters.
   (a) orbHeavy(fn): before heavy main-thread work the scheduler books ~0.3 s of notes ahead, so a short freeze can't make notes late.
   (b) Arming Steel drop / Noise sweep, Snare roll and the Ascent riser are pre-booked the same way on touch.
   (c) The drop hits are prepared ahead in idle time while Flight is open (and after a Launch or a tempo change), so arming them is instant.
   (d) Roll reverb and the gap gate are built once in idle time after the audio starts, not on the first roll.
   (e) [removed in v0.4 with the Funky claps pad] each clap tone was rendered once and replayed (17 audio nodes per clap → 3). ---- */
{let restoreT=0,saved=null;
 const preRoll=(s=.3)=>{try{if(!ctx||!playing)return;if(saved==null)saved=QOS.la;QOS.la=Math.max(QOS.la,s);try{tick()}catch(e){}clearTimeout(restoreT);restoreT=setTimeout(()=>{if(saved!=null){QOS.la=document.hidden?1.2:saved;saved=null}},900)}catch(e){}};
 window.orbPreRoll=preRoll;
 window.orbHeavy=fn=>{preRoll(.32);setTimeout(()=>{try{fn()}catch(e){console.warn('[orbitron] heavy',e)}},0)};
 const HEAVY=/^(Steel drop|Noise sweep|Snare roll|Ascent)/i;
 const hit=e=>{const b=e.target&&e.target.closest&&e.target.closest('#t-perf button, #t-perf .rz');if(b&&HEAVY.test((b.textContent||'').trim()))preRoll(.32)};
 document.addEventListener('pointerdown',hit,true);document.addEventListener('click',hit,true);
 const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:2000}):setTimeout(f,200);
 const flightOn=()=>{const t=document.querySelector('#t-perf');return !!(t&&isShown(t))};
 const prepDrops=()=>{if(!ctx||!window.orbPrepDrops||!flightOn())return;window.orbPrepDrops.forEach((f,i)=>setTimeout(()=>idle(()=>orbHeavy(f)),i*700))};
 let lastBpm=0,lastCtx=null,wasOn=false,PDAT=0;
 setInterval(()=>{try{if(!ctx)return;
   if(lastCtx!==ctx&&ctx.state==='running'){lastCtx=ctx;idle(()=>orbHeavy(()=>{try{window.rollVerb&&rollVerb()}catch(e){}try{window.gapGate&&gapGate()}catch(e){}}))}
   const on=flightOn();if(on&&(!wasOn||G.bpm!==lastBpm)){lastBpm=G.bpm;PDAT=performance.now()+(wasOn?4*16*60/G.bpm/4*1000:0)}if(on&&PDAT&&performance.now()>=PDAT){PDAT=0;prepDrops()}wasOn=on}catch(e){}},1000);   /* v0.5 perf: after a Launch the drop hits are prepared ~4 bars later, not in the busy moment right after it (arming a drop still prepares it at once) */
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{setTimeout(prepDrops,1500)}catch(e){}return r};
}
