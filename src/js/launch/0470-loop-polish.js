/* ---- v53: loop polish — phrases that fit the bar and repeat, one pad sound, calmer chord pace, sparser perc, steadier bass ---- */
{const DV={Tense:.88,Dreamy:.9,Ethereal:.9,'Deep Space':.9,Italo:.99,Breaks:.95,Power:1},FASTCH=new Set(['Dreamy','Hopeful','The Touch','Italo']),FUNKB=new Set(['The Touch','Italo','Breaks']);
 const _gen53=generate;generate=function(){_gen53();const M=curMood,MD=MOODS[M]||{},L=TR[4],P=L.p,acid=P.mode==='Acid 303';
  // lead: phrase length = notes in 1 or 2 bars, mostly repeating
  if(!acid&&M!=='Power'){if(![8,16,32,64].includes(L.st)){L.st=16;L.pt=pat(L)}const n=Math.max(1,Math.round(L.pt.reduce((a,b)=>a+b,0)*16/L.st));P.len=Math.max(2,Math.min(16,n<=4?2*n:n));P.dv=Math.max(P.dv||0,DV[M]||.92);buf=[];mot=[];mp=-1}
  // pad: one consistent sound; 2-4 bars per chord except styles that move faster
  const PD=TR[5];if(PD.p.patch==='Rotate'||PD.p.patch==='Random')PD.p.patch=pick((MD.pt&&MD.pt.length?MD.pt:PADN));
  if(PD.st>1&&(PD.p.bars||1)<2&&!FASTCH.has(M))PD.p.bars=pick([2,2,4]);
  // perc: at most 4 hits a bar (5 in Drone)
  const PC=TR[3];if(PC.st<64){const cap=Math.max(1,Math.round(PC.st*(M==='Drone'?5:4)/16));if(PC.h>cap){PC.h=cap;PC.pt=pat(PC)}}
  // bass: fewer random fifth / octave leaps outside funk styles
  if(!FUNKB.has(M)){TR[6].p.fifth=Math.min(TR[6].p.fifth||0,.12);TR[6].p.jump=Math.min(TR[6].p.jump||0,.08)}
  if(acid)TR[9].m=true;
  build()}}
