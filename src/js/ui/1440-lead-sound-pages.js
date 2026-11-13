
/* ---- v0.22: lead Sound pages decluttered. Five pages: Osc · Filter · Amp · Mod · FX (Mod = pitch envelope, vibrato, glide; FX = drive,
   grit, crush, wavefolder, accent, sends). Patch, Random patch and Engine sit in one header row above the pages; Level stays on every page.
   Controls the current engine (or Acid 303 mode) does not use are hidden instead of greyed. Mini's oscillators are grouped per oscillator. ---- */
{const ORD={Osc:['Octave','Saw↔Square','Pulse width','Detune ¢','Unison','Unison spread ¢','Stereo width','Sub osc','Octave up','FM ratio','FM index','Vowel',
   'Osc 1 wave','Osc 1 range','Osc 1 level','Osc 2 wave','Osc 2 range','Osc 2 detune ¢','Osc 2 level','Osc 3 wave','Osc 3 range','Osc 3 detune ¢','Osc 3 level','Noise'],
  Filter:['Filter type','Cutoff','Resonance','Env amount','Key track','Filter attack ms','Filter decay','Filter sustain'],
  Amp:['Attack ms','Decay','Sustain','Release','Note length','Decay switch'],
  Mod:['Pitch env st','Pitch env time','Vibrato ¢','Vibrato rate','Glide time ms','Glide ms'],
  FX:['Drive','Grit','Crush','Fold','Fold env','Fold bias','Accent amount','Delay send','Reverb send']};
 // rebuild the page map in this order (the page buttons are made from it)
 Object.keys(LGRP).forEach(k=>delete LGRP[k]);Object.keys(ORD).forEach(k=>LGRP[k]=ORD[k].slice());if(!LGRP[LPG])LPG='Osc';
 const st=document.createElement('style');st.textContent=`.card[data-k="4"] .grid>.ctloff:not([data-g="pat"]){display:none!important}
 .card[data-k="4"] .lhdr{grid-column:1/-1;display:flex;gap:8px;align-items:end;flex-wrap:wrap}
 .card[data-k="4"] .lhdr .lpp{display:flex;flex-direction:column;gap:4px;flex:2 1 170px;min-width:0;font-size:12px;opacity:.95}
 .card[data-k="4"] .lhdr .lpp select{width:100%}.card[data-k="4"] .lhdr>button{flex:1 1 120px;min-height:38px}
 .card[data-k="4"] .lhdr>label.sl{flex:1 1 120px;min-width:0;margin:0}
 .card[data-k="4"] .lpg button.on{background:var(--acc,#ffe44d)!important;color:#0a0f0c!important;border-color:var(--acc,#ffe44d)!important;font-weight:700}`;document.head.appendChild(st);
 const head=c=>{const g=c.querySelector('.grid');if(!g)return null;const ps=g.querySelector('select[aria-label="Lead patch"]');if(!ps)return null;const row=ps.parentElement.classList.contains('lpp')?ps.parentElement.parentElement:ps.parentElement;
  if(!row.classList.contains('lhdr')){row.classList.add('lhdr');row.style.cssText='';const w=document.createElement('label');w.className='lpp';w.appendChild(document.createTextNode('Patch'));row.insertBefore(w,ps);w.appendChild(ps);
   [...ps.options].forEach(o=>{o.textContent=o.value==='Custom'?'custom':o.value})}
  const eng=[...g.children].find(e=>e.matches&&e.matches('label.sl')&&labOf(e)==='Engine');if(eng&&eng.parentElement!==row)row.appendChild(eng);return row};
 const _lp=leadPages;leadPages=function(){_lp.apply(this,arguments);try{const c=TR[4].mb&&TR[4].mb.closest('.card');if(!c)return;const row=head(c),g=c.querySelector('.grid');
  const pgs=c.querySelector('.lpg'),nt=c.querySelector('.lpnote');if(row)row.style.order=-100;if(pgs){pgs.style.order=-90;if(pgs.children.length!==Object.keys(LGRP).length||[...pgs.children].some((b,i)=>b.textContent!==Object.keys(LGRP)[i])){pgs.innerHTML='';Object.keys(LGRP).forEach(k=>{const b=document.createElement('button');b.textContent=k;b.style.cssText='flex:1;padding:6px 4px;font-size:11px';b.onclick=()=>{LPG=k;leadPages()};pgs.appendChild(b)})}
   pgs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.textContent===LPG))}
  if(nt)nt.style.order=-89;
  [...g.children].forEach(el=>{if(el.dataset.g==='pat'||el===row||el===pgs||el===nt)return;const l=labOf(el);if(l==='Level'){el.style.order=-80;return}const i=(ORD[LPG]||[]).indexOf(l);if(i>=0)el.style.order=i})}catch(e){}};
 try{leadPages()}catch(e){}}
