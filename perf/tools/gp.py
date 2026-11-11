import sys,collections
from playwright.sync_api import sync_playwright
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);c=b.new_context(viewport={'width':412,'height':800});pg=c.new_page();cdp=c.new_cdp_session(pg)
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.click('#play');pg.wait_for_timeout(1500)
  t=pg.evaluate("(()=>{const r=[];const M=['Vector','Italo','Hopeful','Deep Space','Acid','Melodic House','Groove Techno','Ethereal'];for(let i=0;i<16;i++){$('#mood').value=M[i%8];const a=performance.now();generate();r.push(performance.now()-a)}return r})()")
  print('generate() ms unthrottled:',[round(x) for x in t],'mean',round(sum(t)/len(t),1))
  cdp.send('Profiler.enable');cdp.send('Profiler.setSamplingInterval',{'interval':200});cdp.send('Profiler.start')
  pg.evaluate("(()=>{const M=['Vector','Italo','Hopeful','Deep Space','Acid','Melodic House','Groove Techno','Ethereal'];for(let i=0;i<24;i++){$('#mood').value=M[i%8];generate()}})()")
  prof=cdp.send('Profiler.stop')['profile'];nodes={n['id']:n for n in prof['nodes']}
  par={};[par.__setitem__(ch,n['id']) for n in prof['nodes'] for ch in n.get('children',[])]
  self=collections.Counter();incl=collections.Counter();tot=0
  for sid,d in zip(prof['samples'],prof['timeDeltas']):
    n=nodes[sid];cf=n['callFrame'];k=(cf['functionName'] or '(anon)')+':'+str(cf['lineNumber']+1);self[k]+=d;tot+=d
    seen=set();x=sid
    while x in nodes:
      cf=nodes[x]['callFrame'];kk=(cf['functionName'] or '(anon)')+':'+str(cf['lineNumber']+1)
      if kk not in seen:incl[kk]+=d;seen.add(kk)
      x=par.get(x)
      if x is None:break
  print('self:');[print('  %6.1f ms %s'%(v/1000,k)) for k,v in self.most_common(14)]
  print('inclusive:');[print('  %6.1f ms %s'%(v/1000,k)) for k,v in incl.most_common(400) if not k.startswith('(') and not k.startswith('generate') and not k.startswith('evaluate')]
  b.close()
