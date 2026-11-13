
/* v175: darker, moodier harmony and melodies in the dark/techno moods (about 70% of Launches; the rest keep the mood's own colour).
   Harmony families: cinematic minor (i–VI–III–VII, i–iv–VI–v), Phrygian/tense (i–bII), static/hypnotic (one or two chords, 7/9 colours),
   suspended (sus2/sus4/add9/quartal, never landing). Melodies: lower bias, short 2–4 note loops with high déjà vu, fewer and longer
   notes, and Motif lines that fall. Uses only existing settings (scale, progression, chord shapes, lead Bias/Loop len/Déjà vu/Hits/Decay);
   the key lock is respected. The "Now:" line names the harmony family. */
{const FAM={
  'cinematic minor':{sc:[['Minor',.7],['Harm. minor',.3]],pr:[[0,5,2,6],[0,3,5,4],[0,5,3,4],[0,6,5,6],[0,3,6,5]],sh:['7','9','tri','add9']},
  'phrygian':{sc:[['Phrygian',1]],pr:[[0,1,0,1],[0,0,1,0],[0,1,6,0],[0,6,1,0]],sh:['tri','sus4','7']},
  'hypnotic':{sc:[['Minor',.7],['Phrygian',.3]],pr:[[0,0,0,3],[0,0,5,5],[0,3],[0,0,0,6],[0,5]],sh:['7','9','quart']},
  'suspended':{sc:[['Minor',1]],pr:[[0,5,3,6],[0,6,3,0],[0,2,6,3]],sh:['sus2','sus4','add9','quart']}};
 window.HARMFAM=FAM;window.HARMDARK=()=>DARK;
 const DARK={Dark:{'cinematic minor':.3,phrygian:.3,hypnotic:.25,suspended:.15},Tense:{phrygian:.45,hypnotic:.3,suspended:.25},
  Noir:{'cinematic minor':.45,suspended:.3,hypnotic:.25},Power:{phrygian:.5,hypnotic:.5},'Groove Techno':{hypnotic:.5,phrygian:.3,suspended:.2},
  Temporal:{hypnotic:.6,phrygian:.4},Acid:{phrygian:.5,hypnotic:.5},
  Melancholic:{'cinematic minor':.6,suspended:.4},Drone:{hypnotic:.6,phrygian:.4}};
 const wpick=o=>{let u=R(),t=0;const e=Object.entries(o);for(const[k,w]of e){t+=w;if(u<t)return k}return e[e.length-1][0]};
 const wpk=a=>{let u=R(),t=0;for(const[k,w]of a){t+=w;if(u<t)return k}return a[a.length-1][0]};
 window.darkHarmony=(fam)=>{const F=FAM[fam];if(!F)return false;
  if(!G.keyLock){G.scale=wpk(F.sc);const sc=document.getElementById('scale');if(sc)sc.value=G.scale}
  const T=TR[5];if((padStyle==='Progression'||padStyle==='Pedal chords')&&prog.length>1){const pn=pick(F.pr),sp=pn.map(chordSpec);
   prog=sp.map(c=>c.d);PX=sp.map(c=>c.x);pshape=prog.map(()=>pick(F.sh));T.st=prog.length;T.h=T.st;T.pt=pat(T);pmean=null;PTOP=null;PD=null}
  else if(prog.length===1)pshape=[pick(F.sh)];
  // melody: lower, slower, short hypnotic loops, falling Motif lines
  const L=TR[4],P=L.p;if(!L.m&&P.mode!=='Acid 303'&&['Motif','Marbles','Interval','Turing loop'].includes(P.mode)){
   P.dv=Math.max(P.dv||0,.88);P.len=pick([2,3,4,4]);P.bias=Math.min(P.bias==null?.4:P.bias,.3);P.range=Math.min(P.range||2,2);
   if(L.h>4){L.h=Math.max(3,Math.round(L.h*.7));L.pt=pat(L)}P.dec=Math.min(2,(P.dec||.3)*1.25);
   if(P.mode==='Motif'){const n=SC[G.scale].length,top=Math.max(2,P.range*n),Ln=Math.round(P.len);let d=Math.min(top-1,n-1+pick([0,2]));mot=[];
    for(let i=0;i<Ln;i++){mot.push(Math.max(0,Math.min(top-1,d)));d+=pick([-1,-1,-2,-1,0,1])}mp=-1}}
  G.hfam=fam;return true};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);G.hfam=null;try{const m=DARK[curMood];if(m&&R()<.7){darkHarmony(wpick(m));build();setTimeout(()=>{try{window.syncFaders&&syncFaders();window.syncMenus&&syncMenus()}catch(e){}},0)}}catch(e){console.warn('[orbitron] dark',e)}return r}}
