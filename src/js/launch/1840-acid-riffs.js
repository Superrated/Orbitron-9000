
/* ---- v0.27: ACID 303 RIFFS — instead of random notes, every Launch picks a riff in the style of the classic acid records
   (classic squelch, rolling octave squelch, dark sparse, melodic acid): notes, accents and slides belong together.
   Bars 1–3 play the riff, bar 4 answers an octave up at the end; every 8 bars one accent or note evolves, so it develops without losing the riff. ---- */
{const _=null,AT=[
  [[0,1,0],[0,0,0],[10,1,0],[0,0,0],[0,0,1],[2,0,0],[0,0,0],[10,1,0],[0,0,0],_,[6,0,1],[0,0,0],[3,1,0],_,[4,0,1],[0,0,0]],
  [[0,1,0],[0,0,1],[0,0,0],[10,1,0],[0,0,0],[0,0,1],[3,0,0],[0,1,0],[0,0,0],[0,0,1],[10,0,0],[6,1,0],[0,0,0],[4,0,1],[0,0,0],[10,1,0]],
  [[0,1,0],_,_,[0,0,1],[1,0,0],_,[0,1,0],_,_,[10,0,1],[0,0,0],_,[1,1,0],_,[0,0,1],_],
  [[0,0,0],[10,1,1],[0,0,0],[10,1,1],[0,0,0],[6,0,0],[10,1,1],[0,0,0],[0,0,0],[10,1,1],[0,0,0],[4,0,1],[3,1,0],[2,0,1],[0,0,0],[10,1,0]],
  [[0,1,0],[2,0,1],[4,0,0],[0,0,0],[6,1,0],[4,0,1],[2,0,0],[0,0,0],[0,1,0],[2,0,1],[4,0,0],[10,1,0],[6,0,1],[4,0,0],[2,0,1],[0,0,0]]];
 window.orbAcid={tpl:null};
 acidGen=function(p){const n=SC[G.scale].length,t=orbAcid.tpl||(orbAcid.tpl=pick(AT));AC.n=[];AC.a=[];AC.s=[];let last=0;
  for(let i=0;i<16;i++){const e=t[i];if(e){last=e[0]>=10?e[0]-10+n:e[0];AC.n.push(last);AC.a.push(e[1]);AC.s.push(e[2]&&(p.glide>=.1||i%4===3)?1:0)}else{AC.n.push(last);AC.a.push(0);AC.s.push(0)}}
  AC.key=G.scale+'|'+p.seed+'|'+p.glide.toFixed(2)+'|'+p.accp.toFixed(2)};
 acidNote=function(p){const s=((tk%16)+16)%16,n=SC[G.scale].length;if(AC.key!==G.scale+'|'+p.seed+'|'+p.glide.toFixed(2)+'|'+p.accp.toFixed(2))acidGen(p);
  const bar=Math.floor(tk/16);if(s===0&&bar>0&&bar%8===0&&AC.ev!==bar){AC.ev=bar;const i=pick([2,5,7,9,11,13,14]);if(R()<.5)AC.a[i]=AC.a[i]?0:1;else AC.n[i]=AC.n[i]>=n?AC.n[i]-n:AC.n[i]+n}
  let d=AC.n[s];if(bar%4===3&&s>=12&&d<n)d+=n;AC.last=s;return d};
 const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{const L=TR[4],P=L.p;if(P.mode==='Acid 303'&&!L.m){orbAcid.tpl=pick(AT);AC.key='';
   const pt=orbAcid.tpl.map(x=>x?1:0);L.st=16;try{const ft=bassFit(L,pt);Object.assign(L,{h:ft.h,r:ft.r,ten:ft.ten})}catch(e){}L.pt=pat(L);
   P.subosc=Math.max(P.subosc||0,.35);P.drv=Math.min(P.drv||0,.35);P.res=Math.min(P.res||8,12)}}catch(e){}return r}}
