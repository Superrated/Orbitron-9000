
/* ---- v1.0: NO SCROLLING ON FLIGHT (phones). While Flight is open on a phone the page is locked: it cannot scroll or bounce, so a drag on a
   riser, breakdown or fader never turns into a page scroll. To make everything fit, the credit line is hidden there and the riser /
   breakdown pads take exactly the height that is left (34–130 px each, measured, instead of a fixed guess that had gone stale as faders were
   added). If the screen is too small to fit everything even with the smallest pads, scrolling stays on, so no control is out of reach. ---- */
/* v1.01: shorter phones (about 640–700 px of screen, e.g. with the browser bars showing) also fit now: when the smallest pads are not
   enough, a "tight" step trims a few pixels everywhere — gaps, tab buttons, panel padding, Thruster / Mute button height, riser pads down
   to 28 px. Same layout, same controls; only below roughly 610 px does scrolling come back. */
{const mq=matchMedia('(max-width:640px)'),css=document.createElement('style');
 css.textContent='html.fnl,html.fnl body{overflow:hidden!important;overscroll-behavior:none;height:100%}html.fnl body{padding-bottom:0!important}'+
  'html.fns .credit,html.fnl .credit{display:none}html.fns #t-perf,html.fnl #t-perf{padding-bottom:26px!important}'+   /* 26 px: the Mission Control line at the bottom */
  'html.fns body #t-perf>.rz>div,html.fnl body #t-perf>.rz>div{height:var(--rzh,34px)!important}'+
  'html.fnl #t-perf{touch-action:none}'+
  'html.fnt #t-perf{gap:4px!important}html.fnt #tabs{margin-bottom:5px!important;padding-top:2px!important;padding-bottom:2px!important}'+
  'html.fnt #tabs button{height:32px!important;min-height:0!important;padding-top:0!important;padding-bottom:0!important}'+
  'html.fnt #t-perf>.panel:not(.rz){padding-top:6px!important;padding-bottom:6px!important}html.fnt #t-perf>.panel h2{margin-bottom:4px!important}'+
  'html.fnt #t-perf .flw-thr .pad{height:36px!important;min-height:0!important;font-size:9px!important;letter-spacing:0!important;padding:2px 3px!important}html.fnt #t-perf .flw-mut .pad{height:26px!important;min-height:0!important}';
 document.head.appendChild(css);
 const R=document.documentElement;let last='';
 const fit=()=>{const P=document.querySelector('#t-perf'),on=mq.matches&&P&&!P.hidden;
  if(!on){if(last){last='';R.classList.remove('fnl','fns','fnt');R.style.removeProperty('--rzh')}return}
  const pads=P.querySelectorAll(':scope>.rz>div');if(!pads.length)return;
  const key=innerWidth+'x'+innerHeight+'|'+P.childElementCount+'|'+P.scrollHeight;if(key===last)return;
  /* measure with the smallest pads and scrolling allowed, then hand the spare height to the two rows of pads */
  R.classList.remove('fnl','fnt');R.classList.add('fns');R.style.setProperty('--rzh','34px');if(scrollY)scrollTo(0,0);
  const rows=new Set([...pads].map(d=>Math.round(d.getBoundingClientRect().top))).size||1;
  let lo=34,spare=innerHeight-P.getBoundingClientRect().bottom;
  if(spare<0){R.classList.add('fnt');lo=28;R.style.setProperty('--rzh','28px');spare=innerHeight-P.getBoundingClientRect().bottom}   /* tight step */
  if(spare>=0){R.style.setProperty('--rzh',Math.max(lo,Math.min(130,Math.floor(lo+spare/rows)))+'px');R.classList.add('fnl');R.classList.remove('fns')}
  last=innerWidth+'x'+innerHeight+'|'+P.childElementCount+'|'+P.scrollHeight};
 const go=()=>{try{fit()}catch(e){console.warn('[orbitron] flight no-scroll',e)}};
 UI.on(go);addEventListener('resize',go);mq.addEventListener&&mq.addEventListener('change',go);document.addEventListener('click',()=>setTimeout(go,0),true);go();setTimeout(go,600)}
