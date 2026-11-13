
/* ---- v0.22: master Air (Mix → Bus & FX, next to Glue). A wide, gentle high shelf above ~10 kHz before the glue compressor and limiter:
   right = more openness and sheen, left = warmer and closer. ±4 dB, smoothed so it can move while playing. Launch never changes it. ---- */
{if(G.air==null)G.air=0;
 window.airSet=(db,now)=>{G.air=Math.max(-4,Math.min(4,+db||0));if(!ctx||!A.air)return;const t=ctx.currentTime,[a1,a2]=A.air;
  if(now){a1.gain.value=G.air*.4;a2.gain.value=G.air*.6;return}a1.gain.setTargetAtTime(G.air*.4,t,.05);a2.gain.setTargetAtTime(G.air*.6,t,.05)};
 /* v0.22: lives on Mix → Channels as a strip between SPACE and DRUM BUS (same look) */
 const fmt=v=>Math.abs(v)<.05?'0 dB':(v>0?'+':'')+v.toFixed(1)+' dB';
 const place=()=>{const sp=[...document.querySelectorAll('#t-mix .spc')].find(e=>!e.classList.contains('dbx')&&!e.classList.contains('airx'));if(!sp||document.querySelector('#t-mix .airx'))return;
  const w=document.createElement('div');w.className='spc airx';w.title='Master air: a wide high shelf above ~10 kHz, before the glue and limiter. Right = more open and airy, left = warmer and closer. Double-tap for 0.';
  w.innerHTML='<div class="spt"><b>AIR</b><span>master openness · wide shelf above 10 kHz</span></div><div class="spr"><input type="range" min="-4" max="4" step=".1"><b class="spv"></b></div>';
  const r=w.querySelector('input'),v=w.querySelector('.spv');r.value=G.air||0;v.textContent=fmt(+r.value);
  v.style.whiteSpace='nowrap';v.style.minWidth='64px';v.style.textAlign='right';r.oninput=()=>{airSet(+r.value);v.textContent=fmt(+r.value)};r.ondblclick=()=>{r.value=0;airSet(0);v.textContent=fmt(0)};sp.after(w)};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{place()}catch(e){}return r};
 try{place()}catch(e){}UI.on(()=>{try{place()}catch(e){}})}
