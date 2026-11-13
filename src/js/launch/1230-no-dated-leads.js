
/* v171: no dated lead sounds from Launch. These patches stay in the lead patch menu, but Launch replaces them with a modern patch
   from the mood's own pool. Bleep keeps its "Bleep" (that is bleep techno). */
{const CHEESE=new Set([]); /* v0.22: the old dated patches were reworked (see end of file) and may be launched again */
 const POOL={Dark:['Mini lead','Clean','Metal FM','Reese','Hollow BP','Techno stab'],Melancholic:['Pluck','Glass','Mini lead','Clean','Soft sine'],
  Dreamy:['Soft sine','Glass','Pluck','Clean'],Tense:['Hollow BP','Mini edge','Metal FM','Reese','Mini acid','Techno stab'],Ethereal:['Soft sine','Glass','Pluck','Mist'],
  Hopeful:['Pluck','Soft sine','Clean','Glass','Mini lead'],Noir:['Reese','Mini lead','Clean','Metal FM','Hollow BP','Mist'],Drone:['Mini drone','Mist','Reese','Soft sine'],
  Italo:['Pluck','Mini edge','Clean','Hollow BP','Mini lead'],Breaks:['Pluck','Glass','Techno stab','Hollow BP'],'Deep Space':['Mini drone','Mist','Soft sine','Glass'],
  Bleep:['Hollow BP','Metal FM','Techno stab','Clean'],'Melodic House':['Pluck','Clean','Glass','Soft sine','Mini lead'],
  'Distorted Electro':['Mini edge','Aggro','Reese','Techno stab','Mini acid'],Ambient:['Mist','Soft sine','Glass','Mini drone'],
  'Groove Techno':['Techno stab','Hollow BP','Metal FM','Clean','Mini lead'],Vector:['Pluck','Glass','Clean','Hollow BP','Mini acid','Mini lead'],
  Temporal:['Metal FM','Hollow BP','Techno stab'],Power:['Reese','Mini edge','Techno stab']};
 const ok=(m,p)=>!(CHEESE.has(p)&&!(m==='Bleep'&&p==='Bleep'));
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],P=L.p;if(!L.m&&P.mode!=='Acid 303'&&P.patch&&!ok(curMood,P.patch)){
   const pool=(POOL[curMood]||['Pluck','Clean','Glass']).filter(n=>LPRE[n]);if(pool.length){applyLP(pick(pool),1);build()}}}catch(e){console.warn('[orbitron] lead taste',e)}return r};
 // Rave stab half as often
 try{for(const m in MOODX)(MOODX[m].lead||[]).forEach(a=>{if(a[0]==='Rave stab')a[1]/=2})}catch(e){}
 window.LEADTASTE={CHEESE,POOL}}
