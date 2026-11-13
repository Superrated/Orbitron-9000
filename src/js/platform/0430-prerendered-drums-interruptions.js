/* ---- v45: live stability — pre-rendered drum hits (kick/snare/clap/fixed perc), Stage mode, audio interruption recovery ---- */
window.DR={cache:new Map(),pend:new Set(),rendering:false,vr:1,hits:0,live:0,
 key(k,p){if(window.LFNC&&LFNC.has(k))return null;const r=x=>Math.round((+x||0)*1000)/1000; /* v0.22: an LFO moving this drum's sound → play it live */
  if(k===0)return 'k|'+[p.pitch,p.dec,p.punch,p.click==null?1:p.click].map(r).join(',');
  if(k===7)return 's|'+[p.tone,p.snap,p.dec].map(r).join(',');
  if(k===2)return 'c|'+[p.tone,p.spread,p.tail,p.body||0].map(r).join(',');
  if(k===3){if(!FIX||G.stom||LFOS.some(L=>L.d>0&&L.tg==='Perc FM'))return null;return 'p|'+[FIX,p.ratio,p.bend,p.fm,p.mdec,p.dec,p.filt,p.noise,p.fres==null?4:p.fres,p.fenvp==null?.5:p.fenvp,p.pmode||0,p.pdt||.04,p.pdrv||0].map(r).join(',')}
  return null},
 on(k,w,v,p){if(this.rendering){this.vr=v;return false}if(!ctx||(k!==0&&k!==2&&k!==3&&k!==7))return false;const key=this.key(k,p);if(!key)return false;
  const c=this.cache.get(key);if(!c){this.request(k,key,v,Object.assign({},p));this.live++;return false}
  const s=mkBuf(),g=ctx.createGain();s.buffer=c.b;g.gain.value=(c.vr?v/c.vr:v)*(k===0?1.22:1);s.connect(g);
  if(k===0){if(A.ksd!==p.drive){A.ks.curve=curve(p.drive);A.ksd=p.drive}routeTrack(g,null,A.ks);const r=ctx.createGain();r.gain.value=.55*(G.rfeed||1);g.connect(r);routeTrack(r,null,A.ru);duck(w)}
  else if(k===3)send(g,A.m,p.ds,p.rs);else send(g,A.m,0,p.rv);
  s.start(w);s.stop(w+c.b.duration+.01);this.hits++;return true},
 request(k,key,v,snap){if(this.pend.has(key)||!window.OfflineAudioContext)return;this.pend.add(key);const fx=FIX;(window.requestIdleCallback?f=>requestIdleCallback(f,{timeout:250}):f=>setTimeout(f,0))(()=>this.render(k,key,fx,snap))}, /* perf 7: drum pre-renders run in idle time, not right on top of the scheduler */
 render(k,key,fx,snap){const T=TR[k],p=T.p,keep=snap?Object.assign({},p):null;if(snap)Object.assign(p,snap); /* v0.22: render exactly the settings that played (tuned kick, varied clap) */
  try{this._render(k,key,fx,!!snap)}finally{if(keep){for(const q in p)if(!(q in keep))delete p[q];Object.assign(p,keep)}}},
 _render(k,key,fx,snapped){const T=TR[k],p=T.p,sr=ctx.sampleRate,len=k===0||k===7?p.dec+.08:k===2?3*p.spread/1e3+p.tail+.08:p.dec+.08,oc=new OfflineAudioContext(1,Math.ceil(sr*Math.min(1.5,len)),sr);
  const sink=oc.createGain(),nul=oc.createGain();sink.connect(oc.destination);
  const sv={ctx,ks:A.ks,m:A.m,ru:A.ru,dI:A.dI,rI:A.rI,duck,FIX,lv:T.lv,OCT};FIX=fx;const keyNow=this.key(k,p);FIX=sv.FIX;if(keyNow!==key&&!snapped){this.pend.delete(key);return}
  try{ctx=oc;A.ks=sink;A.m=sink;A.ru=nul;A.dI=nul;A.rI=nul;duck=()=>{};FIX=fx;OCT=0;this.rendering=true;
   if(k===7)snare(0,1);else fireVoice(k,0)}
  catch(e){}finally{this.rendering=false;ctx=sv.ctx;A.ks=sv.ks;A.m=sv.m;A.ru=sv.ru;A.dI=sv.dI;A.rI=sv.rI;duck=sv.duck;FIX=sv.FIX;T.lv=sv.lv;OCT=sv.OCT}
  const vr=this.vr;oc.startRendering().then(b=>{if(this.cache.size>40)this.cache.delete(this.cache.keys().next().value);this.cache.set(key,{b,vr});this.pend.delete(key)}).catch(()=>this.pend.delete(key))}};
