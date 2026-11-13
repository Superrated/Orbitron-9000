/* ---- v0.83: HAT DENSITY LEVEL — busy hi-hats play softer, so the mix keeps the same top end. Above 8 hits per bar the hat level comes down
   by the extra energy (16 hits → −3 dB). Why: the genre tests (tests/genre) showed too much 6–20 kHz exactly in Launches with 9–16 hat hits
   per bar (Event Horizon, First Light, Dark Side); real tracks with 16th hats keep them quieter. ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const H=TR[1];if(H.m||!H.st)return r;
  const n=(H.pt||[]).filter(Boolean).length*16/H.st;if(n>8){H.lv=+(H.lv*Math.sqrt(8/n)).toFixed(3);setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){console.warn('[orbitron] hat-density sync',e)}},0)}}
 catch(e){console.warn('[orbitron] hat-density level',e)}return r}}
