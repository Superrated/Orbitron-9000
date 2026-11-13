
/* ---- v0.22: BASS macro fader on Flight, under LEAD. Centre = the bass exactly as set (manual edits included). Left = tight: shorter, darker, less resonance.
   Right = squelch: longer notes, brighter cutoff, more filter envelope, more resonance (capped so it stays round), a hint of slide; level compensated.
   Springs back to the centre when released; a tap glides to the spot in about 250 ms. Only bends existing bass parameters while a note is made. ---- */
{const BM={x:0,raf:0};let dep=0;
 const bend=fn=>function(){if(dep||Math.abs(BM.x)<.01)return fn.apply(this,arguments);const B=TR[6],P=B.p,x=BM.x,
   o={dec:P.dec,bgt:P.bgt,bsus:P.bsus,cut:P.cut,envA:P.envA,res:P.res,bsl:P.bsl,lv:B.lv};dep=1;const n={};
  try{const lf=x<0?Math.pow(2,1.3*x):Math.pow(2,1.7*x);P.dec=Math.max(.04,Math.min(1.8,(P.dec||.13)*lf));
   if(x<0){if(P.bgt>0)P.bgt=Math.max(.08,P.bgt*lf)}else{if(P.bgt>0)P.bgt=Math.min(1,P.bgt+(1-P.bgt)*x);const s0=P.bsus||0,s1=Math.max(s0,.8*x);P.bsus=s1;if(s1>s0){const lv=v=>v<.05?1:Math.max(.25,.7-.5*v);B.lv=B.lv*lv(s1)/lv(s0)}} // long side: Sustain + legato
   const q=x<0?x:x*x; /* squelch comes in late: a quarter at half-way, full at the end */
   P.cut=Math.max(60,Math.min(6000,(P.cut||500)*Math.pow(2,q)));P.envA=Math.max(0,(P.envA||0)*(1+.5*q));
   const r0=P.res||1;if(x<0)P.res=Math.max(.5,r0*(1+.5*x));else{const top=Math.max(r0,9);P.res=Math.min(top,r0+5*q)}
   if(x>0){P.bsl=Math.min(.6,(P.bsl||0)+.3*Math.max(0,(x-.5)/.5));B.lv=B.lv/(1+.35*q)}
   Object.keys(o).forEach(k=>n[k]=(k==='lv'?B:P)[k]);return fn.apply(this,arguments)}
  finally{dep=0;Object.keys(o).forEach(k=>{const t=k==='lv'?B:P;if(t[k]!==n[k])return;/* something else wrote it meanwhile (breakdown, edit): keep that */if(o[k]===undefined)delete t[k];else t[k]=o[k]})}};
 {const _f=fire;fire=function(k){return k===6?bendF.apply(this,arguments):_f.apply(this,arguments)};const bendF=bend(_f)}
 {const _a=arrStep;arrStep=bend(_a)}
 const lst=[...document.querySelectorAll('style')].find(t=>t.textContent.includes('.lmx .lmt'));
 if(lst){const st=document.createElement('style');st.textContent=lst.textContent.replace(/\.lmx/g,'.bmx')+`
 /* LEAD + BASS share one row and the low-pass look: same header type, rounded track, pill knob, one accent colour */
 .mxp{padding:8px 12px 10px!important}
 .mxrow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 .mxrow>.lmx,.mxrow>.bmx{margin:0;min-width:0}
 .mxrow .lmh{display:flex;align-items:baseline;gap:8px;margin:0 0 6px;font-size:11px;letter-spacing:.12em;white-space:nowrap}
 .mxrow .lmh span{font-family:inherit;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--acc,#ffe44d)}
 .mxrow .lmh small{flex:0 1 auto;overflow:hidden;text-overflow:ellipsis;opacity:.55;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:inherit}
 .mxrow .lmh b{margin-left:auto;min-width:0;font-size:10.5px;font-weight:700;letter-spacing:.06em;opacity:.7;color:inherit;text-align:right}
 .mxrow .lmt{height:38px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,255,156,.10));overflow:hidden;cursor:ew-resize}
 .mxrow .lmc{background:rgba(255,255,255,.18)}
 .mxrow .lmf{background:rgba(255,228,77,.16)}
 .mxrow .lmk{top:3px;bottom:3px;width:18px;margin-left:-9px;border-radius:6px;background:var(--acc,#ffe44d);box-shadow:none;will-change:left}.mxrow .lmf{will-change:left,width}
 .mxrow .lmt i{top:50%;bottom:auto;transform:translateY(-50%);font-size:9px;letter-spacing:.14em;opacity:.45;pointer-events:none}
 .mxrow .lmt i:first-of-type{left:10px!important}.mxrow .lmt i:last-of-type{right:10px!important}
 @media (max-width:700px){.mxrow .lmh small{display:none}.mxrow .lmh b{font-size:10px}}
 @media (max-width:640px){body #t-perf>.rz>div{height:clamp(34px,calc((100dvh - 790px)/2),118px)!important}}
 @media (max-width:640px) and (max-height:780px){.mxp{padding:6px 10px!important}.mxrow>.lmx,.mxrow>.bmx{position:relative}
  .mxrow .lmh{position:absolute;left:12px;right:12px;top:50%;transform:translateY(-50%);margin:0;z-index:2;pointer-events:none}
  .mxrow .lmh span{opacity:.8}.mxrow .lmt i{display:none}}`;document.head.appendChild(st)}
 let el=null,lastX=null;const show=()=>{if(!el)return;const x=BM.x;if(lastX!==null&&Math.abs(x-lastX)<.002)return;lastX=x;const k=el.querySelector('.lmk'),f=el.querySelector('.lmf'),b=el.querySelector('b');
   k.style.left=((x+1)/2*100)+'%';f.style.left=(x<0?(x+1)/2*100:50)+'%';f.style.width=(Math.abs(x)/2*100)+'%';
   b.textContent=Math.abs(x)<.01?'AS SET':(x<0?'TIGHT ':'LONG ')+Math.round(Math.abs(x)*100)+'%'};
 const glideBack=()=>{cancelAnimationFrame(BM.raf);const x0=BM.x,t0=performance.now(),D=2500;const step=t=>{const p=Math.min(1,(t-t0)/D),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;BM.x=x0*(1-e);show();if(p<1)BM.raf=requestAnimationFrame(step);else{BM.x=0;show()}};BM.raf=requestAnimationFrame(step)};
 const add=()=>{if(document.querySelector('.bmx'))return;const lm=document.querySelector('.lmx');if(!lm)return;
  el=document.createElement('div');el.className='bmx';
  el.innerHTML='<div class="lmh"><span>BASS</span><small>length · filter · squelch</small><b>AS SET</b></div><div class="lmt" title="Drag left for tight, dark bass plucks; right for long held notes (Sustain + legato), brighter and squelchier, with a little slide. It stays where you leave it; double-tap to go back to AS SET."><div class="lmc"></div><div class="lmf"></div><div class="lmk"></div><i style="left:4px">TIGHT</i><i style="right:4px">LONG</i></div>';
  /* own panel right under the low-pass panel (the low-pass header is laid over its track on short phones, so nothing else may live in that panel) */
  let row=lm.parentElement;if(!row.classList.contains('mxrow')){const lp=lm.closest('.lpf')||lm.parentElement,pn=document.createElement('div');pn.className='panel mxp';
   row=document.createElement('div');row.className='mxrow';pn.appendChild(row);lp.after(pn);row.appendChild(lm)}
  row.appendChild(el);const tr=el.querySelector('.lmt');let on=0,tg=0,lt=0;
  const sm=t=>{const dt=Math.min(50,t-(lt||t));lt=t;BM.x+=(tg-BM.x)*(1-Math.exp(-dt/70));if(Math.abs(tg-BM.x)<.002)BM.x=tg;show();
    if(on||BM.x!==tg)BM.raf=requestAnimationFrame(sm);else BM.raf=0};
  const at=e=>{const r=tr.getBoundingClientRect();tg=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width)*2-1))};
  tr.addEventListener('pointerdown',e=>{e.preventDefault();cancelAnimationFrame(BM.raf);try{window.orbWake&&orbWake()}catch(_){}tr.setPointerCapture(e.pointerId);on=1;at(e);lt=0;BM.raf=requestAnimationFrame(sm)});
  tr.addEventListener('pointermove',e=>{if(on)at(e)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{if(!on)return;on=0}));
  let lt2=0;tr.addEventListener('pointerup',()=>{const n=performance.now();if(n-lt2<300){tg=0;lt=0;cancelAnimationFrame(BM.raf);BM.raf=requestAnimationFrame(sm)}lt2=n});show()}; // v0.22: BASS holds where you leave it; double-tap = back to AS SET
 add();UI.on(()=>{try{add()}catch(e){}});BM.reset=()=>{cancelAnimationFrame(BM.raf);BM.raf=0;BM.x=0;lastX=null;show()};window.bassMacro=BM}
