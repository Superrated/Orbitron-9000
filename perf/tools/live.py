import sys,collections
from playwright.sync_api import sync_playwright
INIT=r'''(()=>{window.__src=new Set();const P=AudioScheduledSourceNode.prototype,st=P.start,sp=P.stop;
 P.start=function(t){const fr=(new Error().stack||'').split('\n').slice(2,14).map(x=>(x.trim().match(/at (\S+)/)||[])[1]||'?').filter(x=>!/^(osc|mk|g|env|P\..*|CP\..*|Object\..*|<anonymous>|eval|plfo|.*\.start|.*\.stop)$/.test(x)&&!/computed|html/.test(x));
  this.__by=fr[0]||'?';this.__t0=t||0;if(!(this.context instanceof OfflineAudioContext))__src.add(this);this.addEventListener('ended',()=>__src.delete(this));return st.apply(this,arguments)};
 P.stop=function(t){this.__sp=t;return sp.apply(this,arguments)}})()'''
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page();pg.add_init_script(INIT)
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.select_option('#mood','Melodic House');pg.evaluate("generate();TR.forEach(T=>T.m=false);TR[5].p.size=4;G.bpm=128")
  pg.click('#play');pg.wait_for_timeout(5000)
  acc=collections.Counter();lens=collections.defaultdict(list)
  for i in range(10):
    r=pg.evaluate("(()=>{const now=ctx.currentTime,o={};for(const s of __src){if(s.context!==ctx)continue;const k=s.__by;o[k]=(o[k]||0)+1}return o})()")
    for k,v in r.items():acc[k]+=v
    pg.wait_for_timeout(400)
  r=pg.evaluate("(()=>{const o={};for(const s of __src){if(s.context!==ctx)continue;const L=(s.__sp==null?99:s.__sp-s.__t0);(o[s.__by]=o[s.__by]||[]).push(L)}return o})()")
  for k,v in acc.most_common(12):
    ls=r.get(k,[0]);print('%5.1f live  %-22s typical length %.2f s'%(v/10,k,sorted(ls)[len(ls)//2]))
  b.close()
