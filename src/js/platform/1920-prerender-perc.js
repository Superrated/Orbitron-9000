
/* ---- v0.3 perf: conga, cowbell and rim hits are pre-rendered like the other drums. Each distinct hit (pitch, high/low, decay, bend,
   noise, filter) is rendered once in idle time and then played from memory: 3 audio nodes per hit instead of 7. Sound is unchanged. ---- */
{const PR={cache:new Map(),pend:new Set(),hits:0,live:0};window.orbPercCache=PR;
 const pk2=salt=>{const T=TR[3],pos=((tk%T.st)+T.st)%T.st,h=Math.sin((pos+1)*78.233+((T.p.mseed||1)+salt)*12.9898)*43758.5453;return h-Math.floor(h)};
 const r3=x=>Math.round(x*1000)/1000;
 const congaP=w=>{const T=TR[3],p=T.p,c=(typeof chordAt==='function'?chordAt(w):cur)||cur,n=SC[G.scale].length,ch=((c&&c.n&&c.n.length)?c.n:[0,2,4]).map(x=>((x%n)+n)%n),hi=pk2(3)<.5,sO=OCT,sF=FIX;
  OCT=0;FIX=0;let f;try{f=d2f(ch[0]+(hi?4:0)+Math.round(4*mv('Perc pitch',w)),3)}finally{OCT=sO;FIX=sF}while(f<110)f*=2;while(f>330)f/=2;f*=Math.pow(2,Math.round((p.oct||4)-4));
  return{t:'cg',f:r3(f),hi:hi?1:0,dec:r3(Math.max(.08,Math.min(.8,(p.dec||.15)*1.6))),bend:r3(p.bend||0),noise:r3(p.noise||.2),filt:Math.round(Math.max(300,Math.min(12000,p.filt||8000))),v:T.lv*.78,pan:hi?.25:-.2}};
 const bellP=w=>{const T=TR[3],p=T.p,bell=pk2(7)<.55;return{t:'cb',bell:bell?1:0,o2:Math.pow(2,Math.round((p.oct||4)-4)),dec:r3(bell?Math.max(.12,Math.min(.9,(p.dec||.15)*2)):.03),filt:Math.round(Math.max(300,Math.min(12000,p.filt||8000))),v:T.lv*1.06,pan:bell?.15:-.15}};
 const key=P=>P.t==='cg'?['cg',P.f,P.hi,P.dec,P.bend,P.noise,P.filt].join('|'):['cb',P.bell,P.o2,P.dec,P.filt].join('|');
 // the same voices as before, built at full level into `out` on context c
 const build=(c,out,P,w)=>{const O=(ty,f,t,e)=>{const o=mkOsc(c);o.type=ty;o.frequency.value=f;o.start(t);o.stop(e);return o};const g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=P.filt;lp.Q.value=.6;
  if(P.t==='cg'){const f=P.f,dec=P.dec,o=O('sine',f,w,w+dec+.05),ns=mkBuf(c),nb=c.createBiquadFilter(),ng=c.createGain();
   o.frequency.setValueAtTime(f*(1.25+P.bend*.5),w);o.frequency.exponentialRampToValueAtTime(f,w+.03);g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(1,w+.002);g.gain.exponentialRampToValueAtTime(.0001,w+dec);
   ns.buffer=A.nb;nb.type='bandpass';nb.frequency.value=P.hi?3200:2200;nb.Q.value=1.2;ng.gain.setValueAtTime(Math.min(1.2,.3+P.noise*2),w);ng.gain.exponentialRampToValueAtTime(.0001,w+.025);ns.connect(nb);nb.connect(ng);ns.start(w,.13);ns.stop(w+.04);
   o.connect(g);g.connect(lp);ng.connect(lp)}
  else if(P.bell){const dec=P.dec,o2=P.o2,a=O('square',540*o2,w,w+dec+.05),b=O('square',800*o2,w,w+dec+.05),bp=c.createBiquadFilter(),ag=c.createGain();
   ag.gain.value=.5;bp.type='bandpass';bp.frequency.value=1700*o2;bp.Q.value=1;a.connect(ag);b.connect(ag);ag.connect(bp);bp.connect(g);
   g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(1,w+.002);g.gain.exponentialRampToValueAtTime(.32,w+.03);g.gain.exponentialRampToValueAtTime(.0001,w+dec);g.connect(lp)}
  else{const o2=P.o2,a=O('sine',1700*o2,w,w+.05),b=O('triangle',455*o2,w,w+.05),hg=c.createGain();hg.gain.value=.6;a.connect(g);b.connect(hg);hg.connect(g);
   g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(.9,w+.001);g.gain.exponentialRampToValueAtTime(.0001,w+.03);g.connect(lp)}
  lp.connect(out)};
 const request=(k,P)=>{if(PR.pend.has(k)||!window.OfflineAudioContext)return;PR.pend.add(k);const sr=ctx.sampleRate,run=()=>{try{const oc=new OfflineAudioContext(1,Math.ceil(sr*(P.dec+.12)),sr);build(oc,oc.destination,P,0);
   oc.startRendering().then(b=>{if(PR.cache.size>40)PR.cache.delete(PR.cache.keys().next().value);PR.cache.set(k,b);PR.pend.delete(k)}).catch(()=>PR.pend.delete(k))}catch(e){PR.pend.delete(k)}};
  window.requestIdleCallback?requestIdleCallback(run,{timeout:300}):setTimeout(run,0)};
 const _fv=fireVoice;fireVoice=function(k,w){if(k!==3||!ctx||ctx instanceof OfflineAudioContext)return _fv.apply(this,arguments);const p=TR[3].p,pv=p.pv;if(pv!=='Conga'&&pv!=='Cowbell')return _fv.apply(this,arguments);
  try{const P=pv==='Conga'?congaP(w):bellP(w),kk=key(P),b=PR.cache.get(kk),g=ctx.createGain(),pn=ctx.createStereoPanner();g.gain.value=P.v;pn.pan.value=P.pan;g.connect(pn);
   if(b){const s=mkBuf();s.buffer=b;s.connect(g);s.start(w);s.stop(w+b.duration+.01);PR.hits++}else{build(ctx,g,P,w);request(kk,P);PR.live++}
   send(pn,A.m,p.ds,p.rs)}catch(e){return _fv.apply(this,arguments)}}}
