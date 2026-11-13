/* ---- v72: Power lead — more variety, mostly sparse or absent: none 40 %, drone 20 %, stabs 30 % (more variants, rhythms and very sparse gates), single blips 10 % ---- */
Object.assign(STABV,{'Ladder zap':{eng:'Mini',o1w:3,o2w:5,o2d:0,o2l:.6,o3l:0,cut:220,res:17,envA:6500,fatt:1,fdec:.1,fsus:0,att:1,dec:.12,sus:0,dsw:1,glk:0},
 'Mini knock':{eng:'Mini',o1w:0,o2w:2,o2r:-1,o2d:0,o2l:.7,o3l:0,cut:500,res:6,envA:3000,fatt:1,fdec:.07,fsus:0,att:1,dec:.09,sus:0,dsw:1,glk:0},
 'Dub chord hit':{ft:'LP12',cut:700,envA:1800,res:4,dec:.22,uni:4,usp:18,wid:.8,ds:.75,rs:.45},
 'Metallic':{eng:'FM',fmr:3.14,fmi:4,ft:'BP',cut:1800,envA:2500,res:6,dec:.07}});
LPRE['Space blip']={pg:1.2,eng:'Mini',o1w:5,o1r:1,o2w:0,o2r:2,o2d:7,o2l:.5,o3l:0,mnz:0,cut:1400,res:9,envA:5000,fatt:1,fdec:.08,fsus:0,att:1,dec:.12,sus:0,dsw:1,glk:0,kt:.6,ds:.7,rs:.5};
const DRV={'FM hum':{eng:'FM',fmr:1.41,fmi:3},'Bell drone':{eng:'FM',fmr:3.14,fmi:1.5},'Low ladder':{eng:'Mini',o1w:2,o1r:-1,o2w:2,o2r:-1,o2d:9,o2l:.8,o3w:0,o3r:-2,o3l:.6,cut:180,res:12,envA:500,fatt:1500,fdec:2,fsus:.5,att:1500,dec:2,sus:1,dsw:0,rel:3},'Hollow drone':{eng:'Vowel',vow:pick([0,1,2,3,4])}};
const _gen72=generate;generate=function(){_gen72();if(curMood!=='Power')return;const L=TR[4],P=L.p,r=R();G.pgate=null;Object.assign(LFOS[1],{tg:'Lead cutoff',d:0});
 if(r<.4){L.m=true;G.pstyle='none'}
 else if(r<.6){applyLP('Weird drone',1);const dn=pick(Object.keys(DRV));Object.assign(P,DRV[dn]);if(P.eng==='FM')P.fmr=pick([1.41,2.76,3.14,.71]);
  Object.assign(L,{st:pick([64,128]),h:1,r:0,lv:.45,m:false});L.pt=pat(L);Object.assign(P,{mode:'Motif',len:4,dv:1,lock:1,range:1,spread:0,glide:0,hold:pick([16,32]),att:Math.max(P.att||0,900),rel:3});
  Object.assign(LFOS[1],{tg:'Lead cutoff',sh:pick([0,1]),sync:1,div:pick([32,64]),d:.35+R()*.2,ph:0});G.pstyle='drone';G.stabv=dn}
 else if(r<.9){applyLP('Techno stab',1);const st=pick([3,5,6,7,8]),nm=pick(Object.keys(STABV)),v=Object.assign({},STABV[nm]),lf=v.lfo;delete v.lfo;Object.assign(P,v);P.patch='Techno stab';G.stabv=nm;
  Object.assign(L,{st,h:pick([1,1,2,3]),r:Math.floor(R()*st),lv:.5,m:false});L.ten=R()<.4?.5:0;L.pt=pat(L);
  Object.assign(P,{mode:'Motif',len:st,dv:1,lock:1,range:1,spread:0,glide:0,ds:Math.max(P.ds||0,.5),rs:Math.max(P.rs||0,.3)});P.cut=P.cut*.8;
  if(lf)Object.assign(LFOS[1],{tg:'Lead cutoff',sh:lf[0],sync:1,div:lf[1],d:lf[2],ph:0});
  G.pgate=pick([{len:4,on:[3]},{len:8,on:[7]},{len:8,on:[3,7]},{len:8,on:[6,7]},{len:16,on:[15]},{len:16,on:[7,15]},{len:4,on:[1,3]},{len:16,on:[12,13,14,15]}]);G.pstyle='stabs'}
 else{applyLP('Space blip',1);Object.assign(L,{st:32,h:1,r:pick([6,14,22,30]),lv:.4,m:false});L.pt=pat(L);Object.assign(P,{mode:'Motif',len:2,dv:1,lock:1,range:1,spread:0,glide:0});
  G.pgate=pick([{len:2,on:[1]},{len:4,on:[3]},{len:8,on:[3,7]}]);G.pstyle='blip'}
 G.ldMul=.75;G.pedal=true;buf=[];mot=[];mp=-1;if(typeof lfoUI==='function')lfoUI();build()};
