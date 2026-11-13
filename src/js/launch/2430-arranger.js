
/* ---- v0.75: ARRANGER — four rules, one line per mood. Runs last on every Launch; it only presses Mute, lowers Hits, sets Answer and the
   bass Ending, all things you can do by hand. No new controls.

     ARR[mood] = [ parts , notes , first , turn ]

     parts · how many melodic parts may play at once (lead, pad, stab, Satellite). The bass does not count.
     notes · the most hits per bar for lead, stab and perc. Hats may play twice that plus two.
     first · the part that always stays (4 lead · 5 pad · 8 stab · 9 Satellite); after it: lead, pad, stab, Satellite.
     turn  · the chance (0–1) that the bass gets a turnaround in every 4th bar.

   Rule 1  too many melodic parts → the last ones in that order are muted.
   Rule 2  too many hits          → Hits comes down to the ceiling (the ring keeps its rotation and tension).
   Rule 3  a lead and a stab      → the stab answers: it plays in bars 2 & 4 only. With notes at 4 or less, the perc answers too.
   Rule 4  the bass, by chance    → its Ending is set to "Turnaround every 4th bar" (only when no Ending was chosen already).

   Left alone: Acid 303 lines and Riff-mode leads (they have their own written rhythm), the ride, kick, clap, snare and bass.
   To make a mood busier or emptier, change its numbers. A mood without a line is not arranged at all. ---- */
{const ARR={
  Dark:[2,4,4,0.35],
  Tense:[1,5,4,0.3],
  Acid:[1,4,4,0],
  Power:[2,4,4,0.35],
  'Groove Techno':[1,6,4,0.2],
  Temporal:[2,5,8,0.15],
  Bleep:[1,5,4,0.35],
  'Distorted Electro':[1,4,4,0.3],
  Drone:[2,6,4,0.15],
  Polymeter:[2,6,8,0.15],
  Chug:[2,4,4,0.3],
  Melancholic:[3,8,4,0.4],
  'Melodic House':[2,6,4,0.4],
  Hopeful:[3,8,4,0.45],
  Italo:[2,7,4,0.45],
  Vector:[2,5,4,0.4],
  Breaks:[2,5,5,0.3],
  Dreamy:[3,5,5,0.35],
  Ethereal:[2,4,5,0.2],
  'Deep Space':[2,3,5,0.1],
  Ambient:[2,3,5,0.1],
  Noir:[2,3,8,0.2]};
 window.orbArr=ARR;
 const on=k=>!TR[k].m,cap=(k,c)=>{const T=TR[k];if(!on(k))return;const h=Math.max(1,Math.round(c*T.st/16));if(T.h>h){T.h=h;T.pt=pat(T)}};
 function arrange(){const a=ARR[curMood];if(!a)return;const [parts,notes,first,turn]=a,mode=TR[4].p.mode;
  [first,4,5,8,9].filter((k,i,o)=>o.indexOf(k)===i).filter(on).slice(parts).forEach(k=>{TR[k].m=true});             // rule 1
  if(mode!=='Acid 303'&&mode!=='Riff')cap(4,notes);cap(8,notes);if(TR[3].p.pv!=='Ride')cap(3,notes);cap(1,notes*2+2);   // rule 2
  {const two=k=>TR[k].pt.filter(Boolean).length>=2;   /* a part with a single hit is not sent to bars 2 & 4 — it would sound once every two bars */
   if(on(4)){if(on(8)&&two(8))TR[8].p.ans=1;if(on(3)&&notes<=4&&TR[3].p.pv!=='Ride'&&two(3))TR[3].p.ans=1}}                 // rule 3
  {const B=TR[6].p;if(on(6)&&!G.acidGuest&&!B.btn&&(B.bph||1)===1&&R()<(turn||0))B.btn=true}}                            // rule 4
 /* tidy-up after every Launch (found by a scan of 120 Launches): a ring whose pattern was left at another length than its Steps is rebuilt,
    and a pad that plays fewer chords than its progression lists drops the unused ones, so the Chords fader and the Progression menu agree. */
 const tidy=()=>{TR.forEach(T=>{if(T.pad)return;while(T.st>64){T.st=Math.round(T.st/2);T.h=Math.max(1,Math.round(T.h/2));T.r=(T.r||0)%T.st;T.pt=pat(T)}   /* a ring is never longer than 64 steps */if(T.pt.length!==T.st)T.pt=pat(T)});const P=TR[5];if(P&&prog.length>P.st&&P.st>=1){prog.length=P.st;if(pshape.length>P.st)pshape.length=P.st;if(PX&&PX.length>P.st)PX.length=P.st;pmean=null}else if(P&&prog.length>=1&&prog.length<P.st){P.st=prog.length;P.h=P.st;P.pt=pat(P)}};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{arrange();tidy();try{if(window.orbGroove&&orbGroove.run)orbGroove.run()}catch(e){}G.pwMode=TR[4].p.mode;build();setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0)}catch(e){console.warn('[orbitron] arranger',e)}return r};
 window.orbArrange=arrange;if(window.orbGroove)orbGroove.late=true}
