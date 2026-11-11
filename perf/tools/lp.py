import sys,collections
from playwright.sync_api import sync_playwright
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);c=b.new_context(viewport={'width':412,'height':800},is_mobile=True,has_touch=True);pg=c.new_page();cdp=c.new_cdp_session(pg)
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.evaluate("document.querySelector('#play').click()");pg.wait_for_timeout(1500)
  cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
  pg.evaluate("window.__lt=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>__lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']})")
  cdp.send('Profiler.enable');cdp.send('Profiler.setSamplingInterval',{'interval':300});cdp.send('Profiler.start')
  M=['Vector','Italo','Hopeful','Deep Space','Acid','Melodic House','Groove Techno','Ethereal']
  for i in range(8):
    pg.evaluate("m=>{$('#mood').value=m;const b=[...document.querySelectorAll('#gbox button')].find(x=>/launch/i.test(x.textContent));b.click()}",M[i]);pg.wait_for_timeout(3000)
  prof=cdp.send('Profiler.stop')['profile'];nodes={n['id']:n for n in prof['nodes']}
  par={};[par.__setitem__(ch,n['id']) for n in prof['nodes'] for ch in n.get('children',[])]
  incl=collections.Counter();self=collections.Counter()
  for sid,d in zip(prof['samples'],prof['timeDeltas']):
    cf=nodes[sid]['callFrame'];self[(cf['functionName'] or '(anon)')+':'+str(cf['lineNumber']+1)]+=d
    seen=set();x=sid
    while x is not None and x in nodes:
      cf=nodes[x]['callFrame'];kk=(cf['functionName'] or '(anon)')+':'+str(cf['lineNumber']+1)
      if kk not in seen:incl[kk]+=d;seen.add(kk)
      x=par.get(x)
  print('long tasks',pg.evaluate("__lt"))
  print('inclusive (excluding generate wrappers):')
  for k,v in incl.most_common(300):
    if k.startswith('(') or k.startswith('generate') or k.startswith('evaluate'):continue
    print('  %6.1f ms %s'%(v/1000,k))
  b.close()
