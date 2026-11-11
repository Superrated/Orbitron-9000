import sys,collections
from playwright.sync_api import sync_playwright
INIT=r'''(()=>{window.__by={};const CP=BaseAudioContext.prototype;Object.getOwnPropertyNames(CP).filter(n=>/^create/.test(n)&&typeof CP[n]==='function').forEach(n=>{const f=CP[n];CP[n]=function(){if(window.__rec&&!(this instanceof OfflineAudioContext)){const st=(new Error().stack||'').split('\n').slice(2,12).map(x=>(x.trim().match(/at (\S+)/)||[])[1]||'?').filter(x=>!/^(osc|mk|g|lpF|env|nz|send|sendTo|Object\..*|new|eval|<anonymous>|CP\..*|P\..*|ctx\..*|BaseAudioContext\..*|AudioContext\..*)$/.test(x)&&!/computed/.test(x));const k=n.replace('create','')+' @ '+(st[0]||'?');__by[k]=(__by[k]||0)+1}return f.apply(this,arguments)}})})()'''
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page();pg.add_init_script(INIT)
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.select_option('#mood','Melodic House');pg.evaluate("generate();TR.forEach(T=>T.m=false);TR[5].p.size=4;G.bpm=128")
  pg.click('#play');pg.wait_for_timeout(2500);pg.evaluate("__by={};__rec=1");pg.wait_for_timeout(10000);pg.evaluate("__rec=0")
  r=pg.evaluate("__by");tot=sum(r.values())
  for k,v in sorted(r.items(),key=lambda x:-x[1])[:25]:print('%5.1f/s  %s'%(v/10,k))
  print('total/s',tot/10);b.close()
