
/* ---- v0.36: the +1 octave thruster lifts the stab as well as the lead (the satellite already followed it) while held ---- */
{const up=fn=>function(){const o=OCT,go=G.oct,u=G.ldUp||0;if(!u)return fn.apply(this,arguments);OCT=o+u;G.oct=(go||0)+u;try{return fn.apply(this,arguments)}finally{OCT=o;G.oct=go}};stab=up(stab); /* the satellite already follows the octave pad (its notes add G.ldUp) */
 setTimeout(()=>{try{document.querySelectorAll('#t-perf .pad').forEach(b=>{if(/^\+1 octave/.test(b.textContent))b.title='Hold: lead, stab and satellite play one octave higher'})}catch(e){}},1500)}
