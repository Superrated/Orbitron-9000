/* ---- v81: pad variety — 5 new pad sounds (PWM, Brass, Bell pad, Fold, Tape), distinct per-mood pad palettes, and a per-Launch pad character (swell, stab-gate, breathing, wide, intimate) ---- */
PADN.push('PWM','Brass','Bell pad','Fold','Tape');Object.assign(PGAIN,{PWM:1.15,Brass:1.25,'Bell pad':2.3,Fold:2.2,Tape:1.15});Object.assign(PCUT,{PWM:1.3,Brass:1.2,'Bell pad':3,Fold:2.2,Tape:.9});
{const PAL={Dark:['Hollow','Fold','Tape','Air'],Melancholic:['Strings','Tape','PWM','Choir'],Dreamy:['Bell pad','Glass','PWM','Organ'],Tense:['Fold','Brass','Hollow','Air'],Ethereal:['Glass','Air','Bell pad','Choir'],
  Hopeful:['PWM','Strings','Brass','Glass'],Noir:['Tape','Hollow','Organ','Choir'],Drone:['Fold','Air','Tape'],Acid:['Hollow','PWM','Air'],Italo:['PWM','Brass','Strings'],'The Touch':['Organ','PWM','Tape','Strings'],
  Breaks:['Strings','Air','Bell pad','Choir'],'Deep Space':['Air','Glass','Choir','Bell pad','Fold'],Bleep:['Glass','Hollow','Fold'],'Melodic House':['Strings','Warm saw','Tape','Bell pad','Poly'],'Distorted Electro':['Hollow','Air','Warm saw'],Ambient:['Air','Glass','Choir','Cloud','Bell pad'],'Groove Techno':['Hollow','Air'],Temporal:['Hollow','Organ'],Vector:['Bell pad','Poly','Strings','Tape','Glass']};
 for(const m in PAL)if(MOODS[m])MOODS[m].pt=PAL[m];
 const GP=['1011011010110101','1010101010101010','1101101101101101','1001001010010010','1111011101110111'].map(s=>s.split('').map(Number));
 const CHR={Swell:{att:[.6,.9],pgate:0,trem:0,apan:[.1,.3],open:[.3,.6],lfo:[.4,.7]},'Stab gate':{att:[.02,.08],pgate:[.5,.75],trem:0,apan:[.05,.2],open:[.2,.5],lfo:[.2,.4]},
  Breathing:{att:[.3,.5],pgate:0,trem:[.25,.45],apan:[.2,.4],open:[.3,.6],lfo:[.6,.9]},Wide:{att:[.2,.4],pgate:0,trem:0,apan:[.5,.8],open:[.6,.9],lfo:[.3,.6]},Intimate:{att:[.15,.35],pgate:0,trem:0,apan:0,open:[0,.2],lfo:[.1,.3]}};
 const CW={Dark:['Swell','Breathing','Intimate'],Melancholic:['Swell','Wide','Breathing'],Dreamy:['Wide','Breathing','Swell'],Tense:['Stab gate','Intimate','Swell'],Ethereal:['Wide','Swell','Breathing'],Hopeful:['Stab gate','Wide','Swell'],
  Noir:['Breathing','Intimate','Swell'],Drone:['Swell','Breathing'],Acid:['Stab gate','Intimate'],Italo:['Stab gate','Wide'],'The Touch':['Intimate','Stab gate','Breathing'],Breaks:['Wide','Swell','Stab gate'],'Deep Space':['Swell','Wide'],Bleep:['Intimate','Stab gate'],'Melodic House':['Wide','Breathing','Stab gate'],'Distorted Electro':['Stab gate','Intimate'],Ambient:['Swell','Breathing','Wide'],'Groove Techno':['Stab gate','Intimate'],Temporal:['Stab gate','Intimate'],Vector:['Wide','Breathing','Intimate']};
 const rr=v=>Array.isArray(v)?v[0]+R()*(v[1]-v[0]):v;
 const _g81=generate;generate=function(){_g81();const P=TR[5].p,nm=pick(CW[curMood]||['Swell','Wide']),c=CHR[nm];G.padchr=nm;
  P.att=+rr(c.att).toFixed(2);P.pgate=+rr(c.pgate).toFixed(2);P.pgpat=pick(GP);P.trem=+rr(c.trem).toFixed(2);P.apan=+rr(c.apan).toFixed(2);P.open=+rr(c.open).toFixed(2);P.lfo=+rr(c.lfo).toFixed(2);
  if(nm==='Stab gate')P.rel=Math.min(P.rel||.5,.25);build()};
 TR[5].x.push(['Rhythm gate','pgate',0,1,.01])}
