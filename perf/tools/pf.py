import json,sys,statistics as st
from playwright.sync_api import sync_playwright
INIT=r'''(()=>{let s=0x9e3779b9;Math.random=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 window.__nc={};const CP=BaseAudioContext.prototype;Object.getOwnPropertyNames(CP).filter(n=>/^create/.test(n)&&typeof CP[n]==='function').forEach(n=>{const f=CP[n];CP[n]=function(){if(!(this instanceof OfflineAudioContext))__nc[n]=(__nc[n]||0)+1;return f.apply(this,arguments)}});
 window.__lt=[];try{new PerformanceObserver(l=>l.getEntries().forEach(e=>__lt.push(e.duration))).observe({entryTypes:['longtask']})}catch(e){}})()'''
POST=r'''(()=>{window.__tk=[];window.__gap=[];let last=0;const T=tick;tick=function(){const a=performance.now();if(last)__gap.push(a-last);last=a;const r=T.apply(this,arguments);__tk.push(performance.now()-a);return r};
 window.__fr=[];let lf=0;const fr=t=>{if(lf)__fr.push(t-lf);lf=t;requestAnimationFrame(fr)};requestAnimationFrame(fr)})()'''
def pct(a,q):
  if not a:return 0
  a=sorted(a);return a[min(len(a)-1,int(len(a)*q))]
def run(file,scn,thr=4,secs=20):
  with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    c=b.new_context(viewport={'width':412,'height':800},is_mobile=True,has_touch=True);pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
    pg.add_init_script(INIT);cdp=c.new_cdp_session(pg)
    pg.goto('http://localhost:8765/perf/'+file+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
    pg.evaluate(POST)
    pg.select_option('#mood','Melodic House');pg.evaluate("generate()")
    if scn in('heavy','ui'):pg.evaluate("TR.forEach(T=>T.m=false);TR[5].p.size=4;G.bpm=128;$('#bpm').value=128")
    cdp.send('Emulation.setCPUThrottlingRate',{'rate':thr})
    pg.evaluate("document.querySelector('#play').click()");pg.wait_for_timeout(3000)
    cdp.send('Performance.enable');m0={x['name']:x['value'] for x in cdp.send('Performance.getMetrics')['metrics']}
    s0=pg.evaluate("({late:QOS.lateTot||0,un:ctx.playbackStats?ctx.playbackStats.underrunEvents:0,nc:Object.assign({},__nc),t:performance.now()});")
    pg.evaluate("__tk.length=0;__gap.length=0;__lt.length=0;__fr.length=0")
    b.start_tracing(page=pg,categories=['webaudio'])
    steps=int(secs*1000/250);moods=['Vector','Italo','Hopeful','Deep Space','Acid','Melodic House','Groove Techno','Ethereal']
    for i in range(steps):
      if scn=='ui':
        pg.evaluate("""i=>{const tabs=document.querySelectorAll('#tabs button');if(i%4===0)tabs[(i/4)%tabs.length].click();
          const sl=[...document.querySelectorAll('section.tp:not([hidden]) input[type=range]')].filter(e=>e.offsetParent);
          for(let j=0;j<3&&sl.length;j++){const e=sl[(i*7+j*3)%sl.length],mn=+e.min,mx=+e.max;if(/tempo|bpm/i.test(e.id))continue;const v=+e.value+(mx-mn)*.03*((i+j)%2?1:-1);e.value=Math.max(mn,Math.min(mx,v));e.dispatchEvent(new Event('input',{bubbles:true}))}
          if(window.LOWPASS)LOWPASS.set(.75+.25*Math.sin(i/3))}""",i)
      if scn=='launch' and i%15==7:
        pg.evaluate("m=>{$('#mood').value=m;const b=[...document.querySelectorAll('#gbox button')].find(x=>/launch/i.test(x.textContent));b.click()}",moods[(i//15)%len(moods)])
      pg.wait_for_timeout(250)
    tr=json.loads(b.stop_tracing());ev=tr['traceEvents'] if isinstance(tr,dict) else tr
    rd=[e['dur']/1000 for e in ev if e.get('ph')=='X' and e.get('name')=='RealtimeAudioDestinationHandler::Render']
    m1={x['name']:x['value'] for x in cdp.send('Performance.getMetrics')['metrics']}
    s1=pg.evaluate("({late:QOS.lateTot||0,un:ctx.playbackStats?ctx.playbackStats.underrunEvents:0,nc:Object.assign({},__nc),t:performance.now(),tk:__tk.slice(),gap:__gap.slice(),lt:__lt.slice(),fr:__fr.slice(),voices:QOS.src.size,lvl:[QOS.ml,QOS.lvl],q:128/ctx.sampleRate*1000})")
    el=(s1['t']-s0['t'])/1000;nc={k:round((s1['nc'].get(k,0)-s0['nc'].get(k,0))/el,1) for k in s1['nc']};tot=sum(nc.values())
    q=s1['q'];R={'file':file,'scn':scn,'thr':thr,'secs':round(el,1),
      'late_steps':s1['late']-s0['late'],'underruns':s1['un']-s0['un'],
      'tick_ms_mean':round(st.mean(s1['tk']),2) if s1['tk'] else 0,'tick_ms_p95':round(pct(s1['tk'],.95),1),'tick_ms_max':round(max(s1['tk'] or [0]),1),
      'gap_ms_p95':round(pct(s1['gap'],.95),1),'gap_ms_max':round(max(s1['gap'] or [0]),1),
      'longtasks':len(s1['lt']),'longtask_ms':round(sum(s1['lt'])),'longtask_max':round(max(s1['lt'] or [0])),
      'main_busy_pct':round((m1['TaskDuration']-m0['TaskDuration'])/el*100,1),'script_pct':round((m1['ScriptDuration']-m0['ScriptDuration'])/el*100,1),
      'layout_style_pct':round((m1['LayoutDuration']+m1['RecalcStyleDuration']-m0['LayoutDuration']-m0['RecalcStyleDuration'])/el*100,1),
      'frame_ms_p95':round(pct(s1['fr'],.95),1),'heap_mb':round(m1['JSHeapUsedSize']/1e6,1),
      'nodes_per_s':round(tot),'nodes_top':dict(sorted(nc.items(),key=lambda x:-x[1])[:6]),
      'audio_load_mean_pct':round(st.mean(rd)/q*100,1) if rd else 0,'audio_load_p99_pct':round(pct(rd,.99)/q*100,1),'audio_load_max_pct':round(max(rd or [0])/q*100,1),'audio_over_100':sum(1 for x in rd if x>q),
      'voices_end':s1['voices'],'lvl':s1['lvl'],'errors':errs[:3]}
    b.close();return R
if __name__=='__main__':
  file=sys.argv[1];scns=sys.argv[2].split(',');thr=float(sys.argv[3]) if len(sys.argv)>3 else 4
  out=[]
  for s in scns:
    r=run(file,s,thr);out.append(r);print(json.dumps(r))
  open(f'/tmp/t/pf_{file}.json','w').write(json.dumps(out))
