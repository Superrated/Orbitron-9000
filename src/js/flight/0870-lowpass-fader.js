/* ---- v130: Low-pass fader (Flight tab, bottom). Holds where you leave it. Open (right) = untouched sound and no extra routing.
   Pulling left closes the synths first; the drums start closing only past ~45% of the travel. Echo and reverb sends close with
   their source. While the fader is not fully open, every sound a track creates is tagged; wherever such a sound leaves the track
   (into any shared bus: master, ducked bus, lead bus, rumble, hat/perc stages, delay, reverb, shimmer) it passes its group's filter.
   Nothing is tagged or rerouted while the fader is fully open. ---- */
{const LP={v:1,ctx:null,dest:null,f:{syn:new Map(),drm:new Map(),pad:new Map()}};const PZ=.70,VV=(v=LP.v)=>Math.min(1,v/PZ);let CURG=null;const DRK=new Set([1,2,3,7]);
 const DZ=.45;const cur=(v0=LP.v)=>{const v=VV(v0),op=v>=.999,a=Math.max(0,Math.min(1,(v-DZ)/(1-DZ))),
   fs=v>=DZ?650*Math.pow(20000/650,Math.pow(a,.9)):60*Math.pow(650/60,v/DZ),vd=Math.min(1,v/DZ);
  const fd=op||vd>=1?20000:140*Math.pow(20000/140,Math.pow(vd,.9));
  // per group: [cutoff, Q of the 2nd stage (resonance bump, eased below 300 Hz), makeup gain]
  const res=(f,top)=>{const cl=1-Math.log(f/60)/Math.log(20000/60);const q=1.31*(1+top*cl);return f<300?1.31+(q-1.31)*Math.max(0,(f-90)/210):q},
   mk=(f,db)=>{const cl=Math.max(0,1-Math.log(f/60)/Math.log(20000/60));return Math.pow(10,db*cl/20)};
  // pads: the first 30 % of the travel darkens only the pads (filter down to about 800 Hz, level unchanged, no resonance); after that they follow the synths
  const pt=v0>=PZ?(1-v0)/(1-PZ):1,pf=v0>=.999?20000:Math.min(20000*Math.pow(800/20000,pt),op?20000:fs),pg=1;
  return{syn:[op?20000:fs,op?1.31:res(fs,.2),op?1:mk(fs,3)],drm:[fd,fd>=19999?1.31:res(fd,.12),fd>=19999?1:mk(fd,2)],pad:[pf,1.31,pg]}};
 function prep(){if(LP.ctx===ctx&&LP.dest)return;LP.ctx=ctx;LP.f={syn:new Map(),drm:new Map(),pad:new Map()};LP.dest=1}
 function bus(gk,d){let f=LP.f[gk].get(d);if(!f){const c=cur()[gk],f1=ctx.createBiquadFilter(),f2=ctx.createBiquadFilter(),g=ctx.createGain();
   f1.type=f2.type='lowpass';f1.Q.value=.54;f1.frequency.value=f2.frequency.value=c[0];f2.Q.value=c[1];g.gain.value=c[2];f1.connect(f2);f2.connect(g);g.connect(d);f1.__lpf=1;f={f1,f2,g};LP.f[gk].set(d,f)}return f.f1}
 /* a voice output leaving its track passes its group's filter (only while the fader is engaged: CURG is set by wrap() below) */
 RT.lpOn=()=>!!CURG;
 RT.lp=d=>(CURG&&LP.dest&&LP.ctx===ctx&&!(d instanceof AudioDestinationNode)&&!d.__lpf)?bus(CURG,d):d;
 function apply(){if(!ctx||LP.ctx!==ctx)return;const c=cur(),t=ctx.currentTime;['syn','drm','pad'].forEach(g=>LP.f[g].forEach(f=>{[f.f1,f.f2].forEach(b=>{b.frequency.cancelScheduledValues(t);b.frequency.setTargetAtTime(c[g][0],t,.03)});f.f2.Q.setTargetAtTime(c[g][1],t,.05);f.g.gain.setTargetAtTime(c[g][2],t,.05)}))}
 const wrap=(fn,g)=>function(){if(LP.v>=.999||!ctx||(window.DR&&DR.rendering))return fn.apply(this,arguments);const gg=typeof g==='function'?g(arguments[0]):g;if(!gg)return fn.apply(this,arguments);prep();const o=CURG;CURG=gg;try{return fn.apply(this,arguments)}finally{CURG=o}};
 fire=wrap(fire,k=>k===0?null:DRK.has(k)?'drm':k===5?'pad':'syn');window.lpRun=(g,fn)=>wrap(fn,g)();pad=wrap(pad,'pad');grains=wrap(grains,'syn');
 // energy thinning: stage 1 from 65 % of travel, 2 below ~39 %, 3 below ~18 %. Strong positions survive; the kick never thins.
 /* v0.26: thinning has its own THIN fader (0 = every note … 1 = only the strongest hits); the low-pass is filter only */
 const TH={v:0};window.THIN=TH;const thin=()=>{const t=TH.v;return t>=.9?4:t>=.65?3:t>=.4?2:t>=.12?1:0};   // all three stages arrive before the drum filter starts (DZ .45)
 const pushed=k=>(k===1&&window.rigidHats&&rigidHats.on())||(window.breakFX&&breakFX.is()&&(k===1||k===2||k===3||k===7)); /* v0.22: a percussion push keeps every hit of its own track */
 const drop=(k,s)=>{const st=thin();if(!st||k===0||pushed(k))return false;const o16=s%2===1,off8=s%4===2;
  if(k===3)return st>=1&&o16||st>=2&&off8;                       // perc
  if(k===1)return st>=2&&o16||st>=4&&s%4!==2;                      // hats: 16ths → 8ths → off-beats only
  if(k===2||k===7)return st>=2&&s%8!==4||st>=3&&s!==12;           // clap / snare: backbeats, then half time
  if(k===4)return st>=1&&o16||st>=2&&off8||st>=3&&s%8!==0;        // lead: 16ths → quarters → half notes
  if(k===6)return st>=2&&o16||st>=3&&off8||st>=4&&s%8!==0;         // bass
  if(k===8||k===9)return st>=3&&o16||st>=4&&s%4!==0;               // dub stab, sub
  if(k===5)return false;return st>=2&&o16};
 const DC={};const _ft=fire;fire=function(k){try{if(thin()&&drop(k,((tk%16)+16)%16)){DC[k]=(DC[k]||0)+1;return}}catch(e){}return _ft.apply(this,arguments)};
 const _gt=grains;grains=function(){try{if(thin()>=2&&R()<.5)return}catch(e){}return _gt.apply(this,arguments)};
 // ---- UI ----
 const host=$('#t-perf');const pan=document.createElement('div');pan.className='panel lpf';
 pan.innerHTML='<div class="lph"><span>LOW-PASS</span><small>filter · kick stays</small><b class="lpv">OPEN</b></div><div class="lpt" title="Drag to close the filter; it stays where you leave it. Double-tap to open fully."><div class="lpz drm"></div><div class="lpz pad"></div><div class="lpfill"></div><div class="lpk"></div><i>CLOSED</i><i>OPEN</i></div>';
 const tr=pan.querySelector('.lpt'),kn=pan.querySelector('.lpk'),fill=pan.querySelector('.lpfill'),val=pan.querySelector('.lpv');
 const fmt=h=>h>=1000?(h/1000).toFixed(h>=10000?0:1)+'k':Math.round(h)+'';
 function show(){const c=cur();kn.style.left=(LP.v*100)+'%';fill.style.width=((1-LP.v)*100)+'%';pan.classList.toggle('on',LP.v<.999);
  const th=thin();val.textContent=LP.v>=.999?'OPEN':LP.v>=PZ?'PADS '+fmt(c.pad[0]):'SYN '+fmt(c.syn[0])+' · DRM '+(c.drm[0]>=19000?'open':fmt(c.drm[0]))}
 function set(v){LP.v=Math.max(0,Math.min(1,v));if(LP.v>.9995)LP.v=1;if(ctx)prep();apply();show()}
 window.lpReset=()=>{tgt=null;if(raf)cancelAnimationFrame(raf);raf=0;lt=0;set(1);try{window.thinSet&&thinSet(0)}catch(e){}};
 // glide toward a target. Tap: constant speed, so the time follows the distance (full sweep ≈ 4 s, a small nudge is quick),
 // eased in the last stretch. Drag: follows the finger closely.
 const SPD=.25;let tgt=null,mode='tap',raf=0,lt=0;
 const step=ts=>{raf=0;if(tgt==null)return;const dt=lt?Math.min(.05,(ts-lt)/1000):1/60;lt=ts;const d=tgt-LP.v;
  if(Math.abs(d)<.002){const t=tgt;tgt=null;lt=0;set(t);return}
  if(mode==='drag')set(LP.v+d*.45);else{const mv=Math.min(Math.abs(d),SPD*dt*Math.min(1,.25+Math.abs(d)*6));set(LP.v+Math.sign(d)*mv)}
  raf=requestAnimationFrame(step)};
 const go=(v,m)=>{tgt=Math.max(0,Math.min(1,v>.985?1:v));mode=m;if(!raf){lt=0;raf=requestAnimationFrame(step)}};
 let drag=0,moved=0,x0=0;const pos=e=>{const r=tr.getBoundingClientRect();return (e.clientX-r.left)/r.width};
 tr.addEventListener('pointerdown',e=>{e.preventDefault();drag=1;moved=0;x0=e.clientX;try{tr.setPointerCapture(e.pointerId)}catch(x){}go(pos(e),'tap')});
 tr.addEventListener('pointermove',e=>{if(!drag)return;if(Math.abs(e.clientX-x0)>4)moved=1;go(pos(e),moved?'drag':'tap')});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{drag=0}));
 let lastTap=0;tr.addEventListener('pointerup',()=>{const n=performance.now();if(n-lastTap<300)go(1,'tap');lastTap=n});
 tr.addEventListener('contextmenu',e=>e.preventDefault());
 host.appendChild(pan);show();
 // a fresh audio engine starts with fresh filters at the current position
 const _iL=init;init=function(){const r=_iL.apply(this,arguments);LP.dest=null;return r};
 window.LOWPASS={set,glide:v=>go(v,'tap'),get:()=>LP.v,freqs:cur,thin,drops:()=>Object.assign({},DC),busCount:()=>LP.f.syn.size+LP.f.drm.size+LP.f.pad.size};
 const st=document.createElement('style');st.textContent=`.lpf{padding:8px 12px 10px!important}.lpf .lph{display:flex;align-items:baseline;gap:8px;margin-bottom:6px;font-size:11px;letter-spacing:.12em}
.lpf .lph span{font-weight:700;color:var(--acc,#ffe44d)}.lpf .lph small{opacity:.55;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase}.lpf .lph b{margin-left:auto;font-size:10.5px;letter-spacing:.06em;opacity:.7}.lpf.on .lph b{opacity:1;color:var(--acc,#ffe44d)}
.lpf .lpt{position:relative;height:44px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,255,156,.10));touch-action:none;user-select:none;cursor:ew-resize;overflow:hidden}
.lpf .lpz.pad{position:absolute;right:0;top:0;bottom:0;width:30%;border-left:1px dashed rgba(181,131,255,.45);background:rgba(181,131,255,.07)}
.lpf .lpz.drm{position:absolute;left:0;top:0;bottom:0;width:31.5%;border-right:1px dashed rgba(255,228,77,.35);background:repeating-linear-gradient(135deg,transparent 0 6px,rgba(255,228,77,.05) 6px 12px)}
.lpf .lpfill{position:absolute;right:0;top:0;bottom:0;width:0;background:rgba(0,0,0,.45)}
.lpf .lpk{position:absolute;top:3px;bottom:3px;width:18px;margin-left:-9px;left:100%;border-radius:6px;background:var(--acc,#ffe44d);box-shadow:0 0 10px rgba(255,228,77,.6)}
.lpf .lpt i{position:absolute;top:50%;transform:translateY(-50%);font-style:normal;font-size:9px;letter-spacing:.14em;opacity:.45;pointer-events:none}.lpf .lpt i:first-of-type{left:10px}.lpf .lpt i:last-of-type{right:14px}
@media (max-width:640px){.lpf .lpt{height:40px}body #t-perf>.rz>div{height:clamp(34px,calc((100dvh - 722px)/2),118px)!important}.lpf .lph{white-space:nowrap}.lpf .lph small{display:none}.lpf .lph b{font-size:10px}}
@media (max-width:640px) and (max-height:880px){#t-perf>.rz>div>div:last-child{display:none}}
@media (max-width:640px) and (max-height:780px){#t-perf>.sec{display:none!important}.lpf{padding:6px 10px!important}.lpf .lph{position:absolute;left:22px;right:22px;margin:0;top:50%;transform:translateY(-50%);pointer-events:none;z-index:2}.lpf{position:relative}.lpf .lph small,.lpf .lpt i{display:none}.lpf .lph span{opacity:.8}.lpf .lpt{height:38px}}`;document.head.appendChild(st)}

