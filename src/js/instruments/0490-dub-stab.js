/* ---- v56: Dub stab v2 — 24 dB resonant low-pass with its own envelope, saw↔square, width, drive, bar-synced filter sweeps (woosh), noise air, dedicated filtered ping-pong dub echo ---- */
Object.assign(TR[8].p,{res:6,fdec:.22,wave:0,wid:.5,drv:.2,swd:0,swb:4,sws:0,air:0,eko:.25,etm:3,efb:.55,etn:2200});
TR[8].x=[['Decay','dec',.05,.8,.01],['Cutoff','cut',100,4000,10],['Resonance','res',.5,22,.1],['Env amount','envA',0,6000,50],['Filter decay','fdec',.02,1.2,.01],
 ['Sweep depth','swd',0,1,.01],['Sweep bars','swb',1,16,1],['Sweep shape','sws',0,3,1],['Air (noise)','air',0,1,.01],
 ['Saw↔Square','wave',0,1,.01],['Detune ¢','det',0,30,1],['Width','wid',0,1,.01],['Drive','drv',0,1,.01],['Octave','oct',2,5,1],['Chord notes','size',2,4,1],
 ['Dub echo','eko',0,1,.01],['Echo 16ths','etm',1,8,1],['Echo feedback','efb',0,.9,.01],['Echo tone','etn',400,8000,50],['Delay send','ds',0,1,.01],['Reverb send','rs',0,1,.01]];
function stabEcho(){if(A.se)return A.se;const i=vtag(ctx.createGain()),L=ctx.createDelay(2),Rr=ctx.createDelay(2),lp=ctx.createBiquadFilter(),hp=ctx.createBiquadFilter(),ws=ctx.createWaveShaper(),fb=ctx.createGain(),x=ctx.createGain(),pl=ctx.createStereoPanner(),pr=ctx.createStereoPanner(),o=ctx.createGain();
 lp.type='lowpass';lp.frequency.value=2200;lp.Q.value=.9;hp.type='highpass';hp.frequency.value=280;ws.curve=satCurve(1.4);fb.gain.value=.55;x.gain.value=1;pl.pan.value=-.75;pr.pan.value=.75;o.gain.value=.4;
 i.connect(L);L.connect(lp);lp.connect(hp);hp.connect(ws);ws.connect(x);x.connect(Rr);Rr.connect(fb);fb.connect(L);L.connect(pl);Rr.connect(pr);pl.connect(o);pr.connect(o);o.__keep=1;send(o,A.dk,0,.25); /* v0.89: shared echo, not unplugged with the voice that built it (platform/0040) */
 return A.se={i,L,R:Rr,lp,fb}}
function stabSweep(p,w){const d=p.swd||0;if(d<.01)return 1;const len=Math.max(1,Math.round(p.swb||4))*16*sdur(),a=anchor(),ph=(((w-a)/len)%1+1)%1,sh=Math.round(p.sws||0);let u;
 if(sh===0)u=-Math.cos(ph*2*Math.PI);else if(sh===1)u=ph*2-1;else if(sh===2)u=1-ph*2;else{const k=Math.floor((w-a)/(len/4));u=Math.sin(k*12.9898+(p.swb||4)*78.233)*2;u=u-Math.floor(u)*1;u=Math.sin(k*91.7)}
 return Math.pow(2,u*d*3.2)}
