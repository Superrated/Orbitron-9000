/* ---- v90: stability guards — one failing voice can't stall the sequencer, a worker-driven clock that keeps running when the tab is in the background, auto-resume of a suspended audio engine, catch-up after timer stalls, and a NaN watchdog that flushes the effect loops ---- */
{const ERR={n:0,last:''};window.ORB_ERR=ERR;const note=(where,e)=>{ERR.n++;ERR.last=where+': '+(e&&e.message||e);if(ERR.n<=5)console.warn('[orbitron]',ERR.last)};
 const guard=(name,fn)=>function(){try{return fn.apply(this,arguments)}catch(e){note(name,e)}};
 fire=guard('voice',fire);pad=guard('pad',pad);arrStep=guard('step',arrStep);
 // tick: if anything still throws, move one step on so the sequencer never sticks on the same step
 const _tick=tick;tick=function(){try{_tick()}catch(e){note('tick',e);try{nextT+=60/G.bpm/4;tk++}catch(x){}}};
 // worker clock: browsers throttle page timers in background tabs, a worker's timer keeps ticking
 let wk=null;try{const src='let t=null;onmessage=e=>{if(e.data==="go"){if(!t)t=setInterval(()=>postMessage(0),25)}else{clearInterval(t);t=null}}';wk=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));wk.onmessage=()=>{if(playing&&ctx)tick()}}catch(e){wk=null}
 const _toggle=toggle;toggle=function(){const r=_toggle.apply(this,arguments);if(wk){if(playing){clearInterval(timer);wk.postMessage('go')}else wk.postMessage('stop')}return r};$('#play').onclick=toggle;
 // longer lookahead while hidden, so timer hiccups don't leave gaps
 document.addEventListener('visibilitychange',()=>{if(typeof QOS!=='undefined'){if(document.hidden){QOS._la=QOS.la;QOS.la=Math.max(QOS.la,.6)}else if(QOS._la){QOS.la=QOS._la;QOS._la=null}}});
 // watchdog: resume a suspended context, catch up after a stall, flush NaN out of the feedback loops
 let wa=null,wb=null,bad=0;METER.every(4,()=>{if(!ctx||!playing)return;
  if(ctx.state==='suspended'||ctx.state==='interrupted'){ctx.resume().catch(()=>{});ERR.resumes=(ERR.resumes||0)+1}
  const sd=60/G.bpm/4;if(nextT<ctx.currentTime-.5){const skip=Math.ceil((ctx.currentTime+.05-nextT)/sd);nextT+=skip*sd;tk+=skip;ERR.catchups=(ERR.catchups||0)+1}
  if(A.lp){const nan=METER.post().nan;
   if(nan){bad++;if(ERR.lastFlush&&Date.now()-ERR.lastFlush<6000&&bad>=2){bad=0;ERR.lastFlush=0;(window.orbReset?window.orbReset():hardReset('NaN persisted'));return}if(bad>=2){bad=0;ERR.lastFlush=Date.now();ERR.nanResets=(ERR.nanResets||0)+1;note('audio','NaN in mix — flushing effects');const n=ctx.currentTime;
     [A.dF&&A.dF.gain,SHM.fb&&SHM.fb.gain].forEach(p=>{if(!p)return;const v=p.value;p.cancelScheduledValues(n);p.setValueAtTime(0,n);p.setValueAtTime(isFinite(v)?v:0,n+1.6)});
     [A.rcv,SHM.cv,A.rvb].forEach(cv=>{try{if(cv&&cv.buffer){const b=cv.buffer;cv.buffer=null;cv.buffer=b}}catch(e){}});
     [A.lp.frequency,A.lp.Q,A.hp.frequency].forEach(p=>{try{p.cancelScheduledValues(n)}catch(e){}});A.lp.frequency.setValueAtTime(20000,n);A.lp.Q.setValueAtTime(.7,n);A.hp.frequency.setValueAtTime(10,n)}}else bad=0}});
 // full engine rebuild: close the audio context and build a fresh one, keeping the groove
 window.hardReset=w=>hardReset(w);
 function hardReset(why){note('audio','engine rebuilt ('+why+')');ERR.rebuilds=(ERR.rebuilds||0)+1;const was=playing;if(was)toggle();
  try{ctx.close()}catch(e){}ctx=null;['se','gap','rvb','rvbG','dwob','ladder'].forEach(k=>{delete A[k]});SHM.on=0;delete SHM.cv;delete SHM.fb;
  for(const k in PWC)delete PWC[k];ORW=null;VWC={};for(const k in MWC)delete MWC[k];PWT=null;try{QOS.src.clear()}catch(e){}wa=null;wb=null;
  init();setTimeout(()=>{if(was&&!playing)toggle()},120)}
 window.orbReset=()=>hardReset('manual');window.orbResetWhy=w=>hardReset(w);
 {const add=()=>{const g=document.querySelector('#t-mix .eng');if(!g||g.querySelector('.rst'))return;const b=document.createElement('button');b.className='pad rst';b.style.cssText='grid-column:1/-1;min-height:44px';b.textContent='Reset audio engine';b.onclick=()=>hardReset('manual');g.appendChild(b)};add();UI.on(add)}
 // show it in the diagnostics readout
 setInterval(()=>{const d=$('#diag');if(!d||!isShown(d))return;let x=d.querySelector('.stab');if(!x){x=document.createElement('div');x.className='stab';x.style.cssText='margin-top:6px;font-size:11px;opacity:.85';d.appendChild(x)}
  const sx=`stability · errors ${ERR.n}${ERR.last?' ('+ERR.last.slice(0,60)+')':''} · resumes ${ERR.resumes||0} · catch-ups ${ERR.catchups||0} · NaN resets ${ERR.nanResets||0} · rebuilds ${ERR.rebuilds||0} · silences ${ERR.silences||0} · clock ${wk?'worker':'page'} · audio ${ctx?ctx.state:'-'}`;if(x.textContent!==sx)x.textContent=sx},1000)}
