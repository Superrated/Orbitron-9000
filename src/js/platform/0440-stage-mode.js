/* ---- Stage mode — keeps the screen awake, turns off decorative animation, plans audio further ahead and asks before leaving the page.
   v1.0: Stage no longer forces the engine one quality step down (it thinned pads, leads and unison even when the phone was fine);
   the overload guard (platform/1580) still steps down by itself when the phone really struggles. ---- */
{let stage=false;try{stage=localStorage.getItem('orb-stage')==='1'}catch(e){}
 const st=document.createElement('style');st.textContent=`body.stage{touch-action:manipulation;-webkit-user-select:none;user-select:none}
body.stage::before{animation:none!important}body.stage .sstar,body.stage .rocket,body.stage .warpfx,body.stage .mctl{display:none!important}
body.stage .orb em{animation:none!important}body.stage #play .ping{display:none!important}
.stg{font:700 10px ui-monospace,monospace;padding:2px 7px;margin-left:8px;border:1px solid #7fffc4;color:#7fffc4;background:transparent;letter-spacing:.08em}
.stg.on{background:#ffe44d;color:#04100a;border-color:#ffe44d}
.resume{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;background:rgba(2,8,6,.88);font:700 22px ui-monospace,monospace;color:#ffe44d;text-align:center;padding:24px}
.resume.on{display:flex}`;document.head.appendChild(st);
 const b=document.createElement('button');b.className='stg';b.title='Stage mode: keeps the screen awake, turns off decorative animation, plans the audio further ahead, and asks before leaving the page';
 const apply=()=>{document.body.classList.toggle('stage',stage);b.classList.toggle('on',stage);b.textContent=stage?'● STAGE':'STAGE';
  QOS.la=document.hidden?1.2:stage?.4:(matchMedia('(pointer:coarse)').matches?.3:.2);QOS.stageFloor=0;QOS.fps=stage?20:QOS.fps;lockWake()};
 b.onclick=()=>{stage=!stage;try{localStorage.setItem('orb-stage',stage?'1':'0')}catch(e){}apply()};
 const met=document.querySelector('.met');(met||QB).after(b);
 // keep the screen awake while playing in stage mode
 let wl=null;async function lockWake(){try{if(stage&&playing&&!document.hidden&&navigator.wakeLock&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>wl=null)}else if((!stage||!playing)&&wl){wl.release();wl=null}}catch(e){}}
 setInterval(lockWake,2000);document.addEventListener('visibilitychange',()=>{apply()});
 // ask before leaving while playing
 window.addEventListener('beforeunload',e=>{if(stage&&playing){e.preventDefault();e.returnValue=''}});
 apply();
 // audio interruption recovery (calls, notifications, app switches)
 const rs=document.createElement('div');rs.className='resume';rs.innerHTML='AUDIO PAUSED BY THE DEVICE<br><span style="font-size:14px;color:#7fffc4">tap anywhere to resume</span>';document.body.appendChild(rs);
 const tryResume=()=>{if(!ctx||!playing)return;if(ctx.state!=='running'){ctx.resume().then(()=>{if(ctx.state==='running')rs.classList.remove('on')}).catch(()=>{});setTimeout(()=>{if(playing&&ctx.state!=='running')rs.classList.add('on')},600)}else rs.classList.remove('on')};
 rs.addEventListener('pointerdown',()=>{if(ctx)ctx.resume().then(()=>rs.classList.remove('on'))});
 setInterval(tryResume,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tryResume()})}
