
/* ---- v0.33: CHARACTER on Launch — fitting moods get more of their bus colour. Values only go up (never lower than the Launch set them),
   with a little randomness: gritty moods → Bus grit, Loudness (the soft clipper) and Groove; spacious moods → Space and Shimmer. ---- */
{const CH={Power:{bgrit:.34,clip:.55,groove:.45},'Distorted Electro':{bgrit:.38,clip:.55,groove:.4},Tense:{bgrit:.28,clip:.45},Acid:{bgrit:.28,clip:.45,groove:.5},
  Dark:{bgrit:.26,clip:.42,groove:.4},'Groove Techno':{bgrit:.2,clip:.42,groove:.7},Temporal:{bgrit:.22,clip:.4,groove:.6},Breaks:{bgrit:.16,clip:.4,groove:.7},
  Bleep:{bgrit:.14,clip:.36,groove:.55},Vector:{groove:.6,space:.4,shim:.25},Italo:{groove:.5,clip:.36},'Melodic House':{groove:.5,space:.45,shim:.35},
  Noir:{bgrit:.14,space:.45,shim:.3},Hopeful:{space:.45,shim:.4},Melancholic:{space:.5,shim:.45},Dreamy:{space:.55,shim:.6},Drone:{space:.6,shim:.7},
  Ethereal:{space:.65,shim:.9},Ambient:{space:.7,shim:1},'Deep Space':{space:.7,shim:.9}};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const c=CH[curMood];if(c){for(const k in c){const v=+(c[k]*(.9+R()*.2)).toFixed(2);if(!((G[k]||0)>=v))G[k]=v}
   try{applyFX()}catch(e){}try{window.moodFinish&&moodFinish.apply()}catch(e){}try{window.spaceShow&&spaceShow()}catch(e){}setTimeout(()=>{try{syncMix()}catch(e){}},60)}}catch(e){console.warn('[orbitron] character',e)}return r}}
