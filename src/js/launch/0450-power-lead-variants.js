/* ---- v46: Power lead = short techno stabs ---- */
LPRE['Techno stab']={pg:1,eng:'Saw',uni:3,usp:12,wid:.5,wave:.2,det:7,oct2:.35,subosc:.2,ft:'LP12',cut:850,envA:2800,res:3,att:1,dec:.14,sus:0,kt:.2,drv:.25,ds:.45,rs:.18,vib:0};
LMOOD.Power=['Techno stab'];
const _gen46=generate;generate=function(){_gen46();if(curMood!=='Power')return;const L=TR[4],st=pick([5,6]);applyLP('Techno stab',1);
 Object.assign(L,{st,h:pick([2,3]),r:Math.floor(R()*st),lv:.5,m:false});L.pt=pat(L);
 Object.assign(L.p,{mode:'Motif',len:st,dv:1,lock:1,range:1,spread:0,glide:0,ds:.45,rs:.18,dec:.12+R()*.05});G.ldMul=.75;G.pedal=true;buf=[];mot=[];mp=-1;build()};
/* ---- v47: Power lead picks stabs, a weird drone, or nothing ---- */
LPRE['Weird drone']={pg:1,eng:'FM',fmr:1.41,fmi:3,fenv:.6,uni:2,usp:25,wid:.7,ft:'LP24',cut:700,envA:600,res:2,att:600,dec:1,sus:.9,hold:16,rel:2,kt:0,vib:6,vibr:.3,ds:.5,rs:.6};
const _gen47=generate;generate=function(){_gen47();if(curMood!=='Power')return;const L=TR[4],r=R();
 if(r<.25){L.m=true;G.pstyle='none'}
 else if(r<.55){applyLP('Weird drone',1);Object.assign(L,{st:16,h:1,r:0,lv:.5,m:false});L.pt=pat(L);Object.assign(L.p,{mode:'Motif',len:4,dv:1,lock:1,range:1,spread:0,glide:0,fmr:pick([1.41,2.76,3.14,.71]),hold:16});
  Object.assign(LFOS[1],{tg:'Lead cutoff',sh:0,sync:1,div:32,d:.4,ph:0});if(typeof lfoUI==='function')lfoUI();G.pstyle='drone'}
 else G.pstyle='stabs';buf=[];mot=[];mp=-1;build()};
/* ---- v48: Power lead = one fixed pitch, no melody ---- */
G.pnote=0;
const _ln48=leadNote;leadNote=function(p){const d=_ln48(p);return curMood==='Power'?G.pnote:d};
const _gen48=generate;generate=function(){_gen48();if(curMood!=='Power')return;G.pnote=R()<.75?0:4;Object.assign(TR[4].p,{glide:0,penv:0,vib:G.pstyle==='drone'?TR[4].p.vib:0})};
/* ---- v49: Power techno-stab variations (some with wild filtering) ---- */
const STABV={
 'Classic':{},
 'Resonant zap':{ft:'LP24',cut:260,envA:7000,res:14,dec:.09,drv:.3,oct2:.2},
 'Random filter':{ft:'LP12',cut:500,envA:2500,res:8,dec:.13,lfo:[5,pick([.25,.5]),.75]},
 'Swept filter':{ft:'LP24',cut:400,envA:2000,res:10,dec:.15,lfo:[2,2,.7]},
 'Hollow knock':{ft:'BP',cut:1100,envA:3200,res:8,dec:.1,oct2:0,subosc:0},
 'Folded grunge':{fold:.5,fenv:.8,cut:1600,envA:4000,res:6,dec:.12,drv:.35},
 'Zip':{ft:'HP',cut:180,envA:6000,res:5,dec:.08,oct2:.4}};
const _gen49=generate;generate=function(){_gen49();if(curMood!=='Power'||G.pstyle!=='stabs')return;const nm=pick(Object.keys(STABV)),v=Object.assign({},STABV[nm]),P=TR[4].p;
 const lf=v.lfo;delete v.lfo;Object.assign(P,v);P.patch='Techno stab';G.stabv=nm;
 if(lf)Object.assign(LFOS[1],{tg:'Lead cutoff',sh:lf[0],sync:1,div:lf[1],d:lf[2],ph:0});else Object.assign(LFOS[1],{tg:'Lead cutoff',d:0});
 if(typeof lfoUI==='function')lfoUI();build()};
/* ---- v50: Power lead sparser + moodier: stabs only in some bars, drone once every 4 bars ---- */
G.pgate=null;
const _fire50=fire;fire=function(k,w){if(k===4&&curMood==='Power'&&G.pgate){const b=Math.floor(tk/16)%G.pgate.len;if(!G.pgate.on.includes(b))return}_fire50(k,w)};
const _gen50=generate;generate=function(){_gen50();G.pgate=null;if(curMood!=='Power')return;const L=TR[4],P=L.p;
 if(G.pstyle==='stabs'){G.pgate=pick([{len:4,on:[3]},{len:8,on:[6,7]},{len:8,on:[3,7]},{len:4,on:[1]}]);P.cut=P.cut*.75;P.ds=.6;P.rs=.4}
 else if(G.pstyle==='drone'){Object.assign(L,{st:64,h:1,r:0});L.pt=pat(L);Object.assign(P,{hold:32,att:1200,rel:3})}
 build()};
