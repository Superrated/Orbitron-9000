
/* v169: produced leads for every lead sound. (1) Ducked echo: the lead's delay send gets its own dotted-8th ping-pong echo, filtered
   300 Hz–4.5 kHz, that dips while a lead note plays and swells back in the gaps (level follows Delay mix). (2) Note dynamics: on-beat
   and some off-beat notes are accents (a bit louder and brighter), the rest softer and darker, and note lengths vary through the phrase —
   fixed per pattern step, so the loop repeats like a played part. The Acid 303 keeps its own accents. */
{let LE=null,inLead=0;
 function ensureLE(){if(!ctx||!A.dk)return null;if(LE&&LE.ctx===ctx)return LE;
  const g=v=>{const n=ctx.createGain();n.gain.value=v;return n},bq=(t,f)=>{const n=ctx.createBiquadFilter();n.type=t;n.frequency.value=f;n.Q.value=.6;return n};
  const inp=g(1),hp=bq('highpass',300),dL=ctx.createDelay(2),dR=ctx.createDelay(2),lpL=bq('lowpass',4500),lpR=bq('lowpass',3800),fb=g(.38),x=g(1),
   pL=ctx.createStereoPanner(),pR=ctx.createStereoPanner(),duck=g(1),out=g(1);pL.pan.value=-.6;pR.pan.value=.6;
  inp.connect(hp);hp.connect(dL);dL.connect(lpL);lpL.connect(pL);lpL.connect(x);x.connect(dR);dR.connect(lpR);lpR.connect(pR);lpR.connect(fb);fb.connect(dL);
  pL.connect(duck);pR.connect(duck);duck.connect(out);out.connect(A.dk);
  LE={ctx,inp,dL,dR,duck,out,fb};window.LEX=LE;retime();return LE}
 const retime=()=>{if(!LE)return;const t=.75*60/G.bpm,now=ctx.currentTime;LE.dL.delayTime.setTargetAtTime(t,now,.05);LE.dR.delayTime.setTargetAtTime(t,now,.05);
  LE.out.gain.setTargetAtTime(Math.min(1.2,(G.dly==null?.25:G.dly)*1.6),now,.1)};
 setInterval(()=>{try{if(LE&&LE.ctx===ctx)retime()}catch(e){}},500);
 // lead delay sends go to the lead echo
 const _s=send;send=function(n,out,dly,rev){if(inLead&&dly>0&&ensureLE()){_s.call(this,n,out,0,rev);const s=ctx.createGain();s.gain.value=dly*1.1*((window.MOODX&&MOODX[curMood]||{}).echo!=null?(window.MOODX&&MOODX[curMood]||{}).echo:1);n.connect(s);routeTrack(s,null,LE.inp);return}return _s.apply(this,arguments)};
 const hs=(a,b)=>{const x=Math.sin(a*12.9898+b*78.233)*43758.5453;return x-Math.floor(x)};
 const _f=fire;fire=function(k,w){if(k!==4)return _f.apply(this,arguments);const T=TR[4],P=T.p;
  if(P.mode==='Acid 303'||P.dyn===0){inLead=1;try{return _f.apply(this,arguments)}finally{inLead=0}}
  const s=((tk%T.st)+T.st)%T.st,seed=(P.seed||0)+T.st*7,acc=s%4===0||hs(s,seed)<.22,ln=[.65,.85,1,1,1.25,1.6][Math.floor(hs(s+31,seed)*6)];
  const o={lv:T.lv,cut:P.cut,dec:P.dec,hold:P.hold},dy=(window.MOODX&&MOODX[curMood]||{}).dyn!=null?(window.MOODX&&MOODX[curMood]||{}).dyn:.6,lm=1+(ln-1)*dy*1.3;
  T.lv=o.lv*(acc?1+.22*dy:1-.2*dy);P.cut=o.cut*(acc?1+.5*dy:1-.18*dy);P.dec=o.dec*lm;if(P.hold)P.hold=Math.max(.25,o.hold*lm);
  // echo dips under the note and swells back after it
  const L=ensureLE();if(L){const sd=60/G.bpm/4,len=Math.max(.08,(P.sus>.01?(P.hold||1)*sd:P.dec)*1.0);L.duck.gain.setTargetAtTime(.3,w,.008);L.duck.gain.setTargetAtTime(1,w+len,.09)}
  inLead=1;try{return _f.apply(this,arguments)}finally{inLead=0;T.lv=o.lv;P.cut=o.cut;P.dec=o.dec;if(o.hold!=null)P.hold=o.hold}};
 window.leadFX={echo:()=>LE}}
