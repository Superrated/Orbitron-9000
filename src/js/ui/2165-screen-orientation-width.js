/* ---- screens: phones always upright; desktop and tablet use the width ---- */
{const st=document.createElement('style');st.textContent=`
@media (orientation:landscape) and (max-height:520px) and (pointer:coarse){
 #upr{display:flex!important}}
#upr{display:none;position:fixed;inset:0;z-index:2147483647;align-items:center;justify-content:center;background:#04100a;color:#ffe44d;font:700 16px ui-monospace,Menlo,monospace;letter-spacing:.14em}
@media (min-width:900px) and (max-width:1200px){body.flw #t-perf>.flw-mut>:last-child>button{font-size:12px!important;letter-spacing:.04em}}
@media (min-width:1000px){
 #t-drums [data-mode] .grid>[data-g=snd],#t-synth [data-mode] .grid>[data-g=snd],#t-drums[data-mode] .grid>[data-g=snd],#t-synth[data-mode] .grid>[data-g=snd],
 #t-drums[data-mode] .grid>[data-g=pat],#t-synth[data-mode] .grid>[data-g=pat]{display:revert!important}
 #t-drums[data-mode] .body>canvas,#t-synth[data-mode] .body>canvas{display:block!important}
 #t-drums>.seg,#t-synth>.seg,#t-drums>.mcap,#t-synth>.mcap{display:none!important}
 #t-drums .grid>[data-g=pat],#t-synth .grid>[data-g=pat]{order:0;border-left:2px solid var(--edge);padding-left:8px}
 #t-drums .grid>[data-g=snd],#t-synth .grid>[data-g=snd]{order:1;border-left:2px solid var(--acc);padding-left:8px}
 #t-drums .card,#t-synth .card{border-left-color:var(--edge)}}`;document.head.appendChild(st);
 const up=document.createElement('div');up.id='upr';up.setAttribute('role','alert');up.textContent='\u21BB  TURN YOUR PHONE UPRIGHT';document.documentElement.appendChild(up);
 // installed app or full screen on a phone: ask the system to hold portrait too
 const lock=()=>{try{if(matchMedia('(pointer:coarse)').matches&&screen.orientation&&screen.orientation.lock&&(document.fullscreenElement||matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches))screen.orientation.lock('portrait').catch(()=>{})}catch(e){}};
 document.addEventListener('fullscreenchange',lock);addEventListener('pointerdown',lock,{once:true});
 // rotating the phone re-lays out the whole page, which can make the audio glitch. In a browser tab the only way to hold portrait is
 // full screen, so on a phone the first Ignite goes full screen and locks portrait (swipe or Back leaves full screen as usual).
 const phone=()=>matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600;
 const standalone=()=>matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches;
 let asked=false;document.addEventListener('pointerdown',e=>{try{if(asked||!phone()||standalone()||document.fullscreenElement)return;if(!e.target.closest||!e.target.closest('#play'))return;asked=true;
  const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;if(!rq)return;const pr=rq.call(el,{navigationUI:'hide'});if(pr&&pr.then)pr.then(lock).catch(()=>{})}catch(e){}},true)}
