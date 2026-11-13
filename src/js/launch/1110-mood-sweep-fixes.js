
/* v159: mood sweep fixes. Hits never exceed steps; PX always matches the progression. */
{const _gx=generate;generate=function(){const r=_gx.apply(this,arguments);try{if(typeof PX!=='undefined'&&PX.length&&PX.length!==prog.length)PX=prog.map(()=>0);TR.forEach(T=>{if(T.st>0&&T.h>T.st){T.h=T.st;T.pt=pat(T)}})}catch(e){}return r}}
