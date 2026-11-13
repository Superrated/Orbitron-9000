
/* ---- v0.22 performance: "Audio buffer" (bigger buffer = fewer underruns, more delay; restarts the engine for a moment, groove kept)
   and "Visuals" (Full / Low / Off — frees the main thread that schedules the notes). Both in Mix → Bus & FX under Engine quality. ---- */
{const BUF={'Minimum · auto':'interactive', /* v0.4: asks the browser for its lowest latency; the phone picks the value */'Small · 26 ms':.025,'Standard · auto':'playback','Large · 52 ms':.05, /* v0.27: Small = lowest latency for fast pads and faders; may crackle on busy phones */'Extra large · 102 ms':.1,'Max · 186 ms':.2},VIS=['Full','Low','Off'];
 const get=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}},put=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
 let buf=get('orb-buf2','Extra large · 102 ms');{const MIG={'Standard':'Standard · auto','Minimum · lowest':'Minimum · auto','Minimum · browser lowest':'Minimum · auto'};if(MIG[buf]){buf=MIG[buf];put('orb-buf2',buf)}} /* v0.4: every option reads 'size · value'; 'auto' = the browser picks */if(!(buf in BUF))buf='Extra large · 102 ms'; /* v0.22 stability: 0.1 s is the default (new key, so an old 'Standard' choice does not stick) *//* v0.31: until you pick Visuals yourself, Eco and Survival start with Low visuals (about 15 fps) and Hi-fi/Auto with Full */
 let visSet=get('orb-vis','');const visNow=()=>VIS.includes(visSet)?visSet:(['Eco','Survival'].includes(get('orb-q','Eco'))?'Low':'Full');let vis=visNow();
 UI.on(()=>{if(!VIS.includes(visSet)){const v=visNow();if(v!==vis){vis=v;document.querySelectorAll('#t-mix .vissel select').forEach(s=>s.value=v)}}});
 window.orbBufHint=()=>BUF[buf];
 // visuals
 let lastV=0;const _vz=viz;viz=function(){if(vis==='Full')return _vz();const n=performance.now();
  if(vis==='Off'){setTimeout(()=>requestAnimationFrame(viz),400);return}if(n-lastV<66){requestAnimationFrame(viz);return}lastV=n;return _vz()};
 const _dr=draw;draw=function(T,s){if(vis==='Off'&&playing&&s>=0)return;return _dr.apply(this,arguments)};
 const ui=()=>{const q=[...document.querySelectorAll('#t-mix label.sl')].find(l=>l.firstChild&&l.firstChild.textContent.trim()==='Engine quality');const m=q?q.parentElement:null; /* Engine panel (Mix → Engine) */
  if(!m)return;if(m.querySelector('.bufsel'))return;document.querySelectorAll('#t-mix .bufsel,#t-mix .vissel').forEach(e=>e.remove());
  const mk=(lab,opts,val,fn,cls,tip)=>{const l=document.createElement('label');l.className='sl '+cls;l.title=tip;l.appendChild(document.createTextNode(lab));const se=document.createElement('select');opts.forEach(o=>se.add(new Option(o,o)));se.value=val;se.onchange=()=>fn(se.value);l.appendChild(se);return l};
  const b=mk('Audio buffer',Object.keys(BUF),buf,v=>{buf=v;put('orb-buf2',v);if(ctx&&window.hardReset)hardReset('audio buffer '+v)},'bufsel','Bigger buffer = fewer dropouts/underruns, but pads and faders respond later. auto = the browser picks the size (Minimum: its lowest, Standard: its normal). Minimum and Small also schedule notes less far ahead, so faders, mutes and edits land sooner. The real total is under Flight diagnostics → latency. Changing it restarts the audio for a moment; the groove keeps playing.');
  const v=mk('Visuals',VIS,vis,x=>{vis=x;visSet=x;put('orb-vis',x);if(x!=='Off')requestAnimationFrame(()=>{})},'vissel','Low = about 15 frames per second, Off = no live animation. Frees the main thread so notes stay on time on busy devices.');
  if(q){q.after(b);b.after(v)}else{m.prepend(v);m.prepend(b)}};
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{ui()}catch(e){}return r};try{ui()}catch(e){}UI.on(()=>{try{ui()}catch(e){}});
 window.orbPerf={buf:()=>buf,vis:()=>vis}}
