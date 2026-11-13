
/* ---- v0.26: WHOLE-GROOVE SCORE + MUD/BRIGHTNESS BUDGET — after every Launch the finished groove is measured as a whole:
   density (notes per bar, melodic layers), interlock (bass on the kick, lead on the bass), mud (parts crowding 150–500 Hz) and
   brightness (parts crowding the top). Priority is a clean, playable groove: the weakest area is fixed once, with the gentlest move
   that solves it (darken or lift a part, step a layer back, move bass or lead off the kick). orbGroove.score() shows the numbers. ---- */
{const on=k=>{const T=TR[k];return T&&!T.m&&(T.pad||T.h>0)};
 const hits=k=>{const T=TR[k];if(!on(k)||T.pad)return 0;return T.h*16/Math.max(1,T.st)};
 const at=(k,s)=>{const T=TR[k];return on(k)&&!T.pad&&!!T.pt[((s%T.st)+T.st)%T.st]};
 const lg=(f,lo,hi)=>Math.max(0,Math.min(1,Math.log(f/lo)/Math.log(hi/lo)));
 function score(){const L=TR[4].p,PD=TR[5].p,B=TR[6].p,ST=TR[8].p,SA=TR[9].p,H=TR[1].p,acid=L.mode==='Acid 303';
  const notes=[0,1,2,3,4,6,7,8,9].reduce((a,k)=>a+hits(k),0),mel=[4,5,8,9].filter(on).length+(B.bns==='Phrase'&&on(6)?1:0);
  let kb=0,bn=0,lb=0,ln=0;for(let s=0;s<16;s++){if(at(6,s)){bn++;if(at(0,s)&&s%16!==0)kb++}if(at(4,s)){ln++;if(at(6,s))lb++}}
  const avoid=G.bavoid||B.bns==='Phrase'||['Off-beat','Rolling 16ths','Octave bounce','Pedal'].includes(B.bsty),kick=bn?kb/bn:0,lead=ln?lb/ln:0;
  // mud: energy in 150–500 Hz, from how open each low-mid part is and how much it plays
  const padLow=on(5)?(1-Math.min(1,((Math.round(PD.oct)||2)-1)/2))*lg(PD.cut||800,300,3000)*(TR[5].lv||.5)*2:0;
  const bassMud=on(6)?lg((B.cut||500)*(1+(B.envA||2)*.25),300,2500)*(TR[6].lv||.6)*1.4:0;
  const leadMud=on(4)&&!acid?(1-Math.min(1,leadOct(L)/2))*((Math.round(L.range)||1)<=1?1:.6)*lg(L.cut||800,250,2500)*(TR[4].lv||.5)*1.2:0;
  const satMud=on(9)&&SA.role==='Counter'?(orbSatellite.regOct(SA)<=2?.6:.25)*(TR[9].lv||.4):0;
  const mud=padLow+bassMud+leadMud+satMud;
  // brightness: parts crowding the top end
  const br=(on(4)&&!acid?lg(L.cut||800,1200,9000)*(TR[4].lv||.5)*1.5:0)+(on(5)?lg(PD.cut||800,1200,6000)*(TR[5].lv||.5):0)+(on(8)?lg(ST.cut||900,1500,6000)*(TR[8].lv||.35):0)
   +(on(1)?lg(H.tone||7500,6000,12000)*Math.min(1,hits(1)/8)*.6:0)+(on(9)?(SA.role==='Sparkle'?.35:.15)*(.5+(SA.tone||.5)):0);
  return {notes:+notes.toFixed(1),mel,kick:+kick.toFixed(2),avoid,lead:+lead.toFixed(2),mud:+mud.toFixed(2),bright:+br.toFixed(2),parts:{padLow:+padLow.toFixed(2),bassMud:+bassMud.toFixed(2),leadMud:+leadMud.toFixed(2),satMud:+satMud.toFixed(2)}}}
 window.orbGroove={score,fixes:[]};
 window.orbGroove.limits={notes:44,mel:3,kick:.35,lead:.7,mud:.85,bright:.7};   // set from 300 Launches across all moods: about the worst 10–15 % get a fix
 const fix=()=>{const S=score(),Lm=orbGroove.limits,P=TR[5].p,B=TR[6].p,L=TR[4].p,f=[];
  // how far over each limit (0 = fine); the worst one is fixed
  const over={notes:S.notes/Lm.notes-1,mel:(S.mel-Lm.mel)/Lm.mel,kick:S.avoid?0:(S.kick-Lm.kick)/Lm.kick,lead:(S.lead-Lm.lead)/Lm.lead,mud:S.mud/Lm.mud-1,bright:S.bright/Lm.bright-1};
  const worst=Object.entries(over).sort((a,b)=>b[1]-a[1])[0];if(!worst||worst[1]<=0)return [];
  const w=worst[0];
  if(w==='mud'){const p=S.parts,top=Object.entries(p).sort((a,b)=>b[1]-a[1])[0][0];
   if(top==='padLow'){if((Math.round(P.oct)||2)<3&&R()<.5){P.oct=(Math.round(P.oct)||2)+1;f.push('pad up an octave')}else{P.cut=Math.round((P.cut||800)*.7);f.push('pad darker')}}
   else if(top==='bassMud'){B.cut=Math.round((B.cut||500)*.75);B.envA=+((B.envA||2)*.8).toFixed(2);f.push('bass tighter')}
   else if(top==='leadMud'){if((L.loct||0)<1){L.loct=(L.loct||0)+1;f.push('lead up an octave')}else{L.cut=Math.round((L.cut||800)*.75);f.push('lead darker')}}
   else{TR[9].p.reg='High';f.push('satellite higher')}}
  else if(w==='bright'){const c=[[4,TR[4].p.cut||0],[5,(TR[5].p.cut||0)*.8],[8,(TR[8].p.cut||0)*.7]].filter(([k])=>on(k)&&!(k===4&&L.mode==='Acid 303')).sort((a,b)=>b[1]-a[1]);
   if(c.length){const k=c[0][0];TR[k].p.cut=Math.round(TR[k].p.cut*.72);f.push(({4:'lead',5:'pad',8:'stab'})[k]+' darker')}else if(on(9)){TR[9].p.tone=+(TR[9].p.tone*.7).toFixed(2);f.push('satellite darker')}}
  else if(w==='mel'||w==='notes'){if(on(8)){TR[8].m=true;f.push('dub stab rests')}else if(on(9)){TR[9].m=true;f.push('satellite rests')}else if(on(3)){TR[3].m=true;f.push('perc rests')}else if(on(1)&&TR[1].h>8){TR[1].h=Math.round(TR[1].h*.6);TR[1].pt=pat(TR[1]);f.push('fewer hats')}}
  else if(w==='kick'){G.bavoid=true;G.bavStrict=false;f.push('bass steps off the kick')}
  else if(w==='lead'){try{window.orbQuality&&orbQuality.bestRotation&&orbQuality.bestRotation()}catch(e){}const T=TR[4];if(score().lead>Lm.lead){T.r=(T.r+1)%T.st;T.pt=pat(T)}f.push('lead moved off the bass')}
  return f};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const f=fix();orbGroove.fixes=f;orbGroove.last=score();
   if(f.length){setTimeout(()=>{try{window.syncFaders&&syncFaders()}catch(e){}},50)}}catch(e){}return r}}
