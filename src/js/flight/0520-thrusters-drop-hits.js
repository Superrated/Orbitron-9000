/* ---- v61: thrusters — chunkier funky claps (set in the v29 block), horn twice as long, two new armable drop hits: noise sweep (snare explosion + pumping white-noise down-sweep) and steel drop (distorted boom + metallic clang into a dotted-8th throw) ---- */
{const g=QD.children[1],AR=[];
 const armBtn=(name,col,fn,pre,prep)=>{const S={arm:0,pre},b=document.createElement('button');b.className='pad';b.style.setProperty('--col',col);
  const lab=()=>{b.innerHTML=name+'<br>'+(S.arm?'▲ ARMED':'○ arm');b.classList.toggle('on',!!S.arm)};lab();b.onclick=()=>{ensure();S.arm=!S.arm;lab();if(S.arm&&prep)setTimeout(prep,30)};
  AR.push(S);S.go=(w,wd)=>{S.arm=0;lab();fn(w,wd)};const hb=[...g.children].find(x=>/^Horn/.test(x.textContent)),last=AR.length>1?AR[AR.length-2].b:hb;S.b=b;if(last)last.after(b);else g.appendChild(b);return b};
 // all armed hits fire together; an armed noise sweep first cuts the sound for a bar, so everything else lands a bar later
 window.dropAll=()=>{if(!ctx)return;const sd=sdur(),gap=AR.some(S=>S.arm&&S.pre),dt=window.__dropT;let w0=dt||align(sd),w=w0;if(gap){w0=dt||align(4*sd); /* v0.24: land on the drop's beat */const a=anchor(),B=16*sd;w=a+Math.ceil((w0+8*sd-a-.001)/B)*B}window.DROPW=w;AR.forEach(S=>{if(S.arm)S.go(S.pre?w0:w,w)})};
 // 1 · noise sweep: snare explosion on the drop, then 4 bars of white noise sweeping down, pumping on every beat
 // pre-rendering: the heavy drop sounds are rendered once when armed, then played back as a buffer (dry + reverb send), so firing them costs almost nothing
 const RC={};const rkey=()=>[G.bpm,G.root,G.scale].join('|');
 function offRender(dur,fn){if(!window.OfflineAudioContext)return Promise.resolve(null);const sr=ctx.sampleRate,oc=new OfflineAudioContext(4,Math.ceil(sr*dur),sr),mer=oc.createChannelMerger(4);mer.connect(oc.destination);
  const bus=(a,b)=>{const g=oc.createGain();g.channelCount=2;g.channelCountMode='explicit';g.channelInterpretation='speakers';const sp=oc.createChannelSplitter(2);g.connect(sp);sp.connect(mer,0,a);sp.connect(mer,1,b);return g};
  const dry=bus(0,1),wet=bus(2,3),sv={ctx,m:A.m,dk:A.dk,sg:A.sg,dI:A.dI,rI:A.rI,duck,rvb:A.rvb,rvbG:A.rvbG,dr:DR.rendering};
  try{ctx=oc;A.m=A.dk=A.sg=dry;A.dI=A.rI=wet;duck=()=>{};A.rvb=null;A.rvbG=null;DR.rendering=true;fn(.02)}catch(e){console.warn(e)}
  finally{ctx=sv.ctx;A.m=sv.m;A.dk=sv.dk;A.sg=sv.sg;A.dI=sv.dI;A.rI=sv.rI;duck=sv.duck;A.rvb=sv.rvb;A.rvbG=sv.rvbG;DR.rendering=sv.dr}
  return oc.startRendering().catch(()=>null)}
 function playR(buf,w,out){const s=mkBuf(),sp=ctx.createChannelSplitter(4),m1=ctx.createChannelMerger(2),m2=ctx.createChannelMerger(2),g=ctx.createGain();s.buffer=buf;s.connect(sp);
  sp.connect(m1,0,0);sp.connect(m1,1,1);sp.connect(m2,2,0);sp.connect(m2,3,1);m1.connect(g);g.connect(out||A.m);m2.connect(A.rI);const t=Math.max(ctx.currentTime,w-.02);s.start(t,t-(w-.02));s.stop(t+buf.duration);return g}
 const cached=n=>RC[n]&&RC[n].k===rkey()&&RC[n].b;
 function prepNoise(){const k=rkey(),sd=sdur();if(RC.np&&RC.np.k===k)return;RC.np={k};
  offRender(3*sd+3.2,t=>{[0,1,2,3].forEach(s=>hit4(t+s*sd))}).then(b=>{if(RC.np&&RC.np.k===k)RC.np.b=b;
   return offRender(64*sd+3,t=>noiseSweepHit(t,1))}).then(b=>{if(RC.np&&RC.np.k===k)RC.np.d=b})}
 function prepSteel(){const k=rkey(),sd=sdur();if(RC.st&&RC.st.k===k)return;RC.st={k};offRender(68*sd+2.5,t=>steelDrop(t,0,1)).then(b=>{if(RC.st&&RC.st.k===k)RC.st.b=b})}
 function hit4(t){rollHit(t,1,210);const o=osc('sine',150,t,t+.12),og=ctx.createGain();o.frequency.exponentialRampToValueAtTime(90,t+.06);og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(.9,t+.002);og.gain.exponentialRampToValueAtTime(.0001,t+.1);o.connect(og);og.connect(A.sg)}
 function gapGate(){if(A.gap)return A.gap;A.gap=ctx.createGain();try{A.lp.disconnect(A.arh)}catch(x){A.lp.disconnect()}A.lp.connect(A.gap);A.gap.connect(A.arh);return A.gap}
 // the roll's own big reverb (lives after the gate, so it rings through the cut and into the drop)
 const RVI={};
 function rollVerb(){if(A.rvb)return A.rvb;const sr=ctx.sampleRate,off=ctx instanceof OfflineAudioContext,n=Math.floor(sr*(off?1.6:2.6)),ir=ctx.createBuffer(2,n,sr);
  /* v0.5 perf: the impulse is computed once per sample rate and copied (it was recomputed for every pre-rendered drop: ~150 ms on a slow phone) */
  const key=sr+(off?'o':'');let D=RVI[key];if(!D){D=[0,1].map(()=>{const d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3.2);return d});RVI[key]=D}   /* pre-rendered drops use a 1.6 s tail: setting up the reverb costs time in proportion to its length */for(let c=0;c<2;c++)ir.copyToChannel(D[c],c)
  const cv=ctx.createConvolver(),hp=ctx.createBiquadFilter(),g=ctx.createGain();cv.buffer=ir;hp.type='highpass';hp.frequency.value=350;g.gain.value=.9;cv.connect(hp);hp.connect(g);g.connect(A.sg);A.rvbG=g;return A.rvb=cv}
 let RWC=null;
 function rollHit(t,v,f){const s=mkBuf(),bp=ctx.createBiquadFilter(),gg=ctx.createGain(),o=mkOsc(),og=ctx.createGain(),ws=ctx.createWaveShaper(),post=ctx.createGain(),pre=ctx.createGain(),cr=ctx.createWaveShaper(),pk=ctx.createBiquadFilter();ws.curve=RWC||(RWC=satCurve(14));cr.curve=crushCurve(.55);pre.gain.value=3;pk.type='peaking';pk.frequency.value=2200;pk.gain.value=6;pk.Q.value=.9;post.gain.value=4.2;
  s.buffer=A.nb;bp.type='bandpass';bp.frequency.value=f*9;bp.Q.value=.8;gg.gain.setValueAtTime(.0001,t);gg.gain.exponentialRampToValueAtTime(v,t+.001);gg.gain.exponentialRampToValueAtTime(.0001,t+.12);
  o.type='triangle';o.frequency.setValueAtTime(f*1.5,t);o.frequency.exponentialRampToValueAtTime(f,t+.03);og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(v*.7,t+.001);og.gain.exponentialRampToValueAtTime(.0001,t+.06);
  s.connect(bp);bp.connect(gg);o.connect(og);gg.connect(pre);og.connect(pre);pre.connect(ws);ws.connect(cr);cr.connect(pk);pk.connect(post);post.connect(A.sg);post.connect(rollVerb());s.start(t,R()*.5);s.stop(t+.14);o.start(t);o.stop(t+.08)}
 function noiseSweep(w0,wd){const sd=sdur(),B=16*sd,gt=gapGate(),w=wd||w0+B;
  gt.gain.cancelScheduledValues(w0);gt.gain.setValueAtTime(1,w0);gt.gain.linearRampToValueAtTime(0,w0+.02);gt.gain.setValueAtTime(0,w-.005);gt.gain.linearRampToValueAtTime(1,w);
  // the roll: steady 16ths, crushed and drenched in reverb — tak tak tak tak … then the sweep
  // four loud hits, then a short dead stop (reverb choked) before everything slams back in
  const okN=cached('np')&&RC.np.d&&RC.np.k===rkey();
  if(okN){const pg=playR(RC.np.b,w0,A.sg);pg.gain.setValueAtTime(1,w-2*sd);pg.gain.linearRampToValueAtTime(0,w-2*sd+.03)}else{[0,1,2,3].forEach(s=>hit4(w0+s*sd));const rg=rollVerb()&&A.rvbG;rg.gain.cancelScheduledValues(w0);rg.gain.setValueAtTime(.9,w0);rg.gain.setValueAtTime(.9,w-2*sd);rg.gain.linearRampToValueAtTime(0,w-2*sd+.03);rg.gain.setValueAtTime(0,w-.01);rg.gain.linearRampToValueAtTime(.9,w)}
  {const s=mkBuf(),hp=ctx.createBiquadFilter(),g=ctx.createGain(),t0=w0+5*sd,t1=w-2*sd;if(t1>t0+.1){s.buffer=A.nb;s.loop=true;hp.type='highpass';hp.Q.value=2;hp.frequency.setValueAtTime(600,t0);hp.frequency.exponentialRampToValueAtTime(7000,t1);
   g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.35,t1-.01);g.gain.linearRampToValueAtTime(0,t1+.005);s.connect(hp);hp.connect(g);g.connect(A.sg);s.start(t0);s.stop(t1+.02)}}
  if(okN){duck(w);playR(RC.np.d,w)}else noiseSweepHit(w)}
 function noiseSweepHit(w){const sd=sdur(),D=64*sd,e=w+D;duck(w);
  // explosion: snare + crushed crack, wide crash, long driven sub drop
  snare(w,1.3);rollHit(w,1,170);nz(w,'bandpass',1400,.7,.6,A.m,.9);
  [-.85,.85].forEach((pp,j)=>{const s=mkBuf(),hp=ctx.createBiquadFilter(),g=ctx.createGain(),pn=ctx.createStereoPanner();s.buffer=A.nb;hp.type='highpass';hp.frequency.value=4500+j*1200;pn.pan.value=pp;
   g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(.32,w+.004);g.gain.exponentialRampToValueAtTime(.0001,w+2.6);s.connect(hp);hp.connect(g);g.connect(pn);send(pn,A.m,0,.6);s.start(w,j*.37);s.stop(w+2.7)});
  {const o=osc('sine',110,w,w+1.8),ws=ctx.createWaveShaper(),gg=ctx.createGain(),lp=ctx.createBiquadFilter();ws.curve=satCurve(4);lp.type='lowpass';lp.frequency.value=260;o.frequency.exponentialRampToValueAtTime(30,w+1.2);
   gg.gain.setValueAtTime(.0001,w);gg.gain.exponentialRampToValueAtTime(.75,w+.004);gg.gain.exponentialRampToValueAtTime(.0001,w+1.7);o.connect(ws);ws.connect(lp);lp.connect(gg);gg.connect(A.m)}
  // the sweep: two resonant noise sweeps (left/right) falling from bright to dark, pumping on every beat
  [[-.6,14000,9],[.6,11000,7]].forEach(([pp,f0,Q],j)=>{const s=mkBuf(),lp=ctx.createBiquadFilter(),hp=ctx.createBiquadFilter(),gg=ctx.createGain(),pn=ctx.createStereoPanner();s.buffer=A.nb;s.loop=true;
   const sat=ctx.createWaveShaper(),cr=ctx.createWaveShaper(),pre=ctx.createGain();sat.curve=satCurve(6);cr.curve=crushCurve(.62);pre.gain.value=2.4;
   lp.type='lowpass';lp.Q.value=Q;lp.frequency.setValueAtTime(f0,w);lp.frequency.exponentialRampToValueAtTime(220+j*60,e);hp.type='highpass';hp.frequency.setValueAtTime(900,w);hp.frequency.exponentialRampToValueAtTime(60,e);
   gg.gain.setValueAtTime(.0001,w);for(let k=0;k<16;k++){const t=w+k*4*sd,L=.24*(1-k/17);gg.gain.setValueAtTime(.006,t+.001);gg.gain.linearRampToValueAtTime(L,t+4*sd*.8)}gg.gain.setValueAtTime(.0001,e);
   pn.pan.setValueAtTime(pp,w);pn.pan.linearRampToValueAtTime(-pp*.4,e);s.connect(hp);hp.connect(lp);lp.connect(pre);pre.connect(sat);sat.connect(cr);cr.connect(gg);gg.connect(pn);send(pn,A.m,.14,.35);s.start(w,j*.3);s.stop(e+.05)})}
 // 2 · steel drop: huge driven 808 sub, growling saw stack, ring-modulated metal clang with a 16th ratchet, gated reverb burst, then a 4-bar modulated dotted-8th throw
 function steelDrop(w,_,off){const sd=sdur();duck(w);if(!off){const b=cached('st');if(b){playR(b,w);return}}
  {const o=osc('sine',150,w,w+2.4),o2=osc('triangle',75,w,w+2.4),pre=ctx.createGain(),ws=ctx.createWaveShaper(),lp=ctx.createBiquadFilter(),gg=ctx.createGain();ws.curve=satCurve(10);pre.gain.value=2.2;lp.type='lowpass';lp.frequency.setValueAtTime(3000,w);lp.frequency.exponentialRampToValueAtTime(220,w+.4);lp.Q.value=1.5;
   o.frequency.exponentialRampToValueAtTime(37,w+.3);o2.frequency.exponentialRampToValueAtTime(37,w+.3);o.connect(pre);o2.connect(pre);pre.connect(ws);ws.connect(lp);lp.connect(gg);
   gg.gain.setValueAtTime(.0001,w);gg.gain.exponentialRampToValueAtTime(.85,w+.003);gg.gain.setTargetAtTime(.55,w+.15,.3);gg.gain.exponentialRampToValueAtTime(.0001,w+2.3);gg.connect(A.m)}
  {let fr=d2f(0,1);while(fr>70)fr/=2;while(fr<35)fr*=2;const q=ctx.createBiquadFilter(),ws=ctx.createWaveShaper(),gg=ctx.createGain();q.type='lowpass';q.Q.value=10;q.frequency.setValueAtTime(2200,w);q.frequency.exponentialRampToValueAtTime(90,w+2);ws.curve=satCurve(6);
   [[1,-.5],[1.012,.5],[2,0],[.5,0]].forEach(([r,pp])=>{const o=osc('sawtooth',fr*r,w,w+2.2),pn=ctx.createStereoPanner();pn.pan.value=pp;o.connect(pn);pn.connect(q)});q.connect(ws);ws.connect(gg);
   gg.gain.setValueAtTime(.0001,w);gg.gain.exponentialRampToValueAtTime(.42,w+.01);gg.gain.exponentialRampToValueAtTime(.0001,w+2.1);gg.connect(A.dk)}
  const dl=ctx.createDelay(1.5),fb=ctx.createGain(),hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter(),dout=ctx.createGain(),pl=ctx.createStereoPanner(),lf=osc('sine',.35,w,w+68*sd),lg=ctx.createGain(),pf=osc('sine',.5,w,w+68*sd),pg=ctx.createGain();
  dl.delayTime.value=Math.min(1.4,3*sd);fb.gain.value=.7;hp.type='highpass';hp.frequency.value=450;lp.type='lowpass';lp.frequency.value=3000;lp.Q.value=3;lg.gain.value=1800;lf.connect(lg);lg.connect(lp.frequency);dout.gain.value=1.4;pg.gain.value=.8;pf.connect(pg);pg.connect(pl.pan);
  dl.connect(hp);hp.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(dout);dout.connect(pl);send(pl,A.m,0,.35);
  const clang=(t,v)=>{const mix=ctx.createGain(),rm=ctx.createGain(),rmo=osc('sine',1370,t,t+1.3),bp=ctx.createBiquadFilter(),ws=ctx.createWaveShaper(),cg=ctx.createGain(),L=ctx.createStereoPanner(),Rr=ctx.createStereoPanner(),hz=ctx.createDelay(.05);
   mix.gain.value=.22;rm.gain.value=0;rmo.connect(rm.gain);bp.type='bandpass';bp.frequency.value=2000;bp.Q.value=.8;ws.curve=satCurve(6);L.pan.value=-.7;Rr.pan.value=.7;hz.delayTime.value=.013;
   [[310,1],[310,1.414],[310,2.37],[517,1],[517,1.73],[517,2.91]].forEach(([b,r],j)=>{const o=osc(j%2?'square':'sawtooth',b*r,t,t+1.3);o.connect(mix)});mix.connect(rm);mix.connect(bp);rm.connect(bp);bp.connect(ws);ws.connect(cg);
   cg.gain.setValueAtTime(.0001,t);cg.gain.exponentialRampToValueAtTime(v,t+.002);cg.gain.exponentialRampToValueAtTime(.0001,t+1.1);cg.connect(L);cg.connect(hz);hz.connect(Rr);send(L,A.m,0,.3);send(Rr,A.m,0,.3);cg.connect(dl);try{cg.connect(rollVerb())}catch(x){}};
  clang(w,.75);[[1,.42],[2,.3],[3,.22]].forEach(([k,v])=>clang(w+k*sd,v));
  nz(w,'highpass',3000,.45,.5,A.m,.5);nz(w,'bandpass',800,.2,.5,A.m,.3);
  fb.gain.setValueAtTime(.7,w+56*sd);fb.gain.linearRampToValueAtTime(0,w+64*sd);
  setTimeout(()=>{try{dl.disconnect();fb.disconnect();lp.disconnect()}catch(x){}},Math.max(0,(w+68*sd-ctx.currentTime)*1000))}
