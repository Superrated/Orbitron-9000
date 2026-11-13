
/* v177: PA-safe low end, always on (before the glue compressor): a 30 Hz subsonic cut (energy a PA can't reproduce but that eats
   headroom and makes limiting pump) and everything below ~110 Hz summed to mono, so kick, bass, sub and rumble hit the subs together. */
{let P=null;const mk=()=>{if(!ctx||!A.pre||!A.glue||(P&&P.ctx===ctx&&P.pre===A.pre))return;
  const g=v=>{const n=ctx.createGain();n.gain.value=v;return n},bq=(t,f,q)=>{const n=ctx.createBiquadFilter();n.type=t;n.frequency.value=f;n.Q.value=q;return n};
  const h1=bq('highpass',30,.54),h2=bq('highpass',30,1.31),sp=ctx.createChannelSplitter(2),mg=ctx.createChannelMerger(2),
   mid=g(.5),side=g(.5),sn=g(-.5),s1=bq('highpass',160,.54),s2=bq('highpass',160,1.31), /* v0.22: mono below ~160 Hz (was 110) */inv=g(-1),L=g(1),Rr=g(1);
  mid.channelCount=1;mid.channelCountMode='explicit';side.channelCount=1;side.channelCountMode='explicit';
  try{A.pre.disconnect(A.glue)}catch(e){}
  /* v0.22 master Air: two cascaded high shelves (≈ a wide Baxandall lift/cut above ~10 kHz), flat at 0 dB */
  const a1=ctx.createBiquadFilter(),a2=ctx.createBiquadFilter();a1.type=a2.type='highshelf';a1.frequency.value=8000;a2.frequency.value=14000;A.air=[a1,a2];window.airSet&&airSet(G.air||0,1);
  /* v0.22 global mud tilt, same for every mood: −2 dB around 300 Hz, +1.5 dB presence around 1.6 kHz */
  const t1=bq('peaking',300,.9),t2=bq('peaking',1600,.7);t1.gain.value=-2;t2.gain.value=1.5;A.tilt=[t1,t2];
  A.pre.connect(a1);a1.connect(a2);a2.connect(t1);t1.connect(t2);t2.connect(h1);h1.connect(h2);h2.connect(sp);sp.connect(mid,0);sp.connect(mid,1);sp.connect(side,0);sp.connect(sn,1);sn.connect(side);
  side.connect(s1);s1.connect(s2);mid.connect(L);s2.connect(L);mid.connect(Rr);s2.connect(inv);inv.connect(Rr);L.connect(mg,0,0);Rr.connect(mg,0,1);mg.connect(A.glue);
  P={ctx,pre:A.pre,h1,h2,s2,L,inv,t1,t2}};
 const _f=fire;fire=function(k,w){if(!(P&&P.ctx===ctx&&P.pre===A.pre))try{mk()}catch(e){console.warn('[orbitron] pa',e)}return _f.apply(this,arguments)};
 window.paStage=()=>P}
