/* ---- v152 (v0.22: moved to the Kick card): Techno rumble section (Rumble, Rumble cutoff) sits at the bottom of the Kick card, kept there after every Launch ---- */
{const LBL=['Rumble','Rumble cutoff'];
 const lab=d=>{const sp=d.firstChild;return sp&&sp.firstChild?sp.firstChild.textContent.trim():''};
 let box=null;
 function place(){const m=$('#mix');if(!box){box=document.createElement('div');box.className='rumbx';box.innerHTML='<div class="rumh">Techno rumble</div><p class="gnote" style="margin:0 0 6px">The kick sent through a dark, distorted reverb and ducked by the sidechain: the low rolling bed of warehouse techno. Rumble = level, cutoff = how dark.</p><div class="grid rumg"></div>'}
  const g=box.querySelector('.rumg');if(m){const nw=[...m.querySelectorAll('.sl')].filter(d=>LBL.includes(lab(d)));if(nw.length){g.innerHTML='';nw.forEach(d=>g.appendChild(d))}}
  const card=[...document.querySelectorAll('.card')].find(c=>{const h=c.querySelector('.hd span');return h&&h.textContent.trim()===TR[0].n});if(card&&box.parentElement!==card)card.appendChild(box)}
 const _mx=mix;mix=function(){const r=_mx.apply(this,arguments);try{place()}catch(e){}return r};
 BUILD.hooks.push({post(){try{place()}catch(e){}}});
 const st=document.createElement('style');st.textContent='.rumbx{padding:8px 0 4px;margin-top:6px;border-top:1px solid rgba(255,255,255,.08)}.rumbx .rumh{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.85;margin:0 0 4px}';document.head.appendChild(st);
 try{place()}catch(e){};UI.on(()=>{try{if(!box||!box.isConnected||!box.closest('.card'))place()}catch(e){}})}

