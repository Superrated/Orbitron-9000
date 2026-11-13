
/* ---- perf 1: a finished sound source is disconnected right away, so the filters and gains behind it fall silent and drop out of the audio graph
   instead of being processed until garbage collection ---- */
{const P=AudioScheduledSourceNode.prototype,st=P.start;P.start=function(){const r=st.apply(this,arguments);try{if(!(this.context instanceof OfflineAudioContext))this.addEventListener('ended',()=>{try{this.disconnect()}catch(e){}},{once:true})}catch(e){}return r}}
