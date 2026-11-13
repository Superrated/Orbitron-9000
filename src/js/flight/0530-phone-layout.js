/* ---- v62: Flight tab tuned for vertical phone screens — section labels, compact riser/breakdown pads, hold pads and arm buttons in separate tidy rows, room for the ticker ---- */
{const st=document.createElement('style');st.textContent=`
#t-perf{gap:8px!important;padding-bottom:56px}
#t-perf>.sec{grid-column:1/-1;display:flex;align-items:baseline;gap:8px;margin:6px 2px -2px;font:700 11px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#7fffc4}
#t-perf>.sec small{font-weight:400;letter-spacing:.04em;text-transform:none;color:var(--muted,#8fb);opacity:.8}
#t-perf>.rz{padding:8px!important;margin:0!important;min-width:0}
#t-perf>.rz h2{min-height:2.5em!important;margin:0 0 6px!important;font-size:10.5px!important;line-height:1.25!important;white-space:normal;overflow-wrap:anywhere}
#t-perf>.rz>div{height:128px!important;border-radius:12px!important}
#t-perf>.rz>div>div:last-child{font-size:11px!important;font-weight:600!important;opacity:.75;line-height:1.4!important;padding:6px!important}
#t-perf .thr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
#t-perf .arm{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
#t-perf .thr .pad,#t-perf .arm .pad{min-height:58px;padding:8px 6px;font-size:12px;line-height:1.25;white-space:normal}
#t-perf .arm .pad{min-height:64px}
#t-perf .sub{grid-column:1/-1;font:600 10px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#8fb);margin:12px 0 6px}
@media (min-width:700px){#t-perf>.rz>div{height:170px!important}#t-perf .thr{grid-template-columns:repeat(4,minmax(0,1fr))}}
body{padding-bottom:44px}`;document.head.appendChild(st);
 const P=$('#t-perf'),rz=[...P.querySelectorAll(':scope>.rz')],ris=rz.filter(e=>!e.classList.contains('bdz')),bds=rz.filter(e=>e.classList.contains('bdz'));
 const sec=(t,s)=>{const d=document.createElement('div');d.className='sec';d.innerHTML=t+(s?' <small>'+s+'</small>':'');return d};
 if(ris[0])ris[0].before(sec('Risers','hold + drag up · release = drop'));
 if(bds[0])bds[0].before(sec('Breakdowns','hold + drag up · release = full groove'));
 bds.forEach(e=>{const h=e.querySelector('h2');if(h)h.textContent=h.textContent.replace(/^Breakdown\s*·\s*/i,'')});
 rz.forEach(e=>{const lab=e.children[1]&&e.children[1].lastElementChild;if(lab)lab.innerHTML='▲<br>hold &amp; drag'});
 // thrusters: hold pads on top (2 per row), drop hits that arm in their own row
 const g=QD.children[1];g.classList.add('thr');g.style.cssText='';const arm=document.createElement('div');arm.className='arm';
 const isArm=b=>/arm|ARMED/.test(b.textContent);[...g.children].filter(isArm).forEach(b=>arm.appendChild(b));
 const sl=document.createElement('div');sl.className='sub';sl.textContent='Drop hits · tap to arm, fire on the next release';g.after(sl);sl.after(arm);
 const s0=document.createElement('div');s0.className='sub';s0.style.marginTop='0';s0.textContent='Hold while pressed';g.before(s0);
 // octave up / 2 octaves up live in the thrusters now; the key readout moves with them
 [...PH.children].forEach((b,i)=>{b.classList.remove('act');b.style.setProperty('--col',i?'#ff8cf0':'#c9a2ff');b.innerHTML=i?'+2 octaves':'+1 octave';g.appendChild(b)});KL.style.cssText='font-size:11px;color:var(--muted);margin-top:10px';arm.after(KL);QP.style.display='none'}
