
/* ---- v0.4: ACID LINE GENERATOR — written like a 303 part instead of a random note per step.
   · Motif: a 4- or 8-step cell (mostly root and octave, plus two "colour" notes chosen for the whole line), repeated across the bar,
     with a small turnaround in the last steps.
   · Rests are part of the cell (so they repeat), never on step 1, preferring the steps where the kick hits.
   · Slides only between two different notes (more often on octave jumps); accents on the cell start and on octave notes.
   · Like Motif mode it makes several candidates and keeps the best (root share, few big leaps, a sensible number of slides/accents).
   The line's rhythm is written into the lead ring (16 steps). Déjà vu below 1 still changes a single note now and then. ---- */
{const pk=a=>a[Math.floor(R()*a.length)],wpick=o=>{let t=0;for(const k in o)t+=o[k];let u=R()*t;for(const k in o){if((u-=o[k])<0)return +k}return +Object.keys(o)[0]};
 const cand=p=>{const n=SC[G.scale].length,colors=[2,4,n-1,1,n+2].filter((v,i,a)=>a.indexOf(v)===i),pal=[];while(pal.length<2){const c=pk(colors);if(!pal.includes(c))pal.push(c)}
  const L=R()<.65?8:4,cell=[],rest=[],kick=TR[0]&&TR[0].pt?TR[0].pt:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0];
  for(let i=0;i<L;i++){cell.push(i===0?(R()<.85?0:n):wpick({0:45,[n]:20,[pal[0]]:20,[pal[1]]:15}));
   rest.push(i>0&&!(rest[i-1]&&rest[i-2])&&R()<(kick[i%kick.length]?.32:.16))}   // never more than two rests in a row
  const N=[],P=[],A=[],S=[];
  for(let i=0;i<16;i++){N.push(cell[i%L]);P.push(rest[i%L]?0:1)}
  // turnaround: change 1–2 notes in the last 4 steps (a colour note or the octave), and make sure the last step isn't a lone rest run
  const tn=1+(R()<.5?1:0);for(let k=0;k<tn;k++){const i=12+Math.floor(R()*4);N[i]=pk([n,pal[0],pal[1],n+2]);P[i]=1}
  P[0]=1;
  for(let i=0;i<16;i++){const nx=(i+1)%16,oct=N[i]>=n;
   A.push(P[i]&&((i%L===0&&R()<.6)||(oct&&R()<.5)||R()<(p.accp||.3)*.35)?1:0);
   // slide INTO step i from the previous played note (this voice reads s[i] as "glide into this note")
   const pv=(i+15)%16;S.push(i>0&&P[i]&&P[pv]&&N[pv]!==N[i]&&R()<Math.min(.85,(p.glide||.3)*1.4+(Math.abs(N[pv]-N[i])>=n?.2:0))?1:0)}
  return {N,P,A,S,L}};
 const score=(c,n)=>{const on=c.P.reduce((a,b)=>a+b,0),roots=c.N.filter((v,i)=>c.P[i]&&v%n===0).length/Math.max(1,on),
   leaps=c.N.filter((v,i)=>i&&c.P[i]&&c.P[i-1]&&Math.abs(v-c.N[i-1])>n+2).length,sl=c.S.reduce((a,b)=>a+b,0),ac=c.A.reduce((a,b)=>a+b,0);
  return -Math.abs(roots-.5)*4-leaps*1.5-Math.abs(sl-3.5)*.6-Math.abs(ac-4.5)*.5-Math.abs(on-12)*.4};
 acidGen=function(p){const n=SC[G.scale].length;let best=null,bs=-1e9;for(let t=0;t<8;t++){const c=cand(p),sc=score(c,n);if(sc>bs){bs=sc;best=c}}
  AC.n=best.N;AC.a=best.A;AC.s=best.S;AC.cell=best.L;AC.key=G.scale+'|'+p.seed+'|'+p.glide.toFixed(2)+'|'+p.accp.toFixed(2);
  try{const T=TR[4];T.st=16;T.pt=best.P.slice();T.h=best.P.reduce((a,b)=>a+b,0);T.r=0;setTimeout(()=>{try{draw(T,-1);window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){}};
 window.orbAcid={gen:()=>acidGen(TR[4].p),line:()=>({n:AC.n,a:AC.a,s:AC.s,pt:TR[4].pt,cell:AC.cell})}}
