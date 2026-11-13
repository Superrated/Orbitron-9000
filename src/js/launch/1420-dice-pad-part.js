
/* ---- v0.22: 🎲 New pad part (pad Pattern page). Re-rolls everything on the pad pattern page: Pad style, progression (from the source
   chosen in "from"), its length, Chord type, Chord rhythm, Push, Gate rhythm, Inversions, Top line. Sound and key are not touched.
   While playing, the roll lands on the next bar. ↶ brings back the pad part from before the last roll. Only existing settings are set. ---- */
{const W=a=>{let u=R()*a.reduce((t,x)=>t+x[1],0);for(const[k,w]of a){if((u-=w)<0)return k}return a[a.length-1][0]};
 const VAR=(a,L)=>L===2?a.slice(0,2):L===3?a.slice(0,3):L===6?a.concat(a.slice(0,2)):L===8?a.concat([a[0],a[1],a[3],a[2]]):a;
 let SRC='Like Launch',PEND=0,UNDO=null;
 const card=()=>[...document.querySelectorAll('.card')].find(c=>+c.dataset.k===5);
 const selBy=(c,l)=>[...c.querySelectorAll('select')].find(s=>labOf(s.parentElement).trim()===l);
 const setSel=(c,l,v)=>{const s=selBy(c,l);if(!s||![...s.options].some(o=>o.value===v))return false;s.value=v;s.dispatchEvent(new Event('change',{bubbles:true}));if(s.onchange)try{}catch(e){}return true};
 const srcList=()=>{const F=Object.keys(window.HARMFAM||{});return['Like Launch','This mood only','Dark harmony (any)',...F.map(f=>'Dark · '+f),...Object.keys(MOODS).map(k=>'Mood · '+MN(k)),'Anything']};
 const moodOf=lbl=>Object.keys(MOODS).find(k=>'Mood · '+MN(k)===lbl);
 const pickProg=()=>{const M=MOODS[curMood]||{},F=window.HARMFAM||{},D=(window.HARMDARK&&HARMDARK()[curMood])||null,fam=f=>[pick(F[f].pr),F[f].sh];
  let src=SRC;if(src==='Like Launch')src=D&&R()<.7?'Dark · '+W(Object.entries(D)):'This mood only';
  if(src==='This mood only')return[pick(M.pr),M.sh];if(src==='Dark harmony (any)')return fam(pick(Object.keys(F)));
  if(src.startsWith('Dark · '))return fam(src.slice(7));const mk=moodOf(src);if(mk)return[pick(MOODS[mk].pr),MOODS[mk].sh];
  const all=[];Object.keys(MOODS).forEach(k=>(MOODS[k].pr||[]).forEach(a=>all.push([a,MOODS[k].sh])));Object.keys(F).forEach(f=>F[f].pr.forEach(a=>all.push([a,F[f].sh])));return pick(all)}
 const snap=()=>{const T=TR[5],P=T.p;return{padStyle,prog:prog.slice(),PX:(PX||[]).slice(),pshape:pshape.slice(),PD:PD?PD.slice():null,PPUSH,pgate:P.pgate,pgpat:P.pgpat?P.pgpat.slice():P.pgpat,
   prhy:G.prhy,pvoice:G.pvoice,ptl:G.ptl,pedal:G.pedal,st:T.st,h:T.h,r:T.r,size:P.size,bars:P.bars,cmShape:G.cmShape,cmPat:G.cmPat}};
 const restore=S=>{const T=TR[5],P=T.p;padStyle=S.padStyle;prog=S.prog;PX=S.PX;pshape=S.pshape;PD=S.PD;PPUSH=S.PPUSH;P.pgate=S.pgate;P.pgpat=S.pgpat;G.prhy=S.prhy;G.pvoice=S.pvoice;G.ptl=S.ptl;
  G.pedal=S.pedal;G.padAuto=0;T.st=S.st;T.h=S.h;T.r=S.r;P.size=S.size;P.bars=S.bars;G.cmShape=S.cmShape;G.cmPat=S.cmPat;T.pt=pat(T);pmean=null;PTOP=null;build()}
 const roll=()=>{const c=card();if(!c)return;UNDO=snap();const old=prog.join(',');
  const st=W([['Progression',55],['Pedal chords',10],['Chord memory',12],['Vamp',10],['One chord',8],['One note',5]]);
  if(st!==padStyle)setSel(c,'Pad style',st);else G.padAuto=0;
  if(st==='Progression'||st==='Pedal chords'){let a,sh;for(let i=0;i<8;i++){[a,sh]=pickProg();if(a&&a.join(',')!==old)break}
   const L=a.length===4&&R()<.35?pick([2,3,6,8]):a.length;window.padProgApply&&padProgApply(a,L,sh);const T=TR[5];if(T.h!==T.st){T.h=T.st;T.r=0;T.pt=pat(T)}}
  if(st==='Chord memory'&&window.cmPrep)cmPrep();
  setTimeout(()=>{const c2=card();if(!c2)return;
   setSel(c2,'Chord type',W([['Auto',50],['Triad',8],['7th',10],['9th',8],['add9',8],['sus2',6],['sus4',5],['Quartal',5]]));
   const rh=selBy(c2,'Chord rhythm');if(rh){const ok=[...rh.options].map(o=>o.value).filter(v=>v==='Even'||(window.padRh&&padRh(v,TR[5].st)));setSel(c2,'Chord rhythm',R()<.5||ok.length<2?'Even':pick(ok.filter(v=>v!=='Even')))}
   setSel(c2,'Push',R()<.3?'On':'Off');
   const gr=selBy(c2,'Gate rhythm');if(gr){const o=[...gr.options].map(x=>x.value).filter(v=>v!=='Off');setSel(c2,'Gate rhythm',R()<.6||!o.length?'Off':pick(o))}
   setSel(c2,'Inversions',R()<.7?'Smooth top':'Close');setSel(c2,'Top line',R()<.3?'On':'Off')},60)}
 const rollC=()=>{const c=card();if(!c)return;UNDO=snap();const old=prog.join(',');if(padStyle!=='Progression'&&padStyle!=='Pedal chords'){padStyle='Progression';G.pedal=false;TR[5].p.size=TR[5].p.size||4}G.padAuto=0;
  let a,sh;for(let i=0;i<8;i++){[a,sh]=pickProg();if(a&&a.join(',')!==old)break}const L=a.length===4&&R()<.35?pick([2,3,6,8]):a.length;window.padProgApply&&padProgApply(a,L,sh);const T=TR[5];if(T.h!==T.st){T.h=T.st;T.r=0;T.pt=pat(T)}};
 const go=(fn)=>{if(PEND)return;fn=fn||roll;window.__pdw=fn===rollC?'c':'a';const now=()=>{PEND=0;try{fn()}catch(e){}lab()};
  if(playing&&ctx){const left=(16-((tk%16)+16)%16)%16||16,ms=Math.max(0,left*sdur()*1000-120);PEND=1;lab();setTimeout(now,ms)}else now()}
 let ui=null;const lab=()=>{if(!ui)return;ui.querySelector('.pda').textContent=PEND&&window.__pdw==='a'?'… next bar':'Whole part';ui.querySelector('.pdc').textContent=PEND&&window.__pdw==='c'?'… next bar':'Chords';ui.querySelector('.pdu').disabled=!UNDO};
 const pdAdd=()=>{const c=card();if(!c||c.querySelector('.pdice'))return;const g=c.querySelector('.grid');if(!g)return;
  const pp=[...g.children].find(e=>e.dataset&&e.dataset.pp)||[...g.children].find(e=>labOf(e).trim()==='Pad style');
  ui=document.createElement('div');ui.className='pdice';ui.dataset.g='pat';ui.dataset.keep='pat';
  ui.innerHTML='<button type="button" class="pdr pdc" title="New chords only: a fresh progression that suits the mood (as Launch would pick). Rhythm, voicing and style stay. Lands on the next bar.">Chords</button><button type="button" class="pdr pda" title="Re-roll the whole pad pattern page: style, chords, length, colours, rhythm, gates, voicing, top line. Lands on the next bar.">Whole part</button><button type="button" class="pdu" title="Back to the pad part before the last roll">↶</button>';
  ui.querySelector('.pdc').onclick=e=>{e.preventDefault();go(rollC)};
  ui.querySelector('.pda').onclick=e=>{e.preventDefault();go(roll)};ui.querySelector('.pdu').onclick=e=>{e.preventDefault();if(UNDO){const u=UNDO;UNDO=null;restore(u);lab()}};
  if(pp)g.insertBefore(ui,pp);else g.prepend(ui);lab()}
 const st=document.createElement('style');st.textContent=`.pdice{grid-column:1/-1;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
 .pdice .pdr{flex:1 1 120px;min-height:40px;border:1px solid var(--acc,#ffe44d);border-radius:10px;background:rgba(255,228,77,.08);color:var(--acc,#ffe44d);font:inherit;font-weight:700;letter-spacing:.06em;cursor:pointer}
 .pdice .pdu{width:44px;min-height:40px;border:1px solid rgba(0,255,156,.35);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:18px;cursor:pointer}.pdice .pdu:disabled{opacity:.3;cursor:default}
 .pdice .pds{display:flex;align-items:center;gap:6px;font-size:11px;opacity:.85;flex:1 1 160px}.pdice .pds select{flex:1;min-width:0}`;document.head.appendChild(st);
 BUILD.hooks.push({post(){setTimeout(()=>{try{pdAdd()}catch(e){}},40)}});
 UI.on(()=>{try{pdAdd()}catch(e){}});window.padDice={roll:()=>go(roll),undo:()=>{if(UNDO){const u=UNDO;UNDO=null;restore(u)}},src:v=>{if(v)SRC=v;return SRC}}}
