/* ---- v82: The Touch refined — each Launch picks a flavour (Filter disco, Robot, Sunny); disco bass templates, chopped chord-stab loops, lead only on some Launches ---- */
LPRE['Talkbox']={pg:1.2,eng:'Vowel',vow:1,uni:2,usp:8,wid:.4,ft:'LP12',cut:1800,envA:1200,res:3,att:4,dec:.25,sus:.5,kt:.4,drv:.35,ds:.25,rs:.2,vib:10,vibr:5.5,glide:.35,gt:70};
LPRE['Sunny keys']={pg:1.1,eng:'FM',fmr:1,fmi:1.2,fenv:.5,ft:'LP12',cut:2400,envA:800,res:1,att:2,dec:.5,sus:.3,kt:.3,ds:.2,rs:.35,vib:0,uni:1,wid:.5};
{const BT=['1010001010100010','1001001010010010','1011001010110010','1000101010001010','1010101010101011','1001011010010110','1010001110100010'];
 const SL=['0010010000100100','1001001000100100','0010001100100010','1000100110001001','0010100000101000','1001000010010000'];
 const toArr=s=>s.split('').map(Number),cnt=a=>a.reduce((x,y)=>x+y,0);
 const FL={
  'Filter disco':{bass:{bstyle:'octave',bgt:.5,bsl:.1,bgh:.3,cut:800,res:5},stab:{cut:900,envA:2000,res:6,fdec:.16,swd:.65,swb:8,sws:0,drv:.3,dec:.14,eko:.1,air:0,wave:.2,size:4},
   lead:['Square chip','Pluck'],lmode:'Motif',pad:0,duck:1,lfo:['Master low-pass',0,32,.6]},
  Robot:{bass:{bstyle:'funk',bgt:.35,bsl:.35,bgh:.25,cut:650,res:8},stab:{cut:1300,envA:2600,res:9,fdec:.08,swd:.5,swb:2,sws:3,drv:.55,dec:.08,eko:.15,air:.15,wave:.5,size:3},
   lead:['Talkbox','Vowel'],lmode:'Motif',pad:0,duck:.85,lfo:['Lead cutoff',3,4,.5]},
  Sunny:{bass:{bstyle:'funk',bgt:.7,bsl:.15,bgh:.15,cut:1000,res:2},stab:{cut:2300,envA:1200,res:2,fdec:.3,swd:0,swb:4,sws:0,drv:.05,dec:.26,eko:.22,air:0,wave:0,size:4},
   lead:['Sunny keys','FM keys','Organ'],lmode:'Chord arp',pad:1,duck:.6,lfo:['Master low-pass',0,64,.25]}};
 const _g82=generate;generate=function(){_g82();if(curMood!=='The Touch')return;const nm=pick(['Filter disco','Filter disco','Filter disco','Robot','Sunny']),F=FL[nm];G.touchFl=nm;
  const B=TR[6],ST=TR[8],L=TR[4],PD_=TR[5];
  // disco bass
  const bt=toArr(pick(BT));Object.assign(B,{st:16,r:0,ten:0,m:false,pt:bt,h:cnt(bt)});G.bstyle=F.bass.bstyle;G.bavoid=false;
  Object.assign(B.p,{blk:'Free',bph:pick([2,4]),bgt:F.bass.bgt,bsl:F.bass.bsl,bgh:F.bass.bgh,dec:.17,cut:F.bass.cut,envA:2.2,res:F.bass.res,sub:.45,oct:1,fifth:.1,jump:0,bdrv:nm==='Robot'?.35:.1});
  // chopped chord-stab loop
  const sl=toArr(pick(SL));Object.assign(ST,{st:16,r:0,ten:0,m:false,pt:sl,h:cnt(sl),lv:.62});Object.assign(ST.p,F.stab,{oct:4,etm:3,efb:.35,wid:.6,ds:.1,rs:.15});
  // lead only on some Launches
  const on=R()<.35;L.m=!on;if(on){applyLP(pick(F.lead),1);Object.assign(L,{st:16,h:pick([3,4,5]),r:pick([0,2,3]),lv:.4});L.pt=pat(L);Object.assign(L.p,{mode:F.lmode,len:pick([8,16]),dv:.95,lock:.85,range:1,spread:.15})}
  PD_.m=!F.pad;if(F.pad){PD_.lv=.32;PD_.p.patch=pick(['Organ','Tape','Strings'])}
  G.duck=F.duck;Object.assign(LFOS[0],{tg:F.lfo[0],sh:F.lfo[1],sync:1,div:F.lfo[2],d:F.lfo[3],ph:0});if(typeof lfoUI==='function')lfoUI();
  buf=[];mot=[];mp=-1;build()}}
