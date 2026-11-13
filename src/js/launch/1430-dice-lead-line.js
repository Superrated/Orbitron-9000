
/* ---- v0.22: 🎲 New lead line (lead Pattern page). Re-rolls everything on the lead pattern page — rhythm (Steps, Hits, Rotate, Tension,
   Rotate drift), notes (Arp mode, Range, Chord lock, Spread, Bias), loop & cycle (Loop len, Déjà vu, Cycle, Note repeat, Reset on bar,
   a fresh seed) and feel (Glide, Accent chance) — in the style of the mood chosen in "from". Never Acid 303 (that also changes the sound).
   While playing it lands on the next bar; ↶ brings back the line from before the last roll. Sound and key untouched. ---- */
{let SRC='This mood',PEND=0,UNDO=null,ui=null;
 const J=(v,a,lo,hi)=>Math.max(lo,Math.min(hi,v+(R()*2-1)*a)),r2=v=>Math.round(v*100)/100;
 const card=()=>TR[4].mb&&TR[4].mb.closest('.card');
 const srcList=()=>['This mood',...Object.keys(MOODS).map(k=>'Mood · '+MN(k)),'Anything'];
 const KEYS=['mode','range','spread','bias','dv','len','lock','glide','accp','cyc','nrep','rst','seed','rdr'];
 const snap=()=>{const T=TR[4],o={st:T.st,h:T.h,r:T.r,ten:T.ten,buf:buf.slice(),mot:mot.slice(),mp};KEYS.forEach(k=>o[k]=T.p[k]);return o};
 const restore=S=>{const T=TR[4];T.st=S.st;T.h=S.h;T.r=S.r;T.ten=S.ten;KEYS.forEach(k=>{if(S[k]===undefined)delete T.p[k];else T.p[k]=S[k]});buf=S.buf;mot=S.mot;mp=S.mp;T.pt=pat(T);build()};
 const roll=()=>{const T=TR[4],P=T.p;UNDO=snap();
  let mk=SRC==='This mood'?curMood:Object.keys(MOODS).find(k=>'Mood · '+MN(k)===SRC);const any=!mk,M=MOODS[mk]||{};
  const modes=(any?MODES:(M.md||['Motif'])).filter(m=>m!=='Acid 303');P.mode=pick(modes.length?modes:['Motif']);
  const E=!any&&window.EMPX&&EMPX[mk]&&EMPX[mk].lead;T.st=E&&R()<E[0]?pick(E[1]):any?pick([16,16,8,12,14,7,11,13]):16;
  const lh=any?[3,4,5,6,7,8,9]:(M.lh||[4,5,6]);T.h=Math.max(1,Math.min(T.st-1,pick(lh)));T.r=Math.floor(R()*T.st);T.ten=R()<.3?r2(.1+R()*.3):0;P.rdr=R()<.15?pick([4,8,16]):0;
  P.range=any?pick([1,2,3]):pick([1,1,2]);P.lock=r2(.5+R()*.5);P.spread=r2(J(any?R():(M.sp!=null?M.sp:.3),.12,0,1));P.bias=r2(J(any?R():(M.bias!=null?M.bias:.4),.15,0,1));
  P.dv=r2(J(any?.5+R()*.45:(M.dv!=null?M.dv:.8),.1,.3,.98));P.len=pick([3,4,5,6,8]);P.cyc=R()<.2?pick([3,5,6,7]):0;P.nrep=R()<.15?pick([2,3]):1;P.rst=R()<.2?pick([1,2,4]):0;
  P.glide=r2(R()*.25);P.accp=r2(.1+R()*.3);buf=[];mot=[];mp=-1;P.seed=Math.random()*1e3;T.pt=pat(T);build()};
 const lab=()=>{if(!ui)return;ui.querySelector('.pdr').textContent=PEND?'… next bar':'New line';ui.querySelector('.pdu').disabled=!UNDO};
 const go=()=>{if(PEND)return;const now=()=>{PEND=0;try{roll()}catch(e){}lab()};
  if(playing&&ctx){const left=(16-((tk%16)+16)%16)%16||16,ms=Math.max(0,left*sdur()*1000-120);PEND=1;lab();setTimeout(now,ms)}else now()};
 const ldAdd=()=>{const c=card();if(!c)return;const g=c.querySelector('.grid');if(!g)return;const old=g.querySelector('.ldice');if(old){ui=old;return}
  ui=document.createElement('div');ui.className='pdice ldice';ui.dataset.g='pat';ui.dataset.keep='pat';
  ui.innerHTML='<button type="button" class="pdr" title="Re-roll the whole lead pattern page: rhythm, notes, loop and feel, in the style of the mood in from. Lands on the next bar.">New line</button><button type="button" class="pdu" title="Back to the lead line before the last roll">↶</button><label class="pds">from<select></select></label>';
  const s=ui.querySelector('select');srcList().forEach(o=>s.add(new Option(o,o)));s.value=SRC;s.onchange=()=>{SRC=s.value};
  ui.querySelector('.pdr').onclick=e=>{e.preventDefault();go()};ui.querySelector('.pdu').onclick=e=>{e.preventDefault();if(UNDO){const u=UNDO;UNDO=null;restore(u);lab()}};
  const first=[...g.children].find(e=>e.dataset&&e.dataset.g==='pat');if(first)g.insertBefore(ui,first);else g.prepend(ui);lab()};
 BUILD.hooks.push({post(){setTimeout(()=>{try{ldAdd()}catch(e){}},45)}});
 UI.on(()=>{try{ldAdd()}catch(e){}});window.leadDice={roll:go,undo:()=>{if(UNDO){const u=UNDO;UNDO=null;restore(u)}},src:v=>{if(v)SRC=v;return SRC}}}
