
/* v0.5: progressions that fit the Desert and Gamelan scales (used on Launch and when you pick such a riff by hand) */
window.orbExoProg=function(kind){try{let P,sh;
  if(kind==='desert'){P=pick([[0,0,0,0],[0,1,0,1],[0,0,1,0],[0,3,1,0],[0,1,3,1],[0,0,3,1]]);sh='tri'}       // root, half step up, minor 4th: no odd chords from the scale's 3rd and 7th
  else{P=pick([[0,0,0,0],[0,0,0,0],[0,0,3,3],[0,3,0,3],[0,0,1,0]]);sh='open'}                                // drone or a slow 2-chord swing, open root-fifth-octave chords
  const x0=(typeof PX!=='undefined'&&Array.isArray(PX))?PX[0]:undefined;prog=P.slice();pshape=prog.map(()=>sh);pmean=null;
  if(typeof PX!=='undefined'&&Array.isArray(PX)){PX.length=0;prog.forEach(()=>PX.push(x0))}if(typeof PD!=='undefined')PD=null}catch(e){}};
/* ---- v0.5: DESERT RIFFS AND SCALES — two new scales with the augmented-second sound of North African and Middle Eastern music
   (Hijaz = Phrygian dominant, Double harmonic) and six "Desert" lead riffs written for them: snake-like runs around the flat 2nd,
   trills on the 5th and flat 6th, octave calls. Choosing a Desert riff by hand switches the scale to Hijaz (unless it is already
   Hijaz or Double harmonic). Launch sometimes builds a whole Desert groove in dark and driving moods. ---- */
{const _=null,X=window.orbRiffX,D=[[1, [0, 1, 2, _, 1, 0, _, _, 4, 5, 4, _, 2, 1, 0, _, 0, 1, 2, _, 1, 0, _, _, 4, 5, 6, _, 5, 4, 2, _]], [0, [10, _, _, 6, 5, _, 4, _, 5, _, 4, 2, _, 1, 0, _, 10, _, _, 6, 5, _, 4, _, 2, _, 1, 0, _, 1, 2, _]], [0, [0, _, _, 1, _, _, 0, _, _, _, _, _, 5, _, 4, _, 0, _, _, 1, _, _, 2, _, _, _, _, _, 1, _, 0, _]], [1, [4, 5, 4, 5, 4, _, 2, _, 1, _, 2, _, 1, _, 0, _, 4, 5, 4, 5, 4, _, 6, _, 5, _, 4, _, 2, _, 1, _]], [0, [_, _, 0, 1, 2, _, _, _, _, _, 2, 1, 0, _, _, _, _, _, 4, 5, 6, _, _, _, _, _, 5, 4, 2, _, _, _]], [0, [0, _, 10, _, 1, _, 11, _, 2, _, 1, _, 0, _, _, _, 0, _, 10, _, 1, _, 11, _, 2, _, 3, _, 2, _, _, _]]].map(([b,t])=>({b,t}));const DS=new Set(['Hijaz','Double harmonic']);
 try{if(X){X.desert=D}}catch(e){}
 const setScale=sc=>{if(DS.has(G.scale))return;G.scale=sc;try{const e=document.querySelector('#scale');if(e)e.value=sc}catch(e){}orbExoProg('desert')};
 // a Desert riff chosen in the Riff menu also brings the scale
 let last=null;const DJ=D.map(d=>JSON.stringify(d.t));setInterval(()=>{try{const sp=document.querySelector('#t-synth');if(!sp||sp.hidden)return;const R=window.orbRiff;if(!R||!R.t||TR[4].p.mode!=='Riff'){last=null;return}if(R.t===last)return;last=R.t;if(DJ.includes(JSON.stringify(R.t)))setScale('Hijaz')}catch(e){}},700);
 const FIT={Tense:.2,Dark:.15,Noir:.15,'Groove Techno':.12,Vector:.12,Breaks:.1,'Distorted Electro':.12,Power:.1,Temporal:.1};
 const fillT=t=>{let l=t.find(x=>x!=null);if(l==null)l=0;return t.map(x=>x==null?l:(l=x))};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],P=L.p,c=FIT[curMood];if(!c||L.m||P.mode==='Acid 303'||R()>=c||!window.orbRiff)return r;
   G.scale=R()<.7?'Hijaz':'Double harmonic';try{document.querySelector('#scale').value=G.scale}catch(e){}
   const q=pick(D);orbRiff.t=q.t.slice();orbRiff.f=fillT(q.t);P.mode='Riff';P.rdr=0;mot=[];mp=-1;buf=[];
   const ok=['String pluck','Mini lead','Vowel','FM keys','Pluck'].filter(n=>LPRE[n]);if(ok.length&&R()<.75)applyLP(pick(ok),1);
   const pt=q.t.slice(0,16).map(x=>x==null?0:1);L.st=16;try{const ft=bassFit(L,pt);Object.assign(L,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){}L.pt=pt.slice();
   orbExoProg('desert');
   try{build()}catch(e){}}catch(e){console.warn('[orbitron] desert',e)}return r}}
