
/* v182: "Hat push" toggle on Flight → Thrusters, in the place of Planet song. On: the hi-hat plays straight 16ths, machine-tight —
   no swing, no humanize, no accent/ghost/variation, no open hats, no tension. Off: the previous hat pattern and feel come back exactly.
   A Launch while it is on keeps it on (the new groove's hats are saved for when you switch off). */
{let ON=0,SAVE=null;const H=()=>TR[1];
 const save=()=>{const T=H();SAVE={st:T.st,h:T.h,r:T.r,ten:T.ten,acc:T.acc,gho:T.gho,vari:T.vari,pt:T.pt.slice(),pacc:T.p.acc,open:T.p.open}};
 const rigid=()=>{const T=H();T.st=16;T.h=16;T.r=0;T.ten=0;T.acc=0;T.gho=0;T.vari=0;T.p.acc=0;T.p.open=0;T.pt=pat(T)};
 const restore=()=>{if(!SAVE)return;const T=H(),S=SAVE;Object.assign(T,{st:S.st,h:S.h,r:S.r,ten:S.ten,acc:S.acc,gho:S.gho,vari:S.vari});T.pt=S.pt.slice();T.p.acc=S.pacc;T.p.open=S.open;SAVE=null};
 const set=v=>{if(v&&!ON){save();rigid();ON=1}else if(!v&&ON){restore();ON=0}try{build();window.syncFaders&&syncFaders()}catch(e){}paint()};
 // no swing on the hats while rigid
 const _f=fire;fire=function(k,w){if(ON&&k===1&&tk%2)w-=G.swing*sdur();return _f.call(this,k,w)};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);if(ON){try{save();rigid()}catch(e){}}return r};

 const add=()=>{if(document.querySelector('#t-perf .rgx'))return;const ps=[...document.querySelectorAll('#t-perf .pad')].find(x=>/^Planet song/.test(x.textContent.trim()));if(!ps)return;
  const b=document.createElement('button');b.className='pad rgx';b.style.setProperty('--col',TR[1].c);b.innerHTML='Hat push<span> (toggle)</span>';b.title='Straight, machine-tight 16th hats (no swing, humanize, ghosts or open hats) · tap again for your pattern';
  b.onclick=()=>set(!ON);ps.replaceWith(b);paint()};
 const paint=()=>{const b=document.querySelector('#t-perf .rgx');if(!b)return;b.classList.toggle('on',!!ON);const h='Hat push'+(ON?' ●':'')+'<span> (toggle)</span>';if(b.innerHTML!==h)b.innerHTML=h};
 add();UI.on(()=>{try{add();paint()}catch(e){}});window.rigidHats={set,on:()=>!!ON}}
