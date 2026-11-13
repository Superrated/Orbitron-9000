
/* ---- v0.5: MORE VARIETY IN AFTERGLOW AND LOST SIGNAL — these moods leaned on a few written riffs, one lead sound and four chord progressions.
   Launch now often turns the riff into a generated arp (chord arp, pedal arp, converge, diverge, motif or up/down, with its own ring and range),
   otherwise varies the riff's notes (same rhythm: up a chord tone, inverted or octave-flipped), picks from a wider set of lead sounds,
   and from a larger pool of 4-chord progressions. ---- */
{const VAR={'Melodic House':{riff:.3,prog:.45,snd:.4},Melancholic:{riff:.35,prog:.5,snd:.45}};
 const PROGS=[[0,5,3,4],[0,3,6,4],[0,5,6,4],[0,2,3,4],[5,3,0,4],[0,4,5,3],[0,6,3,5],[3,5,0,4],[0,3,4,6],[0,5,1,4],[0,2,5,4],[5,6,0,0],[0,6,5,4],[3,6,0,5],[0,5,2,6],[0,3,5,4]];
 const MODES=[['Chord arp',[8,12,16],[1,2]],['Pedal arp',[6,8,12],[1,2]],['Converge',[5,6,8],[2]],['Diverge',[5,6,8],[2]],['Motif',[3,4,5,6,7],[1,2,3]],['Up/Down',[6,8],[1,2]]];
 const SNDS={'Melodic House':['String pluck','Soft keys','Cinematic arp','Pluck','FM keys','Wide saw'],   /* v0.83: no House piano / Bright pluck / Chorus pulse (cheesy, too bright) */
  Melancholic:['String pluck','Soft keys','Cinematic arp','Pluck','FM keys','Wide saw','Mini lead']};
 const fillT=t=>{let l=t.find(x=>x!=null);if(l==null)l=0;return t.map(x=>x==null?l:(l=x))};
 const UP={0:2,1:2,2:4,3:4,4:10,10:12,11:12,12:14,14:14},INV={0:10,10:0,2:4,4:2,12:4,14:2};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(window.orbRiff)orbRiff.base=null;const v=VAR[curMood],L=TR[4],P=L.p;if(!v||L.m||P.mode==='Acid 303')return r;const RF=window.orbRiff;
   if(P.mode==='Riff'&&RF&&RF.t){
    if(R()<v.riff){const [md,hs,rg]=pick(MODES);P.mode=md;RF.t=null;RF.f=null;L.st=pick([16,16,12]);L.ten=0;L.r=pick([0,0,2,3]);L.h=Math.min(pick(hs),L.st);L.pt=pat(L);P.range=pick(rg);P.len=pick([3,4,6,8]);mot=[];mp=-1;buf=[]}
    else{const T=pick(['up','inv','oct','none']);if(T!=='none'){RF.base=JSON.stringify(RF.t);const nt=RF.t.map(x=>x==null?null:T==='up'?(UP[x]!=null?UP[x]:x):T==='inv'?(INV[x]!=null?INV[x]:x):(x<10?x+10:x-10));RF.t=nt;RF.f=fillT(nt)}}}
   if(R()<v.snd){const ok=SNDS[curMood].filter(n=>LPRE[n]);if(ok.length)applyLP(pick(ok),1)}
   if(prog.length===4&&R()<v.prog)prog=pick(PROGS).slice();
   try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){console.warn('[orbitron] variety',e)}return r}}
/* ---- v0.83: Lost Signal · Afterglow lead — never the cheesy bright sounds (a flavour can still pick them: they are swapped for a warmer one),
   and the lead cutoff stays at or below 1500 Hz so it sits under the pad instead of on top. ---- */
{const CHEESE=new Set(['House piano','Bright pluck','Chorus pulse','Rave stab','Organ stab','Hoover']),WARM=['Soft keys','String pluck','FM keys','Pluck'];
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(curMood!=='Melancholic'&&curMood!=='Melodic House')return r;const P=TR[4].p;
  if(CHEESE.has(P.patch)&&typeof applyLP==='function'&&typeof LPRE!=='undefined'){const ok=WARM.filter(n=>LPRE[n]);if(ok.length)applyLP(pick(ok),1)}
  if(P.mode!=='Acid 303'&&P.cut>1500)P.cut=1500;setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){console.warn('[orbitron] lead sync',e)}},0)}
 catch(e){console.warn('[orbitron] lost-signal lead',e)}return r}}
