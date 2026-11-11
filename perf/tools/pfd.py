import json,sys,collections
from playwright.sync_api import sync_playwright
INIT=open('/tmp/t/pf.py').read().split("INIT=r'''")[1].split("'''")[0]
file=sys.argv[1];scn=sys.argv[2] if len(sys.argv)>2 else 'heavy';pre=sys.argv[3] if len(sys.argv)>3 else ''
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
  pg=b.new_page(viewport={'width':412,'height':800});pg.add_init_script(INIT)
  pg.goto('http://localhost:8765/perf/'+file+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.select_option('#mood','Melodic House');pg.evaluate("generate()")
  if scn=='heavy':pg.evaluate("TR.forEach(T=>T.m=false);TR[5].p.size=4;G.bpm=128;$('#bpm').value=128")
  if pre:pg.evaluate(pre)
  pg.click('#play');pg.wait_for_timeout(5000)
  b.start_tracing(page=pg,categories=['webaudio','disabled-by-default-webaudio.audionode']);pg.wait_for_timeout(4000)
  tr=json.loads(b.stop_tracing());ev=tr['traceEvents'] if isinstance(tr,dict) else tr
  RR=[e for e in ev if e.get('name')=='RealtimeAudioDestinationHandler::Render' and e.get('ph')=='X' and 'dur' in e];n=len(RR);rt=sum(e['dur'] for e in RR)/1000
  c=collections.Counter();d=collections.defaultdict(float)
  for e in ev:
    if e.get('ph')=='X' and e.get('cat')=='disabled-by-default-webaudio.audionode':c[e['name']]+=1;d[e['name']]+=e.get('dur',0)/1000
  print('quanta',n,'render ms/quantum',round(rt/n,3),'(quantum = 2.9 ms)','voices',pg.evaluate("QOS.src.size"))
  for k,v in sorted(d.items(),key=lambda x:-x[1])[:14]:print('  %-45s calls/q %6.1f  ms/q %.3f'%(k,c[k]/n,v/n))
  b.close()
