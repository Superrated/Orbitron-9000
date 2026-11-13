
/* ---- v0.26: card rebuilds are live again (two internal helpers were accidentally named build/ensure and had replaced the global ones).
   To keep that smooth: cards are only rebuilt while the Drums or Synths page is showing (otherwise when you open it), never while a finger
   is on the screen, and the scroll position is kept. ---- */
{let down=0,pend=0;const vis=()=>['#t-drums','#t-synth'].some(q=>{const e=document.querySelector(q);return e&&!e.hidden});
 BUILD.hooks.push({pre(){if(down||!vis()){pend=1;return false}return window.scrollY},post(y){setTimeout(()=>{if(Math.abs(window.scrollY-y)>2)window.scrollTo(0,y)},0)}});
 document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#t-drums,#t-synth'))down=1},true);
 const up=()=>{if(!down)return;down=0;if(pend&&vis()){pend=0;setTimeout(()=>build(),0)}};['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,up,true));
 document.addEventListener('click',()=>setTimeout(()=>{if(pend&&!down&&vis()){pend=0;build()}},0),true)}
