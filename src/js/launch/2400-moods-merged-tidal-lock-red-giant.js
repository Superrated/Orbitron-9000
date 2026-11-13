
/* ---- v0.75: MOODS AND MODULATION
   Merged   · Aurora now holds Aurora and Outer Rim; Lost Signal holds Lost Signal and Afterglow. One menu entry each; a Launch picks one of
              the two flavours (the status line names it), so nothing either of them could do is lost. Saved Sectors keep working.
   New      · Tidal Lock — polymetric hypnotic techno: every ring has its own length (kick 16, hats 10–14, toms 7–13, stab 5–14, a two-note
              lead pulse on 5–9), so the groove keeps turning against itself; almost no melody; modulation does the talking.
            · Red Giant — slow, heavy chug (100–110 BPM): long low kick, rolling Reese / rubber bass, open off-beat hats, low toms, a slow
              gliding lead riff through drive, dotted echo.
   Modulation for the techno (not melodic) moods: after a Launch, LFO 4 — and LFO 3 when the mood left it free — take a movement from the
   mood's own list below, using the new shapes (smooth random, stairs, spike) and targets. Only parts that are playing are picked. ---- */
{const MERGE={Ethereal:['Ethereal','Deep Space'],Melancholic:['Melancholic','Melodic House']},HOME={'Deep Space':'Ethereal','Melodic House':'Melancholic'};
 window.MOODMERGE=MERGE;window.MOODHOME=HOME;
 Object.assign(MOODNAME,{'Deep Space':'Aurora · Outer Rim','Melodic House':'Lost Signal · Afterglow',Polymeter:'Tidal Lock',Chug:'Red Giant'});
 const cp=o=>Object.assign({},o);
 MOODS.Polymeter={sc:['Phrygian','Minor','Dorian'],pr:[[0,0,0,0],[0,0,0,1],[0,0,6,0]],sh:['quart','sus4','tri'],b:[128,134],cut:450,sw:700,att:.2,lh:[3,4,5],sp:.15,bias:.3,dv:.97,md:['Motif','Turing loop'],wave:.4,dec:.14,res:5,pt:['Hollow','Air'],hat:[[12,7,0],[14,9,1]],kick:{pitch:48,dec:.38,punch:5.5,drive:4},duck:.7,grit:.2,padlv:.15,mute:[5,7,9],hr:0};
 MP.Polymeter={sty:'Polymetric hypnotic techno',b:[128,134],sw:[0,.04],gr:.5,kick:{pitch:48,dec:.38,punch:5.5,drive:4,click:1},hat:{tone:9500,dec:.03,open:.12,acc:.6,metal:.6},hp:[[12,7,0],[14,9,1],[10,6,0]],clap:{tone:1400,spread:9,tail:.3,rv:.3},cl:.5,sn:0,
  fx:{rumble:.42,rcut:110,rfeed:1.4,dly:.28,fb:.5,dt:.75,rev:.28,shim:.05,dens:.1,duck:.7,bgrit:.26,glue:.6,clip:.5},lh:[3,4,5],gate:0,perc:.65,lfo:[['Stab cutoff',6,32,.5],['Hat decay',7,16,.35]]};
 LMOOD.Polymeter=['Techno stab','Hollow BP','Metal FM','Hypno stab','Rubber blip'];MTRIM.Polymeter=cp(MTRIM['Groove Techno']||MTRIM.Dark);
 MOODS.Chug={sc:['Phrygian','Minor','Harm. minor'],pr:[[0,0,0,0],[0,0,1,0],[0,0,0,6]],sh:['tri','sus4','quart'],b:[100,110],cut:380,sw:600,att:.3,lh:[3,4],sp:.2,bias:.25,dv:.95,md:['Motif','Interval'],wave:.6,dec:.3,res:5,pt:['Hollow','Choir','Warm saw'],hat:[[16,8,0],[16,4,2]],kick:{pitch:44,dec:.5,punch:5,drive:5},duck:.85,grit:.3,padlv:.22,mute:[7,9],hr:0};
 MP.Chug={sty:'Slow heavy chug',b:[100,110],sw:[.02,.08],gr:.5,kick:{pitch:44,dec:.52,punch:5,drive:5.5,click:.8},hat:{tone:7500,dec:.05,open:.3,acc:.55,metal:.4},hp:[[16,8,0],[16,4,2],[16,6,2]],clap:{tone:1100,spread:14,tail:.45,rv:.4},cl:.6,sn:0,
  fx:{rumble:.5,rcut:95,rfeed:1.6,dly:.3,fb:.55,dt:.75,rev:.35,shim:.1,dens:.1,duck:.85,bgrit:.4,glue:.65,clip:.55},lh:[3,4],gate:0,perc:.6,lfo:[['Lead cutoff',6,16,.45],['Bass cutoff',0,32,.3]]};
 LMOOD.Chug=['Reese','Aggro','Hoover','Mini edge','Weird drone','Techno stab'];MTRIM.Chug=cp(MTRIM.Dark);
 try{const ms=document.getElementById('mood');[...ms.options].forEach(o=>{if(HOME[o.value])o.remove()});['Polymeter','Chug'].forEach(m=>{if(![...ms.options].some(o=>o.value===m))ms.add(new Option(MOODNAME[m],m))})}catch(e){}
 /* movements: [target, shape, length in beats, depth]. Shapes: 0 sine 1 triangle 5 sample & hold 6 smooth random 7 stairs 8 spike */
 const MV={hatStairs:['Hat decay',7,16,.35],hatOpen:['Hat open',6,32,.5],hatTone:['Hat tone',6,16,.3],hatDens:['Hat hits',1,32,.35],percBend:['Perc bend',8,4,.5],percStep:['Perc pitch',5,1,.2],percLen:['Perc decay',6,16,.4],percDens:['Perc hits',6,32,.35],
  stabWander:['Stab cutoff',6,32,.5],stabDrift:['Stab detune',6,16,.5],leadFold:['Lead fold',6,32,.45],leadStairs:['Lead cutoff',7,32,.4],leadLen:['Lead decay',6,16,.4],bassDrive:['Bass drive',6,32,.35],bassStairs:['Bass cutoff',7,16,.3],rumbleSwell:['Rumble',8,16,.3]};
 const TMOD={Dark:['hatStairs','stabWander','rumbleSwell','leadFold','percLen'],Tense:['percBend','leadFold','hatOpen','bassDrive','percStep'],Acid:['hatStairs','hatOpen','percBend','rumbleSwell'],
  Power:['hatOpen','bassDrive','percBend','leadLen'],'Groove Techno':['percBend','percDens','hatStairs','percStep','rumbleSwell'],Temporal:['hatDens','stabDrift','percLen','leadStairs'],
  Bleep:['percStep','leadLen','hatTone','bassStairs'],'Distorted Electro':['leadFold','bassDrive','percBend','hatOpen'],Drone:['hatTone','percLen','stabWander','rumbleSwell'],
  Breaks:['hatOpen','percBend','bassStairs'],Polymeter:['percBend','stabDrift','hatOpen','percDens','leadFold','rumbleSwell'],Chug:['hatOpen','bassDrive','leadFold','percLen','rumbleSwell','bassStairs']};
 const TRK={Hat:1,Perc:3,Stab:8,Lead:4,Bass:6,Clap:2},live=m=>{const k=TRK[m[0].split(' ')[0]];if(k!=null)return !TR[k].m&&!(k===4&&TR[4].p.mode==='Acid 303'&&/cutoff|decay|fold/.test(m[0]));return m[0]!=='Rumble'||(G.rumble||0)>.15};
 const setL=(i,m)=>Object.assign(LFOS[i],{tg:m[0],sh:m[1],sync:1,div:m[2],d:+(m[3]*(.8+R()*.4)).toFixed(2),ph:0});
 const ring=(T,st,h,r,ten)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;if(ten!=null)T.ten=ten;T.pt=pat(T)};
 function tidal(){const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],B=TR[6],S=TR[8];
  ring(K,16,4,0,0);K.m=false;Object.assign(K,{vari:0,gho:0});
  ring(H,pick([12,14,10]),pick([6,7,9]),Math.floor(R()*4),.15);Object.assign(H,{acc:.6,gho:.15,vari:.2,m:false});
  ring(C,16,pick([2,2,1]),4,0);C.m=R()<.25;
  try{if(P.p.pv!=='Ride')window.setPercSound&&setPercSound('Blip')}catch(e){}
  ring(P,pick([7,11,13,9]),pick([3,4,5]),Math.floor(R()*7),pick([0,.2]));Object.assign(P.p,{oct:pick([3,4]),ratio:pick([1.41,2,2.3]),fm:pick([2,3]),mdec:.07,bend:pick([.2,.4]),noise:.22,filt:pick([2600,3400]),fres:4,ds:.2,rs:.18});P.m=false;P.lv=.62;
  ring(S,pick([10,12,14,5]),pick([2,3]),Math.floor(R()*5),0);S.m=R()<.2;S.lv=.5;
  try{window.bassStyle&&bassStyle(pick(['Rolling 16ths','Off-beat','Pedal']))}catch(e){}B.p.bns=pick(['Root','Pedal']);B.m=false;
  try{applyLP(pick(LMOOD.Polymeter),1)}catch(e){}ring(L,pick([5,7,9,10]),pick([2,3]),Math.floor(R()*5),0);Object.assign(L.p,{mode:'Motif',len:pick([2,3]),range:1,lock:1,dv:.98,cyc:0,nrep:1,rst:0,glide:0,chd:'',ds:.4,rs:.25});L.lv=.36;L.m=R()<.3;if(L.m)S.m=false;   /* never both silent */
  TR[5].m=true;TR[7].m=true;TR[9].m=true;G.swing=+(R()*.04).toFixed(2);try{mot=[];mp=-1;buf=[]}catch(e){}}
 function giant(){const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],B=TR[6],S=TR[8];
  ring(K,16,4,0,0);K.m=false;Object.assign(K,{vari:0,gho:0});
  if(R()<.6){ring(H,16,4,2,0);H.p.open=+(.45+R()*.25).toFixed(2);H.p.dec=.07}else{ring(H,16,8,0,0);H.p.open=.2}Object.assign(H,{acc:.5,gho:.1,vari:.15,m:false});
  ring(C,16,2,4,0);C.m=false;
  try{if(P.p.pv!=='Ride')window.setPercSound&&setPercSound('Blip')}catch(e){}
  ring(P,16,pick([3,5]),pick([3,6,7,11]),.3);Object.assign(P.p,{oct:pick([2,3]),ratio:pick([1.41,1.5]),fm:pick([1.5,2.5]),mdec:.09,dec:.22,bend:pick([.4,.7]),noise:.15,filt:2200,fres:3,ds:.25,rs:.25});P.m=R()<.25;P.lv=.6;
  try{window.orbBassSound&&orbBassSound(pick(['Reese mid','Rubber','Rolling sub']))}catch(e){}try{window.bassStyle&&bassStyle(pick(['Rolling 16ths','Gallop','Octave 8ths']))}catch(e){}B.p.bns='Root';B.m=false;
  try{applyLP(pick(LMOOD.Chug),1)}catch(e){}ring(L,16,pick([2,3,4]),pick([2,3,6,10]),pick([0,.2]));Object.assign(L.p,{mode:'Motif',len:pick([3,4]),range:1,lock:.9,dv:.95,cyc:0,nrep:1,rst:0,glide:.5,gt:140,chd:'',drv:Math.max(L.p.drv||0,.45),ds:.5,rs:.3});L.lv=.42;L.m=R()<.2;
  S.m=R()<.6;TR[5].m=R()<.6;if(!TR[5].m)TR[5].lv=.2;TR[7].m=true;TR[9].m=true;G.dt=.75;try{mot=[];mp=-1;buf=[]}catch(e){}}
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const m=curMood;LFOS[3].d=0;
   if(m==='Polymeter'||m==='Chug'){m==='Polymeter'?tidal():giant();try{applyFX()}catch(e){}try{window.leadResetPos&&leadResetPos()}catch(e){}}
   const pool=(TMOD[m]||[]).map(k=>MV[k]).filter(live);
   if(pool.length){const a=pick(pool);if(R()<.85)setL(3,a);
    if(!(LFOS[2].d>0)&&R()<.5){const slow=pool.filter(x=>x!==a&&x[2]>=16&&x[0]!==LFOS[0].tg&&x[0]!==LFOS[1].tg);if(slow.length)setL(2,pick(slow))}}
   G.pwMode=TR[4].p.mode;if(m==='Polymeter'||m==='Chug'){build();setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0)}
   if(typeof lfoUI==='function')lfoUI()}catch(e){console.warn('[orbitron] moods',e)}return r}}
