/* ---- v120: stability + phone pass — reset needs a 3 s hold, screen stays awake while playing, Power also silences the dub stab, flight deck fits a phone screen, Ride push thruster (909-style ride on the offbeats while held) ---- */
{const b=document.querySelector('.rstb');if(b){b.onclick=null;b.title='Hold 3 seconds to restart the audio engine (keeps your groove)';b.style.touchAction='none';let t0=0,raf=0,fired=0;
 const idle=()=>{b.textContent='↻ RESET';b.style.background=''},
  stop=()=>{cancelAnimationFrame(raf);raf=0;if(!fired)idle()},
  paint=()=>{const p=Math.min(1,(performance.now()-t0)/1000);b.style.background='linear-gradient(90deg,rgba(255,93,115,.55) '+(p*100)+'%,transparent '+(p*100)+'%)';
   if(p>=1){fired=1;cancelAnimationFrame(raf);raf=0;b.style.background='';b.textContent='↻ …';try{window.orbReset&&window.orbReset()}catch(e){}setTimeout(()=>{fired=0;idle()},1200);return}
   b.textContent='HOLD…';raf=requestAnimationFrame(paint)};
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(fired||raf)return;t0=performance.now();raf=requestAnimationFrame(paint)});
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));b.addEventListener('contextmenu',e=>e.preventDefault())}}
{let wl=null,busy=0;const want=()=>playing&&!document.hidden;
 const sync=async()=>{if(busy||!('wakeLock' in navigator))return;busy=1;try{if(want()&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}else if(!want()&&wl){const w=wl;wl=null;await w.release()}}catch(e){wl=null}busy=0};
 window.orbWakeState=()=>!('wakeLock' in navigator)?'not supported':wl?'on':want()?'requested':'off';
 setInterval(sync,1500);document.addEventListener('visibilitychange',sync);document.addEventListener('pointerup',()=>setTimeout(sync,50))}
{const _g120=generate;generate=function(){const r=_g120.apply(this,arguments);if(curMood==='Power'){TR[4].m=true;TR[8].m=true;G.ptl=0;build()}return r}}
{const g=document.querySelector('#t-perf .thr');if(g){let sv=null,P=null;const rb=document.createElement('button');rb.className='pad latch';rb.innerHTML='Ride push<i class="hst">'+(0?'● ON':'○ OFF')+'</i>';   /* v0.85: ○ OFF / ● ON, latch style (flight/2080) */
 g.appendChild(rb);
 const hit=(t,sd)=>{const ai=Math.round((t-anchor())/sd);if(((ai%4)+4)%4!==2)return;const T=TR[3],o=T.lv,bar=Math.floor(ai/16);T.lv=Math.max(.42,o||0)*(1.12+.06*Math.sin(bar*2.1))*(ai%16===14?1.1:1);try{if(typeof ride==='function'){window.lpRun?lpRun('drm',()=>ride(t)):ride(t)}}catch(e){}finally{T.lv=o}};
 const off=()=>{if(!P)return;clearInterval(P.iv);P=null;rb.classList.remove('on');rb.innerHTML='Ride push<i class="hst">'+(0?'● ON':'○ OFF')+'</i>';if(sv!==null)TR[3].m=sv;sv=null};
 const on=w=>{ensure();if(!playing||P)return;rb.classList.add('on');rb.innerHTML='Ride push<i class="hst">'+(1?'● ON':'○ OFF')+'</i>';sv=TR[3].p.pv==='Ride'?TR[3].m:null;if(sv!==null)TR[3].m=true;
  P={t:w&&w>ctx.currentTime?w:align(sdur())};P.iv=setInterval(()=>{if(!P||!ctx)return;if(!playing){off();return}const sd=sdur();if(P.t<ctx.currentTime-.05)P.t=align(sd);while(P.t<ctx.currentTime+.15){hit(P.t,sd);P.t+=sd}},25)};
 rb.addEventListener('click',()=>{P?off():on()});window.ridePush={on,off,is:()=>!!P};
 rb.style.setProperty('--col','#ffd36b');const o1=[...g.children].find(x=>/^\+1 octave/.test(x.textContent));if(o1)g.insertBefore(rb,o1)}}
{const st=document.createElement('style');st.textContent=`@media (max-width:640px){
 body #t-perf{gap:6px!important;padding-bottom:34px!important}
 body #t-perf>.sec{margin:0 2px -3px!important;font-size:10px!important;letter-spacing:.12em!important}
 body #t-perf>.sec small{font-size:9.5px!important}
 body #t-perf>.rz{padding:0!important;position:relative;border-radius:14px}
 body #t-perf>.rz h2{position:absolute;top:7px;left:9px;right:6px;z-index:2;min-height:0!important;margin:0!important;font-size:9.5px!important;line-height:1.2!important;pointer-events:none;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}
 body #t-perf>.rz>div{height:clamp(54px,calc((100dvh - 652px)/2),118px)!important}
 body #t-perf>.rz>div>div:last-child{font-size:9.5px!important;font-weight:600!important;padding:20px 4px 4px!important;line-height:1.25!important;opacity:.6}
 body #t-perf>.panel:not(.rz){padding:8px!important}
 body #t-perf>.panel:not(.rz)>h2{font-size:10.5px!important;margin:0 0 6px!important}
 body #t-perf .thr{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}
 body #t-perf .thr .pad,body #t-perf .arm .pad{min-height:0!important;height:40px!important;padding:3px 4px!important;font-size:10px!important;line-height:1.15!important;letter-spacing:.02em!important}
 body #t-perf .thr+.sub,body #t-perf .sub:first-of-type{margin:7px 0 4px!important;font-size:9px!important}
 body #t-perf .panel>.sub[style]{display:none}
 body #t-perf .arm{margin-top:0!important;gap:6px!important}
 body #t-perf .arm+div{display:none}
 body #t-perf #pads{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
 body #t-perf #pads .pad{height:30px!important;min-height:0!important;font-size:10px!important;padding:2px!important}
}`;document.head.appendChild(st)}

