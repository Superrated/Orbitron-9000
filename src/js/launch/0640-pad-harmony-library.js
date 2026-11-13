/* ---- v76: richer pad harmony — bigger per-mood progression library with borrowed / chromatic chords, harmonic rhythm (uneven chord lengths, pushed changes), smooth top line; pitched tracks follow chromatic chords ---- */
{const L={
 Dark:[[0,1,0,6],[0,5,6,0],[0,6,5,4],[0,1,5,6],[0,0,'bII',0],[0,3,0,'bII'],[0,5,'bII',0],[0,'iv',0,6],[0,6,0,'bII']],
 Melancholic:[[0,5,2,6],[0,3,6,2],[0,5,3,6],[0,6,5,6],[0,5,2,4],[0,3,5,6],[0,5,3,'V'],[0,2,5,'V'],[5,3,0,6],[0,'bII',5,'V']],
 Dreamy:[[0,4,5,3],[0,2,3,4],[0,3,0,4],[0,5,3,4],[1,4,0,5],[0,3,'iv',0],[3,4,2,5],[0,'bVII','IV',0],[5,1,4,0]],
 Tense:[[0,3,4,0],[0,1,4,0],[0,5,4,3],[0,6,4,3],[0,'bII',0,'bII'],[0,'bII',6,0],[0,0,'bV',0],[0,3,'bII',0]],
 Ethereal:[[0,2,4,2],[0,3,1,4],[0,1,3,2],[0,4,2,5],[0,'II',0,4],[0,'bVI','bVII',0],[3,0,4,0],[0,5,3,'bVII']],
 Hopeful:[[0,4,5,3],[0,3,4,0],[0,5,1,4],[0,2,3,4],[5,3,0,4],[0,4,5,'iv'],[3,4,5,5],[0,'bVI','bVII',0],[1,4,0,0]],
 Noir:[[0,5,1,4],[0,3,5,4],[0,6,2,5],[0,0,3,3],[0,0,5,5],[0,3,0,'bVII'],[0,'iv',0,'iv'],[0,6,0,3]],
 Drone:[[0,1,0,4],[0,4,3,4],[0,2,0,5],[0,0,0,1],[0,0,'bII',0],[0,0,0,0]],
 Acid:[[0,0,5,0],[0,1,0,6],[0,5,0,4],[0,0,'bII',0],[0,0,6,0],[0,3,0,0]],
 Italo:[[0,5,2,6],[0,3,6,2],[0,5,3,6],[0,6,5,4],[0,2,6,3],[0,5,6,'V'],[0,6,5,'V'],[5,6,0,0],[0,4,5,3]],
 'The Touch':[[0,3,0,3],[0,6,0,6],[0,3,4,3],[0,5,3,4],[1,4,0,5],[3,2,1,0],[0,'iv',0,'iv'],[3,'iv',0,0],[0,2,3,'iv']],
 Breaks:[[0,0,5,5],[0,5,0,6],[0,0,6,6],[0,0,0,5],[0,'bVI',0,'bVII'],[0,3,0,'bII']],
 'Deep Space':[[0,0,0,0],[0,4,0,4],[0,5,3,0],[0,2,0,5],[0,'II',0,0],[0,'bVI',0,'bIII'],[0,'III',0,0],[0,'bVI',0,0]]};
 for(const m in L)if(MOODS[m])MOODS[m].pr=L[m];
 const HR={Dark:.3,Melancholic:.45,Dreamy:.5,Tense:.25,Ethereal:.55,Hopeful:.35,Noir:.5,Drone:.2,Acid:.15,Italo:.15,'The Touch':.4,Breaks:.3,'Deep Space':.6};for(const m in HR)if(MOODS[m])MOODS[m].hr=HR[m];
 const PIT=new Set([3,4,6,8,9]);
 const _f76=fire;fire=function(k,w){if(!PIT.has(k))return _f76(k,w);const c=chordAt(w),o=XS;XS=(c&&c.x)||0;try{return _f76(k,w)}finally{XS=o}};
 const _p76=pad;pad=function(t,w,dur){const o=XS;XS=(PX.length===prog.length?PX[t]||0:0);try{return _p76(t,w,dur)}finally{XS=o}};
 const _g76=generate;generate=function(){PD=null;PPUSH=0;PX=[];return _g76.apply(this,arguments)}}
