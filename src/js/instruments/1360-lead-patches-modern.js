
/* ---- v0.22: the 15 "dated" lead patches reworked to sit in a modern mix: darker filters, shorter envelopes, less resonance/glide whistle,
   lighter unison, a touch of saturation and a bit of space. With that they are allowed back in Launch (CHEESE filter emptied). ---- */
{const RW={
 'Square chip':{pg:1.15,pw:.42,cut:900,envA:1600,res:1.5,dec:.14,sus:0,hold:.6,rel:.08,drv:.12,wid:.25,kt:.4,ds:.35,rs:.3,vib:0},
 'FM bell':{pg:.69,fmr:2,fmi:1,fenv:.3,cut:2400,res:.7,dec:.45,wid:.3,ds:.3,rs:.45},
 'FM keys':{fmr:1,fmi:.8,fenv:.2,cut:1800,dec:.5,sus:.2,uni:2,usp:5,wid:.3,drv:.08,ds:.2,rs:.35},
 'Organ':{pg:.88,cut:1400,sus:.3,dec:.18,hold:.6,rel:.08,drv:.18,vib:0,ds:.25,rs:.3},
 'Mini flute':{pg:1.3,o2l:.2,mnz:.06,cut:1100,res:1.2,envA:400,att:25,sus:.6,hold:1,rel:.2,vib:0,ds:.3,rs:.45},
 'Mini sparkle':{pg:3,o2l:.35,cut:1100,res:3,envA:3000,fdec:.12,dec:.16,ds:.4,rs:.4},
 'Vowel':{pg:.55,uni:2,usp:6,wid:.45,cut:2600,att:4,dec:.25,sus:.35,drv:.1,vib:0,rs:.35,ds:.25},
 'Talkbox':{pg:.67,drv:.2,cut:1400,envA:800,res:2,sus:.35,glide:.1,gt:60,vib:0},
 'Space blip':{pg:3,o2l:.3,cut:1400,res:3.5,envA:3500,fdec:.07,ds:.45,rs:.35},
 'Supersaw':{pg:.95,uni:5,usp:11,wid:.6,oct2:0,cut:900,envA:1800,res:1.2,att:2,dec:.25,sus:.25,hold:1,rel:.25,drv:.1,ds:.25,rs:.35},
 'Hoover':{uni:5,usp:14,wid:.7,penv:-1.2,oct2:0,subosc:.25,cut:1100,sus:.6,drv:.2},
 'Mini brass':{pg:1.4,cut:320,res:2.5,envA:1500,fatt:8,fdec:.35,fsus:.25,att:6,dec:.35,sus:.5,hold:1,drv:.12},
 'Mini fifths':{pg:1.2,cut:500,res:3,envA:2200,sus:.25,glk:15},
 'Bleep':{pg:2},
 'Mini wobble':{pg:.93,o2d:-4,cut:220,res:6,envA:1800,fatt:60,fdec:.5,sus:.5,glk:25}};
 Object.keys(RW).forEach(k=>{if(LPRE[k])Object.assign(LPRE[k],RW[k])});}
