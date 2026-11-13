
/* ---- v0.35: background pre-renders (drums, hats, perc, claps, drop sounds, the safety loop) run one at a time with a short pause in
   between, and wait a little longer while the app is under load — after a Launch they used to start all at once and could make a phone stutter.
   A short stutter in the first 10 s after a Launch no longer rebuilds the audio engine (that rebuild is what left Android's audio "suspended"). ---- */
{const O=window.OfflineAudioContext;if(O&&O.prototype.startRendering){const SR=O.prototype.startRendering;let busy=false,last=0;const q=[];
 const pump=()=>{if(busy||!q.length)return;const gap=(window.QOS&&((QOS.ml||0)>=2||(QOS.lvl||0)>=2))?200:40,wait=Math.max(0,last+gap-performance.now());
  if(wait>0){setTimeout(pump,wait);return}const j=q.shift();busy=true;let p;try{p=SR.call(j.c)}catch(e){busy=false;last=performance.now();j.no(e);pump();return}
  p.then(b=>{busy=false;last=performance.now();j.ok(b);pump()},e=>{busy=false;last=performance.now();j.no(e);pump()})};
 O.prototype.startRendering=function(){const c=this;return new Promise((ok,no)=>{q.push({c,ok,no});pump()})};
 window.orbRenderQ={len:()=>q.length+(busy?1:0)}}}
