import sys
from playwright.sync_api import sync_playwright
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);c=b.new_context(viewport={'width':412,'height':800});pg=c.new_page()
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.evaluate("window.__bc=0;const B=build;build=function(){__bc++;return B.apply(this,arguments)};0")
  pg.click('#play');pg.wait_for_timeout(500)
  pg.evaluate("[...document.querySelectorAll('#tabs button')][2].click()");pg.wait_for_timeout(500)
  t=pg.evaluate("(async()=>{const r=[];for(let i=0;i<5;i++){const a=performance.now();build();await new Promise(x=>setTimeout(x,0));await new Promise(x=>setTimeout(x,0));r.push(performance.now()-a);await new Promise(x=>setTimeout(x,300))}return r})()")
  print('build ms (unthrottled)',[round(x) for x in t])
  pg.evaluate("__bc=0");
  for i in range(20):
    pg.evaluate("i=>{const sl=[...document.querySelectorAll('section.tp:not([hidden]) input[type=range]')].filter(e=>e.offsetParent);const e=sl[i%sl.length];e.value=+e.value+(+e.max-+e.min)*.02;e.dispatchEvent(new Event('input',{bubbles:true}))}",i);pg.wait_for_timeout(100)
  print('build() calls during 20 slider moves',pg.evaluate("__bc"))
  pg.evaluate("__bc=0");pg.wait_for_timeout(5000);print('build() calls in 5 s idle playback',pg.evaluate("__bc"))
  b.close()
