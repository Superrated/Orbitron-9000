
/* ---- v0.5 UI fixes: the Gate rhythm menu always shows the rhythm that plays; old bass style names show their new name;
   the Launch message wraps on a phone instead of being cut off ---- */
{const GR={Disco:'1011011010110101',Eighths:'1010101010101010',Shuffle:'1101101101101101',Sparse:'1001001010010010',Stutter:'1111011101110111'};
 const ALIAS={Walking:'Slow pulse','Acid run':'Rolling techno','Disco run':'Octave 8ths'};
 const gateSync=()=>{try{const P=TR[5].p,gs=[...document.querySelectorAll('select')].find(s=>[...s.options].some(x=>x.value==='Trance 16ths'));if(!gs||document.activeElement===gs)return;
   let v='Off';if((P.pgate||0)>.01&&P.pgpat){const pat=P.pgpat.join('');const R=window.orbPadRhy||{};v=Object.keys(R).find(k=>R[k]===pat)||Object.keys(GR).find(k=>GR[k]===pat)||(G.prhy&&R[G.prhy]?G.prhy:gs.value)}
   if([...gs.options].some(x=>x.value===v)&&gs.value!==v)gs.value=v}catch(e){}};
 const bassName=()=>{try{const P=TR[6].p;if(ALIAS[P.bsty]){P.bsty=ALIAS[P.bsty];setTimeout(()=>{try{window.bassSync&&bassSync()}catch(e){}},0)}}catch(e){}};
 BUILD.hooks.push({post(){setTimeout(()=>{gateSync();bassName()},120)}});
 UI.on(()=>{const sp=document.querySelector('#t-synth');if(sp&&!sp.hidden){gateSync();bassName()}});
 const st=document.createElement('style');st.textContent='@media (max-width:700px){.mctl{white-space:normal!important;text-overflow:clip!important;line-height:1.3}}';document.head.appendChild(st)}
