
/* ---- perf 3: card fader/menu sync (syncFaders) was run synchronously several times per Launch (~14 ms each on desktop, ~60 ms on a slow phone)
   even when no card is on screen. Now: calls in the same moment are merged into one, and while Drums/Synths are hidden the sync waits until you open them. ---- */
{const vis=()=>['#t-drums','#t-synth'].some(q=>{const e=document.querySelector(q);return e&&!e.hidden});let dirty=0,queued=0;const real=window.syncFaders;
 const run=()=>{queued=0;if(!vis()){dirty=1;return}dirty=0;try{real()}catch(e){}};
 window.syncFaders=function(){if(!queued){queued=1;setTimeout(run,0)}};
 document.addEventListener('click',()=>setTimeout(()=>{if(dirty&&vis())run()},0),true);
 /* the Mix page (all its faders) was rebuilt on every Launch too; now only when it is on screen, otherwise when you open it */
 const mv=()=>{const e=document.querySelector('#t-mix');return e&&!e.hidden};let md=0,mq=0;const realMix=syncMix;
 const mrun=()=>{mq=0;if(!mv()){md=1;return}md=0;try{realMix()}catch(e){}};
 syncMix=function(){if(!mq){mq=1;setTimeout(mrun,0)}};
 document.addEventListener('click',()=>setTimeout(()=>{if(md&&mv())mrun()},0),true)}
