
/* ---- perf 9: the master low-pass (A.lp) idles at 20 kHz most of the time; it is only used by the breakdowns, risers and drop effects.
   It now sits in the signal path only while one of those moves it, and steps out again a second after it is back at 20 kHz. ---- */
{let on=true,ctxH=null,idle=0;const nextOf=()=>A.gap&&A.gap.context===ctx?A.gap:A.arh;
 const engage=()=>{if(on)return;on=true;idle=0;try{A.hp.connect(A.lp);A.hp.disconnect(nextOf())}catch(e){}};
 let bt=null;const release=()=>{if(!on)return;on=false;bt=nextOf();try{A.hp.connect(bt);A.hp.disconnect(A.lp)}catch(e){}};
 const hook=()=>{if(!ctx||!A.lp||ctxH===ctx)return;ctxH=ctx;on=true;
  [A.lp.frequency,A.lp.Q].forEach(pm=>['setValueAtTime','setTargetAtTime','linearRampToValueAtTime','exponentialRampToValueAtTime','setValueCurveAtTime','cancelScheduledValues','cancelAndHoldAtTime'].forEach(m=>{const o=pm[m];if(typeof o!=='function')return;pm[m]=function(){engage();return o.apply(this,arguments)}}));
  const fv=Object.getOwnPropertyDescriptor(AudioParam.prototype,'value');['frequency','Q'].forEach(k=>{const pm=A.lp[k];Object.defineProperty(pm,'value',{get(){return fv.get.call(pm)},set(v){engage();fv.set.call(pm,v)},configurable:true})})};
 setInterval(()=>{try{hook();if(!ctx||!A.lp)return;const f=A.lp.frequency.value,q=A.lp.Q.value,neutral=f>=19900&&Math.abs(q-.7)<.02;
  if(!on&&bt&&bt!==nextOf()){try{A.hp.disconnect(bt)}catch(e){}bt=nextOf();A.hp.connect(bt)} /* the drop gap gate was added meanwhile */
  if(on&&neutral){if(++idle>=10)release()}else idle=0}catch(e){}},100);window.orbLpState=()=>on}
