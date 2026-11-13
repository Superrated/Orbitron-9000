
/* v174: percussion tone per mood — Launch sets the hat, clap and ride sound to a kit that suits the mood (small variation each
   Launch). Only the existing faders are used: Hi-hat Decay/Tone/Open hat/Humanize/Metal, Clap Tone/Spread/Tail/Reverb/Body,
   Ride tone/decay/bell — so every value stays editable by hand. Patterns are not touched. */
{const K=(h,c,r)=>({h,c,r});
 // h: [tone, decay, metal, open, humanize]   c: [tone, spread ms, tail, reverb, body]   r: [ride tone, ride decay, ride bell]
 const KIT={
  Dark:K([7000,.035,.8,.1,.35],[1100,10,.3,.25,.2],[.85,1.4,.15]),
  Melancholic:K([9000,.04,.5,.15,.4],[1400,12,.35,.35,.15],[1,1.2,.3]),
  Dreamy:K([8500,.05,.3,.2,.5],[1600,14,.45,.45,.05],[1.05,1.6,.35]),
  Tense:K([10500,.025,.7,.08,.25],[1300,7,.18,.12,.25],[1.1,.9,.2]),
  Ethereal:K([11000,.06,.35,.25,.45],[1700,14,.5,.5,0],[1.2,1.8,.4]),
  Hopeful:K([9500,.045,.45,.3,.4],[1500,11,.3,.25,.3],[1.1,1.1,.35]),
  Noir:K([6500,.05,.55,.15,.5],[1200,12,.35,.4,.15],[.8,1.7,.5]),
  Drone:K([8000,.03,.6,.08,.3],[1000,10,.3,.45,.1],[.8,2,.2]),
  Acid:K([10000,.03,.7,.15,.3],[1400,9,.2,.15,.35],[1.15,1,.25]),
  Power:K([10500,.03,.9,.12,.2],[1250,8,.25,.2,.45],[1.2,1,.3]),
  Italo:K([9000,.04,.3,.2,.35],[1600,13,.25,.3,.1],[1.1,1.2,.2]),
  Breaks:K([9500,.06,.4,.2,.55],[1500,10,.2,.15,.2],[1.05,1.3,.4]),
  'Deep Space':K([8000,.05,.5,.12,.4],[1100,12,.5,.55,.05],[.9,2,.3]),
  Bleep:K([11500,.02,.5,.05,.2],[1700,6,.15,.1,.1],[1.25,.8,.15]),
  'Melodic House':K([9500,.045,.45,.25,.4],[1450,11,.32,.3,.25],[1.05,1.2,.3]),
  'Distorted Electro':K([11000,.03,.9,.1,.25],[1300,7,.2,.15,.3],[1.2,.9,.2]),
  Ambient:K([8000,.04,.3,.1,.5],[1500,14,.6,.6,0],[1,2.2,.4]),
  'Groove Techno':K([10000,.035,.85,.15,.3],[1300,8,.25,.2,.45],[1.2,1.1,.3]),
  Temporal:K([9500,.03,.85,.12,.3],[1300,8,.25,.2,.5],[1.15,1,.25]),
  Vector:K([9000,.04,.4,.18,.4],[1500,12,.3,.3,.15],[1.05,1.3,.35])};
 const RG=k=>{const o={};TR[k].x.forEach(x=>o[x[1]]=[x[2],x[3]]);return o},cl=(v,r)=>r?Math.max(r[0],Math.min(r[1],v)):v,j=(v,a=.06)=>v*(1-a+2*a*R());
 window.applyKit=m=>{const k=KIT[m];if(!k)return false;const H=TR[1].p,C=TR[2].p,P=TR[3].p,rh=RG(1),rc=RG(2),rp=RG(3);
  const[ht,hd,hm,ho,ha]=k.h,[ct,cs,ctl,cr,cb]=k.c,[rt,rd,rb]=k.r;
  Object.assign(H,{tone:cl(j(ht),rh.tone),dec:cl(j(hd,.1),rh.dec),metal:cl(j(hm,.08),rh.metal),open:cl(j(ho,.2),rh.open),acc:cl(j(ha,.15),rh.acc)});
  Object.assign(C,{tone:cl(j(ct),rc.tone),spread:cl(Math.round(j(cs,.1)),rc.spread),tail:cl(j(ctl,.1),rc.tail),rv:cl(j(cr,.12),rc.rv),body:cl(j(cb,.15),rc.body)});
  Object.assign(P,{rtn:cl(j(rt,.04),rp.rtn),rdc:cl(j(rd,.1),rp.rdc),rbl:cl(j(rb,.15),rp.rbl)});return true};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(applyKit(curMood)){build();setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}}catch(e){console.warn('[orbitron] kit',e)}return r};
 window.KIT=KIT}
