/* ---- v77: "Bleep" mood — bleepy minimal techno: tight clicky drums, dry sparse bleeps on delay, tuned perc blips, small bass, almost no pads ---- */
MOODS.Bleep={sc:['Phrygian','Minor','Dorian','Min pentatonic','Phrygian'],pr:[[0,0,0,0],[0,0,1,0],[0,5,0,0],[0,3,0,0],[0,0,'bII',0]],sh:['sus2','quart','tri'],b:[124,128],cut:800,sw:600,att:.15,lh:[4,5,6],sp:.25,bias:.4,dv:.92,md:['Marbles','Interval'],wave:.3,dec:.1,res:5,pt:['Air','Fold','Glass'],duck:.5,grit:.05,padlv:.18,mute:[7,8,9],hr:.1};
MP.Bleep={sty:'Bleepy minimal techno',b:[124,128],sw:[.14,.2],gr:.6,kick:{pitch:52,dec:.26,punch:5,drive:1.5,click:1.2},hat:{tone:11000,dec:.02,open:.04,acc:.6,metal:.3},hp:[[16,4,2],[16,7,1],[16,5,3]],clap:{tone:1900,spread:6,tail:.12,rv:.35},cl:.35,sn:0,
 fx:{rumble:0,rcut:120,rfeed:1,dly:.55,fb:.62,dt:.75,rev:.34,shim:0,dens:.08,duck:.55,bgrit:.08,glue:.6,clip:.35},lh:[3,4,5],gate:0,sub:0,perc:.8,lfo:[['Lead cutoff',0,16,.4],['Delay feedback',1,8,.25]]};
LPRE['Bleep']={pg:1.2,eng:'Sine',att:1,dec:.07,sus:0,cut:5000,envA:0,res:1,ds:.55,rs:.15,vib:0,uni:1};
LMOOD.Bleep=['Bleep','Space blip','Mini sparkle','Square chip','Bleep','FM bell'];
MTRIM.Bleep=Object.assign({},MTRIM.Dark);
$('#mood').add(new Option('Bleep','Bleep'));
{const _g77=generate;generate=function(){_g77();if(curMood!=='Bleep')return;
 const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],PD_=TR[5],B=TR[6];
 Object.assign(K,{st:16,h:4,r:0,m:false});K.pt=pat(K);
 Object.assign(H,{st:16,h:pick([3,4,5]),r:2,ten:pick([0,.2]),acc:.6,gho:.12,vari:.3,m:false});H.pt=pat(H);
 Object.assign(C,{st:32,h:1,r:pick([12,28,22]),lv:C.lv*.6,m:R()<.5});C.pt=pat(C);
 // perc = tuned blips: short FM pings that follow the key
 Object.assign(P,{st:pick([12,20,24,28]),h:pick([2,3]),r:Math.floor(R()*5),ten:pick([0,.3,.5]),m:R()<.25});P.pt=pat(P);
 Object.assign(P.p,{oct:pick([5,6]),ratio:pick([2,3.5,1.41,5]),mdec:.04,bend:0,noise:.05,filt:pick([3000,6000,9000]),ds:.5,rs:.15});
 // lead = dry little bleeps, mostly rests
 // funky bleep riffs: syncopated 16th templates, a repeating 1–2 bar motif on chord tones with octave pops
 // sparse, mysterious: a few syncopated notes over two bars, lots of space and echo, the odd octave leap
 {const A=['0010000100000010','0000100000100100','1000000100000000','0001000000100001','0000001001000000','0010000000010010','0000000100100000'],B=['0000000000000000','0000000000100000','0000001000000000','0000000000000100'];
  const t=pick(A)+pick(B);Object.assign(L,{st:32,r:0,ten:0,lv:.36,m:R()<.12});L.pt=t.split('').map(Number);L.h=L.pt.reduce((a,b)=>a+b,0);
  Object.assign(L.p,{mode:'Motif',len:pick([4,6,8]),dv:.94,lock:.75,range:2,spread:.5,bias:.3,glide:pick([0,.15]),acc3:.3,accp:.2,ds:.7,rs:.35,cut:Math.min(L.p.cut||2000,1800)});}
 // pad barely there, bass small and clipped
 PD_.m=R()<.5;PD_.lv=.14;Object.assign(PD_.p,{bars:4,size:3,cut:Math.min(PD_.p.cut,500)});
 // groovy minimal basslines: hand-made syncopated 16th templates, rolling, or a pushed Euclid — with slides, ghosts, gate and octave/fifth moves
 {const TPL=['0010001000100110','0011001000110010','0001001001001010','0010010010010010','0110001001100011','0001000100101001','0010001100100101','0000101000101011','0100001001000110','0010000100100100'];
  const r=R();Object.assign(B,{st:16,r:0,m:false,ten:0});
  if(r<.6){const t=pick(TPL);B.pt=t.split('').map((c,i)=>+c&&!(R()<.25&&i%4===3)?1:0);B.h=B.pt.reduce((a,b)=>a+b,0);B.p.blk='Free'}
  else if(r<.7){B.h=6;B.pt=pat(B);B.p.blk='Offbeats'}
  else{Object.assign(B,{h:pick([5,6,7]),r:pick([1,2,3]),ten:pick([.3,.45])});B.pt=pat(B);B.p.blk=pick(['Free','Around kick'])}
  Object.assign(B.p,{bgt:pick([.25,.35,.5,.7]),bsl:pick([0,.15,.3,.45]),bgh:pick([0,.25,.4]),bph:pick([1,2,2,4]),dec:.14,cut:pick([380,480,620]),envA:pick([1.2,1.8,2.6]),res:pick([3,5,8]),sub:.55,oct:1,fifth:pick([.1,.25,.35]),jump:pick([.05,.15,.25]),bdrv:pick([0,.15,.3]),sqm:pick([0,0,.35])});
  G.bstyle=R()<.25?'funk':'';G.bavoid=false}
 G.swing=.14+R()*.06;G.dens=Math.min(G.dens||0,.1);G.shim=0;buf=[];mot=[];mp=-1;build()}}
