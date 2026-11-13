/* ---- v0.4 interplay: parts make room for each other, and Launch keeps a little space in busy grooves. Everything lands on Rotate and
   the planet mutes, so it stays yours to change.
   · perc: when most of its hits land on the kick, it is rotated to the spot that clashes least with the kick and the lead
   · hats: a sparse hat that sits on the kick is moved to the off-beat
   · space: when more than 7 parts play (6 in the spacey moods), half the time one extra part (stab, satellite or snare) sits out ---- */
{const at=(T,s)=>{const p=T.pt||[];return p.length?!!p[s%p.length]:false};
 const hitsOn=(T,U,n)=>{let c=0,h=0;for(let s=0;s<n;s++)if(at(T,s)){h++;if(at(U,s))c++}return [c,h]};
 const SP={Ambient:1,'Deep Space':1,Ethereal:1,Dreamy:1,Drone:1};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const K=TR[0],P=TR[3],H=TR[1],L=TR[4],N=32;
  if(!K.m&&!P.m&&P.st&&P.h){const [c,h]=hitsOn(P,K,N);if(h&&c/h>.5){const r0=P.r||0;let best=r0,bs=1e9;
    for(let q=0;q<P.st;q++){P.r=q;P.pt=pat(P);const kc=hitsOn(P,K,N)[0],lc=(!L.m&&L.pt)?hitsOn(P,L,N)[0]:0,d=Math.min(Math.abs(q-r0),P.st-Math.abs(q-r0));const sc=kc*3+lc+d*.1+R()*.05;if(sc<bs){bs=sc;best=q}}
    P.r=best;P.pt=pat(P)}}
  if(!K.m&&!H.m&&H.st===16&&H.h&&H.h<=4){const [c,h]=hitsOn(H,K,16);if(h&&c/h>=.75){H.r=((H.r||0)+2)%16;H.pt=pat(H)}}
  const on=TR.filter(T=>!T.m).length,cap=SP[curMood]?6:7;
  if(on>cap&&R()<.5){for(const k of [8,9,7])if(TR[k]&&!TR[k].m){TR[k].m=true;break}}}catch(e){console.warn('[orbitron] interplay',e)}return r}}
