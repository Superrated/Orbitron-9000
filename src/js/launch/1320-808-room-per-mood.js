
/* v180: Launch sets the "808 ↔ room" character of hat and clap per mood (small variation each Launch). [hat, clap] */
{const CH={Italo:[.15,.2],'Distorted Electro':[.2,.25],Bleep:[.3,.35],Vector:[.35,.4],Acid:[.4,.45],Tense:[.45,.45],Temporal:[.45,.5],
  Dark:[.5,.5],Power:[.5,.5],'Groove Techno':[.5,.55],Melancholic:[.55,.6],Hopeful:[.6,.65],'Melodic House':[.6,.65],Drone:[.6,.6],
  Dreamy:[.65,.65],'Deep Space':[.65,.7],Noir:[.7,.75],Ethereal:[.7,.7],Ambient:[.75,.75],Breaks:[.8,.75]};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const c=CH[curMood];if(c){[1,2].forEach((k,i)=>{TR[k].p.char=+Math.max(0,Math.min(1,c[i]+(R()-.5)*.12)).toFixed(2)})}}catch(e){}return r};
 window.CHARMOOD=CH}
