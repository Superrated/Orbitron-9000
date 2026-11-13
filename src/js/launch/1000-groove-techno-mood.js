/* ---- v146: "Groove Techno" mood — percussive hard-groove / tribal techno, barely melodic: rolling tuned toms on an odd ring that drifts,
   busy accented hats, often a ride, a one-note bass, a lead that is mostly off (a single-note stab when on), no pads ---- */
{const NM='Groove Techno';
 MOODS[NM]={sc:['Minor','Phrygian','Dorian'],pr:[[0,0,0,0],[0,0,5,0],[0,0,0,6],[0,0,0,0]],sh:['tri','quart'],b:[136,142],cut:500,sw:600,att:.2,lh:[2,3],sp:.1,bias:.3,dv:.98,md:['Motif'],wave:.4,dec:.12,res:5,pt:['Hollow','Air'],hat:[[16,12,0],[16,14,1]],kick:{pitch:49,dec:.35,punch:6,drive:3},duck:.7,grit:.15,padlv:.15,mute:[5,7,8,9],hr:.2};
 MP[NM]={sty:'Hypnotic groove techno',b:[136,142],sw:[.05,.09],gr:.6,kick:{pitch:48,dec:.4,punch:6.5,drive:5.5,click:1.2},hat:{tone:9000,dec:.035,open:.1,acc:.65,metal:.8},hp:[[16,12,0],[16,14,1],[16,10,2]],clap:{tone:1200,spread:10,tail:.38,rv:.38},cl:.55,sn:0,
  fx:{rumble:.48,rcut:115,rfeed:1.5,dly:.2,fb:.45,dt:.75,rev:.25,shim:.05,dens:.1,duck:.72,bgrit:.38,glue:.62,clip:.58},lh:[2,3],gate:0,perc:.75,lfo:[['Hat tone',0,16,.35],['Hat decay',1,8,.3]]};
 LMOOD[NM]=['Techno stab','Hollow BP','Metal FM','Clean'];MTRIM[NM]=Object.assign({},MTRIM.Dark);
 $('#mood').add(new Option(NM,NM));
 const ring=(T,st,h,r,ten)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;if(ten!=null)T.ten=ten;T.pt=pat(T)};
 const _gg=generate;generate=function(){const r=_gg.apply(this,arguments);try{if(curMood!==NM)return r;const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],B=TR[6];
  ring(K,16,4,0);K.m=false;
  ring(H,16,pick([10,12,14]),Math.floor(R()*4),.2);Object.assign(H,{acc:.65,gho:.2,vari:.3,m:false});
  ring(C,16,2,4);C.m=false;
  // toms: low FM blips with a pitch drop, on an odd ring that slowly rotates
  if(P.p.pv!=='Ride')window.setPercSound&&setPercSound('Blip');
  ring(P,pick([12,14,10,13]),pick([5,6,7]),Math.floor(R()*12),pick([.2,.4]));Object.assign(P.p,{oct:pick([3,4]),ratio:pick([1.41,2.3,3.1]),fm:pick([2,3,4]),mdec:.06,bend:pick([.3,.5]),noise:.28,filt:pick([2800,3600]),fres:pick([3,5]),ds:.15,rs:.15,rdr:pick([4,8])});P.m=false;P.lv=.7;
  // bass: one note, rolling or offbeat
  try{window.bassStyle&&bassStyle(pick(['Rolling 16ths','Off-beat','Pedal']))}catch(e){}B.p.bns=pick(['Root','Pedal']);B.m=false;Object.assign(B.p,{bdrv:.35+R()*.15,bgr:.25+R()*.2,sqm:R()<.5?.3:0});
  // lead: mostly off; when on, a single-note stab
  L.m=R()<.55;{const v=R();if(v<.6){ring(L,16,pick([2,3]),pick([3,6,10]),0);Object.assign(L.p,{mode:'Motif',len:2,range:1,lock:1,dv:.98,cyc:0,nrep:1});L.lv=.35;G.gtLead='stab'}
   else if(v<.85){try{applyLP('Talkbox',1)}catch(e){}ring(L,16,pick([3,4]),pick([2,6,10]),.2);Object.assign(L.p,{mode:'Motif',len:pick([2,3]),range:1,lock:1,dv:.97,cyc:0,nrep:pick([1,2]),glide:.25,ds:.45,rs:.3});L.lv=.33;G.gtLead='vocal chop'}
   else{try{applyLP(pick(['Mini lead','Supersaw']),1)}catch(e){}ring(L,16,pick([6,7,8]),2,.1);Object.assign(L.p,{mode:'Pedal arp',len:4,range:1,lock:.9,dv:.98,cyc:pick([0,4]),rst:2,nrep:1,glide:0,vib:0,ds:.4,rs:.35});L.lv=.32;L.m=false;G.gtLead='topline'}}
  TR[5].m=true;TR[8].m=R()<.7;TR[9].m=true;TR[7].m=true;Object.assign(G,{rfeed:1.5,rumble:.45+R()*.1,rcut:105+Math.floor(R()*25),bgrit:.32+R()*.12});try{applyFX()}catch(e){}
  if(R()<.5)Object.assign(LFOS[2],{tg:'Master low-pass',sh:0,sync:1,div:128,d:.2,ph:0});
  try{window.leadResetPos&&leadResetPos()}catch(e){}build();if(typeof lfoUI==='function')lfoUI();setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0)}catch(e){console.warn('[orbitron] groove techno',e)}return r}}

