
/* ---- v0.22: 🎲 New bassline, finished like the pad and lead dice. "from" picks whose bass style to borrow (this mood, any mood, or anything);
   about 1 roll in 5 gives a held bass (Sustain: few long notes, like the Launch held moods). While playing it lands on the next bar;
   ↶ brings back the bassline from before the last roll. The bass sound (filter, decay, drive …) is untouched. ---- */
{let SRC='This mood',PEND=0,UNDO=null;
 const srcList=()=>['This mood',...Object.keys(MOODS).map(k=>'Mood · '+MN(k)),'Anything'];
 const HELDM=new Set(['Deep Space','Ethereal','Ambient','Dreamy','Drone','Melancholic']);
 const BASE=[['Octave bounce',2],['Off-beat',2],['Gallop',2],['Rolling 16ths',2],['Syncopated',2],['Walking',1],['Pedal',1],['Acid run',2],['Octave 8ths',1],['Disco run',1]];
 const weights=mk=>{if(!mk)return BASE.map(x=>[x[0],1]);const M=MOODS[mk]||{};
  if(M.acid)return[['Acid run',4],['Rolling 16ths',3],['Off-beat',2],['Octave bounce',1]];
  if(HELDM.has(mk))return[['Pedal',3],['Off-beat',2],['Walking',2],['Syncopated',2],['Octave 8ths',1]];
  if(M.power||(M.b&&M.b[0]>=136))return[['Rolling 16ths',3],['Gallop',3],['Off-beat',2],['Octave bounce',2],['Syncopated',1]];
  return BASE};
 const PK=['bns','bgt','bsl','bgh','bfan','fifth','jump','bsty','blk','oct','btn','bph','bsus'];
 const snap=()=>{const T=TR[6],o={st:T.st,h:T.h,r:T.r,ten:T.ten,av:G.bavoid,avs:G.bavStrict};PK.forEach(k=>o[k]=T.p[k]);return o};
 const sync=()=>{setTimeout(()=>window.bassSync&&bassSync(),0);setTimeout(()=>window.bassSync&&bassSync(),120)};
 const restore=S=>{const T=TR[6];T.st=S.st;T.h=S.h;T.r=S.r;T.ten=S.ten;G.bavoid=S.av;G.bavStrict=S.avs;PK.forEach(k=>{if(S[k]===undefined)delete T.p[k];else T.p[k]=S[k]});T.pt=pat(T);try{build()}catch(e){}sync()};
 const roll=()=>{if(!window.bassRoll)return;UNDO=snap();const mk=SRC==='This mood'?curMood:Object.keys(MOODS).find(k=>'Mood · '+MN(k)===SRC);
  bassRoll(weights(mk));const B=TR[6],P=B.p;
  if(R()<.2){P.bsus=+(.55+R()*.25).toFixed(2);P.bgt=pick([0,0,.9,1]);P.bsl=Math.min(P.bsl||0,.15);P.blk='Free';P.bph=1;P.bgh=0;P.btn=false;P.bsty='Custom';
   P.bns='Melodic';P.bsl=pick([.15,.25]);G.bavoid=false;G.bavStrict=false;Object.assign(B,{st:16,h:pick([2,3,4]),r:2,ten:0});B.pt=pat(B);try{build()}catch(e){}sync();
   try{if(typeof say==='function')say('🎲 NEW BASSLINE · HELD · '+P.bns.toUpperCase())}catch(e){}}
  else P.bsus=0};
 let ui=null;
 const lab=()=>{if(!ui||!ui.isConnected)return;ui.querySelector('.pdr').textContent=PEND?'… next bar':'New line';ui.querySelector('.pdu').disabled=!UNDO};
 const go=()=>{if(PEND)return;const now=()=>{PEND=0;try{roll()}catch(e){}lab()};
  if(playing&&ctx){const left=(16-((tk%16)+16)%16)%16||16,ms=Math.max(0,left*sdur()*1000-120);PEND=1;lab();setTimeout(now,ms)}else now()};
 const swap=()=>{const c=TR[6].mb&&TR[6].mb.closest('.card');if(!c)return;const old=c.querySelector('button.bassroll');if(!old)return;
  ui=document.createElement('div');ui.className='pdice bdice bassroll';ui.dataset.g='pat';ui.dataset.keep='pat';
  ui.innerHTML='<button type="button" class="pdr" title="Re-roll only the bass rhythm and notes, in the style of the mood in from. Sometimes a held bass. Lands on the next bar.">New line</button><button type="button" class="pdu" title="Back to the bassline before the last roll">↶</button><label class="pds">from<select></select></label>';
  const s=ui.querySelector('select');srcList().forEach(o=>s.add(new Option(o,o)));s.value=SRC;s.onchange=()=>{SRC=s.value};
  ui.querySelector('.pdr').onclick=e=>{e.preventDefault();go()};ui.querySelector('.pdu').onclick=e=>{e.preventDefault();if(UNDO){const u=UNDO;UNDO=null;restore(u);lab()}};
  old.replaceWith(ui);lab();try{window.bassLayout&&bassLayout()}catch(e){}};
 const _bu=window.bassUI;window.bassUI=function(){const r=_bu.apply(this,arguments);queueMicrotask(()=>{try{swap()}catch(e){}});return r};
 UI.on(()=>{try{swap()}catch(e){}});setTimeout(()=>{try{swap()}catch(e){}},300);
 const st=document.createElement('style');st.textContent='.pdice.bdice.bassroll{border:0;background:none;min-height:0;padding:0;font-weight:inherit;letter-spacing:0;color:inherit;cursor:default}.pdice.bdice.bassroll:active{background:none}';document.head.appendChild(st);
 window.bassDice={roll:go,undo:()=>{if(UNDO){const u=UNDO;UNDO=null;restore(u)}},src:v=>{if(v)SRC=v;return SRC}}}
