/* ---- v140: Rotate drift — a track's Rotate moves one step on every 4, 8 or 16 bars, so the pattern slowly walks around the beat ---- */
{const DO=['Off','Every 4 bars','Every 8 bars','Every 16 bars'],DV=[0,4,8,16];PATL.push('Rotate drift');
 const lab=el=>{const f=el.firstChild;return f?(f.nodeType===3?f.textContent:(f.firstChild&&f.firstChild.textContent)||'').trim():''};
 function addUI(){TR.forEach((T,k)=>{if(T.pad||k===5)return;const card=T.mb&&T.mb.closest('.card');if(!card||card.querySelector('label.rdr'))return;
  const ten=[...card.querySelectorAll('.sl')].find(e=>lab(e)==='Tension');if(!ten)return;
  const el=mkSel('Rotate drift',DO,DO[DV.indexOf(T.p.rdr||0)]||'Off',v=>{T.p.rdr=DV[DO.indexOf(v)]});el.classList.add('rdr');el.dataset.g='pat';el.dataset.keep='pat';ten.after(el)})}
 BUILD.hooks.push({post(){/* v0.22: build is deferred (v40), so add the menu after the cards exist */setTimeout(()=>{try{addUI();sync();window.tagCtl&&tagCtl();window.applyMode&&applyMode()}catch(e){}},0)}});
 const sync=()=>TR.forEach(T=>{const c=T.mb&&T.mb.closest('.card'),e=c&&c.querySelector('label.rdr select');if(e)e.value=DO[DV.indexOf(T.p.rdr||0)]||'Off'});
 let pend=new Set();
 const _as=arrStep;arrStep=function(w){_as.apply(this,arguments);if(!ctx||tk%16!==0)return;const bar=Math.floor(tk/16);if(bar<1)return;
  TR.forEach(T=>{const n=T.p&&T.p.rdr;if(n>0&&bar%n===0&&T.st>0){T.r=(T.r+1)%T.st;T.pt=pat(T);pend.add(T)}});
  if(pend.size)setTimeout(()=>{pend.forEach(T=>{try{draw(T,-1)}catch(e){}});pend.clear();try{window.syncFaders&&syncFaders()}catch(e){}},Math.max(0,(w-ctx.currentTime)*1000))};
 const _gd=generate;generate=function(){TR.forEach(T=>{if(T.p)T.p.rdr=0});const r=_gd.apply(this,arguments);setTimeout(sync,0);return r};
 build()}

