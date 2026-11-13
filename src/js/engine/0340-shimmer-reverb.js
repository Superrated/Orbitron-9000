/* ---- v36: real shimmer reverb (octave-up pitch-shifted feedback through a long reverb), fed from the synth bus; Deep Space uses it heavily; "Space shimmer" mix slider ---- */
G.shx=0;const SHM={on:0};
function shimmerInit(){if(SHM.on||!ctx)return;SHM.on=1;const g=(v=1)=>{const n=ctx.createGain();n.gain.value=v;return n};
 const inp=g(0),cv=ctx.createConvolver(),out=g(.9),fb=g(.55),hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter(),sum=g(1);cv.buffer=(SHM.irb&&SHM.irb.sampleRate===ctx.sampleRate)?SHM.irb:ir2(2.5,.03); /* perf 7: impulse prepared in idle time */ /* v0.22 stability: was 4 s */hp.type='highpass';hp.frequency.value=300;lp.type='lowpass';lp.frequency.value=7000;
 inp.connect(sum);sum.connect(cv);cv.connect(out);out.connect(A.gt);SHM.cv=cv;
 // doppler octave-up shifter: two crossfaded delay taps swept by sawtooth LFOs
 const f=16.67,w=.06,T=ctx.currentTime+.05,mix=g(1);
 [0,.5/f].forEach(off=>{const d=ctx.createDelay(.2),saw=mkOsc(),sg=g(-w/2),cs=mkConst(),tri=mkOsc(),tg=g(.5),wn=g(0),c5=mkConst();
  saw.type='sawtooth';saw.frequency.value=f;tri.type='triangle';tri.frequency.value=f;cs.offset.value=w/2+.006;c5.offset.value=.5;
  saw.connect(sg);sg.connect(d.delayTime);cs.connect(d.delayTime);d.delayTime.value=0;tri.connect(tg);tg.connect(wn.gain);c5.connect(wn.gain);
  cv.connect(d);d.connect(wn);wn.connect(mix);tri.start(T+off);saw.start(T+off+.25/f);cs.start(T);c5.start(T)});
 mix.connect(hp);hp.connect(lp);lp.connect(fb);fb.connect(sum);{const dg=g(.45);lp.connect(dg);dg.connect(out)}
 A.dk.connect(inp);SHM.inp=inp;SHM.fb=fb;inp.gain.value=G.shx}
const shxSet=v=>{G.shx=v;if(v>0)shimmerInit();if(SHM.inp)SHM.inp.gain.setTargetAtTime(v,ctx.currentTime,.1)};
const _mx36=mix;mix=function(){_mx36();sl($('#mix'),'Space shimmer',0,1,G.shx,.01,shxSet)};
const _fx36=applyFX;applyFX=function(){_fx36();if(G.shx>0||SHM.on)shxSet(G.shx)};
const _gen36=generate;generate=function(){G.shx=0;_gen36();if(curMood==='Deep Space'){G.shx=.55;G.shim=Math.max(G.shim,1.3);G.dens=Math.max(G.dens,.9)}else G.shx=0;if(ctx)applyFX();syncMix()};
// feed the cosmic events straight into the shimmer too
{const wrapS=fn=>function(w){const o=send;send=function(n,out,d,r){o(n,out,d,r);if(G.shx>0&&SHM.inp)n.connect(SHM.inp)};try{fn(w)}finally{send=o}};
 solarWind=wrapS(solarWind);sonar=wrapS(sonar);droneCloud=wrapS(droneCloud);chirps=wrapS(chirps)}
