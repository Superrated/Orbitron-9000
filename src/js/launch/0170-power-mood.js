/* ---- v14: Power = sparse and moody — drums lead; few long dark lead notes, one held chord, pedal bass ---- */
Object.assign(MOODS.Power,{lh:[2,3],md:['Motif'],sp:.1,dv:.95});LMOOD.Power=['Mist','Reese','Vowel'];
const _gen14=generate;generate=function(){_gen14();G.rfeed=1;if(curMood!=='Power'){G.pedal=padStyle==='Pedal chords';if(G.rumble>.3||G.rel>.22){G.rumble=.22;G.rcut=140;G.rel=.2;if(A.rg){A.rg.gain.value=G.rumble;A.rl.frequency.value=G.rcut}syncMix()}return}
 G.rfeed=1.7;G.rumble=.5+R()*.15;G.rcut=110+Math.floor(R()*50);if(A.rg){A.rg.gain.value=G.rumble;A.rl.frequency.value=G.rcut}syncMix();
 const L=TR[4],P=L.p;Object.assign(L,{st:32,h:pick([2,3,3]),r:pick([0,4,8,12]),lv:.5});L.pt=pat(L);
 Object.assign(P,{mode:'Motif',range:1,spread:.08,bias:.2,dv:.95,lock:.95,len:4,glide:0,sus:Math.max(P.sus||0,.75),att:Math.max(P.att||2,25),hold:pick([4,6,8]),rel:.6,dec:Math.max(P.dec,.4),cut:P.cut*.75,ds:.45,rs:.4,vib:0});
 const TP=TR[5];TP.st=1;prog=[0];pshape=[pick(['sus4','quart','tri'])];pmean=null;Object.assign(TP.p,{size:3,bars:4,cut:Math.min(TP.p.cut,320),sweep:Math.min(TP.p.sweep,400),att:.6});TP.lv=.28;TP.pt=pat(TP);
 Object.assign(TR[6].p,{fifth:.08,jump:.04});G.pedal=true;
 const S=TR[8];Object.assign(S,{st:32,h:1,r:pick([6,10,22])});S.pt=pat(S);S.m=R()<.5;TR[9].p.follow=0;
 buf=[];mot=[];mp=-1;build()};
