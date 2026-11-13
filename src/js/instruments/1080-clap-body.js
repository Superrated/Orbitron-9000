/* ---- v155: clap Body — a short tuned thump under the clap; some moods get a bit by default ---- */
{const BODY={'Groove Techno':.45,Temporal:.5,'Distorted Electro':.5,Italo:.35,Breaks:.3,Power:.4,Tense:.3,Dark:.25,Vector:.2,'Melodic House':.2};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{TR[2].p.body=BODY[curMood]||0;window.syncFaders&&setTimeout(syncFaders,0)}catch(e){}return r}}

