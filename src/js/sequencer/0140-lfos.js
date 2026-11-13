/* ---- 2 assignable LFOs ---- */
const LF_V=["Lead cutoff","Lead decay","Bass cutoff","Stab cutoff","Hat tone","Perc FM","Sidechain depth"];
const LF_P=["Master low-pass","Master high-pass","Master pump","Delay mix","Delay feedback","Reverb mix","Rumble","Bus grit"];
const LF_SH=["Sine","Triangle","Saw up","Saw down","Square","Sample & hold"];
const LF_DV=[["64 bars",256],["32 bars",128],["16 bars",64],["8 bars",32],["4 bars",16],["2 bars",8],["1 bar",4],["1/2 bar",2],["1 beat",1],["1/8",.5],["1/16",.25]];
const LFOS=[{tg:"Lead cutoff",sh:0,sync:1,div:4,hz:.5,d:0,ph:0,seed:1},{tg:"Master low-pass",sh:1,sync:1,div:16,hz:.2,d:0,ph:0,seed:2},{tg:"Master low-pass",sh:0,sync:1,div:64,hz:.05,d:0,ph:0,seed:3,slow:1}];
const LF_SLOW=[["4 bars",16],["8 bars",32],["16 bars",64],["32 bars",128],["64 bars",256]];
const lfShape=(s,c,seed)=>{const f=c-Math.floor(c);switch(s){case 0:return Math.sin(6.2831853*f);case 1:return f<.5?4*f-1:3-4*f;case 2:return 2*f-1;case 3:return 1-2*f;case 4:return f<.5?1:-1;default:{const x=Math.sin(Math.floor(c)*12.9898+seed*78.233)*43758.5453;return 2*(x-Math.floor(x))-1}}};
const lfCyc=(L,t)=>L.sync?(playing?(tk>=(window.LF0||0)?tk-(window.LF0||0):tk)+(t-nextT)/(60/G.bpm/4):0)/(L.div*4)+L.ph:t*L.hz+L.ph; /* v0.35: synced cycles count from the bar of the last Launch */
const lfV=(L,t)=>lfShape(L.sh,lfCyc(L,t),L.seed);
function mv(tg,t){if(!ctx)return 0;let s=0;for(const L of LFOS)if(L.d>0&&L.tg===tg)s+=L.d*lfV(L,t);return s}
function mvd(tg,t){let s=0,d=0;for(const L of LFOS)if(L.d>0&&L.tg===tg){s+=L.d*lfV(L,t);d+=L.d}return[s,d]}
const LF_ACT={};
function lfTick(){if(!ctx||!playing)return;const t=ctx.currentTime,sa=(prm,tg,base,fn)=>{const[s,d]=mvd(tg,t+.03);if(d>0){LF_ACT[tg]=1;prm.setTargetAtTime(fn(s,d),t,.025)}else if(LF_ACT[tg]){LF_ACT[tg]=0;prm.setTargetAtTime(base(),t,.05)}};
 sa(A.lp.detune,"Master low-pass",()=>0,(s,d)=>-2400*(s+d));
 sa(A.hp.detune,"Master high-pass",()=>0,(s,d)=>3600*(s+d));
 sa(A.sg.gain,"Master pump",()=>1,(s,d)=>Math.max(.05,1-.45*(s+d)));
 sa(A.dO.gain,"Delay mix",()=>G.dly,(s,d)=>Math.max(0,G.dly+.5*s));
 sa(A.dF.gain,"Delay feedback",()=>G.fb,(s,d)=>Math.max(0,Math.min(.88,G.fb+.35*s)));
 sa(A.rO.gain,"Reverb mix",()=>G.rev,(s,d)=>Math.max(0,G.rev+.6*s));
 sa(A.rg.gain,"Rumble",()=>G.rumble,(s,d)=>Math.max(0,G.rumble+.5*s));
 sa(A.gr.gain,"Bus grit",()=>G.bgrit*.3,(s,d)=>Math.max(0,(G.bgrit+.5*(s+d))*.3))}
