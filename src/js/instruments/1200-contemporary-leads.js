
/* v168: contemporary leads — Cinematic arp (melodic techno), Donk (tech house),
   Rave stab (rave revival). Each is a lead patch with its own pattern; Launch picks them in moods they fit. */
{const NEW={
  'Cinematic arp':{pg:1.5,eng:'Stack',uni:5,usp:18,wid:.8,det:9,wave:.3,ft:'LP24',cut:700,res:6,envA:2600,dec:.2,sus:0,att:2,kt:.4,subosc:.15,oct2:.2,ds:.4,rs:.55,glide:0,vib:0,drv:0,crush:0,fold:0,penv:0,
   mode:'Up/Down',range:2,cyc:0,nrep:1,rst:0,xv:'arp',_t:{st:16,h:16,r:0,ten:0}},
  'Donk':{pg:1.6,eng:'FM',fmr:2,fmi:3,fenv:.9,uni:1,usp:0,wid:0,ft:'LP12',cut:2400,res:3,envA:1800,dec:.13,sus:0,att:1,penv:12,pdec:.035,kt:.2,subosc:.3,oct2:0,ds:.18,rs:.08,glide:0,vib:0,drv:0,crush:0,fold:0,
   mode:'Motif',len:3,range:1,cyc:0,nrep:1,rst:0,xv:'donk',_t:{st:16,h:5,r:2,ten:.1}},
  'Rave stab':{pg:1.4,eng:'Organ',uni:2,usp:10,wid:.4,ft:'LP12',cut:2200,res:2,envA:2500,dec:.2,sus:0,att:2,kt:.3,drv:.25,crush:.25,subosc:0,oct2:0,ds:.3,rs:.3,glide:0,vib:3,vibr:.8,fold:0,penv:0,
   mode:'Motif',len:2,range:1,cyc:0,nrep:1,rst:0,xv:'stab',_t:{st:16,h:3,r:3,ten:.25}}};
 Object.assign(LPRE,NEW);
 const hs=(a,b)=>{const x=Math.sin(a*12.9898+b*78.233)*43758.5453;return x-Math.floor(x)};
 // per-note extras
 const _lp=leadPoly;leadPoly=function(w){const T=TR[4],P=T.p,x=P.xv;if(!x||!NEW[P.patch])return _lp.apply(this,arguments);
  if(x==='arp'){const c=P.cut;P.cut=c*(.55+1.1*(((tk%256)+256)%256)/256);try{return _lp.apply(this,arguments)}finally{P.cut=c}}
  if(x==='donk'){const o=OCT;OCT=o-1;try{return _lp.apply(this,arguments)}finally{OCT=o}}
  if(x==='stab'){_lp.apply(this,arguments);const d=lastDeg,ln=leadNote,lv=T.lv,lf=LF,lw=LW;
   if(!(QOS.lvl>=3||QOS.eco2)){try{T.lv=lv*.55;[2,4].forEach(k=>{leadNote=()=>d+k;_lp.call(this,w)})}finally{leadNote=ln;T.lv=lv;lastDeg=d;LF=lf;LW=lw}}return}
  return _lp.apply(this,arguments)};
 // switching to an older patch clears the per-note extra
 const _a=applyLP;applyLP=function(){const r=_a.apply(this,arguments);try{const P=TR[4].p;if(!(LPRE[P.patch]&&LPRE[P.patch].xv))delete P.xv}catch(e){}return r};
 // Launch: moods pick them now and then
 const PICK={'Melodic House':[['Cinematic arp',.12]],Hopeful:[],Dreamy:[],'Groove Techno':[['Donk',.25]],
  Temporal:[['Donk',.25]],'Distorted Electro':[['Donk',.12]],Melancholic:[['Cinematic arp',.3]],Dark:[['Cinematic arp',.2]],
  Ethereal:[['Cinematic arp',.25]],Tense:[['Cinematic arp',.15]],Vector:[['Cinematic arp',.15],['Rave stab',.15]],Breaks:[['Rave stab',.3]],Italo:[['Rave stab',.15]],
  Bleep:[['Rave stab',.2],['Donk',.15]]};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],mx=(window.MOODX&&MOODX[curMood]||{}),m='lead' in mx?mx.lead:PICK[curMood];if(m&&!L.m&&L.p.mode!=='Acid 303'){let u=R();
   for(const [n,c] of m){if(u<c){applyLP(n,1);L.lv=Math.max(.3,Math.min(L.lv||.45,.5));try{window.leadResetPos&&leadResetPos()}catch(e){}build();break}u-=c}}}catch(e){console.warn('[orbitron] lead pick',e)}return r};
 // lead patch menus: add the new names
 const addOpt=()=>document.querySelectorAll('select[aria-label="Lead patch"]').forEach(s=>{Object.keys(NEW).forEach(n=>{if(![...s.options].some(o=>o.value===n))s.add(new Option(n,n))})});
 addOpt();UI.on(()=>{try{addOpt()}catch(e){}});window.NEWLEADS=NEW}
