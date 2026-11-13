/* ---- v87: more pad pattern options — pick the progression, chord type, chord rhythm, push, gate rhythm and inversions ---- */
{PATL.push('Progression','Chord type','Chord rhythm','Push','Gate rhythm','Inversions');G.pvoice=G.pvoice||'Smooth top';
 const RN=['1','2','3','4','5','6','7'],lab=a=>a.map(x=>typeof x==='number'?RN[((x%7)+7)%7]:x).join('–');
 const CT={Auto:null,Triad:'tri','7th':'7','9th':'9',add9:'add9',sus2:'sus2',sus4:'sus4',Quartal:'quart'};
 const RH={'Even':null,'2+1+1+2':[2,1,1,2],'2+2+3+1':[2,2,3,1],'3+1+3+1':[3,1,3,1],'1½+½+1½+½':[1.5,.5,1.5,.5],'2+1+1+4':[2,1,1,4],'1+1+2':[1,1,2],'2+1+1':[2,1,1]};
 const GR={Off:null,Disco:'1011011010110101',Eighths:'1010101010101010',Shuffle:'1101101101101101',Sparse:'1001001010010010',Stutter:'1111011101110111'};
 const _tl=topLead;topLead=function(ds,n){return G.pvoice==='Close'?ds:_tl(ds,n)};
 const sel=(g,lab_,opts,val,fn)=>{const el=mkSel(lab_,opts,val,fn);el.dataset.g='pat';el.dataset.pp=1;g.appendChild(el);return el};
 function addUI(){const c=[...document.querySelectorAll('.card')].find(c=>+c.dataset.k===5);if(!c||c.querySelector('[data-pp]'))return;const g=c.querySelector('.grid');if(!g)return;const T=TR[5],P=T.p,M=MOODS[curMood]||{};
  const lib=(M.pr||[]).map(lab),cur0=(()=>{const i=(M.pr||[]).findIndex(a=>a.length===prog.length&&a.every((x,j)=>chordSpec(x).d===prog[j]&&(chordSpec(x).x||0)===((PX[j])||0)));return i>=0?lib[i]:'(custom)'})();
  sel(g,'Progression',['(custom)',...lib],cur0,v=>{const i=lib.indexOf(v);if(i<0)return;const a=M.pr[i],sp=a.map(chordSpec);prog=sp.map(s=>s.d);PX=sp.map(s=>s.x);T.st=prog.length;pshape=prog.map(()=>pick(M.sh||['7']));pmean=null;PTOP=null;T.pt=pat(T);if(PD&&PD.length!==T.st)PD=null;build()});
  const ctNow=(()=>{const s=new Set(pshape);if(s.size!==1)return'Auto';const k=[...s][0];return Object.keys(CT).find(x=>CT[x]===k)||'Auto'})();
  sel(g,'Chord type',Object.keys(CT),ctNow,v=>{pshape=prog.map(()=>CT[v]||pick(M.sh||['7']));pmean=null});
  const rhNow=PD?(Object.keys(RH).find(k=>RH[k]&&RH[k].join()===PD.join())||'Even'):'Even';
  sel(g,'Chord rhythm',Object.keys(RH),rhNow,v=>{const r=RH[v];PD=r&&r.length===T.st?r.slice():null;if(r&&r.length!==T.st){PD=null}});
  sel(g,'Push',['Off','On'],PPUSH?'On':'Off',v=>PPUSH=v==='On'?1:0);
  const grNow=(P.pgate||0)>.01?(Object.keys(GR).find(k=>GR[k]&&P.pgpat&&GR[k]===P.pgpat.join(''))||'Disco'):'Off';
  sel(g,'Gate rhythm',Object.keys(GR),grNow,v=>{if(!GR[v]){P.pgate=0;return}P.pgpat=GR[v].split('').map(Number);if((P.pgate||0)<.3)P.pgate=.8});
  sel(g,'Inversions',['Smooth top','Close'],G.pvoice,v=>{G.pvoice=v;PTOP=null})}
 BUILD.hooks.push({post(){queueMicrotask(()=>queueMicrotask(addUI))}});build()}
