
/* ---- v0.22: LEAD and BASS faders take priority over the LFOs. While a fader is off centre, LFOs aimed at the same settings fade out
   (to 20 % depth at full throw) and come back as the fader returns, so the fader never fights an LFO sweep or stacks with it into the limits.
   LFO settings themselves are not changed. ---- */
{const LT=new Set(['Lead cutoff','Lead decay','Lead resonance']),BT=new Set(['Bass cutoff','Bass decay','Bass resonance']);
 const fac=tg=>{const M=LT.has(tg)?window.leadMacro:BT.has(tg)?window.bassMacro:null;if(!M)return 1;return 1-.8*Math.min(1,Math.abs(M.x||0))};
 const _mv=mv;mv=function(tg,t){const v=_mv(tg,t);if(!v)return v;const f=fac(tg);return f===1?v:v*f};
 const _mvd=mvd;mvd=function(tg,t){const r=_mvd(tg,t);const f=fac(tg);return f===1?r:[r[0]*f,r[1]*f]}}
