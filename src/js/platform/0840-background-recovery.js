/* ---- v127: Back-from-background recovery (phones). Leaving the app / locking the screen starves the page; on return:
   away ≥ 2 s while playing → fresh audio engine (groove kept) ~0.35 s after the page is visible again;
   shorter → resume + resync only. Either way the load guard's "late" flags from the starved period are cleared and ignored for 3 s,
   so it does not thin the groove after you come back. If Android keeps audio blocked, the next tap anywhere restarts it. ---- */
{let hidAt=0,pend=0,grace=0;
 const calm=()=>{try{QOS.late=0;QOS.ml=0;QOS.mc=0;QOS.lvl=Math.max(QOS.floor||0,QOS.stageFloor||0);QOS.cool=0}catch(e){}};
 setInterval(()=>{if(grace&&performance.now()<grace)calm();else grace=0},100);
 const gone=()=>{if(!hidAt)hidAt=performance.now();clearTimeout(pend);pend=0};
 const back=()=>{if(document.hidden||!hidAt)return;const away=(performance.now()-hidAt)/1000;hidAt=0;grace=performance.now()+3000;calm();
  if(!ctx||!playing)return;try{if(ctx.state!=='running')ctx.resume().catch(()=>{})}catch(e){}
  let ph=false;try{ph=matchMedia('(pointer:coarse)').matches&&(navigator.maxTouchPoints||0)>0}catch(e){}
  if(away>=2&&ph){clearTimeout(pend);pend=setTimeout(()=>{pend=0;if(document.hidden||!playing)return;
    try{window.orbResetWhy?orbResetWhy('back after '+Math.round(away)+' s away'):orbReset()}catch(e){}grace=performance.now()+3000;calm();
    setTimeout(()=>{try{if(ctx&&ctx.state!=='running'){ctx.resume().catch(()=>{});armTap()}}catch(e){}},600)},350)}
  else{const sd=60/G.bpm/4,now=ctx.currentTime;if(nextT<now+.03){const k=Math.ceil((now+.06-nextT)/sd);nextT+=k*sd;tk+=k}}};
 let tapArmed=0;function armTap(){if(tapArmed)return;tapArmed=1;const f=()=>{tapArmed=0;document.removeEventListener('pointerdown',f,true);try{if(ctx&&ctx.state!=='running')ctx.resume()}catch(e){}};document.addEventListener('pointerdown',f,true);
  try{if(typeof say==='function')say('▲ TAP ANYWHERE TO RESUME AUDIO')}catch(e){}}
 document.addEventListener('visibilitychange',()=>{document.hidden?gone():back()});
 window.addEventListener('pagehide',gone);window.addEventListener('pageshow',back);document.addEventListener('freeze',gone);document.addEventListener('resume',back);
 window.__bgRecover={gone,back}}

