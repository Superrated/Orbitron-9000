
/* ---- v0.22: held bass. New Sustain fader on the bass (0 = the bass as before). With Sustain, a note blooms over Decay down to the
   Sustain level and holds until the next bass note (Gate shortens it); release follows Decay. The filter settles darker after the bloom.
   The bass still ducks under every kick, which gives the held notes their pump. While the bass holds, the sub drone steps back.
   Launch picks a held bass in calm moods only. ---- */
{const HELD={'Deep Space':.7,Ethereal:.7,Ambient:.6,Dreamy:.6,Drone:.6,Melancholic:.5,'Melodic House':.25};
 const _f=fire;fire=function(k){if(k===6){const B=TR[6],su=B.p.bsus||0;if(su<.05)return _f.apply(this,arguments);const o=B.lv;B.lv=o*Math.max(.3,.78-.5*Math.min(1,su));try{return _f.apply(this,arguments)}finally{B.lv=o}}
  if(k!==9||true)return _f.apply(this,arguments);const B=TR[6],S=TR[9],su=B.p.bsus||0;if(B.m||su<.05)return _f.apply(this,arguments);
  const o=S.lv;S.lv=o*Math.max(.3,1-.9*su);try{return _f.apply(this,arguments)}finally{S.lv=o}};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const B=TR[6],P=B.p,pr=HELD[curMood]||0;P.bsus=0;
  if(pr&&!(MOODS[curMood]||{}).acid&&R()<pr){P.bsus=+(.55+R()*.25).toFixed(2);P.bgt=pick([0,0,.9,1]);P.dec=+(.18+R()*.16).toFixed(2);P.bsl=pick([.15,.25]);P.bns='Melodic';
   P.blk='Free';P.bph=1;P.bgh=0;Object.assign(B,{st:16,h:pick([2,3,4]),r:2});B.pt=pat(B);P.cut=Math.round((P.cut||500)*.85)}}catch(e){}return r}}
