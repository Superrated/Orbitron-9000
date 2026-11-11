import sys,collections
from playwright.sync_api import sync_playwright
INIT=r'''(()=>{window.__tm={};const si=window.setInterval;window.setInterval=function(fn,ms,...a){const src=((new Error().stack||'').split('\n')[2]||'').trim().replace(/.*\.html:/,'L').slice(0,24)+' @'+ms;
 if(typeof fn!=='function')return si.call(this,fn,ms,...a);return si.call(this,function(){const t=performance.now();try{return fn.apply(this,arguments)}finally{const d=performance.now()-t,o=__tm[src]||(__tm[src]={n:0,t:0,mx:0});o.n++;o.t+=d;if(d>o.mx)o.mx=d}},ms,...a)};
 const raf=window.requestAnimationFrame;window.__rf={n:0,t:0,mx:0};window.requestAnimationFrame=function(cb){return raf.call(this,function(ts){const t=performance.now();try{return cb(ts)}finally{const d=performance.now()-t;__rf.n++;__rf.t+=d;if(d>__rf.mx)__rf.mx=d}})}})()'''
f=sys.argv[1];tab=int(sys.argv[2]) if len(sys.argv)>2 else 0
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);c=b.new_context(viewport={'width':412,'height':800},is_mobile=True,has_touch=True);pg=c.new_page();pg.add_init_script(INIT);cdp=c.new_cdp_session(pg)
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.select_option('#mood','Melodic House');pg.evaluate("generate();TR.forEach(T=>T.m=false);G.bpm=128")
  pg.evaluate("document.querySelector('#play').click()");pg.evaluate("i=>document.querySelectorAll('#tabs button')[i].click()",tab);pg.wait_for_timeout(1500)
  cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
  pg.evaluate("for(const k in __tm)delete __tm[k];__rf.n=0;__rf.t=0;__rf.mx=0");pg.wait_for_timeout(10000)
  r=pg.evaluate("__tm");rf=pg.evaluate("__rf")
  tot=sum(v['t'] for v in r.values())
  print('tab',tab,'intervals total %.0f ms in 10 s (%.1f%%), rAF %.0f ms (%d frames, max %.1f)'%(tot,tot/100,rf['t'],rf['n'],rf['mx']))
  for k,v in sorted(r.items(),key=lambda x:-x[1]['t'])[:14]:print('  %7.1f ms  n=%4d  max %5.1f  %s'%(v['t'],v['n'],v['mx'],k))
  print('active intervals',len(r));b.close()
