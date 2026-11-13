/* ---- v73: CPU easy wins — pre-rendered hi-hats (2 nodes per hit instead of 8, one shared panner), ladder filter swapped for the cheap version under load, lower visual frame caps ---- */
{const HC={},HV=3;let busy=0;
 /* perf 10: the hat cache key used the exact tone, which the analog drift moves all the time, so the cache kept missing and re-rendering.
    Keys now use 1 % tone steps, 2 ms decay steps and 5 % metal steps (far below hearing), and the hits are rendered at exactly those values.
    Only LFOs that move the hat SOUND (tone, decay) bypass the cache; a Hat hits LFO no longer does. */
 const qv=p=>({tone:Math.pow(1.01,Math.round(Math.log(Math.max(500,+p.tone||7500))/Math.log(1.01))),dec:Math.round((+p.dec||.05)*500)/500,metal:Math.round((p.metal==null?.6:p.metal)*20)/20});
 const hkey=p=>{const q=qv(p);return [Math.round(q.tone),Math.round(q.dec*1000),Math.round(q.metal*100),ctx.sampleRate,A.hm2?(A.hm2.__id||(A.hm2.__id=++HID)):0].join('|')};let HID=0;
 const lfoOnHat=()=>LFOS.some(L=>L.d>0&&/^Hat (tone|decay)/.test(L.tg));
 function render(key,P){if(busy||!window.OfflineAudioContext)return;busy=1;const jobs=[];
  for(const op of[0,1])for(let v=0;v<HV;v++)jobs.push([op,v]);const out={c:[],o:[]};
  const one=([op])=>{const d=op?.32:P.dec,sr=ctx.sampleRate,oc=new OfflineAudioContext(2,Math.ceil(sr*(d+.08)),sr),T=TR[1],sv={ctx,m:A.m,dI:A.dI,rI:A.rI,hg:HH.g,lv:T.lv,open:T.p.open,acc:T.p.acc};
   const q=qv(P),kp={tone:T.p.tone,dec:T.p.dec,metal:T.p.metal};
   try{ctx=oc;A.m=oc.destination;A.dI=oc.createGain();A.rI=oc.createGain();HH.g=null;T.lv=1;T.p.open=op;T.p.acc=0;Object.assign(T.p,q);_fv73(1,0)}catch(e){console.warn(e)}
   finally{ctx=sv.ctx;A.m=sv.m;A.dI=sv.dI;A.rI=sv.rI;HH.g=sv.hg;T.lv=sv.lv;T.p.open=sv.open;T.p.acc=sv.acc;Object.assign(T.p,kp)}return oc.startRendering()};
  (async()=>{try{for(const j of jobs){const b=await one(j);(j[0]?out.o:out.c).push(b)}HC[key]=out;const ks=Object.keys(HC);if(ks.length>6)delete HC[ks[0]]}catch(e){}busy=0})()}
 let pan=null;const hatBus=()=>{if(pan&&pan.context===ctx)return pan;pan=vtag(ctx.createGain());send(pan,A.m,0,.05);return pan};
 const _fv73=fireVoice;fireVoice=function(k,w){if(k!==1||!ctx||ctx instanceof OfflineAudioContext||lfoOnHat()||(TR[1].pan||0)!==0)return _fv73(k,w);
  const T=TR[1],p=T.p,key=hkey(p),c=HC[key];if(!c){render(key,p);return _fv73(k,w)}
  const op=R()<p.open,bs=op?c.o:c.c;if(!bs.length)return _fv73(k,w);const v=T.lv,pk=(1-p.acc*R()*.8)*(op?1:1);
  if(HH.g){const cg=HH.g;HH.g=null;try{cg.gain.cancelScheduledValues(w);cg.gain.setTargetAtTime(.0001,w,.005)}catch(e){}}
  const s=mkBuf(),g=ctx.createGain();s.buffer=bs[Math.floor(R()*bs.length)];g.gain.value=v*pk;s.connect(g);{const sp=mv('Hat pan',w);if(sp){const q=ctx.createStereoPanner();q.pan.value=Math.max(-1,Math.min(1,.18+.8*sp));g.connect(q);routeTrack(q,null,hatBus())}else routeTrack(g,null,hatBus())}s.start(w);if(op)HH.g=g};
 // Mini ladder: under load use the two-biquad version (no worklet node per note)
 const _mv73=miniVoice;miniVoice=function(w){const l=A.ladder;if((QOS.ml||0)>=2)A.ladder=false;try{_mv73(w)}finally{A.ladder=l}};
 // visuals: lower frame caps (the star map still reads smoothly)
 const capQ=()=>{if(QOS.fps>40)QOS.fps=Math.min(QOS.fps,48);if(/Android|iPhone|iPad|Mobile/.test(navigator.userAgent)&&QOS.fps>24)QOS.fps=24};capQ();setInterval(capQ,2000)}
