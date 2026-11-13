
/* ---- v0.91: PERFORMANCE TEST — a button under Mix → Engine → Flight diagnostics. It lets the groove play for 60 s and counts what
   you would hear as stutters on THIS device: dropouts (underruns) reported by the browser, time the audio clock lost against the
   real clock (each dropout makes the audio fall behind), engine load (average and peak), late sequencer steps, screen frame rate and the longest freeze of the page.
   The result is a short text with a Copy button, to compare settings (quality, buffer, visuals) or to send along with a report.
   Nothing here touches the audio path: it only reads counters, four times a second. ---- */
{const SECS=60,BUILD='0.91';let run=null;
 const ls=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}},ms=x=>Math.round(x*1000),pct=x=>Math.round(x*100)+'%';
 const stats=()=>{try{return ctx&&ctx.playbackStats||null}catch(e){return null}};
 const device=()=>{const u=navigator.userAgent,m=/\(([^)]+)\)/.exec(u),b=/(Edg|OPR|SamsungBrowser|Firefox|CriOS|Chrome|Version)\/([\d.]+)/.exec(u);
  return (m?m[1]:'?')+' · '+(b?b[1]+' '+b[2].split('.')[0]:'?')+' · '+(navigator.hardwareConcurrency||'?')+' cores'+(navigator.deviceMemory?' · '+navigator.deviceMemory+' GB':'')};
 const start=out=>{if(run)return;try{if(!playing)toggle()}catch(e){}if(!ctx){out('Press Play first.');return}
  const c=ctx,ps=stats(),r=run={c,t0:performance.now(),a0:c.currentTime,u0:ps&&ps.underrunEvents!=null?ps.underrunEvents:null,d0:ps&&ps.underrunDuration!=null?ps.underrunDuration:null,
   late0:QOS.lateTot||0,ld:0,ldN:0,ldMax:0,pk:0,ur:0,fps:0,fpsN:0,fpsMin:999,lvl:0,vo:0,gap:0,last:performance.now(),dr:[],reset:false,rc:null,fast:0,slow:0};
  /* engine load straight from the browser (average, peak, share of dropped blocks), when it offers that */
  try{if(c.renderCapacity){r.rc=e=>{r.ld+=e.averageLoad||0;r.ldN++;r.ldMax=Math.max(r.ldMax,e.averageLoad||0);r.pk=Math.max(r.pk,e.peakLoad||0);r.ur=Math.max(r.ur,e.underrunRatio||0)};c.renderCapacity.addEventListener('update',r.rc)}}catch(e){}
  r.fast=setInterval(()=>{const n=performance.now();if(!document.hidden)r.gap=Math.max(r.gap,n-r.last-50);r.last=n},50);   /* longest freeze of the page */
  r.slow=setInterval(()=>{const n=performance.now(),el=(n-r.t0)/1000;if(ctx!==c)r.reset=true;
   if(QOS.ft){const f=1000/Math.max(8,QOS.ft);r.fps+=f;r.fpsN++;r.fpsMin=Math.min(r.fpsMin,f)}r.lvl=Math.max(r.lvl,QOS.lvl||0);r.vo=Math.max(r.vo,QOS.src.size);
   if(!r.reset)r.dr.push(el-(c.currentTime-r.a0));
   if(el>=SECS||!playing)finish(out);else out('PERFORMANCE TEST  '+Math.round(el)+' / '+SECS+' s …  keep the app on screen')},250);
  out('PERFORMANCE TEST  0 / '+SECS+' s …')};
 const finish=out=>{const r=run;if(!r)return;run=null;clearInterval(r.fast);clearInterval(r.slow);try{r.rc&&r.c.renderCapacity.removeEventListener('update',r.rc)}catch(e){}
  const el=(performance.now()-r.t0)/1000,ps=(()=>{try{return r.c.playbackStats||null}catch(e){return null}})(),c=r.c;
  /* the audio clock moves in buffer-sized steps: compare the lowest reading of the first and of the last 2 s, so those steps do not count */
  const mn=a=>a.length?Math.min.apply(null,a):0,lost=r.dr.length>=16?mn(r.dr.slice(-8))-mn(r.dr.slice(0,8)):0;
  const u=r.u0!=null&&ps?ps.underrunEvents-r.u0:null,ud=r.d0!=null&&ps?ps.underrunDuration-r.d0:null,late=(QOS.lateTot||0)-r.late0;
  const L=['ORBITRON PERFORMANCE TEST · build '+BUILD+' · '+Math.round(el)+' s'+(el<SECS-1?' (stopped early)':''),
   'device      '+device(),
   'settings    quality '+ls('orb-q','Eco')+' · buffer '+((window.orbPerf&&orbPerf.buf())||'?')+' · visuals '+((window.orbPerf&&orbPerf.vis())||'?'),
   'groove      '+(typeof MN==='function'?MN(curMood):curMood)+' · '+Math.round(G.bpm)+' bpm · most voices '+r.vo,
   'latency     buffer '+ms(c.baseLatency||0)+' ms + output '+ms(c.outputLatency||0)+' ms · '+c.sampleRate+' Hz',
   'dropouts    '+(u==null?'not reported by this browser':u+(ud!=null?' · '+ms(ud)+' ms of silence':''))+(r.ur?' · worst second '+pct(r.ur)+' dropped':''),
   'clock lost  '+Math.max(0,ms(lost))+' ms'+(r.reset?' · ENGINE RESTARTED during the test':''),
   'engine load '+(r.ldN?'average '+pct(r.ld/r.ldN)+' · worst second '+pct(r.ldMax)+' · peak '+pct(r.pk):'not reported by this browser'),
   'late steps  '+late+' · core level up to '+QOS.nm[r.lvl],
   'screen      '+(r.fpsN?Math.round(r.fps/r.fpsN)+' fps average · lowest '+Math.round(r.fpsMin):'n/a')+' · longest freeze '+Math.round(r.gap)+' ms'];
  out(L.join('\n'),true)};
 const ui=()=>{const d=$('#diag');if(!d||d.querySelector('.ptest'))return;const w=document.createElement('div');w.className='ptest';w.style.cssText='margin-top:8px';
  const b=document.createElement('button'),cp=document.createElement('button'),o=document.createElement('div');b.type=cp.type='button';
  b.textContent='▶ PERFORMANCE TEST · '+SECS+' s';cp.textContent='COPY RESULT';cp.hidden=true;
  [b,cp].forEach(x=>x.style.cssText='font:inherit;color:inherit;background:transparent;border:1px solid rgba(0,255,156,.45);border-radius:6px;padding:6px 10px;margin:0 8px 6px 0;cursor:pointer');
  o.style.cssText='white-space:pre-wrap;user-select:text;-webkit-user-select:text';
  const out=(t,done)=>{o.textContent=t;cp.hidden=!done;b.disabled=!done&&!!run;b.style.opacity=b.disabled?.5:1};
  b.onclick=()=>start(out);
  cp.onclick=()=>{const t=o.textContent,ok=()=>{cp.textContent='COPIED ✓';setTimeout(()=>cp.textContent='COPY RESULT',1500)};
   const old=()=>{try{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();ok()}catch(e){}};
   try{navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(ok,old):old()}catch(e){old()}};
  w.appendChild(b);w.appendChild(cp);w.appendChild(o);d.appendChild(w)};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{ui()}catch(e){console.warn('[orbitron] performance test ui',e)}return r};try{ui()}catch(e){}UI.on(()=>{try{ui()}catch(e){}});
 window.orbPerfTest={start:()=>new Promise(res=>start((t,done)=>{if(done)res(t)}))}}
