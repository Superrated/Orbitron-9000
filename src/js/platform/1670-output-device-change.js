
/* ---- v0.24 stability: an audio output change (headphones in or out, a Bluetooth speaker connecting or dropping) while playing:
   the engine is checked a moment later, resumed if the browser paused it, and the step clock is put back on the grid so nothing bursts.
   The Engine page shows whether the screen is being kept awake. ---- */
{const fix=why=>{if(!ctx||!playing)return;try{if(ctx.state!=='running')ctx.resume().catch(()=>{})}catch(e){}
  const sd=60/G.bpm/4,now=ctx.currentTime;if(nextT<now+.03){const k=Math.ceil((now+.06-nextT)/sd);nextT+=k*sd;tk+=k}
  setTimeout(()=>{try{if(playing&&ctx&&ctx.state!=='running'){ctx.resume().catch(()=>{});window.orbOverlay&&orbOverlay('The audio output changed ('+why+'). Tap to start the sound again.')}}catch(e){}},900)};
 try{navigator.mediaDevices&&navigator.mediaDevices.addEventListener&&navigator.mediaDevices.addEventListener('devicechange',()=>setTimeout(()=>fix('device change'),300))}catch(e){}
 const hook=()=>{try{if(ctx&&!ctx.__sk&&'onsinkchange' in ctx){ctx.__sk=1;ctx.addEventListener('sinkchange',()=>setTimeout(()=>fix('output switched'),200))}}catch(e){}};setInterval(hook,2000);
 setInterval(()=>{const d=document.querySelector('#diag');if(!d||!isShown(d))return;let x=d.querySelector('.wkx');if(!x){x=document.createElement('div');x.className='wkx';x.style.cssText='margin-top:2px;font-size:11px;opacity:.85';d.appendChild(x)}
  const t='screen kept awake · '+(window.orbWakeState?orbWakeState():'?');if(x.textContent!==t)x.textContent=t},1000)}
