
/* v163: "Temporal" mood — Neapolitan loop techno: stripped-back, loop-driven, gritty but funky.
   Hats and claps carry the groove, almost no melody, at most a dark one-chord stab loop. Three flavours per Launch:
   Pummel (early, hard, fast), Shifting hats (polymetric hat + ride layers, subtle bass), Tribal (tom/conga loop leads, ride on top). */
{const NM='Temporal';
 MOODS[NM]={sc:['Minor','Phrygian','Dorian'],pr:[[0,0,0,0],[0,0,0,5],[0,0,6,0]],sh:['7','quart'],b:[136,145],cut:450,sw:500,att:.05,lh:[2,3],sp:.1,bias:.3,dv:.98,md:['Motif','Turing loop'],wave:.4,dec:.1,res:5,pt:['Hollow','Organ'],hat:[[16,12,0],[16,14,1]],kick:{pitch:48,dec:.28,punch:7,drive:5},duck:.8,grit:.2,padlv:.12,mute:[5,7,8,9],hr:.15};
 MP[NM]={sty:'Neapolitan loop techno',b:[136,145],sw:[.08,.14],gr:.55,kick:{pitch:48,dec:.28,punch:7,drive:6,click:1.4},hat:{tone:9500,dec:.03,open:.12,acc:.7,metal:.85},hp:[[16,12,0],[16,14,1],[16,11,2]],clap:{tone:1300,spread:8,tail:.25,rv:.2},cl:.62,sn:0,
  fx:{rumble:.1,rcut:110,rfeed:1,dly:.15,fb:.35,dt:.75,rev:.12,shim:0,dens:.05,duck:.8,bgrit:.35,glue:.68,clip:.62},lh:[2,3],gate:0,perc:.7,lfo:[['Hat tone',0,32,.3],['Hat decay',1,16,.3]]};
 LMOOD[NM]=['Techno stab','Hollow BP','Metal FM','Clean'];MTRIM[NM]=Object.assign({},MTRIM['Groove Techno']||MTRIM.Dark);MTRIM[NM][1]=(MTRIM[NM][1]||0)+2;MTRIM[NM][2]=(MTRIM[NM][2]||0)+1.5;
 $('#mood').add(new Option(NM,NM));
 const ring=(T,st,h,r,ten)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;if(ten!=null)T.ten=ten;T.pt=pat(T)};
 const STY='Neapolitan loop techno';
 const _gt=generate;generate=function(){const r=_gt.apply(this,arguments);try{if(curMood!==NM){MP[NM].sty=STY;return r}
  const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],PD_=TR[5],B=TR[6],SN=TR[7],ST=TR[8],SB=TR[9];
  const fl=pick(['Pummel','Shifting hats','Shifting hats','Tribal']);G.tmpFlav=fl;MP[NM].sty=STY+' · '+fl.toLowerCase();
  if(!G.bpmLock){G.bpm=fl==='Pummel'?141+Math.floor(R()*5):fl==='Tribal'?134+Math.floor(R()*5):136+Math.floor(R()*5);$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm}
  // kick: short, hard 909-style, no long rumble tail
  ring(K,16,4,0);K.m=false;Object.assign(K.p,{dec:fl==='Pummel'?.24:.3,punch:7,drive:fl==='Pummel'?7:5});
  // clap central on 2 and 4, sometimes a ghost a 16th early on the snare track
  ring(C,16,2,4);C.m=false;C.lv=.8;SN.m=R()<.55;if(!SN.m){ring(SN,16,2,3);SN.lv=.28}
  // hats carry the groove
  ring(H,16,fl==='Pummel'?pick([14,16]):pick([10,11,12,13]),Math.floor(R()*4),.25);Object.assign(H,{acc:.7,gho:fl==='Pummel'?.1:.3,vari:.35,m:false});H.p.rdr=fl==='Shifting hats'?pick([8,16]):0;
  // perc: ride layer on an odd ring (shifting hats), tom/conga loop (tribal), sparse ride (pummel)
  if(fl==='Tribal'){window.setPercSound&&setPercSound('Blip');ring(P,pick([10,12,13,14]),pick([5,6,7]),Math.floor(R()*12),pick([.2,.4]));
    Object.assign(P.p,{oct:pick([4,5]),ratio:pick([1.41,2,3.1]),fm:pick([2,3]),mdec:.05,bend:pick([.4,.6]),noise:.2,filt:pick([3000,4200]),fres:pick([3,5]),ds:.12,rs:.1,rdr:pick([4,8])});P.m=false;P.lv=.75}
  else{window.setPercSound&&setPercSound('Ride');const pst=fl==='Pummel'?16:pick([12,14,7]);ring(P,pst,fl==='Pummel'?4:pst===7?pick([3,4]):pick([5,6,7]),fl==='Pummel'?2:Math.floor(R()*12),.2);P.m=fl==='Pummel'?R()<.5:false;P.lv=.5;P.p.rdr=fl==='Shifting hats'?pick([4,8]):0}
  // bass: subtle — an offbeat pluck or a pedal note; often off in Pummel
  try{window.bassStyle&&bassStyle(pick(['Off-beat','Pedal']))}catch(e){}B.p.bns='Root';B.m=fl==='Pummel'?R()<.6:R()<.25;B.lv=.42;Object.assign(B.p,{bdrv:.3,bgr:.15+R()*.15,sqm:0,dec:.12});
  // lead: mostly off; when on, a one- or two-note hypnotic tone loop
  L.m=R()<(fl==='Pummel'?.8:.5);if(!L.m){try{applyLP(pick(['Metal FM','Hollow BP','Techno stab']),1)}catch(e){}ring(L,16,pick([2,3,4]),pick([2,6,10]),0);
   Object.assign(L.p,{mode:R()<.5?'Turing loop':'Motif',len:pick([2,2,3,4]),range:1,lock:1,dv:1,cyc:0,nrep:1,glide:0,vib:0,ds:.35,rs:.15});L.lv=.3}
  // harmony: at most a dark one-chord stab loop (chord memory), never in Pummel; or the dub stab with a short dark echo
  PD_.m=true;ST.m=true;SB.m=true;
  if(fl!=='Pummel'&&R()<.55){if(R()<.65){padStyle='Chord memory';G.padAuto=1;try{cmPrep()}catch(e){}
     prog=[0];PX=[0];pshape=[pick(['7','quart'])];PD_.st=1;PD_.h=1;PD_.pt=pat(PD_);PD_.m=false;PD_.lv=Math.max(PD_.lv||.3,.32);
     G.cmShape=pick([[0,3,7,10],[0,7,10],[0,7],[0,3,10,14]]);G.cmPat=pick(['0010001000100010','1001001000100100','0010000100100001','0000001000000010']);pmean=null;PTOP=null}
   else{ST.m=false;ring(ST,16,pick([2,3]),pick([3,6,11]),0);ST.lv=.4}}
  Object.assign(G,{rumble:.06+R()*.08,rcut:105,rfeed:1,bgrit:.3+R()*.12,swing:fl==='Pummel'?.03+R()*.03:.08+R()*.06,space:.15});try{applyFX()}catch(e){}
  Object.assign(LFOS[2],{tg:'Master low-pass',sh:0,sync:1,div:pick([64,128]),d:.18,ph:0});
  try{window.leadResetPos&&leadResetPos()}catch(e){}build();if(typeof lfoUI==='function')lfoUI();
  setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync();window.syncMenus&&syncMenus();window.moodFinish&&moodFinish.apply();window.spaceShow&&spaceShow()}catch(e){}},0)}catch(e){console.warn('[orbitron] temporal',e)}return r}}
