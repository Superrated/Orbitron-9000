
/* ---- v0.33: MASTERING — Mood finish, Master+ and Pro polish merged into one stage with one switch (Mix → Bus & FX).
   One EQ set: low shelf 90 Hz · mud bell (300 Hz or the mood's) · mid bell 700 Hz · presence bell 3.2 kHz · air shelf 9.5 kHz, plus the 30 Hz
   subsonic cut (the mood's high-pass) — the mood finish tilt, the per-mood tonal balance and the global sub/mid settings all land here.
   One width stage: the PA mono-bass stage (mono below 160 Hz) now also sets the mood's stereo width; the second mid/side stage is gone.
   Dynamics: glue compressor, then the 3-band compressor on Hi-fi, a single band on Eco / Survival (cheaper), and on Auto three bands while the
   engine is calm, one band while the load meter shows LOAD or more (after 2 s; back to three after 10 s calm); then the limiter.
   Loudness auto-gain and meter kept (read twice a second). Clean-up EQ per track, tape glue and analog drift follow the same switch.
   Off = the raw mix (flat EQ, no width, no multiband, still limited and mono-safe in the lows). ---- */
{const BASE={l:-2,m:2};   /* v0.4 master: 1 dB less sub shelf (was -1) */
 if(G.master==null){let v=1;try{const x=localStorage.getItem('orb-master');if(x!=null)v=+x;else if(localStorage.getItem('orb-fin')==='0'&&localStorage.getItem('orb-mst')==='0')v=0}catch(e){}G.master=v}
 let W=null;
 const ensure=()=>{const P=window.paStage&&paStage();if(!ctx||!P||P.ctx!==ctx||!P.s2)return false;
  if(!W||W.ctx!==ctx){const g=ctx.createGain();try{P.s2.disconnect(P.L)}catch(e){}try{P.s2.disconnect(P.inv)}catch(e){}P.s2.connect(g);g.connect(P.L);g.connect(P.inv);W={ctx,g}}
  if(A.tpre&&A.tpre.type!=='peaking'){A.tpre.type='peaking';A.tpre.frequency.value=3200;A.tpre.Q.value=.8}return true};
 const eco=()=>(QOS.floor||0)>=1;
 const qual=()=>{try{return localStorage.getItem('orb-q')||'Eco'}catch(e){return 'Eco'}};
 let busyT=0,calmT=0,autoOne=false;const autoTick=()=>{const now=performance.now(),busy=Math.max(QOS.lvl||0,QOS.ml||0)>=1;if(busy){calmT=0;busyT=busyT||now;if(now-busyT>2000)autoOne=true}else{busyT=0;calmT=calmT||now;if(now-calmT>10000)autoOne=false}};
 const one=()=>{const q=qual();return q==='Hi-fi'?false:q==='Auto'?autoOne:true};
 window.orbEQ=()=>{try{if(!ctx||!A.tmid||!A.tls)return;ensure();const on=!!G.master,c=on?((window.MOODFIN||{})[curMood]||{hp:28,sub:0,mud:0,mf:300,pres:.5,air:1.5,w:.25}):{},t=on?((window.orbTone||{})[curMood]||{}):{},n=ctx.currentTime,
   z=(p,v)=>{try{p.cancelScheduledValues(n);p.setTargetAtTime(v,n,.15)}catch(e){}};
   z(A.tls.gain,on?BASE.l+(t.l||0)+(c.sub||0):1.5);z(A.tmid.gain,on?Math.min(4,BASE.m+(t.m||0)-(one()?1.5:0)):0);   /* the single band no longer tames the mids: 1.5 dB less mid lift there */
   z(A.tpre.gain,on?(c.pres||0)+(t.h||0)*.6:0);z(A.ths.gain,on?3+(c.air||0)+(t.h||0)*.6:3);   /* v0.4 master: +1 dB air */
   const P=window.paStage&&paStage();if(P&&P.ctx===ctx){if(P.t1){z(P.t1.gain,on?-.5+(c.mud||0):-.5);   /* v0.4 master: low-mid cut 1.5 dB lighter for more body */z(P.t1.frequency,on?(c.mf||300):300)}if(P.h1&&P.h2){const hp=on?(c.hp||30):30;z(P.h1.frequency,hp);z(P.h2.frequency,hp)}}
   if(W&&W.ctx===ctx)z(W.g.gain,on?1.15+(c.w||0)+(G.space||0)*.35:1)}   /* v0.4 master: a touch wider (side only, the bass stays mono) */catch(e){console.warn('[orbitron] mastering eq',e)}};
 const mb=()=>{try{const MP=window.orbMPlus&&orbMPlus.M();if(!MP||MP.ctx!==ctx||!MP.inp)return;const mode=(!G.master||one())?'one':'three';if(MP.__mode===mode)return;
   if(mode==='one'){try{MP.inp.disconnect(MP.l1)}catch(e){}try{MP.inp.disconnect(MP.h1)}catch(e){}[MP.gL,MP.gM,MP.gH].forEach(g=>{try{g.disconnect(MP.sum)}catch(e){}});MP.inp.connect(MP.sum)}
   else{try{MP.inp.disconnect(MP.sum)}catch(e){}MP.inp.connect(MP.l1);MP.inp.connect(MP.h1);[MP.gL,MP.gM,MP.gH].forEach(g=>g.connect(MP.sum))}
   MP.__mode=mode;orbEQ()}catch(e){console.warn('[orbitron] mastering bands',e)}};
 const sync=()=>{const m=G.master?1:0;if(G.fin!==m){G.fin=m;try{window.moodFinish&&moodFinish.apply()}catch(e){}}if((G.pro?1:0)!==m){G.pro=m;try{window.tapeSet&&tapeSet()}catch(e){}}
  try{if(window.orbMPlus&&orbMPlus.on()!==!!m)orbMPlus.set(!!m)}catch(e){}};
 const setMaster=v=>{G.master=v?1:0;try{localStorage.setItem('orb-master',G.master);localStorage.setItem('orb-fin',G.master);localStorage.setItem('orb-mst',G.master);localStorage.setItem('orb-pro',G.master)}catch(e){}sync();orbEQ();mb();lab()};
 window.orbMastering={set:setMaster,on:()=>!!G.master};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{orbEQ()}catch(e){}return r};
 const _fx=applyFX;applyFX=function(){const r=_fx.apply(this,arguments);try{orbEQ()}catch(e){}return r};
 try{const mf=window.moodFinish;if(mf){const a=mf.apply;mf.apply=function(){const r=a.apply(this,arguments);try{orbEQ()}catch(e){}return r}}}catch(e){}
 // UI: one button where Mood finish and Master+ were (the loudness meter stays); Pro polish moves under it
 let btn=null;const lab=()=>{if(!btn)return;const h=G.master?'✦ Mastering <b>ON</b> · '+MN(curMood)+(one()?' · light':''):'✧ Mastering <b>OFF</b> · raw mix';if(btn.innerHTML!==h)btn.innerHTML=h;btn.classList.toggle('on',!!G.master)};
 const st=document.createElement('style');st.textContent='.finb:not(.mastb),.prosw{display:none!important}';document.head.appendChild(st);
 let last=null;UI.on(()=>{try{
   if(!btn||!btn.isConnected){const box=document.querySelector('.mstx')||document.querySelector('.finb');if(box){btn=document.createElement('button');btn.type='button';btn.className='finb mastb';
     btn.title='Mastering: tone, stereo width, compression, loudness and limiting for the mood, plus clean-up EQ per track and tape glue. Tap to compare with the raw mix.';btn.onclick=()=>setMaster(!G.master);box.before(btn)}}
   autoTick();lab();sync();mb();if(A.tmid&&(last!==ctx||!W||W.ctx!==ctx)){last=ctx;orbEQ()}}catch(e){}})}
