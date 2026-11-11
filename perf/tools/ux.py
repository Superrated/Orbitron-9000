import sys
from playwright.sync_api import sync_playwright
f=sys.argv[1]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':412,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto('http://localhost:8765/perf/'+f+'.html');pg.wait_for_function('typeof bassLayout==="function"');pg.wait_for_timeout(800)
  pg.click('#play');pg.wait_for_timeout(500)
  for m in ['Melancholic','Power']:
    pg.select_option('#mood',m);pg.evaluate("generate()");pg.wait_for_timeout(300)
  pg.evaluate("[...document.querySelectorAll('#tabs button')].find(b=>/^mix$/i.test(b.textContent.trim())).click()");pg.wait_for_timeout(400)
  r=pg.evaluate("(()=>{const o={};document.querySelectorAll('#mix .sl').forEach(d=>{const l=d.firstChild&&d.firstChild.textContent.trim();if(/^(Reverb mix|Delay mix|Swing)/.test(l)){o[l]=d.querySelector('b').textContent}});return [o,G.rev,G.dly,G.swing]})()")
  print('mix page',r)
  pg.evaluate("[...document.querySelectorAll('#tabs button')].find(b=>/drums/i.test(b.textContent)).click()");pg.wait_for_timeout(400)
  r=pg.evaluate("(()=>{const c=TR[1].mb.closest('.card');const o={};c.querySelectorAll('.sl').forEach(d=>{const l=d.firstChild&&d.firstChild.textContent.trim();if(/^(Hits|Steps)/.test(l))o[l]=d.querySelector('b').textContent});return [o,TR[1].h,TR[1].st]})()")
  print('hat card',r,errs[:2]);b.close()
