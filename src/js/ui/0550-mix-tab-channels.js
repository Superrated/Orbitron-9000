/* ---- v64: Mix tab split into "Bus & FX" (everything as before) and "Channels" (per-track level, pan, pan movement); credits ---- */
{TR.forEach(T=>{if(T.pan==null)T.pan=0});
 const NOPAN=new Set([0,6,9]);let CURK=null,CURW=0;
 const panAt=k=>Math.max(-1,Math.min(1,+TR[k].pan||0));
 const _s64=send;send=function(n,out,dly,rev){const k=CURK;if(k==null||NOPAN.has(k)||!TR[k]||!TR[k].pan||!ctx||DR.rendering)return _s64(n,out,dly,rev);
  const pn=ctx.createStereoPanner();pn.pan.value=panAt(k);n.connect(pn);return _s64(pn,out,dly,rev)};
 const _f64=fire;fire=function(k,w){const a=CURK,b=CURW;CURK=k;CURW=w;try{_f64(k,w)}finally{CURK=a;CURW=b}};
 const _p64=pad;pad=function(t,w,dur){const a=CURK,b=CURW;CURK=5;CURW=w;try{return _p64(t,w,dur)}finally{CURK=a;CURW=b}};
 const st=document.createElement('style');st.textContent=`
#t-mix .mxs{display:flex;gap:6px;margin:0 0 10px}#t-mix .mxs button{flex:1;padding:10px 6px;font:700 11px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;background:transparent;color:var(--muted,#8fb);border:1px solid var(--edge,#00ff9c);border-radius:10px}
#t-mix .mxs button.on{background:var(--acc,#ffe44d);color:#04100a;border-color:var(--acc,#ffe44d)}
#t-mix .ch{display:flex;flex-direction:column;gap:3px}
#t-mix .ch .cs{display:grid;grid-template-columns:62px minmax(0,1fr) minmax(0,1fr);align-items:center;gap:8px;border-bottom:1px solid rgba(0,255,156,.08);padding:3px 0;min-width:0}
#t-mix .ch .cr{display:grid;grid-template-columns:26px minmax(0,1fr) 30px;align-items:center;gap:4px;min-width:0;font:600 9.5px ui-monospace,monospace;color:var(--muted,#8fb);letter-spacing:.06em;text-transform:uppercase}
#t-mix .ch .cr b{color:var(--acc,#ffe44d);text-align:right;font-weight:700;font-size:10.5px}
#t-mix .ch input[type=range]{width:100%;min-width:0;height:26px;margin:0;accent-color:var(--acc,#ffe44d);background:transparent}
#t-mix .ch .cs h3{margin:0;font:700 11px ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;display:flex;align-items:center;gap:6px}
#t-mix .ch .cs h3 i{width:8px;height:8px;border-radius:50%;display:inline-block}
#t-mix .ch .chg{font:700 9.5px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#7fffc4;margin:6px 0 0;border-bottom:1px solid rgba(0,255,156,.18);padding-bottom:4px}
#t-mix .ch .chg:first-child{margin-top:0}
#t-mix .ch .cs .nb{font:600 9.5px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#8fb);opacity:.55;padding-left:30px}

.credit{text-align:center;font:600 10px ui-monospace,monospace;letter-spacing:.18em;text-transform:lowercase;color:#7fffc4;opacity:.55;margin:18px 0 64px}`;document.head.appendChild(st);
 const M=$('#t-mix'),old=[...M.children],bar=document.createElement('div');bar.className='mxs';bar.innerHTML='<button class="on">Channels</button><button>Bus &amp; FX</button>';M.prepend(bar);
 const cp=document.createElement('div');cp.className='panel';cp.hidden=false;cp.innerHTML='<h2 style="margin-bottom:4px">Channels · level and pan</h2><div class="ch"></div><p class="gnote" style="margin:6px 0 0;font-size:10px">Double-tap a slider to reset. Kick, bass and sub stay centred.</p>';bar.after(cp);old.forEach(e=>e.hidden=true);
 const CH=cp.querySelector('.ch'),NM=['Kick','Hi-hat','Clap','Perc','Lead','Pad','Bass','Snare','Stab','Satellite'];
 const GRP=[['Drums',[0,7,2,1,3]],['Low end',[6,9]],['Synths',[4,5,8]]];
 const rng=(lab,min,max,val,fmt,fn,cls)=>{const w=document.createElement('label');w.className='cr '+(cls||'');w.innerHTML='<span>'+lab+'</span><input type="range" min="'+min+'" max="'+max+'" step=".01"><b></b>';const r=w.children[1],b=w.children[2];r.value=val;b.textContent=fmt(+val);
  r.oninput=()=>{fn(+r.value);b.textContent=fmt(+r.value)};r.ondblclick=()=>{const d=lab==='Pan'?0:.5;r.value=d;fn(d);b.textContent=fmt(d)};return w};
 const pf=v=>Math.abs(v)<.02?'C':(v<0?'L':'R')+Math.round(Math.abs(v)*100);
 function chBuild(){CH.innerHTML='';GRP.forEach(([gn,ks])=>{const hd=document.createElement('div');hd.className='chg';hd.textContent=gn;CH.appendChild(hd);ks.forEach(k=>{const T=TR[k];if(!T)return;const c=document.createElement('div');c.className='cs';
   c.innerHTML='<h3><i style="background:'+T.c+'"></i>'+(NM[k]||T.n)+'</h3>';c.appendChild(rng('Lvl',0,T===TR[4]?1.4:1,T.lv,v=>Math.round(v*100),v=>T.lv=v));
   if(NOPAN.has(k)){const n=document.createElement('div');n.className='nb';n.textContent='centre';c.appendChild(n)}else c.appendChild(rng('Pan',-1,1,T.pan,pf,v=>T.pan=v,'pan'));
   CH.appendChild(c)})})}
 const [b2,b1]=bar.children,show=ch=>{b1.classList.toggle('on',!ch);b2.classList.toggle('on',ch);old.forEach(e=>e.hidden=ch);cp.hidden=!ch;if(ch)chBuild()};chBuild();
 b1.onclick=()=>show(false);b2.onclick=()=>show(true);
 const _g64=generate;generate=function(){const r=_g64.apply(this,arguments);if(!cp.hidden){if(!$('#t-mix').hidden)chBuild();else CH.__dirty=1}return r};document.addEventListener('click',()=>setTimeout(()=>{if(CH.__dirty&&!$('#t-mix').hidden&&!cp.hidden){CH.__dirty=0;chBuild()}},0),true); /* perf 6 */
 const cr=document.createElement('div');cr.className='credit';cr.textContent='Orbitron 9000 v'+orbVer()+' · designed by superrated and claude · yours truly';window.ORB_VERSION=orbVer();const main=document.querySelector('main')||document.body;main.appendChild(cr)}
/* v0.93: the version label follows the code by itself — it is the highest 'vX.Y' named in the app's own change notes (the header comments,
   which ship inside the page), so the label can no longer fall behind (it said v0.81 until v0.92). */
function orbVer(){if(orbVer.v&&orbVer.done)return orbVer.v;let m=0,s='0';for(const sc of document.scripts){const re=/\bv([01]\.\d{1,2})\b/g,t=sc.textContent;let x;while((x=re.exec(t))){const n=+x[1];if(n>m){m=n;s=x[1]}}}orbVer.v=s;orbVer.done=document.readyState==='complete';return s}
addEventListener('load',()=>{try{orbVer.done=false;const v=orbVer();window.ORB_VERSION=v;const c=document.querySelector('.credit');if(c)c.textContent=c.textContent.replace(/v\d\.\d+/,'v'+v)}catch(e){console.warn('[orbitron] version label',e)}}); /* all scripts are in by now */
