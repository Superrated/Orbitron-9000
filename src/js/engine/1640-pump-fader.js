
/* ---- v0.24: PUMP — one fader for the sidechain pump on Mix → Channels, right under AIR (same look). It drives the existing
   Sidechain depth and Sidechain release together: left = no pump, right = deep pump with a longer, breathing release.
   It follows Launch (shows the mood's pump); double-tap returns to the mood's own value. The detailed sliders stay in Mix → FX. ---- */
{let D0=null;const show=v=>v<.02?'off':Math.round(v*100)+'%';
 const set=x=>{x=Math.max(0,Math.min(1,x));G.duck=+(x*.95).toFixed(3);G.rel=+(.08+.27*x).toFixed(3)};
 const place=()=>{const air=document.querySelector('#t-mix .airx');if(!air||document.querySelector('#t-mix .pmpx'))return;
  const w=document.createElement('div');w.className='spc pmpx';w.title='Sidechain pump: how much everything ducks under the kick. Right = deeper and longer. Double-tap = the mood’s own pump.';
  w.innerHTML='<div class="spt"><b>PUMP</b><span>sidechain · how much the mix breathes with the kick</span></div><div class="spr"><input type="range" min="0" max="1" step=".01"><b class="spv"></b></div>';
  const r=w.querySelector('input'),v=w.querySelector('.spv');v.style.whiteSpace='nowrap';v.style.minWidth='64px';v.style.textAlign='right';
  const sync=()=>{const x=Math.max(0,Math.min(1,(G.duck||0)/.95));if(document.activeElement!==r&&Math.abs(+r.value-x)>.004)r.value=x;const t=show(+r.value);if(v.textContent!==t)v.textContent=t};
  r.oninput=()=>{set(+r.value);v.textContent=show(+r.value)};r.ondblclick=()=>{if(D0){G.duck=D0[0];G.rel=D0[1]}sync()};w.__sync=sync;sync();air.after(w)};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);D0=[G.duck,G.rel];setTimeout(()=>{const w=document.querySelector('#t-mix .pmpx');w&&w.__sync&&w.__sync()},0);return r};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{place()}catch(e){}return r};
 try{place()}catch(e){}UI.on(()=>{try{place();const w=document.querySelector('#t-mix .pmpx');if(w&&w.offsetParent&&w.__sync)w.__sync()}catch(e){}});
 window.pumpSet=set}
