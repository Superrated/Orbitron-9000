/* ---- v141: efficiency — the audio engine sleeps a few seconds after Stop (0 % CPU while stopped) and wakes instantly on Play or any
   sound; the rumble and reverb convolvers are switched off while their mix is at 0 (and no LFO moves it), and back on when raised ---- */
{let lastSnd=Date.now(),slept=false;
 const wake=()=>{lastSnd=Date.now();if(ctx&&ctx.state==='suspended'&&slept){slept=false;ctx.resume().catch(()=>{})}};
 const _tg=toggle;toggle=function(){wake();return _tg.apply(this,arguments)};$('#play').onclick=toggle;
 const _fs=fire;fire=function(){if(!playing)wake();return _fs.apply(this,arguments)};
 const _ps=pad;pad=function(){if(!playing)wake();return _ps.apply(this,arguments)};
 window.orbWake=wake;
 setInterval(()=>{if(!ctx||playing){lastSnd=Date.now();return}if(ctx.state==='running'&&Date.now()-lastSnd>5000){slept=true;ctx.suspend().catch(()=>{})}},1000);
 document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#t-perf'))wake()},true);
 // convolvers idle while their mix is 0
 const KEEP={};const lfoOn=tg=>LFOS.some(L=>L.d>0&&L.tg===tg);
 setInterval(()=>{if(!ctx||ctx.state!=='running')return;
  [['rmc',()=>(G.rumble||0)>.005||lfoOn('Rumble')],['rcv',()=>(G.rev||0)>.005||lfoOn('Reverb mix')]].forEach(([k,need])=>{const cv=A[k];if(!cv)return;
   if(KEEP[k]&&KEEP[k].ctx!==ctx)delete KEEP[k];
   if(!need()){if(cv.buffer&&!playing){KEEP[k]={b:cv.buffer,ctx};cv.buffer=null}}else if(!cv.buffer&&KEEP[k]){cv.buffer=KEEP[k].b;delete KEEP[k]}})},500);
 window.convIdle=()=>({rmc:!!(A.rmc&&A.rmc.buffer),rcv:!!(A.rcv&&A.rcv.buffer)})}