/* ---- v83: The Touch, round two — shuffled live-loop groove, French-touch harmony (minor 7th vamps, two-chord loops with a passing chord, borrowed chords), sample-chopped stabs, Filter disco favoured ---- */
{const M=MOODS['The Touch'];if(M){M.sc=['Dorian','Minor','Dorian','Major'];M.sh=['7','9','7','add9'];M.hr=.45;
  M.pr=[[0,3,0,3],[0,'IV',0,'IV'],[0,6,0,6],[0,'bVII',3,0],[1,4,1,4],[0,3,0,2],[0,5,3,4],[3,'iv',0,0],[0,2,3,'iv'],[5,4,0,0],[0,0,3,'bVII'],[1,1,4,'bVII']]}
 const _g83=generate;generate=function(){_g83();if(curMood!=='The Touch')return;
  const K=TR[0],H=TR[1],C=TR[2],S=TR[7],ST=TR[8];
  // live-loop groove: shuffled 16th hats with accents and ghosts, open offbeats, ghosted claps, swing
  Object.assign(K,{st:16,h:4,r:0,m:false});K.pt=pat(K);
  Object.assign(H,{st:16,h:pick([12,14,16]),r:0,ten:pick([0,.15]),acc:.75,gho:.2,vari:.35,m:false});H.pt=pat(H);Object.assign(H.p,{open:.32,dec:.045,acc:.35});
  Object.assign(C,{st:16,h:2,r:4,acc:0,gho:.3,vari:.4,m:false});C.pt=pat(C);S.m=true;
  G.swing=.1+R()*.05;
  // chopped-record stabs
  ST.p.chop=G.touchFl==='Sunny'?.35:G.touchFl==='Robot'?.6:.75;build()};
}
/* ---- v84: The Touch rebuilt around the classic French-house recipe — a filtered, pumping disco chord LOOP (gated sustained 7th/9th chords on the pad), octave disco bass, straight-ish 4/4 with offbeat open hats and claps, big master filter sweeps; flavours only change the loop sound ---- */
{const LOOP=['1101101101101101','1011011010110110','1101011011010110','1001101110011011','1110111011101110','1011101110111011'].map(s=>s.split('').map(Number));
 const SND={'Filter disco':['Strings','Brass','Strings'],Robot:['PWM','Brass'],Sunny:['Organ','Tape','Strings']};
 const _g84=generate;generate=function(){_g84();if(curMood!=='The Touch')return;const fl=G.touchFl||'Filter disco';
  const K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],PD_=TR[5],B=TR[6],S=TR[7],ST=TR[8];
  G.swing=.02+R()*.03;
  // drums: four to the floor, open hat on every offbeat, quiet 16th tick, clap on 2 and 4
  Object.assign(K,{st:16,h:4,r:0,ten:0,acc:0,gho:0,vari:0,m:false});K.pt=pat(K);
  Object.assign(H,{st:16,h:4,r:2,ten:0,acc:0,gho:.35,vari:.15,m:false});H.pt=pat(H);Object.assign(H.p,{open:.9,dec:.05,acc:.2});
  Object.assign(C,{st:16,h:2,r:4,ten:0,acc:0,gho:.1,vari:.15,m:false});C.pt=pat(C);S.m=true;P.m=true;
  // the loop: sustained 7th/9th chords chopped in a disco rhythm, pumping with the kick
  Object.assign(PD_,{m:false,lv:.55});Object.assign(PD_.p,{patch:pick(SND[fl]),bars:pick([1,2]),size:4,pgate:.75,pgpat:pick(LOOP),att:.02,rel:.15,trem:0,apan:.1,open:.35,lfo:.15});
  pshape=prog.map(()=>pick(['7','9','7']));
  // octave disco bass on the root, 8ths or 16ths
  Object.assign(B,{st:16,h:pick([8,8,16]),r:0,ten:0,m:false});B.pt=pat(B);G.bstyle='octave';G.pedal=false;G.bavoid=false;
  Object.assign(B.p,{blk:'Free',bph:1,bgt:.55,bsl:0,bgh:0,dec:.15,cut:950,envA:2,res:3,sub:.5,oct:1,fifth:0,jump:0,bdrv:.1,sqm:0});
  // stabs only as a light accent, mostly off
  ST.m=R()<.7;Object.assign(ST.p,{chop:.3,swd:0,dec:.12,cut:1800,res:4,eko:.08});
  // lead: rare, Talkbox-ish
  L.m=R()<(fl==='Robot'?.5:.8);
  // the French-house moves: heavy pump and a big filter sweep over the whole mix
  G.duck=1;Object.assign(LFOS[0],{tg:'Master low-pass',sh:0,sync:1,div:pick([32,64]),d:fl==='Sunny'?.35:.65,ph:0});Object.assign(LFOS[1],{d:0});if(typeof lfoUI==='function')lfoUI();
  buf=[];mot=[];mp=-1;build()}}
/* ---- v85: The Touch mood removed from the mood list ---- */
{const s=$('#mood'),o=[...s.options].find(x=>x.value==='The Touch');if(o){if(s.value==='The Touch')s.value='Dark';o.remove()}}
