
/* ---- v0.26: PHRASE BASSLINES — a 2- or 4-bar riff written at Launch: motif (bar 1), variation (bar 2), the motif lifted with octave notes (bar 3),
   and an answer (bar 4) with pickup notes rolling into the next phrase. Notes sit on the chord root so the riff follows the chords;
   the note before a chord change approaches the new root by a step (or a semitone). Long and short notes alternate; every 8 bars one note
   evolves; it leaves room where the lead plays and only adds pickups where the lead rests. Notes menu → Phrase.
   Fine-tuned per mood (PRO): how much the line moves, octave lifts, chromatic approaches, long notes, 4-bar share, pickups, rhythm styles. ---- */
{const CT=new Set([0,2,4,7,-3]);
 const PRO={
  'Melodic House':{ch:.55,mv:.6,oct:.25,chr:.2,lng:.7,L4:.75,pk:[[14,15],[13,15]],sty:['Syncopated','Walking','Gallop'],lead:7},
  Melancholic:   {ch:.5, mv:.5,oct:.15,chr:.45,lng:.8,L4:.8,pk:[[15],[14,15]],sty:['Syncopated','Walking'],lead:7},
  Hopeful:       {ch:.45,mv:.55,oct:.3,chr:0,lng:.6,L4:.7,pk:[[14,15],[13,15]],sty:['Syncopated','Gallop','Walking'],lead:7},
  Dreamy:        {ch:.45,mv:.45,oct:.2,chr:.15,lng:.8,L4:.8,pk:[[15],[14,15]],sty:['Syncopated','Walking'],lead:6},
  Noir:          {ch:.45,mv:.45,oct:.1,chr:.7,lng:.6,L4:.75,pk:[[15],[13,15]],sty:['Syncopated','Walking'],lead:6},
  Italo:         {ch:.35,mv:.4,oct:.5,chr:0,lng:0,L4:.5,pk:[[14,15],[11,13,15]],sty:['Gallop','Disco run','Octave 8ths'],lead:9},
  Breaks:        {ch:.4, mv:.6,oct:.2,chr:.4,lng:.3,L4:.6,pk:[[13,15],[11,13,15]],sty:['Syncopated','Gallop'],lead:7},
  'Groove Techno':{ch:.35,mv:.3,oct:.15,chr:.5,lng:0,L4:.5,pk:[[15],[14,15]],sty:['Rolling 16ths','Syncopated'],lead:9}};
 const DEF={ch:0,mv:.5,oct:.2,chr:.3,lng:.5,L4:.65,pk:[[15],[14,15],[13,15]],sty:['Syncopated','Walking'],lead:7};
 const pro=()=>{const p=Object.assign({},DEF,PRO[curMood]||{});if(/Hook house/.test(G.flav||'')||G.mhFlav==='hook')Object.assign(p,{ch:.8,mv:.7,L4:.9});return p};
 const wpick=a=>{let t=a.reduce((x,y)=>x+y[1],0)*R();for(const[x,w]of a)if((t-=w)<0)return x;return a[0][0]};
 const clamp=d=>Math.max(-3,Math.min(9,d));
 // mv = how far the line moves: low mv stays on root/fifth (techno), high mv walks through chord and scale tones
 const step=(prev,mv)=>R()>mv?wpick([[0,3],[prev,2],[4,1]]):wpick([[prev-2,1],[prev-1,1.5],[prev+1,1.5],[prev+2,1],[0,1],[2,1],[4,1.5],[7,1]].map(([d,w])=>[clamp(d),CT.has(clamp(d))?w*1.6:w]));
 const half=(start,prev,P)=>{const a=[];for(let s=start;s<start+8;s++){let d;if(s===0)d=0;else if(s%4===0)d=wpick([[0,3],[4,1.2],[7,.6*P.mv],[prev,.6]]);else d=step(prev,P.mv);a.push({d,o:0});prev=d}return a}
 const motif=P=>{const a=half(0,0,P);a.push(...half(8,a[7].d,P));const lp=R()<P.lng?pick([0,0,8,4,10]):-1;a.forEach((e,s)=>{if(s===lp)e.l=1;else if(s%2===1&&R()<.5)e.s=1});return a}
 const cp=b=>b.map(e=>Object.assign({},e));
 const bphBuild=()=>{const P=pro(),oc=(Math.round(TR[6].p.oct)||1)>=2?0:P.oct,A=motif(P),L=R()<P.L4?4:2;   // no octave lifts when the bass already sits an octave up
  const A2=cp(A);half(8,A[7].d,P).forEach((e,i)=>{A2[8+i].d=e.d;A2[8+i].o=0});
  const A3=cp(A);A3.forEach((e,s)=>{if(s%4!==0&&R()<oc)e.o=1});
  const Bb=cp(A);let pv=A[7].d;for(let s=8;s<16;s++){const d=s>=14?pick(P.mv<.4?[0,4,7]:[4,7,2]):step(pv,P.mv);Bb[s].d=d;Bb[s].o=s%2&&R()<oc*.8?1:0;pv=d}
  window.BPH={bars:L===4?[A,A2,A3,Bb]:[A,Bb],pk:pick(P.pk),chr:R()<P.chr?1:0,lead:P.lead,evo:0};return window.BPH}
 window.orbBassPhrase=bphBuild;
 // slow evolution + pickups (arrStep runs once per 16th step)
 const _as=arrStep;arrStep=function(w){const r=_as.apply(this,arguments);try{const B=TR[6],P=B.p,H=window.BPH;if(!H||P.bns!=='Phrase'||!playing||B.m)return r;
   const s=((tk%16)+16)%16,bar=Math.floor(tk/16),L=H.bars.length,bi=((bar%L)+L)%L;
   if(s===0&&bar>0&&bar%8===0){const b=pick(H.bars),i=pick([1,2,3,5,6,7,9,10,11,13,14,15]);const e=b[i];if(R()<.25&&(Math.round(P.oct)||1)<2)e.o=e.o?0:1;else e.d=clamp(e.d+pick([-2,-1,1,2]));H.evo++}
   if(bi===L-1&&H.pk.includes(s)&&!B.pt[((tk%B.st)+B.st)%B.st]){const Ld=TR[4];if(!(!Ld.m&&Ld.pt[((tk%Ld.st)+Ld.st)%Ld.st])){const lv=B.lv;B.lv=lv*.75;try{fire(6,w)}finally{B.lv=lv}}}}catch(e){}return r};
 // lead-aware: off-16th bass notes step aside where a busy lead plays (8th off-beats stay: they carry the groove)
 const _f=fire;fire=function(k,w){if(k===6){const P=TR[6].p,H=window.BPH;if(P.bns==='Phrase'&&H){const s=((tk%16)+16)%16,Ld=TR[4];
   if(s%2===1&&!Ld.m&&Ld.h>=(H.lead||7)&&Ld.h/Ld.st<.75&&Ld.pt[((tk%Ld.st)+Ld.st)%Ld.st]&&Ld.p.mode!=='Acid 303')return}}return _f.apply(this,arguments)};
 // Launch: selected moods get a phrase bassline
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{if(window.__bphLock)return r;window.BPH=null;const B=TR[6],P=B.p,pf=pro();
   if(!B.m&&pf.ch&&!(MOODS[curMood]||{}).acid&&R()<pf.ch){
    // keep the rhythm the Launch chose when it already has room for a line (5+ hits on 16 steps); otherwise pick a mood style
    if(!(B.st===16&&B.h>=5&&B.h<=12)||P.bsus>.01){try{bassStyle(pick(pf.sty))}catch(e){}}
    Object.assign(P,{bns:'Phrase',bsus:0,btn:false,bph:1,bgh:0});P.bsl=Math.min(.3,Math.max(P.bsl||0,.12));
    if(G.bavoid&&P.bsty!=='Rolling 16ths'&&P.bsty!=='Off-beat'){G.bavoid=false;G.bavStrict=false}   // the riff's roots land with the kick
    bphBuild();
    setTimeout(()=>{try{window.bassSync&&bassSync()}catch(e){}},300);setTimeout(()=>{try{if(typeof say==='function')say('♪ BASS PHRASE · '+(window.BPH.bars.length)+' BARS')}catch(e){}},700)}}catch(e){}return r}}

