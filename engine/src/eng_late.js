<script>
/* ---- ENGINE (AudioWorklet): start, routing and the switch-over points ---- */
{const E=window.OrbEng,CODE=__ORB_WORKLET__;
 E.port=(k,d)=>{let m=E.ports.get(d);if(!m){m=new Map();E.ports.set(d,m)}const kk=k==null?'x':k;let p=m.get(kk);if(p!=null)return p;
  if(E.nports>=E.NOUT)throw new Error('engine: all outputs in use');p=E.nports++;const sv=ctx;ctx=E.real;try{const g=E.real.createGain();g.__port=1;if(k!=null)g.__k=k;E.node.connect(g,p,0);g.connect(d);E.pg[p]={g,k,d}}finally{ctx=sv}m.set(kk,p);return p};
 E.start=c=>{if(E.starting===c||!c||!c.audioWorklet||E.off)return;E.starting=c;E.on=false;E.node=null;E.ports=new Map();E.pg=[];E.nports=0;E.ids=new WeakMap();E.byId=new Map();E.real=null;
  const url=URL.createObjectURL(new Blob([CODE],{type:'application/javascript'}));
  c.audioWorklet.addModule(url).catch(()=>c.audioWorklet.addModule('data:application/javascript;base64,'+btoa(unescape(encodeURIComponent(CODE))))).then(()=>{if(ctx!==c)return;
   const n=new AudioWorkletNode(c,'orb-engine',{numberOfInputs:0,numberOfOutputs:E.NOUT,outputChannelCount:Array(E.NOUT).fill(2)});
   n.port.onmessage=e=>{const d=e.data||{};if(d.err){E.err=d.err;console.warn('[orbitron] engine',d.err)}if(d.st)E.wst=d.st;if(d.ev)d.ev.forEach(id=>{const r=E.byId.get(id),o=r&&r.deref&&r.deref();if(o)E.ids.delete(o);E.byId.delete(id)})};
   E.node=n;E.real=c;E.vc=new OrbVC();
   try{const sv=ctx;try{if(typeof stabEcho==='function')stabEcho()}finally{ctx=sv}}catch(e){}   // persistent buses are made natively, before any note
   E.on=true;console.log('[orbitron] engine: worklet on')}).catch(e=>{E.err='worklet unavailable: '+e;console.warn('[orbitron] engine off —',e)})};
 setInterval(()=>{try{if(ctx&&!(ctx instanceof OfflineAudioContext)&&ctx!==E.vc&&E.starting!==ctx)E.start(ctx)}catch(e){}},400);
 // run a note's sound code against the virtual context
 E.run=(fn,th,a)=>{if(!E.on||E.off||ctx!==E.real)return fn.apply(th,a);
  const vid=++E.vid;E.push(['b',vid]);ctx=E.vc;
  try{const r=fn.apply(th,a);E.stats.notes++;return r}
  catch(e){E.push(['kill',vid]);E.fails++;const t=performance.now();E.failT.push(t);E.failT=E.failT.filter(x=>t-x<10000);E.lastErr=String(e&&e.message||e);
   if(E.fails<=8)console.warn('[orbitron] engine note fell back',e);
   if(E.failT.length>30){E.off=true;E.on=false;console.warn('[orbitron] engine switched off after repeated failures — classic engine')}
  }
  finally{ctx=E.real;E.push(['e',vid])}};
 const wrap=nm=>{try{const f=eval(nm);if(typeof f!=='function')return;const w=function(){return E.run(f,this,arguments)};eval(nm+'=w')}catch(e){console.warn('[orbitron] engine wrap',nm,e)}};
 ['fireVoice','snare','stab','subDrone','pad','grains'].forEach(wrap);
 // the Balance mix listens to every track: hand it the engine's per-track outputs while it measures
 let tapped=null;setInterval(()=>{try{const M=window.__orbMEAS&&__orbMEAS();if(M&&E.on){if(!tapped||tapped.M!==M)tapped={M,c:[]};E.pg.forEach(x=>{if(!x||x.k==null||x.t===M||x.d===A.dI||x.d===A.rI)return;x.t=M;try{const an=M.an(x.k);x.g.connect(an);tapped.c.push([x.g,an])}catch(e){}})}
  else if(tapped&&!M){tapped.c.forEach(([g,an])=>{try{g.disconnect(an)}catch(e){}});E.pg.forEach(x=>{if(x)x.t=null});tapped=null}}catch(e){}},150);
 // finished virtual sources leave the voice counter
 setInterval(()=>{try{if(!E.real)return;const t=E.real.currentTime;for(const n of QOS.src)if(n instanceof E.VN&&n.__e<t)QOS.src.delete(n)}catch(e){}},500);
 window.orbEngine={state:()=>({on:E.on,off:E.off,err:E.err,fails:E.fails,last:E.lastErr,notes:E.stats.notes,msgs:E.stats.msgs,ports:E.nports,worklet:E.wst||null}),
  disable:()=>{E.off=true;E.on=false},enable:()=>{E.off=false;E.starting=null}};
 // engine line on the Mix page, under the CPU settings
 setInterval(()=>{try{const mx=document.querySelector('#t-mix');if(!mx||!mx.offsetParent)return;let el=mx.querySelector('.engst');if(!el){el=document.createElement('p');el.className='gnote engst';el.style.cssText='margin:6px 0 0;font:600 10px ui-monospace,monospace;opacity:.75';const p=mx.querySelector('.panel');(p||mx).appendChild(el)}
  el.textContent=E.on?'ENGINE · WORKLET'+(E.fails?' · '+E.fails+' notes played classic':''):E.off?'ENGINE · CLASSIC (worklet switched off)':E.err?'ENGINE · CLASSIC ('+E.err.slice(0,60)+')':'ENGINE · starting…'}catch(e){}},1000)}
</script>
