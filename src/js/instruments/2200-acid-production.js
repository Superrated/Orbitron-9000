
/* ---- v0.4: ACID PRODUCTION — so the line sounds like a finished record, not a dry 303.
   · Per note: a warm, slightly asymmetric drive (soft clipping with a touch of even harmonics, like a pedal or a tube stage).
   · One shared acid bus after it: gentle saturation glue → +2.5 dB body at 220 Hz → slightly softer top (−3 dB above 6 kHz) →
     a soft compressor (3:1, fast attack) so it sits in the mix like a produced part. The bus is built once, so it costs almost nothing. ---- */
var __AWC={};function acidWarm(d){const k=Math.round(d*20);if(__AWC[k])return __AWC[k];const N=2048,c=new Float32Array(N),a=1+d*6;
 for(let i=0;i<N;i++){const x=i/(N-1)*2-1,y=Math.tanh(a*x+.12*d*x*x)/Math.tanh(a);c[i]=y}return __AWC[k]=c}
var __AB=null;function acidBus(){try{if(!ctx||ctx instanceof OfflineAudioContext||!(A.ld||A.dk))return null;const out=A.ld||A.dk;
 if(__AB&&__AB.ctx===ctx&&__AB.out===out)return __AB.inp;
 const inp=ctx.createGain(),sat=ctx.createWaveShaper(),body=ctx.createBiquadFilter(),top=ctx.createBiquadFilter(),cmp=ctx.createDynamicsCompressor(),mk=ctx.createGain();
 sat.curve=acidWarm(.25);sat.oversample='2x';body.type='peaking';body.frequency.value=220;body.Q.value=.8;body.gain.value=2;
 top.type='highshelf';top.frequency.value=6000;top.gain.value=-1.5;   /* v0.76: 303 more forward — half the top cut (was −3 dB above 6 kHz) and a touch less low-mid body (was +2.5 dB) */
 cmp.threshold.value=-18;cmp.ratio.value=3;cmp.knee.value=8;cmp.attack.value=.005;cmp.release.value=.12;mk.gain.value=.56; /* level-matched to the old acid voice */
 const trim=ctx.createGain();trim.__keep=1; /* v0.89: shared stage, never unplugged with a voice (platform/0040) */   /* v0.76: the level meter that sat here is gone with the 4-bar measurement */inp.connect(sat);sat.connect(body);body.connect(top);top.connect(cmp);cmp.connect(mk);mk.connect(trim);vconn(trim,VX.k,out);vtag(inp);inp.__k=4;
 trim.gain.value=(window.orbAcidLvl&&orbAcidLvl.trim)||1;__AB={ctx,out,inp,trim};return inp}catch(e){return null}}
