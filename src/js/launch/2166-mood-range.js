/* ---- v0.4 mood range: moods that came out too alike from Launch to Launch get more room. All picks land on normal controls. ----
   · harmony: the moods without a harmony style now pick one 60% of the time (scale + chord progression only, the lead is left alone)
   · kick: the 4/4 moods sometimes get a few skipped or extra kicks through the kick's own Variation and Ghosts
   · drum feel: Ion Storm and Low Orbit get one now and then
   · tempo: Meteor Shower 164–176, Telemetry 120–133
   · Cowbell / rim sits 25% lower on Launch, Conga 13% lower; Marimba comes up in the melodic moods */
{const H=window.HARMFAM||{};
 Object.assign(H,{
  lifted:{sc:[['Major',.5],['Lydian',.3],['Mixolydian',.2]],pr:[[0,4,5,3],[0,3,4,4],[0,5,3,4],[0,4,1,5]],sh:['add9','9','sus2','tri']},
  dorian:{sc:[['Dorian',1]],pr:[[0,3,0,3],[0,1,3,4],[0,4,3,1],[0,0,3,3]],sh:['7','9','quart']},
  dreamy:{sc:[['Major',.5],['Lydian',.5]],pr:[[0,3],[0,1,3,4],[0,5,3,4],[0,2,3,0]],sh:['add9','sus2','9']},
  'minor glow':{sc:[['Minor',.6],['Dorian',.4]],pr:[[0,5,2,6],[0,3,4,0],[0,6,3,4],[0,5,6,4]],sh:['9','add9','7']}});
 const HM={Melancholic:{'minor glow':.6,dorian:.4},Dreamy:{dreamy:.6,lifted:.4},Ethereal:{dreamy:.5,'minor glow':.5},Hopeful:{lifted:.7,dreamy:.3},
  Drone:{hypnotic:.4,suspended:.3,dorian:.3},Italo:{'minor glow':.5,dorian:.5},Breaks:{dorian:.6,hypnotic:.4},'Deep Space':{suspended:.5,'minor glow':.5},
  Bleep:{dorian:.5,hypnotic:.5},'Melodic House':{'minor glow':.5,suspended:.3,lifted:.2},'Distorted Electro':{phrygian:.5,dorian:.5},
  Ambient:{dreamy:.5,suspended:.5},Vector:{'minor glow':.5,dorian:.5}};
 const wpk=o=>{const e=Array.isArray(o)?o:Object.entries(o);let u=R(),t=0;for(const[k,w]of e){t+=w;if(u<t)return k}return e[e.length-1][0]};
 const harm=fam=>{const F=H[fam];if(!F)return;if(!G.keyLock){G.scale=wpk(F.sc);const sc=document.getElementById('scale');if(sc)sc.value=G.scale}
  if((padStyle==='Progression'||padStyle==='Pedal chords')&&prog.length>1){const T=TR[5],sp=pick(F.pr).map(chordSpec);prog=sp.map(c=>c.d);PX=sp.map(c=>c.x);
   pshape=prog.map(()=>pick(F.sh));T.st=prog.length;T.h=T.st;T.pt=pat(T);pmean=null;PTOP=null;PD=null}else if(prog.length===1)pshape=[pick(F.sh)];G.hfam=fam};
 const KV={Dark:1,Drone:1,Power:1,'Groove Techno':1,Temporal:1};
 try{const X=window.MOODX||{};if(X['Distorted Electro'])X['Distorted Electro'].grv=[.45,'electro','broken techno'];else X['Distorted Electro']={grv:[.45,'electro','broken techno']};
  if(X.Ambient)X.Ambient.grv=[.3,'halftime','clave perc'];else X.Ambient={grv:[.3,'halftime','clave perc']};
  if(MP.Breaks)MP.Breaks.b=[164,176];if(MP.Bleep)MP.Bleep.b=[120,133];if(MOODS.Breaks)MOODS.Breaks.b=[164,176];if(MOODS.Bleep)MOODS.Bleep.b=[120,133]}catch(e){console.warn('[orbitron] mood range',e)}
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const m=curMood;
  if(HM[m]&&!G.hfam&&R()<.6)harm(wpk(HM[m]));
  if(KV[m]&&!TR[0].m&&R()<.4){const K=TR[0];K.vari=+(.12+R()*.18).toFixed(2);if(R()<.5)K.gho=+(.08+R()*.12).toFixed(2)}
  const MAR={'Melodic House':.25,Hopeful:.25,Dreamy:.25,Ethereal:.2,Melancholic:.2,Ambient:.25,'Deep Space':.2};
  if(MAR[m]&&!TR[3].m&&(TR[3].p.pv==='Blip'||TR[3].p.pv==='Conga')&&R()<MAR[m]&&window.setPercSound){setPercSound('Marimba');const P=TR[3].p;if(!(P.filt>0)||P.filt>3600)P.filt=3600}
  if(TR[3].p.pv==='Cowbell')TR[3].lv=+(TR[3].lv*.75).toFixed(2);
  if(TR[3].p.pv==='Conga')TR[3].lv=+(TR[3].lv*.87).toFixed(2)}catch(e){console.warn('[orbitron] mood range',e)}return r}}
/* v0.75: an older build id was set here and overrode the real one (see ORB_BUILD above) */
