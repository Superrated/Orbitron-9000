/* ---- v92: audio engine reset button in the header ---- */
{const top=document.querySelector('.panel.top'),stg=top&&top.querySelector('.stg');if(top){const b=document.createElement('button');b.className='stg rstb';b.textContent='↻ RESET';b.title='Restart the audio engine (keeps your groove)';
 b.onclick=()=>{if(window.orbReset){window.orbReset();b.textContent='↻ …';setTimeout(()=>b.textContent='↻ RESET',1200)}};if(stg)stg.after(b);else top.appendChild(b)}}
/* ---- v93: recover from silent stops — detect silence while playing, try flush then rebuild, and if the browser blocks the fresh engine without a tap, show a "tap to restore sound" overlay; the reason is shown so it can be reported ---- */
{const ERR=window.ORB_ERR||{};const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(2,8,6,.82);backdrop-filter:blur(2px)';
 ov.innerHTML='<button style="font:700 16px ui-monospace,monospace;letter-spacing:.12em;padding:22px 26px;border-radius:14px;border:2px solid #00ff9c;background:#05140f;color:#7fffc4">▶ TAP TO RESTORE SOUND<div class="why" style="font:400 11px ui-monospace,monospace;letter-spacing:0;margin-top:10px;opacity:.75;max-width:280px"></div></button>';document.body.appendChild(ov);
 const why=ov.querySelector('.why');ov.onclick=()=>{try{ctx&&ctx.resume()}catch(e){}ov.style.display='none';if(!playing)toggle()};
 const show=t=>{why.textContent=t||'';ov.style.display='flex'};window.orbOverlay=show;
 // silence watchdog
 let an=null,buf=null,quiet=0,step=0,LASTF=0;const _f93=fire;fire=function(k,w){LASTF=w;return _f93(k,w)};METER.every(2,()=>{if(!ctx||!playing){quiet=0;return}
  if(ctx.state!=='running'){ctx.resume().then(()=>{},()=>{});if(++step>=2)show('The browser paused the audio ('+ctx.state+'). Tap to start it again.');return}step=0;
  let s,bad;try{const m=METER.post();s=m.sum;bad=m.nan}catch(e){return}
  const recent=LASTF&&ctx.currentTime-LASTF<1.2;if(!bad&&s<1e-9&&recent)quiet++;else quiet=0;
  if(quiet===4){ERR.silences=(ERR.silences||0)+1;ERR.last='silence while playing';try{const sd=60/G.bpm/4;if(nextT<ctx.currentTime+.05){const n=Math.ceil((ctx.currentTime+.05-nextT)/sd);nextT+=n*sd;tk+=n}}catch(e){}}
  if(quiet>=8)quiet=0});
 // after any automatic rebuild, make sure the new engine is actually running
 const _r=window.orbReset;if(_r)window.orbReset=function(){_r();setTimeout(()=>{if(ctx&&ctx.state!=='running')show('The audio engine was restarted. Tap to start it again.')},600)}}
