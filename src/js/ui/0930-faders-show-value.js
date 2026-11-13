/* ---- v138: faders always show the real value — after a preset/patch/menu change, a Launch, a sector load or any automatic change ---- */
{const EXTRA={Steps:T=>T.st,Hits:T=>T.h,Rotate:T=>T.r,Tension:T=>T.ten,Level:T=>T.lv,'Gate (0 = Decay)':T=>T.p.bgt,Slide:T=>T.p.bsl,'Ghost notes':T=>T.p.bgh};
 let busy=null,busyT=0;
 document.addEventListener('pointerdown',e=>{const d=e.target.closest&&e.target.closest('.sl');if(d){busy=d;busyT=1e15}},true);
 document.addEventListener('pointerup',()=>{busyT=Date.now()+400},true);document.addEventListener('pointercancel',()=>{busyT=Date.now()+400},true);
 function syncCard(T){const card=T.mb&&T.mb.closest('.card');if(!card)return;
  card.querySelectorAll('.sl').forEach(d=>{if(d===busy&&Date.now()<busyT)return;const sp=d.firstChild;if(!sp||sp.tagName!=='SPAN'||!sp.firstChild)return;
   const l=sp.firstChild.textContent.trim(),x=(T.x||[]).find(x=>x[0]===l);let v=x?T.p[x[1]]:EXTRA[l]?EXTRA[l](T):undefined;if(typeof v!=='number'||!isFinite(v))return;
   const i=d.querySelector('input[type=range]'),b=sp.querySelector('b');if(!i||!b)return;if(d.dataset.lmin){const a=+d.dataset.lmin,z=+d.dataset.lmax,c=Math.max(a,Math.min(z,v)),u=Math.log(c/a)/Math.log(z/a);if(Math.abs(+i.value-u)>1e-3){i.value=u;b.textContent=Math.round(c)}return}const mn=+i.min,mx=+i.max,c=Math.max(mn,Math.min(mx,v));
   if(Math.abs(+i.value-c)>1e-9){i.value=c;const dec=(String(i.step).split('.')[1]||'').length;b.textContent=(+i.value).toFixed(dec)}})}
 const syncAll=()=>{try{TR.forEach(syncCard)}catch(e){}};window.syncFaders=syncAll;
 const soon=()=>{setTimeout(syncAll,0);setTimeout(syncAll,80)};
 ['#t-drums','#t-synth'].forEach(id=>{const c=document.querySelector(id);if(c){c.addEventListener('change',soon,true);c.addEventListener('click',e=>{if(e.target.closest('button'))soon()},true)}});
 const _gs=generate;generate=function(){const r=_gs.apply(this,arguments);soon();return r};
 UI.on(()=>{if(document.hidden)return;try{const d=$('#t-drums'),y=$('#t-synth');if(!isShown(d)&&!isShown(y))return;   /* v0.8: no card on screen (Flight, Mix …): nothing to do, no layout read */
  TR.forEach(T=>{const c=T.mb&&T.mb.closest('.card');if(c&&isShown(c))syncCard(T)})}catch(e){}})} /* v0.23: only cards on screen */

