/* ---- v43: Power lead = one fixed figure, max 6-step pattern, no progression ---- */
const _gen43=generate;generate=function(){_gen43();if(curMood!=='Power')return;const L=TR[4],P=L.p,st=pick([5,6]);
 Object.assign(L,{st,h:pick([1,2]),r:Math.floor(R()*st)});L.pt=pat(L);
 Object.assign(P,{mode:'Motif',len:st,dv:1,lock:1,range:1,spread:0,glide:0,hold:pick([4,5,6]),rel:1});
 G.pedal=true;buf=[];mot=[];mp=-1;build()};
