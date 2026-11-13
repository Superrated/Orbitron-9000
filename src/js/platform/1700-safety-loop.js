/* ---- v0.24: SAFETY LOOP — if the audio goes haywire while playing (broken audio values, repeated dropouts, or 2 s of silence while
   tracks should sound), a copy of the current kick pattern (4/4 if the kick is muted or empty) keeps the floor going on its own small audio engine while the
   main engine resets. The live engine comes back on the next bar of that kick, fading in over one bar while the kick fades out.
   v0.8: LIFEBOAT — the loop now steps in BEFORE the glitches get bad, and usually without a reset:
   - the loop is kick + hi-hat (one pre-rendered buffer, almost no CPU), made for the current groove right after every Launch;
   - it starts exactly on the beat, at the same place in the pattern as the live groove;
   - first warning signs (2 dropouts within 3 s, notes arriving late twice within 2 s, or the overload guard at its last stage) start it:
     the live engine fades out over one beat and rests (no new notes, lighter effects) while the loop holds the floor;
   - after two calm bars the live groove fades back in on a bar line while the loop fades out (a Launch hands back on its own bar);
   - only if the trouble goes on (or the audio breaks, or goes silent) is the engine rebuilt, as before, with the loop still playing. ---- */
{let S=null,LP=null,busyR=0,resetting=0,cool=0,quietT=0;
 const now=()=>performance.now(),sd=()=>60/G.bpm/4,bar=()=>240/G.bpm;
 const gcd=(a,b)=>b?gcd(b,a%b):a,lcm=(a,b)=>a/gcd(a,b)*b;
 const sctx=()=>{if(S&&S.state!=='closed')return S;try{S=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});S.suspend()}catch(e){S=null}return S};
 document.addEventListener('pointerdown',()=>{if(!S)sctx()},{once:true,capture:true});
 const wake=()=>{const c=sctx();if(c&&c.state!=='running')c.resume().catch(()=>{});quietT=now()+15000};

 /* ---------- the loop: kick + hat of the current groove, one buffer of 16–64 steps (step 0 = a step where tk % steps == 0) ---------- */
 const sig=p=>Object.keys(p).map(k=>typeof p[k]==='number'?k+(+p[k]).toFixed(3):typeof p[k]==='string'?k+p[k]:'').join(',');
 const render=()=>{if(!ctx||busyR||(window.DR&&DR.rendering)||!window.OfflineAudioContext)return;
  const K=TR[0],H=TR[1],kp=(K.pt||[]).map(x=>x?1:0),hp=(H.pt||[]).map(x=>x?1:0),useK=!K.m&&kp.some(x=>x),useH=!H.m&&hp.some(x=>x),ks=useK?K.st:4,hs=useH?H.st:16;
  const steps=Math.min(64,lcm(16,lcm(ks,hs))),
   key=[G.bpm,G.swing,K.lv,H.lv,sig(K.p),useK?ks+':'+kp.join(''):'4/4',useH?sig(H.p)+hs+':'+hp.join(''):'-'].join('|');
  if(LP&&LP.key===key)return;
  const sr=ctx.sampleRate,s=sd(),n=Math.round(sr*s*steps),oc=new OfflineAudioContext(1,n+Math.round(sr*.7),sr),sink=oc.createGain(),nul=oc.createGain();sink.connect(oc.destination);
  const sv={ctx,ks:A.ks,ksd:A.ksd,m:A.m,ru:A.ru,dI:A.dI,rI:A.rI,duck,OCT,FIX,hg:HH.g,km:K.m,hm:H.m},sw=G.swing*sdur();
  try{ctx=oc;A.ks=sink;A.m=sink;A.ru=nul;A.dI=nul;A.rI=nul;duck=()=>{};OCT=0;FIX=0;HH.g=null;if(window.DR)DR.rendering=true;K.m=false;H.m=false;
   for(let i=0;i<steps;i++){const w=i*s+(i%2?sw:0);
    if(useK?kp[i%ks]:i%4===0)try{fireVoice(0,w)}catch(e){}
    if(useH&&hp[i%hs])try{fireVoice(1,w)}catch(e){}}}
  catch(e){}finally{if(window.DR)DR.rendering=false;ctx=sv.ctx;A.ks=sv.ks;A.ksd=sv.ksd;A.m=sv.m;A.ru=sv.ru;A.dI=sv.dI;A.rI=sv.rI;duck=sv.duck;OCT=sv.OCT;FIX=sv.FIX;HH.g=sv.hg;K.m=sv.km;H.m=sv.hm}
  busyR=1;const bpm=G.bpm;
  oc.startRendering().then(r=>{busyR=0;const d=r.getChannelData(0),o=new Float32Array(n);for(let i=0;i<d.length;i++)o[i%n]+=d[i]; /* fold the tails into the start */
   const c=sctx();if(!c)return;const b=c.createBuffer(1,n,sr);b.copyToChannel(o,0);LP={buf:b,key,steps,bpm}}).catch(()=>{busyR=0})};
 const fresh=()=>LP&&LP.bpm===G.bpm;
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);setTimeout(()=>{try{render()}catch(e){}},window.__inTime?0:1500);return r};
 setInterval(()=>{try{if(playing)render()}catch(e){}},10000);

 /* ---------- holding the floor ---------- */
 const H={on:0,src:null,g:null,c0:0,p0:0,s:0,cut:Infinity,open:Infinity,since:0,warn:0,m0:.8,starts:[]};
 const pos=t=>H.p0+(t-H.c0)/H.s;            // the loop's place, in live steps, at safety-engine time t
 const lat=c=>(c&&((c.outputLatency||0)+(c.baseLatency||0)))||0;
 const toS=t=>S.currentTime+(ctx?t-ctx.currentTime+lat(ctx)-lat(S):0);   // live-engine time → safety-engine time, so both are HEARD together
 /* start the loop at live time t, where the live step number is p (exact grid position, swing is inside the loop) */
 const startLoop=(t,p)=>{const c=S,s=sd(),st=LP.steps,src=c.createBufferSource(),g=c.createGain() /* not mkBuf: the live engine's voice registry must not see it */,cs0=toS(t),cs=Math.max(c.currentTime+.01,cs0),late=cs-cs0;  /* too late for t: join further on */
  src.buffer=LP.buf;src.loop=true;g.gain.value=0;src.connect(g);g.connect(c.destination);
  src.start(cs,((((p%st)+st)%st)*s+late)%LP.buf.duration);g.gain.setValueAtTime(0,cs);g.gain.linearRampToValueAtTime(.9,cs+.004);
  Object.assign(H,{src,g,c0:cs,p0:p+late/s,s})};
 const stopLoop=(t,fade)=>{const{src,g}=H;if(!src)return;H.src=H.g=null;try{g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.9,t);g.gain.linearRampToValueAtTime(0,t+fade);src.stop(t+fade+.05)}catch(e){try{src.stop()}catch(x){}}};
 const say2=m=>{try{if(typeof say==='function')say(m)}catch(e){}};
 /* the live engine rests: no new notes from the moment the loop takes over */
 const gated=w=>H.on&&w>=H.cut&&w<H.open;
 {const _f=fire;fire=function(k,w){if(gated(w))return;return _f.apply(this,arguments)};
  const _p=pad;pad=function(t,w){if(gated(w))return;return _p.apply(this,arguments)};
  const _gr=grains;grains=function(w){if(gated(w))return;return _gr.apply(this,arguments)}}

 const lifeboat=why=>{if(H.on||resetting||!playing||!ctx||ctx.state!=='running'||!fresh()||now()<cool)return false;const c=sctx();if(!c)return false;
  H.on=1;H.since=H.warn=now();H.starts=H.starts.filter(t=>now()-t<30000);H.starts.push(now());
  say2('⚠ LIFEBOAT · '+why.toUpperCase());try{window.orbGuard&&orbGuard.raise(2)}catch(e){}
  c.resume().then(()=>{if(!H.on||!playing||!ctx)return;
   const t=nextT,p=tk;H.cut=t;H.open=Infinity;          // the first step not booked yet: from there the loop plays, the engine rests
   startLoop(t,p);
   try{const m=A.m.gain;H.m0=m.value||.8;m.cancelScheduledValues(t);m.setValueAtTime(H.m0,t);m.linearRampToValueAtTime(0,t+4*sd())}catch(e){}
   if(H.starts.length>=3){H.starts=[];full('keeps failing')}}).catch(()=>{H.on=0});
  return true};
 /* hand back to the live groove on a bar line (or on the given time, e.g. a Launch's bar line) */
 const release=(at,fade)=>{if(!H.on||!H.src||!ctx)return;const s=sd();let tb=at;
  if(!tb){let b=tk+(16-((tk%16)+16)%16)%16;tb=nextT+(b-tk)*s;if(tb-ctx.currentTime<.15)tb+=16*s}
  fade=fade||bar();H.open=tb;
  try{const m=A.m.gain;m.cancelScheduledValues(tb);m.setValueAtTime(0,tb);m.linearRampToValueAtTime(H.m0,tb+fade)}catch(e){}
  stopLoop(toS(tb),fade);
  setTimeout(()=>{H.on=0;H.cut=H.open=Infinity;try{window.orbGuard&&orbGuard.ease()}catch(e){}say2('▶ ENGINE BACK')},(tb-ctx.currentTime+fade)*1000+50)};

 /* the old full rescue: the loop holds the floor while the engine is rebuilt, then the engine comes back on a bar of the loop */
 const full=why=>{if(resetting||!playing||now()<cool&&!H.on)return false;const c=sctx();
  if(!fresh()||!c){cool=now()+20000;H.on=0;try{window.orbResetWhy?orbResetWhy('haywire · '+why):hardReset('haywire')}catch(e){}return true}  /* no loop for this groove yet: plain reset */
  resetting=1;cool=now()+20000;say2('⚠ SAFETY LOOP · '+why.toUpperCase()+' · ENGINE RESETTING');
  c.resume().catch(()=>{});
  if(!H.src){const s=sd(),p=ctx?tk-Math.max(0,(nextT-ctx.currentTime)/s):tk,pi=Math.ceil(p);startLoop(ctx?nextT-(tk-pi)*s:0,pi)}  /* continue the pattern from where it is */
  H.on=0;H.cut=H.open=Infinity;
  try{window.orbResetWhy?orbResetWhy('safety loop · '+why):hardReset('safety loop')}catch(e){}
  let tries=0;const back=setInterval(()=>{tries++;
   if(tries>60||!playing&&tries>10){clearInterval(back);stopLoop(c.currentTime,.3);setTimeout(()=>{resetting=0},400);return}
   if(!ctx||ctx.state!=='running'||!playing||!A.m||!H.src)return;clearInterval(back);
   const P=pos(c.currentTime),Pb=Math.ceil((P+.35/H.s)/16)*16,wait=(Pb-P)*H.s,start=ctx.currentTime+wait,b=16*H.s;
   try{A.m.gain.cancelScheduledValues(ctx.currentTime);A.m.gain.setValueAtTime(0,ctx.currentTime);A.m.gain.setValueAtTime(0,start);A.m.gain.linearRampToValueAtTime(.8,start+b)}catch(e){}
   tk=Pb;nextT=start;stopLoop(c.currentTime+wait,b);
   setTimeout(()=>{resetting=0;say2('▶ ENGINE BACK')},(wait+b+.3)*1000)},100);
  return true};

 /* ---------- watching ---------- */
 let ur=null,ut=[],sk=null,skt=[],cu=null,playT=0;
 setInterval(()=>{if(!ctx||!playing||resetting){ur=null;sk=null;cu=null;return}
  const t=now();if(t-playT<3000)return;      /* the first moments after Play are left to the start-up cushion */
  let ps=null;try{ps=ctx.playbackStats}catch(e){}
  if(ps&&ps.underrunEvents!=null){const u=ps.underrunEvents;if(ur!=null&&u>ur){for(let i=0;i<Math.min(8,u-ur);i++)ut.push(t);ut=ut.filter(x=>t-x<10000);H.warn=t;wake();
    if(ut.length>=6&&(H.on||t-(window.__launchT||-1e9)>10000)){ut=[];full('dropouts')}            // trouble goes on: rebuild
    else if(ut.filter(x=>t-x<3000).length>=2)lifeboat('dropouts')}ur=u}
  const s=(QOS.skips||0)+((window.ORB_ERR&&ORB_ERR.catchups)||0);
  if(sk!=null&&s>sk){skt.push(t);skt=skt.filter(x=>t-x<2000);H.warn=t;wake();if(skt.length>=2){skt=[];lifeboat('late notes')}}sk=s;
  if(H.on&&H.src&&H.open===Infinity){const calm=t-H.warn,held=t-H.since,b=bar()*1000;
   if(calm>2*b&&held>2*b)release();
   else if(held>16*b)full('no recovery')}
  if(!H.on&&S&&S.state==='running'&&t>quietT&&!H.src&&!resetting)S.suspend().catch(()=>{})},250);
 window.orbSafetyWarn=why=>{if(!playing)return;wake();H.warn=now();if(why==='overload')lifeboat('overload')};

 const _t=toggle;toggle=function(){const r=_t.apply(this,arguments);
  if(playing){playT=now();setTimeout(()=>{try{render()}catch(e){}},900)}
  else if(!resetting&&H.on){H.on=0;H.cut=H.open=Infinity;if(H.src&&S)stopLoop(S.currentTime,.05);try{A.m.gain.cancelScheduledValues(0);A.m.gain.value=H.m0}catch(e){}}
  return r};try{$('#play').onclick=toggle}catch(e){}
 /* a Launch while the loop holds: the new groove comes in on its own bar line (or the next one), quicker */
 {const _g2=generate;generate=function(){const r=_g2.apply(this,arguments);if(H.on&&H.src&&!resetting)try{release(window.__launchAt||0,Math.min(1,4*sd()))}catch(e){}return r}}
 // trigger: broken audio values (the NaN watchdog calls orbReset)
 const _r=window.orbReset;window.orbReset=function(){if(playing&&full('broken audio'))return;return _r&&_r.apply(this,arguments)};
 // trigger: silence for 2 s while tracks should sound (not while the lifeboat is holding: then the engine is quiet on purpose)
 let q=0;METER.every(2,()=>{if(!ctx||!playing||resetting||H.on||ctx.state!=='running'){q=0;return}
  const sounding=TR.some(T=>!T.m&&T.pt&&T.pt.some(x=>x));if(!sounding){q=0;return}
  let s;try{s=METER.post().sum}catch(e){return}if(s<1e-10)q++;else q=0;if(q>=4){q=0;full('silence')}});
 window.orbSafety={trigger:full,lifeboat,release,warn:window.orbSafetyWarn,ready:fresh,render,state:()=>({on:H.on,resetting,loop:!!H.src,steps:LP&&LP.steps,drift:H.src&&ctx&&S?+(pos(toS(ctx.currentTime))-(tk-(nextT-ctx.currentTime)/H.s)).toFixed(3):null})}}
