
/* ---- v0.24: Launch quality.
   1 BEST OF SEVERAL TRIES — the lead's rhythm is scored at every rotation (against kick, bass, stab and clap: fewer collisions, a phrase start,
     some off-beats) and one of the three best is kept. For Motif, Marbles and Turing-loop leads, four melodies are tried and the most musical
     one is kept (stepwise motion with a few leaps, chord tones on the strong notes, a repeated cell, a resolving last note, not stuck in one place).
   2 QUALITY GATE — no more than 7 tracks at once (perc or stab steps out first), lead / stab / perc never all busy together,
     a hook always plays, a lone lead is never a single hit.
   3 GROOVE PER TRACK — small timing offsets per track by mood feel (laid back · driving · bouncy), scaled by the Groove fader (Mix).
   4 REGISTER SLOTS — new Lead "Octave" knob (Sound → Osc); Launch lifts the lead an octave when pad or stab sit in its range,
     and keeps the pad's open voicing out of the lead's way. Bass-register leads (Reese, Mini bass, drones) stay low. ---- */
{Object.assign(TR[4].p,{loct:TR[4].p.loct||0});if(!TR[4].x.some(x=>x[1]==='loct'))TR[4].x.push(['Octave','loct',-1,1,1]);
 const on=k=>TR[k]&&!TR[k].m,dens=k=>{const T=TR[k];return T.pt.filter(x=>x).length/Math.max(1,T.st)};
 // ---------- 1a rhythm score
 const rscore=(pt,ctxs)=>{let s=0;const hits=[];pt.forEach((x,i)=>{if(x)hits.push(i)});
  hits.forEach(i=>{ctxs.forEach(([q,w])=>{if(q[i%q.length])s-=w});if(i%4===2)s+=.25});
  if(hits.some(i=>i<4))s+=.8;let run=0;for(let i=0;i<pt.length;i++){run=pt[i]?run+1:0;if(run===3)s-=.5}return s};
 const bestRotation=()=>{const L=TR[4];if(L.st!==16||L.h<1||L.h>=16)return;const ctxs=[];
  if(on(0)&&TR[0].st===16)ctxs.push([TR[0].pt,1]);if(on(6)&&TR[6].st===16)ctxs.push([TR[6].pt,.6]);if(on(8)&&TR[8].st===16)ctxs.push([TR[8].pt,.6]);if(on(2)&&TR[2].st===16)ctxs.push([TR[2].pt,.3]);
  const c=[];for(let r=0;r<16;r++){const o=Object.assign({},L,{r});const pt=pat(o);c.push([rscore(pt,ctxs)+R()*.15,r,pt])}c.sort((a,b)=>b[0]-a[0]);const w=pick(c.slice(0,3));L.r=w[1];L.pt=w[2]};
 // ---------- 1b melody score
 const mscore=(ds,top)=>{if(ds.length<2)return 0;const n=SC[G.scale].length,ct=new Set(cur.n.map(x=>((x%n)+n)%n)),isCT=d=>ct.has(((d%n)+n)%n);let s=0,st=0;
  for(let i=1;i<ds.length;i++){const a=Math.abs(ds[i]-ds[i-1]);st+=a;if(a>6)s-=1.5;else if(a>4)s-=.8}const mean=st/(ds.length-1);s+=mean>=1&&mean<=2.5?1:-.5;
  if(Math.max(...ds)-Math.min(...ds)<2)s-=1;s+=1.5*ds.filter((d,i)=>i%4===0&&isCT(d)).length/Math.ceil(ds.length/4);if(isCT(ds[ds.length-1]))s+=.5;
  const bg={};for(let i=1;i<ds.length;i++){const k=ds[i-1]+','+ds[i];bg[k]=(bg[k]||0)+1}s+=Math.min(1.2,.3*Object.values(bg).filter(v=>v>1).length);
  s-=.3*Math.max(0,ds.filter(d=>d>=top-2).length-2);return s};
 const bestMelody=()=>{const P=TR[4].p,m=P.mode,n=SC[G.scale].length,top=Math.max(1,Math.round(P.range||1))*n,L=Math.max(2,Math.round(P.len||8));
  if(!['Motif','Marbles','Turing loop'].includes(m))return;const tries=[];
  for(let k=0;k<4;k++){if(m==='Motif'){mot=[];mp=-1}else if(m==='Marbles'){buf=[];bp=-1}else window.TURING&&TURING.reset();
   const ds=[];for(let i=0;i<L;i++)ds.push(leadNote(P));const st=m==='Motif'?mot.slice():m==='Marbles'?buf.slice():(window.TURING?TURING.get():[]);tries.push([mscore(ds,top),st])}
  tries.sort((a,b)=>b[0]-a[0]);const best=tries[0][1];if(m==='Motif'){mot=best;mp=-1}else if(m==='Marbles'){buf=best;bp=-1}else window.TURING&&TURING.set(best)};
 // ---------- 2 quality gate
 const gate=()=>{const act=[1,2,3,4,5,6,7,8].filter(on);
  if(act.length>7){const out=[3,8].filter(on).sort((a,b)=>dens(b)-dens(a))[0];if(out!=null)TR[out].m=true}
  if(on(4)&&on(8)&&on(3)&&dens(4)>=.4&&dens(8)>=.4&&dens(3)>=.4){const P=TR[3];P.h=Math.max(2,Math.round(P.h*.6));P.pt=pat(P)}
  if(!on(4)&&!on(5)&&!on(8)&&TR[5])TR[5].m=false;
  if(on(4)&&!on(5)&&!on(8)&&TR[4].h<=1&&TR[4].st<=16&&TR[4].p.mode!=='Acid 303'){TR[4].h=3;TR[4].pt=pat(TR[4])}};
 // ---------- 4 register slots
 const LOWL=new Set(['Reese','Mini bass','Weird drone','Mini drone']);
 const slots=()=>{const L=TR[4],P=L.p;P.loct=0;if(!on(4)||P.mode==='Acid 303'||LOWL.has(P.patch))return;const pad=on(5),stab=on(8),rng=Math.round(P.range||1);
  if((stab||(pad&&(TR[5].p.open||0)>.3))&&rng<=1)P.loct=1;if(pad&&P.loct===0)TR[5].p.open=Math.min(TR[5].p.open||0,.25)};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{gate();slots();if(on(4)&&TR[4].p.mode!=='Acid 303'){bestRotation();bestMelody()}}catch(e){console.warn('[orbitron] quality',e)}
  try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0);return r};
 // ---------- 3 groove per track
 const FEEL={laid:{1:[0,.008,.003,.01],2:.006,7:.004,6:.005,4:.003,8:.004,3:.002},drive:{1:[0,.003,.001,.004],2:-.002,7:0,6:0,4:0,8:.001,3:0},bounce:{1:[0,.006,.002,.007],2:.002,7:.002,6:.004,4:.002,8:.002,3:.001}};
 const FM={'Melodic House':'laid',Dreamy:'laid',Vector:'laid',Noir:'laid',Breaks:'laid',Ethereal:'laid',Melancholic:'laid','Deep Space':'laid',Ambient:'laid',
  Tense:'drive',Acid:'drive',Power:'drive','Groove Techno':'drive',Temporal:'drive',Dark:'drive','Distorted Electro':'drive',Drone:'drive',Italo:'bounce',Hopeful:'bounce',Bleep:'bounce'};
 const _f=fire;fire=function(k,w){const g=G.groove||0,F=FEEL[FM[curMood]];if(window.__feelOff||typeof w!=='number'||!F||g<.01||F[k]==null||!ctx)return _f.apply(this,arguments);const s=((tk%4)+4)%4;
  let dt=Array.isArray(F[k])?F[k][s]:(k===6?(s%2?F[k]:0):k===3?F[k]+(R()-.5)*.004:F[k]);dt*=g*(window.__feelA!=null?__feelA:1);if(w+dt<ctx.currentTime+.002)dt=0;const a=[...arguments];a[1]=w+dt;return _f.apply(this,a)};
 window.orbQuality={bestRotation,bestMelody,gate,slots}}
