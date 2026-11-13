
/* ---- v0.23: mood refinement pass. Fewer cluttered or cheesy launches, clearer identity per mood, levels fixed per mood. Reference points: each mood's own genre and era.
   Only existing parameters are set; everything stays editable by hand. ---- */
{// harmony data
 try{MOODS.Dark.pr=[[0,0,0,0],[0,0,0,1],[0,1,0,1],[0,0,5,0],[0,0,0,3]];MOODS.Tense.md=['Motif','Interval','Motif'];
  MOODS.Drone.sc=['Phrygian','Minor','Phrygian'];MOODS.Drone.pr=[[0,0,0,0]];
  const D=window.HARMDARK&&HARMDARK();if(D){D.Dark={phrygian:.4,hypnotic:.6};delete D.Drone}}catch(e){console.warn('[orbitron] v023 data',e)}
 const CFG={
  Dark:{mute:{3:.35,5:.4},ban:['Pluck','Mini bass','Clean','Cinematic arp'],pool:['Reese','Hollow BP','Metal FM','Techno stab','Mini lead'],lvl:{1:3,4:2}},
  Tense:{mute:{5:.7,3:.3},ban:['Cinematic arp','Square chip'],pool:['Hollow BP','Mini edge','Metal FM','Techno stab'],banPad:['Brass'],padPool:['Hollow','Air'],lvl:{4:3}},
  Power:{mute:{5:.7}},
  Drone:{mute:{2:.5,3:.4}},
  'Groove Techno':{ban:['Supersaw'],pool:['Techno stab','Hollow BP','Metal FM','Clean']},
  Acid:{mute:{5:.65}},
  Melancholic:{mute:{3:.4},thin:.4},
  Dreamy:{ban:['Cinematic arp','Supersaw'],pool:['Pluck','Glass','Soft sine','FM keys']},
  Ethereal:{mute:{2:.7,3:.6}},
  Hopeful:{banPad:['PWM','Brass'],padPool:['Strings','Glass','Poly'],lvl:{1:4,4:3,5:5}},
  Noir:{mute:{4:.65}},
  Italo:{banPad:['Brass'],padPool:['Poly','PWM'],lvl:{1:4,4:3}},
  Vector:{ban:['Square chip','Mini acid'],pool:['Pluck','Glass','FM keys','Mini sparkle'],lvl:{1:3,4:2}}};
 const ring=(T,st,h,r)=>{T.st=st;T.h=Math.max(1,Math.min(h,st));T.r=((r||0)%st+st)%st;T.pt=pat(T)};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const m=curMood,C=CFG[m]||{},L=TR[4],PD=TR[5],S=TR[8],B=TR[6],P=L.p,acid=P.mode==='Acid 303';
   // which tracks play: optional parts drop out per mood, but a hook always stays
   for(const k in (C.mute||{})){if(+k===4&&(S.m&&PD.m))continue;if(R()<C.mute[k])TR[k].m=true}
   if(L.m&&S.m&&PD.m)PD.m=false;
   // sounds
   if(C.ban&&!L.m&&!acid&&C.ban.includes(P.patch)){const ok=C.pool.filter(n=>typeof LPRE!=='undefined'&&LPRE[n]);if(ok.length)applyLP(pick(ok),1)}
   if(C.banPad&&C.banPad.includes(PD.p.patch))PD.p.patch=pick(C.padPool);
   // lead density
   if(C.thin&&!L.m&&!acid){const h=Math.max(2,Math.round(L.st*C.thin));if(L.h>h){L.h=h;L.pt=pat(L)}}
   // mood specifics
   if(m==='Tense'&&!L.m&&!acid){if(P.mode==='Marbles')P.mode='Motif';P.len=pick([2,3,4]);P.dv=.97;P.range=1;buf=[];mot=[];mp=-1}                 // Loop techno: short repeating motifs
   if(m==='Breaks'&&!L.m&&!acid){ring(L,16,3,pick([2,6,10]));P.len=3}                                                                        // a short phrase, not one note a bar
   if(m==='Hopeful'&&!L.m&&!(P.rdr>0)&&R()<.5)P.rdr=8;                                                                                         // the arp keeps evolving
   if(m==='Melodic House'){const K3=TR[3];
    // marimba in about 1 Launch in 3 (it was every Launch), and darker when it plays
    if(R()<.65){try{window.setPercSound&&setPercSound('Blip')}catch(e){}}else{K3.p.filt=pick([1800,2200,2600]);K3.p.wtn=0;K3.lv=Math.min(K3.lv,.42)}
    // no random pad gate (it chopped the pad on odd timing): cinematic = never; hook = sometimes an even off-beat pump
    if(G.mhFlav==='hook'&&R()<.25){PD.p.pgate=.5;PD.p.pgpat=[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1]}else PD.p.pgate=0}
   if(m==='Melodic House'&&G.mhFlav==='hook'){B.p.bns=pick(['Chord tones','Melodic']);const h=Math.max(2,Math.round(L.st*.4));if(!L.m&&L.h>h){L.h=h;L.pt=pat(L)}} // Hook house: the bass carries the hook
   if(m==='Distorted Electro'&&G.deFlav==='techno'&&R()<.35&&!acid){L.m=false;ring(L,16,pick([5,6]),pick([0,3]));Object.assign(P,{mode:'Motif',len:4,dv:.98,range:1,lock:1});buf=[];mot=[];mp=-1;
    const F=LFOS[0];if(F)Object.assign(F,{tg:'Lead cutoff',sh:0,sync:1,div:32,d:.4,ph:0})}                                                      // Electro: one driven riff, slowly filtered
   // levels (dB on the mood trim)
   for(const k in (C.lvl||{}))TRIM[k]=(TRIM[k]||0)+C.lvl[k];
  }catch(e){console.warn('[orbitron] v023 refine',e)}
  try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync();if(typeof lfoUI==='function')lfoUI()}catch(e){}},0);return r}}
