
/* ---- v0.4: a clean start — Launch and Stop both switch off every Flight toggle and held effect: Hat push, Ride push, Break!, Chord hold,
   Lift (back to the home key), THIN and Drift. The kick switch and Fill keep their setting (they are choices, not effects). ---- */
{const B=re=>[...document.querySelectorAll('#t-perf .flw-thr .pad')].find(b=>re.test(b.textContent.trim()));
 const reset=()=>{try{[/^Hat push/,/^Ride push/,/^Break!/].forEach(re=>{const b=B(re);if(b&&b.classList.contains('on'))b.click()})}catch(e){}
  try{window.orbHarmReset&&orbHarmReset()}catch(e){}try{window.thinSet&&THIN.v>0&&thinSet(0)}catch(e){}
  try{if(window.orbDrift&&orbDrift.state().active){const p=playing;orbDrift.off()}}catch(e){}};
 window.orbCleanStart=reset;
 const _g=generate;generate=function(){reset();return _g.apply(this,arguments)};
 const _t=toggle;toggle=function(){const r=_t.apply(this,arguments);try{if(!playing)reset()}catch(e){}return r};try{$('#play').onclick=toggle}catch(e){}}
