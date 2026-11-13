/* ---- v128: Phones pause when you leave the app (other app/tab, screen locked) and resume when you return, on a fresh audio engine.
   Desktop keeps playing in the background. Stopping by hand before leaving means it stays stopped. ---- */
{const phone=()=>{try{return matchMedia('(pointer:coarse)').matches&&(navigator.maxTouchPoints||0)>0}catch(e){return false}};
 let bgPaused=0,busy=0;const tell=t=>{try{if(typeof say==='function')say(t)}catch(e){}};
 const leave=()=>{if(bgPaused||!phone()||!ctx||!playing)return;bgPaused=1;try{toggle()}catch(e){}try{ctx.suspend()}catch(e){}tell('⏸ PAUSED · app in background')};
 const ret=()=>{if(document.hidden||!bgPaused||busy)return;busy=1;setTimeout(()=>{busy=0;if(document.hidden||!bgPaused)return;bgPaused=0;
   try{if(window.orbResetWhy)orbResetWhy('resumed after background pause')}catch(e){}
   try{if(!playing)toggle()}catch(e){}tell('▶ RESUMED');
   setTimeout(()=>{try{if(ctx&&ctx.state!=='running'){ctx.resume().catch(()=>{});const f=()=>{document.removeEventListener('pointerdown',f,true);try{ctx.resume()}catch(e){}};document.addEventListener('pointerdown',f,true);tell('▲ TAP ANYWHERE TO RESUME AUDIO')}}catch(e){}},600)},250)};
 document.addEventListener('visibilitychange',()=>{document.hidden?leave():ret()});
 window.addEventListener('pagehide',leave);document.addEventListener('freeze',leave);window.addEventListener('pageshow',ret);document.addEventListener('resume',ret);
 window.__bgPause={leave,ret,state:()=>bgPaused}}

