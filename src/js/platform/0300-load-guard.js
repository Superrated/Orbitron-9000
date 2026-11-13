/* ---- v30: stability guard — measures load (active voices, render capacity, scheduler lateness, frame time) and sheds work in steps; skips missed steps instead of bursting ---- */
const QOS={lvl:0,cool:0,src:new Set(),load:0,late:0,ft:16,f:0,lt:0,la:.12,hi:[170,240,320],hard:420,uni:[7,4,2,1],nm:['OK','LOAD','SAVING','OVERLOAD'],cl:['#00ff9c','#ffe44d','#ffb84d','#ff5d73']};
/* every sound source made for the live engine is registered here (start / stop times, pad chord, voice id) — the load guard, voice stealing,
   the lead voice limit and the Launch fade read this. Creation itself is native: mkOsc / mkBuf / mkConst create the node, then register it. */
const LiveAC=window.AudioContext||window.webkitAudioContext;
function qsrc(n){const st=n.start.bind(n),sp=n.stop.bind(n);
 n.start=(t=0,...r)=>{n.__s=t;n.__e=Infinity;n.__pc=window.__PADC||0;n.__v=VX.n;if(window.__LCOL)__LCOL.push(n);QOS.src.add(n);return st(t,...r)};n.stop=(t=0)=>{n.__e=t;return sp(t)};n.addEventListener('ended',()=>QOS.src.delete(n));return n}
function mkOsc(c){c=c||ctx;const n=c['createOscillator']();return c instanceof LiveAC?qsrc(n):n}
function mkBuf(c){c=c||ctx;const n=c['createBufferSource']();return c instanceof LiveAC?qsrc(n):n}
function mkConst(c){c=c||ctx;const n=c['createConstantSource']();return c instanceof LiveAC?qsrc(n):n}
function steal(nx){ /* v0.23: the pad chord that is sounding now is never stolen (that made pads cut in and out); other voices go first, then older pad chords */
 const now=ctx.currentTime,cur=window.__PADL||0,c=[...QOS.src].filter(n=>n.__e!==Infinity&&n.__e-now>.35&&!(n.__pc&&n.__pc===cur)).sort((a,b)=>(a.__pc?1:0)-(b.__pc?1:0)||a.__s-b.__s).slice(0,Math.ceil(nx));
 QOS.stolen=(QOS.stolen||0)+c.length;QOS.stolenPad=(QOS.stolenPad||0)+c.filter(n=>n.__pc).length;c.forEach(n=>{try{n.stop(now+.02)}catch(e){}})}
const _init30=init;init=function(){const nw=!ctx;_init30();if(nw&&ctx.renderCapacity){try{ctx.renderCapacity.start({updateInterval:1});ctx.renderCapacity.addEventListener('update',e=>QOS.load=Math.max(e.averageLoad||0,(e.peakLoad||0)*.8))}catch(e){}}};
const _tick30=tick;tick=function(){if(!ctx)return;const sd=60/G.bpm/4,now=ctx.currentTime;if(nextT<now-.025){const miss=Math.ceil((now-nextT)/sd);nextT+=miss*sd;tk+=miss;QOS.late++}else if(nextT<now)QOS.late++;_tick30()};
document.addEventListener('visibilitychange',()=>{QOS.la=document.hidden?1.2:.12});
// shedding hooks
const _fire30=fire;fire=function(k,w){const L=QOS.ml||0;if(L>=2){if(k===3&&(L>=3||R()<.5))return;if(L>=3&&(k===8||k===9))return}_fire30(k,w)};
const _gr30=grains;grains=function(w,sd){if((QOS.ml||0)>=2||(QOS.lvl>=1&&R()<.6))return;_gr30(w,sd)};
const _pd30=pad;pad=function(t,w,dur){const P=TR[5].p,o=P.size;if((QOS.ml||0)>=2)P.size=Math.min(o,QOS.ml>=3?2:3);try{_pd30(t,w,dur)}finally{P.size=o}};
const _vz30=viz;viz=function(){if(QOS.lvl>=3&&(QOS.f++%2)){requestAnimationFrame(viz);return}_vz30()};
// status badge
const QB=document.createElement('span');QB.style.cssText='font:700 10px ui-monospace,monospace;padding:2px 6px;border:1px solid currentColor;margin-left:8px;letter-spacing:.06em;white-space:nowrap';QB.title='Load guard: sheds notes and effects automatically when the device is overloaded';$('#kinfo').after(QB);
setInterval(()=>{if(!ctx||!playing){QOS.lvl=0;QOS.ml=0}else{const a=QOS.src.size,H=QOS.hi,vis=!document.hidden;let p=0;
  if(a>H[0]||QOS.load>.6||(vis&&QOS.ft>30))p=1;if(a>H[1]||QOS.load>.8||QOS.late>0||(vis&&QOS.ft>45))p=2;if(a>H[2]||QOS.load>.95||QOS.late>2)p=3;
  let pa=0;if(a>H[0]||QOS.load>.6)pa=1;if(a>H[1]||QOS.load>.8||QOS.late>1)pa=2;if(a>H[2]||QOS.load>.95||QOS.late>4)pa=3;if(pa>(QOS.ml||0)){QOS.ml=pa;QOS.mc=8}else if(pa<(QOS.ml||0)&&--QOS.mc<=0){QOS.ml--;QOS.mc=6}p=Math.max(p,QOS.floor||0,QOS.stageFloor||0);if(p>QOS.lvl){QOS.lvl=p;QOS.cool=8}else if(p<QOS.lvl&&--QOS.cool<=0){QOS.lvl--;QOS.cool=6}QOS.late=0;if(a>QOS.hard)steal((a-QOS.hard*.8)/2)}
 /* v0.26: the badge shows the level actually in effect (the load meter or the active saving stage, whichever is higher), written only on change */
 {let q0='Eco';try{q0=localStorage.getItem('orb-q')||'Eco'}catch(e){}const base=q0==='Survival'?2:q0==='Eco'?1:0,lvR=QOS.lvl||0,lv=Math.min(3,Math.max(QOS.ml||0,lvR>base?lvR:0)),t='CORE '+QOS.nm[lv]; /* perf 13: the mode's own built-in light setting is not shown as a warning */if(QB.textContent!==t)QB.textContent=t;if(QB.__l!==lv){QB.__l=lv;QB.style.color=QOS.cl[lv]}}},400);
