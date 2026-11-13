
/* ---- v0.5: MAX Q — cleaner and more varied. Less mud and heat: rumble, bus clip, grit and reverb are capped a little lower, the pad sits ~2 dB down
   the master cuts a bit more around 260 Hz, and the kick is a little less driven and shorter. More variety: sometimes a short techno lead (stab-like Motif) and sometimes a second chord
   in the progression instead of one chord all the way. ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(curMood!=='Power')return r;
  G.rumble=Math.min(+G.rumble||0,.3);G.clip=Math.min(+G.clip||0,.46);G.bgrit=Math.min(+G.bgrit||0,.27);G.rev=Math.min(+G.rev||0,.24);
  if(!TR[5].m)TR[5].lv=+((TR[5].lv||.5)*.8).toFixed(3);
  {const K=TR[0].p;K.drive=Math.min(+K.drive||0,2.5);K.dec=Math.min(+K.dec||.4,.32)}   // the kick was the main source of mud (driven, long body)
  if(R()<.4){const np=pick([[0,0,1,0],[0,0,5,0],[0,0,6,0],[0,0,0,1],[0,3,0,3],[0,0,3,0]]),s0=pshape[0],x0=(typeof PX!=='undefined'&&PX)?PX[0]:undefined;prog=np.slice();pshape=prog.map(()=>s0);if(typeof PX!=='undefined'&&Array.isArray(PX)){PX.length=0;prog.forEach(()=>PX.push(x0))}if(typeof PD!=='undefined')PD=null}
  const L=TR[4];if(L.m&&R()<.5){const ok=['Hypno stab','FM stab','Techno stab','Hard sync','Metal FM'].filter(n=>LPRE[n]);if(ok.length){applyLP(pick(ok),1);L.m=false;L.p.mode='Motif';
   Object.assign(L,{st:16,h:pick([3,4,5]),r:pick([0,2,3]),ten:0});L.pt=pat(L);L.p.range=1;L.p.len=pick([3,4]);L.lv=Math.min(L.lv||.45,.42);mot=[];mp=-1;buf=[];if(window.orbRiff)orbRiff.t=null}}
  try{build()}catch(e){}setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}catch(e){console.warn('[orbitron] max q',e)}return r}}
