/* ---- v143: Marimba replaces Woodblock. Melodic House always / Ambient sometimes use it; old sectors with Woodblock load as Marimba.
   The perc page greys out the Ride and Marimba faders unless that sound is selected ---- */
{const _gw=generate;generate=function(){const r=_gw.apply(this,arguments);try{const m=curMood,P=TR[3].p;
  if(m==='Melodic House'||(m==='Ambient'&&R()<.5)){window.setPercSound&&setPercSound('Marimba');Object.assign(P,{wtn:m==='Ambient'?pick([0,1]):0,wdc:m==='Ambient'?.9:pick([.35,.45,.6]),ds:m==='Ambient'?.45:.25,rs:m==='Ambient'?.55:.35}) /* v0.83: rs .25 → .35, a bit more room so it glues */}}catch(e){}return r};
 const RIDEL=['Ride tone','Ride decay','Ride bell'],MARL=['Marimba octave','Marimba decay'];
 BUILD.hooks.push({post(){setTimeout(()=>{try{const T=TR[3],card=T.mb&&T.mb.closest('.card');if(!card||!window.ctlOff)return;const pv=T.p.pv==='Woodblock'?'Marimba':T.p.pv;
  card.querySelectorAll('.sl').forEach(d=>{const sp=d.firstChild;if(!sp||!sp.firstChild)return;const l=sp.firstChild.textContent.trim();
   if(RIDEL.includes(l))ctlOff(d,pv!=='Ride','only for the Ride sound');else if(MARL.includes(l))ctlOff(d,pv!=='Marimba','only for the Marimba sound')})}catch(e){}},0)}})}

