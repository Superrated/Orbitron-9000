
/* ---- v0.35: more per-note LFO targets — Hat/Perc/Lead accent (each note louder or softer), Hat/Perc/Lead pan (each note placed
   somewhere else in the stereo field), Perc pitch (scale steps up or down) and Perc FM (woody ↔ metallic). Read once per note. ---- */
{const ACC={1:'Hat accent',3:'Perc accent',4:'Lead accent'},PAN={3:'Perc pan',4:'Lead pan'};
 const _f=fire;fire=function(k,w){const a=ACC[k],p=PAN[k];if(!a&&!p)return _f(k,w);const T=TR[k],lv=T.lv,pn=T.pan;
  try{if(a){const s=mv(a,w);if(s)T.lv=lv*Math.max(.3,s>=0?1+.35*s:1+.7*s)}
   if(p){const s=mv(p,w);if(s)T.pan=Math.max(-1,Math.min(1,(+pn||0)+.85*s))}}catch(e){}
  try{return _f(k,w)}finally{T.lv=lv;T.pan=pn}}}
