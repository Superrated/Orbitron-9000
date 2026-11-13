
/* ---- perf 7: the shimmer reverb's 2.5 s impulse (≈100 ms of maths, ≈400 ms on a slow phone) was computed the first time a mood used shimmer —
   in the middle of a Launch. It is now prepared in idle time a few seconds after the engine starts. ---- */
{const _i=init;init=function(){const nw=!ctx;const r=_i.apply(this,arguments);if(nw&&ctx){const go=()=>{try{if(typeof SHM!=='undefined'&&!SHM.on&&!SHM.irb&&window.ir2)(window.orbHeavy||(f=>f()))(()=>{if(!SHM.irb)SHM.irb=ir2(2.5,.03)})}catch(e){}};
  setTimeout(()=>{window.requestIdleCallback?requestIdleCallback(go,{timeout:4000}):go()},3000)}return r}}
