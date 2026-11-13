
/* ---- v0.22: while a Flight fader (LEAD, BASS) is held or gliding back, the live visuals run at half frame rate, so the note scheduler
   gets the main-thread time it needs (no stutter on busy devices). ---- */
{let f=0;const busy=()=>{const L=window.leadMacro,B=window.bassMacro;return (L&&L.raf)||(B&&B.raf)};
 const _vz=viz;viz=function(){if(busy()&&(f++%2)){requestAnimationFrame(viz);return}_vz()}}
