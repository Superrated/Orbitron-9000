
/* v183: LEAD macro fader on Flight, under the low-pass. Centre = the lead exactly as it is set now (including manual edits). Left = shorter, darker, drier plucks;
   right = longer notes, brighter filter (cutoff + envelope) and more lead echo and reverb. It springs back to the centre slowly (about 2.5 s, eased) when released. */
{const LM={x:0,raf:0};
 const _f=fire;fire=function(k,w){if(k!==4||Math.abs(LM.x)<.01)return _f.apply(this,arguments);const P=TR[4].p,x=LM.x,
   o={dec:P.dec,hold:P.hold,rel:P.rel,drv:P.drv,grit:P.grit,pg:P.pg,cut:P.cut,envA:P.envA,ds:P.ds,rs:P.rs,res:P.res};
  /* v0.22: one even length curve for decay, gate and release together (short side as before, long side up to 2x), plus warm drive on the long side */
  try{const lf=x<0?Math.pow(2,1.5*x):Math.pow(2,1.25*Math.min(x,.8)); /* v0.22 Radian: full length (legato, filling the bar) is reached at 80 % */P.dec=Math.max(.03,Math.min(3,(P.dec||.25)*lf));if(P.hold)P.hold=Math.max(.2,P.hold*lf);if(P.rel!=null)P.rel=Math.max(.01,Math.min(3,P.rel*lf));
   if(x>0){const wl=Math.max(0,(x-.8)/.2),hv=wl,ad=.35*Math.min(x,.8)/.8+1.0*wl+.8*wl*wl,gr=0; /* Radian: warm, steady drive up to 80 %, then wild */ /* no grit: it adds a noise voice per note */ /* warm up to 60 %, then heavy drive + grit to the end */
    P.drv=Math.min(2.2,(P.drv||0)+ad);if(hv>0&&P.res!=null)P.res=Math.min(Math.max(P.res,11),P.res+4.5*hv); /* resonance screams into the overdrive */if(gr>0)P.grit=Math.min(1,(P.grit||0)+gr);{const hasD=P.eng!=='Mini',ac=Math.min(ad,1.35);P.pg=(P.pg||1)/(1+ad*.4)/(hasD?1+ac*.75:1)/(1+.4*wl)} /* Mini has no drive stage, so only the level term is undone there */}
   if(x<0)P.pg=(P.pg||1)*(1-.3*x);   /* v0.75: short plucks lost about 4 dB; most of it is given back */
   if(P.cut!=null)P.cut=Math.max(60,Math.min(12000,P.cut*Math.pow(2,x<0?.6*x:1.4*Math.min(x,1))));if(P.envA!=null)P.envA=Math.max(0,P.envA*(1+(x<0?.6*x:.6*x)));   /* v0.8: the notes open up over the whole right side (up to ~2.6 octaves brighter); the left side's closing is mostly the live bus filter (1500) */
   if(x>0){const T=TR[4],n=T.st||16,d=Math.max(1,n/Math.max(1,T.h||1)),gap=d*sdur(); /* every note gets the same length limit (from the average spacing), so all notes lengthen alike */
    P.dec=Math.min(P.dec,Math.max(o.dec||.1,gap*2));if(P.hold)P.hold=Math.min(P.hold,Math.max(o.hold||1,d*2));if(P.rel!=null)P.rel=Math.min(P.rel,Math.max(o.rel||.05,gap))}
   P.ds=Math.max(0,Math.min(1,(P.ds||0)*(1+x)));P.rs=Math.max(0,Math.min(1,(P.rs||0)*(1+x)));return _f.apply(this,arguments)}
  finally{Object.keys(o).forEach(k=>{if(o[k]===undefined)delete P[k];else P[k]=o[k]})}};
 const st=document.createElement('style');st.textContent=`.lmx{margin-top:8px}.lmx .lmh{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:4px}
  .lmx .lmh span{font-family:Orbitron,system-ui,sans-serif;font-size:11px;letter-spacing:.08em;color:var(--acc)}.lmx .lmh small{font-size:10px;color:var(--muted);flex:1}
  .lmx .lmh b{font-size:12px;color:var(--edge);min-width:70px;text-align:right}.lmx .lmt{position:relative;height:44px;background:var(--c1);border:1px solid rgba(0,255,156,.3);touch-action:none;user-select:none}
  .lmx .lmc{position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(214,255,230,.35)}.lmx .lmf{position:absolute;top:0;bottom:0;background:linear-gradient(90deg,rgba(181,131,255,.55),rgba(181,131,255,.25))}
  .lmx .lmk{position:absolute;top:2px;bottom:2px;width:14px;margin-left:-7px;background:var(--acc)}.lmx .lmt i{position:absolute;bottom:2px;font-size:9px;color:var(--muted);font-style:normal}`;document.head.appendChild(st);
 let el=null,lastX=null;const show=()=>{if(!el)return;const x=LM.x;if(lastX!==null&&Math.abs(x-lastX)<.002)return;lastX=x;const k=el.querySelector('.lmk'),f=el.querySelector('.lmf'),b=el.querySelector('b');
   k.style.left=((x+1)/2*100)+'%';f.style.left=(x<0?(x+1)/2*100:50)+'%';f.style.width=(Math.abs(x)/2*100)+'%';
   b.textContent=Math.abs(x)<.01?'AS SET':(x<0?'SHORT ':x>.8?'WILD ':'LONG ')+Math.round(Math.abs(x)*100)+'%'};   /* v0.75: the last 20 % reads WILD (drive + fuzz) */
 const glideBack=()=>{cancelAnimationFrame(LM.raf);const x0=LM.x,t0=performance.now(),D=2500;const step=t=>{const p=Math.min(1,(t-t0)/D),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;LM.x=x0*(1-e);show();if(p<1)LM.raf=requestAnimationFrame(step);else{LM.x=0;show()}};LM.raf=requestAnimationFrame(step)};
 const add=()=>{if(document.querySelector('.lmx'))return;const lp=document.querySelector('#t-perf .lpt');if(!lp)return;const host=lp.parentElement;
  el=document.createElement('div');el.className='lmx';
  el.innerHTML='<div class="lmh"><span>LEAD</span><small>decay · filter · echo</small><b>AS SET</b></div><div class="lmt" title="Drag left for short, dry, dark plucks; right for long, bright notes with more echo and reverb. It stays where you leave it; double-tap to go back to AS SET."><div class="lmc"></div><div class="lmc" style="left:90%;opacity:.5" title="from here on: wild"></div><div class="lmf"></div><div class="lmk"></div><i style="left:4px">SHORT</i><i style="right:4px">LONG</i></div>';
  host.appendChild(el);const tr=el.querySelector('.lmt');let on=0;
  let tg=0,lt=0;const sm=t=>{const dt=Math.min(50,t-(lt||t));lt=t;LM.x+=(tg-LM.x)*(1-Math.exp(-dt/70));if(Math.abs(tg-LM.x)<.002)LM.x=tg;show();
    if(on||LM.x!==tg)LM.raf=requestAnimationFrame(sm);else LM.raf=0};
  const at=e=>{const r=tr.getBoundingClientRect();tg=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width)*2-1));if(Math.abs(tg)<.06)tg=0};   /* v0.75: the centre catches, so AS SET is easy to find */
  tr.addEventListener('pointerdown',e=>{e.preventDefault();cancelAnimationFrame(LM.raf);try{window.orbWake&&orbWake()}catch(_){}tr.setPointerCapture(e.pointerId);on=1;at(e);lt=0;LM.raf=requestAnimationFrame(sm)});
  tr.addEventListener('pointermove',e=>{if(on)at(e)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tr.addEventListener(ev,()=>{if(!on)return;on=0}));
  let lt2=0;tr.addEventListener('pointerup',()=>{const n=performance.now();if(n-lt2<300){tg=0;lt=0;cancelAnimationFrame(LM.raf);LM.raf=requestAnimationFrame(sm)}lt2=n});show()}; // v0.22: LEAD holds where you leave it; double-tap = back to AS SET
 add();UI.on(()=>{try{add()}catch(e){}});LM.reset=()=>{cancelAnimationFrame(LM.raf);LM.raf=0;LM.x=0;lastX=null;show()};LM.set=v=>{cancelAnimationFrame(LM.raf);LM.raf=0;LM.x=Math.max(-1,Math.min(1,+v||0));lastX=null;show()};/* v0.77: set from code (MIDI) */window.leadMacro=LM}
