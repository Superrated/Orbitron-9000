
/* ---- v0.91: PERFORMANCE TEST — a button under Mix → Engine → Flight diagnostics that counts what you would hear as stutters on THIS
   device: dropouts (underruns) reported by the browser, time the audio clock lost against the real clock (each dropout makes the audio
   fall behind), late sequencer steps, screen frame rate and the longest freeze of the page. The result is a text with a Copy button.
   v0.94: ONE button, one test, about 2 minutes, all by itself:
     1. it Launches a heavy groove — Nebula (the mood that asks most of the engine) with every track switched on — and lets it build up.
        This REPLACES the groove that was playing.
     2. four runs of 20 s on that groove (RUNS): the lowest latency (Minimum buffer) at Full, Light and Survival quality, then Light with
        the default 52 ms buffer. Your Visuals setting is left alone. The screen is kept awake.
     3. your own settings come back, and the result ends with SUGGESTED SETTINGS for this device: the first run in that order that played
        clean (no dropout, no late step, no lost time) — best sound at the lowest delay. USE THESE SETTINGS applies them.
   Nothing here touches the audio path: it only reads counters, four times a second. ---- */
{const SECS=20;let run=null,series=null,pre='';
 const ms=x=>Math.round(x*1000),QN={'Hi-fi':'Full','Auto':'Auto','Eco':'Light','Survival':'Survival'};
 const ls=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}};
 const stats=c=>{try{return c&&c.playbackStats||null}catch(e){return null}};
 const device=()=>{const u=navigator.userAgent,m=/\(([^)]+)\)/.exec(u),b=/(Edg|OPR|SamsungBrowser|Firefox|CriOS|Chrome|Version)\/([\d.]+)/.exec(u);
  return (m?m[1]:'?')+' · '+(b?b[1]+' '+b[2].split('.')[0]:'?')+' · '+(navigator.hardwareConcurrency||'?')+' cores'+(navigator.deviceMemory?' · '+navigator.deviceMemory+' GB':'')};
 /* one run: measure the groove that is playing for SECS seconds, then done(result) */
 const start=(say,done)=>{if(run)return;const c=ctx,ps=stats(c),r=run={c,t0:performance.now(),a0:c.currentTime,u0:ps&&ps.underrunEvents!=null?ps.underrunEvents:null,d0:ps&&ps.underrunDuration!=null?ps.underrunDuration:null,
   late0:QOS.lateTot||0,fps:0,fpsN:0,fpsMin:999,lvl:0,vo:0,gap:0,last:performance.now(),dr:[],reset:false,fast:0,slow:0};
  r.fast=setInterval(()=>{const n=performance.now();if(!document.hidden)r.gap=Math.max(r.gap,n-r.last-50);r.last=n},50);   /* longest freeze of the page */
  r.slow=setInterval(()=>{const n=performance.now(),el=(n-r.t0)/1000;if(ctx!==c)r.reset=true;
   if(QOS.ft){const f=1000/Math.max(8,QOS.ft);r.fps+=f;r.fpsN++;r.fpsMin=Math.min(r.fpsMin,f)}r.lvl=Math.max(r.lvl,QOS.lvl||0);r.vo=Math.max(r.vo,QOS.src.size);
   if(!r.reset)r.dr.push(el-(c.currentTime-r.a0));
   if(el>=SECS||!playing)finish(done,el<SECS-1);else say(pre+Math.round(el)+' / '+SECS+' s …  keep the app on screen')},250);
  say(pre+'0 / '+SECS+' s …')};
 const finish=(done,early)=>{const r=run;if(!r)return;run=null;clearInterval(r.fast);clearInterval(r.slow);const c=r.c,ps=stats(c);
  /* the audio clock moves in buffer-sized steps: compare the lowest reading of the first and of the last 2 s, so those steps do not count */
  const mn=a=>a.length?Math.min.apply(null,a):0,lost=Math.max(0,ms(r.dr.length>=16?mn(r.dr.slice(-8))-mn(r.dr.slice(0,8)):0));
  const u=r.u0!=null&&ps?ps.underrunEvents-r.u0:null,ud=r.d0!=null&&ps?ms(ps.underrunDuration-r.d0):null,late=(QOS.lateTot||0)-r.late0;
  const q=ls('orb-q','Eco'),buf=(window.orbPerf&&orbPerf.buf())||'?',lat=ms((c.baseLatency||0)+(c.outputLatency||0));
  const clean=!early&&!r.reset&&!late&&lost<15&&(u==null||u===0);
  done({early,q,buf,lat,clean,vo:r.vo,text:
   'settings    quality '+(QN[q]||q)+' · buffer '+buf+' · visuals '+((window.orbPerf&&orbPerf.vis())||'?')+'\n'+
   'latency     '+lat+' ms  (buffer '+ms(c.baseLatency||0)+' + output '+ms(c.outputLatency||0)+') · '+c.sampleRate+' Hz\n'+
   'dropouts    '+(u==null?'not reported by this browser':u+(ud!=null?' · '+ud+' ms of silence':''))+' · clock lost '+lost+' ms'+(r.reset?' · ENGINE RESTARTED':'')+'\n'+
   'late steps  '+late+' · core level up to '+QOS.nm[r.lvl]+' · most voices '+r.vo+'\n'+
   'screen      '+(r.fpsN?Math.round(r.fps/r.fpsN)+' fps · lowest '+Math.round(r.fpsMin):'n/a')+' · longest freeze '+Math.round(r.gap)+' ms\n'+
   'verdict     '+(early?'stopped early':clean?'CLEAN':'NOT CLEAN')})};
 /* the runs, most wanted first: the suggestion is the first clean one. Settings are changed through the same menus you would use. */
 const RUNS=[['Hi-fi','Minimum · auto'],['Eco','Minimum · auto'],['Survival','Minimum · auto'],['Eco','Large · 52 ms']],SAFE=['Survival','Extra large · 102 ms'];
 const sels=()=>{const ql=[...document.querySelectorAll('#t-mix label.sl')].find(l=>l.firstChild&&l.firstChild.textContent.trim()==='Engine quality');
  return [ql&&ql.querySelector('select'),document.querySelector('#t-mix .bufsel select')]};
 const setAll=v=>{const S=sels();v.forEach((x,i)=>{const e=S[i];if(x==null||!e||e.value===x)return;e.value=x;if(e.value!==x)return;try{e.onchange&&e.onchange()}catch(err){console.warn('[orbitron] performance test setting',err)}})};
 let wl=null;const awake=on=>{try{if(on){navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>{wl=l;if(!series){l.release();wl=null}},()=>{})}else if(wl){wl.release();wl=null}}catch(e){}};
 const startAll=(say,done)=>{if(run||series)return;const S=sels();if(!S[0]||!S[1]){done({text:'Open Mix → Engine first.'});return}try{if(!playing)toggle()}catch(e){}if(!ctx){done({text:'Press Play first.'});return}
  const sr=series={keep:S.map(e=>e.value),res:[],i:0};awake(true);
  const end=why=>{series=null;pre='';awake(false);setAll(sr.keep);
   const best=why?null:(sr.res.find(x=>x.clean)||null),pick=why?null:best?[best.q,best.buf]:SAFE;
   const L=['ORBITRON PERFORMANCE TEST · v'+(typeof orbVer==='function'?orbVer():'?')+' · heavy groove ('+(typeof MN==='function'?MN(curMood):curMood)+', '+Math.round(G.bpm)+' bpm, every track on) · '+SECS+' s per run','device      '+device(),''];
   sr.res.forEach((x,i)=>L.push('RUN '+(i+1),x.text,''));
   if(why)L.push(why);else L.push('SUGGESTED SETTINGS FOR THIS DEVICE','quality '+(QN[pick[0]]||pick[0])+' · buffer '+pick[1]+(best?' · '+best.lat+' ms latency':''),
    best?(sr.res[0]===best?'Everything played clean, even the heaviest sound at the lowest delay.':'The best sound that played clean at the lowest delay.'):'No run played clean: the lightest sound with a big buffer is the safe choice.',
    '(a short test: '+SECS+' s per run. If it crackles later, pick a bigger buffer.)');
   L.push('','Your own settings are back.');done({text:L.join('\n'),pick})};
  const next=()=>{if(series!==sr)return;if(sr.i>=RUNS.length){end();return}
   const n=sr.i+1;pre='RUN '+n+' / '+RUNS.length+' · ';{const b0=S[1].value;setAll(RUNS[sr.i]);if(S[1].value===b0)try{window.hardReset&&hardReset('performance test')}catch(e){}} /* same buffer, other quality: restart the engine anyway, so the quality applies in full */
   say(pre+'changing the settings …');
   setTimeout(()=>{if(series!==sr)return;if(!playing){end('STOPPED (Play was switched off)');return}
    start(say,x=>{if(series!==sr)return;sr.res.push(x);sr.i++;if(x.early){end('STOPPED EARLY');return}next()})},5000)};   /* 5 s: the engine restarts */
  /* the heavy groove: Launch Nebula, then (once the Launch has landed on its bar line) switch every track on, then let it build up */
  const allOn=()=>{try{TR.forEach(T=>{T.m=false});UI.sync()}catch(e){console.warn('[orbitron] performance test tracks',e)}};
  say('Launching a heavy groove: '+(typeof MN==='function'?MN('Dreamy'):'Nebula')+', every track on …');
  try{const m=$('#mood');if(m&&MOODS.Dreamy)m.value='Dreamy';generate()}catch(e){console.warn('[orbitron] performance test launch',e)}
  setTimeout(()=>{if(series!==sr)return;allOn();say('Heavy groove is playing · letting it build up …');setTimeout(()=>{if(series!==sr)return;allOn();next()},9000)},6000)};
 const ui=()=>{const d=$('#diag');if(!d||d.querySelector('.ptest'))return;const w=document.createElement('div');w.className='ptest';w.style.cssText='margin-top:8px';
  const b=document.createElement('button'),cp=document.createElement('button'),us=document.createElement('button'),o=document.createElement('div');b.type=cp.type=us.type='button';let pick=null;
  b.textContent='▶ PERFORMANCE TEST · 2 min';b.title='Launches a heavy groove (it replaces the current one), plays four runs of '+SECS+' s at different quality and buffer settings, puts your settings back and suggests the best settings for this device.';
  cp.textContent='COPY RESULT';us.textContent='USE THESE SETTINGS';cp.hidden=us.hidden=true;
  [b,cp,us].forEach(x=>x.style.cssText='font:inherit;color:inherit;background:transparent;border:1px solid rgba(0,255,156,.45);border-radius:6px;padding:6px 10px;margin:0 8px 6px 0;cursor:pointer');
  o.style.cssText='white-space:pre-wrap;user-select:text;-webkit-user-select:text';
  const busy=x=>{b.disabled=x;b.style.opacity=x?.5:1};
  b.onclick=()=>{cp.hidden=us.hidden=true;busy(true);startAll(t=>{o.textContent='PERFORMANCE TEST · '+t},r=>{o.textContent=r.text;pick=r.pick||null;cp.hidden=!r.pick;us.hidden=!pick;us.textContent='USE THESE SETTINGS';busy(false)})};
  us.onclick=()=>{if(!pick||series)return;setAll(pick);us.textContent='SETTINGS APPLIED ✓'};
  cp.onclick=()=>{const t=o.textContent,ok=()=>{cp.textContent='COPIED ✓';setTimeout(()=>cp.textContent='COPY RESULT',1500)};
   const old=()=>{try{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();ok()}catch(e){}};
   try{navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(ok,old):old()}catch(e){old()}};
  w.appendChild(b);w.appendChild(cp);w.appendChild(us);w.appendChild(o);d.appendChild(w)};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{ui()}catch(e){console.warn('[orbitron] performance test ui',e)}return r};try{ui()}catch(e){}UI.on(()=>{try{ui()}catch(e){}});
 window.orbPerfTest={full:()=>new Promise(res=>startAll(()=>{},res)),use:p=>setAll(p)}}
