
/* ---- v0.22: pad Pattern page tidied. Dice row on top (🎲 Chords · 🎲 Whole part · ↶), then three headed groups:
   CHORDS (Pad style, Chord type, Progression, Chords) · RHYTHM (Chord length, Chord rhythm, Push, Gate rhythm) ·
   VOICING (Chord notes, Open voicing, Inversions, Top line). The old "New progression" button is replaced by 🎲 Chords.
   v0.5: Progression gets a full row (it has ◀ ▶ and chord-count chips now), so Pad style and Chord type share the row above it. ---- */
{const GR=[['Chords · what plays',['Pad style','Chord type','Progression','Chords']],['Rhythm · when it changes',['Chord length (bars)','Chord rhythm','Push','Gate rhythm']],['Voicing · how it is spread',['Chord notes','Open voicing','Inversions','Top line']]];
 const st=document.createElement('style');st.textContent='.card[data-k="5"] .grid>.pph{grid-column:1/-1;margin:8px 0 0;padding-top:8px;border-top:1px dashed rgba(0,255,156,.3);font:700 10px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;opacity:.75}.card[data-k="5"] .grid>.ppx{display:none!important}';document.head.appendChild(st);
 const lay=()=>{const c=[...document.querySelectorAll('.card')].find(c=>+c.dataset.k===5);if(!c)return;const g=c.querySelector('.grid');if(!g)return;
  const kids=[...g.children];kids.forEach(e=>{if(e.tagName==='BUTTON'&&e.textContent.trim()==='New progression')e.classList.add('ppx')});
  const d=g.querySelector('.pdice');if(d)d.style.order=-100;
  GR.forEach(([t,labs],gi)=>{let h=g.querySelector('.pph[data-i="'+gi+'"]');if(!h){h=document.createElement('div');h.className='pph';h.dataset.i=gi;h.dataset.g='pat';h.dataset.keep='pat';h.textContent=t;g.appendChild(h);try{window.applyMode&&applyMode()}catch(e){}}
   h.style.order=(gi+1)*10;labs.forEach((l,i)=>{const e=kids.find(e=>e.dataset.g==='pat'&&!e.classList.contains('pph')&&!e.classList.contains('pdice')&&labOf(e).trim()===l);if(e)e.style.order=(gi+1)*10+1+i})});
  kids.forEach(e=>{if(e.dataset.g==='pat'&&!e.style.order)e.style.order=45})};
 BUILD.hooks.push({post(){setTimeout(()=>{try{lay()}catch(e){}},80)}});
 UI.on(()=>{try{lay()}catch(e){}})}