/* v0.35: Sub boom — a deep boom tuned to the key on the drop: a short pitch drop into the root, then it holds (v0.5: heavier, ~2.5 bars). A soft second harmonic keeps it audible on phone speakers; it runs through the bass sidechain so the kick punches through. */
 function subBoom(w){const sd=sdur(),bar=16*sd,len=Math.min(6.5,Math.max(2.4,bar*2.5));let f=440*Math.pow(2,((G.root||0)+12-69)/12);while(f<40)f*=2;while(f>62)f/=2;
  /* v0.5: heavier and more droney — holds its pitch much longer (only a small fall at the end), lasts ~2.5 bars, a slowly beating
     second sine and a low-passed saw layer for weight, a bit more saturation */
  const e=w+len+.1,o=osc('sine',f,w,e),o2=osc('sine',f*1.004,w,e),h=osc('sine',f*2,w,e),sw=osc('sawtooth',f,w,e),hg=ctx.createGain(),sg=ctx.createGain(),slp=ctx.createBiquadFilter(),g=ctx.createGain(),ws=ctx.createWaveShaper();ws.curve=satCurve(2.4);
  [o,o2,h,sw].forEach((x,i)=>{const m=i===2?2:i===1?1.004:1;x.frequency.setValueAtTime(f*m*1.9,w);x.frequency.exponentialRampToValueAtTime(f*m,w+.12);x.frequency.setValueAtTime(f*m,w+len*.6);x.frequency.exponentialRampToValueAtTime(f*m*.84,w+len)});
  hg.gain.setValueAtTime(.24,w);hg.gain.exponentialRampToValueAtTime(.08,w+len*.7);h.connect(hg);hg.connect(ws);
  slp.type='lowpass';slp.frequency.setValueAtTime(220,w);slp.frequency.exponentialRampToValueAtTime(110,w+len*.5);slp.Q.value=.7;sg.gain.value=.2;sw.connect(slp);slp.connect(sg);sg.connect(ws);
  const og=ctx.createGain();og.gain.value=.55;o2.connect(og);og.connect(ws);o.connect(ws);ws.connect(g);
  const v=.6*(TR[6].lv||.55)/.55;g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(v,w+.005);g.gain.setValueAtTime(v,w+.1);g.gain.exponentialRampToValueAtTime(v*.8,w+len*.4);g.gain.exponentialRampToValueAtTime(v*.5,w+len*.75);g.gain.exponentialRampToValueAtTime(.0001,w+len);
  g.connect(A.dkb)}
 armBtn('Noise sweep','#e8f4ff',noiseSweep,1,prepNoise);armBtn('Steel drop','#9dff00',steelDrop,0,prepSteel);armBtn('Sub boom','#ff7a3d',subBoom,0,null);window.orbPrepDrops=[prepNoise,prepSteel]}
