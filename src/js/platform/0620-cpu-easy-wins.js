/* ---- v73: CPU easy wins — pre-rendered hi-hats (2 nodes per hit instead of 8, one shared panner), ladder filter swapped for the cheap version under load, lower visual frame caps ---- */
{const HC=new Map(),HV=3,CAP=12,ST={hit:0,near:0,live:0};let busy=0,next=null;window.orbHatCache=ST;
 /* perf 10: the hat cache key used the exact tone, which the analog drift moves all the time, so the cache kept missing and re-rendering.
    Keys now use 1 % tone steps, 2 ms decay steps and 5 % metal steps (far below hearing), and the hits are rendered at exactly those values.
    v0.8 quick win: 20–48 % of hats were still built live (8 nodes instead of 2), and every hat in moods with a Hat tone / Hat decay LFO.
    Now: tone in 2 % steps and decay in 4 % steps, the hit is played back at the exact tone (playback rate, ≤ 1 % off: inaudible);
    a Hat tone LFO is followed the same way (prepared in 8 % steps, re-pitched to the exact tone) and a Hat decay LFO was already part of the settings; while a new hat is being prepared,
    the nearest prepared one stands in (re-pitched); 12 hats are kept instead of 6, the least recently used goes first. */
 const LT=Math.log(1.02),LD=Math.log(1.04);
 const qv=p=>({tone:Math.pow(1.02,Math.round(Math.log(Math.max(500,+p.tone||7500))/LT)),dec:Math.pow(1.04,Math.round(Math.log(Math.max(.01,+p.dec||.05))/LD)),metal:Math.round((p.metal==null?.6:p.metal)*20)/20});
 let HID=0;const hm=()=>A.hm2?(A.hm2.__id||(A.hm2.__id=++HID)):0;
 const kq=q=>[Math.round(q.tone),Math.round(q.dec*1e4),Math.round(q.metal*100),ctx.sampleRate,hm()].join('|');
 const hkey=p=>kq(qv(p));
 const tone=(p,w)=>(+p.tone||7500)*Math.pow(2,1.2*mv('Hat tone',w));
 function render(key,P){if(!window.OfflineAudioContext)return;if(busy){next=[key,P];return}busy=1;const jobs=[];
  for(const op of[0,1])for(let v=0;v<HV;v++)jobs.push([op,v]);const out={c:[],o:[],q:qv(P)};
  const one=([op])=>{const d=op?.32:out.q.dec,sr=ctx.sampleRate,oc=new OfflineAudioContext(2,Math.ceil(sr*(d+.08)),sr),T=TR[1],sv={ctx,m:A.m,dI:A.dI,rI:A.rI,hg:HH.g,lv:T.lv,open:T.p.open,acc:T.p.acc,mv};
   const kp={tone:T.p.tone,dec:T.p.dec,metal:T.p.metal};
   try{ctx=oc;A.m=oc.destination;A.dI=oc.createGain();A.rI=oc.createGain();HH.g=null;T.lv=1;T.p.open=op;T.p.acc=0;Object.assign(T.p,out.q);
    mv=(tg,t)=>tg==='Hat tone'||tg==='Hat pan'?0:sv.mv(tg,t);_fv73(1,0)}catch(e){console.warn(e)}
   finally{mv=sv.mv;ctx=sv.ctx;A.m=sv.m;A.dI=sv.dI;A.rI=sv.rI;HH.g=sv.hg;T.lv=sv.lv;T.p.open=sv.open;T.p.acc=sv.acc;Object.assign(T.p,kp)}return oc.startRendering()};
  (async()=>{try{for(const j of jobs){const b=await one(j);(j[0]?out.o:out.c).push(b)}HC.set(key,out);if(HC.size>CAP)HC.delete(HC.keys().next().value)}catch(e){}busy=0;
   if(next){const[k2,P2]=next;next=null;if(!HC.has(k2)&&ctx)render(k2,P2)}})()}
 /* the prepared hat closest to q (same metal, decay within 25 %, tone within 15 %), or null */
 const near=q=>{let best=null,bd=1e9;for(const c of HC.values()){if(c.q.metal!==q.metal)continue;const dd=Math.abs(Math.log(c.q.dec/q.dec)),dt=Math.abs(Math.log(c.q.tone/q.tone));if(dd>.22||dt>.14)continue;const d=dt+dd;if(d<bd){bd=d;best=c}}return best};
 let pan=null;const hatBus=()=>{if(pan&&pan.context===ctx)return pan;pan=vtag(ctx.createGain());send(pan,A.m,0,.05);return pan};
 const _fv73=fireVoice;fireVoice=function(k,w){if(k!==1||!ctx||ctx instanceof OfflineAudioContext)return _fv73(k,w);if((TR[1].pan||0)!==0){ST.live++;return _fv73(k,w)}
  const T=TR[1],p=T.p,tn=tone(p,w),q=qv({tone:tn,dec:p.dec,metal:p.metal});if(tn!==(+p.tone||7500))q.tone=Math.pow(1.08,Math.round(Math.log(tn)/Math.log(1.08)));   /* a moving tone: 8 % steps, so the sweep needs only a few prepared hats */
  const key=kq(q);let c=HC.get(key);
  if(c){HC.delete(key);HC.set(key,c);ST.hit++}else{render(key,Object.assign({},p,{tone:q.tone}));c=near(q);if(!c){ST.live++;return _fv73(k,w)}ST.near++}
  const op=R()<p.open,bs=op?c.o:c.c;if(!bs.length)return _fv73(k,w);const v=T.lv,pk=(1-p.acc*R()*.8)*(op?1:1);
  if(HH.g){const cg=HH.g;HH.g=null;try{cg.gain.cancelScheduledValues(w);cg.gain.setTargetAtTime(.0001,w,.005)}catch(e){}}
  const s=mkBuf(),g=ctx.createGain();s.buffer=bs[Math.floor(R()*bs.length)];const r=tn/c.q.tone;if(r<.999||r>1.001)s.playbackRate.value=r;
  g.gain.value=v*pk*Math.pow(c.q.tone/tn,.25);s.connect(g);{const sp=mv('Hat pan',w);if(sp){const q2=ctx.createStereoPanner();q2.pan.value=Math.max(-1,Math.min(1,.18+.8*sp));g.connect(q2);routeTrack(q2,null,hatBus())}else routeTrack(g,null,hatBus())}s.start(w);if(op)HH.g=g};
 /* v0.8: a Launch while playing prepares the new hat sound before its first bar (launch/1690); Play does too (platform/1700 calls it) */
 window.orbHatWarm=()=>{if(!ctx||(TR[1].pan||0)!==0)return;const p=TR[1].p,key=hkey(p);if(!HC.has(key))render(key,p)};
 // Mini ladder: under load use the two-biquad version (no worklet node per note)
 const _mv73=miniVoice;miniVoice=function(w){const l=A.ladder;if((QOS.ml||0)>=2)A.ladder=false;try{_mv73(w)}finally{A.ladder=l}};
 // visuals: lower frame caps (the star map still reads smoothly)
 const capQ=()=>{if(QOS.fps>40)QOS.fps=Math.min(QOS.fps,48);if(/Android|iPhone|iPad|Mobile/.test(navigator.userAgent)&&QOS.fps>24)QOS.fps=24};capQ();setInterval(capQ,2000)}
