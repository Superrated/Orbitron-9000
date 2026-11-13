
/* ---- v0.24: more sound variety. All built from existing engine parameters; everything stays editable.
   Leads: Hard sync (French electro), String pluck (folk electronica), West Coast fold (modular house), Formant wave (melodic techno), Chorus pulse (90s rave).
   Pads: EP chords, Abyss, Sync sweep, Wind (see pad()). Perc: Conga/bongo and Cowbell/rim. Launch: drum kits (909 · 808 · Rumble · Raw),
   bass characters (deep · round · rubbery · gritty), and a subtle ±15 % "mutation" of the chosen sounds, so no two Launches sound identical. ---- */
{// ---------- leads
 Object.assign(LPRE,{
  'Hard sync':{pg:.7,eng:'FM',fmr:1,fmi:2.2,fenv:.9,uni:2,usp:9,wid:.35,ft:'LP12',cut:2600,res:2.5,envA:3000,dec:.35,sus:0,att:2,kt:.3,subosc:.2,oct2:0,drv:.3,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.25,rs:.2},
  'String pluck':{pg:1.38,eng:'FM',fmr:1,fmi:1.6,fenv:.8,uni:1,usp:0,wid:0,ft:'LP12',cut:1500,res:1.5,envA:4200,dec:.38,sus:0,att:1,kt:.9,subosc:0,oct2:.12,drv:0,crush:0,fold:0,penv:.25,pdec:.02,grit:.12,glide:0,vib:0,ds:.28,rs:.32},
  'West Coast fold':{pg:.56,eng:'Sine',uni:1,usp:0,wid:0,ft:'LP12',cut:5200,res:1,envA:2500,dec:.42,sus:0,att:2,kt:.4,subosc:0,oct2:0,drv:0,crush:0,fold:.62,fenv:.9,fsym:.25,penv:0,glide:0,vib:0,ds:.3,rs:.35},
  'Formant wave':{pg:.57,eng:'Vowel',vow:.35,uni:2,usp:7,wid:.45,ft:'LP24',cut:2200,res:3,envA:2600,dec:.5,sus:.45,hold:1.2,rel:.35,att:4,kt:.5,subosc:0,oct2:.15,drv:0,crush:.14,fold:0,penv:0,glide:0,vib:4,vibr:5.2,ds:.35,rs:.4},
  'Chorus pulse':{pg:.89,eng:'Pulse',pw:.38,uni:3,usp:11,wid:.65,ft:'LP24',cut:1300,res:3.5,envA:2600,dec:.3,sus:.3,hold:1,rel:.25,att:2,kt:.4,subosc:.18,oct2:0,drv:0,crush:0,fold:0,penv:0,glide:0,vib:0,ds:.38,rs:.35}});
 const LAdd={'Hard sync':['Distorted Electro','Tense','Groove Techno','Dark'],'String pluck':['Dreamy','Melodic House','Hopeful','Ethereal','Breaks'],
  'West Coast fold':['Vector','Bleep','Ethereal','Melodic House'],'Formant wave':['Melancholic','Noir','Deep Space','Vector'],'Chorus pulse':['Hopeful','Italo','Dreamy','Melancholic']};
 for(const n in LAdd)LAdd[n].forEach(m=>{if(LMOOD[m]&&!LMOOD[m].includes(n))LMOOD[m].push(n)});
 // ---------- pads into mood palettes
 const PAdd={'EP chords':['Melodic House','Dreamy','Hopeful','Vector'],Abyss:['Dark','Noir','Drone','Tense','Power','Deep Space'],
  'Sync sweep':['Distorted Electro','Tense','Groove Techno','Dark'],Wind:['Ethereal','Ambient','Deep Space','Drone']};
 for(const n in PAdd)PAdd[n].forEach(m=>{const M=MOODS[m];if(M&&M.pt&&!M.pt.includes(n))M.pt.push(n)});
 // ---------- perc voices
 const pick2=(w,salt)=>{const T=TR[3],pos=((tk%T.st)+T.st)%T.st,h=Math.sin((pos+1)*78.233+((T.p.mseed||1)+salt)*12.9898)*43758.5453;return h-Math.floor(h)};
 const conga=w=>{const T=TR[3],p=T.p,c=(typeof chordAt==='function'?chordAt(w):cur)||cur,n=SC[G.scale].length,ch=((c&&c.n&&c.n.length)?c.n:[0,2,4]).map(x=>((x%n)+n)%n),hi=pick2(w,3)<.5,sO=OCT,sF=FIX;
  OCT=0;FIX=0;let f;try{f=d2f(ch[0]+(hi?4:0)+Math.round(4*mv('Perc pitch',w)),3)}finally{OCT=sO;FIX=sF}while(f<110)f*=2;while(f>330)f/=2;f*=Math.pow(2,Math.round((p.oct||4)-4));
  const dec=Math.max(.08,Math.min(.8,(p.dec||.15)*1.6)),v=T.lv*.78,o=osc('sine',f,w,w+dec+.05),g=ctx.createGain(),lp=ctx.createBiquadFilter(),pn=ctx.createStereoPanner(),ns=mkBuf(),nb=ctx.createBiquadFilter(),ng=ctx.createGain();
  o.frequency.setValueAtTime(f*(1.25+(p.bend||0)*.5),w);o.frequency.exponentialRampToValueAtTime(f,w+.03);
  g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(v,w+.002);g.gain.exponentialRampToValueAtTime(.0001,w+dec);
  ns.buffer=A.nb;nb.type='bandpass';nb.frequency.value=hi?3200:2200;nb.Q.value=1.2;ng.gain.setValueAtTime(v*Math.min(1.2,.3+(p.noise||.2)*2),w);ng.gain.exponentialRampToValueAtTime(.0001,w+.025);ns.connect(nb);nb.connect(ng);ns.start(w,R()*.5);ns.stop(w+.04);
  lp.type='lowpass';lp.frequency.value=Math.max(300,Math.min(12000,p.filt||8000));lp.Q.value=.6;pn.pan.value=hi?.25:-.2;o.connect(g);g.connect(lp);ng.connect(lp);lp.connect(pn);send(pn,A.m,p.ds,p.rs)};
 const cowbell=w=>{const T=TR[3],p=T.p,bell=pick2(w,7)<.55,v=T.lv*1.06,o2=Math.pow(2,Math.round((p.oct||4)-4)),g=ctx.createGain(),lp=ctx.createBiquadFilter(),pn=ctx.createStereoPanner();
  lp.type='lowpass';lp.frequency.value=Math.max(300,Math.min(12000,p.filt||8000));lp.Q.value=.6;pn.pan.value=bell?.15:-.15;
  if(bell){const dec=Math.max(.12,Math.min(.9,(p.dec||.15)*2)),a=osc('square',540*o2,w,w+dec+.05),b=osc('square',800*o2,w,w+dec+.05),bp=ctx.createBiquadFilter(),ag=ctx.createGain();
   ag.gain.value=.5;bp.type='bandpass';bp.frequency.value=1700*o2;bp.Q.value=1;a.connect(ag);b.connect(ag);ag.connect(bp);bp.connect(g);
   g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(v,w+.002);g.gain.exponentialRampToValueAtTime(v*.32,w+.03);g.gain.exponentialRampToValueAtTime(.0001,w+dec)}
  else{const a=osc('sine',1700*o2,w,w+.05),b=osc('triangle',455*o2,w,w+.05),hg=ctx.createGain();hg.gain.value=.6;a.connect(g);b.connect(hg);hg.connect(g);
   g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(v*.9,w+.001);g.gain.exponentialRampToValueAtTime(.0001,w+.03)}
  g.connect(lp);lp.connect(pn);send(pn,A.m,p.ds,p.rs)};
 const _fv=fireVoice;fireVoice=function(k,w){if(k===3&&ctx&&!(ctx instanceof OfflineAudioContext)){const pv=TR[3].p.pv;if(pv==='Conga')return conga(w);if(pv==='Cowbell')return cowbell(w)}return _fv.apply(this,arguments)};
 // ---------- Launch: kits, bass characters, perc picks, mutation
 const clampX=(T,key,v)=>{const x=(T.x||[]).find(e=>e[1]===key);return x?Math.max(x[2],Math.min(x[3],v)):v};
 const setK=(k,o)=>{const T=TR[k];for(const key in o)T.p[key]=clampX(T,key,o[key])};
 const KITS={
  '909':{0:{punch:5,drive:1.8,click:.85,dec:.42},1:{tone:10500,dec:.032,metal:.8},2:{tone:1650,spread:12,tail:.28},7:{tone:200,snap:.9,dec:.18}},
  '808':{0:{punch:2.2,drive:.7,click:.25,dec:.65},1:{tone:8200,dec:.05,metal:.25},2:{tone:1150,spread:8,tail:.22},7:{tone:170,snap:.5,dec:.26}},
  'Rumble':{0:{punch:4.5,drive:2.2,click:.6,dec:.3},1:{tone:9000,dec:.022,metal:.55},2:{tone:1250,spread:10,tail:.2},7:{tone:185,snap:.7,dec:.16}},
  'Raw':{0:{punch:6,drive:4,click:1,dec:.4},1:{tone:7200,dec:.045,metal:.95},2:{tone:1500,spread:14,tail:.38},7:{tone:210,snap:1,dec:.24}}};
 window.orbKit=k=>{if(!KITS[k])return;G.kit=k;for(const t in KITS[k])setK(+t,KITS[k][t])};
 const KM={'Groove Techno':['909','Raw'],Tense:['909','Raw'],Acid:['909'],Temporal:['909'],Hopeful:['909','808'],'Melodic House':['909','808'],Vector:['909','808'],Melancholic:['909','808'],
  Italo:['808','909'],Breaks:['808'],Dreamy:['808'],Noir:['808','Rumble'],Bleep:['808','909'],Ethereal:['808','Rumble'],
  Dark:['Rumble','Raw'],Power:['Rumble','Raw'],Drone:['Rumble'],'Deep Space':['Rumble'],Ambient:['Rumble'],'Distorted Electro':['Raw','808']};
 const BCH={deep:P=>{P.cut*=.65;P.res*=.7;P.envA*=.5;P.sqm=(P.sqm||0)*.5},round:P=>{P.cut*=.8;P.res*=.6;P.envA*=.7;P.dec*=1.15},
  rubbery:P=>{P.cut*=.95;P.res=Math.max(P.res,5.5);P.envA*=1.5;P.dec*=.85;P.bpp=Math.max(P.bpp||0,.15)},gritty:P=>{P.bdrv=Math.max(P.bdrv||0,.3);P.bgr=Math.max(P.bgr||0,.2);P.sqm=Math.max(P.sqm||0,.25)}};
 const BM={Dark:['gritty','deep'],Power:['gritty','deep'],Tense:['gritty','rubbery'],'Distorted Electro':['gritty','rubbery'],'Groove Techno':['rubbery','deep','gritty'],
  'Melodic House':['round','rubbery'],Vector:['rubbery','round'],Dreamy:['round'],Hopeful:['round','rubbery'],Italo:['rubbery','gritty'],Melancholic:['round','deep'],Noir:['deep','round']};
 window.orbBassChar=c=>{const B=TR[6],bp=B.p;if(!BCH[c]||B.m)return;G.bchar=c;BCH[c](bp);for(const key of ['cut','res','envA','dec','bdrv','bgr','sqm','bpp'])if(bp[key]!=null)bp[key]=clampX(B,key,bp[key])};
 const PERC={'Melodic House':[['Conga',.3]],Breaks:[['Conga',.3]],Dreamy:[['Conga',.2]],Italo:[['Cowbell',.3]],'Distorted Electro':[['Cowbell',.3]],'Groove Techno':[['Cowbell',.15],['Conga',.1]],Vector:[['Conga',.2]],
  /* v0.26 */Hopeful:[['Conga',.18]],Melancholic:[['Conga',.15]],Temporal:[['Conga',.15]],Dark:[['Cowbell',.15]],Power:[['Cowbell',.15]],Tense:[['Cowbell',.15]]};
 const MUT={4:['res'],5:['cut','sweep','det','rel','att'],6:['cut','envA','dec','res'],0:['dec','punch','click'],1:['tone','dec','metal'],2:['tone','tail','spread'],7:['tone','snap','dec'],3:['dec','filt']};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const m=curMood;
   // drum kit: matches the mood, about 1 Launch in 5 crosses over
   const own=KM[m]||['909','808','Rumble'],all=Object.keys(KITS),kit=R()<.2?pick(all.filter(k=>!own.includes(k))):pick(own);G.kit=kit;for(const k in KITS[kit])setK(+k,KITS[kit][k]);
   // bass character, relative to what the mood chose (held bass only deep or round)
   const B=TR[6],bp=B.p;if(!B.m){let list=BM[m]||Object.keys(BCH);if(bp.bsus>.01)list=list.filter(x=>x==='deep'||x==='round');if(list.length){const c=pick(list);G.bchar=c;BCH[c](bp);for(const key of ['cut','res','envA','dec','bdrv','bgr','sqm','bpp'])if(bp[key]!=null)bp[key]=clampX(B,key,bp[key])}}
   // perc sound picks
   const P3=TR[3];if(!P3.m&&(P3.p.pv==='Blip'||!P3.p.pv||(m==='Distorted Electro'&&P3.p.pv==='Ride')))for(const [snd,ch] of (PERC[m]||[]))if(R()<ch){try{window.setPercSound&&setPercSound(snd)}catch(e){}break}
   // mutation: ±15 % around what Launch chose (kick pitch, tuning and levels are left alone)
   for(const k in MUT){const T=TR[k];if(!T||T.m)continue;for(const key of MUT[k]){const v=T.p[key];if(typeof v!=='number'||!isFinite(v)||v===0)continue;T.p[key]=clampX(T,key,v*(.85+R()*.3))}}
  }catch(e){console.warn('[orbitron] v024',e)}
  try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0);return r}}
