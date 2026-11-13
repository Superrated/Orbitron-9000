/* ---- v129: Solo — next to each Mute on the instrument pages (Kick, Hi-hat, … / Lead, Pad, …). Solo mutes every other track.
   v0.75: Solo latches. It stays on when you leave the page and through a Launch (the new pattern arrives soloed), until you tap it off —
   on the card, or on the SOLO note that shows above the status line while a solo is on. A sector load still ends it. Your own mutes come
   back as they were; a mute you change by hand during solo is kept. ---- */
{const SO={set:new Set(),tab:null,saved:{},forced:{}};
 const tabOf=k=>{const c=TR[k]&&TR[k].mb&&TR[k].mb.closest('.tp');return c||null};
 let pill=null;function ui(){try{const on=SO.set.size>0;if(on&&!pill){pill=document.createElement('button');pill.type='button';pill.className='sopill';pill.onclick=()=>off();document.body.appendChild(pill)}
   if(pill){pill.hidden=!on;if(on){const t='SOLO · '+[...SO.set].map(k=>(TR[k].n||'').split(' ')[0].toUpperCase()).join(' + ')+'  ✕';if(pill.textContent!==t)pill.textContent=t}}}catch(e){}
  TR.forEach((T,k)=>{if(T.mb)T.mb.classList.toggle('m',!!T.m);const c=T.mb&&T.mb.closest('.card');if(!c)return;const b=c.querySelector('.hd .solo');if(b)b.classList.toggle('so',SO.set.has(k));c.classList.toggle('sodim',SO.set.size>0&&!SO.set.has(k)&&tabOf(k)===SO.tab)})}
 function force(){TR.forEach((T,i)=>{if(SO.forced[i]!==undefined&&T.m!==SO.forced[i])SO.saved[i]=T.m;if(!(i in SO.saved))SO.saved[i]=T.m;const f=!SO.set.has(i);T.m=f;SO.forced[i]=f})}
 function off(){if(!SO.set.size)return;TR.forEach((T,i)=>{if(SO.forced[i]!==undefined&&T.m===SO.forced[i])T.m=!!SO.saved[i]});SO.set.clear();SO.tab=null;SO.saved={};SO.forced={};ui()}
 function tog(k){if(SO.set.has(k)){off();return}if(SO.set.size)off();SO.saved={};SO.forced={};SO.tab=tabOf(k);SO.set.add(k);force();ui()}
 function add(){TR.forEach((T,k)=>{const m=T.mb;if(!m)return;const hd=m.parentElement;if(!hd||hd.querySelector('.solo'))return;const b=document.createElement('button');b.className='solo';b.textContent='Solo';b.title='Hear only this track. Stays on, also through a Launch, until you tap it again';b.onclick=e=>{e.stopPropagation();tog(k)};m.after(b)});ui()}
 BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(()=>queueMicrotask(add)))}});
 UI.on(add);add();
 // leaving the tab clears the solo
 const shown=k=>{const c=TR[k]&&TR[k].mb&&TR[k].mb.closest('.card');return !!(c&&c.offsetParent&&getComputedStyle(c).display!=='none'&&(!SO.tab||getComputedStyle(SO.tab).display!=='none'))};
 const chk=()=>{};   /* v0.75: leaving the page no longer ends the solo */document.addEventListener('click',()=>setTimeout(chk,0),true);
 const tb=$('#tabs');if(tb){new MutationObserver(chk).observe(tb,{attributes:true,subtree:true,attributeFilter:['class']});tb.addEventListener('click',()=>setTimeout(chk,0))}
 UI.on(chk);
 // Launch / sector load end the solo first, so their mutes stand
 const relatch=(keep,tab)=>{if(!keep.length)return;if(!SO.set.size){SO.saved={};SO.forced={};SO.tab=tab;keep.forEach(k=>SO.set.add(k))}force();ui()};
 const _gs=generate;generate=function(){const keep=[...SO.set],tab=SO.tab;off();const r=_gs.apply(this,arguments);   /* the Launch sets its own mutes underneath, then the solo goes back on */
  if(keep.length){relatch(keep,tab);setTimeout(()=>{if(SO.set.size&&keep.every(k=>SO.set.has(k)))relatch(keep,tab)},0)}return r};
 const _as2=arrStep;arrStep=function(w){try{if(SO.set.size&&window.SECTORS&&SECTORS.state.q&&tk%64===0&&!SECTORS.state.held)off()}catch(e){}return _as2.apply(this,arguments)};
 window.SOLO={tog,off,state:()=>[...SO.set]};
 const st=document.createElement('style');st.textContent='.card .hd .solo{margin-left:6px}.card .hd .solo.so{background:var(--acc,#ffe44d);color:#04100a;border-color:var(--acc,#ffe44d);box-shadow:0 0 8px rgba(255,228,77,.45)}.card.sodim{opacity:.45;transition:opacity .15s}.sopill{position:fixed;right:10px;bottom:40px;z-index:9000;min-height:34px;padding:0 12px;border:2px solid #04100a;background:var(--acc,#ffe44d);color:#04100a;font:700 11px ui-monospace,monospace;letter-spacing:.12em;box-shadow:0 2px 10px rgba(0,0,0,.5)}.sopill[hidden]{display:none}';document.head.appendChild(st)}

