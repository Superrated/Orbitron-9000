/* ---- v130: Low-pass fader (Flight tab, bottom). Holds where you leave it. Open (right) = untouched sound and no extra routing.
   Pulling left closes the synths first; the drums start closing only past ~45% of the travel. Echo and reverb sends close with
   their source. While the fader is not fully open, every sound a track creates is tagged; wherever such a sound leaves the track
   (into any shared bus: master, ducked bus, lead bus, rumble, hat/perc stages, delay, reverb, shimmer) it passes its group's filter.
   Nothing is tagged or rerouted while the fader is fully open.
   v0.8: a bipolar DJ filter. The fader rests in the CENTRE (open). Left = the low-pass as before (synths first, then drums; kick stays).
   Right = high-pass: everything thins from the bottom up, kick and bass first, with a resonant edge — the classic build-up sweep.
   The same filters switch type when the fader crosses the centre (frequency jumps to the open edge first, so there is no click). ---- */
{const LP={v:1,h:0,ctx:null,dest:null,f:{syn:new Map(),drm:new Map(),pad:new Map()}};const PZ=.70,VV=(v=LP.v)=>Math.min(1,v/PZ);let CURG=null;const DRK=new Set([1,2,3,7]);
 const DZ=.45;const cur=(v0=LP.v)=>{const v=VV(v0),op=v>=.999,a=Math.max(0,Math.min(1,(v-DZ)/(1-DZ))),
   fs=v>=DZ?650*Math.pow(20000/650,Math.pow(a,.9)):60*Math.pow(650/60,v/DZ),vd=Math.min(1,v/DZ);
  const fd=op||vd>=1?20000:140*Math.pow(20000/140,Math.pow(vd,.9));
  // per group: [cutoff, Q of the 2nd stage (resonance bump, eased below 300 Hz), makeup gain]
  const res=(f,top)=>{const cl=1-Math.log(f/60)/Math.log(20000/60);const q=1.31*(1+top*cl);return f<300?1.31+(q-1.31)*Math.max(0,(f-90)/210):q},
   mk=(f,db)=>{const cl=Math.max(0,1-Math.log(f/60)/Math.log(20000/60));return Math.pow(10,db*cl/20)};
  // pads: the first 30 % of the travel darkens only the pads (filter down to about 800 Hz, level unchanged, no resonance); after that they follow the synths
  const pt=v0>=PZ?(1-v0)/(1-PZ):1,pf=v0>=.999?20000:Math.min(20000*Math.pow(800/20000,pt),op?20000:fs),pg=1;
  return{syn:[op?20000:fs,op?1.31:res(fs,.2),op?1:mk(fs,3)],drm:[fd,fd>=19999?1.31:res(fd,.12),fd>=19999?1:mk(fd,2)],pad:[pf,1.31,pg]}};
 /* v0.8 high-pass side: h 0…1 → cutoff 20 Hz … 2.6 kHz (drums 1.4 kHz, so hats and snare tops stay), resonance grows, a little makeup gain */
 const hpc=(h=LP.h)=>{const e=Math.pow(h,1.15),q=1.31*(1+1.6*h),g=Math.pow(10,4.5*h/20),f=top=>20*Math.pow(top/20,e);return{syn:[f(2600),q,g],drm:[f(1400),q,g],pad:[f(2600),q,g]}};
 const TY=()=>LP.h>0?'highpass':'lowpass',curA=()=>LP.h>0?hpc():cur(),eng=()=>LP.v<.999||LP.h>.001;
 function prep(){if(LP.ctx===ctx&&LP.dest)return;LP.ctx=ctx;LP.f={syn:new Map(),drm:new Map(),pad:new Map()};LP.dest=1}
 function bus(gk,d){let f=LP.f[gk].get(d);if(!f){const c=curA()[gk],f1=ctx.createBiquadFilter(),f2=ctx.createBiquadFilter(),g=ctx.createGain();
   f1.type=f2.type=TY();f1.Q.value=.54;f1.frequency.value=f2.frequency.value=c[0];f2.Q.value=c[1];g.gain.value=c[2];f1.connect(f2);f2.connect(g);g.connect(d);f1.__lpf=1;f={f1,f2,g};LP.f[gk].set(d,f)}return f.f1}
 /* a voice output leaving its track passes its group's filter (only while the fader is engaged: CURG is set by wrap() below) */
 RT.lpOn=()=>!!CURG;
 RT.lp=d=>(CURG&&LP.dest&&LP.ctx===ctx&&!(d instanceof AudioDestinationNode)&&!d.__lpf)?bus(CURG,d):d;
 function apply(){if(!ctx||LP.ctx!==ctx)return;const c=curA(),t=ctx.currentTime,ty=TY();['syn','drm','pad'].forEach(g=>LP.f[g].forEach(f=>{[f.f1,f.f2].forEach(b=>{b.frequency.cancelScheduledValues(t);if(b.type!==ty){b.type=ty;b.frequency.setValueAtTime(ty==='highpass'?20:20000,t)}b.frequency.setTargetAtTime(c[g][0],t,.03)});f.f2.Q.setTargetAtTime(c[g][1],t,.05);f.g.gain.setTargetAtTime(c[g][2],t,.05)}))}
 const wrap=(fn,g)=>function(){if(!eng()||!ctx||(window.DR&&DR.rendering))return fn.apply(this,arguments);const gg=typeof g==='function'?g(arguments[0]):g;if(!gg)return fn.apply(this,arguments);prep();const o=CURG;CURG=gg;try{return fn.apply(this,arguments)}finally{CURG=o}};
 fire=wrap(fire,k=>k===0?(LP.h>0?'drm':null):DRK.has(k)?'drm':k===5?'pad':'syn');window.lpRun=(g,fn)=>wrap(fn,g)();pad=wrap(pad,'pad');grains=wrap(grains,'syn');
 // energy thinning: stage 1 from 65 % of travel, 2 below ~39 %, 3 below ~18 %. Strong positions survive; the kick never thins.
 /* v0.26: thinning has its own THIN fader (0 = every note … 1 = only the strongest hits); the low-pass is filter only */
 const TH={v:0,m:0};window.THIN=TH;const thin=()=>{const t=TH.v;return t>=.9?4:t>=.65?3:t>=.4?2:t>=.12?1:0};   // all three stages arrive before the drum filter starts (DZ .45)
 const pushed=k=>(k===1&&window.rigidHats&&rigidHats.on())||(window.breakFX&&breakFX.is()&&(k===1||k===2||k===3||k===7)); /* v0.22: a percussion push keeps every hit of its own track */
 /* v0.8 MUSICAL ORDER: no more four coarse stages. Every note gets a score = how strong its spot in the bar is (downbeat 5, half bar 4,
    quarter 3, 8th 2, off-16th 1) + how much the track carries the groove (perc 0 … bass 1.6, snare/clap backbeat +1.5). As you pull left
    the cut-off line rises smoothly, so the weakest notes of the whole groove go first, across all tracks at once, and only the bones are
    left at the end (bass on the one, backbeat, the strongest lead/stab notes). Lead, bass, stab and satellite keep at least their first
    note of each bar until the last 15 %, so no part disappears early. */
 const W16=[5,1,2,1,3,1,2,1,4,1,2,1,3,1,2,1],TB=[0,.6,1.2,0,1.2,0,1.6,1.2,.9,.9],PROT=[0,0,0,0,1,0,1,0,1,1],LB=new Int32Array(10).fill(-1);
 const drop=(k,s)=>{const t=TH.v;if(t<.01||k===0||k===5||pushed(k))return false;const sc=W16[s]+(TB[k]||0)+((k===2||k===7)&&s%8===4?1.5:0);return sc<1+4.6*t};
 /* v0.8 MORE (THIN fader, right of centre): extra energy without touching the pattern — hat 32nd ratchets, perc and hat ghost notes on
    empty 16ths, and a snare roll into every 4th bar. The added hits are quieter and never thinned. */
 let ADD=0;const ghost=(k,w,lv)=>{const T=TR[k];if(!T||T.m)return;const o=T.lv;T.lv=o*lv;ADD=1;try{fire(k,w)}catch(e){}finally{ADD=0;T.lv=o}};
 const DC={};const _ft=fire;fire=function(k,w){if(ADD)return _ft.apply(this,arguments);
  try{if(TH.v>=.01&&k!==0){const s=((tk%16)+16)%16;if(drop(k,s)){const bar=Math.floor(tk/16);if(!(PROT[k]&&TH.v<.85&&LB[k]!==bar)){DC[k]=(DC[k]||0)+1;return}}}}catch(e){}
  LB[k]=Math.floor(tk/16);const r=_ft.apply(this,arguments);
  if(TH.m>.01&&k===1&&R()<.5*TH.m)ghost(1,w+sdur()*.5,.55);   // hat ratchet
  return r};
 {const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);const m=TH.m;if(m<=.01||!playing)return r;
  try{const s=((tk%16)+16)%16,odd=s%2===1,P=TR[3],H=TR[1];
   if(P&&!P.pt[tk%P.st]&&R()<m*(odd?.4:.2))ghost(3,w,.5);              // perc ghosts on empty 16ths
   if(H&&!H.pt[tk%H.st]&&odd&&R()<m*.35)ghost(1,w,.45);                // hat ghosts
   if(m>.3&&(((tk%64)+64)%64)>=60){const k=TR[7]&&!TR[7].m?7:2;ghost(k,w,.35+.25*((tk%64)-60)/3);if(m>.75)ghost(k,w+sdur()*.5,.3)}  // roll into every 4th bar
  }catch(e){}return r}}
 const _gt=grains;grains=function(){try{if(thin()>=2&&R()<.5)return}catch(e){}return _gt.apply(this,arguments)};
 // ---- UI ----
 const host=$('#t-perf');const pan=document.createElement('div');pan.className='panel lpf';
 pan.innerHTML='<div class="lph"><span>FILTER</span><small>low-pass · high-pass</small><b class="lpv">OPEN</b></div><div class="lpt" title="Centre = open. Drag left for low-pass (synths close first, kick stays), right for high-pass (kick and bass go first). It stays where you leave it; double-tap to open."><div class="lpz drm"></div><div class="lpz pad"></div><div class="lpz hp"></div><div class="lpc"></div><div class="lpfill"></div><div class="lpk"></div><i>LOW</i><i>HIGH</i></div>';
 const tr=pan.querySelector('.lpt'),kn=pan.querySelector('.lpk'),fill=pan.querySelector('.lpfill'),val=pan.querySelector('.lpv');
 const fmt=h=>h>=1000?(h/1000).toFixed(h>=10000?0:1)+'k':Math.round(h)+'';
 const POS=()=>LP.h>0?.5+.5*LP.h:.5*LP.v;
 function show(){const c=cur(),p=POS();kn.style.left=(p*100)+'%';fill.style.right='auto';fill.style.left=(Math.min(p,.5)*100)+'%';fill.style.width=(Math.abs(p-.5)*100)+'%';pan.classList.toggle('on',eng());
  val.textContent=LP.h>0?'HP '+fmt(hpc().syn[0]):LP.v>=.999?'OPEN':LP.v>=PZ?'PADS '+fmt(c.pad[0]):'SYN '+fmt(c.syn[0])+' · DRM '+(c.drm[0]>=19000?'open':fmt(c.drm[0]))}
 /* v0.8: position 0 … 0.5 … 1 = low-pass closed … open … high-pass closed */
 function setPos(p){p=Math.max(0,Math.min(1,p));if(Math.abs(p-.5)<.002)p=.5;if(p<=.5){LP.v=p/.5;LP.h=0;if(LP.v>.9995)LP.v=1}else{LP.v=1;LP.h=(p-.5)/.5}if(ctx)prep();apply();show()}
 function set(v){setPos(.5*Math.max(0,Math.min(1,v)))}   /* the low-pass amount (1 = open), as before */
 window.lpReset=()=>{tgt=null;if(raf)cancelAnimationFrame(raf);raf=0;lt=0;setPos(.5);try{window.thinSet&&thinSet(0)}catch(e){}};
 // glide toward a target. Tap: constant speed, so the time follows the distance (full sweep ≈ 4 s, a small nudge is quick),
 // eased in the last stretch. Drag: follows the finger closely.
 const SPD=.25;let tgt=null,mode='tap',raf=0,lt=0;
 const step=ts=>{raf=0;if(tgt==null)return;const dt=lt?Math.min(.05,(ts-lt)/1000):1/60;lt=ts;
  const p=POS(),d2=tgt-p;if(Math.abs(d2)<.002){const t=tgt;tgt=null;lt=0;setPos(t);return}
  if(mode==='drag')setPos(p+d2*.45);else{const mv=Math.min(Math.abs(d2),SPD*dt*Math.min(1,.25+Math.abs(d2)*6));setPos(p+Math.sign(d2)*mv)}
  raf=requestAnimationFrame(step)};
 const go=(v,m)=>{tgt=Math.max(0,Math.min(1,Math.abs(v-.5)<.03?.5:v));mode=m;if(!raf){lt=0;raf=requestAnimationFrame(step)}};
 let drag=0,moved=0,x0=0;const pos=e=>{const r=tr.getBoundingClientRect();return (e.clientX-r.left)/r.width};
 tr.addEventListener('pointerdown',e=>{e.preventDefault();drag=1;moved=0;x0=e.clientX;try{tr.setPointerCapture(e.pointerId)}catch(x){}go(pos(e),'tap')});
 tr.addEventListener('pointermove',e=>{if(!drag)return;if(Math.abs(e.clientX-x0)>4)moved=1;go(pos(e),moved?'drag':'tap')});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{drag=0}));
 let lastTap=0;tr.addEventListener('pointerup',()=>{const n=performance.now();if(n-lastTap<300)go(.5,'tap');lastTap=n});
 tr.addEventListener('contextmenu',e=>e.preventDefault());
 host.appendChild(pan);show();
 // a fresh audio engine starts with fresh filters at the current position
 const _iL=init;init=function(){const r=_iL.apply(this,arguments);LP.dest=null;return r};
 window.LOWPASS={set,setPos,pos:POS,hp:()=>LP.h,glide:v=>go(.5*v,'tap'),get:()=>LP.h>0?1-LP.h:LP.v,freqs:curA,thin,drops:()=>Object.assign({},DC),busCount:()=>LP.f.syn.size+LP.f.drm.size+LP.f.pad.size};
 const st=document.createElement('style');st.textContent=`.lpf{padding:8px 12px 10px!important}.lpf .lph{display:flex;align-items:baseline;gap:8px;margin-bottom:6px;font-size:11px;letter-spacing:.12em}
.lpf .lph span{font-weight:700;color:var(--acc,#ffe44d)}.lpf .lph small{opacity:.55;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase}.lpf .lph b{margin-left:auto;font-size:10.5px;letter-spacing:.06em;opacity:.7}.lpf.on .lph b{opacity:1;color:var(--acc,#ffe44d)}
.lpf .lpt{position:relative;height:44px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,255,156,.10));touch-action:none;user-select:none;cursor:ew-resize;overflow:hidden}
.lpf .lpz.pad{position:absolute;left:35%;top:0;bottom:0;width:15%;border-left:1px dashed rgba(181,131,255,.45);background:rgba(181,131,255,.07)}
.lpf .lpz.hp{position:absolute;left:50%;right:0;top:0;bottom:0;background:repeating-linear-gradient(45deg,transparent 0 6px,rgba(0,200,255,.05) 6px 12px)}.lpf .lpc{position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(214,255,230,.35)}
.lpf .lpz.drm{position:absolute;left:0;top:0;bottom:0;width:15.75%;border-right:1px dashed rgba(255,228,77,.35);background:repeating-linear-gradient(135deg,transparent 0 6px,rgba(255,228,77,.05) 6px 12px)}
.lpf .lpfill{position:absolute;right:0;top:0;bottom:0;width:0;background:rgba(0,0,0,.45)}
.lpf .lpk{position:absolute;top:3px;bottom:3px;width:18px;margin-left:-9px;left:50%;border-radius:6px;background:var(--acc,#ffe44d);box-shadow:0 0 10px rgba(255,228,77,.6)}
.lpf .lpt i{position:absolute;top:50%;transform:translateY(-50%);font-style:normal;font-size:9px;letter-spacing:.14em;opacity:.45;pointer-events:none}.lpf .lpt i:first-of-type{left:10px}.lpf .lpt i:last-of-type{right:14px}
@media (max-width:640px){.lpf .lpt{height:40px}body #t-perf>.rz>div{height:clamp(34px,calc((100dvh - 722px)/2),118px)!important}.lpf .lph{white-space:nowrap}.lpf .lph small{display:none}.lpf .lph b{font-size:10px}}
@media (max-width:640px) and (max-height:880px){#t-perf>.rz>div>div:last-child{display:none}}
@media (max-width:640px) and (max-height:780px){#t-perf>.sec{display:none!important}.lpf{padding:6px 10px!important}.lpf .lph{position:absolute;left:22px;right:22px;margin:0;top:50%;transform:translateY(-50%);pointer-events:none;z-index:2}.lpf{position:relative}.lpf .lph small,.lpf .lpt i{display:none}.lpf .lph span{opacity:.8}.lpf .lpt{height:38px}}`;document.head.appendChild(st)}

