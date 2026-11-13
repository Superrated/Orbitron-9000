/* ---- v0.83: BASS ALWAYS ON — moods whose genre is built on a bassline (techno, house, disco, D&B …) never Launch with the bass muted or empty.
   Runs last of all Launch steps. Left free: Aurora (Ethereal), Solar Flare (Acid, the 303 is the bass) and Low Orbit (Ambient). ---- */
{const FREE=new Set(['Ethereal','Acid','Ambient','Deep Space']);
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(FREE.has(curMood))return r;const B=TR[6];
  if(B.m)B.m=false;
  if(!(B.pt||[]).some(Boolean)){B.h=Math.max(4,Math.round(B.st/4));B.pt=pat(B)}
  setTimeout(()=>{try{window.UI&&UI.sync&&UI.sync();window.syncFaders&&syncFaders()}catch(e){console.warn('[orbitron] bass-always-on sync',e)}},0)}
 catch(e){console.warn('[orbitron] bass-always-on',e)}return r}}