setInterval(lfTick,30);
{const root=$("#t-lfo"),cvs=[];
 LFOS.forEach((L,n)=>{const pn=document.createElement("div");pn.className="panel";pn.innerHTML='<h2>LFO '+(n+1)+(L.slow?' · orbit C · slow':'')+'</h2>';
  const cv=document.createElement("canvas");cv.width=600;cv.height=110;cv.style.cssText="width:100%;height:auto;max-width:none;display:block;margin:0 0 8px";pn.appendChild(cv);cvs.push(cv);
  const row=document.createElement("div");row.className="top";row.style.marginBottom="8px";
  const mk=(opts,val,fn)=>{const s=document.createElement("select");opts.forEach(o=>s.add(new Option(o[0],o[1])));s.value=val;s.onchange=()=>fn(s.value);row.appendChild(s);return s};
  const tgOpts=[["— Voice (per note) —","",],...LF_V.map(x=>[x,x]),["— Master / FX (continuous) —",""],...LF_P.map(x=>[x,x])];
  const ts=mk(tgOpts,L.tg,v=>{if(v)L.tg=v;else ts.value=L.tg});
  mk(LF_SH.map((x,i)=>[x,i]),L.sh,v=>L.sh=+v);
  const ms=mk([["Tempo sync",1],["Free Hz",0]],L.sync,v=>{L.sync=+v;sy.hidden=!L.sync;hz.hidden=!!L.sync});
  const sy=mk((L.slow?LF_SLOW:L===LFOS[0]?LF_DV.concat([["1/16 dotted",.375],["1/16 triplet",1/6],["1/32 dotted",.1875]]):LF_DV).map(x=>[x[0],x[1]]),L.div,v=>L.div=+v); /* v0.35: LFO 1 goes fast */
  pn.appendChild(row);
  const g=document.createElement("div");g.className="grid";
  const hz=document.createElement("div");hz.hidden=!!L.sync;
  sl(hz,"Rate Hz",.05,L===LFOS[0]?40:12,L.hz,.05,v=>L.hz=v);
  pn.appendChild(g);
  sl(g,"Depth",0,1,L.d,.01,v=>L.d=v);sl(g,"Phase",0,1,L.ph,.01,v=>L.ph=v);
  const hzw=document.createElement("div");g.appendChild(hz);
  root.appendChild(pn)});
 const note=document.createElement("p");note.className="gnote";note.textContent="Depth 0 = off. Voice targets are read on each note; Master/FX targets move continuously while playing. Sync rate is a full cycle.";root.appendChild(note);
 const draw=()=>{if(root.hidden)return;const t=ctx?ctx.currentTime:0;
  cvs.forEach((cv,n)=>{const L=LFOS[n],x=cv.getContext("2d"),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
   x.strokeStyle="rgba(0,255,156,.2)";x.lineWidth=1;x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();
   x.strokeStyle=L.d>0?"#ffe44d":"rgba(255,228,77,.4)";x.lineWidth=3;x.beginPath();
   for(let i=0;i<=W;i+=3){const f=i/W,y=H/2-lfShape(L.sh,f+L.ph*0+(L.sh===5?0:0),L.seed)*(H/2-8)*1;i?x.lineTo(i,y):x.moveTo(i,y)}
   x.stroke();
   const c=lfCyc(L,t),f=c-Math.floor(c),px=((f-L.ph)%1+1)%1*W;
   x.strokeStyle="#00ff9c";x.lineWidth=2;x.beginPath();x.moveTo(px,0);x.lineTo(px,H);x.stroke();
   const v=lfShape(L.sh,c,L.seed);x.fillStyle="#00ff9c";x.beginPath();x.arc(px,H/2-v*(H/2-8)*1,6,0,6.2832);x.fill()})};
 setInterval(draw,50)}
