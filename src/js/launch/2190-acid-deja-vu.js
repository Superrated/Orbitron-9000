
/* ---- v0.4: Déjà vu changes on the acid line keep to the line's own notes; a changed note never keeps a slide from the same pitch,
   and accents only flip on the cell start or an octave note ---- */
{const _an=acidNote;acidNote=function(p){if(AC.keep){AC.keep=0;AC.key=G.scale+'|'+p.seed+'|'+p.glide.toFixed(2)+'|'+p.accp.toFixed(2)} /* a recalled 303 line is kept, not regenerated */const s=tk%16,before=AC.last;const bn=AC.n?AC.n.slice():null,ba=AC.a?AC.a.slice():null;const r=_an(p);
  try{if(bn&&s<before&&AC.n&&AC.n.join()!==bn.join()||ba&&AC.a&&AC.a.join()!==ba.join()){const n=SC[G.scale].length,pal=[...new Set(bn.filter(v=>v%n!==0))],ok=[0,n].concat(pal);
   for(let i=0;i<16;i++){if(AC.n[i]!==bn[i]&&!ok.includes(AC.n[i]))AC.n[i]=pal.length?pal[i%pal.length]:0;
    if(AC.a[i]!==ba[i]&&AC.a[i]&&!(i%(AC.cell||8)===0||AC.n[i]>=n))AC.a[i]=0;
    const pv=(i+15)%16;if(AC.s[i]&&AC.n[pv]===AC.n[i])AC.s[i]=0}}}catch(e){}return r}}
