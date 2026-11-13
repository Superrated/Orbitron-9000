/* ---- v139: new arp modes (Turing loop, Converge, Diverge, Pedal arp) + Cycle, Note repeat and Reset on bar for the lead ---- */
{const NEWM=['Turing loop','Converge','Diverge','Pedal arp'];NEWM.forEach(m=>{if(!MODES.includes(m))MODES.push(m)});
 const RUN=['Up','Up/Down','Chord arp','Converge','Diverge','Pedal arp'];
 PATL.push('Cycle (0 = off)','Note repeat','Reset on bar');
 const P0=TR[4].p;if(P0.cyc==null)P0.cyc=0;if(P0.nrep==null)P0.nrep=1;if(P0.rst==null)P0.rst=0;
 TR[4].x.push(['Cycle (0 = off)','cyc',0,16,1],['Note repeat','nrep',1,4,1]);
 let TU=[],ti=-1,cv=0,pc=0;window.TURING={get:()=>TU.slice(),set:a=>{TU=a.slice();ti=-1},reset:()=>{TU=[];ti=-1}};
 const fr=x=>x-Math.floor(x),hh=(i,sd)=>fr(Math.sin((i+1)*91.7+(sd||0)*7.31)*43758.5453);
 function chordArr(p){const n=SC[G.scale].length;let a=[];for(let o=0;o<Math.max(1,Math.round(p.range));o++)cur.n.forEach(d=>a.push(((d%n)+n)%n+o*n));return [...new Set(a)].sort((x,y)=>x-y)}
 function snap(d,p){const n=SC[G.scale].length,ct=cur.n.map(x=>((x%n)+n)%n);let b=d,bd=99;for(let c=-1;c<=3;c++)ct.forEach(t=>{const q=t+n*c,dd=Math.abs(q-d);if(dd<bd){bd=dd;b=q}});return Math.max(0,Math.min(b,p.range*n-1))}
 const _nm=leadNote;leadNote=function(p){const m=p.mode;if(!NEWM.includes(m))return _nm(p);const n=SC[G.scale].length,top=Math.max(1,Math.round(p.range)*n);
  if(m==='Turing loop'){const L=Math.max(2,Math.round(p.len||8));if(TU.length!==L){TU=[];for(let i=0;i<L;i++)TU.push(R())}ti=(ti+1)%L;
   if(R()<(1-(p.dv==null?.9:p.dv))*.5)TU[ti]=R();let d=Math.round(TU[ti]*(top-1));if(hh(ti,p.seed)<(p.lock||0))d=snap(d,p);prev=d;return d}
  const a=chordArr(p),L=a.length;if(L<2)return a[0]||0;
  if(m==='Pedal arp'){const root=((cur.n[0]%n)+n)%n,up=a.filter(x=>x>root);const k=pc++;if(k%2===0||!up.length)return root;return up[Math.floor(k/2)%up.length]}
  const ord=[];let lo=0,hi=L-1;while(lo<=hi){ord.push(lo);if(hi!==lo)ord.push(hi);lo++;hi--}if(m==='Diverge')ord.reverse();const d=a[ord[cv%ord.length]];cv++;return d};
 function resetPos(m){bp=-1;mp=-1;ca=0;ti=-1;cv=0;pc=0;if(m==='Up/Down'){ar=1;ad=-1}else{ar=-1;ad=1}}
 window.leadResetPos=()=>{resetPos(TR[4].p.mode)};
 let cnt=0,rep=0,repD=0,lastRB=-1;
 const _cy=leadNote;leadNote=function(p){const m=p.mode;if(m==='Acid 303')return _cy(p);
  const N=+p.rst||0;if(N>0&&m!=='Random'){const b=Math.floor(tk/(16*N));if(b!==lastRB){lastRB=b;resetPos(m);cnt=0;rep=0}}
  if(rep>0){rep--;return repD}
  const c=Math.round(p.cyc||0);if(c>0&&RUN.includes(m)&&cnt>=c){resetPos(m);cnt=0}
  const d=_cy(p);cnt++;rep=Math.max(0,Math.round(p.nrep||1)-1);repD=d;return d};
 window.MODEINFO_EXT={
  'Turing loop':'A random loop of Loop len notes that drifts: now and then one note changes and the rest stay (Déjà vu = how rarely). Chord lock pulls notes to the chord.',
  'Converge':'Plays the chord from the outside in: lowest, highest, second-lowest, second-highest… then starts again.',
  'Diverge':'Plays the chord from the middle out to the lowest and highest notes, then starts again.',
  'Pedal arp':'Every other note returns to the chord root while the notes in between climb the chord: the Italo sequencer figure.'};
 try{MOODS.Italo.md.push('Pedal arp');['Deep Space','Bleep','Dark'].forEach(k=>{if(MOODS[k]&&MOODS[k].md)MOODS[k].md.push('Turing loop')});MOODS.Dreamy.md.push('Converge');MOODS.Hopeful.md.push('Diverge')}catch(e){}
 const _gc=generate;generate=function(){const r=_gc.apply(this,arguments);const P=TR[4].p;P.cyc=0;P.nrep=P.mode==='Pedal arp'&&R()<.4?2:1;P.rst=0;resetPos(P.mode);cnt=0;rep=0;return r};
 build()}

