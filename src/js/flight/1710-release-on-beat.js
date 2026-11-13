
/* ---- v0.24: risers and breakdowns release ON THE BEAT. Let go anywhere: the build holds and the drop (or the full groove coming back)
   lands on the next beat. Armed drop hits fire exactly on that beat too. Pressing again before the beat makes the pending release happen at once. ---- */
{let pend=null,pass=0;
 const zones=()=>[document.getElementById('riser'),...[...document.querySelectorAll('#t-perf>.rz')].map(p=>p.children[1])].filter(Boolean);
 const inZone=t=>zones().find(z=>z===t||z.contains(t));
 const flush=()=>{if(!pend)return;clearTimeout(pend.tm);const p=pend;pend=null;pass=1;try{p.tgt.dispatchEvent(new PointerEvent(p.type,{bubbles:true,cancelable:true,pointerId:p.id,clientX:p.x,clientY:p.y}))}finally{pass=0;window.__dropT=0}};
 const hold=e=>{if(pass||!playing||!ctx)return;const z=inZone(e.target);if(!z)return;if(pend)flush();
  const sd=sdur(),bt=4*sd,a=anchor(),now=ctx.currentTime;let wB=a+Math.ceil((now-a+.001)/bt)*bt;if(wB-now<.06)wB+=bt;
  e.stopImmediatePropagation();window.__dropT=wB;pend={tgt:e.target,type:e.type,id:e.pointerId,x:e.clientX,y:e.clientY,tm:setTimeout(flush,Math.max(0,(wB-now-(z.id==='riser'?.15:.04))*1000))}}; /* the main riser schedules its drop on the exact beat, so it can be told earlier */
 window.addEventListener('pointerup',hold,true);window.addEventListener('pointercancel',hold,true);
 window.addEventListener('pointerdown',e=>{if(pend&&inZone(e.target))flush()},true);
 const _f=fire;fire=function(k,w){if(k===0&&typeof w==='number'&&window.__kickHold){if(w<window.__kickHold-.005)return;window.__kickHold=0}return _f.apply(this,arguments)};
 window.orbDropTiming={pending:()=>!!pend,flush}}
