
/* v160: de-cheese leads — no fast vibrato, no parallel fifths, tamer unison, darker FM and chip sounds. Names kept. */
{const T={
 'Square chip':{pg:1,pw:.35,cut:2200,envA:1800,res:2,dec:.16,sus:.25,vib:0,kt:.4,ds:.4,rs:.25},
 'Glass':{vib:0,usp:5},
 'FM bell':{fmr:2,fmi:1.6,fenv:.45,cut:3800,dec:.55},
 'FM keys':{fmi:1.3,fenv:.3,cut:3200},
 'Vowel':{vib:0,usp:8,att:6},
 'Organ':{vib:0,cut:2800,drv:.12,att:2},
 'Soft sine':{vib:0,fold:.18},
 'Supersaw':{usp:16,wid:.75,oct2:.08,cut:1500,envA:2400,dec:.35,sus:.45,att:4},
 'Hoover':{usp:22,penv:-2.5,oct2:.12,cut:1400},
 'Mini lead':{vib:0,glk:50,res:7},
 'Mini brass':{fatt:20,cut:380,envA:1900,att:12,o3d:-3},
 'Mini flute':{vib:0,mnz:.1},
 'Mini fifths':{o2d:1200,o2l:.45,res:7,cut:450},
 'Mini edge':{o2d:1205,o2l:.6},
 'Talkbox':{pg:.85,vib:0,glide:.2},
 'Mini sparkle':{res:5,envA:3600},
 'Space blip':{res:6,ds:.5}};
 for(const k in T)if(LPRE[k])Object.assign(LPRE[k],T[k]);
 // balance trims from the mood sweep (dB): Italo pad sat level with the kick, Groove Techno pads and Bleep clap were buried
 try{const t=(m,k,d)=>{if(MTRIM[m])MTRIM[m][k]=(MTRIM[m][k]||0)+d};t('Italo',5,-5);t('Groove Techno',5,3);t('Bleep',2,4)}catch(e){}
 // re-apply the current lead so an open session picks up the new sound
 try{const P=TR[4].p;if(P.patch&&T[P.patch])Object.assign(P,T[P.patch])}catch(e){}}
