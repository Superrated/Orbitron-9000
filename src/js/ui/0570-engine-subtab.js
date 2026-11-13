/* ---- v68: Mix gets an "Engine" sub-tab (engine quality + diagnostics); swing moves to the header next to tempo ---- */
{const M=$('#t-mix'),bar=M.querySelector('.mxs'),ep=document.createElement('div');ep.className='panel';ep.hidden=true;ep.innerHTML='<h2>Engine · quality and diagnostics</h2><div class="grid eng"></div>';M.appendChild(ep);
 const EG=ep.querySelector('.eng'),b3=document.createElement('button');b3.textContent='Engine';bar.appendChild(b3);
 const isQ=el=>el.classList&&el.classList.contains('sl')&&/^Engine quality/.test(el.textContent),isSw=el=>el.classList&&el.classList.contains('sl')&&/^Swing/.test(el.textContent);
 const tidy=()=>{const m=$('#mix');if(!m)return;[...m.children].forEach(el=>{if(isQ(el)){[...EG.children].filter(isQ).forEach(x=>x.remove());EG.prepend(el)}else if(el.id==='diag'){[...EG.children].filter(x=>x.id==='diag'&&x!==el).forEach(x=>x.remove());EG.appendChild(el)}else if(isSw(el))el.remove()})};
 new MutationObserver(tidy).observe($('#mix'),{childList:true});tidy();
 // three-way sub-tab switch (the first two buttons keep their own handlers; this one hides everything else)
 const [c1,c2]=bar.children,panels=()=>[...M.children].filter(e=>e.classList.contains('panel'));
 b3.onclick=()=>{panels().forEach(p=>p.hidden=p!==ep);[c1,c2].forEach(b=>b.classList.remove('on'));b3.classList.add('on')};
 [c1,c2].forEach(b=>b.addEventListener('click',()=>{ep.hidden=true;b3.classList.remove('on')}));
 // swing in the header
 const top=document.querySelector('.panel.top'),tl=[...top.querySelectorAll('label.sl')].find(l=>/Tempo/.test(l.textContent)),sw=document.createElement('label');
 sw.className='sl hsw';sw.innerHTML='Swing<b>0</b><div class="sr"><button class="st">−</button><input type="range" min="0" max=".4" step=".01"><button class="st">+</button></div>';const si=sw.querySelector('input'),sb=sw.querySelector('b');
 {const [mi,pl]=sw.querySelectorAll('.st');const nud=d=>{G.swing=Math.max(0,Math.min(.4,Math.round((G.swing+d)*100)/100));show()};mi.onclick=e=>{e.preventDefault();nud(-.02)};pl.onclick=e=>{e.preventDefault();nud(.02)}}
 const show=()=>{sb.textContent=Math.round(G.swing/.4*100)+'%';si.value=G.swing};si.oninput=()=>{G.swing=+si.value;show()};show();
 if(tl)tl.after(sw);else top.appendChild(sw);UI.on(()=>{if(document.activeElement!==si&&+si.value!==G.swing)show()});
 const st=document.createElement('style');st.textContent='.panel.top>label.sl{flex:1 1 0;min-width:0!important}.panel.top .sr{min-width:0!important}.panel.top>.brk{flex-basis:100%;height:0;margin:0;padding:0}';{const k=$('#kinfo');if(k&&!top.querySelector('.brk')){const br=document.createElement('i');br.className='brk';k.before(br)}}document.head.appendChild(st)}
{const s=document.createElement('style');s.textContent='.grid>.bksep{grid-column:1/-1;margin:10px 0 2px;padding-top:10px;border-top:1px dashed rgba(0,255,156,.3);font:700 10px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#7fffc4}';document.head.appendChild(s)}
