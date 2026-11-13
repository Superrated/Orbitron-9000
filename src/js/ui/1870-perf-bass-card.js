
/* ---- perf 6: the bass card's controls were re-synced on every Launch even with the Synths page hidden; now when it is on screen ---- */
{const vis=()=>{const e=document.querySelector('#t-synth');return e&&!e.hidden};let dirty=0;const real=window.bassSync;if(real){
 window.bassSync=function(){if(!vis()){dirty=1;return}dirty=0;return real.apply(this,arguments)};
 document.addEventListener('click',()=>setTimeout(()=>{if(dirty&&vis()){dirty=0;try{real()}catch(e){}}},0),true)}}
