/* ---- v25: Breaks rebuilt — 2-bar break engine (velocity-mapped kick/snare/ghosts/hats, clap layer on the backbeat, snare-roll edit every 4 bars), reese bass locked to the kick ---- */
const BRKV={
 'Two-step':{K:{0:1,10:1,16:1,26:1},S:{4:1,7:.28,12:1,15:.32,20:1,23:.3,28:1,30:.38},Hg:[3,11,19,27,29],op:[14,30]},
 'Amen edit':{K:{0:1,2:.85,10:1,11:.75,16:1,18:.85,26:1},S:{4:1,7:.42,9:.36,12:1,15:.48,20:1,23:.42,25:.36,28:1,31:.5},Hg:[5,13,21,29],op:[14]},
 'Rolling':{K:{0:1,10:1,13:.7,16:1,26:1,29:.7},S:{4:1,12:1,14:.3,20:1,22:.3,28:1,30:.35,31:.3},Hg:[1,3,9,11,17,19,25,27],op:[6,22]}};
G.brk=null;
const arr32=(o)=>{const v=Array(32).fill(0);for(const k in o)v[+k]=o[k];return v};
function setupBreaks(){G.brk=null;const K=TR[0],S=TR[7],H=TR[1],C=TR[2],BS=TR[6];
 Object.assign(K,{st:16,h:pick([3,4,4,5]),r:0,ten:pick([.45,.6,.75]),acc:.55,gho:0,vari:.55,m:false,vel:null});
 Object.assign(S,{st:16,h:2,r:4,ten:0,acc:.2,gho:pick([.45,.55,.65]),vari:.7,m:false,vel:null});
 Object.assign(H,{st:16,h:pick([8,10,12]),r:0,ten:.15,acc:.7,gho:.25,vari:.35,m:false,vel:null});
 Object.assign(C,{st:16,h:2,r:4,ten:0,acc:0,gho:0,vari:.2,m:false,vel:null});[K,S,H,C].forEach(T=>T.pt=pat(T));
 Object.assign(K.p,{pitch:55,dec:.26,punch:6,drive:3,click:1.3});tuneKick();
 Object.assign(S.p,{tone:215,snap:1.05,dec:.19,rv:.16});S.lv=.75;
 Object.assign(H.p,{tone:9800,dec:.03,open:0,acc:.25,metal:.45});
 Object.assign(C.p,{tone:1900,spread:7,tail:.14,rv:.12});
 BS.st=16;BS.r=0;BS.pt=K.pt.slice();BS.h=K.h;
 Object.assign(BS.p,{dec:.85,cut:240,envA:.8,res:2,sub:.85,det:26,oct:1,fifth:.12,jump:0});G.bavoid=false;
 TR[3].m=true;TR[8].m=true;G.groove=.2;G.swing=.05;
 /* keep the melodic side dark and minimal: reese carries the movement */
 const L=TR[4];applyLP(pick(['Soft sine','Glass','Soft sine']),1);Object.assign(L,{st:32,h:pick([1,2]),r:pick([6,12,20]),lv:.4,m:R()<.4});L.pt=pat(L);
 Object.assign(L.p,{mode:'Motif',range:1,spread:.05,dv:.95,lock:.95,glide:0,cut:L.p.cut*.6,rs:.6,ds:.45,vib:0});
 const P=TR[5];Object.assign(P.p,{patch:pick(['Air','Hollow']),cut:Math.min(P.p.cut,420),sweep:Math.min(P.p.sweep,300),att:.7,bars:4,size:3,trem:0,apan:.2});P.lv=.22;G.dens=Math.min(G.dens,.15);G.shim=Math.min(G.shim,.35);buf=[];mot=[];mp=-1}
const _fire25=fire;fire=function(k,w){const B=G.brk;if(!B||![0,1,2,7].includes(k))return _fire25(k,w);
 const T=TR[k],s=tk%T.st,fill=!B.nofill&&tk%64>=56;if(fill&&(k===7||k===2||(k===0&&tk%64!==56)))return;
 let v=(T.vel&&T.vel[s])||1;if(v<.6){const gg=G.ghost==null?.5:G.ghost;v=Math.min(.75,v*2*gg);if(v<.02)return}const o=T.lv,op=T.p.open;T.lv=o*v;if(k===1)T.p.open=B.op.includes(s)?1:0;try{_fire25(k,w)}finally{T.lv=o;if(k===1)T.p.open=op}};
arrStep=function(w){const B=G.brk;if(!B||B.nofill||TR[7].m)return;const f=tk%64;if(f>=56){const i=f-56;snare(w+(tk%2?G.swing*sdur():0),.3+.7*i/7);if(i>=4)snare(w+sdur()/2,.25+.5*i/7)}};
