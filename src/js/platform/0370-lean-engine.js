/* ---- v40: lean engine — batched dial redraws, one rebuild per Generate, no lead compressor, shorter reverbs on phones/Eco, stronger default shedding on phones, calmer GPU, flight diagnostics ---- */
{const mob=matchMedia('(pointer:coarse)').matches||(navigator.hardwareConcurrency||8)<=4,qual=()=>{try{return localStorage.getItem('orb-q')||'Eco'}catch(e){return 'Eco'}},lean=()=>qual()==='Eco'||qual()==='Survival'||(mob&&qual()==='Auto'); /* perf 13: Eco uses the 1.4 s reverb again */
 QOS.lateTot=0;QOS.fl0=QOS.floor||0;
 const tierFloor=()=>{const q=qual();return q==='Survival'?2:q==='Eco'?1:q==='Hi-fi'?0:mob?1:0}; /* perf 13 */QOS.floor=tierFloor();
 if(mob)QOS.la=.3;document.addEventListener('visibilitychange',()=>{QOS.la=document.hidden?1.2:(mob?.3:.2)});
 // reverb impulse lengths per tier (set once the audio engine exists)
 const _init40=init;init=function(){const nw=!ctx;_init40();if(!nw)return;if(lean()){try{A.rcv.buffer=ir2(qual()==='Survival'?1.1:qual()==='Eco'?1.4:1.8,.02);A.rmc.buffer=irM(ir(.8,1.6,.06))}catch(e){}}};
 // batched step-dial redraws (one timer instead of ~90 per second)
 setInterval(()=>{if(!ctx||!DQ.length)return;const now=ctx.currentTime+.01;let i=0;const sh=!$('#t-drums').hidden||!$('#t-synth').hidden; /* perf 4: ring playheads are only drawn while a card page is on screen */while(i<DQ.length&&DQ[i][2]<=now){const [T,s]=DQ[i];if(playing&&sh)draw(T,s);i++}if(i)DQ.splice(0,i);if(!playing)DQ.length=0},33);
 // one rebuild per task, however many wrappers ask for it
/* (v40: the rebuild is deferred to a microtask and coalesced — now part of build() itself) */;
 // count late scheduler steps for diagnostics
 const _t40=tick;tick=function(){if(ctx&&nextT<ctx.currentTime)QOS.lateTot++;_t40()};
 // calmer GPU on phones / Eco
 const st=document.createElement('style');st.textContent='.ticker{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:rgba(2,8,6,.96)!important}body.lean::before{animation:none!important;will-change:auto!important}';document.head.appendChild(st);
 const setLean=()=>{document.body.classList.toggle('lean',lean());QOS.floor=tierFloor()};setLean();
 // quality changes re-apply tier settings
 document.addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('#t-mix')&&['Auto','Eco','Survival','Hi-fi'].includes(e.target.value))setTimeout(setLean,0)});
 // flight diagnostics in Mission control
 const _mx40=mix;mix=function(){_mx40();const m=$('#mix'),d=document.createElement('div');d.id='diag';d.style.cssText='grid-column:1/-1;font:600 11px ui-monospace,monospace;color:#7fffc4;border:1px solid rgba(0,255,156,.25);padding:8px 10px;line-height:1.6;white-space:pre-wrap';m.appendChild(d)};
 let lt0=0,lastT=performance.now();
 setInterval(()=>{const d=$('#diag');if(!d||!isShown(d))return;const now=performance.now(),dt=(now-lastT)/1000;lastT=now;const late=QOS.lateTot-lt0;lt0=QOS.lateTot;
  const lat=ctx?Math.round(((ctx.baseLatency||0)+(ctx.outputLatency||0))*1000):0,ps=ctx&&ctx.playbackStats;
  let tx=d.querySelector('.dtx');if(!tx){tx=document.createElement('div');tx.className='dtx';[...d.childNodes].forEach(n=>{if(n.nodeType===3)n.remove()});d.prepend(tx)}const dtxt='FLIGHT DIAGNOSTICS\n'+'core level   '+QOS.nm[QOS.lvl]+(QOS.floor?'  (floor '+QOS.nm[QOS.floor]+')':'')+'\n'+'voices       '+(QOS.eco2?QOS.voices()+' / 64':QOS.src.size)+'\n'+'audio load   '+(QOS.load?Math.round(QOS.load*100)+'%':'n/a on this browser')+'\n'+'late steps   '+late+' /s'+(late?'  ← sequencer can\'t keep up':'')+'\n'+'screen       '+Math.round(1000/Math.max(8,QOS.ft))+' fps'+'\n'+'latency      '+(lat?lat+' ms (actual)':'n/a')+(ps&&ps.underrunEvents!=null?'\nunderruns    '+ps.underrunEvents:'')+'\n'+'mode         '+qual()+(mob?' · phone':'')+(lean()?' · lean':'');if(tx.textContent!==dtxt)tx.textContent=dtxt},1000)}
gb.onclick=()=>{generate();try{if(!playing)toggle()}catch(e){}};$("#rnd").before(gb);
