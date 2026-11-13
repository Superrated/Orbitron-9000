
/* ---- v0.35: LFO cycles start on bar 1 of a Launch. Synced LFOs count their cycle from the bar where the last Launch landed, so a
   16-, 32- or 64-bar sweep lines up with the phrases that follow. LFOs 1 and 2 now also go to 32 and 64 bars. ---- */
{const _g=generate;generate=function(){const r=_g.apply(this,arguments);try{window.LF0=playing?Math.floor(tk/16)*16:0}catch(e){}return r};
 const _t=toggle;toggle=function(){const r=_t.apply(this,arguments);try{if(!playing)window.LF0=0}catch(e){}return r};try{$('#play').onclick=toggle}catch(e){}}
