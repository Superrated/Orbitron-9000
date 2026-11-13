/* ---- v136: Bass pattern page, regrouped: RHYTHM (Euclid ring + Steps/Hits/Rotate/Tension, bass-vs-kick strip, Kick, Ghost notes, Style/🎲 shortcuts),
   NOTES (Notes, Octave, Slide, Fifth chance / Octave jump only on Auto), PHRASE & FEEL (Ending, Gate length). Sound is unchanged. ---- */
{const lab=el=>{if(!el||!el.firstChild)return'';const f=el.firstChild;return(f.nodeType===3?f.textContent:(f.firstChild&&f.firstChild.textContent)||'').trim()};
 const ENDS=['None','Turnaround every 4th bar','Walk-up fill every 2 bars','Walk-up fill every 4 bars'];
 const endNow=P=>P.btn?ENDS[1]:(P.bph||1)===2?ENDS[2]:(P.bph||1)===4?ENDS[3]:ENDS[0];
 let strip=null,cells=[];
 function drawStrip(){if(!strip||!strip.isConnected)return;const T=TR[6],K=TR[0],n=16,av=!!G.bavoid,ph=playing?((tk%16)+16)%16:-1;
  if(cells.length!==n){strip.innerHTML='<i>KICK</i>'+'<u></u>'.repeat(n)+'<i>BASS</i>'+'<s></s>'.repeat(n);cells=[[...strip.querySelectorAll('u')],[...strip.querySelectorAll('s')]]}
  for(let i=0;i<n;i++){const k=!K.m&&K.pt[i%K.st],b=T.pt[i%T.st];cells[0][i].className=(k?'on':'')+(i===ph?' ph':'');cells[1][i].className=(b?(k&&av?'skip':k?'on both':'on'):'')+(i===ph?' ph':'')}}
 
 window.bassLayout=()=>{const T=TR[6],P=T.p,card=T.mb&&T.mb.closest('.card');if(!card)return;
  const all=[...card.querySelectorAll('.sl, label.sl, .bksep, .bassroll')],by=n=>all.find(e=>lab(e)===n);
  const steps=by('Steps');if(!steps)return;const g=steps.parentElement;
  const hdr=(t,h)=>{const d=document.createElement('div');d.className='bksep bhd';d.innerHTML=t+'<small>'+h+'</small>';d.dataset.g='pat';return d};
  // drop the old headers and the controls that are merged
  all.filter(e=>e.classList.contains('bksep')&&/^(Bassline|Bass toolkit)$/.test(lab(e))).forEach(e=>e.remove());
  ['Lock','Phrase','Turnaround'].forEach(n=>{const e=by(n);if(e)e.remove()});card.querySelectorAll('.bhd,.bstrip,label.bend').forEach(e=>e.remove());
  // Ending (replaces Phrase + Turnaround)
  const end=mkSel('Ending',ENDS,endNow(P),v=>{P.btn=v===ENDS[1];P.bph=v===ENDS[2]?2:v===ENDS[3]?4:1});end.classList.add('bend');
  strip=null;cells=[];
  const kick=all.find(e=>e.tagName==='LABEL'&&lab(e)==='Kick'),notes=all.find(e=>e.tagName==='LABEL'&&lab(e)==='Notes'),styleSel=all.find(e=>e.tagName==='LABEL'&&lab(e)==='Style'),roll=card.querySelector('.bassroll');
  const order=[hdr('Rhythm','the Euclid ring · when the bass plays'),steps,by('Hits'),by('Rotate'),by('Tension'),by('Rotate drift'),kick,by('Ghost notes'),styleSel,roll,
   hdr('Notes','which pitches'),notes,by('Octave'),by('Slide'),by('Fifth prob'),by('Octave jump'),by('Fancy notes'),
   hdr('Phrase & feel','how it develops · how long notes last'),end,by('Gate (0 = Decay)')].filter(Boolean);
  order.forEach(e=>{e.dataset.g='pat';e.dataset.keep='pat';g.appendChild(e)});
  const fj=[by('Fifth prob'),by('Octave jump')].filter(Boolean),auto=()=>fj.forEach(e=>window.ctlOff&&ctlOff(e,(P.bns||'Auto')!=='Auto','only used when Notes = Auto'));auto();
  if(notes){const sel=notes.querySelector('select');if(sel)sel.addEventListener('change',()=>setTimeout(auto,0))}
  const ks=kick&&kick.querySelector('select');if(ks)ks.addEventListener('change',()=>setTimeout(drawStrip,0));drawStrip()};
 // keep strip + Ending + Auto-only sliders in step after Launch / roll / style
 const _bs=window.bassSync;window.bassSync=()=>{try{_bs&&_bs()}catch(e){}try{const card=TR[6].mb&&TR[6].mb.closest('.card');if(card){const e=card.querySelector('label.bend select');if(e)e.value=endNow(TR[6].p);
   [...card.querySelectorAll('.sl')].forEach(d=>{const l=lab(d);if((l==='Fifth prob'||l==='Octave jump')&&window.ctlOff)ctlOff(d,(TR[6].p.bns||'Auto')!=='Auto','only used when Notes = Auto')})}drawStrip()}catch(e){}};
 const st=document.createElement('style');st.textContent=`.bhd{display:flex;align-items:baseline;gap:8px;font-weight:700}.bhd small{font-weight:400;opacity:.55;letter-spacing:.04em;text-transform:none;font-size:10px}
.bstrip{grid-column:1/-1;display:grid;grid-template-columns:34px repeat(16,minmax(0,1fr));gap:3px;align-items:center;margin:2px 0 4px}
.bstrip i{font-style:normal;font-size:8px;letter-spacing:.1em;opacity:.55}.bstrip u,.bstrip s{display:block;height:12px;border-radius:3px;background:rgba(0,255,156,.07);border:1px solid rgba(0,255,156,.14);text-decoration:none}
.bstrip u:nth-of-type(4n+1),.bstrip s:nth-of-type(4n+1){border-color:rgba(0,255,156,.32)}.bstrip u.on{background:rgba(0,255,156,.55)}.bstrip s{height:16px}.bstrip s.on{background:var(--acc,#ffe44d)}
.bstrip s.both{background:#ff9a4d}.bstrip s.skip{background:repeating-linear-gradient(135deg,rgba(255,93,115,.35) 0 3px,transparent 3px 6px);border-color:rgba(255,93,115,.5)}
.bstrip .ph{outline:1px solid #fff;outline-offset:1px}`;document.head.appendChild(st)}