const SDC={};let SDG=2.2;function dubStab(w){OCT=G.oct||0;const T=TR[8],p=T.p,sd=sdur(),e=w+p.dec+.45,q1=ctx.createBiquadFilter(),q2=ctx.createBiquadFilter(),g=ctx.createGain(),mix=ctx.createGain(),ws=ctx.createWaveShaper();
 const sm=Math.pow(2,2*mv("Stab cutoff",w))*stabSweep(p,w),sm2=stabSweep(p,w+p.dec),res=Math.max(.5,p.res||6),cb=Math.max(40,Math.min(14000,p.cut*sm)),cb2=Math.max(40,Math.min(14000,p.cut*sm2)),pk=Math.min(17000,cb+(p.envA||0)*Math.sqrt(sm));
 [q1,q2].forEach(q=>{q.type='lowpass';q.frequency.setValueAtTime(pk,w);q.frequency.exponentialRampToValueAtTime(Math.max(40,cb2),w+Math.max(.02,p.fdec||.22))});q1.Q.value=res;q2.Q.value=.7;
 const dr=p.drv||0,dk=Math.round((1+dr*3)*20)/20;ws.curve=SDC[dk]||(SDC[dk]=(()=>{const n=1024,c=new Float32Array(n),tk=Math.tanh(dk);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(x*dk)/tk}return c})());mix.gain.value=.3;
 /* v0.31: the two side panners are shared by all chord notes (same pan for every note anyway), gains at full level are skipped,
    and on Eco / Survival each note plays one oscillator on alternating sides instead of a detuned pair (level made up) */
 const wv=p.wave||0,ns=cur.n.slice(0,Math.round(p.size)),lite=(QOS.floor||0)>=1,PNS={},pnFor=c=>{if(PNS[c])return PNS[c];const x=ctx.createStereoPanner();x.pan.value=c*(p.wid||0)*.8;x.connect(mix);return PNS[c]=x};
 ns.forEach((d,j)=>(lite?[j%2?1:-1]:[-1,1]).forEach(c=>{const f=d2f(d,p.oct),pn=pnFor(c);
   [['sawtooth',1-wv],['square',wv*.42]].forEach(([ty,lv])=>{if(lv<.02)return;lv*=lite?1.9:1;const o=osc(ty,f,w,e);o.detune.value=c*p.det+(R()-.5)*4+(p.chop?Math.sin(w*.37)*9*p.chop:0);if(Math.abs(lv-1)<.01)o.connect(pn);else{const og=ctx.createGain();og.gain.value=lv;o.connect(og);og.connect(pn)}})}));
 if(p.air>.01){const s=mkBuf(),ag=ctx.createGain();s.buffer=A.nb;s.loop=true;ag.gain.setValueAtTime(.0001,w);ag.gain.linearRampToValueAtTime(p.air*.9,w+.01);ag.gain.exponentialRampToValueAtTime(.0001,w+p.dec+.2);s.connect(ag);ag.connect(mix);s.start(w,R()*.5);s.stop(e)}
 mix.connect(ws);ws.connect(q1);q1.connect(q2);if((p.chop||0)>.01){const cr=ctx.createWaveShaper(),hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter(),cg=ctx.createGain();cr.curve=crushCurve(.55+.3*p.chop);hp.type='highpass';hp.frequency.value=160+140*p.chop;lp.type='lowpass';lp.frequency.value=7500-2500*p.chop;cg.gain.value=1+.4*p.chop;q2.connect(cr);cr.connect(hp);hp.connect(lp);lp.connect(cg);cg.connect(g)}else q2.connect(g);
 const rc=SDG/(1+Math.max(0,res-2)*.06)/(1+dr*.5);env(g,w,T.lv*.15*rc,p.dec+.05,.004);send(g,A.dk,p.ds,p.rs);
 if(p.eko>.01){const E=stabEcho(),t=ctx.currentTime,dt=Math.min(1.9,Math.round(p.etm||3)*sd);E.L.delayTime.setTargetAtTime(dt,t,.05);E.R.delayTime.setTargetAtTime(dt,t,.05);E.fb.gain.setTargetAtTime(Math.min(.9,p.efb||.5),t,.05);E.lp.frequency.setTargetAtTime(p.etn||2200,t,.05);
  const es=ctx.createGain();es.gain.value=p.eko;g.connect(es);routeTrack(es,null,E.i);setTimeout(()=>{try{es.disconnect()}catch(x){}},Math.max(0,(e-ctx.currentTime)*1000+200))}}
stab=function(w){const T=TR[8],o=T.lv;T.lv=o*dbg(TRIM[8]);try{dubStab(w)}finally{T.lv=o}};
// generator: give the stab a per-mood character, with wild sweeps in the techno-ish moods
{const SM={Power:[.6,.95,12,22,.3],Dark:[.4,.8,8,16,.45],Tense:[.4,.85,8,18,.35],Acid:[.3,.7,10,20,.3],Noir:[.2,.5,5,12,.6],'Deep Space':[.3,.6,4,10,.7],Breaks:[.1,.5,4,12,.3],Italo:[0,.2,3,8,.15],'The Touch':[0,.35,3,9,.2]};
 const _g56=generate;generate=function(){_g56.apply(this,arguments);const P=TR[8].p,s=SM[curMood]||[0,.4,3,10,.3],rr=(a,b)=>a+R()*(b-a);
  Object.assign(P,{res:+rr(s[2],s[3]).toFixed(1),fdec:+rr(.1,.4).toFixed(2),wave:R()<.3?+rr(.3,.8).toFixed(2):0,wid:+rr(.3,.8).toFixed(2),drv:+rr(.05,.35).toFixed(2),
   swd:R()<.75?+rr(s[0],s[1]).toFixed(2):0,swb:pick([2,4,4,8,8,16]),sws:pick([0,0,1,2,3]),air:R()<.5?+rr(.1,.45).toFixed(2):0,
   eko:+rr(s[4]*.5,s[4]).toFixed(2),etm:pick([3,3,6,4,2]),efb:+rr(.35,.7).toFixed(2),etn:pick([1200,1800,2500,3500])})}}
