
/* ---- perf 12: visuals step down by themselves when the engine is under load: normal frame rate when NOMINAL, ≤24 fps at LOAD (already),
   12 fps at SAVING and 6 fps at OVERLOAD or right after audio underruns; full speed returns when the load is gone. ---- */
{let lf=0,ur=0,lastU=0;const ps=()=>{try{return ctx&&ctx.playbackStats?ctx.playbackStats.underrunEvents||0:null}catch(e){return null}};
 setInterval(()=>{const u=ps();if(u!=null){if(u>lastU)ur=performance.now()+3000;lastU=u}},500);
 const _v=viz;viz=function(){const n=performance.now(),lv=Math.max(QOS.lvl||0,QOS.ml||0),cap=n<ur||lv>=3?6:lv>=2?12:0;if(cap&&n-lf<1000/cap){requestAnimationFrame(viz);return}lf=n;return _v()}}
