
/* ---- v0.5: GAMELAN RIFFS AND SCALES — two five-note scales with a metallic, slightly dark colour (Pelog from Indonesia, In from Japan)
   and six "Gamelan" riffs: interlocking bell figures that suit mallet and bell sounds in hypnotic, minimal moods. Choosing a Gamelan
   riff by hand switches the scale to Pelog (unless it is already Pelog or In). Launch sometimes builds a Gamelan groove. ---- */
{const _=null,X=window.orbRiffX,D=[[1, [0, _, 1, _, 3, _, 1, _, 0, _, 1, _, 4, _, 3, _, 0, _, 1, _, 3, _, 1, _, 0, _, 1, _, 2, _, 1, _]], [0, [_, 3, _, 2, _, 3, _, 4, _, 3, _, 2, _, 1, _, 0, _, 3, _, 2, _, 3, _, 10, _, 4, _, 3, _, 1, _, 0]], [1, [0, 1, _, 0, 1, _, 3, _, 0, 1, _, 0, 1, _, 4, _, 0, 1, _, 0, 1, _, 3, _, 0, 1, _, 3, 4, _, 10, _]], [0, [10, _, _, 4, _, _, 3, _, _, 1, _, _, 0, _, _, _, 10, _, _, 4, _, _, 3, _, _, 4, _, _, 10, _, _, _]], [0, [_, _, 0, _, _, _, 1, _, _, _, 0, _, _, _, 3, _, _, _, 0, _, _, _, 1, _, _, _, 4, _, _, _, 3, _]], [1, [3, 4, 3, _, 1, _, 0, _, 3, 4, 3, _, 1, _, 2, _, 3, 4, 3, _, 1, _, 0, _, 3, 4, 10, _, 4, _, 3, _]]].map(([b,t])=>({b,t}));const DS=new Set(['Pelog','In']);
 try{if(X){X.gamelan=D}}catch(e){}
 let last=null;const DJ=D.map(d=>JSON.stringify(d.t));setInterval(()=>{try{const sp=document.querySelector('#t-synth');if(!sp||sp.hidden)return;const R=window.orbRiff;if(!R||!R.t||TR[4].p.mode!=='Riff'){last=null;return}if(R.t===last)return;last=R.t;const k=JSON.stringify(R.t);
   if(DJ.includes(k)&&!DS.has(G.scale)){G.scale='Pelog';try{document.querySelector('#scale').value='Pelog'}catch(e){}orbExoProg('gamelan')}}catch(e){}},300);
 const FIT={Bleep:.3,Noir:.22,'Deep Space':.22,Tense:.18,Ethereal:.15,Drone:.15,Vector:.15,Polymeter:.15,Ambient:.12} /* v0.83: ×1.5, plus Tidal Lock and Low Orbit */;
 const fillT=t=>{let l=t.find(x=>x!=null);if(l==null)l=0;return t.map(x=>x==null?l:(l=x))};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],P=L.p,c=FIT[curMood];if(!c||L.m||P.mode==='Acid 303'||R()>=c||!window.orbRiff)return r;
   G.scale=R()<.6?'Pelog':'In';try{document.querySelector('#scale').value=G.scale}catch(e){}
   const q=pick(D);orbRiff.t=q.t.slice();orbRiff.f=fillT(q.t);P.mode='Riff';P.rdr=0;mot=[];mp=-1;buf=[];
   const ok=['FM bell','FM keys','Rubber blip','Space blip','Bright pluck'].filter(n=>LPRE[n]);if(ok.length&&R()<.8)applyLP(pick(ok),1);
   const pt=q.t.slice(0,16).map(x=>x==null?0:1);L.st=16;try{const ft=bassFit(L,pt);Object.assign(L,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){}L.pt=pt.slice();
   orbExoProg('gamelan');
   try{build()}catch(e){}}catch(e){console.warn('[orbitron] gamelan',e)}return r}}
