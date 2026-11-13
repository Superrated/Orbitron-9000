/* ---- v0.36: one LFO picker for Launch. Earlier layers each pushed their own LFO onto Launch, so every mood landed on the same two
   targets almost every time, and sometimes on a muted lead or pad. Now, after everything else in Launch has run:
   · each mood has 3–5 hand-picked LFO recipes (target, rate, shape, depth); one is picked, never the same one twice in a row
   · how many LFOs run depends on the mood: sparse moods 0–1, spacey moods up to 3
   · about 1 launch in 6 swaps in a wildcard target from outside the mood's usual set
   · about 1 launch in 6 puts a Rhythm target (Perc / Hat / Lead / Stab hits) on the slow LFO, as before
   · a target only gets picked if its sound is playing (muted lead / pad / stab, reverb or delay at 0 → skipped)
   · sound-design sweeps stay: the arp's filter sweep and the Max Q stab / drone filtering are kept as they were made
   Everything lands on the normal LFO tab, so every pick stays editable there. ---- */
{const S=(tg,dv,sh,d)=>({tg,dv,sh,d});
 // dv: rate options in beats (4 = 1 bar, 64 = 16 bars), sh: shape options (0 sine 1 tri 2 saw up 3 saw down 4 square 5 S&H), d: depth range
 const LR={
  Dark:[[S('Master low-pass',[64,128],[0],[.25,.4])],[S('Lead cutoff',[16,32],[1],[.3,.45]),S('Rumble',[64],[0],[.3,.45])],
   [S('Master low-pass',[128],[0],[.25,.35]),S('Hat decay',[8,16],[1],[.3,.4])],[S('Bass cutoff',[32,64],[0],[.25,.4]),S('Reverb mix',[64],[0],[.2,.3])],
   [S('Lead resonance',[16],[5],[.3,.45]),S('Master low-pass',[64],[0],[.2,.3])]],
  Melancholic:[[S('Pad cutoff',[32,64],[0],[.3,.45]),S('Lead detune',[64],[0],[.2,.3])],[S('Lead cutoff',[32],[1],[.25,.35]),S('Shimmer',[64],[0],[.25,.35])],
   [S('Tape wobble',[32,64],[0],[.2,.3])],[S('Pad cutoff',[64],[0],[.3,.4]),S('Reverb mix',[128],[0],[.2,.3]),S('Lead cutoff',[16],[1],[.2,.3])]],
  Dreamy:[[S('Reverb mix',[64,128],[0],[.25,.35]),S('Pad cutoff',[32],[0],[.3,.4])],[S('Shimmer',[64],[0],[.3,.4]),S('Lead cutoff',[32],[1],[.25,.35])],
   [S('Tape wobble',[32],[0],[.2,.3]),S('Delay feedback',[64],[0],[.2,.3])],[S('Lead pan',[8,16],[0],[.4,.6]),S('Pad cutoff',[64],[0],[.25,.35])]],
  Tense:[[S('Master high-pass',[64],[2],[.3,.45])],[S('Lead cutoff',[8,16],[5],[.3,.45])],
   [S('Lead resonance',[16],[1],[.3,.4]),S('Master high-pass',[128],[2],[.25,.35])],[S('Hat decay',[8],[1],[.3,.4]),S('Bass cutoff',[32],[2],[.25,.35])]],
  Ethereal:[[S('Pad cutoff',[64],[0],[.3,.45]),S('Delay feedback',[32],[0],[.2,.3])],[S('Shimmer',[64,128],[0],[.3,.4]),S('Master low-pass',[128],[0],[.15,.25])],
   [S('Reverb mix',[64],[0],[.25,.35]),S('Lead pan',[16],[0],[.4,.6])],[S('Pad cutoff',[32],[1],[.3,.4]),S('Shimmer',[128],[0],[.25,.35]),S('Delay feedback',[64],[0],[.15,.25])]],
  Hopeful:[[S('Lead cutoff',[16,32],[1],[.3,.45])],[S('Pad cutoff',[32],[0],[.3,.4]),S('Stab echo',[16],[0],[.3,.4])],
   [S('Lead cutoff',[32],[0],[.3,.4]),S('Master low-pass',[128],[2],[.15,.25])],[S('Lead decay',[8,16],[1],[.3,.4]),S('Pad cutoff',[64],[0],[.25,.35])]],
  Noir:[[S('Stab cutoff',[16,32],[0],[.35,.5]),S('Delay feedback',[64],[0],[.2,.3])],[S('Stab echo',[16],[1],[.35,.45]),S('Reverb mix',[64],[0],[.2,.3])],
   [S('Tape wobble',[32],[0],[.2,.3]),S('Stab cutoff',[32],[1],[.3,.4])],[S('Lead cutoff',[32],[0],[.25,.35]),S('Delay feedback',[32],[0],[.25,.35])]],
  Drone:[[S('Lead cutoff',[64,128],[0],[.35,.5])],[S('Master low-pass',[128],[0],[.25,.35]),S('Rumble',[64],[0],[.3,.4])],
   [S('Perc FM',[16],[5],[.3,.4])],[S('Lead detune',[64],[0],[.25,.35]),S('Tape wobble',[64],[0],[.2,.3])],[]],
  Acid:[[S('Lead cutoff',[16,32],[0,1],[.4,.55])],[S('Lead cutoff',[8],[5],[.3,.4]),S('Lead resonance',[32],[0],[.25,.35])],
   [S('Bass cutoff',[32],[1],[.3,.4]),S('Master high-pass',[128],[2],[.2,.3])],[S('Lead resonance',[16],[1],[.3,.4]),S('Lead cutoff',[64],[0],[.35,.45])]],
  Power:[[S('Rumble',[32,64],[0],[.35,.5])],[S('Master low-pass',[64,128],[0],[.3,.4])],[S('Hat decay',[8,16],[1],[.3,.4]),S('Rumble',[64],[0],[.3,.4])],
   [S('Lead cutoff',[8],[5],[.45,.6])],[]],
  Italo:[[S('Lead cutoff',[16,32],[1],[.35,.45])],[S('Lead detune',[32,64],[0],[.25,.35]),S('Pad cutoff',[32],[0],[.25,.35])],
   [S('Bass cutoff',[16],[1],[.25,.35]),S('Lead cutoff',[32],[0],[.25,.35])],[S('Pad cutoff',[64],[0],[.3,.4]),S('Master low-pass',[128],[2],[.15,.25])]],
  Breaks:[[S('Bass cutoff',[16,32],[1],[.35,.5])],[S('Lead cutoff',[16],[5],[.3,.4]),S('Hat decay',[8],[1],[.25,.35])],
   [S('Bass cutoff',[32],[0],[.3,.4]),S('Master high-pass',[128],[2],[.2,.3])],[S('Clap tone',[8],[1],[.3,.4]),S('Bass resonance',[16],[0],[.25,.35])]],
  'Deep Space':[[S('Reverb mix',[64,128],[0],[.25,.35]),S('Delay feedback',[32],[0],[.2,.3])],[S('Master low-pass',[128],[0],[.25,.35]),S('Shimmer',[64],[0],[.25,.35])],
   [S('Tape wobble',[32],[0],[.2,.3]),S('Pad cutoff',[64],[0],[.25,.35]),S('Delay feedback',[128],[0],[.2,.3])],[S('Lead pan',[16],[0],[.4,.6]),S('Reverb mix',[128],[0],[.25,.35])]],
  Bleep:[[S('Delay feedback',[32,64],[0],[.3,.4])],[S('Lead cutoff',[8,16],[5],[.3,.4]),S('Hat decay',[16],[1],[.25,.35])],
   [S('Perc octave',[16],[4],[.3,.4])],[S('Hat tone',[16],[1],[.3,.4]),S('Delay feedback',[64],[0],[.2,.3])],[S('Lead decay',[16],[1],[.3,.4])]],
  'Melodic House':[[S('Lead cutoff',[32,64],[0],[.35,.45]),S('Pad cutoff',[64],[0],[.25,.35])],[S('Master low-pass',[128],[2],[.2,.3]),S('Tape wobble',[32],[0],[.15,.25])],
   [S('Pad cutoff',[32],[1],[.3,.4]),S('Lead pan',[16],[0],[.35,.5])],[S('Lead cutoff',[16],[1],[.25,.35]),S('Reverb mix',[64],[0],[.2,.3]),S('Bass cutoff',[64],[0],[.2,.3])]],
  'Distorted Electro':[[S('Bass cutoff',[16,32],[1],[.35,.5]),S('Lead cutoff',[32],[0],[.3,.4])],[S('Lead drive',[16],[1],[.3,.4])],
   [S('Bass drive',[16],[5],[.3,.4]),S('Hat decay',[8],[1],[.25,.35])],[S('Lead cutoff',[8],[5],[.35,.45]),S('Master high-pass',[128],[2],[.2,.3])]],
  Ambient:[[S('Pad cutoff',[64,128],[0],[.3,.4]),S('Delay feedback',[64],[0],[.2,.3]),S('Master low-pass',[256],[0],[.15,.25])],[S('Shimmer',[128],[0],[.3,.4]),S('Tape wobble',[64],[0],[.15,.25])],
   [S('Reverb mix',[128],[0],[.25,.35]),S('Pad cutoff',[64],[1],[.3,.4])],[S('Lead pan',[32],[0],[.4,.6]),S('Pad cutoff',[128],[0],[.3,.4]),S('Delay feedback',[64],[0],[.2,.3])]],
  'Groove Techno':[[S('Hat tone',[16,32],[1],[.35,.45])],[S('Hat decay',[8,16],[1],[.3,.4]),S('Master low-pass',[64],[0],[.2,.3])],
   [S('Perc decay',[16],[5],[.3,.4]),S('Hat tone',[32],[0],[.25,.35])],[S('Bass cutoff',[32],[0],[.25,.35]),S('Hat decay',[16],[1],[.3,.4]),S('Master high-pass',[128],[2],[.15,.25])]],
  Temporal:[[S('Hat decay',[8,16],[1],[.3,.4])],[S('Hat tone',[32],[0],[.3,.4]),S('Master low-pass',[128],[0],[.2,.3])],
   [S('Perc pan',[8],[0],[.4,.6])],[S('Perc decay',[16],[1],[.3,.4]),S('Delay feedback',[64],[0],[.2,.3])],[]],
  Vector:[[S('Lead cutoff',[32,64],[0],[.35,.45]),S('Delay feedback',[64],[0],[.2,.3])],[S('Master low-pass',[64,128],[0],[.25,.35])],
   [S('Pad cutoff',[64],[0],[.25,.35]),S('Lead pan',[16],[0],[.35,.5])],[S('Lead cutoff',[16],[1],[.25,.35]),S('Master low-pass',[128],[2],[.2,.3]),S('Delay feedback',[32],[0],[.2,.3])]]};
 // an empty recipe (no LFO) only comes up this often in the sparse moods
 const EMPTY_W=.35;
 const WILD=[S('Lead pan',[8,16],[0],[.35,.55]),S('Perc pan',[8,16],[0,1],[.35,.55]),S('Hat pan',[16,32],[0],[.3,.5]),S('Lead accent',[8,16],[1],[.3,.45]),
  S('Hat accent',[8],[1,5],[.3,.45]),S('Perc accent',[8,16],[5],[.3,.45]),S('Stab echo',[16,32],[0],[.3,.45]),S('Lead glide',[16],[1],[.3,.45]),S('Perc octave',[16],[4],[.3,.4]),
  S('Clap tone',[8,16],[1],[.3,.4]),S('Lead drive',[16,32],[1],[.25,.35]),S('Bass drive',[16,32],[1],[.25,.35]),S('Perc decay',[8,16],[5],[.3,.4]),S('Tape wobble',[32,64],[0],[.15,.25])];
 const SOFT=['Lead drive','Bass drive','Perc octave','Hat accent','Perc accent','Clap tone'];const NOWILD={Power:['Tape wobble','Lead glide'],Temporal:['Tape wobble'],'Groove Techno':['Tape wobble'],Ambient:SOFT,'Deep Space':SOFT,Ethereal:SOFT,Dreamy:SOFT,Melancholic:SOFT};   // no gritty wildcards in the spacey moods
 const on=k=>!!(TR[k]&&!TR[k].m);
 const live=tg=>{
  if(/^Lead/.test(tg))return on(4);if(/^Bass/.test(tg))return on(6);if(/^Pad/.test(tg))return on(5);if(/^Stab/.test(tg))return on(8);
  if(/^Hat/.test(tg))return on(1);if(/^Perc/.test(tg))return on(3);if(/^Clap/.test(tg))return on(2);
  if(tg==='Shimmer')return (G.shim||0)>.05;if(tg==='Reverb mix')return (G.rev||0)>.05;if(tg==='Delay feedback')return (G.dly||0)>.05;if(tg==='Rumble')return (G.rumble||0)>.02;
  return true};
 const HITS={'Perc hits':3,'Hat hits':1,'Lead hits':4,'Stab hits':8};
 const rnd=(a,b)=>+(a+R()*(b-a)).toFixed(2);
 const mk=sp=>({tg:sp.tg,div:pick(sp.dv),sh:pick(sp.sh),d:rnd(sp.d[0],sp.d[1])});
 const LAST=window.LFREC={};
 window.pickLaunchLFOs=function(){const m=curMood,rec=LR[m];if(!rec)return;
  // keep a sweep that is part of a sound: the arp's filter, Max Q stabs / drones
  let lock=null;const keepLead=on(4)&&(G.arpOn||(m==='Power'&&(G.pstyle==='stabs'||G.pstyle==='drone')));
  if(keepLead){const i=LFOS.findIndex(L=>L.d>0&&L.tg==='Lead cutoff');if(i>=0)lock={i,L:Object.assign({},LFOS[i])}}
  // pick a recipe: playable ones only, never the one from the last Launch in this mood
  const opts=rec.map((r,i)=>({i,r:r.filter(sp=>live(sp.tg)&&!(lock&&/^Lead (cutoff|resonance)/.test(sp.tg)))})).filter(o=>o.r.length||!rec[o.i].length);
  let pool=opts.filter(o=>o.i!==LAST[m]);if(!pool.length)pool=opts;
  const w=pool.map(o=>rec[o.i].length?1:EMPTY_W),tw=w.reduce((a,b)=>a+b,0);let x=R()*tw,ch=pool[pool.length-1];for(let k=0;k<pool.length;k++){x-=w[k];if(x<=0){ch=pool[k];break}}
  let specs=ch?ch.r.map(mk):[];if(ch)LAST[m]=ch.i;
  if(!ch||(!specs.length&&rec[ch.i].length))specs=[mk(S('Master low-pass',[64,128],[0],[.2,.3]))];
  const cap=Math.max(1,(ch&&rec[ch.i].length)||0);
  // wildcard, about 1 in 6
  if(specs.length&&R()<1/6){const used=new Set(specs.map(s=>s.tg)),no=NOWILD[m]||[];
   const wp=WILD.filter(sp=>live(sp.tg)&&!used.has(sp.tg)&&!no.includes(sp.tg)&&!(lock&&/^Lead/.test(sp.tg)));
   if(wp.length){const wsp=mk(pick(wp));if(specs.length>=2||lock)specs[specs.length-1]=wsp;else specs.push(wsp)}}
  if(lock&&specs.length>=cap)specs=specs.slice(0,Math.max(0,cap-1));
  // Rhythm target on the slow LFO, about 1 in 6 (as before)
  let hit=null;if(R()<1/6){const hp=Object.keys(HITS).filter(n=>on(HITS[n])&&!(n==='Lead hits'&&(lock||(TR[4].p.mode==='Acid 303'||TR[4].p.mode==='Riff'))));
   if(hp.length)hit={tg:pick(hp),div:pick([32,64]),sh:pick([0,1]),d:rnd(.5,.8)}}
  // place: slot 3 is the slow one (4 bars and up), the lock keeps its own slot
  LFOS.forEach(L=>{L.d=0});const free=[0,1,2].filter(i=>!(lock&&lock.i===i));
  if(lock)Object.assign(LFOS[lock.i],lock.L);
  const put=(i,s)=>Object.assign(LFOS[i],{tg:s.tg,sh:s.sh,sync:1,div:i===2?Math.max(16,s.div):s.div,d:s.d,ph:0});
  if(hit){if(free.includes(2)){put(2,hit);free.splice(free.indexOf(2),1)}else{put(free.pop(),hit)}if(specs.length>free.length)specs=specs.slice(0,free.length)}
  specs.sort((a,b)=>b.div-a.div);   // slowest first, so it takes slot 3
  specs.forEach(s=>{if(!free.length)return;const i=free.includes(2)&&s.div>=16?2:free.find(j=>j!==2)??free[0];free.splice(free.indexOf(i),1);put(i,s)});
  try{window.LF0=playing?Math.floor(tk/16)*16:0}catch(e){}
  if(typeof lfoUI==='function')lfoUI()};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{pickLaunchLFOs()}catch(e){console.warn('[orbitron] launch LFOs',e)}
  setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0);return r}}
