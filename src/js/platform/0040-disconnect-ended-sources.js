
/* ---- perf 1: a finished sound source is disconnected right away, so the filters and gains behind it fall silent and drop out of the audio graph
   instead of being processed until garbage collection ---- */
{const P=AudioScheduledSourceNode.prototype,st=P.start,ONCE={once:true};
 /* v0.8 quick win: one shared 'ended' handler (it was a new closure per sound); it also takes the source off the load guard's list (platform/0300) */
 function ended(){try{this.disconnect()}catch(e){}if(this.__q)QOS.src.delete(this)}
 P.start=function(){const r=st.apply(this,arguments);try{if(!(this.context instanceof OfflineAudioContext))this.addEventListener('ended',ended,ONCE)}catch(e){}return r}}
