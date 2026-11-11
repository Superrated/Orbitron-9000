import sys,json,collections
from playwright.sync_api import sync_playwright
f=sys.argv[1];scn=sys.argv[2]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);c=b.new_context(viewport={'width':412,'height':800},is_mobile=True,has_touch=True);pg=c.new_page();cdp=c.new_cdp_session(pg)
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.select_option('#mood','Melodic House');pg.evaluate("generate();TR.forEach(T=>T.m=false);G.bpm=128")
  cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
  pg.evaluate("document.querySelector('#play').click()");pg.wait_for_timeout(2000)
  cdp.send('Profiler.enable');cdp.send('Profiler.setSamplingInterval',{'interval':500});cdp.send('Profiler.start')
  moods=['Vector','Italo','Hopeful','Deep Space','Acid']
  for i in range(60):
    if scn=='ui':
      pg.evaluate("""i=>{const tabs=document.querySelectorAll('#tabs button');if(i%4===0)tabs[(i/4)%tabs.length].click();
          const sl=[...document.querySelectorAll('section.tp:not([hidden]) input[type=range]')].filter(e=>e.offsetParent);
          for(let j=0;j<3&&sl.length;j++){const e=sl[(i*7+j*3)%sl.length],mn=+e.min,mx=+e.max;if(/tempo|bpm/i.test(e.id))continue;const v=+e.value+(mx-mn)*.03*((i+j)%2?1:-1);e.value=Math.max(mn,Math.min(mx,v));e.dispatchEvent(new Event('input',{bubbles:true}))}}""",i)
    if scn=='launch' and i%15==7:pg.evaluate("m=>{$('#mood').value=m;generate()}",moods[(i//15)%len(moods)])
    pg.wait_for_timeout(250)
  prof=cdp.send('Profiler.stop')['profile']
  nodes={n['id']:n for n in prof['nodes']};self=collections.Counter()
  dt=prof['timeDeltas'];tot=0
  for sid,d in zip(prof['samples'],dt):
    n=nodes[sid];cf=n['callFrame'];k=(cf['functionName'] or '(anon)')+':'+str(cf['lineNumber']+1);self[k]+=d;tot+=d
  for k,v in self.most_common(25):print('%6.1f ms  %4.1f%%  %s'%(v/1000,v/tot*100,k))
  b.close()
