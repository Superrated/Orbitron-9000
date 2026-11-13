
/* ---- v0.91: PERFORMANCE TEST — a button under Mix → Engine → Flight diagnostics. It lets the groove play for 60 s and counts what
   you would hear as stutters on THIS device: dropouts (underruns) reported by the browser, time the audio clock lost against the
   real clock (each dropout makes the audio fall behind), engine load (average and peak), late sequencer steps, screen frame rate and the longest freeze of the page.
   The result is a short text with a Copy button, to compare settings (quality, buffer, visuals) or to send along with a report.
   v0.92: FULL TEST runs three of them in a row by itself on the same groove — Light with the 52 ms buffer, then Survival with the
   Minimum buffer with visuals Full and with visuals Off — keeps the screen awake, puts your own settings back and gives one result.
   Nothing here touches the audio path: it only reads counters, four times a second. ---- */
{const SECS=60;let run=null,series=null,pre='';
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
   if(el>=SECS||!playing)finish(out,el<SECS-1);else out(pre+'PERFORMANCE TEST  '+Math.round(el)+' / '+SECS+' s …  keep the app on screen')},250);
  out(pre+'PERFORMANCE TEST  0 / '+SECS+' s …')};
 const finish=(out,early)=>{const r=run;if(!r)return;run=null;clearInterval(r.fast);clearInterval(r.slow);try{r.rc&&r.c.renderCapacity.removeEventListener('update',r.rc)}catch(e){}
  const el=(performance.now()-r.t0)/1000,ps=(()=>{try{return r.c.playbackStats||null}catch(e){return null}})(),c=r.c;
  /* the audio clock moves in buffer-sized steps: compare the lowest reading of the first and of the last 2 s, so those steps do not count */
  const mn=a=>a.length?Math.min.apply(null,a):0,lost=r.dr.length>=16?mn(r.dr.slice(-8))-mn(r.dr.slice(0,8)):0;
  const u=r.u0!=null&&ps?ps.underrunEvents-r.u0:null,ud=r.d0!=null&&ps?ps.underrunDuration-r.d0:null,late=(QOS.lateTot||0)-r.late0;
  const L=['ORBITRON PERFORMANCE TEST · build '+(typeof orbVer==='function'?orbVer():'?')+' · '+Math.round(el)+' s'+(el<SECS-1?' (stopped early)':''),
   'device      '+device(),
   'settings    quality '+ls('orb-q','Eco')+' · buffer '+((window.orbPerf&&orbPerf.buf())||'?')+' · visuals '+((window.orbPerf&&orbPerf.vis())||'?'),
   'groove      '+(typeof MN==='function'?MN(curMood):curMood)+' · '+Math.round(G.bpm)+' bpm · most voices '+r.vo,
   'latency     buffer '+ms(c.baseLatency||0)+' ms + output '+ms(c.outputLatency||0)+' ms · '+c.sampleRate+' Hz',
   'dropouts    '+(u==null?'not reported by this browser':u+(ud!=null?' · '+ms(ud)+' ms of silence':''))+(r.ur?' · worst second '+pct(r.ur)+' dropped':''),
   'clock lost  '+Math.max(0,ms(lost))+' ms'+(r.reset?' · ENGINE RESTARTED during the test':''),
   'engine load '+(r.ldN?'average '+pct(r.ld/r.ldN)+' · worst second '+pct(r.ldMax)+' · peak '+pct(r.pk):'not reported by this browser'),
   'late steps  '+late+' · core level up to '+QOS.nm[r.lvl],
   'screen      '+(r.fpsN?Math.round(r.fps/r.fpsN)+' fps average · lowest '+Math.round(r.fpsMin):'n/a')+' · longest freeze '+Math.round(r.gap)+' ms'];
  out(L.join('\n'),true,early)};
 /* FULL TEST: the three runs, by themselves. Settings are changed through the same menus you would use (Mix → Engine). */
 const RUNS=[['Eco','Large · 52 ms',null],['Survival','Minimum · auto','Full'],['Survival','Minimum · auto','Off']];
 const sels=()=>{const ql=[...document.querySelectorAll('#t-mix label.sl')].find(l=>l.firstChild&&l.firstChild.textContent.trim()==='Engine quality');
  return [ql&&ql.querySelector('select'),document.querySelector('#t-mix .bufsel select'),document.querySelector('#t-mix .vissel select')]};
 const setAll=v=>{const S=sels();let ch=false;v.forEach((x,i)=>{const e=S[i];if(x==null||!e||e.value===x)return;e.value=x;if(e.value!==x)return;ch=true;try{e.onchange&&e.onchange()}catch(err){console.warn('[orbitron] performance test setting',err)}});return ch};
 let wl=null;const awake=on=>{try{if(on){navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>{wl=l;if(!series&&!run){l.release();wl=null}},()=>{})}else if(wl){wl.release();wl=null}}catch(e){}};
 const startAll=out=>{if(run||series)return;const S=sels();if(!S[0]||!S[1]||!S[2]){out('Open Mix → Engine first.');return}try{if(!playing)toggle()}catch(e){}
  series={keep:S.map(e=>e.value),res:[],i:0};awake(true);
  const end=msg=>{const sr=series;series=null;pre='';awake(false);setAll(sr.keep);out((msg?msg+'\n\n':'')+sr.res.join('\n\n')+(sr.res.length?'\n\nYour own settings are back.':''),true)};
  const next=()=>{const sr=series;if(!sr)return;if(sr.i>=RUNS.length){end('ORBITRON FULL TEST · '+RUNS.length+' runs on the same groove');return}
   const n=sr.i+1;pre='RUN '+n+' / '+RUNS.length+' · ';setAll(RUNS[sr.i]);out(pre+'changing the settings …',false);
   setTimeout(()=>{if(series!==sr)return;if(!playing){end('STOPPED (Play was switched off)');return}
    start((t,done,early)=>{if(!done){out(t,false);return}if(series!==sr)return;sr.res.push('RUN '+n+'\n'+t);sr.i++;if(early){end('STOPPED EARLY');return}next()})},5000)};   /* 5 s: the engine restarts when the buffer changes */
  next()};
 const ui=()=>{const d=$('#diag');if(!d||d.querySelector('.ptest'))return;const w=document.createElement('div');w.className='ptest';w.style.cssText='margin-top:8px';
  const b=document.createElement('button'),fa=document.createElement('button'),cp=document.createElement('button'),o=document.createElement('div');b.type=fa.type=cp.type='button';
  b.textContent='▶ PERFORMANCE TEST · '+SECS+' s';fa.textContent='▶▶ FULL TEST · 3 runs · 3½ min';fa.title='Light + 52 ms buffer, then Survival + Minimum buffer with visuals Full and Off. Runs by itself and puts your settings back.';cp.textContent='COPY RESULT';cp.hidden=true;
  [b,fa,cp].forEach(x=>x.style.cssText='font:inherit;color:inherit;background:transparent;border:1px solid rgba(0,255,156,.45);border-radius:6px;padding:6px 10px;margin:0 8px 6px 0;cursor:pointer');
  o.style.cssText='white-space:pre-wrap;user-select:text;-webkit-user-select:text';
  const out=(t,done)=>{o.textContent=t;cp.hidden=!done;const busy=!done&&!!(run||series);[b,fa].forEach(x=>{x.disabled=busy;x.style.opacity=busy?.5:1})};
  b.onclick=()=>{pre='';start(out)};fa.onclick=()=>startAll(out);
  cp.onclick=()=>{const t=o.textContent,ok=()=>{cp.textContent='COPIED ✓';setTimeout(()=>cp.textContent='COPY RESULT',1500)};
   const old=()=>{try{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();ok()}catch(e){}};
   try{navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(ok,old):old()}catch(e){old()}};
  w.appendChild(b);w.appendChild(fa);w.appendChild(cp);w.appendChild(o);d.appendChild(w)};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{ui()}catch(e){console.warn('[orbitron] performance test ui',e)}return r};try{ui()}catch(e){}UI.on(()=>{try{ui()}catch(e){}});
 window.orbPerfTest={start:()=>new Promise(res=>start((t,done)=>{if(done)res(t)})),full:()=>new Promise(res=>startAll((t,done)=>{if(done)res(t)}))}}
