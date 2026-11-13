
/* ---- v0.4: with the Minimum or Small audio buffer, repeated dropouts (3 within 10 s) bring a one-line tip to pick a bigger buffer;
   nothing changes by itself. The measured latency is in Mix → Engine → Flight diagnostics ("latency … ms (actual)"). ---- */
{let ur=null,ut=[],last=0;setInterval(()=>{try{if(!ctx||!playing)return;const low=/^(Minimum|Small)/.test((window.orbPerf&&orbPerf.buf())||'');let ps=null;try{ps=ctx.playbackStats}catch(e){}if(!ps||ps.underrunEvents==null)return;
  const u=ps.underrunEvents;if(ur!=null&&u>ur){const n=performance.now();for(let i=0;i<u-ur;i++)ut.push(n);ut=ut.filter(t=>n-t<10000);
   if(low&&ut.length>=3&&n-last>60000){last=n;ut=[];try{say&&say('▲ CRACKLES · try a bigger Audio buffer (Mix → Engine)')}catch(e){}}}ur=u}catch(e){}},500)}
