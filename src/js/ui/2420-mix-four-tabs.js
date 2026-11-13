/* ---- v0.75: the Mix page in four parts. MIXER is the mixer and nothing else: Balance and one strip per track (level, pan).
   SHAPE holds the big movers that used to sit on top of the strips — Space, Air, Pump, Feel, Drum bus — and the Texture bed.
   BUS & FX and ENGINE are as before. Nothing was rebuilt: the same controls are shown on a different sub-page. ---- */
{const M=document.querySelector('#t-mix'),bar=M&&M.querySelector('.mxs');if(bar&&bar.children.length>=3){const [bCh,bBus,bEng]=bar.children,bSh=document.createElement('button');bSh.type='button';bSh.textContent='Shape';bCh.textContent='Mixer';bCh.after(bSh);
  const ch=M.querySelector('.ch'),cp=ch&&ch.closest('.panel');if(cp){cp.classList.add('mxcp');const h=cp.querySelector('h2');if(h)h.textContent='Mixer · level and pan'}
  let want='mixer';const set=m=>{M.dataset.mx=m;bSh.classList.toggle('on',m==='shape');if(m==='shape'){bCh.classList.remove('on');const p=M.querySelector('.bedp');if(p)p.hidden=false}};
  bCh.addEventListener('click',()=>{set(want);want='mixer'});bSh.addEventListener('click',()=>{want='shape';bCh.click()});[bBus,bEng].forEach(b=>b.addEventListener('click',()=>set('other')));set('mixer');
  const tag=()=>{const g=document.getElementById('bedg'),p=g&&g.closest('.panel');if(p&&!p.classList.contains('bedp'))p.classList.add('bedp')};tag();UI.on(tag);
  const st=document.createElement('style');st.textContent=`#t-mix[data-mx=mixer] .spc,#t-mix:not([data-mx=shape]) .bedp{display:none!important}
#t-mix[data-mx=shape] .mxcp>h2,#t-mix[data-mx=shape] .mxcp>.gnote,#t-mix[data-mx=shape] .mxcp .ch,#t-mix[data-mx=shape] .mxcp .balbx,#t-mix[data-mx=shape] .mxcp .ginfo{display:none!important}
#t-mix[data-mx=shape] .mxcp::before{content:'Shape · the big movers';display:block;font:700 12px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--acc,#ffe44d);margin:0 0 8px}
#t-mix[data-mx=shape] .mxcp .spc:last-of-type{border-bottom:0}#t-mix .mxs button{padding-left:2px;padding-right:2px;letter-spacing:.1em}`;document.head.appendChild(st)}}
