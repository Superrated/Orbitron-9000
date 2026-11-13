/* ---- v70: bassline tools — Lock (free / kick lock / around kick / offbeats), Phrase (1/2/4 bars with a walking turnaround fill in the last bar), Note length (gate: staccato → legato), Slide (303-style glides), Ghost notes ---- */
{const B=TR[6],hs=(a,b,c)=>{const x=Math.sin(a*12.9898+b*78.233+c*37.719)*43758.5453;return x-Math.floor(x)};
 Object.assign(B.p,{blk:B.p.blk||'Free',bph:B.p.bph||1,bgt:B.p.bgt||0,bsl:B.p.bsl||0,bgh:B.p.bgh||0});
 const kickHit=s=>{const K=TR[0];return K.pt[s%K.st]};
 // effective bass rhythm for a step (before fills)
 const own=s=>{const P=B.p,m=P.blk;if(m==='Kick lock')return!!kickHit(s);if(m==='Offbeats')return s%4===2;if(m==='Rolling')return s%4!==0&&!kickHit(s);const x=!!B.pt[s%B.st];return m==='Around kick'?x&&!kickHit(s):x};
 const inFill=s=>{const L=B.p.bph||1;return !B.p.btn&&L>1&&Math.floor(tk/16)%L===L-1&&s%16>=10};
 const nextHit=s=>{const K=TR[0];for(let d=1;d<=16;d++)if((own(s+d)&&!(G.bavoid&&!K.m&&K.pt[(s+d)%K.st]))||(inFill(s+d)&&[10,12,14].includes((s+d)%16)))return d;return 16};
 let lastBassStep=-9;
 function play(w,opt){const P=B.p,sd=sdur(),o={dec:P.dec,cut:P.cut,lv:B.lv},s=tk;window.BFDEC=P.dec;
  const cap=P.bsus>.01?Math.min(4,24*sd):1.6;if(P.bgt>0)P.dec=Math.max(.05,Math.min(cap,P.bgt*nextHit(s)*sd*.95));else if(P.bsus>.01)P.dec=Math.max(.05,Math.min(cap,nextHit(s)*sd*.95));if(window.BPHL)P.dec=Math.max(.05,Math.min(1.6,nextHit(s)*sd*.95));else if(window.BPHS)P.dec=Math.min(P.dec,sd*.9); // v0.26 Phrase long/short notes. v0.22: with Sustain a note holds until the next bass note (Gate shortens it)
  if(opt&&opt.ghost){P.dec=Math.min(P.dec,.09);P.cut=P.cut*.55;B.lv=B.lv*.38}
  if(opt&&opt.fan){P.dec=Math.min(P.dec,sd*.7);B.lv=B.lv*(s%4===2?.9:.74)}  // v0.5 fancy notes: short, a little softer, off-beats a bit stronger
  if(opt&&opt.roll){if(!(P.bgt>0))P.dec=Math.min(P.dec,sd*.85);B.lv=B.lv*(opt.roll===1?.8:opt.roll===2?1:.9)}
  window.BOVF=window.BNSF||opt&&opt.f||0;{const fz=P.bfan||0,s16=((s%16)+16)%16;if(fz>0&&!opt&&P.bns!=='Anticipate'&&P.bns!=='Phrase'&&Math.floor(s/16)%2===1&&s16>=12&&hs(19,B.h+B.r*3,s16)<fz*1.2){const sO=OCT;OCT=0;try{window.BOVF=d2f(cur.r+(hs(23,B.h,B.r)<.5?2:4),P.oct)}finally{OCT=sO}}}  /* v0.5 Fancy: call and answer — bar 2 of a pair ends a chord tone higher */
  const held=P.bsus>.01,touch=window.BLE&&w<=BLE+.012,sl=P.bsl>0&&window.BLF&&(held?touch:s-lastBassStep<=4)&&hs(7,s%32,Math.floor(tk/32))<(held?Math.min(1,P.bsl*2):P.bsl);const fsl=opt&&opt.fan&&window.BLF&&hs(17,s%32,B.h+B.r)<.25;window.BSLF=(sl||fsl)?BLF:0;window.BSLT=held?Math.min(.14,sd*.9):Math.min(.09,sd*.6); /* v0.22: held bass slides only between touching notes, a little slower */
  const bv=G.bavoid;if(opt&&opt.force&&!G.bavStrict)G.bavoid=false;if(G.bavoid&&G.bavStrict){const K=TR[0];if(!K.m&&K.pt[((s%K.st)+K.st)%K.st])return}try{window.BLE=w+P.dec;_f70(6,w)}finally{G.bavoid=bv;P.dec=o.dec;P.cut=o.cut;B.lv=o.lv;window.BOVF=0;window.BSLF=0;window.BFDEC=0}if(!(opt&&opt.ghost))lastBassStep=s}
 const _f70=fire;fire=function(k,w){if(k!==6)return _f70(k,w);const P=B.p,s=tk;if(inFill(s))return;
  if(P.blk!=='Free'&&P.blk!=='Around kick')return; // handled per step below
  if(P.blk==='Around kick'&&kickHit(s))return;play(w)};
 const _a70=arrStep;arrStep=function(w){_a70(w);if(!ctx||B.m)return;const P=B.p,s=tk,wt=w;
  if(inFill(s)){const i=[10,12,14].indexOf(s%16);if(i>=0){const ps=TR[5],Lc=16*(ps.p.bars||1),ci=Math.floor((tk+16)/Lc)%ps.st,nr=prog[ci]!=null?prog[ci]:cur.r,sO=OCT;OCT=0;
    const deg=[cur.r+4,cur.r+7,nr+1][i],f=d2f(deg,P.oct);OCT=sO;play(wt,{f,force:1})}return}
  if((P.blk==='Kick lock'&&kickHit(s))||(P.blk==='Offbeats'&&s%4===2)||(P.blk==='Rolling'&&s%4!==0&&!kickHit(s))){play(wt,P.blk==='Rolling'?{force:1,roll:s%4}:{force:1});return}
  const g=P.bgh||0;if(g>0&&(QOS.ml||0)<2&&!own(s)&&hs(3,s%32,Math.floor(tk/32))<g*(s%2?.5:.18)){play(wt,{ghost:1});return}
  /* v0.5 FANCY NOTES: extra short notes in the gaps of the bassline for a bouncy, busy line — an approach note one scale step under
     or over the next note, a 16th repeat pickup of the next note (sometimes an octave up), a short run up at the end of every 4th bar,
     and call and answer: bar 2 of every pair ends a chord tone higher. The choices repeat every 2 bars. */
  const fz=P.bfan||0;if(fz>0&&(QOS.ml||0)<2&&!own(s)&&prog&&prog.length){const s16=((s%16)+16)%16,h=hs(11,s%32,B.h+B.r*3),ps=TR[5],Lc=16*(ps.p.bars||1),
    tgt=t=>{const v=prog[Math.floor(t/Lc)%prog.length];return v!=null?v:cur.r};let deg=null,x2=1;
   if(own(s+1)&&h<fz*.3)deg=tgt(s+1)+(h<fz*.17?-1:1);                       // approach note
   else if(own(s+1)&&h<fz*.6){deg=tgt(s+1);if(hs(13,s%32,B.h)<.35)x2=2}   // repeat pickup (sometimes an octave up)
   else if(Math.floor(s/16)%4===3&&s16>=12&&h<fz*.75)deg=cur.r+[1,2,3,4][s16-12];
   if(deg!=null){const sO=OCT;OCT=0;let f;try{f=d2f(deg,P.oct)*x2}finally{OCT=sO}if(f>0)play(wt,{f,force:1,fan:1})}}};
 const _g70=generate;generate=function(){Object.assign(B.p,{blk:'Free',bph:1,bgt:0,bsl:0,bgh:0,bfan:0});return _g70.apply(this,arguments)}}
