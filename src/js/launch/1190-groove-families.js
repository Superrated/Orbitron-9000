
/* v167: groove families — not every Launch is four-on-the-floor. Each mood may pick a syncopated or broken drum family that suits it
   (electro, two-step, broken techno, skipping four, halftime, clave perc), built entirely from the normal sequencer settings:
   Steps, Hits, Rotate, Tension, Accent, Ghosts and Variation — so every groove stays editable with the usual faders. "Now:" names it. */
{const pk=a=>a[Math.floor(R()*a.length)],rn=(a,b)=>a+R()*(b-a);
 // each entry: [steps, hits, rotate, tension, accent, ghosts, variation]  (null fields keep the current value)
 const FAM={
  'electro':{k:[[16,3,0,0,.3,0,.2],[16,5,0,.1,.35,0,.2],[16,3,0,.2,.3,.15,.3]],b:[[16,2,4,0,0,0,.3]],h:[[16,11,1,0,.4,0,.3],[16,13,1,0,.4,0,.2]]},
  'two-step':{k:[[16,2,0,.35,.2,.2,.3],[16,3,0,.25,.2,.15,.3]],b:[[16,2,4,0,0,0,.2]],h:[[16,4,2,0,.2,.35,.3],[16,6,2,.15,.3,.3,.3]]},
  'broken techno':{k:[[16,4,0,.4,.35,.15,.35],[16,5,0,.2,.35,.1,.3],[16,4,0,.5,.3,.1,.4]],b:[[16,2,4,.15,0,0,.3],[16,3,4,.2,.2,0,.3]]},
  'skipping four':{k:[[16,4,0,0,.25,.4,.45],[16,4,0,0,.2,.3,.6]]},
  'halftime':{k:[[16,2,0,.2,.2,.15,.3],[16,3,0,.3,.25,.1,.3]],b:[[16,1,8,0,0,.2,.4]],h:[[16,8,0,0,.4,.25,.3],[16,6,0,.25,.4,.2,.3]]},
  'clave perc':{p:[[16,3,0,0,.3,.15,.3],[16,5,0,0,.3,.1,.3],[12,5,0,0,.3,.1,.2],[16,7,2,.15,.35,.1,.3]]}};
 const MM={Dark:[.35,'broken techno','skipping four'],Tense:[.4,'broken techno','skipping four','electro'],Power:[.3,'skipping four','broken techno'],
  'Groove Techno':[.35,'skipping four','broken techno','clave perc'],Temporal:[.35,'skipping four','clave perc'],Acid:[.4,'electro','broken techno','skipping four'],
  'Distorted Electro':[.55,'electro','broken techno'],Vector:[.45,'two-step','electro','broken techno'],Italo:[.3,'electro','skipping four'],
  Bleep:[.45,'electro','two-step','broken techno'],'Melodic House':[.35,'two-step','skipping four','clave perc'],Hopeful:[.35,'two-step','clave perc'],
  Melancholic:[.35,'two-step','broken techno'],Dreamy:[.4,'two-step','halftime'],Ethereal:[.4,'halftime','two-step'],Noir:[.45,'halftime','broken techno'],
  'Deep Space':[.45,'halftime','broken techno'],Drone:[.3,'halftime','clave perc'],Breaks:[.5,'electro','halftime','broken techno']};
 const put=(k,a)=>{const T=TR[k],[st,h,r,ten,acc,gho,vari]=a;T.st=st;T.h=Math.min(h,st);T.r=r%st;T.ten=ten;T.tsd=1+Math.floor(R()*997);
  if(acc!=null)T.acc=acc;if(gho!=null)T.gho=gho;if(vari!=null)T.vari=vari;T.pt=pat(T)};
 window.grooveFamily=(name)=>{const F=FAM[name];if(!F)return false;
  if(F.k&&!TR[0].m)put(0,pk(F.k));
  if(F.b){const bk=!TR[2].m?2:!TR[7].m?7:2;put(bk,pk(F.b))}
  if(F.h&&!TR[1].m&&R()<.75)put(1,pk(F.h));
  if(F.p){TR[3].m=false;put(3,pk(F.p))}
  G.dfeel=name;return true};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);G.dfeel=null;try{const mx=(window.MOODX&&MOODX[curMood]||{}),m='grv' in mx?mx.grv:MM[curMood];if(m&&R()<m[0]){grooveFamily(pk(m.slice(1)));build();setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},0)}}catch(e){console.warn('[orbitron] groove',e)}return r}}
