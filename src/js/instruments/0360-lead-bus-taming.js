/* ---- v39: lead taming — lead bus (de-harsh EQ + compressor), max 3 overlapping lead notes, calmer generated lead settings ---- */
G.ldOut=.82;
const _init39=init;init=function(){const nw=!ctx;_init39();if(!nw)return;const pk=ctx.createBiquadFilter(),hs=ctx.createBiquadFilter(),c=ctx.createDynamicsCompressor(),o=ctx.createGain();A.ld=ctx.createGain();
 pk.type='peaking';pk.frequency.value=3000;pk.Q.value=1;pk.gain.value=-3.5;hs.type='highshelf';hs.frequency.value=8000;hs.gain.value=-2.5;
 c.threshold.value=-22;c.ratio.value=4;c.knee.value=8;c.attack.value=.004;c.release.value=.16;o.gain.value=G.ldOut;A.ldo=o;A.ldc=c;
 {const fd=ctx.createGain(),fi=ctx.createGain(),fz=ctx.createWaveShaper(),ft=ctx.createBiquadFilter(),fw=ctx.createGain();fd.gain.value=1;fi.gain.value=1;fw.gain.value=0;
  const n=2048,c=new Float32Array(n),k=2.2,b=.1,o0=Math.atan(k*b),nm=Math.atan(k*(1+b))-o0;for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=(Math.atan(k*(x+b))-o0)/nm}fz.curve=c;fz.oversample='2x'; /* warm overdrive */
  ft.type='lowpass';ft.frequency.value=5200;ft.Q.value=.5;A.ld.connect(fd);fd.connect(pk);A.ld.connect(fi);{const fh=ctx.createBiquadFilter(),pe=ctx.createBiquadFilter(),de=ctx.createBiquadFilter();fh.type='highpass';fh.frequency.value=180;fh.Q.value=.6;pe.type=de.type='highshelf';pe.frequency.value=de.frequency.value=1500;pe.gain.value=6;de.gain.value=-6;
   fi.connect(fh);fh.connect(pe);pe.connect(fz);fz.connect(de);de.connect(ft)} /* brighter notes drive the overdrive harder, like a filter into a pedal */ft.connect(fw);fw.connect(pk);A.fz={fd,fi,fw}} // v0.22 lead bus fuzz (LEAD fader)
 pk.connect(hs);hs.connect(o);o.connect(A.dk);
 /* v0.75: the automatic level control on the lead bus is gone (it read the bus ten times a second and kept moving the gain). The lead bus
    gain is now fixed per lead patch — see LK below. */
 ldSet()};
/* v0.75 lead bus level per patch (dB): the gain the old automatic control settled on, measured per patch over many Launches. Applied together
   with the mood's lead level (G.ldMul); set when the patch or mood changes, checked as a note starts (two compares, nothing else). */
const LK={'Acid 303':-9,'Aggro':-4.5,'Bleep':-3,'Bright pluck':2,'Chorus pulse':-1.5,'Cinematic arp':-1.5,'Clean':2,'Dense':-4,'Donk':-3.5,'EP stab':-2,'FM bell':2.5,'FM keys':-8,'Formant wave':-2,'Glass':-0.5,'Hard sync':-0.5,'Hollow BP':-2.5,'Hoover':0.5,'House piano':1.5,'Hypno stab':-0.5,'Metal FM':-2.5,'Mini acid':-0.5,'Mini bass':4,'Mini brass':-1,'Mini drone':1,'Mini edge':6,'Mini fifths':6,'Mini lead':-1.5,'Mini sparkle':-0.5,'Mini wobble':-1,'Mist':-6,'Organ':-4,'Organ stab':-5.5,'Pluck':2,'Rave stab':-7,'Reese':-1,'Rubber blip':0.5,'Soft keys':-3.5,'Soft sine':-0.5,'Space blip':4,'Square chip':-3.5,'String pluck':-4.5,'Sunny keys':-4.5,'Talkbox':-4.5,'Techno stab':-2,'Vowel':-0.5,'Weird drone':-3.5,'West Coast fold':-6,'Wide saw':1};for(const k in LK)LK[k]=Math.pow(10,LK[k]/20);let _ldV=-1,_ldO=null;
function ldSet(){const o=A.ldo;if(!o||!ctx||o.context!==ctx)return;const P=TR[4].p,v=G.ldOut*(G.ldMul||1)*(LK[P.mode==='Acid 303'?'Acid 303':P.patch]||1);if(v===_ldV&&o===_ldO)return;
 const first=o!==_ldO;_ldV=v;_ldO=o;try{if(first)o.gain.value=v;else o.gain.setTargetAtTime(v,ctx.currentTime,.1)}catch(e){}}
const LVQ=[];function leadVoice(g,w){ldSet();for(let i=LVQ.length-1;i>=0;i--)if(w-LVQ[i].w>2.5)LVQ.splice(i,1);
 while(LVQ.length>=((QOS.floor||0)>=1||(QOS.lvl||0)>=1?2:3)){const o=LVQ.shift();try{o.g.gain.cancelScheduledValues(w);o.g.gain.setTargetAtTime(.0001,w,.06)}catch(e){}
  /* v0.23 perf: the faded note's oscillators stop 0.45 s later instead of running silently to their planned end */
  if(o.src)o.src.forEach(n=>{try{if(n.__e!==Infinity&&n.__e>w+.45)n.stop(w+.45)}catch(e){}})} /* persistent (mono) oscillators are never touched */
 const src=window.__LCOL;window.__LCOL=src?[]:null;LVQ.push({g,w,src})}
const _gen39=generate;generate=function(){_gen39();const P=TR[4].p,ac=P.mode==='Acid 303';
 if(ac){P.res=Math.min(P.res,12);P.envA=Math.min(P.envA,4200)}
 else{P.res=Math.min(P.res,curMood==='Power'?14:6);if(P.eng==='Stack'||P.eng==='Mini'||P.eng==='Saw'||P.eng==='Pulse'||!P.eng){P.cut=Math.min(P.cut,2600);P.envA=Math.min(P.envA,3500)}P.vib=Math.min(P.vib||0,14);P.uni=Math.min(P.uni||1,5);
  if((P.sus||0)>.3)P.pg=Math.min(P.pg||1,2.2)}
 TRIM[4]=(MTRIM[curMood]&&MTRIM[curMood][4]||0)-2;build()};
