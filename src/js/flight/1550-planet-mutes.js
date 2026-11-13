
/* ---- v0.22: Planet mutes (Flight): hold a pad to solo that track; let go and every mute is back as it was. A short tap still mutes.
   A mute you change while holding (other pad, Launch) is kept. ---- */
{const HOLD=380;let held=-1,saved=null,forced=null,swallow=false,tmr=0;
 const start=k=>{try{window.SOLO&&SOLO.off()}catch(e){}held=k;if(window.TMUTE)TMUTE.solo(k);else{saved=TR.map(T=>!!T.m);forced=TR.map((T,i)=>i!==k);TR.forEach((T,i)=>T.m=forced[i])}pads.forEach((p,i)=>p.classList.toggle('hsolo',i===k));try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}};
 const end=()=>{clearTimeout(tmr);tmr=0;if(held<0)return;if(window.TMUTE)TMUTE.solo(null);else TR.forEach((T,i)=>{if(forced&&T.m===forced[i])T.m=saved[i]});held=-1;saved=forced=null;pads.forEach(p=>p.classList.remove('hsolo'))};
 pads.forEach((p,k)=>{if(!p||p.dataset.hs)return;p.dataset.hs=1;
  p.addEventListener('pointerdown',e=>{if(e.button>0)return;clearTimeout(tmr);swallow=false;tmr=setTimeout(()=>{tmr=0;swallow=true;start(k)},HOLD)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>p.addEventListener(n,end));p.addEventListener('pointerleave',()=>{if(held<0){clearTimeout(tmr);tmr=0}});
  p.addEventListener('click',e=>{if(swallow){swallow=false;e.stopImmediatePropagation();e.preventDefault()}},true);
  p.addEventListener('contextmenu',e=>e.preventDefault());p.title='Tap: mute · hold: solo';
  p.addEventListener('pointerdown',e=>{try{p.setPointerCapture(e.pointerId)}catch(_){}})});
 window.addEventListener('blur',end);document.addEventListener('visibilitychange',()=>{if(document.hidden)end()});
 const _g=generate;generate=function(){if(held>=0){clearTimeout(tmr);held=-1;saved=forced=null;try{window.TMUTE&&TMUTE.solo(null)}catch(e){}pads.forEach(p=>p.classList.remove('hsolo'))}return _g.apply(this,arguments)};
 const st=document.createElement('style');st.textContent='#pads .pad{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:manipulation}#pads .pad.hsolo{box-shadow:0 0 0 2px var(--acc,#ffe44d),0 0 12px rgba(255,228,77,.55)!important;opacity:1!important}';document.head.appendChild(st);
 window.holdSolo={state:()=>held}}
