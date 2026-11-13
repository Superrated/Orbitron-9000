/* ---- v41: Power lead = dark, sparse, moody ---- */
LPRE.Mist={pg:1,uni:3,usp:9,wid:.6,wave:.15,det:7,ft:'LP24',cut:380,envA:450,res:1.5,att:280,dec:.6,sus:.8,hold:12,rel:1.6,kt:0,subosc:.2,ds:.5,rs:.55};
G.ldMul=1;
const _gen41=generate;generate=function(){_gen41();G.ldMul=({Power:.6,'Deep Space':.8,Breaks:.8})[curMood]||1;if(curMood!=='Power')return;
 const L=TR[4],pk=pick(['Mist','Mist','Reese','Vowel']);applyLP(pk,1);const P=L.p;
 Object.assign(L,{st:64,h:pick([2,3]),r:pick([0,8,20,36]),lv:.45,m:R()<.33});L.pt=pat(L);
 Object.assign(P,{mode:'Motif',range:1,spread:.05,bias:.15,dv:.97,lock:.97,len:4,glide:0,sus:.8,att:Math.max(P.att||2,220),hold:pick([12,16]),rel:1.6,ds:.5,rs:.55,vib:0,drv:Math.min(P.drv||0,.12),grit:0,crush:0,fold:0});
 if(pk==='Reese')Object.assign(P,{cut:300,envA:300,res:1.5});if(pk==='Vowel')Object.assign(P,{vow:.75+R()*.25,cut:1800,envA:0});if(pk==='Mist')P.cut=320+R()*120;
 buf=[];mot=[];mp=-1;build()};
