/* ---- v133: Italo back to how it sounded before the Launch fix — no off-beat dub stabs (pad stays as the mood sets it) ---- */
{const _gi=generate;generate=function(){const r=_gi.apply(this,arguments);try{if(curMood==='Italo'){TR[8].m=true;
   // bass variety: one of six Italo bass styles per Launch (classic octave 16ths stays the most likely)
   {const P=TR[6].p;P.oct=Math.max(0,Math.min(2,Math.round(P.oct)||1));const W=[['Octave bounce',3],['Gallop',2],['Octave 8ths',2],['Off-beat',1],['Syncopated',1],['Disco run',2]];let t=W.reduce((a,b)=>a+b[1],0)*R();const nm=(W.find(x=>(t-=x[1])<0)||W[0])[0];
    if(window.bassStyle)bassStyle(nm);P.bph=pick([1,1,2]);P.bgt=R()<.3?0:.35+R()*.35;P.bsl=R()<.3?.1+R()*.15:0}
   // 80s pad on about half the Launches — one of six flavours (no off-beat gates)
   {const T=TR[5],P=T.p;if(R()<.5){T.m=true;G.pad80=''}else{const G16=x=>[...x].map(c=>+c);
    const FL=[{n:'Jump brass',patch:'Brass',mov:'Classic',att:.01,rel:.22,pgate:.95,pgpat:pick(['1000100010001000','1001001010010010','1000100010101000']),open:.75,cut:2800,det:8,size:4,apan:.15,lfo:.25,trem:0},
     {n:'Ensemble strings',patch:'PWM',mov:'Ensemble',att:.35,rel:.9,pgate:0,open:.55,cut:2300,det:14,size:5,apan:.55,lfo:.5,trem:0},
     {n:'Solina swell',patch:'Strings',mov:'Ensemble',att:.75,rel:1.4,pgate:0,open:.5,cut:1900,det:12,size:4,apan:.35,lfo:.45,trem:.18},
     {n:'Phaser sweep',patch:pick(['PWM','Strings','Poly']),mov:'Phaser',att:.4,rel:1.2,pgate:0,open:.6,cut:2500,det:11,size:4,apan:.4,lfo:.75,trem:0},
     {n:'DX bell pad',patch:'Bell pad',mov:'Ensemble',att:.04,rel:1.6,pgate:0,open:.65,cut:3300,det:7,size:4,apan:.45,lfo:.35,trem:0},
     {n:'Synth-pop gate',patch:pick(['PWM','Poly']),mov:'Ensemble',att:.02,rel:.14,pgate:.7,pgpat:pick(['1011011010110101','1101101101101101','1111011101110111']),open:.6,cut:2700,det:10,size:4,apan:.3,lfo:.3,trem:0}];
    const f=pick(FL);T.m=false;Object.assign(P,{patch:f.patch,mov:f.mov,att:f.att,rel:f.rel,pgate:f.pgate,open:f.open,cut:f.cut*(.85+R()*.3),det:f.det,size:f.size,apan:f.apan,lfo:f.lfo,trem:f.trem});
    if(f.pgpat)P.pgpat=G16(f.pgpat);T.lv=Math.max(T.lv||0,.5);G.padchr=f.n;G.pad80=f.n;try{if(typeof say==='function')setTimeout(()=>say('♪ 80s PAD · '+f.n.toUpperCase()),400)}catch(e){}}}
   try{TR.forEach(T=>{if(T.mb)T.mb.classList.toggle('m',!!T.m)})}catch(e){}}}catch(e){}return r}}

