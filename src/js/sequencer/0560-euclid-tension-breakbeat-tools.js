/* ---- v65: Euclid tension lives in pat(); reset on each Launch ---- */
{const _g65=generate;generate=function(){TR.forEach(T=>{T.ten=0;T.acc=0;T.gho=0;T.vari=0;T.vel=null});return _g65.apply(this,arguments)}}
/* ---- v67: breakbeat tools in the Euclid sequencer (drums) — Accent (loud/soft pattern over the hits), Ghosts (quiet in-between hits), Variation (bar-to-bar pattern changes; snare gets a fill every 4 bars) ---- */
{const RK=[0,1,2,3,7],hs=(a,b,c)=>{const x=Math.sin(a*12.9898+b*78.233+c*37.719)*43758.5453;return x-Math.floor(x)};
 const VP={},bar=T=>Math.floor(tk/T.st);
 // varied pattern for this bar: non-first hits nudge by a step either way (deterministic per bar)
 function varPat(k){const T=TR[k],b=bar(T),key=k+'|'+b+'|'+T.st+'|'+T.pt.join('');if(VP[k]&&VP[k].key===key)return VP[k].p;let p=null;
  const v=T.vari||0,odd=b%2===1,four=b%4===3;if(v>0&&(odd||four)&&hs(k+3,b,1)<v*(four?1:.7)){p=T.pt.slice();const on=[];p.forEach((x,i)=>{if(x)on.push(i)});
   on.slice(1).forEach((s,j)=>{if(hs(k,b,j+5)<v*.6){const d=hs(k,b,j+9)<.5?-1:1,t=(s+d+T.st)%T.st;if(!p[t]){p[s]=0;p[t]=1}}});if(four&&v>.6&&on.length>2&&k!==0)p[on[on.length-1]]=0}
  VP[k]={key,p};return p}
 const fillOn=k=>k===7&&(TR[7].vari||0)>.5&&bar(TR[7])%4===3&&tk%TR[7].st>=TR[7].st-4;
 const accV=(T,s)=>{const a=T.acc||0;if(!a)return 1;const on=[];T.pt.forEach((x,i)=>{if(x)on.push(i)});const j=on.indexOf(s);if(j<0)return 1;const n=on.length,ha=Math.max(1,Math.round(n*.45));return(j*ha)%n<ha?1:1-.6*a};
 const play=(k,w,v)=>{const T=TR[k],o=T.lv;T.lv=o*v;try{_f67(k,w)}finally{T.lv=o}};
 const _f67=fire;fire=function(k,w){if(!RK.includes(k))return _f67(k,w);const T=TR[k],s=tk%T.st;if(fillOn(k))return;const vp=varPat(k);if(vp&&!vp[s])return;const v=accV(T,s);if(v>=.999)return _f67(k,w);play(k,w,v)};
 const _a67=arrStep;arrStep=function(w){_a67(w);if(!ctx)return;const sd=sdur(),sw=tk%2?G.swing*sd:0;
  RK.forEach(k=>{const T=TR[k];if(!T||T.m)return;const s=tk%T.st;
   if(fillOn(k)){const i=s-(T.st-4);play(k,w+sw,.45+.15*i);if(i>=2)play(k,w+sw+sd/2,.4+.15*i);return}
   const vp=varPat(k);if(vp&&vp[s]&&!T.pt[s])play(k,w+sw,accV(T,s)*.9);
   const g=T.gho||0;if(g>0&&(QOS.ml||0)<2&&!(vp||T.pt)[s]){const c=g*(s%2?.6:.22)*(k===0?.4:1);if(hs(k+11,s,Math.floor(tk/32))<c)play(k,w+sw,.18+.14*g)}})}}
