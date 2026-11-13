/* ---- v150: "Vector" mood — modular house. Each Launch picks a flavour: Rubber (rubbery modular plucks on odd rings,
   melodic bass, a long slow filter build), Cascade (driving acid-tinged modular riff, brighter stabs) or Night (jazzy 7th/9th chords on
   electric-piano keys, walking bass) — and, separately, broken / shuffled drums or four-on-the-floor ---- */
{const NM='Vector';
 MOODS[NM]={sc:['Dorian','Minor','Mixolydian','Dorian','Major'],pr:[[0,3,6,2],[1,4,0,5],[0,5,1,4],[0,2,5,4],[1,4,2,5],[0,3,1,4]],sh:['9','7','add9'],b:[120,130],cut:800,sw:1500,att:.3,lh:[6,7,9],sp:.35,bias:.5,dv:.92,md:['Turing loop','Marbles','Converge','Motif'],wave:.3,dec:.2,res:4,pt:['Bell pad','Poly','Strings','Tape','Glass'],hat:[[16,6,2],[16,12,0]],kick:{pitch:50,dec:.38,punch:4,drive:2},duck:.6,grit:.05,padlv:.35,mute:[8],hr:.12};
 MP[NM]={sty:'Modular house',b:[120,130],sw:[.04,.1],gr:.65,kick:{pitch:50,dec:.38,punch:4,drive:2,click:.7},hat:{tone:9500,dec:.04,open:.25,acc:.55,metal:.4},hp:[[16,6,2],[16,12,0]],clap:{tone:1600,spread:11,tail:.3,rv:.35},cl:.5,sn:0,
  fx:{rumble:.05,rcut:140,rfeed:1,dly:.35,fb:.5,dt:.75,rev:.4,shim:.4,dens:.3,duck:.6,bgrit:.05,glue:.5,clip:.3},lh:[6,7,9],gate:0,perc:.6,lfo:[['Lead cutoff',0,16,.35],['Delay feedback',1,32,.2]]};
 LMOOD[NM]=['Pluck','FM bell','Mini sparkle','Glass','FM keys','Mini acid','Square chip'];MTRIM[NM]=Object.assign({},MTRIM.Melancholic);
 $('#mood').add(new Option(NM,NM));
 const ring=(T,st,h,r,ten)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;if(ten!=null)T.ten=ten;T.pt=pat(T)};
 const bs=n=>{try{window.bassStyle&&bassStyle(n)}catch(e){}};
 const _gv=generate;generate=function(){const r=_gv.apply(this,arguments);try{if(curMood!==NM)return r;const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],PD=TR[5],B=TR[6],SN=TR[7];
  const fl=pick(['rubber','cascade','night']),broken=fl==='night'?R()<.3:R()<.5;G.vecFlav=fl+(broken?' · broken':' · four-on-the-floor');
  G.bpm=fl==='night'?120+Math.floor(R()*5):fl==='cascade'?128+Math.floor(R()*5):125+Math.floor(R()*6);
  if(broken){ring(K,16,pick([4,5]),pick([0,3,6]),pick([.4,.55]));Object.assign(K,{acc:.4,gho:0,vari:.4,m:false});
   ring(SN,16,2,4,0);Object.assign(SN,{acc:.3,gho:.45,vari:.5,m:false});C.m=R()<.6;ring(H,16,pick([10,12]),1,.2);Object.assign(H,{acc:.6,gho:.25,vari:.3,m:false})}
  else{ring(K,16,4,0,0);Object.assign(K,{acc:0,gho:0,vari:0,m:false});SN.m=true;ring(C,16,2,4,0);C.m=false;ring(H,16,pick([4,6,12]),2,0);Object.assign(H,{acc:.55,gho:.1,vari:.2,m:false})}
  ring(P,pick([10,12,14]),pick([4,5]),Math.floor(R()*8),pick([0,.2]));P.m=R()<.25;P.p.rdr=pick([0,8]);
  const lst=pick([10,12,14,16]);ring(L,lst,Math.round(lst*pick([.45,.55,.6])),pick([0,1,3]),pick([0,.2]));L.m=false;
  if(fl==='rubber'){Object.assign(L.p,{mode:pick(['Turing loop','Marbles','Turing loop']),len:pick([5,7,8]),dv:.93,range:2,lock:.7,spread:.4,bias:.5,nrep:pick([1,1,2]),cyc:0,rst:0,glide:pick([0,.15])});
   bs(pick(['Syncopated','Walking']));B.p.bns='Chord tones';PD.lv=.28;Object.assign(LFOS[2],{tg:'Master low-pass',sh:0,sync:1,div:128,d:.3,ph:0})}
  else if(fl==='cascade'){Object.assign(L.p,{mode:pick(['Motif','Pedal arp']),len:pick([4,8]),dv:.96,range:2,lock:.75,nrep:1,cyc:0,rst:0,glide:.3});L.p.res=Math.max(L.p.res||4,6);
   bs(pick(['Rolling 16ths','Octave 8ths']));PD.m=R()<.5;TR[8].m=R()<.5;Object.assign(LFOS[2],{tg:'Master low-pass',sh:0,sync:1,div:64,d:.2,ph:0})}
  else{Object.assign(L.p,{mode:pick(['Converge','Chord arp','Diverge']),len:6,dv:.9,range:2,lock:.8,nrep:1,cyc:pick([0,5,6]),rst:0,glide:0});L.lv=(L.lv||.45)*.85;
   bs('Walking');PD.lv=.42;PD.m=false;Object.assign(PD.p,{bars:pick([1,2])});G.swing=Math.max(G.swing||0,.07)}
  G.space=.55;
  $('#bpm').value=G.bpm;$('#bv').textContent=G.bpm;if(A.dl)A.dl.delayTime.value=(G.dt||.75)*60/G.bpm;
  try{window.leadResetPos&&leadResetPos()}catch(e){}build();if(typeof lfoUI==='function')lfoUI();try{say&&say('♪ '+MN('Vector').toUpperCase()+' · '+G.vecFlav.toUpperCase())}catch(e){}
  setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync();window.spaceShow&&spaceShow();window.moodFinish&&moodFinish.apply()}catch(e){}},0)}catch(e){console.warn('[orbitron] vector',e)}return r}}

