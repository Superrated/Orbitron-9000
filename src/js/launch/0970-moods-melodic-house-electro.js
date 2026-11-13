/* ---- v142: three new moods — Melodic House (bright marimba-hook tech house or dark cinematic), Distorted Electro (raw overdriven riffs or
   disco-rock drive, gritty but level-matched), Ambient (beatless drift) — and the existing moods use the new pattern tools: polymeter rings,
   Rotate drift, the new arp modes, Cycle + Reset on bar, and a slow LFO 3 ---- */
{MOODS['Melodic House']={sc:['Minor','Dorian','Minor','Min pentatonic'],pr:[[0,5,2,6],[0,3,5,4],[0,5,3,6],[0,2,5,4],[0,5,6,4]],sh:['7','add9','9','tri'],b:[120,124],cut:800,sw:1500,att:.3,lh:[6,7,9],sp:.3,bias:.45,dv:.92,md:['Motif','Pedal arp','Converge','Marbles'],wave:.3,dec:.22,res:3,pt:['Strings','Warm saw','Tape','Bell pad','Poly'],hat:[[16,4,2],[16,6,2]],kick:{pitch:50,dec:.4,punch:4,drive:1.8},duck:.6,grit:.04,padlv:.3,mute:[7,8],hr:.12};
 MP['Melodic House']={sty:'Melodic tech house',b:[120,124],sw:[.06,.1],gr:.6,kick:{pitch:50,dec:.4,punch:4,drive:1.8,click:.7},hat:{tone:9000,dec:.045,open:.3,acc:.5,metal:.35},hp:[[16,4,2],[16,6,2],[16,7,1]],clap:{tone:1500,spread:12,tail:.3,rv:.35},cl:.6,sn:0,
  fx:{rumble:.05,rcut:140,rfeed:1,dly:.35,fb:.5,dt:.75,rev:.4,shim:.4,dens:.3,duck:.65,bgrit:.03,glue:.5,clip:.3},lh:[6,7,9],gate:0,perc:.6,lfo:[['Lead cutoff',0,16,.3],['Delay mix',1,32,.2]]};
 LMOOD['Melodic House']=['Pluck','FM keys','FM bell','Glass','Mini sparkle','Soft sine','Pluck'];MTRIM['Melodic House']=Object.assign({},MTRIM.Melancholic);
 MOODS['Distorted Electro']={sc:['Phrygian','Minor','Phrygian'],pr:[[0,0,0,0],[0,0,0,1],[0,0,3,0],[0,0,0,3],[0,0,0,0]],sh:['tri','quart','sus4'],b:[126,132],cut:900,sw:900,att:.1,lh:[2,3,4],sp:.2,bias:.3,dv:.97,md:['Motif','Interval'],wave:.7,dec:.18,res:6,pt:['Hollow','Air','Warm saw'],hat:[[16,8,1],[16,4,2]],kick:{pitch:50,dec:.32,punch:7,drive:5},duck:.72,grit:.25,padlv:.18,mute:[8,9],hr:0};
 MP['Distorted Electro']={sty:'Distorted electro',b:[126,132],sw:[0,.02],gr:.45,kick:{pitch:50,dec:.32,punch:7,drive:5,click:1.3},hat:{tone:9500,dec:.035,open:.15,acc:.6,metal:.7},hp:[[16,8,1],[16,4,2],[16,12,0]],clap:{tone:1700,spread:8,tail:.2,rv:.2},cl:.7,sn:1,
  fx:{rumble:.1,rcut:150,rfeed:1,dly:.2,fb:.4,dt:.75,rev:.25,shim:.1,dens:.1,duck:.72,bgrit:.3,glue:.6,clip:.5},lh:[2,3,4],gate:0,lfo:[['Lead cutoff',1,8,.45],['Bass cutoff',0,16,.3]]};
 LMOOD['Distorted Electro']=['Aggro','Mini edge','Techno stab','Reese','Mini wobble'];MTRIM['Distorted Electro']=Object.assign({},MTRIM.Tense);
 MOODS.Ambient={sc:['Lydian','Major pentatonic','Sus pentatonic','Dorian','Major'],pr:[[0,4,0,3],[0,2,4,2],[0,3,0,4],[0,5,3,4],[0,1,0,4]],sh:['add9','sus2','quart','9'],b:[84,96],cut:900,sw:2500,att:.8,lh:[3,4],sp:.4,bias:.55,dv:.85,md:['Turing loop','Converge','Diverge','Up/Down'],wave:.1,dec:.6,res:2,pt:['Air','Glass','Choir','Cloud','Bell pad','Strings'],duck:.2,grit:0,padlv:.55,mute:[0,1,2,6,7,8],hr:0};
 MP.Ambient={sty:'Ambient drift · no beat',b:[84,96],sw:[0,.03],gr:.4,kick:{pitch:45,dec:.6,punch:1,drive:0,click:.1},hat:{tone:11000,dec:.03,open:.1,acc:.4,metal:.1},hp:[[16,3,1]],clap:{tone:2000,spread:16,tail:.6,rv:.6},cl:.2,sn:0,
  fx:{rumble:0,rcut:100,rfeed:1,dly:.4,fb:.6,dt:1.5,rev:.7,shim:1.2,dens:.9,duck:.2,bgrit:0,glue:.3,clip:.1},lh:[3,4],gate:0,sub:1,perc:.45,lfo:[['Pad cutoff',0,32,.4],['Delay feedback',1,16,.25]]};
 LMOOD.Ambient=['Glass','Soft sine','FM bell','Mist','Mini flute','Space blip'];MTRIM.Ambient=Object.assign({},MTRIM.Ethereal);
 ['Melodic House','Distorted Electro','Ambient'].forEach(m=>$('#mood').add(new Option(m,m)));
 // more of the new arp modes in existing moods
 try{MOODS.Melancholic.md.push('Converge');MOODS.Noir.md.push('Turing loop');MOODS.Tense.md.push('Diverge');MOODS.Ethereal.md.push('Turing loop','Converge');MOODS.Hopeful.md.push('Pedal arp')}catch(e){}
 const ring=(T,st,h,r,ten)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;if(ten!=null)T.ten=ten;T.pt=pat(T)};
 const euclid=T=>{try{const q=pat(T);return T.pt.length===q.length&&T.pt.every((v,i)=>!!v===!!q[i])}catch(e){return false}};
 const lf3=(tg,sh,div,d)=>Object.assign(LFOS[2],{tg,sh,sync:1,div,d,ph:0});
 const bs=n=>{try{window.bassStyle&&bassStyle(n)}catch(e){}};
 // pattern emphasis for the existing moods: [chance, options]
 const EMP=window.EMPX={Dark:{lead:[.35,[12,14]],perc:[.5,[7,11,13]],rdr:[[3,8,.5]],lfo3:[.4,['Master low-pass',0,128,.25]]},
  Tense:{lead:[.4,[12,14]],rdr:[[3,4,.4],[4,8,.3]]},
  Drone:{lead:[.6,[12,14,15]],perc:[.7,[7,11,13]],rdr:[[3,8,.6],[1,16,.3]],lfo3:[.4,['Master low-pass',0,64,.25]]},
  Bleep:{rdr:[[1,8,.35]],lfo3:[.3,['Delay feedback',0,64,.25]]},
  'Deep Space':{perc:[.5,[7,9,11]],lead:[.3,[12,14]],lfo3:[.6,['Reverb mix',0,128,.3]]},
  Noir:{perc:[.4,[12,14]],rdr:[[8,8,.5]],lfo3:[.4,['Delay feedback',0,64,.2]]},
  Ethereal:{lead:[.3,[12,14]],lfo3:[.6,['Pad cutoff',0,64,.35]]},
  Melancholic:{lfo3:[.4,['Master low-pass',0,64,.15]]},
  Hopeful:{run:.45},Dreamy:{nrep:.3,lfo3:[.4,['Reverb mix',0,64,.25]]},
  Acid:{perc:[.4,[12,14]],rdr:[[1,8,.3]]}};
 const _gm=generate;generate=function(){const r=_gm.apply(this,arguments);try{const m=curMood,K=TR[0],H=TR[1],C=TR[2],P=TR[3],L=TR[4],PD=TR[5],B=TR[6];LFOS[2].d=0;
  if(m==='Melodic House'){const hook=R()<.5;G.mhFlav=hook?'hook':'cinematic';
   ring(K,16,4,0);ring(P,pick([12,10,12,6]),pick([4,5,3]),pick([1,2,3]),pick([0,.2]));Object.assign(P.p,{oct:5,ratio:pick([4,3.5,4]),mdec:.05,bend:0,noise:.02,filt:pick([4000,5000,6000]),ds:.35,rs:.25});P.m=false;P.lv=.5;
   if(hook){G.bpm=121+Math.floor(R()*4);ring(L,16,pick([7,9]),2,.3);Object.assign(L.p,{mode:pick(['Motif','Pedal arp','Motif']),len:pick([4,6,8]),dv:.95,range:2,lock:.75});PD.lv=.3;Object.assign(PD.p,{bars:2});bs(pick(['Syncopated','Off-beat','Octave bounce']))}
   else{G.bpm=118+Math.floor(R()*4);ring(L,16,5,pick([0,2]),.2);Object.assign(L.p,{mode:pick(['Converge','Turing loop','Motif']),len:pick([6,8]),dv:.9,range:2,lock:.7});L.lv=(L.lv||.45)*.85;PD.lv=.45;Object.assign(PD.p,{bars:4,att:.9,rel:3});
    P.m=R()<.4;bs(pick(['Pedal','Walking','Off-beat']));lf3('Master low-pass',0,128,.3);G.rev=Math.min(.6,(G.rev||.4)+.1);applyFX()}
   P.p.rdr=R()<.4?8:0}
  else if(m==='Distorted Electro'){const brk=R()<.5;G.deFlav=brk?'broken':'techno';
   /* v0.22 redo: two flavours. techno = dark electro-techno (4/4, driven bass riff, sparse distorted stabs);
      broken = electro breakbeat (808-style broken kick, 16th hats, acid-leaning bass). The bass riff is the hook; the lead only answers. */
   if(brk){G.bpm=127+Math.floor(R()*6);try{window.grooveFamily&&grooveFamily('electro')}catch(e){}if(K.h>=4)ring(K,16,3,0,pick([0,.1,.2]));
    bs(pick(['Syncopated','Acid run','Syncopated']));B.p.bns=pick(['Root + fifth','Chord tones','Auto'])}
   else{G.bpm=126+Math.floor(R()*5);ring(K,16,4,0);ring(H,16,pick([4,4,8]),2);H.p.open=pick([0,.15]);
    bs(pick(['Rolling 16ths','Syncopated','Gallop','Off-beat']));B.p.bns=pick(['Root','Root + fifth','Auto'])}
   // lead: a short stab or answer, not a riff
   ring(L,16,pick([2,2,3]),pick([3,6,10,11]),0);Object.assign(L.p,{mode:'Motif',len:2,dv:.98,range:1,lock:1,cyc:0,nrep:1});L.lv=(L.lv||.4)*.8;L.m=R()<.2;
   // pads mostly out; when in, dark and low
   PD.m=R()<.6;PD.lv=.18;
   // gritty but controlled: drive capped, loudness via the mood trim
   L.p.drv=Math.min(.45,Math.max(.25,L.p.drv||0));L.p.crush=Math.min(L.p.crush||0,.15);Object.assign(B.p,{bdrv:.3+R()*.15,bgr:.2+R()*.15,sqm:R()<.5?.3:0,res:Math.max(B.p.res||4,5)});
   C.m=false;C.lv=.7;TR[7].m=R()<.6;P.m=R()<.5;if(!P.m)ring(P,pick([12,14,16]),pick([2,3]),pick([1,3,7]))}
  else if(m==='Ambient'){G.bpm=84+Math.floor(R()*13);[0,1,2,6,7,8].forEach(k=>TR[k].m=true);TR[9].m=false;
   ring(P,pick([7,11,13]),pick([2,3]),Math.floor(R()*7));Object.assign(P.p,{oct:pick([5,6]),ratio:pick([3.5,5,7]),mdec:.25,bend:0,noise:0,filt:4000,dec:.9,ds:.5,rs:.6});P.m=false;P.lv=.4;P.p.rdr=4;
   ring(L,pick([10,12,14]),pick([3,4]),Math.floor(R()*5));Object.assign(L.p,{mode:pick(['Turing loop','Converge','Diverge','Up/Down']),len:pick([5,7,8]),dv:.9,range:2,lock:.6,dec:Math.max(L.p.dec||.5,1),rs:.6,ds:.45});L.lv=.3;L.m=false;L.p.rdr=8;
   if(['Converge','Diverge','Up/Down'].includes(L.p.mode))L.p.cyc=pick([0,5,6]);
   PD.m=false;PD.lv=.55;Object.assign(PD.p,{bars:4,rel:3});lf3('Master low-pass',0,256,.35);G.duck=.2}
  else if(EMP[m]){const E=EMP[m];
   if(E.lead&&R()<E.lead[0]&&L.p.mode!=='Acid 303'&&euclid(L)){const st=pick(E.lead[1]);ring(L,st,Math.max(2,Math.round(L.h*st/16)),L.r)}
   if(E.perc&&R()<E.perc[0]&&euclid(P)){const st=pick(E.perc[1]);ring(P,st,Math.max(2,Math.min(P.h,Math.round(st*.4))),Math.floor(R()*st))}
   (E.rdr||[]).forEach(([k,bars,c])=>{if(R()<c&&TR[k]&&TR[k].p)TR[k].p.rdr=bars});
   if(E.lfo3&&R()<E.lfo3[0])lf3(...E.lfo3[1]);
   if(E.run&&R()<E.run){Object.assign(L.p,{mode:'Up',cyc:pick([5,6,7]),rst:2,range:2})}
   if(E.nrep&&R()<E.nrep&&L.p.mode!=='Acid 303')L.p.nrep=2}
  if(MOODS[m]&&['Melodic House','Distorted Electro','Ambient'].includes(m)){$('#bpm').value=G.bpm;$('#bv').textContent=G.bpm;if(A.dl)A.dl.delayTime.value=(G.dt||.75)*60/G.bpm}
  try{window.leadResetPos&&leadResetPos()}catch(e){}
  build();if(typeof lfoUI==='function')lfoUI();setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}},0)}catch(e){console.warn('[orbitron] mood extras',e)}return r}}

