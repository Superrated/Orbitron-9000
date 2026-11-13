
/* ---- v0.26: Flight — LOW-PASS and THIN laid out exactly like the LEAD and BASS faders (two side-by-side boxes, same header, same track)
   v0.8: the knob height was copied while the reference knob had none yet ('auto'), so both knobs were 0 px tall and invisible; falls back to 70 %. ---- */
{const lp=document.querySelector('#t-perf .lpf'),th=lp&&lp.querySelector('.thr');if(lp&&th&&!lp.querySelector('.mxrow')){
  const row=document.createElement('div');row.className='mxrow lpr';const a=document.createElement('div'),b=document.createElement('div');a.className='lmx lpa';b.className='bmx tha';
  const h=lp.querySelector('.lph'),t=lp.querySelector('.lpt');h.classList.add('lmh');t.classList.add('lmt');a.append(h,t);
  const hh=document.createElement('div');hh.className='lmh';hh.innerHTML='<span>THIN</span><small>fewer · more · kick stays</small>';const v=th.querySelector('.thv');hh.appendChild(v);
  const tt=th.querySelector('.tht');tt.classList.add('lmt');tt.insertAdjacentHTML('beforeend','<i style="left:4px">ALL</i><i style="right:4px">BONES</i>');b.append(hh,tt);
  row.append(a,b);th.remove();lp.appendChild(row);lp.classList.add('mxp');
  const copy=()=>{const ref=document.querySelector('#t-perf .mxp:not(.lpf) .lmt'),rb=document.querySelector('#t-perf .mxp:not(.lpf) .lmh b');if(!ref)return;const c=getComputedStyle(ref);
   [t,tt].forEach(x=>{['height','borderTopWidth','borderStyle','borderColor','borderRadius','backgroundColor','backgroundImage','boxShadow'].forEach(k=>x.style[k]=c[k]);x.style.borderWidth=c.borderTopWidth});
   const kn=document.querySelector('#t-perf .mxp:not(.lpf) .lmk');if(kn){const k=getComputedStyle(kn),tk=tt.querySelector('.thk'),lk=t.querySelector('.lpk');[tk,lk].forEach(x=>{if(!x)return;x.style.width=k.width;x.style.height=(parseFloat(k.height)>0?k.height:'70%');x.style.borderRadius=k.borderRadius;x.style.marginLeft='-'+(parseFloat(k.width)/2)+'px';x.style.top='50%';x.style.bottom='auto';x.style.transform='translateY(-50%)'})}
   if(rb){const k=getComputedStyle(rb);[v,h.querySelector('b')].forEach(x=>{if(x){x.style.color=k.color;x.style.fontSize=k.fontSize}})}};
  copy();setTimeout(copy,300);window.addEventListener('resize',()=>setTimeout(copy,50));
  const st=document.createElement('style');st.textContent=`#t-perf .lpf.mxp{padding:8px 12px 10px!important}
#t-perf .lpf .lph.lmh{display:flex;align-items:baseline;gap:6px;margin:0 0 4px}#t-perf .lpf .lph.lmh b{margin-left:auto}
#t-perf .lpf .lpt.lmt,#t-perf .lpf .tht.lmt{position:relative;overflow:hidden;touch-action:none;user-select:none}
#t-perf .lpf .tht.lmt{border:inherit}#t-perf .lpf .tht .thfill{left:0;top:0;bottom:0}
#t-perf .lpf .tht .thk{top:50%;bottom:auto;transform:translateY(-50%);height:70%;width:18px;margin-left:-9px;border-radius:5px}
#t-perf .lpf .lpt i,#t-perf .lpf .tht i{position:absolute;top:50%;transform:translateY(-50%);font-style:normal;font-size:9px;letter-spacing:.14em;opacity:.45;pointer-events:none}
#t-perf .lpf .lpt i:first-of-type{left:6px}#t-perf .lpf .lpt i:last-of-type{right:6px}
#t-perf .lpf .tha .thv{font-size:inherit;opacity:1;width:auto}#t-perf .lpf .tha .lmh .thv{color:inherit}`;document.head.appendChild(st)}}
