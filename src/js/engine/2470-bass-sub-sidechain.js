
/* ---- v0.79: the kick ducks only the SUB of the bass. Until now every kick pulled the whole bass down (by 65 % or more), so a bass line lost
   its notes between the kicks. The bass bus is now split at 110 Hz: below it the duck works exactly as before (the kick keeps the low end to
   itself), above it the bass dips less than half as far, so the line stays readable through the kick. The two halves add up flat again
   (Linkwitz-Riley split), and nothing is added per note: five fixed nodes on the bus, built once per audio engine.
   The duck itself (depth, tempo-synced recovery, Sidechain depth LFO, PUMP fader) is untouched — it now steers a control signal that both
   halves follow. ---- */
{const XF=110,HI=.55;   /* crossover (Hz) · how far the upper half follows the duck: at a full duck it still plays at 55 % */
 const realGain=Object.getOwnPropertyDescriptor(GainNode.prototype,'gain').get;
 const build=b=>{b.__sub=1;
  const lp=ctx.createBiquadFilter(),hp=ctx.createBiquadFilter(),lo=ctx.createGain(),hi=ctx.createGain(),inv=ctx.createGain(),one=ctx.createConstantSource(),d=ctx.createGain(),sc=ctx.createGain();
  lp.type='lowpass';hp.type='highpass';lp.frequency.value=hp.frequency.value=XF;lp.Q.value=hp.Q.value=.5;inv.gain.value=-1;
  lo.gain.value=0;hi.gain.value=HI;sc.gain.value=1-HI;one.offset.value=1;d.gain.value=realGain.call(b).value;
  one.connect(d);d.connect(lo.gain);d.connect(sc);sc.connect(hi.gain);one.start();        // d = the duck curve as a signal: lows follow it fully, highs partly
  try{b.disconnect(A.m)}catch(e){b.disconnect()}
  b.connect(lp);lp.connect(lo);lo.connect(A.m);b.connect(hp);hp.connect(inv);inv.connect(hi);hi.connect(A.m);
  const g=realGain.call(b);g.cancelScheduledValues(0);g.value=1;
  Object.defineProperty(b,'gain',{value:d.gain,configurable:true})};                       // duck() keeps writing A.dkb.gain: it now reaches the control signal
 const _d=duck;duck=function(t){const b=A.dkb;if(b&&!b.__sub&&ctx&&b.context===ctx&&!(ctx instanceof OfflineAudioContext))try{build(b)}catch(e){b.__sub=1;console.warn('[orbitron] bass sub sidechain',e)}return _d.apply(this,arguments)}}
