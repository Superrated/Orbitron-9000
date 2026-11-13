
/* ---- v0.5: Launch uses the modern bass styles where they fit — Rolling techno in driving moods, Melodic pulse in melodic ones,
   Half-time / Slow pulse / Dub sub in slow and spacious ones, Reese in dark ones (Launch adds the Reese mid sound and a slow
   filter movement on the bass with a free LFO; by hand, pattern and sound stay separate). ---- */
{const W={Power:[.3,['Rolling techno']],'Groove Techno':[.25,['Rolling techno','Melodic pulse']],Dark:[.3,['Rolling techno','Reese']],Tense:[.25,['Reese','Rolling techno']],
  'Distorted Electro':[.2,['Reese']],Noir:[.3,['Reese','Dub sub','Half-time']],'Melodic House':[.25,['Melodic pulse','Slow pulse']],Melancholic:[.3,['Melodic pulse','Half-time']],
  Temporal:[.25,['Melodic pulse','Dub sub']],'Deep Space':[.3,['Dub sub','Half-time','Slow pulse']],Ambient:[.3,['Half-time','Slow pulse']],Drone:[.35,['Dub sub','Half-time']],
  Dreamy:[.25,['Slow pulse','Half-time']],Ethereal:[.3,['Half-time','Slow pulse']],Bleep:[.2,['Melodic pulse']],Vector:[.2,['Rolling techno']]};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const B=TR[6],w=W[curMood];if(!w||B.m||TR[4].p.mode==='Acid 303'||!window.bassStyle||R()>=w[0])return r;
   const st=pick(w[1]);bassStyle(st);
   if(st==='Reese'){const M=window.orbModern;if(M&&M.BASSP&&M.BASSP['Reese mid']&&R()<.7){Object.assign(B.p,M.BASSP['Reese mid']);G.bchar='Reese mid'}
    const F=LFOS.find(x=>!(x.d>0));if(F)Object.assign(F,{tg:'Bass cutoff',sh:0,sync:1,div:pick([64,128]),d:+(.25+R()*.15).toFixed(2),ph:0})}
   try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders();window.bassSync&&bassSync();if(typeof lfoUI==='function')lfoUI()}catch(e){}},0)}catch(e){console.warn('[orbitron] bass styles',e)}return r}}
