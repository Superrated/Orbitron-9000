
/* ---- v0.5: MORE PAD GATE RHYTHM — in groovy and driving moods Launch more often chops the pad into a rhythm (house stabs, disco,
   trance 16ths, dotted, two-step); softer gates in the melancholic ones. Spacious moods keep their long pads. ---- */
{const PG={'Melodic House':[.45,['Offbeat stabs','House organ','Push stabs','Two-step'],.8],Italo:[.4,['Disco','Eighths','Offbeat stabs'],.8],
  'Groove Techno':[.35,['Offbeat stabs','Push stabs','Sparse'],.8],Bleep:[.35,['Stutter','Sparse','Dotted'],.75],Melancholic:[.25,['Two-step','Dotted','Sparse'],.55],
  Tense:[.3,['Trance 16ths','Eighths'],.65],Dark:[.2,['Sparse','Offbeat stabs'],.7],Vector:[.3,['Dotted','Push stabs','Eighths'],.75],Dreamy:[.2,['Dotted','Two-step'],.5],Power:[.25,['Trance 16ths','Offbeat stabs'],.7]};
 const GR={Disco:'1011011010110101',Eighths:'1010101010101010',Stutter:'1111011101110111',Sparse:'1001001010010010'};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const c=PG[curMood],T=TR[5],P=T.p;if(!c||T.m||(P.pgate||0)>.01||R()>=c[0])return r;
   const k=pick(c[1]),pat=(window.orbPadRhy&&orbPadRhy[k])||GR[k];if(!pat)return r;P.pgpat=pat.split('').map(Number);P.pgate=c[2];P.att=Math.min(P.att||.05,.03);P.rel=Math.min(P.rel||.3,.2);G.prhy=orbPadRhy&&orbPadRhy[k]?k:null;
   try{build()}catch(e){}setTimeout(()=>{try{const gs=[...document.querySelectorAll('select')].find(s=>[...s.options].some(x=>x.value==='Trance 16ths'));if(gs&&[...gs.options].some(x=>x.value===k))gs.value=k}catch(e){}},60)}catch(e){console.warn('[orbitron] pad gate',e)}return r}}
