
/* ---- v0.22: LAUNCH POLISH — six arrangement and groove refinements applied at the end of every Launch (all with normal, editable settings):
   (2) one hook at a time: a rhythmic pad thins the lead and stab; a busy lead thins the stab; a busy stab thins the lead
   (3) tuned drums: clap tone and fixed-pitch perc snap to the key's root or fifth (like the kick)
   (4) hat groove: with hat Accent up, offbeat 8ths are loudest, downbeats a touch softer, the 16ths in between sit back and drag a few ms
   (6) call and response: perc or stab sometimes answers only in bars 2 and 4, or in the last half of every second bar (new "Answer" menu on both)
   (7) club-safe width: in the driving moods lead, stab, pad pan and Space are kept narrower; the master is mono below ~160 Hz
   (9) kick and bass pairing: bass Gate, Slide, Ghost notes and kick-avoid follow the bassline style that was picked ---- */
{const DRIVE=new Set(['Dark','Tense','Acid','Power','Breaks','Bleep','Distorted Electro','Groove Techno','Temporal','Noir']);
 const ANS=['Every bar','Bars 2 & 4','End of bar 2 & 4'];
 const near=(f,lo,hi)=>{let best=f,bd=1e9;[0,7].forEach(iv=>{for(let o=-1;o<10;o++){const c=440*Math.pow(2,(G.root+iv+12*o-69)/12);if(c<lo||c>hi)continue;const d=Math.abs(Math.log2(c/f));if(d<bd){bd=d;best=c}}});return best};
 // (4) + (6): playback
 const _f=fire;fire=function(k,w){
  if(k===3||k===8){const a=TR[k].p.ans|0;if(a){const b=Math.floor(tk/16)%2,s=((tk%16)+16)%16;if(b===0||(a===2&&s<8))return}}
  if(k===1){const T=TR[1],a=T.acc||0;if(a>.01&&T.st%4===0){const s=((tk%T.st)+T.st)%T.st,q=s%4,v=q===2?1:q===0?1-.25*a:1-.6*a,o=T.acc,lv=T.lv;T.acc=0;T.lv=lv*v;
    try{return _f.call(this,k,q%2?w+.006*a:w)}finally{T.acc=o;T.lv=lv}}}
  return _f.apply(this,arguments)};
 // (6) UI: "Answer" menu on perc and stab pattern pages
 const ui=()=>{[3,8].forEach(k=>{const T=TR[k],c=T.mb&&T.mb.closest('.card');if(!c)return;const g=c.querySelector('.grid');if(!g)return;let l=g.querySelector('.anssel');
   if(!l){l=mkSel('Answer',ANS,ANS[T.p.ans|0],v=>{T.p.ans=ANS.indexOf(v)});l.classList.add('anssel');l.dataset.g='pat';l.title='Call and response: play every bar, only in bars 2 and 4, or only in the last half of bars 2 and 4.';
    const rd=g.querySelector('label.rdr');if(rd)rd.after(l);else g.appendChild(l);try{window.applyMode&&applyMode()}catch(e){}}
   const se=l.querySelector('select');if(se&&document.activeElement!==se&&se.value!==ANS[T.p.ans|0])se.value=ANS[T.p.ans|0]})};
 BUILD.hooks.push({post(){setTimeout(()=>{try{ui()}catch(e){}},60)}});UI.on(()=>{try{ui()}catch(e){}});
 // Launch
 const thin=(T,n)=>{if(T.h>n){T.h=n;T.pt=pat(T)}};
 const _g=generate;generate=function(){TR[3].p.ans=0;TR[8].p.ans=0;const r=_g.apply(this,arguments);try{const m=curMood,dr=DRIVE.has(m),L=TR[4],S=TR[8],P=TR[5],H=TR[1],C=TR[2],K=TR[3],B=TR[6],acid=L.p.mode==='Acid 303';
  // (2) one hook at a time
  const padRh=!P.m&&((P.p.pgate||0)>.01||padStyle==='Chord memory'||padStyle==='Vamp'),leadOn=!L.m&&!acid,stabOn=!S.m;
  if(padRh){if(leadOn)thin(L,Math.max(2,Math.round(L.st*.19)));if(stabOn)thin(S,2)}
  else if(leadOn&&L.h/L.st>=.3){if(stabOn)thin(S,2)}
  else if(stabOn&&S.h>=5&&leadOn)thin(L,3);
  // (3) tuned drums
  if(C.p.tone)C.p.tone=Math.round(near(C.p.tone,C.p.tone/1.26,C.p.tone*1.26));
  if(K.p.mode==='Fixed'&&K.p.pv!=='Ride'&&K.p.tune!=null){const t=Math.round(K.p.tune);let best=t,bd=99;for(let n=t-6;n<=t+6;n++){const pc=((n-G.root)%12+12)%12;if((pc===0||pc===7)&&Math.abs(n-t)<bd){bd=Math.abs(n-t);best=n}}K.p.tune=best}
  // (4) hat groove
  if(!H.m&&H.st%4===0&&H.h>=6&&(H.acc||0)<.35)H.acc=+(.4+R()*.25).toFixed(2);
  // (6) call and response
  if(R()<.5){const cand=[];if(!K.m&&K.p.pv!=='Marimba')cand.push(K);if(stabOn&&S.st===16)cand.push(S);if(cand.length){const T=pick(cand);T.p.ans=pick([1,1,2]);if(T.p.ans===2&&T.h<4){T.h=Math.min(T.st,T.h*2);T.pt=pat(T)}}}
  // (7) club-safe width
  if(dr){if(L.p.wid>.35)L.p.wid=.35;if(S.p.wid>.4)S.p.wid=.4;if((P.p.apan||0)>.2)P.p.apan=.2;if((G.space||0)>.35){G.space=.35;try{window.spaceShow&&spaceShow()}catch(e){}}}
  // (9) kick and bass pairing
  if(!B.m&&!(B.p.bsus>.01)){const st=B.p.bsty,p=B.p;
   if(st==='Off-beat'){p.bgt=+(.45+R()*.15).toFixed(2);G.bavoid=true;G.bavStrict=true;p.bgh=Math.min(p.bgh||0,.15)}
   else if(st==='Rolling 16ths'||st==='Gallop'||st==='Octave 8ths'||st==='Octave bounce'){p.bgt=+(.3+R()*.12).toFixed(2);p.bsl=0;p.dec=Math.min(p.dec,.12);G.bavoid=false;G.bavStrict=false}
   else if(st==='Pedal'||st==='Walking'){p.bgt=+(.52+R()*.08).toFixed(2)}}
  setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0)}catch(e){}return r}}
