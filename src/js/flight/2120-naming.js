
/* ---- v0.4: one naming style on Flight — plain names for risers and breakdowns, "(hold)" on every hold thruster, and a help text in the
   same form on every pad ("Hold: …", "Tap: …", "Tap to arm: …"). ---- */
{const H2={'Ascent · riser':'Ascent','Solar storm · noise':'Solar storm','gravity well':'Gravity well','eclipse':'Eclipse','zero-G':'Zero-G'};
 const TIP=[[/^Snare roll/,'Hold: a snare roll that speeds up and gets louder'],[/^\+1 octave/,'Hold: lead, stab and satellite play one octave higher'],
  [/^KICK/i,'Tap: the kick switches between 4 / 4 and HALF on the next bar'],[/^Ride push/,'Tap: a driving ride pattern on · tap again: off'],
  [/^Sub boom/,'Tap to arm: a deep boom tuned to the key, on the next riser release'],[/^Steel drop/,'Tap to arm: a heavy distorted impact, on the next riser release'],
  [/^Horn/,'Tap to arm: a deep horn blast, on the next riser release'],[/^Noise sweep/,'Tap to arm: a noise sweep with a short silence before the drop'],
  [/^Ride in/,'Tap to arm: the ride cymbal comes in with the drop']];
 const run=()=>{try{document.querySelectorAll('#t-perf h2').forEach(h=>{const t=H2[h.textContent.trim()];if(t)h.textContent=t});
  document.querySelectorAll('#t-perf .flw-thr .pad').forEach(b=>{const t=b.textContent.trim();
   if(/^\+1 octave$/.test(t))b.innerHTML='+1 octave<span> (hold)</span>';
   for(const [re,tip] of TIP)if(re.test(t)&&!b.title)b.title=tip});
  const s0=[...document.querySelectorAll('#t-perf .sub')].find(x=>/^Hold pads/.test(x.textContent));if(s0)s0.textContent='Hold, or tap on / off'}catch(e){}};
 run();setTimeout(run,800);setTimeout(run,3000)}
