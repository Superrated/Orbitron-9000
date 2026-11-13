/* ---- v124: Key + scale lock — one button; when locked, Generate / Randomize all keep the current key and scale (tempo has its own lock) ---- */
{G.keyLock=0;try{localStorage.removeItem('orb-keylock')}catch(e){}
 const guard=fn=>function(){if(!G.keyLock)return fn.apply(this,arguments);const r=G.root,s=G.scale;
  Object.defineProperty(G,'root',{get:()=>r,set:()=>{},configurable:true,enumerable:true});Object.defineProperty(G,'scale',{get:()=>s,set:()=>{},configurable:true,enumerable:true});
  try{return fn.apply(this,arguments)}finally{delete G.root;delete G.scale;G.root=r;G.scale=s;try{$('#root').value=r;$('#scale').value=s}catch(e){}}};
 generate=guard(generate);{const rb=$('#rnd');if(rb&&rb.onclick)rb.onclick=guard(rb.onclick)}
 const kb=$('#kbox');if(kb){const b=document.createElement('button');b.id='keylock';b.className='keylock';b.title='Lock key and scale: Generate and Randomize all keep the current key and scale';
  const lab=()=>{b.innerHTML=G.keyLock?window.lockSvg(1)+'<span class="kll"> Key + scale locked</span><span class="kls"> Key</span>':window.lockSvg(0)+'<span class="kll"> Lock key + scale</span><span class="kls"> Key</span>';b.classList.toggle('on',!!G.keyLock)};lab();
  b.onclick=e=>{e.preventDefault();G.keyLock=G.keyLock?0:1;lab();};kb.appendChild(b);
  const st=document.createElement('style');st.textContent='#kbox .keylock{grid-column:1/-1;min-height:46px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer;opacity:.75}#kbox .keylock .kls{display:none}#kbox .keylock.on{opacity:1;border-color:var(--acc,#ffe44d);color:var(--acc,#ffe44d);box-shadow:0 0 8px rgba(255,228,77,.35)}';document.head.appendChild(st)}}

