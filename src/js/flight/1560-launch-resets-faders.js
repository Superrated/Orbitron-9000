
/* ---- v0.22: a new Launch resets the Flight faders: Low-pass fully open, LEAD and BASS back to AS SET, Altitude octave off. ---- */
{const _g=generate;generate=function(){try{window.lpReset&&lpReset()}catch(e){}try{window.leadMacro&&leadMacro.reset&&leadMacro.reset()}catch(e){}
  try{window.bassMacro&&bassMacro.reset&&bassMacro.reset()}catch(e){}G.oct=0;G.ldUp=0;return _g.apply(this,arguments)}}
