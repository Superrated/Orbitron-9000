/* ---- v145: safety — an exponential ramp to 0 (e.g. a track at Level 0) is not allowed by Web Audio and used to abort the note and the rest of
   that sequencer step; ramps now clamp to a tiny positive value, and a non-finite value or time is skipped instead of throwing ---- */
{const E=AudioParam.prototype.exponentialRampToValueAtTime;AudioParam.prototype.exponentialRampToValueAtTime=function(v,t){if(!isFinite(v)||!isFinite(t))return this;return E.call(this,v>0?Math.max(v,1e-5):v<0?Math.min(v,-1e-5):1e-5,t)};
 const S=AudioParam.prototype.setValueAtTime;AudioParam.prototype.setValueAtTime=function(v,t){if(!isFinite(v)||!isFinite(t))return this;return S.call(this,v,t)};
 const L=AudioParam.prototype.linearRampToValueAtTime;AudioParam.prototype.linearRampToValueAtTime=function(v,t){if(!isFinite(v)||!isFinite(t))return this;return L.call(this,v,t)};
 const T=AudioParam.prototype.setTargetAtTime;AudioParam.prototype.setTargetAtTime=function(v,t,c){if(!isFinite(v)||!isFinite(t)||!(c>0))return this;return T.call(this,v,t,c)}}

