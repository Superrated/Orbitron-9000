
/* ---- v0.22 stability: overload guard. Twice a second the audio clock is compared with real time (and the browser's underrun counter is read
   where it exists). If the audio falls behind, load is shed in stages, one stage per event: 1 = visuals paused, 2 = effects lighter
   (shimmer off, engine at SAVING), 3 = fewest voices (engine at OVERLOAD). It stays light until you stop.
   v0.8: a Launch no longer snaps straight back to full quality (that put the full load back on a struggling phone at the busiest moment):
   after a Launch the guard eases off one stage every 8 s without new trouble. ---- */
{const OV={stage:0,n:0,last:0};let la=0,lr=0,cum=0,hist=[],ur=null;
 const esc=why=>{const n=performance.now();OV.n++;if(n-OV.last<3000||OV.stage>=3)return;OV.last=n;OV.stage++;
  if(why!=='raise'&&why!=='test'){try{window.orbSafety&&orbSafety.warn&&orbSafety.warn(OV.stage>=3?'overload':'strain')}catch(e){}} /* v0.8: tells the safety lifeboat (platform/1700) */
  try{if(OV.stage>=2&&A.sh&&ctx)A.sh.gain.setTargetAtTime(0,ctx.currentTime,.1)}catch(e){}
  try{if(typeof say==='function')say('⚠ AUDIO OVERLOAD · '+['','VISUALS PAUSED','EFFECTS LIGHTER','FEWER VOICES'][OV.stage])}catch(e){}};
 const floorFor=st=>st>=3?3:st>=2?2:0;
 const ease=()=>{if(!OV.stage)return;OV.ease=performance.now()+8000};
 const stepDown=()=>{OV.stage--;OV.ease=OV.stage?performance.now()+8000:0;
  if(OV.stage<2){try{if(A.sh&&ctx)A.sh.gain.setTargetAtTime(G.shim||0,ctx.currentTime,.3)}catch(e){}}
  if(OV.f0!=null){QOS.floor=Math.max(OV.f0,floorFor(OV.stage));if(!OV.stage)OV.f0=null}};
 const clear=()=>{OV.ease=0;if(OV.stage>=2){try{if(A.sh&&ctx)A.sh.gain.setTargetAtTime(G.shim||0,ctx.currentTime,.1)}catch(e){}}if(OV.f0!=null){QOS.floor=OV.f0;OV.f0=null}OV.stage=0;hist=[];cum=0;la=0};
 setInterval(()=>{if(!ctx||!playing||document.hidden||ctx.state!=='running'){la=0;hist=[];cum=0;return}
  let ps=null;try{ps=ctx.playbackStats}catch(e){}
  if(ps&&ps.underrunEvents!=null){ /* two underruns within 15 s = one event (a single blip, e.g. right at start, is ignored) */
   if(ur!=null&&ps.underrunEvents>ur){const n=performance.now();if(OV.u1&&n-OV.u1<15000){OV.u1=0;esc('underrun')}else OV.u1=n}ur=ps.underrunEvents}
  else{const a=ctx.currentTime,r=performance.now()/1000;if(la){cum+=(r-lr)-(a-la);hist.push(cum);if(hist.length>8)hist.shift();
    if(hist.length===8){const m1=Math.min(...hist.slice(0,4)),m2=Math.min(...hist.slice(4));if(m2-m1>.1){hist=[];cum=0;esc('clock')}}}
   la=a;lr=r}
  if(OV.ease&&performance.now()>OV.ease&&performance.now()-OV.last>8000)stepDown();
  if(OV.stage>=2&&A.sh)try{A.sh.gain.setTargetAtTime(0,ctx.currentTime,.1)}catch(e){}
  const f=OV.stage>=3?3:OV.stage>=2?2:0;if(f&&(QOS.floor||0)<f){if(OV.f0==null)OV.f0=QOS.floor||0;QOS.floor=f}},500);
 const _vz=viz;viz=function(){if(OV.stage>=1&&playing){setTimeout(()=>requestAnimationFrame(viz),400);return}return _vz()};
 const _dr=draw;draw=function(T,s){if(OV.stage>=1&&playing&&s>=0)return;return _dr.apply(this,arguments)};
 /* a Launch can block the page for a few hundred ms on a phone: schedule 0.6 s of notes first, so nothing arrives late or in a burst */
 /* v0.7: the cushion adapts to the device. Each Launch is timed (the whole busy stretch: building the groove, rebuilding the cards, the first
    follow-up jobs); the next Launch schedules about 1.3x that far ahead — never less than the old 0.6 s, never more than 1.2 s — so a slow phone
    that needs longer than 0.6 s no longer runs out of scheduled notes. Fast devices measure well under 0.46 s and behave exactly as before. */
 /* v0.8: every Launch is timed (also when stopped) and the figure is kept between sessions (orb-lblk), so even the first Launch of a session
    knows this device; with no figure yet, a phone assumes 300 ms */
 let LBLK=0;try{LBLK=+localStorage.getItem('orb-lblk')||(matchMedia('(pointer:coarse)').matches?300:0)}catch(e){}window.orbLaunchBlock=()=>LBLK;
 /* v0.8: an in-time Launch (the button while playing) books its own cushion up to the bar line (launch/1690), but is timed here too, so that
    cushion fits the device. */
 const _g=generate;generate=function(){if(playing)ease();else clear();const live=playing&&ctx&&!document.hidden,t0=performance.now();
  if(live&&!window.__inTime){const o=QOS.la;try{QOS.la=Math.max(o,Math.min(1.2,Math.max(.6,LBLK*1.3/1000)));tick()}catch(e){}finally{QOS.la=o}}
  if(!document.hidden)setTimeout(()=>{if(document.hidden)return;const dt=Math.min(2000,performance.now()-t0);LBLK=Math.max(dt,LBLK*.7);try{localStorage.setItem('orb-lblk',Math.round(LBLK))}catch(e){}},0)   // the slowest recent Launch counts; it eases off again over a few quicker ones
  return _g.apply(this,arguments)};
 const _t=toggle;toggle=function(){const r=_t.apply(this,arguments);if(!playing)clear();else if(ctx){const o=QOS.la;try{QOS.la=Math.max(o,.8);tick()}catch(e){}finally{QOS.la=o}} /* starting: the engine finishes building right after this; have 0.8 s scheduled */return r};try{$('#play').onclick=toggle}catch(e){}
 setInterval(()=>{const d=document.querySelector('#diag');if(!d||!isShown(d))return;let x=d.querySelector('.ovl');if(!x){x=document.createElement('div');x.className='ovl';x.style.cssText='margin-top:4px;font-size:11px;opacity:.85';d.appendChild(x)}
  const t='overload guard · events '+OV.n+' · '+['full quality','visuals paused','effects lighter','fewest voices'][OV.stage];if(x.textContent!==t)x.textContent=t},1000);
 /* v0.8: raise(n) lifts the guard to at least stage n (used by the safety lifeboat, platform/1700) */
 const raise=n=>{while(OV.stage<Math.min(3,n)){OV.last=0;esc('raise')}};
 window.orbGuard={state:()=>OV,test:()=>esc('test'),clear,raise,ease}}
