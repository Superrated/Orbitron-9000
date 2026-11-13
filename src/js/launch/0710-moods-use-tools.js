/* ---- v88: moods now use the newer sound-shaping tools on each Launch — drum tension / accent / ghosts / variation, bassline lock / gate / slide / ghosts / phrase / drive / square, and a second LFO on the new targets (tape wobble, shimmer, pad cutoff, hat decay, stab echo, resonances, detune) ---- */
{const rr=v=>Array.isArray(v)?(v.length===2&&typeof v[0]==='number'&&typeof v[1]==='number'?+(v[0]+R()*(v[1]-v[0])).toFixed(2):pick(v)):v;
 const SP={
  Dark:{d:{0:{acc:.3,vari:.2},1:{acc:.5,gho:.2,vari:.3,ten:[0,.2]},3:{ten:[.2,.5],vari:.4}},b:{blk:['Around kick','Rolling','Free'],bgt:[.3,.6],bsl:[0,.2],bgh:[0,.3],bph:[1,2],bdrv:[.1,.3]},l:['Tape wobble','Hat decay','Stab echo']},
  Melancholic:{d:{1:{acc:.6,gho:.15,vari:.25},2:{gho:.15}},b:{blk:['Free','Offbeats'],bgt:[.5,.8],bsl:[0,.15],bph:[2,4]},l:['Pad cutoff','Shimmer','Lead detune']},
  Dreamy:{d:{1:{acc:.5,gho:.3,vari:.3,ten:[0,.15]},3:{ten:[.2,.4]}},b:{blk:['Free','Offbeats'],bgt:[.6,.9],bsl:[.1,.3],bgh:[.1,.3],bph:[2,4]},l:['Shimmer','Pad cutoff','Tape wobble']},
  Tense:{d:{0:{acc:.2},1:{acc:.7,vari:.4},3:{ten:[.4,.7],vari:.5}},b:{blk:['Kick lock','Rolling','Around kick'],bgt:[.2,.4],bdrv:[.2,.5],sqm:[0,.4]},l:['Lead cutoff','Hat decay','Tape wobble']},
  Ethereal:{d:{1:{acc:.4,gho:.2},3:{ten:[.3,.6]}},b:{blk:['Free'],bgt:[.7,1],bsl:[.2,.4],bph:[4]},l:['Shimmer','Pad cutoff']},
  Hopeful:{d:{1:{acc:.6,gho:.2,vari:.25},2:{gho:.2,vari:.2}},b:{blk:['Offbeats','Free'],bgt:[.4,.6],bph:[2,4]},l:['Pad cutoff','Stab echo']},
  Noir:{d:{1:{acc:.4,gho:.25,vari:.3,ten:[.1,.3]},7:{gho:.3,vari:.3}},b:{blk:['Free','Around kick'],bgt:[.4,.7],bsl:[.1,.3],bgh:[.2,.4],bph:[2,4]},l:['Tape wobble','Stab echo']},
  Drone:{d:{1:{vari:.3},3:{ten:[.3,.6]}},b:{blk:['Free'],bgt:[.8,1],bph:[4]},l:['Tape wobble','Shimmer']},
  Acid:{d:{1:{acc:.7,gho:.2,vari:.3}},b:{blk:['Free','Rolling'],bsl:[.3,.6],bgt:[.3,.5],bgh:[.1,.3],bdrv:[.2,.5],sqm:[0,.5]},l:['Bass cutoff','Lead cutoff']},
  Power:{d:{0:{vari:.2},1:{acc:.6,vari:.3}},b:{blk:['Rolling','Kick lock','Around kick'],bgt:[.2,.4],bdrv:[.3,.6]},l:['Hat decay']},
  Italo:{d:{1:{acc:.5,gho:.1},2:{vari:.2}},b:{bgt:[.5,.7],sqm:[0,.3]},l:['Lead detune','Pad cutoff']},
  Breaks:{d:null,b:{bgt:[.4,.7],bsl:[.1,.3],bgh:[.2,.4]},l:['Hat decay','Stab echo','Tape wobble']},
  'Deep Space':{d:{1:{gho:.2,vari:.3},3:{ten:[.4,.8]}},b:{blk:['Free'],bgt:[.8,1],bsl:[.2,.4],bph:[4]},l:['Shimmer','Tape wobble']},
  Bleep:{d:null,b:null,l:['Hat decay','Tape wobble']},'Melodic House':{d:null,b:null,l:['Tape wobble','Pad cutoff']},'Distorted Electro':{d:null,b:null,l:['Bass cutoff','Hat decay']},Ambient:{d:null,b:null,l:['Pad cutoff','Tape wobble']},'Groove Techno':{d:null,b:null,l:['Hat tone','Hat decay']},Temporal:{d:null,b:null,l:['Hat tone','Hat decay']},Vector:{d:null,b:null,l:['Tape wobble','Pad cutoff']}};
 const _g88=generate;generate=function(){_g88();const S=SP[curMood];if(!S)return;
  if(S.d)for(const k in S.d){const T=TR[k];if(!T)continue;let ch=false;for(const f in S.d[k])if(R()<.75){T[f]=rr(S.d[k][f]);ch=true}if(ch&&'ten'in S.d[k])T.pt=pat(T)}
  if(S.b){const P=TR[6].p;for(const f in S.b)if(R()<.7)P[f]=rr(S.b[f]);if(P.bph)P.bph=Math.round(P.bph)}
  LFOS.forEach(L=>{if(L.d>0&&!LF_V.includes(L.tg)&&!LF_P.includes(L.tg)){L.tg=pick(S.l)}});
  const L2=LFOS[1];if(L2&&!(L2.d>0)&&R()<.7){let tg=pick(S.l);if(tg==='Shimmer'&&!(G.shim>.05))tg=pick(['Pad cutoff','Tape wobble']);Object.assign(L2,{tg,sh:pick([0,0,1,5]),sync:1,div:pick([16,32,64]),d:+(.2+R()*.25).toFixed(2),ph:0});if(typeof lfoUI==='function')lfoUI()}
  build()}}
