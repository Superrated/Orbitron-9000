
/* ---- v0.24: IN-TIME LAUNCH — while playing, Launch and Random warp wait for the next downbeat (the button shows "next bar"),
   then the new groove starts exactly on beat 1. Stopped: instant, as before.
   v0.8: LAUNCH AHEAD — the new groove is built a moment BEFORE the bar line instead of right on it. First the old groove is booked up to
   the bar line, so the build can take its time: beat 1 of the new groove is never late or skipped (on a slow phone it used to be).
   How early depends on how long this device took for its recent Launches (platform/1580). The time left before the bar line is used to
   prepare the new drum hits and the safety loop, so the first bar of the new groove is light on the processor. ---- */
{let pend=null;
 const isL=b=>b&&b.closest&&b.closest('#gbox')&&/launch|random warp/i.test(b.textContent||'');
 const sd=()=>60/G.bpm/4;
 /* seconds needed between "start building" and the bar line: 1.5x the slowest recent Launch + a margin, 0.35–1.2 s */
 const need=()=>Math.min(1.2,Math.max(.35,(window.orbLaunchBlock?orbLaunchBlock():0)*1.5/1000+.15));
 /* the first bar line (as a step number) that is not booked yet and still far enough away */
 const target=()=>{const now=ctx.currentTime,s=sd();let b=tk+(16-((tk%16)+16)%16)%16;while(nextT+(b-tk)*s-now<need())b+=16;return b};
 /* book the old groove exactly up to time t (the scheduler's look-ahead is stretched once, then put back) */
 /* (half a step short of the bar line: the clock moves on while booking) */
 const bookTo=t=>{const o=QOS.la,h=t-ctx.currentTime-sd()/2;if(h<=0)return;try{QOS.la=h>.4?h:h/(window.LASC||1);tick()}catch(e){}finally{QOS.la=o}};
 /* prepare the new groove's drum hits now: each drum voice runs once against a scratch context, which only queues its pre-render */
 let scratch=null;
 const warm=()=>{if(!ctx||!window.OfflineAudioContext)return;
  try{if(!scratch||scratch.sampleRate!==ctx.sampleRate){scratch=new OfflineAudioContext(1,128,ctx.sampleRate);scratch.__sink=scratch.createGain()}}catch(e){return}
  const live=ctx,o={OCT,FIX},sv={ks:A.ks,ksd:A.ksd,m:A.m,ru:A.ru,dI:A.dI,rI:A.rI,duck},z=scratch.__sink;
  A.ks=A.m=A.ru=A.dI=A.rI=z;duck=()=>{};
  try{for(const k of[0,2,3,7]){if(TR[k].m||!(TR[k].pt||[]).some(Boolean))continue;
    FIX=0;OCT=G.oct||0;if(k===3&&TR[3].p.mode==='Fixed')FIX=440*Math.pow(2,(TR[3].p.tune-69)/12);
    ctx=scratch;try{k===7?snare(0):fireVoice(k,0)}catch(e){}finally{ctx=live}}}
  finally{ctx=live;OCT=o.OCT;FIX=o.FIX;Object.assign(A,{ks:sv.ks,ksd:sv.ksd,m:sv.m,ru:sv.ru,dI:sv.dI,rI:sv.rI});duck=sv.duck}
  try{if(!TR[1].m&&window.orbHatWarm)orbHatWarm()}catch(e){}};
 const cancel=(b,lab)=>{if(!pend)return;clearInterval(pend.iv);pend=null;b.innerHTML=lab;b.classList.remove('wait')};
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!isL(b)||b.__orbGo||!playing||!ctx)return;e.stopImmediatePropagation();e.preventDefault();
  if(pend)return;const lab=b.innerHTML;b.innerHTML='⏳ next bar';b.classList.add('wait');
  const go=(bar,at)=>{cancel(b,lab);bookTo(at);window.__inTime=1;window.__launchAt=at;b.__orbGo=1;
   try{b.click()}finally{b.__orbGo=0;window.__inTime=0;window.__launchAt=0}
   if(playing){try{warm()}catch(e){console.warn('[orbitron] launch warm-up',e)}
    setTimeout(()=>{try{window.orbSafety&&orbSafety.render&&orbSafety.render()}catch(e){}},0)}};
  pend={bar:target(),iv:setInterval(()=>{if(!playing||!ctx){cancel(b,lab);return}
   let bar=pend.bar;if(tk>bar)bar=pend.bar=target();   /* the scheduler ran past it (hidden tab, stall): aim for the next one */
   const at=nextT+(bar-tk)*sd();if(at-ctx.currentTime<=need()+.03)go(bar,at)},8)}},true)}
