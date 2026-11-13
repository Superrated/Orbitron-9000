
/* ---- v0.23: pad chords are numbered as they start, so the load guard can tell the sounding chord from old tails (see steal()).
   In load-saving mode the pad release is capped at 1.5 s, so chords overlap less and there is less to steal in the first place. ---- */
{let id=0,prev=null;
 const _p=pad;pad=function(t,w,dur){const P=TR[5].p,o=P.rel;window.__PADC=window.__PADL=++id;if((QOS.lvl||0)>=2&&o>1.5)P.rel=1.5;
  const me={id,g:null,end:w+dur+Math.min(P.rel,dur*1.5+.1)+.1};PADGRAB=me;
  try{return _p.apply(this,arguments)}finally{window.__PADC=0;P.rel=o;PADGRAB=null;
   /* v0.23 perf: once this chord has faded in, the previous chord's remaining tail is shortened to about 1 s */
   try{if(prev&&prev.g&&ctx&&!(ctx instanceof OfflineAudioContext)&&typeof prev.g.gain.cancelAndHoldAtTime==='function'){const t0=w+Math.min(1.5,Math.max(.2,(P.att||.3)*dur*.6));
     if(prev.end>t0+1.6){prev.g.gain.cancelAndHoldAtTime(t0);prev.g.gain.setTargetAtTime(.0001,t0,.25);const pid=prev.id,ts=t0+1.4;for(const n of QOS.src)if(n.__pc===pid&&n.__e!==Infinity&&n.__e>ts)try{n.stop(ts)}catch(e){}prev.end=ts}}}catch(e){}
   if(me.g)prev=me}};
 /* v0.26: Stop fades the sounding pad chord over about a second instead of letting a long chord ring on for up to 10 s */
 const _tg=toggle;toggle=function(){const r=_tg.apply(this,arguments);try{if(!playing&&ctx&&prev&&prev.g){const t=ctx.currentTime;prev.g.gain.cancelAndHoldAtTime(t);prev.g.gain.setTargetAtTime(.0001,t,.3);
   const pid=prev.id;for(const n of QOS.src)if(n.__pc===pid&&n.__e>t+1.6)try{n.stop(t+1.6)}catch(e){}prev.end=t+1.6}}catch(e){}return r};try{$('#play').onclick=toggle}catch(e){}}
