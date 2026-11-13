/* ---- v158: phrase-aware harmony — each Launch picks a phrase style for progressions: a sus4→3 resolution or a dominant V tension chord
   on the last chord of every second pass through the progression (every 8 or 16 bars), so the music leans into the next downbeat; or none ---- */
{const PW={Melancholic:[.45,.3],Hopeful:[.4,.35],Dreamy:[.45,.2],'Melodic House':[.4,.35],Vector:[.35,.35],Italo:[.25,.45],Ethereal:[.4,.1],Noir:[.3,.2],Breaks:[.3,.3],Dark:[.2,.25],Tense:[.15,.35],Acid:[.1,.2],'Deep Space':[.3,.05],Ambient:[.35,0],Drone:[.15,.1],Bleep:[.15,.15],'Distorted Electro':[.15,.35],'Groove Techno':[.1,.15],Temporal:[0,0],Power:[0,0]};
 let cyc=0,lastT=-1;
 const _ph=pad;pad=function(t,w,dur){
  if(t<=lastT)cyc++;lastT=t;
  const mode=G.phr||'none';if(mode==='none'||padStyle==='Vamp'||padStyle==='One chord'||padStyle==='One note'||padStyle==='Chord memory'||prog.length<2||t!==prog.length-1||cyc%2!==1)return _ph.apply(this,arguments);
  if(mode==='sus'&&dur>.3){const sh=pshape[t];pshape[t]='sus4';try{_ph.call(this,t,w,dur/2)}finally{pshape[t]=sh}return _ph.call(this,t,w+dur/2,dur/2)}
  if(mode==='tension'){if(PX.length!==prog.length)PX=prog.map(()=>0);const sp=chordSpec('V');if(prog[t]===sp.d&&PX[t]===sp.x)return _ph.apply(this,arguments);const d=prog[t],x=PX[t];prog[t]=sp.d;PX[t]=sp.x;
   try{return _ph.apply(this,arguments)}finally{prog[t]=d;PX[t]=x}}
  return _ph.apply(this,arguments)};
 const _gh=generate;generate=function(){const r=_gh.apply(this,arguments);try{const w=PW[curMood]||[.25,.2],x=R();G.phr=x<w[0]?'sus':x<w[0]+w[1]?'tension':'none';cyc=0;lastT=-1}catch(e){}return r};
 window.phraseMode=()=>G.phr}
