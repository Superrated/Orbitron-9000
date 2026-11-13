
/* ---- v0.35: TEMPO-SYNCED TAILS. The sidechain recovery follows the tempo (it always finishes before the next beat), the reverb gets a
   pre-delay of about a 1/32 note so the hit stays dry and the space blooms behind it, and short bass notes never ring into the next bass hit.
   Held (sustained) and 808 bass notes keep their full length. ---- */
{const _d=duck;duck=function(t){const o=G.rel;try{const beat=60/G.bpm;G.rel=Math.min(o*125/G.bpm,.8*beat/1.26)}catch(e){}try{return _d.apply(this,arguments)}finally{G.rel=o}};
 const PD=new WeakMap();
 setInterval(()=>{try{if(!ctx||ctx instanceof OfflineAudioContext||!A.rI||A.rI.context!==ctx||(window.DR&&DR.rendering))return;
   let pd=A.rI.__pd?A.rI:PD.get(A.rI);
   if(!pd){const old=A.rI;pd=ctx.createDelay(.2);pd.__pd=1;pd.connect(old);PD.set(old,pd);A.rI=pd}
   const v=Math.max(.008,Math.min(.045,60/G.bpm/8-.022));if(Math.abs((pd.__v||0)-v)>.001){pd.__v=v;pd.delayTime.setTargetAtTime(v,ctx.currentTime,.05)}}catch(e){}},500);
 const _f=fire;fire=function(k,w){if(k!==6)return _f(k,w);const T=TR[6],p=T.p;
  if(!p||(p.bsus||0)>.01||p.beng==='808'||window.BFDEC||!T.pt||!T.st)return _f(k,w);
  const s=tk%T.st;let j=1;while(j<=T.st&&!T.pt[(s+j)%T.st])j++;const gap=j*60/G.bpm/4,cap=Math.max(.08,gap*2.2);
  if(!(p.dec>cap))return _f(k,w);const o=p.dec;p.dec=cap;try{return _f(k,w)}finally{p.dec=o}}}
