
/* ---- v0.5: LONG BASS ON LAUNCH — in Ambient, Deep Space, Dreamy, Melodic House and Noir a Launch sometimes gives the bass one of the two
   long styles: "Held" (one note per bar, held, following the chords) or "Held, syncopated" (notes on steps 1, 7, 12 and 15, each held until
   the next; the one on 15 already plays the next chord when the chord changes). ---- */
{const W={Ambient:[.48,.7],'Deep Space':[.42,.5],Dreamy:[.42,.5],'Melodic House':[.36,.35],Noir:[.36,.5]};   // [chance, share of plain Held]
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const w=W[curMood],B=TR[6];
   if(w&&!B.m&&TR[4].p.mode!=='Acid 303'&&R()<w[0]&&window.bassStyle){bassStyle(R()<w[1]?'Held':'Held, syncopated');try{build()}catch(e){}}
   const fc=FAN[curMood];if(fc&&!B.m&&R()<fc[0]){B.p.bfan=+(fc[1]+R()*(fc[2]-fc[1])).toFixed(2);try{window.syncFaders&&syncFaders()}catch(e){}}
   /* v0.5 BOUNCY BASS: now and then a busy, hooky, bouncing bassline — syncopated rhythm around the kick, Fancy notes, octave jumps,
      and a short, round, slightly resonant sound */
   const bc=BOUNCY[curMood];if(bc&&!B.m&&TR[4].p.mode!=='Acid 303'&&!/^Held/.test(B.p.bsty||'')&&R()<bc&&window.bassStyle){
    bassStyle('Bouncy');if(R()<.6){const M=window.orbModern;if(M&&M.BASSP&&M.BASSP.Rubber){Object.assign(B.p,M.BASSP.Rubber);G.bchar='Rubber'}}   // Launch: often a short, round, resonant sound with it
    try{build()}catch(e){}try{window.syncFaders&&syncFaders();window.bassSync&&bassSync()}catch(e){}}}catch(e){}return r}}
const BOUNCY={'Melodic House':.32,'Groove Techno':.2,Italo:.32,Breaks:.2,Hopeful:.2,Bleep:.2};   /* v0.5: chance per Launch */
/* v0.5: Launch gives the bass some Fancy notes in groovy moods: [chance, min, max] */
const FAN={'Melodic House':[.55,.2,.45],'Groove Techno':[.42,.15,.4],Italo:[.6,.25,.5],Breaks:[.55,.2,.5],Hopeful:[.42,.15,.35],Power:[.36,.15,.35],'Deep Space':[.3,.1,.3],Dreamy:[.3,.1,.3],Bleep:[.36,.15,.35]};
