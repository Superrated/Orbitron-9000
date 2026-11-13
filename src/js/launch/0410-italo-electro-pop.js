/* ---- v42: Italo -> electro-pop song feel: catchy repeating hook, pop progressions, offbeat chord stabs, 16th hats, half the space toms ---- */
Object.assign(MOODS.Italo,{sc:['Minor','Dorian','Major','Minor'],pr:[[0,5,2,6],[0,4,5,3],[0,5,3,4],[0,3,5,4]],sh:['tri','add9','7'],b:[112,120],md:['Motif']});
Object.assign(MP.Italo,{b:[112,120],hp:[[16,16,0]],hat:{tone:8800,dec:.035,open:.12,acc:.55,metal:.35}});
LMOOD.Italo=['Square chip','Pluck','FM keys','Square chip','Hollow BP'];
const _gen42=generate;generate=function(){_gen42();if(curMood!=='Italo')return;
 // half the space toms: one per bar + a 3-tom drop at the end of every 4 bars
 const P3=TR[3];P3.st=64;P3.pt=Array(64).fill(0);[14,30,46,58,60,62].forEach(i=>P3.pt[i]=1);P3.h=6;P3.lv=.5;
 const ST=STP;for(const k in ST)delete ST[k];Object.assign(ST,{14:4,30:4,46:4,58:4,60:2,62:0});
 // catchy hook: short repeating motif on chord tones
 const L=TR[4];Object.assign(L,{st:16,h:pick([6,7,8]),r:pick([0,2]),lv:.5,m:false});L.pt=pat(L);
 Object.assign(L.p,{mode:'Motif',dv:.99,len:8,lock:.85,range:2,spread:.25,bias:.5,glide:pick([0,0,.15]),sus:0,dec:Math.min(L.p.dec||.3,.28),rs:.25,ds:.3});
 // offbeat chord stabs instead of pads
 const S=TR[8];Object.assign(S,{st:16,h:4,r:2,lv:.5,m:false});S.pt=pat(S);Object.assign(S.p,{dec:.14,cut:1600,envA:1800,ds:.15,rs:.2,size:3});
 TR[5].m=true;TR[9].m=true;buf=[];mot=[];mp=-1;build()};
