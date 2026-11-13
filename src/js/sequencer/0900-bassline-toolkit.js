/* ---- v135: Bassline toolkit — Style picker, Notes (note source), Kick avoid, Turnaround, 🎲 New bassline;
   sound: Pitch punch (a fast pitch drop at each note) and Growl (wavefolder before the drive). ---- */
window.BFC={};window.bassFold=a=>{const n=1024,c=new Float32Array(n),k=1+a*2.6;for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=(1-a*.7)*x+a*.7*Math.sin(x*Math.PI*k)/1.15}let m=0;for(const v of c)m=Math.max(m,Math.abs(v));for(let i=0;i<n;i++)c[i]/=m||1;return c};
{const BNS=['Auto','Root','Pedal','Octave','Root + fifth','Chord tones','Scale walk','Arp up','Arp down','Melodic','Phrase','Anticipate'];
 const STY={'Octave bounce':['xxxxxxxxxxxxxxxx','Octave',.35,0,0],'Off-beat':['..x...x...x...x.','Root',.5,0,.1],'Gallop':['x.xxx.xxx.xxx.xx','Root',.4,0,0],
  'Rolling 16ths':['.xxx.xxx.xxx.xxx','Root',.25,0,.15],'Syncopated':['x..x..x...x..x..','Chord tones',.55,.15,0],
  'Pedal':['x.x.x.x.x.x.x.x.','Pedal',.4,0,.1],'Octave 8ths':['x.x.x.x.x.x.x.x.','Octave',.45,0,0],
  /* v0.5 modern styles (Walking, Acid run and Disco run were retired — old saves and Launch use the closest new style) */
  'Rolling techno':['.x.x.x.x.x.x.x.x','Root',.35,0,.1],'Melodic pulse':['xxxxxxxxxxxxxxxx','Root',.5,.05,0],'Reese':['x.......x.......','Anticipate',.97,.3,0],
  'Half-time':['x.....x....x....','Root',.9,.1,0],'Slow pulse':['x.......x.......','Root + fifth',.8,.05,0],'Dub sub':['......x.......x.','Root',.95,.2,0],
  'Held':['x...............','Root',.98,.12,0],'Held, syncopated':['x.....x....x..x.','Anticipate',.97,.1,0],
  'Bouncy':['x..x..x...x..x..','Chord tones',.55,.15,0]}; /* v0.5: long bass notes that follow the chords */
 const NAMES=Object.keys(STY);
 function fit(T,pt){const n=pt.length,h=pt.reduce((a,c)=>a+c,0);let best={h,r:0,ten:0,sc:-1};
  for(let ti=0;ti<=20&&best.sc<n;ti++)for(let r=0;r<n;r++){const ten=ti/20,q=pat(Object.assign({},T,{st:n,h,r,ten}));let sc=0;for(let i=0;i<n;i++)if(q[i]===pt[i])sc++;if(sc>best.sc){best={h,r,ten,sc};if(sc===n)break}}return best}
 /* perf 6: ring fitting is a brute-force search; remember results */{const C=new Map(),f0=fit;fit=function(T,pt){const k=pt.join('')+'|'+(T.tsd||T.n||'');let r=C.get(k);if(!r){r=f0(T,pt);if(C.size>500)C.clear();C.set(k,r)}return Object.assign({},r)}}
 const ALIAS={Walking:'Slow pulse','Acid run':'Rolling techno','Disco run':'Octave 8ths'};
 function style(name,rot){if(ALIAS[name])name=ALIAS[name];const S=STY[name];if(!S)return;const T=TR[6],P=T.p;let pt=[...S[0]].map(c=>c==='x'?1:0);if(rot)pt=pt.slice(-rot).concat(pt.slice(0,-rot));
  T.st=16;const ft=fit(T,pt);T.h=ft.h;T.r=ft.r;T.ten=ft.ten;T.pt=pat(T);Object.assign(P,{bns:S[1],bgt:S[2],bsl:S[3],bgh:S[4],fifth:0,jump:0,bsty:name,blk:'Free'});if(/^Held|^Reese$|^Dub sub$/.test(name)){P.bsus=Math.max(P.bsus||0,name==='Reese'?.7:.85);P.bph=1}else if((P.bsus||0)>.5&&/^Held|^Reese$|^Dub sub$/.test(P.__lastSty||''))P.bsus=0;P.__lastSty=name;
  if(name==='Rolling techno'||name==='Melodic pulse'){G.bavoid=true;G.bavStrict=false}if(name==='Melodic pulse')Object.assign(P,{fifth:.1,jump:.12});   /* v0.5: tight around the kick, a little note movement */
  if(name==='Bouncy'){G.bavoid=true;G.bavStrict=false;   /* v0.5: busy, hooky, bouncing line around the kick (pattern only — the sound stays as it is) */
   Object.assign(P,{bfan:+(.45+R()*.15).toFixed(2),jump:.3,bsus:0,bgt:0,bsl:.15});G.bstyle=''}P.oct=Math.max(0,Math.min(2,Math.round(P.oct)||1))}
 window.bassStyle=style;window.bassFit=fit;setTimeout(()=>{window.bassRoll=roll},0);
 // the Euclid ring is the bass rhythm: old Lock modes are converted into ring settings (and Kick avoid) so the ring always shows what plays
 function setRing(pt){const T=TR[6],f=fit(T,pt);T.st=pt.length;T.h=f.h;T.r=f.r;T.ten=f.ten;T.pt=pat(T)}
 function unlock(){const T=TR[6],P=T.p,m=P.blk||'Free';if(m==='Free')return;const K=TR[0];
  if(m==='Kick lock')setRing(K.pt.map(x=>x?1:0));else if(m==='Offbeats')setRing([...'..x...x...x...x.'].map(c=>c==='x'?1:0));
  else if(m==='Rolling'){setRing([...'.xxx.xxx.xxx.xxx'].map(c=>c==='x'?1:0));G.bavoid=true;G.bavStrict=true;if(!(P.bgt>0))P.bgt=.25}
  else if(m==='Around kick'){const T=TR[6],kp=i=>K.pt[i%K.st];let best=T.r,bo=1e9;for(let r=0;r<T.st;r++){const q=pat(Object.assign({},T,{r}));let o=0;for(let i=0;i<16;i++)if(q[i%T.st]&&kp(i))o++;if(o<bo){bo=o;best=r}}T.r=best;T.pt=pat(T);G.bavoid=true;G.bavStrict=true}P.blk='Free'}
 let bn=0,TURN=0;
 /* v0.22 Melodic: root, fifth, root, third — and the last note before a chord change steps into the new root from one scale step away */
 const nextRoot=()=>{const T=TR[6],PDT=TR[5],n=prog&&prog.length;if(!n)return null;let d=1;for(;d<=16;d++)if(T.pt[((tk+d)%T.st+T.st)%T.st])break;
  const L=16*(PDT.p.bars||1);let idx;
  if(PD&&PD.length===n){const st=[];let a=0;PD.forEach(x=>{st.push(a);a+=Math.round(x*L)});const C=a||1;idx=t=>{const q=((t%C)+C)%C;let i=0;for(let j=0;j<n;j++)if(st[j]<=q)i=j;return i}}
  else idx=t=>((Math.floor(t/L)%n)+n)%n;
  const i0=idx(tk),i1=idx(tk+d);return i1===i0?null:prog[i1]};
 function noteF(P){const r=cur.r,o=Math.round(P.oct)||1,F=d=>d2f(d,o),n=bn++;
  if(P.bns==='Phrase'){if(!window.BPH&&window.orbBassPhrase)orbBassPhrase();const B=window.BPH;if(B&&B.bars&&B.bars.length){const L=B.bars.length,bi=((Math.floor(tk/16)%L)+L)%L,e=B.bars[bi][st16()]||{d:0};
    window.BPHL=e.l?1:0;window.BPHS=e.s?1:0;let t=null;try{t=nextRoot()}catch(x){}
    if(t!=null&&t!==r){window.BPHS=1;window.BPHL=0;let f=B.chr?F(t)*Math.pow(2,(t>r?-1:1)/12):F(t>r?t-1:t+1);while(f<38)f*=2;return f}  /* approach note into the next chord */
    let f=F(r+e.d)*(e.o?2:1);while(f<38)f*=2;return f}}  /* nothing below ~38 Hz */
  if(P.bns==='Melodic'){let t=null;try{t=nextRoot()}catch(e){}if(t!=null&&t!==r)return F(t>r?t-1:t+1);return F(r+[0,4,0,2][n%4])}
  if(P.bns==='Anticipate'){let t=null;try{t=nextRoot()}catch(e){}return F(t!=null?t:r)}  /* v0.5: a note right before a chord change already plays the next chord */
   switch(P.bns){case'Root':return F(r);case'Pedal':return F(0);case'Octave':return F(r)*(n%2?2:1);case'Root + fifth':return F(n%2?r+4:r);
   case'Chord tones':return F(r+[0,2,4][Math.floor(R()*3)])*(R()<.15?2:1);case'Scale walk':return F(r+[0,1,2,3,4,3,2,1][n%8]);
   case'Arp up':return n%4===3?F(r)*2:F(r+[0,2,4][n%4]);case'Arp down':return n%4===0?F(r)*2:F(r+[4,2,0][(n%4)-1])}return 0}
 const calc=fn=>{const fx=FIX,oc=OCT;FIX=0;OCT=0;try{return fn()}finally{FIX=fx;OCT=oc}};
 const bar4=()=>((Math.floor(tk/16)%4)+4)%4===3,st16=()=>((tk%16)+16)%16;
 const _fb=fire;fire=function(k,w){if(k!==6)return _fb.apply(this,arguments);const P=TR[6].p;
  if(P.btn&&!TURN&&bar4()&&st16()>=12)return;                       // turnaround replaces the last beat of every 4th bar
  if(G.bavoid&&!TURN){const K=TR[0];if(!K.m&&K.pt[((tk%K.st)+K.st)%K.st])return}   // avoid kick: never land with the kick
  let f=TURN;const own=!f&&P.bns&&P.bns!=='Auto';if(own)f=calc(()=>noteF(P));if(!f)return _fb.apply(this,arguments);
  const ob=window.BOVF,on=window.BNSF,c0=window.BLFN;window.BOVF=f;window.BNSF=f;try{return _fb.apply(this,arguments)}finally{window.BOVF=ob;window.BNSF=on;window.BPHL=0;window.BPHS=0;if(own&&window.BLFN===c0)bn=Math.max(0,bn-1)}};
 const _ab=arrStep;arrStep=function(w){const r=_ab.apply(this,arguments);try{const s=st16();if(s===0)bn=0;const P=TR[6].p;
  if(P.btn&&playing&&!TR[6].m&&bar4()&&s>=12){TURN=calc(()=>d2f(cur.r+[0,1,2,4][s-12],Math.round(P.oct)||1)*(s===15?1:1));try{fire(6,w)}finally{TURN=0}}}catch(e){TURN=0}return r};
 function roll(W0){const W=W0||[['Octave bounce',2],['Off-beat',2],['Gallop',2],['Rolling 16ths',2],['Syncopated',2],['Walking',1],['Pedal',1],['Acid run',2],['Octave 8ths',1],['Disco run',1]];
  let t=W.reduce((a,b)=>a+b[1],0)*R();const nm=(W.find(x=>(t-=x[1])<0)||W[0])[0];style(nm,pick([0,0,0,2]));const P=TR[6].p;
  if(R()<.3)P.bns=pick(BNS.slice(1));P.btn=R()<.4;G.bavoid=R()<.25;G.bavStrict=G.bavoid;P.bph=pick([1,1,2]);try{build()}catch(e){}setTimeout(()=>window.bassSync&&bassSync(),0);setTimeout(()=>window.bassSync&&bassSync(),120);try{if(typeof say==='function')say('🎲 NEW BASSLINE · '+nm.toUpperCase()+' · '+P.bns.toUpperCase())}catch(e){}}
 window.bassUI=(g,t)=>{const P=t.p;const sep=document.createElement('div');sep.className='bksep';sep.textContent='Bass toolkit';g.appendChild(sep);
  const b=document.createElement('button');b.className='bassroll';b.textContent='New bassline';b.title='Re-roll only the bass: rhythm, notes and feel';b.onclick=e=>{e.preventDefault();roll()};g.appendChild(b);const mine=[sep,b];const add=el=>{mine.push(el);g.appendChild(el)};
  add(mkSel('Style',['Custom',...NAMES],P.bsty&&STY[P.bsty]?P.bsty:'Custom',v=>{if(v!=='Custom'){style(v);try{build()}catch(e){}setTimeout(()=>window.bassSync&&bassSync(),0);setTimeout(()=>window.bassSync&&bassSync(),120)}}));
  add(mkSel('Notes',BNS,P.bns||'Auto',v=>{P.bns=v}));
  add(mkSel('Kick',['Play with kick','Avoid kick'],G.bavoid?'Avoid kick':'Play with kick',v=>{G.bavoid=v==='Avoid kick';G.bavStrict=G.bavoid}));
  add(mkSel('Turnaround',['Off','Every 4th bar'],P.btn?'Every 4th bar':'Off',v=>{P.btn=v!=='Off'}));const fix=()=>mine.forEach(e=>{e.dataset.g='pat'});fix();queueMicrotask(fix);setTimeout(fix,0);setTimeout(()=>window.bassLayout&&bassLayout(),0)};
 // sound design sliders on the Bass card
 try{const X=TR[6].x;if(!X.some(x=>x[1]==='bpp'))X.push(['Pitch punch','bpp',0,1,.01],['Growl','bgr',0,1,.01])}catch(e){}
 const defs=()=>{const P=TR[6].p;if(P.bpp==null)P.bpp=0;if(P.bgr==null)P.bgr=0};defs();
 const setSl=(card,lab,v,dec)=>{const d=[...card.querySelectorAll('.sl')].find(x=>x.firstChild&&x.firstChild.firstChild&&x.firstChild.firstChild.textContent===lab);if(!d)return;const i=d.querySelector('input');if(i)i.value=v;const b=d.querySelector('b');if(b)b.textContent=(+v).toFixed(dec)};
 const syncUI=()=>{try{const P=TR[6].p,T=TR[6],card=TR[6].mb&&TR[6].mb.closest('.card');if(!card)return;setSl(card,'Steps',T.st,0);setSl(card,'Hits',T.h,0);setSl(card,'Rotate',T.r,0);setSl(card,'Tension',T.ten||0,2);try{draw(T,-1)}catch(e){}card.querySelectorAll('select').forEach(sel=>{const o=[...sel.options].map(x=>x.value);
   if(o.includes('Octave bounce'))sel.value=P.bsty&&STY[P.bsty]?P.bsty:'Custom';else if(o.includes('Scale walk'))sel.value=P.bns||'Auto';else if(o.includes('Avoid kick'))sel.value=G.bavoid?'Avoid kick':'Play with kick';
   else if(o.includes('Every 4th bar'))sel.value=P.btn?'Every 4th bar':'Off';else if(o.includes('2 bars'))sel.value=(P.bph||1)+((P.bph||1)>1?' bars':' bar');else if(o.includes('Kick lock'))sel.value=P.blk||'Free'})}catch(e){}};
 window.bassSync=()=>syncUI();
 const _gb=generate;generate=function(){const P=TR[6].p;P.bns='Auto';P.bsty='Custom';P.btn=false;G.bavStrict=false;const r=_gb.apply(this,arguments);defs();const Q=TR[6].p;Q.oct=Math.max(0,Math.min(2,Math.round(Q.oct)||1));try{unlock()}catch(e){}setTimeout(syncUI,30);setTimeout(syncUI,250);return r};
 try{build()}catch(e){}
 const st=document.createElement('style');st.textContent='.bassroll{grid-column:1/-1;min-height:40px;border:1px solid var(--acc,#ffe44d);border-radius:10px;background:rgba(255,228,77,.08);color:var(--acc,#ffe44d);font:inherit;font-weight:700;letter-spacing:.06em;cursor:pointer}.bassroll:active{background:rgba(255,228,77,.25)}';document.head.appendChild(st)}

