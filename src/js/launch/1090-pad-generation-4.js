/* ---- v157: pad generation, round four —
   (1) Chord memory: one minor-7th/9th shape moved in parallel, played as dub/Detroit stabs with echo (new Pad style; some moods pick it)
   (2) Room for the lead: while a lead note sounds, the pad dips ~2 dB with a gentle notch around the lead's pitch, then blooms back
   (3) Register discipline: pad voicings stay above ~C3, the deep root drops out while the bass or sub is busy, 4-note chords open up
   (6) Vamp: one held chord retriggered each bar while a soft top voice walks (new Pad style)
   (7) Launch never repeats the previous progression in a mood, and sometimes uses 2, 3, 6 or 8 chords instead of 4 ---- */
{const CMS=[[0,3,7,10,14],[0,3,7,10],[0,7,10,15],[0,5,10,15],[0,3,10,14]],CMP=['0010001000100010','0010010000100100','1000001000100000','0001001000010010','0010000100100010'];
 window.cmPrep=()=>{G.cmShape=pick(CMS);G.cmPat=pick(CMP)};
 /* v0.22: chord memory plays step by step. pad() at a chord change only stores the chord (and plays its first stab);
    each following step with a hit calls pad(-1,w) so stabs pass through the pad's own routing (low-pass fader, mute, EQ) right away. */
 let CMC=null;
 const stab1=(w0,root)=>{const T=TR[5],p=T.p,sh=G.cmShape,e=w0+.45;let rf=d2f(root,p.oct||2);while(rf<110)rf*=2;while(rf>260)rf/=2;const v=T.lv*.25/Math.sqrt(sh.length);
   const g=padGain(ctx.createGain()),q=ctx.createBiquadFilter(),cb=Math.max(900,(p.cut||800)*1.4); /* bright enough to cut through even when the pad is dark */
   q.type='lowpass';q.Q.value=4;q.frequency.setValueAtTime(cb+2600,w0);q.frequency.exponentialRampToValueAtTime(cb,w0+.18);
   g.gain.setValueAtTime(.0001,w0);g.gain.exponentialRampToValueAtTime(v,w0+.004);g.gain.exponentialRampToValueAtTime(.0001,w0+.32);
   sh.forEach(st=>{const f=rf*Math.pow(2,st/12);[-7,7].forEach(dt=>{const o=osc('sawtooth',f,w0,e);o.detune.value=dt;o.connect(q)})});q.connect(g);send(g,A.dk,.5,.3)};
 window.cmStab=function(t,w,dur){if(!G.cmShape)cmPrep();const pt=G.cmPat||CMP[0];
  if(t<0){if(CMC&&w<CMC.until-1e-3&&CMC.last!==w){CMC.last=w;stab1(w,CMC.root)}return}
  const T=TR[5],p=T.p,root=prog[t];const ds=(SHP[pshape[t]]||SHP['7']).slice(0,Math.max(3,Math.round(p.size))).map(i=>root+i);
  cur={r:root,n:ds,x:(PX.length===prog.length?PX[t]||0:0)};chordLog(w,cur);pmean=null;
  CMC={root,until:w+dur,last:w};const s0=((tk%16)+16)%16;if(pt[s0]==='1')stab1(w,root)};
 const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);try{if(padStyle==='Chord memory'&&playing&&!TR[5].m&&CMC&&(G.cmPat||'')[((tk%16)+16)%16]==='1')pad(-1,w,0)}catch(e){}return r};
 // ---- (2) room for the lead ----
 const ACT=[];let PADON=0;
 const _pd=pad;pad=function(t,w,dur){PADON++;const T=TR[5],P=T.p,keep={oct:P.oct,sub:P.sub,open:P.open},ptl=G.ptl;
  try{// (3) register: lowest pad note at or above ~C3, no deep root while bass/sub is busy, open up 4+ note chords
   if(padStyle!=='Chord memory'){let o=P.oct||2;const sO=OCT;OCT=G.oct||0;try{while(o<5&&d2f(prog[t]||0,o)<125)o++}finally{OCT=sO}P.oct=o;
    const bassBusy=(!TR[6].m&&TR[6].h/Math.max(1,TR[6].st)>.25);if(bassBusy)P.sub=0;if((P.size||3)>=4)P.open=Math.max(P.open||0,.45)}
   if(padStyle==='Chord memory')G.ptl=0;if(padStyle==='Vamp')G.ptl=1;
   return _pd.apply(this,arguments)}finally{PADON--;P.oct=keep.oct;P.sub=keep.sub;P.open=keep.open;G.ptl=ptl}};
 const _sd=send;send=function(n,out,dly,rev){if(!PADON||!ctx||(typeof DR!=='undefined'&&DR.rendering)||ctx instanceof OfflineAudioContext)return _sd.apply(this,arguments);
  try{const dg=ctx.createGain(),pk=ctx.createBiquadFilter();pk.type='peaking';pk.Q.value=1.2;pk.gain.value=0;pk.frequency.value=1200;n.connect(dg);dg.connect(pk);
   ACT.push({dg,pk,end:ctx.currentTime+12});while(ACT.length>24||(ACT.length&&ACT[0].end<ctx.currentTime))ACT.shift();return _sd.call(this,pk,out,dly,rev)}catch(e){return _sd.apply(this,arguments)}};
 const _fl=fire;fire=function(k,w){const r=_fl.apply(this,arguments);try{if(k===4&&!TR[4].m&&ctx&&ACT.length&&!(TR[5].m)){const P=TR[4].p,hold=Math.min(.6,Math.max(.12,(P.dec||.25)*.8)),lf=Math.max(300,Math.min(5000,(LF||600)*2)),t=w||ctx.currentTime;
   ACT.forEach(a=>{if(a.end<t)return;a.dg.gain.cancelScheduledValues(t);a.dg.gain.setTargetAtTime(.79,t,.02);a.dg.gain.setTargetAtTime(1,t+hold,.18);
    a.pk.frequency.setValueAtTime(lf,t);a.pk.gain.cancelScheduledValues(t);a.pk.gain.setTargetAtTime(-3,t,.02);a.pk.gain.setTargetAtTime(0,t+hold,.2)})}}catch(e){}return r};
 // ---- (1)/(6)/(7) on Launch ----
 const CMM={Noir:.5,Dark:.3,'Groove Techno':.35,Vector:.3,Bleep:.25,Melancholic:.15,Drone:.2},VAM={Drone:.3,Dark:.2,Tense:.2,'Groove Techno':.25,Ethereal:.2,Bleep:.2,Ambient:.15};
 const LAST={};
 const _gp=generate;generate=function(){if(G.padAuto){padStyle='Progression';G.padAuto=0;G.pedal=false}const r=_gp.apply(this,arguments);try{const m=curMood,T=TR[5];
   if((padStyle==='Progression'||padStyle==='Pedal chords'||padStyle==='Chord memory')&&prog.length>1&&T.st===prog.length){
    // (7) never the same progression twice in a row; sometimes 2, 3, 6 or 8 chords
    for(let i=0;i<10&&LAST[m]&&LAST[m]===prog.join(','); i++)newProg(4);LAST[m]=prog.join(',');
    if(R()<.35&&prog.length===4){const L=pick([2,3,6,8]),b=prog.slice(),x=PX.slice(),sh=pshape.slice(),mk=a=>L===2?a.slice(0,2):L===3?a.slice(0,3):L===6?a.concat(a.slice(0,2)):a.concat([a[0],a[1],a[3],a[2]]);
     prog=mk(b);PX=x.length===4?mk(x):[];pshape=mk(sh);T.st=prog.length;T.h=prog.length;T.r=0;T.pt=pat(T);try{if(typeof PD!=='undefined'&&PD&&PD.length!==T.st)PD=null}catch(e){}pmean=null;PTOP=null}}
   // (1) chord memory, (6) vamp
   const rr=R();
   if(padStyle==='Progression'&&rr<(CMM[m]||0)){padStyle='Chord memory';G.padAuto=1;cmPrep();T.m=false;T.lv=Math.max(T.lv||.3,.32);G.pedal=false}
   else if(padStyle==='Progression'&&rr<(CMM[m]||0)+(VAM[m]||0)){padStyle='Vamp';G.padAuto=1;T.st=1;prog=[0];pshape=[pick((MOODS[m]||{}).sh||['7'])];T.p.size=4;T.p.bars=1;T.pt=pat(T);pmean=null;PTOP=null}
   else if(padStyle==='Chord memory'||padStyle==='Vamp'){if(padStyle==='Chord memory')cmPrep()}
   build()}catch(e){console.warn('[orbitron] pad gen',e)}return r};
 window.padGen={style:()=>padStyle,cm:()=>({shape:G.cmShape,pat:G.cmPat}),room:()=>ACT.length}}

