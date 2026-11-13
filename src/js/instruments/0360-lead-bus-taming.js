/* ---- v39: lead taming — lead bus (de-harsh EQ + compressor), max 3 overlapping lead notes, calmer generated lead settings ---- */
G.ldOut=.82;G.ldT=.045;
const _init39=init;init=function(){const nw=!ctx;_init39();if(!nw)return;const pk=ctx.createBiquadFilter(),hs=ctx.createBiquadFilter(),c=ctx.createDynamicsCompressor(),o=ctx.createGain();A.ld=ctx.createGain();
 pk.type='peaking';pk.frequency.value=3000;pk.Q.value=1;pk.gain.value=-3.5;hs.type='highshelf';hs.frequency.value=8000;hs.gain.value=-2.5;
 c.threshold.value=-22;c.ratio.value=4;c.knee.value=8;c.attack.value=.004;c.release.value=.16;o.gain.value=G.ldOut;A.ldo=o;A.ldc=c;
 {const fd=ctx.createGain(),fi=ctx.createGain(),fz=ctx.createWaveShaper(),ft=ctx.createBiquadFilter(),fw=ctx.createGain();fd.gain.value=1;fi.gain.value=1;fw.gain.value=0;
  const n=2048,c=new Float32Array(n),k=2.2,b=.1,o0=Math.atan(k*b),nm=Math.atan(k*(1+b))-o0;for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=(Math.atan(k*(x+b))-o0)/nm}fz.curve=c;fz.oversample='2x'; /* warm overdrive */
  ft.type='lowpass';ft.frequency.value=5200;ft.Q.value=.5;A.ld.connect(fd);fd.connect(pk);A.ld.connect(fi);{const fh=ctx.createBiquadFilter(),pe=ctx.createBiquadFilter(),de=ctx.createBiquadFilter();fh.type='highpass';fh.frequency.value=180;fh.Q.value=.6;pe.type=de.type='highshelf';pe.frequency.value=de.frequency.value=1500;pe.gain.value=6;de.gain.value=-6;
   fi.connect(fh);fh.connect(pe);pe.connect(fz);fz.connect(de);de.connect(ft)} /* brighter notes drive the overdrive harder, like a filter into a pedal */ft.connect(fw);fw.connect(pk);A.fz={fd,fi,fw}} // v0.22 lead bus fuzz (LEAD fader)
 pk.connect(hs);hs.connect(o);o.connect(A.dk);
 /* slow automatic level control: steer the lead bus towards a target loudness */
 const an=ctx.createAnalyser();an.fftSize=2048;hs.connect(an);let ema=0,agc=1;
 setInterval(()=>{if(!playing)return;const buf=METER.read(an,2048);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];const r=Math.sqrt(s/buf.length);
  if(r>.004){ema=ema?ema*.9+r*.1:r;agc=Math.max(.35,Math.min(3,G.ldT*(G.ldMul||1)/ema));o.gain.setTargetAtTime(G.ldOut*agc,ctx.currentTime,.6)}},100)};
const LVQ=[];function leadVoice(g,w){for(let i=LVQ.length-1;i>=0;i--)if(w-LVQ[i].w>2.5)LVQ.splice(i,1);
 while(LVQ.length>=((QOS.floor||0)>=1||(QOS.lvl||0)>=1?2:3)){const o=LVQ.shift();try{o.g.gain.cancelScheduledValues(w);o.g.gain.setTargetAtTime(.0001,w,.06)}catch(e){}
  /* v0.23 perf: the faded note's oscillators stop 0.45 s later instead of running silently to their planned end */
  if(o.src)o.src.forEach(n=>{try{if(n.__e!==Infinity&&n.__e>w+.45)n.stop(w+.45)}catch(e){}})} /* persistent (mono) oscillators are never touched */
 const src=window.__LCOL;window.__LCOL=src?[]:null;LVQ.push({g,w,src})}
const _gen39=generate;generate=function(){_gen39();const P=TR[4].p,ac=P.mode==='Acid 303';
 if(ac){P.res=Math.min(P.res,12);P.envA=Math.min(P.envA,4200)}
 else{P.res=Math.min(P.res,curMood==='Power'?14:6);if(P.eng==='Stack'||P.eng==='Mini'||P.eng==='Saw'||P.eng==='Pulse'||!P.eng){P.cut=Math.min(P.cut,2600);P.envA=Math.min(P.envA,3500)}P.vib=Math.min(P.vib||0,14);P.uni=Math.min(P.uni||1,5);
  if((P.sus||0)>.3)P.pg=Math.min(P.pg||1,2.2)}
 TRIM[4]=(MTRIM[curMood]&&MTRIM[curMood][4]||0)-2;build()};
