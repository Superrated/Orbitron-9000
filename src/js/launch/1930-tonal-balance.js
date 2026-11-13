
/* ---- v0.3: TONAL BALANCE per mood. Measured over 3 Launches per mood against the median of all moods (loudness-neutral, per octave);
   moods more than ~3.5 dB off get a gentle master correction: low shelf (90 Hz), mid bell (700 Hz) and presence shelf (4.5 kHz), in dB. ---- */
{const TONE={Temporal:{m:1,h:-4},'Groove Techno':{h:-3},Hopeful:{m:1},Power:{m:2},Dreamy:{h:2},Noir:{h:2.5},
  'Distorted Electro':{m:1,h:2},Ambient:{l:1.5},'Deep Space':{h:2.5}};   /* kept only where two measuring rounds (6 Launches) agreed */
 window.orbTone=TONE;
 /* all moods: less sub (the 90 Hz shelf goes from +1.5 to -1 dB) and the 400 Hz-1 kHz dip lifted by 2 dB — that range is what a phone speaker plays */
 const BASE={l:-1,m:2};
 const set=()=>{try{window.orbEQ&&orbEQ()}catch(e){}};   /* v0.33: one merged mastering EQ */
 const _afx=applyFX;applyFX=function(){const r=_afx.apply(this,arguments);set();return r};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);set();return r};
 setInterval(()=>{if(A.tmid&&!A.tmid.__t){A.tmid.__t=1;set()}},500)}
