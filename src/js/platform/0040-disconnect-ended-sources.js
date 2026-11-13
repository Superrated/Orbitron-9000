
/* ---- perf 1: a finished sound source is disconnected right away, so the filters and gains behind it fall silent and drop out of the audio graph
   instead of being processed until garbage collection ---- */
/* ---- v0.89: a finished VOICE is unplugged too. Unplugging only the source was not enough: Chrome kept processing the voice's filters, gains and
   panners (still wired to the track bus and the meters) until JavaScript garbage collection, so the engine load crept up for as long as a groove
   played (Dreamy 27 % → 74 % in 40 s) and fell back only when the browser happened to clean up. Now every source started inside a voice
   (VX, set by the voice entry points) is counted; ¼ s (v0.98, was ¾ s: with fast repeats the finished voices piled up) after the voice's last source has ended, its exits (the nodes routeTrack/vconn wired into
   the mix, registered with orbVEX) are disconnected. Long-lived stages built inside a voice (vtag) are never registered. ---- */
{const P=AudioScheduledSourceNode.prototype,st=P.start,ONCE={once:true};
 const LIVE=new Map(),EXIT=new Map(),DUE=[],TAIL=.25,KEEP=60; /* KEEP s: a voice that never finishes (e.g. it started a shared LFO) is just forgotten, as before */
 /* v0.8 quick win: one shared 'ended' handler (it was a new closure per sound); it also takes the source off the load guard's list (platform/0300) */
 function ended(){try{this.disconnect()}catch(e){}if(this.__q)QOS.src.delete(this);
  const v=this.__vv;if(!v)return;const n=(LIVE.get(v)||1)-1;if(n>0){LIVE.set(v,n);return}LIVE.delete(v);if(EXIT.has(v)&&this.context===ctx)DUE.push(v,ctx.currentTime+TAIL)}
 P.start=function(){const r=st.apply(this,arguments);try{const c=this.context;if(!(c instanceof OfflineAudioContext)){this.addEventListener('ended',ended,ONCE);
   if(c===ctx&&VX.k!=null&&VX.n){const v=VX.n;this.__vv=v;LIVE.set(v,(LIVE.get(v)||0)+1)}}}catch(e){}return r};
 /* called by vconn (core/0050) for every exit of a voice, and by the Launch fade (launch/0660) for the fade gain it puts behind one */
 window.orbVEX=(n,v)=>{if(!v||n.__n!==undefined||n.__an||n.__keep)return;let e=EXIT.get(v);if(!e){e={t:n.context.currentTime,n:[]};EXIT.set(v,e)}e.n.push(n)};
 let sc=null;
 setInterval(()=>{let c=null;try{c=ctx}catch(e){return}if(c!==sc){if(sc){LIVE.clear();EXIT.clear();DUE.length=0}sc=c}if(!c)return;const now=c.currentTime;
  let i=0;for(;i<DUE.length;i+=2){if(DUE[i+1]>now)break;const v=DUE[i];if(LIVE.has(v))continue;const e=EXIT.get(v);EXIT.delete(v);if(e)for(const n of e.n)try{n.disconnect()}catch(x){}}
  if(i)DUE.splice(0,i);
  for(const [v,e] of EXIT){if(now-e.t<KEEP)break;EXIT.delete(v);LIVE.delete(v)}},250)}
