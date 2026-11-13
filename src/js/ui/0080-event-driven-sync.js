/* ---- EVENT-DRIVEN UI SYNC. The screen used to be kept in step by about 55 separate polling timers (300–2000 ms each) that re-queried the DOM
   whether or not anything had changed. Those refresh functions are now registered with UI.on(fn) and run only when something can have changed:
   after a Launch, a card rebuild, Play / Stop, a lead patch change, any tap / change on the page, each new bar while playing, and when the page
   becomes visible again. Requests are coalesced: one pass right away, one about 180 ms later for controls that are added after a rebuild. ---- */
const UI={fns:[],bfns:[],t0:0,t1:0,t2:0,tb:0,passes:0,
 on(fn){if(typeof fn==='function')this.fns.push(fn);return 0},
 onBeat(fn){this.bfns.push(fn)},   // small displays that follow the playhead: once per beat, driven by the sequencer
 beat(){if(this.tb||!this.bfns.length)return;this.tb=setTimeout(()=>{this.tb=0;if(document.hidden)return;const F=this.bfns;for(let i=0;i<F.length;i++)try{F[i]()}catch(e){}},0)},
 flush(){if(document.hidden)return;const F=this.fns;for(let i=0;i<F.length;i++)try{F[i]()}catch(e){}this.passes++},
 /* sync(): one pass now + one at 180 ms. sync(late, true): skip the immediate pass — used around a card rebuild, whose own hooks add controls
    over the next ~120 ms (running first would place additions before their anchors exist). late = one more pass after that many ms. */
 sync(late,settle){if(!settle&&!this.t0)this.t0=setTimeout(()=>{this.t0=0;this.flush()},0);if(!this.t1)this.t1=setTimeout(()=>{this.t1=0;this.flush()},180);
  if(late&&!this.t2)this.t2=setTimeout(()=>{this.t2=0;this.flush()},late)}};
/* "is this element on screen?" without a layout read on every call: the answer (offsetParent) is cached per element and looked up again
   only after a UI sync pass (any tap, tab switch, rebuild …) or after a second. Used by the per-step ring redraw and the diagnostics read-outs. */
const VISC=new WeakMap();function isShown(el){if(!el)return false;const n=performance.now();let c=VISC.get(el);if(!c){c={p:-1,t:0,v:false};VISC.set(el,c)}if(c.p!==UI.passes||n-c.t>1000){c.p=UI.passes;c.t=n;c.v=el.offsetParent!==null}return c.v}
['click','change','pointerup','keyup'].forEach(ev=>document.addEventListener(ev,()=>UI.sync(),true));
document.addEventListener('input',()=>{if(!UI.t1)UI.t1=setTimeout(()=>{UI.t1=0;UI.flush()},250)},true);   // while a slider moves: at most 4 passes a second
document.addEventListener('visibilitychange',()=>{if(!document.hidden)UI.sync()});
window.addEventListener('load',()=>UI.sync(1500,true));
