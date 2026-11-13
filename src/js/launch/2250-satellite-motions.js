
/* ---- v0.5: Launch sometimes gives Satellite one of the motions that follow the main parts (Double lead, Double bass, Echo hook, Last-note hold) ---- */
{const XL={'Melodic House':[.3,['Echo hook','Double lead','Last-note hold']],Hopeful:[.3,['Echo hook','Double lead']],Italo:[.3,['Double bass','Double lead','Echo hook']],
  Dreamy:[.3,['Last-note hold','Echo hook']],Melancholic:[.3,['Last-note hold','Echo hook']],Ethereal:[.3,['Last-note hold']],'Deep Space':[.25,['Last-note hold','Echo hook']],
  Ambient:[.3,['Last-note hold']],'Groove Techno':[.2,['Double bass','Echo hook']],Temporal:[.25,['Echo hook','Double bass']],Vector:[.2,['Double lead','Echo hook']],Breaks:[.2,['Double bass']]};
 const SN={'Double lead':['Glass bell','Mallet','FM pluck','Keys'],'Double bass':['Poly pulse','FM pluck','Keys'],'Echo hook':['FM pluck','Glass bell','Mallet','Keys'],'Last-note hold':['Strings','Super saw','Poly pulse']};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const S=TR[9],L=TR[4],x=XL[curMood];if(x&&R()<x[0]){let m=pick(x[1]);
   if(m!=='Double bass'&&(L.m||L.p.mode==='Acid 303'))m=TR[6].m?null:'Double bass';if(m==='Double bass'&&TR[6].m)m=null;
   if(m){Object.assign(S.p,{role:'Counter',mot:m,snd:pick(SN[m]),reg:'Auto',amt:+(.45+R()*.3).toFixed(2)});try{orbSatSdef(S.p)}catch(e){}S.m=false;S.lv=.4}}}catch(e){}return r}}
