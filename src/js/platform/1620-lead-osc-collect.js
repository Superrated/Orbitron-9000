
/* ---- v0.23 perf: collect the oscillators of each lead note, so a stolen note can be stopped for real (see leadVoice) ---- */
{const _fv=fireVoice;fireVoice=function(k){if(k!==4)return _fv.apply(this,arguments);window.__LCOL=[];try{return _fv.apply(this,arguments)}finally{window.__LCOL=null}}}
