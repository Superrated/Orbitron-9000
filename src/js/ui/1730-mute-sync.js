
/* ---- v0.25: mute buttons always show the real mute state — synced on their own (the visuals loop skips frames when Visuals are Off
   or the engine is under load, which left the buttons stale after a Launch) ---- */
{let last='';const sync=()=>{try{const st=TR.map(T=>T.m?1:0).join('');if(st===last)return;last=st;
  TR.forEach((T,k)=>{if(typeof pads!=='undefined'&&pads[k])pads[k].classList.toggle('off',!!T.m);if(T.mb)T.mb.classList.toggle('m',!!T.m)});
  document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('m',!!TR[+b.dataset.k].m))}catch(e){}};
 window.orbMuteSync=()=>{last='';sync()};setInterval(sync,120);
 document.addEventListener('click',()=>setTimeout(sync,0),true);
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);last='';sync();setTimeout(window.orbMuteSync,60);setTimeout(window.orbMuteSync,400);return r};
 BUILD.hooks.push({post(){last='';setTimeout(sync,0)}})}
